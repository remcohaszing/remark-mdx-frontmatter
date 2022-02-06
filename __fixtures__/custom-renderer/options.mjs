const renderer = (data) => `
export const getStaticProps = async () => {
  return {
    props: ${JSON.stringify(data, null, 2)}
  }
}
`;

export default {
  renderer,
};
