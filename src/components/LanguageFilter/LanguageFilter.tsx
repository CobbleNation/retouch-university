import { useMemo } from "react";
import { useI18n } from "../../i18n";
import styles from "./LanguageFilter.module.scss";
import type { Course } from "../../data/courses";

type LanguageFilterProps = {
  active: string;
  onChange: (value: string) => void;
  courses: Course[];
};

type FilterOption = {
  value: string; // "all" або slug
  label: string; // текст кнопки
};

export const LanguageFilter = ({
  active,
  onChange,
  courses,
}: LanguageFilterProps) => {
  const { t, locale } = useI18n();

  const options: FilterOption[] = useMemo(() => {
    // Унікальні курси по slug, стабільний порядок як в масиві courses
    const uniq = new Map<string, Course>();
    courses.forEach((c) => {
      if (!uniq.has(c.slug)) uniq.set(c.slug, c);
    });

    return [
      { value: "all", label: t("coursesPage.filters.all") },
      ...Array.from(uniq.values()).map((c) => ({
        value: c.slug,
        label: c.title[locale],
      })),
    ];
  }, [courses, locale, t]);

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t("coursesPage.availableCourses")}</h2>

      <div className={styles.buttons}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={
              opt.value === active
                ? `${styles.button} ${styles.buttonActive}`
                : styles.button
            }
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </section>
  );
};
