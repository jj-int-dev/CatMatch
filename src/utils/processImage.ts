import imageCompression from 'browser-image-compression';

async function convertImageToWebp(imageFile: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Failed to get 2D context');

      // Clear canvas to preserve transparency (important for PNG → WEBP)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject('WEBP conversion failed');

          const webpFile = new File(
            [blob],
            imageFile.name.replace(/\.(jpe?g|png|webp)$/i, '.webp'),
            { type: 'image/webp' }
          );

          resolve(webpFile);
        },
        'image/webp',
        0.9 // quality: 0–1 (adjust if needed)
      );
    };

    img.onerror = reject;
    reader.readAsDataURL(imageFile);
  });
}

async function compressWebpImage(imageFile: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp'
  };

  return await imageCompression(imageFile, options);
}

export type ImageProcessingResult = { image?: File; success: boolean };

export async function processImage(
  image: File
): Promise<ImageProcessingResult> {
  try {
    // Convert everything to WEBP
    const webpImage =
      image.type === 'image/webp' ? image : await convertImageToWebp(image);

    // Compress WEBP
    const compressedImage = await compressWebpImage(webpImage);

    return { image: compressedImage, success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}
