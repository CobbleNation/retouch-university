import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { ru } from "./locales/ru";
import { en } from "./locales/en";
import { ua } from "./locales/ua";

const allDictionaries = {
  ru,
  en,
  ua,
};

export type Locale = keyof typeof allDictionaries;

type I18nContextValue = {
  locale: Locale;
  t: (path: string) => string;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "retouch-university.locale";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function normalizeLocaleFromNavigator(raw: string): Locale {
  const lang = (raw || "").toLowerCase();

  if (lang.startsWith("uk")) return "ua";
  if (lang.startsWith("ru")) return "ru";
  if (lang.startsWith("en")) return "en";

  // ✅ будь-яка інша мова браузера → EN
  return "en";
}

function detectBrowserLocale(): Locale {
  // ✅ SSR: дефолт EN
  if (typeof window === "undefined") {
    return "en";
  }

  // 1) якщо вже є збережена мова — повертаємо її
  const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved && saved in allDictionaries) {
    return saved;
  }

  // 2) беремо мову браузера
  const nav = window.navigator;
  const langRaw = (nav.languages && nav.languages[0]) || nav.language || "en";

  return normalizeLocaleFromNavigator(langRaw);
}

function getInitialLocale(defaultLocale: Locale): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  try {
    return detectBrowserLocale();
  } catch {
    return defaultLocale;
  }
}

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

type I18nProviderProps = {
  children: ReactNode;
  defaultLocale?: Locale;
};

export const I18nProvider = ({
  children,
  // ✅ головна мова сайту — EN
  defaultLocale = "en",
}: I18nProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(() =>
    getInitialLocale(defaultLocale)
  );

  const dict = useMemo(() => allDictionaries[locale], [locale]);

  const t = (path: string): string => {
    const parts = path.split(".");
    let current: any = dict;

    for (const p of parts) {
      if (current && typeof current === "object" && p in current) {
        current = current[p];
      } else {
        return path;
      }
    }

    return typeof current === "string" ? current : path;
  };

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return ctx;
};
