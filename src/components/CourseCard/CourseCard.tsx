import styles from "./CourseCard.module.scss";
import ArrowRightIcon from "/icons/arrow-right.svg";
import { useI18n } from "../../i18n";

type CourseCardProps = {
  title: string;
  imageSrc?: string; // ✅ додали
  mode?: "large" | "regular";
  onOpenDetails?: () => void;
  onOpenTariffs?: () => void;
};

export const CourseCard = ({
  title,
  imageSrc,
  mode = "regular",
  onOpenDetails,
  onOpenTariffs,
}: CourseCardProps) => {
  const { t } = useI18n();
  const isLarge = mode === "large";

  const handleDetailsClick = () => {
    if (onOpenDetails) onOpenDetails();
  };

  const handleTariffsClick = () => {
    if (onOpenTariffs) onOpenTariffs();
  };

  const ImageBlock = (
    <div
      className={
        isLarge ? styles.imagePlaceholderLarge : styles.imagePlaceholder
      }
      onClick={handleDetailsClick}
      role={onOpenDetails ? "button" : undefined}
    >
      {imageSrc ? (
        <img className={styles.image} src={imageSrc} alt={title} />
      ) : null}
    </div>
  );

  if (isLarge) {
    return <article className={styles.cardLarge}>{ImageBlock}</article>;
  }

  return (
    <article className={styles.card}>
      <h3 className={styles.title} onClick={handleDetailsClick}>
        {title}
      </h3>

      {ImageBlock}

      <div className={styles.content}>
        <div className={styles.bottomRow}>
          <button
            className={styles.linkButton}
            type="button"
            onClick={handleDetailsClick}
          >
            {t("courseCard.more")}
            <img src={ArrowRightIcon} alt="" className={styles.linkIcon} />
          </button>

          <button
            className={styles.primaryButton}
            type="button"
            onClick={handleTariffsClick}
          >
            {t("courseCard.goToCourse")}
          </button>
        </div>
      </div>
    </article>
  );
};
