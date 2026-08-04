/**
 * Web Vitals reporting
 * Monitors Core Web Vitals and sends to analytics
 */

interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
}

export function reportWebVitals(metric: WebVitalMetric): void {
  // Only log in development
  if (typeof window === 'undefined') return;

  // Log Core Web Vitals
  const perfType = metric.name;

  if (
    perfType === 'CLS' ||
    perfType === 'FID' ||
    perfType === 'LCP' ||
    perfType === 'INP' ||
    perfType === 'TTFB' ||
    perfType === 'FCP'
  ) {
    // Performance monitoring can be extended here
    // For now, this serves as a hook point for analytics integration
  }

  // Send to analytics service (optional)
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ga = window.gtag as any;
    ga?.('event', metric.name, {
      event_category: 'web_vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    });
  }
}
