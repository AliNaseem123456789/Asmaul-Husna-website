"use server";

import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "change-this-to-a-long-random-string",
);

export async function register(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const hash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
      [email, hash],
    );
    return { success: true };
  } catch (e) {
    return { error: "Email already exists" };
  }
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = res.rows[0];

  if (user && (await bcrypt.compare(password, user.password_hash))) {
    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: true,
      maxAge: 604800,
    });
    redirect("/");
  }
  return { error: "Invalid credentials" };
}
export async function logout() {
  (await cookies()).delete("session");
  redirect("/login");
}
