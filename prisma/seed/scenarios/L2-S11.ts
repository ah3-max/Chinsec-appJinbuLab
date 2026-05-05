import type { PrismaClient } from "@prisma/client";
import { L2_S11 } from "../../../src/content/scenarios/L2-S11-walking-help";
import { seedScenario } from "./builder";

export async function seedScenarioL2S11(prisma: PrismaClient) {
  return seedScenario(prisma, L2_S11);
}
