import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GitHubCalendar } from 'react-github-calendar';
import HeroRain from '../components/HeroRain';
import CodeLoader from '../components/CodeLoader';
import ContactForm from '../components/ContactForm';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const Home = () => {
    useDocumentMeta({
        title: null,
        description: 'Personal portfolio of Kemal Özyön — backend-focused software developer building scalable APIs, data-driven applications, and AI-powered agentic systems. Browse projects and blog posts.',
        path: '/',
    });
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [latestBlogs, setLatestBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showScroll, setShowScroll] = useState(true);

    useEffect(() => {
        const onScroll = () => setShowScroll(window.scrollY < 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, blogsRes] = await Promise.all([
                    axios.get('/api/projects'),
                    axios.get('/api/blogs')
                ]);
                setFeaturedProjects(projectsRes.data.filter(p => p.isFeatured === true));
                setLatestBlogs(blogsRes.data.slice(0, 3));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-gray-50 dark:bg-slate-950 font-sans text-gray-800 dark:text-slate-200 transition-colors duration-300">

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-6 dark:bg-slate-950">

                <HeroRain />

                {/* Animated background blobs */}
                <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-300 opacity-25 blur-3xl animate-blob" />
                <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full bg-teal-300 opacity-20 blur-3xl animate-blob [animation-delay:3s]" />
                <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-emerald-200 opacity-15 blur-3xl animate-blob [animation-delay:5.5s]" />

                {/* Hero content */}
                <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <p
                        className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 mb-5 animate-fade-in-up"
                        style={{ animationDelay: '0ms' }}
                    >
                        Backend-Focused Software Developer + AI Enthusiast
                    </p>
                    <h1
                        className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight animate-fade-in-up"
                        style={{ animationDelay: '120ms' }}
                    >
                        Hi, I'm{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                            Kemal Özyön
                        </span>
                    </h1>
                    <p
                        className="text-xl md:text-2xl text-gray-500 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up"
                        style={{ animationDelay: '240ms' }}
                    >
                        I design and develop scalable backend systems, APIs, and data-driven applications. Currently focused on backend engineering, and AI-powered agentic systems.
                    </p>
                    <div
                        className="flex justify-center mb-6 animate-fade-in-up"
                        style={{ animationDelay: '360ms' }}
                    >
                        <a
                            href="/Kemal-Ozyon-CV.pdf"
                            download="Kemal-Ozyon-CV.pdf"
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                            </svg>
                            Download Resume
                        </a>
                    </div>
                    <div
                        className="flex gap-5 justify-center animate-fade-in-up"
                        style={{ animationDelay: '480ms' }}
                    >
                        {/* GitHub */}
                        <a
                            href="https://github.com/kemalozyon"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 dark:bg-slate-800 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:scale-110 transition-all shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/in/kemal-%C3%B6zy%C3%B6n-a02a13284/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 dark:bg-slate-800 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:scale-110 transition-all shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>

                        {/* X (Twitter) */}
                        <a
                            href="https://x.com/feanor_craft"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X"
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 dark:bg-slate-800 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:scale-110 transition-all shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.638 5.903-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Scroll indicator */}
                {showScroll && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 animate-scroll-bounce pointer-events-none">
                        <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">Scroll</span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                )}
            </section>

            {/* ── BELOW THE FOLD ───────────────────────────────────────── */}
            <div className="bg-gray-50 dark:bg-slate-950">

                {/* GitHub Activity */}
                <section className="max-w-5xl mx-auto px-6 py-20">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 flex flex-col items-center">
                        <div className="w-full mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 italic">My Coding Journey</h2>
                                <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">My activity on GitHub over the past year</p>
                            </div>
                            <a
                                href="https://github.com/kemalozyon"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-black transition-all shadow-md"
                            >
                                Visit My Profile
                            </a>
                        </div>
                        <div className="w-full overflow-x-auto py-4 flex justify-center">
                            <GitHubCalendar
                                username="kemalozyon"
                                blockSize={12}
                                blockMargin={4}
                                fontSize={14}
                                colorScheme="light"
                                labels={{ totalCount: '{{count}} contributions in the last year' }}
                            />
                        </div>
                    </div>
                </section>

                <main className="max-w-5xl mx-auto px-6 pb-24 space-y-24">

                    {/* Featured Projects */}
                    <section>
                        <div className="flex justify-between items-end mb-8 border-b-2 border-gray-200 dark:border-slate-800 pb-3">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Featured Projects</h2>
                            <Link to="/projects" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 font-medium">See All →</Link>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <CodeLoader label="projects" compact />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {featuredProjects.map((project) => (
                                    <Link
                                        to={`/projects/${project._id}`}
                                        key={project._id}
                                        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-xl dark:hover:shadow-slate-900 transition-all duration-300 block"
                                    >
                                        {project.coverImageUrl && (
                                            <img src={project.coverImageUrl} alt={project.title} className="w-full h-52 object-cover" />
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-2xl font-bold mb-3 dark:text-slate-100">{project.title}</h3>
                                            <p className="text-gray-600 dark:text-slate-400 mb-6">{project.description}</p>
                                        </div>
                                    </Link>
                                ))}
                                {featuredProjects.length === 0 && (
                                    <p className="text-gray-500 dark:text-slate-500">No featured projects found.</p>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Blogs */}
                    <section>
                        <div className="flex justify-between items-end mb-8 border-b-2 border-gray-200 dark:border-slate-800 pb-3">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Blogs</h2>
                            <Link to="/blogs" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 font-medium">All Posts →</Link>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <CodeLoader label="blogs" compact />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {latestBlogs.length === 0 ? (
                                    <p className="text-gray-500 dark:text-slate-500 italic">No blogs found.</p>
                                ) : (
                                    latestBlogs.map((blog) => (
                                        <Link
                                            to={`/blogs/${blog._id}`}
                                            key={blog._id}
                                            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 block"
                                        >
                                            <article className="p-6 flex justify-between items-center">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">{blog.title}</h3>
                                                <span className="text-sm text-gray-500 dark:text-slate-400 shrink-0 ml-4">
                                                    {new Date(blog.createdAt).toLocaleDateString('en-US')}
                                                </span>
                                            </article>
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </section>

                </main>

                {/* Contact */}
                <ContactForm />
            </div>
        </div>
    );
};

export default Home;
