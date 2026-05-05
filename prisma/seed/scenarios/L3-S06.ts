import type { PrismaClient } from "@prisma/client";
import { L3_S06 } from "../../../src/content/scenarios/L3-S06-ng-tube-care";
import { seedScenario } from "./builder";

export async function seedScenarioL3S06(prisma: PrismaClient) {
  return seedScenario(prisma, L3_S06);
}
