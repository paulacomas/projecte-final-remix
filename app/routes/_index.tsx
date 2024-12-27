import { useLoaderData } from "@remix-run/react";
import Layout from "../components/Layout";
import BooksGrid from "../components/BookGrid";

export async function loader() {
  try {
    const response = await fetch("http://localhost/api/books", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export default function Index() {
  const books = useLoaderData();

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Books List</h1>
      <BooksGrid books={books} />
    </Layout>
  );
}
