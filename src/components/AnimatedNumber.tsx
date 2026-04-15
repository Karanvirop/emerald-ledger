import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export function AnimatedNumber({ value, prefix = '$', duration = 0.8 }: { value: number; prefix?: string; duration?: number }) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState('0.00');

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v.toFixed(2)),
    });
    return controls.stop;
  }, [value, duration, motionValue]);

  return (
    <span className="font-mono tabular-nums">
      {prefix}{display}
    </span>
  );
}
