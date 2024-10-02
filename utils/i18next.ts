import en from "@/assets/locates/en";
import ja from "@/assets/locates/ja";
import { storage } from "@/store/storage";
import * as Localization from "expo-localization";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
  en: { translation: en },
  ja: { translation: ja },
};

const DEFAULT_LANG = "en";

const initI18n = () => {
  let savedLanguage = storage.getString("language");

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageCode ?? "";
  }

  i18next.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: savedLanguage,
    fallbackLng: DEFAULT_LANG,
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export const onChangeLanguageApp = (key: string) => {
  i18next.changeLanguage(key);
};

export default i18next;
