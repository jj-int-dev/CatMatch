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

const passwordValidator: z.core.$ZodErrorMap<
  z.core.$ZodIssueInvalidType<unknown>
> = (issue) => {
  const password = issue.input as string | undefined;
  const errorMsgs: string[] = [];

  if (password === undefined) {
    errorMsgs.push(i18next.t('password_required'));
  } else {
    if (password.length < 8) {
      errorMsgs.push(i18next.t('password_minimum'));
    }
    if (password.length > 64) {
      errorMsgs.push(i18next.t('password_maximum'));
    }
    if (!isPasswordFormatValid(password)) {
      errorMsgs.push(i18next.t('password_format'));
    }
  }
  return { message: errorMsgs.join('\n') };
};

export const registrationFormValidator = z
  .object({
    email: z.email(i18next.t('email_required')),
    password: z.string({ error: passwordValidator }),
    confirmPassword: z.string(i18next.t('confirmed_password_required'))
  })
  .refine(
    (formData) => doPasswordsMatch(formData.password, formData.confirmPassword),
    {
      error: i18next.t('passwords_must_match'),
      path: ['confirmPassword']
    }
  );

export type RegistrationFormSchema = z.infer<typeof registrationFormValidator>;
