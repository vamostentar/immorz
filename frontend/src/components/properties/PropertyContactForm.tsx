import { api } from '@/api/client';
import { Property } from '@/types';
import { Mail, Phone, Send, User } from 'lucide-react';
import React, { useState } from 'react';

interface PropertyContactFormProps {
  property: Property;
  agentId?: string | null; // Allow null to match Property type
}

export function PropertyContactForm({ property, agentId }: PropertyContactFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultMessage = `Olá, estou interessado no imóvel "${property.title}" (Ref: ${property.id.slice(0, 8).toUpperCase()}) localizado em ${property.location}.\n\nGostaria de agendar uma visita ou obter mais informações.`;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const data = Object.fromEntries(form.entries());

    try {
      await api.post('/api/v1/messages', {
        fromName: data.name,
        fromEmail: data.email,
        phone: data.phone,
        body: data.message,
        propertyId: property.id,
        agentId: agentId || undefined,
        context: {
          source: `property_page_${property.id}`,
        }
      });
      setDone(true);
      if (formElement) {
        formElement.reset();
      }
    } catch (e) {
      console.error('Erro ao enviar lead', e);
      console.error('Erro ao enviar lead', e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="text-green-600 w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-green-800 mb-2">Mensagem Enviada!</h3>
        <p className="text-green-700">
          Obrigado pelo interesse. O nosso agente entrará em contacto consigo o mais brevemente possível.
        </p>
        <button 
          onClick={() => setDone(false)}
          className="mt-6 text-sm text-green-600 hover:text-green-800 font-medium underline"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Interessado neste imóvel?</h3>
      <p className="text-sm text-gray-500 mb-6">Preencha o formulário abaixo para agendar uma visita.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 ml-1">Nome Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              name="name" 
              placeholder="Seu nome" 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm" 
              required 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              name="email" 
              placeholder="seu@email.com" 
              type="email" 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm" 
              required 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 ml-1">Telefone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              name="phone" 
              placeholder="912 345 678" 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm" 
              required 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 ml-1">Mensagem</label>
          <textarea 
            name="message" 
            placeholder="Gostaria de agendar uma visita..." 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm min-h-[100px]" 
            defaultValue={defaultMessage}
            required
          />
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={submitting} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? (
             <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span>Enviar Pedido de Visita</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-400 text-center mt-2">
          Ao enviar, concorda com a nossa política de privacidade.
        </p>
      </form>
    </div>
  );
}
