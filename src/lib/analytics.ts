/**
 * MedCare Analytics Utility
 * Bridges frontend events to analytics providers (GA4, Mixpanel, etc.)
 */

type EventProperties = Record<string, any>;

export const trackEvent = (eventName: string, properties?: EventProperties) => {
  if (import.meta.env.DEV) {
    console.log(`[Analytics Event]: ${eventName}`, properties);
  }

  // Example: Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }

  // Example: Mixpanel
  if (typeof window !== 'undefined' && (window as any).mixpanel) {
    (window as any).mixpanel.track(eventName, properties);
  }
};

export const trackPageView = (url: string) => {
  if (import.meta.env.DEV) {
    console.log(`[Analytics PageView]: ${url}`);
  }

  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};
