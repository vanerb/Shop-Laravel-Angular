const host = typeof window === 'undefined' ? '127.0.0.1' : window.location.hostname;

export const API_ORIGIN = `http://${host}:8000`;
export const API_BASE_URL = `${API_ORIGIN}/api/`;
