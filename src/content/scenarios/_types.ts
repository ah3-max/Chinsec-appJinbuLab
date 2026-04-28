// Shared types for hand-authored scenario content. Path B's three scenarios
// (L1-S01..L1-S03) all conform to this shape; Task 4 + 5 reuse the same
// builder.

import type { ExerciseType, Level } from "@prisma/client";

export interface MtcReference {
  book: string; // B1..B6
  lesson: string; // L01..L15
  orderInLesson?: number;
}

export interface ScenarioVocabDef {
  hanzi: string;
  hanziSimplified?: string;
  zhuyin: string;
  pinyin: string;
  partOfSpeech?: string;
  translations: {
    th: string;
    vi?: string;
    id?: string;
    en?: string;
  };
  category: string;
  tags?: string[];
  difficulty?: number; // 1-5
  isCore?: boolean; // default true

  // 對標《當代中文課程》(僅元資料)
  mtcReference?: MtcReference;
  isEldercareVocab?: boolean;
}

export interface ScenarioDialogueLine {
  speaker: "learner" | "elder" | "manager" | "colleague" | "narrator" | string;
  speakerLabel?: { "zh-TW": string; th?: string; vi?: string; id?: string };
  hanzi: string;
  pinyin: string;
  translationI18n: { th: string; vi?: string; id?: string; en?: string };
}

export interface ScenarioExerciseDef {
  type: ExerciseType;
  difficulty?: number;
  prompt: Record<string, unknown>;
  options: Array<Record<string, unknown>>;
  answer: { value: unknown };
  hintI18n?: Record<string, string>;
  explanationI18n?: Record<string, string>;
  audioUrl?: string;
  skillsTrained?: string[];
}

export interface ScenarioMtcAlignment {
  books: string[]; // ["B1-L02", "B1-L03"] — 對應的當代課次
  topics: string[]; // ["greeting", "self-intro"]
}

export interface ScenarioDef {
  code: string; // L1-S01
  level: Level;
  orderIndex: number;
  title: string;
  titleI18n: { "zh-TW": string; th: string; vi: string; id: string };
  estimatedMinutes?: number;
  hookContent?: {
    storyTextI18n: { "zh-TW": string; th: string; vi: string; id: string };
    imageUrl?: string;
  };
  prerequisiteCode?: string; // L1-S00 → L1-S01 etc
  mtcAlignment?: ScenarioMtcAlignment;

  vocabularies: ScenarioVocabDef[]; // ordered
  dialogue: ScenarioDialogueLine[]; // ordered
  exercises: ScenarioExerciseDef[];
}
