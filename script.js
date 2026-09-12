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

// ========================================================
// ===== PROJECTS SHOWCASE & LIGHTBOX INTERACTION =====
// ========================================================

const projectsData = [
  {
    id: 1,
    title: 'Vertiv Liebert ITA2 Rackmount UPS & Exide Powersafe SMF Bank',
    category: 'Enterprise IT',
    app: 'Server Room / IT Data Center, Bengaluru',
    status: 'Active Server Room',
    img: 'assets/images/server-room-vertiv-ups.jpeg',
    desc: 'High-density enterprise server room deployment designed for continuous computing uptime. Features a Vertiv Liebert ITA2 true online double-conversion UPS, interconnected with a heavy-duty multi-tier rack holding 16 Exide Powersafe SMF/VRLA batteries and Legrand industrial distribution switchgear.',
    specs: [
      { label: 'System Topology', val: 'Online Double Conversion' },
      { label: 'Battery Bank', val: '16x Exide Powersafe SMF' },
      { label: 'Transfer Time', val: '0 ms (Continuous)' },
      { label: 'Switchgear', val: 'Legrand Isolation Breakers' }
    ]
  },
  {
    id: 2,
    title: 'Commercial On-Grid Rooftop Solar Power Plant',
    category: 'Solar Energy',
    app: 'Commercial Rooftop Installation, Karnataka',
    status: 'Commissioned Site',
    img: 'assets/images/rooftop-solar-installation.jpeg',
    desc: 'Turnkey rooftop solar installation reducing enterprise energy footprint and providing clean daytime power directly to building loads. Engineered with high-efficiency monocrystalline solar panels on wind-resistant galvanized structural racking.',
    specs: [
      { label: 'Installation Type', val: 'Rooftop On-Grid Solar' },
      { label: 'Solar Modules', val: 'Tier-1 Mono PERC Panels' },
      { label: 'Mounting Structure', val: 'Hot-Dip Galvanized Iron' },
      { label: 'ROI Estimate', val: '3.5 - 4 Years' }
    ]
  },
  {
    id: 3,
    title: 'Servopack Heavy-Duty Industrial Servo Voltage Stabilizer',
    category: 'Servo Stabilizer',
    app: 'Industrial Manufacturing Plant, Bengaluru',
    status: 'Substation Room',
    img: 'assets/images/industrial-servo-stabilizer-servopack.jpeg',
    desc: 'Precision heavy-duty industrial Servo Stabilizer installed inside a main electrical switchroom. Protects automated manufacturing and CNC equipment against voltage sags, surges, and unbalanced 3-phase grid supplies.',
    specs: [
      { label: 'Stabilizer Type', val: 'Digital Industrial Servo' },
      { label: 'Winding Material', val: '100% Heavy Copper Wound' },
      { label: 'Response Speed', val: '< 10ms Fast Response' },
      { label: 'Protection', val: 'High/Low Voltage & Phase Fault' }
    ]
  },
  {
    id: 4,
    title: 'Microtek Jumbo New 5500+ Commercial Power System',
    category: 'Inverter & Battery',
    app: 'Commercial Facility & Medical Labs, Bengaluru',
    status: 'High Capacity',
    img: 'assets/images/microtek-jumbo-5500-battery-bank.jpeg',
    desc: 'Heavy-duty 5.5kVA commercial inverter setup paired with a 4-battery industrial tubular bank. Drives heavy loads such as diagnostic medical machines, studio lighting, and IT clusters with reliable pure sine wave output.',
    specs: [
      { label: 'Capacity', val: '5.5 kVA Pure Sine Wave' },
      { label: 'Battery Bank', val: '4x Tall Tubular Batteries (48V)' },
      { label: 'Charging Tech', val: 'Microcontroller Multi-Stage' },
      { label: 'Load Support', val: 'Air Coolers, IT Labs, Motors' }
    ]
  },
  {
    id: 5,
    title: 'Microtek i-Lithium Wall-Mounted Smart Inverter',
    category: 'Next-Gen Lithium',
    app: 'Modern Residence & Smart Office, Bengaluru',
    status: 'Zero Floor Space',
    img: 'assets/images/microtek-i-lithium-wall-mount.jpeg',
    desc: 'Compact, wall-mounted lithium inverter installation offering zero floor footprint, silent operation, and built-in lithium battery cells. Features Wi-Fi IoT connectivity for live battery state-of-charge tracking on mobile devices.',
    specs: [
      { label: 'Battery Type', val: 'Integrated Lithium (LiFePO4)' },
      { label: 'Form Factor', val: 'Wall-Mount / Slim Design' },
      { label: 'IoT Features', val: 'Wi-Fi Smart App Monitoring' },
      { label: 'Maintenance', val: '100% Maintenance-Free' }
    ]
  },
  {
    id: 6,
    title: 'Rooftop Solar Structure & Panel Assembly in Progress',
    category: 'Solar Energy',
    app: 'On-Site Field Project, Bengaluru',
    status: 'On-Site Engineering',
    img: 'assets/images/solar-panel-structure-assembly.jpeg',
    desc: 'Behind-the-scenes engineering photo of Unity Power Solutions technicians mounting and aligning heavy-gauge solar PV arrays on an engineered rooftop frame, ensuring strict wind-load compliance and waterproof anchoring.',
    specs: [
      { label: 'Engineering Role', val: 'Civil & Electrical Erection' },
      { label: 'Cabling Standard', val: 'UV-Protected Solar DC Wires' },
      { label: 'Earthing & Lightning', val: 'Dedicated Chemical Earthing' },
      { label: 'Quality Audit', val: 'Pre-Commissioning String Testing' }
    ]
  },
  {
    id: 7,
    title: 'Flydika Industrial High-Power Online UPS',
    category: 'Enterprise IT',
    app: 'Manufacturing Assembly Floor, Peenya Industrial Area',
    status: 'Production Line',
    img: 'assets/images/industrial-online-ups-rack.jpeg',
    desc: 'Floor-standing industrial online UPS cabinet on heavy caster wheels with modular battery rack. Provides seamless isolation from harmonic distortion, industrial spikes, and voltage drops to keep assembly lines running uninterrupted.',
    specs: [
      { label: 'Unit Type', val: 'Heavy Online Industrial UPS' },
      { label: 'Battery Topology', val: 'Multi-Tier Isolated SMF Bank' },
      { label: 'Switchgear', val: 'Schneider Electric Protections' },
      { label: 'Mobility', val: 'Reinforced Caster Wheels' }
    ]
  },
  {
    id: 8,
    title: 'Exide Home Star Inverter & Dual 150Ah Tubular Batteries',
    category: 'Inverter & Battery',
    app: 'Premium Home & Medical Clinic, Bengaluru',
    status: 'Long Backup',
    img: 'assets/images/exide-home-star-dual-battery.jpeg',
    desc: 'Extended-duration power backup installation with Exide Home Star pure sine wave inverter and two Exide EL 150L tubular batteries on a rugged spill tray, providing seamless back-up power for residential lighting, fans, and diagnostic clinics.',
    specs: [
      { label: 'Inverter Model', val: 'Exide Home Star 24V' },
      { label: 'Battery Chemistry', val: '2x Exide EL 150L Tubular' },
      { label: 'Warranty', val: '36 Months Manufacturer Warranty' },
      { label: 'Waveform', val: 'Pure Sine Wave' }
    ]
  },
  {
    id: 9,
    title: 'Microtek Jumbo New 4000+ with Modular Trolley Enclosures',
    category: 'Inverter & Battery',
    app: 'Corporate Office / Retail Facility, Bengaluru',
    status: 'Clean Wiring',
    img: 'assets/images/microtek-jumbo-4000-trolley.jpeg',
    desc: 'Modern commercial office backup setup using the Microtek Jumbo New 4000+ inverter placed on dual modular shockproof battery trolleys. Keeps electrical cabling enclosed and safe from accidental contact while delivering aesthetic office integration.',
    specs: [
      { label: 'Capacity', val: '4 kVA Pure Sine Wave' },
      { label: 'Enclosure', val: 'Dual Heavy Duty Shockproof Trolleys' },
      { label: 'Safety Rating', val: 'Child & Office Safe Wire Enclosure' },
      { label: 'Ventilation', val: 'Active Fan Exhaust Cooling' }
    ]
  },
  {
    id: 10,
    title: 'Precision Digital Industrial Servo Stabilizer',
    category: 'Servo Stabilizer',
    app: 'Commercial Labs & CNC Facilities, Bengaluru',
    status: 'Pre-Dispatch Test',
    img: 'assets/images/digital-servo-stabilizer-cabinet.jpeg',
    desc: 'Microcontroller-driven industrial Servo Stabilizer unit calibrated and tested at the Unity Power Solutions workshop before client site deployment. Delivers precise +/- 1% output regulation to protect precision digital and medical instruments.',
    specs: [
      { label: 'Regulation Accuracy', val: '+/- 1% Output Precision' },
      { label: 'Display Panel', val: 'Digital Multifunction LCD/LED' },
      { label: 'Operating Voltage', val: 'Wide Input Window (170V - 270V)' },
      { label: 'Duty Cycle', val: 'Continuous 100% Heavy Duty' }
    ]
  },
  {
    id: 11,
    title: 'Exide Invagold 3-Tier Commercial Battery Rack Setup',
    category: 'Inverter & Battery',
    app: 'High-Density Workplace, Bengaluru',
    status: 'Space Optimized',
    img: 'assets/images/exide-invagold-tubular-rack.jpeg',
    desc: 'Engineered multi-tier steel rack housing 3 Exide Invagold C10 tubular batteries with a top inverter shelf. Optimizes vertical space inside tight commercial utility closets while maintaining optimal airflow around battery cells.',
    specs: [
      { label: 'Battery Model', val: '3x Exide Invagold C10 Tubular' },
      { label: 'Rack Design', val: 'Heavy-Gauge Powder-Coated Steel' },
      { label: 'Warranty Coverage', val: '48 Months Warranty' },
      { label: 'Cooling Design', val: 'Perforated Mesh Airflow Trays' }
    ]
  },
  {
    id: 12,
    title: 'Smart Wall-Mount Lithium Power Specifications (1500 & 3000 Series)',
    category: 'Next-Gen Lithium',
    app: 'Next-Gen Power Architecture, South India',
    status: 'Next-Gen Tech',
    img: 'assets/images/microtek-i-lithium-features.jpeg',
    desc: 'Official technical specifications showcase for the Microtek i-Lithium smart series available through Unity Power Solutions. Outlines key advantages: up to 3,500 battery charge cycles, 5-year warranty, integrated BMS protection, and Wi-Fi IoT status tracking.',
    specs: [
      { label: 'Cycle Life', val: 'Up to 3,500 Cycles (> 10 Years)' },
      { label: 'Warranty', val: '5 Years Manufacturer Warranty' },
      { label: 'Smart Tech', val: 'Wi-Fi IoT Live Monitoring' },
      { label: 'Charging Speed', val: 'Up to 3x Faster Recharge' }
    ]
  }
];

