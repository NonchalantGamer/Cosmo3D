const siteRoutes = {
  home: { label: 'Home', href: 'index.html' },
  features: { label: 'Features', href: 'features.html' },
  pricing: { label: 'Pricing', href: 'pricing.html' },
  useCases: { label: 'Use Cases', href: 'use-cases.html' },
  blog: { label: 'Blog', href: 'blog.html' },
  about: { label: 'About', href: 'about.html' },
  contact: { label: 'Contact', href: 'contact.html' },
};

function getBrandMarkSvg() {
  return `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4Z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M9 12.8 11.3 15l4-4.2" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function injectBrandIcons() {
  if (!document.head) return;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="cosmo-gradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7c4dff"/>
          <stop offset="1" stop-color="#53d7ff"/>
        </linearGradient>
      </defs>
      <path d="M12 2L4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4Z" fill="url(#cosmo-gradient)"/>
      <path d="M9 12.8 11.3 15l4-4.2" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  const href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  ['icon', 'shortcut icon', 'apple-touch-icon'].forEach((rel) => {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    if (rel === 'icon') {
      link.type = 'image/svg+xml';
    }
    link.href = href;
  });
}

function injectIconLibrary() {
  if (!document.head) return;
  if (document.querySelector('link[data-fa-icons="true"]')) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
  link.crossOrigin = 'anonymous';
  link.referrerPolicy = 'no-referrer';
  link.setAttribute('data-fa-icons', 'true');
  document.head.appendChild(link);
}

function getCurrentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const base = (path.replace('.html', '') || 'home').toLowerCase();

  const routeAliases = {
    index: 'home',
    'use-cases': 'useCases',
  };

  return routeAliases[base] || base;
}

function setupHeaderInteractions(host) {
  const header = host?.querySelector('.site-header');
  const toggleButton = host?.querySelector('[data-nav-toggle]');
  const navPanel = host?.querySelector('[data-nav-panel]');
  if (!header) return;

  const updateScrolledState = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };

  const setOpen = (isOpen) => {
    if (!toggleButton || !navPanel) return;
    header.classList.toggle('nav-open', isOpen);
    toggleButton.setAttribute('aria-expanded', String(isOpen));
    navPanel.setAttribute('aria-hidden', String(!isOpen));
  };

  if (toggleButton && navPanel) {
    toggleButton.addEventListener('click', () => {
      setOpen(!header.classList.contains('nav-open'));
    });

    navPanel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    if (window.__cosmoHeaderKeyHandler) {
      document.removeEventListener('keydown', window.__cosmoHeaderKeyHandler);
    }

    window.__cosmoHeaderKeyHandler = (event) => {
      if (event.key === 'Escape' && header.classList.contains('nav-open')) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', window.__cosmoHeaderKeyHandler);

    if (window.__cosmoHeaderClickHandler) {
      document.removeEventListener('click', window.__cosmoHeaderClickHandler);
    }

    window.__cosmoHeaderClickHandler = (event) => {
      if (!header.classList.contains('nav-open')) return;
      if (window.innerWidth > 980) return;
      if (header.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener('click', window.__cosmoHeaderClickHandler);
  }

  if (window.__cosmoHeaderResizeHandler) {
    window.removeEventListener('resize', window.__cosmoHeaderResizeHandler);
  }

  window.__cosmoHeaderResizeHandler = () => {
    if (window.innerWidth > 980) {
      setOpen(false);
    }
    updateScrolledState();
  };

  window.addEventListener('resize', window.__cosmoHeaderResizeHandler, { passive: true });

  if (window.__cosmoHeaderScrollHandler) {
    window.removeEventListener('scroll', window.__cosmoHeaderScrollHandler);
  }

  window.__cosmoHeaderScrollHandler = () => {
    updateScrolledState();
  };

  window.addEventListener('scroll', window.__cosmoHeaderScrollHandler, { passive: true });

  updateScrolledState();
}

function renderHeader() {
  const host = document.querySelector('[data-site-header]');
  if (!host) return;
  
  const page = getCurrentPage();
  
  // Use getCurrentUser() for the new async auth system
  const user = (typeof window !== 'undefined' && window.getCurrentUser) 
    ? window.getCurrentUser() 
    : null;
  const isLoggedIn = Boolean(user);
  const mobileAccountHref = isLoggedIn ? 'profile.html' : 'login.html';
  const mobileAccountLabel = isLoggedIn ? 'Account' : 'Login';
  
  const authActions = isLoggedIn
    ? `<a class="btn btn-ghost" href="profile.html" style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="user-avatar-chip" aria-hidden="true"${user.avatarUrl ? ` style="background-image: url('${user.avatarUrl}')"` : ''}>
          ${user.avatarUrl ? '' : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.2 0-7 2.2-7 5v1h14v-1c0-2.8-2.8-5-7-5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`}
        </span>
        ${user.name || 'Account'}
      </a>`
    : `<a class="btn btn-ghost" href="login.html">Log in</a><a class="btn btn-primary" href="signup.html">Sign up</a>`;

  host.innerHTML = `
    <header class="site-header">
      <div class="container navbar">
        <a class="brand" href="index.html" aria-label="Cosmo3D home">
          <span class="brand-mark">
            ${getBrandMarkSvg()}
          </span>
          <span>Cosmo3D</span>
        </a>
        <div class="mobile-controls" aria-label="Mobile navigation controls">
          <a class="mobile-icon-btn" href="${mobileAccountHref}" aria-label="${mobileAccountLabel}">
            <i class="fa-regular fa-user" aria-hidden="true"></i>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" data-nav-toggle>
            <i class="fa-solid fa-bars nav-i-bars" aria-hidden="true"></i>
            <i class="fa-solid fa-xmark nav-i-close" aria-hidden="true"></i>
            <span class="sr-only">Toggle menu</span>
          </button>
        </div>
        <div class="nav-panel" id="primary-navigation" data-nav-panel aria-hidden="true">
          <nav class="nav-links" aria-label="Primary navigation">
            ${Object.entries(siteRoutes).map(([key, item]) => {
              const isActive = page === key;
              return `<a class="nav-link ${isActive ? 'active' : ''}" href="${item.href}" ${isActive ? 'aria-current="page"' : ''}>${item.label}</a>`;
            }).join('')}
          </nav>
          <div class="nav-actions">
            ${authActions}
          </div>
        </div>
      </div>
    </header>
  `;

  setupHeaderInteractions(host);
}

// Listen for auth changes and update header
function setupAuthListener() {
  if (typeof window !== 'undefined' && window.onAuthChange) {
    window.onAuthChange((event) => {
      if (event.type === 'LOGIN' || event.type === 'LOGOUT' || event.type === 'SIGNUP' || event.type === 'PROFILE_UPDATED') {
        renderHeader();
      }
    });
  }
}

function renderFooter() {
  const host = document.querySelector('[data-site-footer]');
  if (!host) return;
  host.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="brand" href="index.html" aria-label="Cosmo3D home">
              <span class="brand-mark">
                ${getBrandMarkSvg()}
              </span>
              <span>Cosmo3D</span>
            </a>
            <p style="margin-top: 0.85rem; max-width: 340px;">Turn every product video into an immersive 3D story that sells faster and feels more real.</p>
            <div class="socials" aria-label="Social links">
              <a href="#" aria-label="X"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18.9 3H22l-6.6 7.6L23 21h-5.4l-4.2-5.5L8.8 21H5.6l7.1-8.1L1 3h5.5l3.8 5L18.9 3Z" stroke="currentColor" stroke-width="1.6"/></svg></a>
              <a href="#" aria-label="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.5h2.88V18H5.5zM10.7 9.5h2.76v1.16h.04c.38-.72 1.32-1.48 2.72-1.48 2.9 0 3.44 1.91 3.44 4.39V18h-2.88v-7.62c0-1.81-.03-4.15-2.53-4.15-2.53 0-2.92 1.98-2.92 4.03V18H10.7z" fill="currentColor"/></svg></a>
              <a href="#" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4.3" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor"/></svg></a>
            </div>
          </div>
          <div>
            <h3>Product</h3>
            <div class="footer-links">
              <a href="features.html">Features</a>
              <a href="pricing.html">Pricing</a>
              <a href="use-cases.html">Use Cases</a>
            </div>
          </div>
          <div>
            <h3>Company</h3>
            <div class="footer-links">
              <a href="about.html">About</a>
              <a href="blog.html">Blog</a>
              <a href="contact.html">Contact</a>
            </div>
          </div>
          <div>
            <h3>Resources</h3>
            <div class="footer-links">
              <a href="login.html">Login</a>
              <a href="signup.html">Sign Up</a>
              <a href="contact.html">Support</a>
            </div>
          </div>
        </div>
        <p style="margin-top: 1.2rem; color: var(--muted);">© <span id="year"></span> Cosmo3D. All rights reserved.</p>
      </div>
    </footer>
  `;
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    injectBrandIcons();
    injectIconLibrary();
    renderHeader();
    renderFooter();
    setupAuthListener();
  });
}
