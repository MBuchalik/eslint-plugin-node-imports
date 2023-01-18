module.exports = {
  root: true,
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },

  // Ignore all folders except for '/src'.
  ignorePatterns: ['/*', '!/src'],

  overrides: [
    {
      files: ['*.ts'],
      extends: ['eslint-config-mbuchalik'],
    },
  ],
};
