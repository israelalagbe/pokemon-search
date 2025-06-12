import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

// Mock the createDebouncedSearch utility
jest.mock('@/lib/utils', () => ({
  createDebouncedSearch: () => ({
    search: jest.fn(),
    cancel: jest.fn(),
  }),
}));

describe('SearchBar', () => {
  const mockOnSearch = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    expect(screen.getByPlaceholderText('Search Pokemon by name or ID...')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted', async () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Search Pokemon by name or ID...');
    const form = screen.getByRole('searchbox').closest('form');
    
    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.submit(form!);
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('pikachu', expect.any(AbortSignal));
    });
  });

  it('trims whitespace from search query', async () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Search Pokemon by name or ID...');
    const form = screen.getByRole('searchbox').closest('form');
    
    fireEvent.change(input, { target: { value: '  pikachu  ' } });
    fireEvent.submit(form!);
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('pikachu', expect.any(AbortSignal));
    });
  });

  it('does not call onSearch with empty query', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const form = screen.getByRole('searchbox').closest('form');
    fireEvent.submit(form!);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});
