import type { PrismaClient } from "@prisma/client";
import { L3_S02 } from "../../../src/content/scenarios/L3-S02-family-visit";
import { seedScenario } from "./builder";

export async function seedScenarioL3S02(prisma: PrismaClient) {
  return seedScenario(prisma, L3_S02);
}