// Project Filter Buttons
const filterBtns = document.querySelectorAll('.project-filters .filter-btn');
const projectCards = document.querySelectorAll('.projects-grid .project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('is-hidden');
      } else {
        card.classList.add('is-hidden');
      }
    });
  });
});

// Modal Elements
const projectModal = document.getElementById('projectModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalPrevBtn = document.getElementById('modalPrevBtn');
const modalNextBtn = document.getElementById('modalNextBtn');
const modalImg = document.getElementById('modalImg');
const modalCounter = document.getElementById('modalCounter');
const modalCategory = document.getElementById('modalCategory');
const modalStatus = document.getElementById('modalStatus');
const modalTitle = document.getElementById('modalTitle');
const modalApp = document.getElementById('modalApp');
const modalDesc = document.getElementById('modalDesc');
const modalSpecsGrid = document.getElementById('modalSpecsGrid');
const modalInquireBtn = document.getElementById('modalInquireBtn');

let currentProjectIndex = 0;

function renderModalProject(index) {
  if (index < 0) index = projectsData.length - 1;
  if (index >= projectsData.length) index = 0;
  currentProjectIndex = index;

  const project = projectsData[index];
  modalImg.style.opacity = '0';

  setTimeout(() => {
    modalImg.src = project.img;
    modalImg.alt = project.title;
    modalImg.style.opacity = '1';
  }, 120);

  modalCounter.textContent = `${index + 1} / ${projectsData.length}`;
  modalCategory.textContent = project.category;
  modalStatus.textContent = project.status;
  modalTitle.textContent = project.title;
  modalApp.innerHTML = `<i class="fas fa-location-dot"></i> ${project.app}`;
  modalDesc.textContent = project.desc;

  modalSpecsGrid.innerHTML = project.specs.map(spec => `
    <div class="spec-item">
      <span class="spec-label">${spec.label}</span>
      <span class="spec-val">${spec.val}</span>
    </div>
  `).join('');
}

function openProjectModal(projectId) {
  const index = projectsData.findIndex(p => p.id === parseInt(projectId));
  if (index !== -1) {
    renderModalProject(index);
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeProjectModal() {
  projectModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Bind clicks on project cards
projectCards.forEach(card => {
  const projectId = card.getAttribute('data-id');
  
  // Inspect button inside overlay
  const inspectBtn = card.querySelector('.btn-inspect');
  if (inspectBtn) {
    inspectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProjectModal(projectId);
    });
  }

  // Text link inside footer
  const linkBtn = card.querySelector('.link-inspect');
  if (linkBtn) {
    linkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProjectModal(projectId);
    });
  }

  // Click on the image wrap
  const media = card.querySelector('.project-media');
  if (media) {
    media.style.cursor = 'pointer';
    media.addEventListener('click', () => {
      openProjectModal(projectId);
    });
  }
});

