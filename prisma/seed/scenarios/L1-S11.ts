import type { PrismaClient } from "@prisma/client";
import { L1_S11 } from "../../../src/content/scenarios/L1-S11-days-dates";
import { seedScenario } from "./builder";

export async function seedScenarioL1S11(prisma: PrismaClient) {
  return seedScenario(prisma, L1_S11);
}
