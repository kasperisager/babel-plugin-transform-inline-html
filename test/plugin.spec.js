import test from 'ava';
import {transform} from 'babel-core';
import plugin from '../src/plugin';

test('transforms an HTML import to an inline string literal', t => {
  const {code} = transform(
    `
    import foo from './fixtures/foo.html'
    `,
    {
      filename: __filename,
      plugins: [
        plugin
      ]
    }
  );

  t.snapshot(code);
});
