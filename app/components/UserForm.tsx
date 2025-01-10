import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
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

interface ValidationErrors {
  [key: string]: string; // Clau string i valor string
}

export default function UserForm({ user }: UserFormProps) {
  const validationErrors = useActionData<ValidationErrors>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  return (
    <Form method="post">
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
      {validationErrors && (
        <ul className="mb-4 list-inside list-disc text-red-500">
          {Object.values(validationErrors).map((error: string) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          {isSubmitting ? "Saving..." : "Save"}
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
