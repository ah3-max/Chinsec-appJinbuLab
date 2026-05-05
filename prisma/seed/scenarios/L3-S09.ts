import type { PrismaClient } from "@prisma/client";
import { L3_S09 } from "../../../src/content/scenarios/L3-S09-written-handoff";
import { seedScenario } from "./builder";

export async function seedScenarioL3S09(prisma: PrismaClient) {
  return seedScenario(prisma, L3_S09);
}
