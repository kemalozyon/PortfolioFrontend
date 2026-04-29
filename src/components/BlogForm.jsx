// frontend/src/components/BlogForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const BlogForm = ({ editBlog, onComplete }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [tags, setTags] = useState('');
  const [isPublished, setisPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  // EĞER "GÜNCELLE" BUTONUNA BASILDIYSA FORMU DOLDUR
  useEffect(() => {
    if (editBlog) {
      setTitle(editBlog.title || '');
      setSlug(editBlog.slug || '');
      setMarkdownContent(editBlog.markdownContent || '');
      // Etiketler diziyse virgüllü stringe çevir, değilse boş bırak
      setTags(editBlog.tags ? editBlog.tags.join(', ') : '');
      setisPublished(editBlog.isPublished || false);
      setImageFile(null); // Dosya inputunu her zaman sıfırla
    } else {
      // Düzenleme modunda değilsek formu sıfırla
      setTitle(''); setSlug(''); setMarkdownContent('');
      setTags(''); setisPublished(false); setImageFile(null);
    }
  }, [editBlog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      let coverImageURL = editBlog ? editBlog.coverImageURL : '';

      // Yeni resim seçildiyse yükle
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        coverImageURL = uploadRes.data.url;
      }

      // Veriyi backend'e uygun hale getir
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

      const blogData = {
        title,
        slug,
        markdownContent,
        coverImageURL,
        tags: tagsArray,
        isPublished
      };

      if (editBlog) {
        // GÜNCELLEME (PUT)
        await axios.put(`/api/blogs/${editBlog._id}`, blogData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Blog updated successfully!');
      } else {
        // YENİ EKLEME (POST)
        await axios.post('/api/blogs', blogData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('New blog added successfully!');
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
          {editBlog ? 'Edit Blog' : 'Add New Blog'}
        </h3>
        {editBlog && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            Edit Mode Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sol Kolon */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Blog Title <span className="text-red-500">*</span></label>
            <input
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              type="text"
              placeholder="E.g. State Management in React" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL Slug <span className="text-red-500">*</span></label>
            <input 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all" 
              type="text" 
              placeholder="state-management-in-react" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              required 
            />
          </div>

        </div>

        {/* Sağ Kolon */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tags</label>
            <input
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all"
              type="text"
              placeholder="JavaScript, React, Frontend (comma-separated)" 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
            />
          </div>


          <div className="flex items-center mt-6">
            <input 
              id="isPublishedBlog" 
              type="checkbox" 
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              checked={isPublished} 
              onChange={(e) => setisPublished(e.target.checked)} 
            />
            <label htmlFor="isPublishedBlog" className="ml-2 text-sm font-semibold text-gray-900 cursor-pointer">
              Feature on Home Page
            </label>
          </div>
        </div>
      </div>

      {/* Alt Kısım - Uzun Markdown */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Blog Content (Markdown)</label>
        <textarea
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none transition-all font-mono text-sm"
          rows="12"
          placeholder="Write your content here in Markdown format..." 
          value={markdownContent} 
          onChange={(e) => setMarkdownContent(e.target.value)} 
          required
        />
      </div>
      
      {/* Aksiyon Butonları */}
      <div className="flex gap-4 pt-4 border-t border-gray-100">
        <button 
          type="submit" 
          disabled={loading} 
          className="flex-1 md:flex-none bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : (editBlog ? 'Save Changes' : 'Publish Blog')}
        </button>
        
        {editBlog && (
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

export default BlogForm;