// Lacto Misr HR Portal v6.2 - Strict Language Isolation & Full Stability

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

function updatePasswordEyeIcon() {
    const input = document.getElementById('login-password');
    const icon = document.getElementById('eye-icon');
    const button = document.getElementById('password-toggle');
    if (!input || !icon) return;
    const visible = input.type === 'text';
    icon.innerHTML = visible
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10.9 10.9 0 0 1 12 4.9c5.1 0 8.8 3.6 10 7.1-.4 1.3-1.3 2.6-2.4 3.7M6.2 6.2C4.2 7.6 2.8 9.4 2 12c1.2 3.6 4.9 7.1 10 7.1 1.2 0 2.3-.2 3.3-.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
    if (button) {
        button.setAttribute('aria-label', visible ? (currentLang === 'ar' ? 'إخفاء كلمة المرور' : 'Hide password') : (currentLang === 'ar' ? 'إظهار كلمة المرور' : 'Show password'));
        button.title = button.getAttribute('aria-label');
    }
}
function togglePasswordVisibility() {
    const input = document.getElementById('login-password');
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    updatePasswordEyeIcon();
}

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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    try { firebase.analytics(); } catch (e) {}
}
const db = firebase.database();
const portalAuth = firebase.auth();
const PORTAL_ADMIN_CODE = '778';
const PORTAL_ADMIN_EMAIL = 'mostafa.mohamed21@gmail.com';
const PORTAL_ADMIN_UID = 'iwiAJHISsqaMAVtT3NG3SNqaQ7m2';
function portalIsAdmin() { return !!portalAuth.currentUser && portalAuth.currentUser.uid === PORTAL_ADMIN_UID; }


let allEmployees = [];
let currentLang = localStorage.getItem('lacto_lang') || 'ar';
let activeEmployeeCode = null;
let currentUserData = null;
let portalInitialized = false;

const translations = {
    ar: {
        admin: "مسؤول النظام", control_panel: "غرفة التحكم", nav_home: "الرئيسية والموظفين", nav_depts: "الإدارات والأقسام",
        nav_attendance: "الحضور والإنصراف", nav_reports: "التقارير والإحصائيات", total_emp: "إجمالي العاملين", active_depts: "الإدارات النشطة",
        system_status: "حالة النظام", connected: "مستقر (متصل بـ Firebase)", emp_list: "قائمة العاملين بالقاعدة", search_placeholder: "بحث بالاسم أو الكود...",
        th_code: "الكود", th_name: "اسم الموظف", th_dept: "الإدارة", th_job: "الوظيفة", th_hire: "تاريخ التعيين", th_actions: "الإجراءات",
        loading: "جاري جلب البيانات من القاعدة...", no_results: "لا توجد نتائج مطابقة للبحث", action_btn: "عرض الملف", back_btn: "← العودة للقائمة",
        profile_title: "الملف الوظيفي الشامل", edit_btn: "تعديل البيانات", save_btn: "حفظ", yes_btn: "نعم", cancel_btn: "إلغاء",
        confirm_title: "هل ترغب في حفظ التعديلات؟", change_photo: "تعديل الصورة", sec_job: "البيانات الوظيفية", manager_label: "المدير المباشر",
        service_years: "سنوات الخدمة", sec_qual: "المؤهل العلمي", qual_label: "المؤهل", qual_auth: "جهة المؤهل", sec_personal: "البيانات الشخصية",
        dob_label: "تاريخ الميلاد", age_label: "السن حتى تاريخه", insurance_label: "الحالة التأمينية", pob_label: "مكان الميلاد",
        toast_success: "تم حفظ التعديلات بنجاح وتحديث Firebase", login_title: "تسجيل الدخول", login_subtitle: "أدخل كود الموظف وكلمة المرور",
        code_placeholder: "كود الموظف", pass_placeholder: "كلمة المرور", remember_me: "تذكرني", forgot_pass: "نسيت كلمة المرور؟", login_btn: "دخول للنظام",
        logout_btn: "تسجيل الخروج", login_required: "يرجى إدخال كود الموظف وكلمة المرور", login_not_found: "كود الموظف غير مسجل!",
        login_wrong_pass: "كلمة المرور غير صحيحة!", setup_password_title: "الموظف مسجل لكن لا توجد كلمة مرور. أنشئ كلمة مرور للمتابعة.", confirm_password_placeholder: "تأكيد كلمة المرور", create_password_btn: "إنشاء كلمة المرور والدخول", password_mismatch: "كلمتا المرور غير متطابقتين.", password_too_short: "كلمة المرور يجب أن تكون 6 أحرف على الأقل.", password_saved: "تم إنشاء كلمة المرور وحفظها. جاري تسجيل الدخول...", login_error: "حدث خطأ أثناء الاتصال، حاول مرة أخرى.", logged_out: "تم تسجيل الخروج بنجاح",
        add_employee_btn: "+ إضافة موظف", add_employee_title: "إضافة موظف جديد", add_employee_hint: "سيتم إنشاء السجل مباشرة داخل Firebase.", save_employee_btn: "حفظ الموظف",
        employee_exists: "هذا الكود موجود بالفعل.", employee_saved: "تمت إضافة الموظف بنجاح إلى Firebase.", required_code: "كود الموظف مطلوب.",
        firebase_fields_title: "حقول Firebase", firebase_fields_hint: "كل الحقول الموجودة فعلياً على سجل الموظف تظهر هنا ويمكن تعديلها.",
        add_custom_field_btn: "+ إضافة خانة إضافية", custom_field_title: "إضافة خانة إضافية", field_name_label: "اسم الخانة", field_value_label: "القيمة",
        custom_field_saved: "تمت إضافة الخانة وتحديث Firebase فوراً.", custom_field_invalid: "اسم الخانة غير صالح. تجنب . # $ [ ] /",
        forgot_title: "استعادة كلمة المرور", forgot_hint: "سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريد الإدارة.", forgot_code_placeholder: "كود الموظف",
        forgot_email_placeholder: "البريد الإلكتروني (يُطلب فقط إذا لم يكن مسجلاً)", verification_placeholder: "رمز التحقق", new_password_placeholder: "كلمة المرور الجديدة",
        send_code_btn: "إرسال رابط إعادة التعيين", verify_reset_btn: "تحقق وتغيير كلمة المرور", forgot_email_note: "يجب تفعيل خدمة البريد في Firebase (Trigger Email/Cloud Function) لكي يصل الرمز فعلياً إلى البريد.",
        email_required: "أدخل البريد الإلكتروني.", code_sent: "تم إنشاء رمز التحقق وتجهيزه للإرسال إلى البريد.", code_sent_no_email: "تم تجهيز الرمز، لكن خدمة البريد غير مفعلة في Firebase بعد.",
        invalid_code: "رمز التحقق غير صحيح أو منتهي.", password_changed: "تم تغيير كلمة المرور بنجاح.", new_password_required: "أدخل كلمة المرور الجديدة.",
        code_expired: "انتهت صلاحية رمز التحقق، اطلب رمزاً جديداً.", employee_email_found: "تم العثور على البريد المسجل.", employee_email_missing: "لا يوجد بريد مسجل، أدخل بريد الموظف.",
        schema_loading: "جاري تجهيز حقول Firebase...",
        header_brand: "لاكتو مصر - شؤون العاملين", powered_by: "برمجة وتطوير إدارة الموارد البشرية", portal_version: "بورتال الموظفين v5.2 - النسخة الاحترافية"
    },
    en: {
        admin: "System Admin", control_panel: "Control Room", nav_home: "Home & Employees", nav_depts: "Departments",
        nav_attendance: "Attendance & Departure", nav_reports: "Reports & Analytics", total_emp: "Total Employees", active_depts: "Active Departments",
        system_status: "System Status", connected: "Stable (Connected to Firebase)", emp_list: "Database Employees List", search_placeholder: "Search by name or code...",
        th_code: "CODE", th_name: "EMPLOYEE NAME", th_dept: "DEPARTMENT", th_job: "JOB TITLE", th_hire: "HIRE DATE", th_actions: "ACTIONS",
        loading: "Fetching data from database...", no_results: "No matching results found", action_btn: "View Profile", back_btn: "← Back to List",
        profile_title: "Comprehensive Employee Profile", edit_btn: "Edit Data", save_btn: "Save", yes_btn: "Yes", cancel_btn: "Cancel",
        confirm_title: "Do you want to save changes?", change_photo: "Change Photo", sec_job: "Job Details", manager_label: "Direct Manager",
        service_years: "Years of Service", sec_qual: "Education Qualification", qual_label: "Qualification", qual_auth: "Issuing Authority", sec_personal: "Personal Data",
        dob_label: "Date of Birth", age_label: "Age to Date", insurance_label: "Insurance Status", pob_label: "Place of Birth",
        toast_success: "Changes saved successfully & synced with Firebase", login_title: "Sign in", login_subtitle: "Enter employee code and password",
        code_placeholder: "Employee Code", pass_placeholder: "Password", remember_me: "Remember Me", forgot_pass: "Forgot password?", login_btn: "Sign in",
        logout_btn: "Sign out", login_required: "Please enter employee code and password", login_not_found: "Employee code not found!",
        login_wrong_pass: "Incorrect password!", setup_password_title: "Your employee record exists but has no password. Create one to continue.", confirm_password_placeholder: "Confirm password", create_password_btn: "Create Password & Sign In", password_mismatch: "The passwords do not match.", password_too_short: "Password must be at least 6 characters.", password_saved: "Password created and saved. Signing in...", login_error: "Connection error. Please try again.", logged_out: "Signed out successfully",
        add_employee_btn: "+ Add Employee", add_employee_title: "Add New Employee", add_employee_hint: "The record will be created directly in Firebase.", save_employee_btn: "Save Employee",
        employee_exists: "This employee code already exists.", employee_saved: "Employee added successfully to Firebase.", required_code: "Employee code is required.",
        firebase_fields_title: "Firebase Fields", firebase_fields_hint: "All fields currently stored on the employee record appear here and can be edited.",
        add_custom_field_btn: "+ Add Extra Field", custom_field_title: "Add Extra Field", field_name_label: "Field Name", field_value_label: "Value",
        custom_field_saved: "Field added and Firebase updated immediately.", custom_field_invalid: "Invalid field name. Avoid . # $ [ ] /",
        forgot_title: "Password Recovery", forgot_hint: "A password reset link will be sent to the admin email.", forgot_code_placeholder: "Employee Code",
        forgot_email_placeholder: "Email (only required if not registered)", verification_placeholder: "Verification Code", new_password_placeholder: "New Password",
        send_code_btn: "Send Reset Link", verify_reset_btn: "Verify & Change Password", forgot_email_note: "Firebase email delivery (Trigger Email/Cloud Function) must be enabled for the code to reach the mailbox.",
        email_required: "Enter an email address.", code_sent: "Verification code created and queued for email delivery.", code_sent_no_email: "Code prepared, but Firebase email delivery is not enabled yet.",
        invalid_code: "Invalid or expired verification code.", password_changed: "Password changed successfully.", new_password_required: "Enter the new password.",
        code_expired: "The verification code has expired. Request a new one.", employee_email_found: "Registered email found.", employee_email_missing: "No registered email found. Enter the employee email.",
        schema_loading: "Preparing Firebase fields...",
        header_brand: "Lacto Misr HR", powered_by: "Powered by HR Department", portal_version: "Portal v5.2 - Pro Edition"
    }
};

// دوال جلب البيانات الصارمة للفصل بين اللغات (بدون أي تداخل عربي مع إنجليزي)
function getEmployeeName(emp) {
    if (!emp) return '--';
    if (currentLang === 'ar') {
        return getField(emp, 'اسم الموظف ', 'اسم الموظف', 'name') || '--';
    } else {
        return getField(emp, 'emp_name _en', 'name', 'employee_name_en') || '--';
    }
}

function getEmployeeDept(emp) {
    if (!emp) return '--';
    if (currentLang === 'ar') {
        return getField(emp, 'الإدارة ', 'الإدارة', 'department') || '--';
    } else {
        return getField(emp, 'department ', 'department', 'dept') || '--';
    }
}

function getEmployeeJob(emp) {
    if (!emp) return '--';
    if (currentLang === 'ar') {
        return getField(emp, 'الوظيفة', 'الوظيفة ', 'jobTitle', 'job') || '--';
    } else {
        return getField(emp, 'job title ', 'jobTitle', 'job title', 'job') || '--';
    }
}

const fieldLabels = {
    code: ['الكود', 'CODE'], name: ['اسم الموظف', 'EMPLOYEE NAME'], department: ['الإدارة', 'DEPARTMENT'], jobTitle: ['الوظيفة', 'JOB TITLE'],
    directManager: ['المدير المباشر', 'DIRECT MANAGER'], hireDate: ['تاريخ التعيين', 'HIRE DATE'], yearsService: ['سنوات الخدمة', 'YEARS OF SERVICE'],
    qualification: ['المؤهل', 'QUALIFICATION'], qualAuth: ['جهة المؤهل', 'QUALIFICATION AUTHORITY'], dob: ['تاريخ الميلاد', 'DATE OF BIRTH'],
    age: ['السن حتى تاريخه', 'AGE TO DATE'], insuranceStatus: ['الحالة التأمينية', 'INSURANCE STATUS'], pob: ['مكان الميلاد', 'PLACE OF BIRTH'],
    photoUrl: ['رابط الصورة', 'PHOTO URL'], email: ['البريد الإلكتروني', 'EMAIL'], password: ['كلمة المرور', 'PASSWORD']
};

function tr(key) { return translations[currentLang][key] || key; }
function getField(emp, ...keys) {
    for (const key of keys) {
        if (emp && emp[key] !== undefined && emp[key] !== null && String(emp[key]).trim() !== '') return emp[key];
    }
    return '';
}
function getEmployeeCode(emp) { return String(getField(emp, 'الكود', 'code', 'employeeCode', 'empCode', 'EmployeeCode', 'employee_code', 'ID', 'id') || '').trim(); }

function existingKey(obj, keys, fallback) {
    for (const key of keys) if (Object.prototype.hasOwnProperty.call(obj || {}, key)) return key;
    return fallback || keys[0];
}
function putMapped(obj, source, keys, value, fallback) {
    const key = existingKey(source, keys, fallback);
    obj[key] = value;
}

function displayKey(key) {
    if (fieldLabels[key]) return fieldLabels[key][currentLang==='ar'?0:1];
    const cleaned = String(key).replace(/_/g,' ').trim();
    return currentLang==='ar' ? cleaned : cleaned.toUpperCase();
}
function isValidFirebaseKey(key) { return key && !/[.#$\[\]\/]/.test(key) && key !== '.priority'; }

function toggleLoginLangMenu(event) {
    if (event) event.stopPropagation();
    document.getElementById('login-lang-menu')?.classList.toggle('show');
}
function toggleLangDropdown(event) {
    if (event) event.stopPropagation();
    document.getElementById('lang-dropdown')?.classList.toggle('show');
}

function setLanguage(lang) {
    if(typeof fahdHasUnsavedChanges==='function' && fahdHasUnsavedChanges() && !window.fahdNavigationApproved){fahdGuardNavigation(()=>setLanguage(lang));return;}
    currentLang = lang === 'en' ? 'en' : 'ar';
    if(typeof fahdEditing!=='undefined' && fahdEditing?.code && typeof allEmployees!=='undefined'){const current=allEmployees.find(e=>String(getEmployeeCode(e))===String(fahdEditing.code));if(current && document.getElementById('fahd1-native')?.offsetParent!==null)queueMicrotask(()=>fahdRender(current));}
    localStorage.setItem('lacto_lang', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    const hrBrand=document.getElementById('hr-header-brand');if(hrBrand)hrBrand.textContent=hrBrand.dataset[currentLang];

    const short = document.getElementById('login-lang-short');
    if (short) short.innerText = currentLang.toUpperCase();
    const code = document.getElementById('lang-code');
    if (code) code.innerText = currentLang.toUpperCase();

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang][key]) el.innerText = translations[currentLang][key];
    });
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (translations[currentLang][key]) el.placeholder = translations[currentLang][key];
    });

    const subtitle = document.getElementById('introSubtitle');
    if (subtitle) subtitle.innerText = subtitle.getAttribute(`data-${currentLang}`) || '';
    const copyright = document.getElementById('copyrightText');
    if (copyright) copyright.innerText = copyright.getAttribute(`data-${currentLang}`) || '';
    const slogan = document.getElementById('login-brand-slogan');
    if (slogan) slogan.innerText = currentLang === 'ar' ? 'شركاء في رحلة نمو طفلك' : "Partners in your child's growth journey";
    const brandName = document.getElementById('login-brand-name');
    if (brandName) brandName.innerText = currentLang === 'ar' ? 'لاكتو مصر' : 'Lacto Misr';

    document.getElementById('login-lang-menu')?.classList.remove('show');
    document.getElementById('lang-dropdown')?.classList.remove('show');
    updatePasswordEyeIcon();
    const confirmPass = document.getElementById('confirm-new-password');
    if (confirmPass) confirmPass.placeholder = tr('confirm_password_placeholder');
    const setupNote = document.getElementById('first-password-note');
    if (setupNote) setupNote.innerText = tr('setup_password_title');
    const createBtn = document.getElementById('create-password-btn');
    if (createBtn) createBtn.innerText = tr('create_password_btn');
    renderTable(allEmployees);
    if (typeof renderHRWorkspace === 'function') renderHRWorkspace();
    if (activeEmployeeCode !== null) viewEmployee(activeEmployeeCode);
    document.querySelectorAll("[data-ar][data-en]:not(.hr-nav [data-ar])").forEach(el=>{el.textContent=el.getAttribute("data-"+currentLang);});
    if (document.getElementById('add-employee-modal') && !document.getElementById('add-employee-modal').classList.contains('hidden')) buildAddEmployeeForm();

}

function showLoginMessage(message, type='error') {
    const el = document.getElementById('login-error');
    if (!el) return;
    el.style.color = type === 'success' ? '#67e8f9' : '#f87171';
    el.innerText = message || '';
}

function hideLogin() {
    const modal = document.getElementById('login-modal');
    if (!modal) return;
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    setTimeout(() => modal.style.display='none', 350);
}

// PORTAL V2 (2026-10-25): read/write canonical employee records by employee CODE.
// Legacy numeric root records are intentionally untouched and no longer read.
// The pilot employee 950 remains in its original path until separately migrated.
const PORTAL_EMPLOYEE_COLLECTION = 'employees_v2';
// employees_v2 is the sole employee data source; legacy roots are never read.
function portalSafeRecord(data, code, path) {
    const safeData = {...data};
    for (const field of Object.keys(safeData)) {
        if (/^(password|pass|passwordhash|كلمة المرور)$/i.test(field)) delete safeData[field];
    }
    return {...safeData, code: String(code), _firebasePath: path, _firebaseKey: String(code)};
}
async function readEmployeeSources() {
    if (!portalIsAdmin()) throw new Error('UNAUTHORIZED_ADMIN');
    // Fail closed: a denied /employees_v2 read must not silently show stale records.
    const v2Snap = await db.ref(PORTAL_EMPLOYEE_COLLECTION).once('value');
    if (!v2Snap.exists()) throw new Error('EMPLOYEES_V2_MISSING');
    const records = [];
    const byCode = new Set();
    Object.entries(v2Snap.val() || {}).forEach(([key, data]) => {
        if (!data || typeof data !== 'object' || Array.isArray(data)) return;
        const embedded = String(getField(data,'code','الكود','employeeCode') || '').trim();
        if (!/^\d+$/.test(key) || embedded !== key) {
            console.warn('Skipped employee record with mismatched key/code', key);
            return;
        }
        if (byCode.has(key)) return;
        byCode.add(key);
        records.push(portalSafeRecord(data, key, PORTAL_EMPLOYEE_COLLECTION + '/' + key));
    });
    records.sort((a,b)=>Number(a.code)-Number(b.code));
    return records;
}

async function findEmployeeRecord(code) {
    const records = await readEmployeeSources();
    const match = records.find(record => String(getEmployeeCode(record)).trim() === String(code).trim());
    if (!match) return null;
    return {
        key: match._firebaseKey || String(code),
        data: match,
        path: match._firebasePath || `${PORTAL_EMPLOYEE_COLLECTION}/${match._firebaseKey || code}`
    };
}

function showFirstPasswordSetup(code, employeeRecord) {
    const panel = document.getElementById('first-password-setup');
    if (!panel) return;
    panel.dataset.employeeCode = code;
    panel.dataset.employeePath = employeeRecord ? employeeRecord.path : '';
    panel.classList.remove('hidden');
    const note = document.getElementById('first-password-note');
    if (note) note.innerText = tr('setup_password_title');
    const password = document.getElementById('login-password');
    if (password) { password.value = ''; password.placeholder = currentLang === 'ar' ? 'أنشئ كلمة مرور جديدة' : 'Create a new password'; password.setAttribute('autocomplete', 'new-password'); }
    const confirm = document.getElementById('confirm-new-password');
    if (confirm) { confirm.value = ''; confirm.placeholder = tr('confirm_password_placeholder'); confirm.focus(); }
    const create = document.getElementById('create-password-btn');
    if (create) create.innerText = tr('create_password_btn');
    showLoginMessage('', 'success');
}

async function handleLogin() {
    const code = String(document.getElementById('login-emp-code')?.value || '').trim();
    const pass = String(document.getElementById('login-password')?.value || '');
    const remember = !!document.getElementById('remember-me')?.checked;
    if (!code || !pass) { showLoginMessage(tr('login_required')); return; }
    if (code !== PORTAL_ADMIN_CODE) { showLoginMessage(currentLang === 'ar' ? 'هذا الإصدار التجريبي مخصص لحساب الإدارة فقط.' : 'This test build is restricted to the admin account.'); return; }
    showLoginMessage(currentLang === 'ar' ? 'جاري التحقق من Firebase...' : 'Verifying with Firebase...', 'success');
    try {
        await portalAuth.setPersistence(remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION);
        const credential = await portalAuth.signInWithEmailAndPassword(PORTAL_ADMIN_EMAIL, pass);
        if (credential.user.uid !== PORTAL_ADMIN_UID) {
            await portalAuth.signOut();
            throw new Error('ADMIN_UID_MISMATCH');
        }
        await completeLogin(code, null, remember, {code, name: currentLang === 'ar' ? 'مسؤول النظام' : 'System Admin'});
    } catch (error) {
        console.error('Portal auth failed:', error.code || error.message);
        showLoginMessage(error.message === 'ADMIN_UID_MISMATCH'
            ? (currentLang === 'ar' ? 'الحساب لا يطابق UID المسؤول المحدد.' : 'Admin UID mismatch.')
            : (currentLang === 'ar' ? 'تعذر تسجيل الدخول. تأكد من كلمة المرور وإعدادات Firebase.' : 'Sign-in failed. Check your password and Firebase settings.'));
    }
}

// First-time password creation must be done through Firebase Authentication, never the database.
function createFirstPassword() {
    showLoginMessage(currentLang === 'ar' ? 'إنشاء الحسابات يتم من Firebase Authentication.' : 'Accounts are created in Firebase Authentication.');
}
async function completeLogin(code, pass, remember, user) {
    if (!portalIsAdmin()) throw new Error('UNAUTHORIZED_ADMIN');
    currentUserData = { ...(user || {}), code };
    localStorage.removeItem('lacto_saved_pass');
    localStorage.setItem('lacto_saved_code', remember ? code : '');
    sessionStorage.setItem('lacto_active_code', code);
    const passwordInput = document.getElementById('login-password');
    if (passwordInput) passwordInput.value = '';
    const label = document.getElementById('current-user-label');
    if (label) { label.classList.remove('hidden'); label.innerText = currentLang === 'ar' ? 'مسؤول النظام' : 'System Admin'; }
    hideLogin();
    document.body.classList.add('portal-signed-in');
    portalInitialized = true;
    await loadEmployeesFromFirebase();
    lmUpdateHeaderIdentity();
}
async function handleLogout() {
    localStorage.removeItem('lacto_saved_pass');
    localStorage.removeItem('lacto_saved_code');
    sessionStorage.removeItem('lacto_active_code');
    document.body.classList.remove('portal-signed-in');
    await portalAuth.signOut();
    window.location.reload();
}

