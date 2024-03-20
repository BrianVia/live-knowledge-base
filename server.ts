import express, { request, response } from "express";
import cron from "node-cron";
import { checkLibraryItemsOut } from "./apis/functions/fairfax-county-public-library/checkLibraryItemsOut";

const app = express();
const port = 8080;

cron.schedule("* * * * *", () => {
  console.log("Running a task every day at midnight");
  checkLibraryItemsOut();
});

app.get("/", (req: request, res: response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
