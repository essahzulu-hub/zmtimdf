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

// Header scroll hide animation
const header = document.getElementById('header');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  
  if (currentScroll > 100) {
    header.classList.add('hidden');
    themeToggle.classList.add('visible');
  } else {
    header.classList.remove('hidden');
    themeToggle.classList.remove('visible');
  }
  
  lastScroll = currentScroll;
});

// Mobile hamburger dropdown menu
const hamburger = document.querySelector('.hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    
    const mobileMenu = document.querySelector('.mobile-menu') || document.createElement('ul');
    if (!mobileMenu.classList.contains('mobile-menu')) {
      mobileMenu.className = 'mobile-menu';
      mobileMenu.innerHTML = `
        <li><a href="index.html#home">Home</a></li>
        <li><a href="index.html#about">About</a></li>
        <li><a href="programs.html">Programs</a></li>
        <li><a href="fighters.html">Fighters</a></li>
        <li><a href="contact.html">Contact</a></li>
      `;
      const navLinks = document.querySelector('.nav-links');
      navLinks.appendChild(mobileMenu);
    }
    
    mobileMenu.classList.toggle('active');
    
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        setTimeout(() => mobileMenu.remove(), 300);
      });
    });
  });
}

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

