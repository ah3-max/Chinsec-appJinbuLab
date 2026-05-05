import type { PrismaClient } from "@prisma/client";
import { L2_S07 } from "../../../src/content/scenarios/L2-S07-oral-hygiene";
import { seedScenario } from "./builder";

export async function seedScenarioL2S07(prisma: PrismaClient) {
  return seedScenario(prisma, L2_S07);
}
