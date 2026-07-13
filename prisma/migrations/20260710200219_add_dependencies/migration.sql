/*
  Warnings:

  - Made the column `dueDate` on table `Todo` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "TodoDependency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dependentId" INTEGER NOT NULL,
    "prerequisiteId" INTEGER NOT NULL,
    CONSTRAINT "TodoDependency_dependentId_fkey" FOREIGN KEY ("dependentId") REFERENCES "Todo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TodoDependency_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "Todo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Todo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "imageUrl" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 1
);
INSERT INTO "new_Todo" ("createdAt", "dueDate", "id", "imageUrl", "title") SELECT "createdAt", "dueDate", "id", "imageUrl", "title" FROM "Todo";
DROP TABLE "Todo";
ALTER TABLE "new_Todo" RENAME TO "Todo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "TodoDependency_dependentId_prerequisiteId_key" ON "TodoDependency"("dependentId", "prerequisiteId");
