---
name: normal-map
description: Generate a tangent-space normal map from a diffuse texture.
category: asset-processing
dependencies:
  - sharp
inputs:
  - diffuse image path
  - optional strength
outputs:
  - PNG normal map
examples:
  - node skills/normal-map/scripts/generate.mjs ./diffuse.png
---

# Normal Map

Use this skill when you want a quick height-derived normal map from an existing texture.

- Input formats: PNG, JPG, WebP, and other formats supported by `sharp`
- Output format: PNG
- Failure cases: missing image, unreadable image data, or invalid strength values
