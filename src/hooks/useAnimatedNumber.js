import { useEffect, useState } from "react";

export default function useAnimatedNumber(
  value,
  duration = 700,
) {
  const [displayValue, setDisplayValue] =
    useState(value);

  useEffect(() => {
    const start = displayValue;
    const end = value;

    let animationFrame;

    const startTime = performance.now();

    function animate(now) {
      const progress = Math.min(
        (now - startTime) / duration,
        1,
      );

      const current =
        start + (end - start) * progress;

      setDisplayValue(Math.round(current));

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      }
    }

    animationFrame =
      requestAnimationFrame(animate);

    return () =>
      cancelAnimationFrame(animationFrame);
  }, [value]);

  return displayValue;
}