import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls to top whenever pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // no UI
};

export default ScrollToTop;
