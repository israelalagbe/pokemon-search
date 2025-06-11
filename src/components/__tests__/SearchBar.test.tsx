import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

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

  it('calls onSearch when form is submitted', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Search Pokemon by name or ID...');
    const form = screen.getByRole('searchbox').closest('form');
    
    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.submit(form!);
    
    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });

  it('trims whitespace from search query', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Search Pokemon by name or ID...');
    const form = screen.getByRole('searchbox').closest('form');
    
    fireEvent.change(input, { target: { value: '  pikachu  ' } });
    fireEvent.submit(form!);
    
    expect(mockOnSearch).toHaveBeenCalledWith('pikachu');
  });

  it('does not call onSearch with empty query', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);
    
    const form = screen.getByRole('searchbox').closest('form');
    fireEvent.submit(form!);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('disables input when loading', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);
    
    const input = screen.getByPlaceholderText('Search Pokemon by name or ID...');
    expect(input).toBeDisabled();
  });
});
