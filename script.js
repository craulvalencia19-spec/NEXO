// ================= LLUVIA DE NEÓN (canvas) =================
const canvas = document.getElementById('neonRain');
const ctx2d = canvas.getContext('2d');
let W, H, drops;
const NEON_COLORS = ['#ff6a1a', '#ff9a52', '#ffb347', '#ff8c42'];

function resizeCanvas(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
function initDrops(){
  const count = Math.floor(W / 22);
  drops = Array.from({ length: count }, () => makeDrop(true));
}
function makeDrop(randomY = false){
  return {
    x: Math.random() * W,
    y: randomY ? Math.random() * H : -Math.random() * H,
    len: 14 + Math.random() * 26,
    speed: 2 + Math.random() * 4,
    color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    alpha: 0.15 + Math.random() * 0.5
  };
}
function drawRain(){
  ctx2d.clearRect(0, 0, W, H);
  drops.forEach(d => {
    const gradient = ctx2d.createLinearGradient(d.x, d.y, d.x, d.y + d.len);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, d.color);
    ctx2d.strokeStyle = gradient;
    ctx2d.globalAlpha = d.alpha;
    ctx2d.lineWidth = 1.6;
    ctx2d.beginPath();
    ctx2d.moveTo(d.x, d.y);
    ctx2d.lineTo(d.x, d.y + d.len);
    ctx2d.stroke();

    d.y += d.speed;
    if (d.y > H) Object.assign(d, makeDrop(false));
  });
  ctx2d.globalAlpha = 1;
  requestAnimationFrame(drawRain);
}
resizeCanvas();
initDrops();
drawRain();
window.addEventListener('resize', () => { resizeCanvas(); initDrops(); });

// ================= SCRAMBLE TEXT (efecto tipo anime.js, sin dependencias) =================
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#░▒▓';

function scrambleEl(el){
  if (el.dataset.scrambling === '1') return;
  el.dataset.scrambling = '1';

  const original = el.dataset.original || el.textContent;
  el.dataset.original = original;
  const chars = original.split('');
  const total = chars.length;
  let frame = 0;
  const revealEvery = 2; // caracteres revelados por "tick"
  const frameDelay = 28; // ms

  function tick(){
    let output = '';
    const revealedCount = Math.floor(frame / revealEvery);
    for (let i = 0; i < total; i++){
      if (chars[i] === ' ' || chars[i] === '\n') { output += chars[i]; continue; }
      if (i < revealedCount) output += chars[i];
      else output += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    el.textContent = output;
    frame++;
    if (revealedCount < total) {
      setTimeout(tick, frameDelay);
    } else {
      el.textContent = original;
      el.dataset.scrambling = '0';
    }
  }
  tick();
}

// Ejecuta el scramble cuando el elemento entra en pantalla
const scrambleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      scrambleEl(entry.target);
      scrambleObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.scramble').forEach(el => {
  el.dataset.original = el.textContent.trim();
  scrambleObserver.observe(el);
  // Efecto extra: al pasar el mouse, vuelve a "scramblear"
  el.addEventListener('mouseenter', () => scrambleEl(el));
});

// ================= TRANSICIÓN "SUSPENSO" ENTRE SECCIONES =================
const overlay = document.getElementById('transitionOverlay');
const overlayText = document.getElementById('transitionText');
const sectionLabels = {
  '#servicios': 'Cargando servicios',
  '#proceso': 'Analizando el proceso',
  '#portafolio': 'Abriendo portafolio',
  '#testimonios': 'Cargando testimonios',
  '#contacto': 'Preparando contacto'
};

document.querySelectorAll('.nav-transition').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();
    overlayText.textContent = sectionLabels[targetId] || 'Cargando';
    overlay.classList.add('active');

    setTimeout(() => {
      targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
      setTimeout(() => overlay.classList.remove('active'), 150);
    }, 550);
  });
});

// ================= SPLASH: lluvia de neón propia =================
const splashCanvas = document.getElementById('splashRain');
const splashCtx = splashCanvas.getContext('2d');
let sW, sH, sDrops;
function resizeSplash(){
  sW = splashCanvas.width = window.innerWidth;
  sH = splashCanvas.height = window.innerHeight;
}
function makeSplashDrop(randomY = false){
  return {
    x: Math.random() * sW,
    y: randomY ? Math.random() * sH : -Math.random() * sH,
    len: 14 + Math.random() * 26,
    speed: 2 + Math.random() * 4,
    alpha: 0.15 + Math.random() * 0.5
  };
}
function initSplashDrops(){
  sDrops = Array.from({ length: Math.floor(sW / 22) }, () => makeSplashDrop(true));
}
function drawSplashRain(){
  splashCtx.clearRect(0, 0, sW, sH);
  sDrops.forEach(d => {
    const g = splashCtx.createLinearGradient(d.x, d.y, d.x, d.y + d.len);
    g.addColorStop(0, 'transparent');
    g.addColorStop(1, '#ff6a1a');
    splashCtx.strokeStyle = g;
    splashCtx.globalAlpha = d.alpha;
    splashCtx.lineWidth = 1.6;
    splashCtx.beginPath();
    splashCtx.moveTo(d.x, d.y);
    splashCtx.lineTo(d.x, d.y + d.len);
    splashCtx.stroke();
    d.y += d.speed;
    if (d.y > sH) Object.assign(d, makeSplashDrop(false));
  });
  splashCtx.globalAlpha = 1;
  if (!document.getElementById('splash').classList.contains('hidden')) {
    requestAnimationFrame(drawSplashRain);
  }
}
resizeSplash();
initSplashDrops();
drawSplashRain();
window.addEventListener('resize', () => { resizeSplash(); initSplashDrops(); });

