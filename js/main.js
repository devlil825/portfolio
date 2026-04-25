/* ================================================
   LIL POKHREL PORTFOLIO — SHARED JAVASCRIPT
   Fully responsive: nav, reveal, bars, filter, form
   ================================================ */

(function () {
  'use strict';

  /* ── NAV SCROLL SHADOW ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── HAMBURGER / MOBILE MENU ── */
  const ham = document.getElementById('navHam');
  const mob = document.getElementById('navMobile');
  if (ham && mob) {
    ham.addEventListener('click', () => {
      const isOpen = mob.classList.toggle('open');
      ham.setAttribute('aria-expanded', String(isOpen));
      const [s1, s2, s3] = ham.querySelectorAll('span');
      if (isOpen) {
        s1.style.transform = 'translateY(7px) rotate(45deg)';
        s2.style.opacity = '0';
        s3.style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        [s1, s2, s3].forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close drawer on any link tap
    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mob.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
        ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (mob.classList.contains('open') && !mob.contains(e.target) && !ham.contains(e.target)) {
        mob.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
        ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  /* ── ACTIVE NAV LINK ── */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── REVEAL ON SCROLL (uses .visible class) ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    // Trigger immediately for elements already in view
    const checkReveal = (entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    };
    const revealObserver = new IntersectionObserver(
      entries => entries.forEach(checkReveal),
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ── SKILL BAR ANIMATION ── */
  const fills = document.querySelectorAll('.progress-fill[data-pct]');
  if (fills.length) {
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          setTimeout(() => { fill.style.width = (fill.dataset.pct || '0') + '%'; }, 200);
          barObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    fills.forEach(f => barObserver.observe(f));
  }

  /* ── PROJECT FILTER ── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('[data-category]');
  if (filterTabs.length && projectCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        projectCards.forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 45));
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + suffix;
            if (current >= target) clearInterval(timer);
          }, 28);
          cObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObserver.observe(c));
  }

  /* ── CONTACT FORM ── */
 const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async function (e) {

    e.preventDefault();

    const name = (form.querySelector('#firstName')?.value || '').trim();
    const email = (form.querySelector('#email')?.value || '').trim();
    const msg = (form.querySelector('#message')?.value || '').trim();

    const btn = form.querySelector('[type="submit"]');

    if (!name) {
      showMsg('Please enter your name.', 'error');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg('Please enter a valid email address.', 'error');
      return;
    }

    if (!msg) {
      showMsg('Please write a message.', 'error');
      return;
    }

    btn.disabled = true;

    const originalText = btn.innerHTML;

    btn.innerHTML = '<span>⏳</span><span>Sending...</span>';

    try {

      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {

        showMsg('✅ Message sent successfully!', 'success');

        form.reset();

      } else {

        showMsg('❌ Failed to send message.', 'error');

      }

    } catch (error) {

      showMsg('❌ Network error. Please try again.', 'error');

    }

    btn.disabled = false;

    btn.innerHTML = originalText;

  });
}
    function showMsg(text, type) {
      let el = document.getElementById('formMsg');
      if (!el) {
        el = document.createElement('div');
        el.id = 'formMsg';
        form.appendChild(el);
      }
      el.textContent = text;
      const isOk = type === 'success';
      el.style.cssText = `
        margin-top:.9rem;padding:.85rem 1.1rem;border-radius:8px;
        font-size:.86rem;font-weight:600;text-align:center;
        background:${isOk ? 'var(--accent-light)' : '#fef2f2'};
        color:${isOk ? 'var(--accent)' : '#dc2626'};
        border:1px solid ${isOk ? 'rgba(42,125,111,.2)' : 'rgba(220,38,38,.2)'};
      `;
    }
  }

})();
