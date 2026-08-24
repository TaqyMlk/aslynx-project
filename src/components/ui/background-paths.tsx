"use client";

import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  const durations = Array.from({ length: 36 }, () => 20 + Math.random() * 10);
  const delays = Array.from({ length: 36 }, () => Math.random() * 5);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
        aria-hidden="true"
      >
        {paths.map((path, i) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.08 + i * 0.02}
            initial={{ pathLength: 0.2, opacity: 0.3 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.5, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: durations[i],
              delay: delays[i],
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
    <div className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6 text-center">
        {children ?? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-white dark:to-white/70">
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.08 + letterIndex * 0.025,
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                      }}
                      className="inline-block"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Button
                variant="ghost"
                className="rounded-full px-7 py-3 text-sm font-semibold bg-white/80 dark:bg-neutral-900/80 hover:bg-white dark:hover:bg-neutral-800 text-black dark:text-white border border-black/10 dark:border-white/10 backdrop-blur-sm transition-all active:scale-95"
              >
                Discover Excellence
                <span className="ml-2">→</span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}