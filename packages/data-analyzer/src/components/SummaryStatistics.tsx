import React, { FC, useMemo, useState } from 'react'
import { ParsedData, VariableType } from '../types'
import {
  calculateContinuousStats,
  calculateCategoricalStats,
  calculateDateStats,
  floorDate,
  formatStatistic,
  interpretSkewness,
  interpretKurtosis,
  ContinuousStats,
  CategoricalStats,
  DateStats
} from '../utils/statistics'
import { useTheme } from '../contexts/ThemeContext'
import TooltipIcon from './TooltipIcon'
import QuartileDisplay from './QuartileDisplay'
import DateFloorSelector from './DateFloorSelector'

interface SummaryStatisticsProps {
  data: ParsedData
  variables: VariableType[]
  onContinue: () => void
  onBack: () => void
}

const SummaryStatistics: FC<SummaryStatisticsProps> = ({
  data,
  variables,
  onContinue,
  onBack
}) => {
  const { colors } = useTheme()
  // Filter only included variables
  const includedVariables = variables.filter(v => v.includeInAnalysis)

  // Track expanded/collapsed state for each card
  const [expandedCards, setExpandedCards] = useState<Set<string>>(
    new Set(includedVariables.map(v => v.name)) // All expanded by default
  )

  const toggleCard = (variableName: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(variableName)) {
        newSet.delete(variableName)
      } else {
        newSet.add(variableName)
      }
      return newSet
    })
  }

  // Calculate statistics for all included variables
  const statistics = useMemo(() => {
    return includedVariables.map(variable => {
      const columnValues = data.rows.map(row => row[variable.name])

      if (variable.type === 'continuous') {
        return {
          variable,
          stats: calculateContinuousStats(columnValues),
          type: 'continuous' as const
        }
      } else if (variable.type === 'datetime') {
        return {
          variable,
          stats: calculateDateStats(columnValues as string[]),
          type: 'datetime' as const
        }
      } else {
        return {
          variable,
          stats: calculateCategoricalStats(columnValues),
          type: 'categorical' as const
        }
      }
    })
  }, [data, includedVariables])

  const continuousStats = statistics.filter(s => s.type === 'continuous')
  const categoricalStats = statistics.filter(s => s.type === 'categorical')
  const dateStats = statistics.filter(s => s.type === 'datetime')

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.header,
        borderBottom: `2px solid ${colors.border}`
      }}>
        <h2 style={{
          ...styles.title,
          color: colors.text.primary
        }}>Summary Statistics</h2>
        <p style={{
          ...styles.subtitle,
          color: colors.text.secondary
        }}>
          Descriptive statistics for {includedVariables.length} variables ({continuousStats.length} continuous, {categoricalStats.length} categorical, {dateStats.length} date)
        </p>
      </div>

      {/* Continuous Variables */}
      {continuousStats.length > 0 && (
        <div style={styles.section}>
          <h3 style={{
            ...styles.sectionTitle,
            color: colors.text.primary
          }}>📈 Continuous Variables</h3>
          {continuousStats.map(({ variable, stats }) => (
            <ContinuousStatsCard
              key={variable.name}
              variableName={variable.name}
              stats={stats as ContinuousStats}
              isExpanded={expandedCards.has(variable.name)}
              onToggle={() => toggleCard(variable.name)}
              colors={colors}
            />
          ))}
        </div>
      )}

      {/* Categorical Variables */}
      {categoricalStats.length > 0 && (
        <div style={styles.section}>
          <h3 style={{
            ...styles.sectionTitle,
            color: colors.text.primary
          }}>📊 Categorical Variables</h3>
          {categoricalStats.map(({ variable, stats }) => (
            <CategoricalStatsCard
              key={variable.name}
              variableName={variable.name}
              stats={stats as CategoricalStats}
              isExpanded={expandedCards.has(variable.name)}
              onToggle={() => toggleCard(variable.name)}
              colors={colors}
            />
          ))}
        </div>
      )}

      {/* Date/DateTime Variables */}
      {dateStats.length > 0 && (
        <div style={styles.section}>
          <h3 style={{
            ...styles.sectionTitle,
            color: colors.text.primary
          }}>📅 Date/DateTime Variables</h3>
          {dateStats.map(({ variable, stats }) => (
            <DateStatsCard
              key={variable.name}
              variableName={variable.name}
              stats={stats as DateStats}
              isExpanded={expandedCards.has(variable.name)}
              onToggle={() => toggleCard(variable.name)}
              data={data}
              colors={colors}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{
        ...styles.actions,
        borderTop: `2px solid ${colors.border}`
      }}>
        <button style={{
          ...styles.backButton,
          backgroundColor: colors.surface,
          color: colors.text.primary,
          border: `1px solid ${colors.border}`
        }} onClick={onBack}>
          ← Back
        </button>
        <button style={{
          ...styles.continueButton,
          backgroundColor: colors.primary
        }} onClick={onContinue}>
          Continue to Visualization →
        </button>
      </div>
    </div>
  )
}

interface ContinuousStatsCardProps {
  variableName: string
  stats: ContinuousStats
  isExpanded: boolean
  onToggle: () => void
  colors: any
}

const ContinuousStatsCard: FC<ContinuousStatsCardProps> = ({ variableName, stats, isExpanded, onToggle, colors }) => {
  return (
    <div style={{
      ...styles.card,
      backgroundColor: colors.background,
      border: `2px solid ${colors.border}`
    }}>
      <div style={{
        ...styles.cardHeader,
        borderBottom: `1px solid ${colors.border}`
      }} onClick={onToggle}>
        <div style={styles.cardHeaderLeft}>
          <span style={{
            ...styles.expandIcon,
            color: colors.text.secondary
          }}>{isExpanded ? '▼' : '▶'}</span>
          <h4 style={{
            ...styles.variableName,
            color: colors.text.primary
          }}>{variableName}</h4>
        </div>
        <span style={{
          ...styles.badge,
          backgroundColor: colors.primary + '20',
          color: colors.text.primary
        }}>Continuous</span>
      </div>

      {isExpanded && (
        <div style={styles.statsGrid}>
        {/* Basic stats */}
        <div style={{
          ...styles.statsGroup,
          backgroundColor: colors.surface
        }}>
          <h5 style={{
            ...styles.groupTitle,
            color: colors.text.secondary
          }}>Basic Statistics</h5>
          <div style={{
            ...styles.statRow,
            borderBottom: `1px solid ${colors.border}`
          }}>
            <span style={{
              ...styles.statLabel,
              color: colors.text.secondary
            }}>Count:</span>
            <span style={{
              ...styles.statValue,
              color: colors.text.primary
            }}>{stats.count}</span>
          </div>
          <div style={{
            ...styles.statRow,
            borderBottom: `1px solid ${colors.border}`
          }}>
            <span style={{
              ...styles.statLabel,
              color: colors.text.secondary
            }}>Missing:</span>
            <span style={{
              ...styles.statValue,
              color: colors.text.primary
            }}>{stats.missing}</span>
          </div>
          <div style={{
            ...styles.statRow,
            borderBottom: `1px solid ${colors.border}`
          }}>
            <span style={{
              ...styles.statLabel,
              color: colors.text.secondary
            }}>Mean:</span>
            <span style={{
              ...styles.statValue,
              color: colors.text.primary
            }}>{formatStatistic(stats.mean)}</span>
          </div>
          <div style={{
            ...styles.statRow,
            borderBottom: `1px solid ${colors.border}`
          }}>
            <span style={{
              ...styles.statLabel,
              color: colors.text.secondary
            }}>Std Dev:</span>
            <span style={{
              ...styles.statValue,
              color: colors.text.primary
            }}>{formatStatistic(stats.sd)}</span>
          </div>
        </div>

        {/* Range & Quartiles - Compact Display */}
        <div style={{
          ...styles.statsGroup,
          backgroundColor: colors.surface
        }}>
          <h5 style={{
            ...styles.groupTitle,
            color: colors.text.secondary
          }}>Range & Quartiles</h5>
          <QuartileDisplay
            min={stats.min}
            q1={stats.q1}
            median={stats.median}
            q3={stats.q3}
            max={stats.max}
          />
          <div style={{
            ...styles.statRow,
            borderBottom: `1px solid ${colors.border}`
          }}>
            <span style={{
              ...styles.statLabel,
              color: colors.text.secondary
            }}>IQR:</span>
            <span style={{
              ...styles.statValue,
              color: colors.text.primary
            }}>{formatStatistic(stats.q3 - stats.q1)}</span>
          </div>
        </div>

        {/* Distribution */}
        <div style={{
          ...styles.statsGroup,
          backgroundColor: colors.surface
        }}>
          <h5 style={{
            ...styles.groupTitle,
            color: colors.text.secondary
          }}>Distribution</h5>
          <div style={{
            ...styles.statRow,
            borderBottom: `1px solid ${colors.border}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                ...styles.statLabel,
                color: colors.text.secondary
              }}>Skewness:</span>
              <TooltipIcon
                text="Measures symmetry. Values < -1: highly left-skewed | -1 to 1: fairly symmetric | > 1: highly right-skewed"
                placement="right"
                width={180}
              />
            </div>
            <span style={{
              ...styles.statValue,
              color: colors.text.primary
            }}>{formatStatistic(stats.skewness)}</span>
          </div>
          <div style={{
            ...styles.statRow,
            borderBottom: `1px solid ${colors.border}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                ...styles.statLabel,
                color: colors.text.secondary
              }}>Kurtosis:</span>
              <TooltipIcon
                text="Measures tail heaviness relative to normal. < 0: lighter tails | 3: normal tails | > 3: heavier tails"
                placement="right"
                width={180}
              />
            </div>
            <span style={{
              ...styles.statValue,
              color: colors.text.primary
            }}>{formatStatistic(stats.kurtosis)}</span>
          </div>
        </div>

        {/* Normality Test */}
        {stats.normalityTest && (
          <div style={{
            ...styles.statsGroup,
            backgroundColor: colors.surface
          }}>
            <h5 style={{
              ...styles.groupTitle,
              color: colors.text.secondary
            }}>Normality Test</h5>
            <div style={{
              ...styles.statRow,
              borderBottom: `1px solid ${colors.border}`
            }}>
              <span style={{
                ...styles.statLabel,
                color: colors.text.secondary
              }}>Test:</span>
              <span style={{
                ...styles.statValue,
                color: colors.text.primary
              }}>{stats.normalityTest.testName}</span>
            </div>
            <div style={{
              ...styles.statRow,
              borderBottom: `1px solid ${colors.border}`
            }}>
              <span style={{
                ...styles.statLabel,
                color: colors.text.secondary
              }}>Statistic:</span>
              <span style={{
                ...styles.statValue,
                color: colors.text.primary
              }}>{formatStatistic(stats.normalityTest.statistic, 4)}</span>
            </div>
            <div style={{
              ...styles.statRow,
              borderBottom: `1px solid ${colors.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  ...styles.statLabel,
                  color: colors.text.secondary
                }}>p-value:</span>
                <TooltipIcon
                  text="p < 0.05: Data likely non-normal | p ≥ 0.05: Data could be normal"
                  placement="right"
                  width={160}
                />
              </div>
              <span style={{
                ...styles.statValue,
                color: colors.text.primary,
                ...(stats.normalityTest.pValue < 0.05 ? styles.pValueSignificant : styles.pValueNotSignificant)
              }}>
                {formatStatistic(stats.normalityTest.pValue, 4)}
              </span>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  )
}

type DateSortKey = 'date' | 'count' | 'percentage'
type SortDirectionType = 'asc' | 'desc' | 'none'

const DateStatsCard: FC<DateStatsCardProps> = ({ variableName, stats, isExpanded, onToggle, data, colors }) => {
  const [floorUnit, setFloorUnit] = useState<'year' | 'month' | 'week' | 'day'>('day')
  const [sortKey, setSortKey] = useState<DateSortKey>('date')
  const [sortDirection, setSortDirection] = useState<SortDirectionType>('asc')

  const formatDate = (date: Date | null): string => {
    if (!date) return 'N/A'
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const handleDateHeaderClick = (key: DateSortKey) => {
    if (sortKey === key) {
      // Toggle direction: asc -> desc -> asc
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New sort key, default to ascending
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  // Get frequency distribution based on floor unit
  const rawDateFrequencies = useMemo(() => {
    const columnValues = data.rows.map(row => row[variableName])
    const validDates = columnValues
      .filter(v => v !== null && v !== undefined && v !== '')
      .map(v => new Date(String(v)))
      .filter(d => !isNaN(d.getTime()))

    if (validDates.length === 0) return []

    // Floor dates and count frequencies
    const flooredMap = new Map<string, number>()
    validDates.forEach(date => {
      const floored = floorDate(date, floorUnit)
      const key = floored.toISOString().split('T')[0] // YYYY-MM-DD format
      flooredMap.set(key, (flooredMap.get(key) || 0) + 1)
    })

    // Convert to array
    return Array.from(flooredMap.entries())
      .map(([dateStr, count]) => ({
        date: new Date(dateStr),
        count,
        percentage: (count / validDates.length) * 100
      }))
  }, [data, variableName, floorUnit])

  // Sort the frequencies based on current sort state
  const getSortedDateFrequencies = () => {
    const frequencies = [...rawDateFrequencies]

    if (sortKey === 'date') {
      frequencies.sort((a, b) => {
        const comparison = a.date.getTime() - b.date.getTime()
        return sortDirection === 'asc' ? comparison : -comparison
      })
    } else if (sortKey === 'count') {
      frequencies.sort((a, b) => {
        const comparison = a.count - b.count
        return sortDirection === 'asc' ? comparison : -comparison
      })
    } else if (sortKey === 'percentage') {
      frequencies.sort((a, b) => {
        const comparison = a.percentage - b.percentage
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return frequencies.slice(0, 20)
  }

  const sortedDateFrequencies = getSortedDateFrequencies()
  const hasMoreDates = rawDateFrequencies.length > 20

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader} onClick={onToggle}>
        <div style={styles.cardHeaderLeft}>
          <span style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
          <h4 style={styles.variableName}>{variableName}</h4>
        </div>
        <span style={{ ...styles.badge, backgroundColor: '#f3e5f5' }}>Date/DateTime</span>
      </div>

      {isExpanded && (
        <div style={styles.statsGrid}>
          {/* Summary Statistics */}
          <div style={{ ...styles.statsGroup, gridColumn: '1 / -1' }}>
            <h5 style={styles.groupTitle}>Summary</h5>
            <table style={styles.frequencyTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Count</th>
                  <th style={styles.tableHeader}>Missing</th>
                  <th style={styles.tableHeader}>Min Date</th>
                  <th style={styles.tableHeader}>Max Date</th>
                  <th style={styles.tableHeader}>Mode</th>
                </tr>
              </thead>
              <tbody>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>{stats.count}</td>
                  <td style={styles.tableCell}>{stats.missing}</td>
                  <td style={styles.tableCell}>{formatDate(stats.min)}</td>
                  <td style={styles.tableCell}>{formatDate(stats.max)}</td>
                  <td style={styles.tableCell}>{formatDate(stats.mode)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Date Floor Unit Selector */}
          <div style={{ ...styles.statsGroup, gridColumn: '1 / -1' }}>
            <DateFloorSelector
              selectedFloor={floorUnit}
              onChange={setFloorUnit}
            />
          </div>

          {/* Frequency Distribution Table */}
          <div style={{ ...styles.statsGroup, gridColumn: '1 / -1' }}>
            <h5 style={styles.groupTitle}>Frequency Distribution</h5>
            <table style={styles.frequencyTable}>
              <thead>
                <tr>
                  <th
                    style={{
                      ...styles.tableHeader,
                      ...(sortKey === 'date' ? styles.tableHeaderActive : styles.tableHeaderHoverable)
                    }}
                    onClick={() => handleDateHeaderClick('date')}
                  >
                    Date {sortKey === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    style={{
                      ...styles.tableHeader,
                      ...(sortKey === 'count' ? styles.tableHeaderActive : styles.tableHeaderHoverable)
                    }}
                    onClick={() => handleDateHeaderClick('count')}
                  >
                    Count {sortKey === 'count' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    style={{
                      ...styles.tableHeader,
                      ...(sortKey === 'percentage' ? styles.tableHeaderActive : styles.tableHeaderHoverable)
                    }}
                    onClick={() => handleDateHeaderClick('percentage')}
                  >
                    Percentage {sortKey === 'percentage' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={styles.tableHeader}>Bar</th>
                </tr>
              </thead>
              <tbody>
                {sortedDateFrequencies.map((item, idx) => (
                  <tr key={idx} style={styles.tableRow}>
                    <td style={styles.tableCell}>{formatDate(item.date)}</td>
                    <td style={styles.tableCell}>{item.count}</td>
                    <td style={styles.tableCell}>{formatStatistic(item.percentage, 1)}%</td>
                    <td style={styles.tableCell}>
                      <div style={styles.barContainer}>
                        <div
                          style={{
                            ...styles.bar,
                            width: `${item.percentage}%`
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hasMoreDates && (
              <p style={styles.moreText}>
                ... and {rawDateFrequencies.length - 20} more dates
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface DateStatsCardProps {
  variableName: string
  stats: DateStats
  isExpanded: boolean
  onToggle: () => void
  data: ParsedData
  colors: any
}

interface CategoricalStatsCardProps {
  variableName: string
  stats: CategoricalStats
  isExpanded: boolean
  onToggle: () => void
  colors: any
}

type SortKey = 'value' | 'count' | 'percentage'
type SortDirection = 'asc' | 'desc' | 'none'

const CategoricalStatsCard: FC<CategoricalStatsCardProps> = ({ variableName, stats, isExpanded, onToggle, colors }) => {
  const [sortKey, setSortKey] = useState<SortKey>('count')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleHeaderClick = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New sort key
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const getSortedFrequencies = () => {
    const frequencies = [...stats.frequencies]

    if (sortKey === 'value') {
      frequencies.sort((a, b) => {
        const aStr = String(a.value).toLowerCase()
        const bStr = String(b.value).toLowerCase()
        return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
      })
    } else if (sortKey === 'count') {
      frequencies.sort((a, b) => {
        return sortDirection === 'asc' ? a.count - b.count : b.count - a.count
      })
    } else if (sortKey === 'percentage') {
      frequencies.sort((a, b) => {
        return sortDirection === 'asc' ? a.percentage - b.percentage : b.percentage - a.percentage
      })
    }

    return frequencies.slice(0, 10)
  }

  const topFrequencies = getSortedFrequencies()
  const hasMore = stats.frequencies.length > 10

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader} onClick={onToggle}>
        <div style={styles.cardHeaderLeft}>
          <span style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
          <h4 style={styles.variableName}>{variableName}</h4>
        </div>
        <span style={{ ...styles.badge, backgroundColor: '#f3e5f5' }}>Categorical</span>
      </div>

      {isExpanded && (
        <div style={styles.statsGrid}>
        {/* Basic info - Summary Table */}
        <div style={{ ...styles.statsGroup, gridColumn: '1 / -1' }}>
          <h5 style={styles.groupTitle}>Summary</h5>
          <table style={styles.frequencyTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Count</th>
                <th style={styles.tableHeader}>Missing</th>
                <th style={styles.tableHeader}>Unique Values</th>
                <th style={styles.tableHeader}>Mode</th>
              </tr>
            </thead>
            <tbody>
              <tr style={styles.tableRow}>
                <td style={styles.tableCell}>{stats.count}</td>
                <td style={styles.tableCell}>{stats.missing}</td>
                <td style={styles.tableCell}>{stats.uniqueCount}</td>
                <td style={styles.tableCell}>{String(stats.mode)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Frequency table */}
        <div style={{ ...styles.statsGroup, gridColumn: '1 / -1' }}>
          <h5 style={styles.groupTitle}>Frequency Distribution</h5>
          <table style={styles.frequencyTable}>
            <thead>
              <tr>
                <th
                  style={{
                    ...styles.tableHeader,
                    ...(sortKey === 'value' ? styles.tableHeaderActive : styles.tableHeaderHoverable)
                  }}
                  onClick={() => handleHeaderClick('value')}
                >
                  Value {sortKey === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  style={{
                    ...styles.tableHeader,
                    ...(sortKey === 'count' ? styles.tableHeaderActive : styles.tableHeaderHoverable)
                  }}
                  onClick={() => handleHeaderClick('count')}
                >
                  Count {sortKey === 'count' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  style={{
                    ...styles.tableHeader,
                    ...(sortKey === 'percentage' ? styles.tableHeaderActive : styles.tableHeaderHoverable)
                  }}
                  onClick={() => handleHeaderClick('percentage')}
                >
                  Percentage {sortKey === 'percentage' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th style={styles.tableHeader}>Bar</th>
              </tr>
            </thead>
            <tbody>
              {topFrequencies.map((item, idx) => (
                <tr key={idx} style={styles.tableRow}>
                  <td style={styles.tableCell}>{String(item.value)}</td>
                  <td style={styles.tableCell}>{item.count}</td>
                  <td style={styles.tableCell}>{formatStatistic(item.percentage, 1)}%</td>
                  <td style={styles.tableCell}>
                    <div style={styles.barContainer}>
                      <div
                        style={{
                          ...styles.bar,
                          width: `${item.percentage}%`
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {hasMore && (
            <p style={styles.moreText}>
              ... and {stats.frequencies.length - 10} more values
            </p>
          )}
        </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '30px 20px',
    maxWidth: '1400px',
    margin: '0 auto'
  } as const,
  header: {
    marginBottom: '15px',
    paddingBottom: '10px'
  } as const,
  title: {
    margin: '0 0 6px 0',
    fontSize: '28px',
    fontWeight: 'bold'
  } as const,
  subtitle: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.4'
  } as const,
  section: {
    marginBottom: '20px'
  } as const,
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '20px',
    fontWeight: '600'
  } as const,
  card: {
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px'
  } as const,
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    paddingBottom: '8px',
    cursor: 'pointer',
    userSelect: 'none'
  } as const,
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  } as const,
  expandIcon: {
    fontSize: '14px',
    fontWeight: 'bold'
  } as const,
  variableName: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600'
  } as const,
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  } as const,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '12px'
  } as const,
  statsGroup: {
    padding: '10px',
    borderRadius: '6px'
  } as const,
  groupTitle: {
    margin: '0 0 8px 0',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  } as const,
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '3px 0'
  } as const,
  statLabel: {
    fontSize: '13px'
  } as const,
  statValue: {
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'monospace'
  } as const,
  interpretText: {
    fontSize: '12px',
    fontStyle: 'italic',
    marginTop: '4px',
    marginBottom: '8px'
  } as const,
  testSubheader: {
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '8px',
    marginTop: '4px'
  } as const,
  normalityBadge: {
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: '10px'
  } as const,
  normalBadge: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32'
  } as const,
  nonNormalBadge: {
    backgroundColor: '#ffebee',
    color: '#c62828'
  } as const,
  pValueSignificant: {
    color: '#c62828',
    fontWeight: '700' as const
  } as const,
  pValueNotSignificant: {
    color: '#2e7d32',
    fontWeight: '700' as const
  } as const,
  frequencyTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px'
  } as const,
  tableHeader: {
    textAlign: 'left',
    padding: '6px 8px',
    fontWeight: '600'
  } as const,
  tableHeaderHoverable: {
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background-color 0.2s'
  } as const,
  tableHeaderActive: {
    cursor: 'pointer',
    userSelect: 'none',
    fontWeight: '700' as const
  } as const,
  tableRow: {
  } as const,
  tableCell: {
    padding: '6px 8px'
  } as const,
  barContainer: {
    width: '100%',
    height: '16px',
    borderRadius: '4px',
    overflow: 'hidden'
  } as const,
  bar: {
    height: '100%',
    transition: 'width 0.3s ease'
  } as const,
  moreText: {
    marginTop: '6px',
    fontSize: '12px',
    fontStyle: 'italic'
  } as const,
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    paddingTop: '12px',
    marginTop: '15px'
  } as const,
  backButton: {
    padding: '12px 24px',
    fontSize: '14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  } as const,
  continueButton: {
    padding: '12px 24px',
    fontSize: '14px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  } as const
}

export default SummaryStatistics
