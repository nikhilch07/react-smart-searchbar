export type SearchResult = any; 

export type SearchBarProps<T = SearchResult> = {
  /** Controlled value of the input */
  value?: string;

  /** Called on every keystroke */
  onChange: (value: string) => void;

  /** Called when a search should be performed (we’ll debounce later) */
  onSearch?: (query: string) => Promise<T[]> | T[];

  /** Debounce delay in ms for calling onSearch. Default could be 300ms. */
  debounceMs?: number;

  /** Minimum characters before triggering onSearch (e.g., 2 or 3). */
  minChars?: number;

  /** External results (if parent handles fetching/filtering) */
  results?: T[];

  /** Called when user selects an item */
  onSelect?: (item: T) => void;

  /** Placeholder text for input */
  placeholder?: string;

  /** Accessible label if no visible <label> is used */
  ariaLabel?: string;

  /** Optional class overrides */
  className?: string;
  inputClassName?: string;
  listClassName?: string;

  /** Whether to disable the input */
  disabled?: boolean;

  /** Custom renderer for each option (escape hatch for UI). */
  renderOption?: (item: T, state: { isActive: boolean; index: number }) => React.ReactNode;

  /** Custom renderer when there are no results. */
  renderEmpty?: (query: string) => React.ReactNode;

  /** Optional custom loading renderer. */
  renderLoading?: () => React.ReactNode;
};
