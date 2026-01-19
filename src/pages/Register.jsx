import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaUserPlus, FaEye, FaEyeSlash, FaPen } from 'react-icons/fa';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        bio: formData.bio,
      };

      const result = await register(userData);

      if (result.success) {
        setSuccess(true);

        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }

    } catch (err) {
      setErrors({ general: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <FaUserPlus className="text-green-600 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Account Created 🎉</h2>
          <p className="text-gray-600 mb-4">Redirecting to login...</p>

          <div className="h-2 bg-gray-200 rounded">
            <div className="h-full bg-green-500 rounded animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full">

        <div className="text-center mb-6">
          <FaUserPlus className="text-blue-600 text-3xl mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-gray-600">Join and start posting</p>
        </div>

        {errors.general && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 border rounded-lg"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 border rounded-lg"
              required
            />
          </div>

          {/* Bio */}
          <div className="relative">
            <FaPen className="absolute left-3 top-4 text-gray-400" />
            <textarea
              name="bio"
              placeholder="Write something about yourself..."
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-3 border rounded-lg resize-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 px-4 py-3 border rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
       <div className="relative">
      <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
      type={showConfirmPassword ? 'text' : 'password'}
      name="confirmPassword"
      placeholder="Confirm password"
      value={formData.confirmPassword}
      onChange={handleChange}
      className="w-full pl-10 pr-10 px-4 py-3 border rounded-lg"
      required
      />
      <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>

      {/* Display error immediately if passwords do not match */}
      {errors.confirmPassword && (
        <div className="text-red-600 text-sm mt-1">
      {errors.confirmPassword}
     </div>
    )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
