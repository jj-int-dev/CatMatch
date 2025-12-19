import * as z from 'zod';
import i18next from '../../../utils/i18n';

// exporting as a function instead of just the z object will allow the schema to be recreated dynamically whenever the language changes
export const createDiscoveryPreferencesValidator = () =>
  z
    .object({
      minAge: z.preprocess(
        (val) => (val === '' ? 0 : Number(val)),
        z
          .number()
          .min(0, i18next.t('invalid_min_age'))
          .max(480, i18next.t('invalid_min_age'))
      ),
      maxAge: z.preprocess(
        (val) => (val === '' ? 480 : Number(val)),
        z
          .number()
          .min(0, i18next.t('invalid_max_age'))
          .max(480, i18next.t('invalid_max_age'))
      ),
      gender: z.literal(
        ['', 'Male', 'Female'],
        i18next.t('invalid_gender_discovery_preferences')
      ),
      maxDistanceKm: z
        .number()
        .min(1, i18next.t('invalid_max_distance'))
        .max(250, i18next.t('invalid_max_distance')),
      neutered: z.boolean(i18next.t('invalid_neutered'))
    })
    .refine(
      (formData) => {
        if (formData.maxAge < formData.minAge) {
          return false;
        }
      },
      {
        error: i18next.t('invalid_age_range'),
        path: ['minAge', 'maxAge']
      }
    );

export type DiscoveryPreferencesSchema = z.infer<
  ReturnType<typeof createDiscoveryPreferencesValidator>
>;
