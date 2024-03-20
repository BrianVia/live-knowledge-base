import { getLibraryItemsOut } from "./fetch-library-items-out";
import { db } from "../../../database/db";
import * as schema from "../../../database/schema";

export async function checkLibraryItemsOut(): Promise<any> {
  const currentItemsOut = await getLibraryItemsOut();
  console.table(currentItemsOut);

  const itemsOutInDatabase = await db.select().from(schema.booksOut);
  console.table(itemsOutInDatabase);

  //upsert the items found
  for (const item of currentItemsOut) {
    const linkDetailsResonse = await fetch(item.linkDetails)
      .then((res) => {
        // console.log(res);
        console.log(res.buffer());
      })
      .catch(console.error);
    console.log(JSON.stringify(linkDetailsResonse, null, 2));

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
