import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { jsPDF as jsPDFType } from "jspdf";
// Import jspdf-autotable
import autoTable from 'jspdf-autotable';

// Load custom font that supports rupee symbol
const addFontToJSPDF = () => {
  // This is a method to add custom fonts if needed
  // For now we'll use standard fonts with text replacement
};

const PaySlipResult = ({ earnings, deductions, companyInfo, employeeInfo, handleReset, companyLogo }) => {
  // Theme options for PDF
  const themes = {
    classic: {
      name: 'Classic Blue',
      primary: [42, 93, 134], // Blue
      secondary: [120, 162, 196], // Light blue
      accent: [230, 230, 230] // Light gray
    },
    modern: {
      name: 'Modern Green',
      primary: [45, 122, 76], // Green
      secondary: [106, 168, 126], // Light green
      accent: [235, 245, 235] // Very light green
    },
    elegant: {
      name: 'Elegant Purple',
      primary: [93, 63, 127], // Purple
      secondary: [143, 113, 177], // Light purple
      accent: [240, 235, 249] // Very light purple
    },
    corporate: {
      name: 'Corporate Gray',
      primary: [72, 72, 72], // Dark gray
      secondary: [128, 128, 128], // Medium gray
      accent: [230, 230, 230] // Light gray
    }
  };
  
  const [selectedTheme, setSelectedTheme] = useState('classic');

  // Create a reusable function for formatting currency consistently throughout the app
  const formatCurrencyDisplay = (amount) => {
    return `Rs. ${parseFloat(amount || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}`;
  };

  const grossEarnings = earnings.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const totalDeductions = deductions.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const netPayable = grossEarnings - totalDeductions;

  // Function to convert number to words (simple implementation)
  const numberToWords = (amount) => {
    if (amount === 0) return "Zero Rupees";
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const numToWord = (num) => {
      if (num < 20) return ones[num];
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return tens[ten] + (one ? '-' + ones[one] : '');
    };
    
    const decimal = Math.round((amount - Math.floor(amount)) * 100);
    let result = '';
    
    const thousands = Math.floor(amount / 1000);
    if (thousands > 0) {
      result += numToWord(thousands) + ' Thousand ';
      amount %= 1000;
    }
    
    const hundreds = Math.floor(amount / 100);
    if (hundreds > 0) {
      result += ones[hundreds] + ' Hundred ';
      amount %= 100;
    }
    
    if (amount > 0) {
      if (result !== '') result += 'and ';
      result += numToWord(amount);
    }
    
    return result + ' Rupees' + (decimal > 0 ? ' and ' + decimal + ' Paise' : '');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Helper function to generate a well-aligned PDF
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add font that supports Unicode characters like the rupee symbol
      // Use standard fonts with encoding that better supports special characters
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      
      // Format currency function to ensure consistent formatting with rupee symbol
      const formatCurrency = (amount) => {
        // Format with thousand separators
        const formattedAmount = parseFloat(amount || 0).toLocaleString('en-IN', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        });
        // Use "Rs." text instead of symbol to avoid rendering issues
        return `Rs. ${formattedAmount}`;
      };
      
      // Get current theme colors from the selected theme
      const theme = themes[selectedTheme];
      const primaryColor = theme.primary;
      const secondaryColor = theme.secondary;
      const accentColor = theme.accent;
      
      // Set common variables for layout consistency
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height; // A4 height
      const leftMargin = 14;
      const rightMargin = pageWidth - 14;
      const contentWidth = rightMargin - leftMargin;
      
      // Keep track of current vertical position
      let currentY = 0;
      
      // Compact layout with minimal spacing to fit on one page
      
      // Header line at the top
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, 8, rightMargin, 8);
      
      // Add header information with compact spacing
      currentY = 20; // Start position for header
      doc.setFontSize(18); // Reduced from 22
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("PAYSLIP", pageWidth/2, currentY, { align: "center" });
      
      // Add thin line under header
      currentY += 4; // Reduced spacing
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(leftMargin + 30, currentY, rightMargin - 30, currentY);
      
      // Company information with compact spacing
      currentY += 8; // Reduced spacing
      const companyStartY = currentY;
      doc.setFontSize(12); // Reduced from 14
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(companyInfo.companyName || "Company Name", leftMargin, companyStartY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9); // Reduced from 10
      
      // Company address with compact wrapping
      currentY = companyStartY + 5; // Reduced spacing
      if (companyInfo.companyAddress) {
        const addressLines = doc.splitTextToSize(companyInfo.companyAddress, 80);
        doc.text(addressLines, leftMargin, currentY);
        currentY += addressLines.length * 4; // Reduced line height
      }
      
      const cityPincodeCountry = [
        companyInfo.city, 
        companyInfo.pincode, 
        companyInfo.country
      ].filter(Boolean).join(", ");
      
      if (cityPincodeCountry) {
        doc.text(cityPincodeCountry, leftMargin, currentY);
        currentY += 4; // Reduced spacing
      }
      
      // Add logo if available
      if (companyLogo) {
        try {
          const logoSize = 25; // Reduced from 30
          doc.addImage(companyLogo, 'PNG', rightMargin - logoSize - 5, companyStartY - 10, logoSize, logoSize, undefined, 'FAST');
        } catch (err) {
          console.error('Error adding logo to PDF:', err);
        }
      }
      
      // Add a decorative section separator
      currentY += 5; // Reduced spacing
      const mainContentStartY = currentY;
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5); // Reduced from 0.7
      doc.line(leftMargin, mainContentStartY, rightMargin, mainContentStartY);
      
      // Update current position for Employee Information section with minimal spacing
      currentY = mainContentStartY + 6; // Reduced spacing
      
      // Employee Information section heading
      doc.setFontSize(11); // Reduced from 12
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("Employee Information", leftMargin, currentY);
      
      // Space between heading and employee table - INCREASED to prevent overlap
      currentY += 10; // Increased from 6 to ensure heading doesn't overlap with table
      
      // Add a thin separator line under the heading
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(leftMargin, currentY - 4, leftMargin + 60, currentY - 4);
      
      try {
        // Draw employee information table with compact styling
        const employeeTable = autoTable(doc, {
          startY: currentY,
          head: [['Detail', 'Value']],
          body: [
            ['Name', employeeInfo.employeeName || ''],
            ['Employee ID', employeeInfo.employeeId || ''],
            ['Pay Period', employeeInfo.payPeriod || ''],
            ['Pay Date', formatDate(employeeInfo.payDate) || ''],
            ['Paid Days', `${employeeInfo.paidDays || '0'} days (LoP: ${employeeInfo.lossOfPayDays || '0'} days)`]
          ],
          theme: 'plain',
          styles: {
            fontSize: 9, // Reduced from 10
            cellPadding: 3, // Reduced from 4
          },
          columnStyles: {
            0: {
              fontStyle: 'bold',
              cellWidth: 60,
              textColor: [80, 80, 80]
            },
            1: {
              cellWidth: 'auto'
            }
          },
          headStyles: {
            fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          didDrawCell: (data) => {
            // Add borders to cells
            if (data.section === 'body') {
              const x = data.cell.x;
              const y = data.cell.y;
              const w = data.cell.width;
              const h = data.cell.height;
              
              doc.setDrawColor(220, 220, 220); // Light gray
              doc.setLineWidth(0.1);
              // Draw cell border
              doc.line(x, y, x + w, y); // Top
              doc.line(x, y + h, x + w, y + h); // Bottom
              doc.line(x, y, x, y + h); // Left
              doc.line(x + w, y, x + w, y + h); // Right
            }
          },
          margin: { top: 0, right: 0, bottom: 0, left: 0 } // Remove default margins
        });
        
        // Update current position after employee table
        if (employeeTable && employeeTable.lastAutoTable) {
          currentY = employeeTable.lastAutoTable.finalY;
        } else {
          currentY += 40; // Reduced estimated height
        }
      } catch (e) {
        console.error("Error rendering employee table:", e);
        currentY += 40; // Fallback position if table fails
      }
      
      // Earnings section with minimal spacing
      currentY += 12; // Increased from 8 to give more space between tables
      
      // Earnings section heading with clear separation
      doc.setFontSize(11); // Reduced from 12
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("", leftMargin, currentY);
      
      // Clear space between earnings heading and table - INCREASED to prevent overlap
      currentY += 10; // Increased from 8 to ensure heading doesn't overlap with table
      
      // Add a thin separator line under the heading
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(leftMargin, currentY - 4, leftMargin + 30, currentY - 4);
      
      // Prepare earnings table data
      const earningsTableData = earnings.map(item => [
        item.name, 
        formatCurrency(item.amount)
      ]);
      
      try {
        // Draw earnings table with compact styling
        const earningsTable = autoTable(doc, {
          startY: currentY,
          head: [['Earnings', 'Amount']],
          body: earningsTableData,
          foot: [['Gross Earnings', formatCurrency(grossEarnings)]],
          theme: 'grid',
          styles: {
            fontSize: 9, // Reduced from 10
            cellPadding: 3, // Reduced from 5
            lineColor: [220, 220, 220],
            lineWidth: 0.1
          },
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { halign: 'right', cellWidth: 60 }
          },
          headStyles: {
            fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          footStyles: {
            fillColor: [245, 245, 245],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
          margin: { top: 0, right: 0, bottom: 0, left: 0 } // Remove default margins
        });
        
        if (earningsTable && earningsTable.lastAutoTable) {
          currentY = earningsTable.lastAutoTable.finalY;
        } else {
          currentY += 15 + (earningsTableData.length * 8); // Reduced height estimate
        }
      } catch (e) {
        console.error("Error rendering earnings table:", e);
        currentY += 15 + (earningsTableData.length * 8);
      }
      
      // Deductions section with minimal spacing
      currentY += 12; // Increased from 8 to give more space between tables
      
      // Deductions section heading with clear separation
      doc.setFontSize(11); // Reduced from 12
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("", leftMargin, currentY);
      
      // Clear space between deductions heading and table - INCREASED to prevent overlap
      currentY += 10; // Increased from 8 to ensure heading doesn't overlap with table
      
      // Add a thin separator line under the heading
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(leftMargin, currentY - 4, leftMargin + 35, currentY - 4);
      
      // Prepare deductions table data
      const deductionsTableData = deductions.map(item => [
        item.name, 
        formatCurrency(item.amount)
      ]);
      
      try {
        // Draw deductions table with compact styling
        const deductionsTable = autoTable(doc, {
          startY: currentY,
          head: [['Deductions', 'Amount']],
          body: deductionsTableData,
          foot: [['Total Deductions', formatCurrency(totalDeductions)]],
          theme: 'grid',
          styles: {
            fontSize: 9, // Reduced from 10
            cellPadding: 3, // Reduced from 5
            lineColor: [220, 220, 220],
            lineWidth: 0.1
          },
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { halign: 'right', cellWidth: 60 }
          },
          headStyles: {
            fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          footStyles: {
            fillColor: [245, 245, 245],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
          margin: { top: 0, right: 0, bottom: 0, left: 0 } // Remove default margins
        });
        
        if (deductionsTable && deductionsTable.lastAutoTable) {
          currentY = deductionsTable.lastAutoTable.finalY;
        } else {
          currentY += 15 + (deductionsTableData.length * 8); // Reduced height estimate
        }
      } catch (e) {
        console.error("Error rendering deductions table:", e);
        currentY += 15 + (deductionsTableData.length * 8);
      }
      
      // Net Pay section with minimal spacing
      currentY += 15; // Increased from 10 to give more space before net pay section
      
      // Net Pay with enhanced styling
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.roundedRect(leftMargin, currentY, contentWidth, 18, 2, 2, 'F'); // Reduced height from 20 to 18
      
      // Net pay text 
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11); // Reduced from 12
      doc.setTextColor(255, 255, 255);
      doc.text("NET PAY:", leftMargin + 10, currentY + 12, { align: "left" });
      doc.setFontSize(12); // Reduced from 14
      doc.text(formatCurrency(netPayable), rightMargin - 10, currentY + 12, { align: "right" });
      
      // Update position after net pay with minimal spacing
      currentY += 24; // Reduced from 30
      
      // Amount in words with minimal styling
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.2);
      doc.roundedRect(leftMargin, currentY, contentWidth, 18, 2, 2, 'S'); // Reduced height from 20 to 18
      
      doc.setFontSize(9); // Reduced from 10
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text("Amount in Words:", leftMargin + 5, currentY + 6); // Reduced positioning
      doc.setFont("helvetica", "italic");
      doc.setTextColor(0, 0, 0);
      
      // Amount in words with compact text
      const words = numberToWords(netPayable);
      const wrappedText = doc.splitTextToSize(words, contentWidth - 80);
      doc.text(wrappedText, leftMargin + 60, currentY + 6); // Reduced positioning
      
      // Footer with minimal spacing
      currentY += 24; // Reduced spacing before footer
      
      // Footer with compact styling
      const footerY = pageHeight - 10; // Keep footer at bottom but not too close to edge
      
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.3);
      doc.line(leftMargin, footerY - 8, rightMargin, footerY - 8);
      
      doc.setFontSize(7); // Reduced from 8
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text("This is a computer-generated document and does not require a signature.", pageWidth/2, footerY, { align: "center" });
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, rightMargin - 5, footerY - 10, { align: "right" });
      
      return doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const handleGeneratePayslip = () => {
    try {
      // Use the PDF generator with improved alignments
      const doc = generatePDF();
      // Save PDF
      const fileName = `Payslip_${employeeInfo.employeeName || 'Employee'}_${employeeInfo.payPeriod || 'Period'}.pdf`.replace(/\s+/g, '_');
      doc.save(fileName);
    } catch (error) {
      alert(`Error generating payslip: ${error.message}`);
    }
  };

  const handleViewPDF = () => {
    try {
      // Use the PDF generator with improved alignments
      const doc = generatePDF();
      // Open PDF in new tab with proper scaling
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a new window with proper viewport settings
      const newWindow = window.open();
      if (!newWindow) {
        alert("Please allow pop-ups to view the PDF");
        return;
      }
      
      // Add responsive viewer HTML to the new window
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Payslip - ${employeeInfo.employeeName || 'Employee'}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
              background-color: #525659;
            }
            #pdf-container {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              overflow: auto;
              padding: 20px 0;
            }
            #pdf-viewer {
              width: 100%;
              height: 100%;
              max-width: 800px;
              box-shadow: 0 5px 15px rgba(0,0,0,0.3);
              border-radius: 4px;
              background-color: white;
            }
            @media (max-width: 600px) {
              #pdf-container {
                padding: 10px 0;
              }
              #pdf-viewer {
                max-width: 95%;
              }
            }
          </style>
        </head>
        <body>
          <div id="pdf-container">
            <iframe id="pdf-viewer" src="${blobUrl}" frameborder="0"></iframe>
          </div>
        </body>
        </html>
      `);
      
      // Handle cleanup when the window is closed
      newWindow.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(blobUrl);
      });
      
    } catch (error) {
      alert(`Error viewing payslip: ${error.message}`);
    }
  };

  const handlePrintPayslip = () => {
    try {
      // Use the PDF generator with improved alignments
      const doc = generatePDF();
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a new print window with proper print-specific CSS
      const printWindow = window.open();
      if (!printWindow) {
        alert("Please allow pop-ups to print the PDF");
        return;
      }
      
      // Add responsive print-optimized HTML to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print Payslip - ${employeeInfo.employeeName || 'Employee'}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
              iframe {
                width: 100%;
                height: 100vh;
                border: none;
              }
            }
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
            }
            #print-container {
              display: flex;
              flex-direction: column;
              height: 100vh;
              padding: 10px;
            }
            #print-controls {
              padding: 10px;
              background: #f1f5f9;
              border-radius: 8px;
              margin-bottom: 15px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            #print-controls button {
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              padding: 8px 16px;
              font-weight: 500;
              cursor: pointer;
            }
            #print-controls button:hover {
              background: #2563eb;
            }
            iframe {
              flex: 1;
              width: 100%;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div id="print-container">
            <div id="print-controls">
              <h1 style="margin: 0; font-size: 18px;">Print Payslip</h1>
              <button onclick="window.print(); return false;">Print Now</button>
            </div>
            <iframe src="${blobUrl}" frameborder="0"></iframe>
          </div>
        </body>
        </html>
      `);
      
      // Handle cleanup when window is closed
      printWindow.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(blobUrl);
      });
    } catch (error) {
      alert(`Error preparing payslip for printing: ${error.message}`);
    }
  };

  const isFormComplete = () => {
    // Check if essential data is filled
    if (!companyInfo.companyName || !employeeInfo.employeeName) {
      return false;
    }
    
    // Ensure at least one earning with amount is entered
    const hasEarnings = earnings.some(item => item.name && parseFloat(item.amount));
    
    return hasEarnings;
  };

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
          <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <h2 className="text-xl font-semibold text-gray-800">Generated Payslip</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Employee</h3>
            <p className="text-gray-800 font-semibold">{employeeInfo.employeeName || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Pay Period</h3>
            <p className="text-gray-800 font-semibold">{employeeInfo.payPeriod || 'Not specified'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-3">Earnings</h3>
            <div className="space-y-2">
              {earnings.map((item, index) => (
                item.name && item.amount ? (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-800 font-medium">{formatCurrencyDisplay(item.amount)}</span>
                  </div>
                ) : null
              ))}
              <div className="border-t pt-2 mt-3 flex justify-between font-semibold">
                <span>Gross Earnings</span>
                <span className="text-blue-600">{formatCurrencyDisplay(grossEarnings)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-3">Deductions</h3>
            <div className="space-y-2">
              {deductions.map((item, index) => (
                item.name && item.amount ? (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-800 font-medium">{formatCurrencyDisplay(item.amount)}</span>
                  </div>
                ) : null
              ))}
              <div className="border-t pt-2 mt-3 flex justify-between font-semibold">
                <span>Total Deductions</span>
                <span className="text-red-600">{formatCurrencyDisplay(totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-semibold">Net Pay</span>
            <span className="text-xl font-bold text-indigo-600">{formatCurrencyDisplay(netPayable)}</span>
          </div>
          <p className="text-gray-500 text-sm mt-1 italic">{numberToWords(netPayable)}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleGeneratePayslip}
            disabled={!isFormComplete()}
            className="btn btn-primary" 
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download PDF</span>
          </button>
          
          <button
            onClick={handleViewPDF}
            disabled={!isFormComplete()}
            className="btn btn-primary"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Preview PDF</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
          <button
            onClick={handlePrintPayslip}
            disabled={!isFormComplete()}
            className="btn btn-primary"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Payslip</span>
          </button>
        </div>
        
        <button
          onClick={handleReset}
          className="btn btn-secondary w-full"
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset All Fields</span>
        </button>
      </div>
    </div>
  );
};

export default PaySlipResult;


