import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PlatformBadge from './PlatformBadge';
import AddToPlaylist from '../playlist/AddToPlaylist';
import ShareButton from '../common/ShareButton';

const TrackCard = ({ track, platforms, sourcePlatform }) => {
  const { user, isAuthenticated } = useAuth();
  const preferredPlatform = user?.preferredPlatform || 'spotify';
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  return (
    <div className="card p-8">
      <div className="flex gap-6">
        {/* Album Art */}
        {track.thumbnailUrl && (
          <div className="flex-shrink-0">
            <img
              src={track.thumbnailUrl}
              alt={`${track.title} artwork`}
              className="w-40 h-40 rounded-xl object-cover shadow-lg"
            />
          </div>
        )}

        {/* Track Info */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-primary-900 dark:text-primary-300 mb-2">{track.title}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-3 font-medium">{track.artist}</p>
          {track.album && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">{track.album}</p>
          )}

          {sourcePlatform && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Source: <span className="font-bold capitalize text-primary-700 dark:text-primary-400">{sourcePlatform.replace('_', ' ')}</span>
            </p>
          )}
        </div>
      </div>

      {/* Platform Links */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
          🎧 Listen on:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {platforms.map((platform) => (
            <PlatformBadge
              key={platform.platform}
              platform={platform.platform}
              platformName={platform.platformName}
              url={platform.url}
              isPreferred={platform.platform === preferredPlatform}
            />
          ))}
        </div>

        {platforms.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No platform links available
          </p>
        )}
      </div>

      {/* Platform availability count */}
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Available on {platforms.length} platform{platforms.length !== 1 ? 's' : ''}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3 justify-center flex-wrap">
        {track.id && (
          <ShareButton
            url={`/tracks/${track.id}`}
            title={`Check out "${track.title}" by ${track.artist} on TrackPort`}
          />
        )}
        {isAuthenticated && (
          <button
            onClick={() => setShowAddToPlaylist(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg transition-colors shadow-sm"
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
            Add to Playlist
          </button>
        )}
      </div>

      {/* Add to Playlist Modal */}
      {showAddToPlaylist && (
        <AddToPlaylist
          track={track}
          onClose={() => setShowAddToPlaylist(false)}
          onSuccess={() => {
            // Could add a success toast here
            console.log('Track added to playlist successfully');
          }}
        />
      )}
    </div>
  );
};

export default TrackCard;
