import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { t } = useTranslation();

  const faqs = t('faq.items', { returnObjects: true }) as Array<{ question: string; answer: string }>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar showBack backLabel={t('navbar.back')} />
      
      <main className="pt-20">
         {/* Hero */}
         <section className="bg-blue-600 text-white py-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
               <h1 className="text-4xl md:text-5xl font-black mb-4">{t('faq.title')}</h1>
               <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                 {t('faq.subtitle')}
               </p>
            </div>
         </section>

         {/* FAQ Accordion */}
         <section className="py-20 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <AccordionItem key={idx} question={faq.question} answer={faq.answer} />
                  ))}
               </div>
            </div>
         </section>

         {/* Support Block */}
         <section className="py-20 text-center">
            <div className="max-w-xl mx-auto px-4">
               <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('faq.supportTitle')}</h3>
               <p className="text-gray-600 mb-8">
                 {t('faq.supportText')}
               </p>
               <a 
                 href="/#contato" 
                 className="btn btn-primary px-8 py-3 rounded-xl shadow-lg"
               >
                 {t('faq.supportButton')}
               </a>
            </div>
         </section>
      </main>

      <Footer />
    </div>
  );
}

function AccordionItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className="text-lg font-bold text-gray-900 pr-8">{question}</span>
        <div className={`w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-100 text-blue-600' : 'text-gray-400'}`}>
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
           </svg>
        </div>
      </button>
      <div 
        className={`px-6 text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {answer}
      </div>
    </div>
  );
}
