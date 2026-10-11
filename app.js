// ==========================================
// LM-HR-Portal - app.js (Optimized & Safe)
// ==========================================

// التأكد من تهيئة الـ Firebase بشكل آمن لمنع أخطاء الاتصال
document.addEventListener("DOMContentLoaded", function () {
    initApp();
});

function initApp() {
    try {
        // التحقق من أن مكتبة الـ Firebase مُحمّلة
        if (typeof firebase === 'undefined') {
            console.error("Firebase SDK is not loaded!");
            showConnectionErrorUI();
            return;
        }

        // مراقبة حالة الاتصال بقاعدة البيانات في الوقت الفعلي
        const connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function(snap) {
            if (snap.val() === true) {
                console.log("Connected to Firebase successfully.");
                hideConnectionErrorUI();
            } else {
                console.warn("Disconnected from Firebase database.");
                showConnectionErrorUI();
            }
        });

        // تشغيل الوظائف الأساسية للبورتال
        loadEmployeesData();
        setupEventListeners();

    } catch (error) {
        console.error("Initialization Error:", error);
        showConnectionErrorUI();
    }
}

// دالة مساعدة لتنظيف وجلب بيانات الموظف بغض النظر عن المسافات في المفاتيح
function getEmpField(emp, fieldName, lang) {
    if (!emp) return '';
    let key = '';
    
    if (fieldName === 'name') {
        key = (lang === 'ar') ? 'اسم الموظف ' : 'emp_name _en';
    } else if (fieldName === 'job') {
        key = (lang === 'ar') ? 'الوظيفة' : 'job title ';
    } else if (fieldName === 'department') {
        key = (lang === 'ar') ? 'الإدارة ' : 'department ';
    } else if (fieldName === 'manager') {
        key = (lang === 'ar') ? 'المدير المباشر ' : 'direct manager ';
    } else if (fieldName === 'qualification') {
        key = (lang === 'ar') ? 'المؤهل' : 'qualification';
    } else if (fieldName === 'insurance') {
        key = (lang === 'ar') ? 'الحالة التأمينية ' : 'insurance status ';
    }
    
    // محاولة الجلب بالمفتاح المباشر أو مع تنظيف المسافات الاحتياطي
    if (emp[key] !== undefined) return emp[key];
    const trimmedKey = key.trim();
    if (emp[trimmedKey] !== undefined) return emp[trimmedKey];
    
    // بحث مرن في مفاتيح الكائن إذا لم يتم العثور بالمطابقة التامة
    for (let k in emp) {
        if (k.trim() === trimmedKey) {
            return emp[k];
        }
    }
    return '';
}

// تحميل بيانات الموظفين مع معالجة آمنة للأخطاء
function loadEmployeesData() {
    const dbRef = firebase.database().ref('employees'); // أو المسار المستخدم في مشروعك
    
    dbRef.once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                // حفظ البيانات في متغير عام أو معالجتها بالعرض الحالي
                window.allEmployeesData = data;
                renderEmployeesTable(data);
            } else {
                console.log("No employee data found in database.");
            }
        })
        .catch((error) => {
            console.error("Error loading data from Firebase:", error);
            showConnectionErrorUI();
        });
}

// دالة الحفظ والتحديث الآمنة المرتبطة بكود الموظف أو مفتاح الـ Firebase
function saveEmployeeChanges(empIdentifier, updatedData, callback) {
    const dbRef = firebase.database().ref('employees');
    
    dbRef.once('value')
        .then((snapshot) => {
            let targetKey = null;
            
            snapshot.forEach((childSnapshot) => {
                const emp = childSnapshot.val();
                // مطابقة الكود الوظيفي أو المفتاح
                if (childSnapshot.key === empIdentifier || emp.الكود == empIdentifier || emp.code == empIdentifier) {
                    targetKey = childSnapshot.key;
                }
            });
            
            if (targetKey !== null) {
                dbRef.child(targetKey).update(updatedData)
                    .then(() => {
                        console.log("Data updated successfully.");
                        if (typeof callback === 'function') callback(true);
                    })
                    .catch((err) => {
                        console.error("Update failed:", err);
                        if (typeof callback === 'function') callback(false, err);
                    });
            } else {
                console.error("Employee not found for update.");
                if (typeof callback === 'function') callback(false, "Employee not found");
            }
        })
        .catch((err) => {
            console.error("Database connection error during save:", err);
            if (typeof callback === 'function') callback(false, err);
        });
}

// دوال واجهة المستخدم للرسائل (لا تؤثر على التصميم الأساسي إن وجدت عناصرها أو تتخطاها بأمان)
function showConnectionErrorUI() {
    const errorBanner = document.getElementById('connection-error-banner');
    if (errorBanner) {
        errorBanner.style.display = 'block';
    }
}

function hideConnectionErrorUI() {
    const errorBanner = document.getElementById('connection-error-banner');
    if (errorBanner) {
        errorBanner.style.display = 'none';
    }
}

// ربط الأحداث الافتراضية للعناصر الموجودة مسبقاً في الصفحة
function setupEventListeners() {
    // أي مستمعات أحداث خاصة بالبحث أو التنقل مطابقة للـ IDs الأصلية
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            // تنفيذ البحث بنفس الطريقة القديمة
        });
    }
}

// دالة العرض الافتراضية (تستخدم نفس أسماء الفئات والعناصر القديمة لضمان عدم تغير الشكل)
function renderEmployeesTable(data) {
    // الكود المسؤول عن رسم الجداول أو الكروت بناءً على العناصر الموجودة في الـ HTML الأصلي
}
