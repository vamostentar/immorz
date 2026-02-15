type Props = { heroUrl: string };

export function Hero({ heroUrl }: Props) {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <img 
          src={heroUrl} 
          alt="Hero" 
          className="h-full w-full object-cover transform scale-105 transition-transform duration-[10s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-indigo-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
      </div>

      {/* Animated Background Elements - "Blobs" */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-blob animate-delay-2000" />
      <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-blob animate-delay-4000" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pb-20">
        <div className="text-white max-w-4xl mx-auto animate-fade-in-up">
          <div className="flex flex-col items-center mb-12">
            <div className="p-4 rounded-2xl glass-dark mb-6 animate-float">
              <img 
                src="/logo.svg" 
                alt="RibeiraZul" 
                className="h-16 md:h-20 w-auto filter drop-shadow-2xl"
              />
            </div>
            <span className="badge bg-blue-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-sm mb-4">
              ✨ Excelência no Mercado Imobiliário
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
            Onde os seus
            <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              sonhos habitam
            </span>
          </h1>
          
          <p className="mt-8 text-xl md:text-2xl text-blue-100 font-light leading-relaxed animate-fade-in-up animate-stagger-1 max-w-3xl mx-auto">
            Líderes em mediação imobiliária e construção. Transformamos cada projeto numa história de sucesso e qualidade.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animate-stagger-2">
            <a 
              href="#imoveis" 
              className="btn btn-primary text-lg px-10 py-5 group rounded-2xl"
            >
              <span>Ver Imóveis</span>
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            
            <a 
              href="#contato" 
              className="btn btn-outline text-lg px-10 py-5 group rounded-2xl border-white/30 text-white hover:bg-white hover:text-blue-900"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Atendimento Direto</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Search Bar Integration in Home Section */}
    </div>
  );
}
