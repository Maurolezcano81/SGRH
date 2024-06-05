module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true, // Añadido para soportar código Node.js
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended', // Añadido para soporte TypeScript
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Añadido para soportar JSX
    },
  },
  settings: {
    react: {
      version: '18.2',
    },
  },
  plugins: [
    'react-refresh',
  ],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off', // Añadido para desactivar la regla de prop-types si usas TypeScript
    'no-console': 'warn', // Añadido para advertir sobre el uso de console.log
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Añadido para advertir sobre variables no usadas en TypeScript
  },
};
