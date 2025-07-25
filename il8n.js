import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import en from './locales/en';
import fr from './locales/fr';

i18n.translations = { en, fr };
i18n.fallbacks = true;
i18n.locale = Localization.locale || 'en'; // default

export default i18n;
