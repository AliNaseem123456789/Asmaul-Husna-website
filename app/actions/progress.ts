"use server";

import { pool } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function updateProgress(nameId: number, isAdding: boolean) {
  const session = (await cookies()).get("session")?.value;
  if (!session) return; // Fail silently if not logged in

  const { payload } = await jwtVerify(session, SECRET);
  const userId = payload.id;

  if (isAdding) {
    await pool.query(
      "INSERT INTO user_progress (user_id, name_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, nameId],
    );
  } else {
    await pool.query(
      "DELETE FROM user_progress WHERE user_id = $1 AND name_id = $2",
      [userId, nameId],
    );
  }
}
