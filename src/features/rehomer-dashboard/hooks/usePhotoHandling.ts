import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { createAnimalListingPhotosValidator } from '../validators/animalListingPhotosValidator';
import { processImage } from '../../../utils/processImage';

export type UsePhotoHandlingReturn = {
  photos: File[];
  photoPreviews: string[];
  photoValidationErrors: string[];
  isCompressing: boolean;
  validatePhotos: (photosToValidate: File[]) => string[];
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemovePhoto: (index: number) => void;
  compressPhotos: (photosToCompress: File[]) => Promise<{
    compressedPhotos: File[];
    compressionErrors: string[];
  }>;
  setPhotos: React.Dispatch<React.SetStateAction<File[]>>;
  setPhotoPreviews: React.Dispatch<React.SetStateAction<string[]>>;
  setPhotoValidationErrors: React.Dispatch<React.SetStateAction<string[]>>;
  setIsCompressing: React.Dispatch<React.SetStateAction<boolean>>;
  clearPhotos: () => void;
};

export default function usePhotoHandling(
  maxPhotos: number = 5
): UsePhotoHandlingReturn {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [photoValidationErrors, setPhotoValidationErrors] = useState<string[]>(
    []
  );
  const [isCompressing, setIsCompressing] = useState(false);

  // Validate photos using the validator
  const validatePhotos = useCallback(
    (photosToValidate: File[]): string[] => {
      try {
        const validator = createAnimalListingPhotosValidator();
        validator.parse({ photos: photosToValidate });
        return [];
      } catch (error: any) {
        if (error.errors) {
          return error.errors.map((err: any) => err.message);
        }
        return [t('invalid_photos')];
      }
    },
    [t]
  );

  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      // Calculate how many more photos we can add
      const remainingSlots = maxPhotos - photos.length;
      const filesToAdd = Math.min(files.length, remainingSlots);

      const updatedPhotos = [...photos];
      const updatedPreviews = [...photoPreviews];

      for (let i = 0; i < filesToAdd; i++) {
        const file = files[i];
        updatedPhotos.push(file);
        // Create preview URL
        updatedPreviews.push(URL.createObjectURL(file));
      }

      // Validate the updated photos
      const validationErrors = validatePhotos(updatedPhotos);
      setPhotoValidationErrors(validationErrors);

      setPhotos(updatedPhotos);
      setPhotoPreviews(updatedPreviews);
    },
    [photos, photoPreviews, maxPhotos, validatePhotos]
  );

  const handleRemovePhoto = useCallback(
    (index: number) => {
      const newPhotos = [...photos];
      const newPreviews = [...photoPreviews];

      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(newPreviews[index]);

      newPhotos.splice(index, 1);
      newPreviews.splice(index, 1);

      // Validate the remaining photos
      const validationErrors = validatePhotos(newPhotos);
      setPhotoValidationErrors(validationErrors);

      setPhotos(newPhotos);
      setPhotoPreviews(newPreviews);
    },
    [photos, photoPreviews, validatePhotos]
  );

  // Compress all photos before submission
  const compressPhotos = useCallback(
    async (
      photosToCompress: File[]
    ): Promise<{
      compressedPhotos: File[];
      compressionErrors: string[];
    }> => {
      setIsCompressing(true);
      try {
        const compressionPromises = photosToCompress.map((photo, index) => ({
          index,
          promise: processImage(photo)
        }));

        const results = await Promise.all(
          compressionPromises.map(({ promise }) => promise)
        );

        const compressedPhotos: File[] = [];
        const compressionErrors: string[] = [];

        compressionPromises.forEach(({ index }, i) => {
          const result = results[i];
          const originalPhoto = photosToCompress[index];

          if (result.success && result.image) {
            compressedPhotos.push(result.image);
          } else {
            // If compression fails and original photo is > 1MB, add error
            const ONE_MB = 1000000;
            if (originalPhoto.size > ONE_MB) {
              compressionErrors.push(t('compression_failed_large_photo'));
            }
            // Still use the original photo (backend will reject if > 1MB)
            compressedPhotos.push(originalPhoto);
          }
        });

        return { compressedPhotos, compressionErrors };
      } finally {
        setIsCompressing(false);
      }
    },
    [t]
  );

  const clearPhotos = useCallback(() => {
    // Clear all photos and revoke object URLs
    photoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setPhotos([]);
    setPhotoPreviews([]);
    setPhotoValidationErrors([]);
  }, [photoPreviews]);

  return {
    photos,
    photoPreviews,
    photoValidationErrors,
    isCompressing,
    validatePhotos,
    handlePhotoUpload,
    handleRemovePhoto,
    compressPhotos,
    setPhotos,
    setPhotoPreviews,
    setPhotoValidationErrors,
    setIsCompressing,
    clearPhotos
  };
}
