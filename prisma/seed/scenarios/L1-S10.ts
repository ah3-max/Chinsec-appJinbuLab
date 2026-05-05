import type { PrismaClient } from "@prisma/client";
import { L1_S10 } from "../../../src/content/scenarios/L1-S10-call-for-help";
import { seedScenario } from "./builder";

export async function seedScenarioL1S10(prisma: PrismaClient) {
  return seedScenario(prisma, L1_S10);
}
