import { updateBook } from "~/data/data";
import { BookDetails } from "../types";

export const handleSaveChanges = async (
  updatedBookData: {
    id: string;
    title: string;
    author: string;
    description: string;
    opinion?: string;
    review?: number;
    gender: string;
    image_book?: File | null;
  },
  book: BookDetails | null,
  setBook: React.Dispatch<React.SetStateAction<BookDetails | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const token = localStorage.getItem("token");

  if (!updatedBookData || !token) return;

  try {
    const updatedData = {
      title: updatedBookData.title,
      description: updatedBookData.description,
      opinion: updatedBookData.opinion,
      review: updatedBookData.review,
      gender: updatedBookData.gender,
      author: updatedBookData.author,
      image_book: updatedBookData.image_book,
    };

    const result = await updateBook(updatedBookData.id, updatedData, token);
    console.log(result);
    setBook(result.data);
    setIsModalOpen(false);
  } catch (error) {
    setError("Error updating the book");
  }
};
