document.addEventListener("DOMContentLoaded", () => {
    // جلب البيانات باستخدام الاسم الدقيق للملف بدون أي إضافات
    fetch('clean_employees_data_2')
        .then(response => {
            if (!response.ok) {
                throw new Error("فشل في تحميل بيانات الملف");
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('employees-list');
            if (!container) return;

            container.innerHTML = '';
            
            // عرض بيانات العاملين
            data.forEach(emp => {
                const card = document.createElement('div');
                card.className = 'employee-card';
                card.innerHTML = `<h3>${emp.name || 'مُوظف'}</h3><p>${emp.position || ''}</p>`;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("خطأ في جلب البيانات:", error);
        });
});
