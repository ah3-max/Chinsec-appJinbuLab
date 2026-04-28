import type { PrismaClient } from "@prisma/client";
import { L2_S04 } from "../../../src/content/scenarios/L2-S04-turning-positioning";
import { seedScenario } from "./builder";

export async function seedScenarioL2S04(prisma: PrismaClient) {
  return seedScenario(prisma, L2_S04);
}
