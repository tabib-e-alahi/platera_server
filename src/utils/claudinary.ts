import cloudinary from "../config/claudinary.config";

export const extractPublicId = (url: string): string | null => {
  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");

    if (uploadIndex === -1) return null;

    const afterUpload = urlParts.slice(uploadIndex + 1);

    // skip version segment like v1234567
    const withoutVersion = afterUpload[0]?.startsWith("v")
      ? afterUpload.slice(1)
      : afterUpload;

    const publicIdWithExt = withoutVersion.join("/");

    // remove file extension
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch {
    return null;
  }
};

export const deleteFromCloudinary = async (
  url: string
): Promise<void> => {
  const publicId = extractPublicId(url);

  if (!publicId) {
    console.warn(
      `[Cloudinary] Could not extract public_id from URL: ${url}`
    );
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // log but do not throw — a failed Cloudinary delete
    // should not break the main operation
    console.error(
      `[Cloudinary] Failed to delete image: ${publicId}`,
      error
    );
  }
};

export const deleteMultipleFromCloudinary = async (
  urls: string[]
): Promise<void> => {
  const validUrls = urls.filter(Boolean);
  if (validUrls.length === 0) return;
  await Promise.all(validUrls.map(deleteFromCloudinary));
};