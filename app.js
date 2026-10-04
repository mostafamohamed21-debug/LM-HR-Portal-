document.addEventListener("DOMContentLoaded", () => {
    console.log("Portal Initialized with Dark Tech Theme.");
    
    // تم تصحيح اسم الملف ليطابق الملف المرفوع
    fetch('clean_employees_data_2_2.json')
        .then(response => response.json())
        .then(jsonData => {
            const tableBody = document.getElementById('employees-table-body');
            tableBody.innerHTML = '';
            
            // استخراج الأوبجكت الخاص بالموظفين من الـ Root
            const employeesObj = jsonData.employees || jsonData;
            const employeesArray = Object.values(employeesObj);
            
            // تحديث العدد الإجمالي الفعلي للموظفين
            document.getElementById('total-employees-count').textContent = employeesArray.length || 352;

            employeesArray.forEach(emp => {
                const row = document.createElement('tr');
                row.className = "hover:bg-slate-800/40 transition text-slate-300";
                row.innerHTML = `
                    <td class="p-3.5 font-mono text-sky-400">${emp.Code || emp.الكود || '--'}</td>
                    <td class="p-3.5 font-semibold text-white">${emp["اسم الموظف"] || emp["Emp_name _En"] || '--'}</td>
                    <td class="p-3.5">${emp["الإدارة"] || emp["Human Resources & Administrative Affairs"] || '--'}</td>
                    <td class="p-3.5">${emp["الوظيفة"] || emp["Job title"] || '--'}</td>
                    <td class="p-3.5 font-mono text-xs">${emp["تاريخ التعيين"] || emp["Date_of_Hiring"] || '--'}</td>
                    <td class="p-3.5 text-center">
                        <button onclick="viewEmployee('${emp.Code || emp.الكود}')" class="px-3 py-1 bg-sky-600/40 hover:bg-sky-600 text-sky-200 rounded text-xs border border-sky-400/30 transition">عرض</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            document.getElementById('connection-status').textContent = "متصل بنجاح (" + employeesArray.length + " موظف)";
            document.getElementById('connection-status').className = "text-xs px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/30";
        })
        .catch(error => {
            console.error("Error loading employees data:", error);
            document.getElementById('employees-table-body').innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-400">تعذر تحميل البيانات، تأكد من صحة مسار ملف الـ JSON.</td></tr>`;
        });
});
