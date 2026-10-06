// ============================================================
// Lacto Misr HR Portal - Main App
// Firebase Realtime Database + Firebase Storage
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
    getDatabase,
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

// ------------------------------------------------------------
// Firebase configuration supplied for this project
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
getStorage(firebaseApp);

// ------------------------------------------------------------
// Translations
// ------------------------------------------------------------
const translations = {
    ar: {
        page_title: "البورتال المركزي - شؤون العاملين | Lacto Misr",
        connecting: "جاري الاتصال...",
        connection_status: "متصل بـ Firebase",
        connection_error: "تعذر الاتصال بـ Firebase",
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
        search_placeholder: "بحث بالاسم أو الكود أو الإدارة...",
        th_code: "الكود",
        th_name: "اسم الموظف",
        th_dept: "الإدارة",
        th_job: "الوظيفة",
        th_hire: "تاريخ التعيين",
        th_actions: "الإجراءات",
        loading: "جاري جلب البيانات من القاعدة...",
        no_results: "لا توجد نتائج مطابقة.",
        view: "عرض الملف",
        employees: "موظف",
        employee: "موظف"
    },
    en: {
        page_title: "HR Central Portal | Lacto Misr",
        connecting: "Connecting...",
        connection_status: "Connected to Firebase",
        connection_error: "Firebase connection failed",
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
        search_placeholder: "Search by name, code or department...",
        th_code: "Code",
        th_name: "Employee Name",
        th_dept: "Department",
        th_job: "Job Title",
        th_hire: "Hire Date",
        th_actions: "Actions",
        loading: "Loading database records...",
        no_results: "No matching employees found.",
        view: "View Profile",
        employees: "Employees",
        employee: "Employee"
    }
};

let currentLang = localStorage.getItem("lacto_hr_lang") || "ar";
let allEmployees = [];

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

// Excel serial date -> Date
function excelSerialToDate(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return null;

    const excelEpoch = Date.UTC(1899, 11, 30);
    return new Date(excelEpoch + numeric * 86400000);
}

function formatDate(value) {
    if (value === null || value === undefined || value === "") return "--";

    // Already a normal date string
    if (typeof value === "string" && /[\/-]/.test(value) && Number.isNaN(Number(value))) {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString(currentLang === "ar" ? "ar-EG" : "en-GB");
        }
        return value;
    }

    const date = excelSerialToDate(value);
    if (!date) return cleanValue(value) || "--";

    return date.toLocaleDateString(currentLang === "ar" ? "ar-EG" : "en-GB");
}

function getArabicName(emp) {
    return cleanValue(emp["اسم الموظف "]) || cleanValue(emp.name) || "--";
}

function getEnglishName(emp) {
    return cleanValue(emp["emp_name _en"]) || getArabicName(emp);
}

function getArabicDepartment(emp) {
    return cleanValue(emp["الإدارة "]) || cleanValue(emp.department) || "--";
}

function getEnglishDepartment(emp) {
    return cleanValue(emp["department "]) || getArabicDepartment(emp);
}

function getArabicJob(emp) {
    return cleanValue(emp["الوظيفة"]) || "--";
}

function getEnglishJob(emp) {
    return cleanValue(emp["job title "]) || getArabicJob(emp);
}

function getCode(emp) {
    return cleanValue(emp["الكود"]) || cleanValue(emp.code) || cleanValue(emp.ID);
}

function getHireDate(emp) {
    return emp["تاريخ التعيين "] ?? emp.date_of_hiring ?? "";
}

function getSearchText(emp) {
    return [
        getCode(emp),
        getArabicName(emp),
        getEnglishName(emp),
        getArabicDepartment(emp),
        getEnglishDepartment(emp),
        getArabicJob(emp),
        getEnglishJob(emp),
        cleanValue(emp["المدير المباشر"]),
        cleanValue(emp["direct manager "])
    ].join(" ").toLowerCase();
}

// ------------------------------------------------------------
// Firebase data loader
// Current database structure is root-level numeric records.
// Example: /0, /1, /2 ... each record contains "code".
// ------------------------------------------------------------
async function getEmployeesFromFirebase() {
    const snapshot = await get(ref(db, "/"));

    if (!snapshot.exists()) {
        return [];
    }

    const raw = snapshot.val();

    if (Array.isArray(raw)) {
        return raw
            .map((employee, index) => ({
                employee,
                dbKey: String(index)
            }))
            .filter(item => item.employee && typeof item.employee === "object");
    }

    if (raw && typeof raw === "object") {
        return Object.entries(raw)
            .filter(([, employee]) => employee && typeof employee === "object")
            .map(([dbKey, employee]) => ({
                employee,
                dbKey
            }));
    }

    return [];
}

