import express, { request, response } from "express";

const app = express();
const port = 8080;

app.get("/", (req: request, res: response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
