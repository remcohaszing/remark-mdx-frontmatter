import { promises as fs, readdirSync } from 'fs';
import { createRequire } from 'module';
import { join } from 'path';

import { compile, compileSync } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import test from 'tape';

const { remarkMdxFrontmatter } = createRequire(import.meta.url)('./src/index.ts');

const tests = readdirSync('__fixtures__');

for (const name of tests) {
  test(name, async (t) => {
    const path = join('__fixtures__', name);
    const input = await fs.readFile(join(path, 'input.md'));
    const expected = join(path, 'expected.jsx');
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { default: options } = await import(`./__fixtures__/${name}/options.mjs`);
    const { value } = await compile(input, {
      remarkPlugins: [
        [remarkFrontmatter, ['yaml', 'toml']],
        [remarkMdxFrontmatter, options],
      ],
      jsx: true,
    });
    if (process.argv.includes('--write')) {
      await fs.writeFile(expected, value);
    }
    t.equal(value, await fs.readFile(expected, 'utf8'));
    t.end();
  });
}

// Behavior slightly changed: option does not throw if no data is exported
test('invalid name', (t) => {
  t.throws(
    () =>
      compileSync('---\n\n---\n', {
        remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'Not valid' }]],
        jsx: true,
      }),
    'If name is specified, this should be a valid identifier name, got: "Not valid"',
  );
  t.end();
});

test('invalid yaml key', (t) => {
  t.throws(
    () =>
      compileSync('---\ninvalid identifier:\n---\n', {
        remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter]],
        jsx: true,
      }),
    'Frontmatter keys should be valid identifiers, got: "invalid identifier"',
  );
  t.end();
});
