import type { TFunction } from 'i18next';

export default function (ageInWeeks: number, t: TFunction): string {
  // Weeks
  if (ageInWeeks < 4) {
    return `${ageInWeeks} ${t('week')}${ageInWeeks === 1 ? '' : t('weeks_plural_suffix')}`;
  }

  // Convert weeks → months (rounded)
  const months = Math.round(ageInWeeks / 4);

  // Months only
  if (months < 12) {
    return `${months} ${t('month')}${months === 1 ? '' : t('months_plural_suffix')}`;
  }

  // Years + months
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} ${t('year')}${years === 1 ? '' : t('years_plural_suffix')}`;
  }

  return `${years} ${t('year')}${years === 1 ? '' : t('years_plural_suffix')} ${remainingMonths} ${t('month')}${
    remainingMonths === 1 ? '' : t('months_plural_suffix')
  }`;
}
