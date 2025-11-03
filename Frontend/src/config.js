const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = {
  sendMail: `${API_BASE_URL}/sendmail`,
  // Add other API endpoints here as needed
};

export default api;
