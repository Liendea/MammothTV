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
          // Trigger when card enters the observation zone
          if (entry.isIntersecting) {
            setExpandedCardId(cardId);
          } else {
            // Collapse when card leaves the zone
            setExpandedCardId((current) =>
              current === cardId ? null : current
            );
          }
        },
        {
          root: null, // viewport
          rootMargin: "35% 0px -35% 0px", // Center 50% of screen (25% from top, 25% from bottom)
          threshold: 0.01, // Trigger as soon as even 1% of card is visible in the zone
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
