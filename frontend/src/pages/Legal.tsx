import { useSettings } from '@/api/queries';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export default function Legal() {
  const { data: settings } = useSettings();
  const brandName = settings?.brandName ?? 'RibeiraZul';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Informações Legais</h1>
        
        <div className="prose max-w-none text-gray-700 space-y-8">
          <p className="lead text-lg text-gray-600">
            Em cumprimento do dever de informação previsto na Lei, a {brandName} disponibiliza a seguinte informação legal referente à sua atividade de mediação imobiliária.
          </p>
          
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Licenciamento e Registo
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Mediação Imobiliária</h3>
                <p className="text-gray-600">
                  A atividade é exercida ao abrigo da <strong>Licença AMI nº 26172</strong>, emitida pelo IMPIC, I.P. (Instituto dos Mercados Públicos, do Imobiliário e da Construção).
                </p>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  A validade da licença pode ser consultada no site do <a href="http://www.impic.pt" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">IMPIC</a>.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Seguro de Responsabilidade Civil</h2>
            <p>
              Para garantia da responsabilidade emergente da sua atividade profissional, a {brandName} possui Seguro de Responsabilidade Civil válido, conforme exigido pela legislação em vigor para a atividade de Mediação Imobiliária.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resolução Alternativa de Litígios (RAL)</h2>
            <p className="mb-4">
              Nos termos do art.º 18.º da Lei n.º 144/2015, de 8 de setembro, informa-se que, em caso de litígio, o consumidor tem a possibilidade de recorrer a uma Entidade de Resolução Alternativa de Litígios de Consumo:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-1">Âmbito Nacional</h3>
                <p className="text-sm text-gray-600">CNIACC - Centro Nacional de Informação e Arbitragem de Conflitos de Consumo</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-1">Âmbito Regional</h3>
                <p className="text-sm text-gray-600">Centro de Arbitragem de Conflitos de Consumo de Lisboa</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Para mais informações, consulte o Portal do Consumidor em <a href="https://www.consumidor.gov.pt" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">www.consumidor.pt</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Livro de Reclamações</h2>
            <div className="flex items-start md:items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-grow">
                <p className="text-gray-700 mb-2">
                  A {brandName} dispõe de Livro de Reclamações Eletrónico. Se desejar apresentar uma reclamação, elogio ou sugestão, poderá fazê-lo através da plataforma oficial.
                </p>
                <a 
                  href="https://www.livroreclamacoes.pt" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-sky-600 font-medium hover:text-sky-800 transition-colors"
                >
                  Confirmar em www.livroreclamacoes.pt 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Branqueamento de Capitais</h2>
            <p>
               Em cumprimento da Lei n.º 83/2017, de 18 de agosto, que estabelece medidas de combate ao branqueamento de capitais e ao financiamento do terrorismo, a {brandName} poderá solicitar elementos de identificação a todos os intervenientes nos negócios imobiliários em que intervenha.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
