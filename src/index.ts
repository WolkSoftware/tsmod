import { parseArgumentsIntoOptions, printHelp, getVersion } from "./cli";
import { runCodemod, loadTransform } from "./codemod";
import { writeFile } from "fs";
import { promisify } from "util";

const writeFileAsync = promisify(writeFile);

export function main(args: string[]) {
  const options = parseArgumentsIntoOptions(args);

  if (options.version) {
    const version = getVersion();
    console.log(`v${version}`);
  }

  if (options.help) {
    printHelp();
  } else {
    const transform = loadTransform(options.transform);
    if (transform === undefined) {
      if (!options.silent) {
        throw new Error(`Invalid transform ${options.transform}`);
      }
    } else {
      Promise.all(
        options.paths.map(async path => {
          const source = runCodemod(path, transform, options.args, options);
          if (options.print) {
            console.log(`${path}\n\n${source}`);
          }
          if (!options.dry) {
            return await writeFileAsync(path, source);
          }
        })
      );
    }
  }
}

main(process.argv);
