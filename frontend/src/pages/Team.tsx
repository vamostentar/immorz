import { Footer } from '@/components/Footer';
import { MeetOurTeam } from '@/components/MeetOurTeam';
import { Navbar } from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Team() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Voltar para a Home</span>
          </Link>
        </div>
        
        <MeetOurTeam />
      </main>

      <Footer />
    </div>
  );
}
