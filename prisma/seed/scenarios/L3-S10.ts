import type { PrismaClient } from "@prisma/client";
import { L3_S10 } from "../../../src/content/scenarios/L3-S10-group-activity";
import { seedScenario } from "./builder";

export async function seedScenarioL3S10(prisma: PrismaClient) {
  return seedScenario(prisma, L3_S10);
}
