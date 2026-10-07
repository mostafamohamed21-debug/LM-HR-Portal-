/* --- AUDIO SYSTEM & INTRO ANIMATION (من الـ ESS) --- */
window.audioCtx = null;
window.playClickSound = function() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!window.audioCtx) window.audioCtx = new AudioContext();
        const ctx = window.audioCtx;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.03);
    } catch(e) {}
};

document.addEventListener('click', (e) => {
    const clickSelectors = [
        'button', 'a', '.clickable-card', '.dropdown-option', '.lang-option', 
        '.type-btn', '.bottom-nav-item', '.ampm-badge', '.wheel-item', '.calendar-day', 
        '.radio-option-btn', '.toggle-salary-btn', '.toggle-password', '.dropdown-selected', 
        '.checkin-card', '.action-btn-item', '.dot', '.custom-date-input', 
        'label.checkbox-container', '.upload-btn-label', '#chatbot-fab', '.notification-btn'
    ].join(', ');

    if (e.target.closest(clickSelectors)) {
        window.playClickSound();
    }
});

window.playIntroMusic = function() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!window.audioCtx) window.audioCtx = new AudioContext();
        const ctx = window.audioCtx;
        if (ctx.state === 'suspended') ctx.resume();

        function playNote(freq, startTime, duration, type = 'sine', volume = 0.015) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(volume, startTime + duration * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        }

        const t = ctx.currentTime;
        playNote(220.00, t, 3.0, 'sine', 0.02); 
        playNote(329.63, t + 0.5, 3.0, 'sine', 0.015); 
        playNote(523.25, t + 1.0, 3.0, 'sine', 0.015);
        playNote(174.61, t + 2.0, 3.0, 'sine', 0.02); 
        playNote(349.23, t + 2.5, 3.0, 'sine', 0.015); 
        playNote(523.25, t + 3.0, 3.0, 'sine', 0.015); 
        playNote(196.00, t + 4.5, 4.0, 'sine', 0.02); 
        playNote(392.00, t + 5.0, 4.0, 'sine', 0.015); 
        playNote(587.33, t + 5.5, 4.0, 'sine', 0.015);
        playNote(261.63, t + 7.0, 4.0, 'sine', 0.02); 
        playNote(392.00, t + 7.5, 4.0, 'sine', 0.015); 
        playNote(523.25, t + 8.0, 5.0, 'sine', 0.015);
    } catch(e) {}
};

