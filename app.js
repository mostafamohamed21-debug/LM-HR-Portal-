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

// الترجمات الأساسية للواجهة
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
            // تصفية السجلات الفارغة إن وجدت
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
});

// عرض جدول الموظفين بمرونة تامة للأسماء والتواريخ
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
            empName = emp["اسم الموظف "] || emp["اسم الموظف"] || emp["emp_name _en"] || '--';
            empDept = emp["الإدارة "] || emp["الإدارة"] || emp["department"] || '--';
            empJob = emp["الوظيفة"] || emp["الوظيفة "] || emp["job title"] || '--';
        } else {
            empName = emp["emp_name _en"] || emp["اسم الموظف "] || emp["اسم الموظف"] || '--';
            empDept = emp["department"] || emp["Department"] || emp["الإدارة "] || '--';
            empJob = emp["job title"] || emp["Job title"] || emp["الوظيفة"] || '--';
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
    const emp = allEmployees.find(e => String(e["الكود"] === code || e["code"] === code || e["الكود"] == code || e["code"] == code));
    if (!emp) return;

    // يمكنك استدعاء واجهة عرض الملف الشخصي هنا وتعبئة الحقول ببيانات الموظف `emp`
    console.log("Viewing employee:", emp);
    // مثال لتعبئة الاسم لو عنصر عرض الملف موجود
    const nameField = document.getElementById('profile-emp-name');
    if (nameField) {
        nameField.innerText = currentLang === 'ar' ? (emp["اسم الموظف "] || emp["اسم الموظف"]) : emp["emp_name _en"];
    }
}

// تحديث إحصائيات لوحة القيادة
function updateDashboardStats() {
    const totalCountEl = document.getElementById('total-employees-count');
    if (totalCountEl) {
        totalCountEl.innerText = allEmployees.length;
    }
}