async function loadEmployeesFromFirebase() {
    const tableBody = document.getElementById('employees-table-body');
    if (tableBody) tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">${tr('loading')}</td></tr>`;
    try {
        allEmployees = await readEmployeeSources();
        queueMicrotask(lmUpdateHeaderIdentity);
        renderTable(allEmployees);
        updateDashboardStats();
        if(hrActivePage==='dashboard') renderHRWorkspace();
        if (typeof renderHRWorkspace === 'function') renderHRWorkspace();
        const status = document.getElementById('connection-status');
        if (status) status.textContent = currentLang === 'ar'
            ? `متصل بـ Firebase — ${allEmployees.length} موظف`
            : `Connected to Firebase — ${allEmployees.length} employees`;
    } catch (error) {
        if (tableBody) tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-300">${tr('login_error')}</td></tr>`;
        showToast(tr('login_error'), true);
    }
}

function filterEmployees() {
    const input = document.getElementById('search-input');
    if (!input) return;
    const query = input.value.trim();
    if (!query) { renderTable(allEmployees); return; }
    const numericQuery = /^[0-9]+$/.test(query);
    const normalizedQuery = query.toLocaleLowerCase();
    renderTable(allEmployees.filter(emp => {
        if (numericQuery) {
            return String(getEmployeeCode(emp) ?? '').trim() === query;
        }
        return String(getEmployeeName(emp) ?? '').toLocaleLowerCase().includes(normalizedQuery);
    }));
}

function renderTable(dataList) {
    const tableBody=document.getElementById('employees-table-body'); if(!tableBody) return;
    tableBody.innerHTML='';
    if(!dataList.length){ tableBody.innerHTML=`<tr><td colspan="6" class="p-6 text-center text-slate-400">${tr('no_results')}</td></tr>`; return; }
    dataList.forEach(emp=>{
        const code=getEmployeeCode(emp)||'--';
        const name=getEmployeeName(emp);
        const dept=getEmployeeDept(emp);
        const job=getEmployeeJob(emp);
        const hire=getHireDate(emp);
        const row=document.createElement('tr'); row.className='hover:bg-slate-800/40 transition text-slate-300';
        row.innerHTML=`<td class="p-3.5 font-mono text-sky-400">${escapeHtml(code)}</td><td class="p-3.5 font-semibold text-white">${escapeHtml(String(name).trim())}</td><td class="p-3.5">${escapeHtml(String(dept).trim())}</td><td class="p-3.5">${escapeHtml(String(job).trim())}</td><td class="p-3.5 font-mono text-xs">${escapeHtml(String(hire))}</td><td class="p-3.5 text-center"><button onclick="viewEmployee('${escapeAttr(code)}')" class="px-3.5 py-1.5 bg-sky-600/30 hover:bg-sky-600 text-sky-200 rounded-lg text-xs border border-sky-400/30 transition shadow-lg">${tr('action_btn')}</button></td>`;
        tableBody.appendChild(row);
    });
}

function getHireDate(emp) { const v=getField(emp,'تاريخ التعيين ','تاريخ التعيين','hireDate','date_of_hiring '); return typeof v==='number'?excelDateToJSDate(v):v||'--'; }

function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function escapeAttr(value){return String(value).replace(/\\/g,'\\\\').replace(/'/g,"\\'");}

function viewEmployee(code) {
    if(fahdHasUnsavedChanges()&&!window.fahdNavigationApproved){fahdGuardNavigation(()=>viewEmployee(code));return;}

    if (typeof showHRPage === 'function' && hrActivePage !== 'employees') showHRPage('employees');
    activeEmployeeCode=code;
    const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(code)); if(!emp) return;
    const listView = document.getElementById('employees-list-view');
    const profileView = document.getElementById('employee-profile-view');
    if (listView) { listView.classList.add('hidden'); listView.style.display='none'; }
    if (profileView) { profileView.classList.remove('hidden'); profileView.style.display='block'; }
    setFieldVal('prof-code',code);
    setFieldVal('prof-name', getEmployeeName(emp));
    setFieldVal('prof-dept', getEmployeeDept(emp));
    setFieldVal('prof-job', getEmployeeJob(emp));
    setFieldVal('prof-manager', currentLang === 'ar' ? (getField(emp, 'المدير المباشر ', 'المدير المباشر', 'directManager') || '--') : (getField(emp, 'direct manager ', 'directManager') || '--'));
    setFieldVal('prof-hire',getHireDate(emp));
    setFieldVal('prof-service',getField(emp,'سنوات الخدمة ','سنوات الخدمة','yearsService','years service'));
    setFieldVal('prof-qual', currentLang === 'ar' ? (getField(emp, 'المؤهل', 'qualification') || '--') : (getField(emp, 'qualification') || '--'));
    setFieldVal('prof-qual-auth', currentLang === 'ar' ? (getField(emp, 'جهة المؤهل ', 'جهة المؤهل', 'qualAuth') || '--') : (getField(emp, 'qulification issuing authority', 'qualAuth', 'issuer') || '--'));
    setFieldVal('prof-dob',excelDateToJSDate(getField(emp,'تاريخ الميلاد','dob')));
    setFieldVal('prof-age',getField(emp,'السن حتى تاريخه ','السن حتى تاريخه','age','age to date'));
    setFieldVal('prof-insurance', currentLang === 'ar' ? (getField(emp, 'الحالة التأمينية ', 'الحالة التأمينية', 'insuranceStatus') || '--') : (getField(emp, 'insurance status ', 'insuranceStatus') || '--'));
    setFieldVal('prof-pob', currentLang === 'ar' ? (getField(emp, 'مكان الميلاد', 'pob') || '--') : (getField(emp, 'pob') || '--'));
    document.getElementById('profile-img').src=getField(emp,'photoUrl','photo','رابط الصورة') || 'default-avatar.png';
    document.getElementById('btn-save')?.classList.add('hidden'); document.getElementById('btn-edit')?.classList.remove('hidden'); document.getElementById('btn-photo')?.classList.add('hidden');
    setFieldsEditable(true);
    renderExtraEmployeeFields();
    fahdRender(emp);
}
function setFieldVal(id,val){const el=document.getElementById(id);if(el)el.value=val??'';}
function enableEditing(){setFieldsEditable(false);document.getElementById('btn-edit')?.classList.add('hidden');document.getElementById('btn-save')?.classList.remove('hidden');document.getElementById('btn-photo')?.classList.remove('hidden');}
function setFieldsEditable(isDisabled){['prof-name','prof-dept','prof-job','prof-manager','prof-hire','prof-service','prof-qual','prof-qual-auth','prof-dob','prof-age','prof-insurance','prof-pob'].forEach(id=>{const el=document.getElementById(id);if(!el)return;el.disabled=isDisabled;el.classList.toggle('bg-slate-900/50',isDisabled);el.classList.toggle('border-slate-700',isDisabled);el.classList.toggle('bg-slate-900/90',!isDisabled);el.classList.toggle('border-sky-500/50',!isDisabled);});}
function backToEmployeesList(){if(fahdHasUnsavedChanges()&&!window.fahdNavigationApproved){fahdGuardNavigation(()=>backToEmployeesList());return;}if (typeof showHRPage === 'function' && hrActivePage !== 'employees') showHRPage('employees');activeEmployeeCode=null;const profile=document.getElementById('employee-profile-view');const list=document.getElementById('employees-list-view');if(profile){profile.classList.add('hidden');profile.style.display='none';}if(list){list.classList.remove('hidden');list.style.display='block';}}

function renderDynamicFields(){
    const container=document.getElementById('dynamic-fields-container'); if(!container)return; container.remove(); return; // Technical fields are intentionally hidden
    const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(activeEmployeeCode)); if(!emp)return;
    container.innerHTML='';
    Object.keys(emp).sort().forEach(key=>{
        if(['code','_firebasePath','_firebaseKey'].includes(key) || ['الكود'].includes(key)) return;
        const value=emp[key];
        if(value && typeof value==='object') return;
        const card=document.createElement('div'); card.className='dynamic-field-card';
        const inputType=/date|dob|تاريخ/i.test(key)?'date':'text';
        card.innerHTML=`<div class="flex items-center justify-between gap-2 mb-1"><label class="text-xs text-slate-400">${escapeHtml(displayKey(key))}</label><span class="firebase-key-badge">${escapeHtml(key)}</span></div><input data-firebase-key="${escapeAttr(key)}" type="${inputType}" value="${escapeHtml(value??'')}" ${key==='password'?'autocomplete="new-password"':''} class="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 text-sm" disabled>`;
        container.appendChild(card);
    });
}

function confirmSave(){const modal=document.getElementById('confirm-modal');if(modal){document.getElementById('confirm-title').innerText=tr('confirm_title');modal.classList.remove('hidden');}}
function closeConfirmModal(){document.getElementById('confirm-modal')?.classList.add('hidden');}

async function executeSave(){
    closeConfirmModal(); if(activeEmployeeCode===null)return;
    const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(activeEmployeeCode)); if(!emp)return;
    const updatedData={};
    putMapped(updatedData, emp, ['الكود','code','employeeCode','empCode'], activeEmployeeCode, 'code');
    putMapped(updatedData, emp, ['اسم الموظف ','اسم الموظف','name','emp_name _en'], document.getElementById('prof-name').value, 'name');
    putMapped(updatedData, emp, ['الإدارة ','الإدارة','department','dept'], document.getElementById('prof-dept').value, 'department');
    putMapped(updatedData, emp, ['الوظيفة','الوظيفة ','jobTitle','job title','job'], document.getElementById('prof-job').value, 'jobTitle');
    putMapped(updatedData, emp, ['المدير المباشر ','المدير المباشر','directManager','direct manager'], document.getElementById('prof-manager').value, 'directManager');
    putMapped(updatedData, emp, ['تاريخ التعيين ','تاريخ التعيين','hireDate','date_of_hiring '], document.getElementById('prof-hire').value, 'hireDate');
    putMapped(updatedData, emp, ['سنوات الخدمة ','سنوات الخدمة','yearsService','years service'], document.getElementById('prof-service').value, 'yearsService');
    putMapped(updatedData, emp, ['المؤهل','qualification'], document.getElementById('prof-qual').value, 'qualification');
    putMapped(updatedData, emp, ['جهة المؤهل ','جهة المؤهل','qualAuth','qulification issuing authority','issuer'], document.getElementById('prof-qual-auth').value, 'qualAuth');
    putMapped(updatedData, emp, ['تاريخ الميلاد','dob'], document.getElementById('prof-dob').value, 'dob');
    putMapped(updatedData, emp, ['السن حتى تاريخه ','السن حتى تاريخه','age','age to date'], document.getElementById('prof-age').value, 'age');
    putMapped(updatedData, emp, ['الحالة التأمينية ','الحالة التأمينية','insuranceStatus','insurance status'], document.getElementById('prof-insurance').value, 'insuranceStatus');
    putMapped(updatedData, emp, ['مكان الميلاد','pob'], document.getElementById('prof-pob').value, 'pob');
    putMapped(updatedData, emp, ['photoUrl','photo','رابط الصورة'], document.getElementById('profile-img').src, 'photoUrl');
    document.querySelectorAll('#dynamic-fields-container [data-firebase-key]').forEach(input=>{
        const key=input.getAttribute('data-firebase-key'); if(isValidFirebaseKey(key) && !/password|pass|كلمة المرور/i.test(key)) updatedData[key]=input.value;
    });
    try{
        const savePath = emp._firebasePath || `${PORTAL_EMPLOYEE_COLLECTION}/${activeEmployeeCode}`;
        await db.ref(savePath).update(updatedData);
        Object.assign(emp,updatedData); showToast(); setFieldsEditable(true); document.getElementById('btn-save')?.classList.add('hidden'); document.getElementById('btn-edit')?.classList.remove('hidden'); document.getElementById('btn-photo')?.classList.add('hidden'); renderTable(allEmployees);
    }catch(error){showToast(tr('login_error'),true);}
}

function uploadEmployeePhoto(event){const file=event.target.files?.[0];if(!file||activeEmployeeCode===null)return;const reader=new FileReader();reader.onload=async e=>{const base64=e.target.result;document.getElementById('profile-img').src=base64;try{const emp=allEmployees.find(x=>String(getEmployeeCode(x))===String(activeEmployeeCode));const savePath=emp?emp._firebasePath:`${PORTAL_EMPLOYEE_COLLECTION}/${activeEmployeeCode}`;await db.ref(savePath).update({photoUrl:base64});if(emp)emp.photoUrl=base64;showToast();}catch(err){}};reader.readAsDataURL(file);}

function showToast(message=null,isError=false){const toast=document.getElementById('toast-notification');const msg=document.getElementById('toast-message');if(!toast||!msg)return;msg.innerText=message||tr('toast_success');msg.classList.toggle('text-red-300',isError);msg.classList.toggle('text-white',!isError);toast.classList.remove('translate-y-32','opacity-0');setTimeout(()=>toast.classList.add('translate-y-32','opacity-0'),3200);}
function updateDashboardStats(){const el=document.getElementById('total-employees-count');if(el)el.innerText=allEmployees.length;}

function getFirebaseSchema(){
    const keys=new Set();
    allEmployees.forEach(emp=>Object.keys(emp||{}).filter(k=>!k.startsWith('_')).forEach(k=>keys.add(k)));
    if(!keys.size) ['code','name','department','jobTitle','directManager','hireDate','yearsService','qualification','qualAuth','dob','age','insuranceStatus','pob','photoUrl','email'].forEach(k=>keys.add(k));
    const codeKey=allEmployees.length ? existingKey(allEmployees[0], ['الكود','code','employeeCode','empCode'], 'code') : 'code';
    keys.delete(codeKey); keys.delete('code'); keys.delete('الكود'); keys.delete('employeeCode'); keys.delete('empCode');
    const businessOrder=['اسم الموظف ','emp_name _en','الإدارة ','department ','الوظيفة','job title ','المدير المباشر ','direct manager ','تاريخ التعيين ','date_of_hiring ','سنوات الخدمة ','years of service','المؤهل','qualification','جهة المؤهل ','qulification issuing authority','تاريخ الميلاد','dob','السن حتى تاريخه ','age to date','الحالة التأمينية ','insurance status ','مكان الميلاد','pob','phone','address','governorate','الرقم التأمينى','insurance number','الأجر الشامل','comprehensiveSalary','أجر الاشتراك التأميني','insuranceContributionWage','رصيد الاجازات ','annual leave balance'];
    const priority = new Map(businessOrder.map((k,i)=>[k,i]));
    return [codeKey,...Array.from(keys).sort((a,b)=>(priority.get(a)??999)-(priority.get(b)??999)||a.localeCompare(b,'ar'))];
}
function openAddEmployeeModal(){document.getElementById('add-employee-modal')?.classList.remove('hidden');buildAddEmployeeForm();fahdCreateTab('personal',document.querySelector('.fahd-create-tabs button'));}
function closeAddEmployeeModal(){document.getElementById('add-employee-modal')?.classList.add('hidden');}
function fahdCreateTab(tab,button){document.querySelectorAll('.fahd-create-pane').forEach(el=>el.hidden=el.id!=='fahd-create-'+tab);document.querySelectorAll('.fahd-create-tabs button').forEach(el=>el.classList.toggle('selected',el===button));}
function fahdParseBirthDate(raw){
 if(!raw)return null;const t=String(raw).trim();let d;
 if(/^\d{4}-\d{2}-\d{2}$/.test(t)){const [y,m,day]=t.split('-').map(Number);d=new Date(y,m-1,day);if(d.getFullYear()!==y||d.getMonth()!==m-1||d.getDate()!==day)return null;}
 else if(/^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/.test(t)){const [day,m,y]=t.split(/[\/-]/).map(Number);d=new Date(y,m-1,day);if(d.getFullYear()!==y||d.getMonth()!==m-1||d.getDate()!==day)return null;}
 else return null;
 return d>new Date()?null:d;
}
function fahdAge(raw){const dob=fahdParseBirthDate(raw);if(!dob)return '';const now=new Date();let age=now.getFullYear()-dob.getFullYear();if(now.getMonth()<dob.getMonth()||(now.getMonth()===dob.getMonth()&&now.getDate()<dob.getDate()))age--;return String(age);}
/* v11: bilingual employee creation uses explicit Firebase schema pairs. */
const FAHD_PAIRS=[
 ['name','الاسم','Name','اسم الموظف ','emp_name _en'],
 ['department','الإدارة','Department','الإدارة ','department '],
 ['jobTitle','الوظيفة','Job title','الوظيفة','job title '],
 ['directManager','المدير المباشر','Direct manager','المدير المباشر ','direct manager '],
 ['qualification','المؤهل','Qualification','المؤهل','qualification'],
 ['qualificationAuthority','جهة المؤهل','Qualification authority','جهة المؤهل ','qulification issuing authority'],
 ['insuranceStatus','الحالة التأمينية','Insurance status','الحالة التأمينية ','insurance status '],
 ['pob','مكان الميلاد','Birthplace','مكان الميلاد','pob']
];
const FAHD_COMMON=[
 ['hireDate','تاريخ التعيين','Hire date','تاريخ التعيين ','date_of_hiring ','date'],
 ['dob','تاريخ الميلاد','Date of birth','تاريخ الميلاد','dob','date'],
 ['qualificationDate','تاريخ المؤهل','Qualification date','تاريخ الحصول على المؤهل ','qualification date ','text'],
 ['phone','الهاتف','Phone','phone','phone','tel'],
 ['address','العنوان','Address','العنوان ','address','text'],
 ['governorate','المحافظة','Governorate','المحافظة ','governorate','text']
];
function fahdLang(ar,en){return currentLang==='ar'?ar:en;}
function fahdISO(value){const d=fahdParseBirthDate(value);if(!d)return '';return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
function fahdStoredDate(iso){if(!iso)return '';const [y,m,d]=iso.split('-');return Number(d)+'/'+Number(m)+'/'+y;}
function fahdInput(label,key,value='',type='text',extra={}){
 const wrap=document.createElement('div');wrap.className='fahd-entry';const lab=document.createElement('label');lab.textContent=label;wrap.append(lab);
 const input=document.createElement('input');input.type=type;input.value=type==='date'?fahdISO(value):String(value??'');input.dataset.addKey=key;input.maxLength=1000;
 if(extra.readonly){input.readOnly=true;input.dataset.computedAge='true';delete input.dataset.addKey;}
 if(extra.required)input.required=true;
 if(extra.onchange)input.addEventListener('change',extra.onchange);
 wrap.append(input);return wrap;
}
function fahdAddSection(title,subtitle){const section=document.createElement('section');section.className='fahd-add-section';const heading=document.createElement('h3');heading.textContent=title;section.append(heading);if(subtitle){const small=document.createElement('p');small.textContent=subtitle;section.append(small);}const grid=document.createElement('div');grid.className='fahd-add-grid';section.append(grid);document.getElementById('add-employee-fields').append(section);return grid;}
function buildAddEmployeeForm(){
 const container=document.getElementById('add-employee-fields');if(!container)return;container.replaceChildren();
 const base=fahdAddSection(fahdLang('البيانات الأساسية','Core identity'),fahdLang('كود الموظف والبيانات باللغتين','Employee code and both languages'));
 base.append(fahdInput(fahdLang('الكود','Employee code'),'code','', 'text',{required:true}));
 for(const [id,ar,en,arKey,enKey] of FAHD_PAIRS){base.append(fahdInput(ar+' (AR)',arKey));base.append(fahdInput(en+' (EN)',enKey));}
 const details=fahdAddSection(fahdLang('البيانات الوظيفية والشخصية','Job & personal details'),fahdLang('التواريخ والعمر المحسوب','Dates and calculated age'));
 for(const [id,ar,en,arKey,enKey,type] of FAHD_COMMON){
  if(arKey===enKey)details.append(fahdInput(fahdLang(ar,en),arKey,'',type,type==='date'?{onchange:fahdUpdateNewAge}:{}));
  else if(type==='date'){
   const dateInput=fahdInput(fahdLang(ar,en),arKey,'','date',{onchange:fahdUpdateNewAge});dateInput.querySelector('input').dataset.mirrorKey=enKey;details.append(dateInput);
  }else{details.append(fahdInput(ar+' (AR)',arKey));details.append(fahdInput(en+' (EN)',enKey));}
 }
 details.append(fahdInput(fahdLang('العمر — تلقائي','Age — calculated'),'','', 'text',{readonly:true}));
 const extra=fahdAddSection(fahdLang('بيانات إضافية','Additional fields'),fahdLang('بيانات اختيارية','Optional information'));
 extra.insertAdjacentHTML('beforeend','<div class="fahd-entry"><label>'+fahdLang('صورة الموظف','Employee photo')+'</label><img id="fahd-create-photo-preview" class="fahd-photo" alt=""><button type="button" class="fahd-photo-button" onclick="fahdPickPhoto(true)">'+fahdLang('اختيار صورة من الملفات','Choose photo file')+'</button></div><div id="fahd-new-custom"></div><button type="button" class="fahd-photo-button" onclick="fahdNewExtraField()">'+fahdLang('إضافة حقل مخصص','Add custom field')+'</button>');
 const err=document.getElementById('add-employee-error');if(err)err.textContent='';fahdUpdateNewAge();fahdEnableDropdowns();fahdTranslateUI();
}
function fahdUpdateNewAge(){const birth=document.querySelector('#add-employee-fields [data-add-key="تاريخ الميلاد"]');const age=fahdAge(birth?.value);document.querySelectorAll('#add-employee-fields [data-computed-age]').forEach(el=>el.value=age?age+' '+fahdLang('سنة','years'):'—');}
async function saveNewEmployee(){
 const data={};document.querySelectorAll('#add-employee-fields [data-add-key]').forEach(input=>{
  const key=input.dataset.addKey;let value=input.value.trim();if(input.type==='date')value=fahdStoredDate(value);
  if(value){data[key]=value;if(input.dataset.mirrorKey)data[input.dataset.mirrorKey]=value;}
 });
 const code=String(data.code||'').trim(),err=document.getElementById('add-employee-error');
 if(!/^\d{1,12}$/.test(code)){err.textContent=fahdLang('أدخل كود موظف رقمي صحيح','Enter a valid numeric employee code');return;}
 if(allEmployees.some(e=>String(getEmployeeCode(e))===code)){err.textContent=tr('employee_exists');return;}
 if(!data['اسم الموظف ']||!data['emp_name _en']){err.textContent=fahdLang('أدخل الاسم بالعربي والإنجليزي','Enter both Arabic and English names');return;}
 const age=fahdAge(data['تاريخ الميلاد']);if(age){data['السن حتى تاريخه ']=age;data['age to date']=age;}
 data['الكود']=code;if(window.fahdNewPhoto)data.photoUrl=window.fahdNewPhoto;
 document.querySelectorAll('#fahd-new-custom .fahd-entry').forEach(card=>{const key=card.querySelector('[data-custom-name]')?.value.trim(),ar=card.querySelector('[data-custom-ar]')?.value.trim(),en=card.querySelector('[data-custom-en]')?.value.trim();if(/^[A-Za-z][A-Za-z0-9_]{1,49}$/.test(key)&&!['password','role','permissions','authUid'].includes(key)&&!Object.hasOwn(data,key)){data.hr_custom_fields??={};data.hr_custom_fields[key]={labelAr:key,labelEn:key,valueAr:ar||'',valueEn:en||''};}});
 const saveButton=document.querySelector('#add-employee-modal [data-save-new]');if(saveButton)saveButton.disabled=true;
 try{const ref=db.ref(PORTAL_EMPLOYEE_COLLECTION+'/'+code);const snapshot=await ref.once('value');if(snapshot.exists()){err.textContent=tr('employee_exists');return;}
  await ref.set(data);allEmployees.push({...data,_firebasePath:PORTAL_EMPLOYEE_COLLECTION+'/'+code,_firebaseKey:code});closeAddEmployeeModal();window.fahdNewPhoto=null;renderTable(allEmployees);updateDashboardStats();showToast(tr('employee_saved'));
 }catch(error){err.textContent=(error?.message||tr('login_error'));}finally{if(saveButton)saveButton.disabled=false;}
}

function openAddCustomFieldModal(){if(activeEmployeeCode===null){showToast(currentLang==='ar'?'افتح ملف موظف أولاً':'Open an employee profile first',true);return;}document.getElementById('custom-field-modal')?.classList.remove('hidden');document.getElementById('custom-field-name').value='';document.getElementById('custom-field-value').value='';document.getElementById('custom-field-error').innerText='';}
function closeAddCustomFieldModal(){document.getElementById('custom-field-modal')?.classList.add('hidden');}
const HR_FIELD_LABELS={address:['العنوان','Address'],governorate:['المحافظة','Governorate'],phone:['رقم الهاتف','Phone'],emergency_contact:['رقم الطوارئ','Emergency contact'],national_id:['الرقم القومي','National ID']};
const HR_PROTECTED_KEYS=new Set(['password','pass','photoUrl','photo','code','_firebasePath','_firebaseKey','employeeCode','id','role','permissions']);
function getHRCustomKeys(){try{return JSON.parse(localStorage.getItem("lacto_custom_keys")||"[]")}catch{return []}}
function renderExtraEmployeeFields(){
 const box=document.getElementById('hr-custom-fields');if(!box)return;
 const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(activeEmployeeCode));if(!emp){box.innerHTML='';return;}
 const keys=Object.keys(emp).filter(k=>(Object.prototype.hasOwnProperty.call(HR_FIELD_LABELS,k)||Boolean(emp.hr_custom_fields?.[k])) && emp[k]!==undefined && emp[k]!==null && String(emp[k]).trim()!=='');
 box.innerHTML=`<h3 class="text-sky-300 font-bold mb-3">${currentLang==='ar'?'بيانات إضافية':'Additional details'}</h3>`+(keys.length?`<div class="grid grid-cols-1 md:grid-cols-2 gap-3">${keys.map(k=>`<div class="hr-custom-field"><p class="text-xs text-slate-400">${escapeHtml((HR_FIELD_LABELS[k]||[k.replace(/_/g," "),k.replace(/_/g," ")])[currentLang==='ar'?0:1])}</p><p class="text-sm text-slate-100 mt-1">${escapeHtml(String(emp[k]))}</p></div>`).join('')}</div>`:`<p class="text-sm text-slate-400">${currentLang==='ar'?'لا توجد بيانات إضافية بعد':'No additional fields yet'}</p>`);
}
async function saveCustomField(){
 const key=document.getElementById('custom-field-name').value.trim();
 const value=document.getElementById('custom-field-value').value.trim();
 const err=document.getElementById('custom-field-error');
 const normalized=key.toLowerCase();
 if(!/^[a-z][a-z0-9_]{1,49}$/.test(key)||HR_PROTECTED_KEYS.has(key)||normalized.includes('password')){err.textContent=currentLang==='ar'?'استخدم مفتاح إنجليزي آمن مثل address أو governorate':'Use a safe English key such as address or governorate';return;}
 if(!value){err.textContent=currentLang==='ar'?'أدخل القيمة':'Enter a value';return;}
 const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(activeEmployeeCode));
 if(!emp||!emp._firebasePath){err.textContent=currentLang==='ar'?'تعذر تحديد سجل الموظف':'Employee record path not found';return;}
 if(Object.prototype.hasOwnProperty.call(emp,key)&&!Object.prototype.hasOwnProperty.call(HR_FIELD_LABELS,key)) {err.textContent=currentLang==='ar'?'الحقل موجود بالفعل؛ لا يمكن استبداله من هنا':'Existing field cannot be overwritten here';return;}
 try{
   await db.ref(emp._firebasePath).update({[key]:value,[`hr_custom_fields/${key}`]:true});
   emp[key]=value;emp.hr_custom_fields={...(emp.hr_custom_fields||{}),[key]:true};
   if(!HR_FIELD_LABELS[key]){const keys=getHRCustomKeys();if(!keys.includes(key)){keys.push(key);localStorage.setItem("lacto_custom_keys",JSON.stringify(keys));}}
   if(!HR_FIELD_LABELS[key])HR_FIELD_LABELS[key]=[key.replace(/_/g,' '),key.replace(/_/g,' ')];
   closeAddCustomFieldModal();renderExtraEmployeeFields();showToast(tr('custom_field_saved'));
 }catch(error){console.error('Field save failed',error);err.textContent=tr('login_error');}
}

