/* ==========================================================
   skills.js — the interactive skill inspector in About
   ========================================================== */

/* ---------- About: skill inspector ---------- */
const P = { sportzle: 'Intel Sportzle', laundry: 'CML Laundry', salrc: 'SALRC', helpdesk: 'Academic Helpdesk', site: 'This portfolio' };
const ALL4 = ['sportzle', 'laundry', 'salrc', 'helpdesk'];
const SKILLS = [
  { g: 'Skills', items: [
    ['HTML', '</>', 'The structure of every page I build, written to be clean and readable.', [...ALL4, 'site']],
    ['CSS', '{ }', 'Layouts, animations and responsive design that work on phones and laptops.', [...ALL4, 'site']],
    ['JavaScript', 'JS', 'Interactions, modals, live updates and the 3D device on this site.', ['sportzle', 'salrc', 'helpdesk', 'site']],
    ['PHP', 'php', 'The backend of all four systems: logins, forms, reports and business rules.', ALL4],
    ['MySQL', 'DB', 'Databases for users, records and transactions behind every system.', ALL4],
    ['Web development', 'www', 'Planning, building and putting complete web systems online.', [...ALL4, 'site']],
    ['Database management', 'SQL', 'Designing tables, relationships and queries that keep data organized.', ALL4],
    ['System testing', '✓', 'Checking each feature and flow before people use it.', ALL4],
    ['UI/UX design', 'UX', 'Clean, easy-to-use screens, planned before I start coding.', [...ALL4, 'site']],
  ] },
  { g: 'Tools', items: [
    ['VS Code', 'VS', 'My main editor for every project.', [...ALL4, 'site']],
    ['Laragon', 'L', 'Local server for running and testing PHP projects.', ALL4],
    ['phpMyAdmin', 'pma', 'Managing MySQL databases, tables and data.', ALL4],
    ['Git and GitHub', 'git', 'Version control and hosting for my code and this portfolio.', ['laundry', 'site']],
    ['Figma', '✎', 'UI mockups and layouts before coding.', []],
    ['Canva', 'Cv', 'Visuals, graphics and presentation materials.', []],
  ] },
  { g: 'How I work', items: [
    ['Communication', '💬', 'I explain ideas clearly and keep the team updated.', []],
    ['Problem-solving', '?!', 'I break problems down and debug step by step until it works.', []],
    ['Teamwork', '⇄', 'I work well with others and share tasks fairly.', []],
    ['Time management', '⏱', 'I plan my tasks and finish them on time.', []],
    ['Adaptability', '↻', "I learn new tools and approaches quickly when they're needed.", []],
  ] },
];
function setupSkills() {
  const groups = $('#skillGroups'); if (!groups) return;
  let n = 0;
  groups.innerHTML = SKILLS.map((grp, gi) => `<div class="box"><p class="box__k"><span>0${gi + 1}</span> ${grp.g}<em>${grp.items.length}</em></p><ul class="chips chips--big sk-chips">${grp.items.map(([name, glyph]) => `<li><button type="button" class="sk" data-sk="${n}" style="--d:${n++}"><b>${escapeHtml(glyph)}</b>${escapeHtml(name)}</button></li>`).join('')}</ul></div>`).join('');
  const flat = SKILLS.flatMap((grp) => grp.items.map((it, i) => ({ g: grp.g, i: i + 1, name: it[0], glyph: it[1], desc: it[2], used: it[3] })));
  const box = $('#inspect'), timerBar = $('#insTimer');
  let cur = -1, auto = true, t = null;
  const show = (k, user) => {
    const s = flat[k]; if (!s) return;
    cur = k;
    $$('.sk', groups).forEach(b => b.classList.toggle('is-on', +b.dataset.sk === k));
    box.classList.remove('is-swap'); void box.offsetWidth; box.classList.add('is-swap');
    $('#insGlyph').textContent = s.glyph;
    $('#insGroup').textContent = s.g + ' · ' + String(s.i).padStart(2, '0');
    $('#insName').textContent = s.name;
    $('#insDesc').textContent = s.desc;
    const soft = s.g === 'How I work';
    $('#insK').textContent = soft ? 'Where it shows' : s.used.length ? 'Used in' : 'Used for';
    $('#insList').innerHTML = soft ? '<span class="ins-chip ins-chip--soft">Group projects, school work and every system I built</span>'
      : s.used.length ? s.used.map((u, i) => u === 'site' ? `<span class="ins-chip" style="--d:${i}">${P[u]}</span>` : `<button type="button" class="ins-chip" data-proj="${u}" style="--d:${i}">${P[u]} <span aria-hidden="true">↗</span></button>`).join('')
      : '<span class="ins-chip ins-chip--soft">Design and planning work</span>';
    if (user) { auto = false; box.classList.add('is-manual'); Sound.select(); }
    restart();
  };
  const restart = () => {
    clearTimeout(t);
    timerBar.style.transition = 'none'; timerBar.style.width = '0'; void timerBar.offsetWidth;
    if (!auto || reduceMotion()) return;
    timerBar.style.transition = 'width 3.6s linear'; timerBar.style.width = '100%';
    t = setTimeout(() => { if (auto && !$('#view-about').hidden) show((cur + 1) % flat.length); }, 3600);
  };
  groups.addEventListener('click', (e) => { const b = e.target.closest('.sk'); if (b) show(+b.dataset.sk, true); });
  groups.addEventListener('pointerover', (e) => { if (e.target.closest('.sk')) Sound.tick(); });
  $('#insList').addEventListener('click', (e) => { const b = e.target.closest('[data-proj]'); if (b) openProject(b.dataset.proj); });
  document.addEventListener('viewopen', (e) => {
    if (e.detail !== 'about') return;
    groups.classList.remove('is-in'); void groups.offsetWidth; groups.classList.add('is-in');
    if (auto) show(cur < 0 ? 3 : cur); else restart();
  });
  show(3);
}
document.addEventListener('DOMContentLoaded', setupSkills);
