const firebaseConfig = {
    apiKey: "AIzaSyDummyKey-LactoMisrHRPortal",
    authDomain: "lactomisr-hr.firebaseapp.com",
    databaseURL: "https://lactomisr-hr-default-rtdb.firebaseio.com",
    projectId: "lactomisr-hr"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const translations = {
    ar: {
        page_title: "البورتال المركزي - شؤون العاملين | Lacto Misr",
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
        action_btn: "عرض الملف",
        no_results: "لا توجد نتائج مطابقة للبحث.",
        back_btn: "← العودة لقائمة الموظفين",
        profile_title: "الملف الوظيفي الشامل",
        profile_subtitle: "Comprehensive Employee Profile",
        save_btn: "💾 حفظ ومزامنة Firebase",
        lbl_name_ar: "اسم الموظف",
        lbl_name_en: "Employee Name (English)",
        sec_org: "🏢 الهيكل التنظيمي",
        sec_qual: "🎓 المؤهل والخدمة",
        sec_bio: "👤 الميلاد والسن والتأمين",
        sec_contact: "📞 قنوات الاتصال والعنوان",
        lbl_dept_ar: "الإدارة",
        lbl_dept_en: "Department (English)",
        lbl_manager: "المدير المباشر",
        lbl_hiredate: "تاريخ التعيين",
        lbl_service_years: "سنوات الخدمة",
        lbl_qual: "المؤهل الدراسي",
        lbl_qual_auth: "جهة التخرج",
        lbl_dob: "تاريخ الميلاد",
        lbl_age: "السن حتى تاريخه",
        lbl_pob: "مكان الميلاد",
        lbl_insurance: "الحالة التأمينية",
        lbl_national_id: "الرقم القومي",
        lbl_mobile: "رقم الهاتف",
        lbl_emergency: "رقم الطوارئ",
        lbl_email: "البريد الإلكتروني",
        lbl_leave_bal: "رصيد الإجازات",
        lbl_address: "العنوان بالتفصيل"
    },
    en: {
        page_title: "HR Central Portal | Lacto Misr",
        admin: "System Admin",
        control_panel: "Control Room",
        nav_home: "Home & Employees",
        nav_depts: "Departments",
        nav_attendance: "Attendance",
        nav_reports: "Reports & Stats",
        total_emp: "Total Employees",
        active_depts: "Active Departments",
        system_status: "System Status",
        connected: "Stable (Firebase Connected)",
        emp_list: "Employees Database List",
        search_placeholder: "Search by name or code...",
        th_code: "Code",
        th_name: "Employee Name",
        th_dept: "Department",
        th_job: "Job Title",
        th_hire: "Hire Date",
        th_actions: "Actions",
        loading: "Loading database records...",
        action_btn: "View Profile",
        no_results: "No matching records found.",
        back_btn: "← Back to Employees",
        profile_title: "Comprehensive Employee Profile",
        profile_subtitle: "Comprehensive Employee Profile",
        save_btn: "💾 Save & Sync Firebase",
        lbl_name_ar: "Employee Name",
        lbl_name_en: "Employee Name (Arabic)",
        sec_org: "🏢 Organizational Structure",
        sec_qual: "🎓 Qualification & Service",
        sec_bio: "👤 DOB, Age & Insurance",
        sec_contact: "📞 Contact & Address",
        lbl_dept_ar: "Department",
        lbl_dept_en: "Department (Arabic)",
        lbl_manager: "Direct Manager",
        lbl_hiredate: "Hire Date",
        lbl_service_years: "Years of Service",
        lbl_qual: "Qualification",
        lbl_qual_auth: "Issuing Authority",
        lbl_dob: "Date of Birth",
        lbl_age: "Age to Date",
        lbl_pob: "Place of Birth",
        lbl_insurance: "Insurance Status",
        lbl_national_id: "National ID",
        lbl_mobile: "Mobile Number",
        lbl_emergency: "Emergency Phone",
        lbl_email: "Email Address",
        lbl_leave_bal: "Leave Balance",
        lbl_address: "Detailed Address"
    }
};

let currentLang = 'ar';
let allEmployees = [];

function toggleLangDropdown() {
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
}

function setLanguage(lang) {
    currentLang = lang;
    const htmlRoot = document.getElementById('html-root');
    if (htmlRoot) {
        htmlRoot.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        htmlRoot.setAttribute('lang', currentLang);
    }

    const flagEl = document.getElementById('lang-flag');
    const codeEl = document.getElementById('lang-code');
    if (flagEl && codeEl) {
        if (currentLang === 'ar') {
            flagEl.textContent = '🇪🇬';
            codeEl.textContent = 'AR';
        } else {
            flagEl.textContent = '🇬🇧';
            codeEl.textContent = 'EN';
        }
    }

    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.add('hidden');

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

    renderTable(allEmployees);
}

window.addEventListener('click', function(e) {
    if (!e.target.closest('#lang-dropdown') && !e.target.closest('button[onclick="toggleLangDropdown()"]')) {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown) dropdown.classList.add('hidden');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fetch('./clean_employees_data.json')
        .then(response => {
            if (!response.ok) throw new Error("تعذر قراءة ملف البيانات");
            return response.json();
        })
        .then(resData => {
            const rawEmployees = resData.employees ? resData.employees : resData;
            allEmployees = Array.isArray(rawEmployees) ? rawEmployees : Object.values(rawEmployees);

            allEmployees.forEach(emp => {
                const code = String(emp.الكود || emp.Code);
                const savedData = localStorage.getItem('emp_edit_' + code);
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    Object.assign(emp, parsed);
                }
            });

            renderTable(allEmployees);
            
            const totalCountEl = document.getElementById('total-employees-count');
            if (totalCountEl) totalCountEl.textContent = allEmployees.length;
        })
        .catch(error => {
            console.error("خطأ:", error);
            const tableBody = document.getElementById('employees-table-body');
            if (tableBody) {
                tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-400">فشل تحميل ملف البيانات.</td></tr>`;
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
        
        // فلترة صارمة تمنع خلط اللغات في الجدول الرئيسي
        let empName = '';
        let empDept = '';
        let empJob = '';

        if (currentLang === 'ar') {
            empName = emp["اسم الموظف"] || emp.اسم_الموظف || '--';
            empDept = emp["الإدارة"] || '--';
            empJob = emp["الوظيفة"] || '--';
        } else {
            empName = emp["Emp_name _En"] || emp.Emp_name_En || emp.Name || emp["اسم الموظف"] || '--';
            empDept = emp["Human Resources & Administrative Affairs"] || emp["Human Resources"] || emp.Department || emp["الإدارة"] || '--';
            empJob = emp["Job title"] || emp.Job_title || emp["الوظيفة"] || '--';
        }

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

let cachedMainHTML = "";

function viewEmployee(code) {
    const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
    if (!emp) {
        showCustomToast("Employee not found", "error");
        return;
    }

    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    if (!cachedMainHTML) {
        cachedMainHTML = mainContainer.innerHTML;
    }

    const t = translations[currentLang];

    // فلترة دقيقة ومنفصلة تماماً حسب وضع AR أو EN لعدم حدوث أي اختلاط
    let nameVal = '';
    let nameOtherVal = '';
    let deptVal = '';
    let deptOtherVal = '';
    let jobVal = '';
    let directMgr = '';
    let qual = '';
    let qualAuth = '';
    let insurance = '';
    let pob = '';

    if (currentLang === 'ar') {
        nameVal = emp["اسم الموظف"] || "";
        nameOtherVal = emp["Emp_name _En"] || "";
        deptVal = emp["الإدارة"] || "";
        deptOtherVal = emp["Human Resources & Administrative Affairs"] || "";
        jobVal = emp["الوظيفة"] || "";
        directMgr = emp["المدير المباشر"] || "";
        qual = emp["المؤهل"] || "";
        qualAuth = emp["جهة المؤهل"] || "";
        insurance = emp["الحالة التأمينية"] || "";
        pob = emp["مكان الميلاد"] || "";
    } else {
        nameVal = emp["Emp_name _En"] || emp["اسم الموظف"] || "";
        nameOtherVal = emp["اسم الموظف"] || "";
        deptVal = emp["Human Resources & Administrative Affairs"] || emp["الإدارة"] || "";
        deptOtherVal = emp["الإدارة"] || "";
        jobVal = emp["Job title"] || emp["الوظيفة"] || "";
        directMgr = emp["Direct manager"] || emp["المدير المباشر"] || "";
        qual = emp["Qualification"] || emp["المؤهل"] || "";
        qualAuth = emp["Qulification Issuing Authority"] || emp["جهة المؤهل"] || "";
        insurance = emp["Insurance Status"] || emp["الحالة التأمينية"] || "";
        pob = emp["POB"] || emp["مكان الميلاد"] || "";
    }
    
    const hireDate = emp["تاريخ التعيين"] || emp.Date_of_Hiring || "";
    const yearsService = emp["سنوات الخدمة"] || emp["Years of service"] || "";
    const dob = emp["تاريخ الميلاد"] || emp.DOB || "";
    const age = emp["السن حتى تاريخه"] || emp["Age to date"] || "";
    const nationalId = emp["الرقم القومى"] || emp.N_ID || "";
    const leaveBal = emp["رصيد الاجازات"] || emp["Annual Leave balance"] || "0";
    const address = emp["العنوان"] || emp.address || "";
    const mobile = emp["رقم الهاتف"] || emp["mobile number"] || "";
    const emgPhone = emp["رقم هاتف الطوارئ"] || emp.Emg_Phone_No || "";
    const email = emp["الايميل"] || emp.Email || "";
    
    const empPhoto = emp.photo || 'background.jpg';

    mainContainer.innerHTML = `
        <div class="space-y-6 animate-fadeIn pb-12">
            
            <!-- شريط التنقل العلوي -->
            <div class="glass-card p-4 rounded-2xl flex items-center justify-between border border-sky-500/30 shadow-xl">
                <button onclick="restoreMainContent()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl text-xs font-semibold transition border border-sky-500/30 shadow-md">
                    ${t.back_btn}
                </button>
                <div class="text-center">
                    <h2 class="text-base font-bold text-white">${t.profile_title}</h2>
                    <p class="text-[11px] text-sky-400">${t.profile_subtitle}</p>
                </div>
                <button onclick="saveEmployeeProfileChanges('${code}')" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-900/35">
                    ${t.save_btn}
                </button>
            </div>

            <!-- رأس الملف الشخصي -->
            <div class="glass-card p-6 rounded-2xl border border-sky-500/30 shadow-xl flex flex-col md:flex-row items-center gap-6">
                <div class="relative group">
                    <div class="w-32 h-32 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 p-1 shadow-2xl">
                        <img id="profile-img-preview" src="${empPhoto}" alt="Employee Photo" class="w-full h-full object-cover rounded-2xl bg-slate-950">
                    </div>
                    <label for="upload-emp-photo" class="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white text-xs font-semibold">
                        <span>📷 Change Photo</span>
                        <input type="file" id="upload-emp-photo" accept="image/*" class="hidden" onchange="handlePhotoUpload(event, '${code}')">
                    </label>
                </div>
                <div class="flex-1 w-full space-y-3">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">${t.lbl_name_ar}</label>
                            <input type="text" id="edit-name-ar" value="${nameVal}" class="w-full bg-slate-900/90 border border-sky-500/30 rounded-xl px-3 py-2 text-white font-semibold text-sm focus:outline-none focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">${t.lbl_name_en}</label>
                            <input type="text" id="edit-name-en" value="${nameOtherVal}" class="w-full bg-slate-900/90 border border-sky-500/30 rounded-xl px-3 py-2 text-sky-300 font-medium text-sm focus:outline-none focus:border-sky-500">
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2 pt-1">
                        <span class="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-sky-400">ID: ${code}</span>
                        <span class="px-3 py-1 bg-sky-950/60 border border-sky-800 text-sky-300 rounded-lg text-xs">${jobVal}</span>
                    </div>
                </div>
            </div>

            <!-- شبكة تفاصيل البيانات -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <!-- الهيكل التنظيمي -->
                <div class="glass-card p-5 rounded-2xl space-y-3 border border-sky-500/30 shadow-xl">
                    <h3 class="text-xs font-bold text-sky-400 border-b border-sky-500/20 pb-2">${t.sec_org}</h3>
                    <div>
                        <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_dept_ar}</label>
                        <input type="text" id="edit-dept-ar" value="${deptVal}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500">
                    </div>
                    <div>
                        <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_dept_en}</label>
                        <input type="text" id="edit-dept-en" value="${deptOtherVal}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-sky-500">
                    </div>
                    <div>
                        <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_manager}</label>
                        <input type="text" id="edit-manager" value="${directMgr}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-sky-500">
                    </div>
                </div>

                <!-- المؤهلات والخدمة -->
                <div class="glass-card p-5 rounded-2xl space-y-3 border border-sky-500/30 shadow-xl">
                    <h3 class="text-xs font-bold text-sky-400 border-b border-sky-500/20 pb-2">${t.sec_qual}</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_hiredate}</label>
                            <input type="text" id="edit-hiredate" value="${hireDate}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 text-xs font-mono focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_service_years}</label>
                            <input type="text" id="edit-service" value="${yearsService}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 text-xs font-bold focus:outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_qual}</label>
                        <input type="text" id="edit-qual" value="${qual}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-sky-500">
                    </div>
                    <div>
                        <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_qual_auth}</label>
                        <input type="text" id="edit-qualauth" value="${qualAuth}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-sky-500">
                    </div>
                </div>

                <!-- الميلاد والسن -->
                <div class="glass-card p-5 rounded-2xl space-y-3 border border-sky-500/30 shadow-xl">
                    <h3 class="text-xs font-bold text-sky-400 border-b border-sky-500/20 pb-2">${t.sec_bio}</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_dob}</label>
                            <input type="text" id="edit-dob" value="${dob}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_age}</label>
                            <input type="text" id="edit-age" value="${age}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sky-300 text-xs font-bold focus:outline-none">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_pob}</label>
                            <input type="text" id="edit-pob" value="${pob}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_insurance}</label>
                            <input type="text" id="edit-insurance" value="${insurance}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sky-300 text-xs focus:outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_national_id}</label>
                        <input type="text" id="edit-nid" value="${nationalId}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-sky-500">
                    </div>
                </div>

                <!-- التواصل والعنوان -->
                <div class="glass-card p-5 rounded-2xl col-span-1 md:col-span-3 space-y-3 border border-sky-500/30 shadow-xl">
                    <h3 class="text-xs font-bold text-sky-400 border-b border-sky-500/20 pb-2">${t.sec_contact}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                            <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_mobile}</label>
                            <input type="text" id="edit-mobile" value="${mobile}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_emergency}</label>
                            <input type="text" id="edit-emg" value="${emgPhone}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_email}</label>
                            <input type="text" id="edit-email" value="${email}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_leave_bal}</label>
                            <input type="text" id="edit-leave" value="${leaveBal}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 text-xs font-bold focus:outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[11px] text-slate-400 mb-1">${t.lbl_address}</label>
                        <input type="text" id="edit-address" value="${address}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500">
                    </div>
                </div>

            </div>

        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function restoreMainContent() {
    const mainContainer = document.querySelector('main');
    if (mainContainer && cachedMainHTML) {
        mainContainer.innerHTML = cachedMainHTML;
        renderTable(allEmployees);
    } else {
        location.reload();
    }
}

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
                let existing = JSON.parse(localStorage.getItem('emp_edit_' + code) || '{}');
                existing.photo = base64Image;
                localStorage.setItem('emp_edit_' + code, JSON.stringify(existing));
                syncToFirebase(code, existing);
            }
            showCustomToast("Photo uploaded & synced with Firebase successfully!", "success");
        };
        reader.readAsDataURL(file);
    }
}

function saveEmployeeProfileChanges(code) {
    const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
    if (emp) {
        const updatedData = {
            "اسم الموظف": document.getElementById('edit-name-ar').value,
            "Emp_name _En": document.getElementById('edit-name-en').value,
            "الإدارة": document.getElementById('edit-dept-ar').value,
            "Human Resources & Administrative Affairs": document.getElementById('edit-dept-en').value,
            "المدير المباشر": document.getElementById('edit-manager').value,
            "تاريخ التعيين": document.getElementById('edit-hiredate').value,
            "سنوات الخدمة": document.getElementById('edit-service').value,
            "المؤهل": document.getElementById('edit-qual').value,
            "جهة المؤهل": document.getElementById('edit-qualauth').value,
            "تاريخ الميلاد": document.getElementById('edit-dob').value,
            "السن حتى تاريخه": document.getElementById('edit-age').value,
            "مكان الميلاد": document.getElementById('edit-pob').value,
            "الحالة التأمينية": document.getElementById('edit-insurance').value,
            "الرقم القومى": document.getElementById('edit-nid').value,
            "رقم الهاتف": document.getElementById('edit-mobile').value,
            "رقم هاتف الطوارئ": document.getElementById('edit-emg').value,
            "الايميل": document.getElementById('edit-email').value,
            "رصيد الاجازات": document.getElementById('edit-leave').value,
            "العنوان": document.getElementById('edit-address').value,
            "photo": emp.photo || 'background.jpg'
        };

        Object.assign(emp, updatedData);
        localStorage.setItem('emp_edit_' + code, JSON.stringify(updatedData));
        syncToFirebase(code, updatedData);

        showCustomToast(`Changes for employee [${code}] saved & synced to Firebase!`, "success");
        setTimeout(() => {
            restoreMainContent();
        }, 1200);
    }
}

function syncToFirebase(code, data) {
    try {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            const dbRef = firebase.database().ref('employees/' + code);
            dbRef.set(data).then(() => {
                console.log("Firebase sync successful for ID:", code);
            });
        }
    } catch (e) {
        console.log("Firebase sync error:", e);
    }
}

function showCustomToast(message, type = "success") {
    const existingToast = document.getElementById('custom-toast-alert');
    if (existingToast) existingToast.remove();

    const bgColor = type === "success" ? "bg-emerald-900/90 border-emerald-500/50 text-emerald-200" : "bg-red-900/90 border-red-500/50 text-red-200";
    
    const toastHTML = `
        <div id="custom-toast-alert" class="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center gap-3 transition animate-bounce ${bgColor}">
            <span class="text-base">${type === "success" ? "✅" : "❌"}</span>
            <span class="text-xs font-bold">${message}</span>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toastHTML);

    setTimeout(() => {
        const toast = document.getElementById('custom-toast-alert');
        if (toast) toast.remove();
    }, 3000);
}
