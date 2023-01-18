import { Rule } from 'eslint';
import type { ImportDeclaration } from 'estree';

/**
 * A list of NodeJS core modules.
 * Sub-modules (like `fs/promises`) are not part of this list.
 *
 * This list contains the core modules found in NodeJS 19.2.0.
 *
 * To generate this list, run
 * ```
 * require('module').builtinModules.filter(item => !item.includes('/'));
 * ```
 *
 * In this eslint rule, we use a fixed list instead of dynamically determining the core modules,
 * so that the linter is consistent independent of the system it is running on.
 */
const nodeCoreModules = [
  '_http_agent',
  '_http_client',
  '_http_common',
  '_http_incoming',
  '_http_outgoing',
  '_http_server',
  '_stream_duplex',
  '_stream_passthrough',
  '_stream_readable',
  '_stream_transform',
  '_stream_wrap',
  '_stream_writable',
  '_tls_common',
  '_tls_wrap',
  'assert',
  'async_hooks',
  'buffer',
  'child_process',
  'cluster',
  'console',
  'constants',
  'crypto',
  'dgram',
  'diagnostics_channel',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'http2',
  'https',
  'inspector',
  'module',
  'net',
  'os',
  'path',
  'perf_hooks',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'sys',
  'timers',
  'tls',
  'trace_events',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'wasi',
  'worker_threads',
  'zlib',
] as const;

type NodeCoreModuleName = (typeof nodeCoreModules)[number];

/**
 * The "options" tuple of the rule context.
 */
type Options = [FirstOption | undefined];
interface FirstOption {
  allowList: NodeCoreModuleName[];
}

const noNodeImports: Rule.RuleModule = {
  meta: {
    type: 'problem',
    schema: [
      {
        type: 'object',
        properties: {
          allowList: {
            type: 'array',
            items: {
              type: 'string',
              enum: nodeCoreModules,
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create: (context) => {
    const allowList = (context.options as Options)[0]?.allowList ?? [];

    return {
      ImportDeclaration: (node: ImportDeclaration): void => {
        if (node.source.value === undefined) {
          return;
        }

        if (typeof node.source.value !== 'string') {
          return;
        }

        if (
          isNodeImport(node.source.value) &&
          !isOnAllowList(node.source.value, allowList)
        ) {
          context.report({
            message: 'Do not import Node.js core modules.',
            node: node.source,
          });
        }
      },
    };
  },
};

export = noNodeImports;

function isNodeImport(importName: string): boolean {
  /*
    To improve the performance of our rule, only take those imports into account that start with a lowercase letter or "_".
    Other imports are definitely not Node.js core module imports.
  */
  const couldBeBuiltinModule = new RegExp('^[a-z_]');
  if (!couldBeBuiltinModule.test(importName)) {
    return false;
  }

  for (const singleBuiltinModule of nodeCoreModules) {
    if (isImportFromNodeModuleOrSubmodule(importName, singleBuiltinModule)) {
      return true;
    }
  }

  return false;
}

function isImportFromNodeModuleOrSubmodule(
  importName: string,
  moduleName: string,
): boolean {
  const NODE_PREFIX = 'node:';

  if (importName.startsWith(NODE_PREFIX)) {
    importName = importName.replace(NODE_PREFIX, '');
  }

  if (importName === moduleName) {
    return true;
  }
  if (importName.startsWith(`${moduleName}/`)) {
    return true;
  }

  return false;
}

function isOnAllowList(
  importName: string,
  allowList: NodeCoreModuleName[],
): boolean {
  for (const singleAllowListItem of allowList) {
    if (isImportFromNodeModuleOrSubmodule(importName, singleAllowListItem)) {
      return true;
    }
  }

  return false;
}
