# TEMPLATE GUIDE TO IMPLEMENT TESTS

> Template hướng dẫn chi tiết để triển khai __tests__ cho các general module trong dự án CaterSoft

## 📁 Cấu trúc thư mục __tests__

```
{module-name}/__tests__/
├── README.md                    # Tài liệu mô tả test suite
├── package.json                 # Dependencies và scripts cho testing
├── jest.config.js              # Cấu hình Jest
├── jest.setup.js               # Setup môi trường test
├── jest.polyfills.js           # Polyfills cho browser APIs
├── tsconfig.test.json          # TypeScript config cho tests
├── test-utils.tsx              # Utilities và helpers cho testing
├── run-all-tests.sh            # Script chạy tất cả tests
├── __mocks__/                  # Mock data và functions
│   └── {module}-constants.ts
├── components/                 # Tests cho React components
│   └── {Component}.test.tsx
├── hooks/                      # Tests cho custom hooks
│   └── {useHook}.test.tsx
├── utils/                      # Tests cho utility functions
│   └── {utility}.test.ts
├── services/                   # Tests cho API services
│   └── {service}.test.tsx
├── accessibility/              # Tests cho accessibility
│   └── {module}-accessibility.test.tsx
├── performance/                # Tests cho performance
│   └── {module}-performance.test.tsx
└── integration/                # Tests cho end-to-end workflows
    └── {module}-workflow.test.tsx
```

## 🔧 Cấu hình Files

### 1. package.json

```json
{
  "name": "{module-name}-tests",
  "version": "1.0.0",
  "description": "Test suite for {module-name} component",
  "private": true,
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:unit": "jest --testPathPattern=components|hooks|utils|services",
    "test:integration": "jest --testPathPattern=integration",
    "test:accessibility": "jest --testPathPattern=accessibility",
    "test:performance": "jest --testPathPattern=performance",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:update-snapshots": "jest --updateSnapshot",
    "test:clear-cache": "jest --clearCache",
    "lint:tests": "eslint **/*.test.{ts,tsx} **/*.spec.{ts,tsx}",
    "lint:tests:fix": "eslint **/*.test.{ts,tsx} **/*.spec.{ts,tsx} --fix",
    "type-check:tests": "tsc --noEmit --project tsconfig.test.json"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^12.1.5",
    "@testing-library/react-hooks": "^8.0.1",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^29.5.5",
    "@types/jest-axe": "^3.5.9",
    "@types/testing-library__jest-dom": "^5.14.9",
    "abort-controller": "^3.0.0",
    "babel-jest": "^29.7.0",
    "blob-polyfill": "^7.0.20220408",
    "form-data": "^4.0.0",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^29.7.0",
    "jest-axe": "^8.0.0",
    "jest-environment-jsdom": "^29.7.0",
    "jest-transform-stub": "^2.0.0",
    "jest-watch-typeahead": "^2.2.2",
    "node-fetch": "^2.6.7",
    "ts-jest": "^29.1.1",
    "typescript": "^4.9.5"
  },
  "eslintConfig": {
    "extends": [
      "@testing-library/react"
    ],
    "rules": {
      "testing-library/no-unnecessary-act": "error",
      "testing-library/no-wait-for-multiple-assertions": "error",
      "testing-library/prefer-screen-queries": "error",
      "testing-library/prefer-user-event": "error"
    }
  },
  "keywords": [
    "react",
    "{module-name}",
    "testing",
    "jest",
    "accessibility",
    "performance"
  ],
  "author": "CaterSoft Development Team",
  "license": "MIT"
}
```

### 2. jest.config.js

