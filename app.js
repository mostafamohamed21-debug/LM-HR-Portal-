// ==========================================
// LM-HR-Portal - app.js (Fixed Connection & Login)
// ==========================================

// إعدادات اتصال Firebase الخاصة بمشروعك (استبدل القيم أدناه بإعداداتك الأصلية)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// تهيئة الـ Firebase بشكل آمن
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

document.addEventListener("DOMContentLoaded", function () {
    initPortal();
});

function initPortal() {
    // مراقبة حالة الاتصال بقاعدة البيانات في الوقت الفعلي
    const connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", function(snap) {
        if (snap.val() === true) {
            console.log("Connected to Firebase successfully.");
            hideConnectionError();
        } else {
            console.warn("Disconnected from Firebase.");
            showConnectionError();
        }
    });

    setupLoginForm();
}

function setupLoginForm() {
    // ربط عملية تسجيل الدخول بنموذج أو زر الدخول الموجود في الصفحة الحالية
    const loginForm = document.querySelector('form') || document.getElementById('login-form');
    const signInBtn = document.querySelector('button[type="submit"]') || document.getElementById('signin-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    } else if (signInBtn) {
        signInBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

function handleLogin() {
    // قراءة كود الموظف وكلمة المرور من الحقول الحالية في الصفحة
    const inputs = document.querySelectorAll('input');
    let empCode = '';
    let password = '';

    inputs.forEach(input => {
        if (input.type === 'text' || input.type === 'number' || input.id?.includes('code') || input.name?.includes('code')) {
            empCode = input.value.trim();
        } else if (input.type === 'password') {
            password = input.value.trim();
        }
    });

    if (!empCode && inputs.length > 0) empCode = inputs[0].value.trim();
    if (!password && inputs.length > 1) password = inputs[1].value.trim();

    if (!empCode) {
        alert("يرجى إدخال كود الموظف");
        return;
    }

    // جلب البيانات والتحقق من قاعدة بيانات الموظفين
    const dbRef = firebase.database().ref('employees');
    dbRef.once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (!data) {
                showConnectionError("لا توجد بيانات موظفين مسجلة");
                return;
            }

            let foundEmp = null;
            Object.keys(data).forEach(key => {
                const emp = data[key];
                if (emp && (emp.الكود == empCode || emp.code == empCode || key === empCode)) {
                    foundEmp = emp;
                }
            });

            if (foundEmp) {
                console.log("Employee verified successfully.");
                hideConnectionError();
                localStorage.setItem('currentEmployee', JSON.stringify(foundEmp));
                // التوجيه للوحة التحكم أو الصفحة التالية حسب هيكل مشروعك
                window.location.href = "dashboard.html"; 
            } else {
                alert("كود الموظف غير صحيح");
            }
        })
        .catch((error) => {
            console.error("Database Error:", error);
            showConnectionError();
        });
}

function showConnectionError(msg) {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 && el.childNodes[0].nodeValue.includes('Connection error')) {
            el.style.display = 'block';
            if (msg) el.childNodes[0].nodeValue = msg;
        }
    });
}

function hideConnectionError() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 && el.childNodes[0].nodeValue.includes('Connection error')) {
            el.style.display = 'none';
        }
    });
}
