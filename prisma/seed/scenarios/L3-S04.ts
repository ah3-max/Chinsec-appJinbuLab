import type { PrismaClient } from "@prisma/client";
import { L3_S04 } from "../../../src/content/scenarios/L3-S04-fall-handling";
import { seedScenario } from "./builder";

export async function seedScenarioL3S04(prisma: PrismaClient) {
  return seedScenario(prisma, L3_S04);
}
