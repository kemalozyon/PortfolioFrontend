import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import axios from 'axios';
import TableOfContents from '../components/TableOfContents';
import CodeBlock from '../components/CodeBlock';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 dark:text-slate-300">Loading...</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 dark:text-slate-300">Project not found.</div>;

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/projects" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">← Back to Projects</Link>

        {project.coverImageUrl && (
          <img src={project.coverImageUrl} alt={project.title} className="w-full h-80 object-cover rounded-2xl mb-8 shadow-sm" />
        )}

        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-100 mb-4">{project.title}</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.technologies.map((tech, index) => (
            <span key={index} className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-sm font-semibold px-3 py-1 rounded-full">{tech}</span>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 mb-8">
          <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed">{project.description}</p>
        </div>

        {project.markdownContent ? (
          <div className="flex gap-12">
            <TableOfContents content={project.markdownContent} />
            <div className="min-w-0 flex-1">
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-slate-300 border-t border-gray-200 dark:border-slate-800 pt-10 prose-a:text-gray-900 dark:prose-a:text-emerald-400 prose-a:font-medium prose-a:underline prose-a:decoration-emerald-400 prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-emerald-600 hover:prose-a:decoration-emerald-600">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-slate-100">Project Details</h2>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSlug]}
                  components={{ code: CodeBlock }}
                >
                  {project.markdownContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 dark:text-slate-600 italic">No detailed description has been added for this project yet.</p>
        )}

        <div className="flex gap-4 mt-10">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-gray-900 dark:bg-slate-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-slate-700 font-medium transition-colors">
              GitHub Repository
            </a>
          )}
          {project.liveDemoLink && (
            <a href={project.liveDemoLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors">
              Go to Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
