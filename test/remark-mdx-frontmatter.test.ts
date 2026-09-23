import { compile } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { testFixturesDirectory } from 'snapshot-fixtures'

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
