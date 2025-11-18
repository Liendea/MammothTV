"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export function useCardExpansion() {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Observer-ref, så vi återanvänder samma observer för alla kort
  const observer = useRef<IntersectionObserver | null>(null);

  // Callback som skickas till varje kort
  const observeCard = useCallback(
    (node: HTMLElement | null, cardId: string) => {
      if (!node) return;

      node.dataset.cardId = cardId;

      // Skapa observer om den inte finns
      if (!observer.current) {
        observer.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const targetId = (entry.target as HTMLElement).dataset.cardId;
              if (!targetId) return;

              // Om kortet är centrerat (80% synligt) → expandera
              if (entry.isIntersecting) {
                setExpandedCardId(targetId);
              } else if (expandedCardId === targetId) {
                // Kortet lämnar viewport → collapse
                setExpandedCardId(null);
              }
            });
          },
          {
            root: null,
            rootMargin: "0px 0px -20% 0px", // justera för center
            threshold: 0.8,
          }
        );
      }

      observer.current.observe(node);

      // Cleanup: ta bort observer när node tas bort
      return () => {
        observer.current?.unobserve(node);
      };
    },
    [expandedCardId]
  );

  // Rensa observer när hook unmountas
  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  return { expandedCardId, observeCard };
}
