import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['node_modules/', '.next/', 'dist/', 'build/', '.env*', 'coverage/', '*.d.ts'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: true,
        JSX: true,
        // Browser globals
        window: true,
        document: true,
        navigator: true,
        alert: true,
        console: true,
        setTimeout: true,
        setInterval: true,
        clearTimeout: true,
        clearInterval: true,
        requestAnimationFrame: true,
        cancelAnimationFrame: true,
        fetch: true,
        URL: true,
        URLSearchParams: true,
        process: true,
        // Analytics globals
        gtag: true,
        // DOM elements
        HTMLElement: true,
        HTMLDivElement: true,
        HTMLSpanElement: true,
        HTMLButtonElement: true,
        HTMLAnchorElement: true,
        HTMLInputElement: true,
        HTMLTextAreaElement: true,
        HTMLCanvasElement: true,
        HTMLHeadingElement: true,
        HTMLImageElement: true,
        HTMLVideoElement: true,
        HTMLAudioElement: true,
        HTMLFormElement: true,
        HTMLSelectElement: true,
        HTMLLabelElement: true,
        HTMLUListElement: true,
        HTMLLIElement: true,
        HTMLTableElement: true,
        HTMLParagraphElement: true,
        // Events
        Event: true,
        MouseEvent: true,
        KeyboardEvent: true,
        TouchEvent: true,
        ScrollBehavior: true,
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...tsPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info'],
        },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
