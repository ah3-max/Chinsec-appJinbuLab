import type { PrismaClient } from "@prisma/client";
import { L1_S02 } from "../../../src/content/scenarios/L1-S02-morning-greetings";
import { seedScenario } from "./builder";

export async function seedScenarioL1S02(prisma: PrismaClient) {
  return seedScenario(prisma, L1_S02);
}
