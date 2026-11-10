/* Masar prototype — front-end only. State lives in memory; reload resets it. */
const S = { lang: 'ar', role: 'admin', q: '', stage: 'all', step: 'all', view: 'table', page: 1, tab: 'procs', period: CUR_MONTH, expType: 'all', expPaid: 'all' };
try { S.lang = localStorage.getItem('masar-lang') || 'ar'; } catch (e) { /* storage blocked */ }

const L = (ar, en) => (S.lang === 'ar' ? ar : en);
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
const usd = x => x.amount / RATES[x.cur];
const money = v => (v < 0 ? '−' : '') + '$' + Math.abs(Math.round(v)).toLocaleString('en-US');
const amt = (a, c) => `${Number(a).toLocaleString('en-US')} ${c}`;
const num = s => `<span class="num">${esc(s)}</span>`;
const lbl = o => (o ? L(o.ar, o.en) : '');
const byK = (list, k) => list.find(x => x.k === k);
const AR_M = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const EN_M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const mName = m => (m.length === 4 ? L('سنة ', 'Year ') + m : L(AR_M, EN_M)[+m.slice(5) - 1] + ' ' + m.slice(0, 4));

const ROLES = {
  admin: { ar: 'مدير النظام', en: 'Admin', nav: ['dash', 'apps', 'aexp', 'office', 'fin', 'reports', 'users'], ops: true, fin: true, seeFin: true },
  accountant: { ar: 'محاسب', en: 'Accountant', nav: ['dash', 'apps', 'aexp', 'office', 'fin', 'reports'], ops: false, fin: true, seeFin: true },
  hr: { ar: 'موارد بشرية / تشغيل', en: 'HR / Operations', nav: ['dash', 'apps', 'reports'], ops: true, fin: false, seeFin: false },
  viewer: { ar: 'مشاهدة فقط', en: 'Viewer', nav: ['dash', 'apps', 'reports'], ops: false, fin: false, seeFin: false },
};
const can = () => ROLES[S.role];
const me = () => USERS.find(u => u.role === S.role);

const NAV = {
  dash: { ar: 'لوحة التحكم', en: 'Dashboard', i: 'M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10' },
  apps: { ar: 'العاملات', en: 'Applicants', i: 'M16 19v-1a4 4 0 00-8 0v1M12 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM20 19v-1a3 3 0 00-2-2.8M4 19v-1a3 3 0 012-2.8' },
  aexp: { ar: 'مصاريف العاملات', en: 'Applicant expenses', i: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6' },
  office: { ar: 'مصاريف المكتب', en: 'Office expenses', i: 'M4 21V5l8-2v18M12 9h8v12M7 9h2M7 13h2M15 13h2M15 17h2M3 21h18' },
  fin: { ar: 'الحسابات', en: 'Finance', i: 'M12 3v18M16 7.5c0-1.5-1.8-2.5-4-2.5s-4 1-4 3 2 2.700 4 3 4 1 4 3-1.800 3-4 3-4-1-4-2.500' },
  reports: { ar: 'التقارير', en: 'Reports', i: 'M5 20V10M10 20V4M15 20v-7M20 20V8' },
  users: { ar: 'المستخدمون والصلاحيات', en: 'Users & permissions', i: 'M12 3l7 3v5c0 4.500-3 8-7 10-4-2-7-5.500-7-10V6zM9.500 12l2 2 3.500-4' },
};
const STATUS = {
  done: { ar: 'مكتمل', en: 'Completed' }, progress: { ar: 'جارٍ', en: 'In Progress' }, pending: { ar: 'لم يبدأ', en: 'Pending' },
  expired: { ar: 'منتهي', en: 'Expired' }, na: { ar: 'غير مطلوب', en: 'Not Required' },
};
const STAGES = {
  registered: { ar: 'مسجّلة', en: 'Registered' }, processing: { ar: 'تحت الإجراء', en: 'In process' },
  ready: { ar: 'جاهزة للسفر', en: 'Ready to fly' }, deployed: { ar: 'سافرت', en: 'Deployed' },
};
const MARITAL = { single: { ar: 'عزباء', en: 'Single' }, married: { ar: 'متزوجة', en: 'Married' }, widowed: { ar: 'أرملة', en: 'Widowed' }, separated: { ar: 'منفصلة', en: 'Separated' } };
const RELIGION = { christian: { ar: 'مسيحية', en: 'Christian' }, muslim: { ar: 'مسلمة', en: 'Muslim' } };
const EDU = { highschool: { ar: 'ثانوي', en: 'High school' }, college: { ar: 'جامعي', en: 'College' }, vocational: { ar: 'تعليم مهني', en: 'Vocational' }, elementary: { ar: 'ابتدائي', en: 'Elementary' } };
const KIN = { mother: { ar: 'الأم', en: 'Mother' }, sister: { ar: 'الأخت', en: 'Sister' }, brother: { ar: 'الأخ', en: 'Brother' }, husband: { ar: 'الزوج', en: 'Husband' }, other: { ar: 'أخرى', en: 'Other' } };
const RECUR = { monthly: { ar: 'شهري', en: 'Monthly' }, yearly: { ar: 'سنوي', en: 'Yearly' }, once: { ar: 'مرة واحدة', en: 'One-time' } };

/* ---------- derived data ---------- */
const isClosed = p => p.status === 'done' || p.status === 'na';
function stageOf(a) {
  if (a.travel) return 'deployed';
  if (a.procs.every(isClosed)) return 'ready';
  return a.procs.some(p => p.status !== 'pending') ? 'processing' : 'registered';
}
const currentStep = a => a.procs.findIndex(p => !isClosed(p));
// Which procedure she is waiting at, and for how many days
function stepInfo(a) {
  const i = currentStep(a); if (i < 0) return null;
  const p = a.procs[i], since = p.date || a.procs.slice(0, i).map(x => x.date).filter(Boolean).pop() || a.registered;
  const days = Math.max(0, daysBetween(since, TODAY));
  return { i, p, days, late: p.status === 'expired' || days > 14 };
}
function passportState(a) {
  const left = daysBetween(TODAY, a.passportExpiry);
  if (left < 0) return { left, cls: 'expired', text: L('منتهي', 'Expired') };
  if (left < 180) return { left, cls: 'expired', text: L(`باقي ${left} يوم — أقل من 6 شهور`, `${left} days left — under 6 months`) };
  if (left < 365) return { left, cls: 'progress', text: L(`باقي ${Math.round(left / 30)} شهر`, `${Math.round(left / 30)} months left`) };
  return { left, cls: 'done', text: L(`صالح ${(left / 365).toFixed(1)} سنة`, `Valid ${(left / 365).toFixed(1)} years`) };
}
const initials = n => n.split(' ').map(w => w[0]).slice(0, 2).join('');
const appCost = id => sum(EXPENSES.filter(e => e.appId === id), usd);
const findApp = id => APPLICANTS.find(a => a.id === id);
function fin(period) {
  const inP = d => d && d.startsWith(period);
  const rev = sum(REVENUE.filter(x => x.received && inP(x.date)), usd);
  const ae = sum(EXPENSES.filter(x => x.paid && inP(x.date)), usd);
  const oe = sum(OFFICE.filter(x => x.paid && inP(x.paidDate)), usd);
  return { rev, ae, oe, net: rev - ae - oe };
}
function alerts() {
  const out = [];
  APPLICANTS.forEach(a => {
    if (a.travel) return;
    a.procs.forEach(p => {
      const name = lbl(byK(PROCS, p.k));
      if (p.status === 'expired') out.push({ sev: 2, a, text: L(`انتهت صلاحية ${name}`, `${name} expired`), date: p.expiry });
      else if (p.status === 'progress' && daysBetween(p.date, TODAY) > 14) out.push({ sev: 1, a, text: L(`${name} متأخر ${daysBetween(p.date, TODAY)} يوم`, `${name} overdue by ${daysBetween(p.date, TODAY)} days`), date: p.date });
    });
    const left = daysBetween(TODAY, a.passportExpiry);
    if (left < 210) out.push({ sev: left < 180 ? 2 : 1, a, text: L(`جواز السفر ينتهي خلال ${left} يوم`, `Passport expires in ${left} days`), date: a.passportExpiry });
  });
  return out.sort((x, y) => y.sev - x.sev || x.date.localeCompare(y.date));
}
function audit(ar, en, ref = '') { LOG.unshift({ at: TODAY + ' ' + new Date().toTimeString().slice(0, 5), user: me().name, ar, en, ref }); }

/* ---------- small UI pieces ---------- */
const icon = d => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.700" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const chip = (cls, text) => `<span class="chip c-${cls}">${esc(text)}</span>`;
const track = a => `<span class="trk" role="img" aria-label="${a.procs.filter(isClosed).length}/8">${a.procs.map(p => `<i class="s-${p.status}" title="${esc(lbl(byK(PROCS, p.k)) + ' — ' + lbl(STATUS[p.status]))}"></i>`).join('')}</span>`;
const opts = (list, sel) => list.map(([v, t]) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(t)}</option>`).join('');
const head = (title, sub, actions = '') => `<header class="phead"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div><div class="actions no-print">${actions}</div></header>`;
const exportBtns = name => `<button class="btn" data-act="csv" data-name="${name}">${L('تصدير Excel', 'Export Excel')}</button><button class="btn" data-act="print">${L('تصدير PDF', 'Export PDF')}</button>`;
const empty = text => `<div class="empty">${text}</div>`;

function toast(text) {
  const t = $('#toast'); t.textContent = text; t.classList.add('on');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2600);
}
function exportCSV(name) {
  const table = $('main table'); if (!table) return;
  const rows = [...table.querySelectorAll('tr')].map(tr => [...tr.children].map(td => `"${td.innerText.replace(/\s+/g, ' ').trim().replace(/"/g, '""')}"`).join(','));
  const url = URL.createObjectURL(new Blob(['﻿' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `${name}-${TODAY}.csv` });
  a.click(); URL.revokeObjectURL(url);
  toast(L('تم تنزيل الملف — يفتح مباشرة في Excel', 'File downloaded — opens directly in Excel'));
}
function openForm(title, fields, onSave) {
  const d = $('#dlg');
  d.innerHTML = `<form class="form"><h3>${title}</h3><div class="fgrid">${fields.map(f => f.h ? `<h4 class="wide">${f.h}</h4>` : `<label class="${f.wide ? 'wide' : ''}"><span>${f.label}</span>${f.type === 'select'
    ? `<select name="${f.k}">${opts(f.options, f.val)}</select>`
    : `<input name="${f.k}" type="${f.type || 'text'}"${f.req ? ' required' : ''}${f.type === 'number' ? ' min="0" step="any"' : ''}${f.type === 'file' ? ' accept="image/*,.pdf"' : ` value="${esc(f.val ?? '')}"`}>`}</label>`).join('')}</div>
    <div class="factions"><button type="button" class="btn" data-act="close">${L('إلغاء', 'Cancel')}</button><button class="btn primary">${L('حفظ', 'Save')}</button></div></form>`;
  d.querySelector('form').onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target), o = {};
    fields.filter(f => f.k).forEach(f => { o[f.k] = f.type === 'file' ? (fd.get(f.k)?.name || '') : fd.get(f.k); });
    onSave(o); d.close(); render();
  };
  d.showModal();
}

