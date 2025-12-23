import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from './claudinary.config';

const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp"];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const providerProfileStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file): object => {
    let folder = "platera_foodhub/providers/misc";

    if (file.fieldname === "nidImages") {
      folder = "platera_foodhub/providers/nid";
    } else if (file.fieldname === "businessMainGate") {
      folder = "platera_foodhub/providers/main-gate";
    } else if (file.fieldname === "businessKitchen") {
      folder = "platera_foodhub/providers/kitchen";
    } else if (file.fieldname === "profileImage") {
      folder = "platera_foodhub/providers/profile";
    }

    return {
      folder,
      allowed_formats: ALLOWED_FORMATS,
      transformation: [
        { quality: "auto", fetch_format: "auto" },
      ],
    };
  },
});

const imageFileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files are allowed (jpg, jpeg, png, webp)."
      )
    );
  }
};

export const providerProfileUpload = multer({
  storage: providerProfileStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

// src/config/multer.ts — add this alongside providerProfileUpload

const mealImageStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file): object => {
    let folder = "platera_foodhub/meals/misc";

    if (file.fieldname === "mainImage") {
      folder = "platera_foodhub/meals/main";
    } else if (file.fieldname === "galleryImages") {
      folder = "platera_foodhub/meals/gallery";
    }

    return {
      folder,
      allowed_formats: ALLOWED_FORMATS,
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 800, crop: "limit" }, // max 800px wide for meal images
      ],
    };
  },
});

export const mealImageUpload = multer({
  storage: mealImageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});