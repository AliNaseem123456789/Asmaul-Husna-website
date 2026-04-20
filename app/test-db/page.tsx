// src/app/test_db/page.tsx
import { pool } from "@/lib/db";

export default async function TestDbPage() {
  let connectionTime = null;
  let error = null;

  try {
    const res = await pool.query("SELECT NOW()");
    connectionTime = res.rows[0].now.toString();
  } catch (err: any) {
    error = err.message;
  }

  return (
    <div className="p-8 text-white min-h-screen bg-[#12100e]">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      {error ? (
        <div className="p-4 bg-red-900/20 border border-red-500 rounded text-red-400">
          <p>❌ Connection Failed!</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      ) : (
        <div className="p-4 bg-green-900/20 border border-green-500 rounded text-green-400">
          <p>✅ Connection Successful!</p>
          <p className="text-sm mt-2">Database Time: {connectionTime}</p>
        </div>
      )}
    </div>
  );
}