/* ---------- views ---------- */
function vDash() {
  const c = can(), st = { registered: 0, processing: 0, ready: 0, deployed: 0 };
  APPLICANTS.forEach(a => st[stageOf(a)]++);
  const regMonth = APPLICANTS.filter(a => a.registered.startsWith(CUR_MONTH)).length;
  const flewMonth = APPLICANTS.filter(a => a.travel.startsWith(CUR_MONTH)).length;
  const at = PROCS.map((p, i) => APPLICANTS.filter(a => !a.travel && currentStep(a) === i).length);
  const maxAt = Math.max(...at, 1);
  const al = alerts();
  const kpi = (v, label, note, cls = '') => `<div class="kpi ${cls}"><b>${v}</b><span>${label}</span><small>${note}</small></div>`;

  let finHtml = '';
  if (c.seeFin) {
    const f = fin(CUR_MONTH), series = MONTHS.map(m => ({ m, ...fin(m) }));
    const max = Math.max(...series.map(s => Math.max(s.rev, s.ae + s.oe)), 1);
    const payable = sum(EXPENSES.filter(e => !e.paid), usd) + sum(OFFICE.filter(e => !e.paid), usd);
    const receivable = sum(REVENUE.filter(e => !e.received), usd);
    finHtml = `<section class="card"><div class="chead"><h2>${L('الصورة المالية', 'Money')} — ${mName(CUR_MONTH)}</h2><a href="#/fin">${L('فتح الحسابات', 'Open finance')}</a></div>
      <div class="money">
        <div><span>${L('الإيرادات المحصّلة', 'Revenue received')}</span><b>${money(f.rev)}</b></div>
        <div><span>${L('مصاريف العاملات', 'Applicant expenses')}</span><b>${money(f.ae)}</b></div>
        <div><span>${L('مصاريف المكتب', 'Office expenses')}</span><b>${money(f.oe)}</b></div>
        <div class="net"><span>${L('صافي الربح', 'Net profit')}</span><b>${money(f.net)}</b></div>
        <div><span>${L('مستحق علينا', 'We owe')}</span><b class="neg">${money(payable)}</b></div>
        <div><span>${L('مستحق لنا من العملاء', 'Clients owe us')}</span><b class="pos">${money(receivable)}</b></div>
      </div>
      <div class="bars" role="img" aria-label="${L('الإيرادات مقابل المصروفات آخر 6 شهور', 'Revenue vs expenses, last 6 months')}">${series.map(s => `<div class="bcol"><div class="bpair"><i class="b-rev" style="height:${s.rev / max * 100}%" title="${money(s.rev)}"></i><i class="b-exp" style="height:${(s.ae + s.oe) / max * 100}%" title="${money(s.ae + s.oe)}"></i></div><span>${L(AR_M, EN_M)[+s.m.slice(5) - 1]}</span></div>`).join('')}</div>
      <div class="legend"><span><i class="b-rev"></i>${L('إيرادات', 'Revenue')}</span><span><i class="b-exp"></i>${L('مصروفات', 'Expenses')}</span><span class="muted">${L('كل الأرقام بالدولار حسب آخر سعر صرف', 'All figures in USD at the latest rate')}</span></div>
    </section>`;
  }

  return head(L('لوحة التحكم', 'Dashboard'), `${mName(CUR_MONTH)} · ${L('اليوم', 'Today')} ${num(TODAY)}`) + `
    <div class="kpis">
      ${kpi(regMonth, L('مسجّلات هذا الشهر', 'Registered this month'), L(`من ${APPLICANTS.length} إجمالاً`, `of ${APPLICANTS.length} in total`))}
      ${kpi(st.processing + st.registered, L('تحت الإجراء', 'In process'), L('ملفات مفتوحة الآن', 'open files right now'), 'k-prog')}
      ${kpi(st.ready, L('استكملن الإجراءات', 'Procedures complete'), L('في انتظار موعد السفر', 'waiting for the flight'), 'k-ready')}
      ${kpi(st.deployed, L('سافرن', 'Deployed'), L(`${flewMonth} هذا الشهر`, `${flewMonth} this month`), 'k-done')}
    </div>
    <div class="two">
      <section class="card"><div class="chead"><h2>${L('أين تقف الملفات الآن', 'Where files are right now')}</h2></div>
        <p class="muted small">${L('عدد العاملات المنتظرات عند كل إجراء، بترتيب الرحلة من مانيلا إلى الرياض.', 'Applicants waiting at each procedure, in route order from Manila to Riyadh.')}</p>
        <ol class="route-bars">${PROCS.map((p, i) => `<li><span>${lbl(p)}</span><div class="rb"><i style="width:${at[i] / maxAt * 100}%"></i></div><b>${at[i]}</b></li>`).join('')}</ol>
      </section>
      <section class="card"><div class="chead"><h2>${L('يحتاج متابعة', 'Needs attention')} <em class="count">${al.length}</em></h2></div>
        ${al.length ? `<ul class="alerts">${al.slice(0, 8).map(x => `<li class="sev${x.sev}"><a href="#/app/${x.a.id}"><b>${esc(x.a.name)}</b> ${num(x.a.id)}<span>${esc(x.text)}</span></a></li>`).join('')}</ul>${al.length > 8 ? `<p class="muted small">${L(`و${al.length - 8} تنبيهات أخرى في صفحة التقارير.`, `Plus ${al.length - 8} more in Reports.`)}</p>` : ''}` : empty(L('لا توجد إجراءات متأخرة.', 'Nothing is overdue.'))}
      </section>
    </div>${finHtml}`;
}

