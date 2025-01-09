import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import {
  validateAge,
  validateEmail,
  validateName,
  validateRol,
  validateSchoolYear,
  validateSurname,
} from "~/util/validations";

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

interface UserFormProps {
  user?: {
    name: string;
    surname: string;
    email: string;
    age: number;
    school_year: string;
    rol: string;
    image_profile: string | null;
  };
}

export default function UserForm({ user }: UserFormProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const age = formData.get("age") as string;
    const schoolYear = formData.get("school_year") as string;
    const rol = formData.get("rol") as string;

    const nameError = validateName(name);
    if (nameError) {
      setError(nameError);
      return;
    }

    const surnameError = validateSurname(surname);
    if (surnameError) {
      setError(surnameError);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const ageError = validateAge(age);
    if (ageError) {
      setError(ageError);
      return;
    }

    const schoolYearError = validateSchoolYear(schoolYear);
    if (schoolYearError) {
      setError(schoolYearError);
      return;
    }

    const rolError = validateRol(rol);
    if (rolError) {
      setError(rolError);
      return;
    }

    e.currentTarget.submit();
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <h2 className="text-2xl font-bold mb-4">
        {user ? "Edit User" : "Add User"}
      </h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700">
          First Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={user?.name || ""}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="surname" className="block text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          id="surname"
          name="surname"
          defaultValue={user?.surname || ""}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={user?.email || ""}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="age" className="block text-gray-700">
          Age
        </label>
        <input
          type="number"
          id="age"
          name="age"
          defaultValue={user?.age || ""}
          className="w-full p-2 border border-gray-300 rounded"
          max={100}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="school_year" className="block text-gray-700">
          School Year
        </label>
        <select
          id="school_year"
          name="school_year"
          defaultValue={user?.school_year || ""}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="rol" className="block text-gray-700">
          Role
        </label>
        <select
          id="rol"
          name="rol"
          defaultValue={user?.rol || ""}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="admin">admin</option>
          <option value="user">user</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Save
        </button>
        <Link
          to="/admin/users"
          className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
        >
          Cancel
        </Link>
      </div>
    </Form>
  );
}
