import { useI18n } from "../../i18n";
import styles from "./AboutAuthorPage.module.scss";

export const AboutAuthorPage = () => {
  const { t } = useI18n();

  return (
    <>
      <main className={styles.about}>
        <div className="container">
          <section className={styles.hero}>
            <div className={styles.heroText}>
              <p className={styles.label}>{t("aboutAuthorPage.label")}</p>
              <h1 className={styles.title}>{t("aboutAuthorPage.title")}</h1>
              <p className={styles.subtitle}>{t("aboutAuthorPage.subtitle")}</p>
              <p className={styles.description}>
                {t("aboutAuthorPage.description")}
              </p>
            </div>

            <div className={styles.heroMedia}>
              <div className={styles.mainPhoto}>
                <span className={styles.photoTag}>
                  {t("aboutAuthorPage.photoMainTag")}
                </span>
                <div className={styles.photoStub}>
                  {t("aboutAuthorPage.photoMainPlaceholder")}
                </div>
              </div>

              <div className={styles.photoGrid}>
                <div className={styles.smallPhoto}>
                  <div className={styles.photoStub}>
                    {t("aboutAuthorPage.photoGrid1Placeholder")}
                  </div>
                </div>
                <div className={styles.smallPhoto}>
                  <div className={styles.photoStub}>
                    {t("aboutAuthorPage.photoGrid2Placeholder")}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.content}>
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>
                {t("aboutAuthorPage.storyTitle")}
              </h2>
              <p className={styles.blockText}>
                {t("aboutAuthorPage.storyText")}
              </p>
            </div>

            <div className={styles.blockGrid}>
              <div className={styles.block}>
                <h3 className={styles.blockTitle}>
                  {t("aboutAuthorPage.nowTitle")}
                </h3>
                <p className={styles.blockText}>
                  {t("aboutAuthorPage.nowText")}
                </p>
              </div>

              <div className={styles.block}>
                <h3 className={styles.blockTitle}>
                  {t("aboutAuthorPage.teachingTitle")}
                </h3>
                <p className={styles.blockText}>
                  {t("aboutAuthorPage.teachingText")}
                </p>
              </div>
            </div>
          </section>

          <div className={styles.backRow}>
            <a href="/" className={styles.backLink}>
              {t("aboutAuthorPage.backToMain")}
            </a>
          </div>
        </div>
      </main>
    </>
  );
};
