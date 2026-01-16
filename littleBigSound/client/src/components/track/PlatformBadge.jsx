const PlatformBadge = ({ platform, platformName, url, isPreferred = false, compact = false }) => {
  const platformColors = {
    spotify: 'bg-green-500 hover:bg-green-600',
    apple_music: 'bg-red-500 hover:bg-red-600',
    youtube: 'bg-red-600 hover:bg-red-700',
    youtube_music: 'bg-red-600 hover:bg-red-700',
    soundcloud: 'bg-orange-500 hover:bg-orange-600',
    tidal: 'bg-black hover:bg-gray-800',
    deezer: 'bg-purple-500 hover:bg-purple-600',
    amazon_music: 'bg-blue-600 hover:bg-blue-700',
    pandora: 'bg-blue-500 hover:bg-blue-600',
  };

  const color = platformColors[platform] || 'bg-gray-500 hover:bg-gray-600';

  const sizeClasses = compact
    ? 'px-2 py-1 text-xs'
    : 'px-4 py-2 font-medium';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${color} ${sizeClasses} text-white rounded-md transition-colors flex items-center gap-2 justify-center`}
    >
      {isPreferred && (
        <span className="text-yellow-300" title="Your preferred platform">
          ⭐
        </span>
      )}
      {platformName}
    </a>
  );
};

export default PlatformBadge;
