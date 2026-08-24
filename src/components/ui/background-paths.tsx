"use client";

import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";

const PATH_COUNT = 24;

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
    width: 0.5 + i * 0.035,
    duration: 24 + (i % 6) * 1.25,
    delay: (i % 8) * 0.35,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-white"
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
            strokeOpacity={0.045 + (i % 7) * 0.012}
            initial={{ pathLength: 0.18, pathOffset: 0, opacity: 0.18 }}
            animate={{
              pathLength: [0.18, 1, 0.18],
              pathOffset: [0, 0.82, 1],
              opacity: [0.16, 0.42, 0.16],
            }}
            transition={{
              duration: path.duration,
              delay: path.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: "opacity" }}
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
    <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden bg-transparent">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.035),transparent_68%)]" />
      <div className="absolute inset-0 opacity-90">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6 text-center">
        {children ?? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-400">
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 70, opacity: 0 }}
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
              transition={{ delay: 0.45, duration: 0.7 }}
            >
              <Button
                variant="ghost"
                className="rounded-full px-7 py-3 text-sm font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] hover:border-white/[0.18] backdrop-blur-md transition-all active:scale-95"
              >
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
