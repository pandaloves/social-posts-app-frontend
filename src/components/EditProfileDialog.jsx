import { useState } from 'react';

export default function EditProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    bio: user.bio || '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...formData };

    // Do not send empty password
    if (!payload.password) {
      delete payload.password;
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">

        <h2 className="text-xl font-semibold mb-4">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border rounded p-2"
            required
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded p-2"
            required
          />

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="w-full border rounded p-2"
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New password (optional)"
            className="w-full border rounded p-2"
          />

          <div className="flex justify-end gap-2 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>

          </div>
        </form>

      </div>
    </div>
  );
}
