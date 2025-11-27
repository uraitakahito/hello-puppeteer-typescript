// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import importXPlugin from 'eslint-plugin-import-x';

export default defineConfig(
  //
  // Global ignores
  //
  {
    ignores: ['dist/**', 'node_modules/**', '.Trash-*/**'],
  },

  //
  // Base configurations (TypeScript files only)
  //
  {
    files: ['src/**/*.ts', 'test/**/*.ts', 'vitest.config.mts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  //
  // Import plugin configuration
  //
  {
    files: ['src/**/*.ts', 'test/**/*.ts', 'vitest.config.mts'],
    plugins: {
      // @ts-expect-error Type mismatch between eslint-plugin-import-x and ESLint Plugin type
      'import-x': importXPlugin,
    },
    settings: {
      'import-x/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // ES モジュールのファイル拡張子を必須化
      // TypeScript では .ts ファイルを .js 拡張子でインポートするため、
      // ts/tsx は 'never' に設定し、js/mjs/cjs は 'always' に設定
      'import-x/extensions': [
        'error',
        'always',
        {
          ignorePackages: true,
          checkTypeImports: true,
          pattern: {
            ts: 'never',
            tsx: 'never',
          },
        },
      ],
      // 匿名デフォルトエクスポートを禁止
      'import-x/no-anonymous-default-export': ['error', { allowCallExpression: false }],
    },
  },

  //
  // Custom rules
  //
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    rules: {
      // 命名規則 (TypeScript Handbook + JavaScript慣習 + ESLint推奨)
      // 参考: https://typescript-eslint.io/rules/naming-convention/
      //       https://basarat.gitbook.io/typescript/styleguide
      '@typescript-eslint/naming-convention': [
        'warn',
        // デフォルト: camelCase、アンダースコア許容
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        // 変数: camelCase + UPPER_CASE（定数用）
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
        },
        // destructured 変数: 外部由来を許容
        {
          selector: 'variable',
          modifiers: ['destructured'],
          format: null,
        },
        // パラメータ: camelCase、先頭アンダースコア許容
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // 関数: camelCase（React コンポーネント等は PascalCase も許容）
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        // アクセサ: camelCase
        {
          selector: 'accessor',
          format: ['camelCase'],
        },
        // 型関連: PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // enum: PascalCase
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
        // enumMember: PascalCase
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
        // import: camelCase + PascalCase
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
      ],
    },
  },

  //
  // Override for config files
  //
  {
    files: ['vitest.config.mts'],
    rules: {
      'import-x/no-anonymous-default-export': 'off',
    },
  },
);
