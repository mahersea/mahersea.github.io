import api from './api';

export const trackService = {
  // Process a music link
  processLink: async (url) => {
    const response = await api.post('/tracks/process', { url });
    return response.data;
  },

  // Get track by ID
  getTrack: async (id) => {
    const response = await api.get(`/tracks/${id}`);
    return response.data;
  },

  // Search tracks
  searchTracks: async (query) => {
    const response = await api.get('/tracks/search', {
      params: { q: query },
    });
    return response.data;
  },
};

export default trackService;
