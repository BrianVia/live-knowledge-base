import { FairfaxCountLibraryItemOut } from "./types";

import puppeteer from "puppeteer";
import cheerio from "cheerio";
require("dotenv").config();

export const getLibraryItemsOut = async (): Promise<
  FairfaxCountLibraryItemOut[]
> => {
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
  await page.type("#textboxBarcodeUsername", username!);

  // Type the password into the password field
  await page.type("#textboxPassword", password!);

  // If there's a login button you can click it like this:
  await page.click("#buttonSubmit");

  await page.waitForSelector("#gridviewItemsOut");

  // Get the HTML content of the page
  const htmlRes = await page.content();

  // Parse the HTML using Cheerio
  const $ = cheerio.load(htmlRes);
  const itemsOutTable = $("#gridviewItemsOut");
  // console.log(itemsOutTable.html());
  const items: FairfaxCountLibraryItemOut[] = [];

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
      .attr("href")!
      .replace("javascript:showModalBasic('", "")
      .replace("')", "");

    items.push({
      title,
      dueDate: new Date(dueDate),
      renewalsLeft: parseInt(renewalsLeft),
      callNumber,
      assignedBranch,
      coverImageUrl: coverImageUrl ?? "",
      linkDetails,
    });
  });

  await browser.close();

  return items;
};
