import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const SAME_LINE_EPSILON = 2
const WORD_GAP_RATIO = 0.25

function groupItemsIntoLines(items) {
  const lines = []
  let current = null

  for (const item of items) {
    if (!item.str) continue
    const x = item.transform[4]
    const y = item.transform[5]
    const height = item.height || Math.abs(item.transform[3]) || 10
    const width = item.width || 0

    if (current && Math.abs(current.y - y) <= SAME_LINE_EPSILON) {
      const gap = x - current.endX
      current.parts.push(gap > width * WORD_GAP_RATIO && gap > 1 ? ' ' + item.str : item.str)
      current.endX = x + width
      current.height = Math.max(current.height, height)
    } else {
      current = { y, endX: x + width, height, parts: [item.str] }
      lines.push(current)
    }
  }

  return lines
    .map((line) => ({ y: line.y, height: line.height, text: line.parts.join('').replace(/\s+/g, ' ').trim() }))
    .filter((line) => line.text.length > 0)
}

/**
 * Extracts text from a PDF as an array of pages, each with its lines
 * (with vertical position and page height) so the cleaner can reason
 * about headers, footers, and paragraph breaks.
 */
export async function extractPdfPages(arrayBuffer) {
  const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages = []

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum)
    const [, y0, , y1] = page.view
    const pageHeight = y1 - y0
    const content = await page.getTextContent()
    const lines = groupItemsIntoLines(content.items).sort((a, b) => b.y - a.y)
    pages.push({ pageHeight, lines })
  }

  await doc.destroy()
  return pages
}
