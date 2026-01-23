import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/common/Navigation';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MyPlaylists from './pages/MyPlaylists';
import PlaylistCreate from './components/playlist/PlaylistCreate';
import PlaylistView from './components/playlist/PlaylistView';
import TrackView from './pages/TrackView';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen">
            <Navigation />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-playlists"
              element={
                <ProtectedRoute>
                  <MyPlaylists />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlists/new"
              element={
                <ProtectedRoute>
                  <PlaylistCreate />
                </ProtectedRoute>
              }
            />
            <Route path="/playlists/:id" element={<PlaylistView />} />
            <Route path="/tracks/:id" element={<TrackView />} />
          </Routes>
        </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
