import i18next from '../../../utils/i18n';
import englishIcon from '../../../assets/english_icon.png';
import spanishIcon from '../../../assets/spanish_icon.png';

export function getLanguageIcon(): string {
  switch (i18next.language) {
    case 'en':
      return englishIcon;
    case 'es':
      return spanishIcon;
    default:
      return englishIcon;
  }
}

export function setLanguage(language: string): void {
  i18next.changeLanguage(language);
}
