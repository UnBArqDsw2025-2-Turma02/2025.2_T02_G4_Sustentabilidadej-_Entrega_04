const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erro ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password) => request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  bills: {
    list: () => request('/api/bills'),
    create: (data) => request('/api/bills', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/bills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/api/bills/${id}`, { method: 'DELETE' }),
  },
  reports: { send: () => request('/api/reports/send', { method: 'POST' }) },
  tokens: { balance: () => request('/api/tokens/balance'), ledger: () => request('/api/tokens/ledger') },
};
