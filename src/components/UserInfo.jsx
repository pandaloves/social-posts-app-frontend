import { useState } from 'react';
import UserProfileEdit from './UserProfileEdit';
import { FaEdit } from 'react-icons/fa';

export default function UserInfo({ user, isOwnProfile, postCount }) {
  const [isEditing, setIsEditing] = useState(false);

  // ... rest of the component ...

  if (isEditing) {
    return (
      <UserProfileEdit
        user={user}
        onSave={(updatedData) => {
          // Update user context or refresh data
          setIsEditing(false);
          window.location.reload(); // Or use a better state management
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // In the existing JSX, update the edit button:
  {isOwnProfile && (
    <button 
      onClick={() => setIsEditing(true)}
      className="absolute top-4 right-4 px-4 py-2 bg-white/90 text-gray-700 rounded-lg hover:bg-white transition flex items-center"
    >
      <FaEdit className="mr-2" />
      Edit Profile
    </button>
  )}
}