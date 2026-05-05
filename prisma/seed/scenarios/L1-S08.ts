import type { PrismaClient } from "@prisma/client";
import { L1_S08 } from "../../../src/content/scenarios/L1-S08-meal-service";
import { seedScenario } from "./builder";

export async function seedScenarioL1S08(prisma: PrismaClient) {
  return seedScenario(prisma, L1_S08);
}
