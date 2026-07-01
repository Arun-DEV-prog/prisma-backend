-- CreateEnum
CREATE TYPE "Subscripionstatus" AS ENUM ('Active', 'Cancel', 'expired');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Subscripion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "status" "Subscripionstatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscripion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscripion_userId_key" ON "Subscripion"("userId");

-- AddForeignKey
ALTER TABLE "Subscripion" ADD CONSTRAINT "Subscripion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
