export const validateCommentContent = (content: string): string | null => {
  if (content.trim() === "") {
    return "The comment content cannot be empty.";
  }

  if (content.length > 500) {
    return "The comment content cannot exceed 500 characters.";
  }

  return null; // Validation passed
};