// ================= SPLASH: scramble del logo NEXO =================
const SPLASH_CHARS = '!<>-_\\/[]{}—=+*^?#░▒▓X0#';
function scrambleLogo(el, finalText, onDone){
  const total = finalText.length;
  let frame = 0;
  const revealEvery = 4;
  function tick(){
    let out = '';
    const revealed = Math.floor(frame / revealEvery);
    for (let i = 0; i < total; i++){
      out += i < revealed ? finalText[i] : SPLASH_CHARS[Math.floor(Math.random() * SPLASH_CHARS.length)];
    }
    el.textContent = out;
    frame++;
    if (revealed < total) setTimeout(tick, 45);
    else { el.textContent = finalText; if (onDone) onDone(); }
  }
  tick();
}
scrambleLogo(document.getElementById('splashLogo'), 'NEXO');

// ================= SPLASH: botón de Ingreso =================
const splash = document.getElementById('splash');
const enterBtn = document.getElementById('enterBtn');
const siteContent = document.getElementById('siteContent');

enterBtn.addEventListener('click', () => {
  splash.classList.add('hidden');
  siteContent.classList.add('visible');
  document.body.style.overflow = '';
});
document.body.style.overflow = 'hidden'; // bloquea scroll mientras está el splash

// ================= NAV: sombra al hacer scroll + menú móvil =================
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ================= SCROLL REVEAL =================
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ================= CONTADOR DE STATS (hero) =================
function animateCounter(el, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(document.getElementById('statProjects'), 48);
      animateCounter(document.getElementById('statSpeed'), 90);
      animateCounter(document.getElementById('statUptime'), 99);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

statsObserver.observe(document.querySelector('.hero-stats'));

// ================= PROCESO CREATIVO: pasos interactivos =================
const stepBtns = document.querySelectorAll('.step-btn');
const stepPanels = document.querySelectorAll('.step-content');

stepBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const step = btn.dataset.step;

    stepBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    stepPanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panel === step);
    });
  });
});

// ================= CALCULADORA DE PRESUPUESTO =================
const chipGroups = document.querySelectorAll('.chip-group');
const calcTotal = document.getElementById('calcTotal');

const values = {
  tipo: 150,
  secciones: 0,
  animacion: 0
};

function updateTotal() {
  const total = values.tipo + values.secciones + values.animacion;
  calcTotal.textContent = total;
}

chipGroups.forEach(group => {
  const groupName = group.dataset.group;
  const chips = group.querySelectorAll('.chip');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      // "secciones" permite selección múltiple (suma), el resto es única
      if (groupName === 'secciones') {
        chip.classList.toggle('active');
        let sum = 0;
        chips.forEach(c => { if (c.classList.contains('active')) sum += Number(c.dataset.value); });
        values.secciones = sum;
      } else {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        values[groupName] = Number(chip.dataset.value);
      }
      updateTotal();
    });
  });
});

// ================= REGISTRO DE IDEAS (Cotizar) — con Firebase real =================
// sharedLeads siempre tiene la lista COMPLETA y actualizada en vivo,
// igual para cualquier persona en cualquier dispositivo del mundo.
let sharedLeads = [];

function startFirebaseListener(){
  if (typeof window.firebaseListenLeads !== 'function') {
    // Firebase todavía no cargó (conexión lenta); reintenta en un momento
    setTimeout(startFirebaseListener, 300);
    return;
  }
  window.firebaseListenLeads((leads) => {
    sharedLeads = leads;
    updateLeadCountDisplay();
    if (anfitrionPanel && anfitrionPanel.classList.contains('visible')) {
      renderAnfitrionList();
    }
  });
}
startFirebaseListener();

