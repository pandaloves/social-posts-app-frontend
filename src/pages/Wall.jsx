import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import UserInfo from '../components/UserInfo';
import { FaSpinner } from 'react-icons/fa';
import { fetchUserProfile, fetchUserPosts, createPost, updatePost, deletePost } from '../services/api';

export default function Wall({ isOwnWall = false }) {
  const { userId } = useParams();
  const { user: loggedInUser } = useAuth();

  const [wallUser, setWallUser] = useState(null);
  const [posts, setPosts] = useState([]);
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

    try {
      setLoading(true);
      setError(null);

      // Load user profile
      const userData = await fetchUserProfile(currentWallUserId);
      setWallUser(userData);

      // Load user posts with pagination
      const response = await fetchUserPosts(currentWallUserId, page, pageSize);
      const newPosts = response.content || [];

      if (page === 0) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(page < response.totalPages - 1);
    } catch (err) {
      setError('Failed to load wall data. Please try again.');
      console.error(err);
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

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);

    try {
      const postsData = await fetchPosts({
        userId: currentWallUserId,
        page: nextPage,
        size: PAGE_SIZE,
        sort: 'createdAt,desc'
      });

      setPosts(prev => [...prev, ...postsData.content]);
      setHasMore(nextPage < postsData.totalPages - 1);

    } catch (err) {
      console.error(err);
      setError('Failed to load more posts');
    }
  };

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
      console.error(err);
      alert('Failed to create post');
    }
  };

  const handleUpdatePost = async (postId, content) => {
    try {
      await updatePost(postId, { content });
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, content, updatedAt: new Date().toISOString() } : post
      ));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);

      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      console.error(err);
      throw err;
    }
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
      {wallUser && (
        <UserInfo 
          user={wallUser} 
          isOwnProfile={isViewingOwnWall} 
          postCount={posts.length} 
        />
      )}

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
            <>
              <div className="space-y-6 mb-8">
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

              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <FaSpinner className="animate-spin mr-2" />
                        Loading more...
                      </span>
                    ) : (
                      'Load More Posts'
                    )}
                  </button>
                </div>
              )}
            </>
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