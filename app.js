// قاموس اللغات للبورتال
const translations = {
    ar: {
        page_title: "البورتال المركزي - شؤون العاملين | Lacto Misr",
        connection_status: "متصل بـ Firebase",
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
        connection_status: "Connected to Firebase",
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

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const htmlRoot = document.getElementById('html-root');
    htmlRoot.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    htmlRoot.setAttribute('lang', currentLang);

    // تحديث النصوص الثابتة
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

// تحميل بيانات الموظفين (من ملف الـ JSON أو الـ Firebase)
document.addEventListener("DOMContentLoaded", () => {
    console.log("Portal Initialized with Dark Tech Theme.");
    
    // جلب ملف الـ JSON وعرضه في الجدول للتجربة الفورية
    fetch('clean_employees_data_2.json')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('employees-table-body');
            tableBody.innerHTML = '';
            
            // تحديث العدد الإجمالي
            document.getElementById('total-employees-count').textContent = data.length || 352;

            data.forEach(emp => {
                const row = document.createElement('tr');
                row.className = "hover:bg-slate-800/40 transition text-slate-300";
                row.innerHTML = `
                    <td class="p-3.5 font-mono text-sky-400">${emp.code || emp.ID || '--'}</td>
                    <td class="p-3.5 font-semibold text-white">${emp.name || emp.Name || '--'}</td>
                    <td class="p-3.5">${emp.department || emp.Department || '--'}</td>
                    <td class="p-3.5">${emp.job || emp.JobTitle || '--'}</td>
                    <td class="p-3.5 font-mono text-xs">${emp.hire_date || emp.HireDate || '--'}</td>
                    <td class="p-3.5 text-center">
                        <button onclick="viewEmployee('${emp.code || emp.ID}')" class="px-3 py-1 bg-sky-600/40 hover:bg-sky-600 text-sky-200 rounded text-xs border border-sky-400/30 transition">عرض</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            document.getElementById('connection-status').textContent = "متصل بنجاح (352 موظف)";
            document.getElementById('connection-status').className = "text-xs px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/30";
        })
        .catch(error => {
            console.error("Error loading employees data:", error);
            document.getElementById('employees-table-body').innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-400">تعهّد تحميل البيانات، تأكد من وجود ملف JSON.</td></tr>`;
        });
});

function viewEmployee(code) {
    alert("عرض تفاصيل الموظف برقم الكود: " + code);
}
