-- AlterTable
ALTER TABLE "exam_attempts" ADD COLUMN     "questionSnapshot" JSONB;

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "courseCode" TEXT NOT NULL,
    "examAttemptId" TEXT,
    "fullNameSnapshot" TEXT NOT NULL,
    "scoreSnapshot" INTEGER NOT NULL,
    "maxScoreSnapshot" INTEGER NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfUrl" TEXT,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificates_examAttemptId_key" ON "certificates"("examAttemptId");

-- CreateIndex
CREATE INDEX "certificates_userId_idx" ON "certificates"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_userId_level_key" ON "certificates"("userId", "level");

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_examAttemptId_fkey" FOREIGN KEY ("examAttemptId") REFERENCES "exam_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
