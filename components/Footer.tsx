import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "mailto:smashpropickleball@gmail.com";
  };

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative w-[160px] h-[53px]">
                <Image
                  src="/logo.png"
                  alt="Smash Pro Arena"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <div className="flex md:flex-col flex-row gap-x-2">
              <p className="text-gray-400">READY. SET. SMASH!</p>
              <br />
              <div className="flex space-x-4">
                <Link
                  href="https://www.instagram.com/smashproarena/"
                  target="_blank"
                  className="text-gray-400 hover:text-[#40b7ff]"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.google.com/search?q=smash+pro+arena+pickleball"
                  target="_blank"
                  className="text-gray-400 hover:text-[#40b7ff]"
                >
                  <Search className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#40b7ff]">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#location"
                  className="text-gray-400 hover:text-[#40b7ff]"
                >
                  Location
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">160/1, Sardar Patel Road</li>
              <li className="text-gray-400">
                Beside Pizza Zone, Opposite Chutney&apos;s, Begumpet.
              </li>
              <li className="flex items-center gap-2">
                <a
                  href="#"
                  onClick={handleEmailClick}
                  className="text-gray-400 hover:text-[#40b7ff] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  smashpropickleball@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <a
                  href="tel:+917702090273"
                  className="text-gray-400 hover:text-[#40b7ff] transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  +917702090273
                  <span className="text-xs px-2 py-1 rounded-full border border-gray-400 text-gray-400">
                    Click to call
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Hours</h3>

            <ul className="space-y-2">
              <li className="text-gray-400">
                Monday - Sunday: 6 AM - 12 AM {"("}Midnight{")"}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Smash Pro Arena. All rights reserved.
            Crafted by{" "}
            <a
              href="https://aaryansharma.xyz/ "
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#40b7ff] hover:text-[#40b7ff]/80 transition-colors duration-2001 font-medium animate-pulse"
            >
              aaryan.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
