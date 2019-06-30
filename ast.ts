import { Lexer } from "./lexer";
// tslint:disable: max-classes-per-file
export class AST {
  public tokens: any;
  constructor(public lexer: Lexer) {}
  public ast(text: string) {
    this.tokens = this.lexer.lex(text);
    return this.program();
  }

  public arrayDeclaration() {
    const elements = [];
    if (!this.peek("]")) {
      do {
        // allow trailing comma in arrays
        if (this.peek("]")) {
          break;
        }
        elements.push(this.primary());
      } while (this.expect(","));
    }
    this.consume("]");
    return { type: ASTTypes.ArrayExpression, elements };
  }

  public constant() {
    return { type: ASTTypes.Literal, value: this.consume().value };
  }

  public program() {
    return { type: ASTTypes.Program, body: this.primary() };
  }
  public primary() {
    if (this.expect("[")) {
      return this.arrayDeclaration();
    } else if (constants.hasOwnProperty(this.tokens[0].text)) {
      return constants[this.consume().text];
    } else {
      return this.constant();
    }
  }
  public expect(e) {
    const token = this.peek(e);
    if (token) {
      return this.tokens.shift();
    }
  }

  public peek(e) {
    if (this.tokens.length > 0) {
      const text = this.tokens[0].text;
      if (text === e || !e) {
        return this.tokens[0];
      }
    }
  }

  public consume(e?) {
    const token = this.expect(e);
    if (!token) {
      throw new Error("Unexpected. Expecting:" + e);
    }
    return token;
  }
}
export enum ASTTypes {
  Program,
  Literal,
  ArrayExpression,
}

export const constants = {
  null: { type: ASTTypes.Literal, value: null },
  true: { type: ASTTypes.Literal, value: true },
  false: { type: ASTTypes.Literal, value: false },
};
