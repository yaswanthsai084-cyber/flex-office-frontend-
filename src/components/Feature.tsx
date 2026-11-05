"use client";

import { useEffect, useRef, useState } from "react";

const isChrome =
  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

export default function Feature() {
  const [isChromeOrSafari, setIsChromeOrSafari] = useState(
    isChrome || isSafari
  );
  const featureRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // Set initial state based on browser
    setIsChromeOrSafari(isChrome || isSafari);

    // If not Chrome or Safari, add opaque div
    if (!isChromeOrSafari && featureRef.current) {
      const opaque = document.createElement("div");
      opaque.className = "opaque";
      featureRef.current.appendChild(opaque);

      // Opaque scroll handler
      const handleScroll = () => {
        const fromTop = window.scrollY;
        const opacity = 0 + fromTop / 5000;
        (opaque as HTMLElement).style.opacity = opacity.toString();
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    // Chrome/Safari: background size and blur effect
    if (featureRef.current) {
      const feature = featureRef.current;

      // Initial calculation
      const updateBackgroundSize = () => {
        const backgroundSize = feature.style.backgroundSize;
        if (backgroundSize) {
          const zoom = parseFloat(backgroundSize) / 100;
          const size = zoom * feature.clientWidth;
          return size;
        }
        return feature.clientWidth;
      };

      const initialSize = updateBackgroundSize();
      let size = initialSize;

      const handleScroll = () => {
        const fromTop = window.scrollY;
        const newSize = size - fromTop / 3;

        if (newSize > feature.clientWidth) {
          const blurValue = 0 + fromTop / 100;
          const opacity =
            1 - (fromTop / (document.documentElement.scrollHeight || 1)) * 1.3;

          setStyle({
            WebkitBackgroundSize: newSize,
            MozBackgroundSize: newSize,
            OBackgroundSize: newSize,
            backgroundSize: newSize,
            WebkitFilter: `blur(${blurValue}px)`,
            opacity: opacity,
          });
        }
      };

      // Initial update
      handleScroll();

      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [isChromeOrSafari]);

  return (
    <div
      className="feature"
      ref={featureRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        background: "center center no-repeat",
        backgroundSize: "250%",
        ...style,
      }}
    />
  );
}