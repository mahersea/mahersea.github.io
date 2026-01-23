import axios from 'axios';

const ODESLI_API_URL = 'https://api.song.link/v1-alpha.1/links';

class OdesliService {
  /**
   * Get cross-platform links for a given music URL
   * @param {string} url - Music URL from any platform
   * @returns {Promise<Object>} - Cross-platform link data
   */
  async getLinksForUrl(url) {
    try {
      const response = await axios.get(ODESLI_API_URL, {
        params: {
          url: url,
          userCountry: 'US', // Default to US
        },
        timeout: 10000, // 10 second timeout
      });

      return this.parseOdesliResponse(response.data);
    } catch (error) {
      if (error.response) {
        // Odesli API returned an error
        throw new Error(`Odesli API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        // Request was made but no response
        throw new Error('Odesli API timeout or network error');
      } else {
        throw new Error(`Error processing link: ${error.message}`);
      }
    }
  }

  /**
   * Parse Odesli API response into our format
   * @param {Object} data - Raw Odesli response
   * @returns {Object} - Parsed track and platform links
   */
  parseOdesliResponse(data) {
    const { linksByPlatform, entitiesByUniqueId } = data;

    // Get the first entity (track metadata)
    const entityId = Object.keys(entitiesByUniqueId)[0];
    const entity = entitiesByUniqueId[entityId];

    // Extract track metadata
    const track = {
      title: entity.title || 'Unknown Title',
      artist: entity.artistName || 'Unknown Artist',
      album: entity.thumbnailUrl ? null : entity.title, // Some entities don't have separate album info
      thumbnailUrl: entity.thumbnailUrl,
      apiProvider: entity.apiProvider,
    };

    // Extract platform links
    const platforms = [];
    const platformMap = {
      spotify: 'spotify',
      appleMusic: 'apple_music',
      youtube: 'youtube',
      youtubeMusic: 'youtube_music',
      soundcloud: 'soundcloud',
      tidal: 'tidal',
      deezer: 'deezer',
      amazonMusic: 'amazon_music',
      pandora: 'pandora',
    };

    for (const [odesliPlatform, linkData] of Object.entries(linksByPlatform)) {
      const platformName = platformMap[odesliPlatform] || odesliPlatform;

      if (linkData && linkData.url) {
        platforms.push({
          platform: platformName,
          url: linkData.url,
          entityUniqueId: linkData.entityUniqueId,
        });
      }
    }

    return {
      track,
      platforms,
      rawData: data, // Store raw response for debugging
    };
  }

  /**
   * Check if a URL is supported by Odesli
   * @param {string} url - URL to check
   * @returns {boolean}
   */
  isSupportedUrl(url) {
    const supportedPatterns = [
      /spotify\.com/,
      /music\.apple\.com/,
      /youtube\.com|youtu\.be/,
      /soundcloud\.com/,
      /tidal\.com/,
      /deezer\.com/,
      /music\.amazon\.com/,
      /pandora\.com/,
    ];

    return supportedPatterns.some(pattern => pattern.test(url));
  }
}

export default new OdesliService();
