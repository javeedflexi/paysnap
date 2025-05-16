import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Something went wrong</h2>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg mb-4 text-red-700">
              <p className="font-medium">The application has encountered an error</p>
              <p className="mt-1 text-sm">{this.state.error && this.state.error.toString()}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Try the following:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Refresh the page</li>
                  <li>Clear your browser cache</li>
                  <li>Check your browser console for specific errors</li>
                </ul>
              </div>
              
              <div className="text-sm bg-gray-100 p-4 rounded-lg">
                <p className="font-medium text-gray-700 mb-1">Technical Details</p>
                <details className="text-xs font-mono">
                  <summary className="cursor-pointer text-blue-600">View error details</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 