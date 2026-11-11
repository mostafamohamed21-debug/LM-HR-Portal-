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
let lmCustomFieldDefinitions = {};
async function lmLoadCustomFieldDefinitions(){const s=await db.ref('employee_field_definitions').once('value');lmCustomFieldDefinitions=s.val()||{};}

let currentLang = localStorage.getItem('lacto_lang') || 'ar';
let activeEmployeeCode = null;
let currentUserData = null;
let portalInitialized = false;

const translations = {
    ar: {
        admin: "مسؤول النظام", control_panel: "غرفة التحكم", nav_home: "الرئيسية والموظفين", nav_depts: "الإدارات والأقسام",
        nav_attendance: "الحضور والإنصراف", nav_reports: "التقارير والإحصائيات", total_emp: "إجمالي العاملين", active_depts: "الإدارات النشطة",
        system_status: "حالة النظام", connected: "مستقر", emp_list: "قائمة العاملين بالقاعدة", search_placeholder: "بحث بالاسم أو الكود...",
        th_code: "الكود", th_name: "اسم الموظف", th_dept: "الإدارة", th_job: "الوظيفة", th_hire: "تاريخ التعيين", th_actions: "الإجراءات",
        loading: "جاري جلب البيانات من القاعدة...", no_results: "لا توجد نتائج مطابقة للبحث", action_btn: "عرض الملف", back_btn: "← العودة للقائمة",
        profile_title: "الملف الوظيفي الشامل", edit_btn: "تعديل البيانات", save_btn: "حفظ", yes_btn: "نعم", cancel_btn: "إلغاء",
        confirm_title: "هل ترغب في حفظ التعديلات؟", change_photo: "تعديل الصورة", sec_job: "البيانات الوظيفية", manager_label: "المدير المباشر",
        service_years: "سنوات الخدمة", sec_qual: "المؤهل العلمي", qual_label: "المؤهل", qual_auth: "جهة المؤهل", sec_personal: "البيانات الشخصية",
        dob_label: "تاريخ الميلاد", age_label: "السن حتى تاريخه", insurance_label: "الحالة التأمينية", pob_label: "مكان الميلاد",
        toast_success: "تم حفظ التعديلات بنجاح وتحديث بيانات البورتال", login_title: "تسجيل الدخول", login_subtitle: "أدخل كود الموظف وكلمة المرور",
        code_placeholder: "كود الموظف", pass_placeholder: "كلمة المرور", remember_me: "تذكرني", forgot_pass: "نسيت كلمة المرور؟", login_btn: "دخول للنظام",
        logout_btn: "تسجيل الخروج", login_required: "يرجى إدخال كود الموظف وكلمة المرور", login_not_found: "كود الموظف غير مسجل!",
        login_wrong_pass: "كلمة المرور غير صحيحة!", setup_password_title: "الموظف مسجل لكن لا توجد كلمة مرور. أنشئ كلمة مرور للمتابعة.", confirm_password_placeholder: "تأكيد كلمة المرور", create_password_btn: "إنشاء كلمة المرور والدخول", password_mismatch: "كلمتا المرور غير متطابقتين.", password_too_short: "كلمة المرور يجب أن تكون 6 أحرف على الأقل.", password_saved: "تم إنشاء كلمة المرور وحفظها. جاري تسجيل الدخول...", login_error: "حدث خطأ أثناء الاتصال، حاول مرة أخرى.", logged_out: "تم تسجيل الخروج بنجاح",
        add_employee_btn: "+ إضافة موظف", add_employee_title: "إضافة موظف جديد", add_employee_hint: "سيتم إنشاء السجل مباشرة في قاعدة بيانات البورتال.", save_employee_btn: "حفظ الموظف",
        employee_exists: "هذا الكود موجود بالفعل.", employee_saved: "تمت إضافة الموظف بنجاح إلى Firebase.", required_code: "كود الموظف مطلوب.",
        firebase_fields_title: "حقول سجل الموظف", firebase_fields_hint: "كل الحقول المسجلة للموظف تظهر هنا ويمكن تعديلها.",
        add_custom_field_btn: "+ إضافة خانة إضافية", custom_field_title: "إضافة خانة إضافية", field_name_label: "اسم الخانة", field_value_label: "القيمة",
        custom_field_saved: "تمت إضافة الخانة وتحديث Firebase فوراً.", custom_field_invalid: "اسم الخانة غير صالح. تجنب . # $ [ ] /",
        forgot_title: "استعادة كلمة المرور", forgot_hint: "سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريد الإدارة.", forgot_code_placeholder: "كود الموظف",
        forgot_email_placeholder: "البريد الإلكتروني (يُطلب فقط إذا لم يكن مسجلاً)", verification_placeholder: "رمز التحقق", new_password_placeholder: "كلمة المرور الجديدة",
        send_code_btn: "إرسال رابط إعادة التعيين", verify_reset_btn: "تحقق وتغيير كلمة المرور", forgot_email_note: "يجب تفعيل خدمة البريد في Firebase (Trigger Email/Cloud Function) لكي يصل الرمز فعلياً إلى البريد.",
        email_required: "أدخل البريد الإلكتروني.", code_sent: "تم إنشاء رمز التحقق وتجهيزه للإرسال إلى البريد.", code_sent_no_email: "تم تجهيز الرمز، لكن خدمة البريد غير مفعلة في Firebase بعد.",
        invalid_code: "رمز التحقق غير صحيح أو منتهي.", password_changed: "تم تغيير كلمة المرور بنجاح.", new_password_required: "أدخل كلمة المرور الجديدة.",
        code_expired: "انتهت صلاحية رمز التحقق، اطلب رمزاً جديداً.", employee_email_found: "تم العثور على البريد المسجل.", employee_email_missing: "لا يوجد بريد مسجل، أدخل بريد الموظف.",
        schema_loading: "جاري تجهيز حقول سجل الموظف...",
        header_brand: "لاكتو مصر - شؤون العاملين", powered_by: "برمجة وتطوير إدارة الموارد البشرية", portal_version: "بورتال الموظفين v5.2 - النسخة الاحترافية"
    },
    en: {
        admin: "System Admin", control_panel: "Control Room", nav_home: "Home & Employees", nav_depts: "Departments",
        nav_attendance: "Attendance & Departure", nav_reports: "Reports & Analytics", total_emp: "Total Employees", active_depts: "Active Departments",
        system_status: "System Status", connected: "Stable", emp_list: "Database Employees List", search_placeholder: "Search by name or code...",
        th_code: "CODE", th_name: "EMPLOYEE NAME", th_dept: "DEPARTMENT", th_job: "JOB TITLE", th_hire: "HIRE DATE", th_actions: "ACTIONS",
        loading: "Fetching data from database...", no_results: "No matching results found", action_btn: "View Profile", back_btn: "← Back to List",
        profile_title: "Comprehensive Employee Profile", edit_btn: "Edit Data", save_btn: "Save", yes_btn: "Yes", cancel_btn: "Cancel",
        confirm_title: "Do you want to save changes?", change_photo: "Change Photo", sec_job: "Job Details", manager_label: "Direct Manager",
        service_years: "Years of Service", sec_qual: "Education Qualification", qual_label: "Qualification", qual_auth: "Issuing Authority", sec_personal: "Personal Data",
        dob_label: "Date of Birth", age_label: "Age to Date", insurance_label: "Insurance Status", pob_label: "Place of Birth",
        toast_success: "Changes saved successfully in the Portal", login_title: "Sign in", login_subtitle: "Enter employee code and password",
        code_placeholder: "Employee Code", pass_placeholder: "Password", remember_me: "Remember Me", forgot_pass: "Forgot password?", login_btn: "Sign in",
        logout_btn: "Sign out", login_required: "Please enter employee code and password", login_not_found: "Employee code not found!",
        login_wrong_pass: "Incorrect password!", setup_password_title: "Your employee record exists but has no password. Create one to continue.", confirm_password_placeholder: "Confirm password", create_password_btn: "Create Password & Sign In", password_mismatch: "The passwords do not match.", password_too_short: "Password must be at least 6 characters.", password_saved: "Password created and saved. Signing in...", login_error: "Connection error. Please try again.", logged_out: "Signed out successfully",
        add_employee_btn: "+ Add Employee", add_employee_title: "Add New Employee", add_employee_hint: "The record will be created in the Portal database.", save_employee_btn: "Save Employee",
        employee_exists: "This employee code already exists.", employee_saved: "Employee added successfully to Firebase.", required_code: "Employee code is required.",
        firebase_fields_title: "Employee Record Fields", firebase_fields_hint: "All stored employee fields appear here and can be edited.",
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
        return getField(emp, 'اسم الموظف ', 'اسم الموظف', 'name_ar') || '--';
    } else {
        return getField(emp, 'emp_name _en', 'employee_name_en', 'name_en') || '--';
    }
}

function getEmployeeDept(emp) {
    if (!emp) return '--';
    if (currentLang === 'ar') {
        return getField(emp, 'الإدارة ', 'الإدارة') || '--';
    } else {
        return getField(emp, 'department ', 'department', 'dept') || '--';
    }
}

function getEmployeeJob(emp) {
    if (!emp) return '--';
    if (currentLang === 'ar') {
        return getField(emp, 'الوظيفة', 'الوظيفة ') || '--';
    } else {
        return getField(emp, 'job title ', 'job title') || '--';
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
// Read-only key normalization: never rename Firebase keys or overwrite their values.
function lmNormalizeFieldKey(key) { return String(key ?? '').normalize('NFKC').replace(/\s+/g,' ').trim().toLocaleLowerCase(); }
function getField(emp, ...keys) {
    if (!emp || typeof emp !== 'object') return '';
    for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(emp,key) && emp[key] != null && String(emp[key]).trim() !== '') return emp[key];
    }
    const normalized = new Map(Object.keys(emp).map(key=>[lmNormalizeFieldKey(key),key]));
    for (const key of keys) {
        const realKey=normalized.get(lmNormalizeFieldKey(key));
        if (realKey !== undefined && emp[realKey] != null && String(emp[realKey]).trim() !== '') return emp[realKey];
    }
    return '';
}
function getEmployeeCode(emp) { return String(getField(emp, 'الكود', 'code', 'employeeCode', 'empCode', 'EmployeeCode', 'employee_code', 'ID', 'id') || '').trim(); }

function existingKey(obj, keys, fallback) {
    for (const key of keys) if (Object.prototype.hasOwnProperty.call(obj || {}, key)) return key;
    const normalized=new Map(Object.keys(obj||{}).map(key=>[lmNormalizeFieldKey(key),key]));
    for (const key of keys) {const found=normalized.get(lmNormalizeFieldKey(key));if(found!==undefined)return found;}
    return fallback || keys[0];
}
function putMapped(obj, source, keys, value, fallback) {
    const key = existingKey(source, keys, fallback);
    obj[key] = value;
}
// Paired fields must never cross-write the opposite language during profile editing.
const LM_PROFILE_LANGUAGE_KEYS = {
 'prof-name':{ar:['اسم الموظف ','اسم الموظف','name_ar'],en:['emp_name _en','employee_name_en','name_en']},
 'prof-dept':{ar:['الإدارة ','الإدارة'],en:['department ','department']},
 'prof-job':{ar:['الوظيفة','الوظيفة '],en:['job title ','job title']},
 'prof-manager':{ar:['المدير المباشر ','المدير المباشر'],en:['direct manager ','direct manager']},
 'prof-qual':{ar:['المؤهل'],en:['qualification']},
 'prof-qual-auth':{ar:['جهة المؤهل ','جهة المؤهل'],en:['qulification issuing authority','qualification issuing authority']},
 'prof-insurance':{ar:['الحالة التأمينية ','الحالة التأمينية'],en:['insurance status ','insurance status']},
 'prof-pob':{ar:['مكان الميلاد'],en:['pob']}
};
function lmPutProfileLanguageField(updated, employee, inputId) {
 const keys=LM_PROFILE_LANGUAGE_KEYS[inputId][currentLang];
 const normalized=new Set(keys.map(lmNormalizeFieldKey));
 const actual=Object.keys(employee).find(k=>normalized.has(lmNormalizeFieldKey(k)));
 // Do not create a new language field silently when a record has no matching key.
 if(actual) updated[actual]=document.getElementById(inputId).value;
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
    lmPopulateEmployeeFilters();
    filterEmployees();
    if (typeof renderHRWorkspace === 'function') renderHRWorkspace();
    if (activeEmployeeCode !== null) viewEmployee(activeEmployeeCode);
    document.querySelectorAll("[data-ar][data-en]:not(.hr-nav [data-ar])").forEach(el=>{el.textContent=el.getAttribute("data-"+currentLang);});
    if (document.getElementById('add-employee-modal') && !document.getElementById('add-employee-modal').classList.contains('hidden')) buildAddEmployeeForm();
    if(typeof lmUpdateHeaderIdentity==='function') lmUpdateHeaderIdentity();
    if(typeof lmV54RefreshAttendanceLanguage==='function') lmV54RefreshAttendanceLanguage();

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
    showLoginMessage(currentLang === 'ar' ? 'جاري التحقق من بيانات الدخول...' : 'Verifying credentials...', 'success');
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
            : (currentLang === 'ar' ? 'تعذر تسجيل الدخول. تأكد من كلمة المرور وإعدادات الاتصال.' : 'Sign-in failed. Check your password and connection settings.'));
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
        await lmLoadCustomFieldDefinitions();
        queueMicrotask(lmUpdateHeaderIdentity);
        lmPopulateEmployeeFilters();
        filterEmployees();
        updateDashboardStats();
        if(hrActivePage==='dashboard') renderHRWorkspace();
        if (typeof renderHRWorkspace === 'function') renderHRWorkspace();
        const status = document.getElementById('connection-status');
        if (status) status.textContent = currentLang === 'ar'
            ? `متصل بالبورتال — ${lm27ActiveEmployees().length} موظف على رأس العمل`
            : `Connected to Portal — ${lm27ActiveEmployees().length} active employees`;
    } catch (error) {
        if (tableBody) tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-300">${tr('login_error')}</td></tr>`;
        showToast(tr('login_error'), true);
    }
}

// Employee filtering uses the current Firebase employee snapshot; never modifies records.
let lmLastFilteredEmployees=[];
let lmAppliedSearchQuery='';
function lmCommitEmployeeSearch(){lmAppliedSearchQuery=String(document.getElementById('search-input')?.value||'').trim();filterEmployees();}
function lmEmployeeSearchInputChanged(input){if(!String(input?.value||'').trim()){lmAppliedSearchQuery='';filterEmployees();}}

const lmFilterSpecs=[
 ['dept',e=>getEmployeeDept(e),'الإدارة','Department'],
 ['job',e=>getEmployeeJob(e),'الوظيفة','Job title'],
 ['qual',e=>currentLang==='ar'?getField(e,'المؤهل','المؤهل ','qualification'):getField(e,'qualification','المؤهل','المؤهل '),'المؤهل','Qualification'],
 ['gender',e=>currentLang==='ar'?getField(e,'النوع','الجنس','gender','Gender'):getField(e,'gender','Gender','النوع','الجنس'),'النوع','Gender'],
 ['gov',e=>currentLang==='ar'?getField(e,'المحافظة ','المحافظة','محافظة','governorate','governorate '):getField(e,'governorate','governorate ','المحافظة ','المحافظة','محافظة'),'المحافظة','Governorate'],
 ['marital',e=>currentLang==='ar'?getField(e,'الحالة الإجتماعية ','الحالة الإجتماعية','الحالة الاجتماعية ','الحالة الاجتماعية','marital status ','marital status','maritalStatus'):getField(e,'marital status ','marital status','maritalStatus','الحالة الإجتماعية ','الحالة الإجتماعية','الحالة الاجتماعية ','الحالة الاجتماعية'),'الحالة الاجتماعية','Marital status']
];
function lmFilterValue(e,fn){const v=fn(e);return String(v??'').trim().replace(/\s+/g,' ');}
function lmPopulateEmployeeFilters(){
 for(const [id,fn,ar,en] of lmFilterSpecs){
  const select=document.getElementById('lm-filter-'+id);if(!select)continue;
  const prior=[...select.selectedOptions].map(o=>o.value);
  // Jobs reflect the chosen departments; other choices remain available.
  const departments=[...document.getElementById('lm-filter-dept')?.selectedOptions||[]].map(o=>o.value);
  const source=id==='job'&&departments.length?allEmployees.filter(e=>departments.includes(lmFilterValue(e,lmFilterSpecs[0][1]))):allEmployees;
  const values=[...new Set(source.map(e=>lmFilterValue(e,fn)).filter(v=>v&&v!=='--'))].sort((a,b)=>a.localeCompare(b,currentLang==='ar'?'ar':'en',{numeric:true}));
  select.replaceChildren();
  for(const value of values){const o=document.createElement('option');o.value=value;o.textContent=value;o.selected=prior.includes(value);select.append(o)}
 }
 document.querySelectorAll('#lm-employee-filters [data-ar][data-en]').forEach(el=>el.textContent=el.dataset[currentLang]);
}
function lmHireISO(emp){const raw=getHireDate(emp);if(/^\d{4}-\d{2}-\d{2}$/.test(String(raw)))return raw;const m=String(raw).match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);return m?`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`:''}
let lm23ShowArchive=false;
function lm23ArchiveToggle(){
 lm23ShowArchive=!lm23ShowArchive;filterEmployees();
}
function filterEmployees(){
 const counter=document.getElementById('lm-filter-count');
 if(counter&&!document.getElementById('lm23-archive-toggle')){
  const b=document.createElement('button');b.id='lm23-archive-toggle';b.type='button';b.className='portal-ghost-btn';b.style.cssText='margin-inline-start:12px;padding:7px 12px;border-radius:9px';
  b.onclick=lm23ArchiveToggle;counter.insertAdjacentElement('afterend',b);
 }
 const archiveButton=document.getElementById('lm23-archive-toggle');
 if(archiveButton)archiveButton.textContent=lm23ShowArchive?(currentLang==='ar'?'عرض العاملين':'Show active employees'):(currentLang==='ar'?'أرشيف المنتهية خدمتهم':'Ended-service archive');
 const query=String(lmAppliedSearchQuery||'').trim().toLocaleLowerCase();
 // A selected job matches ANY selected job; other filter dimensions combine with AND.
 const selected=lmFilterSpecs.map(([id,fn])=>({values:[...document.getElementById('lm-filter-'+id)?.selectedOptions||[]].map(o=>o.value),fn}));
 const from=document.getElementById('lm-filter-hire-from')?.value||'',to=document.getElementById('lm-filter-hire-to')?.value||'';
 lmLastFilteredEmployees=allEmployees.filter(emp=>{
  if(lm23IsArchived(emp)!==lm23ShowArchive)return false;
  if(query){if(/^\d+$/.test(query)){if(String(getEmployeeCode(emp)).trim()!==query)return false;}else{const text=[getEmployeeName(emp),getField(emp,'اسم الموظف ','اسم الموظف'),getField(emp,'emp_name _en','employee_name_en')].join(' ').toLocaleLowerCase();if(!text.includes(query))return false;}}
  if(selected.some(s=>s.values.length && !s.values.includes(lmFilterValue(emp,s.fn))))return false;
  if(from||to){const hire=lmHireISO(emp);if(!hire||(from&&hire<from)||(to&&hire>to))return false;}
  return true;
 });
 renderTable(lmLastFilteredEmployees);
 const count=document.getElementById('lm-filter-count');if(count)count.textContent=currentLang==='ar'?`${lmLastFilteredEmployees.length} موظف`:`${lmLastFilteredEmployees.length} employees`;
}
function lmClearEmployeeFilters(){const q=document.getElementById('search-input');if(q)q.value='';lmAppliedSearchQuery='';document.querySelectorAll('#lm-employee-filters select,#lm-employee-filters input').forEach(el=>{if(el.multiple)[...el.options].forEach(o=>o.selected=false);else el.value='';});lmPopulateEmployeeFilters();filterEmployees()}
// Full employee export: union of actual database columns, not just visible table columns.
// Never export credentials, auth tokens, internal metadata, or unbounded image payloads.
function lmExportSafeField(key){
 const k=String(key).trim().toLowerCase().replace(/[\s_-]+/g,'');
 return !String(key).startsWith('_') && !/(password|passwd|pwd|passhash|passwordhash|authtoken|refreshtoken|accesstoken|idtoken|secret|apikey|privatekey|credential|sessiontoken|كلمةالمرور|كلمهالمرور|الرقمالسري)/i.test(k)
  && !/(selfiedata|photo(base64|data)|imagedata|faceembedding|biometrictemplate)/i.test(k);
}
function lmExportCell(value){
 if(value===null||value===undefined)return '';
 const str=typeof value==='object'?JSON.stringify(value):String(value);
 // Prevent Excel interpreting untrusted cell text as a formula.
 return /^[\s\u0000-\u001f]*[=+@-]/.test(str)?"'"+str:str;
}
function lmExportFilteredEmployees(){
 // Re-evaluate active filters immediately before export to avoid stale/all-company snapshots.
 filterEmployees();
 const employees=lmLastFilteredEmployees;
 if(!employees.length){showToast(currentLang==='ar'?'لا توجد نتائج للتصدير':'No matching employees to export',true);return;}
 const keys=[...new Set(employees.flatMap(e=>Object.keys(e||{}).filter(lmExportSafeField)))];
 keys.sort((a,b)=>a.localeCompare(b,currentLang==='ar'?'ar':'en',{numeric:true}));
 const codeKey='Employee Code';
 const rows=[[codeKey,...keys],...employees.map(e=>[getEmployeeCode(e),...keys.map(k=>lmExportCell(e[k]))])];
 const csv='\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='LactoMisr_Employees_FullData_'+new Date().toISOString().slice(0,10)+'.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
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
        row.innerHTML=`<td class="p-3.5 font-mono text-sky-400">${escapeHtml(code)}</td><td class="p-3.5 font-semibold text-white">${escapeHtml(String(name).trim())}</td><td class="p-3.5">${escapeHtml(String(dept).trim())}</td><td class="p-3.5">${escapeHtml(String(job).trim())}</td><td class="p-3.5 font-mono text-xs">${escapeHtml(String(hire))}</td><td class="p-3.5 text-center"><button data-employee-open="${escapeHtml(code)}" type="button" class="px-3.5 py-1.5 bg-sky-600/30 hover:bg-sky-600 text-sky-200 rounded-lg text-xs border border-sky-400/30 transition shadow-lg">${tr('action_btn')}</button></td>`;
        tableBody.appendChild(row);
    });
}

// A profile opens only from a real, bounded View button click (never from a row or whitespace).
document.addEventListener('click',function lmEmployeeOpenClick(event){
 const button=event.target.closest?.('#employees-table-body button[data-employee-open]');
 if(!button || !event.isTrusted || button.disabled)return;
 if(event.detail!==0){const r=button.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)return;}
 event.preventDefault();event.stopPropagation();viewEmployee(button.dataset.employeeOpen);
},true);

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
    setFieldVal('prof-dob',excelDateToJSDate(fahdEmployeeBirth(emp)));
    setFieldVal('prof-age',fahdAge(fahdEmployeeBirth(emp))||'—');
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
    lmPutProfileLanguageField(updatedData,emp,'prof-name');
    lmPutProfileLanguageField(updatedData,emp,'prof-dept');
    lmPutProfileLanguageField(updatedData,emp,'prof-job');
    lmPutProfileLanguageField(updatedData,emp,'prof-manager');
    putMapped(updatedData, emp, ['تاريخ التعيين ','تاريخ التعيين','hireDate','date_of_hiring '], document.getElementById('prof-hire').value, 'hireDate');
    putMapped(updatedData, emp, ['سنوات الخدمة ','سنوات الخدمة','yearsService','years service'], document.getElementById('prof-service').value, 'yearsService');
    lmPutProfileLanguageField(updatedData,emp,'prof-qual');
    lmPutProfileLanguageField(updatedData,emp,'prof-qual-auth');
    putMapped(updatedData, emp, ['تاريخ الميلاد','dob'], document.getElementById('prof-dob').value, 'dob');
    putMapped(updatedData, emp, ['السن حتى تاريخه ','السن حتى تاريخه','age','age to date'], fahdAge(document.getElementById('prof-dob').value)||document.getElementById('prof-age').value, 'age');
    lmPutProfileLanguageField(updatedData,emp,'prof-insurance');
    lmPutProfileLanguageField(updatedData,emp,'prof-pob');
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
function lm27ActiveEmployees(){return (allEmployees||[]).filter(e=>!lm23IsArchived(e));}
function updateDashboardStats(){const el=document.getElementById('total-employees-count');if(el)el.innerText=lm27ActiveEmployees().length;}

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
let lmAutoCodeReady=false;
function lmNextEmployeeCode(records){
 const codes=records.map(e=>String(getEmployeeCode(e)||'').trim()).filter(v=>/^\d{1,12}$/.test(v)).map(Number);
 const max=Math.max(0,...codes);if(max>=999999999999)throw Error('Employee code range exhausted');
 return String(max+1);
}
async function openAddEmployeeModal(){
 const modal=document.getElementById('add-employee-modal');modal?.classList.remove('hidden');
 lmAutoCodeReady=false;buildAddEmployeeForm();fahdCreateTab('personal',document.querySelector('.fahd-create-tabs button'));
 const input=modal?.querySelector('[data-add-key="code"]');const err=document.getElementById('add-employee-error');
 const save=modal?.querySelector('[data-save-new]');if(save)save.disabled=true;
 if(input){input.value='…';input.readOnly=true;input.setAttribute('aria-readonly','true');input.title=fahdLang('يُولّد تلقائيًا ولا يمكن تعديله','Generated automatically; cannot be edited');}
 try{
  const snapshot=await db.ref(PORTAL_EMPLOYEE_COLLECTION).once('value');
  if(modal?.classList.contains('hidden'))return;
  const existing=snapshot.val()||{};
  const codes=Object.keys(existing).filter(k=>/^\d{1,12}$/.test(k)).map(Number);
  for(const e of allEmployees){const c=String(getEmployeeCode(e)||'').trim();if(/^\d{1,12}$/.test(c))codes.push(Number(c));}
  const max=Math.max(0,...codes);if(max>=999999999999)throw Error('Employee code range exhausted');
  if(input)input.value=String(max+1);
  lmAutoCodeReady=true;if(save)save.disabled=false;
 }catch(error){if(err)err.textContent=fahdLang('تعذر توليد كود الموظف. تحقق من الاتصال وأعد فتح النموذج.','Unable to generate code. Check connection and reopen the form.');console.error('Employee code allocation',error);}
}
function closeAddEmployeeModal(){document.getElementById('add-employee-modal')?.classList.add('hidden');}
function fahdCreateTab(tab,button){document.querySelectorAll('.fahd-create-pane').forEach(el=>el.hidden=el.id!=='fahd-create-'+tab);document.querySelectorAll('.fahd-create-tabs button').forEach(el=>el.classList.toggle('selected',el===button));}
/* Phase 20: calendar-exact age, with supported Firebase/Excel date formats.
   Never use a stale stored age as a substitute for a missing/invalid DOB. */
function fahdParseBirthDate(raw){
 if(raw===null||raw===undefined||raw==='')return null;
 let y,m,day;
 if(typeof raw==='number'&&Number.isFinite(raw)&&raw>1000&&raw<100000){
  const d=new Date(Date.UTC(1899,11,30)+Math.floor(raw)*86400000);
  y=d.getUTCFullYear();m=d.getUTCMonth()+1;day=d.getUTCDate();
 }else{
  const t=String(raw).trim();let match;
  if((match=t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:T.*)?$/))){[,y,m,day]=match;}
  else if((match=t.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/))){[,day,m,y]=match;}
  else return null;
 }
 y=Number(y);m=Number(m);day=Number(day);
 const d=new Date(y,m-1,day);
 if(d.getFullYear()!==y||d.getMonth()!==m-1||d.getDate()!==day||d>new Date())return null;
 return d;
}
function fahdAgeAt(raw,asOf){
 const dob=fahdParseBirthDate(raw);if(!dob)return '';
 const now=asOf instanceof Date?asOf:new Date();
 let age=now.getFullYear()-dob.getFullYear();
 if(now.getMonth()<dob.getMonth()||(now.getMonth()===dob.getMonth()&&now.getDate()<dob.getDate()))age--;
 return age>=0?String(age):'';
}
function fahdAge(raw){return fahdAgeAt(raw,new Date());}
function fahdEmployeeBirth(emp){
 const entries=Object.entries(emp||{});
 for(const key of ['تاريخ الميلاد','dob','date of birth','birthDate','Date of Birth']){
  const found=entries.find(([k,v])=>k.trim().toLocaleLowerCase()===key.toLocaleLowerCase()&&v!==null&&v!==undefined&&String(v).trim()!=='');
  if(found&&fahdParseBirthDate(found[1]))return found[1];
 }
 return null;
}
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
 if(extra.readonlyCode){input.readOnly=true;input.setAttribute('aria-readonly','true');}
 if(extra.readonly){input.readOnly=true;input.dataset.computedAge='true';delete input.dataset.addKey;}
 if(extra.required)input.required=true;
 if(extra.onchange)input.addEventListener('change',extra.onchange);
 wrap.append(input);return wrap;
}
function fahdAddSection(title,subtitle){const section=document.createElement('section');section.className='fahd-add-section';const heading=document.createElement('h3');heading.textContent=title;section.append(heading);if(subtitle){const small=document.createElement('p');small.textContent=subtitle;section.append(small);}const grid=document.createElement('div');grid.className='fahd-add-grid';section.append(grid);document.getElementById('add-employee-fields').append(section);return grid;}
function buildAddEmployeeForm(){
 const container=document.getElementById('add-employee-fields');if(!container)return;container.replaceChildren();
 const base=fahdAddSection(fahdLang('البيانات الأساسية','Core identity'),fahdLang('كود الموظف والبيانات باللغتين','Employee code and both languages'));
 base.append(fahdInput(fahdLang('الكود (تلقائي)','Employee code (automatic)'),'code','', 'text',{required:true,readonlyCode:true}));
 for(const [id,ar,en,arKey,enKey] of FAHD_PAIRS){base.append(fahdInput(ar+' (AR)',arKey));base.append(fahdInput(en+' (EN)',enKey));}
 const details=fahdAddSection(fahdLang('البيانات الوظيفية والشخصية','Job & personal details'),fahdLang('التواريخ والعمر المحسوب','Dates and calculated age'));
 for(const [id,ar,en,arKey,enKey,type] of FAHD_COMMON){
  if(arKey===enKey)details.append(fahdInput(fahdLang(ar,en),arKey,'',type,type==='date'?{onchange:fahdUpdateNewAge}:{}));
  else if(type==='date'){
   const dateInput=fahdInput(fahdLang(ar,en),arKey,'','date',{onchange:fahdUpdateNewAge});dateInput.querySelector('input').dataset.mirrorKey=enKey;details.append(dateInput);
  }else{details.append(fahdInput(ar+' (AR)',arKey));details.append(fahdInput(en+' (EN)',enKey));}
 }
 details.append(fahdInput(fahdLang('العمر — تلقائي','Age — calculated'),'','', 'text',{readonly:true}));
 details.insertAdjacentHTML('beforeend',lmFiveUI(false));
 const extra=fahdAddSection(fahdLang('بيانات إضافية','Additional fields'),fahdLang('بيانات اختيارية','Optional information'));
 extra.insertAdjacentHTML('beforeend','<div class="fahd-entry"><label>'+fahdLang('صورة الموظف','Employee photo')+'</label><img id="fahd-create-photo-preview" class="fahd-photo" alt=""><button type="button" class="fahd-photo-button" onclick="fahdPickPhoto(true)">'+fahdLang('اختيار صورة من الملفات','Choose photo file')+'</button></div><div id="fahd-new-custom"></div>');
 const err=document.getElementById('add-employee-error');if(err)err.textContent='';fahdUpdateNewAge();fahdEnableDropdowns();fahdTranslateUI();
}
function fahdUpdateNewAge(){const birth=document.querySelector('#add-employee-fields [data-add-key="تاريخ الميلاد"]');const age=fahdAge(birth?.value);document.querySelectorAll('#add-employee-fields [data-computed-age]').forEach(el=>el.value=age?age+' '+fahdLang('سنة','years'):'—');}
async function saveNewEmployee(){
 if(!lmAutoCodeReady){const el=document.getElementById('add-employee-error');if(el)el.textContent=fahdLang('انتظر توليد الكود تلقائيًا','Wait for automatic code generation');return;}
 const data={};document.querySelectorAll('#add-employee-fields [data-add-key]').forEach(input=>{
  const key=input.dataset.addKey;let value=input.value.trim();if(input.type==='date')value=fahdStoredDate(value);
  if(value){data[key]=value;if(input.dataset.mirrorKey)data[input.dataset.mirrorKey]=value;}
 });
 const code=String(data.code||'').trim(),err=document.getElementById('add-employee-error');
 if(!/^\d{1,12}$/.test(code)){err.textContent=fahdLang('أدخل كود موظف رقمي صحيح','Enter a valid numeric employee code');return;}
 if(allEmployees.some(e=>String(getEmployeeCode(e))===code)){err.textContent=tr('employee_exists');return;}
 if(!data['اسم الموظف ']||!data['emp_name _en']){err.textContent=fahdLang('أدخل الاسم بالعربي والإنجليزي','Enter both Arabic and English names');return;}
 const age=fahdAge(data['تاريخ الميلاد']);if(age){data['السن حتى تاريخه ']=age;data['age to date']=age;}
 data.hr_five_percent=lmReadFiveUI('#add-employee-fields');
 data['الكود']=code;if(window.fahdNewPhoto)data.photoUrl=window.fahdNewPhoto;
 for(const key of Object.keys(lmCustomFieldDefinitions)){if(/^cf_[a-z0-9_]{1,50}$/.test(key)){data.hr_custom_fields??={};data.hr_custom_fields[key]={valueAr:'',valueEn:''};}}

 const saveButton=document.querySelector('#add-employee-modal [data-save-new]');if(saveButton)saveButton.disabled=true;
 try{const ref=db.ref(PORTAL_EMPLOYEE_COLLECTION+'/'+code);const result=await ref.transaction(current=>current===null?data:undefined,undefined,false);if(!result.committed){err.textContent=fahdLang('الكود اتستخدم بالفعل بواسطة موظف آخر. أغلق النموذج وافتحه لتوليد كود جديد.','Code already assigned. Reopen the form to generate a new code.');return;}
  allEmployees.push({...data,_firebasePath:PORTAL_EMPLOYEE_COLLECTION+'/'+code,_firebaseKey:code});closeAddEmployeeModal();window.fahdNewPhoto=null;filterEmployees();updateDashboardStats();showToast(tr('employee_saved'));viewEmployee(code);
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

    if(!['dashboard','employees','payroll','notifications','attendance','leave-balances','appraisal','permissions','bradford','service-center','recruitment','missions','clinic','complaints','chat'].includes(page))return;
    hrActivePage=page;
    ['dashboard','payroll','notifications','attendance','leave-balances','appraisal','permissions','bradford','service-center','recruitment','missions','clinic','complaints','chat'].forEach(p=>document.getElementById('hr-'+p+'-view')?.classList.toggle('hidden',p!==page));
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
    if(hrActivePage==='service-center') lm29ServiceCenter();
    if(['clinic','complaints','chat'].includes(hrActivePage)) lmPhase2Standalone(hrActivePage);
    if(hrActivePage==='missions') lmMissionPage();
    if(hrActivePage==='recruitment') lm29Recruitment();
    if(hrActivePage==='appraisal') lm8Appraisal();
    else if(['attendance','leave-balances','permissions','bradford'].includes(hrActivePage)) renderHRFeature(hrActivePage);
    if(hrActivePage==='payroll'){ lmAnnualRaisePreview(); }
    if(hrActivePage==='notifications'){
        const d=document.getElementById('hr-notifications-view');if(!d)return;
        d.innerHTML=`<h1 class="text-2xl font-extrabold mb-5">${hrText('الإشعارات والطلبات','Notifications & Requests')}</h1><div class="glass-card rounded-2xl p-6 mb-5"><h2 class="font-bold text-sky-300 mb-3">${hrText('تنبيهات طلبات ESS','ESS request alerts')}</h2><div id="ess-request-panel" class="text-slate-300 text-sm">${hrText('جاري فحص اتصال ESS...','Checking ESS connection...')}</div></div><div class="glass-card rounded-2xl p-6"><h2 class="font-bold text-sky-300 mb-3">${hrText('إنشاء إشعار إداري','Compose HR notification')}</h2><label class="block text-sm mb-1">${hrText('العنوان','Title')}</label><input id="hr-notify-title" maxlength="120" class="w-full p-3 rounded-xl bg-slate-900 border border-sky-500/30 mb-3" placeholder="${hrText('عنوان الإشعار','Notification title')}"><label class="block text-sm mb-1">${hrText('الرسالة','Message')}</label><textarea id="hr-notify-body" maxlength="1000" class="w-full p-3 rounded-xl bg-slate-900 border border-sky-500/30 mb-3" placeholder="${hrText('نص الرسالة','Message body')}"></textarea><label class="block text-sm mb-1">${hrText('إرسال إلى','Audience')}</label><select id="hr-notify-target" onchange="hrNotificationAudienceChanged()" class="w-full p-3 rounded-xl bg-slate-900 border border-sky-500/30 mb-3"><option value="all">${hrText('الشركة بالكامل','Entire company')}</option><option value="department">${hrText('إدارة كاملة','Department')}</option><option value="employees">${hrText('موظفون محددون','Selected employees')}</option></select><div id="hr-notify-target-fields" class="mb-3"></div><label class="flex items-center gap-3 mb-4 text-sm"><input id="hr-notify-ack" type="checkbox" class="w-5 h-5 accent-sky-500">${hrText('هذا الإشعار يتطلب إقرار الموظف بالاطلاع','Employee acknowledgement required')}</label><button type="button" onclick="hrPreviewNotification()" class="portal-action-btn px-5 py-3 rounded-xl">${hrText('معاينة المستلمين','Preview recipients')}</button> <button type="button" id="hr-notify-send" onclick="hrSendNotification()" class="portal-action-btn px-5 py-3 rounded-xl ml-2" style="background:#0878ad">${hrText('إرسال الإشعار','Send notification')}</button><div id="hr-notify-preview" class="mt-4 text-sm text-slate-300" aria-live="polite"></div><p class="text-xs text-amber-300 mt-3">${hrText('الإشعارات الداخلية تعمل من قاعدة Portal المشتركة؛ لا يلزم حساب ESS إداري منفصل.','Internal notifications use the shared Portal database; no separate ESS admin account is needed.')}</p></div>`;
        hrNotificationAudienceChanged();
        setTimeout(()=>{essRenderRequestPanel();essPilotSweep().catch(e=>console.warn('Pilot sweep',e));},0);
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
 if(page==='permissions'){d.innerHTML=hrPermissionPage();hrPermissionInitDate();hrPermissionWatch();}

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
 let result=[],errors=[];rows.forEach((r,i)=>{let rec={};for(let k in mapped)rec[k]=r[mapped[k]];rec.code=String(rec.code??'').trim();if(type==='attendance' && mapped.code && /بصم/.test(mapped.code)){rec.biometricId=rec.code;}let err='';if(!rec.code)err='Missing employee code';if(type==='attendance'&&!err&&Array.isArray(allEmployees)&&allEmployees.length&&!allEmployees.some(e=>getEmployeeCode(e)===rec.code))err='Employee code '+rec.code+' not found in Portal employee records';if(type==='attendance'){rec.timestamp=String(rec.timestamp??`${hrDate(rec.date)} ${rec.time??''}`).trim();if(!rec.timestamp||rec.timestamp==='undefined')err='Missing date/time';rec.source=String(rec.source||'Excel import');rec.type=String(rec.type||'Unspecified')}else{for(let k of ['entitled','used','remaining'])rec[k]=hrNum(rec[k]);if(['entitled','used','remaining'].some(k=>!Number.isFinite(rec[k])||rec[k]<0))err='Invalid balance';if(!err&&Math.abs(rec.entitled-rec.used-rec.remaining)>0.02)err='Balance mismatch';rec.year=String(rec.year||new Date().getFullYear())}if(err)errors.push(`Row ${i+2}: ${err}`);else result.push(rec)});return {result,errors,mapped};}
async function hrReadImport(type,input){let box=document.getElementById('hr-import-preview-'+type);if(!input.files?.[0])return;let file=input.files[0];if(file.size>5*1024*1024){box.textContent='File exceeds 5 MB';return}if(!window.XLSX){box.textContent='Excel parser unavailable. Check internet connection.';return}try{const wb=XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:false});const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''});if(!rows.length)throw Error('Sheet is empty');if(rows.length>3000)throw Error('Maximum 3000 rows per batch');const parsed=hrImportRows(type,rows);hrImportState[type]={records:parsed.result,errors:parsed.errors,filename:file.name};let sample=parsed.result.slice(0,8);box.innerHTML=`<p class="mb-2">${hrText('سجلات صحيحة','Valid rows')}: <b>${parsed.result.length}</b> · ${hrText('أخطاء','Errors')}: <b>${parsed.errors.length}</b></p>${parsed.errors.length?`<div class="text-rose-300 mb-3">${parsed.errors.slice(0,12).map(hrEscape).join('<br>')}</div>`:''}<div style="overflow-x:auto"><table class="hr-feature-table"><thead><tr>${Object.keys(sample[0]||{}).map(k=>`<th>${hrEscape(k)}</th>`).join('')}</tr></thead><tbody>${sample.map(r=>`<tr>${Object.values(r).map(v=>`<td>${hrEscape(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${parsed.result.length&&!parsed.errors.length?`<button class="portal-ghost-btn px-5 py-3 rounded-xl mt-4" onclick="hrCommitImport('${type}')">${hrText('حفظ الدفعة في البورتال بعد التأكيد','Save batch to Portal after confirmation')}</button>`:'<p class="text-amber-200 mt-3">Fix errors before saving.</p>'}`;}catch(e){hrImportState[type]=null;box.textContent='Import error: '+e.message}}
async function hrCommitImport(type){const state=hrImportState[type];if(!state?.records.length||state.errors.length)return;const ok=await lmDialog(hrText('تأكيد حفظ البيانات المستوردة في قاعدة البورتال؟ لن يتم تحديث ESS تلقائيًا.','Save imported data in the Portal? ESS will not be updated automatically.'),true);if(!ok)return;const batch=db.ref('hr_imports/'+type).push();try{await batch.set({filename:state.filename,createdAt:firebase.database.ServerValue.TIMESTAMP,recordCount:state.records.length,records:state.records});await lmDialog(hrText('تم حفظ الدفعة بنجاح','Batch saved successfully'));hrLoadImport(type)}catch(e){await lmDialog('Portal save failed: '+e.message)}}
async function hrLoadImport(type){const box=document.getElementById('hr-import-saved-'+type);if(!box)return;try{let snap=await db.ref('hr_imports/'+type).limitToLast(1).once('value'),items=snap.val();if(!items){box.textContent=hrText('لا توجد دفعات محفوظة بعد','No saved batches yet');return}let batch=Object.values(items)[0];box.innerHTML=`<b>${hrText('آخر دفعة محفوظة','Latest saved batch')}</b><p>${hrEscape(batch.filename)} — ${Number(batch.recordCount)||0} ${hrText('سجل','records')}</p><p class="text-xs text-slate-400">${new Date(batch.createdAt||Date.now()).toLocaleString()}</p>`}catch(e){box.textContent=hrText('تعذر قراءة البيانات: راجع صلاحيات البورتال','Cannot read saved data: check Portal permissions')}}

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
 }catch(e){target.textContent=hrText('تعذر قراءة الدفعة: راجع صلاحيات البورتال','Cannot read batch: check Portal permissions')}
}
const _hrFeatureOriginal=renderHRFeature;
renderHRFeature=function(page){_hrFeatureOriginal(page);if(['attendance','leave-balances'].includes(page)){const container=document.getElementById('hr-'+page+'-view');if(container){container.insertAdjacentHTML('beforeend',hrExtraTools(page)+`<div class="hr-panel mt-5"><h2 class="font-bold text-sky-300 mb-3">${hrText('البيانات المستوردة فعليًا','Actual imported records')}</h2><button class="portal-ghost-btn px-4 py-2 rounded-xl mb-3" onclick="hrShowImportedData('${page}')">${hrText('عرض آخر دفعة','View latest batch')}</button><div id="hr-import-records-${page}"></div></div>`)}hrLoadImport(page)}};


// Unified Portal/ESS: one Firebase Auth session, one RTDB. Code 778 is the Portal admin.
const ESS_ADMIN_UID = PORTAL_ADMIN_UID;
const ESS_ADMIN_EMAIL = PORTAL_ADMIN_EMAIL;
const essAuth = portalAuth;
const essDb = db;
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
 // No automatic approvals: HR reviews each punch manually.
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
   if(expired&&r.verificationStatus==='PENDING_REVIEW'&&r.cameraCaptured===true&&r.faceMatchVerified===false&&r.location&&Number.isFinite(Number(r.location.lat))&&Number.isFinite(Number(r.location.lng))&&['IN','OUT'].includes(r.punchType)){
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
function essStartPilotTimer(){if(essPilotInterval)clearInterval(essPilotInterval);essPilotInterval=setInterval(()=>{if(essPilotReady())essPilotSweep().catch(e=>console.warn('Pilot sweep',e));},60000);}
// Pilot auto-review runs only while an authenticated administrator has the Portal open.
// A closed browser cannot run scheduled jobs on Firebase Spark.
portalAuth.onAuthStateChanged(user=>{if(user?.uid===ESS_ADMIN_UID){essStartPilotTimer();essPilotSweep().catch(e=>console.warn('Pilot sweep',e));}else if(essPilotInterval){clearInterval(essPilotInterval);essPilotInterval=null;}});

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
  if(typeof lmCommitEmployeeSearch==='function')lmCommitEmployeeSearch();
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
document.addEventListener('click',e=>{const btn=e.target.closest?.('.ess-selfie-open');if(!btn)return;const id=btn.dataset.selfieId;const r=lmGpsEvidence[id]||essRequestState.attendance_requests?.['2']?.[id];if(!r||typeof r.selfieData!=='string'||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(r.selfieData))return;const overlay=document.createElement('div');overlay.className='ess-selfie-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');const img=document.createElement('img');img.src=r.selfieData;img.alt=hrText('صورة التحقق مكبرة','Enlarged verification selfie');img.style.cssText='max-width:min(92vw,850px);max-height:85vh;object-fit:contain;border-radius:15px';const close=document.createElement('button');close.type='button';close.textContent='✕';close.style.cssText='position:absolute;top:20px;right:20px;width:48px;height:48px;background:#172b46;color:white;border:1px solid #5a83a5;border-radius:12px';const dismiss=()=>{overlay.remove();document.removeEventListener('keydown',esc,true)};const esc=k=>{if(k.key==='Escape')dismiss()};document.addEventListener('keydown',esc,true);close.onclick=dismiss;overlay.onclick=k=>{if(k.target===overlay)dismiss()};overlay.append(img,close);document.body.append(overlay);close.focus()});
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
// Financial presentation only: original database amounts remain unchanged.
function lmSalaryDisplay(value){
 const raw=String(value??'').trim();
 if(!raw)return raw;
 const normalized=raw.replace(/[\s,،]/g,'').replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c)));
 if(!/^[+-]?\d+(?:\.\d+)?$/.test(normalized))return raw;
 const n=Number(normalized);
 return Number.isFinite(n)?new Intl.NumberFormat('en-US',{maximumFractionDigits:0,minimumFractionDigits:0}).format(n):raw;
}
function lmIsSalaryKey(key){
 const k=String(key).trim().toLowerCase().replace(/[_-]+/g,' ');
 return /(?:الأجر|الاجر|المرتب|الراتب|الراتب|salary|wage|payroll|basic pay|gross pay|net pay|allowance|deduction|comprehensivesalary|insurancecontributionwage)/i.test(k);
}
function fahdProfileLanguage(key){return /[\u0600-\u06FF]/.test(key)?'ar':'en';}
function fahdActualKey(emp,key){return Object.prototype.hasOwnProperty.call(emp,key)?key:Object.keys(emp).find(k=>k.trim()===key.trim())||key;}
function fahdIsMojibake(value){
 if(typeof value!=='string')return false;
 return /(?:ط§|ط¨|ط±|طھ|ط®|ظ„|ظ‚|ظ…|Ø|Ù|Ã|â€)/.test(value);
}
function fahdHasUnsavedChanges(){
 if(!fahdIsEditing||!fahdEditing)return false;
 return Array.from(document.querySelectorAll('#fahd-fields [data-fahd-key]:not([data-calculated-age])')).some(input=>input.value!==(fahdEditing.original[input.dataset.fahdKey]??'')) || Array.from(document.querySelectorAll('#fahd-fields [data-lm-custom-key]')).some(input=>input.value!==(input.dataset.initialValue||'')) || JSON.stringify(lmReadFiveUI('#fahd-fields'))!==JSON.stringify((allEmployees.find(e=>String(getEmployeeCode(e))===String(fahdEditing.code))||{}).hr_five_percent||{enabled:false,workStatus:null});
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
  if(['code','الكود','photoUrl','photo','password','authUid','hr_custom_fields','_firebasePath'].includes(schemaKey)||schemaKey.startsWith('_')||Object.hasOwn(lmCustomFieldDefinitions,schemaKey))continue;
  const key=fahdActualKey(emp,schemaKey);
  if(shown.has(key)||typeof emp[key]==='object'&&emp[key]!==null)continue;
  shown.add(key);
  const lang=fahdProfileLanguage(key);
  const card=document.createElement('div');card.className='fahd-field';card.dataset.fieldLanguage=lang;
  const label=document.createElement('label');label.textContent=fahdProfileKeyLabel(key)+' ('+lang.toUpperCase()+')';
  const input=document.createElement('input');input.type='text';input.dataset.fahdKey=key;
  input.value=fahdIsMojibake(emp[key])?'':(lmIsSalaryKey(key)?lmSalaryDisplay(emp[key]):String(emp[key]??''));input.disabled=true;input.maxLength=2000;
  // Phase 21: The complete-profile cards previously displayed a stale imported
  // age from Firebase. Age is a calculated display, never a stored snapshot.
  const normalizedKey=key.trim().toLocaleLowerCase();
  if(['السن حتى تاريخه','age to date','age'].includes(normalizedKey)){
   const liveAge=fahdAge(fahdEmployeeBirth(emp));
   input.value=liveAge||'—';
   input.dataset.calculatedAge='true';
   input.readOnly=true;
  }

  if(/(?:^n_id$|الرقم القومى|الرقم التأمينى|insurance number)/.test(key))input.autocomplete='off';
  if(lmIsSalaryKey(key))input.dataset.salaryOriginal=String(emp[key]??'');
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
 fields.insertAdjacentHTML('beforeend',lmFiveUI(true,emp.hr_five_percent));
 lmRenderGlobalCustomFields(emp,fields);
 fahdRefreshFieldVisibility();fahdEnableDropdowns();
 const fin=document.getElementById('fahd-financial');fin.replaceChildren();const financial=emp.financial;
 if(financial&&typeof financial==='object'){for(const [k,v] of Object.entries(financial)){if(v===null||typeof v==='object')continue;const tile=document.createElement('div');tile.className='fahd-tile';const l=document.createElement('span'),strong=document.createElement('strong');l.textContent=k;strong.textContent=lmIsSalaryKey(k)?lmSalaryDisplay(v):String(v);tile.append(l,strong);fin.append(tile);}fin.className='fahd-summary';}
 else {fin.className='fahd-empty';fin.textContent=fahdLang('لا توجد بيانات مالية متصلة بعد.','No connected financial data yet.');}
 fahdSetEditing(false);document.getElementById('fahd-status').textContent='';
 lm22RenderLifecycle(emp);
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
 const updates=lmCustomValueInputs();const five=lmReadFiveUI('#fahd-fields');if(JSON.stringify(five)!==JSON.stringify(emp.hr_five_percent||{enabled:false,workStatus:null}))updates.hr_five_percent=five;document.querySelectorAll('#fahd-fields [data-fahd-key]:not([data-calculated-age])').forEach(input=>{
  const key=input.dataset.fahdKey;if(input.value===fahdEditing.original[key])return;
  const value=input.type==='date'?fahdStoredDate(input.value):input.value.trim();updates[key]=value;
  // Each translated field is independent; never overwrite its counterpart.
 });
 const dob=updates['تاريخ الميلاد'];if(dob){const age=fahdAge(dob);if(age){updates['السن حتى تاريخه ']=age;updates['age to date']=age;}}
 if(!Object.keys(updates).length){status.textContent=fahdLang('لا توجد تغييرات للحفظ','No changes to save');return true;}
 if(!skipConfirm && !await fahdDialog(fahdLang('حفظ التعديلات','Save changes'),fahdLang('هل تريد حفظ التغييرات؟','Save these changes?')))return false;
 fahdBusy=true;document.getElementById('fahd-save').disabled=true;
 try{await db.ref(fahdEditing.path).update(updates);for(const [key,value] of Object.entries(updates)){if(key.startsWith('hr_custom_fields/')){const [,field,prop]=key.split('/');emp.hr_custom_fields??={};emp.hr_custom_fields[field]??={};emp.hr_custom_fields[field][prop]=value;}else emp[key]=value;}renderTable(allEmployees);fahdRender(emp);status.textContent=fahdLang('✓ تم الحفظ','✓ Changes saved');if(!skipConfirm)await fahdDialog(fahdLang('تم الحفظ','Saved'),fahdLang('تم حفظ التعديلات بنجاح','Changes saved successfully'),'notice');return true;}
 catch(err){status.textContent=fahdLang('فشل الحفظ: ','Save failed: ')+(err?.message||'Permission denied');return false;}
 finally{fahdBusy=false;document.getElementById('fahd-save').disabled=false;}
}
function fahdSetEditing(on){fahdIsEditing=on;document.querySelectorAll('#fahd-fields [data-salary-original]').forEach(el=>{el.value=on?el.dataset.salaryOriginal:lmSalaryDisplay(el.dataset.salaryOriginal);fahdEditing.original[el.dataset.fahdKey]=el.value;});document.querySelectorAll('#fahd-fields [data-fahd-key],#fahd-fields [data-lm-custom-key],#fahd-fields [data-five-input]').forEach(el=>el.disabled=el.dataset.calculatedAge==='true'||!on);fahdRefreshFieldVisibility();for(const [id,visible] of [['fahd-edit',!on],['fahd-save',on],['fahd-cancel',on]]){const el=document.getElementById(id);if(el)el.hidden=!visible;}}
function fahdStartEdit(){fahdSetEditing(true)}
async function fahdCancelEdit(){
 if(fahdHasUnsavedChanges()){
  const choice=await fahdUnsavedDialog();
  if(choice==='stay')return;
  if(choice==='save'){await fahdSave(true);return;}
 }
 document.querySelectorAll('#fahd-fields [data-fahd-key]').forEach(el=>el.value=fahdEditing?.original[el.dataset.fahdKey]??'');document.querySelectorAll('#fahd-fields [data-lm-custom-key]').forEach(el=>el.value=el.dataset.initialValue||'');fahdSetEditing(false);
}
function fahdDialog(title,message,mode='confirm',fields=[]){return new Promise(resolve=>{const dialog=document.getElementById('fahd-dialog'),box=document.getElementById('fahd-dialog-inputs'),yes=document.getElementById('fahd-dialog-yes'),no=document.getElementById('fahd-dialog-no');document.getElementById('fahd-dialog-title').textContent=title;document.getElementById('fahd-dialog-message').textContent=message;box.replaceChildren();const inputs=fields.map(f=>{const el=document.createElement('input');el.placeholder=f;el.maxLength=1000;box.append(el);return el});no.hidden=mode==='notice';yes.textContent=mode==='notice'?fahdLang('حسنًا','OK'):fahdLang('تأكيد','Confirm');no.textContent=fahdLang('إلغاء','Cancel');dialog.hidden=false;const finish=ok=>{dialog.hidden=true;yes.onclick=null;no.onclick=null;document.removeEventListener('keydown',esc);resolve(ok?(inputs.length?inputs.map(x=>x.value):true):null)};const esc=e=>{if(e.key==='Escape')finish(false)};yes.onclick=()=>finish(true);no.onclick=()=>finish(false);document.addEventListener('keydown',esc);(inputs[0]||yes).focus()})}
function lmCustomSlug(label){
 const normalized=String(label||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
 return normalized ? 'cf_'+normalized.slice(0,42) : 'cf_'+Date.now().toString(36);
}
function lmCustomValueInputs(){
 const rows=document.querySelectorAll('#fahd-fields [data-lm-custom-key]');
 const updates={};
 rows.forEach(el=>{if(el.value===el.dataset.initialValue)return;const key=el.dataset.lmCustomKey,lang=el.dataset.lmCustomLang;updates['hr_custom_fields/'+key+'/'+(lang==='ar'?'valueAr':'valueEn')]=el.value.trim();});
 return updates;
}
function lmRenderGlobalCustomFields(emp,fields){
 for(const [key,def] of Object.entries(lmCustomFieldDefinitions)){
  if(!/^cf_[a-z0-9_]{1,50}$/.test(key)||!def||typeof def!=='object')continue;
  const value=emp.hr_custom_fields?.[key]||{};
  for(const lang of ['ar','en']){
   const card=document.createElement('div');card.className='fahd-field';card.dataset.fieldLanguage=lang;
   const label=document.createElement('label');label.textContent=(lang==='ar'?def.labelAr:def.labelEn)||key;
   const input=document.createElement('input');input.type=def.type==='date'?'date':def.type==='number'?'number':'text';
   input.dataset.lmCustomKey=key;input.dataset.lmCustomLang=lang;
   const raw=(lang==='ar'?value.valueAr:value.valueEn)||'';input.value=raw;input.dataset.initialValue=input.value;input.disabled=true;input.maxLength=2000;
   card.append(label,input);fields.append(card);
  }
 }
}
async function fahdAddField(){
 if(fahdBusy||!fahdEditing?.path||!portalIsAdmin())return;
 if(fahdHasUnsavedChanges()){await fahdDialog(fahdLang('تعديلات غير محفوظة','Unsaved changes'),fahdLang('احفظ تعديلات الموظف أولًا قبل إنشاء حقل عام.','Save employee edits before creating a global field.'),'notice');return;}
 const a=await fahdDialog(fahdLang('حقل عام لكل الموظفين','Global field for all employees'),fahdLang('سيُنشأ الحقل في Firebase لكل الموظفين، والقيم تخص الموظف الحالي فقط.','The field will be added to every employee in Firebase; values belong only to this employee.'),'confirm',[fahdLang('اسم الحقل بالعربية','Arabic field label'), 'English field label',fahdLang('القيمة العربية للموظف الحالي (اختياري)','Arabic value for current employee (optional)'),'English value (optional)']);
 if(!a)return;
 const [labelAr,labelEn,valueAr,valueEn]=a.map(s=>String(s||'').trim());
 if(!labelAr||!labelEn||labelAr.length>100||labelEn.length>100){await fahdDialog(fahdLang('بيانات ناقصة','Missing labels'),fahdLang('أدخل اسم الحقل بالعربية والإنجليزية (100 حرف كحد أقصى).','Enter both labels (max 100 characters).'),'notice');return;}
 const duplicate=Object.values(lmCustomFieldDefinitions).some(d=>d&&[d.labelAr,d.labelEn].some(x=>x&&[labelAr,labelEn].some(y=>x.trim().toLowerCase()===y.trim().toLowerCase())));
 if(duplicate){await fahdDialog(fahdLang('حقل مكرر','Duplicate field'),fahdLang('الحقل موجود بالفعل.','This field already exists.'),'notice');return;}
 const key=lmCustomSlug(labelEn);if(!/^cf_[a-z0-9_]{1,50}$/.test(key)||lmCustomFieldDefinitions[key]){await fahdDialog(fahdLang('اسم غير صالح','Invalid field'),fahdLang('اسم الحقل الإنجليزي يجب أن يحتوي على حروف لاتينية لتوليد مفتاح آمن.','Use Latin letters for the English label.'),'notice');return;}
 const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(fahdEditing.code));if(!emp)return;
 const count=allEmployees.length;
 const confirmed=await fahdDialog(fahdLang('تأكيد إضافة عامة','Confirm global field'),fahdLang(`سيُضاف الحقل إلى ${count} سجل موظف في Firebase. هل توافق؟`,`This will update ${count} employee records in Firebase. Continue?`));if(!confirmed)return;
 const actor=portalAuth.currentUser?.uid||'';
 const now=Date.now();const value={labelAr,labelEn,type:'text',createdAt:now,createdBy:actor};
 const updates={['employee_field_definitions/'+key]:value};
 for(const record of allEmployees){
  const code=getEmployeeCode(record);if(!/^\d+$/.test(code))continue;
  // Existing custom data must never be overwritten.
  if(Object.prototype.hasOwnProperty.call(record.hr_custom_fields||{},key))continue;
  updates['employees_v2/'+code+'/hr_custom_fields/'+key]={valueAr:code===fahdEditing.code?valueAr:'',valueEn:code===fahdEditing.code?valueEn:''};
 }
 const auditKey=db.ref('hr_imports').push().key;
 updates['hr_imports/'+auditKey]={type:'GLOBAL_CUSTOM_FIELD_CREATED',fieldKey:key,labelAr,labelEn,employeeCount:count,actorUid:actor,createdAt:now};
 fahdBusy=true;const btn=document.getElementById('fahd-add');if(btn)btn.disabled=true;
 try{
  // A single root multi-location update commits schema + employee fields + audit together.
  await db.ref().update(updates);
  lmCustomFieldDefinitions[key]=value;
  for(const record of allEmployees){record.hr_custom_fields??={};if(!Object.hasOwn(record.hr_custom_fields,key))record.hr_custom_fields[key]={valueAr:getEmployeeCode(record)===fahdEditing.code?valueAr:'',valueEn:getEmployeeCode(record)===fahdEditing.code?valueEn:''};}
  fahdRender(emp);
  await fahdDialog(fahdLang('تم الحفظ','Saved'),fahdLang('تم إنشاء الحقل عند جميع الموظفين في Firebase.','Field created for all employees in Firebase.'),'notice');
 }catch(error){await fahdDialog(fahdLang('فشل الحفظ','Save failed'),String(error?.message||error),'notice');}
 finally{fahdBusy=false;if(btn)btn.disabled=false;}
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
 const emp=lm27ActiveEmployees(),total=emp.length;
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
 const genderDots=[];
 // Orthographic sphere: curved latitude bands, perspective scale and shading.
 for(let row=0;row<13;row++){
  const lat=(row-6)*Math.PI/14, ry=112-Math.sin(lat)*93;
  const width=Math.cos(lat)*96;
  const count=Math.max(3,Math.round(12*Math.cos(lat)));
  for(let col=0;col<count;col++){
   const lon=(col-(count-1)/2)/Math.max(1,count-1)*Math.PI*.94;
   const x=114+Math.sin(lon)*width;
   const depth=Math.max(.25,Math.cos(lon)*Math.cos(lat));
   genderDots.push({x,y:ry,depth,row,col});
  }
 }
 const femDots=Math.round(genderDots.length*female/Math.max(1,sexKnown));
 const genderSvg=`<svg class="lm-gender-orb" viewBox="0 0 228 228" aria-label="${T('توزيع النوع','Gender distribution')}"><defs><radialGradient id="lmSphereShade" cx="33%" cy="24%" r="76%"><stop stop-color="#134e78" stop-opacity=".44"/><stop offset=".68" stop-color="#071b37" stop-opacity=".12"/><stop offset="1" stop-color="#031126" stop-opacity=".65"/></radialGradient></defs><circle cx="114" cy="112" r="103" fill="url(#lmSphereShade)" opacity=".65"/>${genderDots.map(({x,y,depth},i)=>`<g transform="translate(${(x-8*depth).toFixed(1)} ${(y-12*depth).toFixed(1)}) scale(${(.36+depth*.38).toFixed(2)})" opacity="${(.5+depth*.5).toFixed(2)}" fill="${i<femDots?'#fb4bdc':'#05caff'}" style="filter:drop-shadow(0 0 2px ${i<femDots?'#fb4bdc':'#05caff'})"><circle cx="8" cy="3.5" r="3"/><path d="M5 8h6l2 8-2.5 1-1-5V25h-3v-8H6V25H3V12l-1 5-2-1 2-8z"/></g>`).join('')}</svg>`;
 const gender=sexKnown?`<div class="lm-gender-body">${genderSvg}<div class="lm-gender-stats"><strong class="female">${Math.round(female/sexKnown*100)}%</strong>${T('إناث','Female')} · ${female}<strong>${Math.round(male/sexKnown*100)}%</strong>${T('ذكور','Male')} · ${male}</div></div>`:`<div class="lm-blank">${T('بيانات النوع غير متاحة','Gender data unavailable')}</div>`;
 const palette=['#00c7fa','#7767ff','#ffae45','#ee39d4','#21d7bc'];
 const ring=(rows,known)=>{const shown=rows.slice(0,5);let pos=0;const gradient=shown.map(([_,n],i)=>{const start=pos;pos+=n/Math.max(1,known)*100;return `${palette[i]} ${start}% ${pos}%`}).join(',');return `<div class="lm-ringwrap"><div class="lm-ring" style="background:conic-gradient(${gradient||'#203552 0% 100%'},#203552 ${pos}% 100%)"><b title="${E(rows[0]?.[0]||'')}">${known?Math.round(rows[0][1]/known*100):0}%<small>${E(rows[0]?.[0]||'')}</small></b></div><div class="lm-legend">${shown.map(([label,n],i)=>`<div><i style="background:${palette[i]}"></i><span title="${E(label)}">${E(label)}</span><b>${n}</b></div>`).join('')}</div></div>`};
 const qualChoices=group(e=>currentLang==='en'?(field(e,'qualification','qualification_en','qualification english')||field(e,'المؤهل')):(field(e,'المؤهل')||field(e,'qualification')));
 const qualificationGauge=`<div class="lm-qual-gauge"><label for="lm-qual-select">${T('اختر المؤهل العلمي','Select qualification')}</label><select id="lm-qual-select" onchange="lmUpdateQualGauge(this.value)"><option value="">${T('بدون اختيار','None selected')}</option>${qualChoices.map(([label,n],i)=>`<option value="${i}">${E(label)} (${n})</option>`).join('')}</select><div class="lm-speedometer" role="meter" aria-label="${T('نسبة المؤهل المختار','Selected qualification percentage')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><svg viewBox="0 0 240 137" aria-hidden="true"><defs><linearGradient id="lmRpmGradient" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#9bdfff"/><stop offset="32%" stop-color="#26cfff"/><stop offset="68%" stop-color="#0874ff"/><stop offset="100%" stop-color="#a54aff"/></linearGradient><filter id="lmRpmGlow"><feGaussianBlur stdDeviation="2" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M 20 116 A 100 100 0 0 1 220 116" fill="none" stroke="#243a5c" stroke-width="13" stroke-linecap="round"/><path id="lm-speed-arc" d="M 20 116 A 100 100 0 0 1 220 116" fill="none" stroke="url(#lmRpmGradient)" stroke-width="13" stroke-linecap="round" stroke-dasharray="314.159 314.159" stroke-dashoffset="314.159" filter="url(#lmRpmGlow)"/><g id="lm-rpm-ticks">${Array.from({length:11},(_,i)=>{const a=Math.PI-i*Math.PI/10;const x1=120+80*Math.cos(a),y1=116-80*Math.sin(a),x2=120+89*Math.cos(a),y2=116-89*Math.sin(a);return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#87a9d3" stroke-width="1.5"/>`}).join('')}</g><g id="lm-speed-needle" transform="rotate(0 120 116)" style="transition:transform .65s cubic-bezier(.18,.78,.2,1)"><path d="M 31 116 L 111 111 L 124 116 L 111 121 Z" fill="#ffbd48" stroke="#fff0a5" stroke-width="1.1" filter="url(#lmRpmGlow)"/><path d="M 47 115 L 112 114" stroke="#fff5ce" stroke-width="1" opacity=".85"/><circle cx="120" cy="116" r="9" fill="#102c4e" stroke="#f4c46c" stroke-width="2.5"/><circle cx="120" cy="116" r="3.5" fill="#e6f6ff"/></g><text x="13" y="135" fill="#92bce2" font-size="10">0</text><text x="215" y="135" fill="#92bce2" font-size="10">100</text></svg><div class="lm-speed-center"><strong id="lm-speed-pct">0%</strong><small id="lm-speed-count">${T('اختر مؤهلًا','Select a qualification')}</small></div></div><div class="lm-qual-foot">${T('النسبة من إجمالي الموظفين ذوي المؤهل المسجل','Share of employees with a recorded qualification')}</div></div>`;
 window.lmQualChoices=qualChoices;window.lmQualKnown=qualChoices.reduce((n,x)=>n+x[1],0);
 const orgRows=departments.slice(0,12),left=orgRows.filter((_,i)=>i%2===0),right=orgRows.filter((_,i)=>i%2===1);
 const orgSide=(rows,side)=>`<div class="lm-orgside ${side}">${rows.map(([name,n])=>`<div class="lm-orgitem" title="${E(name)}"><span>${E(name)}</span><b>${n}</b></div>`).join('')}</div>`;
 const orgCurves=Array.from({length:6},(_,i)=>{const y=19+i*40;return `<path d="M 44 121 Q 39 ${y} 35 ${y}"/><path class="r" d="M 56 121 Q 61 ${y} 65 ${y}"/>`}).join('');
 const org=`<div class="lm-org">${orgSide(left,'left')}<div class="lm-orgcenter"><img class="lm-orglogo" src="logo.png" alt="Lacto Misr"></div>${orgSide(right,'right')}<svg class="lm-orgsvg" viewBox="0 0 100 242" preserveAspectRatio="none">${orgCurves}</svg></div>`;
 const hire=dates.slice(-12),maxH=Math.max(1,...hire.map(x=>x[1]));const pts=hire.map(([_,n],i)=>[18+i*560/Math.max(1,hire.length-1),155-n/maxH*118]);const line=pts.map(p=>p.join(',')).join(' ');
 const trend=hire.length>1?`<svg class="lm-spark" viewBox="0 0 600 175" preserveAspectRatio="none"><defs><linearGradient id="lmGrad" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#8c4bff" stop-opacity=".4"/><stop offset="1" stop-color="#004ad5" stop-opacity="0"/></linearGradient></defs><path d="M ${pts.map(p=>p.join(' ')).join(' L ')} L 578 165 L 18 165 Z" fill="url(#lmGrad)"/><polyline points="${line}" fill="none" stroke="#13d8ff" stroke-width="3"/>${pts.map((p,i)=>`<g><title>${E(hire[i][0])}: ${hire[i][1]} ${T('تعيين','hires')}</title><circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#fff"/><text x="${p[0]}" y="${Math.max(13,p[1]-10)}" text-anchor="middle" fill="#d7f6ff" font-size="13" font-weight="bold">${hire[i][1]}</text></g>`).join('')}</svg><div class="lm-trend-axis">${hire.map(([year,n])=>`<span title="${year}: ${n}"><b>${year}</b><small>${n}</small></span>`).join('')}</div><div class="lm-note">${T('عدد التعيينات حسب سنة التعيين (وليس إجمالي الموظفين التاريخي)','Hires by hiring year (not historical headcount)')}</div>`:`<div class="lm-blank">${T('بيانات التعيين غير كافية','Insufficient hiring data')}</div>`;
 const egypt=`<div class="lm-geo-controls"><label for="lm-gov-slicer">${T('المحافظة','Governorate')}</label><select id="lm-gov-slicer" onchange="lmFilterGovernorate(this.value)"><option value="">${T('كل المحافظات','All governorates')}</option>${governorates.map(g=>`<option value="${g.i}">${E(g.name)} (${g.n})</option>`).join('')}</select></div><div class="lm-mapbody lm-egypt-real"><svg id="hr-real-egypt-map" viewBox="0 0 540 500" role="img" aria-label="${T('خريطة محافظات مصر','Egypt governorates map')}"><text x="270" y="245" text-anchor="middle" fill="#8fdcff" font-size="17">${T('جار تحميل المحافظات','Loading governorates')}</text></svg><div class="lm-geo-tooltip" id="hr-geo-tooltip">${T('مرر المؤشر على المحافظة لمعرفة عدد الموظفين','Hover over a governorate to see employee count')} · ${mapped}/${total}</div></div>`;
 const world=`<div class="lm-mapbody lm-world-real"><img src="world-map.svg" alt="${T('خريطة العالم','World map')}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><p class="lm-map-missing" hidden>${T('ملف world-map.svg غير موجود بجانب البورتال — ضعه بجانب index.html','world-map.svg is missing — place it beside index.html')}</p><div class="lm-geo-tooltip">${T('جميع الموظفين المسجلين في مصر؛ لا توجد بيانات توزيع دولي','Recorded employees are in Egypt; no international distribution available')}</div></div>`;
 const notifications=`<div class="lm-notifications"><div class="lm-notify-head"><strong id="lm-notification-count">—</strong><span id="lm-notification-label">${T('يلزم اتصال إدارة ESS لقراءة الطلبات المعلقة','Connect ESS admin to read pending requests')}</span></div><div class="lm-notify-list" id="lm-notification-list" aria-live="polite"></div><button type="button" onclick="showHRPage('notifications')">${T('عرض جميع الطلبات','View all requests')} ↗</button></div>`;
 root.innerHTML=`<div class="lm-board"><div class="lm-row lm-top">${stat('إجمالي الموظفين','Total Employees',total,T('موظف','Employees'),'users')}${stat('عدد الإدارات','Total Departments',departments.length,T('إدارة','Departments'),'building')}${stat('متوسط سنوات الخدمة','Average Service Years',avgTenure,T('سنة','Years'),'clock')}${stat('متوسط العمر','Average Age',avgAge,T('سنة','Years'),'users')}<section class="lm-card lm-attendance"><div class="lm-heading">${T('معدل الحضور العام','Attendance Rate')}<small>Attendance Rate</small></div><div class="lm-blank">${T('بانتظار ربط بيانات الحضور الفعلية','Awaiting verified attendance data')}</div></section></div><div class="lm-row lm-middle">${card('توزيع الموظفين حسب النوع','Employees by Gender',gender)}${card('توزيع الموظفين حسب الإدارات','Employees by Departments',org)}${card('التوزيع الجغرافي (العالم)','Employees by Country',world)}${card('التوزيع الجغرافي في مصر','Employees in Egypt',egypt)}</div><div class="lm-row lm-charts">${card('عدد الموظفين حسب الإدارات','Employees by Department',bar(departments))}${card('تطور عدد الموظفين','Employees Trend',trend)}${card('المؤهلات العلمية','Qualifications',qualificationGauge)}</div><div class="lm-row lm-bottom">${card('حالة التأمين','Insurance Status',ring(insurance,insurance.reduce((s,x)=>s+x[1],0)))}${card('الحالة الاجتماعية','Marital Status',ring(marital,marital.reduce((s,x)=>s+x[1],0)))}${card('سنوات الخدمة','Years of Service',bar(serviceBins,7))}${card('ملخص الإشعارات والطلبات','Requests & Notifications',notifications)}</div><div class="lm-note">${T('جميع الأرقام من بيانات الموظفين الحالية؛ الخرائط توضيحية وتظهر المحافظات المسجلة فقط.','All counts from current employee records; maps are illustrative and governorate markers use recorded values only.')}</div></div>`;
 if(typeof hrRenderGeographicEgypt==='function')hrRenderGeographicEgypt(governorates.map(g=>g.n));
 lmRefreshNotificationUI();
}

// Read-only ESS pending request badge; no new Firebase writes or authentication bypass.
let lmEssBadgeRefs=[];let lmEssBadgeValues={};let lmEssBadgeErrors=new Set();
function lmPendingStatus(path,req){const s=String(req?.verificationStatus??req?.status??'').toUpperCase();return path==='attendance_requests'?(s==='PENDING_REVIEW'||s==='HELD'):(s==='PENDING'||s==='PENDING_REVIEW');}
function lmRefreshNotificationUI(){
 const connected=typeof essPilotReady==='function'&&essPilotReady();
 const badge=document.getElementById('lm-header-badge'),count=document.getElementById('lm-notification-count'),label=document.getElementById('lm-notification-label'),list=document.getElementById('lm-notification-list');
 if(!connected){if(badge)badge.hidden=true;if(count)count.textContent='—';if(label)label.textContent=hrText('اتصل بإدارة ESS لعرض الطلبات','Connect ESS admin to view requests');if(list)list.textContent='';return;}
 const pending=[];
 for(const [path,ar,en] of essPaths){
  if(path==='attendance_requests')continue; // Attendance ledger belongs exclusively to attendance module.
  const byCode=lmEssBadgeValues[path]||{};
  for(const [code,requests] of Object.entries(byCode)){
   if(!requests||typeof requests!=='object')continue;
   for(const [id,req] of Object.entries(requests)){
    if(!req||typeof req!=='object'||!lmPendingStatus(path,req))continue;
    pending.push({path,code,id,req,type:hrText(ar,en),time:Number(req.timestamp||req.createdAt||0)});
   }
  }
 }
 pending.sort((a,b)=>b.time-a.time);
 const total=pending.length;
 if(badge){badge.hidden=total===0;badge.textContent=total>99?'99+':String(total);}
 if(count)count.textContent=lmEssBadgeErrors.size?'—':String(total);
 if(label)label.textContent=lmEssBadgeErrors.size?hrText('تعذر قراءة بعض مصادر الطلبات','Some request sources unavailable'):hrText('طلبات معلقة للمراجعة','Pending requests for review');
 if(list){
  if(lmEssBadgeErrors.size){list.innerHTML=`<div class="lm-notify-empty">${hrText('الملخص غير مكتمل: تعذر قراءة بعض المسارات','Summary incomplete: some sources could not be read')}</div>`;}
  else if(!total){list.innerHTML=`<div class="lm-notify-empty">${hrText('لا توجد طلبات معلقة حاليًا','No pending requests right now')}</div>`;}
  else list.innerHTML=pending.slice(0,4).map(r=>{
   const employee=(allEmployees||[]).find(e=>String(getEmployeeCode(e))===String(r.code));
   const nameAr=employee?lmArabicField(employee,'اسم الموظف','الاسم بالعربية','الاسم','employee_name_ar','name_ar'):'';
   const nameEn=employee?lmEnglishField(employee,'emp_name _en','employee_name_en','name_en','english name','full_name_en','full name en'):'';
   const preferred=currentLang==='en'?nameEn:nameAr;
   const displayName=preferred||hrText('موظف','Employee')+' '+r.code;
   const rawPhoto=employee?getField(employee,'photoUrl','photo','رابط الصورة','الصورة'):'';
   // Only trusted image schemes; employee data is rendered as escaped text/attributes.
   const photo=typeof rawPhoto==='string'&&/^(https:\/\/|data:image\/(?:png|jpeg|webp);base64,)/i.test(rawPhoto.trim())?rawPhoto.trim():'';
   const avatar=photo?`<img class="lm-notify-avatar" src="${essEscape(photo)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="lm-notify-avatar-fallback" hidden aria-hidden="true">♙</span>`:`<span class="lm-notify-avatar-fallback" aria-hidden="true">♙</span>`;
   return `<button type="button" class="lm-notify-item" onclick="showHRPage('${r.path==='attendance_requests'?'attendance':'notifications'}')" title="${essEscape(r.type)} — ${essEscape(displayName)}"><span class="lm-notify-person">${avatar}</span><span class="lm-notify-info"><b class="lm-notify-who" dir="auto">${essEscape(displayName)}</b><small class="lm-notify-type">${essEscape(r.type)}</small></span><span class="lm-notify-pending" title="${hrText('بانتظار المراجعة','Pending review')}">●</span></button>`;
  }).join('')+(total>4?`<div class="lm-notify-more">+${total-4} ${hrText('طلبات أخرى','more requests')}</div>`:'');
 }
}
function lmStartESSBadge(){
 lmEssBadgeRefs.forEach(([ref,cb])=>ref.off('value',cb));lmEssBadgeRefs=[];lmEssBadgeValues={};lmEssBadgeErrors.clear();
 if(typeof essPilotReady!=='function'||!essPilotReady()){lmRefreshNotificationUI();return;}
 for(const [path] of essPaths){if(path==='attendance_requests')continue;const ref=essDb.ref(path);const cb=s=>{lmEssBadgeValues[path]=s.val()||{};lmEssBadgeErrors.delete(path);lmRefreshNotificationUI()};ref.on('value',cb,()=>{lmEssBadgeErrors.add(path);lmRefreshNotificationUI()});lmEssBadgeRefs.push([ref,cb]);}
}
essAuth.onAuthStateChanged(()=>lmStartESSBadge());

function lmEnglishField(emp,...keys){
 const norm=s=>String(s).trim().toLowerCase().replace(/\s+/g,' ').replace(/[_-]+/g,' ');
 for(const key of keys){const match=Object.entries(emp||{}).find(([k,v])=>norm(k)===norm(key)&&String(v??'').trim());if(match)return String(match[1]).trim();}
 return '';
}
function lmArabicField(emp,...keys){
 for(const key of keys){const match=Object.entries(emp||{}).find(([k,v])=>k.trim()===key.trim()&&String(v??'').trim());if(match)return String(match[1]).trim();}
 return '';
}
function lmUpdateHeaderIdentity(){
 const emp=(allEmployees||[]).find(e=>String(getEmployeeCode(e))===String(currentUserData?.code||PORTAL_ADMIN_CODE));
 const name=document.getElementById('lm-header-name'),job=document.getElementById('lm-header-job'),photo=document.getElementById('lm-header-photo'),flag=document.getElementById('lm-role-flag');
 if(name){const record=emp||currentUserData||{};name.textContent=(currentLang==='en'?(lmEnglishField(record,'emp_name _en','employee_name_en','name_en','english name','full_name_en','full name en','الاسم بالإنجليزي')||lmEnglishField(currentUserData||{},'name_en','english_name')):(lmArabicField(record,'اسم الموظف','الاسم بالعربية','الاسم','employee_name_ar','name_ar')||lmArabicField(currentUserData||{},'name_ar')))|| (emp?getEmployeeName(emp):hrText('مسؤول النظام','System Admin'));name.dir=currentLang==='ar'?'rtl':'ltr';}
 if(job)job.textContent=emp?(currentLang==='en'?(lmEnglishField(emp,'job title ','job_title_en','jobTitleEn','jobTitle')||'—'):(lmArabicField(emp,'الوظيفة','المسمى الوظيفي')||getEmployeeJob(emp))):hrText('مدير النظام','System Administrator');
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

// Dashboard-only, read-only qualification slicer. No data writes.
function lmUpdateQualGauge(value){
 const pct=document.getElementById('lm-speed-pct'),count=document.getElementById('lm-speed-count'),needle=document.getElementById('lm-speed-needle'),arc=document.getElementById('lm-speed-arc');
 if(!pct||!count||!needle||!arc)return;
 const row=value===''?null:(window.lmQualChoices||[])[Number(value)];
 const n=row?row[1]:0,percent=row&&window.lmQualKnown?Math.min(100,Math.max(0,Math.round(n/window.lmQualKnown*100))):0;
 pct.textContent=percent+'%';count.textContent=row?(n+' '+(currentLang==='ar'?'موظف':'employees')):(currentLang==='ar'?'اختر مؤهلًا':'Select a qualification');
 const a=Math.PI*(1-percent/100);
 needle.style.transform='rotate('+(180*percent/100).toFixed(2)+'deg)';
 arc.style.strokeDashoffset=String(314.159*(1-percent/100));
 const meter=pct.closest('[role="meter"]');if(meter)meter.setAttribute('aria-valuenow',String(percent));
}


/* Lacto Misr date picker: presentation-only; input values remain YYYY-MM-DD */
(function(){
 let active=null;
 const iso=v=>/^\d{4}-\d{2}-\d{2}$/.test(String(v||''))?String(v):'';
 function dateCandidate(key){return /(?:تاريخ|date|dob|birth|hire|joining|expiry|expiration)/i.test(key)&&!/(?:تاريخ.*(رقم|عدد)|update|created|modified|timestamp)/i.test(key);}
 function close(){if(active){active.remove();active=null;}}
 function show(input){
  if(input.disabled||(input.readOnly&&!input.classList.contains('lm25-calendar-value')))return;
  close();const pop=document.createElement('div');pop.className='lm-date-pop';pop.dir=typeof currentLang!=='undefined'&&currentLang==='en'?'ltr':'rtl';pop.setAttribute('role','dialog');pop.setAttribute('aria-label',pop.dir==='rtl'?'اختيار التاريخ':'Choose date');
  const chosen=iso(input.value);const now=new Date();let year=chosen?+chosen.slice(0,4):now.getFullYear(),month=chosen?+chosen.slice(5,7)-1:now.getMonth();
  const ar=pop.dir==='rtl';const months=ar?['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']:['January','February','March','April','May','June','July','August','September','October','November','December'];
  const week=ar?['ح','ن','ث','ر','خ','ج','س']:['Su','Mo','Tu','We','Th','Fr','Sa'];
  function draw(){pop.replaceChildren();const top=document.createElement('div');top.className='lm-date-top';
   const prev=document.createElement('button');prev.type='button';prev.textContent='‹';prev.setAttribute('aria-label',ar?'الشهر السابق':'Previous month');prev.onclick=()=>{month--;if(month<0){month=11;year--;}draw();};
   const next=document.createElement('button');next.type='button';next.textContent='›';next.setAttribute('aria-label',ar?'الشهر التالي':'Next month');next.onclick=()=>{month++;if(month>11){month=0;year++;}draw();};
   const m=document.createElement('select');months.forEach((name,i)=>{const o=document.createElement('option');o.value=i;o.textContent=name;o.selected=i===month;m.append(o);});m.onchange=()=>{month=+m.value;draw();};
   const y=document.createElement('select');for(let n=1900;n<=2100;n++){const o=document.createElement('option');o.value=n;o.textContent=n;o.selected=n===year;y.append(o);}y.onchange=()=>{year=+y.value;draw();};
   top.append(prev,m,y,next);pop.append(top);
   const grid=document.createElement('div');grid.className='lm-date-grid';week.forEach(w=>{const el=document.createElement('span');el.className='lm-date-weekday';el.textContent=w;grid.append(el);});
   const first=new Date(year,month,1).getDay(),total=new Date(year,month+1,0).getDate();for(let i=0;i<first;i++)grid.append(document.createElement('span'));
   for(let day=1;day<=total;day++){const b=document.createElement('button');b.type='button';b.className='lm-date-day';b.textContent=day;const val=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;if(val===chosen)b.classList.add('is-selected');if(year===now.getFullYear()&&month===now.getMonth()&&day===now.getDate())b.classList.add('is-today');b.onclick=()=>{input.value=val;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));close();};grid.append(b);}pop.append(grid);
   const footer=document.createElement('div');footer.className='lm-date-footer';const today=document.createElement('button');today.type='button';today.textContent=ar?'اليوم':'Today';today.onclick=()=>{const d=new Date(),v=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;input.value=v;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));close();};const clear=document.createElement('button');clear.type='button';clear.textContent=ar?'مسح':'Clear';clear.onclick=()=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));close();};footer.append(clear,today);pop.append(footer);
  }
  draw();document.body.append(pop);active=pop;const r=input.getBoundingClientRect();let left=Math.min(Math.max(12,r.left),Math.max(12,window.innerWidth-pop.offsetWidth-12)),top=r.bottom+6;if(top+pop.offsetHeight>window.innerHeight-8)top=Math.max(8,r.top-pop.offsetHeight-6);pop.style.left=left+'px';pop.style.top=top+'px';
 }
 function attach(input){if(input.dataset.lmDateReady)return;const key=input.dataset.fahdKey||input.name||input.id||'';if(input.type!=='date'&&!input.classList.contains('lm25-calendar-value')&&!(input.closest('#fahd-fields')&&dateCandidate(key)))return;
  // Do not change the type of legacy profile fields: they may hold Excel serials or display strings.
  if(input.type!=='date'&&!input.classList.contains('lm25-calendar-value')&&input.value&&!iso(input.value))return;
  input.dataset.lmDateReady='1';const wrap=document.createElement('span');wrap.className='lm-date-shell';input.parentNode.insertBefore(wrap,input);wrap.append(input);const btn=document.createElement('button');btn.type='button';btn.className='lm-date-trigger';btn.textContent='▦';btn.setAttribute('aria-label','Choose date / اختيار التاريخ');btn.onclick=()=>show(input);wrap.append(btn);
  // The calendar opens ONLY from the dedicated button, never from the input.
  if(input.type==='date'){input.setAttribute('tabindex','-1');input.setAttribute('aria-label',input.getAttribute('aria-label')||'Date selected using calendar button');}
 }
 function scan(){document.querySelectorAll('input[type="date"],input.lm25-calendar-value,#fahd-fields input[data-fahd-key]').forEach(attach);}
 document.addEventListener('click',e=>{if(active&&!active.contains(e.target)&&!e.target.closest('.lm-date-trigger'))close();},true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});window.addEventListener('resize',close);window.addEventListener('scroll',close,true);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});});else{scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});}
})();


// MASS HIRING phase 1: employee-only, schema-aligned, create-only with row-level audit.
const lmMass={rows:[],errors:[],file:'',busy:false,valid:false};
const lmMassReserved=new Set(['password','authUid','photo','photoUrl','_firebasePath','_firebaseKey','hr_custom_fields']);
function lmMassMessage(ar,en){return currentLang==='ar'?ar:en;}
function lmMassCode(x){const s=String(x??'').trim();return /^\d{1,12}$/.test(s)?s:'';}
function lmMassSchema(){
 const fields=new Set(['code','الكود','اسم الموظف ','emp_name _en']);
 // Preserve actual Firebase keys including trailing spaces; never guess translations.
 for(const emp of allEmployees)for(const k of Object.keys(emp))if(!k.startsWith('_')&&!lmMassReserved.has(k)&&typeof emp[k]!=='object')fields.add(k);
 for(const [, , ,ar,en] of FAHD_PAIRS) {fields.add(ar);fields.add(en);}
 for(const [, , ,ar,en] of FAHD_COMMON){fields.add(ar);fields.add(en);}
 return ['code',...Array.from(fields).filter(k=>k!=='code'&&k!=='الكود'),...Object.keys(lmCustomFieldDefinitions).filter(k=>/^cf_[a-z0-9_]{1,50}$/.test(k)).flatMap(k=>['hr_custom_fields/'+k+'/valueAr','hr_custom_fields/'+k+'/valueEn'])];
}
function lmOpenMassHiring(){
 if(!portalIsAdmin()){showToast(lmMassMessage('هذه العملية تتطلب حساب الإدارة','Admin account required'),true);return;}
 document.getElementById('lm-mass-workspace')?.classList.remove('hidden');
 document.getElementById('lm-mass-hint').textContent=lmMassMessage('القالب يستخدم مفاتيح حقول الموظفين الفعلية. كل صف يمثل موظفًا جديدًا. لا استبدال ولا تعديل للسجلات الحالية.','Template uses actual employee field keys. Each row is a new employee. Existing records are never replaced or edited.');
}
function lmCloseMassHiring(){if(lmMass.busy)return;document.getElementById('lm-mass-workspace')?.classList.add('hidden');}
function lmMassSafeText(id,value){const el=document.getElementById(id);if(el)el.textContent=value;}
function lmDownloadHiringTemplate(){
 if(!window.XLSX){lmMassSafeText('lm-mass-errors','Excel library unavailable');return;}
 const keys=lmMassSchema();
 const sheet=XLSX.utils.aoa_to_sheet([keys]);sheet['!cols']=keys.map(k=>({wch:Math.min(38,Math.max(15,k.length+5))}));
 const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,sheet,'Employees');
 const defs=Object.entries(lmCustomFieldDefinitions).filter(([k])=>/^cf_[a-z0-9_]{1,50}$/.test(k));
 if(defs.length){const help=[['Field Key','Arabic label','English label'],...defs.map(([k,v])=>[k,v.labelAr||'',v.labelEn||''])];XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(help),'Custom Fields Guide');}
 XLSX.writeFile(wb,'LactoMisr_Mass_Hiring_Template.xlsx');
}
function lmMassNormalized(s){return String(s??'').trim().replace(/\s+/g,' ').toLowerCase();}
function lmMassDate(v){
 if(typeof v==='number'&&window.XLSX){const d=XLSX.SSF.parse_date_code(v);return d?`${d.d}/${d.m}/${d.y}`:String(v);}
 if(v instanceof Date&&!Number.isNaN(v.getTime()))return `${v.getDate()}/${v.getMonth()+1}/${v.getFullYear()}`;
 return String(v??'').trim();
}
function lmMassRows(raw,keys){
 const normKeys=new Map();keys.forEach(k=>{const n=lmMassNormalized(k);if(!normKeys.has(n))normKeys.set(n,[]);normKeys.get(n).push(k);});
 const issues=[];for(const [n,list] of normKeys)if(list.length>1)issues.push('Ambiguous duplicate columns: '+list.join(' / '));
 const allowed=lmMassSchema(),schema=new Map();for(const k of allowed){const n=lmMassNormalized(k);if(!schema.has(n))schema.set(n,[]);schema.get(n).push(k);}
 const mapping={};for(const header of keys){const n=lmMassNormalized(header);if(!n)continue;
  if(n==='الكود'||n==='code'){mapping[header]='code';continue;}
  if(/^hr_custom_fields\/(cf_[a-z0-9_]{1,50})\/(valueAr|valueEn)$/.test(header)){
   const match=header.match(/^hr_custom_fields\/(cf_[a-z0-9_]{1,50})\/(valueAr|valueEn)$/);
   if(Object.hasOwn(lmCustomFieldDefinitions,match[1]))mapping[header]=header;else issues.push('Unknown custom field: '+header);
   continue;
  }
  if(lmMassReserved.has(header)||header.startsWith('_')){issues.push('Protected column: '+header);continue;}
  const matches=schema.get(n)||[];if(matches.length===1)mapping[header]=matches[0];else if(matches.length>1)issues.push('Ambiguous field: '+header);else issues.push('Unknown column: '+header);
 }
 const codes=new Set(allEmployees.map(e=>lmMassCode(getEmployeeCode(e))));const seen=new Set();const parsed=[];
 raw.forEach((row,i)=>{const data={};const rowIssues=[];
  for(const [h,k] of Object.entries(mapping)){let v=row[h];if(v===null||v===undefined||v==='')continue;v=/تاريخ|date|dob/i.test(k)?lmMassDate(v):String(v).trim();if(!v)continue;
   if(k.startsWith('hr_custom_fields/')){const [,field,prop]=k.split('/');data.hr_custom_fields??={};data.hr_custom_fields[field]??={valueAr:'',valueEn:''};data.hr_custom_fields[field][prop]=v;}
   else data[k]=v;
  }
  const code=lmMassCode(data.code);if(!code)rowIssues.push('Invalid numeric employee code');
  if(code&&codes.has(code))rowIssues.push('Employee code already exists');
  if(code&&seen.has(code))rowIssues.push('Duplicate employee code in file');
  if(code)seen.add(code);
  if(!data['اسم الموظف ']||!data['emp_name _en'])rowIssues.push('Arabic and English employee names are required');
  if(code){data.code=code;data['الكود']=code;}
  for(const k of Object.keys(lmCustomFieldDefinitions))if(/^cf_[a-z0-9_]{1,50}$/.test(k)){data.hr_custom_fields??={};data.hr_custom_fields[k]??={valueAr:'',valueEn:''};}
  const age=fahdAge(data['تاريخ الميلاد']);if(age){data['السن حتى تاريخه ']=age;data['age to date']=age;}
  parsed.push({line:i+2,code,data,issues:rowIssues});
 });
 return {parsed,issues,mapping};
}
async function lmReadMassHiring(input){
 const file=input.files?.[0];lmMass.valid=false;lmMass.rows=[];document.getElementById('lm-mass-commit').disabled=true;
 if(!file)return;if(!window.XLSX){lmMassSafeText('lm-mass-errors','Excel parser unavailable');return;}
 if(file.size>5*1024*1024){lmMassSafeText('lm-mass-errors','File exceeds 5 MB');return;}
 lmMassSafeText('lm-mass-filename',file.name);
 try{
  const wb=XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:false});const sheet=wb.Sheets[wb.SheetNames[0]];
  const grid=XLSX.utils.sheet_to_json(sheet,{header:1,defval:'',raw:true,blankrows:false});
  if(grid.length<2)throw Error('Sheet contains no employee rows');if(grid.length>501)throw Error('Maximum 500 employee rows per import');
  const keys=grid[0].map(v=>String(v??''));if(keys.some(k=>!k.trim()))throw Error('Blank column header');
  const records=grid.slice(1).filter(r=>r.some(v=>String(v??'').trim()!==''));
  const rows=records.map(r=>Object.fromEntries(keys.map((k,i)=>[k,r[i]??''])));
  const {parsed,issues}=lmMassRows(rows,keys);lmMass.rows=parsed;lmMass.errors=issues;lmMass.file=file.name;
  const invalid=parsed.filter(r=>r.issues.length);lmMass.valid=issues.length===0&&invalid.length===0&&parsed.length>0;
  lmMassSafeText('lm-mass-summary',`${lmMassMessage('إجمالي الصفوف','Total rows')}: ${parsed.length} · ${lmMassMessage('صالحة','Valid')}: ${parsed.length-invalid.length} · ${lmMassMessage('مرفوضة','Rejected')}: ${invalid.length} · ${lmMassMessage('أخطاء الأعمدة','Column issues')}: ${issues.length}`);
  lmMassSafeText('lm-mass-errors',[...issues,...invalid.slice(0,25).map(r=>`Row ${r.line} (${r.code||'?'}): ${r.issues.join('; ')}`)].join('\n'));
  const preview=parsed.slice(0,30);const cols=['code','اسم الموظف ','emp_name _en','الإدارة ','department ','الوظيفة','job title '];
  const table=document.createElement('table'),thead=document.createElement('thead'),tr=document.createElement('tr');
  for(const k of ['Row',...cols,'Status']){const th=document.createElement('th');th.textContent=k;tr.append(th);}thead.append(tr);table.append(thead);
  const tbody=document.createElement('tbody');for(const row of preview){const t=document.createElement('tr');for(const v of [row.line,...cols.map(k=>row.data[k]||''),row.issues.length?row.issues.join('; '):'✓']){const td=document.createElement('td');td.textContent=v;t.append(td);}tbody.append(t);}table.append(tbody);
  document.getElementById('lm-mass-preview').replaceChildren(table);
  lmMassSafeText('lm-mass-status',lmMass.valid?lmMassMessage('جاهز للتأكيد بعد المراجعة','Ready for review and confirmation'):lmMassMessage('أصلح الأخطاء ثم أعد رفع الملف','Fix errors and upload again'));
  document.getElementById('lm-mass-commit').disabled=!lmMass.valid;
 }catch(e){lmMassSafeText('lm-mass-errors',e.message);lmMassSafeText('lm-mass-status','');document.getElementById('lm-mass-preview').replaceChildren();}
}
async function lmCommitMassHiring(){
 if(!lmMass.valid||lmMass.busy||!portalIsAdmin())return;
 const rows=lmMass.rows;if(!await lmDialog(lmMassMessage(`تأكيد إنشاء ${rows.length} موظف جديد؟ لن يتم تعديل أي سجل موجود.`,`Create ${rows.length} new employees? Existing records will not be changed.`)))return;
 lmMass.busy=true;document.getElementById('lm-mass-commit').disabled=true;
 const batchId=db.ref('hr_imports').push().key;let created=0,skipped=0;const failures=[],createdCodes=[];
 try{
  // Fresh DB check: prevents using a stale employee list as an overwrite decision.
  const latest=await db.ref(PORTAL_EMPLOYEE_COLLECTION).once('value');const present=new Set(Object.keys(latest.val()||{}));
  for(const row of rows){
   if(present.has(row.code)){skipped++;failures.push(row.code+': already exists');continue;}
   try{
    // Firebase transaction commits only if no employee record exists at this exact key.
    const ref=db.ref(PORTAL_EMPLOYEE_COLLECTION+'/'+row.code);
    const result=await ref.transaction(old=>old===null?row.data:undefined,undefined,false);
    if(!result.committed){skipped++;failures.push(row.code+': record created concurrently');continue;}
    present.add(row.code);created++;createdCodes.push(row.code);
    allEmployees.push({...row.data,_firebasePath:PORTAL_EMPLOYEE_COLLECTION+'/'+row.code,_firebaseKey:row.code});
   }catch(e){failures.push(row.code+': '+e.message);}
   lmMassSafeText('lm-mass-progress',`${lmMassMessage('تم إنشاء','Created')}: ${created} / ${rows.length} · ${lmMassMessage('تجاوز','Skipped')}: ${skipped}`);
  }
  try{await db.ref('hr_imports/'+batchId).set({type:'MASS_HIRING',actorUid:portalAuth.currentUser?.uid||'',createdAt:firebase.database.ServerValue.TIMESTAMP,filename:lmMass.file,requestedCount:rows.length,createdCount:created,skippedCount:skipped,errorCount:failures.length,createdCodes,errors:failures.slice(0,100)});}catch(e){failures.push('Audit log: '+e.message);}
  filterEmployees();updateDashboardStats();if(typeof renderRichDashboard==='function')renderRichDashboard();
  lmMassSafeText('lm-mass-status',`${lmMassMessage('تم إنشاء','Created')} ${created} · ${lmMassMessage('تجاوز','Skipped')} ${skipped} · ${lmMassMessage('أخطاء','Errors')} ${failures.length}`);
  lmMassSafeText('lm-mass-errors',failures.join('\n'));
  lmMass.valid=false;
 }catch(e){lmMassSafeText('lm-mass-errors','Import failed: '+e.message);}
 finally{lmMass.busy=false;lmMassSafeText('lm-mass-progress','');}
}

/* LM Leave Phase 1 — read-only employee balances as of 2026-10-01.
   Previous settlements are confirmed completed; no historic liability is inferred.
   This extension does not write to Firebase or change Dashboard/Employees. */
(function(){
 const original=renderHRFeature;
 const baseDate='2026-10-01';
 function valueByTrim(obj,names){
   for(const wanted of names){const key=Object.keys(obj||{}).find(k=>k.trim().toLowerCase()===wanted.trim().toLowerCase());
     if(key && obj[key]!==null && obj[key]!==undefined && String(obj[key]).trim()!=='')return obj[key];}
   return null;
 }
 function yearOfHire(value){
   if(typeof value==='number' && value>1000 && value<100000){const d=excelDateToJSDate(value);return /^\d{4}-/.test(d)?Number(d.slice(0,4)):null;}
   if(value==null)return null;
   const s=String(value).trim();
   const m=s.match(/^(\d{4})[-/]\d{1,2}[-/]\d{1,2}$/);if(m)return Number(m[1]);
   const d=s.match(/^\d{1,2}[-/]\d{1,2}[-/](\d{4})$/);if(d)return Number(d[1]);
   return null;
 }
 function nextSettlement(y){
   if(!Number.isInteger(y)||y<1900||y>2026)return null;
   let year=y+3;
   while(year<2027)year+=3;
   return `01/01/${year}`;
 }
 function draw(){
   const target=document.getElementById('hr-leave-balances-view');if(!target)return;
   const employees=Array.isArray(allEmployees)?allEmployees:[];
   const records=employees.map(emp=>{
     const balance=valueByTrim(emp,['رصيد الاجازات','رصيد الإجازات','annual leave balance']);
     const hire=valueByTrim(emp,['تاريخ التعيين','date_of_hiring','hireDate','hire date']);
     return {code:getEmployeeCode(emp),name:getEmployeeName(emp),balance,hire,settlement:nextSettlement(yearOfHire(hire))};
   });
   const known=records.filter(x=>x.balance!==null).length;
   const missingHire=records.filter(x=>!x.settlement).length;
   const labels=currentLang==='ar'
    ?['الكود','الموظف','الرصيد الفعلي في 01/10/2026','تاريخ التعيين','التسوية القادمة']
    :['Code','Employee','Actual balance at 01 Oct 2026','Hire date','Next settlement'];
   const notice=currentLang==='ar'
    ?'قراءة فقط من سجلات الموظفين الحالية. جميع التسويات المالية السابقة منفذة طبقًا لإفادة الإدارة. لا تتم إضافة استحقاقات أو خصم إجازات أو تعديل Firebase في هذه المرحلة. الحركات بعد 01/10/2026 لم تُطبّق بعد.'
    :'Read-only from current employee records. Management confirms all previous settlements completed. No accrual, debit or Firebase write is performed. Post-01 Oct 2026 transactions are not yet applied.';
   const html=`<section class="hr-panel mt-5" id="lm-opening-leave-balances"><h2 class="text-xl font-bold text-sky-300 mb-2">${hrText('الأرصدة الافتتاحية الفعلية والتسويات القادمة','Actual opening balances and upcoming settlements')}</h2><p class="text-sm text-amber-200 mb-3">${notice}</p><p class="text-sm text-slate-300 mb-3">${hrText('سجلات بها رصيد','Records with balances')}: ${known} / ${records.length} · ${hrText('تواريخ تعيين تحتاج مراجعة','Hire dates requiring review')}: ${missingHire}</p><input id="lm-leave-search" class="hr-feature-input mb-3 w-full" type="search" placeholder="${hrText('بحث بالاسم أو الكود','Search by name or code')}" oninput="lmFilterLeaveOpening()"/><div style="overflow:auto;max-height:570px"><table class="hr-feature-table w-full"><thead><tr>${labels.map(s=>`<th>${escapeHtml(s)}</th>`).join('')}</tr></thead><tbody id="lm-leave-opening-rows">${records.map(r=>`<tr data-search="${escapeHtml((r.code+' '+r.name).toLowerCase())}"><td>${escapeHtml(r.code)}</td><td>${escapeHtml(r.name)}</td><td>${r.balance===null?'—':escapeHtml(String(r.balance))}</td><td>${r.hire===null?'—':escapeHtml(String(typeof r.hire==='number'?excelDateToJSDate(r.hire):r.hire))}</td><td>${r.settlement||hrText('مراجعة تاريخ التعيين','Review hire date')}</td></tr>`).join('')}</tbody></table></div></section>`;
   target.insertAdjacentHTML('afterbegin',html);
 }
 window.lmFilterLeaveOpening=function(){const q=String(document.getElementById('lm-leave-search')?.value||'').trim().toLowerCase();document.querySelectorAll('#lm-leave-opening-rows tr').forEach(r=>{const code=String(r.cells[0]?.textContent||'').trim();const name=String(r.cells[1]?.textContent||'').toLocaleLowerCase();r.hidden=!!q&&(/^[0-9]+$/.test(q)?code!==q:!name.includes(q));});};
 renderHRFeature=function(page){original(page);if(page==='leave-balances')draw();};
})();



// LEAVE PHASE 2: separate, admin-only balance reset tool; never modifies identity fields.
function lmFiveUI(profile=false,value={}){
 const enabled=!!value?.enabled, status=value?.workStatus==='outside'?'outside':'working';
 return `<div class="fahd-field lm-five-compact" data-five-block><label class="lm-five-line"><input type="checkbox" data-five-input="enabled" ${enabled?'checked':''} ${profile?'disabled':''} onchange="lmFiveToggle(this)"> ${hrText('ضمن نسبة 5% – ذوو الإعاقة','5% disability category')}</label><div data-five-status class="lm-five-status" style="${enabled?'':'display:none'}"><label>${hrText('ممارسة العمل','Work status')}</label><select data-five-input="status" ${profile?'disabled':''} class="hr-feature-input"><option value="working" ${status==='working'?'selected':''}>${hrText('بيعمل فعليًا','Working')}</option><option value="outside" ${status==='outside'?'selected':''}>${hrText('خارج النطاق','Outside active work')}</option></select></div></div>`;
}
function lmFiveToggle(el){const block=el.closest('[data-five-block]');block.querySelector('[data-five-status]').style.display=el.checked?'':'none';}
function lmReadFiveUI(selector){const block=document.querySelector(selector+' [data-five-block]');if(!block)return {enabled:false,workStatus:null};const enabled=block.querySelector('[data-five-input="enabled"]').checked;return {enabled,workStatus:enabled?block.querySelector('[data-five-input="status"]').value:null};}
const lmBalanceColumns=['الكود','الاسم','تاريخ التعيين','الإدارة','عدد سنوات الخدمة','مدد خارجية','الرصيد عن السنة','الرصيد الافتتاحى','رصيد مستنفذ','الرصيد الحالى'];
const lmBalanceState={rows:[],errors:[],ready:false,file:'',date:'',busy:false};
function lmBText(ar,en){return hrText(ar,en)}
function lmBKey(k){return String(k??'').trim().replace(/\s+/g,' ').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').toLowerCase()}
function lmBField(e,keys){for(const k of keys){const match=Object.keys(e||{}).find(x=>lmBKey(x)===lmBKey(k));if(match)return e[match];}return null;}
function lmBDate(v){if(typeof v==='number'&&window.XLSX){const d=XLSX.SSF.parse_date_code(v);if(!d)return '';return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;}const s=String(v??'').trim();const m=s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);if(m)return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;const iso=s.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);return iso?`${iso[1]}-${iso[2].padStart(2,'0')}-${iso[3].padStart(2,'0')}`:s;}
function lmBNumber(v){if(v===null||v===undefined||String(v).trim()==='')return NaN;const n=Number(String(v).replace(/,/g,'').trim());return Number.isFinite(n)?n:NaN;}
function lmBHtml(){return `<section class="hr-panel mb-5"><h2 class="font-bold text-sky-300 mb-2">${lmBText('تحديث أرصدة الإجازات الجماعي','Mass Leave Balance Update')}</h2><p class="text-sm text-slate-300 mb-3">${lmBText('نفس خطوات Mass Hiring: تنزيل النموذج ← رفع الملف ← فحص كامل ← معاينة ← اعتماد. لا تغيير لبيانات الموظف أو نظام الحساب التلقائي.','Same Mass Hiring workflow: template → upload → validation → preview → confirm. No identity changes or automatic accrual changes.')}</p><div class="lm-mass-toolbar"><button type="button" class="portal-action-btn" onclick="lmBDownload()">↓ ${lmBText('تنزيل نموذج Excel','Download Excel template')}</button><label class="lm-mass-file-label">↑ ${lmBText('رفع نموذج الأرصدة','Upload balances')}<input type="file" accept=".xlsx,.xls" onchange="lmBRead(this)"></label></div><p id="lm-b-summary" class="mt-3 text-sm text-slate-300"></p><pre id="lm-b-errors" class="text-rose-300 whitespace-pre-wrap text-sm"></pre><div id="lm-b-preview" class="lm-mass-preview" style="max-height:440px;overflow:auto"></div><button id="lm-b-commit" type="button" disabled class="portal-action-btn mt-4" onclick="lmBCommit()">${lmBText('اعتماد تحديث الأرصدة','Confirm balance update')}</button><p id="lm-b-progress" class="text-sm text-amber-200 mt-3"></p></section>`;}
function lmBInvalidate(){lmBalanceState.ready=false;const b=document.getElementById('lm-b-commit');if(b)b.disabled=true;document.getElementById('lm-b-summary').textContent=lmBText('تاريخ السريان تغير. أعد رفع الملف للمراجعة.','Effective date changed. Upload file again for validation.');}
function lmBDownload(){if(!window.XLSX){showToast(lm3T('مكتبة Excel غير متاحة','Excel library unavailable'),true);return;}const sh=XLSX.utils.aoa_to_sheet([lmBalanceColumns.map((x,i)=>i===0?'الكود ':i===1?'الاسم ':i===2?'تاريخ التعيين ':i===3?'الإدارة ':i===4?'عدد سنوات الخدمة ':i===5?'مدد خارجية ':i===6?'الرصيد عن السنة ':i===7?'الرصيد الافتتاحى ':i===8?'رصيد مستنفذ':'الرصيد الحالى ')]);sh['!cols']=lmBalanceColumns.map(()=>({wch:23}));const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,sh,'Sheet1');XLSX.writeFile(wb,'LactoMisr_Annual_Balance_Update.xlsx');}
async function lmBRead(input){const file=input.files?.[0],st=lmBalanceState;st.ready=false;st.rows=[];st.errors=[];document.getElementById('lm-b-commit').disabled=true;if(!file)return;
 const err=document.getElementById('lm-b-errors'),summary=document.getElementById('lm-b-summary'),preview=document.getElementById('lm-b-preview');err.textContent='';preview.replaceChildren();
 try{if(!portalIsAdmin())throw Error('Admin account required');if(!window.XLSX)throw Error('Excel parser unavailable');if(file.size>12*1024*1024)throw Error('File too large (12 MB max)');const date=new Date().toISOString().slice(0,10);
 const wb=XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:false});const sh=wb.Sheets[wb.SheetNames[0]];const bounded=XLSX.utils.decode_range(sh['!ref']||'A1:J1');bounded.e.r=Math.min(bounded.e.r,3001);bounded.e.c=Math.min(bounded.e.c,9);const grid=XLSX.utils.sheet_to_json(sh,{header:1,raw:true,defval:'',blankrows:false,range:XLSX.utils.encode_range(bounded)});if(!grid.length)throw Error('Empty worksheet');const hdr=grid[0].map(lmBKey);if(hdr.length!==10||hdr.some((h,i)=>h!==lmBKey(lmBalanceColumns[i])))throw Error('Template columns do not match the approved annual balance sheet');
 const rows=grid.slice(1).filter(r=>r.some(v=>String(v??'').trim()!==''));if(!rows.length||rows.length>3000)throw Error('Expected 1–3000 employee rows');
 const snapshot=await db.ref(PORTAL_EMPLOYEE_COLLECTION).once('value');const live=snapshot.val()||{};const seen=new Set();const parsed=[];const errors=[];
 for(let i=0;i<rows.length;i++){const r=rows[i],line=i+2,code=String(r[0]??'').trim(),issues=[];if(!/^\d{1,12}$/.test(code))issues.push('Invalid code');if(seen.has(code))issues.push('Duplicate code');seen.add(code);const emp=live[code];if(!emp)issues.push('Employee not found');
 const hire=lmBDate(r[2]);if(emp&&(!hire||hire!==lmBDate(lmBField(emp,['تاريخ التعيين','date_of_hiring','hireDate']))))issues.push('Hire date mismatch');
 const name=String(r[1]??'').trim();if(emp&&!['اسم الموظف','emp_name _en'].some(k=>lmBKey(name)===lmBKey(lmBField(emp,[k]))))issues.push('Employee name mismatch');
 const dept=String(r[3]??'').trim();if(emp&&!['الإدارة','department'].some(k=>lmBKey(dept)===lmBKey(lmBField(emp,[k]))))issues.push('Department mismatch');
 const opening=lmBNumber(r[7]),used=lmBNumber(r[8]),final=lmBNumber(r[9]);if([opening,used,final].some(x=>!Number.isFinite(x)||x<0))issues.push('Invalid balance');if(Number.isFinite(opening)&&Number.isFinite(used)&&Number.isFinite(final)&&Math.abs(opening-used-final)>0.01)issues.push('Balance formula mismatch');
 const five=emp?.hr_five_percent;if(five?.enabled&&five?.workStatus==='outside'&&final!==0)issues.push('Outside active work: operational balance must be zero');
 const balanceKeys=emp?Object.keys(emp).filter(k=>['رصيد الاجازات','رصيد الإجازات','annual leave balance'].some(a=>lmBKey(a)===lmBKey(k))):[];if(emp&&!balanceKeys.length)issues.push('Employee balance field missing');
 if(issues.length)errors.push(`Row ${line} / ${code||'?'}: ${issues.join('; ')}`);parsed.push({line,code,name,hire,dept,opening,used,final,old:emp?lmBField(emp,['رصيد الاجازات','annual leave balance']):null,keys:balanceKeys,originalValues:Object.fromEntries(balanceKeys.map(k=>[k,emp[k]])),issues});}
 st.rows=parsed;st.errors=errors;st.file=file.name;st.date=date;st.ready=errors.length===0;summary.textContent=`${lmBText('صفوف','Rows')}: ${parsed.length} · ${lmBText('أخطاء','Errors')}: ${errors.length}`;err.textContent=errors.slice(0,60).join('\n');
 const table=document.createElement('table');table.className='hr-feature-table';const header=document.createElement('tr');for(const h of ['Row','Code','Employee','Old balance','New balance','Status']){const th=document.createElement('th');th.textContent=h;header.append(th);}table.append(header);for(const r of parsed.slice(0,100)){const tr=document.createElement('tr');for(const v of [r.line,r.code,r.name,r.old??'—',r.final,r.issues.join('; ')||'✓']){const td=document.createElement('td');td.textContent=v;tr.append(td);}table.append(tr);}preview.replaceChildren(table);document.getElementById('lm-b-commit').disabled=!st.ready;
 }catch(e){err.textContent=e.message;summary.textContent='';}}
async function lmBCommit(){const st=lmBalanceState;if(!st.ready||st.busy||!portalIsAdmin())return;const status=document.getElementById('lm-b-progress');if(!await lmDialog(lmBText(`تأكيد تحديث ${st.rows.length} موظف؟`,`Confirm update for ${st.rows.length} employees?`),true))return;st.busy=true;document.getElementById('lm-b-commit').disabled=true;
 try{const snap=await db.ref(PORTAL_EMPLOYEE_COLLECTION).once('value');const live=snap.val()||{};const updates={},audit=[];
 for(const row of st.rows){const emp=live[row.code];if(!emp)throw Error('Employee removed: '+row.code);if(lmBDate(lmBField(emp,['تاريخ التعيين','date_of_hiring','hireDate']))!==row.hire)throw Error('Hire date changed: '+row.code);if(!['الإدارة','department'].some(k=>lmBKey(row.dept)===lmBKey(lmBField(emp,[k]))))throw Error('Department changed: '+row.code);
 if(!['اسم الموظف','emp_name _en'].some(k=>lmBKey(row.name)===lmBKey(lmBField(emp,[k]))))throw Error('Name changed: '+row.code);
 const keys=Object.keys(emp).filter(k=>['رصيد الاجازات','رصيد الإجازات','annual leave balance'].some(a=>lmBKey(k)===lmBKey(a)));if(keys.length!==row.keys.length||keys.some(k=>!row.keys.includes(k)))throw Error('Balance schema changed: '+row.code);
 if(row.keys.some(k=>String(emp[k]??'')!==String((row.originalValues||{})[k]??'')))throw Error('Balance changed since preview: '+row.code);
 if(emp.hr_five_percent?.enabled&&emp.hr_five_percent?.workStatus==='outside'&&row.final!==0)throw Error('Outside-scope balance not zero: '+row.code);
 for(const key of keys)updates[`${PORTAL_EMPLOYEE_COLLECTION}/${row.code}/${key}`]=row.final;
 audit.push({code:row.code,previous:row.old,newBalance:row.final});}
 const batch=db.ref('hr_imports/leave-balance-updates').push();updates[`hr_imports/leave-balance-updates/${batch.key}`]={filename:st.file,effectiveDate:new Date().toISOString().slice(0,10),createdAt:firebase.database.ServerValue.TIMESTAMP,actorUid:portalAuth.currentUser.uid,records:audit,recordCount:audit.length};
 await db.ref().update(updates);for(const row of st.rows){const emp=allEmployees.find(e=>String(getEmployeeCode(e))===row.code);if(emp)for(const k of row.keys)emp[k]=row.final;}
 st.ready=false;status.textContent=lmBText('تم اعتماد الدفعة بنجاح. حدث الصفحة لمراجعة الأرصدة.','Batch committed. Refresh to review balances.');renderHRFeature('leave-balances');
 }catch(e){status.textContent=lmBText('تم إلغاء الاعتماد دون تحديث: ','Update cancelled: ')+e.message;}finally{st.busy=false;document.getElementById('lm-b-commit')?.setAttribute('disabled','');}}

// Phase 3: bilingual leave reporting and read-only financial estimate.
const lm3State={search:'',dept:[],category:[],balance:'all',settlement:'all',filtered:[]};
function lm3T(ar,en){return currentLang==='ar'?ar:en;}
function lm3Num(v){if(typeof v==='number')return Number.isFinite(v)?v:null;const s=String(v??'').replace(/,/g,'').trim();return s!==''&&Number.isFinite(Number(s))?Number(s):null;}
function lm3Hire(e){return lmBDate(lmBField(e,['تاريخ التعيين','date_of_hiring','hireDate','hire date']));}
function lm15CycleStart(e){
 const hire=lm3Hire(e),year=Number(String(hire||'').slice(0,4));
 if(!Number.isInteger(year)||year<1950||year>2100)return null;
 const override=e?.hr_leave_settlement_cycle?.startYear;
 const n=Number(override);
 return Number.isInteger(n)&&n>=2000&&n<=2100?n:year;
}
/* Phase 19: retirement-age settlement scheduling. Dates use calendar birthdays,
   not potentially stale stored age fields. No Firebase writes are made here. */
function lm19Birth(e){return lm8Date(fahdEmployeeBirth(e));}
function lm19AgeOn(birth,iso){
 if(!birth||!iso)return null;
 const b=lm8Date(birth),d=lm8Date(iso);
 if(!b||!d)return null;
 const [by,bm,bd]=b.split('-').map(Number),[y,m,day]=d.split('-').map(Number);
 const valid=(yy,mm,dd)=>{const dt=new Date(Date.UTC(yy,mm-1,dd));return dt.getUTCFullYear()===yy&&dt.getUTCMonth()===mm-1&&dt.getUTCDate()===dd;};
 if(!valid(by,bm,bd)||!valid(y,m,day))return null;
 return y-by-(m<bm||(m===bm&&day<bd)?1:0);
}
function lm19SixtyYear(e){const birth=lm19Birth(e);return birth?Number(birth.slice(0,4))+60:null;}
function lm19FirstAnnual(e){const y=lm19SixtyYear(e);return Number.isInteger(y)?y+1:null;}
function lm19SettlementYear(e,year){
 const y=Number(year),start=lm15CycleStart(e),first=lm19FirstAnnual(e);
 if(!Number.isInteger(y)||!start)return false;
 if(first!==null&&y>=first)return true;
 return y>=start+3&&(y-start)%3===0;
}
function lm19PreviousBoundary(e,year){
 const start=lm15CycleStart(e),first=lm19FirstAnnual(e);
 if(!start)return null;
 if(first!==null&&year>first)return year-1;
 // Last completed 3-year cycle strictly preceding the new settlement.
 let prev=start;
 while(prev+3<year)prev+=3;
 return Math.min(prev,year-1);
}
function lm15Next(e){
 const start=lm15CycleStart(e);if(!start)return null;
 const now=new Date(),current=now.getFullYear();
 const first=lm19FirstAnnual(e);
 if(first!==null&&current>=first-1){
  const year=Math.max(first,current+1);return `${year}-01-01`;
 }
 let year=start+3;while(year<=current)year+=3;
 if(first!==null&&first<year&&first>current)year=first;
 return `${year}-01-01`;
}
function lm3Next(hire){const m=String(hire||'').match(/^(\d{4})-(\d\d)-(\d\d)$/);if(!m)return null;const y=Number(m[1]);if(y<1950||y>2100)return null;const now=new Date();let year=y+3;while(year<=now.getFullYear() || (year===now.getFullYear()&&now.getMonth()>=0))year+=3;return `${year}-01-01`;}
function lm3Balance(e){const five=e.hr_five_percent||{};if(five.enabled&&five.workStatus==='outside')return 0;const opening=lm3Num(lmBField(e,['رصيد الاجازات','رصيد الإجازات','annual leave balance']));if(opening===null)return null;return Math.round((opening-lmLeaveUsed(String(getEmployeeCode(e))))*100)/100;}
function lm3Category(e){const f=e.hr_five_percent||{};return !f.enabled?'regular':f.workStatus==='outside'?'outside':'working';}
function lm3Salary(e){return lm3Num(lmBField(e,['الراتب الشامل','المرتب الشامل','gross salary','gross_salary','total salary','الشامل','الاجر الشامل','الأجر الشامل','comprehensiveSalary']));}
function lm3Money(v){return v===null?'—':v.toLocaleString(currentLang==='ar'?'ar-EG':'en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+lm3T('ج.م','EGP');}
function lm3Rows(){return (allEmployees||[]).map(e=>({e,code:getEmployeeCode(e),name:getEmployeeName(e),dept:String(getEmployeeDept(e)||'').trim(),category:lm3Category(e),balance:lm3Balance(e),settlement:lm15Next(e)}));}
function lm3Escape(v){return escapeHtml(String(v??''));}
function lm3Select(id,label,options){return `<label class="lm3-filter"><span>${label}</span><select id="${id}" onchange="lm3Apply()"><option value="">${lm3T('الكل','All')}</option>${options.map(([v,t])=>`<option value="${lm3Escape(v)}">${lm3Escape(t)}</option>`).join('')}</select></label>`;}
function lm3UI(){
 const categories=[['regular',lm3T('عادي','Regular')],['working',lm3T('5% يعمل فعليًا','5% Working')],['outside',lm3T('5% خارج النطاق','5% Outside')]];
 const departments=[...new Set(lm3Rows().map(r=>r.dept).filter(x=>x&&x!=='--'))].sort((a,b)=>a.localeCompare(b));
 const defaultYear=new Date().getFullYear()+1;
 return `<section class="hr-panel mt-5" id="lm3-report">
 <div class="lm3-head"><div><h2 class="text-xl font-bold text-sky-300">${lm3T('تقارير أرصدة الإجازات','Leave Balance Reports')}</h2><p class="text-sm text-amber-200">${lm3T('الأرصدة الأساسية بتاريخ 01/10/2026، ولا تشمل حركات لاحقة لم تُسجل بعد.','Opening balances as of 01 Oct 2026; later unrecorded transactions are not included.')}</p></div><div class="lm3-actions"><button type="button" class="portal-ghost-btn" onclick="lm15OpenLegacy()">${lm3T('دورات الموظفين القدام','Legacy cycles')}</button><button type="button" class="portal-ghost-btn" onclick="lm3Export()">${lm3T('تصدير Excel','Export Excel')}</button><button type="button" class="portal-action-btn" onclick="lm3Open()">${lm3T('تقرير التسوية المالية','Financial Settlement Report')}</button></div></div>
 <div class="lm3-filters"><label class="lm3-filter"><span>${lm3T('بحث بالكود أو الاسم','Code or name')}</span><input id="lm3-search" type="search" oninput="lm3Apply()" placeholder="${lm3T('بحث...','Search...')}"></label>
 ${lm3Select('lm3-dept',lm3T('الإدارة','Department'),departments.map(d=>[d,d]))}
 ${lm3Select('lm3-category',lm3T('التصنيف','Category'),categories)}
 ${lm3Select('lm3-balance',lm3T('الرصيد','Balance'),[['positive',lm3T('أكبر من صفر','Above zero')],['zero',lm3T('صفر','Zero')],['missing',lm3T('غير مسجل','Missing')]])}
 <div class="lm3-filter lm5-year-wrap"><span>${lm3T('سنة التسوية (يناير)','Settlement year (January)')}</span><div class="lm5-year-control"><button type="button" class="lm5-step" onclick="lm5Step(-1)" aria-label="${lm3T('السنة السابقة','Previous year')}">−</button><input id="lm3-settlement" type="number" min="2026" max="9999" step="1" value="${defaultYear}" oninput="lm3Apply()" aria-label="${lm3T('سنة التسوية','Settlement year')}"><button type="button" class="lm5-step" onclick="lm5Step(1)" aria-label="${lm3T('السنة التالية','Next year')}">+</button></div><label class="lm5-all"><input id="lm5-all-years" type="checkbox" onchange="lm5ToggleAll()">${lm3T('كل السنوات','All years')}</label></div>
 <button type="button" class="portal-ghost-btn lm3-reset" onclick="lm3Reset()">${lm3T('مسح الفلاتر','Clear filters')}</button></div>
 <p id="lm3-count" class="text-sm text-sky-200 my-3"></p>
 <div class="lm3-table-scroll"><table class="hr-feature-table w-full"><thead><tr>${[lm3T('الكود','Code'),lm3T('الموظف','Employee'),lm3T('الإدارة','Department'),lm3T('الرصيد','Available balance'),lm3T('الرصيد عن السنة','Annual entitlement'),lm3T('المستحق حتى اليوم','Accrued to date'),lm3T('التصنيف','Category'),lm3T('التسوية القادمة','Next settlement')].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody id="lm3-table-body"></tbody></table></div>
 </section>
 <div class="lm3-overlay hidden" id="lm3-modal" role="dialog" aria-modal="true" aria-labelledby="lm3-title"><div class="lm3-dialog"><div class="lm3-head"><h2 id="lm3-title">${lm3T('حاسبة التسوية المالية للإجازات','Leave Settlement Calculator')}</h2><button type="button" class="portal-ghost-btn" onclick="lm3Close()">${lm3T('إغلاق','Close')} ×</button></div><label class="lm3-filter"><span>${lm3T('كود الموظف','Employee code')}</span><input id="lm3-code" type="text" inputmode="numeric" oninput="lm3Calculate()" placeholder="${lm3T('أدخل الكود','Enter code')}"></label><div id="lm3-result" class="lm3-result"></div><p class="text-xs text-amber-200">${lm3T('تقدير للعرض فقط، لا ينفذ تسوية أو يخصم الرصيد. الراتب والرصيد قد يتغيران قبل موعد التسوية.','Read-only estimate. No settlement or balance deduction. Salary and balance may change before settlement.')}</p></div></div>`;
}
/* Phase 10: projected usable balance is distinct from accrued entitlement and opening balance. */
function lm10Balance(r,calc){
 if(!calc.ok)return {display:'—',eligible:null,warning:true};
 if(!calc.eligible){
  const advance=lm10Emergency(r.e);
  return {display:'0',eligible:false,advance,recorded:r.balance};
 }
 return {display:r.balance===null?'—':String(r.balance),eligible:true,recorded:r.balance};
}
function lm10Emergency(e){
 // Only a separately verified leave ledger can establish an exact remaining advance.
 const ledger=e.hr_leave_advance_summary;
 if(ledger&&ledger.verified===true&&Number.isFinite(Number(ledger.approvedDays))&&Number(ledger.approvedDays)>=0){
  return {remaining:Math.max(0,3-Number(ledger.approvedDays)),verified:true};
 }
 return {remaining:3,verified:false};
}
function lm10BalanceHtml(r,calc){
 const state=lm10Balance(r,calc);if(state.eligible!==false)return lm3Escape(state.display);
 const t=lm3T;
 return `<span class="lm10-hover" tabindex="0" role="button" aria-label="${t('تفاصيل الإجازة الطارئة','Emergency leave information')}"><span class="lm10-zero">0 <span aria-hidden="true">ⓘ</span></span><span class="lm10-pop" role="tooltip"><strong>${t('أيام إجازة طارئة: 3 أيام','Emergency leave: 3 days')}</strong><span>${t('يتم خصمها عند إتمام 6 أشهر ونزول الرصيد الفعلي.','They will be deducted once six months are completed and the actual leave balance becomes available.')}</span></span></span>`;
}
function lm3Apply(){
 const q=String(document.getElementById('lm3-search')?.value||'').trim().toLowerCase(),dept=document.getElementById('lm3-dept')?.value||'',cat=document.getElementById('lm3-category')?.value||'',balance=document.getElementById('lm3-balance')?.value||'',settle=document.getElementById('lm3-settlement')?.value||'';
 
 const allYears=!!document.getElementById('lm5-all-years')?.checked;const selectedYear=!allYears&&/^\d{4}$/.test(settle)?Number(settle):null;
 const rows=lm3Rows().filter(r=>(!q||(/^[0-9]+$/.test(q)?String(r.code).trim()===q:[r.name,getField(r.e,'اسم الموظف','emp_name _en')].join(' ').toLocaleLowerCase().includes(q)))&&(!dept||r.dept===dept)&&(!cat||r.category===cat)&&(!balance||(balance==='positive'?Number(lm10Balance(r,lm8LeaveProjection(r.e)).display)>0:balance==='zero'?lm10Balance(r,lm8LeaveProjection(r.e)).display==='0':lm10Balance(r,lm8LeaveProjection(r.e)).display==='—'))&&(allYears||(selectedYear!==null&&r.settlement&&selectedYear>=Number(r.settlement.slice(0,4))&&lm19SettlementYear(r.e,selectedYear))));
 lm3State.filtered=rows.map(r=>({...r,displaySettlement:allYears?r.settlement:`${selectedYear}-01-01`}));
 const names={regular:lm3T('عادي','Regular'),working:lm3T('5% يعمل فعليًا','5% Working'),outside:lm3T('5% خارج النطاق','5% Outside')};
 document.getElementById('lm3-count').textContent=lm3T('عدد النتائج: ','Results: ')+rows.length;
 document.getElementById('lm3-table-body').innerHTML=lm3State.filtered.map(r=>`<tr><td dir="ltr">${lm3Escape(r.code)}</td><td>${lm3Escape(r.name)}</td><td>${lm3Escape(r.dept)}</td><td>${lm10BalanceHtml(r,lm8LeaveProjection(r.e))}</td><td>${lm3Escape(lm8LeaveProjection(r.e).ok?lm8LeaveProjection(r.e).annual:'—')}</td><td>${lm3Escape(lm8LeaveProjection(r.e).ok?lm8LeaveProjection(r.e).accrued:'—')}</td><td>${names[r.category]}</td><td dir="ltr">${r.displaySettlement||'—'}</td></tr>`).join('')||`<tr><td colspan="8">${lm3T('لا توجد نتائج','No matching results')}</td></tr>`;
}
function lm5Step(delta){const el=document.getElementById('lm3-settlement');if(!el)return;const current=Number(el.value)||new Date().getFullYear()+1;el.value=Math.min(9999,Math.max(2026,current+delta));document.getElementById('lm5-all-years').checked=false;lm3Apply();}
function lm5ToggleAll(){document.getElementById('lm3-settlement').disabled=document.getElementById('lm5-all-years').checked;lm3Apply();}
function lm3Reset(){for(const id of ['lm3-search','lm3-dept','lm3-category','lm3-balance'])document.getElementById(id).value='';document.getElementById('lm3-settlement').value=new Date().getFullYear()+1;document.getElementById('lm3-settlement').disabled=false;document.getElementById('lm5-all-years').checked=true;lm3Apply();}
function lm3Export(){if(!window.XLSX){showToast(lm3T('مكتبة Excel غير متاحة','Excel library unavailable'),true);return;}
 const names={regular:lm3T('عادي','Regular'),working:lm3T('5% يعمل فعليًا','5% Working'),outside:lm3T('5% خارج النطاق','5% Outside')};
 const headings=currentLang==='ar'?['الكود','اسم الموظف','الإدارة','الرصيد المتاح','الرصيد عن السنة','المستحق حتى اليوم','التصنيف','تاريخ التسوية القادمة']:['Code','Employee','Department','Available balance','Annual entitlement','Accrued to date','Category','Next settlement'];
 const grid=[headings,...lm3State.filtered.map(r=>[r.code,r.name,r.dept,lm10Balance(r,lm8LeaveProjection(r.e)).display,lm8LeaveProjection(r.e).ok?lm8LeaveProjection(r.e).annual:'',lm8LeaveProjection(r.e).ok?lm8LeaveProjection(r.e).accrued:'',names[r.category],r.displaySettlement||''])];
 const sheet=XLSX.utils.aoa_to_sheet(grid);sheet['!cols']=[{wch:14},{wch:36},{wch:28},{wch:25},{wch:20},{wch:22},{wch:23},{wch:24}];const book=XLSX.utils.book_new();XLSX.utils.book_append_sheet(book,sheet,currentLang==='ar'?'أرصدة الإجازات':'Leave balances');XLSX.writeFile(book,'LactoMisr_Leave_Report_'+new Date().toISOString().slice(0,10)+'.xlsx');}
function lm3Open(){lm12OpenReport();}
function lm3Close(){document.getElementById('lm3-modal')?.classList.add('hidden');}
function lm3Calculate(){const code=String(document.getElementById('lm3-code')?.value||'').trim(),target=document.getElementById('lm3-result');if(!target)return;if(!code){target.textContent=lm3T('أدخل كود الموظف لعرض بياناته.','Enter an employee code.');return;}const emp=(allEmployees||[]).find(e=>getEmployeeCode(e)===code);if(!emp){target.textContent=lm3T('كود الموظف غير موجود.','Employee code not found.');return;}
 const balance=lm3Balance(emp),salary=lm3Salary(emp),date=lm15Next(emp),day=salary===null?null:salary/30,total=salary===null||balance===null?null:day*balance;
 const line=(label,value)=>`<div class="lm3-result-line"><span>${label}</span><strong>${lm3Escape(value)}</strong></div>`;
 target.innerHTML=line(lm3T('الموظف','Employee'),getEmployeeName(emp))+line(lm3T('الرصيد المتبقي','Remaining balance'),balance===null?'—':balance+' '+lm3T('يوم','days'))+line(lm3T('الراتب الشامل','Gross salary'),lm3Money(salary))+line(lm3T('الأجر اليومي (÷ 30)','Daily rate (÷ 30)'),lm3Money(day))+line(lm3T('التسوية القادمة','Next settlement'),date||lm3T('تاريخ التعيين يحتاج مراجعة','Hire date needs review'))+`<div class="lm3-result-total">${lm3T('المقابل النقدي التقديري','Estimated cash settlement')}<strong>${lm3Escape(lm3Money(total))}</strong></div>`+(salary===null?`<p class="text-amber-200">${lm3T('حقل الراتب الشامل غير موجود أو غير رقمي؛ لا يمكن حساب مبلغ موثوق.','Gross salary missing or invalid; amount cannot be calculated reliably.')}</p>`:'');
}
(function(){const prior=renderHRFeature;renderHRFeature=function(page){if(page!=='leave-balances')return prior(page);const root=document.getElementById('hr-leave-balances-view');if(!root)return;root.innerHTML=hrFeatureShell(hrText('أرصدة الإجازات','Leave balances'),hrText('الحساب التلقائي مستقل عن أداة التحديث الجماعي','Automatic accrual is separate from mass balance update'),lmBHtml())+lm3UI();document.getElementById('lm5-all-years').checked=true;document.getElementById('lm3-settlement').disabled=true;lm3Apply();};})();


/* LM Leave Phase 7: business rules engine (no automatic Firebase writes).
   HR-approved: 6-month eligibility gate, monthly pro-rata in first calendar
   year, and emergency leave as an advance against future entitlement.
   Exceptional advances above 3 days require a server-verified admin approval.
   This engine is intentionally NOT a permission enforcement mechanism. */
const LM_LEAVE_ENGINE_V2 = Object.freeze({
  parseDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const d = new Date(value + 'T12:00:00Z');
    return Number.isNaN(d.getTime()) || d.toISOString().slice(0,10) !== value ? null : d;
  },
  years(start, end) {
    let n = end.getUTCFullYear() - start.getUTCFullYear();
    if (end.getUTCMonth() < start.getUTCMonth() ||
        (end.getUTCMonth() === start.getUTCMonth() && end.getUTCDate() < start.getUTCDate())) n--;
    return n;
  },
  completedMonths(start, end) {
    let n = (end.getUTCFullYear()-start.getUTCFullYear())*12+
            end.getUTCMonth()-start.getUTCMonth();
    if(end.getUTCDate()<start.getUTCDate()) n--;
    return Math.max(0,n);
  },
  /* HR example treats April through October as seven months. Month-counting
     convention for partial months must be signed off before production accrual. */
  calendarMonthsInclusive(start,end) {
    return (end.getUTCFullYear()-start.getUTCFullYear())*12+
           end.getUTCMonth()-start.getUTCMonth()+1;
  },
  calculate({hireDate,birthDate,asOfDate,insuredYears,
             disabilityEnabled=false,workStatus='working',
             advanceUsed=0,advanceApproved=0}) {
    const hire=this.parseDate(hireDate),birth=this.parseDate(birthDate),
          asOf=this.parseDate(asOfDate);
    if(!hire||!birth||!asOf||hire>asOf||birth>hire)
      return {ok:false,reason:'INVALID_DATES'};
    const insured=insuredYears==null||insuredYears===''?null:Number(insuredYears);
    const used=Number(advanceUsed),approved=Number(advanceApproved);
    if((insured!==null&&(!Number.isFinite(insured)||insured<0))||
       !Number.isFinite(used)||used<0||!Number.isFinite(approved)||approved<0)
      return {ok:false,reason:'INVALID_VALUES'};
    const serviceYears=this.years(hire,asOf),age=this.years(birth,asOf);
    const eligible=this.completedMonths(hire,asOf)>=6;
    const outside=disabilityEnabled&&workStatus==='outside';
    const annual=outside?0:disabilityEnabled&&workStatus==='working'?45:
      age>=50||serviceYears>=10||(insured!==null&&insured>=10)?30:serviceYears<1?15:21;
    const monthsInYear=hire.getUTCFullYear()===asOf.getUTCFullYear()
      ?Math.min(12,this.calendarMonthsInclusive(hire,asOf)):12;
    const accrued=Math.round((annual*monthsInYear/12)*100)/100;
    const remaining=Math.round((accrued-used)*100)/100;
    const normalAdvanceLimit=3;
    return {ok:true,eligible,annual,monthsInYear,accrued,advanceUsed:used,
      advanceApproved:approved,remaining,normalAdvanceLimit,
      extraAdvanceRequiresAdminApproval:true,
      availableStandardAdvance:eligible?0:Math.max(0,normalAdvanceLimit-used),
      provisional:insured===null,serviceYears,age,
      note:'Pure calculation only. No leave approval, entitlement posting or Firebase write.'};
  }
});


/* Phase 8: read-only appraisal concept, no evaluation data invented or written.
   Leave projections are display-only and never overwrite approved opening balances. */
function lm8Date(value){
 if(typeof value==='number' && value>1000 && value<100000){
  const d=new Date(Date.UTC(1899,11,30)+Math.floor(value)*86400000);
  return Number.isNaN(d.getTime())?null:d.toISOString().slice(0,10);
 }
 if(value instanceof Date && !Number.isNaN(value.getTime()))return value.toISOString().slice(0,10);
 const s=String(value??'').trim();
 if(/^\d{4}-\d{1,2}-\d{1,2}$/.test(s)){const [y,m,d]=s.split('-');return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;}
 const m=s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
 return m?`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`:null;
}
function lm8Value(e,keys){return lmBField(e,keys);}
function lm8LeaveProjection(e){
 const hireDate=lm8Date(lm8Value(e,['تاريخ التعيين','date_of_hiring','hireDate','hire date']));
 const birthDate=lm8Date(fahdEmployeeBirth(e));
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));const asOfDate=`${p.year}-${p.month}-${p.day}`;
 const five=e.hr_five_percent;
 const disabilityEnabled=!!(five && typeof five==='object' && five.enabled);
 const workStatus=disabilityEnabled?five.workStatus:'working';
 const insuredYears=lm8Value(e,['insuredYears','insuranceYears','سنوات التأمين','مدة الاشتراك التأميني']);
 if(!hireDate||!birthDate)return {ok:false,reason:'MISSING_DATES'};
 return LM_LEAVE_ENGINE_V2.calculate({hireDate,birthDate,asOfDate,insuredYears,disabilityEnabled,workStatus});
}
function lm8Format(n){return n==null?'—':String(n);}
function lm8Appraisal(){
 const target=document.getElementById('hr-appraisal-view');if(!target)return;
 const t=hrText;
 target.innerHTML=`<section class="hr-panel"><h1 class="text-2xl font-bold text-sky-300 mb-2">${t('إدارة تقييم الأداء','Appraisal Management')}</h1><p class="text-sm text-amber-200 mb-5">${t('تصور تشغيلي للمراجعة — لا توجد درجات أو تقييمات افتراضية، ولا يتم الحفظ في البورتال قبل اعتماد نموذج التقييم والصلاحيات.','Design preview only — no invented scores and no database writes before criteria and permissions are approved.')}</p>
 <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
 ${hrCard(t('الموظفون المسجلون','Employees'),String((allEmployees||[]).length),t('من بيانات الموظفين الفعلية','From actual employee records'))}
 ${hrCard(t('دورات التقييم المعتمدة','Approved cycles'),'—',t('لم يتم ربط سجلات التقييم','No appraisal records connected'))}
 ${hrCard(t('التقييمات المكتملة','Completed reviews'),'—',t('لم يتم ربط سجلات التقييم','No appraisal records connected'))}</div>
 <h2 class="font-bold text-sky-300 mb-3">${t('التصور المقترح لدورة التقييم','Proposed appraisal workflow')}</h2>
 <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">${[
 [t('1. إعداد الدورة','1. Cycle setup'),t('المدة، الإدارة، معايير القياس والأوزان','Period, department, criteria and weights')],
 [t('2. تقييم المدير','2. Manager review'),t('أهداف قابلة للقياس مع أدلة الأداء','Measurable goals and supporting evidence')],
 [t('3. مراجعة الموارد البشرية','3. HR calibration'),t('مراجعة الاتساق والملاحظات والتظلمات','Consistency, notes and appeals')],
 [t('4. الاعتماد والخطة','4. Approval & plan'),t('اعتماد النتيجة وخطة التطوير','Final approval and development plan')]
 ].map(x=>`<div class="rounded-xl border border-slate-600/50 p-4"><strong class="text-sky-200">${x[0]}</strong><p class="text-sm text-slate-300 mt-2">${x[1]}</p></div>`).join('')}</div>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
 <label class="text-sm">${t('بحث بكود الموظف أو اسمه','Search employee code or name')}<input id="lm8-appraisal-search" class="hr-feature-input mt-2 w-full" type="search" oninput="lm8AppraisalFilter()" placeholder="${t('بحث...','Search...')}"></label>
 <label class="text-sm">${t('فلتر الإدارة','Department filter')}<select id="lm8-appraisal-dept" class="hr-feature-input mt-2 w-full" onchange="lm8AppraisalFilter()"><option value="">${t('كل الإدارات','All departments')}</option>${[...new Set((allEmployees||[]).map(e=>String(lmBilingualDepartment(e)).trim()).filter(Boolean))].sort().map(d=>`<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('')}</select></label></div>
 <div style="overflow:auto;max-height:460px"><table class="hr-feature-table w-full"><thead><tr>${[t('الكود','Code'),t('الموظف','Employee'),t('الإدارة','Department'),t('حالة التقييم','Appraisal status')].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody id="lm8-appraisal-rows">${(allEmployees||[]).map(e=>{const c=String(getEmployeeCode(e)),n=String(getEmployeeName(e)),d=String(lmBilingualDepartment(e));return `<tr data-code="${escapeHtml(c)}" data-name="${escapeHtml(lmBilingualSearch(c,e))}" data-dept="${escapeHtml(d)}"><td>${escapeHtml(c)}</td><td>${escapeHtml(n)}</td><td>${escapeHtml(d)}</td><td class="text-slate-400">${t('لم تبدأ دورة تقييم','No appraisal cycle started')}</td></tr>`;}).join('')}</tbody></table></div>
 <p id="lm8-appraisal-count" class="mt-3 text-sm text-slate-300"></p>
 <div class="mt-5 rounded-xl border border-slate-600/50 p-4"><strong>${t('معايير مقترحة للنقاش','Suggested criteria for discussion')}</strong><p class="mt-2 text-sm text-slate-300">${t('تحقيق الأهداف، جودة العمل، الالتزام، العمل الجماعي، المبادرة، والتطوير. الأوزان والتقييم النهائي لم تُعتمد بعد، ولا تُربط الرواتب أو الجزاءات آليًا بنتيجة التقييم.','Goals, quality, reliability, teamwork, initiative, and development. Weights are not approved; no automatic salary or disciplinary decisions.')}</p></div></section>`;
 lm8AppraisalFilter();
}
function lm8AppraisalFilter(){
 const q=String(document.getElementById('lm8-appraisal-search')?.value||'').trim().toLowerCase();
 const d=document.getElementById('lm8-appraisal-dept')?.value||'';
 let shown=0;
 document.querySelectorAll('#lm8-appraisal-rows tr').forEach(r=>{
  const ok=(!q||( /^\d+$/.test(q)?r.dataset.code===q:r.dataset.name.includes(q)))&&(!d||r.dataset.dept===d);
  r.hidden=!ok;if(ok)shown++;
 });
 const count=document.getElementById('lm8-appraisal-count');if(count)count.textContent=hrText('عدد النتائج: ','Results: ')+shown;
}



/* Phase 11: render the hover help as a body-level overlay, outside the clipped table. */
(function(){
 let floating=null,anchor=null;
 function close(){if(floating){floating.remove();floating=null;}anchor=null;}
 function position(){
  if(!floating||!anchor||!anchor.isConnected){close();return;}
  const a=anchor.getBoundingClientRect(),width=Math.min(260,window.innerWidth-24);
  floating.style.width=width+'px';
  const height=floating.getBoundingClientRect().height;
  // Prefer directly above the balance cell; below only when the row is near the top.
  const above=a.top-height-8,below=a.bottom+8;
  const top=above>=8?above:(below+height<=window.innerHeight-8?below:Math.max(8,above));
  floating.style.setProperty('top',Math.round(top)+'px','important');
  const left=a.left+a.width/2-width/2;
  floating.style.setProperty('left',Math.round(Math.max(12,Math.min(left,window.innerWidth-width-12)))+'px','important');
 }
 function show(el){
  if(anchor===el&&floating){position();return;}
  close();const inner=el.querySelector('.lm10-pop');if(!inner)return;
  anchor=el;floating=inner.cloneNode(true);
  floating.classList.add('lm11-floating-pop');floating.setAttribute('dir',getComputedStyle(el).direction);
  document.body.appendChild(floating);position();
 }
 document.addEventListener('mouseover',e=>{const el=e.target.closest?.('.lm10-hover');if(el)show(el);else if(anchor&&!anchor.matches(':focus-within'))close();},true);
 document.addEventListener('mouseout',e=>{if(anchor&&anchor.contains(e.target)&&(!e.relatedTarget||!anchor.contains(e.relatedTarget))&&!anchor.matches(':focus-within'))close();},true);
 document.addEventListener('focusin',e=>{const el=e.target.closest?.('.lm10-hover');if(el)show(el);},true);
 document.addEventListener('focusout',e=>{if(anchor&&anchor.contains(e.target))requestAnimationFrame(()=>{if(anchor&&!anchor.matches(':focus-within')&&!anchor.matches(':hover'))close();});},true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close();},true);
 window.addEventListener('scroll',()=>{if(floating)position();},true);
 window.addEventListener('resize',()=>{if(floating)position();});
 const observer=new MutationObserver(()=>{if(anchor&&!anchor.isConnected)close();});
 observer.observe(document.body,{childList:true,subtree:true});
})();

/* Phase 13 — Leave settlement rules: read-only, no ledger or salary writes.
   The year-of-hire is cycle year 1; the partial first year and 15-day use
   benchmark are both prorated by calendar months (hire month included).
   Exception increases require verified, non-duplicated business-need refusals.
   Missing approval dates or leave ledgers are not silently inferred. */
const LM13=Object.freeze({
 date(v){return lm8Date(v);},
 number(v){const n=lm3Num(v);return n!==null&&n>=0?n:null;},
 yearMonths(hire,year){const hy=Number(hire.slice(0,4));return year<hy?0:year===hy?13-Number(hire.slice(5,7)):12;},
 dateAge(birth,year){if(!birth)return null;return year-Number(birth.slice(0,4))-(('01-01')<birth.slice(5)?1:0);},
 annual(e,hire,year){
  const f=e.hr_five_percent||{};
  if(f.enabled&&f.workStatus==='outside')return {days:0,verified:true,reason:'outside'};
  if(f.enabled&&f.workStatus==='working')return {days:45,verified:true,reason:'disability'};
  const birth=this.date(fahdEmployeeBirth(e));
  if(!birth)return {days:null,verified:false,reason:'birth missing'};
  if(this.dateAge(birth,year)>=50)return {days:30,verified:true,reason:'age'};
  // Historical in-company service: use hire date, not a current 'years of service' field.
  // Once 10 full years are completed, the 30-day entitlement applies prospectively.
  const anniversaryYear=Number(hire.slice(0,4))+10;
  const anniversaryMonth=Number(hire.slice(5,7));
  if(year>anniversaryYear || (year===anniversaryYear && anniversaryMonth===1))
   return {days:30,verified:true,reason:'company-tenure'};
  if(year===anniversaryYear)
   return {days:21,verified:true,reason:'company-tenure-transition',splitMonth:anniversaryMonth};
  const insurance=this.number(lmBField(e,['insuredYears','insuranceYears','سنوات التأمين','مدة الاشتراك التأميني']));
  const approval=this.date(lmBField(e,['insuranceApprovalDate','insuredTenureApprovalDate','تاريخ اعتماد المدة التأمينية']));
  // Approval date is mandatory for a historical entitlement increase.
  if(insurance!==null&&insurance>=10){
   if(!approval)return {days:null,verified:false,reason:'insurance approval date missing'};
   if(approval.slice(0,4)<String(year))return {days:30,verified:true,reason:'insured'};
   if(approval.slice(0,4)===String(year))return {days:null,verified:false,reason:'midyear insurance approval: monthly split required'};
  }
  return {days:year===Number(hire.slice(0,4))?15:21,verified:true,reason:'standard'};
 },
 cap(e,settlementYear){
  const hire=this.date(lm3Hire(e)),y=Number(settlementYear);
  if(!hire||!lm19SettlementYear(e,y))return {ok:false,reason:'Settlement year / hire date requires review'};
  const from=lm19PreviousBoundary(e,y);if(from===null)return {ok:false,reason:'Settlement cycle start missing'};
  const rows=[];let entitlement=0,benchmark=0;
  for(let yr=from;yr<y;yr++){
   const months=this.yearMonths(hire,yr),a=this.annual(e,hire,yr);
   if(!a.verified)return {ok:false,reason:a.reason};
   const earned=Math.round((a.splitMonth ? (21*(a.splitMonth-1)+30*(13-a.splitMonth))/12 : a.days*months/12)*10000)/10000;
   const minimum=Math.min(earned,Math.round(15*months/12*10000)/10000);
   rows.push({year:yr,months,annual:a.days,earned,minimum});entitlement+=earned;benchmark+=minimum;
  }
  const base=Math.max(0,Math.round((entitlement-benchmark)*10000)/10000);
  // Only verified business-need refusals in a dedicated record may increase the cap.
  const ledger=e.hr_leave_business_refusals;
  let exception=0,verified=true;
  if(Array.isArray(ledger)){
   const seen=new Set();
   for(const x of ledger){
    if(!x||x.verified!==true||x.reason!=='BUSINESS_NEED'||!x.requestId||!x.rejectedByUid||!x.rejectedAt||!Number.isFinite(Number(x.eligibleDays))||Number(x.eligibleDays)<0){verified=false;continue;}
    if(seen.has(x.requestId))continue;seen.add(x.requestId);
    const yr=Number(String(x.rejectedAt).slice(0,4));if(yr>=from&&yr<y)exception+=Number(x.eligibleDays);
   }
  }else if(ledger!=null)verified=false;
  exception=Math.round(exception*10000)/10000;
  return {ok:true,rows,entitlement,benchmark,base,exception,exceptionVerified:verified,cap:base+exception};
 }
});
let lm12ReportRows=[];
function lm12OpenReport(){
 const t=lm3T,esc=lm3Escape,allYears=!!document.getElementById('lm5-all-years')?.checked;
 const requestedYear=Number(document.getElementById('lm3-settlement')?.value||0);
 lm12ReportRows=(lm3State.filtered||[]).map(r=>{
  const salary=lm3Salary(r.e),balance=lm3Balance(r.e),year=allYears?Number((r.settlement||'').slice(0,4)):requestedYear;
  const retirement=lm19FirstAnnual(r.e)!==null&&year>=lm19FirstAnnual(r.e);
  const ended=lm23IsArchived(r.e)&&r.e.hr_service_lifecycle?.endDate&&year>=Number(r.e.hr_service_lifecycle.endDate.slice(0,4));
  const full=retirement||ended;
  const baseRule=full?{ok:true,entitlement:null,benchmark:0,base:null,exception:0,exceptionVerified:true,cap:null}:LM13.cap(r.e,year);
  const rule={...baseRule,retirement,ended,cutoff:ended?r.e.hr_service_lifecycle.endDate:retirement?lm23SixtyDate(r.e):null};
  const archivedSnapshot=ended?r.e.hr_leave_end_service_snapshot:null;
  const effectiveBalance=ended&&archivedSnapshot&&archivedSnapshot.remainingDays!==null?Number(archivedSnapshot.remainingDays):balance;
  const days=rule.ok&&effectiveBalance!==null?(full?effectiveBalance:Math.min(effectiveBalance,rule.cap)):null;
  const valid=rule.ok&&rule.exceptionVerified&&salary!==null&&salary>=0&&balance!==null&&balance>=0;
  // Retirement/end-service full balances are only estimates until a dated leave ledger is approved.
  return {...r,year,rule,salary,balance:effectiveBalance,days,daily:salary===null?null:salary/30,total:valid?(salary/30)*days:null,valid};
 });
 const valid=lm12ReportRows.filter(r=>r.valid),sumDays=valid.reduce((n,r)=>n+r.days,0),sumMoney=valid.reduce((n,r)=>n+r.total,0);
 document.getElementById('lm12-settlement-report')?.remove();
 const overlay=document.createElement('div');overlay.id='lm12-settlement-report';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
 const cols=[t('الكود','Code'),t('الموظف','Employee'),t('الإدارة','Department'),t('سنة التسوية','Settlement year'),t('الرصيد المسجل','Recorded balance'),t('استحقاق الدورة','Cycle entitlement'),t('استهلاك مرجعي','Use benchmark'),t('الحد الأساسي','Base cap'),t('استثناء حاجة العمل','Business exception'),t('الأيام القابلة للتسوية','Settlement days'),t('الراتب الشامل','Gross salary'),t('الأجر اليومي','Daily wage'),t('القيمة المالية','Amount'),t('الحالة','Status')];
 const status=r=>r.valid?(r.rule.ended?t('إنهاء خدمة — حساب تجريبي تلقائي دون اعتماد','End of service — automatic test calculation, no approval'):t('حساب مبدئي — يحتاج اعتماد','Provisional — approval required')):t('يحتاج مراجعة: ','Review: ')+(r.rule.ok?(r.rule.exceptionVerified?t('الراتب أو الرصيد ناقص','Missing salary/balance'):t('سجل رفض غير معتمد','Unverified refusal')):r.rule.reason);
 overlay.innerHTML=`<div class="lm12-sheet"><header class="lm12-head"><div><h2>${t('تقرير التسوية المالية للإجازات','Leave Financial Settlement Report')}</h2><p>${t('دورة ثلاثية قبل الستين وسنوية من يناير التالي لبلوغ الستين، مع حد التسوية والاستثناء الموثق.','Three-year cycles before age 60, annual January settlements thereafter, with caps and verified exceptions.')}</p></div><div class="lm12-actions"><button type="button" onclick="lm12Export()">${t('تصدير Excel','Export Excel')}</button><button type="button" onclick="lm12Print()">${t('طباعة','Print')}</button><button type="button" onclick="lm12Close()">${t('العودة للأرصدة','Back to balances')} ×</button></div></header>
 <div class="lm12-summary"><div>${t('الموظفون','Employees')}<strong>${lm12ReportRows.length}</strong></div><div>${t('أيام التسوية المبدئية','Provisional days')}<strong>${sumDays.toLocaleString()}</strong></div><div>${t('القيمة المبدئية','Provisional amount')}<strong>${lm3Money(sumMoney)}</strong></div><div>${t('تحتاج مراجعة','Needs review')}<strong>${lm12ReportRows.length-valid.length}</strong></div></div>
 <p class="lm12-note">${t('تنبيه: الأرصدة الحالية تعكس البيانات المسجلة ولا تمثل بالضرورة رصيد يناير التاريخي. لا يتم الصرف أو تصفير الأرصدة قبل التحقق من حركة الإجازات والاعتماد. الموافقات والرفض من ESS لم يتم ربطها بعد.','Important: current recorded balances are not necessarily historical January balances. No payout or reset without a verified leave ledger and approval. ESS approvals/refusals are not yet connected.')}</p>
 <div class="lm12-scroll"><table><thead><tr>${cols.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${lm12ReportRows.map(r=>`<tr><td>${esc(r.code)}</td><td>${esc(r.name)}</td><td>${esc(r.dept)}</td><td>${r.year||'—'}</td><td>${r.balance??'—'}</td><td>${r.rule.ok?r.rule.entitlement:'—'}</td><td>${r.rule.ok?r.rule.benchmark:'—'}</td><td>${r.rule.ok?r.rule.base:'—'}</td><td>${r.rule.ok?r.rule.exception:'—'}</td><td>${r.days??'—'}</td><td>${lm3Money(r.salary)}</td><td>${lm3Money(r.daily)}</td><td>${lm3Money(r.total)}</td><td>${esc(status(r))}</td></tr>`).join('')||`<tr><td colspan="14">${t('لا توجد نتائج','No results')}</td></tr>`}</tbody><tfoot><tr><td colspan="9">${t('إجمالي السجلات القابلة للحساب','Total calculable records')}</td><td>${sumDays}</td><td colspan="2"></td><td>${lm3Money(sumMoney)}</td><td>${valid.length}/${lm12ReportRows.length}</td></tr></tfoot></table></div></div>`;
 document.body.appendChild(overlay);document.body.classList.add('lm12-open');
}
function lm12Close(){document.getElementById('lm12-settlement-report')?.remove();document.body.classList.remove('lm12-open');}
function lm12Export(){
 if(!window.XLSX){showToast(lm3T('مكتبة Excel غير متاحة','Excel library unavailable'),true);return;}
 const t=lm3T;
 const headings=[t('الكود','Code'),t('الموظف','Employee'),t('الإدارة','Department'),t('سنة التسوية','Settlement year'),t('الرصيد المسجل','Recorded balance'),t('استحقاق الدورة','Cycle entitlement'),t('الاستهلاك المرجعي','Use benchmark'),t('الحد الأساسي','Base cap'),t('الاستثناء','Exception'),t('أيام التسوية','Settlement days'),t('الراتب الشامل','Gross salary'),t('الأجر اليومي','Daily wage'),t('القيمة المالية','Amount'),t('الحالة','Status')];
 const data=[headings,...lm12ReportRows.map(r=>[r.code,r.name,r.dept,r.year||'',r.balance??'',r.rule.ok?r.rule.entitlement:'',r.rule.ok?r.rule.benchmark:'',r.rule.ok?r.rule.base:'',r.rule.ok?r.rule.exception:'',r.days??'',r.salary??'',r.daily??'',r.total??'',r.valid?t('مبدئي','Provisional'):t('مراجعة','Review')])];
 const valid=lm12ReportRows.filter(r=>r.valid);
 data.push([t('الإجمالي','Total'),'','','','','','','','',valid.reduce((n,r)=>n+r.days,0),'','',valid.reduce((n,r)=>n+r.total,0),'']);
 const ws=XLSX.utils.aoa_to_sheet(data);ws['!cols']=headings.map((_,i)=>({wch:i===1?35:i===2?30:21}));
 const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Leave Settlement');
 XLSX.writeFile(wb,'LactoMisr_Leave_Settlement_'+new Date().toISOString().slice(0,10)+'.xlsx');
}
function lm12Print(){window.print();}


/* Phase 15: legacy settlement-cycle anchors, independent from original hire dates. */
function lm15LegacyEmployees(){return (allEmployees||[]).filter(e=>{const y=Number(String(lm3Hire(e)||'').slice(0,4));return y>=1950&&y<=2100;}).sort((a,b)=>String(getEmployeeCode(a)).localeCompare(String(getEmployeeCode(b)),undefined,{numeric:true}));}
function lm15OpenLegacy(){
 const t=lm3T,esc=lm3Escape;
 document.getElementById('lm15-legacy-overlay')?.remove();
 const legacy=lm15LegacyEmployees();
 const root=document.createElement('div');root.id='lm15-legacy-overlay';root.className='lm15-legacy-overlay';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');
 root.innerHTML=`<div class="lm15-legacy-sheet"><header class="lm15-legacy-head"><div><h2>${t('بداية دورات التسوية المعتمدة','Approved employee settlement cycles')}</h2><p>${t('تاريخ التعيين ثابت لحساب الأقدمية. السنة المخصصة تغيّر جدول التسوية فقط، ولا تعيد حساب الأرصدة الافتتاحية أو التسويات السابقة.','Hire date remains unchanged for tenure. The override only changes the settlement schedule; opening balances and past settlements are untouched.')}</p></div><button type="button" class="portal-ghost-btn" onclick="lm15CloseLegacy()">${t('إغلاق','Close')} ×</button></header><label class="lm15-legacy-search">${t('بحث بالكود أو الاسم','Search by code or name')} <input id="lm15-legacy-search" type="search" oninput="lm15FilterLegacy()" placeholder="${t('بحث','Search')}"></label><div class="lm15-legacy-scroll"><table class="hr-feature-table"><thead><tr>${[t('الكود','Code'),t('الموظف','Employee'),t('تاريخ التعيين','Hire date'),t('بداية الدورة المعتمدة','Approved cycle start'),t('التسوية القادمة','Next settlement'),t('الإجراء','Action')].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${legacy.map(e=>{const code=String(getEmployeeCode(e)),hire=lm3Hire(e),saved=e.hr_leave_settlement_cycle?.startYear;return `<tr data-search="${esc((code+' '+getEmployeeName(e)).toLowerCase())}"><td>${esc(code)}</td><td>${esc(getEmployeeName(e))}</td><td dir="ltr">${esc(hire)}</td><td><label class="lm16-auto-label"><input type="checkbox" id="lm16-auto-${esc(code)}" ${saved==null?'checked':''} onchange="lm16ToggleYear('${esc(code)}')"> ${t('من تاريخ التعيين','From hire date')}</label><select id="lm15-year-${esc(code)}" ${saved==null?'disabled':''}>${Array.from({length:101},(_,i)=>2000+i).map(y=>`<option value="${y}" ${Number(saved)===y?'selected':''}>${y}</option>`).join('')}</select></td><td dir="ltr">${esc(lm15Next(e)||'—')}</td><td><button class="portal-ghost-btn" type="button" onclick="lm15SaveLegacy('${esc(code)}')">${t('حفظ','Save')}</button></td></tr>`;}).join('')}</tbody></table></div><p class="lm15-legacy-status" id="lm15-legacy-status">${t('التغيير يتطلب صلاحية المسؤول، ويُسجَّل في سجل التدقيق.','Administrator authorization is required; every change is audited.')}</p></div>`;
 document.body.appendChild(root);
}
function lm16ToggleYear(code){const cb=document.getElementById('lm16-auto-'+code),sel=document.getElementById('lm15-year-'+code);if(sel&&cb)sel.disabled=cb.checked;}
function lm15FilterLegacy(){const q=String(document.getElementById('lm15-legacy-search')?.value||'').trim().toLowerCase();document.querySelectorAll('#lm15-legacy-overlay tbody tr').forEach(tr=>tr.hidden=!tr.dataset.search.includes(q));}
function lm15CloseLegacy(){document.getElementById('lm15-legacy-overlay')?.remove();}
async function lm15SaveLegacy(code){
 const t=lm3T,el=document.getElementById('lm15-legacy-status');if(!el)return;
 if(!portalIsAdmin()||!portalAuth.currentUser){el.textContent=t('لا تملك صلاحية الاعتماد.','Administrator permission required.');return;}
 const e=(allEmployees||[]).find(x=>String(getEmployeeCode(x))===String(code));
 if(!e){el.textContent=t('الموظف غير موجود.','Employee not found.');return;}
 const select=document.getElementById('lm15-year-'+code);if(!select)return;
 const auto=document.getElementById('lm16-auto-'+code)?.checked;
 const year=auto?null:Number(select.value);
 const hireYear=Number(String(lm3Hire(e)||'').slice(0,4));
 if(year!==null&&(!Number.isInteger(year)||year<2000||year>2100)){el.textContent=t('سنة غير صالحة.','Invalid cycle year.');return;}
 const prev=e.hr_leave_settlement_cycle?.startYear??null;
 if(Number(prev||0)===Number(year||0)){el.textContent=t('لا يوجد تغيير للحفظ.','No changes to save.');return;}
 if(!await lmDialog(t('تأكيد تعديل بداية دورة التسوية للموظف '+code+'؟','Confirm settlement cycle change for employee '+code+'?'),true))return;
 el.textContent=t('جارٍ الحفظ...','Saving...');
 try{
  const actor=portalAuth.currentUser.uid,base=e._firebasePath||`${PORTAL_EMPLOYEE_COLLECTION}/${code}`;
  if(!base.startsWith(PORTAL_EMPLOYEE_COLLECTION+'/'))throw Error('Invalid employee path');
  const auditRef=db.ref('hr_imports/leave-cycle-audit').push();
  const updates={};
  updates[base+'/hr_leave_settlement_cycle']=year===null?null:{startYear:year,approvedByUid:actor,approvedAt:firebase.database.ServerValue.TIMESTAMP,source:'FINANCE_LEGACY_RECONCILIATION'};
  updates['hr_imports/leave-cycle-audit/'+auditRef.key]={employeeCode:code,hireDate:lm3Hire(e),oldStartYear:prev,newStartYear:year,actorUid:actor,createdAt:firebase.database.ServerValue.TIMESTAMP,reason:'FINANCE_LEGACY_RECONCILIATION'};
  await db.ref().update(updates);
  e.hr_leave_settlement_cycle=year===null?null:{startYear:year,approvedByUid:actor,source:'FINANCE_LEGACY_RECONCILIATION'};
  el.textContent=t('تم الحفظ وتوثيق العملية.','Saved and audited.');lm15OpenLegacy();lm3Apply();
 }catch(err){el.textContent=t('تعذر الحفظ: ','Save failed: ')+err.message;}
}




/* Phase 24: bilingual status switch, reversible employee archive, verified date controls. */
const LM23_REASONS={resignation:['استقالة','Resignation'],retirement:['بلوغ سن التقاعد','Retirement'],abandonment:['انقطاع عن العمل','Work abandonment'],dismissal:['فصل','Dismissal'],contract_expiry:['انتهاء العقد دون تجديد','Contract expired without renewal']};
function lm22Text(ar,en){return currentLang==='en'?en:ar;}
function lm22Lifecycle(e){const v=e?.hr_service_lifecycle;return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}
function lm23Now(){const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const x=Object.fromEntries(p.map(z=>[z.type,z.value]));return `${x.year}-${x.month}-${x.day}`;}
function lm23SixtyDate(e){const b=lm19Birth(e);return b?`${Number(b.slice(0,4))+60}${b.slice(4)}`:null;}
function lm23IsArchived(e){return lm22Lifecycle(e).status==='ended';}
function lm23AlertNeeded(e){const x=lm22Lifecycle(e),d=lm23SixtyDate(e);return Boolean(d&&d<=lm23Now()&&!lm23IsArchived(e)&&!x.retirementDecision);}
function lm24El(tag,cls,txt){const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el;}
function lm22RenderLifecycle(emp){
 const root=document.getElementById('fahd1-native');if(!root)return;
 let panel=document.getElementById('lm22-service-panel');if(!panel){panel=lm24El('section','lm24-panel');panel.id='lm22-service-panel';root.append(panel);}
 panel.replaceChildren();panel.dir=currentLang==='ar'?'rtl':'ltr';
 const x=lm22Lifecycle(emp),ended=lm23IsArchived(emp);
 const head=lm24El('div','lm24-head');const title=lm24El('div','lm24-title',lm22Text('الحالة الوظيفية','Employment status'));
 const toggle=lm24El('button','lm24-toggle '+(ended?'lm24-red':'lm24-green'));toggle.type='button';toggle.setAttribute('role','switch');toggle.setAttribute('aria-checked',String(!ended));
 toggle.append(lm24El('span','lm24-switch-dot'),lm24El('span','',ended?lm22Text('منتهي الخدمة','Service ended'):lm22Text('على رأس العمل','Active employee')));
 toggle.onclick=()=>ended?lm24Restore(emp):lm22EditLifecycle(String(getEmployeeCode(emp)));
 head.append(title,toggle);panel.append(head);
 const detail=lm24El('div','lm24-details');
 if(ended){detail.textContent=lm22Text('سبب الانتهاء: ','End reason: ')+(LM23_REASONS[x.reason]?.[currentLang==='ar'?0:1]||'—')+'  ·  '+lm22Text('تاريخ الانتهاء: ','End date: ')+(x.endDate||'—');}
 else if(x.renewal==='yes'){detail.textContent=lm22Text('تجديد العمل: ','Renewed: ')+(x.renewalStart||'—')+' — '+(x.renewalEnd||'—');}
 else detail.textContent=lm22Text('السجل نشط. الضغط على الزر يفتح إجراءات إنهاء الخدمة.','Record is active. Select the switch to start service-end procedure.');
 panel.append(detail);
 if(ended&&emp.hr_leave_end_service_snapshot){const ss=emp.hr_leave_end_service_snapshot,box=lm24El('div','lm24-details');box.style.cssText='white-space:pre-line;margin-top:12px;border:1px solid #64748b;padding:12px;border-radius:12px';box.textContent=lm22Text('تقرير إنهاء الخدمة (اختباري فقط)','Service-end report (TEST ONLY)')+'\n'+lm22Text('رصيد افتتاحي: ','Opening days: ')+(ss.opening2025_2026??'—')+' | '+lm22Text('مستحق 2027: ','2027 accrual: ')+(ss.earned2027??'—')+' | '+lm22Text('إجازات معتمدة: ','Approved leave: ')+(ss.approvedLeaveDays??'—')+'\n'+lm22Text('الرصيد عند الخروج: ','Balance at exit: ')+(ss.remainingDays??'—')+' | '+lm22Text('المقابل التقديري: ','Estimated amount: ')+(ss.estimatedAmount??'—')+' EGP\n'+lm22Text('لا يوجد صرف أو خصم تسوية 15 يومًا','No payout or 15-day settlement deduction');panel.append(box);}
 if(lm23AlertNeeded(emp)){
  const alert=lm24El('div','lm24-warning',lm22Text('تنبيه سن التقاعد: بلغ الموظف الستين في ','Retirement alert: Employee reached age 60 on ')+lm23SixtyDate(emp)+lm22Text('. يرجى اختيار إنهاء الخدمة أو تجديد العمل.','. Choose service end or renewal.'));
  const renew=lm24El('button','lm24-secondary',lm22Text('تسجيل تجديد بعد الستين','Record post-60 renewal'));renew.type='button';renew.onclick=()=>lm24Renew(emp);alert.append(renew);panel.append(alert);
 }
 if(!ended){const renew=lm24El('button','lm24-secondary',lm22Text('تجديد العقد / استمرار الخدمة','Renew contract / continue service'));renew.type='button';renew.onclick=()=>lm24Renew(emp);panel.append(renew);}
}
function lm24Modal(title,build){
 const overlay=lm24El('div','lm24-overlay');const card=lm24El('section','lm24-dialog');card.dir=currentLang==='ar'?'rtl':'ltr';card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-label',title);
 card.append(lm24El('h3','lm24-dialog-title',title));overlay.append(card);document.body.append(overlay);
 const close=()=>overlay.remove();const esc=e=>{if(e.key==='Escape'){document.removeEventListener('keydown',esc,true);close();}};document.addEventListener('keydown',esc,true);
 const done=()=>{document.removeEventListener('keydown',esc,true);close();};build(card,done);return overlay;
}
function lm24Field(card,label,options,value){const wrap=lm24El('label','lm24-field');wrap.append(lm24El('span','',label));const sel=lm24El('select');for(const [v,t] of options){const op=lm24El('option','',t);op.value=v;sel.append(op);}sel.value=value||'';wrap.append(sel);card.append(wrap);return sel;}
function lm24Date(card,label,value){
 // Single calendar control shared with the Portal-wide branded date picker.
 // No native browser date picker, duplicate calendar buttons or manual date parts.
 const wrap=lm24El('div','lm24-field');wrap.append(lm24El('span','',label));
 const input=lm24El('input','lm25-calendar-value');input.type='text';input.readOnly=true;
 input.placeholder='YYYY-MM-DD';input.dir='ltr';input.setAttribute('aria-label',label);
 input.value=/^\d{4}-\d{2}-\d{2}$/.test(value||'')?value:'';
 wrap.append(input);card.append(wrap);
 // The shared calendar's MutationObserver attaches one trigger to this input.
 return {get value(){return input.value;},focus(){const btn=input.closest('.lm-date-shell')?.querySelector('.lm-date-trigger');if(btn)btn.focus();}};
}
function lm24Actions(card,close,onSave,saveLabel){const actions=lm24El('div','lm24-actions');const cancel=lm24El('button','lm24-secondary',lm22Text('إلغاء','Cancel'));cancel.type='button';cancel.onclick=close;const save=lm24El('button','lm24-primary',saveLabel);save.type='button';save.onclick=()=>onSave(save);actions.append(cancel,save);card.append(actions);}
/* Pilot-only dated leave accounting. Opening value represents combined 2025+2026 remainder.
   Approved request IDs are the immutable keys; no duplicate debit on refresh/approval.
   No financial transfer, payroll, or employee balance writes. */
let lmPilotLeaves={};
function lmLeaveDays(r){const a=Date.parse(String(r.startDate||'')+'T00:00:00Z'),b=Date.parse(String(r.endDate||'')+'T00:00:00Z');return Number.isFinite(a)&&Number.isFinite(b)&&b>=a?Math.round((b-a)/86400000)+1:0;}
function lmLeaveUsed(code,cutoff){return Object.values(lmPilotLeaves[String(code)]||{}).reduce((sum,r)=>sum+(r&&r.status==='Approved'&&(!cutoff||String(r.startDate||'')<=cutoff)?lmLeaveDays(r):0),0);}
function lmLeaveEndSnapshot(emp,endDate,reason){const opening=lm3Num(lmBField(emp,['رصيد الاجازات','رصيد الإجازات','annual leave balance']));const code=String(getEmployeeCode(emp));const hire=LM13.date(lm3Hire(emp));let earned2027=0,annual=null;
 if(endDate>='2027-01-01'&&hire){const a=LM13.annual(emp,hire,Number(endDate.slice(0,4)));if(a.verified&&a.days!==null){annual=a.days;const y=Number(endDate.slice(0,4));if(y===2027)earned2027=Math.round(a.days*Number(endDate.slice(5,7))/12*10000)/10000;}}
 const used=lmLeaveUsed(code,endDate),balance=opening===null?null:Math.round((opening+earned2027-used)*10000)/10000;const salary=lm3Salary(emp);return {simulationOnly:true,reason,endDate,opening2025_2026:opening,earned2027,annualRate:annual,approvedLeaveDays:used,remainingDays:balance,benchmark15DayDeductionApplied:false,estimatedDailyWage:salary===null?null:salary/30,estimatedAmount:salary===null||balance===null?null:Math.round(salary/30*balance*100)/100,calculation:'OPENING_2025_2026_PLUS_PRORATED_2027_MINUS_APPROVED',notes:'Test-only snapshot; no payout; preserve entire employee record and history.'};}
async function lm23Save(emp,next,action){
 if(!portalIsAdmin()||!portalAuth.currentUser)throw Error(lm22Text('ليس لديك صلاحية تعديل الحالة الوظيفية.','No permission to change employment status.'));
 const code=String(getEmployeeCode(emp)),base=emp._firebasePath;
 if(!base||base!==`${PORTAL_EMPLOYEE_COLLECTION}/${code}`)throw Error('EMPLOYEE_PATH_MISSING');
 const actor=portalAuth.currentUser.uid,old=lm22Lifecycle(emp),key=db.ref(base+'/hr_service_history').push().key;
 if(!key)throw Error('HISTORY_KEY_MISSING');
 const stamp=firebase.database.ServerValue.TIMESTAMP;
 const settlement=action==='END_SERVICE_ARCHIVE'?lmLeaveEndSnapshot(emp,next.endDate,next.reason):null;
 const nextRecord={...next,updatedAt:stamp,updatedBy:actor};
 // Both lifecycle state and its audit event live under the same employee record.
 // One atomic multi-path update; if security rules deny it, no local status is changed.
 const changes={hr_service_lifecycle:nextRecord,['hr_service_history/'+key]:{action,previous:old,next,actorUid:actor,createdAt:stamp,...(settlement?{leaveSettlementSnapshot:settlement}:{})}};if(settlement)changes['hr_leave_end_service_snapshot']=settlement;await db.ref(base).update(changes);if(settlement)emp.hr_leave_end_service_snapshot=settlement;
 emp.hr_service_lifecycle={...next,updatedBy:actor};
 lm22RenderLifecycle(emp);filterEmployees();updateDashboardStats();if(typeof renderRichDashboard==='function')renderRichDashboard();
 if(typeof lm3Apply==='function'&&document.getElementById('lm3-table-body'))lm3Apply();
}
async function lm24Restore(emp){
 if(!(await lmDialog(lm22Text('تأكيد استعادة الموظف إلى العاملين؟ سيتم الاحتفاظ بتاريخ انتهاء الخدمة السابق.','Restore employee to active staff? Previous service-end history will remain.'),true)))return;
 try{const x=lm22Lifecycle(emp);await lm23Save(emp,{...x,status:'active',previousEnd:{reason:x.reason,endDate:x.endDate},restoredAt:lm23Now()},'RESTORE_EMPLOYEE');await lmDialog(lm22Text('تمت الاستعادة بنجاح.','Employee restored.'));}
 catch(e){await lmDialog(lm22Text('تعذر الاستعادة: ','Restore failed: ')+(e.message||e));}
}
function lm22EditLifecycle(code){
 const emp=allEmployees.find(e=>String(getEmployeeCode(e))===code);if(!emp)return;
 const x=lm22Lifecycle(emp);
 lm24Modal(lm22Text('إنهاء خدمة الموظف','End employee service'),(card,close)=>{
 const reason=lm24Field(card,lm22Text('سبب انتهاء الخدمة','Reason for ending service'),[['',lm22Text('اختر السبب','Select reason')],...Object.entries(LM23_REASONS).map(([k,v])=>[k,v[currentLang==='ar'?0:1]])],x.reason);
 const end=lm24Date(card,lm22Text('تاريخ انتهاء الخدمة الفعلي','Actual service-end date'),x.endDate|| (lm23AlertNeeded(emp)?lm23SixtyDate(emp):lm23Now()));
 const note=lm24El('p','lm24-note',lm22Text('لن يتم حذف بيانات الموظف أو تصفير رصيده. سيتم نقله إلى أرشيف المنتهية خدمتهم بعد التأكيد.','The employee record and leave balance will be preserved. Confirmation moves the employee to the ended-service archive.'));card.append(note);
 lm24Actions(card,close,async save=>{
 if(!reason.value){await lmDialog(lm22Text('اختر سبب انتهاء الخدمة.','Select an end-of-service reason.'));return;}
 if(!end.value||end.value>lm23Now()){await lmDialog(lm22Text('اختر تاريخ انتهاء خدمة صحيحًا، لا يتجاوز اليوم.','Choose a valid end date no later than today.'));return;}
 if(!(await lmDialog(lm22Text('تأكيد إنهاء الخدمة ونقل الموظف للأرشيف؟','Confirm end of service and archive this employee?'),true)))return;
 save.disabled=true;try{await lm23Save(emp,{...x,status:'ended',reason:reason.value,endDate:end.value,renewal:'no',retirementDecision:reason.value==='retirement'?'end':x.retirementDecision||'',decisionDate:lm23Now()},'END_SERVICE_ARCHIVE');close();await lmDialog(lm22Text('تم إنهاء الخدمة ونقل الموظف إلى الأرشيف.','Service ended and employee archived.'));}
 catch(e){save.disabled=false;await lmDialog(lm22Text('تعذر الحفظ: ','Save failed: ')+(e.message||e));}
 },lm22Text('تأكيد إنهاء الخدمة','Confirm service end'));
 });
}
function lm24Renew(emp){
 const x=lm22Lifecycle(emp);
 lm24Modal(lm22Text('تجديد العقد / استمرار العمل','Contract renewal / continued service'),(card,close)=>{
 const start=lm24Date(card,lm22Text('بداية التجديد','Renewal start date'),x.renewalStart||lm23Now());
 const end=lm24Date(card,lm22Text('نهاية التجديد','Renewal end date'),x.renewalEnd||'');
 card.append(lm24El('p','lm24-note',lm22Text('التجديد قبل الستين لا يعيد بدء دورة الثلاث سنوات. بعد الستين تستمر التسوية السنوية.','Renewal before age 60 preserves the three-year cycle; after 60, annual settlement continues.')));
 lm24Actions(card,close,async save=>{
 if(!start.value||!end.value||end.value<start.value){await lmDialog(lm22Text('أدخل تاريخي بداية ونهاية تجديد صحيحين.','Enter valid renewal start and end dates.'));return;}
 if(!(await lmDialog(lm22Text('تأكيد تسجيل التجديد مع الاحتفاظ بسجل الخدمة؟','Confirm renewal while preserving service history?'),true)))return;
 save.disabled=true;try{await lm23Save(emp,{...x,status:'active',renewal:'yes',renewalStart:start.value,renewalEnd:end.value,retirementDecision:lm23SixtyDate(emp)&&lm23SixtyDate(emp)<=lm23Now()?'renew':x.retirementDecision||'',decisionDate:lm23Now()},'RENEW_SERVICE');close();await lmDialog(lm22Text('تم حفظ التجديد بنجاح.','Renewal saved successfully.'));}
 catch(e){save.disabled=false;await lmDialog(lm22Text('تعذر الحفظ: ','Save failed: ')+(e.message||e));}
 },lm22Text('حفظ التجديد','Save renewal'));
 });
}


// Phase 29: UI-only additions. No Firebase writes, ESS modifications, or changes to approval rules.
const lm29ServiceGroups=[
 {ar:'الخدمات الإدارية والمالية',en:'Administrative & financial services',items:[
  ['salary-letter','مفردات المرتب','Salary statement','طلب مفردات مرتب من ملف الموظف.','Request a salary statement.'],
  ['advance','سلفة مالية','Financial advance','طلب سلفة مالية ومتابعة إجراءاتها.','Request a financial advance.'],
  ['documents','طلب أصول أوراق من ملفي','Request original documents from my file','طلب استلام أصول أوراق من الملف الوظيفي.','Request original personnel-file documents.'],
  ['support','طلب دعم فني','Technical support request','طلب دعم فني للتطبيق أو الأجهزة.','Request IT support for apps or devices.']
 ]}
];
function lmPhase2Standalone(page){
 const el=document.getElementById('hr-'+page+'-view');if(!el)return;
 const items={
 clinic:['العيادة','Clinic','تاب مستقل مخصص لإدارة العيادة. لم يتم تفعيل قراءة أو كتابة بيانات طبية أو صلاحياتها بعد.','Dedicated clinic module. Medical data access and permissions are not enabled yet.'],
 complaints:['الشكاوى والمقترحات','Complaints & Suggestions','تاب مستقل للشكاوى والمقترحات. لحماية السرية، لن يتم عرض بيانات الشكاوى قبل اعتماد صلاحيات الوصول الخاصة بها.','Dedicated complaints module. Records will not be exposed until confidentiality permissions are reviewed.'],
 chat:['الشات','Chat','تاب مستقل للمحادثات. إرسال الرسائل وتخزينها لم يتم تفعيله بعد.','Dedicated chat module. Sending and storing messages is not enabled yet.']
 };
 const item=items[page];if(!item)return;
 el.innerHTML=`<div class="mb-5"><h1 class="text-2xl font-bold text-sky-200">${hrText(item[0],item[1])}</h1></div><div class="glass-card rounded-2xl p-6 border border-sky-500/20"><p class="text-slate-200">${hrText(item[2],item[3])}</p><p class="text-sm text-amber-200 mt-4">${hrText('الواجهة جاهزة للتوسع — لا توجد عمليات على Firebase من هذه الصفحة.','UI ready for future work — this page performs no Firebase operations.')}</p></div>`;
}
function lm29ServiceCenter(){
 const el=document.getElementById('hr-service-center-view');if(!el)return;
 const ar=currentLang==='ar';
 el.innerHTML=`<div class="mb-5"><h1 class="text-2xl font-bold text-sky-200">${hrText('مركز خدمات الموظفين','Employee Service Center')}</h1><p class="text-sm text-slate-400 mt-2">${hrText('الخدمات التي لا تملك تابًا مستقلًا فقط. افتح القسم للاطلاع على خدماته داخل نفس الصفحة.','Only services without their own module. Expand a section to view its services on this page.')}</p></div><div class="space-y-4">${lm29ServiceGroups.map((group,gi)=>`<details class="glass-card rounded-2xl border border-sky-500/20 overflow-hidden" ${gi===0?'open':''}><summary class="cursor-pointer p-5 text-lg font-bold text-sky-200 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400">${escapeHtml(ar?group.ar:group.en)} <span class="text-xs font-normal text-slate-400">(${group.items.length})</span></summary><div class="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-3">${group.items.map(([id,titleAr,titleEn,descAr,descEn])=>`<section class="rounded-xl border border-slate-600/50 bg-slate-900/30 p-4" data-service="${id}"><h3 class="font-semibold text-sky-100 mb-2">${escapeHtml(ar?titleAr:titleEn)}</h3><p class="text-sm text-slate-300">${escapeHtml(ar?descAr:descEn)}</p><p class="text-xs text-amber-200 mt-3">${hrText('الوظيفة قيد البناء — لا توجد إجراءات مفعّلة بعد','Under development — no actions enabled yet')}</p></section>`).join('')}</div></details>`).join('')}</div><div class="glass-card rounded-2xl p-5 mt-5 text-sm text-amber-200">${hrText('التفويضات واستثناء الموظف 2 معتمدة كمواصفات فقط؛ لم تُفعّل في قاعدة البيانات.','Delegation and employee 2 exception are design-approved only; no database rules changed.')}</div>`;
}
const lm29JobDrafts=[];
function lm29Recruitment(){
 const el=document.getElementById('hr-recruitment-view');if(!el)return;
 el.innerHTML=`<h1 class="text-2xl font-bold text-sky-200 mb-2">${hrText('التوظيف والاستقطاب','Recruitment')}</h1><p class="text-slate-400 text-sm mb-5">${hrText('هيكل محلي لإعداد إعلانات الوظائف؛ لا يتم النشر أو إرسال البيانات إلى ESS أو Firebase. المسودات مؤقتة وتختفي عند تحديث الصفحة.','Local job drafting only. Nothing is published or sent to ESS/Firebase. Drafts are temporary and disappear on refresh.')}</p><div class="glass-card rounded-2xl p-5 mb-5"><h2 class="text-lg font-bold mb-4">${hrText('إضافة مسودة وظيفة','Create job draft')}</h2><form id="lm29-job-form" class="grid grid-cols-1 md:grid-cols-2 gap-4" onsubmit="lm29AddJob(event)"><label class="text-sm">${hrText('المسمى الوظيفي','Job title')}<input name="title" maxlength="120" required class="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-sky-500/30"></label><label class="text-sm">${hrText('الإدارة','Department')}<input name="department" maxlength="120" required class="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-sky-500/30"></label><label class="text-sm">${hrText('نوع الإعلان','Audience')}<select name="audience" class="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-sky-500/30"><option value="internal">${hrText('داخلي','Internal')}</option><option value="external">${hrText('خارجي','External')}</option><option value="both">${hrText('داخلي وخارجي','Both')}</option></select></label><label class="text-sm">${hrText('عدد الشواغر','Vacancies')}<input name="count" type="number" min="1" max="1000" value="1" required class="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-sky-500/30"></label><label class="text-sm">${hrText('تاريخ انتهاء الإعلان','Closing date')}<input name="deadline" type="date" required class="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-sky-500/30"></label><label class="text-sm md:col-span-2">${hrText('المتطلبات','Requirements')}<textarea name="requirements" maxlength="2000" rows="3" required class="w-full mt-2 p-3 rounded-xl bg-slate-900 border border-sky-500/30"></textarea></label><div class="md:col-span-2"><button type="submit" class="portal-action-btn px-5 py-3 rounded-xl">${hrText('إضافة مسودة محلية','Add local draft')}</button></div></form></div><div class="glass-card rounded-2xl p-5"><h2 class="font-bold text-sky-200 mb-3">${hrText('مسودات هذه الجلسة','Session drafts')}</h2><div id="lm29-job-list" class="space-y-3" aria-live="polite"></div></div>`;
 lm29RenderJobs();
}
function lm29AddJob(event){
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
 const data=new FormData(form);const job={title:String(data.get('title')||'').trim(),department:String(data.get('department')||'').trim(),audience:String(data.get('audience')||''),count:Number(data.get('count')),deadline:String(data.get('deadline')||''),requirements:String(data.get('requirements')||'').trim()};
 if(!job.title||!job.department||!job.requirements||!Number.isInteger(job.count)||job.count<1||job.count>1000||!/^\d{4}-\d{2}-\d{2}$/.test(job.deadline))return;
 lm29JobDrafts.push(job);form.reset();lm29RenderJobs();
}
function lm29RenderJobs(){
 const el=document.getElementById('lm29-job-list');if(!el)return;
 el.innerHTML=lm29JobDrafts.length?lm29JobDrafts.map((j,i)=>`<div class="border border-sky-500/20 rounded-xl p-4"><div class="font-bold text-sky-200">${escapeHtml(j.title)}</div><div class="text-xs text-slate-300 mt-2">${escapeHtml(j.department)} · ${escapeHtml(j.audience)} · ${j.count} · ${escapeHtml(j.deadline)}</div><p class="text-xs text-slate-400 mt-2 whitespace-pre-wrap">${escapeHtml(j.requirements)}</p><button type="button" class="text-rose-300 text-xs mt-3 underline" onclick="lm29RemoveJob(${i})">${hrText('حذف المسودة','Delete draft')}</button></div>`).join(''):`<p class="text-slate-400 text-sm">${hrText('لا توجد مسودات حتى الآن','No drafts yet')}</p>`;
}
function lm29RemoveJob(i){if(!Number.isInteger(i)||i<0||i>=lm29JobDrafts.length)return;lm29JobDrafts.splice(i,1);lm29RenderJobs();}

// Unified Portal workflow (2026-11-05): separate alerts from attendance approvals.
let lmGpsRef=null, lmGpsCallback=null;
let lmGpsEvidence={};
function lmGpsDetach(){if(lmGpsRef&&lmGpsCallback)lmGpsRef.off('value',lmGpsCallback);lmGpsRef=null;lmGpsCallback=null;}
function lmGpsRender(){
 const panel=document.getElementById('lm-gps-review');
 if(!panel){lmGpsDetach();return;}
 lmGpsDetach();
 if(!portalIsAdmin()){panel.textContent=hrText('مراجعة البصمات متاحة لمسؤول Portal فقط','Only Portal admins can review punches');return;}
 lmGpsRef=db.ref('attendance_requests/2');
 lmGpsCallback=snap=>{
  const el=document.getElementById('lm-gps-review');if(!el)return;
  lmGpsEvidence=snap.val()||{};
  const rows=Object.entries(lmGpsEvidence).map(([id,r])=>({id,r:r||{}})).sort((a,b)=>Number(b.r.createdAt||0)-Number(a.r.createdAt||0));
  if(!rows.length){el.textContent=hrText('لا توجد طلبات بصمة مسجلة','No punch requests recorded');return;}
  el.innerHTML=`<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr>${[hrText('الموظف','Employee'),hrText('الحركة','Punch'),hrText('التاريخ','Date'),hrText('الحالة','Status'),hrText('الدليل','Evidence'),hrText('الموقع','Location'),hrText('القرار','Decision')].map(t=>`<th class="p-2 text-start">${t}</th>`).join('')}</tr></thead><tbody>${rows.map(({id,r})=>{
   const status=String(r.verificationStatus||'PENDING_REVIEW');
   const pending=status==='PENDING_REVIEW'||status==='HELD';
   const selfie=typeof r.selfieData==='string'&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(r.selfieData)?`<button class="ess-selfie-open" data-selfie-id="${escapeHtml(id)}"><img class="ess-selfie-thumb" src="${r.selfieData}" alt="Selfie"></button>`:'—';
   const lat=Number(r.location?.lat), lng=Number(r.location?.lng);
   const validGps=r.location&&r.location.lat!==null&&r.location.lat!==undefined&&r.location.lng!==null&&r.location.lng!==undefined&&Number.isFinite(lat)&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180;
   const gps=validGps?`<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lat+','+lng)}" target="_blank" rel="noopener noreferrer" title="${hrText('عرض موقع البصمة على خرائط جوجل','Open punch location in Google Maps')}" aria-label="${hrText('عرض موقع البصمة على خرائط جوجل','Open punch location in Google Maps')}" class="inline-flex items-center justify-center rounded-lg border border-sky-600 px-2 py-1 text-sky-300">📍</a>`:'—';
   const buttons=pending?`<button class="portal-action-btn px-3 py-1 mr-1" onclick="essReviewAttendance('2','${escapeHtml(id)}','APPROVED')">${hrText('اعتماد','Approve')}</button><button class="portal-ghost-btn px-3 py-1 mr-1" onclick="essReviewAttendance('2','${escapeHtml(id)}','REJECTED')">${hrText('رفض','Reject')}</button><button class="portal-ghost-btn px-3 py-1" onclick="essReviewAttendance('2','${escapeHtml(id)}','HELD')">${hrText('تعليق','Hold')}</button>`:'—';
   return `<tr class="border-t border-slate-700"><td class="p-2">2</td><td class="p-2">${escapeHtml(r.punchType||'—')}</td><td class="p-2">${escapeHtml(r.clientDate||'')} ${escapeHtml(r.clientTime||'')}</td><td class="p-2">${escapeHtml(status)}</td><td class="p-2">${selfie}</td><td class="p-2">${gps}</td><td class="p-2">${buttons}</td></tr>`;
  }).join('')}</tbody></table></div>`;
 };
 lmGpsRef.on('value',lmGpsCallback,e=>{const el=document.getElementById('lm-gps-review');if(el)el.textContent='Firebase: '+(e.code||e.message)});
}
const lmOriginalRenderHRFeature=renderHRFeature;
renderHRFeature=function(page){lmOriginalRenderHRFeature(page);lmGpsDetach();};
// Alerts: link to the attendance tab; other ESS requests remain visible here.
essRenderRequestPanel=function(){
 const panel=document.getElementById('ess-request-panel');if(!panel)return;
 essStopListeners();
 if(!portalIsAdmin()){panel.textContent=hrText('هذه الصفحة متاحة لمسؤول Portal فقط','Portal admin only');return;}
 panel.innerHTML=`<p class="mb-4 text-sm text-slate-300">${hrText('الطلبات مرتبة من الأقدم للأحدث حسب وقت تقديمها الأصلي. الاعتمادات من نفس السجل، دون نسخ الطلبات.','Requests are ordered oldest first by original submission time. Approvals use the original records.')}</p><div class="flex flex-wrap gap-3 mb-4"><label class="text-sm">${hrText('نوع الطلب','Request type')}<select id="lm-alert-kind" class="hr-feature-input mt-1" onchange="lmUnifiedAlertsDraw()"><option value="">${hrText('جميع الأنواع','All types')}</option>${essPaths.map(([path,ar,en])=>`<option value="${path}">${hrText(ar,en)}</option>`).join('')}</select></label><label class="text-sm">${hrText('الحالة','Status')}<select id="lm-alert-status" class="hr-feature-input mt-1" onchange="lmUnifiedAlertsDraw()"><option value="pending">${hrText('المعلقة','Pending')}</option><option value="all">${hrText('كل الحالات','All statuses')}</option><option value="closed">${hrText('المنتهية','Resolved')}</option></select></label><label class="text-sm">${hrText('بحث بالكود','Search by code')}<input id="lm-alert-code" class="hr-feature-input mt-1" oninput="lmUnifiedAlertsDraw()" placeholder="2"></label></div><div id="ess-requests-content" aria-live="polite"></div>`;
 essRequestState={};essRequestErrors={};
 for(const [path] of essPaths){
  const ref=db.ref(path);const cb=s=>{essRequestState[path]=s.val()||{};delete essRequestErrors[path];lmUnifiedAlertsDraw();};
  const err=e=>{essRequestErrors[path]=e.code||e.message;lmUnifiedAlertsDraw();};
  ref.on('value',cb,err);essRequestUnsubscribers.push(()=>ref.off('value',cb));
 }
};
function lmOpenGpsApproval(id){const section=document.getElementById('lm-gps-review-section');if(!section){showHRPage('attendance');setTimeout(()=>lmOpenGpsApproval(id),180);return;}section.scrollIntoView({behavior:'smooth',block:'start'});section.style.scrollMarginTop='20px';const button=[...section.querySelectorAll('button')].find(b=>b.getAttribute('onclick')?.includes("'"+id+"'"));if(button)setTimeout(()=>button.focus({preventScroll:true}),250);}
function lmUnifiedAlertsDraw(){
 const el=document.getElementById('ess-requests-content');if(!el)return;
 const kind=document.getElementById('lm-alert-kind')?.value||'';
 const codeFilter=(document.getElementById('lm-alert-code')?.value||'').trim();
 const statusFilter=document.getElementById('lm-alert-status')?.value||'pending';
 const alerts=[];
 for(const [path,ar,en] of essPaths){
  if(kind&&kind!==path)continue;
  for(const [code,byId] of Object.entries(essRequestState[path]||{})){
   if(codeFilter&&!String(code).includes(codeFilter))continue;
   for(const [id,r] of Object.entries(byId||{})){
    if(!r||typeof r!=='object')continue;
    const pending=lmPendingStatus(path,r);
    if(statusFilter==='pending'&&!pending||statusFilter==='closed'&&pending)continue;
    const status=String(r.verificationStatus||r.status||'—');
    alerts.push({path,code,id,r,pending,status,label:hrText(ar,en),time:Number(r.createdAt||r.timestamp||0)});
   }
  }
 }
 alerts.sort((a,b)=>a.time-b.time||a.code.localeCompare(b.code)||a.id.localeCompare(b.id));
 const errors=Object.entries(essRequestErrors);
 const warning=errors.length?`<p class="text-amber-300 mb-3">${hrText('تعذر قراءة بعض المسارات','Some paths could not be read')}: ${errors.map(([p,e])=>escapeHtml(p+': '+e)).join('، ')}</p>`:'';
 const pageFor={permission_requests:'permissions',leave_requests:'leave-balances',loan_requests:'service-center',mission_requests:'missions',suggestions_and_complaints:'complaints',attendance_requests:'attendance'};
 const dateFormat=new Intl.DateTimeFormat(currentLang==='ar'?'ar-EG':'en-GB',{dateStyle:'medium',timeStyle:'short'});
 const rows=alerts.slice(0,100).map((a,i)=>{
  const date=a.time>0?dateFormat.format(new Date(a.time)):hrText('وقت غير مسجل','No timestamp');
  const destination=pageFor[a.path]||'notifications';
  const action=a.path==='attendance_requests'?`<button type="button" class="portal-action-btn px-3 py-1" onclick="lmOpenGpsApproval('${escapeHtml(a.id)}')">${a.pending?hrText('مراجعة واعتماد','Review & approve'):hrText('فتح سجل البصمة','Open punch record')}</button>`:`<button type="button" class="portal-ghost-btn px-3 py-1" onclick="showHRPage('${destination}')">${hrText('فتح التاب المختص','Open module')}</button>`;
  return `<tr class="border-b border-slate-700/40"><td class="p-3">${i+1}</td><td class="p-3">${escapeHtml(a.label)}</td><td class="p-3">${escapeHtml(a.code)}</td><td class="p-3" dir="auto">${escapeHtml(date)}</td><td class="p-3">${escapeHtml(a.status)}</td><td class="p-3">${action}</td></tr>`;
 }).join('');
 el.innerHTML=warning+`<p class="text-sm mb-3">${statusFilter==='pending'?hrText('طلبات معلقة','Pending requests'):hrText('السجلات المطابقة','Matching records')}: <strong>${alerts.length}</strong>${alerts.length>100?' — '+hrText('عرض أول 100','Showing first 100'):''}</p>`+(alerts.length?`<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr>${[hrText('الترتيب','Order'),hrText('النوع','Type'),hrText('الموظف','Employee'),hrText('وقت التقديم','Submitted at'),hrText('الحالة','Status'),hrText('الإجراء','Action')].map(x=>`<th class="p-3 text-start border-b border-slate-600">${x}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`:`<p class="text-slate-400">${hrText('لا توجد سجلات مطابقة','No matching records')}</p>`);
}


// Attendance workspace UI: real source records, no payroll/shift calculations.
const lmAttWorkspace={rows:[],loading:false,mode:'today',shiftPlans:{},shiftPlansLoaded:false};
function lmAttMode(mode){lmAttWorkspace.mode=mode==='report'?'report':'today';const filters=document.getElementById('lm-att-filters');if(filters)filters.style.display='grid';const title=document.getElementById('lm-att-mode-title');if(title)title.textContent=lmAttWorkspace.mode==='today'?hrText('حركات اليوم','Today punches'):hrText('تقرير الحضور والانصراف','Attendance history report');lmAttFilter();}
function lmAttSafe(v){return escapeHtml(String(v??''));}
function lmAttDate(r){return String(r.date||r.clientDate||r.timestamp||'').slice(0,10);}
function lmAttStamp(r){const n=Number(r.createdAt||r.approvedAt||0);return n||Date.parse(String(r.timestamp||r.clientDate||''))||0;}
function lmAttSource(r){return r.origin==='ess'?'ESS GPS':r.origin==='device'?'ZKTeco'+(r.device?' #'+r.device:''):hrText('غير محدد','Unknown');}
const LM_ZK_BRIDGE='http://127.0.0.1:4371';
async function lmZkCheckHealth(){
 const el=document.getElementById('lm-zk-health');if(!el)return;
 try{const r=await fetch(LM_ZK_BRIDGE+'/api/health',{signal:AbortSignal.timeout(3500)});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();if(!data.ok)throw Error('Bridge unavailable');el.textContent=hrText('Bridge متصل','Bridge connected');el.className='text-xs text-emerald-300';}
 catch(e){el.textContent=hrText('Bridge غير متصل — افحص الخدمة والمتصفح','Bridge offline — check service/browser');el.className='text-xs text-amber-300';}
}
// Local ZKTeco bridge: explicit user-triggered read-only pull, staged for existing Firebase import approval.
async function lmZkPull(){
 const status=document.getElementById('lm-zk-status'),button=document.getElementById('lm-zk-pull');
 if(!portalIsAdmin()){status.textContent=hrText('يلزم حساب الإدارة','Admin required');return;}
 const from=document.getElementById('lm-zk-from')?.value,to=document.getElementById('lm-zk-to')?.value;
 if(!from||!to||from>to){status.textContent=hrText('راجع تاريخ البداية والنهاية','Check date range');return;}
 const matching=lmV5MatchingEmployees();
 const allowed=new Set(matching.map(e=>String(getEmployeeCode(e))));
 const allCodes=new Set((allEmployees||[]).map(e=>String(getEmployeeCode(e))));
 const devices=[...document.querySelectorAll('.lm-zk-device:checked')].map(e=>e.value);
 if(!devices.length){status.textContent=hrText('اختر جهازًا واحدًا على الأقل','Select a device');return;}
 button.disabled=true;status.textContent=hrText('جاري سحب السجلات...','Pulling records...');
 try{
  const qs=new URLSearchParams({from,to,devices:devices.join(',')});
  const res=await fetch(LM_ZK_BRIDGE+'/api/punches?'+qs,{signal:AbortSignal.timeout(180000)});
  if(!res.ok)throw Error('Bridge HTTP '+res.status);
  const data=await res.json();if(!Array.isArray(data.records))throw Error('Invalid bridge response');
  if(!Array.isArray(allEmployees)||!allEmployees.length)throw Error('Employee directory not loaded');
  const incomplete=(data.complete!==true)||!Array.isArray(data.devices)||devices.some(id=>!data.devices.some(d=>String(d.id)===String(id)&&d.ok===true));
  const valid=data.records.filter(r=>allCodes.has(String(r.code||'').trim()));
  const rows=valid.filter(r=>allowed.has(String(r.code||'').trim()));
  const unknown=data.records.length-valid.length,filtered=valid.length-rows.length;
  const unique=new Map();for(const r of rows){const key=[String(r.code).trim(),String(r.timestamp).trim(),String(r.type||'')].join('|');if(!unique.has(key))unique.set(key,r);}
  const duplicates=rows.length-unique.size;
  const clean=[...unique.values()];
  const parsed=clean.length?hrImportRows('attendance',clean):{result:[],errors:[]};
  hrImportState.attendance={records:incomplete?[]:parsed.result,errors:parsed.errors,filename:'ZKTeco_'+from+'_'+to+'.csv'};
  const preview=document.getElementById('hr-import-preview-attendance');
  if(preview)preview.innerHTML='<p>'+hrEscape(hrText('معاينة السحب','Pull preview'))+': '+parsed.result.length+' / '+data.records.length+'</p><p class="text-xs text-amber-200">'+hrText('أكواد غير موجودة','Unknown employee codes')+': '+unknown+' · '+hrText('خارج الفلاتر','Filtered out')+': '+filtered+' · '+hrText('مكرر مطابق','Exact duplicates')+': '+duplicates+' · '+hrText('أخطاء البيانات','Validation errors')+': '+parsed.errors.length+'</p>'+(parsed.errors.length?'<p class="text-rose-300">'+parsed.errors.slice(0,10).map(hrEscape).join('; ')+'</p>':'')+'<div class="overflow-x-auto"><table class="hr-feature-table"><thead><tr><th>Code</th><th>Timestamp</th><th>Source</th></tr></thead><tbody>'+parsed.result.slice(0,30).map(r=>'<tr><td>'+hrEscape(r.code)+'</td><td>'+hrEscape(r.timestamp)+'</td><td>'+hrEscape(r.source)+'</td></tr>').join('')+'</tbody></table></div>'+(!incomplete&&parsed.result.length&&!parsed.errors.length?'<button class="portal-action-btn px-4 py-2 mt-3 rounded-xl" onclick="hrCommitImport(\'attendance\')">'+hrText('مراجعة وحفظ الدفعة في Firebase','Review and save to Firebase')+'</button>':'');
  status.textContent=(incomplete?hrText('تحذير: سحب غير مكتمل، الحفظ معطل. ','Warning: incomplete pull; saving disabled. '):'')+(data.devices||[]).map(d=>'#'+d.id+': '+(d.ok?d.count+' OK':hrText('خطأ: ','Error: ')+d.error)).join(' | ');
  document.getElementById('lm-zk-devices-status').textContent=status.textContent;
 }catch(e){hrImportState.attendance={records:[],errors:[String(e.message||e)],filename:''};status.textContent=hrText('تعذر السحب: ','Pull failed: ')+e.message;}
 finally{button.disabled=false;}
}
// V5.5: central bilingual read-only display resolver. Never mutate Firebase records.
function lmBilingualEmployee(code){return (allEmployees||[]).find(e=>String(getEmployeeCode(e))===String(code))||null;}
function lmBilingualField(record,keys){if(!record)return '';const normalized=Object.keys(record);for(const key of keys){const found=normalized.find(k=>k.trim()===key.trim());const value=found===undefined?'':record[found];if(value!==null&&value!==undefined&&String(value).trim()&&String(value).trim()!=='--')return String(value).trim();}return '';}
function lmBilingualName(code,fallback=''){const e=lmBilingualEmployee(code);if(!e)return String(fallback||'—');const keys=currentLang==='ar'?['اسم الموظف','name_ar']:['emp_name _en','employee_name_en','name_en'];return lmBilingualField(e,keys)||String(fallback||'—');}
function lmBilingualDepartment(e){return lmBilingualField(e,currentLang==='ar'?['الإدارة','department_ar']:['department','department_en'])||'—';}
function lmBilingualRequestText(r,arKeys,enKeys){return lmBilingualField(r,currentLang==='ar'?arKeys:enKeys)||lmBilingualField(r,currentLang==='ar'?enKeys:arKeys)||'—';}
function lmBilingualStatus(value){const v=String(value||'Pending');const m={Pending:['قيد الانتظار','Pending'],Approved:['معتمد','Approved'],Rejected:['مرفوض','Rejected'],ManagerApproved:['معتمد من المدير','Manager approved'],HRApproved:['معتمد من الموارد البشرية','HR approved']};return m[v]?m[v][currentLang==='ar'?0:1]:v;}
function lmBilingualLeaveType(value){const v=String(value||'');const m={annual:['اعتيادية','Annual'],sick:['مرضية','Sick'],emergency:['عارضة','Emergency'],unpaid:['بدون أجر','Unpaid'],casual:['عارضة','Emergency'],maternity:['وضع','Maternity']};return m[v.toLowerCase()]?m[v.toLowerCase()][currentLang==='ar'?0:1]:(v||'—');}
function lmBilingualSearch(code,record){const e=lmBilingualEmployee(code);return [code,record?.name,record?.destination,record?.purpose,e&&lmBilingualField(e,['اسم الموظف']),e&&lmBilingualField(e,['emp_name _en'])].join(' ').toLowerCase();}
// V5: normalized bilingual department matching; source is the live Firebase employee directory.
function lmV5Dept(emp){
 const fields=['الإدارة ','الإدارة','department ','department','departmentAr','department_ar','dept'];
 const first=(names)=>names.map(k=>String(emp?.[k]??'').trim()).find(v=>v&&v!=='--')||'';
 return {ar:first(fields.slice(0,2)),en:first(fields.slice(2))};
}
function lmV5Norm(v){return String(v??'').normalize('NFKC').trim().toLocaleLowerCase().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/\s+/g,' ');}
function lmV5DeptGroups(){
 const map=new Map();
 for(const e of (allEmployees||[])){
  const d=lmV5Dept(e),key=lmV5Norm(d.ar||d.en);if(!key)continue;
  if(!map.has(key))map.set(key,{key,ar:d.ar,en:d.en,codes:new Set()});
  const item=map.get(key);if(!item.ar&&d.ar)item.ar=d.ar;if(!item.en&&d.en)item.en=d.en;
  item.codes.add(String(getEmployeeCode(e)));
 }
 return [...map.values()].sort((a,b)=>(a.ar||a.en).localeCompare(b.ar||b.en,'ar'));
}
function lmV5MatchingEmployees(){
 const dept=document.getElementById('lm-zk-dept')?.value||'',search=lmV5Norm(document.getElementById('lm-zk-search')?.value||'');
 const selected=lmV5DeptGroups().find(d=>d.key===dept);
 return (allEmployees||[]).filter(e=>{
  const code=String(getEmployeeCode(e)||'').trim();if(!code)return false;
  if(selected&&!selected.codes.has(code))return false;
  return !search||lmV5Norm(code).includes(search)||lmV5Norm(getEmployeeName(e)).includes(search)||lmV5Norm(e['اسم الموظف ']||e['اسم الموظف']||'').includes(search)||lmV5Norm(e['emp_name _en']||'').includes(search);
 });
}
function lmV5RefreshEmployeeHints(){
 const el=document.getElementById('lm-zk-employee-hints');if(!el)return;
 const matches=lmV5MatchingEmployees();el.innerHTML=matches.slice(0,100).map(e=>'<option value="'+hrEscape(getEmployeeCode(e))+'">'+hrEscape(getEmployeeName(e))+'</option>').join('');
 const count=document.getElementById('lm-zk-match-count');if(count)count.textContent=matches.length+' '+hrText('موظف مطابق','matching employees');
}
function lmZkPopulate(){
 const dep=document.getElementById('lm-zk-dept');if(!dep)return;
 const old=dep.value;
 dep.innerHTML='<option value="">'+hrText('جميع الإدارات','All departments')+'</option>'+lmV5DeptGroups().map(d=>'<option value="'+hrEscape(d.key)+'">'+hrEscape((currentLang==='ar'?d.ar||d.en:d.en||d.ar))+'</option>').join('');
 dep.value=old;lmV5RefreshEmployeeHints();
}
function lmZkModal(kind){
 const overlay=document.getElementById('lm-zk-overlay');if(!overlay)return;
 overlay.hidden=false;overlay.style.display='flex';
 document.getElementById('lm-zk-pull-view').hidden=kind!=='pull';
 document.getElementById('lm-zk-import-view').hidden=kind!=='import';
 if(kind==='pull'){lmZkPopulate();lmZkCheckHealth();}const panel=overlay.firstElementChild;if(panel)panel.dir=currentLang==='ar'?'rtl':'ltr';
}
function lmZkClose(){const el=document.getElementById('lm-zk-overlay');if(el){el.hidden=true;el.style.display='none';}}
function lmZkClear(){const d=document.getElementById('lm-zk-dept'),q=document.getElementById('lm-zk-search');if(d)d.value='';if(q)q.value='';lmV5RefreshEmployeeHints();}
function lmAttWorkspaceLayout(){
 const d=document.getElementById('hr-attendance-view');if(!d)return;
 const imp=d.querySelector('#hr-import-file-attendance')?.closest('.hr-panel');if(!imp)return;
 const heading=d.querySelector('h1');const subtitle=heading?.nextElementSibling;
 if(subtitle)subtitle.textContent=hrText('إدارة البصمات وسجلات الحضور','Fingerprint and attendance management');
 let toolbar=d.querySelector('#lm-att-toolbar');
 if(!toolbar){
  toolbar=document.createElement('section');toolbar.id='lm-att-toolbar';toolbar.className='hr-panel mb-4';
  toolbar.innerHTML=`<div class="flex flex-wrap justify-between items-center gap-3"><div><h2 class="font-bold text-sky-300 text-lg">${hrText('إدارة البصمات','Fingerprint management')}</h2><span id="lm-zk-health" class="text-xs text-amber-300">${hrText('جاري فحص Bridge','Checking bridge')}</span></div><div class="flex flex-wrap gap-2"><button type="button" class="portal-action-btn px-3 py-2 rounded-xl" onclick="lmZkModal('pull')">${hrText('سحب البصمات','Pull punches')}</button><button type="button" class="portal-ghost-btn px-3 py-2 rounded-xl" onclick="lmZkModal('import')">${hrText('استيراد Excel / CSV','Import Excel / CSV')}</button><button type="button" class="portal-ghost-btn px-3 py-2 rounded-xl" onclick="lmAttMode('report');document.getElementById('lm-att-filters').style.display='grid'">${hrText('فلاتر التقرير','Report filters')}</button><button type="button" class="portal-ghost-btn px-3 py-2 rounded-xl" onclick="lmAttExport()">${hrText('تصدير CSV','Export CSV')}</button><button type="button" class="portal-action-btn px-3 py-2 rounded-xl" onclick="lmV5ShiftOpen()">${hrText('إدارة الورديات','Shift management')}</button></div></div>`;
  if(heading)heading.after(toolbar);else d.prepend(toolbar);
 }
 imp.style.display='none';
 let overlay=document.getElementById('lm-zk-overlay');
 if(!overlay){
  overlay=document.createElement('div');overlay.id='lm-zk-overlay';overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.style.cssText='display:none;position:fixed;inset:0;z-index:99999;background:rgba(2,8,23,.82);align-items:center;justify-content:center;padding:18px';
  overlay.innerHTML=`<div style="background:#0d1a30;color:#e2e8f0;border:1px solid #2b638a;border-radius:18px;padding:20px;width:min(920px,96vw);max-height:90vh;overflow:auto;direction:${currentLang==='ar'?'rtl':'ltr'}"><div class="flex justify-between items-center mb-4"><h2 class="text-lg font-bold text-sky-300">${hrText('إدارة استيراد البصمات','Fingerprint import')}</h2><button type="button" class="portal-ghost-btn" onclick="lmZkClose()" aria-label="Close">✕</button></div><div id="lm-zk-pull-view"><p class="text-xs text-slate-400 mb-3">${hrText('تحديد الجهاز يعني تضمينه في السحب؛ لا يقطع الاتصال الفعلي بالجهاز.','Device selection controls the pull, not physical connection.')}</p><div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">${[1,2,3,4].map(i=>`<label class="hr-panel p-3 text-center"><input class="lm-zk-device" type="checkbox" value="${i}" checked> ${hrText('جهاز','Device')} ${i}</label>`).join('')}</div><p id="lm-zk-devices-status" class="text-xs text-sky-300 mb-3"></p><div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"><label>${hrText('من تاريخ','From')}<input id="lm-zk-from" class="hr-feature-input w-full" type="date"></label><label>${hrText('إلى تاريخ','To')}<input id="lm-zk-to" class="hr-feature-input w-full" type="date"></label><label>${hrText('الإدارة','Department')}<select id="lm-zk-dept" class="hr-feature-input w-full" onchange="lmV5RefreshEmployeeHints()"></select></label><label>${hrText('كود الموظف أو اسمه','Employee code or name')}<input id="lm-zk-search" class="hr-feature-input w-full" list="lm-zk-employee-hints" placeholder="109" oninput="lmV5RefreshEmployeeHints()"><datalist id="lm-zk-employee-hints"></datalist><small id="lm-zk-match-count" class="text-sky-300"></small></label></div><div class="flex flex-wrap gap-2"><button type="button" id="lm-zk-pull" class="portal-action-btn px-4 py-2" onclick="lmZkPull()">${hrText('سحب من الأجهزة المحددة','Pull selected devices')}</button><button type="button" class="portal-ghost-btn" onclick="lmZkCheckHealth()">${hrText('فحص Bridge','Check bridge')}</button><button type="button" class="portal-ghost-btn" onclick="lmZkClear()">${hrText('مسح فلاتر الموظفين','Clear employee filters')}</button></div><p id="lm-zk-status" class="text-xs text-sky-300 mt-3" aria-live="polite"></p><div id="lm-zk-preview-holder" class="mt-3"></div></div><div id="lm-zk-import-view" hidden></div></div>`;
  overlay.addEventListener('click',e=>{if(e.target===overlay)lmZkClose()});
  document.body.append(overlay);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')lmZkClose()});
 }
 document.getElementById('lm-zk-import-view').append(imp);imp.style.display='';
 const preview=imp.querySelector('#hr-import-preview-attendance');if(preview)document.getElementById('lm-zk-preview-holder').append(preview);
 const f=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit'});const parts=f.formatToParts(new Date());const v=k=>parts.find(x=>x.type===k).value;const today=v('year')+'-'+v('month')+'-'+v('day');
 for(const id of ['lm-zk-from','lm-zk-to']){const el=document.getElementById(id);if(el&&!el.value)el.value=today;}
 lmZkPopulate();lmZkCheckHealth();
 let ws=d.querySelector('#lm-att-workspace');
 if(!ws){ws=document.createElement('section');ws.id='lm-att-workspace';ws.className='hr-panel mb-5';ws.innerHTML=`<div class="flex flex-wrap justify-between items-center gap-3 mb-4"><div><h2 class="font-bold text-sky-300 text-lg" id="lm-att-mode-title">${hrText('حركات اليوم','Today punches')}</h2><p class="text-xs text-slate-400">${hrText('السجلات الأصلية؛ المعالجة النهائية للورديات لاحقًا','Original records; shift pairing pending')}</p></div><div class="flex gap-2"><button class="portal-ghost-btn" onclick="lmAttMode('today')">${hrText('اليوم','Today')}</button><button class="portal-ghost-btn" onclick="lmAttMode('report')">${hrText('كل السجلات','All records')}</button></div></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4" id="lm-att-kpis"></div><div id="lm-att-filters" class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4"><label>${hrText('الإدارة','Department')}<select id="lm-att-dept" class="hr-feature-input w-full" onchange="lmAttFilter()"></select></label><label>${hrText('كود الموظف','Employee code')}<input id="lm-att-code" class="hr-feature-input w-full" oninput="lmAttFilter()"></label><label>${hrText('من تاريخ','From')}<input id="lm-att-from" type="date" class="hr-feature-input w-full" onchange="lmAttFilter()"></label><label>${hrText('إلى تاريخ','To')}<input id="lm-att-to" type="date" class="hr-feature-input w-full" onchange="lmAttFilter()"></label><label>${hrText('المصدر','Source')}<select id="lm-att-source" class="hr-feature-input w-full" onchange="lmAttFilter()"><option value="all">${hrText('الكل','All')}</option><option value="device">ZKTeco</option><option value="ess">ESS</option></select></label><div class="flex items-end gap-2"><button type="button" class="portal-action-btn" onclick="lmAttFilter()">${hrText('تطبيق الفلتر','Apply filters')}</button><button type="button" class="portal-ghost-btn" onclick="lmAttResetFilters()">${hrText('مسح','Reset')}</button></div></div><span id="lm-att-count" class="text-xs text-slate-400"></span><div id="lm-att-table" aria-live="polite" class="overflow-x-auto text-sm text-slate-300 mt-3">${hrText('جاري التحميل','Loading')}</div>`;toolbar.after(ws);}
 if(!document.getElementById('lm-gps-review-section')){
 const approval=document.createElement('section');approval.id='lm-gps-review-section';approval.className='glass-card rounded-2xl p-5 mb-5';
 approval.innerHTML=`<div class="flex flex-wrap items-center justify-between gap-3 mb-3"><h2 class="font-bold text-sky-300">${hrText('مراجعة واعتماد بصمات GPS','GPS punch review & approval')}</h2><button type="button" class="portal-ghost-btn px-3 py-2 rounded-xl" onclick="lmGpsRender()">${hrText('تحديث','Refresh')}</button></div><div id="lm-gps-review" aria-live="polite">${hrText('جاري تحميل البصمات...','Loading punches...')}</div>`;
 ws.before(approval);
 }
 lmGpsRender();
 const reportDept=document.getElementById('lm-att-dept');if(reportDept){reportDept.innerHTML='<option value="">'+hrText('كل الإدارات','All departments')+'</option>'+lmV5DeptGroups().map(d=>'<option value="'+hrEscape(d.key)+'">'+hrEscape(currentLang==='ar'?d.ar||d.en:d.en||d.ar)+'</option>').join('');}
 lmAttMode(lmAttWorkspace.mode);lmAttLoad();
}
async function lmAttLoad(){
 const el=document.getElementById('lm-att-table');if(!el||lmAttWorkspace.loading)return;
 if(!portalIsAdmin()){el.textContent=hrText('غير مصرح بعرض السجلات','Not authorized');return;}
 lmAttWorkspace.loading=true;el.textContent=hrText('جاري قراءة سجلات Firebase','Reading Firebase records');
 const rows=[],errors=[];
 const add=(r)=>{if(r&&typeof r==='object')rows.push(r)};
 try{
  const jobs=[['attendance_requests/2','ess'],['approved_attendance/2','approved'],['hr_imports/attendance','imports'],['shift_plans','plans']];
  const results=await Promise.allSettled(jobs.map(([path])=>db.ref(path).once('value')));
  results.forEach((res,i)=>{
   const [path,kind]=jobs[i];if(res.status!=='fulfilled'){errors.push(path);return;}
   const val=res.value.val()||{};
   if(kind==='plans'){lmAttWorkspace.shiftPlans=val;lmAttWorkspace.shiftPlansLoaded=true;return;}
   if(kind==='ess')Object.entries(val).forEach(([id,r])=>add({id,code:'2',date:r.clientDate,time:r.clientTime,punch:r.punchType,status:r.verificationStatus||'PENDING_REVIEW',origin:'ess',location:r.location||null,createdAt:r.createdAt}));
   if(kind==='approved')Object.entries(val).forEach(([id,r])=>{if(!val||typeof r!=='object')return; /* Approved ledger is an approval of an ESS request, not a second punch. */});
   if(kind==='imports')Object.entries(val).forEach(([batchId,batch])=>Object.entries(batch?.records||{}).forEach(([i,r])=>{if(!r||typeof r!=='object')return;const source=String(r.source||'').toLowerCase();add({id:batchId+':'+i,code:r.code,date:String(r.timestamp||'').slice(0,10),timestamp:r.timestamp,punch:r.type,status:'IMPORTED',origin:/zkteco|device|finger|zk|[1-4]/.test(source)?'device':'unknown',device:/^[1-4]$/.test(source)?source:'',createdAt:Date.parse(String(r.timestamp||''))||0});}));
  });
 }catch(e){errors.push(e.message||'read failed')}
 lmAttWorkspace.rows=rows.sort((a,b)=>lmAttStamp(b)-lmAttStamp(a));lmAttWorkspace.loading=false;lmAttClassify();
 const warn=document.getElementById('lm-att-count');if(warn&&errors.length)warn.textContent=hrText('تعذر قراءة بعض المصادر: ','Some sources unavailable: ')+errors.join(', ');
 lmAttFilter();
}
// Display-only punch pairing. Never modifies imported records or Firebase.
// Night-shift grouping is enabled only by an explicit saved shift plan.
function lmAttClassify(){
 const plans=lmAttWorkspace.shiftPlans||{},groups=new Map();
 const dayBefore=d=>{const dt=new Date(d+'T12:00:00Z');if(!Number.isFinite(dt.getTime()))return '';dt.setUTCDate(dt.getUTCDate()-1);return dt.toISOString().slice(0,10);};
 for(const r of lmAttWorkspace.rows){
  r.reportPunch='';r.reportWorkday=lmAttDate(r);r.reportPairStatus='';
  const code=String(r.code||'').trim(),date=lmAttDate(r),time=lmAttTime(r),stamp=Date.parse(date+'T'+time);
  if(!code||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{1,2}:\d{2}/.test(time)||!Number.isFinite(stamp)){r.reportPairStatus='INVALID_TIME';continue;}
  let workday=date;
  const previous=dayBefore(date),previousPlan=plans[lmV5ShiftKey(code,previous)];
  const overnight=previousPlan?.kind==='WORK'&&!previousPlan?.cancelled&&previousPlan?.pattern==='night'&&['B','C','D'].includes(previousPlan?.shift);
  if(overnight&&Number(time.slice(0,2))<12)workday=previous;
  r.reportWorkday=workday;
  const key=code+'|'+workday;
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push({r,stamp});
 }
 for(const group of groups.values()){
  group.sort((a,b)=>a.stamp-b.stamp);
  const distinct=[];for(const x of group){if(!distinct.length||distinct[distinct.length-1].stamp!==x.stamp)distinct.push(x);}
  if(distinct.length===1){for(const x of group)x.r.reportPairStatus='SINGLE_PUNCH';continue;}
  const first=distinct[0].stamp,last=distinct[distinct.length-1].stamp;
  // More than 20 hours between first and last indicates ambiguous grouping.
  if(last-first>20*3600000){for(const x of group)x.r.reportPairStatus='REVIEW_REQUIRED';continue;}
  for(const x of group){x.r.reportPairStatus='PAIRED';x.r.reportPunch=x.stamp===first?'IN':x.stamp===last?'OUT':'INTERMEDIATE';}
 }
}
function lmAttPunchLabel(r){const v=r.reportPunch||'';return v==='IN'?hrText('حضور','Check-in'):v==='OUT'?hrText('انصراف','Check-out'):v==='INTERMEDIATE'?hrText('بصمة وسطية','Intermediate'):r.reportPairStatus==='SINGLE_PUNCH'?hrText('بصمة واحدة — مراجعة','Single punch — review'):r.reportPairStatus==='REVIEW_REQUIRED'?hrText('تحتاج مراجعة','Review required'):hrText('غير محدد','Unclassified');}
function lmAttEmployeeName(r){return lmBilingualName(r.code,r.name||'');}
function lmAttFiltered(){const code=document.getElementById('lm-att-code')?.value.trim()||'',from=document.getElementById('lm-att-from')?.value||'',to=document.getElementById('lm-att-to')?.value||'',src=document.getElementById('lm-att-source')?.value||'all',dept=document.getElementById('lm-att-dept')?.value||'';const selected=lmV5DeptGroups().find(d=>d.key===dept);return lmAttWorkspace.rows.filter(r=>{const date=lmAttDate(r);if(lmAttWorkspace.mode==='today'&&date!==new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()) )return false;return (!selected||selected.codes.has(String(r.code||'')))&&(!code||String(r.code||'').includes(code))&&(!from||(date&&date>=from))&&(!to||(date&&date<=to))&&(src==='all'||r.origin===src)});}
function lmAttMapLink(r){
 const loc=r&&r.location;
 if(!loc||loc.lat===null||loc.lng===null||loc.lat===undefined||loc.lng===undefined)return '—';
 const lat=Number(loc.lat),lng=Number(loc.lng);
 if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180)return '—';
 const label=hrText('فتح موقع البصمة في خرائط جوجل','Open punch location in Google Maps');
 return '<a href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(lat+','+lng)+'" target="_blank" rel="noopener noreferrer" title="'+lmAttSafe(label)+'" aria-label="'+lmAttSafe(label)+'" class="inline-flex items-center gap-1 text-sky-300 hover:text-sky-100">📍 '+hrText('الخريطة','Map')+'</a>';
}
function lmAttResetFilters(){for(const id of ['lm-att-dept','lm-att-code','lm-att-from','lm-att-to']){const el=document.getElementById(id);if(el)el.value='';}const source=document.getElementById('lm-att-source');if(source)source.value='all';lmAttFilter();}
function lmAttFilter(){const el=document.getElementById('lm-att-table');if(!el)return;const rows=lmAttFiltered(),kpi=document.getElementById('lm-att-kpis'),count=document.getElementById('lm-att-count');const cards=[[hrText('السجلات المعروضة','Records'),rows.length],[hrText('بصمات ESS','ESS punches'),rows.filter(r=>r.origin==='ess').length],[hrText('بصمات الأجهزة','Device punches'),rows.filter(r=>r.origin==='device').length],[hrText('بانتظار المراجعة','Pending review'),rows.filter(r=>r.status==='PENDING_REVIEW'||r.status==='HELD').length]];if(kpi)kpi.innerHTML=cards.map(([label,n])=>`<div class="rounded-xl border border-sky-500/20 bg-slate-900/40 p-3"><p class="text-xs text-slate-400">${label}</p><strong class="text-2xl text-sky-200">${n}</strong></div>`).join('');if(count)count.textContent=rows.length+' '+hrText('سجل مطابق للفلاتر','matching records');el.innerHTML=rows.length?`<table class="hr-feature-table w-full"><thead><tr>${[hrText('الكود','Code'),hrText('اسم الموظف','Employee name'),hrText('التاريخ','Date'),hrText('الوقت','Time'),hrText('الحركة','Punch'),hrText('المصدر','Source'),hrText('الحالة','Status'),hrText('الموقع','Location')].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.slice(0,500).map(r=>`<tr><td>${lmAttSafe(r.code)}</td><td>${lmAttSafe(lmAttEmployeeName(r))}</td><td>${lmAttSafe(lmAttDate(r))}</td><td>${lmAttSafe(lmAttTime(r))}</td><td>${lmAttSafe(lmAttPunchLabel(r))}</td><td>${lmAttSafe(lmAttSource(r))}</td><td>${lmAttSafe(r.status)}</td><td>${lmAttMapLink(r)}</td></tr>`).join('')}</tbody></table>${rows.length>500?'<p class="text-xs mt-2">'+hrText('يتم عرض أول 500 سجل، ويشمل التصدير جميع السجلات المطابقة.','Showing first 500 records; export includes all filtered records.')+'</p>':''}`:`<p class="text-slate-400 p-4">${hrText('لا توجد سجلات مطابقة','No matching records')}</p>`;}
function lmAttTime(r){const direct=String(r.time??r.clientTime??'').trim();if(direct)return direct;const stamp=String(r.timestamp??'').trim();const match=stamp.match(/(?:T|\s)(\d{1,2}:\d{2}(?::\d{2})?)/);return match?match[1]:'';}
function lmAttExport(){const rows=lmAttFiltered();if(!rows.length)return;const cols=['code','employee_name','date','time','punch','pair_status','workday','origin','device','status','id'];const esc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';const csv='\uFEFF'+[cols.join(','),...rows.map(r=>cols.map(k=>esc(k==='date'?lmAttDate(r):k==='time'?lmAttTime(r):k==='employee_name'?lmAttEmployeeName(r):k==='punch'?lmAttPunchLabel(r):k==='pair_status'?r.reportPairStatus:k==='workday'?r.reportWorkday:r[k])).join(','))].join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='attendance_filtered.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

// V5.4: refresh dynamic attendance controls on a language switch, retaining entered filters.
function lmV54RefreshAttendanceLanguage(){
 const modal=document.getElementById('lm-zk-overlay');
 if(modal){
   const active=modal.style.display!=='none'&&!modal.hidden;
   const selected=modal.querySelector('#lm-zk-dept')?.value;
   const heading=modal.querySelector('#lm-zk-pull-view h2');
   if(heading&&heading.dataset.ar&&heading.dataset.en)heading.textContent=heading.dataset[currentLang];
   modal.querySelectorAll('[data-ar][data-en]').forEach(el=>{el.textContent=el.dataset[currentLang];});
   const panel=modal.firstElementChild;if(panel)panel.dir=currentLang==='ar'?'rtl':'ltr';
   if(typeof lmZkPopulate==='function'){lmZkPopulate();const dept=modal.querySelector('#lm-zk-dept');if(dept&&selected)dept.value=selected;}
   if(active&&typeof lmZkCheckHealth==='function')lmZkCheckHealth();
 }
 const section=document.getElementById('lm-att-workspace');
 if(section){
   const mode=document.getElementById('lm-att-mode-title');
   if(mode)mode.textContent=lmAttWorkspace.mode==='today'?hrText('حركات اليوم','Today punches'):hrText('تقرير الحضور والانصراف','Attendance history report');
   const select=document.getElementById('lm-att-dept');
   if(select){const old=select.value;select.innerHTML='<option value="">'+hrText('كل الإدارات','All departments')+'</option>'+lmV5DeptGroups().map(d=>'<option value="'+hrEscape(d.key)+'">'+hrEscape(currentLang==='ar'?d.ar||d.en:d.en||d.ar)+'</option>').join('');select.value=old;}
   const source=document.getElementById('lm-att-source');if(source){const all=source.querySelector('option[value="all"]');if(all)all.textContent=hrText('الكل','All');}
   section.querySelectorAll('[data-ar][data-en]').forEach(el=>el.textContent=el.dataset[currentLang]);
   lmAttFilter();
 }
}

const lmAttOriginalRender=renderHRFeature;
renderHRFeature=function(page){lmAttOriginalRender(page);if(page==='attendance')lmAttWorkspaceLayout();};


// Dedicated permissions workspace: live Firebase records, no sample rows.
let hrPermissionRef=null,hrPermissionCallback=null,hrPermissionRows=[],hrPermissionError='';
function hrPermissionPage(){return hrFeatureShell(hrText('الأذون الشخصية','Personal permissions'),hrText('مراجعة الطلبات الحقيقية وإرسال القرارات إلى ESS','Review live requests and send decisions to ESS'),`<div class="hr-panel mb-4"><div class="flex flex-wrap gap-3 items-end"><label class="text-sm">${hrText('بحث بالاسم أو الكود','Search name or code')}<input id="hr-perm-search" class="hr-feature-input mt-2" placeholder="${hrText('اسم الموظف / الكود','Employee / code')}" oninput="hrPermissionDraw()"></label><label class="text-sm">${hrText('الحالة','Status')}<select id="hr-perm-status" class="hr-feature-input mt-2" onchange="hrPermissionDraw()"><option value="all">${hrText('الكل','All')}</option><option value="Pending">${hrText('قيد الانتظار','Pending')}</option><option value="Approved">${hrText('موافق عليه','Approved')}</option><option value="Rejected">${hrText('مرفوض','Rejected')}</option></select></label><label class="text-sm">${hrText('الشهر','Month')}<span class="flex gap-2 mt-2"><select id="hr-perm-year" class="hr-feature-input" onchange="hrPermissionDraw()"></select><select id="hr-perm-month-select" class="hr-feature-input" onchange="hrPermissionDraw()"></select></span></label><button class="portal-ghost-btn px-4 py-2 rounded-xl" onclick="hrPermissionExport()">${hrText('تصدير CSV','Export CSV')}</button></div><p id="hr-perm-summary" class="text-sm text-sky-300 mt-4" aria-live="polite"></p></div><div class="hr-panel overflow-x-auto"><div id="hr-perm-rows" class="text-slate-300">${hrText('جاري تحميل الطلبات...','Loading requests...')}</div></div>`)}
function hrPermissionWatch(){
 if(hrPermissionRef&&hrPermissionCallback)hrPermissionRef.off('value',hrPermissionCallback);
 if(!portalIsAdmin()||portalAuth.currentUser?.uid!==PORTAL_ADMIN_UID){const el=document.getElementById('hr-perm-rows');if(el)el.textContent=hrText('يلزم تسجيل الدخول بحساب مدير البورتال','Portal admin login required');return;}
 hrPermissionRef=db.ref('permission_requests');
 hrPermissionCallback=snap=>{hrPermissionError='';hrPermissionRows=[];Object.entries(snap.val()||{}).forEach(([code,requests])=>{if(!requests||typeof requests!=='object')return;Object.entries(requests).forEach(([id,req])=>{if(req&&typeof req==='object')hrPermissionRows.push({code,id,req});});});hrPermissionRows.sort((a,b)=>Number(b.req.timestamp||0)-Number(a.req.timestamp||0));hrPermissionDraw();};
 hrPermissionRef.on('value',hrPermissionCallback,e=>{hrPermissionError=e.message||e.code||'Permission denied';hrPermissionDraw();});
}
function hrPermissionFiltered(){const q=(document.getElementById('hr-perm-search')?.value||'').trim().toLowerCase(),status=document.getElementById('hr-perm-status')?.value||'all',year=document.getElementById('hr-perm-year')?.value||'',mm=document.getElementById('hr-perm-month-select')?.value||'',month=year&&mm?year+'-'+mm:'';return hrPermissionRows.filter(({code,req})=>(!q||lmBilingualSearch(code,req).includes(q))&&(status==='all'||req.status===status)&&(!year||String(req.date||'').startsWith(year+'-'))&&(!mm||String(req.date||'').slice(5,7)===mm));}
function hrPermissionDraw(){const el=document.getElementById('hr-perm-rows');if(!el)return;if(hrPermissionError){el.textContent=hrText('فشل تحميل الطلبات: ','Failed loading requests: ')+hrPermissionError;return;}const rows=hrPermissionFiltered();const summary=document.getElementById('hr-perm-summary');if(summary)summary.textContent=`${hrText('الطلبات المعروضة','Visible requests')}: ${rows.length} | ${hrText('قيد الانتظار','Pending')}: ${rows.filter(x=>x.req.status==='Pending').length}`;
 if(!rows.length){el.textContent=hrText('لا توجد طلبات مطابقة للفلاتر','No matching requests');return;}
 el.innerHTML=`<table class="hr-feature-table w-full"><thead><tr>${[hrText('الكود','Code'),hrText('الموظف','Employee'),hrText('التاريخ','Date'),hrText('النوع','Type'),hrText('المدة','Duration'),hrText('السبب','Reason'),hrText('الحالة','Status'),hrText('القرار','Decision')].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.slice(0,500).map(({code,id,req})=>{const safeCode=hrEscape(code),safeId=hrEscape(id),status=String(req.status||'Pending');const type=req.type==='late_arrival'?hrText('تأخير','Late arrival'):req.type==='early_leave'?hrText('خروج مبكر','Early exit'):String(req.type||'—');const actions=status==='Pending'&&portalIsAdmin()?`<button class="px-2 py-1 rounded bg-emerald-700 mr-1" data-perm-action="Approved" data-perm-code="${safeCode}" data-perm-id="${safeId}">${hrText('اعتماد','Approve')}</button><button class="px-2 py-1 rounded bg-red-800" data-perm-action="Rejected" data-perm-code="${safeCode}" data-perm-id="${safeId}">${hrText('رفض','Reject')}</button>`:'—';return `<tr>${[code,lmBilingualName(code,req.name),req.date||'—',type,`${Number(req.durationMins)||0} ${hrText('دقيقة','min')}`,req.notes||'—',lmBilingualStatus(status)].map(v=>`<td>${hrEscape(v)}</td>`).join('')}<td>${actions}</td></tr>`;}).join('')}</tbody></table>`;
}
function hrPermissionExport(){const rows=hrPermissionFiltered(),headers=['code','name','date','type','durationMins','notes','status','reviewedAt','reviewedBy'];const quote=v=>'"'+String(v??'').replace(/"/g,'""')+'"';const csv='\ufeff'+[headers.join(','),...rows.map(({code,req})=>headers.map(k=>quote(k==='code'?code:req[k])).join(','))].join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='permission_requests.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
document.addEventListener('click',event=>{const btn=event.target.closest?.('[data-perm-action]');if(!btn)return;const {permAction:status,permCode:code,permId:id}=btn.dataset;if(!['Approved','Rejected'].includes(status)||!/^[0-9]+$/.test(code)||!/^[\w-]+$/.test(id))return;essDecide('permission_requests',code,id,status);});


// Native-browser-independent month filter, styled with Portal controls.
function hrPermissionInitDate(){
 const y=document.getElementById('hr-perm-year'),m=document.getElementById('hr-perm-month-select');if(!y||!m)return;
 const current=new Date().getFullYear();y.innerHTML='<option value="">'+hrText('كل السنوات','All years')+'</option>'+Array.from({length:9},(_,i)=>current+2-i).map(v=>'<option value="'+v+'">'+v+'</option>').join('');
 const names=currentLang==='ar'?['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']:['January','February','March','April','May','June','July','August','September','October','November','December'];
 m.innerHTML='<option value="">'+hrText('كل الشهور','All months')+'</option>'+names.map((name,i)=>'<option value="'+String(i+1).padStart(2,'0')+'">'+name+'</option>').join('');
}
let lmMissionRef=null,lmMissionCb=null,lmMissionRows=[],lmMissionError='',lmMissionPunchRef=null,lmMissionPunchCb=null,lmMissionPunches=[];
function lmMissionPage(){
 const el=document.getElementById('hr-missions-view');if(!el)return;
 el.innerHTML=hrFeatureShell(hrText('إدارة المأموريات','Mission management'),hrText('اعتماد HR النهائي هو وحده الذي يفعّل استثناء البصمة الخارجية. حساب 2 تجريبي ويُراجع مباشرة من HR.','Only final HR approval activates off-site punches. Employee 2 is an HR-direct pilot.'),`<div class="hr-panel mb-4"><div class="flex flex-wrap gap-3 items-end"><label>${hrText('بحث','Search')}<input id="lm-mission-search" class="hr-feature-input mt-2" oninput="lmMissionDraw()" placeholder="${hrText('الكود أو الاسم أو الوجهة','Code, name or destination')}"></label><label>${hrText('الحالة','Status')}<select id="lm-mission-status" class="hr-feature-input mt-2" onchange="lmMissionDraw()"><option value="">${hrText('الكل','All')}</option><option value="Pending">${hrText('بانتظار الموافقة','Pending')}</option><option value="ManagerApproved">${hrText('اعتماد المدير','Manager approved')}</option><option value="Approved">${hrText('اعتماد HR','HR approved')}</option><option value="Rejected">${hrText('مرفوض','Rejected')}</option></select></label><button class="portal-ghost-btn px-4 py-2 rounded-xl" onclick="lmMissionExport()">${hrText('تصدير CSV','Export CSV')}</button></div><p class="text-xs text-amber-200 mt-3">${hrText('الموظف العادي: اعتماد المدير أولًا ثم HR. لا يتم فتح البصمة الخارجية إلا بعد الاعتماد النهائي.','Normal employees: manager then HR. Off-site punches unlock only after final HR approval.')}</p></div><div class="hr-panel overflow-x-auto"><div id="lm-mission-rows">${hrText('جاري تحميل المأموريات...','Loading missions...')}</div></div>`);
 if(lmMissionRef&&lmMissionCb)lmMissionRef.off('value',lmMissionCb);
 if(lmMissionPunchRef&&lmMissionPunchCb)lmMissionPunchRef.off('value',lmMissionPunchCb);
 if(!portalIsAdmin()){document.getElementById('lm-mission-rows').textContent=hrText('حساب الإدارة مطلوب','Admin required');return;}
 lmMissionRef=db.ref('mission_requests');lmMissionCb=snap=>{lmMissionError='';lmMissionRows=[];Object.entries(snap.val()||{}).forEach(([code,records])=>Object.entries(records||{}).forEach(([id,r])=>{if(r&&typeof r==='object')lmMissionRows.push({code,id,r});}));lmMissionRows.sort((a,b)=>Number(b.r.createdAt||b.r.timestamp||0)-Number(a.r.createdAt||a.r.timestamp||0));lmMissionDraw();};
 lmMissionRef.on('value',lmMissionCb,e=>{lmMissionError=e.code||e.message;lmMissionDraw();});
 lmMissionPunchRef=db.ref('attendance_requests');lmMissionPunchCb=snap=>{lmMissionPunches=[];Object.entries(snap.val()||{}).forEach(([code,items])=>Object.entries(items||{}).forEach(([id,r])=>{if(r&&r.missionId)lmMissionPunches.push({code,id,r});}));lmMissionDraw();};lmMissionPunchRef.on('value',lmMissionPunchCb,e=>console.warn('Mission punch read',e));
}
function lmMissionFiltered(){const q=(document.getElementById('lm-mission-search')?.value||'').trim().toLowerCase(),st=document.getElementById('lm-mission-status')?.value||'';return lmMissionRows.filter(({code,r})=>(!q||lmBilingualSearch(code,r).includes(q))&&(!st||(r.status||'Pending')===st));}
function lmMissionDraw(){const el=document.getElementById('lm-mission-rows');if(!el)return;if(lmMissionError){el.textContent='Firebase: '+lmMissionError;return;}const rows=lmMissionFiltered();if(!rows.length){el.textContent=hrText('لا توجد مأموريات مطابقة','No matching missions');return;}
 el.innerHTML=`<table class="hr-feature-table w-full"><thead><tr>${[hrText('الكود','Code'),hrText('الموظف','Employee'),hrText('التاريخ','Date'),hrText('الوقت','Time'),hrText('الوجهة','Destination'),hrText('الغرض','Purpose'),hrText('الحالة','Status'),hrText('بصمة البداية','Mission IN'),hrText('بصمة النهاية','Mission OUT'),hrText('المدة الفعلية','Actual duration'),hrText('القرار','Action')].map(x=>'<th>'+x+'</th>').join('')}</tr></thead><tbody>${rows.slice(0,500).map(({code,id,r})=>{const st=r.status||'Pending';let buttons='—';if(st==='Pending'&&code==='2')buttons=`<button class="portal-action-btn px-2 py-1" data-mission-action="hr" data-code="${hrEscape(code)}" data-id="${hrEscape(id)}">${hrText('اعتماد HR','HR approve')}</button>`;else if(st==='ManagerApproved')buttons=`<button class="portal-action-btn px-2 py-1" data-mission-action="hr" data-code="${hrEscape(code)}" data-id="${hrEscape(id)}">${hrText('اعتماد HR','HR approve')}</button>`;if(st==='Pending'||st==='ManagerApproved')buttons+=` <button class="px-2 py-1 rounded bg-red-800" data-mission-action="reject" data-code="${hrEscape(code)}" data-id="${hrEscape(id)}">${hrText('رفض','Reject')}</button>`;const punches=lmMissionPunches.filter(x=>x.code===code&&x.r.missionId===id&&x.r.verificationStatus!=='REJECTED');
 const ins=punches.filter(x=>x.r.punchType==='IN').sort((a,b)=>Number(a.r.createdAt||0)-Number(b.r.createdAt||0));
 const outs=punches.filter(x=>x.r.punchType==='OUT').sort((a,b)=>Number(a.r.createdAt||0)-Number(b.r.createdAt||0));
 const first=ins[0]?.r,last=outs.find(x=>Number(x.r.createdAt)>Number(first?.createdAt||0))?.r;
 const punchCell=p=>{if(!p)return '—';const loc=p.location||{},valid=Number.isFinite(Number(loc.lat))&&Number.isFinite(Number(loc.lng))&&loc.lat!==undefined&&loc.lng!==undefined;const label=hrText('فتح موقع البصمة في خرائط Google','Open punch location in Google Maps');const map=valid?'<a class="lm-mission-map-pin" target="_blank" rel="noopener noreferrer" aria-label="'+hrEscape(label)+'" title="'+hrEscape(label)+'" href="https://www.google.com/maps?q='+encodeURIComponent(loc.lat+','+loc.lng)+'"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></a>':'';return '<div class="lm-mission-punch"><time>'+hrEscape(p.clientTime||'—')+'</time>'+map+'</div><small>'+hrEscape(p.verificationStatus||'')+'</small>';};
 const mins=first&&last?Math.max(0,Math.round((Number(last.createdAt)-Number(first.createdAt))/60000)):null;
 const duration=mins===null?'—':Math.floor(mins/60)+'h '+mins%60+'m';
 return '<tr>'+[code,lmBilingualName(code,r.name),r.date||'—',r.fullDay?hrText('يوم كامل','Full day'):[r.startTime,r.endTime].filter(Boolean).join(' – '),lmBilingualRequestText(r,['destinationAr','destination_ar','destination'],['destinationEn','destination_en']),lmBilingualRequestText(r,['purposeAr','purpose_ar','purpose'],['purposeEn','purpose_en']),lmBilingualStatus(st)].map(v=>'<td>'+hrEscape(v)+'</td>').join('')+'<td>'+punchCell(first)+'</td><td>'+punchCell(last)+'</td><td>'+hrEscape(duration)+'</td><td>'+buttons+'</td></tr>';}).join('')}</tbody></table>`;
}
async function lmMissionDecide(code,id,action){if(!portalIsAdmin()||!/^[0-9]+$/.test(code)||!/^[\w-]+$/.test(id))return;const ref=db.ref('mission_requests/'+code+'/'+id);try{const snap=await ref.once('value'),r=snap.val();if(!r)throw Error('Not found');if(action==='hr'&&!((code==='2'&&r.status==='Pending')||r.status==='ManagerApproved'))throw Error('Manager approval required');if(action==='reject'&&!['Pending','ManagerApproved'].includes(r.status))throw Error('Not pending');if(!await lmDialog(action==='hr'?hrText('اعتماد المأمورية نهائيًا وفتح بصمة GPS الخارجية؟','Approve mission and enable off-site GPS punches?'):hrText('رفض المأمورية؟','Reject mission?'),true))return;
 const updates={status:action==='hr'?'Approved':'Rejected',reviewedAt:firebase.database.ServerValue.TIMESTAMP,reviewedBy:PORTAL_ADMIN_UID};if(action==='hr'){updates.hrApproved=true;updates.hrApprovedAt=firebase.database.ServerValue.TIMESTAMP;}await ref.update(updates);try{await db.ref('notifications/'+code).push({title:action==='hr'?'تم اعتماد المأمورية من HR':'تم رفض المأمورية',body:r.destination||'',createdAt:firebase.database.ServerValue.TIMESTAMP,senderUid:PORTAL_ADMIN_UID});}catch(err){console.warn('Mission notification failed',err);}await lmDialog(hrText('تم تسجيل القرار','Decision saved'));}catch(err){await lmDialog(hrText('تعذر الحفظ: ','Save failed: ')+(err.code||err.message));}}
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-mission-action]');if(b)lmMissionDecide(b.dataset.code,b.dataset.id,b.dataset.missionAction);});
function lmMissionExport(){const headers=['code','name','date','startTime','endTime','destination','purpose','status','reviewedBy','reviewedAt'];const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';const csv='\ufeff'+[headers.join(','),...lmMissionFiltered().map(({code,r})=>headers.map(k=>q(k==='code'?code:r[k])).join(','))].join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='mission_requests.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}


/* Leave request pilot: read-only ledger review and decision workflow. Do not debit opening balances
   until the approved dated leave ledger and entitlement rules have been reconciled. */
let lmLeaveReqRef=null,lmLeaveReqCb=null,lmLeaveReqRows=[],lmLeaveReqError='';
function lmLeaveReqPanel(){return `<section class="hr-panel mb-5"><h2 class="font-bold text-sky-300 mb-2">${hrText('طلبات الإجازات من ESS','ESS leave requests')}</h2><p class="text-xs text-amber-200 mb-4">${hrText('الاعتماد يحدّث الرصيد المحسوب من الطلبات المعتمدة دون تغيير الرصيد الافتتاحي المخزن.','Approved requests reduce the calculated balance; stored opening balances remain unchanged.')}</p><div class="flex flex-wrap gap-3 mb-3"><input class="hr-feature-input" id="lm-leave-q" type="search" oninput="lmLeaveReqDraw()" placeholder="${hrText('بحث بالكود أو الاسم','Search code or name')}"><select class="hr-feature-input" id="lm-leave-status" onchange="lmLeaveReqDraw()"><option value="">${hrText('كل الحالات','All statuses')}</option><option value="Pending">${hrText('قيد الانتظار','Pending')}</option><option value="Approved">${hrText('معتمد','Approved')}</option><option value="Rejected">${hrText('مرفوض','Rejected')}</option></select><button type="button" class="portal-ghost-btn" onclick="lmLeaveReqExport()">${hrText('تصدير CSV','Export CSV')}</button></div><div class="overflow-x-auto" id="lm-leave-rows" aria-live="polite">${hrText('جارٍ تحميل الطلبات','Loading requests')}</div></section>`;}
function lmLeaveReqWatch(){if(lmLeaveReqRef&&lmLeaveReqCb)lmLeaveReqRef.off('value',lmLeaveReqCb);lmLeaveReqRef=db.ref('leave_requests');lmLeaveReqCb=snap=>{lmLeaveReqError='';lmLeaveReqRows=[];lmPilotLeaves=snap.val()||{};if(typeof lm3Apply==='function'&&document.getElementById('lm3-table-body'))lm3Apply();Object.entries(lmPilotLeaves).forEach(([code,items])=>Object.entries(items||{}).forEach(([id,r])=>{if(r&&typeof r==='object')lmLeaveReqRows.push({code,id,r})}));lmLeaveReqRows.sort((a,b)=>Number(b.r.timestamp||b.r.createdAt||0)-Number(a.r.timestamp||a.r.createdAt||0));lmLeaveReqDraw()};lmLeaveReqRef.on('value',lmLeaveReqCb,e=>{lmLeaveReqError=e.code||e.message||'Read error';lmLeaveReqDraw()});}
function lmLeaveReqFiltered(){const q=(document.getElementById('lm-leave-q')?.value||'').trim().toLowerCase(),st=document.getElementById('lm-leave-status')?.value||'';return lmLeaveReqRows.filter(({code,r})=>(!q||lmBilingualSearch(code,r).includes(q))&&(!st||r.status===st));}
function lmLeaveReqDraw(){const el=document.getElementById('lm-leave-rows');if(!el)return;if(lmLeaveReqError){el.textContent='Firebase: '+lmLeaveReqError;return;}const rows=lmLeaveReqFiltered();if(!rows.length){el.textContent=hrText('لا توجد طلبات مطابقة','No matching requests');return;}const cols=[hrText('الكود','Code'),hrText('الاسم','Name'),hrText('النوع','Type'),hrText('من','From'),hrText('إلى','To'),hrText('الأيام التقويمية','Calendar days'),hrText('ملاحظات','Notes'),hrText('الحالة','Status'),hrText('القرار','Action')];el.innerHTML='<table class="hr-feature-table w-full"><thead><tr>'+cols.map(c=>'<th>'+hrEscape(c)+'</th>').join('')+'</tr></thead><tbody>'+rows.slice(0,500).map(({code,id,r})=>{const start=Date.parse(r.startDate+'T00:00:00Z'),end=Date.parse(r.endDate+'T00:00:00Z'),days=Number.isFinite(start)&&Number.isFinite(end)&&end>=start?Math.round((end-start)/86400000)+1:'—';const actions=r.status==='Pending'?'<button class="portal-action-btn" data-leave-action="Approved" data-code="'+hrEscape(code)+'" data-id="'+hrEscape(id)+'">'+hrText('اعتماد','Approve')+'</button> <button class="portal-ghost-btn" data-leave-action="Rejected" data-code="'+hrEscape(code)+'" data-id="'+hrEscape(id)+'">'+hrText('رفض','Reject')+'</button>':'—';return '<tr>'+[code,lmBilingualName(code,r.name),lmBilingualLeaveType(r.type),r.startDate||'—',r.endDate||'—',days,r.notes||'—',lmBilingualStatus(r.status)].map(v=>'<td>'+hrEscape(v)+'</td>').join('')+'<td>'+actions+'</td></tr>'}).join('')+'</tbody></table>';}
async function lmLeaveReqDecide(code,id,status){if(!portalIsAdmin()||!/^[0-9]+$/.test(code)||!/^[\w-]+$/.test(id)||!['Approved','Rejected'].includes(status))return;const ref=db.ref('leave_requests/'+code+'/'+id);try{const snap=await ref.once('value');if(snap.val()?.status!=='Pending')throw Error(hrText('الطلب لم يعد معلقًا','Request is no longer pending'));if(!await lmDialog(status==='Approved'?hrText('تأكيد اعتماد الإجازة وخصم أيامها من الرصيد المحسوب؟','Approve leave and update the calculated remaining balance?'):hrText('تأكيد رفض الإجازة؟','Reject leave?'),true))return;await ref.update({status,reviewedAt:firebase.database.ServerValue.TIMESTAMP,reviewedBy:PORTAL_ADMIN_UID});try{await db.ref('notifications/'+code).push({title:status==='Approved'?'تم اعتماد طلب الإجازة':'تم رفض طلب الإجازة',body:String(snap.val().startDate||'')+' — '+String(snap.val().endDate||''),createdAt:firebase.database.ServerValue.TIMESTAMP,senderUid:PORTAL_ADMIN_UID});await lmDialog(hrText('تم حفظ القرار وإرسال الإشعار','Decision saved and notification sent'));}catch(e){await lmDialog(hrText('تم حفظ القرار لكن تعذر إرسال الإشعار: ','Decision saved, notification failed: ')+(e.code||e.message));}}catch(e){await lmDialog(hrText('تعذر حفظ القرار: ','Could not save decision: ')+(e.code||e.message));}}
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-leave-action]');if(b)lmLeaveReqDecide(b.dataset.code,b.dataset.id,b.dataset.leaveAction)});
function lmLeaveReqExport(){const rows=lmLeaveReqFiltered(),keys=['code','name','type','startDate','endDate','notes','status','reviewedAt','reviewedBy'],q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';const csv='\ufeff'+[keys.join(','),...rows.map(({code,r})=>keys.map(k=>q(k==='code'?code:r[k])).join(','))].join('\r\n'),a=document.createElement('a'),u=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.href=u;a.download='leave_requests.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
(function(){const prior=renderHRFeature;renderHRFeature=function(page){const result=prior(page);if(page==='leave-balances'){const root=document.getElementById('hr-leave-balances-view');if(root){root.insertAdjacentHTML('afterbegin',lmLeaveReqPanel());lmLeaveReqWatch();}}return result;};})();


/* Integrated shift workspace — V5.5.1: no external v5-shifts.js dependency. */
/* Lacto Misr V5 Shift Workspace — no payroll changes. */
const LMV5_MANAGERS=Object.freeze({'4':'production','458':'assurance','16':'control','15':'engineering'});
const LMV5_DEPT_LABELS={production:['الإنتاج','Production'],assurance:['تأكيد الجودة','Quality Assurance'],control:['رقابة الجودة','Quality Control'],engineering:['الهندسية والتطوير والمشروعات','Engineering, Development & Projects']};
const LMV5_SHIFTS={A:{hours:7},B:{monthly:154},C:{monthly:132},D:{days:19}};
const lmV5ShiftState={plans:{},audit:{},rows:[],loading:false};
function lmV5ShiftT(ar,en){return currentLang==='ar'?ar:en;}
function lmV5ShiftDay(s){return /^\d{4}-\d{2}-\d{2}$/.test(String(s||''))?s:'';}
function lmV5ShiftDate(s){const x=lmV5ShiftDay(s);return x?new Date(x+'T00:00:00Z'):null;}
function lmV5ShiftAdd(date,n){const d=lmV5ShiftDate(date);if(!d)return '';d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
function lmV5ShiftTime(date,clock){const m=/^(\d\d):(\d\d)$/.exec(clock||'');if(!lmV5ShiftDay(date)||!m)return NaN;return Date.parse(date+'T'+clock+':00+02:00');}
function lmV5ShiftKey(code,date){return String(code).replace(/[.#$\[\]/]/g,'_')+'_'+date;}
function lmV5ShiftDept(emp){const d=lmV5Dept(emp);return lmV5Norm(d.ar||d.en);}
function lmV5ShiftScope(emp){const d=lmV5ShiftDept(emp);if(/انتاج|production/.test(d))return 'production';if(/تاكيد.*جود|assurance/.test(d))return 'assurance';if(/رقاب.*جود|control/.test(d))return 'control';if(/هندس|تطوير|مشروع|engineering|development|project/.test(d))return 'engineering';return ''}
function lmV5ShiftAllowed(emp){if(portalIsAdmin())return true;return false;} // no client-only manager authorization
function lmV5ShiftTemplate(shift,pattern,date){if(shift==='A')return {start:'09:00',end:'16:00',overnight:false};if(shift==='B')return pattern==='night'?{start:'21:00',end:'09:00',overnight:true}:pattern==='long'?{start:'09:00',end:'21:00',overnight:false}:{start:'09:00',end:'16:00',overnight:false};if(shift==='C'||shift==='D')return pattern==='night'?{start:'21:00',end:'09:00',overnight:true}:{start:'09:00',end:'21:00',overnight:false};return null;}
function lmV5ShiftEval(plan,raw){
 if(!plan||plan.cancelled)return {status:plan?.cancelled?'CANCELLED':'NO_PLAN',hours:0,first:null,last:null,extra:null};
 if(plan.kind==='REST'||plan.kind==='LEAVE')return {status:plan.kind,hours:0,first:null,last:null,extra:null};
 const tpl=lmV5ShiftTemplate(plan.shift,plan.pattern,plan.date);if(!tpl)return {status:'INVALID',hours:0};
 const start=lmV5ShiftTime(plan.date,tpl.start),end=lmV5ShiftTime(tpl.overnight?lmV5ShiftAdd(plan.date,1):plan.date,tpl.end);
 // Window of shift with small tolerances. Never pair two punches outside the same shift.
 const stamps=[...new Set(raw.filter(r=>String(r.code)===String(plan.code)).map(r=>Date.parse(String(r.timestamp||(r.date+'T'+r.time)))).filter(n=>Number.isFinite(n)&&n>=start-60*60*1000&&n<=end+60*60*1000))].sort((a,b)=>a-b);
 if(!stamps.length)return {status:'NO_PUNCH',hours:0,first:null,last:null,extra:null};
 if(stamps.length<2)return {status:'SINGLE_PUNCH',hours:0,first:new Date(stamps[0]).toISOString(),last:null,extra:null};
 const first=stamps[0],last=stamps[stamps.length-1],hours=Math.max(0,(last-first)/3600000);
 let extra=null;
 if(plan.shift==='A'){
  const extraStart=lmV5ShiftTime(plan.date,'17:00'),extraEnd=lmV5ShiftTime(plan.date,'21:00');
  extra=Math.max(0,Math.min(last,extraEnd)-Math.max(first,extraStart))/3600000;
 }
 // B/C monthly overtime cannot be inferred from a single day; D uses credited days, not hours.
 return {status:'PAIRED',hours:Math.round(hours*100)/100,first:new Date(first).toISOString(),last:new Date(last).toISOString(),extra:plan.kind==='CANCEL_REST'?Math.round(hours*100)/100:extra===null?null:Math.round(extra*100)/100,punches:stamps.length,restRecall:plan.kind==='CANCEL_REST'};
}
function lmV5ShiftClose(){document.getElementById('lm-v5-shift-modal')?.remove();}
function lmV5ShiftOpen(){
 if(!portalIsAdmin()){lmDialog(lmV5ShiftT('تحتاج صلاحية إدارية موثقة. صلاحيات المديرين ستُفعّل بعد إنشاء حسابات Firebase Auth وربطها.','Verified admin required. Manager access requires Firebase Auth identity mapping.'));return;}
 lmV5ShiftClose();const wrap=document.createElement('div');wrap.id='lm-v5-shift-modal';wrap.style.cssText='position:fixed;inset:0;z-index:100001;background:rgba(1,8,20,.88);display:flex;align-items:center;justify-content:center;padding:14px';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');
 wrap.innerHTML=`<div dir="${currentLang==='ar'?'rtl':'ltr'}" style="background:#0e1b31;border:1px solid #2676a0;border-radius:18px;padding:20px;width:min(1180px,98vw);max-height:94vh;overflow:auto;color:#e2e8f0"><div class="flex justify-between items-center mb-3"><h2 class="font-bold text-sky-300 text-xl">${lmV5ShiftT('إدارة الورديات — V5','Shift management — V5')}</h2><button type="button" class="portal-ghost-btn" onclick="lmV5ShiftClose()">✕</button></div><p class="text-amber-300 text-xs mb-3">${lmV5ShiftT('وضع تجريبي: حسابات الساعات تقديرية ولا تُرحّل إلى المرتبات. التغييرات تحفظ في سجل منفصل بعد تأكيدك.','Pilot: hours are provisional, not payroll. Plans save separately after confirmation.')}</p><div class="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3"><label>${lmV5ShiftT('الإدارة','Department')}<select class="hr-feature-input w-full" id="lm-v5-dept" onchange="lmV5ShiftRefresh()"></select></label><label>${lmV5ShiftT('ابحث بالكود أو الاسم','Code / name')}<input class="hr-feature-input w-full" id="lm-v5-search" oninput="lmV5ShiftRefresh()" placeholder="109"></label><label>${lmV5ShiftT('من','From')}<input class="hr-feature-input w-full" id="lm-v5-from" type="date" onchange="lmV5ShiftRefresh()"></label><label>${lmV5ShiftT('إلى','To')}<input class="hr-feature-input w-full" id="lm-v5-to" type="date" onchange="lmV5ShiftRefresh()"></label><label>${lmV5ShiftT('الوردية','Shift')}<select class="hr-feature-input w-full" id="lm-v5-type"><option>A</option><option>B</option><option>C</option><option>D</option></select></label></div><div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3"><label>${lmV5ShiftT('النمط','Pattern')}<select class="hr-feature-input w-full" id="lm-v5-pattern"><option value="short">09:00–16:00</option><option value="long">09:00–21:00</option><option value="night">21:00–09:00</option></select></label><label>${lmV5ShiftT('الإجراء','Action')}<select class="hr-feature-input w-full" id="lm-v5-action"><option value="WORK">${lmV5ShiftT('تعيين/تغيير وردية','Assign/change shift')}</option><option value="CANCEL">${lmV5ShiftT('إلغاء وردية','Cancel shift')}</option><option value="CANCEL_REST">${lmV5ShiftT('إلغاء راحة','Cancel rest')}</option></select></label><label class="md:col-span-2">${lmV5ShiftT('سبب التغيير أو الإلغاء','Reason')}<input class="hr-feature-input w-full" id="lm-v5-reason" maxlength="250" placeholder="${lmV5ShiftT('سبب إلزامي','Required reason')}"></label></div><div class="flex flex-wrap gap-2 mb-3"><button class="portal-action-btn px-4 py-2" onclick="lmV5ShiftApply()">${lmV5ShiftT('تطبيق على الموظفين المحددين','Apply to selected employees')}</button><button class="portal-ghost-btn px-4 py-2" onclick="lmV5ShiftExport()">${lmV5ShiftT('تصدير تقرير CSV','Export CSV')}</button><button class="portal-ghost-btn px-4 py-2" onclick="lmV5ShiftLoad()">${lmV5ShiftT('تحديث البيانات','Refresh')}</button></div><div id="lm-v5-message" class="text-xs text-sky-300 mb-2"></div><div id="lm-v5-table" class="overflow-x-auto text-sm"></div></div>`;
 wrap.addEventListener('click',e=>{if(e.target===wrap)lmV5ShiftClose()});document.body.append(wrap);
 const de=document.getElementById('lm-v5-dept');de.innerHTML='<option value="">'+lmV5ShiftT('كل الإدارات','All departments')+'</option>'+Object.entries(LMV5_DEPT_LABELS).map(([k,v])=>'<option value="'+k+'">'+hrEscape(v[currentLang==='ar'?0:1])+'</option>').join('');
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());document.getElementById('lm-v5-from').value=today;document.getElementById('lm-v5-to').value=today;lmV5ShiftLoad();
}
async function lmV5ShiftLoad(){const msg=document.getElementById('lm-v5-message');if(!msg)return;msg.textContent=lmV5ShiftT('جاري تحميل الورديات...','Loading shifts...');try{const [a,b]=await Promise.all([db.ref('shift_plans').once('value'),db.ref('shift_audit').limitToLast(100).once('value')]);lmV5ShiftState.plans=a.val()||{};lmV5ShiftState.audit=b.val()||{};msg.textContent='';lmV5ShiftRefresh()}catch(e){msg.textContent=lmV5ShiftT('تعذر القراءة: ','Read failed: ')+e.message;}}
function lmV5ShiftEmployees(){const dept=document.getElementById('lm-v5-dept')?.value||'',q=lmV5Norm(document.getElementById('lm-v5-search')?.value||'');return (allEmployees||[]).filter(e=>{const code=getEmployeeCode(e);return code&&lmV5ShiftAllowed(e)&&(!dept||lmV5ShiftScope(e)===dept)&&(!q||lmV5Norm(code).includes(q)||lmV5Norm(e['اسم الموظف ']||'').includes(q)||lmV5Norm(e['emp_name _en']||'').includes(q));});}
function lmV5ShiftRefresh(){const table=document.getElementById('lm-v5-table');if(!table)return;const emps=lmV5ShiftEmployees(),from=document.getElementById('lm-v5-from')?.value,to=document.getElementById('lm-v5-to')?.value;let dates=[];if(lmV5ShiftDay(from)&&lmV5ShiftDay(to)&&from<=to){for(let d=from;d<=to&&dates.length<32;d=lmV5ShiftAdd(d,1))dates.push(d)}if(lmV5ShiftDate(from)&&lmV5ShiftDate(to)&&(lmV5ShiftDate(to)-lmV5ShiftDate(from))/86400000>=32){table.textContent=lmV5ShiftT('الحد الأقصى 32 يومًا','Maximum range 32 days');return;}if(!dates.length){table.textContent=lmV5ShiftT('اختر نطاق تاريخ صحيحًا حتى 32 يومًا','Choose a valid range up to 32 days');return;}
 const rows=[];for(const e of emps)for(const date of dates){const code=getEmployeeCode(e),key=lmV5ShiftKey(code,date);rows.push({code,date,name:getEmployeeName(e),dept:lmV5ShiftScope(e),plan:lmV5ShiftState.plans[key]||null});}
 lmV5ShiftState.rows=rows;table.innerHTML='<p class="text-xs text-slate-400 mb-2">'+rows.length+' '+lmV5ShiftT('صف · حدد الموظفين المطلوب تعديلهم','rows · select employees to edit')+'</p><table class="hr-feature-table w-full"><thead><tr>'+[lmV5ShiftT('تحديد','Select'),lmV5ShiftT('الكود','Code'),lmV5ShiftT('الموظف','Employee'),lmV5ShiftT('التاريخ','Date'),lmV5ShiftT('الوردية','Shift'),lmV5ShiftT('الحالة','Status'),lmV5ShiftT('السبب','Reason')].map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+rows.slice(0,400).map((r,i)=>'<tr><td><input type="checkbox" class="lm-v5-check" value="'+i+'"></td><td>'+hrEscape(r.code)+'</td><td>'+hrEscape(r.name)+'</td><td>'+r.date+'</td><td>'+hrEscape(r.plan?.shift||'—')+' '+hrEscape(r.plan?.pattern||'')+'</td><td>'+hrEscape(r.plan?.kind||'—')+'</td><td>'+hrEscape(r.plan?.reason||'')+'</td></tr>').join('')+'</tbody></table>'+(rows.length>400?'<p class="text-amber-300">'+lmV5ShiftT('أول 400 صف فقط؛ ضيق الفلاتر للتعديل','Showing 400 rows; narrow filters to edit')+'</p>':'');}
async function lmV5ShiftApply(){const msg=document.getElementById('lm-v5-message');if(!portalIsAdmin())return;const indexes=[...document.querySelectorAll('.lm-v5-check:checked')].map(x=>Number(x.value)),rows=indexes.map(i=>lmV5ShiftState.rows[i]).filter(Boolean);if(!rows.length){msg.textContent=lmV5ShiftT('حدد موظفًا واحدًا على الأقل','Select employees');return;}if(rows.length>100){msg.textContent=lmV5ShiftT('الحد الأقصى 100 تعديل في المرة','Maximum 100 changes');return;}
 const shift=document.getElementById('lm-v5-type').value,pattern=document.getElementById('lm-v5-pattern').value,action=document.getElementById('lm-v5-action').value,reason=document.getElementById('lm-v5-reason').value.trim();if(reason.length<4){msg.textContent=lmV5ShiftT('اكتب سببًا واضحًا (4 أحرف على الأقل)','Enter a reason (at least 4 characters)');return;}
 if(shift==='A'&&pattern!=='short'&&(action==='WORK'||action==='CANCEL_REST')){msg.textContent=lmV5ShiftT('الوردية A أساسية 09–16، والإضافي 17–21؛ اختر النمط القصير','Shift A is 09–16, overtime 17–21; select short');return;}
 if(shift==='C'&&pattern==='short'&&(action==='WORK'||action==='CANCEL_REST')){msg.textContent=lmV5ShiftT('الوردية C تتطلب 12 ساعة صباحًا أو ليلًا','Shift C requires 12-hour day/night');return;}
 const ok=await lmDialog(lmV5ShiftT('تأكيد حفظ '+rows.length+' تعديل وردية مع تسجيل التدقيق؟','Save '+rows.length+' shift changes with audit trail?'),true);if(!ok)return;
 msg.textContent=lmV5ShiftT('جاري الحفظ...','Saving...');const updates={};const uid=portalAuth.currentUser.uid,now=firebase.database.ServerValue.TIMESTAMP;
 for(const r of rows){const key=lmV5ShiftKey(r.code,r.date),previous=lmV5ShiftState.plans[key]||null,plan={code:r.code,date:r.date,shift,pattern,kind:action,cancelled:action==='CANCEL',reason,department:r.dept,updatedBy:uid,updatedByCode:'778',updatedAt:now};updates['shift_plans/'+key]=plan;const auditKey=db.ref('shift_audit').push().key;updates['shift_audit/'+auditKey]={key,code:r.code,date:r.date,previous:previous||{},next:plan,actorUid:uid,actorCode:'778',at:now,reason};}
 try{await db.ref().update(updates);msg.textContent=lmV5ShiftT('تم الحفظ مع سجل التدقيق','Saved with audit trail');await lmV5ShiftLoad()}catch(e){msg.textContent=lmV5ShiftT('فشل الحفظ: ','Save failed: ')+e.message;}}
function lmV5ShiftExport(){const rows=lmV5ShiftState.rows||[];if(!rows.length)return;const cols=['code','name','department','date','shift','pattern','kind','reason'];const q=x=>'"'+String(x??'').replace(/"/g,'""')+'"';const csv='\ufeff'+[cols.join(','),...rows.map(r=>[r.code,r.name,r.dept,r.date,r.plan?.shift,r.plan?.pattern,r.plan?.kind,r.plan?.reason].map(q).join(','))].join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='shift_plans_v5.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

/* V5.5.4: pure chronological overtime ledger. Cancellation debits carry forward
   without approval, but never erase source events or create negative payable hours.
   Call with time-ordered events {date, type:'EARN'|'CANCEL', hours?, id?}.
   Cancellation always debits seven hours, regardless of an event's hours field. */
function lmV554OvertimeLedger(events, openingDebit=0){
 const round=n=>Math.round(n*100)/100;
 let debt=Math.max(0,Number(openingDebit)||0),payable=0;
 const seen=new Set(),history=[];
 const sorted=[...(Array.isArray(events)?events:[])].sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.id||'').localeCompare(String(b.id||'')));
 for(const event of sorted){
  if(!event||!['EARN','CANCEL'].includes(event.type))continue;
  const id=String(event.id||'');if(id&&seen.has(id))continue;if(id)seen.add(id);
  if(event.type==='CANCEL'){
   const offset=Math.min(payable,7);payable=round(payable-offset);debt=round(debt+7-offset);
  }else{
   const hours=Number(event.hours);if(!Number.isFinite(hours)||hours<=0)continue;
   const offset=Math.min(debt,hours);debt=round(debt-offset);payable=round(payable+hours-offset);
  }
  history.push({id,date:event.date,type:event.type,payableHours:payable,carriedDebitHours:debt});
 }
 return {payableHours:round(payable),carriedDebitHours:round(debt),history};
}
/* V5.5 deterministic shift rules: calculations only, never payroll posting. */

function lmV55ShiftMonthly(shift, entries){
 const items=Array.isArray(entries)?entries:[];
 const worked=items.reduce((n,x)=>n+(x.status==='PAIRED'&&Number.isFinite(Number(x.hours))?Math.max(0,Number(x.hours)):0),0);
 const missing=items.filter(x=>x.status==='SINGLE_PUNCH'||x.status==='NO_PUNCH'||x.status==='INVALID').length;
 const round=n=>Math.round(n*100)/100;
 if(shift==='A')return {shift,workedHours:round(worked),overtimeHours:round(items.reduce((n,x)=>n+(Number(x.extra)||0),0)),incompleteDays:missing,ready:missing===0&&items.length>0};
 if(shift==='B'||shift==='C'){
  const target=shift==='B'?154:132;
  const cancelled=shift==='C'?items.filter(x=>x.status==='CANCELLED').length:0;
  const restRecall=shift==='C'?items.reduce((n,x)=>n+(x.restRecall===true&&x.status==='PAIRED'?Math.max(0,Number(x.hours)||0):0),0):0;
  return {shift,targetHours:target,workedHours:round(worked),overtimeHours:round(Math.max(0,Math.max(0,worked-restRecall-target)+restRecall-cancelled*7)),carriedDebitHours:round(Math.max(0,cancelled*7-(Math.max(0,worked-restRecall-target)+restRecall))),cancelledShifts:cancelled,restRecallHours:round(restRecall),incompleteDays:missing,ready:missing===0&&items.length>0};
 }
 if(shift==='D'){
  const credited=items.filter(x=>['PAIRED','LEAVE','REST','CANCELLED','SICK'].includes(x.status)).length;
  return {shift,targetDays:19,creditedDays:Math.min(19,credited),differenceDays:19-credited,workedHours:round(worked),overtimeHours:null,incompleteDays:missing,ready:missing===0&&credited>=19};
 }
 return {shift,error:'UNKNOWN_SHIFT',ready:false};
}



// Annual raise: read-only preview. No employee/Firebase writes are performed.
// Company policy: count any partial hiring month as a full calendar month.
const LM_ANNUAL_RAISE = Object.freeze({
  calculate({hireDate,decemberInsuranceWage,decemberGross,year,rate=7}){
    const yr=Number(year),pct=Number(rate),w=Number(decemberInsuranceWage),gross=Number(decemberGross);
    const h=lm8Date(hireDate);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(h)||!Number.isInteger(yr)||yr<2000||yr>2100||!Number.isFinite(pct)||pct<0||pct>100||!Number.isFinite(w)||w<=0||!Number.isFinite(gross)||gross<0)return {ok:false,reason:'INVALID_INPUT'};
    const [hy,hm,hd]=h.split('-').map(Number);
    if(hm<1||hm>12||hd<1||hd>31||new Date(Date.UTC(hy,hm-1,hd)).toISOString().slice(0,10)!==h)return {ok:false,reason:'INVALID_HIRE_DATE'};
    // January of year Y uses the previous December wage; hires in Y are ineligible.
    if(hy>=yr)return {ok:false,reason:'NOT_HIRED_BY_DECEMBER'};
    const months=hy<yr-1?12:13-hm;
    const effectiveRate=pct*months/12;
    const increase=Math.round((w*effectiveRate/100+Number.EPSILON)*100)/100;
    const updatedGross=Math.round((gross+increase+Number.EPSILON)*100)/100;
    return {ok:true,year:yr,months,rate:pct,effectiveRate,increase,updatedGross,rawSuggestedInsuranceWage:updatedGross/1.3};
  }
});
function lmRaiseNum(v){
 if(typeof v==='number')return Number.isFinite(v)?v:NaN;
 const s=String(v??'').replace(/[\s,،]/g,'').replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c)));
 return s!==''?Number(s):NaN;
}
function lmRaiseField(emp,keys){return lmBField(emp,keys);}
function lmRaiseRow(e,year,rate){
 const hire=lmRaiseField(e,['تاريخ التعيين','date_of_hiring','hireDate','hire date']);
 const wage=lmRaiseNum(lmRaiseField(e,['أجر الاشتراك التأميني','insuranceContributionWage','insuranceWage','insuredWage']));
 const gross=lmRaiseNum(lmRaiseField(e,['الراتب الشامل','المرتب الشامل','gross salary','gross_salary','total salary','الشامل','الاجر الشامل','الأجر الشامل','comprehensiveSalary','grossSalary']));
 const calc=LM_ANNUAL_RAISE.calculate({hireDate:hire,decemberInsuranceWage:wage,decemberGross:gross,year,rate});
 // The current employee record is NOT a historical December snapshot.
 return {e,hire:lm8Date(hire)||'',wage,gross,calc};
}
function lmAnnualRaisePreview(){
 const d=document.getElementById('hr-payroll-view');if(!d)return;
 const year=Number(document.getElementById('lm-raise-year')?.value)||2027;
 const rate=Number(document.getElementById('lm-raise-rate')?.value??7);
 const rows=allEmployees.map(e=>lmRaiseRow(e,year,rate));
 const valid=rows.filter(r=>r.calc.ok);
 d.innerHTML=`<h1 class="text-2xl font-extrabold mb-2">${hrText('المرتبات — محاكاة العلاوة السنوية','Payroll — Annual raise preview')}</h1>
 <p class="text-amber-300 text-sm mb-4">${hrText('معاينة فقط — لا يتم تعديل أي بيانات. الأجور المعروضة من سجل الموظف الحالي وليست بالضرورة أرصدة ديسمبر التاريخية. لا تعتمد النتائج للصرف أو نموذج س2 قبل إدخال لقطة ديسمبر المعتمدة.','READ ONLY — no records are modified. Current employee wages are NOT verified December snapshots. Do not use for payment or Form S2 before approved December balances are loaded.')}</p>
 <div class="glass-card rounded-2xl p-4 mb-4 flex flex-wrap gap-4 items-end"><label>${hrText('سنة صرف علاوة يناير','January raise year')}<input id="lm-raise-year" type="number" min="2020" max="2100" value="${year}" class="block mt-1 p-2 bg-slate-900 border border-slate-600 rounded-lg w-32" onchange="lmAnnualRaisePreview()"></label><label>${hrText('نسبة قرار الشركة %','Company rate %')}<input id="lm-raise-rate" type="number" min="0" max="100" step="0.1" value="${rate}" class="block mt-1 p-2 bg-slate-900 border border-slate-600 rounded-lg w-32" onchange="lmAnnualRaisePreview()"></label><button type="button" class="portal-action-btn px-4 py-2 rounded-lg" onclick="lmRaiseExport()">${hrText('تصدير معاينة CSV','Export preview CSV')}</button></div>
 <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">${hrCard(hrText('إجمالي الموظفين','Employees'),rows.length)}${hrCard(hrText('قابل للحساب مبدئيًا','Preliminary calculations'),valid.length)}${hrCard(hrText('سجلات ناقصة أو غير مؤهلة','Missing/ineligible'),rows.length-valid.length)}</div>
 <div class="glass-card rounded-2xl overflow-x-auto"><table class="w-full text-xs"><thead class="bg-slate-900/70 text-sky-300"><tr>${[hrText('الموظف','Employee'),hrText('تاريخ التعيين','Hire date'),hrText('شهور الخدمة','Months'),hrText('أجر الاشتراك المرجعي*','Reference insured wage*'),hrText('الشامل المرجعي*','Reference gross*'),hrText('نسبة مستحقة','Effective %'),hrText('قيمة العلاوة','Raise'),hrText('الشامل المقترح','Suggested gross'),hrText('الحالة','Status')].map(x=>`<th class="p-3 text-start whitespace-nowrap">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>{const c=r.calc;const fmt=n=>Number.isFinite(n)?n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'—';return `<tr class="border-t border-slate-700/50"><td class="p-3">${escapeHtml(getEmployeeName(r.e))}</td><td class="p-3">${escapeHtml(r.hire)}</td><td class="p-3">${c.ok?c.months:'—'}</td><td class="p-3">${fmt(r.wage)}</td><td class="p-3">${fmt(r.gross)}</td><td class="p-3">${c.ok?c.effectiveRate.toFixed(4)+'%':'—'}</td><td class="p-3">${c.ok?fmt(c.increase):'—'}</td><td class="p-3">${c.ok?fmt(c.updatedGross):'—'}</td><td class="p-3">${c.ok?hrText('محاكاة','Preview'):escapeHtml(c.reason)}</td></tr>`}).join('')}</tbody></table></div><p class="text-xs text-slate-400 mt-3">* ${hrText('يلزم اعتماد أجر اشتراك وشامل ديسمبر السابق؛ لا يتم تغيير أجر الاشتراك الرسمي أو تطبيق سقف سنة جديدة تلقائيًا.','Previous December insured wage and gross must be verified. Official insured wages and annual caps are never auto-updated.')}</p>`;
}
function lmRaiseExport(){
 const year=Number(document.getElementById('lm-raise-year')?.value)||2027,rate=Number(document.getElementById('lm-raise-rate')?.value??7);
 const csv=[['Employee','Hire date','Months','Reference insured wage (unverified)','Reference gross (unverified)','Rate %','Raise','Suggested gross','Status'],...allEmployees.map(e=>{const r=lmRaiseRow(e,year,rate),c=r.calc;return [getEmployeeName(e),r.hire,c.ok?c.months:'',Number.isFinite(r.wage)?r.wage:'',Number.isFinite(r.gross)?r.gross:'',c.ok?c.effectiveRate:'',c.ok?c.increase:'',c.ok?c.updatedGross:'',c.ok?'PREVIEW_ONLY':c.reason]})].map(row=>row.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
 const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`annual_raise_preview_${year}.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}


/* V5.5.6 integrated payroll calculation workbench — simulation only, no DB writes. */
const lmPayrollState={overrides:{},results:[],month:new Date().toISOString().slice(0,7),taxPhone:0.2,taxTransport:0,taxGlasses:0,insuranceMin:2700,insuranceMax:16700};
function lmPayMoney(n){return Number.isFinite(n)?n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'—';}
function lmPayNum(v,defaultValue=0){const n=lmRaiseNum(v);return Number.isFinite(n)?n:defaultValue;}
function lmPayField(e,keys){return lmRaiseField(e,keys);}
function lmPayTax(annual){
 const x=Math.max(0,annual),bands=[[40000,0],[15000,.10],[15000,.15],[130000,.20],[200000,.225],[Infinity,.25]];
 let left=x,tax=0;for(const [size,rate] of bands){const amount=Math.min(left,size);if(amount<=0)break;tax+=amount*rate;left-=amount;}
 return tax;
}
function lmPayRound(n){return Math.round((Number(n)+Number.EPSILON)*100)/100;}
// Source of truth: payroll Word logic. Keep imported insured wage unchanged;
// only derive a wage when none was imported. No live writes in this workbench.
function lmPayInsuredWage(gross, imported){
 const n=lmPayNum(imported,NaN);
 if(Number.isFinite(n)&&n>0)return n;
 if(!(gross>0))return 0;
 return Math.min(lmPayrollState.insuranceMax,Math.max(lmPayrollState.insuranceMin,Math.round(gross/1.3/100)*100));
}
function lmPayCalc(input){
 const n=k=>Math.max(0,lmPayNum(input[k]));
 const gross=n('gross'),phone=n('phone'),transport=n('transport'),glasses=n('glasses'),bonus=n('bonus'),meal=n('meal'),overtime=n('overtime'),other=n('other');
 const penalty=n('penalty'),loan=n('loan'),medical=n('medical'),absence=n('absence'),lateness=n('lateness');
 // Gross is already inclusive of allowances for imported Lacto Misr salaries.
 // 'included' false is an explicit exception for separately paid allowances.
 const included=input.included!==false&&input.included!==0;
 const extraAllowances=included?0:phone+transport+glasses+bonus+meal;
 const earning=lmPayRound(gross+extraAllowances+overtime+other);
 const insuredWage=lmPayInsuredWage(gross,input.insurance);
 const insuranceEmployee=input.insured===false?0:lmPayRound(insuredWage*.11);
 const employerInsurance=input.insured===false?0:lmPayRound(insuredWage*.1875);
 const martyrs=lmPayRound(earning*.0005);
 // Phone: 20% taxable; transport: exempt. The other exclusions are user-editable
 // preview assumptions, not a statutory claim about their tax treatment.
 const excluded=lmPayRound(phone*(1-lmPayrollState.taxPhone)+transport*(1-lmPayrollState.taxTransport)+glasses*(1-lmPayrollState.taxGlasses));
 const taxableMonth=Math.max(0,lmPayRound(earning-excluded-insuranceEmployee-penalty-absence-lateness-medical-martyrs));
 // Word document explicitly applies the annual tax formula directly to the
 // annualized taxable base (first 40,000 is zero-rated). Do not subtract an
 // additional 20,000: that would double-apply a personal allowance.
 const annualTaxable=lmPayRound(taxableMonth*12);
 const tax=input.secondary===true?lmPayRound(earning*.10):lmPayRound(lmPayTax(annualTaxable)/12);
 const deductions=lmPayRound(insuranceEmployee+tax+martyrs+penalty+loan+medical+absence+lateness);
 return {earning,insuredWage,insuranceEmployee,employerInsurance,excluded,taxableMonth,annualTaxable,tax,martyrs,deductions,net:lmPayRound(earning-deductions),penalty,loan,medical,absence,lateness};
}
function lmPayEmployee(e){
 const code=getEmployeeCode(e),base={gross:lmPayNum(lmPayField(e,['الراتب الشامل','المرتب الشامل','gross salary','gross_salary','total salary','الشامل','الاجر الشامل','الأجر الشامل','comprehensiveSalary','grossSalary'])),insurance:lmPayNum(lmPayField(e,['أجر الاشتراك التأميني','insuranceContributionWage','insuranceWage','insuredWage'])),phone:0,transport:0,glasses:0,bonus:0,meal:0,overtime:0,other:0,penalty:0,loan:0,medical:0,absence:0,lateness:0,included:1,insured:!!lmPayNum(lmPayField(e,['أجر الاشتراك التأميني','insuranceContributionWage','insuranceWage','insuredWage'])),secondary:false};
 return {...base,...(lmPayrollState.overrides[code]||{})};
}
function lmPayEdit(code,key,value){
 if(!lmPayrollState.overrides[code])lmPayrollState.overrides[code]={};
 lmPayrollState.overrides[code][key]=['insured','secondary'].includes(key)?value==='true':lmPayNum(value);
 lmPayRenderRows();
}
function lmPayRenderRows(){
 const target=document.getElementById('lm-payroll-table');if(!target)return;
 const q=String(document.getElementById('lm-pay-search')?.value||'').trim().toLowerCase();
 const employees=allEmployees.filter(e=>!q||String(getEmployeeCode(e)).toLowerCase()===q||getEmployeeName(e).toLowerCase().includes(q));
 lmPayrollState.results=employees.map(e=>({e,code:getEmployeeCode(e),input:lmPayEmployee(e)})).map(r=>({...r,calc:lmPayCalc(r.input)}));
 const columns=[['gross','الشامل / Gross'],['insurance','أجر الاشتراك / Insured wage'],['phone','اتصال / Phone'],['transport','انتقال / Transport'],['glasses','نظارة / Glasses'],['bonus','حافز / Bonus'],['meal','وجبة / Meal'],['overtime','إضافي مالي / OT'],['other','استحقاقات أخرى / Other'],['penalty','جزاء / Penalty'],['loan','قسط / Loan'],['medical','طبي / Medical'],['absence','غياب / Absence'],['lateness','تأخير / Lateness']];
 target.innerHTML=`<table class="hr-feature-table w-full text-xs"><thead><tr><th>Code / الكود</th><th>Name / الاسم</th>${columns.map(x=>`<th>${x[1]}</th>`).join('')}<th>Insured?</th><th>Other employer?</th><th>Tax / الضريبة</th><th>Insurance / التأمين</th><th>Martyrs / الشهداء</th><th>Net / الصافي</th><th>تفاصيل / Details</th></tr></thead><tbody>${lmPayrollState.results.map(r=>`<tr><td>${escapeHtml(r.code)}</td><td>${escapeHtml(getEmployeeName(r.e))}</td>${columns.map(([key])=>`<td><input aria-label="${key} ${escapeHtml(r.code)}" class="hr-feature-input" style="width:95px" type="text" inputmode="decimal" value="${lmPayMoney(lmPayNum(r.input[key])).replace(/,/g,'')}" onchange="lmPayEdit('${escapeHtml(r.code)}','${key}',this.value)"></td>`).join('')}<td><select class="hr-feature-input" onchange="lmPayEdit('${escapeHtml(r.code)}','insured',this.value)"><option value="true" ${r.input.insured?'selected':''}>Yes</option><option value="false" ${!r.input.insured?'selected':''}>No</option></select></td><td><select class="hr-feature-input" onchange="lmPayEdit('${escapeHtml(r.code)}','secondary',this.value)"><option value="false" ${!r.input.secondary?'selected':''}>No</option><option value="true" ${r.input.secondary?'selected':''}>10% withholding</option></select></td><td>${lmPayMoney(r.calc.tax)}</td><td>${lmPayMoney(r.calc.insuranceEmployee)}</td><td>${lmPayMoney(r.calc.martyrs)}</td><td class="font-bold">${lmPayMoney(r.calc.net)}</td><td><button class="portal-ghost-btn" onclick="lmPayDetails(decodeURIComponent('${encodeURIComponent(r.code)}'))">${hrText('عرض الحسبة','Breakdown')}</button></td></tr>`).join('')}</tbody></table>`;
 const count=document.getElementById('lm-pay-summary');if(count){const total=lmPayrollState.results.reduce((a,r)=>a+r.calc.net,0);count.textContent=`${employees.length} employees / موظف — Net total / إجمالي الصافي: ${lmPayMoney(total)} EGP`}
}
function lmPayCloseDetails(){document.getElementById('lm-pay-modal')?.remove();}
function lmPayDetails(code){
 const r=lmPayrollState.results.find(x=>String(x.code)===String(code));if(!r)return;
 lmPayCloseDetails();
 const c=r.calc,lines=[['الأجر الشامل / Gross',r.input.gross],['أجر الاشتراك المستخدم / Insured wage',c.insuredWage],['حصة صاحب العمل التأمينية / Employer insurance (not employee deduction)',c.employerInsurance],['الإضافي النقدي / Overtime',r.input.overtime],['استحقاقات أخرى / Other',r.input.other],['إجمالي الاستحقاقات / Earnings',c.earning],['تأمينات الموظف / Insurance',c.insuranceEmployee],['الإعفاءات الضريبية المحسوبة / Tax exclusions',c.excluded],['الغياب / Absence',c.absence],['التأخير / Lateness',c.lateness],['الوعاء الشهري / Monthly tax base',c.taxableMonth],['الوعاء السنوي بعد الإعفاء الشخصي / Annual tax base',c.annualTaxable],['ضريبة الدخل / Income tax',c.tax],['صندوق الشهداء / Martyrs',c.martyrs],['إجمالي الاستقطاعات / Deductions',c.deductions],['صافي المرتب / Net',c.net]];
 const modal=document.createElement('div');modal.id='lm-pay-modal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Payroll breakdown');
 modal.style.cssText='position:fixed;inset:0;z-index:99999;background:#020617c9;display:flex;align-items:center;justify-content:center;padding:12px';
 modal.onclick=e=>{if(e.target===modal)lmPayCloseDetails()};
 modal.innerHTML='<div style="background:#101f37;border:1px solid #38bdf8;border-radius:18px;padding:20px;width:min(760px,100%);max-height:90vh;overflow:auto;color:#e2e8f0" dir="'+(currentLang==='ar'?'rtl':'ltr')+'"><div style="display:flex;justify-content:space-between;gap:16px;align-items:center"><h3 class="font-bold text-lg">'+escapeHtml(getEmployeeName(r.e))+' — '+escapeHtml(r.code)+'</h3><button type="button" id="lm-pay-modal-close" class="portal-ghost-btn" aria-label="Close">✕ إغلاق</button></div><div class="grid grid-cols-1 md:grid-cols-2 gap-2">'+lines.map(([k,v])=>'<div style="display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #64748b55;padding:8px"><span>'+k+'</span><strong>'+lmPayMoney(v)+'</strong></div>').join('')+'</div><p class="text-amber-300 text-xs mt-3">'+hrText('عرض حسابي تجريبي؛ غير معتمد للصرف.','Calculation preview; not approved for payment.')+'</p></div>';
 document.body.appendChild(modal);modal.querySelector('#lm-pay-modal-close').onclick=lmPayCloseDetails;modal.querySelector('button').focus();
}
if(!window.__lmPayEscapeBound){window.__lmPayEscapeBound=true;document.addEventListener('keydown',e=>{if(e.key==='Escape')lmPayCloseDetails()});}
function lmPayParseCSV(text){
 const rows=[],line=[];let cell='',quoted=false;
 for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted;}else if(ch===','&&!quoted){line.push(cell);cell='';}else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&text[i+1]==='\n')i++;line.push(cell);if(line.some(x=>x.trim()))rows.push(line.slice());line.length=0;cell='';}else cell+=ch;}
 line.push(cell);if(line.some(x=>x.trim()))rows.push(line);return rows;
}
async function lmPayImport(file){
 if(!file)return;const box=document.getElementById('lm-pay-import-status');
 try{
 const rows=lmPayParseCSV((await file.text()).replace(/^\ufeff/,''));if(rows.length<2)throw Error('CSV empty');
 const keys=['gross','insurance','phone','transport','glasses','bonus','meal','overtime','other','penalty','loan','medical','absence','lateness'];
 const heads=rows[0].map(x=>x.trim().toLowerCase());const codeIndex=heads.findIndex(x=>['code','employee code','employee_code','كود الموظف','الكود'].includes(x));if(codeIndex<0)throw Error('Missing Code column');
 const staged=[],errors=[];const known=new Set(allEmployees.map(e=>String(getEmployeeCode(e)).trim()));
 rows.slice(1).forEach((row,i)=>{const code=String(row[codeIndex]||'').trim();if(!known.has(code)){errors.push('Row '+(i+2)+': unknown code '+code);return;}const change={};for(const key of keys){const ix=heads.indexOf(key);if(ix<0||!String(row[ix]||'').trim())continue;const raw=String(row[ix]).trim();if(!/^[-+]?\d+(?:\.\d+)?$/.test(raw)){errors.push('Row '+(i+2)+': invalid '+key);continue;}change[key]=Number(raw);}if(Object.keys(change).length)staged.push({code,change});});
 if(errors.length){box.textContent='Import blocked / الاستيراد موقوف: '+errors.slice(0,8).join(' | ');return;}
 const unique=new Set(staged.map(x=>x.code));if(unique.size!==staged.length)throw Error('Duplicate employee codes in CSV');
 if(!confirm('Apply '+staged.length+' CSV rows to local payroll preview only? No Firebase writes. / تطبيق '+staged.length+' صف على المعاينة فقط؟'))return;
 for(const {code,change} of staged)lmPayrollState.overrides[code]={...(lmPayrollState.overrides[code]||{}),...change};
 box.textContent='Imported '+staged.length+' rows into local preview. No Firebase writes / تم تحميل '+staged.length+' صف للمعاينة دون حفظ في قاعدة البيانات.';lmPayRenderRows();
 }catch(e){box.textContent='Import error / خطأ الاستيراد: '+e.message;}
}
function lmPayReadiness(){
 const all=allEmployees.map(e=>({code:String(getEmployeeCode(e)),name:getEmployeeName(e),input:lmPayEmployee(e)}));
 const issues=[];
 for(const r of all){
  if(!(r.input.gross>0))issues.push({code:r.code,name:r.name,reason:hrText('الراتب الشامل غير موجود','Gross salary missing')});
  for(const k of ['gross','insurance','phone','transport','glasses','bonus','meal','overtime','other','penalty','loan','medical','absence','lateness']){
   const v=Number(r.input[k]||0);
   if(!Number.isFinite(v)||v<0)issues.push({code:r.code,name:r.name,reason:k+': '+hrText('قيمة غير صالحة','Invalid amount')});
  }
 }
 return {count:all.length,issues};
}
function lmPayShowReadiness(){
 const box=document.getElementById('lm-pay-readiness');if(!box)return;
 const check=lmPayReadiness();
 const status=check.issues.length?hrText('غير جاهز للاعتماد','Not ready for approval'):hrText('المدخلات الأساسية مكتملة؛ ما زالت مراجعة الحضور والورديات والمالية مطلوبة','Basic inputs complete; attendance, shifts and Finance reviews still required');
 box.innerHTML='<p class="font-bold mb-2">'+check.count+' '+hrText('موظف','employees')+' — '+check.issues.length+' '+hrText('ملاحظة','issues')+' — '+status+'</p>'+
 check.issues.slice(0,100).map(x=>'<p class="text-xs">'+escapeHtml(x.code)+' — '+escapeHtml(x.name)+' — '+escapeHtml(x.reason)+'</p>').join('');
}
function lmPayExport(){
 const headers=['Code','Name','Gross','Insurance Wage','Phone','Transport','Glasses','Bonus','Meal','Overtime','Other','Penalty','Loan','Medical','Absence','Lateness','Insured','Secondary employer','Earnings','Insurance deduction','Tax base monthly','Tax base annual','Income tax','Martyrs fund','Total deductions','Net','Status'];
 const lines=[headers,...lmPayrollState.results.map(r=>[r.code,getEmployeeName(r.e),...['gross','insurance','phone','transport','glasses','bonus','meal','overtime','other','penalty','loan','medical','absence','lateness'].map(k=>r.input[k]),r.input.insured,r.input.secondary,r.calc.earning,r.calc.insuranceEmployee,r.calc.taxableMonth,r.calc.annualTaxable,r.calc.tax,r.calc.martyrs,r.calc.deductions,r.calc.net,'SIMULATION_NOT_APPROVED'])];
 const csv='\ufeff'+lines.map(row=>row.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='payroll_simulation_'+lmPayrollState.month+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function lmAnnualRaisePreview(){
 const root=document.getElementById('hr-payroll-view');if(!root)return;
 root.innerHTML=`<h1 class="text-2xl font-bold mb-3">${hrText('المرتبات — ورشة الحساب والمراجعة','Payroll — Calculation workbench')}</h1><p class="text-amber-300 mb-4 text-sm">${hrText('محاكاة فقط: لا حفظ ولا صرف ولا ترحيل إلى Firebase. راجع ضريبة جهة العمل غير الأصلية وإعفاءات البدلات مع مستندات الشركة. قيم البدلات تدخل ضمن الشامل ولا تضاف إليه مرة ثانية. الإضافي النقدي يُضاف منفصلًا.','SIMULATION ONLY: no Firebase writes or posting. Confirm secondary employer withholding and allowance exemptions. Allowances are included in gross; overtime is added separately.')}</p><div class="glass-card rounded-xl p-3 mb-3 flex flex-wrap gap-3 items-end"><label>${hrText('بحث بالكود أو الاسم','Code/name')}<input id="lm-pay-search" class="hr-feature-input block" oninput="lmPayRenderRows()"></label><label>${hrText('الشهر','Month')}<input type="month" class="hr-feature-input block" value="${lmPayrollState.month}" onchange="lmPayrollState.month=this.value"></label><label class="portal-ghost-btn" style="cursor:pointer">${hrText('استيراد CSV','Import CSV')}<input type="file" accept=".csv,text/csv" style="display:none" onchange="lmPayImport(this.files[0]);this.value=''"></label><button class="portal-ghost-btn" onclick="lmPayShowReadiness()">${hrText('فحص جاهزية المرتبات','Payroll readiness check')}</button><button class="portal-action-btn" onclick="lmPayExport()">${hrText('تصدير كشف الحساب CSV','Export payroll CSV')}</button><button class="portal-ghost-btn" onclick="lmPayRaisePage()">${hrText('معاينة العلاوة السنوية','Annual raise preview')}</button></div><p class="text-xs text-slate-300 mb-3">${hrText('تنبيه: إدخال قيم البدلات يدويًا لتوزيع مكونات الشامل ضريبيًا؛ لا تُضاف مرة أخرى. الحساب يفترض شريحة 2024 للدخل السنوي حتى 600 ألف؛ الحالات الأعلى تحتاج إعدادات شرائح خاصة. الأجور والبدلات غير المكتملة لا تصلح للصرف.','Manual allowance allocation is part of gross, not additional pay. 2024 tax bands for incomes up to 600k only; higher incomes need specific brackets. Incomplete inputs are not payroll-ready.')}</p><p id="lm-pay-import-status" class="text-sky-300 text-sm mb-2">CSV: Code, Gross, Insurance, Phone, Transport, Glasses, Bonus, Meal, Overtime, Other, Penalty, Loan, Medical — preview only.</p><div id="lm-pay-readiness" class="text-amber-300 mb-2" aria-live="polite"></div><div id="lm-pay-summary" class="text-sky-300 mb-2"></div><div class="overflow-x-auto glass-card rounded-xl" id="lm-payroll-table"></div><div id="lm-pay-raise" class="mt-4 hidden"></div><div id="lm-pay-pilot-tools" class="mt-4"></div>`;
 lmPayRenderRows();
 lmSafePilotMount();
}
const lmRaiseDraft={rate:7,year:2027,referenceVerified:false};
function lmPayRaisePage(){
 const root=document.getElementById('hr-payroll-view');if(!root)return;
 const year=lmRaiseDraft.year,rate=lmRaiseDraft.rate;
 const rows=allEmployees.map(e=>({code:getEmployeeCode(e),name:getEmployeeName(e),...lmRaiseRow(e,year,rate)}));
 root.innerHTML=`<div class="flex flex-wrap justify-between gap-3 mb-4"><h1 class="text-2xl font-bold">${hrText('العلاوات الدورية السنوية','Annual raises')}</h1><button class="portal-ghost-btn" onclick="lmAnnualRaisePreview()">${hrText('العودة للمرتبات','Back to payroll')}</button></div>
 <p class="text-amber-300 mb-3">${hrText('هذه معاينة مسودة فقط. لا تُغيّر أجور الموظفين أو قاعدة البيانات. يجب اعتماد أجر اشتراك ديسمبر السابق قبل تنفيذ العلاوة.','Draft preview only. No employee wages or database records are changed. Previous December insured wages must be approved before posting.')}</p>
 <div class="glass-card rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-end"><label>${hrText('سنة العلاوة','Raise year')}<input id="lm-raise-work-year" type="text" inputmode="numeric" class="hr-feature-input block" value="${year}"></label><label>${hrText('نسبة العلاوة المعتمدة %','Approved raise %')}<input id="lm-raise-work-rate" type="text" inputmode="decimal" class="hr-feature-input block" value="${rate}"></label><button class="portal-action-btn" onclick="lmRaiseRecalculate()">${hrText('إعادة الحساب للجميع','Recalculate all')}</button><button class="portal-ghost-btn" onclick="lmRaiseSaveDraft()">${hrText('حفظ مسودة المعاينة','Save preview draft')}</button></div>
 <p id="lm-raise-draft-status" class="text-sky-300 mb-3"></p><div class="overflow-x-auto glass-card rounded-xl"><table class="hr-feature-table w-full"><thead><tr><th>Code</th><th>${hrText('الموظف','Employee')}</th><th>${hrText('الشهور','Months')}</th><th>${hrText('أجر الاشتراك المرجعي','Reference insured wage')}</th><th>${hrText('الشامل الحالي','Current gross')}</th><th>${hrText('العلاوة','Raise')}</th><th>${hrText('الشامل المقترح','Suggested gross')}</th><th>${hrText('الحالة','Status')}</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${escapeHtml(r.code)}</td><td>${escapeHtml(r.name)}</td><td>${r.calc.ok?r.calc.months:'—'}</td><td>${lmPayMoney(r.wage)}</td><td>${lmPayMoney(r.gross)}</td><td>${r.calc.ok?lmPayMoney(r.calc.increase):'—'}</td><td>${r.calc.ok?lmPayMoney(r.calc.updatedGross):'—'}</td><td>${r.calc.ok?'Preview':'Missing reference'}</td></tr>`).join('')}</tbody></table></div>`;
}
function lmRaiseRecalculate(){const rate=lmRaiseNum(document.getElementById('lm-raise-work-rate')?.value),year=Number(document.getElementById('lm-raise-work-year')?.value);if(!Number.isFinite(rate)||rate<0||rate>100||!Number.isInteger(year)||year<2020||year>2100){alert('Invalid rate or year / سنة أو نسبة غير صحيحة');return;}lmRaiseDraft.rate=rate;lmRaiseDraft.year=year;lmPayRaisePage();}
function lmRaiseSaveDraft(){
 const rate=lmRaiseNum(document.getElementById('lm-raise-work-rate')?.value),year=Number(document.getElementById('lm-raise-work-year')?.value);
 if(!Number.isFinite(rate)||rate<0||rate>100||!Number.isInteger(year)||year<2020||year>2100){alert('Invalid rate or year / سنة أو نسبة غير صحيحة');return;}
 lmRaiseDraft.rate=rate;lmRaiseDraft.year=year;
 const status=document.getElementById('lm-raise-draft-status');if(status)status.textContent=hrText('تم حفظ نسبة المسودة في جلسة البورتال الحالية فقط؛ لم تتغير مرتبات الموظفين في Firebase.','Draft rate saved for this portal session only; no Firebase employee wages changed.');
}

/* Lacto Misr attendance operational-day helpers. Pilot: no payroll authorization. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.LactoAttendanceDay=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function dayKey(timestamp){const d=new Date(Number(timestamp));if(!Number.isFinite(d.getTime()))throw Error('INVALID_TIMESTAMP');const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(d).map(p=>[p.type,p.value]));let key=`${parts.year}-${parts.month}-${parts.day}`;if(Number(parts.hour)<9){const prev=new Date(Date.parse(key+'T00:00:00Z')-86400000);key=prev.toISOString().slice(0,10);}return key;}
 function timestamp(row){const n=Number(row?.createdAt??row?.punchTimestamp??row?.attemptStartedAt);return Number.isFinite(n)&&n>0?n:NaN;}
 function events(rows,key){return Object.values(rows||{}).filter(r=>r&&Number.isFinite(timestamp(r))&&dayKey(timestamp(r))===key&&['IN','OUT'].includes(r.punchType)&&String(r.verificationStatus||'').toUpperCase()!=='REJECTED').sort((a,b)=>timestamp(a)-timestamp(b));}
 function summary(rows,key){const all=events(rows,key);const first=all.find(r=>r.punchType==='IN')||null;const last=first?all.filter(r=>r.punchType==='OUT'&&timestamp(r)>timestamp(first)).at(-1)||null:null;const lastMovement=first?all.filter(r=>timestamp(r)>=timestamp(first)).at(-1):null;const provisionalOut=!last&&first&&all.length>1?all.at(-1):null;return {key,events:all,firstIn:first,lastOut:last,provisionalOut,lastMovement,elapsedMinutes:last?Math.floor((timestamp(last)-timestamp(first))/60000):null,provisionalMinutes:provisionalOut?Math.floor((timestamp(provisionalOut)-timestamp(first))/60000):null,needsReview:!!first&&(!last||lastMovement?.punchType==='IN'),status:!first?'NO_CHECK_IN':!last?'MISSING_CHECK_OUT':lastMovement?.punchType==='IN'?'UNRESOLVED_LAST_IN':'PENDING_SHIFT_REVIEW'};}
 function canSubmit(rows,key,punchType){if(!['IN','OUT'].includes(punchType))return false;if(punchType==='IN')return true;const all=events(rows,key);const first=all.find(r=>r.punchType==='IN');return !!first;}
 return Object.freeze({dayKey,timestamp,events,summary,canSubmit});
});

/* Lacto Misr phase 3: read-only shift calculation. No Firebase or payroll writes. */
(function(root){'use strict';
 const r=n=>Math.round((n+Number.EPSILON)*100)/100;
 const finite=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
 function calculate(input){
  const shift=String(input?.shift||'').toUpperCase(), records=input?.records;
  if(!['A','B','C','D'].includes(shift)||!Array.isArray(records))throw Error('Invalid shift or records');
  const seen=new Set(), rows=[], flags=[];
  for(const item of records){
   const id=String(item?.id||'');
   if(!id||seen.has(id)){flags.push({id,reason:'MISSING_OR_DUPLICATE_ID'});continue;}seen.add(id);
   const date=String(item.date||'');
   if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){flags.push({id,reason:'INVALID_DATE'});continue;}
   const status=String(item.status||'');
   if(!['APPROVED','REST','LEAVE','SICK','CANCEL_SHIFT','PENDING_REVIEW'].includes(status)){flags.push({id,reason:'INVALID_STATUS'});continue;}
   if(status==='PENDING_REVIEW'||item.payrollHold===true){flags.push({id,reason:'UNRESOLVED_ATTENDANCE'});continue;}
   if(status==='APPROVED'&&!finite(item.hours)){flags.push({id,reason:'MISSING_VERIFIED_HOURS'});continue;}
   if(item.extraHours!==undefined&&!finite(item.extraHours)){flags.push({id,reason:'INVALID_EXTRA_HOURS'});continue;}
   rows.push({...item,id,date,status});
  }
  rows.sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
  const worked=r(rows.filter(x=>x.status==='APPROVED').reduce((s,x)=>s+x.hours,0));
  const cancelled=rows.filter(x=>x.status==='CANCEL_SHIFT').length;
  const recalled=rows.filter(x=>x.status==='APPROVED'&&x.restRecall===true).reduce((s,x)=>s+x.hours,0);
  let earned=0,target=null,creditedDays=null;
  if(shift==='A'){
   for(const x of rows.filter(x=>x.status==='APPROVED')){
    if(x.extraHours===undefined){flags.push({id:x.id,reason:'MISSING_APPROVED_SHIFT_A_OT'});continue;}
    earned+=x.extraHours;
   }
  }else if(shift==='B'||shift==='C'){
   target=shift==='B'?154:132;
   // Recalled rest hours are overtime in their own right, not counted twice against target.
   earned=Math.max(0,worked-recalled-target)+recalled;
  }else{
   creditedDays=new Set(rows.filter(x=>['APPROVED','REST','LEAVE','SICK','CANCEL_SHIFT'].includes(x.status)).map(x=>x.date)).size;
   // Shift D's overtime cannot be inferred from 19-day credit alone.
  }
  const events=[];
  if(shift!=='D'){
   // Monthly target overtime is only known at month end: book on final day after cancellations.
   rows.filter(x=>x.status==='CANCEL_SHIFT').forEach(x=>events.push({id:x.id,date:x.date,type:'CANCEL',hours:7}));
   if(earned>0)events.push({id:'MONTHLY_EARN',date:'9999-12-31',type:'EARN',hours:r(earned)});
  }
  let debt=r(Math.max(0,Number(input.openingDebitHours)||0)),payable=0;
  for(const e of events.sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id))){
   if(e.type==='CANCEL'){const offset=Math.min(payable,7);payable=r(payable-offset);debt=r(debt+7-offset);}
   else{const offset=Math.min(debt,e.hours);debt=r(debt-offset);payable=r(payable+e.hours-offset);}
  }
  const ready=flags.length===0&&rows.length>0&&shift!=='D';
  return {shift,workedHours:worked,targetHours:target,creditedDays,requiredDays:shift==='D'?19:null,
   overtimeEarnedHours:shift==='D'?null:r(earned),payableOvertimeHours:shift==='D'?null:payable,
   carriedDebitHours:shift==='D'?null:debt,cancelledShifts:cancelled,restRecallHours:r(recalled),
   readyForPayroll:ready,reviewRequired:!ready,flags,sourceRecords:rows.length,
   note:shift==='D'?'D requires approved day-credit and separate overtime policy':ready?'Calculation preview; payroll approval is separate':'Blocked pending evidence or shift policy'};
 }
 root.LactoShiftEngine=Object.freeze({calculate});
 if(typeof module!=='undefined'&&module.exports)module.exports={calculate};
})(typeof window!=='undefined'?window:globalThis);

/* Phase 4: auditable, read-only shift-to-payroll preview; no database writes. */
(function(root){'use strict';
 const round=n=>Math.round((n+Number.EPSILON)*100)/100;
 function calculate({shiftInput,monthlyPayrollInput,approvedOvertimeRate,approvedNightHours=0,approvedRestHours=0,approvedDayHours,rateDayMultiplier=1.35,rateNightMultiplier=1.70,rateRestMultiplier=2}){
  const reasons=[];
  if(!root.LactoShiftEngine?.calculate)throw Error('Shift engine unavailable');
  const shift=root.LactoShiftEngine.calculate(shiftInput);
  if(!shift.readyForPayroll)reasons.push('SHIFT_REVIEW_REQUIRED',...shift.flags.map(x=>x.reason));
  if(!monthlyPayrollInput||typeof monthlyPayrollInput!=='object')reasons.push('MISSING_PAYROLL_INPUT');
  const total=shift.payableOvertimeHours;
  const values=[approvedOvertimeRate,approvedNightHours,approvedRestHours,rateDayMultiplier,rateNightMultiplier,rateRestMultiplier];
  if(values.some(x=>typeof x!=='number'||!Number.isFinite(x)||x<0))reasons.push('INVALID_APPROVED_RATES');
  const day=approvedDayHours===undefined&&typeof total==='number'?total-approvedNightHours-approvedRestHours:approvedDayHours;
  if(typeof day!=='number'||!Number.isFinite(day)||day<0)reasons.push('INVALID_DAY_HOURS');
  if(typeof total!=='number'||!Number.isFinite(total)||Math.abs(day+approvedNightHours+approvedRestHours-total)>0.011)reasons.push('OVERTIME_HOURS_MISMATCH');
  if(monthlyPayrollInput && (typeof monthlyPayrollInput.gross!=='number'||!Number.isFinite(monthlyPayrollInput.gross)||monthlyPayrollInput.gross<0))reasons.push('MISSING_VALID_GROSS');
  if(monthlyPayrollInput?.insured===true && !(typeof monthlyPayrollInput.insurance==='number'&&Number.isFinite(monthlyPayrollInput.insurance)&&monthlyPayrollInput.insurance>0))reasons.push('MISSING_INSURANCE_WAGE');
  if(monthlyPayrollInput?.secondary===undefined)reasons.push('SECONDARY_TAX_STATUS_UNCONFIRMED');
  if(monthlyPayrollInput?.included!==1)reasons.push('GROSS_ALLOWANCE_DOUBLE_COUNT_RISK');
  if(reasons.length)return {ready:false,reasons:[...new Set(reasons)],shift,payroll:null,approved:false};
  const overtime=round(approvedOvertimeRate*(day*rateDayMultiplier+approvedNightHours*rateNightMultiplier+approvedRestHours*rateRestMultiplier));
  return {ready:true,reasons:[],shift,approved:false,payrollInput:{...monthlyPayrollInput,overtime},overtimeBreakdown:{dayHours:day,nightHours:approvedNightHours,restHours:approvedRestHours,rate:approvedOvertimeRate,overtime},note:'PREVIEW_ONLY_NOT_APPROVED; requires payroll calculation, evidence and authorized monthly approval'};
 }
 root.LactoPayrollShiftBridge=Object.freeze({calculate});
 if(typeof module!=='undefined'&&module.exports)module.exports={calculate};
})(typeof window!=='undefined'?window:globalThis);

/* Phase 6 pilot: independent payroll cycle and parallel reconciliation. No automatic payment. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.LactoPayrollCycle=api;})(typeof window!=='undefined'?window:null,function(){
'use strict';
const DAY_MS=86400000;
function iso(d){return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0')}
function date(y,m,day){return new Date(Date.UTC(y,m-1,Math.min(day,new Date(Date.UTC(y,m,0)).getUTCDate())))}
function addDays(d,n){return new Date(d.getTime()+n*DAY_MS)}
function cycle(month,startDay=25){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))throw Error('Invalid month');const d=Number(startDay);if(!Number.isInteger(d)||d<1||d>31)throw Error('Invalid start day');const [y,m]=month.split('-').map(Number);const start=date(y,m,d);const next=date(y,m+1,d);if(next<=start)throw Error('Invalid cycle dates');return {id:month,start:iso(start),endExclusive:iso(next),lastAttendanceDate:iso(addDays(next,-1)),calendarDays:Math.round((next-start)/DAY_MS),salaryDivisor:30};}
function config(v){const x={startDay:Number(v.startDay),salaryDivisor:30,hrReviewLeadDays:Number(v.hrReviewLeadDays),financeReviewLeadDays:Number(v.financeReviewLeadDays),deadlineDay:Number(v.deadlineDay)};if(!Number.isInteger(x.startDay)||x.startDay<1||x.startDay>28)throw Error('Start day must be 1–28 to avoid month-end ambiguity');if(!Number.isInteger(x.hrReviewLeadDays)||x.hrReviewLeadDays<1||x.hrReviewLeadDays>10)throw Error('HR review lead must be 1–10 days');if(!Number.isInteger(x.financeReviewLeadDays)||x.financeReviewLeadDays<0||x.financeReviewLeadDays>=x.hrReviewLeadDays)throw Error('Finance lead must precede HR review');if(!Number.isInteger(x.deadlineDay)||x.deadlineDay<1||x.deadlineDay>31)throw Error('Invalid deadline day');return x;}
function schedule(month,settings){const c=config(settings),period=cycle(month,c.startDay),end=new Date(period.endExclusive+'T00:00:00Z');return {...period,hrReviewDate:iso(addDays(end,-c.hrReviewLeadDays)),financeReviewDate:iso(addDays(end,-c.financeReviewLeadDays)),nominalDeadlineDay:c.deadlineDay};}
function money(v){const n=Number(v);if(!Number.isFinite(n)||n<0)throw Error('Invalid amount');return Math.round((n+Number.EPSILON)*100)/100}
function reconcile(newRows,oldRows){if(!Array.isArray(newRows)||!Array.isArray(oldRows))throw Error('Invalid rows');const make=(rows,side)=>{const m=new Map();for(const r of rows){const code=String(r.code??'').trim();if(!/^[\w-]{1,40}$/.test(code))throw Error('Invalid employee code in '+side);if(m.has(code))throw Error('Duplicate code '+code+' in '+side);m.set(code,money(r.net));}return m};const a=make(newRows,'new'),b=make(oldRows,'existing');return [...new Set([...a.keys(),...b.keys()])].sort((x,y)=>x.localeCompare(y,undefined,{numeric:true})).map(code=>({code,existing:b.get(code)??null,newSystem:a.get(code)??null,difference:a.has(code)&&b.has(code)?Math.round((a.get(code)-b.get(code))*100)/100:null,status:!a.has(code)?'MISSING_NEW':!b.has(code)?'MISSING_EXISTING':Math.abs(a.get(code)-b.get(code))<.005?'MATCH':'DIFFERENCE'}));}
return {cycle,config,schedule,reconcile};
});


/* Integrated, non-posting payroll tools. Baseline UI and employee/leave workflows unchanged. */
const lmSafeCycleSettingsKey='lm-payroll-cycle-review-v2';
function lmSafeCycleSettings(){
 const defaults={startDay:25,hrReviewLeadDays:2,financeReviewLeadDays:0,deadlineDay:30};
 try{return LactoPayrollCycle.config({...defaults,...JSON.parse(localStorage.getItem(lmSafeCycleSettingsKey)||'{}')});}catch(_){return defaults;}
}
function lmSafePilotMount(){
 const host=document.getElementById('lm-pay-pilot-tools');if(!host)return;
 const s=lmSafeCycleSettings();
 host.innerHTML=`<section class="glass-card rounded-xl p-4" dir="${currentLang==='ar'?'rtl':'ltr'}"><h2 class="font-bold text-sky-300 mb-2">${hrText('إعداد دورة المرتبات والمطابقة — تجربة بدون ترحيل','Payroll cycle and reconciliation — no posting')}</h2>
 <p class="text-sm text-amber-300 mb-3">${hrText('حساب الأجر على 30 يومًا. دورة الحضور الفعلية منفصلة. لا نشر لقسائم ولا تغيير في Firebase.','30-day salary divisor; attendance dates are separate. No payslip publication or Firebase writes.')}</p>
 <div class="flex flex-wrap gap-3 items-end"><label>${hrText('يوم بداية الدورة','Cycle start day')}<input id="lm-safe-start" type="number" min="1" max="28" class="hr-feature-input block" value="${s.startDay}"></label>
 <label>${hrText('مراجعة HR قبل النهاية بأيام','HR review lead days')}<input id="lm-safe-hr" type="number" min="1" max="10" class="hr-feature-input block" value="${s.hrReviewLeadDays}"></label>
 <label>${hrText('مراجعة المالية قبل النهاية بأيام','Finance review lead days')}<input id="lm-safe-fin" type="number" min="0" max="9" class="hr-feature-input block" value="${s.financeReviewLeadDays}"></label>
 <label>${hrText('موعد الإرسال المستهدف','Target day')}<input id="lm-safe-deadline" type="number" min="1" max="31" class="hr-feature-input block" value="${s.deadlineDay}"></label>
 <button type="button" class="portal-action-btn" onclick="lmSafeCycleSave()">${hrText('حفظ إعداد التجربة','Save test settings')}</button></div>
 <p id="lm-safe-period" class="text-sm mt-3 text-sky-300" aria-live="polite"></p>
 <hr class="my-4 border-slate-600"><h3 class="font-bold">${hrText('مطابقة صافي المرتبات مع النظام الحالي','Compare net salaries with existing system')}</h3>
 <p class="text-xs my-2">CSV: Code,Net — ${hrText('قراءة محلية فقط، ولا يعني تطابق الصافي صحة كل مكونات الحساب','Local-only comparison; net match does not validate every component')}</p>
 <input id="lm-safe-csv" type="file" accept=".csv,text/csv" class="hr-feature-input" onchange="lmSafeCompare(this.files[0]);this.value=''"><div id="lm-safe-comparison" class="overflow-x-auto mt-3"></div>
 <hr class="my-4 border-slate-600"><h3 class="font-bold">${hrText('معاينة الورديات المعتمدة','Approved shift preview')}</h3>
 <p class="text-xs my-2">${hrText('أدخل ساعات معتمدة يدويًا للاختبار؛ لا يتم استيرادها تلقائيًا من البصمة','Manual verified hours for testing; not auto-imported from punches')}</p>
 <div class="flex flex-wrap gap-2 items-end"><label>${hrText('الوردية','Shift')}<select id="lm-safe-shift" class="hr-feature-input block"><option>A</option><option>B</option><option>C</option><option>D</option></select></label>
 <label>${hrText('التاريخ','Date')}<input id="lm-safe-date" type="date" class="hr-feature-input block"></label><label>${hrText('ساعات العمل','Hours worked')}<input id="lm-safe-hours" type="number" min="0" max="24" step="0.25" class="hr-feature-input block" value="7"></label>
 <label>${hrText('ساعات إضافية معتمدة (A)','Approved overtime (A)')}<input id="lm-safe-extra" type="number" min="0" max="24" step="0.25" class="hr-feature-input block" value="0"></label>
 <button type="button" class="portal-ghost-btn" onclick="lmSafeShiftPreview()">${hrText('معاينة فقط','Preview only')}</button></div><p id="lm-safe-shift-result" class="text-sm mt-2" aria-live="polite"></p></section>`;
 lmSafeCycleShow();
}
function lmSafeCycleShow(){const el=document.getElementById('lm-safe-period');if(!el)return;try{const s=LactoPayrollCycle.schedule(lmPayrollState.month,lmSafeCycleSettings());el.textContent=`${s.start} → ${s.lastAttendanceDate} | ${s.calendarDays} calendar days | salary ÷ 30 | HR: ${s.hrReviewDate} | Finance: ${s.financeReviewDate}`;}catch(e){el.textContent=e.message}}
function lmSafeCycleSave(){const val=id=>Number(document.getElementById(id).value);const box=document.getElementById('lm-safe-period');try{const c=LactoPayrollCycle.config({startDay:val('lm-safe-start'),hrReviewLeadDays:val('lm-safe-hr'),financeReviewLeadDays:val('lm-safe-fin'),deadlineDay:val('lm-safe-deadline')});localStorage.setItem(lmSafeCycleSettingsKey,JSON.stringify(c));lmSafeCycleShow();}catch(e){box.textContent=e.message}}
async function lmSafeCompare(file){if(!file)return;const box=document.getElementById('lm-safe-comparison');try{const text=await file.text();const lines=lmPayParseCSV(text.replace(/^\ufeff/,''));const h=lines.shift().map(v=>v.trim().toLowerCase()),ci=h.findIndex(x=>['code','employee code','الكود'].includes(x)),ni=h.findIndex(x=>['net','net salary','الصافي'].includes(x));if(ci<0||ni<0)throw Error('CSV requires Code and Net');const old=lines.filter(x=>x.some(y=>y.trim())).map(x=>({code:x[ci],net:x[ni]}));const current=lmPayrollState.results.map(x=>({code:String(x.code),net:x.calc.net}));const rows=LactoPayrollCycle.reconcile(current,old);box.replaceChildren();const p=document.createElement('p');p.textContent=`${rows.length} employees | ${rows.filter(x=>x.status==='MATCH').length} matched | ${rows.filter(x=>x.status!=='MATCH').length} require review`;box.append(p);const table=document.createElement('table');table.className='hr-feature-table w-full text-xs';const tr=document.createElement('tr');for(const h of ['Code','Existing','New','Difference','Status']){const th=document.createElement('th');th.textContent=h;tr.append(th)}table.append(tr);for(const r of rows){const tr=document.createElement('tr');for(const value of [r.code,r.existing,r.newSystem,r.difference,r.status]){const td=document.createElement('td');td.textContent=value===null?'—':String(value);tr.append(td)}table.append(tr)}box.append(table);}catch(e){box.textContent='Comparison error: '+e.message}}
function lmSafeShiftPreview(){const box=document.getElementById('lm-safe-shift-result');try{const shift=document.getElementById('lm-safe-shift').value,date=document.getElementById('lm-safe-date').value,hours=Number(document.getElementById('lm-safe-hours').value),extraHours=Number(document.getElementById('lm-safe-extra').value);if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||![hours,extraHours].every(n=>Number.isFinite(n)&&n>=0&&n<=24))throw Error('Enter valid date and hours');const result=LactoShiftEngine.calculate({shift,records:[{id:'manual-preview',date,status:'APPROVED',hours,extraHours}]});box.textContent=JSON.stringify({workedHours:result.workedHours,overtimeHours:result.payableOvertimeHours,reviewRequired:result.reviewRequired,flags:result.flags})+' — Preview only; not a full monthly calculation.';}catch(e){box.textContent=e.message}}
