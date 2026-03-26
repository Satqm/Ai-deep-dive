function renderLayers() {
  renderVennStack();
  renderCircularVenn();
  renderVennMobile();
  renderLayerCards();
}

function renderVennStack() {
  const stack = document.getElementById('venn-stack');
  if (!stack || stack.children.length > 0) return;
  const tooltip = document.getElementById('venn-tooltip');
  window.layersData.forEach((l, idx) => {
    const row = document.createElement('div');
    row.className = 'vr';
    row.style.cssText = `background:${l.bg};border-left-color:${l.color};`;
    row.innerHTML = `<div class="vr-inner"><div class="vr-num" style="background:${l.color}35;color:${l.color};">${idx+1}</div><div class="vr-text"><div class="vr-name" style="color:${l.color};">${l.title}</div><div class="vr-sub">${l.subtitle}</div></div><div class="vr-tag" style="color:${l.color};">${l.tagline}</div><div class="vr-icon">${['🌐','⚙️','🧬','🏔️','🔮','🎨','🧠','💡','🚀','💬'][idx]}</div></div>`;
    row.addEventListener('mouseenter', (e) => {
      tooltip.style.borderColor = l.color;
      tooltip.innerHTML = `<div class="venn-tooltip-title" style="color:${l.color};">${idx+1}. ${l.title}</div><div style="color:var(--text-dim);font-size:.8rem;">${l.desc.substring(0,130)}…</div>`;
      tooltip.classList.add('show');
    });
    row.addEventListener('mousemove', (e) => {
      tooltip.style.left = (e.clientX + 14) + 'px';
      tooltip.style.top = (e.clientY - 20) + 'px';
    });
    row.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
    row.addEventListener('click', () => {
      const card = document.querySelector(`[data-layer="${idx}"]`);
      if (card) { card.scrollIntoView({behavior:'smooth',block:'center'}); card.click(); }
    });
    stack.appendChild(row);
  });
}

function renderCircularVenn() {
  const svg = document.getElementById('venn-svg');
  if (!svg || svg.querySelectorAll('circle').length > 0) return;
  const cx = 250, cy = 250, maxR = 232, minR = 20, n = window.layersData.length;
  const tooltip = document.getElementById('venn-tooltip');
  window.layersData.slice().reverse().forEach((l, ri) => {
    const idx = n - 1 - ri;
    const r = minR + (maxR - minR) * ((n - idx - 1) / (n - 1));
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', l.color + '20');
    circle.setAttribute('stroke', l.color);
    circle.setAttribute('stroke-width', idx === 0 ? '2.5' : '1.8');
    circle.style.cursor = 'pointer';
    circle.addEventListener('mouseenter', () => {
      circle.setAttribute('fill', l.color + '42');
      circle.setAttribute('stroke-width', '3.5');
      tooltip.style.borderColor = l.color;
      tooltip.innerHTML = `<div class="venn-tooltip-title" style="color:${l.color};">${idx+1}. ${l.title}</div><div style="color:var(--text-dim);font-size:.78rem;">${l.desc.substring(0,100)}…</div>`;
      tooltip.classList.add('show');
    });
    circle.addEventListener('mousemove', (e) => {
      tooltip.style.left = (e.clientX + 14) + 'px';
      tooltip.style.top = (e.clientY - 20) + 'px';
    });
    circle.addEventListener('mouseleave', () => {
      circle.setAttribute('fill', l.color + '20');
      circle.setAttribute('stroke-width', idx === 0 ? '2.5' : '1.8');
      tooltip.classList.remove('show');
    });
    circle.addEventListener('click', () => {
      const card = document.querySelector(`[data-layer="${idx}"]`);
      if (card) { card.scrollIntoView({behavior:'smooth',block:'center'}); card.click(); }
    });
    svg.appendChild(circle);
    if (idx === 0 || idx === n-1 || idx === 4) {
      const angle = (idx === n-1) ? -Math.PI/2 : (idx === 0 ? -Math.PI*0.7 : Math.PI*0.25);
      const lx = cx + Math.cos(angle) * (r - 16);
      const ly = cy + Math.sin(angle) * (r - 16);
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', lx);
      txt.setAttribute('y', ly);
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('dominant-baseline', 'middle');
      txt.setAttribute('fill', l.color);
      txt.setAttribute('font-size', idx===0?'12':'10');
      txt.setAttribute('font-weight', '800');
      txt.setAttribute('font-family', 'Syne,sans-serif');
      txt.textContent = l.title;
      svg.appendChild(txt);
    }
  });
}

function renderVennMobile() {
  const cont = document.getElementById('venn-mobile-stack');
  if (!cont || cont.children.length > 0) return;
  window.layersData.forEach((l, idx) => {
    const card = document.createElement('div');
    card.className = 'vmc';
    card.style.background = l.bg;
    card.style.borderColor = l.color + '55';
    card.innerHTML = `<div class="vmc-num" style="color:${l.color};">${idx+1}</div><div class="vmc-name" style="color:${l.color};">${l.title}</div><div class="vmc-sub">${l.subtitle}</div>`;
    card.addEventListener('click', () => {
      const lcard = document.querySelector(`[data-layer="${idx}"]`);
      if (lcard) { lcard.scrollIntoView({behavior:'smooth',block:'center'}); lcard.click(); }
    });
    cont.appendChild(card);
  });
}

function renderLayerCards() {
  const container = document.getElementById('layer-cards');
  if (!container || container.children.length > 0) return;
  window.layersData.forEach((l, idx) => {
    const card = document.createElement('div');
    card.className = 'lc';
    card.setAttribute('data-layer', idx);
    card.style.borderColor = l.color + '30';
    card.innerHTML = `<div class="lc-header" style="background:${l.bg};"><div class="lc-num" style="color:${l.color};border:1.5px solid ${l.color}40;">${idx+1}</div><div class="lc-title-wrap"><div class="lc-title" style="color:${l.color};">${l.title}</div><div class="lc-subtitle">${l.subtitle} &nbsp;·&nbsp; <em style="color:${l.color}90;">${l.tagline}</em></div></div><i class="fas fa-chevron-down lc-toggle" style="color:${l.color}60;"></i></div><div class="lc-body"><div class="ipo-row"><div class="ipo-box ipo-input"><div class="ipo-label">📥 Input</div><div class="ipo-content">${l.input}</div></div><div class="ipo-arrow">→</div><div class="ipo-box ipo-process"><div class="ipo-label">⚙️ Process</div><div class="ipo-content">${l.process}</div></div><div class="ipo-arrow">→</div><div class="ipo-box ipo-output"><div class="ipo-label">✅ Output</div><div class="ipo-content">${l.output}</div></div></div><div class="lc-desc">${l.desc}</div><div class="lc-examples">${l.examples.map(e=>`<span class="lc-ex" style="background:${l.color}18;border:1px solid ${l.color}35;color:${l.color};">${e}</span>`).join('')}</div><div class="lc-wow" style="border-left:4px solid ${l.color};color:${l.color};">💡 ${l.wow}</div></div>`;
    card.querySelector('.lc-header').addEventListener('click', () => card.classList.toggle('open'));
    container.appendChild(card);
  });
      }
