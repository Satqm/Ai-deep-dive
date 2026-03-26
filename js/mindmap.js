function initMindMap() {
  const canvas = document.getElementById('mmCanvas');
  if (!canvas || canvas.querySelectorAll('.mm-node').length > 0) return;
  const nodes = window.frameworks.map((fw, idx) => {
    const node = document.createElement('div');
    node.className = 'mm-node';
    node.innerHTML = `<div class="mm-node-name">${fw.name}</div><div class="mm-node-form">${fw.full}</div><div class="mm-node-cta"><i class="fas fa-hand-pointer"></i> Tap for insights</div>`;
    node.addEventListener('click', () => window.showFrameworkModal(idx));
    canvas.appendChild(node);
    return node;
  });
  function layout() {
    if (window.innerWidth <= 820) {
      document.getElementById('mmSvg').style.display = 'none';
      nodes.forEach(n => { n.style.position = 'relative'; n.style.left = ''; n.style.top = ''; });
      return;
    }
    document.getElementById('mmSvg').style.display = 'block';
    const cw = canvas.offsetWidth, ch = Math.max(canvas.offsetHeight, 680);
    const cx = cw / 2, cy = ch / 2;
    const radius = Math.min(cw * 0.36, ch * 0.36, 300);
    const step = (Math.PI * 2) / nodes.length;
    nodes.forEach((node, i) => {
      const angle = i * step - Math.PI / 2;
      const nw = node.offsetWidth || 210;
      const nh = node.offsetHeight || 105;
      node.style.position = 'absolute';
      node.style.left = (cx + radius * Math.cos(angle) - nw / 2) + 'px';
      node.style.top = (cy + radius * Math.sin(angle) - nh / 2) + 'px';
    });
    const svg = document.getElementById('mmSvg');
    const rect = canvas.getBoundingClientRect();
    svg.setAttribute('width', rect.width);
    svg.setAttribute('height', rect.height);
    svg.querySelectorAll('path.ml').forEach(p => p.remove());
    nodes.forEach(node => {
      const nr = node.getBoundingClientRect();
      const nx = nr.left + nr.width / 2 - rect.left;
      const ny = nr.top + nr.height / 2 - rect.top;
      const dx = nx - cx, dy = ny - cy, dist = Math.hypot(dx, dy);
      const hubR = 95;
      const sx = cx + dx / dist * hubR;
      const sy = cy + dy / dist * hubR;
      const ex = nx - dx / dist * 22;
      const ey = ny - dy / dist * 22;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'ml');
      path.setAttribute('d', `M${sx},${sy} Q${(sx+ex)/2},${(sy+ey)/2-10} ${ex},${ey}`);
      path.setAttribute('stroke', 'url(#lineGrad)');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-dasharray', '5 4');
      path.setAttribute('opacity', '0.65');
      svg.appendChild(path);
    });
  }
  setTimeout(layout, 80);
  window.addEventListener('resize', () => layout());
  if (window.ResizeObserver) new ResizeObserver(layout).observe(canvas);
}
