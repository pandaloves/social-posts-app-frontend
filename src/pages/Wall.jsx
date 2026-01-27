import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import UserInfo from '../components/UserInfo';
import { FaSpinner } from 'react-icons/fa';
import { fetchUserProfile, fetchUserPosts, createPost, updatePost, deletePost } from '../services/api';

export default function Wall({ isOwnWall = false }) {
  const { userId } = useParams();
  const { user: loggedInUser } = useAuth();
  const { posts, setAllPosts, addPost, updatePostById, deletePostById } = usePosts();

  const [wallUser, setWallUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  const currentWallUserId = isOwnWall ? loggedInUser?.id : Number(userId);
  const isViewingOwnWall = isOwnWall || currentWallUserId === loggedInUser?.id;

  useEffect(() => {
    if (currentWallUserId) {
      loadWallData();
    }
  }, [currentWallUserId, page]);

  useEffect(() => {
    setPage(0); // Reset pagination when user changes
  }, [currentWallUserId]);

  const loadWallData = async () => {
  try {
    setLoading(true);
    setError(null);

    // Fetch the auth user's profile
    const userData = await fetchUserProfile(loggedInUser?.id);
    setWallUser(userData);

    // Fetch only posts of the auth user
    const postsData = await fetchUserPosts(loggedInUser?.id); 
    const normalizedPosts = (postsData.content || []).map(p => ({
      ...p,
      user: p.user,
    }));

    // Sort newest first
    const sortedPosts = normalizedPosts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setAllPosts(sortedPosts); 
  } catch (err) {
    console.error('Error loading wall:', err);
    setError('Failed to load wall data. Please try again.');
  } finally {
    setLoading(false);
  }
};


const handleCreatePost = async (postData) => {
  // Pass loggedInUser.id in the URL (handled by API service)
  const newPost = await createPost(loggedInUser.id, postData);

  addPost({
    ...newPost,
    user: {
      id: loggedInUser.id,
      username: loggedInUser.username,
      email: loggedInUser.email,
    },
  });
};




 const handleUpdatePost = async (postId, text) => {
  await updatePost(postId, { text });
  updatePostById(postId, { text, updatedAt: new Date().toISOString() });
};

const handleDeletePost = async (postId) => {
  await deletePost(postId);
  deletePostById(postId);
};


  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <FaSpinner className="animate-spin text-3xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading wall...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {wallUser && <UserInfo user={wallUser} isOwnProfile={isViewingOwnWall} postCount={posts.length} />}

      {isViewingOwnWall && <PostForm onSubmit={handleCreatePost} />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isViewingOwnWall ? 'Your Posts' : `${wallUser?.username}'s Posts`}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({posts.length})
              </span>
            </h2>
          </div>
        </div>
        
        <div className="p-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {isViewingOwnWall
                ? "You haven't posted anything yet."
                : 'No posts yet.'}
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {showEditProfile && wallUser && (
        <EditProfileDialog
          user={wallUser}
          onClose={() => setShowEditProfile(false)}
          onSave={handleProfileSave}
        />
      )}
    </div>
  );
}