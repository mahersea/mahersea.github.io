import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeSelector from './ThemeSelector';
import DarkModeToggle from './DarkModeToggle';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav style={{
      background: 'linear-gradient(to right, var(--color-primary-700), var(--color-primary-600))'
    }} className="text-white shadow-lg border-b-2 border-black/20">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-white hover:text-white/90 transition-colors flex items-center gap-2">
            <span className="text-3xl">⚓</span>
            TrackPort
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-white/80 hidden md:inline">Hi, {user?.username}</span>
                <Link
                  to="/my-playlists"
                  className="text-white hover:text-white/80 font-medium transition-colors"
                >
                  My Playlists
                </Link>
                <Link
                  to="/profile"
                  className="text-white hover:text-white/80 font-medium transition-colors hidden sm:inline"
                >
                  Profile
                </Link>
                <DarkModeToggle />
                <ThemeSelector />
                <button
                  onClick={logout}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors border border-white/30"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-white/80 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-white/30"
                >
                  Sign Up
                </Link>
                <DarkModeToggle />
                <ThemeSelector />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
