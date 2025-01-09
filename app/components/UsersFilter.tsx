import { Form } from "@remix-run/react";
import React from "react";

interface UserFiltersProps {
  name: string;
  email: string;
  course: string;
  courses: string[];
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCourseChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearch: (e: React.FormEvent) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  name,
  email,
  course,
  courses,
  onNameChange,
  onEmailChange,
  onCourseChange,
  onSearch,
}) => {
  return (
    <Form
      onSubmit={onSearch}
      className="space-y-6 p-6 bg-white shadow-md rounded-lg mt-4 m-6"
    >
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[250px]">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Search by name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Search by name"
            value={name}
            onChange={onNameChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 min-w-[250px]">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Search by email
          </label>
          <input
            id="email"
            type="text"
            placeholder="Search by email"
            value={email}
            onChange={onEmailChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 min-w-[250px]">
          <label
            htmlFor="course"
            className="block text-sm font-medium text-gray-700"
          >
            Select school year
          </label>
          <select
            id="course"
            value={course}
            onChange={onCourseChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All school year</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Form>
  );
};

export default UserFilters;
