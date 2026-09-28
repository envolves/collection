import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import type { MediaItem } from '../types';

type Props = { items: MediaItem[]; selected: MediaItem | null; onClose: () => void; };

export function MediaLightbox({ items, selected, onClose }: Props) {
  const initialIndex = useMemo(() => (selected ? Math.max(0, items.findIndex((item) => item.id === selected.id)) : 0), [items, selected]);
  const [index, setIndex] = useState(initialIndex);
  useEffect(() => setIndex(initialIndex), [initialIndex]);
  useEffect(() => {
    if (!selected) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') setIndex((value) => (value + 1) % items.length);
      if (event.key === 'ArrowLeft') setIndex((value) => (value - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [items.length, onClose, selected]);
  const item = items[index];
  return (
    <AnimatePresence>{selected && item && (
      <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <button className="lightbox-backdrop" type="button" onClick={onClose} aria-label="Close media viewer" />
        <button className="lightbox-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <button className="lightbox-arrow left" type="button" onClick={() => setIndex((index - 1 + items.length) % items.length)} aria-label="Previous media">‹</button>
        <motion.div key={item.id} className="lightbox-content" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} onDragEnd={(_, info) => { if (info.offset.x < -80) setIndex((index + 1) % items.length); if (info.offset.x > 80) setIndex((index - 1 + items.length) % items.length); }}>
          {item.kind === 'video' ? <video src={item.src} poster={item.poster} controls autoPlay playsInline /> : <img src={item.src} alt={item.alt} />}
          {(item.caption || item.date) && <div className="lightbox-caption"><span>{item.caption}</span><span>{item.date}</span></div>}
        </motion.div>
        <button className="lightbox-arrow right" type="button" onClick={() => setIndex((index + 1) % items.length)} aria-label="Next media">›</button>
        <div className="lightbox-counter">{index + 1} / {items.length}</div>
      </motion.div>
    )}</AnimatePresence>
  );
}
