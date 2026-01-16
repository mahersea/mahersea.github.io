import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import playlistService from '../../services/playlistService';

const PlaylistCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const playlist = await playlistService.createPlaylist(formData);
      // Navigate to the newly created playlist
      navigate(`/playlists/${playlist.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom mt-12 pb-16">
      <div className="card p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-primary-900">Create New Playlist</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Playlist Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Playlist Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={255}
              placeholder="My Awesome Playlist"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Optional description of your playlist..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-colors"
              disabled={loading}
            />
          </div>

          {/* Public/Private Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_public"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
              Make this playlist public (others can discover and view it)
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Playlist'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-playlists')}
              className="btn-secondary py-3"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaylistCreate;
