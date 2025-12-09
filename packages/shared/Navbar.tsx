import React, { FC } from 'react'

interface Breadcrumb {
  label: string
  href?: string
}

interface NavbarProps {
  breadcrumbs?: Breadcrumb[]
}

const Navbar: FC<NavbarProps> = ({ breadcrumbs }) => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <a href="/" style={styles.homeLink}>
            🏠 Home
          </a>
          {breadcrumbs && breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span style={styles.separator}>/</span>
              {crumb.href ? (
                <a href={crumb.href} style={styles.link}>
                  {crumb.label}
                </a>
              ) : (
                <span style={styles.currentPage}>{crumb.label}</span>
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
    backgroundColor: '#2c3e50',
    padding: '12px 0',
    borderBottom: '3px solid #3498db',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  } as const,
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 20px'
  } as const,
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    flexWrap: 'wrap',
    gap: '0 5px'
  } as const,
  homeLink: {
    color: '#3498db',
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
    color: '#7f8c8d',
    margin: '0 2px'
  } as const,
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    transition: 'color 0.2s',
    padding: '6px 8px',
    borderRadius: '4px',
    cursor: 'pointer'
  } as const,
  currentPage: {
    color: '#95a5a6',
    padding: '6px 8px'
  } as const
}

export default Navbar
