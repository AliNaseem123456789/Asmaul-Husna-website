// app/page.tsx
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { pool } from "@/lib/db";

import AsmaulHusna from "./AsmaulHusnaComponent";

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  let initialIds: number[] = [];
  let isLoggedIn = false;

  if (session) {
    try {
      const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
      // 1. Verify the Token
      const { payload } = await jwtVerify(session, secret);

      // 2. If valid, fetch data from DB
      if (payload.id) {
        isLoggedIn = true;
        const res = await pool.query(
          "SELECT name_id FROM user_progress WHERE user_id = $1",
          [payload.id],
        );
        // 3. Map the result to an array of IDs
        initialIds = res.rows.map((row: { name_id: number }) => row.name_id);
      }
    } catch (e) {
      console.error("Session invalid:", e);
      isLoggedIn = false;
    }
  }

  // 4. Pass the data to your Client Component
  return <AsmaulHusna initialIds={initialIds} isLoggedIn={isLoggedIn} />;
}
