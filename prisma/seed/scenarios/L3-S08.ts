import type { PrismaClient } from "@prisma/client";
import { L3_S08 } from "../../../src/content/scenarios/L3-S08-rehab-help";
import { seedScenario } from "./builder";

export async function seedScenarioL3S08(prisma: PrismaClient) {
  return seedScenario(prisma, L3_S08);
}
