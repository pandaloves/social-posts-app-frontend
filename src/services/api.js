const API_BASE_URL = '/api';

// Mock database
let mockUsers = [
  {
    id: 1,
    username: 'Mia',
    email: 'mia@gmail.com',
    role: 'USER',
    bio: 'Hej! Jag är Mia.',
    password: 'mia123',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    username: 'Test',
    email: 'test@gmail.com',
    role: 'USER',
    bio: 'I am a test user',
    password: 'test123',
    createdAt: new Date().toISOString()
  }
];

let mockPosts = [
  {
    id: 1,
    content: 'Hej! God morgon! ☀️',
    createdAt: new Date().toISOString(),
    author: mockUsers[0],
    commentCount: 2
  },
  {
    id: 2,
    content: 'Just finished connecting frontend with backend 🚀',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    author: mockUsers[1],
    commentCount: 1
  },
  {
    id: 3,
    content: 'Spring Boot + React + Tailwind = ❤️',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    author: mockUsers[0],
    commentCount: 0
  }
];

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Remove password from user objects
const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

// ==================== AUTH SERVICE ====================
export const authService = {
  login: async (credentials) => {
    await delay(600);
    const user = mockUsers.find(u =>
      u.username.toLowerCase() === credentials.username.toLowerCase() &&
      u.password === credentials.password
    );
    if (user) {
      return {
        success: true,
        token: `mock-jwt-${Date.now()}-${user.id}`,
        refreshToken: `mock-refresh-${Date.now()}`,
        user: sanitizeUser(user)
      };
    }
    throw new Error('Invalid username or password. Try: mia/mia123 or test/test123');
  },

  register: async (userData) => {
    await delay(800);
    if (mockUsers.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
      throw new Error('Username already exists');
    }
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return {
      success: true,
      token: `mock-jwt-${Date.now()}-${newUser.id}`,
      user: sanitizeUser(newUser)
    };
  },

  logout: () => Promise.resolve()
};

// ==================== USER SERVICE ====================
export const userService = {
  getUsers: async () => {
    await delay(400);
    return mockUsers.map(sanitizeUser);
  },

  getUserById: async (id) => {
    await delay(300);
    const user = mockUsers.find(u => u.id === id);
    return user ? sanitizeUser(user) : null;
  },

  getUserWithPosts: async (id) => {
    await delay(500);
    const user = mockUsers.find(u => u.id === id);
    if (!user) return null;
    const userPosts = mockPosts.filter(p => p.author.id === id);
    return {
      ...sanitizeUser(user),
      posts: userPosts
    };
  }
};

// ==================== POST SERVICE ====================
export const postService = {
  getPosts: async (params = {}) => {
    await delay(400);
    let posts = [...mockPosts];

    // Sorting
    if (params.sort) {
      const [field, direction] = params.sort.split(',');
      posts.sort((a, b) => {
        const valueA = new Date(a[field]);
        const valueB = new Date(b[field]);
        return direction === 'desc' ? valueB - valueA : valueA - valueB;
      });
    }

    // Pagination
    const page = params.page ?? 0;
    const size = params.size ?? 10;
    const start = page * size;
    const end = start + size;
    const content = posts.slice(start, end);

    const totalElements = posts.length;
    const totalPages = Math.ceil(totalElements / size);

    return {
      content,
      pageable: { pageNumber: page, pageSize: size, offset: start, paged: true, unpaged: false },
      last: page === totalPages - 1,
      first: page === 0,
      totalPages,
      totalElements,
      size,
      number: page,
      numberOfElements: content.length,
      empty: content.length === 0
    };
  },

  createPost: async (postData) => {
    await delay(500);
    const newPost = {
      id: mockPosts.length + 1,
      content: postData.content,
      author: mockUsers[0], // Mock logged-in user
      createdAt: new Date().toISOString(),
      commentCount: 0
    };
    mockPosts.unshift(newPost);
    return newPost;
  },

  updatePost: async (postId, postData) => {
    await delay(400);
    const post = mockPosts.find(p => p.id === postId);
    if (post) post.content = postData.content;
    return post;
  },

  deletePost: async (postId) => {
    await delay(300);
    const index = mockPosts.findIndex(p => p.id === postId);
    if (index !== -1) mockPosts.splice(index, 1);
    return Promise.resolve();
  }
};

// ==================== EXPORTS ====================
export const login = (credentials) => authService.login(credentials);
export const register = (userData) => authService.register(userData);
export const fetchFeedPosts = () => postService.getPosts();
export const fetchUserPosts = (userId) => userService.getUserWithPosts(userId);
export const createPost = (postData) => postService.createPost(postData);
export const updatePost = (postId, postData) => postService.updatePost(postId, postData);
export const deletePost = (postId) => postService.deletePost(postId);
export const fetchUserProfile = (userId) => userService.getUserById(userId);
export const searchUsers = (query) =>
  userService.getUsers().then(users =>
    users.filter(user => user.username.toLowerCase().includes(query.toLowerCase()))
  );
export const getUsers = () => userService.getUsers();
export const getUserWithPosts = (userId) => userService.getUserWithPosts(userId);
