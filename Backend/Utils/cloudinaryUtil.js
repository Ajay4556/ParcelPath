import cloudinary from "../Config/cloudinary.js";

export function getCloudinaryImageUrl(publicId, transformations = {}) {
  if (!publicId) return "";
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations,
  });
}
