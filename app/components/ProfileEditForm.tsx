import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import {
  validateAge,
  validateEmail,
  validateName,
  validateSchoolYear,
  validateSurname,
} from "~/util/validations";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  age?: number;
  school_year?: string;
  profile_image?: string;
}

interface ProfileEditFormProps {
  user: User;
}

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

export default function ProfileEditForm({ user }: ProfileEditFormProps) {
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

    e.currentTarget.submit();
  };
  return (
    <div>
      <Form
        method="post"
        className="space-y-4"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <h2 className="text-2xl font-bold mb-4">Edit profile</h2>

        <div>
          <label htmlFor="name" className="block">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={user.name}
            className="border px-4 py-2 rounded-md w-full"
          />
        </div>

        <div>
          <label htmlFor="surname" className="block">
            Surname
          </label>
          <input
            type="text"
            id="surname"
            name="surname"
            defaultValue={user.surname}
            className="border px-4 py-2 rounded-md w-full"
          />
        </div>

        <div>
          <label htmlFor="email" className="block">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={user.email}
            className="border px-4 py-2 rounded-md w-full"
          />
        </div>

        <div>
          <label htmlFor="age" className="block">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            defaultValue={user.age ?? ""}
            className="border px-4 py-2 rounded-md w-full"
          />
        </div>

        <div>
          <label htmlFor="school_year" className="block">
            School Year
          </label>
          <select
            id="school_year"
            name="school_year"
            defaultValue={user.school_year ?? ""}
            className="border px-4 py-2 rounded-md w-full"
          >
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="profile_image" className="block">
            Profile Image
          </label>
          <input
            type="file"
            id="profile_image"
            name="profile_image"
            className="border px-4 py-2 rounded-md w-full"
          />

          {user.profile_image && (
            <div className="mt-2">
              <img
                src={user.profile_image}
                alt="Current profile"
                className="h-24 w-24 rounded-full"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
          <Link
            to=".."
            className="py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}