```javascript
module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js'
  ],
  
  // Module name mapping for CSS and asset files
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
  },
  
  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // File extensions to consider
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json'
  ],
  
  // Test match patterns
  testMatch: [
    '<rootDir>/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/**/*.(test|spec).(ts|tsx|js)'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    '../**/*.{ts,tsx}',
    '!../**/*.d.ts',
    '!../**/*.stories.{ts,tsx}',
    '!../**/__tests__/**',
    '!../**/__mocks__/**',
    '!../step-to-refactoring/**'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './components/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    './hooks/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './utils/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  
  // Coverage directory
  coverageDirectory: '<rootDir>/coverage',
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/'
  ],
  
  // Module directories
  moduleDirectories: [
    'node_modules',
    '<rootDir>/../../../..'
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Test timeout
  testTimeout: 10000,
  
  // Performance testing configuration
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }
  },
  
  // Custom test environment options
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  
  // Error on deprecated features
  errorOnDeprecated: true,
  
  // Fail fast on first error
  bail: false,
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Custom matchers and utilities
  setupFiles: [
    '<rootDir>/jest.polyfills.js'
  ]
}
```

### 3. jest.setup.js

```javascript
const React = require('react')
require('@testing-library/jest-dom')
require('jest-axe/extend-expect')

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock window.getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
    width: '100px',
    height: '100px'
  })
})

// Mock HTMLElement methods
HTMLElement.prototype.scrollIntoView = jest.fn()
HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
  x: 0,
  y: 0,
  toJSON: jest.fn()
}))

// Mock performance APIs
if (!global.performance.mark) {
  global.performance.mark = jest.fn()
}
if (!global.performance.measure) {
  global.performance.measure = jest.fn()
}
if (!global.performance.getEntriesByName) {
  global.performance.getEntriesByName = jest.fn(() => [])
}

// Console mocking
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
  
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
       args[0].includes('componentWillUpdate'))
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

// Global test utilities
global.testUtils = {
  waitForAsync: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),
  createMockFn: (returnValue) => jest.fn(() => returnValue),
  mockTimers: () => {
    jest.useFakeTimers()
    return {
      advanceBy: (ms) => jest.advanceTimersByTime(ms),
      runAll: () => jest.runAllTimers(),
      restore: () => jest.useRealTimers()
    }
  },
  suppressConsole: () => {
    const originalConsole = { ...console }
    console.error = jest.fn()
    console.warn = jest.fn()
    console.log = jest.fn()
    
    return () => {
      Object.assign(console, originalConsole)
    }
  }
}

// Custom Jest matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },
  
  toHaveBeenCalledWithinTime(received, timeMs) {
    const calls = received.mock.calls
    if (calls.length === 0) {
      return {
        message: () => `expected function to have been called`,
        pass: false,
      }
    }
    
    return {
      message: () => `expected function to have been called within ${timeMs}ms`,
      pass: true,
    }
  },
  
  toRenderWithoutErrors(received) {
    try {
      const pass = received !== null && received !== undefined
      return {
        message: () => `expected component to render without errors`,
        pass,
      }
    } catch (error) {
      return {
        message: () => `expected component to render without errors, but got: ${error.message}`,
        pass: false,
      }
    }
  }
})

// Performance testing utilities
global.performanceUtils = {
  measureRenderTime: async (renderFn) => {
    const start = performance.now()
    await renderFn()
    const end = performance.now()
    return end - start
  },
  
  measureMemoryUsage: () => {
    if ('memory' in performance) {
      return performance.memory.usedJSHeapSize
    }
    return 0
  },
  
  createPerformanceObserver: (callback) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(callback)
      return observer
    }
    return {
      observe: jest.fn(),
      disconnect: jest.fn()
    }
  }
}

// Accessibility testing utilities
global.a11yUtils = {
  hasProperAria: (element) => {
    const requiredAttrs = ['aria-label', 'aria-labelledby', 'aria-describedby']
    return requiredAttrs.some(attr => element.hasAttribute(attr))
  },
  
  isKeyboardAccessible: (element) => {
    const tabIndex = element.getAttribute('tabindex')
    const role = element.getAttribute('role')
    const tagName = element.tagName.toLowerCase()
    
    const interactiveElements = ['button', 'input', 'select', 'textarea', 'a']
    const interactiveRoles = ['button', 'link', 'textbox', 'checkbox', 'radio']
    
    return (
      interactiveElements.includes(tagName) ||
      interactiveRoles.includes(role) ||
      (tabIndex !== null && parseInt(tabIndex) >= 0)
    )
  },
  
  hasGoodContrast: (foreground, background) => {
    // Simplified version - implement actual contrast calculation
    return true
  }
}

// Mock data generators
global.mockDataGenerators = {
  generateMockData: (count = 10) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `${index + 1}`,
      name: `Item ${index + 1}`,
      value: index + 1,
      status: index % 2 === 0 ? 'Active' : 'Inactive'
    }))
  },
  
  generateLargeDataset: (size) => {
    return Array.from({ length: size }, (_, index) => ({
      id: `${index + 1}`,
      name: `Item ${index + 1}`,
      value: index + 1,
      category: `Category ${(index % 10) + 1}`,
      status: index % 2 === 0 ? 'Active' : 'Inactive',
      createdAt: new Date(2020 + (index % 4), index % 12, (index % 28) + 1).toISOString().split('T')[0]
    }))
  }
}

// Error boundary for testing
global.TestErrorBoundary = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        'data-testid': 'error-boundary',
        children: `Error: ${this.state.error?.message || 'Unknown error'}`
      })
    }
    
    return this.props.children
  }
}

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks()
  jest.clearAllTimers()
  document.body.innerHTML = ''
  
  if (global.testState) {
    global.testState = {}
  }
})

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
```

