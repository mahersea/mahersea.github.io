// events.js - Enhanced Event Data Fetching and Processing

// Configuration
const API_URL = 'https://stage-feed-app.startribune.com/recent';
const API_KEY = 'bigfaker'; // Replace with your actual key in production

// Comprehensive location references
const LOCATION_REFERENCES = {
  cities: {
    'minneapolis': { lat: 44.9778, lon: -93.2650, state: 'minnesota', region: 'midwest' },
    'st. paul': { lat: 44.9537, lon: -93.0900, state: 'minnesota', region: 'midwest' },
    'duluth': { lat: 46.7867, lon: -92.1005, state: 'minnesota', region: 'midwest' },
    'rochester': { lat: 44.0121, lon: -92.4802, state: 'minnesota', region: 'midwest' },
    'bloomington': { lat: 44.8408, lon: -93.2983, state: 'minnesota', region: 'midwest' },
    'eden prairie': { lat: 44.8547, lon: -93.4707, state: 'minnesota', region: 'midwest' },
    'maple grove': { lat: 45.0724, lon: -93.4557, state: 'minnesota', region: 'midwest' },
    'winona': { lat: 44.0279, lon: -91.6382, state: 'minnesota', region: 'midwest' },
    'fargo': { lat: 46.8772, lon: -96.7898, state: 'north dakota', region: 'midwest' },
    'sioux falls': { lat: 43.5445, lon: -96.7311, state: 'south dakota', region: 'midwest' }
  },
  counties: {
    'hennepin': { lat: 44.9778, lon: -93.2650, state: 'minnesota', cities: ['minneapolis', 'bloomington'] },
    'ramsey': { lat: 44.9537, lon: -93.0900, state: 'minnesota', cities: ['st. paul'] },
    'dakota': { lat: 44.6706, lon: -93.0400, state: 'minnesota', cities: ['apple valley', 'burnsville'] },
    'st. louis': { lat: 47.5837, lon: -92.4659, state: 'minnesota', cities: ['duluth'] }
  },
  stateRegions: {
    'minnesota': { 
      lat: 46.3924, 
      lon: -94.6367, 
      neighbors: ['wisconsin', 'iowa', 'north dakota', 'south dakota'],
      majorCities: ['minneapolis', 'st. paul', 'duluth', 'rochester']
    }
  }
};

// Comprehensive keyword-based category detection
const CATEGORY_RULES = [
  {
    id: 'crime',
    keywords: ['arrested', 'police', 'suspect', 'charged', 'shooting', 'robbery', 'murder', 'crime', 'investigation'],
    sections: ['public safety', 'crime', 'police']
  },
  {
    id: 'politics',
    keywords: ['election', 'vote', 'senator', 'representative', 'legislation', 'bill', 'policy', 'campaign'],
    sections: ['politics', 'government', 'legislature']
  },
  {
    id: 'weather',
    keywords: ['storm', 'tornado', 'hurricane', 'flood', 'snow', 'temperature', 'warning', 'advisory'],
    sections: ['weather', 'climate']
  },
  {
    id: 'sports',
    keywords: ['game', 'touchdown', 'score', 'championship', 'league', 'tournament', 'team', 'athletes'],
    sections: ['sports', 'athletics']
  },
  {
    id: 'business',
    keywords: ['stocks', 'market', 'company', 'earnings', 'investment', 'startup', 'merger', 'revenue'],
    sections: ['business', 'economy', 'finance']
  },
  {
    id: 'health',
    keywords: ['covid', 'vaccine', 'hospital', 'medical', 'health', 'clinic', 'treatment', 'pandemic'],
    sections: ['health', 'medical', 'wellness']
  }
];

// Geocoding and event processing utilities
function determineCategory(event) {
  const title = (event.headline || event.title || '').toLowerCase();
  const content = (event.abstract || event.description || '').toLowerCase();
  const section = (event.section || '').toLowerCase();

  // Check section first
  for (const rule of CATEGORY_RULES) {
    if (rule.sections.some(s => section.includes(s))) {
      return rule.id;
    }
  }

  // Check keywords
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(keyword => 
      title.includes(keyword) || content.includes(keyword))) {
      return rule.id;
    }
  }

  return 'general';
}

