# TrackTranslator

A cross-platform music link translator that breaks down streaming platform barriers. Share a track from Spotify, and your friends can listen on Apple Music, YouTube, or their preferred service. Built for human-centered music curation and community-driven discovery.

## Overview

TrackTranslator is a universal music linking platform that translates music URLs across all major streaming services. Rather than hosting audio files, it acts as an intelligent aggregator that identifies tracks and finds equivalent links on every platform, allowing seamless music sharing regardless of which service you use.

**The Problem:** "I can't listen to that because I don't have Spotify"

**The Solution:** One universal link that works for everyone, on any platform

## Key Features

- **Universal Links** - Paste a link from any platform, get equivalent links for all others
- **Platform-Agnostic Sharing** - No forced migration, everyone uses their preferred service
- **Human Curation** - Follow curators you trust, not algorithms
- **Playlist Collections** - Create cross-platform playlists that work for everyone
- **Physical Media Export** - Generate cassette J-cards and vinyl artwork from digital playlists
- **Free & Open Source** - Community-driven, no ads, no tracking

## Tech Stack Highlights

### Frontend Architecture

**Core Framework:**
- **React 18** with **Vite** - Fast HMR, optimized builds, modern dev experience
- **React Router v6** - Declarative routing with nested routes and layouts
- **Tailwind CSS** - Utility-first styling for rapid UI development

**State Management:**
- **Context API** (AuthContext) - Global authentication state without Redux overhead
- Component-level state for UI interactions
- Future: Consider Zustand for complex playlist state

**API Layer:**
- **Axios** - Promise-based HTTP client with interceptors for auth tokens
- Service abstraction layer (authService, trackService) for clean separation

**Why These Choices:**
- React 18 provides concurrent features and automatic batching for better performance
- Vite significantly faster than Create React App, especially for rebuilds
- Tailwind reduces CSS bundle size and eliminates naming conflicts
- Context API sufficient for auth; avoids Redux complexity for MVP

### Backend Architecture

**Server Framework:**
- **Node.js + Express** - JavaScript full-stack, extensive middleware ecosystem
- RESTful API design with modular routing
- Async/await throughout for clean error handling

**Database:**
- **PostgreSQL** - Relational integrity for user/track/playlist relationships
- Native JSON support for flexible metadata storage
- ACID compliance for critical user data
- Migration system for version-controlled schema changes

**Authentication:**
- **JWT (JSON Web Tokens)** - Stateless auth, scales horizontally
- **bcrypt** - Industry-standard password hashing (salt rounds: 10)
- HTTP-only cookies (future) for XSS protection

**Why These Choices:**
- PostgreSQL over MongoDB: relationships matter (users → playlists → tracks → platform_links)
- JWT over sessions: enables future mobile apps and API access
- Express: mature, well-documented, massive middleware library

### External APIs

**Link Translation:**
- **Odesli/Songlink API** - Cross-platform music matching
- Fallback: Direct platform API calls (Spotify, Apple Music, YouTube)
- Caching layer (Redis, future) to minimize API calls

**Platform Integration:**
- **Spotify Web API** - Track metadata, ISRC codes
- **YouTube Data API** - Video/music metadata
- **Apple Music API** (MusicKit) - Apple Music links
- **MusicBrainz** - Open metadata enrichment

**API Strategy:**
- ISRC codes (International Standard Recording Code) for reliable matching
- Fuzzy string matching for metadata variations
- Community verification for disputed matches

## Architectural Decisions

### Why Link Aggregation vs. File Hosting?

**Decision:** Store links to streaming platforms, not audio files

**Benefits:**
- Zero copyright concerns (just linking, like Google)
- Minimal infrastructure costs (no CDN, no storage)
- Works with all music, not just Creative Commons
- Users discover music on platforms they already pay for
- Legal clarity (DMCA applies to links, not hosted content)

**Trade-offs:**
- Dependent on platform APIs and rate limits
- Links can break if platforms remove content
- Track matching accuracy critical for user experience

