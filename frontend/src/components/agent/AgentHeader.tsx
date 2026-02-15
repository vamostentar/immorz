import { AgentProfile } from '../../api/agent-queries';

interface AgentHeaderProps {
    agent: AgentProfile;
}

export function AgentHeader({ agent }: AgentHeaderProps) {
    const fullName = `${agent.firstName} ${agent.lastName}`;

    return (
        <div className="relative mb-12">
            {/* Main Hero Card with vibrant gradient */}
            <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white rounded-3xl shadow-2xl overflow-hidden min-h-[220px] flex items-center px-8 sm:px-12 relative">
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>

                <div className="flex flex-col md:flex-row items-center gap-8 z-10 w-full py-10 md:py-0">
                    {/* Avatar Container with slight overlap */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
                        <div className="relative">
                            {agent.avatar ? (
                                <img
                                    src={agent.avatar}
                                    alt={fullName}
                                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/20 shadow-2xl object-cover transform transition-transform duration-500 group-hover:rotate-1"
                                />
                            ) : (
                                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/20 shadow-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl font-extrabold text-white">
                                    {agent.firstName?.[0]}{agent.lastName?.[0]}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Section with Glassmorphism Overlay */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl inline-block w-full sm:w-auto">
                            <h1 className="text-3xl sm:text-5xl font-black mb-2 tracking-tight">
                                {fullName}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                {agent.experience && (
                                    <span className="flex items-center gap-2 bg-blue-500/30 px-3 py-1 rounded-full text-blue-100 text-sm font-semibold border border-white/10">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {agent.experience} {agent.experience === 1 ? 'ano' : 'anos'} de experiência
                                    </span>
                                )}

                                {agent.rating && (
                                    <div className="flex items-center gap-1.5 bg-yellow-500/30 px-3 py-1 rounded-full text-yellow-100 text-sm font-semibold border border-white/10">
                                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        {agent.rating.toFixed(1)}
                                    </div>
                                )}
                            </div>

                            {/* Social Links with hover intensity */}
                            <div className="flex justify-center md:justify-start gap-5 mt-6 border-t border-white/10 pt-4">
                                {agent.linkedin && (
                                    <a
                                        href={agent.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/10 p-2 rounded-xl hover:bg-[#0077b5] hover:scale-110 transition-all duration-300 border border-white/5"
                                        aria-label="LinkedIn"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                )}
                                {agent.facebook && (
                                    <a
                                        href={agent.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/10 p-2 rounded-xl hover:bg-[#1877f2] hover:scale-110 transition-all duration-300 border border-white/5"
                                        aria-label="Facebook"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </a>
                                )}
                                {agent.instagram && (
                                    <a
                                        href={agent.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/10 p-2 rounded-xl hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:scale-110 transition-all duration-300 border border-white/5"
                                        aria-label="Instagram"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.070-4.85.070-3.204 0-3.584-.012-4.849-.070-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849 -.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
