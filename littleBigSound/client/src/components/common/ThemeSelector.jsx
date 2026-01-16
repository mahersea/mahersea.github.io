import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeSelector = () => {
  const { currentTheme, changeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeColors = {
    purple: 'from-purple-600 to-violet-700',
    ocean: 'from-blue-500 to-cyan-600',
    sunset: 'from-orange-500 to-pink-600',
    forest: 'from-green-500 to-emerald-700',
    rose: 'from-pink-500 to-rose-700',
    midnight: 'from-slate-600 to-slate-800',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors border border-white/30"
        title="Change theme"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
        <span className="text-sm font-medium">🎨</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Choose Theme</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Personalize your experience
              </p>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => {
                    changeTheme(key);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    currentTheme === key ? 'bg-gray-100 dark:bg-gray-700 ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-gray-300 dark:ring-gray-600' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${themeColors[key]} shadow-md`}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{theme.name}</div>
                    {currentTheme === key && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Active</div>
                    )}
                  </div>
                  {currentTheme === key && (
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
