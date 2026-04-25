import { useLocation } from "react-router-dom";
import Footer from "./Footer";

function FooterWrapper() {
  const location = useLocation();
  const pathname = location.pathname;

  const hideFooter =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/doctor") ||
    pathname.startsWith("/medical") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  if (hideFooter) return null;

  return <Footer />;
}

export default FooterWrapper;
