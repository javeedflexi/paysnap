import React, { useEffect, useState } from 'react';
import PayslipGenerator from './components/PayslipGenerator';
import ErrorBoundary from './components/ErrorBoundary';
import emailjs from '@emailjs/browser';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize EmailJS with a simple placeholder key
    try {
      emailjs.init({
        publicKey: 'public_key_placeholder',
      });
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
    
    // Mark as loaded
    setIsLoaded(true);
  }, []);
  
  // Simple check to verify app is loading
  if (!isLoaded) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 max-w-md w-full transform transition-all duration-500 animate-fadeIn">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Payslip Generator</h2>
          <p className="text-gray-600 mb-4">Initializing application...</p>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-progressBar"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ErrorBoundary>
          <PayslipGenerator />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
