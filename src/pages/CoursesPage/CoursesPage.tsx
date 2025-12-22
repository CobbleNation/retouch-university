import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CoursesPage.module.scss";
import { LanguageFilter } from "../../components/LanguageFilter/LanguageFilter";
import { LanguageSelector } from "../../components/LanguageSelector/LanguageSelector";
import { CourseCard } from "../../components/CourseCard/CourseCard";
import { useI18n } from "../../i18n";
import { courses } from "../../data/courses";

export const CoursesPage = () => {
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(
    null
  );

  // Тут потім додаси реальну логіку фільтрації по languageFilter
  const filteredCourses = useMemo(() => {
    return courses;
  }, [languageFilter]);

  const featured = filteredCourses[0] ?? null;

  // щоб featured не дублювався у гріді
  const gridCourses = useMemo(() => {
    if (!featured) return filteredCourses;
    return filteredCourses.filter((c) => c.slug !== featured.slug);
  }, [filteredCourses, featured]);

  const selectedCourse = useMemo(() => {
    if (!selectedCourseSlug) return null;
    return courses.find((c) => c.slug === selectedCourseSlug) ?? null;
  }, [selectedCourseSlug]);

  const openCourseDetails = (slug: string) => {
    navigate(`/courses/${slug}`);
  };

  const handleOpenTariffs = (slug: string) => {
    const course = courses.find((c) => c.slug === slug);
    if (!course) return;

    if (course.tariffs.length === 1) {
      window.open(
        course.tariffs[0].paymentUrl,
        "_blank",
        "noopener,noreferrer"
      );
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
            {/* на десктопі тут селектор, на мобілці сховаємо через CSS */}
            <div className={styles.sidebarLang}>
              <LanguageSelector />
            </div>

            <LanguageFilter
              active={languageFilter}
              onChange={setLanguageFilter}
            />
          </aside>

          <section className={styles.content}>
            <p className={styles.description} id="about">
              {t("coursesPage.description")}
            </p>

            {featured && (
              <div className={styles.featured}>
                <CourseCard
                  title={featured.title[locale]}
                  imageSrc={featured.imageSrc}
                  mode="large"
                  onOpenDetails={() => openCourseDetails(featured.slug)}
                  onOpenTariffs={() => handleOpenTariffs(featured.slug)}
                />
              </div>
            )}

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
