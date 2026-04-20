// app/quiz/QuizClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { namesData } from "./data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function QuizClient({
  memorizedList,
}: {
  memorizedList: any[];
}) {
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const correct =
      memorizedList[Math.floor(Math.random() * memorizedList.length)];
    const distractors = namesData
      .filter((n: any) => n.id !== correct.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOptions = [correct, ...distractors].sort(
      () => 0.5 - Math.random(),
    );
    setCurrentQuestion(correct);
    setOptions(allOptions);
    setSelected(null);
  };

  const handleAnswer = (id: number) => {
    setSelected(id);
    if (currentQuestion && id === currentQuestion.id) setScore(score + 1);
    setTimeout(generateQuestion, 800);
  };

  return (
    <div className="min-h-screen bg-[#12100e] text-white p-8 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="flex items-center gap-2 text-stone-500 mb-8 hover:text-white"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-stone-900/50 border border-stone-800 p-8 rounded-2xl text-center">
          <h2 className="text-4xl font-serif text-[#d4af37] mb-8">
            {currentQuestion?.arabic}
          </h2>
          <div className="grid gap-3">
            {options.map((opt: any) => (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt.id)}
                disabled={selected !== null}
                className={`p-4 rounded-xl border transition ${
                  selected === opt.id
                    ? opt.id === currentQuestion?.id
                      ? "bg-green-900 border-green-500"
                      : "bg-red-900 border-red-500"
                    : "border-stone-800 hover:border-[#d4af37]"
                }`}
              >
                {opt.meaning}
              </button>
            ))}
          </div>
          <div className="mt-8 text-sm opacity-50">Score: {score}</div>
        </div>
      </div>
    </div>
  );
}
