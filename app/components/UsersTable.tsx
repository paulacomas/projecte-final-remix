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
  image_profile: string | null;
}

interface UsersTableProps {
  users: User[];
}

const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <div className="m-4 bg-white p-6 rounded-lg shadow-lg">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">First Name</th>
              <th className="text-left p-3">Last Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Age</th>
              <th className="text-left p-3">School year</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Profile Image</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="p-3 text-gray-600">{user.id}</td>
                <td className="p-3">
                  <Link
                    to={`/profile/${user.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {user.name}
                  </Link>
                </td>
                <td className="p-3 text-gray-600">{user.surname}</td>
                <td className="p-3 text-gray-600">{user.email}</td>
                <td className="p-3 text-gray-600">{user.age}</td>
                <td className="p-3 text-gray-600">{user.school_year}</td>
                <td className="p-3 text-gray-600">{user.rol}</td>
                <td className="p-3">
                  {user.image_profile ? (
                    <img
                      src={user.image_profile}
                      alt={`${user.name} ${user.surname}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500 italic">No Image</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    <Link
                      to={`/admin/users/edit/${user.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
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
                              "Are you sure you want to delete this user?"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
