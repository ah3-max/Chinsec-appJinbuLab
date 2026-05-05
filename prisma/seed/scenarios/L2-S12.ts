import type { PrismaClient } from "@prisma/client";
import { L2_S12 } from "../../../src/content/scenarios/L2-S12-nurse-report";
import { seedScenario } from "./builder";

export async function seedScenarioL2S12(prisma: PrismaClient) {
  return seedScenario(prisma, L2_S12);
}
