import * as z from 'zod';
import i18next from '../../../utils/i18n';

const isPasswordFormatValid = (password: string): boolean => {
  // At least 1 uppercase letter, 1 lowercase letter, & 1 digit
  const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  return regex.test(password);
};

export const loginFormValidator = z.object({
  email: z.email(i18next.t('email_required')),
  password: z
    .string()
    .min(8, i18next.t('password_minimum'))
    .max(64, i18next.t('password_maximum'))
    .refine(isPasswordFormatValid, {
      message: i18next.t('password_format')
    })
});

export type LoginFormSchema = z.infer<typeof loginFormValidator>;
