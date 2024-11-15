"use client";

import React from "react";
import { PinContainer } from "./ui/3d-pin";
import Image from "next/image";

const Location = () => {
  return (
    <section id="location">
      <div className="h-[20rem] w-full flex items-center justify-center relative z-0">
        <PinContainer
          title="Our Location"
          href="https://www.google.com/maps/dir//smash+pro+pickleball+hyderabad/"
        >
          <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem]">
            <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
              Visit Smash Pro Pickleball Arena
            </h3>

            <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 overflow-hidden relative">
              <Image
                src="/location.png"
                alt="Smash Pro Pickleball Arena"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </div>
        </PinContainer>
      </div>
    </section>
  );
};

export default Location;
