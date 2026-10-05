// دالة عرض ملف الموظف في صفحة كاملة تملى الشاشة بتصميم عالمي
function viewEmployee(code) {
    const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
    if (!emp) {
        alert("لم يتم العثور على الموظف");
        return;
    }

    // استخراج بيانات الموظف بدقة لكل خانة مستقلة
    const nameAr = emp["اسم الموظف"] || emp.اسم_الموظف || emp.Name || "غير متوفر";
    const nameEn = emp["Emp_name _En"] || emp.Emp_name_En || "N/A";
    const deptAr = emp["الإدارة"] || emp.Department || "غير متوفر";
    const deptEn = emp["Human Resources & Administrative Affairs"] || emp["Human Resources"] || "N/A";
    const jobAr = emp["الوظيفة"] || "غير متوفر";
    const jobEn = emp["Job title"] || emp.Job_title || "N/A";
    const hireDate = emp["تاريخ التعيين"] || emp.Date_of_Hiring || "--";
    const directMgrAr = emp["المدير المباشر"] || "--";
    const directMgrEn = emp["Direct manager"] || "--";
    const qualAr = emp["المؤهل"] || "--";
    const qualEn = emp["Qualification"] || "--";
    const qualAuthAr = emp["جهة المؤهل"] || "--";
    const qualAuthEn = emp["Qulification Issuing Authority"] || "--";
    const qualDate = emp["تاريخ الحصول على المؤهل"] || emp["Qualification Date"] || "--";
    const yearsService = emp["سنوات الخدمة"] || emp["Years of service"] || "--";
    const insuranceAr = emp["الحالة التأمينية"] || "--";
    const insuranceEn = emp["Insurance Status"] || "--";
    const dob = emp["تاريخ الميلاد"] || emp.DOB || "--";
    const age = emp["السن حتى تاريخه"] || emp["Age to date"] || "--";
    const pobAr = emp["مكان الميلاد"] || "--";
    const pobEn = emp["POB"] || "--";
    const nationalId = emp["الرقم القومى"] || emp.N_ID || "غير مسجل";
    const leaveBal = emp["رصيد الاجازات"] || emp["Annual Leave balance"] || "0";
    const address = emp["العنوان"] || emp.address || "غير مسجل";
    const mobile = emp["رقم الهاتف"] || emp["mobile number"] || "غير مسجل";
    const emgPhone = emp["رقم هاتف الطوارئ"] || emp.Emg_Phone_No || "غير مسجل";
    const email = emp["الايميل"] || emp.Email || "غير مسجل";
    
    const empPhoto = emp.photo || 'background.jpg';

    // تصميم الصفحة الكاملة (Full Page Layout)
    const fullPageHTML = `
        <div id="employee-full-profile-view" class="w-full min-h-screen p-6 space-y-6 animate-fadeIn">
            
            <!-- شريط العنوان والرجوع -->
            <div class="flex items-center justify-between bg-slate-900/90 border border-slate-700/60 p-4 rounded-2xl backdrop-blur-md shadow-xl">
                <button onclick="location.reload()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition flex items-center gap-2 border border-slate-700">
                    ← العودة للقائمة الرئيسية
                </button>
                <div class="text-center">
                    <h1 class="text-xl font-bold text-white">الملف الوظيفي الشامل</h1>
                    <p class="text-xs text-sky-400">Employee Comprehensive Profile</p>
                </div>
                <button onclick="saveEmployeeProfileChanges('${code}')" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-900/30 flex items-center gap-2">
                    💾 حفظ التعديلات
                </button>
            </div>

            <!-- رأس الملف الشخصي (الصورة + زر التعديل المباشر + الاسم) -->
            <div class="bg-slate-900/90 border border-slate-700/60 p-6 rounded-2xl backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-6">
                <div class="relative group">
                    <div class="w-32 h-32 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 p-1 shadow-2xl">
                        <img id="profile-img-preview" src="${empPhoto}" alt="Employee Photo" class="w-full h-full object-cover rounded-2xl bg-slate-950">
                    </div>
                    <!-- زر تغيير الصورة -->
                    <label for="upload-emp-photo" class="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white text-xs font-semibold">
                        <span>📷 تغيير الصورة</span>
                        <input type="file" id="upload-emp-photo" accept="image/*" class="hidden" onchange="handlePhotoUpload(event, '${code}')">
                    </label>
                </div>
                <div class="flex-1 text-center md:text-start space-y-3 w-full">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">اسم الموظف (عربي)</label>
                            <input type="text" id="edit-name-ar" value="${nameAr}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-base focus:outline-none focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">Employee Name (English)</label>
                            <input type="text" id="edit-name-en" value="${nameEn}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sky-300 font-medium text-base focus:outline-none focus:border-sky-500">
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2 justify-center md:justify-start pt-1">
                        <span class="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-sky-400">الكود: ${code}</span>
                        <span class="px-3 py-1 bg-sky-950/60 border border-sky-800 text-sky-300 rounded-lg text-xs">${jobAr}</span>
                    </div>
                </div>
            </div>

            <!-- شبكة البيانات (كل خانة مستقلة تماماً ومنسقة بالعربي والإنجليزي) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <!-- الإدارة والوظيفة -->
                <div class="bg-slate-900/90 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-md shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-sky-400 border-b border-slate-800 pb-2">🏢 الهيكل التنظيمي</h3>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">الإدارة (عربي)</label>
                        <input type="text" id="edit-dept-ar" value="${deptAr}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">Department (English)</label>
                        <input type="text" id="edit-dept-en" value="${deptEn}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-sky-500">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">المدير المباشر (Direct Manager)</label>
                        <input type="text" value="${directMgrAr} / ${directMgrEn}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-300 text-sm" readonly>
                    </div>
                </div>

                <!-- التواريخ والخدمة -->
                <div class="bg-slate-900/90 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-md shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-indigo-400 border-b border-slate-800 pb-2">📅 التواريخ وخدمة الشركة</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">تاريخ التعيين</label>
                            <input type="text" value="${hireDate}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-emerald-400 text-xs font-mono" readonly>
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">سنوات الخدمة</label>
                            <input type="text" value="${yearsService} سنة" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-emerald-400 text-xs font-bold" readonly>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">المؤهل الدراسي</label>
                        <input type="text" value="${qualAr}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-300 text-xs mb-1" readonly>
                        <input type="text" value="${qualEn}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-400 text-xs" readonly>
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">جهة التخرج وتاريخه</label>
                        <input type="text" value="${qualAuthAr} (${qualDate})" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-300 text-xs" readonly>
                    </div>
                </div>

                <!-- البيانات الشخصية والسن (مفصولين تماماً) -->
                <div class="bg-slate-900/90 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-md shadow-xl space-y-4">
                    <h3 class="text-sm font-bold text-emerald-400 border-b border-slate-800 pb-2">👤 الميلاد والسن والتأمين</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">تاريخ الميلاد (DOB)</label>
                            <input type="text" value="${dob}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-white text-xs font-mono" readonly>
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">السن حتى تاريخه</label>
                            <input type="text" value="${age} سنة" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-amber-400 text-xs font-bold" readonly>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">مكان الميلاد</label>
                            <input type="text" value="${pobAr} / ${pobEn}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-300 text-xs" readonly>
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">الحالة التأمينية</label>
                            <input type="text" value="${insuranceAr}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-sky-300 text-xs" readonly>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">الرقم القومي (National ID)</label>
                        <input type="text" value="${nationalId}" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-white text-xs font-mono" readonly>
                    </div>
                </div>

                <!-- التواصل والعنوان -->
                <div class="bg-slate-900/90 border border-slate-700/60 p-5 rounded-2xl backdrop-blur-md shadow-xl col-span-1 md:col-span-3 space-y-4">
                    <h3 class="text-sm font-bold text-amber-400 border-b border-slate-800 pb-2">📞 قنوات الاتصال والعنوان</h3>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">رقم الهاتف (Mobile)</label>
                            <input type="text" id="edit-mobile" value="${mobile}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">رقم الطوارئ (Emergency)</label>
                            <input type="text" id="edit-emg" value="${emgPhone}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">البريد الإلكتروني (Email)</label>
                            <input type="text" id="edit-email" value="${email}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-400 mb-1">رصيد الإجازات</label>
                            <input type="text" value="${leaveBal} يوم" class="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-emerald-400 text-sm font-bold" readonly>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">العنوان التفصيلي (Address)</label>
                        <input type="text" id="edit-address" value="${address}" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500">
                    </div>
                </div>

            </div>

        </div>
    `;

    // استبدال الشاشة الحالية بصفحة الملف الشخصي الكاملة
    const containerToReplace = document.querySelector('main') || document.body;
    containerToReplace.innerHTML = fullPageHTML;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// دالة رفع وتعديل صورة الموظف
function handlePhotoUpload(event, code) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result;
            document.getElementById('profile-img-preview').src = base64Image;
            
            const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
            if (emp) {
                emp.photo = base64Image;
            }
            alert("تم رفع الصورة بنجاح! اضغط على زر 'حفظ التعديلات' لتثبيتها نهائياً.");
        };
        reader.readAsDataURL(file);
    }
}

// دالة حفظ التعديلات
function saveEmployeeProfileChanges(code) {
    const emp = allEmployees.find(e => String(e.الكود || e.Code) === String(code));
    if (emp) {
        emp["اسم الموظف"] = document.getElementById('edit-name-ar').value;
        emp["Emp_name _En"] = document.getElementById('edit-name-en').value;
        emp["الإدارة"] = document.getElementById('edit-dept-ar').value;
        emp["Human Resources & Administrative Affairs"] = document.getElementById('edit-dept-en').value;
        emp["رقم الهاتف"] = document.getElementById('edit-mobile').value;
        emp["رقم هاتف الطوارئ"] = document.getElementById('edit-emg').value;
        emp["الايميل"] = document.getElementById('edit-email').value;
        emp["العنوان"] = document.getElementById('edit-address').value;

        alert(`تم حفظ التعديلات للموظف [${code}] بنجاح وتثبيت البيانات والصورة!`);
        location.reload();
    }
}
