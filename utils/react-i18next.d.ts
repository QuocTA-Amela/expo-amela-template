import "react-i18next";
import { resources } from "./i18next";

export declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: Record<Language, Resource>;
  }
  type TranslationKeys = TFuncKey<(keyof resources)[]>;
}
