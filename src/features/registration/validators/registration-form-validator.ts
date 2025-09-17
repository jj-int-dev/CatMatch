import * as z from 'zod';
import i18next from '../../../utils/i18n';

const isPasswordFormatValid = (password: string): boolean => {
  // At least 1 uppercase letter, 1 lowercase letter, & 1 digit
  const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  return regex.test(password);
};

const doPasswordsMatch = (
  password: string,
  confirmedPassword: string
): boolean => {
  return password === confirmedPassword;
};

export const registrationFormValidator = z
  .object({
    email: z.email(i18next.t('email_required')),
    password: z
      .string()
      .min(8, i18next.t('password_minimum'))
      .max(64, i18next.t('password_maximum'))
      .refine(isPasswordFormatValid, {
        message: i18next.t('password_format')
      }),
    confirmPassword: z.string().min(1, i18next.t('confirmed_password_required'))
  })
  .refine(
    (formData) => doPasswordsMatch(formData.password, formData.confirmPassword),
    {
      error: i18next.t('passwords_must_match'),
      path: ['confirmPassword']
    }
  );

export type RegistrationFormSchema = z.infer<typeof registrationFormValidator>;
