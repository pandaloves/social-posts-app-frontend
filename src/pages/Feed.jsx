import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import Post from '../components/Post';
import { FaRss, FaUsers, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { fetchFeedPosts, updatePost, deletePost } from '../services/api';

export default function Feed() {
  const { user } = useAuth();
  const { posts, setAllPosts, updatePostById, deletePostById } = usePosts();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10
  });

  useEffect(() => {
    loadPosts(pagination.currentPage);
  }, []);

  const loadPosts = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchFeedPosts(page, pagination.pageSize);
      const postsArray = data.content || [];
      
      // Update pagination info from response
      if (data.pageable) {
        setPagination({
          currentPage: data.pageable.pageNumber,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
          pageSize: data.pageable.pageSize
        });
      }

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

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      loadPosts(newPage);
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
          <span>
            {pagination.totalElements} {pagination.totalElements === 1 ? 'post' : 'posts'} total
          </span>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No posts yet.
          <Link to="/my-wall" className="ml-2 text-blue-500 hover:underline">Create one</Link>
        </div>
      ) : (
        <>
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

          {/* Pagination Controls */}
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
  );
}