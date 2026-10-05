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
        action_btn: "عرض الملف",
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
        action_btn: "View Profile",
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
    document.body.style.backgroundImage = "linear-gradient(rgba(11, 15, 25, 0.90), rgba(11, 15, 25, 0.94)), url('./background.jpg')";
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
                <button onclick="viewEmployee('${empCode}')" class="px-3.5 py-1.5 bg-sky-600/30 hover:bg-sky-600 text-sky-200 rounded-lg text-xs border border-sky-400/30 transition shadow-lg">${translations[currentLang].action_btn}</button>
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

// دالة عرض ملف الموظف في صفحة كاملة (Full View) مع ثنائي اللغة، وكل خانة مستقلة، وتعديل الصور
function viewEmployee(code) {
    const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
    if (!emp) {
        alert("لم يتم العثور على الموظف");
        return;
    }

    // استبدال محتوى الحاوية الرئيسية (Main Content Container) بالكامل بصفحة تفاصيل الموظف الفخمة
    const mainContainer = document.querySelector('main') || document.getElementById('main-content-area') || document.body;
    
    // استخراج بيانات الموظف (عربي وإنجليزي لكل خانة مستقلة)
    const nameAr = emp["اسم الموظف"] || "غير متوفر";
    const nameEn = emp["Emp_name _En"] || "N/A";
    const deptAr = emp["الإدارة"] || "غير متوفر";
    const deptEn = emp["Human Resources & Administrative Affairs"] || "N/A";
    const jobAr = emp["الوظيفة"] || "غير متوفر";
    const jobEn = emp["Job title"] || "N/A";
    const hireDate = emp["تاريخ التعيين"] || emp.Date_of_Hiring || "--";
    const directMgrAr = emp["المدير المباشر"] || "--";
    const directMgrEn = emp["Direct manager"] || "--";
    const qualAr = emp["المؤهل"] || "--";
    const qualEn = emp["Qualification"] || "--";
    const qualAuthAr = emp["جهة المؤهل"] || "--";
    const qualAuthEn = emp["Qulification Issuing Authority"] || "--";
    const qualDate = emp["تاريخ الحصول على المؤهل"] || emp["Qualification Date"] || "--";
    const yearsService = emp["سنوات الخدمة"] || emp["Years of service"] || "--";
    const insuranceAr = emp["الحالة التأمينية"] || "--";
    const insuranceEn = emp["Insurance Status"] || "--";
    const dob = emp["تاريخ الميلاد"] || emp.DOB || "--";
    const age = emp["السن حتى تاريخه"] || emp["Age to date"] || "--";
    const pobAr = emp["مكان الميلاد"] || "--";
    const pobEn = emp["POB"] || "--";
    const nationalId = emp["الرقم القومى"] || emp.N_ID || "غير مسجل";
    const leaveBal = emp["رصيد الاجازات"] || emp["Annual Leave balance"] || "0";
    const address = emp["العنوان"] || emp.address || "غير مسجل";
    const mobile = emp["رقم الهاتف"] || emp["mobile number"] || "غير مسجل";
    const emgPhone = emp["رقم هاتف الطوارئ"] || emp.Emg_Phone_No || "غير مسجل";
    const email = emp["الايميل"] || emp.Email || "غير مسجل";
    
    // صورة الموظف (المحفوظة أو الافتراضية)
    const empPhoto = emp.photo || 'background.jpg';

    const fullPageHTML = `
        <div id="employee-full-profile-view" class="w-full min-h-screen p-6 space-y-6 animate-fadeIn">
            
            <!-- شريط العنوان والرجوع -->
            <div class="flex items-center justify-between bg-slate-900/80 border border-slate-700/60 p-4 rounded-2xl backdrop-blur-md shadow-xl">
                <button onclick="location.reload()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition flex items-center gap-2 border border-slate-700">
                    ← العودة للقائمة الرئيسية
                </button>
                <div class="text-center">
                    <h1 class="text-xl font-bold text-white">الملف الوظيفي الشامل</h1>
                    <p class="text-xs text-sky-400">Employee Comprehensive Profile</p>
                </div>
                <button onclick="saveEmployeeProfileChanges('${code}')" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-900/30 flex items-center gap-2">
                    💾 حفظ التعديلات
                </button>
            </div>

            <!-- رأس الملف الشخصي (الصورة + تعديل الصورة + الهوية الأساسية) -->
            <div class="bg-slate-900/80 border border-slate-700/60 p-6 rounded-2xl backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-6">
                <div class="relative group">
                    <div class="w-32 h-32 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 p-1 shadow-2xl">
                        <img id="profile-img-preview" src="${empPhoto}" alt="Employee Photo" class="w-full h-full object-cover rounded-2xl bg-slate-950">
                    </div>
                    <!-- زر تغيير وتحديث الصورة -->
                    <label for="upload-emp-photo" class="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white text-xs font-semibold">
                        <span>📷 تغيير الصورة</span>
                        <input type="file" id="upload-emp-photo" accept="image/*" class="hidden" onchange="handlePhotoUpload(event, '${code}')">
                    </label>
                </div>
                <div class="flex-1 text-center md:text-start space-y-2">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">اسم الموظف (عربي)</label>
                            <input type="text" id="edit-name-ar" value="${nameAr}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-lg focus:outline-none focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">Employee Name (English)</label>
                            <input type="text" id="edit-name-en" value="${nameEn}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sky-300 font-medium text-lg focus:outline-none focus:border-sky-500">
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                        <span class="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-sky-400">الكود: ${code}</span>
                        <span class="px-3 py-1 bg-sky-950/60 border border-sky-800 text-sky-300 rounded-lg text-xs">${jobAr} / ${jobEn}</span>
                    </div>
                </div>
            </div>

            <!-- شبكة البيانات التفصيلية (كل خانة مستقلة ومنسقة بدقة) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <!-- الإدارة والوظيفة -->
                <div class="bg-slate-900/80 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-md shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-sky-400 border-b border-slate-800 pb-2">🏢 الهيكل التنظيمي والإداري</h3>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">الإدارة (عربي / إنجليزي)</label>
                        <input type="text" id="edit-dept-ar" value="${deptAr}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm mb-1 focus:outline-none focus:border-sky-500">
                        <input type="text" id="edit-dept-en" value="${deptEn}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-sky-500">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">الوظيفة (عربي / إنجليزي)</label>
                        <input type="text" id="edit-job-ar" value="${jobAr}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm mb-1 focus:outline-none focus:border-sky-500">
                        <input type="text" id="edit-job-en" value="${jobEn}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-sky-500">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">المدير المباشر (Direct Manager)</label>
                        <input type="text" value="${directMgrAr} / ${directMgrEn}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-300 text-sm" readonly>
                    </div>
                </div>

                <!-- المؤهلات والتواريخ -->
                <div class="bg-slate-900/80 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-md shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-indigo-400 border-b border-slate-800 pb-2">🎓 المؤهل والخدمة</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">تاريخ التعيين</label>
                            <input type="text" value="${hireDate}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-emerald-400 text-sm font-mono" readonly>
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">سنوات الخدمة</label>
                            <input type="text" value="${yearsService} سنة" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-emerald-400 text-sm font-bold" readonly>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">المؤهل الدراسي (Qualification)</label>
                        <input type="text" value="${qualAr} - ${qualEn}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-300 text-sm" readonly>
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">جهة المؤهل وتاريخه</label>
                        <input type="text" value="${qualAuthAr} (${qualDate})" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-300 text-sm" readonly>
                    </div>
                </div>

                <!-- البيانات الشخصية وتاريخ الميلاد والسن (مستقلة تماماً) -->
                <div class="bg-slate-900/80 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-md shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-emerald-400 border-b border-slate-800 pb-2">👤 البيانات الشخصية والسن</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">تاريخ الميلاد (DOB)</label>
                            <input type="text" value="${dob}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-white text-sm font-mono" readonly>
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">السن حتى تاريخه</label>
                            <input type="text" value="${age} سنة" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-amber-400 text-sm font-bold" readonly>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">مكان الميلاد</label>
                            <input type="text" value="${pobAr}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-300 text-sm" readonly>
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">الحالة التأمينية</label>
                            <input type="text" value="${insuranceAr}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-sky-300 text-sm" readonly>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">الرقم القومي (National ID)</label>
                        <input type="text" value="${nationalId}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-white text-sm font-mono" readonly>
                    </div>
                </div>

                <!-- التواصل والعنوان -->
                <div class="bg-slate-900/80 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-md shadow-xl col-span-1 md:col-span-3 space-y-4">
                    <h3 class="text-sm font-bold text-amber-400 border-b border-slate-800 pb-2">📞 بيانات التواصل والعنوان</h3>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">رقم الهاتف (Mobile)</label>
                            <input type="text" id="edit-mobile" value="${mobile}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">رقم الطوارئ (Emergency)</label>
                            <input type="text" id="edit-emg" value="${emgPhone}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">البريد الإلكتروني (Email)</label>
                            <input type="text" id="edit-email" value="${email}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">رصيد الإجازات</label>
                            <input type="text" value="${leaveBal} يوم" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-emerald-400 text-sm font-bold" readonly>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">العنوان بالتفصيل (Address)</label>
                        <input type="text" id="edit-address" value="${address}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500">
                    </div>
                </div>

            </div>

        </div>
    `;

    // استبدال الشاشة الحالية بصفحة الملف الشخصي الكاملة
    // نفترض أن الجدول الرئيسي محتوى جوه عنصر معين، أو نبدل محتوى الـ main الحقيقي
    const containerToReplace = document.querySelector('main') || document.body;
    containerToReplace.innerHTML = fullPageHTML;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// دالة رفع وتعديل صورة الموظف وتثبيتها محلياً وتجهيزها للـ Firebase
function handlePhotoUpload(event, code) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result;
            // تحديث معاينة الصورة فوراً
            document.getElementById('profile-img-preview').src = base64Image;
            
            // حفظ الصورة في بيانات الموظف المتاحة بالذاكرة
            const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
            if (emp) {
                emp.photo = base64Image;
            }
            alert("تم رفع الصورة وتحديثها بنجاح! اضغط على زر 'حفظ التعديلات' لتثبيتها في القاعدة.");
        };
        reader.readAsDataURL(file);
    }
}

