"use client";
import { useState, useCallback } from "react";

export function useCardExpansion() {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Callback for when a card is being observed
  const observeCard = useCallback(
    (node: HTMLElement | null, cardId: string) => {
      if (!node) return;

      // Create an observer for this specific card
      const observer = new IntersectionObserver(
        ([entry]) => {
          // The card is in the center of the viewport
          if (entry.isIntersecting) {
            setExpandedCardId(cardId);
          }
        },
        {
          root: null, // viewport
          rootMargin: "35% 0px -20% 0px", // Adjust to center the observation area
          threshold: 0.5, // At least 50% of the card must be visible
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
