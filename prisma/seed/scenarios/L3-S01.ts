import type { PrismaClient } from "@prisma/client";
import { L3_S01 } from "../../../src/content/scenarios/L3-S01-phone-family";
import { seedScenario } from "./builder";

export async function seedScenarioL3S01(prisma: PrismaClient) {
  return seedScenario(prisma, L3_S01);
}
