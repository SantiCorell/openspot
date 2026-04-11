-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('free', 'pro', 'enterprise');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "planTier" "PlanTier" NOT NULL DEFAULT 'free',
ADD COLUMN     "billingMonthAnchor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "monthlySearchCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "extraSearchCredits" INTEGER NOT NULL DEFAULT 0;
