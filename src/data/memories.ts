import type { MemoryPage } from '../types';

const asset = (path: string) => `${import.meta.env.BASE_URL}media/${path}`;

export const memories: MemoryPage[] = [
  {
    id: 'main-photo',
    type: 'photo',
    media: {
      id: 'main-photo',
      kind: 'photo',
      src: asset('photos/friend-photo.jpeg'),
      alt: 'Main memory photo',
      caption: 'A memory worth keeping.',
      date: '2026',
    },
  },
  {
    id: 'video-one',
    type: 'video',
    media: {
      id: 'video-one',
      kind: 'video',
      src: asset('videos/video-1.mp4'),
      alt: 'Memory video one',
      caption: 'A memory in motion.',
    },
  },
  {
    id: 'video-two',
    type: 'video',
    media: {
      id: 'video-two',
      kind: 'video',
      src: asset('videos/video-2.mp4'),
      alt: 'Memory video two',
      caption: 'Another memory in motion.',
    },
  },
];
