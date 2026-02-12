import type { ExtractedLead, LeadOpportunity } from '../../domain/lead.js';
import type { IAIParser } from '../../domain/parser.js';
import type { IScraperProvider } from '../../domain/scraper.js';
import type { IIntelligenceService } from '../../services/intelligence.service.js';

export class IntelligenceServiceImpl implements IIntelligenceService {
  constructor(
    private scraper: IScraperProvider,
    private parser: IAIParser
  ) {}

  async analyzeLeadFromUrl(url: string): Promise<LeadOpportunity> {
    // 1. Scrape the page
    const scrapedPage = await this.scraper.scrape(url);

    // 2. Parse lead data using AI
    const extractedLead = await this.parser.parseHTML(scrapedPage.html, url);

    // 3. Analyze Market (Mock implementation for now)
    const marketScore = this.calculateMarketScore(extractedLead);

    return {
      extractedLead,
      marketScore,
      recommendation: marketScore > 70 ? "Excelente oportunidade! Contactar imediatamente." : "Oportunidade regular.",
      isHighPriority: marketScore > 80
    };
  }

  async getMarketInsights(lead: ExtractedLead): Promise<any> {
    // Aqui poderíamos consultar o properties-service para comparar preços
    return {
      averagePriceZone: lead.price * 0.95, // Mock
      percentBelowMarket: 5,
      demandLevel: 'High'
    };
  }

  private calculateMarketScore(_lead: ExtractedLead): number {
    // Lógica simples de scoring (preço vs área, etc.)
    // No futuro, isto usaria dados reais do properties-service
    return Math.floor(Math.random() * 40) + 60; // 60-100 range for demo
  }
}