function geocodeEvent(event) {
  // Extract location from various possible sources
  const locationSources = [
    event.city,
    event.county,
    event.state,
    extractLocationFromText(event.headline),
    extractLocationFromText(event.abstract)
  ];

  for (const location of locationSources) {
    if (!location) continue;

    // Check cities
    const cityMatch = LOCATION_REFERENCES.cities[location.toLowerCase()];
    if (cityMatch) return { 
      name: location, 
      lat: cityMatch.lat, 
      lon: cityMatch.lon 
    };

    // Check counties
    const countyMatch = LOCATION_REFERENCES.counties[location.toLowerCase()];
    if (countyMatch) return { 
      name: location, 
      lat: countyMatch.lat, 
      lon: countyMatch.lon 
    };
  }

  // Fallback to Minnesota state center if no specific location found
  return { 
    name: 'Minnesota', 
    lat: LOCATION_REFERENCES.stateRegions.minnesota.lat, 
    lon: LOCATION_REFERENCES.stateRegions.minnesota.lon 
  };
}

function extractLocationFromText(text) {
  if (!text) return null;

  const locationKeywords = Object.keys(LOCATION_REFERENCES.cities)
    .concat(Object.keys(LOCATION_REFERENCES.counties));

  const matchedLocation = locationKeywords.find(loc => 
    text.toLowerCase().includes(loc.toLowerCase())
  );

  return matchedLocation || null;
}

function generateMockEvents(count = 20) {
  const mockEvents = [];
  const cities = Object.keys(LOCATION_REFERENCES.cities);
  const mockTitles = [
    'Breaking News: Local Event Unfolds',
    'Community Gathering Draws Crowds',
    'New Development in City Project',
    'Local Team Achieves Remarkable Victory',
    'Weather Impacts Regional Activities'
  ];

  for (let i = 0; i < count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const cityInfo = LOCATION_REFERENCES.cities[city];
    const title = mockTitles[Math.floor(Math.random() * mockTitles.length)];

    const event = {
      id: `mock-event-${i}`,
      headline: `${title} in ${city}`,
      abstract: `Detailed coverage of an interesting event happening in ${city}`,
      city: city,
      state: cityInfo.state,
      publish_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      url: '#'
    };

    mockEvents.push(event);
  }

  return mockEvents;
}

function getMockNewsData() {
  return generateMockEvents();
}

// Main event fetching and processing
async function fetchEvents() {
  const loader = document.getElementById('loader');
  loader.style.display = 'block';
  
  try {
    const events = await fetchNewsData();
    const processedEvents = processEvents(events);
    
    newsMap.setEvents(processedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    // Fallback to mock data if real API fails
    const mockEvents = getMockNewsData();
    const processedMockEvents = processEvents(mockEvents);
    newsMap.setEvents(processedMockEvents);
  } finally {
    loader.style.display = 'none';
  }
}

async function fetchNewsData() {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from API:', error);
    return getMockNewsData();
  }
}

function processEvents(rawEvents) {
  return rawEvents.map(event => {
    const category = determineCategory(event);
    const location = geocodeEvent(event);
    
    return {
      id: event.id || `event-${Math.random().toString(36).substr(2, 9)}`,
      title: event.headline || event.title,
      description: event.abstract || '',
      date: event.publish_date || new Date().toISOString(),
      url: event.url || '#',
      category: category,
      lat: location.lat,
      lon: location.lon,
      locationName: location.name
    };
  }).filter(event => event.lat && event.lon);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  newsMap = new NewsMap('map-canvas');
  populateCategoryFilters();
  fetchEvents();
  
  // Refresh events every 5 minutes
  setInterval(fetchEvents, 5 * 60 * 1000);
});