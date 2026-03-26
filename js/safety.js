function renderSafety() {
  renderSafetyInfographic();
  renderSafetyTimeline();
  renderResidualRisks();
}

function renderSafetyInfographic() {
  const el = document.getElementById('si-layers-list');
  if (!el || el.children.length > 0) return;
  window.safetyData.forEach((d, idx) => {
    const div = document.createElement('div');
    div.className = 'si-layer';
    div.style.cssText = `background:${d.color}12;`;
    div.innerHTML = `<div class="si-layer-bar" style="background:${d.color};"></div><div class="si-layer-num" style="background:${d.color}30;color:${d.color};">${idx+1}</div><div class="si-layer-content"><div class="si-layer-title">${d.title}</div><div class="si-layer-tag">${d.desc.substring(0,60)}${d.desc.length>60?'…':''}</div></div><div class="si-layer-icon"><i class="${d.icon}" style="color:${d.color};"></i></div>`;
    div.addEventListener('click', () => document.getElementById('safety-timeline').scrollIntoView({behavior:'smooth'}));
    el.appendChild(div);
  });
}

function renderSafetyTimeline() {
  const c = document.getElementById('safety-timeline');
  if (!c || c.children.length > 0) return;
  c.innerHTML = window.safetyData.map((d, idx) => `<div class="tl-item"><div class="tl-dot"><i class="${d.icon}" style="color:${d.color||'var(--teal)'};"></i></div><div class="tl-box" onclick="this.classList.toggle('open')"><div class="tl-step">${d.step}</div><div class="tl-title">${d.title} <i class="fas fa-chevron-down chev"></i></div><div class="tl-desc">${d.desc}</div><div class="tl-detail"><div class="risk-box risk-in"><div class="risk-title"><i class="fas fa-exclamation-circle"></i> Incoming Risk</div>${d.inRisk}</div><div class="risk-box risk-out"><div class="risk-title"><i class="fas fa-shield-alt"></i> Risk Eliminated</div>${d.outRisk}</div></div></div></div>`).join('');
}

function renderResidualRisks() {
  const rc = document.getElementById('residual-risks');
  if (!rc) return;
  rc.innerHTML = window.residualRisks.map(r => `<div class="risk-tag" onclick="showRiskModal('${r.name}')">${r.name}</div>`).join('');
}

window.showRiskModal = function(name) {
  const r = window.residualRisks.find(x => x.name === name);
  if (!r) return;
  document.getElementById('modal-title').textContent = 'Risk: ' + r.name;
  document.getElementById('modal-body').innerHTML = `<div style="font-size:.9rem;color:#ccd6f0;line-height:1.7;">${r.explain}</div>`;
  document.getElementById('modal-bg').classList.add('open');
};
