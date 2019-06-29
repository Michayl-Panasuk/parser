import { Lexer } from "./lexer";
// tslint:disable: max-classes-per-file
export class AST {
  public tokens: any;
  constructor(public lexer: Lexer) {}
  public ast(text: string) {
    this.tokens = this.lexer.lex(text);
    return this.program();
  }

  public constant() {
    return { type: ASTTypes.Literal, value: this.tokens[0].value };
  }

  public program() {
    return { type: ASTTypes.Program, body: this.primary() };
  }
  public primary() {
    if (constants.hasOwnProperty(this.tokens[0].text)) {
      return constants[this.tokens[0].text];
    } else {
      return this.constant();
    }
  }
}
export enum ASTTypes {
  Program,
  Literal,
}

export const constants = {
  null: { type: ASTTypes.Literal, value: null },
  true: { type: ASTTypes.Literal, value: true },
  false: { type: ASTTypes.Literal, value: false },
};
