import { useState } from 'react';
import trackService from '../../services/trackService';
import TrackCard from '../track/TrackCard';

const LinkInput = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const data = await trackService.processLink(url);
      setResult(data);
      setUrl(''); // Clear input after success
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setError('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Input Form */}
      <div className="card p-8 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-primary-900">Paste a Music Link</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg transition-colors"
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">
              Supports: Spotify, Apple Music, YouTube, SoundCloud, and more
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !url}
              className="flex-1 btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Finding matches...' : 'Find on All Platforms'}
            </button>

            {(url || result) && (
              <button
                type="button"
                onClick={handleClear}
                className="btn-secondary py-3"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Example Links */}
        {!result && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Try these examples:</p>
            <div className="space-y-2">
              <button
                onClick={() => setUrl('https://open.spotify.com/track/5N0qx4UmFQdl6pSbIRNoSy?si=-T2tHe0xTUusz8FG-oZ4Og')}
                className="block text-sm text-primary-600 hover:text-primary-700 hover:underline text-left font-medium"
              >
                🎵 Spotify: Deadman - KUN
              </button>
              <button
                onClick={() => setUrl('https://www.youtube.com/watch?v=LCNZ-GLhN4o')}
                className="block text-sm text-primary-600 hover:text-primary-700 hover:underline text-left font-medium"
              >
                🎵 YouTube: Cowards Way Out - The Desert Sessions
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-lg text-gray-700 font-medium">Searching across platforms...</span>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Results:</h3>
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Search again
            </button>
          </div>
          <TrackCard
            track={result.track}
            platforms={result.platforms}
            sourcePlatform={result.sourcePlatform}
          />
        </div>
      )}
    </div>
  );
};

export default LinkInput;
