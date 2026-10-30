// Cuts a top-down car photo out of its studio backdrop and grades it for the dark site.
// Usage: node scripts/make-car-sprite.mjs <photo> <out-dir> [height=360]
// Writes <out-dir>/g63-top.webp (the graded sprite) plus grade variants for comparison.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [src, outDir, hArg] = process.argv.slice(2);
if (!src || !outDir) throw new Error("usage: make-car-sprite.mjs <photo> <out-dir> [height]");
const H = Number(hArg ?? 360);
mkdirSync(outDir, { recursive: true });

// 1. Matte: flood-fill the bright backdrop in from the border; the biggest remaining region is the car.
const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const lum = (i) => (data[i * 3] * 0.299 + data[i * 3 + 1] * 0.587 + data[i * 3 + 2] * 0.114) | 0;
const BG = 205;
const bg = new Uint8Array(w * h);
const stack = new Int32Array(w * h);
let sp = 0;
const seed = (i) => {
  if (!bg[i] && lum(i) > BG) {
    bg[i] = 1;
    stack[sp++] = i;
  }
};
for (let x = 0; x < w; x++) {
  seed(x);
  seed((h - 1) * w + x);
}
for (let y = 0; y < h; y++) {
  seed(y * w);
  seed(y * w + w - 1);
}
while (sp) {
  const i = stack[--sp];
  const x = i % w;
  if (x > 0) seed(i - 1);
  if (x < w - 1) seed(i + 1);
  if (i >= w) seed(i - w);
  if (i < w * (h - 1)) seed(i + w);
}
// label the non-background components, keep the largest
const label = new Int32Array(w * h);
let best = 0;
let bestSize = 0;
let next = 0;
for (let s = 0; s < w * h; s++) {
  if (bg[s] || label[s]) continue;
  next++;
  let size = 0;
  label[s] = next;
  stack[sp++] = s;
  while (sp) {
    const i = stack[--sp];
    size++;
    const x = i % w;
    for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i >= w ? i - w : -1, i < w * (h - 1) ? i + w : -1]) {
      if (j >= 0 && !bg[j] && !label[j]) {
        label[j] = next;
        stack[sp++] = j;
      }
    }
  }
  if (size > bestSize) {
    bestSize = size;
    best = next;
  }
}
const alpha = Buffer.alloc(w * h);
for (let i = 0; i < w * h; i++) alpha[i] = label[i] === best ? 255 : 0;

// erode 1px to drop the white halo, then feather
let a = sharp(alpha, { raw: { width: w, height: h, channels: 1 } });
const mask = await a.blur(1.2).threshold(200).blur(1.6).toColourspace("b-w").raw().toBuffer();
if (mask.length !== w * h) throw new Error(`mask has ${mask.length / (w * h)} channels`);

const rgba = Buffer.alloc(w * h * 4);
for (let i = 0; i < w * h; i++) {
  rgba[i * 4] = data[i * 3];
  rgba[i * 4 + 1] = data[i * 3 + 1];
  rgba[i * 4 + 2] = data[i * 3 + 2];
  rgba[i * 4 + 3] = mask[i];
}

// 2. Trim to the car and turn it so the nose points down the road, then size it.
let x0 = w, x1 = 0, y0 = h, y1 = 0;
for (let i = 0; i < w * h; i++) {
  if (mask[i] > 8) {
    const x = i % w, y = (i / w) | 0;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
}
console.log(`car bbox ${x0},${y0} - ${x1},${y1}`);
const cropped = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
  .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
  .png()
  .toBuffer();
const cut = await sharp(cropped)
  .rotate(-90)
  .resize({ height: H, kernel: "lanczos3" })
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: cw, height: ch } = cut.info;
console.log(`sprite ${cw}x${ch} (aspect ${(cw / ch).toFixed(3)})`);

// 3. Grades. Each maps r,g,b (0-255) -> r,g,b.
const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
const grades = {
  // untouched
  original: (r, g, b) => [r, g, b],
  // lifted, cool graphite blacks; warm papaya in the highlights; slightly more contrast on the mid-tones
  graphite: (r, g, b) => {
    const l = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    const lift = 22 * (1 - l) ** 2; // raise the crushed blacks
    const warm = 26 * Math.max(0, l - 0.45) ** 1.3 * 2; // papaya in the bright reflections
    return [clamp(r * 1.08 + lift * 0.95 + warm), clamp(g * 1.08 + lift * 1.0 + warm * 0.42), clamp(b * 1.1 + lift * 1.12 - warm * 0.2)];
  },
  // black -> papaya -> cream gradient on luminance
  papaya: (r, g, b) => {
    const l = Math.min(1, (r * 0.299 + g * 0.587 + b * 0.114) / 255 / 0.62);
    const stops = [
      [0, [34, 16, 6]],
      [0.4, [214, 84, 8]],
      [0.78, [255, 150, 52]],
      [1, [255, 236, 208]],
    ];
    for (let k = 1; k < stops.length; k++) {
      if (l <= stops[k][0]) {
        const t = (l - stops[k - 1][0]) / (stops[k][0] - stops[k - 1][0]);
        const p = stops[k - 1][1];
        const q = stops[k][1];
        return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
      }
    }
    return stops[3][1];
  },
};

for (const [name, fn] of Object.entries(grades)) {
  const out = Buffer.from(cut.data);
  for (let i = 0; i < cw * ch; i++) {
    const [r, g, b] = fn(out[i * 4], out[i * 4 + 1], out[i * 4 + 2]);
    out[i * 4] = r;
    out[i * 4 + 1] = g;
    out[i * 4 + 2] = b;
  }
  await sharp(out, { raw: { width: cw, height: ch, channels: 4 } })
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(join(outDir, `g63-${name}.webp`));
}
console.log("done");
