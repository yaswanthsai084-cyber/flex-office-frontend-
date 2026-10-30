"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ===================== Slides =====================
// Images are served from the Next.js `public` folder so they are
// fetched straight from our own project assets.
const slides = [
  {
    src: "/hero/slide-3.jpeg",
    alt: "Contemporary office interior with bright open-plan collaborative areas",
  },
  {
    src: "/hero/slide-1.avif",
    alt: "Modern collaborative office workspace with open seating and natural light",
  },
  {
    src: "/hero/slide-2.jpeg",
    alt: "Bright open-plan office design with the contemporary furniture",
  },
  {
    src: "/hero/slide-4.jpg",
    alt: "Stylish office fit-out with bold design elements and lighting",
  },
];

const AUTO_PLAY_DELAY = 6000;

const slideVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance to the next slide on a timer.
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTO_PLAY_DELAY);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Featured office design projects"
    >
      {/* Slide images */}
      <div className="hero-slider-viewport">
        <AnimatePresence initial={false}>
          <motion.div
            key={slides[current].src}
            className="hero-slide"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={slides[current].src}
              alt={slides[current].alt}
              fill
              priority={current === 0}
              sizes="100vw"
              className="hero-slide-img"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next controls */}
      <button
        type="button"
        className="hero-slider-nav hero-slider-nav-prev"
        aria-label="Previous slide"
        onClick={prev}
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        className="hero-slider-nav hero-slider-nav-next"
        aria-label="Next slide"
        onClick={next}
      >
        <span aria-hidden="true">›</span>
      </button>

      {/* Pagination dots */}
      <div className="hero-slider-dots" role="tablist" aria-label="Slides">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`hero-slider-dot${index === current ? " active" : ""}`}
            aria-label={`Slide ${index + 1}`}
            aria-selected={index === current}
            role="tab"
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
