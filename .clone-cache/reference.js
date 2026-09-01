const FRAME_COUNT = 300;
const FOLDER_PATH = './ezgif-650b095c819b5fa9-jpg';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loader-bar');

// Array to store image objects
const images = [];
let loadedCount = 0;

// Scroll & Lerp physics state
let targetScrollProgress = 0;
let currentScrollProgress = 0;
let lastRenderedFrame = -1;

// Format frame filename: ezgif-frame-001.jpg ... ezgif-frame-300.jpg
function getFrameUrl(index) {
  const paddedIndex = String(index).padStart(3, '0');
  return `${FOLDER_PATH}/ezgif-frame-${paddedIndex}.jpg`;
}

// Adjust canvas resolution for High DPI displays & handle cover sizing
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  // Force redraw on resize
  lastRenderedFrame = -1;
  renderFrame(Math.round(currentScrollProgress * (FRAME_COUNT - 1)));
}

// Draw frame centered with CSS object-fit: cover logic
function renderFrame(index) {
  const frameIndex = Math.min(FRAME_COUNT - 1, Math.max(0, index));
  const img = images[frameIndex];

  if (!img || !img.complete || img.naturalWidth === 0) return;
  if (frameIndex === lastRenderedFrame) return;

  lastRenderedFrame = frameIndex;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  // Calculate cover scaling factor
  const hRatio = canvasWidth / imgWidth;
  const vRatio = canvasHeight / imgHeight;
  const ratio = Math.max(hRatio, vRatio);

  const renderWidth = imgWidth * ratio;
  const renderHeight = imgHeight * ratio;
  const offsetX = (canvasWidth - renderWidth) / 2;
  const offsetY = (canvasHeight - renderHeight) / 2;

  ctx.drawImage(
    img,
    0, 0, imgWidth, imgHeight,
    offsetX, offsetY, renderWidth, renderHeight
  );
}

// Update UI Sections continuous position & opacity based on lerped scroll progress
function updateUISections(p) {
  const heroUI = document.getElementById('hero-ui');
  const villaUI = document.getElementById('villa-ui');
  const agentUI = document.getElementById('agent-ui');
  const footerUI = document.getElementById('footer-ui');
  const bgOverlay = document.getElementById('bg-overlay');

  // -------------------------------------------------------------
  // Section 1: Hero UI (0.00 -> 0.18 scroll)
  // -------------------------------------------------------------
  if (heroUI) {
    if (p <= 0.04) {
      heroUI.style.opacity = '1';
      heroUI.style.transform = 'translateY(0px)';
      heroUI.style.pointerEvents = 'auto';
      if (bgOverlay) bgOverlay.style.opacity = '1';
    } else if (p <= 0.18) {
      const progress = (p - 0.04) / 0.14;
      const opacity = 1 - progress;
      const translateY = -progress * 130;
      heroUI.style.opacity = opacity.toFixed(3);
      heroUI.style.transform = `translateY(${translateY.toFixed(1)}px)`;
      heroUI.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
      if (bgOverlay) bgOverlay.style.opacity = opacity.toFixed(3);
    } else {
      heroUI.style.opacity = '0';
      heroUI.style.transform = 'translateY(-130px)';
      heroUI.style.pointerEvents = 'none';
      if (bgOverlay) bgOverlay.style.opacity = '0';
    }
  }

  // -------------------------------------------------------------
  // Section 2: Villa Showcase UI (0.14 -> 0.42 scroll)
  // -------------------------------------------------------------
  if (villaUI) {
    const enterStart = 0.14;
    const enterEnd = 0.22;
    const exitStart = 0.34;
    const exitEnd = 0.42;

    if (p < enterStart) {
      villaUI.style.opacity = '0';
      villaUI.style.transform = 'translateY(120px)';
      villaUI.style.pointerEvents = 'none';
    } else if (p <= enterEnd) {
      const progress = (p - enterStart) / (enterEnd - enterStart);
      const opacity = progress;
      const translateY = (1 - progress) * 120;
      villaUI.style.opacity = opacity.toFixed(3);
      villaUI.style.transform = `translateY(${translateY.toFixed(1)}px)`;
      villaUI.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    } else if (p <= exitStart) {
      const activeProgress = (p - enterEnd) / (exitStart - enterEnd);
      const translateY = -activeProgress * 35;
      villaUI.style.opacity = '1';
      villaUI.style.transform = `translateY(${translateY.toFixed(1)}px)`;
      villaUI.style.pointerEvents = 'auto';
    } else if (p <= exitEnd) {
      const progress = (p - exitStart) / (exitEnd - exitStart);
      const opacity = 1 - progress;
      const translateY = -35 - progress * 100;
      villaUI.style.opacity = opacity.toFixed(3);
      villaUI.style.transform = `translateY(${translateY.toFixed(1)}px)`;
      villaUI.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
    } else {
      villaUI.style.opacity = '0';
      villaUI.style.transform = 'translateY(-135px)';
      villaUI.style.pointerEvents = 'none';
    }
  }

  // -------------------------------------------------------------
  // Section 3: Meet Your Agent Martin UI (0.38 -> 0.93 scroll)
  // -------------------------------------------------------------
  if (agentUI) {
    const enterStart = 0.38;
    const enterEnd = 0.48;
    const exitStart = 0.85;
    const exitEnd = 0.93;

    if (p < enterStart) {
      agentUI.style.opacity = '0';
      agentUI.style.transform = 'translateY(140px)';
      agentUI.style.pointerEvents = 'none';
    } else if (p <= enterEnd) {
      const progress = (p - enterStart) / (enterEnd - enterStart);
      const opacity = progress;
      const translateY = (1 - progress) * 140;
      agentUI.style.opacity = opacity.toFixed(3);
      agentUI.style.transform = `translateY(${translateY.toFixed(1)}px)`;
      agentUI.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    } else if (p <= exitStart) {
      const activeProgress = (p - enterEnd) / (exitStart - enterEnd);
      const translateY = -activeProgress * 45;
      agentUI.style.opacity = '1';
      agentUI.style.transform = `translateY(${translateY.toFixed(1)}px)`;
      agentUI.style.pointerEvents = 'auto';
    } else if (p <= exitEnd) {
      const progress = (p - exitStart) / (exitEnd - exitStart);
      const opacity = 1 - progress;
      const translateY = -45 - progress * 100;
      agentUI.style.opacity = opacity.toFixed(3);
      agentUI.style.transform = `translateY(${translateY.toFixed(1)}px)`;
      agentUI.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
    } else {
      agentUI.style.opacity = '0';
      agentUI.style.transform = 'translateY(-145px)';
      agentUI.style.pointerEvents = 'none';
    }
  }

  // -------------------------------------------------------------
  // Section 4: Site Footer UI (0.90 -> 1.00 scroll)
  // -------------------------------------------------------------
  if (footerUI) {
    const enterStart = 0.90;
    const enterEnd = 0.97;

    if (p < enterStart) {
      footerUI.style.opacity = '0';
      footerUI.style.transform = 'translateY(120px)';
      footerUI.style.pointerEvents = 'none';
    } else if (p <= enterEnd) {
      const progress = (p - enterStart) / (enterEnd - enterStart);
      const opacity = progress;
      const translateY = (1 - progress) * 120;
      footerUI.style.opacity = opacity.toFixed(3);
      footerUI.style.transform = `translateY(${translateY.toFixed(1)}px)`;
      footerUI.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    } else {
      footerUI.style.opacity = '1';
      footerUI.style.transform = 'translateY(0px)';
      footerUI.style.pointerEvents = 'auto';
    }
  }
}

