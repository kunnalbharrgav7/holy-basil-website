import { Link } from "react-router-dom";
import logoImg from "../assets/Logo/logo.png";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex min-w-0 items-center gap-2.5 group"
      aria-label="Holy Basil Ayurveda"
    >
      <img 
        src={logoImg} 
        alt="Holy Basil Ayurveda" 
        className="h-14 sm:h-16 md:h-16 w-auto object-contain transition-transform group-hover:scale-105"
      />
    </Link>
  );
}
