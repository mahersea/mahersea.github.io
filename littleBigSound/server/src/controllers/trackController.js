import odesliService from '../services/odesliService.js';
import linkParser from '../services/linkParser.js';
import Track from '../models/Track.js';
import PlatformLink from '../models/PlatformLink.js';
import pool from '../config/database.js';

/**
 * Process a music link and return cross-platform alternatives
 * POST /api/tracks/process
 */
export const processLink = async (req, res, next) => {
  try {
    const { url } = req.body;

    // Validation
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!linkParser.isValidMusicUrl(url)) {
      return res.status(400).json({
        error: 'Invalid music URL. Please provide a link from Spotify, Apple Music, YouTube, or other supported platforms.'
      });
    }

    // Detect platform
    const sourcePlatform = linkParser.detectPlatform(url);
    console.log(`Processing ${sourcePlatform} link: ${url}`);

    // Get cross-platform links from Odesli
    const odesliData = await odesliService.getLinksForUrl(url);
    const { track: trackData, platforms: platformLinks } = odesliData;

    // Check if track already exists in database (by title + artist)
    let existingTracks = await Track.searchByTitleAndArtist(
      trackData.title,
      trackData.artist
    );

    let track;

    if (existingTracks.length > 0) {
      // Track exists, use the first match
      track = existingTracks[0];
      console.log(`Found existing track: ${track.id}`);

      // Update platform links
      await PlatformLink.createMany(
        platformLinks.map(pl => ({
          track_id: track.id,
          platform: pl.platform,
          platform_id: pl.entityUniqueId || '',
          url: pl.url,
          is_verified: true,
          added_by: req.user ? req.user.id : null,
        }))
      );
    } else {
      // Create new track
      track = await Track.create({
        title: trackData.title,
        artist: trackData.artist,
        album: trackData.album,
        isrc: null, // Odesli doesn't always provide ISRC
        duration_ms: null,
        metadata: {
          thumbnailUrl: trackData.thumbnailUrl,
          apiProvider: trackData.apiProvider,
        },
      });

      console.log(`Created new track: ${track.id}`);

      // Create platform links
      await PlatformLink.createMany(
        platformLinks.map(pl => ({
          track_id: track.id,
          platform: pl.platform,
          platform_id: pl.entityUniqueId || '',
          url: pl.url,
          is_verified: true,
          added_by: req.user ? req.user.id : null,
        }))
      );
    }

    // Fetch track with all platform links
    const trackWithPlatforms = await Track.findByIdWithPlatforms(track.id);

    // Return response
    res.json({
      track: {
        id: trackWithPlatforms.id,
        title: trackWithPlatforms.title,
        artist: trackWithPlatforms.artist,
        album: trackWithPlatforms.album,
        thumbnailUrl: trackWithPlatforms.metadata?.thumbnailUrl,
      },
      platforms: trackWithPlatforms.platforms.map(pl => ({
        platform: pl.platform,
        platformName: linkParser.getPlatformDisplayName(pl.platform),
        url: pl.url,
        verified: pl.is_verified,
      })),
      sourcePlatform,
    });

  } catch (error) {
    console.error('Error processing link:', error);

    if (error.message.includes('Odesli')) {
      return res.status(503).json({
        error: 'Music link service temporarily unavailable. Please try again.',
        details: error.message
      });
    }

    next(error);
  }
};

/**
 * Get track details by ID
 * GET /api/tracks/:id
 */
export const getTrack = async (req, res, next) => {
  try {
    const { id } = req.params;

    const track = await Track.findByIdWithPlatforms(parseInt(id));

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.json({
      track: {
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: track.album,
        thumbnailUrl: track.metadata?.thumbnailUrl,
      },
      platforms: track.platforms.map(pl => ({
        platform: pl.platform,
        platformName: linkParser.getPlatformDisplayName(pl.platform),
        url: pl.url,
        verified: pl.is_verified,
      })),
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Search tracks
 * GET /api/tracks/search?q=query
 */
export const searchTracks = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    // Simple search by title or artist
    // For MVP, we'll do a basic search. Can be enhanced with full-text search later
    const query = `
      SELECT * FROM tracks
      WHERE
        LOWER(title) LIKE LOWER($1) OR
        LOWER(artist) LIKE LOWER($1)
      ORDER BY created_at DESC
      LIMIT 20
    `;

    const searchPattern = `%${q}%`;
    const result = await pool.query(query, [searchPattern]);

    res.json({
      tracks: result.rows.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: track.album,
        thumbnailUrl: track.metadata?.thumbnailUrl,
      })),
    });

  } catch (error) {
    next(error);
  }
};
