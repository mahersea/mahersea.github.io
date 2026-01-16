import pool from '../config/database.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

class User {
  // Create a new user
  static async create({ email, password, username }) {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const query = `
      INSERT INTO users (email, password_hash, username)
      VALUES ($1, $2, $3)
      RETURNING id, email, username, preferred_platform, created_at
    `;

    const result = await pool.query(query, [email, password_hash, username]);
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT id, email, username, preferred_platform, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Find user by username
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update preferred platform
  static async updatePreferredPlatform(userId, platform) {
    const query = `
      UPDATE users
      SET preferred_platform = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, username, preferred_platform, updated_at
    `;

    const result = await pool.query(query, [platform, userId]);
    return result.rows[0];
  }
}

export default User;
