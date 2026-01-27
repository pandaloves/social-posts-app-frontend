import { createContext, useContext, useState } from 'react';

const PostContext = createContext();
export const usePosts = () => useContext(PostContext);

export default function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);

  const addPost = (post) => setPosts([post, ...posts]);
  const updatePostById = (id, updatedFields) =>
    setPosts(posts.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  const deletePostById = (id) =>
    setPosts(posts.filter(p => p.id !== id));
  const setAllPosts = (newPosts) => setPosts(newPosts);

  return (
    <PostContext.Provider value={{
      posts,
      setAllPosts,
      addPost,
      updatePostById,
      deletePostById
    }}>
      {children}
    </PostContext.Provider>
  );
}
