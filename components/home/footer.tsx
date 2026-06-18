import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-16" id="footer">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight mb-4">Gurugram IT Networks</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Your trusted technology partner for reliable IT solutions, security systems, and business infrastructure services. Serving customers for 9+ years.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 text-gray-500 mt-0.5" />
                <span>Shop No. 109, Aapka Bazar, Near Bus Stand, Gurugram</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <a href="tel:+918750077878" className="hover:text-white transition-colors">+91 87500 77878</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <a href="mailto:info@gurugramitnetworks.com" className="hover:text-white transition-colors">info@gurugramitnetworks.com</a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Shop Laptops", href: "/shop" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "My Account", href: "/profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Policies</h4>
            <ul className="space-y-2.5">
              {[
                "Return Policy",
                "Warranty Info",
                "Privacy Policy",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get notified about new deals and exclusive offers.
            </p>
            <div className="flex rounded-xl overflow-hidden border border-gray-800 focus-within:border-gray-600 transition-colors">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none"
              />
              <button className="px-4 bg-white text-gray-900 font-bold text-sm hover:bg-gray-200 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Gurugram IT Networks. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span>|</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
            <span>|</span>
            <span className="hover:text-white transition-colors cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
