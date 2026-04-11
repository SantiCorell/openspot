-- AlterTable
ALTER TABLE "User" ADD COLUMN     "extraComparisonCredits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "freeComparisonUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "monthlyComparisonCount" INTEGER NOT NULL DEFAULT 0;
