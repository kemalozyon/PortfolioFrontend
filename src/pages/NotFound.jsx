import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const NotFound = () => {
  const location = useLocation();
  const [showCursor, setShowCursor] = useState(true);

  useDocumentMeta({
    title: '404 — Not Found',
    description: 'The page you are looking for does not exist.',
    path: location.pathname,
    noindex: true,
  });

  useEffect(() => {
    const id = setInterval(() => setShowCursor(c => !c), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-6 py-16 transition-colors duration-300">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-8xl md:text-[10rem] font-extrabold tracking-tighter mb-2 font-mono leading-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">4</span>
          <span className="text-gray-300 dark:text-slate-700">0</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">4</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-slate-400 mb-10 font-mono">
          <span className="text-emerald-600 dark:text-emerald-400">//</span> page not found
        </p>

        <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-950 font-mono text-sm text-left">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border-b border-slate-700/60">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-slate-400 truncate">~/portfolio — error</span>
          </div>
          <div className="p-4 text-slate-200 space-y-1.5 leading-relaxed">
            <div>
              <span className="text-emerald-400">$</span>{' '}
              <span className="text-slate-300">navigate</span>{' '}
              <span className="text-yellow-300 break-all">{location.pathname}</span>
            </div>
            <div className="text-red-400">Uncaught RouteError: 404 — route not defined</div>
            <div className="text-slate-400 pl-4">at <span className="text-slate-300">Router.resolve</span> <span className="text-slate-500">(App.jsx:42)</span></div>
            <div className="text-slate-400 pl-4">at <span className="text-slate-300">&lt;Routes&gt;</span> <span className="text-slate-500">(react-router-dom)</span></div>
            <div className="text-slate-400 pl-4">at <span className="text-slate-300">Browser.render</span> <span className="text-slate-500">(browser.js:1)</span></div>
            <div className="text-slate-300 pt-2">
              <span className="text-emerald-400">hint:</span> the page you&apos;re looking for has been{' '}
              <span className="text-yellow-300">garbage collected</span> or never existed.
            </div>
            <div className="flex items-center pt-2">
              <span className="text-emerald-400 mr-2">$</span>
              <span className={`inline-block w-2 h-4 bg-emerald-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 font-mono text-sm">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105 shadow-md"
          >
            cd ~/
          </Link>
          <Link
            to="/projects"
            className="px-5 py-2.5 rounded-full bg-gray-900 dark:bg-slate-800 hover:bg-gray-800 dark:hover:bg-slate-700 text-white transition-all hover:scale-105 shadow-md"
          >
            cd ./projects
          </Link>
          <Link
            to="/blogs"
            className="px-5 py-2.5 rounded-full bg-gray-900 dark:bg-slate-800 hover:bg-gray-800 dark:hover:bg-slate-700 text-white transition-all hover:scale-105 shadow-md"
          >
            cd ./blogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
