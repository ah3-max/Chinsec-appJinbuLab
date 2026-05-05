import type { PrismaClient } from "@prisma/client";
import { L1_S07 } from "../../../src/content/scenarios/L1-S07-assistance";
import { seedScenario } from "./builder";

export async function seedScenarioL1S07(prisma: PrismaClient) {
  return seedScenario(prisma, L1_S07);
}
