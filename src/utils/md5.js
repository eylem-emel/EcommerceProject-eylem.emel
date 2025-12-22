// src/utils/md5.js
// Minimal MD5 implementation – Gravatar için yeterli

export function md5(str) {
  function cmn(q, a, b, x, s, t) {
    a = (a + q + x + t) | 0;
    return (((a << s) | (a >>> (32 - s))) + b) | 0;
  }
  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function md5cycle(x, k) {
    let a = x[0],
      b = x[1],
      c = x[2],
      d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);

    x[0] = (x[0] + a) | 0;
    x[1] = (x[1] + b) | 0;
    x[2] = (x[2] + c) | 0;
    x[3] = (x[3] + d) | 0;
  }

  function md5blk(s) {
    const blocks = [];
    for (let i = 0; i < 64; i += 4) {
      blocks[i >> 2] =
        s.charCodeAt(i) +
        (s.charCodeAt(i + 1) << 8) +
        (s.charCodeAt(i + 2) << 16) +
        (s.charCodeAt(i + 3) << 24);
    }
    return blocks;
  }

  function md51(s) {
    const txt = unescape(encodeURIComponent(s));
    const state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    for (i = 64; i <= txt.length; i += 64) {
      md5cycle(state, md5blk(txt.substring(i - 64, i)));
    }
    return state;
  }

  function rhex(n) {
    const hex = "0123456789abcdef";
    let s = "";
    for (let j = 0; j < 4; j++) {
      s +=
        hex.charAt((n >> (j * 8 + 4)) & 0x0f) +
        hex.charAt((n >> (j * 8)) & 0x0f);
    }
    return s;
  }

  return md51(str)
    .map(rhex)
    .join("");
}
