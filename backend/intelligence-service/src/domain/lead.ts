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
  marketScore: number; // 0-100
  recommendation: string;
  isHighPriority: boolean;
}
