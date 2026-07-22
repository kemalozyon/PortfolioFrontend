// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProjectForm from '../components/ProjectForm';
import BlogForm from '../components/BlogForm'; // BlogForm'u import ettik

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');

  // --- PROJE STATE'LERİ ---
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  // --- BLOG STATE'LERİ ---
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);

  // --- MESAJ STATE'LERİ ---
  const [messages, setMessages] = useState([]);

  // --- VERİ ÇEKME FONKSİYONLARI ---
  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/api/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  // Mesajlar korumalı bir endpoint olduğu için JWT token'ı ile çekilir
  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/contact', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  // Sayfa yüklendiğinde projeleri, blogları ve mesajları getir
  useEffect(() => {
    fetchProjects();
    fetchBlogs();
    fetchMessages();
  }, []);

  // --- ÇIKIŞ YAP ---
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Log Out
        </button>
      </header>
      
      {/* SEKMELER */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('projects')} 
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'projects' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'blogs' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Blogs
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'messages' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Messages
          {messages.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center text-xs font-bold bg-emerald-600 text-white rounded-full px-2 py-0.5">
              {messages.length}
            </span>
          )}
        </button>
      </div>

      {/* --- PROJELER SEKMESİ --- */}
      {activeTab === 'projects' && (
        <section>
          <ProjectForm 
            editProject={editingProject} 
            onComplete={() => {
              setEditingProject(null);
              fetchProjects();
            }} 
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Project Name</th>
                  <th className="p-4 font-semibold text-gray-700 w-48">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-800 font-medium">{p.title}</td>
                    <td className="p-4 space-x-4">
                      <button onClick={() => { setEditingProject(p); window.scrollTo(0, 0); }} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                      <button onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this project?')) {
                          await axios.delete(`/api/projects/${p._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
                          fetchProjects();
                        }
                      }} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && <tr><td colSpan="2" className="p-4 text-gray-500 italic text-center">No projects added yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* --- BLOGLAR SEKMESİ --- */}
      {activeTab === 'blogs' && (
        <section>
          <BlogForm 
            editBlog={editingBlog} 
            onComplete={() => {
              setEditingBlog(null);
              fetchBlogs();
            }} 
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Blog Title</th>
                  <th className="p-4 font-semibold text-gray-700 w-48">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(b => (
                  <tr key={b._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-800 font-medium">{b.title}</td>
                    <td className="p-4 space-x-4">
                      <button onClick={() => { setEditingBlog(b); window.scrollTo(0, 0); }} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                      <button onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this blog post?')) {
                          await axios.delete(`/api/blogs/${b._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
                          fetchBlogs();
                        }
                      }} className="text-red-600 hover:text-red-800 font-medium">Sil</button>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && <tr><td colSpan="2" className="p-4 text-gray-500 italic text-center">No blog posts added yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* --- MESAJLAR SEKMESİ --- */}
      {activeTab === 'messages' && (
        <section className="space-y-4">
          {messages.map(m => (
            <div key={m._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-sm text-blue-600 hover:underline">{m.email}</a>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</span>
                  <button
                    onClick={async () => {
                      if (window.confirm('Delete this message?')) {
                        await axios.delete(`/api/contact/${m._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
                        fetchMessages();
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-3 text-gray-700 whitespace-pre-wrap break-words">{m.message}</p>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="p-4 text-gray-500 italic text-center">No messages yet.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;