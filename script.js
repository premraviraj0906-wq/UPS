// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 1500);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const overlay   = document.getElementById('navOverlay') || (() => {
  const el = document.createElement('div');
  el.className = 'nav-overlay';
  document.body.appendChild(el);
  return el;
})();

function openMenu() {
  navLinks.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}
function closeMenu() {
  navLinks.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.contains('open') ? closeMenu() : openMenu());
}
overlay.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ===== SCROLL REVEAL (AOS) =====
const aosEls = document.querySelectorAll('[data-aos]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay) || 0;
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
aosEls.forEach(el => revealObserver.observe(el));


// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.count');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target);
    const dur    = 1600;
    const start  = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => counterObserver.observe(c));

// ===== ACTIVE NAV HIGHLIGHT =====
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  let currentId = 'home';

  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      currentId = sec.id;
    }
  });

  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
    a.style.color = '';
  });

  bottomNavItems.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 76,
      behavior: 'smooth'
    });
  });
});

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const total = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
}, { passive: true });

// ===== CURSOR GLOW (desktop) =====
const cursorGlow = document.getElementById('cursor-glow');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (cursorGlow && canHover) {
  document.body.classList.add('cursor-ready');
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;

  window.addEventListener('mousemove', e => {
    glowX += (e.clientX - glowX) * 0.12;
    glowY += (e.clientY - glowY) * 0.12;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
  }, { passive: true });
}

// ===== HERO PARALLAX SHAPES & GRID =====
const shapes = document.querySelectorAll('.hero-bg-shapes .shape');
if (shapes.length) {
  let lastScrollY = window.scrollY;
  let mouseX = 0, mouseY = 0;

  if (canHover) {
    window.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      updateParallax();
    }, { passive: true });
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    updateParallax();
  }, { passive: true });

  function updateParallax() {
    shapes.forEach((shape, i) => {
      const depth = (i + 1) * 12;
      const scrollOffset = lastScrollY * (0.06 * (i + 1));
      const mX = mouseX * depth;
      const mY = mouseY * depth + scrollOffset;
      shape.style.transform = `translate(${mX}px, ${mY}px)`;
    });
  }
}

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  if (!canHover) return;
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== BUTTON RIPPLE =====
document.querySelectorAll('.btn-primary, .btn-outline, .btn-nav').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const size = Math.max(r.width, r.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// ===== POWER CARDS — click pulse =====
document.querySelectorAll('.power-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.add('is-pulsed');
    setTimeout(() => card.classList.remove('is-pulsed'), 600);
  });
});

// ===== SERVICE ITEMS — interactive select =====
document.querySelectorAll('.service-item').forEach(item => {
  item.addEventListener('click', () => {
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.service-item').forEach(i => i.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
  });
});

// ===== PRODUCT CARD TILT + GLOW =====
if (canHover) {
  document.querySelectorAll('.product-card').forEach(card => {
    const glow = document.createElement('div');
    glow.className = 'product-glow';
    card.prepend(glow);

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      glow.style.setProperty('--mx', x + '%');
      glow.style.setProperty('--my', y + '%');

      const tiltX = (e.clientY - r.top) / r.height - 0.5;
      const tiltY = (e.clientX - r.left) / r.width - 0.5;
      card.style.transform = `translateY(-10px) rotateX(${-tiltX * 6}deg) rotateY(${tiltY * 6}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ===== CONTACT FORM =====
function handleSubmit(e) {
  e.preventDefault();
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim() || 'Enquiry from Website';
  const message = document.getElementById('fmessage').value.trim();
  const body    = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  window.location.href = `mailto:Unitypower2018@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ===== CAROUSEL NAVIGATION =====
const productCarousel = document.getElementById('productCarousel');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

if (productCarousel && prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    // Scroll by the width of one card plus gap
    const scrollAmount = productCarousel.offsetWidth * 0.8; 
    productCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  
  nextBtn.addEventListener('click', () => {
    const scrollAmount = productCarousel.offsetWidth * 0.8;
    productCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}
