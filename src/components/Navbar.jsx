import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const navRef    = useRef(null);
  const lastY     = useRef(0);
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (!navRef.current) return;
      if (currentY <= 0) {
        navRef.current.style.transform = 'translateY(0)';
      } else if (currentY > lastY.current) {
        navRef.current.style.transform = 'translateY(-100%)';
      } else {
        navRef.current.style.transform = 'translateY(0)';
      }
      lastY.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) =>
    location.pathname === path
      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
      : 'text-gray-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium';

  return (
    <nav
      ref={navRef}
      className="bg-white dark:bg-slate-950 shadow-sm dark:shadow-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 transition-transform duration-300"
    >
      <div className="max-w-5xl mx-auto px-6 py-3 md:py-0 flex flex-col md:flex-row md:h-16 md:items-center md:justify-between">
        <Link
          to="/"
          className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center md:text-left"
        >
          Kemal<span className="text-emerald-600 dark:text-emerald-400">Ozyon</span>
        </Link>

        <div className="flex justify-center md:justify-end items-center gap-6 mt-2 md:mt-0">
          <Link to="/"        className={isActive('/')}>Home</Link>
          <Link to="/projects" className={isActive('/projects')}>Projects</Link>
          <Link to="/blogs"   className={isActive('/blogs')}>Blogs</Link>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isDark ? (
              /* Sun icon */
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4a1 1 0 0 1 1-1h0a1 1 0 0 1 0 2h0a1 1 0 0 1-1-1zm0 16a1 1 0 0 1 1-1h0a1 1 0 0 1 0 2h0a1 1 0 0 1-1-1zm8-8a1 1 0 0 1-1 1h0a1 1 0 0 1 0-2h0a1 1 0 0 1 1 1zM4 12a1 1 0 0 1-1 1h0a1 1 0 0 1 0-2h0a1 1 0 0 1 1 1zm13.66-5.66a1 1 0 0 1 0 1.41h0a1 1 0 0 1-1.41-1.41h0a1 1 0 0 1 1.41 0zM7.76 16.24a1 1 0 0 1 0 1.41h0a1 1 0 0 1-1.41-1.41h0a1 1 0 0 1 1.41 0zm9.9 1.41a1 1 0 0 1-1.42 0h0a1 1 0 0 1 1.42-1.41h0a1 1 0 0 1 0 1.41zM7.76 7.76a1 1 0 0 1-1.41 0h0A1 1 0 0 1 7.76 6.34h0a1 1 0 0 1 0 1.42zM12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z"/>
              </svg>
            ) : (
              /* Moon icon */
              <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
