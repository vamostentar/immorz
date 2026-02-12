import type { Browser, Page } from 'playwright';
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { config } from '../../config/config.js';
import type { IScraperProvider, ScrapedPage } from '../../domain/scraper.js';

// Add stealth plugin
chromium.use(StealthPlugin());

export class PlaywrightScraper implements IScraperProvider {
  private browser: Browser | null = null;

  private async getBrowser(): Promise<Browser> {
    if (this.browser) return this.browser;

    const launchOptions: any = {
      headless: config.BROWSER_HEADLESS,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
      ],
    };

    if (config.PROXY_URL) {
      const url = new URL(config.PROXY_URL);
      launchOptions.proxy = {
        server: `${url.protocol}//${url.host}`,
        username: url.username,
        password: url.password,
      };
    }

    this.browser = await chromium.launch(launchOptions);
    return this.browser as Browser;
  }

  async scrape(url: string): Promise<ScrapedPage> {
    const browser = await this.getBrowser();
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page: Page = await context.newPage();
    
    // Apply stealth
    // Note: withStealth is often applied to the page or context
    // In newer playwright-stealth, it might be slightly different
    // For now, let's assume valid usage or manual stealth steps
    
    try {
      console.log(`🔍 Scraping: ${url}`);
      
      // Navigate with timeout and wait until network is idle
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

      // Random delay to simulate human behavior
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

      const html = await page.content();
      
      // Optional: Clean HTML to reduce token usage in LLM
      const cleanedHtml = this.cleanHTML(html);

      return {
        url,
        html: cleanedHtml,
        timestamp: new Date().toISOString()
      };
    } finally {
      await context.close();
    }
  }

  private cleanHTML(html: string): string {
    // Basic cleaning: remove scripts, styles, and comments to save tokens
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
