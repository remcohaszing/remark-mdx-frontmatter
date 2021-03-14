import { Program } from 'estree';
import { name as isValidIdentifierName } from 'estree-util-is-identifier-name';
import { Value, valueToEstree } from 'estree-util-value-to-estree';
import { load } from 'js-yaml';
import { parse } from 'toml';
import { Attacher } from 'unified';
import { Node, Parent } from 'unist';
import * as visit from 'unist-util-visit';

export interface RemarkMdxFrontmatterOptions {
  /**
   * If specified, the YAML data is exported using this name. Otherwise, each
   * object key will be used as an export name.
   */
  name?: string;
}

/**
 * A remark plugin to expose frontmatter data as named exports.
 *
 * @param options - Optional options to configure the output.
 * @returns A unified transformer.
 */
export const remarkMdxFrontmatter: Attacher<[RemarkMdxFrontmatterOptions?]> = ({ name } = {}) => (
  ast,
) => {
  const imports: Node[] = [];

  if (name && !isValidIdentifierName(name)) {
    throw new Error(
      `If name is specified, this should be a valid identifier name, got: ${JSON.stringify(name)}`,
    );
  }

  visit(ast as Parent, (node) => {
    let data: Value;
    if (node.type === 'yaml') {
      data = load(node.value as string) as Value;
    } else if (node.type === 'toml') {
      data = parse(node.value as string);
    }
    if (data == null) {
      return;
    }
    if (!name && typeof data !== 'object') {
      throw new Error(`Expected frontmatter data to be an object, got:\n${node.value}`);
    }

    imports.push({
      type: 'mdxjsEsm',
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportNamedDeclaration',
              source: null,
              specifiers: [],
              declaration: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: Object.entries(name ? { [name]: data } : data).map(
                  ([identifier, value]) => {
                    if (!isValidIdentifierName(identifier)) {
                      throw new Error(
                        `Frontmatter keys should be valid identifiers, got: ${JSON.stringify(
                          identifier,
                        )}`,
                      );
                    }
                    return {
                      type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: identifier },
                      init: valueToEstree(value),
                    };
                  },
                ),
              },
            },
          ],
        } as Program,
      },
    });
  });
  (ast as Parent).children.unshift(...imports);
};
