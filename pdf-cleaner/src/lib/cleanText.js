const TOP_ZONE_RATIO = 0.12
const BOTTOM_ZONE_RATIO = 0.12
const REPEAT_ZONE_THRESHOLD = 0.5
const PARAGRAPH_GAP_MULTIPLIER = 1.5

const PAGE_NUMBER_PATTERNS = [
  /^\d+$/,
  /^page\s+\d+(\s+of\s+\d+)?$/i,
  /^-\s*\d+\s*-$/,
  /^\[\s*\d+\s*\]$/,
]

function median(numbers) {
  if (numbers.length === 0) return 0
  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

/** Typical body line-to-line gap, computed once from already-stripped
 * lines across the whole document so a short page (or one distorted by
 * a leftover header/footer) can't skew its own paragraph-break threshold. */
function typicalLineGap(pages) {
  const gaps = []
  for (const page of pages) {
    for (let i = 1; i < page.lines.length; i++) {
      const gap = page.lines[i - 1].y - page.lines[i].y
      if (gap > 0) gaps.push(gap)
    }
  }
  return median(gaps) || 12
}

function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\d+/g, '#')
    .replace(/\s+/g, ' ')
}

function isPageNumberLine(text) {
  const trimmed = text.trim()
  return PAGE_NUMBER_PATTERNS.some((pattern) => pattern.test(trimmed))
}

/** Finds header/footer lines that repeat across most pages, by zone. */
function findRepeatedZoneLines(pages) {
  if (pages.length < 3) return new Set()

  const topCounts = new Map()
  const bottomCounts = new Map()

  for (const page of pages) {
    const topBoundary = page.pageHeight * (1 - TOP_ZONE_RATIO)
    const bottomBoundary = page.pageHeight * BOTTOM_ZONE_RATIO

    const topLine = page.lines.find((line) => line.y >= topBoundary)
    const bottomLine = [...page.lines].reverse().find((line) => line.y <= bottomBoundary)

    if (topLine) {
      const key = normalize(topLine.text)
      topCounts.set(key, (topCounts.get(key) || 0) + 1)
    }
    if (bottomLine) {
      const key = normalize(bottomLine.text)
      bottomCounts.set(key, (bottomCounts.get(key) || 0) + 1)
    }
  }

  const repeated = new Set()
  const threshold = Math.max(2, Math.ceil(pages.length * REPEAT_ZONE_THRESHOLD))
  for (const [key, count] of topCounts) {
    if (count >= threshold) repeated.add(key)
  }
  for (const [key, count] of bottomCounts) {
    if (count >= threshold) repeated.add(key)
  }
  return repeated
}

function stripHeadersFootersAndPageNumbers(pages) {
  const repeated = findRepeatedZoneLines(pages)
  // A repeated header line is often the document's title rendered on every
  // page (a common running-header convention) — keep its first occurrence
  // instead of deleting the title outright. Footers never carry content
  // worth keeping, so every repeated occurrence is dropped.
  const keptHeaderKeys = new Set()

  return pages.map((page) => {
    const topBoundary = page.pageHeight * (1 - TOP_ZONE_RATIO)
    const bottomBoundary = page.pageHeight * BOTTOM_ZONE_RATIO

    const lines = page.lines.filter((line) => {
      const inTopZone = line.y >= topBoundary
      const inBottomZone = line.y <= bottomBoundary
      if (!inTopZone && !inBottomZone) return true
      if (isPageNumberLine(line.text)) return false

      const key = normalize(line.text)
      if (!repeated.has(key)) return true
      if (inBottomZone) return false

      if (keptHeaderKeys.has(key)) return false
      keptHeaderKeys.add(key)
      return true
    })

    return { ...page, lines }
  })
}

/** Joins a page's lines into paragraphs based on vertical gaps and hyphenation. */
function linesToParagraphs(lines, typicalLineGap) {
  const paragraphs = []
  let buffer = ''
  let prevY = null

  const flush = () => {
    const trimmed = buffer.trim()
    if (trimmed) paragraphs.push(trimmed)
    buffer = ''
  }

  for (const line of lines) {
    const text = line.text.trim()
    if (!text) continue

    const isNewParagraph =
      prevY !== null && prevY - line.y > typicalLineGap * PARAGRAPH_GAP_MULTIPLIER

    if (isNewParagraph) flush()

    if (!buffer) {
      buffer = text
    } else if (/[a-z]-$/.test(buffer) && /^[a-z]/.test(text)) {
      buffer = buffer.slice(0, -1) + text
    } else {
      buffer += ' ' + text
    }

    prevY = line.y
  }
  flush()

  return paragraphs
}

function dedupeConsecutiveParagraphs(paragraphs) {
  const result = []
  for (const paragraph of paragraphs) {
    const prev = result[result.length - 1]
    if (prev && prev.toLowerCase() === paragraph.toLowerCase()) continue
    result.push(paragraph)
  }
  return result
}

/**
 * Turns raw per-page/per-line PDF extraction output into clean,
 * readable text: strips repeated headers/footers/page numbers,
 * rejoins hyphenated and hard-wrapped lines into real paragraphs,
 * and removes obvious duplicate titles.
 */
export function cleanExtractedPages(pages) {
  const strippedPages = stripHeadersFootersAndPageNumbers(pages)
  const gap = typicalLineGap(strippedPages)

  let paragraphs = []
  for (const page of strippedPages) {
    paragraphs.push(...linesToParagraphs(page.lines, gap))
  }

  paragraphs = dedupeConsecutiveParagraphs(paragraphs)

  return paragraphs.join('\n\n')
}
