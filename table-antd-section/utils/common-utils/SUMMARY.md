# Common Utilities Summary

This directory contains reusable utility functions for the table-antd-section component. The utilities are organized into several categories to handle common operations needed for table functionality.

## Directory Structure

- `index.ts` - Re-exports all utilities for easier imports
- `array-utils.ts` - Array manipulation utilities
- `comparison-utils.ts` - Value comparison utilities
- `text-utils.ts` - Text manipulation utilities
- `sort-utils.ts` - Sorting utilities for different data types

## Utility Functions Overview

### Array Utilities (`array-utils.ts`)

- **compareKeyArrays(keys1, keys2)** 
  - Compares two arrays of keys to check if they are equal
  - Returns `true` if arrays contain the same keys, regardless of order

- **deepCloneArray(items)** 
  - Creates a deep clone of an array of objects
  - Handles nested children recursively

### Comparison Utilities (`comparison-utils.ts`)

- **SearchMode Type**
  - `exact` - Exact match with case sensitivity
  - `caseInsensitive` - Case-insensitive matching
  - `accentInsensitive` - Case and accent insensitive matching (for Vietnamese text)

- **compareValues(value, search, mode)**
  - Compares strings based on the specified search mode
  - Supports different levels of text comparison sensitivity

### Text Utilities (`text-utils.ts`)

- **removeDiacritics(str)**
  - Removes Vietnamese diacritical marks from text
  - Replaces Vietnamese-specific characters with their ASCII equivalents

- **xoaDauVietNam(str)**
  - Extended version that removes diacritics and converts to lowercase
  - Used for case-insensitive and accent-insensitive text searching

### Sorting Utilities (`sort-utils.ts`)

- **SorterType Type**
  - `id` - For sorting ID columns (handles mixed string/number IDs)
  - `text` - For sorting text columns
  - `number` - For sorting numeric columns
  - `date` - For sorting date columns

- **sorterId(a, b, columnKey)**
  - Sorts ID columns, handling different types of IDs (number, string, or mixed)
  - Special handling for null/undefined values

- **sorterText(a, b, columnKey)**
  - Sorts text columns with locale-aware comparison
  - Special handling for null/undefined values

- **sorterNumber(a, b, columnKey)**
  - Sorts number columns numerically
  - Special handling for NaN values

- **sorterDate(a, b, columnKey)**
  - Sorts date columns chronologically
  - Special handling for null/undefined values

- **createSorterFunction(columnKey, type)**
  - Factory function that creates an appropriate sorter function based on column type
  - Returns a function compatible with Ant Design's CompareFn interface

## Usage

These utilities are designed to be used with the table components in the application. They provide consistent behavior for sorting, filtering, and displaying data in tables.

Import them from the common-utils directory:

```typescript
import { sorterText, compareValues, xoaDauVietNam } from '../utils/common-utils';
```

Or import specific utilities directly:

```typescript
import { createSorterFunction } from '../utils/common-utils/sort-utils';
```
