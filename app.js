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
const PORTAL_LEGACY_PILOT_CODE = '950';
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
    const [v2Snap, pilotSnap] = await Promise.all([
        db.ref(PORTAL_EMPLOYEE_COLLECTION).once('value'),
        db.ref('employees/' + PORTAL_LEGACY_PILOT_CODE).once('value')
    ]);
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
    const pilot = pilotSnap.val();
    if (pilot && typeof pilot === 'object' && !byCode.has(PORTAL_LEGACY_PILOT_CODE) &&
        String(getField(pilot,'code','الكود','employeeCode')) === PORTAL_LEGACY_PILOT_CODE) {
        records.push(portalSafeRecord(pilot, PORTAL_LEGACY_PILOT_CODE, 'employees/' + PORTAL_LEGACY_PILOT_CODE));
    }
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
    portalInitialized = true;
    await loadEmployeesFromFirebase();
}
async function handleLogout() {
    localStorage.removeItem('lacto_saved_pass');
    localStorage.removeItem('lacto_saved_code');
    sessionStorage.removeItem('lacto_active_code');
    await portalAuth.signOut();
    window.location.reload();
}

async function loadEmployeesFromFirebase() {
    const tableBody = document.getElementById('employees-table-body');
    if (tableBody) tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">${tr('loading')}</td></tr>`;
    try {
        allEmployees = await readEmployeeSources();
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
function backToEmployeesList(){if (typeof showHRPage === 'function' && hrActivePage !== 'employees') showHRPage('employees');activeEmployeeCode=null;const profile=document.getElementById('employee-profile-view');const list=document.getElementById('employees-list-view');if(profile){profile.classList.add('hidden');profile.style.display='none';}if(list){list.classList.remove('hidden');list.style.display='block';}}

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
 ['address','العنوان','Address','address','address','text'],
 ['governorate','المحافظة','Governorate','governorate','governorate','text']
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
function hrGovIndex(value){const s=hrNormalize(value);if(!s)return -1;return hrGovernorates.findIndex(([en,ar])=>s===hrNormalize(en)||s===hrNormalize(ar)||s.includes(hrNormalize(ar))||s.includes(hrNormalize(en)))}
function hrGeoField(emp){return getField(emp,'المحافظة','محافظة','محافظة السكن','محافظة الإقامة','محل الإقامة','العنوان','governorate','Governorate','governorate_name','province','city','residence','address')}
function hrPercent(a,b){return b?Math.round(a/b*100):0}
function hrSvgIcon(kind,extra=''){const paths={users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 6a3 3 0 0 1 0 6M19 15a5 5 0 0 1 2 4"/>',building:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h2m3 0h2M9 11h2m3 0h2M10 21v-5h4v5"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a20 20 0 0 0 18 0"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'};return `<svg class="${extra||'hr-stat-icon'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[kind]||paths.users}</svg>`} 
let hrStatIconCounter=0;
function hrStat(label,value,foot){const icon=['users','building','briefcase','clock','calendar','map'][(hrStatIconCounter++)%6];return `<div class="hr-panel">${hrSvgIcon(icon)}<div class="hr-stat-label">${escapeHtml(label)}</div><div class="hr-stat-value">${escapeHtml(String(value))}</div><div class="text-xs text-slate-500 mt-2">${escapeHtml(foot||'')}</div></div>`}
function hrPanel(title,content){return `<section class="hr-panel"><h2 class="font-bold text-sky-200 mb-5">${escapeHtml(title)}</h2>${content}</section>`}
function hrBars(rows,total,maxItems=9){const top=rows.slice(0,maxItems);return top.map(([name,count])=>`<div class="mb-3"><div class="flex justify-between gap-3 text-xs mb-1"><span class="truncate">${escapeHtml(name)}</span><span class="text-sky-300">${count} · ${hrPercent(count,total)}%</span></div><div class="hr-mini-track"><div class="hr-mini-fill" style="width:${hrPercent(count,total)}%"></div></div></div>`).join('')||`<p class="text-slate-400 text-sm">${hrText('لا توجد بيانات متاحة','No available data')}</p>`}
function hrToggleEgypt(open){const stage=document.getElementById('hr-map-stage');if(stage)stage.classList.toggle('is-zoomed',!!open)}
function hrDonut(rows,total){const palette=['#38bdf8','#a78bfa','#34d399','#fbbf24','#fb7185','#22d3ee'];let offset=0;const top=rows.slice(0,5);const segments=top.map(([name,n],i)=>{const p=total?n/total*100:0;const a=offset;offset+=p;return `${palette[i]} ${a}% ${offset}%`});if(offset<100)segments.push(`#243650 ${offset}% 100%`);return `<div class="hr-donut-layout"><div class="hr-donut" style="background:conic-gradient(${segments.join(',')||'#243650 0 100%'})"><div><b>${total}</b><small>${hrText('موظف','employees')}</small></div></div><div class="hr-donut-legend">${top.map(([name,n],i)=>`<div><i style="background:${palette[i]}"></i><span>${escapeHtml(name)}</span><b>${n}</b></div>`).join('')}</div></div>`}
function hrHorizontalBars(rows,total,limit=8){const max=Math.max(1,...rows.map(r=>r[1]));return rows.slice(0,limit).map(([name,n],i)=>`<div class="hr-hbar-row"><span title="${escapeHtml(name)}">${escapeHtml(name)}</span><div><i style="width:${Math.max(3,n/max*100)}%;background:${['#38bdf8','#a78bfa','#34d399','#fbbf24'][i%4]}"></i></div><b>${n}</b></div>`).join('')||hrText('لا توجد بيانات','No data')}
function renderRichDashboard(){
 const d=document.getElementById('hr-dashboard-view');if(!d)return;
 hrStatIconCounter=0;
 const total=allEmployees.length;
 const aggregate=(fn)=>{const m=new Map();allEmployees.forEach(e=>{const v=String(fn(e)||'').trim();if(v&&v!=='--')m.set(v,(m.get(v)||0)+1)});return [...m].sort((a,b)=>b[1]-a[1])};
 const depts=aggregate(getEmployeeDept),jobs=aggregate(getEmployeeJob);
 const insured=allEmployees.filter(e=>/insured|مؤمن|مومن/i.test(String(getField(e,'insurance status ','insurance status','insuranceStatus','الحالة التأمينية','الحاله التامينيه')||''))).length;
 const insuredKnown=allEmployees.filter(e=>String(getField(e,'insurance status ','insurance status','insuranceStatus','الحالة التأمينية','الحاله التامينيه')||'').trim()).length;
 const qualification=aggregate(e=>getField(e,'qualification ','qualification','المؤهل','المؤهل العلمي'));
 const hireYears=aggregate(e=>{const date=String(getHireDate(e)||'');return date.match(/(?:19|20)\d{2}/)?.[0]||''}).sort((a,b)=>a[0].localeCompare(b[0]));
 const recentYear=new Date().getFullYear();const recentHires=hireYears.filter(([y])=>Number(y)>=recentYear-4).reduce((s,[,v])=>s+v,0);
 const yearsService=allEmployees.map(e=>{const raw=getField(e,'years of service','years of service ','yearsService','سنوات الخدمة');const n=Number(raw);return raw!==''&&Number.isFinite(n)&&n>=0&&n<90?n:null}).filter(n=>n!==null);
 const avgService=yearsService.length?(yearsService.reduce((a,b)=>a+b,0)/yearsService.length).toFixed(1):'—';
 const counts=hrGovernorates.map(()=>0);let geoKnown=0,unmatched=0;
 allEmployees.forEach(e=>{const v=hrGeoField(e);if(!v)return;geoKnown++;const idx=hrGovIndex(v);if(idx>=0)counts[idx]++;else unmatched++});
 const mapped=counts.reduce((a,b)=>a+b,0),maxCount=Math.max(1,...counts);
 // Stylized Egypt geographic schematic; not a cadastral or official governorate boundary map.
 const coords=([, ,lat,lon])=>({x:40+(lon-24.5)*24,y:25+(32-lat)*34});
 const outline='M336.8,365.0 L241.6,365.0 L148.5,365.0 L52.0,365.0 L52.0,239.8 L52.0,118.9 L44.8,91.5 L51.0,70.5 L47.3,56.0 L56.0,39.6 L87.9,39.1 L111.0,48.1 L134.8,58.1 L145.9,63.4 L164.4,52.6 L174.3,42.9 L195.4,40.1 L212.5,44.4 L219.0,61.3 L224.6,50.1 L243.9,58.2 L262.6,60.1 L274.4,51.5 L274.4,51.5 L287.8,101.1 L290.1,110.0 L283.4,123.6 L278.2,149.3 L271.7,167.0 L266.1,172.9 L258.1,162.0 L247.3,146.8 L230.2,98.1 L227.7,101.1 L237.6,137.0 L252.4,171.2 L270.5,224.2 L279.4,242.6 L287.1,261.9 L308.6,299.5 L303.8,305.4 L304.6,327.5 L332.6,358.0 L336.8,365.0Z';
 const dots=hrGovernorates.map((g,i)=>{const {x,y}=coords(g),count=counts[i];const label=currentLang==='ar'?g[1]:g[0];return `<g class="hr-map-dot" tabindex="0" role="img" aria-label="${escapeHtml(label+': '+count)}" data-geo-name="${escapeHtml(label)}" data-geo-count="${count}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${count?7+7*count/maxCount:4}" fill="${count?'#38bdf8':'#334155'}" stroke="${count?'#bae6fd':'#475569'}" stroke-width="1.3" opacity="${count?'.95':'.8'}"/><title>${escapeHtml(label)}: ${count}</title></g>`}).join('');
 const geoList=hrGovernorates.map((g,i)=>[currentLang==='ar'?g[1]:g[0],counts[i]]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
 const yearMax=Math.max(1,...hireYears.map(x=>x[1]));
 const yearsHtml=`<div class="flex items-end gap-2 h-48 border-b border-slate-700 pb-2">${hireYears.slice(-12).map(([y,c])=>`<div class="flex-1 min-w-0 flex flex-col justify-end items-center h-full gap-1"><span class="text-[10px] text-sky-200">${c}</span><div class="w-full rounded-t-md bg-gradient-to-t from-sky-800 to-cyan-300" style="height:${Math.max(5,c/yearMax*80)}%"></div><span class="text-[9px] text-slate-400">${escapeHtml(y.slice(2))}</span></div>`).join('')}</div>`;
 d.innerHTML=`<div class="flex flex-wrap items-center justify-between gap-4 mb-6"><div><h1 class="text-3xl font-extrabold text-white">${hrText('مركز تحليلات الموارد البشرية','HR Intelligence Center')}</h1><p class="text-sm text-slate-400 mt-2">${hrText('مؤشرات فعلية من سجلات الموظفين المتاحة على Firebase','Live indicators from available Firebase employee records')}</p></div><span class="rounded-full border border-sky-400/30 px-4 py-2 text-xs text-sky-200">● Firebase · ${total} ${hrText('سجل','records')}</span></div>
 <div class="hr-stat-grid grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 mb-5">${hrStat(hrText('إجمالي الموظفين','Employees'),total,hrText('السجلات المحملة','Loaded records'))}${hrStat(hrText('الإدارات','Departments'),depts.length,hrText('إدارات مسجلة','Recorded departments'))}${hrStat(hrText('المسميات الوظيفية','Job titles'),jobs.length,hrText('وظائف مختلفة','Distinct roles'))}${hrStat(hrText('متوسط سنوات الخدمة','Average tenure'),avgService,hrText('حسب الحقول المتاحة','From available fields'))}${hrStat(hrText('تعيينات آخر 5 سنوات','Last 5 years hires'),recentHires,hrText('حسب تاريخ التعيين','By hire date'))}${hrStat(hrText('تغطية المحافظة','Location coverage'),hrPercent(mapped,total)+'%',hrText('محافظات أمكن تحديدها','Recognized governorates'))}</div>
 <div class="grid grid-cols-1 xl:grid-cols-5 gap-5 mb-5"><div class="xl:col-span-3">${hrPanel(hrText('خريطة توزيع الموظفين على محافظات مصر','Egypt employee distribution'),`<div class="hr-map-shell"><div class="hr-map-stage" id="hr-map-stage"><div class="hr-world" id="hr-world"><svg viewBox="0 0 660 330" preserveAspectRatio="none" role="img" aria-label="World map, Egypt highlighted" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hrWorldSea" x2="0" y2="1"><stop stop-color="#152b55"/><stop offset="1" stop-color="#0a1730"/></linearGradient></defs><rect x="1" y="1" width="658" height="328" rx="12" fill="url(#hrWorldSea)"/><g stroke="#62b9fa" stroke-opacity=".12" fill="none"><path d="M0 82H660M0 164H660M0 246H660M110 0V330M220 0V330M330 0V330M440 0V330M550 0V330"/></g><g fill="#7299e5" fill-opacity=".83" stroke="#9dc4ff" stroke-opacity=".15" stroke-width=".45"><path d="M645.0,206.9 L645.0,207.9 L643.9,208.4 L642.8,208.9 L642.5,208.1 L643.4,207.7 L644.0,207.6 L645.0,206.9ZM641.7,209.9 L642.2,209.5 L642.8,210.1 L642.5,211.2 L641.4,211.5 L640.4,211.2 L640.2,210.3 L640.9,209.6 L641.7,209.9ZM15.4,206.8 L15.1,207.8 L15.0,207.9 L15.0,206.9 L15.4,206.8Z"/><path d="M389.3,175.9 L389.6,176.2 L396.0,180.3 L396.1,181.5 L398.6,183.6 L397.8,186.1 L397.9,187.3 L399.0,188.0 L399.1,188.6 L398.6,189.8 L398.7,190.4 L398.6,191.4 L399.2,192.7 L399.9,194.7 L400.6,195.2 L400.6,195.2 L399.2,196.3 L397.2,197.1 L396.2,197.1 L395.6,197.7 L394.4,197.8 L393.9,198.0 L391.8,197.5 L390.5,197.6 L390.0,194.8 L389.4,193.9 L389.0,193.3 L387.3,192.9 L386.3,192.3 L385.2,192.0 L384.5,191.6 L383.8,191.1 L383.8,191.1 L382.8,188.5 L381.8,187.4 L381.5,186.2 L381.7,185.1 L381.3,183.2 L382.1,183.1 L382.7,182.4 L383.4,181.3 L383.8,180.9 L383.8,180.2 L383.4,179.8 L383.3,178.9 L383.3,178.9 L383.8,178.7 L383.9,177.5 L383.2,176.3 L383.8,176.1 L385.8,176.1 L389.3,175.9Z"/><path d="M314.8,117.3 L314.8,117.4 L314.8,117.8 L314.8,120.9 L309.1,120.8 L309.1,126.1 L307.5,126.3 L307.0,127.3 L307.4,130.3 L300.5,130.3 L300.1,131.0 L300.2,130.1 L300.2,130.1 L304.2,129.9 L304.4,129.2 L305.1,128.3 L305.7,125.4 L308.1,123.2 L308.9,120.6 L309.5,120.5 L310.1,118.9 L311.5,118.7 L312.2,118.9 L313.0,118.9 L313.5,118.5 L314.6,118.4 L314.6,117.3 L314.8,117.3Z"/><path d="M115.0,73.5 L114.8,73.5 L111.4,71.5 L110.2,70.6 L107.0,69.8 L106.0,68.0 L106.3,66.7 L104.0,65.9 L103.7,64.2 L101.6,62.7 L101.6,61.7 L101.6,61.7 L102.5,60.7 L102.5,59.4 L99.5,58.1 L97.7,55.7 L96.6,54.3 L95.0,53.3 L93.8,52.5 L92.9,51.4 L91.2,52.1 L89.5,53.2 L87.9,51.9 L86.7,51.0 L85.0,50.4 L83.3,50.4 L83.3,38.7 L83.3,31.1 L83.3,31.1 L86.5,31.6 L89.3,32.6 L91.1,32.8 L92.7,31.9 L94.8,31.3 L97.4,31.5 L100.0,30.6 L102.9,30.1 L104.1,31.0 L105.4,30.5 L105.8,29.5 L107.0,29.7 L109.9,31.6 L112.3,30.2 L112.5,31.7 L114.6,31.4 L115.3,30.8 L117.4,30.9 L120.1,31.8 L124.2,32.5 L126.6,32.9 L128.3,32.7 L130.7,33.8 L128.2,34.8 L131.4,35.2 L136.1,35.0 L137.6,34.6 L139.5,35.9 L141.4,34.8 L139.6,34.0 L140.7,33.3 L142.8,33.2 L144.2,33.0 L145.7,33.4 L147.4,34.6 L149.4,34.4 L152.5,35.3 L155.2,35.0 L157.7,35.0 L157.5,33.8 L159.1,33.4 L161.8,34.1 L161.8,36.0 L162.9,34.4 L164.3,34.5 L165.1,32.4 L163.2,31.1 L161.2,30.3 L161.3,28.1 L163.4,26.6 L165.7,26.9 L167.5,27.8 L169.8,30.1 L168.3,31.1 L171.5,31.5 L171.5,33.6 L173.9,32.0 L176.0,33.3 L175.4,34.9 L177.1,36.2 L179.0,34.8 L180.2,33.0 L180.3,30.7 L182.8,30.9 L185.4,31.2 L187.8,32.2 L187.9,33.2 L186.6,34.3 L187.8,35.4 L187.6,36.4 L184.1,37.9 L181.7,38.2 L179.9,37.6 L179.4,38.6 L177.7,40.3 L177.2,41.2 L175.2,42.6 L172.6,42.7 L171.3,43.6 L171.2,44.9 L169.1,45.2 L167.0,46.8 L165.1,49.2 L164.4,50.8 L164.3,53.2 L166.9,53.5 L167.7,55.4 L168.5,57.0 L170.9,56.6 L174.2,57.5 L175.9,58.2 L177.2,59.2 L179.4,59.8 L181.2,60.6 L184.1,60.7 L186.0,60.9 L185.7,62.7 L186.3,64.8 L187.5,67.1 L190.2,69.0 L191.5,68.4 L192.4,66.2 L191.5,63.0 L190.3,61.9 L193.1,61.0 L195.1,59.5 L196.1,58.1 L195.9,56.7 L194.7,55.0 L192.6,53.5 L194.7,51.3 L193.9,49.4 L193.3,46.2 L194.5,45.8 L197.5,46.3 L199.3,46.5 L200.8,46.0 L202.4,46.7 L204.6,47.9 L205.1,48.7 L208.2,48.8 L208.2,50.5 L208.7,53.1 L210.3,53.5 L211.6,54.7 L214.1,53.5 L215.8,51.3 L217.0,50.3 L218.3,52.1 L220.6,54.8 L222.6,57.2 L221.9,58.5 L224.2,59.7 L225.8,60.8 L228.5,61.4 L229.7,62.0 L230.4,63.8 L231.7,64.0 L232.4,64.8 L232.6,67.1 L231.3,67.9 L230.0,68.6 L227.1,69.3 L224.9,71.0 L222.0,71.3 L218.2,70.9 L215.6,70.9 L213.8,71.0 L212.3,72.5 L210.1,73.4 L207.6,76.1 L205.6,78.0 L207.1,77.7 L209.9,75.0 L213.5,73.3 L216.2,73.1 L217.7,74.1 L216.0,75.5 L216.6,77.7 L217.2,79.2 L219.4,80.2 L222.3,79.9 L224.1,77.6 L224.2,79.1 L225.3,79.9 L223.2,81.2 L219.3,82.4 L217.6,83.3 L215.6,84.7 L214.3,84.6 L214.2,82.8 L217.3,81.2 L214.5,81.2 L212.5,81.5 L211.4,80.3 L211.4,77.5 L210.6,76.9 L209.4,77.3 L208.8,76.7 L207.5,78.3 L207.0,79.9 L206.3,80.8 L205.6,81.1 L205.0,81.2 L204.9,81.7 L201.6,81.7 L199.0,81.7 L198.2,82.1 L196.3,83.6 L196.1,83.8 L195.6,84.6 L194.0,84.6 L192.2,84.6 L191.4,84.9 L191.7,85.3 L191.9,85.9 L191.9,86.1 L189.6,87.1 L187.8,87.5 L185.7,88.6 L185.3,88.6 L184.7,88.2 L184.5,87.9 L184.5,87.7 L184.9,87.0 L185.7,85.9 L186.3,84.7 L185.9,82.9 L185.5,81.0 L183.7,80.1 L183.9,79.7 L183.7,79.5 L183.2,79.5 L182.8,79.1 L182.8,78.6 L182.4,78.9 L181.9,78.8 L182.0,78.6 L181.6,78.4 L181.5,77.9 L180.1,77.2 L178.7,76.5 L177.0,75.7 L175.3,75.0 L173.8,75.6 L173.2,75.6 L171.0,75.0 L169.6,75.3 L167.9,74.7 L166.1,74.4 L164.9,74.2 L164.4,73.9 L164.1,72.8 L163.5,72.8 L163.5,73.5 L159.8,73.5 L153.9,73.5 L147.9,73.6 L142.7,73.5 L137.4,73.5 L132.2,73.5 L126.9,73.5 L125.2,73.5 L120.0,73.5 L115.0,73.5ZM183.0,46.0 L184.3,45.0 L186.7,45.0 L186.7,45.4 L184.6,46.6 L183.4,46.5 L183.0,46.0ZM190.4,24.8 L188.5,23.7 L188.5,22.9 L189.4,22.8 L193.4,23.0 L196.4,24.1 L196.6,24.7 L194.7,24.6 L192.8,24.6 L190.9,24.9 L190.4,24.8ZM189.4,46.7 L190.1,46.1 L190.8,46.2 L191.3,46.6 L190.6,47.7 L189.8,47.5 L189.4,46.9 L189.4,46.7ZM166.2,20.3 L165.2,21.1 L162.7,20.9 L160.6,20.4 L161.5,19.5 L164.0,18.9 L165.5,19.6 L166.2,20.3ZM165.8,15.1 L165.0,15.1 L161.7,15.0 L161.2,14.4 L164.8,14.5 L166.0,14.8 L165.8,15.1ZM160.7,12.5 L162.8,13.2 L162.3,14.0 L159.7,14.4 L158.3,13.9 L157.5,13.2 L157.4,12.3 L159.7,12.4 L160.7,12.5ZM175.7,21.5 L172.9,21.2 L168.3,20.6 L167.7,19.5 L167.4,18.4 L165.7,17.5 L162.1,17.3 L160.0,16.7 L160.7,15.8 L164.3,15.9 L166.2,16.6 L169.7,16.6 L171.2,17.3 L170.8,18.0 L172.8,18.5 L173.9,19.0 L176.3,19.1 L178.8,19.3 L181.6,18.8 L185.2,18.6 L188.0,18.8 L189.9,19.6 L190.3,20.4 L189.2,21.0 L186.6,21.4 L184.3,21.1 L179.3,21.5 L175.7,21.5ZM135.3,13.8 L137.8,14.1 L137.2,14.7 L133.9,15.3 L131.3,14.6 L132.7,14.0 L135.3,13.8ZM135.8,12.5 L138.1,12.9 L136.0,13.3 L133.1,13.3 L133.1,13.0 L134.9,12.4 L135.8,12.5ZM232.7,68.8 L231.8,70.1 L230.6,71.9 L231.7,71.2 L232.9,71.6 L232.3,72.3 L233.9,72.9 L234.7,72.4 L236.4,73.0 L235.9,74.5 L237.1,74.2 L237.3,75.3 L237.9,76.6 L237.1,78.4 L236.3,78.4 L235.2,78.0 L235.6,76.4 L235.1,76.1 L233.0,77.9 L232.0,77.8 L233.2,76.9 L231.6,76.4 L229.7,76.5 L226.3,76.4 L226.0,75.8 L227.1,75.1 L226.3,74.5 L227.8,73.3 L229.6,70.0 L230.7,68.9 L232.2,68.2 L233.0,68.2 L232.7,68.8ZM183.2,40.5 L185.1,41.2 L187.1,41.9 L187.3,42.8 L188.6,42.7 L189.8,43.4 L188.3,44.0 L185.5,43.5 L184.6,42.6 L182.8,43.7 L180.3,44.7 L179.7,43.5 L177.4,43.7 L178.9,42.7 L179.1,41.1 L179.7,39.2 L181.0,39.4 L181.3,40.3 L182.2,40.0 L183.2,40.5ZM192.2,25.7 L193.8,24.9 L197.7,25.9 L200.1,26.9 L200.3,27.8 L203.6,27.3 L205.4,28.6 L209.6,29.4 L211.1,30.3 L212.8,32.2 L209.6,33.1 L213.7,34.5 L216.5,34.9 L219.0,36.8 L221.8,36.9 L221.2,38.4 L218.1,40.8 L216.0,39.9 L213.2,37.9 L211.0,38.2 L210.8,39.3 L212.6,40.5 L215.0,41.5 L215.7,42.0 L216.8,44.0 L216.2,45.5 L214.0,45.0 L209.6,43.3 L212.1,45.1 L213.9,46.3 L214.2,47.0 L209.5,46.2 L205.7,45.0 L203.6,44.0 L204.2,43.5 L201.6,42.4 L199.0,41.4 L199.1,42.0 L194.0,42.3 L192.5,41.6 L193.7,40.1 L197.0,40.1 L200.6,39.8 L200.0,39.1 L200.6,38.1 L202.9,36.1 L202.4,35.2 L201.7,34.5 L199.0,33.5 L195.5,32.8 L196.6,32.2 L194.7,31.0 L193.2,30.9 L191.8,30.2 L190.9,30.8 L187.7,31.0 L181.3,30.6 L177.6,30.0 L174.8,29.7 L173.4,28.9 L175.2,28.0 L172.7,28.0 L172.1,25.9 L173.5,24.1 L175.3,23.2 L179.8,22.7 L178.5,24.0 L179.9,25.3 L181.5,23.7 L185.9,22.8 L188.9,24.9 L188.7,26.3 L192.2,25.7ZM164.6,22.0 L168.3,22.1 L171.6,22.6 L169.0,24.4 L166.9,24.8 L165.0,26.3 L163.0,26.3 L161.9,24.5 L162.0,23.5 L162.9,22.6 L164.6,22.0ZM115.0,18.0 L115.0,18.0 L118.0,16.4 L121.6,15.1 L124.3,15.1 L126.7,14.8 L126.4,16.4 L125.1,17.1 L123.4,17.2 L120.2,18.1 L117.4,18.4 L115.0,18.0ZM97.8,63.2 L99.4,63.1 L98.9,65.4 L100.4,67.0 L99.7,67.0 L98.7,66.1 L98.0,65.1 L97.2,64.5 L96.8,63.6 L96.9,63.0 L97.8,63.2ZM145.4,11.4 L148.8,11.7 L153.6,12.5 L154.9,13.4 L155.6,14.3 L152.7,14.1 L149.8,13.4 L145.9,13.3 L147.6,12.7 L145.5,12.2 L145.4,11.4ZM113.9,74.6 L113.0,74.8 L110.1,73.9 L109.6,73.2 L108.0,72.5 L107.7,71.9 L105.9,71.5 L105.2,70.4 L105.4,69.9 L107.2,70.4 L108.3,70.7 L109.9,70.9 L110.5,71.6 L111.4,72.6 L113.1,73.4 L113.9,74.6ZM117.3,21.4 L119.8,21.8 L124.3,21.9 L126.0,22.5 L127.9,23.4 L125.7,23.9 L121.4,25.3 L119.2,26.8 L119.2,27.7 L114.6,28.7 L113.7,27.8 L109.6,26.7 L110.4,25.8 L111.6,24.3 L113.1,23.0 L111.4,21.7 L117.3,21.4ZM141.3,18.5 L142.9,18.2 L144.7,18.3 L145.0,19.3 L144.0,20.2 L138.0,20.6 L133.6,21.4 L130.9,21.5 L130.7,20.8 L134.4,19.9 L126.5,20.2 L124.0,19.8 L126.4,17.8 L128.0,17.2 L133.0,17.9 L136.1,19.1 L139.1,19.3 L136.6,17.3 L138.2,16.6 L140.0,16.8 L140.6,17.8 L141.3,18.5ZM143.6,24.2 L145.5,25.0 L146.6,27.0 L147.2,28.5 L150.1,29.5 L153.3,30.5 L153.1,31.4 L150.2,31.5 L151.3,32.3 L150.7,33.1 L147.6,32.7 L144.6,32.2 L142.5,32.3 L139.3,33.0 L134.8,33.3 L131.7,33.5 L130.8,32.5 L128.4,32.0 L126.8,32.2 L124.7,30.6 L125.8,30.4 L128.5,30.0 L131.0,30.1 L133.3,29.7 L129.9,29.3 L126.1,29.4 L123.7,29.4 L122.7,28.6 L126.8,27.8 L124.1,27.8 L121.0,27.3 L122.5,25.8 L123.7,25.0 L128.4,23.7 L130.2,24.1 L129.3,25.1 L133.2,24.4 L135.7,25.5 L137.6,24.4 L139.2,25.1 L140.7,27.1 L141.5,26.3 L140.3,24.2 L141.8,23.9 L143.6,24.2ZM154.2,25.0 L152.3,23.6 L154.4,22.6 L156.5,23.1 L159.6,22.8 L160.0,23.4 L158.4,24.4 L161.1,25.3 L160.7,27.1 L157.9,27.9 L156.2,27.7 L155.0,26.9 L150.6,25.4 L150.7,24.7 L154.2,25.0ZM143.5,23.1 L145.8,23.0 L147.1,23.5 L145.6,24.8 L142.9,23.4 L143.5,23.1ZM157.6,16.7 L159.0,17.7 L159.0,18.7 L158.2,20.2 L155.3,20.5 L153.5,20.1 L153.5,18.9 L150.6,19.1 L150.5,17.5 L152.4,17.6 L155.0,16.9 L157.5,17.0 L157.6,16.7ZM162.0,8.8 L163.2,8.1 L165.0,8.0 L164.2,7.5 L168.3,7.4 L170.5,8.5 L173.5,9.0 L176.3,9.3 L177.7,10.7 L179.8,11.4 L177.4,12.0 L174.2,13.5 L171.1,13.7 L167.5,13.4 L165.6,12.6 L165.6,11.8 L167.0,11.3 L163.8,11.3 L161.9,10.6 L160.8,9.7 L162.0,8.8ZM169.7,6.1 L172.3,5.7 L174.4,5.7 L177.8,5.3 L180.4,4.6 L182.5,4.7 L184.4,5.2 L185.8,4.1 L188.1,3.8 L191.2,3.6 L196.6,3.5 L197.5,3.7 L202.5,3.4 L206.3,3.5 L210.1,3.6 L214.8,3.8 L218.6,4.1 L221.8,4.6 L221.7,5.2 L217.4,6.0 L213.2,6.5 L211.6,6.9 L215.4,6.9 L211.3,8.2 L208.4,8.7 L205.4,10.4 L201.8,10.7 L200.7,11.2 L195.4,11.4 L197.8,11.6 L196.6,12.0 L198.1,13.0 L196.4,13.7 L193.7,14.3 L192.9,15.1 L190.4,15.7 L190.7,16.2 L193.7,16.1 L193.7,16.6 L189.0,17.8 L184.4,17.3 L179.3,17.6 L176.7,17.3 L173.4,17.2 L173.2,16.2 L176.4,15.8 L175.5,14.3 L176.6,14.2 L181.3,15.0 L178.9,13.7 L176.1,13.3 L177.5,12.5 L180.6,12.1 L181.1,11.3 L178.6,10.5 L177.9,9.5 L182.7,9.6 L184.0,9.8 L186.8,9.0 L182.8,8.8 L176.7,8.9 L173.6,8.2 L172.2,7.4 L170.1,6.8 L169.7,6.1ZM198.4,35.7 L197.2,36.3 L195.3,36.4 L194.8,35.4 L195.6,34.3 L197.2,34.0 L198.5,34.6 L198.6,35.5 L198.4,35.7ZM161.5,31.5 L162.6,32.3 L161.5,33.0 L159.2,32.4 L157.7,32.7 L155.4,31.7 L156.9,31.1 L158.1,30.2 L160.0,30.8 L161.0,31.2 L161.5,31.5ZM217.1,71.8 L217.7,71.6 L220.0,72.1 L221.8,73.0 L221.8,73.3 L221.0,73.4 L218.7,72.7 L217.1,71.8ZM218.0,77.6 L218.6,78.6 L219.9,78.8 L221.5,78.8 L220.6,79.6 L220.0,79.8 L217.8,78.9 L217.3,78.2 L218.0,77.6Z"/><path d="M115.0,73.5 L120.0,73.5 L125.2,73.5 L126.9,73.5 L132.2,73.5 L137.4,73.5 L142.7,73.5 L147.9,73.6 L153.9,73.5 L159.8,73.5 L163.5,73.5 L163.5,72.8 L164.1,72.8 L164.4,73.9 L164.9,74.2 L166.1,74.4 L167.9,74.7 L169.6,75.3 L171.0,75.0 L173.2,75.6 L173.8,75.6 L175.3,75.0 L177.0,75.7 L178.7,76.5 L180.1,77.2 L181.5,77.9 L181.6,78.4 L182.0,78.6 L181.9,78.8 L182.4,78.9 L182.8,78.6 L182.8,79.1 L183.2,79.5 L183.7,79.5 L183.9,79.7 L183.7,80.1 L185.5,81.0 L185.9,82.9 L186.3,84.7 L185.7,85.9 L184.9,87.0 L184.5,87.7 L184.5,87.9 L184.7,88.2 L185.3,88.6 L185.7,88.6 L187.8,87.5 L189.6,87.1 L191.9,86.1 L191.9,85.9 L191.7,85.3 L191.4,84.9 L192.2,84.6 L194.0,84.6 L195.6,84.6 L196.1,83.8 L196.3,83.6 L198.2,82.1 L199.0,81.7 L201.6,81.7 L204.9,81.7 L205.0,81.2 L205.6,81.1 L206.3,80.8 L207.0,79.9 L207.5,78.3 L208.8,76.7 L209.4,77.3 L210.6,76.9 L211.4,77.5 L211.4,80.3 L212.5,81.5 L212.8,82.1 L210.9,83.1 L209.1,83.8 L207.3,84.4 L206.4,85.7 L206.1,86.1 L206.1,87.2 L206.6,88.3 L207.4,88.4 L207.2,87.6 L207.7,88.1 L207.6,88.6 L206.4,89.0 L205.5,88.9 L204.2,89.3 L203.5,89.4 L202.5,89.5 L201.0,90.1 L203.6,89.7 L204.1,90.1 L201.6,90.7 L200.5,90.7 L200.6,90.5 L200.1,91.0 L200.6,91.1 L200.2,92.6 L198.9,94.2 L198.8,93.6 L198.4,93.5 L197.8,93.0 L198.2,94.1 L198.6,94.5 L198.7,95.3 L198.1,96.1 L197.1,97.7 L196.9,97.6 L197.5,96.2 L196.6,95.4 L196.4,93.7 L196.1,94.6 L196.4,95.9 L195.3,95.6 L196.5,96.3 L196.5,98.2 L197.0,98.4 L197.2,99.1 L197.5,101.1 L196.4,102.6 L194.6,103.3 L193.4,104.5 L192.5,104.6 L191.6,105.3 L191.4,106.0 L189.5,107.4 L188.5,108.3 L187.7,109.5 L187.4,111.0 L187.7,112.4 L188.3,114.2 L189.1,115.6 L189.1,116.5 L189.9,118.9 L189.8,120.3 L189.8,121.1 L189.3,122.3 L188.8,122.6 L187.9,122.3 L187.7,121.4 L187.0,121.0 L186.1,119.2 L185.3,117.6 L185.0,116.8 L185.4,115.5 L184.9,114.3 L183.5,112.6 L182.8,112.3 L181.1,113.2 L180.7,113.1 L179.9,112.2 L178.8,111.7 L176.8,111.9 L175.3,111.7 L173.9,111.9 L173.2,112.2 L173.5,112.7 L173.5,113.5 L173.9,114.0 L173.5,114.2 L172.9,113.9 L172.2,114.3 L171.0,114.2 L169.7,113.2 L168.1,113.4 L166.9,112.9 L165.8,113.1 L164.3,113.6 L162.7,115.1 L161.0,116.0 L160.0,116.9 L159.6,117.9 L159.6,119.3 L159.7,120.3 L160.0,121.0 L159.3,121.0 L158.1,120.6 L156.7,119.9 L156.2,119.0 L155.8,117.5 L154.8,116.4 L154.2,115.2 L153.3,113.8 L152.1,113.0 L150.7,113.0 L149.6,114.6 L148.1,114.0 L147.2,113.4 L146.8,112.3 L146.2,111.2 L145.1,110.3 L144.2,109.6 L143.6,108.9 L140.6,108.9 L140.6,109.7 L139.2,109.7 L135.7,109.8 L131.7,108.3 L129.1,107.3 L129.2,106.9 L127.0,107.1 L125.0,107.3 L124.7,106.3 L123.6,105.1 L122.8,104.8 L122.6,104.2 L121.6,104.1 L121.0,103.6 L119.4,103.4 L118.9,103.1 L118.7,101.9 L117.0,99.9 L115.5,97.0 L115.6,96.5 L114.8,95.9 L113.5,94.1 L113.2,92.5 L112.3,91.4 L112.7,89.7 L112.6,87.9 L112.1,86.3 L112.8,84.4 L113.0,82.5 L113.2,80.7 L112.9,77.9 L112.3,76.2 L111.8,75.2 L112.0,74.8 L114.5,75.5 L115.5,77.5 L115.9,76.9 L115.6,75.2 L115.0,73.5ZM58.0,132.8 L58.4,133.0 L58.6,133.3 L59.1,134.0 L59.0,134.1 L58.4,134.6 L57.8,134.9 L57.5,135.2 L57.1,134.9 L57.2,134.4 L56.9,133.6 L57.0,133.4 L57.3,133.0 L57.1,132.6 L57.2,132.5 L57.4,132.5 L58.0,132.8ZM57.0,131.4 L56.9,131.7 L56.3,131.8 L56.0,131.4 L55.8,131.2 L55.8,131.1 L55.9,130.9 L56.6,131.1 L57.0,131.4ZM55.7,130.6 L55.6,130.8 L54.7,130.7 L54.8,130.5 L55.7,130.6ZM53.5,129.5 L53.6,129.6 L54.1,130.3 L54.0,130.4 L53.9,130.4 L53.3,130.3 L53.1,129.8 L53.0,129.8 L53.5,129.5ZM51.1,128.5 L51.1,128.9 L50.9,129.1 L50.3,128.8 L50.4,128.6 L50.7,128.4 L51.1,128.5ZM38.7,50.2 L40.1,50.4 L40.2,51.2 L39.2,51.5 L38.0,51.1 L37.0,50.6 L38.7,50.2ZM61.8,55.2 L63.0,55.3 L63.8,55.9 L62.2,56.9 L60.5,57.7 L59.6,57.2 L59.3,56.2 L60.9,55.5 L61.8,55.2ZM83.3,31.1 L83.3,31.1 L83.3,38.7 L83.3,50.4 L85.0,50.4 L86.7,51.0 L87.9,51.9 L89.5,53.2 L91.2,52.1 L92.9,51.4 L93.8,52.5 L95.0,53.3 L96.6,54.3 L97.7,55.7 L99.5,58.1 L102.5,59.4 L102.5,60.7 L101.6,61.7 L101.6,61.7 L101.6,61.7 L100.6,60.9 L99.1,60.2 L98.6,58.4 L96.3,56.8 L95.4,54.8 L93.7,54.7 L90.9,54.7 L88.8,54.1 L85.2,51.9 L83.6,51.6 L80.5,50.8 L78.1,51.0 L74.6,50.1 L72.5,49.2 L70.6,49.6 L71.0,51.0 L70.0,51.2 L68.0,51.6 L66.4,52.3 L64.5,52.7 L64.2,51.5 L65.0,49.5 L66.9,48.9 L66.4,48.4 L64.2,49.5 L63.0,50.9 L60.5,52.3 L61.7,53.3 L60.1,54.8 L58.2,55.7 L56.5,56.3 L56.0,57.2 L53.3,58.2 L52.7,59.2 L50.7,60.1 L49.5,59.9 L47.9,60.5 L46.1,61.2 L44.6,61.9 L41.6,62.5 L41.4,62.1 L43.3,61.2 L45.0,60.5 L46.8,59.4 L49.0,59.2 L49.9,58.3 L52.3,57.1 L52.7,56.7 L54.0,56.0 L54.3,54.4 L55.2,53.2 L53.2,53.8 L52.6,53.5 L51.6,54.2 L50.5,53.2 L50.0,53.9 L49.4,52.9 L47.6,53.7 L46.6,53.7 L46.4,52.5 L46.7,51.8 L45.6,51.0 L43.3,51.4 L41.8,50.5 L40.6,50.0 L40.6,48.8 L39.3,47.9 L40.0,46.7 L41.4,45.6 L42.0,44.5 L43.4,44.4 L44.6,44.7 L46.0,43.7 L47.3,43.9 L48.6,43.3 L48.3,42.3 L47.3,42.0 L48.6,41.2 L47.6,41.2 L45.7,41.7 L45.2,42.1 L43.8,41.7 L41.3,41.9 L38.8,41.4 L38.0,40.6 L35.8,39.4 L38.3,38.5 L42.2,37.5 L43.6,37.5 L43.4,38.5 L47.1,38.5 L45.6,37.2 L43.5,36.4 L42.2,35.4 L40.6,34.5 L38.2,33.9 L39.1,32.8 L42.2,32.7 L44.5,31.8 L44.9,30.8 L46.7,29.8 L48.4,29.6 L51.7,28.7 L53.3,28.8 L56.0,27.7 L58.6,28.1 L59.9,29.1 L60.7,28.7 L63.6,28.8 L63.5,29.3 L66.2,29.6 L68.0,29.4 L71.7,30.1 L75.0,30.3 L76.4,30.5 L78.7,30.2 L81.4,30.8 L83.3,31.1 L83.3,31.1ZM29.5,43.2 L30.5,43.6 L31.6,43.4 L33.1,44.0 L34.8,44.2 L34.6,44.5 L33.3,44.9 L32.0,44.5 L31.3,44.1 L29.8,44.2 L29.4,44.0 L29.5,43.2Z"/><path d="M482.9,73.1 L481.5,74.5 L480.1,74.7 L480.0,76.7 L479.0,77.6 L475.6,77.0 L474.3,80.6 L473.4,81.1 L469.9,81.9 L471.5,85.5 L470.3,86.0 L470.5,87.2 L469.4,86.9 L468.5,86.1 L465.9,85.9 L463.0,85.9 L462.4,86.1 L459.9,85.2 L458.9,85.7 L458.6,86.9 L455.7,86.2 L454.6,86.5 L454.2,87.4 L453.2,87.7 L450.9,89.2 L450.1,90.6 L449.5,90.6 L449.0,89.7 L446.7,89.6 L446.4,87.9 L445.5,87.9 L445.7,85.9 L443.6,84.4 L440.6,84.5 L438.5,84.8 L436.9,83.0 L435.4,82.2 L432.7,80.7 L432.4,80.5 L427.9,81.8 L427.9,89.3 L427.0,89.4 L425.8,87.8 L424.6,87.2 L422.7,87.7 L421.9,88.3 L421.8,87.8 L422.2,87.0 L421.9,86.3 L419.8,85.6 L419.1,83.7 L418.1,83.2 L418.0,82.5 L419.7,82.7 L419.8,81.2 L421.3,80.9 L422.8,81.2 L423.1,79.2 L422.8,78.0 L421.1,78.1 L419.6,77.6 L417.6,78.5 L415.9,78.9 L415.0,78.5 L415.2,77.5 L414.1,76.1 L412.8,76.2 L411.3,74.8 L412.3,73.2 L411.8,72.8 L413.2,70.6 L415.0,71.8 L415.2,70.3 L418.8,68.0 L421.6,68.0 L425.4,69.4 L427.5,70.2 L429.4,69.4 L432.1,69.3 L434.4,70.4 L434.9,69.8 L437.3,69.9 L437.8,68.9 L434.9,67.5 L436.6,66.5 L436.3,65.9 L438.0,65.4 L436.7,64.0 L437.5,63.3 L444.1,62.6 L444.9,62.1 L449.3,61.3 L450.9,60.5 L454.0,60.9 L454.6,63.0 L456.4,62.5 L458.6,63.2 L458.5,64.3 L460.2,64.2 L464.6,62.3 L463.9,62.9 L466.2,64.5 L470.1,69.7 L471.0,68.7 L473.4,69.8 L475.9,69.3 L476.9,69.7 L477.7,70.9 L479.0,71.3 L479.7,72.1 L482.0,71.9 L482.9,73.1Z"/><path d="M427.9,89.3 L427.9,81.8 L432.4,80.5 L432.7,80.7 L435.4,82.2 L436.9,83.0 L438.5,84.8 L440.6,84.5 L443.6,84.4 L445.7,85.9 L445.5,87.9 L446.4,87.9 L446.7,89.6 L449.0,89.7 L449.5,90.6 L450.1,90.6 L450.9,89.2 L453.2,87.7 L454.2,87.4 L454.7,87.6 L453.2,88.9 L454.5,89.7 L455.8,89.1 L457.8,90.2 L455.6,91.7 L454.3,91.5 L453.6,91.6 L453.3,91.0 L453.7,90.0 L451.3,90.5 L450.8,91.8 L449.9,93.0 L448.5,92.9 L448.0,93.8 L449.3,94.3 L449.7,95.8 L448.7,97.9 L447.4,97.4 L446.4,97.4 L446.5,96.2 L444.1,95.3 L442.3,94.3 L441.2,93.3 L439.2,91.9 L438.3,89.8 L437.7,89.4 L435.8,89.5 L435.1,89.1 L435.0,87.4 L432.6,86.4 L431.1,87.6 L429.6,88.3 L429.9,89.3 L427.9,89.3Z"/><path d="M576.8,179.3 L579.8,180.7 L583.0,181.9 L584.2,183.0 L585.2,184.0 L585.5,185.2 L588.4,186.5 L588.8,187.6 L587.2,187.8 L587.6,189.1 L589.1,190.5 L590.3,192.7 L591.3,192.6 L591.2,193.5 L592.6,193.9 L592.0,194.2 L593.9,195.1 L593.7,195.7 L592.5,195.8 L592.1,195.3 L590.6,195.1 L588.8,194.8 L587.5,193.5 L586.5,192.3 L585.6,190.5 L583.3,189.6 L581.8,190.2 L580.8,190.9 L581.0,192.4 L579.6,193.1 L578.6,192.8 L576.8,192.7 L576.8,186.0 L576.8,179.3ZM597.1,181.5 L597.8,182.2 L598.0,183.2 L597.4,183.8 L597.1,182.6 L596.7,181.8 L595.9,181.1 L594.9,180.2 L593.7,179.6 L594.1,179.1 L595.1,179.7 L595.7,180.1 L596.4,180.6 L597.1,181.5ZM594.8,186.0 L593.8,186.5 L592.9,187.0 L592.0,186.9 L590.6,186.4 L589.6,185.8 L589.7,185.1 L591.3,185.4 L592.2,185.3 L592.5,184.3 L592.7,184.3 L592.9,185.3 L593.9,185.2 L594.4,184.5 L595.4,183.8 L595.2,182.5 L596.2,182.5 L596.6,182.8 L596.6,184.0 L596.0,185.2 L595.1,185.4 L594.8,186.0ZM600.8,184.9 L601.4,185.4 L602.2,186.7 L603.0,187.4 L602.8,188.0 L602.3,188.2 L601.5,187.4 L600.8,186.1 L600.4,184.5 L600.6,184.3 L600.8,184.9Z"/><path d="M576.8,179.3 L576.8,186.0 L576.8,192.7 L575.3,191.0 L573.5,190.6 L573.0,191.2 L570.8,191.2 L571.6,189.6 L572.7,189.0 L572.2,186.8 L571.4,185.1 L568.0,183.3 L566.5,183.1 L563.9,181.3 L563.4,182.3 L562.7,182.4 L562.3,181.7 L562.3,180.8 L561.0,179.8 L562.9,179.0 L564.1,179.1 L564.0,178.5 L561.4,178.5 L560.7,177.3 L559.1,176.9 L558.4,175.9 L560.8,175.4 L561.7,174.8 L564.5,175.6 L564.8,176.4 L565.2,179.7 L567.1,180.9 L568.5,178.7 L570.5,177.5 L572.1,177.5 L573.6,178.2 L574.9,178.9 L576.8,179.3ZM548.7,192.2 L548.9,192.6 L548.9,193.3 L547.8,194.8 L546.3,195.2 L546.1,195.0 L546.2,194.3 L547.0,193.0 L548.7,192.2ZM564.9,188.1 L564.7,186.6 L565.0,185.9 L565.4,185.2 L565.8,185.8 L565.8,186.7 L564.9,188.1ZM536.3,165.5 L535.3,167.4 L536.6,169.3 L536.3,170.3 L538.2,172.2 L536.2,172.4 L535.6,173.8 L535.7,175.6 L534.0,177.0 L533.9,179.1 L533.3,182.2 L533.0,181.5 L531.0,182.4 L530.3,181.2 L529.1,181.1 L528.2,180.4 L526.1,181.1 L525.5,180.1 L524.3,180.3 L522.9,180.0 L522.6,177.3 L521.8,176.7 L520.9,174.9 L520.7,173.1 L520.9,171.2 L521.9,169.9 L522.2,171.3 L523.4,172.4 L524.5,172.0 L525.6,172.1 L526.7,171.1 L527.5,170.9 L529.2,171.5 L530.6,171.1 L531.5,168.2 L532.2,167.5 L532.8,165.2 L534.8,165.2 L536.3,165.5ZM556.4,179.7 L558.3,180.3 L559.0,181.9 L557.5,181.1 L556.0,180.9 L555.0,181.0 L553.8,181.0 L554.2,179.8 L556.4,179.7ZM552.0,181.8 L550.8,181.4 L550.5,180.5 L552.3,180.4 L552.7,181.1 L552.0,181.8ZM553.9,169.5 L554.0,170.7 L555.0,170.8 L555.2,171.7 L555.1,173.5 L554.2,173.3 L553.9,174.5 L554.7,175.6 L554.2,175.8 L553.5,174.5 L552.9,171.9 L553.3,170.3 L553.9,169.5ZM545.1,172.2 L547.1,172.1 L548.9,170.6 L549.2,171.1 L547.8,173.1 L546.4,173.5 L544.8,173.1 L541.8,173.2 L540.3,173.5 L540.1,175.1 L541.6,176.9 L542.6,176.0 L545.8,175.3 L545.7,176.2 L544.9,175.9 L544.2,177.1 L542.6,177.9 L544.3,180.5 L544.0,181.2 L545.5,183.6 L545.5,184.9 L544.6,185.6 L543.9,184.8 L544.8,183.2 L543.0,183.9 L542.6,183.4 L542.8,182.6 L541.6,181.4 L541.7,179.4 L540.5,180.0 L540.7,182.4 L540.8,185.3 L539.6,185.6 L538.9,185.0 L539.4,183.1 L539.1,181.2 L538.4,181.1 L537.8,179.7 L538.6,178.4 L538.8,176.8 L539.7,173.7 L540.1,172.8 L541.6,171.3 L542.9,171.9 L545.1,172.2ZM540.5,195.0 L538.2,193.6 L539.8,193.2 L540.7,193.8 L541.4,194.4 L541.3,195.0 L540.5,195.0ZM542.3,191.5 L543.5,191.3 L545.1,190.6 L544.8,191.7 L542.2,192.3 L539.9,192.1 L539.9,191.3 L541.3,190.9 L542.3,191.5ZM537.0,191.1 L538.0,191.0 L538.5,191.8 L536.4,192.3 L535.2,192.5 L534.3,192.5 L534.9,191.3 L535.9,191.3 L536.3,190.6 L537.0,191.1ZM519.9,187.2 L520.1,187.9 L523.4,188.1 L523.8,187.3 L527.1,188.2 L527.7,189.6 L530.3,189.9 L532.5,191.2 L530.5,191.9 L528.6,191.1 L527.0,191.2 L525.2,191.0 L523.5,190.7 L521.5,189.9 L520.2,189.7 L519.5,189.9 L516.3,189.1 L516.0,188.2 L514.4,188.0 L515.6,186.1 L517.7,186.2 L519.1,187.0 L519.9,187.2ZM512.6,176.2 L512.9,177.7 L513.6,178.8 L514.8,179.0 L515.7,180.3 L515.3,182.8 L515.2,186.0 L513.2,186.0 L511.8,184.3 L509.5,182.7 L508.8,181.4 L507.4,179.7 L506.6,178.2 L505.2,175.3 L503.7,173.6 L503.2,171.9 L502.6,170.3 L501.0,169.0 L500.1,167.2 L498.7,166.1 L496.9,163.8 L496.8,162.8 L497.9,162.8 L500.6,163.2 L502.1,165.2 L503.5,166.6 L504.5,167.5 L506.1,169.7 L507.9,169.7 L509.4,171.1 L510.4,172.8 L511.7,173.8 L511.0,175.5 L512.0,176.2 L512.6,176.2Z"/><path d="M209.9,281.9 L210.6,282.9 L211.4,284.4 L213.7,285.6 L216.2,286.1 L215.4,287.2 L213.7,287.3 L212.8,286.5 L211.8,286.5 L209.9,286.5 L209.9,281.9ZM229.2,235.9 L228.7,237.6 L228.3,239.7 L228.3,241.7 L227.9,242.2 L227.8,243.5 L227.6,244.6 L229.9,246.3 L229.6,247.8 L230.7,248.6 L230.6,249.6 L228.9,252.3 L226.3,253.4 L222.8,253.8 L220.9,253.6 L221.3,254.8 L220.9,256.4 L221.2,257.4 L220.2,258.1 L218.4,258.4 L216.7,257.6 L216.0,258.2 L216.3,260.2 L217.5,260.8 L218.4,260.2 L218.9,261.3 L217.3,261.9 L215.9,263.2 L215.7,265.2 L215.3,266.3 L213.6,266.3 L212.2,267.4 L211.7,268.9 L213.5,270.4 L215.1,270.8 L214.5,272.7 L212.5,273.8 L211.3,276.2 L209.7,277.0 L209.0,278.0 L209.6,280.1 L210.7,281.3 L210.0,281.2 L208.4,280.9 L204.1,280.6 L203.4,279.4 L203.5,277.9 L202.3,278.0 L201.7,277.3 L201.5,275.1 L202.9,274.2 L203.4,272.9 L203.2,271.9 L204.1,270.1 L204.8,267.4 L204.6,266.2 L205.4,265.8 L205.2,265.0 L204.4,264.6 L204.9,263.8 L204.1,263.0 L203.7,260.6 L204.4,260.2 L204.1,257.7 L204.6,255.6 L205.0,253.8 L206.1,253.0 L205.5,251.0 L205.5,249.1 L206.9,247.8 L206.8,246.1 L207.8,244.1 L207.8,242.2 L207.4,241.8 L206.6,238.3 L207.6,236.2 L207.5,234.2 L208.1,232.3 L209.2,230.4 L210.5,229.1 L210.0,228.3 L210.3,227.7 L210.3,224.3 L212.2,223.3 L212.8,221.1 L212.6,220.6 L214.0,218.8 L216.3,219.3 L217.3,220.7 L218.0,219.1 L220.0,219.2 L220.3,219.6 L223.5,223.0 L224.9,223.3 L227.1,224.8 L228.9,225.6 L229.1,226.5 L227.4,229.6 L229.2,230.2 L231.1,230.5 L232.5,230.1 L234.1,228.6 L234.4,226.8 L235.3,226.4 L236.2,227.6 L236.1,229.2 L234.6,230.3 L233.5,231.2 L231.5,233.1 L229.2,235.9Z"/><path d="M209.9,281.9 L209.9,286.5 L211.8,286.5 L212.8,286.5 L212.2,287.4 L210.7,288.0 L209.9,287.9 L208.8,287.8 L207.6,287.2 L205.7,286.9 L203.5,285.7 L201.8,284.6 L199.3,282.3 L200.8,282.7 L203.2,284.1 L205.6,284.9 L206.5,283.9 L207.0,282.5 L208.6,281.7 L209.9,281.9ZM208.2,210.0 L209.1,211.4 L209.3,212.9 L210.2,213.8 L209.7,215.8 L210.6,218.1 L211.3,220.9 L212.6,220.6 L212.8,221.1 L212.2,223.3 L210.3,224.3 L210.3,227.7 L210.0,228.3 L210.5,229.1 L209.2,230.4 L208.1,232.3 L207.5,234.2 L207.6,236.2 L206.6,238.3 L207.4,241.8 L207.8,242.2 L207.8,244.1 L206.8,246.1 L206.9,247.8 L205.5,249.1 L205.5,251.0 L206.1,253.0 L205.0,253.8 L204.6,255.6 L204.1,257.7 L204.4,260.2 L203.7,260.6 L204.1,263.0 L204.9,263.8 L204.4,264.6 L205.2,265.0 L205.4,265.8 L204.6,266.2 L204.8,267.4 L204.1,270.1 L203.2,271.9 L203.4,272.9 L202.9,274.2 L201.5,275.1 L201.7,277.3 L202.3,278.0 L203.5,277.9 L203.4,279.4 L204.1,280.6 L208.4,280.9 L210.0,281.2 L208.4,281.2 L207.6,281.7 L206.0,282.4 L205.7,284.4 L205.0,284.4 L203.0,283.7 L201.0,282.3 L201.0,282.3 L198.8,281.1 L198.3,279.8 L198.8,278.6 L197.9,277.3 L197.7,273.8 L198.4,271.8 L200.3,270.2 L197.6,269.6 L199.3,267.8 L199.9,264.4 L201.8,265.1 L202.7,260.9 L201.6,260.3 L201.0,262.9 L199.9,262.6 L200.5,259.7 L201.1,255.9 L201.9,254.5 L201.4,252.5 L201.2,250.2 L202.0,250.1 L203.0,246.8 L204.2,243.5 L205.0,240.5 L204.6,237.4 L205.1,235.7 L204.9,233.2 L205.9,230.7 L206.2,226.7 L206.8,222.4 L207.3,217.9 L207.2,214.5 L206.8,211.6 L207.7,211.1 L208.2,210.0Z"/><path d="M381.3,183.2 L381.7,185.1 L381.5,186.2 L381.8,187.4 L382.8,188.5 L383.8,191.1 L383.8,191.1 L383.1,190.9 L380.8,191.2 L380.3,191.5 L379.8,192.8 L380.2,193.7 L379.9,196.1 L379.7,198.2 L380.1,198.5 L381.3,199.3 L381.8,199.0 L382.0,201.2 L380.6,201.2 L379.9,200.0 L379.3,199.2 L377.9,198.9 L377.5,197.8 L376.5,198.4 L375.1,198.2 L374.5,197.2 L373.4,197.0 L372.6,197.1 L372.5,196.5 L371.8,196.4 L371.0,196.3 L370.0,196.6 L369.2,196.5 L368.8,196.7 L368.9,194.3 L368.3,193.5 L368.2,192.3 L368.4,191.0 L368.1,190.2 L368.0,188.9 L365.9,189.0 L366.1,188.2 L365.2,188.2 L365.1,188.6 L364.0,188.7 L363.5,189.9 L363.3,190.4 L362.3,190.1 L361.7,190.4 L360.6,190.5 L359.9,189.5 L359.5,188.8 L359.0,187.6 L358.6,186.0 L353.4,186.0 L352.8,186.3 L352.3,186.2 L351.6,186.5 L351.3,185.9 L351.8,185.7 L351.8,184.8 L352.1,184.2 L352.7,183.8 L353.2,184.0 L353.8,183.2 L354.8,183.2 L354.9,183.8 L355.5,184.2 L356.5,182.9 L357.6,181.9 L358.0,181.2 L358.0,179.6 L358.7,177.6 L359.5,176.5 L360.7,175.5 L360.9,174.9 L360.9,174.1 L361.2,173.4 L361.1,172.2 L361.3,170.4 L361.7,169.2 L362.2,168.1 L362.3,166.8 L362.5,165.4 L363.1,164.3 L364.1,163.7 L365.5,164.4 L366.6,165.1 L367.9,165.3 L369.2,165.7 L369.7,164.5 L370.0,164.3 L370.8,164.6 L372.7,163.5 L373.4,164.0 L374.0,163.9 L374.2,163.4 L374.9,163.2 L376.2,163.4 L377.3,163.5 L377.9,163.3 L379.0,165.0 L379.8,165.2 L380.2,164.9 L381.0,165.0 L382.0,164.6 L382.4,165.4 L384.0,166.8 L384.0,166.8 L383.9,169.2 L384.6,169.5 L384.0,170.2 L383.3,170.8 L382.7,171.8 L382.3,172.8 L382.2,174.4 L381.8,175.2 L381.8,176.7 L381.3,177.3 L381.2,178.5 L381.0,178.7 L380.8,179.8 L381.2,180.8 L381.3,183.2Z"/><path d="M402.8,177.5 L401.7,175.8 L401.7,168.3 L403.2,166.0 L403.7,165.3 L404.8,165.3 L406.4,163.8 L408.7,163.7 L413.6,157.6 L414.9,155.9 L415.6,154.6 L415.6,153.6 L415.6,151.5 L415.6,150.6 L415.7,150.6 L415.7,150.6 L416.2,150.6 L417.0,150.3 L418.0,150.1 L418.8,149.4 L419.4,149.3 L419.5,149.9 L419.3,151.1 L419.3,152.2 L419.0,152.9 L418.5,155.1 L417.6,157.4 L416.5,160.1 L415.0,163.1 L413.5,165.4 L411.5,168.1 L409.7,169.8 L407.1,171.8 L405.5,173.4 L403.6,175.9 L403.2,177.0 L402.8,177.5Z"/><path d="M398.6,183.6 L396.1,181.5 L396.0,180.3 L389.6,176.2 L389.3,175.9 L389.3,173.8 L389.8,172.9 L390.7,171.6 L391.3,170.1 L390.5,167.7 L390.3,166.7 L389.5,165.3 L390.6,164.1 L391.8,162.7 L392.7,163.1 L392.7,164.2 L393.3,164.9 L394.5,164.9 L396.7,166.6 L397.3,166.6 L397.7,166.6 L398.1,166.8 L399.2,167.0 L399.7,166.1 L401.3,165.3 L402.1,166.0 L403.2,166.0 L401.7,168.3 L401.7,175.8 L402.8,177.5 L401.5,178.3 L401.1,179.1 L400.5,179.3 L400.2,180.7 L399.7,181.5 L399.3,182.9 L398.6,183.6Z"/><path d="M373.0,157.1 L371.7,156.2 L371.1,155.6 L370.9,155.0 L371.2,154.2 L371.2,153.3 L370.2,152.0 L370.0,151.2 L370.0,150.7 L369.4,150.1 L369.4,148.9 L369.0,148.1 L368.4,148.2 L368.6,147.4 L369.0,146.6 L368.8,145.7 L369.4,145.1 L369.0,144.6 L369.5,143.4 L370.3,141.9 L371.8,142.0 L371.7,133.9 L371.7,133.0 L373.8,133.0 L373.8,128.9 L380.8,128.9 L387.6,128.9 L394.5,128.9 L395.1,130.9 L394.7,131.3 L395.0,133.4 L395.6,135.8 L396.3,136.3 L397.2,137.1 L396.3,138.3 L395.0,138.6 L394.5,139.2 L394.3,140.6 L393.6,143.6 L393.8,144.4 L393.5,146.2 L392.8,148.2 L391.7,149.2 L391.0,150.8 L390.8,151.6 L390.0,152.2 L389.4,154.4 L389.5,156.2 L389.4,154.6 L389.2,154.6 L389.2,153.5 L389.0,152.8 L388.1,152.0 L387.9,150.5 L388.1,149.0 L387.3,148.9 L387.2,149.3 L386.1,149.5 L386.5,150.1 L386.7,151.3 L385.7,152.4 L384.9,153.9 L384.0,154.1 L382.5,152.9 L381.8,153.3 L381.7,153.9 L380.8,154.3 L380.7,154.7 L378.9,154.7 L378.7,154.3 L377.4,154.2 L376.8,154.6 L376.3,154.4 L375.4,153.2 L375.1,152.7 L373.9,152.9 L373.4,153.9 L372.9,155.7 L372.3,156.1 L371.8,156.3 L373.0,157.1Z"/><path d="M371.7,133.9 L371.8,142.0 L370.3,141.9 L369.5,143.4 L369.0,144.6 L369.4,145.1 L368.8,145.7 L369.0,146.6 L368.6,147.4 L368.4,148.2 L369.0,148.1 L369.4,148.9 L369.4,150.1 L370.0,150.7 L370.0,151.2 L368.9,151.5 L368.0,152.3 L366.8,154.6 L365.1,155.5 L363.4,155.4 L362.9,155.6 L363.1,156.3 L362.2,157.0 L361.4,157.8 L359.2,158.6 L358.8,158.1 L358.5,158.1 L358.2,158.6 L356.7,158.8 L357.0,158.2 L356.5,156.8 L356.2,156.0 L355.5,155.6 L354.4,154.4 L354.8,153.5 L355.6,153.7 L356.1,153.5 L357.1,153.5 L356.1,151.7 L356.2,150.3 L356.1,149.0 L355.4,147.6 L355.5,146.7 L354.4,146.6 L354.4,145.3 L353.7,144.5 L354.5,141.8 L356.7,139.9 L356.8,137.2 L357.5,133.1 L357.8,132.2 L357.1,131.5 L357.1,130.9 L356.4,130.3 L356.0,127.1 L357.8,126.0 L364.7,129.9 L371.7,133.9Z"/><path d="M204.5,133.6 L204.7,134.7 L204.5,135.5 L204.1,135.8 L204.5,136.5 L204.5,137.0 L203.3,136.7 L202.5,136.8 L201.5,136.7 L200.6,137.0 L199.7,136.4 L199.9,135.7 L201.5,136.0 L202.8,136.2 L203.4,135.7 L202.6,134.8 L202.6,134.1 L201.5,133.7 L201.9,133.2 L203.0,133.3 L204.5,133.6Z"/><path d="M204.5,137.0 L204.5,136.5 L204.1,135.8 L204.5,135.5 L204.7,134.7 L204.5,133.6 L204.7,133.2 L206.1,133.2 L207.1,133.8 L207.6,133.7 L207.9,134.4 L208.9,134.4 L208.8,135.0 L209.6,135.1 L210.4,135.8 L209.8,136.7 L209.0,136.2 L208.2,136.3 L207.6,136.2 L207.3,136.6 L206.6,136.7 L206.3,136.2 L205.8,136.5 L205.0,137.9 L204.6,137.6 L204.5,137.0Z"/><path d="M642.8,28.2 L645.0,27.4 L645.0,28.8 L643.1,28.9 L642.8,28.2ZM415.9,78.9 L415.1,80.1 L413.4,80.4 L411.7,82.6 L413.3,84.5 L413.1,85.9 L415.0,88.3 L415.0,88.3 L414.0,89.1 L413.7,89.6 L412.9,89.5 L411.7,88.3 L411.2,88.2 L410.1,87.7 L409.6,86.9 L407.9,86.4 L406.9,86.8 L406.6,86.4 L404.2,85.4 L401.6,85.1 L400.1,84.7 L399.9,85.0 L397.7,83.2 L395.7,82.5 L394.2,81.2 L395.5,80.9 L396.9,79.2 L395.9,78.4 L398.5,77.6 L398.5,77.1 L396.9,77.4 L396.9,76.5 L397.8,76.0 L399.5,75.8 L399.8,75.1 L399.4,74.0 L400.1,72.9 L400.1,72.3 L397.5,71.7 L396.5,71.7 L395.4,70.7 L394.1,71.0 L391.9,70.3 L391.9,69.9 L391.3,69.0 L389.9,68.9 L389.7,68.3 L390.2,67.9 L389.1,66.7 L387.3,66.9 L386.7,66.8 L386.3,67.3 L385.6,67.2 L385.6,67.2 L385.2,65.9 L384.8,65.2 L385.1,65.0 L386.5,65.1 L387.2,64.6 L386.7,64.1 L385.5,63.7 L385.6,63.4 L384.9,63.0 L383.8,61.6 L384.2,61.1 L384.0,60.1 L382.3,59.6 L381.4,59.9 L381.2,59.4 L379.3,58.9 L378.7,57.6 L378.6,56.6 L377.8,56.2 L378.5,55.5 L378.0,53.6 L379.2,52.4 L379.0,52.1 L379.0,52.1 L381.0,50.9 L379.1,50.0 L379.1,50.0 L382.9,47.4 L384.5,46.2 L385.2,45.1 L382.6,43.7 L383.3,42.4 L381.7,40.9 L382.9,39.1 L380.8,36.8 L382.5,35.2 L379.8,33.9 L380.0,32.4 L381.4,32.2 L384.4,31.4 L384.4,31.4 L386.2,30.7 L389.1,31.9 L393.9,32.4 L400.5,34.7 L401.9,35.7 L402.0,37.1 L400.0,38.2 L397.2,38.7 L389.4,37.1 L388.1,37.4 L390.9,38.9 L391.0,39.9 L391.2,42.0 L393.4,42.6 L394.8,43.1 L395.0,42.1 L393.9,41.2 L395.1,40.5 L399.3,41.7 L400.8,41.2 L399.6,39.7 L403.7,37.7 L405.3,37.8 L406.9,38.6 L407.9,37.1 L406.5,35.9 L407.3,34.7 L406.0,33.4 L410.9,34.1 L411.9,35.2 L409.7,35.5 L409.7,36.6 L411.1,37.3 L413.8,36.9 L414.2,35.6 L417.9,34.6 L424.0,32.8 L425.3,32.9 L423.6,34.2 L425.8,34.4 L427.0,33.7 L430.3,33.6 L432.9,32.8 L434.9,34.0 L436.9,32.7 L435.1,31.5 L436.0,30.8 L441.1,31.4 L443.6,32.1 L449.9,34.4 L451.1,33.3 L449.3,32.3 L449.2,31.8 L447.1,31.6 L447.7,30.6 L446.8,29.0 L446.7,28.4 L449.9,26.5 L451.1,24.7 L452.4,24.3 L457.0,24.8 L457.4,25.9 L455.7,27.6 L456.8,28.3 L457.4,29.7 L457.0,32.5 L458.9,33.8 L458.2,35.1 L454.7,38.0 L456.7,38.3 L457.4,37.6 L459.4,37.1 L459.8,36.1 L461.3,35.1 L460.3,33.9 L461.1,32.6 L459.2,32.4 L458.8,31.3 L460.2,29.2 L457.9,27.5 L461.1,26.2 L460.7,24.7 L461.5,24.6 L462.4,25.8 L461.8,27.8 L463.6,28.1 L462.8,26.7 L465.8,25.9 L469.4,25.7 L472.6,26.9 L471.1,25.2 L470.9,23.0 L473.9,22.6 L478.1,22.7 L481.9,22.4 L480.5,21.4 L482.5,20.0 L484.6,20.0 L488.0,18.9 L492.6,18.7 L493.2,18.1 L497.8,17.9 L499.2,18.4 L503.1,17.3 L506.3,17.3 L506.8,16.4 L508.5,15.6 L512.6,14.7 L515.6,15.4 L513.2,15.9 L517.2,16.2 L517.7,17.2 L519.3,16.7 L524.4,16.7 L528.3,17.7 L529.7,18.5 L529.3,19.6 L527.4,20.2 L522.8,21.3 L521.5,21.9 L523.6,22.2 L526.2,22.7 L527.8,22.3 L528.7,23.7 L529.4,23.1 L532.2,22.8 L537.9,23.1 L538.3,24.1 L545.6,24.4 L545.7,22.8 L549.4,23.2 L552.2,23.2 L555.0,24.3 L555.8,25.6 L554.8,26.4 L557.0,28.1 L559.8,28.9 L561.4,26.7 L564.3,27.7 L567.2,27.1 L570.6,27.7 L571.9,27.2 L574.8,27.4 L573.5,25.5 L575.8,24.7 L591.6,26.0 L593.1,27.2 L597.7,28.8 L604.8,28.4 L608.2,28.7 L609.7,29.6 L609.5,31.1 L611.6,31.7 L614.0,31.2 L617.1,31.2 L620.4,31.6 L623.7,31.4 L626.8,33.2 L628.9,32.5 L627.5,31.2 L628.3,30.3 L633.9,30.9 L637.5,30.8 L642.6,31.7 L645.0,32.6 L645.0,40.8 L645.0,40.8 L642.7,41.7 L640.5,41.6 L642.0,42.6 L643.1,44.3 L643.9,44.9 L644.1,45.7 L643.6,46.3 L640.4,45.8 L635.5,47.4 L633.9,47.6 L631.3,49.1 L628.7,50.3 L628.1,51.2 L625.6,49.8 L621.0,51.4 L620.2,50.7 L618.5,51.6 L616.2,51.3 L615.6,52.6 L613.5,54.6 L613.6,55.4 L615.6,55.9 L615.4,58.9 L613.7,58.9 L613.0,60.7 L613.7,61.5 L610.6,62.6 L610.0,64.9 L607.4,65.4 L606.9,67.5 L604.4,69.4 L603.7,68.0 L603.0,65.0 L602.0,60.5 L602.9,57.6 L604.3,56.4 L604.4,55.4 L607.1,55.0 L610.3,52.4 L613.3,50.3 L616.4,48.7 L617.8,45.8 L615.7,45.9 L614.7,47.6 L610.2,49.9 L608.8,47.4 L604.3,48.1 L599.9,51.5 L601.3,52.8 L597.4,53.3 L594.7,53.5 L594.8,52.0 L592.1,51.7 L590.0,52.7 L584.6,52.4 L578.8,53.0 L573.2,57.0 L566.5,61.8 L569.2,62.1 L570.1,63.3 L571.8,63.8 L572.9,62.8 L574.8,62.9 L577.4,65.2 L577.4,66.9 L576.0,69.0 L575.9,71.4 L575.1,74.7 L572.5,77.7 L571.9,79.1 L569.5,81.5 L567.2,83.8 L566.0,85.0 L563.7,86.2 L562.6,86.3 L561.5,85.3 L559.1,86.8 L558.9,87.4 L558.9,87.4 L558.9,87.4 L558.9,87.4 L558.6,87.1 L558.6,87.1 L558.6,86.0 L559.5,86.0 L559.8,83.6 L559.3,81.8 L560.8,81.1 L562.9,81.5 L564.1,79.5 L564.7,77.2 L565.4,76.5 L566.3,74.6 L563.4,75.2 L561.9,76.0 L559.2,76.0 L558.5,74.1 L556.4,72.6 L553.4,72.0 L552.8,70.0 L552.1,68.7 L551.5,67.8 L550.4,65.8 L548.9,65.0 L546.3,64.4 L543.9,64.5 L541.8,64.8 L540.3,65.9 L541.3,66.3 L541.3,67.5 L540.3,68.1 L538.7,70.3 L538.8,71.2 L536.3,72.5 L534.2,71.7 L532.1,71.9 L531.2,71.2 L530.1,71.0 L527.6,72.4 L525.3,72.8 L523.7,73.3 L521.5,72.9 L519.8,73.0 L518.8,71.9 L517.1,70.9 L515.3,70.7 L513.1,70.9 L511.4,71.3 L508.9,70.5 L508.6,68.9 L506.6,68.4 L505.0,68.2 L503.0,67.3 L501.2,69.4 L501.9,70.6 L500.2,72.1 L497.7,71.5 L495.9,71.5 L494.8,70.5 L492.9,70.5 L491.4,69.9 L488.7,70.8 L485.4,72.6 L483.6,72.9 L482.9,73.1 L482.0,71.9 L479.7,72.1 L479.0,71.3 L477.7,70.9 L476.9,69.7 L475.9,69.3 L473.4,69.8 L471.0,68.7 L470.1,69.7 L466.2,64.5 L463.9,62.9 L464.6,62.3 L460.2,64.2 L458.5,64.3 L458.6,63.2 L456.4,62.5 L454.6,63.0 L454.0,60.9 L450.9,60.5 L449.3,61.3 L444.9,62.1 L444.1,62.6 L437.5,63.3 L436.7,64.0 L438.0,65.4 L436.3,65.9 L436.6,66.5 L434.9,67.5 L437.8,68.9 L437.3,69.9 L434.9,69.8 L434.4,70.4 L432.1,69.3 L429.4,69.4 L427.5,70.2 L425.4,69.4 L421.6,68.0 L418.8,68.0 L415.2,70.3 L415.0,71.8 L413.2,70.6 L411.8,72.8 L412.3,73.2 L411.3,74.8 L412.8,76.2 L414.1,76.1 L415.2,77.5 L415.0,78.5 L415.9,78.9ZM494.1,7.9 L497.9,7.4 L501.3,8.5 L505.3,10.5 L504.9,12.3 L501.1,12.5 L496.2,12.0 L493.3,11.2 L492.0,9.7 L489.6,9.3 L494.1,7.9ZM510.0,11.5 L514.4,12.6 L513.9,13.5 L504.0,14.3 L507.2,11.6 L508.7,11.3 L510.0,11.5ZM573.0,17.9 L577.6,18.0 L583.9,19.1 L582.5,20.6 L576.1,20.6 L573.2,21.0 L569.7,19.7 L570.6,18.3 L573.0,17.9ZM589.4,19.5 L593.8,20.1 L591.8,20.9 L589.0,20.7 L585.7,19.9 L586.1,19.2 L589.4,19.5ZM574.8,23.6 L576.4,22.8 L578.6,22.6 L581.1,23.4 L581.3,23.9 L578.7,23.9 L575.1,23.7 L574.8,23.6ZM408.5,8.8 L411.9,8.4 L414.6,8.4 L414.9,8.9 L415.9,8.5 L417.6,8.1 L420.2,8.6 L419.5,8.9 L417.1,9.1 L415.6,9.3 L415.3,9.6 L413.3,10.0 L411.4,9.5 L412.4,8.9 L408.5,8.8ZM369.8,62.6 L366.6,62.7 L364.4,62.4 L364.8,61.5 L367.2,60.9 L369.1,61.2 L369.8,61.5 L369.6,62.1 L369.8,62.6ZM423.6,22.8 L427.8,21.0 L427.4,20.1 L431.3,19.0 L437.0,17.7 L442.9,17.3 L445.9,16.5 L449.3,16.3 L450.5,17.1 L449.3,17.7 L443.1,18.7 L437.8,19.7 L432.3,21.7 L429.7,23.7 L427.0,25.6 L427.3,27.3 L430.7,29.0 L429.7,29.2 L423.9,28.9 L423.5,28.0 L420.3,27.5 L420.0,26.4 L421.8,25.9 L421.8,24.8 L425.2,23.1 L423.6,22.8ZM580.1,63.9 L580.7,65.9 L580.7,67.9 L581.4,70.0 L583.1,73.6 L580.6,72.9 L579.5,75.9 L581.2,78.0 L581.1,79.4 L579.8,78.2 L578.7,79.8 L578.3,78.0 L578.5,76.1 L578.3,73.8 L578.7,72.3 L578.8,69.5 L577.8,67.5 L577.9,64.7 L579.6,63.8 L578.9,62.8 L579.6,62.5 L580.1,63.9ZM23.9,36.2 L23.7,37.5 L24.9,38.0 L24.5,36.5 L29.2,36.8 L32.7,38.7 L30.9,39.6 L28.1,39.9 L28.0,41.9 L27.3,42.3 L25.7,42.2 L24.4,41.5 L22.0,40.9 L21.6,40.0 L19.9,39.7 L17.9,39.9 L16.9,39.2 L17.3,38.5 L15.2,39.0 L16.0,39.9 L15.0,40.8 L15.0,32.6 L19.3,34.2 L23.9,36.2ZM17.3,28.7 L15.0,28.8 L15.0,27.4 L15.2,27.3 L16.7,27.3 L19.2,27.9 L19.1,28.2 L17.3,28.7ZM388.5,79.8 L389.0,79.2 L390.2,79.7 L390.8,79.8 L391.0,80.2 L391.3,80.2 L391.3,80.4 L392.1,80.9 L393.9,80.8 L393.6,81.5 L391.7,81.9 L389.3,83.1 L388.3,82.6 L388.7,81.7 L386.8,81.1 L387.1,80.7 L388.8,80.0 L388.5,79.8Z"/><path d="M191.8,119.1 L192.6,118.9 L193.8,119.0 L193.8,119.5 L191.9,119.8 L191.8,119.1ZM193.9,118.6 L195.2,119.5 L194.9,120.9 L194.6,120.7 L194.7,119.6 L193.9,118.8 L193.9,118.6ZM193.2,122.3 L193.7,122.4 L194.3,124.1 L194.3,125.3 L193.9,125.4 L193.4,124.2 L192.8,123.6 L193.2,122.3Z"/><path d="M222.9,280.3 L225.0,279.1 L226.5,279.6 L227.5,278.8 L228.9,279.7 L228.4,280.4 L226.0,281.0 L225.3,280.3 L223.8,281.2 L222.9,280.3Z"/><path d="M356.5,10.7 L357.2,10.0 L359.7,9.9 L361.9,10.6 L367.7,12.1 L363.3,12.9 L362.3,14.5 L360.8,14.8 L360.0,16.5 L357.8,16.6 L354.1,15.4 L355.7,14.6 L353.0,14.0 L349.6,12.3 L348.3,10.7 L353.0,10.0 L354.0,10.7 L356.5,10.7ZM384.4,31.4 L381.4,32.2 L380.0,32.4 L380.8,31.0 L378.5,30.2 L375.8,30.9 L375.0,32.4 L373.3,33.3 L371.4,32.8 L369.1,32.9 L367.2,31.8 L366.1,32.3 L365.0,32.4 L364.8,33.8 L361.5,33.4 L361.0,34.6 L359.3,34.6 L358.2,36.0 L356.4,38.3 L353.7,41.2 L354.4,41.9 L353.8,42.7 L352.0,42.7 L350.9,44.6 L351.0,47.3 L352.1,48.3 L351.5,50.8 L350.1,52.2 L349.3,53.3 L348.1,52.1 L344.7,54.5 L342.3,54.9 L339.9,53.9 L339.3,51.7 L338.7,47.0 L340.3,45.6 L345.0,43.9 L348.4,41.8 L351.6,38.9 L355.8,35.0 L358.8,33.4 L363.6,30.9 L367.4,30.0 L370.3,30.1 L373.0,28.4 L376.1,28.5 L379.3,28.1 L384.8,29.6 L382.5,30.1 L384.4,31.4ZM378.0,9.9 L375.4,11.0 L370.3,11.2 L365.1,10.9 L364.8,10.3 L362.3,10.3 L360.4,9.3 L365.8,8.8 L368.3,9.3 L370.1,8.7 L374.5,9.2 L378.0,9.9ZM373.3,14.4 L369.4,15.2 L366.3,14.8 L367.5,14.2 L366.4,13.6 L370.0,13.2 L370.7,13.9 L373.3,14.4Z"/><path d="M248.2,4.6 L254.0,3.4 L260.2,3.5 L262.4,2.7 L268.6,2.5 L282.6,2.8 L293.5,4.4 L290.3,5.2 L283.6,5.3 L274.2,5.5 L275.1,5.9 L281.3,5.6 L286.5,6.3 L289.9,5.7 L291.4,6.4 L289.5,7.6 L293.9,6.9 L302.4,6.1 L307.7,6.5 L308.6,7.4 L301.5,8.8 L300.5,9.3 L294.9,9.6 L299.0,9.7 L296.9,11.2 L295.5,12.6 L295.6,14.8 L297.7,16.2 L294.9,16.3 L292.1,16.9 L295.3,18.0 L295.7,19.7 L293.8,19.9 L296.1,21.7 L292.2,21.8 L294.2,22.7 L293.7,23.4 L291.2,23.7 L288.8,23.7 L291.0,25.1 L291.0,26.0 L287.5,25.2 L286.6,25.7 L289.0,26.2 L291.3,27.5 L291.9,29.1 L288.8,29.5 L287.5,28.7 L285.3,27.6 L285.9,29.0 L283.9,30.0 L288.5,30.1 L290.9,30.2 L286.2,32.0 L281.4,33.6 L276.3,34.3 L274.4,34.4 L272.6,35.1 L270.1,37.3 L266.4,38.7 L265.2,38.8 L262.8,39.3 L260.3,39.8 L258.8,41.1 L258.8,42.5 L257.9,43.9 L255.1,45.5 L255.8,47.1 L255.0,48.8 L254.1,50.8 L251.6,50.9 L249.0,49.3 L245.5,49.2 L243.8,48.1 L242.7,46.1 L239.6,43.6 L238.8,42.2 L238.5,40.4 L236.1,38.5 L236.7,37.0 L235.6,36.3 L237.3,33.9 L239.9,33.1 L240.6,32.2 L241.0,30.6 L239.0,31.4 L238.0,31.7 L236.5,32.0 L234.3,31.3 L234.2,29.9 L234.9,28.8 L236.5,28.8 L240.1,29.3 L237.1,28.0 L235.5,27.3 L233.8,27.6 L232.3,27.1 L234.2,25.2 L233.2,24.4 L231.8,23.0 L229.7,20.8 L227.5,20.0 L227.5,19.2 L222.8,18.0 L219.1,17.8 L214.4,17.9 L210.1,18.1 L208.1,17.4 L205.0,16.1 L209.6,15.5 L213.2,15.4 L205.7,14.8 L201.7,14.0 L202.0,13.2 L208.6,12.2 L215.0,11.2 L215.7,10.5 L211.0,9.8 L212.5,8.9 L218.5,7.5 L221.1,7.3 L220.4,6.4 L224.5,5.8 L229.9,5.5 L235.3,5.5 L237.2,6.1 L241.8,5.0 L246.0,5.8 L248.5,5.9 L252.1,6.6 L247.9,5.5 L248.2,4.6Z"/><path d="M450.6,273.7 L451.8,274.3 L453.4,274.6 L453.5,275.0 L453.0,275.9 L450.3,276.0 L450.3,274.9 L450.5,274.1 L450.6,273.7Z"/><path d="M548.7,192.2 L548.9,191.7 L550.4,191.3 L551.6,191.2 L552.2,191.0 L552.8,191.2 L552.2,191.8 L550.4,192.7 L548.9,193.3 L548.9,192.6 L548.7,192.2Z"/><path d="M358.6,232.6 L359.4,231.6 L360.1,232.1 L360.4,233.0 L361.2,233.2 L362.3,233.5 L363.3,233.4 L364.8,232.3 L364.8,224.8 L365.3,225.1 L366.3,227.0 L366.2,228.3 L366.6,229.0 L367.8,228.8 L368.7,227.9 L369.5,227.3 L369.9,226.3 L370.8,225.8 L371.5,226.0 L372.4,226.6 L373.8,226.7 L374.9,226.2 L375.1,225.6 L375.4,224.6 L376.4,224.5 L376.9,223.7 L377.5,222.3 L379.0,220.8 L381.5,219.3 L382.2,219.3 L383.1,219.7 L383.7,219.4 L384.6,219.6 L385.4,222.5 L385.9,224.0 L385.6,226.2 L385.7,227.0 L384.8,226.6 L384.3,226.7 L384.2,227.3 L383.7,228.1 L383.7,228.8 L384.7,229.9 L385.8,229.7 L386.1,228.8 L387.5,228.8 L387.0,230.3 L386.8,232.0 L386.4,232.9 L385.2,234.0 L384.8,234.3 L384.1,235.3 L383.6,236.4 L382.6,237.8 L380.6,240.0 L379.4,241.2 L378.1,242.1 L376.2,242.9 L375.3,243.0 L375.1,243.6 L374.1,243.3 L373.2,243.7 L371.3,243.3 L370.2,243.5 L369.5,243.4 L367.7,244.2 L366.2,244.6 L365.1,245.3 L364.3,245.4 L363.6,244.6 L363.0,244.6 L362.2,243.7 L362.2,244.0 L361.9,243.4 L361.9,242.2 L361.4,240.9 L361.9,240.5 L361.9,238.9 L360.7,237.0 L359.9,235.3 L359.9,235.2 L358.6,232.6Z"/><path d="M380.7,233.4 L381.3,234.0 L380.8,235.0 L380.5,235.6 L379.5,236.0 L379.2,236.6 L378.6,236.8 L377.2,235.2 L378.2,233.9 L379.1,233.1 L379.9,232.7 L380.7,233.4Z"/><path d="M125.0,107.3 L127.0,107.1 L129.2,106.9 L129.1,107.3 L131.7,108.3 L135.7,109.8 L139.2,109.7 L140.6,109.7 L140.6,108.9 L143.6,108.9 L144.2,109.6 L145.1,110.3 L146.2,111.2 L146.8,112.3 L147.2,113.4 L148.1,114.0 L149.6,114.6 L150.7,113.0 L152.1,113.0 L153.3,113.8 L154.2,115.2 L154.8,116.4 L155.8,117.5 L156.2,119.0 L156.7,119.9 L158.1,120.6 L159.3,121.0 L160.0,121.0 L159.3,122.8 L159.0,124.2 L158.9,127.0 L158.7,128.0 L159.0,129.1 L159.6,130.1 L159.9,131.7 L161.1,133.2 L161.5,134.4 L162.2,135.4 L164.0,135.9 L164.8,136.8 L166.3,136.2 L167.6,136.0 L168.9,135.7 L170.0,135.3 L171.1,134.5 L171.6,133.3 L171.7,131.5 L172.0,131.0 L173.2,130.4 L175.0,129.9 L176.6,130.0 L177.7,129.8 L178.1,130.3 L178.0,131.3 L177.1,132.5 L176.7,133.7 L177.0,134.1 L176.7,135.0 L176.3,136.6 L175.8,136.0 L175.5,136.1 L175.1,136.1 L174.5,137.3 L174.2,137.1 L174.0,137.2 L174.0,137.5 L172.4,137.5 L170.7,137.5 L170.7,138.6 L170.0,138.6 L170.6,139.3 L171.3,139.8 L171.4,140.2 L171.7,140.4 L171.7,141.1 L169.4,141.1 L168.6,142.7 L168.8,143.1 L168.6,143.6 L168.6,144.2 L166.6,142.0 L165.7,141.3 L164.3,140.8 L163.3,140.9 L161.9,141.7 L161.0,141.9 L159.8,141.4 L158.5,141.0 L156.8,140.0 L155.5,139.8 L153.5,138.8 L152.1,137.8 L151.6,137.3 L150.7,137.1 L148.9,136.5 L148.1,135.6 L146.3,134.4 L145.4,133.1 L145.0,132.1 L145.6,131.9 L145.4,131.3 L145.8,130.8 L145.8,130.1 L145.2,129.2 L145.0,128.3 L144.4,127.3 L142.9,125.3 L141.1,123.7 L140.3,122.4 L138.8,121.6 L138.5,121.1 L138.7,119.8 L137.8,119.3 L136.8,118.3 L136.4,116.9 L135.4,116.7 L134.4,115.6 L133.6,114.6 L133.5,114.0 L132.6,112.5 L132.0,110.9 L132.0,110.1 L130.7,109.3 L130.1,109.4 L129.1,108.8 L128.9,109.6 L129.2,110.6 L129.3,112.2 L129.9,113.0 L131.2,114.4 L131.5,114.9 L131.8,115.1 L132.0,115.8 L132.3,115.7 L132.7,117.1 L133.2,117.6 L133.6,118.3 L134.7,119.3 L135.3,121.2 L135.8,122.1 L136.3,123.1 L136.4,124.2 L137.2,124.3 L137.9,125.2 L138.5,126.1 L138.5,126.5 L137.8,127.2 L137.4,127.2 L137.0,126.0 L135.8,124.8 L134.6,123.8 L133.7,123.3 L133.7,121.8 L133.5,120.7 L132.6,120.0 L131.4,119.1 L131.2,119.4 L130.8,118.9 L129.7,118.4 L128.7,117.2 L128.8,117.0 L129.5,117.1 L130.2,116.4 L130.2,115.4 L128.9,114.0 L127.8,113.4 L127.2,112.1 L126.5,110.8 L125.7,109.1 L125.0,107.3Z"/><path d="M229.2,235.9 L230.3,235.7 L232.0,237.3 L232.7,237.3 L234.5,238.6 L235.9,239.7 L236.9,241.1 L236.1,242.1 L236.6,243.2 L235.8,244.5 L233.9,245.7 L232.6,245.2 L231.6,245.5 L230.0,244.6 L228.8,244.6 L227.8,243.5 L227.9,242.2 L228.3,241.7 L228.3,239.7 L228.7,237.6 L229.2,235.9Z"/><path d="M236.6,243.2 L236.1,242.1 L236.9,241.1 L235.9,239.7 L234.5,238.6 L232.7,237.3 L232.0,237.3 L230.3,235.7 L229.2,235.9 L231.5,233.1 L233.5,231.2 L234.6,230.3 L236.1,229.2 L236.2,227.6 L235.3,226.4 L234.4,226.8 L234.7,225.6 L235.0,224.4 L235.0,223.2 L234.4,222.9 L233.7,223.2 L233.0,223.1 L232.8,222.3 L232.7,220.4 L232.4,219.8 L231.2,219.3 L230.5,219.7 L228.6,219.3 L228.7,216.5 L228.2,215.4 L228.8,214.9 L228.6,213.8 L229.1,212.9 L229.4,211.3 L229.0,210.0 L228.0,209.4 L227.8,208.6 L228.1,207.4 L224.7,207.3 L224.0,204.9 L224.6,204.9 L224.5,204.0 L224.2,203.4 L224.1,202.2 L223.1,201.6 L222.0,201.7 L221.3,201.1 L220.1,200.7 L219.4,199.9 L217.4,199.5 L215.5,197.7 L215.7,196.3 L215.5,195.5 L215.7,194.0 L213.4,194.4 L212.4,195.1 L210.9,196.0 L210.5,196.6 L209.6,196.6 L208.3,196.5 L207.3,196.8 L206.5,196.6 L206.7,193.5 L205.2,194.7 L203.7,194.6 L203.0,193.5 L201.9,193.4 L202.2,192.5 L201.3,191.3 L200.5,189.4 L201.0,189.0 L201.0,188.2 L202.0,187.6 L201.9,186.5 L202.3,185.8 L202.4,184.8 L204.4,183.4 L205.9,183.0 L206.1,182.7 L207.7,182.8 L208.5,177.2 L208.5,176.3 L208.2,175.1 L207.5,174.4 L207.5,172.9 L208.5,172.6 L208.8,172.8 L208.9,172.0 L207.8,171.8 L207.8,170.5 L211.2,170.5 L211.8,169.8 L212.3,170.5 L212.6,171.7 L213.0,171.4 L213.9,172.5 L215.3,172.4 L215.6,171.8 L216.9,171.3 L217.7,170.9 L217.9,170.1 L219.1,169.5 L219.0,169.1 L217.5,168.9 L217.3,167.6 L217.4,166.2 L216.6,165.7 L216.9,165.5 L218.2,165.8 L219.6,166.3 L220.1,165.8 L221.4,165.5 L223.3,164.7 L223.9,163.9 L223.7,163.3 L224.6,163.2 L225.0,163.7 L224.8,164.6 L225.4,164.9 L225.8,165.9 L225.3,166.6 L225.0,168.4 L225.5,169.4 L225.6,170.3 L226.7,171.3 L227.6,171.4 L227.7,171.0 L228.3,170.9 L229.1,170.6 L229.7,170.0 L230.6,170.2 L231.1,170.1 L232.0,170.3 L232.2,169.9 L231.9,169.4 L232.0,168.9 L232.8,169.0 L233.6,168.8 L234.6,169.3 L235.3,169.7 L235.9,169.1 L236.3,169.2 L236.5,169.8 L237.4,169.6 L238.0,168.9 L238.6,167.4 L239.6,165.5 L240.2,165.4 L240.6,166.5 L241.6,170.1 L242.5,170.4 L242.6,171.9 L241.3,173.5 L241.8,174.2 L244.9,174.5 L245.0,176.5 L246.3,175.2 L248.5,175.9 L251.4,177.2 L252.3,178.4 L252.0,179.5 L254.0,178.9 L257.4,180.0 L260.0,179.9 L262.6,181.6 L264.9,183.9 L266.2,184.5 L267.7,184.6 L268.3,185.2 L268.9,187.8 L269.2,189.1 L268.5,192.4 L267.6,193.8 L265.2,196.6 L264.1,199.0 L262.8,200.7 L262.3,200.8 L261.8,202.3 L262.0,206.1 L261.5,209.3 L261.3,210.6 L260.7,211.4 L260.4,214.2 L258.6,216.9 L258.3,219.0 L256.9,219.9 L256.5,221.1 L254.6,221.1 L251.9,221.9 L250.6,222.8 L248.7,223.4 L246.6,225.0 L245.1,227.0 L244.9,228.6 L245.2,229.7 L244.8,231.8 L244.4,232.8 L243.2,233.9 L241.3,237.5 L239.7,239.1 L238.6,240.1 L237.8,242.1 L236.6,243.2Z"/><path d="M208.3,196.5 L209.6,196.6 L210.5,196.6 L210.9,196.0 L212.4,195.1 L213.4,194.4 L215.7,194.0 L215.5,195.5 L215.7,196.3 L215.5,197.7 L217.4,199.5 L219.4,199.9 L220.1,200.7 L221.3,201.1 L222.0,201.7 L223.1,201.6 L224.1,202.2 L224.2,203.4 L224.5,204.0 L224.6,204.9 L224.0,204.9 L224.7,207.3 L228.1,207.4 L227.8,208.6 L228.0,209.4 L229.0,210.0 L229.4,211.3 L229.1,212.9 L228.6,213.8 L228.8,214.9 L228.2,215.4 L228.2,214.7 L226.5,213.7 L224.9,213.7 L221.9,214.2 L221.0,216.1 L221.0,217.2 L220.3,219.6 L220.0,219.2 L218.0,219.1 L217.3,220.7 L216.3,219.3 L214.0,218.8 L212.6,220.6 L211.3,220.9 L210.6,218.1 L209.7,215.8 L210.2,213.8 L209.3,212.9 L209.1,211.4 L208.2,210.0 L209.3,207.8 L208.6,206.1 L209.0,205.4 L208.7,204.7 L209.3,203.6 L209.4,201.9 L209.5,200.4 L209.8,199.8 L208.3,196.5Z"/><path d="M207.7,182.8 L206.1,182.7 L205.9,183.0 L204.4,183.4 L202.4,184.8 L202.3,185.8 L201.9,186.5 L202.0,187.6 L201.0,188.2 L201.0,189.0 L200.5,189.4 L201.3,191.3 L202.2,192.5 L201.9,193.4 L203.0,193.5 L203.7,194.6 L205.2,194.7 L206.7,193.5 L206.5,196.6 L207.3,196.8 L208.3,196.5 L209.8,199.8 L209.5,200.4 L209.4,201.9 L209.3,203.6 L208.7,204.7 L209.0,205.4 L208.6,206.1 L209.3,207.8 L208.2,210.0 L207.7,211.1 L206.8,211.6 L205.1,210.4 L204.9,209.6 L201.5,207.5 L198.3,205.3 L197.0,204.0 L196.3,202.3 L196.5,201.7 L195.1,199.1 L193.3,195.3 L191.7,191.2 L191.0,190.3 L190.4,188.7 L189.1,187.4 L187.8,186.6 L188.4,185.7 L187.5,183.7 L188.1,182.3 L189.5,181.0 L189.7,181.8 L189.2,182.3 L189.2,183.1 L189.9,182.9 L190.7,183.1 L191.4,184.2 L192.4,183.3 L192.7,181.9 L193.8,180.2 L195.9,179.3 L197.8,177.2 L198.3,175.9 L198.1,174.3 L198.6,174.1 L199.7,175.1 L200.3,176.1 L201.1,176.6 L202.1,178.7 L203.4,179.0 L204.4,178.4 L205.0,178.8 L206.1,178.6 L207.4,179.6 L206.3,181.7 L206.8,181.7 L207.7,182.8Z"/><path d="M213.0,171.4 L212.6,171.7 L212.3,170.5 L211.8,169.8 L211.2,170.5 L207.8,170.5 L207.8,171.8 L208.9,172.0 L208.8,172.8 L208.5,172.6 L207.5,172.9 L207.5,174.4 L208.2,175.1 L208.5,176.3 L208.5,177.2 L207.7,182.8 L206.8,181.7 L206.3,181.7 L207.4,179.6 L206.1,178.6 L205.0,178.8 L204.4,178.4 L203.4,179.0 L202.1,178.7 L201.1,176.6 L200.3,176.1 L199.7,175.1 L198.6,174.1 L198.1,174.3 L197.3,173.8 L196.5,173.1 L196.0,173.5 L194.5,173.2 L194.1,172.3 L193.8,172.3 L192.0,171.2 L191.8,170.5 L192.4,170.4 L192.3,169.4 L192.8,168.6 L193.6,168.5 L194.4,167.2 L195.0,166.1 L194.4,165.6 L194.7,164.4 L194.3,162.6 L194.7,162.0 L194.4,160.3 L193.7,159.2 L193.9,158.2 L194.5,158.3 L194.8,157.7 L194.4,156.5 L194.6,156.2 L195.5,156.3 L196.8,154.9 L197.6,154.6 L197.6,154.0 L197.9,152.2 L198.9,151.3 L200.0,151.2 L200.2,150.8 L201.5,151.0 L202.9,149.9 L203.6,149.5 L204.4,148.5 L205.1,148.6 L205.5,149.2 L205.2,149.9 L204.0,150.2 L203.6,151.2 L202.9,151.8 L202.4,152.6 L202.2,154.0 L201.7,155.2 L202.6,155.4 L202.8,156.3 L203.2,156.8 L203.4,157.6 L203.2,158.4 L203.2,158.8 L203.7,159.0 L204.1,159.7 L206.3,159.5 L207.3,159.7 L208.6,161.5 L209.3,161.3 L210.5,161.4 L211.5,161.2 L212.2,161.5 L211.8,162.6 L211.4,163.3 L211.3,164.8 L211.7,166.1 L212.2,166.7 L212.2,167.2 L211.3,168.2 L212.0,168.7 L212.4,169.4 L213.0,171.4Z"/><path d="M194.6,156.2 L194.4,156.5 L194.8,157.7 L194.5,158.3 L193.9,158.2 L193.7,159.2 L193.1,158.6 L192.7,157.5 L193.2,156.9 L192.7,156.8 L192.4,156.1 L191.5,155.6 L190.8,155.7 L190.4,156.4 L189.7,156.9 L189.3,157.0 L189.2,157.4 L190.0,158.5 L189.5,158.8 L189.3,159.1 L188.4,159.2 L188.1,158.0 L187.9,158.3 L187.3,158.2 L187.0,157.4 L186.3,157.2 L185.8,157.0 L185.1,157.0 L185.0,157.4 L184.8,157.1 L184.9,156.7 L185.0,156.3 L185.0,155.9 L185.2,155.7 L184.9,155.4 L184.9,154.6 L185.5,154.4 L186.2,155.1 L186.1,155.6 L186.8,155.7 L187.0,155.5 L187.5,156.0 L188.3,155.8 L189.1,155.3 L190.1,154.9 L190.7,154.3 L191.7,154.4 L191.6,154.6 L192.6,154.7 L193.4,155.0 L194.0,155.7 L194.6,156.2Z"/><path d="M185.5,154.4 L184.9,154.6 L184.9,155.4 L185.2,155.7 L185.0,155.9 L185.0,156.3 L184.9,156.7 L184.8,157.1 L183.9,156.7 L183.5,156.3 L183.7,155.9 L183.6,155.4 L183.2,155.0 L182.5,154.6 L181.9,154.3 L181.8,153.7 L181.3,153.3 L181.4,153.9 L181.1,154.4 L180.7,153.8 L180.1,153.6 L179.9,153.2 L179.9,152.6 L180.1,152.0 L179.6,151.7 L180.0,151.3 L180.3,151.0 L181.4,151.5 L181.8,151.3 L182.4,151.5 L182.7,151.9 L183.2,152.0 L183.6,151.6 L184.0,152.7 L184.7,153.5 L185.5,154.4Z"/><path d="M183.6,151.6 L183.2,152.0 L182.7,151.9 L182.4,151.5 L181.8,151.3 L181.4,151.5 L180.3,151.0 L180.0,151.3 L179.4,150.6 L178.6,149.8 L178.2,149.1 L177.5,148.5 L176.6,147.5 L176.8,147.2 L177.1,147.5 L177.2,147.4 L177.7,147.3 L178.0,146.8 L178.2,146.8 L178.2,145.8 L178.6,145.8 L179.0,145.8 L179.3,145.2 L179.8,145.6 L180.0,145.4 L180.3,145.1 L181.0,144.6 L181.0,144.2 L181.2,144.2 L181.4,143.7 L181.6,143.6 L181.9,143.9 L182.2,144.0 L182.6,143.8 L183.0,143.8 L183.6,143.5 L183.9,143.2 L184.5,143.3 L184.3,143.5 L184.3,143.9 L184.4,144.7 L184.0,145.4 L183.8,146.2 L183.8,147.1 L183.9,147.6 L183.9,148.5 L183.7,148.7 L183.5,149.6 L183.6,150.2 L183.3,150.7 L183.3,151.2 L183.6,151.6Z"/><path d="M184.5,143.3 L183.9,143.2 L183.6,143.5 L183.0,143.8 L182.6,143.8 L182.2,144.0 L181.9,143.9 L181.6,143.6 L181.4,143.7 L181.2,144.2 L181.0,144.2 L181.0,144.6 L180.3,145.1 L180.0,145.4 L179.8,145.6 L179.3,145.2 L179.0,145.8 L178.6,145.8 L178.2,145.8 L178.2,146.8 L178.0,146.8 L177.7,147.3 L177.2,147.4 L176.9,146.7 L176.4,146.6 L176.5,145.7 L176.2,145.5 L175.9,145.4 L175.1,145.6 L175.1,145.3 L174.5,145.0 L174.1,144.6 L173.6,144.4 L174.0,143.9 L173.9,143.5 L174.0,143.1 L174.8,142.5 L175.6,141.8 L175.8,141.8 L176.2,141.5 L176.7,141.4 L176.8,141.6 L177.1,141.5 L177.9,141.7 L178.7,141.6 L179.3,141.4 L179.5,141.2 L180.1,141.3 L180.5,141.4 L180.9,141.4 L181.3,141.2 L182.1,141.5 L182.4,141.5 L182.9,141.9 L183.4,142.4 L184.0,142.7 L184.5,143.3Z"/><path d="M173.6,144.4 L174.1,144.6 L174.5,145.0 L175.1,145.3 L175.1,145.6 L175.9,145.4 L176.2,145.5 L176.5,145.7 L176.4,146.6 L176.2,147.0 L175.2,147.0 L174.5,146.8 L173.8,146.4 L172.8,146.3 L172.3,145.8 L172.4,145.5 L173.0,145.0 L173.3,144.8 L173.2,144.6 L173.6,144.4Z"/><path d="M168.6,144.2 L168.6,143.6 L168.8,143.1 L168.6,142.7 L169.4,141.1 L171.7,141.1 L171.7,140.4 L171.4,140.2 L171.3,139.8 L170.6,139.3 L170.0,138.6 L170.7,138.6 L170.7,137.5 L172.4,137.5 L174.0,137.5 L174.0,139.1 L173.8,141.4 L174.4,141.4 L174.9,141.8 L175.1,141.5 L175.6,141.8 L174.8,142.5 L174.0,143.1 L173.9,143.5 L174.0,143.9 L173.6,144.4 L173.2,144.6 L173.3,144.8 L173.0,145.0 L172.4,145.5 L172.3,145.8 L171.4,145.5 L170.3,145.4 L169.5,145.0 L168.6,144.2Z"/><path d="M174.0,137.5 L174.0,137.2 L174.2,137.1 L174.5,137.3 L175.1,136.1 L175.5,136.1 L175.5,136.4 L175.8,136.4 L175.8,136.9 L175.5,137.8 L175.7,138.1 L175.5,138.9 L175.6,139.1 L175.4,140.1 L175.0,140.7 L174.7,140.7 L174.4,141.4 L173.8,141.4 L174.0,139.1 L174.0,137.5Z"/><path d="M223.7,163.3 L223.9,163.9 L223.3,164.7 L221.4,165.5 L220.1,165.8 L219.6,166.3 L218.2,165.8 L216.9,165.5 L216.6,165.7 L217.4,166.2 L217.3,167.6 L217.5,168.9 L219.0,169.1 L219.1,169.5 L217.9,170.1 L217.7,170.9 L216.9,171.3 L215.6,171.8 L215.3,172.4 L213.9,172.5 L213.0,171.4 L212.4,169.4 L212.0,168.7 L211.3,168.2 L212.2,167.2 L212.2,166.7 L211.7,166.1 L211.3,164.8 L211.4,163.3 L211.8,162.6 L212.2,161.5 L211.5,161.2 L210.5,161.4 L209.3,161.3 L208.6,161.5 L207.3,159.7 L206.3,159.5 L204.1,159.7 L203.7,159.0 L203.2,158.8 L203.2,158.4 L203.4,157.6 L203.2,156.8 L202.8,156.3 L202.6,155.4 L201.7,155.2 L202.2,154.0 L202.4,152.6 L202.9,151.8 L203.6,151.2 L204.0,150.2 L205.2,149.9 L205.1,150.3 L204.1,150.6 L204.7,151.5 L204.6,152.6 L203.9,153.8 L204.5,155.4 L205.3,155.3 L205.7,153.8 L205.1,153.1 L205.0,151.5 L207.2,150.7 L207.0,149.7 L207.6,149.1 L208.2,150.5 L209.5,150.5 L210.6,151.7 L210.7,152.4 L212.2,152.4 L214.1,152.2 L215.1,153.1 L216.4,153.3 L217.4,152.7 L217.4,152.2 L219.6,152.1 L221.7,152.0 L220.2,152.6 L220.8,153.6 L222.2,153.8 L223.5,154.8 L223.8,156.4 L224.7,156.4 L225.4,156.8 L224.0,158.1 L223.9,158.8 L224.5,159.6 L224.0,159.9 L223.0,160.3 L223.0,161.2 L222.5,161.8 L223.7,163.3Z"/><path d="M231.1,170.1 L230.6,170.2 L229.7,170.0 L229.1,170.6 L228.3,170.9 L227.7,171.0 L227.6,171.4 L226.7,171.3 L225.6,170.3 L225.5,169.4 L225.0,168.4 L225.3,166.6 L225.8,165.9 L225.4,164.9 L224.8,164.6 L225.0,163.7 L224.6,163.2 L223.7,163.3 L222.5,161.8 L223.0,161.2 L223.0,160.3 L224.0,159.9 L224.5,159.6 L223.9,158.8 L224.0,158.1 L225.4,156.8 L226.6,157.6 L227.7,158.9 L227.7,160.0 L228.4,160.0 L229.3,161.0 L230.0,161.8 L229.7,163.6 L228.6,164.1 L228.7,164.6 L228.4,165.7 L229.2,167.2 L229.8,167.2 L230.0,168.3 L231.1,170.1Z"/><path d="M234.6,169.3 L233.6,168.8 L232.8,169.0 L232.0,168.9 L231.9,169.4 L232.2,169.9 L232.0,170.3 L231.1,170.1 L230.0,168.3 L229.8,167.2 L229.2,167.2 L228.4,165.7 L228.7,164.6 L228.6,164.1 L229.7,163.6 L230.0,161.8 L232.1,162.2 L232.3,161.8 L233.7,161.6 L235.6,162.2 L234.7,164.0 L234.8,165.4 L235.5,166.6 L235.2,167.5 L235.0,168.4 L234.6,169.3Z"/><path d="M239.6,165.5 L238.6,167.4 L238.0,168.9 L237.4,169.6 L236.5,169.8 L236.3,169.2 L235.9,169.1 L235.3,169.7 L234.6,169.3 L235.0,168.4 L235.2,167.5 L235.5,166.6 L234.8,165.4 L234.7,164.0 L235.6,162.2 L236.2,162.4 L237.5,162.9 L239.3,164.6 L239.6,165.5ZM340.8,72.6 L341.7,73.1 L344.2,73.5 L343.3,74.9 L343.1,76.4 L342.6,76.7 L341.8,76.5 L341.8,77.1 L340.6,78.2 L340.5,79.1 L341.4,78.8 L342.0,79.7 L341.9,80.3 L342.4,81.1 L341.8,81.7 L342.3,83.3 L343.2,83.5 L343.0,84.4 L341.4,85.6 L338.0,85.0 L335.4,85.7 L335.2,86.9 L333.2,87.2 L331.2,86.3 L330.6,86.7 L327.4,85.8 L326.7,85.0 L327.6,83.8 L327.9,79.7 L326.1,77.5 L324.8,76.5 L322.1,75.7 L322.0,74.2 L324.2,73.8 L327.2,74.3 L326.6,72.0 L328.3,72.8 L332.3,71.2 L332.9,69.6 L334.4,69.1 L334.7,69.9 L335.5,69.9 L336.3,70.7 L337.5,71.7 L338.4,71.5 L339.9,72.5 L340.3,72.6 L340.8,72.6ZM345.3,86.6 L346.4,85.8 L346.7,87.6 L346.2,89.2 L345.4,88.8 L345.0,87.4 L345.3,86.6Z"/><path d="M198.1,174.3 L198.3,175.9 L197.8,177.2 L195.9,179.3 L193.8,180.2 L192.7,181.9 L192.4,183.3 L191.4,184.2 L190.7,183.1 L189.9,182.9 L189.2,183.1 L189.2,182.3 L189.7,181.8 L189.5,181.0 L190.4,179.4 L190.0,178.6 L189.4,179.5 L188.3,178.6 L188.7,178.0 L188.4,176.2 L189.0,175.9 L189.3,174.6 L190.0,173.3 L189.8,172.4 L190.8,172.0 L192.0,171.2 L193.8,172.3 L194.1,172.3 L194.5,173.2 L196.0,173.5 L196.5,173.1 L197.3,173.8 L198.1,174.3Z"/><path d="M214.0,136.0 L214.9,136.2 L215.2,136.6 L214.8,137.1 L213.5,137.1 L212.4,137.2 L212.3,136.3 L212.6,136.0 L214.0,136.0Z"/><path d="M194.3,136.1 L195.4,136.3 L196.4,136.8 L196.7,137.3 L195.4,137.4 L194.9,137.7 L193.9,137.4 L192.9,136.6 L193.1,136.2 L193.9,136.0 L194.3,136.1Z"/><path d="M186.0,126.5 L187.5,126.6 L188.9,126.6 L190.6,127.3 L191.3,128.1 L192.9,127.9 L193.5,128.3 L195.0,129.6 L196.1,130.5 L196.7,130.5 L197.7,130.9 L197.6,131.5 L198.9,131.6 L200.2,132.4 L200.0,132.9 L198.8,133.2 L197.6,133.3 L196.4,133.1 L193.9,133.3 L195.1,132.2 L194.4,131.6 L193.3,131.5 L192.7,130.9 L192.2,129.7 L191.3,129.8 L189.6,129.3 L189.1,128.8 L186.8,128.5 L186.2,128.1 L186.9,127.6 L185.1,127.5 L183.9,128.6 L183.2,128.6 L182.9,129.1 L182.0,129.3 L181.3,129.1 L182.2,128.5 L182.6,127.7 L183.4,127.3 L184.3,126.9 L185.6,126.7 L186.0,126.5Z"/><path d="M384.6,219.6 L383.7,219.4 L383.1,219.7 L382.2,219.3 L381.5,219.3 L380.4,218.4 L379.0,218.0 L378.5,216.7 L378.5,216.0 L377.8,215.8 L375.8,213.6 L375.2,212.4 L374.9,212.0 L374.2,210.4 L376.2,210.6 L376.7,210.8 L377.3,210.8 L378.3,209.4 L379.8,207.8 L380.4,207.6 L380.7,206.9 L381.7,206.1 L383.0,205.8 L383.1,206.6 L384.6,206.5 L385.4,206.9 L385.7,207.5 L386.6,207.6 L387.5,208.3 L387.5,210.9 L387.1,212.3 L387.1,213.8 L387.4,214.4 L387.2,215.6 L386.9,215.8 L386.4,217.3 L384.6,219.6Z"/><path d="M381.5,219.3 L379.0,220.8 L377.5,222.3 L376.9,223.7 L376.4,224.5 L375.4,224.6 L375.1,225.6 L374.9,226.2 L373.8,226.7 L372.4,226.6 L371.5,226.0 L370.8,225.8 L369.9,226.3 L369.5,227.3 L368.7,227.9 L367.8,228.8 L366.6,229.0 L366.2,228.3 L366.3,227.0 L365.3,225.1 L364.8,224.8 L364.8,218.8 L366.5,218.7 L366.6,211.4 L367.9,211.3 L370.6,210.6 L371.3,211.5 L372.4,210.7 L372.9,210.7 L373.9,210.2 L374.2,210.4 L374.9,212.0 L375.2,212.4 L375.8,213.6 L377.8,215.8 L378.5,216.0 L378.5,216.7 L379.0,218.0 L380.4,218.4 L381.5,219.3Z"/><path d="M364.8,224.8 L364.8,232.3 L363.3,233.4 L362.3,233.5 L361.2,233.2 L360.4,233.0 L360.1,232.1 L359.4,231.6 L358.6,232.6 L357.3,231.0 L356.6,229.5 L356.2,227.5 L355.8,226.1 L355.2,222.9 L355.2,220.4 L355.0,219.3 L354.3,218.5 L353.4,216.8 L352.4,214.3 L352.1,213.0 L350.6,211.0 L350.5,209.5 L351.4,209.1 L352.4,208.7 L353.6,208.8 L354.6,209.7 L354.9,209.6 L362.0,209.5 L363.2,210.5 L367.4,210.8 L370.6,209.9 L372.1,209.5 L373.2,209.6 L373.9,210.0 L373.9,210.2 L372.9,210.7 L372.4,210.7 L371.3,211.5 L370.6,210.6 L367.9,211.3 L366.6,211.4 L366.5,218.7 L364.8,218.8 L364.8,224.8Z"/><path d="M300.8,146.1 L300.0,144.5 L299.2,143.8 L299.9,143.4 L300.8,142.0 L301.2,140.9 L301.8,140.3 L302.7,140.4 L303.5,140.0 L304.5,140.0 L305.3,140.6 L306.5,141.1 L307.5,142.6 L308.7,144.0 L308.8,145.3 L309.1,146.5 L309.8,147.1 L309.9,147.9 L309.9,148.5 L309.6,148.6 L308.6,148.4 L308.5,148.7 L308.1,148.7 L306.9,148.2 L306.0,148.2 L302.8,148.1 L302.3,148.3 L301.7,148.3 L300.8,148.6 L300.5,147.0 L302.1,147.1 L302.5,146.8 L302.9,146.8 L303.5,146.3 L304.3,146.7 L305.0,146.8 L305.8,146.3 L305.4,145.7 L304.8,146.1 L304.3,146.1 L303.6,145.6 L303.1,145.6 L302.7,146.1 L300.8,146.1Z"/><path d="M309.9,148.5 L309.9,147.9 L309.8,147.1 L309.1,146.5 L308.8,145.3 L308.7,144.0 L309.3,143.7 L309.6,142.5 L310.1,142.4 L311.4,143.0 L312.3,142.6 L313.0,142.7 L313.3,142.3 L320.3,142.2 L320.7,140.8 L320.4,140.5 L319.6,131.7 L318.7,122.8 L321.4,122.8 L327.3,127.3 L333.2,131.7 L333.6,132.7 L334.7,133.3 L335.5,133.6 L335.5,134.9 L337.5,134.7 L337.5,139.5 L336.5,140.8 L336.4,142.1 L334.8,142.4 L332.4,142.6 L331.8,143.3 L330.7,143.4 L329.5,143.4 L329.1,143.0 L328.1,143.3 L326.5,144.2 L326.2,144.8 L324.8,145.7 L324.6,146.2 L323.8,146.7 L323.0,146.4 L322.5,146.9 L322.3,148.3 L320.9,150.0 L320.9,150.7 L320.4,151.5 L320.5,152.7 L319.8,153.0 L319.4,153.3 L319.1,152.4 L318.6,152.7 L318.3,152.6 L318.0,153.2 L316.7,153.2 L316.2,152.9 L315.9,153.1 L315.4,152.5 L315.5,151.9 L315.3,151.6 L314.9,151.8 L315.0,151.2 L315.3,150.6 L314.6,149.8 L314.4,149.2 L314.0,148.8 L313.7,148.7 L313.3,149.0 L312.7,149.3 L312.2,149.7 L311.5,149.6 L311.0,149.0 L310.7,149.0 L310.2,149.2 L310.0,149.2 L309.9,148.5Z"/><path d="M300.1,131.0 L300.5,130.3 L307.4,130.3 L307.0,127.3 L307.5,126.3 L309.1,126.1 L309.1,120.8 L314.8,120.9 L314.8,117.8 L321.4,122.8 L318.7,122.8 L319.6,131.7 L320.4,140.5 L320.7,140.8 L320.3,142.2 L313.3,142.3 L313.0,142.7 L312.3,142.6 L311.4,143.0 L310.1,142.4 L309.6,142.5 L309.3,143.7 L308.7,144.0 L307.5,142.6 L306.5,141.1 L305.3,140.6 L304.5,140.0 L303.5,140.0 L302.7,140.4 L301.8,140.3 L301.2,140.9 L301.0,139.8 L301.5,138.8 L301.7,136.9 L301.6,134.9 L301.3,133.8 L301.5,132.8 L301.1,131.8 L300.1,131.0Z"/><path d="M334.7,161.2 L333.3,161.4 L332.8,160.0 L332.9,155.3 L332.6,154.9 L332.5,153.9 L331.9,153.1 L331.4,152.5 L331.6,151.5 L332.2,151.2 L332.5,150.3 L333.4,150.1 L333.8,149.5 L334.4,148.9 L335.0,148.9 L336.3,150.1 L336.3,150.8 L336.6,152.0 L336.3,152.8 L336.5,153.4 L335.6,154.6 L335.1,155.3 L334.8,156.6 L334.8,157.9 L334.7,161.2Z"/><path d="M356.0,127.1 L356.4,130.3 L357.1,130.9 L357.1,131.5 L357.8,132.2 L357.5,133.1 L356.8,137.2 L356.7,139.9 L354.5,141.8 L353.7,144.5 L354.4,145.3 L354.4,146.6 L355.5,146.7 L355.4,147.6 L354.9,147.8 L354.8,148.4 L354.5,148.5 L353.3,146.2 L352.9,146.1 L351.5,147.3 L350.2,146.7 L349.2,146.6 L348.7,146.8 L347.7,146.8 L346.7,147.7 L345.8,147.7 L343.7,146.6 L342.8,147.1 L341.9,147.1 L341.3,146.3 L339.5,145.6 L337.6,145.8 L337.2,146.3 L336.9,147.4 L336.4,148.3 L336.3,150.1 L335.0,148.9 L334.4,148.9 L333.8,149.5 L333.8,148.1 L331.8,147.7 L331.7,146.7 L330.8,145.3 L330.5,144.4 L330.7,143.4 L331.8,143.3 L332.4,142.6 L334.8,142.4 L336.4,142.1 L336.5,140.8 L337.5,139.5 L337.5,134.7 L339.9,133.8 L345.0,129.8 L351.0,125.9 L353.8,126.8 L354.8,127.9 L356.0,127.1Z"/><path d="M334.7,161.2 L334.8,157.9 L334.8,156.6 L335.1,155.3 L335.6,154.6 L336.5,153.4 L336.3,152.8 L336.6,152.0 L336.3,150.8 L336.3,150.1 L336.4,148.3 L336.9,147.4 L337.2,146.3 L337.6,145.8 L339.5,145.6 L341.3,146.3 L341.9,147.1 L342.8,147.1 L343.7,146.6 L345.8,147.7 L346.7,147.7 L347.7,146.8 L348.7,146.8 L349.2,146.6 L350.2,146.7 L351.5,147.3 L352.9,146.1 L353.3,146.2 L354.5,148.5 L354.8,148.4 L355.5,149.2 L355.3,149.6 L355.2,150.3 L353.8,151.9 L353.3,153.2 L353.0,154.2 L352.7,154.7 L352.3,156.1 L351.4,157.0 L351.1,158.0 L350.7,158.8 L350.6,159.7 L349.4,160.4 L348.4,159.5 L347.7,159.6 L346.7,160.8 L346.2,160.8 L345.3,162.8 L344.9,164.2 L343.1,165.0 L342.4,164.8 L341.7,165.3 L340.3,165.3 L339.4,164.0 L338.8,162.5 L337.6,161.1 L336.3,161.2 L334.7,161.2Z"/><path d="M355.4,147.6 L356.1,149.0 L356.2,150.3 L356.1,151.7 L357.1,153.5 L356.1,153.5 L355.6,153.7 L354.8,153.5 L354.4,154.4 L355.5,155.6 L356.2,156.0 L356.5,156.8 L357.0,158.2 L356.7,158.8 L355.9,160.9 L355.4,161.2 L355.3,162.8 L355.5,163.7 L355.3,164.3 L356.2,165.4 L356.3,166.1 L357.0,167.2 L357.8,167.8 L357.8,168.8 L358.0,169.4 L357.9,170.5 L356.5,170.0 L355.1,169.4 L352.9,169.4 L352.7,169.2 L351.6,169.5 L350.6,169.2 L349.7,169.4 L346.9,169.3 L347.1,167.7 L346.5,166.3 L345.7,166.0 L345.3,165.1 L344.9,164.8 L344.9,164.2 L345.3,162.8 L346.2,160.8 L346.7,160.8 L347.7,159.6 L348.4,159.5 L349.4,160.4 L350.6,159.7 L350.7,158.8 L351.1,158.0 L351.4,157.0 L352.3,156.1 L352.7,154.7 L353.0,154.2 L353.3,153.2 L353.8,151.9 L355.2,150.3 L355.3,149.6 L355.5,149.2 L354.8,148.4 L354.9,147.8 L355.4,147.6Z"/><path d="M331.6,151.5 L331.4,152.5 L331.9,153.1 L332.5,153.9 L332.6,154.9 L332.9,155.3 L332.8,160.0 L333.3,161.4 L331.9,161.8 L331.5,161.1 L331.0,159.8 L330.9,158.8 L331.2,157.0 L330.8,156.2 L330.6,154.6 L330.6,153.1 L329.9,152.1 L330.0,151.4 L331.6,151.5Z"/><path d="M330.0,151.4 L329.9,152.1 L330.6,153.1 L330.6,154.6 L330.8,156.2 L331.2,157.0 L330.9,158.8 L331.0,159.8 L331.5,161.1 L331.9,161.8 L329.1,163.0 L328.1,163.7 L326.6,164.3 L325.0,163.8 L325.1,163.0 L324.3,161.2 L324.8,158.9 L325.5,157.1 L325.1,154.2 L324.8,152.7 L324.9,151.5 L327.9,151.4 L328.7,151.6 L329.2,151.2 L330.0,151.4Z"/><path d="M315.9,153.1 L316.2,152.9 L316.7,153.2 L318.0,153.2 L318.3,152.6 L318.6,152.7 L319.1,152.4 L319.4,153.3 L319.8,153.0 L320.5,152.7 L321.3,153.2 L321.6,153.9 L322.4,154.3 L323.0,153.8 L323.9,153.7 L325.1,154.2 L325.5,157.1 L324.8,158.9 L324.3,161.2 L325.1,163.0 L325.0,163.8 L324.2,163.8 L323.0,163.4 L321.9,163.4 L319.8,163.8 L318.6,164.4 L316.8,165.1 L316.5,165.1 L316.6,163.4 L316.8,163.1 L316.8,162.3 L316.0,161.4 L315.5,161.3 L314.9,160.7 L315.3,159.8 L315.2,158.8 L315.2,158.2 L315.5,158.2 L315.6,157.3 L315.5,157.0 L315.6,156.7 L316.3,156.4 L315.9,154.8 L315.5,153.9 L315.6,153.2 L315.9,153.1Z"/><path d="M306.0,148.2 L306.9,148.2 L308.1,148.7 L308.5,148.7 L308.6,148.4 L309.6,148.6 L309.9,148.5 L310.0,149.2 L310.2,149.2 L310.7,149.0 L311.0,149.0 L311.5,149.6 L312.2,149.7 L312.7,149.3 L313.3,149.0 L313.7,148.7 L314.0,148.8 L314.4,149.2 L314.6,149.8 L315.3,150.6 L315.0,151.2 L314.9,151.8 L315.3,151.6 L315.5,151.9 L315.4,152.5 L315.9,153.1 L315.6,153.2 L315.5,153.9 L315.9,154.8 L316.3,156.4 L315.6,156.7 L315.5,157.0 L315.6,157.3 L315.5,158.2 L315.2,158.2 L314.7,158.2 L314.4,159.0 L313.9,159.0 L313.5,158.6 L313.7,157.7 L312.9,156.5 L312.5,156.7 L312.1,156.8 L311.6,156.9 L311.6,156.1 L311.4,155.6 L311.4,155.0 L311.0,154.1 L310.5,153.4 L309.1,153.4 L308.7,153.8 L308.3,153.8 L308.0,154.3 L307.8,154.8 L306.8,155.7 L306.1,154.5 L305.4,153.7 L304.9,153.5 L304.5,153.1 L304.3,152.2 L304.0,151.7 L303.5,151.4 L304.3,150.4 L304.8,150.4 L305.3,150.1 L305.7,150.1 L305.9,149.8 L305.8,149.1 L306.0,148.9 L306.0,148.2Z"/><path d="M300.8,148.6 L301.7,148.3 L302.3,148.3 L302.8,148.1 L306.0,148.2 L306.0,148.9 L305.8,149.1 L305.9,149.8 L305.7,150.1 L305.3,150.1 L304.8,150.4 L304.3,150.4 L303.5,151.4 L302.6,150.5 L301.9,150.4 L301.4,149.8 L301.5,149.5 L300.9,149.0 L300.8,148.6Z"/><path d="M315.2,158.2 L315.2,158.8 L315.3,159.8 L314.9,160.7 L315.5,161.3 L316.0,161.4 L316.8,162.3 L316.8,163.1 L316.6,163.4 L316.5,165.1 L316.0,165.1 L314.2,164.1 L312.7,162.5 L311.2,161.4 L310.0,160.1 L310.4,159.4 L310.5,158.8 L311.3,157.7 L312.1,156.8 L312.5,156.7 L312.9,156.5 L313.7,157.7 L313.5,158.6 L313.9,159.0 L314.4,159.0 L314.7,158.2 L315.2,158.2Z"/><path d="M306.8,155.7 L307.8,154.8 L308.0,154.3 L308.3,153.8 L308.7,153.8 L309.1,153.4 L310.5,153.4 L311.0,154.1 L311.4,155.0 L311.4,155.6 L311.6,156.1 L311.6,156.9 L312.1,156.8 L311.3,157.7 L310.5,158.8 L310.4,159.4 L310.0,160.1 L309.5,159.9 L308.3,159.1 L307.3,158.0 L307.0,157.3 L306.8,155.7Z"/><path d="M320.5,152.7 L320.4,151.5 L320.9,150.7 L320.9,150.0 L322.3,148.3 L322.5,146.9 L323.0,146.4 L323.8,146.7 L324.6,146.2 L324.8,145.7 L326.2,144.8 L326.5,144.2 L328.1,143.3 L329.1,143.0 L329.5,143.4 L330.7,143.4 L330.5,144.4 L330.8,145.3 L331.7,146.7 L331.8,147.7 L333.8,148.1 L333.8,149.5 L333.4,150.1 L332.5,150.3 L332.2,151.2 L331.6,151.5 L330.0,151.4 L329.2,151.2 L328.7,151.6 L327.9,151.4 L324.9,151.5 L324.8,152.7 L325.1,154.2 L323.9,153.7 L323.0,153.8 L322.4,154.3 L321.6,153.9 L321.3,153.2 L320.5,152.7Z"/><path d="M377.9,163.3 L377.3,163.5 L376.2,163.4 L374.9,163.2 L374.2,163.4 L374.0,163.9 L373.4,164.0 L372.7,163.5 L370.8,164.6 L370.0,164.3 L369.7,164.5 L369.2,165.7 L367.9,165.3 L366.6,165.1 L365.5,164.4 L364.1,163.7 L363.1,164.3 L362.5,165.4 L362.3,166.8 L361.2,166.7 L360.0,166.4 L358.9,167.4 L358.0,169.4 L357.8,168.8 L357.8,167.8 L357.0,167.2 L356.3,166.1 L356.2,165.4 L355.3,164.3 L355.5,163.7 L355.3,162.8 L355.4,161.2 L355.9,160.9 L356.7,158.8 L358.2,158.6 L358.5,158.1 L358.8,158.1 L359.2,158.6 L361.4,157.8 L362.2,157.0 L363.1,156.3 L362.9,155.6 L363.4,155.4 L365.1,155.5 L366.8,154.6 L368.0,152.3 L368.9,151.5 L370.0,151.2 L370.2,152.0 L371.2,153.3 L371.2,154.2 L370.9,155.0 L371.1,155.6 L371.7,156.2 L373.0,157.1 L374.0,158.0 L374.0,158.6 L375.1,159.7 L375.9,160.6 L376.3,161.8 L377.6,162.6 L377.9,163.3Z"/><path d="M362.3,166.8 L362.2,168.1 L361.7,169.2 L361.3,170.4 L361.1,172.2 L361.2,173.4 L360.9,174.1 L360.9,174.9 L360.7,175.5 L359.5,176.5 L358.7,177.6 L358.0,179.6 L358.0,181.2 L357.6,181.9 L356.5,182.9 L355.5,184.2 L354.9,183.8 L354.8,183.2 L353.8,183.2 L353.2,184.0 L352.7,183.8 L352.1,183.1 L351.6,183.4 L350.9,184.3 L349.4,182.2 L350.7,181.0 L350.1,179.7 L350.7,179.2 L351.9,178.9 L352.0,178.0 L352.9,179.0 L354.5,179.1 L355.0,178.1 L355.2,176.7 L355.1,175.1 L354.2,173.9 L355.0,171.5 L354.5,171.1 L353.2,171.3 L352.8,170.2 L352.9,169.4 L355.1,169.4 L356.5,170.0 L357.9,170.5 L358.0,169.4 L358.9,167.4 L360.0,166.4 L361.2,166.7 L362.3,166.8Z"/><path d="M349.7,169.4 L350.6,169.2 L351.6,169.5 L352.7,169.2 L352.9,169.4 L352.8,170.2 L353.2,171.3 L354.5,171.1 L355.0,171.5 L354.2,173.9 L355.1,175.1 L355.2,176.7 L355.0,178.1 L354.5,179.1 L352.9,179.0 L352.0,178.0 L351.9,178.9 L350.7,179.2 L350.1,179.7 L350.7,181.0 L349.4,182.2 L347.6,180.1 L346.5,178.4 L345.4,176.3 L345.5,175.6 L345.8,174.9 L346.3,173.4 L346.6,171.9 L347.2,171.8 L349.7,171.8 L349.7,169.4Z"/><path d="M346.9,169.3 L349.7,169.4 L349.7,171.8 L347.2,171.8 L346.6,171.9 L346.3,171.6 L346.9,169.3Z"/><path d="M383.8,191.1 L384.5,191.6 L385.2,192.0 L386.3,192.3 L387.3,192.9 L388.2,193.8 L388.6,195.6 L388.3,196.1 L388.0,197.8 L388.3,199.5 L387.7,200.2 L387.2,202.1 L388.1,202.6 L382.8,204.3 L383.0,205.8 L381.7,206.1 L380.7,206.9 L380.4,207.6 L379.8,207.8 L378.3,209.4 L377.3,210.8 L376.7,210.8 L376.2,210.6 L374.2,210.4 L373.9,210.2 L373.9,210.0 L373.2,209.6 L372.1,209.5 L370.6,209.9 L369.5,208.6 L368.3,207.0 L368.4,200.4 L372.0,200.5 L371.9,199.8 L372.1,199.0 L371.8,198.0 L372.0,197.0 L371.8,196.4 L372.5,196.5 L372.6,197.1 L373.4,197.0 L374.5,197.2 L375.1,198.2 L376.5,198.4 L377.5,197.8 L377.9,198.9 L379.3,199.2 L379.9,200.0 L380.6,201.2 L382.0,201.2 L381.8,199.0 L381.3,199.3 L380.1,198.5 L379.7,198.2 L379.9,196.1 L380.2,193.7 L379.8,192.8 L380.3,191.5 L380.8,191.2 L383.1,190.9 L383.8,191.1Z"/><path d="M387.3,192.9 L389.0,193.3 L389.4,193.9 L390.0,194.8 L390.5,197.6 L390.0,199.2 L390.5,201.8 L391.1,201.8 L391.7,202.5 L392.5,204.0 L392.6,206.6 L391.8,207.0 L391.3,208.4 L390.2,207.2 L390.0,205.7 L390.4,204.8 L390.3,204.0 L389.6,203.4 L389.1,203.6 L388.1,202.6 L387.2,202.1 L387.7,200.2 L388.3,199.5 L388.0,197.8 L388.3,196.1 L388.6,195.6 L388.2,193.8 L387.3,192.9Z"/><path d="M390.5,197.6 L391.8,197.5 L393.9,198.0 L394.4,197.8 L395.6,197.7 L396.2,197.1 L397.2,197.1 L399.2,196.3 L400.6,195.2 L400.6,195.2 L400.6,195.2 L400.8,196.1 L400.8,198.1 L401.0,199.9 L401.0,203.1 L401.4,204.1 L400.8,205.6 L400.2,207.0 L399.0,208.3 L397.4,209.1 L395.5,210.1 L393.5,212.3 L392.8,212.6 L391.6,214.1 L390.9,214.6 L390.7,216.0 L391.6,217.6 L391.9,218.8 L391.9,219.4 L392.2,219.3 L392.2,221.3 L391.9,222.2 L392.3,222.6 L392.1,223.5 L391.3,224.2 L389.9,224.9 L387.8,226.0 L387.0,226.7 L387.2,227.6 L387.6,227.7 L387.5,228.8 L386.1,228.8 L386.0,227.9 L385.7,227.0 L385.6,226.2 L385.9,224.0 L385.4,222.5 L384.6,219.6 L386.4,217.3 L386.9,215.8 L387.2,215.6 L387.4,214.4 L387.1,213.8 L387.1,212.3 L387.5,210.9 L387.5,208.3 L386.6,207.6 L385.7,207.5 L385.4,206.9 L384.6,206.5 L383.1,206.6 L383.0,205.8 L382.8,204.3 L388.1,202.6 L389.1,203.6 L389.6,203.4 L390.3,204.0 L390.4,204.8 L390.0,205.7 L390.2,207.2 L391.3,208.4 L391.8,207.0 L392.6,206.6 L392.5,204.0 L391.7,202.5 L391.1,201.8 L390.5,201.8 L390.0,199.2 L390.5,197.6Z"/><path d="M386.1,228.8 L385.8,229.7 L384.7,229.9 L383.7,228.8 L383.7,228.1 L384.2,227.3 L384.3,226.7 L384.8,226.6 L385.7,227.0 L386.0,227.9 L386.1,228.8Z"/><path d="M352.7,183.8 L352.1,184.2 L351.8,184.8 L351.8,185.7 L351.3,185.9 L350.9,184.3 L351.6,183.4 L352.1,183.1 L352.7,183.8ZM351.6,186.5 L352.3,186.2 L352.8,186.3 L353.4,186.0 L358.6,186.0 L359.0,187.6 L359.5,188.8 L359.9,189.5 L360.6,190.5 L361.7,190.4 L362.3,190.1 L363.3,190.4 L363.5,189.9 L364.0,188.7 L365.1,188.6 L365.2,188.2 L366.1,188.2 L365.9,189.0 L368.0,188.9 L368.1,190.2 L368.4,191.0 L368.2,192.3 L368.3,193.5 L368.9,194.3 L368.8,196.7 L369.2,196.5 L370.0,196.6 L371.0,196.3 L371.8,196.4 L372.0,197.0 L371.8,198.0 L372.1,199.0 L371.9,199.8 L372.0,200.5 L368.4,200.4 L368.3,207.0 L369.5,208.6 L370.6,209.9 L367.4,210.8 L363.2,210.5 L362.0,209.5 L354.9,209.6 L354.6,209.7 L353.6,208.8 L352.4,208.7 L351.4,209.1 L350.5,209.5 L350.4,208.2 L350.6,206.4 L351.2,204.5 L351.3,203.6 L351.9,201.8 L352.3,200.9 L353.3,199.6 L353.9,198.7 L354.0,197.2 L354.0,196.0 L353.4,195.3 L353.0,194.0 L352.5,192.8 L352.6,192.4 L353.2,191.6 L352.6,189.6 L352.3,188.2 L351.4,186.9 L351.6,186.5Z"/><path d="M383.3,178.9 L383.4,179.8 L383.8,180.2 L383.8,180.9 L383.4,181.3 L382.7,182.4 L382.1,183.1 L381.3,183.2 L381.2,180.8 L380.8,179.8 L381.9,180.0 L382.4,178.8 L383.3,178.9Z"/><path d="M392.5,106.9 L392.2,107.6 L391.6,107.3 L391.2,108.7 L391.6,108.9 L391.2,109.2 L391.1,109.7 L391.9,109.4 L392.0,110.2 L391.1,113.5 L390.9,113.0 L390.0,110.0 L390.0,110.0 L390.0,110.0 L390.5,109.3 L390.4,109.2 L390.8,108.3 L391.2,106.7 L391.4,106.2 L391.5,106.2 L392.1,106.2 L392.2,105.8 L392.7,105.8 L392.7,106.6 L392.5,106.9 L392.5,106.9Z"/><path d="M392.7,105.8 L392.2,105.8 L392.1,106.2 L391.5,106.2 L392.1,104.5 L393.0,103.0 L393.0,103.0 L393.8,103.1 L394.1,103.9 L393.1,104.7 L392.7,105.8Z"/><path d="M416.7,199.6 L417.2,200.4 L417.6,201.8 L417.9,204.3 L418.3,205.2 L418.2,206.2 L417.9,206.8 L417.3,205.6 L416.9,206.2 L417.3,207.7 L417.1,208.6 L416.6,209.1 L416.5,210.8 L415.8,213.2 L415.0,216.0 L413.9,219.9 L413.2,222.8 L412.4,225.1 L411.0,225.6 L409.5,226.5 L408.5,226.0 L407.1,225.2 L406.6,224.1 L406.5,222.3 L405.9,220.7 L405.7,219.2 L406.0,217.7 L406.8,217.4 L406.8,216.7 L407.7,215.1 L407.8,213.8 L407.4,212.9 L407.1,211.6 L406.9,209.7 L407.5,208.5 L407.8,207.2 L408.7,207.2 L409.6,206.7 L410.3,206.4 L411.0,206.3 L412.0,205.2 L413.5,203.9 L414.0,202.9 L413.8,202.0 L414.5,202.3 L415.5,200.8 L415.5,199.6 L416.1,198.7 L416.7,199.6Z"/><path d="M391.9,109.4 L391.1,109.7 L391.2,109.2 L391.6,108.9 L391.2,108.7 L391.6,107.3 L392.2,107.6 L392.2,108.8 L391.9,109.4Z"/><path d="M300.8,146.1 L302.7,146.1 L303.1,145.6 L303.6,145.6 L304.3,146.1 L304.8,146.1 L305.4,145.7 L305.8,146.3 L305.0,146.8 L304.3,146.7 L303.5,146.3 L302.9,146.8 L302.5,146.8 L302.1,147.1 L300.5,147.0 L300.8,146.1Z"/><path d="M346.6,111.9 L345.8,108.2 L344.8,107.4 L344.8,106.9 L343.3,105.6 L343.2,104.1 L344.2,103.0 L344.7,101.3 L344.4,99.3 L344.7,98.3 L346.6,97.4 L347.9,97.7 L347.8,98.7 L349.3,98.0 L349.4,98.4 L348.6,99.4 L348.5,100.3 L349.1,100.8 L348.9,102.6 L347.8,103.6 L348.1,104.7 L349.0,104.8 L349.4,105.7 L350.1,106.1 L350.0,107.6 L349.2,108.2 L348.6,108.9 L347.4,109.7 L347.6,110.5 L347.4,111.4 L346.6,111.9Z"/><path d="M314.8,117.8 L314.8,117.4 L314.8,117.3 L314.8,114.9 L317.6,113.4 L319.4,113.1 L320.8,112.5 L321.5,111.5 L323.5,110.7 L323.6,109.1 L324.6,109.0 L325.4,108.2 L327.7,107.9 L328.0,107.1 L327.6,106.6 L327.0,104.5 L326.9,103.2 L326.2,101.9 L327.9,100.8 L329.8,100.4 L330.9,99.6 L332.6,99.0 L335.5,98.6 L338.4,98.4 L339.3,98.7 L341.0,97.9 L342.8,97.9 L343.5,98.4 L344.7,98.3 L344.4,99.3 L344.7,101.3 L344.2,103.0 L343.2,104.1 L343.3,105.6 L344.8,106.9 L344.8,107.4 L345.8,108.2 L346.6,111.9 L347.2,113.7 L347.3,114.6 L346.9,116.3 L347.1,117.2 L346.9,118.4 L347.0,119.6 L346.3,120.5 L347.3,122.0 L347.4,122.9 L348.0,124.0 L348.8,123.6 L350.2,124.6 L351.0,125.9 L345.0,129.8 L339.9,133.8 L337.5,134.7 L335.5,134.9 L335.5,133.6 L334.7,133.3 L333.6,132.7 L333.2,131.7 L327.3,127.3 L321.4,122.8 L314.8,117.8Z"/><path d="M392.2,107.6 L392.5,106.9 L394.5,107.8 L397.9,105.6 L398.6,108.1 L398.3,108.4 L394.8,109.4 L396.5,111.5 L395.9,111.8 L395.6,112.5 L394.3,112.8 L393.9,113.5 L393.1,114.1 L391.2,113.8 L391.1,113.5 L392.0,110.2 L391.9,109.4 L392.2,108.8 L392.2,107.6Z"/><path d="M420.3,124.3 L420.6,124.2 L420.6,124.8 L422.0,124.4 L423.5,124.5 L424.5,124.6 L425.7,123.2 L427.0,121.8 L428.1,120.6 L428.5,121.3 L428.7,122.9 L427.8,122.9 L427.7,124.2 L428.0,124.5 L427.2,124.9 L427.2,125.8 L426.7,126.6 L426.6,127.4 L426.3,127.9 L421.0,126.8 L420.3,124.8 L420.3,124.3Z"/><path d="M418.9,123.3 L418.8,121.8 L419.3,120.7 L419.8,120.5 L420.3,121.1 L420.3,122.3 L419.9,123.5 L419.4,123.7 L418.9,123.3Z"/><path d="M414.0,112.5 L414.3,113.5 L414.2,113.9 L414.7,115.5 L413.5,115.5 L413.1,114.5 L411.5,114.3 L412.8,112.4 L414.0,112.5Z"/><path d="M398.6,108.1 L397.9,105.6 L401.8,103.4 L402.4,101.0 L402.3,99.5 L403.2,99.0 L404.1,97.7 L404.9,97.4 L406.9,97.6 L407.5,98.1 L408.4,97.8 L409.5,100.2 L410.6,100.9 L410.8,102.1 L409.9,102.8 L409.5,104.4 L410.7,106.3 L412.8,107.4 L413.7,109.0 L413.4,110.5 L414.0,110.5 L414.0,111.6 L415.0,112.7 L414.0,112.5 L412.8,112.4 L411.5,114.3 L408.2,114.2 L403.3,110.1 L400.7,108.6 L398.6,108.1Z"/><path d="M426.6,127.4 L426.7,126.6 L427.2,125.8 L427.2,124.9 L428.0,124.5 L427.7,124.2 L427.8,122.9 L428.7,122.9 L429.5,124.3 L430.5,125.0 L431.7,125.3 L432.8,125.7 L433.6,126.9 L434.0,127.5 L434.7,127.8 L434.7,128.3 L434.0,129.5 L433.7,130.1 L433.0,130.7 L432.4,132.1 L431.6,132.0 L431.2,132.5 L430.9,133.5 L431.1,134.9 L431.0,135.2 L430.2,135.2 L429.1,135.9 L428.9,136.9 L428.5,137.4 L427.4,137.3 L426.7,137.9 L426.7,138.7 L425.9,139.3 L424.9,139.1 L423.7,139.7 L422.9,139.9 L422.4,138.4 L421.0,135.0 L426.2,133.0 L427.4,128.9 L426.6,127.4ZM428.5,121.3 L428.1,120.6 L428.6,119.9 L428.8,120.1 L428.7,120.9 L428.5,121.3Z"/><path d="M622.6,206.6 L623.7,207.8 L623.2,208.0 L622.6,207.1 L622.6,206.6ZM621.9,206.1 L621.6,205.6 L621.6,204.0 L622.4,204.6 L622.7,206.3 L622.3,206.0 L621.9,206.1Z"/><path d="M509.5,149.0 L509.1,146.5 L510.2,144.8 L512.5,144.4 L514.1,144.7 L515.6,145.5 L516.4,144.1 L517.9,144.9 L518.3,146.3 L518.1,148.7 L515.2,150.3 L515.9,151.5 L514.1,151.7 L512.6,152.5 L511.1,152.2 L510.4,151.1 L509.5,149.0Z"/><path d="M514.1,144.7 L512.5,144.4 L510.2,144.8 L509.1,146.5 L509.5,149.0 L508.0,148.1 L506.5,148.1 L506.7,146.5 L505.2,146.5 L505.0,148.8 L504.1,151.8 L503.5,153.6 L503.6,155.1 L504.8,155.1 L505.5,157.0 L505.8,158.8 L506.8,159.9 L507.8,160.2 L508.7,161.2 L508.2,162.1 L507.0,162.3 L506.9,161.3 L505.5,160.4 L505.2,160.7 L504.5,160.0 L504.2,158.9 L503.2,157.8 L502.4,156.8 L502.1,158.0 L501.8,156.9 L502.0,155.6 L502.5,153.6 L503.3,151.5 L504.3,149.6 L503.6,147.8 L503.6,146.8 L503.4,145.7 L502.3,144.0 L501.8,143.0 L502.4,142.6 L503.1,140.8 L502.4,139.5 L501.3,138.0 L500.4,136.2 L501.1,135.8 L501.9,133.6 L503.2,133.5 L504.2,132.6 L505.2,132.1 L506.0,132.8 L506.1,134.0 L507.2,134.1 L506.8,136.3 L506.9,138.1 L508.7,136.9 L509.2,137.2 L510.2,137.2 L510.6,136.5 L511.9,136.6 L513.3,138.3 L513.4,140.3 L514.8,142.1 L514.7,143.8 L514.1,144.7Z"/><path d="M517.9,144.9 L516.4,144.1 L515.6,145.5 L514.1,144.7 L514.7,143.8 L514.8,142.1 L513.4,140.3 L513.3,138.3 L511.9,136.6 L510.6,136.5 L510.2,137.2 L509.2,137.2 L508.7,136.9 L506.9,138.1 L506.8,136.3 L507.2,134.1 L506.1,134.0 L506.0,132.8 L505.2,132.1 L505.6,131.4 L507.1,130.1 L507.2,130.5 L508.2,130.6 L507.9,128.2 L508.8,127.9 L509.8,129.6 L510.6,131.4 L512.8,131.4 L513.4,133.2 L512.3,133.8 L511.8,134.5 L513.9,135.7 L515.4,138.2 L516.5,140.0 L517.8,141.4 L518.2,142.8 L517.9,144.9Z"/><path d="M505.2,132.1 L504.2,132.6 L503.2,133.5 L501.9,133.6 L501.1,135.8 L500.4,136.2 L501.3,138.0 L502.4,139.5 L503.1,140.8 L502.4,142.6 L501.8,143.0 L502.3,144.0 L503.4,145.7 L503.6,146.8 L503.6,147.8 L504.3,149.6 L503.3,151.5 L502.5,153.6 L502.3,152.1 L502.8,150.5 L502.2,149.3 L502.4,147.1 L501.7,146.0 L501.1,143.6 L500.8,141.0 L500.0,139.3 L498.9,140.3 L496.9,141.8 L495.9,141.6 L494.8,141.1 L495.4,138.6 L495.1,136.7 L493.7,134.3 L493.9,133.6 L492.9,133.3 L491.6,131.6 L491.5,130.0 L492.1,130.3 L492.2,128.8 L493.0,128.3 L492.9,127.5 L493.3,126.8 L493.3,124.6 L494.7,125.1 L495.5,123.4 L495.6,122.4 L496.5,120.7 L496.5,119.5 L498.7,118.1 L500.0,118.5 L499.8,117.2 L500.5,116.8 L500.3,116.1 L501.3,115.9 L501.9,117.1 L502.7,117.6 L502.7,119.2 L502.7,120.9 L501.0,122.6 L500.8,125.0 L502.7,124.7 L503.1,126.6 L504.2,127.0 L503.7,128.7 L505.0,129.4 L505.7,129.8 L507.0,129.2 L507.1,130.1 L505.6,131.4 L505.2,132.1Z"/><path d="M512.6,152.5 L514.1,151.7 L515.9,151.5 L515.2,150.3 L518.1,148.7 L518.3,146.3 L517.9,144.9 L518.2,142.8 L517.8,141.4 L516.5,140.0 L515.4,138.2 L513.9,135.7 L511.8,134.5 L512.3,133.8 L513.4,133.2 L512.8,131.4 L510.6,131.4 L509.8,129.6 L508.8,127.9 L509.7,127.4 L511.1,127.5 L512.8,127.2 L514.3,126.1 L515.2,126.9 L516.8,127.3 L516.5,128.5 L517.3,129.3 L519.1,129.8 L516.8,131.6 L515.3,133.5 L514.9,134.9 L516.2,137.1 L517.9,139.8 L519.5,141.0 L520.5,142.7 L521.3,146.5 L521.1,150.1 L519.6,151.4 L517.6,152.8 L516.2,154.5 L514.0,156.4 L513.4,155.1 L513.9,153.7 L512.6,152.5Z"/><path d="M558.9,87.4 L558.9,87.4 L558.9,87.4 L558.9,87.4ZM558.6,87.1 L558.6,87.1 L558.9,87.4 L558.2,87.3 L557.4,88.0 L556.9,88.7 L557.0,90.2 L556.1,90.6 L555.8,91.0 L555.1,91.6 L553.9,91.9 L553.2,92.5 L553.1,93.4 L552.9,93.6 L553.6,93.9 L554.6,94.8 L554.4,95.3 L553.6,95.5 L552.4,95.6 L551.7,96.5 L550.9,96.4 L550.8,96.6 L550.0,96.2 L549.7,96.6 L549.2,96.8 L549.2,96.4 L548.7,96.2 L548.2,95.9 L548.7,95.0 L549.1,94.7 L549.0,94.4 L549.4,93.3 L549.3,92.9 L548.3,92.7 L547.5,92.1 L548.9,90.8 L550.8,89.7 L552.0,88.3 L552.9,88.9 L554.4,89.0 L554.1,87.9 L556.8,87.0 L557.5,85.9 L558.6,87.1Z"/><path d="M550.8,96.6 L550.9,96.4 L551.7,96.5 L552.4,95.6 L553.6,95.5 L554.4,95.3 L554.6,94.8 L556.1,97.3 L556.6,98.6 L556.6,101.0 L555.9,102.1 L554.3,102.5 L552.9,103.3 L551.4,103.5 L551.2,102.4 L551.5,100.8 L550.7,98.7 L552.0,98.4 L550.8,96.6Z"/><path d="M483.6,72.9 L485.4,72.6 L488.7,70.8 L491.4,69.9 L492.9,70.5 L494.8,70.5 L495.9,71.5 L497.7,71.5 L500.2,72.1 L501.9,70.6 L501.2,69.4 L503.0,67.3 L505.0,68.2 L506.6,68.4 L508.6,68.9 L508.9,70.5 L511.4,71.3 L513.1,70.9 L515.3,70.7 L517.1,70.9 L518.8,71.9 L519.8,73.0 L521.5,72.9 L523.7,73.3 L525.3,72.8 L527.6,72.4 L530.1,71.0 L531.2,71.2 L532.1,71.9 L534.2,71.7 L533.3,73.3 L532.1,75.3 L532.5,76.2 L533.5,75.9 L535.3,76.2 L536.6,75.5 L538.0,76.1 L539.6,77.6 L539.4,78.3 L538.0,78.0 L535.5,78.3 L534.3,78.9 L533.0,80.3 L530.3,81.1 L528.6,82.1 L526.8,81.7 L525.8,81.5 L524.9,82.9 L525.4,83.6 L525.7,84.3 L524.5,85.0 L523.2,86.1 L521.2,86.8 L518.6,86.9 L515.7,87.6 L513.7,88.7 L512.9,88.1 L510.8,88.1 L508.2,86.8 L506.5,86.5 L504.2,86.8 L500.5,86.4 L498.6,86.4 L497.6,85.2 L496.8,83.3 L495.7,83.1 L493.6,81.8 L491.2,81.5 L489.2,81.2 L488.5,80.3 L489.2,77.9 L488.0,76.2 L485.5,75.5 L484.0,74.4 L483.6,72.9Z"/><path d="M500.3,116.1 L500.5,116.8 L499.8,117.2 L500.0,118.5 L498.7,118.1 L496.5,119.5 L496.5,120.7 L495.6,122.4 L495.5,123.4 L494.7,125.1 L493.3,124.6 L493.3,126.8 L492.9,127.5 L493.0,128.3 L492.2,128.8 L491.3,125.6 L490.8,125.6 L490.5,126.9 L489.5,125.8 L490.1,124.7 L490.9,124.5 L491.7,122.8 L490.6,122.4 L489.0,122.5 L487.4,122.2 L487.2,120.8 L486.4,120.7 L485.0,119.8 L484.4,121.2 L485.6,122.3 L484.5,123.0 L484.1,123.8 L485.2,124.3 L484.9,125.6 L485.5,127.1 L485.8,128.8 L485.6,129.5 L484.4,129.5 L482.2,129.9 L482.3,131.5 L481.4,132.7 L478.9,134.1 L476.9,136.5 L475.6,137.8 L473.8,139.1 L473.8,140.1 L473.0,140.6 L471.4,141.3 L470.6,141.4 L470.0,143.0 L470.4,145.6 L470.5,147.3 L469.8,149.3 L469.8,152.8 L468.8,152.9 L468.0,154.4 L468.6,155.1 L467.0,155.7 L466.4,157.1 L465.7,157.7 L464.0,155.8 L463.2,152.9 L462.6,150.8 L461.9,149.8 L461.0,147.9 L460.6,145.3 L460.3,144.0 L458.7,141.2 L458.0,137.2 L457.4,134.6 L457.4,132.1 L457.1,130.2 L454.6,131.4 L453.3,131.2 L451.0,128.7 L451.9,128.0 L451.4,127.2 L449.3,125.4 L450.5,124.1 L454.3,124.1 L454.0,122.3 L453.0,121.3 L452.8,119.7 L451.7,118.8 L453.6,116.6 L455.6,116.8 L457.4,114.6 L458.5,112.5 L460.2,110.5 L460.2,109.0 L461.7,107.8 L460.3,106.8 L459.7,105.4 L459.1,103.6 L459.9,102.8 L462.6,103.3 L464.5,103.0 L466.2,101.2 L468.1,103.6 L467.9,105.3 L468.6,106.4 L468.6,107.4 L467.3,107.1 L467.8,109.4 L469.5,110.7 L471.9,112.1 L470.8,113.1 L470.2,115.0 L471.9,115.7 L473.5,116.8 L475.8,117.9 L478.2,118.2 L479.2,119.2 L480.5,119.4 L482.6,119.9 L484.1,119.9 L484.3,119.0 L484.1,117.7 L484.2,116.9 L485.3,116.4 L485.4,118.0 L485.5,118.4 L487.1,119.2 L488.2,118.9 L489.6,119.0 L491.1,119.0 L491.2,117.7 L490.5,117.1 L491.9,116.8 L493.5,115.3 L495.5,114.0 L497.0,114.5 L498.2,113.6 L499.0,114.9 L498.4,115.8 L500.3,116.1Z"/><path d="M492.2,128.8 L492.1,130.3 L491.5,130.0 L491.6,131.6 L491.1,130.6 L491.0,129.5 L490.7,128.5 L490.0,127.3 L488.4,127.2 L488.5,128.1 L488.0,129.2 L487.2,128.8 L487.0,129.2 L486.5,129.0 L485.8,128.8 L485.5,127.1 L484.9,125.6 L485.2,124.3 L484.1,123.8 L484.5,123.0 L485.6,122.3 L484.4,121.2 L485.0,119.8 L486.4,120.7 L487.2,120.8 L487.4,122.2 L489.0,122.5 L490.6,122.4 L491.7,122.8 L490.9,124.5 L490.1,124.7 L489.5,125.8 L490.5,126.9 L490.8,125.6 L491.3,125.6 L492.2,128.8Z"/><path d="M490.5,117.1 L491.2,117.7 L491.1,119.0 L489.6,119.0 L488.2,118.9 L487.1,119.2 L485.5,118.4 L485.4,118.0 L486.6,116.5 L487.5,116.0 L488.8,116.5 L489.7,116.5 L490.5,117.1Z"/><path d="M484.2,116.9 L484.1,117.7 L484.3,119.0 L484.1,119.9 L482.6,119.9 L480.5,119.4 L479.2,119.2 L478.2,118.2 L475.8,117.9 L473.5,116.8 L471.9,115.7 L470.2,115.0 L470.8,113.1 L471.9,112.1 L472.7,111.6 L474.1,112.3 L475.8,113.6 L476.8,113.9 L477.4,114.9 L478.8,115.3 L480.2,116.2 L482.2,116.7 L484.2,116.9Z"/><path d="M466.2,101.2 L464.5,103.0 L462.6,103.3 L459.9,102.8 L459.1,103.6 L459.7,105.4 L460.3,106.8 L461.7,107.8 L460.2,109.0 L460.2,110.5 L458.5,112.5 L457.4,114.6 L455.6,116.8 L453.6,116.6 L451.7,118.8 L452.8,119.7 L453.0,121.3 L454.0,122.3 L454.3,124.1 L450.5,124.1 L449.3,125.4 L448.0,124.9 L447.5,123.4 L446.2,121.9 L442.9,122.3 L440.1,122.3 L437.6,122.6 L438.3,120.2 L440.8,119.1 L440.7,118.2 L439.8,117.9 L439.8,116.1 L438.1,115.2 L437.4,113.9 L436.5,112.9 L439.5,113.9 L441.2,113.6 L442.3,113.9 L442.6,113.4 L443.8,113.6 L446.1,112.7 L446.2,111.0 L447.1,109.8 L448.4,109.8 L448.6,109.3 L450.0,109.0 L450.6,109.2 L451.3,108.6 L451.2,107.4 L452.0,106.1 L453.1,105.6 L452.4,104.3 L454.0,104.3 L454.5,103.6 L454.5,102.8 L455.3,101.9 L455.1,100.9 L454.7,100.0 L455.7,99.2 L457.6,98.7 L459.6,98.5 L460.5,98.1 L461.5,97.9 L462.8,98.8 L463.3,100.4 L466.2,101.2Z"/><path d="M446.4,97.4 L447.4,97.4 L448.7,97.9 L449.2,98.1 L450.5,97.4 L451.1,97.8 L451.7,96.9 L452.7,96.9 L453.0,96.6 L453.2,95.8 L453.9,95.1 L454.9,95.6 L454.7,96.2 L455.2,96.3 L455.0,98.0 L455.7,98.7 L456.3,98.3 L457.1,98.1 L458.2,97.1 L459.4,97.3 L461.2,97.3 L461.5,97.9 L460.5,98.1 L459.6,98.5 L457.6,98.7 L455.7,99.2 L454.7,100.0 L455.1,100.9 L455.3,101.9 L454.5,102.8 L454.5,103.6 L454.0,104.3 L452.4,104.3 L453.1,105.6 L452.0,106.1 L451.2,107.4 L451.3,108.6 L450.6,109.2 L450.0,109.0 L448.6,109.3 L448.4,109.8 L447.1,109.8 L446.2,111.0 L446.1,112.7 L443.8,113.6 L442.6,113.4 L442.3,113.9 L441.2,113.6 L439.5,113.9 L436.5,112.9 L438.1,111.0 L438.0,109.7 L436.6,109.3 L436.5,108.0 L435.9,106.4 L436.7,105.3 L435.9,105.0 L436.4,103.5 L437.1,100.9 L438.9,101.7 L440.2,101.4 L440.6,100.5 L442.0,100.2 L443.0,99.6 L443.3,97.9 L444.8,97.5 L445.1,96.8 L445.9,97.3 L446.4,97.4Z"/><path d="M448.7,97.9 L449.7,95.8 L449.3,94.3 L448.0,93.8 L448.5,92.9 L449.9,93.0 L450.8,91.8 L451.3,90.5 L453.7,90.0 L453.3,91.0 L453.6,91.6 L454.3,91.5 L453.6,92.1 L451.7,91.8 L451.6,93.0 L453.5,92.8 L455.6,93.5 L458.9,93.2 L459.4,95.1 L460.0,94.9 L461.0,95.3 L461.0,96.1 L461.2,97.3 L459.4,97.3 L458.2,97.1 L457.1,98.1 L456.3,98.3 L455.7,98.7 L455.0,98.0 L455.2,96.3 L454.7,96.2 L454.9,95.6 L453.9,95.1 L453.2,95.8 L453.0,96.6 L452.7,96.9 L451.7,96.9 L451.1,97.8 L450.5,97.4 L449.2,98.1 L448.7,97.9Z"/><path d="M454.2,87.4 L454.6,86.5 L455.7,86.2 L458.6,86.9 L458.9,85.7 L459.9,85.2 L462.4,86.1 L463.0,85.9 L465.9,85.9 L468.5,86.1 L469.4,86.9 L470.5,87.2 L470.2,87.6 L467.5,88.8 L466.8,89.6 L464.6,89.8 L463.9,91.1 L462.1,90.8 L460.9,91.2 L459.2,92.2 L459.4,92.7 L458.9,93.2 L455.6,93.5 L453.5,92.8 L451.6,93.0 L451.7,91.8 L453.6,92.1 L454.3,91.5 L455.6,91.7 L457.8,90.2 L455.8,89.1 L454.5,89.7 L453.2,88.9 L454.7,87.6 L454.2,87.4Z"/><path d="M421.9,88.3 L422.7,87.7 L424.6,87.2 L425.8,87.8 L427.0,89.4 L427.9,89.3 L429.9,89.3 L429.6,88.3 L431.1,87.6 L432.6,86.4 L435.0,87.4 L435.1,89.1 L435.8,89.5 L437.7,89.4 L438.3,89.8 L439.2,91.9 L441.2,93.3 L442.3,94.3 L444.1,95.3 L446.5,96.2 L446.4,97.4 L445.9,97.3 L445.1,96.8 L444.8,97.5 L443.3,97.9 L443.0,99.6 L442.0,100.2 L440.6,100.5 L440.2,101.4 L438.9,101.7 L437.1,100.9 L437.0,99.2 L435.7,99.1 L433.7,97.3 L432.3,97.1 L430.3,96.0 L429.1,95.9 L428.3,96.2 L427.1,96.2 L425.9,97.3 L424.4,97.7 L424.0,96.3 L424.3,94.1 L422.9,93.5 L423.4,92.1 L422.2,91.9 L422.6,90.2 L424.3,90.7 L425.8,90.1 L424.5,88.8 L424.0,87.6 L422.6,88.2 L422.4,89.7 L421.9,88.3Z"/><path d="M415.0,112.7 L414.0,111.6 L414.0,110.5 L413.4,110.5 L413.7,109.0 L412.8,107.4 L410.7,106.3 L409.5,104.4 L409.9,102.8 L410.8,102.1 L410.6,100.9 L409.5,100.2 L408.4,97.8 L408.4,97.8 L407.4,96.2 L407.7,95.5 L407.2,93.2 L408.4,92.6 L408.7,93.4 L409.6,94.3 L410.8,94.6 L411.4,94.5 L413.4,93.0 L414.1,92.9 L414.6,93.5 L414.0,94.5 L415.1,95.5 L415.5,95.4 L416.1,97.0 L417.8,97.4 L419.0,98.4 L421.5,98.8 L424.2,98.2 L424.4,97.7 L425.9,97.3 L427.1,96.2 L428.3,96.2 L429.1,95.9 L430.3,96.0 L432.3,97.1 L433.7,97.3 L435.7,99.1 L437.0,99.2 L437.1,100.9 L436.4,103.5 L435.9,105.0 L436.7,105.3 L435.9,106.4 L436.5,108.0 L436.6,109.3 L438.0,109.7 L438.1,111.0 L436.5,112.9 L437.4,113.9 L438.1,115.2 L439.8,116.1 L439.8,117.9 L440.7,118.2 L440.8,119.1 L438.3,120.2 L437.6,122.6 L434.3,122.0 L432.4,121.5 L430.4,121.2 L429.7,118.7 L428.9,118.4 L427.5,118.7 L425.8,119.7 L423.6,119.0 L421.8,117.5 L420.2,116.9 L419.0,114.9 L417.7,112.2 L416.8,112.5 L415.6,111.8 L415.0,112.7Z"/><path d="M392.5,106.9 L392.5,106.9 L392.7,106.6 L392.7,105.8 L393.1,104.7 L394.1,103.9 L393.8,103.1 L393.0,103.0 L392.8,101.4 L393.3,100.6 L393.7,100.1 L394.2,99.7 L394.3,98.5 L394.9,98.9 L396.8,98.4 L397.7,98.7 L399.2,98.7 L401.2,98.0 L402.1,98.0 L404.1,97.7 L403.2,99.0 L402.3,99.5 L402.4,101.0 L401.8,103.4 L397.9,105.6 L394.5,107.8 L392.5,106.9Z"/><path d="M411.4,94.5 L410.8,94.6 L410.0,93.4 L410.0,93.1 L409.3,93.1 L408.8,92.5 L408.4,92.6 L407.7,92.0 L406.4,91.5 L406.6,90.5 L406.3,89.8 L408.7,89.4 L409.1,90.0 L409.7,90.3 L409.4,90.8 L410.3,91.6 L409.8,92.2 L410.6,92.8 L411.3,93.1 L411.4,94.5Z"/><path d="M349.3,53.3 L350.1,52.2 L351.5,50.8 L352.1,48.3 L351.0,47.3 L350.9,44.6 L352.0,42.7 L353.8,42.7 L354.4,41.9 L353.7,41.2 L356.4,38.3 L358.2,36.0 L359.3,34.6 L361.0,34.6 L361.5,33.4 L364.8,33.8 L365.0,32.4 L366.1,32.3 L368.5,33.3 L371.2,34.7 L371.2,37.9 L371.8,38.7 L368.8,39.3 L367.1,40.7 L367.4,42.0 L364.6,43.6 L361.2,45.4 L360.0,48.3 L361.2,49.7 L362.9,50.8 L361.3,53.1 L359.5,53.6 L358.8,57.1 L357.8,59.0 L355.7,58.8 L354.7,60.4 L352.7,60.5 L352.1,58.6 L350.6,56.2 L349.3,53.3Z"/><path d="M379.3,58.9 L381.2,59.4 L381.4,59.9 L382.3,59.6 L384.0,60.1 L384.2,61.1 L383.8,61.6 L384.9,63.0 L385.6,63.4 L385.5,63.7 L386.7,64.1 L387.2,64.6 L386.5,65.1 L385.1,65.0 L384.8,65.2 L385.2,65.9 L385.6,67.2 L385.6,67.2 L384.1,67.3 L383.6,67.8 L383.5,68.8 L382.8,68.6 L381.2,68.7 L380.7,68.2 L380.1,68.6 L379.4,68.3 L378.0,68.2 L376.1,67.7 L374.3,67.6 L373.0,67.6 L372.0,68.2 L371.2,68.3 L371.1,67.4 L370.6,66.4 L371.6,66.0 L371.7,65.2 L371.2,64.4 L371.1,63.5 L372.8,63.5 L374.7,62.7 L375.1,61.6 L376.5,60.9 L376.4,60.0 L377.4,59.6 L379.3,58.9Z"/><path d="M385.6,67.2 L386.3,67.3 L386.7,66.8 L387.3,66.9 L389.1,66.7 L390.2,67.9 L389.7,68.3 L389.9,68.9 L391.3,69.0 L391.9,69.9 L391.9,70.3 L394.1,71.0 L395.4,70.7 L396.5,71.7 L397.5,71.7 L400.1,72.3 L400.1,72.9 L399.4,74.0 L399.8,75.1 L399.5,75.8 L397.8,76.0 L396.9,76.5 L396.9,77.4 L395.5,77.6 L394.3,78.3 L392.7,78.4 L391.2,79.1 L391.3,80.2 L391.0,80.2 L390.8,79.8 L390.2,79.7 L389.0,79.2 L388.5,79.8 L388.3,79.5 L385.6,79.0 L385.4,78.3 L383.8,78.5 L383.2,79.6 L381.8,81.1 L381.0,80.8 L380.2,81.1 L379.4,80.7 L379.8,80.5 L380.2,79.8 L380.6,79.2 L380.5,78.8 L380.9,78.6 L381.0,78.9 L382.1,79.0 L382.5,78.8 L382.2,78.6 L382.3,78.3 L381.7,77.8 L381.5,76.9 L380.8,76.6 L381.0,75.9 L380.2,75.4 L379.5,75.3 L378.2,74.6 L377.0,74.8 L376.6,75.1 L375.8,75.1 L375.4,75.6 L374.1,75.8 L373.5,76.1 L372.7,75.6 L371.6,75.6 L370.5,75.4 L369.7,75.8 L369.6,75.3 L368.6,74.7 L369.0,73.9 L369.5,73.4 L369.9,73.5 L369.4,72.6 L371.0,70.9 L371.9,70.6 L372.1,70.1 L371.2,68.3 L372.0,68.2 L373.0,67.6 L374.3,67.6 L376.1,67.7 L378.0,68.2 L379.4,68.3 L380.1,68.6 L380.7,68.2 L381.2,68.7 L382.8,68.6 L383.5,68.8 L383.6,67.8 L384.1,67.3 L385.6,67.2Z"/><path d="M371.1,63.5 L371.2,64.4 L371.7,65.2 L371.6,66.0 L370.6,66.4 L371.1,67.4 L371.2,68.3 L372.1,70.1 L371.9,70.6 L371.0,70.9 L369.4,72.6 L369.9,73.5 L369.5,73.4 L367.8,72.6 L366.6,72.9 L365.7,72.7 L364.7,73.1 L363.8,72.4 L363.1,72.7 L363.0,72.5 L362.2,71.5 L360.9,71.4 L360.7,70.8 L359.5,70.5 L359.3,71.1 L358.3,70.6 L358.4,70.1 L357.1,69.9 L356.3,69.2 L355.6,67.9 L355.7,67.2 L355.3,66.1 L354.6,65.4 L355.1,64.8 L354.7,63.8 L355.9,63.2 L358.6,62.2 L360.8,61.6 L362.6,61.9 L362.7,62.4 L364.4,62.4 L366.6,62.7 L369.8,62.6 L370.7,62.8 L371.1,63.5Z"/><path d="M359.7,75.3 L359.6,76.2 L358.6,76.2 L358.9,76.6 L358.4,78.0 L358.0,78.3 L356.5,78.3 L355.6,78.8 L354.2,78.7 L351.7,78.1 L351.3,77.4 L349.5,77.8 L349.3,78.2 L348.3,77.9 L347.4,77.8 L346.6,77.4 L346.9,76.9 L346.8,76.6 L347.3,76.5 L348.2,77.0 L348.5,76.5 L350.0,76.6 L351.2,76.2 L352.1,76.3 L352.6,76.7 L352.8,76.3 L352.5,75.0 L353.2,74.7 L353.8,73.8 L355.1,74.5 L356.1,73.6 L356.7,73.5 L358.1,74.1 L358.9,74.0 L359.7,74.4 L359.5,74.6 L359.7,75.3Z"/><path d="M368.6,74.7 L369.6,75.3 L369.7,75.8 L368.7,76.3 L367.8,77.7 L366.8,79.1 L365.4,79.4 L364.3,79.3 L363.0,79.9 L363.0,79.9 L362.3,80.2 L360.9,79.8 L359.5,78.9 L359.0,78.7 L358.6,78.0 L358.4,78.0 L358.9,76.6 L358.6,76.2 L359.6,76.2 L359.7,75.3 L360.6,75.9 L361.2,76.1 L362.7,75.8 L362.9,75.4 L363.6,75.4 L364.4,75.1 L364.6,75.2 L365.4,74.9 L365.8,74.4 L366.4,74.3 L368.3,74.9 L368.6,74.7Z"/><path d="M376.6,75.1 L377.0,74.8 L378.2,74.6 L379.5,75.3 L380.2,75.4 L381.0,75.9 L380.8,76.6 L381.5,76.9 L381.7,77.8 L382.3,78.3 L382.2,78.6 L382.5,78.8 L382.1,79.0 L381.0,78.9 L380.9,78.6 L380.5,78.8 L380.6,79.2 L380.2,79.8 L379.8,80.5 L379.4,80.7 L379.1,79.8 L379.3,78.9 L379.2,78.0 L378.2,76.8 L377.7,76.0 L377.1,75.3 L376.6,75.1Z"/><path d="M379.4,80.7 L380.2,81.1 L381.0,80.8 L381.8,81.1 L381.8,81.7 L381.0,82.1 L380.5,81.9 L380.0,84.4 L378.9,84.2 L377.7,83.4 L375.6,83.9 L374.7,84.4 L372.2,84.3 L370.8,84.0 L370.2,84.2 L369.7,83.3 L369.3,83.0 L369.7,82.6 L369.3,82.4 L368.8,82.8 L367.7,82.2 L367.6,81.4 L366.5,80.9 L366.3,80.2 L365.4,79.4 L366.8,79.1 L367.8,77.7 L368.7,76.3 L369.7,75.8 L370.5,75.4 L371.6,75.6 L372.7,75.6 L373.5,76.1 L374.1,75.8 L375.4,75.6 L375.8,75.1 L376.6,75.1 L377.1,75.3 L377.7,76.0 L378.2,76.8 L379.2,78.0 L379.3,78.9 L379.1,79.8 L379.4,80.7Z"/><path d="M376.4,60.0 L376.5,60.9 L375.1,61.6 L374.7,62.7 L372.8,63.5 L371.1,63.5 L370.7,62.8 L369.8,62.6 L369.6,62.1 L369.8,61.5 L369.1,61.2 L367.2,60.9 L366.8,59.1 L368.9,58.5 L371.8,58.6 L373.5,58.4 L373.8,58.9 L374.7,59.0 L376.4,60.0Z"/><path d="M377.8,56.2 L378.6,56.6 L378.7,57.6 L379.3,58.9 L377.4,59.6 L376.4,60.0 L374.7,59.0 L373.8,58.9 L373.5,58.4 L371.8,58.6 L368.9,58.5 L366.8,59.1 L366.9,57.6 L367.8,56.3 L369.4,55.6 L370.8,57.1 L372.2,57.1 L372.5,55.5 L374.0,55.2 L374.8,55.4 L376.3,56.2 L377.8,56.2Z"/><path d="M379.0,52.1 L379.0,52.1 L379.2,52.4 L378.0,53.6 L378.5,55.5 L377.8,56.2 L376.3,56.2 L374.8,55.4 L374.0,55.2 L372.5,55.5 L372.8,54.3 L372.1,54.6 L371.0,53.8 L370.8,52.7 L373.1,52.1 L375.3,51.8 L377.2,52.1 L379.0,52.1 L379.0,52.1Z"/><path d="M354.7,63.8 L355.1,64.8 L354.6,65.4 L355.3,66.1 L355.7,67.2 L355.6,67.9 L356.3,69.2 L355.5,69.4 L355.0,69.2 L354.6,69.6 L353.3,70.0 L352.7,70.5 L351.4,71.0 L351.7,71.6 L351.9,72.4 L352.8,72.9 L353.8,73.8 L353.2,74.7 L352.5,75.0 L352.8,76.3 L352.6,76.7 L352.1,76.3 L351.2,76.2 L350.0,76.6 L348.5,76.5 L348.2,77.0 L347.3,76.5 L346.8,76.6 L344.9,75.9 L344.6,76.4 L343.1,76.4 L343.3,74.9 L344.2,73.5 L341.7,73.1 L340.8,72.6 L340.9,71.7 L340.6,71.2 L340.8,69.9 L340.5,67.7 L341.5,67.7 L342.0,66.9 L342.4,65.1 L342.1,64.4 L342.4,63.9 L343.9,63.8 L344.2,64.3 L345.4,63.3 L345.0,62.5 L344.9,61.3 L346.2,61.6 L347.4,61.3 L347.4,62.1 L349.2,62.6 L349.1,63.3 L350.9,62.9 L351.9,62.3 L353.9,63.1 L354.7,63.8Z"/><path d="M369.7,83.3 L370.2,84.2 L370.8,84.0 L372.2,84.3 L374.7,84.4 L375.6,83.9 L377.7,83.4 L378.9,84.2 L380.0,84.4 L379.1,85.2 L378.4,86.7 L379.0,87.9 L377.5,87.6 L375.7,88.3 L375.7,89.3 L374.1,89.5 L372.9,88.8 L371.5,89.3 L370.2,89.3 L370.0,87.9 L369.2,87.2 L369.5,87.0 L369.3,86.7 L369.6,86.1 L370.2,85.4 L369.4,84.5 L369.2,83.8 L369.7,83.3Z"/><path d="M376.0,101.6 L375.8,102.2 L373.3,102.4 L373.3,102.1 L371.2,101.7 L371.5,100.8 L372.4,101.5 L373.8,101.4 L375.1,101.5 L375.1,101.9 L376.0,101.6ZM370.2,89.3 L371.5,89.3 L372.9,88.8 L374.1,89.5 L375.7,89.3 L375.7,88.3 L376.6,88.8 L376.0,90.1 L375.6,90.3 L374.5,90.3 L373.6,90.1 L371.5,90.6 L372.7,91.7 L371.8,92.1 L370.9,92.1 L369.9,91.0 L369.6,91.5 L370.0,92.7 L370.9,93.7 L370.2,94.1 L371.2,95.1 L372.0,95.6 L372.1,96.8 L370.5,96.3 L371.0,97.3 L369.9,97.5 L370.5,99.3 L369.4,99.4 L367.9,98.5 L367.3,96.8 L367.0,95.5 L366.3,94.5 L365.4,93.4 L365.3,92.8 L366.1,91.8 L366.2,91.1 L366.7,90.8 L366.8,90.3 L367.9,90.1 L368.6,89.6 L369.5,89.7 L369.8,89.3 L370.2,89.3Z"/><path d="M408.4,97.8 L407.5,98.1 L406.9,97.6 L404.9,97.4 L404.1,97.7 L402.1,98.0 L401.2,98.0 L399.2,98.7 L397.7,98.7 L396.8,98.4 L394.9,98.9 L394.3,98.5 L394.2,99.7 L393.7,100.1 L393.3,100.6 L392.6,99.6 L393.3,98.9 L392.2,99.0 L390.8,98.6 L389.5,99.7 L386.9,100.0 L385.5,98.9 L383.6,98.8 L383.2,99.7 L382.0,99.9 L380.3,98.8 L378.4,98.8 L377.3,96.8 L376.1,95.7 L376.9,94.1 L375.8,93.1 L377.7,91.1 L380.4,91.1 L381.2,89.5 L384.5,89.8 L386.6,88.4 L388.6,87.9 L391.5,87.8 L394.6,89.3 L397.1,90.1 L399.1,89.7 L400.7,89.9 L402.7,88.9 L404.6,88.8 L406.3,89.8 L406.6,90.5 L406.4,91.5 L407.7,92.0 L408.4,92.6 L407.2,93.2 L407.7,95.5 L407.4,96.2 L408.4,97.8 L408.4,97.8ZM375.7,88.3 L377.5,87.6 L379.0,87.9 L379.2,88.7 L380.7,89.3 L380.4,89.8 L378.3,90.0 L377.6,90.6 L376.1,91.7 L375.6,90.7 L375.6,90.3 L376.0,90.1 L376.6,88.8 L375.7,88.3Z"/><path d="M366.8,90.3 L366.7,90.8 L366.2,91.1 L366.1,91.8 L365.3,92.8 L365.0,92.6 L364.9,92.2 L364.0,91.5 L363.8,90.5 L364.0,89.1 L364.2,88.5 L363.9,88.2 L363.9,88.2 L363.8,87.5 L364.5,86.5 L364.7,86.9 L365.1,86.7 L365.5,87.2 L365.9,87.5 L366.0,88.2 L366.0,88.2 L365.8,88.9 L366.1,89.8 L366.8,90.3Z"/><path d="M359.0,78.7 L359.5,78.9 L360.9,79.8 L362.3,80.2 L363.0,79.9 L363.4,80.7 L363.9,81.3 L363.3,82.0 L362.5,81.6 L361.3,81.6 L359.8,81.3 L358.9,81.3 L358.6,81.7 L357.9,81.3 L357.6,82.1 L358.4,83.1 L358.8,83.7 L359.6,84.5 L360.3,84.9 L360.9,85.8 L362.5,86.6 L362.3,86.9 L362.3,86.9 L360.6,86.2 L359.6,85.4 L358.0,84.8 L356.6,83.3 L356.9,83.1 L356.1,82.3 L356.1,81.6 L355.0,81.3 L354.4,82.2 L353.9,81.5 L353.9,80.8 L354.0,80.7 L355.2,80.8 L355.5,80.4 L356.1,80.8 L356.8,80.8 L356.8,80.2 L357.4,80.0 L357.6,79.2 L359.0,78.7Z"/><path d="M346.8,76.6 L346.9,76.9 L346.6,77.4 L347.4,77.8 L348.3,77.9 L348.1,78.7 L347.4,79.1 L346.1,78.8 L345.7,79.6 L344.9,79.7 L344.6,79.4 L343.6,80.1 L342.7,80.2 L342.0,79.7 L341.4,78.8 L340.5,79.1 L340.6,78.2 L341.8,77.1 L341.8,76.5 L342.6,76.7 L343.1,76.4 L344.6,76.4 L344.9,75.9 L346.8,76.6Z"/><path d="M340.6,71.2 L340.9,71.7 L340.8,72.6 L340.3,72.6 L339.9,72.5 L340.1,71.3 L340.6,71.2Z"/><path d="M340.8,69.9 L340.6,71.2 L340.1,71.3 L339.9,72.5 L338.4,71.5 L337.5,71.7 L336.3,70.7 L335.5,69.9 L334.7,69.9 L334.4,69.1 L335.8,68.7 L335.8,68.7 L335.8,68.7 L337.1,68.9 L338.7,68.5 L339.8,69.4 L340.8,69.9Z"/><path d="M342.1,64.4 L342.4,65.1 L342.0,66.9 L341.5,67.7 L340.5,67.7 L340.8,69.9 L339.8,69.4 L338.7,68.5 L337.1,68.9 L335.8,68.7 L335.8,68.7 L336.7,68.2 L338.2,65.2 L340.6,64.3 L342.1,64.4Z"/><path d="M314.2,88.1 L314.8,87.6 L315.5,87.3 L316.0,88.3 L317.0,88.3 L317.3,88.1 L318.3,88.1 L318.8,89.2 L318.0,89.7 L318.0,91.3 L317.7,91.6 L317.6,92.6 L316.9,92.8 L317.6,94.0 L317.1,95.3 L317.7,95.9 L317.5,96.5 L316.8,97.3 L317.0,97.9 L316.3,98.5 L315.3,98.2 L314.4,98.4 L314.7,96.8 L314.5,95.6 L313.7,95.4 L313.3,94.6 L313.5,93.2 L314.2,92.5 L314.3,91.7 L314.7,90.4 L314.6,89.6 L314.3,88.8 L314.2,88.1Z"/><path d="M317.0,97.9 L316.8,97.3 L317.5,96.5 L317.7,95.9 L317.1,95.3 L317.6,94.0 L316.9,92.8 L317.6,92.6 L317.7,91.6 L318.0,91.3 L318.0,89.7 L318.8,89.2 L318.3,88.1 L317.3,88.1 L317.0,88.3 L316.0,88.3 L315.5,87.3 L314.8,87.6 L314.2,88.1 L314.3,86.7 L313.6,85.8 L316.0,84.3 L318.2,84.7 L320.5,84.7 L322.4,85.0 L323.8,84.9 L326.7,85.0 L327.4,85.8 L330.6,86.7 L331.2,86.3 L333.2,87.2 L335.2,86.9 L335.3,88.1 L333.7,89.5 L331.4,89.9 L331.3,90.6 L330.2,91.7 L329.5,93.4 L330.2,94.6 L329.2,95.5 L328.8,96.8 L327.5,97.2 L326.2,98.8 L324.0,98.8 L322.4,98.8 L321.3,99.5 L320.6,100.3 L319.7,100.1 L319.1,99.4 L318.6,98.3 L317.0,97.9Z"/><path d="M319.2,63.6 L319.4,65.0 L318.1,66.9 L315.0,68.1 L312.5,67.8 L314.0,65.6 L313.0,63.5 L315.4,61.9 L316.7,61.0 L317.1,62.1 L316.7,63.2 L317.8,63.1 L319.2,63.6Z"/><path d="M620.1,217.2 L621.5,218.5 L622.5,219.4 L621.8,219.9 L620.8,219.4 L619.6,218.4 L618.5,217.4 L617.3,215.9 L617.1,215.2 L617.8,215.2 L618.8,215.9 L619.6,216.6 L620.1,217.2Z"/><path d="M613.7,195.5 L614.2,196.2 L613.0,196.2 L612.3,194.9 L613.4,195.4 L613.7,195.5ZM612.9,193.7 L612.7,194.1 L611.4,192.3 L611.0,191.1 L611.6,191.1 L612.2,192.7 L612.9,193.7ZM611.5,194.2 L610.8,194.3 L609.7,194.1 L609.4,193.8 L609.5,192.9 L610.6,193.3 L611.2,193.7 L611.5,194.2ZM609.4,190.4 L609.8,191.1 L609.9,191.5 L608.5,190.6 L607.5,189.9 L606.9,189.2 L607.1,189.0 L607.9,189.5 L609.4,190.4ZM605.0,188.4 L605.7,189.1 L605.3,189.2 L604.6,188.7 L603.9,187.9 L603.9,187.5 L605.0,188.4Z"/><path d="M639.6,256.1 L638.9,257.2 L638.0,258.6 L636.7,259.5 L636.4,258.9 L635.6,258.6 L636.6,256.9 L636.1,255.8 L634.2,255.0 L634.2,254.3 L635.5,253.5 L635.8,252.0 L635.7,250.6 L635.0,249.3 L635.1,248.9 L634.2,248.1 L632.8,246.2 L632.1,244.8 L632.8,244.6 L633.7,245.8 L635.1,246.3 L635.6,248.1 L636.8,250.3 L636.9,248.9 L637.7,249.4 L637.9,251.0 L639.3,251.7 L640.5,251.8 L641.5,251.0 L642.4,251.3 L642.0,253.1 L641.4,254.3 L640.1,254.2 L639.6,254.9 L639.8,255.8 L639.6,256.1ZM626.9,263.3 L628.4,262.2 L629.5,261.2 L630.2,259.6 L630.9,259.1 L631.2,258.0 L632.4,257.0 L632.8,257.9 L633.2,258.7 L634.4,257.9 L634.9,258.8 L634.9,259.6 L634.3,260.6 L633.1,262.1 L632.2,262.9 L632.9,263.9 L631.5,263.9 L630.0,264.7 L629.6,266.0 L628.6,268.1 L627.2,269.0 L626.3,269.6 L624.7,269.6 L623.6,268.9 L621.7,268.8 L621.4,268.0 L622.3,266.5 L624.5,264.5 L625.7,264.1 L626.9,263.3Z"/><path d="M588.5,257.7 L589.5,257.8 L589.6,260.2 L589.0,260.9 L588.8,262.6 L588.2,262.0 L587.0,263.5 L586.7,263.3 L585.6,263.3 L584.5,261.5 L584.3,260.2 L583.3,258.4 L583.3,257.4 L584.4,257.6 L586.1,258.3 L587.1,258.1 L588.5,257.7ZM550.8,240.0 L548.9,241.1 L547.4,241.6 L547.1,242.6 L546.4,243.5 L544.9,243.5 L543.8,243.7 L542.3,243.3 L541.0,243.6 L539.8,243.7 L538.8,244.7 L538.3,244.7 L537.4,245.2 L536.5,245.9 L535.3,245.8 L534.1,245.8 L532.2,244.5 L531.3,244.1 L531.3,242.9 L532.2,242.6 L532.5,242.2 L532.4,241.4 L532.7,240.0 L532.5,238.8 L531.5,236.7 L531.2,235.6 L531.3,234.4 L530.6,233.1 L530.6,232.5 L529.8,231.6 L529.6,230.0 L528.6,228.4 L528.3,227.5 L529.1,228.4 L528.5,226.5 L529.4,227.1 L529.9,227.9 L529.9,226.9 L529.0,225.2 L528.8,224.6 L528.4,224.0 L528.6,222.8 L529.0,222.3 L529.2,221.3 L529.0,220.1 L529.8,218.6 L529.9,220.2 L530.6,218.8 L532.1,218.1 L532.9,217.2 L534.2,216.4 L535.0,216.3 L535.5,216.5 L536.9,215.8 L538.0,215.5 L538.2,215.1 L538.7,214.9 L539.7,215.0 L541.5,214.4 L542.4,213.4 L542.9,212.3 L543.9,211.3 L544.0,210.5 L544.0,209.4 L545.3,207.6 L546.0,209.4 L546.8,209.0 L546.1,208.0 L546.7,207.0 L547.5,207.5 L547.7,205.9 L548.6,204.9 L549.0,204.1 L549.9,203.7 L550.0,203.2 L550.7,203.4 L550.7,202.9 L551.5,202.6 L552.4,202.3 L553.7,203.3 L554.6,204.5 L555.7,204.5 L556.8,204.7 L556.5,203.6 L557.3,201.9 L558.1,201.4 L557.8,200.9 L558.6,199.7 L559.6,199.0 L560.5,199.2 L562.0,198.8 L562.0,197.8 L560.7,197.1 L561.6,196.8 L562.8,197.3 L563.7,198.2 L565.2,198.7 L565.7,198.5 L566.8,199.1 L567.8,198.5 L568.5,198.7 L568.9,198.3 L569.7,199.3 L569.2,200.4 L568.5,201.2 L567.9,201.3 L568.1,202.1 L567.6,203.2 L567.0,204.2 L567.1,204.7 L568.5,205.9 L569.9,206.5 L570.8,207.2 L572.0,208.5 L572.5,208.5 L573.4,209.0 L573.7,209.6 L575.4,210.3 L576.5,209.6 L576.9,208.5 L577.2,207.6 L577.4,206.5 L578.0,204.8 L577.7,203.9 L577.9,203.3 L577.7,202.1 L577.9,200.5 L578.2,200.1 L578.0,199.4 L578.4,198.3 L578.7,197.2 L578.8,196.6 L579.4,195.9 L579.9,196.9 L580.0,198.2 L580.5,198.4 L580.5,199.3 L581.2,200.3 L581.3,201.5 L581.2,202.2 L581.9,203.8 L583.0,203.1 L583.6,203.9 L584.4,204.7 L584.2,205.6 L584.6,207.4 L584.9,208.4 L585.3,208.7 L585.8,210.4 L585.6,211.5 L586.2,212.9 L588.1,213.9 L589.3,214.9 L590.5,215.8 L590.3,216.3 L591.3,217.6 L591.9,219.8 L592.6,219.4 L593.3,220.2 L593.8,219.9 L594.1,222.1 L595.3,223.4 L596.1,224.1 L597.5,225.8 L598.0,227.4 L598.0,228.6 L597.9,229.9 L598.7,231.6 L598.6,233.4 L598.3,234.4 L597.9,236.2 L597.9,237.4 L597.6,238.9 L596.8,240.7 L595.5,241.7 L594.9,243.3 L594.3,244.3 L593.7,246.1 L593.1,247.1 L592.6,248.7 L592.4,250.1 L592.5,250.7 L591.5,251.4 L589.5,251.5 L587.9,252.3 L587.1,253.1 L586.1,254.0 L584.6,253.1 L583.5,252.8 L583.8,251.7 L582.8,252.1 L581.3,253.6 L579.8,253.0 L578.8,252.7 L577.8,252.5 L576.1,251.9 L575.0,250.7 L574.7,249.1 L574.3,248.1 L573.4,247.3 L571.7,247.0 L572.3,246.0 L571.9,244.5 L571.0,245.9 L569.5,246.3 L570.4,245.2 L570.6,244.0 L571.3,243.0 L571.2,241.4 L569.7,243.2 L568.7,243.9 L568.0,245.5 L566.6,244.7 L566.7,243.6 L565.6,242.1 L564.7,241.3 L565.0,240.9 L562.7,239.6 L561.5,239.6 L559.8,238.6 L556.7,238.8 L554.4,239.5 L552.4,240.2 L550.8,240.0Z"/><path d="M473.1,158.6 L472.9,160.7 L472.1,161.3 L470.6,161.8 L469.8,160.1 L469.5,157.2 L470.3,153.9 L471.5,155.0 L472.3,156.4 L473.1,158.6Z"/><path d="M521.6,136.7 L520.1,136.1 L520.1,134.3 L521.0,133.4 L522.9,132.8 L523.9,132.8 L524.3,133.6 L523.5,134.5 L523.1,135.7 L521.6,136.7ZM470.5,87.2 L470.3,86.0 L471.5,85.5 L469.9,81.9 L473.4,81.1 L474.3,80.6 L475.6,77.0 L479.0,77.6 L480.0,76.7 L480.1,74.7 L481.5,74.5 L482.9,73.1 L483.6,72.9 L484.0,74.4 L485.5,75.5 L488.0,76.2 L489.2,77.9 L488.5,80.3 L489.2,81.2 L491.2,81.5 L493.6,81.8 L495.7,83.1 L496.8,83.3 L497.6,85.2 L498.6,86.4 L500.5,86.4 L504.2,86.8 L506.5,86.5 L508.2,86.8 L510.8,88.1 L512.9,88.1 L513.7,88.7 L515.7,87.6 L518.6,86.9 L521.2,86.8 L523.2,86.1 L524.5,85.0 L525.7,84.3 L525.4,83.6 L524.9,82.9 L525.8,81.5 L526.8,81.7 L528.6,82.1 L530.3,81.1 L533.0,80.3 L534.3,78.9 L535.5,78.3 L538.0,78.0 L539.4,78.3 L539.6,77.6 L538.0,76.1 L536.6,75.5 L535.3,76.2 L533.5,75.9 L532.5,76.2 L532.1,75.3 L533.3,73.3 L534.2,71.7 L536.3,72.5 L538.8,71.2 L538.7,70.3 L540.3,68.1 L541.3,67.5 L541.3,66.3 L540.3,65.9 L541.8,64.8 L543.9,64.5 L546.3,64.4 L548.9,65.0 L550.4,65.8 L551.5,67.8 L552.1,68.7 L552.8,70.0 L553.4,72.0 L556.4,72.6 L558.5,74.1 L559.2,76.0 L561.9,76.0 L563.4,75.2 L566.3,74.6 L565.4,76.5 L564.7,77.2 L564.1,79.5 L562.9,81.5 L560.8,81.1 L559.3,81.8 L559.8,83.6 L559.5,86.0 L558.6,86.0 L558.6,87.1 L557.5,85.9 L556.8,87.0 L554.1,87.9 L554.4,89.0 L552.9,88.9 L552.0,88.3 L550.8,89.7 L548.9,90.8 L547.5,92.1 L545.0,92.7 L543.7,93.7 L541.8,94.3 L542.8,93.3 L542.4,92.5 L543.8,91.1 L542.9,90.1 L541.3,90.8 L539.4,92.2 L538.3,93.5 L536.6,93.6 L535.7,94.6 L536.6,96.0 L538.0,96.3 L538.1,97.2 L539.5,97.8 L541.4,96.4 L543.0,97.2 L544.1,97.2 L544.4,98.3 L541.9,98.9 L541.1,100.0 L539.4,101.0 L538.5,102.4 L540.4,103.6 L541.1,105.6 L542.2,107.5 L543.3,109.0 L543.3,110.6 L542.2,111.1 L542.6,112.2 L543.7,112.8 L543.4,114.5 L542.9,116.1 L542.0,116.3 L540.7,118.5 L539.3,121.2 L537.6,123.7 L535.2,125.6 L532.8,127.3 L530.8,127.5 L529.8,128.4 L529.2,127.8 L528.2,128.8 L525.7,129.8 L523.9,130.1 L523.3,132.3 L522.3,132.4 L521.8,130.9 L522.3,130.1 L519.9,129.5 L519.1,129.8 L517.3,129.3 L516.5,128.5 L516.8,127.3 L515.2,126.9 L514.3,126.1 L512.8,127.2 L511.1,127.5 L509.7,127.4 L508.8,127.9 L507.9,128.2 L508.2,130.6 L507.2,130.5 L507.1,130.1 L507.0,129.2 L505.7,129.8 L505.0,129.4 L503.7,128.7 L504.2,127.0 L503.1,126.6 L502.7,124.7 L500.8,125.0 L501.0,122.6 L502.7,120.9 L502.7,119.2 L502.7,117.6 L501.9,117.1 L501.3,115.9 L500.3,116.1 L498.4,115.8 L499.0,114.9 L498.2,113.6 L497.0,114.5 L495.5,114.0 L493.5,115.3 L491.9,116.8 L490.5,117.1 L489.7,116.5 L488.8,116.5 L487.5,116.0 L486.6,116.5 L485.4,118.0 L485.3,116.4 L484.2,116.9 L482.2,116.7 L480.2,116.2 L478.8,115.3 L477.4,114.9 L476.8,113.9 L475.8,113.6 L474.1,112.3 L472.7,111.6 L471.9,112.1 L469.5,110.7 L467.8,109.4 L467.3,107.1 L468.6,107.4 L468.6,106.4 L467.9,105.3 L468.1,103.6 L466.2,101.2 L463.3,100.4 L462.8,98.8 L461.5,97.9 L461.2,97.3 L461.0,96.1 L461.0,95.3 L460.0,94.9 L459.4,95.1 L458.9,93.2 L459.4,92.7 L459.2,92.2 L460.9,91.2 L462.1,90.8 L463.9,91.1 L464.6,89.8 L466.8,89.6 L467.5,88.8 L470.2,87.6 L470.5,87.2Z"/><path d="M543.1,124.0 L542.1,127.3 L541.3,129.0 L540.4,127.2 L540.2,125.7 L541.2,123.7 L542.6,122.1 L543.4,122.8 L543.1,124.0Z"/><path d="M348.3,77.9 L349.3,78.2 L349.5,77.8 L351.3,77.4 L351.7,78.1 L354.2,78.7 L354.0,79.7 L354.4,80.5 L353.0,80.2 L351.6,81.0 L351.7,82.0 L351.5,82.6 L352.0,83.6 L353.7,84.6 L354.6,86.3 L356.5,88.0 L357.9,88.0 L358.3,88.4 L357.8,88.8 L359.4,89.6 L360.7,90.2 L362.2,91.3 L362.3,91.7 L362.0,92.4 L361.0,91.4 L359.5,91.1 L358.8,92.4 L360.1,93.2 L359.8,94.2 L359.1,94.4 L358.2,96.1 L357.4,96.3 L357.5,95.7 L357.8,94.6 L358.2,94.1 L357.5,92.9 L357.0,91.9 L356.2,91.6 L355.7,90.8 L354.6,90.4 L353.8,89.6 L352.6,89.4 L351.2,88.5 L349.6,87.2 L348.4,86.0 L347.9,84.0 L347.0,83.7 L345.6,83.0 L344.7,83.3 L343.7,84.3 L343.0,84.4 L343.2,83.5 L342.3,83.3 L341.8,81.7 L342.4,81.1 L341.9,80.3 L342.0,79.7 L342.7,80.2 L343.6,80.1 L344.6,79.4 L344.9,79.7 L345.7,79.6 L346.1,78.8 L347.4,79.1 L348.1,78.7 L348.3,77.9ZM355.8,95.8 L357.2,95.6 L356.5,97.2 L356.8,97.9 L356.4,98.9 L355.1,98.2 L354.2,97.9 L351.8,96.9 L352.0,95.8 L354.0,96.0 L355.8,95.8ZM345.2,90.2 L346.1,89.5 L347.2,91.0 L346.9,93.7 L346.1,93.6 L345.4,94.2 L344.7,93.7 L344.7,91.2 L344.3,90.1 L345.2,90.2Z"/><path d="M347.4,61.3 L346.2,61.6 L344.9,61.3 L344.2,60.2 L344.2,58.1 L344.4,57.5 L345.0,56.9 L346.5,56.8 L347.1,56.2 L348.5,55.7 L348.5,56.7 L347.9,57.4 L348.1,57.9 L349.1,58.3 L348.7,59.0 L348.1,58.8 L346.9,60.3 L347.4,61.3ZM351.6,59.0 L352.2,60.0 L351.2,61.7 L349.3,60.5 L349.1,59.7 L351.6,59.0Z"/><path d="M319.2,63.6 L317.8,63.1 L316.7,63.2 L317.1,62.1 L316.7,61.0 L318.2,60.9 L320.1,62.2 L319.2,63.6ZM324.6,64.5 L324.6,64.5 L324.8,63.3 L323.7,62.1 L323.6,62.0 L321.5,61.7 L321.1,61.1 L321.7,60.2 L321.2,59.6 L320.2,60.6 L320.1,58.6 L319.2,57.6 L319.9,55.5 L321.2,53.8 L322.6,54.0 L324.7,53.8 L322.9,56.0 L324.7,55.7 L326.6,55.7 L326.1,57.4 L324.5,59.3 L326.4,59.4 L326.5,59.6 L328.0,62.0 L329.2,62.3 L330.3,64.7 L330.8,65.5 L332.9,65.9 L332.7,67.2 L331.8,67.8 L332.5,68.9 L331.0,69.9 L328.6,69.9 L325.6,70.5 L324.8,70.1 L323.7,71.0 L322.1,70.8 L320.8,71.6 L319.9,71.2 L322.5,69.0 L324.0,68.6 L324.0,68.6 L321.3,68.2 L320.8,67.4 L322.6,66.8 L321.7,65.7 L322.0,64.3 L324.6,64.5Z"/><path d="M304.6,37.8 L304.2,39.1 L306.2,40.5 L303.9,42.1 L298.9,43.5 L297.4,43.8 L295.0,43.5 L290.2,42.9 L291.9,42.0 L288.1,41.0 L291.2,40.6 L291.1,40.0 L287.4,39.5 L288.6,38.2 L291.3,37.9 L294.0,39.2 L296.7,38.1 L298.9,38.7 L301.7,37.6 L304.6,37.8Z"/><path d="M411.2,88.2 L411.7,88.3 L412.9,89.5 L413.7,89.6 L414.0,89.1 L415.0,88.3 L415.9,89.4 L416.8,90.8 L417.6,90.9 L418.2,91.5 L416.7,91.6 L416.4,93.2 L416.1,93.9 L415.5,94.4 L415.5,95.4 L415.1,95.5 L414.0,94.5 L414.6,93.5 L414.1,92.9 L413.4,93.0 L411.4,94.5 L411.3,93.1 L410.6,92.8 L409.8,92.2 L410.3,91.6 L409.4,90.8 L409.7,90.3 L409.1,90.0 L408.7,89.4 L409.1,89.1 L410.4,89.7 L411.4,89.8 L411.6,89.6 L410.8,88.5 L411.2,88.2ZM410.8,94.6 L409.6,94.3 L408.7,93.4 L408.4,92.6 L408.8,92.5 L409.3,93.1 L410.0,93.1 L410.0,93.4 L410.8,94.6Z"/><path d="M399.9,85.0 L400.1,84.7 L401.6,85.1 L404.2,85.4 L406.6,86.4 L406.9,86.8 L407.9,86.4 L409.6,86.9 L410.1,87.7 L411.2,88.2 L410.8,88.5 L411.6,89.6 L411.4,89.8 L410.4,89.7 L409.1,89.1 L408.7,89.4 L406.3,89.8 L404.6,88.8 L402.7,88.9 L403.0,88.0 L402.5,86.6 L401.5,85.8 L400.6,85.6 L399.9,85.0Z"/><path d="M541.5,148.0 L540.6,146.4 L542.1,146.5 L542.7,147.2 L542.2,149.0 L541.5,148.0ZM544.5,153.5 L545.0,153.0 L545.2,151.7 L546.1,151.6 L545.8,153.0 L547.1,151.0 L547.0,152.9 L546.3,153.6 L545.8,154.9 L545.2,155.5 L544.2,154.1 L544.5,153.5ZM551.2,156.7 L551.3,158.1 L551.4,159.3 L550.8,161.1 L550.2,159.0 L549.4,160.1 L549.9,161.6 L549.4,162.6 L547.4,161.4 L546.9,159.9 L547.4,158.9 L546.3,157.9 L545.8,158.8 L544.9,158.7 L543.6,159.9 L543.4,159.3 L544.0,157.5 L545.1,157.0 L546.1,156.2 L546.7,157.1 L548.1,156.5 L548.3,155.6 L549.6,155.6 L549.5,154.0 L550.9,155.0 L551.0,156.0 L551.2,156.7ZM537.4,154.9 L535.1,156.8 L535.9,155.4 L537.2,154.1 L538.2,152.7 L539.1,150.7 L539.5,152.4 L538.3,153.5 L537.4,154.9ZM544.1,136.6 L543.8,137.5 L544.4,139.0 L543.9,140.7 L542.9,141.3 L542.6,143.0 L543.0,144.6 L544.0,144.9 L544.7,144.6 L546.9,145.7 L546.7,146.9 L547.3,147.4 L547.1,148.3 L545.8,147.3 L545.1,146.2 L544.7,147.0 L543.6,145.7 L542.0,146.0 L541.1,145.6 L541.2,144.7 L541.7,144.2 L541.2,143.7 L541.0,144.5 L540.1,143.3 L539.9,142.4 L539.8,140.5 L540.5,141.1 L540.7,137.9 L541.3,136.1 L542.3,136.1 L543.4,136.7 L543.9,136.1 L544.1,136.6ZM543.6,150.6 L543.3,149.6 L544.3,150.3 L545.5,150.3 L545.4,151.1 L544.6,152.0 L543.5,152.6 L543.4,151.6 L543.6,150.6ZM549.6,149.1 L550.1,151.4 L548.8,150.8 L548.8,151.5 L549.2,152.8 L548.4,153.2 L548.3,151.8 L547.8,151.7 L547.5,150.4 L548.6,150.6 L548.5,149.8 L547.5,148.3 L549.1,148.3 L549.6,149.1Z"/><path d="M505.2,160.7 L505.5,160.4 L506.9,161.3 L507.0,162.3 L508.2,162.1 L508.7,161.2 L509.1,161.4 L510.2,162.7 L510.9,164.0 L511.0,165.4 L510.8,166.4 L511.0,167.1 L511.1,168.3 L511.7,168.8 L512.4,170.7 L512.4,171.3 L511.2,171.5 L509.5,170.0 L507.4,168.3 L507.2,167.3 L506.2,165.9 L506.0,164.2 L505.3,163.1 L505.5,161.6 L505.2,160.7ZM536.3,165.5 L534.8,165.2 L532.8,165.2 L532.2,167.5 L531.5,168.2 L530.6,171.1 L529.2,171.5 L527.5,170.9 L526.7,171.1 L525.6,172.1 L524.5,172.0 L523.4,172.4 L522.2,171.3 L521.9,169.9 L523.2,170.6 L524.5,170.2 L524.9,168.5 L525.6,168.1 L527.7,167.6 L529.0,166.0 L529.9,164.7 L530.7,165.8 L531.0,165.1 L531.9,165.2 L532.0,163.8 L532.0,162.8 L533.4,161.4 L534.3,159.8 L535.0,159.8 L535.9,160.8 L536.0,161.7 L537.1,162.3 L538.6,162.9 L538.4,163.7 L537.3,163.8 L537.6,164.8 L536.3,165.5Z"/><path d="M532.0,162.8 L532.0,163.8 L531.9,165.2 L531.0,165.1 L530.7,165.8 L529.9,164.7 L530.5,164.0 L532.0,162.8Z"/><path d="M354.2,78.7 L355.6,78.8 L356.5,78.3 L358.0,78.3 L358.4,78.0 L358.6,78.0 L359.0,78.7 L357.6,79.2 L357.4,80.0 L356.8,80.2 L356.8,80.8 L356.1,80.8 L355.5,80.4 L355.2,80.8 L354.0,80.7 L354.4,80.5 L354.0,79.7 L354.2,78.7Z"/><path d="M380.0,32.4 L379.8,33.9 L382.5,35.2 L380.8,36.8 L382.9,39.1 L381.7,40.9 L383.3,42.4 L382.6,43.7 L385.2,45.1 L384.5,46.2 L382.9,47.4 L379.1,50.0 L379.1,50.0 L379.1,50.0 L375.9,50.1 L372.9,50.9 L370.0,51.3 L369.0,50.2 L367.3,49.5 L367.7,47.5 L366.9,45.7 L367.7,44.5 L369.3,43.2 L373.3,41.0 L374.4,40.5 L374.3,39.7 L371.8,38.7 L371.2,37.9 L371.2,34.7 L368.5,33.3 L366.1,32.3 L367.2,31.8 L369.1,32.9 L371.4,32.8 L373.3,33.3 L375.0,32.4 L375.8,30.9 L378.5,30.2 L380.8,31.0 L380.0,32.4Z"/><path d="M369.5,73.4 L369.0,73.9 L368.6,74.7 L368.3,74.9 L366.4,74.3 L365.8,74.4 L365.4,74.9 L364.6,75.2 L364.4,75.1 L363.6,75.4 L362.9,75.4 L362.7,75.8 L361.2,76.1 L360.6,75.9 L359.7,75.3 L359.5,74.6 L359.7,74.4 L359.9,73.9 L360.7,74.0 L361.3,73.7 L361.3,73.6 L361.7,73.5 L361.8,73.0 L362.2,72.9 L362.5,72.5 L363.0,72.5 L363.1,72.7 L363.8,72.4 L364.7,73.1 L365.7,72.7 L366.6,72.9 L367.8,72.6 L369.5,73.4Z"/><path d="M356.3,69.2 L357.1,69.9 L358.4,70.1 L358.3,70.6 L359.3,71.1 L359.5,70.5 L360.7,70.8 L360.9,71.4 L362.2,71.5 L363.0,72.5 L362.5,72.5 L362.2,72.9 L361.8,73.0 L361.7,73.5 L361.3,73.6 L361.3,73.7 L360.7,74.0 L359.9,73.9 L359.7,74.4 L358.9,74.0 L358.1,74.1 L356.7,73.5 L356.1,73.6 L355.1,74.5 L353.8,73.8 L352.8,72.9 L351.9,72.4 L351.7,71.6 L351.4,71.0 L352.7,70.5 L353.3,70.0 L354.6,69.6 L355.0,69.2 L355.5,69.4 L356.3,69.2Z"/><path d="M393.8,144.4 L393.6,143.6 L394.3,140.6 L394.5,139.2 L395.0,138.6 L396.3,138.3 L397.2,137.1 L398.2,139.5 L398.7,141.4 L399.7,142.4 L402.1,144.3 L403.0,145.5 L404.0,146.6 L404.5,147.3 L405.4,148.0 L404.9,148.5 L404.1,148.3 L403.5,147.6 L402.8,146.4 L402.0,145.8 L401.6,145.1 L400.0,144.2 L398.8,144.2 L398.4,143.8 L397.4,144.3 L396.3,143.3 L395.8,144.9 L393.8,144.4Z"/><path d="M578.3,93.7 L576.7,95.7 L576.7,97.9 L576.0,99.5 L576.4,100.5 L575.4,102.0 L573.2,102.9 L570.1,103.1 L567.6,105.4 L566.5,104.6 L566.4,103.1 L563.3,103.5 L561.3,104.5 L559.2,104.5 L561.0,106.0 L559.8,109.5 L558.7,110.4 L557.9,109.6 L558.3,107.7 L557.2,107.1 L556.5,105.7 L558.1,105.1 L559.0,103.8 L560.8,102.8 L562.1,101.4 L565.6,100.8 L567.4,101.2 L569.3,97.5 L570.4,98.5 L573.0,96.5 L574.0,95.7 L575.1,93.2 L574.8,90.8 L575.5,89.6 L577.4,89.2 L578.3,92.0 L578.3,93.7ZM583.1,83.9 L584.3,83.0 L584.7,85.3 L582.1,85.9 L580.6,87.9 L577.8,86.5 L576.9,88.8 L574.9,88.8 L574.7,86.7 L575.5,85.2 L577.4,85.1 L577.9,82.2 L578.4,80.6 L580.5,82.8 L581.8,83.4 L583.1,83.9ZM561.6,105.4 L562.6,104.2 L563.6,104.4 L564.3,103.6 L565.6,104.0 L565.8,104.7 L564.9,105.9 L564.1,105.3 L563.2,105.8 L562.8,107.0 L561.6,106.4 L561.6,105.4Z"/><path d="M228.2,215.4 L228.7,216.5 L228.6,219.3 L230.5,219.7 L231.2,219.3 L232.4,219.8 L232.7,220.4 L232.8,222.3 L233.0,223.1 L233.7,223.2 L234.4,222.9 L235.0,223.2 L235.0,224.4 L234.7,225.6 L234.4,226.8 L234.1,228.6 L232.5,230.1 L231.1,230.5 L229.2,230.2 L227.4,229.6 L229.1,226.5 L228.9,225.6 L227.1,224.8 L224.9,223.3 L223.5,223.0 L220.3,219.6 L221.0,217.2 L221.0,216.1 L221.9,214.2 L224.9,213.7 L226.5,213.7 L228.2,214.7 L228.2,215.4Z"/><path d="M421.0,135.0 L422.4,138.4 L422.9,139.9 L421.7,140.4 L421.3,141.3 L421.3,142.0 L419.6,142.9 L416.8,143.8 L415.2,145.3 L414.4,145.4 L413.9,145.3 L412.9,146.1 L411.8,146.5 L410.3,146.6 L409.8,146.8 L409.5,147.3 L409.0,147.4 L408.7,148.0 L407.9,147.9 L407.3,148.2 L406.1,148.1 L405.6,146.9 L405.7,145.8 L405.4,145.2 L405.1,143.7 L404.6,142.8 L404.9,142.7 L404.7,141.8 L404.9,141.4 L404.9,140.5 L405.6,139.8 L405.5,139.0 L405.9,138.0 L406.6,138.5 L407.1,138.3 L409.1,138.3 L409.4,138.5 L411.1,138.7 L411.8,138.6 L412.3,139.3 L413.1,138.9 L414.3,136.8 L416.0,135.8 L421.0,135.0Z"/><path d="M391.2,113.8 L393.1,114.1 L393.9,113.5 L394.3,112.8 L395.6,112.5 L395.9,111.8 L396.5,111.5 L394.8,109.4 L398.3,108.4 L398.6,108.1 L400.7,108.6 L403.3,110.1 L408.2,114.2 L411.5,114.3 L413.1,114.5 L413.5,115.5 L414.7,115.5 L415.4,117.2 L416.3,117.7 L416.6,118.4 L417.8,119.3 L417.9,120.1 L417.7,120.8 L417.9,121.5 L418.4,122.1 L418.7,122.8 L418.9,123.3 L419.4,123.7 L419.9,123.5 L420.3,124.3 L420.3,124.8 L421.0,126.8 L426.3,127.9 L426.6,127.4 L427.4,128.9 L426.2,133.0 L421.0,135.0 L416.0,135.8 L414.3,136.8 L413.1,138.9 L412.3,139.3 L411.8,138.6 L411.1,138.7 L409.4,138.5 L409.1,138.3 L407.1,138.3 L406.6,138.5 L405.9,138.0 L405.5,139.0 L405.6,139.8 L404.9,140.5 L404.6,139.6 L404.1,139.0 L404.0,138.2 L403.1,137.4 L402.1,135.7 L401.6,134.1 L400.4,132.6 L399.7,132.3 L398.5,130.4 L398.3,128.9 L398.4,127.7 L397.4,125.4 L396.5,124.6 L395.6,124.2 L395.0,123.0 L395.1,122.6 L394.6,121.5 L394.1,121.1 L393.4,119.5 L392.4,117.9 L391.5,116.5 L390.6,116.5 L390.9,115.4 L391.0,114.6 L391.2,113.8Z"/><path d="M244.8,334.0 L245.7,334.0 L248.3,333.6 L251.0,334.0 L253.1,334.9 L253.9,336.1 L254.1,337.0 L254.2,338.1 L251.5,338.7 L248.6,339.2 L245.3,339.7 L241.7,340.1 L237.5,340.0 L235.2,339.3 L235.5,338.5 L239.3,337.9 L240.8,337.2 L241.9,336.3 L242.7,335.6 L243.7,334.8 L244.8,334.0 L244.8,334.0ZM214.0,338.5 L217.9,338.6 L221.7,338.8 L223.0,338.0 L223.9,337.2 L225.7,338.1 L225.2,339.1 L224.7,340.1 L221.1,339.8 L217.1,339.9 L215.0,339.2 L215.0,339.1 L214.0,338.5ZM200.6,320.1 L200.6,320.1 L201.8,319.9 L203.9,319.9 L204.4,318.9 L204.5,318.1 L204.5,316.5 L205.4,315.5 L207.1,315.2 L208.0,316.0 L208.4,316.7 L209.1,317.7 L209.7,318.5 L210.2,319.5 L210.4,320.4 L210.1,321.2 L209.6,322.0 L207.6,322.2 L205.6,322.6 L203.3,322.6 L204.2,321.8 L202.1,322.1 L200.2,322.4 L198.8,321.7 L198.7,320.9 L200.6,320.1ZM150.9,321.4 L150.9,321.4 L152.0,321.0 L154.2,321.3 L156.8,321.5 L158.7,321.7 L160.6,321.5 L161.6,322.7 L160.3,322.5 L158.2,322.6 L156.0,322.5 L153.6,322.6 L151.8,322.2 L150.9,321.4ZM115.4,325.0 L115.4,325.0 L115.8,324.3 L117.9,324.7 L120.1,325.0 L122.2,324.6 L121.2,325.4 L119.6,325.9 L117.2,325.7 L115.4,325.0ZM107.3,324.6 L107.3,324.6 L108.5,324.2 L110.3,324.6 L112.9,325.4 L111.9,325.4 L109.7,325.2 L107.3,324.6ZM43.5,335.1 L43.5,335.1 L44.6,334.4 L47.8,334.7 L49.6,335.3 L50.9,336.0 L51.4,337.0 L48.0,337.3 L45.7,336.5 L44.7,335.8 L44.6,335.7 L43.5,335.1ZM645.0,347.7 L645.0,358.5 L15.0,358.5 L15.0,347.7 L15.1,347.7 L16.6,346.5 L19.8,347.1 L20.0,347.1 L21.9,346.4 L22.1,346.4 L22.3,346.4 L24.8,347.3 L27.0,346.4 L27.4,346.3 L32.6,346.0 L34.3,346.4 L35.1,346.7 L37.7,347.4 L42.7,347.9 L46.6,348.5 L53.4,349.0 L58.4,348.5 L65.9,348.9 L70.1,349.5 L74.7,348.9 L79.6,348.3 L79.9,347.4 L73.0,347.3 L67.4,346.8 L65.9,346.0 L61.2,345.6 L61.5,344.6 L62.2,343.8 L62.8,343.0 L62.5,342.2 L59.6,341.6 L58.2,340.9 L55.5,340.3 L59.8,340.4 L63.8,340.1 L66.4,340.7 L69.5,340.1 L72.4,339.4 L73.8,338.7 L73.2,337.8 L70.9,337.3 L68.3,336.7 L64.7,336.6 L61.6,336.3 L58.2,336.1 L57.0,335.3 L54.8,334.7 L53.4,334.0 L52.9,331.6 L53.7,331.8 L55.3,332.5 L58.2,332.3 L61.0,332.0 L62.4,332.9 L65.2,332.7 L67.5,332.2 L69.7,331.7 L71.7,331.0 L74.3,330.8 L74.2,330.0 L73.6,329.3 L74.1,328.5 L76.4,328.2 L77.4,328.9 L80.1,328.4 L82.1,327.9 L84.6,327.9 L87.0,327.7 L89.4,327.2 L91.2,326.8 L93.4,326.3 L94.7,326.4 L95.9,326.6 L98.5,326.3 L100.9,326.7 L103.3,326.6 L105.6,326.4 L107.9,326.6 L110.5,326.8 L113.0,326.7 L115.5,326.7 L118.1,326.8 L120.5,326.7 L122.3,326.1 L124.4,325.8 L126.6,326.2 L128.7,325.8 L130.6,325.1 L131.7,325.8 L132.3,326.5 L133.5,327.2 L135.3,326.6 L137.4,327.3 L139.7,327.6 L141.8,328.1 L144.2,328.0 L146.5,327.6 L149.1,327.7 L151.5,328.0 L153.9,328.4 L154.8,327.5 L153.7,326.8 L152.8,326.1 L150.5,325.9 L149.6,325.2 L149.2,324.4 L148.6,322.9 L149.9,323.1 L152.2,323.3 L154.5,323.1 L156.5,323.5 L158.3,324.1 L159.0,324.8 L161.4,324.9 L163.7,324.6 L166.1,324.2 L168.2,324.0 L170.0,324.5 L172.3,324.3 L173.9,322.7 L175.3,323.7 L177.3,324.0 L179.5,323.8 L180.9,324.6 L183.2,324.7 L185.3,325.0 L187.4,325.4 L188.8,324.6 L189.5,323.9 L191.2,324.7 L193.6,324.5 L195.4,325.0 L196.6,325.6 L198.9,325.4 L200.8,325.0 L202.5,324.5 L204.7,324.2 L207.1,324.0 L209.4,323.7 L211.1,323.2 L212.1,322.6 L212.5,321.7 L212.3,320.9 L211.8,320.1 L211.1,319.3 L210.6,318.4 L210.2,317.7 L210.0,316.9 L210.2,316.1 L211.0,315.4 L211.7,314.5 L212.0,313.7 L211.7,312.8 L211.5,312.0 L212.3,311.1 L213.3,310.5 L214.4,309.7 L215.6,309.1 L217.0,308.5 L217.7,307.6 L218.7,307.0 L219.7,306.5 L221.4,306.4 L222.5,305.8 L223.8,305.4 L225.2,305.1 L226.5,304.6 L227.5,303.9 L228.8,303.7 L229.9,304.2 L229.2,304.9 L227.4,305.5 L226.7,306.0 L225.4,305.6 L223.9,305.8 L222.7,306.3 L221.5,306.8 L220.6,307.4 L220.4,308.2 L220.5,309.0 L221.3,309.7 L220.1,310.2 L218.4,310.3 L217.5,311.0 L216.5,311.7 L215.4,312.5 L215.1,313.3 L215.7,314.1 L216.6,314.8 L218.1,315.3 L219.4,315.9 L220.1,316.7 L220.5,317.5 L221.0,318.3 L221.8,319.0 L222.4,319.7 L222.6,321.6 L223.1,322.4 L223.2,323.2 L223.8,324.0 L223.6,325.1 L222.6,325.9 L221.6,326.6 L219.2,326.9 L218.4,327.6 L217.4,328.3 L214.7,329.1 L212.4,329.4 L210.2,329.8 L207.9,330.3 L206.4,331.1 L203.6,331.2 L200.6,331.1 L197.8,331.3 L194.8,331.3 L195.4,332.1 L198.1,332.4 L200.0,333.0 L201.1,333.7 L199.1,334.4 L196.1,334.2 L193.6,334.7 L193.5,335.5 L193.5,336.3 L195.5,337.0 L195.9,337.8 L198.1,338.5 L201.8,338.9 L205.0,339.4 L207.5,340.1 L210.7,340.7 L215.0,341.0 L219.3,341.6 L222.3,342.2 L225.5,342.9 L227.3,343.8 L228.1,344.6 L230.2,343.9 L233.1,343.3 L236.2,342.6 L239.8,342.1 L242.9,341.5 L247.3,341.5 L251.6,341.8 L255.1,342.3 L256.2,341.4 L258.6,340.8 L263.1,340.7 L266.5,340.3 L269.8,339.9 L273.5,339.6 L277.3,339.2 L280.0,338.7 L278.8,338.0 L278.0,337.2 L278.0,336.5 L274.7,336.6 L271.1,336.9 L267.6,336.9 L267.2,336.1 L267.4,334.6 L268.2,334.2 L270.7,333.7 L273.6,333.2 L275.8,332.6 L277.9,332.0 L279.5,331.2 L281.9,330.8 L284.2,330.5 L285.4,330.4 L288.1,330.3 L290.7,330.0 L292.9,329.6 L295.0,329.1 L296.9,328.7 L299.3,328.0 L300.9,327.3 L302.5,326.7 L303.0,325.9 L301.2,325.4 L301.8,324.6 L303.0,324.0 L304.8,323.5 L306.7,323.1 L308.5,322.4 L309.9,321.6 L310.7,320.7 L312.0,320.1 L314.1,320.2 L314.9,320.9 L317.0,321.0 L317.1,320.2 L318.0,319.4 L319.9,319.6 L320.3,320.4 L322.4,320.5 L324.7,320.1 L326.9,319.9 L328.8,320.0 L329.6,320.9 L331.5,320.2 L333.3,319.8 L335.3,319.5 L337.2,319.3 L339.0,318.8 L341.0,318.4 L342.5,318.0 L343.6,317.3 L344.9,317.8 L346.7,317.5 L347.9,318.5 L348.9,319.2 L350.9,318.8 L351.7,318.0 L353.5,317.4 L355.8,317.6 L356.5,318.3 L357.9,317.6 L359.8,317.3 L361.9,317.2 L363.7,317.3 L365.7,317.5 L367.5,317.6 L368.4,318.3 L369.5,318.9 L371.4,318.6 L373.5,318.5 L375.5,318.5 L377.4,318.4 L379.2,318.2 L381.0,317.9 L382.6,317.4 L384.2,317.0 L386.0,316.8 L387.3,316.2 L388.3,315.1 L389.3,314.4 L391.1,314.8 L391.8,315.5 L393.3,316.0 L395.1,315.8 L396.3,316.5 L397.6,317.0 L399.4,316.6 L400.0,315.7 L401.6,315.3 L403.4,314.6 L405.1,314.3 L407.2,313.9 L408.6,313.5 L410.0,313.0 L411.4,312.6 L413.0,312.8 L414.6,312.1 L415.7,311.5 L417.4,311.6 L418.8,311.1 L419.2,310.4 L420.6,309.8 L422.1,309.4 L423.8,309.1 L425.4,308.9 L427.0,309.0 L428.6,309.2 L430.0,309.8 L430.2,310.7 L431.7,311.4 L432.8,311.9 L434.9,312.2 L436.1,312.7 L437.5,313.3 L439.2,313.4 L440.6,313.0 L442.1,312.2 L443.7,312.6 L445.5,312.9 L447.1,313.1 L448.8,313.3 L450.6,313.3 L452.0,315.4 L451.9,315.9 L451.7,316.8 L450.0,317.4 L448.7,318.1 L448.9,318.9 L450.9,318.9 L450.6,319.7 L449.7,320.5 L448.9,321.3 L450.2,321.9 L452.3,322.1 L454.3,321.8 L455.3,321.0 L455.8,320.2 L456.8,319.6 L457.9,319.0 L458.3,318.2 L459.3,317.2 L460.4,317.0 L462.3,317.0 L464.1,316.7 L465.9,316.4 L466.7,315.6 L467.2,314.8 L468.4,314.1 L470.2,313.5 L471.6,313.1 L472.6,312.5 L473.6,312.1 L474.9,311.8 L476.6,312.0 L478.2,311.8 L479.9,311.5 L481.8,311.7 L483.1,311.1 L484.0,309.7 L484.6,310.3 L485.4,311.3 L486.9,311.7 L488.6,311.8 L490.3,311.6 L492.1,311.7 L493.7,311.8 L494.8,311.6 L496.3,311.7 L497.6,312.1 L499.2,311.9 L501.1,311.9 L502.7,311.6 L504.5,311.9 L505.7,311.2 L506.6,310.5 L507.8,309.9 L510.0,308.4 L511.1,308.7 L512.4,309.2 L513.6,310.0 L515.8,311.2 L517.5,311.3 L519.1,311.3 L521.0,311.0 L522.9,310.7 L524.4,310.2 L525.6,309.6 L527.5,309.5 L528.8,309.0 L530.2,309.4 L531.1,310.1 L532.3,310.7 L534.2,310.7 L535.4,311.2 L537.5,311.7 L539.7,311.9 L541.5,311.7 L542.9,311.1 L544.1,310.5 L545.6,310.3 L547.2,310.6 L549.0,310.8 L550.7,310.5 L552.3,310.5 L553.8,310.7 L555.4,310.9 L557.0,310.5 L558.9,310.2 L560.6,310.1 L562.6,310.1 L564.2,309.9 L565.8,309.7 L566.3,308.7 L566.4,307.9 L567.5,308.4 L567.8,309.4 L568.4,310.2 L569.1,310.9 L570.6,311.3 L572.5,311.1 L574.8,311.1 L576.4,311.0 L578.7,311.0 L580.4,310.9 L582.7,311.0 L584.6,311.2 L585.8,311.8 L585.5,312.6 L586.6,313.2 L588.5,313.7 L590.5,314.2 L592.7,314.6 L595.1,314.9 L596.9,315.2 L598.9,315.2 L600.0,314.6 L601.5,315.1 L602.9,315.8 L604.4,316.2 L606.5,316.4 L608.6,316.7 L609.4,317.5 L611.4,318.0 L612.7,318.7 L614.7,319.0 L616.7,319.0 L618.6,319.1 L620.7,319.0 L622.8,319.2 L624.7,319.5 L626.6,320.0 L628.4,320.4 L629.6,321.0 L629.4,321.8 L628.5,322.5 L627.7,323.4 L627.1,324.2 L626.3,325.0 L624.0,325.3 L622.9,326.0 L620.7,326.5 L619.9,327.3 L618.7,328.0 L617.4,328.7 L616.7,329.5 L616.2,330.3 L616.1,331.2 L616.1,332.0 L617.1,332.8 L617.5,333.6 L618.3,334.3 L621.6,334.6 L622.2,335.4 L619.1,335.8 L616.4,336.2 L613.1,336.3 L611.6,337.4 L611.3,338.4 L610.6,339.2 L609.6,339.9 L612.0,340.6 L612.9,341.5 L614.4,342.2 L616.5,342.9 L618.9,343.6 L621.6,344.2 L625.6,344.8 L626.5,345.8 L631.5,346.3 L631.8,346.4 L633.1,347.0 L638.0,346.5 L642.0,347.2 L645.0,347.7Z"/><path d="M387.3,102.0 L387.4,102.0 L387.7,101.5 L388.9,101.5 L390.5,100.9 L389.3,101.7 L389.5,102.1 L389.3,102.1 L388.9,102.2 L388.7,102.2 L388.6,102.2 L388.5,102.0 L388.4,101.9 L388.1,101.9 L387.6,102.1 L387.3,102.0Z"/><path d="M387.3,102.0 L387.6,102.1 L388.1,101.9 L388.4,101.9 L388.5,102.0 L388.6,102.2 L388.7,102.2 L388.9,102.2 L389.3,102.1 L389.5,102.1 L389.5,102.3 L387.7,103.1 L386.9,102.9 L386.4,102.0 L387.3,102.0Z"/><path d="M326.2,101.9 L326.9,103.2 L327.0,104.5 L327.6,106.6 L328.0,107.1 L327.7,107.9 L325.4,108.2 L324.6,109.0 L323.6,109.1 L323.5,110.7 L321.5,111.5 L320.8,112.5 L319.4,113.1 L317.6,113.4 L314.8,114.9 L314.8,117.3 L314.6,117.3 L314.6,118.4 L313.5,118.5 L313.0,118.9 L312.2,118.9 L311.5,118.7 L310.1,118.9 L309.5,120.5 L308.9,120.6 L308.1,123.2 L305.7,125.4 L305.1,128.3 L304.4,129.2 L304.2,129.9 L300.2,130.1 L300.2,130.1 L300.3,129.1 L301.0,128.6 L301.5,127.5 L301.4,126.8 L302.0,125.4 L303.0,124.1 L303.6,123.7 L304.1,122.5 L304.1,121.4 L304.7,120.2 L305.9,119.4 L307.0,117.3 L307.0,117.3 L307.9,116.5 L309.5,116.3 L310.9,114.9 L311.8,114.3 L313.3,112.6 L312.8,110.1 L313.5,108.3 L313.7,107.2 L314.8,105.9 L316.6,104.9 L317.9,104.1 L319.1,102.0 L319.6,100.7 L320.9,100.7 L322.0,101.6 L323.6,101.4 L325.4,101.9 L326.2,101.9Z"/><path d="M373.8,128.9 L373.8,133.0 L371.7,133.0 L371.7,133.9 L364.7,129.9 L357.8,126.0 L356.0,127.1 L354.8,127.9 L353.8,126.8 L351.0,125.9 L350.2,124.6 L348.8,123.6 L348.0,124.0 L347.4,122.9 L347.3,122.0 L346.3,120.5 L347.0,119.6 L346.9,118.4 L347.1,117.2 L346.9,116.3 L347.3,114.6 L347.2,113.7 L346.6,111.9 L347.4,111.4 L347.6,110.5 L347.4,109.7 L348.6,108.9 L349.2,108.2 L350.0,107.6 L350.1,106.1 L352.2,106.8 L352.9,106.6 L354.4,106.9 L356.7,107.9 L357.5,109.7 L359.1,110.1 L361.5,110.9 L363.4,112.0 L364.3,111.4 L365.1,110.5 L364.7,108.9 L365.2,107.9 L366.5,107.0 L367.7,106.7 L370.1,107.1 L370.7,108.0 L371.3,108.0 L371.9,108.4 L373.6,108.6 L374.0,109.3 L373.4,110.3 L373.7,111.1 L373.2,112.4 L373.8,114.1 L373.8,121.4 L373.8,128.9Z"/><path d="M413.6,157.6 L408.7,163.7 L406.4,163.8 L404.8,165.3 L403.7,165.3 L403.2,166.0 L402.1,166.0 L401.3,165.3 L399.7,166.1 L399.2,167.0 L398.1,166.8 L397.7,166.6 L397.3,166.6 L396.7,166.6 L394.5,164.9 L393.3,164.9 L392.7,164.2 L392.7,163.1 L391.8,162.7 L390.7,160.5 L389.9,160.0 L389.6,159.2 L388.7,158.2 L387.7,158.0 L388.3,156.9 L389.2,156.8 L389.5,156.2 L389.4,154.4 L390.0,152.2 L390.8,151.6 L391.0,150.8 L391.7,149.2 L392.8,148.2 L393.5,146.2 L393.8,144.4 L395.8,144.9 L396.3,143.3 L397.4,144.3 L398.4,143.8 L398.8,144.2 L400.0,144.2 L401.6,145.1 L402.0,145.8 L402.8,146.4 L403.5,147.6 L404.1,148.3 L403.5,149.2 L402.9,150.2 L403.0,150.7 L403.1,151.3 L404.0,151.4 L404.5,151.2 L404.9,151.6 L404.5,152.3 L405.1,153.5 L405.8,154.4 L406.4,155.2 L412.2,157.6 L413.6,157.6Z"/><path d="M404.1,148.3 L404.9,148.5 L405.4,148.0 L405.8,148.6 L405.8,149.5 L404.8,149.9 L405.5,150.5 L404.9,151.6 L404.5,151.2 L404.0,151.4 L403.1,151.3 L403.0,150.7 L402.9,150.2 L403.5,149.2 L404.1,148.3Z"/><path d="M415.7,150.6 L415.7,150.6 L415.6,150.6 L415.6,151.5 L415.6,153.6 L415.6,154.6 L414.9,155.9 L413.6,157.6 L412.2,157.6 L406.4,155.2 L405.8,154.4 L405.1,153.5 L404.5,152.3 L404.9,151.6 L405.5,150.5 L406.1,150.9 L406.4,151.7 L407.2,152.6 L408.1,152.6 L409.7,152.1 L411.6,151.8 L413.2,151.2 L414.0,151.1 L414.7,150.7 L415.7,150.6 L415.7,150.6Z"/><path d="M389.3,175.9 L385.8,176.1 L383.8,176.1 L383.2,176.3 L382.2,177.0 L381.8,176.7 L381.8,175.2 L382.2,174.4 L382.3,172.8 L382.7,171.8 L383.3,170.8 L384.0,170.2 L384.6,169.5 L383.9,169.2 L384.0,166.8 L384.0,166.8 L384.7,166.2 L385.8,166.7 L387.2,166.2 L388.4,166.2 L389.5,165.3 L390.3,166.7 L390.5,167.7 L391.3,170.1 L390.7,171.6 L389.8,172.9 L389.3,173.8 L389.3,175.9Z"/><path d="M383.2,176.3 L383.9,177.5 L383.8,178.7 L383.3,178.9 L383.3,178.9 L382.4,178.8 L381.9,180.0 L380.8,179.8 L381.0,178.7 L381.2,178.5 L381.3,177.3 L381.8,176.7 L382.2,177.0 L383.2,176.3Z"/><path d="M362.5,86.6 L360.9,85.8 L360.3,84.9 L359.6,84.5 L358.8,83.7 L358.4,83.1 L357.6,82.1 L357.9,81.3 L358.6,81.7 L358.9,81.3 L359.8,81.3 L361.3,81.6 L362.5,81.6 L363.3,82.0 L363.3,82.0 L363.9,82.0 L363.5,82.9 L364.3,83.7 L364.0,84.7 L363.6,84.8 L363.3,85.0 L362.7,85.4 L362.5,86.6Z"/><path d="M369.2,87.2 L370.0,87.9 L370.2,89.3 L369.8,89.3 L369.5,89.7 L368.6,89.6 L367.9,90.1 L366.8,90.3 L366.1,89.8 L365.8,88.9 L366.0,88.2 L366.0,88.2 L366.3,88.2 L366.3,87.8 L367.4,87.5 L367.8,87.4 L368.4,87.3 L369.2,87.2Z"/><path d="M363.0,79.9 L363.0,79.9 L364.3,79.3 L365.4,79.4 L366.3,80.2 L366.5,80.9 L367.6,81.4 L367.7,82.2 L368.8,82.8 L369.3,82.4 L369.7,82.6 L369.3,83.0 L369.7,83.3 L369.2,83.8 L369.4,84.5 L370.2,85.4 L369.6,86.1 L369.3,86.7 L369.5,87.0 L369.2,87.2 L368.4,87.3 L367.8,87.4 L367.7,87.2 L367.9,87.0 L368.1,86.5 L367.9,86.5 L367.5,86.1 L367.2,86.0 L367.0,85.7 L366.7,85.6 L366.4,85.3 L366.1,85.4 L365.9,86.1 L365.5,86.2 L365.6,86.1 L364.9,85.6 L364.4,85.4 L364.1,85.1 L363.6,84.8 L364.0,84.7 L364.3,83.7 L363.5,82.9 L363.9,82.0 L363.3,82.0 L363.3,82.0 L363.9,81.3 L363.4,80.7 L363.0,79.9Z"/><path d="M365.1,86.7 L364.7,86.9 L364.5,86.5 L363.8,87.5 L363.9,88.2 L363.5,88.0 L363.0,87.3 L362.3,86.9 L362.5,86.6 L362.7,85.4 L363.3,85.0 L363.6,84.8 L364.1,85.1 L364.4,85.4 L364.9,85.6 L365.6,86.1 L365.5,86.2 L365.1,86.7Z"/><path d="M366.0,88.2 L365.9,87.5 L365.5,87.2 L365.1,86.7 L365.5,86.2 L365.9,86.1 L366.1,85.4 L366.4,85.3 L366.7,85.6 L367.0,85.7 L367.2,86.0 L367.5,86.1 L367.9,86.5 L368.1,86.5 L367.9,87.0 L367.7,87.2 L367.8,87.4 L367.4,87.5 L366.3,87.8 L366.3,88.2 L366.0,88.2Z"/><path d="M222.1,151.9 L223.1,151.7 L223.4,151.7 L223.4,153.3 L221.9,153.5 L221.6,153.3 L222.1,152.8 L222.1,151.9Z"/><path d="M384.0,166.8 L382.4,165.4 L382.0,164.6 L381.0,165.0 L380.2,164.9 L379.8,165.2 L379.0,165.0 L377.9,163.3 L377.6,162.6 L376.3,161.8 L375.9,160.6 L375.1,159.7 L374.0,158.6 L374.0,158.0 L373.0,157.1 L371.8,156.3 L372.3,156.1 L372.9,155.7 L373.4,153.9 L373.9,152.9 L375.1,152.7 L375.4,153.2 L376.3,154.4 L376.8,154.6 L377.4,154.2 L378.7,154.3 L378.9,154.7 L380.7,154.7 L380.8,154.3 L381.7,153.9 L381.8,153.3 L382.5,152.9 L384.0,154.1 L384.9,153.9 L385.7,152.4 L386.7,151.3 L386.5,150.1 L386.1,149.5 L387.2,149.3 L387.3,148.9 L388.1,149.0 L387.9,150.5 L388.1,152.0 L389.0,152.8 L389.2,153.5 L389.2,154.6 L389.4,154.6 L389.5,156.2 L389.2,156.8 L388.3,156.9 L387.7,158.0 L388.7,158.2 L389.6,159.2 L389.9,160.0 L390.7,160.5 L391.8,162.7 L390.6,164.1 L389.5,165.3 L388.4,166.2 L387.2,166.2 L385.8,166.7 L384.7,166.2 L384.0,166.8Z"/></g><g class="hr-egypt-target" tabindex="0" role="button" aria-label="Zoom into Egypt" onclick="hrToggleEgypt(true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();hrToggleEgypt(true)}"><path d="M394.5,128.9 L387.6,128.9 L380.8,128.9 L373.8,128.9 L373.8,121.4 L373.8,114.1 L373.2,112.4 L373.7,111.1 L373.4,110.3 L374.0,109.3 L376.4,109.2 L378.1,109.8 L379.8,110.4 L380.6,110.7 L381.9,110.1 L382.7,109.5 L384.2,109.3 L385.5,109.6 L385.9,110.6 L386.3,109.9 L387.7,110.4 L389.1,110.5 L390.0,110.0 L390.0,110.0 L390.9,113.0 L391.1,113.5 L390.6,114.3 L390.2,115.9 L389.8,117.0 L389.4,117.3 L388.8,116.7 L388.0,115.7 L386.7,112.8 L386.6,113.0 L387.3,115.2 L388.4,117.2 L389.7,120.4 L390.3,121.5 L390.9,122.7 L392.5,125.0 L392.1,125.3 L392.2,126.6 L394.2,128.5 L394.5,128.9Z" fill="#43e6ff" stroke="#e1ffff" stroke-width="1.6"/><circle cx="384.2" cy="118.6" r="14" fill="#38bdf8" opacity=".22"/><text x="397.2" y="109.6" fill="#e0f2fe" font-size="12" font-weight="bold">EGYPT</text></g></svg><p class="hr-map-hint">${hrText('مرر على مصر أو اضغط عليها لتكبير الخريطة','Hover or select Egypt to zoom into the map')}</p></div><div class="hr-egypt-zoom" id="hr-egypt-zoom"><div class="hr-zoom-top"><strong>${hrText('توزيع الموظفين في مصر','Employee distribution in Egypt')}</strong><button type="button" onclick="hrToggleEgypt(false)" class="hr-map-back">${hrText('↩ العودة للعالم','↩ World view')}</button></div><div class="hr-egypt-layout"><svg viewBox="0 0 540 500" class="hr-egypt-svg" id="hr-real-egypt-map" role="img" aria-label="Egypt governorate geographic boundaries"><text x="270" y="250" fill="#7dd3fc" text-anchor="middle" font-size="16">${hrText('جاري تحميل حدود المحافظات...','Loading governorate boundaries...')}</text></svg><span class="hr-map-status">${hrText('خريطة جغرافية للمحافظات','Geographic governorate map')}</span><div class="hr-geo-list"><p class="text-sky-300 mb-3">${hrText('المحافظات المسجلة','Recorded governorates')}: ${geoList.length}</p>${hrBars(geoList,mapped,27)}</div></div></div></div><div id="cc-transport-details" class="cc-transport-panel"><strong>${hrText('خطوط نقل الموظفين','Employee transport routes')}</strong><p>${hrText('اختر محافظة لعرض خطوط النقل عند توفر بياناتها','Select a governorate to view routes when data is available')}</p></div><div id="hr-geo-tooltip" class="hr-map-tooltip" aria-live="polite">${hrText('اختر محافظة لمعرفة العدد','Select a governorate to see its count')}</div><p class="text-xs text-slate-400 mt-3">${hrText('قيم الموقع المسجلة','Recorded locations')}: ${geoKnown} · ${hrText('المحددة','Mapped')}: ${mapped} · ${hrText('غير المطابقة','Unrecognized')}: ${unmatched} · ${hrText('بلا موقع','Missing')}: ${total-geoKnown}</p></div>`)}</div><div class="xl:col-span-2 flex flex-col gap-5">${hrPanel(hrText('توزيع الإدارات','Department distribution'),hrDonut(depts,total))}${hrPanel(hrText('المؤهلات المسجلة','Recorded qualifications'),hrHorizontalBars(qualification,total,7))}</div></div>
 <div class="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">${hrPanel(hrText('اتجاه التعيينات السنوية','Annual hiring trend'),yearsHtml)}${hrPanel(hrText('المسميات الوظيفية','Job titles'),hrHorizontalBars(jobs,total,8))}${hrPanel(hrText('جودة بيانات الموظفين','Employee data coverage'),hrBars([[hrText('محافظة معروفة','Known governorate'),mapped],[hrText('سنوات خدمة','Years of service'),yearsService.length],[hrText('حالة تأمينية مسجلة','Insurance status recorded'),insuredKnown],[hrText('مؤهل مسجل','Qualification recorded'),qualification.reduce((s,x)=>s+x[1],0)]],total,5)+`<p class="text-xs text-slate-400 mt-3">${hrText('حالات مؤمن عليه ضمن السجلات المعروفة','Insured among known records')}: ${insured} / ${insuredKnown}</p>`)}</div>
 <div class="hr-shortcut-grid grid grid-cols-1 md:grid-cols-3 gap-5 mb-5"><div class="hr-panel hr-widget" onclick="showHRPage('employees')" role="button" tabindex="0"><div class="text-sky-300 font-bold">${hrSvgIcon('users','hr-shortcut-icon')}${hrText('دليل الموظفين','Employees')}</div><div class="text-3xl font-extrabold mt-3">${total}</div><p class="text-xs text-slate-400 mt-2">${hrText('عرض ملفات الموظفين','Open employee records')} ↗</p></div><div class="hr-panel hr-widget" onclick="showHRPage('payroll')" role="button" tabindex="0"><div class="text-sky-300 font-bold">${hrSvgIcon('briefcase','hr-shortcut-icon')}${hrText('المرتبات','Payroll')}</div><div class="text-lg text-amber-300 mt-3">${hrText('بيانات تجريبية','Demo data')}</div><p class="text-xs text-slate-400 mt-2">${hrText('عرض قسم المرتبات','Open payroll')} ↗</p></div><div class="hr-panel hr-widget" onclick="showHRPage('notifications')" role="button" tabindex="0"><div class="text-sky-300 font-bold">${hrSvgIcon('bell','hr-shortcut-icon')}${hrText('الإشعارات وطلبات ESS','Notifications & ESS')}</div><div class="text-lg text-slate-300 mt-3">${hrText('بانتظار الربط','Integration pending')}</div><p class="text-xs text-slate-400 mt-2">${hrText('عرض مركز الإشعارات','Open notifications')} ↗</p></div></div>
 <div class="hr-panel text-sm text-slate-400">${hrText('تنبيه: الخريطة تستخدم محافظة الإقامة إن وُجدت، ولا تستنتجها من مكان الميلاد. الحضور والمرتبات وطلبات ESS غير متصلة هنا بعد.','Note: Location is based on residence fields where available, never inferred from birthplace. ESS attendance, payroll and requests are not connected yet.')}</div>`;

 // Real-data holographic panels, derived solely from loaded employee records.
 const maxDept=Math.max(1,...depts.map(x=>x[1]));
 const skyline=depts.slice(0,13).map(([label,count],i)=>`<div class="fahd-holo-column" title="${escapeHtml(label)}: ${count}"><div class="fahd-holo-value">${count}</div><div class="fahd-holo-bar" style="--height:${Math.max(9,count/maxDept*100)}%;--hue:${185+i*9}"></div><div class="fahd-holo-label">${escapeHtml(label)}</div></div>`).join('');
 const qTop=qualification.slice(0,6),qSum=qTop.reduce((sum,item)=>sum+item[1],0)||1;
 const radial=qTop.map(([label,count],i)=>`<div class="fahd-holo-row"><span>${escapeHtml(label)}</span><div class="fahd-holo-track"><i style="width:${Math.round(count/qSum*100)}%;--hue:${185+i*18}"></i></div><b>${count}</b></div>`).join('');
 d.insertAdjacentHTML('beforeend',`<div class="fahd-holo-grid"><section class="fahd-holo-panel"><div class="fahd-holo-head"><span>◈</span><h2>${hrText('أفق الإدارات — بيانات فعلية','Department skyline — live data')}</h2><small>${depts.length} ${hrText('إدارة','departments')}</small></div><div class="fahd-holo-skyline">${skyline}</div></section><section class="fahd-holo-panel"><div class="fahd-holo-head"><span>◎</span><h2>${hrText('بصمة المؤهلات','Qualification spectrum')}</h2><small>${qualification.reduce((a,b)=>a+b[1],0)} ${hrText('سجل','records')}</small></div><div class="fahd-holo-radial">${radial}</div></section></div>`);

 // COMMAND CENTER v14: independently useful metrics, no invented gender/transport figures.
 const genderValue=e=>String(getField(e,'gender','Gender','gender_en','النوع','الجنس','النوع الاجتماعي','النوع الإجتماعي')||'').trim().toLowerCase();
 const male=allEmployees.filter(e=>/^(male|m|ذكر|رجل)$/.test(genderValue(e))).length;
 const female=allEmployees.filter(e=>/^(female|f|أنثى|انثى|سيدة)$/.test(genderValue(e))).length;
 const genderKnown=male+female;
 const genderPercent=genderKnown?Math.round(male/genderKnown*100):0;
 const ageValues=allEmployees.map(e=>{const raw=String(getField(e,'dob','date of birth','date_of_birth','تاريخ الميلاد')||'').trim();let y=0;const match=raw.match(/(19|20)\d{2}/);if(match)y=+match[0];const age=new Date().getFullYear()-y;return y&&age>=16&&age<=100?age:null}).filter(v=>v!==null);
 const ageGroups=[['< 30',ageValues.filter(v=>v<30).length],['30–39',ageValues.filter(v=>v>=30&&v<40).length],['40–49',ageValues.filter(v=>v>=40&&v<50).length],['50+',ageValues.filter(v=>v>=50).length]];
 const maxAge=Math.max(1,...ageGroups.map(v=>v[1]));
 const yearPoints=hireYears.slice(-14),maxYear=Math.max(1,...yearPoints.map(v=>v[1]));
 const spark=yearPoints.length>1?yearPoints.map((v,i)=>`${18+i*560/(yearPoints.length-1)},${142-v[1]/maxYear*110}`).join(' '):'';
 const peopleIcons=Array.from({length:40},(_,i)=>`<span class="cc-person ${genderKnown&&i<Math.round(female/genderKnown*40)?'cc-female':''}" aria-hidden="true">♟</span>`).join('');
 const panel=(title,subtitle,content)=>`<section class="cc-panel"><div class="cc-heading"><strong>${title}</strong><small>${subtitle}</small></div>${content}</section>`;
 const genderMarkup=genderKnown?`<div class="cc-gender-figures"><div class="cc-ring" style="--portion:${genderPercent}%"><div><b>${genderPercent}%</b><small>${hrText('ذكور','Male')}</small></div></div><div class="cc-people">${peopleIcons}</div></div><div class="cc-gender-numbers"><span>${hrText('ذكور','Male')} <b>${male}</b></span><span>${hrText('إناث','Female')} <b>${female}</b></span><span>${hrText('غير محدد','Unknown')} <b>${total-genderKnown}</b></span></div>`:`<div class="cc-empty"><span class="cc-empty-icon">◌</span><strong>${hrText('في انتظار بيانات النوع','Awaiting gender data')}</strong><small>${hrText('سيتم تحديث الرسم تلقائيًا بعد إضافة النوع إلى بيانات الموظفين','This chart updates automatically when employee gender is available')}</small></div>`;
 const ageMarkup=ageValues.length?`<div class="cc-age">${ageGroups.map(([label,n],i)=>`<div><span>${label}</span><div class="cc-track"><i style="width:${n/maxAge*100}%;--cc:${['#22d3ee','#8b5cf6','#f472b6','#38bdf8'][i]}"></i></div><b>${n}</b></div>`).join('')}</div><small class="cc-foot">${ageValues.length} / ${total} ${hrText('سجل بعمر قابل للحساب','records with usable birth dates')}</small>`:`<div class="cc-empty">${hrText('في انتظار تواريخ الميلاد','Awaiting birth dates')}</div>`;
 const hiresMarkup=spark?`<svg class="cc-spark" viewBox="0 0 600 170" role="img" aria-label="Hiring by year"><defs><linearGradient id="ccSparkGradient" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#22d3ee" stop-opacity=".4"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></linearGradient></defs><path d="M${spark.replaceAll(' ',' L')} L578,154 L18,154 Z" fill="url(#ccSparkGradient)"/><polyline points="${spark}" fill="none" stroke="#55eaff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="cc-year-labels"><span>${yearPoints[0][0]}</span><span>${yearPoints.at(-1)[0]}</span></div>`:`<div class="cc-empty">${hrText('في انتظار بيانات التعيينات','Awaiting hiring history')}</div>`;
 d.insertAdjacentHTML('beforeend',`<div class="cc-dashboard"><div class="cc-section-title"><span>◈</span><div><strong>${hrText('مركز القيادة والتحليلات','People Intelligence Command Center')}</strong><small>${hrText('تحليلات من السجلات المحملة — لا توجد أرقام افتراضية','Analytics from loaded records — no fabricated values')}</small></div><i>LIVE DATA</i></div><div class="cc-grid">${panel(hrText('التنوع بين الجنسين','Gender diversity'),`${genderKnown}/${total} ${hrText('بيانات متاحة','available')}`,genderMarkup)}${panel(hrText('الهيكل العمري','Age distribution'),`${ageValues.length} ${hrText('سجل','records')}`,ageMarkup)}${panel(hrText('موجة التعيينات','Hiring pulse'),`${yearPoints.length} ${hrText('سنوات','years')}`,hiresMarkup)}</div></div>`);
 // V15: rebuild the dashboard composition while retaining the working map DOM and its event hooks.
 const preservedMap=d.querySelector('#hr-map-stage')?.closest('.hr-panel');
 const mapHtml=preservedMap?preservedMap.outerHTML:'';
 const palette=['#23e6ff','#7c72ff','#24e1b8','#f7b84b','#fa6da5','#3ba9ff'];
 const maxD=Math.max(1,...depts.map(x=>x[1]));
 const departmentCity=depts.slice(0,13).map(([label,n],i)=>`<div class="v15-tower" title="${escapeHtml(label)} · ${n}"><b>${n}</b><div class="v15-tower-shaft" style="height:${Math.max(12,n/maxD*155)}px;--tone:${palette[i%palette.length]}"></div><span>${escapeHtml(label)}</span></div>`).join('');
 const hiresMax=Math.max(1,...hireYears.map(x=>x[1]));
 const hiringChart=hireYears.slice(-12).map(([y,n],i)=>`<div class="v15-hire" title="${escapeHtml(y)} · ${n}"><b>${n}</b><div style="height:${Math.max(7,n/hiresMax*105)}px;--tone:${palette[i%palette.length]}"></div><small>${escapeHtml(y)}</small></div>`).join('');
 const qualRows=qualification.slice(0,6).map(([label,n],i)=>`<div class="v15-qual-row"><span title="${escapeHtml(label)}">${escapeHtml(label)}</span><div><i style="width:${n/Math.max(1,qualification[0]?.[1]||1)*100}%;--tone:${palette[i%palette.length]}"></i></div><b>${n}</b></div>`).join('');
 const summaryCard=(title,value,detail,icon)=>`<div class="v15-stat"><span class="v15-stat-icon">${hrSvgIcon(icon)}</span><small>${title}</small><strong>${value}</strong><em>${detail}</em></div>`;
 const metricCards=[summaryCard(hrText('الموظفون','Employees'),total,hrText('السجلات المحملة','Loaded records'),'users'),summaryCard(hrText('الإدارات','Departments'),depts.length,hrText('إدارات مسجلة','Recorded departments'),'building'),summaryCard(hrText('المسميات','Job titles'),jobs.length,hrText('مسميات مختلفة','Distinct roles'),'briefcase'),summaryCard(hrText('متوسط الخدمة','Average tenure'),avgService,hrText('بالسنوات','Years'),'clock'),summaryCard(hrText('تعيينات آخر 5 سنوات','Last five years'),recentHires,hrText('موظف','Employees'),'calendar'),summaryCard(hrText('تغطية المحافظات','Location coverage'),hrPercent(mapped,total)+'%',hrText('سجلات معروفة','Mapped records'),'map')].join('');
 const genderFigure=genderKnown?`<div class="v15-gender-ring" style="--male:${Math.round(male/genderKnown*100)}%"><div><b>${genderKnown}</b><small>${hrText('سجل محدد','known')}</small></div></div><div class="v15-gender-legend"><span>● ${hrText('ذكور','Male')} <b>${male}</b></span><span>● ${hrText('إناث','Female')} <b>${female}</b></span><small>${hrText('غير محدد','Missing')}: ${total-genderKnown}</small></div>`:`<div class="v15-empty"><div class="v15-people-placeholder" aria-hidden="true">♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙</div><strong>${hrText('بانتظار بيانات النوع','Awaiting gender data')}</strong><small>${hrText('سيظهر التوزيع تلقائيًا عند إدخال البيانات','The visualization populates from employee records')}</small></div>`;
 d.innerHTML=`<div class="v15-command" dir="${currentLang==='ar'?'rtl':'ltr'}">
 <header class="v15-hero"><div><small>LACTO MISR · PEOPLE INTELLIGENCE · 2026</small><h1>${hrText('مركز قيادة الموارد البشرية','HR COMMAND CENTER')}</h1><p>${hrText('تحليلات حية من سجلات الموظفين — بدون بيانات تجريبية','Employee-record analytics · no fabricated figures')}</p></div><div class="v15-live"><span class="v15-live-dot"></span> FIREBASE <b>${total}</b></div></header>
 <div class="v15-stat-grid">${metricCards}</div>
 <div class="v15-main-grid">
 <section class="v15-panel v15-dept"><div class="v15-panel-head"><div><small>01 / ORGANIZATION</small><h2>${hrText('أفق الإدارات','DEPARTMENT SKYLINE')}</h2></div><span class="v15-chip">${depts.length} ${hrText('إدارة','departments')}</span></div><div class="v15-city">${departmentCity||'<div class="v15-empty">—</div>'}</div></section>
 <section class="v15-panel v15-gender"><div class="v15-panel-head"><div><small>02 / DEMOGRAPHICS</small><h2>GENDER DIVERSITY</h2></div><span class="v15-chip">${genderKnown}/${total}</span></div><div class="v15-gender-content">${genderFigure}</div></section>
 <section class="v15-panel v15-qual"><div class="v15-panel-head"><div><small>03 / WORKFORCE</small><h2>${hrText('بصمة المؤهلات','QUALIFICATION SPECTRUM')}</h2></div></div><div class="v15-qual-list">${qualRows||'<div class="v15-empty">—</div>'}</div></section>
 <section class="v15-panel v15-hiring"><div class="v15-panel-head"><div><small>04 / RECRUITMENT</small><h2>${hrText('نبض التعيينات','HIRING PULSE')}</h2></div></div><div class="v15-hiring-chart">${hiringChart||'<div class="v15-empty">—</div>'}</div></section>
 <section class="v15-panel v15-ages"><div class="v15-panel-head"><div><small>05 / AGE PROFILE</small><h2>${hrText('الهيكل العمري','AGE STRUCTURE')}</h2></div><span class="v15-chip">${ageValues.length}/${total}</span></div>${ageMarkup}</section>
 <section class="v15-map-wrap"><div class="v15-panel-head"><div><small>06 / GEO INTELLIGENCE</small><h2>${hrText('الخريطة التفاعلية وخطوط النقل','EGYPT GEO INTELLIGENCE & TRANSPORT')}</h2></div><span class="v15-chip">${mapped} ${hrText('موظف','mapped')}</span></div><div id="v15-map-mount"></div></section>
 </div><footer class="v15-footer">${hrText('مصدر الرسوم: السجلات المحملة من Firebase · الخانات غير المتاحة تظل فارغة حتى استكمال البيانات','Charts use loaded Firebase records · missing metrics remain unpopulated')}</footer></div>`;
 if(mapHtml)d.querySelector('#v15-map-mount').innerHTML=mapHtml;
 // End v15 rebuild.
 hrRenderGeographicEgypt(counts);
 d.querySelectorAll('.hr-map-dot').forEach(node=>{const update=()=>{const el=d.querySelector('#hr-geo-tooltip');if(el)el.textContent=node.dataset.geoName+' — '+node.dataset.geoCount+' '+hrText('موظف','employees')};node.addEventListener('mouseenter',update);node.addEventListener('focus',update);node.addEventListener('click',update)});
 const target=d.querySelector('.hr-egypt-target');if(target)target.addEventListener('mouseenter',()=>hrToggleEgypt(true));
 d.querySelectorAll('.hr-widget').forEach(el=>el.addEventListener('keydown',ev=>{if(ev.key==='Enter'){el.click()}}));
}


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
 // Read-only cards show the selected language; edit mode exposes both language columns.
 for(const [id,ar,en,arKey,enKey] of FAHD_PAIRS){
  for(const [lang,key,label] of [['ar',arKey,ar],['en',enKey,en]]){
   const wrap=document.createElement('div');wrap.className='fahd-field';wrap.dataset.fieldLanguage=lang;
   const lab=document.createElement('label');lab.textContent=label+' ('+lang.toUpperCase()+')';
   const input=document.createElement('input');input.type='text';input.dataset.fahdKey=key;input.value=String(emp[key]??'');input.disabled=true;
   wrap.append(lab,input);fields.append(wrap);fahdEditing.original[key]=input.value;
  }
 }
 for(const [id,ar,en,arKey,enKey,type] of FAHD_COMMON){
  const wrap=document.createElement('div');wrap.className='fahd-field';wrap.dataset.fieldLanguage='common';
  const lab=document.createElement('label');lab.dataset.labelAr=ar;lab.dataset.labelEn=en;lab.textContent=fahdLang(ar,en);
  if(arKey!==enKey){
   for(const [language,key,title] of [['ar',arKey,ar],['en',enKey,en]]){
    const card=document.createElement('div');card.className='fahd-field';card.dataset.fieldLanguage=language;
    const titleNode=document.createElement('label');titleNode.textContent=title+' ('+language.toUpperCase()+')';
    const field=document.createElement('input');field.type=type==='date'?'date':'text';field.dataset.fahdKey=key;
    const raw=emp[key]??'';field.value=type==='date'?fahdISO(raw):String(raw);field.disabled=true;
    fahdEditing.original[key]=field.value;card.append(titleNode,field);fields.append(card);
   }
  }else{
   const input=document.createElement('input');input.type=type==='date'?'date':'text';input.dataset.fahdKey=arKey;
   const raw=emp[arKey]??'';input.value=type==='date'?fahdISO(raw):String(raw);input.disabled=true;
   fahdEditing.original[arKey]=input.value;wrap.append(lab,input);fields.append(wrap);
  }
 }
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
async function fahdSave(){
 if(fahdBusy||!fahdEditing)return;const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(fahdEditing.code));const status=document.getElementById('fahd-status');
 if(!emp||!fahdEditing.path||emp._firebasePath!==fahdEditing.path){status.textContent=fahdLang('تعذر تحديد السجل','Employee record unavailable');return;}
 const updates={};document.querySelectorAll('#fahd-fields [data-fahd-key]').forEach(input=>{
  const key=input.dataset.fahdKey;if(input.value===fahdEditing.original[key])return;
  const value=input.type==='date'?fahdStoredDate(input.value):input.value.trim();updates[key]=value;
  // Each translated field is independent; never overwrite its counterpart.
 });
 const dob=updates['تاريخ الميلاد'];if(dob){const age=fahdAge(dob);if(age){updates['السن حتى تاريخه ']=age;updates['age to date']=age;}}
 if(!Object.keys(updates).length){status.textContent=fahdLang('لا توجد تغييرات للحفظ','No changes to save');return;}
 if(!await fahdDialog(fahdLang('حفظ التعديلات','Save changes'),fahdLang('هل تريد حفظ التغييرات؟','Save these changes?')))return;
 fahdBusy=true;document.getElementById('fahd-save').disabled=true;
 try{await db.ref(fahdEditing.path).update(updates);Object.assign(emp,updates);renderTable(allEmployees);fahdRender(emp);status.textContent=fahdLang('✓ تم الحفظ','✓ Changes saved');await fahdDialog(fahdLang('تم الحفظ','Saved'),fahdLang('تم حفظ التعديلات بنجاح','Changes saved successfully'),'notice');}
 catch(err){status.textContent=fahdLang('فشل الحفظ: ','Save failed: ')+(err?.message||'Permission denied');}
 finally{fahdBusy=false;document.getElementById('fahd-save').disabled=false;}
}
function fahdSetEditing(on){fahdIsEditing=on;document.querySelectorAll('#fahd-fields [data-fahd-key]').forEach(el=>el.disabled=!on);fahdRefreshFieldVisibility();for(const [id,visible] of [['fahd-edit',!on],['fahd-save',on],['fahd-cancel',on]]){const el=document.getElementById(id);if(el)el.hidden=!visible;}}
function fahdStartEdit(){fahdSetEditing(true)}
function fahdCancelEdit(){document.querySelectorAll('#fahd-fields [data-fahd-key]').forEach(el=>el.value=fahdEditing?.original[el.dataset.fahdKey]??'');fahdSetEditing(false)}
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
