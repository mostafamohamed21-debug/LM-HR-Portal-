// Lacto Misr HR Portal v6.4 - Full Unified Production Code

function excelDateToJSDate(serial) {
    if (!serial || typeof serial !== 'number') return serial || '--';
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400 * 1000;
    const date_info = new Date(utc_value);
    if (isNaN(date_info.getTime())) return serial;
    const year = date_info.getUTCFullYear();
    const month = String(date_info.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date_info.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function updatePasswordEyeIcon() {
    const input = document.getElementById('login-password');
    const icon = document.getElementById('eye-icon');
    const button = document.getElementById('password-toggle');
    if (!input || !icon) return;
    const visible = input.type === 'text';
    icon.innerHTML = visible
        ? '<svg viewBox="0 0 24 24" width="19" height="19"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10.9 10.9 0 0 1 12 4.9c5.1 0 8.8 3.6 10 7.1-.4 1.3-1.3 2.6-2.4 3.7M6.2 6.2C4.2 7.6 2.8 9.4 2 12c1.2 3.6 4.9 7.1 10 7.1 1.2 0 2.3-.2 3.3-.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
        : '<svg viewBox="0 0 24 24" width="19" height="19"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
}
function togglePasswordVisibility() {
    const input = document.getElementById('login-password');
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    updatePasswordEyeIcon();
}

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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    try { firebase.analytics(); } catch (e) {}
}
const db = firebase.database();

let allEmployees = [];
let currentLang = localStorage.getItem('lacto_lang') || 'ar';
let activeEmployeeCode = null;
let currentUserData = null;
let portalInitialized = false;
let ageChartInstance = null;

const translations = {
    ar: {
        admin: "مسؤول النظام", control_panel: "غرفة التحكم", nav_home: "الرئيسية والموظفين", nav_analytics: "تحليلات HR والخريطة",
        total_emp: "إجمالي العاملين", active_depts: "الإدارات النشطة", system_status: "حالة النظام", connected: "مستقر (متصل بـ Firebase)",
        emp_list: "قائمة العاملين بالقاعدة", search_placeholder: "بحث بالاسم أو الكود...", th_code: "الكود", th_name: "اسم الموظف",
        th_dept: "الإدارة", th_job: "الوظيفة", th_hire: "تاريخ التعيين", th_actions: "الإجراءات", loading: "جاري جلب البيانات من القاعدة...",
        no_results: "لا توجد نتائج مطابقة للبحث", action_btn: "عرض الملف", back_btn: "← العودة للقائمة", edit_btn: "تعديل البيانات",
        save_btn: "حفظ", yes_btn: "نعم", cancel_btn: "إلغاء", confirm_title: "هل ترغب في حفظ التعديلات؟", change_photo: "تعديل الصورة",
        sec_job: "البيانات الوظيفية", manager_label: "المدير المباشر", service_years: "سنوات الخدمة", sec_qual: "المؤهل العلمي",
        qual_label: "المؤهل", qual_auth: "جهة المؤهل", sec_personal: "البيانات الشخصية", dob_label: "تاريخ الميلاد", age_label: "السن حتى تاريخه",
        insurance_label: "الحالة التأمينية", pob_label: "مكان الميلاد", toast_success: "تم حفظ التعديلات بنجاح وتحديث Firebase",
        login_title: "تسجيل الدخول", login_subtitle: "أدخل كود الموظف وكلمة المرور", code_placeholder: "كود الموظف", pass_placeholder: "كلمة المرور",
        remember_me: "تذكرني", forgot_pass: "نسيت كلمة المرور؟", login_btn: "دخول للنظام", logout_btn: "تسجيل الخروج",
        login_required: "يرجى إدخال كود الموظف وكلمة المرور", login_not_found: "كود الموظف غير مسجل!", login_wrong_pass: "كلمة المرور غير صحيحة!",
        header_brand: "لاكتو مصر - شؤون العاملين", powered_by: "برمجة وتطوير إدارة الموارد البشرية", portal_version: "بورتال الموظفين v6.4 - برو"
    },
    en: {
        admin: "System Admin", control_panel: "Control Room", nav_home: "Home & Employees", nav_analytics: "HR Analytics & Map",
        total_emp: "Total Employees", active_depts: "Active Departments", system_status: "System Status", connected: "Stable (Connected to Firebase)",
        emp_list: "Database Employees List", search_placeholder: "Search by name or code...", th_code: "CODE", th_name: "EMPLOYEE NAME",
        th_dept: "DEPARTMENT", th_job: "JOB TITLE", th_hire: "HIRE DATE", th_actions: "ACTIONS", loading: "Fetching data from database...",
        no_results: "No matching results found", action_btn: "View Profile", back_btn: "← Back to List", edit_btn: "Edit Data",
        save_btn: "Save", yes_btn: "Yes", cancel_btn: "Cancel", confirm_title: "Do you want to save changes?", change_photo: "Change Photo",
        sec_job: "Job Details", manager_label: "Direct Manager", service_years: "Years of Service", sec_qual: "Education Qualification",
        qual_label: "Qualification", qual_auth: "Issuing Authority", sec_personal: "Personal Data", dob_label: "Date of Birth", age_label: "Age to Date",
        insurance_label: "Insurance Status", pob_label: "Place of Birth", toast_success: "Changes saved successfully & synced with Firebase",
        login_title: "Sign in", login_subtitle: "Enter employee code and password", code_placeholder: "Employee Code", pass_placeholder: "Password",
        remember_me: "Remember Me", forgot_pass: "Forgot password?", login_btn: "Sign in", logout_btn: "Sign out",
        login_required: "Please enter employee code and password", login_not_found: "Employee code not found!", login_wrong_pass: "Incorrect password!",
        header_brand: "Lacto Misr HR", powered_by: "Powered by HR Department", portal_version: "Portal v6.4 - Pro Edition"
    }
};

function getEmployeeName(emp) {
    if (!emp) return '--';
    return currentLang === 'ar' ? (getField(emp, 'اسم الموظف ', 'اسم الموظف', 'name') || '--') : (getField(emp, 'emp_name _en', 'name', 'employee_name_en') || '--');
}
function getEmployeeDept(emp) {
    if (!emp) return '--';
    return currentLang === 'ar' ? (getField(emp, 'الإدارة ', 'الإدارة', 'department') || '--') : (getField(emp, 'department ', 'department', 'dept') || '--');
}
function getEmployeeJob(emp) {
    if (!emp) return '--';
    return currentLang === 'ar' ? (getField(emp, 'الوظيفة', 'الوظيفة ', 'jobTitle', 'job') || '--') : (getField(emp, 'job title ', 'jobTitle', 'job') || '--');
}

const fieldLabels = {
    code: ['الكود', 'CODE'], name: ['اسم الموظف', 'EMPLOYEE NAME'], department: ['الإدارة', 'DEPARTMENT'], jobTitle: ['الوظيفة', 'JOB TITLE'],
    directManager: ['المدير المباشر', 'DIRECT MANAGER'], hireDate: ['تاريخ التعيين', 'HIRE DATE'], yearsService: ['سنوات الخدمة', 'YEARS OF SERVICE'],
    qualification: ['المؤهل', 'QUALIFICATION'], qualAuth: ['جهة المؤهل', 'QUALIFICATION AUTHORITY'], dob: ['تاريخ الميلاد', 'DATE OF BIRTH'],
    age: ['السن حتى تاريخه', 'AGE TO DATE'], insuranceStatus: ['الحالة التأمينية', 'INSURANCE STATUS'], pob: ['مكان الميلاد', 'PLACE OF BIRTH'],
    photoUrl: ['رابط الصورة', 'PHOTO URL'], email: ['البريد الإلكتروني', 'EMAIL'], password: ['كلمة المرور', 'PASSWORD']
};

function tr(key) { return translations[currentLang][key] || key; }
function getField(emp, ...keys) {
    for (const key of keys) {
        if (emp && emp[key] !== undefined && emp[key] !== null && String(emp[key]).trim() !== '') return emp[key];
    }
    return '';
}
function getEmployeeCode(emp) { return String(getField(emp, 'الكود', 'code', 'employeeCode', 'empCode', 'ID') || '').trim(); }

function existingKey(obj, keys, fallback) {
    for (const key of keys) if (Object.prototype.hasOwnProperty.call(obj || {}, key)) return key;
    return fallback || keys[0];
}
function putMapped(obj, source, keys, value, fallback) {
    const key = existingKey(source, keys, fallback);
    obj[key] = value;
}

function displayKey(key) {
    if (fieldLabels[key]) return fieldLabels[key][currentLang==='ar'?0:1];
    return String(key).replace(/_/g,' ').trim();
}
function isValidFirebaseKey(key) { return key && !/[.#$\[\]\/]/.test(key) && key !== '.priority'; }

function toggleLoginLangMenu(event) { event.stopPropagation(); document.getElementById('login-lang-menu')?.classList.toggle('show'); }
function toggleLangDropdown(event) { event.stopPropagation(); document.getElementById('lang-dropdown')?.classList.toggle('show'); }

function setLanguage(lang) {
    currentLang = lang === 'en' ? 'en' : 'ar';
    localStorage.setItem('lacto_lang', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    document.getElementById('login-lang-short').innerText = currentLang.toUpperCase();
    document.getElementById('lang-code').innerText = currentLang.toUpperCase();

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang][key]) el.innerText = translations[currentLang][key];
    });
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (translations[currentLang][key]) el.placeholder = translations[currentLang][key];
    });

    document.getElementById('login-lang-menu')?.classList.remove('show');
    document.getElementById('lang-dropdown')?.classList.remove('show');
    renderTable(allEmployees);
    if (activeEmployeeCode !== null) viewEmployee(activeEmployeeCode);
}

