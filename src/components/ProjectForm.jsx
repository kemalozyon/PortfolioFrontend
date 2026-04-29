import { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectForm = ({ editProject, onComplete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [liveDemoLink, setLiveDemoLink] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  // EĞER "GÜNCELLE" BUTONUNA BASILDIYSA FORMU DOLDUR
  useEffect(() => {
    if (editProject) {
      setTitle(editProject.title || '');
      setDescription(editProject.description || '');
      setMarkdownContent(editProject.markdownContent || '');
      // Teknolojiler diziyse virgüllü stringe çevir, değilse boş bırak
      setTechnologies(editProject.technologies ? editProject.technologies.join(', ') : '');
      setGithubLink(editProject.githubLink || '');
      setLiveDemoLink(editProject.liveDemoLink || '');
      setIsFeatured(editProject.isFeatured || false);
      setImageFile(null); // Dosya inputunu her zaman sıfırla
    } else {
      // Düzenleme modunda değilsek formu sıfırla
      setTitle(''); setDescription(''); setMarkdownContent('');
      setTechnologies(''); setGithubLink(''); setLiveDemoLink('');
      setIsFeatured(false);
      setImageFile(null);
    }
  }, [editProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        alert('Project updated successfully!');
      } else {
        // YENİ EKLEME (POST)
        await axios.post('/api/projects', projectData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('New project added successfully!');
      }
      
      onComplete(); // Listeyi yenilemek için üst bileşene haber ver
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 mb-10">
      
      <div className="border-b pb-4 mb-4 flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">
          {editProject ? 'Edit Project' : 'Add New Project'}
        </h3>
        {editProject && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            Edit Mode Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sol Kolon */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title <span className="text-red-500">*</span></label>
            <input
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              type="text"
              placeholder="E.g. E-Commerce App" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
            <textarea
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              rows="3"
              placeholder="Short summary visible on the card..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Technologies</label>
            <input
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all"
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">GitHub Link</label>
            <input 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all" 
              type="url" 
              placeholder="https://github.com/..." 
              value={githubLink} 
              onChange={(e) => setGithubLink(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Live Demo Link</label>
            <input 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all" 
              type="url" 
              placeholder="https://my-project.com" 
              value={liveDemoLink} 
              onChange={(e) => setLiveDemoLink(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Cover Image {editProject && <span className="text-xs text-gray-500 font-normal">(Leave empty to keep the current image)</span>}
            </label>
            <input 
              className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 cursor-pointer" 
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])} 
            />
          </div>

          <div className="flex items-center mt-6">
            <input 
              id="isFeatured" 
              type="checkbox" 
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              checked={isFeatured} 
              onChange={(e) => setIsFeatured(e.target.checked)} 
            />
            <label htmlFor="isFeatured" className="ml-2 text-sm font-semibold text-gray-900 cursor-pointer">
              Feature on Home Page
            </label>
          </div>
        </div>
      </div>

      {/* Alt Kısım - Uzun Markdown */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Project Content (Markdown)</label>
        <textarea
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all font-mono text-sm"
          rows="8"
          placeholder="Describe the architecture, challenges, and solutions in Markdown format..." 
          value={markdownContent} 
          onChange={(e) => setMarkdownContent(e.target.value)} 
        />
      </div>
      
      {/* Aksiyon Butonları */}
      <div className="flex gap-4 pt-4 border-t border-gray-100">
        <button 
          type="submit" 
          disabled={loading} 
          className="flex-1 md:flex-none bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : (editProject ? 'Save Changes' : 'Upload Project')}
        </button>
        
        {editProject && (
          <button 
            type="button" 
            onClick={onComplete} 
            className="flex-1 md:flex-none bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;