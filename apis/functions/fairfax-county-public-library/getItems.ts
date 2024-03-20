import { Request, Response } from "express";
import { db } from "../../../database/db";
import * as schema from "../../../database/schema";

interface libraryItemOut {
  id: number;
  title: string | null;
  dueDate: string | null;
  renewalsLeft: number | null;
  callNumber: string | null;
  assignedBranch: string | null;
  coverImageUrl: string | null;
  returned: boolean | null;
  actualDueDate: string | null;
}

export async function getItemsOut(req: Request, res: Response) {
  const libraryItemsOut = await getLibraryItemsOut();
  const itemsResponse = libraryItemsOut
    .filter((item) => !item.returned)
    .map((item) => {
      const actualDueDate = new Date(
        new Date(item.dueDate!).getTime() +
          item.renewalsLeft! * 2 * 7 * 24 * 60 * 60 * 1000
      );
      return {
        ...item,
        actualDueDate: actualDueDate.toISOString(),
      };
    })
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!));
  res.status(200).json(itemsResponse);
}

export async function getLibraryItemsOut(): Promise<libraryItemOut[]> {
  const libraryItemsOut = await db.select().from(schema.booksOut);
  return libraryItemsOut || [];
}
