-- AlterTable
ALTER TABLE "scenarios" ADD COLUMN     "mtcAlignment" JSONB;

-- AlterTable
ALTER TABLE "vocabularies" ADD COLUMN     "isEldercareVocab" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mtcReference" JSONB;
