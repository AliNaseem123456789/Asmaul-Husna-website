// app/quiz/page.tsx
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { pool } from "@/lib/db";
import { namesData } from "../data";
import { redirect } from "next/navigation";
import QuizClient from "../Quizclient";

// Define types
interface NameData {
  id: number;
  [key: string]: any; // Adjust based on your actual namesData structure
}

interface UserPayload {
  id: number;
  [key: string]: any;
}

interface ProgressRow {
  name_id: number;
}

export default async function QuizPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) redirect("/login");

  const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
  if (!secret) throw new Error("SESSION_SECRET is not defined");

  const { payload } = (await jwtVerify(session, secret)) as {
    payload: UserPayload;
  };

  // Fetch only the memorized names for this user
  const res = await pool.query(
    "SELECT name_id FROM user_progress WHERE user_id = $1",
    [payload.id],
  );

  const memorizedIds = res.rows.map((row: ProgressRow) => row.name_id);

  // Filter the full data to only include what the user has memorized
  const memorizedList = namesData.filter((n: NameData) =>
    memorizedIds.includes(n.id),
  );

  if (memorizedList.length < 5) {
    // Redirect back home if they don't have enough to quiz
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <p>Please memorize at least 5 names to start the quiz.</p>
        <a href="/" className="mt-4 text-[#d4af37] underline">
          Back to Home
        </a>
      </div>
    );
  }

  return <QuizClient memorizedList={memorizedList} />;
}
