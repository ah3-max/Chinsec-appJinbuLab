-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('LEARNER', 'TEACHER', 'FACILITY_MGR', 'HR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ON_LEAVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Nationality" AS ENUM ('TW', 'TH', 'VN', 'ID', 'PH', 'MY', 'KH', 'MM', 'OTHER');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('ZHUYIN', 'A1_BEGINNER', 'A2_BASIC', 'B1_INTERMEDIATE', 'B2_UPPER_INTER', 'C1_ADVANCED', 'C2_PROFICIENT');

-- CreateEnum
CREATE TYPE "CourseCategory" AS ENUM ('ZHUYIN', 'GENERAL', 'SCENARIO_ELDERCARE', 'SCENARIO_OFFICE', 'SCENARIO_DAILY', 'EXAM_PREP');

-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('ZHUYIN_INTRO', 'ZHUYIN_PRACTICE', 'VOCAB', 'GRAMMAR', 'DIALOGUE', 'LISTENING', 'READING', 'WRITING', 'SPEAKING', 'REVIEW', 'BOSS', 'CULTURE');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('ZHUYIN_RECOGNITION', 'ZHUYIN_PRODUCTION', 'TONE_DISCRIMINATION', 'PRONUNCIATION', 'VOCAB_MCQ', 'VOCAB_MCQ_REVERSE', 'VOCAB_MATCH', 'VOCAB_LISTEN_CHOOSE', 'VOCAB_FLASHCARD', 'GRAMMAR_MCQ', 'GRAMMAR_FILL', 'GRAMMAR_ARRANGE', 'GRAMMAR_TRANSFORM', 'LISTEN_DIALOGUE_MCQ', 'LISTEN_FILL', 'LISTEN_DICTATION', 'READ_COMPREHENSION', 'READ_TRUE_FALSE', 'SPEAK_REPEAT', 'SPEAK_RESPOND', 'SPEAK_DESCRIBE', 'SPEAK_DIALOGUE', 'WRITE_HANZI', 'WRITE_SENTENCE', 'WRITE_PARAGRAPH', 'WRITE_COMPOSITION', 'DRAG_DROP', 'IMAGE_LABELING', 'SCENARIO_CHOICE');

-- CreateEnum
CREATE TYPE "SrsTargetType" AS ENUM ('VOCABULARY', 'GRAMMAR', 'SENTENCE', 'CHARACTER');

-- CreateEnum
CREATE TYPE "SrsStatus" AS ENUM ('NEW', 'LEARNING', 'REVIEW', 'MASTERED', 'SUSPENDED', 'LEECH');

-- CreateEnum
CREATE TYPE "HomeworkType" AS ENUM ('WRITING_HANDWRITTEN', 'WRITING_TYPED', 'COMPOSITION', 'AUDIO_RECORDING', 'TRANSLATION', 'DICTATION', 'CHARACTER_PRACTICE', 'MIXED');

-- CreateEnum
CREATE TYPE "AntiCheatLevel" AS ENUM ('NONE', 'STANDARD', 'STRICT', 'MAXIMUM');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'AI_GRADED', 'RETURNED', 'RESUBMITTED', 'FLAGGED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PlagiarismCheckType" AS ENUM ('HASH_MATCH', 'SIMHASH', 'COSINE_SIMILARITY', 'AI_SEMANTIC', 'AUDIO_FINGERPRINT', 'HANDWRITING_PATTERN');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('LISTENING', 'READING', 'WRITING', 'SPEAKING', 'COMPREHENSIVE', 'PLACEMENT', 'DIAGNOSTIC');

-- CreateEnum
CREATE TYPE "LeaderBoardScope" AS ENUM ('FACILITY', 'CLASS', 'GLOBAL', 'NATIONALITY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "fullName" TEXT NOT NULL,
    "preferredName" TEXT,
    "avatarUrl" TEXT,
    "nationality" "Nationality" NOT NULL,
    "nativeLanguage" TEXT NOT NULL,
    "uiLanguage" TEXT NOT NULL DEFAULT 'zh-TW',
    "workPermitId" TEXT,
    "passportNo" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'LEARNER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "facilityId" TEXT,
    "department" TEXT,
    "position" TEXT,
    "currentLevel" "Level" NOT NULL DEFAULT 'ZHUYIN',
    "currentStageId" TEXT,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "weeklyXp" INTEGER NOT NULL DEFAULT 0,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "lastStreakDate" TIMESTAMP(3),
    "totalStudyMin" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3),
    "employeeId" TEXT,
    "hireDate" TIMESTAMP(3),
    "hrSyncId" TEXT,
    "ltcImsSyncId" TEXT,
    "externalIds" JSONB,
    "voiceConsent" BOOLEAN NOT NULL DEFAULT false,
    "imageConsent" BOOLEAN NOT NULL DEFAULT false,
    "privacySigned" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "address" TEXT,
    "bedCount" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" "Level" NOT NULL,
    "facilityId" TEXT,
    "teacherId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "device" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "failReason" TEXT,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "level" "Level" NOT NULL,
    "category" "CourseCategory" NOT NULL,
    "titleI18n" JSONB,
    "descriptionI18n" JSONB,
    "iconUrl" TEXT,
    "coverImage" TEXT,
    "themeColor" TEXT,
    "estimatedHours" INTEGER NOT NULL,
    "vocabularyCount" INTEGER NOT NULL,
    "tocflTarget" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stages" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleI18n" JSONB,
    "description" TEXT,
    "iconUrl" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "unlockRequirement" JSONB,
    "hasBossLevel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleI18n" JSONB,
    "description" TEXT,
    "type" "LessonType" NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "content" JSONB NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 10,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "bonusXp" INTEGER NOT NULL DEFAULT 5,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabularies" (
    "id" TEXT NOT NULL,
    "hanzi" TEXT NOT NULL,
    "hanziSimplified" TEXT,
    "zhuyin" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,
    "partOfSpeech" TEXT,
    "translations" JSONB NOT NULL,
    "level" "Level" NOT NULL,
    "tocflBand" TEXT,
    "frequency" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "audioUrl" TEXT,
    "audioSlowUrl" TEXT,
    "imageUrl" TEXT,
    "strokeCount" INTEGER,
    "strokeOrder" JSONB,
    "radicals" TEXT,
    "etymology" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabularies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_vocabularies" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "isCore" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lesson_vocabularies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "example_sentences" (
    "id" TEXT NOT NULL,
    "vocabularyId" TEXT,
    "hanzi" TEXT NOT NULL,
    "zhuyin" TEXT,
    "pinyin" TEXT,
    "translations" JSONB NOT NULL,
    "audioUrl" TEXT,
    "level" "Level" NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "example_sentences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grammars" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionI18n" JSONB,
    "level" "Level" NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "examples" JSONB NOT NULL,
    "commonMistakes" JSONB,
    "audioUrl" TEXT,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grammars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_grammars" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "grammarId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lesson_grammars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dialogues" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "category" TEXT NOT NULL,
    "script" JSONB NOT NULL,
    "context" TEXT,
    "contextI18n" JSONB,
    "culturalNotes" TEXT,
    "audioUrl" TEXT,
    "videoUrl" TEXT,
    "keyVocabularies" TEXT[],
    "keyGrammars" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dialogues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_dialogues" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "dialogueId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lesson_dialogues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "type" "ExerciseType" NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "prompt" JSONB NOT NULL,
    "options" JSONB,
    "answer" JSONB NOT NULL,
    "hint" TEXT,
    "hintI18n" JSONB,
    "explanation" TEXT,
    "explanationI18n" JSONB,
    "audioUrl" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "maxScore" INTEGER NOT NULL DEFAULT 10,
    "passingScore" INTEGER NOT NULL DEFAULT 6,
    "timeLimit" INTEGER,
    "skillsTrained" TEXT[],
    "tags" TEXT[],
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "userAnswer" JSONB NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "timeSpentSec" INTEGER NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 1,
    "hintUsed" BOOLEAN NOT NULL DEFAULT false,
    "windowBlurCount" INTEGER NOT NULL DEFAULT 0,
    "pasteDetected" BOOLEAN NOT NULL DEFAULT false,
    "device" TEXT,
    "ipAddress" TEXT,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "srs_schedules" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetType" "SrsTargetType" NOT NULL,
    "vocabularyId" TEXT,
    "grammarId" TEXT,
    "sentenceId" TEXT,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "intervalDays" INTEGER NOT NULL DEFAULT 1,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3) NOT NULL,
    "status" "SrsStatus" NOT NULL DEFAULT 'NEW',
    "totalAttempts" INTEGER NOT NULL DEFAULT 0,
    "correctAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastQuality" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "srs_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homeworks" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "lessonId" TEXT,
    "title" TEXT NOT NULL,
    "titleI18n" JSONB,
    "description" TEXT NOT NULL,
    "descriptionI18n" JSONB,
    "type" "HomeworkType" NOT NULL,
    "prompt" JSONB NOT NULL,
    "attachments" JSONB,
    "rubric" JSONB,
    "maxScore" INTEGER NOT NULL DEFAULT 100,
    "passingScore" INTEGER NOT NULL DEFAULT 60,
    "minWords" INTEGER,
    "maxWords" INTEGER,
    "timeLimit" INTEGER,
    "allowLate" BOOLEAN NOT NULL DEFAULT true,
    "latePenalty" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "antiCheatLevel" "AntiCheatLevel" NOT NULL DEFAULT 'STANDARD',
    "forceHandwriting" BOOLEAN NOT NULL DEFAULT false,
    "blockPaste" BOOLEAN NOT NULL DEFAULT true,
    "detectPlagiarism" BOOLEAN NOT NULL DEFAULT true,
    "similarityThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    "publishAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3) NOT NULL,
    "aiAutoGrade" BOOLEAN NOT NULL DEFAULT true,
    "requireTeacherReview" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homeworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "homeworkId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentText" TEXT,
    "handwritingUrl" TEXT,
    "handwritingData" JSONB,
    "audioUrl" TEXT,
    "audioTranscript" TEXT,
    "attachments" JSONB,
    "contentFingerprint" TEXT,
    "audioFingerprint" TEXT,
    "similarity" DOUBLE PRECISION,
    "similarToSubmissionId" TEXT,
    "plagiarismChecked" BOOLEAN NOT NULL DEFAULT false,
    "plagiarismReport" JSONB,
    "totalTimeSec" INTEGER,
    "pasteCount" INTEGER NOT NULL DEFAULT 0,
    "windowBlurCount" INTEGER NOT NULL DEFAULT 0,
    "copyCount" INTEGER NOT NULL DEFAULT 0,
    "rightClickCount" INTEGER NOT NULL DEFAULT 0,
    "suspicionScore" DOUBLE PRECISION,
    "device" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "aiScore" INTEGER,
    "aiFeedback" JSONB,
    "aiModel" TEXT,
    "aiCheckedAt" TIMESTAMP(3),
    "teacherScore" INTEGER,
    "teacherFeedback" TEXT,
    "teacherFeedbackAudio" TEXT,
    "rubricScores" JSONB,
    "gradedBy" TEXT,
    "gradedAt" TIMESTAMP(3),
    "status" "SubmissionStatus" NOT NULL DEFAULT 'DRAFT',
    "isLate" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "returnedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plagiarism_checks" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "checkType" "PlagiarismCheckType" NOT NULL,
    "matchedSubmissionId" TEXT,
    "similarity" DOUBLE PRECISION NOT NULL,
    "matchedSegments" JSONB,
    "method" TEXT NOT NULL,
    "modelUsed" TEXT,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "reviewedBy" TEXT,
    "reviewDecision" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plagiarism_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaking_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT,
    "conversationId" TEXT,
    "audioUrl" TEXT NOT NULL,
    "audioFormat" TEXT NOT NULL,
    "durationSec" DOUBLE PRECISION NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "targetText" TEXT,
    "targetZhuyin" TEXT,
    "targetPinyin" TEXT,
    "transcript" TEXT,
    "transcriptLang" TEXT,
    "sttModel" TEXT,
    "sttConfidence" DOUBLE PRECISION,
    "pronunciationScore" DOUBLE PRECISION,
    "toneScore" DOUBLE PRECISION,
    "fluencyScore" DOUBLE PRECISION,
    "rhythmScore" DOUBLE PRECISION,
    "overallScore" DOUBLE PRECISION,
    "phoneticErrors" JSONB,
    "toneErrors" JSONB,
    "aiAnalysis" JSONB,
    "aiSuggestions" TEXT,
    "aiSuggestionsI18n" JSONB,
    "l1Interference" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speaking_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "handwriting_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT,
    "submissionId" TEXT,
    "targetCharacter" TEXT,
    "targetText" TEXT,
    "imageUrl" TEXT NOT NULL,
    "strokes" JSONB NOT NULL,
    "totalStrokes" INTEGER NOT NULL,
    "totalDuration" INTEGER NOT NULL,
    "canvasWidth" INTEGER NOT NULL,
    "canvasHeight" INTEGER NOT NULL,
    "ocrText" TEXT,
    "ocrConfidence" DOUBLE PRECISION,
    "ocrModel" TEXT,
    "shapeScore" DOUBLE PRECISION,
    "strokeOrderCorrect" BOOLEAN,
    "strokeOrderScore" DOUBLE PRECISION,
    "structureScore" DOUBLE PRECISION,
    "overallScore" DOUBLE PRECISION,
    "feedback" JSONB,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "handwriting_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_prints" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "embeddings" JSONB NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "sampleCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_prints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "handwriting_prints" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "sampleCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "handwriting_prints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_exams" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleI18n" JSONB,
    "description" TEXT,
    "level" "Level" NOT NULL,
    "type" "ExamType" NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "passingScore" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "issueCertificate" BOOLEAN NOT NULL DEFAULT false,
    "certificateTemplate" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mock_exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_questions" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "type" "ExerciseType" NOT NULL,
    "prompt" JSONB NOT NULL,
    "options" JSONB,
    "answer" JSONB NOT NULL,
    "audioUrl" TEXT,
    "imageUrl" TEXT,
    "score" INTEGER NOT NULL DEFAULT 1,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "listeningScore" INTEGER,
    "readingScore" INTEGER,
    "writingScore" INTEGER,
    "speakingScore" INTEGER,
    "passed" BOOLEAN NOT NULL,
    "certificateUrl" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "durationSec" INTEGER,
    "windowBlurCount" INTEGER NOT NULL DEFAULT 0,
    "suspicionFlags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameI18n" JSONB,
    "description" TEXT NOT NULL,
    "descriptionI18n" JSONB,
    "iconUrl" TEXT,
    "category" TEXT NOT NULL,
    "rarity" TEXT NOT NULL DEFAULT 'common',
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "unlockCriteria" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shareCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_missions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "missions" JSONB NOT NULL,
    "allCompleted" BOOLEAN NOT NULL DEFAULT false,
    "bonusXp" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboards" (
    "id" TEXT NOT NULL,
    "scope" "LeaderBoardScope" NOT NULL,
    "scopeId" TEXT,
    "period" TEXT NOT NULL,
    "periodType" TEXT NOT NULL,
    "rankings" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leaderboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_metrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "periodType" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "hoursStudied" DOUBLE PRECISION NOT NULL,
    "lessonsCompleted" INTEGER NOT NULL,
    "exercisesAttempted" INTEGER NOT NULL,
    "exercisesCorrect" INTEGER NOT NULL,
    "accuracyRate" DOUBLE PRECISION NOT NULL,
    "homeworkSubmitted" INTEGER NOT NULL,
    "homeworkAvgScore" DOUBLE PRECISION,
    "homeworkOnTime" INTEGER NOT NULL,
    "speakingPractices" INTEGER NOT NULL,
    "writingPractices" INTEGER NOT NULL,
    "startLevel" "Level" NOT NULL,
    "endLevel" "Level" NOT NULL,
    "examsPassed" JSONB NOT NULL,
    "activeDays" INTEGER NOT NULL,
    "longestStreak" INTEGER NOT NULL,
    "performanceGrade" TEXT,
    "performanceScore" DOUBLE PRECISION,
    "bonusEligibility" BOOLEAN NOT NULL DEFAULT false,
    "bonusType" TEXT,
    "bonusAmount" DECIMAL(10,2),
    "bonusCurrency" TEXT NOT NULL DEFAULT 'TWD',
    "bonusJustification" TEXT,
    "syncedToHrAt" TIMESTAMP(3),
    "hrSyncStatus" TEXT,
    "hrApprovalRequired" BOOLEAN NOT NULL DEFAULT true,
    "hrApprovedBy" TEXT,
    "hrApprovedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_conversations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "goal" TEXT,
    "systemPrompt" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "turnCount" INTEGER NOT NULL DEFAULT 0,
    "vocabUsed" TEXT[],
    "grammarUsed" TEXT[],
    "errorsCount" INTEGER NOT NULL DEFAULT 0,
    "modelProvider" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "finalFeedback" TEXT,
    "finalScore" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "durationSec" INTEGER,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_grade_logs" (
    "id" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "modelProvider" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "rawResponse" TEXT NOT NULL,
    "parsedResult" JSONB NOT NULL,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "costEstimate" DECIMAL(10,6),
    "durationMs" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_grade_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleI18n" JSONB,
    "body" TEXT,
    "bodyI18n" JSONB,
    "link" TEXT,
    "iconUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "pushSent" BOOLEAN NOT NULL DEFAULT false,
    "pushSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_configs" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "before" JSONB,
    "after" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "heartbeat_statuses" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "metrics" JSONB NOT NULL,
    "message" TEXT,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "heartbeat_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_syncs" (
    "id" TEXT NOT NULL,
    "targetSystem" TEXT NOT NULL,
    "syncType" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "recordCount" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "payload" JSONB,
    "response" JSONB,
    "errors" JSONB,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integration_syncs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FacilityManagers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeId_key" ON "users"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "users_hrSyncId_key" ON "users"("hrSyncId");

-- CreateIndex
CREATE UNIQUE INDEX "users_ltcImsSyncId_key" ON "users"("ltcImsSyncId");

-- CreateIndex
CREATE INDEX "users_nationality_idx" ON "users"("nationality");

-- CreateIndex
CREATE INDEX "users_role_status_idx" ON "users"("role", "status");

-- CreateIndex
CREATE INDEX "users_facilityId_idx" ON "users"("facilityId");

-- CreateIndex
CREATE INDEX "users_currentLevel_idx" ON "users"("currentLevel");

-- CreateIndex
CREATE INDEX "users_employeeId_idx" ON "users"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "facilities_code_key" ON "facilities"("code");

-- CreateIndex
CREATE INDEX "classes_teacherId_idx" ON "classes"("teacherId");

-- CreateIndex
CREATE INDEX "classes_facilityId_idx" ON "classes"("facilityId");

-- CreateIndex
CREATE INDEX "enrollments_userId_idx" ON "enrollments"("userId");

-- CreateIndex
CREATE INDEX "enrollments_classId_idx" ON "enrollments"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_userId_classId_key" ON "enrollments"("userId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "login_logs_userId_loggedAt_idx" ON "login_logs"("userId", "loggedAt");

-- CreateIndex
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");

-- CreateIndex
CREATE INDEX "courses_level_idx" ON "courses"("level");

-- CreateIndex
CREATE INDEX "courses_category_idx" ON "courses"("category");

-- CreateIndex
CREATE INDEX "stages_courseId_idx" ON "stages"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "stages_courseId_code_key" ON "stages"("courseId", "code");

-- CreateIndex
CREATE INDEX "lessons_stageId_idx" ON "lessons"("stageId");

-- CreateIndex
CREATE INDEX "lessons_type_idx" ON "lessons"("type");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_stageId_code_key" ON "lessons"("stageId", "code");

-- CreateIndex
CREATE INDEX "vocabularies_level_idx" ON "vocabularies"("level");

-- CreateIndex
CREATE INDEX "vocabularies_category_idx" ON "vocabularies"("category");

-- CreateIndex
CREATE INDEX "vocabularies_hanzi_idx" ON "vocabularies"("hanzi");

-- CreateIndex
CREATE INDEX "lesson_vocabularies_lessonId_idx" ON "lesson_vocabularies"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_vocabularies_lessonId_vocabularyId_key" ON "lesson_vocabularies"("lessonId", "vocabularyId");

-- CreateIndex
CREATE INDEX "example_sentences_vocabularyId_idx" ON "example_sentences"("vocabularyId");

-- CreateIndex
CREATE INDEX "example_sentences_level_idx" ON "example_sentences"("level");

-- CreateIndex
CREATE UNIQUE INDEX "grammars_code_key" ON "grammars"("code");

-- CreateIndex
CREATE INDEX "grammars_level_idx" ON "grammars"("level");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_grammars_lessonId_grammarId_key" ON "lesson_grammars"("lessonId", "grammarId");

-- CreateIndex
CREATE UNIQUE INDEX "dialogues_code_key" ON "dialogues"("code");

-- CreateIndex
CREATE INDEX "dialogues_level_idx" ON "dialogues"("level");

-- CreateIndex
CREATE INDEX "dialogues_category_idx" ON "dialogues"("category");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_dialogues_lessonId_dialogueId_key" ON "lesson_dialogues"("lessonId", "dialogueId");

-- CreateIndex
CREATE INDEX "exercises_lessonId_idx" ON "exercises"("lessonId");

-- CreateIndex
CREATE INDEX "exercises_type_idx" ON "exercises"("type");

-- CreateIndex
CREATE INDEX "user_attempts_userId_exerciseId_idx" ON "user_attempts"("userId", "exerciseId");

-- CreateIndex
CREATE INDEX "user_attempts_userId_attemptedAt_idx" ON "user_attempts"("userId", "attemptedAt");

-- CreateIndex
CREATE INDEX "srs_schedules_userId_nextReviewAt_idx" ON "srs_schedules"("userId", "nextReviewAt");

-- CreateIndex
CREATE INDEX "srs_schedules_userId_status_idx" ON "srs_schedules"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "srs_schedules_userId_vocabularyId_key" ON "srs_schedules"("userId", "vocabularyId");

-- CreateIndex
CREATE INDEX "homeworks_classId_idx" ON "homeworks"("classId");

-- CreateIndex
CREATE INDEX "homeworks_dueDate_idx" ON "homeworks"("dueDate");

-- CreateIndex
CREATE INDEX "submissions_homeworkId_idx" ON "submissions"("homeworkId");

-- CreateIndex
CREATE INDEX "submissions_userId_idx" ON "submissions"("userId");

-- CreateIndex
CREATE INDEX "submissions_status_idx" ON "submissions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_homeworkId_userId_key" ON "submissions"("homeworkId", "userId");

-- CreateIndex
CREATE INDEX "plagiarism_checks_submissionId_idx" ON "plagiarism_checks"("submissionId");

-- CreateIndex
CREATE INDEX "plagiarism_checks_isFlagged_idx" ON "plagiarism_checks"("isFlagged");

-- CreateIndex
CREATE INDEX "speaking_records_userId_recordedAt_idx" ON "speaking_records"("userId", "recordedAt");

-- CreateIndex
CREATE INDEX "speaking_records_exerciseId_idx" ON "speaking_records"("exerciseId");

-- CreateIndex
CREATE INDEX "handwriting_records_userId_recordedAt_idx" ON "handwriting_records"("userId", "recordedAt");

-- CreateIndex
CREATE INDEX "handwriting_records_targetCharacter_idx" ON "handwriting_records"("targetCharacter");

-- CreateIndex
CREATE UNIQUE INDEX "voice_prints_userId_key" ON "voice_prints"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "handwriting_prints_userId_key" ON "handwriting_prints"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "mock_exams_code_key" ON "mock_exams"("code");

-- CreateIndex
CREATE INDEX "mock_exams_level_idx" ON "mock_exams"("level");

-- CreateIndex
CREATE INDEX "mock_exams_type_idx" ON "mock_exams"("type");

-- CreateIndex
CREATE INDEX "exam_questions_examId_idx" ON "exam_questions"("examId");

-- CreateIndex
CREATE INDEX "exam_attempts_userId_examId_idx" ON "exam_attempts"("userId", "examId");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_code_key" ON "achievements"("code");

-- CreateIndex
CREATE INDEX "user_achievements_userId_idx" ON "user_achievements"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_userId_achievementId_key" ON "user_achievements"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "daily_missions_userId_idx" ON "daily_missions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_missions_userId_date_key" ON "daily_missions"("userId", "date");

-- CreateIndex
CREATE INDEX "leaderboards_generatedAt_idx" ON "leaderboards"("generatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboards_scope_scopeId_period_key" ON "leaderboards"("scope", "scopeId", "period");

-- CreateIndex
CREATE INDEX "performance_metrics_userId_idx" ON "performance_metrics"("userId");

-- CreateIndex
CREATE INDEX "performance_metrics_period_idx" ON "performance_metrics"("period");

-- CreateIndex
CREATE UNIQUE INDEX "performance_metrics_userId_period_key" ON "performance_metrics"("userId", "period");

-- CreateIndex
CREATE INDEX "ai_conversations_userId_startedAt_idx" ON "ai_conversations"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "ai_conversations_scenario_idx" ON "ai_conversations"("scenario");

-- CreateIndex
CREATE INDEX "ai_grade_logs_targetType_targetId_idx" ON "ai_grade_logs"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "ai_grade_logs_createdAt_idx" ON "ai_grade_logs"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_configs_key_key" ON "system_configs"("key");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_resource_resourceId_idx" ON "audit_logs"("resource", "resourceId");

-- CreateIndex
CREATE INDEX "heartbeat_statuses_service_reportedAt_idx" ON "heartbeat_statuses"("service", "reportedAt");

-- CreateIndex
CREATE INDEX "integration_syncs_targetSystem_startedAt_idx" ON "integration_syncs"("targetSystem", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "_FacilityManagers_AB_unique" ON "_FacilityManagers"("A", "B");

-- CreateIndex
CREATE INDEX "_FacilityManagers_B_index" ON "_FacilityManagers"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_logs" ADD CONSTRAINT "login_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_vocabularies" ADD CONSTRAINT "lesson_vocabularies_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_vocabularies" ADD CONSTRAINT "lesson_vocabularies_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "vocabularies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "example_sentences" ADD CONSTRAINT "example_sentences_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "vocabularies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_grammars" ADD CONSTRAINT "lesson_grammars_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_grammars" ADD CONSTRAINT "lesson_grammars_grammarId_fkey" FOREIGN KEY ("grammarId") REFERENCES "grammars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_dialogues" ADD CONSTRAINT "lesson_dialogues_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_dialogues" ADD CONSTRAINT "lesson_dialogues_dialogueId_fkey" FOREIGN KEY ("dialogueId") REFERENCES "dialogues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_attempts" ADD CONSTRAINT "user_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_attempts" ADD CONSTRAINT "user_attempts_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "srs_schedules" ADD CONSTRAINT "srs_schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "srs_schedules" ADD CONSTRAINT "srs_schedules_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "vocabularies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_homeworkId_fkey" FOREIGN KEY ("homeworkId") REFERENCES "homeworks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_records" ADD CONSTRAINT "speaking_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_examId_fkey" FOREIGN KEY ("examId") REFERENCES "mock_exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_examId_fkey" FOREIGN KEY ("examId") REFERENCES "mock_exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_metrics" ADD CONSTRAINT "performance_metrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityManagers" ADD CONSTRAINT "_FacilityManagers_A_fkey" FOREIGN KEY ("A") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityManagers" ADD CONSTRAINT "_FacilityManagers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
