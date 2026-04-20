"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  Eye,
  Lock,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn,
} from "lucide-react";
import { namesData } from "./data";
import MemorizedModal from "./MemorizedModal";
import { updateProgress } from "./actions/progress";
import { logout } from "./actions/auth"; // Ensure this matches your actions file location

interface AsmaulHusnaProps {
  initialIds: number[];
  isLoggedIn: boolean;
}

export default function AsmaulHusna({
  initialIds,
  isLoggedIn,
}: AsmaulHusnaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Use the "|| []" fallback to ensure it never becomes undefined
  const [memorizedIds, setMemorizedIds] = useState<number[]>(initialIds || []);
  const [flippedId, setFlippedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const batchSize = 5;
  const currentBatch = namesData.slice(currentIndex, currentIndex + batchSize);
  const isBatchMemorized = currentBatch.every((name) =>
    memorizedIds.includes(name.id),
  );
  const memorizedList = namesData.filter((name) =>
    memorizedIds.includes(name.id),
  );

  const toggleMemorized = async (id: number) => {
    const isCurrentlyMemorized = memorizedIds.includes(id);

    // 1. Optimistic UI update
    setMemorizedIds((prev) =>
      isCurrentlyMemorized ? prev.filter((i) => i !== id) : [...prev, id],
    );

    // 2. Sync with DB
    await updateProgress(id, !isCurrentlyMemorized);
  };

  return (
    <div className="min-h-screen bg-[#12100e] text-[#d4af37] p-4 md:p-8 relative">
      {/* Top Navbar Area */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-end">
        {isLoggedIn ? (
          <button
            onClick={async () => await logout()}
            className="flex items-center gap-2 text-stone-500 hover:text-white transition text-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 text-[#d4af37] hover:text-white transition text-sm"
          >
            <LogIn size={16} /> Login / Register
          </Link>
        )}
      </div>

      <div className="max-w-6xl mx-auto z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl mb-2 font-serif text-[#e6cc80]">
            أسماء الله الحسنى
          </h1>
          <p className="tracking-widest uppercase text-xs opacity-60">
            99 Names of Allah
          </p>
        </header>

        {/* Stats & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3 bg-stone-900/40 px-4 py-2 rounded-lg border border-stone-800">
            <BookOpen size={18} />
            <span>{memorizedIds.length} / 99 Memorized</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/quiz"
              className="px-6 py-2 border border-[#d4af37] rounded-full hover:bg-[#d4af37]/10 transition flex items-center gap-2"
            >
              <Brain size={18} /> Quiz
            </Link>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {currentBatch.map((name) => (
            <div
              key={name.id}
              className="perspective-1000 h-96 cursor-pointer"
              onClick={() =>
                setFlippedId(flippedId === name.id ? null : name.id)
              }
            >
              <motion.div
                className="relative w-full h-full preserve-3d"
                animate={{ rotateY: flippedId === name.id ? 180 : 0 }}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-stone-900/30 border border-stone-800 rounded-2xl flex flex-col items-center justify-center p-6">
                  <span className="absolute top-4 left-4 text-[10px] opacity-30 font-mono">
                    #{name.id}
                  </span>
                  <div className="text-4xl mb-4 text-white font-serif">
                    {name.arabic}
                  </div>
                  <div className="text-lg">{name.transliteration}</div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 backface-hidden bg-stone-900/90 border border-[#d4af37]/60 rounded-2xl flex flex-col items-center justify-center p-6 rotate-y-180 text-center">
                  <h3 className="text-[#e6cc80] font-bold mb-2">
                    {name.meaning}
                  </h3>
                  <p className="text-[10px] opacity-70 mb-6">
                    {name.description}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMemorized(name.id);
                    }}
                    className={`px-4 py-2 rounded-full border text-[10px] uppercase transition ${
                      memorizedIds.includes(name.id)
                        ? "bg-[#d4af37] text-black"
                        : "border-[#d4af37]"
                    }`}
                  >
                    {memorizedIds.includes(name.id)
                      ? "Memorized ✓"
                      : "Mark as Memorized"}
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 5))}
            disabled={currentIndex === 0}
            className="disabled:opacity-10"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() =>
              isBatchMemorized && setCurrentIndex(currentIndex + 5)
            }
            className={`px-8 py-3 rounded-xl border flex items-center gap-2 transition ${
              isBatchMemorized
                ? "border-[#d4af37]"
                : "border-stone-800 text-stone-600"
            }`}
          >
            {isBatchMemorized ? (
              <>
                <ChevronRight /> Next Batch
              </>
            ) : (
              <>
                <Lock size={16} /> Memorize all 5 to continue
              </>
            )}
          </button>
        </div>
      </div>

      <MemorizedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memorizedList={memorizedList}
        onRemove={toggleMemorized}
        totalCount={namesData.length}
      />

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2e2a27;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
