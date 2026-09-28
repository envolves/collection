export type MediaKind = 'photo' | 'video';

export type MediaItem = {
  id: string;
  kind: MediaKind;
  src: string;
  alt: string;
  caption?: string;
  date?: string;
  poster?: string;
};

export type MemoryPage =
  | {
      id: string;
      type: 'title';
      title: string;
      subtitle?: string;
      quote?: string;
    }
  | {
      id: string;
      type: 'photo';
      media: MediaItem;
    }
  | {
      id: string;
      type: 'two-photo';
      media: [MediaItem, MediaItem];
    }
  | {
      id: string;
      type: 'collage';
      media: [MediaItem, MediaItem, MediaItem];
    }
  | {
      id: string;
      type: 'video';
      media: MediaItem;
    }
  | {
      id: string;
      type: 'photo-text';
      media: MediaItem;
      text: string;
    }
  | {
      id: string;
      type: 'final';
      title: string;
      message?: string;
    };
