import { useCallback, useRef, useState } from 'react'
import { extractPdfPages } from './lib/extractText.js'
import { cleanExtractedPages } from './lib/cleanText.js'

const STATUS = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  DONE: 'done',
  ERROR: 'error',
}

export default function App() {
  const [status, setStatus] = useState(STATUS.IDLE)
  const [fileName, setFileName] = useState('')
  const [cleanedText, setCleanedText] = useState('')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)

  const processFile = useCallback(async (file) => {
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please drop a PDF file.')
      setStatus(STATUS.ERROR)
      return
    }

    setFileName(file.name)
    setStatus(STATUS.PROCESSING)
    setError('')

    try {
      const buffer = await file.arrayBuffer()
      const pages = await extractPdfPages(buffer)
      const text = cleanExtractedPages(pages)

      if (!text.trim()) {
        setError("Couldn't find any text in this PDF — it may be a scanned image without a text layer.")
        setStatus(STATUS.ERROR)
        return
      }

      setCleanedText(text)
      setStatus(STATUS.DONE)
    } catch (err) {
      console.error(err)
      setError('Something went wrong reading that PDF. Please try another file.')
      setStatus(STATUS.ERROR)
    }
  }, [])

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault()
      setIsDragging(false)
      processFile(event.dataTransfer.files?.[0])
    },
    [processFile],
  )

  const handleFileInput = useCallback(
    (event) => {
      processFile(event.target.files?.[0])
    },
    [processFile],
  )

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(cleanedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [cleanedText])

  const handleDownload = useCallback(() => {
    const blob = new Blob([cleanedText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const baseName = fileName.replace(/\.pdf$/i, '') || 'document'
    link.href = url
    link.download = `${baseName}-clean.txt`
    link.click()
    URL.revokeObjectURL(url)
  }, [cleanedText, fileName])

  const reset = useCallback(() => {
    setStatus(STATUS.IDLE)
    setCleanedText('')
    setFileName('')
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  return (
    <div className="page">
      <header className="header">
        <h1>PDF Cleaner</h1>
        <p>Drop a PDF, get clean readable text back — no headers, footers, page numbers, or broken line wraps.</p>
      </header>

      {status !== STATUS.DONE && (
        <div
          className={`dropzone ${isDragging ? 'dropzone--active' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileInput}
            hidden
          />
          {status === STATUS.PROCESSING ? (
            <p>Cleaning {fileName}…</p>
          ) : (
            <>
              <p className="dropzone__title">Drop a PDF here, or click to choose one</p>
              <p className="dropzone__hint">Text-based PDFs and articles work best.</p>
            </>
          )}
          {status === STATUS.ERROR && <p className="error">{error}</p>}
        </div>
      )}

      {status === STATUS.DONE && (
        <div className="result">
          <div className="result__toolbar">
            <span className="result__filename">{fileName}</span>
            <div className="result__actions">
              <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</button>
              <button onClick={handleDownload}>Download .txt</button>
              <button className="button--ghost" onClick={reset}>
                Clean another
              </button>
            </div>
          </div>
          <textarea className="preview" value={cleanedText} readOnly />
        </div>
      )}
    </div>
  )
}
