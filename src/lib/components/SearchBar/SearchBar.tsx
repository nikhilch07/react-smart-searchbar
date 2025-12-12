import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import type { SearchBarProps } from './SearchBar.types';
import styles from './SearchBar.module.css';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export function SearchBar<T>({
  value,
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
  debounceMs,
  minChars = 2,
}: SearchBarProps<T>) {
  // Uncontrolled internal state (if parent doesn’t pass `value`)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [internalResults, setInternalResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: later this will be replaced with async / debounced state
  const displayResults = results ?? internalResults;
  const hasResults = displayResults.length > 0;
  const debounceDelay = debounceMs ?? 300;
  const debouncedQuery = useDebouncedValue(value, debounceDelay);

  useEffect(() => {
    // If no onSearch is provided, we don't manage internal results.
    if (!onSearch) return;

    // If query is too short, clear internal results and don't call onSearch.
    if (displayResults.length < (minChars ?? 0)) {
      setInternalResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const performSearch = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const results = await onSearch(debouncedQuery);
        if (cancelled) return;

        const normalized = Array.isArray(results) ? results : [];
        setInternalResults(normalized);

        // open dropdown if we have results
        if (normalized.length > 0) {
          setIsOpen(true);
          setActiveIndex(null);
        }
      } catch (err) {
        if (cancelled) return;
        setError('Something went wrong while searching');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void performSearch();

    return () => (cancelled = true);
  }, [debouncedQuery, onSearch, minChars]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    onChange?.(nextValue);
    setIsOpen(true);

    // Later we'll call onSearch here with debounce
    if (onSearch) {
      // fire-and-forget for now, we'll manage data in parent for this skeleton
      void onSearch(nextValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hasResults || !isOpen) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setActiveIndex(null);
      }
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => {
        if (prev === null) return 0;
        const next = prev + 1;
        return next >= results.length ? results.length - 1 : next;
      });
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => {
        if (prev === null) return results!.length - 1;
        const next = prev - 1;
        return next < 0 ? 0 : next;
      });
    }

    if (event.key === 'Enter') {
      if (activeIndex != null && results![activeIndex]) {
        event.preventDefault();
        onSelect?.(results![activeIndex]);
        setIsOpen(false);
      }
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setActiveIndex(null);
      setIsOpen(false);
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

  const listboxId = 'searchbar-listbox';

  return (
    <div className={clsx(styles.root, className)}>
      <input
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={isOpen && hasResults ? listboxId : undefined}
        aria-autocomplete="list"
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
        className={clsx(styles.input, inputClassName)}
      />

      {isOpen && (
        <ul className={clsx(styles.list, listClassName)} role="listbox" id={listboxId}>
          {isLoading && (
            <li className={styles.listItem} aria-disabled={true}>
              Loading...
            </li>
          )}
          {!isLoading && error && (
            <li className={styles.listItem} aria-disabled={true}>
              {error}
            </li>
          )}
          {!isLoading &&
            !error &&
            hasResults &&
            displayResults.map((item, index) => (
              <li
                key={index}
                role="option"
                id={listboxId}
                className={clsx(styles.listItem, activeIndex === index && styles.listItemActive)}
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
