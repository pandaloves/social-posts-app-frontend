import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import UserInfo from '../components/UserInfo';
import EditProfileDialog from '../components/EditProfileModal';
import { updateUserProfile } from '../services/api';
import { fetchUserPosts, fetchUserProfile, createPost, updatePost, deletePost } from '../services/api';

export default function Wall({ isOwnWall = false }) {
  const { userId } = useParams();
  const { user: loggedInUser } = useAuth();

  const [wallUser, setWallUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const currentWallUserId = isOwnWall ? loggedInUser?.id : Number(userId);
  const isViewingOwnWall = isOwnWall || currentWallUserId === loggedInUser?.id;

  const loadWallData = useCallback(async (resetPage = false) => {
    if (!currentWallUserId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = resetPage ? 0 : page;
      
      // Load user profile
      const userData = await fetchUserProfile(currentWallUserId);
      setWallUser(userData);
      
      // Load posts with current page
      const postsData = await fetchUserPosts(currentWallUserId, currentPage, 5);
      
      // Handle API response
      const postsArray = postsData.posts || postsData.content || [];
      const totalPages = postsData.totalPages || 
                        (postsData.totalElements ? Math.ceil(postsData.totalElements / 5) : 1);
      
      setPosts(prev => currentPage === 0 
        ? postsArray 
        : [...prev, ...postsArray]
      );
      
      setHasMore(currentPage < totalPages - 1);
      
      if (resetPage && currentPage !== page) {
        setPage(currentPage);
      }
      
    } catch (err) {
      setError('Failed to load wall data. Please try again.');
      console.error('Wall load error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentWallUserId, page]);

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setWallUser(null);
    
    loadWallData(true);
  }, [currentWallUserId]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    
    try {
      const postsData = await fetchUserPosts(currentWallUserId, nextPage, 5);
      const postsArray = postsData.posts || postsData.content || [];
      const totalPages = postsData.totalPages || 
                        (postsData.totalElements ? Math.ceil(postsData.totalElements / 5) : 1);
      
      setPosts(prev => [...prev, ...postsArray]);
      setHasMore(nextPage < totalPages - 1);
    } catch (err) {
      console.error('Load more error:', err);
      setError('Failed to load more posts');
    }
  }, [currentWallUserId, page, hasMore, loading]);

  const handleProfileSave = async (updatedData) => {
    try {
      const updatedUser = await updateUserProfile(currentWallUserId, updatedData);
      setWallUser(updatedUser);
      setShowEditProfile(false);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
    }
  };

  const handleCreatePost = async (content) => {
    try {
      const newPost = await createPost({ content });
      setPosts(prev => [newPost, ...prev]);
    } catch (err) {
      setError('Failed to create post');
      console.error('Create post error:', err);
    }
  };

  const handleUpdatePost = async (postId, content) => {
    try {
      await updatePost(postId, { content });
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, content } : post
      ));
    } catch (err) {
      setError('Failed to update post');
      console.error('Update post error:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      setError('Failed to delete post');
      console.error('Delete post error:', err);
    }
  };

  if (loading && posts.length === 0) {
    return <div className="text-center py-12">Loading wall...</div>;
  }
  
  if (error && posts.length === 0) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {wallUser && (
        <UserInfo 
          user={wallUser} 
          isOwnProfile={isViewingOwnWall} 
          postCount={posts.length} 
          onEditProfile={isViewingOwnWall ? () => setShowEditProfile(true) : null} // Pass the function here
        />
      )}

      {isViewingOwnWall && <PostForm onSubmit={handleCreatePost} />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isViewingOwnWall ? 'Your Posts' : `${wallUser?.username}'s Posts`}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({posts.length})
            </span>
          </h2>
        </div>
        <div className="p-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {isViewingOwnWall ? "You haven't posted anything yet." : 'No posts yet.'}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <Post
                  key={post.id}
                  post={post}
                  isOwnPost={post.author?.id === loggedInUser?.id}
                  onUpdate={handleUpdatePost}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}

          {hasMore && posts.length > 0 && (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="mt-6 w-full bg-gray-100 hover:bg-gray-200 py-2 rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
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