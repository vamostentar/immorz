import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { config } from '../../config/config.js';
import type { ExtractedLead, IAIParser } from '../../domain/parser.js';

const LeadSchema = z.object({
  title: z.string(),
  price: z.number(),
  location: z.string(),
  type: z.string(),
  description: z.string(),
  bedrooms: z.number().nullable(),
  bathrooms: z.number().nullable(),
  area: z.number().nullable(),
  contactPhone: z.string().nullable(),
  contactEmail: z.string().nullable(),
  contactName: z.string().nullable(),
  portalName: z.string(),
  externalId: z.string().nullable()
});

export class OpenAIParser implements IAIParser {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
    });
  }

  async parseHTML(html: string, url: string): Promise<ExtractedLead> {
    console.log(`🤖 AI Parsing lead from: ${url}`);

    const completion = await this.client.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "És um assistente especializado no mercado imobiliário português. Extrai os detalhes do imóvel a partir do HTML fornecido. Identifica o portal (ex: Idealista, OLX, Imovirtual) e limpa os dados para o formato JSON solicitado. Se não encontrares um campo, deixa-o vazio." 
        },
        { 
          role: "user", 
          content: `URL: ${url}\n\nHTML Content:\n${html.substring(0, 15000)}` // Limit based on context
        },
      ],
      response_format: zodResponseFormat(LeadSchema, "lead"),
    });

    const lead = completion.choices[0].message.parsed;

    if (!lead) {
      throw new Error('Falha ao extrair dados do lead via IA');
    }

    return {
      ...lead,
      sourceUrl: url,
      contactInfo: {
        phone: lead.contactPhone ?? undefined,
        email: lead.contactEmail ?? undefined,
        name: lead.contactName ?? undefined
      },
      externalId: lead.externalId ?? undefined,
      bedrooms: lead.bedrooms ?? undefined,
      bathrooms: lead.bathrooms ?? undefined,
      area: lead.area ?? undefined
    };
  }
}
