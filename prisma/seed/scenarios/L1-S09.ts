import type { PrismaClient } from "@prisma/client";
import { L1_S09 } from "../../../src/content/scenarios/L1-S09-emergency-call";
import { seedScenario } from "./builder";

export async function seedScenarioL1S09(prisma: PrismaClient) {
  return seedScenario(prisma, L1_S09);
}
