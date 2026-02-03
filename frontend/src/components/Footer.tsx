import { useSettings } from '@/api/queries';
import { Link } from 'react-router-dom';

export function Footer() {
  const { data: settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand & Tagline */}
          <div className="col-span-1 md:col-span-1 text-center md:text-left">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center justify-center md:justify-start gap-3 mb-4 hover:opacity-90 transition-opacity"
            >
              <img
                src="/logo.svg"
                alt="RibeiraZul"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-500 text-sm italic">
              Transformando sonhos em realidade
            </p>
          </div>

          {/* Legal Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-300 mb-4 uppercase tracking-wider text-xs">Informação Legal</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
              </li>
              <li>
                <Link to="/termos" className="hover:text-white transition-colors">Termos de Utilização</Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-white transition-colors">Informações Legais</Link>
              </li>
            </ul>
          </div>

          {/* Company Details */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-300 mb-4 uppercase tracking-wider text-xs">A Empresa</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Licença AMI: 26172 </li>
              <li>NIPC: 518 885 399 </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-right">
            <h3 className="font-semibold text-gray-300 mb-4 uppercase tracking-wider text-xs">Siga-nos</h3>
            <div className="flex justify-center md:justify-end gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Pinterest">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.175 1.219-5.175s-.311-.623-.311-1.544c0-1.446.839-2.525 1.883-2.525.888 0 1.317.664 1.317 1.46 0 .891-.568 2.224-.861 3.46-.245 1.037.52 1.881 1.545 1.881 1.854 0 3.279-1.954 3.279-4.776 0-2.499-1.796-4.244-4.356-4.244-2.968 0-4.708 2.226-4.708 4.526 0 .896.344 1.856.775 2.378a.341.341 0 0 1 .078.331c-.086.36-.275 1.122-.312 1.278-.049.2-.16.242-.369.146-1.358-.629-2.207-2.604-2.207-4.186 0-3.294 2.393-6.319 6.898-6.319 3.621 0 6.437 2.58 6.437 6.034 0 3.6-2.269 6.494-5.42 6.494-1.058 0-2.055-.549-2.394-1.275l-.651 2.479c-.235.899-.869 2.028-1.294 2.716.975.301 2.011.461 3.079.461 6.621 0 11.99-5.367 11.99-11.988C24.007 5.367 18.637.001 12.017.001z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-600 text-xs">
            © {year} {settings?.brandName ?? 'RibeiraZul'}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
