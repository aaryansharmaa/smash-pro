"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Compare } from "@/components/ui/compare";

export default function ConsultancyPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main className="min-h-screen bg-black">
        <Navbar />

        {/* Hero Section */}
        <section className="relative h-[60vh] w-full">
          <Image
            src="/f_3.jpg"
            alt="Smash Pro Studio Consultancy"
            fill
            className="object-cover brightness-75 mt-14"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-black/30 z-[11]" />
          <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Your Arena. Our Expertise.
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl drop-shadow-lg">
              Thinking of setting up a pickleball court or arena? With Smash Pro
              Studio Consultancy, you&apos;re not just building a court,
              you&apos;re creating an experience.
            </p>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              What We Help You With
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "360° Arena Setup",
                  description:
                    "Expert location feasibility guidance, court layout planning, and implementation for single or multi-court formats. We ensure your arena meets the highest standards.",
                  image: "/f_2.jpg",
                },
                {
                  title: "Construction & Material Support",
                  description:
                    "Comprehensive guidance on surface options, foundation planning, court dimensions, fencing, drainage, lighting, and professional acrylic coating layers.",
                  image: "/f_3.jpg",
                },
                {
                  title: "Equipment & Branding",
                  description:
                    "Premium equipment recommendations, custom branding solutions, color combinations, court signage, and spectator zone design to create a unique identity.",
                  image: "/equipment.jpg",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl overflow-hidden"
                >
                  <div className="relative h-60 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Comprehensive Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Revenue & Operations
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li>• Cost estimation & ROI planning</li>
                    <li>• Revenue model suggestions</li>
                    <li>• Booking software implementation</li>
                    <li>• Staff planning & training</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Launch & Growth Strategy
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li>• Launch event planning</li>
                    <li>• Marketing strategy development</li>
                    <li>• Community engagement programs</li>
                    <li>• Access control solutions</li>
                  </ul>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Compare
                  firstImage="/after.jpg"
                  secondImage="/before.jpg"
                  className="w-full h-full rounded-lg"
                  showHandlebar={true}
                  autoplay={true}
                  slideMode="hover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Why Choose Smash Pro Consultancy?
            </h2>
            <div className="text-center mb-12">
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                With hands-on experience in real-world arenas, a trusted vendor
                network, and custom solutions for any budget, we focus on
                delivering clean finish & performance in every project.
              </p>
            </div>
            <div className="flex flex-col gap-12 max-w-5xl mx-auto">
              <div className="relative h-[500px] rounded-xl overflow-hidden group">
                <Image
                  src="/f_1.jpg"
                  alt="Project Showcase 1"
                  fill
                  className="object-contain bg-gray-900"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-block px-4 py-1 bg-[#40b7ff]/90 text-black text-sm font-semibold rounded-full mb-2">
                      Featured Project
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[500px] rounded-xl overflow-hidden group">
                <Image
                  src="/f_4.jpg"
                  alt="Project Showcase 2"
                  fill
                  className="object-contain bg-gray-900"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-block px-4 py-1 bg-[#40b7ff]/90 text-black text-sm font-semibold rounded-full mb-2">
                      Client Success
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Start Your Court Journey with Us
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Ready to create your perfect pickleball arena? Let&apos;s discuss
              how we can bring your vision to life with our expert consultancy
              services.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <Link href="tel:+917702090273">
                <Button className="bg-[#40b7ff] text-black hover:bg-[#40b7ff]/80 text-lg py-6 px-8">
                  Contact Our Experts
                </Button>
              </Link>
              <p className="text-gray-400">
                Transform your space into a premium pickleball destination!
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ThemeProvider>
  );
}
