import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navRef    = useRef(null);
  const lastY     = useRef(0);

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
    location.pathname === path || (path !== '/' && location.pathname.startsWith(`${path}/`))
      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
      : 'text-gray-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium';

  return (
    <nav
      ref={navRef}
      className="bg-white dark:bg-slate-950 shadow-sm dark:shadow-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 transition-transform duration-300"
    >
      <div className="max-w-5xl mx-auto px-6 py-3 md:py-0 flex flex-col md:flex-row md:h-16 md:items-center md:justify-between">
        <div className="flex items-center justify-center md:block">
          <Link
            to="/"
            className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight"
          >
            Kemal<span className="text-emerald-600 dark:text-emerald-400">Özyön</span>
          </Link>
        </div>

        <div className="flex justify-center md:justify-end items-center gap-4 sm:gap-6 mt-2 md:mt-0 font-mono text-sm">
          <Link to="/"        className={isActive('/')}>Home</Link>
          <Link to="/projects" className={isActive('/projects')}>Projects</Link>
          <Link to="/blogs"   className={isActive('/blogs')}>Blogs</Link>
          <Link to="/notes" className={isActive('/notes')}>Notes</Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
