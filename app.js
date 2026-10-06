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

// القواميس والترجمات الشاملة للواجهة وتفاصيل الملف
const translations = {
    ar: {
        no_results: "لا توجد نتائج مطابقة للبحث",
        action_btn: "عرض الملف",
        back_to_list: "← العودة لقائمة الموظفين",
        profile_title: "الملف الوظيفي الشامل",
        profile_subtitle: "بيانات السجل الوظيفي للموظف"
    },
    en: {
        no_results: "No matching results found",
        action_btn: "View Profile",
        back_to_list: "← Back to Employees",
        profile_title: "Comprehensive Employee Profile",
        profile_subtitle: "Employee's Complete Record Details"
    }
};

// تحميل البيانات عند فتح الصفحة وربط الأحداث
document.addEventListener('DOMContentLoaded', () => {
    fetch('clean_employees_data.json')
        .then(response => response.json())
        .then(data => {
            allEmployees = data.filter(emp => (emp["الكود"] || emp["code"]) && (emp["اسم الموظف "] || emp["emp_name _en"]));
            renderTable(allEmployees);
            updateDashboardStats();
        })
        .catch(error => console.error('Error loading employee data:', error));

    // ربط خانة البحث
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = allEmployees.filter(emp => {
                const code = String(emp["الكود"] || emp["code"] || '').toLowerCase();
                const nameAr = String(emp["اسم الموظف "] || emp["اسم الموظف"] || '').toLowerCase();
                const nameEn = String(emp["emp_name _en"] || '').toLowerCase();
                return code.includes(query) || nameAr.includes(query) || nameEn.includes(query);
            });
            renderTable(filtered);
        });
    }

    // ربط زر تبديل اللغة (إن وجد في الصفحة بالـ ID أو Class)
    const langToggleBtn = document.getElementById('lang-toggle') || document.querySelector('.lang-switcher');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', toggleLanguage);
    }
});

// وظيفة تبديل اللغة وتحديث الواجهة
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    renderTable(allEmployees);
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
        const empCode = emp["الكود"] || emp["code"] || emp["Code"] || '--';
        
        let empName = "--";
        let empDept = "--";
        let empJob = "--";
        let rawHireDate = emp["تاريخ التعيين "] || emp["تاريخ التعيين"] || emp["date_of_hiring "] || emp["date_of_hiring"] || '--';
        let empHireDate = typeof rawHireDate === 'number' ? excelDateToJSDate(rawHireDate) : rawHireDate;

        if (currentLang === 'ar') {
            empName = (emp["اسم الموظف "] || emp["اسم الموظف"] || '--').trim();
            empDept = (emp["الإدارة "] || emp["الإدارة"] || emp["department"] || '--').trim();
            empJob = (emp["الوظيفة"] || emp["الوظيفة "] || emp["job title"] || '--').trim();
        } else {
            empName = (emp["emp_name _en"] || emp["اسم الموظف "] || emp["اسم الموظف"] || '--').trim();
            empDept = (emp["department"] || emp["Department"] || emp["الإدارة "] || '--').trim();
            empJob = (emp["job title"] || emp["Job title"] || emp["الوظيفة"] || '--').trim();
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

// عرض ملف الموظف تفصيلياً عند الضغط على زر عرض الملف
function viewEmployee(code) {
    const emp = allEmployees.find(e => String(e["الكود"] || e["code"]) === String(code));
    if (!emp) return;

    // إخفاء الجدول وإظهار قسم تفاصيل الملف (أو العكس حسب تصميم الـ HTML عندك)
    const listView = document.getElementById('employees-list-view') || document.getElementById('main-table-container');
    const profileView = document.getElementById('employee-profile-view') || document.getElementById('profile-container');
    
    if (listView && profileView) {
        listView.style.display = 'none';
        profileView.style.display = 'block';
    }

    // تعبئة حقول الملف الشخصي
    setTextContent('profile-emp-name', currentLang === 'ar' ? (emp["اسم الموظف "] || emp["اسم الموظف"]) : emp["emp_name _en"]);
    setTextContent('profile-emp-code', emp["الكود"] || emp["code"]);
    setTextContent('profile-department', currentLang === 'ar' ? (emp["الإدارة "] || emp["الإدارة"]) : emp["department"]);
    setTextContent('profile-job-title', currentLang === 'ar' ? emp["الوظيفة"] : emp["job title"]);
    setTextContent('profile-direct-manager', currentLang === 'ar' ? emp["المدير المباشر "] : emp["direct manager"]);
    setTextContent('profile-hire-date', excelDateToJSDate(emp["تاريخ التعيين "] || emp["تاريخ التعيين"] || emp["date_of_hiring "]));
    setTextContent('profile-years-service', emp["سنوات الخدمة "] || emp["years of service"]);
    setTextContent('profile-qualification', currentLang === 'ar' ? emp["المؤهل"] : emp["qualification"]);
    setTextContent('profile-qulification-auth', currentLang === 'ar' ? emp["جهة المؤهل "] : emp["qulification issuing authority"]);
    setTextContent('profile-dob', excelDateToJSDate(emp["تاريخ الميلاد"] || emp["dob"]));
    setTextContent('profile-age', emp["السن حتى تاريخه "] || emp["age to date"]);
    setTextContent('profile-insurance-status', currentLang === 'ar' ? emp["الحالة التأمينية "] : emp["insurance status"]);
    setTextContent('profile-pob', currentLang === 'ar' ? emp["مكان الميلاد"] : emp["pob"]);
}

// العودة للقائمة الرئيسية من داخل صفحة الملف
function backToEmployeesList() {
    const listView = document.getElementById('employees-list-view') || document.getElementById('main-table-container');
    const profileView = document.getElementById('employee-profile-view') || document.getElementById('profile-container');
    
    if (listView && profileView) {
        profileView.style.display = 'none';
        listView.style.display = 'block';
    }
}

// دالة مساعدة لتعبئة النصوص بأمان
function textContent(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text || '--';
}
function setTextContent(id, text) {
    textContent(id, text);
}

// تحديث الإحصائيات في لوحة القيادة
function updateDashboardStats() {
    const totalCountEl = document.getElementById('total-employees-count');
    if (totalCountEl) {
        totalCountEl.innerText = allEmployees.length;
    }
}
