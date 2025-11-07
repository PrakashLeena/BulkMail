export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = {
  sendMail: `${API_BASE_URL}/api/sendmail`,
  health: `${API_BASE_URL}/api/health`,
  test: `${API_BASE_URL}/api/test`,
};

export default api;
