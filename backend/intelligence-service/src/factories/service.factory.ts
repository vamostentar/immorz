import { IntelligenceServiceImpl } from '../implementations/services/intelligence-service-impl.js';
import { OpenAIParser } from '../implementations/services/openai-parser.js';
import { PlaywrightScraper } from '../implementations/services/playwright-scraper.js';
import type { IIntelligenceService } from '../services/intelligence.service.js';

export class ServiceFactory {
  private static intelligenceService: IIntelligenceService;

  static getIntelligenceService(): IIntelligenceService {
    if (!this.intelligenceService) {
      const scraper = new PlaywrightScraper();
      const parser = new OpenAIParser();
      this.intelligenceService = new IntelligenceServiceImpl(scraper, parser);
    }
    return this.intelligenceService;
  }
}
