import { Project, SourceFile } from "ts-morph";
import { Options } from "./cli";
import { normalize, join, parse } from "path";
import { readFile } from "fs";
import { promisify } from "util";
import { transpileModule } from "typescript";

export type Transform = (file: SourceFile, transformArgs: {}) => string;
const readFileAsync = promisify(readFile);
const tsConfigFilePath = "./tsconfig.json";

export async function loadTransform(
  transformPath: string
): Promise<Transform | undefined> {
  const actualPath = join(process.cwd(), normalize(transformPath));
  const buffer = await readFileAsync(actualPath);
  const tsSource = buffer.toString();
  const jsSource = transpileModule(tsSource, {}).outputText;
  const tramsform = eval(jsSource);
  return tramsform;
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
