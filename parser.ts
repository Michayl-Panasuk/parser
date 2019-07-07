import { AST } from "./ast";
import { ASTCompiler } from "./compiler";
import { Lexer } from "./lexer";

/**
 * @description The Parser is responsible for combining the low-level steps. It
 * doesn’t do very much itself, but instead delegates the heavy lifting to the Lexer, the
 * AST Builder, and the AST Compiler.
 */
export class Parser {
  public ast: AST;
  public astCompiler: ASTCompiler;
  constructor(public lexer: Lexer) {
    this.ast = new AST(lexer);
    this.astCompiler = new ASTCompiler(this.ast);
  }
  // It takes an expression string and returns a function that executes that expression in a certain context
  public parse(text: string) {
    return this.astCompiler.compile(text);
  }
}
