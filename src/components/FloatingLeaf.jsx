import { useMemo } from "react";

const LEAVES = ["🍃", "🌿", "🍀", "🌱"];

export function FloatingLeaf({ style, index = 0 }) {
  const leaf = useMemo(() => LEAVES[index % LEAVES.length], [index]);
  return (
    <div className="pointer-events-none select-none absolute animate-bounce" style={style} aria-hidden="true">
      {leaf}
    </div>
  );
}
