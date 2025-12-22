import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";

import { Layout } from "./layout/Layout";
import { CoursesPage } from "./pages/CoursesPage/CoursesPage";
import { CourseDetailsPage } from "./pages/CourseDetailsPage/CourseDetailsPage";
import { ContactsPage } from "./components/ContactsPage/ContactsPage";
import { AboutAuthorPage } from "./components/AboutAuthorPage/AboutAuthorPage";
import { PixelGrid } from "./components/PageTransition/PixelGrid";
import { ScrollToTop } from "./components/ScrollToTop";
import styles from "./components/PageTransition/PageTransition.module.scss";

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.35,
      ease: [0.4, 0.0, 1, 1],
    },
  },
};

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <div className={styles.pageTransitionWrapper}>
      <ScrollToTop />

      <PixelGrid key={location.pathname} />

      <Layout>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            <Routes location={location}>
              <Route path="/" element={<CoursesPage />} />
              <Route path="/courses/:slug" element={<CourseDetailsPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/about" element={<AboutAuthorPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Layout>
    </div>
  );
};
