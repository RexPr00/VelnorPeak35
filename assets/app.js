(() => {
  const body = document.body;
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-backdrop]');
  const closeBtn = document.querySelector('[data-drawer-close]');
  const langBtn = document.querySelector('[data-lang-btn]');
  const langMenu = document.querySelector('[data-lang-menu]');
  const privacyOpeners = document.querySelectorAll('[data-open-privacy]');
  const modal = document.querySelector('[data-modal]');
  const modalClose = document.querySelectorAll('[data-modal-close]');
  const faqItems = document.querySelectorAll('.faq-item');

  let lastFocused = null;

  const focusableSelector = 'a,button,input,summary,[tabindex]:not([tabindex="-1"])';

  function trapFocus(container, e) {
    const focusables = [...container.querySelectorAll(focusableSelector)].filter(el => !el.disabled);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocused = document.activeElement;
    drawer.classList.add('open');
    backdrop.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    body.classList.add('scroll-lock');
    const firstTarget = drawer.querySelector('a,button');
    if (firstTarget) firstTarget.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    body.classList.remove('scroll-lock');
    if (lastFocused) lastFocused.focus();
  }

  burger?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  langBtn?.addEventListener('click', () => {
    const isOpen = langMenu.classList.toggle('open');
    langBtn.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (langMenu && langBtn && !langBtn.contains(e.target) && !langMenu.contains(e.target)) {
      langMenu.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
      langMenu?.classList.remove('open');
    }
    if (drawer?.classList.contains('open')) trapFocus(drawer, e);
    if (modal?.classList.contains('open')) trapFocus(modal.querySelector('.modal-box'), e);
  });

  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('scroll-lock');
    const target = modal.querySelector('[data-modal-close]');
    if (target) target.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('scroll-lock');
    if (lastFocused) lastFocused.focus();
  }

  privacyOpeners.forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));
  modalClose.forEach(el => el.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
