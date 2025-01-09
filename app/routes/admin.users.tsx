// routes/admin/users/index.tsx
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
  Outlet,
  json,
  useSearchParams,
  useNavigate,
} from "@remix-run/react";
import UsersTable from "~/components/UsersTable";
import Navigation from "~/components/Layout";
import { fetchCurrentUser, fetchUsers } from "~/data/data"; 
import { getAuthTokenFromCookie } from "~/helpers/cookies";
import { useState } from "react";
import Notification from "~/components/Notification";
import UserFilters from "~/components/UsersFilter";

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
  const name = url.searchParams.get("name")?.toLowerCase() || "";
  const email = url.searchParams.get("email")?.toLowerCase() || "";
  const course = url.searchParams.get("course") || "";
  try {
    const users = await fetchUsers(token);
    const filteredUsers = users.data.users.filter((user: { name: string; email: string; school_year: string }) => {
      const matchesName = !name || user.name.toLowerCase().includes(name);
      const matchesEmail = !email || user.email.toLowerCase().includes(email);
      const matchesCourse = !course || user.school_year === course;
      return matchesName && matchesEmail && matchesCourse;
    });

    return json({ users: filteredUsers });
  } catch (error) {
    throw new Error("Error fetching users");
  }
}

export default function AdminUsers() {
  const { users } = useLoaderData();
  const [searchParams] = useSearchParams();

  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  const courses = [
    "1ESO",
    "2ESO",
    "3ESO",
    "4ESO",
    "1BACH",
    "2BACH",
    "1CICLES",
    "2CICLES",
    "3CICLES",
  ];

  const updateUrlWithFilters = (
    newName: string,
    newEmail: string,
    newCourse: string
  ) => {
    const params = new URLSearchParams();
    if (newName) params.set("name", newName);
    if (newEmail) params.set("email", newEmail);
    if (newCourse) params.set("course", newCourse);
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    updateUrlWithFilters(newName, email, course)
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    updateUrlWithFilters(name, newEmail, course);
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCourse = e.target.value;
    setCourse(newCourse);
    updateUrlWithFilters(name, email, newCourse);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <h1 className="text-4xl font-extrabold p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Users
      </h1>
      <UserFilters
        name={name}
        email={email}
        course={course}
        courses={courses}
        onNameChange={handleNameChange}
        onEmailChange={handleEmailChange}
        onCourseChange={handleCourseChange}
        onSearch={handleSearch}
      />
      <Notification
        successMessage={successMessage ?? undefined}
        errorMessage={errorMessage ?? undefined}
      />
      {users.length === 0 ? (
        <p>No users available.</p>
      ) : (
        <UsersTable users={users} />
      )}
      <Outlet />
    </div>
  );
}
