/** @type {import('remark-mdx-frontmatter').RemarkMdxFrontmatterOptions} */
export default {
  parsers: {
    yaml: (content) => ({ content })
  }
}
