import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  // ✅ price renderer
  const Price = ({ price, oldPrice }: { price: string; oldPrice?: string }) => {
    if (!oldPrice) return <span className={styles.priceNew}>{price}</span>;

    return (
      <span className={styles.priceWithDiscount}>
        <span className={styles.priceOld}>{oldPrice}</span>
        <span className={styles.priceNew}>{price}</span>
      </span>
    );
  };

  // Загальний список фіч (для курсів з кількома тарифами)
  const featureList = [
    t("courseDetails.features.cabinet"),
    t("courseDetails.features.lifetimeAccess"),
    t("courseDetails.features.updates"),
    t("courseDetails.features.homework"),
    t("courseDetails.features.curatorCheck"),
    t("courseDetails.features.calls"),
    // t("courseDetails.features.postSupport"),
  ];

  // ✅ мінімальний тариф по АКТУАЛЬНІЙ ціні
  const minTariff = useMemo(() => {
    if (!course.tariffs.length) return null;

    const parsed = (p: string) => {
      const n = parseInt(p.replace(/\D/g, ""), 10);
      return Number.isFinite(n) ? n : Infinity;
    };

    return course.tariffs.reduce((best, cur) => {
      return parsed(cur.price) < parsed(best.price) ? cur : best;
    }, course.tariffs[0]);
  }, [course.tariffs]);

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

  // ✅ фото для full-width секції
  const fullWidthImageSrc = course.fullWidthImageSrc || "";

  // helpers: підтягуємо значення з infoRows, щоб "актуалізувати інформацію"
  const getInfoValue = (labelKey: string) =>
    course.infoRows.find((r) => r.labelKey === labelKey)?.value?.[locale] ?? "";

  // ✅ "Що входить" для одного тарифу — актуально з infoRows (короткі бейджі)
  const singleTariffMeta = useMemo(() => {
    const lessons = getInfoValue("course.info.lessonsCount");
    const access = getInfoValue("course.info.access");
    const duration = getInfoValue("course.info.lessonDuration");

    const items: string[] = [];
    if (lessons) items.push(lessons);
    if (access) items.push(access);
    if (duration) items.push(duration);

    return items;
  }, [course, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ How it works
  const howItWorks = course.howItWorks;
  const hasHowItWorks = !!howItWorks && (howItWorks.steps?.length ?? 0) > 0;

  const howItWorksExtraText = useMemo(() => {
    if (!howItWorks) return "";

    const parts: string[] = [];
    if (howItWorks.intro?.[locale]) parts.push(howItWorks.intro[locale]);
    if (howItWorks.outro?.[locale]) parts.push(howItWorks.outro[locale]);
    if (howItWorks.files?.[locale]) parts.push(howItWorks.files[locale]);

    return parts.join("\n\n");
  }, [howItWorks, locale]);

  // ✅ Program: підтримка двох форматів
  const program = course.program ?? [];
  const programSections = course.programSections ?? [];
  const hasProgram = programSections.length > 0 || program.length > 0;

  // ✅ START INDEXES for global lesson numbering across modules
  const programSectionStarts = useMemo(() => {
    const starts: number[] = [];
    let counter = 1;
    for (const section of programSections) {
      starts.push(counter);
      counter += section.lessons.length;
    }
    return starts;
  }, [programSections]);

  // ✅ Author block (localized lightweight, без правок локал-файлів)
  const author = useMemo(() => {
    const byLocale = {
      ru: {
        name: "Виктор Кислый",
        role: "Фотограф, ретушёр и преподаватель, чьи знания используют сотни фотографов и ретушеров в мире",
        bullets: [
          "16 лет в фотографии и ретуши",
          "9 лет преподавания",
          "Более 2 500 студентов из 130 стран, многие из которых сегодня работают с ведущими брендами и журналами",
          "Лучший фотограф 35AWARDS 2019 в номинации beauty Photographer и член жюри от Украины на 35AWARDS 2020",
          "Создатель авторской техники ретуши «Акцент на кожу» и автор курсов, по которым учатся сотни профессионалов по всему миру",
          "Работал с брендами DIOR, MAC Cosmetics, Jacob & Co, Givenchy, Shiseido, NARS, Danessa Myricks, PAESE, INGLOT и другими",
          "Работы публиковались в Harper’s BAZAAR, L’Officiel и ведущих международных beauty-изданиях",
        ],
      },
      ua: {
        name: "Віктор Кислий",
        role: "Фотограф, ретушер і викладач, чиї знання використовують сотні фотографів та ретушерів у світі",
        bullets: [
          "16 років у фотографії та ретуші",
          "9 років викладання",
          "Понад 2 500 студентів зі 130 країн, багато з яких сьогодні працюють із провідними брендами та журналами",
          "Найкращий фотограф 35AWARDS 2019 у номінації beauty Photographer та член журі від України на 35AWARDS 2020",
          "Автор техніки ретуші «Акцент на шкіру» та автор курсів, за якими навчаються сотні професіоналів у світі",
          "Працював із брендами DIOR, MAC Cosmetics, Jacob & Co, Givenchy, Shiseido, NARS, Danessa Myricks, PAESE, INGLOT та іншими",
          "Роботи публікувалися в Harper’s BAZAAR, L’Officiel та провідних міжнародних beauty-виданнях",
        ],
      },
      en: {
        name: "Viktor Kyslyi",
        role: "Photographer, retoucher and educator whose knowledge is used by hundreds of photographers and retouchers worldwide",
        bullets: [
          "16 years in photography and retouching",
          "9 years of teaching experience",
          "2,500+ students from 130 countries, many now working with leading brands and magazines",
          "35AWARDS 2019 winner (beauty Photographer) and Ukraine jury member at 35AWARDS 2020",
          "Creator of the “Skin Accent” retouching technique and author of courses used by professionals worldwide",
          "Worked with DIOR, MAC Cosmetics, Jacob & Co, Givenchy, Shiseido, NARS, Danessa Myricks, PAESE, INGLOT and more",
          "Published in Harper’s BAZAAR, L’Officiel and leading international beauty media",
        ],
      },
    } as const;

    return byLocale[locale] ?? byLocale.ru;
  }, [locale]);

  // ✅ Author photo (public/... )
  const authorPhotoSrc = "/images/IMG_1021.JPG";
  const authorPhotoAlt =
    locale === "en"
      ? "Author photo"
      : locale === "ua"
      ? "Фото автора"
      : "Фото автора";

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
          </div>
        </section>
      </div>

      {/* ✅ Замість слайдера — одна фото на всю ширину */}
      {!!fullWidthImageSrc && (
        <section className={styles.fullWidthImageSection}>
          <img
            src={fullWidthImageSrc}
            alt={courseImageAlt}
            className={styles.fullWidthImage}
            loading="lazy"
          />
        </section>
      )}

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

        {/* ✅ AUTHOR — перед тарифами */}
        <section className={styles.authorSection}>
          <div className={styles.authorLeft}>
            <h2 className={styles.sectionTitle}>
              {locale === "en"
                ? "About the author"
                : locale === "ua"
                ? "Про автора"
                : "Об авторе"}
            </h2>

            <div className={styles.authorCard}>
              <div className={styles.authorMetaBlock}>
                <div className={styles.authorName}>{author.name}</div>
                <div className={styles.authorRole}>{author.role}</div>
              </div>

              <div className={styles.authorHero}>
                <img
                  src={authorPhotoSrc}
                  alt={authorPhotoAlt}
                  className={styles.authorHeroImage}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className={styles.authorRight}>
            <ul className={styles.authorList}>
              {author.bullets.map((b, idx) => (
                <li key={idx} className={styles.authorItem}>
                  {b}
                </li>
              ))}
            </ul>
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
            {/* ✅ Якщо тариф один — тільки красива ціна */}
            {isSingleTariff ? (
              <div className={styles.singlePriceCard}>
                <div className={styles.singlePriceTop}>
                  <div className={styles.singlePriceLabel}>
                    {t("courseDetails.singlePriceLabel")}
                  </div>

                  <div className={styles.singlePriceValue}>
                    <Price
                      price={course.tariffs[0].price}
                      oldPrice={course.tariffs[0].oldPrice}
                    />
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
              </div>
            ) : (
              <>
                {/* ✅ Якщо тарифів кілька — як було */}
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
                    </div>

                    <div className={styles.tariffPrice}>
                      <Price price={tariff.price} oldPrice={tariff.oldPrice} />
                    </div>

                    {!!tariff.details && (
                      <div className={styles.tariffExtra}>
                        <div className={styles.tariffExtraTitle}>
                          {tariff.detailsTitle?.[locale]}
                        </div>

                        <div className={styles.tariffExtraBody}>
                          {tariff.details[locale]}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        {/* ✅ ПІСЛЯ ТАРИФІВ: справа 2 блоки (куратор) + (how it works) */}
        {hasHowItWorks && (
          <>
            <hr className={styles.divider} />

            <section className={styles.howItWorksSection}>
              <div className={styles.howItWorksLeft} />
              <div className={styles.howItWorksRight}>
                <div className={styles.howItWorksCard}>
                  <h2 className={styles.sectionTitle}>
                    {locale === "en"
                      ? "How does learning work"
                      : locale === "ua"
                      ? "Як проходить навчання"
                      : "Как проходит обучение"}
                  </h2>

                  {/* intro */}
                  {!!howItWorks?.intro?.[locale] && (
                    <p className={styles.howItWorksParagraph}>
                      {howItWorks.intro[locale]}
                    </p>
                  )}

                  {/* steps */}
                  {(howItWorks?.steps ?? []).length > 0 && (
                    <ul className={styles.howItWorksBullets}>
                      {(howItWorks?.steps ?? []).map((s, i) => (
                        <li key={i} className={styles.howItWorksBulletItem}>
                          {s?.[locale]}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* outro */}
                  {!!howItWorks?.outro?.[locale] && (
                    <p className={styles.howItWorksParagraph}>
                      {howItWorks.outro[locale]}
                    </p>
                  )}

                  {/* files */}
                  {!!howItWorks?.files?.[locale] && (
                    <p className={styles.howItWorksParagraph}>
                      {howItWorks.files[locale]}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        <hr className={styles.divider} />

        {/* ✅ Program */}
        {hasProgram && (
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
                {programSections.length > 0 ? (
                  <div className={styles.programModules}>
                    {programSections.map((section, sIdx) => {
                      const start = programSectionStarts[sIdx] ?? 1;

                      return (
                        <div key={sIdx} className={styles.programModule}>
                          <div className={styles.programModuleTitle}>
                            {section.title[locale]}
                          </div>

                          <ul className={styles.programLessons}>
                            {section.lessons.map((lesson, lIdx) => {
                              const globalNumber = start + lIdx;

                              return (
                                <li key={lIdx} className={styles.programLesson}>
                                  <span className={styles.lessonNumber}>
                                    {globalNumber}
                                  </span>
                                  <span className={styles.lessonText}>
                                    {lesson[locale]}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <ul className={styles.programLessons}>
                    {program.map((step, idx) => (
                      <li key={idx} className={styles.programLesson}>
                        <span className={styles.lessonNumber}>{idx + 1}</span>
                        <span className={styles.lessonText}>{step[locale]}</span>
                      </li>
                    ))}
                  </ul>
                )}
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

          {minTariff && (
            <span className={styles.purchasePrice}>
              {t("courseDetails.from")}{" "}
              <Price price={minTariff.price} oldPrice={minTariff.oldPrice} />
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
                      <Price price={tariff.price} oldPrice={tariff.oldPrice} />
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
