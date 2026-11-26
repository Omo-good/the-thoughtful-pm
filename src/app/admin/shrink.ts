/**
 * Shrinks large photos in the browser before they are sent. Server uploads are capped by the host,
 * so full-size phone photos or several screenshots at once would otherwise fail. Small images are left alone.
 */
export async function shrink(file: File, maxEdge = 2400, aboveBytes = 300 * 1024, quality = 0.85): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= aboveBytes) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
