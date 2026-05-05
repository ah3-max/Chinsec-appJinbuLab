import type { PrismaClient } from "@prisma/client";
import { L3_S05 } from "../../../src/content/scenarios/L3-S05-medication-safety";
import { seedScenario } from "./builder";

export async function seedScenarioL3S05(prisma: PrismaClient) {
  return seedScenario(prisma, L3_S05);
}