async function sendPasswordVerificationCode() {
    const code = document.getElementById('forgot-emp-code')?.value.trim();
    const msg = document.getElementById('forgot-message');
    if (code !== PORTAL_ADMIN_CODE) { if(msg) msg.textContent = currentLang === 'ar' ? 'هذه النسخة مخصصة لكود الإدارة 778.' : 'This build is for admin code 778.'; return; }
    try {
        await portalAuth.sendPasswordResetEmail(PORTAL_ADMIN_EMAIL);
        if(msg) { msg.style.color = '#67e8f9'; msg.textContent = currentLang === 'ar' ? 'تم طلب إرسال رابط إعادة تعيين كلمة المرور إلى بريد حساب الإدارة.' : 'A password reset link was requested for the admin email.'; }
    } catch (e) { console.error(e); if(msg) msg.textContent = tr('login_error'); }
}
function verifyAndResetPassword() { /* Legacy database password reset intentionally disabled. */ }
function openForgotPassModal() {
    document.getElementById('forgot-pass-modal')?.classList.remove('hidden');
    document.getElementById('forgot-emp-code').value = document.getElementById('login-emp-code')?.value || '';
    document.getElementById('forgot-message').innerText = '';
}
function closeForgotPassModal() { document.getElementById('forgot-pass-modal')?.classList.add('hidden'); }

function runPortalIntro(){
    const intro=document.getElementById('intro-screen');const container=document.getElementById('introTitle');const subtitle=document.getElementById('introSubtitle');
    if(!intro||!container||!window.gsap){ intro?.classList.add("fade-out"); revealLoginAfterIntro(); return; }
    container.innerHTML='';const chars=[];const text='LACTO MISR S.A.E';
    for(const ch of text){if(ch===' '){const sp=document.createElement('span');sp.className='intro-space';container.appendChild(sp);}else{const el=document.createElement('span');el.className='intro-char';el.innerText=ch;container.appendChild(el);chars.push(el);}}
    chars.forEach(el=>gsap.set(el,{y:-250,x:(Math.random()-.5)*400,rotation:(Math.random()-.5)*720,opacity:0,scale:.8}));
    gsap.set(subtitle,{opacity:0,y:20});gsap.set('#introFooter',{opacity:0,bottom:'-20vh'});
    const dirs=[{x:-900,y:-700},{x:0,y:-900},{x:900,y:-700},{x:900,y:0},{x:900,y:700},{x:0,y:900},{x:-900,y:700},{x:-900,y:0}];
    const tl=gsap.timeline({onComplete:()=>{intro.classList.add('fade-out');setTimeout(revealLoginAfterIntro,500);}});
    tl.to(chars,{duration:2.5,x:0,y:0,rotation:360,opacity:1,scale:1,stagger:.1,ease:'power2.out'},'start');
    tl.to(subtitle,{duration:1.5,opacity:1,y:0,ease:'power2.out'},'start+=1');
    tl.to('#introFooter',{duration:1.5,bottom:'12%',opacity:1,ease:'power2.out'},'start+=1.5');
    tl.to([subtitle,'#introFooter'],{duration:1.2,opacity:0,y:20,ease:'power1.in'},'start+=6');
    chars.forEach((el,index)=>tl.to(el,{duration:1.6,x:dirs[index%dirs.length].x,y:dirs[index%dirs.length].y,opacity:0,scale:.5,ease:'power1.inOut'},'start+=7'));
}
function revealLoginAfterIntro(){
    const brand=document.getElementById('login-brand');const panel=document.getElementById('login-panel');
    if(brand){brand.classList.add('intro-ready');setTimeout(()=>brand.classList.add('compact'),1050);}
    if(panel){setTimeout(()=>panel.classList.add('visible','compact-mode'),2250);}
}

function prepareRememberedLogin(){
    localStorage.removeItem('lacto_saved_pass');
    const code = localStorage.getItem('lacto_saved_code');
    if (code === PORTAL_ADMIN_CODE) {
        document.getElementById('login-emp-code').value = code;
        document.getElementById('remember-me').checked = true;
    }
}

window.addEventListener('click',(e)=>{
    if(!e.target.closest('#login-lang-switcher')) document.getElementById('login-lang-menu')?.classList.remove('show');
    if(!e.target.closest('#lang-dropdown') && !e.target.closest('button[onclick*="toggleLangDropdown"]')) document.getElementById('lang-dropdown')?.classList.remove('show');
});

window.addEventListener('DOMContentLoaded',async()=>{
    setLanguage(currentLang);
    prepareRememberedLogin();
    try { runPortalIntro(); } catch (err) { console.error("Intro error", err); document.getElementById("intro-screen")?.classList.add("fade-out"); revealLoginAfterIntro(); }
});


// HR workspace: presentation-only demo data until ESS integration is configured.
let hrActivePage='dashboard';
const hrText=(ar,en)=>currentLang==='ar'?ar:en;
function showHRPage(page){
    if(page!=='employees' && fahdHasUnsavedChanges()&&!window.fahdNavigationApproved){fahdGuardNavigation(()=>showHRPage(page));return;}

    if(!['dashboard','employees','payroll','notifications','attendance','leave-balances','permissions','bradford'].includes(page))return;
    hrActivePage=page;
    ['dashboard','payroll','notifications','attendance','leave-balances','permissions','bradford'].forEach(p=>document.getElementById('hr-'+p+'-view')?.classList.toggle('hidden',p!==page));
    const list=document.getElementById('employees-list-view'),profile=document.getElementById('employee-profile-view');
    if(page==='employees'){if(activeEmployeeCode!==null){if(profile){profile.classList.remove('hidden');profile.style.display='block';}if(list){list.classList.add('hidden');list.style.display='none';}}else{if(list){list.classList.remove('hidden');list.style.display='block';}if(profile){profile.classList.add('hidden');profile.style.display='none';}}}
    else {if(list){list.classList.add('hidden');list.style.display='none';}if(profile){profile.classList.add('hidden');profile.style.display='none';}}
    document.querySelectorAll('.hr-nav').forEach(el=>el.classList.toggle('active',el.dataset.page===page));
    renderHRWorkspace();
}
function hrCard(label,value,foot=''){return `<div class="hr-kpi"><p class="text-xs text-slate-400">${escapeHtml(label)}</p><div class="text-3xl text-sky-300 font-bold mt-2">${escapeHtml(value)}</div><p class="text-xs text-slate-500 mt-2">${escapeHtml(foot)}</p></div>`}
function renderHRWorkspace(){
    document.querySelectorAll('.hr-nav [data-ar]').forEach(el=>{el.textContent=el.dataset[currentLang]});
    if(hrActivePage==='dashboard'){renderRichDashboard();}
    if(['attendance','leave-balances','permissions','bradford'].includes(hrActivePage)) renderHRFeature(hrActivePage);
    if(hrActivePage==='payroll'){
        const d=document.getElementById('hr-payroll-view');if(!d)return;
        const demo=allEmployees.slice(0,30).map((e,i)=>{const base=5500+(i%9)*850,allowance=500+(i%4)*250,deduction=(i%3)*175;return {e,base,allowance,deduction,net:base+allowance-deduction}});
        d.innerHTML=`<h1 class="text-2xl font-extrabold mb-2">${hrText('المرتبات','Payroll')}</h1><p class="text-amber-300 text-sm mb-5">${hrText('بيانات تجريبية فقط — غير مرتبطة برواتب الموظفين الفعلية','DEMO ONLY — not actual employee salaries')}</p><div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">${hrCard(hrText('عدد السجلات التجريبية','Demo records'),String(demo.length))}${hrCard(hrText('إجمالي الأساسي التجريبي','Demo basic total'),demo.reduce((s,r)=>s+r.base,0).toLocaleString()+' EGP')}${hrCard(hrText('إجمالي الصافي التجريبي','Demo net total'),demo.reduce((s,r)=>s+r.net,0).toLocaleString()+' EGP')}</div><div class="glass-card rounded-2xl overflow-x-auto"><table class="w-full text-sm text-start"><thead class="bg-slate-900/70 text-sky-300"><tr>${[hrText('الموظف','Employee'),hrText('الأساسي','Basic'),hrText('البدلات','Allowances'),hrText('الخصومات','Deductions'),hrText('الصافي','Net')].map(x=>`<th class="p-4 text-start">${x}</th>`).join('')}</tr></thead><tbody>${demo.map(r=>`<tr class="border-t border-slate-700/50"><td class="p-3">${escapeHtml(getEmployeeName(r.e))}</td><td class="p-3">${r.base.toLocaleString()}</td><td class="p-3">${r.allowance.toLocaleString()}</td><td class="p-3">${r.deduction.toLocaleString()}</td><td class="p-3 text-sky-300">${r.net.toLocaleString()}</td></tr>`).join('')}</tbody></table></div>`;
    }
    if(hrActivePage==='notifications'){
        const d=document.getElementById('hr-notifications-view');if(!d)return;
        d.innerHTML=`<h1 class="text-2xl font-extrabold mb-5">${hrText('الإشعارات والطلبات','Notifications & Requests')}</h1><div class="glass-card rounded-2xl p-6 mb-5"><h2 class="font-bold text-sky-300 mb-3">${hrText('طلبات ESS المعلقة','Pending ESS requests')}</h2><div id="ess-request-panel" class="text-slate-300 text-sm">${hrText('جاري فحص اتصال ESS...','Checking ESS connection...')}</div></div><div class="glass-card rounded-2xl p-6"><h2 class="font-bold text-sky-300 mb-3">${hrText('إنشاء إشعار إداري','Compose HR notification')}</h2><label class="block text-sm mb-1">${hrText('العنوان','Title')}</label><input id="hr-notify-title" maxlength="120" class="w-full p-3 rounded-xl bg-slate-900 border border-sky-500/30 mb-3" placeholder="${hrText('عنوان الإشعار','Notification title')}"><label class="block text-sm mb-1">${hrText('الرسالة','Message')}</label><textarea id="hr-notify-body" maxlength="1000" class="w-full p-3 rounded-xl bg-slate-900 border border-sky-500/30 mb-3" placeholder="${hrText('نص الرسالة','Message body')}"></textarea><label class="block text-sm mb-1">${hrText('إرسال إلى','Audience')}</label><select id="hr-notify-target" onchange="hrNotificationAudienceChanged()" class="w-full p-3 rounded-xl bg-slate-900 border border-sky-500/30 mb-3"><option value="all">${hrText('الشركة بالكامل','Entire company')}</option><option value="department">${hrText('إدارة كاملة','Department')}</option><option value="employees">${hrText('موظفون محددون','Selected employees')}</option></select><div id="hr-notify-target-fields" class="mb-3"></div><label class="flex items-center gap-3 mb-4 text-sm"><input id="hr-notify-ack" type="checkbox" class="w-5 h-5 accent-sky-500">${hrText('هذا الإشعار يتطلب إقرار الموظف بالاطلاع','Employee acknowledgement required')}</label><button type="button" onclick="hrPreviewNotification()" class="portal-action-btn px-5 py-3 rounded-xl">${hrText('معاينة المستلمين','Preview recipients')}</button> <button type="button" id="hr-notify-send" onclick="hrSendNotification()" class="portal-action-btn px-5 py-3 rounded-xl ml-2" style="background:#0878ad">${hrText('إرسال الإشعار','Send notification')}</button><div id="hr-notify-preview" class="mt-4 text-sm text-slate-300" aria-live="polite"></div><p class="text-xs text-amber-300 mt-3">${hrText('إرسال داخلي مجاني على Spark للكودين 2 و102 فقط، دون Push في الخلفية. يلزم تسجيل دخول إدارة ESS.','Free Spark internal delivery for codes 2 and 102 only; no background push. ESS admin sign-in required.')}</p></div>`;
        hrNotificationAudienceChanged();
        setTimeout(essRenderRequestPanel,0);
    }
}
document.addEventListener('DOMContentLoaded',()=>showHRPage('dashboard'));


