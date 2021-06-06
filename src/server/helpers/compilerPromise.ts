import { Compiler } from 'webpack';

export default (name: string, compiler: Compiler): Promise<void> => {
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      // eslint-disable-next-line no-console
      console.log(`Compiling ${name}, please wait...`);
    });

    compiler.hooks.done.tap(name, (stats) => {
      if (!stats.hasErrors()) {
        // eslint-disable-next-line no-console
        console.log(`Successfully compiled ${name}`);
        return resolve();
      }

      return reject(new Error(`Failed to compile ${name}`));
    });
  });
};
