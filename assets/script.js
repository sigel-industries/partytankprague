/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ---------- Language toggle (EN / CZ) ---------- */
function applyLanguage(lang) {
  const dict = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS[lang] : null;
  if (!dict) return;
  document.documentElement.setAttribute('lang', lang === 'cs' ? 'cs' : 'en');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  localStorage.setItem('ptp_lang', lang);
  document.querySelectorAll('.lang-switch').forEach(btn => {
    btn.textContent = lang === 'cs' ? 'CZ / EN' : 'EN / CZ';
  });
  if (typeof window.refreshExperienceLanguage === 'function') {
    window.refreshExperienceLanguage(lang);
  }
}
function toggleLanguage() {
  const current = localStorage.getItem('ptp_lang') || 'en';
  applyLanguage(current === 'en' ? 'cs' : 'en');
}
document.getElementById('langSwitch')?.addEventListener('click', toggleLanguage);
document.getElementById('langSwitchMobile')?.addEventListener('click', toggleLanguage);
applyLanguage(localStorage.getItem('ptp_lang') || 'en');

/* ---------- Cookie banner ---------- */
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
if (cookieBanner) {
  if (!localStorage.getItem('ptp_cookie_ack')) {
    setTimeout(() => cookieBanner.classList.add('show'), 800);
  }
  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('ptp_cookie_ack', '1');
    cookieBanner.classList.remove('show');
  });
}

/* ---------- Booking form ---------- */
const form = document.getElementById('bookingForm');
const note = document.getElementById('formNote');
const formIsConfigured = form && !form.action.includes('YOUR_FORM_ID');

