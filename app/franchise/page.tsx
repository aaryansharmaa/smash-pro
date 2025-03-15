"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Compare } from "@/components/ui/compare";

export default function FranchisePage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main className="min-h-screen bg-black">
        <Navbar />

        {/* Hero Section */}
        <section className="relative h-[60vh] w-full">
          <Image
            src="/f_3.jpg"
            alt="Smash Pro Pickleball Arena"
            fill
            className="object-cover brightness-75 mt-14 "
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-black/30 z-[11]" />
          <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Join the Growing Pickleball Revolution
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl drop-shadow-lg">
              Be part of the fastest-growing sport in India with Smash Pro
              Pickleball Arena&apos;s premium franchise opportunity
            </p>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Why Partner With Smash Pro?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Complete Court Setup",
                  description:
                    "From planning the perfect layout to procuring top-quality equipment, we handle every aspect of setting up your arena.",
                  image: "/f_2.jpg",
                },
                {
                  title: "Expert Training & Support",
                  description:
                    "We help you find and train the right talent, ensuring your team delivers an outstanding experience to every player.",
                  image: "/f_3.jpg",
                },
                {
                  title: "Premium Equipment Partners",
                  description:
                    "Access our extensive network of equipment suppliers, offering various types and options with flexible choices to suit your needs.",
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
              Your Success, Our Priority
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Comprehensive Support Package
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li>• Premium Court Design & Setup</li>
                    <li>• Staff Recruitment & Training Programs</li>
                    <li>• Streamlined Operations Manual</li>
                    <li>• Marketing & Branding Support</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Equipment Partnership Benefits
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li>• Flexible Equipment Options</li>
                    <li>• Premium Supplier Network</li>
                    <li>• Customizable Court Setups</li>
                    <li>• Ongoing Equipment Support</li>
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
              Industry Recognition
            </h2>
            <div className="text-center mb-12">
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our commitment to quality has earned us glowing reviews from
                happy clients and features in leading newspapers. Join a network
                that&apos;s setting the standard in the pickleball industry.
              </p>
            </div>
            <div className="flex flex-col gap-12 max-w-5xl mx-auto">
              <div className="relative h-[500px] rounded-xl overflow-hidden group">
                <Image
                  src="/f_1.jpg"
                  alt="Newspaper Feature 1"
                  fill
                  className="object-contain bg-gray-900"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-block px-4 py-1 bg-[#40b7ff]/90 text-black text-sm font-semibold rounded-full mb-2">
                      Featured Article
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[500px] rounded-xl overflow-hidden group">
                <Image
                  src="/f_4.jpg"
                  alt="Newspaper Feature 2"
                  fill
                  className="object-contain bg-gray-900"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-block px-4 py-1 bg-[#40b7ff]/90 text-black text-sm font-semibold rounded-full mb-2">
                      Press Coverage
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
              Ready to Join the Revolution?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Take the first step towards owning your premium pickleball arena.
              Contact us today to learn more about this incredible opportunity.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <Link href="tel:+917702090273">
                <Button className="bg-[#40b7ff] text-black hover:bg-[#40b7ff]/80 text-lg py-6 px-8">
                  Call Us
                </Button>
              </Link>
              <p className="text-gray-400">
                Join us in bringing the excitement of pickleball to your
                community!
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ThemeProvider>
  );
}
