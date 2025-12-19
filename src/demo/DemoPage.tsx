import { useMemo, useState } from 'react';
import { SearchBar } from '../lib/components/SearchBar/SearchBar';

type Skill = {
  id: number;
  name: string;
  category: 'UI' | 'Frontend' | 'DX' | 'Quality';
};

const SKILLS: Skill[] = [
  { id: 1, name: 'Design Systems', category: 'UI' },
  { id: 2, name: 'Accessibility (WCAG / ARIA)', category: 'UI' },
  { id: 3, name: 'Performance Optimization', category: 'Frontend' },
  { id: 4, name: 'React + TypeScript', category: 'Frontend' },
  { id: 5, name: 'Testing (RTL / Jest)', category: 'Quality' },
  { id: 6, name: 'CI/CD + Release Hygiene', category: 'DX' },
];

const chip = (category: Skill['category']) => {
  switch (category) {
    case 'UI':
      return { label: 'UI', cls: 'bg-indigo-500/15 text-indigo-200 ring-indigo-400/20' };
    case 'Frontend':
      return { label: 'Frontend', cls: 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/20' };
    case 'DX':
      return { label: 'DX', cls: 'bg-amber-500/15 text-amber-200 ring-amber-400/20' };
    case 'Quality':
      return { label: 'Quality', cls: 'bg-sky-500/15 text-sky-200 ring-sky-400/20' };
  }
};

async function searchSkills(query: string): Promise<Skill[]> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 450));
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SKILLS.filter((s) => s.name.toLowerCase().includes(q));
}

type Flavor = 'default' | 'custom';

export function DemoPage() {
  const [flavor, setFlavor] = useState<Flavor>('default');
  const [query, setQuery] = useState('');

  const header = useMemo(() => {
    return flavor === 'default'
      ? {
          title: 'Default UI',
          desc: 'SearchBar owns the async results + loading/empty states. Good for quick integrations.',
        }
      : {
          title: 'Custom renderOption',
          desc: 'Escape hatches: custom option layout, loading, and empty states — without changing behavior.',
        };
  }, [flavor]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 opacity-40 [background:radial-gradient(900px_circle_at_50%_-20%,rgba(99,102,241,0.35),transparent_55%),radial-gradient(700px_circle_at_15%_20%,rgba(16,185,129,0.25),transparent_55%),radial-gradient(700px_circle_at_85%_25%,rgba(245,158,11,0.20),transparent_55%)]" />

      <div className="relative mx-auto w-full max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200 ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              Search primitives • async • a11y • keyboard
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Smart Searchbar <span className="text-indigo-300">Demo</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              A small, composable SearchBar library focused on the hard parts: debounced async search,
              keyboard navigation, and ARIA semantics — with escape hatches for UI.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur-sm">
            {/* Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-slate-100">Try two flavors</div>
                <div className="text-xs text-slate-400">Same behavior. Different rendering ownership.</div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-black/20 p-1 ring-1 ring-white/10">
                <button
                  type="button"
                  onClick={() => setFlavor('default')}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    flavor === 'default'
                      ? 'bg-white/10 text-white ring-1 ring-white/15'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Default
                </button>
                <button
                  type="button"
                  onClick={() => setFlavor('custom')}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    flavor === 'custom'
                      ? 'bg-white/10 text-white ring-1 ring-white/15'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Left: Search */}
              <div className="rounded-2xl bg-black/25 p-5 ring-1 ring-white/10">
                <div className="mb-3">
                  <div className="text-sm font-semibold text-slate-100">Viewing: {header.title}</div>
                  <div className="text-xs text-slate-400">{header.desc}</div>
                </div>

                {flavor === 'default' ? (
                  <SearchBar <Skill>
                  value={query}
                  onChange={setQuery}
                  onSearch={searchSkills}
                  minChars={1}
                  showSearchIcon
                  showClearResults
                  onClearResults={() => console.log('cleared')}
                  onSelect={(item) => setQuery(item.name)}

                  />
                ) : (
                  <SearchBar<Skill>
                    value={query}
                    onChange={setQuery}
                    onSearch={searchSkills}
                    minChars={1}
                    debounceMs={250}
                    placeholder="Search skills (custom UI)"
                    ariaLabel="Search skills"
                    onSelect={(item) => setQuery(item.name)}
                    showSearchIcon
                    showClearResults
                    onClearResults={() => console.log('cleared')}
                    getOptionLabel={(item) => item.name}
                    getOptionValue={(item) => item.id}
                    renderLoading={() => (
                      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-700">
                        <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                        Searching…
                      </div>
                    )}
                    renderEmpty={(q) => (
                      <div className="px-2 py-1.5 text-sm text-slate-700">
                        No matches for <span className="font-medium">“{q}”</span>. Try “react” or “design”.
                      </div>
                    )}
                    renderOption={(item, { isActive }) => {
                      const c = chip(item.category);
                      return (
                        <div
                          className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition ${
                            isActive ? 'bg-slate-200' : 'bg-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white shadow-sm">
                              {/* Tiny icon-like glyph */}
                              <span className="text-xs font-semibold">{item.name[0]}</span>
                            </div>
                            <div className="leading-tight">
                              <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                              <div className="text-xs text-slate-600">Search primitive sample result</div>
                            </div>
                          </div>

                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ${c.cls}`}
                          >
                            {c.label}
                          </span>
                        </div>
                      );
                    }}
                  />
                )}

                <div className="mt-4 text-xs text-slate-400">
                  Tip: Arrow keys to navigate, Enter to select, Escape to close.
                </div>
              </div>

              {/* Right: Notes */}
              <div className="rounded-2xl bg-black/25 p-5 ring-1 ring-white/10">
                <div className="text-sm font-semibold text-slate-100">What this shows</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    Debounced async search (with cancellation guard)
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Keyboard navigation + auto-scroll active option
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                    ARIA combobox/listbox semantics + announcements
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                    Escape hatches for rendering without rewriting logic
                  </li>
                </ul>

                <div className="mt-6 rounded-xl bg-white/5 p-4 text-xs text-slate-300 ring-1 ring-white/10">
                  <div className="font-semibold text-slate-200">Portfolio note</div>
                  <div className="mt-1 leading-relaxed">
                    Position this as <span className="text-slate-100">search primitives</span> rather than a “pretty
                    widget”. Serious teams install these to avoid rebuilding keyboard + a11y + async correctness.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Built with React + Vite • Designed for design-system interviews (API clarity, a11y, escape hatches)
          </div>
        </div>
      </div>
    </div>
  );
}
