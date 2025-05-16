import React, { useState } from 'react';
import CompanyInfoForm from './CompanyInfoForm';
import EmployeePaySummary from './EmployeePaySummary';
import IncomeDetails from './IncomeDetails';
import PaySlipResult from './PaySlipResult';
import ExcelUploader from './ExcelUploader';

const PayslipGenerator = () => {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    companyAddress: '',
    city: '',
    pincode: '',
    country: 'India'
  });

  const [employeeInfo, setEmployeeInfo] = useState({
    employeeName: '',
    employeeId: '',
    payPeriod: '',
    paidDays: '',
    lossOfPayDays: '',
    payDate: ''
  });

  const [earnings, setEarnings] = useState([
    { name: 'Basic Salary', amount: '' },
    { name: 'House Rent Allowance', amount: '' }
  ]);

  const [deductions, setDeductions] = useState([
    { name: 'Tax', amount: '' },
    { name: 'Insurance', amount: '' }
  ]);

  const [logoUrl, setLogoUrl] = useState('');

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setCompanyInfo({
      companyName: '',
      companyAddress: '',
      city: '',
      pincode: '',
      country: 'India'
    });
    setEmployeeInfo({
      employeeName: '',
      employeeId: '',
      payPeriod: '',
      paidDays: '',
      lossOfPayDays: '',
      payDate: ''
    });
    setEarnings([
      { name: 'Basic Salary', amount: '' },
      { name: 'House Rent Allowance', amount: '' }
    ]);
    setDeductions([
      { name: 'Tax', amount: '' },
      { name: 'Insurance', amount: '' }
    ]);
    setLogoUrl('');
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 font-sans">
      {/* Header with animation and enhanced design */}
      <div className="mb-8 sm:mb-10 text-center animate-fadeIn">
        <div className="inline-block p-2 px-4 rounded-full bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
          Fast • Professional • Easy to Use
        </div>
        <div className="w-full flex justify-center">
          <h1 className="text-8xl sm:text-8xl md:text-9xl font-extrabold text-gray-800 mb-3 sm:mb-5 relative inline-block">
            Flexi-Payslip Generator
            <span className="absolute bottom-0 left-0 w-full h-1 sm:h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600"></span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left column for company logo */}
        <div className="lg:col-span-4 space-y-6">
          {/* Logo Upload Card */}
          <div className="card">
            <div className="flex items-center mb-4">
              <span className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Company Logo</h2>
            </div>

            <div className={`border-2 border-dashed rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${logoUrl ? 'border-green-200 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
              {logoUrl ? (
                <div className="text-center">
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    className="max-h-32 sm:max-h-40 mx-auto mb-4 object-contain rounded-md"
                  />
                  <button
                    onClick={() => setLogoUrl('')}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:opacity-50 flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
                  >
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Remove</span>
                  </button>
                </div>
              ) : (
                <>
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 text-center">Upload your company logo for the payslip</p>
                  <label className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base">
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a3 3 0 01-3-3V6a3 3 0 013-3h10a3 3 0 013 3v1m-3 12a3 3 0 01-3 3H7a3 3 0 01-3-3V9a3 3 0 013-3h4" />
                    </svg>
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Excel Import Section */}
          <ExcelUploader
            setCompanyInfo={setCompanyInfo}
            setEmployeeInfo={setEmployeeInfo}
            setEarnings={setEarnings}
            setDeductions={setDeductions}
          />

          {/* Quick Tips Card - Hide on smaller screens */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <span className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Quick Tips</h3>
            </div>

            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-600">
              <li className="flex items-start">
                <span className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Fill in all company information accurately for professional payslips</span>
              </li>
              <li className="flex items-start">
                <span className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Use a unique employee ID for each staff member</span>
              </li>
              <li className="flex items-start">
                <span className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Add detailed earnings and deductions to improve clarity</span>
              </li>
              <li className="flex items-start">
                <span className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Import data from Excel to quickly populate multiple payslips</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right column for forms - Improved spacing and section headers */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Company Information Section */}
          <CompanyInfoForm
            companyInfo={companyInfo}
            setCompanyInfo={setCompanyInfo}
          />

          {/* Employee Information Section */}
          <EmployeePaySummary
            employeeInfo={employeeInfo}
            setEmployeeInfo={setEmployeeInfo}
          />

          {/* Income Details Section */}
          <IncomeDetails
            earnings={earnings}
            setEarnings={setEarnings}
            deductions={deductions}
            setDeductions={setDeductions}
          />

          {/* Payslip Results Section */}
          <PaySlipResult
            earnings={earnings}
            deductions={deductions}
            companyInfo={companyInfo}
            employeeInfo={employeeInfo}
            handleReset={handleReset}
            companyLogo={logoUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default PayslipGenerator;
 