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

// exporting as a function instead of just the z object will allow the schema to be recreated dynamically whenever the language changes
export const createNewPasswordValidator = () =>
  z
    .object({
      newPassword: z
        .string()
        .min(8, i18next.t('password_minimum'))
        .max(64, i18next.t('password_maximum'))
        .refine(isPasswordFormatValid, {
          message: i18next.t('password_format')
        }),
      confirmPassword: z
        .string()
        .min(1, i18next.t('confirmed_password_required'))
    })
    .refine(
      (formData) =>
        doPasswordsMatch(formData.newPassword, formData.confirmPassword),
      {
        error: i18next.t('passwords_must_match'),
        path: ['confirmPassword']
      }
    );

export type NewPasswordFormSchema = z.infer<
  ReturnType<typeof createNewPasswordValidator>
>;
