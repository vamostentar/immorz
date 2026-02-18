import { Footer } from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('notFound.title')}</h1>
        <p className="text-slate-600 mb-6">{t('notFound.description')}</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn btn-outline">{t('notFound.goHome')}</Link>
          <Link to="/admin/properties" className="btn btn-primary">{t('notFound.openPanel')}</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
