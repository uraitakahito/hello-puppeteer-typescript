import puppeteer, { type Browser } from "puppeteer";

const BROWSER_ARGS = [
  // Disables GPU hardware acceleration for container compatibility
  "--disable-gpu",
  // The sandbox requires kernel features unavailable in containers
  "--no-sandbox",
  // Companion flag for --no-sandbox when running as non-root
  "--disable-setuid-sandbox",
];

const launchBrowser = async (headless = true): Promise<Browser> => {
  return puppeteer.launch({
    headless,
    args: BROWSER_ARGS,
  });
};

export default launchBrowser;
