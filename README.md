# Friend Memory Book

Interactive photo + video album with a closed-book opening animation, realistic page flips, responsive mobile layout, and full-screen media viewing.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Add your photos

Put images in:

```text
public/media/photos/
```

Recommended formats: `.webp`, `.jpg`, `.png`.

For web performance, resize very large phone photos before adding them. Around 1600–2200 px on the long edge is usually enough for this UI.

## Add your videos

Put videos in:

```text
public/media/videos/
```

Use MP4/H.264 for the safest browser support. Keep GitHub repository size in mind; compress long videos before committing them.

Optional video poster images go in:

```text
public/media/posters/
```

## Edit the album

Open:

```text
src/data/memories.ts
```

Each object becomes one page. Supported page types:

- `title`
- `photo`
- `two-photo`
- `collage`
- `video`
- `photo-text`
- `final`

Example photo page:

```ts
{
  id: 'day-out',
  type: 'photo',
  media: {
    id: 'day-out-photo',
    kind: 'photo',
    src: '/media/photos/day-out.webp',
    alt: 'Friends standing together outside',
    caption: 'Best day of the trip.',
    date: '10 Oct 2026'
  }
}
```

Example video page:

```ts
{
  id: 'funny-video',
  type: 'video',
  media: {
    id: 'funny-video-file',
    kind: 'video',
    src: '/media/videos/funny-video.mp4',
    poster: '/media/posters/funny-video.webp',
    alt: 'Funny memory with friends',
    caption: 'Still funny every time.'
  }
}
```

## Build

```bash
npm run build
```

The production site will be generated in `dist/`.

## Deploy to GitHub Pages

1. Push the project to GitHub.
2. Make sure your default branch is `main`.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. Push to `main`.

The included `.github/workflows/deploy.yml` builds and deploys the site automatically.

## Important

The project uses `base: './'` in Vite so assets work under a GitHub Pages repository path without you hardcoding the repo name.

## Push to a new GitHub repository

After creating an empty repository on GitHub, run:

```bash
git init
git add .
git commit -m "Initial interactive memory book"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Then enable **Settings → Pages → GitHub Actions** if GitHub does not enable it automatically.
