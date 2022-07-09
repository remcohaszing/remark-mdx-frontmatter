import { promises as fs, readdirSync } from 'fs';
import { join } from 'path';

import { compile, compileSync } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import { test } from 'uvu';
import { equal, throws } from 'uvu/assert';

import { remarkMdxFrontmatter } from './index.js';

const tests = readdirSync('__fixtures__');

for (const name of tests) {
  test(name, async () => {
    const path = join('__fixtures__', name);
    const input = await fs.readFile(join(path, 'input.md'));
    const expected = join(path, 'expected.jsx');
    const options = JSON.parse(await fs.readFile(join(path, 'options.json'), 'utf8'));
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
    equal(value, await fs.readFile(expected, 'utf8'));
  });
}

test('custom parser', async () => {
  const { value } = await compile('---\nfoo: bar\n---\n', {
    remarkPlugins: [
      remarkFrontmatter,
      [remarkMdxFrontmatter, { parsers: { yaml: (content: string) => ({ content }) } }],
    ],
    jsx: true,
  });
  equal(
    value,
    `/*@jsxRuntime automatic @jsxImportSource react*/
export const content = "foo: bar";
function _createMdxContent(props) {
  return <></>;
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
export default MDXContent;
`,
  );
});

test('unsupported types', () => {
  throws(
    () =>
      compileSync('---\nunsupported value\n---\n', {
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        jsx: true,
      }),
    'Expected frontmatter data to be an object, got:\nunsupported value',
  );
});

test('invalid name', () => {
  throws(
    () =>
      compileSync('---\n\n---\n', {
        remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'Not valid' }]],
        jsx: true,
      }),
    'If name is specified, this should be a valid identifier name, got: "Not valid"',
  );
});

test('invalid yaml key', () => {
  throws(
    () =>
      compileSync('---\ninvalid identifier:\n---\n', {
        remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter]],
        jsx: true,
      }),
    'Frontmatter keys should be valid identifiers, got: "invalid identifier"',
  );
});

test.run();
