// إخفاء الانترو بسلاسة بعد ثانيتين ونصف
window.addEventListener('load', () => {
    setTimeout(() => {
        const intro = document.getElementById('portal-intro');
        intro.classList.add('fade-out');
    }, 2500);
});

// قاموس النصوص للغتين (العربية والإنجليزية)
const translations = {
    ar: {
        dir: 'rtl',
        langName: 'English',
        introTitle: 'بوابة الشركة المركزية',
        introSub: 'جاري تحميل النظام الإداري المتكامل...',
        brandTitle: 'بوابة الشركة المركزية',
        brandSlogan: 'نظام الإدارة والتحكم الشامل',
        loginHeader: 'تسجيل الدخول',
        loginSub: 'أدخل بيانات الحساب الخاصة بك للمتابعة',
        labelUser: 'اسم المستخدم / البريد الإلكتروني',
        labelPass: 'كلمة المرور',
        submitBtn: 'تسجيل الدخول',
        placeUser: 'name@company.com'
    },
    en: {
        dir: 'ltr',
        langName: 'العربية',
        introTitle: 'Central Company Portal',
        introSub: 'Loading Integrated Management System...',
        brandTitle: 'Central Portal',
        brandSlogan: 'Comprehensive Management System',
        loginHeader: 'Sign In',
        loginSub: 'Enter your account credentials to continue',
        labelUser: 'Username / Email',
        labelPass: 'Password',
        submitBtn: 'Sign In',
        placeUser: 'name@company.com'
    }
};

let currentLang = 'ar';

// دالة تبديل اللغة وتعديل الاتجاهات والنصوص بالكامل
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const t = translations[currentLang];

    // تغيير اتجاه الصفحة
    document.documentElement.setAttribute('dir', t.dir);
    document.documentElement.setAttribute('lang', currentLang);

    // تحديث النصوص
    document.getElementById('langText').innerText = t.langName;
    document.getElementById('intro-title-text').innerText = t.introTitle;
    document.getElementById('intro-subtitle-text').innerText = t.introSub;
    document.getElementById('brandTitleText').innerText = t.brandTitle;
    document.getElementById('brandSloganText').innerText = t.brandSlogan;
    document.getElementById('loginHeader').innerText = t.loginHeader;
    document.getElementById('loginSubText').innerText = t.loginSub;
    document.getElementById('labelUser').innerText = t.labelUser;
    document.getElementById('labelPass').innerText = t.labelPass;
    document.getElementById('submitBtnText').innerText = t.submitBtn;
    document.getElementById('userInput').placeholder = t.placeUser;

    // ضبط ترتيب الفليكس بوكس لشاشة تسجيل الدخول حسب اللغة
    const wrapper = document.querySelector('.login-wrapper');
    if (currentLang === 'en') {
        wrapper.style.flexDirection = 'row-reverse';
    } else {
        wrapper.style.flexDirection = 'row';
    }
}
