import * as z from 'zod';
import i18next from '../../../utils/i18n';
import { addressSuggestionValidator } from '../../../validators/addressSuggestionValidators';

export const createEditAnimalListingFormValidator = () =>
  z
    .object({
      name: z
        .string()
        .min(1, i18next.t('animal_name_required'))
        .max(200, i18next.t('animal_name_max_length'))
        .optional(),
      age: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z
          .number()
          .int(i18next.t('animal_age_whole'))
          .positive(i18next.t('animal_age_positive'))
          .max(1920, i18next.t('animal_age_max'))
          .optional()
      ),
      gender: z
        .enum(['Male', 'Female'], i18next.t('invalid_gender_selected'))
        .optional(),
      description: z
        .string()
        .min(1, i18next.t('animal_desc_required'))
        .max(1000, i18next.t('animal_desc_max'))
        .optional(),
      neutered: z.enum(['yes', 'no'], i18next.t('invalid_neutered')).optional(),
      address: addressSuggestionValidator.optional()
    })
    .refine(
      (data) => {
        // At least one field should be provided for update
        return Object.keys(data).some(
          (key) => data[key as keyof typeof data] !== undefined
        );
      },
      {
        message: i18next.t('at_least_one_field_required')
      }
    );

export type EditAnimalListingFormSchema = z.infer<
  ReturnType<typeof createEditAnimalListingFormValidator>
>;
