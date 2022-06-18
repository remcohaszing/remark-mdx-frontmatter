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
function _createMdxContent(props) {
  return <></>;
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
export default MDXContent;
