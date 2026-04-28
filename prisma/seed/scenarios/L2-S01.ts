import type { PrismaClient } from "@prisma/client";
import { L2_S01 } from "../../../src/content/scenarios/L2-S01-feeding-assistance";
import { seedScenario } from "./builder";

export async function seedScenarioL2S01(prisma: PrismaClient) {
  return seedScenario(prisma, L2_S01);
}
