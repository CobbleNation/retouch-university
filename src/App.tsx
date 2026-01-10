import { BrowserRouter } from "react-router-dom";

import { AnimatedRoutes } from "./AnimatedRoutes";
import { GoogleAnalytics } from "./components/GoogleAnalytics";

function App() {
  return (
    <BrowserRouter>
      <GoogleAnalytics />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
