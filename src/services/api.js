const API_BASE_URL = '/api';

//create post to cloud database
export async function createPostReal({content, userId}){
    const response = await fetch(
    `https://itchy-philomena-sofi-eklof-3b955ae4.koyeb.app/posts?userId=${userId}`, //koyeb link
        {
            method: 'POST', //post-action
            headers: {
                'Content-Type': 'application/json', //sending JSON
            },
            body: JSON.stringify({text: content})
        }
    );

    if(!response.ok){
        //throw error
        const text = await response.text().catch(()=>'');
        console.error('Create post failed', response.status, text);
        throw new Error('Failed to crete post');
    }

    //recieve created post as JSON
    return await response.json();

}

//update post to cloud database
export async function updatePostReal(postId, {content}){
    const response = await fetch(
        'https://itchy-philomena-sofi-eklof-3b955ae4.koyeb.app/posts/${postId}',
    {
        method: 'PUT',
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify({text : content }),
        }
    );

    if(!response.ok){
        const text = await response.text().catch(()=>'');
        console.error('Update post failed:', response.status, text);
        throw new Error('Failed to update post');
    }

    return await response.json();
}

//delete post in cloud database
export async function deletePostReal(postId){
    const response = await fetch(
        `https://itchy-philomena-sofi-eklof-3b955ae4.koyeb.app/posts/${postId}`,
        {
            method : 'DELETE',
        }
    );
    if (!response.ok){
        const text = await response.text().catch(()=> '');
        consoe.error('Delete post failed : ', response.status, text);
        throw new Error('Failed to delete post');
    }
}

// Mock database
let mockUsers = [
  {
    id: 1,
    username: 'Mia',
    email: 'mia@gmail.com',
    bio: 'Hej! Jag är Mia.',
    password: 'mia123',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    username: 'Test',
    email: 'test@gmail.com',
    bio: 'I am a test user',
    password: 'test123',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    username: 'Mary',
    email: 'mary@gmail.com',
    bio: 'Hej! Jag är Mary.',
    password: 'mary123',
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    username: 'Bob',
    email: 'bob@gmail.com',
    bio: 'I am Bob.',
    password: 'bob123',
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    username: 'John',
    email: 'john@gmail.com',
    bio: 'Hej! Jag är John.',
    password: 'john123',
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    username: 'Willliam',
    email: 'william@gmail.com',
    bio: 'Hej!',
    password: 'william123',
    createdAt: new Date().toISOString()
  },
  {
    id: 7,
    username: 'Eva',
    email: 'eva@gmail.com',
    bio: 'Hej! Jag är Eva.',
    password: 'eva123',
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    username: 'Neo',
    email: 'neo@gmail.com',
    bio: 'I am Neo',
    password: 'neo123',
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
    author: mockUsers[4],
    commentCount: 0
  },
  {
    id: 4,
    content: 'Spring Boot + React + Tailwind = ❤️',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    author: mockUsers[6],
    commentCount: 0
  }
];

// ==================== COMMENTS ====================
let mockComments = [
  {
    id: 1,
    postId: 1,
    content: 'Nice post!',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    author: mockUsers[1]
  },
  {
    id: 2,
    postId: 1,
    content: 'Good morning ☕',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    author: mockUsers[0]
  }
];

