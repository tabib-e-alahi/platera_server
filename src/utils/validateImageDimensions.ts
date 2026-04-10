import sharp from "sharp";
import fs from "fs/promises";

type TImageRule = {
  minWidth?: number;
  minHeight?: number;
  exactWidth?: number;
  exactHeight?: number;
};

export const validateImageFileDimensions = async (
  filePath: string,
  rule: TImageRule
) => {
  const metadata = await sharp(filePath).metadata();

  const width = metadata.width;
  const height = metadata.height;

  if (!width || !height) {
    throw new Error("Could not determine image dimensions.");
  }

  if (
    rule.exactWidth &&
    rule.exactHeight &&
    (width !== rule.exactWidth || height !== rule.exactHeight)
  ) {
    throw new Error(
      `Image must be exactly ${rule.exactWidth}x${rule.exactHeight}px.`
    );
  }

  if (rule.minWidth && width < rule.minWidth) {
    throw new Error(`Image width must be at least ${rule.minWidth}px.`);
  }

  if (rule.minHeight && height < rule.minHeight) {
    throw new Error(`Image height must be at least ${rule.minHeight}px.`);
  }

  return { width, height };
};

export const safeRemoveFile = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
  } catch {
    //
  }
};