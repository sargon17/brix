import { query } from "./_generated/server";

export const list = query(async ({ db }) => {
  const vendors = await db.query("vendors").collect();

  return vendors;
});
