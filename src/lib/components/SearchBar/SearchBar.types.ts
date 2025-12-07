export type SearchResult = any; // we'll genericize later

export type SearchBarProps<T = SearchResult> = {
  /** Controlled value of the input */
  value?: string;
  /** Uncontrolled initial value */
  defaultValue?: string;
  /** Called on every keystroke */
  onChange?: (value: string) => void;

  /** Called when a search should be performed (we’ll debounce later) */
  onSearch?: (query: string) => Promise<T[]> | T[];

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
};
