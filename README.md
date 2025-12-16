# React Smart Searchbar

A headless-friendly, accessible search experience built with React, TypeScript, and Vite. The `SearchBar` component ships with async fetching, keyboard navigation, ARIA attributes, and render props so teams can drop it into any design system without rewriting search logic.

---

## Highlights

- **Fully controlled input** – parent owns the value so it stays in sync with forms or URL state.
- **Async-ready** – pass an `onSearch` function that returns results (sync or async) and the component handles debouncing, loading, and empty messaging.
- **Accessible by default** – proper combobox roles, active descendant handling, screen-reader live regions, and keyboard navigation (↑, ↓, Enter, Esc).
- **Escape hatches everywhere** – override the input, list, option, empty, and loading UI through props without re-implementing logic.
- **Lightweight + framework-agnostic styling** – ships with minimal CSS Modules that you can replace via class overrides or custom renderers.

---

## Installation

Inside your React 18 / TypeScript project:

```bash
npm install react-smart-searchbar
# or
yarn add react-smart-searchbar
```

If you are cloning this repository to explore the demo:

```bash
git clone https://github.com/<you>/react-smart-searchbar.git
cd react-smart-searchbar
npm install
npm run dev
```

---

## Step-by-step integration guide

The component behaves like any other controlled input. Here’s how to wire it up in five steps.

### 1. Define the data model

```ts
type User = { id: number; name: string; email: string };
```

### 2. Keep query state in your page or form

```tsx
const [query, setQuery] = useState('');
```

### 3. Provide a search function

You can hit an API or filter local data. Return an array (sync or `Promise`). Debouncing happens inside the component.

```ts
const searchUsers = async (text: string): Promise<User[]> => {
  const response = await fetch(`/api/users?query=${encodeURIComponent(text)}`);
  if (!response.ok) throw new Error('Request failed');
  return response.json();
};
```

### 4. Render the searchbar

```tsx
import { SearchBar } from 'react-smart-searchbar';

<SearchBar<User>
  value={query}
  onChange={setQuery}
  onSearch={searchUsers}
  placeholder="Search teammates…"
  ariaLabel="Search user directory"
  minChars={2}
  debounceMs={300}
  onSelect={(user) => setQuery(user.name)}
  getOptionLabel={(user) => user.name}
  getOptionValue={(user) => user.id}
/>;
```

### 5. (Optional) Customize the UI

Use render props to inject your design language:

```tsx
<SearchBar<User>
  {...commonProps}
  renderLoading={() => (
    <div className="dropdown-loading">
      <Spinner /> Searching directory…
    </div>
  )}
  renderEmpty={(text) => (
    <div className="dropdown-empty">
      No teammates match “{text}”.
    </div>
  )}
  renderOption={(user, { isActive }) => (
    <div className={clsx('dropdown-option', isActive && 'is-active')}>
      <Avatar name={user.name} />
      <div>
        <strong>{user.name}</strong>
        <span>{user.email}</span>
      </div>
    </div>
  )}
/>;
```

---

## Live demo

Run `npm run dev` and visit the local Vite URL to inspect `src/demo/DemoPage.tsx`. It demonstrates:

- Default experience where `SearchBar` handles loading and empty states itself.
- A custom mode showing how `renderOption`, `renderLoading`, and `renderEmpty` let you plug into any UI toolkit.

---

## Props reference

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string` | Current input value (controlled). Omit to use `''`. |
| `onChange` | `(value: string) => void` | Fired on every keystroke; update your state here. |
| `onSearch` | `(query: string) => Promise<T[]> \| T[]` | Optional async search handler. When supplied the component manages loading, errors, and results. |
| `results` | `T[]` | Provide your own result list if you want to fetch/filter outside. |
| `onSelect` | `(item: T) => void` | Called when the user presses Enter or clicks an option. |
| `placeholder` | `string` | Input placeholder text (defaults to `Search...`). |
| `ariaLabel` | `string` | Accessibility label when no `<label>` is associated. |
| `minChars` | `number` | Minimum characters before triggering `onSearch` (default `2`). |
| `debounceMs` | `number` | Delay before calling `onSearch` (default `300`). |
| `disabled` | `boolean` | Disable the input. |
| `className` / `inputClassName` / `listClassName` | `string` | Override container, input, or dropdown classes. |
| `renderOption` | `(item, state) => ReactNode` | Custom renderer for list items (state includes `isActive` and `index`). |
| `renderEmpty` | `(query: string) => ReactNode` | Custom empty state renderer. |
| `renderLoading` | `() => ReactNode` | Custom loading UI shown while fetching results. |
| `getOptionLabel` | `(item: T) => string` | Used when the default renderer is active to convert an item to text. |
| `getOptionValue` | `(item: T) => string \| number` | Provides a stable key for list rendering. |

---

## Accessibility & keyboard support

- `role="combobox"` + `aria-expanded`, `aria-controls`, and `aria-activedescendant` keep screen readers informed.
- Arrow keys move focus through results, `Enter` picks the active option, `Esc` closes the list.
- A polite live region announces loading, errors, and item counts for assistive tech.

---

## Styling tips

The default CSS Module (`src/lib/components/SearchBar/SearchBar.module.css`) keeps styles minimal on purpose. Override via class props or disable the CSS import and share your own styles. When using render props, you can skip the bundled styles entirely.

---

## Contributing

1. `npm install`
2. `npm run lint` / `npm run test` (if applicable)
3. `npm run dev` to iterate on the demo page
4. Open a PR with screenshots or a short loom when tweaking UI/UX.

---

## License

MIT © Your Name Here
