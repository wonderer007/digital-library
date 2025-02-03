import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Home } from '../components/Home'
import { supabase } from '../lib/supabase'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        range: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({
            data: [
              {
                id: 1,
                gutenberg_id: '1234',
                metadata: { title: 'Test Book', author: 'Test Author' },
                created_at: '2024-01-01T00:00:00Z'
              }
            ],
            error: null
          })
        }))
      })),
      select: vi.fn(() => ({
        count: 'exact',
        head: true,
        data: null,
        error: null
      }))
    }))
  }
}))

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(<Home />)
    expect(screen.getByText('Loading books...')).toBeInTheDocument()
  })

  it('renders books after loading', async () => {
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument()
    })

    expect(supabase.from).toHaveBeenCalledWith('books')
  })

  it('handles error state', async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn(() => ({
        count: 'exact',
        head: true,
        error: new Error('Failed to fetch')
      }))
    }))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<Home />)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching books:',
        expect.any(Error)
      )
    })

    consoleSpy.mockRestore()
  })

  it('displays pagination controls correctly', async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn(() => ({
        head: true,
        data: null,
        error: null,
        count: 20 
      }))
    }))

    render(<Home />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument()
    })

    expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
    expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).not.toBeDisabled()

    const pageOne = screen.getByText('1')
    const pageTwo = screen.getByText('2')
    expect(pageOne).toHaveClass('bg-blue-600', 'text-white')
    expect(pageTwo).toHaveClass('bg-gray-100', 'text-gray-600')
  })
})