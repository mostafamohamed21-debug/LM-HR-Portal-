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
        lang_btn: "English"
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
        lang_btn: "العربية"
    }
};

let currentLang = 'ar';
let allEmployees = [];

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const htmlRoot = document.getElementById('html-root');
    htmlRoot.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    htmlRoot.setAttribute('lang', currentLang);

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

    document.getElementById('lang-btn-text').textContent = translations[currentLang].lang_btn;
}

// جلب بيانات الموظفين من ملف الـ JSON المسمى: clean_employees_data
document.addEventListener("DOMContentLoaded", () => {
    fetch('clean_employees_data')
        .then(response => {
            if (!response.ok) throw new Error("تعذر قراءة ملف البيانات");
            return response.json();
        })
        .then(resData => {
            // معالجة هيكل الـ JSON الخاص بك (سواء كان بداخله مفتاح employees أو مصفوفة مباشرة)[cite: 16]
            const rawEmployees = resData.employees ? resData.employees : resData;
            allEmployees = Array.isArray(rawEmployees) ? rawEmployees : Object.values(rawEmployees);

            renderTable(allEmployees);
            
            document.getElementById('total-employees-count').textContent = allEmployees.length;
            const statusBadge = document.getElementById('connection-status');
            statusBadge.textContent = `متصل بنجاح (${allEmployees.length} موظف)`;
            statusBadge.className = "text-xs px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/30";
        })
        .catch(error => {
            console.error("خطأ:", error);
            document.getElementById('employees-table-body').innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-400">فشل تحميل ملف البيانات (clean_employees_data_2)، تأكد أنه في نفس مجلد المشروع ومُشغل عبر السيرفر المحلي.</td></tr>`;
        });
});

function renderTable(dataList) {
    const tableBody = document.getElementById('employees-table-body');
    tableBody.innerHTML = '';

    if (dataList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">لا توجد نتائج مطابقة للبحث.</td></tr>`;
        return;
    }

    dataList.forEach(emp => {
        const row = document.createElement('tr');
        row.className = "hover:bg-slate-800/40 transition text-slate-300";
        row.innerHTML = `
            <td class="p-3.5 font-mono text-sky-400">${emp.الكود || emp.Code || '--'}</td>
            <td class="p-3.5 font-semibold text-white">${emp.اسم_الموظف || emp["اسم الموظف"] || emp.Name || '--'}</td>
            <td class="p-3.5">${emp.الإدارة || emp.Department || '--'}</td>
            <td class="p-3.5">${emp.الوظيفة || emp["Job title"] || '--'}</td>
            <td class="p-3.5 font-mono text-xs">${emp.تاريخ_التعيين || emp.Date_of_Hiring || '--'}</td>
            <td class="p-3.5 text-center">
                <button onclick="viewEmployee('${emp.الكود || emp.Code || ''}')" class="px-3 py-1 bg-sky-600/40 hover:bg-sky-600 text-sky-200 rounded text-xs border border-sky-400/30 transition">عرض</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function filterEmployees() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = allEmployees.filter(emp => {
        const name = (emp["اسم الموظف"] || "").toLowerCase();
        const code = String(emp.الكود || emp.Code || "");
        return name.includes(query) || code.includes(query);
    });
    renderTable(filtered);
}

function viewEmployee(code) {
    const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
    if (emp) {
        alert(`تفاصيل الموظف:\n- الكود: ${emp.الكود || emp.Code}\n- الاسم: ${emp["اسم الموظف"]}\n- الإدارة: ${emp.الإدارة}\n- الوظيفة: ${emp.الوظيفة || emp["Job title"]}`);
    } else {
        alert("عرض تفاصيل الموظف برقم الكود: " + code);
    }
}
