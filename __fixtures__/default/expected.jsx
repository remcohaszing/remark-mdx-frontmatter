/*@jsxRuntime automatic @jsxImportSource react*/
export const title = "Hello frontmatter";
export const index = 1;
export const nested = {
  "data": {
    "structure": {
      "including": {
        "numbers": 42,
        "booleans": true,
        "null": null,
        "dates": "2015-10-10T00:00:00.000Z",
        "datetimes": "2015-10-10T10:00:00.000Z",
        "timezones": "2015-10-10T01:00:00.000Z",
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
