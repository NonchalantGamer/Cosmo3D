/**
 * Route Protection Module
 * Handles redirecting unauthenticated users from protected pages
 */

const PROTECTED_ROUTES = {
  'profile.html': true,
  'dashboard.html': true,
  'account.html': true,
};

const PUBLIC_ROUTES = {
  'index.html': true,
  'login.html': true,
  'signup.html': true,
  'auth-callback.html': true,
  'about.html': true,
  'features.html': true,
  'use-cases.html': true,
  'pricing.html': true,
  'blog.html': true,
  'contact.html': true,
};

/**
 * Get the current page filename
 * @returns {string} - e.g., "profile.html"
 */
function getCurrentPage() {
  const pathname = window.location.pathname;
  return pathname.split('/').pop() || 'index.html';
}

/**
 * Check if the current route is protected
 * @returns {boolean}
 */
function isCurrentRouteProtected() {
  const currentPage = getCurrentPage();
  return Boolean(PROTECTED_ROUTES[currentPage]);
}

/**
 * Check if the current route is public
 * @returns {boolean}
 */
function isCurrentRoutePublic() {
  const currentPage = getCurrentPage();
  return Boolean(PUBLIC_ROUTES[currentPage]);
}

/**
 * Protect the current route (redirect to login if not authenticated)
 * Should be called on DOMContentLoaded
 */
async function protectCurrentRoute() {
  if (window.getAuthReady) {
    await window.getAuthReady();
  } else {
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  if (!isCurrentRouteProtected()) {
    return; // Not a protected route
  }

  if (!window.isAuthenticated || !window.isAuthenticated()) {
    console.warn(`Access denied to ${getCurrentPage()}: User not authenticated`);
    window.location.replace('login.html');
  }
}

/**
 * Automatically protect routes on load
 */
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    protectCurrentRoute().catch(error => console.error('Route protection error:', error));
  });
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PROTECTED_ROUTES,
    PUBLIC_ROUTES,
    getCurrentPage,
    isCurrentRouteProtected,
    isCurrentRoutePublic,
    protectCurrentRoute,
  };
}
