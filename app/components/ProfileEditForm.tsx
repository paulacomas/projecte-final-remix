import { useState } from "react";
import {
  validateName,
  validateSurname,
  validateEmail,
  validateAge,
  validateSchoolYear,
} from "../util/validations"; // Asegúrate de que la ruta sea correcta

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  age?: number;
  school_year?: string;
  profile_image: File;
}

interface ProfileEditFormProps {
  user: User;
  onSubmit: (updatedUser: Partial<User>) => void;
  onClose: () => void;
}

export default function ProfileEditForm({
  user,
  onSubmit,
  onClose,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name,
    surname: user.surname,
    email: user.email,
    age: user.age || undefined,
    school_year: user.school_year || "",
    profile_image: user.profile_image,
  });

  const [image, setImage] = useState<File | null>(null); // For image upload
  const [error, setError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar los campos antes de enviar
    const nameError = validateName(formData.name || "");
    const surnameError = validateSurname(formData.surname || "");
    const emailError = validateEmail(formData.email || "");
    const ageError = validateAge(formData.age || "");
    const schoolYearError = validateSchoolYear(formData.school_year || "");

    if (
      nameError ||
      surnameError ||
      emailError ||
      ageError ||
      schoolYearError
    ) {
      setError(
        nameError || surnameError || emailError || ageError || schoolYearError
      );
      return;
    }

    // Prepare the user data as JSON (without using FormData)
    const updatedUser = {
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      age: formData.age,
      school_year: formData.school_year,
    };

    // If image is provided, include it in the request
    if (image) {
      updatedUser["profile_image"] = image;
    }

    // Send the data as JSON
    onSubmit(updatedUser); // Pass the JSON object to the onSubmit handler
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold mb-6">Edit Profile</h3>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Surname
          </label>
          <input
            type="text"
            name="surname"
            value={formData.surname || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            School Year
          </label>
          <input
            type="text"
            name="school_year"
            value={formData.school_year || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Profile Image
          </label>
          <input
            type="file"
            name="image_profile"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/jpg"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
