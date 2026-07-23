import { Router, type IRouter } from "express";
import { count } from "drizzle-orm";
import { generationsTable, projectsTable } from "@workspace/db";
import { GetStatsResponse } from "@workspace/api-zod";
import { isDatabaseConfigured, requireDb } from "../lib/db-guard";

const router: IRouter = Router();

router.get("/stats", async (_req, res) => {
  if (!isDatabaseConfigured) {
    res.json(
      GetStatsResponse.parse({
        projectCount: 0,
        generationCount: 0,
        systemUsage: [],
      }),
    );
    return;
  }

  const db = requireDb();
  const [projectRow] = await db.select({ n: count() }).from(projectsTable);
  const usage = await db
    .select({
      designSystemId: generationsTable.designSystemId,
      name: generationsTable.designSystemName,
      n: count(),
    })
    .from(generationsTable)
    .groupBy(generationsTable.designSystemId, generationsTable.designSystemName);

  const systemUsage = usage
    .map((u) => ({ designSystemId: u.designSystemId, name: u.name, count: Number(u.n) }))
    .sort((a, b) => b.count - a.count);

  res.json(
    GetStatsResponse.parse({
      projectCount: Number(projectRow?.n ?? 0),
      generationCount: systemUsage.reduce((sum, u) => sum + u.count, 0),
      systemUsage,
    }),
  );
});

export default router;
