interface AgentStatsProps {
    experience: number | null;
    rating: number | null;
    reviewCount: number | null;
    specialties: string[];
    propertiesCount?: number;
}

export function AgentStats({
    experience,
    rating,
    reviewCount,
    specialties,
    propertiesCount = 0
}: AgentStatsProps) {
    const stats = [
        {
            label: 'Experiência',
            value: experience ? `${experience} ${experience === 1 ? 'Ano' : 'Anos'}` : 'Novo',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            )
        },
        {
            label: 'Avaliação',
            value: rating ? `${rating.toFixed(1)}` : 'S/ Ref.',
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            )
        },
        {
            label: 'Reviews',
            value: reviewCount || 0,
            color: 'text-green-600',
            bg: 'bg-green-50',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
            )
        },
        {
            label: 'Imóveis',
            value: propertiesCount,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        }
    ];

    return (
        <div className="mb-10 space-y-6">
            {/* Stats Ribbon */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sm:p-4">
                <div className="flex flex-wrap sm:flex-nowrap divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex-1 min-w-[50%] sm:min-w-0 p-4 flex items-center justify-center gap-4 group hover:bg-gray-50/50 transition-colors first:rounded-l-xl last:rounded-r-xl"
                        >
                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} transform transition-transform group-hover:scale-110`}>
                                {stat.icon}
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-900 leading-tight">
                                    {stat.value}
                                </div>
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Specialties - Modern Pill Tags */}
            {specialties && specialties.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900">Especialidades</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {specialties.map((specialty, index) => (
                            <span
                                key={index}
                                className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-full text-sm font-semibold border border-gray-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100 transition-all cursor-default shadow-sm"
                            >
                                {specialty}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
