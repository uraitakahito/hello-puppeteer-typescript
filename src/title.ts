import puppeteer from "puppeteer";

const getTitle = async (url: string, headless = true) => {
  // Launch a new browser instance
  const browser = await puppeteer.launch({
    headless,
    args: [
      // Disables GPU hardware acceleration. If software renderer
      // is not in place, then the GPU process won't launch.
      //
      // AND
      // WORKAROUND:
      //   - https://stackoverflow.com/questions/66402124/puppeteer-blocked-at-newpage
      '--disable-gpu',
      // The sandbox requires kernel features (namespaces) that are typically
      // unavailable in containers. See: https://pptr.dev/troubleshooting
      '--no-sandbox',
      // Companion flag for --no-sandbox when running as non-root.
      '--disable-setuid-sandbox',
    ],
});

  // Open a new page
  const page = await browser.newPage();

  // Navigate to a webpage
  await page.goto(url);

  const title = await page.title();

  // Close the browser
  await browser.close();

  return title;
};

export default getTitle;