function appsFiltered() {
  const q = S.q.trim().toLowerCase();
  return APPLICANTS.filter(a => (S.stage === 'all' || stageOf(a) === S.stage) && (S.step === 'all' || (!a.travel && currentStep(a) === +S.step)) && (!q || a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.passport.toLowerCase().includes(q)))
    .sort((a, b) => b.id.localeCompare(a.id));
}
function appsTable() {
  const list = appsFiltered(), per = 12, pages = Math.max(1, Math.ceil(list.length / per));
  S.page = Math.min(S.page, pages);
  const rows = list.slice((S.page - 1) * per, S.page * per);
  if (!list.length) return empty(L('لا توجد نتائج. جرّبي اسماً آخر أو امسحي الفلتر.', 'No matches. Try another name or clear the filter.'));
  if (S.view === 'board') return appsBoard(list);
  const where = a => {
    const si = stepInfo(a);
    if (a.travel) return `${L('سافرت', 'Travelled')} ${num(a.travel)}`;
    if (!si) return L('في انتظار موعد السفر', 'Waiting for flight date');
    return `<b>${esc(lbl(PROCS[si.i]))}</b><small class="${si.late ? 'neg' : 'muted'}">${si.p.status === 'expired' ? L('الصلاحية منتهية', 'validity expired') : L(`منذ ${si.days} يوم`, `${si.days} days`)}</small>`;
  };
  return `<div class="twrap"><table><thead><tr><th>${L('الرقم', 'ID')}</th><th>${L('الاسم', 'Name')}</th><th>${L('السن', 'Age')}</th><th>${L('التليفون', 'Phone')}</th><th>${L('الجواز / الانتهاء', 'Passport / expiry')}</th><th>${L('المرحلة الحالية', 'Current stage')}</th><th>${L('مسار الإجراءات', 'Procedure track')}</th><th>${L('الحالة', 'Status')}</th>${can().seeFin ? `<th class="r">${L('التكلفة', 'Cost')}</th>` : ''}</tr></thead>
    <tbody>${rows.map(a => { const s = stageOf(a), ps = passportState(a); return `<tr data-href="#/app/${a.id}" tabindex="0"><td>${num(a.id)}</td><td><span class="who2"><i class="avatar sm">${esc(initials(a.name))}</i><b>${esc(a.name)}</b></span></td><td>${a.age}</td><td>${num(a.phone)}</td><td>${num(a.passport)}<small class="${ps.cls === 'expired' ? 'neg' : 'muted'}">${num(a.passportExpiry)}</small></td><td class="where">${where(a)}</td><td>${track(a)}</td><td>${chip(s, lbl(STAGES[s]))}</td>${can().seeFin ? `<td class="r">${num(money(appCost(a.id)))}</td>` : ''}</tr>`; }).join('')}</tbody></table></div>
    <div class="pager no-print"><span class="muted">${L(`${list.length} عاملة`, `${list.length} applicants`)}</span><button class="btn" data-act="page" data-d="-1"${S.page === 1 ? ' disabled' : ''}>${L('السابق', 'Previous')}</button><span>${S.page} / ${pages}</span><button class="btn" data-act="page" data-d="1"${S.page === pages ? ' disabled' : ''}>${L('التالي', 'Next')}</button></div>`;
}
function appsBoard(list) {
  const open = list.filter(a => !a.travel);
  const cols = [...PROCS.map((p, i) => ({ title: lbl(p), items: open.filter(a => currentStep(a) === i) })), { title: L('جاهزة للسفر', 'Ready to fly'), items: open.filter(a => currentStep(a) < 0), ready: true }];
  return `<div class="board">${cols.map(c => `<section class="bcolm${c.ready ? ' ready' : ''}"><h3>${esc(c.title)} <em>${c.items.length}</em></h3>
    ${c.items.map(a => { const si = stepInfo(a); return `<a class="bcard${si?.late ? ' late' : ''}" href="#/app/${a.id}"><b>${esc(a.name)}</b><span>${num(a.id)}${si ? ` · ${si.p.status === 'expired' ? L('منتهي', 'expired') : L(`${si.days} يوم`, `${si.days}d`)}` : ''}</span></a>`; }).join('') || `<p class="muted small">${L('لا أحد هنا', 'No one here')}</p>`}</section>`).join('')}</div>
    <p class="muted small pad">${L('اللوحة تعرض الملفات المفتوحة فقط. البطاقة الحمراء = متأخرة أكثر من 14 يوماً أو صلاحية منتهية.', 'The board shows open files only. A red card means more than 14 days waiting or an expired document.')}</p>`;
}
function appFields(a = {}) {
  const sel = (map) => Object.entries(map).map(([k, v]) => [k, lbl(v)]);
  return [
    { h: L('البيانات الشخصية', 'Personal details') },
    { k: 'name', label: L('الاسم كما في الجواز', 'Name as in passport'), req: true, wide: true, val: a.name },
    { k: 'dob', label: L('تاريخ الميلاد', 'Date of birth'), type: 'date', req: true, val: a.dob }, { k: 'birthplace', label: L('محل الميلاد', 'Place of birth'), val: a.birthplace },
    { k: 'marital', label: L('الحالة الاجتماعية', 'Marital status'), type: 'select', options: sel(MARITAL), val: a.marital }, { k: 'children', label: L('عدد الأبناء', 'Children'), type: 'number', val: a.children ?? 0 },
    { k: 'religion', label: L('الديانة', 'Religion'), type: 'select', options: sel(RELIGION), val: a.religion }, { k: 'education', label: L('المؤهل', 'Education'), type: 'select', options: sel(EDU), val: a.education },
    { k: 'height', label: L('الطول (سم)', 'Height (cm)'), type: 'number', val: a.height }, { k: 'weight', label: L('الوزن (كجم)', 'Weight (kg)'), type: 'number', val: a.weight },
    { h: L('التواصل', 'Contact') },
    { k: 'phone', label: L('رقم التليفون', 'Phone'), val: a.phone }, { k: 'address', label: L('العنوان', 'Address'), val: a.address },
    { k: 'emgName', label: L('شخص للطوارئ', 'Emergency contact'), val: a.emgName }, { k: 'emgRel', label: L('صلة القرابة', 'Relationship'), type: 'select', options: sel(KIN), val: a.emgRel },
    { k: 'emgPhone', label: L('تليفون الطوارئ', 'Emergency phone'), val: a.emgPhone, wide: true },
    { h: L('جواز السفر', 'Passport') },
    { k: 'passport', label: L('رقم جواز السفر', 'Passport no.'), req: true, val: a.passport }, { k: 'passportPlace', label: L('جهة الإصدار', 'Issued at'), val: a.passportPlace },
    { k: 'passportIssue', label: L('تاريخ الإصدار', 'Issue date'), type: 'date', val: a.passportIssue }, { k: 'passportExpiry', label: L('تاريخ الانتهاء', 'Expiry date'), type: 'date', req: true, val: a.passportExpiry },
    { k: 'passportScan', label: L('صورة الجواز', 'Passport scan'), type: 'file', wide: true },
    { h: L('العمل', 'Work') },
    { k: 'experience', label: L('سنوات الخبرة بالخارج', 'Years of experience abroad'), type: 'number', val: a.experience ?? 0 }, { k: 'expCountry', label: L('بلد الخبرة السابقة', 'Previous country'), val: a.expCountry },
    { k: 'client', label: L('العميل / المكتب', 'Client office'), type: 'select', options: CLIENTS.map(c => [c, c]), wide: true, val: a.client },
  ];
}
function cleanApp(o) {
  ['children', 'height', 'weight', 'experience'].forEach(k => { o[k] = o[k] === '' ? '' : +o[k]; });
  o.age = Math.floor(daysBetween(o.dob, TODAY) / 365.25);
  if (!o.passportScan) delete o.passportScan;
  return o;
}
function dataTab(a) {
  const v = x => (x === '' || x == null ? '—' : x), row = (k, val) => `<div><dt>${k}</dt><dd>${val}</dd></div>`, ps = passportState(a);
  const sec = (t, rows) => `<h3 class="sec">${t}</h3><dl class="facts">${rows.join('')}</dl>`;
  return sec(L('البيانات الشخصية', 'Personal details'), [row(L('الاسم', 'Name'), esc(a.name)), row(L('تاريخ الميلاد', 'Date of birth'), num(v(a.dob))), row(L('السن', 'Age'), a.age), row(L('محل الميلاد', 'Place of birth'), esc(v(a.birthplace))), row(L('الجنسية', 'Nationality'), L('فلبينية', 'Filipino')), row(L('الحالة الاجتماعية', 'Marital status'), v(lbl(MARITAL[a.marital]))), row(L('عدد الأبناء', 'Children'), v(a.children)), row(L('الديانة', 'Religion'), v(lbl(RELIGION[a.religion]))), row(L('المؤهل', 'Education'), v(lbl(EDU[a.education]))), row(L('الطول / الوزن', 'Height / weight'), a.height ? num(`${a.height} cm / ${a.weight} kg`) : '—')])
    + sec(L('التواصل', 'Contact'), [row(L('رقم التليفون', 'Phone'), num(v(a.phone))), row(L('العنوان', 'Address'), esc(v(a.address))), row(L('شخص للطوارئ', 'Emergency contact'), `${esc(v(a.emgName))}${a.emgRel ? ` (${lbl(KIN[a.emgRel])})` : ''}`), row(L('تليفون الطوارئ', 'Emergency phone'), num(v(a.emgPhone)))])
    + sec(L('جواز السفر', 'Passport'), [row(L('رقم الجواز', 'Passport no.'), num(a.passport)), row(L('جهة الإصدار', 'Issued at'), esc(v(a.passportPlace))), row(L('تاريخ الإصدار', 'Issue date'), num(v(a.passportIssue))), row(L('تاريخ الانتهاء', 'Expiry date'), `${num(a.passportExpiry)} ${chip(ps.cls, ps.text)}`), row(L('صورة الجواز', 'Passport scan'), `<span class="file">${esc(a.passportScan || `passport-${a.id}.jpg`)}</span>`)])
    + sec(L('العمل والتسجيل', 'Work & registration'), [row(L('الوظيفة', 'Position'), L('عاملة منزلية', 'Domestic helper')), row(L('الخبرة بالخارج', 'Experience abroad'), a.experience ? L(`${a.experience} سنوات — ${a.expCountry}`, `${a.experience} years — ${a.expCountry}`) : L('بدون خبرة سابقة', 'First-timer')), row(L('العميل / المكتب', 'Client office'), esc(a.client)), row(L('تاريخ التسجيل', 'Registered'), num(a.registered)), row(L('أضيف بواسطة', 'Added by'), esc(a.by))]);
}
function vApps() {
  const counts = { all: APPLICANTS.length }; APPLICANTS.forEach(a => { const s = stageOf(a); counts[s] = (counts[s] || 0) + 1; });
  const segs = [['all', L('الكل', 'All')], ...Object.entries(STAGES).map(([k, v]) => [k, lbl(v)])];
  return head(L('العاملات', 'Applicants'), L('ملف مستقل لكل عاملة برقم تعريفي، مع مسار إجراءاتها حتى السفر.', 'One file per applicant with her own ID and her procedure track through to travel.'),
    exportBtns('applicants') + (can().ops ? `<button class="btn primary" data-act="add-app">${L('تسجيل عاملة', 'Register applicant')}</button>` : '')) + `
    <div class="segs no-print" role="group" aria-label="${L('الحالة', 'Status')}">${segs.map(([k, t]) => `<button data-act="stage" data-v="${k}" aria-pressed="${S.stage === k}">${t} <em>${counts[k] || 0}</em></button>`).join('')}</div>
    <div class="toolbar no-print">
      <input id="q" type="search" value="${esc(S.q)}" placeholder="${L('بحث بالاسم أو الرقم التعريفي أو رقم الجواز', 'Search by name, ID or passport number')}" aria-label="${L('بحث', 'Search')}">
      <select id="step" aria-label="${L('المرحلة الحالية', 'Current stage')}">${opts([['all', L('واقفة عند أي إجراء', 'Waiting at any procedure')], ...PROCS.map((p, i) => [String(i), L('واقفة عند: ', 'Waiting at: ') + lbl(p)])], S.step)}</select>
      <span class="viewtog" role="group"><button data-act="view" data-v="table" aria-pressed="${S.view === 'table'}">${L('جدول', 'Table')}</button><button data-act="view" data-v="board" aria-pressed="${S.view === 'board'}">${L('لوحة المراحل', 'Stage board')}</button></span>
      <span class="trk-legend">${['done', 'progress', 'expired', 'pending', 'na'].map(k => `<span><i class="s-${k}"></i>${lbl(STATUS[k])}</span>`).join('')}</span>
    </div>
    <section class="card flush" id="apps-table">${appsTable()}</section>`;
}

