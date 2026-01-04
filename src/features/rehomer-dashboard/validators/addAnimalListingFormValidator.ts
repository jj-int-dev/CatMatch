import * as z from 'zod';
import i18next from '../../../utils/i18n';
import { addressSuggestionValidator } from '../../../validators/addressSuggestionValidators';

export const createAddAnimalListingFormValidator = () =>
  z.object({
    name: z
      .string()
      .min(1, i18next.t('animal_name_required'))
      .max(200, i18next.t('animal_name_max_length')),
    age: z.preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z
        .number()
        .int(i18next.t('animal_age_whole'))
        .positive(i18next.t('animal_age_positive'))
        .max(1920, i18next.t('animal_age_max'))
    ),
    gender: z.enum(['Male', 'Female'], i18next.t('invalid_gender_selected')),
    description: z
      .string()
      .min(1, i18next.t('animal_desc_required'))
      .max(1000, i18next.t('animal_desc_max')),
    neutered: z.enum(['yes', 'no'], i18next.t('invalid_neutered')),
    address: addressSuggestionValidator
  });

export type AddAnimalListingFormSchema = z.infer<
  ReturnType<typeof createAddAnimalListingFormValidator>
>;
