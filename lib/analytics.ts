export const ANALYTICS_EVENTS = {
  heroWaitlistClick: "hero_waitlist_click",
  waitlistStarted: "waitlist_started",
  waitlistSubmitted: "waitlist_submitted",
  sponsorCtaClick: "sponsor_cta_click",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

interface AnalyticsDetail {
  event: AnalyticsEvent;
}

/**
 * Publica un evento neutral que puede conectar Vercel Analytics, GTM u otra herramienta.
 *
 * @param event - Nombre estable del evento de producto.
 * @returns Nada; en SSR la operación se omite.
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<AnalyticsDetail>("comfeco:analytics", {
      detail: { event },
    }),
  );

  const dataLayer = (
    window as Window & { dataLayer?: Array<Record<string, string>> }
  ).dataLayer;
  dataLayer?.push({ event });
}
