import { Form } from "@remix-run/react";
import { FC } from "react";

interface BookFiltersProps {
  title: string;
  user: string;
  category: string;
  categories: string[];
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUserChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearch: (e: React.FormEvent) => void;
}

const BookFilters: FC<BookFiltersProps> = ({
  title,
  user,
  category,
  categories,
  onTitleChange,
  onUserChange,
  onCategoryChange,
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
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Search by title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter the title"
            value={title}
            onChange={onTitleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 min-w-[250px]">
          <label
            htmlFor="user"
            className="block text-sm font-medium text-gray-700"
          >
            Search by user
          </label>
          <input
            type="text"
            id="user"
            placeholder="Enter the name"
            value={user}
            onChange={onUserChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 min-w-[250px]">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Select category
          </label>
          <div className="flex items-center gap-4">
            {" "}
            <select
              id="category"
              value={category}
              onChange={onCategoryChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default BookFilters;
