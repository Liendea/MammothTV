"use client";
import { useState, useCallback, useRef } from "react";

export function useCardExpansion() {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map());

  // Callback for when a card is being observed
  const observeCard = useCallback(
    (node: HTMLElement | null, cardId: string) => {
      // Cleanup old observer for this cardId if it exists
      const existingObserver = observersRef.current.get(cardId);
      if (existingObserver) {
        existingObserver.disconnect();
        observersRef.current.delete(cardId);
      }

      if (!node) return;

      // Create an observer for this specific card
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Card enters viewport center - EXPAND
          if (entry.isIntersecting) {
            setExpandedCardId(cardId);
          }
          // Card leaves viewport center - COLLAPSE
          else {
            setExpandedCardId((current) => {
              // Only collapse if THIS card is currently expanded
              return current === cardId ? null : current;
            });
          }
        },
        {
          root: null, // viewport
          rootMargin: "-30% 0px -35% 0px", // Center 20% of viewport
          threshold: 0.5, // Multiple thresholds for better detection
        }
      );

      observer.observe(node);
      observersRef.current.set(cardId, observer);

      // Cleanup function
      return () => {
        observer.disconnect();
        observersRef.current.delete(cardId);
      };
    },
    []
  );

  return { expandedCardId, observeCard };
}
