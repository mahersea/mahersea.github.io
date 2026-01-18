-- Create platform_links table
CREATE TABLE IF NOT EXISTS platform_links (
  id SERIAL PRIMARY KEY,
  track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  platform_id VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  added_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(track_id, platform)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_links_track ON platform_links(track_id);
CREATE INDEX IF NOT EXISTS idx_platform_links_platform ON platform_links(platform);