// ==================== FRIENDSHIPS ====================
let mockFriendships = [
  {
    id: 1,
    requesterId: 1,
    receiverId: 2,
    status: 'ACCEPTED', // PENDING | ACCEPTED | REJECTED
    createdAt: new Date().toISOString()
  },
    {
    id: 2,
    requesterId: 1,
    receiverId: 3,
    status: 'ACCEPTED', // PENDING | ACCEPTED | REJECTED
    createdAt: new Date().toISOString()
  },
    {
    id: 3,
    requesterId: 1,
    receiverId: 4,
    status: 'ACCEPTED', // PENDING | ACCEPTED | REJECTED
    createdAt: new Date().toISOString()
  },
    {
    id: 4,
    requesterId: 1,
    receiverId: 5,
    status: 'ACCEPTED', // PENDING | ACCEPTED | REJECTED
    createdAt: new Date().toISOString()
  },
    {
    id: 5,
    requesterId: 1,
    receiverId: 6,
    status: 'ACCEPTED', // PENDING | ACCEPTED | REJECTED
    createdAt: new Date().toISOString()
  },
    {
    id: 6,
    requesterId: 1,
    receiverId: 7,
    status: 'ACCEPTED', // PENDING | ACCEPTED | REJECTED
    createdAt: new Date().toISOString()
  },
    {
    id: 7,
    requesterId: 1,
    receiverId: 8,
    status: 'ACCEPTED', // PENDING | ACCEPTED | REJECTED
    createdAt: new Date().toISOString()
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

  getUserWithPosts: async (id, page = 0, size = 5) => {
    await delay(500);
    const user = mockUsers.find(u => u.id === id);
    if (!user) return null;
    const allPosts = mockPosts.filter(p => p.author.id === id);

const start = page * size;
const content = allPosts.slice(start, start + size);

return {
  ...sanitizeUser(user),
  posts: content,
  totalElements: allPosts.length,
  totalPages: Math.ceil(allPosts.length / size),
  page
};

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

    // Filter by userId (Wall behavior)
    if (params.userId) {
      posts = posts.filter(p => p.author.id === Number(params.userId));
    }

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
    const content = posts.slice(start, start + size);

    const totalElements = posts.length;
    const totalPages = Math.ceil(totalElements / size);

    return {
      content,
      totalElements,
      totalPages,
      number: page,
      size
    };
  },

  createPost: async (postData) => {
    await delay(500);

    const newPost = {
      id: mockPosts.length + 1,
      content: postData.content,
      author: mockUsers[0], // mock logged in user
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


export const updateUserProfile = async (userId, updatedData) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...updatedData
  };

  return sanitizeUser(mockUsers[userIndex]);
};

// ==================== COMMENT SERVICE ====================
export const commentService = {

  getCommentsByPost: async (postId) => {
    await delay(300);

    const comments = mockComments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // oldest first

    return comments;
  },

  createComment: async (postId, content) => {
    await delay(300);

    const newComment = {
      id: mockComments.length + 1,
      postId,
      content,
      createdAt: new Date().toISOString(),
      author: mockUsers[0] 
    };

    mockComments.push(newComment);

    // Update comment count
    const post = mockPosts.find(p => p.id === postId);
    if (post) post.commentCount++;

    return newComment;
  }
};

// ==================== FRIENDSHIP SERVICE ====================
export const friendshipService = {

  sendFriendRequest: async (receiverId) => {
    await delay(300);

    const newRequest = {
      id: mockFriendships.length + 1,
      requesterId: mockUsers[0].id,
      receiverId,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    mockFriendships.push(newRequest);
    return newRequest;
  },

  getIncomingRequests: async (userId) => {
    await delay(300);

    return mockFriendships
      .filter(f => f.receiverId === userId && f.status === 'PENDING')
      .map(req => ({
        ...req,
        requester: sanitizeUser(
          mockUsers.find(u => u.id === req.requesterId)
        )
      }));
  },

  respondToRequest: async (requestId, status) => {
    await delay(300);

    const request = mockFriendships.find(f => f.id === requestId);
    if (request) request.status = status;

    return request;
  },

  getFriends: async (userId) => {
    await delay(300);

    const accepted = mockFriendships.filter(f =>
      f.status === 'ACCEPTED' &&
      (f.requesterId === userId || f.receiverId === userId)
    );

    return accepted.map(f => {
      const friendId =
        f.requesterId === userId ? f.receiverId : f.requesterId;

      return sanitizeUser(mockUsers.find(u => u.id === friendId));
    });
  }
};


// ==================== EXPORTS ====================
export const login = (credentials) => authService.login(credentials);
export const register = (userData) => authService.register(userData);
export const fetchPosts = (params) => postService.getPosts(params);
export const fetchUserPosts = (userId, page, size) =>
  userService.getUserWithPosts(userId, page, size);
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
export const fetchComments = (postId) =>
  commentService.getCommentsByPost(postId);

export const createComment = (postId, content) =>
  commentService.createComment(postId, content);
export const sendFriendRequest = (userId) =>
  friendshipService.sendFriendRequest(userId);

export const fetchFriendRequests = (userId) =>
  friendshipService.getIncomingRequests(userId);

export const respondFriendRequest = (requestId, status) =>
  friendshipService.respondToRequest(requestId, status);

export const fetchFriends = (userId) =>
  friendshipService.getFriends(userId);

