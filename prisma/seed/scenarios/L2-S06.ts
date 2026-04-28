import type { PrismaClient } from "@prisma/client";
import { L2_S06 } from "../../../src/content/scenarios/L2-S06-toileting-help";
import { seedScenario } from "./builder";

export async function seedScenarioL2S06(prisma: PrismaClient) {
  return seedScenario(prisma, L2_S06);
}
