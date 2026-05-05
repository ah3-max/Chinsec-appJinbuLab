import type { PrismaClient } from "@prisma/client";
import { L2_S10 } from "../../../src/content/scenarios/L2-S10-emotional-comfort";
import { seedScenario } from "./builder";

export async function seedScenarioL2S10(prisma: PrismaClient) {
  return seedScenario(prisma, L2_S10);
}
