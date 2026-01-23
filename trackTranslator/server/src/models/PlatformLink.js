import pool from '../config/database.js';

class PlatformLink {
  /**
   * Create a new platform link
   * @param {Object} linkData - Platform link information
   * @returns {Promise<Object>} - Created link
   */
  static async create({ track_id, platform, platform_id, url, is_verified, added_by }) {
    const query = `
      INSERT INTO platform_links (track_id, platform, platform_id, url, is_verified, added_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (track_id, platform)
      DO UPDATE SET
        url = EXCLUDED.url,
        platform_id = EXCLUDED.platform_id,
        is_verified = EXCLUDED.is_verified
      RETURNING *
    `;

    const values = [
      track_id,
      platform,
      platform_id || '',
      url,
      is_verified || false,
      added_by || null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Create multiple platform links in batch
   * @param {Array} links - Array of link objects
   * @returns {Promise<Array>} - Created links
   */
  static async createMany(links) {
    if (!links || links.length === 0) {
      return [];
    }

    const results = await Promise.all(
      links.map(link => this.create(link))
    );

    return results;
  }

  /**
   * Find all platform links for a track
   * @param {number} trackId - Track ID
   * @returns {Promise<Array>} - Array of platform links
   */
  static async findByTrackId(trackId) {
    const query = `
      SELECT * FROM platform_links
      WHERE track_id = $1
      ORDER BY platform
    `;

    const result = await pool.query(query, [trackId]);
    return result.rows;
  }

  /**
   * Find specific platform link for a track
   * @param {number} trackId - Track ID
   * @param {string} platform - Platform name
   * @returns {Promise<Object|null>} - Platform link or null
   */
  static async findByTrackAndPlatform(trackId, platform) {
    const query = `
      SELECT * FROM platform_links
      WHERE track_id = $1 AND platform = $2
    `;

    const result = await pool.query(query, [trackId, platform]);
    return result.rows[0] || null;
  }

  /**
   * Update platform link
   * @param {number} id - Link ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated link
   */
  static async update(id, updates) {
    const allowedFields = ['url', 'platform_id', 'is_verified'];
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

    values.push(id);

    const query = `
      UPDATE platform_links
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete platform link
   * @param {number} id - Link ID
   * @returns {Promise<boolean>} - Success status
   */
  static async delete(id) {
    const query = 'DELETE FROM platform_links WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  /**
   * Delete all platform links for a track
   * @param {number} trackId - Track ID
   * @returns {Promise<number>} - Number of deleted links
   */
  static async deleteByTrackId(trackId) {
    const query = 'DELETE FROM platform_links WHERE track_id = $1 RETURNING id';
    const result = await pool.query(query, [trackId]);
    return result.rows.length;
  }
}

export default PlatformLink;
