import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import TableOfContents from '../components/TableOfContents';
import CodeBlock from '../components/CodeBlock';
import CodeLoader from '../components/CodeLoader';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const stripMarkdown = (md = '') =>
  md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/blogs/${id}`)
      .then(res => setBlog(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  useDocumentMeta({
    title: blog?.title,
    description: blog ? stripMarkdown(blog.markdownContent).slice(0, 160) : null,
    path: `/blogs/${id}`,
    image: blog?.coverImageURL,
    type: 'article',
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-6">
      <CodeLoader label="blog-post" />
    </div>
  );
  if (!blog)    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 dark:text-slate-300">Blog post not found.</div>;

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/blogs" className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block">← Back to Blogs</Link>

        <div className="flex gap-12 mt-2">
          <TableOfContents content={blog.markdownContent} />

          <div className="min-w-0 flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-slate-100 mb-4">{blog.title}</h1>
            <div className="flex gap-4 items-center mb-10 border-b border-gray-200 dark:border-slate-800 pb-6">
              <time className="text-gray-500 dark:text-slate-400 font-medium">
                {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <div className="flex gap-2 flex-wrap">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-xs px-2.5 py-1 rounded-md">#{tag}</span>
                ))}
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-slate-300 leading-relaxed prose-a:text-gray-900 dark:prose-a:text-emerald-400 prose-a:font-medium prose-a:underline prose-a:decoration-emerald-400 prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-emerald-600 hover:prose-a:decoration-emerald-600">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={{ code: CodeBlock }}
              >
                {blog.markdownContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
