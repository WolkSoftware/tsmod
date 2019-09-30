# Tsmod

Refactor TypScript code programmatically using codemods.

## Installation

```
npm install -g tsmod
```

## Usage

The following example applies the transform `./var_to_const_tramsform.ts` to the files `./fileA.ts` and `./fileB.ts`:

```sh
tsmod -t ./var_to_const_tramsform.ts ./fileA.ts ./fileB.ts
```

> **Please Note**: A `tsconfig.json` file is expected in the current directory when you run the previous command.

## Transform example

The transfroms are powered by `ts-morph` you can learn more about the API at [https://ts-morph.com](https://ts-morph.com/manipulation/).

The following example changes all `var` variable declarations into `const` variable declarations:

```ts
import { SourceFile, SyntaxKind, VariableDeclarationKind } from "ts-morph";

export const varToConstTransform = (file: SourceFile, transformArgs: {}) => {
  // Find all variable declarations in source file
  const variableStatements = file.getDescendantsOfKind(
    SyntaxKind.VariableStatement
  );
  // Change var for const for each statement
  variableStatements.forEach(variableStatement => {
    const declarationKind = variableStatement.getDeclarationKind();
    if (declarationKind === VariableDeclarationKind.Var) {
      variableStatement.setDeclarationKind(VariableDeclarationKind.Const);
    }
  });
  // Return source code
  const updatedSourceCode = file.getText();
  return updatedSourceCode;
};
```

## Options

For additional help use the following:

```sh
tsmod -h
```
