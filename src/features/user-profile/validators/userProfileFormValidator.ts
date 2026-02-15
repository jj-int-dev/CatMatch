import * as z from 'zod';
import i18next from '../../../utils/i18n';

export const createUserProfileFormValidator = () =>
  z.object({
    displayName: z
      .string(i18next.t('invalid_display_name'))
      .min(1, { message: i18next.t('display_name_required') }),
    dateOfBirth: z.union(
      [
        z.literal(''),
        z.string().refine((date: string) => {
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime()) && parsedDate < new Date();
        })
      ],
      { message: i18next.t('invalid_date') }
    ),
    phoneNumber: z.union([z.e164(), z.literal('')], {
      message: i18next.t('invalid_phone_number')
    }),
    gender: z.enum(['Man', 'Woman', ''], {
      message: i18next.t('invalid_gender')
    }),
    bio: z.string(i18next.t('invalid_bio'))
  });

export type UserProfileFormSchema = z.infer<
  ReturnType<typeof createUserProfileFormValidator>
>;
