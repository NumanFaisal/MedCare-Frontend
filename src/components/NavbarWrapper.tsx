import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function NavbarWrapper() {
  const location = useLocation();

  const pathname = location.pathname;

  const hideNavbar =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/dashboard");

  if (hideNavbar) return null;

  return <Navbar />;
}

export default NavbarWrapper;
