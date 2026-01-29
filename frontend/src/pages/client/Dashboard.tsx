import { useAuth } from '@/context/AuthContext';

export default function ClientDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-sky-600">RibeiraZul Cliente</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">
                                Olá, {user?.firstName || 'Cliente'}
                            </span>
                            <button
                                onClick={() => logout()}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-700">Área do Cliente</h2>
                            <p className="mt-2 text-gray-500">Funcionalidades em breve...</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
