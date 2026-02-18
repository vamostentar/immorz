/**
 * Componente seletor de idioma PT/EN com bandeiras SVG.
 * Integrado na Navbar para permitir troca dinâmica de idioma.
 */
import { useTranslation } from 'react-i18next';

function FlagPT({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#006600" d="M0 0h256v480H0z" />
      <path fill="#FF0000" d="M256 0h384v480H256z" />
      <circle cx="256" cy="240" r="80" fill="#FFCC00" />
      <circle cx="256" cy="240" r="60" fill="#FF0000" />
      <path fill="#FFF" d="M230 200h52v80h-52z" />
      <path fill="#003399" d="M238 210h36v60h-36z" />
    </svg>
  );
}

function FlagEN({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z" />
      <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z" />
      <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z" />
      <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z" />
    </svg>
  );
}

const languages = [
  { code: 'pt', label: 'PT', Flag: FlagPT },
  { code: 'en', label: 'EN', Flag: FlagEN },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    document.documentElement.lang = code;
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
            i18n.language?.startsWith(lang.code)
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          title={lang.label}
          type="button"
        >
          <lang.Flag className="w-5 h-3.5 rounded-sm shadow-sm" />
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
