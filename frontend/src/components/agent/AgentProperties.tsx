import { Link } from 'react-router-dom';
import { Property } from '../../api/agent-queries';

interface AgentPropertiesProps {
    properties: Property[];
}

export function AgentProperties({ properties }: AgentPropertiesProps) {
    if (!properties || properties.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
                <p className="text-gray-600 text-lg">
                    Este agente ainda não tem propriedades ativas.
                </p>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Propriedades ({properties.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <Link
                        key={property.id}
                        to={`/property/${property.id}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                        {/* Image */}
                        <div className="relative h-48 bg-gray-200">
                            {property.imageUrl ? (
                                <img
                                    src={property.imageUrl}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg
                                        className="w-16 h-16 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                        />
                                    </svg>
                                </div>
                            )}
                            {/* Price Badge */}
                            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                                €{property.price.toLocaleString()}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                                {property.title}
                            </h4>
                            <div className="flex items-center text-gray-600 text-sm">
                                <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                {property.location}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
