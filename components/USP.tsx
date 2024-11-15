"use client";

import { motion } from "framer-motion";
import { Shield, Car, Coffee, LogOut } from "lucide-react";
import Image from "next/image";
import { Cover } from "./ui/cover";
import { Vortex } from "./ui/vortex";
import spacious from "@/public/spacious.svg";
import refreshments from "@/public/refreshments.svg";
import valet from "@/public/valet.svg";
import washroom from "@/public/washroom.svg";

const features = [
  {
    icon: <Shield className="w-6 h-6 text-[#40b7ff]" />,
    title: "Professional Courts",
    description:
      "Play on spacious surfaces designed for top performance and safety.",
    image: spacious,
    width: 250,
    height: 250,
  },
  {
    icon: <Car className="w-6 h-6 text-[#40b7ff]" />,
    title: "Valet Parking",
    description: "Enjoy hassle-free parking with our convenient valet service.",
    image: valet,
    width: 250,
    height: 250,
  },
  {
    icon: <LogOut className="w-6 h-6 text-[#40b7ff]" />,
    title: "Washroom",
    description: "Clean, well-maintained washrooms for your convenience.",
    image: washroom,
    width: 250,
    height: 250,
  },
  {
    icon: <Coffee className="w-6 h-6 text-[#40b7ff]" />,
    title: "Refreshments",
    description:
      "Stay refreshed with a bottle of water with each 1 hour booking.",
    image: refreshments,
    width: 250,
    height: 250,
  },
];

export default function USP() {
  return (
    <section id="usp" className="relative overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseSpeed={0.1}
        rangeSpeed={1}
        baseRadius={1}
        rangeRadius={3}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
              Why <Cover>Smash Pro Arena?</Cover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="relative h-64 mb-6 overflow-hidden rounded-lg flex items-center justify-center">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={feature.width}
                    height={feature.height}
                    className="object-contain md:object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 group-hover:bg-black/40 transition-colors duration-300" />
                </div>
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-white/5 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Vortex>
    </section>
  );
}