// ------------------------------------------------------------
// Language
// ------------------------------------------------------------
function applyLanguage() {
    const root = document.getElementById("html-root");

    root.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
    root.setAttribute("lang", currentLang);

    document.getElementById("page-title").textContent =
        translations[currentLang].page_title;

    document.querySelectorAll("[data-translate]").forEach(el => {
        const key = el.getAttribute("data-translate");
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    document.querySelectorAll("[data-translate-placeholder]").forEach(el => {
        const key = el.getAttribute("data-translate-placeholder");
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });

    const langButton = document.getElementById("lang-btn-text");
    if (langButton) {
        langButton.textContent = currentLang === "ar" ? "English" : "العربية";
    }

    renderEmployees();
}

window.toggleLanguage = function () {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("lacto_hr_lang", currentLang);
    applyLanguage();
};

// ------------------------------------------------------------
// Table rendering
// ------------------------------------------------------------
function renderEmployees(filterText = null) {
    const tableBody = document.getElementById("employees-table-body");
    if (!tableBody) return;

    const query = filterText !== null
        ? filterText
        : document.getElementById("search-input")?.value || "";

    const normalizedQuery = query.trim().toLowerCase();

    const visible = allEmployees.filter(item => {
        if (!normalizedQuery) return true;
        return getSearchText(item.employee).includes(normalizedQuery);
    });

    if (!visible.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="p-6 text-center text-slate-400">
                    ${escapeHtml(translations[currentLang].no_results)}
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = visible.map(item => {
        const emp = item.employee;
        const code = getCode(emp);
        const name = currentLang === "ar" ? getArabicName(emp) : getEnglishName(emp);
        const department = currentLang === "ar"
            ? getArabicDepartment(emp)
            : getEnglishDepartment(emp);
        const job = currentLang === "ar" ? getArabicJob(emp) : getEnglishJob(emp);
        const hireDate = formatDate(getHireDate(emp));

        return `
            <tr class="table-row text-slate-300">
                <td class="p-3.5 font-mono text-sky-400">${escapeHtml(code || "--")}</td>
                <td class="p-3.5 font-semibold text-white">${escapeHtml(name)}</td>
                <td class="p-3.5">${escapeHtml(department)}</td>
                <td class="p-3.5">${escapeHtml(job)}</td>
                <td class="p-3.5 font-mono text-xs">${escapeHtml(hireDate)}</td>
                <td class="p-3.5 text-center">
                    <button
                        onclick="viewEmployee('${encodeURIComponent(code)}')"
                        class="px-3 py-1.5 bg-sky-600/40 hover:bg-sky-600 text-sky-100 rounded text-xs border border-sky-400/30 transition">
                        ${escapeHtml(translations[currentLang].view)}
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

window.viewEmployee = function (encodedCode) {
    const code = decodeURIComponent(encodedCode);
    window.location.href = `profile.html?code=${encodeURIComponent(code)}`;
};

// ------------------------------------------------------------
// Search
// ------------------------------------------------------------
function setupSearch() {
    const input = document.getElementById("search-input");
    if (!input) return;

    input.addEventListener("input", () => {
        renderEmployees(input.value);
    });
}

// ------------------------------------------------------------
// Dashboard stats
// ------------------------------------------------------------
function updateStats() {
    document.getElementById("total-employees-count").textContent = allEmployees.length;

    const departments = new Set(
        allEmployees
            .map(item => getEnglishDepartment(item.employee))
            .map(value => cleanValue(value))
            .filter(Boolean)
    );

    document.getElementById("active-departments-count").textContent = departments.size;
}

// ------------------------------------------------------------
// Connection status
// ------------------------------------------------------------
function setConnectionStatus(ok) {
    const status = document.getElementById("connection-status");
    const systemStatus = document.getElementById("system-status-text");

    if (!status) return;

    if (ok) {
        status.textContent = translations[currentLang].connection_status;
        status.className =
            "text-xs px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/30";

        if (systemStatus) {
            systemStatus.textContent = translations[currentLang].connected;
            systemStatus.className = "text-3xl font-bold mt-1 text-emerald-400";
        }
    } else {
        status.textContent = translations[currentLang].connection_error;
        status.className =
            "text-xs px-3 py-1 rounded-full bg-red-900/60 text-red-300 border border-red-500/30";

        if (systemStatus) {
            systemStatus.textContent = "Offline";
            systemStatus.className = "text-3xl font-bold mt-1 text-red-400";
        }
    }
}

// ------------------------------------------------------------
// Initialization
// ------------------------------------------------------------
async function initPortal() {
    console.log("Lacto Misr HR Portal initialized.");

    applyLanguage();
    setupSearch();

    try {
        allEmployees = await getEmployeesFromFirebase();

        updateStats();
        renderEmployees();
        setConnectionStatus(true);

        console.log(`Loaded ${allEmployees.length} employee records from Firebase.`);
    } catch (error) {
        console.error("Firebase loading error:", error);

        setConnectionStatus(false);

        document.getElementById("employees-table-body").innerHTML = `
            <tr>
                <td colspan="6" class="p-8 text-center text-red-400">
                    ${escapeHtml(
                        currentLang === "ar"
                            ? "حدث خطأ أثناء جلب بيانات الموظفين من Firebase. راجع صلاحيات Realtime Database."
                            : "Unable to load employee data from Firebase. Please check Realtime Database rules."
                    )}
                </td>
            </tr>
        `;
    }
}

document.addEventListener("DOMContentLoaded", initPortal);
