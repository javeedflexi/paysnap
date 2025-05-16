import React from 'react';

const CompanyInfoForm = ({ companyInfo, setCompanyInfo }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="card">
      <div className="flex items-center mb-5">
        <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
          <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </span>
        <h2 className="text-xl font-semibold text-gray-800">Company Information</h2>
      </div>

      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={companyInfo.companyName}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="companyAddress"
            name="companyAddress"
            value={companyInfo.companyAddress}
            onChange={handleChange}
            rows="2"
            className="input-field"
            placeholder="Enter company address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={companyInfo.city}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter city"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              Pincode / ZIP
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={companyInfo.pincode}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter pincode"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={companyInfo.country}
            onChange={handleChange}
            className="input-field"
          >
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoForm;
 