### Database Design Philosophy

**Normalized Relational Schema:**
```
users → playlists → playlist_tracks ← tracks ← platform_links
```

**Key Design Choices:**
1. **Separate `tracks` and `platform_links` tables** - One track, many platforms
2. **ISRC as unique identifier** - Reliable cross-platform matching
3. **JSON metadata column** - Flexible for platform-specific data
4. **`is_verified` flag** - Community validation system
5. **Position-based playlist ordering** - Enables drag-and-drop reordering

### Authentication Flow

**JWT Strategy:**
1. User registers/logs in → Server validates credentials
2. Server generates JWT with user payload (id, email, username)
3. Token sent to client, stored in localStorage (future: HTTP-only cookie)
4. Client includes token in Authorization header for protected routes
5. Server middleware validates token on each request

**Security Considerations:**
- Passwords hashed with bcrypt (never stored plaintext)
- JWT expiration (7 days default, configurable)
- Protected routes check token validity before processing
- Future: Refresh tokens for better security/UX balance

### Caching Strategy (Future)

**Problem:** External APIs have rate limits
**Solution:** Multi-tier caching

1. **Redis cache** - Track metadata and platform links (TTL: 24 hours)
2. **Database cache** - Previously resolved tracks (permanent)
3. **Client-side cache** - Axios response caching (session duration)
4. **Community contributions** - Users manually add missing links

### Error Handling Philosophy

**Backend:**
- Consistent error response format: `{ error: string, details?: object }`
- Express error middleware catches unhandled exceptions
- Logging (future): Winston or Pino for structured logs

**Frontend:**
- Try-catch blocks around API calls
- User-friendly error messages (not raw API responses)
- Retry logic for network failures
- Fallback UI for broken links

## Project Structure

```
trackTranslator/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── auth/           # LoginForm, SignupForm
│   │   │   └── common/         # Navbar, Footer, LoadingSpinner
│   │   ├── pages/              # Route-level components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/           # API abstraction layer
│   │   │   ├── authService.js  # Register, login, logout
│   │   │   └── api.js          # Axios instance with interceptors
│   │   ├── context/            # React Context providers
│   │   │   └── AuthContext.jsx # Global auth state
│   │   ├── App.jsx             # Root component with router
│   │   └── main.jsx            # Vite entry point
│   ├── index.html              # SPA shell
│   ├── vite.config.js          # Vite configuration
│   └── package.json
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # PostgreSQL connection pool
│   │   ├── models/
│   │   │   └── User.js         # User data access layer
│   │   ├── routes/
│   │   │   ├── auth.js         # /api/auth/* endpoints
│   │   │   └── health.js       # Health check endpoint
│   │   ├── controllers/
│   │   │   └── authController.js  # Auth business logic
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT validation middleware
│   │   │   └── errorHandler.js # Global error handler
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql  # Database setup
│   │   └── index.js            # Express app configuration
│   ├── .env.example            # Environment template
│   └── package.json
│
├── PROMPT.md                   # Full project vision & requirements
├── PROJECT_STATUS.md           # Development progress tracker
├── PROJECT_NARRATIVE.txt       # Long-form project description
└── README.md                   # This file
```

## Quick Start

### Prerequisites
- Node.js v20.x
- PostgreSQL 14+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd trackTranslator

# Database setup
createdb tracktranslator_dev

# Server setup
cd server
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run migrate
npm run dev

# Client setup (in a new terminal)
cd client
npm install
npm run dev
```

Visit http://localhost:5173

## Documentation

- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Sprint progress, testing guide, API reference
- **[PROMPT.md](PROMPT.md)** - Complete project vision and technical specifications
- **[PROJECT_NARRATIVE.txt](PROJECT_NARRATIVE.txt)** - Long-form project description

## Current Status

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for detailed progress.

## License

MIT

---

**TrackTranslator** - Breaking down streaming platform barriers, one link at a time.
