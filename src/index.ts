import { parse as acornParse } from 'acorn';
import { Program } from 'estree';
import { name as isValidIdentifierName } from 'estree-util-is-identifier-name';
import { load as parseYaml } from 'js-yaml';
import { Root, YAML } from 'mdast';
import { MDXJSEsm } from 'mdast-util-mdx';
import { parse as parseToml } from 'toml';
import { Attacher } from 'unified';

type FrontMatterRecord = Record<string, unknown>;

export interface RemarkMdxFrontmatterOptions {
  /**
   * If specified, the YAML data is exported using this name. Otherwise, each
   * object key will be used as an export name.
   *
   * We keep this for shorthand and backward compatibility. You can also use
   * `renderer` option for more control
   */
  name?: string;
  /**
   * A custom renderer for the frontmatter export.
   */
  renderer?: RemarkMdxFrontmatterRenderer;
}

export type RemarkMdxFrontmatterRenderer = (
  data: Record<string, unknown>,
  options: RemarkMdxFrontmatterOptions,
) => string;

const getValue = (node: YAML): FrontMatterRecord | null => {
  if (node.type === 'yaml') {
    return parseYaml(node.value) as FrontMatterRecord;
  }

  if (node.type === 'toml') {
    return parseToml(node.value) as FrontMatterRecord;
  }

  return null;
};

const defaultRenderer: RemarkMdxFrontmatterRenderer = (data, { name }) => {
  if (name) {
    if (!isValidIdentifierName(name)) {
      throw new Error(
        `If name is specified, this should be a valid identifier name, got: ${JSON.stringify(
          name,
        )}`,
      );
    }

    return `export const ${name} = ${JSON.stringify(data, null, 2)}`;
  }

  //
  return Object.entries(data)
    .filter(([k]) => isValidIdentifierName(k))
    .map(([k, v]) => `export const ${k} = ${JSON.stringify(v, null, 2)};`)
    .join('\n');
};

/**
 * A remark plugin to expose frontmatter data as named exports.
 *
 * @param options - Optional options to configure the output.
 * @returns A unified transformer.
 */
export const remarkMdxFrontmatter: Attacher<[RemarkMdxFrontmatterOptions?]> =
  (options = {}) =>
  (ast) => {
    const renderer = options?.renderer ?? defaultRenderer;

    for (const [index, oldVal] of (ast as Root).children.entries()) {
      const value = getValue(oldVal as YAML);

      if (!value) {
        continue;
      }

      const renderedString = renderer(value, options);

      const { body } = acornParse(renderedString, {
        sourceType: 'module',
        ecmaVersion: 'latest',
      }) as unknown as Program;

      const newVal: MDXJSEsm = {
        type: 'mdxjsEsm',
        value: '',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body,
          },
        },
      };

      // eslint-disable-next-line no-param-reassign
      (ast as Root).children[index] = newVal;
    }
  };
