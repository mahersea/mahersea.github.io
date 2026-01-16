import { Link } from 'react-router-dom';

const PlaylistCard = ({ playlist }) => {
  const trackCount = parseInt(playlist.track_count || 0);
  const isPublic = playlist.is_public;

  return (
    <Link to={`/playlists/${playlist.id}`} className="block group">
      <div className="card p-6 h-full hover:shadow-xl transition-all hover:scale-105 transform duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-primary-900 line-clamp-2 group-hover:text-primary-700 transition-colors">
            {playlist.name}
          </h3>
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              isPublic
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {isPublic ? 'Public' : 'Private'}
          </span>
        </div>

        {/* Description */}
        {playlist.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {playlist.description}
          </p>
        )}

        {/* Track Count */}
        <div className="flex items-center text-sm text-gray-500 mt-auto">
          <svg
            className="w-4 h-4 mr-1"
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
          <span>
            {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
          </span>
        </div>

        {/* Creator (for public playlists) */}
        {playlist.username && (
          <div className="text-xs text-gray-500 mt-2">
            by {playlist.username}
          </div>
        )}

        {/* Updated At */}
        <div className="text-xs text-gray-400 mt-2">
          Updated {new Date(playlist.updated_at).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard;
