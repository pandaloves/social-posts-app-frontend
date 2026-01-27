import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

export default function Post({ post, isOwnPost, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.text);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    try {
      await onUpdate(post.id, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await onDelete(post.id);
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {post.user?.username?.charAt(0).toUpperCase() || <FaUser />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">
                {post.user?.username || 'Unknown User'}
              </h3>
              {isOwnPost && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  You
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {formatDate(post.createdAt)}
              {post.updatedAt !== post.createdAt && ' · Edited'}
            </p>
          </div>
        </div>

        {isOwnPost && !isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Edit post"
            >
              <FaEdit />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              title="Delete post"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : <FaTrash />}
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows="3"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedContent(post.text);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={editedContent.trim() === '' || editedContent === post.text}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <FaCheck />
              <span>Save</span>
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {post.text}
        </p>
      )}

    </div>
  );
}