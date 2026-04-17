const Os = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12
}, Ci = {
  pluz: "plus",
  wknd: "weekend",
  "week-end": "weekend",
  wks: "weeks",
  wk: "week",
  b4: "before",
  frdy: "fri",
  tmrw: "tomorrow",
  tmrrw: "tomorrow",
  "2mrw": "tomorrow"
}, pa = [
  // anchors
  "today",
  "tomorrow",
  "yesterday",
  // modifiers / periods
  "next",
  "last",
  "past",
  "this",
  "week",
  "weeks",
  "month",
  "months",
  "year",
  "years",
  "weekend",
  // weekdays
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  // months
  "january",
  "february",
  "march",
  "april",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
  // connectives
  "through",
  "until",
  "before",
  "after",
  // holiday roots (single-word forms)
  "christmas",
  "halloween",
  "thanksgiving",
  "valentine",
  "valentines",
  "memorial",
  "independence"
], $s = new Set(pa), Rs = 4;
function gt(n) {
  return n.trim().toLowerCase().replace(/\s+/g, " ");
}
function Ys(n) {
  const e = gt(n);
  if (!e)
    return "";
  const t = e.split(" "), r = [];
  for (const o of t) {
    const i = o.replace(/[.,]+$/g, ""), a = Ci[o] ?? Ci[i];
    if (a) {
      r.push(a);
      continue;
    }
    r.push(Ps(i));
  }
  return r.join(" ");
}
function xs(n, e) {
  const t = n.length, r = e.length;
  if (t === 0) return r;
  if (r === 0) return t;
  const o = Array.from({ length: t + 1 }, () => new Array(r + 1).fill(0));
  for (let i = 0; i <= t; i += 1) o[i][0] = i;
  for (let i = 0; i <= r; i += 1) o[0][i] = i;
  for (let i = 1; i <= t; i += 1)
    for (let a = 1; a <= r; a += 1) {
      const c = n[i - 1] === e[a - 1] ? 0 : 1;
      o[i][a] = Math.min(o[i - 1][a] + 1, o[i][a - 1] + 1, o[i - 1][a - 1] + c), i > 1 && a > 1 && n[i - 1] === e[a - 2] && n[i - 2] === e[a - 1] && (o[i][a] = Math.min(o[i][a], o[i - 2][a - 2] + 1));
    }
  return o[t][r];
}
function Ps(n) {
  if (n.length < Rs || $s.has(n))
    return n;
  for (const e of pa)
    if (!(Math.abs(e.length - n.length) > 1) && xs(n, e) === 1)
      return e;
  return n;
}
function Ns(n) {
  return n.replace(/(\d+)(st|nd|rd|th)$/i, "$1");
}
function vo(n) {
  const e = gt(n);
  return /^\d+$/.test(e) ? Number(e) : Os[e] ?? null;
}
class l extends Array {
  constructor(e, t) {
    if (super(e), this.sign = t, Object.setPrototypeOf(this, l.prototype), e > l.__kMaxLength) throw new RangeError("Maximum BigInt size exceeded");
  }
  static BigInt(e) {
    var t = Math.floor, r = Number.isFinite;
    if (typeof e == "number") {
      if (e === 0) return l.__zero();
      if (l.__isOneDigitInt(e)) return 0 > e ? l.__oneDigit(-e, !0) : l.__oneDigit(e, !1);
      if (!r(e) || t(e) !== e) throw new RangeError("The number " + e + " cannot be converted to BigInt because it is not an integer");
      return l.__fromDouble(e);
    }
    if (typeof e == "string") {
      const o = l.__fromString(e);
      if (o === null) throw new SyntaxError("Cannot convert " + e + " to a BigInt");
      return o;
    }
    if (typeof e == "boolean") return e === !0 ? l.__oneDigit(1, !1) : l.__zero();
    if (typeof e == "object") {
      if (e.constructor === l) return e;
      const o = l.__toPrimitive(e);
      return l.BigInt(o);
    }
    throw new TypeError("Cannot convert " + e + " to a BigInt");
  }
  toDebugString() {
    const e = ["BigInt["];
    for (const t of this) e.push((t && (t >>> 0).toString(16)) + ", ");
    return e.push("]"), e.join("");
  }
  toString(e = 10) {
    if (2 > e || 36 < e) throw new RangeError("toString() radix argument must be between 2 and 36");
    return this.length === 0 ? "0" : e & e - 1 ? l.__toStringGeneric(this, e, !1) : l.__toStringBasePowerOfTwo(this, e);
  }
  valueOf() {
    throw new Error("Convert JSBI instances to native numbers using `toNumber`.");
  }
  static toNumber(e) {
    const t = e.length;
    if (t === 0) return 0;
    if (t === 1) {
      const w = e.__unsignedDigit(0);
      return e.sign ? -w : w;
    }
    const r = e.__digit(t - 1), o = l.__clz30(r), i = 30 * t - o;
    if (1024 < i) return e.sign ? -1 / 0 : 1 / 0;
    let a = i - 1, c = r, d = t - 1;
    const u = o + 3;
    let h = u === 32 ? 0 : c << u;
    h >>>= 12;
    const m = u - 12;
    let f = 12 <= u ? 0 : c << 20 + u, y = 20 + u;
    for (0 < m && 0 < d && (d--, c = e.__digit(d), h |= c >>> 30 - m, f = c << m + 2, y = m + 2); 0 < y && 0 < d; ) d--, c = e.__digit(d), f |= 30 <= y ? c << y - 30 : c >>> 30 - y, y -= 30;
    const g = l.__decideRounding(e, y, d, c);
    if ((g === 1 || g === 0 && (1 & f) == 1) && (f = f + 1 >>> 0, f === 0 && (h++, h >>> 20 != 0 && (h = 0, a++, 1023 < a)))) return e.sign ? -1 / 0 : 1 / 0;
    const p = e.sign ? -2147483648 : 0;
    return a = a + 1023 << 20, l.__kBitConversionInts[l.__kBitConversionIntHigh] = p | a | h, l.__kBitConversionInts[l.__kBitConversionIntLow] = f, l.__kBitConversionDouble[0];
  }
  static unaryMinus(e) {
    if (e.length === 0) return e;
    const t = e.__copy();
    return t.sign = !e.sign, t;
  }
  static bitwiseNot(e) {
    return e.sign ? l.__absoluteSubOne(e).__trim() : l.__absoluteAddOne(e, !0);
  }
  static exponentiate(e, t) {
    if (t.sign) throw new RangeError("Exponent must be positive");
    if (t.length === 0) return l.__oneDigit(1, !1);
    if (e.length === 0) return e;
    if (e.length === 1 && e.__digit(0) === 1) return e.sign && !(1 & t.__digit(0)) ? l.unaryMinus(e) : e;
    if (1 < t.length) throw new RangeError("BigInt too big");
    let r = t.__unsignedDigit(0);
    if (r === 1) return e;
    if (r >= l.__kMaxLengthBits) throw new RangeError("BigInt too big");
    if (e.length === 1 && e.__digit(0) === 2) {
      const a = 1 + (0 | r / 30), c = e.sign && (1 & r) != 0, d = new l(a, c);
      d.__initializeDigits();
      const u = 1 << r % 30;
      return d.__setDigit(a - 1, u), d;
    }
    let o = null, i = e;
    for (1 & r && (o = e), r >>= 1; r !== 0; r >>= 1) i = l.multiply(i, i), 1 & r && (o === null ? o = i : o = l.multiply(o, i));
    return o;
  }
  static multiply(e, t) {
    if (e.length === 0) return e;
    if (t.length === 0) return t;
    let r = e.length + t.length;
    30 <= e.__clzmsd() + t.__clzmsd() && r--;
    const o = new l(r, e.sign !== t.sign);
    o.__initializeDigits();
    for (let i = 0; i < e.length; i++) l.__multiplyAccumulate(t, e.__digit(i), o, i);
    return o.__trim();
  }
  static divide(e, t) {
    if (t.length === 0) throw new RangeError("Division by zero");
    if (0 > l.__absoluteCompare(e, t)) return l.__zero();
    const r = e.sign !== t.sign, o = t.__unsignedDigit(0);
    let i;
    if (t.length === 1 && 32767 >= o) {
      if (o === 1) return r === e.sign ? e : l.unaryMinus(e);
      i = l.__absoluteDivSmall(e, o, null);
    } else i = l.__absoluteDivLarge(e, t, !0, !1);
    return i.sign = r, i.__trim();
  }
  static remainder(e, t) {
    if (t.length === 0) throw new RangeError("Division by zero");
    if (0 > l.__absoluteCompare(e, t)) return e;
    const r = t.__unsignedDigit(0);
    if (t.length === 1 && 32767 >= r) {
      if (r === 1) return l.__zero();
      const i = l.__absoluteModSmall(e, r);
      return i === 0 ? l.__zero() : l.__oneDigit(i, e.sign);
    }
    const o = l.__absoluteDivLarge(e, t, !1, !0);
    return o.sign = e.sign, o.__trim();
  }
  static add(e, t) {
    const r = e.sign;
    return r === t.sign ? l.__absoluteAdd(e, t, r) : 0 <= l.__absoluteCompare(e, t) ? l.__absoluteSub(e, t, r) : l.__absoluteSub(t, e, !r);
  }
  static subtract(e, t) {
    const r = e.sign;
    return r === t.sign ? 0 <= l.__absoluteCompare(e, t) ? l.__absoluteSub(e, t, r) : l.__absoluteSub(t, e, !r) : l.__absoluteAdd(e, t, r);
  }
  static leftShift(e, t) {
    return t.length === 0 || e.length === 0 ? e : t.sign ? l.__rightShiftByAbsolute(e, t) : l.__leftShiftByAbsolute(e, t);
  }
  static signedRightShift(e, t) {
    return t.length === 0 || e.length === 0 ? e : t.sign ? l.__leftShiftByAbsolute(e, t) : l.__rightShiftByAbsolute(e, t);
  }
  static unsignedRightShift() {
    throw new TypeError("BigInts have no unsigned right shift; use >> instead");
  }
  static lessThan(e, t) {
    return 0 > l.__compareToBigInt(e, t);
  }
  static lessThanOrEqual(e, t) {
    return 0 >= l.__compareToBigInt(e, t);
  }
  static greaterThan(e, t) {
    return 0 < l.__compareToBigInt(e, t);
  }
  static greaterThanOrEqual(e, t) {
    return 0 <= l.__compareToBigInt(e, t);
  }
  static equal(e, t) {
    if (e.sign !== t.sign || e.length !== t.length) return !1;
    for (let r = 0; r < e.length; r++) if (e.__digit(r) !== t.__digit(r)) return !1;
    return !0;
  }
  static notEqual(e, t) {
    return !l.equal(e, t);
  }
  static bitwiseAnd(e, t) {
    var r = Math.max;
    if (!e.sign && !t.sign) return l.__absoluteAnd(e, t).__trim();
    if (e.sign && t.sign) {
      const o = r(e.length, t.length) + 1;
      let i = l.__absoluteSubOne(e, o);
      const a = l.__absoluteSubOne(t);
      return i = l.__absoluteOr(i, a, i), l.__absoluteAddOne(i, !0, i).__trim();
    }
    return e.sign && ([e, t] = [t, e]), l.__absoluteAndNot(e, l.__absoluteSubOne(t)).__trim();
  }
  static bitwiseXor(e, t) {
    var r = Math.max;
    if (!e.sign && !t.sign) return l.__absoluteXor(e, t).__trim();
    if (e.sign && t.sign) {
      const a = r(e.length, t.length), c = l.__absoluteSubOne(e, a), d = l.__absoluteSubOne(t);
      return l.__absoluteXor(c, d, c).__trim();
    }
    const o = r(e.length, t.length) + 1;
    e.sign && ([e, t] = [t, e]);
    let i = l.__absoluteSubOne(t, o);
    return i = l.__absoluteXor(i, e, i), l.__absoluteAddOne(i, !0, i).__trim();
  }
  static bitwiseOr(e, t) {
    var r = Math.max;
    const o = r(e.length, t.length);
    if (!e.sign && !t.sign) return l.__absoluteOr(e, t).__trim();
    if (e.sign && t.sign) {
      let a = l.__absoluteSubOne(e, o);
      const c = l.__absoluteSubOne(t);
      return a = l.__absoluteAnd(a, c, a), l.__absoluteAddOne(a, !0, a).__trim();
    }
    e.sign && ([e, t] = [t, e]);
    let i = l.__absoluteSubOne(t, o);
    return i = l.__absoluteAndNot(i, e, i), l.__absoluteAddOne(i, !0, i).__trim();
  }
  static asIntN(e, t) {
    var r = Math.floor;
    if (t.length === 0) return t;
    if (e = r(e), 0 > e) throw new RangeError("Invalid value: not (convertible to) a safe integer");
    if (e === 0) return l.__zero();
    if (e >= l.__kMaxLengthBits) return t;
    const o = 0 | (e + 29) / 30;
    if (t.length < o) return t;
    const i = t.__unsignedDigit(o - 1), a = 1 << (e - 1) % 30;
    if (t.length === o && i < a) return t;
    if ((i & a) !== a) return l.__truncateToNBits(e, t);
    if (!t.sign) return l.__truncateAndSubFromPowerOfTwo(e, t, !0);
    if (!(i & a - 1)) {
      for (let c = o - 2; 0 <= c; c--) if (t.__digit(c) !== 0) return l.__truncateAndSubFromPowerOfTwo(e, t, !1);
      return t.length === o && i === a ? t : l.__truncateToNBits(e, t);
    }
    return l.__truncateAndSubFromPowerOfTwo(e, t, !1);
  }
  static asUintN(e, t) {
    var r = Math.floor;
    if (t.length === 0) return t;
    if (e = r(e), 0 > e) throw new RangeError("Invalid value: not (convertible to) a safe integer");
    if (e === 0) return l.__zero();
    if (t.sign) {
      if (e > l.__kMaxLengthBits) throw new RangeError("BigInt too big");
      return l.__truncateAndSubFromPowerOfTwo(e, t, !1);
    }
    if (e >= l.__kMaxLengthBits) return t;
    const o = 0 | (e + 29) / 30;
    if (t.length < o) return t;
    const i = e % 30;
    return t.length == o && (i === 0 || !(t.__digit(o - 1) >>> i)) ? t : l.__truncateToNBits(e, t);
  }
  static ADD(e, t) {
    if (e = l.__toPrimitive(e), t = l.__toPrimitive(t), typeof e == "string") return typeof t != "string" && (t = t.toString()), e + t;
    if (typeof t == "string") return e.toString() + t;
    if (e = l.__toNumeric(e), t = l.__toNumeric(t), l.__isBigInt(e) && l.__isBigInt(t)) return l.add(e, t);
    if (typeof e == "number" && typeof t == "number") return e + t;
    throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
  }
  static LT(e, t) {
    return l.__compare(e, t, 0);
  }
  static LE(e, t) {
    return l.__compare(e, t, 1);
  }
  static GT(e, t) {
    return l.__compare(e, t, 2);
  }
  static GE(e, t) {
    return l.__compare(e, t, 3);
  }
  static EQ(e, t) {
    for (; ; ) {
      if (l.__isBigInt(e)) return l.__isBigInt(t) ? l.equal(e, t) : l.EQ(t, e);
      if (typeof e == "number") {
        if (l.__isBigInt(t)) return l.__equalToNumber(t, e);
        if (typeof t != "object") return e == t;
        t = l.__toPrimitive(t);
      } else if (typeof e == "string") {
        if (l.__isBigInt(t)) return e = l.__fromString(e), e !== null && l.equal(e, t);
        if (typeof t != "object") return e == t;
        t = l.__toPrimitive(t);
      } else if (typeof e == "boolean") {
        if (l.__isBigInt(t)) return l.__equalToNumber(t, +e);
        if (typeof t != "object") return e == t;
        t = l.__toPrimitive(t);
      } else if (typeof e == "symbol") {
        if (l.__isBigInt(t)) return !1;
        if (typeof t != "object") return e == t;
        t = l.__toPrimitive(t);
      } else if (typeof e == "object") {
        if (typeof t == "object" && t.constructor !== l) return e == t;
        e = l.__toPrimitive(e);
      } else return e == t;
    }
  }
  static NE(e, t) {
    return !l.EQ(e, t);
  }
  static DataViewGetBigInt64(e, t, r = !1) {
    return l.asIntN(64, l.DataViewGetBigUint64(e, t, r));
  }
  static DataViewGetBigUint64(e, t, r = !1) {
    const [o, i] = r ? [4, 0] : [0, 4], a = e.getUint32(t + o, r), c = e.getUint32(t + i, r), d = new l(3, !1);
    return d.__setDigit(0, 1073741823 & c), d.__setDigit(1, (268435455 & a) << 2 | c >>> 30), d.__setDigit(2, a >>> 28), d.__trim();
  }
  static DataViewSetBigInt64(e, t, r, o = !1) {
    l.DataViewSetBigUint64(e, t, r, o);
  }
  static DataViewSetBigUint64(e, t, r, o = !1) {
    r = l.asUintN(64, r);
    let i = 0, a = 0;
    if (0 < r.length && (a = r.__digit(0), 1 < r.length)) {
      const u = r.__digit(1);
      a |= u << 30, i = u >>> 2, 2 < r.length && (i |= r.__digit(2) << 28);
    }
    const [c, d] = o ? [4, 0] : [0, 4];
    e.setUint32(t + c, i, o), e.setUint32(t + d, a, o);
  }
  static __zero() {
    return new l(0, !1);
  }
  static __oneDigit(e, t) {
    const r = new l(1, t);
    return r.__setDigit(0, e), r;
  }
  __copy() {
    const e = new l(this.length, this.sign);
    for (let t = 0; t < this.length; t++) e[t] = this[t];
    return e;
  }
  __trim() {
    let e = this.length, t = this[e - 1];
    for (; t === 0; ) e--, t = this[e - 1], this.pop();
    return e === 0 && (this.sign = !1), this;
  }
  __initializeDigits() {
    for (let e = 0; e < this.length; e++) this[e] = 0;
  }
  static __decideRounding(e, t, r, o) {
    if (0 < t) return -1;
    let i;
    if (0 > t) i = -t - 1;
    else {
      if (r === 0) return -1;
      r--, o = e.__digit(r), i = 29;
    }
    let a = 1 << i;
    if (!(o & a)) return -1;
    if (a -= 1, (o & a) != 0) return 1;
    for (; 0 < r; ) if (r--, e.__digit(r) !== 0) return 1;
    return 0;
  }
  static __fromDouble(e) {
    l.__kBitConversionDouble[0] = e;
    const t = 2047 & l.__kBitConversionInts[l.__kBitConversionIntHigh] >>> 20, r = t - 1023, o = (0 | r / 30) + 1, i = new l(o, 0 > e);
    let a = 1048575 & l.__kBitConversionInts[l.__kBitConversionIntHigh] | 1048576, c = l.__kBitConversionInts[l.__kBitConversionIntLow];
    const d = 20, u = r % 30;
    let h, m = 0;
    if (u < 20) {
      const f = d - u;
      m = f + 32, h = a >>> f, a = a << 32 - f | c >>> f, c <<= 32 - f;
    } else if (u === 20) m = 32, h = a, a = c, c = 0;
    else {
      const f = u - d;
      m = 32 - f, h = a << f | c >>> 32 - f, a = c << f, c = 0;
    }
    i.__setDigit(o - 1, h);
    for (let f = o - 2; 0 <= f; f--) 0 < m ? (m -= 30, h = a >>> 2, a = a << 30 | c >>> 2, c <<= 30) : h = 0, i.__setDigit(f, h);
    return i.__trim();
  }
  static __isWhitespace(e) {
    return 13 >= e && 9 <= e || (159 >= e ? e == 32 : 131071 >= e ? e == 160 || e == 5760 : 196607 >= e ? (e &= 131071, 10 >= e || e == 40 || e == 41 || e == 47 || e == 95 || e == 4096) : e == 65279);
  }
  static __fromString(e, t = 0) {
    let r = 0;
    const o = e.length;
    let i = 0;
    if (i === o) return l.__zero();
    let a = e.charCodeAt(i);
    for (; l.__isWhitespace(a); ) {
      if (++i === o) return l.__zero();
      a = e.charCodeAt(i);
    }
    if (a === 43) {
      if (++i === o) return null;
      a = e.charCodeAt(i), r = 1;
    } else if (a === 45) {
      if (++i === o) return null;
      a = e.charCodeAt(i), r = -1;
    }
    if (t === 0) {
      if (t = 10, a === 48) {
        if (++i === o) return l.__zero();
        if (a = e.charCodeAt(i), a === 88 || a === 120) {
          if (t = 16, ++i === o) return null;
          a = e.charCodeAt(i);
        } else if (a === 79 || a === 111) {
          if (t = 8, ++i === o) return null;
          a = e.charCodeAt(i);
        } else if (a === 66 || a === 98) {
          if (t = 2, ++i === o) return null;
          a = e.charCodeAt(i);
        }
      }
    } else if (t === 16 && a === 48) {
      if (++i === o) return l.__zero();
      if (a = e.charCodeAt(i), a === 88 || a === 120) {
        if (++i === o) return null;
        a = e.charCodeAt(i);
      }
    }
    if (r != 0 && t !== 10) return null;
    for (; a === 48; ) {
      if (++i === o) return l.__zero();
      a = e.charCodeAt(i);
    }
    const c = o - i;
    let d = l.__kMaxBitsPerChar[t], u = l.__kBitsPerCharTableMultiplier - 1;
    if (c > 1073741824 / d) return null;
    const h = d * c + u >>> l.__kBitsPerCharTableShift, m = new l(0 | (h + 29) / 30, !1), f = 10 > t ? t : 10, y = 10 < t ? t - 10 : 0;
    if (t & t - 1) {
      m.__initializeDigits();
      let g = !1, p = 0;
      do {
        let w = 0, v = 1;
        for (; ; ) {
          let E;
          if (a - 48 >>> 0 < f) E = a - 48;
          else if ((32 | a) - 97 >>> 0 < y) E = (32 | a) - 87;
          else {
            g = !0;
            break;
          }
          const D = v * t;
          if (1073741823 < D) break;
          if (v = D, w = w * t + E, p++, ++i === o) {
            g = !0;
            break;
          }
          a = e.charCodeAt(i);
        }
        u = 30 * l.__kBitsPerCharTableMultiplier - 1;
        const T = 0 | (d * p + u >>> l.__kBitsPerCharTableShift) / 30;
        m.__inplaceMultiplyAdd(v, w, T);
      } while (!g);
    } else {
      d >>= l.__kBitsPerCharTableShift;
      const g = [], p = [];
      let w = !1;
      do {
        let v = 0, T = 0;
        for (; ; ) {
          let E;
          if (a - 48 >>> 0 < f) E = a - 48;
          else if ((32 | a) - 97 >>> 0 < y) E = (32 | a) - 87;
          else {
            w = !0;
            break;
          }
          if (T += d, v = v << d | E, ++i === o) {
            w = !0;
            break;
          }
          if (a = e.charCodeAt(i), 30 < T + d) break;
        }
        g.push(v), p.push(T);
      } while (!w);
      l.__fillFromParts(m, g, p);
    }
    if (i !== o) {
      if (!l.__isWhitespace(a)) return null;
      for (i++; i < o; i++) if (a = e.charCodeAt(i), !l.__isWhitespace(a)) return null;
    }
    return m.sign = r == -1, m.__trim();
  }
  static __fillFromParts(e, t, r) {
    let o = 0, i = 0, a = 0;
    for (let c = t.length - 1; 0 <= c; c--) {
      const d = t[c], u = r[c];
      i |= d << a, a += u, a === 30 ? (e.__setDigit(o++, i), a = 0, i = 0) : 30 < a && (e.__setDigit(o++, 1073741823 & i), a -= 30, i = d >>> u - a);
    }
    if (i !== 0) {
      if (o >= e.length) throw new Error("implementation bug");
      e.__setDigit(o++, i);
    }
    for (; o < e.length; o++) e.__setDigit(o, 0);
  }
  static __toStringBasePowerOfTwo(e, t) {
    const r = e.length;
    let o = t - 1;
    o = (85 & o >>> 1) + (85 & o), o = (51 & o >>> 2) + (51 & o), o = (15 & o >>> 4) + (15 & o);
    const i = o, a = t - 1, c = e.__digit(r - 1), d = l.__clz30(c);
    let u = 0 | (30 * r - d + i - 1) / i;
    if (e.sign && u++, 268435456 < u) throw new Error("string too long");
    const h = Array(u);
    let m = u - 1, f = 0, y = 0;
    for (let p = 0; p < r - 1; p++) {
      const w = e.__digit(p), v = (f | w << y) & a;
      h[m--] = l.__kConversionChars[v];
      const T = i - y;
      for (f = w >>> T, y = 30 - T; y >= i; ) h[m--] = l.__kConversionChars[f & a], f >>>= i, y -= i;
    }
    const g = (f | c << y) & a;
    for (h[m--] = l.__kConversionChars[g], f = c >>> i - y; f !== 0; ) h[m--] = l.__kConversionChars[f & a], f >>>= i;
    if (e.sign && (h[m--] = "-"), m != -1) throw new Error("implementation bug");
    return h.join("");
  }
  static __toStringGeneric(e, t, r) {
    const o = e.length;
    if (o === 0) return "";
    if (o === 1) {
      let p = e.__unsignedDigit(0).toString(t);
      return r === !1 && e.sign && (p = "-" + p), p;
    }
    const i = 30 * o - l.__clz30(e.__digit(o - 1)), a = l.__kMaxBitsPerChar[t], c = a - 1;
    let d = i * l.__kBitsPerCharTableMultiplier;
    d += c - 1, d = 0 | d / c;
    const u = d + 1 >> 1, h = l.exponentiate(l.__oneDigit(t, !1), l.__oneDigit(u, !1));
    let m, f;
    const y = h.__unsignedDigit(0);
    if (h.length === 1 && 32767 >= y) {
      m = new l(e.length, !1), m.__initializeDigits();
      let p = 0;
      for (let w = 2 * e.length - 1; 0 <= w; w--) {
        const v = p << 15 | e.__halfDigit(w);
        m.__setHalfDigit(w, 0 | v / y), p = 0 | v % y;
      }
      f = p.toString(t);
    } else {
      const p = l.__absoluteDivLarge(e, h, !0, !0);
      m = p.quotient;
      const w = p.remainder.__trim();
      f = l.__toStringGeneric(w, t, !0);
    }
    m.__trim();
    let g = l.__toStringGeneric(m, t, !0);
    for (; f.length < u; ) f = "0" + f;
    return r === !1 && e.sign && (g = "-" + g), g + f;
  }
  static __unequalSign(e) {
    return e ? -1 : 1;
  }
  static __absoluteGreater(e) {
    return e ? -1 : 1;
  }
  static __absoluteLess(e) {
    return e ? 1 : -1;
  }
  static __compareToBigInt(e, t) {
    const r = e.sign;
    if (r !== t.sign) return l.__unequalSign(r);
    const o = l.__absoluteCompare(e, t);
    return 0 < o ? l.__absoluteGreater(r) : 0 > o ? l.__absoluteLess(r) : 0;
  }
  static __compareToNumber(e, t) {
    if (l.__isOneDigitInt(t)) {
      const r = e.sign, o = 0 > t;
      if (r !== o) return l.__unequalSign(r);
      if (e.length === 0) {
        if (o) throw new Error("implementation bug");
        return t === 0 ? 0 : -1;
      }
      if (1 < e.length) return l.__absoluteGreater(r);
      const i = Math.abs(t), a = e.__unsignedDigit(0);
      return a > i ? l.__absoluteGreater(r) : a < i ? l.__absoluteLess(r) : 0;
    }
    return l.__compareToDouble(e, t);
  }
  static __compareToDouble(e, t) {
    if (t !== t) return t;
    if (t === 1 / 0) return -1;
    if (t === -1 / 0) return 1;
    const r = e.sign;
    if (r !== 0 > t) return l.__unequalSign(r);
    if (t === 0) throw new Error("implementation bug: should be handled elsewhere");
    if (e.length === 0) return -1;
    l.__kBitConversionDouble[0] = t;
    const o = 2047 & l.__kBitConversionInts[l.__kBitConversionIntHigh] >>> 20;
    if (o == 2047) throw new Error("implementation bug: handled elsewhere");
    const i = o - 1023;
    if (0 > i) return l.__absoluteGreater(r);
    const a = e.length;
    let c = e.__digit(a - 1);
    const d = l.__clz30(c), u = 30 * a - d, h = i + 1;
    if (u < h) return l.__absoluteLess(r);
    if (u > h) return l.__absoluteGreater(r);
    let m = 1048576 | 1048575 & l.__kBitConversionInts[l.__kBitConversionIntHigh], f = l.__kBitConversionInts[l.__kBitConversionIntLow];
    const y = 20, g = 29 - d;
    if (g !== (0 | (u - 1) % 30)) throw new Error("implementation bug");
    let p, w = 0;
    if (20 > g) {
      const v = y - g;
      w = v + 32, p = m >>> v, m = m << 32 - v | f >>> v, f <<= 32 - v;
    } else if (g === 20) w = 32, p = m, m = f, f = 0;
    else {
      const v = g - y;
      w = 32 - v, p = m << v | f >>> 32 - v, m = f << v, f = 0;
    }
    if (c >>>= 0, p >>>= 0, c > p) return l.__absoluteGreater(r);
    if (c < p) return l.__absoluteLess(r);
    for (let v = a - 2; 0 <= v; v--) {
      0 < w ? (w -= 30, p = m >>> 2, m = m << 30 | f >>> 2, f <<= 30) : p = 0;
      const T = e.__unsignedDigit(v);
      if (T > p) return l.__absoluteGreater(r);
      if (T < p) return l.__absoluteLess(r);
    }
    if (m !== 0 || f !== 0) {
      if (w === 0) throw new Error("implementation bug");
      return l.__absoluteLess(r);
    }
    return 0;
  }
  static __equalToNumber(e, t) {
    var r = Math.abs;
    return l.__isOneDigitInt(t) ? t === 0 ? e.length === 0 : e.length === 1 && e.sign === 0 > t && e.__unsignedDigit(0) === r(t) : l.__compareToDouble(e, t) === 0;
  }
  static __comparisonResultToBool(e, t) {
    return t === 0 ? 0 > e : t === 1 ? 0 >= e : t === 2 ? 0 < e : t === 3 ? 0 <= e : void 0;
  }
  static __compare(e, t, r) {
    if (e = l.__toPrimitive(e), t = l.__toPrimitive(t), typeof e == "string" && typeof t == "string") switch (r) {
      case 0:
        return e < t;
      case 1:
        return e <= t;
      case 2:
        return e > t;
      case 3:
        return e >= t;
    }
    if (l.__isBigInt(e) && typeof t == "string") return t = l.__fromString(t), t !== null && l.__comparisonResultToBool(l.__compareToBigInt(e, t), r);
    if (typeof e == "string" && l.__isBigInt(t)) return e = l.__fromString(e), e !== null && l.__comparisonResultToBool(l.__compareToBigInt(e, t), r);
    if (e = l.__toNumeric(e), t = l.__toNumeric(t), l.__isBigInt(e)) {
      if (l.__isBigInt(t)) return l.__comparisonResultToBool(l.__compareToBigInt(e, t), r);
      if (typeof t != "number") throw new Error("implementation bug");
      return l.__comparisonResultToBool(l.__compareToNumber(e, t), r);
    }
    if (typeof e != "number") throw new Error("implementation bug");
    if (l.__isBigInt(t)) return l.__comparisonResultToBool(l.__compareToNumber(t, e), 2 ^ r);
    if (typeof t != "number") throw new Error("implementation bug");
    return r === 0 ? e < t : r === 1 ? e <= t : r === 2 ? e > t : r === 3 ? e >= t : void 0;
  }
  __clzmsd() {
    return l.__clz30(this.__digit(this.length - 1));
  }
  static __absoluteAdd(e, t, r) {
    if (e.length < t.length) return l.__absoluteAdd(t, e, r);
    if (e.length === 0) return e;
    if (t.length === 0) return e.sign === r ? e : l.unaryMinus(e);
    let o = e.length;
    (e.__clzmsd() === 0 || t.length === e.length && t.__clzmsd() === 0) && o++;
    const i = new l(o, r);
    let a = 0, c = 0;
    for (; c < t.length; c++) {
      const d = e.__digit(c) + t.__digit(c) + a;
      a = d >>> 30, i.__setDigit(c, 1073741823 & d);
    }
    for (; c < e.length; c++) {
      const d = e.__digit(c) + a;
      a = d >>> 30, i.__setDigit(c, 1073741823 & d);
    }
    return c < i.length && i.__setDigit(c, a), i.__trim();
  }
  static __absoluteSub(e, t, r) {
    if (e.length === 0) return e;
    if (t.length === 0) return e.sign === r ? e : l.unaryMinus(e);
    const o = new l(e.length, r);
    let i = 0, a = 0;
    for (; a < t.length; a++) {
      const c = e.__digit(a) - t.__digit(a) - i;
      i = 1 & c >>> 30, o.__setDigit(a, 1073741823 & c);
    }
    for (; a < e.length; a++) {
      const c = e.__digit(a) - i;
      i = 1 & c >>> 30, o.__setDigit(a, 1073741823 & c);
    }
    return o.__trim();
  }
  static __absoluteAddOne(e, t, r = null) {
    const o = e.length;
    r === null ? r = new l(o, t) : r.sign = t;
    let i = 1;
    for (let a = 0; a < o; a++) {
      const c = e.__digit(a) + i;
      i = c >>> 30, r.__setDigit(a, 1073741823 & c);
    }
    return i != 0 && r.__setDigitGrow(o, 1), r;
  }
  static __absoluteSubOne(e, t) {
    const r = e.length;
    t = t || r;
    const o = new l(t, !1);
    let i = 1;
    for (let a = 0; a < r; a++) {
      const c = e.__digit(a) - i;
      i = 1 & c >>> 30, o.__setDigit(a, 1073741823 & c);
    }
    if (i != 0) throw new Error("implementation bug");
    for (let a = r; a < t; a++) o.__setDigit(a, 0);
    return o;
  }
  static __absoluteAnd(e, t, r = null) {
    let o = e.length, i = t.length, a = i;
    if (o < i) {
      a = o;
      const u = e, h = o;
      e = t, o = i, t = u, i = h;
    }
    let c = a;
    r === null ? r = new l(c, !1) : c = r.length;
    let d = 0;
    for (; d < a; d++) r.__setDigit(d, e.__digit(d) & t.__digit(d));
    for (; d < c; d++) r.__setDigit(d, 0);
    return r;
  }
  static __absoluteAndNot(e, t, r = null) {
    const o = e.length, i = t.length;
    let a = i;
    o < i && (a = o);
    let c = o;
    r === null ? r = new l(c, !1) : c = r.length;
    let d = 0;
    for (; d < a; d++) r.__setDigit(d, e.__digit(d) & ~t.__digit(d));
    for (; d < o; d++) r.__setDigit(d, e.__digit(d));
    for (; d < c; d++) r.__setDigit(d, 0);
    return r;
  }
  static __absoluteOr(e, t, r = null) {
    let o = e.length, i = t.length, a = i;
    if (o < i) {
      a = o;
      const u = e, h = o;
      e = t, o = i, t = u, i = h;
    }
    let c = o;
    r === null ? r = new l(c, !1) : c = r.length;
    let d = 0;
    for (; d < a; d++) r.__setDigit(d, e.__digit(d) | t.__digit(d));
    for (; d < o; d++) r.__setDigit(d, e.__digit(d));
    for (; d < c; d++) r.__setDigit(d, 0);
    return r;
  }
  static __absoluteXor(e, t, r = null) {
    let o = e.length, i = t.length, a = i;
    if (o < i) {
      a = o;
      const u = e, h = o;
      e = t, o = i, t = u, i = h;
    }
    let c = o;
    r === null ? r = new l(c, !1) : c = r.length;
    let d = 0;
    for (; d < a; d++) r.__setDigit(d, e.__digit(d) ^ t.__digit(d));
    for (; d < o; d++) r.__setDigit(d, e.__digit(d));
    for (; d < c; d++) r.__setDigit(d, 0);
    return r;
  }
  static __absoluteCompare(e, t) {
    const r = e.length - t.length;
    if (r != 0) return r;
    let o = e.length - 1;
    for (; 0 <= o && e.__digit(o) === t.__digit(o); ) o--;
    return 0 > o ? 0 : e.__unsignedDigit(o) > t.__unsignedDigit(o) ? 1 : -1;
  }
  static __multiplyAccumulate(e, t, r, o) {
    if (t === 0) return;
    const i = 32767 & t, a = t >>> 15;
    let c = 0, d = 0;
    for (let u, h = 0; h < e.length; h++, o++) {
      u = r.__digit(o);
      const m = e.__digit(h), f = 32767 & m, y = m >>> 15, g = l.__imul(f, i), p = l.__imul(f, a), w = l.__imul(y, i), v = l.__imul(y, a);
      u += d + g + c, c = u >>> 30, u &= 1073741823, u += ((32767 & p) << 15) + ((32767 & w) << 15), c += u >>> 30, d = v + (p >>> 15) + (w >>> 15), r.__setDigit(o, 1073741823 & u);
    }
    for (; c != 0 || d !== 0; o++) {
      let u = r.__digit(o);
      u += c + d, d = 0, c = u >>> 30, r.__setDigit(o, 1073741823 & u);
    }
  }
  static __internalMultiplyAdd(e, t, r, o, i) {
    let a = r, c = 0;
    for (let d = 0; d < o; d++) {
      const u = e.__digit(d), h = l.__imul(32767 & u, t), m = l.__imul(u >>> 15, t), f = h + ((32767 & m) << 15) + c + a;
      a = f >>> 30, c = m >>> 15, i.__setDigit(d, 1073741823 & f);
    }
    if (i.length > o) for (i.__setDigit(o++, a + c); o < i.length; ) i.__setDigit(o++, 0);
    else if (a + c !== 0) throw new Error("implementation bug");
  }
  __inplaceMultiplyAdd(e, t, r) {
    r > this.length && (r = this.length);
    const o = 32767 & e, i = e >>> 15;
    let a = 0, c = t;
    for (let d = 0; d < r; d++) {
      const u = this.__digit(d), h = 32767 & u, m = u >>> 15, f = l.__imul(h, o), y = l.__imul(h, i), g = l.__imul(m, o), p = l.__imul(m, i);
      let w = c + f + a;
      a = w >>> 30, w &= 1073741823, w += ((32767 & y) << 15) + ((32767 & g) << 15), a += w >>> 30, c = p + (y >>> 15) + (g >>> 15), this.__setDigit(d, 1073741823 & w);
    }
    if (a != 0 || c !== 0) throw new Error("implementation bug");
  }
  static __absoluteDivSmall(e, t, r = null) {
    r === null && (r = new l(e.length, !1));
    let o = 0;
    for (let i, a = 2 * e.length - 1; 0 <= a; a -= 2) {
      i = (o << 15 | e.__halfDigit(a)) >>> 0;
      const c = 0 | i / t;
      o = 0 | i % t, i = (o << 15 | e.__halfDigit(a - 1)) >>> 0;
      const d = 0 | i / t;
      o = 0 | i % t, r.__setDigit(a >>> 1, c << 15 | d);
    }
    return r;
  }
  static __absoluteModSmall(e, t) {
    let r = 0;
    for (let o = 2 * e.length - 1; 0 <= o; o--)
      r = 0 | ((r << 15 | e.__halfDigit(o)) >>> 0) % t;
    return r;
  }
  static __absoluteDivLarge(e, t, r, o) {
    const i = t.__halfDigitLength(), a = t.length, c = e.__halfDigitLength() - i;
    let d = null;
    r && (d = new l(c + 2 >>> 1, !1), d.__initializeDigits());
    const u = new l(i + 2 >>> 1, !1);
    u.__initializeDigits();
    const h = l.__clz15(t.__halfDigit(i - 1));
    0 < h && (t = l.__specialLeftShift(t, h, 0));
    const m = l.__specialLeftShift(e, h, 1), f = t.__halfDigit(i - 1);
    let y = 0;
    for (let g, p = c; 0 <= p; p--) {
      g = 32767;
      const w = m.__halfDigit(p + i);
      if (w !== f) {
        const T = (w << 15 | m.__halfDigit(p + i - 1)) >>> 0;
        g = 0 | T / f;
        let E = 0 | T % f;
        const D = t.__halfDigit(i - 2), k = m.__halfDigit(p + i - 2);
        for (; l.__imul(g, D) >>> 0 > (E << 16 | k) >>> 0 && (g--, E += f, !(32767 < E)); ) ;
      }
      l.__internalMultiplyAdd(t, g, 0, a, u);
      let v = m.__inplaceSub(u, p, i + 1);
      v !== 0 && (v = m.__inplaceAdd(t, p, i), m.__setHalfDigit(p + i, 32767 & m.__halfDigit(p + i) + v), g--), r && (1 & p ? y = g << 15 : d.__setDigit(p >>> 1, y | g));
    }
    if (o) return m.__inplaceRightShift(h), r ? { quotient: d, remainder: m } : m;
    if (r) return d;
    throw new Error("unreachable");
  }
  static __clz15(e) {
    return l.__clz30(e) - 15;
  }
  __inplaceAdd(e, t, r) {
    let o = 0;
    for (let i = 0; i < r; i++) {
      const a = this.__halfDigit(t + i) + e.__halfDigit(i) + o;
      o = a >>> 15, this.__setHalfDigit(t + i, 32767 & a);
    }
    return o;
  }
  __inplaceSub(e, t, r) {
    let o = 0;
    if (1 & t) {
      t >>= 1;
      let i = this.__digit(t), a = 32767 & i, c = 0;
      for (; c < r - 1 >>> 1; c++) {
        const h = e.__digit(c), m = (i >>> 15) - (32767 & h) - o;
        o = 1 & m >>> 15, this.__setDigit(t + c, (32767 & m) << 15 | 32767 & a), i = this.__digit(t + c + 1), a = (32767 & i) - (h >>> 15) - o, o = 1 & a >>> 15;
      }
      const d = e.__digit(c), u = (i >>> 15) - (32767 & d) - o;
      if (o = 1 & u >>> 15, this.__setDigit(t + c, (32767 & u) << 15 | 32767 & a), t + c + 1 >= this.length) throw new RangeError("out of bounds");
      !(1 & r) && (i = this.__digit(t + c + 1), a = (32767 & i) - (d >>> 15) - o, o = 1 & a >>> 15, this.__setDigit(t + e.length, 1073709056 & i | 32767 & a));
    } else {
      t >>= 1;
      let i = 0;
      for (; i < e.length - 1; i++) {
        const h = this.__digit(t + i), m = e.__digit(i), f = (32767 & h) - (32767 & m) - o;
        o = 1 & f >>> 15;
        const y = (h >>> 15) - (m >>> 15) - o;
        o = 1 & y >>> 15, this.__setDigit(t + i, (32767 & y) << 15 | 32767 & f);
      }
      const a = this.__digit(t + i), c = e.__digit(i), d = (32767 & a) - (32767 & c) - o;
      o = 1 & d >>> 15;
      let u = 0;
      !(1 & r) && (u = (a >>> 15) - (c >>> 15) - o, o = 1 & u >>> 15), this.__setDigit(t + i, (32767 & u) << 15 | 32767 & d);
    }
    return o;
  }
  __inplaceRightShift(e) {
    if (e === 0) return;
    let t = this.__digit(0) >>> e;
    const r = this.length - 1;
    for (let o = 0; o < r; o++) {
      const i = this.__digit(o + 1);
      this.__setDigit(o, 1073741823 & i << 30 - e | t), t = i >>> e;
    }
    this.__setDigit(r, t);
  }
  static __specialLeftShift(e, t, r) {
    const o = e.length, i = new l(o + r, !1);
    if (t === 0) {
      for (let c = 0; c < o; c++) i.__setDigit(c, e.__digit(c));
      return 0 < r && i.__setDigit(o, 0), i;
    }
    let a = 0;
    for (let c = 0; c < o; c++) {
      const d = e.__digit(c);
      i.__setDigit(c, 1073741823 & d << t | a), a = d >>> 30 - t;
    }
    return 0 < r && i.__setDigit(o, a), i;
  }
  static __leftShiftByAbsolute(e, t) {
    const r = l.__toShiftAmount(t);
    if (0 > r) throw new RangeError("BigInt too big");
    const o = 0 | r / 30, i = r % 30, a = e.length, c = i !== 0 && e.__digit(a - 1) >>> 30 - i != 0, d = a + o + (c ? 1 : 0), u = new l(d, e.sign);
    if (i === 0) {
      let h = 0;
      for (; h < o; h++) u.__setDigit(h, 0);
      for (; h < d; h++) u.__setDigit(h, e.__digit(h - o));
    } else {
      let h = 0;
      for (let m = 0; m < o; m++) u.__setDigit(m, 0);
      for (let m = 0; m < a; m++) {
        const f = e.__digit(m);
        u.__setDigit(m + o, 1073741823 & f << i | h), h = f >>> 30 - i;
      }
      if (c) u.__setDigit(a + o, h);
      else if (h !== 0) throw new Error("implementation bug");
    }
    return u.__trim();
  }
  static __rightShiftByAbsolute(e, t) {
    const r = e.length, o = e.sign, i = l.__toShiftAmount(t);
    if (0 > i) return l.__rightShiftByMaximum(o);
    const a = 0 | i / 30, c = i % 30;
    let d = r - a;
    if (0 >= d) return l.__rightShiftByMaximum(o);
    let u = !1;
    if (o) {
      if (e.__digit(a) & (1 << c) - 1) u = !0;
      else for (let m = 0; m < a; m++) if (e.__digit(m) !== 0) {
        u = !0;
        break;
      }
    }
    u && c === 0 && !~e.__digit(r - 1) && d++;
    let h = new l(d, o);
    if (c === 0) {
      h.__setDigit(d - 1, 0);
      for (let m = a; m < r; m++) h.__setDigit(m - a, e.__digit(m));
    } else {
      let m = e.__digit(a) >>> c;
      const f = r - a - 1;
      for (let y = 0; y < f; y++) {
        const g = e.__digit(y + a + 1);
        h.__setDigit(y, 1073741823 & g << 30 - c | m), m = g >>> c;
      }
      h.__setDigit(f, m);
    }
    return u && (h = l.__absoluteAddOne(h, !0, h)), h.__trim();
  }
  static __rightShiftByMaximum(e) {
    return e ? l.__oneDigit(1, !0) : l.__zero();
  }
  static __toShiftAmount(e) {
    if (1 < e.length) return -1;
    const t = e.__unsignedDigit(0);
    return t > l.__kMaxLengthBits ? -1 : t;
  }
  static __toPrimitive(e, t = "default") {
    if (typeof e != "object" || e.constructor === l) return e;
    if (typeof Symbol < "u" && typeof Symbol.toPrimitive == "symbol" && e[Symbol.toPrimitive]) {
      const i = e[Symbol.toPrimitive](t);
      if (typeof i != "object") return i;
      throw new TypeError("Cannot convert object to primitive value");
    }
    const r = e.valueOf;
    if (r) {
      const i = r.call(e);
      if (typeof i != "object") return i;
    }
    const o = e.toString;
    if (o) {
      const i = o.call(e);
      if (typeof i != "object") return i;
    }
    throw new TypeError("Cannot convert object to primitive value");
  }
  static __toNumeric(e) {
    return l.__isBigInt(e) ? e : +e;
  }
  static __isBigInt(e) {
    return typeof e == "object" && e !== null && e.constructor === l;
  }
  static __truncateToNBits(e, t) {
    const r = 0 | (e + 29) / 30, o = new l(r, t.sign), i = r - 1;
    for (let c = 0; c < i; c++) o.__setDigit(c, t.__digit(c));
    let a = t.__digit(i);
    if (e % 30 != 0) {
      const c = 32 - e % 30;
      a = a << c >>> c;
    }
    return o.__setDigit(i, a), o.__trim();
  }
  static __truncateAndSubFromPowerOfTwo(e, t, r) {
    var o = Math.min;
    const i = 0 | (e + 29) / 30, a = new l(i, r);
    let c = 0;
    const d = i - 1;
    let u = 0;
    for (const y = o(d, t.length); c < y; c++) {
      const g = 0 - t.__digit(c) - u;
      u = 1 & g >>> 30, a.__setDigit(c, 1073741823 & g);
    }
    for (; c < d; c++) a.__setDigit(c, 0 | 1073741823 & -u);
    let h = d < t.length ? t.__digit(d) : 0;
    const m = e % 30;
    let f;
    if (m == 0) f = 0 - h - u, f &= 1073741823;
    else {
      const y = 32 - m;
      h = h << y >>> y;
      const g = 1 << 32 - y;
      f = g - h - u, f &= g - 1;
    }
    return a.__setDigit(d, f), a.__trim();
  }
  __digit(e) {
    return this[e];
  }
  __unsignedDigit(e) {
    return this[e] >>> 0;
  }
  __setDigit(e, t) {
    this[e] = 0 | t;
  }
  __setDigitGrow(e, t) {
    this[e] = 0 | t;
  }
  __halfDigitLength() {
    const e = this.length;
    return 32767 >= this.__unsignedDigit(e - 1) ? 2 * e - 1 : 2 * e;
  }
  __halfDigit(e) {
    return 32767 & this[e >>> 1] >>> 15 * (1 & e);
  }
  __setHalfDigit(e, t) {
    const r = e >>> 1, o = this.__digit(r), i = 1 & e ? 32767 & o | t << 15 : 1073709056 & o | 32767 & t;
    this.__setDigit(r, i);
  }
  static __digitPow(e, t) {
    let r = 1;
    for (; 0 < t; ) 1 & t && (r *= e), t >>>= 1, e *= e;
    return r;
  }
  static __detectBigEndian() {
    return l.__kBitConversionDouble[0] = -0, l.__kBitConversionInts[0] !== 0;
  }
  static __isOneDigitInt(e) {
    return (1073741823 & e) === e;
  }
}
l.__kMaxLength = 33554432, l.__kMaxLengthBits = l.__kMaxLength << 5, l.__kMaxBitsPerChar = [0, 0, 32, 51, 64, 75, 83, 90, 96, 102, 107, 111, 115, 119, 122, 126, 128, 131, 134, 136, 139, 141, 143, 145, 147, 149, 151, 153, 154, 156, 158, 159, 160, 162, 163, 165, 166], l.__kBitsPerCharTableShift = 5, l.__kBitsPerCharTableMultiplier = 1 << l.__kBitsPerCharTableShift, l.__kConversionChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], l.__kBitConversionBuffer = new ArrayBuffer(8), l.__kBitConversionDouble = new Float64Array(l.__kBitConversionBuffer), l.__kBitConversionInts = new Int32Array(l.__kBitConversionBuffer), l.__kBitConversionIntHigh = l.__detectBigEndian() ? 0 : 1, l.__kBitConversionIntLow = l.__detectBigEndian() ? 1 : 0, l.__clz30 = Math.clz32 ? function(n) {
  return Math.clz32(n) - 2;
} : function(n) {
  return n === 0 ? 30 : 0 | 29 - (0 | Math.log(n >>> 0) / Math.LN2);
}, l.__imul = Math.imul || function(n, e) {
  return 0 | n * e;
};
const Mo = {};
function Ut(n, e) {
  Object.defineProperty(n.prototype, Symbol.toStringTag, { value: e, writable: !1, enumerable: !1, configurable: !0 });
  for (const t of Object.getOwnPropertyNames(n)) {
    const r = Object.getOwnPropertyDescriptor(n, t);
    r.configurable && r.enumerable && (r.enumerable = !1, Object.defineProperty(n, t, r));
  }
  for (const t of Object.getOwnPropertyNames(n.prototype)) {
    const r = Object.getOwnPropertyDescriptor(n.prototype, t);
    r.configurable && r.enumerable && (r.enumerable = !1, Object.defineProperty(n.prototype, t, r));
  }
  me(e, n), me(`${e}.prototype`, n.prototype);
}
function me(n, e) {
  const t = `%${n}%`;
  if (Mo[t] !== void 0) throw new Error(`intrinsic ${n} already exists`);
  Mo[t] = e;
}
function I(n) {
  return Mo[n];
}
var _i, Ii;
const F = "slot-epochNanoSeconds", Pt = "slot-timezone-identifier", M = "slot-year", R = "slot-month", Y = "slot-day", j = "slot-hour", U = "slot-minute", z = "slot-second", q = "slot-millisecond", B = "slot-microsecond", Z = "slot-nanosecond", b = "slot-calendar", wa = "slot-date-brand", va = "slot-year-month-brand", Ta = "slot-month-day-brand", Be = "slot-cached-instant", ie = "slot-time-zone", Ve = "slot-years", Ae = "slot-months", it = "slot-weeks", Ge = "slot-days", He = "slot-hours", Ke = "slot-minutes", Xe = "slot-seconds", Qe = "slot-milliseconds", Je = "slot-microseconds", et = "slot-nanoseconds", he = "slot-calendar-identifier", ba = /* @__PURE__ */ new WeakMap(), Oo = Symbol.for("@@Temporal__GetSlots");
(_i = globalThis)[Oo] || (_i[Oo] = function(e) {
  return ba.get(e);
});
const Zo = globalThis[Oo], $o = Symbol.for("@@Temporal__CreateSlots");
(Ii = globalThis)[$o] || (Ii[$o] = function(e) {
  ba.set(e, /* @__PURE__ */ Object.create(null));
});
const zt = globalThis[$o];
function Ne(n, ...e) {
  if (!n || typeof n != "object") return !1;
  const t = Zo(n);
  return !!t && e.every((r) => r in t);
}
function s(n, e) {
  const t = Zo(n)?.[e];
  if (t === void 0) throw new TypeError(`Missing internal slot ${e}`);
  return t;
}
function W(n, e, t) {
  const r = Zo(n);
  if (r === void 0) throw new TypeError("Missing slots for the given container");
  if (r[e]) throw new TypeError(`${e} already has set`);
  r[e] = t;
}
const ki = /\.[-A-Za-z_]|\.\.[-A-Za-z._]{1,12}|\.[-A-Za-z_][-A-Za-z._]{0,12}|[A-Za-z_][-A-Za-z._]{0,13}/, mr = new RegExp("(?:" + [`(?:${ki.source})(?:\\/(?:${ki.source}))*`, "Etc/GMT(?:0|[-+]\\d{1,2})", "GMT[-+]?0", "EST5EDT", "CST6CDT", "MST7MDT", "PST8PDT", /(?:[+\u2212-][0-2][0-9](?::?[0-5][0-9](?::?[0-5][0-9](?:[.,]\d{1,9})?)?)?)/.source].join("|") + ")"), Ea = /(?:[+\u2212-]\d{6}|\d{4})/, Lr = /(?:0[1-9]|1[0-2])/, Ro = /(?:0[1-9]|[12]\d|3[01])/, As = new RegExp(`(${Ea.source})(?:-(${Lr.source})-(${Ro.source})|(${Lr.source})(${Ro.source}))`), Da = /(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?|(\d{2})(?:(\d{2})(?:[.,](\d{1,9}))?)?)?/, Ca = /([+\u2212-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\d{1,9}))?)?)?/, _a = new RegExp(`([zZ])|${Ca.source}?`), dn = /\[(!)?([a-z_][a-z0-9_-]*)=([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)\]/g, Fs = new RegExp([`^${As.source}`, `(?:(?:T|\\s+)${Da.source}(?:${_a.source})?)?`, `(?:\\[!?(${mr.source})\\])?`, `((?:${dn.source})*)$`].join(""), "i"), Ss = new RegExp([`^T?${Da.source}`, `(?:${_a.source})?`, `(?:\\[!?${mr.source}\\])?`, `((?:${dn.source})*)$`].join(""), "i"), Ls = new RegExp(`^(${Ea.source})-?(${Lr.source})(?:\\[!?${mr.source}\\])?((?:${dn.source})*)$`), js = new RegExp(`^(?:--)?(${Lr.source})-?(${Ro.source})(?:\\[!?${mr.source}\\])?((?:${dn.source})*)$`), To = /(\d+)(?:[.,](\d{1,9}))?/, Us = new RegExp(`(?:${To.source}H)?(?:${To.source}M)?(?:${To.source}S)?`), zs = new RegExp(`^([+−-])?P${/(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/.source}(?:T(?!$)${Us.source})?$`, "i"), qs = Array.prototype.includes, Ia = Array.prototype.push, ka = globalThis.Intl.DateTimeFormat, Bs = Math.min, Zs = Math.max, le = Math.abs, lt = Math.floor, jn = Math.sign, gn = Math.trunc, eo = Number.isNaN, nt = Number.isFinite, Ws = Number, fr = String, Vs = Number.MAX_SAFE_INTEGER, We = Object.create, Gs = Object.getOwnPropertyDescriptor, to = Reflect.apply, Hs = Reflect.ownKeys, ve = l.BigInt(0), Kn = l.BigInt(1), Nt = l.BigInt(60), Ma = l.BigInt(24), ne = l.BigInt(1e3), bt = l.BigInt(1e6), At = l.BigInt(1e9), Ks = l.BigInt(-1), Oa = l.multiply(l.BigInt(3600), At), $a = l.multiply(Nt, At), St = l.multiply(Oa, Ma), cr = l.multiply(l.BigInt(-86400), l.BigInt(1e17)), Un = l.multiply(l.BigInt(86400), l.BigInt(1e17)), jr = -271821, Ur = 275760, xn = l.multiply(l.BigInt(-388152), l.BigInt(1e13)), Xs = l.multiply(St, l.BigInt(3660)), Ra = l.multiply(St, l.BigInt(366)), Ya = l.multiply(St, l.BigInt(14)), Qs = ["iso8601", "hebrew", "islamic", "islamic-umalqura", "islamic-tbla", "islamic-civil", "islamic-rgsa", "islamicc", "persian", "ethiopic", "ethioaa", "coptic", "chinese", "dangi", "roc", "indian", "buddhist", "japanese", "gregory"];
function Tt(n) {
  return l.equal(n, ve);
}
function oe(n, e) {
  const t = n[e];
  if (t !== void 0) return t;
}
function N(n, e, t) {
  const r = arguments.length > 2 ? t : [];
  return to(n, e, r);
}
function ce(n) {
  return typeof n == "object" && n !== null || typeof n == "function";
}
function zn(n) {
  if (typeof n == "bigint") throw new TypeError("Cannot convert BigInt to number");
  return Ws(n);
}
function ke(n) {
  const e = zn(n);
  if (eo(e) || e === 0) return 0;
  if (!nt(e)) return e;
  const t = lt(le(e));
  return t === 0 ? 0 : jn(e) * t;
}
function wt(n) {
  if (typeof n != "number" || eo(n) || !nt(n)) return !1;
  const e = le(n);
  return lt(e) === e;
}
function ot(n) {
  if (typeof n == "symbol") throw new TypeError("Cannot convert a Symbol value to a String");
  return fr(n);
}
function ee(n) {
  const e = zn(n);
  if (e === 0) return 0;
  if (eo(e) || !nt(e)) throw new RangeError("invalid number value");
  const t = gn(e);
  return t === 0 ? 0 : t;
}
function Mi(n, e) {
  const t = ee(n);
  if (t <= 0)
    throw e !== void 0 ? new RangeError(`property '${e}' cannot be a a number less than one`) : new RangeError("Cannot convert a number less than one to a positive integer");
  return t;
}
function Pe(n) {
  const e = zn(n);
  if (!nt(e)) throw new RangeError("infinity is out of range");
  if (!wt(e)) throw new RangeError(`unsupported fractional value ${n}`);
  return e === 0 ? 0 : e;
}
function Ee(n, e) {
  return { quotient: l.divide(n, e), remainder: l.remainder(n, e) };
}
function zr(n) {
  return l.lessThan(n, ve);
}
function Oi(n) {
  return Tt(n) ? 0 : zr(n) ? -1 : 1;
}
function kt(n) {
  return l.lessThan(n, ve) ? l.multiply(n, Ks) : n;
}
const $i = /* @__PURE__ */ new Map([["year", ee], ["month", Mi], ["monthCode", ot], ["day", Mi], ["hour", ee], ["minute", ee], ["second", ee], ["millisecond", ee], ["microsecond", ee], ["nanosecond", ee], ["years", Pe], ["months", Pe], ["weeks", Pe], ["days", Pe], ["hours", Pe], ["minutes", Pe], ["seconds", Pe], ["milliseconds", Pe], ["microseconds", Pe], ["nanoseconds", Pe], ["era", ot], ["eraYear", ke], ["offset", ot]]), Js = /* @__PURE__ */ new Map([["hour", 0], ["minute", 0], ["second", 0], ["millisecond", 0], ["microsecond", 0], ["nanosecond", 0]]), yr = [["years", "year", "date"], ["months", "month", "date"], ["weeks", "week", "date"], ["days", "day", "date"], ["hours", "hour", "time"], ["minutes", "minute", "time"], ["seconds", "second", "time"], ["milliseconds", "millisecond", "time"], ["microseconds", "microsecond", "time"], ["nanoseconds", "nanosecond", "time"]], qr = new Map(yr.map((n) => [n[0], n[1]])), el = new Map(yr.map(([n, e]) => [e, n])), Ri = yr.map(([, n]) => n), Yi = Array.from(qr.keys()).sort(), xi = /* @__PURE__ */ new Map();
function xa(n) {
  let e = xi.get(n);
  return e === void 0 && (e = new ka("en-us", { timeZone: fr(n), hour12: !1, era: "short", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }), xi.set(n, e)), e;
}
function Pi(n) {
  if (n == null) throw new TypeError(`Expected object not ${n}`);
  return Object(n);
}
function Pn(n, e, t, r) {
  if (e == null) return;
  const o = Hs(e);
  for (const i of o) if (!t.some((a) => Object.is(a, i)) && Object.prototype.propertyIsEnumerable.call(e, i)) {
    const a = e[i];
    if (r && r.some((c) => Object.is(c, a))) continue;
    n[i] = a;
  }
}
function Re(n) {
  return Ne(n, F) && !Ne(n, ie, b);
}
function vt(n) {
  return Ne(n, Pt);
}
function ye(n) {
  return Ne(n, he);
}
function pe(n) {
  return Ne(n, Ve, Ae, Ge, He, Ke, Xe, Qe, Je, et);
}
function K(n) {
  return Ne(n, wa);
}
function we(n) {
  return Ne(n, j, U, z, q, B, Z) && !Ne(n, M, R, Y);
}
function L(n) {
  return Ne(n, M, R, Y, j, U, z, q, B, Z);
}
function te(n) {
  return Ne(n, va);
}
function xe(n) {
  return Ne(n, Ta);
}
function x(n) {
  return Ne(n, F, ie, b);
}
function Xn(n) {
  if (Ne(n, b) || Ne(n, ie)) throw new TypeError("with() does not support a calendar or timeZone property");
  if (we(n)) throw new TypeError("with() does not accept Temporal.PlainTime, use withPlainTime() instead");
  if (n.calendar !== void 0) throw new TypeError("with() does not support a calendar property");
  if (n.timeZone !== void 0) throw new TypeError("with() does not support a timeZone property");
}
function tl(n) {
  const { ianaName: e, offset: t, z: r } = function(i) {
    if (new RegExp(`^${mr.source}$`, "i").test(i)) return { ianaName: i };
    try {
      const a = qt(i);
      if (a.z || a.offset || a.ianaName) return a;
    } catch {
    }
    throw new RangeError(`Invalid time zone: ${i}`);
  }(n);
  return e ? ni(e) : r ? "UTC" : fo(on(t));
}
function Wo(n, e) {
  return e === "never" ? "" : Vo(Ue(n), e);
}
function Vo(n, e) {
  return e === "never" || e === "auto" && n === "iso8601" ? "" : `[${e === "critical" ? "!" : ""}u-ca=${n}]`;
}
function qt(n) {
  const e = Fs.exec(n);
  if (!e) throw new RangeError(`invalid ISO 8601 string: ${n}`);
  let t = e[1];
  if (t[0] === "−" && (t = `-${t.slice(1)}`), t === "-000000") throw new RangeError(`invalid ISO 8601 string: ${n}`);
  const r = ke(t), o = ke(e[2] || e[4]), i = ke(e[3] || e[5]), a = ke(e[6]), c = e[6] !== void 0, d = ke(e[7] || e[10]);
  let u = ke(e[8] || e[11]);
  u === 60 && (u = 59);
  const h = (e[9] || e[12]) + "000000000", m = ke(h.slice(0, 3)), f = ke(h.slice(3, 6)), y = ke(h.slice(6, 9));
  let g, p = !1;
  if (e[13]) g = void 0, p = !0;
  else if (e[14] && e[15]) {
    const E = e[14] === "-" || e[14] === "−" ? "-" : "+", D = e[15] || "00", k = e[16] || "00", _ = e[17] || "00";
    let C = e[18] || "0";
    if (g = `${E}${D}:${k}`, +C) {
      for (; C.endsWith("0"); ) C = C.slice(0, -1);
      g += `:${_}.${C}`;
    } else +_ && (g += `:${_}`);
    g === "-00:00" && (g = "+00:00");
  }
  const w = e[19], v = e[20];
  let T;
  for (const [, E, D, k] of v.matchAll(dn)) if (D === "u-ca") T === void 0 && (T = k);
  else if (E === "!") throw new RangeError(`Unrecognized annotation: !${D}=${k}`);
  return ii(r, o, i, a, d, u, m, f, y), { year: r, month: o, day: i, hasTime: c, hour: a, minute: d, second: u, millisecond: m, microsecond: f, nanosecond: y, ianaName: w, offset: g, z: p, calendar: T };
}
function Go(n) {
  const e = Ls.exec(n);
  let t, r, o, i;
  if (e) {
    let a = e[1];
    if (a[0] === "−" && (a = `-${a.slice(1)}`), a === "-000000") throw new RangeError(`invalid ISO 8601 string: ${n}`);
    t = ke(a), r = ke(e[2]);
    const c = e[3];
    for (const [, d, u, h] of c.matchAll(dn)) if (u === "u-ca") o === void 0 && (o = h);
    else if (d === "!") throw new RangeError(`Unrecognized annotation: !${u}=${h}`);
    if (o !== void 0 && o !== "iso8601") throw new RangeError("YYYY-MM format is only valid with iso8601 calendar");
  } else {
    let a;
    if ({ year: t, month: r, calendar: o, day: i, z: a } = qt(n), a) throw new RangeError("Z designator not supported for PlainYearMonth");
  }
  return { year: t, month: r, calendar: o, referenceISODay: i };
}
function Ho(n) {
  const e = js.exec(n);
  let t, r, o, i;
  if (e) {
    t = ke(e[1]), r = ke(e[2]);
    const a = e[3];
    for (const [, c, d, u] of a.matchAll(dn)) if (d === "u-ca") o === void 0 && (o = u);
    else if (c === "!") throw new RangeError(`Unrecognized annotation: !${d}=${u}`);
    if (o !== void 0 && o !== "iso8601") throw new RangeError("MM-DD format is only valid with iso8601 calendar");
  } else {
    let a;
    if ({ month: t, day: r, calendar: o, year: i, z: a } = qt(n), a) throw new RangeError("Z designator not supported for PlainMonthDay");
  }
  return { month: t, day: r, calendar: o, referenceISOYear: i };
}
function nl(n) {
  let { year: e, month: t, day: r, hour: o, minute: i, second: a, millisecond: c, microsecond: d, nanosecond: u, offset: h, z: m } = function(p) {
    const w = qt(p);
    if (!w.z && !w.offset) throw new RangeError("Temporal.Instant requires a time zone offset");
    return w;
  }(n);
  if (!m && !h) throw new RangeError("Temporal.Instant requires a time zone offset");
  const f = m ? 0 : on(h);
  ({ year: e, month: t, day: r, hour: o, minute: i, second: a, millisecond: c, microsecond: d, nanosecond: u } = ri(e, t, r, o, i, a, c, d, u - f));
  const y = an(e, t, r, o, i, a, c, d, u);
  if (y === null) throw new RangeError("DateTime outside of supported range");
  return y;
}
function Br(n, e, t, r) {
  let o = n, i = e, a = t;
  switch (r) {
    case "reject":
      Lt(o, i, a);
      break;
    case "constrain":
      ({ year: o, month: i, day: a } = Ka(o, i, a));
  }
  return { year: o, month: i, day: a };
}
function no(n, e, t, r, o, i, a) {
  let c = n, d = e, u = t, h = r, m = o, f = i;
  switch (a) {
    case "reject":
      go(c, d, u, h, m, f);
      break;
    case "constrain":
      ({ hour: c, minute: d, second: u, millisecond: h, microsecond: m, nanosecond: f } = function(g, p, w, v, T, E) {
        const D = st(g, 0, 23), k = st(p, 0, 59), _ = st(w, 0, 59), C = st(v, 0, 999), $ = st(T, 0, 999), P = st(E, 0, 999);
        return { hour: D, minute: k, second: _, millisecond: C, microsecond: $, nanosecond: P };
      }(c, d, u, h, m, f));
  }
  return { hour: c, minute: d, second: u, millisecond: h, microsecond: m, nanosecond: f };
}
function Mn(n) {
  if (!ce(n)) return function(g) {
    const p = zs.exec(g);
    if (!p) throw new RangeError(`invalid duration: ${g}`);
    if (p.slice(2).every((H) => H === void 0)) throw new RangeError(`invalid duration: ${g}`);
    const w = p[1] === "-" || p[1] === "−" ? -1 : 1, v = p[2] === void 0 ? 0 : ee(p[2]) * w, T = p[3] === void 0 ? 0 : ee(p[3]) * w, E = p[4] === void 0 ? 0 : ee(p[4]) * w, D = p[5] === void 0 ? 0 : ee(p[5]) * w, k = p[6] === void 0 ? 0 : ee(p[6]) * w, _ = p[7], C = p[8], $ = p[9], P = p[10], re = p[11];
    let Q = 0, J = 0, A = 0;
    if (_ !== void 0) {
      if (C ?? $ ?? P ?? re) throw new RangeError("only the smallest unit can be fractional");
      A = 3600 * ke((_ + "000000000").slice(0, 9)) * w;
    } else if (Q = C === void 0 ? 0 : ee(C) * w, $ !== void 0) {
      if (P ?? re) throw new RangeError("only the smallest unit can be fractional");
      A = 60 * ke(($ + "000000000").slice(0, 9)) * w;
    } else J = P === void 0 ? 0 : ee(P) * w, re !== void 0 && (A = ke((re + "000000000").slice(0, 9)) * w);
    const V = A % 1e3, O = gn(A / 1e3) % 1e3, S = gn(A / 1e6) % 1e3;
    return J += gn(A / 1e9) % 60, Q += gn(A / 6e10), Kr(v, T, E, D, k, Q, J, S, O, V), { years: v, months: T, weeks: E, days: D, hours: k, minutes: Q, seconds: J, milliseconds: S, microseconds: O, nanoseconds: V };
  }(ot(n));
  if (pe(n)) return { years: s(n, Ve), months: s(n, Ae), weeks: s(n, it), days: s(n, Ge), hours: s(n, He), minutes: s(n, Ke), seconds: s(n, Xe), milliseconds: s(n, Qe), microseconds: s(n, Je), nanoseconds: s(n, et) };
  const e = { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, microseconds: 0, nanoseconds: 0 };
  let t = function(g) {
    if (!ce(g)) throw new TypeError("invalid duration-like");
    const p = { years: void 0, months: void 0, weeks: void 0, days: void 0, hours: void 0, minutes: void 0, seconds: void 0, milliseconds: void 0, microseconds: void 0, nanoseconds: void 0 };
    let w = !1;
    for (const v of Yi) {
      const T = g[v];
      T !== void 0 && (w = !0, p[v] = Pe(T));
    }
    if (!w) throw new TypeError("invalid duration-like");
    return p;
  }(n);
  for (const y of Yi) {
    const g = t[y];
    g !== void 0 && (e[y] = g);
  }
  let { years: r, months: o, weeks: i, days: a, hours: c, minutes: d, seconds: u, milliseconds: h, microseconds: m, nanoseconds: f } = e;
  return Kr(r, o, i, a, c, d, u, h, m, f), { years: r, months: o, weeks: i, days: a, hours: c, minutes: d, seconds: u, milliseconds: h, microseconds: m, nanoseconds: f };
}
function _e(n) {
  return n === void 0 ? "constrain" : ln(n, "overflow", ["constrain", "reject"], "constrain");
}
function qn(n) {
  return n === void 0 ? "compatible" : ln(n, "disambiguation", ["compatible", "earlier", "later", "reject"], "compatible");
}
function Ot(n, e) {
  return ln(n, "roundingMode", ["ceil", "floor", "expand", "trunc", "halfCeil", "halfFloor", "halfExpand", "halfTrunc", "halfEven"], e);
}
function Zr(n, e) {
  return n === void 0 ? e : ln(n, "offset", ["prefer", "use", "ignore", "reject"], e);
}
function gr(n) {
  return ln(n, "calendarName", ["auto", "always", "never", "critical"], "auto");
}
function Qn(n) {
  let e = n.roundingIncrement;
  if (e === void 0) return 1;
  if (e = zn(e), !nt(e)) throw new RangeError("roundingIncrement must be finite");
  const t = gn(e);
  if (t < 1 || t > 1e9) throw new RangeError(`roundingIncrement must be at least 1 and at most 1e9, not ${e}`);
  return t;
}
function Jn(n, e, t) {
  const r = t ? e : e - 1;
  if (n > r) throw new RangeError(`roundingIncrement must be at least 1 and less than ${r}, not ${n}`);
  if (e % n != 0) throw new RangeError(`Rounding increment must divide evenly into ${e}`);
}
function pr(n) {
  const e = n.fractionalSecondDigits;
  if (e === void 0) return "auto";
  if (typeof e != "number") {
    if (ot(e) !== "auto") throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${e}`);
    return "auto";
  }
  const t = lt(e);
  if (!nt(t) || t < 0 || t > 9) throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${e}`);
  return t;
}
function wr(n, e) {
  switch (n) {
    case "minute":
      return { precision: "minute", unit: "minute", increment: 1 };
    case "second":
      return { precision: 0, unit: "second", increment: 1 };
    case "millisecond":
      return { precision: 3, unit: "millisecond", increment: 1 };
    case "microsecond":
      return { precision: 6, unit: "microsecond", increment: 1 };
    case "nanosecond":
      return { precision: 9, unit: "nanosecond", increment: 1 };
  }
  switch (e) {
    case "auto":
      return { precision: e, unit: "nanosecond", increment: 1 };
    case 0:
      return { precision: e, unit: "second", increment: 1 };
    case 1:
    case 2:
    case 3:
      return { precision: e, unit: "millisecond", increment: 10 ** (3 - e) };
    case 4:
    case 5:
    case 6:
      return { precision: e, unit: "microsecond", increment: 10 ** (6 - e) };
    case 7:
    case 8:
    case 9:
      return { precision: e, unit: "nanosecond", increment: 10 ** (9 - e) };
    default:
      throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${e}`);
  }
}
const Dn = Symbol("~required~");
function ct(n, e, t, r, o = []) {
  const i = [];
  for (const [, u, h] of yr) t !== "datetime" && t !== h || i.push(u);
  i.push(...o);
  let a = r;
  a === Dn ? a = void 0 : a !== void 0 && i.push(a);
  const c = [...i];
  for (const u of i) {
    const h = el.get(u);
    h !== void 0 && c.push(h);
  }
  let d = ln(n, e, c, a);
  if (d === void 0 && r === Dn) throw new RangeError(`${e} is required`);
  return qr.has(d) ? qr.get(d) : d;
}
function xr(n) {
  const e = n.relativeTo;
  if (e === void 0) return e;
  let t, r, o, i, a, c, d, u, h, m, f, y, g = "option", p = !1;
  if (ce(e)) {
    if (x(e) || K(e)) return e;
    if (L(e)) return Zn(e);
    m = Er(e);
    const w = Me(m, ["day", "hour", "microsecond", "millisecond", "minute", "month", "monthCode", "nanosecond", "second", "year"]);
    w.push("timeZone", "offset");
    const v = G(e, w, []), T = We(null);
    T.overflow = "constrain", { year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h } = vr(m, v, T), y = v.offset, y === void 0 && (g = "wall"), f = v.timeZone, f !== void 0 && (f = Ze(f));
  } else {
    let w, v;
    if ({ year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h, calendar: m, ianaName: w, offset: y, z: v } = qt(ot(e)), w) f = Ze(w), v ? g = "exact" : y || (g = "wall"), p = !0;
    else if (v) throw new RangeError("Z designator not supported for PlainDate relativeTo; either remove the Z or add a bracketed time zone");
    if (m || (m = "iso8601"), !Qt(m)) throw new RangeError(`invalid calendar identifier ${m}`);
    m = jt(m);
  }
  return f === void 0 ? Dt(t, r, o, m) : Se(Vr(t, r, o, i, a, c, d, u, h, g, g === "option" ? on(y) : 0, f, "compatible", "reject", p), f, m);
}
function Yo(n, e, t, r, o, i, a, c, d, u) {
  for (const [h, m] of [["years", n], ["months", e], ["weeks", t], ["days", r], ["hours", o], ["minutes", i], ["seconds", a], ["milliseconds", c], ["microseconds", d], ["nanoseconds", u]]) if (m !== 0) return qr.get(h);
  return "nanosecond";
}
function Cn(n, e) {
  return Ri.indexOf(n) > Ri.indexOf(e) ? e : n;
}
function G(n, e, t, { emptySourceErrorMessage: r } = { emptySourceErrorMessage: "no supported properties found" }) {
  const o = We(null);
  let i = !1;
  e.sort();
  for (const a of e) {
    let c = n[a];
    if (c !== void 0) i = !0, $i.has(a) && (c = $i.get(a)(c)), o[a] = c;
    else if (t !== "partial") {
      if (qs.call(t, a)) throw new TypeError(`required property '${a}' missing or undefined`);
      c = Js.get(a), o[a] = c;
    }
  }
  if (t === "partial" && !i) throw new TypeError(r);
  return o;
}
function Wr(n, e = "complete") {
  const t = ["hour", "microsecond", "millisecond", "minute", "nanosecond", "second"], r = G(n, t, "partial", { emptySourceErrorMessage: "invalid time-like" }), o = {};
  for (const i of t) {
    const a = Gs(r, i);
    a !== void 0 ? o[i] = a.value : e === "complete" && (o[i] = 0);
  }
  return o;
}
function ae(n, e) {
  let t = n;
  if (ce(t)) {
    if (K(t)) return t;
    if (x(t) && (_e(e), t = pt(s(t, ie), s(t, Be), s(t, b))), L(t)) return _e(e), Dt(s(t, M), s(t, R), s(t, Y), s(t, b));
    const d = Er(t);
    return Kt(d, G(t, Me(d, ["day", "month", "monthCode", "year"]), []), e);
  }
  _e(e);
  let { year: r, month: o, day: i, calendar: a, z: c } = function(u) {
    return qt(u);
  }(ot(t));
  if (c) throw new RangeError("Z designator not supported for PlainDate");
  if (a || (a = "iso8601"), !Qt(a)) throw new RangeError(`invalid calendar identifier ${a}`);
  return a = jt(a), Dt(r, o, i, a);
}
function vr(n, e, t) {
  let { hour: r, minute: o, second: i, millisecond: a, microsecond: c, nanosecond: d } = Wr(e);
  const u = _e(t), h = Kt(n, e, t), m = s(h, M), f = s(h, R), y = s(h, Y);
  return { hour: r, minute: o, second: i, millisecond: a, microsecond: c, nanosecond: d } = no(r, o, i, a, c, d, u), { year: m, month: f, day: y, hour: r, minute: o, second: i, millisecond: a, microsecond: c, nanosecond: d };
}
function pn(n, e) {
  let t, r, o, i, a, c, d, u, h, m;
  if (ce(n)) {
    if (L(n)) return n;
    if (x(n)) return _e(e), pt(s(n, ie), s(n, Be), s(n, b));
    if (K(n)) return _e(e), at(s(n, M), s(n, R), s(n, Y), 0, 0, 0, 0, 0, 0, s(n, b));
    m = Er(n);
    const f = G(n, Me(m, ["day", "hour", "microsecond", "millisecond", "minute", "month", "monthCode", "nanosecond", "second", "year"]), []);
    ({ year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h } = vr(m, f, e));
  } else {
    let f;
    if (_e(e), { year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h, calendar: m, z: f } = function(g) {
      return qt(g);
    }(ot(n)), f) throw new RangeError("Z designator not supported for PlainDateTime");
    if (ii(t, r, o, i, a, c, d, u, h), m || (m = "iso8601"), !Qt(m)) throw new RangeError(`invalid calendar identifier ${m}`);
    m = jt(m);
  }
  return at(t, r, o, i, a, c, d, u, h, m);
}
function Nn(n) {
  if (pe(n)) return n;
  let { years: e, months: t, weeks: r, days: o, hours: i, minutes: a, seconds: c, milliseconds: d, microseconds: u, nanoseconds: h } = Mn(n);
  return new (I("%Temporal.Duration%"))(e, t, r, o, i, a, c, d, u, h);
}
function Mt(n) {
  if (Re(n)) return n;
  if (x(n))
    return new (I("%Temporal.Instant%"))(s(n, F));
  const e = nl(ot(n));
  return new (I("%Temporal.Instant%"))(e);
}
function Ni(n, e) {
  let t = n;
  if (ce(t)) {
    if (xe(t)) return t;
    let c, d;
    if (Ne(t, b)) c = s(t, b), d = !1;
    else {
      let h = t.calendar;
      d = h === void 0, h === void 0 && (h = "iso8601"), c = dt(h);
    }
    const u = G(t, Me(c, ["day", "month", "monthCode", "year"]), []);
    return d && u.month !== void 0 && u.monthCode === void 0 && u.year === void 0 && (u.year = 1972), Bn(c, u, e);
  }
  _e(e);
  let { month: r, day: o, referenceISOYear: i, calendar: a } = Ho(ot(t));
  if (a === void 0 && (a = "iso8601"), !Qt(a)) throw new RangeError(`invalid calendar identifier ${a}`);
  return a = jt(a), i === void 0 ? (Lt(1972, r, o), dr(r, o, a)) : Bn(a, dr(r, o, a, i));
}
function Zt(n, e = "constrain") {
  let t, r, o, i, a, c, d = n;
  if (ce(d)) {
    if (we(d)) return d;
    if (x(d) && (d = pt(s(d, ie), s(d, Be), s(d, b))), L(d))
      return new (I("%Temporal.PlainTime%"))(s(d, j), s(d, U), s(d, z), s(d, q), s(d, B), s(d, Z));
    ({ hour: t, minute: r, second: o, millisecond: i, microsecond: a, nanosecond: c } = Wr(d)), { hour: t, minute: r, second: o, millisecond: i, microsecond: a, nanosecond: c } = no(t, r, o, i, a, c, e);
  } else ({ hour: t, minute: r, second: o, millisecond: i, microsecond: a, nanosecond: c } = function(h) {
    const m = Ss.exec(h);
    let f, y, g, p, w, v, T;
    if (m) {
      f = ke(m[1]), y = ke(m[2] || m[5]), g = ke(m[3] || m[6]), g === 60 && (g = 59);
      const E = (m[4] || m[7]) + "000000000";
      p = ke(E.slice(0, 3)), w = ke(E.slice(3, 6)), v = ke(E.slice(6, 9)), T = m[14];
      for (const [, D, k, _] of T.matchAll(dn)) if (k !== "u-ca" && D === "!") throw new RangeError(`Unrecognized annotation: !${k}=${_}`);
      if (m[8]) throw new RangeError("Z designator not supported for PlainTime");
    } else {
      let E, D;
      if ({ hasTime: D, hour: f, minute: y, second: g, millisecond: p, microsecond: w, nanosecond: v, z: E } = qt(h), !D) throw new RangeError(`time is missing in string: ${h}`);
      if (E) throw new RangeError("Z designator not supported for PlainTime");
    }
    if (/[tT ][0-9][0-9]/.test(h)) return { hour: f, minute: y, second: g, millisecond: p, microsecond: w, nanosecond: v };
    try {
      const { month: E, day: D } = Ho(h);
      Lt(1972, E, D);
    } catch {
      try {
        const { year: E, month: D } = Go(h);
        Lt(E, D, 1);
      } catch {
        return { hour: f, minute: y, second: g, millisecond: p, microsecond: w, nanosecond: v };
      }
    }
    throw new RangeError(`invalid ISO 8601 time-only string ${h}; may need a T prefix`);
  }(ot(d))), go(t, r, o, i, a, c);
  return new (I("%Temporal.PlainTime%"))(t, r, o, i, a, c);
}
function or(n, e) {
  if (ce(n)) {
    if (te(n)) return n;
    const a = Er(n);
    return In(a, G(n, Me(a, ["month", "monthCode", "year"]), []), e);
  }
  _e(e);
  let { year: t, month: r, referenceISODay: o, calendar: i } = Go(ot(n));
  if (i === void 0 && (i = "iso8601"), !Qt(i)) throw new RangeError(`invalid calendar identifier ${i}`);
  return i = jt(i), o === void 0 ? (Lt(t, r, 1), ur(t, r, i)) : In(i, ur(t, r, i, o));
}
function Vr(n, e, t, r, o, i, a, c, d, u, h, m, f, y, g) {
  const p = new (I("%Temporal.PlainDateTime%"))(n, e, t, r, o, i, a, c, d);
  if (u === "wall" || y === "ignore")
    return s(rt(m, p, f), F);
  if (u === "exact" || y === "use") {
    const v = an(n, e, t, r, o, i, a, c, d);
    if (v === null) throw new RangeError("ZonedDateTime outside of supported range");
    return l.subtract(v, l.BigInt(h));
  }
  const w = Gr(m, p);
  for (const v of w) {
    const T = $t(m, v), E = l.toNumber(ft(l.BigInt(T), $a, "halfExpand"));
    if (T === h || g && E === h) return s(v, F);
  }
  if (y === "reject") {
    const v = fo(h), T = vt(m) ? s(m, Pt) : "time zone";
    throw new RangeError(`Offset ${v} is invalid for ${p.toString()} in ${T}`);
  }
  return s(za(w, m, p, f), F);
}
function ir(n, e) {
  let t, r, o, i, a, c, d, u, h, m, f, y, g, p, w = !1, v = "option";
  if (ce(n)) {
    if (x(n)) return n;
    y = Er(n);
    const E = Me(y, ["day", "hour", "microsecond", "millisecond", "minute", "month", "monthCode", "nanosecond", "second", "year"]);
    E.push("timeZone", "offset");
    const D = G(n, E, ["timeZone"]);
    m = Ze(D.timeZone), f = D.offset, f === void 0 && (v = "wall"), g = qn(e), p = Zr(e, "reject"), { year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h } = vr(y, D, e);
  } else {
    let E, D;
    if ({ year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h, ianaName: E, offset: f, z: D, calendar: y } = function(_) {
      const C = qt(_);
      if (!C.ianaName) throw new RangeError("Temporal.ZonedDateTime requires a time zone ID in brackets");
      return C;
    }(ot(n)), m = Ze(E), D ? v = "exact" : f || (v = "wall"), y || (y = "iso8601"), !Qt(y)) throw new RangeError(`invalid calendar identifier ${y}`);
    y = jt(y), w = !0, g = qn(e), p = Zr(e, "reject"), _e(e);
  }
  let T = 0;
  return v === "option" && (T = on(f)), Se(Vr(t, r, o, i, a, c, d, u, h, v, T, m, g, p, w), m, y);
}
function Pa(n, e, t, r, o) {
  Lt(e, t, r), Xa(e, t, r), zt(n), W(n, M, e), W(n, R, t), W(n, Y, r), W(n, b, o), W(n, wa, !0);
}
function Dt(n, e, t, r = "iso8601") {
  const o = I("%Temporal.PlainDate%"), i = We(o.prototype);
  return Pa(i, n, e, t, r), i;
}
function Na(n, e, t, r, o, i, a, c, d, u, h) {
  ii(e, t, r, o, i, a, c, d, u), Qa(e, t, r, o, i, a, c, d, u), zt(n), W(n, M, e), W(n, R, t), W(n, Y, r), W(n, j, o), W(n, U, i), W(n, z, a), W(n, q, c), W(n, B, d), W(n, Z, u), W(n, b, h);
}
function at(n, e, t, r, o, i, a, c, d, u = "iso8601") {
  const h = I("%Temporal.PlainDateTime%"), m = We(h.prototype);
  return Na(m, n, e, t, r, o, i, a, c, d, u), m;
}
function Aa(n, e, t, r, o) {
  Lt(o, e, t), Xa(o, e, t), zt(n), W(n, R, e), W(n, Y, t), W(n, M, o), W(n, b, r), W(n, Ta, !0);
}
function dr(n, e, t = "iso8601", r = 1972) {
  const o = I("%Temporal.PlainMonthDay%"), i = We(o.prototype);
  return Aa(i, n, e, t, r), i;
}
function Fa(n, e, t, r, o) {
  Lt(e, t, o), function(a, c) {
    je(a, jr, Ur), a === jr ? je(c, 4, 12) : a === Ur && je(c, 1, 9);
  }(e, t), zt(n), W(n, M, e), W(n, R, t), W(n, Y, o), W(n, b, r), W(n, va, !0);
}
function ur(n, e, t = "iso8601", r = 1) {
  const o = I("%Temporal.PlainYearMonth%"), i = We(o.prototype);
  return Fa(i, n, e, t, r), i;
}
function Sa(n, e, t, r) {
  yn(e), zt(n), W(n, F, e), W(n, ie, t), W(n, b, r);
  const o = new (I("%Temporal.Instant%"))(s(n, F));
  W(n, Be, o);
}
function Se(n, e, t = "iso8601") {
  const r = I("%Temporal.ZonedDateTime%"), o = We(r.prototype);
  return Sa(o, n, e, t), o;
}
function Me(n, e) {
  if (typeof n == "string") {
    const o = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.fields%"), o, [e]);
  }
  const t = N(oe(n, "fields"), n, [e]), r = [];
  for (const o of t) {
    if (typeof o != "string") throw new TypeError("bad return from calendar.fields()");
    Ia.call(r, o);
  }
  return r;
}
function _n(n, e, t) {
  if (typeof n == "string") {
    const o = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.mergeFields%"), o, [e, t]);
  }
  const r = N(oe(n, "mergeFields"), n, [e, t]);
  if (!ce(r)) throw new TypeError("bad return from calendar.mergeFields()");
  return r;
}
function Le(n, e, t, r, o) {
  let i = o;
  if (typeof n == "string") {
    const c = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.dateAdd%"), c, [e, t, r]);
  }
  i === void 0 && (i = oe(n, "dateAdd"));
  const a = to(i, n, [e, t, r]);
  if (!K(a)) throw new TypeError("invalid result");
  return a;
}
function rn(n, e, t, r, o) {
  let i = o;
  if (typeof n == "string") {
    const c = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.dateUntil%"), c, [e, t, r]);
  }
  i === void 0 && (i = oe(n, "dateUntil"));
  const a = to(i, n, [e, t, r]);
  if (!pe(a)) throw new TypeError("invalid result");
  return a;
}
function ro(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.year%"), r, [e]);
  }
  let t = N(oe(n, "year"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar year result must be an integer");
  if (!wt(t)) throw new RangeError("calendar year result must be an integer");
  return t;
}
function oo(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.month%"), r, [e]);
  }
  let t = N(oe(n, "month"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar month result must be a positive integer");
  if (!wt(t) || t < 1) throw new RangeError("calendar month result must be a positive integer");
  return t;
}
function Tr(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.monthCode%"), r, [e]);
  }
  let t = N(oe(n, "monthCode"), n, [e]);
  if (typeof t != "string") throw new TypeError("calendar monthCode result must be a string");
  return t;
}
function br(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.day%"), r, [e]);
  }
  const t = N(oe(n, "day"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar day result must be a positive integer");
  if (!wt(t) || t < 1) throw new RangeError("calendar day result must be a positive integer");
  return t;
}
function io(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.era%"), r, [e]);
  }
  let t = N(oe(n, "era"), n, [e]);
  if (t === void 0) return t;
  if (typeof t != "string") throw new TypeError("calendar era result must be a string or undefined");
  return t;
}
function ao(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.eraYear%"), r, [e]);
  }
  let t = N(oe(n, "eraYear"), n, [e]);
  if (t === void 0) return t;
  if (typeof t != "number") throw new TypeError("calendar eraYear result must be an integer or undefined");
  if (!wt(t)) throw new RangeError("calendar eraYear result must be an integer or undefined");
  return t;
}
function Ko(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.dayOfWeek%"), r, [e]);
  }
  const t = N(oe(n, "dayOfWeek"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar dayOfWeek result must be a positive integer");
  if (!wt(t) || t < 1) throw new RangeError("calendar dayOfWeek result must be a positive integer");
  return t;
}
function Xo(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.dayOfYear%"), r, [e]);
  }
  const t = N(oe(n, "dayOfYear"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar dayOfYear result must be a positive integer");
  if (!wt(t) || t < 1) throw new RangeError("calendar dayOfYear result must be a positive integer");
  return t;
}
function Qo(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.weekOfYear%"), r, [e]);
  }
  const t = N(oe(n, "weekOfYear"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar weekOfYear result must be a positive integer");
  if (!wt(t) || t < 1) throw new RangeError("calendar weekOfYear result must be a positive integer");
  return t;
}
function Jo(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.yearOfWeek%"), r, [e]);
  }
  const t = N(oe(n, "yearOfWeek"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar yearOfWeek result must be an integer");
  if (!wt(t)) throw new RangeError("calendar yearOfWeek result must be an integer");
  return t;
}
function ei(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.daysInWeek%"), r, [e]);
  }
  const t = N(oe(n, "daysInWeek"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar daysInWeek result must be a positive integer");
  if (!wt(t) || t < 1) throw new RangeError("calendar daysInWeek result must be a positive integer");
  return t;
}
function so(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.daysInMonth%"), r, [e]);
  }
  const t = N(oe(n, "daysInMonth"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar daysInMonth result must be a positive integer");
  if (!wt(t) || t < 1) throw new RangeError("calendar daysInMonth result must be a positive integer");
  return t;
}
function lo(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.daysInYear%"), r, [e]);
  }
  const t = N(oe(n, "daysInYear"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar daysInYear result must be a positive integer");
  if (!wt(t) || t < 1) throw new RangeError("calendar daysInYear result must be a positive integer");
  return t;
}
function co(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.monthsInYear%"), r, [e]);
  }
  const t = N(oe(n, "monthsInYear"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar monthsInYear result must be a positive integer");
  if (!wt(t) || t < 1) throw new RangeError("calendar monthsInYear result must be a positive integer");
  return t;
}
function uo(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.inLeapYear%"), r, [e]);
  }
  const t = N(oe(n, "inLeapYear"), n, [e]);
  if (typeof t != "boolean") throw new TypeError("calendar inLeapYear result must be a boolean");
  return t;
}
function dt(n) {
  if (ce(n)) {
    if (Ne(n, b)) return s(n, b);
    if (!function(o) {
      return !!ye(o) || "dateAdd" in o && "dateFromFields" in o && "dateUntil" in o && "day" in o && "dayOfWeek" in o && "dayOfYear" in o && "daysInMonth" in o && "daysInWeek" in o && "daysInYear" in o && "fields" in o && "id" in o && "inLeapYear" in o && "mergeFields" in o && "month" in o && "monthCode" in o && "monthDayFromFields" in o && "monthsInYear" in o && "weekOfYear" in o && "year" in o && "yearMonthFromFields" in o && "yearOfWeek" in o;
    }(n)) throw new TypeError("expected a Temporal.Calendar or object implementing the Temporal.Calendar protocol");
    return n;
  }
  const e = ot(n);
  if (Qt(e)) return jt(e);
  let t;
  try {
    ({ calendar: t } = qt(e));
  } catch {
    try {
      ({ calendar: t } = Go(e));
    } catch {
      ({ calendar: t } = Ho(e));
    }
  }
  if (t || (t = "iso8601"), !Qt(t)) throw new RangeError(`invalid calendar identifier ${t}`);
  return jt(t);
}
function Er(n) {
  if (Ne(n, b)) return s(n, b);
  const { calendar: e } = n;
  return e === void 0 ? "iso8601" : dt(e);
}
function Ue(n) {
  if (typeof n == "string") return n;
  const e = n.id;
  if (typeof e != "string") throw new TypeError("calendar.id should be a string");
  return e;
}
function er(n) {
  return ce(n) ? n : new (I("%Temporal.Calendar%"))(n);
}
function Dr(n, e) {
  return n === e ? !0 : Ue(n) === Ue(e);
}
function ho(n, e, t) {
  if (n === e) return;
  const r = Ue(n), o = Ue(e);
  if (r !== o) throw new RangeError(`cannot ${t} of ${r} and ${o} calendars`);
}
function La(n, e) {
  if (n === e) return e;
  const t = Ue(n), r = Ue(e);
  if (t === r || t === "iso8601") return e;
  if (r === "iso8601") return n;
  throw new RangeError("irreconcilable calendars");
}
function Kt(n, e, t, r) {
  if (typeof n == "string") {
    const i = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.dateFromFields%"), i, [e, t]);
  }
  const o = N(oe(n, "dateFromFields"), n, [e, t]);
  if (!K(o)) throw new TypeError("invalid result");
  return o;
}
function In(n, e, t) {
  if (typeof n == "string") {
    const o = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.yearMonthFromFields%"), o, [e, t]);
  }
  let r = N(oe(n, "yearMonthFromFields"), n, [e, t]);
  if (!te(r)) throw new TypeError("invalid result");
  return r;
}
function Bn(n, e, t) {
  if (typeof n == "string") {
    const o = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.monthDayFromFields%"), o, [e, t]);
  }
  let r = N(oe(n, "monthDayFromFields"), n, [e, t]);
  if (!xe(r)) throw new TypeError("invalid result");
  return r;
}
function Ze(n) {
  if (ce(n)) {
    if (x(n)) return s(n, ie);
    if (!function(t) {
      return !!vt(t) || "getOffsetNanosecondsFor" in t && "getPossibleInstantsFor" in t && "id" in t;
    }(n)) throw new TypeError("expected a Temporal.TimeZone or object implementing the Temporal.TimeZone protocol");
    return n;
  }
  return tl(ot(n));
}
function hr(n) {
  if (typeof n == "string") return n;
  const e = n.id;
  if (typeof e != "string") throw new TypeError("timeZone.id should be a string");
  return e;
}
function ja(n) {
  return ce(n) ? n : new (I("%Temporal.TimeZone%"))(n);
}
function Ua(n, e) {
  return n === e ? !0 : hr(n) === hr(e);
}
function Zn(n) {
  return Dt(s(n, M), s(n, R), s(n, Y), s(n, b));
}
function ti(n) {
  return new (I("%Temporal.PlainTime%"))(s(n, j), s(n, U), s(n, z), s(n, q), s(n, B), s(n, Z));
}
function $t(n, e, t) {
  if (typeof n == "string") {
    const o = new (I("%Temporal.TimeZone%"))(n);
    return N(I("%Temporal.TimeZone.prototype.getOffsetNanosecondsFor%"), o, [e]);
  }
  const r = N(oe(n, "getOffsetNanosecondsFor"), n, [e]);
  if (typeof r != "number") throw new TypeError("bad return from getOffsetNanosecondsFor");
  if (!wt(r) || le(r) >= 864e11) throw new RangeError("out-of-range return from getOffsetNanosecondsFor");
  return r;
}
function xo(n, e) {
  return fo($t(n, e));
}
function pt(n, e, t) {
  const r = s(e, F), o = $t(n, e);
  let { year: i, month: a, day: c, hour: d, minute: u, second: h, millisecond: m, microsecond: f, nanosecond: y } = Ba(r);
  return { year: i, month: a, day: c, hour: d, minute: u, second: h, millisecond: m, microsecond: f, nanosecond: y } = ri(i, a, c, d, u, h, m, f, y + o), at(i, a, c, d, u, h, m, f, y, t);
}
function rt(n, e, t) {
  return za(Gr(n, e), n, e, t);
}
function za(n, e, t, r) {
  const o = I("%Temporal.Instant%"), i = n.length;
  if (i === 1) return n[0];
  if (i) switch (r) {
    case "compatible":
    case "earlier":
      return n[0];
    case "later":
      return n[i - 1];
    case "reject":
      throw new RangeError("multiple instants found");
  }
  const a = s(t, M), c = s(t, R), d = s(t, Y), u = s(t, j), h = s(t, U), m = s(t, z), f = s(t, q), y = s(t, B), g = s(t, Z), p = an(a, c, d, u, h, m, f, y, g);
  if (p === null) throw new RangeError("DateTime outside of supported range");
  const w = new o(l.subtract(p, St)), v = new o(l.add(p, St)), T = $t(e, w), E = $t(e, v) - T;
  switch (r) {
    case "earlier": {
      const D = s(t, b), k = I("%Temporal.PlainDateTime%"), _ = Fo(a, c, d, u, h, m, f, y, g, D, 0, 0, 0, 0, 0, 0, 0, 0, 0, -E, void 0);
      return Gr(e, new k(_.year, _.month, _.day, _.hour, _.minute, _.second, _.millisecond, _.microsecond, _.nanosecond, D))[0];
    }
    case "compatible":
    case "later": {
      const D = s(t, b), k = I("%Temporal.PlainDateTime%"), _ = Fo(a, c, d, u, h, m, f, y, g, D, 0, 0, 0, 0, 0, 0, 0, 0, 0, E, void 0), C = Gr(e, new k(_.year, _.month, _.day, _.hour, _.minute, _.second, _.millisecond, _.microsecond, _.nanosecond, D));
      return C[C.length - 1];
    }
    case "reject":
      throw new RangeError("no such instant found");
  }
}
function Gr(n, e, t) {
  if (typeof n == "string") {
    const i = new (I("%Temporal.TimeZone%"))(n);
    return N(I("%Temporal.TimeZone.prototype.getPossibleInstantsFor%"), i, [e]);
  }
  const r = N(oe(n, "getPossibleInstantsFor"), n, [e]), o = [];
  for (const i of r) {
    if (!Re(i)) throw new TypeError("bad return from getPossibleInstantsFor");
    Ia.call(o, i);
  }
  return o;
}
function On(n) {
  let e;
  return n < 0 || n > 9999 ? e = (n < 0 ? "-" : "+") + `000000${le(n)}`.slice(-6) : e = `0000${n}`.slice(-4), e;
}
function ue(n) {
  return `00${n}`.slice(-2);
}
function mo(n, e, t, r, o) {
  if (o === "minute") return "";
  const i = `:${ue(n)}`;
  let a, c = 1e6 * e + 1e3 * t + r;
  if (o === "auto") {
    if (c === 0) return i;
    for (a = `${c}`.padStart(9, "0"); a[a.length - 1] === "0"; ) a = a.slice(0, -1);
  } else {
    if (o === 0) return i;
    a = `${c}`.padStart(9, "0").slice(0, o);
  }
  return `${i}.${a}`;
}
function Ai(n, e, t) {
  let r = e;
  r === void 0 && (r = "UTC");
  const o = pt(r, n, "iso8601"), i = On(s(o, M)), a = ue(s(o, R)), c = ue(s(o, Y)), d = ue(s(o, j)), u = ue(s(o, U)), h = mo(s(o, z), s(o, q), s(o, B), s(o, Z), t);
  let m = "Z";
  return e !== void 0 && (m = qa($t(r, n))), `${i}-${a}-${c}T${d}:${u}${h}${m}`;
}
function bo(n, e = "auto", t) {
  function r(P) {
    return P <= Vs ? P.toString(10) : l.BigInt(P).toString(10);
  }
  const o = s(n, Ve), i = s(n, Ae), a = s(n, it), c = s(n, Ge), d = s(n, He), u = s(n, Ke);
  let h = s(n, Xe), m = s(n, Qe), f = s(n, Je), y = s(n, et);
  const g = Ft(o, i, a, c, d, u, h, m, f, y);
  if (t) {
    const { unit: P, increment: re, roundingMode: Q } = t;
    ({ seconds: h, milliseconds: m, microseconds: f, nanoseconds: y } = Xt(0, 0, 0, 0, 0, 0, h, m, f, y, re, P, Q));
  }
  const p = [];
  o && p.push(`${r(le(o))}Y`), i && p.push(`${r(le(i))}M`), a && p.push(`${r(le(a))}W`), c && p.push(`${r(le(c))}D`);
  const w = [];
  d && w.push(`${r(le(d))}H`), u && w.push(`${r(le(u))}M`);
  const v = [];
  let T, E, D, k, _ = Wn(0, 0, 0, h, m, f, y, 0);
  ({ quotient: _, remainder: T } = Ee(_, ne)), { quotient: _, remainder: E } = Ee(_, ne), { quotient: k, remainder: D } = Ee(_, ne);
  const C = 1e6 * le(l.toNumber(D)) + 1e3 * le(l.toNumber(E)) + le(l.toNumber(T));
  let $;
  if (e === "auto") {
    if (C !== 0) for ($ = `${C}`.padStart(9, "0"); $[$.length - 1] === "0"; ) $ = $.slice(0, -1);
  } else e !== 0 && ($ = `${C}`.padStart(9, "0").slice(0, e));
  return $ && v.unshift(".", $), l.equal(k, ve) && !v.length && e === "auto" || v.unshift(kt(k).toString()), v.length && w.push(`${v.join("")}S`), w.length && w.unshift("T"), p.length || w.length ? `${g < 0 ? "-" : ""}P${p.join("")}${w.join("")}` : "PT0S";
}
function Fi(n, e = "auto") {
  return `${On(s(n, M))}-${ue(s(n, R))}-${ue(s(n, Y))}${Wo(s(n, b), e)}`;
}
function Si(n, e, t = "auto", r) {
  let o = s(n, M), i = s(n, R), a = s(n, Y), c = s(n, j), d = s(n, U), u = s(n, z), h = s(n, q), m = s(n, B), f = s(n, Z);
  if (r) {
    const { unit: y, increment: g, roundingMode: p } = r;
    ({ year: o, month: i, day: a, hour: c, minute: d, second: u, millisecond: h, microsecond: m, nanosecond: f } = ci(o, i, a, c, d, u, h, m, f, g, y, p));
  }
  return `${On(o)}-${ue(i)}-${ue(a)}T${ue(c)}:${ue(d)}${mo(u, h, m, f, e)}${Wo(s(n, b), t)}`;
}
function Li(n, e = "auto") {
  let t = `${ue(s(n, R))}-${ue(s(n, Y))}`;
  const r = Ue(s(n, b));
  (e === "always" || e === "critical" || r !== "iso8601") && (t = `${On(s(n, M))}-${t}`);
  const o = Vo(r, e);
  return o && (t += o), t;
}
function ji(n, e = "auto") {
  let t = `${On(s(n, M))}-${ue(s(n, R))}`;
  const r = Ue(s(n, b));
  (e === "always" || e === "critical" || r !== "iso8601") && (t += `-${ue(s(n, Y))}`);
  const o = Vo(r, e);
  return o && (t += o), t;
}
function Ui(n, e, t = "auto", r = "auto", o = "auto", i) {
  let a = s(n, Be);
  if (i) {
    const { unit: h, increment: m, roundingMode: f } = i, y = Xr(s(n, F), m, h, f);
    a = new (I("%Temporal.Instant%"))(y);
  }
  const c = s(n, ie), d = pt(c, a, "iso8601");
  let u = `${On(s(d, M))}-${ue(s(d, R))}-${ue(s(d, Y))}T${ue(s(d, j))}:${ue(s(d, U))}${mo(s(d, z), s(d, q), s(d, B), s(d, Z), e)}`;
  return o !== "never" && (u += qa($t(c, a))), r !== "never" && (u += `[${r === "critical" ? "!" : ""}${hr(c)}]`), u += Wo(s(n, b), t), u;
}
function Yn(n) {
  return is.test(fr(n));
}
function on(n) {
  const e = is.exec(fr(n));
  if (!e) throw new RangeError(`invalid time zone offset: ${n}`);
  return (e[1] === "-" || e[1] === "−" ? -1 : 1) * (1e9 * (60 * (60 * +e[2] + +(e[3] || 0)) + +(e[4] || 0)) + +((e[5] || 0) + "000000000").slice(0, 9));
}
function ni(n) {
  return Yn(n) ? fo(on(n)) : xa(fr(n)).resolvedOptions().timeZone;
}
function Wt(n, e) {
  const { year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h } = Za(n, e), m = t % 400, f = (t - m) / 400, y = l.multiply(l.BigInt(146097), St), g = an(m, r, o, i, a, c, d, u, h), p = l.add(g, l.multiply(y, l.BigInt(f)));
  return l.toNumber(l.subtract(p, e));
}
function fo(n) {
  const e = n < 0 ? "-" : "+", t = le(n), r = t % 1e9, o = lt(t / 1e9) % 60, i = lt(t / 6e10) % 60, a = ue(lt(t / 36e11)), c = ue(i), d = ue(o);
  let u = "";
  if (r) {
    let h = `${r}`.padStart(9, "0");
    for (; h[h.length - 1] === "0"; ) h = h.slice(0, -1);
    u = `:${d}.${h}`;
  } else o && (u = `:${d}`);
  return `${e}${a}:${c}${u}`;
}
function qa(n) {
  let e = l.toNumber(ft(l.BigInt(n), $a, "halfExpand"));
  const t = e < 0 ? "-" : "+";
  e = le(e);
  const r = e / 6e10 % 60;
  return `${t}${ue(lt(e / 36e11))}:${ue(r)}`;
}
function an(n, e, t, r, o, i, a, c, d) {
  const u = /* @__PURE__ */ new Date();
  u.setUTCHours(r, o, i, a), u.setUTCFullYear(n, e - 1, t);
  const h = u.getTime();
  if (eo(h)) return null;
  let m = l.multiply(l.BigInt(h), bt);
  return m = l.add(m, l.multiply(l.BigInt(c), ne)), m = l.add(m, l.BigInt(d)), l.lessThan(m, cr) || l.greaterThan(m, Un) ? null : m;
}
function Ba(n) {
  const { quotient: e, remainder: t } = Ee(n, bt);
  let r = l.toNumber(e), o = l.toNumber(t);
  o < 0 && (o += 1e6, r -= 1);
  const i = lt(o / 1e3) % 1e3, a = o % 1e3, c = new Date(r);
  return { epochMilliseconds: r, year: c.getUTCFullYear(), month: c.getUTCMonth() + 1, day: c.getUTCDate(), hour: c.getUTCHours(), minute: c.getUTCMinutes(), second: c.getUTCSeconds(), millisecond: c.getUTCMilliseconds(), microsecond: i, nanosecond: a };
}
function Za(n, e) {
  const { epochMilliseconds: t, millisecond: r, microsecond: o, nanosecond: i } = Ba(e), { year: a, month: c, day: d, hour: u, minute: h, second: m } = function(y, g) {
    const p = xa(y).format(new Date(g));
    return function(v) {
      const T = v.split(/[^\w]+/);
      if (T.length !== 7) throw new RangeError(`expected 7 parts in "${v}`);
      const E = +T[0], D = +T[1];
      let k = +T[2];
      const _ = T[3].toUpperCase();
      if (_ === "B" || _ === "BC") k = 1 - k;
      else if (_ !== "A" && _ !== "AD") throw new RangeError(`Unknown era ${_} in "${v}`);
      let C = +T[4];
      C === 24 && (C = 0);
      const $ = +T[5], P = +T[6];
      if (!(nt(k) && nt(E) && nt(D) && nt(C) && nt($) && nt(P))) throw new RangeError(`Invalid number in "${v}`);
      return { year: k, month: E, day: D, hour: C, minute: $, second: P };
    }(p);
  }(n, t);
  return ri(a, c, d, u, h, m, r, o, i);
}
function zi(n, e) {
  return l.lessThan(n, e) ? e : n;
}
function Wa() {
  return l.add(ui(), Xs);
}
function Va(n, e) {
  if (l.lessThan(e, xn)) return Va(n, xn);
  const t = l.add(e, Ra), r = zi(Wa(), t);
  let o = zi(xn, e);
  const i = Wt(n, o);
  let a = o, c = i;
  for (; i === c && l.lessThan(l.BigInt(o), r); ) {
    if (a = l.add(o, Ya), l.greaterThan(a, Un)) return null;
    c = Wt(n, a), i === c && (o = a);
  }
  return i === c ? null : as((d) => Wt(n, d), o, a, i, c);
}
function Po(n, e) {
  const t = Wa(), r = l.greaterThan(e, t), o = r ? l.subtract(e, Ra) : xn;
  if (n === "Africa/Casablanca" || n === "Africa/El_Aaiun") {
    const u = s(Mt("2088-01-01T00Z"), F);
    if (l.lessThan(u, e)) return Po(n, u);
  }
  let i = l.subtract(e, Kn);
  if (l.lessThan(i, xn)) return null;
  const a = Wt(n, i);
  let c = i, d = a;
  for (; a === d && l.greaterThan(i, o); ) {
    if (c = l.subtract(i, Ya), l.lessThan(c, xn)) return null;
    d = Wt(n, c), a === d && (i = c);
  }
  if (a === d) {
    if (r) {
      const u = l.subtract(t, St);
      return Po(n, u);
    }
    return null;
  }
  return as((u) => Wt(n, u), c, i, d, a);
}
function sn(n) {
  return n === void 0 ? !1 : n % 4 == 0 && (n % 100 != 0 || n % 400 == 0);
}
function Vt(n, e) {
  return { standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] }[sn(n) ? "leapyear" : "standard"][e - 1];
}
function No(n, e, t) {
  const r = e + (e < 3 ? 10 : -2), o = n - (e < 3 ? 1 : 0), i = lt(o / 100), a = o - 100 * i, c = (t + lt(2.6 * r - 0.2) + (a + lt(a / 4)) + (lt(i / 4) - 2 * i)) % 7;
  return c + (c <= 0 ? 7 : 0);
}
function Hr(n, e, t) {
  let r = t;
  for (let o = e - 1; o > 0; o--) r += Vt(n, o);
  return r;
}
function qi(n, e, t) {
  const r = Hr(n, e, t), o = No(n, e, t) || 7, i = No(n, 1, 1), a = lt((r - o + 10) / 7);
  return a < 1 ? i === 5 || i === 6 && sn(n - 1) ? { week: 53, year: n - 1 } : { week: 52, year: n - 1 } : a === 53 && (sn(n) ? 366 : 365) - r < 4 - o ? { week: 1, year: n + 1 } : { week: a, year: n };
}
function Ft(n, e, t, r, o, i, a, c, d, u) {
  for (const h of [n, e, t, r, o, i, a, c, d, u]) if (h !== 0) return h < 0 ? -1 : 1;
  return 0;
}
function Pr(n, e) {
  let t = n, r = e;
  if (!nt(t) || !nt(r)) throw new RangeError("infinity is out of range");
  return r -= 1, t += lt(r / 12), r %= 12, r < 0 && (r += 12), r += 1, { year: t, month: r };
}
function yo(n, e, t) {
  let r = n, o = e, i = t;
  if (!nt(i)) throw new RangeError("infinity is out of range");
  ({ year: r, month: o } = Pr(r, o));
  const a = 146097;
  if (le(i) > a) {
    const u = gn(i / a);
    r += 400 * u, i -= u * a;
  }
  let c = 0, d = o > 2 ? r : r - 1;
  for (; c = sn(d) ? 366 : 365, i < -c; ) r -= 1, d -= 1, i += c;
  for (d += 1; c = sn(d) ? 366 : 365, i > c; ) r += 1, d += 1, i -= c;
  for (; i < 1; ) ({ year: r, month: o } = Pr(r, o - 1)), i += Vt(r, o);
  for (; i > Vt(r, o); ) i -= Vt(r, o), { year: r, month: o } = Pr(r, o + 1);
  return { year: r, month: o, day: i };
}
function ri(n, e, t, r, o, i, a, c, d) {
  const { deltaDays: u, hour: h, minute: m, second: f, millisecond: y, microsecond: g, nanosecond: p } = Bt(r, o, i, a, c, d), { year: w, month: v, day: T } = yo(n, e, t + u);
  return { year: w, month: v, day: T, hour: h, minute: m, second: f, millisecond: y, microsecond: g, nanosecond: p };
}
function Bt(n, e, t, r, o, i) {
  let a, c = l.BigInt(n), d = l.BigInt(e), u = l.BigInt(t), h = l.BigInt(r), m = l.BigInt(o), f = l.BigInt(i);
  return { quotient: a, remainder: f } = fn(f, ne), m = l.add(m, a), { quotient: a, remainder: m } = fn(m, ne), h = l.add(h, a), { quotient: a, remainder: h } = fn(h, ne), u = l.add(u, a), { quotient: a, remainder: u } = fn(u, Nt), d = l.add(d, a), { quotient: a, remainder: d } = fn(d, Nt), c = l.add(c, a), { quotient: a, remainder: c } = fn(c, Ma), { deltaDays: l.toNumber(a), hour: l.toNumber(c), minute: l.toNumber(d), second: l.toNumber(u), millisecond: l.toNumber(h), microsecond: l.toNumber(m), nanosecond: l.toNumber(f) };
}
function Wn(n, e, t, r, o, i, a, c) {
  const d = l.BigInt(n);
  let u = l.BigInt(a);
  n !== 0 && (u = l.subtract(l.BigInt(a), l.BigInt(c)));
  const h = l.add(l.BigInt(e), l.multiply(d, l.BigInt(24))), m = l.add(l.BigInt(t), l.multiply(h, Nt)), f = l.add(l.BigInt(r), l.multiply(m, Nt)), y = l.add(l.BigInt(o), l.multiply(f, ne)), g = l.add(l.BigInt(i), l.multiply(y, ne));
  return l.add(l.BigInt(u), l.multiply(g, ne));
}
function oi(n, e) {
  const t = I("%Temporal.Instant%"), r = jn(l.toNumber(n));
  let o = l.BigInt(n), i = 864e11;
  if (r === 0) return { days: 0, nanoseconds: ve, dayLengthNs: i };
  if (!x(e)) {
    let E;
    return { quotient: E, remainder: o } = Ee(o, l.BigInt(i)), { days: l.toNumber(E), nanoseconds: o, dayLengthNs: i };
  }
  const a = s(e, F), c = s(e, Be), d = l.add(a, o), u = new t(d), h = s(e, ie), m = s(e, b), f = pt(h, c, m), y = pt(h, u, m);
  let { days: g } = li(s(f, M), s(f, R), s(f, Y), s(f, j), s(f, U), s(f, z), s(f, q), s(f, B), s(f, Z), s(y, M), s(y, R), s(y, Y), s(y, j), s(y, U), s(y, z), s(y, q), s(y, B), s(y, Z), m, "day", We(null)), p = Et(c, h, m, 0, 0, 0, g, 0, 0, 0, 0, 0, 0), w = l.BigInt(g);
  if (r === 1) for (; l.greaterThan(w, ve) && l.greaterThan(p, d); ) w = l.subtract(w, Kn), p = Et(c, h, m, 0, 0, 0, l.toNumber(w), 0, 0, 0, 0, 0, 0);
  o = l.subtract(d, p);
  let v = !1, T = new t(p);
  do {
    const E = Et(T, h, m, 0, 0, 0, r, 0, 0, 0, 0, 0, 0), D = s(T, F);
    i = l.toNumber(l.subtract(E, D)), v = l.greaterThanOrEqual(l.multiply(l.subtract(o, l.BigInt(i)), l.BigInt(r)), ve), v && (o = l.subtract(o, l.BigInt(i)), T = new t(E), w = l.add(w, l.BigInt(r)));
  } while (v);
  if (!Tt(w) && Oi(w) !== r) throw new RangeError("Time zone or calendar converted nanoseconds into a number of days with the opposite sign");
  if (!Tt(o) && Oi(o) !== r)
    throw zr(o) && r === 1 ? new Error("assert not reached") : new RangeError("Time zone or calendar ended up with a remainder of nanoseconds with the opposite sign");
  if (l.greaterThanOrEqual(kt(o), kt(l.BigInt(i)))) throw new Error("assert not reached");
  return { days: l.toNumber(w), nanoseconds: o, dayLengthNs: le(i) };
}
function _t(n, e, t, r, o, i, a, c, d) {
  let u = Ga(n, e, t, r, o, i, a, c, d);
  if (u === "positive overflow" || u === "negative overflow") throw new RangeError("Duration out of range");
  return u;
}
function Ga(n, e, t, r, o, i, a, c, d) {
  let u, h, m, f, y, g, p = n;
  if (x(d)) {
    const C = Et(s(d, Be), s(d, ie), s(d, b), 0, 0, 0, p, e, t, r, o, i, a), $ = s(d, F);
    u = l.subtract(C, $);
  } else u = Wn(p, e, t, r, o, i, a, 0);
  c === "year" || c === "month" || c === "week" || c === "day" ? { days: p, nanoseconds: u } = oi(u, d) : p = 0;
  const w = l.lessThan(u, ve) ? -1 : 1;
  switch (u = kt(u), h = m = f = y = g = ve, c) {
    case "year":
    case "month":
    case "week":
    case "day":
    case "hour":
      ({ quotient: h, remainder: u } = Ee(u, ne)), { quotient: m, remainder: h } = Ee(h, ne), { quotient: f, remainder: m } = Ee(m, ne), { quotient: y, remainder: f } = Ee(f, Nt), { quotient: g, remainder: y } = Ee(y, Nt);
      break;
    case "minute":
      ({ quotient: h, remainder: u } = Ee(u, ne)), { quotient: m, remainder: h } = Ee(h, ne), { quotient: f, remainder: m } = Ee(m, ne), { quotient: y, remainder: f } = Ee(f, Nt);
      break;
    case "second":
      ({ quotient: h, remainder: u } = Ee(u, ne)), { quotient: m, remainder: h } = Ee(h, ne), { quotient: f, remainder: m } = Ee(m, ne);
      break;
    case "millisecond":
      ({ quotient: h, remainder: u } = Ee(u, ne)), { quotient: m, remainder: h } = Ee(h, ne);
      break;
    case "microsecond":
      ({ quotient: h, remainder: u } = Ee(u, ne));
      break;
    case "nanosecond":
      break;
    default:
      throw new Error("assert not reached");
  }
  const v = l.toNumber(g) * w, T = l.toNumber(y) * w, E = l.toNumber(f) * w, D = l.toNumber(m) * w, k = l.toNumber(h) * w, _ = l.toNumber(u) * w;
  for (const C of [p, v, T, E, D, k, _]) if (!nt(C)) return w === 1 ? "positive overflow" : "negative overflow";
  return { days: p, hours: v, minutes: T, seconds: E, milliseconds: D, microseconds: k, nanoseconds: _ };
}
function $r(n, e, t, r, o, i) {
  const a = I("%Temporal.Duration%"), c = Ft(n, e, t, r, 0, 0, 0, 0, 0, 0);
  if (c === 0) return { years: n, months: e, weeks: t, days: r };
  const d = l.BigInt(c);
  let u, h, m = l.BigInt(n), f = l.BigInt(e), y = l.BigInt(t), g = l.BigInt(r);
  i && (h = ae(i), u = s(h, b));
  const p = new a(c), w = new a(0, c), v = new a(0, 0, c);
  switch (o) {
    case "year":
      break;
    case "month":
      {
        if (!u) throw new RangeError("a starting point is required for months balancing");
        let T, E;
        for (typeof u != "string" && (T = oe(u, "dateAdd"), E = oe(u, "dateUntil")); !Tt(m); ) {
          const D = Le(u, h, p, void 0, T), k = We(null);
          k.largestUnit = "month";
          const _ = rn(u, h, D, k, E), C = l.BigInt(s(_, Ae));
          h = D, f = l.add(f, C), m = l.subtract(m, d);
        }
      }
      break;
    case "week": {
      if (!u) throw new RangeError("a starting point is required for weeks balancing");
      const T = typeof u != "string" ? oe(u, "dateAdd") : void 0;
      for (; !Tt(m); ) {
        let E;
        ({ relativeTo: h, days: E } = qe(u, h, p, T)), g = l.add(g, l.BigInt(E)), m = l.subtract(m, d);
      }
      for (; !Tt(f); ) {
        let E;
        ({ relativeTo: h, days: E } = qe(u, h, w, T)), g = l.add(g, l.BigInt(E)), f = l.subtract(f, d);
      }
      break;
    }
    default: {
      if (Tt(m) && Tt(f) && Tt(y)) break;
      if (!u) throw new RangeError("a starting point is required for balancing calendar units");
      const T = typeof u != "string" ? oe(u, "dateAdd") : void 0;
      for (; !Tt(m); ) {
        let E;
        ({ relativeTo: h, days: E } = qe(u, h, p, T)), g = l.add(g, l.BigInt(E)), m = l.subtract(m, d);
      }
      for (; !Tt(f); ) {
        let E;
        ({ relativeTo: h, days: E } = qe(u, h, w, T)), g = l.add(g, l.BigInt(E)), f = l.subtract(f, d);
      }
      for (; !Tt(y); ) {
        let E;
        ({ relativeTo: h, days: E } = qe(u, h, v, T)), g = l.add(g, l.BigInt(E)), y = l.subtract(y, d);
      }
      break;
    }
  }
  return { years: l.toNumber(m), months: l.toNumber(f), weeks: l.toNumber(y), days: l.toNumber(g) };
}
function Bi(n, e, t, r, o) {
  if (x(n)) {
    const i = s(n, Be), a = s(n, ie), c = s(n, b), d = $t(a, i), u = Et(i, a, c, e, t, r, o, 0, 0, 0, 0, 0, 0);
    return $t(a, new (I("%Temporal.Instant%"))(u)) - d;
  }
  return 0;
}
function Ha(n) {
  return new (I("%Temporal.Duration%"))(-s(n, Ve), -s(n, Ae), -s(n, it), -s(n, Ge), -s(n, He), -s(n, Ke), -s(n, Xe), -s(n, Qe), -s(n, Je), -s(n, et));
}
function st(n, e, t) {
  return Bs(t, Zs(e, n));
}
function Ka(n, e, t) {
  const r = st(e, 1, 12);
  return { year: n, month: r, day: st(t, 1, Vt(n, r)) };
}
function je(n, e, t) {
  if (n < e || n > t) throw new RangeError(`value out of range: ${e} <= ${n} <= ${t}`);
}
function Lt(n, e, t) {
  je(e, 1, 12), je(t, 1, Vt(n, e));
}
function Xa(n, e, t) {
  Qa(n, e, t, 12, 0, 0, 0, 0, 0);
}
function go(n, e, t, r, o, i) {
  je(n, 0, 23), je(e, 0, 59), je(t, 0, 59), je(r, 0, 999), je(o, 0, 999), je(i, 0, 999);
}
function ii(n, e, t, r, o, i, a, c, d) {
  Lt(n, e, t), go(r, o, i, a, c, d);
}
function Qa(n, e, t, r, o, i, a, c, d) {
  if (je(n, jr, Ur), n === jr && an(n, e, t + 1, r, o, i, a, c, d - 1) == null || n === Ur && an(n, e, t - 1, r, o, i, a, c, d + 1) == null) throw new RangeError("DateTime outside of supported range");
}
function yn(n) {
  if (l.lessThan(n, cr) || l.greaterThan(n, Un)) throw new RangeError("Instant outside of supported range");
}
function Kr(n, e, t, r, o, i, a, c, d, u) {
  const h = Ft(n, e, t, r, o, i, a, c, d, u);
  for (const m of [n, e, t, r, o, i, a, c, d, u]) {
    if (!nt(m)) throw new RangeError("infinite values not allowed as duration fields");
    const f = jn(m);
    if (f !== 0 && f !== h) throw new RangeError("mixed-sign values not allowed as duration fields");
  }
}
function ai(n, e, t, r, o, i, a) {
  switch (a) {
    case "year":
    case "month": {
      const c = -tn(n, e, t, r, o, i);
      if (c === 0) return { years: 0, months: 0, weeks: 0, days: 0 };
      const d = { year: n, month: e }, u = { year: r, month: o, day: i };
      let h = u.year - d.year, m = vn(n, e, t, h, 0, 0, 0, "constrain"), f = -tn(m.year, m.month, m.day, r, o, i);
      if (f === 0) return a === "year" ? { years: h, months: 0, weeks: 0, days: 0 } : { years: 0, months: 12 * h, weeks: 0, days: 0 };
      let y = u.month - d.month;
      if (f !== c && (h -= c, y += 12 * c), m = vn(n, e, t, h, y, 0, 0, "constrain"), f = -tn(m.year, m.month, m.day, r, o, i), f === 0) return a === "year" ? { years: h, months: y, weeks: 0, days: 0 } : { years: 0, months: y + 12 * h, weeks: 0, days: 0 };
      f !== c && (y -= c, y === -c && (h -= c, y = 11 * c), m = vn(n, e, t, h, y, 0, 0, "constrain"));
      let g = 0;
      return g = m.month === u.month ? u.day - m.day : c < 0 ? -m.day - (Vt(u.year, u.month) - u.day) : u.day + (Vt(m.year, m.month) - m.day), a === "month" && (y += 12 * h, h = 0), { years: h, months: y, weeks: 0, days: g };
    }
    case "week":
    case "day": {
      let c, d, u;
      tn(n, e, t, r, o, i) < 0 ? (d = { year: n, month: e, day: t }, c = { year: r, month: o, day: i }, u = 1) : (d = { year: r, month: o, day: i }, c = { year: n, month: e, day: t }, u = -1);
      let h = Hr(c.year, c.month, c.day) - Hr(d.year, d.month, d.day);
      for (let f = d.year; f < c.year; ++f) h += sn(f) ? 366 : 365;
      let m = 0;
      return a === "week" && (m = lt(h / 7), h %= 7), m *= u, h *= u, { years: 0, months: 0, weeks: m, days: h };
    }
    default:
      throw new Error("assert not reached");
  }
}
function Ja(n, e, t, r, o, i, a, c, d, u, h, m) {
  let f = a - n, y = c - e, g = d - t, p = u - r, w = h - o, v = m - i;
  const T = Ft(0, 0, 0, 0, f, y, g, p, w, v);
  f *= T, y *= T, g *= T, p *= T, w *= T, v *= T;
  let E = 0;
  if ({ deltaDays: E, hour: f, minute: y, second: g, millisecond: p, microsecond: w, nanosecond: v } = Bt(f, y, g, p, w, v), E != 0) throw new Error("assertion failure in DifferenceTime: _bt_.[[Days]] should be 0");
  return f *= T, y *= T, g *= T, p *= T, w *= T, v *= T, { hours: f, minutes: y, seconds: g, milliseconds: p, microseconds: w, nanoseconds: v };
}
function si(n, e, t, r, o, i) {
  const a = l.subtract(e, n);
  let c = 0, d = 0, u = l.toNumber(l.remainder(a, ne)), h = l.toNumber(l.remainder(l.divide(a, ne), ne)), m = l.toNumber(l.remainder(l.divide(a, bt), ne)), f = l.toNumber(l.divide(a, At));
  return { hours: c, minutes: d, seconds: f, milliseconds: m, microseconds: h, nanoseconds: u } = Xt(0, 0, 0, 0, 0, 0, f, m, h, u, t, r, i), _t(0, c, d, f, m, h, u, o);
}
function li(n, e, t, r, o, i, a, c, d, u, h, m, f, y, g, p, w, v, T, E, D) {
  let k = n, _ = e, C = t, { hours: $, minutes: P, seconds: re, milliseconds: Q, microseconds: J, nanoseconds: A } = Ja(r, o, i, a, c, d, f, y, g, p, w, v);
  const V = Ft(0, 0, 0, 0, $, P, re, Q, J, A);
  tn(u, h, m, k, _, C) === -V && ({ year: k, month: _, day: C } = yo(k, _, C - V), { hours: $, minutes: P, seconds: re, milliseconds: Q, microseconds: J, nanoseconds: A } = _t(-V, $, P, re, Q, J, A, E));
  const O = Dt(k, _, C, T), S = Dt(u, h, m, T), H = Cn("day", E), Ie = un(D);
  Ie.largestUnit = H;
  let { years: Oe, months: $e, weeks: be, days: ut } = rn(T, O, S, Ie);
  return { days: ut, hours: $, minutes: P, seconds: re, milliseconds: Q, microseconds: J, nanoseconds: A } = _t(ut, $, P, re, Q, J, A, E), { years: Oe, months: $e, weeks: be, days: ut, hours: $, minutes: P, seconds: re, milliseconds: Q, microseconds: J, nanoseconds: A };
}
function es(n, e, t, r, o, i) {
  const a = l.subtract(e, n);
  if (l.equal(a, ve)) return { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, microseconds: 0, nanoseconds: 0 };
  const c = I("%Temporal.Instant%"), d = new c(n), u = new c(e), h = pt(t, d, r), m = pt(t, u, r);
  let { years: f, months: y, weeks: g, days: p } = li(s(h, M), s(h, R), s(h, Y), s(h, j), s(h, U), s(h, z), s(h, q), s(h, B), s(h, Z), s(m, M), s(m, R), s(m, Y), s(m, j), s(m, U), s(m, z), s(m, q), s(m, B), s(m, Z), r, o, i);
  const w = Et(d, t, r, f, y, g, 0, 0, 0, 0, 0, 0, 0);
  let v = l.subtract(e, w);
  const T = Se(w, t, r);
  ({ nanoseconds: v, days: p } = oi(v, T));
  const { hours: E, minutes: D, seconds: k, milliseconds: _, microseconds: C, nanoseconds: $ } = _t(0, 0, 0, 0, 0, 0, l.toNumber(v), "hour");
  return { years: f, months: y, weeks: g, days: p, hours: E, minutes: D, seconds: k, milliseconds: _, microseconds: C, nanoseconds: $ };
}
function tr(n, e, t, r, o, i) {
  const a = yr.reduce((y, g) => {
    const p = g[0], w = g[1], v = g[2];
    return t !== "datetime" && v !== t || r.includes(w) || y.push(w, p), y;
  }, []);
  let c = ct(e, "largestUnit", t, "auto");
  if (r.includes(c)) throw new RangeError(`largestUnit must be one of ${a.join(", ")}, not ${c}`);
  const d = Qn(e);
  let u = Ot(e, "trunc");
  n === "since" && (u = function(g) {
    switch (g) {
      case "ceil":
        return "floor";
      case "floor":
        return "ceil";
      case "halfCeil":
        return "halfFloor";
      case "halfFloor":
        return "halfCeil";
      default:
        return g;
    }
  }(u));
  const h = ct(e, "smallestUnit", t, o);
  if (r.includes(h)) throw new RangeError(`smallestUnit must be one of ${a.join(", ")}, not ${h}`);
  const m = Cn(i, h);
  if (c === "auto" && (c = m), Cn(c, h) !== c) throw new RangeError(`largestUnit ${c} cannot be smaller than smallestUnit ${h}`);
  const f = { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[h];
  return f !== void 0 && Jn(d, f, !1), { largestUnit: c, roundingIncrement: d, roundingMode: u, smallestUnit: h };
}
function Zi(n, e, t, r) {
  const o = n === "since" ? -1 : 1, i = Mt(t), a = tr(n, un(r), "time", [], "nanosecond", "second"), c = s(e, F), d = s(i, F);
  let { hours: u, minutes: h, seconds: m, milliseconds: f, microseconds: y, nanoseconds: g } = si(c, d, a.roundingIncrement, a.smallestUnit, a.largestUnit, a.roundingMode);
  return new (I("%Temporal.Duration%"))(0, 0, 0, 0, o * u, o * h, o * m, o * f, o * y, o * g);
}
function Wi(n, e, t, r) {
  const o = n === "since" ? -1 : 1, i = ae(t), a = s(e, b);
  ho(a, s(i, b), "compute difference between dates");
  const c = un(r), d = tr(n, c, "date", [], "day", "day");
  c.largestUnit = d.largestUnit;
  let { years: u, months: h, weeks: m, days: f } = rn(a, e, i, c);
  return d.smallestUnit === "day" && d.roundingIncrement === 1 || ({ years: u, months: h, weeks: m, days: f } = Xt(u, h, m, f, 0, 0, 0, 0, 0, 0, d.roundingIncrement, d.smallestUnit, d.roundingMode, e)), new (I("%Temporal.Duration%"))(o * u, o * h, o * m, o * f, 0, 0, 0, 0, 0, 0);
}
function Vi(n, e, t, r) {
  const o = n === "since" ? -1 : 1, i = pn(t), a = s(e, b);
  ho(a, s(i, b), "compute difference between dates");
  const c = un(r), d = tr(n, c, "datetime", [], "nanosecond", "day");
  let { years: u, months: h, weeks: m, days: f, hours: y, minutes: g, seconds: p, milliseconds: w, microseconds: v, nanoseconds: T } = li(s(e, M), s(e, R), s(e, Y), s(e, j), s(e, U), s(e, z), s(e, q), s(e, B), s(e, Z), s(i, M), s(i, R), s(i, Y), s(i, j), s(i, U), s(i, z), s(i, q), s(i, B), s(i, Z), a, d.largestUnit, c);
  const E = Zn(e);
  return { years: u, months: h, weeks: m, days: f, hours: y, minutes: g, seconds: p, milliseconds: w, microseconds: v, nanoseconds: T } = Xt(u, h, m, f, y, g, p, w, v, T, d.roundingIncrement, d.smallestUnit, d.roundingMode, E), { days: f, hours: y, minutes: g, seconds: p, milliseconds: w, microseconds: v, nanoseconds: T } = _t(f, y, g, p, w, v, T, d.largestUnit), new (I("%Temporal.Duration%"))(o * u, o * h, o * m, o * f, o * y, o * g, o * p, o * w, o * v, o * T);
}
function Gi(n, e, t, r) {
  const o = n === "since" ? -1 : 1, i = Zt(t), a = tr(n, un(r), "time", [], "nanosecond", "hour");
  let { hours: c, minutes: d, seconds: u, milliseconds: h, microseconds: m, nanoseconds: f } = Ja(s(e, j), s(e, U), s(e, z), s(e, q), s(e, B), s(e, Z), s(i, j), s(i, U), s(i, z), s(i, q), s(i, B), s(i, Z));
  return { hours: c, minutes: d, seconds: u, milliseconds: h, microseconds: m, nanoseconds: f } = Xt(0, 0, 0, 0, c, d, u, h, m, f, a.roundingIncrement, a.smallestUnit, a.roundingMode), { hours: c, minutes: d, seconds: u, milliseconds: h, microseconds: m, nanoseconds: f } = _t(0, c, d, u, h, m, f, a.largestUnit), new (I("%Temporal.Duration%"))(0, 0, 0, 0, o * c, o * d, o * u, o * h, o * m, o * f);
}
function Hi(n, e, t, r) {
  const o = n === "since" ? -1 : 1, i = or(t), a = s(e, b);
  ho(a, s(i, b), "compute difference between months");
  const c = un(r), d = tr(n, c, "date", ["week", "day"], "month", "year");
  c.largestUnit = d.largestUnit;
  const u = Me(a, ["monthCode", "year"]), h = G(e, u, []);
  h.day = 1;
  const m = Kt(a, h), f = G(i, u, []);
  f.day = 1;
  const y = Kt(a, f);
  let { years: g, months: p } = rn(a, m, y, c);
  return d.smallestUnit === "month" && d.roundingIncrement === 1 || ({ years: g, months: p } = Xt(g, p, 0, 0, 0, 0, 0, 0, 0, 0, d.roundingIncrement, d.smallestUnit, d.roundingMode, m)), new (I("%Temporal.Duration%"))(o * g, o * p, 0, 0, 0, 0, 0, 0, 0, 0);
}
function Ki(n, e, t, r) {
  const o = n === "since" ? -1 : 1, i = ir(t), a = s(e, b);
  ho(a, s(i, b), "compute difference between dates");
  const c = un(r), d = tr(n, c, "datetime", [], "nanosecond", "hour");
  c.largestUnit = d.largestUnit;
  const u = s(e, F), h = s(i, F);
  let m, f, y, g, p, w, v, T, E, D;
  if (d.largestUnit !== "year" && d.largestUnit !== "month" && d.largestUnit !== "week" && d.largestUnit !== "day") m = 0, f = 0, y = 0, g = 0, { hours: p, minutes: w, seconds: v, milliseconds: T, microseconds: E, nanoseconds: D } = si(u, h, d.roundingIncrement, d.smallestUnit, d.largestUnit, d.roundingMode);
  else {
    const k = s(e, ie);
    if (!Ua(k, s(i, ie))) throw new RangeError("When calculating difference between time zones, largestUnit must be 'hours' or smaller because day lengths can vary between time zones due to DST or time zone offset changes.");
    ({ years: m, months: f, weeks: y, days: g, hours: p, minutes: w, seconds: v, milliseconds: T, microseconds: E, nanoseconds: D } = es(u, h, k, a, d.largestUnit, c)), { years: m, months: f, weeks: y, days: g, hours: p, minutes: w, seconds: v, milliseconds: T, microseconds: E, nanoseconds: D } = Xt(m, f, y, g, p, w, v, T, E, D, d.roundingIncrement, d.smallestUnit, d.roundingMode, e), { years: m, months: f, weeks: y, days: g, hours: p, minutes: w, seconds: v, milliseconds: T, microseconds: E, nanoseconds: D } = os(m, f, y, g, p, w, v, T, E, D, d.roundingIncrement, d.smallestUnit, d.roundingMode, e);
  }
  return new (I("%Temporal.Duration%"))(o * m, o * f, o * y, o * g, o * p, o * w, o * v, o * T, o * E, o * D);
}
function vn(n, e, t, r, o, i, a, c) {
  let d = n, u = e, h = t, m = i, f = a;
  return d += r, u += o, { year: d, month: u } = Pr(d, u), { year: d, month: u, day: h } = Br(d, u, h, c), f += 7 * m, h += f, { year: d, month: u, day: h } = yo(d, u, h), { year: d, month: u, day: h };
}
function ts(n, e, t, r, o, i, a, c, d, u, h, m) {
  let f = n, y = e, g = t, p = r, w = o, v = i;
  f += a, y += c, g += d, p += u, w += h, v += m;
  let T = 0;
  return { deltaDays: T, hour: f, minute: y, second: g, millisecond: p, microsecond: w, nanosecond: v } = Bt(f, y, g, p, w, v), { deltaDays: T, hour: f, minute: y, second: g, millisecond: p, microsecond: w, nanosecond: v };
}
function ns(n, e, t, r, o, i, a, c, d, u, h, m, f, y, g, p, w, v, T, E, D) {
  const k = Cn(Yo(n, e, t, r, o, i, a, c, d, u), Yo(h, m, f, y, g, p, w, v, T, E));
  let _, C, $, P, re, Q, J, A, V, O;
  if (D) if (K(D)) {
    const S = I("%Temporal.Duration%"), H = s(D, b), Ie = new S(n, e, t, r, 0, 0, 0, 0, 0, 0), Oe = new S(h, m, f, y, 0, 0, 0, 0, 0, 0), $e = typeof H != "string" ? oe(H, "dateAdd") : void 0, be = Le(H, D, Ie, void 0, $e), ut = Le(H, be, Oe, void 0, $e), Rt = Cn("day", k), Yt = We(null);
    Yt.largestUnit = Rt, { years: _, months: C, weeks: $, days: P } = rn(H, D, ut, Yt), { days: P, hours: re, minutes: Q, seconds: J, milliseconds: A, microseconds: V, nanoseconds: O } = _t(P, l.add(l.BigInt(o), l.BigInt(g)), l.add(l.BigInt(i), l.BigInt(p)), l.add(l.BigInt(a), l.BigInt(w)), l.add(l.BigInt(c), l.BigInt(v)), l.add(l.BigInt(d), l.BigInt(T)), l.add(l.BigInt(u), l.BigInt(E)), k);
  } else {
    const S = I("%Temporal.Instant%"), H = s(D, ie), Ie = s(D, b), Oe = Et(s(D, Be), H, Ie, n, e, t, r, o, i, a, c, d, u), $e = Et(new S(Oe), H, Ie, h, m, f, y, g, p, w, v, T, E);
    k !== "year" && k !== "month" && k !== "week" && k !== "day" ? (_ = 0, C = 0, $ = 0, P = 0, { hours: re, minutes: Q, seconds: J, milliseconds: A, microseconds: V, nanoseconds: O } = si(s(D, F), $e, 1, "nanosecond", k, "halfExpand")) : { years: _, months: C, weeks: $, days: P, hours: re, minutes: Q, seconds: J, milliseconds: A, microseconds: V, nanoseconds: O } = es(s(D, F), $e, H, Ie, k, We(null));
  }
  else {
    if (k === "year" || k === "month" || k === "week") throw new RangeError("relativeTo is required for years, months, or weeks arithmetic");
    _ = C = $ = 0, { days: P, hours: re, minutes: Q, seconds: J, milliseconds: A, microseconds: V, nanoseconds: O } = _t(r + y, l.add(l.BigInt(o), l.BigInt(g)), l.add(l.BigInt(i), l.BigInt(p)), l.add(l.BigInt(a), l.BigInt(w)), l.add(l.BigInt(c), l.BigInt(v)), l.add(l.BigInt(d), l.BigInt(T)), l.add(l.BigInt(u), l.BigInt(E)), k);
  }
  return Kr(_, C, $, P, re, Q, J, A, V, O), { years: _, months: C, weeks: $, days: P, hours: re, minutes: Q, seconds: J, milliseconds: A, microseconds: V, nanoseconds: O };
}
function Ao(n, e, t, r, o, i, a) {
  let c = ve;
  c = l.add(c, l.BigInt(a)), c = l.add(c, l.multiply(l.BigInt(i), ne)), c = l.add(c, l.multiply(l.BigInt(o), bt)), c = l.add(c, l.multiply(l.BigInt(r), At)), c = l.add(c, l.multiply(l.BigInt(t), l.BigInt(6e10))), c = l.add(c, l.multiply(l.BigInt(e), l.BigInt(36e11)));
  const d = l.add(n, c);
  return yn(d), d;
}
function Fo(n, e, t, r, o, i, a, c, d, u, h, m, f, y, g, p, w, v, T, E, D) {
  let k = y, { deltaDays: _, hour: C, minute: $, second: P, millisecond: re, microsecond: Q, nanosecond: J } = ts(r, o, i, a, c, d, g, p, w, v, T, E);
  k += _;
  const A = I("%Temporal.Duration%"), V = Le(u, Dt(n, e, t, u), new A(h, m, f, k, 0, 0, 0, 0, 0, 0), D);
  return { year: s(V, M), month: s(V, R), day: s(V, Y), hour: C, minute: $, second: P, millisecond: re, microsecond: Q, nanosecond: J };
}
function Et(n, e, t, r, o, i, a, c, d, u, h, m, f, y) {
  const g = I("%Temporal.Duration%");
  if (Ft(r, o, i, a, 0, 0, 0, 0, 0, 0) === 0) return Ao(s(n, F), c, d, u, h, m, f);
  const p = pt(e, n, t), w = Le(t, Dt(s(p, M), s(p, R), s(p, Y), t), new g(r, o, i, a, 0, 0, 0, 0, 0, 0), y), v = at(s(w, M), s(w, R), s(w, Y), s(p, j), s(p, U), s(p, z), s(p, q), s(p, B), s(p, Z), t);
  return Ao(s(rt(e, v, "compatible"), F), c, d, u, h, m, f);
}
function Xi(n, e, t, r) {
  const o = n === "subtract" ? -1 : 1;
  let { years: i, months: a, weeks: c, days: d, hours: u, minutes: h, seconds: m, milliseconds: f, microseconds: y, nanoseconds: g } = Mn(t);
  const p = xr(X(r));
  return { years: i, months: a, weeks: c, days: d, hours: u, minutes: h, seconds: m, milliseconds: f, microseconds: y, nanoseconds: g } = ns(s(e, Ve), s(e, Ae), s(e, it), s(e, Ge), s(e, He), s(e, Ke), s(e, Xe), s(e, Qe), s(e, Je), s(e, et), o * i, o * a, o * c, o * d, o * u, o * h, o * m, o * f, o * y, o * g, p), new (I("%Temporal.Duration%"))(i, a, c, d, u, h, m, f, y, g);
}
function Qi(n, e, t) {
  const r = n === "subtract" ? -1 : 1, { hours: o, minutes: i, seconds: a, milliseconds: c, microseconds: d, nanoseconds: u } = function(f, y) {
    let g = Mn(f);
    for (const p of y) if (g[p] !== 0) throw new RangeError(`Duration field ${p} not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead.`);
    return g;
  }(t, ["years", "months", "weeks", "days"]), h = Ao(s(e, F), r * o, r * i, r * a, r * c, r * d, r * u);
  return new (I("%Temporal.Instant%"))(h);
}
function Ji(n, e, t, r) {
  const o = n === "subtract" ? -1 : 1, { years: i, months: a, weeks: c, days: d, hours: u, minutes: h, seconds: m, milliseconds: f, microseconds: y, nanoseconds: g } = Mn(t), p = X(r), w = s(e, b), { year: v, month: T, day: E, hour: D, minute: k, second: _, millisecond: C, microsecond: $, nanosecond: P } = Fo(s(e, M), s(e, R), s(e, Y), s(e, j), s(e, U), s(e, z), s(e, q), s(e, B), s(e, Z), w, o * i, o * a, o * c, o * d, o * u, o * h, o * m, o * f, o * y, o * g, p);
  return at(v, T, E, D, k, _, C, $, P, w);
}
function ea(n, e, t) {
  const r = n === "subtract" ? -1 : 1, { hours: o, minutes: i, seconds: a, milliseconds: c, microseconds: d, nanoseconds: u } = Mn(t);
  let { hour: h, minute: m, second: f, millisecond: y, microsecond: g, nanosecond: p } = ts(s(e, j), s(e, U), s(e, z), s(e, q), s(e, B), s(e, Z), r * o, r * i, r * a, r * c, r * d, r * u);
  return { hour: h, minute: m, second: f, millisecond: y, microsecond: g, nanosecond: p } = no(h, m, f, y, g, p, "reject"), new (I("%Temporal.PlainTime%"))(h, m, f, y, g, p);
}
function ta(n, e, t, r) {
  let o = Mn(t);
  n === "subtract" && (o = { years: -o.years, months: -o.months, weeks: -o.weeks, days: -o.days, hours: -o.hours, minutes: -o.minutes, seconds: -o.seconds, milliseconds: -o.milliseconds, microseconds: -o.microseconds, nanoseconds: -o.nanoseconds });
  let { years: i, months: a, weeks: c, days: d, hours: u, minutes: h, seconds: m, milliseconds: f, microseconds: y, nanoseconds: g } = o;
  ({ days: d } = _t(d, u, h, m, f, y, g, "day"));
  const p = X(r), w = s(e, b), v = Me(w, ["monthCode", "year"]), T = G(e, v, []), E = We(null);
  Pn(E, T, []), T.day = 1;
  let D = Kt(w, T);
  const k = Ft(i, a, c, d, 0, 0, 0, 0, 0, 0), _ = oe(w, "dateAdd"), C = I("%Temporal.Duration%");
  if (k < 0) {
    const re = Le(w, D, new C(0, 1, 0, 0, 0, 0, 0, 0, 0, 0), void 0, _), Q = Le(w, re, new C(0, 0, 0, -1, 0, 0, 0, 0, 0, 0), void 0, _);
    E.day = br(w, Q), D = Kt(w, E);
  }
  const $ = new C(i, a, c, d, 0, 0, 0, 0, 0, 0), P = un(p);
  return In(w, G(Le(w, D, $, p, _), v, []), P);
}
function na(n, e, t, r) {
  const o = n === "subtract" ? -1 : 1, { years: i, months: a, weeks: c, days: d, hours: u, minutes: h, seconds: m, milliseconds: f, microseconds: y, nanoseconds: g } = Mn(t), p = X(r), w = s(e, ie), v = s(e, b);
  return Se(Et(s(e, Be), w, v, o * i, o * a, o * c, o * d, o * u, o * h, o * m, o * f, o * y, o * g, p), w, v);
}
function ft(n, e, t) {
  if (l.equal(e, Kn)) return n;
  let { quotient: r, remainder: o } = Ee(n, e);
  if (l.equal(o, ve)) return n;
  const i = l.lessThan(o, ve) ? -1 : 1, a = kt(l.multiply(o, l.BigInt(2))), c = l.equal(a, e), d = l.greaterThan(a, e);
  switch (t) {
    case "ceil":
      i > 0 && (r = l.add(r, l.BigInt(i)));
      break;
    case "floor":
      i < 0 && (r = l.add(r, l.BigInt(i)));
      break;
    case "expand":
      r = l.add(r, l.BigInt(i));
      break;
    case "trunc":
      break;
    case "halfCeil":
      (d || c && i > 0) && (r = l.add(r, l.BigInt(i)));
      break;
    case "halfFloor":
      (d || c && i < 0) && (r = l.add(r, l.BigInt(i)));
      break;
    case "halfExpand":
      (d || c) && (r = l.add(r, l.BigInt(i)));
      break;
    case "halfTrunc":
      d && (r = l.add(r, l.BigInt(i)));
      break;
    case "halfEven":
      (d || c && l.toNumber(l.remainder(kt(r), l.BigInt(2))) === 1) && (r = l.add(r, l.BigInt(i)));
  }
  return l.multiply(r, e);
}
function Xr(n, e, t, r) {
  let { remainder: o } = fn(n, St);
  const i = l.subtract(n, o), a = ft(o, l.BigInt(ss[t] * e), r);
  return l.add(i, a);
}
function ci(n, e, t, r, o, i, a, c, d, u, h, m, f = 864e11) {
  const { deltaDays: y, hour: g, minute: p, second: w, millisecond: v, microsecond: T, nanosecond: E } = di(r, o, i, a, c, d, u, h, m, f), { year: D, month: k, day: _ } = yo(n, e, t + y);
  return { year: D, month: k, day: _, hour: g, minute: p, second: w, millisecond: v, microsecond: T, nanosecond: E };
}
function di(n, e, t, r, o, i, a, c, d, u = 864e11) {
  let h = ve;
  switch (c) {
    case "day":
    case "hour":
      h = l.BigInt(n);
    case "minute":
      h = l.add(l.multiply(h, Nt), l.BigInt(e));
    case "second":
      h = l.add(l.multiply(h, Nt), l.BigInt(t));
    case "millisecond":
      h = l.add(l.multiply(h, ne), l.BigInt(r));
    case "microsecond":
      h = l.add(l.multiply(h, ne), l.BigInt(o));
    case "nanosecond":
      h = l.add(l.multiply(h, ne), l.BigInt(i));
  }
  const m = c === "day" ? u : ss[c], f = ft(h, l.BigInt(m * a), d), y = l.toNumber(l.divide(f, l.BigInt(m)));
  switch (c) {
    case "day":
      return { deltaDays: y, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
    case "hour":
      return Bt(y, 0, 0, 0, 0, 0);
    case "minute":
      return Bt(n, y, 0, 0, 0, 0);
    case "second":
      return Bt(n, e, y, 0, 0, 0);
    case "millisecond":
      return Bt(n, e, t, y, 0, 0);
    case "microsecond":
      return Bt(n, e, t, r, y, 0);
    case "nanosecond":
      return Bt(n, e, t, r, o, y);
    default:
      throw new Error(`Invalid unit ${c}`);
  }
}
function Nr(n, e) {
  return ai(s(n, M), s(n, R), s(n, Y), s(e, M), s(e, R), s(e, Y), "day").days;
}
function qe(n, e, t, r) {
  const o = Le(n, e, t, void 0, r);
  return { relativeTo: o, days: Nr(e, o) };
}
function rs(n, e, t, r, o) {
  const i = s(n, ie), a = s(n, b);
  return Se(Et(s(n, Be), i, a, e, t, r, o, 0, 0, 0, 0, 0, 0), i, a);
}
function os(n, e, t, r, o, i, a, c, d, u, h, m, f, y) {
  let g = n, p = e, w = t, v = r, T = o, E = i, D = a, k = c, _ = d, C = u;
  if (!x(y) || m === "year" || m === "month" || m === "week" || m === "day" || m === "nanosecond" && h === 1) return { years: g, months: p, weeks: w, days: v, hours: T, minutes: E, seconds: D, milliseconds: k, microseconds: _, nanoseconds: C };
  let $ = Wn(0, T, E, D, k, _, C, 0);
  const P = jn(l.toNumber($)), re = s(y, ie), Q = s(y, b), J = Et(s(y, Be), re, Q, g, p, w, v, 0, 0, 0, 0, 0, 0), A = Et(new (I("%Temporal.Instant%"))(J), re, Q, 0, 0, 0, P, 0, 0, 0, 0, 0, 0), V = l.subtract(A, J);
  return l.greaterThanOrEqual(l.multiply(l.subtract($, V), l.BigInt(P)), ve) && ({ years: g, months: p, weeks: w, days: v } = ns(g, p, w, v, 0, 0, 0, 0, 0, 0, 0, 0, 0, P, 0, 0, 0, 0, 0, 0, y), $ = Xr(l.subtract($, V), h, m, f), { hours: T, minutes: E, seconds: D, milliseconds: k, microseconds: _, nanoseconds: C } = _t(0, 0, 0, 0, 0, 0, l.toNumber($), "hour")), { years: g, months: p, weeks: w, days: v, hours: T, minutes: E, seconds: D, milliseconds: k, microseconds: _, nanoseconds: C };
}
function Xt(n, e, t, r, o, i, a, c, d, u, h, m, f, y) {
  let g = n, p = e, w = t, v = r, T = o, E = i, D = a, k = c, _ = d, C = l.BigInt(u);
  const $ = I("%Temporal.Duration%");
  let P, re, Q, J, A = y;
  if (A) {
    if (x(A)) re = A, A = ae(A);
    else if (!K(A)) throw new TypeError("starting point must be PlainDate or ZonedDateTime");
    P = s(A, b);
  }
  if (m === "year" || m === "month" || m === "week" || m === "day") {
    let V, O, S;
    C = Wn(0, T, E, D, k, _, u, 0), re && (V = rs(re, g, p, w, v)), { days: O, nanoseconds: C, dayLengthNs: S } = oi(C, V), Q = l.BigInt(S), v += O, T = E = D = k = _ = 0;
  }
  switch (m) {
    case "year": {
      if (!P) throw new RangeError("A starting point is required for years rounding");
      const V = new $(g), O = typeof P != "string" ? oe(P, "dateAdd") : void 0, S = Le(P, A, V, void 0, O), H = Le(P, A, new $(g, p, w), void 0, O);
      A = S, v += Nr(S, H);
      const Ie = Le(P, A, new $(0, 0, 0, v), void 0, O), Oe = We(null);
      Oe.largestUnit = "year";
      const $e = rn(P, A, Ie, Oe).years;
      g += $e;
      const be = A;
      A = Le(P, A, new $($e), void 0, O), v -= Nr(be, A);
      const ut = new $(v < 0 ? -1 : 1);
      let { days: Rt } = qe(P, A, ut, O);
      Rt = le(Rt);
      const Yt = l.multiply(l.BigInt(Rt), Q);
      C = l.add(l.add(l.multiply(Yt, l.BigInt(g)), l.multiply(l.BigInt(v), Q)), C);
      const ht = ft(C, l.multiply(Yt, l.BigInt(h)), f);
      J = xt(C, Yt), g = l.toNumber(l.divide(ht, Yt)), C = ve, p = w = v = 0;
      break;
    }
    case "month": {
      if (!P) throw new RangeError("A starting point is required for months rounding");
      const V = new $(g, p), O = typeof P != "string" ? oe(P, "dateAdd") : void 0, S = Le(P, A, V, void 0, O), H = Le(P, A, new $(g, p, w), void 0, O);
      A = S, v += Nr(S, H);
      const Ie = jn(v), Oe = new $(0, v < 0 ? -1 : 1);
      let $e;
      for ({ relativeTo: A, days: $e } = qe(P, A, Oe, O); le(v) >= le($e); ) p += Ie, v -= $e, { relativeTo: A, days: $e } = qe(P, A, Oe, O);
      $e = le($e);
      const be = l.multiply(l.BigInt($e), Q);
      C = l.add(l.add(l.multiply(be, l.BigInt(p)), l.multiply(l.BigInt(v), Q)), C);
      const ut = ft(C, l.multiply(be, l.BigInt(h)), f);
      J = xt(C, be), p = l.toNumber(l.divide(ut, be)), C = ve, w = v = 0;
      break;
    }
    case "week": {
      if (!P) throw new RangeError("A starting point is required for weeks rounding");
      const V = jn(v), O = new $(0, 0, v < 0 ? -1 : 1), S = typeof P != "string" ? oe(P, "dateAdd") : void 0;
      let H;
      for ({ relativeTo: A, days: H } = qe(P, A, O, S); le(v) >= le(H); ) w += V, v -= H, { relativeTo: A, days: H } = qe(P, A, O, S);
      H = le(H);
      const Ie = l.multiply(l.BigInt(H), Q);
      C = l.add(l.add(l.multiply(Ie, l.BigInt(w)), l.multiply(l.BigInt(v), Q)), C);
      const Oe = ft(C, l.multiply(Ie, l.BigInt(h)), f);
      J = xt(C, Ie), w = l.toNumber(l.divide(Oe, Ie)), C = ve, v = 0;
      break;
    }
    case "day": {
      const V = Q;
      C = l.add(l.multiply(V, l.BigInt(v)), C);
      const O = ft(C, l.multiply(V, l.BigInt(h)), f);
      J = xt(C, V), v = l.toNumber(l.divide(O, V)), C = ve;
      break;
    }
    case "hour": {
      let O = l.multiply(l.BigInt(T), l.BigInt(36e11));
      O = l.add(O, l.multiply(l.BigInt(E), l.BigInt(6e10))), O = l.add(O, l.multiply(l.BigInt(D), At)), O = l.add(O, l.multiply(l.BigInt(k), bt)), O = l.add(O, l.multiply(l.BigInt(_), ne)), O = l.add(O, C), J = xt(O, l.BigInt(36e11));
      const S = ft(O, l.BigInt(36e11 * h), f);
      T = l.toNumber(l.divide(S, l.BigInt(36e11))), C = ve, E = D = k = _ = 0;
      break;
    }
    case "minute": {
      let O = l.multiply(l.BigInt(E), l.BigInt(6e10));
      O = l.add(O, l.multiply(l.BigInt(D), At)), O = l.add(O, l.multiply(l.BigInt(k), bt)), O = l.add(O, l.multiply(l.BigInt(_), ne)), O = l.add(O, C), J = xt(O, l.BigInt(6e10));
      const S = ft(O, l.BigInt(6e10 * h), f);
      E = l.toNumber(l.divide(S, l.BigInt(6e10))), C = ve, D = k = _ = 0;
      break;
    }
    case "second": {
      let O = l.multiply(l.BigInt(D), At);
      O = l.add(O, l.multiply(l.BigInt(k), bt)), O = l.add(O, l.multiply(l.BigInt(_), ne)), O = l.add(O, C), J = xt(O, l.BigInt(1e9));
      const S = ft(O, l.BigInt(1e9 * h), f);
      D = l.toNumber(l.divide(S, l.BigInt(1e9))), C = ve, k = _ = 0;
      break;
    }
    case "millisecond": {
      let O = l.multiply(l.BigInt(k), bt);
      O = l.add(O, l.multiply(l.BigInt(_), ne)), O = l.add(O, C), J = xt(O, l.BigInt(1e6));
      const S = ft(O, l.BigInt(1e6 * h), f);
      k = l.toNumber(l.divide(S, l.BigInt(1e6))), C = ve, _ = 0;
      break;
    }
    case "microsecond": {
      let O = l.multiply(l.BigInt(_), ne);
      O = l.add(O, C), J = xt(O, l.BigInt(1e3));
      const S = ft(O, l.BigInt(1e3 * h), f);
      _ = l.toNumber(l.divide(S, l.BigInt(1e3))), C = ve;
      break;
    }
    case "nanosecond":
      J = l.toNumber(C), C = ft(l.BigInt(C), l.BigInt(h), f);
  }
  return { years: g, months: p, weeks: w, days: v, hours: T, minutes: E, seconds: D, milliseconds: k, microseconds: _, nanoseconds: l.toNumber(C), total: J };
}
function tn(n, e, t, r, o, i) {
  for (const [a, c] of [[n, r], [e, o], [t, i]]) if (a !== c) return Tn(a - c);
  return 0;
}
function fn(n, e) {
  let { quotient: t, remainder: r } = Ee(n, e);
  return l.lessThan(r, ve) && (t = l.subtract(t, Kn), r = l.add(r, e)), { quotient: t, remainder: r };
}
function An(n, e) {
  const { quotient: t, remainder: r } = Ee(n, e);
  return Tt(r) || !zr(n) == !zr(e) ? t : l.subtract(t, Kn);
}
function xt(n, e) {
  const { quotient: t, remainder: r } = Ee(n, e);
  return l.toNumber(t) + l.toNumber(r) / l.toNumber(e);
}
function Qr(n) {
  const e = ar(n);
  return globalThis.BigInt !== void 0 ? globalThis.BigInt(e.toString(10)) : e;
}
function ar(n) {
  let e = n;
  if (typeof n == "object") {
    const t = n[Symbol.toPrimitive];
    t && typeof t == "function" && (e = to(t, n, ["number"]));
  }
  if (typeof e == "number") throw new TypeError("cannot convert number to bigint");
  return typeof e == "bigint" ? l.BigInt(e.toString(10)) : l.BigInt(e);
}
const ui = (() => {
  let n = l.BigInt(Date.now() % 1e6);
  return () => {
    const e = l.BigInt(Date.now()), t = l.add(l.multiply(e, bt), n);
    return n = l.remainder(e, bt), l.greaterThan(t, Un) ? Un : l.lessThan(t, cr) ? cr : t;
  };
})();
function en() {
  return new ka().resolvedOptions().timeZone;
}
function Tn(n) {
  return n < 0 ? -1 : n > 0 ? 1 : n;
}
function X(n) {
  if (n === void 0) return We(null);
  if (ce(n) && n !== null) return n;
  throw new TypeError("Options parameter must be an object, not " + (n === null ? "null" : typeof n));
}
function Vn(n, e) {
  const t = We(null);
  return t[n] = e, t;
}
function un(n) {
  const e = We(null);
  return Pn(e, X(n), []), e;
}
function ln(n, e, t, r) {
  let o = n[e];
  if (o !== void 0) {
    if (o = ot(o), !t.includes(o)) throw new RangeError(`${e} must be one of ${t.join(", ")}, not ${o}`);
    return o;
  }
  return r;
}
function Qt(n) {
  return Qs.includes(jt(n));
}
function jt(n) {
  return n.replace(/[A-Z]/g, (e) => {
    const t = e.charCodeAt(0);
    return String.fromCharCode(t + 32);
  });
}
const is = new RegExp(`^${Ca.source}$`);
function as(n, e, t, r = n(e), o = n(t)) {
  let i = l.BigInt(e), a = l.BigInt(t), c = r, d = o;
  for (; l.greaterThan(l.subtract(a, i), Kn); ) {
    const u = l.divide(l.add(i, a), l.BigInt(2)), h = n(u);
    if (h === c) i = u, c = h;
    else {
      if (h !== d) throw new Error(`invalid state in bisection ${c} - ${h} - ${d}`);
      a = u, d = h;
    }
  }
  return a;
}
const ss = { hour: 36e11, minute: 6e10, second: 1e9, millisecond: 1e6, microsecond: 1e3, nanosecond: 1 }, ls = Symbol("date"), cs = Symbol("ym"), ds = Symbol("md"), us = Symbol("time"), hs = Symbol("datetime"), ms = Symbol("instant"), Fn = Symbol("original"), Rn = Symbol("timezone"), Ct = Symbol("calendar-id"), fs = Symbol("locale"), So = Symbol("options"), sr = (n) => ({ value: n, enumerable: !0, writable: !1, configurable: !0 }), Sn = globalThis.Intl.DateTimeFormat, Jt = Object.assign, rl = Object.prototype.hasOwnProperty, ol = Reflect.apply;
function $n(n, e) {
  let t = n[e];
  return typeof t == "function" && (t = new Sn(n[fs], t(n[So])), n[e] = t), t;
}
function kn(n, e = {}) {
  if (!(this instanceof kn)) return new kn(n, e);
  const t = e !== void 0, r = t ? Jt({}, e) : {}, o = new Sn(n, r), i = o.resolvedOptions();
  if (t) {
    const a = Jt({}, i);
    for (const c in a) ol(rl, r, [c]) || delete a[c];
    this[So] = a;
  } else this[So] = r;
  this[fs] = i.locale, this[Fn] = o, this[Rn] = i.timeZone, this[Ct] = i.calendar, this[ls] = ll, this[cs] = al, this[ds] = sl, this[us] = il, this[hs] = cl, this[ms] = dl;
}
Object.defineProperty(kn, "name", { writable: !0, value: "DateTimeFormat" }), kn.supportedLocalesOf = function(n, e) {
  return Sn.supportedLocalesOf(n, e);
};
const Eo = { resolvedOptions: sr(function() {
  return this[Fn].resolvedOptions();
}), format: sr(function(e, ...t) {
  let { instant: r, formatter: o } = Ln(e, this);
  return r && o ? o.format(r.epochMilliseconds) : this[Fn].format(e, ...t);
}), formatRange: sr(function(e, t) {
  if (Gn(e) || Gn(t)) {
    if (!ys(e, t)) throw new TypeError("Intl.DateTimeFormat.formatRange accepts two values of the same type");
    const { instant: r, formatter: o } = Ln(e, this), { instant: i, formatter: a } = Ln(t, this);
    if (r && i && o && a && o === a) return o.formatRange(r.epochMilliseconds, i.epochMilliseconds);
  }
  return this[Fn].formatRange(e, t);
}) };
"formatToParts" in Sn.prototype && (Eo.formatToParts = sr(function(e, ...t) {
  let { instant: r, formatter: o } = Ln(e, this);
  return r && o ? o.formatToParts(r.epochMilliseconds) : this[Fn].formatToParts(e, ...t);
})), "formatRangeToParts" in Sn.prototype && (Eo.formatRangeToParts = sr(function(e, t) {
  if (Gn(e) || Gn(t)) {
    if (!ys(e, t)) throw new TypeError("Intl.DateTimeFormat.formatRangeToParts accepts two values of the same type");
    const { instant: r, formatter: o } = Ln(e, this), { instant: i, formatter: a } = Ln(t, this);
    if (r && i && o && a && o === a) return o.formatRangeToParts(r.epochMilliseconds, i.epochMilliseconds);
  }
  return this[Fn].formatRangeToParts(e, t);
})), kn.prototype = Object.create(Sn.prototype, Eo), Object.defineProperty(kn, "prototype", { writable: !1, enumerable: !1, configurable: !1 });
const hn = kn;
function Cr(n = {}, e = {}) {
  const t = Jt({}, n);
  for (const r of ["year", "month", "day", "hour", "minute", "second", "weekday", "dayPeriod", "timeZoneName", "dateStyle", "timeStyle"]) t[r] = r in e ? e[r] : t[r], t[r] !== !1 && t[r] !== void 0 || delete t[r];
  return t;
}
function il(n) {
  let e = Cr(n, { year: !1, month: !1, day: !1, weekday: !1, timeZoneName: !1, dateStyle: !1 });
  return mi(e) || (e = Jt({}, e, { hour: "numeric", minute: "numeric", second: "numeric" })), e;
}
function al(n) {
  let e = Cr(n, { day: !1, hour: !1, minute: !1, second: !1, weekday: !1, dayPeriod: !1, timeZoneName: !1, dateStyle: !1, timeStyle: !1 });
  return "year" in e || "month" in e || (e = Jt(e, { year: "numeric", month: "numeric" })), e;
}
function sl(n) {
  let e = Cr(n, { year: !1, hour: !1, minute: !1, second: !1, weekday: !1, dayPeriod: !1, timeZoneName: !1, dateStyle: !1, timeStyle: !1 });
  return "month" in e || "day" in e || (e = Jt({}, e, { month: "numeric", day: "numeric" })), e;
}
function ll(n) {
  let e = Cr(n, { hour: !1, minute: !1, second: !1, dayPeriod: !1, timeZoneName: !1, timeStyle: !1 });
  return hi(e) || (e = Jt({}, e, { year: "numeric", month: "numeric", day: "numeric" })), e;
}
function cl(n) {
  let e = Cr(n, { timeZoneName: !1 });
  return mi(e) || hi(e) || (e = Jt({}, e, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })), e;
}
function dl(n) {
  let e = n;
  return mi(e) || hi(e) || (e = Jt({}, e, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })), e;
}
function hi(n) {
  return "year" in n || "month" in n || "day" in n || "weekday" in n || "dateStyle" in n;
}
function mi(n) {
  return "hour" in n || "minute" in n || "second" in n || "timeStyle" in n || "dayPeriod" in n;
}
function Gn(n) {
  return K(n) || we(n) || L(n) || x(n) || te(n) || xe(n) || Re(n);
}
function ys(n, e) {
  return !(!Gn(n) || !Gn(e)) && !(we(n) && !we(e)) && !(K(n) && !K(e)) && !(L(n) && !L(e)) && !(x(n) && !x(e)) && !(te(n) && !te(e)) && !(xe(n) && !xe(e)) && !(Re(n) && !Re(e));
}
function Ln(n, e) {
  const t = I("%Temporal.PlainDateTime%");
  if (we(n)) {
    const r = new t(1970, 1, 1, s(n, j), s(n, U), s(n, z), s(n, q), s(n, B), s(n, Z), e[Ct]);
    return { instant: rt(e[Rn], r, "compatible"), formatter: $n(e, us) };
  }
  if (te(n)) {
    const r = s(n, M), o = s(n, R), i = s(n, Y), a = Ue(s(n, b));
    if (a !== e[Ct]) throw new RangeError(`cannot format PlainYearMonth with calendar ${a} in locale with calendar ${e[Ct]}`);
    const c = new t(r, o, i, 12, 0, 0, 0, 0, 0, a);
    return { instant: rt(e[Rn], c, "compatible"), formatter: $n(e, cs) };
  }
  if (xe(n)) {
    const r = s(n, M), o = s(n, R), i = s(n, Y), a = Ue(s(n, b));
    if (a !== e[Ct]) throw new RangeError(`cannot format PlainMonthDay with calendar ${a} in locale with calendar ${e[Ct]}`);
    const c = new t(r, o, i, 12, 0, 0, 0, 0, 0, a);
    return { instant: rt(e[Rn], c, "compatible"), formatter: $n(e, ds) };
  }
  if (K(n)) {
    const r = s(n, M), o = s(n, R), i = s(n, Y), a = Ue(s(n, b));
    if (a !== "iso8601" && a !== e[Ct]) throw new RangeError(`cannot format PlainDate with calendar ${a} in locale with calendar ${e[Ct]}`);
    const c = new t(r, o, i, 12, 0, 0, 0, 0, 0, e[Ct]);
    return { instant: rt(e[Rn], c, "compatible"), formatter: $n(e, ls) };
  }
  if (L(n)) {
    const r = s(n, M), o = s(n, R), i = s(n, Y), a = s(n, j), c = s(n, U), d = s(n, z), u = s(n, q), h = s(n, B), m = s(n, Z), f = Ue(s(n, b));
    if (f !== "iso8601" && f !== e[Ct]) throw new RangeError(`cannot format PlainDateTime with calendar ${f} in locale with calendar ${e[Ct]}`);
    let y = n;
    return f === "iso8601" && (y = new t(r, o, i, a, c, d, u, h, m, e[Ct])), { instant: rt(e[Rn], y, "compatible"), formatter: $n(e, hs) };
  }
  if (x(n)) throw new TypeError("Temporal.ZonedDateTime not supported in DateTimeFormat methods. Use toLocaleString() instead.");
  return Re(n) ? { instant: n, formatter: $n(e, ms) } : {};
}
class It {
  constructor(e) {
    if (arguments.length < 1) throw new TypeError("missing argument: epochNanoseconds is required");
    const t = ar(e);
    yn(t), zt(this), W(this, F, t);
  }
  get epochSeconds() {
    if (!Re(this)) throw new TypeError("invalid receiver");
    const e = s(this, F);
    return l.toNumber(An(e, At));
  }
  get epochMilliseconds() {
    if (!Re(this)) throw new TypeError("invalid receiver");
    const e = l.BigInt(s(this, F));
    return l.toNumber(An(e, bt));
  }
  get epochMicroseconds() {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return Qr(An(l.BigInt(s(this, F)), ne));
  }
  get epochNanoseconds() {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return Qr(l.BigInt(s(this, F)));
  }
  add(e) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return Qi("add", this, e);
  }
  subtract(e) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return Qi("subtract", this, e);
  }
  until(e, t) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return Zi("until", this, e, t);
  }
  since(e, t) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return Zi("since", this, e, t);
  }
  round(e) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    if (e === void 0) throw new TypeError("options parameter is required");
    const t = typeof e == "string" ? Vn("smallestUnit", e) : X(e), r = Qn(t), o = Ot(t, "halfExpand"), i = ct(t, "smallestUnit", "time", Dn);
    Jn(r, { hour: 24, minute: 1440, second: 86400, millisecond: 864e5, microsecond: 864e8, nanosecond: 864e11 }[i], !0);
    const a = Xr(s(this, F), r, i, o);
    return new It(a);
  }
  equals(e) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    const t = Mt(e), r = s(this, F), o = s(t, F);
    return l.equal(l.BigInt(r), l.BigInt(o));
  }
  toString(e) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    const t = X(e), r = pr(t), o = Ot(t, "trunc"), i = ct(t, "smallestUnit", "time", void 0);
    if (i === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    let a = t.timeZone;
    a !== void 0 && (a = Ze(a));
    const { precision: c, unit: d, increment: u } = wr(i, r), h = Xr(s(this, F), u, d, o);
    return Ai(new It(h), a, c);
  }
  toJSON() {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return Ai(this, void 0, "auto");
  }
  toLocaleString(e, t) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return new hn(e, t).format(this);
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.Instant");
  }
  toZonedDateTime(e) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid argument in toZonedDateTime");
    const t = e.calendar;
    if (t === void 0) throw new TypeError("missing calendar property in toZonedDateTime");
    const r = dt(t), o = e.timeZone;
    if (o === void 0) throw new TypeError("missing timeZone property in toZonedDateTime");
    const i = Ze(o);
    return Se(s(this, F), i, r);
  }
  toZonedDateTimeISO(e) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    const t = Ze(e);
    return Se(s(this, F), t, "iso8601");
  }
  static fromEpochSeconds(e) {
    const t = zn(e), r = l.multiply(l.BigInt(t), At);
    return yn(r), new It(r);
  }
  static fromEpochMilliseconds(e) {
    const t = zn(e), r = l.multiply(l.BigInt(t), bt);
    return yn(r), new It(r);
  }
  static fromEpochMicroseconds(e) {
    const t = ar(e), r = l.multiply(t, ne);
    return yn(r), new It(r);
  }
  static fromEpochNanoseconds(e) {
    const t = ar(e);
    return yn(t), new It(t);
  }
  static from(e) {
    return Re(e) ? new It(s(e, F)) : Mt(e);
  }
  static compare(e, t) {
    const r = Mt(e), o = Mt(t), i = s(r, F), a = s(o, F);
    return l.lessThan(i, a) ? -1 : l.greaterThan(i, a) ? 1 : 0;
  }
}
Ut(It, "Temporal.Instant");
const gs = Array.prototype.includes, ul = Array.prototype.push, hl = globalThis.Intl.DateTimeFormat, ml = Array.prototype.sort, fl = Math.abs, yl = Math.floor, Do = Object.create, Lo = Object.entries, ps = Set, ra = Reflect.ownKeys, ze = Set.prototype.add, ws = Set.prototype.values, de = {};
class ge {
  constructor(e) {
    if (arguments.length < 1) throw new RangeError("missing argument: id is required");
    const t = ot(e);
    if (!Qt(t)) throw new RangeError(`invalid calendar identifier ${t}`);
    zt(this), W(this, he, jt(t));
  }
  get id() {
    if (!ye(this)) throw new TypeError("invalid receiver");
    return s(this, he);
  }
  dateFromFields(e, t) {
    if (!ye(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid fields");
    const r = X(t), o = s(this, he);
    return de[o].dateFromFields(e, r, o);
  }
  yearMonthFromFields(e, t) {
    if (!ye(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid fields");
    const r = X(t), o = s(this, he);
    return de[o].yearMonthFromFields(e, r, o);
  }
  monthDayFromFields(e, t) {
    if (!ye(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid fields");
    const r = X(t), o = s(this, he);
    return de[o].monthDayFromFields(e, r, o);
  }
  fields(e) {
    if (!ye(this)) throw new TypeError("invalid receiver");
    const t = [], r = /* @__PURE__ */ new Set(["year", "month", "monthCode", "day", "hour", "minute", "second", "millisecond", "microsecond", "nanosecond"]);
    for (const o of e) {
      if (typeof o != "string") throw new TypeError("invalid fields");
      if (!r.has(o)) throw new RangeError(`invalid field name ${o}`);
      r.delete(o), ul.call(t, o);
    }
    return de[s(this, he)].fields(t);
  }
  mergeFields(e, t) {
    if (!ye(this)) throw new TypeError("invalid receiver");
    const r = Pi(e), o = Do(null);
    Pn(o, r, [], [void 0]);
    const i = Pi(t), a = Do(null);
    Pn(a, i, [], [void 0]);
    const c = ra(a), d = de[s(this, he)].fieldKeysToIgnore(c), u = Do(null), h = ra(o);
    for (const m of h) {
      let f;
      f = N(gs, d, [m]) ? a[m] : o[m], f !== void 0 && (u[m] = f);
    }
    return Pn(u, a, []), u;
  }
  dateAdd(e, t, r) {
    if (!ye(this)) throw new TypeError("invalid receiver");
    const o = ae(e), i = Nn(t), a = _e(X(r)), { days: c } = _t(s(i, Ge), s(i, He), s(i, Ke), s(i, Xe), s(i, Qe), s(i, Je), s(i, et), "day"), d = s(this, he);
    return de[d].dateAdd(o, s(i, Ve), s(i, Ae), s(i, it), c, a, d);
  }
  dateUntil(e, t, r) {
    if (!ye(this)) throw new TypeError("invalid receiver");
    const o = ae(e), i = ae(t);
    let a = ct(X(r), "largestUnit", "date", "auto");
    a === "auto" && (a = "day");
    const { years: c, months: d, weeks: u, days: h } = de[s(this, he)].dateUntil(o, i, a);
    return new (I("%Temporal.Duration%"))(c, d, u, h, 0, 0, 0, 0, 0, 0);
  }
  year(e) {
    let t = e;
    if (!ye(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].year(t);
  }
  month(e) {
    let t = e;
    if (!ye(this)) throw new TypeError("invalid receiver");
    if (xe(t)) throw new TypeError("use monthCode on PlainMonthDay instead");
    return te(t) || (t = ae(t)), de[s(this, he)].month(t);
  }
  monthCode(e) {
    let t = e;
    if (!ye(this)) throw new TypeError("invalid receiver");
    return te(t) || xe(t) || (t = ae(t)), de[s(this, he)].monthCode(t);
  }
  day(e) {
    let t = e;
    if (!ye(this)) throw new TypeError("invalid receiver");
    return xe(t) || (t = ae(t)), de[s(this, he)].day(t);
  }
  era(e) {
    let t = e;
    if (!ye(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].era(t);
  }
  eraYear(e) {
    let t = e;
    if (!ye(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].eraYear(t);
  }
  dayOfWeek(e) {
    if (!ye(this)) throw new TypeError("invalid receiver");
    const t = ae(e);
    return de[s(this, he)].dayOfWeek(t);
  }
  dayOfYear(e) {
    if (!ye(this)) throw new TypeError("invalid receiver");
    const t = ae(e);
    return de[s(this, he)].dayOfYear(t);
  }
  weekOfYear(e) {
    if (!ye(this)) throw new TypeError("invalid receiver");
    const t = ae(e);
    return de[s(this, he)].weekOfYear(t);
  }
  yearOfWeek(e) {
    if (!ye(this)) throw new TypeError("invalid receiver");
    const t = ae(e);
    return de[s(this, he)].yearOfWeek(t);
  }
  daysInWeek(e) {
    if (!ye(this)) throw new TypeError("invalid receiver");
    const t = ae(e);
    return de[s(this, he)].daysInWeek(t);
  }
  daysInMonth(e) {
    let t = e;
    if (!ye(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].daysInMonth(t);
  }
  daysInYear(e) {
    let t = e;
    if (!ye(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].daysInYear(t);
  }
  monthsInYear(e) {
    let t = e;
    if (!ye(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].monthsInYear(t);
  }
  inLeapYear(e) {
    let t = e;
    if (!ye(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].inLeapYear(t);
  }
  toString() {
    if (!ye(this)) throw new TypeError("invalid receiver");
    return s(this, he);
  }
  toJSON() {
    if (!ye(this)) throw new TypeError("invalid receiver");
    return s(this, he);
  }
  static from(e) {
    return er(dt(e));
  }
}
function fi(n) {
  if (!n.startsWith("M")) throw new RangeError(`Invalid month code: ${n}.  Month codes must start with M.`);
  const e = +n.slice(1);
  if (isNaN(e)) throw new RangeError(`Invalid month code: ${n}`);
  return e;
}
function Gt(n, e = !1) {
  return `M${n.toString().padStart(2, "0")}${e ? "L" : ""}`;
}
function Ar(n, e, t = 12) {
  let { month: r, monthCode: o } = n;
  if (o === void 0) {
    if (r === void 0) throw new TypeError("Either month or monthCode are required");
    e === "reject" && je(r, 1, t), e === "constrain" && (r = st(r, 1, t)), o = Gt(r);
  } else {
    const i = fi(o);
    if (r !== void 0 && r !== i) throw new RangeError(`monthCode ${o} and month ${r} must match if both are present`);
    if (o !== Gt(i)) throw new RangeError(`Invalid month code: ${o}`);
    if (r = i, r < 1 || r > t) throw new RangeError(`Invalid monthCode: ${o}`);
  }
  return { ...n, month: r, monthCode: o };
}
Ut(ge, "Temporal.Calendar"), me("Temporal.Calendar.from", ge.from), me("Temporal.Calendar.prototype.dateAdd", ge.prototype.dateAdd), me("Temporal.Calendar.prototype.dateFromFields", ge.prototype.dateFromFields), me("Temporal.Calendar.prototype.dateUntil", ge.prototype.dateUntil), me("Temporal.Calendar.prototype.day", ge.prototype.day), me("Temporal.Calendar.prototype.dayOfWeek", ge.prototype.dayOfWeek), me("Temporal.Calendar.prototype.dayOfYear", ge.prototype.dayOfYear), me("Temporal.Calendar.prototype.daysInMonth", ge.prototype.daysInMonth), me("Temporal.Calendar.prototype.daysInWeek", ge.prototype.daysInWeek), me("Temporal.Calendar.prototype.daysInYear", ge.prototype.daysInYear), me("Temporal.Calendar.prototype.era", ge.prototype.era), me("Temporal.Calendar.prototype.eraYear", ge.prototype.eraYear), me("Temporal.Calendar.prototype.fields", ge.prototype.fields), me("Temporal.Calendar.prototype.inLeapYear", ge.prototype.inLeapYear), me("Temporal.Calendar.prototype.mergeFields", ge.prototype.mergeFields), me("Temporal.Calendar.prototype.month", ge.prototype.month), me("Temporal.Calendar.prototype.monthCode", ge.prototype.monthCode), me("Temporal.Calendar.prototype.monthDayFromFields", ge.prototype.monthDayFromFields), me("Temporal.Calendar.prototype.monthsInYear", ge.prototype.monthsInYear), me("Temporal.Calendar.prototype.weekOfYear", ge.prototype.weekOfYear), me("Temporal.Calendar.prototype.year", ge.prototype.year), me("Temporal.Calendar.prototype.yearMonthFromFields", ge.prototype.yearMonthFromFields), me("Temporal.Calendar.prototype.yearOfWeek", ge.prototype.yearOfWeek), de.iso8601 = { dateFromFields(n, e, t) {
  let r = G(n, ["day", "month", "monthCode", "year"], ["year", "day"]);
  const o = _e(e);
  r = Ar(r);
  let { year: i, month: a, day: c } = r;
  return { year: i, month: a, day: c } = Br(i, a, c, o), Dt(i, a, c, t);
}, yearMonthFromFields(n, e, t) {
  let r = G(n, ["month", "monthCode", "year"], ["year"]);
  const o = _e(e);
  r = Ar(r);
  let { year: i, month: a } = r;
  return { year: i, month: a } = function(d, u, h) {
    let m = d, f = u;
    switch (h) {
      case "reject":
        Lt(m, f, 1);
        break;
      case "constrain":
        ({ year: m, month: f } = Ka(m, f));
    }
    return { year: m, month: f };
  }(i, a, o), ur(i, a, t, 1);
}, monthDayFromFields(n, e, t) {
  let r = G(n, ["day", "month", "monthCode", "year"], ["day"]);
  const o = _e(e);
  if (r.month !== void 0 && r.year === void 0 && r.monthCode === void 0) throw new TypeError("either year or monthCode required with month");
  const i = r.monthCode === void 0;
  r = Ar(r);
  let { month: a, day: c, year: d } = r;
  return { month: a, day: c } = Br(i ? d : 1972, a, c, o), dr(a, c, t, 1972);
}, fields: (n) => n, fieldKeysToIgnore(n) {
  const e = new ps();
  for (let t = 0; t < n.length; t++) {
    const r = n[t];
    N(ze, e, [r]), r === "month" ? N(ze, e, ["monthCode"]) : r === "monthCode" && N(ze, e, ["month"]);
  }
  return [...N(ws, e, [])];
}, dateAdd(n, e, t, r, o, i, a) {
  let c = s(n, M), d = s(n, R), u = s(n, Y);
  return { year: c, month: d, day: u } = vn(c, d, u, e, t, r, o, i), Dt(c, d, u, a);
}, dateUntil: (n, e, t) => ai(s(n, M), s(n, R), s(n, Y), s(e, M), s(e, R), s(e, Y), t), year: (n) => s(n, M), era() {
}, eraYear() {
}, month: (n) => s(n, R), monthCode: (n) => Gt(s(n, R)), day: (n) => s(n, Y), dayOfWeek: (n) => No(s(n, M), s(n, R), s(n, Y)), dayOfYear: (n) => Hr(s(n, M), s(n, R), s(n, Y)), weekOfYear: (n) => qi(s(n, M), s(n, R), s(n, Y)).week, yearOfWeek: (n) => qi(s(n, M), s(n, R), s(n, Y)).year, daysInWeek: () => 7, daysInMonth: (n) => Vt(s(n, M), s(n, R)), daysInYear(n) {
  let e = n;
  return Ne(e, M) || (e = ae(e)), sn(s(e, M)) ? 366 : 365;
}, monthsInYear: () => 12, inLeapYear(n) {
  let e = n;
  return Ne(e, M) || (e = ae(e)), sn(s(e, M));
} };
class fe {
  constructor(e) {
    if (this.map = /* @__PURE__ */ new Map(), this.calls = 0, this.hits = 0, this.misses = 0, this.now = globalThis.performance ? globalThis.performance.now() : Date.now(), e !== void 0) {
      let t = 0;
      for (const r of e.map.entries()) {
        if (++t > fe.MAX_CACHE_ENTRIES) break;
        this.map.set(...r);
      }
    }
  }
  get(e) {
    const t = this.map.get(e);
    return t && (this.hits++, this.report()), this.calls++, t;
  }
  set(e, t) {
    this.map.set(e, t), this.misses++, this.report();
  }
  report() {
  }
  setObject(e) {
    if (fe.objectMap.get(e)) throw new RangeError("object already cached");
    fe.objectMap.set(e, this), this.report();
  }
  static getCacheForObject(e) {
    let t = fe.objectMap.get(e);
    return t || (t = new fe(), fe.objectMap.set(e, t)), t;
  }
}
function vs({ isoYear: n, isoMonth: e, isoDay: t }) {
  return `${On(n)}-${ue(e)}-${ue(t)}T00:00Z`;
}
function Co(n, e) {
  return { years: n.year - e.year, months: n.month - e.month, days: n.day - e.day };
}
fe.objectMap = /* @__PURE__ */ new WeakMap(), fe.MAX_CACHE_ENTRIES = 1e3;
class nr {
  constructor() {
    this.eraLength = "short", this.hasEra = !0, this.erasBeginMidYear = !1;
  }
  getFormatter() {
    return this.formatter === void 0 && (this.formatter = new hl(`en-US-u-ca-${this.id}`, { day: "numeric", month: "numeric", year: "numeric", era: this.eraLength, timeZone: "UTC" })), this.formatter;
  }
  isoToCalendarDate(e, t) {
    const { year: r, month: o, day: i } = e, a = JSON.stringify({ func: "isoToCalendarDate", isoYear: r, isoMonth: o, isoDay: i, id: this.id }), c = t.get(a);
    if (c) return c;
    const d = this.getFormatter();
    let u, h;
    try {
      h = vs({ isoYear: r, isoMonth: o, isoDay: i }), u = d.formatToParts(new Date(h));
    } catch {
      throw new RangeError(`Invalid ISO date: ${JSON.stringify({ isoYear: r, isoMonth: o, isoDay: i })}`);
    }
    const m = {};
    for (let { type: y, value: g } of u) {
      if (y === "year" && (m.eraYear = +g), y === "relatedYear" && (m.eraYear = +g), y === "month") {
        const p = /^([0-9]*)(.*?)$/.exec(g);
        if (!p || p.length != 3 || !p[1] && !p[2]) throw new RangeError(`Unexpected month: ${g}`);
        if (m.month = p[1] ? +p[1] : 1, m.month < 1) throw new RangeError(`Invalid month ${g} from ${h}[u-ca-${this.id}] (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10527)`);
        if (m.month > 13) throw new RangeError(`Invalid month ${g} from ${h}[u-ca-${this.id}] (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10529)`);
        p[2] && (m.monthExtra = p[2]);
      }
      y === "day" && (m.day = +g), this.hasEra && y === "era" && g != null && g !== "" && (g = g.split(" (")[0], m.era = g.normalize("NFD").replace(/[^-0-9 \p{L}]/gu, "").replace(" ", "-").toLowerCase());
    }
    if (m.eraYear === void 0) throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
    if (this.reviseIntlEra) {
      const { era: y, eraYear: g } = this.reviseIntlEra(m, e);
      m.era = y, m.eraYear = g;
    }
    this.checkIcuBugs && this.checkIcuBugs(e);
    const f = this.adjustCalendarDate(m, t, "constrain", !0);
    if (f.year === void 0) throw new RangeError(`Missing year converting ${JSON.stringify(e)}`);
    if (f.month === void 0) throw new RangeError(`Missing month converting ${JSON.stringify(e)}`);
    if (f.day === void 0) throw new RangeError(`Missing day converting ${JSON.stringify(e)}`);
    return t.set(a, f), ["constrain", "reject"].forEach((y) => {
      const g = JSON.stringify({ func: "calendarToIsoDate", year: f.year, month: f.month, day: f.day, overflow: y, id: this.id });
      t.set(g, e);
    }), f;
  }
  validateCalendarDate(e) {
    const { era: t, month: r, year: o, day: i, eraYear: a, monthCode: c, monthExtra: d } = e;
    if (d !== void 0) throw new RangeError("Unexpected `monthExtra` value");
    if (o === void 0 && a === void 0) throw new TypeError("year or eraYear is required");
    if (r === void 0 && c === void 0) throw new TypeError("month or monthCode is required");
    if (i === void 0) throw new RangeError("Missing day");
    if (c !== void 0) {
      if (typeof c != "string") throw new RangeError("monthCode must be a string, not " + typeof c);
      if (!/^M([01]?\d)(L?)$/.test(c)) throw new RangeError(`Invalid monthCode: ${c}`);
    }
    if (this.constantEra) {
      if (t !== void 0 && t !== this.constantEra) throw new RangeError(`era must be ${this.constantEra}, not ${t}`);
      if (a !== void 0 && o !== void 0 && a !== o) throw new RangeError(`eraYear ${a} does not match year ${o}`);
    }
    if (this.hasEra && e.era === void 0 != (e.eraYear === void 0)) throw new RangeError("properties 'era' and 'eraYear' must be provided together");
  }
  adjustCalendarDate(e, t, r = "constrain", o = !1) {
    if (this.calendarType === "lunisolar") throw new RangeError("Override required for lunisolar calendars");
    let i = e;
    if (this.validateCalendarDate(i), this.constantEra) {
      const { year: u, eraYear: h } = i;
      i = { ...i, era: this.constantEra, year: u !== void 0 ? u : h, eraYear: h !== void 0 ? h : u };
    }
    const a = this.monthsInYear(i, t);
    let { month: c, monthCode: d } = i;
    return { month: c, monthCode: d } = Ar(i, r, a), { ...i, month: c, monthCode: d };
  }
  regulateMonthDayNaive(e, t, r) {
    const o = this.monthsInYear(e, r);
    let { month: i, day: a } = e;
    return t === "reject" ? (je(i, 1, o), je(a, 1, this.maximumMonthLength(e))) : (i = st(i, 1, o), a = st(a, 1, this.maximumMonthLength({ ...e, month: i }))), { ...e, month: i, day: a };
  }
  calendarToIsoDate(e, t = "constrain", r) {
    const o = e;
    let i = this.adjustCalendarDate(e, r, t, !1);
    i = this.regulateMonthDayNaive(i, t, r);
    const { year: a, month: c, day: d } = i, u = JSON.stringify({ func: "calendarToIsoDate", year: a, month: c, day: d, overflow: t, id: this.id });
    let h, m = r.get(u);
    if (m || o.year !== void 0 && o.month !== void 0 && o.day !== void 0 && (o.year !== i.year || o.month !== i.month || o.day !== i.day) && (h = JSON.stringify({ func: "calendarToIsoDate", year: o.year, month: o.month, day: o.day, overflow: t, id: this.id }), m = r.get(h), m)) return m;
    let f = this.estimateIsoDate({ year: a, month: c, day: d });
    const y = (T) => {
      let E = this.addDaysIso(f, T);
      if (i.day > this.minimumMonthLength(i)) {
        let D = this.isoToCalendarDate(E, r);
        for (; D.month !== c || D.year !== a; ) {
          if (t === "reject") throw new RangeError(`day ${d} does not exist in month ${c} of year ${a}`);
          E = this.addDaysIso(E, -1), D = this.isoToCalendarDate(E, r);
        }
      }
      return E;
    };
    let g = 0, p = this.isoToCalendarDate(f, r), w = Co(i, p);
    if (w.years !== 0 || w.months !== 0 || w.days !== 0) {
      const T = 365 * w.years + 30 * w.months + w.days;
      f = this.addDaysIso(f, T), p = this.isoToCalendarDate(f, r), w = Co(i, p), w.years === 0 && w.months === 0 ? f = y(w.days) : g = this.compareCalendarDates(i, p);
    }
    let v = 8;
    for (; g; ) {
      f = this.addDaysIso(f, g * v);
      const T = p;
      p = this.isoToCalendarDate(f, r);
      const E = g;
      if (g = this.compareCalendarDates(i, p), g) {
        if (w = Co(i, p), w.years === 0 && w.months === 0) f = y(w.days), g = 0;
        else if (E && g !== E) if (v > 1) v /= 2;
        else {
          if (t === "reject") throw new RangeError(`Can't find ISO date from calendar date: ${JSON.stringify({ ...o })}`);
          this.compareCalendarDates(p, T) > 0 && (f = this.addDaysIso(f, -1)), g = 0;
        }
      }
    }
    if (r.set(u, f), h && r.set(h, f), i.year === void 0 || i.month === void 0 || i.day === void 0 || i.monthCode === void 0 || this.hasEra && (i.era === void 0 || i.eraYear === void 0)) throw new RangeError("Unexpected missing property");
    return f;
  }
  temporalToCalendarDate(e, t) {
    const r = { year: s(e, M), month: s(e, R), day: s(e, Y) };
    return this.isoToCalendarDate(r, t);
  }
  compareCalendarDates(e, t) {
    const r = G(e, ["day", "month", "year"], ["day", "month", "year"]), o = G(t, ["day", "month", "year"], ["day", "month", "year"]);
    return r.year !== o.year ? Tn(r.year - o.year) : r.month !== o.month ? Tn(r.month - o.month) : r.day !== o.day ? Tn(r.day - o.day) : 0;
  }
  regulateDate(e, t = "constrain", r) {
    const o = this.calendarToIsoDate(e, t, r);
    return this.isoToCalendarDate(o, r);
  }
  addDaysIso(e, t) {
    return vn(e.year, e.month, e.day, 0, 0, 0, t, "constrain");
  }
  addDaysCalendar(e, t, r) {
    const o = this.calendarToIsoDate(e, "constrain", r), i = this.addDaysIso(o, t);
    return this.isoToCalendarDate(i, r);
  }
  addMonthsCalendar(e, t, r, o) {
    let i = e;
    const { day: a } = i;
    for (let c = 0, d = fl(t); c < d; c++) {
      const { month: u } = i, h = i, m = t < 0 ? -Math.max(a, this.daysInPreviousMonth(i, o)) : this.daysInMonth(i, o), f = this.calendarToIsoDate(i, "constrain", o);
      let y = this.addDaysIso(f, m);
      if (i = this.isoToCalendarDate(y, o), t > 0) {
        const g = this.monthsInYear(h, o);
        for (; i.month - 1 != u % g; ) y = this.addDaysIso(y, -1), i = this.isoToCalendarDate(y, o);
      }
      i.day !== a && (i = this.regulateDate({ ...i, day: a }, "constrain", o));
    }
    if (r === "reject" && i.day !== a) throw new RangeError(`Day ${a} does not exist in resulting calendar month`);
    return i;
  }
  addCalendar(e, { years: t = 0, months: r = 0, weeks: o = 0, days: i = 0 }, a, c) {
    const { year: d, day: u, monthCode: h } = e, m = this.adjustCalendarDate({ year: d + t, monthCode: h, day: u }, c), f = this.addMonthsCalendar(m, r, a, c), y = i + 7 * o;
    return this.addDaysCalendar(f, y, c);
  }
  untilCalendar(e, t, r, o) {
    let i = 0, a = 0, c = 0, d = 0;
    switch (r) {
      case "day":
        i = this.calendarDaysUntil(e, t, o);
        break;
      case "week": {
        const u = this.calendarDaysUntil(e, t, o);
        i = u % 7, a = (u - i) / 7;
        break;
      }
      case "month":
      case "year": {
        const u = this.compareCalendarDates(t, e);
        if (!u) return { years: 0, months: 0, weeks: 0, days: 0 };
        const h = t.year - e.year, m = t.day - e.day;
        if (r === "year" && h) {
          let g = 0;
          t.monthCode > e.monthCode && (g = 1), t.monthCode < e.monthCode && (g = -1), g || (g = Math.sign(m)), d = g * u < 0 ? h - u : h;
        }
        let f, y = d ? this.addCalendar(e, { years: d }, "constrain", o) : e;
        do
          c += u, f = y, y = this.addMonthsCalendar(f, u, "constrain", o), y.day !== e.day && (y = this.regulateDate({ ...y, day: e.day }, "constrain", o));
        while (this.compareCalendarDates(t, y) * u >= 0);
        c -= u, i = this.calendarDaysUntil(f, t, o);
        break;
      }
    }
    return { years: d, months: c, weeks: a, days: i };
  }
  daysInMonth(e, t) {
    const { day: r } = e, o = this.maximumMonthLength(e), i = this.minimumMonthLength(e);
    if (i === o) return i;
    const a = r <= o - i ? o : i, c = this.calendarToIsoDate(e, "constrain", t), d = this.addDaysIso(c, a), u = this.isoToCalendarDate(d, t), h = this.addDaysIso(d, -u.day);
    return this.isoToCalendarDate(h, t).day;
  }
  daysInPreviousMonth(e, t) {
    const { day: r, month: o, year: i } = e;
    let a = { year: o > 1 ? i : i - 1, month: o, day: 1 };
    const c = o > 1 ? o - 1 : this.monthsInYear(a, t);
    a = { ...a, month: c };
    const d = this.minimumMonthLength(a), u = this.maximumMonthLength(a);
    if (d === u) return u;
    const h = this.calendarToIsoDate(e, "constrain", t), m = this.addDaysIso(h, -r);
    return this.isoToCalendarDate(m, t).day;
  }
  startOfCalendarYear(e) {
    return { year: e.year, month: 1, monthCode: "M01", day: 1 };
  }
  startOfCalendarMonth(e) {
    return { year: e.year, month: e.month, day: 1 };
  }
  calendarDaysUntil(e, t, r) {
    const o = this.calendarToIsoDate(e, "constrain", r), i = this.calendarToIsoDate(t, "constrain", r);
    return this.isoDaysUntil(o, i);
  }
  isoDaysUntil(e, t) {
    return ai(e.year, e.month, e.day, t.year, t.month, t.day, "day").days;
  }
  monthDayFromFields(e, t, r) {
    let o, i, a, c, d, { monthCode: u, day: h } = e;
    if (u === void 0) {
      let { year: y, era: g, eraYear: p } = e;
      if (y === void 0 && (g === void 0 || p === void 0)) throw new TypeError("when `monthCode` is omitted, `year` (or `era` and `eraYear`) and `month` are required");
      ({ monthCode: u, day: h } = this.isoToCalendarDate(this.calendarToIsoDate(e, t, r), r));
    }
    const m = this.isoToCalendarDate({ year: 1972, month: 12, day: 31 }, r), f = m.monthCode > u || m.monthCode === u && m.day >= h ? m.year : m.year - 1;
    for (let y = 0; y < 100; y++) {
      const g = this.adjustCalendarDate({ day: h, monthCode: u, year: f - y }, r), p = this.calendarToIsoDate(g, "constrain", r), w = this.isoToCalendarDate(p, r);
      if ({ year: o, month: i, day: a } = p, w.monthCode === u && w.day === h) return { month: i, day: a, year: o };
      t === "constrain" && (c === void 0 || w.monthCode === c.monthCode && w.day > c.day) && (c = w, d = p);
    }
    if (t === "constrain" && d !== void 0) return d;
    throw new RangeError(`No recent ${this.id} year with monthCode ${u} and day ${h}`);
  }
}
class gl extends nr {
  constructor() {
    super(...arguments), this.id = "hebrew", this.calendarType = "lunisolar", this.months = { Tishri: { leap: 1, regular: 1, monthCode: "M01", days: 30 }, Heshvan: { leap: 2, regular: 2, monthCode: "M02", days: { min: 29, max: 30 } }, Kislev: { leap: 3, regular: 3, monthCode: "M03", days: { min: 29, max: 30 } }, Tevet: { leap: 4, regular: 4, monthCode: "M04", days: 29 }, Shevat: { leap: 5, regular: 5, monthCode: "M05", days: 30 }, Adar: { leap: void 0, regular: 6, monthCode: "M06", days: 29 }, "Adar I": { leap: 6, regular: void 0, monthCode: "M05L", days: 30 }, "Adar II": { leap: 7, regular: void 0, monthCode: "M06", days: 29 }, Nisan: { leap: 8, regular: 7, monthCode: "M07", days: 30 }, Iyar: { leap: 9, regular: 8, monthCode: "M08", days: 29 }, Sivan: { leap: 10, regular: 9, monthCode: "M09", days: 30 }, Tamuz: { leap: 11, regular: 10, monthCode: "M10", days: 29 }, Av: { leap: 12, regular: 11, monthCode: "M11", days: 30 }, Elul: { leap: 13, regular: 12, monthCode: "M12", days: 29 } }, this.hasEra = !1;
  }
  inLeapYear(e) {
    const { year: t } = e;
    return (7 * t + 1) % 19 < 7;
  }
  monthsInYear(e) {
    return this.inLeapYear(e) ? 13 : 12;
  }
  minimumMonthLength(e) {
    return this.minMaxMonthLength(e, "min");
  }
  maximumMonthLength(e) {
    return this.minMaxMonthLength(e, "max");
  }
  minMaxMonthLength(e, t) {
    const { month: r, year: o } = e, i = this.getMonthCode(o, r), a = Lo(this.months).find((d) => d[1].monthCode === i);
    if (a === void 0) throw new RangeError(`unmatched Hebrew month: ${r}`);
    const c = a[1].days;
    return typeof c == "number" ? c : c[t];
  }
  estimateIsoDate(e) {
    const { year: t } = e;
    return { year: t - 3760, month: 1, day: 1 };
  }
  getMonthCode(e, t) {
    return this.inLeapYear({ year: e }) ? t === 6 ? Gt(5, !0) : Gt(t < 6 ? t : t - 1) : Gt(t);
  }
  adjustCalendarDate(e, t, r = "constrain", o = !1) {
    let { year: i, eraYear: a, month: c, monthCode: d, day: u, monthExtra: h } = e;
    if (i === void 0 && a !== void 0 && (i = a), a === void 0 && i !== void 0 && (a = i), o) {
      if (h) {
        const m = this.months[h];
        if (!m) throw new RangeError(`Unrecognized month from formatToParts: ${h}`);
        c = this.inLeapYear({ year: i }) ? m.leap : m.regular;
      }
      return d = this.getMonthCode(i, c), { year: i, month: c, day: u, era: void 0, eraYear: a, monthCode: d };
    }
    if (this.validateCalendarDate(e), c === void 0) if (d.endsWith("L")) {
      if (d !== "M05L") throw new RangeError(`Hebrew leap month must have monthCode M05L, not ${d}`);
      if (c = 6, !this.inLeapYear({ year: i })) {
        if (r === "reject") throw new RangeError(`Hebrew monthCode M05L is invalid in year ${i} which is not a leap year`);
        c = 6, d = "M06";
      }
    } else {
      c = fi(d), this.inLeapYear({ year: i }) && c >= 6 && c++;
      const m = this.monthsInYear({ year: i });
      if (c < 1 || c > m) throw new RangeError(`Invalid monthCode: ${d}`);
    }
    else if (r === "reject" ? (je(c, 1, this.monthsInYear({ year: i })), je(u, 1, this.maximumMonthLength({ year: i, month: c }))) : (c = st(c, 1, this.monthsInYear({ year: i })), u = st(u, 1, this.maximumMonthLength({ year: i, month: c }))), d === void 0) d = this.getMonthCode(i, c);
    else if (this.getMonthCode(i, c) !== d) throw new RangeError(`monthCode ${d} doesn't correspond to month ${c} in Hebrew year ${i}`);
    return { ...e, day: u, month: c, monthCode: d, year: i, eraYear: a };
  }
}
class rr extends nr {
  constructor() {
    super(...arguments), this.calendarType = "lunar", this.DAYS_PER_ISLAMIC_YEAR = 354 + 11 / 30, this.DAYS_PER_ISO_YEAR = 365.2425, this.constantEra = "ah";
  }
  inLeapYear(e, t) {
    return this.daysInMonth({ year: e.year, month: 12, day: 1 }, t) === 30;
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength() {
    return 29;
  }
  maximumMonthLength() {
    return 30;
  }
  estimateIsoDate(e) {
    const { year: t } = this.adjustCalendarDate(e);
    return { year: yl(t * this.DAYS_PER_ISLAMIC_YEAR / this.DAYS_PER_ISO_YEAR) + 622, month: 1, day: 1 };
  }
}
class Ts extends rr {
  constructor() {
    super(...arguments), this.id = "islamic";
  }
}
class pl extends rr {
  constructor() {
    super(...arguments), this.id = "islamic-umalqura";
  }
}
class wl extends rr {
  constructor() {
    super(...arguments), this.id = "islamic-tbla";
  }
}
class vl extends rr {
  constructor() {
    super(...arguments), this.id = "islamic-civil";
  }
}
class Tl extends rr {
  constructor() {
    super(...arguments), this.id = "islamic-rgsa";
  }
}
class bl extends rr {
  constructor() {
    super(...arguments), this.id = "islamicc";
  }
}
class El extends nr {
  constructor() {
    super(...arguments), this.id = "persian", this.calendarType = "solar", this.constantEra = "ap";
  }
  inLeapYear(e, t) {
    return Ts.prototype.inLeapYear.call(this, e, t);
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength(e) {
    const { month: t } = e;
    return t === 12 ? 29 : t <= 6 ? 31 : 30;
  }
  maximumMonthLength(e) {
    const { month: t } = e;
    return t === 12 ? 30 : t <= 6 ? 31 : 30;
  }
  estimateIsoDate(e) {
    const { year: t } = this.adjustCalendarDate(e);
    return { year: t + 621, month: 1, day: 1 };
  }
}
class Dl extends nr {
  constructor() {
    super(...arguments), this.id = "indian", this.calendarType = "solar", this.constantEra = "saka", this.months = { 1: { length: 30, month: 3, day: 22, leap: { length: 31, month: 3, day: 21 } }, 2: { length: 31, month: 4, day: 21 }, 3: { length: 31, month: 5, day: 22 }, 4: { length: 31, month: 6, day: 22 }, 5: { length: 31, month: 7, day: 23 }, 6: { length: 31, month: 8, day: 23 }, 7: { length: 30, month: 9, day: 23 }, 8: { length: 30, month: 10, day: 23 }, 9: { length: 30, month: 11, day: 22 }, 10: { length: 30, month: 12, day: 22 }, 11: { length: 30, month: 1, nextYear: !0, day: 21 }, 12: { length: 30, month: 2, nextYear: !0, day: 20 } }, this.vulnerableToBceBug = (/* @__PURE__ */ new Date("0000-01-01T00:00Z")).toLocaleDateString("en-US-u-ca-indian", { timeZone: "UTC" }) !== "10/11/-79 Saka";
  }
  inLeapYear(e) {
    return bs(e.year + 78);
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength(e) {
    return this.getMonthInfo(e).length;
  }
  maximumMonthLength(e) {
    return this.getMonthInfo(e).length;
  }
  getMonthInfo(e) {
    const { month: t } = e;
    let r = this.months[t];
    if (r === void 0) throw new RangeError(`Invalid month: ${t}`);
    return this.inLeapYear(e) && r.leap && (r = r.leap), r;
  }
  estimateIsoDate(e) {
    const t = this.adjustCalendarDate(e), r = this.getMonthInfo(t);
    return vn(t.year + 78 + (r.nextYear ? 1 : 0), r.month, r.day, 0, 0, 0, t.day - 1, "constrain");
  }
  checkIcuBugs(e) {
    if (this.vulnerableToBceBug && e.year < 1) throw new RangeError(`calendar '${this.id}' is broken for ISO dates before 0001-01-01 (see https://bugs.chromium.org/p/v8/issues/detail?id=10529)`);
  }
}
function bs(n) {
  return n % 4 == 0 && (n % 100 != 0 || n % 400 == 0);
}
class _r extends nr {
  constructor(e, t) {
    super(), this.calendarType = "solar", this.v8IsVulnerableToJulianBug = (/* @__PURE__ */ new Date("+001001-01-01T00:00Z")).toLocaleDateString("en-US-u-ca-japanese", { timeZone: "UTC" }).startsWith("12"), this.calendarIsVulnerableToJulianBug = !1, this.id = e;
    const { eras: r, anchorEra: o } = function(a) {
      let c, d = a;
      if (d.length === 0) throw new RangeError("Invalid era data: eras are required");
      if (d.length === 1 && d[0].reverseOf) throw new RangeError("Invalid era data: anchor era cannot count years backwards");
      if (d.length === 1 && !d[0].name) throw new RangeError("Invalid era data: at least one named era is required");
      if (d.filter((h) => h.reverseOf != null).length > 1) throw new RangeError("Invalid era data: only one era can count years backwards");
      d.forEach((h) => {
        if (h.isAnchor || !h.anchorEpoch && !h.reverseOf) {
          if (c) throw new RangeError("Invalid era data: cannot have multiple anchor eras");
          c = h, h.anchorEpoch = { year: h.hasYearZero ? 0 : 1 };
        } else if (!h.name) throw new RangeError("If era name is blank, it must be the anchor era");
      }), d = d.filter((h) => h.name), d.forEach((h) => {
        const { reverseOf: m } = h;
        if (m) {
          const f = d.find((y) => y.name === m);
          if (f === void 0) throw new RangeError(`Invalid era data: unmatched reverseOf era: ${m}`);
          h.reverseOf = f, h.anchorEpoch = f.anchorEpoch, h.isoEpoch = f.isoEpoch;
        }
        h.anchorEpoch.month === void 0 && (h.anchorEpoch.month = 1), h.anchorEpoch.day === void 0 && (h.anchorEpoch.day = 1);
      }), ml.call(d, (h, m) => {
        if (h.reverseOf) return 1;
        if (m.reverseOf) return -1;
        if (!h.isoEpoch || !m.isoEpoch) throw new RangeError("Invalid era data: missing ISO epoch");
        return m.isoEpoch.year - h.isoEpoch.year;
      });
      const u = d[d.length - 1].reverseOf;
      if (u && u !== d[d.length - 2]) throw new RangeError("Invalid era data: invalid reverse-sign era");
      return d.forEach((h, m) => {
        h.genericName = "era" + (d.length - 1 - m);
      }), { eras: d, anchorEra: c || d[0] };
    }(t);
    this.anchorEra = o, this.eras = r;
  }
  inLeapYear(e) {
    const { year: t } = this.estimateIsoDate({ month: 1, day: 1, year: e.year });
    return bs(t);
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength(e) {
    const { month: t } = e;
    return t === 2 ? this.inLeapYear(e) ? 29 : 28 : [4, 6, 9, 11].indexOf(t) >= 0 ? 30 : 31;
  }
  maximumMonthLength(e) {
    return this.minimumMonthLength(e);
  }
  completeEraYear(e) {
    const t = (c, d) => {
      const u = e[c];
      if (u != null && u != d) throw new RangeError(`Input ${c} ${u} doesn't match calculated value ${d}`);
    }, r = (c) => {
      let d;
      const u = { ...e, year: c }, h = this.eras.find((m, f) => {
        if (f === this.eras.length - 1) {
          if (m.reverseOf) {
            if (c > 0) throw new RangeError(`Signed year ${c} is invalid for era ${m.name}`);
            return d = m.anchorEpoch.year - c, !0;
          }
          return d = c - m.anchorEpoch.year + (m.hasYearZero ? 0 : 1), !0;
        }
        return this.compareCalendarDates(u, m.anchorEpoch) >= 0 && (d = c - m.anchorEpoch.year + (m.hasYearZero ? 0 : 1), !0);
      });
      if (!h) throw new RangeError(`Year ${c} was not matched by any era`);
      return { eraYear: d, era: h.name };
    };
    let { year: o, eraYear: i, era: a } = e;
    if (o != null) ({ eraYear: i, era: a } = r(o)), t("era", a), t("eraYear", i);
    else {
      if (i == null) throw new RangeError("Either `year` or `eraYear` and `era` are required");
      {
        const c = a === void 0 ? void 0 : this.eras.find((d) => d.name === a || d.genericName === a);
        if (!c) throw new RangeError(`Era ${a} (ISO year ${i}) was not matched by any era`);
        if (i < 1 && c.reverseOf) throw new RangeError(`Years in ${a} era must be positive, not ${o}`);
        o = c.reverseOf ? c.anchorEpoch.year - i : i + c.anchorEpoch.year - (c.hasYearZero ? 0 : 1), t("year", o), { eraYear: i, era: a } = r(o);
      }
    }
    return { ...e, year: o, eraYear: i, era: a };
  }
  adjustCalendarDate(e, t, r = "constrain") {
    let o = e;
    const { month: i, monthCode: a } = o;
    return i === void 0 && (o = { ...o, month: fi(a) }), this.validateCalendarDate(o), o = this.completeEraYear(o), super.adjustCalendarDate(o, t, r);
  }
  estimateIsoDate(e) {
    const t = this.adjustCalendarDate(e), { year: r, month: o, day: i } = t, { anchorEra: a } = this;
    return Br(r + a.isoEpoch.year - (a.hasYearZero ? 0 : 1), o, i, "constrain");
  }
  checkIcuBugs(e) {
    if (this.calendarIsVulnerableToJulianBug && this.v8IsVulnerableToJulianBug && tn(e.year, e.month, e.day, 1582, 10, 15) < 0)
      throw new RangeError(`calendar '${this.id}' is broken for ISO dates before 1582-10-15 (see https://bugs.chromium.org/p/chromium/issues/detail?id=1173158)`);
  }
}
class yi extends _r {
  constructor(e, t) {
    super(e, t);
  }
  inLeapYear(e) {
    const { year: t } = e;
    return (t + 1) % 4 == 0;
  }
  monthsInYear() {
    return 13;
  }
  minimumMonthLength(e) {
    const { month: t } = e;
    return t === 13 ? this.inLeapYear(e) ? 6 : 5 : 30;
  }
  maximumMonthLength(e) {
    return this.minimumMonthLength(e);
  }
}
class Cl extends yi {
  constructor() {
    super("ethioaa", [{ name: "era0", isoEpoch: { year: -5492, month: 7, day: 17 } }]);
  }
}
class _l extends yi {
  constructor() {
    super("coptic", [{ name: "era1", isoEpoch: { year: 284, month: 8, day: 29 } }, { name: "era0", reverseOf: "era1" }]);
  }
}
class Il extends yi {
  constructor() {
    super("ethiopic", [{ name: "era0", isoEpoch: { year: -5492, month: 7, day: 17 } }, { name: "era1", isoEpoch: { year: 8, month: 8, day: 27 }, anchorEpoch: { year: 5501 } }]);
  }
}
class kl extends _r {
  constructor() {
    super("roc", [{ name: "minguo", isoEpoch: { year: 1912, month: 1, day: 1 } }, { name: "before-roc", reverseOf: "minguo" }]), this.calendarIsVulnerableToJulianBug = !0;
  }
}
class Ml extends _r {
  constructor() {
    super("buddhist", [{ name: "be", hasYearZero: !0, isoEpoch: { year: -543, month: 1, day: 1 } }]), this.calendarIsVulnerableToJulianBug = !0;
  }
}
class Ol extends _r {
  constructor() {
    super("gregory", [{ name: "ce", isoEpoch: { year: 1, month: 1, day: 1 } }, { name: "bce", reverseOf: "ce" }]);
  }
  reviseIntlEra(e) {
    let { era: t, eraYear: r } = e;
    return t !== "bc" && t !== "b" || (t = "bce"), t !== "ad" && t !== "a" || (t = "ce"), { era: t, eraYear: r };
  }
}
class $l extends _r {
  constructor() {
    super("japanese", [{ name: "reiwa", isoEpoch: { year: 2019, month: 5, day: 1 }, anchorEpoch: { year: 2019, month: 5, day: 1 } }, { name: "heisei", isoEpoch: { year: 1989, month: 1, day: 8 }, anchorEpoch: { year: 1989, month: 1, day: 8 } }, { name: "showa", isoEpoch: { year: 1926, month: 12, day: 25 }, anchorEpoch: { year: 1926, month: 12, day: 25 } }, { name: "taisho", isoEpoch: { year: 1912, month: 7, day: 30 }, anchorEpoch: { year: 1912, month: 7, day: 30 } }, { name: "meiji", isoEpoch: { year: 1868, month: 9, day: 8 }, anchorEpoch: { year: 1868, month: 9, day: 8 } }, { name: "ce", isoEpoch: { year: 1, month: 1, day: 1 } }, { name: "bce", reverseOf: "ce" }]), this.calendarIsVulnerableToJulianBug = !0, this.eraLength = "long", this.erasBeginMidYear = !0;
  }
  reviseIntlEra(e, t) {
    const { era: r, eraYear: o } = e, { year: i } = t;
    return this.eras.find((a) => a.name === r) ? { era: r, eraYear: o } : i < 1 ? { era: "bce", eraYear: 1 - i } : { era: "ce", eraYear: i };
  }
}
class Es extends nr {
  constructor() {
    super(...arguments), this.calendarType = "lunisolar", this.hasEra = !1;
  }
  inLeapYear(e, t) {
    const r = this.getMonthList(e.year, t);
    return Lo(r).length === 13;
  }
  monthsInYear(e, t) {
    return this.inLeapYear(e, t) ? 13 : 12;
  }
  minimumMonthLength() {
    return 29;
  }
  maximumMonthLength() {
    return 30;
  }
  getMonthList(e, t) {
    if (e === void 0) throw new TypeError("Missing year");
    const r = JSON.stringify({ func: "getMonthList", calendarYear: e, id: this.id }), o = t.get(r);
    if (o) return o;
    const i = this.getFormatter(), a = (w, v) => {
      const T = vs({ isoYear: w, isoMonth: 2, isoDay: 1 }), E = new Date(T);
      E.setUTCDate(v + 1);
      const D = i.formatToParts(E), k = D.find(($) => $.type === "month").value, _ = +D.find(($) => $.type === "day").value;
      let C = D.find(($) => $.type === "relatedYear");
      if (C === void 0) throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
      return C = +C.value, { calendarMonthString: k, calendarDay: _, calendarYearToVerify: C };
    };
    let c = 17, { calendarMonthString: d, calendarDay: u, calendarYearToVerify: h } = a(e, c);
    d !== "1" && (c += 29, { calendarMonthString: d, calendarDay: u } = a(e, c)), c -= u - 5;
    const m = {};
    let f, y, g = 1, p = !1;
    do
      ({ calendarMonthString: d, calendarDay: u, calendarYearToVerify: h } = a(e, c)), f && (m[y].daysInMonth = f + 30 - u), h !== e ? p = !0 : (m[d] = { monthIndex: g++ }, c += 30), f = u, y = d;
    while (!p);
    return m[y].daysInMonth = f + 30 - u, t.set(r, m), m;
  }
  estimateIsoDate(e) {
    const { year: t, month: r } = e;
    return { year: t, month: r >= 12 ? 12 : r + 1, day: 1 };
  }
  adjustCalendarDate(e, t, r = "constrain", o = !1) {
    let { year: i, month: a, monthExtra: c, day: d, monthCode: u, eraYear: h } = e;
    if (o) {
      if (i = h, c && c !== "bis") throw new RangeError(`Unexpected leap month suffix: ${c}`);
      const m = Gt(a, c !== void 0), f = `${a}${c || ""}`, y = this.getMonthList(i, t)[f];
      if (y === void 0) throw new RangeError(`Unmatched month ${f} in Chinese year ${i}`);
      return a = y.monthIndex, { year: i, month: a, day: d, era: void 0, eraYear: h, monthCode: m };
    }
    if (this.validateCalendarDate(e), i === void 0 && (i = h), h === void 0 && (h = i), a === void 0) {
      const m = this.getMonthList(i, t);
      let f = u.replace("L", "bis").slice(1);
      f[0] === "0" && (f = f.slice(1));
      let y = m[f];
      if (a = y && y.monthIndex, a === void 0 && u.endsWith("L") && u != "M13L" && r === "constrain") {
        let g = u.slice(1, -1);
        g[0] === "0" && (g = g.slice(1)), y = m[g], y && (a = y.monthIndex, u = Gt(g));
      }
      if (a === void 0) throw new RangeError(`Unmatched month ${u} in Chinese year ${i}`);
    } else if (u === void 0) {
      const m = this.getMonthList(i, t), f = Lo(m), y = f.length;
      r === "reject" ? (je(a, 1, y), je(d, 1, this.maximumMonthLength())) : (a = st(a, 1, y), d = st(d, 1, this.maximumMonthLength()));
      const g = f.find(([, p]) => p.monthIndex === a);
      if (g === void 0) throw new RangeError(`Invalid month ${a} in Chinese year ${i}`);
      u = Gt(g[0].replace("bis", ""), g[0].indexOf("bis") !== -1);
    } else {
      const m = this.getMonthList(i, t);
      let f = u.replace("L", "bis").slice(1);
      f[0] === "0" && (f = f.slice(1));
      const y = m[f];
      if (!y) throw new RangeError(`Unmatched monthCode ${u} in Chinese year ${i}`);
      if (a !== y.monthIndex) throw new RangeError(`monthCode ${u} doesn't correspond to month ${a} in Chinese year ${i}`);
    }
    return { ...e, year: i, eraYear: h, month: a, monthCode: u, day: d };
  }
}
class Rl extends Es {
  constructor() {
    super(...arguments), this.id = "chinese";
  }
}
class Yl extends Es {
  constructor() {
    super(...arguments), this.id = "dangi";
  }
}
class xl {
  constructor(e) {
    this.helper = e;
  }
  dateFromFields(e, t, r) {
    const o = new fe(), i = G(e, this.fields(["day", "month", "monthCode", "year"]), []), a = _e(t), { year: c, month: d, day: u } = this.helper.calendarToIsoDate(i, a, o), h = Dt(c, d, u, r);
    return o.setObject(h), h;
  }
  yearMonthFromFields(e, t, r) {
    const o = new fe(), i = G(e, this.fields(["month", "monthCode", "year"]), []), a = _e(t), { year: c, month: d, day: u } = this.helper.calendarToIsoDate({ ...i, day: 1 }, a, o), h = ur(c, d, r, u);
    return o.setObject(h), h;
  }
  monthDayFromFields(e, t, r) {
    const o = new fe(), i = G(e, this.fields(["day", "month", "monthCode", "year"]), []), a = _e(t), { year: c, month: d, day: u } = this.helper.monthDayFromFields(i, a, o), h = dr(d, u, r, c);
    return o.setObject(h), h;
  }
  fields(e) {
    let t = e;
    return gs.call(t, "year") && (t = [...t, "era", "eraYear"]), t;
  }
  fieldKeysToIgnore(e) {
    const t = new ps();
    for (let r = 0; r < e.length; r++) {
      const o = e[r];
      switch (N(ze, t, [o]), o) {
        case "era":
          N(ze, t, ["eraYear"]), N(ze, t, ["year"]);
          break;
        case "eraYear":
          N(ze, t, ["era"]), N(ze, t, ["year"]);
          break;
        case "year":
          N(ze, t, ["era"]), N(ze, t, ["eraYear"]);
          break;
        case "month":
          N(ze, t, ["monthCode"]), this.helper.erasBeginMidYear && (N(ze, t, ["era"]), N(ze, t, ["eraYear"]));
          break;
        case "monthCode":
          N(ze, t, ["month"]), this.helper.erasBeginMidYear && (N(ze, t, ["era"]), N(ze, t, ["eraYear"]));
          break;
        case "day":
          this.helper.erasBeginMidYear && (N(ze, t, ["era"]), N(ze, t, ["eraYear"]));
      }
    }
    return [...N(ws, t, [])];
  }
  dateAdd(e, t, r, o, i, a, c) {
    const d = fe.getCacheForObject(e), u = this.helper.temporalToCalendarDate(e, d), h = this.helper.addCalendar(u, { years: t, months: r, weeks: o, days: i }, a, d), m = this.helper.calendarToIsoDate(h, "constrain", d), { year: f, month: y, day: g } = m, p = Dt(f, y, g, c);
    return new fe(d).setObject(p), p;
  }
  dateUntil(e, t, r) {
    const o = fe.getCacheForObject(e), i = fe.getCacheForObject(t), a = this.helper.temporalToCalendarDate(e, o), c = this.helper.temporalToCalendarDate(t, i);
    return this.helper.untilCalendar(a, c, r, o);
  }
  year(e) {
    const t = fe.getCacheForObject(e);
    return this.helper.temporalToCalendarDate(e, t).year;
  }
  month(e) {
    const t = fe.getCacheForObject(e);
    return this.helper.temporalToCalendarDate(e, t).month;
  }
  day(e) {
    const t = fe.getCacheForObject(e);
    return this.helper.temporalToCalendarDate(e, t).day;
  }
  era(e) {
    if (!this.helper.hasEra) return;
    const t = fe.getCacheForObject(e);
    return this.helper.temporalToCalendarDate(e, t).era;
  }
  eraYear(e) {
    if (!this.helper.hasEra) return;
    const t = fe.getCacheForObject(e);
    return this.helper.temporalToCalendarDate(e, t).eraYear;
  }
  monthCode(e) {
    const t = fe.getCacheForObject(e);
    return this.helper.temporalToCalendarDate(e, t).monthCode;
  }
  dayOfWeek(e) {
    return de.iso8601.dayOfWeek(e);
  }
  dayOfYear(e) {
    const t = fe.getCacheForObject(e), r = this.helper.isoToCalendarDate(e, t), o = this.helper.startOfCalendarYear(r);
    return this.helper.calendarDaysUntil(o, r, t) + 1;
  }
  weekOfYear(e) {
    return de.iso8601.weekOfYear(e);
  }
  yearOfWeek(e) {
    return de.iso8601.yearOfWeek(e);
  }
  daysInWeek(e) {
    return de.iso8601.daysInWeek(e);
  }
  daysInMonth(e) {
    const t = fe.getCacheForObject(e), r = this.helper.temporalToCalendarDate(e, t), o = this.helper.maximumMonthLength(r);
    if (o === this.helper.minimumMonthLength(r)) return o;
    const i = this.helper.startOfCalendarMonth(r), a = this.helper.addMonthsCalendar(i, 1, "constrain", t);
    return this.helper.calendarDaysUntil(i, a, t);
  }
  daysInYear(e) {
    let t = e;
    Ne(t, M) || (t = ae(t));
    const r = fe.getCacheForObject(t), o = this.helper.temporalToCalendarDate(t, r), i = this.helper.startOfCalendarYear(o), a = this.helper.addCalendar(i, { years: 1 }, "constrain", r);
    return this.helper.calendarDaysUntil(i, a, r);
  }
  monthsInYear(e) {
    const t = fe.getCacheForObject(e), r = this.helper.temporalToCalendarDate(e, t);
    return this.helper.monthsInYear(r, t);
  }
  inLeapYear(e) {
    let t = e;
    Ne(t, M) || (t = ae(t));
    const r = fe.getCacheForObject(t), o = this.helper.temporalToCalendarDate(t, r);
    return this.helper.inLeapYear(o, r);
  }
}
for (const n of [gl, El, Il, Cl, _l, Rl, Yl, kl, Dl, Ml, Ol, $l, Ts, pl, wl, vl, Tl, bl]) {
  const e = new n();
  de[e.id] = new xl(e);
}
class Ir {
  constructor(e, t, r, o = "iso8601") {
    Pa(this, ee(e), ee(t), ee(r), dt(o));
  }
  get calendarId() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Ue(s(this, b));
  }
  get era() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return io(s(this, b), this);
  }
  get eraYear() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return ao(s(this, b), this);
  }
  get year() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return ro(s(this, b), this);
  }
  get month() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return oo(s(this, b), this);
  }
  get monthCode() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Tr(s(this, b), this);
  }
  get day() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return br(s(this, b), this);
  }
  get dayOfWeek() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Ko(s(this, b), this);
  }
  get dayOfYear() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Xo(s(this, b), this);
  }
  get weekOfYear() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Qo(s(this, b), this);
  }
  get yearOfWeek() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Jo(s(this, b), this);
  }
  get daysInWeek() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return ei(s(this, b), this);
  }
  get daysInMonth() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return so(s(this, b), this);
  }
  get daysInYear() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return lo(s(this, b), this);
  }
  get monthsInYear() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return co(s(this, b), this);
  }
  get inLeapYear() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return uo(s(this, b), this);
  }
  with(e, t) {
    if (!K(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid argument");
    Xn(e);
    const r = X(t), o = s(this, b), i = Me(o, ["day", "month", "monthCode", "year"]);
    let a = G(this, i, []);
    return a = _n(o, a, G(e, i, "partial")), a = G(a, i, []), Kt(o, a, r);
  }
  withCalendar(e) {
    if (!K(this)) throw new TypeError("invalid receiver");
    const t = dt(e);
    return new Ir(s(this, M), s(this, R), s(this, Y), t);
  }
  add(e, t) {
    if (!K(this)) throw new TypeError("invalid receiver");
    const r = Nn(e), o = X(t);
    return Le(s(this, b), this, r, o);
  }
  subtract(e, t) {
    if (!K(this)) throw new TypeError("invalid receiver");
    const r = Ha(Nn(e)), o = X(t);
    return Le(s(this, b), this, r, o);
  }
  until(e, t) {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Wi("until", this, e, t);
  }
  since(e, t) {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Wi("since", this, e, t);
  }
  equals(e) {
    if (!K(this)) throw new TypeError("invalid receiver");
    const t = ae(e);
    for (const r of [M, R, Y])
      if (s(this, r) !== s(t, r)) return !1;
    return Dr(s(this, b), s(t, b));
  }
  toString(e) {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Fi(this, gr(X(e)));
  }
  toJSON() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Fi(this);
  }
  toLocaleString(e, t) {
    if (!K(this)) throw new TypeError("invalid receiver");
    return new hn(e, t).format(this);
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.PlainDate");
  }
  toPlainDateTime(e) {
    if (!K(this)) throw new TypeError("invalid receiver");
    const t = s(this, M), r = s(this, R), o = s(this, Y), i = s(this, b);
    if (e === void 0) return at(t, r, o, 0, 0, 0, 0, 0, 0, i);
    const a = Zt(e);
    return at(t, r, o, s(a, j), s(a, U), s(a, z), s(a, q), s(a, B), s(a, Z), i);
  }
  toZonedDateTime(e) {
    if (!K(this)) throw new TypeError("invalid receiver");
    let t, r;
    if (ce(e)) if (vt(e)) t = e;
    else {
      const g = e.timeZone;
      g === void 0 ? t = Ze(e) : (t = Ze(g), r = e.plainTime);
    }
    else t = Ze(e);
    const o = s(this, M), i = s(this, R), a = s(this, Y), c = s(this, b);
    let d = 0, u = 0, h = 0, m = 0, f = 0, y = 0;
    return r !== void 0 && (r = Zt(r), d = s(r, j), u = s(r, U), h = s(r, z), m = s(r, q), f = s(r, B), y = s(r, Z)), Se(s(rt(t, at(o, i, a, d, u, h, m, f, y, c), "compatible"), F), t, c);
  }
  toPlainYearMonth() {
    if (!K(this)) throw new TypeError("invalid receiver");
    const e = s(this, b);
    return In(e, G(this, Me(e, ["monthCode", "year"]), []));
  }
  toPlainMonthDay() {
    if (!K(this)) throw new TypeError("invalid receiver");
    const e = s(this, b);
    return Bn(e, G(this, Me(e, ["day", "monthCode"]), []));
  }
  getISOFields() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return { calendar: s(this, b), isoDay: s(this, Y), isoMonth: s(this, R), isoYear: s(this, M) };
  }
  getCalendar() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return er(s(this, b));
  }
  static from(e, t) {
    const r = X(t);
    return K(e) ? (_e(r), Dt(s(e, M), s(e, R), s(e, Y), s(e, b))) : ae(e, r);
  }
  static compare(e, t) {
    const r = ae(e), o = ae(t);
    return tn(s(r, M), s(r, R), s(r, Y), s(o, M), s(o, R), s(o, Y));
  }
}
Ut(Ir, "Temporal.PlainDate");
class kr {
  constructor(e, t, r, o = 0, i = 0, a = 0, c = 0, d = 0, u = 0, h = "iso8601") {
    Na(this, ee(e), ee(t), ee(r), o === void 0 ? 0 : ee(o), i === void 0 ? 0 : ee(i), a === void 0 ? 0 : ee(a), c === void 0 ? 0 : ee(c), d === void 0 ? 0 : ee(d), u === void 0 ? 0 : ee(u), dt(h));
  }
  get calendarId() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Ue(s(this, b));
  }
  get year() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return ro(s(this, b), this);
  }
  get month() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return oo(s(this, b), this);
  }
  get monthCode() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Tr(s(this, b), this);
  }
  get day() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return br(s(this, b), this);
  }
  get hour() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return s(this, j);
  }
  get minute() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return s(this, U);
  }
  get second() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return s(this, z);
  }
  get millisecond() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return s(this, q);
  }
  get microsecond() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return s(this, B);
  }
  get nanosecond() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return s(this, Z);
  }
  get era() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return io(s(this, b), this);
  }
  get eraYear() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return ao(s(this, b), this);
  }
  get dayOfWeek() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Ko(s(this, b), this);
  }
  get dayOfYear() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Xo(s(this, b), this);
  }
  get weekOfYear() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Qo(s(this, b), this);
  }
  get yearOfWeek() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Jo(s(this, b), this);
  }
  get daysInWeek() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return ei(s(this, b), this);
  }
  get daysInYear() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return lo(s(this, b), this);
  }
  get daysInMonth() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return so(s(this, b), this);
  }
  get monthsInYear() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return co(s(this, b), this);
  }
  get inLeapYear() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return uo(s(this, b), this);
  }
  with(e, t) {
    if (!L(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid argument");
    Xn(e);
    const r = X(t), o = s(this, b), i = Me(o, ["day", "hour", "microsecond", "millisecond", "minute", "month", "monthCode", "nanosecond", "second", "year"]);
    let a = G(this, i, []);
    a = _n(o, a, G(e, i, "partial")), a = G(a, i, []);
    const { year: c, month: d, day: u, hour: h, minute: m, second: f, millisecond: y, microsecond: g, nanosecond: p } = vr(o, a, r);
    return at(c, d, u, h, m, f, y, g, p, o);
  }
  withPlainTime(e) {
    if (!L(this)) throw new TypeError("invalid receiver");
    const t = s(this, M), r = s(this, R), o = s(this, Y), i = s(this, b);
    if (e === void 0) return at(t, r, o, 0, 0, 0, 0, 0, 0, i);
    const a = Zt(e);
    return at(t, r, o, s(a, j), s(a, U), s(a, z), s(a, q), s(a, B), s(a, Z), i);
  }
  withPlainDate(e) {
    if (!L(this)) throw new TypeError("invalid receiver");
    const t = ae(e), r = s(t, M), o = s(t, R), i = s(t, Y);
    let a = s(t, b);
    const c = s(this, j), d = s(this, U), u = s(this, z), h = s(this, q), m = s(this, B), f = s(this, Z);
    return a = La(s(this, b), a), at(r, o, i, c, d, u, h, m, f, a);
  }
  withCalendar(e) {
    if (!L(this)) throw new TypeError("invalid receiver");
    const t = dt(e);
    return new kr(s(this, M), s(this, R), s(this, Y), s(this, j), s(this, U), s(this, z), s(this, q), s(this, B), s(this, Z), t);
  }
  add(e, t) {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Ji("add", this, e, t);
  }
  subtract(e, t) {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Ji("subtract", this, e, t);
  }
  until(e, t) {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Vi("until", this, e, t);
  }
  since(e, t) {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Vi("since", this, e, t);
  }
  round(e) {
    if (!L(this)) throw new TypeError("invalid receiver");
    if (e === void 0) throw new TypeError("options parameter is required");
    const t = typeof e == "string" ? Vn("smallestUnit", e) : X(e), r = Qn(t), o = Ot(t, "halfExpand"), i = ct(t, "smallestUnit", "time", Dn, ["day"]), a = { day: 1, hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[i];
    Jn(r, a, a === 1);
    let c = s(this, M), d = s(this, R), u = s(this, Y), h = s(this, j), m = s(this, U), f = s(this, z), y = s(this, q), g = s(this, B), p = s(this, Z);
    return { year: c, month: d, day: u, hour: h, minute: m, second: f, millisecond: y, microsecond: g, nanosecond: p } = ci(c, d, u, h, m, f, y, g, p, r, i, o), at(c, d, u, h, m, f, y, g, p, s(this, b));
  }
  equals(e) {
    if (!L(this)) throw new TypeError("invalid receiver");
    const t = pn(e);
    for (const r of [M, R, Y, j, U, z, q, B, Z])
      if (s(this, r) !== s(t, r)) return !1;
    return Dr(s(this, b), s(t, b));
  }
  toString(e) {
    if (!L(this)) throw new TypeError("invalid receiver");
    const t = X(e), r = gr(t), o = pr(t), i = Ot(t, "trunc"), a = ct(t, "smallestUnit", "time", void 0);
    if (a === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const { precision: c, unit: d, increment: u } = wr(a, o);
    return Si(this, c, r, { unit: d, increment: u, roundingMode: i });
  }
  toJSON() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Si(this, "auto");
  }
  toLocaleString(e, t) {
    if (!L(this)) throw new TypeError("invalid receiver");
    return new hn(e, t).format(this);
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.PlainDateTime");
  }
  toZonedDateTime(e, t) {
    if (!L(this)) throw new TypeError("invalid receiver");
    const r = Ze(e);
    return Se(s(rt(r, this, qn(X(t))), F), r, s(this, b));
  }
  toPlainDate() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Zn(this);
  }
  toPlainYearMonth() {
    if (!L(this)) throw new TypeError("invalid receiver");
    const e = s(this, b);
    return In(e, G(this, Me(e, ["monthCode", "year"]), []));
  }
  toPlainMonthDay() {
    if (!L(this)) throw new TypeError("invalid receiver");
    const e = s(this, b);
    return Bn(e, G(this, Me(e, ["day", "monthCode"]), []));
  }
  toPlainTime() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return ti(this);
  }
  getISOFields() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return { calendar: s(this, b), isoDay: s(this, Y), isoHour: s(this, j), isoMicrosecond: s(this, B), isoMillisecond: s(this, q), isoMinute: s(this, U), isoMonth: s(this, R), isoNanosecond: s(this, Z), isoSecond: s(this, z), isoYear: s(this, M) };
  }
  getCalendar() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return er(s(this, b));
  }
  static from(e, t) {
    const r = X(t);
    return L(e) ? (_e(r), at(s(e, M), s(e, R), s(e, Y), s(e, j), s(e, U), s(e, z), s(e, q), s(e, B), s(e, Z), s(e, b))) : pn(e, r);
  }
  static compare(e, t) {
    const r = pn(e), o = pn(t);
    for (const i of [M, R, Y, j, U, z, q, B, Z]) {
      const a = s(r, i), c = s(o, i);
      if (a !== c) return Tn(a - c);
    }
    return 0;
  }
}
Ut(kr, "Temporal.PlainDateTime");
class nn {
  constructor(e = 0, t = 0, r = 0, o = 0, i = 0, a = 0, c = 0, d = 0, u = 0, h = 0) {
    const m = e === void 0 ? 0 : Pe(e), f = t === void 0 ? 0 : Pe(t), y = r === void 0 ? 0 : Pe(r), g = o === void 0 ? 0 : Pe(o), p = i === void 0 ? 0 : Pe(i), w = a === void 0 ? 0 : Pe(a), v = c === void 0 ? 0 : Pe(c), T = d === void 0 ? 0 : Pe(d), E = u === void 0 ? 0 : Pe(u), D = h === void 0 ? 0 : Pe(h);
    Kr(m, f, y, g, p, w, v, T, E, D), zt(this), W(this, Ve, m), W(this, Ae, f), W(this, it, y), W(this, Ge, g), W(this, He, p), W(this, Ke, w), W(this, Xe, v), W(this, Qe, T), W(this, Je, E), W(this, et, D);
  }
  get years() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, Ve);
  }
  get months() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, Ae);
  }
  get weeks() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, it);
  }
  get days() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, Ge);
  }
  get hours() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, He);
  }
  get minutes() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, Ke);
  }
  get seconds() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, Xe);
  }
  get milliseconds() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, Qe);
  }
  get microseconds() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, Je);
  }
  get nanoseconds() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, et);
  }
  get sign() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return Ft(s(this, Ve), s(this, Ae), s(this, it), s(this, Ge), s(this, He), s(this, Ke), s(this, Xe), s(this, Qe), s(this, Je), s(this, et));
  }
  get blank() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return Ft(s(this, Ve), s(this, Ae), s(this, it), s(this, Ge), s(this, He), s(this, Ke), s(this, Xe), s(this, Qe), s(this, Je), s(this, et)) === 0;
  }
  with(e) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    const t = G(e, ["days", "hours", "microseconds", "milliseconds", "minutes", "months", "nanoseconds", "seconds", "weeks", "years"], "partial"), { years: r = s(this, Ve), months: o = s(this, Ae), weeks: i = s(this, it), days: a = s(this, Ge), hours: c = s(this, He), minutes: d = s(this, Ke), seconds: u = s(this, Xe), milliseconds: h = s(this, Qe), microseconds: m = s(this, Je), nanoseconds: f = s(this, et) } = t;
    return new nn(r, o, i, a, c, d, u, h, m, f);
  }
  negated() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return Ha(this);
  }
  abs() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return new nn(Math.abs(s(this, Ve)), Math.abs(s(this, Ae)), Math.abs(s(this, it)), Math.abs(s(this, Ge)), Math.abs(s(this, He)), Math.abs(s(this, Ke)), Math.abs(s(this, Xe)), Math.abs(s(this, Qe)), Math.abs(s(this, Je)), Math.abs(s(this, et)));
  }
  add(e, t) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return Xi("add", this, e, t);
  }
  subtract(e, t) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return Xi("subtract", this, e, t);
  }
  round(e) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    if (e === void 0) throw new TypeError("options parameter is required");
    let t = s(this, Ve), r = s(this, Ae), o = s(this, it), i = s(this, Ge), a = s(this, He), c = s(this, Ke), d = s(this, Xe), u = s(this, Qe), h = s(this, Je), m = s(this, et), f = Yo(t, r, o, i, a, c, d, u, h, m);
    const y = typeof e == "string" ? Vn("smallestUnit", e) : X(e);
    let g = ct(y, "largestUnit", "datetime", void 0, ["auto"]), p = xr(y);
    const w = Qn(y), v = Ot(y, "halfExpand");
    let T = ct(y, "smallestUnit", "datetime", void 0), E = !0;
    T || (E = !1, T = "nanosecond"), f = Cn(f, T);
    let D = !0;
    if (g || (D = !1, g = f), g === "auto" && (g = f), !E && !D) throw new RangeError("at least one of smallestUnit or largestUnit is required");
    if (Cn(g, T) !== g) throw new RangeError(`largestUnit ${g} cannot be smaller than smallestUnit ${T}`);
    const k = { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[T];
    return k !== void 0 && Jn(w, k, !1), { years: t, months: r, weeks: o, days: i } = $r(t, r, o, i, g, p), { years: t, months: r, weeks: o, days: i, hours: a, minutes: c, seconds: d, milliseconds: u, microseconds: h, nanoseconds: m } = Xt(t, r, o, i, a, c, d, u, h, m, w, T, v, p), { years: t, months: r, weeks: o, days: i, hours: a, minutes: c, seconds: d, milliseconds: u, microseconds: h, nanoseconds: m } = os(t, r, o, i, a, c, d, u, h, m, w, T, v, p), { days: i, hours: a, minutes: c, seconds: d, milliseconds: u, microseconds: h, nanoseconds: m } = _t(i, a, c, d, u, h, m, g, p), { years: t, months: r, weeks: o, days: i } = function(C, $, P, re, Q, J) {
      const A = I("%Temporal.Duration%"), V = Ft(C, $, P, re, 0, 0, 0, 0, 0, 0);
      if (V === 0) return { years: C, months: $, weeks: P, days: re };
      const O = l.BigInt(V);
      let S, H, Ie = l.BigInt(C), Oe = l.BigInt($), $e = l.BigInt(P), be = l.BigInt(re);
      J && (H = ae(J), S = s(H, b));
      const ut = new A(V), Rt = new A(0, V), Yt = new A(0, 0, V);
      switch (Q) {
        case "year": {
          if (!S) throw new RangeError("a starting point is required for years balancing");
          const ht = typeof S != "string" ? oe(S, "dateAdd") : void 0;
          let Fe, mt, Or;
          for ({ relativeTo: Fe, days: mt } = qe(S, H, ut, ht); l.greaterThanOrEqual(kt(be), l.BigInt(le(mt))); ) be = l.subtract(be, l.BigInt(mt)), Ie = l.add(Ie, O), H = Fe, { relativeTo: Fe, days: mt } = qe(S, H, ut, ht);
          for ({ relativeTo: Fe, days: Or } = qe(S, H, Rt, ht); l.greaterThanOrEqual(kt(be), l.BigInt(le(Or))); ) be = l.subtract(be, l.BigInt(Or)), Oe = l.add(Oe, O), H = Fe, { relativeTo: Fe, days: Or } = qe(S, H, Rt, ht);
          Fe = Le(S, H, ut, void 0, ht);
          const bi = typeof S != "string" ? oe(S, "dateUntil") : void 0, Ei = We(null);
          Ei.largestUnit = "month";
          let po = rn(S, H, Fe, Ei, bi), wo = s(po, Ae);
          for (; l.greaterThanOrEqual(kt(Oe), l.BigInt(le(wo))); ) {
            Oe = l.subtract(Oe, l.BigInt(wo)), Ie = l.add(Ie, O), H = Fe, Fe = Le(S, H, ut, void 0, ht);
            const Di = We(null);
            Di.largestUnit = "month", po = rn(S, H, Fe, Di, bi), wo = s(po, Ae);
          }
          break;
        }
        case "month": {
          if (!S) throw new RangeError("a starting point is required for months balancing");
          const ht = typeof S != "string" ? oe(S, "dateAdd") : void 0;
          let Fe, mt;
          for ({ relativeTo: Fe, days: mt } = qe(S, H, Rt, ht); l.greaterThanOrEqual(kt(be), l.BigInt(le(mt))); ) be = l.subtract(be, l.BigInt(mt)), Oe = l.add(Oe, O), H = Fe, { relativeTo: Fe, days: mt } = qe(S, H, Rt, ht);
          break;
        }
        case "week": {
          if (!S) throw new RangeError("a starting point is required for weeks balancing");
          const ht = typeof S != "string" ? oe(S, "dateAdd") : void 0;
          let Fe, mt;
          for ({ relativeTo: Fe, days: mt } = qe(S, H, Yt, ht); l.greaterThanOrEqual(kt(be), l.BigInt(le(mt))); ) be = l.subtract(be, l.BigInt(mt)), $e = l.add($e, O), H = Fe, { relativeTo: Fe, days: mt } = qe(S, H, Yt, ht);
          break;
        }
      }
      return { years: l.toNumber(Ie), months: l.toNumber(Oe), weeks: l.toNumber($e), days: l.toNumber(be) };
    }(t, r, o, i, g, p), new nn(t, r, o, i, a, c, d, u, h, m);
  }
  total(e) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    let t = s(this, Ve), r = s(this, Ae), o = s(this, it), i = s(this, Ge), a = s(this, He), c = s(this, Ke), d = s(this, Xe), u = s(this, Qe), h = s(this, Je), m = s(this, et);
    if (e === void 0) throw new TypeError("options argument is required");
    const f = typeof e == "string" ? Vn("unit", e) : X(e), y = xr(f), g = ct(f, "unit", "datetime", Dn);
    let p;
    ({ years: t, months: r, weeks: o, days: i } = $r(t, r, o, i, g, y)), x(y) && (p = rs(y, t, r, o, 0));
    let w = Ga(i, a, c, d, u, h, m, g, p);
    if (w === "positive overflow") return 1 / 0;
    if (w === "negative overflow") return -1 / 0;
    ({ days: i, hours: a, minutes: c, seconds: d, milliseconds: u, microseconds: h, nanoseconds: m } = w);
    const { total: v } = Xt(t, r, o, i, a, c, d, u, h, m, 1, g, "trunc", y);
    return v;
  }
  toString(e) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    const t = X(e), r = pr(t), o = Ot(t, "trunc"), i = ct(t, "smallestUnit", "time", void 0);
    if (i === "hour" || i === "minute") throw new RangeError('smallestUnit must be a time unit other than "hours" or "minutes"');
    const { precision: a, unit: c, increment: d } = wr(i, r);
    return bo(this, a, { unit: c, increment: d, roundingMode: o });
  }
  toJSON() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return bo(this);
  }
  toLocaleString(e, t) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return typeof Intl < "u" && Intl.DurationFormat !== void 0 ? new Intl.DurationFormat(e, t).format(this) : (console.warn("Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat."), bo(this));
  }
  valueOf() {
    throw new TypeError("use compare() to compare Temporal.Duration");
  }
  static from(e) {
    return pe(e) ? new nn(s(e, Ve), s(e, Ae), s(e, it), s(e, Ge), s(e, He), s(e, Ke), s(e, Xe), s(e, Qe), s(e, Je), s(e, et)) : Nn(e);
  }
  static compare(e, t, r) {
    const o = Nn(e), i = Nn(t), a = xr(X(r)), c = s(o, Ve), d = s(o, Ae), u = s(o, it);
    let h = s(o, Ge);
    const m = s(o, He), f = s(o, Ke), y = s(o, Xe), g = s(o, Qe), p = s(o, Je);
    let w = s(o, et);
    const v = s(i, Ve), T = s(i, Ae), E = s(i, it);
    let D = s(i, Ge);
    const k = s(i, He), _ = s(i, Ke), C = s(i, Xe), $ = s(i, Qe), P = s(i, Je);
    let re = s(i, et);
    const Q = Bi(a, c, d, u, h), J = Bi(a, v, T, E, D);
    c === 0 && v === 0 && d === 0 && T === 0 && u === 0 && E === 0 || ({ days: h } = $r(c, d, u, h, "day", a), { days: D } = $r(v, T, E, D, "day", a));
    const A = Wn(h, m, f, y, g, p, w, Q), V = Wn(D, k, _, C, $, P, re, J);
    return Tn(l.toNumber(l.subtract(A, V)));
  }
}
Ut(nn, "Temporal.Duration");
const Pl = Object.create;
class gi {
  constructor(e, t, r = "iso8601", o = 1972) {
    Aa(this, ee(e), ee(t), dt(r), ee(o));
  }
  get monthCode() {
    if (!xe(this)) throw new TypeError("invalid receiver");
    return Tr(s(this, b), this);
  }
  get day() {
    if (!xe(this)) throw new TypeError("invalid receiver");
    return br(s(this, b), this);
  }
  get calendarId() {
    if (!xe(this)) throw new TypeError("invalid receiver");
    return Ue(s(this, b));
  }
  with(e, t) {
    if (!xe(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid argument");
    Xn(e);
    const r = X(t), o = s(this, b), i = Me(o, ["day", "month", "monthCode", "year"]);
    let a = G(this, i, []);
    return a = _n(o, a, G(e, i, "partial")), a = G(a, i, []), Bn(o, a, r);
  }
  equals(e) {
    if (!xe(this)) throw new TypeError("invalid receiver");
    const t = Ni(e);
    for (const r of [R, Y, M])
      if (s(this, r) !== s(t, r)) return !1;
    return Dr(s(this, b), s(t, b));
  }
  toString(e) {
    if (!xe(this)) throw new TypeError("invalid receiver");
    return Li(this, gr(X(e)));
  }
  toJSON() {
    if (!xe(this)) throw new TypeError("invalid receiver");
    return Li(this);
  }
  toLocaleString(e, t) {
    if (!xe(this)) throw new TypeError("invalid receiver");
    return new hn(e, t).format(this);
  }
  valueOf() {
    throw new TypeError("use equals() to compare Temporal.PlainMonthDay");
  }
  toPlainDate(e) {
    if (!xe(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("argument should be an object");
    const t = s(this, b), r = Me(t, ["day", "monthCode"]), o = G(this, r, []), i = Me(t, ["year"]);
    let a = _n(t, o, G(e, i, []));
    a = G(a, [.../* @__PURE__ */ new Set([...r, ...i])], []);
    const c = Pl(null);
    return c.overflow = "reject", Kt(t, a, c);
  }
  getISOFields() {
    if (!xe(this)) throw new TypeError("invalid receiver");
    return { calendar: s(this, b), isoDay: s(this, Y), isoMonth: s(this, R), isoYear: s(this, M) };
  }
  getCalendar() {
    if (!xe(this)) throw new TypeError("invalid receiver");
    return er(s(this, b));
  }
  static from(e, t) {
    const r = X(t);
    return xe(e) ? (_e(r), dr(s(e, R), s(e, Y), s(e, b), s(e, M))) : Ni(e, r);
  }
}
Ut(gi, "Temporal.PlainMonthDay");
const pi = () => new (I("%Temporal.Instant%"))(ui()), oa = (n, e = en()) => {
  const t = Ze(e), r = dt(n);
  return pt(t, pi(), r);
}, _o = (n = en()) => pt(Ze(n), pi(), "iso8601"), ia = (n, e = en()) => {
  const t = Ze(e), r = dt(n);
  return Se(ui(), t, r);
}, Ds = { instant: pi, plainDateTime: oa, plainDateTimeISO: _o, plainDate: (n, e = en()) => Zn(oa(n, e)), plainDateISO: (n = en()) => Zn(_o(n)), plainTimeISO: (n = en()) => ti(_o(n)), timeZoneId: () => en(), zonedDateTime: ia, zonedDateTimeISO: (n = en()) => ia("iso8601", n), [Symbol.toStringTag]: "Temporal.Now" };
Object.defineProperty(Ds, Symbol.toStringTag, { value: "Temporal.Now", writable: !1, enumerable: !1, configurable: !0 });
const Nl = Object.assign;
function aa(n, e, t) {
  let r = s(n, j), o = s(n, U), i = s(n, z), a = s(n, q), c = s(n, B), d = s(n, Z);
  if (t) {
    const { unit: u, increment: h, roundingMode: m } = t;
    ({ hour: r, minute: o, second: i, millisecond: a, microsecond: c, nanosecond: d } = di(r, o, i, a, c, d, h, u, m));
  }
  return `${ue(r)}:${ue(o)}${mo(i, a, c, d, e)}`;
}
class bn {
  constructor(e = 0, t = 0, r = 0, o = 0, i = 0, a = 0) {
    const c = e === void 0 ? 0 : ee(e), d = t === void 0 ? 0 : ee(t), u = r === void 0 ? 0 : ee(r), h = o === void 0 ? 0 : ee(o), m = i === void 0 ? 0 : ee(i), f = a === void 0 ? 0 : ee(a);
    go(c, d, u, h, m, f), zt(this), W(this, j, c), W(this, U, d), W(this, z, u), W(this, q, h), W(this, B, m), W(this, Z, f);
  }
  get hour() {
    if (!we(this)) throw new TypeError("invalid receiver");
    return s(this, j);
  }
  get minute() {
    if (!we(this)) throw new TypeError("invalid receiver");
    return s(this, U);
  }
  get second() {
    if (!we(this)) throw new TypeError("invalid receiver");
    return s(this, z);
  }
  get millisecond() {
    if (!we(this)) throw new TypeError("invalid receiver");
    return s(this, q);
  }
  get microsecond() {
    if (!we(this)) throw new TypeError("invalid receiver");
    return s(this, B);
  }
  get nanosecond() {
    if (!we(this)) throw new TypeError("invalid receiver");
    return s(this, Z);
  }
  with(e, t) {
    if (!we(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid argument");
    Xn(e);
    const r = _e(X(t)), o = Wr(e, "partial"), i = Wr(this);
    let { hour: a, minute: c, second: d, millisecond: u, microsecond: h, nanosecond: m } = Nl(i, o);
    return { hour: a, minute: c, second: d, millisecond: u, microsecond: h, nanosecond: m } = no(a, c, d, u, h, m, r), new bn(a, c, d, u, h, m);
  }
  add(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    return ea("add", this, e);
  }
  subtract(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    return ea("subtract", this, e);
  }
  until(e, t) {
    if (!we(this)) throw new TypeError("invalid receiver");
    return Gi("until", this, e, t);
  }
  since(e, t) {
    if (!we(this)) throw new TypeError("invalid receiver");
    return Gi("since", this, e, t);
  }
  round(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    if (e === void 0) throw new TypeError("options parameter is required");
    const t = typeof e == "string" ? Vn("smallestUnit", e) : X(e), r = Qn(t), o = Ot(t, "halfExpand"), i = ct(t, "smallestUnit", "time", Dn);
    Jn(r, { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[i], !1);
    let a = s(this, j), c = s(this, U), d = s(this, z), u = s(this, q), h = s(this, B), m = s(this, Z);
    return { hour: a, minute: c, second: d, millisecond: u, microsecond: h, nanosecond: m } = di(a, c, d, u, h, m, r, i, o), new bn(a, c, d, u, h, m);
  }
  equals(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    const t = Zt(e);
    for (const r of [j, U, z, q, B, Z])
      if (s(this, r) !== s(t, r)) return !1;
    return !0;
  }
  toString(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    const t = X(e), r = pr(t), o = Ot(t, "trunc"), i = ct(t, "smallestUnit", "time", void 0);
    if (i === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const { precision: a, unit: c, increment: d } = wr(i, r);
    return aa(this, a, { unit: c, increment: d, roundingMode: o });
  }
  toJSON() {
    if (!we(this)) throw new TypeError("invalid receiver");
    return aa(this, "auto");
  }
  toLocaleString(e, t) {
    if (!we(this)) throw new TypeError("invalid receiver");
    return new hn(e, t).format(this);
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.PlainTime");
  }
  toPlainDateTime(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    const t = ae(e), r = s(t, M), o = s(t, R), i = s(t, Y), a = s(t, b);
    return at(r, o, i, s(this, j), s(this, U), s(this, z), s(this, q), s(this, B), s(this, Z), a);
  }
  toZonedDateTime(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid argument");
    const t = e.plainDate;
    if (t === void 0) throw new TypeError("missing date property");
    const r = ae(t), o = e.timeZone;
    if (o === void 0) throw new TypeError("missing timeZone property");
    const i = Ze(o), a = s(r, M), c = s(r, R), d = s(r, Y), u = s(r, b), h = s(this, j), m = s(this, U), f = s(this, z), y = s(this, q), g = s(this, B), p = s(this, Z);
    return Se(s(rt(i, new (I("%Temporal.PlainDateTime%"))(a, c, d, h, m, f, y, g, p, u), "compatible"), F), i, u);
  }
  getISOFields() {
    if (!we(this)) throw new TypeError("invalid receiver");
    return { isoHour: s(this, j), isoMicrosecond: s(this, B), isoMillisecond: s(this, q), isoMinute: s(this, U), isoNanosecond: s(this, Z), isoSecond: s(this, z) };
  }
  static from(e, t) {
    const r = _e(X(t));
    return we(e) ? new bn(s(e, j), s(e, U), s(e, z), s(e, q), s(e, B), s(e, Z)) : Zt(e, r);
  }
  static compare(e, t) {
    const r = Zt(e), o = Zt(t);
    for (const i of [j, U, z, q, B, Z]) {
      const a = s(r, i), c = s(o, i);
      if (a !== c) return Tn(a - c);
    }
    return 0;
  }
}
Ut(bn, "Temporal.PlainTime");
class lr {
  constructor(e) {
    if (arguments.length < 1) throw new RangeError("missing argument: identifier is required");
    const t = ni(e);
    zt(this), W(this, Pt, t);
  }
  get id() {
    if (!vt(this)) throw new TypeError("invalid receiver");
    return s(this, Pt);
  }
  getOffsetNanosecondsFor(e) {
    if (!vt(this)) throw new TypeError("invalid receiver");
    const t = Mt(e), r = s(this, Pt);
    return Yn(r) ? on(r) : Wt(r, s(t, F));
  }
  getOffsetStringFor(e) {
    if (!vt(this)) throw new TypeError("invalid receiver");
    return xo(this, Mt(e));
  }
  getPlainDateTimeFor(e, t = "iso8601") {
    if (!vt(this)) throw new TypeError("invalid receiver");
    return pt(this, Mt(e), dt(t));
  }
  getInstantFor(e, t) {
    if (!vt(this)) throw new TypeError("invalid receiver");
    return rt(this, pn(e), qn(X(t)));
  }
  getPossibleInstantsFor(e) {
    if (!vt(this)) throw new TypeError("invalid receiver");
    const t = pn(e), r = I("%Temporal.Instant%"), o = s(this, Pt);
    if (Yn(o)) {
      const a = an(s(t, M), s(t, R), s(t, Y), s(t, j), s(t, U), s(t, z), s(t, q), s(t, B), s(t, Z));
      if (a === null) throw new RangeError("DateTime outside of supported range");
      const c = on(o);
      return [new r(l.subtract(a, l.BigInt(c)))];
    }
    return function(c, d, u, h, m, f, y, g, p, w) {
      const v = an(d, u, h, m, f, y, g, p, w);
      if (v === null) throw new RangeError("DateTime outside of supported range");
      let T = l.subtract(v, St);
      l.lessThan(T, cr) && (T = v);
      let E = l.add(v, St);
      l.greaterThan(E, Un) && (E = v);
      const D = Wt(c, T), k = Wt(c, E);
      return (D === k ? [D] : [D, k]).map((_) => {
        const C = l.subtract(v, l.BigInt(_)), $ = Za(c, C);
        if (d === $.year && u === $.month && h === $.day && m === $.hour && f === $.minute && y === $.second && g === $.millisecond && p === $.microsecond && w === $.nanosecond) return C;
      }).filter((_) => _ !== void 0);
    }(o, s(t, M), s(t, R), s(t, Y), s(t, j), s(t, U), s(t, z), s(t, q), s(t, B), s(t, Z)).map((a) => new r(a));
  }
  getNextTransition(e) {
    if (!vt(this)) throw new TypeError("invalid receiver");
    const t = Mt(e), r = s(this, Pt);
    if (Yn(r) || r === "UTC") return null;
    let o = s(t, F);
    const i = I("%Temporal.Instant%");
    return o = Va(r, o), o === null ? null : new i(o);
  }
  getPreviousTransition(e) {
    if (!vt(this)) throw new TypeError("invalid receiver");
    const t = Mt(e), r = s(this, Pt);
    if (Yn(r) || r === "UTC") return null;
    let o = s(t, F);
    const i = I("%Temporal.Instant%");
    return o = Po(r, o), o === null ? null : new i(o);
  }
  toString() {
    if (!vt(this)) throw new TypeError("invalid receiver");
    return s(this, Pt);
  }
  toJSON() {
    if (!vt(this)) throw new TypeError("invalid receiver");
    return s(this, Pt);
  }
  static from(e) {
    return ja(Ze(e));
  }
}
Ut(lr, "Temporal.TimeZone"), me("Temporal.TimeZone.prototype.getOffsetNanosecondsFor", lr.prototype.getOffsetNanosecondsFor), me("Temporal.TimeZone.prototype.getPossibleInstantsFor", lr.prototype.getPossibleInstantsFor);
const Al = Object.create;
class wi {
  constructor(e, t, r = "iso8601", o = 1) {
    Fa(this, ee(e), ee(t), dt(r), ee(o));
  }
  get year() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return ro(s(this, b), this);
  }
  get month() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return oo(s(this, b), this);
  }
  get monthCode() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return Tr(s(this, b), this);
  }
  get calendarId() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return Ue(s(this, b));
  }
  get era() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return io(s(this, b), this);
  }
  get eraYear() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return ao(s(this, b), this);
  }
  get daysInMonth() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return so(s(this, b), this);
  }
  get daysInYear() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return lo(s(this, b), this);
  }
  get monthsInYear() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return co(s(this, b), this);
  }
  get inLeapYear() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return uo(s(this, b), this);
  }
  with(e, t) {
    if (!te(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid argument");
    Xn(e);
    const r = X(t), o = s(this, b), i = Me(o, ["month", "monthCode", "year"]);
    let a = G(this, i, []);
    return a = _n(o, a, G(e, i, "partial")), a = G(a, i, []), In(o, a, r);
  }
  add(e, t) {
    if (!te(this)) throw new TypeError("invalid receiver");
    return ta("add", this, e, t);
  }
  subtract(e, t) {
    if (!te(this)) throw new TypeError("invalid receiver");
    return ta("subtract", this, e, t);
  }
  until(e, t) {
    if (!te(this)) throw new TypeError("invalid receiver");
    return Hi("until", this, e, t);
  }
  since(e, t) {
    if (!te(this)) throw new TypeError("invalid receiver");
    return Hi("since", this, e, t);
  }
  equals(e) {
    if (!te(this)) throw new TypeError("invalid receiver");
    const t = or(e);
    for (const r of [M, R, Y])
      if (s(this, r) !== s(t, r)) return !1;
    return Dr(s(this, b), s(t, b));
  }
  toString(e) {
    if (!te(this)) throw new TypeError("invalid receiver");
    return ji(this, gr(X(e)));
  }
  toJSON() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return ji(this);
  }
  toLocaleString(e, t) {
    if (!te(this)) throw new TypeError("invalid receiver");
    return new hn(e, t).format(this);
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.PlainYearMonth");
  }
  toPlainDate(e) {
    if (!te(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("argument should be an object");
    const t = s(this, b), r = Me(t, ["monthCode", "year"]), o = G(this, r, []), i = Me(t, ["day"]);
    let a = _n(t, o, G(e, i, []));
    a = G(a, [.../* @__PURE__ */ new Set([...r, ...i])], []);
    const c = Al(null);
    return c.overflow = "reject", Kt(t, a, c);
  }
  getISOFields() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return { calendar: s(this, b), isoDay: s(this, Y), isoMonth: s(this, R), isoYear: s(this, M) };
  }
  getCalendar() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return er(s(this, b));
  }
  static from(e, t) {
    const r = X(t);
    return te(e) ? (_e(r), ur(s(e, M), s(e, R), s(e, b), s(e, Y))) : or(e, r);
  }
  static compare(e, t) {
    const r = or(e), o = or(t);
    return tn(s(r, M), s(r, R), s(r, Y), s(o, M), s(o, R), s(o, Y));
  }
}
Ut(wi, "Temporal.PlainYearMonth");
const Fl = hn.prototype.resolvedOptions, Sl = Object.create;
class vi {
  constructor(e, t, r = "iso8601") {
    if (arguments.length < 1) throw new TypeError("missing argument: epochNanoseconds is required");
    Sa(this, ar(e), Ze(t), dt(r));
  }
  get calendarId() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Ue(s(this, b));
  }
  get timeZoneId() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return hr(s(this, ie));
  }
  get year() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return ro(s(this, b), se(this));
  }
  get month() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return oo(s(this, b), se(this));
  }
  get monthCode() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Tr(s(this, b), se(this));
  }
  get day() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return br(s(this, b), se(this));
  }
  get hour() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return s(se(this), j);
  }
  get minute() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return s(se(this), U);
  }
  get second() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return s(se(this), z);
  }
  get millisecond() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return s(se(this), q);
  }
  get microsecond() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return s(se(this), B);
  }
  get nanosecond() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return s(se(this), Z);
  }
  get era() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return io(s(this, b), se(this));
  }
  get eraYear() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return ao(s(this, b), se(this));
  }
  get epochSeconds() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = s(this, F);
    return l.toNumber(An(e, At));
  }
  get epochMilliseconds() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = s(this, F);
    return l.toNumber(An(e, bt));
  }
  get epochMicroseconds() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Qr(An(s(this, F), ne));
  }
  get epochNanoseconds() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Qr(s(this, F));
  }
  get dayOfWeek() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Ko(s(this, b), se(this));
  }
  get dayOfYear() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Xo(s(this, b), se(this));
  }
  get weekOfYear() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Qo(s(this, b), se(this));
  }
  get yearOfWeek() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Jo(s(this, b), se(this));
  }
  get hoursInDay() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = se(this), t = I("%Temporal.PlainDateTime%"), r = s(e, M), o = s(e, R), i = s(e, Y), a = new t(r, o, i, 0, 0, 0, 0, 0, 0), c = vn(r, o, i, 0, 0, 0, 1, "reject"), d = new t(c.year, c.month, c.day, 0, 0, 0, 0, 0, 0), u = s(this, ie), h = s(rt(u, a, "compatible"), F), m = s(rt(u, d, "compatible"), F);
    return xt(l.subtract(m, h), Oa);
  }
  get daysInWeek() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return ei(s(this, b), se(this));
  }
  get daysInMonth() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return so(s(this, b), se(this));
  }
  get daysInYear() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return lo(s(this, b), se(this));
  }
  get monthsInYear() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return co(s(this, b), se(this));
  }
  get inLeapYear() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return uo(s(this, b), se(this));
  }
  get offset() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return xo(s(this, ie), s(this, Be));
  }
  get offsetNanoseconds() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return $t(s(this, ie), s(this, Be));
  }
  with(e, t) {
    if (!x(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid zoned-date-time-like");
    Xn(e);
    const r = X(t), o = s(this, b);
    let i = Me(o, ["day", "hour", "microsecond", "millisecond", "minute", "month", "monthCode", "nanosecond", "second", "year"]);
    i.push("offset");
    let a = G(this, i, ["offset"]);
    a = _n(o, a, G(e, i, "partial")), a = G(a, i, ["offset"]);
    const c = qn(r), d = Zr(r, "prefer");
    let { year: u, month: h, day: m, hour: f, minute: y, second: g, millisecond: p, microsecond: w, nanosecond: v } = vr(o, a, r);
    const T = on(a.offset), E = s(this, ie);
    return Se(Vr(u, h, m, f, y, g, p, w, v, "option", T, E, c, d, !1), E, o);
  }
  withPlainDate(e) {
    if (!x(this)) throw new TypeError("invalid receiver");
    const t = ae(e), r = s(t, M), o = s(t, R), i = s(t, Y);
    let a = s(t, b);
    const c = se(this), d = s(c, j), u = s(c, U), h = s(c, z), m = s(c, q), f = s(c, B), y = s(c, Z);
    a = La(s(this, b), a);
    const g = s(this, ie);
    return Se(s(rt(g, new (I("%Temporal.PlainDateTime%"))(r, o, i, d, u, h, m, f, y, a), "compatible"), F), g, a);
  }
  withPlainTime(e) {
    if (!x(this)) throw new TypeError("invalid receiver");
    const t = I("%Temporal.PlainTime%"), r = e === void 0 ? new t() : Zt(e), o = se(this), i = s(o, M), a = s(o, R), c = s(o, Y), d = s(this, b), u = s(r, j), h = s(r, U), m = s(r, z), f = s(r, q), y = s(r, B), g = s(r, Z), p = s(this, ie);
    return Se(s(rt(p, new (I("%Temporal.PlainDateTime%"))(i, a, c, u, h, m, f, y, g, d), "compatible"), F), p, d);
  }
  withTimeZone(e) {
    if (!x(this)) throw new TypeError("invalid receiver");
    const t = Ze(e);
    return Se(s(this, F), t, s(this, b));
  }
  withCalendar(e) {
    if (!x(this)) throw new TypeError("invalid receiver");
    const t = dt(e);
    return Se(s(this, F), s(this, ie), t);
  }
  add(e, t) {
    if (!x(this)) throw new TypeError("invalid receiver");
    return na("add", this, e, t);
  }
  subtract(e, t) {
    if (!x(this)) throw new TypeError("invalid receiver");
    return na("subtract", this, e, t);
  }
  until(e, t) {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Ki("until", this, e, t);
  }
  since(e, t) {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Ki("since", this, e, t);
  }
  round(e) {
    if (!x(this)) throw new TypeError("invalid receiver");
    if (e === void 0) throw new TypeError("options parameter is required");
    const t = typeof e == "string" ? Vn("smallestUnit", e) : X(e), r = Qn(t), o = Ot(t, "halfExpand"), i = ct(t, "smallestUnit", "time", Dn, ["day"]), a = { day: 1, hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[i];
    Jn(r, a, a === 1);
    const c = se(this);
    let d = s(c, M), u = s(c, R), h = s(c, Y), m = s(c, j), f = s(c, U), y = s(c, z), g = s(c, q), p = s(c, B), w = s(c, Z);
    const v = I("%Temporal.PlainDateTime%"), T = s(this, ie), E = s(this, b), D = rt(T, new v(s(c, M), s(c, R), s(c, Y), 0, 0, 0, 0, 0, 0), "compatible"), k = Et(D, T, E, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0), _ = l.subtract(k, l.BigInt(s(D, F)));
    if (l.lessThanOrEqual(_, ve)) throw new RangeError("cannot round a ZonedDateTime in a calendar with zero or negative length days");
    return { year: d, month: u, day: h, hour: m, minute: f, second: y, millisecond: g, microsecond: p, nanosecond: w } = ci(d, u, h, m, f, y, g, p, w, r, i, o, l.toNumber(_)), Se(Vr(d, u, h, m, f, y, g, p, w, "option", $t(T, s(this, Be)), T, "compatible", "prefer", !1), T, s(this, b));
  }
  equals(e) {
    if (!x(this)) throw new TypeError("invalid receiver");
    const t = ir(e), r = s(this, F), o = s(t, F);
    return !!l.equal(l.BigInt(r), l.BigInt(o)) && !!Ua(s(this, ie), s(t, ie)) && Dr(s(this, b), s(t, b));
  }
  toString(e) {
    if (!x(this)) throw new TypeError("invalid receiver");
    const t = X(e), r = gr(t), o = pr(t), i = function(y) {
      return ln(y, "offset", ["auto", "never"], "auto");
    }(t), a = Ot(t, "trunc"), c = ct(t, "smallestUnit", "time", void 0);
    if (c === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const d = function(y) {
      return ln(y, "timeZoneName", ["auto", "never", "critical"], "auto");
    }(t), { precision: u, unit: h, increment: m } = wr(c, o);
    return Ui(this, u, r, d, i, { unit: h, increment: m, roundingMode: a });
  }
  toLocaleString(e, t) {
    if (!x(this)) throw new TypeError("invalid receiver");
    const r = X(t), o = Sl(null);
    if (Pn(o, r, ["timeZone"]), r.timeZone !== void 0) throw new TypeError("ZonedDateTime toLocaleString does not accept a timeZone option");
    o.year === void 0 && o.month === void 0 && o.day === void 0 && o.weekday === void 0 && o.dateStyle === void 0 && o.hour === void 0 && o.minute === void 0 && o.second === void 0 && o.timeStyle === void 0 && o.dayPeriod === void 0 && o.timeZoneName === void 0 && (o.timeZoneName = "short");
    let i = hr(s(this, ie));
    if (Yn(i)) throw new RangeError("toLocaleString does not support offset string time zones");
    i = ni(i), o.timeZone = i;
    const a = new hn(e, o), c = N(Fl, a, []).calendar, d = Ue(s(this, b));
    if (d !== "iso8601" && c !== "iso8601" && c !== d) throw new RangeError(`cannot format ZonedDateTime with calendar ${d} in locale with calendar ${c}`);
    return a.format(s(this, Be));
  }
  toJSON() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Ui(this, "auto");
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.ZonedDateTime");
  }
  startOfDay() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = se(this), t = I("%Temporal.PlainDateTime%"), r = s(this, b), o = new t(s(e, M), s(e, R), s(e, Y), 0, 0, 0, 0, 0, 0, r), i = s(this, ie);
    return Se(s(rt(i, o, "compatible"), F), i, r);
  }
  toInstant() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return new (I("%Temporal.Instant%"))(s(this, F));
  }
  toPlainDate() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Zn(se(this));
  }
  toPlainTime() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return ti(se(this));
  }
  toPlainDateTime() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return se(this);
  }
  toPlainYearMonth() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = s(this, b);
    return In(e, G(this, Me(e, ["monthCode", "year"]), []));
  }
  toPlainMonthDay() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = s(this, b);
    return Bn(e, G(this, Me(e, ["day", "monthCode"]), []));
  }
  getISOFields() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = se(this), t = s(this, ie);
    return { calendar: s(this, b), isoDay: s(e, Y), isoHour: s(e, j), isoMicrosecond: s(e, B), isoMillisecond: s(e, q), isoMinute: s(e, U), isoMonth: s(e, R), isoNanosecond: s(e, Z), isoSecond: s(e, z), isoYear: s(e, M), offset: xo(t, s(this, Be)), timeZone: t };
  }
  getCalendar() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return er(s(this, b));
  }
  getTimeZone() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return ja(s(this, ie));
  }
  static from(e, t) {
    const r = X(t);
    return x(e) ? (qn(r), Zr(r, "reject"), _e(r), Se(s(e, F), s(e, ie), s(e, b))) : ir(e, r);
  }
  static compare(e, t) {
    const r = ir(e), o = ir(t), i = s(r, F), a = s(o, F);
    return l.lessThan(l.BigInt(i), l.BigInt(a)) ? -1 : l.greaterThan(l.BigInt(i), l.BigInt(a)) ? 1 : 0;
  }
}
function se(n) {
  return pt(s(n, ie), s(n, Be), s(n, b));
}
Ut(vi, "Temporal.ZonedDateTime");
var cn = Object.freeze({ __proto__: null, Calendar: ge, Duration: nn, Instant: It, Now: Ds, PlainDate: Ir, PlainDateTime: kr, PlainMonthDay: gi, PlainTime: bn, PlainYearMonth: wi, TimeZone: lr, ZonedDateTime: vi });
const Ll = [It, ge, Ir, kr, nn, gi, bn, lr, wi, vi];
for (const n of Ll) {
  const e = Object.getOwnPropertyDescriptor(n, "prototype");
  (e.configurable || e.enumerable || e.writable) && (e.configurable = !1, e.enumerable = !1, e.writable = !1, Object.defineProperty(n, "prototype", e));
}
const Te = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", jl = {
  january: 1,
  jan: 1,
  j: 1,
  february: 2,
  feb: 2,
  f: 2,
  march: 3,
  mar: 3,
  m: 3,
  april: 4,
  apr: 4,
  a: 4,
  may: 5,
  june: 6,
  jun: 6,
  july: 7,
  jul: 7,
  august: 8,
  aug: 8,
  september: 9,
  sept: 9,
  sep: 9,
  s: 9,
  october: 10,
  oct: 10,
  o: 10,
  november: 11,
  nov: 11,
  n: 11,
  december: 12,
  dec: 12,
  d: 12
}, Ul = {
  sunday: 0,
  sun: 0,
  monday: 1,
  mon: 1,
  tuesday: 2,
  tue: 2,
  tues: 2,
  wednesday: 3,
  wed: 3,
  thursday: 4,
  thu: 4,
  thurs: 4,
  friday: 5,
  fri: 5,
  saturday: 6,
  sat: 6
};
function Ye(n, e = Te) {
  return cn.Instant.fromEpochMilliseconds(n.getTime()).toZonedDateTimeISO(e);
}
function Ce(n) {
  return new Date(n.epochMilliseconds);
}
function Mr(n) {
  return n === 0 ? 7 : n;
}
function Cs(n) {
  const e = n.trim().toLowerCase().replace(/\.$/, "");
  return jl[e] ?? null;
}
function wn(n) {
  const e = n.trim().toLowerCase().replace(/\.$/, "");
  return Ul[e] ?? null;
}
function sa(n) {
  if (!/^\d{2,4}$/.test(n))
    return null;
  const e = Number(n);
  return n.length === 4 ? e : e <= 49 ? 2e3 + e : 1900 + e;
}
function Fr(n) {
  const t = n.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!t)
    return null;
  let r = Number(t[1]);
  const o = t[2] ? Number(t[2]) : 0, i = t[3];
  if (o < 0 || o > 59)
    return null;
  if (i) {
    if (r < 1 || r > 12)
      return null;
    i === "am" ? r = r === 12 ? 0 : r : r = r === 12 ? 12 : r + 12;
  } else if (r > 23)
    return null;
  return { hour: r, minute: o };
}
function la(n) {
  const t = n.trim().toLowerCase().replace(/[.,]+$/g, "").replace(/s$/, "");
  return t === "hour" || t === "hr" || t === "h" ? "hour" : t === "day" || t === "d" ? "day" : t === "week" || t === "wk" || t === "w" ? "week" : t === "month" || t === "mo" || t === "mth" ? "month" : t === "year" || t === "yr" || t === "y" ? "year" : null;
}
function yt(n, e = "day") {
  const t = n.trim().toLowerCase().replace(/[.,]+$/g, "");
  if (!t)
    return null;
  const r = t.match(/^([a-z]+|\d+)([a-z]+)$/i);
  if (r) {
    const c = vo(r[1]), d = la(r[2]);
    if (c && d)
      return { amount: c, unit: d };
  }
  const o = t.split(/\s+/);
  if (o.length === 1) {
    const c = vo(o[0] ?? "");
    return c ? {
      amount: c,
      unit: e
    } : null;
  }
  const i = vo(o[0] ?? ""), a = la(o.slice(1).join(" "));
  return !i || !a ? null : {
    amount: i,
    unit: a
  };
}
function Hn(n, e, t, r = 0, o = 0, i = Te) {
  const a = cn.ZonedDateTime.from({
    timeZone: i,
    year: n,
    month: e,
    day: t,
    hour: r,
    minute: o,
    second: 0,
    millisecond: 0
  });
  return Ce(a);
}
function Io(n) {
  return Ye(n, "UTC").toInstant().toString();
}
function Sr(n, e = Te) {
  const t = Ye(n, e);
  return `${t.year}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
}
function De(n, e, t, r = Te) {
  const o = Ye(n, r);
  return Ce(t === "hour" ? o.add({ hours: e }) : t === "day" ? o.add({ days: e }) : t === "week" ? o.add({ weeks: e }) : t === "month" ? o.add({ months: e }) : o.add({ years: e }));
}
function zl(n, e = Te) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: e
  }).format(n);
}
function ql(n, e, t = Te) {
  const r = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: t
  }), o = r.format(n), i = r.format(e), a = Math.max(0, Math.round((Ht(e, t).getTime() - Ht(n, t).getTime()) / 864e5));
  return a > 0 ? `${o} - ${i} (${a} days)` : `${o} - ${i}`;
}
function Ht(n, e = Te) {
  const t = Ye(n, e).with({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0
  });
  return Ce(t);
}
function jo(n, e, t = Te) {
  const r = Ht(n, t), o = Ye(r, t), a = (Mr(e) - o.dayOfWeek + 7) % 7, c = a === 0 ? 7 : a;
  return Ce(o.add({ days: c }));
}
function _s(n, e, t = Te) {
  const r = Ht(n, t), o = Ye(r, t), i = Mr(e);
  let a = (o.dayOfWeek - i + 7) % 7;
  return a === 0 && (a = 7), Ce(o.subtract({ days: a }));
}
function ca(n, e, t, r, o = Te) {
  const i = Ye(Jr(n, e, t, o), o);
  return Ce(i.add({ days: (r - 1) * 7 }));
}
function da(n, e, t, r = Te) {
  let o = cn.ZonedDateTime.from({
    timeZone: r,
    year: n,
    month: e,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
  o = o.with({ day: o.daysInMonth });
  const i = Mr(t);
  for (; o.dayOfWeek !== i; )
    o = o.subtract({ days: 1 });
  return Ce(o);
}
function ko(n, e, t, r, o = Te) {
  const i = Ye(n, o), a = ca(i.year, e, t, r, o);
  return a.getTime() > n.getTime() ? a : ca(i.year + 1, e, t, r, o);
}
function Bl(n, e, t, r = Te) {
  const o = Ye(n, r), i = da(o.year, e, t, r);
  return i.getTime() > n.getTime() ? i : da(o.year + 1, e, t, r);
}
function Jr(n, e, t, r = Te) {
  let o = cn.ZonedDateTime.from({
    timeZone: r,
    year: n,
    month: e,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
  const i = Mr(t);
  for (; o.dayOfWeek !== i; )
    o = o.add({ days: 1 });
  return Ce(o);
}
function Zl(n, e, t, r = Te) {
  const o = Ye(n, r);
  let i = o.year;
  if (e < o.month && (i += 1), e === o.month) {
    let a = o.add({ days: 1 }).with({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0
    });
    const c = Mr(t);
    for (; a.month === e; ) {
      if (a.dayOfWeek === c)
        return Ce(a);
      a = a.add({ days: 1 });
    }
    i += 1;
  }
  return Jr(i, e, t, r);
}
function mn(n, e, t, r = Te) {
  const o = Ye(n, r);
  let i = o.year, a = cn.ZonedDateTime.from({
    timeZone: r,
    year: i,
    month: e,
    day: t,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
  return a.epochMilliseconds <= o.epochMilliseconds && (i += 1, a = cn.ZonedDateTime.from({
    timeZone: r,
    year: i,
    month: e,
    day: t,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  })), Ce(a);
}
function ua(n) {
  const e = n % 19, t = Math.floor(n / 100), r = n % 100, o = Math.floor(t / 4), i = t % 4, a = Math.floor((t + 8) / 25), c = Math.floor((t - a + 1) / 3), d = (19 * e + t - o - c + 15) % 30, u = Math.floor(r / 4), h = r % 4, m = (32 + 2 * i + 2 * u - d - h) % 7, f = Math.floor((e + 11 * d + 22 * m) / 451), y = Math.floor((d + m - 7 * f + 114) / 31), g = (d + m - 7 * f + 114) % 31 + 1;
  return { month: y, day: g };
}
function Rr(n, e = Te) {
  const t = Ye(n, e);
  let r = t.year, o = ua(r), i = cn.ZonedDateTime.from({
    timeZone: e,
    year: r,
    month: o.month,
    day: o.day,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
  return i.epochMilliseconds <= t.epochMilliseconds && (r += 1, o = ua(r), i = cn.ZonedDateTime.from({
    timeZone: e,
    year: r,
    month: o.month,
    day: o.day,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  })), Ce(i);
}
function Wl(n, e = Te) {
  const t = Ye(n, e);
  let r = t.year, o = Ye(Jr(r, 9, 1, e), e);
  return o.epochMilliseconds <= t.epochMilliseconds && (r += 1, o = Ye(Jr(r, 9, 1, e), e)), Ce(o);
}
function ha(n, e, t = Te) {
  const r = Ye(n, t);
  return e < 1 || e > r.daysInMonth ? null : Ce(
    r.with({
      day: e,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0
    })
  );
}
function Is(n, e, t = Te) {
  const r = Ye(Ht(n, t), t), o = e === "monday" ? 1 : 7, i = (r.dayOfWeek - o + 7) % 7;
  return Ce(r.subtract({ days: i }));
}
function Vl(n, e, t = Te) {
  const r = Is(n, e, t);
  return De(r, 6, "day", t);
}
function Gl(n, e = Te) {
  const t = Ye(n, e).with({
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0
  });
  return Ce(t);
}
function Hl(n, e = Te) {
  const t = Ye(n, e);
  return Ce(
    t.with({
      day: t.daysInMonth,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0
    })
  );
}
function Kl(n, e = Te) {
  const t = Ye(n, e).with({
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0
  });
  return Ce(t);
}
function Xl(n, e = Te) {
  const t = Ye(n, e).with({
    month: 12,
    day: 31,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0
  });
  return Ce(t);
}
function Ql(n, e = Te) {
  const t = Ht(n, e), r = Ye(t, e), o = r.dayOfWeek % 7, i = r.subtract({ days: o }), a = i.subtract({ days: 1 });
  return {
    start: Ce(a),
    end: Ce(i)
  };
}
function Jl(n) {
  let e = 0;
  function t(r) {
    return e += 1, `candidate-${r}-${e}`;
  }
  return {
    createPoint({ date: r, suggestionText: o, confidence: i, source: a, id: c }) {
      return {
        id: c ?? t("point"),
        kind: "point",
        utcIso: Io(r),
        isoDate: Sr(r, n),
        label: zl(r, n),
        confidence: i,
        source: a,
        suggestionText: o
      };
    },
    createRange({ startDate: r, endDate: o, suggestionText: i, confidence: a, source: c }) {
      const d = tt(r), u = tt(o);
      return {
        id: t("range"),
        kind: "range",
        range: {
          startUtcIso: Io(d),
          endUtcIso: Io(u),
          startDate: Sr(d, n),
          endDate: Sr(u, n)
        },
        label: ql(d, u, n),
        confidence: a,
        source: c,
        suggestionText: i
      };
    }
  };
}
function tt(n) {
  return new Date(
    n.getFullYear(),
    n.getMonth(),
    n.getDate(),
    n.getHours(),
    n.getMinutes(),
    0,
    0
  );
}
function ec(n) {
  return n ? n.kind === "point" ? n.isoDate ?? null : n.range ? `${n.range.startDate}/${n.range.endDate}` : null : null;
}
const tc = [
  // anchors
  "today",
  "tomorrow",
  "yesterday",
  "day after tomorrow",
  "day before yesterday",
  // modifiers
  "next",
  "last",
  "past",
  "this",
  "the last",
  "the past",
  // weekdays
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  // months
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
  // holidays
  "christmas",
  "christmas eve",
  "xmas",
  "xmas eve",
  "new year",
  "new year's day",
  "new years",
  "new years day",
  "new year's eve",
  "new years eve",
  "labor day",
  "memorial day",
  "thanksgiving",
  "turkey day",
  "mother's day",
  "mothers day",
  "father's day",
  "fathers day",
  "halloween",
  "valentine's day",
  "valentines day",
  "valentines",
  "july 4th",
  "july 4",
  "4th of july",
  "fourth of july",
  "independence day",
  "easter",
  "easter sunday",
  "easter monday",
  "good friday",
  "palm sunday",
  // units and qualifiers
  "day",
  "days",
  "week",
  "weeks",
  "month",
  "months",
  "year",
  "years",
  "hour",
  "hours",
  "weekend",
  // connectives
  "to",
  "through",
  "until",
  "plus",
  "before",
  "after",
  "of",
  "in",
  "from now",
  "in the past",
  "ago",
  // calendar periods
  "this week",
  "this month",
  "this year",
  "next week",
  "next month",
  "next year",
  "last week",
  "last month",
  "last year",
  // period boundaries
  "end of",
  "end of week",
  "end of month",
  "end of year",
  "end of this week",
  "end of this month",
  "end of next month",
  "end of last month",
  "start of",
  "start of week",
  "start of month",
  "start of year",
  "beginning of",
  "beginning of month",
  "beginning of week"
], nc = ["today", "tomorrow", "next friday", "christmas"], rc = 5, oc = 2;
function Uo(n) {
  if (!n.trim())
    return nc.map((o, i) => ({
      id: `suggestion-${i + 1}`,
      label: o,
      insertText: o,
      kind: "shortcut",
      confidence: 0.5
    }));
  const e = n.toLowerCase(), t = [], r = /* @__PURE__ */ new Set();
  for (const o of tc) {
    const i = ic(e, o);
    if (!i || i.length >= o.length && i.edits === 0)
      continue;
    const a = i.edits === 0 ? n + o.slice(i.length) : n.slice(0, n.length - i.length) + o, c = a.toLowerCase();
    c === e || r.has(c) || (r.add(c), t.push({ insertText: a, overlap: i.length, termLength: o.length, edits: i.edits }));
  }
  return t.sort((o, i) => o.edits !== i.edits ? o.edits - i.edits : i.overlap !== o.overlap ? i.overlap - o.overlap : o.termLength - i.termLength), t.slice(0, rc).map((o, i) => ({
    id: `suggestion-${i + 1}`,
    label: o.insertText,
    insertText: o.insertText,
    kind: "completion",
    confidence: 0.5 + Math.min(o.overlap / 10, 0.4) - o.edits * 0.15
  }));
}
function ic(n, e) {
  const t = Math.min(n.length, e.length);
  for (let r = t; r >= oc; r -= 1) {
    const o = n.length - r - 1;
    if (o >= 0 && !/\s/.test(n.charAt(o)))
      continue;
    const i = n.slice(n.length - r), a = e.slice(0, r);
    let c = 0;
    for (let d = 0; d < r && !(i[d] !== a[d] && (c += 1, c > 1)); d += 1)
      ;
    if (c === 0)
      return { length: r, edits: c };
    if (c === 1 && i[0] === a[0])
      return { length: r, edits: c };
  }
  return null;
}
function Ti(n, e, t) {
  const r = gt(n), o = r.match(/^([0-1]?\d)[/\-.]([0-3]?\d)[/\-.](\d{2,4})(?:\s+([\d:]+(?:\s*(?:am|pm))?))?$/);
  if (o) {
    const c = Number(o[1]), d = Number(o[2]), u = sa(o[3]), h = o[4] ? Fr(o[4]) : null;
    return !u || !ma(u, c, d, t) ? null : {
      year: u,
      month: c,
      day: d,
      hasYear: !0,
      hour: h?.hour ?? 0,
      minute: h?.minute ?? 0
    };
  }
  const i = r.match(/^(today|tomorrow|yesterday)(?:\s+([\d:]+(?:\s*(?:am|pm))?))?$/);
  if (i) {
    const c = i[1] === "yesterday" ? -1 : i[1] === "tomorrow" ? 1 : 0, d = c === 0 ? new Date(e.getTime()) : De(e, c, "day", t), u = i[2] ? Fr(i[2]) : null;
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hasYear: !0,
      hour: u?.hour ?? 0,
      minute: u?.minute ?? 0
    };
  }
  const a = r.match(/^([a-z]+)\s+(\d{1,2}(?:st|nd|rd|th)?)(?:,)?(?:\s+(\d{2,4}))?(?:\s+([\d:]+(?:\s*(?:am|pm))?))?$/);
  if (a) {
    const c = Cs(a[1]), d = Number(Ns(a[2])), u = a[3] ? sa(a[3]) : null, h = a[4] ? Fr(a[4]) : null, m = u ?? e.getFullYear();
    return c === null || !ma(m, c, d, t) ? null : {
      year: u ?? void 0,
      month: c,
      day: d,
      hasYear: !!u,
      hour: h?.hour ?? 0,
      minute: h?.minute ?? 0
    };
  }
  return null;
}
function ma(n, e, t, r) {
  if (e < 1 || e > 12 || t < 1 || t > 31)
    return !1;
  try {
    const o = Hn(n, e, t, 0, 0, r), i = `${n}-${String(e).padStart(2, "0")}-${String(t).padStart(2, "0")}`;
    return Sr(o, r) === i;
  } catch {
    return !1;
  }
}
const ac = [
  {
    aliases: ["christmas", "xmas"],
    resolve: (n, e) => mn(n, 12, 25, e)
  },
  {
    aliases: ["christmas eve", "xmas eve"],
    resolve: (n, e) => mn(n, 12, 24, e)
  },
  {
    aliases: ["new years", "new years day", "new yearsday", "new year", "new year's", "new year's day"],
    resolve: (n, e) => mn(n, 1, 1, e)
  },
  {
    aliases: ["new years eve", "new year's eve", "nye"],
    resolve: (n, e) => mn(n, 12, 31, e)
  },
  {
    aliases: ["labor day"],
    resolve: (n, e) => Wl(n, e)
  },
  {
    aliases: ["memorial day"],
    resolve: (n, e) => Bl(n, 5, 1, e)
  },
  {
    aliases: ["thanksgiving", "thanksgiving day", "turkey day"],
    resolve: (n, e) => ko(n, 11, 4, 4, e)
  },
  {
    aliases: ["mother's day", "mothers day"],
    resolve: (n, e) => ko(n, 5, 0, 2, e)
  },
  {
    aliases: ["father's day", "fathers day"],
    resolve: (n, e) => ko(n, 6, 0, 3, e)
  },
  {
    aliases: ["halloween"],
    resolve: (n, e) => mn(n, 10, 31, e)
  },
  {
    aliases: ["easter", "easter sunday", "easter day"],
    resolve: (n, e) => Rr(n, e)
  },
  {
    aliases: ["good friday"],
    resolve: (n, e) => De(Rr(n, e), -2, "day", e)
  },
  {
    aliases: ["easter monday"],
    resolve: (n, e) => De(Rr(n, e), 1, "day", e)
  },
  {
    aliases: ["palm sunday"],
    resolve: (n, e) => De(Rr(n, e), -7, "day", e)
  },
  {
    aliases: ["valentine's day", "valentines day", "valentines", "valentine's"],
    resolve: (n, e) => mn(n, 2, 14, e)
  },
  {
    aliases: ["july 4th", "july 4", "4th of july", "fourth of july", "independence day"],
    resolve: (n, e) => mn(n, 7, 4, e)
  }
];
function fa(n) {
  return gt(n).replace(/['’]/g, "").replace(/\s+/g, " ").trim();
}
function Yr(n, e, t) {
  const r = fa(n);
  for (const o of ac)
    if (o.aliases.some((i) => fa(i) === r))
      return o.resolve(e, t);
  return null;
}
function En(n, e, t) {
  const r = {
    today: 0,
    tomorrow: 1,
    yesterday: -1,
    "day after tomorrow": 2,
    "the day after tomorrow": 2,
    "day before yesterday": -2,
    "the day before yesterday": -2
  };
  if (n in r) {
    const y = r[n], g = Ht(e, t);
    return {
      kind: "point",
      date: y === 0 ? g : De(g, y, "day", t),
      suggestionText: n
    };
  }
  const o = n.match(/^(today|tomorrow|yesterday)\s+([\d:]+(?:\s*(?:am|pm))?)$/);
  if (o) {
    const y = Fr(o[2]);
    if (!y)
      return null;
    const g = r[o[1]] ?? 0, p = De(Ht(e, t), g, "day", t);
    return {
      kind: "point",
      date: Hn(
        p.getFullYear(),
        p.getMonth() + 1,
        p.getDate(),
        y.hour,
        y.minute,
        t
      ),
      suggestionText: n
    };
  }
  const i = n.match(/^(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)$/);
  if (i) {
    const y = Number(i[1]), g = ha(e, y, t), p = Ht(e, t);
    if (g && g.getTime() >= p.getTime())
      return {
        kind: "point",
        date: g,
        suggestionText: n
      };
    const w = De(p, 1, "month", t), v = ha(w, y, t);
    if (v)
      return {
        kind: "point",
        date: v,
        suggestionText: n
      };
  }
  const a = sc(n, e, t);
  if (a)
    return a;
  const c = n.match(/^next\s+([a-z]+)\s+in\s+([a-z]+)$/);
  if (c) {
    const y = wn(c[1]), g = Cs(c[2]);
    return y === null || g === null ? null : {
      kind: "point",
      date: Zl(e, g, y, t),
      suggestionText: n
    };
  }
  const d = n.match(/^(?:next|this)\s+([a-z]+)$/);
  if (d) {
    const y = wn(d[1]);
    if (y !== null)
      return {
        kind: "point",
        date: jo(e, y, t),
        suggestionText: n
      };
  }
  const u = n.match(/^(?:last|past)\s+([a-z]+)$/);
  if (u) {
    const y = wn(u[1]);
    if (y !== null)
      return {
        kind: "point",
        date: _s(e, y, t),
        suggestionText: n
      };
  }
  const h = wn(n);
  if (h !== null)
    return {
      kind: "point",
      date: jo(e, h, t),
      suggestionText: n
    };
  const m = Ti(n, e, t);
  if (!m)
    return null;
  const f = m.year ?? e.getFullYear();
  return {
    kind: "point",
    date: Hn(f, m.month, m.day, m.hour, m.minute, t),
    suggestionText: n
  };
}
function sc(n, e, t) {
  const r = n.match(/^(.+)\s+weekend$/);
  if (r) {
    const c = Yr(r[1], e, t);
    if (c) {
      const d = Ql(c, t);
      return {
        kind: "range",
        start: d.start,
        end: d.end,
        suggestionText: n
      };
    }
  }
  const o = n.match(/^([a-z]+)\s+(before|after)\s+(.+)$/);
  if (o) {
    const c = wn(o[1]), d = o[2], u = Yr(o[3], e, t);
    if (c !== null && u)
      return {
        kind: "point",
        date: d === "before" ? _s(u, c, t) : jo(u, c, t),
        suggestionText: n
      };
  }
  const i = n.match(/^(.+?)\s+(\d{4})$/);
  if (i) {
    const [, c, d] = i, u = Number.parseInt(d, 10), h = Hn(u - 1, 12, 31, 23, 59, t), m = Yr(c, h, t);
    if (m)
      return {
        kind: "point",
        date: m,
        suggestionText: n
      };
  }
  const a = Yr(n, e, t);
  return a ? {
    kind: "point",
    date: a,
    suggestionText: n
  } : null;
}
function zo(n, e, t) {
  const r = gt(n), o = Ti(n, e, t);
  if (o) {
    const y = o.year ?? e.getFullYear();
    return {
      date: Hn(y, o.month, o.day, o.hour, o.minute, t),
      rollUnit: o.hasYear ? null : "year"
    };
  }
  const i = En(r, e, t);
  if (i) {
    const y = i.kind === "point" ? i.date : i.start, g = cc(r) ? "week" : null;
    return { date: y, rollUnit: g };
  }
  const a = r.match(/^(.+?)(?:\s*\+\s*|\s+plus\s+)(.+)$/);
  if (a) {
    const y = En(gt(a[1]), e, t), g = yt(a[2], "day");
    if (y && g) {
      const p = y.kind === "point" ? y.date : y.end, w = De(p, g.amount, g.unit, t);
      return { date: tt(w), rollUnit: null };
    }
  }
  const c = r.match(/^(.+?)\s+(before|after)\s+(.+)$/);
  if (c) {
    const y = yt(c[1], "day"), g = En(gt(c[3]), e, t);
    if (y && g) {
      const p = g.kind === "point" ? g.date : g.end, w = c[2] === "after" ? 1 : -1, v = De(p, w * y.amount, y.unit, t);
      return { date: tt(v), rollUnit: null };
    }
  }
  const d = r.match(/^(.+)\s+from\s+now$/);
  if (d) {
    const y = yt(d[1], "day");
    if (y) {
      const g = De(e, y.amount, y.unit, t);
      return { date: tt(g), rollUnit: null };
    }
  }
  const u = r.match(/^(.+)\s+in\s+the\s+past$/);
  if (u) {
    const y = yt(u[1], "day");
    if (y) {
      const g = De(e, -y.amount, y.unit, t);
      return { date: tt(g), rollUnit: null };
    }
  }
  const h = r.match(/^(.+)\s+ago$/);
  if (h) {
    const y = yt(h[1], "day");
    if (y) {
      const g = De(e, -y.amount, y.unit, t);
      return { date: tt(g), rollUnit: null };
    }
  }
  const m = r.match(/^in\s+(.+)$/);
  if (m) {
    const y = yt(m[1], "day");
    if (y) {
      const g = De(e, y.amount, y.unit, t);
      return { date: tt(g), rollUnit: null };
    }
  }
  const f = r.match(/^(?:the\s+)?(?:last|past)\s+(.+)$/);
  if (f) {
    const y = yt(f[1], "day");
    if (y) {
      const g = De(e, -y.amount, y.unit, t);
      return { date: tt(g), rollUnit: null };
    }
  }
  return null;
}
function lc(n, e, t, r) {
  const o = gt(e).match(/^([a-z]+)\s+\d/);
  if (!o)
    return null;
  const i = `${o[1]} ${gt(n)}`;
  return zo(i, t, r);
}
function cc(n) {
  if (wn(n) !== null)
    return !0;
  const e = n.match(/^(?:next|this|last|past)\s+([a-z]+)$/);
  return !!(e && wn(e[1]) !== null);
}
function dc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = [" to ", " through ", " until ", " - "];
  for (const a of i) {
    if (!e.includes(a))
      continue;
    const [c, d] = e.split(a, 2);
    if (!c || !d)
      continue;
    const u = zo(c, t, r);
    let h = zo(d, t, r);
    const m = /^\d{1,2}(?:st|nd|rd|th)?$/.test(gt(d));
    if (u && (!h || m)) {
      const g = lc(d, c, t, r);
      g && (h = g);
    }
    if (!u || !h)
      continue;
    let f = u.date, y = h.date;
    if (h.rollUnit && y.getTime() < f.getTime()) {
      const g = h.rollUnit === "year" ? "year" : "week";
      for (; y.getTime() < f.getTime(); )
        y = De(y, 1, g, r);
    }
    if (y.getTime() < f.getTime()) {
      const g = f;
      f = y, y = g;
    }
    return o.createRange({
      startDate: f,
      endDate: y,
      suggestionText: e,
      confidence: 0.96,
      source: "rule"
    });
  }
  return null;
}
function uc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^(.+?)\s+(before|after)\s+(.+)$/);
  if (!i)
    return null;
  const a = yt(i[1], "day");
  if (!a)
    return null;
  const c = En(gt(i[3]), t, r);
  if (!c)
    return null;
  const d = c.kind === "point" ? c.date : c.end, u = i[2] === "after" ? 1 : -1, h = De(
    d,
    u * a.amount,
    a.unit,
    r
  );
  return o.createPoint({
    date: tt(h),
    suggestionText: e,
    confidence: 0.93,
    source: "rule"
  });
}
function hc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^(.+?)(?:\s*\+\s*|\s+plus\s+)(.+)$/);
  if (!i)
    return null;
  const a = gt(i[1]), c = yt(i[2], "day");
  if (!c)
    return null;
  const d = En(a, t, r);
  if (!d)
    return null;
  const u = d.kind === "point" ? d.date : d.end, h = De(u, c.amount, c.unit, r);
  return o.createPoint({
    date: tt(h),
    suggestionText: e,
    confidence: 0.93,
    source: "rule"
  });
}
function mc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^(.+)\s+ago$/);
  if (!i)
    return null;
  const a = yt(i[1], "day");
  if (!a)
    return null;
  const c = De(t, -a.amount, a.unit, r);
  return o.createPoint({
    date: tt(c),
    suggestionText: e,
    confidence: 0.9,
    source: "rule"
  });
}
function fc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^in\s+(.+)$/);
  if (!i)
    return null;
  const a = yt(i[1], "day");
  if (!a)
    return null;
  const c = De(t, a.amount, a.unit, r);
  return o.createPoint({
    date: tt(c),
    suggestionText: e,
    confidence: 0.9,
    source: "rule"
  });
}
function yc(n) {
  const { normalizedInput: e, now: t, timeZone: r, parseContext: o, factory: i } = n, a = e.match(
    /^(start|beginning|end)\s+of\s+(?:the\s+)?(?:(this|next|last|current)\s+)?(week|month|year)$/
  );
  if (!a)
    return null;
  const c = a[1] === "end" ? "end" : "start", d = pc(a[2]), u = a[3], h = ks(t, d, u, r), m = qo(h, u, c, o.weekStart, r);
  return i.createPoint({
    date: m,
    suggestionText: e,
    confidence: 0.95,
    source: "rule"
  });
}
function gc(n) {
  const { normalizedInput: e, now: t, timeZone: r, parseContext: o, factory: i } = n, a = e.match(/^(this|next|last)\s+(week|month|year)$/);
  if (!a)
    return null;
  const c = a[1], d = a[2], u = ks(t, c, d, r), h = qo(u, d, "start", o.weekStart, r), m = qo(u, d, "end", o.weekStart, r);
  return i.createRange({
    startDate: h,
    endDate: m,
    suggestionText: e,
    confidence: 0.95,
    source: "rule"
  });
}
function pc(n) {
  return n === "next" || n === "last" ? n : "this";
}
function ks(n, e, t, r) {
  return e === "this" ? n : De(n, e === "next" ? 1 : -1, t, r);
}
function qo(n, e, t, r, o) {
  return e === "week" ? t === "start" ? Is(n, r, o) : Vl(n, r, o) : e === "month" ? t === "start" ? Gl(n, o) : Hl(n, o) : t === "start" ? Kl(n, o) : Xl(n, o);
}
function wc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^(?:the\s+)?(?:last|past)\s+(.+)$/);
  if (!i)
    return null;
  const a = yt(i[1], "day");
  if (!a)
    return null;
  const c = De(t, -a.amount, a.unit, r);
  return o.createRange({
    startDate: tt(c),
    endDate: tt(t),
    suggestionText: e,
    confidence: 0.9,
    source: "rule"
  });
}
function vc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = En(e, t, r);
  return !i || i.kind !== "range" ? null : o.createRange({
    startDate: i.start,
    endDate: i.end,
    suggestionText: e,
    confidence: 0.92,
    source: "rule"
  });
}
function Tc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^(.+)\s+in\s+the\s+past$/);
  if (!i)
    return null;
  const a = yt(i[1], "day");
  if (!a)
    return null;
  const c = De(t, -a.amount, a.unit, r);
  return o.createPoint({
    date: tt(c),
    suggestionText: e,
    confidence: 0.9,
    source: "rule"
  });
}
function bc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^(.+)\s+from\s+now$/);
  if (!i)
    return null;
  const a = yt(i[1], "day");
  if (!a)
    return null;
  const c = De(t, a.amount, a.unit, r);
  return o.createPoint({
    date: tt(c),
    suggestionText: e,
    confidence: 0.9,
    source: "rule"
  });
}
function Ec(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = En(e, t, r);
  if (i && i.kind === "point")
    return o.createPoint({
      date: i.date,
      suggestionText: i.suggestionText,
      confidence: 0.97,
      source: "rule"
    });
  const a = Ti(e, t, r);
  if (!a)
    return null;
  const c = a.year ?? t.getFullYear(), d = Hn(c, a.month, a.day, a.hour, a.minute, r);
  return o.createPoint({
    date: d,
    suggestionText: e,
    confidence: 0.95,
    source: "rule"
  });
}
class Dc {
  parse(e, t) {
    const r = Ys(e);
    if (!r)
      return Bo({
        rawInput: e,
        status: "idle",
        astType: null,
        valueKind: null,
        candidates: [],
        ambiguityGroups: [],
        selectedCandidateId: null,
        previewLabel: null,
        canonicalValue: null,
        errors: [],
        suggestions: Uo(e)
      });
    const o = Cc(t), i = _c(t), a = Jl(i), c = {
      normalizedInput: r,
      now: o,
      timeZone: i,
      parseContext: t,
      factory: a
    }, d = [
      { rule: dc, kind: "range" },
      { rule: hc, kind: "point" },
      { rule: uc, kind: "point" },
      { rule: fc, kind: "point" },
      { rule: mc, kind: "point" },
      { rule: yc, kind: "point" },
      { rule: gc, kind: "range" },
      { rule: wc, kind: "range" },
      { rule: vc, kind: "range" },
      { rule: Tc, kind: "point" },
      { rule: bc, kind: "point" }
    ];
    for (const { rule: h, kind: m } of d) {
      const f = h(c);
      if (f)
        return ya(e, m, f);
    }
    const u = Ec(c);
    return u ? ya(e, "point", u) : Bo({
      rawInput: e,
      status: "invalid",
      astType: null,
      valueKind: null,
      candidates: [],
      ambiguityGroups: [],
      selectedCandidateId: null,
      previewLabel: null,
      canonicalValue: null,
      errors: ["Unable to parse input."],
      suggestions: Uo(e)
    });
  }
}
function ya(n, e, t) {
  return Bo({
    rawInput: n,
    status: "valid",
    astType: e === "range" ? "range" : "datetime",
    valueKind: e,
    candidates: [t],
    ambiguityGroups: [],
    selectedCandidateId: t.id,
    previewLabel: t.label,
    canonicalValue: ec(t),
    errors: [],
    suggestions: Uo(n)
  });
}
function Bo(n) {
  return {
    status: n.status,
    rawInput: n.rawInput,
    astType: n.astType,
    valueKind: n.valueKind,
    candidates: n.candidates,
    suggestions: n.suggestions,
    ambiguityGroups: n.ambiguityGroups,
    selectedCandidateId: n.selectedCandidateId,
    previewLabel: n.previewLabel,
    canonicalValue: n.canonicalValue,
    errors: n.errors
  };
}
function Cc(n) {
  const e = new Date(n.nowIso);
  return Number.isNaN(e.getTime()) ? /* @__PURE__ */ new Date() : e;
}
function _c(n) {
  return n.timezone || "UTC";
}
const ga = "next Friday", Ms = document.createElement("template");
Ms.innerHTML = `
  <style>
    :host {
      display: inline-block;
      font: inherit;
      color: inherit;
	}

		.field {
			position: relative;
			display: block;
			font-size: 1rem;
			background: #ffffff;
			border: 1px solid #e4e4e7;
			border-radius: 0.9rem;
			padding: 1rem;
		}
    .input {
      font: inherit;
      color: inherit;
      background: transparent;
      border: 0;
      outline: 0;
      padding: 0;
      margin: 0;
      width: 100%;
      min-width: 20ch;
			box-sizing: border-box;
    }
    .ghost {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
			padding: 1rem;
      justify-content: space-between;
      gap: 1rem;
      pointer-events: none;
      font: inherit;
      white-space: pre;
      overflow: hidden;
    }
    .ghost-completion {
      min-width: 0;
      overflow: hidden;
      white-space: pre;
    }
    .ghost-typed {
      color: transparent;
    }
    .ghost-tail {
      opacity: 0.5;
    }
    .ghost-hint {
      margin-left: 0.5em;
      padding: 0.05em 0.35em;
      border: 1px solid currentColor;
      border-radius: 3px;
      font-size: 0.7em;
      font-family: inherit;
      opacity: 0.4;
      vertical-align: middle;
    }
    .ghost-hint[hidden] {
      display: none;
    }
    .ghost-resolution {
      flex: 0 0 auto;
      opacity: 0.5;
    }
    ::slotted([slot="ambiguity"]) {
      margin-top: 0.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
    ::slotted([slot="ambiguity"][hidden]) {
      display: none;
    }
		p {
		line-height: 1.4;
	}
  </style>
  <div class="field" part="field">
    <input class="input" part="input" type="text" autocomplete="off" spellcheck="false" />
    <div class="ghost" part="ghost" aria-live="polite"><span class="ghost-completion"><span class="ghost-typed" aria-hidden="true"></span><span class="ghost-tail"></span><kbd class="ghost-hint" part="hint" hidden>Tab</kbd></span><span class="ghost-resolution"></span></div>
  </div>
	<p>tomorrow · last tuesday · march 14 to 28 · 9 days after christmas<br />Hit <kbd class="ghost-hint">Tab</kbd> to autocomplete.</p>
  <slot name="ambiguity"></slot>
`;
class Ic extends HTMLElement {
  static formAssociated = !0;
  static get observedAttributes() {
    return [
      "value",
      "timezone",
      "locale",
      "week-start",
      "mode",
      "allow-past",
      "placeholder",
      "name",
      "disabled",
      "required"
    ];
  }
  parser = new Dc();
  internals;
  inputElement;
  ghostTypedElement;
  ghostTailElement;
  ghostHintElement;
  ghostResolutionElement;
  ambiguityElement;
  rawInputValue = "";
  committedValue = null;
  parseState = this.createEmptyParseState();
  activeSuggestionIndexValue = 0;
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.shadowRoot?.append(Ms.content.cloneNode(!0));
    const e = this.shadowRoot;
    if (!e)
      throw new Error("Unable to create shadow root.");
    this.inputElement = e.querySelector("input") ?? document.createElement("input"), this.ghostTypedElement = e.querySelector(".ghost-typed") ?? document.createElement("span"), this.ghostTailElement = e.querySelector(".ghost-tail") ?? document.createElement("span"), this.ghostHintElement = e.querySelector(".ghost-hint") ?? document.createElement("kbd"), this.ghostResolutionElement = e.querySelector(".ghost-resolution") ?? document.createElement("span"), this.ambiguityElement = document.createElement("div"), this.ambiguityElement.setAttribute("slot", "ambiguity"), this.ambiguityElement.hidden = !0, this.internals = typeof this.attachInternals == "function" ? this.attachInternals() : null, this.bindEvents();
  }
  connectedCallback() {
    this.ambiguityElement.parentNode !== this && this.append(this.ambiguityElement), this.syncInputPresentation(), this.parseAndRender();
  }
  attributeChangedCallback(e, t, r) {
    if (t !== r) {
      if (e === "placeholder") {
        this.inputElement.placeholder = r ?? ga;
        return;
      }
      if (e === "value") {
        this.committedValue = r, this.internals?.setFormValue(r ?? "");
        return;
      }
      if (e === "disabled") {
        this.inputElement.disabled = this.hasAttribute("disabled");
        return;
      }
      this.parseAndRender();
    }
  }
  get rawInput() {
    return this.rawInputValue;
  }
  set rawInput(e) {
    this.rawInputValue = e, this.syncInputPresentation(), this.parseAndRender(), this.emit("raw-input-change", { rawInput: this.rawInputValue });
  }
  get value() {
    return this.committedValue;
  }
  set value(e) {
    if (this.committedValue = e, e === null) {
      this.removeAttribute("value"), this.internals?.setFormValue("");
      return;
    }
    this.setAttribute("value", e), this.internals?.setFormValue(e);
  }
  get valueKind() {
    return this.parseState.valueKind;
  }
  get status() {
    return this.parseState.status;
  }
  get parseResult() {
    return this.parseState;
  }
  get candidates() {
    return this.parseState.candidates;
  }
  get suggestions() {
    return this.parseState.suggestions;
  }
  get activeSuggestionIndex() {
    return this.activeSuggestionIndexValue;
  }
  focus() {
    this.inputElement.focus();
  }
  clear() {
    this.rawInputValue = "", this.committedValue = null, this.removeAttribute("value"), this.internals?.setFormValue(""), this.activeSuggestionIndexValue = 0, this.syncInputPresentation(), this.parseAndRender(), this.emit("clear", {});
  }
  confirm() {
    if (this.parseState.status !== "valid")
      return this.emit("commit-blocked", {
        reason: this.parseState.status === "ambiguous" ? "ambiguous" : "invalid"
      }), !1;
    const e = this.getSelectedCandidate(), t = this.getCanonicalValue(e);
    return !t || !e ? (this.emit("commit-blocked", { reason: "invalid" }), !1) : (this.committedValue = t, this.setAttribute("value", t), this.internals?.setFormValue(t), this.internals?.setValidity({}), this.emit("value-commit", {
      value: t,
      valueKind: e.kind,
      rawInput: this.rawInputValue,
      candidate: e,
      timezone: this.buildContext().timezone
    }), !0);
  }
  acceptSuggestion(e = this.activeSuggestionIndexValue) {
    const t = this.parseState.suggestions[e];
    return !t || t.insertText === gt(this.rawInputValue) ? !1 : (this.rawInputValue = t.insertText, this.activeSuggestionIndexValue = e, this.syncInputPresentation(), this.emit("suggestion-accept", {
      suggestion: t,
      rawInput: this.rawInputValue
    }), this.emit("raw-input-change", { rawInput: this.rawInputValue }), this.parseAndRender(), !0);
  }
  cycleSuggestion(e) {
    if (!this.parseState.suggestions.length)
      return;
    const t = this.parseState.suggestions.length;
    this.activeSuggestionIndexValue = (this.activeSuggestionIndexValue + e + t) % t, this.renderGhost(), this.emit("suggestions-change", {
      suggestions: this.parseState.suggestions,
      activeSuggestionIndex: this.activeSuggestionIndexValue
    });
  }
  resolveAmbiguity(e, t) {
    const r = this.parseState.ambiguityGroups.find((a) => a.id === e), o = r?.options.find((a) => a.id === t);
    if (!r || !o)
      return;
    const i = this.parseState.candidates.find((a) => a.id === o.candidateId);
    i && (this.parseState = {
      ...this.parseState,
      status: "valid",
      selectedCandidateId: i.id,
      ambiguityGroups: [],
      previewLabel: i.label,
      canonicalValue: this.getCanonicalValue(i)
    }, this.syncLiveValue(), this.renderAll(), this.emit("ambiguity-change", {
      groups: this.parseState.ambiguityGroups,
      unresolvedCount: this.parseState.ambiguityGroups.length
    }), this.emit("parse-change", {
      status: this.parseState.status,
      parseResult: this.parseState
    }));
  }
  setContext(e) {
    e.timezone && this.setAttribute("timezone", e.timezone), e.locale && this.setAttribute("locale", e.locale), e.weekStart && this.setAttribute("week-start", e.weekStart), typeof e.productRules?.allowPast == "boolean" && this.toggleAttribute("allow-past", e.productRules.allowPast), this.parseAndRender();
  }
  bindEvents() {
    this.inputElement.addEventListener("input", () => {
      this.rawInputValue = this.inputElement.value, this.emit("raw-input-change", { rawInput: this.rawInputValue }), this.parseAndRender();
    }), this.inputElement.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault(), this.cycleSuggestion(1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault(), this.cycleSuggestion(-1);
        return;
      }
      if (e.key === "Tab" && !e.shiftKey && this.isCaretAtInputEnd() && this.hasCompletionTail()) {
        this.acceptSuggestion() && e.preventDefault();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault(), this.confirm();
        return;
      }
      e.key === "Escape" && (this.activeSuggestionIndexValue = 0, this.renderGhost());
    });
  }
  parseAndRender() {
    this.parseState = this.parser.parse(this.rawInputValue, this.buildContext()), this.activeSuggestionIndexValue = 0, this.syncLiveValue(), this.renderAll(), this.emit("parse-change", {
      status: this.parseState.status,
      parseResult: this.parseState
    }), this.emit("suggestions-change", {
      suggestions: this.parseState.suggestions,
      activeSuggestionIndex: this.activeSuggestionIndexValue
    }), this.emit("ambiguity-change", {
      groups: this.parseState.ambiguityGroups,
      unresolvedCount: this.parseState.ambiguityGroups.length
    }), this.syncValidity();
  }
  renderAll() {
    this.renderGhost(), this.renderAmbiguityChips();
  }
  renderGhost() {
    this.ghostTypedElement.textContent = this.rawInputValue;
    const e = this.computeCompletionTail();
    this.ghostTailElement.textContent = e, this.ghostHintElement.hidden = e.length === 0, this.ghostResolutionElement.textContent = this.parseState.status === "valid" ? this.parseState.previewLabel ?? "" : "";
  }
  computeCompletionTail() {
    const e = gt(this.rawInputValue), t = this.parseState.suggestions[this.activeSuggestionIndexValue];
    return !t || !e || !t.insertText.startsWith(e) || t.insertText === e ? "" : t.insertText.slice(e.length);
  }
  hasCompletionTail() {
    return this.computeCompletionTail().length > 0;
  }
  renderAmbiguityChips() {
    if (this.ambiguityElement.replaceChildren(), !this.parseState.ambiguityGroups.length) {
      this.ambiguityElement.hidden = !0;
      return;
    }
    this.ambiguityElement.hidden = !1, this.parseState.ambiguityGroups.forEach((e) => {
      e.options.forEach((t) => {
        const r = document.createElement("button");
        r.type = "button", r.textContent = t.label, r.addEventListener("click", () => {
          this.resolveAmbiguity(e.id, t.id);
        }), this.ambiguityElement.append(r);
      });
    });
  }
  syncInputPresentation() {
    this.inputElement.value !== this.rawInputValue && (this.inputElement.value = this.rawInputValue), this.inputElement.placeholder = this.getAttribute("placeholder") ?? ga, this.inputElement.disabled = this.hasAttribute("disabled");
  }
  createEmptyParseState() {
    return {
      status: "idle",
      rawInput: "",
      astType: null,
      valueKind: null,
      candidates: [],
      suggestions: [],
      ambiguityGroups: [],
      selectedCandidateId: null,
      previewLabel: null,
      canonicalValue: null,
      errors: []
    };
  }
  buildContext() {
    return {
      nowIso: (/* @__PURE__ */ new Date()).toISOString(),
      timezone: this.getAttribute("timezone") ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC",
      locale: this.getAttribute("locale") ?? navigator.language ?? "en-US",
      weekStart: this.getAttribute("week-start") === "monday" ? "monday" : "sunday",
      productRules: {
        allowPast: this.hasAttribute("allow-past"),
        defaultTime: { hour: 9, minute: 0 },
        timeOnlyPolicy: "today_if_future_else_tomorrow"
      }
    };
  }
  getSelectedCandidate() {
    return this.parseState.candidates.length ? this.parseState.selectedCandidateId ? this.parseState.candidates.find(
      (e) => e.id === this.parseState.selectedCandidateId
    ) ?? null : this.parseState.candidates[0] ?? null : null;
  }
  getCanonicalValue(e) {
    return e ? e.kind === "point" ? e.isoDate ?? null : e.range ? `${e.range.startDate}/${e.range.endDate}` : null : null;
  }
  isCaretAtInputEnd() {
    return this.inputElement.selectionStart === this.inputElement.value.length;
  }
  syncLiveValue() {
    const e = this.getSelectedCandidate(), t = this.parseState.status === "valid" ? this.getCanonicalValue(e) : null;
    t !== this.committedValue && (this.committedValue = t, t === null ? (this.removeAttribute("value"), this.internals?.setFormValue("")) : (this.setAttribute("value", t), this.internals?.setFormValue(t)), this.emit("value-change", {
      value: t,
      valueKind: e?.kind ?? null,
      rawInput: this.rawInputValue,
      candidate: e
    }));
  }
  syncValidity() {
    if (this.internals) {
      if (this.hasAttribute("required") && this.parseState.status !== "valid") {
        this.internals.setValidity(
          {
            customError: !0
          },
          "Please enter a valid date phrase.",
          this.inputElement
        );
        return;
      }
      this.internals.setValidity({});
    }
  }
  emit(e, t) {
    this.dispatchEvent(
      new CustomEvent(e, {
        bubbles: !0,
        composed: !0,
        detail: t
      })
    );
  }
}
customElements.get("hot-date") || customElements.define("hot-date", Ic);
export {
  Ic as HotDateElement
};
