// Translations are now loaded from assets/translations.js

let currentLang = 'en'; // Default to English

// Auto-detect language
const userLang = navigator.language || navigator.userLanguage;
if (userLang.toLowerCase().startsWith('uk') || userLang.toLowerCase().startsWith('ua')) {
  currentLang = 'ua';
}

function applyTranslations() {
  if (typeof translations === 'undefined') return; // Wait for translations to load
  const t = translations[currentLang];

  // Helper to safely set text content
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const setSelectorText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };

  setText('title', t.title);
  setSelectorText('[data-key="projects"]', t.menu.projects);
  setSelectorText('[data-key="contacts"]', t.menu.contacts);
  setSelectorText('[data-key="support"]', t.menu.support);
  setText('working-on', t.working_on);
  setText('label-name', t.labels.name);
  setText('label-status', t.labels.status);
  setText('label-progress', t.labels.progress);
  setText('label-details', t.labels.details);
  setText('project-name', t.project.name);
  setText('project-status', t.project.status);
  setText('project-progress', t.project.progress);
  setText('project-details', t.project.details);
  setText('support-title', t.support_title);

  const supportText = document.getElementById('support-text');
  if (supportText && supportText.firstChild) {
    supportText.firstChild.textContent = t.support_text + " ";
  }

  setText('contacts-title', t.contacts_title);
  setText('projects-title', t.projects_title);
  setText('th-name', t.th.name);
  setText('th-status', t.th.status);
  setText('th-progress', t.th.progress);
  setText('th-link', t.th.link);
  setSelectorText('footer', t.footer);

  // Wolf Page specific
  setText('wolf-title', t.wolf_page?.title);
  setText('wolf-desc', t.wolf_page?.description);
  setText('wolf-gallery', t.wolf_page?.gallery);
  setSelectorText('.back-link', t.wolf_page?.back);

  // Update active state of language buttons
  document.getElementById("lang-en")?.classList.toggle("active", currentLang === "en");
  document.getElementById("lang-ua")?.classList.toggle("active", currentLang === "ua");
}

function switchLanguage() {
  const container = document.querySelector("body"); // або .main-wrapper, якщо є

  // 1️⃣ Скидаємо попередні анімаційні класи
  container.classList.remove("fade-in", "fade-out");
  void container.offsetWidth;

  // 2️⃣ Запускаємо згасання
  container.classList.add("fade-out");

  // 3️⃣ Через 400 мс міняємо мову
  setTimeout(() => {
    currentLang = currentLang === "en" ? "ua" : "en";
    document.getElementById("lang-en").classList.toggle("active", currentLang === "en");
    document.getElementById("lang-ua").classList.toggle("active", currentLang === "ua");

    applyTranslations();

    // 4️⃣ Після заміни вмикаємо появу
    container.classList.remove("fade-out");
    void container.offsetWidth;
    container.classList.add("fade-in");
  }, 400);
}


function scrollToSection(id) {
  const section = document.getElementById(id);
  const header = document.querySelector("header");
  const headerHeight = header.offsetHeight; // точна висота
  const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerHeight - 20; // невеликий запас

  window.scrollTo({
    top: sectionTop,
    behavior: "smooth"
  });
}

function goToProjects() { scrollToSection("projects-section"); }
function scrollToContacts() { scrollToSection("contacts-section"); }
function scrollToSupport() { scrollToSection("support-section"); }

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', applyTranslations);

// Spark Effect
const canvas = document.getElementById('sparkCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let sparks = [];
  let drawing = false;
  let timer = null;
  let lastSparkTime = 0;
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // створення частинок
  function createSparks(x, y, speed = 1) {
    const count = Math.floor(3 + speed * 2);
    for (let i = 0; i < count; i++) {
      sparks.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3 * speed,
        vy: -Math.random() * 2 * speed,
        size: Math.random() * 2 + 1,
        life: 60 + Math.random() * 30,
        initialLife: 80,
        alpha: 1,
        color: `hsl(${45 + Math.random() * 15}, 100%, 50%)`
      });
    }
  }

  // малювання частинок
  function drawSparks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.03 + Math.random() * 0.02;
      s.vx *= 0.98;
      s.life--;
      s.alpha = s.life / 80;
      if (s.life <= 0) sparks.splice(i, 1);
      else {
        ctx.beginPath();
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.shadowBlur = 15 * (s.alpha + 0.3);
        ctx.shadowColor = s.color;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 2, s.y - s.vy * 2); // витягнута форма
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawSparks);
  }
  drawSparks();

  // обробники
  function startDrawing(e) {
    drawing = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    createSparks(x, y);
    clearTimeout(timer);
  }

  function draw(e) {
    if (!drawing) return;
    const now = Date.now();
    if (now - lastSparkTime < 30) return; // максимум ~33 кадри/сек
    lastSparkTime = now;

    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    createSparks(x, y);
  }

  function stopDrawing() {
    drawing = false;
    clearTimeout(timer);
    timer = setTimeout(() => {
      sparks = [];
    }, 1000); // ефект зникає через секунду
  }

  // слухаємо події на документі, не на canvas
  document.addEventListener('mousedown', startDrawing);
  document.addEventListener('mousemove', draw);
  document.addEventListener('mouseup', stopDrawing);

  document.addEventListener('touchstart', startDrawing);
  document.addEventListener('touchmove', draw);
  document.addEventListener('touchend', stopDrawing);

  // налаштування canvas поверх всього
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = 9999;
}

// Startup Animation
document.addEventListener("DOMContentLoaded", async () => {
  document.body.classList.add("startup");

  const title = document.getElementById("title");
  const nav = document.querySelector("header nav");
  const mainPanel = document.querySelector(".main-panel");
  const supportPanel = document.querySelector(".support-panel");

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Крок 1: burn2destroy flicker
  await wait(400);
  if (title) title.classList.add("flicker");
  document.body.classList.remove("startup");

  // Крок 2: меню flicker
  await wait(2600); // 3000 - 400
  if (nav) nav.classList.add("flicker");

  // Крок 3: рамка головної панелі
  await wait(2000); // 5000 - 3000
  if (mainPanel) mainPanel.classList.add("start");

  // Крок 4: текст головної панелі
  await wait(800); // 5800 - 5000
  if (mainPanel) mainPanel.classList.add("show-text");

  // Крок 5: рамка support
  await wait(900); // 6700 - 5800
  if (supportPanel) supportPanel.classList.add("start");

  // Крок 6: текст support
  await wait(800); // 7500 - 6700
  if (supportPanel) supportPanel.classList.add("show-text");
  document.body.classList.remove("startup");
});
