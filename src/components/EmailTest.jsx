import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

function EmailTest() {
  const form = useRef();
  const [status, setStatus] = useState({ sending: false, success: false, error: null });
  const [showTestPanel, setShowTestPanel] = useState(false);

  const sendTestEmail = (e) => {
    e.preventDefault();
    setStatus({ sending: true, success: false, error: null });
    
    // Use default IDs to avoid issues with undefined environment variables
    const serviceId = 'service_payslip';
    const templateId = 'template_payslip';
    
    console.log('EmailTest: Sending test email with:', {
      serviceId,
      templateId
    });
    
    emailjs.sendForm(serviceId, templateId, form.current)
      .then((result) => {
        console.log('EmailTest: Email sent successfully:', result.text);
        setStatus({ sending: false, success: true, error: null });
      })
      .catch((error) => {
        console.error('EmailTest: Failed to send email:', error);
        setStatus({ sending: false, success: false, error: error.text || error.message || 'Unknown error' });
      });
  };

  if (!showTestPanel) {
    return (
      <button 
        onClick={() => setShowTestPanel(true)}
        className="mt-4 p-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm"
      >
        Show EmailJS Test Panel
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">EmailJS Test Panel</h3>
        <button 
          onClick={() => setShowTestPanel(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
        This panel helps diagnose EmailJS issues by sending a simple test email.
      </div>
      
      {status.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          Email sent successfully!
        </div>
      )}
      
      {status.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          Error: {status.error}
        </div>
      )}
      
      <form ref={form} onSubmit={sendTestEmail} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">From Name</label>
          <input 
            type="text" 
            name="senderName" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            defaultValue="Payslip Generator"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">From Email</label>
          <input 
            type="email" 
            name="senderEmail" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="your@email.com" 
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">To Email</label>
          <input 
            type="email" 
            name="recipientEmail" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="recipient@email.com" 
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Subject</label>
          <input 
            type="text" 
            name="subject" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            defaultValue="Test Email from Payslip Generator" 
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Message</label>
          <textarea 
            name="message" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            rows="3" 
            defaultValue="This is a test message from the Payslip Generator app."
            required
          ></textarea>
        </div>
        
        {/* Hidden fields for testing */}
        <input type="hidden" name="employeeName" value="Test Employee" />
        <input type="hidden" name="payPeriod" value="Test Period" />
        <input type="hidden" name="companyName" value="Test Company" />
        
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
            disabled={status.sending}
          >
            {status.sending ? 'Sending...' : 'Send Test Email'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 p-2 bg-gray-100 rounded-lg text-sm">
        <div className="font-medium">Current Configuration:</div>
        <div className="mt-1">
          <div>Using default service and template IDs for testing</div>
        </div>
      </div>
    </div>
  );
}

export default EmailTest; 