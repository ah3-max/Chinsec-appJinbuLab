import type { PrismaClient } from "@prisma/client";
import { L3_S03 } from "../../../src/content/scenarios/L3-S03-dementia-care";
import { seedScenario } from "./builder";

export async function seedScenarioL3S03(prisma: PrismaClient) {
  return seedScenario(prisma, L3_S03);
}
