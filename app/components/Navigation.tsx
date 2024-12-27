import { Link } from "@remix-run/react";

export default function Navigation() {
  return (
    <nav className="flex justify-between items-center">
      <div className="text-xl font-bold">ReadIt!</div>
      <ul className="flex space-x-4">
        <li>
          <Link
            to="/books"
            className="text-gray-700 hover:text-blue-500 font-medium"
          >
            Books
          </Link>
        </li>
        <li>
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-500 font-medium"
          >
            Login
          </Link>
        </li>
        <li>
          <Link
            to="/register"
            className="text-gray-700 hover:text-blue-500 font-medium"
          >
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
}
