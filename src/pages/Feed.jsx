import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import { FaRss, FaUsers, FaFilter } from 'react-icons/fa';
import { fetchFeedPosts, updatePost, deletePost } from '../services/api';

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchFeedPosts();
      const postsArray = data.content;

      // Sort by latest
      const sortedPosts = [...postsArray].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPosts(sortedPosts);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Error loading posts:', err);
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
      console.error('Error updating post:', err);
      throw err;
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadPosts}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
            <FaRss className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Feed</h1>
            <p className="text-gray-600 mt-1">Latest posts from everyone</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-sm text-gray-500">
            <FaUsers className="mr-2" />
            <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'} in feed</span>
          </div>
          <button className="flex items-center text-gray-600 hover:text-blue-600">
            <FaFilter className="mr-2" />
            Sort by: Latest
          </button>
        </div>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <FaRss className="text-5xl mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-6">Be the first to share something!</p>
          <a 
            href="/my-wall"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block"
          >
            Create your first post
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              isOwnPost={post.author?.id === user?.id}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
