const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
const header = document.querySelector('[data-header]');
const form = document.querySelector('[data-booking-form]');
const formNote = document.querySelector('[data-form-note]');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('is-open'));
  });
}

if (header) {
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (formNote) {
      formNote.textContent = 'Demo mode: request captured visually, but not sent anywhere yet.';
    }
  });
}
