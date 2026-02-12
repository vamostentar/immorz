import type { ExtractedLead, LeadOpportunity } from '../domain/lead.js';

export interface IIntelligenceService {
  analyzeLeadFromUrl(url: string): Promise<LeadOpportunity>;
  getMarketInsights(lead: ExtractedLead): Promise<any>;
}
