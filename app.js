// --- دالة إخفاء الإنترو الآمنة ---
function dismissIntro() {
    const introScreen = document.getElementById('intro-screen');
    if (introScreen) {
        introScreen.classList.add('fade-out');
        setTimeout(() => introScreen.remove(), 600);
    }
}

window.addEventListener('load', () => {
    setTimeout(dismissIntro, 2500);
});
setTimeout(dismissIntro, 4000);

// دوال تحويل وتنسيق تواريخ إكسيل
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

// التبديل الاحترافي للعين الشقية مع SVG
function togglePasswordVisibility() {
    const passInput = document.getElementById('login-password');
    const svgIcon = document.getElementById('eye-icon');
    if (!passInput) return;
    if (passInput.type === 'password') {
        passInput.type = 'text';
        if (svgIcon) svgIcon.innerText = '🙈';
    } else {
        passInput.type = 'password';
        if (svgIcon) svgIcon.innerText = '👁️';
    }
}

// دوال مودال نسيت كلمة المرور
function openForgotPassModal() {
    const modal = document.getElementById('forgot-pass-modal');
    if (modal) modal.classList.remove('hidden');
}
function closeForgotPassModal() {
    const modal = document.getElementById('forgot-pass-modal');
    if (modal) modal.classList.add('hidden');
}

// إعدادات فايربيس الرسمية
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
    firebase.analytics();
}
const db = firebase.database();

let allEmployees = [];
let currentLang = localStorage.getItem('lacto_lang') || 'ar';
let activeEmployeeCode = null;

// قاموس الترجمات الشامل
const translations = {
    ar: {
        admin: "مسؤول النظام",
        control_panel: "غرفة التحكم",
        total_emp: "إجمالي العاملين",
        active_depts: "الإدارات النشطة",
        system_status: "حالة النظام",
        connected: "مستقر (متصل بـ Firebase)",
        emp_list: "قائمة العاملين بالقاعدة",
        search_placeholder: "بحث بالاسم أو الكود...",
        th_code: "الكود",
        th_name: "اسم الموظف",
        th_dept: "الإدارة",
        th_job: "الوظيفة",
        th_hire: "تاريخ التعيين",
        th_actions: "الإجراءات",
        loading: "شركاء فى رحلة نمو طفلك...",
        no_results: "لا توجد نتائج مطابقة للبحث",
        action_btn: "عرض الملف",
        back_btn: "← العودة للقائمة",
        edit_btn: "تعديل البيانات",
        save_btn: "حفظ",
        confirm_title: "هل ترغب في حفظ التعديلات؟",
        manager_label: "المدير المباشر",
        toast_success: "تم حفظ التعديلات بنجاح وتحديث Firebase"
    },
    en: {
        admin: "System Admin",
        control_panel: "Control Room",
        total_emp: "Total Employees",
        active_depts: "Active Departments",
        system_status: "System Status",
        connected: "Stable (Connected to Firebase)",
        emp_list: "Database Employees List",
        search_placeholder: "Search by name or code...",
        th_code: "CODE",
        th_name: "EMPLOYEE NAME",
        th_dept: "DEPARTMENT",
        th_job: "JOB TITLE",
        th_hire: "HIRE DATE",
        th_actions: "ACTIONS",
        loading: "Partners in your child's growth...",
        no_results: "No matching results found",
        action_btn: "View Profile",
        back_btn: "Back to List",
        edit_btn: "Edit Data",
        save_btn: "Save",
        confirm_title: "Do you want to save changes?",
        manager_label: "Direct Manager",
        toast_success: "Changes saved successfully & synced with Firebase"
    }
};

// تسجيل الدخول
function handleLogin() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.style.transition = 'opacity 0.3s ease';
        loginModal.style.opacity = '0';
        setTimeout(() => {
            loginModal.style.display = 'none';
        }, 300);
    }
}

// تحميل بيانات الموظفين عند بدء التشغيل
document.addEventListener('DOMContentLoaded', () => {
    fetch('clean_employees_data.json')
        .then(response => response.json())
        .then(data => {
            allEmployees = data.filter(emp => (emp["الكود"] || emp["code"]) && (emp["اسم الموظف "] || emp["emp_name _en"]));
            renderTable(allEmployees);
            updateDashboardStats();
        })
        .catch(error => console.error('Error loading employee data:', error));
});

// فتح وإغلاق قائمة اللغات
function toggleLangMenu(event) {
  if (event) event.stopPropagation();
  const langMenu = document.getElementById('langMenu');
  if (langMenu) langMenu.classList.toggle('show');
}

// تغيير اللغة وتحديث الواجهة
function selectLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lacto_lang', lang);

  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);

  const langShort = document.getElementById('current-lang-short');
  if (langShort) {
    langShort.innerText = lang.toUpperCase();
  }

  const langMenu = document.getElementById('langMenu');
  if (langMenu) {
    langMenu.classList.remove('show');
  }

  updateContentTranslations();
}

// دالة تحديث الترجمات والعناصر
function updateContentTranslations() {
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput && translations[currentLang]) {
        searchInput.placeholder = translations[currentLang]['search_placeholder'];
    }

    renderTable(allEmployees);
    
    if (activeEmployeeCode !== null) {
        viewEmployee(activeEmployeeCode);
    }
}

