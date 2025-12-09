import React, { FC, ChangeEvent, DragEvent, useState } from 'react'
import { parseFile } from '../utils/fileParser'
import { ParsedData } from '../types'

interface FileUploadProps {
  onDataLoaded: (data: ParsedData) => void
  isLoading: boolean
}

const FileUpload: FC<FileUploadProps> = ({ onDataLoaded, isLoading }) => {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    setError(null)

    // Validate file type
    const validExtensions = ['csv', 'xlsx', 'xls']
    const extension = file.name.split('.').pop()?.toLowerCase()

    if (!validExtensions.includes(extension || '')) {
      setError(`Invalid file type. Please upload CSV, XLSX, or XLS files.`)
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError('File size exceeds 10MB limit.')
      return
    }

    try {
      const data = await parseFile(file)
      onDataLoaded(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse file'
      setError(errorMessage)
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.dropZone,
          ...(dragOver ? styles.dropZoneActive : {}),
          ...(isLoading ? styles.dropZoneDisabled : {})
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div style={styles.icon}>📁</div>
        <h3 style={styles.title}>Upload Your Data</h3>
        <p style={styles.subtitle}>
          Drag and drop your file here or click to browse
        </p>
        <p style={styles.formats}>
          Supported formats: <strong>CSV, XLSX, XLS</strong>
        </p>
        <p style={styles.size}>Max file size: <strong>10 MB</strong></p>

        <input
          type="file"
          id="file-input"
          onChange={handleFileInputChange}
          accept=".csv,.xlsx,.xls"
          style={styles.hiddenInput}
          disabled={isLoading}
        />

        <label htmlFor="file-input" style={styles.browseButton}>
          {isLoading ? 'Processing...' : 'Browse Files'}
        </label>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <p style={styles.errorTitle}>⚠️ Error</p>
          <p style={styles.errorMessage}>{error}</p>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '30px 20px',
    maxWidth: '800px',
    margin: '0 auto'
  } as const,
  dropZone: {
    border: '3px dashed #3498db',
    borderRadius: '12px',
    padding: '60px 20px',
    textAlign: 'center' as const,
    backgroundColor: '#f0f7ff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '30px'
  } as any,
  dropZoneActive: {
    borderColor: '#2980b9',
    backgroundColor: '#e7f3ff',
    boxShadow: '0 4px 12px rgba(52, 152, 219, 0.2)'
  } as const,
  dropZoneDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  } as const,
  icon: {
    fontSize: '48px',
    marginBottom: '15px'
  } as const,
  title: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333'
  } as const,
  subtitle: {
    margin: '0 0 15px 0',
    fontSize: '16px',
    color: '#666'
  } as const,
  formats: {
    margin: '10px 0',
    fontSize: '14px',
    color: '#555'
  } as const,
  size: {
    margin: '5px 0 20px 0',
    fontSize: '14px',
    color: '#666'
  } as const,
  hiddenInput: {
    display: 'none'
  } as const,
  browseButton: {
    display: 'inline-block',
    padding: '12px 32px',
    backgroundColor: '#3498db',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  } as const,
  errorBox: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px'
  } as const,
  errorTitle: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#856404'
  } as const,
  errorMessage: {
    margin: 0,
    fontSize: '14px',
    color: '#856404',
    lineHeight: '1.5'
  } as const
}

export default FileUpload
