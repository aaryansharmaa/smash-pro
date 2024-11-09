import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
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
            <p className="text-gray-400">
              Where champions are made and memories are created.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-[#40b7ff]">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#40b7ff]">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#40b7ff]">
                <Twitter className="w-5 h-5" />
              </Link>
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
                <Link href="#" className="text-gray-400 hover:text-[#40b7ff]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#40b7ff]">
                  Book a Court
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#40b7ff]">
                  Tournaments
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                123 Sports Avenue
              </li>
              <li className="text-gray-400">
                New York, NY 10001
              </li>
              <li className="text-gray-400">
                info@smashproarena.com
              </li>
              <li className="text-gray-400">
                +1 (555) 123-4567
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Hours</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                Monday - Friday: 6am - 10pm
              </li>
              <li className="text-gray-400">
                Saturday: 7am - 9pm
              </li>
              <li className="text-gray-400">
                Sunday: 8am - 8pm
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Smash Pro Arena. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}