"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isConsultancyPage = pathname === "/consultancy";

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-sm border-b border-[#40b7ff]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-25">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative w-[280px] h-[100px] flex items-center justify-start ">
                <Image
                  src="/logo.png"
                  alt="Smash Pro Arena"
                  fill
                  priority
                  className="object-left object-contain"
                  sizes="400px"
                />
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isConsultancyPage ? (
                <Link href="/" className="text-white hover:text-[#40b7ff]">
                  <Button
                    variant="ghost"
                    className="text-black bg-[#40b7ff] hover:text-[#40b7ff]"
                  >
                    Home
                  </Button>
                </Link>
              ) : (
                <>
                  <Link
                    href="#location"
                    className="text-white hover:text-[#40b7ff]"
                  >
                    <Button
                      variant="ghost"
                      className="text-white hover:text-[#40b7ff]"
                    >
                      Location
                    </Button>
                  </Link>
                  <Link
                    href="/consultancy"
                    className="text-white hover:text-[#40b7ff]"
                  >
                    <Button
                      variant="ghost"
                      className="text-white hover:text-[#40b7ff]"
                    >
                      Consultancy
                    </Button>
                  </Link>
                  <Link href="#faq" className="text-white hover:text-[#40b7ff]">
                    <Button
                      variant="ghost"
                      className="text-white hover:text-[#40b7ff]"
                    >
                      FAQ
                    </Button>
                  </Link>
                </>
              )}
              <Link href="tel:+917702090273">
                <Button className="bg-[#40b7ff] text-black hover:bg-[#40b7ff]/80">
                  Call and Book
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              className="text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black">
            {isConsultancyPage ? (
              <Link href="/" className="block w-full">
                <Button
                  variant="ghost"
                  className="w-full text-white hover:text-[#40b7ff]"
                >
                  Home
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/" className="block w-full">
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:text-[#40b7ff]"
                  >
                    Home
                  </Button>
                </Link>
                <Link href="#location" className="block w-full">
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:text-[#40b7ff]"
                  >
                    Location
                  </Button>
                </Link>
                <Link href="/consultancy" className="block w-full">
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:text-[#40b7ff]"
                  >
                    Consultancy
                  </Button>
                </Link>
                <Link href="#faq" className="block w-full">
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:text-[#40b7ff]"
                  >
                    FAQ
                  </Button>
                </Link>
              </>
            )}
            <Link href="tel:+917702090273" className="block w-full">
              <Button className="w-full bg-[#40b7ff] text-black hover:bg-[#40b7ff]/80">
                Call and Book
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
