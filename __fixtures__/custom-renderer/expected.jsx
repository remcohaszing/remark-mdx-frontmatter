/*@jsxRuntime automatic @jsxImportSource react*/
export const getStaticProps = async () => {
  return {
    props: {
      "title": "Hello frontmatter"
    }
  };
};
function MDXContent(props = {}) {
  const _components = Object.assign({}, props.components), {wrapper: MDXLayout} = _components;
  const _content = <></>;
  return MDXLayout ? <MDXLayout {...props}>{_content}</MDXLayout> : _content;
}
export default MDXContent;
