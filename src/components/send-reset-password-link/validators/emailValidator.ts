import * as z from 'zod';
import i18n from '../../../utils/i18n';

export const createEmailValidator = () =>
  z.object({
    email: z.email(i18n.t('invalid_email'))
  });

export type EmailSchema = z.infer<ReturnType<typeof createEmailValidator>>;
