"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "../actions/auth";
import Link from "next/link";

// 1. Create a helper for the button to handle the "loading" state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full bg-[#d4af37] text-black font-bold py-2 rounded transition ${
        pending ? "opacity-50 cursor-not-allowed" : "hover:bg-[#c5a030]"
      }`}
    >
      {pending ? "Registering..." : "Register"}
    </button>
  );
}

export default function RegisterPage() {
  const [state, action] = useActionState(register, undefined);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#12100e] text-white">
      <form
        action={action}
        className="p-8 bg-stone-900 border border-stone-800 rounded-xl w-96 shadow-xl"
      >
        <h1 className="text-2xl mb-6 text-[#d4af37] font-serif">
          Create Account
        </h1>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-xs text-stone-400 mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="w-full p-2 bg-black border border-stone-700 rounded focus:border-[#d4af37] outline-none"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-xs text-stone-400 mb-1">Password</label>
          <input
            name="password"
            type="password"
            className="w-full p-2 bg-black border border-stone-700 rounded focus:border-[#d4af37] outline-none"
            required
          />
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6">
          <label className="block text-xs text-stone-400 mb-1">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            className="w-full p-2 bg-black border border-stone-700 rounded focus:border-[#d4af37] outline-none"
            required
          />
        </div>

        <SubmitButton />

        {/* Error Message */}
        {state?.error && (
          <p className="text-red-500 mt-4 text-sm text-center bg-red-950/30 p-2 rounded">
            {state.error}
          </p>
        )}

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#d4af37] hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
