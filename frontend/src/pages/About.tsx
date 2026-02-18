import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const reasons = t('about.reasons', { returnObjects: true }) as Array<{ title: string; desc: string }>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar showBack backLabel={t('navbar.back')} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gray-50 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-20" />
             <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-100/30 skew-x-12 -translate-x-20" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                {t('about.title', { brand: 'RibeiraZul' })}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t('about.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative animate-fade-in-up">
                <img 
                  src="https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=1200&q=80" 
                  alt="Nossa Equipa" 
                  className="rounded-3xl shadow-2xl relative z-10"
                />
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-100 rounded-full blur-3xl -z-10" />
                <div className="absolute -top-6 -left-6 w-48 h-48 bg-amber-100 rounded-full blur-3xl -z-10" />
              </div>
              
              <div className="space-y-8 animate-fade-in-up animate-delay-200">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.missionTitle')}</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {t('about.missionText')}
                  </p>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.visionTitle')}</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {t('about.visionText')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="p-4 bg-blue-50 rounded-2xl">
                    <div className="text-3xl font-black text-blue-600 mb-1">15+</div>
                    <div className="text-sm font-semibold text-gray-700">{t('about.expLabel')}</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl">
                    <div className="text-3xl font-black text-amber-500 mb-1">500+</div>
                    <div className="text-sm font-semibold text-gray-700">{t('about.clientsLabel')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('about.whyChooseTitle')}</h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {reasons.map((item, idx) => (
                <div key={idx} className="bg-gray-800 p-8 rounded-2xl hover:bg-gray-700 transition-colors duration-300">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-900/50">
                    {/* Icons logic remains similar, ideally mapped if distinct icons are needed per item */}
                    {idx === 0 && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                    {idx === 1 && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                    {idx === 2 && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
           <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
             <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('about.ctaTitle')}</h2>
             <p className="text-xl text-blue-100 mb-8">{t('about.ctaText')}</p>
             <a 
               href="/#contato" 
               className="inline-block bg-white text-blue-600 font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
             >
               {t('about.ctaButton')}
             </a>
           </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
