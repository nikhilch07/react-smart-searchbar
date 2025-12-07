import React, { useState } from 'react';
import type { SearchBarProps } from './SearchBar.types';
import styles from './SearchBar.module.css';

export function SearchBar<T>({
  value,
  defaultValue,
  onChange,
  onSearch,
  results,
  onSelect,
  placeholder = 'Search...',
  ariaLabel,
  className,
  inputClassName,
  listClassName,
  disabled,
}: SearchBarProps<T>) {
  // Uncontrolled internal state (if parent doesn’t pass `value`)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [isOpen, setIsOpen] = useState(false);

  // TODO: later this will be replaced with async / debounced state
  const inputValue = value !== undefined ? value : internalValue;
  const hasResults = results && results.length > 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
    setIsOpen(true);

    // Later we'll call onSearch here with debounce
    if (onSearch) {
      // fire-and-forget for now, we'll manage data in parent for this skeleton
      void onSearch(nextValue);
    }
  };

  const handleFocus = () => {
    if (hasResults) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Tiny timeout so click on an item doesn’t close before onClick
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const rootClassName = [styles.root, className].filter(Boolean).join(' ');
  const inputClassNames = [styles.input, inputClassName]
    .filter(Boolean)
    .join(' ');
  const listClassNames = [styles.list, listClassName].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
        className={inputClassNames}
      />

      {isOpen && hasResults && (
        <ul className={listClassNames}>
          {results!.map((item, index) => (
            <li
              key={index}
              className={styles.listItem}
              onMouseDown={(e) => {
                // prevent input blur before click
                e.preventDefault();
                onSelect?.(item);
                setIsOpen(false);
              }}
            >
              {/* Later we'll support renderOption; for now use simple text */}
              {String(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