function updateLeadCountDisplay(){
  const el = document.getElementById('leadCount');
  const elGlobal = document.getElementById('anfitrionGlobalCount');
  if (el) el.textContent = sharedLeads.length;
  if (elGlobal) elGlobal.textContent = sharedLeads.length;
}

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('leadNombre').value.trim();
  const correo = document.getElementById('leadCorreo').value.trim();
  const numero = document.getElementById('leadNumero').value.trim();
  const idea = document.getElementById('leadIdea').value.trim();

  if (!nombre || !correo || !numero || !idea) {
    formStatus.textContent = 'Completa todos los campos, por favor.';
    return;
  }

  if (typeof window.firebaseAddLead !== 'function') {
    formStatus.textContent = 'Conectando… espera un segundo e intentalo de nuevo.';
    return;
  }

  try {
    await window.firebaseAddLead({ nombre, correo, numero, idea, visto: false, mostrando: false });
    formStatus.textContent = '✅ Guardado correctamente en la lista';
    contactForm.reset();
  } catch (err) {
    formStatus.textContent = 'No se pudo guardar. Revisa tu conexion e intenta de nuevo.';
  }

  setTimeout(() => { formStatus.textContent = ''; }, 4000);
});

// ================= PANEL DEL ANFITRION =================
const HOST_PASSWORD = 'MUNDO DIGITAL';
const anfitrionClave = document.getElementById('anfitrionClave');
const anfitrionEntrar = document.getElementById('anfitrionEntrar');
const anfitrionStatus = document.getElementById('anfitrionStatus');
const anfitrionLock = document.getElementById('anfitrionLock');
const anfitrionPanel = document.getElementById('anfitrionPanel');
const anfitrionList = document.getElementById('anfitrionList');
const anfitrionTotal = document.getElementById('anfitrionTotal');

function renderAnfitrionList(){
  const leads = sharedLeads;
  anfitrionTotal.textContent = leads.length;
  anfitrionList.innerHTML = '';

  if (leads.length === 0) {
    anfitrionList.innerHTML = '<p style="color:var(--text-dim); text-align:center;">No se realizaron registros hasta el momento.</p>';
    return;
  }

  leads.forEach((lead, index) => {
    const card = document.createElement('div');
    card.className = 'lead-card' + (lead.visto ? ' visto' : '');

    card.innerHTML = `
      <span class="lead-num">${index + 1}</span>
      <div class="lead-info">
        <h4>${lead.nombre}</h4>
        <p class="lead-email">${lead.correo}</p>
        <p class="lead-phone">📱 ${lead.numero}</p>
        <p class="lead-idea ${lead.visto && !lead.mostrando ? 'hidden-idea' : ''}">${lead.idea}</p>
      </div>
      <div class="lead-actions">
        <span class="lead-tag ${lead.visto ? '' : 'pendiente'}">${lead.visto ? 'Visto' : 'Pendiente'}</span>
        <button class="lead-toggle-btn" data-id="${lead.id}">
          ${lead.visto ? (lead.mostrando ? 'Ocultar idea' : 'Volver a ver') : 'Marcar visto'}
        </button>
        <button class="lead-contact-btn" data-contact-id="${lead.id}">Contactar</button>
        <div class="lead-confirm" id="confirm-${lead.id}" style="display:none;">
          <span>Contactar a "${lead.nombre}; ${lead.numero}"</span>
          <button class="lead-confirm-yes" data-yes-id="${lead.id}">Si</button>
          <button class="lead-confirm-no" data-no-id="${lead.id}">No</button>
        </div>
      </div>
    `;
    anfitrionList.appendChild(card);
  });

  anfitrionList.querySelectorAll('.lead-contact-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.contactId;
      const confirmBox = document.getElementById(`confirm-${id}`);
      confirmBox.style.display = confirmBox.style.display === 'none' ? 'flex' : 'none';
    });
  });

  anfitrionList.querySelectorAll('.lead-confirm-yes').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.yesId;
      const lead = sharedLeads.find(l => l.id === id);
      if (!lead) return;
      const digits = lead.numero.replace(/\D/g, '');
      const mensaje = encodeURIComponent(`Hola ${lead.nombre}, somos NEXO Web Studio. Vimos tu idea de proyecto y queremos conversar contigo.`);
      window.open(`https://wa.me/${digits}?text=${mensaje}`, '_blank');
      document.getElementById(`confirm-${id}`).style.display = 'none';
    });
  });

  anfitrionList.querySelectorAll('.lead-confirm-no').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(`confirm-${btn.dataset.noId}`).style.display = 'none';
    });
  });

  anfitrionList.querySelectorAll('.lead-toggle-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const lead = sharedLeads.find(l => l.id === id);
      if (!lead || typeof window.firebaseUpdateLead !== 'function') return;
      if (!lead.visto) {
        await window.firebaseUpdateLead(id, { visto: true, mostrando: false });
      } else {
        await window.firebaseUpdateLead(id, { mostrando: !lead.mostrando });
      }
      // La lista se refresca sola gracias al listener en tiempo real
    });
  });
}

anfitrionEntrar.addEventListener('click', () => {
  if (anfitrionClave.value === HOST_PASSWORD) {
    anfitrionLock.style.display = 'none';
    anfitrionPanel.classList.add('visible');
    renderAnfitrionList();
  } else {
    anfitrionStatus.textContent = 'Clave incorrecta. Intenta de nuevo.';
  }
});