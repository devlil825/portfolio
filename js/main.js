/* ================================================
   LIL POKHREL PORTFOLIO — SHARED JAVASCRIPT
   ================================================ */

(function () {
  'use strict';

  /* ── NAV SCROLL SHADOW ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ── HAMBURGER / MOBILE MENU ── */
  const ham = document.getElementById('navHam');
  const mob = document.getElementById('navMobile');
  if (ham && mob) {
    ham.addEventListener('click', () => {
      const open = mob.classList.toggle('open');
      ham.setAttribute('aria-expanded', open);
      const spans = ham.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    // Close on link click
    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mob.classList.remove('open');
        const spans = ham.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* ── ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── REVEAL ON SCROLL ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── SKILL BAR ANIMATION ── */
  const fills = document.querySelectorAll('.progress-fill');
  if (fills.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const pct = fill.dataset.pct || '0';
          setTimeout(() => { fill.style.width = pct + '%'; }, 200);
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
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.display = match ? '' : 'none';
          card.style.opacity = match ? '1' : '0';
        });
      });
    });
  }

  /* ── CONTACT FORM ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('#name')?.value.trim();
      const email = form.querySelector('#email')?.value.trim();
      const message = form.querySelector('#message')?.value.trim();
      const submitBtn = form.querySelector('[type="submit"]');

      if (!name || !email || !message) {
        showFormMsg('Please fill in all required fields.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormMsg('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate sending
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      setTimeout(() => {
        showFormMsg('✅ Message sent! Lil will reply within 24 hours.', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }, 1200);
    });
  }

  function showFormMsg(msg, type) {
    let el = document.getElementById('formMsg');
    if (!el) {
      el = document.createElement('div');
      el.id = 'formMsg';
      document.getElementById('contactForm')?.appendChild(el);
    }
    el.textContent = msg;
    el.style.cssText = `
      margin-top:1rem; padding:.9rem 1.2rem; border-radius:8px; font-size:.88rem;
      font-weight:600; text-align:center;
      background:${type === 'success' ? 'var(--accent-light)' : '#fef2f2'};
      color:${type === 'success' ? 'var(--accent)' : '#dc2626'};
      border:1px solid ${type === 'success' ? 'rgba(42,125,111,.2)' : 'rgba(220,38,38,.2)'};
    `;
  }

  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = Math.ceil(target / 50);
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + suffix;
            if (current >= target) clearInterval(timer);
          }, 30);
          cObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObserver.observe(c));
  }

  /* ── SMOOTH TOOLTIP ── */
  document.querySelectorAll('[data-tip]').forEach(el => {
    el.style.position = 'relative';
    el.addEventListener('mouseenter', () => {
      const tip = document.createElement('span');
      tip.className = 'tooltip-bubble';
      tip.textContent = el.dataset.tip;
      tip.style.cssText = `
        position:absolute; bottom:calc(100% + 8px); left:50%;
        transform:translateX(-50%);
        background:var(--text); color:#fff;
        font-size:.72rem; padding:.3rem .7rem;
        border-radius:5px; white-space:nowrap;
        pointer-events:none; z-index:999;
        font-family:var(--ff-m);
        box-shadow:0 4px 12px rgba(0,0,0,.15);
      `;
      el.appendChild(tip);
    });
    el.addEventListener('mouseleave', () => {
      el.querySelector('.tooltip-bubble')?.remove();
    });
  });

})();
