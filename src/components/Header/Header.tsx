import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";
import styles from "./Header.module.scss";

export const Header = () => {
  const { t } = useI18n();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.row}>
          {/* Логотип */}
          <Link to="/" className={styles.logo} onClick={closeMobile}>
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

          {/* Правий блок: мова + бургер */}
          <div className={styles.right}>
            {/* Мова в десктоп-хедері (компактна) */}
            <div className={styles.langDesktop}>
              <LanguageSelector variant="header" />
            </div>

            {/* Бургер тільки на мобільних */}
            <button
              type="button"
              className={`${styles.burger} ${
                isMobileOpen ? styles.burgerActive : ""
              }`}
              onClick={toggleMobile}
              aria-label="Меню"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      {/* Мобільне меню */}
      <div
        className={`${styles.mobileMenu} ${
          isMobileOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <div className={styles.mobileMenuInner}>
          {/* Мова в мобільному меню (повна версія) */}
          <div className={styles.mobileLang}>
            <LanguageSelector />
          </div>

          <nav className={styles.mobileNav}>
            <a
              href="/about"
              className={styles.mobileNavLink}
              onClick={closeMobile}
            >
              {t("header.about")}
            </a>
            <a
              href="/contacts"
              className={styles.mobileNavLink}
              onClick={closeMobile}
            >
              {t("header.contacts")}
            </a>
          </nav>
        </div>
      </div>

      {/* Затемнення фону під меню */}
      {isMobileOpen && (
        <div className={styles.mobileOverlay} onClick={closeMobile} />
      )}
    </header>
  );
};