### 4. jest.polyfills.js

```javascript
// Polyfills for browser APIs that might not be available in test environment

// AbortController polyfill
if (!global.AbortController) {
  global.AbortController = require('abort-controller')
}

// Blob polyfill
if (!global.Blob) {
  global.Blob = require('blob-polyfill').Blob
}

// FormData polyfill
if (!global.FormData) {
  global.FormData = require('form-data')
}

// fetch polyfill
if (!global.fetch) {
  global.fetch = require('node-fetch')
}

// URL polyfill
if (!global.URL) {
  global.URL = require('url').URL
}

// TextEncoder/TextDecoder polyfill
if (!global.TextEncoder) {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}
```

### 5. tsconfig.test.json

```json
{
  "extends": "../../../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": [
      "DOM",
      "DOM.Iterable",
      "ES2020"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "declaration": false,
    "declarationMap": false,
    "sourceMap": true,
    "outDir": "./dist",
    "removeComments": false,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "exactOptionalPropertyTypes": false,
    "noUncheckedIndexedAccess": false,
    "noImplicitOverride": true,
    "useUnknownInCatchVariables": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["../../../*"],
      "@/components/*": ["../../../components/*"],
      "@/hooks/*": ["../../../hooks/*"],
      "@/utils/*": ["../../../utils/*"],
      "@/services/*": ["../../../services/*"],
      "@/types/*": ["../../../types/*"],
      "@/{module-name}/*": ["../*"],
      "@/test-utils": ["./test-utils"],
      "@/mocks/*": ["./__mocks__/*"]
    },
    "types": [
      "jest",
      "@testing-library/jest-dom",
      "@types/testing-library__jest-dom",
      "node"
    ]
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx",
    "../components/**/*.ts",
    "../components/**/*.tsx",
    "../hooks/**/*.ts",
    "../hooks/**/*.tsx",
    "../utils/**/*.ts",
    "../services/**/*.ts",
    "../types/**/*.ts",
    "../index.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "coverage",
    "../step-to-refactoring"
  ],
  "ts-node": {
    "esm": true,
    "compilerOptions": {
      "module": "ESNext",
      "moduleResolution": "node"
    }
  }
}
```

### 6. test-utils.tsx

```tsx
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
// Import providers cần thiết cho module
// import { ModuleProvider } from '../hooks/useModule'

// Test wrapper với tất cả providers cần thiết
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    // <ModuleProvider>
      {children}
    // </ModuleProvider>
  )
}

// Custom render function với providers
const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders as React.ComponentType, ...options })

// Re-export everything từ testing library
export * from '@testing-library/react'
export { customRender as render }

// Common test utilities cho module
export const waitForModuleToLoad = async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
}

export const getModuleElements = (container: HTMLElement) => {
  return container.querySelectorAll('[data-testid^="module-"]')
}

export const getModuleInput = (container: HTMLElement) => {
  return container.querySelector('input[data-testid="module-input"]') as HTMLInputElement
}

export const getModuleButtons = (container: HTMLElement) => {
  return container.querySelectorAll('button[data-testid^="module-"]')
}
```

