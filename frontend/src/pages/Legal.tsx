import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { useTranslation } from 'react-i18next';

export default function Legal() {
  const { t } = useTranslation();
  const brand = 'RibeiraZul';

  return (
    <div className="min-h-screen bg-white">
      <Navbar showBack />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <h1 className="text-4xl font-black text-gray-900 mb-8">{t('legal.title')}</h1>
        <div className="prose prose-gray max-w-none space-y-8">
          <p>{t('legal.intro', { brand })}</p>

          <h2>{t('legal.licensingTitle')}</h2>
          <h3>{t('legal.licensingSubtitle')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('legal.licensingText') }} />
          <p>
            {t('legal.licensingNote')}{' '}
            <a href="https://www.impic.pt" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
              {t('legal.licensingLink')}
            </a>.
          </p>

          <h2>{t('legal.insuranceTitle')}</h2>
          <p>{t('legal.insuranceText', { brand })}</p>

          <h2>{t('legal.ralTitle')}</h2>
          <p>{t('legal.ralIntro')}</p>
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <div>
              <strong>{t('legal.ralNational')}</strong>
              <p className="text-sm text-gray-600">{t('legal.ralNationalBody')}</p>
            </div>
            <div>
              <strong>{t('legal.ralRegional')}</strong>
              <p className="text-sm text-gray-600">{t('legal.ralRegionalBody')}</p>
            </div>
          </div>
          <p>
            {t('legal.ralNote')}{' '}
            <a href="https://www.consumidor.gov.pt" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
              consumidor.gov.pt
            </a>.
          </p>

          <h2>{t('legal.complaintsTitle')}</h2>
          <p>{t('legal.complaintsText', { brand })}</p>
          <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
            {t('legal.complaintsLink')}
          </a>

          <h2>{t('legal.amlTitle')}</h2>
          <p>{t('legal.amlText', { brand })}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
