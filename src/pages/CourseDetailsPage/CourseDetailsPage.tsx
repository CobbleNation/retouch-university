import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import useEmblaCarousel from "embla-carousel-react"; // <- більше не треба

import styles from "./CourseDetailsPage.module.scss";
import { coursesMap } from "../../data/courses";
import { useI18n } from "../../i18n";

export const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const course = slug ? coursesMap[slug] : undefined;

  const { t, locale } = useI18n();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // Scroll-lock для модалки
  useEffect(() => {
    if (isTariffModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isTariffModalOpen]);

  if (!course) {
    return (
      <main className={styles.page}>
        <div className="container">
          <button className={styles.backLink} onClick={handleBack}>
            {t("courseDetails.back")}
          </button>
          <p>{t("courseDetails.notFound")}</p>
        </div>
      </main>
    );
  }

  // Загальний список фіч (для курсів з кількома тарифами)
  const featureList = [
    t("courseDetails.features.cabinet"),
    t("courseDetails.features.lifetimeAccess"),
    t("courseDetails.features.updates"),
    t("courseDetails.features.homework"),
    t("courseDetails.features.curatorCheck"),
    t("courseDetails.features.calls"),
    t("courseDetails.features.postSupport"),
  ];

  const prices = course.tariffs
    .map((tarf) => parseInt(tarf.price.replace(/\D/g, ""), 10))
    .filter((n) => Number.isFinite(n));
  const minPrice = prices.length ? Math.min(...prices) : null;

  const isSingleTariff = course.tariffs.length === 1;

  const handleBuyClick = () => {
    if (course.tariffs.length === 1) {
      const url = course.tariffs[0].paymentUrl;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      setIsTariffModalOpen(true);
    }
  };

  const handleTariffSelect = (paymentUrl: string) => {
    setIsTariffModalOpen(false);
    window.open(paymentUrl, "_blank", "noopener,noreferrer");
  };

  const courseImageAlt =
    course.title?.[locale] || t("courseDetails.courseImageAlt");

  // ✅ фото для full-width секції: якщо захочеш інше — додаси в data як fullWidthImageSrc,
  // і воно автоматично підхопиться. Якщо ні — використає imageSrc.
  const fullWidthImageSrc = course.fullWidthImageSrc || course.imageSrc || "";

  // helpers: підтягуємо значення з infoRows, щоб "актуалізувати інформацію"
  const getInfoValue = (labelKey: string) =>
    course.infoRows.find((r) => r.labelKey === labelKey)?.value?.[locale] ?? "";

  // ✅ "Що входить" для одного тарифу — актуально з infoRows (але тепер показуємо НЕ тут, а як "короткі бейджі")
  const singleTariffMeta = useMemo(() => {
    const lessons = getInfoValue("course.info.lessonsCount");
    const access = getInfoValue("course.info.access");
    const duration = getInfoValue("course.info.lessonDuration");

    // короткі мета-рядки під ціну (можна легко змінювати)
    const items: string[] = [];
    if (lessons) items.push(lessons);
    if (access) items.push(access);
    if (duration) items.push(duration);

    return items;
  }, [course, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const program = course.program ?? [];

  return (
    <main className={styles.page}>
      {/* Верхній блок у контейнері */}
      <div className="container">
        <button className={styles.backLink} onClick={handleBack}>
          {t("courseDetails.back")}
        </button>

        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>
              {course.title[locale]}
              {course.subtitle && (
                <>
                  <br />
                  {course.subtitle[locale]}
                </>
              )}
            </h1>
          </div>

          <div className={styles.heroRight}>
            {/* Замість heroText — фото курсу */}
            {course.imageSrc ? (
              <img
                src={course.imageSrc}
                alt={courseImageAlt}
                className={styles.heroImage}
                loading="lazy"
              />
            ) : (
              <div className={styles.heroImagePlaceholder} />
            )}

            {/* heroText НЕ видаляю — просто закоментував */}
            {/*
              <p>{course.heroText[locale]}</p>
            */}
          </div>
        </section>
      </div>

      {/* Було: Слайдер на всю ширину */}
      {/*
      <section className={styles.sliderSection}>
        ...
      </section>
      */}

      {/* ✅ Замість слайдера — одна фото на всю ширину (з data) */}
      <section className={styles.fullWidthImageSection}>
        {fullWidthImageSrc ? (
          <img
            src={fullWidthImageSrc}
            alt={courseImageAlt}
            className={styles.fullWidthImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.fullWidthImagePlaceholder} />
        )}
      </section>

      {/* Основний контент */}
      <div className="container">
        {/* Info */}
        <section className={styles.infoSection}>
          <div className={styles.infoLeft}>
            <dl className={styles.infoList}>
              {course.infoRows.map((row) => (
                <div key={row.labelKey} className={styles.infoRow}>
                  <dt>{t(row.labelKey)}</dt>
                  <dd>{row.value[locale]}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.infoRight}>
            <p>{course.shortDescription[locale]}</p>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* Tariffs */}
        <section className={styles.tariffsSection}>
          <div className={styles.tariffsLeft}>
            <h2 className={styles.sectionTitle}>
              {t("courseDetails.tariffsTitle")}
            </h2>
            <p className={styles.tariffsText}>{course.tariffsIntro[locale]}</p>
          </div>

          <div className={styles.tariffsRight}>
            {/* ✅ Якщо тариф один — не показуємо "Курс" і список, тільки красиву ціну */}
            {isSingleTariff ? (
              <div className={styles.singlePriceCard}>
                <div className={styles.singlePriceTop}>
                  <div className={styles.singlePriceLabel}>
                    {t("courseDetails.singlePriceLabel")}
                  </div>
                  <div className={styles.singlePriceValue}>
                    {course.tariffs[0].price}
                  </div>
                </div>

                {singleTariffMeta.length > 0 && (
                  <div className={styles.singlePriceMeta}>
                    {singleTariffMeta.map((text, idx) => (
                      <span key={idx} className={styles.singlePriceChip}>
                        {text}
                      </span>
                    ))}
                  </div>
                )}

                {/* Кнопку покупки залишаємо в purchaseBar знизу.
                    Але при бажанні можна дублювати кнопку і тут. */}
                {/*
                <button
                  type="button"
                  className={styles.singlePriceButton}
                  onClick={handleBuyClick}
                >
                  {t("courseDetails.buyButton")}
                </button>
                */}
              </div>
            ) : (
              <>
                {/* ✅ Якщо тарифів кілька — залишаємо як зараз */}
                {course.tariffs.map((tariff, idx) => (
                  <div key={idx} className={styles.tariffRow}>
                    <div className={styles.tariffInfo}>
                      <h3 className={styles.tariffTitle}>
                        {tariff.title[locale]}
                      </h3>

                      <ul className={styles.tariffList}>
                        {featureList.map((item, itemIdx) => {
                          const id = itemIdx + 1;
                          const available = tariff.include.includes(id);

                          return (
                            <li
                              key={id}
                              className={
                                available
                                  ? styles.featureAvailable
                                  : styles.featureUnavailable
                              }
                            >
                              {item}
                            </li>
                          );
                        })}
                      </ul>

                      {/* Прибираємо цей хінт зі сторінки, але залишаємо в коді */}
                      {/*
                      <p className={styles.tariffHint}>
                        {t("courseDetails.tariffHint")}
                      </p>
                      */}
                    </div>

                    <div className={styles.tariffPrice}>{tariff.price}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        <hr className={styles.divider} />

        {/* ✅ Program */}
        {program.length > 0 && (
          <>
            <section className={styles.programSection}>
              <div className={styles.programLeft}>
                <h2 className={styles.sectionTitle}>
                  {t("courseDetails.programTitle")}
                </h2>
                <p className={styles.programText}>
                  {t("courseDetails.programSubtitle")}
                </p>
              </div>

              <div className={styles.programRight}>
                <ol className={styles.programList}>
                  {program.map((step, idx) => (
                    <li key={idx} className={styles.programItem}>
                      {step[locale]}
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <hr className={styles.divider} />
          </>
        )}

        {/* FAQ */}
        <section className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>{t("courseDetails.faqTitle")}</h2>

          <div className={styles.faqList}>
            {course.faq.map((item, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div key={idx} className={styles.faqItemWrapper}>
                  <button
                    type="button"
                    className={styles.faqItem}
                    onClick={() => toggleFaq(idx)}
                  >
                    <div className={styles.faqItemHeader}>
                      <span className={styles.faqQuestion}>
                        {item.question[locale]}
                      </span>
                      <span
                        className={isOpen ? styles.faqIconOpen : styles.faqIcon}
                      >
                        +
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className={styles.faqAnswer}>
                      <p>{item.answer[locale]}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Плавающая панель покупки */}
      <div className={styles.purchaseBar}>
        <div className={styles.purchaseInfo}>
          <span className={styles.purchaseTitle}>{course.title[locale]}</span>
          {minPrice !== null && (
            <span className={styles.purchasePrice}>
              {t("courseDetails.from")} {minPrice}$
            </span>
          )}
        </div>

        <button
          type="button"
          className={styles.purchaseButton}
          onClick={handleBuyClick}
        >
          {t("courseDetails.buyButton")}
        </button>
      </div>

      {/* Модалка выбора тарифа */}
      {isTariffModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsTariffModalOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{t("courseDetails.chooseTariff")}</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setIsTariffModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              {course.tariffs.map((tariff, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={styles.modalTariff}
                  onClick={() => handleTariffSelect(tariff.paymentUrl)}
                >
                  <div className={styles.modalTariffInfo}>
                    <span className={styles.modalTariffTitle}>
                      {tariff.title[locale]}
                    </span>
                    <span className={styles.modalTariffPrice}>
                      {tariff.price}
                    </span>
                  </div>
                  <span className={styles.modalTariffHint}>
                    {t("courseDetails.modalTariffHint")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
