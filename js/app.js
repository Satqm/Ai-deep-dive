/* =========================================
   APP.JS — Global site behaviour
   ========================================= */

// ----- Tab switching -----
window.switchTab = function(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  document.getElementById(`btn-${tab}`).classList.add('active');

  // Trigger render functions if they exist
  if (tab === 'concepts' && window.renderConcepts) window.renderConcepts();
  if (tab === 'layers' && window.renderLayers) window.renderLayers();
  if (tab === 'pyramid' && window.renderPyramid) window.renderPyramid();
  if (tab === 'mindmap' && window.initMindMap) window.initMindMap();
  if (tab === 'safety' && window.renderSafety) window.renderSafety();
  if (tab === 'agentic' && window.renderAgentic) window.renderAgentic();
  if (tab === 'resources' && window.renderResources) window.renderResources();

  window.scrollTo(0, 0);
};

// ----- Theme toggle -----
window.toggleTheme = function() {
  document.body.classList.toggle('light-mode');
  const icon = document.getElementById('theme-icon');
  if (document.body.classList.contains('light-mode')) {
    icon.className = 'fas fa-sun';
    localStorage.setItem('owsTheme', 'light');
  } else {
    icon.className = 'fas fa-moon';
    localStorage.setItem('owsTheme', 'dark');
  }
};

// ----- Modal handlers -----
window.showConceptModal = function(idx) {
  const c = window.conceptData[idx];
  if (!c) return;
  document.getElementById('modal-title').innerHTML = c.icon + ' ' + c.name;
  document.getElementById('modal-body').innerHTML = `<div class="m-sec"><div class="m-label">What It Is</div><div class="m-text" style="font-size:.95rem;line-height:1.7;">${c.details}</div></div>`;
  document.getElementById('modal-bg').classList.add('open');
};

window.showFrameworkModal = function(idx) {
  const f = window.frameworks[idx];
  if (!f) return;
  document.getElementById('modal-title').innerHTML = f.name + ' Framework';
  document.getElementById('modal-body').innerHTML = `
    <div class="m-sec"><div class="m-label">Full Form</div><p style="font-size:1rem;color:#fff;font-weight:600;">${f.full}</p><div class="m-letters">${f.letters.map(([l,w])=>`<div class="m-chip"><strong>${l}</strong><span>${w}</span></div>`).join('')}</div></div>
    <div class="m-sec"><div class="m-label">What It Actually Does</div><div class="m-text">${f.meaning}</div></div>
    <div class="m-sec"><div class="m-label">Real-Life Use Cases</div><div class="m-text">${f.useCases}</div></div>
    <div class="m-sec"><div class="m-label">Ready-to-Use Prompt</div><div class="m-prompt">${f.prompt}</div></div>`;
  document.getElementById('modal-bg').classList.add('open');
};

// ----- Initialisation -----
document.addEventListener('DOMContentLoaded', () => {
  // Theme button
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Modal close
  const modalBg = document.getElementById('modal-bg');
  const modalClose = document.getElementById('modal-close');
  if (modalClose) modalClose.addEventListener('click', () => modalBg.classList.remove('open'));
  modalBg.addEventListener('click', (e) => {
    if (e.target === modalBg) modalBg.classList.remove('open');
  });

  // Set current year in footer
  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.innerHTML = `© ${new Date().getFullYear()} Observe with Satyam. Built for the AI Literacy Journey.`;

  // Load default tab (concepts)
  if (document.getElementById('tab-concepts')) switchTab('concepts');

  // Back to top button
  const topBtn = document.getElementById('to-top');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) topBtn.classList.add('show');
      else topBtn.classList.remove('show');
    });
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});

// ========== SCROLL PROGRESS BAR ==========
(function() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:0%',
    'height:3px',
    'background:var(--accent,#00d4ff)',
    'box-shadow:0 0 12px var(--accent,#00d4ff)',
    'z-index:9999',
    'transition:width 0.1s linear',
    'pointer-events:none'
  ].join(';');
  document.body.appendChild(bar);

  window.addEventListener('scroll', function() {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

// ========== SCROLL-SPY NAV (active section highlight) ==========
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', function() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('nav-active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('nav-active');
      }
    });
  }, { passive: true });
})();

// ========== FADE-IN ON SCROLL ==========
(function() {
  const targets = document.querySelectorAll(
    'section, .card, .concept-card, .layer-card, .repo-card, .pillar-card, .chapter-divider, .safety-layer'
  );

  const style = document.createElement('style');
  style.textContent = `.fade-ready { opacity:0; transform:translateY(18px); transition: opacity 0.55s ease, transform 0.55s ease; } .fade-visible { opacity:1 !important; transform:translateY(0) !important; }`;
  document.head.appendChild(style);

  targets.forEach(el => el.classList.add('fade-ready'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(el => observer.observe(el));
})();
