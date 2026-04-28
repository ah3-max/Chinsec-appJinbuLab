// Shared types for hand-authored scenario content. Path B's three scenarios
// (L1-S01..L1-S03) all conform to this shape; Task 4 + 5 reuse the same
// builder.

import type { ExerciseType, Level } from "@prisma/client";

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

  vocabularies: ScenarioVocabDef[]; // ordered
  dialogue: ScenarioDialogueLine[]; // ordered
  exercises: ScenarioExerciseDef[];
}
