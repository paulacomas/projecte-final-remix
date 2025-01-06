import { Form, Link } from "@remix-run/react";

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
  return (
    <Form method="post">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={user?.name || ""}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="surname" className="block text-gray-700">
          Apellido
        </label>
        <input
          type="text"
          id="surname"
          name="surname"
          defaultValue={user?.surname || ""}
          className="w-full p-2 border border-gray-300 rounded"
          required
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
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="age" className="block text-gray-700">
          Edad
        </label>
        <input
          type="number"
          id="age"
          name="age"
          defaultValue={user?.age || ""}
          className="w-full p-2 border border-gray-300 rounded"
          max={100}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="school_year" className="block text-gray-700">
          Curso
        </label>
        <input
          type="text"
          id="school_year"
          name="school_year"
          defaultValue={user?.school_year || ""}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="rol" className="block text-gray-700">
          Rol
        </label>
        <select
          id="rol"
          name="rol"
          defaultValue={user?.rol || ""}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Guardar
        </button>
        <Link
          to="/admin/users"
          className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
        >
          Cancelar
        </Link>
      </div>
    </Form>
  );
}
