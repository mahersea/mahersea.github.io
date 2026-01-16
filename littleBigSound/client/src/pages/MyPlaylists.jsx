import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import playlistService from '../services/playlistService';
import PlaylistCard from '../components/playlist/PlaylistCard';

const MyPlaylists = () => {
  const { isAuthenticated } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadPlaylists();
    }
  }, [isAuthenticated]);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const data = await playlistService.getUserPlaylists();
      setPlaylists(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded">
          <p className="font-medium">Please log in to view your playlists</p>
          <Link to="/login" className="text-blue-600 hover:underline mt-2 inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom mt-12 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold text-primary-900">My Playlists</h1>
        <Link
          to="/playlists/new"
          className="btn-primary flex items-center gap-2 text-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Playlist
        </Link>
      </div>

      {/* Playlists Grid */}
      {playlists.length === 0 ? (
        <div className="card p-16 text-center">
          <svg
            className="w-20 h-20 mx-auto text-primary-300 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <h2 className="text-2xl font-bold text-primary-900 mb-3">
            You don't have any playlists yet
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Create your first playlist to start organizing your favorite music
          </p>
          <Link
            to="/playlists/new"
            className="btn-primary text-lg inline-block"
          >
            Create Your First Playlist
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}

      {/* Quick Link to Home */}
      <div className="mt-12 text-center">
        <Link to="/" className="text-blue-600 hover:underline">
          Search for music to add to your playlists
        </Link>
      </div>
    </div>
  );
};

export default MyPlaylists;
