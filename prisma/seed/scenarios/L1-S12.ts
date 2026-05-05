import type { PrismaClient } from "@prisma/client";
import { L1_S12 } from "../../../src/content/scenarios/L1-S12-shift-handoff";
import { seedScenario } from "./builder";

export async function seedScenarioL1S12(prisma: PrismaClient) {
  return seedScenario(prisma, L1_S12);
}
