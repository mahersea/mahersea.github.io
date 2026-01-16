import Playlist from '../models/Playlist.js';
import PlaylistTrack from '../models/PlaylistTrack.js';

/**
 * Create a new playlist
 * POST /api/playlists
 */
export const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, is_public } = req.body;
    const user_id = req.user.id;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Playlist name is required' });
    }

    const playlist = await Playlist.create({
      user_id,
      name: name.trim(),
      description: description?.trim() || null,
      is_public: is_public !== undefined ? is_public : true,
    });

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all playlists for the authenticated user
 * GET /api/playlists
 */
export const getUserPlaylists = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const playlists = await Playlist.findByUserId(user_id);
    res.json(playlists);
  } catch (error) {
    next(error);
  }
};

/**
 * Get public playlists for discovery
 * GET /api/playlists/public
 */
export const getPublicPlaylists = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const playlists = await Playlist.findPublic(limit);
    res.json(playlists);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single playlist with all tracks
 * GET /api/playlists/:id
 */
export const getPlaylist = async (req, res, next) => {
  try {
    const playlistId = parseInt(req.params.id);

    if (isNaN(playlistId)) {
      return res.status(400).json({ error: 'Invalid playlist ID' });
    }

    const playlist = await Playlist.findByIdWithTracks(playlistId);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if playlist is private and user is not the owner
    if (!playlist.is_public && (!req.user || req.user.id !== playlist.user_id)) {
      return res.status(403).json({ error: 'Access denied to private playlist' });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

/**
 * Update playlist
 * PUT /api/playlists/:id
 */
export const updatePlaylist = async (req, res, next) => {
  try {
    const playlistId = parseInt(req.params.id);
    const { name, description, is_public } = req.body;

    if (isNaN(playlistId)) {
      return res.status(400).json({ error: 'Invalid playlist ID' });
    }

    // Check ownership
    const isOwner = await Playlist.isOwner(playlistId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Not authorized to update this playlist' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (is_public !== undefined) updates.is_public = is_public;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updatedPlaylist = await Playlist.update(playlistId, updates);
    res.json(updatedPlaylist);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete playlist
 * DELETE /api/playlists/:id
 */
export const deletePlaylist = async (req, res, next) => {
  try {
    const playlistId = parseInt(req.params.id);

    if (isNaN(playlistId)) {
      return res.status(400).json({ error: 'Invalid playlist ID' });
    }

    // Check ownership
    const isOwner = await Playlist.isOwner(playlistId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Not authorized to delete this playlist' });
    }

    const deleted = await Playlist.delete(playlistId);

    if (!deleted) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Add track to playlist
 * POST /api/playlists/:id/tracks
 */
export const addTrackToPlaylist = async (req, res, next) => {
  try {
    const playlistId = parseInt(req.params.id);
    const { track_id } = req.body;

    if (isNaN(playlistId) || !track_id) {
      return res.status(400).json({ error: 'Invalid playlist ID or track ID' });
    }

    // Check ownership
    const isOwner = await Playlist.isOwner(playlistId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Not authorized to modify this playlist' });
    }

    // Check if already in playlist
    const alreadyExists = await PlaylistTrack.isInPlaylist(playlistId, track_id);
    if (alreadyExists) {
      return res.status(409).json({ error: 'Track already in playlist' });
    }

    const playlistTrack = await PlaylistTrack.add(playlistId, track_id);

    if (!playlistTrack) {
      return res.status(409).json({ error: 'Track already exists in playlist' });
    }

    res.status(201).json(playlistTrack);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove track from playlist
 * DELETE /api/playlists/:id/tracks/:trackId
 */
export const removeTrackFromPlaylist = async (req, res, next) => {
  try {
    const playlistId = parseInt(req.params.id);
    const trackId = parseInt(req.params.trackId);

    if (isNaN(playlistId) || isNaN(trackId)) {
      return res.status(400).json({ error: 'Invalid playlist ID or track ID' });
    }

    // Check ownership
    const isOwner = await Playlist.isOwner(playlistId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Not authorized to modify this playlist' });
    }

    const removed = await PlaylistTrack.remove(playlistId, trackId);

    if (!removed) {
      return res.status(404).json({ error: 'Track not found in playlist' });
    }

    res.json({ message: 'Track removed from playlist' });
  } catch (error) {
    next(error);
  }
};

/**
 * Move track position in playlist
 * PATCH /api/playlists/:id/tracks/:trackId/move
 */
export const moveTrackInPlaylist = async (req, res, next) => {
  try {
    const playlistId = parseInt(req.params.id);
    const trackId = parseInt(req.params.trackId);
    const { new_position } = req.body;

    if (isNaN(playlistId) || isNaN(trackId) || !new_position) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    // Check ownership
    const isOwner = await Playlist.isOwner(playlistId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ error: 'Not authorized to modify this playlist' });
    }

    const updatedTrack = await PlaylistTrack.moveTrack(playlistId, trackId, new_position);
    res.json(updatedTrack);
  } catch (error) {
    if (error.message === 'Track not found in playlist') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};
