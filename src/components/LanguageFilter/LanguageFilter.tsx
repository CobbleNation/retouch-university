import { useI18n } from "../../i18n";
import styles from "./LanguageFilter.module.scss";

type LanguageFilterProps = {
  active: string;
  onChange: (value: string) => void;
};

type FilterOption = {
  value: string;
  labelKey: string;
};

const OPTIONS: FilterOption[] = [
  { value: "all", labelKey: "coursesPage.filters.all" },
  {
    value: "retouch-architecture",
    labelKey: "coursesPage.filters.retouchArchitecture",
  },
  {
    value: "shoot-architecture",
    labelKey: "coursesPage.filters.shootArchitecture",
  },
  {
    value: "color-architecture",
    labelKey: "coursesPage.filters.colorArchitecture",
  },
];

export const LanguageFilter = ({ active, onChange }: LanguageFilterProps) => {
  const { t } = useI18n();

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{t("coursesPage.availableCourses")}</h2>

      <div className={styles.buttons}>
        {OPTIONS.map((opt) => (
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
            {t(opt.labelKey)}
          </button>
        ))}
      </div>
    </section>
  );
};
