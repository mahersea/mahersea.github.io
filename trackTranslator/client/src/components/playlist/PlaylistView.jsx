import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import playlistService from '../../services/playlistService';
import PlatformBadge from '../track/PlatformBadge';
import ShareButton from '../common/ShareButton';

const PlaylistView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingTrackId, setRemovingTrackId] = useState(null);

  useEffect(() => {
    loadPlaylist();
  }, [id]);

  const loadPlaylist = async () => {
    try {
      setLoading(true);
      const data = await playlistService.getPlaylist(id);
      setPlaylist(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTrack = async (trackId) => {
    if (!window.confirm('Remove this track from the playlist?')) {
      return;
    }

    try {
      setRemovingTrackId(trackId);
      await playlistService.removeTrackFromPlaylist(id, trackId);
      // Reload playlist to update track list
      await loadPlaylist();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove track');
    } finally {
      setRemovingTrackId(null);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm('Are you sure you want to delete this playlist? This cannot be undone.')) {
      return;
    }

    try {
      await playlistService.deletePlaylist(id);
      navigate('/my-playlists');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete playlist');
    }
  };

  const isOwner = user && playlist && user.id === playlist.user_id;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom mt-12 pb-16">
        <div className="card p-8 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300 text-lg font-medium">{error}</p>
        </div>
        <Link to="/my-playlists" className="text-primary-600 dark:text-primary-400 hover:underline mt-4 inline-block">
          Back to My Playlists
        </Link>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="container-custom mt-12 pb-16">
        <div className="card p-8">
          <p className="text-gray-600 dark:text-gray-300">Playlist not found</p>
        </div>
        <Link to="/" className="text-primary-600 dark:text-primary-400 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom mt-12 pb-16">
      {/* Header */}
      <div className="card p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary-900 dark:text-primary-300 mb-3">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-3">{playlist.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                {playlist.tracks?.length || 0} tracks
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  playlist.is_public
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {playlist.is_public ? 'Public' : 'Private'}
              </span>
              {playlist.username && <span>by {playlist.username}</span>}
            </div>
          </div>
          <div className="flex gap-3">
            {playlist.is_public && (
              <ShareButton
                url={`/playlists/${id}`}
                title={`Check out "${playlist.name}" on TrackTranslator`}
              />
            )}
            {isOwner && (
              <>
                <button
                  onClick={() => navigate(`/playlists/${id}/edit`)}
                  className="btn-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeletePlaylist}
                  className="px-6 py-2.5 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tracks List */}
      {playlist.tracks && playlist.tracks.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-300 mb-4">Tracks</h2>
          {playlist.tracks.map((track, index) => (
            <div
              key={track.id}
              className="card p-5 flex items-center gap-4 hover:shadow-xl transition-shadow"
            >
              {/* Position Number */}
              <div className="text-gray-500 dark:text-gray-400 font-medium w-8 text-center">
                {index + 1}
              </div>

              {/* Album Art */}
              {track.metadata?.thumbnailUrl && (
                <img
                  src={track.metadata.thumbnailUrl}
                  alt={`${track.title} artwork`}
                  className="w-16 h-16 rounded object-cover"
                />
              )}

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{track.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{track.artist}</p>
                {track.album && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{track.album}</p>
                )}
              </div>

              {/* Platform Links */}
              <div className="hidden md:flex gap-2">
                {track.metadata?.platformLinks?.slice(0, 3).map((link) => (
                  <PlatformBadge
                    key={link.platform}
                    platform={link.platform}
                    platformName={link.platformName}
                    url={link.url}
                    compact={true}
                  />
                ))}
              </div>

              {/* Remove Button (only for owner) */}
              {isOwner && (
                <button
                  onClick={() => handleRemoveTrack(track.id)}
                  disabled={removingTrackId === track.id}
                  className="px-4 py-2 text-sm text-accent-600 hover:bg-accent-50 rounded-lg transition-colors disabled:opacity-50 font-medium"
                  title="Remove from playlist"
                >
                  {removingTrackId === track.id ? 'Removing...' : 'Remove'}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">This playlist is empty</p>
          {isOwner && (
            <Link
              to="/"
              className="btn-primary inline-block"
            >
              Find Music to Add
            </Link>
          )}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8">
        <Link
          to={isOwner ? '/my-playlists' : '/'}
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          {isOwner ? 'Back to My Playlists' : 'Back to Home'}
        </Link>
      </div>
    </div>
  );
};

export default PlaylistView;
