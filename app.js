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

// تهيئة Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
}
const db = firebase.database();

let allEmployees = [];
let currentLang = 'ar';
let activeEmployeeCode = null;

// قاموس الترجمات الشامل للواجهة
const translations = {
    ar: {
        admin: "مسؤول النظام",
        control_panel: "غرفة التحكم",
        nav_home: "الرئيسية والموظفين",
        nav_depts: "الإدارات والأقسام",
        nav_attendance: "الحضور والإنصراف",
        nav_reports: "التقارير والإحصائيات",
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
        loading: "جاري جلب البيانات من القاعدة...",
        no_results: "لا توجد نتائج مطابقة للبحث",
        action_btn: "عرض الملف",
        back_btn: "← العودة للقائمة",
        profile_title: "الملف الوظيفي الشامل",
        edit_btn: "تعديل البيانات",
        save_btn: "حفظ",
        yes_btn: "نعم",
        cancel_btn: "إلغاء",
        confirm_title: "هل ترغب في حفظ التعديلات؟",
        change_photo: "تعديل الصورة",
        sec_job: "البيانات الوظيفية",
        manager_label: "المدير المباشر",
        service_years: "سنوات الخدمة",
        sec_qual: "المؤهل العلمي",
        qual_label: "المؤهل",
        qual_auth: "جهة المؤهل",
        sec_personal: "البيانات الشخصية",
        dob_label: "تاريخ الميلاد",
        age_label: "السن حتى تاريخه",
        insurance_label: "الحالة التأمينية",
        pob_label: "مكان الميلاد",
        toast_success: "تم حفظ التعديلات بنجاح وتحديث Firebase"
    },
    en: {
        admin: "System Admin",
        control_panel: "Control Room",
        nav_home: "Home & Employees",
        nav_depts: "Departments",
        nav_attendance: "Attendance & Departure",
        nav_reports: "Reports & Analytics",
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
        loading: "Fetching data from database...",
        no_results: "No matching results found",
        action_btn: "View Profile",
        back_btn: "← Back to List",
        profile_title: "Comprehensive Employee Profile",
        edit_btn: "Edit Data",
        save_btn: "Save",
        yes_btn: "Yes",
        cancel_btn: "Cancel",
        confirm_title: "Do you want to save changes?",
        change_photo: "Change Photo",
        sec_job: "Job Details",
        manager_label: "Direct Manager",
        service_years: "Years of Service",
        sec_qual: "Education Qualification",
        qual_label: "Qualification",
        qual_auth: "Issuing Authority",
        sec_personal: "Personal Data",
        dob_label: "Date of Birth",
        age_label: "Age to Date",
        insurance_label: "Insurance Status",
        pob_label: "Place of Birth",
        toast_success: "Changes saved successfully & synced with Firebase"
    }
};

// تسجيل الدخول وإخفاء شاشة اللوجن
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

// تحميل البيانات عند فتح الصفحة
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

// فتح وإغلاق القائمة المنسدلة للغة
function toggleLangDropdown() {
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
}

// تغيير اللغة
function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.add('hidden');

    const langFlag = document.getElementById('lang-flag');
    const langCode = document.getElementById('lang-code');
    if (langFlag && langCode) {
        langFlag.innerText = lang === 'ar' ? '🇪🇬' : '🇬🇧';
        langCode.innerText = lang === 'ar' ? 'AR' : 'EN';
    }

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = translations[currentLang]['search_placeholder'];

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

    // تعبئة البيانات وجعلها مغلقة افتراضياً (disabled)
    setFieldVal('prof-code', code);
    setFieldVal('prof-name', (currentLang === 'ar' ? (emp["اسم الموظف "] || emp["اسم الموظف"]) : (emp["emp_name _en"] || emp["اسم الموظف "])));
    setFieldVal('prof-dept', (currentLang === 'ar' ? (emp["الإدارة "] || emp["الإدارة"]) : (emp["department "] || emp["department"])));
    setFieldVal('prof-job', (currentLang === 'ar' ? (emp["الوظيفة"] || emp["الوظيفة "]) : (emp["job title "] || emp["job title"])));
    setFieldVal('prof-manager', (currentLang === 'ar' ? (emp["المدير المباشر "] || emp["المدير المباشر"]) : (emp["direct manager "] || emp["direct manager"])));
    setFieldVal('prof-hire', excelDateToJSDate(emp["تاريخ التعيين "] || emp["تاريخ التعيين"] || emp["date_of_hiring "]));
    setFieldVal('prof-service', emp["سنوات الخدمة "] || emp["years service"] || '');
    setFieldVal('prof-qual', (currentLang === 'ar' ? emp["المؤهل"] : emp["qualification"]) || '');
    setFieldVal('prof-qual-auth', (currentLang === 'ar' ? (emp["جهة المؤهل "] || emp["جهة المؤهل"]) : (emp["qulification issuing authority"] || emp["issuer"])));
    setFieldVal('prof-dob', excelDateToJSDate(emp["تاريخ الميلاد"] || emp["dob"]));
    setFieldVal('prof-age', emp["السن حتى تاريخه "] || emp["age to date"] || '');
    setFieldVal('prof-insurance', (currentLang === 'ar' ? (emp["الحالة التأمينية "] || emp["الحالة التأمينية"]) : (emp["insurance status "] || emp["insurance status"])));
    setFieldVal('prof-pob', (currentLang === 'ar' ? (emp["مكان الميلاد"] || emp["مكان الميلاد"]) : (emp["pob "] || emp["pob"])));

    document.getElementById('profile-img').src = emp["photoUrl"] || 'default-avatar.png';
    
    // إخفاء زرار الحفظ وإظهار زرار التعديل عند فتح الملف
    document.getElementById('btn-save').classList.add('hidden');
    document.getElementById('btn-edit').classList.remove('hidden');
    document.getElementById('btn-photo').classList.add('hidden');
    setFieldsEditable(true); // قفل الحانات افتراضياً
}

function setFieldVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}

// تفعيل وضع التعديل عند الضغط على زر "تعديل البيانات"
function enableEditing() {
    setFieldsEditable(false); // إزالة الـ disabled
    document.getElementById('btn-edit').classList.add('hidden');
    document.getElementById('btn-save').classList.remove('hidden');
    document.getElementById('btn-photo').classList.remove('hidden');
}

function setFieldsEditable(isDisabled) {
    const fields = ['prof-name', 'prof-dept', 'prof-job', 'prof-manager', 'prof-hire', 'prof-service', 'prof-qual', 'prof-qual-auth', 'prof-dob', 'prof-age', 'prof-insurance', 'prof-pob'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.disabled = isDisabled;
            if (isDisabled) {
                el.classList.add('bg-slate-900/50', 'border-slate-700');
                el.classList.remove('bg-slate-900/90', 'border-sky-500/50');
            } else {
                el.classList.remove('bg-slate-900/50', 'border-slate-700');
                el.classList.add('bg-slate-900/90', 'border-sky-500/50');
            }
        }
    });
}

// العودة للقائمة الرئيسية
function backToEmployeesList() {
    activeEmployeeCode = null;
    document.getElementById('employee-profile-view').style.display = 'none';
    document.getElementById('employees-list-view').style.display = 'block';
}

// رفع وتحديث الصورة الشخصية وحفظها في Firebase مباشر
function uploadEmployeePhoto(event) {
    const file = event.target.files[0];
    if (!file || activeEmployeeCode === null) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        document.getElementById('profile-img').src = base64Image;

        const emp = allEmployees.find(e => String(e["الكود"] || e["code"]) === String(activeEmployeeCode));
        if (emp) {
            emp["photoUrl"] = base64Image;
            if (typeof firebase !== 'undefined' && firebase.database) {
                firebase.database().ref('employees/' + activeEmployeeCode).update({ photoUrl: base64Image });
            }
        }
        showToast();
    };
    reader.readAsDataURL(file);
}

// إظهار نافذة تأكيد الحفظ
function confirmSave() {
    const modal = document.getElementById('confirm-modal');
    if (modal) {
        document.getElementById('confirm-title').innerText = translations[currentLang]['confirm_title'];
        modal.classList.remove('hidden');
    }
}

function closeConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    if (modal) modal.classList.add('hidden');
}

// التنفيذ الفعلي للحفظ في Firebase
function executeSave() {
    closeConfirmModal();
    if (activeEmployeeCode === null) return;

    const emp = allEmployees.find(e => String(e["الكود"] || e["code"]) === String(activeEmployeeCode));
    if (!emp) return;

    const updatedData = {
        code: activeEmployeeCode,
        name: document.getElementById('prof-name').value,
        department: document.getElementById('prof-dept').value,
        jobTitle: document.getElementById('prof-job').value,
        directManager: document.getElementById('prof-manager').value,
        hireDate: document.getElementById('prof-hire').value,
        yearsService: document.getElementById('prof-service').value,
        qualification: document.getElementById('prof-qual').value,
        qualAuth: document.getElementById('prof-qual-auth').value,
        dob: document.getElementById('prof-dob').value,
        age: document.getElementById('prof-age').value,
        insuranceStatus: document.getElementById('prof-insurance').value,
        pob: document.getElementById('prof-pob').value,
        photoUrl: document.getElementById('profile-img').src
    };

    // حفظ في Firebase Realtime Database
    if (typeof firebase !== 'undefined' && firebase.database) {
        firebase.database().ref('employees/' + activeEmployeeCode).update(updatedData)
        .then(() => {
            showToast();
            setFieldsEditable(true); // إعادة قفل الخانات بعد الحفظ
            document.getElementById('btn-save').classList.add('hidden');
            document.getElementById('btn-edit').classList.remove('hidden');
            document.getElementById('btn-photo').classList.add('hidden');
            renderTable(allEmployees);
        })
        .catch(error => {
            console.error("Firebase save error:", error);
        });
    }
}

// إظهار رسالة الحفظ الشيك (Toast Notification)
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

// تحديث الإحصائيات
function updateDashboardStats() {
    const totalCountEl = document.getElementById('total-employees-count');
    if (totalCountEl) totalCountEl.innerText = allEmployees.length;
}

// إغلاق القائمة المنسدلة للغة عند الضغط خارجها
window.addEventListener('click', (e) => {
    if (!e.target.closest('button[onclick="toggleLangDropdown()"]')) {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown && !dropdown.classList.contains('hidden')) dropdown.classList.add('hidden');
    }
});
