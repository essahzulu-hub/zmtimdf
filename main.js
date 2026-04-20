// Standalone Theme Toggle - Bottom Left Floating Button
let themeToggle;
let isDark = true;

function createToggle() {
  themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle-bottom';
  themeToggle.textContent = '☀️';
  themeToggle.setAttribute('aria-label', 'Toggle theme');
  themeToggle.title = 'Toggle Light/Dark Mode';
  document.body.appendChild(themeToggle);
  return themeToggle;
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  isDark = saved !== 'light';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
}

if (!document.querySelector('.theme-toggle-bottom')) {
  themeToggle = createToggle();
} else {
  themeToggle = document.querySelector('.theme-toggle-bottom');
}

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
});

initTheme();

// Header scroll hide animation + theme button show
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.style.transform = 'translateY(-100%)';
    header.style.opacity = '0';
    themeToggle.classList.add('visible');
  } else {
    header.style.transform = 'translateY(0)';
    header.style.opacity = '1';
    themeToggle.classList.remove('visible');
  }
});

// Remove header theme toggle if exists (keep only bottom one)
document.querySelector('.nav .theme-toggle')?.remove();

// Reveal sections
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('active'));
}, { threshold: 0.1, rootMargin: '0px 0px -150px 0px' });
reveals.forEach(reveal => observer.observe(reveal));

// Nav active
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (section.getBoundingClientRect().top < 150) current = section.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(anchor.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Form
document.querySelector('form')?.addEventListener('submit', e => {
  e.preventDefault();
  alert('Thanks! Message sent. 🥊');
  e.target.reset();
});
