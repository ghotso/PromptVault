/*
  Warnings:

  - A unique constraint covering the columns `[userId,promptId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_promptId_key" ON "Rating"("userId", "promptId");
