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
      if (this.isNumber(this.ch)) {
        this.readNumber();
      } else {
        throw new Error("Unexpected next character:" + this.ch);
      }
    }
    return this.tokens;
  }
  public isNumber(ch: string) {
    return 0 <= +ch && +ch <= 9;
  }
  public readNumber() {
    let number = "";
    while (this.index < this.text.length) {
      const ch = this.text.charAt(this.index);
      if (ch === "." || this.isNumber(ch)) {
        number += ch;
      } else {
        break;
      }
      this.index++;
    }
    this.tokens.push({
      text: number,
      value: Number(number),
    });
  }
}
