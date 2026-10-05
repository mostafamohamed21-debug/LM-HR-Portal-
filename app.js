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
                tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-400" data-translate="loading">فشل تحميل ملف البيانات (clean_employees_data)، تأكد أنه في نفس مجلد المشروع.</td></tr>`;
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
        row.className = "hover:bg-slate-800/40 transition text-slate-300";
        row.innerHTML = `
            <td class="p-3.5 font-mono text-sky-400">${empCode}</td>
            <td class="p-3.5 font-semibold text-white">${empName}</td>
            <td class="p-3.5">${empDept}</td>
            <td class="p-3.5">${empJob}</td>
            <td class="p-3.5 font-mono text-xs">${empHireDate}</td>
            <td class="p-3.5 text-center">
                <button onclick="viewEmployee('${empCode}')" class="px-3 py-1 bg-sky-600/40 hover:bg-sky-600 text-sky-200 rounded text-xs border border-sky-400/30 transition shadow-lg">${translations[currentLang].action_btn}</button>
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

// دالة عرض تفاصيل الموظف في مودال فخم ومنظم بكل البيانات وكل خانة لوحدها
function viewEmployee(code) {
    const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
    if (!emp) {
        alert("لم يتم العثور على الموظف");
        return;
    }

    const existingModal = document.getElementById('emp-profile-modal');
    if (existingModal) existingModal.remove();

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
    const yearsService = emp["سنوات الخدمة"] || emp["Years of service"] || "--";
    const insuranceAr = emp["الحالة التأمينية"] || "--";
    const dob = emp["تاريخ الميلاد"] || emp.DOB || "--";
    const age = emp["السن حتى تاريخه"] || emp["Age to date"] || "--";
    const pobAr = emp["مكان الميلاد"] || emp.POB || "--";
    const nationalId = emp["الرقم القومى"] || emp.N_ID || "غير مسجل";
    const leaveBal = emp["رصيد الاجازات"] || emp["Annual Leave balance"] || "0";
    const address = emp["العنوان"] || emp.address || "غير مسجل";
    const mobile = emp["رقم الهاتف"] || emp["mobile number"] || "غير مسجل";
    const emgPhone = emp["رقم هاتف الطوارئ"] || emp.Emg_Phone_No || "غير مسجل";
    const email = emp["الايميل"] || emp.Email || "غير مسجل";
    
    const empPhoto = emp.photo || 'background.jpg';

    const modalHTML = `
        <div id="emp-profile-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
            <div class="glass-card border border-sky-500/30 rounded-2xl w-full max-w-4xl p-6 text-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                
                <!-- زر الإغلاق -->
                <button onclick="document.getElementById('emp-profile-modal').remove()" class="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-red-600 p-2 rounded-full transition">
                    ✕
                </button>

                <!-- رأس الملف الشخصي (الصورة + زر تعديل الصورة) -->
                <div class="flex flex-col md:flex-row items-center gap-6 border-b border-sky-500/20 pb-6 mb-6">
                    <div class="relative group">
                        <div class="w-28 h-28 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 p-1 shadow-xl">
                            <img id="profile-img-preview" src="${empPhoto}" alt="Employee Photo" class="w-full h-full object-cover rounded-2xl bg-slate-950">
                        </div>
                        <label for="upload-emp-photo" class="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white text-xs font-semibold">
                            <span>📷 تغيير الصورة</span>
                            <input type="file" id="upload-emp-photo" accept="image/*" class="hidden" onchange="handlePhotoUpload(event, '${code}')">
                        </label>
                    </div>
                    <div class="flex-1 w-full space-y-2 text-center md:text-start">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs text-slate-400 mb-1">اسم الموظف (عربي)</label>
                                <input type="text" id="edit-name-ar" value="${nameAr}" class="w-full bg-slate-900/90 border border-sky-500/30 rounded-lg px-3 py-1.5 text-white font-semibold text-sm focus:outline-none focus:border-sky-500">
                            </div>
                            <div>
                                <label class="block text-xs text-slate-400 mb-1">Employee Name (English)</label>
                                <input type="text" id="edit-name-en" value="${nameEn}" class="w-full bg-slate-900/90 border border-sky-500/30 rounded-lg px-3 py-1.5 text-sky-300 font-medium text-sm focus:outline-none focus:border-sky-500">
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 pt-1 justify-center md:justify-start">
                            <span class="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-sky-400">الكود: ${code}</span>
                            <span class="px-3 py-1 bg-sky-950/60 border border-sky-800 text-sky-300 rounded-lg text-xs">${jobAr}</span>
                        </div>
                    </div>
                </div>

                <!-- تفاصيل البيانات مقسمة بدقة وكل خانة مستقلة -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs">
                    
                    <!-- الهيكل التنظيمي -->
                    <div class="glass-card p-4 rounded-xl space-y-2 border border-sky-500/20">
                        <h4 class="font-bold text-sky-400 border-b border-sky-500/20 pb-1">🏢 الهيكل التنظيمي</h4>
                        <div>
                            <span class="block text-slate-400 mb-0.5">الإدارة (عربي):</span>
                            <input type="text" id="edit-dept-ar" value="${deptAr}" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white">
                        </div>
                        <div>
                            <span class="block text-slate-400 mb-0.5">Department (English):</span>
                            <input type="text" id="edit-dept-en" value="${deptEn}" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300">
                        </div>
                        <div>
                            <span class="block text-slate-400 mb-0.5">المدير المباشر:</span>
                            <span class="font-semibold text-slate-200">${directMgrAr}</span>
                        </div>
                    </div>

                    <!-- المؤهلات والتواريخ -->
                    <div class="glass-card p-4 rounded-xl space-y-2 border border-sky-500/20">
                        <h4 class="font-bold text-indigo-400 border-b border-sky-500/20 pb-1">🎓 المؤهل والخدمة</h4>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <span class="block text-slate-400 mb-0.5">تاريخ التعيين:</span>
                                <span class="font-mono text-emerald-400">${hireDate}</span>
                            </div>
                            <div>
                                <span class="block text-slate-400 mb-0.5">سنوات الخدمة:</span>
                                <span class="font-bold text-emerald-400">${yearsService} سنة</span>
                            </div>
                        </div>
                        <div>
                            <span class="block text-slate-400 mb-0.5">المؤهل الدراسي:</span>
                            <span class="text-slate-300">${qualAr}</span>
                        </div>
                        <div>
                            <span class="block text-slate-400 mb-0.5">جهة المؤهل:</span>
                            <span class="text-slate-300">${qualAuthAr}</span>
                        </div>
                    </div>

                    <!-- الميلاد والسن (كل خانة لوحدها) -->
                    <div class="glass-card p-4 rounded-xl space-y-2 border border-sky-500/20">
                        <h4 class="font-bold text-emerald-400 border-b border-sky-500/20 pb-1">👤 الميلاد والسن</h4>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <span class="block text-slate-400 mb-0.5">تاريخ الميلاد:</span>
                                <span class="font-mono text-white">${dob}</span>
                            </div>
                            <div>
                                <span class="block text-slate-400 mb-0.5">السن حتى تاريخه:</span>
                                <span class="font-bold text-amber-400">${age} سنة</span>
                            </div>
                        </div>
                        <div>
                            <span class="block text-slate-400 mb-0.5">مكان الميلاد:</span>
                            <span class="text-slate-300">${pobAr}</span>
                        </div>
                        <div>
                            <span class="block text-slate-400 mb-0.5">الحالة التأمينية:</span>
                            <span class="text-sky-300">${insuranceAr}</span>
                        </div>
                    </div>

                    <!-- التواصل والعنوان -->
                    <div class="glass-card p-4 rounded-xl col-span-1 md:col-span-3 space-y-2 border border-sky-500/20">
                        <h4 class="font-bold text-amber-400 border-b border-sky-500/20 pb-1">📞 التواصل والعنوان</h4>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                                <span class="block text-slate-400 mb-0.5">رقم الهاتف:</span>
                                <input type="text" id="edit-mobile" value="${mobile}" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono">
                            </div>
                            <div>
                                <span class="block text-slate-400 mb-0.5">رقم الطوارئ:</span>
                                <input type="text" id="edit-emg" value="${emgPhone}" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono">
                            </div>
                            <div>
                                <span class="block text-slate-400 mb-0.5">البريد الإلكتروني:</span>
                                <input type="text" id="edit-email" value="${email}" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono">
                            </div>
                            <div>
                                <span class="block text-slate-400 mb-0.5">رصيد الإجازات:</span>
                                <span class="font-bold text-emerald-400">${leaveBal} يوم</span>
                            </div>
                        </div>
                        <div class="mt-2">
                            <span class="block text-slate-400 mb-0.5">العنوان بالتفصيل:</span>
                            <input type="text" id="edit-address" value="${address}" class="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white">
                        </div>
                    </div>

                </div>

                <!-- الأزرار -->
                <div class="flex items-center justify-end gap-3 pt-3 border-t border-sky-500/20">
                    <button onclick="document.getElementById('emp-profile-modal').remove()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition">إغلاق</button>
                    <button onclick="saveEmployeeProfileChanges('${code}')" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition shadow-lg">💾 حفظ التعديلات</button>
                </div>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// رفع وتعديل الصورة
