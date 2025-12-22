// src/components/ContactsPage/ContactsPage.tsx
import { useI18n } from "../../i18n";
import styles from "./ContactsPage.module.scss";
import { Footer } from "../Footer/Footer";

const INSTAGRAM_URL = "https://instagram.com/your_username";
const TELEGRAM_URL = "https://t.me/your_username";
const WHATSAPP_URL = "https://wa.me/380000000000"; // заміниш на свій

export const ContactsPage = () => {
  const { t } = useI18n();

  return (
    <>
      <main className={styles.contacts}>
        <div className="container">
          <section className={styles.hero}>
            <div className={styles.heroText}>
              <p className={styles.academiaLabel}>{t("contactsPage.label")}</p>
              <h1 className={styles.title}>{t("contactsPage.title")}</h1>
              <p className={styles.description}>
                {t("contactsPage.description")}
              </p>
            </div>

            <div className={styles.channels}>
              <div className={styles.channelCard}>
                <span className={styles.channelLabel}>
                  {t("contactsPage.preferred")}
                </span>
                <h2 className={styles.channelTitle}>Instagram</h2>
                <p className={styles.channelText}>
                  {t("contactsPage.instagramText")}
                </p>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.channelButton}
                >
                  {t("contactsPage.instagramButton")}
                </a>
              </div>

              <div className={styles.channelCard}>
                <h2 className={styles.channelTitle}>Telegram</h2>
                <p className={styles.channelText}>
                  {t("contactsPage.telegramText")}
                </p>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.channelButton}
                >
                  {t("contactsPage.telegramButton")}
                </a>
              </div>

              <div className={styles.channelCard}>
                <h2 className={styles.channelTitle}>WhatsApp</h2>
                <p className={styles.channelText}>
                  {t("contactsPage.whatsappText")}
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.channelButton}
                >
                  {t("contactsPage.whatsappButton")}
                </a>
              </div>
            </div>
          </section>

          <div className={styles.backRow}>
            <a href="/" className={styles.backLink}>
              {t("contactsPage.backToMain")}
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
