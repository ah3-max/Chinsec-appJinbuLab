import type { PrismaClient } from "@prisma/client";
import { L1_S04 } from "../../../src/content/scenarios/L1-S04-body-parts";
import { seedScenario } from "./builder";

export async function seedScenarioL1S04(prisma: PrismaClient) {
  return seedScenario(prisma, L1_S04);
}
