// Supabase setup
const { createClient } = supabase;
const _supabase = createClient(
  'https://xwqjsnmtafifbtttausm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3cWpzbm10YWZpZmJ0dHRhdXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDI5NTMsImV4cCI6MjA5MjI3ODk1M30.T0MJmjhLNM24q2cSF3TzcdmZivgLxOuYwtMWkkvLFNs'
);

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle') || createToggle();
const html = document.documentElement;

function createToggle() {
  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.textContent = '☀️';
  toggle.title = 'Toggle Theme';
  document.querySelector('.container.nav').appendChild(toggle);
  return toggle;
}

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

function initTheme() {
  const saved = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  setTheme(saved);
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme') || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Existing functionality
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// Reveal sections
const reveals = document.querySelectorAll('.reveal');
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -150px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

reveals.forEach(reveal => observer.observe(reveal));

// Nav active on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (section.getBoundingClientRect().top < 150) {
      current = section.id;
    }
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
});

// Year update
document.getElementById('year').textContent = new Date().getYear() + 1900;

// Smooth scroll
document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    target?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Form submit
document.querySelector('form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const { error } = await _supabase
    .from('contact_submissions')
    .insert({
      name: form.querySelector('input[type="text"]').value,
      email: form.querySelector('input[type="email"]').value,
      goal: form.querySelector('select').value,
      message: form.querySelector('textarea').value,
    });

  if (error) {
    alert('Something went wrong. Please try again.');
    console.error(error);
  } else {
    alert('Thanks! We will be in touch soon. 🥊');
    form.reset();
  }
});
initTheme();
