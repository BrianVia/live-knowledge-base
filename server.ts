import express, { request, response } from "express";
import cron from "node-cron";
import { checkLibraryItemsOut } from "./apis/functions/fairfax-county-public-library/checkLibraryItemsOut";
import { libraryRouter } from "./apis/functions/fairfax-county-public-library/router";

const app = express();
const port = 8080;

cron.schedule("0 0 * * *", () => {
  console.log("Running a task every day at midnight");
  checkLibraryItemsOut();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
app.use("/api/v1/library", libraryRouter);
