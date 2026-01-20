import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import { FaRss, FaUsers } from 'react-icons/fa';
import { updatePost, deletePost, fetchPosts } from '../services/api';

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

    const data = await fetchPosts({
      sort: 'createdAt,desc'
    });

    setPosts(data.content);
  } catch (err) {
    setError('Failed to load posts');
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

  if (loading) return <div className="text-center py-12">Loading posts...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Feed</h1>
        <div className="text-gray-600 text-sm">
          <FaUsers className="inline mr-1" />
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <FaRss className="text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-6">
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
      )}
    </div>
  );
}
