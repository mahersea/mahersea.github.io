/**
 * Link Parser Service
 * Detects music platform from URL and extracts metadata
 */

class LinkParser {
  /**
   * Detect which platform a URL is from
   * @param {string} url - Music URL
   * @returns {string|null} - Platform name or null if unknown
   */
  detectPlatform(url) {
    if (!url || typeof url !== 'string') {
      return null;
    }

    const urlLower = url.toLowerCase();

    // Spotify
    if (urlLower.includes('open.spotify.com') || urlLower.includes('spotify.com')) {
      return 'spotify';
    }

    // Apple Music
    if (urlLower.includes('music.apple.com')) {
      return 'apple_music';
    }

    // YouTube and YouTube Music
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
      if (urlLower.includes('music.youtube.com')) {
        return 'youtube_music';
      }
      return 'youtube';
    }

    // SoundCloud
    if (urlLower.includes('soundcloud.com')) {
      return 'soundcloud';
    }

    // Tidal
    if (urlLower.includes('tidal.com')) {
      return 'tidal';
    }

    // Deezer
    if (urlLower.includes('deezer.com')) {
      return 'deezer';
    }

    // Amazon Music
    if (urlLower.includes('music.amazon.com')) {
      return 'amazon_music';
    }

    // Pandora
    if (urlLower.includes('pandora.com')) {
      return 'pandora';
    }

    // Bandcamp
    if (urlLower.includes('bandcamp.com')) {
      return 'bandcamp';
    }

    return null;
  }

  /**
   * Validate if URL is a valid music link
   * @param {string} url - URL to validate
   * @returns {boolean}
   */
  isValidMusicUrl(url) {
    if (!url || typeof url !== 'string') {
      return false;
    }

    // Must start with http:// or https://
    if (!url.match(/^https?:\/\//i)) {
      return false;
    }

    // Must be from a supported platform
    return this.detectPlatform(url) !== null;
  }

  /**
   * Extract track ID from platform URL (if possible)
   * @param {string} url - Music URL
   * @param {string} platform - Platform name
   * @returns {string|null} - Track ID or null
   */
  extractTrackId(url, platform) {
    try {
      const urlObj = new URL(url);

      switch (platform) {
        case 'spotify':
          // https://open.spotify.com/track/TRACK_ID
          const spotifyMatch = url.match(/\/track\/([a-zA-Z0-9]+)/);
          return spotifyMatch ? spotifyMatch[1] : null;

        case 'apple_music':
          // https://music.apple.com/us/album/album-name/id12345?i=67890
          const appleMatch = url.match(/[?&]i=(\d+)/);
          return appleMatch ? appleMatch[1] : null;

        case 'youtube':
        case 'youtube_music':
          // https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
          const youtubeMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/) ||
                               url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
          return youtubeMatch ? youtubeMatch[1] : null;

        case 'soundcloud':
          // SoundCloud URLs are more complex, return the path
          return urlObj.pathname;

        default:
          return null;
      }
    } catch (error) {
      return null;
    }
  }

  /**
   * Get platform display name
   * @param {string} platform - Platform identifier
   * @returns {string} - Human-readable name
   */
  getPlatformDisplayName(platform) {
    const names = {
      spotify: 'Spotify',
      apple_music: 'Apple Music',
      youtube: 'YouTube',
      youtube_music: 'YouTube Music',
      soundcloud: 'SoundCloud',
      tidal: 'Tidal',
      deezer: 'Deezer',
      amazon_music: 'Amazon Music',
      pandora: 'Pandora',
      bandcamp: 'Bandcamp',
    };

    return names[platform] || platform;
  }
}

export default new LinkParser();
