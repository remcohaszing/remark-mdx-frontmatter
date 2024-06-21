import assert from 'node:assert/strict'
import { test } from 'node:test'

import { compile, compileSync } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { assertEqual, testFixturesDirectory } from 'snapshot-fixtures'

testFixturesDirectory({
  directory: new URL('../fixtures', import.meta.url),
  prettier: true,
  write: true,
  tests: {
    'expected.jsx'(file, options) {
      return compile(file, {
        remarkPlugins: [
          [remarkFrontmatter, ['yaml', 'toml']],
          [remarkMdxFrontmatter, options]
        ],
        jsx: true
      })
    }
  }
})

test('custom parser', async () => {
  const { value } = await compile('---\nfoo: bar\n---\n', {
    remarkPlugins: [
      remarkFrontmatter,
      [remarkMdxFrontmatter, { parsers: { yaml: (content: string) => ({ content }) } }]
    ],
    jsx: true
  })

  assertEqual(
    String(value),
    `/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
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
    /Name should be a valid identifier, got: "Not valid"/
  )
})
