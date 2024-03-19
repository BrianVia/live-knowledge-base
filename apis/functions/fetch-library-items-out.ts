const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
require("dotenv").config();

const getLibraryItemsOut = async () => {
  const htmlRes = await fetch(
    "https://fcplcat.fairfaxcounty.gov/patronaccount/itemsout.aspx?ctx=1.1033.0.0.1",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "sec-ch-ua": '"Chromium";v="119", "Not?A_Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        cookie:
          "ASP.NET_SessionId=jwyb4ff0tiqyxfgrq4wydqzd; OrgID=1; SameSite=None",
        Referer:
          "https://fcplcat.fairfaxcounty.gov/patronaccount/itemsout.aspx?ctx=1.1033.0.0.1",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  ).then((res) => res.text());

  console.log(htmlRes);

  // Parse the HTML using Cheerio
  const $ = cheerio.load(htmlRes);
};

const loginToLibrary = async () => {
  const browser = await puppeteer.launch({ headless: true }); // Set headless: true if you don't need a browser UI
  const page = await browser.newPage();
  await page.goto("https://fcplcat.fairfaxcounty.gov/logon.aspx?header=1", {
    waitUntil: "networkidle2",
  });

  // Replace 'YOUR_USERNAME' and 'YOUR_PASSWORD' with the actual username and password
  const username = process.env.FCPL_USERNAME;
  const password = process.env.FCPL_PASSWORD;

  // Wait for the username and password fields to be available
  await page.waitForSelector("#textboxBarcodeUsername");
  await page.waitForSelector("#textboxPassword");

  // Type the username into the username field
  await page.type("#textboxBarcodeUsername", username);

  // Type the password into the password field
  await page.type("#textboxPassword", password);

  // If there's a login button you can click it like this:
  await page.click("#buttonSubmit");

  await page.waitForSelector("#gridviewItemsOut");

  // Get the HTML content of the page
  const htmlRes = await page.content();

  // Parse the HTML using Cheerio
  const $ = cheerio.load(htmlRes);
  const itemsOutTable = $("#gridviewItemsOut");
  // console.log(itemsOutTable.html());
  const items: any[] = [];

  $(
    "tr.patron-account__grid-row, tr.patron-account__grid-alternating-row"
  ).each((index, element) => {
    const title = $(element)
      .find(".patron-account__grid-cell--title a")
      .text()
      .trim();
    const dueDate = new Date(
      $(element).find("#labelDueDate").text().trim()
    ).toISOString();
    const renewalsLeft = $(element).find("#labelRenewalsLeft").text().trim();
    const callNumber = $(element).find("#labelCallNumber").text().trim();
    const assignedBranch = $(element)
      .find("#labelAssignedBranch")
      .text()
      .trim();
    const coverImageUrl = $(element)
      .find(".patron-account__grid-cell--cover-image img")
      .attr("src");
    const linkDetails = $(element)
      .find(".patron-account__grid-cell--full-narrow.text-center a")
      .attr("href");

    items.push({
      title,
      dueDate,
      renewalsLeft,
      callNumber,
      assignedBranch,
      coverImageUrl,
      linkDetails,
    });
  });

  console.log(JSON.stringify(items, null, 2));

  browser.close();

  return items;

  // Uncomment the line below if you want to close the browser after the script
  // await browser.close();
};
loginToLibrary();
