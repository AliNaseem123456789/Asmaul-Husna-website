"use client";
import { useActionState } from "react";
import { register } from "../actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [state, action] = useActionState(register, undefined);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#12100e] text-white">
      <form
        action={action}
        className="p-8 bg-stone-900 border border-stone-800 rounded-xl w-96"
      >
        <h1 className="text-2xl mb-4 text-[#d4af37]">Create Account</h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 bg-black border border-stone-700 rounded focus:border-[#d4af37] outline-none"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-black border border-stone-700 rounded focus:border-[#d4af37] outline-none"
          required
        />

        <button className="w-full bg-[#d4af37] text-black font-bold py-2 rounded hover:bg-[#c5a030] transition">
          Register
        </button>

        {state?.error && (
          <p className="text-red-500 mt-4 text-sm text-center">{state.error}</p>
        )}

        <p className="mt-4 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#d4af37] hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
