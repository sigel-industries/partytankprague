const body = document.body;
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const langToggle = document.getElementById('langToggle');
const scrollProgress = document.getElementById('scrollProgress');
const selectedPackage = document.getElementById('selectedPackage');
const priceNote = document.getElementById('priceNote');
const bookingForm = document.getElementById('bookingForm');
const quickPanel = document.getElementById('quickPanel');
const formStatus = document.getElementById('formStatus');

let activeLang = localStorage.getItem('ptp_lang') || 'en';
let activePackage = '1 hour city ride';
let activePrice = '4900';

function applyLanguage(lang) {
  activeLang = lang;
  document.documentElement.lang = lang === 'cs' ? 'cs' : 'en';
  body.dataset.lang = lang;
  localStorage.setItem('ptp_lang', lang);

  document.querySelectorAll('[data-en][data-cs]').forEach((node) => {
    const value = node.dataset[lang];
    if (typeof value === 'string') node.textContent = value;
  });

  if (langToggle) langToggle.textContent = lang === 'en' ? 'CZ' : 'EN';
  updatePriceNote();
}

if (langToggle) {
  langToggle.addEventListener('click', () => applyLanguage(activeLang === 'en' ? 'cs' : 'en'));
}
applyLanguage(activeLang);

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    body.classList.toggle('menu-open', open);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      body.classList.remove('menu-open');
    });
  });
}

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll('[data-reveal]').forEach((el) => {
  if (revealObserver) revealObserver.observe(el);
  else el.classList.add('is-visible');
});

window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = `${progress}%`;
}, { passive: true });

function updatePriceNote() {
  if (!priceNote) return;
  if (activeLang === 'cs') {
    const translated = activePackage
      .replace('1 hour city ride', '1 hodina městská jízda')
      .replace('2 hour party ride', '2 hodiny party jízda')
      .replace('3 hour extended ride', '3 hodiny prodloužená jízda')
      .replace('Airport or hotel transfer', 'Letištní nebo hotelový transfer');
    priceNote.textContent = `Vybráno: ${translated} · od ${Number(activePrice).toLocaleString('cs-CZ')} Kč`;
  } else {
    priceNote.textContent = `Selected: ${activePackage} · from ${Number(activePrice).toLocaleString('en-US')} CZK`;
  }
}

document.querySelectorAll('.price-card').forEach((card) => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.price-card').forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
    activePackage = card.dataset.package || activePackage;
    activePrice = card.dataset.price || activePrice;
    if (selectedPackage) selectedPackage.value = activePackage;
    updatePriceNote();
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

if (quickPanel) {
  quickPanel.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(quickPanel);
    const date = data.get('quick-date');
    const guests = data.get('quick-guests');
    const eventType = data.get('quick-event');
    const form = bookingForm;
    if (form) {
      if (date && form.elements.date) form.elements.date.value = date;
      if (guests && form.elements.guests) form.elements.guests.value = guests;
      if (eventType && form.elements.message) {
        form.elements.message.value = `${eventType}\n` + form.elements.message.value;
      }
    }
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!formStatus) return;
    const message = activeLang === 'cs'
      ? 'Demo režim: v reálné verzi se teď odešle e-mail, uloží lead a spustí automatizace. Zatím jsme jen civilizovaně zabránili falešné rezervaci.'
      : 'Demo mode: in production this would send an email, save the lead and trigger automation. For now, we politely avoided creating a fake booking.';
    formStatus.textContent = message;
    formStatus.classList.add('success');
  });
}

const magneticItems = document.querySelectorAll('.magnetic');
magneticItems.forEach((item) => {
  item.addEventListener('mousemove', (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

const tiltCards = document.querySelectorAll('.scene-card');
if (window.matchMedia('(hover:hover)').matches) {
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = (x - rect.width / 2) / 28;
      const rotateX = (rect.height / 2 - y) / 32;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

document.querySelectorAll('details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('details').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});
