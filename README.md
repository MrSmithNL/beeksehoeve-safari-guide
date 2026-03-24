# Beeksehoeve Safari Guide

Audio tour guide PWA for the Beeksehoeve Safari Express in Otterlo, Veluwe.

## Features

- 16-chapter audio tour narration
- 3 languages: Dutch, English, German
- Offline-capable (PWA with service worker)
- Big touch-friendly controls for mobile use
- Lock screen playback controls (Media Session API)
- Auto-advances to next chapter
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

Audio files are generated using ElevenLabs Text-to-Speech API with natural-sounding male narrator voices in each language.
