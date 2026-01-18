import { useAuth } from '../context/AuthContext';
import LinkInput from '../components/link/LinkInput';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="container-custom mt-12 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
          TrackPort
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-200 font-medium">
          Your music, any platform
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">
          Paste a Spotify link, get YouTube, Apple Music, and more
        </p>
      </div>

      {/* Link Input - Available to everyone */}
      <LinkInput />

      {/* How it works - Show to non-authenticated users */}
      {!isAuthenticated && (
        <div className="mt-16 card p-10 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-primary-200 dark:border-primary-700">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary-900 dark:text-primary-300">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="font-bold mb-3 text-lg text-gray-300 dark:text-primary-300">Paste a link</h3>
              <p className="text-gray-600 dark:text-gray-300">
                From Spotify, YouTube, Apple Music, or any platform
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="font-bold mb-3 text-lg text-gray-300 dark:text-primary-300">We find it everywhere</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Automatically match tracks across all platforms
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="font-bold mb-3 text-lg text-gray-300 dark:text-primary-300">Share with anyone</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your friends listen on their preferred platform
              </p>
            </div>
          </div>
          <div className="text-center mt-10">
            <a
              href="/signup"
              className="inline-block btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl"
            >
              Sign Up to Save Playlists
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
