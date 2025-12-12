import React, { FC } from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface Breadcrumb {
  label: string
  href?: string
}

interface ThemedNavbarProps {
  breadcrumbs?: Breadcrumb[]
}

const ThemedNavbar: FC<ThemedNavbarProps> = ({ breadcrumbs }) => {
  const { colors } = useTheme()

  return (
    <nav style={{
      ...styles.navbar,
      backgroundColor: colors.surface,
      borderBottom: `3px solid ${colors.primary}`
    }}>
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <a href="/" style={{
            ...styles.homeLink,
            color: colors.primary
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary + '20'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🏠 Home
          </a>
          {breadcrumbs && breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span style={{
                ...styles.separator,
                color: colors.text.secondary
              }}>/</span>
              {crumb.href ? (
                <a href={crumb.href} style={{
                  ...styles.link,
                  color: colors.text.primary
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.text.primary}
                >
                  {crumb.label}
                </a>
              ) : (
                <span style={{
                  ...styles.currentPage,
                  color: colors.text.secondary
                }}>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    padding: '12px 0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 20px'
  } as const,
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    flexWrap: 'wrap' as const,
    gap: '0 5px'
  },
  homeLink: {
    textDecoration: 'none',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    cursor: 'pointer'
  } as const,
  separator: {
    margin: '0 2px'
  } as const,
  link: {
    textDecoration: 'none',
    transition: 'color 0.2s',
    padding: '6px 8px',
    borderRadius: '4px',
    cursor: 'pointer'
  } as const,
  currentPage: {
    padding: '6px 8px'
  } as const
}

export default ThemedNavbar
