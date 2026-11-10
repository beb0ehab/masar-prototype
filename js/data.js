/* Demo data — everything here is generated, no real people or figures.
   "Today" is pinned so the demo always shows the same picture. */
const TODAY = '2026-11-10';
const CUR_MONTH = TODAY.slice(0, 7);
const MONTHS = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];

// Units of each currency per 1 USD (base currency for reports)
const RATES = { USD: 1, PHP: 58.4, EGP: 49.6 };
const RATE_LOG = [
  { date: '2026-11-03', cur: 'PHP', rate: 58.4, by: 'Mariam Adel' },
  { date: '2026-11-03', cur: 'EGP', rate: 49.6, by: 'Mariam Adel' },
  { date: '2026-10-01', cur: 'PHP', rate: 57.9, by: 'Mariam Adel' },
  { date: '2026-10-01', cur: 'EGP', rate: 49.1, by: 'Mariam Adel' },
  { date: '2026-09-01', cur: 'PHP', rate: 57.2, by: 'Mariam Adel' },
];

const PROCS = [
  { k: 'medical', en: 'Medical Examination', ar: 'الكشف الطبي', cost: 3500, cur: 'PHP', valid: 90 },
  { k: 'vaccine', en: 'Vaccination', ar: 'التطعيمات', cost: 1800, cur: 'PHP', valid: 365 },
  { k: 'tesda', en: 'TESDA Certificate', ar: 'شهادة TESDA', cost: 2500, cur: 'PHP', valid: 1825 },
  { k: 'enjaz', en: 'Enjaz', ar: 'إنجاز', cost: 95, cur: 'USD', valid: 90 },
  { k: 'vfs', en: 'VFS / Biometric', ar: 'VFS / البصمة', cost: 2200, cur: 'PHP', valid: 0 },
  { k: 'insurance', en: 'Insurance', ar: 'التأمين', cost: 140, cur: 'USD', valid: 730 },
  { k: 'oec', en: 'OEC', ar: 'تصريح OEC', cost: 1500, cur: 'PHP', valid: 60 },
  { k: 'flight', en: 'Flight Ticket', ar: 'تذكرة الطيران', cost: 420, cur: 'USD', valid: 0 },
];
const EXP_TYPES = [
  ...PROCS.map(p => ({ k: p.k, en: p.en.replace(' Examination', '').replace(' Certificate', ''), ar: p.ar })),
  { k: 'fro', en: 'FRO Payments', ar: 'مدفوعات FRO' },
  { k: 'other', en: 'Other Expenses', ar: 'مصاريف أخرى' },
];
const METHODS = [
  { k: 'cash', en: 'Cash', ar: 'نقدي' },
  { k: 'bank', en: 'Bank transfer', ar: 'تحويل بنكي' },
  { k: 'gcash', en: 'GCash', ar: 'GCash' },
];
const OFFICE_CATS = [
  { k: 'rent', en: 'Office & room rent', ar: 'إيجار المكاتب والغرف' },
  { k: 'utilities', en: 'Electricity & water', ar: 'كهرباء ومياه' },
  { k: 'housing', en: 'Accommodation', ar: 'مصاريف السكن' },
  { k: 'telecom', en: 'Phone & internet', ar: 'تليفونات وإنترنت' },
  { k: 'salaries', en: 'Staff salaries', ar: 'رواتب الموظفين' },
  { k: 'transport', en: 'Transport, fuel & parking', ar: 'انتقالات وبنزين ومواقف' },
  { k: 'printer', en: 'Printer', ar: 'مصاريف الطابعة' },
  { k: 'software', en: 'Software & subscriptions', ar: 'اشتراكات البرامج' },
  { k: 'supplies', en: 'Office supplies', ar: 'مستلزمات المكتب' },
  { k: 'other', en: 'Other operating', ar: 'تشغيلية أخرى' },
];
const CLIENTS = ['Al Noor Recruitment — Riyadh', 'Dar Al Khibra — Jeddah', 'Al Safwa Manpower — Dammam', 'Rawabi Services — Riyadh', 'Al Bayan Office — Madinah'];

