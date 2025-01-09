import { LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { useState } from "react";
import Navigation from "~/components/Layout";
import Notification from "~/components/Notification";
import RepliesTable from "~/components/RepliesTable";
import ResponsesFilters from "~/components/ResponsesFilters";
import { fetchCurrentUser, fetchReplies } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("No token found");
  }
  const user = await fetchCurrentUser(token);
  console.log(user);
  if (user.rol !== "admin") {
    throw new Error("You don't have permission");
  }
  const url = new URL(request.url);
  const comment = url.searchParams.get("comment")?.toLowerCase() || "";
  const userName = url.searchParams.get("user")?.toLowerCase() || "";
  const response = url.searchParams.get("response")?.toLowerCase() || "";
  try {
    const replies = await fetchReplies(token);
    const filteredReplies = replies.data.filter((reply: { comment: { content: string }; user: { name: string }; response: string }) => {
      const matchesTitle =
        !comment || reply.comment.content.toLowerCase().includes(comment);
      const matchesUser =
        !userName || reply.user.name.toLowerCase().includes(userName);
      const matchesContent =
        !response || reply.response.toLowerCase().includes(response);
      return matchesTitle && matchesUser && matchesContent;
    });
    return json({ replies: filteredReplies });
  } catch (error) {
    throw new Error("Error fetching the response");
  }
}

type LoaderData = {
  replies: Array<{
    comment: { content: string };
    user: { name: string };
    response: string;
  }>;
};

export default function AdminReplies() {
  const { replies } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  const [comment, setComment] = useState("");
  const [user, setUser] = useState("");
  const [response, setResponse] = useState("");

  const navigate = useNavigate();

  const updateUrlWithFilters = (
    newComment: string,
    newUser: string,
    newResponse: string
  ) => {
    const params = new URLSearchParams();
    if (newComment) params.set("comment", newComment);
    if (newUser) params.set("user", newUser);
    if (newResponse) params.set("response", newResponse);
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
    updateUrlWithFilters(newComment, user, response);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUser = e.target.value;
    setUser(newUser);
    updateUrlWithFilters(comment, newUser, response);
  };

  const handleResponseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newResponse = e.target.value;
    setResponse(newResponse);
    updateUrlWithFilters(comment, user, newResponse);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <h1 className="text-4xl font-extrabold p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Replies
      </h1>
      <ResponsesFilters
        comment={comment}
        user={user}
        response={response}
        onCommentChange={handleCommentChange}
        onUserChange={handleUserChange}
        onResponseChange={handleResponseChange}
        onSearch={handleSearch}
      />
      <Notification
        successMessage={successMessage ?? undefined}
        errorMessage={errorMessage ?? undefined}
      />
      {replies.length === 0 ? (
        <p>No replies available.</p>
      ) : (
        <RepliesTable replies={replies} />
      )}
      <Outlet />
    </div>
  );
}
