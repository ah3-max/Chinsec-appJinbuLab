import type { PrismaClient } from "@prisma/client";
import { L2_S05 } from "../../../src/content/scenarios/L2-S05-vital-signs";
import { seedScenario } from "./builder";

export async function seedScenarioL2S05(prisma: PrismaClient) {
  return seedScenario(prisma, L2_S05);
}
