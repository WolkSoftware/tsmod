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
