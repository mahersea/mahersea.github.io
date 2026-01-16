# TrackPort

A cross-platform music link translator that allows users to share music across different streaming platforms (Spotify, Apple Music, YouTube, etc.). Share a track from any platform, and your friends can listen on their preferred service.

## Project Status

**Current Phase:** Sprint 1 - Foundation (Authentication Complete)

### ✅ Completed
- Project structure (React + Vite frontend, Express backend)
- PostgreSQL database with migrations
- User authentication system (register/login/JWT)
- React frontend with routing and protected routes
- AuthContext for global state management
- Basic UI with Tailwind CSS

### 🚧 In Progress
- Testing authentication flow

### 📋 Next Steps (Sprint 2)
- Core link processing feature (Odesli API integration)
- Track matching across platforms
- Display cross-platform links

## Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- Axios for API calls
- Tailwind CSS for styling

### Backend
- Node.js + Express
- PostgreSQL database
- JWT authentication
- bcrypt for password hashing

### APIs (Coming in Sprint 2)
- Odesli/Songlink API (cross-platform matching)
- Spotify Web API (metadata)
- YouTube Data API (metadata)

## Prerequisites

- Node.js v20.x
- PostgreSQL 14+
- npm or yarn

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```bash
createdb trackport_dev
```

Or using psql:

```sql
CREATE DATABASE trackport_dev;
```

### 2. Server Setup

```bash
cd server

# Copy environment variables
cp .env.example .env

# Edit .env and update DATABASE_URL if needed
# DATABASE_URL=postgresql://localhost:5432/trackport_dev

# Install dependencies (already done if following from setup)
npm install

# Run database migrations
npm run migrate

# Start the server
npm run dev
```

Server will run on http://localhost:3001

### 3. Client Setup

```bash
cd client

# Install dependencies (already done if following from setup)
npm install

# Start the development server
npm run dev
```

Frontend will run on http://localhost:5173

## Project Structure

```
trackport/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── auth/          # Auth forms
│   │   │   └── common/        # Shared components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── context/           # React contexts
│   │   └── App.jsx            # Main app component
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/            # Database config
│   │   ├── models/            # Data models
│   │   ├── routes/            # API routes
│   │   ├── controllers/       # Route controllers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Express middleware
│   │   ├── migrations/        # SQL migrations
│   │   └── index.js           # Server entry point
│   └── package.json
│
├── PROMPT.md                  # Comprehensive project requirements
└── README.md                  # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Health Check
- `GET /api/health` - Server health status

### Coming in Sprint 2
- `POST /api/tracks/process` - Process music link
- `GET /api/tracks/:id` - Get track details
- Playlist endpoints

## Environment Variables

### Server (.env)
```env
DATABASE_URL=postgresql://localhost:5432/trackport_dev
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Client (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## Development Workflow

1. Start PostgreSQL
2. Run migrations (first time only): `cd server && npm run migrate`
3. Start backend: `cd server && npm run dev`
4. Start frontend: `cd client && npm run dev`
5. Open browser to http://localhost:5173

## Testing the MVP

### Manual Testing Sprint 1 Features:

1. **Registration**
   - Go to http://localhost:5173/signup
   - Create a new account
   - Should redirect to home page with welcome message

2. **Login**
   - Logout from profile page
   - Go to /login
   - Login with your credentials
   - Should redirect to home page

3. **Protected Routes**
   - Try accessing /profile without logging in
   - Should redirect to /login
   - After logging in, /profile should be accessible

4. **Profile Page**
   - View your user information
   - Test logout functionality

## Database Schema

### users
- id, email, username, password_hash, preferred_platform, timestamps

### tracks (Sprint 2)
- id, title, artist, album, isrc, duration_ms, metadata (JSON), timestamps

### platform_links (Sprint 2)
- id, track_id, platform, platform_id, url, is_verified, timestamps

### playlists (Sprint 3)
- id, user_id, name, description, is_public, timestamps

### playlist_tracks (Sprint 3)
- id, playlist_id, track_id, position, added_at

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in server/.env
- Verify database exists: `psql -l`

### Port Already in Use
- Backend: Change PORT in server/.env
- Frontend: Vite will prompt for alternative port

### Migration Errors
- Check PostgreSQL connection
- Ensure database exists
- Run migrations: `cd server && npm run migrate`

## Development Roadmap

- **Sprint 1 (Current):** ✅ Foundation + Authentication
- **Sprint 2 (Next):** Link processing core feature
- **Sprint 3:** Playlists and sharing
- **Sprint 4:** Polish and deployment

## Contributing

This is a learning project. See PROMPT.md for the full project vision and technical specifications.

## License

MIT
