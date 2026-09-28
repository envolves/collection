import { forwardRef, useEffect, useRef } from 'react';
import type { MediaItem, MemoryPage } from '../types';

type Props = {
  page: MemoryPage;
  pageIndex: number;
  currentPage: number;
  onMediaClick: (media: MediaItem) => void;
};

function Photo({ media, onClick, className = '' }: { media: MediaItem; onClick: () => void; className?: string }) {
  return (
    <button className={`photo-button ${className}`} type="button" onClick={onClick} aria-label={`Open ${media.alt}`}>
      <img src={media.src} alt={media.alt} loading="lazy" decoding="async" />
    </button>
  );
}

function Video({ media, active }: { media: MediaItem; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!active) ref.current?.pause();
  }, [active]);

  return (
    <div className="video-wrap">
      <video
        ref={ref}
        src={media.src}
        poster={media.poster}
        preload="metadata"
        controls
        playsInline
        aria-label={media.alt}
      />
    </div>
  );
}

export const MemoryPageView = forwardRef<HTMLDivElement, Props>(function MemoryPageView(
  { page, pageIndex, currentPage, onMediaClick },
  ref,
) {
  const active = Math.abs(currentPage - pageIndex) <= 1;

  return (
    <div ref={ref} className="paper-page" data-density={page.type === 'title' || page.type === 'final' ? 'hard' : 'soft'}>
      <div className="paper-texture" />
      <div className="page-inner">
        {page.type === 'title' && (
          <div className="title-page">
            <span className="page-eyebrow">MEMORY BOOK</span>
            <h1>{page.title}</h1>
            {page.subtitle && <p className="page-subtitle">{page.subtitle}</p>}
            <div className="title-rule" />
            {page.quote && <blockquote>{page.quote}</blockquote>}
          </div>
        )}

        {page.type === 'photo' && (
          <div className="single-photo-layout">
            <Photo media={page.media} onClick={() => onMediaClick(page.media)} />
            <div className="media-meta">
              <span>{page.media.caption}</span>
              <span>{page.media.date}</span>
            </div>
          </div>
        )}

        {page.type === 'two-photo' && (
          <div className="two-photo-layout">
            {page.media.map((media, index) => (
              <div className="photo-card" key={media.id}>
                <Photo media={media} onClick={() => onMediaClick(media)} />
                <p>{media.caption || `Memory ${index + 1}`}</p>
              </div>
            ))}
          </div>
        )}

        {page.type === 'collage' && (
          <div className="collage-layout">
            <Photo media={page.media[0]} onClick={() => onMediaClick(page.media[0])} className="collage-main" />
            <Photo media={page.media[1]} onClick={() => onMediaClick(page.media[1])} className="collage-small top" />
            <Photo media={page.media[2]} onClick={() => onMediaClick(page.media[2])} className="collage-small bottom" />
          </div>
        )}

        {page.type === 'video' && (
          <div className="video-page-layout">
            <span className="page-eyebrow">A MOVING MEMORY</span>
            <Video media={page.media} active={active} />
            <p>{page.media.caption}</p>
          </div>
        )}

        {page.type === 'photo-text' && (
          <div className="photo-text-layout">
            <Photo media={page.media} onClick={() => onMediaClick(page.media)} />
            <p className="handwritten-copy">{page.text}</p>
            {page.media.date && <span className="tiny-date">{page.media.date}</span>}
          </div>
        )}

        {page.type === 'final' && (
          <div className="final-page">
            <span className="page-eyebrow">TO BE CONTINUED</span>
            <h2>{page.title}</h2>
            {page.message && <p>{page.message}</p>}
            <span className="small-heart">♡</span>
          </div>
        )}
      </div>
      <span className="page-number">{pageIndex + 1}</span>
    </div>
  );
});
