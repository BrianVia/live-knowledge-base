import { Router } from "express";
import { getItemsOut } from "./getItems";

export const libraryRouter = Router();
libraryRouter.get("/itemsOut", getItemsOut);
