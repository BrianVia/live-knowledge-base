import { fetchLibraryItemsOut } from "./fetch-library-items-out";
import { db } from "../../../database/db";
import * as schema from "../../../database/schema";

export async function checkLibraryItemsOut(): Promise<any> {
  const currentItemsOut = await fetchLibraryItemsOut();
  console.table(currentItemsOut);

  const itemsOutInDatabase = await db.select().from(schema.booksOut);
  console.table(itemsOutInDatabase);

  //upsert the items found
  for (const item of currentItemsOut.slice(0, 1)) {
    await db
      .insert(schema.booksOut)
      .values({
        id: itemsOutInDatabase.find(
          (i) =>
            i.title === item.title && i.coverImageUrl === item.coverImageUrl
        )?.id,
        title: item.title,
        dueDate: item.dueDate.toISOString(),
        renewalsLeft: item.renewalsLeft,
        callNumber: item.callNumber,
        assignedBranch: item.assignedBranch,
        coverImageUrl: item.coverImageUrl,
        returned: false,
      })
      .onConflictDoUpdate({
        target: [schema.booksOut.id],
        set: {
          dueDate: item.dueDate.toISOString(),
          renewalsLeft: item.renewalsLeft,
          callNumber: item.callNumber,
          assignedBranch: item.assignedBranch,
          coverImageUrl: item.coverImageUrl,
          returned: false,
        },
      });
  }
}
