import React, { useState } from 'react';
import { SearchBar } from '../lib/components/SearchBar/SearchBar';

type User = {
  id: number;
  name: string;
  email: string;
};

const users: User[] = [
  { id: 1, name: 'John', email: 'john@email.com' },
  { id: 2, name: 'Alex', email: 'alex@email.com' },
  { id: 3, name: 'Sarah', email: 'sarah@email.com' },
];

const searchUsers = async (query: string): Promise<User[]> => {
  await new Promise((r) => setTimeout(r, 650));
  return users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()));
};

type Flavor = 'default' | 'custom';

function Spinner() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 14,
        height: 14,
        borderRadius: '50%',
        border: '2px solid rgba(17,24,39,0.25)',
        borderTopColor: 'rgba(17,24,39,0.95)',
        display: 'inline-block',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
}

function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <span
      aria-hidden="true"
      style={{
        width: 26,
        height: 26,
        borderRadius: 999,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.08)',
        fontSize: 12,
        fontWeight: 700,
        color: '#0f172a',
        flex: '0 0 auto',
      }}
    >
      {initial}
    </span>
  );
}

export function DemoPage() {
  const [query, setQuery] = useState('');
  const [flavor, setFlavor] = useState<Flavor>('default');

  const buttonStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 12px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.15)',
    background: active ? '#1f2937' : 'transparent',
    color: '#e5e7eb',
    cursor: 'pointer',
    fontSize: 14,
    lineHeight: 1,
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '15rem',
        background: '#0f172a',
        color: '#e5e7eb',
      }}
    >
      {/* simple keyframes for Spinner */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={{ width: '100%', maxWidth: 620 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Smart Searchbar – Demo</h1>
        <p style={{ fontSize: '0.95rem', marginBottom: '1rem', opacity: 0.8 }}>
          Toggle between default behavior (SearchBar controls async results) and a custom “escape hatch”
          UI using render props.
        </p>

        {/* Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setFlavor('default')}
            style={buttonStyle(flavor === 'default')}
          >
            Default
          </button>
          <button
            type="button"
            onClick={() => setFlavor('custom')}
            style={buttonStyle(flavor === 'custom')}
          >
            Custom renderOption
          </button>
        </div>

        <div style={{ marginBottom: 10, opacity: 0.85 }}>
          Viewing:{' '}
          <strong>{flavor === 'default' ? 'Default SearchBar UI' : 'Custom option + loading + empty'}</strong>
        </div>

        {/* Flavor 1: Default - SearchBar owns results/loading/empty */}
        {flavor === 'default' && (
          <SearchBar<User>
            value={query}
            onChange={setQuery}
            onSearch={searchUsers}
            minChars={1}
            ariaLabel="Search users"
            placeholder="Search users..."
            onSelect={(user) => setQuery(user.name)}
            getOptionLabel={(user) => user.name}
          />
        )}

        {/* Flavor 2: Custom - renderOption + spinner + fancy empty */}
        {flavor === 'custom' && (
          <SearchBar<User>
            value={query}
            onChange={setQuery}
            onSearch={searchUsers}
            minChars={2}
            ariaLabel="Search users"
            placeholder="Try: ni, al, sa (or type zz for empty)"
            onSelect={(user) => setQuery(user.name)}
            renderLoading={() => (
              <div style={{ padding: 10, color: '#111827', display: 'flex', gap: 10, alignItems: 'center' }}>
                <Spinner />
                <span style={{ fontWeight: 600 }}>Searching directory…</span>
                <span style={{ opacity: 0.7, fontSize: 12 }}>hang tight</span>
              </div>
            )}
            renderEmpty={(q) => (
              <div style={{ padding: 10, color: '#111827' }}>
                <div style={{ fontWeight: 800, marginBottom: 4 }}>No matches found</div>
                <div style={{ opacity: 0.8 }}>
                  We couldn’t find anyone matching <strong>“{q}”</strong>. Try a shorter name or check spelling.
                </div>
                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
                  Tip: type <strong>zz</strong> to see this state.
                </div>
              </div>
            )}
            renderOption={(user, { isActive }) => (
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  background: isActive ? 'rgba(229,231,235,0.9)' : 'transparent',
                  color: '#111827', // important if dropdown background is white
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                {/* “Logo / icon” */}
                <Avatar name={user.name} />

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, lineHeight: 1.2 }}>{user.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.2 }}>{user.email}</div>
                </div>

                {/* trailing icon to make it feel “product-y” */}
                <span
                  aria-hidden="true"
                  style={{
                    marginLeft: 'auto',
                    opacity: isActive ? 1 : 0.45,
                    fontWeight: 900,
                  }}
                >
                  ↵
                </span>
              </div>
            )}
          />
        )}

        <div style={{ marginTop: 14, fontSize: 12, opacity: 0.75 }}>
          Note: “Default” shows the out-of-the-box UI. “Custom” demonstrates escape hatches for rendering options,
          loading, and empty state without changing SearchBar logic.
        </div>
      </div>
    </div>
  );
}
