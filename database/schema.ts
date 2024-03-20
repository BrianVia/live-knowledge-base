import {
  sqliteTable,
  text,
  integer,
  unique,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const booksOut = sqliteTable("books_out", {
  id: integer("id").primaryKey(),
  title: text("title"),
  dueDate: text("dueDate"),
  renewalsLeft: integer("renewalsLeft"),
  callNumber: text("callNumber"),
  assignedBranch: text("assignedBranch"),
  coverImageUrl: text("coverImageUrl"),
  returned: integer("returned", { mode: "boolean" }).default(false),
});
