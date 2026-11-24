/**
 * Thin fetch wrapper for the Express API. Manages the JWT token in localStorage
 * and attaches it to every request automatically.
 */

let authToken: string | null = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

export function setToken(token: string) {
  authToken = token;
  if (typeof localStorage !== 'undefined') localStorage.setItem('token', token);
}

export function clearToken() {
  authToken = null;
  if (typeof localStorage !== 'undefined') localStorage.removeItem('token');
}

export function getToken() {
  return authToken;
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(`/api${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { message?: string }).message || 'Request failed');
  return data as T;
}

// --- Auth ---
export const auth = {
  register: (name: string, email: string, password: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
  updateProfile: (data: { name?: string; avatarUrl?: string }) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// --- Templates ---
export const templatesApi = {
  list: (category?: string) =>
    request(`/templates${category && category !== 'All' ? `?category=${category}` : ''}`),
};

// --- Invitations ---
export const invitationsApi = {
  list: () => request('/invitations'),
  create: (data: { name?: string; templateId?: string; content?: any; published?: boolean }) =>
    request('/invitations', { method: 'POST', body: JSON.stringify(data) }),
  get: (id: string) => request(`/invitations/${id}`),
  update: (id: string, data: Record<string, any>) =>
    request(`/invitations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request(`/invitations/${id}`, { method: 'DELETE' }),
  getBySlug: (slug: string) => request(`/invitations/slug/${slug}`),
  getRsvps: (id: string) => request(`/invitations/${id}/rsvps`),
};

// --- Favorites ---
export const favoritesApi = {
  list: () => request<{ favorites: string[] }>('/invitations/favorites/all'),
  add: (templateId: string) =>
    request(`/invitations/favorites/${templateId}`, { method: 'POST' }),
  remove: (templateId: string) =>
    request(`/invitations/favorites/${templateId}`, { method: 'DELETE' }),
};

// --- RSVP ---
export const rsvpApi = {
  submit: (data: {
    slug: string;
    guestName: string;
    email?: string;
    attending: boolean;
    guests: number;
    message?: string;
  }) => request('/rsvps', { method: 'POST', body: JSON.stringify(data) }),
};