// Dashboard uses employee records only. Geographic dots are schematic, not official boundaries.
const hrGovernorates=[
 ['Cairo','القاهرة',30.044,31.236],['Giza','الجيزة',30.01,31.12],['Alexandria','الإسكندرية',31.20,29.92],['Qalyubia','القليوبية',30.33,31.22],['Sharqia','الشرقية',30.59,31.50],['Dakahlia','الدقهلية',31.05,31.38],['Gharbia','الغربية',30.87,31.03],['Monufia','المنوفية',30.60,30.98],['Beheira','البحيرة',30.85,30.34],['Kafr El Sheikh','كفر الشيخ',31.11,30.94],['Damietta','دمياط',31.42,31.81],['Port Said','بورسعيد',31.26,32.29],['Ismailia','الإسماعيلية',30.60,32.27],['Suez','السويس',29.97,32.55],['North Sinai','شمال سيناء',30.56,33.80],['South Sinai','جنوب سيناء',28.25,33.80],['Fayoum','الفيوم',29.31,30.84],['Beni Suef','بني سويف',29.07,31.10],['Minya','المنيا',28.10,30.75],['Assiut','أسيوط',27.18,31.18],['Sohag','سوهاج',26.56,31.69],['Qena','قنا',26.16,32.72],['Luxor','الأقصر',25.69,32.64],['Aswan','أسوان',24.09,32.90],['Red Sea','البحر الأحمر',26.75,33.94],['New Valley','الوادي الجديد',25.44,30.55],['Matrouh','مطروح',31.35,27.23]
];
function hrNormalize(s){return String(s||'').trim().toLowerCase().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[\u064b-\u065f]/g,'').replace(/[_-]/g,' ').replace(/\s+/g,' ')}
function hrGovIndex(value){const s=hrNormalize(value);if(!s)return -1;const aliases={'sharkia':4,'sharqia':4,'ash sharqiyah':4,'el sharkia':4,'qalyubiya':3,'qalubia':3,'kalyoubia':3,'dakahlieh':5,'dakahlia':5,'menoufia':7,'monufia':7,'menofia':7,'beheira':8,'behira':8,'kafr el sheikh':9,'kafr elsheikh':9,'bani suef':17,'assiout':19,'asiyut':19,'red sea':24,'el minya':18,'minia':18,'الشرقيه':4};if(Object.prototype.hasOwnProperty.call(aliases,s))return aliases[s];return hrGovernorates.findIndex(([en,ar])=>s===hrNormalize(en)||s===hrNormalize(ar)||s.includes(hrNormalize(ar))||s.includes(hrNormalize(en)))}
function hrGeoField(emp){const direct=getField(emp,'المحافظة ','المحافظة','محافظة','محافظة السكن','محافظة الإقامة','governorate ','governorate','Governorate','governorate_name','province');if(direct)return direct;return getField(emp,'محل الإقامة','العنوان ','العنوان','address','residence','city')}
function hrPercent(a,b){return b?Math.round(a/b*100):0}
function hrSvgIcon(kind,extra=''){const paths={users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 6a3 3 0 0 1 0 6M19 15a5 5 0 0 1 2 4"/>',building:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h2m3 0h2M9 11h2m3 0h2M10 21v-5h4v5"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a20 20 0 0 0 18 0"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'};return `<svg class="${extra||'hr-stat-icon'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[kind]||paths.users}</svg>`} 
let hrStatIconCounter=0;
function hrStat(label,value,foot){const icon=['users','building','briefcase','clock','calendar','map'][(hrStatIconCounter++)%6];return `<div class="hr-panel">${hrSvgIcon(icon)}<div class="hr-stat-label">${escapeHtml(label)}</div><div class="hr-stat-value">${escapeHtml(String(value))}</div><div class="text-xs text-slate-500 mt-2">${escapeHtml(foot||'')}</div></div>`}
function hrPanel(title,content){return `<section class="hr-panel"><h2 class="font-bold text-sky-200 mb-5">${escapeHtml(title)}</h2>${content}</section>`}
function hrBars(rows,total,maxItems=9){const top=rows.slice(0,maxItems);return top.map(([name,count])=>`<div class="mb-3"><div class="flex justify-between gap-3 text-xs mb-1"><span class="truncate">${escapeHtml(name)}</span><span class="text-sky-300">${count} · ${hrPercent(count,total)}%</span></div><div class="hr-mini-track"><div class="hr-mini-fill" style="width:${hrPercent(count,total)}%"></div></div></div>`).join('')||`<p class="text-slate-400 text-sm">${hrText('لا توجد بيانات متاحة','No available data')}</p>`}
function hrToggleEgypt(open){const stage=document.getElementById('hr-map-stage');if(stage)stage.classList.toggle('is-zoomed',!!open)}
function hrDonut(rows,total){const palette=['#38bdf8','#a78bfa','#34d399','#fbbf24','#fb7185','#22d3ee'];let offset=0;const top=rows.slice(0,5);const segments=top.map(([name,n],i)=>{const p=total?n/total*100:0;const a=offset;offset+=p;return `${palette[i]} ${a}% ${offset}%`});if(offset<100)segments.push(`#243650 ${offset}% 100%`);return `<div class="hr-donut-layout"><div class="hr-donut" style="background:conic-gradient(${segments.join(',')||'#243650 0 100%'})"><div><b>${total}</b><small>${hrText('موظف','employees')}</small></div></div><div class="hr-donut-legend">${top.map(([name,n],i)=>`<div><i style="background:${palette[i]}"></i><span>${escapeHtml(name)}</span><b>${n}</b></div>`).join('')}</div></div>`}
function hrHorizontalBars(rows,total,limit=8){const max=Math.max(1,...rows.map(r=>r[1]));return rows.slice(0,limit).map(([name,n],i)=>`<div class="hr-hbar-row"><span title="${escapeHtml(name)}">${escapeHtml(name)}</span><div><i style="width:${Math.max(3,n/max*100)}%;background:${['#38bdf8','#a78bfa','#34d399','#fbbf24'][i%4]}"></i></div><b>${n}</b></div>`).join('')||hrText('لا توجد بيانات','No data')}
// Geographic boundaries from Natural Earth administrative level 1, via the
// publicly licensed Egypt governorates TopoJSON example (MIT).
// No employee information is transmitted to this map data source.
const HR_EGYPT_TOPO_URL='https://gist.githubusercontent.com/mohdali/662bf79127f6e068ed6815c06f92bfb5/raw/03faa83169183c357bd07da775ffc65561a4a808/egypt.json';
let hrEgyptGeoCache=null;
function hrEgyptGeoPath(geometry,project){
 const lines=[];
 function ring(points){if(!Array.isArray(points)||!points.length)return;const xy=points.map(project);lines.push('M'+xy.map(p=>p[0].toFixed(2)+','+p[1].toFixed(2)).join('L')+'Z')}
 if(geometry.type==='Polygon')geometry.coordinates.forEach(ring);
 else if(geometry.type==='MultiPolygon')geometry.coordinates.forEach(poly=>poly.forEach(ring));
 return lines.join('');
}
function hrEgyptEnglishName(name){
 const n=hrNormalize(name);
 const aliases={
 'al qahirah':'Cairo','cairo':'Cairo','al jizah':'Giza','giza':'Giza','alexandria':'Alexandria','al iskandariyah':'Alexandria',
 'al qalyubiyah':'Qalyubia','qalyubia':'Qalyubia','ash sharqiyah':'Sharqia','sharqia':'Sharqia',
 'ad daqahliyah':'Dakahlia','dakahlia':'Dakahlia','al buhayrah':'Beheira','beheira':'Beheira',
 'al gharbiyah':'Gharbia','gharbia':'Gharbia','al minufiyah':'Monufia','monufia':'Monufia',
 'kafr ash shaykh':'Kafr El Sheikh','kafr el sheikh':'Kafr El Sheikh','dumyat':'Damietta','damietta':'Damietta',
 'bur said':'Port Said','port said':'Port Said','as suways':'Suez','suez':'Suez',
 'al ismailiyah':'Ismailia','ismailia':'Ismailia','matruh':'Matrouh','al fayyum':'Fayoum','fayoum':'Fayoum',
 'bani suwayf':'Beni Suef','beni suef':'Beni Suef','al minya':'Minya','minya':'Minya',
 'asyut':'Assiut','assiut':'Assiut','suhaj':'Sohag','sohag':'Sohag',
 'qina':'Qena','qena':'Qena','al uqsur':'Luxor','luxor':'Luxor','aswan':'Aswan',
 'al bahr al ahmar':'Red Sea','red sea':'Red Sea','al wadi al jadid':'New Valley','new valley':'New Valley',
 'shamal sina':'North Sinai','north sinai':'North Sinai','janub sina':'South Sinai','south sinai':'South Sinai'};
 return aliases[n]||name;
}
function hrShowTransport(governorate){
 const panel=document.getElementById('cc-transport-details');if(!panel)return;
 const list=new Map();let known=0;
 allEmployees.forEach(e=>{
  const geo=hrGeoField(e);if(hrGovIndex(geo)!==hrGovIndex(governorate)||hrGovIndex(geo)<0)return;
  const line=String(getField(e,'transportLine','transport_line','busLine','bus_line','routeName','transport route','خط النقل','خط السير','خط الأتوبيس','خط الاتوبيس')||'').trim();
  if(!line)return;known++;list.set(line,(list.get(line)||0)+1);
 });
 const rows=[...list].sort((a,b)=>b[1]-a[1]);
 panel.replaceChildren();const title=document.createElement('strong');title.textContent=governorate+' · '+(currentLang==='ar'?'خطوط النقل':'Transport routes');panel.append(title);
 if(!rows.length){const empty=document.createElement('p');empty.textContent=currentLang==='ar'?'لا توجد بيانات خطوط نقل لهذه المحافظة بعد':'No transport-route data for this governorate yet';panel.append(empty);return;}
 rows.forEach(([name,count])=>{const row=document.createElement('div');row.className='cc-transport-row';const a=document.createElement('span');a.textContent=name;const b=document.createElement('b');b.textContent=count+' '+(currentLang==='ar'?'موظف':'employees');row.append(a,b);panel.append(row)});
}
async function hrRenderGeographicEgypt(counts){
 const svg=document.getElementById('hr-real-egypt-map');if(!svg)return;
 const current=svg;
 try{
  if(!window.topojson?.feature)throw Error('TopoJSON unavailable');
  if(!hrEgyptGeoCache){const response=await fetch(HR_EGYPT_TOPO_URL);if(!response.ok)throw Error('Map HTTP '+response.status);hrEgyptGeoCache=await response.json()}
  if(!current.isConnected)return;
  const topo=hrEgyptGeoCache;const obj=topo.objects.governate||topo.objects.governorate||Object.values(topo.objects)[0];
  const fc=window.topojson.feature(topo,obj);const features=fc.features||[];
  if(features.length<20)throw Error('Incomplete governorate boundaries');
  const project=([lon,lat])=>[28+(lon-24.2)/(37.2-24.2)*480,20+(32.2-lat)/(32.2-21.5)*455];
  const paths=features.map((f,i)=>{
   const raw=String(f.properties?.name||f.properties?.NAME_1||f.properties?.name_en||'');
   const normalized=hrEgyptEnglishName(raw);
   const idx=hrGovIndex(normalized);const count=idx<0?0:counts[idx];
   const label=idx<0?raw:(currentLang==='ar'?hrGovernorates[idx][1]:hrGovernorates[idx][0]);
   const max=Math.max(1,...counts);const intensity=count/max;
   const fill=count?'hsl(194 95% '+(37+intensity*23)+'%)':'#18334d';
   const d=hrEgyptGeoPath(f.geometry,project);
   return `<path class="hr-egypt-region" tabindex="0" role="img" aria-label="${escapeHtml(label+': '+count)}" data-geo-name="${escapeHtml(label)}" data-geo-count="${count}" d="${d}" fill="${fill}" fill-rule="evenodd"><title>${escapeHtml(label)}: ${count}</title></path>`;
  }).join('');
  current.setAttribute('viewBox','0 0 540 500');current.innerHTML=`<defs><radialGradient id="hrEgyptWater"><stop stop-color="#102e50"/><stop offset="1" stop-color="#081729"/></radialGradient></defs><rect width="540" height="500" fill="url(#hrEgyptWater)" rx="12"/>${paths}`;
  current.querySelectorAll('.hr-egypt-region').forEach(node=>{
   const update=()=>{const t=document.getElementById('hr-geo-tooltip');if(t)t.textContent=node.dataset.geoName+' — '+node.dataset.geoCount+' '+hrText('موظف','employees');hrShowTransport(node.dataset.geoName)};
   node.addEventListener('mouseenter',update);node.addEventListener('focus',update);node.addEventListener('click',update);
  });
 }catch(err){
  if(!current.isConnected)return;
  // Honest fallback: never present schematic shapes as real governorate borders.
  current.innerHTML=`<text x="270" y="220" text-anchor="middle" fill="#7dd3fc" font-size="15">${hrText('تعذر تحميل حدود المحافظات','Could not load governorate boundaries')}</text><text x="270" y="255" text-anchor="middle" fill="#94a3b8" font-size="11">${hrText('تأكد من الاتصال بالإنترنت','Check internet connection')}</text>`;
  console.warn('Egypt geographic map:',err);
 }
}


// ESS phase 1: clearly-labelled read-only scaffolding; no invented employee balances or attendance.
function hrFeatureShell(title,subtitle,body){return `<h1 class="text-2xl font-extrabold text-sky-100 mb-2">${title}</h1><p class="text-sm text-slate-400 mb-5">${subtitle}</p>${body}`}
function hrFeatureNotice(ar,en){return `<div class="hr-panel border-amber-500/30 text-amber-200 text-sm mb-5">${hrText(ar,en)}</div>`}
function renderHRFeature(page){
 const d=document.getElementById('hr-'+page+'-view');if(!d)return;
 const pending=hrFeatureNotice('بانتظار ربط ESS الآمن ومراجعة صلاحيات الوصول. لا توجد بيانات حضور أو إجازات فعلية معروضة حاليًا.','Awaiting secure ESS integration and access review. No actual attendance or leave data is displayed yet.');
 if(page==='attendance') d.innerHTML=hrFeatureShell(hrText('الحضور والانصراف','Attendance & departure'),hrText('استيراد السجلات الفعلية من Excel / CSV','Import real attendance records from Excel / CSV'),hrImportUI('attendance'));
 if(page==='leave-balances')d.innerHTML=hrFeatureShell(hrText('أرصدة الإجازات','Leave balances'),hrText('استيراد أرصدة الإجازات الفعلية من Excel / CSV','Import actual leave balances from Excel / CSV'),hrImportUI('leave-balances'));
 if(page==='permissions')d.innerHTML=hrFeatureShell(hrText('الأذون الشخصية','Personal permissions'),hrText('طلبات الخروج المبكر والتأخير والأذون بالساعة','Early exit, late arrival and hourly permissions'),pending+`<div class="hr-panel"><table class="hr-feature-table"><thead><tr>${[hrText('الموظف','Employee'),hrText('التاريخ','Date'),hrText('المدة','Duration'),hrText('الحالة','Status')].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody><tr><td colspan="4" class="text-slate-400">${hrText('لا توجد طلبات متصلة حتى الآن','No connected requests yet')}</td></tr></tbody></table></div>`);
 if(page==='bradford')d.innerHTML=hrFeatureShell('Bradford Factor',hrText('مؤشر تكرار الغياب: B = S² × D — أداة مراجعة وليست قرارًا تأديبيًا آليًا','Absence frequency indicator: B = S² × D — a review aid, not an automated disciplinary decision'),`<div class="hr-panel mb-5"><p class="text-sm text-slate-300 mb-4">${hrText('حاسبة تجريبية: أدخل عدد فترات الغياب المنفصلة وإجمالي أيام الغياب خلال فترة موحدة (مثل آخر 52 أسبوعًا). لا تُحفظ المدخلات.','Local preview calculator: enter separate absence spells and total absent days for a consistent period (e.g. 52 weeks). Inputs are not saved.')}</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><label class="text-sm">${hrText('فترات الغياب (S)','Absence spells (S)')}<input id="bradford-spells" type="number" min="0" step="1" class="hr-feature-input mt-2" placeholder="0" oninput="calculateBradford()"></label><label class="text-sm">${hrText('إجمالي أيام الغياب (D)','Total absent days (D)')}<input id="bradford-days" type="number" min="0" step="1" class="hr-feature-input mt-2" placeholder="0" oninput="calculateBradford()"></label></div><div id="bradford-result" class="mt-5 text-sky-300 font-bold" aria-live="polite">—</div></div>`+hrFeatureNotice('Clear / Action required لا يمكن تحديدهما بمصداقية قبل اعتماد سياسة الشركة وحدود المؤشر، وتصنيف الإجازات المستثناة ومراجعة الحالات الفردية.','Clear / Action required statuses require an approved company policy, thresholds, absence exclusions and individual review.')+pending);
}
function calculateBradford(){
 const s=document.getElementById('bradford-spells'),d=document.getElementById('bradford-days'),out=document.getElementById('bradford-result');if(!s||!d||!out)return;
 if(s.value===''||d.value===''){out.textContent='—';return}
 const spells=Number(s.value),days=Number(d.value);
 if(!Number.isInteger(spells)||!Number.isInteger(days)||spells<0||days<0||(spells===0)!==(days===0)||spells>days){out.textContent=hrText('تحقق من الأرقام: عدد الفترات لا يزيد عن عدد الأيام، والصفر يجب أن يكون في الخانتين.','Check inputs: spells cannot exceed days, and zero must appear in both fields.');return}
 out.textContent=`Bradford Factor = ${spells*spells*days}  (${spells}² × ${days})`;
}

// HR import engine: staging, validation, explicit commit, separate namespace (never alters employee records).
const hrImportState={};
const hrImportColumns={
 'attendance':{code:['code','employee code','employee_code','emp code','employee id','كود الموظف','كود','رقم الموظف','رقم البصمه','رقم البصمة'],date:['date','التاريخ','تاريخ'],time:['time','الوقت','الساعة'],type:['type','movement','direction','الحركة','نوع الحركة','نوع الحركه','الحالة'],timestamp:['timestamp','datetime','date time','التاريخ والوقت','التاريخ والوقت '],source:['source','device','المصدر','الجهاز','الإداره','الإدارة']},
 'leave-balances':{code:['code','employee code','employee_code','emp code','employee id','كود الموظف','كود','رقم الموظف'],entitled:['entitled','total','allowance','الاستحقاق','المستحق','الرصيد الكلي'],used:['used','taken','المستخدم','المستهلك'],remaining:['remaining','balance','المتبقي','الرصيد المتبقي'],year:['year','السنة','العام']}
};
function hrImportUI(type){const isA=type==='attendance';return `<div class="hr-panel mb-5"><h2 class="font-bold text-sky-300 mb-2">${hrText('محرك استيراد Excel','Excel Import Engine')}</h2><p class="text-sm text-slate-300 mb-3">${isA?hrText('الأعمدة المطلوبة: كود الموظف، التاريخ والوقت (أو Timestamp). اختياري: نوع الحركة والمصدر.','Required: employee code, date and time (or timestamp). Optional: type and source.'):hrText('الأعمدة المطلوبة: كود الموظف، الاستحقاق، المستخدم، المتبقي. اختياري: السنة.','Required: employee code, entitled, used, remaining. Optional: year.')}</p><input type="file" id="hr-import-file-${type}" accept=".xlsx,.xls,.csv" class="hr-feature-input" onchange="hrReadImport('${type}',this)"><p class="text-xs text-amber-200 mt-3">${hrText('الملف يمر بمراجعة قبل الحفظ. لن تتغير سجلات الموظفين الأصلية أو أرصدة ESS تلقائيًا.','Review before saving. Original employee records and ESS balances are never modified automatically.')}</p><div id="hr-import-preview-${type}" class="mt-4 text-sm text-slate-300">${hrText('اختر ملفًا لعرض المعاينة','Choose a file to preview')}</div></div><div id="hr-import-saved-${type}" class="hr-panel text-sm text-slate-300">${hrText('تحميل آخر دفعة محفوظة...','Loading latest saved batch...')}</div>`}
function hrNorm(x){return String(x??'').trim().toLowerCase().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/[_\-]+/g,' ').replace(/\s+/g,' ')}
function hrEscape(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function hrNum(x){let n=Number(String(x??'').replace(/,/g,''));return Number.isFinite(n)?n:NaN}
function hrDate(x){if(typeof x==='number'&&window.XLSX){let d=XLSX.SSF.parse_date_code(x);return d?`${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`:String(x)}return String(x??'').trim()}
function hrImportRows(type,rows){const aliases=hrImportColumns[type], keys=Object.keys(rows[0]||{}), mapped={};for(let field in aliases){let match=keys.find(k=>aliases[field].some(a=>hrNorm(a)===hrNorm(k)));if(match)mapped[field]=match}
 const missing=(type==='attendance'?['code']:['code','entitled','used','remaining']).filter(k=>!mapped[k]);if(type==='attendance'&&!mapped.timestamp&&!(mapped.date&&mapped.time))missing.push('timestamp OR date+time');if(missing.length)throw Error('Missing columns: '+missing.join(', '));
 let result=[],errors=[];rows.forEach((r,i)=>{let rec={};for(let k in mapped)rec[k]=r[mapped[k]];rec.code=String(rec.code??'').trim();if(type==='attendance' && mapped.code && /بصم/.test(mapped.code)){rec.biometricId=rec.code;}let err='';if(!rec.code)err='Missing employee code';if(type==='attendance'&&!err&&Array.isArray(allEmployees)&&allEmployees.length&&!allEmployees.some(e=>getEmployeeCode(e)===rec.code))err='Employee code '+rec.code+' not found in Firebase employees';if(type==='attendance'){rec.timestamp=String(rec.timestamp??`${hrDate(rec.date)} ${rec.time??''}`).trim();if(!rec.timestamp||rec.timestamp==='undefined')err='Missing date/time';rec.source=String(rec.source||'Excel import');rec.type=String(rec.type||'Unspecified')}else{for(let k of ['entitled','used','remaining'])rec[k]=hrNum(rec[k]);if(['entitled','used','remaining'].some(k=>!Number.isFinite(rec[k])||rec[k]<0))err='Invalid balance';if(!err&&Math.abs(rec.entitled-rec.used-rec.remaining)>0.02)err='Balance mismatch';rec.year=String(rec.year||new Date().getFullYear())}if(err)errors.push(`Row ${i+2}: ${err}`);else result.push(rec)});return {result,errors,mapped};}
async function hrReadImport(type,input){let box=document.getElementById('hr-import-preview-'+type);if(!input.files?.[0])return;let file=input.files[0];if(file.size>5*1024*1024){box.textContent='File exceeds 5 MB';return}if(!window.XLSX){box.textContent='Excel parser unavailable. Check internet connection.';return}try{const wb=XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:false});const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''});if(!rows.length)throw Error('Sheet is empty');if(rows.length>3000)throw Error('Maximum 3000 rows per batch');const parsed=hrImportRows(type,rows);hrImportState[type]={records:parsed.result,errors:parsed.errors,filename:file.name};let sample=parsed.result.slice(0,8);box.innerHTML=`<p class="mb-2">${hrText('سجلات صحيحة','Valid rows')}: <b>${parsed.result.length}</b> · ${hrText('أخطاء','Errors')}: <b>${parsed.errors.length}</b></p>${parsed.errors.length?`<div class="text-rose-300 mb-3">${parsed.errors.slice(0,12).map(hrEscape).join('<br>')}</div>`:''}<div style="overflow-x:auto"><table class="hr-feature-table"><thead><tr>${Object.keys(sample[0]||{}).map(k=>`<th>${hrEscape(k)}</th>`).join('')}</tr></thead><tbody>${sample.map(r=>`<tr>${Object.values(r).map(v=>`<td>${hrEscape(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${parsed.result.length&&!parsed.errors.length?`<button class="portal-ghost-btn px-5 py-3 rounded-xl mt-4" onclick="hrCommitImport('${type}')">${hrText('حفظ الدفعة في Firebase بعد التأكيد','Save batch to Firebase after confirmation')}</button>`:'<p class="text-amber-200 mt-3">Fix errors before saving.</p>'}`;}catch(e){hrImportState[type]=null;box.textContent='Import error: '+e.message}}
async function hrCommitImport(type){const state=hrImportState[type];if(!state?.records.length||state.errors.length)return;const ok=confirm(hrText('تأكيد حفظ البيانات المستوردة في قاعدة البورتال؟ لن يتم تحديث ESS تلقائيًا.','Save imported data in Portal Firebase? ESS will not be updated automatically.'));if(!ok)return;const batch=db.ref('hr_imports/'+type).push();try{await batch.set({filename:state.filename,createdAt:firebase.database.ServerValue.TIMESTAMP,recordCount:state.records.length,records:state.records});alert(hrText('تم حفظ الدفعة بنجاح','Batch saved successfully'));hrLoadImport(type)}catch(e){alert('Firebase write failed: '+e.message)}}
async function hrLoadImport(type){const box=document.getElementById('hr-import-saved-'+type);if(!box)return;try{let snap=await db.ref('hr_imports/'+type).limitToLast(1).once('value'),items=snap.val();if(!items){box.textContent=hrText('لا توجد دفعات محفوظة بعد','No saved batches yet');return}let batch=Object.values(items)[0];box.innerHTML=`<b>${hrText('آخر دفعة محفوظة','Latest saved batch')}</b><p>${hrEscape(batch.filename)} — ${Number(batch.recordCount)||0} ${hrText('سجل','records')}</p><p class="text-xs text-slate-400">${new Date(batch.createdAt||Date.now()).toLocaleString()}</p>`}catch(e){box.textContent=hrText('تعذر قراءة البيانات: راجع صلاحيات Firebase','Cannot read saved data: check Firebase rules')}}

