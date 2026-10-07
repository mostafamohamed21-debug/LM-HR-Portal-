// دوال تحويل وتنسيق تواريخ إكسيل
function excelDateToJSDate(serial) {
    if (!serial || typeof serial !== 'number') return serial || '--';
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400 * 1000;
    const date_info = new Date(utc_value);
    if (isNaN(date_info.getTime())) return serial;
    
    const year = date_info.getUTCFullYear();// دوال تحويل وتنسيق تواريخ إكسيل
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

// إعدادات فايربيس الرسمية الخاصة بك
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

// قاموس الترجمات الشامل
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
        change_photo: "تعديل الصورة",
        sec_job: "البيانات الوظيفية",
        manager_label: "المدير المباشر",
        service_years: "سنوات الخدمة",
        sec_qual: "المؤهل العلمي",
        qual_label: "المؤهل",
        qual_auth: "جهة المؤهل",
        sec_personal: "ال
    const month = String(date_info.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date_info.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

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
        save_btn: "حفظ التعديلات",
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
        save_btn: "Save Changes",
        toast_success: "Changes saved successfully & synced with Firebase"
    }
};

// تسجيل الدخول
// دالة تسجيل الدخول المضبوطة
function handleLogin() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.style.transition = 'opacity 0.3s ease';
        loginModal.style.opacity = '0';
        setTimeout(() => {
            loginModal.style.display = 'none';
        }, 300);
    } else {
        // لو الـ ID مش مطبق، نقفل أي شاشة دخول مفتوحة بالـ class
        const modals = document.querySelectorAll('#login-modal, .login-modal');
        modals.forEach(m => m.style.display = 'none');
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
    
    // لو صفحة الملف مفتوحة، نحدث بياناتها حسب اللغة الجديدة
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

// عرض ملف الموظف الكامل في صفحة مستقلة داخل البورتال
function viewEmployee(code) {
    activeEmployeeCode = code;
    const emp = allEmployees.find(e => String(e["الكود"] || e["code"]) === String(code));
    if (!emp) return;
    
    // تبديل العرض من القائمة إلى الملف الوظيفي
    document.getElementById('employees-list-view').style.display = 'none';
    document.getElementById('employee-profile-view').style.display = 'block';

    // تعبئة الحقول القابلة للتعديل
    document.getElementById('prof-code').value = code;
    document.getElementById('prof-name').value = (currentLang === 'ar' ? (emp["اسم الموظف "] || emp["اسم الموظف"]) : (emp["emp_name _en"] || emp["اسم الموظف "])) || '';
    document.getElementById('prof-dept').value = (currentLang === 'ar' ? (emp["الإدارة "] || emp["الإدارة"]) : (emp["department "] || emp["department"])) || '';
    document.getElementById('prof-job').value = (currentLang === 'ar' ? (emp["الوظيفة"] || emp["الوظيفة "]) : (emp["job title "] || emp["job title"])) || '';
    document.getElementById('prof-manager').value = (currentLang === 'ar' ? (emp["المدير المباشر "] || emp["المدير المباشر"]) : (emp["direct manager "] || emp["direct manager"])) || '';
    document.getElementById('prof-hire').value = excelDateToJSDate(emp["تاريخ التعيين "] || emp["تاريخ التعيين"] || emp["date_of_hiring "]);
    document.getElementById('prof-service').value = emp["سنوات الخدمة "] || emp["years service"] || '';
    document.getElementById('prof-qual').value = (currentLang === 'ar' ? emp["المؤهل"] : emp["qualification"]) || '';
    document.getElementById('prof-qual-auth').value = (currentLang === 'ar' ? (emp["جهة المؤهل "] || emp["جهة المؤهل"]) : (emp["qulification issuing authority"] || emp["issuer"])) || '';
    document.getElementById('prof-dob').value = excelDateToJSDate(emp["تاريخ الميلاد"] || emp["dob"]);
    document.getElementById('prof-age').value = emp["السن حتى تاريخه "] || emp["age to date"] || '';
    document.getElementById('prof-insurance').value = (currentLang === 'ar' ? (emp["الحالة التأمينية "] || emp["الحالة التأمينية"]) : (emp["insurance status "] || emp["insurance status"])) || '';
    document.getElementById('prof-pob').value = (currentLang === 'ar' ? (emp["مكان الميلاد"] || emp["مكان الميلاد"]) : (emp["pob "] || emp["pob"])) || '';

    // تعيين الصورة الشخصية (لو محفوظة قبل كده)
    const imgEl = document.getElementById('profile-img');
    imgEl.src = emp["photoUrl"] || 'default-avatar.png';
}

// العودة للقائمة الرئيسية
function backToEmployeesList() {
    activeEmployeeCode = null;
    document.getElementById('employee-profile-view').style.display = 'none';
    document.getElementById('employees-list-view').style.display = 'block';
}

// رفع وتحديث الصورة الشخصية وحفظها في Firebase
function uploadEmployeePhoto(event) {
    const file = event.target.files[0];
    if (!file || activeEmployeeCode === null) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        document.getElementById('profile-img').src = base64Image;

        // تحديث البيانات محلياً وفي Firebase
        const emp = allEmployees.find(e => String(e["الكود"] || e["code"]) === String(activeEmployeeCode));
        if (emp) {
            emp["photoUrl"] = base64Image;
            // محاكاة / تفعيل الحفظ المباشر على Firebase
            if (typeof firebase !== 'undefined' && firebase.database) {
                firebase.database().ref('employees/' + activeEmployeeCode).update({ photoUrl: base64Image });
            }
        }
        showToast();
    };
    reader.readAsDataURL(file);
}

// حفظ التعديلات على البيانات في الخانات وفي Firebase
function saveEmployeeChanges() {
    if (activeEmployeeCode === null) return;

    const emp = allEmployees.find(e => String(e["الكود"] || e["code"]) === String(activeEmployeeCode));
    if (!emp) return;

    // تحديث القيم من الحقول التفاعلية
    if (currentLang === 'ar') {
        emp["اسم الموظف "] = document.getElementById('prof-name').value;
        emp["الإدارة "] = document.getElementById('prof-dept').value;
        emp["الوظيفة"] = document.getElementById('prof-job').value;
        emp["المدير المباشر "] = document.getElementById('prof-manager').value;
    } else {
        emp["emp_name _en"] = document.getElementById('prof-name').value;
        emp["department "] = document.getElementById('prof-dept').value;
        emp["job title "] = document.getElementById('prof-job').value;
        emp["direct manager "] = document.getElementById('prof-manager').value;
    }

    // إرسال التحديث لـ Firebase
    if (typeof firebase !== 'undefined' && firebase.database) {
        firebase.database().ref('employees/' + activeEmployeeCode).update({
            name: document.getElementById('prof-name').value,
            department: document.getElementById('prof-dept').value,
            jobTitle: document.getElementById('prof-job').value
        });
    }

    showToast();
    renderTable(allEmployees);
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

// إغلاق القائمة المنسدلة للغة
window.addEventListener('click', (e) => {
    if (!e.target.closest('button[onclick="toggleLangDropdown()"]')) {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown && !dropdown.classList.contains('hidden')) dropdown.classList.add('hidden');
    }
});
