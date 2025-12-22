import { useState } from "react";
import styles from "./LanguageSelector.module.scss";
import { useI18n, type Locale } from "../../i18n";

const AVAILABLE_LOCALES: { code: Locale; label: string }[] = [
  { code: "ru", label: "Русский" },
  { code: "ua", label: "Українська" },
  { code: "en", label: "English" },
];

type LanguageSelectorProps = {
  /**
   * sidebar  – повна версія з заголовком (як на сторінці курсів)
   * header   – компактна таблетка в шапці
   */
  variant?: "sidebar" | "header";
};

export const LanguageSelector = ({
  variant = "sidebar",
}: LanguageSelectorProps) => {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const activeLang =
    AVAILABLE_LOCALES.find((l) => l.code === locale) ?? AVAILABLE_LOCALES[0];

  // ─────────────────────────────
  // ВАРІАНТ ДЛЯ ХЕДЕРА (компактний)
  // ─────────────────────────────
  if (variant === "header") {
    return (
      <div className={styles.headerWrapper}>
        <button
          type="button"
          className={styles.headerTrigger}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className={styles.headerTriggerLabel}>{activeLang.label}</span>
          <span
            className={`${styles.headerArrow} ${
              isOpen ? styles.headerArrowOpen : ""
            }`}
          />
        </button>

        {isOpen && (
          <ul className={styles.headerDropdown}>
            {AVAILABLE_LOCALES.map((lang) => (
              <li key={lang.code} className={styles.headerItem}>
                <button
                  type="button"
                  className={
                    lang.code === locale
                      ? `${styles.headerOption} ${styles.headerOptionActive}`
                      : styles.headerOption
                  }
                  onClick={() => {
                    setLocale(lang.code);
                    setIsOpen(false);
                  }}
                >
                  {lang.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // ─────────────────────────────
  // ВАРІАНТ ДЛЯ САЙДБАРУ (як було)
  // ─────────────────────────────
  return (
    <section className={styles.wrapperSidebar}>
      <p className={styles.label}>{t("coursesPage.chooseLanguage")}</p>

      <ul className={styles.list}>
        {AVAILABLE_LOCALES.map((lang) => (
          <li key={lang.code} className={styles.item}>
            <button
              type="button"
              className={
                lang.code === locale
                  ? `${styles.button} ${styles.buttonActive}`
                  : styles.button
              }
              onClick={() => setLocale(lang.code)}
            >
              {lang.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
