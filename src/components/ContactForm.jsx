import { useState } from 'react';
import axios from 'axios';

const initialForm = { name: '', email: '', message: '' };

const ContactForm = () => {
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setError('');
        try {
            await axios.post('/api/contact', form);
            setStatus('success');
            setForm(initialForm);
        } catch (err) {
            setStatus('error');
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <section id="contact" className="max-w-3xl mx-auto px-6 pb-24">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100">Get In Touch</h2>
                    <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">
                        Have a question or want to work together? Send me a message.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-10">
                        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                            <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-slate-100">Thanks for reaching out!</p>
                        <p className="text-gray-500 dark:text-slate-400 mt-1">I'll get back to you as soon as I can.</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-6 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 font-medium"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={5}
                                maxLength={2000}
                                value={form.message}
                                onChange={handleChange}
                                placeholder="What's on your mind?"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-y"
                            />
                        </div>

                        {status === 'error' && (
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-7 py-3 rounded-full font-bold shadow-lg hover:scale-[1.02] transition-all"
                        >
                            {status === 'sending' ? 'Sending…' : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default ContactForm;
