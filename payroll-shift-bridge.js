/* Phase 4: auditable, read-only shift-to-payroll preview; no database writes. */
(function(root){'use strict';
 const round=n=>Math.round((n+Number.EPSILON)*100)/100;
 function calculate({shiftInput,monthlyPayrollInput,approvedOvertimeRate,approvedNightHours=0,approvedRestHours=0,approvedDayHours,rateDayMultiplier=1.35,rateNightMultiplier=1.70,rateRestMultiplier=2}){
  const reasons=[];
  if(!root.LactoShiftEngine?.calculate)throw Error('Shift engine unavailable');
  const shift=root.LactoShiftEngine.calculate(shiftInput);
  if(!shift.readyForPayroll)reasons.push('SHIFT_REVIEW_REQUIRED',...shift.flags.map(x=>x.reason));
  if(!monthlyPayrollInput||typeof monthlyPayrollInput!=='object')reasons.push('MISSING_PAYROLL_INPUT');
  const total=shift.payableOvertimeHours;
  const values=[approvedOvertimeRate,approvedNightHours,approvedRestHours,rateDayMultiplier,rateNightMultiplier,rateRestMultiplier];
  if(values.some(x=>typeof x!=='number'||!Number.isFinite(x)||x<0))reasons.push('INVALID_APPROVED_RATES');
  const day=approvedDayHours===undefined&&typeof total==='number'?total-approvedNightHours-approvedRestHours:approvedDayHours;
  if(typeof day!=='number'||!Number.isFinite(day)||day<0)reasons.push('INVALID_DAY_HOURS');
  if(typeof total!=='number'||!Number.isFinite(total)||Math.abs(day+approvedNightHours+approvedRestHours-total)>0.011)reasons.push('OVERTIME_HOURS_MISMATCH');
  if(monthlyPayrollInput && (typeof monthlyPayrollInput.gross!=='number'||!Number.isFinite(monthlyPayrollInput.gross)||monthlyPayrollInput.gross<0))reasons.push('MISSING_VALID_GROSS');
  if(monthlyPayrollInput?.insured===true && !(typeof monthlyPayrollInput.insurance==='number'&&Number.isFinite(monthlyPayrollInput.insurance)&&monthlyPayrollInput.insurance>0))reasons.push('MISSING_INSURANCE_WAGE');
  if(monthlyPayrollInput?.secondary===undefined)reasons.push('SECONDARY_TAX_STATUS_UNCONFIRMED');
  if(monthlyPayrollInput?.included!==1)reasons.push('GROSS_ALLOWANCE_DOUBLE_COUNT_RISK');
  if(reasons.length)return {ready:false,reasons:[...new Set(reasons)],shift,payroll:null,approved:false};
  const overtime=round(approvedOvertimeRate*(day*rateDayMultiplier+approvedNightHours*rateNightMultiplier+approvedRestHours*rateRestMultiplier));
  return {ready:true,reasons:[],shift,approved:false,payrollInput:{...monthlyPayrollInput,overtime},overtimeBreakdown:{dayHours:day,nightHours:approvedNightHours,restHours:approvedRestHours,rate:approvedOvertimeRate,overtime},note:'PREVIEW_ONLY_NOT_APPROVED; requires payroll calculation, evidence and authorized monthly approval'};
 }
 root.LactoPayrollShiftBridge=Object.freeze({calculate});
 if(typeof module!=='undefined'&&module.exports)module.exports={calculate};
})(typeof window!=='undefined'?window:globalThis);
