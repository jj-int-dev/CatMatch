import imageCompression from 'browser-image-compression';

// if an image is a png file, we convert it to jpeg to make compression easier
// then we compress the image

async function convertPngToJpeg(pngFile: File): Promise<File> {
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
      // a png file might have some transparency in it. since jpeg does not
      // support transparency, we replace any transparency with white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject('Conversion failed');
          const jpegFile = new File(
            [blob],
            pngFile.name.replace(/\.png$/i, '.jpg'),
            {
              type: 'image/jpeg'
            }
          );
          resolve(jpegFile);
        },
        'image/jpeg',
        0.9
      );
    };

    img.onerror = reject;
    reader.readAsDataURL(pngFile);
  });
}

async function compressImage(imageFile: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920, // downscale larger images
    useWebWorker: true
  };

  return await imageCompression(imageFile, options);
}

export type ImageProcessingResult = { image?: File; success: boolean };

export async function processImage(
  image: File
): Promise<ImageProcessingResult> {
  try {
    const imageToCompress =
      image.type === 'image/png' ? await convertPngToJpeg(image) : image;
    const compressedImage = await compressImage(imageToCompress);
    return { image: compressedImage, success: true };
  } catch (err) {
    return { success: false };
  }
}
