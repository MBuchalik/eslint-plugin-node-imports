import { RuleTester } from 'eslint';

import noNodeImport from './no-node-import';

const tester = new RuleTester({
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

const defaultErrors = [{ message: 'Do not import Node.js core modules.' }];

tester.run('no-node-import', noNodeImport, {
  valid: [
    { code: `import { item } from 'non-core-module';` },
    {
      options: [
        {
          allowList: ['fs'],
        },
      ],
      code: `import { chmod } from 'fs';`,
    },
    {
      options: [
        {
          allowList: ['fs'],
        },
      ],
      code: `import { chmod } from 'node:fs';`,
    },
    {
      options: [
        {
          allowList: ['fs'],
        },
      ],
      code: `import { chmod } from 'fs/foo/bar';`,
    },
    {
      options: [
        {
          allowList: ['fs'],
        },
      ],
      code: `import { chmod } from 'node:fs/foo/bar';`,
    },
  ],
  invalid: [
    {
      code: `import { chmod } from 'fs';`,
      errors: defaultErrors,
    },
    {
      code: `import { chmod } from 'node:fs';`,
      errors: defaultErrors,
    },
    {
      code: `import { chmod } from 'fs/foo/bar';`,
      errors: defaultErrors,
    },
    {
      code: `import { chmod } from 'node:fs/foo/bar';`,
      errors: defaultErrors,
    },
    {
      options: [
        {
          allowList: ['path'],
        },
      ],
      code: `import { chmod } from 'fs';`,
      errors: defaultErrors,
    },
  ],
});
