import type { PrismaClient } from "@prisma/client";
import { L2_S09 } from "../../../src/content/scenarios/L2-S09-dressing";
import { seedScenario } from "./builder";

export async function seedScenarioL2S09(prisma: PrismaClient) {
  return seedScenario(prisma, L2_S09);
}
