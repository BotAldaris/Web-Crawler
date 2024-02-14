const jsdom = require("jsdom");
const { JSDOM } = jsdom;
/**
 *
 * @param {string} url
 */
function normalizeURL(url) {
  const urlObj = new URL(url);
  const fullPath = `${urlObj.host}${urlObj.pathname}`;
  if (fullPath.endsWith("/")) {
    return fullPath.slice(0, -1);
  }
  return fullPath;
}
/**
 *
 * @param {string} htmlBody
 * @param {string} baseURL
 */
function getURLsFromHTML(htmlBody, baseURL) {
  const body = new JSDOM(htmlBody);
  const atags = body.window.document.querySelectorAll("a");
  const result = [];
  for (const a of atags) {
    try {
      if (a.href.startsWith("/")) {
        result.push(baseURL + a.href);
      } else {
        result.push(new URL(a.href).href);
      }
    } catch (error) {
      continue;
    }
  }
  return result;
}
/**
 *
 * @param {string} baseURL
 * @param {string} currentURL
 * @param {Map<string,number>} pages
 */
async function crawlPage(baseURL, currentURL, pages) {
  if (notSameDomaing(baseURL, currentURL)) {
    return pages;
  }
  const normalizedURL = normalizeURL(currentURL);
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++;
    return pages;
  }

  if (currentURL === baseURL) {
    pages[normalizedURL] = 0;
  } else {
    pages[normalizedURL] = 1;
  }

  console.log(`crawling ${currentURL}`);
  try {
    const resp = await fetch(currentURL);
    if (resp.status > 399) {
      console.log(`Got HTTP error, status code: ${resp.status}`);
      return pages;
    }
    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`Got non-html response: ${contentType}`);
      return pages;
    }
    const htmlBody = await resp.text();
    const nextURLs = getURLsFromHTML(htmlBody, baseURL);
    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (error) {
    console.log(error.message);
  }
  return pages;
}

/**
 *
 * @param {string} baseURL
 * @param {string} currentURL
 * @returns
 */
function notSameDomaing(baseURL, currentURL) {
  const currentUrlObj = new URL(currentURL);
  const baseUrlObj = new URL(baseURL);
  return currentUrlObj.hostname !== baseUrlObj.hostname;
}
module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
