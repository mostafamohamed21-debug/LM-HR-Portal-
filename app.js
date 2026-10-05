const translations = {
    ar: {
        page_title: "البورتال المركزي - شؤون العاملين | Lacto Misr",
        connection_status: "متصل بقاعدة البيانات",
        admin: "مسؤول النظام",
        control_panel: "غرفة التحكم المركزية",
        nav_home: "الرئيسية والموظفين",
        nav_depts: "الإدارات والأقسام",
        nav_attendance: "الحضور والإنصراف",
        nav_reports: "التقارير والإحصائيات",
        total_emp: "إجمالي العاملين",
        active_depts: "الإدارات النشطة",
        system_status: "حالة النظام",
        connected: "متصل",
        emp_list: "قائمة العاملين بالقاعدة",
        search_placeholder: "بحث بالاسم أو الكود...",
        th_code: "الكود",
        th_name: "اسم الموظف",
        th_dept: "الإدارة",
        th_job: "الوظيفة",
        th_hire: "تاريخ التعيين",
        th_actions: "الإجراءات",
        loading: "جاري جلب البيانات من القاعدة...",
        lang_btn: "English",
        action_btn: "عرض",
        no_results: "لا توجد نتائج مطابقة للبحث."
    },
    en: {
        page_title: "HR Central Portal | Lacto Misr",
        connection_status: "Connected to Database",
        admin: "System Admin",
        control_panel: "Central Control Room",
        nav_home: "Home & Employees",
        nav_depts: "Departments",
        nav_attendance: "Attendance",
        nav_reports: "Reports & Stats",
        total_emp: "Total Employees",
        active_depts: "Active Departments",
        system_status: "System Status",
        connected: "Online",
        emp_list: "Employees Database List",
        search_placeholder: "Search by name or code...",
        th_code: "Code",
        th_name: "Employee Name",
        th_dept: "Department",
        th_job: "Job Title",
        th_hire: "Hire Date",
        th_actions: "Actions",
        loading: "Loading database records...",
        lang_btn: "العربية",
        action_btn: "View",
        no_results: "No matching records found."
    }
};

let currentLang = 'ar';
let allEmployees = [];

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const htmlRoot = document.getElementById('html-root');
    if (htmlRoot) {
        htmlRoot.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        htmlRoot.setAttribute('lang', currentLang);
    }

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });

    const langBtnText = document.getElementById('lang-btn-text');
    if (langBtnText) {
        langBtnText.textContent = translations[currentLang].lang_btn;
    }

    // إعادة رسم الجدول باللغة الجديدة فوراً
    renderTable(allEmployees);
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('./clean_employees_data.json')
        .then(response => {
            if (!response.ok) throw new Error("تعذر قراءة ملف البيانات");
            return response.json();
        })
        .then(resData => {
            const rawEmployees = resData.employees ? resData.employees : resData;
            allEmployees = Array.isArray(rawEmployees) ? rawEmployees : Object.values(rawEmployees);

            renderTable(allEmployees);
            
            const totalCountEl = document.getElementById('total-employees-count');
            if (totalCountEl) totalCountEl.textContent = allEmployees.length;

            const statusBadge = document.getElementById('connection-status');
            if (statusBadge) {
                statusBadge.textContent = currentLang === 'ar' ? `متصل بنجاح (${allEmployees.length} موظف)` : `Connected (${allEmployees.length} employees)`;
                statusBadge.className = "text-xs px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/30";
            }
        })
        .catch(error => {
            console.error("خطأ:", error);
            const tableBody = document.getElementById('employees-table-body');
            if (tableBody) {
                tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-400">فشل تحميل ملف البيانات (clean_employees_data)، تأكد أنه في نفس مجلد المشروع.</td></tr>`;
            }
        });
});

function renderTable(dataList) {
    const tableBody = document.getElementById('employees-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (dataList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">${translations[currentLang].no_results}</td></tr>`;
        return;
    }

    dataList.forEach(emp => {
        // اختيار الحقول بناءً على اللغة الحالية (عربي / إنجليزي)
        const empCode = emp.الكود || emp.Code || '--';
        
        const empName = currentLang === 'ar' 
            ? (emp["اسم الموظف"] || emp.اسم_الموظف || emp.Name || '--')
            : (emp["Emp_name _En"] || emp.Emp_name_En || emp.Name || '--');

        const empDept = currentLang === 'ar'
            ? (emp["الإدارة"] || emp.الإدارة || emp.Department || '--')
            : (emp["Human Resources & Administrative Affairs"] || emp["Human Resources"] || emp.Department || '--');

        const empJob = currentLang === 'ar'
            ? (emp["الوظيفة"] || emp.الوظيفة || '--')
            : (emp["Job title"] || emp.Job_title || emp.Job || '--');

        const empHireDate = emp["تاريخ التعيين"] || emp.تاريخ_التعيين || emp.Date_of_Hiring || '--';

        const row = document.createElement('tr');
        row.className = "hover:bg-slate-800/40 transition text-slate-300";
        row.innerHTML = `
            <td class="p-3.5 font-mono text-sky-400">${empCode}</td>
            <td class="p-3.5 font-semibold text-white">${empName}</td>
            <td class="p-3.5">${empDept}</td>
            <td class="p-3.5">${empJob}</td>
            <td class="p-3.5 font-mono text-xs">${empHireDate}</td>
            <td class="p-3.5 text-center">
                <button onclick="viewEmployee('${empCode}')" class="px-3 py-1 bg-sky-600/40 hover:bg-sky-600 text-sky-200 rounded text-xs border border-sky-400/30 transition">${translations[currentLang].action_btn}</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function filterEmployees() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase();
    
    const filtered = allEmployees.filter(emp => {
        const nameAr = (emp["اسم الموظف"] || "").toLowerCase();
        const nameEn = (emp["Emp_name _En"] || "").toLowerCase();
        const code = String(emp.الكود || emp.Code || "");
        return nameAr.includes(query) || nameEn.includes(query) || code.includes(query);
    });
    renderTable(filtered);
}

function viewEmployee(code) {
    const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
    if (emp) {
        const name = currentLang === 'ar' ? (emp["اسم الموظف"] || "غير متوفر") : (emp["Emp_name _En"] || "N/A");
        const dept = currentLang === 'ar' ? (emp["الإدارة"] || "غير متوفر") : (emp["Human Resources & Administrative Affairs"] || "N/A");
        const job = currentLang === 'ar' ? (emp["الوظيفة"] || "غير متوفر") : (emp["Job title"] || "N/A");
        
        alert(`تفاصيل الموظف / Employee Details:\n- الكود / Code: ${code}\n- الاسم / Name: ${name}\n- الإدارة / Dept: ${dept}\n- الوظيفة / Job: ${job}`);
    } else {
        alert("Employee not found / لم يتم العثور على الموظف: " + code);
    }
}
