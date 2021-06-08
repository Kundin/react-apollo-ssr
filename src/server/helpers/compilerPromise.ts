/* eslint-disable no-console */

import { Compiler } from 'webpack';

export default (name: string, compiler: Compiler): Promise<void> => {
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      console.log(`Compiling ${name}, please wait...`);
    });

    compiler.hooks.done.tap(name, (stats) => {
      if (!stats.hasErrors()) {
        console.log(`Successfully compiled ${name}`);

        return resolve();
      }

      return reject(new Error(`Failed to compile ${name}`));
    });
  });
};
