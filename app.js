// Lacto Misr HR Portal v6
// Enhanced version based on the supplied portal + ESS styling/behavior.

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

function togglePasswordVisibility() {
    const passInput = document.getElementById('login-password');
    const icon = document.getElementById('eye-icon');
    if (!passInput) return;
    passInput.type = passInput.type === 'password' ? 'text' : 'password';
    if (icon) icon.innerText = passInput.type === 'password' ? '👁️' : '🙈';
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
        login_wrong_pass: "كلمة المرور غير صحيحة!", login_error: "حدث خطأ أثناء الاتصال، حاول مرة أخرى.", logged_out: "تم تسجيل الخروج بنجاح",
        add_employee_btn: "+ إضافة موظف", add_employee_title: "إضافة موظف جديد", add_employee_hint: "سيتم إنشاء السجل مباشرة داخل Firebase.", save_employee_btn: "حفظ الموظف",
        employee_exists: "هذا الكود موجود بالفعل.", employee_saved: "تمت إضافة الموظف بنجاح إلى Firebase.", required_code: "كود الموظف مطلوب.",
        firebase_fields_title: "حقول Firebase", firebase_fields_hint: "كل الحقول الموجودة فعلياً على سجل الموظف تظهر هنا ويمكن تعديلها.",
        add_custom_field_btn: "+ إضافة خانة إضافية", custom_field_title: "إضافة خانة إضافية", field_name_label: "اسم الخانة", field_value_label: "القيمة",
        custom_field_saved: "تمت إضافة الخانة وتحديث Firebase فوراً.", custom_field_invalid: "اسم الخانة غير صالح. تجنب . # $ [ ] /",
        forgot_title: "استعادة كلمة المرور", forgot_hint: "سيتم إرسال رمز تحقق إلى البريد الإلكتروني المسجل.", forgot_code_placeholder: "كود الموظف",
        forgot_email_placeholder: "البريد الإلكتروني (يُطلب فقط إذا لم يكن مسجلاً)", verification_placeholder: "رمز التحقق", new_password_placeholder: "كلمة المرور الجديدة",
        send_code_btn: "إرسال رمز التحقق", verify_reset_btn: "تحقق وتغيير كلمة المرور", forgot_email_note: "يجب تفعيل خدمة البريد في Firebase (Trigger Email/Cloud Function) لكي يصل الرمز فعلياً إلى البريد.",
        email_required: "أدخل البريد الإلكتروني.", code_sent: "تم إنشاء رمز التحقق وتجهيزه للإرسال إلى البريد.", code_sent_no_email: "تم تجهيز الرمز، لكن خدمة البريد غير مفعلة في Firebase بعد.",
        invalid_code: "رمز التحقق غير صحيح أو منتهي.", password_changed: "تم تغيير كلمة المرور بنجاح.", new_password_required: "أدخل كلمة المرور الجديدة.",
        code_expired: "انتهت صلاحية رمز التحقق، اطلب رمزاً جديداً.", employee_email_found: "تم العثور على البريد المسجل.", employee_email_missing: "لا يوجد بريد مسجل، أدخل بريد الموظف.",
        schema_loading: "جاري تجهيز حقول Firebase..."
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
        login_wrong_pass: "Incorrect password!", login_error: "Connection error. Please try again.", logged_out: "Signed out successfully",
        add_employee_btn: "+ Add Employee", add_employee_title: "Add New Employee", add_employee_hint: "The record will be created directly in Firebase.", save_employee_btn: "Save Employee",
        employee_exists: "This employee code already exists.", employee_saved: "Employee added successfully to Firebase.", required_code: "Employee code is required.",
        firebase_fields_title: "Firebase Fields", firebase_fields_hint: "All fields currently stored on the employee record appear here and can be edited.",
        add_custom_field_btn: "+ Add Extra Field", custom_field_title: "Add Extra Field", field_name_label: "Field Name", field_value_label: "Value",
        custom_field_saved: "Field added and Firebase updated immediately.", custom_field_invalid: "Invalid field name. Avoid . # $ [ ] /",
        forgot_title: "Password Recovery", forgot_hint: "A verification code will be sent to the registered email.", forgot_code_placeholder: "Employee Code",
        forgot_email_placeholder: "Email (only required if not registered)", verification_placeholder: "Verification Code", new_password_placeholder: "New Password",
        send_code_btn: "Send Verification Code", verify_reset_btn: "Verify & Change Password", forgot_email_note: "Firebase email delivery (Trigger Email/Cloud Function) must be enabled for the code to reach the mailbox.",
        email_required: "Enter an email address.", code_sent: "Verification code created and queued for email delivery.", code_sent_no_email: "Code prepared, but Firebase email delivery is not enabled yet.",
        invalid_code: "Invalid or expired verification code.", password_changed: "Password changed successfully.", new_password_required: "Enter the new password.",
        code_expired: "The verification code has expired. Request a new one.", employee_email_found: "Registered email found.", employee_email_missing: "No registered email found. Enter the employee email.",
        schema_loading: "Preparing Firebase fields..."
    }
};

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
function getEmployeeCode(emp) { return String(getField(emp, 'الكود', 'code', 'employeeCode', 'empCode') || ''); }
function getEmployeeName(emp) { return getField(emp, 'اسم الموظف ', 'اسم الموظف', 'name', 'emp_name _en') || '--'; }
function getEmployeeDept(emp) { return getField(emp, 'الإدارة ', 'الإدارة', 'department', 'dept') || '--'; }
function getEmployeeJob(emp) { return getField(emp, 'الوظيفة', 'الوظيفة ', 'jobTitle', 'job title', 'job') || '--'; }
function getHireDate(emp) { const v=getField(emp,'تاريخ التعيين ','تاريخ التعيين','hireDate','date_of_hiring '); return typeof v==='number'?excelDateToJSDate(v):v||'--'; }
function localizedValue(emp, arKeys, enKeys) { return currentLang==='ar' ? getField(emp,...arKeys) : (getField(emp,...enKeys) || getField(emp,...arKeys)); }

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
    localStorage.setItem('lacto_lang', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

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
    renderTable(allEmployees);
    if (activeEmployeeCode !== null) viewEmployee(activeEmployeeCode);
    if (document.getElementById('add-employee-modal') && !document.getElementById('add-employee-modal').classList.contains('hidden')) buildAddEmployeeForm();
    if (document.getElementById('dynamic-fields-container') && activeEmployeeCode !== null) renderDynamicFields();
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

async function handleLogin() {
    const code = document.getElementById('login-emp-code')?.value.trim();
    const pass = document.getElementById('login-password')?.value.trim();
    const remember = document.getElementById('remember-me')?.checked;
    if (!code || !pass) { showLoginMessage(tr('login_required')); return; }
    showLoginMessage(currentLang==='ar'?'جاري التحقق...':'Checking...', 'success');

    try {
        const snapshot = await db.ref('users/' + code).once('value');
        if (!snapshot.exists()) { showLoginMessage(tr('login_not_found')); return; }
        const user = snapshot.val() || {};
        if (String(user.password ?? '') !== pass) { showLoginMessage(tr('login_wrong_pass')); return; }

        currentUserData = user; currentUserData.code = code;
        if (remember) {
            localStorage.setItem('lacto_saved_code', code);
            localStorage.setItem('lacto_saved_pass', pass);
        } else {
            localStorage.removeItem('lacto_saved_code');
            localStorage.removeItem('lacto_saved_pass');
        }
        sessionStorage.setItem('lacto_active_code', code);
        document.getElementById('current-user-label')?.classList.remove('hidden');
        if (document.getElementById('current-user-label')) document.getElementById('current-user-label').innerText = user.name || user['اسم الموظف'] || code;
        hideLogin();
        portalInitialized = true;
        await loadEmployeesFromFirebase();
    } catch (error) {
        console.error(error);
        showLoginMessage(tr('login_error'));
    }
}

function handleLogout() {
    localStorage.removeItem('lacto_saved_code');
    localStorage.removeItem('lacto_saved_pass');
    sessionStorage.removeItem('lacto_active_code');
    currentUserData = null;
    activeEmployeeCode = null;
    const code = document.getElementById('login-emp-code');
    const pass = document.getElementById('login-password');
    const remember = document.getElementById('remember-me');
    if (code) code.value=''; if (pass) pass.value=''; if (remember) remember.checked=false;
    window.location.reload();
}

async function loadEmployeesFromFirebase() {
    const tableBody = document.getElementById('employees-table-body');
    if (tableBody) tableBody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">${tr('loading')}</td></tr>`;
    try {
        const snap = await db.ref('employees').once('value');
        if (snap.exists()) {
            const raw = snap.val() || {};
            allEmployees = Object.keys(raw).map(key => ({ ...(raw[key] || {}), code: getField(raw[key]||{},'code','الكود') || key }));
        } else {
            allEmployees = [];
        }
        renderTable(allEmployees); updateDashboardStats();
    } catch (error) {
        console.warn('Firebase employees load failed, using local fallback.', error);
        fetch('clean_employees_data.json').then(r=>r.json()).then(data=>{
            allEmployees=data.filter(emp=>(emp['الكود']||emp.code)&&(emp['اسم الموظف ']||emp['اسم الموظف']||emp['emp_name _en']));
            renderTable(allEmployees); updateDashboardStats();
        }).catch(()=>{ renderTable([]); });
    }
}

function filterEmployees() {
    const input=document.getElementById('search-input'); if(!input) return;
    const query=input.value.toLowerCase().trim();
    renderTable(allEmployees.filter(emp => JSON.stringify(emp).toLowerCase().includes(query)));
}

function renderTable(dataList) {
    const tableBody=document.getElementById('employees-table-body'); if(!tableBody) return;
    tableBody.innerHTML='';
    if(!dataList.length){ tableBody.innerHTML=`<tr><td colspan="6" class="p-6 text-center text-slate-400">${tr('no_results')}</td></tr>`; return; }
    dataList.forEach(emp=>{
        const code=getEmployeeCode(emp)||'--';
        const name=localizedValue(emp,['اسم الموظف ','اسم الموظف','name'],['emp_name _en','name'])||'--';
        const dept=localizedValue(emp,['الإدارة ','الإدارة','department'],['department','dept'])||'--';
        const job=localizedValue(emp,['الوظيفة','الوظيفة ','jobTitle'],['job title','jobTitle','job'])||'--';
        const hire=getHireDate(emp);
        const row=document.createElement('tr'); row.className='hover:bg-slate-800/40 transition text-slate-300';
        row.innerHTML=`<td class="p-3.5 font-mono text-sky-400">${escapeHtml(code)}</td><td class="p-3.5 font-semibold text-white">${escapeHtml(String(name).trim())}</td><td class="p-3.5">${escapeHtml(String(dept).trim())}</td><td class="p-3.5">${escapeHtml(String(job).trim())}</td><td class="p-3.5 font-mono text-xs">${escapeHtml(String(hire))}</td><td class="p-3.5 text-center"><button onclick="viewEmployee('${escapeAttr(code)}')" class="px-3.5 py-1.5 bg-sky-600/30 hover:bg-sky-600 text-sky-200 rounded-lg text-xs border border-sky-400/30 transition shadow-lg">${tr('action_btn')}</button></td>`;
        tableBody.appendChild(row);
    });
}

function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function escapeAttr(value){return String(value).replace(/\\/g,'\\\\').replace(/'/g,"\\'");}

function viewEmployee(code) {
    activeEmployeeCode=code;
    const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(code)); if(!emp) return;
    document.getElementById('employees-list-view').style.display='none';
    document.getElementById('employee-profile-view').style.display='block';
    setFieldVal('prof-code',code);
    setFieldVal('prof-name',localizedValue(emp,['اسم الموظف ','اسم الموظف','name'],['emp_name _en','name']));
    setFieldVal('prof-dept',localizedValue(emp,['الإدارة ','الإدارة','department'],['department','dept']));
    setFieldVal('prof-job',localizedValue(emp,['الوظيفة','الوظيفة ','jobTitle'],['job title','jobTitle','job']));
    setFieldVal('prof-manager',localizedValue(emp,['المدير المباشر ','المدير المباشر','directManager'],['direct manager','directManager']));
    setFieldVal('prof-hire',getHireDate(emp));
    setFieldVal('prof-service',getField(emp,'سنوات الخدمة ','سنوات الخدمة','yearsService','years service'));
    setFieldVal('prof-qual',localizedValue(emp,['المؤهل','qualification'],['qualification']));
    setFieldVal('prof-qual-auth',localizedValue(emp,['جهة المؤهل ','جهة المؤهل','qualAuth'],['qulification issuing authority','qualAuth','issuer']));
    setFieldVal('prof-dob',excelDateToJSDate(getField(emp,'تاريخ الميلاد','dob')));
    setFieldVal('prof-age',getField(emp,'السن حتى تاريخه ','السن حتى تاريخه','age','age to date'));
    setFieldVal('prof-insurance',localizedValue(emp,['الحالة التأمينية ','الحالة التأمينية','insuranceStatus'],['insurance status','insuranceStatus']));
    setFieldVal('prof-pob',localizedValue(emp,['مكان الميلاد','pob'],['pob']));
    document.getElementById('profile-img').src=getField(emp,'photoUrl','photo','رابط الصورة') || 'default-avatar.png';
    document.getElementById('btn-save')?.classList.add('hidden'); document.getElementById('btn-edit')?.classList.remove('hidden'); document.getElementById('btn-photo')?.classList.add('hidden');
    setFieldsEditable(true); renderDynamicFields();
}
function setFieldVal(id,val){const el=document.getElementById(id);if(el)el.value=val??'';}
function enableEditing(){setFieldsEditable(false);document.getElementById('btn-edit')?.classList.add('hidden');document.getElementById('btn-save')?.classList.remove('hidden');document.getElementById('btn-photo')?.classList.remove('hidden');}
function setFieldsEditable(isDisabled){['prof-name','prof-dept','prof-job','prof-manager','prof-hire','prof-service','prof-qual','prof-qual-auth','prof-dob','prof-age','prof-insurance','prof-pob'].forEach(id=>{const el=document.getElementById(id);if(!el)return;el.disabled=isDisabled;el.classList.toggle('bg-slate-900/50',isDisabled);el.classList.toggle('border-slate-700',isDisabled);el.classList.toggle('bg-slate-900/90',!isDisabled);el.classList.toggle('border-sky-500/50',!isDisabled);});}
function backToEmployeesList(){activeEmployeeCode=null;document.getElementById('employee-profile-view').style.display='none';document.getElementById('employees-list-view').style.display='block';}

function renderDynamicFields(){
    const container=document.getElementById('dynamic-fields-container'); if(!container||activeEmployeeCode===null)return;
    const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(activeEmployeeCode)); if(!emp)return;
    container.innerHTML='';
    Object.keys(emp).sort().forEach(key=>{
        if(['code'].includes(key) || ['الكود'].includes(key)) return;
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
        const key=input.getAttribute('data-firebase-key'); if(isValidFirebaseKey(key)) updatedData[key]=input.value;
    });
    try{
        await db.ref('employees/'+activeEmployeeCode).update(updatedData);
        Object.assign(emp,updatedData); showToast(); setFieldsEditable(true); document.getElementById('btn-save')?.classList.add('hidden'); document.getElementById('btn-edit')?.classList.remove('hidden'); document.getElementById('btn-photo')?.classList.add('hidden'); renderTable(allEmployees); renderDynamicFields();
    }catch(error){console.error(error);showToast(currentLang==='ar'?'حدث خطأ أثناء الحفظ':'Save error',true);}
}

function uploadEmployeePhoto(event){const file=event.target.files?.[0];if(!file||activeEmployeeCode===null)return;const reader=new FileReader();reader.onload=async e=>{const base64=e.target.result;document.getElementById('profile-img').src=base64;try{await db.ref('employees/'+activeEmployeeCode).update({photoUrl:base64});const emp=allEmployees.find(x=>String(getEmployeeCode(x))===String(activeEmployeeCode));if(emp)emp.photoUrl=base64;showToast();}catch(err){console.error(err);}};reader.readAsDataURL(file);}

function showToast(message=null,isError=false){const toast=document.getElementById('toast-notification');const msg=document.getElementById('toast-message');if(!toast||!msg)return;msg.innerText=message||tr('toast_success');msg.classList.toggle('text-red-300',isError);msg.classList.toggle('text-white',!isError);toast.classList.remove('translate-y-32','opacity-0');setTimeout(()=>toast.classList.add('translate-y-32','opacity-0'),3200);}
function updateDashboardStats(){const el=document.getElementById('total-employees-count');if(el)el.innerText=allEmployees.length;}

function getFirebaseSchema(){
    const keys=new Set();
    allEmployees.forEach(emp=>Object.keys(emp||{}).forEach(k=>keys.add(k)));
    if(!keys.size) ['code','name','department','jobTitle','directManager','hireDate','yearsService','qualification','qualAuth','dob','age','insuranceStatus','pob','photoUrl','email'].forEach(k=>keys.add(k));
    const codeKey=allEmployees.length ? existingKey(allEmployees[0], ['الكود','code','employeeCode','empCode'], 'code') : 'code';
    keys.delete(codeKey); keys.delete('code'); keys.delete('الكود'); keys.delete('employeeCode'); keys.delete('empCode');
    return [codeKey,...Array.from(keys).sort()];
}
function openAddEmployeeModal(){document.getElementById('add-employee-modal')?.classList.remove('hidden');buildAddEmployeeForm();}
function closeAddEmployeeModal(){document.getElementById('add-employee-modal')?.classList.add('hidden');}
function buildAddEmployeeForm(){
    const container=document.getElementById('add-employee-fields');if(!container)return;container.innerHTML='';
    getFirebaseSchema().forEach(key=>{
        const wrap=document.createElement('div');wrap.className='dynamic-field-card';
        const type=/date|dob|تاريخ/i.test(key)?'date':'text';
        wrap.innerHTML=`<label class="text-xs text-slate-400">${escapeHtml(displayKey(key))}${key==='code'?' <span class="text-red-400">*</span>':''}</label><input data-add-key="${escapeAttr(key)}" type="${type}" class="w-full mt-1 px-3 py-2 bg-slate-950/60 border border-sky-500/20 rounded-xl text-slate-200 text-sm" ${key==='code'?'required':''}>`;
        container.appendChild(wrap);
    });
    const err=document.getElementById('add-employee-error');if(err)err.innerText='';
}
async function saveNewEmployee(){
    const data={};document.querySelectorAll('#add-employee-fields [data-add-key]').forEach(input=>{const key=input.getAttribute('data-add-key');data[key]=input.value.trim();});
    const codeKey=Object.keys(data).find(k=>['الكود','code','employeeCode','empCode'].includes(k)) || 'code';
    const code=data[codeKey];const err=document.getElementById('add-employee-error');
    if(!code){if(err)err.innerText=tr('required_code');return;}
    if(!isValidFirebaseKey(code)){if(err)err.innerText=tr('custom_field_invalid');return;}
    try{
        const ref=db.ref('employees/'+code);const exists=await ref.once('value');if(exists.exists()){if(err)err.innerText=tr('employee_exists');return;}
        data[codeKey]=code;await ref.set(data);allEmployees.push(data);closeAddEmployeeModal();renderTable(allEmployees);updateDashboardStats();showToast(tr('employee_saved'));
    }catch(error){console.error(error);if(err)err.innerText=currentLang==='ar'?'حدث خطأ أثناء الإضافة.':'Error while adding employee.';}
}

function openAddCustomFieldModal(){if(activeEmployeeCode===null){showToast(currentLang==='ar'?'افتح ملف موظف أولاً':'Open an employee profile first',true);return;}document.getElementById('custom-field-modal')?.classList.remove('hidden');document.getElementById('custom-field-name').value='';document.getElementById('custom-field-value').value='';document.getElementById('custom-field-error').innerText='';}
function closeAddCustomFieldModal(){document.getElementById('custom-field-modal')?.classList.add('hidden');}
async function saveCustomField(){
    const key=document.getElementById('custom-field-name').value.trim();const value=document.getElementById('custom-field-value').value.trim();const err=document.getElementById('custom-field-error');
    if(!isValidFirebaseKey(key)){err.innerText=tr('custom_field_invalid');return;}
    if(!key){err.innerText=tr('field_name_label');return;}
    try{
        await db.ref('employees/'+activeEmployeeCode).update({[key]:value});
        const emp=allEmployees.find(e=>String(getEmployeeCode(e))===String(activeEmployeeCode));if(emp)emp[key]=value;
        closeAddCustomFieldModal();renderDynamicFields();showToast(tr('custom_field_saved'));
    }catch(error){console.error(error);err.innerText=currentLang==='ar'?'حدث خطأ أثناء التحديث.':'Update failed.';}
}

function randomVerificationCode(){const arr=new Uint32Array(1);crypto.getRandomValues(arr);return String(100000+(arr[0]%900000));}
async function sendPasswordVerificationCode(){
    const code=document.getElementById('forgot-emp-code').value.trim();let email=document.getElementById('forgot-email').value.trim();const msg=document.getElementById('forgot-message');
    if(!code){msg.style.color='#f87171';msg.innerText=tr('required_code');return;}
    try{
        const snap=await db.ref('users/'+code).once('value');if(!snap.exists()){msg.style.color='#f87171';msg.innerText=tr('login_not_found');return;}
        const user=snap.val()||{};const registeredEmail=user.email||user.emailAddress||user['البريد الإلكتروني']||'';
        if(registeredEmail){email=registeredEmail;document.getElementById('forgot-email').value=email;msg.style.color='#67e8f9';msg.innerText=tr('employee_email_found');}
        if(!email){msg.style.color='#f87171';msg.innerText=tr('email_required');return;}
        const verificationCode=randomVerificationCode();const expiresAt=Date.now()+10*60*1000;
        await db.ref('password_resets/'+code).set({email,code:verificationCode,expiresAt,createdAt:firebase.database.ServerValue.TIMESTAMP,used:false});
        // Firebase Trigger Email extension / Cloud Function can listen to this node.
        const mailRef=db.ref('mail').push();
        await mailRef.set({to:email,message:{subject:currentLang==='ar'?'رمز استعادة كلمة مرور Lacto Misr HR':'Lacto Misr HR Password Recovery Code',html:`<div style="font-family:Arial,sans-serif"><h2>Lacto Misr HR</h2><p>${currentLang==='ar'?'رمز التحقق الخاص بك هو':'Your verification code is'} <strong style="font-size:24px;letter-spacing:5px">${verificationCode}</strong></p><p>${currentLang==='ar'?'صلاحية الرمز 10 دقائق.':'The code expires in 10 minutes.'}</p></div>`}});
        document.getElementById('forgot-code-step').classList.remove('hidden');document.getElementById('forgot-send-btn').classList.add('hidden');
        msg.style.color='#67e8f9';msg.innerText=tr('code_sent');
    }catch(error){console.error(error);msg.style.color='#f87171';msg.innerText=tr('code_sent_no_email');}
}
async function verifyAndResetPassword(){
    const code=document.getElementById('forgot-emp-code').value.trim();const verification=document.getElementById('forgot-verification-code').value.trim();const newPass=document.getElementById('forgot-new-password').value.trim();const msg=document.getElementById('forgot-message');
    if(!newPass){msg.style.color='#f87171';msg.innerText=tr('new_password_required');return;}
    try{
        const snap=await db.ref('password_resets/'+code).once('value');const reset=snap.val();
        if(!reset||reset.used||String(reset.code)!==verification){msg.style.color='#f87171';msg.innerText=tr('invalid_code');return;}
        if(Date.now()>Number(reset.expiresAt)){msg.style.color='#f87171';msg.innerText=tr('code_expired');return;}
        await db.ref('users/'+code).update({password:newPass});await db.ref('password_resets/'+code).update({used:true,usedAt:firebase.database.ServerValue.TIMESTAMP});
        localStorage.removeItem('lacto_saved_code');localStorage.removeItem('lacto_saved_pass');
        msg.style.color='#67e8f9';msg.innerText=tr('password_changed');
        setTimeout(()=>{closeForgotPassModal();document.getElementById('forgot-code-step').classList.add('hidden');document.getElementById('forgot-send-btn').classList.remove('hidden');document.getElementById('forgot-verification-code').value='';document.getElementById('forgot-new-password').value='';},1500);
    }catch(error){console.error(error);msg.style.color='#f87171';msg.innerText=tr('login_error');}
}
function openForgotPassModal(){document.getElementById('forgot-pass-modal')?.classList.remove('hidden');document.getElementById('forgot-emp-code').value=document.getElementById('login-emp-code')?.value||'';document.getElementById('forgot-email').value='';document.getElementById('forgot-message').innerText='';}
function closeForgotPassModal(){document.getElementById('forgot-pass-modal')?.classList.add('hidden');}

function runPortalIntro(){
    const intro=document.getElementById('intro-screen');const container=document.getElementById('introTitle');const subtitle=document.getElementById('introSubtitle');
    if(!intro||!container||!window.gsap){ revealLoginAfterIntro(); return; }
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
    if(brand){brand.classList.add('intro-ready');setTimeout(()=>brand.classList.add('compact'),350);}
    if(panel){setTimeout(()=>panel.classList.add('visible','compact-mode'),650);}
}

function prepareRememberedLogin(){
    const savedCode=localStorage.getItem('lacto_saved_code');const savedPass=localStorage.getItem('lacto_saved_pass');
    if(savedCode&&savedPass){document.getElementById('login-emp-code').value=savedCode;document.getElementById('login-password').value=savedPass;document.getElementById('remember-me').checked=true;}
}

window.addEventListener('click',(e)=>{
    if(!e.target.closest('#login-lang-switcher')) document.getElementById('login-lang-menu')?.classList.remove('show');
    if(!e.target.closest('#lang-dropdown') && !e.target.closest('button[onclick*="toggleLangDropdown"]')) document.getElementById('lang-dropdown')?.classList.remove('show');
});

window.addEventListener('DOMContentLoaded',async()=>{
    setLanguage(currentLang);
    prepareRememberedLogin();
    runPortalIntro();
    // If a previous session exists, do not bypass the login screen unless the user explicitly uses saved credentials.
    const active=sessionStorage.getItem('lacto_active_code');
    if(active){ /* session is informational only; logout still clears it */ }
});
