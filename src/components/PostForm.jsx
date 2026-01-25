import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaPaperPlane, FaUser } from 'react-icons/fa';

export default function PostForm({ onSubmit, initialContent = '', onCancel }) {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
 const { user } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!content.trim()) {
    alert('Please write something before posting');
    return;
  }

  setIsSubmitting(true);
  try {
    if (!user?.id) throw new Error('User ID not found');
    await onSubmit(user.id, { text: content });
    console.log("user", user);
    setContent('');
    if (onCancel) onCancel();
  } catch (error) {
    console.error('Error creating post:', error);
    alert('Failed to create post');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {user?.username?.charAt(0).toUpperCase() || <FaUser />}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="mb-4">
            <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-2">
              What's on your mind, {user?.username || 'User'}?
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          {/* Character Counter */}
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm ${content.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
              {content.length}/500 characters
            </span>
            {content.length > 500 && (
              <span className="text-sm text-red-500">
                Character limit exceeded
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !content.trim() || content.length > 500}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>{initialContent ? 'Update Post' : 'Post'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}