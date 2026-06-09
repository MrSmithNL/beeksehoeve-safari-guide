# Beeksehoeve Safari Guide

Audio tour guide PWA for the Beeksehoeve Safari Express in Otterlo, Veluwe.

## Features

- 16-chapter audio tour narration
- 3 languages: Dutch, English, German
- Offline-capable (PWA with service worker)
- Big touch-friendly controls for mobile use
- Lock screen playback controls (Media Session API)
- Volume control with memory

## Tech Stack

- Vanilla HTML + CSS + JS (zero dependencies)
- Service Worker for offline caching
- PWA manifest for "Add to Home Screen"
- Audio generated via ElevenLabs API

## Usage

1. Serve with any static file server
2. Open on mobile browser
3. Add to Home Screen for app-like experience
4. Select language and press play

## Audio Generation

Audio files are generated using the ElevenLabs Text-to-Speech API (`eleven_multilingual_v2`)
with natural-sounding male narrator voices in each language:

| Language | Voice | Voice ID |
|----------|-------|----------|
| Dutch (nl) | Ido — Professional Friendly Narrator | `dLPO5AsXc3FZDbTh1IKa` |
| English (en) | Talkative Joe — Lively British RP | `aFyw0oiXW7dzKF4o7woX` |
| German (de) | Helmut — Deep Warm Narrator | `JiW03c2Gt43XNUQAumRP` |

Run `scripts/generate-audio.py` to (re)generate. By default it skips existing files >10 KB.
Optional flags for targeted regeneration:

```
python3 scripts/generate-audio.py --lang en --chapters A,B,J,K,L --force
```

- `--lang nl,en,de` — restrict to specific languages (default: all)
- `--chapters A,B,…` — restrict to specific chapter IDs (default: all)
- `--force` — overwrite existing files

### Year-dates spelled out

ElevenLabs mispronounces numerical years (e.g. reading `1863` as "one thousand
eight hundred sixty-three"). All calendar years in the narration scripts
(`docs/script-*.txt`) are therefore written out as words — e.g. `1863` →
"eighteen sixty-three" / "achtzehnhundertdreiundsechzig". Non-year numbers
(durations, weights, counts) are left as digits, which TTS reads correctly.

### Service-worker cache

Audio is cached **cache-first**, so after replacing any audio file you must bump
`CACHE_NAME` in both `sw.js` and `app.js` (keep them in sync) — otherwise
installed apps keep serving the old cached audio. Current version: **v6**.
