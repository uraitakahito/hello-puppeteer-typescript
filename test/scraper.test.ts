import { describe, expect, it } from "vitest";
import scrapeHackerNews from "../src/scraper";

describe("scrapeHackerNews", () => {
  it("fetches articles from Hacker News", async () => {
    const result = await scrapeHackerNews({ limit: 5 });

    expect(result.source).toBe("https://news.ycombinator.com/");
    expect(result.scrapedAt).toBeDefined();
    expect(result.articleCount).toBeGreaterThan(0);
    expect(result.articleCount).toBeLessThanOrEqual(5);
  });

  it("returns articles with required properties", async () => {
    const result = await scrapeHackerNews({ limit: 1 });

    expect(result.articles.length).toBeGreaterThan(0);

    const article = result.articles[0];
    expect(article).toBeDefined();

    if (article) {
      expect(typeof article.rank).toBe("number");
      expect(typeof article.title).toBe("string");
      expect(typeof article.url).toBe("string");
      expect(typeof article.points).toBe("number");
      expect(typeof article.author).toBe("string");
      expect(typeof article.commentCount).toBe("number");
      expect(typeof article.postedAt).toBe("string");
    }
  });

  it("respects the limit option", async () => {
    const result = await scrapeHackerNews({ limit: 3 });

    expect(result.articles.length).toBeLessThanOrEqual(3);
  });
});
