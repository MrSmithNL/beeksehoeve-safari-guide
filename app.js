// ---- State ----
let currentLang = localStorage.getItem('safari-lang') || 'nl';
let currentChapterIdx = -1;
let isPlaying = false;

const audio = document.getElementById('audioEl');
const chapterListEl = document.getElementById('chapterList');
const playerEl = document.getElementById('player');
const trackTitleEl = document.getElementById('trackTitle');
const trackSubtitleEl = document.getElementById('trackSubtitle');
const progressFill = document.getElementById('progressFill');
const timeElapsed = document.getElementById('timeElapsed');
const timeTotal = document.getElementById('timeTotal');
const iconPlay = document.getElementById('iconPlay');
const iconPause = document.getElementById('iconPause');
const volumeSlider = document.getElementById('volumeSlider');
const offlineBadge = document.getElementById('offlineBadge');

// ---- Init ----
function init() {
  // Set saved volume
  const savedVol = localStorage.getItem('safari-volume');
  if (savedVol !== null) {
    audio.volume = savedVol / 100;
    volumeSlider.value = savedVol;
  } else {
    audio.volume = 0.8;
  }

  // Set language
  setLang(currentLang, false);

  // Render chapters
  renderChapters();

  // Check offline download status
  checkDownloadStatus();

  // Hide loading screen
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hide');
  }, 600);

  // Offline detection
  updateOnlineStatus();
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

function updateOnlineStatus() {
  offlineBadge.classList.toggle('show', !navigator.onLine);
}

// ---- Language ----
function setLang(lang, rerender = true) {
  currentLang = lang;
  localStorage.setItem('safari-lang', lang);

  // Update buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update HTML lang
  document.documentElement.lang = lang;

  if (rerender) {
    renderChapters();
    checkDownloadStatus();
    // Update now-playing text if something is loaded
    if (currentChapterIdx >= 0) {
      const ch = CHAPTERS[currentChapterIdx];
      trackTitleEl.textContent = ch.title[currentLang];
      trackSubtitleEl.textContent = ch.subtitle[currentLang] || '';

      // Reload audio for new language
      const wasPlaying = isPlaying;
      const currentTime = audio.currentTime;
      audio.src = ch.audio[currentLang];
      audio.currentTime = currentTime;
      if (wasPlaying) audio.play();
    }
  }
}

// ---- Render ----
function renderChapters() {
  chapterListEl.innerHTML = '';
  CHAPTERS.forEach((ch, idx) => {
    const item = document.createElement('div');
    item.className = 'chapter-item' + (idx === currentChapterIdx ? ' active playing' : '');
    item.onclick = () => playChapter(idx);
    item.innerHTML = `
      <div class="chapter-num">${idx + 1}</div>
      <div class="chapter-info">
        <div class="chapter-title">${ch.title[currentLang]}</div>
        ${ch.subtitle[currentLang] ? `<div class="chapter-subtitle">${ch.subtitle[currentLang]}</div>` : ''}
      </div>
    `;
    chapterListEl.appendChild(item);
  });
}

// ---- Playback ----
function playChapter(idx) {
  if (idx < 0 || idx >= CHAPTERS.length) return;

  currentChapterIdx = idx;
  const ch = CHAPTERS[idx];

  // Update UI
  trackTitleEl.textContent = ch.title[currentLang];
  trackSubtitleEl.textContent = ch.subtitle[currentLang] || '';
  playerEl.classList.remove('player-hidden');

  // Highlight active chapter
  document.querySelectorAll('.chapter-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
    el.classList.toggle('playing', i === idx);
  });

  // Scroll active chapter into view
  const activeEl = document.querySelectorAll('.chapter-item')[idx];
  if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Load and play audio
  audio.src = ch.audio[currentLang];
  audio.play().then(() => {
    isPlaying = true;
    updatePlayIcon();
  }).catch(err => {
    console.warn('Audio play failed:', err);
    // Still show the player even if autoplay blocked
    isPlaying = false;
    updatePlayIcon();
  });
}

function togglePlay() {
  if (currentChapterIdx < 0) {
    // Nothing selected — play first chapter
    playChapter(0);
    return;
  }
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
}

function nextChapter() {
  if (currentChapterIdx < CHAPTERS.length - 1) {
    playChapter(currentChapterIdx + 1);
  }
}

function prevChapter() {
  // If more than 3 seconds in, restart current chapter
  if (audio.currentTime > 3 && currentChapterIdx >= 0) {
    audio.currentTime = 0;
    return;
  }
  if (currentChapterIdx > 0) {
    playChapter(currentChapterIdx - 1);
  }
}

function skip(seconds) {
  if (currentChapterIdx < 0) return;
  audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
}

function setVolume(val) {
  audio.volume = val / 100;
  localStorage.setItem('safari-volume', val);
}

function updatePlayIcon() {
  iconPlay.style.display = isPlaying ? 'none' : 'block';
  iconPause.style.display = isPlaying ? 'block' : 'none';
}

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

