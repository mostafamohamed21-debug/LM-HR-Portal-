/* Lacto Misr phase 3: read-only shift calculation. No Firebase or payroll writes. */
(function(root){'use strict';
 const r=n=>Math.round((n+Number.EPSILON)*100)/100;
 const finite=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
 function calculate(input){
  const shift=String(input?.shift||'').toUpperCase(), records=input?.records;
  if(!['A','B','C','D'].includes(shift)||!Array.isArray(records))throw Error('Invalid shift or records');
  const seen=new Set(), rows=[], flags=[];
  for(const item of records){
   const id=String(item?.id||'');
   if(!id||seen.has(id)){flags.push({id,reason:'MISSING_OR_DUPLICATE_ID'});continue;}seen.add(id);
   const date=String(item.date||'');
   if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){flags.push({id,reason:'INVALID_DATE'});continue;}
   const status=String(item.status||'');
   if(!['APPROVED','REST','LEAVE','SICK','CANCEL_SHIFT','PENDING_REVIEW'].includes(status)){flags.push({id,reason:'INVALID_STATUS'});continue;}
   if(status==='PENDING_REVIEW'||item.payrollHold===true){flags.push({id,reason:'UNRESOLVED_ATTENDANCE'});continue;}
   if(status==='APPROVED'&&!finite(item.hours)){flags.push({id,reason:'MISSING_VERIFIED_HOURS'});continue;}
   if(item.extraHours!==undefined&&!finite(item.extraHours)){flags.push({id,reason:'INVALID_EXTRA_HOURS'});continue;}
   rows.push({...item,id,date,status});
  }
  rows.sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
  const worked=r(rows.filter(x=>x.status==='APPROVED').reduce((s,x)=>s+x.hours,0));
  const cancelled=rows.filter(x=>x.status==='CANCEL_SHIFT').length;
  const recalled=rows.filter(x=>x.status==='APPROVED'&&x.restRecall===true).reduce((s,x)=>s+x.hours,0);
  let earned=0,target=null,creditedDays=null;
  if(shift==='A'){
   for(const x of rows.filter(x=>x.status==='APPROVED')){
    if(x.extraHours===undefined){flags.push({id:x.id,reason:'MISSING_APPROVED_SHIFT_A_OT'});continue;}
    earned+=x.extraHours;
   }
  }else if(shift==='B'||shift==='C'){
   target=shift==='B'?154:132;
   // Recalled rest hours are overtime in their own right, not counted twice against target.
   earned=Math.max(0,worked-recalled-target)+recalled;
  }else{
   creditedDays=new Set(rows.filter(x=>['APPROVED','REST','LEAVE','SICK','CANCEL_SHIFT'].includes(x.status)).map(x=>x.date)).size;
   // Shift D's overtime cannot be inferred from 19-day credit alone.
  }
  const events=[];
  if(shift!=='D'){
   // Monthly target overtime is only known at month end: book on final day after cancellations.
   rows.filter(x=>x.status==='CANCEL_SHIFT').forEach(x=>events.push({id:x.id,date:x.date,type:'CANCEL',hours:7}));
   if(earned>0)events.push({id:'MONTHLY_EARN',date:'9999-12-31',type:'EARN',hours:r(earned)});
  }
  let debt=r(Math.max(0,Number(input.openingDebitHours)||0)),payable=0;
  for(const e of events.sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id))){
   if(e.type==='CANCEL'){const offset=Math.min(payable,7);payable=r(payable-offset);debt=r(debt+7-offset);}
   else{const offset=Math.min(debt,e.hours);debt=r(debt-offset);payable=r(payable+e.hours-offset);}
  }
  const ready=flags.length===0&&rows.length>0&&shift!=='D';
  return {shift,workedHours:worked,targetHours:target,creditedDays,requiredDays:shift==='D'?19:null,
   overtimeEarnedHours:shift==='D'?null:r(earned),payableOvertimeHours:shift==='D'?null:payable,
   carriedDebitHours:shift==='D'?null:debt,cancelledShifts:cancelled,restRecallHours:r(recalled),
   readyForPayroll:ready,reviewRequired:!ready,flags,sourceRecords:rows.length,
   note:shift==='D'?'D requires approved day-credit and separate overtime policy':ready?'Calculation preview; payroll approval is separate':'Blocked pending evidence or shift policy'};
 }
 root.LactoShiftEngine=Object.freeze({calculate});
 if(typeof module!=='undefined'&&module.exports)module.exports={calculate};
})(typeof window!=='undefined'?window:globalThis);
