type ValidationErrors = Record<string, string>;

//validate comments
export const validateCommentContent = (content: string): void => {
  const validationErrors: ValidationErrors = {};
  if (content.trim() === "") {
    validationErrors.content = "The comment content cannot be empty.";
  }

  if (content.length > 500) {
    validationErrors.contentLength =
      "The comment content cannot exceed 500 characters.";
  }

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
};

//validate reviews
export const validateReviewContent = (content: string) => {
  return content.trim().length > 0 && content.trim().length <= 255;
};

export const validateReviewRating = (score: number) => {
  return score >= 1 && score <= 5;
};

export function validateReviewInput(input): void {
  const validationErrors: ValidationErrors = {};

  // Validacions individuals
  if (!validateReviewContent(input.comment)) {
    validationErrors.comment = "Review content cannot be empty.";
  }

  if (!validateReviewRating(input.score)) {
    validationErrors.score = "Rating must be between 1 and 5.";
  }

  // Llança l'error si hi ha alguna validació fallida
  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}

//validate books

export function validateTitle(title: string) {
  return title.trim().length > 0 && title.trim().length <= 255;
}

export function validateDescription(description: string) {
  return description.trim().length > 0 && description.trim().length <= 255;
}

export function validateOpinion(opinion: string) {
  return opinion.trim().length <= 255;
}

export function validateReview(review: string) {
  return !isNaN(Number(review)) && Number(review) >= 1 && Number(review) <= 5;
}

export function validateGender(gender: string) {
  return gender.trim().length > 0 && gender.trim().length <= 255;
}

export function validateAuthor(author: string) {
  return author.trim().length > 0 && author.trim().length <= 255;
}
export function validateBook(input): void {
  const validationErrors: ValidationErrors = {};

  // Validacions individuals
  if (!validateTitle(input.title)) {
    validationErrors.title =
      "The title is required and must be a maximum of 255 characters.";
  }

  if (!validateDescription(input.description)) {
    validationErrors.description =
      "The description is required and must be a maximum of 1000 characters.";
  }

  if (!validateOpinion(input.opinion)) {
    validationErrors.opinion = "The opinion cannot exceed 500 characters.";
  }

  if (!validateReview(input.review)) {
    validationErrors.review = "The review must be a number between 1 and 5.";
  }

  if (!validateGender(input.gender)) {
    validationErrors.gender =
      "The gender is required and must be a maximum of 255 characters.";
  }

  if (!validateAuthor(input.author)) {
    validationErrors.author =
      "The author is required and must be a maximum of 255 characters.";
  }

  if (!validateImage(input.image_book)) {
    validationErrors.image_book = "Image required.";
  }

  // Llança l'error si hi ha alguna validació fallida
  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}
export function validateBookEdit(input): void {
  const validationErrors: ValidationErrors = {};

  // Validacions individuals
  if (!validateTitle(input.title)) {
    validationErrors.title =
      "The title is required and must be a maximum of 255 characters.";
  }

  if (!validateDescription(input.description)) {
    validationErrors.description =
      "The description is required and must be a maximum of 1000 characters.";
  }

  if (!validateOpinion(input.opinion)) {
    validationErrors.opinion = "The opinion cannot exceed 500 characters.";
  }

  if (!validateReview(input.review)) {
    validationErrors.review = "The review must be a number between 1 and 5.";
  }

  if (!validateGender(input.gender)) {
    validationErrors.gender =
      "The gender is required and must be a maximum of 255 characters.";
  }

  if (!validateAuthor(input.author)) {
    validationErrors.author =
      "The author is required and must be a maximum of 255 characters.";
  }

  // Llança l'error si hi ha alguna validació fallida
  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}

//validate user

