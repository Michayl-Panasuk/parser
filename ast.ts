import { Lexer } from "./lexer";

export class AST {
  public tokens: any;
  constructor(public lexer: Lexer) {}
  public ast(text: string): ASTNode {
    this.tokens = this.lexer.lex(text);
    return new ASTProgram();
  }
}

export abstract class ASTNode {
  public type: ASTTypes;

  constructor(type: ASTTypes) {
    this.type = type;
  }
}

class ASTProgram extends ASTNode {
  public body;
  constructor(body) {
    super(ASTTypes.Program);
    this.body = body;
  }
}
class ASTConstant extends ASTNode {
  public value;
  constructor(value) {
    super(ASTTypes.Literal);
    this.value = value;
  }
}
export enum ASTTypes {
  Program,
  Literal,
}
