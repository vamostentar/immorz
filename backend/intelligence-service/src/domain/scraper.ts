export interface ScrapedPage {
  url: string;
  html: string;
  screenshot?: string;
  timestamp: string;
}

export interface IScraperProvider {
  scrape(url: string): Promise<ScrapedPage>;
}
