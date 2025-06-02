// EXPO
import * as Localization from "expo-localization";

// TRANSLATIONS
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// FILES
import translationEn from "src/i18n/locales/en-US.json";
import translationEs from "src/i18n/locales/es-ES.json";
import translationEu from "src/i18n/locales/eu-ES.json";

i18n.use(initReactI18next).init({
    lng: Localization.getLocales()[0].languageCode ?? "en",
    fallbackLng: "en",
    resources: {
        en: { translation: translationEn },
        es: { translation: translationEs },
        eu: { translation: translationEu },
    },
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
