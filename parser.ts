import { AST } from "./ast";
import { ASTCompiler } from "./compiler";
import { Lexer } from "./lexer";

export class Parser {
  public ast: AST;
  public astCompiler: ASTCompiler;
  constructor(public lexer: Lexer) {
    this.ast = new AST(lexer);
    this.astCompiler = new ASTCompiler(this.ast);
  }

  public parse(text: string) {
    return this.astCompiler.compile(text);
  }
}
