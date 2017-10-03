import fs from 'fs';
import path from 'path';
import {isMatch} from 'micromatch';
import {minify} from 'html-minifier';

export default function ({types: t}) {
  return {
    visitor: {
      ImportDeclaration(link, state) {
        const {
          include = '*.html',
          htmlMinifier = {}
        } = state.opts;

        const node = link.node;
        const source = node.source.value;

        if (!isMatch(source, include, {matchBase: true})) {
          return;
        }

        const directory = path.dirname(path.resolve(state.file.opts.filename));
        const file = path.resolve(directory, source);
        let html;

        try {
          html = fs.readFileSync(file, 'utf8');
        } catch (err) {
          throw link.buildCodeFrameError('Imported file could not be found');
        }

        html = minify(html, htmlMinifier);

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