function vApp(id) {
  const a = findApp(id), c = can();
  if (!a) return head(L('الملف غير موجود', 'File not found'), '') + empty(`<a href="#/apps">${L('العودة إلى قائمة العاملات', 'Back to applicants')}</a>`);
  const s = stageOf(a), cur = currentStep(a), exps = EXPENSES.filter(e => e.appId === a.id);
  const tabs = [['procs', L('الإجراءات والمستندات', 'Procedures & documents')], ...(c.seeFin ? [['exp', L('الحساب والمصاريف', 'Account & expenses')]] : []), ['data', L('البيانات الشخصية', 'Personal data')]];
  if (!tabs.some(t => t[0] === S.tab)) S.tab = 'procs';

  const route = `<div class="route" dir="ltr"><div class="port"><b>MNL</b><span>${num(a.registered)}</span></div>
    ${a.procs.map((p, i) => `<div class="stop s-${p.status}${i === cur ? ' here' : ''}"><i></i><span>${esc(lbl(byK(PROCS, p.k)))}</span></div>`).join('')}
    <div class="port ${a.travel ? 'arrived' : ''}"><b>RUH</b><span>${a.travel ? num(a.travel) : '—'}</span></div></div>`;

  let body = '';
  if (S.tab === 'procs') {
    body = `<div class="twrap"><table><thead><tr><th>${L('الإجراء', 'Procedure')}</th><th>${L('الحالة', 'Status')}</th><th>${L('تاريخ الإجراء', 'Date')}</th><th>${L('انتهاء الصلاحية', 'Valid until')}</th>${c.seeFin ? `<th class="r">${L('التكلفة', 'Cost')}</th>` : ''}<th>${L('المستند', 'Document')}</th></tr></thead><tbody>
      ${a.procs.map((p, i) => `<tr><td><b>${esc(lbl(byK(PROCS, p.k)))}</b></td>
        <td>${c.ops ? `<select class="st s-${p.status}" data-proc="${i}" aria-label="${L('الحالة', 'Status')}">${opts(Object.entries(STATUS).map(([k, v]) => [k, lbl(v)]), p.status)}</select>` : chip(p.status, lbl(STATUS[p.status]))}</td>
        <td>${p.date ? num(p.date) : '—'}</td><td>${p.expiry ? num(p.expiry) : '—'}</td>${c.seeFin ? `<td class="r">${p.status === 'na' ? '—' : num(amt(p.cost, p.cur))}</td>` : ''}
        <td>${p.file ? `<span class="file">${esc(p.file)}</span>` : ''}${c.ops ? `<label class="upload">${p.file ? L('استبدال', 'Replace') : L('رفع أو تصوير', 'Upload or scan')}<input type="file" accept="image/*,.pdf" data-up="${i}" hidden></label>` : (p.file ? '' : '—')}</td></tr>`).join('')}
      </tbody></table></div>`;
  } else if (S.tab === 'exp') {
    const total = sum(exps, usd), paid = sum(exps.filter(e => e.paid), usd);
    const rev = REVENUE.filter(r => r.appId === a.id), got = sum(rev.filter(r => r.received), usd);
    body = `<div class="money slim"><div><span>${L('إجمالي تكلفة العاملة', 'Total cost')}</span><b>${money(total)}</b></div><div><span>${L('مدفوع', 'Paid')}</span><b>${money(paid)}</b></div><div><span>${L('غير مدفوع', 'Unpaid')}</span><b class="neg">${money(total - paid)}</b></div><div><span>${L('محصّل من العميل', 'Received from client')}</span><b class="pos">${money(got)}</b></div></div>
      ${expTable(exps, false)}`;
  } else body = dataTab(a);
  const mine = LOG.filter(l => l.ref === a.id), si = stepInfo(a), ps = passportState(a), doneN = a.procs.filter(isClosed).length;
  const fact = (k, val) => `<div><dt>${k}</dt><dd>${val}</dd></div>`;
  const idcard = `<aside class="card idcard">
      <div class="idtop"><i class="avatar">${esc(initials(a.name))}</i><div><b>${esc(a.name)}</b>${num(a.id)}</div></div>
      <div class="now s-${si ? si.p.status : 'done'}"><span>${L('المرحلة الحالية', 'Current stage')}</span><b>${a.travel ? L('سافرت', 'Deployed') : si ? esc(lbl(PROCS[si.i])) : L('جاهزة للسفر', 'Ready to fly')}</b>
        <small>${a.travel ? num(a.travel) : si ? (si.p.status === 'expired' ? L('الصلاحية منتهية — يلزم التجديد', 'Validity expired — needs renewal') : L(`منذ ${si.days} يوم`, `for ${si.days} days`)) : L('كل الإجراءات مكتملة', 'All procedures complete')}</small>
        <div class="prog"><i style="width:${doneN / 8 * 100}%"></i></div><small>${L(`${doneN} من 8 إجراءات`, `${doneN} of 8 procedures`)} · ${L(`${daysBetween(a.registered, a.travel || TODAY)} يوم منذ التسجيل`, `${daysBetween(a.registered, a.travel || TODAY)} days since registration`)}</small></div>
      <dl class="mini-facts">${fact(L('السن', 'Age'), a.age)}${fact(L('الحالة الاجتماعية', 'Marital status'), lbl(MARITAL[a.marital]) || '—')}${fact(L('التليفون', 'Phone'), num(a.phone || '—'))}${fact(L('العنوان', 'Address'), esc(a.address || '—'))}</dl>
      <div class="passport"><span>${L('جواز السفر', 'Passport')}</span><b>${num(a.passport)}</b><small>${L('ينتهي', 'Expires')} ${num(a.passportExpiry)}</small>${chip(ps.cls, ps.text)}</div>
    </aside>`;
  return `<a class="back no-print" href="#/apps">${L('→ كل العاملات', '← All applicants')}</a>` +
    head(esc(a.name), `${num(a.id)} · ${chip(s, lbl(STAGES[s]))} · ${esc(a.client)}`,
      (c.ops ? `<button class="btn" data-act="edit-app" data-app="${a.id}">${L('تعديل البيانات', 'Edit details')}</button>` : '') + (c.ops && s === 'ready' ? `<button class="btn primary" data-act="deploy" data-app="${a.id}">${L('تسجيل السفر', 'Record travel')}</button>` : '') + (c.fin ? `<button class="btn" data-act="add-exp" data-app="${a.id}">${L('إضافة مصروف', 'Add expense')}</button>` : '') + `<button class="btn" data-act="print">${L('طباعة الملف', 'Print file')}</button>`) + `
    <div class="profile">${idcard}<div class="pmain">
    <section class="card">${route}</section>
    <div class="tabs no-print" role="tablist">${tabs.map(([k, t]) => `<button role="tab" aria-selected="${S.tab === k}" data-act="tab" data-tab="${k}">${t}</button>`).join('')}</div>
    <section class="card flush">${body}</section>
    ${mine.length ? `<section class="card"><div class="chead"><h2>${L('سجل التعديلات', 'Change history')}</h2></div>${logList(mine)}</section>` : ''}
    </div></div>`;
}

