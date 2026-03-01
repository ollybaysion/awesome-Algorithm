/* ===================================================
   Algorithm Learning Dashboard - app.js
   =================================================== */

const state = {
  manifest: null,
  currentHash: null,
  progress: {},
  allTopics: []   // flat list: { hash, subject, chapter, topic }
};

/* ─── Utility ─── */
const $ = id => document.getElementById(id);
const hashToPath = hash => `content/${hash}.md`;

/* ─── Progress ─── */
function loadProgress() {
  try { state.progress = JSON.parse(localStorage.getItem('alg-progress') || '{}'); }
  catch { state.progress = {}; }
}
function saveProgress() {
  localStorage.setItem('alg-progress', JSON.stringify(state.progress));
}
function getTotalTopics() { return state.allTopics.length; }
function getDoneTopics()  { return Object.values(state.progress).filter(Boolean).length; }
function updateGlobalProgress() {
  const total = getTotalTopics();
  const done  = getDoneTopics();
  const pct   = total ? Math.round(done / total * 100) : 0;
  $('globalProgressBar').style.width = pct + '%';
  $('globalProgressText').textContent = pct + '%';
}

/* ─── Manifest ─── */
async function loadManifest() {
  const res = await fetch('manifest.json', { cache: 'no-store' });
  state.manifest = await res.json();
}

/* ─── Build flat topic list ─── */
function buildTopicList() {
  state.allTopics = [];
  if (!state.manifest) return;
  for (const subj of state.manifest.subjects) {
    for (const chap of subj.chapters) {
      for (const topic of chap.topics) {
        const hash = `${subj.id}/${chap.id}/${topic.id}`;
        state.allTopics.push({ hash, subject: subj, chapter: chap, topic });
      }
    }
  }
}

/* ─── Sidebar Render ─── */
function renderSidebar() {
  if (!state.manifest) return;
  const container = $('sidebar-subjects');
  container.innerHTML = '';

  state.manifest.subjects.forEach((subj, si) => {
    const section = document.createElement('div');
    section.className = 'sidebar-section';

    const total = subj.chapters.reduce((s, c) => s + c.topics.length, 0);
    const done  = subj.chapters.reduce((s, c) =>
      s + c.topics.filter(t => state.progress[`${subj.id}/${c.id}/${t.id}`]).length, 0);

    const btn = document.createElement('button');
    btn.className = 'sidebar-section-title';
    btn.dataset.target = `subj-list-${si}`;
    btn.innerHTML = `
      <span class="section-icon">${subj.icon || '📁'}</span>
      ${subj.title}
      <small style="margin-left:4px;color:var(--text-muted);font-weight:400">${done}/${total}</small>
      <span class="toggle-arrow">▾</span>`;
    btn.addEventListener('click', () => toggleSection(`subj-list-${si}`, btn));

    const ul = document.createElement('ul');
    ul.className = 'sidebar-section-list open';
    ul.id = `subj-list-${si}`;

    subj.chapters.forEach(chap => {
      const li = document.createElement('li');
      li.innerHTML = `<div class="sidebar-chapter">${chap.title}</div>`;

      chap.topics.forEach(topic => {
        const hash = `${subj.id}/${chap.id}/${topic.id}`;
        const a = document.createElement('a');
        a.href = `#${hash}`;
        a.className = 'nav-item' + (state.progress[hash] ? ' completed' : '');
        a.dataset.hash = hash;
        a.textContent = topic.title;
        a.addEventListener('click', () => {
          if (window.innerWidth <= 768) closeSidebar();
        });
        li.appendChild(a);
      });

      ul.appendChild(li);
    });

    section.appendChild(btn);
    section.appendChild(ul);
    container.appendChild(section);
  });
}

function toggleSection(listId, btn) {
  const list  = document.getElementById(listId);
  const arrow = btn.querySelector('.toggle-arrow');
  if (!list) return;
  const collapsed = list.classList.toggle('collapsed');
  arrow.classList.toggle('collapsed', collapsed);
}

