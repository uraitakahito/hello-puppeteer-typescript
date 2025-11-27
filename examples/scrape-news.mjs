/**
 * Hacker News Scraping Example
 *
 * Usage:
 *   npx tsx examples/scrape-news.mjs
 */
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import scrapeHackerNews from "../src/scraper.ts";

const currentDir = dirname(fileURLToPath(import.meta.url));
const outputDir = join(currentDir, "..", "output");

const scrapeNews = async () => {
  console.log("Scraping Hacker News...");

  const result = await scrapeHackerNews({ limit: 30 });

  console.log(`Fetched ${result.articleCount} articles`);

  await mkdir(outputDir, { recursive: true });
  const outputPath = join(outputDir, "articles.json");
  await writeFile(outputPath, JSON.stringify(result, null, 2));

  console.log(`Results saved to ${outputPath}`);
  console.log("\nSample article:");
  console.log(JSON.stringify(result.articles[0], null, 2));
};

scrapeNews().catch(console.error);
