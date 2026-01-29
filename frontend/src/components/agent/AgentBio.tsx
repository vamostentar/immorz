interface AgentBioProps {
    bio: string | null;
}

export function AgentBio({ bio }: AgentBioProps) {
    if (!bio || bio.trim() === '') {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sobre</h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {bio}
            </div>
        </div>
    );
}
