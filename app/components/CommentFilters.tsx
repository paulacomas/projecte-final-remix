// components/CommentFilters.tsx
import { Form } from "@remix-run/react";
import React from "react";

interface CommentFiltersProps {
  title: string;
  user: string;
  content: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUserChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (e: React.FormEvent) => void;
}

const CommentFilters: React.FC<CommentFiltersProps> = ({
  title,
  user,
  content,
  onTitleChange,
  onUserChange,
  onContentChange,
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
            placeholder="Filter by title"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={onTitleChange}
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
            placeholder="Filter by user"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={user}
            onChange={onUserChange}
          />
        </div>
        <div className="flex-1 min-w-[250px]">
          <label
            htmlFor="user"
            className="block text-sm font-medium text-gray-700"
          >
            Search by content
          </label>
          <input
            type="text"
            placeholder="Filter by content"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={onContentChange}
          />
        </div>
      </div>
    </Form>
  );
};

export default CommentFilters;
