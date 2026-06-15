import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, STORAGE_ENABLED } from "../lib/firebase";

// Explicit allowlist — extension and contentType derived from validated MIME only.
// Never trust file.name or file.type directly.
const MIME_MAP = {
  "image/jpeg":     "jpg",
  "image/png":      "png",
  "image/webp":     "webp",
  "image/gif":      "gif",
  "video/mp4":      "mp4",
  "video/quicktime":"mov",
  "video/webm":     "webm",
};

/**
 * Upload a compressed media file to Cloud Storage.
 * Path: users/{uid}/memories/{timestamp}_{random}.{ext}
 * Extension and contentType are derived from MIME_MAP — never from the original filename.
 * Returns the public download URL.
 */
export async function uploadMemoryFile(uid, file) {
  if (!STORAGE_ENABLED) throw new Error("Firebase Storage is not configured");

  const contentType = MIME_MAP[file.type] ? file.type : null;
  if (!contentType) throw new Error(`Unsupported file type: ${file.type}`);

  const ext = MIME_MAP[contentType];
  const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `users/${uid}/memories/${safeName}`;

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType });
  return getDownloadURL(storageRef);
}
