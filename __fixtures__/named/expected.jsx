/*@jsxRuntime automatic @jsxImportSource react*/
export const frontmatter = {
  "title": "Hello frontmatter",
  "index": 1,
  "nested": {
    "data": {
      "structure": {
        "including": {
          "numbers": 42,
          "booleans": true,
          "": null,
          "arrays": ["of", "items"]
        }
      }
    }
  }
};
function _createMdxContent(props) {
  return <></>;
}
export default function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