// Modal controls
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

if (modalPrevBtn) {
  modalPrevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    renderModalProject(currentProjectIndex - 1);
  });
}

if (modalNextBtn) {
  modalNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    renderModalProject(currentProjectIndex + 1);
  });
}

// Keyboard controls (Escape, Left, Right)
window.addEventListener('keydown', (e) => {
  if (!projectModal || !projectModal.classList.contains('active')) return;
  if (e.key === 'Escape') {
    closeProjectModal();
  } else if (e.key === 'ArrowLeft') {
    renderModalProject(currentProjectIndex - 1);
  } else if (e.key === 'ArrowRight') {
    renderModalProject(currentProjectIndex + 1);
  }
});

// Inquire CTA pre-fills the contact form
if (modalInquireBtn) {
  modalInquireBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentProject = projectsData[currentProjectIndex];
    closeProjectModal();

    const contactSection = document.getElementById('contact');
    const subjectField = document.getElementById('fsubject');
    const messageField = document.getElementById('fmessage');

    if (subjectField && currentProject) {
      subjectField.value = `Inquiry regarding: ${currentProject.title}`;
    }

    if (contactSection) {
      window.scrollTo({
        top: contactSection.getBoundingClientRect().top + window.scrollY - 76,
        behavior: 'smooth'
      });
      setTimeout(() => {
        if (messageField) messageField.focus();
      }, 700);
    }
  });
}