form.addEventListener('submit', async (e) => {
  if (!formIsConfigured) {
    e.preventDefault();
    note.textContent = 'Demo mode — connect this form to Formspree (see code comment above) to receive real requests.';
    note.style.color = '#52e0c4';
    form.reset();
    return;
  }
  e.preventDefault();
  note.textContent = 'Sending…';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      note.textContent = 'Request sent — we will get back to you to confirm.';
      note.style.color = '#52e0c4';
      form.reset();
    } else {
      note.textContent = 'Something went wrong sending that — try again or email us directly.';
      note.style.color = '#ff7a3d';
    }
  } catch (err) {
    note.textContent = 'Something went wrong sending that — try again or email us directly.';
    note.style.color = '#ff7a3d';
  }
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

    if (heroMedia && !window.matchMedia('(max-width: 600px)').matches) {
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

/* ---------- The Tank feature explorer ---------- */
const tankVisual = document.getElementById('tankVisual');
const tankFeatureButtons = [...document.querySelectorAll('[data-tank-feature]')];

function setTankFeature(index) {
  if (!tankVisual || !tankFeatureButtons[index]) return;
  tankVisual.dataset.activeFeature = String(index);
  tankFeatureButtons.forEach((button, buttonIndex) => {
    const active = buttonIndex === index;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

tankFeatureButtons.forEach((button, index) => {
  button.addEventListener('click', () => setTankFeature(index));
  button.addEventListener('focus', () => setTankFeature(index));
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    button.addEventListener('mouseenter', () => setTankFeature(index));
  }
  button.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (index + direction + tankFeatureButtons.length) % tankFeatureButtons.length;
    tankFeatureButtons[nextIndex].focus();
  });
});

setTankFeature(0);

/* ---------- Experience journey ---------- */
const EXPERIENCE_SCENES = [
  {
    id: 'prague',
    accent: '#ffb088',
    hero: 'assets/experiences/prague-main.webp',
    gallery: [
      'assets/experiences/prague-main.webp',
      'assets/experiences/prague-alt-1.webp',
      'assets/experiences/prague-alt-2.webp'
    ]
  },
  {
    id: 'wedding',
    accent: '#f3d6ad',
    hero: 'assets/experiences/wedding-main.webp',
    gallery: [
      'assets/experiences/wedding-main.webp',
      'assets/experiences/wedding-alt-1.webp',
      'assets/experiences/wedding-alt-2.webp'
    ]
  },
  {
    id: 'birthday',
    accent: '#ff8b79',
    hero: 'assets/experiences/birthday-main.webp',
    gallery: [
      'assets/experiences/birthday-main.webp',
      'assets/experiences/birthday-alt-1.webp',
      'assets/experiences/birthday-alt-2.webp'
    ]
  },
  {
    id: 'vip',
    accent: '#8bc6ff',
    hero: 'assets/experiences/vip-main.webp',
    gallery: [
      'assets/experiences/vip-main.webp',
      'assets/experiences/vip-alt-1.webp',
      'assets/experiences/vip-alt-2.webp'
    ]
  },
  {
    id: 'party',
    accent: '#ff58b5',
    hero: 'assets/experiences/party-main.webp',
    gallery: [
      'assets/experiences/party-main.webp',
      'assets/experiences/party-alt-1.webp',
      'assets/experiences/party-alt-2.webp'
    ]
  }
];

const experienceJourney = document.getElementById('experienceJourney');
const experienceStage = document.getElementById('experienceStage');
const experienceVisuals = [...document.querySelectorAll('[data-experience-visual]')];
const experienceNavButtons = [...document.querySelectorAll('[data-experience-jump]')];
const experienceMood = document.getElementById('experienceMood');
const experienceTitle = document.getElementById('experienceTitle');
const experienceDescription = document.getElementById('experienceDescription');
const experienceProgress = document.getElementById('experienceProgress');
const experienceChapterNumber = document.getElementById('experienceChapterNumber');
const experienceChapterWord = document.getElementById('experienceChapterWord');
const experienceOpenButton = document.getElementById('experienceOpen');
const experienceContent = document.querySelector('.experience-content');

const experienceModal = document.getElementById('experienceModal');
const experienceModalHero = document.getElementById('experienceModalHero');
const experienceModalStrip = document.getElementById('experienceModalStrip');
const experienceModalMood = document.getElementById('experienceModalMood');
const experienceModalTitle = document.getElementById('experienceModalTitle');
const experienceModalLead = document.getElementById('experienceModalLead');
const experienceModalFacts = document.getElementById('experienceModalFacts');

let activeExperienceIndex = 0;
let openExperienceId = null;
let experienceLastFocus = null;
let experienceScrollTicking = false;

function experienceDictionary() {
  const lang = localStorage.getItem('ptp_lang') || 'en';
  return (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : TRANSLATIONS.en;
}

function experienceText(sceneId, field) {
  const dict = experienceDictionary();
  return dict[`exp_${sceneId}_${field}`] || '';
}

function animateExperienceCopy() {
  if (!experienceContent || reduceMotion || typeof experienceContent.animate !== 'function') return;
  experienceContent.animate(
    [
      { opacity: 0.22, transform: 'translateY(14px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    { duration: 470, easing: 'cubic-bezier(.16,.8,.3,1)' }
  );
}

function renderExperienceScene(index, animate = true) {
  if (!experienceStage || !EXPERIENCE_SCENES[index]) return;
  const scene = EXPERIENCE_SCENES[index];
  const changed = index !== activeExperienceIndex;
  activeExperienceIndex = index;

  experienceStage.dataset.activeScene = String(index);
  experienceStage.style.setProperty('--scene-accent', scene.accent);
  experienceStage.style.setProperty('--scene-progress', String(index));

  experienceVisuals.forEach((visual, visualIndex) => {
    visual.classList.toggle('is-active', visualIndex === index);
  });

  experienceNavButtons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === index;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  if (experienceMood) experienceMood.textContent = experienceText(scene.id, 'mood');
  if (experienceTitle) experienceTitle.textContent = experienceText(scene.id, 'title');
  if (experienceDescription) experienceDescription.textContent = experienceText(scene.id, 'text');
  if (experienceProgress) experienceProgress.textContent = `${String(index + 1).padStart(2, '0')} / ${String(EXPERIENCE_SCENES.length).padStart(2, '0')}`;
  if (experienceChapterNumber) experienceChapterNumber.textContent = String(index + 1).padStart(2, '0');
  if (experienceChapterWord) experienceChapterWord.textContent = experienceText(scene.id, 'chapter') || scene.id.toUpperCase();
  if (experienceOpenButton) experienceOpenButton.dataset.experienceOpen = scene.id;

  if (animate && changed) animateExperienceCopy();
}

function experienceIndexFromScroll() {
  if (!experienceJourney) return 0;
  const rect = experienceJourney.getBoundingClientRect();
  const scrollable = Math.max(1, experienceJourney.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
  return Math.min(
    EXPERIENCE_SCENES.length - 1,
    Math.max(0, Math.round(progress * (EXPERIENCE_SCENES.length - 1)))
  );
}

function updateExperienceFromScroll() {
  renderExperienceScene(experienceIndexFromScroll());
  experienceScrollTicking = false;
}

function scrollToExperience(index) {
  if (!experienceJourney || !EXPERIENCE_SCENES[index]) return;
  const sectionTop = window.scrollY + experienceJourney.getBoundingClientRect().top;
  const scrollable = Math.max(1, experienceJourney.offsetHeight - window.innerHeight);
  const ratio = index / Math.max(1, EXPERIENCE_SCENES.length - 1);
  window.scrollTo({ top: sectionTop + scrollable * ratio, behavior: reduceMotion ? 'auto' : 'smooth' });
}

experienceNavButtons.forEach(button => {
  button.addEventListener('click', () => {
    scrollToExperience(Number(button.dataset.experienceJump));
  });
});

if (experienceJourney) {
  window.addEventListener('scroll', () => {
    if (!experienceScrollTicking) {
      requestAnimationFrame(updateExperienceFromScroll);
      experienceScrollTicking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateExperienceFromScroll);

  const experienceVisibility = new IntersectionObserver(entries => {
    document.body.classList.toggle('experience-in-view', entries.some(entry => entry.isIntersecting));
  }, { threshold: 0.08 });
  experienceVisibility.observe(experienceJourney);

  renderExperienceScene(0, false);
}

function fillExperienceModal(scene) {
  if (!scene || !experienceModal) return;
  experienceModal.style.setProperty('--scene-accent', scene.accent);
  openExperienceId = scene.id;
  if (experienceModalHero) {
    experienceModalHero.src = scene.hero;
    experienceModalHero.alt = experienceText(scene.id, 'modal_title');
  }
  if (experienceModalMood) experienceModalMood.textContent = experienceText(scene.id, 'mood');
  if (experienceModalTitle) experienceModalTitle.textContent = experienceText(scene.id, 'modal_title');
  if (experienceModalLead) experienceModalLead.textContent = experienceText(scene.id, 'modal_lead');
  if (experienceModalFacts) {
    experienceModalFacts.innerHTML = [1, 2, 3]
      .map(number => `<li>${experienceText(scene.id, `fact${number}`)}</li>`)
      .join('');
  }
  if (experienceModalStrip) {
    experienceModalStrip.innerHTML = '';
    scene.gallery.forEach((src, imageIndex) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = `experience-dialog-thumb${imageIndex === 0 ? ' is-active' : ''}`;
      thumb.setAttribute('aria-label', `Show image ${imageIndex + 1}`);
      thumb.innerHTML = `<img src="${src}" alt="">`;
      thumb.addEventListener('click', () => {
        experienceModalHero.src = src;
        experienceModalStrip.querySelectorAll('.experience-dialog-thumb').forEach(el => el.classList.remove('is-active'));
        thumb.classList.add('is-active');
      });
      experienceModalStrip.appendChild(thumb);
    });
  }
}

function openExperienceModal(sceneId) {
  const scene = EXPERIENCE_SCENES.find(item => item.id === sceneId);
  if (!scene || !experienceModal) return;
  experienceLastFocus = document.activeElement;
  fillExperienceModal(scene);
  experienceModal.classList.add('is-open');
  experienceModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  experienceModal.querySelector('.experience-dialog-close')?.focus();
}

function closeExperienceModal() {
  if (!experienceModal) return;
  experienceModal.classList.remove('is-open');
  experienceModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  openExperienceId = null;
  if (experienceLastFocus instanceof HTMLElement) experienceLastFocus.focus();
}

experienceOpenButton?.addEventListener('click', () => {
  openExperienceModal(experienceOpenButton.dataset.experienceOpen);
});

document.querySelectorAll('[data-experience-close]').forEach(element => {
  element.addEventListener('click', closeExperienceModal);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && experienceModal?.classList.contains('is-open')) {
    closeExperienceModal();
  }
});

window.refreshExperienceLanguage = function refreshExperienceLanguage() {
  renderExperienceScene(activeExperienceIndex, false);
  if (openExperienceId) {
    const openScene = EXPERIENCE_SCENES.find(scene => scene.id === openExperienceId);
    if (openScene) fillExperienceModal(openScene);
  }
};

renderExperienceScene(0, false);
updateExperienceFromScroll();
