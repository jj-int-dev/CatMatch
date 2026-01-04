import * as z from 'zod';
import i18next from '../../../utils/i18n';

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];
const BYTES_PER_MB = 1000000;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * BYTES_PER_MB;

// Validator for a single photo file
export const createAnimalListingPhotoValidator = () =>
  z.object({
    photo: z
      .instanceof(File)
      .refine((file) => file.size > 0, i18next.t('no_image_selected'))
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        `${i18next.t('max_image_size')} ${MAX_FILE_SIZE_MB}MB.`
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        i18next.t('invalid_image_type')
      )
  });

// Validator for an array of photos (minimum 1, maximum 5)
export const createAnimalListingPhotosValidator = () =>
  z.object({
    photos: z
      .array(z.instanceof(File))
      .min(1, i18next.t('min_photos_required'))
      .max(5, i18next.t('max_photos_exceeded'))
      .refine(
        (files) => files.every((file) => file.size > 0),
        i18next.t('no_image_selected')
      )
      .refine(
        (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
        `${i18next.t('max_image_size')} ${MAX_FILE_SIZE_MB}MB.`
      )
      .refine(
        (files) =>
          files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        i18next.t('invalid_image_type')
      )
  });

export type AnimalListingPhotoSchema = z.infer<
  ReturnType<typeof createAnimalListingPhotoValidator>
>;

export type AnimalListingPhotosSchema = z.infer<
  ReturnType<typeof createAnimalListingPhotosValidator>
>;