// Real-data phase: read-only batch inspection and deterministic settlement schedule.
function hrSettlementSchedule(hireDate, asOfYear=new Date().getFullYear()) {
 const m=String(hireDate||'').match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
 if(!m)return null;
 const year=Number(m[1]),month=Number(m[2]),day=Number(m[3]);
 const date=new Date(year,month-1,day);
 if(date.getFullYear()!==year||date.getMonth()!==month-1||date.getDate()!==day)return null;
 const cycle=Math.max(1,Math.floor((asOfYear-year)/3)+1);
 return {hireYear:year,firstSettlement:year+3,lastCompletedSettlement:year+3*Math.max(0,Math.floor((asOfYear-year)/3)),nextSettlement:year+3*cycle,cycleStart:year+3*(cycle-1),cycleEnd:year+3*cycle-1};
}
function hrExtraTools(type){
 if(type==='attendance')return `<div class="hr-panel mb-5"><h2 class="font-bold text-sky-300 mb-2">${hrText('مراجعة سجلات البصمة','Biometric import review')}</h2><p class="text-sm text-slate-300">${hrText('رقم البصمة يساوي كود الموظف في النظام. رقم جهاز البصمة (1–4) هو معرّف الجهاز وليس كود موظف. لا يتم حساب الغياب أو التأخير قبل اعتماد قواعد الشيفتات.','Biometric number equals the employee code. Device number (1–4) identifies the machine, not the employee. Absence and lateness require approved shift rules.')}</p><div id="hr-attendance-summary" class="mt-3 text-sm text-slate-300"></div></div>`;
 return `<div class="hr-panel mb-5"><h2 class="font-bold text-sky-300 mb-3">${hrText('معاينة دورة التسوية الثلاثية','Three-year settlement schedule preview')}</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-3"><label>${hrText('تاريخ التعيين (YYYY-MM-DD)','Hire date (YYYY-MM-DD)')}<input id="hr-settlement-hire" class="hr-feature-input mt-2" type="date" onchange="hrShowSettlement()"></label><label>${hrText('الأجر الشامل (اختياري)','Gross wage (optional)')}<input id="hr-settlement-wage" class="hr-feature-input mt-2" type="number" min="0" step="0.01" oninput="hrShowSettlement()"></label></div><p id="hr-settlement-result" class="mt-3 text-sm text-slate-200">${hrText('أدخل تاريخ التعيين لعرض دورة التسوية. هذه معاينة للمواعيد وليست اعتمادًا لرصيد أو مستحق مالي.','Enter a hire date to preview the schedule. This does not approve balances or payments.')}</p></div>`;
}
function hrShowSettlement(){
 const out=document.getElementById('hr-settlement-result');if(!out)return;
 const x=hrSettlementSchedule(document.getElementById('hr-settlement-hire')?.value);
 if(!x){out.textContent=hrText('اختر تاريخ تعيين صحيحًا','Choose a valid hire date');return}
 out.textContent=hrText(`سنوات الدورة الحالية: ${x.cycleStart}–${x.cycleEnd} | أول تسوية: يناير ${x.firstSettlement} | التسوية القادمة: يناير ${x.nextSettlement}. يتم حساب المبلغ بعد اعتماد الأيام القابلة للصرف والأجر الشامل.`,`Current cycle: ${x.cycleStart}–${x.cycleEnd} | First settlement: January ${x.firstSettlement} | Next settlement: January ${x.nextSettlement}. Payment requires approved eligible days and gross wage.`);
}
async function hrShowImportedData(type){
 const target=document.getElementById('hr-import-records-'+type);if(!target)return;
 try{
  const snap=await db.ref('hr_imports/'+type).limitToLast(1).once('value');const obj=snap.val();
  if(!obj){target.textContent=hrText('لا توجد بيانات مستوردة','No imported data');return}
  const batch=Object.values(obj)[0],records=Object.values(batch.records||{}),valid=records.filter(x=>x&&typeof x==='object');
  const cols=type==='attendance'?['code','timestamp','type','source']:['code','year','entitled','used','remaining'];
  target.innerHTML=`<p class="mb-3">${hrText('سجلات آخر دفعة','Latest batch records')}: ${valid.length} — ${hrEscape(batch.filename||'')}</p><div style="overflow:auto;max-height:360px"><table class="hr-feature-table"><thead><tr>${cols.map(c=>`<th>${hrEscape(c)}</th>`).join('')}</tr></thead><tbody>${valid.slice(0,100).map(r=>`<tr>${cols.map(c=>`<td>${hrEscape(r[c]??'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="text-xs text-slate-400 mt-2">${hrText('عرض أول 100 سجل فقط. القيم المعروضة بيانات مصدر وليست نتائج حسابية معتمدة.','Showing first 100 records. Source data, not approved calculations.')}</p>`;
 }catch(e){target.textContent=hrText('تعذر قراءة الدفعة: راجع صلاحيات Firebase','Cannot read batch: check Firebase permissions')}
}
const _hrFeatureOriginal=renderHRFeature;
renderHRFeature=function(page){_hrFeatureOriginal(page);if(['attendance','leave-balances'].includes(page)){const container=document.getElementById('hr-'+page+'-view');if(container){container.insertAdjacentHTML('beforeend',hrExtraTools(page)+`<div class="hr-panel mt-5"><h2 class="font-bold text-sky-300 mb-3">${hrText('البيانات المستوردة فعليًا','Actual imported records')}</h2><button class="portal-ghost-btn px-4 py-2 rounded-xl mb-3" onclick="hrShowImportedData('${page}')">${hrText('عرض آخر دفعة','View latest batch')}</button><div id="hr-import-records-${page}"></div></div>`)}hrLoadImport(page)}};


// ESS cross-project read-only integration. Credentials are never stored in source.
const ESS_ADMIN_UID = 'wNAq91LfdQcrcQCfSSWsJpNtFP82';
const ESS_ADMIN_EMAIL = 'mostafa.el-sayed@lactomisr.com';
const essFirebaseConfig = {
  apiKey: 'AIzaSyBObCeo4PM20UNYObThwdY4UaOiIhWdXa0',
  authDomain: 'lacto-hr-system.firebaseapp.com',
  databaseURL: 'https://lacto-hr-system-default-rtdb.firebaseio.com',
  projectId: 'lacto-hr-system',
  storageBucket: 'lacto-hr-system.firebasestorage.app',
  messagingSenderId: '671259800401',
  appId: '1:671259800401:web:905e1a36adba52ba2d1970'
};
const essApp = firebase.apps.find(app=>app.name==='ESS_ADMIN') || firebase.initializeApp(essFirebaseConfig,'ESS_ADMIN');
const essAuth = essApp.auth();
const essDb = essApp.database();
const essPaths = [
 ['permission_requests','أذونات','Permissions'],['leave_requests','إجازات','Leaves'],
 ['loan_requests','سلف','Loans'],['mission_requests','مأموريات','Missions'],
 ['suggestions_and_complaints','شكاوى ومقترحات','Feedback'],
 ['attendance_requests','طلبات حضور','Attendance requests']
];
let essRequestUnsubscribers=[];
let essRequestState={};
let essRequestErrors={};
function essEscape(v){return escapeHtml(String(v??''));}
function essStopListeners(){essRequestUnsubscribers.forEach(f=>f());essRequestUnsubscribers=[];}
function essRenderRequestPanel(){
 const panel=document.getElementById('ess-request-panel');if(!panel)return;
 if(!portalIsAdmin()) {essStopListeners();panel.textContent=hrText('هذه الصفحة متاحة للإدارة فقط','Admin only');return;}
 const u=essAuth.currentUser;
 if(!u||u.uid!==ESS_ADMIN_UID){
  essStopListeners();
  panel.innerHTML=`<p class="mb-3">${hrText('لرؤية طلبات ESS سجّل الدخول مرة واحدة بالحساب الإداري المنفصل. لن تتغير جلسة البورتال.','Sign in to the separate ESS admin account to view requests. Your Portal session stays active.')}</p><form id="ess-admin-form" class="flex flex-col gap-3 max-w-md"><input id="ess-admin-email" type="email" readonly value="${ESS_ADMIN_EMAIL}" class="p-3 rounded-lg bg-slate-900 border border-slate-700"><input id="ess-admin-password" type="password" required autocomplete="current-password" placeholder="${hrText('كلمة مرور حساب إدارة ESS','ESS admin password')}" class="p-3 rounded-lg bg-slate-900 border border-slate-700"><button class="px-4 py-3 rounded-lg bg-sky-700" type="submit">${hrText('اتصال آمن بـ ESS','Connect to ESS securely')}</button><p id="ess-auth-error" role="alert" class="text-red-300"></p></form>`;
  panel.querySelector('#ess-admin-form').addEventListener('submit',async e=>{
   e.preventDefault();const password=panel.querySelector('#ess-admin-password').value;
   panel.querySelector('#ess-admin-password').value='';
   try{const c=await essAuth.signInWithEmailAndPassword(ESS_ADMIN_EMAIL,password);
    if(c.user.uid!==ESS_ADMIN_UID){await essAuth.signOut();throw Error('ESS admin UID mismatch');}
    essRenderRequestPanel();
   }catch(err){const p=document.getElementById('ess-auth-error');if(p)p.textContent=hrText('فشل تسجيل الدخول الإداري إلى ESS. تحقق من كلمة المرور والصلاحيات.','ESS admin sign-in failed. Check credentials and permissions.');}
  });return;
 }
 panel.innerHTML=`<div class="flex flex-wrap gap-3 items-center mb-4"><span class="text-emerald-300">${hrText('متصل بحساب إدارة ESS','ESS admin connected')}</span><button id="ess-signout" class="border border-slate-600 px-3 py-1 rounded-lg">${hrText('فصل ESS','Disconnect ESS')}</button></div><div id="ess-requests-content">${hrText('جاري تحميل الطلبات...','Loading requests...')}</div>`;
 panel.querySelector('#ess-signout').onclick=()=>essAuth.signOut();
 essStopListeners();essRequestState={};essRequestErrors={};
 essPaths.forEach(([path])=>{
  const ref=essDb.ref(path);
  const cb=s=>{essRequestState[path]=s.val()||{};delete essRequestErrors[path];essDrawRequests();};
  const err=e=>{essRequestErrors[path]=e.code||e.message;essDrawRequests();};
  ref.on('value',cb,err);essRequestUnsubscribers.push(()=>ref.off('value',cb));
 });
 essPilotSweep();
}
function essDrawRequests(){
 const area=document.getElementById('ess-requests-content');if(!area)return;
 const rows=[];
 essPaths.forEach(([path,ar,en])=>{
  const codes=essRequestState[path]||{};
  Object.entries(codes).forEach(([code,requests])=>{
   if(!requests||typeof requests!=='object')return;
   Object.entries(requests).forEach(([id,req])=>{
    if(!req||typeof req!=='object')return;
    const t=Number(req.timestamp||req.createdAt||0);
    rows.push({type:hrText(ar,en),path,code,id,req,time:t});
   });
  });
 });
 rows.sort((a,b)=>b.time-a.time);
 const errors=Object.entries(essRequestErrors).map(([p,e])=>`${essEscape(p)}: ${essEscape(e)}`).join(' | ');
 const msg=errors?`<p class="text-amber-300 mb-3">${hrText('تعذر قراءة بعض المسارات','Some paths could not be read')}: ${errors}</p>`:'';
 if(!rows.length){area.innerHTML=msg+`<p>${hrText('لا توجد طلبات حاليًا، أو لم تصل بيانات بعد.','No requests yet, or still loading.')}</p>`;return;}
 area.innerHTML=msg+`<div class="ess-command-bar mb-4" role="toolbar" aria-label="${hrText('غرفة التحكم في الطلبات','Requests control room')}">
<div class="ess-command-title"><span>◈ ${hrText('غرفة التحكم | بصمات الكود 2','Control room | Code 2 punches')}</span><span class="ess-command-count">${hrText('المحدد','Selected')}: <strong id="ess-selected-count">0</strong></span></div>
<div class="ess-command-actions">
<button type="button" class="ess-command-btn ess-command-approve" data-ess-selection-action="APPROVED" disabled>✓ ${hrText('اعتماد المحدد','Approve selected')}</button>
<button type="button" class="ess-command-btn ess-command-hold" data-ess-selection-action="HELD" disabled>◷ ${hrText('تعليق المحدد','Hold selected')}</button>
<button type="button" class="ess-command-btn ess-command-reject" data-ess-selection-action="REJECTED" disabled>✕ ${hrText('رفض المحدد','Reject selected')}</button>
<button type="button" class="ess-command-btn ess-command-delete" id="ess-delete-selected" disabled>▤ ${hrText('حذف المحدد','Delete selected')}</button>
</div><div class="ess-command-help">${hrText('حدد الطلبات من مربعات الاختيار في الطرف المقابل ثم اختر الإجراء.','Select requests using the checkboxes on the opposite side, then choose an action.')}</div></div><p class="mb-3">${rows.length} ${hrText('طلب','requests')}</p><div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr>${[hrText('النوع','Type'),hrText('الكود','Code'),hrText('الحالة','Status'),hrText('التاريخ','Date'),hrText('التفاصيل','Details'),hrText('إجراء','Action')].map(x=>`<th class="p-2 text-start border-b border-slate-700">${x}</th>`).join('')}<th class="ess-selection-col p-2 border-b border-slate-700"><input type="checkbox" id="ess-select-all" aria-label="${hrText('تحديد كل بصمات الاختبار الظاهرة','Select all visible test punches')}" class="ess-choice"></th></tr></thead><tbody>${rows.slice(0,300).map(r=>{
 const date=r.time?new Date(r.time).toLocaleString(currentLang==='ar'?'ar-EG':'en-GB'):'—';
 const status=r.req.status||r.req.verificationStatus||'—';
 const detail=Object.entries(r.req).filter(([k])=>!['selfieData','code','timestamp','createdAt','status','verificationStatus'].includes(k)).slice(0,8).map(([k,v])=>`${k}: ${typeof v==='object'?'[object]':String(v).slice(0,90)}`).join(' | ');
 const selfie=r.path==='attendance_requests' && typeof r.req.selfieData==='string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(r.req.selfieData) ? `<button type="button" class="ess-selfie-open" aria-label="${hrText('تكبير صورة التحقق','Enlarge verification photo')}" data-selfie-id="${escapeHtml(r.id)}"><img src="${r.req.selfieData}" alt="${hrText('صورة التحقق','Verification selfie')}" class="ess-selfie-thumb"></button>` : '';
 const review=r.path==='attendance_requests'&&r.req.verificationStatus==='PENDING_REVIEW'&&String(r.code)==='2' ? ['APPROVED','REJECTED','HELD'].map((v,i)=>`<button class="px-2 py-1 rounded bg-slate-700 mr-1" onclick="essReviewAttendance('${r.code}','${r.id}','${v}')">${[hrText('موافقة','Approve'),hrText('رفض','Reject'),hrText('تعليق','Hold')][i]}</button>`).join(' ') : '';
 return `<tr class="border-b border-slate-700/40"><td class="p-2">${essEscape(r.type)}</td><td class="p-2">${essEscape(r.code)}</td><td class="p-2">${essEscape(status)}</td><td class="p-2">${essEscape(date)}</td><td class="p-2">${essEscape(detail)} ${selfie}</td><td class="p-2">${(r.path==='attendance_requests'&&String(r.code)==='2') ? '—' : ( (portalIsAdmin() && essAuth.currentUser?.uid===ESS_ADMIN_UID && r.req.status==='Pending' && r.path!=='attendance_requests' && r.path!=='suggestions_and_complaints' ? `<button class="px-2 py-1 bg-emerald-700 rounded" onclick="essDecide('${r.path}','${essEscape(r.code)}','${essEscape(r.id)}','Approved')">${hrText('موافقة','Approve')}</button> <button class="px-2 py-1 bg-red-800 rounded" onclick="essDecide('${r.path}','${essEscape(r.code)}','${essEscape(r.id)}','Rejected')">${hrText('رفض','Reject')}</button>` : '—'))}</td><td class="ess-selection-col p-2">${r.path==='attendance_requests'&&String(r.code)==='2'&&portalIsAdmin()?`<input type="checkbox" class="ess-pilot-check ess-choice" value="${escapeHtml(r.id)}" aria-label="${hrText('تحديد الطلب','Select request')} ${escapeHtml(r.id)}">`:''}</td></tr>`;
 }).join('')}</tbody></table></div>`;
 essUpdateSelectionUI();
}
const essSelectedPilotIds = new Set();
function essUpdateSelectionUI(){
 const area=document.getElementById('ess-requests-content');
 if(!area)return;
 const checks=[...area.querySelectorAll('.ess-pilot-check')];
 const visible=new Set(checks.map(x=>x.value));
 for(const id of [...essSelectedPilotIds])if(!visible.has(id))essSelectedPilotIds.delete(id);
 checks.forEach(x=>x.checked=essSelectedPilotIds.has(x.value));
 const counter=area.querySelector('#ess-selected-count');
 if(counter)counter.textContent=String(essSelectedPilotIds.size);
 const del=area.querySelector('#ess-delete-selected');
 if(del)del.disabled=essSelectedPilotIds.size===0;
 area.querySelectorAll('[data-ess-selection-action]').forEach(b=>b.disabled=essSelectedPilotIds.size===0);
 const all=area.querySelector('#ess-select-all');
 if(all){all.checked=checks.length>0&&checks.every(x=>x.checked);all.indeterminate=checks.some(x=>x.checked)&&!all.checked;}
}
document.addEventListener('change',event=>{
 if(event.target.matches?.('.ess-pilot-check')){
  if(event.target.checked)essSelectedPilotIds.add(event.target.value);else essSelectedPilotIds.delete(event.target.value);
  essUpdateSelectionUI();
 }else if(event.target.matches?.('#ess-select-all')){
  document.querySelectorAll('#ess-requests-content .ess-pilot-check').forEach(x=>{
   x.checked=event.target.checked;
   if(x.checked)essSelectedPilotIds.add(x.value);else essSelectedPilotIds.delete(x.value);
  });
  essUpdateSelectionUI();
 }
});
essAuth.onAuthStateChanged(()=>{if(document.getElementById('ess-request-panel'))essRenderRequestPanel();else essStopListeners();});

async function essDecide(path,code,id,status){
 if(!portalIsAdmin()||essAuth.currentUser?.uid!==ESS_ADMIN_UID) return await lmDialog('غير مصرح');
 if(!['permission_requests','leave_requests','loan_requests','mission_requests'].includes(path)||!['Approved','Rejected'].includes(status)||!/^\d+$/.test(code)||!/^[\w-]+$/.test(id))return;
 if(!await lmDialog(status==='Approved'?'تأكيد الموافقة؟':'تأكيد الرفض؟',true))return;
 const ref=essDb.ref(path+'/'+code+'/'+id);
 try{
  const s=await ref.once('value');if(s.val()?.status!=='Pending')throw Error('الطلب لم يعد معلقًا');
  await essDb.ref().update({[path+'/'+code+'/'+id+'/status']:status,[path+'/'+code+'/'+id+'/reviewedAt']:firebase.database.ServerValue.TIMESTAMP,[path+'/'+code+'/'+id+'/reviewedBy']:ESS_ADMIN_UID});
  try {await essDb.ref('notifications/'+code).push({title:status==='Approved'?'تمت الموافقة على الطلب':'تم رفض الطلب',body:'حالة طلبك ('+path+') أصبحت '+status,createdAt:firebase.database.ServerValue.TIMESTAMP,senderUid:ESS_ADMIN_UID});await lmDialog('تم تسجيل القرار وإرسال الإشعار');}catch(notifyError){await lmDialog('تم تسجيل القرار، لكن إرسال الإشعار فشل: '+(notifyError.code||notifyError.message));}
 }catch(e){await lmDialog('تعذر تسجيل القرار أو إرسال الإشعار: '+(e.code||e.message));console.error(e)}
}
async function essSendNotification(){
 if(!portalIsAdmin()||essAuth.currentUser?.uid!==ESS_ADMIN_UID)return;
 const code=document.getElementById('ess-notify-code')?.value.trim(),title=document.getElementById('ess-notify-title')?.value.trim(),body=document.getElementById('ess-notify-body')?.value.trim();
 if(!/^(2|102)$/.test(code)||!title||!body||title.length>120||body.length>1000)return await lmDialog('الكود المسموح حاليًا 2 أو 102، والعنوان والرسالة مطلوبان');
 try{await essDb.ref('notifications/'+code).push({title,body,createdAt:firebase.database.ServerValue.TIMESTAMP,senderUid:ESS_ADMIN_UID});await lmDialog('تم إرسال الإشعار')}catch(e){await lmDialog('فشل إرسال الإشعار: '+(e.code||e.message))}
}


// Branded dark dialog; avoids browser alert/confirm windows.
function lmDialog(message,ask=false){
 return new Promise(resolve=>{
  const lang=currentLang==='en'?'en':'ar';
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.84);display:grid;place-items:center;padding:20px';
  const card=document.createElement('div');
  card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');
  card.setAttribute('aria-label',lang==='ar'?'رسالة النظام':'System message');
  card.dir=lang==='ar'?'rtl':'ltr';
  card.style.cssText='width:min(420px,95vw);padding:24px;border-radius:20px;background:#101d35;color:#e2e8f0;border:1px solid #24547c;box-shadow:0 20px 60px #0009;text-align:center;font-family:inherit';
  const msg=document.createElement('div');msg.style.cssText='line-height:1.8;white-space:pre-wrap;margin-bottom:22px;overflow-wrap:anywhere';
  msg.textContent=message;
  const row=document.createElement('div');row.style.cssText='display:flex;justify-content:center;gap:12px';
  const close=(result)=>{document.removeEventListener('keydown',onKey,true);overlay.remove();resolve(result)};
  const onKey=(event)=>{if(event.key==='Escape'){event.preventDefault();close(false)}};
  document.addEventListener('keydown',onKey,true);
  function add(label,result,color){const button=document.createElement('button');button.type='button';button.textContent=label;button.style.cssText='padding:11px 22px;border-radius:12px;border:0;background:'+color+';color:white;font-weight:700;cursor:pointer';button.onclick=()=>close(result);row.append(button);return button}
  if(ask)add(lang==='ar'?'إلغاء':'Cancel',false,'#475569');
  const primary=add(ask?(lang==='ar'?'تأكيد':'Confirm'):(lang==='ar'?'حسنًا':'OK'),true,'#167bb7');
  card.append(msg,row);overlay.append(card);document.body.append(overlay);primary.focus();
 });
}

// Notification audience preview only. Actual sends must use an authenticated trusted backend.
function hrNotificationAudienceChanged(){
 const target=document.getElementById('hr-notify-target')?.value;
 const el=document.getElementById('hr-notify-target-fields');if(!el)return;
 const opts=[...new Set(allEmployees.map(e=>String(getEmployeeDept(e)||'').trim()).filter(x=>x&&x!=='--'))].sort();
 if(target!=='employees')hrSelectedNotificationCodes.clear();
 if(target==='department')el.innerHTML='<label class="block text-sm mb-1">'+hrText('الإدارة','Department')+'</label><select id="hr-notify-department" class="w-full p-3 rounded-xl bg-slate-900 border border-sky-500/30">'+opts.map((x,i)=>'<option value="'+i+'">'+escapeHtml(x)+'</option>').join('')+'</select>';
 else if(target==='employees')el.innerHTML='<label class="block text-sm mb-1">'+hrText('بحث واختيار الموظفين','Search and select employees')+'</label><input id="hr-notify-search" oninput="hrFilterNotificationEmployees()" class="w-full p-3 rounded-xl bg-slate-900 border border-sky-500/30 mb-2" placeholder="'+hrText('الاسم أو الكود','Name or code')+'"><div id="hr-notify-employee-list" class="max-h-52 overflow-auto border border-slate-700 rounded-xl p-2"></div>',hrFilterNotificationEmployees();
 else el.innerHTML='';
 const p=document.getElementById('hr-notify-preview');if(p)p.replaceChildren();
}
let hrSelectedNotificationCodes=new Set();
function hrFilterNotificationEmployees(){
 const area=document.getElementById('hr-notify-employee-list');if(!area)return;
 const checked=hrSelectedNotificationCodes;
 const q=String(document.getElementById('hr-notify-search')?.value||'').toLocaleLowerCase();
 const employees=allEmployees.filter(e=>String(getEmployeeCode(e)).includes(q)||String(getEmployeeName(e)).toLocaleLowerCase().includes(q)).slice(0,150);
 area.innerHTML=employees.map(e=>{const code=getEmployeeCode(e);return '<label class="flex items-center gap-2 p-1 text-sm"><input class="hr-recipient-checkbox" type="checkbox" value="'+escapeHtml(code)+'" '+(checked.has(code)?'checked':'')+'><span>'+escapeHtml(getEmployeeName(e))+' — '+escapeHtml(code)+'</span></label>'}).join('')||hrText('لا توجد نتائج','No results');
 area.querySelectorAll('.hr-recipient-checkbox').forEach(el=>el.addEventListener('change',()=>{if(el.checked)hrSelectedNotificationCodes.add(el.value);else hrSelectedNotificationCodes.delete(el.value);}));
}
function hrPreviewNotification(){
 const area=document.getElementById('hr-notify-preview');if(!area)return;
 const title=String(document.getElementById('hr-notify-title')?.value||'').trim(),body=String(document.getElementById('hr-notify-body')?.value||'').trim();
 if(!title||!body){area.textContent=hrText('أدخل العنوان والرسالة أولًا.','Enter title and message first.');return;}
 const target=document.getElementById('hr-notify-target')?.value;
 let recipients=[];
 if(target==='all')recipients=allEmployees;
 else if(target==='department'){
 const opts=[...new Set(allEmployees.map(e=>String(getEmployeeDept(e)||'').trim()).filter(x=>x&&x!=='--'))].sort();const dept=opts[Number(document.getElementById('hr-notify-department')?.value)];recipients=allEmployees.filter(e=>String(getEmployeeDept(e)||'').trim()===dept);
 }else{recipients=allEmployees.filter(e=>hrSelectedNotificationCodes.has(getEmployeeCode(e)));}
 const ack=!!document.getElementById('hr-notify-ack')?.checked;
 area.replaceChildren();const p=document.createElement('p');p.className='p-3 rounded-xl border border-sky-500/30 bg-slate-900/50';p.textContent=hrText('معاينة فقط — ','Preview only — ')+recipients.length+' '+hrText('موظف من بيانات البورتال. الإقرار: ','employees from portal data. Acknowledgement: ')+(ack?hrText('مطلوب','Required'):hrText('غير مطلوب','Not required'))+'. '+hrText('لا يُفترض أن لديهم جميعًا حساب ESS أو اشتراك Push.','Not all necessarily have ESS accounts or push subscriptions.');area.appendChild(p);
}


// Spark-only internal delivery: ESS admin Firebase Auth, no FCM server secrets.
// Pilot restricted to codes 2 and 102. This is NOT background push.
async function hrSendNotification(){
 const title=String(document.getElementById('hr-notify-title')?.value||'').trim();
 const body=String(document.getElementById('hr-notify-body')?.value||'').trim();
 const target=document.getElementById('hr-notify-target')?.value;
 if(!title||!body||title.length>120||body.length>1000)return lmDialog(hrText('أدخل عنوانًا ورسالة صالحين','Enter a valid title and message'));
 if(!portalIsAdmin()||!portalAuth.currentUser)return lmDialog(hrText('غير مصرح بالإرسال','Not authorized'));
 if(essAuth.currentUser?.uid!==ESS_ADMIN_UID)return lmDialog(hrText('اربط حساب إدارة ESS أولًا من لوحة الطلبات','Connect the ESS admin account from the requests panel first'));
 let recipients=[];
 if(target==='all')recipients=allEmployees;
 else if(target==='department'){
  const opts=[...new Set(allEmployees.map(e=>String(getEmployeeDept(e)||'').trim()).filter(x=>x&&x!=='--'))].sort();
  const dept=opts[Number(document.getElementById('hr-notify-department')?.value)]||'';
  if(!dept)return lmDialog(hrText('اختر الإدارة','Select department'));
  recipients=allEmployees.filter(e=>String(getEmployeeDept(e)||'').trim()===dept);
 }else if(target==='employees')recipients=allEmployees.filter(e=>hrSelectedNotificationCodes.has(String(getEmployeeCode(e))));
 else return lmDialog('Invalid target');
 const codes=[...new Set(recipients.map(e=>String(getEmployeeCode(e)||'').trim()).filter(Boolean))];
 if(!codes.length)return lmDialog(hrText('لا يوجد مستلمون','No recipients'));
 const pilot=['2','102'];
 if(codes.some(c=>!pilot.includes(c)))return lmDialog(hrText('مرحلة الاختبار تسمح بالكودين 2 و102 فقط. اخترهما من الموظفين المحددين.','Pilot only permits codes 2 and 102. Select specific employees.'));
 const ack=!!document.getElementById('hr-notify-ack')?.checked;
 const ok=await lmDialog(hrText('تأكيد إرسال إشعار داخلي إلى ','Confirm internal message to ')+codes.join(', ')+' ؟',true);
 if(!ok)return;
 const btn=document.getElementById('hr-notify-send');if(btn)btn.disabled=true;
 try{
  const senderUid=portalAuth.currentUser.uid;
  const essUid=essAuth.currentUser.uid;
  const batchId=essDb.ref('notification_audit').push().key;
  const msg={title,body,requiresAcknowledgement:ack,createdAt:firebase.database.ServerValue.TIMESTAMP,senderUid:essUid,portalSenderUid:senderUid,batchId};
  const updates={};
  for(const code of codes)updates['notifications/'+code+'/'+batchId]=msg;
  updates['notification_audit/'+batchId]={title,body,requiresAcknowledgement:ack,createdAt:firebase.database.ServerValue.TIMESTAMP,senderUid:essUid,portalSenderUid:senderUid,recipientCodes:codes,recipientCount:codes.length};
  await essDb.ref().update(updates);
  await lmDialog(hrText('تم حفظ الإشعار داخل ESS بنجاح لـ ','Internal ESS message saved for ')+codes.length+hrText(' موظف. لا يتضمن إرسال Push والهاتف مقفول.',' employees. No background push was sent.'));
 }catch(e){await lmDialog(hrText('فشل الإرسال: ','Sending failed: ')+(e.code||e.message));}
 finally{if(btn)btn.disabled=false;}
}

// CODE 2 PILOT: append-only payroll-grade approved event ledger. No writes to legacy attendance.
const ESS_ATTENDANCE_PILOT_CODES=new Set(['2']);
const ESS_PILOT_TTL=86400000;
let essPilotSweepRunning=false;
function essPilotReady(){return portalIsAdmin() && essAuth.currentUser?.uid===ESS_ADMIN_UID;}
function essCairoDay(ts){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(ts));const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}`;}
// Idempotent repair: a previously approved request is still copied to the immutable ledger.
async function essFinalizeApproved(code,id){
 if(!essPilotReady()||String(code)!=='2'||!/^[-\w]+$/.test(id))throw Error('UNAUTHORIZED');
 const r=(await essDb.ref('attendance_requests/'+code+'/'+id).once('value')).val();
 if(!r||r.verificationStatus!=='APPROVED')throw Error('NOT_APPROVED');
 const ts=Number(r.createdAt);
 if(!Number.isFinite(ts)||ts<=0||!['IN','OUT'].includes(r.punchType))throw Error('INVALID_REQUEST');
 const event={requestId:id,code:'2',punchType:r.punchType,punchTimestamp:ts,dayKey:essCairoDay(ts),decisionMethod:r.decisionMethod,reviewedBy:r.reviewedBy,reviewedAt:r.reviewedAt};
 let out;try{out=await essDb.ref('approved_attendance/2/'+id).transaction(old=>old===null?event:undefined,undefined,false);}catch(e){console.error('[CODE2] LEDGER_WRITE_DENIED',{path:'approved_attendance/2/'+id,requestId:id,uid:essAuth.currentUser?.uid,event},e);throw Error('LEDGER_WRITE: '+(e.code||e.message));}
 return out.committed||out.snapshot.exists();
}
const essDecisionReasons={
 REJECTED:[['FACE_MISMATCH','الصورة لا تطابق الموظف','Photo does not match employee'],['PHOTO_UNCLEAR','الصورة غير واضحة','Photo is unclear'],['OUTSIDE_GEOFENCE','خارج نطاق العمل المسموح','Outside permitted work zone'],['GPS_UNVERIFIED','تعذر التحقق من الموقع','Location could not be verified'],['DUPLICATE','بصمة مكررة','Duplicate punch'],['INVALID_TIME','تاريخ أو وقت غير صحيح','Invalid timestamp'],['INCOMPLETE_EVIDENCE','بيانات التحقق غير مكتملة','Incomplete evidence'],['OTHER','سبب آخر','Other']],
 HELD:[['REVIEW_PHOTO','بانتظار مراجعة الصورة','Awaiting photo review'],['REVIEW_GPS','بانتظار مراجعة الموقع','Awaiting location review'],['EMPLOYEE_CLARIFICATION','بانتظار توضيح الموظف','Awaiting employee clarification'],['OTHER','سبب آخر','Other']]
};
function essReasonDialog(decision,count){
 return new Promise(resolve=>{
  const overlay=document.createElement('div');overlay.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#020617d9;display:grid;place-items:center;padding:18px';
  const card=document.createElement('div');card.style.cssText='width:min(480px,95vw);background:#101d35;border:1px solid #316083;border-radius:18px;padding:22px;color:#e2e8f0;box-shadow:0 20px 50px #000a;direction:'+(currentLang==='ar'?'rtl':'ltr');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');
  const title=document.createElement('h3');title.textContent=(decision==='REJECTED'?hrText('سبب الرفض','Rejection reason'):hrText('سبب التعليق','Hold reason'))+' ('+count+')';title.style.cssText='font-weight:800;font-size:20px;margin-bottom:12px';
  const select=document.createElement('select');select.style.cssText='width:100%;background:#172b46;border:1px solid #48708d;border-radius:10px;padding:12px;color:white;margin-bottom:12px';
  const options=essDecisionReasons[decision];options.forEach(([code,ar,en])=>{const o=document.createElement('option');o.value=code;o.textContent=hrText(ar,en);select.appendChild(o)});
  const note=document.createElement('textarea');note.placeholder=hrText('ملاحظات إضافية (إلزامية عند اختيار سبب آخر)','Additional notes (required for Other)');note.style.cssText='width:100%;min-height:80px;padding:10px;background:#172b46;color:white;border:1px solid #48708d;border-radius:10px;margin-bottom:12px';
  const err=document.createElement('p');err.style.cssText='color:#fda4af;font-size:13px';
  const actions=document.createElement('div');actions.style.cssText='display:flex;gap:10px;margin-top:15px';
  const cancel=document.createElement('button');cancel.textContent=hrText('إلغاء','Cancel');const ok=document.createElement('button');ok.textContent=hrText('تأكيد القرار','Confirm decision');
  for(const b of [cancel,ok])b.style.cssText='border-radius:10px;padding:10px 16px;color:white;background:#24547c';
  const finish=v=>{overlay.remove();document.removeEventListener('keydown',key,true);resolve(v)};
  const key=e=>{if(e.key==='Escape'){e.preventDefault();finish(null)}};document.addEventListener('keydown',key,true);
  cancel.onclick=()=>finish(null);ok.onclick=()=>{const reason=options.find(x=>x[0]===select.value);const extra=note.value.trim();if(select.value==='OTHER'&&extra.length<5){err.textContent=hrText('اكتب توضيحًا لا يقل عن 5 حروف','Please explain in at least 5 characters');return}finish(reason[0]+': '+hrText(reason[1],reason[2])+(extra?' — '+extra:''))};
  actions.append(cancel,ok);card.append(title,select,note,err,actions);overlay.append(card);document.body.append(overlay);select.focus();
 });
}
async function essAttendanceDecision(code,id,decision,auto=false,reason=""){
 if(!essPilotReady()||String(code)!=='2'||!/^[-\w]+$/.test(id))throw Error('UNAUTHORIZED');
 if(!['APPROVED','REJECTED','HELD'].includes(decision))throw Error('INVALID_DECISION');
 if((decision==='REJECTED'||decision==='HELD')&&!reason.trim())throw Error('DECISION_REASON_REQUIRED');
 const ref=essDb.ref('attendance_requests/2/'+id);
 // Use server time offset for UI expiry estimate; the DB rules also enforce auto timing.
 const offsetSnap=await essDb.ref('.info/serverTimeOffset').once('value');
 const serverNow=Date.now()+Number(offsetSnap.val()||0);
 let result;try{result=await ref.transaction(old=>{
  if(!old||!(old.verificationStatus==='PENDING_REVIEW'||(!auto&&old.verificationStatus==='HELD'&&decision!=='HELD')))return;
  if(auto&&(decision!=='APPROVED'||serverNow-Number(old.createdAt||0)<ESS_PILOT_TTL))return;
  return {...old,verificationStatus:decision,decisionMethod:auto?'AUTO_24H':'MANUAL',reviewedBy:ESS_ADMIN_UID,reviewedAt:firebase.database.ServerValue.TIMESTAMP,...(decision==='REJECTED'||decision==='HELD'?{decisionReason:reason}:{})};
 },undefined,false);}catch(e){console.error('[CODE2] REQUEST_UPDATE_DENIED',{path:'attendance_requests/2/'+id,requestId:id,uid:essAuth.currentUser?.uid,decision},e);throw Error('REQUEST_UPDATE: '+(e.code||e.message));}
 if(!result.committed)return false;
 if(decision==='APPROVED')await essFinalizeApproved(code,id);
 return true;
}
async function essPilotSweep(){
 if(essPilotSweepRunning||!essPilotReady())return;
 essPilotSweepRunning=true;
 try{
  const offset=Number((await essDb.ref('.info/serverTimeOffset').once('value')).val()||0);
  const serverNow=Date.now()+offset;
  const snap=await essDb.ref('attendance_requests/2').once('value');
  for(const [id,r] of Object.entries(snap.val()||{})){
   if(!r||!Number.isFinite(Number(r.createdAt)))continue;
   const expired=serverNow-Number(r.createdAt)>=ESS_PILOT_TTL;
   if(expired&&r.verificationStatus==='PENDING_REVIEW'){
    try{await essAttendanceDecision('2',id,'APPROVED',true);}catch(e){console.warn('Auto approval failed',id,e);}
   }
   const fresh=(await essDb.ref('attendance_requests/2/'+id).once('value')).val();
   if(fresh?.verificationStatus==='APPROVED'){
    try{await essFinalizeApproved('2',id);}catch(e){console.error('LEDGER REPAIR REQUIRED',id,e);}
   }
   // Do not remove held evidence; rejected/approved evidence expires after 24h.
   if(expired&&fresh?.verificationStatus!=='HELD'&&fresh?.selfieData){
    try{await essDb.ref('attendance_requests/2/'+id+'/selfieData').remove();}catch(e){console.warn('Evidence cleanup failed',id,e);}
   }
  }
 }finally{essPilotSweepRunning=false;}
}
// TEST ONLY: administrator resets one Code 2 attendance request and its derived ledger event.
// A durable audit is written first; deletion is deliberately NOT available for legacy attendance.
// Code 2 pilot: return structured results instead of silently swallowing Firebase failures.
async function essDeletePilotRequest(id,alreadyConfirmed=false){
 let stage='VALIDATE';
 const result=(ok,reason='')=>({ok,id,stage,reason});
 if(!/^[-\w]+$/.test(id))return result(false,'INVALID_ID');
 if(!essPilotReady()){
  if(!alreadyConfirmed)await lmDialog(hrText('يلزم اتصال إدارة ESS أولًا.','ESS admin sign-in required.'));
  return result(false,'ESS_ADMIN_NOT_CONNECTED');
 }
 const requestRef=essDb.ref('attendance_requests/2/'+id);
 const ledgerRef=essDb.ref('approved_attendance/2/'+id);
 try{
  stage='READ_REQUEST_AND_LEDGER';
  const [requestSnap,ledgerSnap]=await Promise.all([requestRef.once('value'),ledgerRef.once('value')]);
  const request=requestSnap.val();
  if(!request)return result(false,'REQUEST_NOT_FOUND');
  const expected=String(request.punchType||'');
  if(!alreadyConfirmed && !await essConfirmDelete([id]))return result(false,'CANCELLED');
  stage='RECHECK_REQUEST';
  const fresh=(await requestRef.once('value')).val();
  // Normalize optional legacy fields; do not mistake missing punchType for a changed request.
  // Check immutable identity fields, not mutable review status / evidence cleanup.
  if(!fresh)throw Error('REQUEST_REMOVED_DURING_DELETE');
  const sameCreatedAt=String(fresh.createdAt??'')===String(request.createdAt??'');
  const samePunchType=String(fresh.punchType??'')===String(request.punchType??'');
  const sameCode=String(fresh.code??'')===String(request.code??'');
  if(!sameCreatedAt||!samePunchType||!sameCode){
   console.warn('[CODE2] DELETE_RECHECK_MISMATCH',{id,sameCreatedAt,samePunchType,sameCode});
   throw Error('REQUEST_CHANGED_IDENTITY');
  }
  stage='WRITE_AUDIT';
  const auditRef=essDb.ref('pilot_deletion_audit/2').push();
  await auditRef.set({adminUid:ESS_ADMIN_UID,deletedAt:firebase.database.ServerValue.TIMESTAMP,code:'2',requestId:id,reason:'PILOT_RESET',punchType:expected||'UNKNOWN',verificationStatus:String(fresh.verificationStatus||'UNKNOWN'),hadLedger:ledgerSnap.exists()});
  stage='DELETE_LEDGER';
  if(ledgerSnap.exists())await ledgerRef.remove();
  stage='DELETE_REQUEST';
  await requestRef.remove();
  stage='DONE';
  return result(true);
 }catch(e){
  const reason=String(e.code||e.message||'UNKNOWN_ERROR');
  console.error('[CODE2] PILOT_DELETE_FAILED',{id,stage,reason},e);
  return result(false,reason);
 }
}

function essConfirmDelete(ids){
 return new Promise(resolve=>{
  const overlay=document.createElement('div');
  overlay.setAttribute('role','presentation');
  overlay.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.84);display:grid;place-items:center;padding:20px';
  const card=document.createElement('div');
  card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-label',hrText('تأكيد حذف الاختبار','Confirm test deletion'));
  card.style.cssText='width:min(460px,95vw);padding:26px;border-radius:20px;background:#101d35;color:#e2e8f0;border:1px solid #24547c;box-shadow:0 20px 60px #0009;text-align:center;direction:'+(currentLang==='ar'?'rtl':'ltr')+';font-family:inherit';
  const title=document.createElement('h3');title.textContent=hrText('تأكيد حذف بصمات الاختبار','Confirm deletion of test punches');title.style.cssText='font-size:20px;font-weight:800;margin-bottom:12px;color:#fda4af';
  const detail=document.createElement('p');detail.textContent=hrText('سيتم حذف ','Delete ')+ids.length+hrText(' طلب للكود 2 مع سجلات الاعتماد المرتبطة، وتسجيل عمليات الحذف في سجل التدقيق. لا يمكن التراجع.',' Code 2 request(s) and linked ledger entries. Deletions are audited and cannot be undone.');
  detail.style.cssText='line-height:1.8;margin-bottom:20px';
  const actions=document.createElement('div');actions.style.cssText='display:flex;gap:12px;justify-content:center';
  const cancel=document.createElement('button');cancel.type='button';cancel.textContent=hrText('إلغاء','Cancel');
  const confirm=document.createElement('button');confirm.type='button';confirm.textContent=hrText('تأكيد الحذف','Confirm delete');
  for(const b of [cancel,confirm])b.style.cssText='padding:11px 20px;border-radius:12px;border:0;color:white;font-weight:700;cursor:pointer';
  cancel.style.background='#475569';confirm.style.background='#be123c';
  const close=result=>{overlay.remove();document.removeEventListener('keydown',onKey,true);resolve(result)};
  const onKey=e=>{if(e.key==='Escape'){e.preventDefault();close(false)}};
  document.addEventListener('keydown',onKey,true);
  cancel.onclick=()=>close(false);confirm.onclick=()=>close(true);
  actions.append(cancel,confirm);card.append(title,detail,actions);overlay.append(card);document.body.append(overlay);cancel.focus();
 });
}
let essDeletingBatch=false;
async function essDeleteSelectedPilot(){
 if(essDeletingBatch)return;
 const ids=[...essSelectedPilotIds];
 if(!ids.length)return;
 if(!essPilotReady()){await lmDialog(hrText('اتصل بحساب إدارة ESS أولًا.','Sign in with the ESS admin account first.'));return;}
 if(!await essConfirmDelete(ids))return;
 essDeletingBatch=true;
 const results=[];
 try{
  for(const id of ids){
   const outcome=await essDeletePilotRequest(id,true);
   results.push(outcome);
   if(outcome.ok)essSelectedPilotIds.delete(id);
  }
  const ok=results.filter(x=>x.ok).length;
  const failed=results.filter(x=>!x.ok);
  console.table(results);
  const summary=hrText('تم الحذف: ','Deleted: ')+ok+hrText(' | فشل: ',' | Failed: ')+failed.length;
  if(failed.length){
   await essShowDeletionReport(summary,failed);
  }else await lmDialog(summary);
  if(typeof essRenderRequestPanel==='function')essRenderRequestPanel();
 }finally{essDeletingBatch=false}
}
function essShowDeletionReport(summary,failed){
 return new Promise(resolve=>{
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#020617d9;display:grid;place-items:center;padding:16px';
  const panel=document.createElement('section');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
  panel.style.cssText='width:min(680px,96vw);max-height:85vh;overflow:auto;background:#101d35;color:#e2e8f0;border:1px solid #24547c;border-radius:18px;padding:24px;box-shadow:0 24px 65px #000a;direction:'+(currentLang==='ar'?'rtl':'ltr');
  const title=document.createElement('h3');title.textContent=summary;title.style.cssText='font-weight:800;font-size:19px;margin-bottom:14px';panel.append(title);
  const note=document.createElement('p');note.textContent=hrText('تفاصيل الطلبات التي لم تُحذف. لم تتم إعادة محاولة الحذف تلقائيًا.','Failed requests. No automatic retry was attempted.');note.style.cssText='color:#a8c1d8;margin-bottom:12px';panel.append(note);
  const list=document.createElement('div');list.style.cssText='display:grid;gap:8px;max-height:45vh;overflow:auto';
  failed.forEach(x=>{const row=document.createElement('div');row.style.cssText='background:#1b2e47;border:1px solid #34526e;border-radius:9px;padding:10px;overflow-wrap:anywhere';
   const id=document.createElement('strong');id.textContent=x.id;const detail=document.createElement('div');detail.textContent=x.stage+' — '+x.reason;detail.style.cssText='font:12px monospace;color:#fda4af;margin-top:4px';row.append(id,detail);list.append(row)});panel.append(list);
  const actions=document.createElement('div');actions.style.cssText='display:flex;gap:10px;margin-top:18px;justify-content:center';
  const copy=document.createElement('button');copy.type='button';copy.textContent=hrText('نسخ التقرير','Copy report');
  const close=document.createElement('button');close.type='button';close.textContent=hrText('حسنًا','OK');
  [copy,close].forEach(b=>b.style.cssText='background:#1678b6;color:white;border:0;border-radius:9px;padding:10px 18px;cursor:pointer');
  copy.onclick=async()=>{const content=summary+'\n'+failed.map(x=>x.id+' | '+x.stage+' | '+x.reason).join('\n');try{await navigator.clipboard.writeText(content)}catch(e){console.warn('Clipboard unavailable',e)}};
  const done=()=>{document.removeEventListener('keydown',onKey,true);overlay.remove();resolve()};
  const onKey=e=>{if(e.key==='Escape'){e.preventDefault();done()}};
  document.addEventListener('keydown',onKey,true);close.onclick=done;
  actions.append(copy,close);panel.append(actions);overlay.append(panel);document.body.append(overlay);close.focus();
 });
}

document.addEventListener('click',event=>{
 if(event.target.closest?.('#ess-delete-selected')){event.preventDefault();essDeleteSelectedPilot();}
});
document.addEventListener('click',event=>{
 const btn=event.target.closest?.('.ess-pilot-delete');
 if(!btn)return;
 event.preventDefault();
 const id=btn.getAttribute('data-request-id');
 if(id)essDeletePilotRequest(id).then(outcome=>{if(outcome.ok){essSelectedPilotIds.delete(id);lmDialog(hrText('تم حذف بصمة الاختبار.','Test punch deleted.')).then(()=>essRenderRequestPanel());}else if(outcome.reason!=='CANCELLED')essShowDeletionReport(hrText('تعذر حذف الطلب','Request deletion failed'),[outcome]);});
});
async function essReviewAttendance(code,id,decision){
 const reason=decision==='REJECTED'||decision==='HELD'?await essReasonDialog(decision,1):'';
 if((decision==='REJECTED'||decision==='HELD')&&!reason)return;
 if(!await lmDialog(hrText('تأكيد القرار؟','Confirm decision?'),true))return;
 try{const done=await essAttendanceDecision(code,id,decision,false,reason);await lmDialog(done?hrText('تم القرار وتحديث السجل عند الموافقة','Decision saved; approved event added to ledger'):hrText('الطلب تم التعامل معه سابقًا','Already processed'));}
 catch(e){await lmDialog(hrText('فشل التنفيذ؛ راجع السجل: ','Action failed; check ledger: ')+(e.code||e.message));}
}
let essSelectionBusy=false;
async function essApplySelectedDecision(decision){
 if(essSelectionBusy||!['APPROVED','HELD','REJECTED'].includes(decision))return;
 if(!essPilotReady()){await lmDialog(hrText('يلزم اتصال إدارة ESS أولًا.','ESS admin login required.'));return;}
 const ids=[...essSelectedPilotIds];if(!ids.length)return;
 const snap=await essDb.ref('attendance_requests/2').once('value');
 const values=snap.val()||{};
 const pending=ids.filter(id=>values[id]?.verificationStatus==='PENDING_REVIEW'||(decision!=='HELD'&&values[id]?.verificationStatus==='HELD'));
 const skipped=ids.length-pending.length;
 if(!pending.length){await lmDialog(hrText('الطلبات المحددة ليست معلقة للمراجعة.','Selected requests are not pending review.'));return;}
 const names={APPROVED:hrText('اعتماد','Approve'),HELD:hrText('تعليق','Hold'),REJECTED:hrText('رفض','Reject')};
 const reason=(decision==='REJECTED'||decision==='HELD')?await essReasonDialog(decision,pending.length):'';
 if((decision==='REJECTED'||decision==='HELD')&&!reason)return;
 if(!await lmDialog(names[decision]+' '+pending.length+' '+hrText('طلب محدد؟','selected request(s)?'),true))return;
 essSelectionBusy=true;let ok=0,fail=0;
 try{
  for(const id of pending){
   try{if(await essAttendanceDecision('2',id,decision,false,reason)){ok++;essSelectedPilotIds.delete(id)}else fail++}
   catch(e){fail++;console.error('[CODE2] SELECTED_DECISION_FAILED',id,e)}
  }
  await lmDialog(hrText('نجح: ','Succeeded: ')+ok+hrText(' | فشل: ',' | Failed: ')+fail+hrText(' | غير معلق: ',' | Not pending: ')+skipped);
  essUpdateSelectionUI();
 }finally{essSelectionBusy=false}
}
document.addEventListener('click',event=>{
 const button=event.target.closest?.('[data-ess-selection-action]');
 if(button){event.preventDefault();essApplySelectedDecision(button.dataset.essSelectionAction)}
});
async function essBulkCode2(decision){
 if(decision==='REJECTED'||decision==='HELD')return lmDialog(hrText('استخدم غرفة التحكم لتحديد الطلبات وسبب القرار.','Use the control room to select requests and provide a reason.'));
 if(!essPilotReady()||!['APPROVED','HELD','REJECTED'].includes(decision))return;
 const snap=await essDb.ref('attendance_requests/2').once('value');
 const ids=Object.entries(snap.val()||{}).filter(([,r])=>r?.verificationStatus==='PENDING_REVIEW').map(([id])=>id);
 if(!ids.length){await lmDialog(hrText('لا توجد طلبات معلقة','No pending requests'));return;}
 if(!await lmDialog(hrText('تطبيق '+decision+' على '+ids.length+' طلب؟','Apply '+decision+' to '+ids.length+' requests?'),true))return;
 let ok=0,failed=0;
 for(const id of ids){try{if(await essAttendanceDecision('2',id,decision))ok++;else failed++;}catch(e){failed++;console.error('Bulk failure',id,e);}}
 await lmDialog(hrText('نجح: ','Succeeded: ')+ok+hrText(' | فشل: ',' | Failed: ')+failed);
}
// Trigger sweep after admin authentication and while the notifications view remains open.
let essPilotInterval=null;
function essStartPilotTimer(){if(essPilotInterval)clearInterval(essPilotInterval);essPilotInterval=setInterval(()=>{if(essPilotReady()&&document.getElementById('ess-requests-content'))essPilotSweep();},60000);}
document.addEventListener('DOMContentLoaded',essStartPilotTimer);

// Keyboard support: native buttons already activate with Enter; form fields need explicit actions.
document.addEventListener('keydown',event=>{
 if(event.key!=='Enter'||event.isComposing||event.repeat||event.defaultPrevented)return;
 const target=event.target;
 if(!target||target.closest?.('[role="dialog"]'))return;
 if(target.matches?.('textarea,[contenteditable="true"]'))return;
 if(target.matches?.('#login-emp-code,#login-password')){
  event.preventDefault();
  if(typeof handleLogin==='function')handleLogin();
  return;
 }
 if(target.matches?.('#search-input')){
  event.preventDefault();
  if(typeof filterEmployees==='function')filterEmployees();
  return;
 }
 // For custom clickable elements only; do not double-fire native button/link behavior.
 const clickable=target.closest?.('[role="button"][tabindex], [data-keyboard-activate="true"]');
 if(clickable&&!clickable.matches('button,a,input,select,textarea')){
  event.preventDefault();clickable.click();
 }
});

// Control-room design uses the portal's slate / sky palette, with raised 3D controls.
(function essInjectControlRoomStyles(){
 if(document.getElementById('ess-control-room-styles'))return;
 const style=document.createElement('style');style.id='ess-control-room-styles';
 style.textContent=`
 .ess-command-bar{padding:16px 18px;border:1px solid #294460;border-radius:18px;background:linear-gradient(155deg,#182d47,#0c192e);box-shadow:0 12px 28px #02061770,inset 0 1px #ffffff18;position:relative}
 .ess-command-title{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;color:#dbeafe;font-weight:750;margin-bottom:12px}
 .ess-command-count{font-size:13px;background:#0f2743;border:1px solid #34526e;border-radius:20px;padding:5px 12px}
 .ess-command-actions{display:flex;gap:10px;flex-wrap:wrap}
 .ess-command-btn{font:inherit;font-size:13px;font-weight:750;padding:11px 16px;border-radius:11px;border:1px solid #47617a;color:#e2e8f0;background:linear-gradient(180deg,#324b66,#1b304a);box-shadow:0 4px 0 #071426,0 8px 14px #0005,inset 0 1px #ffffff2b;cursor:pointer;transition:background .16s,transform .16s,box-shadow .16s,border-color .16s}
 .ess-command-btn:not(:disabled):hover{transform:translateY(-2px);background:linear-gradient(180deg,#42749e,#234c75);border-color:#6bb6ec;box-shadow:0 6px 0 #071426,0 12px 18px #0006,inset 0 1px #ffffff45}
 .ess-command-btn:not(:disabled):active{transform:translateY(2px);box-shadow:0 1px 0 #071426,inset 0 2px 7px #0007}
 .ess-command-btn:focus-visible,.ess-choice:focus-visible{outline:2px solid #7dd3fc;outline-offset:3px}
 .ess-command-btn:disabled{opacity:.4;cursor:not-allowed}
 .ess-command-help{font-size:12px;color:#94a3b8;margin-top:12px}
 .ess-selection-col{width:56px;text-align:center;vertical-align:middle;background:#12253a66}
 .ess-choice{appearance:none;width:19px;height:19px;border:2px solid #6382a0;border-radius:6px;background:#0b1b30;cursor:pointer;vertical-align:middle;position:relative}
 .ess-choice:checked{background:#2778b2;border-color:#7dd3fc;box-shadow:0 0 0 3px #0ea5e922}
 .ess-choice:checked:after{content:'✓';position:absolute;left:3px;top:-3px;color:white;font-size:16px;font-weight:800}
 @media(max-width:650px){.ess-command-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.ess-command-btn{padding:11px 7px;font-size:12px}.ess-command-bar{padding:12px}}
 `;
 document.head.appendChild(style);
})();

// Secure-ish in-session preview: retrieve selfie only from already loaded ESS request state; do not persist in browser storage.
document.addEventListener('click',e=>{const btn=e.target.closest?.('.ess-selfie-open');if(!btn)return;const id=btn.dataset.selfieId;const r=essRequestState.attendance_requests?.['2']?.[id];if(!r||typeof r.selfieData!=='string'||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(r.selfieData))return;const overlay=document.createElement('div');overlay.className='ess-selfie-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');const img=document.createElement('img');img.src=r.selfieData;img.alt=hrText('صورة التحقق مكبرة','Enlarged verification selfie');img.style.cssText='max-width:min(92vw,850px);max-height:85vh;object-fit:contain;border-radius:15px';const close=document.createElement('button');close.type='button';close.textContent='✕';close.style.cssText='position:absolute;top:20px;right:20px;width:48px;height:48px;background:#172b46;color:white;border:1px solid #5a83a5;border-radius:12px';const dismiss=()=>{overlay.remove();document.removeEventListener('keydown',esc,true)};const esc=k=>{if(k.key==='Escape')dismiss()};document.addEventListener('keydown',esc,true);close.onclick=dismiss;overlay.onclick=k=>{if(k.target===overlay)dismiss()};overlay.append(img,close);document.body.append(overlay);close.focus()});
(function(){const st=document.createElement('style');st.textContent='.ess-selfie-open{border:0;background:transparent;cursor:zoom-in;padding:3px;border-radius:12px}.ess-selfie-thumb{width:72px;height:72px;object-fit:cover;border-radius:10px;transition:transform .2s,box-shadow .2s}.ess-selfie-open:hover .ess-selfie-thumb,.ess-selfie-open:focus-visible .ess-selfie-thumb{transform:scale(2.3);box-shadow:0 12px 35px #000a;position:relative;z-index:10}.ess-selfie-overlay{position:fixed;inset:0;z-index:2147483647;background:#020617ee;display:flex;align-items:center;justify-content:center;padding:20px}';document.head.append(st)})();


/* FAHD 1 v8 - native, single-page Employee 360. No iframe, no separate HTML. */
const FAHD_FIELDS=[
 ['name','الاسم / Name',['اسم الموظف ','اسم الموظف','name','emp_name _en']],
 ['department','الإدارة / Department',['الإدارة ','الإدارة','department','department ','dept']],
 ['jobTitle','الوظيفة / Job title',['الوظيفة','الوظيفة ','jobTitle','job title ','job']],
 ['directManager','المدير المباشر / Manager',['المدير المباشر ','المدير المباشر','directManager','direct manager ']],
 ['hireDate','تاريخ التعيين / Hire date',['تاريخ التعيين ','تاريخ التعيين','hireDate','date_of_hiring ']],
 ['qualification','المؤهل / Qualification',['المؤهل','qualification']],
 ['dob','تاريخ الميلاد / Date of birth',['تاريخ الميلاد','dob']],
 ['insuranceStatus','الحالة التأمينية / Insurance',['الحالة التأمينية ','الحالة التأمينية','insuranceStatus','insurance status ']],
 ['pob','مكان الميلاد / Birthplace',['مكان الميلاد','pob']],
 ['phone','الهاتف / Phone',['phone','الهاتف']],
 ['address','العنوان / Address',['address','العنوان']],
 ['governorate','المحافظة / Governorate',['governorate','المحافظة']]
];
let fahdEditing=null, fahdBusy=false, fahdIsEditing=false;
const FAHD_TAB_NAMES={overview:['نظرة عامة','Overview'],personal:['البيانات الشخصية والوظيفية','Personal & Job'],financial:['المالية','Financial'],attendance:['الحضور','Attendance'],leaves:['الإجازات','Leaves'],performance:['الأداء','Performance']};
function fahdTranslateUI(){
 const tabIds=['overview','personal','financial','attendance','leaves','performance'];
 document.querySelectorAll('.fahd-tabs button').forEach((b,i)=>{const svg=b.querySelector('svg');b.replaceChildren();if(svg)b.append(svg);b.append(document.createTextNode(' '+fahdLang(...FAHD_TAB_NAMES[tabIds[i]])));});
 const buttons={'fahd-edit':['تعديل البيانات','Edit details'],'fahd-cancel':['إلغاء','Cancel'],'fahd-save':['حفظ التعديلات','Save changes'],'fahd-add':['إضافة حقل جديد','Add custom field'],'fahd-photo-change':['تغيير الصورة','Change photo'],'fahd-delete':['أرشفة الموظف','Archive employee']};
 for(const [id,pair] of Object.entries(buttons)){const b=document.getElementById(id);if(b)b.textContent=fahdLang(...pair);}
 const back=document.getElementById('fahd-back');if(back)back.textContent=fahdLang('← العودة للقائمة','← Back to list');
 document.querySelectorAll('.fahd-create-tabs button').forEach((b,i)=>{const key=['personal','financial','attendance','leaves','performance'][i];b.textContent=fahdLang(...FAHD_TAB_NAMES[key]);});
 const title=document.getElementById('fahd-create-title');if(title)title.textContent=fahdLang('إضافة موظف جديد','Add employee');
 const footer=document.querySelector('.fahd-create-footer');if(footer){const btns=footer.querySelectorAll('button');if(btns[0])btns[0].textContent=fahdLang('إلغاء','Cancel');if(btns[1])btns[1].textContent=fahdLang('حفظ الموظف','Save employee');}
}
function fahdTab(tab,button){document.querySelectorAll('.fahd-pane').forEach(x=>x.hidden=x.id!=='fahd-tab-'+tab);document.querySelectorAll('.fahd-tabs button').forEach(x=>x.classList.toggle('selected',x===button));}

// Complete employee profile: show every available spreadsheet/database field.
// Names are kept verbatim to preserve the live Firebase schema.
const FAHD_ALL_PROFILE_KEYS = ["اسم الموظف ", "emp_name _en", "الإدارة ", "department ", "الوظيفة", "job title ", "المدير المباشر ", "direct manager ", "تاريخ التعيين ", "date_of_hiring ", "المؤهل", "qualification", "جهة المؤهل ", "qulification issuing authority", "تاريخ الحصول على المؤهل ", "qualification date ", "تاريخ الميلاد", "dob", "السن حتى تاريخه ", "age to date", "النوع", "gender", "الحالة الإجتماعية ", "marital status ", "الحالة التأمينية ", "insurance status ", "الرقم التأمينى", "insurance number", "الرقم القومى ", "n_id", "سنوات الخدمة ", "years of service", "الأجر الشامل", "comprehensiveSalary", "أجر الاشتراك التأميني", "insuranceContributionWage", "رصيد الاجازات ", "annual leave balance", "العنوان ", "address", "المحافظة ", "governorate", "مكان الميلاد", "pob", "phone", "qualAuth"];
function fahdProfileKeyLabel(key){
 const labels={'n_id':'National ID','الرقم القومى ':'الرقم القومي','الرقم التأمينى':'الرقم التأميني','insurance number':'Insurance number','comprehensiveSalary':'Comprehensive salary','insuranceContributionWage':'Insurance contribution wage','annual leave balance':'Annual leave balance','emp_name _en':'Employee name','date_of_hiring ':'Hire date','age to date':'Age','dob':'Date of birth','years of service':'Years of service','direct manager ':'Direct manager','job title ':'Job title','insurance status ':'Insurance status','qualification date ':'Qualification date','qulification issuing authority':'Qualification authority','n_id':'National ID','address':'Address','governorate':'Governorate'};
 return labels[key]||key.trim().replace(/_/g,' ');
}
function fahdProfileLanguage(key){return /[\u0600-\u06FF]/.test(key)?'ar':'en';}
function fahdActualKey(emp,key){return Object.prototype.hasOwnProperty.call(emp,key)?key:Object.keys(emp).find(k=>k.trim()===key.trim())||key;}
function fahdIsMojibake(value){
 if(typeof value!=='string')return false;
 return /(?:ط§|ط¨|ط±|طھ|ط®|ظ„|ظ‚|ظ…|Ø|Ù|Ã|â€)/.test(value);
}
function fahdHasUnsavedChanges(){
 if(!fahdIsEditing||!fahdEditing)return false;
 return Array.from(document.querySelectorAll('#fahd-fields [data-fahd-key]')).some(input=>input.value!==(fahdEditing.original[input.dataset.fahdKey]??''));
}
// Styled three-choice dialog, created in JS so no HTML changes are needed.
function fahdUnsavedDialog(){
 return new Promise(resolve=>{
  const old=document.getElementById('fahd-unsaved-overlay');if(old)old.remove();
  const overlay=document.createElement('div');overlay.id='fahd-unsaved-overlay';
  overlay.setAttribute('role','presentation');
  overlay.style.cssText='position:fixed;inset:0;z-index:2147483000;background:rgba(2,10,23,.72);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:18px;';
  const card=document.createElement('section');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','fahd-unsaved-title');
  card.dir=currentLang==='ar'?'rtl':'ltr';
  card.style.cssText='width:min(100%,470px);border-radius:20px;padding:28px;background:var(--card-bg,var(--surface,#15243a));color:var(--text-primary,#f8fafc);border:1px solid rgba(125,165,205,.35);box-shadow:0 24px 70px rgba(0,0,0,.45);font-family:inherit;';
  // Detect light theme from the page rather than hard-coding a dark dialog.
  const bg=getComputedStyle(document.body).backgroundColor;const rgb=bg.match(/\d+/g);const light=rgb&&rgb.length>=3&&(+rgb[0]*.299 + +rgb[1]*.587 + +rgb[2]*.114)>165;
  if(light){card.style.background='#ffffff';card.style.color='#17243a';card.style.borderColor='#dbe5ef';}
  const icon=document.createElement('div');icon.textContent='✎';icon.style.cssText='width:44px;height:44px;display:grid;place-items:center;border-radius:12px;background:rgba(14,165,233,.14);color:#38bdf8;font-size:25px;margin-bottom:16px;';
  const title=document.createElement('h2');title.id='fahd-unsaved-title';title.textContent=fahdLang('تعديلات غير محفوظة','Unsaved changes');title.style.cssText='font-size:21px;font-weight:750;margin:0 0 10px;';
  const msg=document.createElement('p');msg.textContent=fahdLang('لقد عدّلت بيانات الموظف. ماذا تريد أن تفعل قبل الخروج؟','You have edited employee details. What would you like to do before leaving?');msg.style.cssText='font-size:14px;line-height:1.9;opacity:.85;margin:0 0 24px;';
  const buttons=document.createElement('div');buttons.style.cssText='display:flex;flex-wrap:wrap;gap:9px;';
  let done=false;const finish=value=>{if(done)return;done=true;document.removeEventListener('keydown',onKey,true);overlay.remove();resolve(value);};
  const make=(label,value,css)=>{const btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.style.cssText='border-radius:11px;padding:11px 15px;font:600 14px inherit;cursor:pointer;flex:1 1 125px;'+css;btn.onclick=()=>finish(value);buttons.append(btn);return btn;};
  const save=make(fahdLang('حفظ وخروج','Save & leave'),'save','background:#0284c7;color:white;border:1px solid #0284c7;');
  make(fahdLang('خروج دون حفظ','Discard & leave'),'discard','background:transparent;color:inherit;border:1px solid #d97706;');
  make(fahdLang('متابعة التعديل','Keep editing'),'stay','background:transparent;color:inherit;border:1px solid rgba(130,150,175,.55);');
  card.append(icon,title,msg,buttons);overlay.append(card);document.body.append(overlay);
  const onKey=e=>{if(e.key==='Escape'){e.preventDefault();finish('stay');}};document.addEventListener('keydown',onKey,true);save.focus();
 });
}
async function fahdGuardNavigation(continueNavigation){
 if(window.fahdGuardActive)return;
 if(!fahdHasUnsavedChanges()){continueNavigation();return;}
 window.fahdGuardActive=true;
 try{
  const choice=await fahdUnsavedDialog();
  if(choice==='stay')return;
  if(choice==='save'){const saved=await fahdSave(true);if(!saved)return;}
  if(choice==='discard'){fahdIsEditing=false;}
  window.fahdNavigationApproved=true;
  try{continueNavigation();}finally{window.fahdNavigationApproved=false;}
 }finally{window.fahdGuardActive=false;}
}
window.addEventListener('beforeunload',event=>{
 if(fahdHasUnsavedChanges()){event.preventDefault();event.returnValue='';}
});
function fahdRenderCompleteFields(emp,fields){
 const shown=new Set();
 for(const schemaKey of [...FAHD_ALL_PROFILE_KEYS,...Object.keys(emp)]){
  if(['code','الكود','photoUrl','photo','password','authUid','hr_custom_fields','_firebasePath'].includes(schemaKey)||schemaKey.startsWith('_'))continue;
  const key=fahdActualKey(emp,schemaKey);
  if(shown.has(key)||typeof emp[key]==='object'&&emp[key]!==null)continue;
  shown.add(key);
  const lang=fahdProfileLanguage(key);
  const card=document.createElement('div');card.className='fahd-field';card.dataset.fieldLanguage=lang;
  const label=document.createElement('label');label.textContent=fahdProfileKeyLabel(key)+' ('+lang.toUpperCase()+')';
  const input=document.createElement('input');input.type='text';input.dataset.fahdKey=key;
  input.value=fahdIsMojibake(emp[key])?'':String(emp[key]??'');input.disabled=true;input.maxLength=2000;
  if(/(?:^n_id$|الرقم القومى|الرقم التأمينى|insurance number)/.test(key))input.autocomplete='off';
  card.append(label,input);fields.append(card);fahdEditing.original[key]=input.value;
 }
}
function fahdRender(emp){
 const root=document.getElementById('fahd1-native');if(!root||!emp)return;
 const code=getEmployeeCode(emp);fahdEditing={code,path:emp._firebasePath,keys:{},original:{}};
 const name=getEmployeeName(emp),dept=getEmployeeDept(emp),job=getEmployeeJob(emp);
 document.getElementById('fahd-name').textContent=name||'Employee 360°';document.getElementById('fahd-identity').textContent=[dept,job].filter(Boolean).join(' · ');document.getElementById('fahd-code').textContent='# '+code;
 const photo=document.getElementById('fahd-photo');const image=getField(emp,'photoUrl','photo','رابط الصورة','PHOTO URL');photo.src=typeof image==='string' && (/^data:image\//.test(image)||/^https:\/\//.test(image))?image:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="#102a46"/><circle cx="60" cy="44" r="23" fill="#5a9bc2"/><path d="M15 120c0-58 90-58 90 0" fill="#5a9bc2"/></svg>');
 fahdTranslateUI();
 const summary=document.getElementById('fahd-summary');summary.replaceChildren();
 for(const [label,value] of [[fahdLang('الكود','Employee code'),code],[fahdLang('الموظف','Employee'),name],[fahdLang('الإدارة','Department'),dept],[fahdLang('الوظيفة','Job title'),job],[fahdLang('تاريخ التعيين','Hire date'),getHireDate(emp)],[fahdLang('الحالة التأمينية','Insurance'),currentLang==='ar'?(emp['الحالة التأمينية ']??emp['الحالة التأمينية']):emp['insurance status ']]]){
  const tile=document.createElement('div');tile.className='fahd-tile';const l=document.createElement('span'),v=document.createElement('strong');l.textContent=label;v.textContent=String(value??'—')||'—';tile.append(l,v);summary.append(tile);
 }
 const fields=document.getElementById('fahd-fields');fields.replaceChildren();
 fahdRenderCompleteFields(emp,fields);
 fahdRefreshFieldVisibility();fahdEnableDropdowns();
 const fin=document.getElementById('fahd-financial');fin.replaceChildren();const financial=emp.financial;
 if(financial&&typeof financial==='object'){for(const [k,v] of Object.entries(financial)){if(v===null||typeof v==='object')continue;const tile=document.createElement('div');tile.className='fahd-tile';const l=document.createElement('span'),strong=document.createElement('strong');l.textContent=k;strong.textContent=String(v);tile.append(l,strong);fin.append(tile);}fin.className='fahd-summary';}
 else {fin.className='fahd-empty';fin.textContent=fahdLang('لا توجد بيانات مالية متصلة بعد.','No connected financial data yet.');}
 fahdSetEditing(false);document.getElementById('fahd-status').textContent='';
 fahdTab('overview',document.querySelector('.fahd-tabs button'));
}
function fahdRefreshFieldVisibility(){
 document.querySelectorAll('#fahd-fields [data-field-language]').forEach(w=>{
  const lang=w.dataset.fieldLanguage;w.hidden=!fahdIsEditing&&lang!=='common'&&lang!==currentLang;
  const label=w.querySelector('label[data-label-ar]');if(label)label.textContent=fahdLang(label.dataset.labelAr,label.dataset.labelEn);
 });
}
async function fahdSave(skipConfirm=false){
 if(fahdBusy||!fahdEditing)return;const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(fahdEditing.code));const status=document.getElementById('fahd-status');
 if(!emp||!fahdEditing.path||emp._firebasePath!==fahdEditing.path||!fahdEditing.path.startsWith('employees_v2/')){status.textContent=fahdLang('تعذر تحديد السجل','Employee record unavailable');return false;}
 const updates={};document.querySelectorAll('#fahd-fields [data-fahd-key]').forEach(input=>{
  const key=input.dataset.fahdKey;if(input.value===fahdEditing.original[key])return;
  const value=input.type==='date'?fahdStoredDate(input.value):input.value.trim();updates[key]=value;
  // Each translated field is independent; never overwrite its counterpart.
 });
 const dob=updates['تاريخ الميلاد'];if(dob){const age=fahdAge(dob);if(age){updates['السن حتى تاريخه ']=age;updates['age to date']=age;}}
 if(!Object.keys(updates).length){status.textContent=fahdLang('لا توجد تغييرات للحفظ','No changes to save');return true;}
 if(!skipConfirm && !await fahdDialog(fahdLang('حفظ التعديلات','Save changes'),fahdLang('هل تريد حفظ التغييرات؟','Save these changes?')))return false;
 fahdBusy=true;document.getElementById('fahd-save').disabled=true;
 try{await db.ref(fahdEditing.path).update(updates);Object.assign(emp,updates);renderTable(allEmployees);fahdRender(emp);status.textContent=fahdLang('✓ تم الحفظ','✓ Changes saved');if(!skipConfirm)await fahdDialog(fahdLang('تم الحفظ','Saved'),fahdLang('تم حفظ التعديلات بنجاح','Changes saved successfully'),'notice');return true;}
 catch(err){status.textContent=fahdLang('فشل الحفظ: ','Save failed: ')+(err?.message||'Permission denied');return false;}
 finally{fahdBusy=false;document.getElementById('fahd-save').disabled=false;}
}
function fahdSetEditing(on){fahdIsEditing=on;document.querySelectorAll('#fahd-fields [data-fahd-key]').forEach(el=>el.disabled=!on);fahdRefreshFieldVisibility();for(const [id,visible] of [['fahd-edit',!on],['fahd-save',on],['fahd-cancel',on]]){const el=document.getElementById(id);if(el)el.hidden=!visible;}}
function fahdStartEdit(){fahdSetEditing(true)}
async function fahdCancelEdit(){
 if(fahdHasUnsavedChanges()){
  const choice=await fahdUnsavedDialog();
  if(choice==='stay')return;
  if(choice==='save'){await fahdSave(true);return;}
 }
 document.querySelectorAll('#fahd-fields [data-fahd-key]').forEach(el=>el.value=fahdEditing?.original[el.dataset.fahdKey]??'');fahdSetEditing(false);
}
function fahdDialog(title,message,mode='confirm',fields=[]){return new Promise(resolve=>{const dialog=document.getElementById('fahd-dialog'),box=document.getElementById('fahd-dialog-inputs'),yes=document.getElementById('fahd-dialog-yes'),no=document.getElementById('fahd-dialog-no');document.getElementById('fahd-dialog-title').textContent=title;document.getElementById('fahd-dialog-message').textContent=message;box.replaceChildren();const inputs=fields.map(f=>{const el=document.createElement('input');el.placeholder=f;el.maxLength=1000;box.append(el);return el});no.hidden=mode==='notice';yes.textContent=mode==='notice'?fahdLang('حسنًا','OK'):fahdLang('تأكيد','Confirm');no.textContent=fahdLang('إلغاء','Cancel');dialog.hidden=false;const finish=ok=>{dialog.hidden=true;yes.onclick=null;no.onclick=null;document.removeEventListener('keydown',esc);resolve(ok?(inputs.length?inputs.map(x=>x.value):true):null)};const esc=e=>{if(e.key==='Escape')finish(false)};yes.onclick=()=>finish(true);no.onclick=()=>finish(false);document.addEventListener('keydown',esc);(inputs[0]||yes).focus()})}
async function fahdAddField(){
 if(fahdBusy||!fahdEditing?.path)return;
 const a=await fahdDialog(fahdLang('حقل مخصص','Custom field'),fahdLang('أدخل اسم المفتاح والقيمتين','Enter field key and both language values'),'confirm',[fahdLang('اسم المفتاح بالإنجليزية','English field key'),fahdLang('القيمة العربية','Arabic value'),'English value']);if(!a)return;
 const [key,ar,en]=a;if(!/^[A-Za-z][A-Za-z0-9_]{1,49}$/.test(key)||['password','role','permissions','authUid','code','photoUrl'].includes(key))return fahdDialog(fahdLang('اسم غير مسموح','Invalid key'),fahdLang('استخدم حروفًا إنجليزية وأرقامًا فقط','Use a safe English field key'),'notice');
 const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(fahdEditing.code));if(!emp||!fahdEditing.path||Object.hasOwn(emp,key)||Object.hasOwn(emp.hr_custom_fields||{},key))return fahdDialog(fahdLang('الحقل موجود','Field exists'),fahdLang('اختر اسمًا آخر','Choose another key'),'notice');
 const value={labelAr:key,labelEn:key,valueAr:ar||'',valueEn:en||''};try{await db.ref(fahdEditing.path+'/hr_custom_fields/'+key).set(value);emp.hr_custom_fields??={};emp.hr_custom_fields[key]=value;fahdRender(emp);await fahdDialog(fahdLang('تمت الإضافة','Added'),fahdLang('تم حفظ الحقل','Custom field saved'),'notice');}catch(e){await fahdDialog(fahdLang('فشل الحفظ','Save failed'),String(e.message||e),'notice');}
}

// FAHD v13: desktop-only image upload, preserving existing record fields.
async function fahdUploadPhoto(file,forNew=false){
 if(!file)return;
 if(!/^image\/(jpeg|png|webp)$/.test(file.type)){await fahdDialog(fahdLang('نوع ملف غير مدعوم','Unsupported image'),fahdLang('اختر JPG أو PNG أو WebP','Choose JPG, PNG or WebP'),'notice');return;}
 const img=new Image();const url=URL.createObjectURL(file);
 try{await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
  const canvas=document.createElement('canvas'),scale=Math.min(1,360/Math.max(img.naturalWidth,img.naturalHeight));canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
  const data=canvas.toDataURL('image/jpeg',.72);if(data.length>160000)throw new Error('Image exceeds safe size');
  if(forNew){window.fahdNewPhoto=data;const preview=document.getElementById('fahd-create-photo-preview');if(preview)preview.src=data;return;}
  const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(fahdEditing?.code));if(!emp||!fahdEditing?.path)throw new Error('Employee record unavailable');
  const confirmed=await fahdDialog(fahdLang('تغيير صورة الموظف','Change employee photo'),fahdLang('هل تريد حفظ الصورة الجديدة؟','Save the new photo?'));if(!confirmed)return;
  const key=Object.hasOwn(emp,'photoUrl')?'photoUrl':Object.hasOwn(emp,'photo')?'photo':'photoUrl';
  await db.ref(fahdEditing.path).update({[key]:data});emp[key]=data;fahdRender(emp);
 }catch(e){await fahdDialog(fahdLang('تعذر حفظ الصورة','Photo not saved'),String(e.message||e),'notice');}finally{URL.revokeObjectURL(url);}
}
function fahdPickPhoto(forNew=false){const input=document.createElement('input');input.type='file';input.accept='image/jpeg,image/png,image/webp';input.addEventListener('change',()=>fahdUploadPhoto(input.files?.[0],forNew),{once:true});input.click();}
function fahdNewExtraField(){const root=document.getElementById('fahd-new-custom');if(!root)return;const n=root.children.length+1;const card=document.createElement('div');card.className='fahd-entry';card.innerHTML=`<label>${fahdLang('حقل مخصص','Custom field')} ${n}</label><input data-custom-name placeholder="${fahdLang('اسم المفتاح بالإنجليزية','English field key')}" maxlength="50"><input data-custom-ar placeholder="${fahdLang('القيمة العربية','Arabic value')}" maxlength="1000"><input data-custom-en placeholder="English value" maxlength="1000">`;root.append(card);}
function fahdSelectOptions(id,language){const values=[...new Set(allEmployees.map(e=>String(id==='department'?(language==='ar'?(e['الإدارة ']??e['الإدارة']):(e['department ']??e.department)):(language==='ar'?e['الوظيفة']:(e['job title ']??e.jobTitle))||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,language==='ar'?'ar':'en'));return values;}
function fahdEnableDropdowns(){document.querySelectorAll('#add-employee-fields input[data-add-key],#fahd-fields input[data-fahd-key]').forEach(input=>{const key=input.dataset.addKey||input.dataset.fahdKey;const id=['الإدارة ','department '].includes(key)?'department':['الوظيفة','job title '].includes(key)?'job':null;if(!id||input.dataset.dropdownReady)return;input.dataset.dropdownReady='1';const lang=/[\u0600-\u06ff]/.test(key)?'ar':'en';const listId='fahd-options-'+id+'-'+lang;let dl=document.getElementById(listId);if(!dl){dl=document.createElement('datalist');dl.id=listId;document.body.append(dl);}dl.replaceChildren();fahdSelectOptions(id,lang).forEach(v=>{const o=document.createElement('option');o.value=v;dl.append(o)});input.setAttribute('list',listId);input.title=fahdLang('اختر من القائمة أو اكتب قيمة جديدة','Select an option or type a new value');});}


// NEON V7: approved visual composition, strictly computed from loaded employees_v2.
// Base dashboard is explicitly named to prevent recursive function hoisting.


// Dashboard 2026-10-28: one renderer, no sample employee counts.
function renderRichDashboard(){
 const root=document.getElementById('hr-dashboard-view');if(!root)return;
 const T=(a,b)=>currentLang==='ar'?a:b;
 const E=x=>escapeHtml(String(x??''));
 const emp=allEmployees||[],total=emp.length;
 const field=(o,...names)=>{for(const n of names){const v=Object.entries(o||{}).find(([k])=>k.trim().toLowerCase()===n.trim().toLowerCase());if(v&&String(v[1]??'').trim())return v[1]}return ''};
 const group=fn=>{const map=new Map();emp.forEach(e=>{const k=String(fn(e)||'').trim();if(k&&k!=='--')map.set(k,(map.get(k)||0)+1)});return [...map].sort((a,b)=>b[1]-a[1])};
 const departments=group(getEmployeeDept),qual=group(e=>currentLang==='en'?(field(e,'qualification','qualification_en','qualification english')||field(e,'المؤهل')):(field(e,'المؤهل')||field(e,'qualification')));
 const sex=e=>String(field(e,'النوع','الجنس','gender','gender_en','Gender')).trim().toLowerCase();
 const male=emp.filter(e=>/^(ذكر|male|m|man)$/.test(sex(e))).length,female=emp.filter(e=>/^(أنثى|انثى|female|f|woman)$/.test(sex(e))).length,sexKnown=male+female;
 const years=e=>{const raw=field(e,'سنوات الخدمة','years of service','yearsService');const n=Number(raw);if(String(raw).trim()&&Number.isFinite(n)&&n>=0&&n<80)return n;const date=new Date(getHireDate(e));return Number.isFinite(date.getTime())?(Date.now()-date.getTime())/31557600000:null};
 const tenure=emp.map(years).filter(x=>x!==null&&x>=0&&x<80),avgTenure=tenure.length?(tenure.reduce((a,b)=>a+b,0)/tenure.length).toFixed(1):'—';
 const ages=emp.map(e=>{const raw=field(e,'تاريخ الميلاد','date of birth','birthDate','dob');const dt=typeof raw==='number'?new Date((raw-25569)*86400000):new Date(raw);return Number.isFinite(dt.getTime())?(Date.now()-dt.getTime())/31557600000:null}).filter(n=>n!==null&&n>16&&n<100);
 const avgAge=ages.length?Math.round(ages.reduce((a,b)=>a+b,0)/ages.length):'—';
 const dates=group(e=>{const d=getHireDate(e);return String(d).match(/(?:19|20)\d{2}/)?.[0]||''}).sort((a,b)=>a[0].localeCompare(b[0]));
 const governorates=hrGovernorates.map((g,i)=>({name:currentLang==='ar'?g[1]:g[0],n:emp.filter(e=>hrGovIndex(hrGeoField(e))===i).length,i}));const mapped=governorates.reduce((a,b)=>a+b.n,0);
 const insurance=group(e=>field(e,'الحالة التأمينية','insurance status','insuranceStatus'));
 const marital=group(e=>field(e,'الحالة الاجتماعية','marital status','maritalStatus'));
 const serviceBins=[[T('0–5 سنوات','0–5 years'),0],[T('6–10','6–10'),0],[T('11–15','11–15'),0],[T('16–20','16–20'),0],[T('21–25','21–25'),0],[T('26–30','26–30'),0],[T('30+','30+'),0]];
 tenure.forEach(n=>serviceBins[Math.min(6,Math.floor(Math.max(0,n)/5))][1]++);
 const recent=[...emp].filter(e=>{const d=new Date(getHireDate(e));return Number.isFinite(d.getTime())}).sort((a,b)=>new Date(getHireDate(b))-new Date(getHireDate(a))).slice(0,5);
 const icon=(name)=>hrSvgIcon(name,'lm-kpi-icon');
 const card=(ar,en,body,cl='')=>`<section class="lm-card ${cl}"><div class="lm-heading">${E(T(ar,en))}<small>${E(en)}</small></div>${body}</section>`;
 const stat=(ar,en,n,unit,ic)=>`<section class="lm-card"><div class="lm-stathead">${icon(ic)}<div class="lm-heading">${E(T(ar,en))}<small>${E(en)}</small></div></div><div class="lm-value">${E(n)}</div><div class="lm-unit">${E(unit)}</div></section>`;
 const bar=(rows,limit=12)=>{const items=rows.slice(0,limit),max=Math.max(1,...items.map(x=>x[1]));return `<div class="lm-bars">${items.map(([label,n])=>`<div class="lm-bar" title="${E(label)}: ${n}"><b>${n}</b><i style="height:${Math.max(3,n/max*105)}px"></i><small>${E(label)}</small></div>`).join('')}</div>`};
 const person=`<svg class="lm-person" viewBox="0 0 16 26" aria-hidden="true"><circle cx="8" cy="3.5" r="3"/><path d="M5 8h6l2 8-2.5 1-1-5V25h-3v-8H6V25H3V12l-1 5-2-1 2-8z"/></svg>`;
 const genderDots=[];const radius=104;for(let row=0;row<13;row++){const y=18+row*16;for(let col=0;col<13;col++){const x=18+col*16;if(Math.hypot(x-114,y-114)<radius-6)genderDots.push([x,y]);}}
 const femDots=Math.round(genderDots.length*female/Math.max(1,sexKnown));
 const genderSvg=`<svg class="lm-gender-orb" viewBox="0 0 228 228" aria-label="${T('توزيع النوع','Gender distribution')}"><defs><radialGradient id="lmGenderGlow"><stop stop-color="#113a62"/><stop offset="1" stop-color="#07172c"/></radialGradient></defs>${genderDots.map(([x,y],i)=>`<g transform="translate(${x-4.4} ${y-7.1}) scale(.55)" fill="${i<femDots?'#fb4bdc':'#05caff'}" style="filter:drop-shadow(0 0 2px ${i<femDots?'#fb4bdc':'#05caff'})"><circle cx="8" cy="3.5" r="3"/><path d="M5 8h6l2 8-2.5 1-1-5V25h-3v-8H6V25H3V12l-1 5-2-1 2-8z"/></g>`).join('')}</svg>`;
 const gender=sexKnown?`<div class="lm-gender-body">${genderSvg}<div class="lm-gender-stats"><strong class="female">${Math.round(female/sexKnown*100)}%</strong>${T('إناث','Female')} · ${female}<strong>${Math.round(male/sexKnown*100)}%</strong>${T('ذكور','Male')} · ${male}</div></div>`:`<div class="lm-blank">${T('بيانات النوع غير متاحة','Gender data unavailable')}</div>`;
 const palette=['#00c7fa','#7767ff','#ffae45','#ee39d4','#21d7bc'];
 const ring=(rows,known)=>{const shown=rows.slice(0,5);let pos=0;const gradient=shown.map(([_,n],i)=>{const start=pos;pos+=n/Math.max(1,known)*100;return `${palette[i]} ${start}% ${pos}%`}).join(',');return `<div class="lm-ringwrap"><div class="lm-ring" style="background:conic-gradient(${gradient||'#203552 0% 100%'},#203552 ${pos}% 100%)"><b title="${E(rows[0]?.[0]||'')}">${known?Math.round(rows[0][1]/known*100):0}%<small>${E(rows[0]?.[0]||'')}</small></b></div><div class="lm-legend">${shown.map(([label,n],i)=>`<div><i style="background:${palette[i]}"></i><span title="${E(label)}">${E(label)}</span><b>${n}</b></div>`).join('')}</div></div>`};
 const orgRows=departments.slice(0,12),left=orgRows.filter((_,i)=>i%2===0),right=orgRows.filter((_,i)=>i%2===1);
 const orgSide=(rows,side)=>`<div class="lm-orgside ${side}">${rows.map(([name,n])=>`<div class="lm-orgitem" title="${E(name)}"><span>${E(name)}</span><b>${n}</b></div>`).join('')}</div>`;
 const orgCurves=Array.from({length:6},(_,i)=>{const y=19+i*40;return `<path d="M 44 121 Q 39 ${y} 35 ${y}"/><path class="r" d="M 56 121 Q 61 ${y} 65 ${y}"/>`}).join('');
 const org=`<div class="lm-org">${orgSide(left,'left')}<div class="lm-orgcenter"><img class="lm-orglogo" src="logo.png" alt="Lacto Misr"></div>${orgSide(right,'right')}<svg class="lm-orgsvg" viewBox="0 0 100 242" preserveAspectRatio="none">${orgCurves}</svg></div>`;
 const hire=dates.slice(-12),maxH=Math.max(1,...hire.map(x=>x[1]));const pts=hire.map(([_,n],i)=>[18+i*560/Math.max(1,hire.length-1),155-n/maxH*118]);const line=pts.map(p=>p.join(',')).join(' ');
 const trend=hire.length>1?`<svg class="lm-spark" viewBox="0 0 600 175" preserveAspectRatio="none"><defs><linearGradient id="lmGrad" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#8c4bff" stop-opacity=".4"/><stop offset="1" stop-color="#004ad5" stop-opacity="0"/></linearGradient></defs><path d="M ${pts.map(p=>p.join(' ')).join(' L ')} L 578 165 L 18 165 Z" fill="url(#lmGrad)"/><polyline points="${line}" fill="none" stroke="#13d8ff" stroke-width="3"/>${pts.map((p,i)=>`<g><title>${E(hire[i][0])}: ${hire[i][1]} ${T('تعيين','hires')}</title><circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#fff"/></g>`).join('')}</svg><div class="lm-trend-axis">${hire.map(([year,n])=>`<span title="${year}: ${n}"><b>${year}</b><small>${n}</small></span>`).join('')}</div><div class="lm-note">${T('عدد التعيينات حسب سنة التعيين (وليس إجمالي الموظفين التاريخي)','Hires by hiring year (not historical headcount)')}</div>`:`<div class="lm-blank">${T('بيانات التعيين غير كافية','Insufficient hiring data')}</div>`;
 const egypt=`<div class="lm-geo-controls"><label for="lm-gov-slicer">${T('المحافظة','Governorate')}</label><select id="lm-gov-slicer" onchange="lmFilterGovernorate(this.value)"><option value="">${T('كل المحافظات','All governorates')}</option>${governorates.map(g=>`<option value="${g.i}">${E(g.name)} (${g.n})</option>`).join('')}</select></div><div class="lm-mapbody lm-egypt-real"><svg id="hr-real-egypt-map" viewBox="0 0 540 500" role="img" aria-label="${T('خريطة محافظات مصر','Egypt governorates map')}"><text x="270" y="245" text-anchor="middle" fill="#8fdcff" font-size="17">${T('جار تحميل المحافظات','Loading governorates')}</text></svg><div class="lm-geo-tooltip" id="hr-geo-tooltip">${T('مرر المؤشر على المحافظة لمعرفة عدد الموظفين','Hover over a governorate to see employee count')} · ${mapped}/${total}</div></div>`;
 const world=`<div class="lm-mapbody lm-world-real"><img src="world-map.svg" alt="${T('خريطة العالم','World map')}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><p class="lm-map-missing" hidden>${T('ملف world-map.svg غير موجود بجانب البورتال — ضعه بجانب index.html','world-map.svg is missing — place it beside index.html')}</p><div class="lm-geo-tooltip">${T('جميع الموظفين المسجلين في مصر؛ لا توجد بيانات توزيع دولي','Recorded employees are in Egypt; no international distribution available')}</div></div>`;
 const notifications=`<div class="lm-notifications"><div class="lm-notify-count" id="lm-notification-count">—</div><div class="lm-notify-label" id="lm-notification-label">${T('يلزم اتصال إدارة ESS لقراءة الطلبات المعلقة','Connect ESS admin to read pending requests')}</div><button type="button" onclick="showHRPage('notifications')">${T('فتح الإشعارات والطلبات','Open notifications and requests')} ↗</button></div>`;
 root.innerHTML=`<div class="lm-board"><div class="lm-row lm-top">${stat('إجمالي الموظفين','Total Employees',total,T('موظف','Employees'),'users')}${stat('عدد الإدارات','Total Departments',departments.length,T('إدارة','Departments'),'building')}${stat('متوسط سنوات الخدمة','Average Service Years',avgTenure,T('سنة','Years'),'clock')}${stat('متوسط العمر','Average Age',avgAge,T('سنة','Years'),'users')}<section class="lm-card lm-attendance"><div class="lm-heading">${T('معدل الحضور العام','Attendance Rate')}<small>Attendance Rate</small></div><div class="lm-blank">${T('بانتظار ربط بيانات الحضور الفعلية','Awaiting verified attendance data')}</div></section></div><div class="lm-row lm-middle">${card('توزيع الموظفين حسب النوع','Employees by Gender',gender)}${card('توزيع الموظفين حسب الإدارات','Employees by Departments',org)}${card('التوزيع الجغرافي (العالم)','Employees by Country',world)}${card('التوزيع الجغرافي في مصر','Employees in Egypt',egypt)}</div><div class="lm-row lm-charts">${card('عدد الموظفين حسب الإدارات','Employees by Department',bar(departments))}${card('تطور عدد الموظفين','Employees Trend',trend)}${card('المؤهلات العلمية','Qualifications',ring(qual,qual.reduce((s,x)=>s+x[1],0)))}</div><div class="lm-row lm-bottom">${card('حالة التأمين','Insurance Status',ring(insurance,insurance.reduce((s,x)=>s+x[1],0)))}${card('الحالة الاجتماعية','Marital Status',ring(marital,marital.reduce((s,x)=>s+x[1],0)))}${card('سنوات الخدمة','Years of Service',bar(serviceBins,7))}${card('ملخص الإشعارات والطلبات','Requests & Notifications',notifications)}</div><div class="lm-note">${T('جميع الأرقام من بيانات الموظفين الحالية؛ الخرائط توضيحية وتظهر المحافظات المسجلة فقط.','All counts from current employee records; maps are illustrative and governorate markers use recorded values only.')}</div></div>`;
 if(typeof hrRenderGeographicEgypt==='function')hrRenderGeographicEgypt(governorates.map(g=>g.n));
 lmRefreshNotificationUI();
}

// Read-only ESS pending request badge; no new Firebase writes or authentication bypass.
let lmEssBadgeRefs=[];let lmEssBadgeValues={};let lmEssBadgeErrors=new Set();
function lmPendingStatus(path,req){const s=String(req?.verificationStatus??req?.status??'').toUpperCase();return path==='attendance_requests'?(s==='PENDING_REVIEW'||s==='HELD'):(s==='PENDING'||s==='PENDING_REVIEW');}
function lmRefreshNotificationUI(){
 const connected=typeof essPilotReady==='function'&&essPilotReady();
 const badge=document.getElementById('lm-header-badge'),count=document.getElementById('lm-notification-count'),label=document.getElementById('lm-notification-label');
 if(!connected){if(badge)badge.hidden=true;if(count)count.textContent='—';if(label)label.textContent=hrText('اتصل بحساب إدارة ESS لعرض الطلبات','Connect ESS admin to see pending requests');return;}
 const total=Object.values(lmEssBadgeValues).reduce((n,records)=>n+Object.values(records||{}).reduce((s,requests)=>s+Object.values(requests||{}).filter(Boolean).filter(req=>lmPendingStatus(Object.keys(lmEssBadgeValues).find(k=>lmEssBadgeValues[k]===records),req)).length,0),0);
 if(badge){badge.hidden=total===0;badge.textContent=total>99?'99+':String(total)}
 if(count)count.textContent=lmEssBadgeErrors.size?'—':String(total);
 if(label)label.textContent=lmEssBadgeErrors.size?hrText('تعذر قراءة بعض الطلبات','Some request sources unavailable'):hrText('طلبات معلقة للمراجعة','Pending requests for review');
}
function lmStartESSBadge(){
 lmEssBadgeRefs.forEach(([ref,cb])=>ref.off('value',cb));lmEssBadgeRefs=[];lmEssBadgeValues={};lmEssBadgeErrors.clear();
 if(typeof essPilotReady!=='function'||!essPilotReady()){lmRefreshNotificationUI();return;}
 for(const [path] of essPaths){const ref=essDb.ref(path);const cb=s=>{lmEssBadgeValues[path]=s.val()||{};lmEssBadgeErrors.delete(path);lmRefreshNotificationUI()};ref.on('value',cb,()=>{lmEssBadgeErrors.add(path);lmRefreshNotificationUI()});lmEssBadgeRefs.push([ref,cb]);}
}
essAuth.onAuthStateChanged(()=>lmStartESSBadge());

function lmEnglishField(emp,...keys){for(const key of keys){const match=Object.entries(emp||{}).find(([k,v])=>k.trim().toLowerCase()===key.trim().toLowerCase()&&String(v??'').trim());if(match)return String(match[1]).trim()}return ''}
function lmUpdateHeaderIdentity(){
 const emp=(allEmployees||[]).find(e=>String(getEmployeeCode(e))===String(currentUserData?.code||PORTAL_ADMIN_CODE));
 const name=document.getElementById('lm-header-name'),job=document.getElementById('lm-header-job'),photo=document.getElementById('lm-header-photo'),flag=document.getElementById('lm-role-flag');
 if(name)name.textContent=emp?(currentLang==='en'?(lmEnglishField(emp,'emp_name _en','employee_name_en','name_en','english name','name')||'—'):getEmployeeName(emp)):hrText('مسؤول النظام','System Admin');
 if(job)job.textContent=emp?(currentLang==='en'?(lmEnglishField(emp,'job title ','job_title_en','jobTitleEn','jobTitle')||'—'):getEmployeeJob(emp)):hrText('مدير النظام','System Administrator');
 const url=emp?getField(emp,'photoUrl','photo','الصورة','رابط الصورة'):'';
 if(photo){if(typeof url==='string'&&(/^(https:\/\/|data:image\/(png|jpeg|webp);base64,)/i).test(url)){photo.src=url;photo.hidden=false;photo.parentElement?.classList.add('has-photo')}else{photo.hidden=true;photo.parentElement?.classList.remove('has-photo');}}
 // Flag represents server-verified Portal role only. No client-controlled privilege escalation.
 if(flag){flag.style.color=portalIsAdmin()?'#ff4268':'#3aa8ff';flag.title=portalIsAdmin()?hrText('صلاحية مدير النظام','System administrator role'):hrText('صلاحية المستخدم','User role');}
}

// Read-only governorate slicer: highlights an existing map feature, never edits records.
function lmFilterGovernorate(value){
 const svg=document.getElementById('hr-real-egypt-map');if(!svg)return;
 const idx=value===''?-1:Number(value);const selected=idx<0?'':hrNormalize(currentLang==='ar'?hrGovernorates[idx]?.[1]:hrGovernorates[idx]?.[0]);
 let count=0;svg.querySelectorAll('.hr-egypt-region').forEach(path=>{
  const match=idx<0||hrGovIndex(path.dataset.geoName)===idx;path.style.opacity=match?'1':'.14';
  if(idx>=0&&match)count=Number(path.dataset.geoCount||0);
 });
 const label=document.getElementById('hr-geo-tooltip');
 if(label&&idx>=0)label.textContent=(currentLang==='ar'?hrGovernorates[idx][1]:hrGovernorates[idx][0])+' — '+count+' '+hrText('موظف','employees');
 if(label&&idx<0)label.textContent=hrText('اختر محافظة أو مرر المؤشر لعرض عدد الموظفين','Select or hover over a governorate to view employee count');
}
