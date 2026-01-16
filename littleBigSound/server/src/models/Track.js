import pool from '../config/database.js';

class Track {
  /**
   * Create a new track
   * @param {Object} trackData - Track information
   * @returns {Promise<Object>} - Created track
   */
  static async create({ title, artist, album, isrc, duration_ms, metadata }) {
    const query = `
      INSERT INTO tracks (title, artist, album, isrc, duration_ms, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      title,
      artist,
      album || null,
      isrc || null,
      duration_ms || null,
      metadata ? JSON.stringify(metadata) : null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find track by ID
   * @param {number} id - Track ID
   * @returns {Promise<Object|null>} - Track or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM tracks WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find track by ISRC code
   * @param {string} isrc - ISRC code
   * @returns {Promise<Object|null>} - Track or null
   */
  static async findByIsrc(isrc) {
    if (!isrc) return null;

    const query = 'SELECT * FROM tracks WHERE isrc = $1';
    const result = await pool.query(query, [isrc]);
    return result.rows[0] || null;
  }

  /**
   * Search tracks by title and artist
   * @param {string} title - Track title
   * @param {string} artist - Artist name
   * @returns {Promise<Array>} - Array of matching tracks
   */
  static async searchByTitleAndArtist(title, artist) {
    const query = `
      SELECT * FROM tracks
      WHERE
        LOWER(title) = LOWER($1) AND
        LOWER(artist) = LOWER($2)
      LIMIT 5
    `;

    const result = await pool.query(query, [title, artist]);
    return result.rows;
  }

  /**
   * Get track with all platform links
   * @param {number} trackId - Track ID
   * @returns {Promise<Object|null>} - Track with platforms array
   */
  static async findByIdWithPlatforms(trackId) {
    const trackQuery = 'SELECT * FROM tracks WHERE id = $1';
    const platformsQuery = 'SELECT * FROM platform_links WHERE track_id = $1 ORDER BY platform';

    const [trackResult, platformsResult] = await Promise.all([
      pool.query(trackQuery, [trackId]),
      pool.query(platformsQuery, [trackId]),
    ]);

    if (trackResult.rows.length === 0) {
      return null;
    }

    const track = trackResult.rows[0];
    track.platforms = platformsResult.rows;

    return track;
  }

  /**
   * Update track metadata
   * @param {number} id - Track ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated track
   */
  static async update(id, updates) {
    const allowedFields = ['title', 'artist', 'album', 'isrc', 'duration_ms', 'metadata'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(key === 'metadata' ? JSON.stringify(value) : value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE tracks
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete track
   * @param {number} id - Track ID
   * @returns {Promise<boolean>} - Success status
   */
  static async delete(id) {
    const query = 'DELETE FROM tracks WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }
}

export default Track;
