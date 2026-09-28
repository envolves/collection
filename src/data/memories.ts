import type { MemoryPage } from '../types';

const asset = (path: string) => `${import.meta.env.BASE_URL}media/${path}`;

export const memories: MemoryPage[] = [
  {
    id: 'intro',
    type: 'title',
    title: 'Our Memories',
    subtitle: 'A collection of moments',
    quote: 'The random days usually become the best memories.',
  },
  {
    id: 'photo-one',
    type: 'photo',
    media: {
      id: 'p1',
      kind: 'photo',
      src: asset('photos/friend-photo.jpeg'),
      alt: 'Friend memory photo',
      caption: 'One of those days worth keeping.',
      date: '2026',
    },
  },
  {
    id: 'two-photos',
    type: 'two-photo',
    media: [
      {
        id: 'p2',
        kind: 'photo',
        src: asset('photos/sample-2.svg'),
        alt: 'Replace with a portrait or candid photo',
        caption: 'Random picture. Permanent memory.',
      },
      {
        id: 'p3',
        kind: 'photo',
        src: asset('photos/sample-3.svg'),
        alt: 'Replace with another friend photo',
        caption: 'No context needed.',
      },
    ],
  },
  {
    id: 'video-one',
    type: 'video',
    media: {
      id: 'v1',
      kind: 'video',
      src: asset('videos/friend-video.MOV'),
      poster: asset('posters/sample-video.svg'),
      alt: 'Friend memory video',
      caption: 'A memory in motion.',
    },
  },
  {
    id: 'collage',
    type: 'collage',
    media: [
      { id: 'p4', kind: 'photo', src: asset('photos/sample-4.svg'), alt: 'Replace with your photo' },
      { id: 'p5', kind: 'photo', src: asset('photos/sample-5.svg'), alt: 'Replace with your photo' },
      { id: 'p6', kind: 'photo', src: asset('photos/sample-6.svg'), alt: 'Replace with your photo' },
    ],
  },
  {
    id: 'photo-text',
    type: 'photo-text',
    text: 'That day was actually crazy 😂',
    media: {
      id: 'p7',
      kind: 'photo',
      src: asset('photos/sample-7.svg'),
      alt: 'Replace with a funny or memorable photo',
      date: '2026',
    },
  },
  {
    id: 'final',
    type: 'final',
    title: 'More memories to come…',
    message: 'This book is only getting started.',
  },
];
