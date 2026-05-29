---
name: audio-format-convert
description: Convert audio files between WAV, OGG, and MP3 with ffmpeg.
category: asset-processing
dependencies:
  - ffmpeg
inputs:
  - audio file path
  - target format
outputs:
  - converted audio file
examples:
  - node skills/audio-format-convert/scripts/convert.mjs ./theme.wav ogg
---

# Audio Format Convert

Use this skill when you need a deterministic format conversion without changing the composition.

- Input formats: any format supported by `ffmpeg`
- Output formats in v0.1: `wav`, `ogg`, `mp3`
- Failure cases: missing `ffmpeg`, unsupported target format, or invalid input path
