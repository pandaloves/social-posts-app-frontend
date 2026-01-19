import { FaUser, FaCalendar, FaEdit, FaUsers, FaUserFriends, FaArrowRight } from 'react-icons/fa';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchFriends } from '../services/api';

export default function UserInfo({ user, isOwnProfile, postCount, onEditProfile }) { // Added onEditProfile prop
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [showAllFriends, setShowAllFriends] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadFriends();
    }
  }, [user?.id]);

  const loadFriends = async () => {
    try {
      setLoadingFriends(true);
      const friendsData = await fetchFriends(user.id);
      setFriends(friendsData);
    } catch (err) {
      console.error('Failed to load friends:', err);
    } finally {
      setLoadingFriends(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM yyyy');
    } catch {
      return dateString;
    }
  };

  const displayFriends = showAllFriends ? friends : friends.slice(0, 6);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-6">
      {/* Cover */}
      <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 relative">
        {isOwnProfile && onEditProfile && ( 
          <button 
            onClick={onEditProfile} 
            className="absolute top-4 right-4 px-4 py-2 bg-white/90 text-gray-700 rounded-lg hover:bg-white transition flex items-center shadow-sm"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-8 pb-6 pt-0 mt-24">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between -mt-20">
          {/* Left side: Profile details */}
          <div className="flex-1">
            {/* Profile header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {user?.username}
                </h1>
                <p className="text-gray-600">
                  @{user?.username.toLowerCase()}
                </p>
              </div>

              {!isOwnProfile && (
                <button className="mt-4 md:mt-0 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium shadow-sm">
                  Follow
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <FaUser className="text-blue-600" />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-gray-900">{postCount}</span>
                  <span className="text-gray-600 text-sm">Posts</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg mr-3">
                  <FaUsers className="text-green-600" />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-gray-900">
                    {loadingFriends ? '...' : friends.length}
                  </span>
                  <span className="text-gray-600 text-sm">Friends</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-lg mr-3">
                  <FaCalendar className="text-purple-600" />
                </div>
                <div>
                  <span className="block text-lg font-semibold text-gray-900">
                    {formatDate(user?.createdAt)}
                  </span>
                  <span className="text-gray-600 text-sm">Joined</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {user?.bio && (
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {user.bio}
                </p>
              </div>
            )}
          </div>

          {/* Right side: Friends section (on desktop) */}
          <div className="hidden lg:block w-80 ml-8">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <FaUserFriends className="mr-2 text-blue-500" />
                  Friends ({loadingFriends ? '...' : friends.length})
                </h3>
              </div>

              {loadingFriends ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-500">Loading friends...</p>
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaUserFriends className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-500">
                    {isOwnProfile ? "You don't have any friends yet" : "No friends yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayFriends.map(friend => (
                    <Link
                      key={friend.id}
                      to={`/wall/${friend.id}`}
                      className="flex items-center p-3 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-gray-200"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="font-semibold text-blue-600">
                          {friend.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {friend.username}
                        </p>
                        {friend.bio && (
                          <p className="text-xs text-gray-500 truncate">
                            {friend.bio}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}

                  {friends.length > 6 && !showAllFriends && (
                    <button
                      onClick={() => setShowAllFriends(true)}
                      className="w-full py-2 text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Show all friends ({friends.length - 6} more)
                    </button>
                  )}

                  {showAllFriends && friends.length > 6 && (
                    <button
                      onClick={() => setShowAllFriends(false)}
                      className="w-full py-2 text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Show less
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Friends Section */}
        <div className="lg:hidden mt-8">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <FaUserFriends className="mr-2 text-blue-500" />
                Friends ({loadingFriends ? '...' : friends.length})
              </h3>
              {friends.length > 0 && (
                <Link 
                  to={`/friends/${user.id}`}
                  className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
                >
                  View all
                </Link>
              )}
            </div>

            {loadingFriends ? (
              <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-sm text-gray-500">Loading friends...</p>
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaUserFriends className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  {isOwnProfile ? "You don't have any friends yet" : "No friends yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {displayFriends.map(friend => (
                  <Link
                    key={friend.id}
                    to={`/wall/${friend.id}`}
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-gray-200 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-2">
                      <span className="font-semibold text-blue-600">
                        {friend.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 text-sm truncate w-full">
                      {friend.username}
                    </p>
                  </Link>
                ))}

                {friends.length > 6 && !showAllFriends && (
                  <button
                    onClick={() => setShowAllFriends(true)}
                    className="col-span-2 py-3 text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-gray-300"
                  >
                    Show all friends ({friends.length - 6} more)
                  </button>
                )}

                {showAllFriends && friends.length > 6 && (
                  <button
                    onClick={() => setShowAllFriends(false)}
                    className="col-span-2 py-3 text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-gray-300"
                  >
                    Show less
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}