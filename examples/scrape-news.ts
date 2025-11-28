/**
 * Hacker News Scraping Example
 *
 * Usage:
 *   npx tsx examples/scrape-news.ts
 *   node dist/examples/scrape-news.js (after build)
 */
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import scrapeHackerNews from "../src/scraper.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const outputDir = join(currentDir, "..", "output");

const scrapeNews = async (): Promise<void> => {
  console.log("Scraping Hacker News...");

  const result = await scrapeHackerNews({ limit: 30 });

  console.log(`Fetched ${String(result.articleCount)} articles`);

  await mkdir(outputDir, { recursive: true });
  const outputPath = join(outputDir, "articles.json");
  await writeFile(outputPath, JSON.stringify(result, null, 2));

  console.log(`Results saved to ${outputPath}`);
  console.log("\nSample article:");
  console.log(JSON.stringify(result.articles[0], null, 2));
};

scrapeNews().catch(console.error);
