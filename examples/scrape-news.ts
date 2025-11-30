/**
 * Hacker News Scraping Example
 *
 * Usage:
 *   npx tsx examples/scrape-news.ts [options]
 *   node dist/examples/scrape-news.js [options] (after build)
 *
 * Options:
 *   --browser-url <url>   Browser remote debugging URL (default: http://localhost:9222)
 *   --browser-ws <url>    Browser WebSocket endpoint (overrides --browser-url)
 *   --slow-mo <ms>        Slow down Puppeteer operations by specified milliseconds
 *   --help, -h            Show this help message
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
  --browser-url <url>   Browser remote debugging URL (default: http://localhost:9222)
  --browser-ws <url>    Browser WebSocket endpoint (overrides --browser-url)
  --slow-mo <ms>        Slow down Puppeteer operations by specified milliseconds
  --help, -h            Show this help message
`);
};

interface ParsedArgs {
  browserURL: string;
  browserWSEndpoint: string | undefined;
  slowMo: number;
  help: boolean;
}

const parseArgs = (argv: string[]): ParsedArgs => {
  const args = argv.slice(2);

  let browserURL = "http://localhost:9222";
  const browserURLIndex = args.indexOf("--browser-url");
  const browserURLValue = args[browserURLIndex + 1];
  if (browserURLIndex !== -1 && browserURLValue !== undefined) {
    browserURL = browserURLValue;
  }

  let browserWSEndpoint: string | undefined;
  const wsIndex = args.indexOf("--browser-ws");
  const wsValue = args[wsIndex + 1];
  if (wsIndex !== -1 && wsValue !== undefined) {
    browserWSEndpoint = wsValue;
  }

  let slowMo = 0;
  const slowMoIndex = args.indexOf("--slow-mo");
  const slowMoValue = args[slowMoIndex + 1];
  if (slowMoIndex !== -1 && slowMoValue !== undefined) {
    slowMo = parseInt(slowMoValue, 10);
  }

  return {
    browserURL,
    browserWSEndpoint,
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
  if (options.browserWSEndpoint) {
    console.log(`(WebSocket endpoint: ${options.browserWSEndpoint})`);
  } else {
    console.log(`(Browser URL: ${options.browserURL})`);
  }
  if (options.slowMo > 0) {
    console.log(`(Slow motion: ${String(options.slowMo)}ms)`);
  }

  const scrapeOptions = {
    limit: 30,
    browserURL: options.browserURL,
    slowMo: options.slowMo,
    ...(options.browserWSEndpoint !== undefined && {
      browserWSEndpoint: options.browserWSEndpoint,
    }),
  };
  const result = await scrapeHackerNews(scrapeOptions);

  console.log(`Fetched ${String(result.articleCount)} articles`);

  await mkdir(outputDir, { recursive: true });
  const outputPath = join(outputDir, "articles.json");
  await writeFile(outputPath, JSON.stringify(result, null, 2));

  console.log(`Results saved to ${outputPath}`);
  console.log("\nSample article:");
  console.log(JSON.stringify(result.articles[0], null, 2));
};

scrapeNews().catch(console.error);
