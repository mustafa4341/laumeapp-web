// One-off calibration helper: finds each individual footprint in
// physical-trace.png (connected alpha components) so the trail can be
// re-laid-out along a responsive path as separate sprites.
import fs from "node:fs";
import zlib from "node:zlib";

function readPng(file) {
  const buf = fs.readFileSync(file);
  let pos = 8;
  let width = 0, height = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") { width = data.readUInt32BE(0); height = data.readUInt32BE(4); }
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    pos += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const out = Buffer.alloc(height * stride);
  let rp = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[rp++];
    const line = raw.subarray(rp, rp + stride);
    rp += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prior = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= 4 ? cur[x - 4] : 0;
      const b = prior ? prior[x] : 0;
      const c = x >= 4 && prior ? prior[x - 4] : 0;
      let v = line[x];
      switch (filter) {
        case 1: v += a; break;
        case 2: v += b; break;
        case 3: v += (a + b) >> 1; break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          break;
        }
      }
      cur[x] = v & 0xff;
    }
  }
  return { width, height, pixels: out };
}

const { width, height, pixels } = readPng("public/assets/discovery/physical-trace.png");
const ALPHA = 20;
const seen = new Uint8Array(width * height);
const blobs = [];
const stack = new Int32Array(width * height);

for (let sy = 0; sy < height; sy++) {
  for (let sx = 0; sx < width; sx++) {
    const start = sy * width + sx;
    if (seen[start] || pixels[start * 4 + 3] <= ALPHA) continue;
    let top = 0;
    stack[top++] = start;
    seen[start] = 1;
    let minX = sx, maxX = sx, minY = sy, maxY = sy, count = 0;
    while (top > 0) {
      const idx = stack[--top];
      const x = idx % width;
      const y = (idx - x) / width;
      count++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      // 8-connected, with a small dilation radius so a footprint broken up by
      // soft antialiasing still reads as one blob.
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const ni = ny * width + nx;
          if (seen[ni] || pixels[ni * 4 + 3] <= ALPHA) continue;
          seen[ni] = 1;
          stack[top++] = ni;
        }
      }
    }
    if (count > 400) blobs.push({ minX, minY, maxX, maxY, count });
  }
}

// Walk order: the trail runs bottom-left to top-right.
blobs.sort((a, b) => (b.minY + b.maxY) - (a.minY + a.maxY));
console.log(`${width}x${height} — ${blobs.length} footprints`);
console.log(
  JSON.stringify(
    blobs.map((b) => ({
      x: +(b.minX / width).toFixed(4),
      y: +(b.minY / height).toFixed(4),
      w: +((b.maxX - b.minX + 1) / width).toFixed(4),
      h: +((b.maxY - b.minY + 1) / height).toFixed(4),
    }))
  )
);
