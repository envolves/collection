import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { ClosedBook } from './components/ClosedBook';
import { MemoryBook } from './components/MemoryBook';

export default function App() {
  const [opened, setOpened] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.section
            key="closed"
            className="scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.02 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.45 }}
          >
            <ClosedBook onOpened={() => setOpened(true)} />
          </motion.section>
        ) : (
          <motion.section
            key="reader"
            className="scene reader-scene"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.45 }}
          >
            <MemoryBook onClose={() => setOpened(false)} />
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
