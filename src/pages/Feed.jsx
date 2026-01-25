import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import { FaRss, FaUsers, FaSpinner } from 'react-icons/fa';
import { fetchFeedPosts, createPost, updatePost, deletePost, postService} from '../services/api';

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 5;

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchFeedPosts(page, pageSize);
      const postsArray = response.content || [];

      if (page === 0) {
        setPosts(postsArray);
      } else {
        setPosts(prev => [...prev, ...postsArray]);
      }

      setTotalPages(response.totalPages);
      setHasMore(page < response.totalPages - 1);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (postId, content) => {
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

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
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

  const refreshPosts = () => {
    setPage(0);
  };

  if (loading && page === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <FaSpinner className="animate-spin text-3xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Feed</h1>
          <button
            onClick={refreshPosts}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            disabled={loading}
          >
            Refresh
          </button>
        </div>

      <PostForm onSubmit={createPost} />


        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            <FaUsers className="inline mr-2" />
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <FaRss className="text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No posts yet. Be the first to share something!</p>
          <p className="text-sm text-gray-400">Follow other users to see their posts here</p>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {posts.map(post => (
              <Post
                key={post.id}
                post={post}
                isOwnPost={post.author?.id === user?.id}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all duration-200 font-medium"
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

          {!hasMore && posts.length > 0 && (
            <div className="text-center text-gray-500 py-4">
              You've reached the end of the feed
            </div>
          )}
        </>
      )}
    </div>
  );
}