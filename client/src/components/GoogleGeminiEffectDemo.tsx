import React from "react";
import { useScroll, useTransform } from "motion/react";
import { GoogleGeminiEffect } from "./ui/google-gemini-effect";
import { Sparkles } from "lucide-react";

interface GoogleGeminiEffectDemoProps {
  onExploreClick?: () => void;
}

export function GoogleGeminiEffectDemo({ onExploreClick }: GoogleGeminiEffectDemoProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div
      ref={ref}
      className="h-[280vh] w-full rounded-3xl bg-slate-950 dark:bg-black border border-slate-800/80 relative pt-24 sm:pt-40 overflow-clip shadow-2xl"
    >
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-400/20 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Interactive Networking Education</span>
        </div>
      </div>

      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
        title="Trace the Global Domain Name System"
        description="Every keystroke and web request cascades through root, TLD, and authoritative nameservers in milliseconds. Scroll to trace packet traversal across the global web."
        buttonText="Start Live DNS Query"
        onButtonClick={onExploreClick}
      />
    </div>
  );
}
