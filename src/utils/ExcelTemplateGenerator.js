import * as XLSX from 'xlsx';

/**
 * Generates an Excel template file for payslip data upload
 * @returns {Blob} Blob containing the Excel file
 */
export const generateExcelTemplate = () => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Create Company sheet
  const companyData = [
    ['Company Name', ''],
    ['Address', ''],
    ['City', ''],
    ['Pincode', ''],
    ['Country', 'India'],
  ];
  const companyWs = XLSX.utils.aoa_to_sheet(companyData);
  XLSX.utils.book_append_sheet(workbook, companyWs, 'Company');
  
  // Create Employee sheet
  const employeeData = [
    ['Employee Name', ''],
    ['Employee ID', ''],
    ['Pay Period', ''],
    ['Paid Days', ''],
    ['Loss of Pay Days', ''],
    ['Pay Date', ''],
  ];
  const employeeWs = XLSX.utils.aoa_to_sheet(employeeData);
  XLSX.utils.book_append_sheet(workbook, employeeWs, 'Employee');
  
  // Create Earnings sheet
  const earningsData = [
    ['Name', 'Amount'],
    ['Basic Salary', ''],
    ['House Rent Allowance', ''],
    ['Transport Allowance', ''],
    ['Medical Allowance', ''],
    ['Special Allowance', ''],
  ];
  const earningsWs = XLSX.utils.aoa_to_sheet(earningsData);
  XLSX.utils.book_append_sheet(workbook, earningsWs, 'Earnings');
  
  // Create Deductions sheet
  const deductionsData = [
    ['Name', 'Amount'],
    ['Tax', ''],
    ['Insurance', ''],
    ['Provident Fund', ''],
    ['Professional Tax', ''],
  ];
  const deductionsWs = XLSX.utils.aoa_to_sheet(deductionsData);
  XLSX.utils.book_append_sheet(workbook, deductionsWs, 'Deductions');
  
  // Convert workbook to binary string
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Create Blob from buffer
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

/**
 * Triggers download of the template Excel file
 */
export const downloadExcelTemplate = () => {
  const blob = generateExcelTemplate();
  const url = URL.createObjectURL(blob);
  
  // Create download link and trigger click
  const a = document.createElement('a');
  a.href = url;
  a.download = 'payslip_template.xlsx';
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}; 