-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_lessonId_fkey";

-- AlterTable
ALTER TABLE "exercises" ADD COLUMN     "scenarioId" TEXT,
ALTER COLUMN "lessonId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vocabularies" ADD COLUMN     "difficulty" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "scenarios" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleI18n" JSONB NOT NULL,
    "hookContent" JSONB,
    "dialogue" JSONB,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 25,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "prerequisiteScenarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_vocabularies" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "isCore" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL,

    CONSTRAINT "scenario_vocabularies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scenarios_code_key" ON "scenarios"("code");

-- CreateIndex
CREATE INDEX "scenarios_level_orderIndex_idx" ON "scenarios"("level", "orderIndex");

-- CreateIndex
CREATE INDEX "scenario_vocabularies_vocabularyId_idx" ON "scenario_vocabularies"("vocabularyId");

-- CreateIndex
CREATE UNIQUE INDEX "scenario_vocabularies_scenarioId_vocabularyId_key" ON "scenario_vocabularies"("scenarioId", "vocabularyId");

-- CreateIndex
CREATE INDEX "exercises_scenarioId_idx" ON "exercises"("scenarioId");

-- AddForeignKey
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_prerequisiteScenarioId_fkey" FOREIGN KEY ("prerequisiteScenarioId") REFERENCES "scenarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_vocabularies" ADD CONSTRAINT "scenario_vocabularies_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_vocabularies" ADD CONSTRAINT "scenario_vocabularies_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "vocabularies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
