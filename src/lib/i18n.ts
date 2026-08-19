import enDictionary from "@/dictionaries/en.json";
import esDictionary from "@/dictionaries/es.json";
import { type Locale } from "@/lib/locales";

export {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_LABEL,
  isLocale,
  withLocale,
  type Locale,
} from "@/lib/locales";

/**
 * El contrato de traducción se deriva de es.json. Si a en.json le falta una
 * clave, el Record de abajo deja de tipar y el build se cae en el typecheck.
 */
export type Dictionary = typeof esDictionary;

const dictionaries: Record<Locale, Dictionary> = {
  es: esDictionary,
  en: enDictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
