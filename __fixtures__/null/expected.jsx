/*@jsxRuntime automatic @jsxImportSource react*/
function MDXContent(props = {}) {
  const _components = Object.assign({}, props.components), {wrapper: MDXLayout} = _components;
  const _content = <></>;
  return MDXLayout ? <MDXLayout {...props}>{_content}</MDXLayout> : _content;
}
export default MDXContent;
