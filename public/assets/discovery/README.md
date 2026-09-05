# LAUME production discovery assets

These files are production layers for the web experience. With the exception of `scene-background.png`, every PNG has transparency and is intended to be composited in the browser.

- Keep all visible copy in HTML/CSS.
- Do not convert transparent files to JPEG.
- Use CSS/SVG/WebGL for fog, glow, shadows and the seal progress ring.
- Layer the letter between `envelope-open-rear.png` and `envelope-open-front.png`.
- See `docs/LAUME_ASSET_ANIMATION_IMPLEMENTATION.md` for the complete animation contract.
- See `ASSET_GENERATION_PROMPTS.md` for the final prompt set used to produce the material layers.