// البحث الفوري
function filterEmployees() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase().trim();
    
    const filtered = allEmployees.filter(emp => {
        const code = String(emp["الكود"] || emp["code"] || '').toLowerCase();
        const nameAr = String(emp["اسم الموظف "] || emp["اسم الموظف"] || '').toLowerCase();
        const nameEn = String(emp["emp_name _en"] || '').toLowerCase();
        return code.includes(query) || nameAr.includes(query) || nameEn.includes(query);
    });
    renderTable(filtered);
}

// عرض جدول الموظفين
function renderTable(dataList) {
    const tableBody = document.getElementById('employees-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (dataList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">${translations[currentLang].no_results}</td></tr>`;
        return;
    }

    dataList.forEach(emp => {
        const empCode = emp["الكود"] || emp["code"] || '--';
        
        let empName = currentLang === 'ar' ? (emp["اسم الموظف "] || emp["اسم الموظف"] || '--') : (emp["emp_name _en"] || emp["اسم الموظف "] || '--');
        let empDept = currentLang === 'ar' ? (emp["الإدارة "] || emp["الإدارة"] || '--') : (emp["department "] || emp["department"] || '--');
        let empJob = currentLang === 'ar' ? (emp["الوظيفة"] || emp["الوظيفة "] || '--') : (emp["job title "] || emp["job title"] || '--');
        let rawHireDate = emp["تاريخ التعيين "] || emp["تاريخ التعيين"] || emp["date_of_hiring "] || '--';
        let empHireDate = typeof rawHireDate === 'number' ? excelDateToJSDate(rawHireDate) : rawHireDate;

        const row = document.createElement('tr');
        row.className = "hover:bg-slate-800/40 transition text-slate-300";
        row.innerHTML = `
            <td class="p-3.5 font-mono text-sky-400">${empCode}</td>
            <td class="p-3.5 font-semibold text-white">${empName.trim()}</td>
            <td class="p-3.5">${empDept.trim()}</td>
            <td class="p-3.5">${empJob.trim()}</td>
            <td class="p-3.5 font-mono text-xs">${empHireDate}</td>
            <td class="p-3.5 text-center">
                <button onclick="viewEmployee('${empCode}')" class="px-3.5 py-1.5 bg-sky-600/30 hover:bg-sky-600 text-sky-200 rounded-lg text-xs border border-sky-400/30 transition shadow-lg">${translations[currentLang].action_btn}</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// عرض ملف الموظف الكامل
function viewEmployee(code) {
    activeEmployeeCode = code;
    const emp = allEmployees.find(e => String(e["الكود"] || e["code"]) === String(code));
    if (!emp) return;
    
    document.getElementById('employees-list-view').style.display = 'none';
    document.getElementById('employee-profile-view').style.display = 'block';

    setFieldVal('prof-code', code);
    setFieldVal('prof-name', (currentLang === 'ar' ? (emp["اسم الموظف "] || emp["اسم الموظف"]) : (emp["emp_name _en"] || emp["اسم الموظف "])));
    setFieldVal('prof-dept', (currentLang === 'ar' ? (emp["الإدارة "] || emp["الإدارة"]) : (emp["department "] || emp["department"])));
    setFieldVal('prof-job', (currentLang === 'ar' ? (emp["الوظيفة"] || emp["الوظيفة "]) : (emp["job title "] || emp["job title"])));
    setFieldVal('prof-manager', (currentLang === 'ar' ? (emp["المدير المباشر "] || emp["المدير المباشر"]) : (emp["direct manager "] || emp["direct manager"])));

    document.getElementById('profile-img').src = emp["photoUrl"] || 'default-avatar.png';
    
    document.getElementById('btn-save').classList.add('hidden');
    document.getElementById('btn-edit').classList.remove('hidden');
    setFieldsEditable(true);
}

function setFieldVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}

function enableEditing() {
    setFieldsEditable(false);
    document.getElementById('btn-edit').classList.add('hidden');
    document.getElementById('btn-save').classList.remove('hidden');
}

function setFieldsEditable(isDisabled) {
    const fields = ['prof-name', 'prof-dept', 'prof-job', 'prof-manager'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.disabled = isDisabled;
        }
    });
}

function backToEmployeesList() {
    activeEmployeeCode = null;
    document.getElementById('employee-profile-view').style.display = 'none';
    document.getElementById('employees-list-view').style.display = 'block';
}

function confirmSave() {
    if (activeEmployeeCode === null) return;
    showToast();
}

function showToast() {
    const toast = document.getElementById('toast-notification');
    const msg = document.getElementById('toast-message');
    if (toast && msg) {
        msg.innerText = translations[currentLang]['toast_success'];
        toast.classList.remove('translate-y-32', 'opacity-0');
        setTimeout(() => {
            toast.classList.add('translate-y-32', 'opacity-0');
        }, 3000);
    }
}

function updateDashboardStats() {
    const totalCountEl = document.getElementById('total-employees-count');
    if (totalCountEl) totalCountEl.innerText = allEmployees.length;
}

// إغلاق القائمة المنسدلة عند الضغط في أي مكان خارجها
window.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-dropdown-container')) {
        const langMenu = document.getElementById('langMenu');
        if (langMenu) {
            langMenu.classList.remove('show');
        }
    }
});
