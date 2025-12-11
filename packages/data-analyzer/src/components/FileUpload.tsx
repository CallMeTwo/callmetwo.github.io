import React, { FC, ChangeEvent, DragEvent, useState } from 'react'
import { parseFile } from '../utils/fileParser'
import { ParsedData } from '../types'
import { useTheme } from '../contexts/ThemeContext'

interface FileUploadProps {
  onDataLoaded: (data: ParsedData) => void
  isLoading: boolean
}

const FileUpload: FC<FileUploadProps> = ({ onDataLoaded, isLoading }) => {
  const { colors } = useTheme()
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

  const handleSampleDataLoad = async (filename: string) => {
    setError(null)

    try {
      // Use import.meta.env.BASE_URL to get the correct base path
      const basePath = import.meta.env.BASE_URL
      const response = await fetch(`${basePath}${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load sample data: ${response.statusText}`)
      }

      const blob = await response.blob()
      const file = new File([blob], filename, {
        type: filename.endsWith('.csv') ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      await handleFileSelect(file)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sample data'
      setError(errorMessage)
    }
  }

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.dropZone,
          border: `3px dashed ${colors.primary}`,
          backgroundColor: colors.primary + '10',
          ...(dragOver ? {
            borderColor: colors.primary,
            backgroundColor: colors.primary + '20',
            boxShadow: `0 4px 12px ${colors.primary}33`
          } : {}),
          ...(isLoading ? styles.dropZoneDisabled : {})
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div style={styles.icon}>📁</div>
        <h3 style={{
          ...styles.title,
          color: colors.text.primary
        }}>Upload Your Data</h3>
        <p style={{
          ...styles.subtitle,
          color: colors.text.secondary
        }}>
          Drag and drop your file here or click to browse
        </p>
        <p style={{
          ...styles.formats,
          color: colors.text.secondary
        }}>
          Supported formats: <strong>CSV, XLSX, XLS</strong>
        </p>
        <p style={{
          ...styles.size,
          color: colors.text.secondary
        }}>Max file size: <strong>10 MB</strong></p>

        <input
          type="file"
          id="file-input"
          onChange={handleFileInputChange}
          accept=".csv,.xlsx,.xls"
          style={styles.hiddenInput}
          disabled={isLoading}
        />

        <label htmlFor="file-input" style={{
          ...styles.browseButton,
          backgroundColor: colors.primary
        }}>
          {isLoading ? 'Processing...' : 'Browse Files'}
        </label>
      </div>

      {error && (
        <div style={{
          ...styles.errorBox,
          backgroundColor: colors.warning + '20',
          border: `1px solid ${colors.warning}`
        }}>
          <p style={{
            ...styles.errorTitle,
            color: colors.text.primary
          }}>⚠️ Error</p>
          <p style={{
            ...styles.errorMessage,
            color: colors.text.primary
          }}>{error}</p>
        </div>
      )}

      {/* Sample Data Section */}
      <div style={styles.sampleSection}>
        <h3 style={{
          ...styles.sampleTitle,
          color: colors.text.primary
        }}>Or try with sample data:</h3>
        <div style={styles.sampleCards}>
          <div
            style={{
              ...styles.sampleCard,
              backgroundColor: colors.background,
              border: `2px solid ${colors.border}`
            }}
            onClick={() => !isLoading && handleSampleDataLoad('small_dataset.csv')}
          >
            <div style={styles.cardIcon}>📄</div>
            <h4 style={{
              ...styles.cardTitle,
              color: colors.text.primary
            }}>Small Dataset</h4>
            <p style={{
              ...styles.cardDescription,
              color: colors.text.secondary
            }}>CSV format • ~10 rows</p>
            <p style={{
              ...styles.cardDescription,
              color: colors.text.secondary
            }}>Basic example for quick testing</p>
          </div>

          <div
            style={{
              ...styles.sampleCard,
              backgroundColor: colors.background,
              border: `2px solid ${colors.border}`
            }}
            onClick={() => !isLoading && handleSampleDataLoad('large_dataset.xlsx')}
          >
            <div style={styles.cardIcon}>📊</div>
            <h4 style={{
              ...styles.cardTitle,
              color: colors.text.primary
            }}>Large Dataset</h4>
            <p style={{
              ...styles.cardDescription,
              color: colors.text.secondary
            }}>Excel format • ~1000 rows</p>
            <p style={{
              ...styles.cardDescription,
              color: colors.text.secondary
            }}>Comprehensive analysis example</p>
          </div>
        </div>
      </div>
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
    borderRadius: '12px',
    padding: '60px 20px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '30px'
  } as React.CSSProperties,
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
    fontWeight: 'bold'
  } as const,
  subtitle: {
    margin: '0 0 15px 0',
    fontSize: '16px'
  } as const,
  formats: {
    margin: '10px 0',
    fontSize: '14px'
  } as const,
  size: {
    margin: '5px 0 20px 0',
    fontSize: '14px'
  } as const,
  hiddenInput: {
    display: 'none'
  } as const,
  browseButton: {
    display: 'inline-block',
    padding: '12px 32px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  } as const,
  errorBox: {
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px'
  } as const,
  errorTitle: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: '600'
  } as const,
  errorMessage: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.5'
  } as const,
  sampleSection: {
    marginTop: '40px'
  } as const,
  sampleTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: '600',
    textAlign: 'center' as const
  } as const,
  sampleCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  } as const,
  sampleCard: {
    borderRadius: '8px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center' as const
  } as const,
  cardIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  } as const,
  cardTitle: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: '600'
  } as const,
  cardDescription: {
    margin: '4px 0',
    fontSize: '13px'
  } as const
}

export default FileUpload
