import type { PrismaClient } from "@prisma/client";
import { L3_S07 } from "../../../src/content/scenarios/L3-S07-urinary-care";
import { seedScenario } from "./builder";

export async function seedScenarioL3S07(prisma: PrismaClient) {
  return seedScenario(prisma, L3_S07);
}
