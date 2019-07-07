import isNull from "lodash/isNull";
import isString from "lodash/isString";
import map from "lodash/map";
import { AST, ASTTypes } from "./ast";

export class ASTCompiler {
  public stringEscapeRegex = /[^ a-zA-Z0-9]/g;
  public state;
  constructor(public astBuilder: AST) {}
  public compile(text: string) {
    const ast = this.astBuilder.ast(text);
    // AST compilation will be done here
    this.state = { body: [] };
    this.recurse(ast);
    return new Function(this.state.body.join());
  }
  public recurse(ast) {
    // TODO check type checking here TS typeof casting
    switch (ast.type) {
      case ASTTypes.Program:
        this.state.body.push("return ", this.recurse(ast.body), ";");
        break;
      case ASTTypes.Literal:
        return this.escape(ast.value);
      case ASTTypes.ArrayExpression:
        const elements = map(ast.elements, (elem) => this.recurse(elem));
        return "[" + elements.join(",") + "]";
      case ASTTypes.ObjectExpression:
        const properties =
          (ast.properties &&
            ast.properties.map((property) => {
              const key = property.key.type === ASTTypes.Identifier ? property.key.name : this.escape(property.key.value);
              const value = this.recurse(property.value);
              return key + ":" + value;
            })) ||
          [];
        return "{" + properties.join(",") + "}";
    }
  }
  /**
   * @description the numeric unicode value of the character we’re
   * escaping (using charCodeAt), and convert it into the corresponding hexadecimal (base 16)
   * unicode escape sequence that we can safely concatenate into the generated JavaScript code:
   * @param c
   */
  public stringEscapeFn(c: string) {
    return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
  }
  private escape(value) {
    if (isString(value)) {
      // AST compiler encounters characters like ’ and " in literals, it just puts them in the result,
      // which results in invalid JavaScript code. The escape method of the compiler should be
      // able to handle these characters.
      return "'" + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'";
    } else if (isNull(value)) {
      return "null";
    } else {
      return value;
    }
  }
}
