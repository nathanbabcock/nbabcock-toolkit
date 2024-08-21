import js from '@eslint/js'
import solid from 'eslint-plugin-solid'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended'
import * as tsParser from '@typescript-eslint/parser'
import globals from 'globals'

const globalIgnores = {
  ignores: ['node_modules', 'dist', 'out', '.gitignore'],
}

const jsConfigs = [
  js.configs.recommended,
  {
    rules: {
      'no-constant-condition': ['warn', { checkLoops: false }],
    },
  },
]

const tsConfigs = [
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', 'electron.vite.config.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['tsconfig.web.json', 'tsconfig.node.json'],
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
          'ts-check': 'allow-with-description',
        },
      ],
    },
  },
]

const browserConfigs = [
  {
    files: ['renderer/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
]

const solidConfigs = [
  solid.configs['flat/typescript'],
  {
    rules: {
      'solid/no-destructure': 'off',
    },
  },
]

export default [
  // combine all configs
  ...jsConfigs,
  ...tsConfigs,
  ...browserConfigs,
  ...solidConfigs,
  prettier,
  globalIgnores,
]
