import i18next from '../../../utils/i18n';

export function getAdopterExplanations(): string[] {
  return [
    i18next.t('preferences_desc'),
    i18next.t('discovery_desc'),
    i18next.t('cat_card_desc'),
    i18next.t('swipe_desc'),
    i18next.t('chat_desc')
  ];
}

export function getRehomerExplanations(): string[] {
  return [
    i18next.t('profile_desc'),
    i18next.t('cat_details_desc'),
    i18next.t('interest_desc'),
    i18next.t('swipe_creates_chat_desc'),
    i18next.t('chats_notifications_desc'),
    i18next.t('rehome_desc')
  ];
}