function expTable(list, withApp = true) {
  if (!list.length) return empty(L('لا توجد مصاريف مسجلة بعد.', 'No expenses recorded yet.'));
  return `<div class="twrap"><table><thead><tr><th>${L('رقم', 'No.')}</th>${withApp ? `<th>${L('العاملة', 'Applicant')}</th>` : ''}<th>${L('نوع المصروف', 'Type')}</th><th>${L('تاريخ الدفع', 'Date')}</th><th>${L('طريقة الدفع', 'Method')}</th><th class="r">${L('المبلغ', 'Amount')}</th><th class="r">USD</th><th>${L('الحالة', 'Status')}</th><th>${L('الإيصال', 'Receipt')}</th></tr></thead><tbody>
    ${list.map(e => `<tr><td>${num(e.id)}</td>${withApp ? `<td><a href="#/app/${e.appId}">${esc(findApp(e.appId)?.name)}</a> ${num(e.appId)}</td>` : ''}<td>${esc(lbl(byK(EXP_TYPES, e.type)))}</td><td>${num(e.date)}</td><td>${esc(lbl(byK(METHODS, e.method)))}</td><td class="r">${num(amt(e.amount, e.cur))}</td><td class="r">${num(money(usd(e)))}</td>
      <td>${e.paid ? chip('done', L('مدفوع', 'Paid')) : (can().fin ? `<button class="btn tiny" data-act="pay-exp" data-id="${e.id}">${L('تسجيل الدفع', 'Mark paid')}</button>` : chip('expired', L('غير مدفوع', 'Unpaid')))}</td><td>${e.receipt ? `<span class="file">${esc(e.receipt)}</span>` : '—'}</td></tr>`).join('')}</tbody></table></div>`;
}
function vAexp() {
  const list = EXPENSES.filter(e => (S.expType === 'all' || e.type === S.expType) && (S.expPaid === 'all' || String(e.paid) === S.expPaid));
  const total = sum(list, usd), unpaid = sum(list.filter(e => !e.paid), usd);
  return head(L('مصاريف العاملات', 'Applicant expenses'), L('كل عملية مربوطة بملف عاملة، والإجمالي يُحسب تلقائياً.', 'Every entry is tied to an applicant file; totals add up on their own.'),
    exportBtns('applicant-expenses') + (can().fin ? `<button class="btn primary" data-act="add-exp">${L('إضافة مصروف', 'Add expense')}</button>` : '')) + `
    <div class="toolbar no-print">
      <select id="expType" aria-label="${L('نوع المصروف', 'Type')}">${opts([['all', L('كل الأنواع', 'All types')], ...EXP_TYPES.map(t => [t.k, lbl(t)])], S.expType)}</select>
      <select id="expPaid" aria-label="${L('حالة الدفع', 'Payment status')}">${opts([['all', L('مدفوع وغير مدفوع', 'Paid and unpaid')], ['true', L('مدفوع', 'Paid')], ['false', L('غير مدفوع', 'Unpaid')]], S.expPaid)}</select>
      <span class="totals">${L('الإجمالي', 'Total')} <b>${money(total)}</b> · ${L('غير مدفوع', 'Unpaid')} <b class="neg">${money(unpaid)}</b> · ${num(list.length)} ${L('عملية', 'entries')}</span>
    </div>
    <section class="card flush">${expTable(list.slice(0, 60))}${list.length > 60 ? `<p class="muted small pad">${L(`معروض أحدث 60 عملية من ${list.length}. التصدير يشمل المعروض فقط في هذا النموذج.`, `Showing the latest 60 of ${list.length}. Export covers what is shown in this prototype.`)}</p>` : ''}</section>`;
}

