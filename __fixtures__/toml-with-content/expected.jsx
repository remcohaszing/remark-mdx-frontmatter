/*@jsxRuntime automatic @jsxImportSource react*/
export const title = "Hello TOML";
function MDXContent(props = {}) {
  const _components = Object.assign({
    h1: "h1",
    p: "p"
  }, props.components), {wrapper: MDXLayout} = _components;
  const _content = <><_components.h1>{"Hello, World"}</_components.h1>{"\n"}<_components.p>{"Some content"}</_components.p></>;
  return MDXLayout ? <MDXLayout {...props}>{_content}</MDXLayout> : _content;
}
export default MDXContent;
