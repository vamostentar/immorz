import { useSettings } from '@/api/queries';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export default function Privacy() {
  const { data: settings } = useSettings();
  const brandName = settings?.brandName ?? 'RibeiraZul';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
        
        <div className="prose max-w-none text-gray-700 space-y-6">
          <p className="lead text-lg text-gray-600">
            A sua privacidade é crucial para nós. Na {brandName}, comprometemo-nos a proteger a segurança e a confidencialidade dos seus dados pessoais.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Responsável pelo Tratamento de Dados</h2>
            <p>
              A {brandName} é a entidade responsável pelo tratamento dos dados pessoais recolhidos através deste website, determinando as finalidades e os meios de tratamento dos mesmos, em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Dados Pessoais Recolhidos</h2>
            <p className="mb-2">Recolhemos apenas os dados essenciais para a prestação dos nossos serviços imobiliários, nomeadamente:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Informação de contacto (nome, email, telefone) fornecida voluntariamente nos formulários de contacto;</li>
              <li>Preferências imobiliárias (tipo de imóvel, localização, orçamento) para envio de sugestões personalizadas;</li>
              <li>Dados técnicos de navegação (endereço IP, tipo de dispositivo, navegador) para melhoria da experiência do utilizador.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Finalidades do Tratamento</h2>
            <p className="mb-2">Os dados recolhidos destinam-se a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gestão da relação comercial e resposta a pedidos de informação ou visita;</li>
              <li>Divulgação de oportunidades imobiliárias compatíveis com o seu perfil;</li>
              <li>Cumprimento de obrigações legais e regulamentares da atividade de mediação imobiliária (Licença AMI 26172);</li>
              <li>Melhoria contínua dos nossos serviços e do website.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Partilha e Segurança de Dados</h2>
            <p>
              Não comercializamos os seus dados com terceiros. A partilha de dados ocorre apenas quando estritamente necessária para a conclusão de negócios imobiliários (ex: Conservatórias, Bancos para crédito habitação) ou por imposição legal.
            </p>
            <p className="mt-2">
              Implementamos medidas técnicas e organizativas rigorosas para proteger os seus dados contra a perda, uso indevido, alteração ou acesso não autorizado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Direitos do Titular dos Dados</h2>
            <p className="mb-2">Enquanto titular dos dados, tem o direito a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Aceder, retificar ou solicitar a eliminação dos seus dados pessoais;</li>
              <li>Limitar ou opor-se ao tratamento dos seus dados;</li>
              <li>Solicitar a portabilidade dos dados;</li>
              <li>Retirar o consentimento a qualquer momento (sem comprometer a licitude do tratamento efetuado com base no consentimento previamente dado).</li>
            </ul>
            <p className="mt-2">
              Para exercer estes direitos, contacte-nos através dos formulários disponíveis no site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Cookies e Tecnologias de Rastreio</h2>
            <p>
              Utilizamos cookies para otimizar a funcionalidade do site e analisar o tráfego. Pode gerir as suas preferências de cookies nas definições do seu navegador a qualquer momento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Atualizações à Política</h2>
            <p>
              Reservamo-nos o direito de atualizar esta política de privacidade periodicamente. Recomendamos a consulta regular desta página para se manter informado.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
