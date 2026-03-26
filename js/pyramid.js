function renderPyramid() {
  const stack = document.getElementById('pyramid-stack');
  if (!stack || stack.children.length > 0) return;
  window.pyramidLayers.forEach((l, idx) => {
    const layerDiv = document.createElement('div');
    layerDiv.className = 'py-layer';
    layerDiv.style.cssText = `border-color:${l.color}40;background:linear-gradient(135deg,${l.color}14,${l.color}08);width:${l.width};`;
    layerDiv.innerHTML = `<div class="py-layer-inner"><div class="py-num" style="color:${l.color};">${l.num}</div><div class="py-content"><div class="py-title" style="color:${l.color};">${l.title}</div><div class="py-tagline" style="color:${l.color};">${l.tagline}</div></div><div class="py-icon">${l.icon}</div></div>`;
    layerDiv.addEventListener('click', () => togglePyLayer(idx));
    const detail = document.createElement('div');
    detail.className = 'py-detail-panel';
    detail.id = `py-detail-${idx}`;
    detail.style.borderColor = l.color + '30';
    detail.innerHTML = `<div class="py-detail-inner"><div style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${l.color};margin-bottom:.8rem;">${l.title} — Full Breakdown</div><div class="py-flow"><div class="py-fbox" style="background:rgba(59,130,246,.12);border-color:rgba(59,130,246,.4);color:#93c5fd;"><div style="font-size:.6rem;font-weight:700;text-transform:uppercase;opacity:.7;margin-bottom:.2rem;">Input</div><div style="font-size:.78rem;">${l.flowIn}</div></div><span class="py-farr">→</span><div class="py-fbox" style="background:rgba(168,85,247,.12);border-color:rgba(168,85,247,.4);color:#c4b5fd;"><div style="font-size:.6rem;font-weight:700;text-transform:uppercase;opacity:.7;margin-bottom:.2rem;">Process</div><div style="font-size:.78rem;">${l.flowProc}</div></div><span class="py-farr">→</span><div class="py-fbox" style="background:rgba(52,211,153,.12);border-color:rgba(52,211,153,.4);color:#6ee7b7;"><div style="font-size:.6rem;font-weight:700;text-transform:uppercase;opacity:.7;margin-bottom:.2rem;">Output</div><div style="font-size:.78rem;">${l.flowOut}</div></div></div><div class="py-detail-grid"><div class="py-dcard" style="background:${l.color}10;border:1px solid ${l.color}25;"><div class="py-dcard-title" style="color:${l.color};">📖 What It Is</div>${l.what}</div><div class="py-dcard" style="background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.08);"><div class="py-dcard-title" style="color:var(--text-dim);">💡 Why It Matters</div>${l.why}</div><div class="py-dcard" style="background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.08);"><div class="py-dcard-title" style="color:var(--text-dim);">🔍 Real Examples</div>${l.examples.map(e=>`<span class="py-stat">${e}</span>`).join('')}<div style="margin-top:.6rem;">${l.stats.map(s=>`<div style="font-size:.75rem;color:var(--text-dim);margin-bottom:.2rem;">📊 ${s}</div>`).join('')}</div></div></div><div style="font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;margin-top:1rem;padding:.8rem 1rem;border-radius:10px;background:rgba(0,0,0,.3);border-left:4px solid ${l.color};color:${l.color};line-height:1.5;">${l.wow}</div></div>`;
    stack.appendChild(layerDiv);
    stack.appendChild(detail);
    if (idx < window.pyramidLayers.length - 1) {
      const arr = document.createElement('div');
      arr.className = 'py-arrow';
      arr.innerHTML = `<svg width="24" height="20" class="py-arrow-anim"><path d="M12 0 L12 12 M6 8 L12 16 L18 8" stroke="${l.color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      stack.appendChild(arr);
    }
  });
}
window.togglePyLayer = function(idx) {
  const panel = document.getElementById(`py-detail-${idx}`);
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  document.querySelectorAll('.py-detail-panel').forEach(p => p.classList.remove('open'));
  if (!isOpen) panel.classList.add('open');
};
