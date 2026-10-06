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

let allEmployees = [];
let currentLang = 'ar';

// قاموس الترجمات الشامل للواجهة وعناصر الـ HTML
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
        action_btn: "عرض الملف"
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
        action_btn: "View Profile"
    }
};

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
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

// تغيير اللغة (عربي / إنجليزي)
function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.add('hidden');

    const langFlag = document.getElementById('lang-flag');
    const langCode = document.getElementById('lang-code');
    if (langFlag && langCode) {
        if (lang === 'ar') {
            langFlag.innerText = '🇪🇬';
            langCode.innerText = 'AR';
        } else {
            langFlag.innerText = '🇬🇧';
            langCode.innerText = 'EN';
        }
    }

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.placeholder = translations[currentLang]['search_placeholder'];
    }

    renderTable(allEmployees);
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

// عرض جدول الموظفين بدقة تامّة للغتين
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
        
        let empName = "--";
        let empDept = "--";
        let empJob = "--";
        let rawHireDate = emp["تاريخ التعيين "] || emp["تاريخ التعيين"] || emp["date_of_hiring "] || '--';
        let empHireDate = typeof rawHireDate === 'number' ? excelDateToJSDate(rawHireDate) : rawHireDate;

        if (currentLang === 'ar') {
            empName = (emp["اسم الموظف "] || emp["اسم الموظف"] || '--').trim();
            empDept = (emp["الإدارة "] || emp["الإدارة"] || '--').trim();
            empJob = (emp["الوظيفة"] || emp["الوظيفة "] || '--').trim();
        } else {
            empName = (emp["emp_name _en"] || emp["اسم الموظف "] || '--').trim();
            empDept = (emp["department "] || emp["department"] || emp["Department"] || '--').trim();
            empJob = (emp["job title "] || emp["job title"] || emp["Job title"] || '--').trim();
        }

        const row = document.createElement('tr');
        row.className = "hover:bg-slate-800/40 transition text-slate-300";
        row.innerHTML = `
            <td class="p-3.5 font-mono text-sky-400">${empCode}</td>
            <td class="p-3.5 font-semibold text-white">${empName}</td>
            <td class="p-3.5">${empDept}</td>
            <td class="p-3.5">${empJob}</td>
            <td class="p-3.5 font-mono text-xs">${empHireDate}</td>
            <td class="p-3.5 text-center">
                <button onclick="viewEmployee('${empCode}')" class="px-3.5 py-1.5 bg-sky-600/30 hover:bg-sky-600 text-sky-200 rounded-lg text-xs border border-sky-400/30 transition shadow-lg">${translations[currentLang].action_btn}</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// عرض ملف الموظف بدقة ومراعاة اللغة
function viewEmployee(code) {
    const emp = allEmployees.find(e => String(e["الكود"] || e["code"]) === String(code));
    if (!emp) return;
    
    const name = currentLang === 'ar' ? (emp["اسم الموظف "] || emp["اسم الموظف"]) : (emp["emp_name _en"] || emp["اسم الموظف "]);
    const dept = currentLang === 'ar' ? (emp["الإدارة "] || emp["الإدارة"]) : (emp["department "] || emp["department"]);
    const job = currentLang === 'ar' ? (emp["الوظيفة"] || emp["الوظيفة "]) : (emp["job title "] || emp["job title"]);
    
    alert(`${currentLang === 'ar' ? 'بيانات الموظف' : 'Employee Profile'}:\n- ID: ${code}\n- Name: ${name}\n- Dept: ${dept}\n- Job: ${job}`);
}

// تحديث الإحصائيات في لوحة القيادة
function updateDashboardStats() {
    const totalCountEl = document.getElementById('total-employees-count');
    if (totalCountEl) {
        totalCountEl.innerText = allEmployees.length;
    }
}

// إغلاق القائمة المنسدلة للغة عند الضغط خارجها
window.addEventListener('click', (e) => {
    if (!e.target.closest('button[onclick="toggleLangDropdown()"]')) {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown && !dropdown.classList.contains('hidden')) {
            dropdown.classList.add('hidden');
        }
    }
});
