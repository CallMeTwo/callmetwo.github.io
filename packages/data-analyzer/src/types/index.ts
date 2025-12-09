// Type definitions for Data Analyzer

export interface DataRow {
  [key: string]: string | number | boolean | null | undefined
}

export interface ParsedData {
  columns: string[]
  rows: DataRow[]
  rowCount: number
  columnCount: number
}

export interface VariableType {
  name: string
  type: 'continuous' | 'categorical' | 'datetime' | 'id'
  inferredType: 'continuous' | 'categorical' | 'datetime' | 'id'
  sampleValues: (string | number | boolean)[]
  uniqueCount: number
  includeInAnalysis: boolean
}

export interface AnalysisState {
  parsedData: ParsedData | null
  variables: VariableType[]
  currentStep: 'upload' | 'exploration' | 'summary' | 'visualization' | 'test-selection' | 'results'
  error: string | null
}
