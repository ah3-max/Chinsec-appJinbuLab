import type { PrismaClient } from "@prisma/client";
import { L1_S01 } from "../../../src/content/scenarios/L1-S01-self-introduction";
import { seedScenario } from "./builder";

export async function seedScenarioL1S01(prisma: PrismaClient) {
  return seedScenario(prisma, L1_S01);
}
