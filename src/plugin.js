import fs from 'fs';
import path from 'path';
import {isMatch} from 'micromatch';

export default function ({types: t}) {
  return {
    visitor: {
      ImportDeclaration(link, state) {
        const {
          include = '*.html'
        } = state.opts;

        const node = link.node;
        const source = node.source.value;

        if (!isMatch(source, include, {matchBase: true})) {
          return;
        }

        const directory = path.dirname(path.resolve(state.file.opts.filename));
        const file = path.resolve(directory, source);
        const html = fs.readFileSync(file, 'utf8');

        const {name} = node.specifiers[0].local;

        link.replaceWith(
          t.variableDeclaration('var', [
            t.variableDeclarator(
              t.identifier(name),
              t.stringLiteral(html)
            )
          ])
        );
      }
    }
  };
}
