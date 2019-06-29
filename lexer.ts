export class Lexer {
  public text: string;
  public ch: string = undefined;
  public tokens: any[];
  public index: number = 0;
  public lex(text: string) {
    this.text = text;
    this.index = 0;
    this.ch = undefined;
    this.tokens = [];
    const length = this.text.length;
    while (this.index < length) {
      this.ch = this.text.charAt(this.index);
      if (this.isNumber(this.ch) || (this.ch === "." && this.isNumber(this.peek()))) {
        this.readNumber();
      } else if (this.ch === "'" || this.ch === '"') {
        this.readString(this.ch);
      } else if (this.isIdent(this.ch)) {
        this.readIdent();
      } else if (this.isWhitespace(this.ch)) {
        this.index++;
      } else {
        throw new Error("Unexpected next character:" + this.ch);
      }
    }
    return this.tokens;
  }
  public isNumber(ch: any) {
    return 0 <= +ch && +ch <= 9;
  }
  public isWhitespace = function(ch) {
    return ch === " " || ch === "\r" || ch === "\t" || ch === "\n " || ch === "\v" || ch === "\u00A0";
  };
  public readString(quote: "'" | '"') {
    // increment the character index to get past the opening quote character
    this.index++;
    let string = "";
    let escape = false;
    while (this.index < this.text.length) {
      const ch = this.text.charAt(this.index);
      if (escape) {
        if (ch === "u") {
          const hex = this.text.substring(this.index + 1, this.index + 5);
          if (!hex.match(/[\da-f]{4}/i)) {
            throw new Error("Invalid unicode escape");
          }
          this.index += 4;
          string += String.fromCharCode(parseInt(hex, 16));
        } else {
          const replacement = ESCAPES[ch];
          if (replacement) {
            string += replacement;
          } else {
            string += ch;
          }
        }

        escape = false;
      } else if (ch === quote) {
        this.index++;
        this.tokens.push({
          text: string,
          value: string,
        });
        return;
      } else if (ch === "\\") {
        escape = true;
      } else {
        string += ch;
      }
      this.index++;
    }
  }
  public readNumber() {
    let number = "";
    while (this.index < this.text.length) {
      const ch = this.text.charAt(this.index).toLowerCase();
      if (ch === "." || this.isNumber(ch)) {
        number += ch;
      } else {
        // parse scientific numbers
        const nextCh = this.peek();
        const prevCh = number.charAt(number.length - 1);
        if (ch === "e" && this.isExpOperator(nextCh)) {
          number += ch;
        } else if (this.isExpOperator(ch) && prevCh === "e" && nextCh && this.isNumber(nextCh)) {
          number += ch;
        } else if (this.isExpOperator(ch) && prevCh === "e" && (!nextCh || !this.isNumber(nextCh))) {
          throw new Error("Invalid exponent");
        } else {
          break;
        }
      }
      this.index++;
    }
    this.tokens.push({
      text: number,
      value: Number(number),
    });
  }
  public readIdent() {
    let text = "";
    while (this.index < this.text.length) {
      const ch = this.text.charAt(this.index);
      if (this.isIdent(ch) || this.isNumber(ch)) {
        text += ch;
      } else {
        break;
      }
      this.index++;
    }
    const token = { text };
    this.tokens.push(token);
  }
  public peek(): string | boolean {
    return this.index < this.text.length - 1 ? this.text.charAt(this.index + 1) : false;
  }
  public isExpOperator(ch: any) {
    return ch === "-" || ch === "+" || this.isNumber(ch);
  }
  public isIdent(ch) {
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_" || ch === "$";
  }
}
const ESCAPES = { "n": "\n", "f": "\f", "r": "\r", "t": "\t", "v": "\v", "'": "'", '"': '"' };
