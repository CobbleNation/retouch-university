// src/layout/Layout.tsx
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  // є плаваючий бар тільки на сторінці курсу
  const hasPurchaseBar = location.pathname.startsWith("/courses/");

  return (
    <div className={`app-root ${hasPurchaseBar ? "app-root--with-bar" : ""}`}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};
