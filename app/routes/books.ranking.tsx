import { Link, useLoaderData } from "@remix-run/react";
import "../util/podium.css";
import Navigation from "~/components/Layout";

export async function loader() {
  try {
    const response = await fetch("http://localhost/api/books", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const data = await response.json();
    const books = data.data;

    const rankedBooks = books.map((book) => ({
      ...book,
      totalScore: book.reviews.reduce((sum, review) => sum + review.score, 0),
    }));
    rankedBooks.sort((a, b) => b.totalScore - a.totalScore);

    return { topThree: rankedBooks.slice(0, 3) };
  } catch (error) {
    throw new Error("Error fetching books or reviews");
  }
}

export default function BookRanking() {
  const { topThree } = useLoaderData();

  if (topThree.length === 0) {
    return <p>No books available to display.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="podium">
        <div className="podium-container">
          {topThree.map((book, index) => (
            <div
              className={`podium-item podium-item-${index + 1}`}
              key={book.id}
            >
              <h2>{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</h2>

              <div className="card-container">
                <img
                  src={book.image_book}
                  alt={book.title}
                  className="card-image"
                />
                <h3>{book.title}</h3>
                <p>Score: {book.totalScore}</p>
                <div className="mt-4">
                  <Link
                    to={`/books/details/${book.id}`}
                    className="view-details-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
