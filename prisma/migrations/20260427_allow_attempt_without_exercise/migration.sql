-- DropForeignKey
ALTER TABLE "user_attempts" DROP CONSTRAINT "user_attempts_exerciseId_fkey";

-- AlterTable
ALTER TABLE "user_attempts" ADD COLUMN     "exerciseSnapshot" JSONB,
ADD COLUMN     "exerciseType" "ExerciseType" NOT NULL,
ADD COLUMN     "sessionKey" TEXT,
ADD COLUMN     "suspicious" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "suspiciousReasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "exerciseId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "user_attempts_userId_sessionKey_idx" ON "user_attempts"("userId", "sessionKey");

-- AddForeignKey
ALTER TABLE "user_attempts" ADD CONSTRAINT "user_attempts_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
