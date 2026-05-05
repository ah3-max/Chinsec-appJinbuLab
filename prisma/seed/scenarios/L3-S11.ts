import type { PrismaClient } from "@prisma/client";
import { L3_S11 } from "../../../src/content/scenarios/L3-S11-infection-control";
import { seedScenario } from "./builder";

export async function seedScenarioL3S11(prisma: PrismaClient) {
  return seedScenario(prisma, L3_S11);
}
