// components/CommentFilters.tsx
import { Form } from "@remix-run/react";
import React from "react";

interface ResponseFiltersProps {
  comment: string;
  user: string;
  response: string;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUserChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResponseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (e: React.FormEvent) => void;
}

const ResponsesFilters: React.FC<ResponseFiltersProps> = ({
  comment,
  user,
  response,
  onCommentChange,
  onUserChange,
  onResponseChange,
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
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Search by comment
          </label>
          <input
            type="text"
            placeholder="Filter by comment"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={comment}
            onChange={onCommentChange}
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
            htmlFor="response"
            className="block text-sm font-medium text-gray-700"
          >
            Search by response
          </label>
          <input
            type="text"
            placeholder="Filter by response"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={response}
            onChange={onResponseChange}
          />
        </div>
      </div>
    </Form>
  );
};

export default ResponsesFilters;