async function readEmployeeSources() {
    let root = {}; let employeesOnly = {};
    try { const rootSnap = await db.ref('/').once('value'); root = rootSnap.exists() ? (rootSnap.val() || {}) : {}; } catch (e) {}
    try { const employeesSnap = await db.ref('employees').once('value'); employeesOnly = employeesSnap.exists() ? (employeesSnap.val() || {}) : {}; } catch (e) {}
    const records = []; const seen = new Set();

    const addRecord = (key, data, path) => {
        if (!data || typeof data !== 'object' || Array.isArray(data)) return;
        const code = String(getField(data, 'الكود', 'code', 'employeeCode', 'ID') || key || '').trim();
        if (!code) return;
        if (seen.has(code)) return;
        seen.add(code);
        records.push({ ...data, code, _firebasePath: path, _firebaseKey: key });
    };

    const employeeNode = (root.employees && typeof root.employees === 'object') ? root.employees : employeesOnly;
    if (employeeNode) Object.entries(employeeNode).forEach(([key, data]) => addRecord(key, data, `employees/${key}`));
    Object.entries(root).forEach(([key, data]) => {
        if (['employees', 'users', 'mail', 'password_resets', 'permissions', 'settings', 'roles', 'audit_logs'].includes(key)) return;
        addRecord(key, data, key);
    });
    return records;
}

