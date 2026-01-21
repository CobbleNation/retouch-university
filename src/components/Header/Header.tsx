/* src/components/Header/Header.tsx */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";
import styles from "./Header.module.scss";

export const Header = () => {
  const { t, locale } = useI18n();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);

  const langRef = useRef<HTMLDivElement | null>(null);

  const localeShortMap: Record<string, string> = {
    en: "EN",
    ua: "UA",
    ru: "RU",
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleMobileLang = () => setIsMobileLangOpen((prev) => !prev);

  const closeAllMobile = () => {
    setIsMobileMenuOpen(false);
    setIsMobileLangOpen(false);
  };

  useEffect(() => {
    if (!isMobileLangOpen) return;

    const onDown = (e: MouseEvent) => {
      if (!langRef.current) return;
      const target = e.target as Node;
      if (!langRef.current.contains(target)) setIsMobileLangOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isMobileLangOpen]);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.row}>
          <Link to="/" className={styles.logo} onClick={closeAllMobile}>
            {t("header.logo")}
          </Link>

          <nav className={styles.navDesktop}>
            {/* <a href="/about" className={styles.navLink}>
              {t("header.about")}
            </a> */}
            <a href="/contacts" className={styles.navLink}>
              {t("header.contacts")}
            </a>
          </nav>

          <div className={styles.right}>
            <div className={styles.langDesktop}>
              <LanguageSelector variant="header" />
            </div>

            {/* Mobile controls */}
            <div className={styles.mobileControls}>
              {/* ✅ Label + Language button */}
              <div className={styles.mobileLangWrap} ref={langRef}>
                <span className={styles.mobileLangLabel}>
                  {t("header.languageSelectLabel")}
                </span>

                <button
                  type="button"
                  className={styles.mobileLangBtn}
                  onClick={toggleMobileLang}
                  aria-label={t("header.languageSelectLabel")}
                  aria-expanded={isMobileLangOpen}
                >
                  <span className={styles.mobileLangCode}>
                    {localeShortMap[locale] ?? "EN"}
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

      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={closeAllMobile} />
      )}
    </header>
  );
};
