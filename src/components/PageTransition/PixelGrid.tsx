import { motion, type Variants } from "framer-motion";
import styles from "./PageTransition.module.scss";

const gridVariants: Variants = {
  visible: {
    opacity: 1,
    transition: {
      // анімація дітей запускається при видимому стані
      staggerChildren: 0.004,
      staggerDirection: -1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const squareVariants: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
  },
  hidden: {
    opacity: 0,
    scale: 0,
  },
};

export const PixelGrid = () => {
  const columns = 24;
  const rows = 14;
  const total = columns * rows;
  const squares = Array.from({ length: total });

  return (
    <motion.div
      className={styles.pixelOverlay}
      initial="visible"
      animate="hidden"
      variants={gridVariants}
      aria-hidden="true"
    >
      {squares.map((_, index) => (
        <motion.div
          key={index}
          className={styles.pixelSquare}
          variants={squareVariants}
        />
      ))}
    </motion.div>
  );
};
