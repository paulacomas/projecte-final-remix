import { LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  useLoaderData,
  useSearchParams,
  useNavigate,
  Outlet,
} from "@remix-run/react";
import { useState } from "react";
import CommentsTable from "~/components/CommentsTable";
import Navigation from "~/components/Layout";
import Notification from "~/components/Notification";
import { fetchComments, fetchCurrentUser } from "~/data/data";
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import CommentFilters from "~/components/CommentFilters";


export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await getAuthTokenFromCookie(cookieHeader);
  if (!token) {
    throw new Error("No token found");
  }
  const user = await fetchCurrentUser(token);
  if (user.rol !== "admin") {
    throw new Error("You don't have permission");
  }

  const url = new URL(request.url);
  const title = url.searchParams.get("title")?.toLowerCase() || "";
  const userName = url.searchParams.get("user")?.toLowerCase() || "";
  const content = url.searchParams.get("content")?.toLowerCase() || "";

  try {
    const comments = await fetchComments(token);

    const filteredComments = comments.data.filter(
      (comment: {
        book: { title: string };
        user: { name: string };
        content: string;
      }) => {
        const matchesTitle =
          !title || comment.book.title.toLowerCase().includes(title);
        const matchesUser =
          !userName || comment.user.name.toLowerCase().includes(userName);
        const matchesContent =
          !content || comment.content.toLowerCase().includes(content);
        return matchesTitle && matchesUser && matchesContent;
      }
    );

    return json({ comments: filteredComments });
  } catch (error) {
    throw new Error("Error loading comments");
  }
}

export default function AdminComments() {
  const { comments } = useLoaderData<{
    comments: Array<{
      id: string;
      book: { title: string };
      user: { name: string };
      content: string;
    }>;
  }>();
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const updateUrlWithFilters = (
    newTitle: string,
    newUser: string,
    newContent: string
  ) => {
    const params = new URLSearchParams();
    if (newTitle) params.set("title", newTitle);
    if (newUser) params.set("user", newUser);
    if (newContent) params.set("content", newContent);
    navigate(`?${params.toString()}`);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateUrlWithFilters(newTitle, user, content);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUser = e.target.value;
    setUser(newUser);
    updateUrlWithFilters(title, newUser, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateUrlWithFilters(title, user, newContent);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <h1 className="text-4xl font-extrabold p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Comments
      </h1>

      <CommentFilters
        title={title}
        user={user}
        content={content}
        onTitleChange={handleTitleChange}
        onUserChange={handleUserChange}
        onContentChange={handleContentChange}
        onSearch={handleSearch}
      />

      <Notification
        successMessage={successMessage ?? undefined}
        errorMessage={errorMessage ?? undefined}
      />

      {comments.length === 0 ? (
        <p>No comments available.</p>
      ) : (
        <CommentsTable comments={comments} /> 
      )}
      <Outlet />
    </div>
  );
}
