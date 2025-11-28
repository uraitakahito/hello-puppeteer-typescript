import puppeteer, { type Browser } from "puppeteer";

const BROWSER_ARGS = [
  // Disables GPU hardware acceleration for container compatibility
  "--disable-gpu",
  // The sandbox requires kernel features unavailable in containers
  "--no-sandbox",
  // Companion flag for --no-sandbox when running as non-root
  "--disable-setuid-sandbox",
];

export interface BrowserOptions {
  headless?: boolean;
  slowMo?: number;
}

const launchBrowser = async (options: BrowserOptions = {}): Promise<Browser> => {
  const { headless = true, slowMo = 0 } = options;
  return puppeteer.launch({
    headless,
    slowMo,
    args: BROWSER_ARGS,
  });
};

export default launchBrowser;
