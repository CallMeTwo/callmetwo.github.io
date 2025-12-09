import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { ParsedData, DataRow } from '../types'

/**
 * Parse file based on extension
 */
export const parseFile = (file: File): Promise<ParsedData> => {
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (extension === 'csv') {
    return parseCSV(file)
  } else if (['xlsx', 'xls'].includes(extension || '')) {
    return parseExcel(file)
  } else {
    throw new Error(`Unsupported file format: .${extension}`)
  }
}

/**
 * Parse CSV file using PapaParse
 */
export const parseCSV = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        try {
          const rows = results.data as DataRow[]
          const columns = Object.keys(rows[0] || {})

          if (rows.length === 0 || columns.length === 0) {
            throw new Error('File is empty or has no data')
          }

          resolve({
            columns,
            rows: rows.filter(row => Object.values(row).some(v => v)), // Remove empty rows
            rowCount: rows.length,
            columnCount: columns.length
          })
        } catch (error) {
          reject(error)
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`))
      }
    })
  })
}

/**
 * Parse Excel file (xlsx/xls) using XLSX
 */
export const parseExcel = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'array' })

        // Use first sheet
        const sheetName = workbook.SheetNames[0]
        if (!sheetName) {
          throw new Error('No sheets found in workbook')
        }

        const worksheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(worksheet) as DataRow[]

        if (rows.length === 0) {
          throw new Error('Sheet is empty')
        }

        const columns = Object.keys(rows[0] || {})

        if (columns.length === 0) {
          throw new Error('No columns found in sheet')
        }

        resolve({
          columns,
          rows: rows.filter(row => Object.values(row).some(v => v)), // Remove empty rows
          rowCount: rows.length,
          columnCount: columns.length
        })
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to parse Excel file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Infer variable type from column data
 */
export const inferVariableType = (
  columnName: string,
  values: (string | number | boolean | null | undefined)[],
  uniqueCount: number
): 'continuous' | 'categorical' | 'boolean' | 'datetime' | 'id' => {
  // Filter out null/undefined values
  const nonNullValues = values.filter(v => v !== null && v !== undefined)

  if (nonNullValues.length === 0) {
    return 'categorical'
  }

  // Check for boolean
  const booleanValues = new Set(['true', 'false', 'yes', 'no', '0', '1', 'T', 'F', 'Y', 'N'])
  if (nonNullValues.every(v => booleanValues.has(String(v).toLowerCase()))) {
    return 'boolean'
  }

  // Check for ID (high cardinality, often string)
  if (uniqueCount === nonNullValues.length) {
    return 'id'
  }

  // Check for datetime
  const datetimePattern = /^\d{4}-\d{2}-\d{2}|^\d{1,2}\/\d{1,2}\/\d{2,4}/
  if (nonNullValues.every(v => datetimePattern.test(String(v)))) {
    return 'datetime'
  }

  // Check for continuous (numeric)
  const numericValues = nonNullValues.filter(v => !isNaN(Number(v)))
  if (numericValues.length / nonNullValues.length > 0.9) {
    // More than 90% numeric and many unique values
    if (uniqueCount > 10) {
      return 'continuous'
    }
  }

  // Default to categorical
  return 'categorical'
}

/**
 * Get sample values from column
 */
export const getSampleValues = (
  values: (string | number | boolean | null | undefined)[],
  count: number = 3
): (string | number | boolean)[] => {
  return values
    .filter(v => v !== null && v !== undefined)
    .slice(0, count) as (string | number | boolean)[]
}
