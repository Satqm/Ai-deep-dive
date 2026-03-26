// Attention simulator – full logic
const tokens = ["Satyam","helps","you","upskill","in","AI"];
const embeddings = [[0.8,0.2,0.5,0.9],[0.3,0.7,0.4,0.2],[0.6,0.4,0.8,0.3],[0.4,0.9,0.3,0.7],[0.2,0.3,0.6,0.4],[0.9,0.5,0.2,0.8]];
const W_Q = [[0.5,0.3,0.2,0.4],[0.2,0.6,0.3,0.1],[0.4,0.2,0.5,0.3],[0.3,0.4,0.2,0.6]];
const W_K = [[0.4,0.2,0.3,0.1],[0.5,0.3,0.2,0.4],[0.2,0.4,0.6,0.1],[0.3,0.2,0.4,0.5]];
const W_V = [[0.7,0.1,0.2,0.3],[0.2,0.8,0.1,0.2],[0.3,0.1,0.7,0.2],[0.1,0.2,0.3,0.6]];

function mv(e, W) {
  let r = [0,0,0,0];
  for(let i=0;i<4;i++) for(let j=0;j<4;j++) r[i] += e[j] * W[j][i];
  return r.map(v => +v.toFixed(4));
}
const Qs = embeddings.map(e => mv(e, W_Q));
const Ks = embeddings.map(e => mv(e, W_K));
const Vs = embeddings.map(e => mv(e, W_V));
function dot(a,b) { return a.reduce((s,v,i) => s + v * b[i], 0); }
const rawScores = tokens.map((_,i) => tokens.map((_,j) => +(dot(Qs[i], Ks[j]) / 2).toFixed(4)));
function softmax(row) {
  let mx = Math.max(...row);
  let exps = row.map(v => Math.exp(v - mx));
  let sum = exps.reduce((a,b) => a + b, 0);
  return exps.map(v => +(v / sum).toFixed(4));
}
const attnW = rawScores.map(row => softmax(row));
const outputs = tokens.map((_,i) => {
  let o = [0,0,0,0];
  for(let j=0;j<tokens.length;j++) {
    let w = attnW[i][j];
    for(let d=0;d<4;d++) o[d] += w * Vs[j][d];
  }
  return o.map(v => +v.toFixed(4));
});
let selIdx = 0;

