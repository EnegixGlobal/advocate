/* ================================================================
   ADVOCATE WEBSITE — MAIN JAVASCRIPT v2
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 800);
    });
    document.body.style.overflow = 'hidden';
  }

  // ===== NAVBAR SCROLL =====
  const nav = document.getElementById('mainNav');
  const handleNavScroll = () => {
    // just add/remove scrolled class for shadow intensity — navbar is always solid
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ===== INTERSECTION OBSERVER — ANIMATIONS =====
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('in-view'), delay);
        animObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-anim]').forEach(el => animObserver.observe(el));

  // ===== COUNTER ANIMATION =====
  function runCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2200;
    const step = target / (duration / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = Math.floor(cur);
    }, 16);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-count], .ps-num[data-count]').forEach(el => counterObs.observe(el));

  // ===== HERO PARTICLES =====
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;opacity:0.4;';
    heroSection.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width = heroSection.offsetWidth;
      H = canvas.height = heroSection.offsetHeight;
    }

    function createParticle() {
      return { x: Math.random()*W, y: Math.random()*H, r: Math.random()*2+0.5, vx: (Math.random()-0.5)*0.3, vy: -(Math.random()*0.5+0.2), alpha: Math.random()*0.4+0.1 };
    }

    resize();
    for (let i=0;i<60;i++) particles.push(createParticle());
    window.addEventListener('resize', resize);

    function animParticles() {
      ctx.clearRect(0,0,W,H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = H+5; p.x = Math.random()*W; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(212,133,10,${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(animParticles);
    }
    animParticles();
  }

  // ===== GALLERY FILTER =====
  const gfBtns = document.querySelectorAll('.gf-btn');
  const gmItems = document.querySelectorAll('.gm-item');

  gfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      gfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      gmItems.forEach(item => {
        if (f === 'all' || item.dataset.cat === f) {
          item.style.display = '';
          item.style.animation = 'none';
          void item.offsetWidth;
          item.style.animation = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let lbIdx = 0, lbItems = [];

  function openLB(idx) {
    lbItems = [...gmItems].filter(i => i.style.display !== 'none');
    lbIdx = idx;
    updateLB();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function updateLB() {
    const item = lbItems[lbIdx];
    if (!item) return;
    lbImg.src = item.querySelector('img')?.src || '';
    lbCap.textContent = item.querySelector('.gm-caption')?.textContent || '';
  }
  function closeLB() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  gmItems.forEach((item, idx) => item.addEventListener('click', () => openLB(idx)));
  if (lbClose) lbClose.addEventListener('click', closeLB);
  if (lbPrev) lbPrev.addEventListener('click', () => { lbIdx = (lbIdx-1+lbItems.length)%lbItems.length; updateLB(); });
  if (lbNext) lbNext.addEventListener('click', () => { lbIdx = (lbIdx+1)%lbItems.length; updateLB(); });
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') { lbIdx=(lbIdx-1+lbItems.length)%lbItems.length; updateLB(); }
    if (e.key === 'ArrowRight') { lbIdx=(lbIdx+1)%lbItems.length; updateLB(); }
  });

  // ===== FLOATING WHATSAPP BUTTON =====
  const waBtn = document.createElement('a');
  waBtn.href = 'https://wa.me/919876543210';
  waBtn.target = '_blank';
  waBtn.className = 'float-wa';
  waBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
  waBtn.setAttribute('aria-label', 'Chat on WhatsApp');
  document.body.appendChild(waBtn);

  // ===== BACK TO TOP =====
  const topBtn = document.createElement('button');
  topBtn.className = 'float-top';
  topBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  topBtn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(topBtn);
  window.addEventListener('scroll', () => topBtn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ===== ACTIVE NAV LINK =====
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    link.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });

  // ===== CARD HOVER 3D TILT =====
  document.querySelectorAll('.svc-card, .testi-card, .why-card, .contact-ch').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const y = -((e.clientY - r.top) / r.height - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // ===== PAGE FADE IN =====
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => { document.body.style.opacity = '1'; }));

  // ===== NAVBAR TOGGLE ANIMATION =====
  const toggler = document.querySelector('.navbar-toggler');
  const icons = document.querySelectorAll('.toggler-icon');
  if (toggler) {
    toggler.addEventListener('click', () => {
      const isOpen = toggler.getAttribute('aria-expanded') === 'true';
      if (icons[0] && icons[1] && icons[2]) {
        icons[0].style.transform = isOpen ? '' : 'rotate(45deg) translate(5px, 6px)';
        icons[1].style.opacity = isOpen ? '1' : '0';
        icons[2].style.transform = isOpen ? '' : 'rotate(-45deg) translate(5px, -6px)';
      }
    });
  }

});