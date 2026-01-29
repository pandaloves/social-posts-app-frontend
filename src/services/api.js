const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Utility function to validate token format
const validateToken = (token) => {
  if (!token) return false;
  
  const trimmedToken = token.trim();
  
  // Check if token looks like a JWT (three parts separated by dots)
  const parts = trimmedToken.split('.');
  if (parts.length !== 3) {
    console.warn('Token does not have 3 parts');
    return false;
  }
  
  // Check if parts are valid base64 URL format
  try {
    parts.forEach((part, index) => {
      // JWT uses URL-safe base64 without padding
      // Add padding if needed
      let base64 = part.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const decoded = atob(base64);
      console.log(`Part ${index} decoded length:`, decoded.length);
    });
    return true;
  } catch (error) {
    console.warn('Token contains invalid base64:', error);
    return false;
  }
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    // Trim the token to ensure no extra whitespace
    const cleanToken = token.trim();
    headers['Authorization'] = `Bearer ${cleanToken}`;
  }
  
  return headers;
};

// Helper for API calls
const apiCall = async (endpoint, options = {}, requiresAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token format
      if (!validateToken(token)) {
        console.error('Invalid token format, clearing storage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Invalid authentication token. Please login again.');
      }
      
      const cleanToken = token.trim();
      headers.Authorization = `Bearer ${cleanToken}`;
      console.log('Using token (trimmed):', `"${cleanToken}"`);
    } else {
      console.warn('No token found but auth is required for endpoint:', endpoint);
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Making request to: ${url}`);
  console.log('Headers:', headers);
  console.log('Method:', options.method || 'GET');
  if (options.body) {
    console.log('Body:', options.body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    // Clone the response to read it multiple times if needed
    const responseClone = response.clone();
    const responseText = await responseClone.text();
    console.log('Raw response text:', responseText);

    if (!response.ok) {
      // Check if it's an auth error
      if (response.status === 401 || response.status === 403) {
        console.log('Authentication error, clearing local storage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      // Try to parse error message
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        if (responseText) {
          const errorJson = JSON.parse(responseText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        }
      } catch {
        errorMessage = responseText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    if (response.status === 204 || responseText === '') {
      return null;
    }

    // Try to parse as JSON
    try {
      const jsonResponse = JSON.parse(responseText);
      return jsonResponse;
    } catch (jsonError) {
      console.warn('Response is not valid JSON, returning text');
      return responseText;
    }

  } catch (error) {
    console.error('API call failed:', {
      error: error.message,
      endpoint,
      requiresAuth
    });
    throw error;
  }
};

// ==================== AUTH SERVICE ====================
export const authService = {
  login: async (credentials) => {
    return apiCall(
      '/users/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      false
    );
  },

  register: async (userData) => {
    return apiCall(
      '/users',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      false 
    );
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
};

// ==================== USER SERVICE ====================
export const userService = {
  // GET /users - Hämtar alla användare
  getUsers: async () => {
    return apiCall('/users');
  },

  // GET /users/{id} - Hämtar en specifik användare
  getUserById: async (id) => {
    return apiCall(`/users/${id}`);
  },

  // GET /users/{id}/with-posts - Hämtar användare med posts
  getUserWithPosts: async (id) => {
    return apiCall(`/users/${id}/with-posts`);
  },

  // POST /users - Skapar en ny användare
  createUser: async (userData) => {
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // PUT /users/{id} - Uppdaterar en befintlig användare
  updateUser: async (id, userData) => {
    return apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // DELETE /users/{id} - Tar bort en användare
  deleteUser: async (id) => {
    return apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== POST SERVICE ====================
export const postService = {
  // GET /posts - Hämtar posts med pagination och sortering
  getPosts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/posts?${queryString}` : '/posts';
    
    return apiCall(endpoint);
  },

  // GET /posts/{id} - Hämtar en specifik post
  getPostById: async (id) => {
    return apiCall(`/posts/${id}`);
  },

  // POST /posts - Skapar en ny post
  createPostForUser: async (userId, postData) => {
    return apiCall(`/users/${userId}/posts`, {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  // PUT /posts/{id} - Uppdaterar en befintlig post
  updatePost: async (postId, postData) => {
    return apiCall(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  // DELETE /posts/{id} - Tar bort en post
  deletePost: async (postId) => {
    return apiCall(`/posts/${postId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== HELPER FUNCTIONS ====================

// Authentication
export const login = (credentials) => authService.login(credentials);
export const register = (userData) => authService.register(userData);
export const logout = () => authService.logout();

// Posts
export const fetchFeedPosts = (page = 0, size = 10) => 
  postService.getPosts({ page, size, sort: 'createdAt,desc' });

export const fetchUserPosts = (userId, page = 0, size = 10) => 
  postService.getPosts({ userId, page, size, sort: 'createdAt,desc' });

export const createPost = (userId, postData) => postService.createPostForUser(userId, postData);

export const updatePost = (postId, postData) => postService.updatePost(postId, postData);
export const deletePost = (postId) => postService.deletePost(postId);

// Users
export const fetchUserProfile = (userId) => userService.getUserById(userId);
export const getUserWithPosts = (userId) => userService.getUserWithPosts(userId);
export const getUsers = () => userService.getUsers();
export const updateUserProfile = (userId, userData) => userService.updateUser(userId, userData);
export const deleteUserAccount = (userId) => userService.deleteUser(userId);

// Search
export const searchUsers = async (query) => {
  const users = await userService.getUsers();
  return users.filter(user => 
    user.username.toLowerCase().includes(query.toLowerCase()) ||
    user.email.toLowerCase().includes(query.toLowerCase())
  );
}