import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CoursesPage.module.scss";
import { LanguageSelector } from "../../components/LanguageSelector/LanguageSelector";
import { CourseCard } from "../../components/CourseCard/CourseCard";
import { useI18n } from "../../i18n";
import { courses, COURSE_CATEGORIES, type CourseCategory } from "../../data/courses";

type CategoryId = "all" | CourseCategory;

export const CoursesPage = () => {
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  // ✅ NEW: категорія
  const [category, setCategory] = useState<CategoryId>("all");

  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null);

  // 🔧 Поки що featured-блок вимкнений
  const SHOW_FEATURED = false;

  // ✅ 1) Спочатку фільтруємо курси по мові UI:
  // en -> тільки courseLang === "en"
  // ru/ua -> тільки courseLang !== "en"
  const localeCourses = useMemo(() => {
    const list =
      locale === "en"
        ? courses.filter((c) => c.courseLang === "en")
        : courses.filter((c) => c.courseLang !== "en");

    return [...list].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [locale]);

  // ✅ 2) Скидаємо фільтри при зміні мови
  useEffect(() => {
    setCategory("all");
    setSelectedCourseSlug(null);
  }, [locale]);

  // ✅ 3) Фільтр по категорії (all -> всі)
  const filteredCourses = useMemo(() => {
    if (category === "all") return localeCourses;
    return localeCourses.filter((c) => c.category === category);
  }, [category, localeCourses]);

  const featured = filteredCourses[0] ?? null;

  const gridCourses = useMemo(() => {
    if (!SHOW_FEATURED) return filteredCourses;
    if (!featured) return filteredCourses;
    return filteredCourses.filter((c) => c.slug !== featured.slug);
  }, [filteredCourses, featured, SHOW_FEATURED]);

  const selectedCourse = useMemo(() => {
    if (!selectedCourseSlug) return null;
    return localeCourses.find((c) => c.slug === selectedCourseSlug) ?? null;
  }, [selectedCourseSlug, localeCourses]);

  const openCourseDetails = (slug: string) => {
    navigate(`/courses/${slug}`);
  };

  const handleOpenTariffs = (slug: string) => {
    const course = localeCourses.find((c) => c.slug === slug);
    if (!course) return;

    if (course.tariffs.length === 1) {
      window.open(course.tariffs[0].paymentUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setSelectedCourseSlug(slug);
  };

  const handleCloseTariffs = () => {
    setSelectedCourseSlug(null);
  };

  const handleTariffSelect = (paymentUrl: string) => {
    setSelectedCourseSlug(null);
    window.open(paymentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main className={styles.page} id="courses">
      <div className="container">
        <section className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarLang}>
              <LanguageSelector />
            </div>

            {/* ✅ NEW: Категорії */}
            <div className={styles.categories}>
              <div className={styles.categoriesTitle}>
                {t("coursesPage.categoriesTitle")}
              </div>

              <div className={styles.categoriesList}>
                {COURSE_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`${styles.categoryBtn} ${
                      category === c.id ? styles.categoryBtnActive : ""
                    }`}
                    onClick={() => setCategory(c.id as CategoryId)}
                  >
                    {t(`coursesPage.categories.${c.id}`)}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className={styles.content}>
            <p className={styles.description} id="about">
              {t("coursesPage.description")}
            </p>

            <div className={styles.grid}>
              {gridCourses.map((course) => (
                <CourseCard
                  key={course.slug}
                  title={course.title[locale]}
                  imageSrc={course.imageSrc}
                  onOpenDetails={() => openCourseDetails(course.slug)}
                  onOpenTariffs={() => handleOpenTariffs(course.slug)}
                />
              ))}
            </div>

            <button className={styles.loadMore} type="button">
              {t("coursesPage.loadMore")}
            </button>
          </section>
        </section>
      </div>

      {/* Модалка тарифів */}
      {selectedCourse && (
        <div className={styles.modalOverlay} onClick={handleCloseTariffs}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{t("courseDetails.chooseTariff")}</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={handleCloseTariffs}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              {selectedCourse.tariffs.map((tariff, idx) => (
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
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
