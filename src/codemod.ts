import { Project, SourceFile } from "ts-morph";
import { Options } from "./cli";
import { normalize, join } from "path";

export type Transform = (file: SourceFile, transformArgs: {}) => string;

const tsConfigFilePath = "./tsconfig.json";

export function loadTransform(transformPath: string): Transform | undefined {
  const actualPath = join(process.cwd(), normalize(transformPath));
  const module = require(actualPath);
  const keys = Object.keys(module);
  if (keys.length > 0) {
    const transformName = keys[0];
    const transform: Transform = module[transformName];
    if (typeof transform === "function") {
      return transform;
    }
  }
}

export function runCodemod(
  filePath: string,
  transform: Transform,
  transformArgs: {},
  options: Options
) {
  try {
    const project = new Project({
      tsConfigFilePath: tsConfigFilePath,
      addFilesFromTsConfig: false
    });
    project.addExistingSourceFile(filePath);
    const personFile = project.getSourceFile(filePath);
    if (personFile) {
      return transform(personFile, transformArgs);
    }
  } catch (err) {
    if (!options.silent) {
      throw err;
    }
  }
}
