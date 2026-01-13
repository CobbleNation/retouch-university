/* src/components/Header/Header.tsx */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";
import styles from "./Header.module.scss";

export const Header = () => {
  const { t, locale } = useI18n();

  // ✅ меню (навігація)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ мова (окремо від меню)
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);

  const langRef = useRef<HTMLDivElement | null>(null);

  const localeFlagMap: Record<string, string> = {
    en: "🇺🇸",
    ua: "🇺🇦",
    ru: "🇷🇺",
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleMobileLang = () => setIsMobileLangOpen((prev) => !prev);

  const closeAllMobile = () => {
    setIsMobileMenuOpen(false);
    setIsMobileLangOpen(false);
  };

  // Закриваємо Language popover по кліку поза ним
  useEffect(() => {
    if (!isMobileLangOpen) return;

    const onDown = (e: MouseEvent) => {
      if (!langRef.current) return;
      const target = e.target as Node;
      if (!langRef.current.contains(target)) {
        setIsMobileLangOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isMobileLangOpen]);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.row}>
          {/* Логотип */}
          <Link to="/" className={styles.logo} onClick={closeAllMobile}>
            {t("header.logo")}
          </Link>

          {/* Десктоп-навігація */}
          <nav className={styles.navDesktop}>
            <a href="/about" className={styles.navLink}>
              {t("header.about")}
            </a>
            <a href="/contacts" className={styles.navLink}>
              {t("header.contacts")}
            </a>
          </nav>

          {/* Правий блок */}
          <div className={styles.right}>
            {/* Мова в десктоп-хедері */}
            <div className={styles.langDesktop}>
              <LanguageSelector variant="header" />
            </div>

            {/* ✅ Мобільні кнопки: Language + Menu */}
            <div className={styles.mobileControls}>
              {/* Language button (flag) */}
              <div className={styles.mobileLangWrap} ref={langRef}>
                <button
                  type="button"
                  className={styles.mobileLangBtn}
                  onClick={toggleMobileLang}
                  aria-label="Language"
                  aria-expanded={isMobileLangOpen}
                >
                  <span className={styles.mobileLangFlag}>
                    {localeFlagMap[locale] ?? "🇺🇸"}
                  </span>
                </button>

                {isMobileLangOpen && (
                  <div className={styles.mobileLangPopover}>
                    <LanguageSelector />
                  </div>
                )}
              </div>

              {/* Menu button */}
              <button
                type="button"
                className={styles.burger}
                onClick={toggleMobileMenu}
                aria-label="Menu"
                aria-expanded={isMobileMenuOpen}
              >
                <img
                  src="/icons/burger-menu.svg"
                  alt=""
                  className={styles.burgerIcon}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Мобільне меню (тільки навігація) */}
      <div
        className={`${styles.mobileMenu} ${
          isMobileMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <div className={styles.mobileMenuInner}>
          <nav className={styles.mobileNav}>
            <a
              href="/about"
              className={styles.mobileNavLink}
              onClick={closeAllMobile}
            >
              {t("header.about")}
            </a>
            <a
              href="/contacts"
              className={styles.mobileNavLink}
              onClick={closeAllMobile}
            >
              {t("header.contacts")}
            </a>
          </nav>
        </div>
      </div>

      {/* Затемнення фону під меню */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={closeAllMobile} />
      )}
    </header>
  );
};
