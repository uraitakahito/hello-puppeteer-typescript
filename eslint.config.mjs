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
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs'],
  },

  //
  // Base configurations
  //
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  //
  // TypeScript parser options
  //
  {
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
    rules: {
      // 命名規則 (Google TypeScript Style Guide ベース)
      '@typescript-eslint/naming-convention': [
        'warn',
        // 変数: camelCase
        {
          selector: 'variable',
          format: ['camelCase'],
        },
        // boolean変数: プレフィックス必須
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['camelCase'],
          prefix: ['can', 'did', 'has', 'is', 'must', 'need', 'should', 'will'],
        },
        // enum/enumMember: UPPER_CASE
        {
          selector: ['enum', 'enumMember'],
          format: ['UPPER_CASE'],
        },
        // function: camelCase
        {
          selector: 'function',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // accessor: camelCase
        {
          selector: 'accessor',
          format: ['camelCase'],
        },
        // parameter: camelCase
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // class: PascalCase
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        // typeAlias: PascalCase
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        // typeParameter: PascalCase
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
        },
      ],
    },
  },

  //
  // Override for config files
  //
  {
    files: ['vite.config.*[cmjt]*s', 'vitest.config.*[cmjt]*s'],
    rules: {
      '@typescript-eslint/naming-convention': 'off',
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-anonymous-default-export': 'off',
    },
  },
);
