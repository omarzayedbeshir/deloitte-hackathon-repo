// API Configuration and helper functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Get stored JWT token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Set JWT token
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Clear JWT token
export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// Generic fetch wrapper
async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { requireAuth?: boolean } = {}
): Promise<T> {
  const { requireAuth = false, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (requireAuth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}

// ===== AUTH ENDPOINTS =====
export interface LoginResponse {
  access_token: string;
  username: string;
}

export interface RegisterResponse {
  message: string;
}

export interface UserResponse {
  id: number;
  username: string;
}

export const authAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await apiCall<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setAuthToken(response.access_token);
    return response;
  },

  register: async (username: string, password: string): Promise<RegisterResponse> => {
    return apiCall<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  getMe: async (): Promise<UserResponse> => {
    return apiCall<UserResponse>('/api/auth/me', {
      requireAuth: true,
    });
  },

  logout: () => {
    clearAuthToken();
  },
};

// ===== INVENTORY ENDPOINTS =====
export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  price: number;
  description?: string;
  expiry?: string;
  status: string;
}

export const inventoryAPI = {
  getAll: async (): Promise<InventoryItem[]> => {
    return apiCall<InventoryItem[]>('/api/inventory');
  },

  getFiltered: async (filters: {
    search?: string;
    category?: string;
    minQty?: number;
    maxQty?: number;
    minPrice?: number;
    maxPrice?: number;
    expiryFrom?: string;
    expiryTo?: string;
  }): Promise<InventoryItem[]> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minQty !== undefined) params.append('minQty', filters.minQty.toString());
    if (filters.maxQty !== undefined) params.append('maxQty', filters.maxQty.toString());
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.expiryFrom) params.append('expiryFrom', filters.expiryFrom);
    if (filters.expiryTo) params.append('expiryTo', filters.expiryTo);

    return apiCall<InventoryItem[]>(`/api/inventory?${params.toString()}`);
  },

  create: async (item: Omit<InventoryItem, 'id' | 'status'>): Promise<{ message: string; item: InventoryItem }> => {
    return apiCall('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(item),
      requireAuth: true,
    });
  },

  update: async (id: number, updates: Partial<InventoryItem>): Promise<{ message: string; item: InventoryItem }> => {
    return apiCall(`/api/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      requireAuth: true,
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return apiCall(`/api/inventory/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};

// ===== TRANSACTIONS ENDPOINTS =====
export interface Transaction {
  id: number;
  product_id: number;
  product_name: string;
  transaction_type: 'sale' | 'purchase';
  product_quantity: number;
  total_price: number;
  time_of_transaction: string;
}

export interface CreateTransactionRequest {
  name: string;
  quantity: number;
  transaction_type?: 'sale' | 'purchase';
}

export interface CreateTransactionResponse {
  message: string;
  total_price: number;
  transaction: Transaction;
}

export const transactionsAPI = {
  create: async (data: CreateTransactionRequest): Promise<CreateTransactionResponse> => {
    return apiCall<CreateTransactionResponse>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true,
    });
  },

  getAll: async (): Promise<Transaction[]> => {
    return apiCall<Transaction[]>('/api/transactions', {
      requireAuth: true,
    });
  },
};

// ===== CATEGORIES ENDPOINTS =====
export interface Category {
  id: number;
  name: string;
  description?: string;
  status: string;
}

export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    return apiCall<Category[]>('/api/categories');
  },

  create: async (name: string, description?: string): Promise<Category> => {
    return apiCall('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
      requireAuth: true,
    });
  },

  update: async (id: number, updates: Partial<Category>): Promise<Category> => {
    return apiCall(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      requireAuth: true,
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return apiCall(`/api/categories/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};