## 📝 Test Templates

### 1. Component Test Template

```tsx
// components/{Component}.test.tsx
import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, waitForModuleToLoad } from '../test-utils'
import { ComponentName } from '../../components/ComponentName'
import {
  mockComponentConstants,
  mockComponentData,
  mockEmptyComponentData
} from '../__mocks__/{module}-constants'

// Mock console.error để tránh noise trong tests
const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalError
})

describe('ComponentName', () => {
  describe('Basic Rendering', () => {
    test('should render with basic props', async () => {
      render(
        <ComponentName 
          constants={mockComponentConstants} 
          data={mockComponentData} 
        />
      )

      await waitForModuleToLoad()

      expect(screen.getByTestId('component-name')).toBeInTheDocument()
      expect(screen.getByText('Expected Text')).toBeInTheDocument()
    })

    test('should render with empty data', async () => {
      render(
        <ComponentName 
          constants={mockComponentConstants} 
          data={mockEmptyComponentData} 
        />
      )

      await waitForModuleToLoad()

      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    test('should handle loading state', async () => {
      render(
        <ComponentName 
          constants={mockComponentConstants} 
          data={mockComponentData}
          loading={true}
        />
      )

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    test('should handle click events', async () => {
      const mockOnClick = jest.fn()
      
      render(
        <ComponentName 
          constants={mockComponentConstants} 
          data={mockComponentData}
          onClick={mockOnClick}
        />
      )

      await waitForModuleToLoad()

      const button = screen.getByRole('button')
      await userEvent.click(button)

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    test('should handle input changes', async () => {
      const mockOnChange = jest.fn()
      
      render(
        <ComponentName 
          constants={mockComponentConstants} 
          data={mockComponentData}
          onChange={mockOnChange}
        />
      )

      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'test input')

      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    test('should handle errors gracefully', async () => {
      const mockOnError = jest.fn()
      
      render(
        <ComponentName 
          constants={mockComponentConstants} 
          data={null}
          onError={mockOnError}
        />
      )

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalled()
      })
    })
  })
})
```

### 2. Hook Test Template

```tsx
// hooks/{useHook}.test.tsx
import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { useHookName } from '../../hooks/useHookName'
// import { ModuleProvider } from '../../hooks/useModule'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  // <ModuleProvider>{children}</ModuleProvider>
  <>{children}</>
)

describe('useHookName Hook', () => {
  describe('Initial State', () => {
    test('should provide initial values', () => {
      const { result } = renderHook(() => useHookName(), { wrapper })

      expect(result.current).toBeDefined()
      expect(result.current.value).toBe(null)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    test('should provide required methods', () => {
      const { result } = renderHook(() => useHookName(), { wrapper })

      expect(result.current.setValue).toBeDefined()
      expect(typeof result.current.setValue).toBe('function')
      expect(result.current.reset).toBeDefined()
      expect(typeof result.current.reset).toBe('function')
    })
  })

  describe('State Updates', () => {
    test('should update value correctly', () => {
      const { result } = renderHook(() => useHookName(), { wrapper })

      act(() => {
        result.current.setValue('new value')
      })

      expect(result.current.value).toBe('new value')
    })

    test('should reset state correctly', () => {
      const { result } = renderHook(() => useHookName(), { wrapper })

      act(() => {
        result.current.setValue('test value')
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.value).toBe(null)
    })
  })

  describe('Async Operations', () => {
    test('should handle async operations', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useHookName(), { wrapper })

      act(() => {
        result.current.fetchData()
      })

      expect(result.current.loading).toBe(true)

      await waitForNextUpdate()

      expect(result.current.loading).toBe(false)
      expect(result.current.value).toBeDefined()
    })
  })
})
```

### 3. Utility Test Template