function renderTokensRow() {
  let el = document.getElementById('tokens-row');
  el.innerHTML = tokens.map((t,i) => `<div class="token ${i===selIdx?'selected':''}" data-i="${i}">${t}</div>`).join('');
  el.querySelectorAll('.token').forEach(t => t.addEventListener('click', () => { selIdx = +t.dataset.i; updateAll(); }));
}
function renderEmbedding() {
  let e = embeddings[selIdx];
  document.getElementById('embedding-display').innerHTML = `<span style="color:var(--teal)">${tokens[selIdx]}</span> → [${e.map(v=>`<span style="color:var(--gold)">${v}</span>`).join(', ')}]<br><span style="color:var(--text-dim);font-size:.75rem;">All embeddings:</span><br>${tokens.map((t,i)=>`<span style="color:${i===selIdx?'var(--teal)':'var(--text-dim)'};">${t.padEnd(8)}</span> → [${embeddings[i].join(', ')}]`).join('<br>')}`;
}
function renderQKV() {
  let q=Qs[selIdx], k=Ks[selIdx], v=Vs[selIdx];
  document.getElementById('qkv-vectors').innerHTML = `<div class="qkv-card" style="border-top:3px solid #a855f7;"><div style="color:#a855f7;font-weight:700;margin-bottom:.3rem;">Q — Query</div><div style="font-size:.78rem;color:var(--text-dim);margin-bottom:.4rem;">"What is ${tokens[selIdx]} looking for?"</div><div style="font-family:'JetBrains Mono',monospace;font-size:.82rem;">[${q.join(', ')}]</div></div><div class="qkv-card" style="border-top:3px solid #eab308;"><div style="color:#eab308;font-weight:700;margin-bottom:.3rem;">K — Key</div><div style="font-size:.78rem;color:var(--text-dim);margin-bottom:.4rem;">"What does ${tokens[selIdx]} offer?"</div><div style="font-family:'JetBrains Mono',monospace;font-size:.82rem;">[${k.join(', ')}]</div></div><div class="qkv-card" style="border-top:3px solid #10b981;"><div style="color:#10b981;font-weight:700;margin-bottom:.3rem;">V — Value</div><div style="font-size:.78rem;color:var(--text-dim);margin-bottom:.4rem;">"Info ${tokens[selIdx]} will share"</div><div style="font-family:'JetBrains Mono',monospace;font-size:.82rem;">[${v.join(', ')}]</div></div>`;
}
function renderScores() {
  document.getElementById('scores-focused').textContent = tokens[selIdx];
  let sc = rawScores[selIdx], mx = Math.max(...sc);
  document.getElementById('scores-bars').innerHTML = tokens.map((t,i) => `<div class="bar-row"><div class="bar-label">${t}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(3,(sc[i]/mx)*100).toFixed(1)}%"></div></div><div class="bar-val">${sc[i]}</div></div>`).join('');
}
function renderSoftmax() {
  document.getElementById('sm-focused').textContent = tokens[selIdx];
  let pr = attnW[selIdx];
  document.getElementById('softmax-bars').innerHTML = tokens.map((t,i) => `<div class="bar-row"><div class="bar-label">${t}</div><div class="bar-track"><div class="bar-fill gold" style="width:${Math.max(1,pr[i]*100).toFixed(1)}%"></div></div><div class="bar-val">${(pr[i]*100).toFixed(0)}%</div></div>`).join('');
}
function renderFlow() {
  document.getElementById('flow-focused').textContent = tokens[selIdx];
  let row = document.getElementById('flow-tokens-row');
  row.innerHTML = tokens.map((t,i) => `<div style="text-align:center;flex:1;"><div class="flow-tok-box ${i===selIdx?'src':''}">${t}</div><div style="font-size:.65rem;color:var(--text-dim);margin-top:.25rem;">${(attnW[selIdx][i]*100).toFixed(0)}%</div></div>`).join('');
  setTimeout(() => {
    let svg = document.getElementById('flow-svg'), vis = document.getElementById('flow-vis'), vr = vis.getBoundingClientRect();
    let boxes = row.querySelectorAll('.flow-tok-box');
    if(!vr.width) return;
    let sb = boxes[selIdx].getBoundingClientRect(), sx = sb.left + sb.width/2 - vr.left, sy = sb.top + sb.height/2 - vr.top;
    let lines = '';
    boxes.forEach((box,i) => {
      if(i===selIdx) return;
      let b = box.getBoundingClientRect(), tx = b.left + b.width/2 - vr.left, ty = b.top + b.height/2 - vr.top, w = attnW[selIdx][i];
      lines += `<line x1="${sx}" y1="${sy}" x2="${tx}" y2="${ty}" stroke="rgba(0,212,200,${0.18+w*0.82})" stroke-width="${1+w*11}" stroke-linecap="round"/>`;
    });
    svg.innerHTML = lines;
  }, 20);
}
function renderHeatmap() {
  let n=tokens.length, el=document.getElementById('heatmap');
  el.style.gridTemplateColumns = `76px repeat(${n},1fr)`;
  let html = `<div></div>` + tokens.map(t => `<div style="font-size:.72rem;text-align:center;padding-bottom:4px;color:var(--teal);font-weight:600;">${t}</div>`).join('');
  tokens.forEach((t,i) => {
    html += `<div style="font-size:.72rem;display:flex;align-items:center;color:var(--text-dim);font-weight:${i===selIdx?700:400};color:${i===selIdx?'var(--teal)':'var(--text-dim)'};">${t}</div>`;
    tokens.forEach((_,j) => {
      let v = attnW[i][j];
      html += `<div class="hm-cell ${i===selIdx?'row-highlight':''}" data-row="${i}" data-col="${j}" style="background:rgba(0,212,200,${0.08+v*0.87});color:${v>0.45?'#0f172a':'var(--text)'}">${(v*100).toFixed(0)}%</div>`;
    });
  });
  el.innerHTML = html;
  el.querySelectorAll('.hm-cell').forEach(c => {
    c.addEventListener('mouseenter',()=>{let r=+c.dataset.row,col=+c.dataset.col;el.querySelectorAll('.hm-cell').forEach(cc=>{if(+cc.dataset.row===r||+cc.dataset.col===col)cc.classList.add('row-highlight');});});
    c.addEventListener('mouseleave',()=>el.querySelectorAll('.hm-cell').forEach(cc=>cc.classList.remove('row-highlight')));
    c.addEventListener('click',()=>{selIdx=+c.dataset.row;updateAll();});
  });
}
function renderOutput() {
  document.getElementById('out-focused').textContent = tokens[selIdx];
  let pr = attnW[selIdx], topJ = pr.indexOf(Math.max(...pr)), out = outputs[selIdx];
  document.getElementById('output-display').innerHTML = `<span style="color:var(--text-dim)">output</span>(<span style="color:var(--teal)">${tokens[selIdx]}</span>) = [${out.map(v=>`<span style="color:var(--gold)">${v}</span>`).join(', ')}]<br><span style="color:var(--text-dim);font-size:.76rem;">↳ Most attention to <span style="color:var(--teal)">${tokens[topJ]}</span> (${(pr[topJ]*100).toFixed(0)}%)</span>`;
}
function updateAll() {
  renderTokensRow(); renderEmbedding(); renderQKV(); renderScores(); renderSoftmax(); renderFlow(); renderHeatmap(); renderOutput(); buildS10();
}
// Step10 animation
const S10_PH = [{l:'Input Tokens',e:'📥'},{l:'Q · K · V',e:'🔀'},{l:'Dot Scores',e:'📐'},{l:'Softmax',e:'🧮'},{l:'Weighted Sum',e:'⚖️'},{l:'Output',e:'✨'}];
let s10Ph = 0, s10Play = true, s10Timer = null;
function vs(vec){ return `[${vec.slice(0,2).join(', ')}..]`; }
function buildS10() {
  const canvas = document.getElementById('s10-canvas');
  if(!canvas) return;
  const i = selIdx, pr = attnW[i], sc = rawScores[i], out = outputs[i], topJ = pr.indexOf(Math.max(...pr));
  const ph = document.getElementById('s10-phases');
  ph.innerHTML = S10_PH.map((p,pi) => `<div class="s10-ph ${pi<s10Ph?'done':pi===s10Ph?'active':''}" onclick="gotoS10Ph(${pi})">${p.e} ${p.l}</div>`).join('');
  document.getElementById('s10-counter').textContent = `Step ${s10Ph+1} / ${S10_PH.length}`;
  document.getElementById('s10-focus-chip').textContent = `Focus: ${tokens[i]}`;
  if(s10Ph===0) {
    canvas.innerHTML = `<div style="text-align:center;margin-bottom:1rem;font-size:.72rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em;">Select any token to focus on it</div><div style="display:flex;flex-wrap:wrap;justify-content:center;gap:.7rem;margin-bottom:1.3rem;">${tokens.map((t,ti)=>`<div class="v-box ${ti===i?'lit':''}" style="min-width:80px;cursor:pointer;" onclick="selIdx=${ti};updateAll();buildS10();"><div class="v-lbl" style="color:${ti===i?'var(--teal)':'var(--text-dim)'};">${ti===i?'◉ focus':String(ti)}</div><div style="font-weight:600;font-size:.95rem;margin:.2rem 0;color:${ti===i?'var(--teal)':'var(--text)'};">${t}</div><div class="v-val">${vs(embeddings[ti])}</div></div>`).join('')}</div><div style="text-align:center;font-size:.78rem;background:rgba(0,0,0,.3);padding:.5rem 1rem;border-radius:8px;color:var(--text-dim);display:inline-block;margin:0 auto;">Real GPT-4 uses <strong style="color:var(--text);">12,288</strong> dims per token · We use 4 for clarity</div>`;
  } else if(s10Ph===1) {
    canvas.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;gap:.6rem;flex-wrap:wrap;"><div class="v-box lit" style="min-width:90px;"><div class="v-lbl" style="color:var(--teal);">Token</div><div style="font-weight:600;font-size:.95rem;color:var(--teal);margin:.2rem 0;">${tokens[i]}</div><div class="v-val">[${embeddings[i].join(', ')}]</div></div><div style="font-size:1.5rem;color:rgba(255,255,255,.3)">→</div><div style="display:flex;flex-direction:column;gap:.4rem;"><div class="v-box pur-lit" style="min-width:105px;"><div class="v-lbl" style="color:#a855f7;">× W<sub>Q</sub></div><div class="v-val">4×4 matrix</div></div><div class="v-box gold-lit" style="min-width:105px;"><div class="v-lbl" style="color:var(--gold);">× W<sub>K</sub></div><div class="v-val">4×4 matrix</div></div><div class="v-box grn-lit" style="min-width:105px;"><div class="v-lbl" style="color:#34d399;">× W<sub>V</sub></div><div class="v-val">4×4 matrix</div></div></div><div style="font-size:1.5rem;color:rgba(255,255,255,.3)">→</div><div style="display:flex;flex-direction:column;gap:.4rem;"><div class="v-box pur-lit" style="min-width:140px;"><div class="v-lbl" style="color:#a855f7;">Query (Q)</div><div class="v-val bright">[${Qs[i].join(', ')}]</div><div style="font-size:.6rem;color:#a855f7;margin-top:2px;">"What am I seeking?"</div></div><div class="v-box gold-lit" style="min-width:140px;"><div class="v-lbl" style="color:var(--gold);">Key (K)</div><div class="v-val bright">[${Ks[i].join(', ')}]</div><div style="font-size:.6rem;color:var(--gold);margin-top:2px;">"What do I offer?"</div></div><div class="v-box grn-lit" style="min-width:140px;"><div class="v-lbl" style="color:#34d399;">Value (V)</div><div class="v-val bright">[${Vs[i].join(', ')}]</div><div style="font-size:.6rem;color:#34d399;margin-top:2px;">"My actual content"</div></div></div></div>`;
  } else if(s10Ph===2) {
    const mx = Math.max(...sc);
    canvas.innerHTML = `<div style="font-size:.72rem;color:var(--text-dim);text-align:center;margin-bottom:.9rem;">Q("${tokens[i]}") · K(each token) ÷ √4 = raw attention scores</div><div style="display:flex;gap:1.2rem;align-items:flex-start;flex-wrap:wrap;justify-content:center;"><div class="v-box pur-lit" style="min-width:120px;align-self:center;"><div class="v-lbl" style="color:#a855f7;">Q of ${tokens[i]}</div><div class="v-val bright">${vs(Qs[i])}</div><div style="font-size:.6rem;color:var(--text-dim);margin-top:3px;">dot with each key ↓</div></div><div style="font-size:1.2rem;color:rgba(255,255,255,.2);align-self:center;">→</div><div style="flex:1;min-width:200px;">${tokens.map((t,ti)=>{const s=sc[ti],pct=Math.max(3,(s/mx)*100),top=ti===sc.indexOf(mx);return`<div class="wsum-row"><div class="wsum-tok" style="color:${ti===i?'var(--teal)':top?'var(--gold)':'var(--text-dim)'};">${t}</div><div class="wsum-track"><div class="wsum-fill ${top?'gold':''}" style="width:${pct}%;"></div></div><div class="wsum-val" style="color:${top?'var(--gold)':'var(--text-dim)'}">${s}</div>${top?'<span style="font-size:.62rem;color:var(--gold);margin-left:.3rem;">← top</span>':''}</div>`;}).join('')}<div style="font-size:.68rem;color:var(--text-dim);margin-top:.5rem;">formula: Q·Kᵀ ÷ √d = Q·Kᵀ ÷ 2</div></div></div>`;
  } else if(s10Ph===3) {
    canvas.innerHTML = `<div style="font-size:.72rem;color:var(--text-dim);text-align:center;margin-bottom:.9rem;">softmax converts raw scores → probabilities (sum = 100%)</div><div style="display:flex;gap:1.5rem;flex-wrap:wrap;align-items:flex-start;justify-content:center;"><div style="flex:1;min-width:200px;"><div style="font-size:.72rem;color:var(--teal);margin-bottom:.5rem;font-weight:600;">Attention weights for "${tokens[i]}"</div>${tokens.map((t,ti)=>{const p=pr[ti],top=ti===topJ;return`<div class="wsum-row"><div class="wsum-tok" style="color:${top?'var(--gold)':'var(--text-dim)'};">${t}</div><div class="wsum-track"><div class="wsum-fill ${top?'gold':''}" style="width:${Math.max(1,p*100).toFixed(1)}%"></div></div><div class="wsum-val" style="color:${top?'var(--gold)':'var(--text-dim)'}">${(p*100).toFixed(0)}%</div></div>`;}).join('')}<div style="font-size:.65rem;color:var(--text-dim);margin-top:.5rem;">Sum = ${(pr.reduce((a,b)=>a+b,0)*100).toFixed(0)}%  ✓</div></div><div style="min-width:190px;"><div style="font-size:.72rem;color:var(--teal);margin-bottom:.5rem;font-weight:600;">Full matrix (row = "${tokens[i]}")</div><div class="s10-hm" style="grid-template-columns:48px repeat(${tokens.length},1fr);"><div></div>${tokens.map(t=>`<div style="font-size:.58rem;color:var(--teal);text-align:center;padding:1px;">${t}</div>`).join('')}${tokens.map((t,ri)=>{const rp=attnW[ri];return`<div style="font-size:.58rem;color:${ri===i?'var(--teal)':'var(--text-dim)'};display:flex;align-items:center;padding-right:2px;">${t}</div>`+rp.map((p)=>`<div class="s10-hm-cell ${ri===i?'row-active':''}" style="background:rgba(0,212,200,${0.07+p*0.88});color:${p>0.44?'#0f172a':'var(--text)'};">${(p*100).toFixed(0)}%</div>`).join('');}).join('')}</div></div></div>`;
  } else if(s10Ph===4) {
    canvas.innerHTML = `<div style="font-size:.72rem;color:var(--text-dim);text-align:center;margin-bottom:.9rem;">Output = Σ (attention% × Value_vector) for each token</div><div style="display:flex;gap:1.2rem;align-items:flex-start;flex-wrap:wrap;justify-content:center;"><div style="flex:1;min-width:220px;"><div style="font-size:.72rem;color:var(--teal);margin-bottom:.6rem;font-weight:600;">Weighted contributions to "${tokens[i]}"</div>${tokens.map((t,ti)=>{const w=pr[ti],top=ti===topJ;return`<div class="wsum-row" style="align-items:flex-start;margin-bottom:6px;"><div class="wsum-tok" style="color:${top?'var(--gold)':'var(--text-dim)'};margin-top:2px;">${t}</div><div style="flex:1;"><div style="font-size:.62rem;color:var(--text-dim);margin-bottom:2px;">${(w*100).toFixed(0)}% × ${vs(Vs[ti])}</div><div class="wsum-track" style="height:14px;"><div class="wsum-fill ${top?'gold':''}" style="width:${Math.max(1,w*100).toFixed(1)}%"></div></div></div></div>`;}).join('')}</div><div style="display:flex;align-items:center;font-size:1.3rem;color:rgba(255,255,255,.2);padding-top:1rem;">→</div><div class="v-box lit" style="min-width:130px;align-self:center;"><div class="v-lbl" style="color:var(--teal);">Σ Result</div><div class="v-val bright" style="font-size:.7rem;">[${out.slice(0,2).join(', ')},<br>${out.slice(2).join(', ')}]</div><div style="font-size:.58rem;color:var(--teal);margin-top:3px;">→ final output</div></div></div>`;
  } else {
    canvas.innerHTML = `<div style="font-size:.72rem;color:var(--text-dim);text-align:center;margin-bottom:1rem;">Before vs After — Context-enriched embedding</div><div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin-bottom:1.2rem;"><div class="v-box" style="min-width:150px;opacity:1;border-color:var(--border);"><div class="v-lbl" style="color:var(--text-dim);">BEFORE (raw)</div><div style="font-weight:600;margin:.3rem 0;">${tokens[i]}</div><div class="v-val">[${embeddings[i].join(', ')}]</div><div style="font-size:.6rem;color:var(--text-dim);margin-top:3px;">no context</div></div><div style="display:flex;align-items:center;font-size:1.4rem;color:rgba(0,212,200,.5);">→</div><div class="v-box lit out-pop" style="min-width:150px;"><div class="v-lbl" style="color:var(--teal);">AFTER (enriched)</div><div style="font-weight:600;margin:.3rem 0;color:var(--teal);">${tokens[i]}</div><div class="v-val bright">[${out.join(', ')}]</div><div style="font-size:.6rem;color:var(--teal);margin-top:3px;">✓ context-aware · absorbed from ${tokens[topJ]} (${(pr[topJ]*100).toFixed(0)}%)</div></div></div><div style="font-size:.72rem;color:var(--teal);margin-bottom:.5rem;font-weight:600;text-align:center;">Complete 6×6 attention matrix</div><div style="overflow-x:auto;"><div class="s10-hm" style="grid-template-columns:55px repeat(${tokens.length},1fr);gap:3px;min-width:380px;"><div></div>${tokens.map(t=>`<div style="font-size:.65rem;font-weight:600;color:var(--teal);text-align:center;padding:2px;">${t}</div>`).join('')}${tokens.map((t,ri)=>{const rp=attnW[ri];return`<div style="font-size:.65rem;color:${ri===i?'var(--teal)':'var(--text-dim)'};font-weight:${ri===i?700:400};display:flex;align-items:center;padding-right:4px;">${t}</div>`+rp.map((p)=>`<div class="s10-hm-cell ${ri===i?'row-active':''}" style="background:rgba(${ri===i?'0,212,200':'0,180,170'},${0.07+p*0.88});color:${p>0.44?'#0f172a':'var(--text)'};font-weight:${ri===i?700:400};">${(p*100).toFixed(0)}%</div>`).join('');}).join('')}</div></div>`;
  }
  const S10_EX = [
    {e:'📥',h:(i)=>`<strong>Step 1 — Input Tokens.</strong> The sentence is split into 6 tokens. Focus token: <strong style="color:var(--teal);">${tokens[i]}</strong>. Goal: enrich it with context from all other words.`},
    {e:'🔀',h:(i)=>`<strong>Step 2 — Q,K,V Projection.</strong> <strong style="color:var(--teal);">${tokens[i]}</strong> is multiplied by 3 learned weight matrices (W_Q, W_K, W_V) → Query (what I seek), Key (what I offer), Value (my content).`},
    {e:'📐',h:(i)=>{const topJ=sc.indexOf(Math.max(...sc));return`<strong>Step 3 — Dot Product Scores.</strong> Q("${tokens[i]}") · K(each token) ÷ √4. Highest: <strong style="color:var(--gold);">${tokens[topJ]}</strong> (${sc[topJ]}). Dividing by √d prevents exploding gradients.`;}},
    {e:'🧮',h:(i)=>{const topJ=pr.indexOf(Math.max(...pr));return`<strong>Step 4 — Softmax.</strong> Raw scores → probabilities summing to 100%. <strong style="color:var(--teal);">${tokens[i]}</strong> focuses most on <strong style="color:var(--gold);">${tokens[topJ]}</strong> (${(pr[topJ]*100).toFixed(0)}%).`;}},
    {e:'⚖️',h:(i)=>`<strong>Step 5 — Weighted Sum.</strong> Each Value vector is scaled by its attention probability. High-attention tokens contribute more. The blend = new contextual representation.`},
    {e:'✨',h:(i)=>{const topJ=pr.indexOf(Math.max(...pr));return`<strong>Step 6 — Output.</strong> <strong style="color:var(--teal);">${tokens[i]}</strong> is now a context-aware embedding. It absorbed the most from <strong style="color:var(--gold);">${tokens[topJ]}</strong> (${(pr[topJ]*100).toFixed(0)}%). This richer vector flows to the next layer.`;}}
  ];
  const ex = S10_EX[s10Ph];
  document.getElementById('s10-icon').textContent = ex.e;
  document.getElementById('s10-text').innerHTML = ex.h(i);
}
function gotoS10Ph(p) { if(s10Timer) clearInterval(s10Timer); s10Play=false; document.getElementById('s10-play-icon').className='fas fa-play'; s10Ph=p; buildS10(); }
function s10StartAuto() { if(s10Timer) return; const d=+document.getElementById('s10-speed').value; s10Timer=setInterval(()=>{ s10Ph=(s10Ph+1)%6; buildS10(); }, d); }
document.addEventListener('DOMContentLoaded', () => {
  updateAll();
  s10StartAuto();
  document.getElementById('s10-play').addEventListener('click', () => { s10Play = !s10Play; document.getElementById('s10-play-icon').className = s10Play ? 'fas fa-pause' : 'fas fa-play'; if(s10Play) s10StartAuto(); else { if(s10Timer) clearInterval(s10Timer); s10Timer = null; } });
  document.getElementById('s10-prev').addEventListener('click', () => gotoS10Ph((s10Ph-1+6)%6));
  document.getElementById('s10-next').addEventListener('click', () => gotoS10Ph((s10Ph+1)%6));
  document.getElementById('s10-reset').addEventListener('click', () => { selIdx=0; s10Ph=0; updateAll(); });
  document.getElementById('s10-speed').addEventListener('change', () => { if(s10Play && s10Timer) { clearInterval(s10Timer); s10Timer=null; s10StartAuto(); } });
});
window.updateAll = updateAll;