function runLeafFallIntro() {
    const text = "LACTO MISR S.A.E";
    const container = document.getElementById('introTitle');
    const subtitle = document.getElementById('introSubtitle');
    if (!container) return;
    container.innerHTML = "";
    const charElements = [];

    for (let char of text) {
        if (char === ' ') {
            const space = document.createElement('span'); space.className = 'intro-space'; container.appendChild(space);
        } else {
            const span = document.createElement('span'); span.className = 'intro-char'; span.innerText = char;
            container.appendChild(span); charElements.push(span);
        }
    }
    const directions = [ {x:-900, y:-700}, {x:0, y:-900}, {x:900, y:-700}, {x:900, y:0}, {x:900, y:700}, {x:0, y:900}, {x:-900, y:700}, {x:-900, y:0} ];
    charElements.forEach((el) => {
        const randomX = (Math.random() - 0.5) * 400; const randomRotation = (Math.random() - 0.5) * 720;
        gsap.set(el, { y: -250, x: randomX, rotation: randomRotation, opacity: 0, scale: 0.8 });
    });
    gsap.set(subtitle, { opacity: 0, y: 20 });
    gsap.set('#introFooter', { opacity: 0, bottom: "-20vh" });

    const tl = gsap.timeline({ 
        onStart: () => { window.playIntroMusic(); },
        onComplete: () => {
            const introScreen = document.getElementById('intro-screen');
            if (introScreen) introScreen.classList.add('fade-out');
        } 
    });

    tl.to(charElements, { duration: 2.5, x: 0, y: 0, rotation: 360, opacity: 1, scale: 1, stagger: 0.1, ease: "power2.out" }, "start");
    tl.to(subtitle, { duration: 1.5, opacity: 1, y: 0, ease: "power2.out" }, "start+=1.0");
    tl.to('#introFooter', { duration: 1.5, bottom: "12%", opacity: 1, ease: "power2.out" }, "start+=1.5");
    tl.to([subtitle, '#introFooter'], { duration: 1.5, opacity: 0, y: 20, ease: "power1.in" }, "start+=6.5");
    charElements.forEach((el, index) => {
        const dir = directions[index % directions.length];
        tl.to(el, { duration: 2.0, x: dir.x, y: dir.y, opacity: 0, scale: 0.5, ease: "power1.inOut" }, `start+=7.5`);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    runLeafFallIntro();
    const silentResume = () => {
        if (window.audioCtx && window.audioCtx.state === 'suspended') window.audioCtx.resume();
        document.removeEventListener('click', silentResume);
        document.removeEventListener('touchstart', silentResume);
    };
    document.addEventListener('click', silentResume); document.addEventListener('touchstart', silentResume);
});


/* --- البورتال الأساسي ووظائف Firebase[cite: 13, 14] --- */

// دوال تحويل وتنسيق تواريخ إكسيل[cite: 13]
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

// التبديل الاحترافي للعين الشقية مع SVG[cite: 13]
function togglePasswordVisibility() {
    const passInput = document.getElementById('login-password');
    const svgIcon = document.getElementById('eye-icon');
    if (!passInput) return;
    if (passInput.type === 'password') {
        passInput.type = 'text';
        if (svgIcon) svgIcon.innerText = '🙈';
    } else {
        passInput.type = 'password';
        if (svgIcon) svgIcon.innerText = '👁️';
    }
}

// دوال مودال نسيت كلمة المرور[cite: 13]
function openForgotPassModal() {
    const modal = document.getElementById('forgot-pass-modal');
    if (modal) modal.classList.remove('hidden');
}
function closeForgotPassModal() {
    const modal = document.getElementById('forgot-pass-modal');
    if (modal) modal.classList.add('hidden');
}

// إعدادات فايربيس الرسمية[cite: 13]
const firebaseConfig = {
    apiKey: "AIzaSyA-ywy51h3TM6YF_n0bNj1D5lAMJ7uMnO4",
    authDomain: "lm-hr-portal.firebaseapp.com",
    databaseURL: "https://lm-hr-portal-default-rtdb.firebaseio.com",
    projectId: "lm-hr-portal",
    storageBucket: "lm-hr-portal.firebasestorage.app",
    messagingSenderId: "1008702496104",
    appId: "1:1008702496104:web:930dfe68388ef5a640cadd",
    measurementId: "G-Z6K3VG2SJ6"
};

// تهيئة Firebase[cite: 13]
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
}
const db = firebase.database();

let allEmployees = [];
let currentLang = 'ar';
let activeEmployeeCode = null;

// قاموس الترجمات الشامل للواجهة[cite: 13]
const translations = {
    ar: {
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
        no_results: "لا توجد نتائج مطابقة للبحث",
        action_btn: "عرض الملف",
        back_btn: "← العودة للقائمة",
        profile_title: "الملف الوظيفي الشامل",
        edit_btn: "تعديل البيانات",
        save_btn: "حفظ",
        yes_btn: "نعم",
        cancel_btn: "إلغاء",
        confirm_title: "هل ترغب في حفظ التعديلات؟",
        change_photo: "تعديل الصورة",
        sec_job: "البيانات الوظيفية",
        manager_label: "المدير المباشر",
        service_years: "سنوات الخدمة",
        sec_qual: "المؤهل العلمي",
        qual_label: "المؤهل",
        qual_auth: "جهة المؤهل",
        sec_personal: "البيانات الشخصية",
        dob_label: "تاريخ الميلاد",
        age_label: "السن حتى تاريخه",
        insurance_label: "الحالة التأمينية",
        pob_label: "مكان الميلاد",
        toast_success: "تم حفظ التعديلات بنجاح وتحديث Firebase"
    },
    en: {
        admin: "System Admin",
        control_panel: "Control Room",
        nav_home: "Home & Employees",
        nav_depts: "Departments",
        nav_attendance: "Attendance & Departure",
        nav_reports: "Reports & Analytics",
        total_emp: "Total Employees",
        active_depts: "Active Departments",
        system_status: "System Status",
        connected: "Stable (Connected to Firebase)",
        emp_list: "Database Employees List",
        search_placeholder: "Search by name or code...",
        th_code: "CODE",
        th_name: "EMPLOYEE NAME",
        th_dept: "DEPARTMENT",
        th_job: "JOB TITLE",
        th_hire: "HIRE DATE",
        th_actions: "ACTIONS",
        loading: "Fetching data from database...",
        no_results: "No matching results found",
        action_btn: "View Profile",
        back_btn: "← Back to List",
        profile_title: "Comprehensive Employee Profile",
        edit_btn: "Edit Data",
        save_btn: "Save",
        yes_btn: "Yes",
        cancel_btn: "Cancel",
        confirm_title: "Do you want to save changes?",
        change_photo: "Change Photo",
        sec_job: "Job Details",
        manager_label: "Direct Manager",
        service_years: "Years of Service",
        sec_qual: "Education Qualification",
        qual_label: "Qualification",
        qual_auth: "Issuing Authority",
        sec_personal: "Personal Data",
        dob_label: "Date of Birth",
        age_label: "Age to Date",
        insurance_label: "Insurance Status",
        pob_label: "Place of Birth",
        toast_success: "Changes saved successfully & synced with Firebase"
    }
};

