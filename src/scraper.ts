import type { Page } from "puppeteer";
import launchBrowser from "./browser.js";
import type { Article, ScrapeOptions, ScrapeResult } from "./types.js";

const HACKER_NEWS_URL = "https://news.ycombinator.com/";

const parseArticlesFromPage = async (page: Page): Promise<Article[]> => {
  return page.evaluate(() => {
    const articles: Article[] = [];
    const rows = document.querySelectorAll("tr.athing");

    rows.forEach((row) => {
      const rankElement = row.querySelector("span.rank");
      const titleElement = row.querySelector("span.titleline > a");
      const subtextRow = row.nextElementSibling;

      if (!titleElement || !subtextRow) return;

      const scoreElement = subtextRow.querySelector("span.score");
      const userElement = subtextRow.querySelector("a.hnuser");
      const ageElement = subtextRow.querySelector("span.age");
      const commentLinks = subtextRow.querySelectorAll("a");
      const commentLink = commentLinks[commentLinks.length - 1];

      const rankText = rankElement?.textContent;
      const rank = rankText ? rankText.replace(".", "") : "0";
      const title = titleElement.textContent || "";
      const href = titleElement.getAttribute("href");
      const url = href ?? "";
      const pointsText = scoreElement?.textContent;
      const points = pointsText ? pointsText.replace(" points", "") : "0";
      const author = userElement?.textContent ?? "";
      const postedAt = ageElement?.getAttribute("title") ?? "";

      let commentCount = 0;
      const commentText = commentLink?.textContent ?? "";
      const commentMatch = /(\d+)\s*comment/.exec(commentText);
      if (commentMatch?.[1]) {
        commentCount = parseInt(commentMatch[1], 10);
      }

      articles.push({
        rank: parseInt(rank, 10),
        title,
        url: url.startsWith("item?id=") ? `https://news.ycombinator.com/${url}` : url,
        points: parseInt(points, 10),
        author,
        commentCount,
        postedAt,
      });
    });

    return articles;
  });
};

const scrapeHackerNews = async (options: ScrapeOptions = {}): Promise<ScrapeResult> => {
  const { headless = true, limit = 30, slowMo = 0 } = options;

  const browser = await launchBrowser({ headless, slowMo });

  try {
    const page = await browser.newPage();
    await page.goto(HACKER_NEWS_URL, { waitUntil: "domcontentloaded" });

    const allArticles = await parseArticlesFromPage(page);
    const articles = allArticles.slice(0, limit);

    return {
      scrapedAt: new Date().toISOString(),
      source: HACKER_NEWS_URL,
      articleCount: articles.length,
      articles,
    };
  } finally {
    await browser.close();
  }
};

export default scrapeHackerNews;
