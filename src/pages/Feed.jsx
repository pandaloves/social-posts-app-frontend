import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import Post from '../components/Post';
import { FaRss, FaUsers, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { fetchFeedPosts, updatePost, deletePost } from '../services/api';

export default function Feed() {
  const { user } = useAuth();
  const { posts, setAllPosts, updatePostById, deletePostById } = usePosts();
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

      const data = await fetchFeedPosts();
      const postsArray = data.content || [];

      // Ensure frontend post has `user` property for ownership
      const normalizedPosts = postsArray.map(p => ({
        ...p,
        user: p.user || p.author,
      }));

      const sortedPosts = normalizedPosts.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setAllPosts(sortedPosts);
    } catch (err) {
      console.error('Error loading feed:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (postId, text) => {
    await updatePost(postId, { text });
    updatePostById(postId, { text, updatedAt: new Date().toISOString() });
  };

  const handleDelete = async (postId) => {
    await deletePost(postId);
    deletePostById(postId);
  };

  if (loading) return <div className="text-center py-12">Loading feed...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaRss className="text-3xl text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">Your Feed</h1>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <FaUsers className="mr-2" />
          <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No posts yet.
          <Link to="/my-wall" className="ml-2 text-blue-500 hover:underline">Create one</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <Post
              key={post.id}
              post={post}
              isOwnPost={post.user?.id === user?.id}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}