import { Lexer } from "./lexer";
import { Parser } from "./parser";

export function parse(expr: string) {
  const lexer = new Lexer();
  const parser = new Parser(lexer);
  return parser.parse(expr);
}

// cot a = parse("{a: 2}")();