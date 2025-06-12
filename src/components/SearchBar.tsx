'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { createDebouncedSearch } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string, signal: AbortSignal) => Promise<void>;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const debouncedSearchRef = useRef(createDebouncedSearch());

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      debouncedSearchRef.current.cancel();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      debouncedSearchRef.current.search(onSearch, value.trim(), 500);
    } else {
      debouncedSearchRef.current.cancel();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Cancel debounced search and execute immediately
      debouncedSearchRef.current.cancel();
      const controller = new AbortController();
      onSearch(query.trim(), controller.signal).catch((error) => {
        if (error.message !== 'Request was cancelled') {
          console.error('Search error:', error);
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" data-testid="loading-spinner" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          role="searchbox"
          placeholder="Search Pokemon by name or ID..."
          value={query}
          onChange={handleInputChange}
          className="block w-full pl-10 pr-3 py-2 border text-gray-700 border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />
      </div>
    </form>
  );
}
