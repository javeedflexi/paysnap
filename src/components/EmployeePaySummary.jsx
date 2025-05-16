import React from 'react';

const EmployeePaySummary = ({ employeeInfo, setEmployeeInfo }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="card">
      <div className="flex items-center mb-5">
        <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        <h2 className="text-xl font-semibold text-gray-800">Employee Details</h2>
      </div>

      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">
            Employee Name *
          </label>
          <input
            type="text"
            id="employeeName"
            name="employeeName"
            value={employeeInfo.employeeName}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter employee name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
            Employee ID
          </label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            value={employeeInfo.employeeId}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter employee ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="payPeriod" className="block text-sm font-medium text-gray-700 mb-1">
            Pay Period *
          </label>
          <input
            type="text"
            id="payPeriod"
            name="payPeriod"
            value={employeeInfo.payPeriod}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., April 2023"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="paidDays" className="block text-sm font-medium text-gray-700 mb-1">
              Paid Days
            </label>
            <input
              type="number"
              id="paidDays"
              name="paidDays"
              value={employeeInfo.paidDays}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 30"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lossOfPayDays" className="block text-sm font-medium text-gray-700 mb-1">
              Loss of Pay Days
            </label>
            <input
              type="number"
              id="lossOfPayDays"
              name="lossOfPayDays"
              value={employeeInfo.lossOfPayDays}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 0"
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="payDate" className="block text-sm font-medium text-gray-700 mb-1">
            Pay Date *
          </label>
          <input
            type="date"
            id="payDate"
            name="payDate"
            value={employeeInfo.payDate}
            onChange={handleChange}
            className="input-field"
            max={formatDate()}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeePaySummary;
 