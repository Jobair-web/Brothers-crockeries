"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { src: "/hero-banner-1.jpg", alt: "New Brothers Crockeries – everything your home needs" },
  { src: "/hero-banner-2.jpg", alt: "Modern appliances and crockeries for your home" },
  { src: "/hero-banner-3.jpg", alt: "New Brothers Crockeries shop card with contact numbers" },
];
const INTERVAL_MS = 5000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, index]);

  const go = (i: number) => setIndex((i + SLIDES.length) % SLIDES.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured banners"
      className="relative mx-auto aspect-[4/3] max-w-[1400px] overflow-hidden bg-neutral sm:aspect-[16/7] sm:rounded-box lg:mt-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {SLIDES.map((s, i) => {
        const active = i === index;
        return (
          <Link
            key={s.src}
            href="/products"
            tabIndex={active ? 0 : -1}
            aria-hidden={!active}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${active ? "scale-100 opacity-100" : "pointer-events-none scale-[1.04] opacity-0"}`}
          >
            {/* Blurred copy fills the sides when a banner is not exactly the carousel ratio */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover opacity-70 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.alt} className="relative size-full object-contain" />
          </Link>
        );
      })}

      <button onClick={() => go(index - 1)} aria-label="Previous slide" className="btn btn-circle btn-sm absolute left-3 top-1/2 -translate-y-1/2 border-0 bg-white/80 hover:bg-white sm:btn-md">
        <ChevronLeft />
      </button>
      <button onClick={() => go(index + 1)} aria-label="Next slide" className="btn btn-circle btn-sm absolute right-3 top-1/2 -translate-y-1/2 border-0 bg-white/80 hover:bg-white sm:btn-md">
        <ChevronRight />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-7 bg-primary" : "w-2 bg-white/70 hover:bg-white"}`}
          />
        ))}
      </div>
    </section>
  );
}
