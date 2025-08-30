import type { NavLinkItem } from '../types/NavLinkItem';
import i18next from '../../../utils/i18n';

export const navLinkItems: NavLinkItem[] = [
  { name: i18next.t('view_edit_profile'), href: '/user-profile' },
  { name: i18next.t('adopt_a_cat'), href: 'login' },
  { name: i18next.t('sign_in'), href: 'login' }
];