// Linear Interpolation (Lerp) animation loop running at 60fps
function tick() {
  // Smoothly lerp currentScrollProgress towards targetScrollProgress
  const diff = targetScrollProgress - currentScrollProgress;

  if (Math.abs(diff) > 0.00005) {
    currentScrollProgress += diff * 0.08; // Smooth 60fps lerp factor (0.08 = silky smooth inertia)
  } else {
    currentScrollProgress = targetScrollProgress;
  }

  // Render video frame corresponding to smoothed scroll progress
  const frameIndex = Math.round(currentScrollProgress * (FRAME_COUNT - 1));
  renderFrame(frameIndex);

  // Update UI sections position & opacity smoothly
  updateUISections(currentScrollProgress);

  requestAnimationFrame(tick);
}

// Update target scroll progress from scroll position
function updateScrollTarget() {
  const scrollTop = window.scrollY || window.pageYOffset || 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  
  if (maxScroll <= 0) {
    targetScrollProgress = 0;
    return;
  }

  targetScrollProgress = Math.min(1, Math.max(0, scrollTop / maxScroll));
}

// Preload all frame images asynchronously
function preloadImages() {
  for (let i = 1; i <= FRAME_COUNT; i++) {
    const img = new Image();
    img.src = getFrameUrl(i);
    
    img.onload = () => {
      loadedCount++;
      const progress = (loadedCount / FRAME_COUNT) * 100;
      if (loaderBar) loaderBar.style.width = `${progress}%`;

      // Render initial frame as soon as frame 1 finishes loading
      if (i === 1) {
        renderFrame(0);
      }

      if (loadedCount === FRAME_COUNT) {
        setTimeout(() => {
          if (loader) loader.classList.add('hidden');
        }, 300);
      }
    };

    img.onerror = () => {
      console.warn(`Failed to load frame ${i}: ${getFrameUrl(i)}`);
      loadedCount++;
    };

    images.push(img);
  }
}

// Navigation Drawer Toggle & Smooth Scroll Logic
function setupNavDrawer() {
  const menuBtn = document.getElementById('menu-btn');
  const navDrawer = document.getElementById('nav-drawer');
  const navCloseBtn = document.getElementById('nav-close-btn');
  const navBackdrop = document.getElementById('nav-backdrop');
  const scrollLinks = document.querySelectorAll('.nav-scroll-link');

  function openNav() {
    if (navDrawer) navDrawer.classList.add('active');
  }

  function closeNav() {
    if (navDrawer) navDrawer.classList.remove('active');
  }

  if (menuBtn) menuBtn.addEventListener('click', openNav);
  if (navCloseBtn) navCloseBtn.addEventListener('click', closeNav);
  if (navBackdrop) navBackdrop.addEventListener('click', closeNav);

  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetRatio = parseFloat(link.getAttribute('data-scroll'));
      if (!isNaN(targetRatio)) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({
          top: targetRatio * maxScroll,
          behavior: 'smooth'
        });
      }
      closeNav();
    });
  });
}

// Event Listeners
window.addEventListener('scroll', updateScrollTarget, { passive: true });
window.addEventListener('resize', resizeCanvas);

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
  preloadImages();
  updateScrollTarget();
  setupNavDrawer();
  currentScrollProgress = targetScrollProgress;
  requestAnimationFrame(tick);
});