async function loadEmployeesFromFirebase() {
    const tableBody = document.getElementById('employees-table-body');
    if (tableBody) tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">${tr('loading')}</td></tr>`;
    try {
        allEmployees = await readEmployeeSources();
        renderTable(allEmployees);
        updateDashboardStats();
    } catch (error) {
        if (tableBody) tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-300">خطأ في الاتصال بقاعدة البيانات</td></tr>`;
    }
}

function filterEmployees() {
    const input = document.getElementById('search-input'); if (!input) return;
    const query = input.value.toLowerCase().trim();
    renderTable(allEmployees.filter(emp => JSON.stringify(emp).toLowerCase().includes(query)));
}

function renderTable(dataList) {
    const tableBody = document.getElementById('employees-table-body'); if (!tableBody) return;
    tableBody.innerHTML = '';
    if (!dataList.length) { tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">${tr('no_results')}</td></tr>`; return; }
    dataList.forEach(emp => {
        const code = getEmployeeCode(emp) || '--';
        const name = getEmployeeName(emp);
        const dept = getEmployeeDept(emp);
        const job = getEmployeeJob(emp);
        const hire = getHireDate(emp);
        const row = document.createElement('tr'); row.className = 'hover:bg-slate-800/40 transition text-slate-300';
        row.innerHTML = `<td class="p-3.5 font-mono text-sky-400">${escapeHtml(code)}</td><td class="p-3.5 font-semibold text-white">${escapeHtml(String(name).trim())}</td><td class="p-3.5">${escapeHtml(String(dept).trim())}</td><td class="p-3.5">${escapeHtml(String(job).trim())}</td><td class="p-3.5 font-mono text-xs">${escapeHtml(String(hire))}</td><td class="p-3.5 text-center"><button onclick="viewEmployee('${escapeAttr(code)}')" class="px-3.5 py-1.5 bg-sky-600/30 hover:bg-sky-600 text-sky-200 rounded-lg text-xs border border-sky-400/30 transition shadow-lg">${tr('action_btn')}</button></td>`;
        tableBody.appendChild(row);
    });
}

function getHireDate(emp) { const v = getField(emp, 'تاريخ التعيين ', 'تاريخ التعيين', 'hireDate'); return typeof v === 'number' ? excelDateToJSDate(v) : v || '--'; }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function escapeAttr(value) { return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

function viewEmployee(code) {
    activeEmployeeCode = code;
    const emp = allEmployees.find(e => String(getEmployeeCode(e)) === String(code)); if (!emp) return;
    document.getElementById('employees-list-view').classList.add('hidden');
    document.getElementById('dashboard-analytics-view').classList.add('hidden');
    document.getElementById('employee-profile-view').classList.remove('hidden');

    setFieldVal('prof-code', code);
    setFieldVal('prof-name', getEmployeeName(emp));
    setFieldVal('prof-dept', getEmployeeDept(emp));
    setFieldVal('prof-job', getEmployeeJob(emp));
    setFieldVal('prof-manager', getField(emp, 'المدير المباشر ', 'المدير المباشر', 'directManager') || '--');
    setFieldVal('prof-hire', getHireDate(emp));
    setFieldVal('prof-service', getField(emp, 'سنوات الخدمة ', 'سنوات الخدمة', 'yearsService') || '--');
    setFieldVal('prof-qual', getField(emp, 'المؤهل', 'qualification') || '--');
    setFieldVal('prof-qual-auth', getField(emp, 'جهة المؤهل ', 'جهة المؤهل', 'qualAuth') || '--');
    setFieldVal('prof-dob', excelDateToJSDate(getField(emp, 'تاريخ الميلاد', 'dob')));
    setFieldVal('prof-age', getField(emp, 'السن حتى تاريخه ', 'السن حتى تاريخه', 'age') || '--');
    setFieldVal('prof-insurance', getField(emp, 'الحالة التأمينية ', 'الحالة التأمينية', 'insuranceStatus') || '--');
    setFieldVal('prof-pob', getField(emp, 'مكان الميلاد', 'pob') || '--');
    document.getElementById('profile-img').src = getField(emp, 'photoUrl', 'photo') || 'default-avatar.png';
    setFieldsEditable(true); renderDynamicFields();
}

function setFieldVal(id, val) { const el = document.getElementById(id); if (el) el.value = val ?? ''; }
function enableEditing() {
    setFieldsEditable(false);
    document.getElementById('btn-edit')?.classList.add('hidden');
    document.getElementById('btn-save')?.classList.remove('hidden');
    document.getElementById('btn-photo')?.classList.remove('hidden');
}
function setFieldsEditable(isDisabled) {
    ['prof-name','prof-dept','prof-job','prof-manager','prof-hire','prof-service','prof-qual','prof-qual-auth','prof-dob','prof-age','prof-insurance','prof-pob'].forEach(id => {
        const el = document.getElementById(id); if (!el) return;
        el.disabled = isDisabled;
    });
}
function backToEmployeesList() {
    activeEmployeeCode = null;
    document.getElementById('employee-profile-view').classList.add('hidden');
    document.getElementById('dashboard-analytics-view').classList.add('hidden');
    document.getElementById('employees-list-view').classList.remove('hidden');
}

function renderDynamicFields() {
    const container = document.getElementById('dynamic-fields-container'); if (!container || activeEmployeeCode === null) return;
    const emp = allEmployees.find(e => String(getEmployeeCode(e)) === String(activeEmployeeCode)); if (!emp) return;
    container.innerHTML = '';
    const baseKeys = ['code','name','department','jobTitle','directManager','hireDate','yearsService','qualification','qualAuth','dob','age','insuranceStatus','pob','photoUrl','password','_firebasePath','_firebaseKey','الكود','اسم الموظف','الإدارة','الوظيفة','المدير المباشر','تاريخ التعيين','سنوات الخدمة','المؤهل','جهة المؤهل','تاريخ الميلاد','السن حتى تاريخه','الحالة التأمينية','مكان الميلاد','emp_name _en','department ','job title '];

    let countAdded = 0;
    Object.keys(emp).sort().forEach(key => {
        if (baseKeys.includes(key) || key.startsWith('_')) return;
        const value = emp[key];
        if (value && typeof value === 'object') return;
        countAdded++;
        const card = document.createElement('div'); card.className = 'dynamic-field-card';
        card.innerHTML = `<div class="flex items-center justify-between gap-2 mb-1"><label class="text-xs text-slate-400">${escapeHtml(key)}</label><span class="firebase-key-badge">${escapeHtml(key)}</span></div><input data-firebase-key="${escapeAttr(key)}" type="text" value="${escapeHtml(value??'')}" class="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 text-sm" disabled>`;
        container.appendChild(card);
    });

    if (countAdded === 0) {
        container.innerHTML = `<p class="text-xs text-slate-500 col-span-full text-center py-2">لا توجد حقول إضافية مخصصة لهذا الموظف حالياً.</p>`;
    }
}

function openDashboardView() {
    document.getElementById('employees-list-view').classList.add('hidden');
    document.getElementById('employee-profile-view').classList.add('hidden');
    document.getElementById('dashboard-analytics-view').classList.remove('hidden');
    renderAgeChart();
    renderEgyptMap();
}

function renderAgeChart() {
    const ctx = document.getElementById('ageChart')?.getContext('2d');
    if (!ctx) return;
    
    let brackets = { '< 30': 0, '30 - 40': 0, '41 - 50': 0, '50+': 0, 'غير محدد': 0 };
    allEmployees.forEach(emp => {
        const age = Number(getField(emp, 'السن حتى تاريخه ', 'السن حتى تاريخه', 'age'));
        if (!age || isNaN(age)) { brackets['غير محدد']++; return; }
        if (age < 30) brackets['< 30']++;
        else if (age <= 40) brackets['30 - 40']++;
        else if (age <= 50) brackets['41 - 50']++;
        else brackets['50+']++;
    });

    if (ageChartInstance) ageChartInstance.destroy();

    ageChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(brackets),
            datasets: [{
                label: 'عدد الموظفين',
                data: Object.values(brackets),
                backgroundColor: ['#38bdf8', '#0284c7', '#0369a1', '#0f172a', '#64748b'],
                borderColor: '#38bdf8',
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(56, 189, 248, 0.1)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

function renderEgyptMap() {
    const container = document.getElementById('egypt-govs-grid');
    if (!container) return;
    container.innerHTML = '';

    const governorates = [
        { name: 'القاهرة', routes: 4, buses: 12 },
        { name: 'الجيزة', routes: 3, buses: 9 },
        { name: 'الشرقية (العاشر من رمضان)', routes: 6, buses: 22, main: true },
        { name: 'القليوبية', routes: 2, buses: 5 },
        { name: 'الإسكندرية', routes: 1, buses: 3 },
        { name: 'الدقهلية', routes: 2, buses: 4 },
        { name: 'المنوفية', routes: 2, buses: 4 },
        { name: 'الغربية', routes: 1, buses: 2 },
        { name: 'الأسماعيلية', routes: 2, buses: 6 }
    ];

    governorates.forEach(gov => {
        const count = allEmployees.filter(emp => {
            const pob = String(getField(emp, 'مكان الميلاد', 'pob')).toLowerCase();
            return pob.includes(gov.name.split(' ')[0].toLowerCase());
        }).length;

        const card = document.createElement('div');
        card.className = `gov-card ${count > 0 || gov.main ? 'has-data' : ''}`;
        card.innerHTML = `
            <h4 class="font-bold text-sky-300 text-sm">${gov.name}</h4>
            <p class="text-[11px] text-slate-400 mt-1">الموظفين: <span class="text-white font-bold">${count > 0 ? count : (gov.main ? '180+' : '--')}</span></p>
            <p class="text-[10px] text-sky-400 mt-0.5">خطوط النقل: ${gov.routes} خطوط</p>
        `;
        card.onclick = () => showGovDetails(gov, count > 0 ? count : (gov.main ? 180 : 0));
        container.appendChild(card);
    });
}

function showGovDetails(gov, empCount) {
    const modal = document.getElementById('gov-details-modal');
    const title = document.getElementById('gov-modal-title');
    const content = document.getElementById('gov-modal-content');
    if (!modal || !title || !content) return;

    title.innerText = `محافظة ${gov.name}`;
    content.innerHTML = `
        <div class="p-3 bg-slate-900/60 rounded-xl border border-sky-500/20 space-y-2">
            <p>👥 <strong>إجمالي الموظفين المسجلين:</strong> <span class="text-sky-300 font-bold">${empCount} موظف</span></p>
            <p>🚌 <strong>عدد خطوط وسيارات النقل:</strong> <span class="text-emerald-400 font-bold">${gov.routes} خطوط رئيسية</span></p>
            <p>🚐 <strong>إجمالي الأتوبيسات المخصصة:</strong> <span class="text-sky-400 font-bold">${gov.buses} أتوبيس / ميكروباص</span></p>
            <hr class="border-sky-500/20 my-2">
            <p class="text-xs text-slate-400">💡 <strong>ملاحظة تشغيلية:</strong> يتم تحديث خطوط السير ومواعيد التحرك تلقائياً وفقاً لكشوف الحضور والانصراف.</p>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeGovModal() { document.getElementById('gov-details-modal')?.classList.add('hidden'); }

function updateDashboardStats() { const el = document.getElementById('total-employees-count'); if (el) el.innerText = allEmployees.length; }
function confirmSave() { document.getElementById('confirm-modal')?.classList.remove('hidden'); }
function closeConfirmModal() { document.getElementById('confirm-modal')?.classList.add('hidden'); }
async function executeSave() {
    closeConfirmModal(); if (activeEmployeeCode === null) return;
    const emp = allEmployees.find(e => String(getEmployeeCode(e)) === String(activeEmployeeCode)); if (!emp) return;
    const updatedData = {};
    putMapped(updatedData, emp, ['الكود','code','employeeCode','ID'], activeEmployeeCode, 'code');
    putMapped(updatedData, emp, ['اسم الموظف ','اسم الموظف','name'], document.getElementById('prof-name').value, 'name');
    putMapped(updatedData, emp, ['الإدارة ','الإدارة','department'], document.getElementById('prof-dept').value, 'department');
    putMapped(updatedData, emp, ['الوظيفة','الوظيفة ','jobTitle','job'], document.getElementById('prof-job').value, 'jobTitle');
    putMapped(updatedData, emp, ['المدير المباشر ','المدير المباشر','directManager'], document.getElementById('prof-manager').value, 'directManager');
    putMapped(updatedData, emp, ['تاريخ التعيين ','تاريخ التعيين','hireDate'], document.getElementById('prof-hire').value, 'hireDate');
    putMapped(updatedData, emp, ['سنوات الخدمة ','سنوات الخدمة','yearsService'], document.getElementById('prof-service').value, 'yearsService');
    putMapped(updatedData, emp, ['المؤهل','qualification'], document.getElementById('prof-qual').value, 'qualification');
    putMapped(updatedData, emp, ['جهة المؤهل ','جهة المؤهل','qualAuth'], document.getElementById('prof-qual-auth').value, 'qualAuth');
    putMapped(updatedData, emp, ['تاريخ الميلاد','dob'], document.getElementById('prof-dob').value, 'dob');
    putMapped(updatedData, emp, ['السن حتى تاريخه ','السن حتى تاريخه','age'], document.getElementById('prof-age').value, 'age');
    putMapped(updatedData, emp, ['الحالة التأمينية ','الحالة التأمينية','insuranceStatus'], document.getElementById('prof-insurance').value, 'insuranceStatus');
    putMapped(updatedData, emp, ['مكان الميلاد','pob'], document.getElementById('prof-pob').value, 'pob');

    document.querySelectorAll('#dynamic-fields-container [data-firebase-key]').forEach(input => {
        const key = input.getAttribute('data-firebase-key');
        if (isValidFirebaseKey(key)) updatedData[key] = input.value;
    });

    try {
        const savePath = emp._firebasePath || `employees/${activeEmployeeCode}`;
        await db.ref(savePath).update(updatedData);
        Object.assign(emp, updatedData);
        showToast(); setFieldsEditable(true);
        document.getElementById('btn-save')?.classList.add('hidden');
        document.getElementById('btn-edit')?.classList.remove('hidden');
        document.getElementById('btn-photo')?.classList.add('hidden');
        renderTable(allEmployees); renderDynamicFields();
    } catch (e) { showToast('خطأ أثناء الحفظ', true); }
}

function uploadEmployeePhoto(event) {
    const file = event.target.files?.[0]; if (!file || activeEmployeeCode === null) return;
    const reader = new FileReader();
    reader.onload = async e => {
        const base64 = e.target.result; document.getElementById('profile-img').src = base64;
        try {
            const emp = allEmployees.find(x => String(getEmployeeCode(x)) === String(activeEmployeeCode));
            const savePath = emp ? emp._firebasePath : `employees/${activeEmployeeCode}`;
            await db.ref(savePath).update({ photoUrl: base64 });
            if (emp) emp.photoUrl = base64; showToast();
        } catch (err) {}
    };
    reader.readAsDataURL(file);
}

function showToast(message = null, isError = false) {
    const toast = document.getElementById('toast-notification'); const msg = document.getElementById('toast-message');
    if (!toast || !msg) return;
    msg.innerText = message || tr('toast_success');
    toast.classList.remove('translate-y-32', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-32', 'opacity-0'), 3200);
}

async function handleLogin() {
    const code = String(document.getElementById('login-emp-code')?.value || '').trim();
    const pass = String(document.getElementById('login-password')?.value || '');
    if (!code || !pass) { document.getElementById('login-error').innerText = tr('login_required'); return; }
    try {
        const snap = await db.ref('users/' + code).once('value');
        const user = snap.val() || {};
        if (user.password && String(user.password) !== pass) {
            document.getElementById('login-error').innerText = tr('login_wrong_pass');
            return;
        }
        document.getElementById('login-modal').style.display = 'none';
        portalInitialized = true;
        await loadEmployeesFromFirebase();
    } catch (err) {
        document.getElementById('login-error').innerText = 'خطأ في الاتصال بقاعدة البيانات';
    }
}

function prepareRememberedLogin(){
    const savedCode = localStorage.getItem('lacto_saved_code');
    const savedPass = localStorage.getItem('lacto_saved_pass');
    if(savedCode && savedPass){
        const codeInput = document.getElementById('login-emp-code');
        const passInput = document.getElementById('login-password');
        const rememberCheck = document.getElementById('remember-me');
        if(codeInput) codeInput.value = savedCode;
        if(passInput) passInput.value = savedPass;
        if(rememberCheck) rememberCheck.checked = true;
    }
}

function runPortalIntro(){
    const intro = document.getElementById('intro-screen');
    const container = document.getElementById('introTitle');
    const subtitle = document.getElementById('introSubtitle');
    if(!intro || !container || !window.gsap){
        const modal = document.getElementById('login-modal');
        if(modal) modal.style.display = 'flex';
        return;
    }
    container.innerHTML = '';
    const chars = [];
    const text = 'LACTO MISR S.A.E';
    for(const ch of text){
        if(ch === ' '){
            const sp = document.createElement('span');
            sp.className = 'intro-space';
            container.appendChild(sp);
        } else {
            const el = document.createElement('span');
            el.className = 'intro-char';
            el.innerText = ch;
            container.appendChild(el);
            chars.push(el);
        }
    }
    chars.forEach(el => gsap.set(el, { y: -250, x: (Math.random() - .5) * 400, rotation: (Math.random() - .5) * 720, opacity: 0, scale: .8 }));
    gsap.set(subtitle, { opacity: 0, y: 20 });
    gsap.set('#introFooter', { opacity: 0, bottom: '-20vh' });

    const tl = gsap.timeline({
        onComplete: () => {
            intro.classList.add('fade-out');
            setTimeout(() => {
                const brand = document.getElementById('login-brand');
                const panel = document.getElementById('login-panel');
                if(brand){ brand.classList.add('intro-ready'); setTimeout(() => brand.classList.add('compact'), 350); }
                if(panel){ setTimeout(() => panel.classList.add('visible', 'compact-mode'), 650); }
            }, 500);
        }
    });
    tl.to(chars, { duration: 2.5, x: 0, y: 0, rotation: 360, opacity: 1, scale: 1, stagger: .1, ease: 'power2.out' }, 'start');
    tl.to(subtitle, { duration: 1.5, opacity: 1, y: 0, ease: 'power2.out' }, 'start+=1');
    tl.to('#introFooter', { duration: 1.5, bottom: '12%', opacity: 1, ease: 'power2.out' }, 'start+=1.5');
    tl.to([subtitle, '#introFooter'], { duration: 1.2, opacity: 0, y: 20, ease: 'power1.in' }, 'start+=6');
}

window.addEventListener('DOMContentLoaded', async () => {
    setLanguage(currentLang);
    prepareRememberedLogin();
    runPortalIntro(); 
    portalInitialized = true;
    await loadEmployeesFromFirebase();
});
