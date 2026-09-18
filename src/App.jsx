import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blogs from './pages/Blogs';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectDetail from './pages/ProjectDetail';
import BlogDetail from './pages/BlogDetail';
import NotFound from './pages/NotFound';
import { lazy, Suspense } from 'react';
const Notes = lazy(() => import('./pages/Notes'));
const AdminNotes = lazy(() => import('./pages/AdminNotes'));
const notesPage = <Suspense fallback={<div className="p-8 text-slate-400">Loading notes…</div>}><Notes /></Suspense>;

function App() {
  return (
    <BrowserRouter>
      {/* Navbar her sayfanın tepesinde kalacak */}
      <Navbar />

      <Routes>
        {/* Herkese Açık Rotalar */}
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/notes" element={notesPage} />
        <Route path="/notes/folders/:folderId" element={notesPage} />
        <Route path="/notes/:noteId" element={notesPage} />
        <Route path="/admin/notes" element={<ProtectedRoute><Suspense fallback={<div className="p-8 text-slate-400">Loading notes…</div>}><AdminNotes /></Suspense></ProtectedRoute>} />

        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />

        {/* Admin Rotaları */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
