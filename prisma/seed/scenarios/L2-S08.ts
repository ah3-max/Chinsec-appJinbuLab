import type { PrismaClient } from "@prisma/client";
import { L2_S08 } from "../../../src/content/scenarios/L2-S08-bathing-help";
import { seedScenario } from "./builder";

export async function seedScenarioL2S08(prisma: PrismaClient) {
  return seedScenario(prisma, L2_S08);
}
