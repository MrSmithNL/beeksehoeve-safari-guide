#!/usr/bin/env python3
"""Generate all audio files for Beeksehoeve Safari Guide using ElevenLabs API."""

import os
import re
import sys
import time
import json
import urllib.request
import urllib.error

API_KEY = "sk_2d470acd513b0bbaa3186258143ff49a6d9eacb477d8ac75"
BASE_URL = "https://api.elevenlabs.io/v1/text-to-speech"

# Voice IDs per language
VOICES = {
    "nl": "60CwgZt94Yf7yYIXMDDe",  # Peter - Native Dutch narrator
    "en": "onwK4e9ZLuTAKqWW03F9",  # Daniel - British broadcaster
    "de": "JiW03c2Gt43XNUQAumRP",  # Helmut - German warm narrator
}

VOICE_SETTINGS = {
    "stability": 0.65,
    "similarity_boost": 0.75,
    "style": 0.3,
}

# Chapter IDs in order
CHAPTER_IDS = list("ABCDEFGHIJKLMNOP")

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(PROJECT_DIR, "docs")
AUDIO_DIR = os.path.join(PROJECT_DIR, "audio")

def parse_chapters(filepath):
    """Parse script file into chapters. Returns dict of chapter_id -> text."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Split on "Chapter X:" or "Bestand X:" patterns
    # English/German use "Chapter X:" or "Chapter Closing:"
    # Dutch uses "Bestand X:"
    chapters = {}

    # Try English/German format first
    parts = re.split(r'Chapter\s+([A-P]|Closing):', content)

    if len(parts) < 3:
        # Try Dutch format
        parts = re.split(r'Bestand\s+([A-P]):', content)

    if len(parts) < 3:
        print(f"  WARNING: Could not parse chapters from {filepath}")
        return chapters

    i = 1
    chapter_idx = 0
    while i < len(parts) - 1:
        chapter_label = parts[i].strip()
        chapter_text = parts[i + 1].strip()

        # Clean up: remove title line, keep only the narration text
        lines = chapter_text.split('\n')
        # Find the actual narration (starts/ends with quotes)
        narration_lines = []
        in_narration = False
        for line in lines:
            stripped = line.strip()
            if not stripped:
                if in_narration:
                    narration_lines.append("")
                continue
            if stripped.startswith('"') or stripped.startswith('\u201c') or stripped.startswith('\u201e'):
                in_narration = True
            if in_narration:
                narration_lines.append(stripped)
            if stripped.endswith('"') or stripped.endswith('\u201d'):
                if in_narration:
                    break

        text = ' '.join(line for line in narration_lines if line)
        # Remove quote marks
        text = text.strip('""\u201c\u201d\u201e')

        if chapter_label == "Closing":
            cid = "P"
        elif chapter_idx < len(CHAPTER_IDS):
            cid = CHAPTER_IDS[chapter_idx]
        else:
            cid = chapter_label

        if text:
            chapters[cid] = text

        chapter_idx += 1
        i += 2

    return chapters


def generate_audio(text, voice_id, output_path):
    """Call ElevenLabs TTS API and save the audio file."""
    url = f"{BASE_URL}/{voice_id}"

    payload = json.dumps({
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": VOICE_SETTINGS,
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, method="POST")
    req.add_header("xi-api-key", API_KEY)
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "audio/mpeg")

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            audio_data = resp.read()
            with open(output_path, "wb") as f:
                f.write(audio_data)
            return len(audio_data)
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        print(f"  ERROR {e.code}: {error_body[:200]}")
        return 0


def main():
    scripts = {
        "nl": os.path.join(DOCS_DIR, "script-dutch.txt"),
        "en": os.path.join(DOCS_DIR, "script-english.txt"),
        "de": os.path.join(DOCS_DIR, "script-german.txt"),
    }

    # Parse all scripts
    all_chapters = {}
    for lang, path in scripts.items():
        print(f"\nParsing {lang} script: {path}")
        chapters = parse_chapters(path)
        all_chapters[lang] = chapters
        print(f"  Found {len(chapters)} chapters: {', '.join(sorted(chapters.keys()))}")

    # Generate audio for each language and chapter
    total_chars = 0
    total_files = 0
    failed = []

    for lang in ["nl", "en", "de"]:
        voice_id = VOICES[lang]
        chapters = all_chapters.get(lang, {})
        lang_dir = os.path.join(AUDIO_DIR, lang)
        os.makedirs(lang_dir, exist_ok=True)

        print(f"\n{'='*60}")
        print(f"Generating {lang.upper()} audio ({len(chapters)} chapters)")
        print(f"Voice: {voice_id}")
        print(f"{'='*60}")

        for cid in CHAPTER_IDS:
            if cid not in chapters:
                print(f"  [{cid}] SKIP - no text found")
                continue

            text = chapters[cid]
            output_path = os.path.join(lang_dir, f"{cid}.mp3")
            char_count = len(text)
            total_chars += char_count

            # Skip if file already exists and is > 10KB
            if os.path.exists(output_path) and os.path.getsize(output_path) > 10000:
                print(f"  [{cid}] SKIP - already exists ({os.path.getsize(output_path):,} bytes)")
                total_files += 1
                continue

            print(f"  [{cid}] Generating... ({char_count:,} chars)", end="", flush=True)
            size = generate_audio(text, voice_id, output_path)

            if size > 0:
                print(f" -> {size:,} bytes OK")
                total_files += 1
            else:
                print(f" -> FAILED")
                failed.append(f"{lang}/{cid}")

            # Rate limit: wait between requests
            time.sleep(1)

    print(f"\n{'='*60}")
    print(f"DONE: {total_files} files generated, {total_chars:,} characters used")
    if failed:
        print(f"FAILED: {', '.join(failed)}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
