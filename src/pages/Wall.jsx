import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import UserInfo from '../components/UserInfo';
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

  const currentWallUserId = isOwnWall ? loggedInUser?.id : userId;
  const isViewingOwnWall = isOwnWall || currentWallUserId === loggedInUser?.id;

  useEffect(() => {
    if (currentWallUserId) loadWallData();
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
      user: p.user || p.author,
    }));

    // Sort newest first
    const sortedPosts = normalizedPosts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setAllPosts(sortedPosts); // update PostContext
  } catch (err) {
    console.error('Error loading wall:', err);
    setError('Failed to load wall data. Please try again.');
  } finally {
    setLoading(false);
  }
};


const handleCreatePost = async (postData) => {
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

  if (loading) return <div className="text-center py-12">Loading wall...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {wallUser && <UserInfo user={wallUser} isOwnProfile={isViewingOwnWall} postCount={posts.length} />}

      {isViewingOwnWall && (
        <div className="mb-8">
          <PostForm onSubmit={(postData) => handleCreatePost(postData)} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isViewingOwnWall ? 'Your Posts' : `${wallUser?.username}'s Posts`}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({posts.length} {posts.length === 1 ? 'post' : 'posts'})
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
                  isOwnPost={post.user?.id === loggedInUser?.id}
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
