/**
 * Compress an image File to WebP, targeting max 300KB.
 * Uses Canvas API — no external dependencies.
 * Returns a new File (.webp) and a preview object URL.
 */
export async function compressImage(file, maxKB = 300) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectURL = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectURL);
      const canvas = document.createElement("canvas");

      let { width, height } = img;
      const MAX_DIM = 1920;
      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);

      const tryQuality = (quality) => {
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error("Canvas toBlob failed")); return; }
          if (blob.size <= maxKB * 1024 || quality <= 0.1) {
            const compressed = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, ".webp"),
              { type: "image/webp" }
            );
            resolve({ file: compressed, sizeKB: Math.round(blob.size / 1024) });
          } else {
            tryQuality(+(quality - 0.1).toFixed(1));
          }
        }, "image/webp", quality);
      };

      tryQuality(0.85);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectURL);
      reject(new Error("Failed to load image"));
    };
    img.src = objectURL;
  });
}

/**
 * Validate a video file against the 2MB limit.
 * Browser-native video compression is not feasible without ffmpeg.wasm.
 */
export function validateVideo(file, maxMB = 2) {
  const sizeMB = file.size / (1024 * 1024);
  return { valid: sizeMB <= maxMB, sizeMB: +sizeMB.toFixed(1) };
}

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export function getFileCategory(file) {
  if (IMAGE_TYPES.includes(file.type)) return "image";
  if (VIDEO_TYPES.includes(file.type)) return "video";
  return "unknown";
}
