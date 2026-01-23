import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import trackService from '../services/trackService';
import TrackCard from '../components/track/TrackCard';
import ShareButton from '../components/common/ShareButton';

const TrackView = () => {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrack();
  }, [id]);

  const loadTrack = async () => {
    try {
      setLoading(true);
      const data = await trackService.getTrack(id);
      setTrack(data.track);
      setPlatforms(data.platforms || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load track');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom mt-12 pb-16">
        <div className="card p-8 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300 text-lg font-medium">{error}</p>
        </div>
        <Link to="/" className="text-primary-600 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="container-custom mt-12 pb-16">
        <div className="card p-8">
          <p className="text-gray-600 dark:text-gray-300">Track not found</p>
        </div>
        <Link to="/" className="text-primary-600 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom mt-12 pb-16">
      {/* Share Button at Top */}
      <div className="mb-6 flex justify-end">
        <ShareButton
          url={`/tracks/${id}`}
          title={`Check out "${track.title}" by ${track.artist} on TrackTranslator`}
        />
      </div>

      {/* Track Card */}
      <TrackCard
        track={track}
        platforms={platforms}
        sourcePlatform={track.sourcePlatform}
      />

      {/* Back Button */}
      <div className="mt-8">
        <Link
          to="/"
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TrackView;
