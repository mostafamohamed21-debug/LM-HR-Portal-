// ============================================================
// Lacto Misr HR Portal - Employee Profile
// Firebase Realtime Database + Firebase Storage
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

// ------------------------------------------------------------
// Firebase configuration
// ------------------------------------------------------------
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

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

// ------------------------------------------------------------
// State
// ------------------------------------------------------------
let currentLang = localStorage.getItem("lacto_hr_lang") || "ar";
let employee = null;
let dbKey = null;
let originalEmployee = null;
let selectedPhotoFile = null;

const params = new URLSearchParams(window.location.search);
const employeeCode = params.get("code");

// ------------------------------------------------------------
// Translations
// ------------------------------------------------------------
const translations = {
    ar: {
        profile_page: "ملف الموظف",
        loading: "جاري جلب بيانات الموظف...",
        connected: "متصل",
        connection_error: "خطأ في الاتصال",
        back: "العودة",
        employee_code: "كود الموظف",
        edit: "تعديل البيانات",
        save: "حفظ التعديلات",
        cancel: "إلغاء",
        personal_info: "البيانات الأساسية",
        job_info: "البيانات الوظيفية",
        qualification_info: "المؤهل",
        name_ar: "الاسم بالعربية",
        name_en: "الاسم بالإنجليزية",
        code: "الكود",
        dob: "تاريخ الميلاد",
        age: "السن",
        pob: "محل الميلاد",
        department_ar: "الإدارة بالعربية",
        department_en: "الإدارة بالإنجليزية",
        job_ar: "الوظيفة بالعربية",
        job_en: "الوظيفة بالإنجليزية",
        manager_ar: "المدير المباشر بالعربية",
        manager_en: "المدير المباشر بالإنجليزية",
        hire_date: "تاريخ التعيين",
        years_service: "سنوات الخدمة",
        insurance: "الحالة التأمينية",
        qualification_ar: "المؤهل بالعربية",
        qualification_en: "المؤهل بالإنجليزية",
        qualification_year: "سنة المؤهل",
        issuing_authority_ar: "جهة إصدار المؤهل بالعربية",
        issuing_authority_en: "جهة إصدار المؤهل بالإنجليزية",
        not_available: "غير متوفر",
        edit_mode: "وضع التعديل",
        saving: "جاري الحفظ...",
        saved: "تم حفظ التعديلات بنجاح",
        save_error: "حدث خطأ أثناء الحفظ",
        photo_uploading: "جاري رفع الصورة...",
        photo_uploaded: "تم رفع الصورة",
        photo_error: "تعذر رفع الصورة. راجع صلاحيات Firebase Storage.",
        employee_not_found: "لم يتم العثور على الموظف المطلوب.",
        code_missing: "لم يتم إرسال كود الموظف في الرابط."
    },
    en: {
        profile_page: "Employee Profile",
        loading: "Loading employee profile...",
        connected: "Connected",
        connection_error: "Connection error",
        back: "Back",
        employee_code: "Employee Code",
        edit: "Edit Profile",
        save: "Save Changes",
        cancel: "Cancel",
        personal_info: "Personal Information",
        job_info: "Employment Information",
        qualification_info: "Qualification",
        name_ar: "Name in Arabic",
        name_en: "Name in English",
        code: "Employee Code",
        dob: "Date of Birth",
        age: "Age",
        pob: "Place of Birth",
        department_ar: "Department in Arabic",
        department_en: "Department",
        job_ar: "Job Title in Arabic",
        job_en: "Job Title",
        manager_ar: "Direct Manager in Arabic",
        manager_en: "Direct Manager",
        hire_date: "Hire Date",
        years_service: "Years of Service",
        insurance: "Insurance Status",
        qualification_ar: "Qualification in Arabic",
        qualification_en: "Qualification",
        qualification_year: "Qualification Year",
        issuing_authority_ar: "Issuing Authority in Arabic",
        issuing_authority_en: "Qualification Issuing Authority",
        not_available: "Not available",
        edit_mode: "Edit mode",
        saving: "Saving...",
        saved: "Changes saved successfully",
        save_error: "An error occurred while saving",
        photo_uploading: "Uploading photo...",
        photo_uploaded: "Photo uploaded",
        photo_error: "Photo upload failed. Check Firebase Storage rules.",
        employee_not_found: "The requested employee was not found.",
        code_missing: "Employee code is missing from the URL."
    }
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function cleanValue(value) {
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

function escapeHtml(value) {
    return cleanValue(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function excelSerialToDate(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return null;

    const epoch = Date.UTC(1899, 11, 30);
    return new Date(epoch + numeric * 86400000);
}

function formatDate(value) {
    if (value === null || value === undefined || value === "") {
        return translations[currentLang].not_available;
    }

    const date = excelSerialToDate(value);

    if (!date) {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString(currentLang === "ar" ? "ar-EG" : "en-GB");
        }
        return cleanValue(value) || translations[currentLang].not_available;
    }

    return date.toLocaleDateString(currentLang === "ar" ? "ar-EG" : "en-GB");
}

function dateToInputValue(value) {
    const date = excelSerialToDate(value);

    if (!date) {
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return "";
        return parsed.toISOString().slice(0, 10);
    }

    return date.toISOString().slice(0, 10);
}

function dateInputToExcelSerial(value) {
    if (!value) return "";

    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return "";

    const epoch = Date.UTC(1899, 11, 30);
    return Math.round((date.getTime() - epoch) / 86400000);
}

function firstExistingKey(obj, candidates) {
    for (const key of candidates) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return key;
        }
    }
    return null;
}

function readField(obj, candidates) {
    const key = firstExistingKey(obj, candidates);
    return key ? obj[key] : "";
}

function setField(obj, preferredKey, candidates, value) {
    const existingKey = firstExistingKey(obj, candidates);
    obj[existingKey || preferredKey] = value;
}

function getArabicName() {
    return cleanValue(readField(employee, ["اسم الموظف ", "اسم الموظف", "name"]));
}

function getEnglishName() {
    return cleanValue(readField(employee, ["emp_name _en", "emp_name_en", "name_en"])) || getArabicName();
}

function getArabicDepartment() {
    return cleanValue(readField(employee, ["الإدارة ", "الإدارة", "department_ar"]));
}

function getEnglishDepartment() {
    return cleanValue(readField(employee, ["department ", "department_en"])) || getArabicDepartment();
}

function getArabicJob() {
    return cleanValue(readField(employee, ["الوظيفة", "الوظيفة "]));
}

function getEnglishJob() {
    return cleanValue(readField(employee, ["job title ", "job title", "job_title"])) || getArabicJob();
}

function getArabicManager() {
    return cleanValue(readField(employee, ["المدير المباشر", "المدير المباشر "]));
}

function getEnglishManager() {
    return cleanValue(readField(employee, ["direct manager ", "direct manager", "direct_manager"])) || getArabicManager();
}

function getArabicQualification() {
    return cleanValue(readField(employee, ["المؤهل", "المؤهل "]));
}

function getEnglishQualification() {
    return cleanValue(readField(employee, ["qualification", "qualification "])) || getArabicQualification();
}

function getArabicInsurance() {
    return cleanValue(readField(employee, ["الحالة التأمينية ", "الحالة التأمينية"]));
}

function getEnglishInsurance() {
    return cleanValue(readField(employee, ["insurance status ", "insurance status"])) || getArabicInsurance();
}

function getArabicPob() {
    return cleanValue(readField(employee, ["محل الميلاد", "محل الميلاد ", "محل الميلاد بالعربية", "pob_ar"]));
}

function getEnglishPob() {
    return cleanValue(readField(employee, ["place of birth", "place_of_birth", "pob_en"])) || getArabicPob();
}

function getArabicAuthority() {
    return cleanValue(readField(employee, [
        "جهة اصدار المؤهل",
        "جهة إصدار المؤهل",
        "جهة اصدار المؤهل ",
        "جهة إصدار المؤهل "
    ]));
}

function getEnglishAuthority() {
    return cleanValue(readField(employee, [
        "qualification issuing authority",
        "qualification issuing authority ",
        "qualification_issuing_authority"
    ])) || getArabicAuthority();
}

function getCode() {
    return cleanValue(readField(employee, ["الكود", "code", "ID"]));
}

function getHireDateRaw() {
    return readField(employee, ["تاريخ التعيين ", "تاريخ التعيين", "date_of_hiring"]);
}

function getDobRaw() {
    return readField(employee, ["تاريخ الميلاد", "تاريخ الميلاد ", "dob"]);
}

function getQualificationYear() {
    return cleanValue(readField(employee, ["qualification date ", "qualification date", "qualification_year"]));
}

function getYearsService() {
    return cleanValue(readField(employee, ["سنوات الخدمة ", "سنوات الخدمة", "years of service"]));
}

function getAge() {
    return cleanValue(readField(employee, ["السن حتى تاريخه ", "السن حتى تاريخه", "age to date"]));
}

function getPhotoUrl() {
    return cleanValue(readField(employee, ["photoURL", "photoUrl", "profilePhoto", "profile_photo"]));
}

// ------------------------------------------------------------
// Language
// ------------------------------------------------------------
function applyLanguage() {
    const root = document.getElementById("html-root");
    root.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
    root.setAttribute("lang", currentLang);

    document.getElementById("page-title").textContent =
        currentLang === "ar"
            ? "ملف الموظف | لاكتو مصر"
            : "Employee Profile | Lacto Misr";

    document.querySelectorAll("[data-translate]").forEach(el => {
        const key = el.getAttribute("data-translate");
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    document.getElementById("lang-btn-text").textContent =
        currentLang === "ar" ? "English" : "العربية";

    document.getElementById("back-text").textContent =
        currentLang === "ar" ? "← رجوع" : "← Back";

    if (employee) {
        renderProfile();
    }
}

window.toggleLanguage = function () {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("lacto_hr_lang", currentLang);
    applyLanguage();
};

// ------------------------------------------------------------
// Firebase employee lookup
// Current structure: root numeric records.
// We locate the record by employee.code.
// ------------------------------------------------------------
async function loadEmployee() {
    const snapshot = await get(ref(db, "/"));

    if (!snapshot.exists()) {
        return null;
    }

    const raw = snapshot.val();
    const entries = Array.isArray(raw)
        ? raw.map((employee, index) => ({ employee, dbKey: String(index) }))
        : Object.entries(raw || {}).map(([dbKey, employee]) => ({ employee, dbKey }));

    const wanted = cleanValue(employeeCode);

    const found = entries.find(item =>
        item.employee &&
        cleanValue(
            readField(item.employee, ["الكود", "code", "ID"])
        ) === wanted
    );

    return found || null;
}

// ------------------------------------------------------------
// Rendering
// ------------------------------------------------------------
function fieldValue(id, value) {
    const element = document.getElementById(id);
    if (!element) return;

    element.innerHTML = escapeHtml(value || translations[currentLang].not_available);
}

function renderProfile() {
    const code = getCode();

    document.getElementById("employee-name").textContent =
        currentLang === "ar" ? getArabicName() : getEnglishName();

    document.getElementById("employee-job").textContent =
        currentLang === "ar" ? getArabicJob() : getEnglishJob();

    document.getElementById("employee-department").textContent =
        currentLang === "ar" ? getArabicDepartment() : getEnglishDepartment();

    document.getElementById("employee-code-badge").textContent = `CODE: ${code || "--"}`;

    document.getElementById("insurance-badge").textContent =
        currentLang === "ar" ? getArabicInsurance() : getEnglishInsurance();

    const photo = getPhotoUrl();
    document.getElementById("employee-photo").src =
        photo || createAvatarDataUrl(
            currentLang === "ar" ? getArabicName() : getEnglishName()
        );

    fieldValue("field-name-ar", getArabicName());
    fieldValue("field-name-en", getEnglishName());
    fieldValue("field-code", code);
    fieldValue("field-dob", formatDate(getDobRaw()));
    fieldValue("field-age", getAge());
    fieldValue("field-pob", currentLang === "ar" ? getArabicPob() : getEnglishPob());

    fieldValue("field-department-ar", getArabicDepartment());
    fieldValue("field-department-en", getEnglishDepartment());
    fieldValue("field-job-ar", getArabicJob());
    fieldValue("field-job-en", getEnglishJob());
    fieldValue("field-manager-ar", getArabicManager());
    fieldValue("field-manager-en", getEnglishManager());
    fieldValue("field-hire-date", formatDate(getHireDateRaw()));
    fieldValue("field-years-service", getYearsService());
    fieldValue("field-insurance", currentLang === "ar" ? getArabicInsurance() : getEnglishInsurance());

    fieldValue("field-qualification-ar", getArabicQualification());
    fieldValue("field-qualification-en", getEnglishQualification());
    fieldValue("field-qualification-year", getQualificationYear());
    fieldValue("field-issuing-authority-ar", getArabicAuthority());
    fieldValue("field-issuing-authority-en", getEnglishAuthority());

    document.getElementById("profile-status").textContent =
        translations[currentLang].connected;
}

function createAvatarDataUrl(name) {
    const letter = cleanValue(name).charAt(0) || "?";

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
            <rect width="100%" height="100%" fill="#0f172a"/>
            <circle cx="250" cy="250" r="210" fill="#082f49"/>
            <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
                  fill="#38bdf8" font-family="Arial" font-size="220" font-weight="700">
                ${letter}
            </text>
        </svg>
    `;

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

// ------------------------------------------------------------
// Edit mode
// ------------------------------------------------------------
function inputElement(value, type = "text", extra = "") {
    return `<input class="field-input mt-2" type="${type}" value="${escapeHtml(value)}" ${extra}>`;
}

function replaceFieldWithInput(id, value, type = "text", extra = "") {
    const element = document.getElementById(id);
    if (!element) return;

    element.innerHTML = inputElement(value, type, extra);
}

window.enableEditMode = function () {
    if (!employee) return;

    document.getElementById("edit-button").classList.add("hidden");
    document.getElementById("save-button").classList.remove("hidden");
    document.getElementById("cancel-button").classList.remove("hidden");
    document.getElementById("photo-edit-button").classList.remove("hidden");

    replaceFieldWithInput("field-name-ar", getArabicName());
    replaceFieldWithInput("field-name-en", getEnglishName());
    replaceFieldWithInput("field-code", getCode(), "text", "readonly");

    replaceFieldWithInput("field-dob", dateToInputValue(getDobRaw()), "date");
    replaceFieldWithInput("field-age", getAge(), "number", 'min="0"');
    replaceFieldWithInput("field-pob", currentLang === "ar" ? getArabicPob() : getEnglishPob());

    replaceFieldWithInput("field-department-ar", getArabicDepartment());
    replaceFieldWithInput("field-department-en", getEnglishDepartment());
    replaceFieldWithInput("field-job-ar", getArabicJob());
    replaceFieldWithInput("field-job-en", getEnglishJob());
    replaceFieldWithInput("field-manager-ar", getArabicManager());
    replaceFieldWithInput("field-manager-en", getEnglishManager());
    replaceFieldWithInput("field-hire-date", dateToInputValue(getHireDateRaw()), "date");
    replaceFieldWithInput("field-years-service", getYearsService(), "number", 'min="0"');
    replaceFieldWithInput("field-insurance", currentLang === "ar" ? getArabicInsurance() : getEnglishInsurance());

    replaceFieldWithInput("field-qualification-ar", getArabicQualification());
    replaceFieldWithInput("field-qualification-en", getEnglishQualification());
    replaceFieldWithInput("field-qualification-year", getQualificationYear(), "number");
    replaceFieldWithInput("field-issuing-authority-ar", getArabicAuthority());
    replaceFieldWithInput("field-issuing-authority-en", getEnglishAuthority());

    document.getElementById("profile-status").textContent =
        translations[currentLang].edit_mode;
};

window.cancelEdit = function () {
    selectedPhotoFile = null;
    renderProfile();

    document.getElementById("edit-button").classList.remove("hidden");
    document.getElementById("save-button").classList.add("hidden");
    document.getElementById("cancel-button").classList.add("hidden");
    document.getElementById("photo-edit-button").classList.add("hidden");
};

// ------------------------------------------------------------
// Read edited fields
// ------------------------------------------------------------
function getInputValue(id) {
    const input = document.querySelector(`#${id} input`);
    return input ? input.value.trim() : "";
}

function applyEditedValues() {
    setField(employee, "اسم الموظف ", ["اسم الموظف ", "اسم الموظف", "name"], getInputValue("field-name-ar"));
    setField(employee, "emp_name _en", ["emp_name _en", "emp_name_en", "name_en"], getInputValue("field-name-en"));

    // Employee code is deliberately NOT changed.
    const dob = getInputValue("field-dob");
    setField(employee, "تاريخ الميلاد", ["تاريخ الميلاد", "تاريخ الميلاد ", "dob"], dateInputToExcelSerial(dob));

    setField(employee, "السن حتى تاريخه ", ["السن حتى تاريخه ", "السن حتى تاريخه", "age to date"], getInputValue("field-age"));

    // Place of birth: update both language fields if those fields already exist.
    const pobInput = getInputValue("field-pob");
    if (currentLang === "ar") {
        setField(employee, "محل الميلاد", ["محل الميلاد", "محل الميلاد ", "pob_ar"], pobInput);
    } else {
        setField(employee, "place of birth", ["place of birth", "place_of_birth", "pob_en"], pobInput);
    }

    setField(employee, "الإدارة ", ["الإدارة ", "الإدارة", "department_ar"], getInputValue("field-department-ar"));
    setField(employee, "department ", ["department ", "department_en"], getInputValue("field-department-en"));

    setField(employee, "الوظيفة", ["الوظيفة", "الوظيفة "], getInputValue("field-job-ar"));
    setField(employee, "job title ", ["job title ", "job title", "job_title"], getInputValue("field-job-en"));

    setField(employee, "المدير المباشر", ["المدير المباشر", "المدير المباشر "], getInputValue("field-manager-ar"));
    setField(employee, "direct manager ", ["direct manager ", "direct manager", "direct_manager"], getInputValue("field-manager-en"));

    const hireDate = getInputValue("field-hire-date");
    setField(employee, "تاريخ التعيين ", ["تاريخ التعيين ", "تاريخ التعيين", "date_of_hiring"], dateInputToExcelSerial(hireDate));

    setField(employee, "سنوات الخدمة ", ["سنوات الخدمة ", "سنوات الخدمة", "years of service"], getInputValue("field-years-service"));

    if (currentLang === "ar") {
        setField(employee, "الحالة التأمينية ", ["الحالة التأمينية ", "الحالة التأمينية"], getInputValue("field-insurance"));
    } else {
        setField(employee, "insurance status ", ["insurance status ", "insurance status"], getInputValue("field-insurance"));
    }

    setField(employee, "المؤهل", ["المؤهل", "المؤهل "], getInputValue("field-qualification-ar"));
    setField(employee, "qualification", ["qualification", "qualification "], getInputValue("field-qualification-en"));
    setField(employee, "qualification date ", ["qualification date ", "qualification date", "qualification_year"], getInputValue("field-qualification-year"));

    setField(employee, "جهة إصدار المؤهل", [
        "جهة اصدار المؤهل",
        "جهة إصدار المؤهل",
        "جهة اصدار المؤهل "
    ], getInputValue("field-issuing-authority-ar"));

    setField(employee, "qualification issuing authority", [
        "qualification issuing authority",
        "qualification issuing authority ",
        "qualification_issuing_authority"
    ], getInputValue("field-issuing-authority-en"));
}

// ------------------------------------------------------------
// Save to Firebase
// ------------------------------------------------------------
window.saveEmployee = async function () {
    if (!employee || !dbKey) return;

    const saveButton = document.getElementById("save-button");
    saveButton.disabled = true;
    saveButton.classList.add("opacity-60");
    saveButton.querySelector("span").textContent = translations[currentLang].saving;

    try {
        applyEditedValues();

        // Upload photo first, if the user selected one.
        if (selectedPhotoFile) {
            document.getElementById("profile-status").textContent =
                translations[currentLang].photo_uploading;

            const safeCode = getCode().replace(/[^a-zA-Z0-9_-]/g, "_");
            const photoRef = storageRef(storage, `employee-photos/${safeCode}/profile.jpg`);

            const uploadResult = await uploadBytes(photoRef, selectedPhotoFile, {
                contentType: selectedPhotoFile.type || "image/jpeg",
                cacheControl: "public,max-age=3600"
            });

            const photoURL = await getDownloadURL(uploadResult.ref);

            setField(employee, "photoURL", ["photoURL", "photoUrl", "profilePhoto", "profile_photo"], photoURL);
        }

        // Update only this Firebase record.
        await update(ref(db, `/${dbKey}`), employee);

        originalEmployee = JSON.parse(JSON.stringify(employee));
        selectedPhotoFile = null;

        document.getElementById("profile-status").textContent =
            translations[currentLang].saved;

        document.getElementById("edit-button").classList.remove("hidden");
        document.getElementById("save-button").classList.add("hidden");
        document.getElementById("cancel-button").classList.add("hidden");
        document.getElementById("photo-edit-button").classList.add("hidden");

        renderProfile();

        // Keep a visible success state for a moment.
        document.getElementById("profile-status").textContent =
            translations[currentLang].saved;

    } catch (error) {
        console.error("Save employee error:", error);

        document.getElementById("profile-status").textContent =
            translations[currentLang].save_error;

        alert(
            currentLang === "ar"
                ? "تعذر حفظ التعديلات. راجع Console وقواعد Firebase Realtime Database / Storage."
                : "Unable to save changes. Check the Console and Firebase Realtime Database / Storage rules."
        );
    } finally {
        saveButton.disabled = false;
        saveButton.classList.remove("opacity-60");
        saveButton.querySelector("span").textContent = translations[currentLang].save;
    }
};

// ------------------------------------------------------------
// Photo preview
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("photo-input");

    input.addEventListener("change", event => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert(
                currentLang === "ar"
                    ? "من فضلك اختر ملف صورة."
                    : "Please select an image file."
            );
            input.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert(
                currentLang === "ar"
                    ? "حجم الصورة يجب ألا يتجاوز 5 ميجابايت."
                    : "Image size must not exceed 5 MB."
            );
            input.value = "";
            return;
        }

        selectedPhotoFile = file;

        const reader = new FileReader();

        reader.onload = e => {
            document.getElementById("employee-photo").src = e.target.result;
        };

        reader.readAsDataURL(file);
    });
});

