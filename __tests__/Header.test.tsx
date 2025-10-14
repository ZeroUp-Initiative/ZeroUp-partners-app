
import { render, screen } from '@testing-library/react'
import Header from '@/components/layout/header'

describe('Header', () => {
  it('renders the title and subtitle', () => {
    render(<Header title="Test Title" subtitle="Test Subtitle" />)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })
})
