import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import UserProfileEdit from '../components/UserProfileEdit';
import { FaChevronLeft, FaChevronRight, FaEdit } from 'react-icons/fa';

import { 
  fetchUserPosts, 
  fetchUserProfile, 
  createPost, 
  updatePost, 
  deletePost
} from '../services/api';

export default function Wall({ isOwnWall = false }) {
  const { userId } = useParams();
  const { user: loggedInUser } = useAuth();
  const { posts, setAllPosts, addPost, updatePostById, deletePostById } = usePosts();

  const [wallUser, setWallUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10
  });

  const currentWallUserId = isOwnWall ? loggedInUser?.id : userId;
  const isViewingOwnWall = isOwnWall || currentWallUserId === loggedInUser?.id;

  useEffect(() => {
    if (currentWallUserId) loadWallData(pagination.currentPage);
  }, [currentWallUserId]);

  const loadWallData = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch wall user's profile
      const userData = await fetchUserProfile(currentWallUserId);
      setWallUser(userData);

      // Fetch posts with pagination
      const postsData = await fetchUserPosts(currentWallUserId, page, pagination.pageSize); 
      
      if (postsData.pageable) {
        setPagination({
          currentPage: postsData.pageable.pageNumber,
          totalPages: postsData.totalPages,
          totalElements: postsData.totalElements,
          pageSize: postsData.pageable.pageSize
        });
      }

      const normalizedPosts = (postsData.content || []).map(p => ({
        ...p,
        user: p.user 
      }));

      const sortedPosts = normalizedPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setAllPosts(sortedPosts);
    } catch (err) {
  console.error('Error loading wall:', err, err.message, err.response?.status, err.response?.data);
      setError('Failed to load wall data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      loadWallData(newPage);
    }
  };

  const handleCreatePost = async (postData) => {
    const newPost = await createPost(loggedInUser.id, postData);
    
    loadWallData(pagination.currentPage);
    
    if (pagination.currentPage === 0) {
      addPost({
        ...newPost,
        user: {
          id: loggedInUser.id,
          username: loggedInUser.username,
          email: loggedInUser.email,
        },
      });
    }
  };

  const handleUpdatePost = async (postId, text) => {
    await updatePost(postId, { text });
    updatePostById(postId, { text, updatedAt: new Date().toISOString() });
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
    deletePostById(postId);
    loadWallData(pagination.currentPage);
  };

  const handleProfileSave = (updatedData) => {
  setWallUser(prev => ({ ...prev, ...updatedData }));
  setIsEditingProfile(false);
  
  // Update posts in context with new username
  const updatedPosts = posts.map(post => {
    if (post.user?.id === loggedInUser?.id) {
      return {
        ...post,
        user: {
          ...post.user,
          username: updatedData.username,
          email: updatedData.email,
          bio: updatedData.bio
        }
      };
    }
    return post;
  });
  
  setAllPosts(updatedPosts);
};

  if (loading) return <div className="text-center py-12">Loading wall...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ==================== Auth User Profile Box ==================== */}
      {isViewingOwnWall && wallUser && (
        <div className="relative">
          {isEditingProfile ? (
            <UserProfileEdit
              user={wallUser}
              onSave={handleProfileSave}
              onCancel={() => setIsEditingProfile(false)}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 w-full mx-auto relative">
              <button
                onClick={() => setIsEditingProfile(true)}
                className="absolute top-4 right-4 px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg flex items-center space-x-2 transition"
              >
                <FaEdit />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-800">Username: {wallUser.username}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-800">Email: {wallUser.email}</span>
                </div>
                {wallUser.bio && (
                  <div className="flex items-start space-x-3">
                    <p className="text-gray-800">Bio: {wallUser.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== Post Form (Only own wall) ==================== */}
      {isViewingOwnWall && (
        <div className="mb-8">
          <PostForm onSubmit={handleCreatePost} />
        </div>
      )}

      {/* ==================== Posts List ==================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {isViewingOwnWall ? 'Your Posts' : `${wallUser?.username}'s Posts`}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({pagination.totalElements} {pagination.totalElements === 1 ? 'post' : 'posts'} total)
            </span>
          </h2>
          
          {pagination.totalPages > 1 && (
            <div className="text-sm text-gray-500">
              Page {pagination.currentPage + 1} of {pagination.totalPages}
            </div>
          )}
        </div>

        <div className="p-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {isViewingOwnWall ? "You haven't posted anything yet." : 'No posts yet.'}
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {posts.map(post => (
                  <Post
                    key={post.id}
                    post={post}
                    isOwnPost={post.user?.id === loggedInUser?.id}
                    onUpdate={handleUpdatePost}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center space-x-4">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 0}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                      pagination.currentPage === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <FaChevronLeft className="mr-2" />
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
                      Page {pagination.currentPage + 1} of {pagination.totalPages}
                    </span>
                    <span className="text-gray-500">
                      ({pagination.totalElements} posts)
                    </span>
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages - 1}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                      pagination.currentPage >= pagination.totalPages - 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Next
                    <FaChevronRight className="ml-2" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
