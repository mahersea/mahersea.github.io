import api from './api';

/**
 * Frontend service for playlist API calls
 */
export const playlistService = {
  /**
   * Create a new playlist
   * @param {Object} playlistData - { name, description, is_public }
   * @returns {Promise<Object>} Created playlist
   */
  createPlaylist: async (playlistData) => {
    const response = await api.post('/playlists', playlistData);
    return response.data;
  },

  /**
   * Get all playlists for the authenticated user
   * @returns {Promise<Array>} User's playlists with track counts
   */
  getUserPlaylists: async () => {
    const response = await api.get('/playlists');
    return response.data;
  },

  /**
   * Get public playlists for discovery
   * @param {number} limit - Number of playlists to fetch
   * @returns {Promise<Array>} Public playlists
   */
  getPublicPlaylists: async (limit = 20) => {
    const response = await api.get(`/playlists/public?limit=${limit}`);
    return response.data;
  },

  /**
   * Get single playlist with all tracks
   * @param {number} playlistId - Playlist ID
   * @returns {Promise<Object>} Playlist with tracks array
   */
  getPlaylist: async (playlistId) => {
    const response = await api.get(`/playlists/${playlistId}`);
    return response.data;
  },

  /**
   * Update playlist
   * @param {number} playlistId - Playlist ID
   * @param {Object} updates - { name, description, is_public }
   * @returns {Promise<Object>} Updated playlist
   */
  updatePlaylist: async (playlistId, updates) => {
    const response = await api.put(`/playlists/${playlistId}`, updates);
    return response.data;
  },

  /**
   * Delete playlist
   * @param {number} playlistId - Playlist ID
   * @returns {Promise<Object>} Success message
   */
  deletePlaylist: async (playlistId) => {
    const response = await api.delete(`/playlists/${playlistId}`);
    return response.data;
  },

  /**
   * Add track to playlist
   * @param {number} playlistId - Playlist ID
   * @param {number} trackId - Track ID
   * @returns {Promise<Object>} Created playlist_track
   */
  addTrackToPlaylist: async (playlistId, trackId) => {
    const response = await api.post(`/playlists/${playlistId}/tracks`, { track_id: trackId });
    return response.data;
  },

  /**
   * Remove track from playlist
   * @param {number} playlistId - Playlist ID
   * @param {number} trackId - Track ID
   * @returns {Promise<Object>} Success message
   */
  removeTrackFromPlaylist: async (playlistId, trackId) => {
    const response = await api.delete(`/playlists/${playlistId}/tracks/${trackId}`);
    return response.data;
  },

  /**
   * Move track position in playlist
   * @param {number} playlistId - Playlist ID
   * @param {number} trackId - Track ID
   * @param {number} newPosition - New position (1-based)
   * @returns {Promise<Object>} Updated playlist_track
   */
  moveTrack: async (playlistId, trackId, newPosition) => {
    const response = await api.patch(`/playlists/${playlistId}/tracks/${trackId}/move`, {
      new_position: newPosition,
    });
    return response.data;
  },
};

export default playlistService;
