import * as z from 'zod';
import i18next from '../../../utils/i18n';

// TODO: add translations for validation error messages

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];
const MAX_FILE_SIZE_MB = 2;

// exporting as a function instead of just the z object will allow the schema to be recreated dynamically whenever the language changes
export const createNewUserProfilePictureValidator = () =>
  z.object({
    profilePicture: z
      .instanceof(FileList)
      .transform((fileList) => (fileList.length > 0 ? fileList[0] : undefined))
      .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE_MB,
        `Max image size is ${MAX_FILE_SIZE_MB}MB.`
      )
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        '.jpg, .jpeg, .png and .webp files are accepted.'
      )
      .optional()
  });

export type NewUserProfilePictureSchema = z.infer<
  ReturnType<typeof createNewUserProfilePictureValidator>
>;
