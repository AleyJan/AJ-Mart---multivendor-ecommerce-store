import { backend_url } from "../server";

export const imageUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${backend_url}${url}`;
};
