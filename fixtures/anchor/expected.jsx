/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
export const frontmatter = (() => {
  const $0 = {
    title: 'Hello frontmatter'
  }
  return {
    original: $0,
    reference: $0
  }
})()
function _createMdxContent(props) {
  return <></>
}
export default function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {}
  return MDXLayout ? (
    <MDXLayout {...props}>
      <_createMdxContent {...props} />
    </MDXLayout>
  ) : (
    _createMdxContent(props)
  )
}
