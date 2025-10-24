import * as z from 'zod';
import i18next from '../../../utils/i18n';

export const createUserProfileFormValidator = () =>
  z.object({
    displayName: z
      .string()
      .min(1, { message: i18next.t('display_name_required') }),
    dateOfBirth: z.union([
      z.literal(''),
      z.iso.date().refine((date) => new Date(date) < new Date(), {
        message: i18next.t('invalid_date')
      })
    ]), //empty string or E.164 format phone number
    phoneNumber: z.union([z.e164(), z.literal('')], {
      message: i18next.t('invalid_phone_number')
    }),
    gender: z.literal(['Man', 'Woman', ''], {
      message: i18next.t('invalid_gender')
    }),
    bio: z.string()
  });

export type UserProfileFormSchema = z.infer<
  ReturnType<typeof createUserProfileFormValidator>
>;
