import type remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const options: remarkMdxFrontmatter.Options = {
  parsers: {
    yaml: (content) => ({ content })
  }
}

export default options
