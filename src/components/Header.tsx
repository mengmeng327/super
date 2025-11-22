import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  points: number;
}

const Header: React.FC<HeaderProps> = ({ points }) => {
  const [displayPoints, setDisplayPoints] = useState(points);

  useEffect(() => {
    setDisplayPoints(points);
  }, [points]);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg rounded-b-2xl">
      <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
            <Trophy className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider">当前积分</p>
            <div className="flex items-baseline gap-1 relative">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={displayPoints}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="text-3xl font-bold"
                >
                  {displayPoints}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm font-medium opacity-80">pts</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;