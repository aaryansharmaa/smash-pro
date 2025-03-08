"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Cover } from "@/components/ui/cover";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center w-full justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric-blue rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-electric-green rounded-full blur-[120px] opacity-20"></div>
      </div>

      <div className="relative z-10 w-full py-2 -mt-22">
        <div className="text-center">
          <HeroHighlight className="w-full " containerClassName="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [20, -5, 0] }}
                transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
                className="text-4xl sm:text-6xl font-bold text-white mb-6 flex flex-col items-center gap-4"
              >
                <span>Rooftop Pickleball in the</span>
                <div className="inline-flex">
                  <Highlight className="text-[#f9f9f9]">
                    Heart of Hyderabad
                  </Highlight>
                </div>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl text-gray-400 mb-8 max-w-2xl mx-auto"
              >
                <Cover className="font-bold text-[#40b7ff]">
                  READY, SET, SMASH!
                </Cover>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button className="relative inline-flex h-16 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#4facfe_0%,#00f2fe_50%,#00f2fe_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-lg font-medium text-white backdrop-blur-3xl hover:bg-slate-900">
                    <a href="tel:+917702090273">Call & Book</a>
                  </span>
                </button>

                <button className="relative inline-flex h-16 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#4facfe_0%,#00f2fe_50%,#00f2fe_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-lg font-medium text-white backdrop-blur-3xl hover:bg-slate-900">
                    <Link href="#usp">Explore</Link>
                  </span>
                </button>
              </motion.div>
              <p className="mt-5 text-xl text-gray-400">₹1,000/hour </p>
            </div>
          </HeroHighlight>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/20 rounded-full mt-2"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
