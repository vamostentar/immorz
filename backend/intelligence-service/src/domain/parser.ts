import type { ExtractedLead } from './lead.js';

export type { ExtractedLead };

export interface IAIParser {
  parseHTML(html: string, url: string): Promise<ExtractedLead>;
}
