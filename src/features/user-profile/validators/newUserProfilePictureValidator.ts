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

// exporting as a function instead of just the z object will allow the schema to be recreated dynamically whenever the language changes
export const createNewUserProfilePictureValidator = () =>
  z.object({
    profilePicture: z
      .instanceof(FileList)
      .transform((fileList) => (fileList.length > 0 ? fileList[0] : undefined))
      .refine((file) => !!file && file.size > 0, i18next.t('no_image_selected'))
      .refine(
        (file) => file!.size <= MAX_FILE_SIZE,
        `${i18next.t('max_image_size')} ${MAX_FILE_SIZE_MB}MB.`
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file!.type),
        i18next.t('invalid_image_type')
      )
      .optional()
  });

export type NewUserProfilePictureSchema = z.infer<
  ReturnType<typeof createNewUserProfilePictureValidator>
>;
