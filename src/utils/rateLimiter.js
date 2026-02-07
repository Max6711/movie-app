class RateLimiter {
    constructor(maxRequests, timeWindow) {
      this.maxRequests = maxRequests;
      this.timeWindow = timeWindow;
      this.requests = [];
    }
  
    async waitForToken() {
      const now = Date.now();
      
      // Remove old requests outside the time window
      this.requests = this.requests.filter(
        time => now - time < this.timeWindow
      );
      
      // If we've hit the limit, wait
      if (this.requests.length >= this.maxRequests) {
        const oldestRequest = this.requests[0];
        const waitTime = this.timeWindow - (now - oldestRequest);
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.waitForToken();
      }
      
      // Add current request timestamp
      this.requests.push(now);
    }
  }
  
  // Create singleton instance: 5 requests per 10 seconds
  export const rateLimiter = new RateLimiter(5, 10000);