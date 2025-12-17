import { Cloudinary } from "@cloudinary/url-gen";

export const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

// Calculate SHA-1 hash of a file
const getFileSha1 = async (file) => {
  const fileData = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-1", fileData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

// Helper function to upload image to Cloudinary
export const uploadToCloudinary = async (file, tag) => {
  const hash = await getFileSha1(file);
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const resourceType = file.type.startsWith("image")
    ? "image"
    : file.type.startsWith("video")
      ? "video"
      : "raw";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  //? Add public_id to avoid uploading duplicate file
  formData.append("public_id", hash);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok) {
      return data.secure_url;
    }

    throw new Error(data.error.message || "Failed to upload image");
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