/* ─── Home Screen ─── */
function renderHome() {
  if (!state.manifest) return;
  const total = getTotalTopics();
  const done  = getDoneTopics();
  const subjects = state.manifest.subjects.length;

  $('homeStats').innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${subjects}</div>
      <div class="stat-label">과목 수</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${total}</div>
      <div class="stat-label">전체 토픽</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${done}</div>
      <div class="stat-label">완료 토픽</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${total ? Math.round(done/total*100) : 0}%</div>
      <div class="stat-label">진행률</div>
    </div>`;

  const colors = ['--color-1','--color-2','--color-3','--color-4','--color-5','--color-6','--color-7'];
  $('subjectCards').innerHTML = state.manifest.subjects.map((subj, i) => {
    const total = subj.chapters.reduce((s, c) => s + c.topics.length, 0);
    const done  = subj.chapters.reduce((s, c) =>
      s + c.topics.filter(t => state.progress[`${subj.id}/${c.id}/${t.id}`]).length, 0);
    const pct = total ? Math.round(done/total*100) : 0;
    const color = `var(${colors[i % colors.length]})`;
    const firstHash = subj.chapters[0]?.topics[0]
      ? `${subj.id}/${subj.chapters[0].id}/${subj.chapters[0].topics[0].id}` : '#';
    return `
      <div class="subject-card" style="--card-color:${color}" onclick="location.hash='${firstHash}'">
        <div class="subject-card-icon">${subj.icon || '📂'}</div>
        <div class="subject-card-title">${subj.title}</div>
        <div class="subject-card-desc">${subj.description || ''}</div>
        <div class="subject-card-progress">${done} / ${total} 완료</div>
        <div class="subject-card-bar"><div class="subject-card-bar-fill" style="width:${pct}%;background:${color}"></div></div>
      </div>`;
  }).join('');
}

/* ─── Content Loading ─── */
async function loadContent(hash) {
  const viewer  = $('contentViewer');
  const home    = $('homeScreen');
  home.classList.add('hidden');
  viewer.classList.remove('hidden');

  const body = $('markdownBody');
  body.innerHTML = '<p style="color:var(--text-muted)">로딩 중...</p>';

  const filePath = hashToPath(hash);
  try {
    const res  = await fetch(filePath);
    if (!res.ok) throw new Error(`${res.status} — ${filePath}`);
    let raw = await res.text();

    // Strip YAML front matter
    if (raw.startsWith('---')) {
      const end = raw.indexOf('---', 3);
      if (end !== -1) raw = raw.slice(end + 3).trim();
    }

    // Render markdown
    body.innerHTML = marked.parse(raw);

    // Syntax highlight
    body.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));

    // Mermaid
    body.querySelectorAll('code.language-mermaid').forEach(el => {
      const pre = el.closest('pre');
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = el.textContent;
      pre.replaceWith(div);
    });
    mermaid.init(undefined, body.querySelectorAll('.mermaid'));

    // Breadcrumb
    renderBreadcrumb(hash);

    // Complete button
    updateCompleteBtn(hash);

    // Prev/Next
    updateNavButtons(hash);

    // Scroll to top
    window.scrollTo(0, 0);

  } catch (e) {
    body.innerHTML = `<p style="color:var(--danger)">콘텐츠를 불러올 수 없습니다. (${e.message})</p>`;
  }
}

/* ─── Breadcrumb ─── */
function renderBreadcrumb(hash) {
  const parts = hash.split('/');
  if (!state.manifest) return;

  let breadHTML = `<a href="#">홈</a><span class="breadcrumb-sep">›</span>`;
  if (parts.length >= 3) {
    const subj = state.manifest.subjects.find(s => s.id === parts[0]);
    const chap = subj?.chapters.find(c => c.id === parts[1]);
    const topic = chap?.topics.find(t => t.id === parts[2]);
    if (subj) breadHTML += `<span>${subj.title}</span><span class="breadcrumb-sep">›</span>`;
    if (chap) breadHTML += `<span>${chap.title}</span><span class="breadcrumb-sep">›</span>`;
    if (topic) breadHTML += `<span>${topic.title}</span>`;
  } else if (parts[0] === 'exam' || parts[0] === 'guide') {
    breadHTML += `<span>${parts[1] || parts[0]}</span>`;
  }

  $('breadcrumb').innerHTML = breadHTML;
  $('breadcrumb').querySelectorAll('a').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); location.hash = ''; showHome(); });
  });
}

/* ─── Complete Button ─── */
function updateCompleteBtn(hash) {
  const btn = $('completeBtn');
  const done = !!state.progress[hash];
  btn.textContent = done ? '✅ 완료됨' : '✅ 학습 완료';
  btn.classList.toggle('done', done);
  btn.onclick = () => {
    state.progress[hash] = !state.progress[hash];
    saveProgress();
    updateCompleteBtn(hash);
    updateGlobalProgress();
    renderSidebar();
    updateActiveNavItem(hash);
  };
}

/* ─── Prev / Next ─── */
function updateNavButtons(hash) {
  const idx  = state.allTopics.findIndex(t => t.hash === hash);
  const prev = $('prevBtn');
  const next = $('nextBtn');
  prev.disabled = idx <= 0;
  next.disabled = idx >= state.allTopics.length - 1;
  prev.onclick = () => { if (idx > 0) location.hash = state.allTopics[idx - 1].hash; };
  next.onclick = () => { if (idx < state.allTopics.length - 1) location.hash = state.allTopics[idx + 1].hash; };
}

/* ─── Active nav highlight ─── */
function updateActiveNavItem(hash) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.hash === hash);
    if (el.dataset.hash === hash) el.classList.toggle('completed', !!state.progress[hash]);
  });
}

/* ─── Show home ─── */
function showHome() {
  $('homeScreen').classList.remove('hidden');
  $('contentViewer').classList.add('hidden');
  renderHome();
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}

/* ─── Hash routing ─── */
function onHashChange() {
  const hash = location.hash.slice(1);
  if (!hash) { showHome(); return; }
  state.currentHash = hash;
  loadContent(hash);
  updateActiveNavItem(hash);
}

/* ─── Sidebar mobile ─── */
function closeSidebar() {
  $('sidebar').classList.remove('open');
  $('sidebarOverlay').classList.remove('visible');
}
$('menuToggle').addEventListener('click', () => {
  $('sidebar').classList.toggle('open');
  $('sidebarOverlay').classList.toggle('visible');
});
$('sidebarOverlay').addEventListener('click', closeSidebar);

/* ─── Section toggle for exam nav ─── */
document.querySelectorAll('.sidebar-section-title[data-target]').forEach(btn => {
  btn.addEventListener('click', () => toggleSection(btn.dataset.target, btn));
});

/* ─── Search ─── */
$('searchInput').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.nav-item').forEach(el => {
    if (!q) { el.classList.remove('search-hidden', 'search-match'); return; }
    const match = el.textContent.toLowerCase().includes(q);
    el.classList.toggle('search-hidden', !match);
    el.classList.toggle('search-match', match);
    if (match) {
      // Expand parent section
      const list = el.closest('.sidebar-section-list');
      if (list) {
        list.classList.remove('collapsed');
        const btn = document.querySelector(`[data-target="${list.id}"]`);
        if (btn) btn.querySelector('.toggle-arrow')?.classList.remove('collapsed');
      }
    }
  });
});

/* ─── Init ─── */
async function init() {
  loadProgress();
  await loadManifest();
  buildTopicList();
  renderSidebar();
  updateGlobalProgress();
  window.addEventListener('hashchange', onHashChange);
  onHashChange();
}

init().catch(console.error);
