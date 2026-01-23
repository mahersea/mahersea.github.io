import express from 'express';
import {
  createPlaylist,
  getUserPlaylists,
  getPublicPlaylists,
  getPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  moveTrackInPlaylist,
} from '../controllers/playlistController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicPlaylists); // Get public playlists for discovery
router.get('/:id', optionalAuth, getPlaylist); // View single playlist (optionalAuth for private check)

// Protected routes (require authentication)
router.post('/', authMiddleware, createPlaylist); // Create playlist
router.get('/', authMiddleware, getUserPlaylists); // Get user's playlists
router.put('/:id', authMiddleware, updatePlaylist); // Update playlist
router.delete('/:id', authMiddleware, deletePlaylist); // Delete playlist

// Track management (protected)
router.post('/:id/tracks', authMiddleware, addTrackToPlaylist); // Add track to playlist
router.delete('/:id/tracks/:trackId', authMiddleware, removeTrackFromPlaylist); // Remove track
router.patch('/:id/tracks/:trackId/move', authMiddleware, moveTrackInPlaylist); // Move track position

export default router;
