type Sparkle = {
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
};

// Fixed, hand-picked values so positions/timing look random but stay
// deterministic between server and client render (no hydration mismatch).
const SPARKLES: Sparkle[] = [
  { left: 4, delay: 0, duration: 6, size: 4, drift: -18 },
  { left: 12, delay: 2.4, duration: 5, size: 3, drift: 12 },
  { left: 20, delay: 4.8, duration: 7, size: 5, drift: -24 },
  { left: 28, delay: 1.2, duration: 5.5, size: 3, drift: 20 },
  { left: 36, delay: 3.6, duration: 6.5, size: 4, drift: -14 },
  { left: 44, delay: 0.6, duration: 5, size: 3, drift: 16 },
  { left: 52, delay: 5.4, duration: 7.5, size: 5, drift: -22 },
  { left: 60, delay: 2, duration: 6, size: 4, drift: 10 },
  { left: 68, delay: 4.2, duration: 5.5, size: 3, drift: -16 },
  { left: 76, delay: 0.9, duration: 6.5, size: 5, drift: 24 },
  { left: 84, delay: 3, duration: 5, size: 3, drift: -20 },
  { left: 92, delay: 5.7, duration: 7, size: 4, drift: 14 },
  { left: 8, delay: 1.8, duration: 6, size: 3, drift: -12 },
  { left: 48, delay: 4.5, duration: 5.5, size: 4, drift: 18 },
  { left: 72, delay: 0.3, duration: 6.5, size: 3, drift: -10 },
  { left: 96, delay: 2.7, duration: 7, size: 5, drift: 22 },
];

export default function GoldSparkles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            ["--drift" as string]: `${s.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
