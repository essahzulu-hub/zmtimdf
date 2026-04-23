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
  
  if (currentScroll > 200) {
    header.classList.add('hidden');
    themeToggle.classList.add('visible');
  } else {
    header.classList.remove('hidden');
    themeToggle.classList.remove('visible');
  }
  
  lastScroll = currentScroll;
});

// Mobile hamburger dropdown menu - persistent
const hamburger = document.querySelector('.hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('active');
    }
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !document.querySelector('.mobile-menu')?.contains(e.target)) {
      hamburger.classList.remove('active');
      document.querySelector('.mobile-menu')?.classList.remove('active');
    }
  });
}

// Reveal sections
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('active'));
}, { threshold: 0.1, rootMargin: '0px 0px -150px 0px' });
reveals.forEach(reveal => observer.observe(reveal));

// Nav active - page + scroll aware
function updateActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    if (section.getBoundingClientRect().top < 150) current = section.id;
  });
  
  // Update all nav links (top + bottom)
  document.querySelectorAll('.nav-links a, #bottom-nav .nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (current && href === `#${current}`) || href.includes(currentPage)) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav(); // Initial

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

// NEW: Parallax hero
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrolled = window.pageYOffset;
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// NEW: Card gallery slideshow - auto 5s
function initCardGalleries() {
  const cardGalleries = document.querySelectorAll('.card-gallery');
  cardGalleries.forEach((gallery, galleryIndex) => {
    const imgs = gallery.querySelectorAll('img');
    const dotsContainer = gallery.querySelector('.card-gallery-dots');
    const prevBtn = gallery.querySelector('.card-gallery-prev');
    const nextBtn = gallery.querySelector('.card-gallery-next');
    
    // Create dots
    imgs.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'card-gallery-dot';
      if (index === 0) dot.classList.add('active');
      dot.onclick = () => goToSlide(galleryIndex, index);
      dotsContainer.appendChild(dot);
    });
    
    let currentSlide = 0;
    const slideInterval = setInterval(() => nextSlide(galleryIndex), 5000);
    
    function nextSlide(gIndex) {
      const g = cardGalleries[gIndex];
      const img = g.querySelectorAll('img');
      const dots = g.querySelectorAll('.card-gallery-dot');
      currentSlide = (currentSlide + 1) % img.length;
      img.forEach((i, idx) => i.classList.toggle('active', idx === currentSlide));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === currentSlide));
    }
    
    function goToSlide(gIndex, slide) {
      const g = cardGalleries[gIndex];
      const img = g.querySelectorAll('img');
      const dots = g.querySelectorAll('.card-gallery-dot');
      currentSlide = slide;
      img.forEach((i, idx) => i.classList.toggle('active', idx === slide));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === slide));
      clearInterval(slideInterval);
      setInterval(() => nextSlide(gIndex), 5000);
    }
    
    prevBtn.onclick = () => {
      currentSlide = (currentSlide - 1 + imgs.length) % imgs.length;
      goToSlide(galleryIndex, currentSlide);
    };
    
    nextBtn.onclick = () => nextSlide(galleryIndex);
    
    // Pause/resume on hover
    gallery.onmouseenter = () => clearInterval(slideInterval);
    gallery.onmouseleave = () => setInterval(() => nextSlide(galleryIndex), 5000);
  });
}

// NEW: Gallery lightbox modal (fighters page gallery)
let currentGalleryIndex = 0;
const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length > 0) {
  galleryItems.forEach((item, index) => {
    item.dataset.galleryIndex = index;
    item.addEventListener('click', openGallery);
  });
}

function openGallery(e) {
  currentGalleryIndex = parseInt(e.currentTarget.dataset.galleryIndex);
  showLightbox();
}

function showLightbox() {
  const lightbox = document.querySelector('.lightbox') || createLightbox();
  const imgs = Array.from(document.querySelectorAll('.gallery-item img'));
  lightbox.querySelector('img').src = imgs[currentGalleryIndex].src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function createLightbox() {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <img src="" alt="Gallery">
    <button class="lightbox-nav lightbox-prev" onclick="previousImg()">‹</button>
    <button class="lightbox-nav lightbox-next" onclick="nextImg()">›</button>
    <button class="lightbox-close" onclick="closeLightbox()">×</button>
  `;
  document.body.appendChild(lightbox);
  return lightbox;
}

function nextImg() { 
  const imgs = document.querySelectorAll('.gallery-item img');
  currentGalleryIndex = (currentGalleryIndex + 1) % imgs.length;
  showLightbox();
}
function previousImg() { 
  const imgs = document.querySelectorAll('.gallery-item img');
  currentGalleryIndex = (currentGalleryIndex - 1 + imgs.length) % imgs.length;
  showLightbox(); 
}
function closeLightbox() { 
  document.querySelector('.lightbox').classList.remove('active'); 
  document.body.style.overflow = '';
}

// NEW: Subtle particles
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(255,255,0,0.5)' : 'rgba(0,102,204,0.5)'
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
initParticles();

initCardGalleries();
