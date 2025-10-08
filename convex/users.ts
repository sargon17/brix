import { query } from "./_generated/server";

export const buyer = query(async ({ db }) => {
  const user = await db.query("users")
  .filter(q =>
    q.eq(q.field('role'), 'buyer')
).first()

  return user;
});
