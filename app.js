// إعدادات مشروع الفايربيس الجديد (lm-hr-portal)
const firebaseConfig = {
  apiKey: "AIzaSyA-ywy51h3TM6YF_n0bNj1D5lAMJ7uMnO4",
  authDomain: "lm-hr-portal.firebaseapp.com",
  databaseURL: "https://lm-hr-portal-default-rtdb.firebaseio.com",
  projectId: "lm-hr-portal",
  storageBucket: "lm-hr-portal.firebasestorage.app",
  messagingSenderId: "1008702496104",
  appId: "1:1008702496104:web:8f57262d5c6633de40cadd",
  measurementId: "G-0XX2D6PNLQ"
};

// تهيئة الاتصال
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// فحص حالة الاتصال وتحديث الواجهة أوتوماتيك
db.ref('.info/connected').on('value', function(snap) {
    const badge = document.getElementById('dbStatus');
    if (snap.val() === true) {
        badge.style.background = "rgba(16, 185, 129, 0.15)";
        badge.style.color = "#34d399";
        badge.style.borderColor = "rgba(16, 185, 129, 0.4)";
        badge.innerText = "✅ متصل بقاعدة بيانات lm-hr-portal بنجاح!";
    } else {
        badge.style.background = "rgba(239, 68, 68, 0.15)";
        badge.style.color = "#f87171";
        badge.style.borderColor = "rgba(239, 68, 68, 0.4)";
        badge.innerText = "❌ جاري إعادة الاتصال...";
    }
});