function vOffice() {
  const f = fin(CUR_MONTH), dueList = OFFICE.filter(o => !o.paid);
  return head(L('مصاريف المكتب', 'Office expenses'), L('المصاريف التشغيلية العامة، منفصلة تماماً عن حسابات العاملات.', 'General running costs, kept separate from applicant accounts.'),
    exportBtns('office-expenses') + (can().fin ? `<button class="btn primary" data-act="add-office">${L('إضافة مصروف', 'Add expense')}</button>` : '')) + `
    <div class="money slim"><div><span>${L('مدفوع هذا الشهر', 'Paid this month')}</span><b>${money(f.oe)}</b></div><div><span>${L('مستحق لم يُدفع', 'Due, not paid')}</span><b class="neg">${money(sum(dueList, usd))}</b></div><div><span>${L('بنود مستحقة', 'Items due')}</span><b>${dueList.length}</b></div></div>
    <section class="card flush"><div class="twrap"><table><thead><tr><th>${L('رقم', 'No.')}</th><th>${L('البند', 'Item')}</th><th>${L('النوع', 'Category')}</th><th>${L('التكرار', 'Repeats')}</th><th>${L('الاستحقاق', 'Due')}</th><th>${L('الدفع', 'Paid on')}</th><th class="r">${L('المبلغ', 'Amount')}</th><th class="r">USD</th><th>${L('الحالة', 'Status')}</th></tr></thead><tbody>
    ${OFFICE.slice(0, 40).map(o => `<tr><td>${num(o.id)}</td><td><b>${esc(o.desc)}</b></td><td>${esc(lbl(byK(OFFICE_CATS, o.cat)))}</td><td>${lbl(RECUR[o.recur])}</td><td>${num(o.due)}</td><td>${o.paidDate ? num(o.paidDate) : '—'}</td><td class="r">${num(amt(o.amount, o.cur))}</td><td class="r">${num(money(usd(o)))}</td>
      <td>${o.paid ? chip('done', L('مدفوع', 'Paid')) : (can().fin ? `<button class="btn tiny" data-act="pay-office" data-id="${o.id}">${L('تسجيل الدفع', 'Mark paid')}</button>` : chip(o.due < TODAY ? 'expired' : 'progress', L('مستحق', 'Due')))}</td></tr>`).join('')}</tbody></table></div></section>`;
}

const periodSelect = () => `<select id="period" aria-label="${L('الفترة', 'Period')}">${opts([...MONTHS.slice().reverse().map(m => [m, mName(m)]), ['2026', mName('2026')]], S.period)}</select>`;
function pnl(f) {
  const line = (k, v, cls = '') => `<tr class="${cls}"><td>${k}</td><td class="r">${num(money(v))}</td></tr>`;
  return `<table class="pnl"><tbody>${line(L('الإيرادات المحصّلة من العملاء', 'Revenue received from clients'), f.rev)}${line(L('مصاريف العاملات', 'Applicant expenses'), -f.ae)}${line(L('مجمل الربح', 'Gross profit'), f.rev - f.ae, 'sub')}${line(L('مصاريف المكتب والتشغيل', 'Office & operating expenses'), -f.oe)}${line(f.net >= 0 ? L('صافي الربح', 'Net profit') : L('صافي الخسارة', 'Net loss'), f.net, 'total')}</tbody></table>`;
}
function vFin() {
  const f = fin(S.period), rev = REVENUE.filter(r => r.date.startsWith(S.period));
  return head(L('الحسابات', 'Finance'), L('الإيرادات، المدفوعات، العملات وسعر الصرف، وتقرير الأرباح والخسائر.', 'Revenue, payments, currencies and rates, and the profit & loss statement.'),
    periodSelect() + exportBtns('client-payments') + (can().fin ? `<button class="btn primary" data-act="add-rev">${L('تسجيل دفعة عميل', 'Record client payment')}</button>` : '')) + `
    <div class="two">
      <section class="card"><div class="chead"><h2>${L('الأرباح والخسائر', 'Profit & loss')} — ${mName(S.period)}</h2></div>${pnl(f)}</section>
      <section class="card"><div class="chead"><h2>${L('أسعار الصرف', 'Exchange rates')}</h2>${can().fin ? `<button class="btn tiny no-print" data-act="add-rate">${L('تحديث السعر', 'Update rate')}</button>` : ''}</div>
        <p class="muted small">${L('كل عملية تُحفظ بعملتها الأصلية، والتقارير تُحوَّل إلى الدولار.', 'Each entry keeps its original currency; reports convert to USD.')}</p>
        <table class="mini"><thead><tr><th>${L('التاريخ', 'Date')}</th><th>${L('العملة', 'Currency')}</th><th class="r">${L('لكل 1 دولار', 'Per 1 USD')}</th><th>${L('بواسطة', 'By')}</th></tr></thead><tbody>${RATE_LOG.map(r => `<tr><td>${num(r.date)}</td><td>${r.cur}</td><td class="r">${num(r.rate)}</td><td>${esc(r.by)}</td></tr>`).join('')}</tbody></table>
      </section>
    </div>
    <section class="card flush"><div class="chead pad"><h2>${L('مدفوعات العملاء', 'Client payments')}</h2></div>
      ${rev.length ? `<div class="twrap"><table><thead><tr><th>${L('رقم', 'No.')}</th><th>${L('العميل', 'Client')}</th><th>${L('العاملة', 'Applicant')}</th><th>${L('البيان', 'For')}</th><th>${L('التاريخ', 'Date')}</th><th class="r">${L('المبلغ', 'Amount')}</th><th>${L('الحالة', 'Status')}</th></tr></thead><tbody>
      ${rev.slice(0, 40).map(r => `<tr><td>${num(r.id)}</td><td>${esc(r.client)}</td><td><a href="#/app/${r.appId}">${esc(findApp(r.appId)?.name)}</a></td><td>${r.kind === 'deposit' ? L('دفعة مقدمة 50%', '50% deposit') : L('باقي المبلغ عند السفر', 'Balance on travel')}</td><td>${num(r.date)}</td><td class="r">${num(amt(r.amount, r.cur))}</td>
        <td>${r.received ? chip('done', L('تم التحصيل', 'Received')) : (can().fin ? `<button class="btn tiny" data-act="recv" data-id="${r.id}">${L('تسجيل التحصيل', 'Mark received')}</button>` : chip('progress', L('مستحق', 'Due')))}</td></tr>`).join('')}</tbody></table></div>` : empty(L('لا توجد مدفوعات في هذه الفترة.', 'No payments in this period.'))}
    </section>`;
}

function vReports() {
  const inP = d => d && d.startsWith(S.period);
  const reg = APPLICANTS.filter(a => inP(a.registered)), flew = APPLICANTS.filter(a => inP(a.travel));
  const al = alerts(), c = can();
  const costs = reg.map(a => ({ a, cost: appCost(a.id) }));
  return head(L('التقارير', 'Reports'), L('تقرير شهري أو سنوي جاهز للتصدير.', 'A monthly or yearly report, ready to export.'), periodSelect() + exportBtns('report')) + `
    <div class="kpis">
      <div class="kpi"><b>${reg.length}</b><span>${L('عاملات مسجّلات', 'Applicants registered')}</span><small>${mName(S.period)}</small></div>
      <div class="kpi k-done"><b>${flew.length}</b><span>${L('سافرن', 'Deployed')}</span><small>${mName(S.period)}</small></div>
      <div class="kpi k-prog"><b>${al.length}</b><span>${L('إجراءات ومستندات متأخرة', 'Overdue items')}</span><small>${L('حتى اليوم', 'as of today')}</small></div>
      ${c.seeFin ? `<div class="kpi k-ready"><b>${money(costs.length ? sum(costs, x => x.cost) / costs.length : 0)}</b><span>${L('متوسط تكلفة العاملة', 'Average cost per applicant')}</span><small>${L('لمسجّلات الفترة', 'for this period’s intake')}</small></div>` : ''}
    </div>
    ${c.seeFin ? `<section class="card"><div class="chead"><h2>${L('الأرباح والخسائر', 'Profit & loss')} — ${mName(S.period)}</h2></div>${pnl(fin(S.period))}</section>` : ''}
    <section class="card flush"><div class="chead pad"><h2>${L('عاملات الفترة', 'Applicants in this period')}</h2></div>
      ${reg.length ? `<div class="twrap"><table><thead><tr><th>${L('الرقم', 'ID')}</th><th>${L('الاسم', 'Name')}</th><th>${L('التسجيل', 'Registered')}</th><th>${L('الحالة', 'Status')}</th><th>${L('السفر', 'Travel')}</th><th>${L('العميل', 'Client')}</th>${c.seeFin ? `<th class="r">${L('التكلفة', 'Cost')}</th>` : ''}</tr></thead><tbody>
      ${costs.map(({ a, cost }) => { const s = stageOf(a); return `<tr data-href="#/app/${a.id}" tabindex="0"><td>${num(a.id)}</td><td><b>${esc(a.name)}</b></td><td>${num(a.registered)}</td><td>${chip(s, lbl(STAGES[s]))}</td><td>${a.travel ? num(a.travel) : '—'}</td><td>${esc(a.client)}</td>${c.seeFin ? `<td class="r">${num(money(cost))}</td>` : ''}</tr>`; }).join('')}</tbody></table></div>` : empty(L('لا توجد عاملات مسجّلات في هذه الفترة.', 'No applicants registered in this period.'))}
    </section>`;
}

