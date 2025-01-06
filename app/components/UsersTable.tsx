// components/UsersTable.tsx
import { Form, Link } from "@remix-run/react";

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  age: number;
  school_year: string;
  rol: string;
  image_profile: string | null; // Puede ser `null` si no tiene imagen
}

interface UsersTableProps {
  users: User[];
}

const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <div className="m-4 bg-white p-4 rounded-lg shadow-md">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border border-gray-300">ID</th>
            <th className="text-left p-2 border border-gray-300">Nombre</th>
            <th className="text-left p-2 border border-gray-300">Apellido</th>
            <th className="text-left p-2 border border-gray-300">Email</th>
            <th className="text-left p-2 border border-gray-300">Edad</th>
            <th className="text-left p-2 border border-gray-300">Curso</th>
            <th className="text-left p-2 border border-gray-300">Rol</th>
            <th className="text-left p-2 border border-gray-300">Imagen</th>
            <th className="text-left p-2 border border-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2 border border-gray-300">{user.id}</td>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/profile/${user.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {user.name}
                </Link>
              </td>
              <td className="p-2 border border-gray-300">{user.surname}</td>
              <td className="p-2 border border-gray-300">{user.email}</td>
              <td className="p-2 border border-gray-300">{user.age}</td>
              <td className="p-2 border border-gray-300">{user.school_year}</td>
              <td className="p-2 border border-gray-300">{user.rol}</td>
              <td className="p-2 border border-gray-300">
                {user.image_profile ? (
                  <img
                    src={user.image_profile}
                    alt={`${user.name} ${user.surname}`}
                    className="w-16 h-16 object-cover"
                  />
                ) : (
                  <span>Sin Imagen</span>
                )}
              </td>
              <td className="p-2 border border-gray-300">
                <Link
                  to={`/admin/users/edit/${user.id}`}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Editar
                </Link>
                <Form
                  method="post"
                  action={`/admin/users/delete/${user.id}`}
                  className="inline"
                >
                  <button
                    type="submit"
                    className="text-red-500 hover:underline"
                    onClick={(e) => {
                      if (
                        !window.confirm(
                          "¿Estás seguro de que deseas eliminar este usuario?"
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
