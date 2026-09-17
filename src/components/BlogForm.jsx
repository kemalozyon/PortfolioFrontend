// frontend/src/components/BlogForm.jsx
import { useState } from 'react';
import axios from 'axios';

const BlogForm = ({ editBlog, onComplete, onCancel }) => {
  const [title, setTitle] = useState(editBlog?.title || '');
  const [slug, setSlug] = useState(editBlog?.slug || '');
  const [markdownContent, setMarkdownContent] = useState(editBlog?.markdownContent || '');
  const [imageFile, setImageFile] = useState(null);
  const [tags, setTags] = useState(editBlog?.tags?.join(', ') || '');
  const [isPublished, setisPublished] = useState(editBlog?.isPublished || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
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
      } else {
        // YENİ EKLEME (POST)
        await axios.post('/api/blogs', blogData, {
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
          {editBlog ? 'Edit Blog' : 'Add New Blog'}
        </h3>
        {editBlog && (
          <span className="bg-emerald-400/10 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded">
            Editing
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sol Kolon */}
        <div className="space-y-4">
          <div>
            <label htmlFor="blogform-0" className="block text-sm font-semibold text-slate-300 mb-1">Blog Title <span className="text-red-500">*</span></label>
            <input id="blogform-0"
              className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-500 border border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
              type="text"
              placeholder="E.g. State Management in React"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="blogform-1" className="block text-sm font-semibold text-slate-300 mb-1">URL Slug <span className="text-red-500">*</span></label>
            <input id="blogform-1"
              className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-500 border border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
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
            <label htmlFor="blogform-2" className="block text-sm font-semibold text-slate-300 mb-1">Tags</label>
            <input id="blogform-2"
              className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-500 border border-slate-700 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
              type="text"
              placeholder="JavaScript, React, Frontend (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>


          <div>
            <label htmlFor="blog-cover" className="block text-sm font-semibold text-slate-300 mb-1">Cover image</label>
            <input id="blog-cover" type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0] || null)} className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-sm text-slate-300" />
            {editBlog?.coverImageURL && <p className="mt-2 text-xs text-slate-400">Leave empty to keep the current image.</p>}
          </div>
          <div className="flex items-center mt-6">
            <input
              id="isPublishedBlog"
              type="checkbox"
              className="w-4 h-4 accent-emerald-400 bg-slate-950 border-slate-700 rounded focus:ring-emerald-400 cursor-pointer"
              checked={isPublished}
              onChange={(e) => setisPublished(e.target.checked)}
            />
            <label htmlFor="isPublishedBlog" className="ml-2 text-sm font-semibold text-slate-100 cursor-pointer">
              Publish this post
            </label>
          </div>
        </div>
      </div>

      {/* Alt Kısım - Uzun Markdown */}
      <div>
        <label htmlFor="blogform-3" className="block text-sm font-semibold text-slate-300 mb-1">Blog Content (Markdown)</label>
        <textarea id="blogform-3"
          className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-500 border border-slate-700 p-3 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition-all font-mono text-sm"
          rows="12"
          placeholder="Write your content here in Markdown format..."
          value={markdownContent}
          onChange={(e) => setMarkdownContent(e.target.value)}
          required
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
          {loading ? 'Processing...' : (editBlog ? 'Save Changes' : 'Save Post')}
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

export default BlogForm;
