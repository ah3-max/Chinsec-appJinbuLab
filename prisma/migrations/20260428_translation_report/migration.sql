-- CreateTable
CREATE TABLE "translation_reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "suggestedText" TEXT,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "translation_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "translation_reports_userId_status_idx" ON "translation_reports"("userId", "status");

-- CreateIndex
CREATE INDEX "translation_reports_contentType_contentId_idx" ON "translation_reports"("contentType", "contentId");

-- AddForeignKey
ALTER TABLE "translation_reports" ADD CONSTRAINT "translation_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
