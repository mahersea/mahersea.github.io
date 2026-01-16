import pool from '../config/database.js';

class Playlist {
  /**
   * Create a new playlist
   * @param {Object} playlistData - Playlist information
   * @returns {Promise<Object>} - Created playlist
   */
  static async create({ user_id, name, description, is_public = true }) {
    const query = `
      INSERT INTO playlists (user_id, name, description, is_public)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [user_id, name, description || null, is_public];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find playlist by ID
   * @param {number} id - Playlist ID
   * @returns {Promise<Object|null>} - Playlist or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM playlists WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find all playlists for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} - Array of playlists
   */
  static async findByUserId(userId) {
    const query = `
      SELECT
        p.*,
        COUNT(pt.id) as track_count
      FROM playlists p
      LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.updated_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Find public playlists (for discovery)
   * @param {number} limit - Number of playlists to return
   * @returns {Promise<Array>} - Array of public playlists
   */
  static async findPublic(limit = 20) {
    const query = `
      SELECT
        p.*,
        u.username,
        COUNT(pt.id) as track_count
      FROM playlists p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
      WHERE p.is_public = true
      GROUP BY p.id, u.username
      ORDER BY p.created_at DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  /**
   * Get playlist with all tracks
   * @param {number} playlistId - Playlist ID
   * @returns {Promise<Object|null>} - Playlist with tracks array
   */
  static async findByIdWithTracks(playlistId) {
    const playlistQuery = `
      SELECT p.*, u.username
      FROM playlists p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `;

    const tracksQuery = `
      SELECT
        t.*,
        pt.position,
        pt.added_at
      FROM playlist_tracks pt
      JOIN tracks t ON pt.track_id = t.id
      WHERE pt.playlist_id = $1
      ORDER BY pt.position
    `;

    const [playlistResult, tracksResult] = await Promise.all([
      pool.query(playlistQuery, [playlistId]),
      pool.query(tracksQuery, [playlistId]),
    ]);

    if (playlistResult.rows.length === 0) {
      return null;
    }

    const playlist = playlistResult.rows[0];
    playlist.tracks = tracksResult.rows;

    return playlist;
  }

  /**
   * Update playlist
   * @param {number} id - Playlist ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated playlist
   */
  static async update(id, updates) {
    const allowedFields = ['name', 'description', 'is_public'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE playlists
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete playlist
   * @param {number} id - Playlist ID
   * @returns {Promise<boolean>} - Success status
   */
  static async delete(id) {
    const query = 'DELETE FROM playlists WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  /**
   * Check if user owns playlist
   * @param {number} playlistId - Playlist ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} - True if user owns playlist
   */
  static async isOwner(playlistId, userId) {
    const query = 'SELECT id FROM playlists WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [playlistId, userId]);
    return result.rows.length > 0;
  }
}

export default Playlist;
