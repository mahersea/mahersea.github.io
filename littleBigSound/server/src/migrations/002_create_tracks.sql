-- Create tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  album VARCHAR(255),
  isrc VARCHAR(20),
  duration_ms INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracks_isrc ON tracks(isrc);
CREATE INDEX IF NOT EXISTS idx_tracks_search ON tracks USING gin(to_tsvector('english', title || ' ' || artist));