```typescript
// utils/{utility}.test.ts
import { utilityFunction } from '../../utils/utility'

describe('utilityFunction', () => {
  describe('Basic Functionality', () => {
    test('should return expected result for valid input', () => {
      const input = 'test input'
      const expected = 'expected output'
      const result = utilityFunction(input)
      
      expect(result).toBe(expected)
    })

    test('should handle empty input', () => {
      const input = ''
      const result = utilityFunction(input)
      
      expect(result).toBe('')
    })

    test('should handle null input', () => {
      const input = null as any
      const result = utilityFunction(input)
      
      expect(result).toBe('')
    })

    test('should handle undefined input', () => {
      const input = undefined as any
      const result = utilityFunction(input)
      
      expect(result).toBe('')
    })
  })

  describe('Edge Cases', () => {
    test('should handle special characters', () => {
      const input = '!@#$%^&*()'
      const result = utilityFunction(input)
      
      expect(result).toBeDefined()
    })

    test('should handle large input', () => {
      const largeInput = 'a'.repeat(10000)
      const result = utilityFunction(largeInput)
      
      expect(result).toBeDefined()
    })

    test('should handle numeric input', () => {
      const input = 123 as any
      const result = utilityFunction(input)
      
      expect(result).toBe('123')
    })
  })

  describe('Performance', () => {
    test('should execute within reasonable time', () => {
      const input = 'performance test'
      const startTime = performance.now()
      
      utilityFunction(input)
      
      const endTime = performance.now()
      const executionTime = endTime - startTime
      
      expect(executionTime).toBeLessThan(10) // Should execute in under 10ms
    })
  })
})
```

### 4. Service Test Template

```tsx
// services/{service}.test.tsx
import { serviceFunction } from '../../services/service'
import { mockServiceData } from '../__mocks__/{module}-constants'

// Mock external dependencies
jest.mock('../../utils/api', () => ({
  apiCall: jest.fn()
}))

describe('Service Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('serviceFunction', () => {
    test('should process data correctly', async () => {
      const result = await serviceFunction(mockServiceData)
      
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    test('should handle empty data', async () => {
      const result = await serviceFunction([])
      
      expect(result).toEqual([])
    })

    test('should handle API errors', async () => {
      const mockApiCall = require('../../utils/api').apiCall
      mockApiCall.mockRejectedValue(new Error('API Error'))

      await expect(serviceFunction(mockServiceData)).rejects.toThrow('API Error')
    })

    test('should call API with correct parameters', async () => {
      const mockApiCall = require('../../utils/api').apiCall
      mockApiCall.mockResolvedValue({ data: mockServiceData })

      await serviceFunction(mockServiceData)

      expect(mockApiCall).toHaveBeenCalledWith({
        method: 'POST',
        data: mockServiceData
      })
    })
  })
})
```

### 5. Accessibility Test Template

