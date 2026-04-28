import type { PrismaClient } from "@prisma/client";
import { L2_S02 } from "../../../src/content/scenarios/L2-S02-medication-time";
import { seedScenario } from "./builder";

export async function seedScenarioL2S02(prisma: PrismaClient) {
  return seedScenario(prisma, L2_S02);
}
