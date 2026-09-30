(() => {
  const mediaRoot = './public/media/';

  const pages = [
    {
      type: 'photo',
      media: {
        src: mediaRoot + 'photos/friend-photo.jpeg',
        alt: 'Main memory photo',
        caption: 'A memory worth keeping.',
        date: '2026'
      }
    },
    {
      type: 'video',
      media: {
        src: mediaRoot + 'videos/video-1.mp4',
        caption: 'A memory in motion.'
      }
    },
    {
      type: 'video',
      media: {
        src: mediaRoot + 'videos/video-2.mp4',
        caption: 'Another memory in motion.'
      }
    }
  ];

  const gallery = [pages[0].media];

  const $ = (selector) => document.querySelector(selector);
  const landing = $('#landing');
  const reader = $('#reader');
  const openBook = $('#openBook');
  const backToCover = $('#backToCover');
  const leftPage = $('#leftPage');
  const rightPage = $('#rightPage');
  const flipLayer = $('#flipLayer');
  const prevPage = $('#prevPage');
  const nextPage = $('#nextPage');
  const prevMobile = $('#prevMobile');
  const nextMobile = $('#nextMobile');
  const pageLabel = $('#pageLabel');
  const progressBar = $('#progressBar');
  const soundToggle = $('#soundToggle');
  const fullscreenToggle = $('#fullscreenToggle');
  const book = $('#book');

  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCaption = $('#lightboxCaption');
  const lightboxClose = $('#lightboxClose');
  const lightboxBackdrop = $('#lightboxBackdrop');
  const lightboxPrev = $('#lightboxPrev');
  const lightboxNext = $('#lightboxNext');

  let cursor = 0;
  let turning = false;
  let soundOn = true;
  let touchStartX = null;
  let lightboxIndex = 0;

  function mobile() {
    return window.matchMedia('(max-width: 760px)').matches;
  }

  function safe(text) {
    return String(text ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  function photoButton(media) {
    return `
      <button type="button" data-photo-index="0" aria-label="Open main photo">
        <img src="${safe(media.src)}" alt="${safe(media.alt)}" loading="eager" decoding="async" />
      </button>
    `;
  }

  function videoMarkup(media) {
    return `
      <div class="video-frame">
        <video class="memory-video" controls playsinline preload="auto">
          <source src="${safe(media.src)}" type="video/mp4" />
          Your browser cannot play this video.
        </video>
      </div>
    `;
  }

  function pageHTML(page, pageNumber) {
    if (!page) return '';

    let body = '';

    if (page.type === 'photo') {
      body = `
        <div class="full-photo">
          <div class="photo-frame">${photoButton(page.media)}</div>
          <div class="meta">
            <span>${safe(page.media.caption)}</span>
            <span>${safe(page.media.date)}</span>
          </div>
        </div>
      `;
    }

    if (page.type === 'video') {
      body = `
        <div class="video-page">
          <span class="eyebrow">VIDEO MEMORY</span>
          ${videoMarkup(page.media)}
          <p>${safe(page.media.caption)}</p>
        </div>
      `;
    }

    return `
      <div class="page">
        ${body}
        <span class="page-num">${pageNumber}</span>
      </div>
    `;
  }

  function hydrateVideos() {
    document.querySelectorAll('video.memory-video').forEach((video) => {
      try {
        video.load();
      } catch (_) {}
    });
  }

  function normalizeCursor() {
    if (mobile()) {
      cursor = Math.max(0, Math.min(cursor, pages.length - 1));
    } else {
      cursor = Math.max(0, Math.min(cursor, pages.length - 1));
      if (cursor === 1) cursor = 0;
    }
  }

  function render() {
    normalizeCursor();

    if (mobile()) {
      book.classList.add('single-page');
      leftPage.hidden = true;
      rightPage.hidden = false;
      rightPage.innerHTML = pageHTML(pages[cursor], cursor + 1);

      pageLabel.textContent = `${cursor + 1} / ${pages.length}`;
      progressBar.style.width = `${((cursor + 1) / pages.length) * 100}%`;

      const atStart = cursor === 0;
      const atEnd = cursor === pages.length - 1;
      prevPage.disabled = prevMobile.disabled = atStart;
      nextPage.disabled = nextMobile.disabled = atEnd;
    } else if (cursor === pages.length - 1) {
      book.classList.add('single-page');
      leftPage.hidden = true;
      rightPage.hidden = false;
      rightPage.innerHTML = pageHTML(pages[cursor], cursor + 1);

      pageLabel.textContent = `${cursor + 1} / ${pages.length}`;
      progressBar.style.width = '100%';

      prevPage.disabled = prevMobile.disabled = false;
      nextPage.disabled = nextMobile.disabled = true;
    } else {
      book.classList.remove('single-page');
      leftPage.hidden = false;
      rightPage.hidden = false;
      leftPage.innerHTML = pageHTML(pages[0], 1);
      rightPage.innerHTML = pageHTML(pages[1], 2);

      pageLabel.textContent = `1–2 / ${pages.length}`;
      progressBar.style.width = `${(2 / pages.length) * 100}%`;

      prevPage.disabled = prevMobile.disabled = true;
      nextPage.disabled = nextMobile.disabled = false;
    }

    hydrateVideos();
  }

  function pageTurnSound() {
    if (!soundOn) return;
    const audio = new Audio(mediaRoot + 'page-turn.mp3');
    audio.volume = 0.18;
    audio.play().catch(() => {});
  }

  function turn(direction) {
    if (turning) return;

    const target = mobile()
      ? cursor + (direction === 'next' ? 1 : -1)
      : direction === 'next'
        ? 2
        : 0;

    if (target < 0 || target >= pages.length || target === cursor) return;

    turning = true;
    document.querySelectorAll('video').forEach((video) => video.pause());
    pageTurnSound();

    const sourcePage = mobile()
      ? pages[cursor]
      : direction === 'next'
        ? pages[1]
        : pages[2];

    const sourceNumber = mobile()
      ? cursor + 1
      : direction === 'next'
        ? 2
        : 3;

    flipLayer.className = `flip-layer active ${direction}`;
    flipLayer.innerHTML = `<div class="flip-face">${pageHTML(sourcePage, sourceNumber)}</div>`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => flipLayer.classList.add('go'));
    });

    window.setTimeout(() => {
      cursor = target;
      render();
      flipLayer.className = 'flip-layer';
      flipLayer.innerHTML = '';
      turning = false;
    }, 740);
  }

  function openReader() {
    if (landing.classList.contains('opening')) return;

    landing.classList.add('opening');
    openBook.disabled = true;

    window.setTimeout(() => {
      landing.hidden = true;
      reader.hidden = false;
      cursor = 0;
      render();
      requestAnimationFrame(() => reader.classList.add('visible'));
    }, 760);
  }

  function returnToCover() {
    document.querySelectorAll('video').forEach((video) => video.pause());
    reader.classList.remove('visible');

    window.setTimeout(() => {
      reader.hidden = true;
      landing.hidden = false;
      landing.classList.remove('opening');
      openBook.disabled = false;
      cursor = 0;
    }, 180);
  }

  function openLightbox(index) {
    if (index < 0 || index >= gallery.length) return;
    lightboxIndex = index;
    const item = gallery[lightboxIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt || 'Memory photo';
    lightboxCaption.textContent = [item.caption, item.date].filter(Boolean).join(' · ');
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute('src');
    document.body.style.overflow = '';
  }

  openBook.addEventListener('click', openReader);
  backToCover.addEventListener('click', returnToCover);
  prevPage.addEventListener('click', () => turn('prev'));
  nextPage.addEventListener('click', () => turn('next'));
  prevMobile.addEventListener('click', () => turn('prev'));
  nextMobile.addEventListener('click', () => turn('next'));

  soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;
    soundToggle.textContent = soundOn ? '🔊' : '🔇';
  });

  fullscreenToggle.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (_) {}
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-photo-index]');
    if (!button) return;
    openLightbox(Number(button.dataset.photoIndex));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxPrev.hidden = true;
  lightboxNext.hidden = true;

  document.addEventListener('keydown', (event) => {
    if (!lightbox.hidden) {
      if (event.key === 'Escape') closeLightbox();
      return;
    }

    if (reader.hidden) return;
    if (event.key === 'ArrowLeft') turn('prev');
    if (event.key === 'ArrowRight') turn('next');
    if (event.key === 'Escape') returnToCover();
  });

  book.addEventListener('pointerdown', (event) => {
    if (event.target.closest('video,button')) return;
    touchStartX = event.clientX;
  });

  book.addEventListener('pointerup', (event) => {
    if (touchStartX === null) return;
    const distance = event.clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(distance) < 55) return;
    turn(distance < 0 ? 'next' : 'prev');
  });

  window.addEventListener('resize', () => {
    if (!reader.hidden && !turning) render();
  });
})();
