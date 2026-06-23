"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, HelpCircle, Star } from "lucide-react";

const faqs = [
  {
    q: "What does 'refurbished' mean?",
    a: "Refurbished means the laptop has been professionally restored to like-new condition. Every device goes through a rigorous 100-point quality check, including battery health, display testing, keyboard responsiveness, and full system diagnostics.",
  },
  {
    q: "Do refurbished laptops come with a warranty?",
    a: "Yes! Every laptop sold on Gurugram IT Networks comes with a minimum 6-month warranty. Most products include a full 1-year warranty covering hardware defects and battery issues.",
  },
  {
    q: "How is pricing determined for refurbished devices?",
    a: "Our pricing is based on the device condition grade (A+, A, B), the original retail price, market demand, and any upgrades we have made (like SSD or RAM upgrades). You can save anywhere from 30% to 60% compared to buying new.",
  },
  {
    q: "Can I return a product if I am not satisfied?",
    a: "Absolutely. We offer a hassle-free 7-day return policy. If you are not satisfied with your purchase for any reason, simply initiate a return from your profile and we will process a full refund.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI, net banking, and popular wallets. All transactions are secured with 256-bit SSL encryption for your safety.",
  },
  {
    q: "Do you offer EMI options?",
    a: "Yes, we offer no-cost EMI on select products with partnered banks. You can check EMI availability on the product page before placing your order.",
  },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Software Developer",
    rating: 5,
    text: "Bought a Dell Latitude for my work. It arrived in pristine condition and the battery lasts all day. Saved over 40% compared to buying new!",
  },
  {
    name: "Priya Patel",
    role: "College Student",
    rating: 5,
    text: "As a student on a budget, Gurugram IT Networks was a lifesaver. Got an HP EliteBook for under 25K that handles all my coursework and coding.",
  },
  {
    name: "Amit Kumar",
    role: "Graphic Designer",
    rating: 4,
    text: "The MacBook Air I received looked brand new. Not a single scratch. The 1-year warranty gave me extra peace of mind.",
  },
  {
    name: "Sneha Gupta",
    role: "Freelancer",
    rating: 5,
    text: "Fast delivery, excellent packaging, and the laptop works flawlessly. This is my second purchase from Gurugram IT Networks. Highly recommended!",
  },
];

export function TestimonialsFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 md:py-16" id="testimonials-faq">
      {/* Testimonials */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 mb-4">
            <MessageCircle className="h-3.5 w-3.5 text-purple-600" />
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Customer Reviews</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`h-4 w-4 ${si < t.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                  />
                ))}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white font-bold text-xs">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">FAQs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-xl border transition-all duration-300 ${
                openIndex === i
                  ? "border-gray-200 bg-white shadow-md"
                  : "border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center justify-between w-full px-5 py-4 text-left"
              >
                <span className={`text-sm font-semibold transition-colors ${openIndex === i ? "text-gray-900" : "text-gray-700"}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