```tsx
// accessibility/{module}-accessibility.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ComponentName } from '../../components/ComponentName'
import { mockComponentConstants, mockComponentData } from '../__mocks__/{module}-constants'

expect.extend(toHaveNoViolations)

describe('Module Accessibility Tests', () => {
  describe('ARIA Compliance', () => {
    test('should have no accessibility violations', async () => {
      const { container } = render(
        <ComponentName 
          constants={mockComponentConstants}
          data={mockComponentData}
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    test('should have proper ARIA attributes', async () => {
      render(
        <ComponentName 
          constants={mockComponentConstants}
          data={mockComponentData}
        />
      )

      const mainElement = screen.getByRole('main')
      expect(mainElement).toHaveAttribute('aria-label')

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label')
      })
    })

    test('should have proper heading hierarchy', async () => {
      render(
        <ComponentName 
          constants={mockComponentConstants}
          data={mockComponentData}
        />
      )

      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
      
      // Check heading levels are in proper order
      const headingLevels = headings.map(h => parseInt(h.tagName.charAt(1)))
      expect(headingLevels[0]).toBe(1) // First heading should be h1
    })
  })

  describe('Keyboard Navigation', () => {
    test('should support tab navigation', async () => {
      render(
        <ComponentName 
          constants={mockComponentConstants}
          data={mockComponentData}
        />
      )

      const interactiveElements = [
        ...screen.getAllByRole('button'),
        ...screen.getAllByRole('textbox'),
        ...screen.getAllByRole('link')
      ]

      // Tab through all interactive elements
      for (let i = 0; i < interactiveElements.length; i++) {
        await userEvent.tab()
        expect(interactiveElements[i]).toHaveFocus()
      }
    })

    test('should support Enter and Space for activation', async () => {
      const mockOnClick = jest.fn()
      
      render(
        <ComponentName 
          constants={mockComponentConstants}
          data={mockComponentData}
          onClick={mockOnClick}
        />
      )

      const button = screen.getByRole('button')
      button.focus()

      // Test Enter key
      fireEvent.keyDown(button, { key: 'Enter' })
      expect(mockOnClick).toHaveBeenCalledTimes(1)

      // Test Space key
      fireEvent.keyDown(button, { key: ' ' })
      expect(mockOnClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('Screen Reader Support', () => {
    test('should announce dynamic content changes', async () => {
      const { container } = render(
        <ComponentName 
          constants={mockComponentConstants}
          data={mockComponentData}
        />
      )

      const liveRegion = container.querySelector('[aria-live]')
      expect(liveRegion).toBeInTheDocument()
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
    })

    test('should have descriptive labels', async () => {
      render(
        <ComponentName 
          constants={mockComponentConstants}
          data={mockComponentData}
        />
      )

      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(
          input.hasAttribute('aria-label') || 
          input.hasAttribute('aria-labelledby')
        ).toBe(true)
      })
    })
  })
})
```

### 6. Performance Test Template

```tsx
// performance/{module}-performance.test.tsx
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentName } from '../../components/ComponentName'
import { mockComponentConstants, mockLargeComponentData } from '../__mocks__/{module}-constants'

const measureRenderTime = async (renderFn: () => void): Promise<number> => {
  const start = performance.now()
  renderFn()
  await waitFor(() => {})
  const end = performance.now()
  return end - start
}

const measureMemoryUsage = (): number => {
  if ('memory' in performance) {
    return (performance as any).memory.usedJSHeapSize
  }
  return 0
}

describe('Module Performance Tests', () => {
  describe('Rendering Performance', () => {
    test('should render small dataset quickly', async () => {
      const renderTime = await measureRenderTime(() => {
        render(
          <ComponentName 
            constants={mockComponentConstants}
            data={mockComponentConstants.slice(0, 10)}
          />
        )
      })

      expect(renderTime).toBeLessThan(100) // Should render in under 100ms
    })

    test('should render large dataset efficiently', async () => {
      const renderTime = await measureRenderTime(() => {
        render(
          <ComponentName 
            constants={mockComponentConstants}
            data={mockLargeComponentData}
          />
        )
      })

      expect(renderTime).toBeLessThan(1000) // Should render in under 1 second
    })

    test('should not cause memory leaks on re-renders', async () => {
      const TestComponent = () => {
        const [data, setData] = React.useState(mockComponentConstants)
        const [renderCount, setRenderCount] = React.useState(0)

        React.useEffect(() => {
          const interval = setInterval(() => {
            setRenderCount(prev => {
              if (prev < 10) {
                setData([...mockComponentConstants])
                return prev + 1
              }
              return prev
            })
          }, 50)

          return () => clearInterval(interval)
        }, [])

        return (
          <ComponentName 
            constants={mockComponentConstants}
            data={data}
          />
        )
      }

      const initialMemory = measureMemoryUsage()
      
      render(<TestComponent />)
      
      await waitFor(() => {}, { timeout: 1000 })

      const finalMemory = measureMemoryUsage()
      
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024) // Less than 10MB
      }
    })
  })

  describe('Interaction Performance', () => {
    test('should handle user interactions quickly', async () => {
      render(
        <ComponentName 
          constants={mockComponentConstants}
          data={mockLargeComponentData}
        />
      )

      const button = screen.getByRole('button')
      
      const start = performance.now()
      await userEvent.click(button)
      const end = performance.now()
      
      const interactionTime = end - start
      expect(interactionTime).toBeLessThan(50) // Should respond in under 50ms
    })
  })
})
```

