import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CodeLoader from '../components/CodeLoader';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useDocumentMeta({
    title: 'Blog',
    description: 'Writing by Kemal Ozyon on backend engineering, APIs, AI-powered agentic systems, and software development.',
    path: '/blogs',
  });

  useEffect(() => {
    axios.get('/api/blogs')
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-6">
      <CodeLoader label="blogs" />
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-100 mb-8">My Blog Posts</h1>
        <div className="space-y-6">
          {blogs.map((blog) => (
            <Link
              to={`/blogs/${blog._id}`}
              key={blog._id}
              className="block bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-xl dark:hover:shadow-slate-900 transition-all duration-300"
            >
              <article className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{blog.title}</h3>
                  <time className="text-sm font-medium text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-full shrink-0 ml-4">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-xs px-2.5 py-1 rounded-md">#{tag}</span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
