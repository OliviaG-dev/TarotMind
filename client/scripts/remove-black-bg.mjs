import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const inputPath = join(__dirname, '../public/img/hero-cartes.png')
const outputPath = join(__dirname, '../public/img/hero-cartes-transparent.png')

const OUTLINE_PURPLE = { r: 88, g: 68, b: 112 }

function luma(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function saturation(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max <= 0) return 0
  return (max - min) / max
}

function isBackgroundLike(r, g, b, mode = 'flood') {
  const l = luma(r, g, b)
  const s = saturation(r, g, b)
  const max = Math.max(r, g, b)

  if (mode === 'flood') {
    if (l <= 58 && s <= 0.16) return true
    if (max <= 68 && s <= 0.12) return true
    return false
  }

  if (l <= 110 && s <= 0.14) return true
  if (max <= 120 && s <= 0.1) return true
  return false
}

function idx(x, y, width) {
  return (y * width + x) * 4
}

function floodFromEdges(data, width, height) {
  const visited = new Uint8Array(width * height)
  const queue = []

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const p = y * width + x
    if (visited[p]) return
    const i = idx(x, y, width)
    if (!isBackgroundLike(data[i], data[i + 1], data[i + 2], 'flood')) return
    visited[p] = 1
    queue.push(p)
  }

  for (let x = 0; x < width; x += 1) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y)
    push(width - 1, y)
  }

  while (queue.length > 0) {
    const p = queue.pop()
    const x = p % width
    const y = (p - x) / width
    data[idx(x, y, width) + 3] = 0

    push(x - 1, y)
    push(x + 1, y)
    push(x, y - 1)
    push(x, y + 1)
  }
}

function computeDistanceFromTransparent(data, width, height, maxDist = 10) {
  const dist = new Int16Array(width * height)
  dist.fill(-1)
  const queue = []

  for (let p = 0; p < width * height; p += 1) {
    if (data[p * 4 + 3] === 0) {
      dist[p] = 0
      queue.push(p)
    }
  }

  let head = 0
  while (head < queue.length) {
    const p = queue[head]
    head += 1
    const x = p % width
    const y = (p - x) / width
    const nextDist = dist[p] + 1
    if (nextDist > maxDist) continue

    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
      const np = ny * width + nx
      if (data[np * 4 + 3] === 0 || dist[np] !== -1) continue
      dist[np] = nextDist
      queue.push(np)
    }
  }

  return dist
}

function sampleInnerColor(data, width, height, x, y) {
  let sr = 0
  let sg = 0
  let sb = 0
  let count = 0

  for (let dy = -5; dy <= 5; dy += 1) {
    for (let dx = -5; dx <= 5; dx += 1) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
      const i = idx(nx, ny, width)
      if (data[i + 3] < 200) continue

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const l = luma(r, g, b)
      if (l < 95) continue

      const weight = l > 170 ? 2.5 : 1
      sr += r * weight
      sg += g * weight
      sb += b * weight
      count += weight
    }
  }

  if (count === 0) return null
  return {
    r: Math.round(sr / count),
    g: Math.round(sg / count),
    b: Math.round(sb / count),
  }
}

function repairEdgeFringe(data, width, height, dist) {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = y * width + x
      const i = idx(x, y, width)
      if (data[i + 3] === 0) continue

      const edgeDist = dist[p]
      if (edgeDist < 1 || edgeDist > 6) continue

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const l = luma(r, g, b)
      const max = Math.max(r, g, b)
      const s = saturation(r, g, b)
      const grayish = Math.abs(r - g) < 26 && Math.abs(g - b) < 26

      const isFringe =
        (edgeDist <= 3 && grayish && l < 165) ||
        (edgeDist <= 5 && grayish && l < 130 && s < 0.14) ||
        (edgeDist <= 2 && max < 95)

      if (!isFringe) continue

      const inner = sampleInnerColor(data, width, height, x, y)
      if (!inner) {
        data[i + 3] = 0
        continue
      }

      if (edgeDist <= 2 && l < 135) {
        data[i] = inner.r
        data[i + 1] = inner.g
        data[i + 2] = inner.b
        data[i + 3] = 255
        continue
      }

      const blend = edgeDist <= 3 ? 0.92 : 0.75
      data[i] = Math.round(r * (1 - blend) + inner.r * blend)
      data[i + 1] = Math.round(g * (1 - blend) + inner.g * blend)
      data[i + 2] = Math.round(b * (1 - blend) + inner.b * blend)
      data[i + 3] = 255
    }
  }
}

