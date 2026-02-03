import { sendContactMessage } from '@/api/messages';
import { useProjects, useProperties } from '@/api/queries';
import { ContactInfo } from '@/components/ContactInfo';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { ProjectItem } from '@/components/ProjectItem';
import { PropertiesArea } from '@/components/PropertiesArea';
import { ListSkeleton } from '@/components/Skeleton';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: propsResp, isLoading: propsLoading } = useProperties({ limit: 12, sortBy: 'createdAt', sortOrder: 'desc' });
  const properties = Array.isArray(propsResp) ? propsResp : (propsResp?.data ?? []);
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Hero heroUrl="https://images.unsplash.com/photo-1679364297777-1db77b6199be?auto=format&fit=crop&w=1600&q=80" />

      {/* Properties Section */}
      <section id="imoveis" className="py-20 bg-gradient-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Imóveis em Destaque
            </h2>
            <div className="flex items-center justify-center gap-4 text-lg text-gray-600">
              <span className="badge bg-blue-100 text-blue-700 px-4 py-2">
                {propsLoading ? 'Carregando...' : `${properties.length} disponíveis`}
              </span>
            </div>
          </div>
          <PropertiesArea properties={properties} loading={propsLoading} />
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <img
                className="rounded-3xl shadow-2xl w-full"
                src="https://images.unsplash.com/photo-1527335988388-b40ee248d80c?auto=format&fit=crop&w=1200&q=80"
                alt="Construção"
              />
            </div>
            <div className="animate-fade-in-up animate-stagger-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Obras em Destaque
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Transformamos espaços com qualidade e inovação. Nossos projetos refletem excelência em cada detalhe.
              </p>

              {projectsLoading ? (
                <ListSkeleton rows={4} />
              ) : projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Nenhum projeto disponível no momento.</p>
                  <p className="text-sm text-gray-500 mt-2">Volte em breve para ver nossos novos projetos.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project, index) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-gradient-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactInfo />
        </div>
      </section>

      {/* Secção do Formulário de Contacto */}
      <section id="lead-form" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadForm />
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nossos Parceiros</h2>
            <p className="text-gray-500">Trabalhamos com as melhores instituições para realizar o seu sonho</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Caixa Geral de Depósitos */}
            <div className="w-32 h-16 flex items-center justify-center p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
               <img 
                 src="/partners/imocaixa.png" 
                 alt="Imocaixa (CGD)" 
                 className="max-w-full max-h-full object-contain"
               />
            </div>
            {/* Novo Banco */}
            <div className="w-32 h-16 flex items-center justify-center p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
               <img 
                 src="/partners/novo_banco.png" 
                 alt="Novo Banco" 
                 className="max-w-full max-h-full object-contain"
               />
            </div>
            {/* BPI */}
            <div className="w-32 h-16 flex items-center justify-center p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
               <img 
                 src="/partners/bpi.png" 
                 alt="Banco BPI" 
                 className="max-w-full max-h-full object-contain"
               />
            </div>
             {/* Montepio */}
             <div className="w-32 h-16 flex items-center justify-center p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
               <img 
                 src="/partners/montepio.png" 
                 alt="Montepio" 
                 className="max-w-full max-h-full object-contain"
               />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function LeadForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyDetails, setPropertyDetails] = useState<string>('');
  const [contextIds, setContextIds] = useState<{ propertyId?: string, agentId?: string }>({});

  // Check for property details in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyParam = urlParams.get('property');
    const propertyId = urlParams.get('propertyId');
    const agentId = urlParams.get('agentId');

    if (propertyParam) {
      setPropertyDetails(decodeURIComponent(propertyParam));
    }

    if (propertyId || agentId) {
      setContextIds({
        propertyId: propertyId || undefined,
        agentId: agentId || undefined
      });
    }

    // Faz scroll automático para o formulário quando vem da página de detalhes
    if (propertyParam || propertyId) {
      setTimeout(() => {
        const formElement = document.getElementById('lead-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      setError(null);

      // Extract form data
      const formData = new FormData(e.currentTarget);
      const messageData = {
        fromName: formData.get('name') as string,
        fromEmail: formData.get('email') as string,
        phone: formData.get('phone') as string,
        body: formData.get('message') as string,
        propertyId: contextIds.propertyId,
        agentId: contextIds.agentId,
        context: {
          source: 'website_contact_form',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        }
      };

      // Send message via API Gateway to messages service
      const response = await sendContactMessage(messageData);

      if (response.success) {
        console.log('Mensagem enviada com sucesso!', response.data);
        setDone(true);
        e.currentTarget.reset();
      } else {
        throw new Error(response.error || 'Falha no envio');
      }
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      setError(error.message || 'Não foi possível enviar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="text-center space-y-12 animate-fade-in-up">
      <div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Pronto para encontrar seu próximo imóvel?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Fale com nossos especialistas e receba atendimento personalizado para suas necessidades.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="card p-8 md:p-12">
          {done ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Mensagem enviada!</h3>
              <p className="text-gray-600 mb-4">Entraremos em contato em breve. Obrigado!</p>
              <p className="text-sm text-gray-500 mb-8">
                A sua mensagem foi recebida com sucesso. <br />
                Um dos nossos especialistas entrará em contacto consigo nas próximas 24 horas.
              </p>
              <a
                href="#imoveis"
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Ver mais imóveis
              </a>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Fale com um especialista
              </h3>
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <input
                    name="name"
                    placeholder="Seu nome completo"
                    className="input"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    name="email"
                    placeholder="Seu melhor email"
                    type="email"
                    className="input"
                    required
                  />
                  <input
                    name="phone"
                    placeholder="Seu telefone/WhatsApp"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Como podemos ajudar? Descreva o tipo de imóvel que procura, localização preferida, orçamento, etc."
                    className="input"
                    rows={5}
                    required
                    defaultValue={propertyDetails}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  disabled={submitting}
                  className="btn btn-primary w-full text-lg py-4"
                >
                  {submitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <span>Enviar Mensagem</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}