import { useI18n } from "../../i18n";
import styles from "./Footer.module.scss";

export const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className={styles.footer} id="contacts">
      <div className="container">
        <div className={styles.topRow}>
          <div className={styles.brandBlock}>
            <span className={styles.academia}>{t("footer.brand")}</span>
            <h2 className={styles.kyslyi}>{t("footer.academia")}</h2>
          </div>

          <div className={styles.rightBlock}>
            <div className={styles.socials}>
              <span>{t("footer.instagram")}</span>
              <span>•</span>
              <span>{t("footer.telegram")}</span>
            </div>

            <nav className={styles.menu}>
              <h3 className={styles.menuTitle}>{t("footer.menu")}</h3>
              <a href="/" className={styles.menuLink}>
                {t("footer.main")}
              </a>
              {/* <a href="/about" className={styles.menuLink}>
                {t("footer.about")}
              </a> */}
              <a href="/contacts" className={styles.menuLink}>
                {t("footer.contacts")}
              </a>
            </nav>
          </div>

          <p className={styles.copy}>{t("footer.copy")}</p>
        </div>
      </div>
    </footer>
  );
};
