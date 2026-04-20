"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AllahName } from "./data";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  memorizedList: AllahName[];
  onRemove: (id: number) => void;
  totalCount: number;
}

export default function MemorizedModal({
  isOpen,
  onClose,
  memorizedList,
  onRemove,
  totalCount,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#1a1714] border border-stone-800 w-full max-w-lg rounded-3xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-6 pb-2 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                Memorized Names ({memorizedList.length} / {totalCount})
              </h2>
              <button
                onClick={onClose}
                className="text-stone-500 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar space-y-3">
              {memorizedList.length > 0 ? (
                memorizedList.map((name) => (
                  <div
                    key={name.id}
                    className="flex items-center justify-between bg-stone-900/50 border border-stone-800/50 p-4 rounded-2xl group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-serif text-white w-16">
                        {name.arabic}
                      </span>
                      <div>
                        <div className="font-bold text-stone-200">
                          {name.transliteration}
                        </div>
                        <div className="text-xs text-stone-500">
                          {name.meaning}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(name.id)}
                      className="p-2 rounded-full bg-stone-800/50 text-amber-600/50 hover:bg-amber-900/20 hover:text-amber-500 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-stone-600">
                  No names memorized yet.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
