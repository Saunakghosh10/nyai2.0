import mixpanel from 'mixpanel-browser';
import { init as initSentry, captureException } from '@sentry/browser';

// Initialize Mixpanel
if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
}

// Initialize Sentry
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  initSentry({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
  });
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.track(eventName, properties);
  }
};

export const trackError = (error: Error, context?: Record<string, any>) => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    captureException(error, { extra: context });
  }
  console.error(error);
};

export const trackDocumentEvent = (eventName: string, properties: Record<string, any>) => {
  trackEvent(`document_${eventName}`, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
};

export const documentEvents = {
  UPLOAD_STARTED: 'upload_started',
  UPLOAD_COMPLETED: 'upload_completed',
  PROCESSING_STARTED: 'processing_started',
  PROCESSING_COMPLETED: 'processing_completed',
  EXPORT_STARTED: 'export_started',
  EXPORT_COMPLETED: 'export_completed',
  LANGUAGE_CHANGED: 'language_changed',
  ERROR_OCCURRED: 'error_occurred',
  CHAT_STARTED: 'chat_started',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CHAT_COMPLETED: 'chat_completed',
};

export const trackUserJourney = (stage: string, properties: Record<string, any> = {}) => {
  trackEvent('user_journey', {
    stage,
    ...properties,
    timestamp: new Date().toISOString(),
  });
}; 