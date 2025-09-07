import i18next from '../../../utils/i18n';

export type NavLinkItem = {
  name: string;
  href: string;
  authRequired?: boolean;
  unAuthRequired?: boolean;
};

export const navLinkItems: NavLinkItem[] = [
  { name: i18next.t('adopt_a_cat'), href: '/discovery', authRequired: true },
  { name: i18next.t('sign_in'), href: '/login', unAuthRequired: true }
];
