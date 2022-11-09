/*@jsxRuntime automatic @jsxImportSource react*/
export {default as featureImage} from "../../some-image.png";
export const title = "Hello frontmatter", index = 1;
function _createMdxContent(props) {
  return <></>;
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
export default MDXContent;
