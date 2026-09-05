// One-off calibration helper: reports the opaque bounding box of each
// discovery asset in normalized (0-1) image coordinates so the envelope /
// seal / letter layers can be registered against each other in CSS.
import fs from "node:fs";
import zlib from "node:zlib";
import path from "node:path";

function readPng(file) {
  const buf = fs.readFileSync(file);
  let pos = 8;
  let width = 0, height = 0, bitDepth = 0, colorType = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") break;
    pos += 12 + len;
  }
  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) {
    return { width, height, unsupported: `bitDepth=${bitDepth} colorType=${colorType}` };
  }
  const channels = colorType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);
  let rp = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[rp++];
    const line = raw.subarray(rp, rp + stride);
    rp += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prior = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? cur[x - channels] : 0;
      const b = prior ? prior[x] : 0;
      const c = x >= channels && prior ? prior[x - channels] : 0;
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
  return { width, height, channels, pixels: out };
}

const dir = path.resolve("public/assets/discovery");
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort()) {
  const img = readPng(path.join(dir, file));
  if (img.unsupported) {
    console.log(file.padEnd(28), img.width + "x" + img.height, "UNSUPPORTED", img.unsupported);
    continue;
  }
  const { width, height, channels, pixels } = img;
  if (channels === 3) {
    console.log(file.padEnd(28), width + "x" + height, "opaque (no alpha)");
    continue;
  }
  let minX = width, minY = height, maxX = -1, maxY = -1, opaqueCount = 0;
  // Weighted centroid of clearly-visible pixels, used for seal registration.
  let cx = 0, cy = 0, wsum = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = pixels[y * width * 4 + x * 4 + 3];
      if (a > 24) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        opaqueCount++;
        cx += x * a; cy += y * a; wsum += a;
      }
    }
  }
  const n = (v, total) => (v / total).toFixed(4);
  console.log(
    file.padEnd(28),
    `${width}x${height}`,
    `bbox x[${n(minX, width)}, ${n((maxX + 1), width)}] y[${n(minY, height)}, ${n((maxY + 1), height)}]`,
    `centroid(${n(cx / wsum, width)}, ${n(cy / wsum, height)})`,
    `coverage=${((opaqueCount / (width * height)) * 100).toFixed(1)}%`
  );
}
