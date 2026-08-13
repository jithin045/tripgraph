"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    name: "Munnar",
    slug: "munnar",
    subtitle: "Tea plantations & misty mountains",
    image: "/images/destinations/munnar.jpg",
  },
  {
    name: "Wayanad",
    slug: "wayanad",
    subtitle: "Forests, waterfalls & nature",
    image: "/images/destinations/wayanad.jpg",
  },
  {
    name: "Alleppey",
    slug: "alleppey",
    subtitle: "Kerala's famous backwaters",
    image: "/images/destinations/alleppey.jpg",
  },
  {
    name: "Kochi",
    slug: "kochi",
    subtitle: "Heritage, culture & coastal life",
    image: "/images/destinations/kochi.jpg",
  },
];

export default function TravelCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl">
      {slides.map((slide, index) => (
        <Link
          key={slide.slug}
          href={`/destinations/${slide.slug}`}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === activeIndex
              ? "z-10 opacity-100"
              : "z-0 opacity-0"
          }`}
        >
          {/* Image */}
          <img
            src={slide.image}
            alt={`${slide.name} travel`}
            className="h-full w-full object-cover"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-7">
            <div className="mb-3 inline-flex rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md">
              Explore destination
            </div>

            <h3 className="text-3xl font-bold text-white">
              {slide.name}
            </h3>

            <p className="mt-2 text-sm text-slate-300">
              {slide.subtitle}
            </p>
          </div>
        </Link>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-7 right-7 z-20 flex gap-1.5">
        {slides.map((slide, index) => (
          <button
            key={slide.slug}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${slide.name}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-7 bg-cyan-400"
                : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Graph decoration */}
      <div className="absolute right-5 top-5 z-20 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-[10px] text-slate-300 backdrop-blur-md">
        <span className="text-cyan-400">●</span> Connected travel
      </div>
    </div>
  );
}