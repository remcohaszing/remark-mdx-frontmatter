import assert from 'node:assert/strict'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { test } from 'node:test'

import { compile, compileSync } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const fixturesDir = new URL('../fixtures/', import.meta.url)
const tests = await readdir(fixturesDir)

for (const name of tests) {
  test(name, async () => {
    const url = new URL(`${name}/`, fixturesDir)
    const input = await readFile(new URL('input.md', url))
    const expected = new URL('expected.jsx', url)
    const options: unknown = JSON.parse(await readFile(new URL('options.json', url), 'utf8'))
    const { value } = await compile(input, {
      remarkPlugins: [
        [remarkFrontmatter, ['yaml', 'toml']],
        [remarkMdxFrontmatter, options]
      ],
      jsx: true
    })
    if (process.argv.includes('--write')) {
      await writeFile(expected, value)
    }
    assert.equal(value, await readFile(expected, 'utf8'))
  })
}

test('custom parser', async () => {
  const { value } = await compile('---\nfoo: bar\n---\n', {
    remarkPlugins: [
      remarkFrontmatter,
      [remarkMdxFrontmatter, { parsers: { yaml: (content: string) => ({ content }) } }]
    ],
    jsx: true
  })
  assert.equal(
    value,
    `/*@jsxRuntime automatic @jsxImportSource react*/
export const frontmatter = {
  "content": "foo: bar"
};
function _createMdxContent(props) {
  return <></>;
}
export default function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
`
  )
})

test('invalid name', () => {
  assert.throws(
    () =>
      compileSync('---\n\n---\n', {
        remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'Not valid' }]],
        jsx: true
      }),
    'If name is specified, this should be a valid identifier name, got: "Not valid"'
  )
})
