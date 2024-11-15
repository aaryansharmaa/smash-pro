"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need to bring my own paddle?",
    answer:
      "We provide professional paddles and balls for all players. However, you're welcome to bring your own equipment if you prefer.",
  },
  {
    question: "How long is each booking session?",
    answer:
      "Each booking session is 1 hour long. You can book multiple consecutive sessions if you need more time.",
  },
  {
    question: "Can we wear casual clothes and shoes?",
    answer:
      "No, we only allow sports attire. Please wear appropriate athletic clothing and shoes.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made 24 hours before your booking time will receive a full refund. Late cancellations may be subject to a 50% cancellation fee.",
  },
  {
    question: "Can we host tournaments at Smash Pro Arena?",
    answer:
      "Yes! you can regularly host tournaments by renting out our courts. Call us for more information.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 bg-black relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-[#40b7ff]">Questions</span>
          </h2>
          <p className="text-gray-400">
            Find answers to common questions about Smash Pro Arena
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white/5 rounded-lg px-6 backdrop-blur-sm border-none"
              >
                <AccordionTrigger className="text-white hover:text-[#40b7ff] transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
