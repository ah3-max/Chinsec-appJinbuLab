import type { PrismaClient } from "@prisma/client";
import { L3_S12 } from "../../../src/content/scenarios/L3-S12-team-communication";
import { seedScenario } from "./builder";

export async function seedScenarioL3S12(prisma: PrismaClient) {
  return seedScenario(prisma, L3_S12);
}