const USERS = [
  { name: 'Hala Mansour', email: 'hala@demo.example', role: 'admin', last: '2026-11-10 09:12' },
  { name: 'Mariam Adel', email: 'mariam@demo.example', role: 'accountant', last: '2026-11-10 08:47' },
  { name: 'Jocelyn Ramos', email: 'jocelyn@demo.example', role: 'hr', last: '2026-11-10 09:30' },
  { name: 'Rhea Santos', email: 'rhea@demo.example', role: 'hr', last: '2026-11-09 17:05' },
  { name: 'Omar Fathy', email: 'omar@demo.example', role: 'viewer', last: '2026-11-07 14:21' },
];

/* ---------- generator ---------- */
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const addDays = (isoDate, n) => { const d = new Date(isoDate + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 864e5);
const pad = (n, w = 2) => String(n).padStart(w, '0');

const APPLICANTS = [], EXPENSES = [], REVENUE = [], OFFICE = [], LOG = [];

(function generate() {
  const r = rng(20261110);
  const pick = a => a[Math.floor(r() * a.length)];
  const FIRST = ['Maria', 'Ana', 'Jocelyn', 'Rowena', 'Marites', 'Lorna', 'Cristina', 'Rosalie', 'Jennifer', 'Analyn', 'Maricel', 'Gemma', 'Liza', 'Arlene', 'Divina', 'Evelyn', 'Fatima', 'Grace', 'Hazel', 'Imelda', 'Janet', 'Karen', 'Leah', 'Melanie', 'Nenita', 'Ofelia', 'Precious', 'Rhea', 'Sheila', 'Teresita', 'Vilma', 'Wilma', 'Yolanda', 'Zenaida', 'Aiza', 'Bernadette', 'Charito', 'Delia', 'Elvira', 'Flordeliza'];
  const LAST = ['Dela Cruz', 'Santos', 'Reyes', 'Garcia', 'Mendoza', 'Bautista', 'Villanueva', 'Ramos', 'Aquino', 'Castillo', 'Flores', 'Gonzales', 'Navarro', 'Pascual', 'Salazar', 'Tolentino', 'Marquez', 'Domingo', 'Soriano', 'Valdez', 'Abad', 'Mercado', 'Lim', 'Panganiban', 'Manalo', 'Dizon', 'Cabrera', 'Rosales', 'Lacson', 'Magbanua'];
  const CITIES = ['Quezon City', 'Davao City', 'Cebu City', 'Iloilo City', 'General Santos', 'Zamboanga City', 'Bacolod', 'Cagayan de Oro', 'Tarlac', 'Batangas City', 'Cotabato City', 'Marawi'];
  const MARITAL = ['single', 'single', 'married', 'married', 'widowed', 'separated'];
  const counts = [46, 52, 49, 55, 51, 17];
  let seq = 1, eid = 1, rid = 1;

  MONTHS.forEach((m, mi) => {
    for (let i = 0; i < counts[mi]; i++) {
      const reg = `${m}-${pad(1 + Math.floor(r() * (m === CUR_MONTH ? 9 : 28)))}`;
      const age = daysBetween(reg, TODAY);
      const stalled = r() < 0.07;
      let n = Math.min(8, Math.floor(age / 9.5 + r() * 1.2));
      if (stalled) n = Math.min(n, 2 + Math.floor(r() * 3));
      const noVaccine = r() < 0.1;
      const id = 'APP-' + pad(seq++, 4);

      const procs = PROCS.map((p, pi) => {
        const date = addDays(reg, 3 + pi * 9 + Math.floor(r() * 5));
        if (p.k === 'vaccine' && noVaccine) return { k: p.k, status: 'na', date: '', expiry: '', cost: 0, cur: p.cur, file: '' };
        const cost = Math.round(p.cost * (0.92 + r() * 0.2) / 5) * 5;
        if (pi < n) return { k: p.k, status: 'done', date, expiry: p.valid ? addDays(date, p.valid) : '', cost, cur: p.cur, file: `${p.k}-${id}.pdf` };
        if (pi === n && date <= TODAY) return { k: p.k, status: 'progress', date, expiry: '', cost, cur: p.cur, file: '' };
        return { k: p.k, status: 'pending', date: '', expiry: '', cost, cur: p.cur, file: '' };
      });
      const flight = procs[7];
      const travel = n === 8 && addDays(flight.date, 3) <= TODAY ? addDays(flight.date, 3) : '';
      if (!travel) procs.forEach(p => { if (p.status === 'done' && p.expiry && p.expiry < TODAY) p.status = 'expired'; });

      const client = pick(CLIENTS);
      APPLICANTS.push({
        id, name: pick(FIRST) + ' ' + pick(LAST), age: 23 + Math.floor(r() * 20), nationality: 'Filipino',
        address: pick(CITIES) + ', Philippines', phone: '+63 9' + pad(Math.floor(r() * 100), 2) + ' ' + pad(Math.floor(r() * 1000), 3) + ' ' + pad(Math.floor(r() * 10000), 4),
        marital: pick(MARITAL), passport: 'P' + pad(Math.floor(r() * 1e7), 7) + String.fromCharCode(65 + Math.floor(r() * 26)),
        passportExpiry: addDays(reg, r() < 0.06 ? 60 + Math.floor(r() * 150) : 400 + Math.floor(r() * 2400)),
        registered: reg, travel, client, procs, by: pick(['Jocelyn Ramos', 'Rhea Santos']),
      });

      // expenses follow the procedures
      procs.forEach(p => {
        if (p.status === 'done' || p.status === 'expired') EXPENSES.push({ id: 'EXP-' + pad(eid++, 5), appId: id, type: p.k, amount: p.cost, cur: p.cur, date: p.date, method: pick(METHODS).k, paid: true, receipt: `receipt-${p.k}-${id}.jpg` });
        else if (p.status === 'progress') EXPENSES.push({ id: 'EXP-' + pad(eid++, 5), appId: id, type: p.k, amount: p.cost, cur: p.cur, date: p.date, method: 'bank', paid: false, receipt: '' });
      });
      if (n >= 1) EXPENSES.push({ id: 'EXP-' + pad(eid++, 5), appId: id, type: 'fro', amount: 6000, cur: 'PHP', date: addDays(reg, 5), method: 'bank', paid: true, receipt: `receipt-fro-${id}.jpg` });
      if (r() < 0.15 && n >= 2) EXPENSES.push({ id: 'EXP-' + pad(eid++, 5), appId: id, type: 'other', amount: 400 + Math.floor(r() * 12) * 100, cur: 'PHP', date: addDays(reg, 12), method: 'cash', paid: true, receipt: '' });

      // client payments: 50% deposit after TESDA, balance on travel
      const fee = 1850;
      if (n >= 3) REVENUE.push({ id: 'RCV-' + pad(rid++, 5), appId: id, client, amount: fee / 2, cur: 'USD', date: procs[2].date || addDays(reg, 24), kind: 'deposit', method: 'bank', received: true });
      if (travel) REVENUE.push({ id: 'RCV-' + pad(rid++, 5), appId: id, client, amount: fee / 2, cur: 'USD', date: travel, kind: 'balance', method: 'bank', received: true });
      else if (n === 8) REVENUE.push({ id: 'RCV-' + pad(rid++, 5), appId: id, client, amount: fee / 2, cur: 'USD', date: addDays(flight.date, 3), kind: 'balance', method: 'bank', received: false });
    }
  });

  // office expenses
  let oid = 1;
  const monthly = [
    ['rent', 'Manila office rent', 45000, 'PHP', 5], ['housing', 'Applicants accommodation — Pasay', 38000, 'PHP', 5],
    ['utilities', 'Meralco electricity', 9200, 'PHP', 12], ['utilities', 'Maynilad water', 2100, 'PHP', 12],
    ['telecom', 'Internet + 6 mobile lines', 7400, 'PHP', 15], ['salaries', 'Manila staff salaries', 212000, 'PHP', 28],
    ['transport', 'Fuel, parking & transport allowance', 14500, 'PHP', 20], ['printer', 'Printer ink & maintenance', 3200, 'PHP', 18],
    ['software', 'Google Workspace + Zoom', 120, 'USD', 2], ['supplies', 'Office supplies', 4100, 'PHP', 10],
    ['rent', 'Cairo office rent', 25000, 'EGP', 1], ['salaries', 'Cairo staff salaries', 62000, 'EGP', 28],
  ];
  MONTHS.forEach(m => monthly.forEach(([cat, desc, amount, cur, day]) => {
    const due = `${m}-${pad(day)}`;
    const jitter = Math.round(amount * (0.97 + r() * 0.06) / 10) * 10;
    const amt = ['rent', 'salaries', 'housing', 'software'].includes(cat) ? amount : jitter;
    const paid = due <= TODAY && !(m === CUR_MONTH && cat === 'supplies');
    OFFICE.push({ id: 'OFC-' + pad(oid++, 4), cat, desc, amount: amt, cur, recur: 'monthly', due, paidDate: paid ? due : '', paid });
  }));
  OFFICE.push({ id: 'OFC-' + pad(oid++, 4), cat: 'other', desc: 'DMW license renewal', amount: 85000, cur: 'PHP', recur: 'yearly', due: '2026-08-15', paidDate: '2026-08-14', paid: true });
  OFFICE.push({ id: 'OFC-' + pad(oid++, 4), cat: 'supplies', desc: 'Document scanner (Fujitsu)', amount: 430, cur: 'USD', recur: 'once', due: '2026-09-09', paidDate: '2026-09-09', paid: true });
  OFFICE.push({ id: 'OFC-' + pad(oid++, 4), cat: 'software', desc: 'Domain & hosting', amount: 180, cur: 'USD', recur: 'yearly', due: '2026-11-25', paidDate: '', paid: false });
  OFFICE.sort((a, b) => b.due.localeCompare(a.due));
  EXPENSES.sort((a, b) => b.date.localeCompare(a.date));
  REVENUE.sort((a, b) => b.date.localeCompare(a.date));

  LOG.push(
    { at: '2026-11-10 09:31', user: 'Jocelyn Ramos', ar: 'تحديث إجراء «إنجاز» إلى مكتمل', en: 'Set “Enjaz” to Completed', ref: APPLICANTS[240].id },
    { at: '2026-11-10 09:12', user: 'Hala Mansour', ar: 'تعديل صلاحيات المستخدم Omar Fathy', en: 'Changed permissions for Omar Fathy', ref: '' },
    { at: '2026-11-10 08:50', user: 'Mariam Adel', ar: 'تسجيل دفعة عميل 925 USD', en: 'Recorded client payment 925 USD', ref: REVENUE[0].id },
    { at: '2026-11-09 16:40', user: 'Rhea Santos', ar: 'رفع مستند «الكشف الطبي»', en: 'Uploaded “Medical” document', ref: APPLICANTS[262].id },
    { at: '2026-11-09 15:02', user: 'Mariam Adel', ar: 'إضافة مصروف مكتب: Internet + 6 mobile lines', en: 'Added office expense: Internet + 6 mobile lines', ref: '' },
    { at: '2026-11-09 11:18', user: 'Jocelyn Ramos', ar: 'تسجيل عاملة جديدة', en: 'Registered new applicant', ref: APPLICANTS[APPLICANTS.length - 1].id },
    { at: '2026-11-03 10:05', user: 'Mariam Adel', ar: 'تحديث سعر الصرف PHP = 58.4', en: 'Updated exchange rate PHP = 58.4', ref: '' },
  );
})();
