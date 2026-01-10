import React, { ErrorInfo } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 dark:bg-red-900">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 max-w-md text-center">
            <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              An unexpected error occurred. Please try again later.
            </p>
            {this.state.error && (
              <details className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-left text-sm">
                <summary className="cursor-pointer text-gray-700 dark:text-gray-300">
                  Error Details
                </summary>
                <pre className="text-red-600 dark:text-red-300 whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;