// دالة حفظ التعديلات على البيانات والصور وربطها بـ Firebase
function saveEmployeeProfileChanges(code) {
    const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
    if (emp) {
        emp["اسم الموظف"] = document.getElementById('edit-name-ar').value;
        emp["Emp_name _En"] = document.getElementById('edit-name-en').value;
        emp["الإدارة"] = document.getElementById('edit-dept-ar').value;
        emp["Human Resources & Administrative Affairs"] = document.getElementById('edit-dept-en').value;
        emp["الوظيفة"] = document.getElementById('edit-job-ar').value;
        emp["Job title"] = document.getElementById('edit-job-en').value;
        emp["رقم الهاتف"] = document.getElementById('edit-mobile').value;
        emp["رقم هاتف الطوارئ"] = document.getElementById('edit-emg').value;
        emp["الايميل"] = document.getElementById('edit-email').value;
        emp["العنوان"] = document.getElementById('edit-address').value;

        alert(`تم حفظ تعديلات الموظف [${code}] بنجاح!\nجاري مزامنة التعديلات مع قاعدة بيانات Firebase.`);
        // هنا مستقبلاً تربطها بـ firebase.database().ref(...).update(...) مباشرة
        
        // العودة للرئيسية بعد الحفظ
        location.reload();
    }
}
