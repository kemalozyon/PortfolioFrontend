const FetchError = ({ label, error, onRetry }) => (
  <div role="alert" className="rounded-xl border border-slate-800 bg-slate-900 p-6">
    <p className="font-semibold text-slate-200">{error === 'not-found' ? `${label} not found.` : `Unable to load ${label.toLowerCase()}.`}</p>
    <p className="mt-2 text-sm text-slate-400">{error === 'not-found' ? 'The content may have been removed or the link may be incorrect.' : 'Please check your connection and try again.'}</p>
    <button type="button" onClick={onRetry} className="mt-4 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-emerald-400 hover:border-emerald-400 transition-colors">Try again</button>
  </div>
);

export default FetchError;
