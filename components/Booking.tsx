"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour <= 22; hour++) {
    const formattedHour = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";
    slots.push(`${formattedHour}:00 ${ampm}`);
    slots.push(`${formattedHour}:30 ${ampm}`);
  }
  return slots;
};

const courts = ["Court 1", "Court 2", "Court 3", "Court 4"];

export default function Booking() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedCourt, setSelectedCourt] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState("");
  const timeSlots = generateTimeSlots();

  return (
    <section id="booking" className="pt-24 pb-20 bg-black relative">
      <div className="absolute inset-0">
        <div className="absolute right-0 top-1/4 w-[300px] h-[300px] bg-[#40b7ff] rounded-full blur-[120px] opacity-20" />
        <div className="absolute left-0 bottom-1/4 w-[300px] h-[300px] bg-[#85e715] rounded-full blur-[120px] opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Book Your <span className="text-[#40b7ff]">Court</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Reserve your spot and get ready to play at Smash Pro Arena
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="text-white"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <label className="text-white block">Select Time</label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="w-full bg-white/5 border-0 text-white">
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-[#40b7ff]/20 backdrop-blur-sm">
                  <SelectGroup>
                    {timeSlots.map((time) => (
                      <SelectItem
                        key={time}
                        value={time}
                        className="text-white hover:bg-[#40b7ff]/20 focus:bg-[#40b7ff]/20 focus:text-white"
                      >
                        {time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-white block">Duration</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-full bg-white/5 border-0 text-white">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-[#40b7ff]/20 backdrop-blur-sm">
                  <SelectGroup>
                    {[1, 2, 3].map((hours) => (
                      <SelectItem
                        key={hours}
                        value={hours.toString()}
                        className="text-white hover:bg-[#40b7ff]/20 focus:bg-[#40b7ff]/20 focus:text-white"
                      >
                        {hours} {hours === 1 ? "hour" : "hours"}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full bg-[#40b7ff] text-black hover:bg-[#40b7ff]/80"
              size="lg"
            >
              Book Now
            </Button>

            <p className="text-sm text-gray-400 text-center">
              * Booking confirmation will be sent to your email
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
