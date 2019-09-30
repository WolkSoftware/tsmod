import arg from "arg";

enum CommandOptions {
  help = "--help",
  dry = "--dry",
  version = "--version",
  transform = "--transform",
  silent = "--silent",
  print = "--print",
  args = "--args"
}

enum CommandAliases {
  help = "-h",
  version = "-v",
  transform = "-t",
  dry = "-d",
  print = "-p",
  silent = "-s",
  args = "-a"
}

enum CommandDescriptions {
  help = "print this help and exit",
  version = "show more information about the transform process",
  transform = "path to the transform file (default: ./transform.ts)",
  dry = "dry run (no changes are made to files)",
  print = "print transformed files to stdout, useful for development",
  silent = "do not write to stdout or stderr",
  args = "arguments to be passed to the transform"
}

export function getVersion() {
  return "1.0.7";
}

export function printHelp() {
  const keys: (keyof typeof CommandOptions)[] = Object.keys(
    CommandOptions
  ) as any;
  const output = [
    "\nUsage: tsmod [OPTION]... FILE_PATH...",
    "  or:  tsmod [OPTION]... -t TRANSFORM_PATH FILE_PATH...\n",
    "Apply transform logic in TRANSFORM_PATH to every FILE_PATH\n",
    "Options:",
    ...keys.map(
      k =>
        `  ${CommandAliases[k]}, ${CommandOptions[k]} ${CommandDescriptions[k]}`
    )
  ];
  output.forEach(l => console.log(l));
}

export function parseArgumentsIntoOptions(rawArgs: string[]) {
  const args = arg(
    {
      [CommandOptions.help]: Boolean,
      [CommandOptions.dry]: Boolean,
      [CommandOptions.version]: Boolean,
      [CommandOptions.transform]: String,
      [CommandOptions.silent]: Boolean,
      [CommandOptions.print]: Boolean,
      [CommandOptions.args]: [String],
      [CommandAliases.help]: CommandOptions.help,
      [CommandAliases.version]: CommandOptions.version,
      [CommandAliases.transform]: CommandOptions.transform,
      [CommandAliases.dry]: CommandOptions.dry,
      [CommandAliases.print]: CommandOptions.print,
      [CommandAliases.silent]: CommandOptions.silent,
      [CommandAliases.args]: CommandOptions.args
    },
    {
      argv: rawArgs.slice(2)
    }
  );

  const defaultTransform = "./transform.ts";
  const transformArgs = args[CommandOptions.args];

  return {
    paths: args["_"],
    transform: args[CommandOptions.transform] || defaultTransform,
    help: args[CommandOptions.help] || false,
    version: args[CommandOptions.version] || false,
    dry: args[CommandOptions.dry] || false,
    print: args[CommandOptions.print] || false,
    silent: args[CommandOptions.silent] || false,
    args:
      transformArgs === undefined
        ? []
        : transformArgs.map(a => {
            const parts = a.split("=");
            return {
              [parts[0]]: parts[1]
            };
          })
  };
}

export type Options = ReturnType<typeof parseArgumentsIntoOptions>;
