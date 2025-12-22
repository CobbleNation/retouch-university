// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  // 1) Вимикаємо автозбереження скролу браузером
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // 2) При кожній зміні маршруту — скидаємо скролл угору
  useEffect(() => {
    // чекаємо кадр, щоб новий контент встиг відрендеритись
    requestAnimationFrame(() => {
      // жорстко скидаємо скролл
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto", // без smooth, щоб анімації сторінки не плутались
      });

      // додатково на всякий випадок
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, [pathname]);

  return null;
};
