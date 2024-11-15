"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import USP from "@/components/USP";
import Booking from "@/components/Booking";
import Location from "@/components/Location";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main className="min-h-screen bg-black">
        <Navbar />
        <Hero />
        <USP />
        {/* <Booking /> */}
        <Location />
        <FAQ />
        <Footer />
      </main>
    </ThemeProvider>
  );
}
