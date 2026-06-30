/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ---------- Booking form (demo) ---------- */
const form = document.getElementById('bookingForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Request captured locally (demo). Connect this form to Formspree, email or your CRM to actually receive it.';
  note.style.color = '#52e0c4';
  form.reset();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Map: draw route line + pin pop-in ---------- */
  const mapPath = document.getElementById('mapRoutePath');
  const mapWrap = document.querySelector('.map-wrap');
  if (mapPath && mapWrap) {
    const len = mapPath.getTotalLength();
    mapPath.style.strokeDasharray = len;
    mapPath.style.strokeDashoffset = len;
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mapWrap.classList.add('is-visible');
          mapPath.style.strokeDashoffset = '0';
          mapObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    mapObserver.observe(mapWrap);
  }

  /* ---------- Trust bar count-up ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => countObserver.observe(c));
  }

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll('.magnetic').forEach(btn => {
    let bounds;
    btn.addEventListener('mouseenter', () => { bounds = btn.getBoundingClientRect(); });
    btn.addEventListener('mousemove', (e) => {
      if (!bounds) bounds = btn.getBoundingClientRect();
      const relX = e.clientX - bounds.left - bounds.width / 2;
      const relY = e.clientY - bounds.top - bounds.height / 2;
      btn.style.transform = `translate(${relX * 0.18}px, ${relY * 0.32}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  /* ---------- Parallax media (hero + route/vehicle photos) ---------- */
  const heroMedia = document.getElementById('heroMedia');
  const parallaxImgs = document.querySelectorAll('.parallax-img img');
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    if (heroMedia) {
      const heroImg = heroMedia.querySelector('img');
      const heroH = heroMedia.offsetHeight;
      if (scrollY < heroH * 1.2) {
        heroImg.style.transform = `translateY(${scrollY * 0.28}px) scale(1.06)`;
      }
    }

    parallaxImgs.forEach(img => {
      const rect = img.parentElement.getBoundingClientRect();
      const winH = window.innerHeight;
      if (rect.bottom > 0 && rect.top < winH) {
        const progress = (rect.top - winH) / (winH + rect.height); // -1..0 roughly
        const shift = progress * -40;
        img.style.transform = `translateY(${shift}px) scale(1.12)`;
      }
    });

    /* nav scrolled state */
    const nav = document.querySelector('.nav');
    if (nav) nav.classList.toggle('scrolled', scrollY > 40);

    /* sticky cta visibility */
    const stickyCta = document.querySelector('.sticky-cta');
    if (stickyCta) {
      const heroH = heroMedia ? heroMedia.offsetHeight : 600;
      stickyCta.classList.toggle('show', scrollY > heroH);
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();

} else {
  /* reduced motion: just reveal everything immediately */
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  document.querySelectorAll('[data-count]').forEach(el => {
    el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
  });
}
