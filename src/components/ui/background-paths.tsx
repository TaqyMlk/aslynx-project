"use client";

import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";

const PATH_COUNT = 36;

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: PATH_COUNT }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 7 * position} -${189 + i * 8}C-${
      380 - i * 7 * position
    } -${189 + i * 8} -${312 - i * 7 * position} ${216 - i * 8} ${
      152 - i * 7 * position
    } ${343 - i * 8}C${616 - i * 7 * position} ${470 - i * 8} ${
      684 - i * 7 * position
    } ${875 - i * 8} ${684 - i * 7 * position} ${875 - i * 8}`,
    duration: 20 + (i % 8) * 1.5,
    delay: (i % 10) * 0.35,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-neutral-700 dark:text-neutral-300" viewBox="0 0 696 316" fill="none" aria-hidden="true">
        {paths.map((path, i) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={0.5 + i * 0.03}
            strokeOpacity={0.08 + (i % 6) * 0.012}
            initial={{ pathLength: 0.18, pathOffset: 0, opacity: 0.2 }}
            animate={{
              pathLength: [0.18, 1, 0.18],
              pathOffset: [0, 0.82, 1],
              opacity: [0.18, 0.5, 0.18],
            }}
            transition={{
              duration: path.duration,
              delay: path.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths({
  title = "AsLynx Portfolio",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  const words = title.split(" ");

  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0 opacity-90">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6 text-center">
        {children ?? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-500 dark:from-white dark:via-white dark:to-neutral-500">
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 70, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: wordIndex * 0.08 + letterIndex * 0.025, type: "spring", stiffness: 120, damping: 20 }}
                      className="inline-block"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}>
              <Button variant="ghost" className="rounded-full px-7 py-3 text-sm font-semibold bg-neutral-100/80 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:text-white dark:border-white/[0.1] dark:hover:border-white/[0.18] backdrop-blur-md transition-all active:scale-95">
                Discover Excellence
                <span className="ml-2">→</span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