// تسجيل الدخول وإخفاء شاشة اللوجن[cite: 13]
function handleLogin() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.style.transition = 'opacity 0.3s ease';
        loginModal.style.opacity = '0';
        setTimeout(() => {
            loginModal.style.display = 'none';
        }, 300);
    }
}

// تحميل بيانات الموظفين عند بدء التشغيل[cite: 13]
document.addEventListener('DOMContentLoaded', () => {
    fetch('clean_employees_data.json')
        .then(response => response.json())
        .then(data => {
            allEmployees = data.filter(emp => (emp["الكود"] || emp["code"]) && (emp["اسم الموظف "] || emp["emp_name _en"]));
            renderTable(allEmployees);
            updateDashboardStats();
        })
        .catch(error => console.error('Error loading employee data:', error));
});

// فتح وإغلاق القائمة المنسدلة للغة[cite: 13]
function toggleLangDropdown() {
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
}

// تغيير اللغة[cite: 13]
function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) dropdown.classList.add('hidden');

    const langFlag = document.getElementById('lang-flag');
    const langCode = document.getElementById('lang-code');
    if (langFlag && langCode) {
        langFlag.innerText = lang === 'ar' ? '🇪🇬' : '🇬🇧';
        langCode.innerText = lang === 'ar' ? 'AR' : 'EN';
    }

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = translations[currentLang]['search_placeholder'];

    renderTable(allEmployees);
    
    if (activeEmployeeCode !== null) {
        viewEmployee(activeEmployeeCode);
    }
}

// البحث الفوري[cite: 13]
function filterEmployees() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase().trim();
    
    const filtered = allEmployees.filter(emp => {
        const code = String(emp["الكود"] || emp["code"] || '').toLowerCase();
        const nameAr = String(emp["اسم الموظف "] || emp["اسم الموظف"] || '').toLowerCase();
        const nameEn = String(emp["emp_name _en"] || '').toLowerCase();
        return code.includes(query) || nameAr.includes(query) || nameEn.includes(query);
    });
    renderTable(filtered);
}

