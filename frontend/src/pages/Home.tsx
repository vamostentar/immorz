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

function TestimonialCard({ name, role, content, delay }: { name: string, role: string, content: string, delay: string }) {
  return (
    <div className={`glass p-8 rounded-3xl space-y-4 animate-fade-in-up ${delay} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}>
      <div className="flex text-amber-400 gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-600 italic leading-relaxed">{content}</p>
      <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
          {name[0]}
        </div>
        <div>
          <div className="font-bold text-gray-900">{name}</div>
          <div className="text-xs text-gray-500 uppercase tracking-widest">{role}</div>
        </div>
      </div>
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

      <div className="max-w-4xl mx-auto">
        <div className="glass p-4 rounded-[2.5rem] shadow-2xl border border-white/40">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-inner">
            {done ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-50 rounded-full mx-auto mb-6 flex items-center justify-center text-emerald-500">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">Mensagem enviada!</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Obrigado pelo seu interesse. Um dos nossos especialistas entrará em contacto consigo nas próximas 24 horas.
                </p>
                <a
                  href="#imoveis"
                  className="btn btn-primary px-10 py-4 rounded-2xl inline-flex items-center gap-2"
                >
                  Continuar a explorar
                </a>
              </div>
            ) : (
              <>
                <div className="text-center space-y-2 mb-10">
                  <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Atendimento Exclusivo</span>
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900">
                    Fale com um especialista
                  </h3>
                </div>
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase ml-2">Nome Completo</label>
                      <input
                        name="name"
                        placeholder="Ex: João Silva"
                        className="input !bg-gray-50/50 !border-none !rounded-2xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase ml-2">Email</label>
                      <input
                        name="email"
                        placeholder="joao@email.com"
                        type="email"
                        className="input !bg-gray-50/50 !border-none !rounded-2xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">Telefone / WhatsApp</label>
                    <input
                      name="phone"
                      placeholder="+351 9xx xxx xxx"
                      className="input !bg-gray-50/50 !border-none !rounded-2xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">Sua Mensagem</label>
                    <textarea
                      name="message"
                      placeholder="Como podemos ajudar?"
                      className="input !bg-gray-50/50 !border-none !rounded-2xl resize-none"
                      rows={5}
                      required
                      defaultValue={propertyDetails}
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-3">
                      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <button
                    disabled={submitting}
                    className="btn btn-primary w-full text-lg py-5 rounded-[1.2rem] shadow-xl shadow-blue-500/20"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span>Enviar Solicitação</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: propsResp, isLoading: propsLoading } = useProperties({ limit: 12, sortBy: 'createdAt', sortOrder: 'desc' });
  const properties = Array.isArray(propsResp) ? propsResp : (propsResp?.data ?? []);
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <Hero heroUrl="https://images.unsplash.com/photo-1679364297777-1db77b6199be?auto=format&fit=crop&w=1600&q=80" />

      {/* Properties Section */}
      <section id="imoveis" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="animate-fade-in-up space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 tracking-tight">
                Propriedades <span className="text-blue-600 italic">Exclusivas</span>
              </h2>
              <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
            </div>
            <div className="animate-fade-in-up">
               <div className="glass px-8 py-4 rounded-3xl flex items-center gap-4 border border-blue-100/50 shadow-blue-500/5 transition-transform hover:scale-105 duration-300">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Stock Ativo</span>
                   <span className="text-3xl font-black text-blue-600 leading-none">
                    {propsLoading ? '...' : properties.length}
                   </span>
                 </div>
                 <div className="h-8 w-px bg-blue-100 mx-2" />
                 <span className="text-xs font-bold text-gray-500 max-w-[80px] leading-tight">unidades disponíveis</span>
               </div>
            </div>
          </div>
          <PropertiesArea properties={properties} loading={propsLoading} />
        </div>
      </section>

      {/* Projects Section - Redesigned with side-by-side impact */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative animate-fade-in-up">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50" />
              <img
                className="rounded-[40px] shadow-2xl w-full border-8 border-white transform hover:rotate-1 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1527335988388-b40ee248d80c?auto=format&fit=crop&w=1200&q=80"
                alt="Construção"
              />
              <div className="absolute -bottom-10 -right-10 glass p-8 rounded-3xl animate-float">
                <div className="text-4xl font-black text-blue-600 mb-1">10+</div>
                <div className="text-sm font-bold text-gray-600 uppercase">Anos de Obra</div>
              </div>
            </div>
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-sm italic">Obras & Projetos</span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  Construindo o seu <br />
                  <span className="text-blue-600">futuro</span> hoje.
                </h2>
                <p className="text-xl text-gray-500 leading-relaxed font-light">
                  Não apenas mediamos imóveis, nós criamos espaços. A nossa divisão de obras assegura que cada detalhe do seu novo lar é perfeito.
                </p>
              </div>

              {projectsLoading ? (
                <ListSkeleton rows={4} />
              ) : (
                <div className="grid gap-6">
                  {projects.slice(0, 4).map((project, index) => (
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

      {/* Testimonials Section - NEW PREMIUM SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">A voz dos nossos clientes</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Ricardo Ramos" 
              role="Investidor" 
              content="&quot;A RibeiraZul transformou completamente a minha visão de investimento imobiliário em Sintra. Profissionalismo exemplar.&quot;"
              delay="animate-delay-100"
            />
            <TestimonialCard 
              name="Ana Sofia" 
              role="Proprietária" 
              content="&quot;Desde a venda da minha casa antiga até à remodelação da nova, foi um processo sem stress e com resultados incríveis.&quot;"
              delay="animate-delay-200"
            />
            <TestimonialCard 
              name="Marco Silva" 
              role="Empresário" 
              content="&quot;O acompanhamento jurídico e a clareza em todas as etapas de construção foram fundamentais para o sucesso do meu projeto.&quot;"
              delay="animate-delay-300"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 -skew-x-12 translate-x-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ContactInfo />
        </div>
      </section>

      {/* Secção do Formulário de Contacto */}
      <section id="lead-form" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadForm />
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/351927886229" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 z-50 group flex items-center gap-3"
      >
        <div className="bg-white px-4 py-2 rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-sm font-bold text-gray-900 pointer-events-none">
          Fale connosco no WhatsApp!
        </div>
        <div className="w-16 h-16 bg-[#25D366] rounded-2xl shadow-2xl flex items-center justify-center text-white animate-pulse-soft hover:scale-110 transition-transform duration-300">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </div>
      </a>

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

