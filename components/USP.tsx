"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Trophy } from "lucide-react";
import Image from "next/image";
import { Cover } from "./ui/cover";
import { Vortex } from "./ui/vortex";

const features = [
  {
    icon: <Shield className="w-6 h-6 text-[#40b7ff]" />,
    title: "Professional Grade Courts",
    description:
      "Experience gameplay on premium surfaces designed for optimal performance and safety.",
    image:
      "https://images.unsplash.com/photo-1534158914592-062992fbe900?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  },
  {
    icon: <Zap className="w-6 h-6 text-[#85e715]" />,
    title: "Advanced Lighting System",
    description:
      "Play day or night with our state-of-the-art LED lighting system for perfect visibility.",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  },
  {
    icon: <Trophy className="w-6 h-6 text-[#40b7ff]" />,
    title: "Tournament Ready",
    description:
      "Host and participate in tournaments with professional-grade facilities and equipment.",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
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
            <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
              Why <Cover>Smash Pro Arena?</Cover>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Experience the perfect blend of technology and sport in our
              state-of-the-art facility
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="relative h-64 mb-6 overflow-hidden rounded-lg">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
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
