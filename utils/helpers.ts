export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const isRateLimitError = (error: any) => {
  return error.status === 429 || 
    (error.message && error.message.toLowerCase().includes('rate limit'));
};

export const formatError = (error: any): string => {
  if (isRateLimitError(error)) {
    return "The service is currently busy. Please try again in a moment.";
  }
  return "An error occurred. Please try again.";
}; 