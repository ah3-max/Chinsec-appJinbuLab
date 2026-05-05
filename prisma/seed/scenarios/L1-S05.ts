import type { PrismaClient } from "@prisma/client";
import { L1_S05 } from "../../../src/content/scenarios/L1-S05-daily-needs";
import { seedScenario } from "./builder";

export async function seedScenarioL1S05(prisma: PrismaClient) {
  return seedScenario(prisma, L1_S05);
}
