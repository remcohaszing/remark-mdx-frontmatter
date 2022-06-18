/*@jsxRuntime automatic @jsxImportSource react*/
export const title = "Hello TOML";
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: "h1",
    p: "p"
  }, props.components);
  return <><_components.h1>{"Hello, World"}</_components.h1>{"\n"}<_components.p>{"Some content"}</_components.p></>;
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
export default MDXContent;
