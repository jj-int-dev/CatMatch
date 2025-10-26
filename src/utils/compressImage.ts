import imageCompression from 'browser-image-compression';

export type ImageCompressionResult = { image?: File; success: boolean };

export default async function (
  imageFile: File
): Promise<ImageCompressionResult> {
  const options = {
    maxSizeMB: 1,
    useWebWorker: true
  };

  try {
    const compressedImage = await imageCompression(imageFile, options);
    return { image: compressedImage, success: true };
  } catch (error) {
    return { success: false };
  }
}
