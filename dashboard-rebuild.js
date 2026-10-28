/* Clean rebuild: one dashboard renderer, reads only the already-loaded employee records.
   No database writes, no changes to authentication, employees, or approvals. */
function renderRichDashboard(){
 const host=document.getElementById('hr-dashboard-view');if(!host)return;
 // This renderer is self-contained: never execute the legacy dashboard.
 const staff=Array.isArray(allEmployees)?allEmployees:[], total=staff.length;
 const ar=currentLang==='ar',tr=(a,b)=>ar?a:b,esc=x=>escapeHtml(String(x??''));
 const field=(e,...k)=>String(getField(e,...k)||'').trim();
 const parseDate=raw=>{if(raw===null||raw===undefined||raw==='')return null;let t=String(raw).trim(),d;if(/^\d{4,5}$/.test(t))d=new Date((Number(t)-25569)*86400000);else if(/^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/.test(t)){let z=t.split(/[\/-]/).map(Number);d=new Date(z[2],z[1]-1,z[0]);}else d=new Date(t);return Number.isNaN(d.getTime())?null:d};

 const countBy=fn=>{const m=new Map();staff.forEach(e=>{let x=fn(e);if(x&&x!=='--')m.set(x,(m.get(x)||0)+1)});return [...m].sort((a,b)=>b[1]-a[1])};
 const dept=countBy(getEmployeeDept), qual=countBy(e=>field(e,'qualification ','qualification','المؤهل','المؤهل العلمي'));
 const ins=countBy(e=>field(e,'insurance status ','insurance status','insuranceStatus','الحالة التأمينية'));
 const marital=countBy(e=>field(e,'marital status ','marital status','maritalStatus','الحالة الاجتماعية','الحالة الإجتماعية'));
 const religion=countBy(e=>field(e,'religion','religion ','Religion','الديانة','الديانة '));
 const genders=staff.map(e=>field(e,'gender','Gender','gender_en','النوع','الجنس').toLowerCase());
 const male=genders.filter(x=>/^(male|m|ذكر|رجل)$/.test(x)).length,female=genders.filter(x=>/^(female|f|أنثى|انثى|سيدة)$/.test(x)).length;
 const known=male+female,malePct=known?Math.round(male/known*100):0,femalePct=known?100-malePct:0;
 const ages=staff.map(e=>{let raw=field(e,'dob','date of birth','date_of_birth','تاريخ الميلاد');let d=parseDate(raw);if(!d)return null;let n=new Date().getFullYear()-d.getFullYear();return n>15&&n<100?n:null}).filter(x=>x!==null);
 const years=staff.map(e=>{const s=field(e,'years of service','years of service ','yearsService','سنوات الخدمة');let n=Number(s);return s!==''&&n>=0&&n<=80?n:null}).filter(x=>x!==null);
 const avg=(a,digits=0)=>a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(digits):'—';
 const hire=countBy(e=>{let v=getHireDate(e);let d=parseDate(v);return d?String(d.getFullYear()):String(v).match(/(?:19|20)\d{2}/)?.[0]||''}).sort((a,b)=>a[0].localeCompare(b[0]));
 const recent=staff.slice().sort((a,b)=>String(getHireDate(b)||'').localeCompare(String(getHireDate(a)||''))).slice(0,5);
 const counts=hrGovernorates.map(()=>0);staff.forEach(e=>{let i=hrGovIndex(hrGeoField(e));if(i>=0)counts[i]++});
 const geoCount=counts.reduce((a,b)=>a+b,0);
 const title=(a,b)=>`<div class="cr-head"><b>${esc(tr(a,b))}</b><small>${esc(b)}</small></div>`;
 const card=(cls,a,b,body)=>`<section class="cr-card ${cls}">${title(a,b)}${body}</section>`;
 const kpi=(a,b,value,unit,icon)=>`<section class="cr-card cr-kpi"><span class="cr-kicon">${icon}</span>${title(a,b)}<strong>${esc(value)}</strong><span class="cr-unit">${esc(unit)}</span></section>`;
 const bars=(rows,limit=12)=>{const a=rows.slice(0,limit),max=Math.max(1,...a.map(x=>x[1]));return a.length?`<div class="cr-bars">${a.map(([n,v])=>`<div class="cr-bar" title="${esc(n)}: ${v}"><b>${v}</b><i style="height:${Math.max(3,v/max*100)}%"></i><span>${esc(n)}</span></div>`).join('')}</div>`:'<p class="cr-empty">لا توجد بيانات مسجلة</p>'};
 const ring=(rows)=>{let sum=rows.reduce((a,b)=>a+b[1],0),p=0,colors=['#00caff','#835cff','#ef40c7','#ff9845','#16e0c5'];if(!sum)return '<p class="cr-empty">لا توجد بيانات مسجلة</p>';let grad=rows.slice(0,5).map(([n,v],i)=>{let a=p;p+=v/sum*100;return `${colors[i]} ${a}% ${p}%`}).join(',');if(p<100)grad+=`,#1c3050 ${p}% 100%`;return `<div class="cr-ringwrap"><div class="cr-ring" style="background:conic-gradient(${grad})"><div>${Math.round(rows[0][1]/sum*100)}%</div></div><div class="cr-legend">${rows.slice(0,5).map(([n,v],i)=>`<div><i style="background:${colors[i]}"></i><span>${esc(n)}</span><b>${v}</b></div>`).join('')}</div></div>`};
 const person='<svg viewBox="0 0 16 26" aria-hidden="true"><circle cx="8" cy="4" r="3"/><path d="M5 9h6l2 7-2 1-1.3-5V25H7.8v-8H7v8H5V12l-1 5-2-1z"/></svg>';
 const personNodes=[];let idx=0;
 const ringRows=[4,7,9,11,12,14,12,11,9,7,4];
 ringRows.forEach((count,row)=>{for(let col=0;col<count;col++){
   const x=50+(col-(count-1)/2)*7.2, y=7+row*8.4;
   personNodes.push(`<span class="${idx<femalePct?'female':'male'}" style="left:${x}%;top:${y}%">${person}</span>`);idx++;
 }});
 const gender=known?`<div class="cr-gender"><div class="cr-people">${personNodes.join('')}</div><div class="cr-gstats"><div class="female">${femalePct}%<small>${esc(tr('إناث','Female'))} · ${female}</small></div><div class="male">${malePct}%<small>${esc(tr('ذكور','Male'))} · ${male}</small></div></div></div>`:'<p class="cr-empty">بيانات النوع غير متاحة</p>';
 // One curved SVG connector per department, using deterministic coordinates; no overlapping duplicate layer.
 const orgRows=dept.slice(0,12),left=orgRows.slice(0,6),right=orgRows.slice(6,12);
 const orgPaths=orgRows.map((r,i)=>{let leftSide=i<6,j=i%6,y=34+j*39,sy=147+(j-2.5)*10;let x1=leftSide?252:348,x2=leftSide?174:426;return `<path d="M${x1} ${sy} C${leftSide?222:378} ${sy},${leftSide?222:378} ${y},${x2} ${y}"/>`}).join('');
 const orgLine=(arr,side)=>arr.map(([n,v])=>`<div class="cr-orgitem ${side}"><span>${esc(n)}</span><b>${v}</b></div>`).join('');
 const org=`<div class="cr-org"><svg class="cr-orgpaths" viewBox="0 0 600 300" preserveAspectRatio="none"></svg><div class="cr-orgleft">${orgLine(left,'left')}</div><div class="cr-orglogo"><span class="cr-logocircle"><img src="logo.png" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" alt="Lacto Misr"/><b style="display:none">Lacto Misr</b></span></div><div class="cr-orgright">${orgLine(right,'right')}</div></div>`;
 const line=hire.slice(-12),max=Math.max(1,...line.map(x=>x[1]));const points=line.map(([n,v],i)=>`${22+i*440/Math.max(1,line.length-1)},${148-v/max*118}`).join(' ');
 const trend=line.length>1?`<svg class="cr-trend" viewBox="0 0 490 180" preserveAspectRatio="none"><defs><linearGradient id="crGradient" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#8c4dff" stop-opacity=".55"/><stop offset="1" stop-color="#8c4dff" stop-opacity="0"/></linearGradient></defs><polygon points="22,165 ${points} 462,165" fill="url(#crGradient)"/><polyline points="${points}" fill="none" stroke="#00c9ff" stroke-width="3"/></svg>`:'<p class="cr-empty">بيانات التعيينات غير كافية</p>';
 const list=rows=>rows.length?`<div class="cr-list">${rows.map(([n,v])=>`<div><span>${esc(n)}</span><b>${esc(v)}</b></div>`).join('')}</div>`:'<p class="cr-empty">لا توجد بيانات مسجلة</p>';
 const bdays=staff.map(e=>{let d=parseDate(field(e,'dob','date of birth','date_of_birth','تاريخ الميلاد'));if(!d)return null;let today=new Date(),next=new Date(today.getFullYear(),d.getMonth(),d.getDate());if(next<new Date(today.getFullYear(),today.getMonth(),today.getDate()))next.setFullYear(next.getFullYear()+1);return {e,days:Math.round((next-new Date(today.getFullYear(),today.getMonth(),today.getDate()))/86400000)}}).filter(Boolean).sort((a,b)=>a.days-b.days).slice(0,5);
 const serviceBins=[[0,5],[5,10],[10,15],[15,20],[20,25],[25,30],[30,999]].map(([a,b])=>[b===999?'30+':`${a}–${b}`,years.filter(n=>n>=a&&n<b).length]);
 host.innerHTML=`<div class="cr-board"><div class="cr-heading"><div><h1>${tr('لوحة التحكم','Dashboard')}</h1><p>${tr('مؤشرات الموارد البشرية من السجلات المحملة','HR metrics from loaded records')}</p></div><span class="cr-source">● Firebase · ${total} ${tr('موظف','employees')}</span></div><div class="cr-grid">
 ${kpi('إجمالي الموظفين','Total Employees',total,tr('موظف','Employees'),'♟')}${kpi('عدد الأقسام','Total Departments',dept.length,tr('قسم','Departments'),'▦')}${kpi('متوسط سنوات الخدمة','Average Service Years',avg(years,1),tr('سنة','Years'),'◷')}${kpi('متوسط العمر','Average Age',avg(ages),tr('سنة','Years'),'♙')}
 ${card('cr-attend','معدل الحضور العام','Attendance Rate','<div class="cr-attendnote">'+tr('بانتظار استكمال ربط الحضور الفعلي','Awaiting verified attendance integration')+'</div>')}
 ${card('cr-gender-card','توزيع الموظفين حسب النوع','Employees by Gender',gender)}
 ${card('cr-org-card','توزيع الموظفين حسب الأقسام','Employees by Departments',org)}
 ${card('cr-world-card','التوزيع الجغرافي (العالم)','Geographic Distribution',`<div class="cr-map-holder" id="cr-world-holder"><img class="cr-world-asset" src="world-map.svg" alt="خريطة العالم الجغرافية" loading="eager"></div><p class="cr-mapnote">${tr('اضغط على مصر للتكبير','Select Egypt to zoom')}</p>`)}
 ${card('cr-egypt-card','التوزيع الجغرافي في مصر','Employees in Egypt',`<div class="cr-egypt-copy" id="cr-egypt-copy"><svg class="cr-egypt-map" viewBox="0 0 390 390" role="img" aria-label="مخطط جغرافي لمصر"><defs><linearGradient id="crEgyptGrad" x2="1" y2="1"><stop stop-color="#1683ff"/><stop offset="1" stop-color="#07356c"/></linearGradient></defs><path d="M336.8,365.0 L241.6,365.0 L148.5,365.0 L52.0,365.0 L52.0,239.8 L52.0,118.9 L44.8,91.5 L51.0,70.5 L47.3,56.0 L56.0,39.6 L87.9,39.1 L111.0,48.1 L134.8,58.1 L145.9,63.4 L164.4,52.6 L174.3,42.9 L195.4,40.1 L212.5,44.4 L219.0,61.3 L224.6,50.1 L243.9,58.2 L262.6,60.1 L274.4,51.5 L274.4,51.5 L287.8,101.1 L290.1,110.0 L283.4,123.6 L278.2,149.3 L271.7,167.0 L266.1,172.9 L258.1,162.0 L247.3,146.8 L230.2,98.1 L227.7,101.1 L237.6,137.0 L252.4,171.2 L270.5,224.2 L279.4,242.6 L287.1,261.9 L308.6,299.5 L303.8,305.4 L304.6,327.5 L332.6,358.0 L336.8,365.0Z" fill="url(#crEgyptGrad)" stroke="#4bd7ff" stroke-width="2"/><circle cx="177" cy="62" r="10" fill="#b6ffff" opacity=".95"/><circle cx="177" cy="62" r="19" fill="none" stroke="#4dfaff" opacity=".5"/></svg></div><div class="cr-geo-count">${tr('الموظفون المسجل لهم محافظة','Employees with recognized governorate')}: ${geoCount}</div>`)}
 ${card('cr-deptbars','عدد الموظفين حسب الأقسام','Employees by Department',bars(dept))}
 ${card('cr-trend-card','تطور التعيينات','Hiring Trend',trend)}
 ${card('cr-qual','المؤهلات العلمية','Qualifications',ring(qual))}
 ${card('cr-ins','حالة التأمين','Insurance Status',ring(ins))}
 ${card('cr-marital','الحالة الاجتماعية','Marital Status',ring(marital))}
 ${card('cr-service','سنوات الخدمة','Years of Service',bars(serviceBins,7))}
 ${card('cr-latest','أحدث الموظفين','Latest Employees',list(recent.map(e=>[getEmployeeName(e),getHireDate(e)])))}
 ${card('cr-religion','تحليل الديانة (مجمّع)','Religion Aggregate',religion.length?ring(religion):'<p class="cr-empty">'+tr('لا يوجد حقل ديانة مسجل؛ لن يتم تقدير البيانات من الأسماء.','No religion field found; values will not be inferred.')+'</p>')}
 ${card('cr-birthday','أعياد الميلاد القادمة','Upcoming Birthdays',list(bdays.map(x=>[getEmployeeName(x.e),x.days===0?tr('اليوم','Today'):`${x.days} ${tr('يوم','days')}`])))}
 ${card('cr-notify','الطلبات والإشعارات','Requests & Notifications',`<p class="cr-empty">${tr('افتح مركز الطلبات للاطلاع على الحالات الفعلية','Open the requests center to review live statuses')}</p><button class="cr-open" type="button" onclick="showHRPage('notifications')">${tr('فتح مركز الإشعارات ←','Open notifications →')}</button>`)}
 </div></div>`;

}
