export class Lexer {
  public text: string;
  public ch;
  public tokens: any[];
  public index: number;
  public lex(text: string) {
    this.text = text;
    this.index = 0;
    this.ch = undefined;
    this.tokens = [];
    const length = this.text.length;
    while (this.index < length) {
      const number = "";
      this.ch = this.text.charAt(this.index);
      if (this.isNumber(this.ch) || (this.ch === "." && this.isNumber(this.peek()))) {
        this.readNumber();
      } else {
        throw new Error("Unexpected next character:" + this.ch);
      }
    }
    return this.tokens;
  }
  public isNumber(ch: any) {
    return 0 <= +ch && +ch <= 9;
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
  public peek(): string | boolean {
    return this.index < this.text.length - 1 ? this.text.charAt(this.index + 1) : false;
  }
  public isExpOperator(ch: any) {
    return ch === "-" || ch === "+" || this.isNumber(ch);
  }
}
