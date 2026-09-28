import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

type Props = {
  onOpened: () => void;
};

export function ClosedBook({ onOpened }: Props) {
  const [opening, setOpening] = useState(false);
  const reduceMotion = useReducedMotion();

  const openBook = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpened, reduceMotion ? 120 : 1150);
  };

  return (
    <div className={`closed-stage ${opening ? 'is-opening' : ''}`}>
      <motion.button
        className="closed-book"
        type="button"
        onClick={openBook}
        aria-label="Open the memory book"
        disabled={opening}
        initial={{ opacity: 0, y: 24, rotateX: 8, rotateZ: -3 }}
        animate={opening ? { scale: reduceMotion ? 1 : 1.13, rotateX: 0, rotateZ: 0, y: 0 } : { opacity: 1, y: [0, -8, 0], rotateX: 7, rotateZ: -3 }}
        transition={opening ? { duration: reduceMotion ? 0.1 : 0.72, ease: [0.2, 0.75, 0.2, 1] } : { opacity: { duration: 0.55 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <span className="book-pages" aria-hidden="true" />
        <span className="book-back" aria-hidden="true" />
        <motion.span className="book-cover" animate={opening && !reduceMotion ? { rotateY: -168, x: -16 } : { rotateY: 0, x: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.78, 0.18, 1] }}>
          <span className="book-spine" />
          <span className="cover-inner-line" />
          <span className="cover-copy"><span className="cover-kicker">A PHOTO & VIDEO BOOK</span><strong>Our Memories</strong><span className="cover-subtitle">A collection of moments</span></span>
          <span className="cover-year">2026</span>
        </motion.span>
      </motion.button>
      <motion.div className="open-hint" animate={{ opacity: opening ? 0 : [0.55, 1, 0.55] }} transition={{ duration: 2.4, repeat: opening ? 0 : Infinity }}>Tap the book to open</motion.div>
    </div>
  );
}
