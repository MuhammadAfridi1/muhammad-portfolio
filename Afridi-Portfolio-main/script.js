/*DESIGNED & DEVELOPED BY LINDY RAMAT · AI-ASSISTED WEB DEVELOPER*/
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Intro Splash
  const introSplash = document.getElementById('introSplash');
  if (introSplash) {
    document.body.classList.add('intro-active');

    const introWord = document.getElementById('introWord');
    if (introWord) {
      if (prefersReducedMotion) {
        introWord.classList.add('is-split');
      } else {
        const text = introWord.textContent;
        introWord.textContent = '';
        const baseDelay = 0.12;
        const step = 0.03;
        let visibleIndex = 0;
        text.split('').forEach(char => {
          const isSpace = char === ' ';
          const span = document.createElement('span');
          span.className = 'intro-letter' + (isSpace ? ' is-space' : '');
          span.textContent = isSpace ? '\u00A0' : char;
          span.style.animationDelay = `${(baseDelay + visibleIndex * step).toFixed(3)}s`;
          introWord.appendChild(span);
          if (!isSpace) visibleIndex++;
        });
        void introWord.offsetWidth;
        introWord.classList.add('is-split');
      }
    }

    const introBarFill = document.getElementById('introBarFill');
    if (introBarFill && !prefersReducedMotion) {
      requestAnimationFrame(() => { introBarFill.style.width = '100%'; });
    } else if (introBarFill) {
      introBarFill.style.width = '100%';
    }

    const introHideDelay = prefersReducedMotion ? 0 : 1650;
    window.setTimeout(() => {
      introSplash.classList.add('is-hidden');
      document.body.classList.remove('intro-active');
    }, introHideDelay);
  }

  // Footer Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header Scrol State
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    function updateHeaderState() {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
    }
    window.addEventListener('scroll', updateHeaderState, { passive: true });
    updateHeaderState();
  }

  // Mobile Nav
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');

  function openMobileMenu() {
    if (!burger || !mobileMenu || !mobileMenuBackdrop) return;
    mobileMenuBackdrop.hidden = false;
    requestAnimationFrame(() => {
      mobileMenu.classList.add('is-open');
      mobileMenuBackdrop.classList.add('is-open');
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
    });
  }

  function closeMobileMenu() {
    if (!burger || !mobileMenu || !mobileMenuBackdrop) return;
    mobileMenu.classList.remove('is-open');
    mobileMenuBackdrop.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    window.setTimeout(() => {
      if (!mobileMenu.classList.contains('is-open')) {
        mobileMenuBackdrop.hidden = true;
      }
    }, 430);
  }

  if (burger && mobileMenu && mobileMenuBackdrop) {
    burger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
    mobileMenu.querySelectorAll('.mobile-menu-links a, .mobile-menu-cta').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  }

  // Scroll Reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Active Navigation State
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.classList.toggle('is-active', a.getAttribute('data-nav') === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => navObserver.observe(section));
  }

  // Certifications Show More / Show Less
  const certGrid = document.getElementById('certGrid');
  const certShowMore = document.getElementById('certShowMore');
  if (certGrid && certShowMore) {
    const certCards = Array.from(certGrid.querySelectorAll('.cert-card'));
    const tabletQuery = window.matchMedia('(max-width: 980px)');
    const mobileQuery = window.matchMedia('(max-width: 480px)');
    let isExpanded = false;

    function getInitialCertLimit() {
      if (mobileQuery.matches) return 4;
      if (tabletQuery.matches) return 6;
      return 8;
    }

    function hideCardsInstantly(cards) {
      cards.forEach(card => {
        card.style.transition = 'none';
        card.classList.remove('is-visible');
        card.style.display = 'none';
        void card.offsetWidth;
        card.style.transition = '';
      });
    }

    function collapseCardsAnimated(cards) {
      cards.forEach((card, i) => {
        card.style.transitionDelay = prefersReducedMotion ? '0ms' : `${i * 35}ms`;
        card.classList.remove('is-visible');
      });
      const settleDelay = prefersReducedMotion ? 0 : (cards.length * 35 + 380);
      window.setTimeout(() => {
        cards.forEach(card => {
          card.style.display = 'none';
          card.style.transitionDelay = '';
        });
      }, settleDelay);
    }

    function expandCardsAnimated(cards) {
      cards.forEach(card => { card.style.display = ''; });
      void certGrid.offsetWidth;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cards.forEach((card, i) => {
            card.style.transitionDelay = prefersReducedMotion ? '0ms' : `${i * 55}ms`;
            card.classList.add('is-visible');
            card.addEventListener('transitionend', () => {
              card.style.transitionDelay = '';
            }, { once: true });
          });
        });
      });
    }

    function layoutInitial() {
      const limit = getInitialCertLimit();
      const shouldShowButton = certCards.length > limit;
      certShowMore.hidden = !shouldShowButton;
      certShowMore.setAttribute('aria-expanded', 'false');
      certShowMore.textContent = 'Show More Certificates';
      isExpanded = !shouldShowButton;
      hideCardsInstantly(certCards.slice(limit));
    }

    certShowMore.addEventListener('click', () => {
      const limit = getInitialCertLimit();
      const extraCards = certCards.slice(limit);
      isExpanded = !isExpanded;
      certShowMore.setAttribute('aria-expanded', String(isExpanded));
      certShowMore.textContent = isExpanded ? 'Show Less Certificates' : 'Show More Certificates';

      if (isExpanded) {
        expandCardsAnimated(extraCards);
      } else {
        collapseCardsAnimated(extraCards);
        certGrid.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
      }
    });

    if (tabletQuery.addEventListener) tabletQuery.addEventListener('change', layoutInitial);
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', layoutInitial);
    layoutInitial();
  }

  // Certification Lightbox
  const certModal = document.getElementById('certModal');
  const certModalImg = document.getElementById('certModalImg');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalIssuer = document.getElementById('certModalIssuer');
  const certModalClose = document.getElementById('certModalClose');
  let lastFocusedEl = null;

  function openCertModal(trigger) {
    lastFocusedEl = trigger;
    certModalImg.src = trigger.getAttribute('data-cert-img');
    certModalImg.alt = trigger.getAttribute('data-cert-title');
    certModalTitle.textContent = trigger.getAttribute('data-cert-title');
    certModalIssuer.textContent = trigger.getAttribute('data-cert-issuer');
    certModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    certModalClose.focus();
  }

  function closeCertModal() {
    certModal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  document.querySelectorAll('.cert-thumb-btn').forEach(btn => {
    btn.addEventListener('click', () => openCertModal(btn));
  });

  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('is-open')) {
      closeCertModal();
    }
  });

  // Copy Email
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyFeedback = document.getElementById('copyFeedback');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email');
      try {
        await navigator.clipboard.writeText(email);
        copyFeedback.textContent = 'Email address copied to clipboard.';
      } catch (err) {
        copyFeedback.textContent = email;
      }
      setTimeout(() => { copyFeedback.textContent = ''; }, 4000);
    });
  }

  // Light and Dark Toggle (Circle Splash Animation)
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');

  function updateThemeToggleLabels(isLight) {
    themeToggleBtns.forEach(btn => {
      btn.setAttribute('aria-pressed', String(!isLight));
      btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }

  function applyTheme(nextIsLight) {
    document.documentElement.classList.toggle('light', nextIsLight);
    updateThemeToggleLabels(nextIsLight);
    localStorage.setItem('theme', nextIsLight ? 'light' : 'dark');
  }

  function toggleTheme(event) {
    const root = document.documentElement;
    const isLight = root.classList.contains('light');
    const nextIsLight = !isLight;
    const trigger = event.currentTarget;
    const rect = trigger.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (!document.startViewTransition || prefersReducedMotion) {
      applyTheme(nextIsLight);
      return;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      applyTheme(nextIsLight);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 800,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }

  if (themeToggleBtns.length) {
    themeToggleBtns.forEach(btn => btn.addEventListener('click', toggleTheme));

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    }
    updateThemeToggleLabels(savedTheme === 'light');
  }
});
