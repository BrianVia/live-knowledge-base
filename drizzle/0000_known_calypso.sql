CREATE TABLE `books_out` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`dueDate` text,
	`renewalsLeft` integer,
	`callNumber` text,
	`assignedBranch` text,
	`coverImageUrl` text,
	`returned` integer DEFAULT false
);
