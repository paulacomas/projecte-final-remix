export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  age: number;
  school_year?: string;
  rol: string;
  image_profile?: string | null;
  books?: Book[];
}

export interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
    age?: number;
    school_year?: string;
    image_profile?: string;
  };
  book: {
    title: string;
    id: number;
  };
  user_id: string;
  book_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  responses: Reply[];
}

export interface Reply {
  id: string;
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
    age?: number;
    school_year?: string;
    image_profile?: string;
  };
  comment: {
    id: string;
    content: string;
  };
  response: string;
}

export interface Review {
  id: string;
  user: {
    id: string;
    name: string;
  };
  book: {
    id: number;
    title: string;
  };
  user_id?: number;
  book_id?: number;
  score: number;
  comment: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReviewEdit {
  id: number;
  user_id: number;
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
  user: User;
}

export interface ValidationErrors {
  [key: string]: string; // Clau string i valor string
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  gender: string;
  image_book: string;
  user_id: string;
  opinion: string;
  review: number;
  user: {
    id: string;
    name: string;
  };
}

export interface BookEdit {
  id: string;
  title: string;
  author: string;
  description: string;
  gender: string;
  image_book: string;
  opinion: string;
  review: number;
}
