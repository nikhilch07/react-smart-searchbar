import { useState } from 'react';
import { SearchBar } from '../lib/components/SearchBar/SearchBar';

const cities = [
  'Phoenix',
  'New York',
  'San Francisco',
  'Seattle',
  'Austin',
  'Chicago',
  'Los Angeles',
  'Denver',
];

export function DemoPage() {
  const [query, setQuery] = useState('');
  const filtered = cities.filter((city) =>
    city.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#0f172a',
        color: '#e5e7eb',
      }}
    >
      <div style={{ width: '100%', maxWidth: 480 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Smart Searchbar – Demo
        </h1>
        <p style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.8 }}>
          Type to filter city names. This is the simplest synchronous example –
          we’ll wire async & keyboard navigation later.
        </p>

        <SearchBar
          value={query}
          onChange={setQuery}
          results={filtered}
          placeholder="Search cities..."
          ariaLabel="Search cities"
        />
      </div>
    </div>
  );
}