### 7. Integration Test Template

```tsx
// integration/{module}-workflow.test.tsx
import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../test-utils'
import { ComponentName } from '../../components/ComponentName'
import { mockComponentConstants, mockComponentData } from '../__mocks__/{module}-constants'

describe('Module Integration Tests', () => {
  describe('Complete Workflow', () => {
    test('should handle complete user workflow', async () => {
      const mockOnSubmit = jest.fn()
      const mockOnCancel = jest.fn()

      render(
        <ComponentName 
          constants={mockComponentConstants}
          data={mockComponentData}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      )

      // 1. Initial load
      expect(screen.getByTestId('component-name')).toBeInTheDocument()

      // 2. User interaction
      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'test input')

      // 3. Form submission
      const submitButton = screen.getByRole('button', { name: /submit/i })
      await userEvent.click(submitButton)

      // 4. Verify results
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            value: 'test input'
          })
        )
      })
    })

    test('should maintain state consistency across operations', async () => {
      render(
        <ComponentName 
          constants={mockComponentConstants}
          data={mockComponentData}
        />
      )

      // Perform multiple operations and verify state consistency
      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'test')
      
      const button = screen.getByRole('button')
      await userEvent.click(button)
      
      // Verify state is maintained
      expect(input).toHaveValue('test')
    })
  })

  describe('Error Scenarios', () => {
    test('should handle and recover from errors', async () => {
      const mockOnError = jest.fn()
      
      render(
        <ComponentName 
          constants={mockComponentConstants}
          data={null}
          onError={mockOnError}
        />
      )

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalled()
      })

      // Verify error recovery
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
```

### 8. Mock Constants Template

```typescript
// __mocks__/{module}-constants.ts
import { IModuleConstants, IModuleData } from '../../types/Module.types'

// Mock data
export const mockModuleData: IModuleData[] = [
  {
    id: '1',
    name: 'Test Item 1',
    value: 'test-value-1',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Test Item 2',
    value: 'test-value-2',
    status: 'inactive',
    createdAt: '2024-01-02'
  }
]

// Mock large dataset for performance testing
export const mockLargeModuleData = Array.from({ length: 1000 }, (_, index) => ({
  id: `${index + 1}`,
  name: `Test Item ${index + 1}`,
  value: `test-value-${index + 1}`,
  status: ['active', 'inactive', 'pending'][index % 3],
  createdAt: `2024-01-${String((index % 30) + 1).padStart(2, '0')}`
}))

// Mock constants
export const mockModuleConstants: IModuleConstants = {
  getColumns: () => [
    { id: 'id', name: 'ID' },
    { id: 'name', name: 'Name', isSearch: true },
    { id: 'value', name: 'Value' },
    { id: 'status', name: 'Status' },
    { id: 'createdAt', name: 'Created At' }
  ],
  getFields: () => [
    {
      id: 'name',
      name: 'Name',
      type: 'text',
      placeholder: 'Enter name...'
    },
    {
      id: 'value',
      name: 'Value',
      type: 'text',
      placeholder: 'Enter value...'
    },
    {
      id: 'status',
      name: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' }
      ]
    }
  ]
}

// Mock empty data
export const mockEmptyModuleData: IModuleData[] = []

// Mock error data
export const mockErrorModuleData = null

// Mock loading state
export const mockLoadingState = {
  loading: true,
  data: [],
  error: null
}
```

### 9. Run All Tests Script

