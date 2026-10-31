/* Frontend settings. Configured for Africa University Portfolio & Recommendation System */
(function () {
  var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  // Point to local development backend or Render production deployment
  var defaultBase = isLocal ? 'http://localhost:5000' : 'https://aureco-back.onrender.com';

  window.AU_CONFIG = {
    // true  = use production backend through js/api.js
    // false = demo mode (browser only)
    USE_BACKEND: true,

    // Where your backend lives.
    API_BASE_URL: defaultBase,

    // Endpoint paths
    ENDPOINTS: {
      login:      '/api/auth/login',
      logout:     '/api/auth/logout',
      signup:     '/api/auth/signup',
      verifyCode: '/api/auth/verify-code',
      state:      '/api/state',
      aiLetter:   '/api/ai/recommendation-letter',
      aiReview:   '/api/ai/portfolio-review',
      aiImprove:  '/api/ai/improve-project'
    },

    // Bearer token used by default
    WITH_CREDENTIALS: false,

    // Debounce delay (ms) for pushing state updates to the server
    SAVE_DELAY_MS: 600
  };
})();
