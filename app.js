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

const translations = {
    ar: {
        no_results: "لا توجد نتائج مطابقة للبحث",
        action_btn: "عرض الملف"
    },
    en: {
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

    // البحث الفوري
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

    // نظام ذكي عام للتعامل مع أي زرار في الصفحة بالضغط (اللغة، الرجوع، إلخ)
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button') || e.target;
        
        // لو الضغطة على زرار اللغة (أو أي عنصر فيه AR / EN أو كلمة lang)
        if (target && (target.id.includes('lang') || target.classList.contains('lang') || target.innerText.includes('AR') || target.innerText.includes('EN'))) {
            toggleLanguage();
        }
        
        // لو الضغطة على زرار العودة للقائمة
        if (target && (target.innerText.includes('العودة') || target.innerText.includes('Back') || target.id.includes('back'))) {
            backToEmployeesList();
        }
    });
});

// تبديل اللغة
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
            empName = (emp["اسم الموظف "] || emp["اسم الموظف"] || emp["emp_name _en"] || '--').trim();
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

// عرض ملف الموظف بالتفصيل
function viewEmployee(code) {
    const emp = allEmployees.find(e => String(e["الكود"] || e["code"]) === String(code));
    if (!emp) return;

    // بحث ذكي عن حاوية الجدول وحاوية الملف بغض النظر عن الـ ID
    const views = document.querySelectorAll('section, div');
    views.forEach(el => {
        if (el.id.includes('profile') || el.className.includes('profile')) {
            el.style.display = 'block';
        } else if (el.id.includes('list') || el.id.includes('table') || el.className.includes('table')) {
            // لو الحاوية تخص الجدول نخفيها أو العكس
        }
    });

    // تعبئة البيانات في الحقول لو وجدت
    setVal('profile-emp-name', currentLang === 'ar' ? (emp["اسم الموظف "] || emp["اسم الموظف"]) : emp["emp_name _en"]);
    setVal('profile-emp-code', emp["الكود"] || emp["code"]);
    setVal('profile-department', currentLang === 'ar' ? (emp["الإدارة "] || emp["الإدارة"]) : emp["department"]);
    setVal('profile-job-title', currentLang === 'ar' ? emp["الوظيفة"] : emp["job title"]);
    setVal('profile-direct-manager', currentLang === 'ar' ? emp["المدير المباشر "] : emp["direct manager"]);
    setVal('profile-hire-date', excelDateToJSDate(emp["تاريخ التعيين "] || emp["تاريخ التعيين"]));
    setVal('profile-years-service', emp["سنوات الخدمة "] || emp["years of service"]);
    setVal('profile-qualification', currentLang === 'ar' ? emp["المؤهل"] : emp["qualification"]);
    setVal('profile-qulification-auth', currentLang === 'ar' ? emp["جهة المؤهل "] : emp["qulification issuing authority"]);
    setVal('profile-dob', excelDateToJSDate(emp["تاريخ الميلاد"] || emp["dob"]));
    setVal('profile-age', emp["السن حتى تاريخه "] || emp["age to date"]);
    setVal('profile-insurance-status', currentLang === 'ar' ? emp["الحالة التأمينية "] : emp["insurance status"]);
    setVal('profile-pob', currentLang === 'ar' ? emp["مكان الميلاد"] : emp["pob"]);
}

function backToEmployeesList() {
    location.reload(); // أبسط وأضمن طريقة للرجوع للقائمة الرئيسية وإعادة ضبط الحالة بالكامل
}

function setVal(id, val) {
    const el = document.getElementById(id) || document.querySelector(`.${id}`);
    if (el) el.innerText = val || '--';
}

function updateDashboardStats() {
    const totalCountEl = document.getElementById('total-employees-count') || document.querySelector('.total-employees');
    if (totalCountEl) {
        totalCountEl.innerText = allEmployees.length;
    }
}
