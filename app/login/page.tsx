"use client";
import { useActionState } from "react";
import { login } from "../actions/auth";

export default function LoginPage() {
  const [state, action] = useActionState(login, undefined);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#12100e] text-white">
      <form
        action={action}
        className="p-8 bg-stone-900 border border-stone-800 rounded-xl w-96"
      >
        <h1 className="text-2xl mb-4">Login</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 bg-black border border-stone-700 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-black border border-stone-700 rounded"
          required
        />
        <button className="w-full bg-[#d4af37] text-black font-bold py-2 rounded">
          Sign In
        </button>
        {state?.error && (
          <p className="text-red-500 mt-2 text-sm">{state.error}</p>
        )}
      </form>
    </div>
  );
}
