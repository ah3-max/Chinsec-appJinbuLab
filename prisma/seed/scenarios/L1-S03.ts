import type { PrismaClient } from "@prisma/client";
import { L1_S03 } from "../../../src/content/scenarios/L1-S03-meeting-colleagues";
import { seedScenario } from "./builder";

export async function seedScenarioL1S03(prisma: PrismaClient) {
  return seedScenario(prisma, L1_S03);
}
