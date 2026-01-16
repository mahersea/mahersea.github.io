import pool from '../config/database.js';

class PlaylistTrack {
  /**
   * Add track to playlist
   * @param {number} playlistId - Playlist ID
   * @param {number} trackId - Track ID
   * @returns {Promise<Object>} - Created playlist_track
   */
  static async add(playlistId, trackId) {
    // Get the next position number
    const positionQuery = `
      SELECT COALESCE(MAX(position), 0) + 1 as next_position
      FROM playlist_tracks
      WHERE playlist_id = $1
    `;

    const positionResult = await pool.query(positionQuery, [playlistId]);
    const position = positionResult.rows[0].next_position;

    // Insert the track
    const insertQuery = `
      INSERT INTO playlist_tracks (playlist_id, track_id, position)
      VALUES ($1, $2, $3)
      ON CONFLICT (playlist_id, track_id) DO NOTHING
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [playlistId, trackId, position]);

    // Update playlist updated_at timestamp
    await pool.query(
      'UPDATE playlists SET updated_at = NOW() WHERE id = $1',
      [playlistId]
    );

    return result.rows[0];
  }

  /**
   * Remove track from playlist
   * @param {number} playlistId - Playlist ID
   * @param {number} trackId - Track ID
   * @returns {Promise<boolean>} - Success status
   */
  static async remove(playlistId, trackId) {
    const query = `
      DELETE FROM playlist_tracks
      WHERE playlist_id = $1 AND track_id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [playlistId, trackId]);

    if (result.rows.length > 0) {
      // Reorder remaining tracks
      await this.reorderTracks(playlistId);

      // Update playlist updated_at timestamp
      await pool.query(
        'UPDATE playlists SET updated_at = NOW() WHERE id = $1',
        [playlistId]
      );

      return true;
    }

    return false;
  }

  /**
   * Reorder tracks in playlist (fill gaps in position numbers)
   * @param {number} playlistId - Playlist ID
   * @returns {Promise<void>}
   */
  static async reorderTracks(playlistId) {
    const query = `
      WITH ordered_tracks AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY position) as new_position
        FROM playlist_tracks
        WHERE playlist_id = $1
      )
      UPDATE playlist_tracks pt
      SET position = ot.new_position
      FROM ordered_tracks ot
      WHERE pt.id = ot.id AND pt.playlist_id = $1
    `;

    await pool.query(query, [playlistId]);
  }

  /**
   * Move track to new position
   * @param {number} playlistId - Playlist ID
   * @param {number} trackId - Track ID
   * @param {number} newPosition - New position (1-based)
   * @returns {Promise<Object>} - Updated playlist_track
   */
  static async moveTrack(playlistId, trackId, newPosition) {
    // Get current position
    const currentQuery = `
      SELECT position
      FROM playlist_tracks
      WHERE playlist_id = $1 AND track_id = $2
    `;

    const currentResult = await pool.query(currentQuery, [playlistId, trackId]);

    if (currentResult.rows.length === 0) {
      throw new Error('Track not found in playlist');
    }

    const currentPosition = currentResult.rows[0].position;

    if (currentPosition === newPosition) {
      return currentResult.rows[0];
    }

    // Update positions of affected tracks
    if (newPosition < currentPosition) {
      // Moving up - shift tracks down
      await pool.query(
        `UPDATE playlist_tracks
         SET position = position + 1
         WHERE playlist_id = $1
           AND position >= $2
           AND position < $3`,
        [playlistId, newPosition, currentPosition]
      );
    } else {
      // Moving down - shift tracks up
      await pool.query(
        `UPDATE playlist_tracks
         SET position = position - 1
         WHERE playlist_id = $1
           AND position > $2
           AND position <= $3`,
        [playlistId, currentPosition, newPosition]
      );
    }

    // Update the moved track's position
    const updateQuery = `
      UPDATE playlist_tracks
      SET position = $1
      WHERE playlist_id = $2 AND track_id = $3
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [newPosition, playlistId, trackId]);

    // Update playlist updated_at timestamp
    await pool.query(
      'UPDATE playlists SET updated_at = NOW() WHERE id = $1',
      [playlistId]
    );

    return result.rows[0];
  }

  /**
   * Check if track is in playlist
   * @param {number} playlistId - Playlist ID
   * @param {number} trackId - Track ID
   * @returns {Promise<boolean>}
   */
  static async isInPlaylist(playlistId, trackId) {
    const query = `
      SELECT id FROM playlist_tracks
      WHERE playlist_id = $1 AND track_id = $2
    `;

    const result = await pool.query(query, [playlistId, trackId]);
    return result.rows.length > 0;
  }

  /**
   * Get track count for playlist
   * @param {number} playlistId - Playlist ID
   * @returns {Promise<number>} - Track count
   */
  static async getTrackCount(playlistId) {
    const query = `
      SELECT COUNT(*) as count
      FROM playlist_tracks
      WHERE playlist_id = $1
    `;

    const result = await pool.query(query, [playlistId]);
    return parseInt(result.rows[0].count);
  }
}

export default PlaylistTrack;
