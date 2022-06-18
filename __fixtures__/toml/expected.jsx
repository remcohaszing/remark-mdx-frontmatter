/*@jsxRuntime automatic @jsxImportSource react*/
export const title = "Hello TOML";
function _createMdxContent(props) {
  return <></>;
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
export default MDXContent;
