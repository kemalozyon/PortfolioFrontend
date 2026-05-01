import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CodeLoader from '../components/CodeLoader';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useDocumentMeta({
    title: 'Projects',
    description: 'Software projects by Kemal Ozyon — backend systems, APIs, data-driven applications, and AI-powered tools.',
    path: '/projects',
  });

  useEffect(() => {
    axios.get('/api/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-6">
      <CodeLoader label="projects" />
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-100 mb-8">All My Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Link
              to={`/projects/${project._id}`}
              key={project._id}
              className="block bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-xl dark:hover:shadow-slate-900 transition-all duration-300"
            >
              {project.coverImageUrl && (
                <img src={project.coverImageUrl} alt={project.title} className="w-full h-52 object-cover border-b border-gray-100 dark:border-slate-800" />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-slate-100">{project.title}</h3>
                <p className="text-gray-600 dark:text-slate-400 mb-6">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">{tech}</span>
                  ))}
                </div>
                <div className="flex gap-4 border-t border-gray-100 dark:border-slate-800 pt-4">
                  {project.githubLink && <span className="text-gray-600 dark:text-slate-400 font-medium">GitHub</span>}
                  {project.liveDemoLink && <span className="text-emerald-600 dark:text-emerald-400 font-medium">Live Demo</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
