import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { downloadExcelTemplate } from '../utils/ExcelTemplateGenerator';

const ExcelUploader = ({ 
  setCompanyInfo, 
  setEmployeeInfo, 
  setEarnings, 
  setDeductions 
}) => {
  const [fileName, setFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Check if file is an Excel file
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      setUploadStatus('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    setUploadStatus('');

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        // Parse Excel file
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Process the data from different sheets
        processExcelData(workbook);
        
        setUploadStatus('Data successfully loaded!');
      } catch (error) {
        console.error('Error processing Excel file:', error);
        setUploadStatus('Error processing file. Please check the format.');
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setUploadStatus('Error reading file');
      setIsLoading(false);
    };
    
    reader.readAsArrayBuffer(file);
  };

  const processExcelData = (workbook) => {
    // Get all sheet names
    const sheetNames = workbook.SheetNames;
    
    // Process company info from "Company" sheet if it exists
    if (sheetNames.includes('Company')) {
      const companySheet = workbook.Sheets['Company'];
      const companyData = XLSX.utils.sheet_to_json(companySheet, { header: 1 });
      
      // Extract company data - assumes specific format
      const companyInfo = {};
      
      companyData.forEach(row => {
        if (row.length >= 2) {
          const key = row[0]?.trim().toLowerCase();
          const value = row[1]?.toString() || '';
          
          if (key === 'company name') companyInfo.companyName = value;
          else if (key === 'address') companyInfo.companyAddress = value;
          else if (key === 'city') companyInfo.city = value;
          else if (key === 'pincode') companyInfo.pincode = value;
          else if (key === 'country') companyInfo.country = value || 'India';
        }
      });
      
      if (Object.keys(companyInfo).length > 0) {
        setCompanyInfo(prevState => ({
          ...prevState,
          ...companyInfo
        }));
      }
    }
    
    // Process employee info from "Employee" sheet if it exists
    if (sheetNames.includes('Employee')) {
      const employeeSheet = workbook.Sheets['Employee'];
      const employeeData = XLSX.utils.sheet_to_json(employeeSheet, { header: 1 });
      
      // Extract employee data
      const employeeInfo = {};
      
      employeeData.forEach(row => {
        if (row.length >= 2) {
          const key = row[0]?.trim().toLowerCase();
          const value = row[1]?.toString() || '';
          
          if (key === 'employee name') employeeInfo.employeeName = value;
          else if (key === 'employee id') employeeInfo.employeeId = value;
          else if (key === 'pay period') employeeInfo.payPeriod = value;
          else if (key === 'paid days') employeeInfo.paidDays = value;
          else if (key === 'loss of pay days') employeeInfo.lossOfPayDays = value;
          else if (key === 'pay date') employeeInfo.payDate = value;
        }
      });
      
      if (Object.keys(employeeInfo).length > 0) {
        setEmployeeInfo(prevState => ({
          ...prevState,
          ...employeeInfo
        }));
      }
    }
    
    // Process earnings from "Earnings" sheet if it exists
    if (sheetNames.includes('Earnings')) {
      const earningsSheet = workbook.Sheets['Earnings'];
      const earningsData = XLSX.utils.sheet_to_json(earningsSheet);
      
      if (earningsData.length > 0) {
        // Convert to the expected format
        const formattedEarnings = earningsData.map(item => ({
          name: item.Name || item.name || '',
          amount: (item.Amount || item.amount || '').toString()
        })).filter(item => item.name);
        
        if (formattedEarnings.length > 0) {
          setEarnings(formattedEarnings);
        }
      }
    }
    
    // Process deductions from "Deductions" sheet if it exists
    if (sheetNames.includes('Deductions')) {
      const deductionsSheet = workbook.Sheets['Deductions'];
      const deductionsData = XLSX.utils.sheet_to_json(deductionsSheet);
      
      if (deductionsData.length > 0) {
        // Convert to the expected format
        const formattedDeductions = deductionsData.map(item => ({
          name: item.Name || item.name || '',
          amount: (item.Amount || item.amount || '').toString()
        })).filter(item => item.name);
        
        if (formattedDeductions.length > 0) {
          setDeductions(formattedDeductions);
        }
      }
    }
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center mb-4">
        <span className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
          <svg className="h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </span>
        <h2 className="text-xl font-semibold text-gray-800">Import from Excel</h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-4">
          Upload an Excel file (.xlsx) to automatically fill the payslip form. The Excel file should have separate sheets:
        </p>
        
        <ul className="text-sm text-gray-600 list-disc pl-5 mb-4 space-y-2">
          <li><span className="font-medium">Company</span>: Company details with columns for Company Name, Address, City, etc.</li>
          <li><span className="font-medium">Employee</span>: Employee information with columns for Employee Name, ID, Pay Period, etc.</li>
          <li><span className="font-medium">Earnings</span>: Earnings with columns for Name and Amount</li>
          <li><span className="font-medium">Deductions</span>: Deductions with columns for Name and Amount</li>
        </ul>
        
        <div className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center transition-colors cursor-pointer ${fileName ? 'border-green-200 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
          {fileName ? (
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <svg className="h-8 w-8 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-green-600">File uploaded</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{fileName}</p>
              <p className="text-sm text-green-600 mb-4">{uploadStatus}</p>
              <label className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors cursor-pointer">
                <span>Choose Another File</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <>
              <svg className="w-12 h-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-500 mb-3 text-center">Drag and drop your Excel file here, or click to browse</p>
              <label className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors cursor-pointer flex items-center">
                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a3 3 0 01-3-3V6a3 3 0 013-3h10a3 3 0 013 3v1m-3 12a3 3 0 01-3 3H7a3 3 0 01-3-3V9a3 3 0 013-3h4" />
                </svg>
                <span>Browse Excel Files</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>
        
        {uploadStatus && !fileName && (
          <p className="mt-3 text-sm text-red-500">{uploadStatus}</p>
        )}
        
        {isLoading && (
          <div className="mt-3 flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-gray-600">Processing file...</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center p-3 bg-blue-50 rounded-lg text-sm">
        <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-blue-700">
          <button 
            className="text-blue-600 underline hover:text-blue-800" 
            onClick={(e) => {
              e.preventDefault();
              downloadExcelTemplate();
            }}
          >
            Download a template Excel file
          </button> to see the expected format.
        </p>
      </div>
    </div>
  );
};

export default ExcelUploader; 