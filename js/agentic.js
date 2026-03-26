function renderAgentic() {
  // Add any dynamic content generation if needed, otherwise the HTML is static.
  // The agent loop and terminal functions are already defined globally.
}

window.runLoopDemo = function() {
  if (window.loopTimer) clearInterval(window.loopTimer);
  let step = 0;
  const nodes = document.querySelectorAll('#agent-loop .loop-node');
  nodes.forEach(n => n.classList.remove('active-step'));
  window.loopTimer = setInterval(() => {
    nodes.forEach(n => n.classList.remove('active-step'));
    nodes[step % 4].classList.add('active-step');
    step++;
  }, 900);
  setTimeout(() => { clearInterval(window.loopTimer); nodes.forEach(n => n.classList.remove('active-step')); }, 4500);
};

window.runAgentTrace = function() {
  const terminal = document.getElementById('agent-terminal');
  const lines = [
    { badge:'PLAN', cls:'at-plan', text:'Decompose goal → 1. Search flights 2. Filter ≤₹50k 3. Check window seat 4. Rank options' },
    { badge:'ACT', cls:'at-act', text:'tool.call("flight_search", {from:"BOM", to:"TYO", budget:50000}) → fetching live data...' },
    { badge:'OBS', cls:'at-reflect', text:'Results: JAL ₹48,200 ✓window | ANA ₹52,400 ✗over budget | IndiGo ₹37,800 ✗no window' },
    { badge:'REFLECT', cls:'at-reflect', text:'IndiGo cheapest but no window seat. JAL within budget AND has window. Goal: window + budget.' },
    { badge:'DONE', cls:'at-done', text:'✅ Recommend: JAL ₹48,200 · Window seat 14A · Departs 09:15 · ETA 21:30 JST. Confirm booking?' }
  ];
  terminal.innerHTML = `<div style="color:rgba(0,212,200,.5);font-size:.78rem;margin-bottom:.6rem;">$ agent.run(goal="Book flight Tokyo under ₹50k window seat") ▌</div>`;
  lines.forEach((l, idx) => {
    const div = document.createElement('div');
    div.className = 'at-line';
    div.innerHTML = `<span class="at-badge ${l.cls}">${l.badge}</span><span class="at-text">${l.text}</span>`;
    terminal.appendChild(div);
    setTimeout(() => div.classList.add('visible'), 400 + (idx * 700));
  });
};