```bash
#!/bin/bash
# run-all-tests.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check Node.js version
check_node_version() {
    print_status "Checking Node.js version..."
    
    if ! command -v node >/dev/null 2>&1; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    local node_version=$(node -v | sed 's/v//')
    local required_version="16.14.0"
    
    if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" = "$required_version" ]; then
        print_success "Node.js version $node_version is compatible"
    else
        print_warning "Node.js version $node_version might not be compatible"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        print_success "Dependencies installed"
    else
        print_warning "No package.json found"
    fi
}

# Run linting
run_linting() {
    print_status "Running ESLint..."
    
    if command -v npx >/dev/null 2>&1; then
        npx eslint "**/*.test.{ts,tsx}" "**/*.spec.{ts,tsx}" || {
            print_warning "Linting found issues"
        }
    fi
}

# Run type checking
run_type_checking() {
    print_status "Running TypeScript type checking..."
    
    if [ -f "tsconfig.test.json" ]; then
        npx tsc --noEmit --project tsconfig.test.json || {
            print_error "Type checking failed"
            exit 1
        }
        print_success "Type checking passed"
    fi
}

# Clear Jest cache
clear_jest_cache() {
    print_status "Clearing Jest cache..."
    npx jest --clearCache >/dev/null 2>&1 || true
}

# Run tests
run_tests() {
    print_status "Running all tests..."
    
    # Unit tests
    print_status "Running unit tests..."
    npm run test:unit || exit 1
    
    # Integration tests
    print_status "Running integration tests..."
    npm run test:integration || exit 1
    
    # Accessibility tests
    print_status "Running accessibility tests..."
    npm run test:accessibility || exit 1
    
    # Performance tests
    print_status "Running performance tests..."
    npm run test:performance || print_warning "Performance tests had issues"
    
    # Coverage
    print_status "Running coverage tests..."
    npm run test:coverage || exit 1
    
    print_success "All tests completed successfully!"
}

# Main execution
main() {
    print_status "Starting test execution for {module-name}..."
    
    check_node_version
    install_dependencies
    run_linting
    run_type_checking
    clear_jest_cache
    run_tests
    
    print_success "Test execution completed!"
}

main "$@"
```

## 🚀 Cách sử dụng Template

### 1. Tạo thư mục __tests__

```bash
# Tạo cấu trúc thư mục
mkdir -p {module-name}/__tests__/{__mocks__,components,hooks,utils,services,accessibility,performance,integration}

# Copy các file template
cp TEMPLATE_GUIDE_TESTING.md {module-name}/__tests__/
```

### 2. Thay thế placeholders

Thay thế các placeholder sau trong tất cả files:
- `{module-name}` → tên module thực tế
- `{Component}` → tên component thực tế
- `{useHook}` → tên hook thực tế
- `{utility}` → tên utility function thực tế
- `{service}` → tên service thực tế

### 3. Cài đặt dependencies

```bash
cd {module-name}/__tests__
npm install
```

### 4. Chạy tests

```bash
# Chạy tất cả tests
npm test

# Chạy tests với coverage
npm run test:coverage

# Chạy tests theo loại
npm run test:unit
npm run test:integration
npm run test:accessibility
npm run test:performance

# Hoặc sử dụng script
./run-all-tests.sh
```

## 📋 Checklist triển khai

- [ ] Tạo cấu trúc thư mục __tests__
- [ ] Copy và customize các file cấu hình
- [ ] Tạo mock data phù hợp với module
- [ ] Viết tests cho components
- [ ] Viết tests cho hooks
- [ ] Viết tests cho utilities
- [ ] Viết tests cho services
- [ ] Viết accessibility tests
- [ ] Viết performance tests
- [ ] Viết integration tests
- [ ] Cấu hình CI/CD pipeline
- [ ] Đạt coverage threshold
- [ ] Document test cases

## 🎯 Best Practices

1. **Test Structure**: Sử dụng describe/test hierarchy rõ ràng
2. **Mock Data**: Tạo mock data realistic và đa dạng
3. **Assertions**: Sử dụng assertions cụ thể và có ý nghĩa
4. **Cleanup**: Luôn cleanup sau mỗi test
5. **Performance**: Đo lường và kiểm tra performance
6. **Accessibility**: Đảm bảo tuân thủ WCAG guidelines
7. **Coverage**: Đạt minimum 80% coverage
8. **Documentation**: Document các test cases phức tạp

---

> Template này cung cấp foundation hoàn chỉnh để triển khai testing cho bất kỳ general module nào trong dự án CaterSoft. Customize theo nhu cầu cụ thể của từng module.