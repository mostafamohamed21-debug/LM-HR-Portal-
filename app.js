// Lacto Misr HR Portal v7.2 - Pro Version

const firebaseConfig = {
    apiKey: "AIzaSyA-ywy51h3TM6YF_n0bNj1D5lAMJ7uMnO4",
    authDomain: "lm-hr-portal.firebaseapp.com",
    databaseURL: "https://lm-hr-portal-default-rtdb.firebaseio.com",
    projectId: "lm-hr-portal",
    storageBucket: "lm-hr-portal.firebasestorage.app",
    messagingSenderId: "1008702496104",
    appId: "1:1008702496104:web:930dfe68388ef5a640cadd",
    measurementId: "G-Z6K3VG2SJ6"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let allEmployees = [];
let ageChartInstance = null;
let trendChartInstance = null;
let donutChartInstance = null;

async function readEmployeeSources() {
    let root = {}; let employeesOnly = {};
    try { const rootSnap = await db.ref('/').once('value'); root = rootSnap.exists() ? (rootSnap.val() || {}) : {}; } catch (e) {}
    try { const employeesSnap = await db.ref('employees').once('value'); employeesOnly = employeesSnap.exists() ? (employeesSnap.val() || {}) : {}; } catch (e) {}
    const records = []; const seen = new Set();

    const addRecord = (key, data, path) => {
        if (!data || typeof data !== 'object' || Array.isArray(data)) return;
        const code = String(data.code || data.الكود || key || '').trim();
        if (!code || seen.has(code)) return;
        seen.add(code);
        records.push({ ...data, code, _firebasePath: path, _firebaseKey: key });
    };

    const employeeNode = (root.employees && typeof root.employees === 'object') ? root.employees : employeesOnly;
    if (employeeNode) Object.entries(employeeNode).forEach(([key, data]) => addRecord(key, data, `employees/${key}`));
    Object.entries(root).forEach(([key, data]) => {
        if (['employees', 'users', 'mail', 'password_resets', 'permissions'].includes(key)) return;
        addRecord(key, data, key);
    });
    return records;
}

async function loadEmployeesFromFirebase() {
    try {
        allEmployees = await readEmployeeSources();
        renderTable(allEmployees);
        updateDashboardStats();
        renderCharts();
    } catch (error) {
        console.error(error);
    }
}

function updateDashboardStats() {
    const totalEl = document.getElementById('dash-total-emp');
    if (totalEl) totalEl.innerText = allEmployees.length;
}

function openDashboardView() {
    document.getElementById('employees-list-view').classList.add('hidden');
    document.getElementById('employee-profile-view').classList.add('hidden');
    document.getElementById('dashboard-analytics-view').classList.remove('hidden');
    renderCharts();
}

function backToEmployeesList() {
    document.getElementById('dashboard-analytics-view').classList.add('hidden');
    document.getElementById('employee-profile-view').classList.add('hidden');
    document.getElementById('employees-list-view').classList.remove('hidden');
}

function renderCharts() {
    // 1. Age Chart
    const ageCtx = document.getElementById('ageChart')?.getContext('2d');
    if (ageCtx) {
        let brackets = { '< 30': 0, '30 - 40': 0, '41 - 50': 0, '50+': 0 };
        allEmployees.forEach(emp => {
            const age = Number(emp.age || emp['السن حتى تاريخه'] || 35);
            if (age < 30) brackets['< 30']++;
            else if (age <= 40) brackets['30 - 40']++;
            else if (age <= 50) brackets['41 - 50']++;
            else brackets['50+']++;
        });
        if (ageChartInstance) ageChartInstance.destroy();
        ageChartInstance = new Chart(ageCtx, {
            type: 'bar',
            data: { labels: Object.keys(brackets), datasets: [{ data: Object.values(brackets), backgroundColor: ['#38bdf8', '#0284c7', '#0369a1', '#0f172a'], borderRadius: 6 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#94a3b8' } }, x: { ticks: { color: '#94a3b8' } } } }
        });
    }

    // 2. Trend Chart
    const trendCtx = document.getElementById('trendChart')?.getContext('2d');
    if (trendCtx) {
        if (trendChartInstance) trendChartInstance.destroy();
        trendChartInstance = new Chart(trendCtx, {
            type: 'line',
            data: { labels: ['2022', '2023', '2024', '2025', '2026'], datasets: [{ data: [20, 45, 80, 120, 346], borderColor: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.1)', fill: true, tension: 0.4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }

    // 3. Donut Chart
    const donutCtx = document.getElementById('donutChart')?.getContext('2d');
    if (donutCtx) {
        if (donutChartInstance) donutChartInstance.destroy();
        donutChartInstance = new Chart(donutCtx, {
            type: 'doughnut',
            data: { labels: ['إداري', 'فني ومصانع', 'مبيعات'], datasets: [{ data: [110, 186, 50], backgroundColor: ['#38bdf8', '#ec4899', '#f59e0b'] }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 10 } } } } }
        });
    }
}

function selectGov(govName) {
    const title = document.getElementById('selected-gov-title');
    const desc = document.getElementById('selected-gov-desc');
    const empCount = document.getElementById('gov-emp-count');
    const busCount = document.getElementById('gov-bus-count');

    if (govName === 'الشرقية') {
        title.innerText = '📍 الشرقية (العاشر من رمضان) - المقر الرئيسي';
        desc.innerText = 'المقر التشغيلي الرئيسي ومصانع لاكتو مصر مع أكبر تجمع عمالي.';
        empCount.innerText = '185 موظف';
        busCount.innerText = '6 خطوط رئيسية';
    } else if (govName === 'القاهرة') {
        title.innerText = '📍 القاهرة الكبرى والجيزة';
        desc.innerText = 'المكاتب الإدارية وخطوط سير النقل لموظفي القاهرة والجيزة.';
        empCount.innerText = '95 موظف';
        busCount.innerText = '10 خطوط نقل';
    } else {
        title.innerText = '📍 الإسكندرية والبحيرة';
        desc.innerText = 'توزيعات الموظفين وبدل الانتقالات الإقليمية الساحلية.';
        empCount.innerText = '66 موظف';
        busCount.innerText = '8 خطوط سير';
    }
}

function renderTable(dataList) {
    const tableBody = document.getElementById('employees-table-body'); if (!tableBody) return;
    tableBody.innerHTML = '';
    dataList.forEach(emp => {
        const code = emp.code || '--';
        const name = emp.name || emp['اسم الموظف'] || '--';
        const dept = emp.department || emp['الإدارة'] || '--';
        const job = emp.jobTitle || emp['الوظيفة'] || '--';
        const hire = emp.hireDate || emp['تاريخ التعيين'] || '--';
        const row = document.createElement('tr'); row.className = 'hover:bg-slate-800/40 text-slate-300';
        row.innerHTML = `<td class="p-3.5 font-mono text-sky-400">${code}</td><td class="p-3.5 font-semibold text-white">${name}</td><td class="p-3.5">${dept}</td><td class="p-3.5">${job}</td><td class="p-3.5 font-mono text-xs">${hire}</td><td class="p-3.5 text-center"><button onclick="viewEmployee('${code}')" class="px-3.5 py-1.5 bg-sky-600/30 hover:bg-sky-600 text-sky-200 rounded-lg text-xs">عرض الملف</button></td>`;
        tableBody.appendChild(row);
    });
}

function viewEmployee(code) {
    const emp = allEmployees.find(e => String(e.code) === String(code)); if (!emp) return;
    document.getElementById('dashboard-analytics-view').classList.add('hidden');
    document.getElementById('employees-list-view').classList.add('hidden');
    document.getElementById('employee-profile-view').classList.remove('hidden');
    document.getElementById('prof-code').value = code;
    document.getElementById('prof-name').value = emp.name || emp['اسم الموظف'] || '';
}

function handleLogin() {
    const code = document.getElementById('login-emp-code').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    if (!code || !pass) { document.getElementById('login-error').innerText = 'أدخل الكود وكلمة المرور'; return; }
    document.getElementById('login-modal').style.display = 'none';
    loadEmployeesFromFirebase().then(() => openDashboardView());
}

function handleLogout() { window.location.reload(); }

function runPortalIntro(){
    const intro = document.getElementById('intro-screen');
    const container = document.getElementById('introTitle');
    const subtitle = document.getElementById('introSubtitle');
    if(!intro || !container || !window.gsap){
        document.getElementById('login-modal').style.display = 'flex';
        return;
    }
    container.innerHTML = '';
    const chars = [];
    for(const ch of 'LACTO MISR S.A.E'){
        const el = document.createElement('span'); el.className = 'intro-char'; el.innerText = ch === ' ' ? '\u00a0' : ch;
        container.appendChild(el); chars.push(el);
    }
    gsap.set(chars, { y: -200, opacity: 0 });
    gsap.timeline({
        onComplete: () => {
            intro.classList.add('fade-out');
            setTimeout(() => {
                document.getElementById('login-modal').style.display = 'flex';
            }, 400);
        }
    }).to(chars, { duration: 2, y: 0, opacity: 1, stagger: 0.05, ease: 'power2.out' })
      .to(subtitle, { duration: 1, opacity: 1, y: 0 }, '-=1')
      .to('#introFooter', { duration: 1, opacity: 1, bottom: '10%' }, '-=1')
      .to([subtitle, '#introFooter'], { duration: 1, opacity: 1 }, '+=2');
}

window.addEventListener('DOMContentLoaded', () => {
    runPortalIntro();
    loadEmployeesFromFirebase();
});
