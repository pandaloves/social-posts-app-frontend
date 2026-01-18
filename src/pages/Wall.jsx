import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import UserInfo from '../components/UserInfo';
import { fetchUserPosts, fetchUserProfile, createPost, updatePost, deletePost } from '../services/api';

export default function Wall({ isOwnWall = false }) {
  const { userId } = useParams();
  const { user: loggedInUser } = useAuth();

  const [wallUser, setWallUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentWallUserId = isOwnWall ? loggedInUser?.id : Number(userId);
  const isViewingOwnWall = isOwnWall || currentWallUserId === loggedInUser?.id;

  useEffect(() => {
    if (currentWallUserId) loadWallData();
  }, [currentWallUserId]);

  const loadWallData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await fetchUserProfile(currentWallUserId);
      setWallUser(userData);

      const postsData = await fetchUserPosts(currentWallUserId);
      const sortedPosts = postsData.posts?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
      setPosts(sortedPosts);
    } catch (err) {
      setError('Failed to load wall data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (content) => {
    const newPost = await createPost({ content });
    setPosts([newPost, ...posts]);
  };

  const handleUpdatePost = async (postId, content) => {
    await updatePost(postId, { content });
    setPosts(posts.map(post => post.id === postId ? { ...post, content } : post));
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
    setPosts(posts.filter(post => post.id !== postId));
  };

  if (loading) return <div className="text-center py-12">Loading wall...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {wallUser && (
        <UserInfo user={wallUser} isOwnProfile={isViewingOwnWall} postCount={posts.length} />
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
        </div>
      </div>
    </div>
  );
}
