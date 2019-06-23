import { AST, ASTNode, ASTTypes } from "./ast";

export class ASTCompiler {
  public state;
  constructor(public astBuilder: AST) {}
  public compile(text: string) {
    const ast = this.astBuilder.ast(text);
    // AST compilation will be done here
    this.state = { body: [] };
    this.recurse(ast);
    return new Function(this.state.body.join());
  }
  public recurse(ast: ASTNode) {
    // TODO check type checking here TS typeof casting
    switch (ast.type) {
      case ASTTypes.Program:
        this.state.body.push("return ", this.recurse(ast.body), ";");
        break;
      case ASTTypes.Literal:
        return ast.value;
    }
  }
}
