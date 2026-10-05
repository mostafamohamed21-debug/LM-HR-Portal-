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

    renderTable(allEmployees);
}

document.addEventListener("DOMContentLoaded", () => {
    // تطبيق خلفية الصورة المخصصة background.jpg بنمط عصري فخم
    document.body.style.backgroundImage = "linear-gradient(rgba(11, 15, 25, 0.88), rgba(11, 15, 25, 0.92)), url('./background.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";

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
                statusBadge.className = "text-xs px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 backdrop-blur-md";
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
        const empCode = emp.الكود || emp.Code || '--';
        const empName = currentLang === 'ar' 
            ? (emp["اسم الموظف"] || emp.اسم_الموظف || emp.Name || '--')
            : (emp["Emp_name _En"] || emp.Emp_name_En || emp.Name || '--');

        const empDept = currentLang === 'ar'
            ? (emp["الإدارة"] || emp.Department || '--')
            : (emp["Human Resources & Administrative Affairs"] || emp["Human Resources"] || emp.Department || '--');

        const empJob = currentLang === 'ar'
            ? (emp["الوظيفة"] || '--')
            : (emp["Job title"] || emp.Job_title || '--');

        const empHireDate = emp["تاريخ التعيين"] || emp.Date_of_Hiring || '--';

        const row = document.createElement('tr');
        row.className = "hover:bg-slate-800/40 transition text-slate-300 border-b border-slate-800/50";
        row.innerHTML = `
            <td class="p-3.5 font-mono text-sky-400">${empCode}</td>
            <td class="p-3.5 font-semibold text-white">${empName}</td>
            <td class="p-3.5">${empDept}</td>
            <td class="p-3.5">${empJob}</td>
            <td class="p-3.5 font-mono text-xs">${empHireDate}</td>
            <td class="p-3.5 text-center">
                <button onclick="viewEmployee('${empCode}')" class="px-3 py-1 bg-sky-600/30 hover:bg-sky-600 text-sky-200 rounded-lg text-xs border border-sky-400/30 transition shadow-lg">${translations[currentLang].action_btn}</button>
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

// دالة عرض ملف الموظف الشامل بالتصميم العالمي الفخم مع صورة وبروفايل وزر تعديل
function viewEmployee(code) {
    const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
    if (!emp) {
        alert("لم يتم العثور على الموظف");
        return;
    }

    // إزالة أي مودال قديم لو موجود
    const existingModal = document.getElementById('emp-profile-modal');
    if (existingModal) existingModal.remove();

    const name = emp["اسم الموظف"] || emp.Name || "غير متوفر";
    const nameEn = emp["Emp_name _En"] || "N/A";
    const dept = emp["الإدارة"] || "غير متوفر";
    const deptEn = emp["Human Resources & Administrative Affairs"] || "N/A";
    const job = emp["الوظيفة"] || "غير متوفر";
    const jobEn = emp["Job title"] || "N/A";
    const hireDate = emp["تاريخ التعيين"] || "--";
    const directMgr = emp["المدير المباشر"] || "--";
    const qualification = emp["المؤهل"] || "--";
    const qualAuth = emp["جهة المؤهل"] || "--";
    const yearsService = emp["سنوات الخدمة"] || "--";
    const insurance = emp["الحالة التأمينية"] || "--";
    const dob = emp["تاريخ الميلاد"] || "--";
    const age = emp["السن حتى تاريخه"] || "--";
    const pob = emp["مكان الميلاد"] || "--";
    const mobile = emp["رقم الهاتف"] || "غير مسجل";
    const email = emp["الايميل"] || "غير مسجل";

    // إنشاء نافذة المودال الفخمة بتصميم الدارك مود (Glassmorphism)
    const modalHTML = `
        <div id="emp-profile-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <div class="bg-slate-900/90 border border-slate-700/60 rounded-2xl w-full max-w-4xl p-6 text-slate-200 shadow-2xl relative animate-scaleIn max-h-[90vh] overflow-y-auto">
                
                <!-- زر الإغلاق -->
                <button onclick="document.getElementById('emp-profile-modal').remove()" class="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-red-600/80 p-2 rounded-full transition">
                    ✕
                </button>

                <!-- رأس الملف الشخصي (الصورة والبيانات الأساسية) -->
                <div class="flex flex-col md:flex-row items-center gap-6 border-b border-slate-800 pb-6 mb-6">
                    <div class="relative">
                        <div class="w-28 h-28 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 p-1 shadow-xl">
                            <img src="${emp.photo || 'background.jpg'}" alt="Employee Photo" class="w-full h-full object-cover rounded-2xl bg-slate-900">
                        </div>
                        <span class="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-900">نشط</span>
                    </div>
                    <div class="text-center md:text-start flex-1">
                        <h2 class="text-2xl font-bold text-white mb-1">${name}</h2>
                        <p class="text-sky-400 text-sm font-medium mb-3">${nameEn}</p>
                        <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                            <span class="px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-xs">الكود: ${code}</span>
                            <span class="px-3 py-1 bg-sky-950/60 border border-sky-800/50 text-sky-300 rounded-lg text-xs">${job}</span>
                            <span class="px-3 py-1 bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 rounded-lg text-xs">${dept}</span>
                        </div>
                    </div>
                </div>

                <!-- شبكة تفاصيل البيانات -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                    <div class="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl">
                        <span class="block text-slate-400 text-xs mb-1">تاريخ التعيين</span>
                        <span class="font-semibold text-white">${hireDate}</span>
                    </div>
                    <div class="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl">
                        <span class="block text-slate-400 text-xs mb-1">سنوات الخدمة</span>
                        <span class="font-semibold text-emerald-400">${yearsService} سنة</span>
                    </div>
                    <div class="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl">
                        <span class="block text-slate-400 text-xs mb-1">المدير المباشر</span>
                        <span class="font-semibold text-white">${directMgr}</span>
                    </div>
                    <div class="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl">
                        <span class="block text-slate-400 text-xs mb-1">المؤهل الدراسي</span>
                        <span class="font-semibold text-white">${qualification} (${qualAuth})</span>
                    </div>
                    <div class="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl">
                        <span class="block text-slate-400 text-xs mb-1">الحالة التأمينية</span>
                        <span class="font-semibold text-sky-300">${insurance}</span>
                    </div>
                    <div class="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl">
                        <span class="block text-slate-400 text-xs mb-1">العمر / تاريخ الميلاد</span>
                        <span class="font-semibold text-white">${age} سنة (${dob})</span>
                    </div>
                    <div class="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl">
                        <span class="block text-slate-400 text-xs mb-1">رقم الهاتف</span>
                        <span class="font-semibold text-white font-mono">${mobile}</span>
                    </div>
                    <div class="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl col-span-1 md:col-span-2">
                        <span class="block text-slate-400 text-xs mb-1">البريد الإلكتروني</span>
                        <span class="font-semibold text-white font-mono">${email}</span>
                    </div>
                </div>

                <!-- أزرار التحكم والعمليات (تعديل وحفظ لـ Firebase) -->
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <button onclick="document.getElementById('emp-profile-modal').remove()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition">إغلاق</button>
                    <button onclick="enableEditMode('${code}')" class="px-5 py-2 bg-amber-600/30 hover:bg-amber-600 text-amber-200 border border-amber-500/40 rounded-xl text-sm transition font-medium flex items-center gap-2">
                        ✏️ تعديل البيانات
                    </button>
                </div>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// دالة تفعيل وضع التعديل وربطه بـ Firebase مستقبلًا
function enableEditMode(code) {
    alert(`جاري تفعيل وضع التعديل للموظف رقم [${code}]\nسيتم حفظ التعديلات مباشرة على قاعدة بيانات Firebase.`);
}
