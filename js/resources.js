function renderResources() {
  renderRepos();
  renderCourses();
}

function renderRepos() {
  const grid = document.getElementById('repo-grid');
  if (!grid || grid.children.length > 0) return;
  window.reposData.forEach(r => {
    const card = document.createElement('div');
    card.className = 'repo-card';
    card.setAttribute('data-rcat', r.cat);
    card.innerHTML = `<div class="repo-card-top"><div class="repo-badge" style="background:${r.color}18;border:1px solid ${r.color}35;color:${r.color};">${r.icon} ${r.cat}</div><div class="repo-name" style="color:${r.color};">${r.name}</div><div class="repo-tagline">${r.tagline}</div></div><div class="repo-expand"><div class="repo-usecase">${r.usecase}</div><div class="repo-why">${r.why}</div></div><div class="repo-foot"><a href="${r.url}" target="_blank" rel="noopener noreferrer" class="repo-btn" style="background:${r.color};"><i class="fab fa-github"></i> View on GitHub</a><button class="repo-more-btn" onclick="toggleRepo(this)"><i class="fas fa-info-circle"></i> Details</button></div>`;
    grid.appendChild(card);
  });
}

function renderCourses() {
  const cont = document.getElementById('courses-container');
  if (!cont || cont.children.length > 0) return;
  window.coursesData.forEach(cat => {
    const sec = document.createElement('div');
    sec.className = 'course-cat';
    sec.innerHTML = `<div class="course-cat-label" style="color:${cat.catColor};">${cat.catIcon} ${cat.cat}</div><div class="course-grid" id="cg-${cat.cat.replace(/ /g,'-')}"></div>`;
    cont.appendChild(sec);
    const grid = sec.querySelector('.course-grid');
    cat.courses.forEach(c => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = `<div class="course-icon">${c.icon}</div><div class="course-title">${c.title}</div><div class="course-desc">${c.desc}</div><div class="course-why">${c.why}</div><a href="${c.url}" target="_blank" rel="noopener noreferrer" class="course-btn" style="border-color:${cat.catColor};color:${cat.catColor};"><i class="fas fa-external-link-alt"></i> Start Free</a>`;
      grid.appendChild(card);
    });
  });
}

window.filterRepos = function(cat, el) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.repo-card').forEach(c => {
    c.style.display = (cat === 'all' || c.getAttribute('data-rcat') === cat) ? '' : 'none';
  });
};

window.toggleRepo = function(btn) {
  const card = btn.closest('.repo-card');
  card.classList.toggle('open');
  btn.innerHTML = card.classList.contains('open') ? '<i class="fas fa-chevron-up"></i> Less' : '<i class="fas fa-info-circle"></i> Details';
};
