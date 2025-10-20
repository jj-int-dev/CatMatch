import * as z from 'zod';
import i18next from '../../../utils/i18n';

// TODO: add translations for validation error messages

export const createUserProfileFormValidator = () =>
  z.object({
    displayName: z
      .string()
      .min(1, { message: i18next.t('Display name is required') }),
    dateOfBirth: z.union([
      z.literal(''),
      z.iso.date().refine((date) => new Date(date) < new Date(), {
        message: i18next.t('Date of birth must be valid and before today')
      })
    ]),
    phoneNumber: z.union([z.e164(), z.literal('')], {
      message: 'Phone number must follow E.164 format or be empty'
    }), //empty string or E.164 format phone number
    gender: z.literal(['Man', 'Woman', ''], {
      message: 'Gender must be Man, Woman, or empty'
    }),
    bio: z.string()
  });

export type UserProfileFormSchema = z.infer<
  ReturnType<typeof createUserProfileFormValidator>
>;
