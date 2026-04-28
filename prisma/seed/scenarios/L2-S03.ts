import type { PrismaClient } from "@prisma/client";
import { L2_S03 } from "../../../src/content/scenarios/L2-S03-diaper-care";
import { seedScenario } from "./builder";

export async function seedScenarioL2S03(prisma: PrismaClient) {
  return seedScenario(prisma, L2_S03);
}
