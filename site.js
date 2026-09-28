(() => {
  const mediaRoot = './public/media/';

  const pages = [
    {
      type: 'title',
      title: 'Our Memories',
      subtitle: 'A collection of moments',
      quote: 'The random days usually become the best memories.'
    },
    {
      type: 'photo',
      media: {
        src: mediaRoot + 'photos/WhatsApp%20Image%202026-09-28%20at%2011.16.24%20PM.jpeg',
        alt: 'Friend memory photo',
        caption: 'One of those days worth keeping.',
        date: '2026'
      }
    },
    {
      type: 'two',
      media: [
        {
          src: mediaRoot + 'photos/sample-2.svg',
          alt: 'Replace with a portrait or candid photo',
          caption: 'Random picture. Permanent memory.'
        },
        {
          src: mediaRoot + 'photos/sample-3.svg',
          alt: 'Replace with another friend photo',
          caption: 'No context needed.'
        }
      ]
    },
    {
      type: 'video',
      media: {
        src: mediaRoot + 'videos/IMG_1500.MOV',
        poster: mediaRoot + 'posters/sample-video.svg',
        caption: 'A memory in motion.'
      }
    },
    {
      type: 'collage',
      media: [
        { src: mediaRoot + 'photos/sample-4.svg', alt: 'Replace with your photo' },
        { src: mediaRoot + 'photos/sample-5.svg', alt: 'Replace with your photo' },
        { src: mediaRoot + 'photos/sample-6.svg', alt: 'Replace with your photo' }
      ]
    },
    {
      type: 'photoText',
      text: 'That day was actually crazy 😂',
      media: {
        src: mediaRoot + 'photos/sample-7.svg',
        alt: 'Replace with a funny or memorable photo',
        date: '2026'
      }
    },
    {
      type: 'final',
      title: 'More memories to come…',
      message: 'This book is only getting started.'
    }
  ];

  const gallery = [];
  pages.forEach((page) => {
    if (page.type === 'photo' || page.type === 'photoText') gallery.push(page.media);
    if (page.type === 'two' || page.type === 'collage') gallery.push(...page.media);
  });

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
  let lightboxIndex = 0;
  let touchStartX = null;

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

  function galleryIndex(src) {
    return gallery.findIndex((item) => item.src === src);
  }

  function photoButton(media, extraClass = '') {
    const index = galleryIndex(media.src);
    return `
      <button type="button" class="${extraClass}" data-photo-index="${index}" aria-label="Open image">
        <img src="${safe(media.src)}" alt="${safe(media.alt || 'Memory photo')}" loading="lazy" decoding="async" />
      </button>
    `;
  }

  function pageHTML(page, pageNumber) {
    if (!page) {
      return '<div class="page"><div class="blank-page">♡</div></div>';
    }

    let body = '';

    if (page.type === 'title') {
      body = `
        <div class="title-page">
          <span class="eyebrow">MEMORY BOOK</span>
          <h1>${safe(page.title)}</h1>
          <p class="subtitle">${safe(page.subtitle)}</p>
          <div class="rule"></div>
          <blockquote class="quote">${safe(page.quote)}</blockquote>
        </div>
      `;
    }

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

    if (page.type === 'two') {
      body = `
        <div class="two-photo">
          ${page.media.map((item) => `
            <div class="photo-cell">
              <div class="frame">${photoButton(item)}</div>
              <p>${safe(item.caption)}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (page.type === 'collage') {
      body = `
        <div class="collage">
          ${photoButton(page.media[0], 'big')}
          ${photoButton(page.media[1], 'small-a')}
          ${photoButton(page.media[2], 'small-b')}
        </div>
      `;
    }

    if (page.type === 'video') {
      body = `
        <div class="video-page">
          <span class="eyebrow">A MOVING MEMORY</span>
          <div class="video-frame">
            <video src="${safe(page.media.src)}" poster="${safe(page.media.poster)}" controls playsinline preload="metadata"></video>
          </div>
          <p>${safe(page.media.caption)}</p>
        </div>
      `;
    }

    if (page.type === 'photoText') {
      body = `
        <div class="photo-text">
          <div class="photo-frame">${photoButton(page.media)}</div>
          <p class="hand">${safe(page.text)}</p>
          <span class="tiny-date">${safe(page.media.date)}</span>
        </div>
      `;
    }

    if (page.type === 'final') {
      body = `
        <div class="final-page">
          <span class="eyebrow">TO BE CONTINUED</span>
          <h2>${safe(page.title)}</h2>
          <p>${safe(page.message)}</p>
          <span class="final-heart">♡</span>
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

  function normalizeCursor() {
    if (mobile()) {
      cursor = Math.max(0, Math.min(cursor, pages.length - 1));
    } else {
      cursor = Math.max(0, Math.min(cursor, Math.max(0, pages.length - 2)));
      cursor = Math.floor(cursor / 2) * 2;
    }
  }

  function render() {
    normalizeCursor();

    if (mobile()) {
      leftPage.innerHTML = '';
      rightPage.innerHTML = pageHTML(pages[cursor], cursor + 1);
      pageLabel.textContent = `${cursor + 1} / ${pages.length}`;
      progressBar.style.width = `${((cursor + 1) / pages.length) * 100}%`;
      const atStart = cursor === 0;
      const atEnd = cursor >= pages.length - 1;
      prevPage.disabled = prevMobile.disabled = atStart;
      nextPage.disabled = nextMobile.disabled = atEnd;
    } else {
      leftPage.innerHTML = pageHTML(pages[cursor], cursor + 1);
      rightPage.innerHTML = pageHTML(pages[cursor + 1], Math.min(cursor + 2, pages.length));
      const end = Math.min(cursor + 2, pages.length);
      pageLabel.textContent = `${cursor + 1}–${end} / ${pages.length}`;
      progressBar.style.width = `${(end / pages.length) * 100}%`;
      const atStart = cursor === 0;
      const atEnd = cursor + 2 >= pages.length;
      prevPage.disabled = prevMobile.disabled = atStart;
      nextPage.disabled = nextMobile.disabled = atEnd;
    }
  }

  function pageTurnSound() {
    if (!soundOn) return;
    const audio = new Audio(mediaRoot + 'page-turn.mp3');
    audio.volume = 0.18;
    audio.play().catch(() => {});
  }

  function turn(direction) {
    if (turning) return;

    const step = mobile() ? 1 : 2;
    const target = cursor + (direction === 'next' ? step : -step);

    if (target < 0 || target >= pages.length) return;

    turning = true;
    pageTurnSound();

    const sourcePage = mobile()
      ? pages[cursor]
      : direction === 'next'
        ? pages[cursor + 1]
        : pages[cursor];

    const sourceNumber = mobile()
      ? cursor + 1
      : direction === 'next'
        ? Math.min(cursor + 2, pages.length)
        : cursor + 1;

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
      render();
      requestAnimationFrame(() => reader.classList.add('visible'));
    }, 920);
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
    updateLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    const item = gallery[lightboxIndex];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt || 'Memory photo';
    lightboxCaption.textContent = [item.caption, item.date].filter(Boolean).join(' · ');
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute('src');
    document.body.style.overflow = '';
  }

  function moveLightbox(delta) {
    lightboxIndex = (lightboxIndex + delta + gallery.length) % gallery.length;
    updateLightbox();
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
    soundToggle.setAttribute('aria-label', soundOn ? 'Mute page sound' : 'Enable page sound');
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
    event.preventDefault();
    openLightbox(Number(button.dataset.photoIndex));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => moveLightbox(-1));
  lightboxNext.addEventListener('click', () => moveLightbox(1));

  document.addEventListener('keydown', (event) => {
    if (!lightbox.hidden) {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') moveLightbox(-1);
      if (event.key === 'ArrowRight') moveLightbox(1);
      return;
    }
    if (reader.hidden) return;
    if (event.key === 'ArrowLeft') turn('prev');
    if (event.key === 'ArrowRight') turn('next');
    if (event.key === 'Escape') returnToCover();
  });

  book.addEventListener('pointerdown', (event) => {
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
