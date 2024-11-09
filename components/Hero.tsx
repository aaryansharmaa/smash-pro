"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#40b7ff] rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#85e715] rounded-full blur-[120px] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-6"
          >
            Welcome to the Future of
            <span className="text-[#40b7ff]"> Pickleball</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Experience state-of-the-art courts and professional facilities at
            Smash Pro Arena. Where champions are made and memories are created.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button className="bg-[#40b7ff] text-black hover:bg-[#40b7ff]/80 text-lg px-8 py-6">
              <Link href="#booking">Book a Court</Link>
            </Button>
            <Button
              variant="outline"
              className="border-[#85e715] text-[#85e715] hover:bg-[#85e715]/10 text-lg px-8 py-6"
            >
              <Link href="#usp">Take a Tour</Link>
            </Button>
          </motion.div>
        </div>
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
  );
}
