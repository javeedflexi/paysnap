import React, { useState, useRef } from 'react';

const IncomeDetails = ({ earnings, setEarnings, deductions, setDeductions }) => {
  const [newItemType, setNewItemType] = useState('earning');
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  
  // References to track cursor positions
  const earningInputRefs = useRef({});
  const deductionInputRefs = useRef({});
  const newItemAmountRef = useRef(null);
  
  const addNewItem = () => {
    // Validate input
    if (!newItemName.trim()) {
      alert('Please enter a valid name');
      return;
    }
    
    if (!newItemAmount.trim() || isNaN(parseFloat(newItemAmount))) {
      alert('Please enter a valid amount');
      return;
    }
    
    const newItem = {
      name: newItemName.trim(),
      amount: newItemAmount.trim() // Store as entered, will format on display
    };
    
    if (newItemType === 'earning') {
      setEarnings([...earnings, newItem]);
    } else {
      setDeductions([...deductions, newItem]);
    }
    
    // Reset form
    setNewItemName('');
    setNewItemAmount('');
  };
  
  const removeItem = (type, index) => {
    if (type === 'earning') {
      setEarnings(earnings.filter((_, i) => i !== index));
    } else {
      setDeductions(deductions.filter((_, i) => i !== index));
    }
  };
  
  // Improved updateItem function to maintain cursor position
  const updateItem = (type, index, field, value) => {
    // For amount fields, we'll store the raw input value without immediate formatting
    // This prevents cursor jumping while typing
    if (type === 'earning') {
      const updatedEarnings = [...earnings];
      
      // If this is an amount field, save the cursor position before update
      let cursorPosition = null;
      if (field === 'amount' && earningInputRefs.current[index]) {
        cursorPosition = earningInputRefs.current[index].selectionStart;
      }
      
      // Update the value without immediate formatting
      updatedEarnings[index] = {
        ...updatedEarnings[index],
        [field]: value
      };
      
      setEarnings(updatedEarnings);
      
      // Restore cursor position after update
      if (cursorPosition !== null && earningInputRefs.current[index]) {
        setTimeout(() => {
          earningInputRefs.current[index].selectionStart = cursorPosition;
          earningInputRefs.current[index].selectionEnd = cursorPosition;
        }, 0);
      }
    } else {
      const updatedDeductions = [...deductions];
      
      // If this is an amount field, save the cursor position before update
      let cursorPosition = null;
      if (field === 'amount' && deductionInputRefs.current[index]) {
        cursorPosition = deductionInputRefs.current[index].selectionStart;
      }
      
      // Update the value without immediate formatting
      updatedDeductions[index] = {
        ...updatedDeductions[index],
        [field]: value
      };
      
      setDeductions(updatedDeductions);
      
      // Restore cursor position after update
      if (cursorPosition !== null && deductionInputRefs.current[index]) {
        setTimeout(() => {
          deductionInputRefs.current[index].selectionStart = cursorPosition;
          deductionInputRefs.current[index].selectionEnd = cursorPosition;
        }, 0);
      }
    }
  };
  
  // Format amount for display, but maintain original value for editing
  const formatAmount = (amount) => {
    if (!amount || isNaN(parseFloat(amount))) return '';
    return parseFloat(amount).toFixed(2);
  };
  
  // Format amount input on blur
  const handleNewItemAmountBlur = () => {
    if (newItemAmount && !isNaN(parseFloat(newItemAmount))) {
      const formattedValue = formatAmount(newItemAmount);
      setNewItemAmount(formattedValue);
    }
  };
  
  // Handle amount input change with cursor position preservation
  const handleNewItemAmountChange = (e) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    setNewItemAmount(value);
    
    // Restore cursor position after update
    if (newItemAmountRef.current) {
      setTimeout(() => {
        newItemAmountRef.current.selectionStart = cursorPosition;
        newItemAmountRef.current.selectionEnd = cursorPosition;
      }, 0);
    }
  };
  
  const grossEarnings = earnings.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const totalDeductions = deductions.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const netPayable = grossEarnings - totalDeductions;
  
  return (
    <div className="card">
      <div className="flex items-center mb-5">
        <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
          <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <h2 className="text-xl font-semibold text-gray-800">Pay & Deduction Details</h2>
      </div>
      
      {/* Add new item form with better layout */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-gray-700 font-medium mb-3">Add New Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value)}
              className="input-field"
            >
              <option value="earning">Earning</option>
              <option value="deduction">Deduction</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name"
              className="input-field"
            />
          </div>
          <div className="md:col-span-1 flex">
            <input
              type="text"
              value={newItemAmount}
              onChange={handleNewItemAmountChange}
              onBlur={handleNewItemAmountBlur}
              placeholder="Amount"
              className="input-field flex-1"
              ref={newItemAmountRef}
            />
            <button
              onClick={addNewItem}
              className="ml-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              title="Add Item"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Earnings Section */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <h3 className="text-md font-semibold text-gray-700">Earnings</h3>
          <div className="flex-grow mx-3 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-500 whitespace-nowrap">Total: ₹{grossEarnings.toFixed(2)}</span>
        </div>
        
        <div className="space-y-3">
          {earnings.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No earnings added yet. Add your first earning above.</p>
          ) : (
            earnings.map((item, index) => (
              <div key={`earning-${index}`} className="flex items-center p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem('earning', index, 'name', e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-800 font-medium"
                    placeholder="Item name"
                  />
                </div>
                <div className="w-32 flex-shrink-0 mx-2">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">₹</span>
                    <input
                      type="text"
                      value={item.amount}
                      onChange={(e) => updateItem('earning', index, 'amount', e.target.value)}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-right"
                      placeholder="Amount"
                      ref={el => earningInputRefs.current[index] = el}
                      onBlur={(e) => {
                        // Format on blur for nice display, but keep raw value
                        if (e.target.value && !isNaN(parseFloat(e.target.value))) {
                          const formattedValue = formatAmount(e.target.value);
                          updateItem('earning', index, 'amount', formattedValue);
                        }
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeItem('earning', index)}
                  className="ml-2 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Deductions Section */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <h3 className="text-md font-semibold text-gray-700">Deductions</h3>
          <div className="flex-grow mx-3 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-500 whitespace-nowrap">Total: ₹{totalDeductions.toFixed(2)}</span>
        </div>
        
        <div className="space-y-3">
          {deductions.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No deductions added yet. Add your first deduction above.</p>
          ) : (
            deductions.map((item, index) => (
              <div key={`deduction-${index}`} className="flex items-center p-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem('deduction', index, 'name', e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-800 font-medium"
                    placeholder="Item name"
                  />
                </div>
                <div className="w-32 flex-shrink-0 mx-2">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">₹</span>
                    <input
                      type="text"
                      value={item.amount}
                      onChange={(e) => updateItem('deduction', index, 'amount', e.target.value)}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-right"
                      placeholder="Amount"
                      ref={el => deductionInputRefs.current[index] = el}
                      onBlur={(e) => {
                        // Format on blur for nice display, but keep raw value
                        if (e.target.value && !isNaN(parseFloat(e.target.value))) {
                          const formattedValue = formatAmount(e.target.value);
                          updateItem('deduction', index, 'amount', formattedValue);
                        }
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeItem('deduction', index)}
                  className="ml-2 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Net Pay Summary Card */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Gross Earnings</p>
            <p className="text-lg font-semibold text-gray-900">₹{grossEarnings.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-1">Total Deductions</p>
            <p className="text-lg font-semibold text-gray-900">₹{totalDeductions.toFixed(2)}</p>
          </div>
          <div className="text-center bg-blue-500 rounded-md py-2 px-3 text-white">
            <p className="text-sm mb-1 text-blue-100">Net Payable</p>
            <p className="text-lg font-bold">₹{netPayable.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeDetails;
 