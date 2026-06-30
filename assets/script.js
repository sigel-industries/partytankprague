// Mobile menu toggle
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Booking form (demo — wire to Formspree/email backend later)
const form = document.getElementById('bookingForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Request captured locally (demo). Connect this form to Formspree, email or your CRM to actually receive it.';
  note.style.color = '#2fd4ff';
  form.reset();
});
