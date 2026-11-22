/**
 * Shrinks a photo to a small JPEG data URL (longest side `maxSide` px), so it can be kept in the
 * browser's cart and sent with an order. A phone photo of several MB becomes roughly 100–200 KB:
 * plenty for the illustrator, small enough for localStorage. Returns null if it can't be read.
 */
export async function downscaleToJpeg(
  blob: Blob,
  maxSide = 1000,
  quality = 0.82,
): Promise<string | null> {
  try {
    const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return null;
  }
}
