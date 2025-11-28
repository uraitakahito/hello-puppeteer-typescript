export interface Article {
  rank: number;
  title: string;
  url: string;
  points: number;
  author: string;
  commentCount: number;
  postedAt: string;
}

export interface ScrapeResult {
  scrapedAt: string;
  source: string;
  articleCount: number;
  articles: Article[];
}

export interface ScrapeOptions {
  headless?: boolean;
  limit?: number;
  slowMo?: number;
}
