export const validateCommentContent = (content: string): string | null => {
  if (content.trim() === "") {
    return "The comment content cannot be empty.";
  }

  if (content.length > 500) {
    return "The comment content cannot exceed 500 characters.";
  }

  return null;
};


export const validateReviewContent = (content: string): string | null => {
  if (!content.trim()) {
    return "Review content cannot be empty.";
  }
  return null;
};

export const validateReviewRating = (rating: number): string | null => {
  if (rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5.";
  }
  return null;
};


export function validateTitle(title: string) {
  if (!title.trim() || typeof title !== "string" || title.length > 255) {
    return "The title is required and must be a maximum of 255 characters.";
  }
  return null;
}

export function validateDescription(description: string) {
  if (
    !description ||
    typeof description !== "string" ||
    description.length > 1000
  ) {
    return "The description is required and must be a maximum of 1000 characters.";
  }
  return null;
}

export function validateOpinion(opinion: string | undefined) {
  if (opinion && (typeof opinion !== "string" || opinion.length > 500)) {
    return "The opinion cannot exceed 500 characters.";
  }
  return null;
}

export function validateReview(review: string | undefined) {
  if (
    review &&
    (isNaN(Number(review)) || Number(review) < 1 || Number(review) > 5)
  ) {
    return "The review must be a number between 1 and 5.";
  }
  return null;
}

export function validateGender(gender: string) {
  if (!gender || typeof gender !== "string" || gender.length > 255) {
    return "The gender is required and must be a maximum of 255 characters.";
  }
  return null;
}

export function validateAuthor(author: string) {
  if (!author || typeof author !== "string" || author.length > 255) {
    return "The author is required and must be a maximum of 255 characters.";
  }
  return null;
}

export const validateName = (name: string) => {
  if (!name) {
    return "The name is required.";
  }
  if (name.length > 255) {
    return "The name must not exceed 255 characters.";
  }
  return null;
};

export const validateSurname = (surname: string) => {
  if (!surname) {
    return "The surname is required.";
  }
  if (surname.length > 1000) {
    return "The surname must not exceed 1000 characters.";
  }
  return null;
};

export const validateEmail = (email: string) => {
  if (!email) {
    return "The email is required.";
  }
  if (email.length > 500) {
    return "The email must not exceed 500 characters.";
  }
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email)) {
    return "The email must be valid.";
  }
  return null;
};

export const validateAge = (age: string) => {
  if (!age) {
    return "The age is required.";
  }
  const ageNumber = Number(age);
  if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 100) {
    return "The age must be a number between 1 and 100.";
  }
  return null;
};

export const validateSchoolYear = (schoolYear: string) => {
  if (!schoolYear) {
    return "The school year is required.";
  }
  if (schoolYear.length > 255) {
    return "The school year must not exceed 255 characters.";
  }
  return null;
};

export const validateRol = (rol: string) => {
  if (!rol) {
    return "The role is required.";
  }
  if (rol.length > 255) {
    return "The role must not exceed 255 characters.";
  }
  return null;
};

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
