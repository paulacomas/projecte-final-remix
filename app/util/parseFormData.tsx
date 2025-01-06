import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

export async function parseFormData(request: Request) {
  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createFileUploadHandler()
  );
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    opinion: formData.get("opinion") as string,
    review: formData.get("review") as string,
    gender: formData.get("gender") as string,
    author: formData.get("author") as string,
    image_book: formData.get("image_book"), // Puede ser un archivo o un string con el nombre de la imagen
  };
  return data;
}
