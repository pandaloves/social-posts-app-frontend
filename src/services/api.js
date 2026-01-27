
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper for API calls
const apiCall = async (endpoint, options = {}, requiresAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Try to get response as text first to see what we're getting
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText || response.statusText}`);
    }

    if (response.status === 204 || responseText === '') {
      return null;
    }

    // Try to parse as JSON
    try {
      const jsonResponse = JSON.parse(responseText);
      return jsonResponse;
    } catch (jsonError) {
      return responseText;
    }

  } catch (error) {
    console.log("REQUEST URL:", `${API_BASE_URL}${endpoint}`);

    console.error('API call failed:', error);
    throw error;
  }
};


// ==================== AUTH SERVICE ====================
export const authService = {login: async (credentials) => {
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
};
