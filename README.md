# eslint-plugin-node-imports

> An ESLint plugin that contains a rule to prevent imports from Node.js core modules

Have you ever accidentally made an import from a Node.js core module like `assert` or `fs` in an environment that does not support these core modules? `eslint-plugin-node-imports` helps: This plugin contains a rule that forbids imports from Node.js core modules.

## Usage

First, install this eslint plugin:

```
npm install --save-dev eslint-plugin-node-imports
```

Then, add the following to the `plugins` sections of your eslint config file:

```js
plugins: ['node-imports'],
```

Finally, you can activate the rule:

```js
rules: {
  'node-imports/no-node-import': 'error',
}
```

## Advanced configuration

It is possible to allow certain modules. For instance, to allow the "fs" module, use the following setting:

```js
rules: {
  'node-imports/no-node-import': ['error', { allowList: ['fs'] }],
}
```

**Important:** It is only possible to allow top-level modules. If, for instance, you want to allow imports from `assert/strict`, you have to allow the entire `assert` module:

```js
rules: {
  'node-imports/no-node-import': ['error', { allowList: ['assert'] }],
}
```

## Examples

Examples of **incorrect** code:

```ts
// 'node-imports/no-node-import': 'error',
import { chmod } from 'fs';

import { chmod } from 'node:fs';

import { fail } from 'assert/strict';

// 'node-imports/no-node-import': ['error', { allowList: ['path'] }],
import { chmod } from 'fs';

import { chmod } from 'node:fs';

import { fail } from 'assert/strict';
```

Examples of **correct** code:

```ts
// 'node-imports/no-node-import': 'error',
import { item } from 'non-core-module';

import { item } from '../util';

// 'node-imports/no-node-import': ['error', { allowList: ['fs'] }],
import { chmod } from 'fs';

import { chmod } from 'node:fs';
```
