import React from 'react'

// Error Boundary Component for rendering errors
class RenderErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Render error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          backgroundColor: '#fee',
          border: '2px solid #c33',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          fontFamily: 'monospace',
          fontSize: '12px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          color: '#c33'
        }}>
          <h4 style={{ marginTop: 0, color: '#c33' }}>❌ Rendering Error</h4>
          <code>{this.state.error?.message || 'Unknown error'}</code>
          <pre style={{ marginTop: '10px', fontSize: '10px' }}>{this.state.error?.stack}</pre>
        </div>
      )
    }

    return this.props.children
  }
}

export { RenderErrorBoundary }
export default RenderErrorBoundary
