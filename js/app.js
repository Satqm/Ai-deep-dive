// Global tab switching
window.switchTab = function(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  document.getElementById(`btn-${tab}`).classList.add('active');
  if (tab === 'concepts' && window.renderConcepts) window.renderConcepts();
  if (tab === 'layers' && window.renderLayers) window.renderLayers();
  if (tab === 'pyramid' && window.renderPyramid) window.renderPyramid();
  if (tab === 'mindmap' && window.initMindMap) window.initMindMap();
  if (tab === 'safety' && window.renderSafety) window.renderSafety();
  if (tab === 'agentic' && window.renderAgentic) window.renderAgentic();
  if (tab === 'resources' && window.renderResources) window.renderResources();
  window.scrollTo(0, 0);
};

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

document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  // Modal close
  const modalBg = document.getElementById('modal-bg');
  const modalClose = document.getElementById('modal-close');
  if (modalClose) modalClose.addEventListener('click', () => modalBg.classList.remove('open'));
  modalBg.addEventListener('click', (e) => {
    if (e.target === modalBg) modalBg.classList.remove('open');
  });
});

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
