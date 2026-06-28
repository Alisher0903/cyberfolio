/**
 * Global type definitions for analytics and third-party services
 */

declare global {
  interface Window {
    gtag?: (event: string, action: string, params?: Record<string, unknown>) => void;
  }
}

export {};
