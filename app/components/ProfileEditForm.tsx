import { Form } from "@remix-run/react";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  age?: number;
  school_year?: string;
  profile_image?: string; // Asumimos que el valor de la imagen es una URL
}

interface ProfileEditFormProps {
  user: User;
}

export default function ProfileEditForm({ user }: ProfileEditFormProps) {
  return (
    <div>
      <h2>Edit Profile</h2>
      <Form method="post" className="space-y-4" encType="multipart/form-data">
        {/* Name field */}
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

        {/* Surname field */}
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

        {/* Email field */}
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

        {/* Age field */}
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

        {/* School Year field */}
        <div>
          <label htmlFor="school_year" className="block">
            School Year
          </label>
          <input
            type="text"
            id="school_year"
            name="school_year"
            defaultValue={user.school_year ?? ""}
            className="border px-4 py-2 rounded-md w-full"
          />
        </div>

        {/* Profile image upload */}
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
          {/* If there is a profile image, display it */}
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

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Save Changes
        </button>
      </Form>
    </div>
  );
}
