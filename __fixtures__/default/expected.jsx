/*@jsxRuntime automatic @jsxImportSource react*/
export const title = "Hello frontmatter", index = 1, nested = {
  "data": {
    "structure": {
      "including": {
        "numbers": 42,
        "booleans": true,
        "null": null,
        "dates": new Date(1444435200000),
        "datetimes": new Date(1444471200000),
        "timezones": new Date(1444438800000),
        "arrays": ["of", "items"]
      }
    }
  }
};
function MDXContent(props = {}) {
  const _components = Object.assign({}, props.components), {wrapper: MDXLayout} = _components;
  const _content = <></>;
  return MDXLayout ? <MDXLayout {...props}>{_content}</MDXLayout> : _content;
}
export default MDXContent;
