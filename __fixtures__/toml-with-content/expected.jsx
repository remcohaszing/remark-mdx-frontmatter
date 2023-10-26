/*@jsxRuntime automatic @jsxImportSource react*/
export const frontmatter = {
  __proto__: null,
  "title": "Hello TOML"
};
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    p: "p",
    ...props.components
  };
  return <><_components.h1>{"Hello, World"}</_components.h1>{"\n"}<_components.p>{"Some content"}</_components.p></>;
}
export default function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
