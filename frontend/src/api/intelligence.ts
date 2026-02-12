import { api } from './client';

export interface ExtractedLead {
  sourceUrl: string;
  title: string;
  price: number;
  location: string;
  type: string;
  description: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  contactInfo?: {
    phone?: string | null;
    email?: string | null;
    name?: string | null;
  };
  portalName: string;
  externalId?: string | null;
}

export interface LeadOpportunity {
  extractedLead: ExtractedLead;
  marketScore: number;
  recommendation: string;
  isHighPriority: boolean;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: LeadOpportunity;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Envia um URL para o Intelligence Service para análise semântica e de mercado.
 */
export async function analyzeLeadUrl(url: string): Promise<LeadOpportunity> {
  const response = await api.post<AnalyzeResponse>('/api/v1/intelligence/analyze', { url });
  
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error?.message || 'Falha na análise do lead');
  }
  
  return response.data.data;
}

/**
 * Verifica a saúde do serviço de inteligência
 */
export async function checkIntelligenceHealth(): Promise<boolean> {
  try {
    const response = await api.get('/api/v1/intelligence/health');
    return response.status === 200;
  } catch {
    return false;
  }
}
