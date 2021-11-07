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
    const options = JSON.parse(await fs.readFile(join(path, 'options.json')));
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

test('unsupported types', (t) => {
  t.throws(
    () =>
      compileSync('---\nunsupported value\n---\n', {
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        jsx: true,
      }),
    'Expected frontmatter data to be an object, got:\n---yaml\nunsupported value\n---',
  );
  t.end();
});

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