export function validateUserAdmin(input): void {
  const validationErrors: ValidationErrors = {};

  // Validacions individuals
  if (!validateName(input.name)) {
    validationErrors.name =
      "The name is required and must be a maximum of 255 characters.";
  }

  if (!validateSurname(input.surname)) {
    validationErrors.surname =
      "The surname is required and must be a maximum of 255 characters.";
  }

  if (!validateEmail(input.email)) {
    validationErrors.email = "The email is required and must be valid";
  }

  if (!validateAge(input.age)) {
    validationErrors.age =
      "The age is required and must be a number between 1 and 100.";
  }

  if (!validateSchoolYear(input.school_year)) {
    validationErrors.schoolYear =
      "The school year is required and must be a maximum of 255 characters.";
  }

  if (!validateRol(input.rol)) {
    validationErrors.rol = "The role is required.";
  }

  // Llança l'error si hi ha alguna validació fallida
  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}

export function validateUser(input): void {
  const validationErrors: ValidationErrors = {};

  // Validacions individuals
  if (!validateName(input.name)) {
    validationErrors.name =
      "The name is required and must be a maximum of 255 characters.";
  }

  if (!validateSurname(input.surname)) {
    validationErrors.surname =
      "The surname is required and must be a maximum of 255 characters.";
  }

  if (!validateEmail(input.email)) {
    validationErrors.email = "The email is required and must be valid";
  }

  if (!validateAge(input.age)) {
    validationErrors.age =
      "The age is required and must be a number between 1 and 100.";
  }

  if (!validateSchoolYear(input.school_year)) {
    validationErrors.schoolYear =
      "The school year is required and must be a maximum of 255 characters.";
  }

  // Llança l'error si hi ha alguna validació fallida
  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}

export function validateUserRegister(input): void {
  const validationErrors: ValidationErrors = {};

  // Validacions individuals
  if (!validateName(input.name)) {
    validationErrors.name =
      "The name is required and must be a maximum of 255 characters.";
  }

  if (!validateSurname(input.surname)) {
    validationErrors.surname =
      "The surname is required and must be a maximum of 255 characters.";
  }

  if (!validateEmail(input.email)) {
    validationErrors.email = "The email is required and must be valid";
  }

  if (!validateAge(input.age)) {
    validationErrors.age =
      "The age is required and must be a number between 1 and 100.";
  }

  if (!validateSchoolYear(input.school_year)) {
    validationErrors.schoolYear =
      "The school year is required and must be a maximum of 255 characters.";
  }

  if (!validatePassword(input.password)) {
    validationErrors.password =
      "Password should be at least 6 characters long.";
  }

  if (
    !validatePasswordConfirmation(input.password, input.password_confirmation)
  ) {
    validationErrors.password_confirmation = "Passwords do not match.";
  }

  if (!validateImage(input.image_profile)) {
    validationErrors.image_profile = "Image profile required.";
  }

  // Llança l'error si hi ha alguna validació fallida
  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}

export const validateName = (name: string) => {
  return name.trim().length > 0 && name.trim().length <= 255;
};

export const validateSurname = (surname: string) => {
  return surname.trim().length > 0 && surname.trim().length <= 255;
};

export const validateEmail = (email: string) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return (
    email.trim().length > 0 && email.trim().length <= 500 && re.test(email)
  );
};

export const validateAge = (age: string) => {
  const ageNumber = Number(age);
  return (
    age.trim().length > 0 &&
    !isNaN(ageNumber) &&
    ageNumber >= 1 &&
    ageNumber <= 100
  );
};

export const validateSchoolYear = (schoolYear: string) => {
  return schoolYear.trim().length > 0 && schoolYear.trim().length <= 255;
};

export const validateRol = (rol: string) => {
  return rol.trim().length > 0 && rol.trim().length <= 255;
};

export const validatePassword = (password: string): boolean => {
  return password.trim().length >= 6;
};

export const validatePasswordConfirmation = (
  password: string,
  passwordConfirmation: string
): boolean => {
  return password === passwordConfirmation;
};

export const validateImage = (image: File): boolean => {
  if (!image) return false;

  const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validImageTypes.includes(image.type)) {
    return false;
  }

  return true;
};
