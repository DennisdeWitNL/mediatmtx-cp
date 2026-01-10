export class ApiError extends Error {
  public status?: number;
  public details?: any;

  constructor(message: string, status?: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return new ApiError(
      error.response.data?.error || 'An API error occurred', 
      error.response.status, 
      error.response.data
    );
  } else if (error.request) {
    // The request was made but no response was received
    return new ApiError('No response received from server', 500);
  } else {
    // Something happened in setting up the request that triggered an Error
    return new ApiError(error.message || 'An unexpected error occurred', 0);
  }
};

export const logError = (error: ApiError) => {
  console.error(`[${new Date().toISOString()}] ${error.name}:`, {
    message: error.message,
    status: error.status,
    details: error.details
  });
  
  // In a real application, you might want to send this to a logging service
};

// Utility for displaying user-friendly error messages
export const getUserFriendlyErrorMessage = (error: ApiError): string => {
  switch (error.status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required. Please log in.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 0:
      return 'Network error. Please check your connection.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};