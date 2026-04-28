import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import clsx from 'clsx';

export const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Switch modes
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
      setIsActive(false);
      // Could play a sound here!
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const setWorkMode = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(25 * 60);
  };

  const setBreakMode = () => {
    setIsActive(false);
    setMode('break');
    setTimeLeft(5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 : ((5 * 60 - timeLeft) / (5 * 60)) * 100;
  const progressColor = mode === 'work' ? '#dc262d' : '#16a34a'; // red-600, green-600

  return (
    <div className="glass-card relative w-[160px] h-[160px] mx-auto">
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full bg-[rgba(255,255,255,0.1)] dark:bg-[rgba(0,0,0,0.1)]"></div>
      {/* Progress circle */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from -90deg at 50% 50%, ${progressColor} 0%, ${progressColor} ${progress}%, transparent ${progress}%, transparent 100%)`,
          transition: 'background 1000ms ease'
        }}
      ></div>
      
      <div className="relative flex flex-col items-center justify-center h-full w-full">
        <div className="mb-2 flex items-center space-x-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <Timer className="w-4 h-4" />
          <span>Pomodoro</span>
        </div>

        <div className="text-2xl font-extrabold tracking-tight text-center font-mono">
          {formatTime(timeLeft)}
        </div>

        <div className="mt-4 flex justify-between items-center w-full">
          <button onClick={setWorkMode} className={clsx("px-2 py-1 rounded text-xs font-semibold transition-colors", mode === 'work' ? "bg-red-500/20 text-red-600 dark:text-red-400" : "hover:bg-white/10 dark:hover:bg-black/10")}>
            Focus
          </button>
          <button onClick={setBreakMode} className={clsx("px-2 py-1 rounded text-xs font-semibold transition-colors", mode === 'break' ? "bg-green-500/20 text-green-600 dark:text-green-400" : "hover:bg-white/10 dark:hover:bg-black/10")}>
            Break
          </button>
        </div>

        <div className="mt-4 flex justify-center space-x-3">
          <button onClick={toggle} className="p-2 rounded-full bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-200">
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          </button>
          <button onClick={reset} className="p-2 rounded-full bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-200 text-gray-400 hover:text-gray-200">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
