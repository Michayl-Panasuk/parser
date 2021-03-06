import { Lexer } from "./lexer";
// tslint:disable: max-classes-per-file
/**
 * @description The AST Builder takes the array of tokens generated by the lexer, and builds up an
 * Abstract Syntax Tree (AST) from them. The tree represents the syntactic structure
 * of the expression as nested JavaScript objects.
 */
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

  public object() {
    const properties = [];
    // consume the keys and values separated by commas:
    if (!this.peek("}")) {
      do {
        const property = { type: ASTTypes.Property, key: undefined, value: undefined };
        if (this.peek().identifier) {
          property.key = this.identifier();
        } else {
          property.key = this.constant();
        }

        this.consume(":");
        // consume the value, which is a whole other primary AST node that we attach onto the property
        property.value = this.primary();
        properties.push(property);
      } while (this.expect(","));
    }
    this.consume("}");
    return { type: ASTTypes.ObjectExpression, properties };
  }
  public primary() {
    if (this.expect("[")) {
      return this.arrayDeclaration();
    } else if (this.expect("{")) {
      return this.object();
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

  public peek(e?) {
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

  public identifier() {
    return { type: ASTTypes.Identifier, name: this.consume().text };
  }
}
export enum ASTTypes {
  Program,
  Literal,
  ArrayExpression,
  ObjectExpression,
  Property,
  Identifier,
}

export const constants = {
  null: { type: ASTTypes.Literal, value: null },
  true: { type: ASTTypes.Literal, value: true },
  false: { type: ASTTypes.Literal, value: false },
};
