import { useState } from 'react';
import axios from 'axios';

const ProjectForm = ({ editProject, onComplete, onCancel }) => {
  const [title, setTitle] = useState(editProject?.title || '');
  const [description, setDescription] = useState(editProject?.description || '');
  const [markdownContent, setMarkdownContent] = useState(editProject?.markdownContent || '');
  const [technologies, setTechnologies] = useState(editProject?.technologies?.join(', ') || '');
  const [githubLink, setGithubLink] = useState(editProject?.githubLink || '');
  const [liveDemoLink, setLiveDemoLink] = useState(editProject?.liveDemoLink || '');
  const [imageFile, setImageFile] = useState(null);
  const [isFeatured, setIsFeatured] = useState(editProject?.isFeatured || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      let coverImageUrl = editProject ? editProject.coverImageUrl : '';

      // Yeni resim seçildiyse yükle
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        coverImageUrl = uploadRes.data.url;
      }

      // Veriyi backend'e uygun hale getir
      const projectData = {
        title,
        description,
        markdownContent,
        technologies: technologies.split(',').map(t => t.trim()).filter(t => t !== ''),
        githubLink,
        liveDemoLink,
        coverImageUrl,
        isFeatured
      };

      if (editProject) {
        // GÜNCELLEME (PUT)
        await axios.put(`/api/projects/${editProject._id}`, projectData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // YENİ EKLEME (POST)
        await axios.post('/api/projects', projectData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      onComplete(); // Listeyi yenilemek için üst bileşene haber ver
    } catch (err) {
      console.error(err);
      setError('Could not save. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form space-y-6 p-5 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900 mb-8">

      <div className="border-b border-slate-800 pb-4 mb-4 flex flex-wrap gap-3 justify-between items-center">
        <h3 className="text-2xl font-bold text-slate-100">
          {editProject ? 'Edit Project' : 'Add New Project'}
        </h3>
        {editProject && (
          <span className="bg-emerald-400/10 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded">
            Editing
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sol Kolon */}
        <div className="space-y-4">
          <div>
            <label htmlFor="projectform-0" className="block text-sm font-semibold text-slate-300 mb-1">Project Title <span className="text-red-500">*</span></label>
            <input id="projectform-0"
              className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-500 border border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
              type="text"
              placeholder="E.g. E-Commerce App"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="projectform-1" className="block text-sm font-semibold text-slate-300 mb-1">Short Description <span className="text-red-500">*</span></label>
            <textarea id="projectform-1"
              className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-500 border border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
              rows="3"
              placeholder="Short summary visible on the card..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="projectform-2" className="block text-sm font-semibold text-slate-300 mb-1">Technologies</label>
            <input id="projectform-2"
              className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-500 border border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
              type="text"
              placeholder="React, Node.js, MongoDB (comma-separated)"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
            />
          </div>
        </div>

        {/* Sağ Kolon */}
        <div className="space-y-4">
          <div>
            <label htmlFor="projectform-3" className="block text-sm font-semibold text-slate-300 mb-1">GitHub Link</label>
            <input id="projectform-3"
              className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-500 border border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
              type="url"
              placeholder="https://github.com/..."
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="projectform-4" className="block text-sm font-semibold text-slate-300 mb-1">Live Demo Link</label>
            <input id="projectform-4"
              className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-500 border border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
              type="url"
              placeholder="https://my-project.com"
              value={liveDemoLink}
              onChange={(e) => setLiveDemoLink(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="projectform-5" className="block text-sm font-semibold text-slate-300 mb-1">
              Cover Image {editProject && <span className="text-xs text-slate-400 font-normal">(Leave empty to keep the current image)</span>}
            </label>
            <input id="projectform-5"
              className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-500 border border-slate-700 p-2 rounded-lg bg-slate-950 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          <div className="flex items-center mt-6">
            <input
              id="isFeatured"
              type="checkbox"
              className="w-4 h-4 accent-emerald-400 bg-slate-950 border-slate-700 rounded focus:ring-emerald-400 cursor-pointer"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            <label htmlFor="isFeatured" className="ml-2 text-sm font-semibold text-slate-100 cursor-pointer">
              Feature on Home Page
            </label>
          </div>
        </div>
      </div>

      {/* Alt Kısım - Uzun Markdown */}
      <div>
        <label htmlFor="projectform-6" className="block text-sm font-semibold text-slate-300 mb-1">Detailed Project Content (Markdown)</label>
        <textarea id="projectform-6"
          className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-500 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all font-mono text-sm"
          rows="8"
          placeholder="Describe the architecture, challenges, and solutions in Markdown format..."
          value={markdownContent}
          onChange={(e) => setMarkdownContent(e.target.value)}
        />
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300">{error}</p>}
      {/* Aksiyon Butonları */}
      <div className="flex gap-4 pt-4 border-t border-slate-800">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 md:flex-none bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : (editProject ? 'Save Changes' : 'Upload Project')}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 md:flex-none border border-slate-700 hover:border-slate-500 text-slate-300 font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;