function removeOuterGrayRing(data, width, height, dist) {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = y * width + x
      const i = idx(x, y, width)
      if (data[i + 3] === 0) continue

      const edgeDist = dist[p]
      if (edgeDist < 1 || edgeDist > 3) continue

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const l = luma(r, g, b)
      const max = Math.max(r, g, b)
      const grayish = Math.abs(r - g) < 28 && Math.abs(g - b) < 28

      if (grayish && l < 155 && max < 170) {
        data[i + 3] = 0
      }
    }
  }
}

/** Remplace le noir/gris des traits par un violet fonce (style maquette). */
function softenBlackOutlines(data) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 20) continue

    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const max = Math.max(r, g, b)
    const l = luma(r, g, b)

    if (max > 78 || l > 82) continue

    const t = max <= 20 ? 1 : (78 - max) / 58
    const blend = Math.min(1, Math.max(0, t))

    data[i] = Math.round(r * (1 - blend) + OUTLINE_PURPLE.r * blend)
    data[i + 1] = Math.round(g * (1 - blend) + OUTLINE_PURPLE.g * blend)
    data[i + 2] = Math.round(b * (1 - blend) + OUTLINE_PURPLE.b * blend)
  }
}

function erodeFringe(data, width, height, passes = 14) {
  for (let pass = 0; pass < passes; pass += 1) {
    const nextAlpha = new Uint8Array(width * height)

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = idx(x, y, width)
        const alpha = data[i + 3]
        if (alpha === 0) {
          nextAlpha[y * width + x] = 0
          continue
        }

        let nearTransparent = false
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            if (dx === 0 && dy === 0) continue
            const nx = x + dx
            const ny = y + dy
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
              nearTransparent = true
              break
            }
            if (data[idx(nx, ny, width) + 3] === 0) {
              nearTransparent = true
              break
            }
          }
          if (nearTransparent) break
        }

        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        if (nearTransparent && isBackgroundLike(r, g, b, 'fringe')) {
          nextAlpha[y * width + x] = 0
        } else {
          nextAlpha[y * width + x] = alpha
        }
      }
    }

    for (let p = 0; p < width * height; p += 1) {
      data[p * 4 + 3] = nextAlpha[p]
    }
  }
}

function cleanTransparentRgb(data) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) {
      data[i] = 0
      data[i + 1] = 0
      data[i + 2] = 0
    }
  }
}

const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const pixels = new Uint8Array(data)

floodFromEdges(pixels, info.width, info.height)
erodeFringe(pixels, info.width, info.height)

for (let pass = 0; pass < 3; pass += 1) {
  const dist = computeDistanceFromTransparent(pixels, info.width, info.height)
  repairEdgeFringe(pixels, info.width, info.height, dist)
  removeOuterGrayRing(pixels, info.width, info.height, dist)
}

softenBlackOutlines(pixels)
cleanTransparentRgb(pixels)

const out = await sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toBuffer()

writeFileSync(outputPath, out)

let transparent = 0
let nearBlack = 0
const w = info.width
const h = info.height
for (let y = 0; y < h; y += 1) {
  for (let x = 0; x < w; x += 1) {
    const i = idx(x, y, w)
    if (pixels[i + 3] < 10) {
      transparent += 1
      continue
    }
    if (pixels[i] < 20 && pixels[i + 1] < 20 && pixels[i + 2] < 20) nearBlack += 1
  }
}

console.log(
  `OK: ${w}x${h} — ${transparent}/${w * h} px transparent, ${nearBlack} near-black px left`,
)
