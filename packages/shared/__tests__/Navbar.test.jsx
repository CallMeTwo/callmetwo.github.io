import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Navbar from '../Navbar.jsx'

describe('Navbar Component', () => {
  it('should render home link', () => {
    render(<Navbar breadcrumbs={[]} />)
    const homeLink = screen.getByText(/🏠 Home/)
    expect(homeLink).toBeInTheDocument()
  })

  it('should render breadcrumb items', () => {
    const breadcrumbs = [
      { label: 'Dashboard' },
      { label: 'Settings' }
    ]
    render(<Navbar breadcrumbs={breadcrumbs} />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should render links with href', () => {
    const breadcrumbs = [
      { label: 'Dashboard', href: '/dashboard' }
    ]
    render(<Navbar breadcrumbs={breadcrumbs} />)

    const link = screen.getByText('Dashboard').closest('a')
    expect(link).toHaveAttribute('href', '/dashboard')
  })

  it('should render current page without link', () => {
    const breadcrumbs = [
      { label: 'Current Page' }
    ]
    render(<Navbar breadcrumbs={breadcrumbs} />)

    const currentPage = screen.getByText('Current Page')
    expect(currentPage.tagName).not.toBe('A')
  })

  it('should handle empty breadcrumbs', () => {
    render(<Navbar breadcrumbs={[]} />)
    const homeLink = screen.getByText(/🏠 Home/)
    expect(homeLink).toBeInTheDocument()
  })

  it('should handle undefined breadcrumbs', () => {
    render(<Navbar />)
    const homeLink = screen.getByText(/🏠 Home/)
    expect(homeLink).toBeInTheDocument()
  })

  it('should have sticky positioning', () => {
    const { container } = render(<Navbar breadcrumbs={[]} />)
    const nav = container.querySelector('nav')
    const styles = window.getComputedStyle(nav)
    expect(styles.position).toBe('sticky')
  })
})