function handlePhotoUpload(event, code) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result;
            const imgPreview = document.getElementById('profile-img-preview');
            if (imgPreview) imgPreview.src = base64Image;
            
            const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
            if (emp) {
                emp.photo = base64Image;
            }
            alert("تم رفع الصورة بنجاح! اضغط على زر 'حفظ التعديلات' لتثبيتها.");
        };
        reader.readAsDataURL(file);
    }
}

// حفظ التعديلات
function saveEmployeeProfileChanges(code) {
    const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
    if (emp) {
        emp["اسم الموظف"] = document.getElementById('edit-name-ar').value;
        emp["Emp_name _En"] = document.getElementById('edit-name-en').value;
        emp["الإدارة"] = document.getElementById('edit-dept-ar').value;
        emp["Human Resources & Administrative Affairs"] = document.getElementById('edit-dept-en').value;
        emp["رقم الهاتف"] = document.getElementById('edit-mobile').value;
        emp["رقم هاتف الطوارئ"] = document.getElementById('edit-emg').value;
        emp["الايميل"] = document.getElementById('edit-email').value;
        emp["العنوان"] = document.getElementById('edit-address').value;

        alert(`تم حفظ التعديلات للموظف [${code}] بنجاح!`);
        const modal = document.getElementById('emp-profile-modal');
        if (modal) modal.remove();
        renderTable(allEmployees);
    }
}
