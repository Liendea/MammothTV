"use client";
import { useState, useCallback } from "react";

export function useCardExpansion() {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Callback för när ett kort observeras
  const observeCard = useCallback(
    (node: HTMLElement | null, cardId: string) => {
      if (!node) return;

      // Skapa observer för detta specifika kort
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Kortet är i mitten av viewporten
          if (entry.isIntersecting) {
            setExpandedCardId(cardId);
          }
        },
        {
          root: null, // viewport
          rootMargin: "40% 0px -40% 0px", // Justera för att centrera observationen
          threshold: 0.5, // Minst 50% av kortet måste vara synligt
        }
      );

      observer.observe(node);

      // Cleanup
      return () => observer.disconnect();
    },
    []
  );

  return { expandedCardId, observeCard };
}
