import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { useTranslation } from 'react-i18next';

export default function Privacy() {
  const { t } = useTranslation();
  const brand = 'RibeiraZul';

  return (
    <div className="min-h-screen bg-white">
      <Navbar showBack />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <h1 className="text-4xl font-black text-gray-900 mb-8">{t('privacy.title')}</h1>
        <div className="prose prose-gray max-w-none space-y-8">
          <p>{t('privacy.intro', { brand })}</p>

          <h2>{t('privacy.s1Title')}</h2>
          <p>{t('privacy.s1Text', { brand })}</p>

          <h2>{t('privacy.s2Title')}</h2>
          <p>{t('privacy.s2Intro')}</p>
          <ul>
            {(t('privacy.s2Items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h2>{t('privacy.s3Title')}</h2>
          <p>{t('privacy.s3Intro')}</p>
          <ul>
            {(t('privacy.s3Items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h2>{t('privacy.s4Title')}</h2>
          <p>{t('privacy.s4Text1')}</p>
          <p>{t('privacy.s4Text2')}</p>

          <h2>{t('privacy.s5Title')}</h2>
          <p>{t('privacy.s5Intro')}</p>
          <ul>
            {(t('privacy.s5Items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>{t('privacy.s5Text')}</p>

          <h2>{t('privacy.s6Title')}</h2>
          <p>{t('privacy.s6Text')}</p>

          <h2>{t('privacy.s7Title')}</h2>
          <p>{t('privacy.s7Text')}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
