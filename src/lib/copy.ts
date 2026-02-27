import enCommon from "@/content/en/common.json";
import enHome from "@/content/en/home.json";
import enAbout from "@/content/en/about.json";
import enContact from "@/content/en/contact.json";

import zhCommon from "@/content/zh/common.json";
import zhHome from "@/content/zh/home.json";
import zhAbout from "@/content/zh/about.json";
import zhContact from "@/content/zh/contact.json";

import type { Locale } from "@/lib/i18n";

type Bundle = {
  common: typeof enCommon;
  home: typeof enHome;
  about: typeof enAbout;
  contact: typeof enContact;
};

const content: Record<Locale, Bundle> = {
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    contact: enContact
  },
  zh: {
    common: zhCommon,
    home: zhHome,
    about: zhAbout,
    contact: zhContact
  }
};

export function getCopy(locale: Locale): Bundle {
  return content[locale];
}
