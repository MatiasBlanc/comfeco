"use client";

import { useEffect } from "react";

import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/** Activa el tracking declarativo de elementos con `data-analytics-event`. */
export function AnalyticsEvents() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const element = target.closest<HTMLElement>("[data-analytics-event]");
      const analyticsEvent = element?.dataset.analyticsEvent as
        | AnalyticsEvent
        | undefined;

      if (analyticsEvent) {
        trackEvent(analyticsEvent);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
