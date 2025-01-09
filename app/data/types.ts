export interface User {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  user?: {
    id: number;
    name: string;
  };
  user_id?: number;
  book_id?: number;
  content: string;
  created_at?: string;
  updated_at?: string;
  replies?: Comment[];
}

export interface Review {
  id: string;
  user?: {
    id: number;
    name: string;
  };
  user_id?: number;
  book_id?: number;
  score: number;
  comment: string;
  created_at?: string;
  updated_at?: string;
}

export interface BookDetails {
  id: string;
  title: string;
  author: string;
  description: string;
  gender: string;
  review: number;
  opinion: string;
  image_book: string;
  created_at: string;
  updated_at: string;
  reviews: Review[];
  comments: Comment[];
  user_id: string;
}
