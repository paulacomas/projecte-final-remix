export const validateCommentContent = (content: string): string | null => {
  if (content.trim() === "") {
    return "The comment content cannot be empty.";
  }

  if (content.length > 500) {
    return "The comment content cannot exceed 500 characters.";
  }

  return null; // Validation passed
};

// src/validations.ts

export const validateReviewContent = (content: string): string | null => {
  if (!content.trim()) {
    return "Review content cannot be empty.";
  }
  return null; // Return null if no error
};

export const validateReviewRating = (rating: number): string | null => {
  if (rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5.";
  }
  return null; // Return null if no error
};

// utils/validations.ts

export const validateTitle = (title: string): string | null => {
  if (!title.trim()) {
    return "El título es obligatorio.";
  }
  return null;
};

export const validateAuthor = (author: string): string | null => {
  if (!author.trim()) {
    return "El autor es obligatorio.";
  }
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (!description.trim()) {
    return "La descripción es obligatoria.";
  }
  return null;
};

export const validateGender = (gender: string): string | null => {
  if (!gender.trim()) {
    return "El género es obligatorio.";
  }
  return null;
};

export const validateReview = (review: number): string | null => {
  if (review < 1 || review > 5) {
    return "La calificación debe ser entre 1 y 5.";
  }
  return null;
};

// utils/validations.ts

export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return "El nombre es obligatorio.";
  }
  return null;
};

export const validateSurname = (surname: string): string | null => {
  if (!surname.trim()) {
    return "El apellido es obligatorio.";
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email.trim()) {
    return "El correo electrónico es obligatorio.";
  }
  if (!emailRegex.test(email)) {
    return "El correo electrónico no es válido.";
  }
  return null;
};

export const validateAge = (age: number | string): string | null => {
  if (typeof age === "string" && !age.trim()) {
    return "La edad es obligatoria.";
  }
  if (typeof age === "number" && (age <= 0 || age > 120)) {
    return "La edad debe ser un número válido entre 1 y 120.";
  }
  return null;
};

export const validateSchoolYear = (schoolYear: string): string | null => {
  if (!schoolYear.trim()) {
    return "El año escolar es obligatorio.";
  }
  return null;
};

// utils/validations.ts

export const validatePassword = (password: string): string | null => {
  if (!password.trim()) {
    return "Password is required.";
  }
  if (password.length < 6) {
    return "Password should be at least 6 characters long.";
  }
  return null;
};

export const validatePasswordConfirmation = (
  password: string,
  passwordConfirmation: string
): string | null => {
  if (password !== passwordConfirmation) {
    return "Passwords do not match.";
  }
  return null;
};

export const validateProfileImage = (image: File | null): string | null => {
  if (image && !image.type.startsWith("image/")) {
    return "Profile image must be an image file.";
  }
  return null;
};
