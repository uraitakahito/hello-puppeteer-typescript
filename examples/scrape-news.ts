/**
 * Hacker News Scraping Example
 *
 * Usage:
 *   npx tsx examples/scrape-news.ts [options]
 *   node dist/examples/scrape-news.js [options] (after build)
 *
 * Options:
 *   --no-headless, -H    Show browser window (default: headless)
 *   --slow-mo <ms>       Slow down Puppeteer operations by specified milliseconds
 *   --help, -h           Show this help message
 */
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import scrapeHackerNews from "../src/scraper.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const outputDir = join(currentDir, "..", "output");

const showHelp = (): void => {
  console.log(`Usage: npx tsx examples/scrape-news.ts [options]

Options:
  --no-headless, -H    Show browser window (default: headless)
  --slow-mo <ms>       Slow down Puppeteer operations by specified milliseconds
  --help, -h           Show this help message
`);
};

const parseArgs = (argv: string[]): { headless: boolean; slowMo: number; help: boolean } => {
  const args = argv.slice(2);

  let slowMo = 0;
  const slowMoIndex = args.indexOf("--slow-mo");
  const slowMoValue = args[slowMoIndex + 1];
  if (slowMoIndex !== -1 && slowMoValue !== undefined) {
    slowMo = parseInt(slowMoValue, 10);
  }

  return {
    headless: !args.includes("--no-headless") && !args.includes("-H"),
    slowMo,
    help: args.includes("--help") || args.includes("-h"),
  };
};

const scrapeNews = async (): Promise<void> => {
  const options = parseArgs(process.argv);

  if (options.help) {
    showHelp();
    return;
  }

  console.log("Scraping Hacker News...");
  if (!options.headless) {
    console.log("(Browser window mode)");
  }
  if (options.slowMo > 0) {
    console.log(`(Slow motion: ${String(options.slowMo)}ms)`);
  }

  const result = await scrapeHackerNews({
    limit: 30,
    headless: options.headless,
    slowMo: options.slowMo,
  });

  console.log(`Fetched ${String(result.articleCount)} articles`);

  await mkdir(outputDir, { recursive: true });
  const outputPath = join(outputDir, "articles.json");
  await writeFile(outputPath, JSON.stringify(result, null, 2));

  console.log(`Results saved to ${outputPath}`);
  console.log("\nSample article:");
  console.log(JSON.stringify(result.articles[0], null, 2));
};

scrapeNews().catch(console.error);
