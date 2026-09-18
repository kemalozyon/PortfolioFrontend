// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { invalidateContent } from '../lib/queryClient';
import ProjectForm from '../components/ProjectForm';
import BlogForm from '../components/BlogForm'; // BlogForm'u import ettik

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState({ projects: true, blogs: true, messages: true });

  // --- PROJE STATE'LERİ ---
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  // --- BLOG STATE'LERİ ---
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);

  // --- MESAJ STATE'LERİ ---
  const [messages, setMessages] = useState([]);

  const loadContent = useCallback((type, url, protectedRequest = false) => {
    const headers = protectedRequest
      ? { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      : {};
    return axios.get(url, { headers, timeout: 15000 })
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error('Unexpected API response');
        ({ projects: setProjects, blogs: setBlogs, messages: setMessages })[type](data);
        setErrors(previous => ({ ...previous, [type]: '' }));
      })
      .catch(() => {
        setErrors(previous => ({ ...previous, [type]: `Unable to load ${type}. Please try again.` }));
      })
      .finally(() => setPending(previous => ({ ...previous, [type]: false })));
  }, []);

  const reloadContent = (type, url, protectedRequest = false) => {
    setPending(previous => ({ ...previous, [type]: true }));
    setErrors(previous => ({ ...previous, [type]: '' }));
    return loadContent(type, url, protectedRequest);
  };
  const fetchProjects = () => reloadContent('projects', '/api/projects');
  const fetchBlogs = () => reloadContent('blogs', '/api/blogs');
  const fetchMessages = () => reloadContent('messages', '/api/contact', true);

  useEffect(() => {
    loadContent('projects', '/api/projects');
    loadContent('blogs', '/api/blogs');
    loadContent('messages', '/api/contact', true);
  }, [loadContent]);

  // --- ÇIKIŞ YAP ---
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  // Sekme butonları için ortak stil (aktif / pasif, açık / koyu tema)
  const tabClass = (tab) =>
    `px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
      activeTab === tab
        ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
        : 'border border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="admin-content max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 font-sans text-gray-800 dark:text-slate-200">
        <header className="flex flex-wrap gap-4 justify-between items-center mb-8 border-b border-gray-200 dark:border-slate-800 pb-4">
          <div><p className="font-mono text-xs tracking-widest text-emerald-400 mb-2">PORTFOLIO / WORKSPACE</p><h1 className="text-3xl font-semibold text-slate-100">Content manager</h1><p className="text-sm text-slate-400 mt-2">Manage projects, writing, and your inbox.</p></div>
          <button onClick={handleLogout} className="border border-slate-700 hover:border-slate-500 text-slate-300 font-medium py-2 px-4 rounded-lg transition-colors">
            Log Out
          </button>
        </header>

        {/* SEKMELER */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-4">
          <button onClick={() => { setActiveTab('projects'); setFormOpen(false); setEditingProject(null); setEditingBlog(null); }} className={tabClass('projects')}>
            Projects
          </button>
          <button onClick={() => { setActiveTab('blogs'); setFormOpen(false); setEditingProject(null); setEditingBlog(null); }} className={tabClass('blogs')}>
            Blogs
          </button>
          <button onClick={() => { setActiveTab('messages'); setFormOpen(false); setEditingProject(null); setEditingBlog(null); }} className={tabClass('messages')}>
            Messages
            {messages.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center text-xs font-bold bg-emerald-600 text-white rounded-full px-2 py-0.5">
                {messages.length}
              </span>
            )}
          </button>
        </div>

        {notice && <div role="status" className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-300">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}
        {errors[activeTab] && <div role="alert" className="mb-6 rounded-lg border border-red-400/20 bg-red-400/5 p-4 text-red-300">{errors[activeTab]} <button className="ml-3 underline" onClick={() => ({ projects: fetchProjects, blogs: fetchBlogs, messages: fetchMessages })[activeTab]()}>Try again</button></div>}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div><h2 className="text-xl font-semibold capitalize">{activeTab}</h2><p className="text-sm text-slate-400 mt-1">{pending[activeTab] ? 'Loading content…' : `${({projects, blogs, messages})[activeTab].length} items`}</p></div>
          {activeTab !== 'messages' && !formOpen && <button className="rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300" onClick={() => { setFormOpen(true); setNotice(''); }}>+ New {activeTab === 'projects' ? 'project' : 'post'}</button>}
        </div>
        {/* --- PROJELER SEKMESİ --- */}
        {activeTab === 'projects' && (
          <section>
            {formOpen && <ProjectForm
              key={editingProject?._id || "new"}
              onCancel={() => { setFormOpen(false); setEditingProject(null); }}
              editProject={editingProject}
              onComplete={() => {
                setEditingProject(null);
                setFormOpen(false);
                setNotice("Project saved successfully.");
                fetchProjects();
              }}
            />}

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="p-4 font-semibold text-gray-700 dark:text-slate-300">Project Name</th>
                    <th className="p-4 font-semibold text-gray-700 dark:text-slate-300 w-48">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p._id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-gray-800 dark:text-slate-200 font-medium">{p.title}</td>
                      <td className="p-4 space-x-4">
                        <button onClick={() => { setFormOpen(true); setEditingProject(p); window.scrollTo(0, 0); }} className="text-emerald-400 hover:text-emerald-300 font-medium">Edit</button>
                        <button onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this project?')) {
                            await axios.delete(`/api/projects/${p._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
                            await invalidateContent('projects', p._id);
                            fetchProjects();
                          }
                        }} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {!pending.projects && !errors.projects && projects.length === 0 && <tr><td colSpan="2" className="p-4 text-gray-500 dark:text-slate-500 italic text-center">No projects added yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* --- BLOGLAR SEKMESİ --- */}
        {activeTab === 'blogs' && (
          <section>
            {formOpen && <BlogForm
              key={editingBlog?._id || "new"}
              onCancel={() => { setFormOpen(false); setEditingBlog(null); }}
              editBlog={editingBlog}
              onComplete={() => {
                setEditingBlog(null);
                setFormOpen(false);
                setNotice("Blog saved successfully.");
                fetchBlogs();
              }}
            />}

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="p-4 font-semibold text-gray-700 dark:text-slate-300">Blog Title</th>
                    <th className="p-4 font-semibold text-gray-700 dark:text-slate-300 w-48">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map(b => (
                    <tr key={b._id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-gray-800 dark:text-slate-200 font-medium">{b.title}</td>
                      <td className="p-4 space-x-4">
                        <button onClick={() => { setFormOpen(true); setEditingBlog(b); window.scrollTo(0, 0); }} className="text-emerald-400 hover:text-emerald-300 font-medium">Edit</button>
                        <button onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this blog post?')) {
                            await axios.delete(`/api/blogs/${b._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
                            await invalidateContent('blogs', b._id);
                            fetchBlogs();
                          }
                        }} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {!pending.blogs && !errors.blogs && blogs.length === 0 && <tr><td colSpan="2" className="p-4 text-gray-500 dark:text-slate-500 italic text-center">No blog posts added yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* --- MESAJLAR SEKMESİ --- */}
        {activeTab === 'messages' && (
          <section className="space-y-4">
            {messages.map(m => (
              <div key={m._id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-slate-100">{m.name}</p>
                    <a href={`mailto:${m.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{m.email}</a>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-xs text-gray-500 dark:text-slate-400">{new Date(m.createdAt).toLocaleString()}</span>
                    <button
                      onClick={async () => {
                        if (window.confirm('Delete this message?')) {
                          await axios.delete(`/api/contact/${m._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
                          fetchMessages();
                        }
                      }}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-gray-700 dark:text-slate-300 whitespace-pre-wrap break-words">{m.message}</p>
              </div>
            ))}
            {!pending.messages && !errors.messages && messages.length === 0 && (
              <p className="p-4 text-gray-500 dark:text-slate-500 italic text-center">No messages yet.</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