// ------------------------------------------------------------
// Navigation
// ------------------------------------------------------------
window.goBack = function () {
    window.location.href = "index.html";
};

// ------------------------------------------------------------
// Initialization
// ------------------------------------------------------------
async function initProfile() {
    applyLanguage();

    if (!employeeCode) {
        showError(translations[currentLang].code_missing);
        return;
    }

    try {
        const result = await loadEmployee();

        if (!result) {
            showError(translations[currentLang].employee_not_found);
            return;
        }

        employee = result.employee;
        dbKey = result.dbKey;
        originalEmployee = JSON.parse(JSON.stringify(employee));

        document.getElementById("loading-state").classList.add("hidden");
        document.getElementById("profile-content").classList.remove("hidden");

        renderProfile();

    } catch (error) {
        console.error("Profile loading error:", error);

        showError(
            currentLang === "ar"
                ? "حدث خطأ أثناء جلب بيانات الموظف من Firebase. راجع صلاحيات Realtime Database."
                : "Unable to load the employee from Firebase. Check Realtime Database rules."
        );
    }
}

function showError(message) {
    document.getElementById("loading-state").classList.add("hidden");
    document.getElementById("profile-content").classList.add("hidden");
    document.getElementById("error-state").classList.remove("hidden");
    document.getElementById("error-message").textContent = message;
}

document.addEventListener("DOMContentLoaded", initProfile);
