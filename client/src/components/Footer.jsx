import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050807] border-t border-emerald-900/30 text-[#F5F2EB] pt-16 pb-8 md:pt-20 md:pb-10 relative overflow-hidden">
      {/* Subtle Glow in background */}
      <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-hba mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* 🌟 4-Column Grid with tight, zero-waste spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-medium text-white mb-3">
                Holy Basil Ayurveda
              </h3>
              <p className="text-sm leading-relaxed text-[#F5F2EB]/60">
                Premium Ayurvedic wellness products and quality-focused
                private-label manufacturing for modern brands.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/holybasil_ayurveda_official?igsi=MWp2YnJhMnNmM3kwZw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#121E1A] border border-emerald-900/50 flex items-center justify-center text-[#F5F2EB]/70 hover:text-emerald-400 hover:border-emerald-500 transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/share/1XAZJdhAWe/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#121E1A] border border-emerald-900/50 flex items-center justify-center text-[#F5F2EB]/70 hover:text-emerald-400 hover:border-emerald-500 transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#121E1A] border border-emerald-900/50 flex items-center justify-center text-[#F5F2EB]/70 hover:text-emerald-400 hover:border-emerald-500 transition-all"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/holybasil-ayurveda-products-private-limited/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#121E1A] border border-emerald-900/50 flex items-center justify-center text-[#F5F2EB]/70 hover:text-emerald-400 hover:border-emerald-500 transition-all"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500/70 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F5F2EB]/70">
              <li>
                <Link
                  to="/products"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-emerald-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/quality"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Quality
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Ayurveda Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Business */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500/70 mb-4">
              Business
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F5F2EB]/70">
              <li>
                <Link
                  to="/manufacturing"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Manufacturing
                </Link>
              </li>
              <li>
                <Link
                  to="/franchise"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Franchise
                </Link>
              </li>
              <li>
                <Link
                  to="/quote"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Request a Quote
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get in Touch & Pinned Map */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500/70 mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F5F2EB]/70 mb-4">
              <li className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="text-emerald-500/70 shrink-0 mt-0.5"
                />
                <span className="leading-relaxed">
                  294, F Block, Sector-63, Noida, Gautam Buddha Nagar, UP –
                  201301.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-emerald-500/70 shrink-0" />
                <a
                  href="mailto:care@holybasilayurveda.com"
                  className="hover:text-emerald-400 transition-colors truncate"
                >
                  care@holybasilayurveda.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-500/70 shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-emerald-400 transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
            </ul>

            {/* 🌟 Exact Google Maps Location & Clickable Link */}
            <div className="w-full h-32 rounded-xl overflow-hidden border border-emerald-900/50 shadow-md relative group">
              <a
                href="https://www.google.com/maps/place/HOLYBASIL+AYURVEDA+PRODUCTS+PVT.+LTD/@28.621264,77.388467,16z/data=!4m6!3m5!1s0x390cef9107afc6cb:0x935c9d51ba67d54b!8m2!3d28.6212644!4d77.3884668!16s%2Fg%2F11t81bfppg?hl=en&entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full relative"
              >
                <iframe
                  title="Holy Basil Ayurveda Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.1017355182967!2d77.3858919!3d28.6212644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef9107afc6cb%3A0x935c9d51ba67d54b!2sHOLYBASIL%20AYURVEDA%20PRODUCTS%20PVT.%20LTD!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: "invert(90%) hue-rotate(180deg)",
                    pointerEvents: "none",
                  }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors flex items-end justify-end p-2">
                  <span className="bg-[#080D0A]/90 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 shadow">
                    Open Map ↗
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-emerald-900/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#F5F2EB]/40">
          <p>
            © {new Date().getFullYear()} Holy Basil Ayurveda. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/privacy"
              className="hover:text-[#F5F2EB] transition-colors"
            >
              Privacy
            </Link>
            <span className="w-1 h-1 rounded-full bg-emerald-900/50"></span>
            <Link
              to="/terms"
              className="hover:text-[#F5F2EB] transition-colors"
            >
              Terms
            </Link>
            <span className="w-1 h-1 rounded-full bg-emerald-900/50"></span>
            <Link
              to="/shipping"
              className="hover:text-[#F5F2EB] transition-colors"
            >
              Shipping
            </Link>
            <span className="w-1 h-1 rounded-full bg-emerald-900/50"></span>
            <Link
              to="/refunds"
              className="hover:text-[#F5F2EB] transition-colors"
            >
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
