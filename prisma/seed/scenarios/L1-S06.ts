import type { PrismaClient } from "@prisma/client";
import { L1_S06 } from "../../../src/content/scenarios/L1-S06-numbers-time";
import { seedScenario } from "./builder";

export async function seedScenarioL1S06(prisma: PrismaClient) {
  return seedScenario(prisma, L1_S06);
}
