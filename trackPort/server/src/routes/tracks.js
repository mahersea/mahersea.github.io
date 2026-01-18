import express from 'express';
import { processLink, getTrack, searchTracks } from '../controllers/trackController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Process a music link (public, but tracks user if authenticated)
router.post('/process', optionalAuth, processLink);

// Get track by ID (public)
router.get('/:id', getTrack);

// Search tracks (public)
router.get('/search', searchTracks);

export default router;