// عرض جدول الموظفين[cite: 13]
function renderTable(dataList) {
    const tableBody = document.getElementById('employees-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (dataList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">${translations[currentLang].no_results}</td></tr>`;
        return;
    }

    dataList.forEach(emp => {
        const empCode = emp["الكود"] || emp["code"] || '--';
        
        let empName = currentLang === 'ar' ? (emp["اسم الموظف "] || emp["اسم الموظف"] || '--') : (emp["emp_name _en"] || emp["اسم الموظف "] || '--');
        let empDept = currentLang === 'ar' ? (emp["الإدارة "] || emp["الإدارة"] || '--') : (emp["department "] || emp["department"] || '--');
        let empJob = currentLang === 'ar' ? (emp["الوظيفة"] || emp["الوظيفة "] || '--') : (emp["job title "] || emp["job title"] || '--');
        let rawHireDate = emp["تاريخ التعيين "] || emp["تاريخ التعيين"] || emp["date_of_hiring "] || '--';
        let empHireDate = typeof rawHireDate === 'number' ? excelDateToJSDate(rawHireDate) : rawHireDate;

        const row = document.createElement('tr');
        row.className = "hover:bg-slate-800/40 transition text-slate-300";
        row.innerHTML = `
            <td class="p-3.5 font-mono text-sky-400">${empCode}</td>
            <td class="p-3.5 font-semibold text-white">${empName.trim()}</td>
            <td class="p-3.5">${empDept.trim()}</td>
            <td class="p-3.5">${empJob.trim()}</td>
            <td class="p-3.5 font-mono text-xs">${empHireDate}</td>
            <td class="p-3.5 text-center">
                <button onclick="viewEmployee('${empCode}')" class="px-3.5 py-1.5 bg-sky-600/30 hover:bg-sky-600 text-sky-200 rounded-lg text-xs border border-sky-400/30 transition shadow-lg">${translations[currentLang].action_btn}</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// عرض ملف الموظف الكامل[cite: 13]
function viewEmployee(code) {
    activeEmployeeCode = code;
    const emp = allEmployees.find(e => String(e["الكود"] || e["code"]) === String(code));
    if (!emp) return;
    
    document.getElementById('employees-list-view').style.display = 'none';
    document.getElementById('employee-profile-view').style.display = 'block';

    setFieldVal('prof-code', code);
    setFieldVal('prof-name', (currentLang === 'ar' ? (emp["اسم الموظف "] || emp["اسم الموظف"]) : (emp["emp_name _en"] || emp["اسم الموظف "])));
    setFieldVal('prof-dept', (currentLang === 'ar' ? (emp["الإدارة "] || emp["الإدارة"]) : (emp["department "] || emp["department"])));
    setFieldVal('prof-job', (currentLang === 'ar' ? (emp["الوظيفة"] || emp["الوظيفة "]) : (emp["job title "] || emp["job title"])));
    setFieldVal('prof-manager', (currentLang === 'ar' ? (emp["المدير المباشر "] || emp["المدير المباشر"]) : (emp["direct manager "] || emp["direct manager"])));
    setFieldVal('prof-hire', excelDateToJSDate(emp["تاريخ التعيين "] || emp["تاريخ التعيين"] || emp["date_of_hiring "]));
    setFieldVal('prof-service', emp["سنوات الخدمة "] || emp["years service"] || '');
    setFieldVal('prof-qual', (currentLang === 'ar' ? emp["المؤهل"] : emp["qualification"]) || '');
    setFieldVal('prof-qual-auth', (currentLang === 'ar' ? (emp["جهة المؤهل "] || emp["جهة المؤهل"]) : (emp["qulification issuing authority"] || emp["issuer"])));
    setFieldVal('prof-dob', excelDateToJSDate(emp["تاريخ الميلاد"] || emp["dob"]));
    setFieldVal('prof-age', emp["السن حتى تاريخه "] || emp["age to date"] || '');
    setFieldVal('prof-insurance', (currentLang === 'ar' ? (emp["الحالة التأمينية "] || emp["الحالة التأمينية"]) : (emp["insurance status "] || emp["insurance status"])));
    setFieldVal('prof-pob', (currentLang === 'ar' ? (emp["مكان الميلاد"] || emp["مكان الميلاد"]) : (emp["pob "] || emp["pob"])));

    document.getElementById('profile-img').src = emp["photoUrl"] || 'default-avatar.png';
    
    document.getElementById('btn-save').classList.add('hidden');
    document.getElementById('btn-edit').classList.remove('hidden');
    document.getElementById('btn-photo').classList.add('hidden');
    setFieldsEditable(true);
}

function setFieldVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}

function enableEditing() {
    setFieldsEditable(false);
    document.getElementById('btn-edit').classList.add('hidden');
    document.getElementById('btn-save').classList.remove('hidden');
    document.getElementById('btn-photo').classList.remove('hidden');
}

function setFieldsEditable(isDisabled) {
    const fields = ['prof-name', 'prof-dept', 'prof-job', 'prof-manager', 'prof-hire', 'prof-service', 'prof-qual', 'prof-qual-auth', 'prof-dob', 'prof-age', 'prof-insurance', 'prof-pob'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.disabled = isDisabled;
            if (isDisabled) {
                el.classList.add('bg-slate-900/50', 'border-slate-700');
                el.classList.remove('bg-slate-900/90', 'border-sky-500/50');
            }
