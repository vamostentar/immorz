import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { useTranslation } from 'react-i18next';

export default function Terms() {
  const { t } = useTranslation();
  const brand = 'RibeiraZul';

  return (
    <div className="min-h-screen bg-white">
      <Navbar showBack />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <h1 className="text-4xl font-black text-gray-900 mb-8">{t('terms.title')}</h1>
        <div className="prose prose-gray max-w-none space-y-8">
          <p>{t('terms.intro', { brand })}</p>

          <h2>{t('terms.s1Title')}</h2>
          <p>{t('terms.s1Text')}</p>

          <h2>{t('terms.s2Title')}</h2>
          <p>{t('terms.s2Intro', { brand })}</p>
          <ul>
            {(t('terms.s2Items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>{t('terms.s2Text', { brand })}</p>

          <h2>{t('terms.s3Title')}</h2>
          <p>{t('terms.s3Text', { brand })}</p>
          <p className="text-sm text-gray-500 italic">{t('terms.s3Note')}</p>

          <h2>{t('terms.s4Title')}</h2>
          <p>{t('terms.s4Text', { brand })}</p>

          <h2>{t('terms.s5Title')}</h2>
          <p>{t('terms.s5Text', { brand })}</p>

          <h2>{t('terms.s6Title')}</h2>
          <p>{t('terms.s6Text', { brand })}</p>

          <h2>{t('terms.s7Title')}</h2>
          <p>{t('terms.s7Text')}</p>

          <h2>{t('terms.s8Title')}</h2>
          <p>{t('terms.s8Text')}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
