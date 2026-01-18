import { FaUser, FaCalendar, FaEdit } from 'react-icons/fa';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function UserInfo({ user, isOwnProfile, postCount }) {

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">

      {/* Cover */}
      <div className="h-20 bg-gradient-to-r from-blue-400 to-purple-500 relative">
        {isOwnProfile && (
          <button className="absolute top-4 right-4 px-4 py-2 bg-white/90 text-gray-700 rounded-lg hover:bg-white transition flex items-center">
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-8 pb-8 pt-0 mt-20">

        <div className="flex flex-col md:flex-row md:items-end -mt-16 md:-mt-20">

          <div className="flex-1">

            {/* Username */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">

              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {user?.username}
                </h1>

                <p className="text-gray-600">
                  @{user?.username}
                </p>
              </div>

              {!isOwnProfile && (
                <button className="mt-4 md:mt-0 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
                  Follow
                </button>
              )}

            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-6">

              <div className="flex items-center">
                <FaUser className="mr-2 text-gray-400" />
                <span className="font-semibold">{postCount}</span>
                <span className="ml-1 text-gray-600">posts</span>
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-center text-gray-600">
              <FaCalendar className="mr-2" />
              <span>Joined {formatDate(user?.createdAt)}</span>
            </div>

            {/* Bio */}
            {user?.bio && (
              <div className="mt-4">
                <p className="text-gray-700 leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
