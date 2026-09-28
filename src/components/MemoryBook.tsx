import HTMLFlipBook from 'react-pageflip';
import { useEffect, useMemo, useRef, useState } from 'react';
import { memories } from '../data/memories';
import type { MediaItem } from '../types';
import { MediaLightbox } from './MediaLightbox';
import { MemoryPageView } from './MemoryPageView';

const FlipBook = HTMLFlipBook as unknown as React.ComponentType<Record<string, unknown>>;

type Props = {
  onClose: () => void;
};

function getGalleryItems(): MediaItem[] {
  const result: MediaItem[] = [];
  memories.forEach((page) => {
    if (page.type === 'photo' || page.type === 'video' || page.type === 'photo-text') result.push(page.media);
    if (page.type === 'two-photo' || page.type === 'collage') result.push(...page.media);
  });
  return result;
}

export function MemoryBook({ onClose }: Props) {
  const bookRef = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [muted, setMuted] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const galleryItems = useMemo(getGalleryItems, []);

  const playPageSound = () => {
    if (muted) return;
    const audio = new Audio(`${import.meta.env.BASE_URL}media/page-turn.mp3`);
    audio.volume = 0.18;
    void audio.play().catch(() => undefined);
  };

  const prev = () => bookRef.current?.pageFlip?.().flipPrev();
  const next = () => bookRef.current?.pageFlip?.().flipNext();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (selected) return;
      if (event.key === 'ArrowLeft') prev();
      if (event.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  };

  return (
    <div className="reader-wrap">
      <header className="reader-topbar">
        <button type="button" className="ghost-button" onClick={onClose}>← Cover</button>
        <div className="reader-title">Our Memories</div>
        <div className="reader-actions">
          <button type="button" className="icon-button" onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Enable page sound' : 'Mute page sound'}>
            {muted ? '🔇' : '🔊'}
          </button>
          <button type="button" className="icon-button" onClick={toggleFullscreen} aria-label="Toggle fullscreen">⛶</button>
        </div>
      </header>

      <div className="book-area">
        <button className="nav-arrow desktop-only" type="button" onClick={prev} aria-label="Previous page">‹</button>

        <div className="flipbook-frame">
          <FlipBook
            ref={bookRef}
            width={430}
            height={610}
            size="stretch"
            minWidth={275}
            maxWidth={430}
            minHeight={390}
            maxHeight={610}
            maxShadowOpacity={0.38}
            showCover={false}
            mobileScrollSupport={false}
            usePortrait={true}
            drawShadow={true}
            flippingTime={850}
            useMouseEvents={true}
            swipeDistance={28}
            clickEventForward={true}
            startPage={0}
            autoSize={true}
            className="memory-flipbook"
            style={{}}
            startZIndex={0}
            onFlip={(event: { data: number }) => {
              setPage(event.data);
              playPageSound();
            }}
          >
            {memories.map((memory, index) => (
              <MemoryPageView
                key={memory.id}
                page={memory}
                pageIndex={index}
                currentPage={page}
                onMediaClick={setSelected}
              />
            ))}
          </FlipBook>
        </div>

        <button className="nav-arrow desktop-only" type="button" onClick={next} aria-label="Next page">›</button>
      </div>

      <footer className="reader-footer">
        <button className="mobile-nav" type="button" onClick={prev}>Previous</button>
        <div className="progress-wrap" aria-label={`Page ${page + 1} of ${memories.length}`}>
          <div className="progress-track">
            <span style={{ width: `${((page + 1) / memories.length) * 100}%` }} />
          </div>
          <span>{page + 1} / {memories.length}</span>
        </div>
        <button className="mobile-nav" type="button" onClick={next}>Next</button>
      </footer>

      <MediaLightbox items={galleryItems} selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
