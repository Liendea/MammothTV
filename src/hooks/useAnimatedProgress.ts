import { useState, useEffect } from "react";

export function useAnimatedProgress(targetPercentage: number) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 2000; // 2s animation
    const startValue = targetPercentage / 2; // start at half target value instead of 0
    const endValue = targetPercentage;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = startValue + (endValue - startValue) * progress;
      setAnimatedPercentage(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [targetPercentage]);

  return animatedPercentage;
}