// ---- Audio events ----
audio.addEventListener('play', () => { isPlaying = true; updatePlayIcon(); });
audio.addEventListener('pause', () => { isPlaying = false; updatePlayIcon(); });
audio.addEventListener('ended', () => {
  isPlaying = false;
  updatePlayIcon();
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + '%';
  timeElapsed.textContent = formatTime(audio.currentTime);
  timeTotal.textContent = formatTime(audio.duration);
});

audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = formatTime(audio.duration);
});

// ---- Progress bar seeking (click + drag) ----
const progressContainer = document.getElementById('progressContainer');
let isDragging = false;

function seekFromEvent(e) {
  if (!audio.duration) return;
  const rect = progressContainer.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
}

progressContainer.addEventListener('click', seekFromEvent);

progressContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  seekFromEvent(e);
});
document.addEventListener('mousemove', (e) => {
  if (isDragging) seekFromEvent(e);
});
document.addEventListener('mouseup', () => { isDragging = false; });

progressContainer.addEventListener('touchstart', (e) => {
  isDragging = true;
  seekFromEvent(e);
}, { passive: true });
document.addEventListener('touchmove', (e) => {
  if (isDragging) seekFromEvent(e);
}, { passive: true });
document.addEventListener('touchend', () => { isDragging = false; });

// ---- Media Session API (lock screen controls) ----
if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', () => togglePlay());
  navigator.mediaSession.setActionHandler('pause', () => togglePlay());
  navigator.mediaSession.setActionHandler('previoustrack', () => prevChapter());
  navigator.mediaSession.setActionHandler('nexttrack', () => nextChapter());
  navigator.mediaSession.setActionHandler('seekbackward', () => skip(-10));
  navigator.mediaSession.setActionHandler('seekforward', () => skip(10));

  audio.addEventListener('play', () => {
    if (currentChapterIdx >= 0) {
      const ch = CHAPTERS[currentChapterIdx];
      navigator.mediaSession.metadata = new MediaMetadata({
        title: ch.title[currentLang],
        artist: 'Beeksehoeve Safari Guide',
        album: ch.subtitle[currentLang] || 'Safari Express'
      });
    }
  });
}

// ---- Download All for Offline ----
let isDownloading = false;

async function downloadAll() {
  if (isDownloading) return;

  const btn = document.getElementById('downloadBtn');
  const label = document.getElementById('downloadLabel');
  const progressBar = document.getElementById('downloadProgress');
  const progressFill = document.getElementById('downloadProgressFill');

  // Check if all files are already cached
  const cache = await caches.open('safari-guide-v2');
  const allFiles = CHAPTERS.map(ch => ch.audio[currentLang]);
  let cached = 0;
  for (const file of allFiles) {
    const match = await cache.match(file);
    if (match) cached++;
  }

  if (cached === allFiles.length) {
    label.textContent = 'All chapters available offline';
    btn.classList.add('done');
    return;
  }

  isDownloading = true;
  btn.classList.add('downloading');
  progressBar.classList.add('show');
  label.textContent = 'Downloading...';

  let completed = 0;
  for (const file of allFiles) {
    try {
      // Check if already cached
      const match = await cache.match(file);
      if (!match) {
        const resp = await fetch(file);
        if (resp.ok) {
          await cache.put(file, resp);
        }
      }
    } catch (err) {
      console.warn('Failed to cache:', file, err);
    }
    completed++;
    const pct = (completed / allFiles.length) * 100;
    progressFill.style.width = pct + '%';
    label.textContent = `Downloading... ${completed}/${allFiles.length}`;
  }

  isDownloading = false;
  progressBar.classList.remove('show');
  btn.classList.remove('downloading');
  btn.classList.add('done');
  label.textContent = 'All chapters available offline';
}

// Check download status on init and language change
async function checkDownloadStatus() {
  const btn = document.getElementById('downloadBtn');
  const label = document.getElementById('downloadLabel');

  if (!('caches' in window)) {
    btn.style.display = 'none';
    return;
  }

  try {
    const cache = await caches.open('safari-guide-v2');
    const allFiles = CHAPTERS.map(ch => ch.audio[currentLang]);
    let cached = 0;
    for (const file of allFiles) {
      const match = await cache.match(file);
      if (match) cached++;
    }

    btn.classList.remove('done', 'downloading');
    if (cached === allFiles.length) {
      btn.classList.add('done');
      label.textContent = 'All chapters available offline';
    } else if (cached > 0) {
      label.textContent = `Download for offline (${cached}/${allFiles.length} cached)`;
    } else {
      label.textContent = 'Download for offline use';
    }
  } catch (e) {
    // Ignore cache errors
  }
}

// ---- Register Service Worker ----
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    console.log('SW registered:', reg.scope);
  }).catch(err => {
    console.warn('SW registration failed:', err);
  });
}

// ---- Start ----
init();