const logList = list => `<ul class="log">${list.map(l => `<li><span>${num(l.at)}</span><b>${esc(l.user)}</b><p>${esc(L(l.ar, l.en))}${l.ref ? ' · ' + (l.ref.startsWith('APP') ? `<a href="#/app/${l.ref}">${num(l.ref)}</a>` : num(l.ref)) : ''}</p></li>`).join('')}</ul>`;
function vUsers() {
  const mods = [['dash', L('لوحة التحكم', 'Dashboard')], ['apps', L('بيانات العاملات والإجراءات', 'Applicants & procedures')], ['aexp', L('مصاريف العاملات', 'Applicant expenses')], ['office', L('مصاريف المكتب', 'Office expenses')], ['fin', L('الحسابات والتقارير المالية', 'Finance & financial reports')], ['users', L('المستخدمون', 'Users')]];
  const level = (r, m) => {
    const R = ROLES[r];
    if (m === 'users') return r === 'admin' ? 2 : 0;
    if (m === 'dash') return 1;
    if (m === 'apps') return R.ops ? 2 : 1;
    return R.fin ? 2 : (R.seeFin ? 1 : 0);
  };
  const cell = v => `<td class="lv lv${v}">${[L('لا يرى', 'No access'), L('مشاهدة', 'View'), L('إضافة وتعديل', 'Add & edit')][v]}</td>`;
  return head(L('المستخدمون والصلاحيات', 'Users & permissions'), L('كل مستخدم يرى ما يخص دوره فقط، وكل تعديل يُسجَّل باسم صاحبه.', 'Each person sees only what their role needs, and every change is recorded under their name.'),
    `<button class="btn primary" data-act="add-user">${L('إضافة مستخدم', 'Add user')}</button>`) + `
    <div class="two">
      <section class="card flush"><div class="twrap"><table><thead><tr><th>${L('الاسم', 'Name')}</th><th>${L('الدور', 'Role')}</th><th>${L('آخر دخول', 'Last sign-in')}</th></tr></thead><tbody>${USERS.map(u => `<tr><td><b>${esc(u.name)}</b><br><span class="muted small">${esc(u.email)}</span></td><td>${chip('role', lbl(ROLES[u.role]))}</td><td>${num(u.last)}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="card flush"><div class="twrap"><table class="matrix"><thead><tr><th>${L('القسم', 'Section')}</th>${Object.values(ROLES).map(r => `<th>${lbl(r)}</th>`).join('')}</tr></thead><tbody>${mods.map(([m, t]) => `<tr><td><b>${t}</b></td>${Object.keys(ROLES).map(r => cell(level(r, m))).join('')}</tr>`).join('')}</tbody></table></div></section>
    </div>
    <section class="card"><div class="chead"><h2>${L('سجل النشاط', 'Activity log')}</h2></div>${logList(LOG.slice(0, 15))}</section>`;
}

/* ---------- shell + router ---------- */
const VIEWS = { dash: vDash, apps: vApps, aexp: vAexp, office: vOffice, fin: vFin, reports: vReports, users: vUsers };
function render() {
  const [, route = 'dash', arg] = location.hash.split('/');
  const c = can(), section = route === 'app' ? 'apps' : route;
  document.documentElement.lang = S.lang; document.documentElement.dir = L('rtl', 'ltr');
  document.title = L('مسار — إدارة الاستقدام', 'Masar — Recruitment Desk');
  const allowed = c.nav.includes(section);
  const view = !allowed ? head(L('هذا القسم غير متاح لدورك', 'This section is not available to your role'), '') + empty(`<a href="#/dash">${L('العودة إلى لوحة التحكم', 'Back to the dashboard')}</a>`)
    : route === 'app' ? vApp(arg) : (VIEWS[route] || vDash)();
  $('#app').innerHTML = `
    <aside class="side no-print"><a class="brand" href="#/dash"><svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><path d="M4 24c6-14 18-14 24-16" fill="none" stroke="#F4B740" stroke-width="2.500" stroke-linecap="round" stroke-dasharray="1 5"/><circle cx="4" cy="24" r="3" fill="#F4B740"/><circle cx="28" cy="8" r="3" fill="#fff"/></svg><span>${L('مسار', 'Masar')}<small>${L('إدارة الاستقدام', 'Recruitment desk')}</small></span></a>
      <nav>${c.nav.map(k => `<a href="#/${k}"${k === section ? ' aria-current="page"' : ''}>${icon(NAV[k].i)}<span>${lbl(NAV[k])}</span></a>`).join('')}</nav>
      <p class="demo-note">${L('نموذج تجريبي — البيانات كلها وهمية.', 'Prototype — all data is made up.')}</p></aside>
    <div class="main"><div class="top no-print">
        <label class="rolepick"><span>${L('معاينة النظام بصلاحية', 'Preview as')}</span><select id="role">${opts(Object.entries(ROLES).map(([k, v]) => [k, lbl(v)]), S.role)}</select></label>
        <span class="who"><b>${esc(me().name)}</b></span>
        <button class="btn" data-act="lang" lang="${L('en', 'ar')}">${L('English', 'العربية')}</button>
      </div><main>${view}</main></div>`;
}

document.addEventListener('click', e => {
  const row = e.target.closest('tr[data-href]');
  if (row && !e.target.closest('a,button,select,label')) { location.hash = row.dataset.href; return; }
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act, methodOpts = METHODS.map(m => [m.k, lbl(m)]), curOpts = Object.keys(RATES).map(k => [k, k]);
  const yesNo = [['true', L('مدفوع', 'Paid')], ['false', L('غير مدفوع', 'Unpaid')]];
  if (act === 'lang') { S.lang = L('en', 'ar'); try { localStorage.setItem('masar-lang', S.lang); } catch (err) { /* ignore */ } render(); }
  else if (act === 'close') $('#dlg').close();
  else if (act === 'print') window.print();
  else if (act === 'csv') exportCSV(b.dataset.name);
  else if (act === 'tab') { S.tab = b.dataset.tab; render(); }
  else if (act === 'page') { S.page += +b.dataset.d; $('#apps-table').innerHTML = appsTable(); }
  else if (act === 'deploy') { const a = findApp(b.dataset.app); a.travel = TODAY; audit('تسجيل سفر العاملة', 'Recorded travel', a.id); render(); toast(L('تم تسجيل السفر', 'Travel recorded')); }
  else if (act === 'pay-exp') { const x = EXPENSES.find(v => v.id === b.dataset.id); x.paid = true; x.date = TODAY; audit(`تسجيل دفع المصروف ${x.id}`, `Marked expense ${x.id} as paid`, x.appId); render(); toast(L('تم تسجيل الدفع', 'Marked as paid')); }
  else if (act === 'pay-office') { const x = OFFICE.find(v => v.id === b.dataset.id); x.paid = true; x.paidDate = TODAY; audit(`دفع مصروف مكتب: ${x.desc}`, `Paid office expense: ${x.desc}`); render(); toast(L('تم تسجيل الدفع', 'Marked as paid')); }
  else if (act === 'recv') { const x = REVENUE.find(v => v.id === b.dataset.id); x.received = true; x.date = TODAY; audit(`تحصيل دفعة عميل ${amt(x.amount, x.cur)}`, `Received client payment ${amt(x.amount, x.cur)}`, x.appId); render(); toast(L('تم تسجيل التحصيل', 'Marked as received')); }
  else if (act === 'stage' || act === 'view') { S[act] = b.dataset.v; S.page = 1; render(); }
  else if (act === 'edit-app') { const a = findApp(b.dataset.app); openForm(L('تعديل بيانات ', 'Edit details — ') + a.id, appFields(a), o => { Object.assign(a, cleanApp(o)); audit('تعديل البيانات الشخصية', 'Edited personal details', a.id); toast(L('تم حفظ التعديلات', 'Changes saved')); }); }
  else if (act === 'add-app') openForm(`${L('تسجيل عاملة جديدة', 'Register a new applicant')} — ${'APP-' + String(APPLICANTS.length + 1).padStart(4, '0')}`, appFields(), o => {
    const id = 'APP-' + String(APPLICANTS.length + 1).padStart(4, '0');
    cleanApp(o);
    APPLICANTS.push({ ...o, id, nationality: 'Filipino', registered: TODAY, travel: '', by: me().name, procs: PROCS.map(p => ({ k: p.k, status: 'pending', date: '', expiry: '', cost: p.cost, cur: p.cur, file: '' })) });
    audit('تسجيل عاملة جديدة', 'Registered new applicant', id); toast(L(`تم تسجيل ${o.name} برقم ${id}`, `${o.name} registered as ${id}`)); location.hash = '#/app/' + id;
  });
  else if (act === 'add-exp') openForm(L('إضافة مصروف عاملة', 'Add applicant expense'), [
    { k: 'appId', label: L('العاملة', 'Applicant'), type: 'select', wide: true, val: b.dataset.app, options: APPLICANTS.slice().reverse().map(a => [a.id, `${a.id} — ${a.name}`]) },
    { k: 'type', label: L('نوع المصروف', 'Type'), type: 'select', options: EXP_TYPES.map(t => [t.k, lbl(t)]) }, { k: 'date', label: L('تاريخ الدفع', 'Payment date'), type: 'date', val: TODAY, req: true },
    { k: 'amount', label: L('المبلغ', 'Amount'), type: 'number', req: true }, { k: 'cur', label: L('العملة', 'Currency'), type: 'select', options: curOpts, val: 'PHP' },
    { k: 'method', label: L('طريقة الدفع', 'Method'), type: 'select', options: methodOpts }, { k: 'paid', label: L('حالة الدفع', 'Payment status'), type: 'select', options: yesNo },
    { k: 'receipt', label: L('إيصال أو إثبات الدفع', 'Receipt or proof of payment'), type: 'file', wide: true },
  ], o => { const id = 'EXP-' + String(EXPENSES.length + 1).padStart(5, '0'); EXPENSES.unshift({ ...o, id, amount: +o.amount, paid: o.paid === 'true' }); audit(`إضافة مصروف ${amt(+o.amount, o.cur)}`, `Added expense ${amt(+o.amount, o.cur)}`, o.appId); toast(L('تمت إضافة المصروف', 'Expense added')); });
  else if (act === 'add-office') openForm(L('إضافة مصروف مكتب', 'Add office expense'), [
    { k: 'desc', label: L('البند', 'Item'), req: true, wide: true }, { k: 'cat', label: L('النوع', 'Category'), type: 'select', options: OFFICE_CATS.map(c => [c.k, lbl(c)]) },
    { k: 'recur', label: L('التكرار', 'Repeats'), type: 'select', options: Object.entries(RECUR).map(([k, v]) => [k, lbl(v)]) },
    { k: 'amount', label: L('المبلغ', 'Amount'), type: 'number', req: true }, { k: 'cur', label: L('العملة', 'Currency'), type: 'select', options: curOpts, val: 'PHP' },
    { k: 'due', label: L('تاريخ الاستحقاق', 'Due date'), type: 'date', val: TODAY, req: true }, { k: 'paid', label: L('حالة الدفع', 'Payment status'), type: 'select', options: yesNo, val: 'false' },
  ], o => { const paid = o.paid === 'true'; OFFICE.unshift({ ...o, id: 'OFC-' + String(OFFICE.length + 1).padStart(4, '0'), amount: +o.amount, paid, paidDate: paid ? TODAY : '' }); audit(`إضافة مصروف مكتب: ${o.desc}`, `Added office expense: ${o.desc}`); toast(L('تمت إضافة المصروف', 'Expense added')); });
  else if (act === 'add-rev') openForm(L('تسجيل دفعة عميل', 'Record a client payment'), [
    { k: 'appId', label: L('العاملة', 'Applicant'), type: 'select', wide: true, options: APPLICANTS.slice().reverse().map(a => [a.id, `${a.id} — ${a.name}`]) },
    { k: 'amount', label: L('المبلغ', 'Amount'), type: 'number', req: true }, { k: 'cur', label: L('العملة', 'Currency'), type: 'select', options: curOpts },
    { k: 'date', label: L('التاريخ', 'Date'), type: 'date', val: TODAY, req: true }, { k: 'kind', label: L('البيان', 'For'), type: 'select', options: [['deposit', L('دفعة مقدمة', 'Deposit')], ['balance', L('باقي المبلغ', 'Balance')]] },
  ], o => { REVENUE.unshift({ ...o, id: 'RCV-' + String(REVENUE.length + 1).padStart(5, '0'), amount: +o.amount, client: findApp(o.appId).client, method: 'bank', received: true }); audit(`تسجيل دفعة عميل ${amt(+o.amount, o.cur)}`, `Recorded client payment ${amt(+o.amount, o.cur)}`, o.appId); toast(L('تم تسجيل الدفعة', 'Payment recorded')); });
  else if (act === 'add-rate') openForm(L('تحديث سعر الصرف', 'Update exchange rate'), [
    { k: 'cur', label: L('العملة', 'Currency'), type: 'select', options: [['PHP', 'PHP'], ['EGP', 'EGP']] }, { k: 'rate', label: L('السعر لكل 1 دولار', 'Rate per 1 USD'), type: 'number', req: true },
    { k: 'date', label: L('تاريخ التحويل', 'Rate date'), type: 'date', val: TODAY, req: true },
  ], o => { if (+o.rate > 0) { RATES[o.cur] = +o.rate; RATE_LOG.unshift({ date: o.date, cur: o.cur, rate: +o.rate, by: me().name }); audit(`تحديث سعر الصرف ${o.cur} = ${o.rate}`, `Updated exchange rate ${o.cur} = ${o.rate}`); toast(L('تم تحديث السعر', 'Rate updated')); } });
  else if (act === 'add-user') openForm(L('إضافة مستخدم', 'Add a user'), [
    { k: 'name', label: L('الاسم', 'Name'), req: true }, { k: 'email', label: L('البريد الإلكتروني', 'Email'), type: 'email', req: true },
    { k: 'role', label: L('الدور', 'Role'), type: 'select', options: Object.entries(ROLES).map(([k, v]) => [k, lbl(v)]), val: 'viewer', wide: true },
  ], o => { USERS.push({ ...o, last: '—' }); audit(`إضافة المستخدم ${o.name}`, `Added user ${o.name}`); toast(L('تمت إضافة المستخدم', 'User added')); });
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('tr[data-href]')) location.hash = e.target.dataset.href; });
document.addEventListener('input', e => { if (e.target.id === 'q') { S.q = e.target.value; S.page = 1; $('#apps-table').innerHTML = appsTable(); } });
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'role') { S.role = t.value; render(); toast(L(`أنت الآن ترى النظام كـ ${lbl(ROLES[S.role])}`, `You now see the system as ${lbl(ROLES[S.role])}`)); }
  else if (t.id === 'step') { S.step = t.value; S.page = 1; $('#apps-table').innerHTML = appsTable(); }
  else if (t.id === 'period') { S.period = t.value; render(); }
  else if (t.id === 'expType' || t.id === 'expPaid') { S[t.id] = t.value; render(); }
  else if (t.dataset.proc || t.dataset.up) {
    const a = findApp(location.hash.split('/')[2]), i = +(t.dataset.proc ?? t.dataset.up), p = a.procs[i], def = PROCS[i];
    if (t.dataset.up) { if (!t.files[0]) return; p.file = t.files[0].name; audit(`رفع مستند «${def.ar}»`, `Uploaded “${def.en}” document`, a.id); toast(L('تم إرفاق المستند', 'Document attached')); }
    else {
      p.status = t.value;
      if (p.status === 'done') { p.date = p.date || TODAY; p.expiry = def.valid ? addDays(p.date, def.valid) : ''; }
      if (p.status === 'progress') p.date = p.date || TODAY;
      audit(`تحديث إجراء «${def.ar}» إلى ${STATUS[p.status].ar}`, `Set “${def.en}” to ${STATUS[p.status].en}`, a.id);
      toast(L('تم حفظ الحالة', 'Status saved'));
    }
    render();
  }
});
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
render();
