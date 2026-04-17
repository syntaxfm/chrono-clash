const ks = {
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
}, Ei = {
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
}, ga = [
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
], Ms = new Set(ga), Os = 4;
function Ht(n) {
  return n.trim().toLowerCase().replace(/\s+/g, " ");
}
function Rs(n) {
  const e = Ht(n);
  if (!e)
    return "";
  const t = e.split(" "), r = [];
  for (const o of t) {
    const i = o.replace(/[.,]+$/g, ""), a = Ei[o] ?? Ei[i];
    if (a) {
      r.push(a);
      continue;
    }
    r.push(Ys(i));
  }
  return r.join(" ");
}
function $s(n, e) {
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
function Ys(n) {
  if (n.length < Os || Ms.has(n))
    return n;
  for (const e of ga)
    if (!(Math.abs(e.length - n.length) > 1) && $s(n, e) === 1)
      return e;
  return n;
}
function xs(n) {
  return n.replace(/(\d+)(st|nd|rd|th)$/i, "$1");
}
function bo(n) {
  const e = Ht(n);
  return /^\d+$/.test(e) ? Number(e) : ks[e] ?? null;
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
    let f = 12 <= u ? 0 : c << 20 + u, g = 20 + u;
    for (0 < m && 0 < d && (d--, c = e.__digit(d), h |= c >>> 30 - m, f = c << m + 2, g = m + 2); 0 < g && 0 < d; ) d--, c = e.__digit(d), f |= 30 <= g ? c << g - 30 : c >>> 30 - g, g -= 30;
    const y = l.__decideRounding(e, g, d, c);
    if ((y === 1 || y === 0 && (1 & f) == 1) && (f = f + 1 >>> 0, f === 0 && (h++, h >>> 20 != 0 && (h = 0, a++, 1023 < a)))) return e.sign ? -1 / 0 : 1 / 0;
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
    const h = d * c + u >>> l.__kBitsPerCharTableShift, m = new l(0 | (h + 29) / 30, !1), f = 10 > t ? t : 10, g = 10 < t ? t - 10 : 0;
    if (t & t - 1) {
      m.__initializeDigits();
      let y = !1, p = 0;
      do {
        let w = 0, v = 1;
        for (; ; ) {
          let E;
          if (a - 48 >>> 0 < f) E = a - 48;
          else if ((32 | a) - 97 >>> 0 < g) E = (32 | a) - 87;
          else {
            y = !0;
            break;
          }
          const D = v * t;
          if (1073741823 < D) break;
          if (v = D, w = w * t + E, p++, ++i === o) {
            y = !0;
            break;
          }
          a = e.charCodeAt(i);
        }
        u = 30 * l.__kBitsPerCharTableMultiplier - 1;
        const T = 0 | (d * p + u >>> l.__kBitsPerCharTableShift) / 30;
        m.__inplaceMultiplyAdd(v, w, T);
      } while (!y);
    } else {
      d >>= l.__kBitsPerCharTableShift;
      const y = [], p = [];
      let w = !1;
      do {
        let v = 0, T = 0;
        for (; ; ) {
          let E;
          if (a - 48 >>> 0 < f) E = a - 48;
          else if ((32 | a) - 97 >>> 0 < g) E = (32 | a) - 87;
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
        y.push(v), p.push(T);
      } while (!w);
      l.__fillFromParts(m, y, p);
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
    let m = u - 1, f = 0, g = 0;
    for (let p = 0; p < r - 1; p++) {
      const w = e.__digit(p), v = (f | w << g) & a;
      h[m--] = l.__kConversionChars[v];
      const T = i - g;
      for (f = w >>> T, g = 30 - T; g >= i; ) h[m--] = l.__kConversionChars[f & a], f >>>= i, g -= i;
    }
    const y = (f | c << g) & a;
    for (h[m--] = l.__kConversionChars[y], f = c >>> i - g; f !== 0; ) h[m--] = l.__kConversionChars[f & a], f >>>= i;
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
    const g = h.__unsignedDigit(0);
    if (h.length === 1 && 32767 >= g) {
      m = new l(e.length, !1), m.__initializeDigits();
      let p = 0;
      for (let w = 2 * e.length - 1; 0 <= w; w--) {
        const v = p << 15 | e.__halfDigit(w);
        m.__setHalfDigit(w, 0 | v / g), p = 0 | v % g;
      }
      f = p.toString(t);
    } else {
      const p = l.__absoluteDivLarge(e, h, !0, !0);
      m = p.quotient;
      const w = p.remainder.__trim();
      f = l.__toStringGeneric(w, t, !0);
    }
    m.__trim();
    let y = l.__toStringGeneric(m, t, !0);
    for (; f.length < u; ) f = "0" + f;
    return r === !1 && e.sign && (y = "-" + y), y + f;
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
    const g = 20, y = 29 - d;
    if (y !== (0 | (u - 1) % 30)) throw new Error("implementation bug");
    let p, w = 0;
    if (20 > y) {
      const v = g - y;
      w = v + 32, p = m >>> v, m = m << 32 - v | f >>> v, f <<= 32 - v;
    } else if (y === 20) w = 32, p = m, m = f, f = 0;
    else {
      const v = y - g;
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
      const m = e.__digit(h), f = 32767 & m, g = m >>> 15, y = l.__imul(f, i), p = l.__imul(f, a), w = l.__imul(g, i), v = l.__imul(g, a);
      u += d + y + c, c = u >>> 30, u &= 1073741823, u += ((32767 & p) << 15) + ((32767 & w) << 15), c += u >>> 30, d = v + (p >>> 15) + (w >>> 15), r.__setDigit(o, 1073741823 & u);
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
      const u = this.__digit(d), h = 32767 & u, m = u >>> 15, f = l.__imul(h, o), g = l.__imul(h, i), y = l.__imul(m, o), p = l.__imul(m, i);
      let w = c + f + a;
      a = w >>> 30, w &= 1073741823, w += ((32767 & g) << 15) + ((32767 & y) << 15), a += w >>> 30, c = p + (g >>> 15) + (y >>> 15), this.__setDigit(d, 1073741823 & w);
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
    let g = 0;
    for (let y, p = c; 0 <= p; p--) {
      y = 32767;
      const w = m.__halfDigit(p + i);
      if (w !== f) {
        const T = (w << 15 | m.__halfDigit(p + i - 1)) >>> 0;
        y = 0 | T / f;
        let E = 0 | T % f;
        const D = t.__halfDigit(i - 2), k = m.__halfDigit(p + i - 2);
        for (; l.__imul(y, D) >>> 0 > (E << 16 | k) >>> 0 && (y--, E += f, !(32767 < E)); ) ;
      }
      l.__internalMultiplyAdd(t, y, 0, a, u);
      let v = m.__inplaceSub(u, p, i + 1);
      v !== 0 && (v = m.__inplaceAdd(t, p, i), m.__setHalfDigit(p + i, 32767 & m.__halfDigit(p + i) + v), y--), r && (1 & p ? g = y << 15 : d.__setDigit(p >>> 1, g | y));
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
        const g = (h >>> 15) - (m >>> 15) - o;
        o = 1 & g >>> 15, this.__setDigit(t + i, (32767 & g) << 15 | 32767 & f);
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
      for (let g = 0; g < f; g++) {
        const y = e.__digit(g + a + 1);
        h.__setDigit(g, 1073741823 & y << 30 - c | m), m = y >>> c;
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
    for (const g = o(d, t.length); c < g; c++) {
      const y = 0 - t.__digit(c) - u;
      u = 1 & y >>> 30, a.__setDigit(c, 1073741823 & y);
    }
    for (; c < d; c++) a.__setDigit(c, 0 | 1073741823 & -u);
    let h = d < t.length ? t.__digit(d) : 0;
    const m = e % 30;
    let f;
    if (m == 0) f = 0 - h - u, f &= 1073741823;
    else {
      const g = 32 - m;
      h = h << g >>> g;
      const y = 1 << 32 - g;
      f = y - h - u, f &= y - 1;
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
const Ro = {};
function jt(n, e) {
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
  if (Ro[t] !== void 0) throw new Error(`intrinsic ${n} already exists`);
  Ro[t] = e;
}
function I(n) {
  return Ro[n];
}
var Di, Ci;
const F = "slot-epochNanoSeconds", xt = "slot-timezone-identifier", M = "slot-year", $ = "slot-month", Y = "slot-day", j = "slot-hour", U = "slot-minute", z = "slot-second", q = "slot-millisecond", B = "slot-microsecond", Z = "slot-nanosecond", b = "slot-calendar", ya = "slot-date-brand", pa = "slot-year-month-brand", wa = "slot-month-day-brand", Be = "slot-cached-instant", ie = "slot-time-zone", Ve = "slot-years", Ne = "slot-months", ot = "slot-weeks", Ge = "slot-days", He = "slot-hours", Ke = "slot-minutes", Xe = "slot-seconds", Qe = "slot-milliseconds", Je = "slot-microseconds", et = "slot-nanoseconds", he = "slot-calendar-identifier", va = /* @__PURE__ */ new WeakMap(), $o = Symbol.for("@@Temporal__GetSlots");
(Di = globalThis)[$o] || (Di[$o] = function(e) {
  return va.get(e);
});
const qo = globalThis[$o], Yo = Symbol.for("@@Temporal__CreateSlots");
(Ci = globalThis)[Yo] || (Ci[Yo] = function(e) {
  va.set(e, /* @__PURE__ */ Object.create(null));
});
const Ut = globalThis[Yo];
function Pe(n, ...e) {
  if (!n || typeof n != "object") return !1;
  const t = qo(n);
  return !!t && e.every((r) => r in t);
}
function s(n, e) {
  const t = qo(n)?.[e];
  if (t === void 0) throw new TypeError(`Missing internal slot ${e}`);
  return t;
}
function W(n, e, t) {
  const r = qo(n);
  if (r === void 0) throw new TypeError("Missing slots for the given container");
  if (r[e]) throw new TypeError(`${e} already has set`);
  r[e] = t;
}
const _i = /\.[-A-Za-z_]|\.\.[-A-Za-z._]{1,12}|\.[-A-Za-z_][-A-Za-z._]{0,12}|[A-Za-z_][-A-Za-z._]{0,13}/, fr = new RegExp("(?:" + [`(?:${_i.source})(?:\\/(?:${_i.source}))*`, "Etc/GMT(?:0|[-+]\\d{1,2})", "GMT[-+]?0", "EST5EDT", "CST6CDT", "MST7MDT", "PST8PDT", /(?:[+\u2212-][0-2][0-9](?::?[0-5][0-9](?::?[0-5][0-9](?:[.,]\d{1,9})?)?)?)/.source].join("|") + ")"), Ta = /(?:[+\u2212-]\d{6}|\d{4})/, jr = /(?:0[1-9]|1[0-2])/, xo = /(?:0[1-9]|[12]\d|3[01])/, Ps = new RegExp(`(${Ta.source})(?:-(${jr.source})-(${xo.source})|(${jr.source})(${xo.source}))`), ba = /(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?|(\d{2})(?:(\d{2})(?:[.,](\d{1,9}))?)?)?/, Ea = /([+\u2212-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\d{1,9}))?)?)?/, Da = new RegExp(`([zZ])|${Ea.source}?`), dn = /\[(!)?([a-z_][a-z0-9_-]*)=([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)\]/g, Ns = new RegExp([`^${Ps.source}`, `(?:(?:T|\\s+)${ba.source}(?:${Da.source})?)?`, `(?:\\[!?(${fr.source})\\])?`, `((?:${dn.source})*)$`].join(""), "i"), As = new RegExp([`^T?${ba.source}`, `(?:${Da.source})?`, `(?:\\[!?${fr.source}\\])?`, `((?:${dn.source})*)$`].join(""), "i"), Fs = new RegExp(`^(${Ta.source})-?(${jr.source})(?:\\[!?${fr.source}\\])?((?:${dn.source})*)$`), Ss = new RegExp(`^(?:--)?(${jr.source})-?(${xo.source})(?:\\[!?${fr.source}\\])?((?:${dn.source})*)$`), Eo = /(\d+)(?:[.,](\d{1,9}))?/, Ls = new RegExp(`(?:${Eo.source}H)?(?:${Eo.source}M)?(?:${Eo.source}S)?`), js = new RegExp(`^([+−-])?P${/(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/.source}(?:T(?!$)${Ls.source})?$`, "i"), Us = Array.prototype.includes, Ca = Array.prototype.push, _a = globalThis.Intl.DateTimeFormat, zs = Math.min, qs = Math.max, le = Math.abs, lt = Math.floor, Sn = Math.sign, yn = Math.trunc, no = Number.isNaN, tt = Number.isFinite, Bs = Number, gr = String, Zs = Number.MAX_SAFE_INTEGER, We = Object.create, Ws = Object.getOwnPropertyDescriptor, ro = Reflect.apply, Vs = Reflect.ownKeys, ve = l.BigInt(0), Hn = l.BigInt(1), Pt = l.BigInt(60), Ia = l.BigInt(24), ne = l.BigInt(1e3), vt = l.BigInt(1e6), Nt = l.BigInt(1e9), Gs = l.BigInt(-1), ka = l.multiply(l.BigInt(3600), Nt), Ma = l.multiply(Pt, Nt), Ft = l.multiply(ka, Ia), cr = l.multiply(l.BigInt(-86400), l.BigInt(1e17)), Ln = l.multiply(l.BigInt(86400), l.BigInt(1e17)), Ur = -271821, zr = 275760, $n = l.multiply(l.BigInt(-388152), l.BigInt(1e13)), Hs = l.multiply(Ft, l.BigInt(3660)), Oa = l.multiply(Ft, l.BigInt(366)), Ra = l.multiply(Ft, l.BigInt(14)), Ks = ["iso8601", "hebrew", "islamic", "islamic-umalqura", "islamic-tbla", "islamic-civil", "islamic-rgsa", "islamicc", "persian", "ethiopic", "ethioaa", "coptic", "chinese", "dangi", "roc", "indian", "buddhist", "japanese", "gregory"];
function wt(n) {
  return l.equal(n, ve);
}
function oe(n, e) {
  const t = n[e];
  if (t !== void 0) return t;
}
function N(n, e, t) {
  const r = arguments.length > 2 ? t : [];
  return ro(n, e, r);
}
function ce(n) {
  return typeof n == "object" && n !== null || typeof n == "function";
}
function jn(n) {
  if (typeof n == "bigint") throw new TypeError("Cannot convert BigInt to number");
  return Bs(n);
}
function _e(n) {
  const e = jn(n);
  if (no(e) || e === 0) return 0;
  if (!tt(e)) return e;
  const t = lt(le(e));
  return t === 0 ? 0 : Sn(e) * t;
}
function yt(n) {
  if (typeof n != "number" || no(n) || !tt(n)) return !1;
  const e = le(n);
  return lt(e) === e;
}
function rt(n) {
  if (typeof n == "symbol") throw new TypeError("Cannot convert a Symbol value to a String");
  return gr(n);
}
function ee(n) {
  const e = jn(n);
  if (e === 0) return 0;
  if (no(e) || !tt(e)) throw new RangeError("invalid number value");
  const t = yn(e);
  return t === 0 ? 0 : t;
}
function Ii(n, e) {
  const t = ee(n);
  if (t <= 0)
    throw e !== void 0 ? new RangeError(`property '${e}' cannot be a a number less than one`) : new RangeError("Cannot convert a number less than one to a positive integer");
  return t;
}
function xe(n) {
  const e = jn(n);
  if (!tt(e)) throw new RangeError("infinity is out of range");
  if (!yt(e)) throw new RangeError(`unsupported fractional value ${n}`);
  return e === 0 ? 0 : e;
}
function Ee(n, e) {
  return { quotient: l.divide(n, e), remainder: l.remainder(n, e) };
}
function qr(n) {
  return l.lessThan(n, ve);
}
function ki(n) {
  return wt(n) ? 0 : qr(n) ? -1 : 1;
}
function It(n) {
  return l.lessThan(n, ve) ? l.multiply(n, Gs) : n;
}
const Mi = /* @__PURE__ */ new Map([["year", ee], ["month", Ii], ["monthCode", rt], ["day", Ii], ["hour", ee], ["minute", ee], ["second", ee], ["millisecond", ee], ["microsecond", ee], ["nanosecond", ee], ["years", xe], ["months", xe], ["weeks", xe], ["days", xe], ["hours", xe], ["minutes", xe], ["seconds", xe], ["milliseconds", xe], ["microseconds", xe], ["nanoseconds", xe], ["era", rt], ["eraYear", _e], ["offset", rt]]), Xs = /* @__PURE__ */ new Map([["hour", 0], ["minute", 0], ["second", 0], ["millisecond", 0], ["microsecond", 0], ["nanosecond", 0]]), yr = [["years", "year", "date"], ["months", "month", "date"], ["weeks", "week", "date"], ["days", "day", "date"], ["hours", "hour", "time"], ["minutes", "minute", "time"], ["seconds", "second", "time"], ["milliseconds", "millisecond", "time"], ["microseconds", "microsecond", "time"], ["nanoseconds", "nanosecond", "time"]], Br = new Map(yr.map((n) => [n[0], n[1]])), Qs = new Map(yr.map(([n, e]) => [e, n])), Oi = yr.map(([, n]) => n), Ri = Array.from(Br.keys()).sort(), $i = /* @__PURE__ */ new Map();
function $a(n) {
  let e = $i.get(n);
  return e === void 0 && (e = new _a("en-us", { timeZone: gr(n), hour12: !1, era: "short", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }), $i.set(n, e)), e;
}
function Yi(n) {
  if (n == null) throw new TypeError(`Expected object not ${n}`);
  return Object(n);
}
function Yn(n, e, t, r) {
  if (e == null) return;
  const o = Vs(e);
  for (const i of o) if (!t.some((a) => Object.is(a, i)) && Object.prototype.propertyIsEnumerable.call(e, i)) {
    const a = e[i];
    if (r && r.some((c) => Object.is(c, a))) continue;
    n[i] = a;
  }
}
function Re(n) {
  return Pe(n, F) && !Pe(n, ie, b);
}
function pt(n) {
  return Pe(n, xt);
}
function ge(n) {
  return Pe(n, he);
}
function pe(n) {
  return Pe(n, Ve, Ne, Ge, He, Ke, Xe, Qe, Je, et);
}
function K(n) {
  return Pe(n, ya);
}
function we(n) {
  return Pe(n, j, U, z, q, B, Z) && !Pe(n, M, $, Y);
}
function L(n) {
  return Pe(n, M, $, Y, j, U, z, q, B, Z);
}
function te(n) {
  return Pe(n, pa);
}
function Ye(n) {
  return Pe(n, wa);
}
function x(n) {
  return Pe(n, F, ie, b);
}
function Kn(n) {
  if (Pe(n, b) || Pe(n, ie)) throw new TypeError("with() does not support a calendar or timeZone property");
  if (we(n)) throw new TypeError("with() does not accept Temporal.PlainTime, use withPlainTime() instead");
  if (n.calendar !== void 0) throw new TypeError("with() does not support a calendar property");
  if (n.timeZone !== void 0) throw new TypeError("with() does not support a timeZone property");
}
function Js(n) {
  const { ianaName: e, offset: t, z: r } = function(i) {
    if (new RegExp(`^${fr.source}$`, "i").test(i)) return { ianaName: i };
    try {
      const a = zt(i);
      if (a.z || a.offset || a.ianaName) return a;
    } catch {
    }
    throw new RangeError(`Invalid time zone: ${i}`);
  }(n);
  return e ? ei(e) : r ? "UTC" : yo(an(t));
}
function Bo(n, e) {
  return e === "never" ? "" : Zo(Ue(n), e);
}
function Zo(n, e) {
  return e === "never" || e === "auto" && n === "iso8601" ? "" : `[${e === "critical" ? "!" : ""}u-ca=${n}]`;
}
function zt(n) {
  const e = Ns.exec(n);
  if (!e) throw new RangeError(`invalid ISO 8601 string: ${n}`);
  let t = e[1];
  if (t[0] === "−" && (t = `-${t.slice(1)}`), t === "-000000") throw new RangeError(`invalid ISO 8601 string: ${n}`);
  const r = _e(t), o = _e(e[2] || e[4]), i = _e(e[3] || e[5]), a = _e(e[6]), c = e[6] !== void 0, d = _e(e[7] || e[10]);
  let u = _e(e[8] || e[11]);
  u === 60 && (u = 59);
  const h = (e[9] || e[12]) + "000000000", m = _e(h.slice(0, 3)), f = _e(h.slice(3, 6)), g = _e(h.slice(6, 9));
  let y, p = !1;
  if (e[13]) y = void 0, p = !0;
  else if (e[14] && e[15]) {
    const E = e[14] === "-" || e[14] === "−" ? "-" : "+", D = e[15] || "00", k = e[16] || "00", _ = e[17] || "00";
    let C = e[18] || "0";
    if (y = `${E}${D}:${k}`, +C) {
      for (; C.endsWith("0"); ) C = C.slice(0, -1);
      y += `:${_}.${C}`;
    } else +_ && (y += `:${_}`);
    y === "-00:00" && (y = "+00:00");
  }
  const w = e[19], v = e[20];
  let T;
  for (const [, E, D, k] of v.matchAll(dn)) if (D === "u-ca") T === void 0 && (T = k);
  else if (E === "!") throw new RangeError(`Unrecognized annotation: !${D}=${k}`);
  return ri(r, o, i, a, d, u, m, f, g), { year: r, month: o, day: i, hasTime: c, hour: a, minute: d, second: u, millisecond: m, microsecond: f, nanosecond: g, ianaName: w, offset: y, z: p, calendar: T };
}
function Wo(n) {
  const e = Fs.exec(n);
  let t, r, o, i;
  if (e) {
    let a = e[1];
    if (a[0] === "−" && (a = `-${a.slice(1)}`), a === "-000000") throw new RangeError(`invalid ISO 8601 string: ${n}`);
    t = _e(a), r = _e(e[2]);
    const c = e[3];
    for (const [, d, u, h] of c.matchAll(dn)) if (u === "u-ca") o === void 0 && (o = h);
    else if (d === "!") throw new RangeError(`Unrecognized annotation: !${u}=${h}`);
    if (o !== void 0 && o !== "iso8601") throw new RangeError("YYYY-MM format is only valid with iso8601 calendar");
  } else {
    let a;
    if ({ year: t, month: r, calendar: o, day: i, z: a } = zt(n), a) throw new RangeError("Z designator not supported for PlainYearMonth");
  }
  return { year: t, month: r, calendar: o, referenceISODay: i };
}
function Vo(n) {
  const e = Ss.exec(n);
  let t, r, o, i;
  if (e) {
    t = _e(e[1]), r = _e(e[2]);
    const a = e[3];
    for (const [, c, d, u] of a.matchAll(dn)) if (d === "u-ca") o === void 0 && (o = u);
    else if (c === "!") throw new RangeError(`Unrecognized annotation: !${d}=${u}`);
    if (o !== void 0 && o !== "iso8601") throw new RangeError("MM-DD format is only valid with iso8601 calendar");
  } else {
    let a;
    if ({ month: t, day: r, calendar: o, year: i, z: a } = zt(n), a) throw new RangeError("Z designator not supported for PlainMonthDay");
  }
  return { month: t, day: r, calendar: o, referenceISOYear: i };
}
function el(n) {
  let { year: e, month: t, day: r, hour: o, minute: i, second: a, millisecond: c, microsecond: d, nanosecond: u, offset: h, z: m } = function(p) {
    const w = zt(p);
    if (!w.z && !w.offset) throw new RangeError("Temporal.Instant requires a time zone offset");
    return w;
  }(n);
  if (!m && !h) throw new RangeError("Temporal.Instant requires a time zone offset");
  const f = m ? 0 : an(h);
  ({ year: e, month: t, day: r, hour: o, minute: i, second: a, millisecond: c, microsecond: d, nanosecond: u } = ti(e, t, r, o, i, a, c, d, u - f));
  const g = sn(e, t, r, o, i, a, c, d, u);
  if (g === null) throw new RangeError("DateTime outside of supported range");
  return g;
}
function Zr(n, e, t, r) {
  let o = n, i = e, a = t;
  switch (r) {
    case "reject":
      St(o, i, a);
      break;
    case "constrain":
      ({ year: o, month: i, day: a } = Ga(o, i, a));
  }
  return { year: o, month: i, day: a };
}
function oo(n, e, t, r, o, i, a) {
  let c = n, d = e, u = t, h = r, m = o, f = i;
  switch (a) {
    case "reject":
      wo(c, d, u, h, m, f);
      break;
    case "constrain":
      ({ hour: c, minute: d, second: u, millisecond: h, microsecond: m, nanosecond: f } = function(y, p, w, v, T, E) {
        const D = at(y, 0, 23), k = at(p, 0, 59), _ = at(w, 0, 59), C = at(v, 0, 999), R = at(T, 0, 999), P = at(E, 0, 999);
        return { hour: D, minute: k, second: _, millisecond: C, microsecond: R, nanosecond: P };
      }(c, d, u, h, m, f));
  }
  return { hour: c, minute: d, second: u, millisecond: h, microsecond: m, nanosecond: f };
}
function In(n) {
  if (!ce(n)) return function(y) {
    const p = js.exec(y);
    if (!p) throw new RangeError(`invalid duration: ${y}`);
    if (p.slice(2).every((H) => H === void 0)) throw new RangeError(`invalid duration: ${y}`);
    const w = p[1] === "-" || p[1] === "−" ? -1 : 1, v = p[2] === void 0 ? 0 : ee(p[2]) * w, T = p[3] === void 0 ? 0 : ee(p[3]) * w, E = p[4] === void 0 ? 0 : ee(p[4]) * w, D = p[5] === void 0 ? 0 : ee(p[5]) * w, k = p[6] === void 0 ? 0 : ee(p[6]) * w, _ = p[7], C = p[8], R = p[9], P = p[10], re = p[11];
    let Q = 0, J = 0, A = 0;
    if (_ !== void 0) {
      if (C ?? R ?? P ?? re) throw new RangeError("only the smallest unit can be fractional");
      A = 3600 * _e((_ + "000000000").slice(0, 9)) * w;
    } else if (Q = C === void 0 ? 0 : ee(C) * w, R !== void 0) {
      if (P ?? re) throw new RangeError("only the smallest unit can be fractional");
      A = 60 * _e((R + "000000000").slice(0, 9)) * w;
    } else J = P === void 0 ? 0 : ee(P) * w, re !== void 0 && (A = _e((re + "000000000").slice(0, 9)) * w);
    const V = A % 1e3, O = yn(A / 1e3) % 1e3, S = yn(A / 1e6) % 1e3;
    return J += yn(A / 1e9) % 60, Q += yn(A / 6e10), Xr(v, T, E, D, k, Q, J, S, O, V), { years: v, months: T, weeks: E, days: D, hours: k, minutes: Q, seconds: J, milliseconds: S, microseconds: O, nanoseconds: V };
  }(rt(n));
  if (pe(n)) return { years: s(n, Ve), months: s(n, Ne), weeks: s(n, ot), days: s(n, Ge), hours: s(n, He), minutes: s(n, Ke), seconds: s(n, Xe), milliseconds: s(n, Qe), microseconds: s(n, Je), nanoseconds: s(n, et) };
  const e = { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, microseconds: 0, nanoseconds: 0 };
  let t = function(y) {
    if (!ce(y)) throw new TypeError("invalid duration-like");
    const p = { years: void 0, months: void 0, weeks: void 0, days: void 0, hours: void 0, minutes: void 0, seconds: void 0, milliseconds: void 0, microseconds: void 0, nanoseconds: void 0 };
    let w = !1;
    for (const v of Ri) {
      const T = y[v];
      T !== void 0 && (w = !0, p[v] = xe(T));
    }
    if (!w) throw new TypeError("invalid duration-like");
    return p;
  }(n);
  for (const g of Ri) {
    const y = t[g];
    y !== void 0 && (e[g] = y);
  }
  let { years: r, months: o, weeks: i, days: a, hours: c, minutes: d, seconds: u, milliseconds: h, microseconds: m, nanoseconds: f } = e;
  return Xr(r, o, i, a, c, d, u, h, m, f), { years: r, months: o, weeks: i, days: a, hours: c, minutes: d, seconds: u, milliseconds: h, microseconds: m, nanoseconds: f };
}
function De(n) {
  return n === void 0 ? "constrain" : cn(n, "overflow", ["constrain", "reject"], "constrain");
}
function Un(n) {
  return n === void 0 ? "compatible" : cn(n, "disambiguation", ["compatible", "earlier", "later", "reject"], "compatible");
}
function Mt(n, e) {
  return cn(n, "roundingMode", ["ceil", "floor", "expand", "trunc", "halfCeil", "halfFloor", "halfExpand", "halfTrunc", "halfEven"], e);
}
function Wr(n, e) {
  return n === void 0 ? e : cn(n, "offset", ["prefer", "use", "ignore", "reject"], e);
}
function pr(n) {
  return cn(n, "calendarName", ["auto", "always", "never", "critical"], "auto");
}
function Xn(n) {
  let e = n.roundingIncrement;
  if (e === void 0) return 1;
  if (e = jn(e), !tt(e)) throw new RangeError("roundingIncrement must be finite");
  const t = yn(e);
  if (t < 1 || t > 1e9) throw new RangeError(`roundingIncrement must be at least 1 and at most 1e9, not ${e}`);
  return t;
}
function Qn(n, e, t) {
  const r = t ? e : e - 1;
  if (n > r) throw new RangeError(`roundingIncrement must be at least 1 and less than ${r}, not ${n}`);
  if (e % n != 0) throw new RangeError(`Rounding increment must divide evenly into ${e}`);
}
function wr(n) {
  const e = n.fractionalSecondDigits;
  if (e === void 0) return "auto";
  if (typeof e != "number") {
    if (rt(e) !== "auto") throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${e}`);
    return "auto";
  }
  const t = lt(e);
  if (!tt(t) || t < 0 || t > 9) throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${e}`);
  return t;
}
function vr(n, e) {
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
const bn = Symbol("~required~");
function ct(n, e, t, r, o = []) {
  const i = [];
  for (const [, u, h] of yr) t !== "datetime" && t !== h || i.push(u);
  i.push(...o);
  let a = r;
  a === bn ? a = void 0 : a !== void 0 && i.push(a);
  const c = [...i];
  for (const u of i) {
    const h = Qs.get(u);
    h !== void 0 && c.push(h);
  }
  let d = cn(n, e, c, a);
  if (d === void 0 && r === bn) throw new RangeError(`${e} is required`);
  return Br.has(d) ? Br.get(d) : d;
}
function xr(n) {
  const e = n.relativeTo;
  if (e === void 0) return e;
  let t, r, o, i, a, c, d, u, h, m, f, g, y = "option", p = !1;
  if (ce(e)) {
    if (x(e) || K(e)) return e;
    if (L(e)) return qn(e);
    m = Dr(e);
    const w = ke(m, ["day", "hour", "microsecond", "millisecond", "minute", "month", "monthCode", "nanosecond", "second", "year"]);
    w.push("timeZone", "offset");
    const v = G(e, w, []), T = We(null);
    T.overflow = "constrain", { year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h } = Tr(m, v, T), g = v.offset, g === void 0 && (y = "wall"), f = v.timeZone, f !== void 0 && (f = Ze(f));
  } else {
    let w, v;
    if ({ year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h, calendar: m, ianaName: w, offset: g, z: v } = zt(rt(e)), w) f = Ze(w), v ? y = "exact" : g || (y = "wall"), p = !0;
    else if (v) throw new RangeError("Z designator not supported for PlainDate relativeTo; either remove the Z or add a bracketed time zone");
    if (m || (m = "iso8601"), !Qt(m)) throw new RangeError(`invalid calendar identifier ${m}`);
    m = Lt(m);
  }
  return f === void 0 ? bt(t, r, o, m) : Se(Gr(t, r, o, i, a, c, d, u, h, y, y === "option" ? an(g) : 0, f, "compatible", "reject", p), f, m);
}
function Po(n, e, t, r, o, i, a, c, d, u) {
  for (const [h, m] of [["years", n], ["months", e], ["weeks", t], ["days", r], ["hours", o], ["minutes", i], ["seconds", a], ["milliseconds", c], ["microseconds", d], ["nanoseconds", u]]) if (m !== 0) return Br.get(h);
  return "nanosecond";
}
function En(n, e) {
  return Oi.indexOf(n) > Oi.indexOf(e) ? e : n;
}
function G(n, e, t, { emptySourceErrorMessage: r } = { emptySourceErrorMessage: "no supported properties found" }) {
  const o = We(null);
  let i = !1;
  e.sort();
  for (const a of e) {
    let c = n[a];
    if (c !== void 0) i = !0, Mi.has(a) && (c = Mi.get(a)(c)), o[a] = c;
    else if (t !== "partial") {
      if (Us.call(t, a)) throw new TypeError(`required property '${a}' missing or undefined`);
      c = Xs.get(a), o[a] = c;
    }
  }
  if (t === "partial" && !i) throw new TypeError(r);
  return o;
}
function Vr(n, e = "complete") {
  const t = ["hour", "microsecond", "millisecond", "minute", "nanosecond", "second"], r = G(n, t, "partial", { emptySourceErrorMessage: "invalid time-like" }), o = {};
  for (const i of t) {
    const a = Ws(r, i);
    a !== void 0 ? o[i] = a.value : e === "complete" && (o[i] = 0);
  }
  return o;
}
function ae(n, e) {
  let t = n;
  if (ce(t)) {
    if (K(t)) return t;
    if (x(t) && (De(e), t = gt(s(t, ie), s(t, Be), s(t, b))), L(t)) return De(e), bt(s(t, M), s(t, $), s(t, Y), s(t, b));
    const d = Dr(t);
    return Kt(d, G(t, ke(d, ["day", "month", "monthCode", "year"]), []), e);
  }
  De(e);
  let { year: r, month: o, day: i, calendar: a, z: c } = function(u) {
    return zt(u);
  }(rt(t));
  if (c) throw new RangeError("Z designator not supported for PlainDate");
  if (a || (a = "iso8601"), !Qt(a)) throw new RangeError(`invalid calendar identifier ${a}`);
  return a = Lt(a), bt(r, o, i, a);
}
function Tr(n, e, t) {
  let { hour: r, minute: o, second: i, millisecond: a, microsecond: c, nanosecond: d } = Vr(e);
  const u = De(t), h = Kt(n, e, t), m = s(h, M), f = s(h, $), g = s(h, Y);
  return { hour: r, minute: o, second: i, millisecond: a, microsecond: c, nanosecond: d } = oo(r, o, i, a, c, d, u), { year: m, month: f, day: g, hour: r, minute: o, second: i, millisecond: a, microsecond: c, nanosecond: d };
}
function pn(n, e) {
  let t, r, o, i, a, c, d, u, h, m;
  if (ce(n)) {
    if (L(n)) return n;
    if (x(n)) return De(e), gt(s(n, ie), s(n, Be), s(n, b));
    if (K(n)) return De(e), it(s(n, M), s(n, $), s(n, Y), 0, 0, 0, 0, 0, 0, s(n, b));
    m = Dr(n);
    const f = G(n, ke(m, ["day", "hour", "microsecond", "millisecond", "minute", "month", "monthCode", "nanosecond", "second", "year"]), []);
    ({ year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h } = Tr(m, f, e));
  } else {
    let f;
    if (De(e), { year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h, calendar: m, z: f } = function(y) {
      return zt(y);
    }(rt(n)), f) throw new RangeError("Z designator not supported for PlainDateTime");
    if (ri(t, r, o, i, a, c, d, u, h), m || (m = "iso8601"), !Qt(m)) throw new RangeError(`invalid calendar identifier ${m}`);
    m = Lt(m);
  }
  return it(t, r, o, i, a, c, d, u, h, m);
}
function xn(n) {
  if (pe(n)) return n;
  let { years: e, months: t, weeks: r, days: o, hours: i, minutes: a, seconds: c, milliseconds: d, microseconds: u, nanoseconds: h } = In(n);
  return new (I("%Temporal.Duration%"))(e, t, r, o, i, a, c, d, u, h);
}
function kt(n) {
  if (Re(n)) return n;
  if (x(n))
    return new (I("%Temporal.Instant%"))(s(n, F));
  const e = el(rt(n));
  return new (I("%Temporal.Instant%"))(e);
}
function xi(n, e) {
  let t = n;
  if (ce(t)) {
    if (Ye(t)) return t;
    let c, d;
    if (Pe(t, b)) c = s(t, b), d = !1;
    else {
      let h = t.calendar;
      d = h === void 0, h === void 0 && (h = "iso8601"), c = dt(h);
    }
    const u = G(t, ke(c, ["day", "month", "monthCode", "year"]), []);
    return d && u.month !== void 0 && u.monthCode === void 0 && u.year === void 0 && (u.year = 1972), zn(c, u, e);
  }
  De(e);
  let { month: r, day: o, referenceISOYear: i, calendar: a } = Vo(rt(t));
  if (a === void 0 && (a = "iso8601"), !Qt(a)) throw new RangeError(`invalid calendar identifier ${a}`);
  return a = Lt(a), i === void 0 ? (St(1972, r, o), dr(r, o, a)) : zn(a, dr(r, o, a, i));
}
function Bt(n, e = "constrain") {
  let t, r, o, i, a, c, d = n;
  if (ce(d)) {
    if (we(d)) return d;
    if (x(d) && (d = gt(s(d, ie), s(d, Be), s(d, b))), L(d))
      return new (I("%Temporal.PlainTime%"))(s(d, j), s(d, U), s(d, z), s(d, q), s(d, B), s(d, Z));
    ({ hour: t, minute: r, second: o, millisecond: i, microsecond: a, nanosecond: c } = Vr(d)), { hour: t, minute: r, second: o, millisecond: i, microsecond: a, nanosecond: c } = oo(t, r, o, i, a, c, e);
  } else ({ hour: t, minute: r, second: o, millisecond: i, microsecond: a, nanosecond: c } = function(h) {
    const m = As.exec(h);
    let f, g, y, p, w, v, T;
    if (m) {
      f = _e(m[1]), g = _e(m[2] || m[5]), y = _e(m[3] || m[6]), y === 60 && (y = 59);
      const E = (m[4] || m[7]) + "000000000";
      p = _e(E.slice(0, 3)), w = _e(E.slice(3, 6)), v = _e(E.slice(6, 9)), T = m[14];
      for (const [, D, k, _] of T.matchAll(dn)) if (k !== "u-ca" && D === "!") throw new RangeError(`Unrecognized annotation: !${k}=${_}`);
      if (m[8]) throw new RangeError("Z designator not supported for PlainTime");
    } else {
      let E, D;
      if ({ hasTime: D, hour: f, minute: g, second: y, millisecond: p, microsecond: w, nanosecond: v, z: E } = zt(h), !D) throw new RangeError(`time is missing in string: ${h}`);
      if (E) throw new RangeError("Z designator not supported for PlainTime");
    }
    if (/[tT ][0-9][0-9]/.test(h)) return { hour: f, minute: g, second: y, millisecond: p, microsecond: w, nanosecond: v };
    try {
      const { month: E, day: D } = Vo(h);
      St(1972, E, D);
    } catch {
      try {
        const { year: E, month: D } = Wo(h);
        St(E, D, 1);
      } catch {
        return { hour: f, minute: g, second: y, millisecond: p, microsecond: w, nanosecond: v };
      }
    }
    throw new RangeError(`invalid ISO 8601 time-only string ${h}; may need a T prefix`);
  }(rt(d))), wo(t, r, o, i, a, c);
  return new (I("%Temporal.PlainTime%"))(t, r, o, i, a, c);
}
function rr(n, e) {
  if (ce(n)) {
    if (te(n)) return n;
    const a = Dr(n);
    return Cn(a, G(n, ke(a, ["month", "monthCode", "year"]), []), e);
  }
  De(e);
  let { year: t, month: r, referenceISODay: o, calendar: i } = Wo(rt(n));
  if (i === void 0 && (i = "iso8601"), !Qt(i)) throw new RangeError(`invalid calendar identifier ${i}`);
  return i = Lt(i), o === void 0 ? (St(t, r, 1), ur(t, r, i)) : Cn(i, ur(t, r, i, o));
}
function Gr(n, e, t, r, o, i, a, c, d, u, h, m, f, g, y) {
  const p = new (I("%Temporal.PlainDateTime%"))(n, e, t, r, o, i, a, c, d);
  if (u === "wall" || g === "ignore")
    return s(nt(m, p, f), F);
  if (u === "exact" || g === "use") {
    const v = sn(n, e, t, r, o, i, a, c, d);
    if (v === null) throw new RangeError("ZonedDateTime outside of supported range");
    return l.subtract(v, l.BigInt(h));
  }
  const w = Hr(m, p);
  for (const v of w) {
    const T = Ot(m, v), E = l.toNumber(ft(l.BigInt(T), Ma, "halfExpand"));
    if (T === h || y && E === h) return s(v, F);
  }
  if (g === "reject") {
    const v = yo(h), T = pt(m) ? s(m, xt) : "time zone";
    throw new RangeError(`Offset ${v} is invalid for ${p.toString()} in ${T}`);
  }
  return s(ja(w, m, p, f), F);
}
function or(n, e) {
  let t, r, o, i, a, c, d, u, h, m, f, g, y, p, w = !1, v = "option";
  if (ce(n)) {
    if (x(n)) return n;
    g = Dr(n);
    const E = ke(g, ["day", "hour", "microsecond", "millisecond", "minute", "month", "monthCode", "nanosecond", "second", "year"]);
    E.push("timeZone", "offset");
    const D = G(n, E, ["timeZone"]);
    m = Ze(D.timeZone), f = D.offset, f === void 0 && (v = "wall"), y = Un(e), p = Wr(e, "reject"), { year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h } = Tr(g, D, e);
  } else {
    let E, D;
    if ({ year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h, ianaName: E, offset: f, z: D, calendar: g } = function(_) {
      const C = zt(_);
      if (!C.ianaName) throw new RangeError("Temporal.ZonedDateTime requires a time zone ID in brackets");
      return C;
    }(rt(n)), m = Ze(E), D ? v = "exact" : f || (v = "wall"), g || (g = "iso8601"), !Qt(g)) throw new RangeError(`invalid calendar identifier ${g}`);
    g = Lt(g), w = !0, y = Un(e), p = Wr(e, "reject"), De(e);
  }
  let T = 0;
  return v === "option" && (T = an(f)), Se(Gr(t, r, o, i, a, c, d, u, h, v, T, m, y, p, w), m, g);
}
function Ya(n, e, t, r, o) {
  St(e, t, r), Ha(e, t, r), Ut(n), W(n, M, e), W(n, $, t), W(n, Y, r), W(n, b, o), W(n, ya, !0);
}
function bt(n, e, t, r = "iso8601") {
  const o = I("%Temporal.PlainDate%"), i = We(o.prototype);
  return Ya(i, n, e, t, r), i;
}
function xa(n, e, t, r, o, i, a, c, d, u, h) {
  ri(e, t, r, o, i, a, c, d, u), Ka(e, t, r, o, i, a, c, d, u), Ut(n), W(n, M, e), W(n, $, t), W(n, Y, r), W(n, j, o), W(n, U, i), W(n, z, a), W(n, q, c), W(n, B, d), W(n, Z, u), W(n, b, h);
}
function it(n, e, t, r, o, i, a, c, d, u = "iso8601") {
  const h = I("%Temporal.PlainDateTime%"), m = We(h.prototype);
  return xa(m, n, e, t, r, o, i, a, c, d, u), m;
}
function Pa(n, e, t, r, o) {
  St(o, e, t), Ha(o, e, t), Ut(n), W(n, $, e), W(n, Y, t), W(n, M, o), W(n, b, r), W(n, wa, !0);
}
function dr(n, e, t = "iso8601", r = 1972) {
  const o = I("%Temporal.PlainMonthDay%"), i = We(o.prototype);
  return Pa(i, n, e, t, r), i;
}
function Na(n, e, t, r, o) {
  St(e, t, o), function(a, c) {
    je(a, Ur, zr), a === Ur ? je(c, 4, 12) : a === zr && je(c, 1, 9);
  }(e, t), Ut(n), W(n, M, e), W(n, $, t), W(n, Y, o), W(n, b, r), W(n, pa, !0);
}
function ur(n, e, t = "iso8601", r = 1) {
  const o = I("%Temporal.PlainYearMonth%"), i = We(o.prototype);
  return Na(i, n, e, t, r), i;
}
function Aa(n, e, t, r) {
  gn(e), Ut(n), W(n, F, e), W(n, ie, t), W(n, b, r);
  const o = new (I("%Temporal.Instant%"))(s(n, F));
  W(n, Be, o);
}
function Se(n, e, t = "iso8601") {
  const r = I("%Temporal.ZonedDateTime%"), o = We(r.prototype);
  return Aa(o, n, e, t), o;
}
function ke(n, e) {
  if (typeof n == "string") {
    const o = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.fields%"), o, [e]);
  }
  const t = N(oe(n, "fields"), n, [e]), r = [];
  for (const o of t) {
    if (typeof o != "string") throw new TypeError("bad return from calendar.fields()");
    Ca.call(r, o);
  }
  return r;
}
function Dn(n, e, t) {
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
  const a = ro(i, n, [e, t, r]);
  if (!K(a)) throw new TypeError("invalid result");
  return a;
}
function on(n, e, t, r, o) {
  let i = o;
  if (typeof n == "string") {
    const c = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.dateUntil%"), c, [e, t, r]);
  }
  i === void 0 && (i = oe(n, "dateUntil"));
  const a = ro(i, n, [e, t, r]);
  if (!pe(a)) throw new TypeError("invalid result");
  return a;
}
function io(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.year%"), r, [e]);
  }
  let t = N(oe(n, "year"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar year result must be an integer");
  if (!yt(t)) throw new RangeError("calendar year result must be an integer");
  return t;
}
function ao(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.month%"), r, [e]);
  }
  let t = N(oe(n, "month"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar month result must be a positive integer");
  if (!yt(t) || t < 1) throw new RangeError("calendar month result must be a positive integer");
  return t;
}
function br(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.monthCode%"), r, [e]);
  }
  let t = N(oe(n, "monthCode"), n, [e]);
  if (typeof t != "string") throw new TypeError("calendar monthCode result must be a string");
  return t;
}
function Er(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.day%"), r, [e]);
  }
  const t = N(oe(n, "day"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar day result must be a positive integer");
  if (!yt(t) || t < 1) throw new RangeError("calendar day result must be a positive integer");
  return t;
}
function so(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.era%"), r, [e]);
  }
  let t = N(oe(n, "era"), n, [e]);
  if (t === void 0) return t;
  if (typeof t != "string") throw new TypeError("calendar era result must be a string or undefined");
  return t;
}
function lo(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.eraYear%"), r, [e]);
  }
  let t = N(oe(n, "eraYear"), n, [e]);
  if (t === void 0) return t;
  if (typeof t != "number") throw new TypeError("calendar eraYear result must be an integer or undefined");
  if (!yt(t)) throw new RangeError("calendar eraYear result must be an integer or undefined");
  return t;
}
function Go(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.dayOfWeek%"), r, [e]);
  }
  const t = N(oe(n, "dayOfWeek"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar dayOfWeek result must be a positive integer");
  if (!yt(t) || t < 1) throw new RangeError("calendar dayOfWeek result must be a positive integer");
  return t;
}
function Ho(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.dayOfYear%"), r, [e]);
  }
  const t = N(oe(n, "dayOfYear"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar dayOfYear result must be a positive integer");
  if (!yt(t) || t < 1) throw new RangeError("calendar dayOfYear result must be a positive integer");
  return t;
}
function Ko(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.weekOfYear%"), r, [e]);
  }
  const t = N(oe(n, "weekOfYear"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar weekOfYear result must be a positive integer");
  if (!yt(t) || t < 1) throw new RangeError("calendar weekOfYear result must be a positive integer");
  return t;
}
function Xo(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.yearOfWeek%"), r, [e]);
  }
  const t = N(oe(n, "yearOfWeek"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar yearOfWeek result must be an integer");
  if (!yt(t)) throw new RangeError("calendar yearOfWeek result must be an integer");
  return t;
}
function Qo(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.daysInWeek%"), r, [e]);
  }
  const t = N(oe(n, "daysInWeek"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar daysInWeek result must be a positive integer");
  if (!yt(t) || t < 1) throw new RangeError("calendar daysInWeek result must be a positive integer");
  return t;
}
function co(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.daysInMonth%"), r, [e]);
  }
  const t = N(oe(n, "daysInMonth"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar daysInMonth result must be a positive integer");
  if (!yt(t) || t < 1) throw new RangeError("calendar daysInMonth result must be a positive integer");
  return t;
}
function uo(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.daysInYear%"), r, [e]);
  }
  const t = N(oe(n, "daysInYear"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar daysInYear result must be a positive integer");
  if (!yt(t) || t < 1) throw new RangeError("calendar daysInYear result must be a positive integer");
  return t;
}
function ho(n, e) {
  if (typeof n == "string") {
    const r = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.monthsInYear%"), r, [e]);
  }
  const t = N(oe(n, "monthsInYear"), n, [e]);
  if (typeof t != "number") throw new TypeError("calendar monthsInYear result must be a positive integer");
  if (!yt(t) || t < 1) throw new RangeError("calendar monthsInYear result must be a positive integer");
  return t;
}
function mo(n, e) {
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
    if (Pe(n, b)) return s(n, b);
    if (!function(o) {
      return !!ge(o) || "dateAdd" in o && "dateFromFields" in o && "dateUntil" in o && "day" in o && "dayOfWeek" in o && "dayOfYear" in o && "daysInMonth" in o && "daysInWeek" in o && "daysInYear" in o && "fields" in o && "id" in o && "inLeapYear" in o && "mergeFields" in o && "month" in o && "monthCode" in o && "monthDayFromFields" in o && "monthsInYear" in o && "weekOfYear" in o && "year" in o && "yearMonthFromFields" in o && "yearOfWeek" in o;
    }(n)) throw new TypeError("expected a Temporal.Calendar or object implementing the Temporal.Calendar protocol");
    return n;
  }
  const e = rt(n);
  if (Qt(e)) return Lt(e);
  let t;
  try {
    ({ calendar: t } = zt(e));
  } catch {
    try {
      ({ calendar: t } = Wo(e));
    } catch {
      ({ calendar: t } = Vo(e));
    }
  }
  if (t || (t = "iso8601"), !Qt(t)) throw new RangeError(`invalid calendar identifier ${t}`);
  return Lt(t);
}
function Dr(n) {
  if (Pe(n, b)) return s(n, b);
  const { calendar: e } = n;
  return e === void 0 ? "iso8601" : dt(e);
}
function Ue(n) {
  if (typeof n == "string") return n;
  const e = n.id;
  if (typeof e != "string") throw new TypeError("calendar.id should be a string");
  return e;
}
function Jn(n) {
  return ce(n) ? n : new (I("%Temporal.Calendar%"))(n);
}
function Cr(n, e) {
  return n === e ? !0 : Ue(n) === Ue(e);
}
function fo(n, e, t) {
  if (n === e) return;
  const r = Ue(n), o = Ue(e);
  if (r !== o) throw new RangeError(`cannot ${t} of ${r} and ${o} calendars`);
}
function Fa(n, e) {
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
function Cn(n, e, t) {
  if (typeof n == "string") {
    const o = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.yearMonthFromFields%"), o, [e, t]);
  }
  let r = N(oe(n, "yearMonthFromFields"), n, [e, t]);
  if (!te(r)) throw new TypeError("invalid result");
  return r;
}
function zn(n, e, t) {
  if (typeof n == "string") {
    const o = new (I("%Temporal.Calendar%"))(n);
    return N(I("%Temporal.Calendar.prototype.monthDayFromFields%"), o, [e, t]);
  }
  let r = N(oe(n, "monthDayFromFields"), n, [e, t]);
  if (!Ye(r)) throw new TypeError("invalid result");
  return r;
}
function Ze(n) {
  if (ce(n)) {
    if (x(n)) return s(n, ie);
    if (!function(t) {
      return !!pt(t) || "getOffsetNanosecondsFor" in t && "getPossibleInstantsFor" in t && "id" in t;
    }(n)) throw new TypeError("expected a Temporal.TimeZone or object implementing the Temporal.TimeZone protocol");
    return n;
  }
  return Js(rt(n));
}
function hr(n) {
  if (typeof n == "string") return n;
  const e = n.id;
  if (typeof e != "string") throw new TypeError("timeZone.id should be a string");
  return e;
}
function Sa(n) {
  return ce(n) ? n : new (I("%Temporal.TimeZone%"))(n);
}
function La(n, e) {
  return n === e ? !0 : hr(n) === hr(e);
}
function qn(n) {
  return bt(s(n, M), s(n, $), s(n, Y), s(n, b));
}
function Jo(n) {
  return new (I("%Temporal.PlainTime%"))(s(n, j), s(n, U), s(n, z), s(n, q), s(n, B), s(n, Z));
}
function Ot(n, e, t) {
  if (typeof n == "string") {
    const o = new (I("%Temporal.TimeZone%"))(n);
    return N(I("%Temporal.TimeZone.prototype.getOffsetNanosecondsFor%"), o, [e]);
  }
  const r = N(oe(n, "getOffsetNanosecondsFor"), n, [e]);
  if (typeof r != "number") throw new TypeError("bad return from getOffsetNanosecondsFor");
  if (!yt(r) || le(r) >= 864e11) throw new RangeError("out-of-range return from getOffsetNanosecondsFor");
  return r;
}
function No(n, e) {
  return yo(Ot(n, e));
}
function gt(n, e, t) {
  const r = s(e, F), o = Ot(n, e);
  let { year: i, month: a, day: c, hour: d, minute: u, second: h, millisecond: m, microsecond: f, nanosecond: g } = za(r);
  return { year: i, month: a, day: c, hour: d, minute: u, second: h, millisecond: m, microsecond: f, nanosecond: g } = ti(i, a, c, d, u, h, m, f, g + o), it(i, a, c, d, u, h, m, f, g, t);
}
function nt(n, e, t) {
  return ja(Hr(n, e), n, e, t);
}
function ja(n, e, t, r) {
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
  const a = s(t, M), c = s(t, $), d = s(t, Y), u = s(t, j), h = s(t, U), m = s(t, z), f = s(t, q), g = s(t, B), y = s(t, Z), p = sn(a, c, d, u, h, m, f, g, y);
  if (p === null) throw new RangeError("DateTime outside of supported range");
  const w = new o(l.subtract(p, Ft)), v = new o(l.add(p, Ft)), T = Ot(e, w), E = Ot(e, v) - T;
  switch (r) {
    case "earlier": {
      const D = s(t, b), k = I("%Temporal.PlainDateTime%"), _ = Lo(a, c, d, u, h, m, f, g, y, D, 0, 0, 0, 0, 0, 0, 0, 0, 0, -E, void 0);
      return Hr(e, new k(_.year, _.month, _.day, _.hour, _.minute, _.second, _.millisecond, _.microsecond, _.nanosecond, D))[0];
    }
    case "compatible":
    case "later": {
      const D = s(t, b), k = I("%Temporal.PlainDateTime%"), _ = Lo(a, c, d, u, h, m, f, g, y, D, 0, 0, 0, 0, 0, 0, 0, 0, 0, E, void 0), C = Hr(e, new k(_.year, _.month, _.day, _.hour, _.minute, _.second, _.millisecond, _.microsecond, _.nanosecond, D));
      return C[C.length - 1];
    }
    case "reject":
      throw new RangeError("no such instant found");
  }
}
function Hr(n, e, t) {
  if (typeof n == "string") {
    const i = new (I("%Temporal.TimeZone%"))(n);
    return N(I("%Temporal.TimeZone.prototype.getPossibleInstantsFor%"), i, [e]);
  }
  const r = N(oe(n, "getPossibleInstantsFor"), n, [e]), o = [];
  for (const i of r) {
    if (!Re(i)) throw new TypeError("bad return from getPossibleInstantsFor");
    Ca.call(o, i);
  }
  return o;
}
function kn(n) {
  let e;
  return n < 0 || n > 9999 ? e = (n < 0 ? "-" : "+") + `000000${le(n)}`.slice(-6) : e = `0000${n}`.slice(-4), e;
}
function ue(n) {
  return `00${n}`.slice(-2);
}
function go(n, e, t, r, o) {
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
function Pi(n, e, t) {
  let r = e;
  r === void 0 && (r = "UTC");
  const o = gt(r, n, "iso8601"), i = kn(s(o, M)), a = ue(s(o, $)), c = ue(s(o, Y)), d = ue(s(o, j)), u = ue(s(o, U)), h = go(s(o, z), s(o, q), s(o, B), s(o, Z), t);
  let m = "Z";
  return e !== void 0 && (m = Ua(Ot(r, n))), `${i}-${a}-${c}T${d}:${u}${h}${m}`;
}
function Do(n, e = "auto", t) {
  function r(P) {
    return P <= Zs ? P.toString(10) : l.BigInt(P).toString(10);
  }
  const o = s(n, Ve), i = s(n, Ne), a = s(n, ot), c = s(n, Ge), d = s(n, He), u = s(n, Ke);
  let h = s(n, Xe), m = s(n, Qe), f = s(n, Je), g = s(n, et);
  const y = At(o, i, a, c, d, u, h, m, f, g);
  if (t) {
    const { unit: P, increment: re, roundingMode: Q } = t;
    ({ seconds: h, milliseconds: m, microseconds: f, nanoseconds: g } = Xt(0, 0, 0, 0, 0, 0, h, m, f, g, re, P, Q));
  }
  const p = [];
  o && p.push(`${r(le(o))}Y`), i && p.push(`${r(le(i))}M`), a && p.push(`${r(le(a))}W`), c && p.push(`${r(le(c))}D`);
  const w = [];
  d && w.push(`${r(le(d))}H`), u && w.push(`${r(le(u))}M`);
  const v = [];
  let T, E, D, k, _ = Bn(0, 0, 0, h, m, f, g, 0);
  ({ quotient: _, remainder: T } = Ee(_, ne)), { quotient: _, remainder: E } = Ee(_, ne), { quotient: k, remainder: D } = Ee(_, ne);
  const C = 1e6 * le(l.toNumber(D)) + 1e3 * le(l.toNumber(E)) + le(l.toNumber(T));
  let R;
  if (e === "auto") {
    if (C !== 0) for (R = `${C}`.padStart(9, "0"); R[R.length - 1] === "0"; ) R = R.slice(0, -1);
  } else e !== 0 && (R = `${C}`.padStart(9, "0").slice(0, e));
  return R && v.unshift(".", R), l.equal(k, ve) && !v.length && e === "auto" || v.unshift(It(k).toString()), v.length && w.push(`${v.join("")}S`), w.length && w.unshift("T"), p.length || w.length ? `${y < 0 ? "-" : ""}P${p.join("")}${w.join("")}` : "PT0S";
}
function Ni(n, e = "auto") {
  return `${kn(s(n, M))}-${ue(s(n, $))}-${ue(s(n, Y))}${Bo(s(n, b), e)}`;
}
function Ai(n, e, t = "auto", r) {
  let o = s(n, M), i = s(n, $), a = s(n, Y), c = s(n, j), d = s(n, U), u = s(n, z), h = s(n, q), m = s(n, B), f = s(n, Z);
  if (r) {
    const { unit: g, increment: y, roundingMode: p } = r;
    ({ year: o, month: i, day: a, hour: c, minute: d, second: u, millisecond: h, microsecond: m, nanosecond: f } = si(o, i, a, c, d, u, h, m, f, y, g, p));
  }
  return `${kn(o)}-${ue(i)}-${ue(a)}T${ue(c)}:${ue(d)}${go(u, h, m, f, e)}${Bo(s(n, b), t)}`;
}
function Fi(n, e = "auto") {
  let t = `${ue(s(n, $))}-${ue(s(n, Y))}`;
  const r = Ue(s(n, b));
  (e === "always" || e === "critical" || r !== "iso8601") && (t = `${kn(s(n, M))}-${t}`);
  const o = Zo(r, e);
  return o && (t += o), t;
}
function Si(n, e = "auto") {
  let t = `${kn(s(n, M))}-${ue(s(n, $))}`;
  const r = Ue(s(n, b));
  (e === "always" || e === "critical" || r !== "iso8601") && (t += `-${ue(s(n, Y))}`);
  const o = Zo(r, e);
  return o && (t += o), t;
}
function Li(n, e, t = "auto", r = "auto", o = "auto", i) {
  let a = s(n, Be);
  if (i) {
    const { unit: h, increment: m, roundingMode: f } = i, g = Qr(s(n, F), m, h, f);
    a = new (I("%Temporal.Instant%"))(g);
  }
  const c = s(n, ie), d = gt(c, a, "iso8601");
  let u = `${kn(s(d, M))}-${ue(s(d, $))}-${ue(s(d, Y))}T${ue(s(d, j))}:${ue(s(d, U))}${go(s(d, z), s(d, q), s(d, B), s(d, Z), e)}`;
  return o !== "never" && (u += Ua(Ot(c, a))), r !== "never" && (u += `[${r === "critical" ? "!" : ""}${hr(c)}]`), u += Bo(s(n, b), t), u;
}
function Rn(n) {
  return rs.test(gr(n));
}
function an(n) {
  const e = rs.exec(gr(n));
  if (!e) throw new RangeError(`invalid time zone offset: ${n}`);
  return (e[1] === "-" || e[1] === "−" ? -1 : 1) * (1e9 * (60 * (60 * +e[2] + +(e[3] || 0)) + +(e[4] || 0)) + +((e[5] || 0) + "000000000").slice(0, 9));
}
function ei(n) {
  return Rn(n) ? yo(an(n)) : $a(gr(n)).resolvedOptions().timeZone;
}
function Zt(n, e) {
  const { year: t, month: r, day: o, hour: i, minute: a, second: c, millisecond: d, microsecond: u, nanosecond: h } = qa(n, e), m = t % 400, f = (t - m) / 400, g = l.multiply(l.BigInt(146097), Ft), y = sn(m, r, o, i, a, c, d, u, h), p = l.add(y, l.multiply(g, l.BigInt(f)));
  return l.toNumber(l.subtract(p, e));
}
function yo(n) {
  const e = n < 0 ? "-" : "+", t = le(n), r = t % 1e9, o = lt(t / 1e9) % 60, i = lt(t / 6e10) % 60, a = ue(lt(t / 36e11)), c = ue(i), d = ue(o);
  let u = "";
  if (r) {
    let h = `${r}`.padStart(9, "0");
    for (; h[h.length - 1] === "0"; ) h = h.slice(0, -1);
    u = `:${d}.${h}`;
  } else o && (u = `:${d}`);
  return `${e}${a}:${c}${u}`;
}
function Ua(n) {
  let e = l.toNumber(ft(l.BigInt(n), Ma, "halfExpand"));
  const t = e < 0 ? "-" : "+";
  e = le(e);
  const r = e / 6e10 % 60;
  return `${t}${ue(lt(e / 36e11))}:${ue(r)}`;
}
function sn(n, e, t, r, o, i, a, c, d) {
  const u = /* @__PURE__ */ new Date();
  u.setUTCHours(r, o, i, a), u.setUTCFullYear(n, e - 1, t);
  const h = u.getTime();
  if (no(h)) return null;
  let m = l.multiply(l.BigInt(h), vt);
  return m = l.add(m, l.multiply(l.BigInt(c), ne)), m = l.add(m, l.BigInt(d)), l.lessThan(m, cr) || l.greaterThan(m, Ln) ? null : m;
}
function za(n) {
  const { quotient: e, remainder: t } = Ee(n, vt);
  let r = l.toNumber(e), o = l.toNumber(t);
  o < 0 && (o += 1e6, r -= 1);
  const i = lt(o / 1e3) % 1e3, a = o % 1e3, c = new Date(r);
  return { epochMilliseconds: r, year: c.getUTCFullYear(), month: c.getUTCMonth() + 1, day: c.getUTCDate(), hour: c.getUTCHours(), minute: c.getUTCMinutes(), second: c.getUTCSeconds(), millisecond: c.getUTCMilliseconds(), microsecond: i, nanosecond: a };
}
function qa(n, e) {
  const { epochMilliseconds: t, millisecond: r, microsecond: o, nanosecond: i } = za(e), { year: a, month: c, day: d, hour: u, minute: h, second: m } = function(g, y) {
    const p = $a(g).format(new Date(y));
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
      const R = +T[5], P = +T[6];
      if (!(tt(k) && tt(E) && tt(D) && tt(C) && tt(R) && tt(P))) throw new RangeError(`Invalid number in "${v}`);
      return { year: k, month: E, day: D, hour: C, minute: R, second: P };
    }(p);
  }(n, t);
  return ti(a, c, d, u, h, m, r, o, i);
}
function ji(n, e) {
  return l.lessThan(n, e) ? e : n;
}
function Ba() {
  return l.add(ci(), Hs);
}
function Za(n, e) {
  if (l.lessThan(e, $n)) return Za(n, $n);
  const t = l.add(e, Oa), r = ji(Ba(), t);
  let o = ji($n, e);
  const i = Zt(n, o);
  let a = o, c = i;
  for (; i === c && l.lessThan(l.BigInt(o), r); ) {
    if (a = l.add(o, Ra), l.greaterThan(a, Ln)) return null;
    c = Zt(n, a), i === c && (o = a);
  }
  return i === c ? null : os((d) => Zt(n, d), o, a, i, c);
}
function Ao(n, e) {
  const t = Ba(), r = l.greaterThan(e, t), o = r ? l.subtract(e, Oa) : $n;
  if (n === "Africa/Casablanca" || n === "Africa/El_Aaiun") {
    const u = s(kt("2088-01-01T00Z"), F);
    if (l.lessThan(u, e)) return Ao(n, u);
  }
  let i = l.subtract(e, Hn);
  if (l.lessThan(i, $n)) return null;
  const a = Zt(n, i);
  let c = i, d = a;
  for (; a === d && l.greaterThan(i, o); ) {
    if (c = l.subtract(i, Ra), l.lessThan(c, $n)) return null;
    d = Zt(n, c), a === d && (i = c);
  }
  if (a === d) {
    if (r) {
      const u = l.subtract(t, Ft);
      return Ao(n, u);
    }
    return null;
  }
  return os((u) => Zt(n, u), c, i, d, a);
}
function ln(n) {
  return n === void 0 ? !1 : n % 4 == 0 && (n % 100 != 0 || n % 400 == 0);
}
function Wt(n, e) {
  return { standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] }[ln(n) ? "leapyear" : "standard"][e - 1];
}
function Fo(n, e, t) {
  const r = e + (e < 3 ? 10 : -2), o = n - (e < 3 ? 1 : 0), i = lt(o / 100), a = o - 100 * i, c = (t + lt(2.6 * r - 0.2) + (a + lt(a / 4)) + (lt(i / 4) - 2 * i)) % 7;
  return c + (c <= 0 ? 7 : 0);
}
function Kr(n, e, t) {
  let r = t;
  for (let o = e - 1; o > 0; o--) r += Wt(n, o);
  return r;
}
function Ui(n, e, t) {
  const r = Kr(n, e, t), o = Fo(n, e, t) || 7, i = Fo(n, 1, 1), a = lt((r - o + 10) / 7);
  return a < 1 ? i === 5 || i === 6 && ln(n - 1) ? { week: 53, year: n - 1 } : { week: 52, year: n - 1 } : a === 53 && (ln(n) ? 366 : 365) - r < 4 - o ? { week: 1, year: n + 1 } : { week: a, year: n };
}
function At(n, e, t, r, o, i, a, c, d, u) {
  for (const h of [n, e, t, r, o, i, a, c, d, u]) if (h !== 0) return h < 0 ? -1 : 1;
  return 0;
}
function Pr(n, e) {
  let t = n, r = e;
  if (!tt(t) || !tt(r)) throw new RangeError("infinity is out of range");
  return r -= 1, t += lt(r / 12), r %= 12, r < 0 && (r += 12), r += 1, { year: t, month: r };
}
function po(n, e, t) {
  let r = n, o = e, i = t;
  if (!tt(i)) throw new RangeError("infinity is out of range");
  ({ year: r, month: o } = Pr(r, o));
  const a = 146097;
  if (le(i) > a) {
    const u = yn(i / a);
    r += 400 * u, i -= u * a;
  }
  let c = 0, d = o > 2 ? r : r - 1;
  for (; c = ln(d) ? 366 : 365, i < -c; ) r -= 1, d -= 1, i += c;
  for (d += 1; c = ln(d) ? 366 : 365, i > c; ) r += 1, d += 1, i -= c;
  for (; i < 1; ) ({ year: r, month: o } = Pr(r, o - 1)), i += Wt(r, o);
  for (; i > Wt(r, o); ) i -= Wt(r, o), { year: r, month: o } = Pr(r, o + 1);
  return { year: r, month: o, day: i };
}
function ti(n, e, t, r, o, i, a, c, d) {
  const { deltaDays: u, hour: h, minute: m, second: f, millisecond: g, microsecond: y, nanosecond: p } = qt(r, o, i, a, c, d), { year: w, month: v, day: T } = po(n, e, t + u);
  return { year: w, month: v, day: T, hour: h, minute: m, second: f, millisecond: g, microsecond: y, nanosecond: p };
}
function qt(n, e, t, r, o, i) {
  let a, c = l.BigInt(n), d = l.BigInt(e), u = l.BigInt(t), h = l.BigInt(r), m = l.BigInt(o), f = l.BigInt(i);
  return { quotient: a, remainder: f } = fn(f, ne), m = l.add(m, a), { quotient: a, remainder: m } = fn(m, ne), h = l.add(h, a), { quotient: a, remainder: h } = fn(h, ne), u = l.add(u, a), { quotient: a, remainder: u } = fn(u, Pt), d = l.add(d, a), { quotient: a, remainder: d } = fn(d, Pt), c = l.add(c, a), { quotient: a, remainder: c } = fn(c, Ia), { deltaDays: l.toNumber(a), hour: l.toNumber(c), minute: l.toNumber(d), second: l.toNumber(u), millisecond: l.toNumber(h), microsecond: l.toNumber(m), nanosecond: l.toNumber(f) };
}
function Bn(n, e, t, r, o, i, a, c) {
  const d = l.BigInt(n);
  let u = l.BigInt(a);
  n !== 0 && (u = l.subtract(l.BigInt(a), l.BigInt(c)));
  const h = l.add(l.BigInt(e), l.multiply(d, l.BigInt(24))), m = l.add(l.BigInt(t), l.multiply(h, Pt)), f = l.add(l.BigInt(r), l.multiply(m, Pt)), g = l.add(l.BigInt(o), l.multiply(f, ne)), y = l.add(l.BigInt(i), l.multiply(g, ne));
  return l.add(l.BigInt(u), l.multiply(y, ne));
}
function ni(n, e) {
  const t = I("%Temporal.Instant%"), r = Sn(l.toNumber(n));
  let o = l.BigInt(n), i = 864e11;
  if (r === 0) return { days: 0, nanoseconds: ve, dayLengthNs: i };
  if (!x(e)) {
    let E;
    return { quotient: E, remainder: o } = Ee(o, l.BigInt(i)), { days: l.toNumber(E), nanoseconds: o, dayLengthNs: i };
  }
  const a = s(e, F), c = s(e, Be), d = l.add(a, o), u = new t(d), h = s(e, ie), m = s(e, b), f = gt(h, c, m), g = gt(h, u, m);
  let { days: y } = ai(s(f, M), s(f, $), s(f, Y), s(f, j), s(f, U), s(f, z), s(f, q), s(f, B), s(f, Z), s(g, M), s(g, $), s(g, Y), s(g, j), s(g, U), s(g, z), s(g, q), s(g, B), s(g, Z), m, "day", We(null)), p = Tt(c, h, m, 0, 0, 0, y, 0, 0, 0, 0, 0, 0), w = l.BigInt(y);
  if (r === 1) for (; l.greaterThan(w, ve) && l.greaterThan(p, d); ) w = l.subtract(w, Hn), p = Tt(c, h, m, 0, 0, 0, l.toNumber(w), 0, 0, 0, 0, 0, 0);
  o = l.subtract(d, p);
  let v = !1, T = new t(p);
  do {
    const E = Tt(T, h, m, 0, 0, 0, r, 0, 0, 0, 0, 0, 0), D = s(T, F);
    i = l.toNumber(l.subtract(E, D)), v = l.greaterThanOrEqual(l.multiply(l.subtract(o, l.BigInt(i)), l.BigInt(r)), ve), v && (o = l.subtract(o, l.BigInt(i)), T = new t(E), w = l.add(w, l.BigInt(r)));
  } while (v);
  if (!wt(w) && ki(w) !== r) throw new RangeError("Time zone or calendar converted nanoseconds into a number of days with the opposite sign");
  if (!wt(o) && ki(o) !== r)
    throw qr(o) && r === 1 ? new Error("assert not reached") : new RangeError("Time zone or calendar ended up with a remainder of nanoseconds with the opposite sign");
  if (l.greaterThanOrEqual(It(o), It(l.BigInt(i)))) throw new Error("assert not reached");
  return { days: l.toNumber(w), nanoseconds: o, dayLengthNs: le(i) };
}
function Ct(n, e, t, r, o, i, a, c, d) {
  let u = Wa(n, e, t, r, o, i, a, c, d);
  if (u === "positive overflow" || u === "negative overflow") throw new RangeError("Duration out of range");
  return u;
}
function Wa(n, e, t, r, o, i, a, c, d) {
  let u, h, m, f, g, y, p = n;
  if (x(d)) {
    const C = Tt(s(d, Be), s(d, ie), s(d, b), 0, 0, 0, p, e, t, r, o, i, a), R = s(d, F);
    u = l.subtract(C, R);
  } else u = Bn(p, e, t, r, o, i, a, 0);
  c === "year" || c === "month" || c === "week" || c === "day" ? { days: p, nanoseconds: u } = ni(u, d) : p = 0;
  const w = l.lessThan(u, ve) ? -1 : 1;
  switch (u = It(u), h = m = f = g = y = ve, c) {
    case "year":
    case "month":
    case "week":
    case "day":
    case "hour":
      ({ quotient: h, remainder: u } = Ee(u, ne)), { quotient: m, remainder: h } = Ee(h, ne), { quotient: f, remainder: m } = Ee(m, ne), { quotient: g, remainder: f } = Ee(f, Pt), { quotient: y, remainder: g } = Ee(g, Pt);
      break;
    case "minute":
      ({ quotient: h, remainder: u } = Ee(u, ne)), { quotient: m, remainder: h } = Ee(h, ne), { quotient: f, remainder: m } = Ee(m, ne), { quotient: g, remainder: f } = Ee(f, Pt);
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
  const v = l.toNumber(y) * w, T = l.toNumber(g) * w, E = l.toNumber(f) * w, D = l.toNumber(m) * w, k = l.toNumber(h) * w, _ = l.toNumber(u) * w;
  for (const C of [p, v, T, E, D, k, _]) if (!tt(C)) return w === 1 ? "positive overflow" : "negative overflow";
  return { days: p, hours: v, minutes: T, seconds: E, milliseconds: D, microseconds: k, nanoseconds: _ };
}
function $r(n, e, t, r, o, i) {
  const a = I("%Temporal.Duration%"), c = At(n, e, t, r, 0, 0, 0, 0, 0, 0);
  if (c === 0) return { years: n, months: e, weeks: t, days: r };
  const d = l.BigInt(c);
  let u, h, m = l.BigInt(n), f = l.BigInt(e), g = l.BigInt(t), y = l.BigInt(r);
  i && (h = ae(i), u = s(h, b));
  const p = new a(c), w = new a(0, c), v = new a(0, 0, c);
  switch (o) {
    case "year":
      break;
    case "month":
      {
        if (!u) throw new RangeError("a starting point is required for months balancing");
        let T, E;
        for (typeof u != "string" && (T = oe(u, "dateAdd"), E = oe(u, "dateUntil")); !wt(m); ) {
          const D = Le(u, h, p, void 0, T), k = We(null);
          k.largestUnit = "month";
          const _ = on(u, h, D, k, E), C = l.BigInt(s(_, Ne));
          h = D, f = l.add(f, C), m = l.subtract(m, d);
        }
      }
      break;
    case "week": {
      if (!u) throw new RangeError("a starting point is required for weeks balancing");
      const T = typeof u != "string" ? oe(u, "dateAdd") : void 0;
      for (; !wt(m); ) {
        let E;
        ({ relativeTo: h, days: E } = qe(u, h, p, T)), y = l.add(y, l.BigInt(E)), m = l.subtract(m, d);
      }
      for (; !wt(f); ) {
        let E;
        ({ relativeTo: h, days: E } = qe(u, h, w, T)), y = l.add(y, l.BigInt(E)), f = l.subtract(f, d);
      }
      break;
    }
    default: {
      if (wt(m) && wt(f) && wt(g)) break;
      if (!u) throw new RangeError("a starting point is required for balancing calendar units");
      const T = typeof u != "string" ? oe(u, "dateAdd") : void 0;
      for (; !wt(m); ) {
        let E;
        ({ relativeTo: h, days: E } = qe(u, h, p, T)), y = l.add(y, l.BigInt(E)), m = l.subtract(m, d);
      }
      for (; !wt(f); ) {
        let E;
        ({ relativeTo: h, days: E } = qe(u, h, w, T)), y = l.add(y, l.BigInt(E)), f = l.subtract(f, d);
      }
      for (; !wt(g); ) {
        let E;
        ({ relativeTo: h, days: E } = qe(u, h, v, T)), y = l.add(y, l.BigInt(E)), g = l.subtract(g, d);
      }
      break;
    }
  }
  return { years: l.toNumber(m), months: l.toNumber(f), weeks: l.toNumber(g), days: l.toNumber(y) };
}
function zi(n, e, t, r, o) {
  if (x(n)) {
    const i = s(n, Be), a = s(n, ie), c = s(n, b), d = Ot(a, i), u = Tt(i, a, c, e, t, r, o, 0, 0, 0, 0, 0, 0);
    return Ot(a, new (I("%Temporal.Instant%"))(u)) - d;
  }
  return 0;
}
function Va(n) {
  return new (I("%Temporal.Duration%"))(-s(n, Ve), -s(n, Ne), -s(n, ot), -s(n, Ge), -s(n, He), -s(n, Ke), -s(n, Xe), -s(n, Qe), -s(n, Je), -s(n, et));
}
function at(n, e, t) {
  return zs(t, qs(e, n));
}
function Ga(n, e, t) {
  const r = at(e, 1, 12);
  return { year: n, month: r, day: at(t, 1, Wt(n, r)) };
}
function je(n, e, t) {
  if (n < e || n > t) throw new RangeError(`value out of range: ${e} <= ${n} <= ${t}`);
}
function St(n, e, t) {
  je(e, 1, 12), je(t, 1, Wt(n, e));
}
function Ha(n, e, t) {
  Ka(n, e, t, 12, 0, 0, 0, 0, 0);
}
function wo(n, e, t, r, o, i) {
  je(n, 0, 23), je(e, 0, 59), je(t, 0, 59), je(r, 0, 999), je(o, 0, 999), je(i, 0, 999);
}
function ri(n, e, t, r, o, i, a, c, d) {
  St(n, e, t), wo(r, o, i, a, c, d);
}
function Ka(n, e, t, r, o, i, a, c, d) {
  if (je(n, Ur, zr), n === Ur && sn(n, e, t + 1, r, o, i, a, c, d - 1) == null || n === zr && sn(n, e, t - 1, r, o, i, a, c, d + 1) == null) throw new RangeError("DateTime outside of supported range");
}
function gn(n) {
  if (l.lessThan(n, cr) || l.greaterThan(n, Ln)) throw new RangeError("Instant outside of supported range");
}
function Xr(n, e, t, r, o, i, a, c, d, u) {
  const h = At(n, e, t, r, o, i, a, c, d, u);
  for (const m of [n, e, t, r, o, i, a, c, d, u]) {
    if (!tt(m)) throw new RangeError("infinite values not allowed as duration fields");
    const f = Sn(m);
    if (f !== 0 && f !== h) throw new RangeError("mixed-sign values not allowed as duration fields");
  }
}
function oi(n, e, t, r, o, i, a) {
  switch (a) {
    case "year":
    case "month": {
      const c = -tn(n, e, t, r, o, i);
      if (c === 0) return { years: 0, months: 0, weeks: 0, days: 0 };
      const d = { year: n, month: e }, u = { year: r, month: o, day: i };
      let h = u.year - d.year, m = wn(n, e, t, h, 0, 0, 0, "constrain"), f = -tn(m.year, m.month, m.day, r, o, i);
      if (f === 0) return a === "year" ? { years: h, months: 0, weeks: 0, days: 0 } : { years: 0, months: 12 * h, weeks: 0, days: 0 };
      let g = u.month - d.month;
      if (f !== c && (h -= c, g += 12 * c), m = wn(n, e, t, h, g, 0, 0, "constrain"), f = -tn(m.year, m.month, m.day, r, o, i), f === 0) return a === "year" ? { years: h, months: g, weeks: 0, days: 0 } : { years: 0, months: g + 12 * h, weeks: 0, days: 0 };
      f !== c && (g -= c, g === -c && (h -= c, g = 11 * c), m = wn(n, e, t, h, g, 0, 0, "constrain"));
      let y = 0;
      return y = m.month === u.month ? u.day - m.day : c < 0 ? -m.day - (Wt(u.year, u.month) - u.day) : u.day + (Wt(m.year, m.month) - m.day), a === "month" && (g += 12 * h, h = 0), { years: h, months: g, weeks: 0, days: y };
    }
    case "week":
    case "day": {
      let c, d, u;
      tn(n, e, t, r, o, i) < 0 ? (d = { year: n, month: e, day: t }, c = { year: r, month: o, day: i }, u = 1) : (d = { year: r, month: o, day: i }, c = { year: n, month: e, day: t }, u = -1);
      let h = Kr(c.year, c.month, c.day) - Kr(d.year, d.month, d.day);
      for (let f = d.year; f < c.year; ++f) h += ln(f) ? 366 : 365;
      let m = 0;
      return a === "week" && (m = lt(h / 7), h %= 7), m *= u, h *= u, { years: 0, months: 0, weeks: m, days: h };
    }
    default:
      throw new Error("assert not reached");
  }
}
function Xa(n, e, t, r, o, i, a, c, d, u, h, m) {
  let f = a - n, g = c - e, y = d - t, p = u - r, w = h - o, v = m - i;
  const T = At(0, 0, 0, 0, f, g, y, p, w, v);
  f *= T, g *= T, y *= T, p *= T, w *= T, v *= T;
  let E = 0;
  if ({ deltaDays: E, hour: f, minute: g, second: y, millisecond: p, microsecond: w, nanosecond: v } = qt(f, g, y, p, w, v), E != 0) throw new Error("assertion failure in DifferenceTime: _bt_.[[Days]] should be 0");
  return f *= T, g *= T, y *= T, p *= T, w *= T, v *= T, { hours: f, minutes: g, seconds: y, milliseconds: p, microseconds: w, nanoseconds: v };
}
function ii(n, e, t, r, o, i) {
  const a = l.subtract(e, n);
  let c = 0, d = 0, u = l.toNumber(l.remainder(a, ne)), h = l.toNumber(l.remainder(l.divide(a, ne), ne)), m = l.toNumber(l.remainder(l.divide(a, vt), ne)), f = l.toNumber(l.divide(a, Nt));
  return { hours: c, minutes: d, seconds: f, milliseconds: m, microseconds: h, nanoseconds: u } = Xt(0, 0, 0, 0, 0, 0, f, m, h, u, t, r, i), Ct(0, c, d, f, m, h, u, o);
}
function ai(n, e, t, r, o, i, a, c, d, u, h, m, f, g, y, p, w, v, T, E, D) {
  let k = n, _ = e, C = t, { hours: R, minutes: P, seconds: re, milliseconds: Q, microseconds: J, nanoseconds: A } = Xa(r, o, i, a, c, d, f, g, y, p, w, v);
  const V = At(0, 0, 0, 0, R, P, re, Q, J, A);
  tn(u, h, m, k, _, C) === -V && ({ year: k, month: _, day: C } = po(k, _, C - V), { hours: R, minutes: P, seconds: re, milliseconds: Q, microseconds: J, nanoseconds: A } = Ct(-V, R, P, re, Q, J, A, E));
  const O = bt(k, _, C, T), S = bt(u, h, m, T), H = En("day", E), Ce = un(D);
  Ce.largestUnit = H;
  let { years: Me, months: Oe, weeks: be, days: ut } = on(T, O, S, Ce);
  return { days: ut, hours: R, minutes: P, seconds: re, milliseconds: Q, microseconds: J, nanoseconds: A } = Ct(ut, R, P, re, Q, J, A, E), { years: Me, months: Oe, weeks: be, days: ut, hours: R, minutes: P, seconds: re, milliseconds: Q, microseconds: J, nanoseconds: A };
}
function Qa(n, e, t, r, o, i) {
  const a = l.subtract(e, n);
  if (l.equal(a, ve)) return { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, microseconds: 0, nanoseconds: 0 };
  const c = I("%Temporal.Instant%"), d = new c(n), u = new c(e), h = gt(t, d, r), m = gt(t, u, r);
  let { years: f, months: g, weeks: y, days: p } = ai(s(h, M), s(h, $), s(h, Y), s(h, j), s(h, U), s(h, z), s(h, q), s(h, B), s(h, Z), s(m, M), s(m, $), s(m, Y), s(m, j), s(m, U), s(m, z), s(m, q), s(m, B), s(m, Z), r, o, i);
  const w = Tt(d, t, r, f, g, y, 0, 0, 0, 0, 0, 0, 0);
  let v = l.subtract(e, w);
  const T = Se(w, t, r);
  ({ nanoseconds: v, days: p } = ni(v, T));
  const { hours: E, minutes: D, seconds: k, milliseconds: _, microseconds: C, nanoseconds: R } = Ct(0, 0, 0, 0, 0, 0, l.toNumber(v), "hour");
  return { years: f, months: g, weeks: y, days: p, hours: E, minutes: D, seconds: k, milliseconds: _, microseconds: C, nanoseconds: R };
}
function er(n, e, t, r, o, i) {
  const a = yr.reduce((g, y) => {
    const p = y[0], w = y[1], v = y[2];
    return t !== "datetime" && v !== t || r.includes(w) || g.push(w, p), g;
  }, []);
  let c = ct(e, "largestUnit", t, "auto");
  if (r.includes(c)) throw new RangeError(`largestUnit must be one of ${a.join(", ")}, not ${c}`);
  const d = Xn(e);
  let u = Mt(e, "trunc");
  n === "since" && (u = function(y) {
    switch (y) {
      case "ceil":
        return "floor";
      case "floor":
        return "ceil";
      case "halfCeil":
        return "halfFloor";
      case "halfFloor":
        return "halfCeil";
      default:
        return y;
    }
  }(u));
  const h = ct(e, "smallestUnit", t, o);
  if (r.includes(h)) throw new RangeError(`smallestUnit must be one of ${a.join(", ")}, not ${h}`);
  const m = En(i, h);
  if (c === "auto" && (c = m), En(c, h) !== c) throw new RangeError(`largestUnit ${c} cannot be smaller than smallestUnit ${h}`);
  const f = { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[h];
  return f !== void 0 && Qn(d, f, !1), { largestUnit: c, roundingIncrement: d, roundingMode: u, smallestUnit: h };
}
function qi(n, e, t, r) {
  const o = n === "since" ? -1 : 1, i = kt(t), a = er(n, un(r), "time", [], "nanosecond", "second"), c = s(e, F), d = s(i, F);
  let { hours: u, minutes: h, seconds: m, milliseconds: f, microseconds: g, nanoseconds: y } = ii(c, d, a.roundingIncrement, a.smallestUnit, a.largestUnit, a.roundingMode);
  return new (I("%Temporal.Duration%"))(0, 0, 0, 0, o * u, o * h, o * m, o * f, o * g, o * y);
}
function Bi(n, e, t, r) {
  const o = n === "since" ? -1 : 1, i = ae(t), a = s(e, b);
  fo(a, s(i, b), "compute difference between dates");
  const c = un(r), d = er(n, c, "date", [], "day", "day");
  c.largestUnit = d.largestUnit;
  let { years: u, months: h, weeks: m, days: f } = on(a, e, i, c);
  return d.smallestUnit === "day" && d.roundingIncrement === 1 || ({ years: u, months: h, weeks: m, days: f } = Xt(u, h, m, f, 0, 0, 0, 0, 0, 0, d.roundingIncrement, d.smallestUnit, d.roundingMode, e)), new (I("%Temporal.Duration%"))(o * u, o * h, o * m, o * f, 0, 0, 0, 0, 0, 0);
}
function Zi(n, e, t, r) {
  const o = n === "since" ? -1 : 1, i = pn(t), a = s(e, b);
  fo(a, s(i, b), "compute difference between dates");
  const c = un(r), d = er(n, c, "datetime", [], "nanosecond", "day");
  let { years: u, months: h, weeks: m, days: f, hours: g, minutes: y, seconds: p, milliseconds: w, microseconds: v, nanoseconds: T } = ai(s(e, M), s(e, $), s(e, Y), s(e, j), s(e, U), s(e, z), s(e, q), s(e, B), s(e, Z), s(i, M), s(i, $), s(i, Y), s(i, j), s(i, U), s(i, z), s(i, q), s(i, B), s(i, Z), a, d.largestUnit, c);
  const E = qn(e);
  return { years: u, months: h, weeks: m, days: f, hours: g, minutes: y, seconds: p, milliseconds: w, microseconds: v, nanoseconds: T } = Xt(u, h, m, f, g, y, p, w, v, T, d.roundingIncrement, d.smallestUnit, d.roundingMode, E), { days: f, hours: g, minutes: y, seconds: p, milliseconds: w, microseconds: v, nanoseconds: T } = Ct(f, g, y, p, w, v, T, d.largestUnit), new (I("%Temporal.Duration%"))(o * u, o * h, o * m, o * f, o * g, o * y, o * p, o * w, o * v, o * T);
}
function Wi(n, e, t, r) {
  const o = n === "since" ? -1 : 1, i = Bt(t), a = er(n, un(r), "time", [], "nanosecond", "hour");
  let { hours: c, minutes: d, seconds: u, milliseconds: h, microseconds: m, nanoseconds: f } = Xa(s(e, j), s(e, U), s(e, z), s(e, q), s(e, B), s(e, Z), s(i, j), s(i, U), s(i, z), s(i, q), s(i, B), s(i, Z));
  return { hours: c, minutes: d, seconds: u, milliseconds: h, microseconds: m, nanoseconds: f } = Xt(0, 0, 0, 0, c, d, u, h, m, f, a.roundingIncrement, a.smallestUnit, a.roundingMode), { hours: c, minutes: d, seconds: u, milliseconds: h, microseconds: m, nanoseconds: f } = Ct(0, c, d, u, h, m, f, a.largestUnit), new (I("%Temporal.Duration%"))(0, 0, 0, 0, o * c, o * d, o * u, o * h, o * m, o * f);
}
function Vi(n, e, t, r) {
  const o = n === "since" ? -1 : 1, i = rr(t), a = s(e, b);
  fo(a, s(i, b), "compute difference between months");
  const c = un(r), d = er(n, c, "date", ["week", "day"], "month", "year");
  c.largestUnit = d.largestUnit;
  const u = ke(a, ["monthCode", "year"]), h = G(e, u, []);
  h.day = 1;
  const m = Kt(a, h), f = G(i, u, []);
  f.day = 1;
  const g = Kt(a, f);
  let { years: y, months: p } = on(a, m, g, c);
  return d.smallestUnit === "month" && d.roundingIncrement === 1 || ({ years: y, months: p } = Xt(y, p, 0, 0, 0, 0, 0, 0, 0, 0, d.roundingIncrement, d.smallestUnit, d.roundingMode, m)), new (I("%Temporal.Duration%"))(o * y, o * p, 0, 0, 0, 0, 0, 0, 0, 0);
}
function Gi(n, e, t, r) {
  const o = n === "since" ? -1 : 1, i = or(t), a = s(e, b);
  fo(a, s(i, b), "compute difference between dates");
  const c = un(r), d = er(n, c, "datetime", [], "nanosecond", "hour");
  c.largestUnit = d.largestUnit;
  const u = s(e, F), h = s(i, F);
  let m, f, g, y, p, w, v, T, E, D;
  if (d.largestUnit !== "year" && d.largestUnit !== "month" && d.largestUnit !== "week" && d.largestUnit !== "day") m = 0, f = 0, g = 0, y = 0, { hours: p, minutes: w, seconds: v, milliseconds: T, microseconds: E, nanoseconds: D } = ii(u, h, d.roundingIncrement, d.smallestUnit, d.largestUnit, d.roundingMode);
  else {
    const k = s(e, ie);
    if (!La(k, s(i, ie))) throw new RangeError("When calculating difference between time zones, largestUnit must be 'hours' or smaller because day lengths can vary between time zones due to DST or time zone offset changes.");
    ({ years: m, months: f, weeks: g, days: y, hours: p, minutes: w, seconds: v, milliseconds: T, microseconds: E, nanoseconds: D } = Qa(u, h, k, a, d.largestUnit, c)), { years: m, months: f, weeks: g, days: y, hours: p, minutes: w, seconds: v, milliseconds: T, microseconds: E, nanoseconds: D } = Xt(m, f, g, y, p, w, v, T, E, D, d.roundingIncrement, d.smallestUnit, d.roundingMode, e), { years: m, months: f, weeks: g, days: y, hours: p, minutes: w, seconds: v, milliseconds: T, microseconds: E, nanoseconds: D } = ns(m, f, g, y, p, w, v, T, E, D, d.roundingIncrement, d.smallestUnit, d.roundingMode, e);
  }
  return new (I("%Temporal.Duration%"))(o * m, o * f, o * g, o * y, o * p, o * w, o * v, o * T, o * E, o * D);
}
function wn(n, e, t, r, o, i, a, c) {
  let d = n, u = e, h = t, m = i, f = a;
  return d += r, u += o, { year: d, month: u } = Pr(d, u), { year: d, month: u, day: h } = Zr(d, u, h, c), f += 7 * m, h += f, { year: d, month: u, day: h } = po(d, u, h), { year: d, month: u, day: h };
}
function Ja(n, e, t, r, o, i, a, c, d, u, h, m) {
  let f = n, g = e, y = t, p = r, w = o, v = i;
  f += a, g += c, y += d, p += u, w += h, v += m;
  let T = 0;
  return { deltaDays: T, hour: f, minute: g, second: y, millisecond: p, microsecond: w, nanosecond: v } = qt(f, g, y, p, w, v), { deltaDays: T, hour: f, minute: g, second: y, millisecond: p, microsecond: w, nanosecond: v };
}
function es(n, e, t, r, o, i, a, c, d, u, h, m, f, g, y, p, w, v, T, E, D) {
  const k = En(Po(n, e, t, r, o, i, a, c, d, u), Po(h, m, f, g, y, p, w, v, T, E));
  let _, C, R, P, re, Q, J, A, V, O;
  if (D) if (K(D)) {
    const S = I("%Temporal.Duration%"), H = s(D, b), Ce = new S(n, e, t, r, 0, 0, 0, 0, 0, 0), Me = new S(h, m, f, g, 0, 0, 0, 0, 0, 0), Oe = typeof H != "string" ? oe(H, "dateAdd") : void 0, be = Le(H, D, Ce, void 0, Oe), ut = Le(H, be, Me, void 0, Oe), Rt = En("day", k), $t = We(null);
    $t.largestUnit = Rt, { years: _, months: C, weeks: R, days: P } = on(H, D, ut, $t), { days: P, hours: re, minutes: Q, seconds: J, milliseconds: A, microseconds: V, nanoseconds: O } = Ct(P, l.add(l.BigInt(o), l.BigInt(y)), l.add(l.BigInt(i), l.BigInt(p)), l.add(l.BigInt(a), l.BigInt(w)), l.add(l.BigInt(c), l.BigInt(v)), l.add(l.BigInt(d), l.BigInt(T)), l.add(l.BigInt(u), l.BigInt(E)), k);
  } else {
    const S = I("%Temporal.Instant%"), H = s(D, ie), Ce = s(D, b), Me = Tt(s(D, Be), H, Ce, n, e, t, r, o, i, a, c, d, u), Oe = Tt(new S(Me), H, Ce, h, m, f, g, y, p, w, v, T, E);
    k !== "year" && k !== "month" && k !== "week" && k !== "day" ? (_ = 0, C = 0, R = 0, P = 0, { hours: re, minutes: Q, seconds: J, milliseconds: A, microseconds: V, nanoseconds: O } = ii(s(D, F), Oe, 1, "nanosecond", k, "halfExpand")) : { years: _, months: C, weeks: R, days: P, hours: re, minutes: Q, seconds: J, milliseconds: A, microseconds: V, nanoseconds: O } = Qa(s(D, F), Oe, H, Ce, k, We(null));
  }
  else {
    if (k === "year" || k === "month" || k === "week") throw new RangeError("relativeTo is required for years, months, or weeks arithmetic");
    _ = C = R = 0, { days: P, hours: re, minutes: Q, seconds: J, milliseconds: A, microseconds: V, nanoseconds: O } = Ct(r + g, l.add(l.BigInt(o), l.BigInt(y)), l.add(l.BigInt(i), l.BigInt(p)), l.add(l.BigInt(a), l.BigInt(w)), l.add(l.BigInt(c), l.BigInt(v)), l.add(l.BigInt(d), l.BigInt(T)), l.add(l.BigInt(u), l.BigInt(E)), k);
  }
  return Xr(_, C, R, P, re, Q, J, A, V, O), { years: _, months: C, weeks: R, days: P, hours: re, minutes: Q, seconds: J, milliseconds: A, microseconds: V, nanoseconds: O };
}
function So(n, e, t, r, o, i, a) {
  let c = ve;
  c = l.add(c, l.BigInt(a)), c = l.add(c, l.multiply(l.BigInt(i), ne)), c = l.add(c, l.multiply(l.BigInt(o), vt)), c = l.add(c, l.multiply(l.BigInt(r), Nt)), c = l.add(c, l.multiply(l.BigInt(t), l.BigInt(6e10))), c = l.add(c, l.multiply(l.BigInt(e), l.BigInt(36e11)));
  const d = l.add(n, c);
  return gn(d), d;
}
function Lo(n, e, t, r, o, i, a, c, d, u, h, m, f, g, y, p, w, v, T, E, D) {
  let k = g, { deltaDays: _, hour: C, minute: R, second: P, millisecond: re, microsecond: Q, nanosecond: J } = Ja(r, o, i, a, c, d, y, p, w, v, T, E);
  k += _;
  const A = I("%Temporal.Duration%"), V = Le(u, bt(n, e, t, u), new A(h, m, f, k, 0, 0, 0, 0, 0, 0), D);
  return { year: s(V, M), month: s(V, $), day: s(V, Y), hour: C, minute: R, second: P, millisecond: re, microsecond: Q, nanosecond: J };
}
function Tt(n, e, t, r, o, i, a, c, d, u, h, m, f, g) {
  const y = I("%Temporal.Duration%");
  if (At(r, o, i, a, 0, 0, 0, 0, 0, 0) === 0) return So(s(n, F), c, d, u, h, m, f);
  const p = gt(e, n, t), w = Le(t, bt(s(p, M), s(p, $), s(p, Y), t), new y(r, o, i, a, 0, 0, 0, 0, 0, 0), g), v = it(s(w, M), s(w, $), s(w, Y), s(p, j), s(p, U), s(p, z), s(p, q), s(p, B), s(p, Z), t);
  return So(s(nt(e, v, "compatible"), F), c, d, u, h, m, f);
}
function Hi(n, e, t, r) {
  const o = n === "subtract" ? -1 : 1;
  let { years: i, months: a, weeks: c, days: d, hours: u, minutes: h, seconds: m, milliseconds: f, microseconds: g, nanoseconds: y } = In(t);
  const p = xr(X(r));
  return { years: i, months: a, weeks: c, days: d, hours: u, minutes: h, seconds: m, milliseconds: f, microseconds: g, nanoseconds: y } = es(s(e, Ve), s(e, Ne), s(e, ot), s(e, Ge), s(e, He), s(e, Ke), s(e, Xe), s(e, Qe), s(e, Je), s(e, et), o * i, o * a, o * c, o * d, o * u, o * h, o * m, o * f, o * g, o * y, p), new (I("%Temporal.Duration%"))(i, a, c, d, u, h, m, f, g, y);
}
function Ki(n, e, t) {
  const r = n === "subtract" ? -1 : 1, { hours: o, minutes: i, seconds: a, milliseconds: c, microseconds: d, nanoseconds: u } = function(f, g) {
    let y = In(f);
    for (const p of g) if (y[p] !== 0) throw new RangeError(`Duration field ${p} not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead.`);
    return y;
  }(t, ["years", "months", "weeks", "days"]), h = So(s(e, F), r * o, r * i, r * a, r * c, r * d, r * u);
  return new (I("%Temporal.Instant%"))(h);
}
function Xi(n, e, t, r) {
  const o = n === "subtract" ? -1 : 1, { years: i, months: a, weeks: c, days: d, hours: u, minutes: h, seconds: m, milliseconds: f, microseconds: g, nanoseconds: y } = In(t), p = X(r), w = s(e, b), { year: v, month: T, day: E, hour: D, minute: k, second: _, millisecond: C, microsecond: R, nanosecond: P } = Lo(s(e, M), s(e, $), s(e, Y), s(e, j), s(e, U), s(e, z), s(e, q), s(e, B), s(e, Z), w, o * i, o * a, o * c, o * d, o * u, o * h, o * m, o * f, o * g, o * y, p);
  return it(v, T, E, D, k, _, C, R, P, w);
}
function Qi(n, e, t) {
  const r = n === "subtract" ? -1 : 1, { hours: o, minutes: i, seconds: a, milliseconds: c, microseconds: d, nanoseconds: u } = In(t);
  let { hour: h, minute: m, second: f, millisecond: g, microsecond: y, nanosecond: p } = Ja(s(e, j), s(e, U), s(e, z), s(e, q), s(e, B), s(e, Z), r * o, r * i, r * a, r * c, r * d, r * u);
  return { hour: h, minute: m, second: f, millisecond: g, microsecond: y, nanosecond: p } = oo(h, m, f, g, y, p, "reject"), new (I("%Temporal.PlainTime%"))(h, m, f, g, y, p);
}
function Ji(n, e, t, r) {
  let o = In(t);
  n === "subtract" && (o = { years: -o.years, months: -o.months, weeks: -o.weeks, days: -o.days, hours: -o.hours, minutes: -o.minutes, seconds: -o.seconds, milliseconds: -o.milliseconds, microseconds: -o.microseconds, nanoseconds: -o.nanoseconds });
  let { years: i, months: a, weeks: c, days: d, hours: u, minutes: h, seconds: m, milliseconds: f, microseconds: g, nanoseconds: y } = o;
  ({ days: d } = Ct(d, u, h, m, f, g, y, "day"));
  const p = X(r), w = s(e, b), v = ke(w, ["monthCode", "year"]), T = G(e, v, []), E = We(null);
  Yn(E, T, []), T.day = 1;
  let D = Kt(w, T);
  const k = At(i, a, c, d, 0, 0, 0, 0, 0, 0), _ = oe(w, "dateAdd"), C = I("%Temporal.Duration%");
  if (k < 0) {
    const re = Le(w, D, new C(0, 1, 0, 0, 0, 0, 0, 0, 0, 0), void 0, _), Q = Le(w, re, new C(0, 0, 0, -1, 0, 0, 0, 0, 0, 0), void 0, _);
    E.day = Er(w, Q), D = Kt(w, E);
  }
  const R = new C(i, a, c, d, 0, 0, 0, 0, 0, 0), P = un(p);
  return Cn(w, G(Le(w, D, R, p, _), v, []), P);
}
function ea(n, e, t, r) {
  const o = n === "subtract" ? -1 : 1, { years: i, months: a, weeks: c, days: d, hours: u, minutes: h, seconds: m, milliseconds: f, microseconds: g, nanoseconds: y } = In(t), p = X(r), w = s(e, ie), v = s(e, b);
  return Se(Tt(s(e, Be), w, v, o * i, o * a, o * c, o * d, o * u, o * h, o * m, o * f, o * g, o * y, p), w, v);
}
function ft(n, e, t) {
  if (l.equal(e, Hn)) return n;
  let { quotient: r, remainder: o } = Ee(n, e);
  if (l.equal(o, ve)) return n;
  const i = l.lessThan(o, ve) ? -1 : 1, a = It(l.multiply(o, l.BigInt(2))), c = l.equal(a, e), d = l.greaterThan(a, e);
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
      (d || c && l.toNumber(l.remainder(It(r), l.BigInt(2))) === 1) && (r = l.add(r, l.BigInt(i)));
  }
  return l.multiply(r, e);
}
function Qr(n, e, t, r) {
  let { remainder: o } = fn(n, Ft);
  const i = l.subtract(n, o), a = ft(o, l.BigInt(is[t] * e), r);
  return l.add(i, a);
}
function si(n, e, t, r, o, i, a, c, d, u, h, m, f = 864e11) {
  const { deltaDays: g, hour: y, minute: p, second: w, millisecond: v, microsecond: T, nanosecond: E } = li(r, o, i, a, c, d, u, h, m, f), { year: D, month: k, day: _ } = po(n, e, t + g);
  return { year: D, month: k, day: _, hour: y, minute: p, second: w, millisecond: v, microsecond: T, nanosecond: E };
}
function li(n, e, t, r, o, i, a, c, d, u = 864e11) {
  let h = ve;
  switch (c) {
    case "day":
    case "hour":
      h = l.BigInt(n);
    case "minute":
      h = l.add(l.multiply(h, Pt), l.BigInt(e));
    case "second":
      h = l.add(l.multiply(h, Pt), l.BigInt(t));
    case "millisecond":
      h = l.add(l.multiply(h, ne), l.BigInt(r));
    case "microsecond":
      h = l.add(l.multiply(h, ne), l.BigInt(o));
    case "nanosecond":
      h = l.add(l.multiply(h, ne), l.BigInt(i));
  }
  const m = c === "day" ? u : is[c], f = ft(h, l.BigInt(m * a), d), g = l.toNumber(l.divide(f, l.BigInt(m)));
  switch (c) {
    case "day":
      return { deltaDays: g, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
    case "hour":
      return qt(g, 0, 0, 0, 0, 0);
    case "minute":
      return qt(n, g, 0, 0, 0, 0);
    case "second":
      return qt(n, e, g, 0, 0, 0);
    case "millisecond":
      return qt(n, e, t, g, 0, 0);
    case "microsecond":
      return qt(n, e, t, r, g, 0);
    case "nanosecond":
      return qt(n, e, t, r, o, g);
    default:
      throw new Error(`Invalid unit ${c}`);
  }
}
function Nr(n, e) {
  return oi(s(n, M), s(n, $), s(n, Y), s(e, M), s(e, $), s(e, Y), "day").days;
}
function qe(n, e, t, r) {
  const o = Le(n, e, t, void 0, r);
  return { relativeTo: o, days: Nr(e, o) };
}
function ts(n, e, t, r, o) {
  const i = s(n, ie), a = s(n, b);
  return Se(Tt(s(n, Be), i, a, e, t, r, o, 0, 0, 0, 0, 0, 0), i, a);
}
function ns(n, e, t, r, o, i, a, c, d, u, h, m, f, g) {
  let y = n, p = e, w = t, v = r, T = o, E = i, D = a, k = c, _ = d, C = u;
  if (!x(g) || m === "year" || m === "month" || m === "week" || m === "day" || m === "nanosecond" && h === 1) return { years: y, months: p, weeks: w, days: v, hours: T, minutes: E, seconds: D, milliseconds: k, microseconds: _, nanoseconds: C };
  let R = Bn(0, T, E, D, k, _, C, 0);
  const P = Sn(l.toNumber(R)), re = s(g, ie), Q = s(g, b), J = Tt(s(g, Be), re, Q, y, p, w, v, 0, 0, 0, 0, 0, 0), A = Tt(new (I("%Temporal.Instant%"))(J), re, Q, 0, 0, 0, P, 0, 0, 0, 0, 0, 0), V = l.subtract(A, J);
  return l.greaterThanOrEqual(l.multiply(l.subtract(R, V), l.BigInt(P)), ve) && ({ years: y, months: p, weeks: w, days: v } = es(y, p, w, v, 0, 0, 0, 0, 0, 0, 0, 0, 0, P, 0, 0, 0, 0, 0, 0, g), R = Qr(l.subtract(R, V), h, m, f), { hours: T, minutes: E, seconds: D, milliseconds: k, microseconds: _, nanoseconds: C } = Ct(0, 0, 0, 0, 0, 0, l.toNumber(R), "hour")), { years: y, months: p, weeks: w, days: v, hours: T, minutes: E, seconds: D, milliseconds: k, microseconds: _, nanoseconds: C };
}
function Xt(n, e, t, r, o, i, a, c, d, u, h, m, f, g) {
  let y = n, p = e, w = t, v = r, T = o, E = i, D = a, k = c, _ = d, C = l.BigInt(u);
  const R = I("%Temporal.Duration%");
  let P, re, Q, J, A = g;
  if (A) {
    if (x(A)) re = A, A = ae(A);
    else if (!K(A)) throw new TypeError("starting point must be PlainDate or ZonedDateTime");
    P = s(A, b);
  }
  if (m === "year" || m === "month" || m === "week" || m === "day") {
    let V, O, S;
    C = Bn(0, T, E, D, k, _, u, 0), re && (V = ts(re, y, p, w, v)), { days: O, nanoseconds: C, dayLengthNs: S } = ni(C, V), Q = l.BigInt(S), v += O, T = E = D = k = _ = 0;
  }
  switch (m) {
    case "year": {
      if (!P) throw new RangeError("A starting point is required for years rounding");
      const V = new R(y), O = typeof P != "string" ? oe(P, "dateAdd") : void 0, S = Le(P, A, V, void 0, O), H = Le(P, A, new R(y, p, w), void 0, O);
      A = S, v += Nr(S, H);
      const Ce = Le(P, A, new R(0, 0, 0, v), void 0, O), Me = We(null);
      Me.largestUnit = "year";
      const Oe = on(P, A, Ce, Me).years;
      y += Oe;
      const be = A;
      A = Le(P, A, new R(Oe), void 0, O), v -= Nr(be, A);
      const ut = new R(v < 0 ? -1 : 1);
      let { days: Rt } = qe(P, A, ut, O);
      Rt = le(Rt);
      const $t = l.multiply(l.BigInt(Rt), Q);
      C = l.add(l.add(l.multiply($t, l.BigInt(y)), l.multiply(l.BigInt(v), Q)), C);
      const ht = ft(C, l.multiply($t, l.BigInt(h)), f);
      J = Yt(C, $t), y = l.toNumber(l.divide(ht, $t)), C = ve, p = w = v = 0;
      break;
    }
    case "month": {
      if (!P) throw new RangeError("A starting point is required for months rounding");
      const V = new R(y, p), O = typeof P != "string" ? oe(P, "dateAdd") : void 0, S = Le(P, A, V, void 0, O), H = Le(P, A, new R(y, p, w), void 0, O);
      A = S, v += Nr(S, H);
      const Ce = Sn(v), Me = new R(0, v < 0 ? -1 : 1);
      let Oe;
      for ({ relativeTo: A, days: Oe } = qe(P, A, Me, O); le(v) >= le(Oe); ) p += Ce, v -= Oe, { relativeTo: A, days: Oe } = qe(P, A, Me, O);
      Oe = le(Oe);
      const be = l.multiply(l.BigInt(Oe), Q);
      C = l.add(l.add(l.multiply(be, l.BigInt(p)), l.multiply(l.BigInt(v), Q)), C);
      const ut = ft(C, l.multiply(be, l.BigInt(h)), f);
      J = Yt(C, be), p = l.toNumber(l.divide(ut, be)), C = ve, w = v = 0;
      break;
    }
    case "week": {
      if (!P) throw new RangeError("A starting point is required for weeks rounding");
      const V = Sn(v), O = new R(0, 0, v < 0 ? -1 : 1), S = typeof P != "string" ? oe(P, "dateAdd") : void 0;
      let H;
      for ({ relativeTo: A, days: H } = qe(P, A, O, S); le(v) >= le(H); ) w += V, v -= H, { relativeTo: A, days: H } = qe(P, A, O, S);
      H = le(H);
      const Ce = l.multiply(l.BigInt(H), Q);
      C = l.add(l.add(l.multiply(Ce, l.BigInt(w)), l.multiply(l.BigInt(v), Q)), C);
      const Me = ft(C, l.multiply(Ce, l.BigInt(h)), f);
      J = Yt(C, Ce), w = l.toNumber(l.divide(Me, Ce)), C = ve, v = 0;
      break;
    }
    case "day": {
      const V = Q;
      C = l.add(l.multiply(V, l.BigInt(v)), C);
      const O = ft(C, l.multiply(V, l.BigInt(h)), f);
      J = Yt(C, V), v = l.toNumber(l.divide(O, V)), C = ve;
      break;
    }
    case "hour": {
      let O = l.multiply(l.BigInt(T), l.BigInt(36e11));
      O = l.add(O, l.multiply(l.BigInt(E), l.BigInt(6e10))), O = l.add(O, l.multiply(l.BigInt(D), Nt)), O = l.add(O, l.multiply(l.BigInt(k), vt)), O = l.add(O, l.multiply(l.BigInt(_), ne)), O = l.add(O, C), J = Yt(O, l.BigInt(36e11));
      const S = ft(O, l.BigInt(36e11 * h), f);
      T = l.toNumber(l.divide(S, l.BigInt(36e11))), C = ve, E = D = k = _ = 0;
      break;
    }
    case "minute": {
      let O = l.multiply(l.BigInt(E), l.BigInt(6e10));
      O = l.add(O, l.multiply(l.BigInt(D), Nt)), O = l.add(O, l.multiply(l.BigInt(k), vt)), O = l.add(O, l.multiply(l.BigInt(_), ne)), O = l.add(O, C), J = Yt(O, l.BigInt(6e10));
      const S = ft(O, l.BigInt(6e10 * h), f);
      E = l.toNumber(l.divide(S, l.BigInt(6e10))), C = ve, D = k = _ = 0;
      break;
    }
    case "second": {
      let O = l.multiply(l.BigInt(D), Nt);
      O = l.add(O, l.multiply(l.BigInt(k), vt)), O = l.add(O, l.multiply(l.BigInt(_), ne)), O = l.add(O, C), J = Yt(O, l.BigInt(1e9));
      const S = ft(O, l.BigInt(1e9 * h), f);
      D = l.toNumber(l.divide(S, l.BigInt(1e9))), C = ve, k = _ = 0;
      break;
    }
    case "millisecond": {
      let O = l.multiply(l.BigInt(k), vt);
      O = l.add(O, l.multiply(l.BigInt(_), ne)), O = l.add(O, C), J = Yt(O, l.BigInt(1e6));
      const S = ft(O, l.BigInt(1e6 * h), f);
      k = l.toNumber(l.divide(S, l.BigInt(1e6))), C = ve, _ = 0;
      break;
    }
    case "microsecond": {
      let O = l.multiply(l.BigInt(_), ne);
      O = l.add(O, C), J = Yt(O, l.BigInt(1e3));
      const S = ft(O, l.BigInt(1e3 * h), f);
      _ = l.toNumber(l.divide(S, l.BigInt(1e3))), C = ve;
      break;
    }
    case "nanosecond":
      J = l.toNumber(C), C = ft(l.BigInt(C), l.BigInt(h), f);
  }
  return { years: y, months: p, weeks: w, days: v, hours: T, minutes: E, seconds: D, milliseconds: k, microseconds: _, nanoseconds: l.toNumber(C), total: J };
}
function tn(n, e, t, r, o, i) {
  for (const [a, c] of [[n, r], [e, o], [t, i]]) if (a !== c) return vn(a - c);
  return 0;
}
function fn(n, e) {
  let { quotient: t, remainder: r } = Ee(n, e);
  return l.lessThan(r, ve) && (t = l.subtract(t, Hn), r = l.add(r, e)), { quotient: t, remainder: r };
}
function Pn(n, e) {
  const { quotient: t, remainder: r } = Ee(n, e);
  return wt(r) || !qr(n) == !qr(e) ? t : l.subtract(t, Hn);
}
function Yt(n, e) {
  const { quotient: t, remainder: r } = Ee(n, e);
  return l.toNumber(t) + l.toNumber(r) / l.toNumber(e);
}
function Jr(n) {
  const e = ir(n);
  return globalThis.BigInt !== void 0 ? globalThis.BigInt(e.toString(10)) : e;
}
function ir(n) {
  let e = n;
  if (typeof n == "object") {
    const t = n[Symbol.toPrimitive];
    t && typeof t == "function" && (e = ro(t, n, ["number"]));
  }
  if (typeof e == "number") throw new TypeError("cannot convert number to bigint");
  return typeof e == "bigint" ? l.BigInt(e.toString(10)) : l.BigInt(e);
}
const ci = (() => {
  let n = l.BigInt(Date.now() % 1e6);
  return () => {
    const e = l.BigInt(Date.now()), t = l.add(l.multiply(e, vt), n);
    return n = l.remainder(e, vt), l.greaterThan(t, Ln) ? Ln : l.lessThan(t, cr) ? cr : t;
  };
})();
function en() {
  return new _a().resolvedOptions().timeZone;
}
function vn(n) {
  return n < 0 ? -1 : n > 0 ? 1 : n;
}
function X(n) {
  if (n === void 0) return We(null);
  if (ce(n) && n !== null) return n;
  throw new TypeError("Options parameter must be an object, not " + (n === null ? "null" : typeof n));
}
function Zn(n, e) {
  const t = We(null);
  return t[n] = e, t;
}
function un(n) {
  const e = We(null);
  return Yn(e, X(n), []), e;
}
function cn(n, e, t, r) {
  let o = n[e];
  if (o !== void 0) {
    if (o = rt(o), !t.includes(o)) throw new RangeError(`${e} must be one of ${t.join(", ")}, not ${o}`);
    return o;
  }
  return r;
}
function Qt(n) {
  return Ks.includes(Lt(n));
}
function Lt(n) {
  return n.replace(/[A-Z]/g, (e) => {
    const t = e.charCodeAt(0);
    return String.fromCharCode(t + 32);
  });
}
const rs = new RegExp(`^${Ea.source}$`);
function os(n, e, t, r = n(e), o = n(t)) {
  let i = l.BigInt(e), a = l.BigInt(t), c = r, d = o;
  for (; l.greaterThan(l.subtract(a, i), Hn); ) {
    const u = l.divide(l.add(i, a), l.BigInt(2)), h = n(u);
    if (h === c) i = u, c = h;
    else {
      if (h !== d) throw new Error(`invalid state in bisection ${c} - ${h} - ${d}`);
      a = u, d = h;
    }
  }
  return a;
}
const is = { hour: 36e11, minute: 6e10, second: 1e9, millisecond: 1e6, microsecond: 1e3, nanosecond: 1 }, as = Symbol("date"), ss = Symbol("ym"), ls = Symbol("md"), cs = Symbol("time"), ds = Symbol("datetime"), us = Symbol("instant"), Nn = Symbol("original"), On = Symbol("timezone"), Et = Symbol("calendar-id"), hs = Symbol("locale"), jo = Symbol("options"), ar = (n) => ({ value: n, enumerable: !0, writable: !1, configurable: !0 }), An = globalThis.Intl.DateTimeFormat, Jt = Object.assign, tl = Object.prototype.hasOwnProperty, nl = Reflect.apply;
function Mn(n, e) {
  let t = n[e];
  return typeof t == "function" && (t = new An(n[hs], t(n[jo])), n[e] = t), t;
}
function _n(n, e = {}) {
  if (!(this instanceof _n)) return new _n(n, e);
  const t = e !== void 0, r = t ? Jt({}, e) : {}, o = new An(n, r), i = o.resolvedOptions();
  if (t) {
    const a = Jt({}, i);
    for (const c in a) nl(tl, r, [c]) || delete a[c];
    this[jo] = a;
  } else this[jo] = r;
  this[hs] = i.locale, this[Nn] = o, this[On] = i.timeZone, this[Et] = i.calendar, this[as] = al, this[ss] = ol, this[ls] = il, this[cs] = rl, this[ds] = sl, this[us] = ll;
}
Object.defineProperty(_n, "name", { writable: !0, value: "DateTimeFormat" }), _n.supportedLocalesOf = function(n, e) {
  return An.supportedLocalesOf(n, e);
};
const Co = { resolvedOptions: ar(function() {
  return this[Nn].resolvedOptions();
}), format: ar(function(e, ...t) {
  let { instant: r, formatter: o } = Fn(e, this);
  return r && o ? o.format(r.epochMilliseconds) : this[Nn].format(e, ...t);
}), formatRange: ar(function(e, t) {
  if (Wn(e) || Wn(t)) {
    if (!ms(e, t)) throw new TypeError("Intl.DateTimeFormat.formatRange accepts two values of the same type");
    const { instant: r, formatter: o } = Fn(e, this), { instant: i, formatter: a } = Fn(t, this);
    if (r && i && o && a && o === a) return o.formatRange(r.epochMilliseconds, i.epochMilliseconds);
  }
  return this[Nn].formatRange(e, t);
}) };
"formatToParts" in An.prototype && (Co.formatToParts = ar(function(e, ...t) {
  let { instant: r, formatter: o } = Fn(e, this);
  return r && o ? o.formatToParts(r.epochMilliseconds) : this[Nn].formatToParts(e, ...t);
})), "formatRangeToParts" in An.prototype && (Co.formatRangeToParts = ar(function(e, t) {
  if (Wn(e) || Wn(t)) {
    if (!ms(e, t)) throw new TypeError("Intl.DateTimeFormat.formatRangeToParts accepts two values of the same type");
    const { instant: r, formatter: o } = Fn(e, this), { instant: i, formatter: a } = Fn(t, this);
    if (r && i && o && a && o === a) return o.formatRangeToParts(r.epochMilliseconds, i.epochMilliseconds);
  }
  return this[Nn].formatRangeToParts(e, t);
})), _n.prototype = Object.create(An.prototype, Co), Object.defineProperty(_n, "prototype", { writable: !1, enumerable: !1, configurable: !1 });
const hn = _n;
function _r(n = {}, e = {}) {
  const t = Jt({}, n);
  for (const r of ["year", "month", "day", "hour", "minute", "second", "weekday", "dayPeriod", "timeZoneName", "dateStyle", "timeStyle"]) t[r] = r in e ? e[r] : t[r], t[r] !== !1 && t[r] !== void 0 || delete t[r];
  return t;
}
function rl(n) {
  let e = _r(n, { year: !1, month: !1, day: !1, weekday: !1, timeZoneName: !1, dateStyle: !1 });
  return ui(e) || (e = Jt({}, e, { hour: "numeric", minute: "numeric", second: "numeric" })), e;
}
function ol(n) {
  let e = _r(n, { day: !1, hour: !1, minute: !1, second: !1, weekday: !1, dayPeriod: !1, timeZoneName: !1, dateStyle: !1, timeStyle: !1 });
  return "year" in e || "month" in e || (e = Jt(e, { year: "numeric", month: "numeric" })), e;
}
function il(n) {
  let e = _r(n, { year: !1, hour: !1, minute: !1, second: !1, weekday: !1, dayPeriod: !1, timeZoneName: !1, dateStyle: !1, timeStyle: !1 });
  return "month" in e || "day" in e || (e = Jt({}, e, { month: "numeric", day: "numeric" })), e;
}
function al(n) {
  let e = _r(n, { hour: !1, minute: !1, second: !1, dayPeriod: !1, timeZoneName: !1, timeStyle: !1 });
  return di(e) || (e = Jt({}, e, { year: "numeric", month: "numeric", day: "numeric" })), e;
}
function sl(n) {
  let e = _r(n, { timeZoneName: !1 });
  return ui(e) || di(e) || (e = Jt({}, e, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })), e;
}
function ll(n) {
  let e = n;
  return ui(e) || di(e) || (e = Jt({}, e, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })), e;
}
function di(n) {
  return "year" in n || "month" in n || "day" in n || "weekday" in n || "dateStyle" in n;
}
function ui(n) {
  return "hour" in n || "minute" in n || "second" in n || "timeStyle" in n || "dayPeriod" in n;
}
function Wn(n) {
  return K(n) || we(n) || L(n) || x(n) || te(n) || Ye(n) || Re(n);
}
function ms(n, e) {
  return !(!Wn(n) || !Wn(e)) && !(we(n) && !we(e)) && !(K(n) && !K(e)) && !(L(n) && !L(e)) && !(x(n) && !x(e)) && !(te(n) && !te(e)) && !(Ye(n) && !Ye(e)) && !(Re(n) && !Re(e));
}
function Fn(n, e) {
  const t = I("%Temporal.PlainDateTime%");
  if (we(n)) {
    const r = new t(1970, 1, 1, s(n, j), s(n, U), s(n, z), s(n, q), s(n, B), s(n, Z), e[Et]);
    return { instant: nt(e[On], r, "compatible"), formatter: Mn(e, cs) };
  }
  if (te(n)) {
    const r = s(n, M), o = s(n, $), i = s(n, Y), a = Ue(s(n, b));
    if (a !== e[Et]) throw new RangeError(`cannot format PlainYearMonth with calendar ${a} in locale with calendar ${e[Et]}`);
    const c = new t(r, o, i, 12, 0, 0, 0, 0, 0, a);
    return { instant: nt(e[On], c, "compatible"), formatter: Mn(e, ss) };
  }
  if (Ye(n)) {
    const r = s(n, M), o = s(n, $), i = s(n, Y), a = Ue(s(n, b));
    if (a !== e[Et]) throw new RangeError(`cannot format PlainMonthDay with calendar ${a} in locale with calendar ${e[Et]}`);
    const c = new t(r, o, i, 12, 0, 0, 0, 0, 0, a);
    return { instant: nt(e[On], c, "compatible"), formatter: Mn(e, ls) };
  }
  if (K(n)) {
    const r = s(n, M), o = s(n, $), i = s(n, Y), a = Ue(s(n, b));
    if (a !== "iso8601" && a !== e[Et]) throw new RangeError(`cannot format PlainDate with calendar ${a} in locale with calendar ${e[Et]}`);
    const c = new t(r, o, i, 12, 0, 0, 0, 0, 0, e[Et]);
    return { instant: nt(e[On], c, "compatible"), formatter: Mn(e, as) };
  }
  if (L(n)) {
    const r = s(n, M), o = s(n, $), i = s(n, Y), a = s(n, j), c = s(n, U), d = s(n, z), u = s(n, q), h = s(n, B), m = s(n, Z), f = Ue(s(n, b));
    if (f !== "iso8601" && f !== e[Et]) throw new RangeError(`cannot format PlainDateTime with calendar ${f} in locale with calendar ${e[Et]}`);
    let g = n;
    return f === "iso8601" && (g = new t(r, o, i, a, c, d, u, h, m, e[Et])), { instant: nt(e[On], g, "compatible"), formatter: Mn(e, ds) };
  }
  if (x(n)) throw new TypeError("Temporal.ZonedDateTime not supported in DateTimeFormat methods. Use toLocaleString() instead.");
  return Re(n) ? { instant: n, formatter: Mn(e, us) } : {};
}
class _t {
  constructor(e) {
    if (arguments.length < 1) throw new TypeError("missing argument: epochNanoseconds is required");
    const t = ir(e);
    gn(t), Ut(this), W(this, F, t);
  }
  get epochSeconds() {
    if (!Re(this)) throw new TypeError("invalid receiver");
    const e = s(this, F);
    return l.toNumber(Pn(e, Nt));
  }
  get epochMilliseconds() {
    if (!Re(this)) throw new TypeError("invalid receiver");
    const e = l.BigInt(s(this, F));
    return l.toNumber(Pn(e, vt));
  }
  get epochMicroseconds() {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return Jr(Pn(l.BigInt(s(this, F)), ne));
  }
  get epochNanoseconds() {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return Jr(l.BigInt(s(this, F)));
  }
  add(e) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return Ki("add", this, e);
  }
  subtract(e) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return Ki("subtract", this, e);
  }
  until(e, t) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return qi("until", this, e, t);
  }
  since(e, t) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return qi("since", this, e, t);
  }
  round(e) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    if (e === void 0) throw new TypeError("options parameter is required");
    const t = typeof e == "string" ? Zn("smallestUnit", e) : X(e), r = Xn(t), o = Mt(t, "halfExpand"), i = ct(t, "smallestUnit", "time", bn);
    Qn(r, { hour: 24, minute: 1440, second: 86400, millisecond: 864e5, microsecond: 864e8, nanosecond: 864e11 }[i], !0);
    const a = Qr(s(this, F), r, i, o);
    return new _t(a);
  }
  equals(e) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    const t = kt(e), r = s(this, F), o = s(t, F);
    return l.equal(l.BigInt(r), l.BigInt(o));
  }
  toString(e) {
    if (!Re(this)) throw new TypeError("invalid receiver");
    const t = X(e), r = wr(t), o = Mt(t, "trunc"), i = ct(t, "smallestUnit", "time", void 0);
    if (i === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    let a = t.timeZone;
    a !== void 0 && (a = Ze(a));
    const { precision: c, unit: d, increment: u } = vr(i, r), h = Qr(s(this, F), u, d, o);
    return Pi(new _t(h), a, c);
  }
  toJSON() {
    if (!Re(this)) throw new TypeError("invalid receiver");
    return Pi(this, void 0, "auto");
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
    const t = jn(e), r = l.multiply(l.BigInt(t), Nt);
    return gn(r), new _t(r);
  }
  static fromEpochMilliseconds(e) {
    const t = jn(e), r = l.multiply(l.BigInt(t), vt);
    return gn(r), new _t(r);
  }
  static fromEpochMicroseconds(e) {
    const t = ir(e), r = l.multiply(t, ne);
    return gn(r), new _t(r);
  }
  static fromEpochNanoseconds(e) {
    const t = ir(e);
    return gn(t), new _t(t);
  }
  static from(e) {
    return Re(e) ? new _t(s(e, F)) : kt(e);
  }
  static compare(e, t) {
    const r = kt(e), o = kt(t), i = s(r, F), a = s(o, F);
    return l.lessThan(i, a) ? -1 : l.greaterThan(i, a) ? 1 : 0;
  }
}
jt(_t, "Temporal.Instant");
const fs = Array.prototype.includes, cl = Array.prototype.push, dl = globalThis.Intl.DateTimeFormat, ul = Array.prototype.sort, hl = Math.abs, ml = Math.floor, _o = Object.create, Uo = Object.entries, gs = Set, ta = Reflect.ownKeys, ze = Set.prototype.add, ys = Set.prototype.values, de = {};
class ye {
  constructor(e) {
    if (arguments.length < 1) throw new RangeError("missing argument: id is required");
    const t = rt(e);
    if (!Qt(t)) throw new RangeError(`invalid calendar identifier ${t}`);
    Ut(this), W(this, he, Lt(t));
  }
  get id() {
    if (!ge(this)) throw new TypeError("invalid receiver");
    return s(this, he);
  }
  dateFromFields(e, t) {
    if (!ge(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid fields");
    const r = X(t), o = s(this, he);
    return de[o].dateFromFields(e, r, o);
  }
  yearMonthFromFields(e, t) {
    if (!ge(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid fields");
    const r = X(t), o = s(this, he);
    return de[o].yearMonthFromFields(e, r, o);
  }
  monthDayFromFields(e, t) {
    if (!ge(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid fields");
    const r = X(t), o = s(this, he);
    return de[o].monthDayFromFields(e, r, o);
  }
  fields(e) {
    if (!ge(this)) throw new TypeError("invalid receiver");
    const t = [], r = /* @__PURE__ */ new Set(["year", "month", "monthCode", "day", "hour", "minute", "second", "millisecond", "microsecond", "nanosecond"]);
    for (const o of e) {
      if (typeof o != "string") throw new TypeError("invalid fields");
      if (!r.has(o)) throw new RangeError(`invalid field name ${o}`);
      r.delete(o), cl.call(t, o);
    }
    return de[s(this, he)].fields(t);
  }
  mergeFields(e, t) {
    if (!ge(this)) throw new TypeError("invalid receiver");
    const r = Yi(e), o = _o(null);
    Yn(o, r, [], [void 0]);
    const i = Yi(t), a = _o(null);
    Yn(a, i, [], [void 0]);
    const c = ta(a), d = de[s(this, he)].fieldKeysToIgnore(c), u = _o(null), h = ta(o);
    for (const m of h) {
      let f;
      f = N(fs, d, [m]) ? a[m] : o[m], f !== void 0 && (u[m] = f);
    }
    return Yn(u, a, []), u;
  }
  dateAdd(e, t, r) {
    if (!ge(this)) throw new TypeError("invalid receiver");
    const o = ae(e), i = xn(t), a = De(X(r)), { days: c } = Ct(s(i, Ge), s(i, He), s(i, Ke), s(i, Xe), s(i, Qe), s(i, Je), s(i, et), "day"), d = s(this, he);
    return de[d].dateAdd(o, s(i, Ve), s(i, Ne), s(i, ot), c, a, d);
  }
  dateUntil(e, t, r) {
    if (!ge(this)) throw new TypeError("invalid receiver");
    const o = ae(e), i = ae(t);
    let a = ct(X(r), "largestUnit", "date", "auto");
    a === "auto" && (a = "day");
    const { years: c, months: d, weeks: u, days: h } = de[s(this, he)].dateUntil(o, i, a);
    return new (I("%Temporal.Duration%"))(c, d, u, h, 0, 0, 0, 0, 0, 0);
  }
  year(e) {
    let t = e;
    if (!ge(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].year(t);
  }
  month(e) {
    let t = e;
    if (!ge(this)) throw new TypeError("invalid receiver");
    if (Ye(t)) throw new TypeError("use monthCode on PlainMonthDay instead");
    return te(t) || (t = ae(t)), de[s(this, he)].month(t);
  }
  monthCode(e) {
    let t = e;
    if (!ge(this)) throw new TypeError("invalid receiver");
    return te(t) || Ye(t) || (t = ae(t)), de[s(this, he)].monthCode(t);
  }
  day(e) {
    let t = e;
    if (!ge(this)) throw new TypeError("invalid receiver");
    return Ye(t) || (t = ae(t)), de[s(this, he)].day(t);
  }
  era(e) {
    let t = e;
    if (!ge(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].era(t);
  }
  eraYear(e) {
    let t = e;
    if (!ge(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].eraYear(t);
  }
  dayOfWeek(e) {
    if (!ge(this)) throw new TypeError("invalid receiver");
    const t = ae(e);
    return de[s(this, he)].dayOfWeek(t);
  }
  dayOfYear(e) {
    if (!ge(this)) throw new TypeError("invalid receiver");
    const t = ae(e);
    return de[s(this, he)].dayOfYear(t);
  }
  weekOfYear(e) {
    if (!ge(this)) throw new TypeError("invalid receiver");
    const t = ae(e);
    return de[s(this, he)].weekOfYear(t);
  }
  yearOfWeek(e) {
    if (!ge(this)) throw new TypeError("invalid receiver");
    const t = ae(e);
    return de[s(this, he)].yearOfWeek(t);
  }
  daysInWeek(e) {
    if (!ge(this)) throw new TypeError("invalid receiver");
    const t = ae(e);
    return de[s(this, he)].daysInWeek(t);
  }
  daysInMonth(e) {
    let t = e;
    if (!ge(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].daysInMonth(t);
  }
  daysInYear(e) {
    let t = e;
    if (!ge(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].daysInYear(t);
  }
  monthsInYear(e) {
    let t = e;
    if (!ge(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].monthsInYear(t);
  }
  inLeapYear(e) {
    let t = e;
    if (!ge(this)) throw new TypeError("invalid receiver");
    return te(t) || (t = ae(t)), de[s(this, he)].inLeapYear(t);
  }
  toString() {
    if (!ge(this)) throw new TypeError("invalid receiver");
    return s(this, he);
  }
  toJSON() {
    if (!ge(this)) throw new TypeError("invalid receiver");
    return s(this, he);
  }
  static from(e) {
    return Jn(dt(e));
  }
}
function hi(n) {
  if (!n.startsWith("M")) throw new RangeError(`Invalid month code: ${n}.  Month codes must start with M.`);
  const e = +n.slice(1);
  if (isNaN(e)) throw new RangeError(`Invalid month code: ${n}`);
  return e;
}
function Vt(n, e = !1) {
  return `M${n.toString().padStart(2, "0")}${e ? "L" : ""}`;
}
function Ar(n, e, t = 12) {
  let { month: r, monthCode: o } = n;
  if (o === void 0) {
    if (r === void 0) throw new TypeError("Either month or monthCode are required");
    e === "reject" && je(r, 1, t), e === "constrain" && (r = at(r, 1, t)), o = Vt(r);
  } else {
    const i = hi(o);
    if (r !== void 0 && r !== i) throw new RangeError(`monthCode ${o} and month ${r} must match if both are present`);
    if (o !== Vt(i)) throw new RangeError(`Invalid month code: ${o}`);
    if (r = i, r < 1 || r > t) throw new RangeError(`Invalid monthCode: ${o}`);
  }
  return { ...n, month: r, monthCode: o };
}
jt(ye, "Temporal.Calendar"), me("Temporal.Calendar.from", ye.from), me("Temporal.Calendar.prototype.dateAdd", ye.prototype.dateAdd), me("Temporal.Calendar.prototype.dateFromFields", ye.prototype.dateFromFields), me("Temporal.Calendar.prototype.dateUntil", ye.prototype.dateUntil), me("Temporal.Calendar.prototype.day", ye.prototype.day), me("Temporal.Calendar.prototype.dayOfWeek", ye.prototype.dayOfWeek), me("Temporal.Calendar.prototype.dayOfYear", ye.prototype.dayOfYear), me("Temporal.Calendar.prototype.daysInMonth", ye.prototype.daysInMonth), me("Temporal.Calendar.prototype.daysInWeek", ye.prototype.daysInWeek), me("Temporal.Calendar.prototype.daysInYear", ye.prototype.daysInYear), me("Temporal.Calendar.prototype.era", ye.prototype.era), me("Temporal.Calendar.prototype.eraYear", ye.prototype.eraYear), me("Temporal.Calendar.prototype.fields", ye.prototype.fields), me("Temporal.Calendar.prototype.inLeapYear", ye.prototype.inLeapYear), me("Temporal.Calendar.prototype.mergeFields", ye.prototype.mergeFields), me("Temporal.Calendar.prototype.month", ye.prototype.month), me("Temporal.Calendar.prototype.monthCode", ye.prototype.monthCode), me("Temporal.Calendar.prototype.monthDayFromFields", ye.prototype.monthDayFromFields), me("Temporal.Calendar.prototype.monthsInYear", ye.prototype.monthsInYear), me("Temporal.Calendar.prototype.weekOfYear", ye.prototype.weekOfYear), me("Temporal.Calendar.prototype.year", ye.prototype.year), me("Temporal.Calendar.prototype.yearMonthFromFields", ye.prototype.yearMonthFromFields), me("Temporal.Calendar.prototype.yearOfWeek", ye.prototype.yearOfWeek), de.iso8601 = { dateFromFields(n, e, t) {
  let r = G(n, ["day", "month", "monthCode", "year"], ["year", "day"]);
  const o = De(e);
  r = Ar(r);
  let { year: i, month: a, day: c } = r;
  return { year: i, month: a, day: c } = Zr(i, a, c, o), bt(i, a, c, t);
}, yearMonthFromFields(n, e, t) {
  let r = G(n, ["month", "monthCode", "year"], ["year"]);
  const o = De(e);
  r = Ar(r);
  let { year: i, month: a } = r;
  return { year: i, month: a } = function(d, u, h) {
    let m = d, f = u;
    switch (h) {
      case "reject":
        St(m, f, 1);
        break;
      case "constrain":
        ({ year: m, month: f } = Ga(m, f));
    }
    return { year: m, month: f };
  }(i, a, o), ur(i, a, t, 1);
}, monthDayFromFields(n, e, t) {
  let r = G(n, ["day", "month", "monthCode", "year"], ["day"]);
  const o = De(e);
  if (r.month !== void 0 && r.year === void 0 && r.monthCode === void 0) throw new TypeError("either year or monthCode required with month");
  const i = r.monthCode === void 0;
  r = Ar(r);
  let { month: a, day: c, year: d } = r;
  return { month: a, day: c } = Zr(i ? d : 1972, a, c, o), dr(a, c, t, 1972);
}, fields: (n) => n, fieldKeysToIgnore(n) {
  const e = new gs();
  for (let t = 0; t < n.length; t++) {
    const r = n[t];
    N(ze, e, [r]), r === "month" ? N(ze, e, ["monthCode"]) : r === "monthCode" && N(ze, e, ["month"]);
  }
  return [...N(ys, e, [])];
}, dateAdd(n, e, t, r, o, i, a) {
  let c = s(n, M), d = s(n, $), u = s(n, Y);
  return { year: c, month: d, day: u } = wn(c, d, u, e, t, r, o, i), bt(c, d, u, a);
}, dateUntil: (n, e, t) => oi(s(n, M), s(n, $), s(n, Y), s(e, M), s(e, $), s(e, Y), t), year: (n) => s(n, M), era() {
}, eraYear() {
}, month: (n) => s(n, $), monthCode: (n) => Vt(s(n, $)), day: (n) => s(n, Y), dayOfWeek: (n) => Fo(s(n, M), s(n, $), s(n, Y)), dayOfYear: (n) => Kr(s(n, M), s(n, $), s(n, Y)), weekOfYear: (n) => Ui(s(n, M), s(n, $), s(n, Y)).week, yearOfWeek: (n) => Ui(s(n, M), s(n, $), s(n, Y)).year, daysInWeek: () => 7, daysInMonth: (n) => Wt(s(n, M), s(n, $)), daysInYear(n) {
  let e = n;
  return Pe(e, M) || (e = ae(e)), ln(s(e, M)) ? 366 : 365;
}, monthsInYear: () => 12, inLeapYear(n) {
  let e = n;
  return Pe(e, M) || (e = ae(e)), ln(s(e, M));
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
function ps({ isoYear: n, isoMonth: e, isoDay: t }) {
  return `${kn(n)}-${ue(e)}-${ue(t)}T00:00Z`;
}
function Io(n, e) {
  return { years: n.year - e.year, months: n.month - e.month, days: n.day - e.day };
}
fe.objectMap = /* @__PURE__ */ new WeakMap(), fe.MAX_CACHE_ENTRIES = 1e3;
class tr {
  constructor() {
    this.eraLength = "short", this.hasEra = !0, this.erasBeginMidYear = !1;
  }
  getFormatter() {
    return this.formatter === void 0 && (this.formatter = new dl(`en-US-u-ca-${this.id}`, { day: "numeric", month: "numeric", year: "numeric", era: this.eraLength, timeZone: "UTC" })), this.formatter;
  }
  isoToCalendarDate(e, t) {
    const { year: r, month: o, day: i } = e, a = JSON.stringify({ func: "isoToCalendarDate", isoYear: r, isoMonth: o, isoDay: i, id: this.id }), c = t.get(a);
    if (c) return c;
    const d = this.getFormatter();
    let u, h;
    try {
      h = ps({ isoYear: r, isoMonth: o, isoDay: i }), u = d.formatToParts(new Date(h));
    } catch {
      throw new RangeError(`Invalid ISO date: ${JSON.stringify({ isoYear: r, isoMonth: o, isoDay: i })}`);
    }
    const m = {};
    for (let { type: g, value: y } of u) {
      if (g === "year" && (m.eraYear = +y), g === "relatedYear" && (m.eraYear = +y), g === "month") {
        const p = /^([0-9]*)(.*?)$/.exec(y);
        if (!p || p.length != 3 || !p[1] && !p[2]) throw new RangeError(`Unexpected month: ${y}`);
        if (m.month = p[1] ? +p[1] : 1, m.month < 1) throw new RangeError(`Invalid month ${y} from ${h}[u-ca-${this.id}] (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10527)`);
        if (m.month > 13) throw new RangeError(`Invalid month ${y} from ${h}[u-ca-${this.id}] (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10529)`);
        p[2] && (m.monthExtra = p[2]);
      }
      g === "day" && (m.day = +y), this.hasEra && g === "era" && y != null && y !== "" && (y = y.split(" (")[0], m.era = y.normalize("NFD").replace(/[^-0-9 \p{L}]/gu, "").replace(" ", "-").toLowerCase());
    }
    if (m.eraYear === void 0) throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
    if (this.reviseIntlEra) {
      const { era: g, eraYear: y } = this.reviseIntlEra(m, e);
      m.era = g, m.eraYear = y;
    }
    this.checkIcuBugs && this.checkIcuBugs(e);
    const f = this.adjustCalendarDate(m, t, "constrain", !0);
    if (f.year === void 0) throw new RangeError(`Missing year converting ${JSON.stringify(e)}`);
    if (f.month === void 0) throw new RangeError(`Missing month converting ${JSON.stringify(e)}`);
    if (f.day === void 0) throw new RangeError(`Missing day converting ${JSON.stringify(e)}`);
    return t.set(a, f), ["constrain", "reject"].forEach((g) => {
      const y = JSON.stringify({ func: "calendarToIsoDate", year: f.year, month: f.month, day: f.day, overflow: g, id: this.id });
      t.set(y, e);
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
    return t === "reject" ? (je(i, 1, o), je(a, 1, this.maximumMonthLength(e))) : (i = at(i, 1, o), a = at(a, 1, this.maximumMonthLength({ ...e, month: i }))), { ...e, month: i, day: a };
  }
  calendarToIsoDate(e, t = "constrain", r) {
    const o = e;
    let i = this.adjustCalendarDate(e, r, t, !1);
    i = this.regulateMonthDayNaive(i, t, r);
    const { year: a, month: c, day: d } = i, u = JSON.stringify({ func: "calendarToIsoDate", year: a, month: c, day: d, overflow: t, id: this.id });
    let h, m = r.get(u);
    if (m || o.year !== void 0 && o.month !== void 0 && o.day !== void 0 && (o.year !== i.year || o.month !== i.month || o.day !== i.day) && (h = JSON.stringify({ func: "calendarToIsoDate", year: o.year, month: o.month, day: o.day, overflow: t, id: this.id }), m = r.get(h), m)) return m;
    let f = this.estimateIsoDate({ year: a, month: c, day: d });
    const g = (T) => {
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
    let y = 0, p = this.isoToCalendarDate(f, r), w = Io(i, p);
    if (w.years !== 0 || w.months !== 0 || w.days !== 0) {
      const T = 365 * w.years + 30 * w.months + w.days;
      f = this.addDaysIso(f, T), p = this.isoToCalendarDate(f, r), w = Io(i, p), w.years === 0 && w.months === 0 ? f = g(w.days) : y = this.compareCalendarDates(i, p);
    }
    let v = 8;
    for (; y; ) {
      f = this.addDaysIso(f, y * v);
      const T = p;
      p = this.isoToCalendarDate(f, r);
      const E = y;
      if (y = this.compareCalendarDates(i, p), y) {
        if (w = Io(i, p), w.years === 0 && w.months === 0) f = g(w.days), y = 0;
        else if (E && y !== E) if (v > 1) v /= 2;
        else {
          if (t === "reject") throw new RangeError(`Can't find ISO date from calendar date: ${JSON.stringify({ ...o })}`);
          this.compareCalendarDates(p, T) > 0 && (f = this.addDaysIso(f, -1)), y = 0;
        }
      }
    }
    if (r.set(u, f), h && r.set(h, f), i.year === void 0 || i.month === void 0 || i.day === void 0 || i.monthCode === void 0 || this.hasEra && (i.era === void 0 || i.eraYear === void 0)) throw new RangeError("Unexpected missing property");
    return f;
  }
  temporalToCalendarDate(e, t) {
    const r = { year: s(e, M), month: s(e, $), day: s(e, Y) };
    return this.isoToCalendarDate(r, t);
  }
  compareCalendarDates(e, t) {
    const r = G(e, ["day", "month", "year"], ["day", "month", "year"]), o = G(t, ["day", "month", "year"], ["day", "month", "year"]);
    return r.year !== o.year ? vn(r.year - o.year) : r.month !== o.month ? vn(r.month - o.month) : r.day !== o.day ? vn(r.day - o.day) : 0;
  }
  regulateDate(e, t = "constrain", r) {
    const o = this.calendarToIsoDate(e, t, r);
    return this.isoToCalendarDate(o, r);
  }
  addDaysIso(e, t) {
    return wn(e.year, e.month, e.day, 0, 0, 0, t, "constrain");
  }
  addDaysCalendar(e, t, r) {
    const o = this.calendarToIsoDate(e, "constrain", r), i = this.addDaysIso(o, t);
    return this.isoToCalendarDate(i, r);
  }
  addMonthsCalendar(e, t, r, o) {
    let i = e;
    const { day: a } = i;
    for (let c = 0, d = hl(t); c < d; c++) {
      const { month: u } = i, h = i, m = t < 0 ? -Math.max(a, this.daysInPreviousMonth(i, o)) : this.daysInMonth(i, o), f = this.calendarToIsoDate(i, "constrain", o);
      let g = this.addDaysIso(f, m);
      if (i = this.isoToCalendarDate(g, o), t > 0) {
        const y = this.monthsInYear(h, o);
        for (; i.month - 1 != u % y; ) g = this.addDaysIso(g, -1), i = this.isoToCalendarDate(g, o);
      }
      i.day !== a && (i = this.regulateDate({ ...i, day: a }, "constrain", o));
    }
    if (r === "reject" && i.day !== a) throw new RangeError(`Day ${a} does not exist in resulting calendar month`);
    return i;
  }
  addCalendar(e, { years: t = 0, months: r = 0, weeks: o = 0, days: i = 0 }, a, c) {
    const { year: d, day: u, monthCode: h } = e, m = this.adjustCalendarDate({ year: d + t, monthCode: h, day: u }, c), f = this.addMonthsCalendar(m, r, a, c), g = i + 7 * o;
    return this.addDaysCalendar(f, g, c);
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
          let y = 0;
          t.monthCode > e.monthCode && (y = 1), t.monthCode < e.monthCode && (y = -1), y || (y = Math.sign(m)), d = y * u < 0 ? h - u : h;
        }
        let f, g = d ? this.addCalendar(e, { years: d }, "constrain", o) : e;
        do
          c += u, f = g, g = this.addMonthsCalendar(f, u, "constrain", o), g.day !== e.day && (g = this.regulateDate({ ...g, day: e.day }, "constrain", o));
        while (this.compareCalendarDates(t, g) * u >= 0);
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
    return oi(e.year, e.month, e.day, t.year, t.month, t.day, "day").days;
  }
  monthDayFromFields(e, t, r) {
    let o, i, a, c, d, { monthCode: u, day: h } = e;
    if (u === void 0) {
      let { year: g, era: y, eraYear: p } = e;
      if (g === void 0 && (y === void 0 || p === void 0)) throw new TypeError("when `monthCode` is omitted, `year` (or `era` and `eraYear`) and `month` are required");
      ({ monthCode: u, day: h } = this.isoToCalendarDate(this.calendarToIsoDate(e, t, r), r));
    }
    const m = this.isoToCalendarDate({ year: 1972, month: 12, day: 31 }, r), f = m.monthCode > u || m.monthCode === u && m.day >= h ? m.year : m.year - 1;
    for (let g = 0; g < 100; g++) {
      const y = this.adjustCalendarDate({ day: h, monthCode: u, year: f - g }, r), p = this.calendarToIsoDate(y, "constrain", r), w = this.isoToCalendarDate(p, r);
      if ({ year: o, month: i, day: a } = p, w.monthCode === u && w.day === h) return { month: i, day: a, year: o };
      t === "constrain" && (c === void 0 || w.monthCode === c.monthCode && w.day > c.day) && (c = w, d = p);
    }
    if (t === "constrain" && d !== void 0) return d;
    throw new RangeError(`No recent ${this.id} year with monthCode ${u} and day ${h}`);
  }
}
class fl extends tr {
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
    const { month: r, year: o } = e, i = this.getMonthCode(o, r), a = Uo(this.months).find((d) => d[1].monthCode === i);
    if (a === void 0) throw new RangeError(`unmatched Hebrew month: ${r}`);
    const c = a[1].days;
    return typeof c == "number" ? c : c[t];
  }
  estimateIsoDate(e) {
    const { year: t } = e;
    return { year: t - 3760, month: 1, day: 1 };
  }
  getMonthCode(e, t) {
    return this.inLeapYear({ year: e }) ? t === 6 ? Vt(5, !0) : Vt(t < 6 ? t : t - 1) : Vt(t);
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
      c = hi(d), this.inLeapYear({ year: i }) && c >= 6 && c++;
      const m = this.monthsInYear({ year: i });
      if (c < 1 || c > m) throw new RangeError(`Invalid monthCode: ${d}`);
    }
    else if (r === "reject" ? (je(c, 1, this.monthsInYear({ year: i })), je(u, 1, this.maximumMonthLength({ year: i, month: c }))) : (c = at(c, 1, this.monthsInYear({ year: i })), u = at(u, 1, this.maximumMonthLength({ year: i, month: c }))), d === void 0) d = this.getMonthCode(i, c);
    else if (this.getMonthCode(i, c) !== d) throw new RangeError(`monthCode ${d} doesn't correspond to month ${c} in Hebrew year ${i}`);
    return { ...e, day: u, month: c, monthCode: d, year: i, eraYear: a };
  }
}
class nr extends tr {
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
    return { year: ml(t * this.DAYS_PER_ISLAMIC_YEAR / this.DAYS_PER_ISO_YEAR) + 622, month: 1, day: 1 };
  }
}
class ws extends nr {
  constructor() {
    super(...arguments), this.id = "islamic";
  }
}
class gl extends nr {
  constructor() {
    super(...arguments), this.id = "islamic-umalqura";
  }
}
class yl extends nr {
  constructor() {
    super(...arguments), this.id = "islamic-tbla";
  }
}
class pl extends nr {
  constructor() {
    super(...arguments), this.id = "islamic-civil";
  }
}
class wl extends nr {
  constructor() {
    super(...arguments), this.id = "islamic-rgsa";
  }
}
class vl extends nr {
  constructor() {
    super(...arguments), this.id = "islamicc";
  }
}
class Tl extends tr {
  constructor() {
    super(...arguments), this.id = "persian", this.calendarType = "solar", this.constantEra = "ap";
  }
  inLeapYear(e, t) {
    return ws.prototype.inLeapYear.call(this, e, t);
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
class bl extends tr {
  constructor() {
    super(...arguments), this.id = "indian", this.calendarType = "solar", this.constantEra = "saka", this.months = { 1: { length: 30, month: 3, day: 22, leap: { length: 31, month: 3, day: 21 } }, 2: { length: 31, month: 4, day: 21 }, 3: { length: 31, month: 5, day: 22 }, 4: { length: 31, month: 6, day: 22 }, 5: { length: 31, month: 7, day: 23 }, 6: { length: 31, month: 8, day: 23 }, 7: { length: 30, month: 9, day: 23 }, 8: { length: 30, month: 10, day: 23 }, 9: { length: 30, month: 11, day: 22 }, 10: { length: 30, month: 12, day: 22 }, 11: { length: 30, month: 1, nextYear: !0, day: 21 }, 12: { length: 30, month: 2, nextYear: !0, day: 20 } }, this.vulnerableToBceBug = (/* @__PURE__ */ new Date("0000-01-01T00:00Z")).toLocaleDateString("en-US-u-ca-indian", { timeZone: "UTC" }) !== "10/11/-79 Saka";
  }
  inLeapYear(e) {
    return vs(e.year + 78);
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
    return wn(t.year + 78 + (r.nextYear ? 1 : 0), r.month, r.day, 0, 0, 0, t.day - 1, "constrain");
  }
  checkIcuBugs(e) {
    if (this.vulnerableToBceBug && e.year < 1) throw new RangeError(`calendar '${this.id}' is broken for ISO dates before 0001-01-01 (see https://bugs.chromium.org/p/v8/issues/detail?id=10529)`);
  }
}
function vs(n) {
  return n % 4 == 0 && (n % 100 != 0 || n % 400 == 0);
}
class Ir extends tr {
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
          const f = d.find((g) => g.name === m);
          if (f === void 0) throw new RangeError(`Invalid era data: unmatched reverseOf era: ${m}`);
          h.reverseOf = f, h.anchorEpoch = f.anchorEpoch, h.isoEpoch = f.isoEpoch;
        }
        h.anchorEpoch.month === void 0 && (h.anchorEpoch.month = 1), h.anchorEpoch.day === void 0 && (h.anchorEpoch.day = 1);
      }), ul.call(d, (h, m) => {
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
    return vs(t);
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
    return i === void 0 && (o = { ...o, month: hi(a) }), this.validateCalendarDate(o), o = this.completeEraYear(o), super.adjustCalendarDate(o, t, r);
  }
  estimateIsoDate(e) {
    const t = this.adjustCalendarDate(e), { year: r, month: o, day: i } = t, { anchorEra: a } = this;
    return Zr(r + a.isoEpoch.year - (a.hasYearZero ? 0 : 1), o, i, "constrain");
  }
  checkIcuBugs(e) {
    if (this.calendarIsVulnerableToJulianBug && this.v8IsVulnerableToJulianBug && tn(e.year, e.month, e.day, 1582, 10, 15) < 0)
      throw new RangeError(`calendar '${this.id}' is broken for ISO dates before 1582-10-15 (see https://bugs.chromium.org/p/chromium/issues/detail?id=1173158)`);
  }
}
class mi extends Ir {
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
class El extends mi {
  constructor() {
    super("ethioaa", [{ name: "era0", isoEpoch: { year: -5492, month: 7, day: 17 } }]);
  }
}
class Dl extends mi {
  constructor() {
    super("coptic", [{ name: "era1", isoEpoch: { year: 284, month: 8, day: 29 } }, { name: "era0", reverseOf: "era1" }]);
  }
}
class Cl extends mi {
  constructor() {
    super("ethiopic", [{ name: "era0", isoEpoch: { year: -5492, month: 7, day: 17 } }, { name: "era1", isoEpoch: { year: 8, month: 8, day: 27 }, anchorEpoch: { year: 5501 } }]);
  }
}
class _l extends Ir {
  constructor() {
    super("roc", [{ name: "minguo", isoEpoch: { year: 1912, month: 1, day: 1 } }, { name: "before-roc", reverseOf: "minguo" }]), this.calendarIsVulnerableToJulianBug = !0;
  }
}
class Il extends Ir {
  constructor() {
    super("buddhist", [{ name: "be", hasYearZero: !0, isoEpoch: { year: -543, month: 1, day: 1 } }]), this.calendarIsVulnerableToJulianBug = !0;
  }
}
class kl extends Ir {
  constructor() {
    super("gregory", [{ name: "ce", isoEpoch: { year: 1, month: 1, day: 1 } }, { name: "bce", reverseOf: "ce" }]);
  }
  reviseIntlEra(e) {
    let { era: t, eraYear: r } = e;
    return t !== "bc" && t !== "b" || (t = "bce"), t !== "ad" && t !== "a" || (t = "ce"), { era: t, eraYear: r };
  }
}
class Ml extends Ir {
  constructor() {
    super("japanese", [{ name: "reiwa", isoEpoch: { year: 2019, month: 5, day: 1 }, anchorEpoch: { year: 2019, month: 5, day: 1 } }, { name: "heisei", isoEpoch: { year: 1989, month: 1, day: 8 }, anchorEpoch: { year: 1989, month: 1, day: 8 } }, { name: "showa", isoEpoch: { year: 1926, month: 12, day: 25 }, anchorEpoch: { year: 1926, month: 12, day: 25 } }, { name: "taisho", isoEpoch: { year: 1912, month: 7, day: 30 }, anchorEpoch: { year: 1912, month: 7, day: 30 } }, { name: "meiji", isoEpoch: { year: 1868, month: 9, day: 8 }, anchorEpoch: { year: 1868, month: 9, day: 8 } }, { name: "ce", isoEpoch: { year: 1, month: 1, day: 1 } }, { name: "bce", reverseOf: "ce" }]), this.calendarIsVulnerableToJulianBug = !0, this.eraLength = "long", this.erasBeginMidYear = !0;
  }
  reviseIntlEra(e, t) {
    const { era: r, eraYear: o } = e, { year: i } = t;
    return this.eras.find((a) => a.name === r) ? { era: r, eraYear: o } : i < 1 ? { era: "bce", eraYear: 1 - i } : { era: "ce", eraYear: i };
  }
}
class Ts extends tr {
  constructor() {
    super(...arguments), this.calendarType = "lunisolar", this.hasEra = !1;
  }
  inLeapYear(e, t) {
    const r = this.getMonthList(e.year, t);
    return Uo(r).length === 13;
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
      const T = ps({ isoYear: w, isoMonth: 2, isoDay: 1 }), E = new Date(T);
      E.setUTCDate(v + 1);
      const D = i.formatToParts(E), k = D.find((R) => R.type === "month").value, _ = +D.find((R) => R.type === "day").value;
      let C = D.find((R) => R.type === "relatedYear");
      if (C === void 0) throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
      return C = +C.value, { calendarMonthString: k, calendarDay: _, calendarYearToVerify: C };
    };
    let c = 17, { calendarMonthString: d, calendarDay: u, calendarYearToVerify: h } = a(e, c);
    d !== "1" && (c += 29, { calendarMonthString: d, calendarDay: u } = a(e, c)), c -= u - 5;
    const m = {};
    let f, g, y = 1, p = !1;
    do
      ({ calendarMonthString: d, calendarDay: u, calendarYearToVerify: h } = a(e, c)), f && (m[g].daysInMonth = f + 30 - u), h !== e ? p = !0 : (m[d] = { monthIndex: y++ }, c += 30), f = u, g = d;
    while (!p);
    return m[g].daysInMonth = f + 30 - u, t.set(r, m), m;
  }
  estimateIsoDate(e) {
    const { year: t, month: r } = e;
    return { year: t, month: r >= 12 ? 12 : r + 1, day: 1 };
  }
  adjustCalendarDate(e, t, r = "constrain", o = !1) {
    let { year: i, month: a, monthExtra: c, day: d, monthCode: u, eraYear: h } = e;
    if (o) {
      if (i = h, c && c !== "bis") throw new RangeError(`Unexpected leap month suffix: ${c}`);
      const m = Vt(a, c !== void 0), f = `${a}${c || ""}`, g = this.getMonthList(i, t)[f];
      if (g === void 0) throw new RangeError(`Unmatched month ${f} in Chinese year ${i}`);
      return a = g.monthIndex, { year: i, month: a, day: d, era: void 0, eraYear: h, monthCode: m };
    }
    if (this.validateCalendarDate(e), i === void 0 && (i = h), h === void 0 && (h = i), a === void 0) {
      const m = this.getMonthList(i, t);
      let f = u.replace("L", "bis").slice(1);
      f[0] === "0" && (f = f.slice(1));
      let g = m[f];
      if (a = g && g.monthIndex, a === void 0 && u.endsWith("L") && u != "M13L" && r === "constrain") {
        let y = u.slice(1, -1);
        y[0] === "0" && (y = y.slice(1)), g = m[y], g && (a = g.monthIndex, u = Vt(y));
      }
      if (a === void 0) throw new RangeError(`Unmatched month ${u} in Chinese year ${i}`);
    } else if (u === void 0) {
      const m = this.getMonthList(i, t), f = Uo(m), g = f.length;
      r === "reject" ? (je(a, 1, g), je(d, 1, this.maximumMonthLength())) : (a = at(a, 1, g), d = at(d, 1, this.maximumMonthLength()));
      const y = f.find(([, p]) => p.monthIndex === a);
      if (y === void 0) throw new RangeError(`Invalid month ${a} in Chinese year ${i}`);
      u = Vt(y[0].replace("bis", ""), y[0].indexOf("bis") !== -1);
    } else {
      const m = this.getMonthList(i, t);
      let f = u.replace("L", "bis").slice(1);
      f[0] === "0" && (f = f.slice(1));
      const g = m[f];
      if (!g) throw new RangeError(`Unmatched monthCode ${u} in Chinese year ${i}`);
      if (a !== g.monthIndex) throw new RangeError(`monthCode ${u} doesn't correspond to month ${a} in Chinese year ${i}`);
    }
    return { ...e, year: i, eraYear: h, month: a, monthCode: u, day: d };
  }
}
class Ol extends Ts {
  constructor() {
    super(...arguments), this.id = "chinese";
  }
}
class Rl extends Ts {
  constructor() {
    super(...arguments), this.id = "dangi";
  }
}
class $l {
  constructor(e) {
    this.helper = e;
  }
  dateFromFields(e, t, r) {
    const o = new fe(), i = G(e, this.fields(["day", "month", "monthCode", "year"]), []), a = De(t), { year: c, month: d, day: u } = this.helper.calendarToIsoDate(i, a, o), h = bt(c, d, u, r);
    return o.setObject(h), h;
  }
  yearMonthFromFields(e, t, r) {
    const o = new fe(), i = G(e, this.fields(["month", "monthCode", "year"]), []), a = De(t), { year: c, month: d, day: u } = this.helper.calendarToIsoDate({ ...i, day: 1 }, a, o), h = ur(c, d, r, u);
    return o.setObject(h), h;
  }
  monthDayFromFields(e, t, r) {
    const o = new fe(), i = G(e, this.fields(["day", "month", "monthCode", "year"]), []), a = De(t), { year: c, month: d, day: u } = this.helper.monthDayFromFields(i, a, o), h = dr(d, u, r, c);
    return o.setObject(h), h;
  }
  fields(e) {
    let t = e;
    return fs.call(t, "year") && (t = [...t, "era", "eraYear"]), t;
  }
  fieldKeysToIgnore(e) {
    const t = new gs();
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
    return [...N(ys, t, [])];
  }
  dateAdd(e, t, r, o, i, a, c) {
    const d = fe.getCacheForObject(e), u = this.helper.temporalToCalendarDate(e, d), h = this.helper.addCalendar(u, { years: t, months: r, weeks: o, days: i }, a, d), m = this.helper.calendarToIsoDate(h, "constrain", d), { year: f, month: g, day: y } = m, p = bt(f, g, y, c);
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
    Pe(t, M) || (t = ae(t));
    const r = fe.getCacheForObject(t), o = this.helper.temporalToCalendarDate(t, r), i = this.helper.startOfCalendarYear(o), a = this.helper.addCalendar(i, { years: 1 }, "constrain", r);
    return this.helper.calendarDaysUntil(i, a, r);
  }
  monthsInYear(e) {
    const t = fe.getCacheForObject(e), r = this.helper.temporalToCalendarDate(e, t);
    return this.helper.monthsInYear(r, t);
  }
  inLeapYear(e) {
    let t = e;
    Pe(t, M) || (t = ae(t));
    const r = fe.getCacheForObject(t), o = this.helper.temporalToCalendarDate(t, r);
    return this.helper.inLeapYear(o, r);
  }
}
for (const n of [fl, Tl, Cl, El, Dl, Ol, Rl, _l, bl, Il, kl, Ml, ws, gl, yl, pl, wl, vl]) {
  const e = new n();
  de[e.id] = new $l(e);
}
class kr {
  constructor(e, t, r, o = "iso8601") {
    Ya(this, ee(e), ee(t), ee(r), dt(o));
  }
  get calendarId() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Ue(s(this, b));
  }
  get era() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return so(s(this, b), this);
  }
  get eraYear() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return lo(s(this, b), this);
  }
  get year() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return io(s(this, b), this);
  }
  get month() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return ao(s(this, b), this);
  }
  get monthCode() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return br(s(this, b), this);
  }
  get day() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Er(s(this, b), this);
  }
  get dayOfWeek() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Go(s(this, b), this);
  }
  get dayOfYear() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Ho(s(this, b), this);
  }
  get weekOfYear() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Ko(s(this, b), this);
  }
  get yearOfWeek() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Xo(s(this, b), this);
  }
  get daysInWeek() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Qo(s(this, b), this);
  }
  get daysInMonth() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return co(s(this, b), this);
  }
  get daysInYear() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return uo(s(this, b), this);
  }
  get monthsInYear() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return ho(s(this, b), this);
  }
  get inLeapYear() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return mo(s(this, b), this);
  }
  with(e, t) {
    if (!K(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid argument");
    Kn(e);
    const r = X(t), o = s(this, b), i = ke(o, ["day", "month", "monthCode", "year"]);
    let a = G(this, i, []);
    return a = Dn(o, a, G(e, i, "partial")), a = G(a, i, []), Kt(o, a, r);
  }
  withCalendar(e) {
    if (!K(this)) throw new TypeError("invalid receiver");
    const t = dt(e);
    return new kr(s(this, M), s(this, $), s(this, Y), t);
  }
  add(e, t) {
    if (!K(this)) throw new TypeError("invalid receiver");
    const r = xn(e), o = X(t);
    return Le(s(this, b), this, r, o);
  }
  subtract(e, t) {
    if (!K(this)) throw new TypeError("invalid receiver");
    const r = Va(xn(e)), o = X(t);
    return Le(s(this, b), this, r, o);
  }
  until(e, t) {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Bi("until", this, e, t);
  }
  since(e, t) {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Bi("since", this, e, t);
  }
  equals(e) {
    if (!K(this)) throw new TypeError("invalid receiver");
    const t = ae(e);
    for (const r of [M, $, Y])
      if (s(this, r) !== s(t, r)) return !1;
    return Cr(s(this, b), s(t, b));
  }
  toString(e) {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Ni(this, pr(X(e)));
  }
  toJSON() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Ni(this);
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
    const t = s(this, M), r = s(this, $), o = s(this, Y), i = s(this, b);
    if (e === void 0) return it(t, r, o, 0, 0, 0, 0, 0, 0, i);
    const a = Bt(e);
    return it(t, r, o, s(a, j), s(a, U), s(a, z), s(a, q), s(a, B), s(a, Z), i);
  }
  toZonedDateTime(e) {
    if (!K(this)) throw new TypeError("invalid receiver");
    let t, r;
    if (ce(e)) if (pt(e)) t = e;
    else {
      const y = e.timeZone;
      y === void 0 ? t = Ze(e) : (t = Ze(y), r = e.plainTime);
    }
    else t = Ze(e);
    const o = s(this, M), i = s(this, $), a = s(this, Y), c = s(this, b);
    let d = 0, u = 0, h = 0, m = 0, f = 0, g = 0;
    return r !== void 0 && (r = Bt(r), d = s(r, j), u = s(r, U), h = s(r, z), m = s(r, q), f = s(r, B), g = s(r, Z)), Se(s(nt(t, it(o, i, a, d, u, h, m, f, g, c), "compatible"), F), t, c);
  }
  toPlainYearMonth() {
    if (!K(this)) throw new TypeError("invalid receiver");
    const e = s(this, b);
    return Cn(e, G(this, ke(e, ["monthCode", "year"]), []));
  }
  toPlainMonthDay() {
    if (!K(this)) throw new TypeError("invalid receiver");
    const e = s(this, b);
    return zn(e, G(this, ke(e, ["day", "monthCode"]), []));
  }
  getISOFields() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return { calendar: s(this, b), isoDay: s(this, Y), isoMonth: s(this, $), isoYear: s(this, M) };
  }
  getCalendar() {
    if (!K(this)) throw new TypeError("invalid receiver");
    return Jn(s(this, b));
  }
  static from(e, t) {
    const r = X(t);
    return K(e) ? (De(r), bt(s(e, M), s(e, $), s(e, Y), s(e, b))) : ae(e, r);
  }
  static compare(e, t) {
    const r = ae(e), o = ae(t);
    return tn(s(r, M), s(r, $), s(r, Y), s(o, M), s(o, $), s(o, Y));
  }
}
jt(kr, "Temporal.PlainDate");
class Mr {
  constructor(e, t, r, o = 0, i = 0, a = 0, c = 0, d = 0, u = 0, h = "iso8601") {
    xa(this, ee(e), ee(t), ee(r), o === void 0 ? 0 : ee(o), i === void 0 ? 0 : ee(i), a === void 0 ? 0 : ee(a), c === void 0 ? 0 : ee(c), d === void 0 ? 0 : ee(d), u === void 0 ? 0 : ee(u), dt(h));
  }
  get calendarId() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Ue(s(this, b));
  }
  get year() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return io(s(this, b), this);
  }
  get month() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return ao(s(this, b), this);
  }
  get monthCode() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return br(s(this, b), this);
  }
  get day() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Er(s(this, b), this);
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
    return so(s(this, b), this);
  }
  get eraYear() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return lo(s(this, b), this);
  }
  get dayOfWeek() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Go(s(this, b), this);
  }
  get dayOfYear() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Ho(s(this, b), this);
  }
  get weekOfYear() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Ko(s(this, b), this);
  }
  get yearOfWeek() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Xo(s(this, b), this);
  }
  get daysInWeek() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Qo(s(this, b), this);
  }
  get daysInYear() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return uo(s(this, b), this);
  }
  get daysInMonth() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return co(s(this, b), this);
  }
  get monthsInYear() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return ho(s(this, b), this);
  }
  get inLeapYear() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return mo(s(this, b), this);
  }
  with(e, t) {
    if (!L(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid argument");
    Kn(e);
    const r = X(t), o = s(this, b), i = ke(o, ["day", "hour", "microsecond", "millisecond", "minute", "month", "monthCode", "nanosecond", "second", "year"]);
    let a = G(this, i, []);
    a = Dn(o, a, G(e, i, "partial")), a = G(a, i, []);
    const { year: c, month: d, day: u, hour: h, minute: m, second: f, millisecond: g, microsecond: y, nanosecond: p } = Tr(o, a, r);
    return it(c, d, u, h, m, f, g, y, p, o);
  }
  withPlainTime(e) {
    if (!L(this)) throw new TypeError("invalid receiver");
    const t = s(this, M), r = s(this, $), o = s(this, Y), i = s(this, b);
    if (e === void 0) return it(t, r, o, 0, 0, 0, 0, 0, 0, i);
    const a = Bt(e);
    return it(t, r, o, s(a, j), s(a, U), s(a, z), s(a, q), s(a, B), s(a, Z), i);
  }
  withPlainDate(e) {
    if (!L(this)) throw new TypeError("invalid receiver");
    const t = ae(e), r = s(t, M), o = s(t, $), i = s(t, Y);
    let a = s(t, b);
    const c = s(this, j), d = s(this, U), u = s(this, z), h = s(this, q), m = s(this, B), f = s(this, Z);
    return a = Fa(s(this, b), a), it(r, o, i, c, d, u, h, m, f, a);
  }
  withCalendar(e) {
    if (!L(this)) throw new TypeError("invalid receiver");
    const t = dt(e);
    return new Mr(s(this, M), s(this, $), s(this, Y), s(this, j), s(this, U), s(this, z), s(this, q), s(this, B), s(this, Z), t);
  }
  add(e, t) {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Xi("add", this, e, t);
  }
  subtract(e, t) {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Xi("subtract", this, e, t);
  }
  until(e, t) {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Zi("until", this, e, t);
  }
  since(e, t) {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Zi("since", this, e, t);
  }
  round(e) {
    if (!L(this)) throw new TypeError("invalid receiver");
    if (e === void 0) throw new TypeError("options parameter is required");
    const t = typeof e == "string" ? Zn("smallestUnit", e) : X(e), r = Xn(t), o = Mt(t, "halfExpand"), i = ct(t, "smallestUnit", "time", bn, ["day"]), a = { day: 1, hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[i];
    Qn(r, a, a === 1);
    let c = s(this, M), d = s(this, $), u = s(this, Y), h = s(this, j), m = s(this, U), f = s(this, z), g = s(this, q), y = s(this, B), p = s(this, Z);
    return { year: c, month: d, day: u, hour: h, minute: m, second: f, millisecond: g, microsecond: y, nanosecond: p } = si(c, d, u, h, m, f, g, y, p, r, i, o), it(c, d, u, h, m, f, g, y, p, s(this, b));
  }
  equals(e) {
    if (!L(this)) throw new TypeError("invalid receiver");
    const t = pn(e);
    for (const r of [M, $, Y, j, U, z, q, B, Z])
      if (s(this, r) !== s(t, r)) return !1;
    return Cr(s(this, b), s(t, b));
  }
  toString(e) {
    if (!L(this)) throw new TypeError("invalid receiver");
    const t = X(e), r = pr(t), o = wr(t), i = Mt(t, "trunc"), a = ct(t, "smallestUnit", "time", void 0);
    if (a === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const { precision: c, unit: d, increment: u } = vr(a, o);
    return Ai(this, c, r, { unit: d, increment: u, roundingMode: i });
  }
  toJSON() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Ai(this, "auto");
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
    return Se(s(nt(r, this, Un(X(t))), F), r, s(this, b));
  }
  toPlainDate() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return qn(this);
  }
  toPlainYearMonth() {
    if (!L(this)) throw new TypeError("invalid receiver");
    const e = s(this, b);
    return Cn(e, G(this, ke(e, ["monthCode", "year"]), []));
  }
  toPlainMonthDay() {
    if (!L(this)) throw new TypeError("invalid receiver");
    const e = s(this, b);
    return zn(e, G(this, ke(e, ["day", "monthCode"]), []));
  }
  toPlainTime() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Jo(this);
  }
  getISOFields() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return { calendar: s(this, b), isoDay: s(this, Y), isoHour: s(this, j), isoMicrosecond: s(this, B), isoMillisecond: s(this, q), isoMinute: s(this, U), isoMonth: s(this, $), isoNanosecond: s(this, Z), isoSecond: s(this, z), isoYear: s(this, M) };
  }
  getCalendar() {
    if (!L(this)) throw new TypeError("invalid receiver");
    return Jn(s(this, b));
  }
  static from(e, t) {
    const r = X(t);
    return L(e) ? (De(r), it(s(e, M), s(e, $), s(e, Y), s(e, j), s(e, U), s(e, z), s(e, q), s(e, B), s(e, Z), s(e, b))) : pn(e, r);
  }
  static compare(e, t) {
    const r = pn(e), o = pn(t);
    for (const i of [M, $, Y, j, U, z, q, B, Z]) {
      const a = s(r, i), c = s(o, i);
      if (a !== c) return vn(a - c);
    }
    return 0;
  }
}
jt(Mr, "Temporal.PlainDateTime");
class nn {
  constructor(e = 0, t = 0, r = 0, o = 0, i = 0, a = 0, c = 0, d = 0, u = 0, h = 0) {
    const m = e === void 0 ? 0 : xe(e), f = t === void 0 ? 0 : xe(t), g = r === void 0 ? 0 : xe(r), y = o === void 0 ? 0 : xe(o), p = i === void 0 ? 0 : xe(i), w = a === void 0 ? 0 : xe(a), v = c === void 0 ? 0 : xe(c), T = d === void 0 ? 0 : xe(d), E = u === void 0 ? 0 : xe(u), D = h === void 0 ? 0 : xe(h);
    Xr(m, f, g, y, p, w, v, T, E, D), Ut(this), W(this, Ve, m), W(this, Ne, f), W(this, ot, g), W(this, Ge, y), W(this, He, p), W(this, Ke, w), W(this, Xe, v), W(this, Qe, T), W(this, Je, E), W(this, et, D);
  }
  get years() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, Ve);
  }
  get months() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, Ne);
  }
  get weeks() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return s(this, ot);
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
    return At(s(this, Ve), s(this, Ne), s(this, ot), s(this, Ge), s(this, He), s(this, Ke), s(this, Xe), s(this, Qe), s(this, Je), s(this, et));
  }
  get blank() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return At(s(this, Ve), s(this, Ne), s(this, ot), s(this, Ge), s(this, He), s(this, Ke), s(this, Xe), s(this, Qe), s(this, Je), s(this, et)) === 0;
  }
  with(e) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    const t = G(e, ["days", "hours", "microseconds", "milliseconds", "minutes", "months", "nanoseconds", "seconds", "weeks", "years"], "partial"), { years: r = s(this, Ve), months: o = s(this, Ne), weeks: i = s(this, ot), days: a = s(this, Ge), hours: c = s(this, He), minutes: d = s(this, Ke), seconds: u = s(this, Xe), milliseconds: h = s(this, Qe), microseconds: m = s(this, Je), nanoseconds: f = s(this, et) } = t;
    return new nn(r, o, i, a, c, d, u, h, m, f);
  }
  negated() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return Va(this);
  }
  abs() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return new nn(Math.abs(s(this, Ve)), Math.abs(s(this, Ne)), Math.abs(s(this, ot)), Math.abs(s(this, Ge)), Math.abs(s(this, He)), Math.abs(s(this, Ke)), Math.abs(s(this, Xe)), Math.abs(s(this, Qe)), Math.abs(s(this, Je)), Math.abs(s(this, et)));
  }
  add(e, t) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return Hi("add", this, e, t);
  }
  subtract(e, t) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return Hi("subtract", this, e, t);
  }
  round(e) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    if (e === void 0) throw new TypeError("options parameter is required");
    let t = s(this, Ve), r = s(this, Ne), o = s(this, ot), i = s(this, Ge), a = s(this, He), c = s(this, Ke), d = s(this, Xe), u = s(this, Qe), h = s(this, Je), m = s(this, et), f = Po(t, r, o, i, a, c, d, u, h, m);
    const g = typeof e == "string" ? Zn("smallestUnit", e) : X(e);
    let y = ct(g, "largestUnit", "datetime", void 0, ["auto"]), p = xr(g);
    const w = Xn(g), v = Mt(g, "halfExpand");
    let T = ct(g, "smallestUnit", "datetime", void 0), E = !0;
    T || (E = !1, T = "nanosecond"), f = En(f, T);
    let D = !0;
    if (y || (D = !1, y = f), y === "auto" && (y = f), !E && !D) throw new RangeError("at least one of smallestUnit or largestUnit is required");
    if (En(y, T) !== y) throw new RangeError(`largestUnit ${y} cannot be smaller than smallestUnit ${T}`);
    const k = { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[T];
    return k !== void 0 && Qn(w, k, !1), { years: t, months: r, weeks: o, days: i } = $r(t, r, o, i, y, p), { years: t, months: r, weeks: o, days: i, hours: a, minutes: c, seconds: d, milliseconds: u, microseconds: h, nanoseconds: m } = Xt(t, r, o, i, a, c, d, u, h, m, w, T, v, p), { years: t, months: r, weeks: o, days: i, hours: a, minutes: c, seconds: d, milliseconds: u, microseconds: h, nanoseconds: m } = ns(t, r, o, i, a, c, d, u, h, m, w, T, v, p), { days: i, hours: a, minutes: c, seconds: d, milliseconds: u, microseconds: h, nanoseconds: m } = Ct(i, a, c, d, u, h, m, y, p), { years: t, months: r, weeks: o, days: i } = function(C, R, P, re, Q, J) {
      const A = I("%Temporal.Duration%"), V = At(C, R, P, re, 0, 0, 0, 0, 0, 0);
      if (V === 0) return { years: C, months: R, weeks: P, days: re };
      const O = l.BigInt(V);
      let S, H, Ce = l.BigInt(C), Me = l.BigInt(R), Oe = l.BigInt(P), be = l.BigInt(re);
      J && (H = ae(J), S = s(H, b));
      const ut = new A(V), Rt = new A(0, V), $t = new A(0, 0, V);
      switch (Q) {
        case "year": {
          if (!S) throw new RangeError("a starting point is required for years balancing");
          const ht = typeof S != "string" ? oe(S, "dateAdd") : void 0;
          let Fe, mt, Rr;
          for ({ relativeTo: Fe, days: mt } = qe(S, H, ut, ht); l.greaterThanOrEqual(It(be), l.BigInt(le(mt))); ) be = l.subtract(be, l.BigInt(mt)), Ce = l.add(Ce, O), H = Fe, { relativeTo: Fe, days: mt } = qe(S, H, ut, ht);
          for ({ relativeTo: Fe, days: Rr } = qe(S, H, Rt, ht); l.greaterThanOrEqual(It(be), l.BigInt(le(Rr))); ) be = l.subtract(be, l.BigInt(Rr)), Me = l.add(Me, O), H = Fe, { relativeTo: Fe, days: Rr } = qe(S, H, Rt, ht);
          Fe = Le(S, H, ut, void 0, ht);
          const vi = typeof S != "string" ? oe(S, "dateUntil") : void 0, Ti = We(null);
          Ti.largestUnit = "month";
          let vo = on(S, H, Fe, Ti, vi), To = s(vo, Ne);
          for (; l.greaterThanOrEqual(It(Me), l.BigInt(le(To))); ) {
            Me = l.subtract(Me, l.BigInt(To)), Ce = l.add(Ce, O), H = Fe, Fe = Le(S, H, ut, void 0, ht);
            const bi = We(null);
            bi.largestUnit = "month", vo = on(S, H, Fe, bi, vi), To = s(vo, Ne);
          }
          break;
        }
        case "month": {
          if (!S) throw new RangeError("a starting point is required for months balancing");
          const ht = typeof S != "string" ? oe(S, "dateAdd") : void 0;
          let Fe, mt;
          for ({ relativeTo: Fe, days: mt } = qe(S, H, Rt, ht); l.greaterThanOrEqual(It(be), l.BigInt(le(mt))); ) be = l.subtract(be, l.BigInt(mt)), Me = l.add(Me, O), H = Fe, { relativeTo: Fe, days: mt } = qe(S, H, Rt, ht);
          break;
        }
        case "week": {
          if (!S) throw new RangeError("a starting point is required for weeks balancing");
          const ht = typeof S != "string" ? oe(S, "dateAdd") : void 0;
          let Fe, mt;
          for ({ relativeTo: Fe, days: mt } = qe(S, H, $t, ht); l.greaterThanOrEqual(It(be), l.BigInt(le(mt))); ) be = l.subtract(be, l.BigInt(mt)), Oe = l.add(Oe, O), H = Fe, { relativeTo: Fe, days: mt } = qe(S, H, $t, ht);
          break;
        }
      }
      return { years: l.toNumber(Ce), months: l.toNumber(Me), weeks: l.toNumber(Oe), days: l.toNumber(be) };
    }(t, r, o, i, y, p), new nn(t, r, o, i, a, c, d, u, h, m);
  }
  total(e) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    let t = s(this, Ve), r = s(this, Ne), o = s(this, ot), i = s(this, Ge), a = s(this, He), c = s(this, Ke), d = s(this, Xe), u = s(this, Qe), h = s(this, Je), m = s(this, et);
    if (e === void 0) throw new TypeError("options argument is required");
    const f = typeof e == "string" ? Zn("unit", e) : X(e), g = xr(f), y = ct(f, "unit", "datetime", bn);
    let p;
    ({ years: t, months: r, weeks: o, days: i } = $r(t, r, o, i, y, g)), x(g) && (p = ts(g, t, r, o, 0));
    let w = Wa(i, a, c, d, u, h, m, y, p);
    if (w === "positive overflow") return 1 / 0;
    if (w === "negative overflow") return -1 / 0;
    ({ days: i, hours: a, minutes: c, seconds: d, milliseconds: u, microseconds: h, nanoseconds: m } = w);
    const { total: v } = Xt(t, r, o, i, a, c, d, u, h, m, 1, y, "trunc", g);
    return v;
  }
  toString(e) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    const t = X(e), r = wr(t), o = Mt(t, "trunc"), i = ct(t, "smallestUnit", "time", void 0);
    if (i === "hour" || i === "minute") throw new RangeError('smallestUnit must be a time unit other than "hours" or "minutes"');
    const { precision: a, unit: c, increment: d } = vr(i, r);
    return Do(this, a, { unit: c, increment: d, roundingMode: o });
  }
  toJSON() {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return Do(this);
  }
  toLocaleString(e, t) {
    if (!pe(this)) throw new TypeError("invalid receiver");
    return typeof Intl < "u" && Intl.DurationFormat !== void 0 ? new Intl.DurationFormat(e, t).format(this) : (console.warn("Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat."), Do(this));
  }
  valueOf() {
    throw new TypeError("use compare() to compare Temporal.Duration");
  }
  static from(e) {
    return pe(e) ? new nn(s(e, Ve), s(e, Ne), s(e, ot), s(e, Ge), s(e, He), s(e, Ke), s(e, Xe), s(e, Qe), s(e, Je), s(e, et)) : xn(e);
  }
  static compare(e, t, r) {
    const o = xn(e), i = xn(t), a = xr(X(r)), c = s(o, Ve), d = s(o, Ne), u = s(o, ot);
    let h = s(o, Ge);
    const m = s(o, He), f = s(o, Ke), g = s(o, Xe), y = s(o, Qe), p = s(o, Je);
    let w = s(o, et);
    const v = s(i, Ve), T = s(i, Ne), E = s(i, ot);
    let D = s(i, Ge);
    const k = s(i, He), _ = s(i, Ke), C = s(i, Xe), R = s(i, Qe), P = s(i, Je);
    let re = s(i, et);
    const Q = zi(a, c, d, u, h), J = zi(a, v, T, E, D);
    c === 0 && v === 0 && d === 0 && T === 0 && u === 0 && E === 0 || ({ days: h } = $r(c, d, u, h, "day", a), { days: D } = $r(v, T, E, D, "day", a));
    const A = Bn(h, m, f, g, y, p, w, Q), V = Bn(D, k, _, C, R, P, re, J);
    return vn(l.toNumber(l.subtract(A, V)));
  }
}
jt(nn, "Temporal.Duration");
const Yl = Object.create;
class fi {
  constructor(e, t, r = "iso8601", o = 1972) {
    Pa(this, ee(e), ee(t), dt(r), ee(o));
  }
  get monthCode() {
    if (!Ye(this)) throw new TypeError("invalid receiver");
    return br(s(this, b), this);
  }
  get day() {
    if (!Ye(this)) throw new TypeError("invalid receiver");
    return Er(s(this, b), this);
  }
  get calendarId() {
    if (!Ye(this)) throw new TypeError("invalid receiver");
    return Ue(s(this, b));
  }
  with(e, t) {
    if (!Ye(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid argument");
    Kn(e);
    const r = X(t), o = s(this, b), i = ke(o, ["day", "month", "monthCode", "year"]);
    let a = G(this, i, []);
    return a = Dn(o, a, G(e, i, "partial")), a = G(a, i, []), zn(o, a, r);
  }
  equals(e) {
    if (!Ye(this)) throw new TypeError("invalid receiver");
    const t = xi(e);
    for (const r of [$, Y, M])
      if (s(this, r) !== s(t, r)) return !1;
    return Cr(s(this, b), s(t, b));
  }
  toString(e) {
    if (!Ye(this)) throw new TypeError("invalid receiver");
    return Fi(this, pr(X(e)));
  }
  toJSON() {
    if (!Ye(this)) throw new TypeError("invalid receiver");
    return Fi(this);
  }
  toLocaleString(e, t) {
    if (!Ye(this)) throw new TypeError("invalid receiver");
    return new hn(e, t).format(this);
  }
  valueOf() {
    throw new TypeError("use equals() to compare Temporal.PlainMonthDay");
  }
  toPlainDate(e) {
    if (!Ye(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("argument should be an object");
    const t = s(this, b), r = ke(t, ["day", "monthCode"]), o = G(this, r, []), i = ke(t, ["year"]);
    let a = Dn(t, o, G(e, i, []));
    a = G(a, [.../* @__PURE__ */ new Set([...r, ...i])], []);
    const c = Yl(null);
    return c.overflow = "reject", Kt(t, a, c);
  }
  getISOFields() {
    if (!Ye(this)) throw new TypeError("invalid receiver");
    return { calendar: s(this, b), isoDay: s(this, Y), isoMonth: s(this, $), isoYear: s(this, M) };
  }
  getCalendar() {
    if (!Ye(this)) throw new TypeError("invalid receiver");
    return Jn(s(this, b));
  }
  static from(e, t) {
    const r = X(t);
    return Ye(e) ? (De(r), dr(s(e, $), s(e, Y), s(e, b), s(e, M))) : xi(e, r);
  }
}
jt(fi, "Temporal.PlainMonthDay");
const gi = () => new (I("%Temporal.Instant%"))(ci()), na = (n, e = en()) => {
  const t = Ze(e), r = dt(n);
  return gt(t, gi(), r);
}, ko = (n = en()) => gt(Ze(n), gi(), "iso8601"), ra = (n, e = en()) => {
  const t = Ze(e), r = dt(n);
  return Se(ci(), t, r);
}, bs = { instant: gi, plainDateTime: na, plainDateTimeISO: ko, plainDate: (n, e = en()) => qn(na(n, e)), plainDateISO: (n = en()) => qn(ko(n)), plainTimeISO: (n = en()) => Jo(ko(n)), timeZoneId: () => en(), zonedDateTime: ra, zonedDateTimeISO: (n = en()) => ra("iso8601", n), [Symbol.toStringTag]: "Temporal.Now" };
Object.defineProperty(bs, Symbol.toStringTag, { value: "Temporal.Now", writable: !1, enumerable: !1, configurable: !0 });
const xl = Object.assign;
function oa(n, e, t) {
  let r = s(n, j), o = s(n, U), i = s(n, z), a = s(n, q), c = s(n, B), d = s(n, Z);
  if (t) {
    const { unit: u, increment: h, roundingMode: m } = t;
    ({ hour: r, minute: o, second: i, millisecond: a, microsecond: c, nanosecond: d } = li(r, o, i, a, c, d, h, u, m));
  }
  return `${ue(r)}:${ue(o)}${go(i, a, c, d, e)}`;
}
class Tn {
  constructor(e = 0, t = 0, r = 0, o = 0, i = 0, a = 0) {
    const c = e === void 0 ? 0 : ee(e), d = t === void 0 ? 0 : ee(t), u = r === void 0 ? 0 : ee(r), h = o === void 0 ? 0 : ee(o), m = i === void 0 ? 0 : ee(i), f = a === void 0 ? 0 : ee(a);
    wo(c, d, u, h, m, f), Ut(this), W(this, j, c), W(this, U, d), W(this, z, u), W(this, q, h), W(this, B, m), W(this, Z, f);
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
    Kn(e);
    const r = De(X(t)), o = Vr(e, "partial"), i = Vr(this);
    let { hour: a, minute: c, second: d, millisecond: u, microsecond: h, nanosecond: m } = xl(i, o);
    return { hour: a, minute: c, second: d, millisecond: u, microsecond: h, nanosecond: m } = oo(a, c, d, u, h, m, r), new Tn(a, c, d, u, h, m);
  }
  add(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    return Qi("add", this, e);
  }
  subtract(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    return Qi("subtract", this, e);
  }
  until(e, t) {
    if (!we(this)) throw new TypeError("invalid receiver");
    return Wi("until", this, e, t);
  }
  since(e, t) {
    if (!we(this)) throw new TypeError("invalid receiver");
    return Wi("since", this, e, t);
  }
  round(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    if (e === void 0) throw new TypeError("options parameter is required");
    const t = typeof e == "string" ? Zn("smallestUnit", e) : X(e), r = Xn(t), o = Mt(t, "halfExpand"), i = ct(t, "smallestUnit", "time", bn);
    Qn(r, { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[i], !1);
    let a = s(this, j), c = s(this, U), d = s(this, z), u = s(this, q), h = s(this, B), m = s(this, Z);
    return { hour: a, minute: c, second: d, millisecond: u, microsecond: h, nanosecond: m } = li(a, c, d, u, h, m, r, i, o), new Tn(a, c, d, u, h, m);
  }
  equals(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    const t = Bt(e);
    for (const r of [j, U, z, q, B, Z])
      if (s(this, r) !== s(t, r)) return !1;
    return !0;
  }
  toString(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    const t = X(e), r = wr(t), o = Mt(t, "trunc"), i = ct(t, "smallestUnit", "time", void 0);
    if (i === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const { precision: a, unit: c, increment: d } = vr(i, r);
    return oa(this, a, { unit: c, increment: d, roundingMode: o });
  }
  toJSON() {
    if (!we(this)) throw new TypeError("invalid receiver");
    return oa(this, "auto");
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
    const t = ae(e), r = s(t, M), o = s(t, $), i = s(t, Y), a = s(t, b);
    return it(r, o, i, s(this, j), s(this, U), s(this, z), s(this, q), s(this, B), s(this, Z), a);
  }
  toZonedDateTime(e) {
    if (!we(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid argument");
    const t = e.plainDate;
    if (t === void 0) throw new TypeError("missing date property");
    const r = ae(t), o = e.timeZone;
    if (o === void 0) throw new TypeError("missing timeZone property");
    const i = Ze(o), a = s(r, M), c = s(r, $), d = s(r, Y), u = s(r, b), h = s(this, j), m = s(this, U), f = s(this, z), g = s(this, q), y = s(this, B), p = s(this, Z);
    return Se(s(nt(i, new (I("%Temporal.PlainDateTime%"))(a, c, d, h, m, f, g, y, p, u), "compatible"), F), i, u);
  }
  getISOFields() {
    if (!we(this)) throw new TypeError("invalid receiver");
    return { isoHour: s(this, j), isoMicrosecond: s(this, B), isoMillisecond: s(this, q), isoMinute: s(this, U), isoNanosecond: s(this, Z), isoSecond: s(this, z) };
  }
  static from(e, t) {
    const r = De(X(t));
    return we(e) ? new Tn(s(e, j), s(e, U), s(e, z), s(e, q), s(e, B), s(e, Z)) : Bt(e, r);
  }
  static compare(e, t) {
    const r = Bt(e), o = Bt(t);
    for (const i of [j, U, z, q, B, Z]) {
      const a = s(r, i), c = s(o, i);
      if (a !== c) return vn(a - c);
    }
    return 0;
  }
}
jt(Tn, "Temporal.PlainTime");
class sr {
  constructor(e) {
    if (arguments.length < 1) throw new RangeError("missing argument: identifier is required");
    const t = ei(e);
    Ut(this), W(this, xt, t);
  }
  get id() {
    if (!pt(this)) throw new TypeError("invalid receiver");
    return s(this, xt);
  }
  getOffsetNanosecondsFor(e) {
    if (!pt(this)) throw new TypeError("invalid receiver");
    const t = kt(e), r = s(this, xt);
    return Rn(r) ? an(r) : Zt(r, s(t, F));
  }
  getOffsetStringFor(e) {
    if (!pt(this)) throw new TypeError("invalid receiver");
    return No(this, kt(e));
  }
  getPlainDateTimeFor(e, t = "iso8601") {
    if (!pt(this)) throw new TypeError("invalid receiver");
    return gt(this, kt(e), dt(t));
  }
  getInstantFor(e, t) {
    if (!pt(this)) throw new TypeError("invalid receiver");
    return nt(this, pn(e), Un(X(t)));
  }
  getPossibleInstantsFor(e) {
    if (!pt(this)) throw new TypeError("invalid receiver");
    const t = pn(e), r = I("%Temporal.Instant%"), o = s(this, xt);
    if (Rn(o)) {
      const a = sn(s(t, M), s(t, $), s(t, Y), s(t, j), s(t, U), s(t, z), s(t, q), s(t, B), s(t, Z));
      if (a === null) throw new RangeError("DateTime outside of supported range");
      const c = an(o);
      return [new r(l.subtract(a, l.BigInt(c)))];
    }
    return function(c, d, u, h, m, f, g, y, p, w) {
      const v = sn(d, u, h, m, f, g, y, p, w);
      if (v === null) throw new RangeError("DateTime outside of supported range");
      let T = l.subtract(v, Ft);
      l.lessThan(T, cr) && (T = v);
      let E = l.add(v, Ft);
      l.greaterThan(E, Ln) && (E = v);
      const D = Zt(c, T), k = Zt(c, E);
      return (D === k ? [D] : [D, k]).map((_) => {
        const C = l.subtract(v, l.BigInt(_)), R = qa(c, C);
        if (d === R.year && u === R.month && h === R.day && m === R.hour && f === R.minute && g === R.second && y === R.millisecond && p === R.microsecond && w === R.nanosecond) return C;
      }).filter((_) => _ !== void 0);
    }(o, s(t, M), s(t, $), s(t, Y), s(t, j), s(t, U), s(t, z), s(t, q), s(t, B), s(t, Z)).map((a) => new r(a));
  }
  getNextTransition(e) {
    if (!pt(this)) throw new TypeError("invalid receiver");
    const t = kt(e), r = s(this, xt);
    if (Rn(r) || r === "UTC") return null;
    let o = s(t, F);
    const i = I("%Temporal.Instant%");
    return o = Za(r, o), o === null ? null : new i(o);
  }
  getPreviousTransition(e) {
    if (!pt(this)) throw new TypeError("invalid receiver");
    const t = kt(e), r = s(this, xt);
    if (Rn(r) || r === "UTC") return null;
    let o = s(t, F);
    const i = I("%Temporal.Instant%");
    return o = Ao(r, o), o === null ? null : new i(o);
  }
  toString() {
    if (!pt(this)) throw new TypeError("invalid receiver");
    return s(this, xt);
  }
  toJSON() {
    if (!pt(this)) throw new TypeError("invalid receiver");
    return s(this, xt);
  }
  static from(e) {
    return Sa(Ze(e));
  }
}
jt(sr, "Temporal.TimeZone"), me("Temporal.TimeZone.prototype.getOffsetNanosecondsFor", sr.prototype.getOffsetNanosecondsFor), me("Temporal.TimeZone.prototype.getPossibleInstantsFor", sr.prototype.getPossibleInstantsFor);
const Pl = Object.create;
class yi {
  constructor(e, t, r = "iso8601", o = 1) {
    Na(this, ee(e), ee(t), dt(r), ee(o));
  }
  get year() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return io(s(this, b), this);
  }
  get month() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return ao(s(this, b), this);
  }
  get monthCode() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return br(s(this, b), this);
  }
  get calendarId() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return Ue(s(this, b));
  }
  get era() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return so(s(this, b), this);
  }
  get eraYear() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return lo(s(this, b), this);
  }
  get daysInMonth() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return co(s(this, b), this);
  }
  get daysInYear() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return uo(s(this, b), this);
  }
  get monthsInYear() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return ho(s(this, b), this);
  }
  get inLeapYear() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return mo(s(this, b), this);
  }
  with(e, t) {
    if (!te(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid argument");
    Kn(e);
    const r = X(t), o = s(this, b), i = ke(o, ["month", "monthCode", "year"]);
    let a = G(this, i, []);
    return a = Dn(o, a, G(e, i, "partial")), a = G(a, i, []), Cn(o, a, r);
  }
  add(e, t) {
    if (!te(this)) throw new TypeError("invalid receiver");
    return Ji("add", this, e, t);
  }
  subtract(e, t) {
    if (!te(this)) throw new TypeError("invalid receiver");
    return Ji("subtract", this, e, t);
  }
  until(e, t) {
    if (!te(this)) throw new TypeError("invalid receiver");
    return Vi("until", this, e, t);
  }
  since(e, t) {
    if (!te(this)) throw new TypeError("invalid receiver");
    return Vi("since", this, e, t);
  }
  equals(e) {
    if (!te(this)) throw new TypeError("invalid receiver");
    const t = rr(e);
    for (const r of [M, $, Y])
      if (s(this, r) !== s(t, r)) return !1;
    return Cr(s(this, b), s(t, b));
  }
  toString(e) {
    if (!te(this)) throw new TypeError("invalid receiver");
    return Si(this, pr(X(e)));
  }
  toJSON() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return Si(this);
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
    const t = s(this, b), r = ke(t, ["monthCode", "year"]), o = G(this, r, []), i = ke(t, ["day"]);
    let a = Dn(t, o, G(e, i, []));
    a = G(a, [.../* @__PURE__ */ new Set([...r, ...i])], []);
    const c = Pl(null);
    return c.overflow = "reject", Kt(t, a, c);
  }
  getISOFields() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return { calendar: s(this, b), isoDay: s(this, Y), isoMonth: s(this, $), isoYear: s(this, M) };
  }
  getCalendar() {
    if (!te(this)) throw new TypeError("invalid receiver");
    return Jn(s(this, b));
  }
  static from(e, t) {
    const r = X(t);
    return te(e) ? (De(r), ur(s(e, M), s(e, $), s(e, b), s(e, Y))) : rr(e, r);
  }
  static compare(e, t) {
    const r = rr(e), o = rr(t);
    return tn(s(r, M), s(r, $), s(r, Y), s(o, M), s(o, $), s(o, Y));
  }
}
jt(yi, "Temporal.PlainYearMonth");
const Nl = hn.prototype.resolvedOptions, Al = Object.create;
class pi {
  constructor(e, t, r = "iso8601") {
    if (arguments.length < 1) throw new TypeError("missing argument: epochNanoseconds is required");
    Aa(this, ir(e), Ze(t), dt(r));
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
    return io(s(this, b), se(this));
  }
  get month() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return ao(s(this, b), se(this));
  }
  get monthCode() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return br(s(this, b), se(this));
  }
  get day() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Er(s(this, b), se(this));
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
    return so(s(this, b), se(this));
  }
  get eraYear() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return lo(s(this, b), se(this));
  }
  get epochSeconds() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = s(this, F);
    return l.toNumber(Pn(e, Nt));
  }
  get epochMilliseconds() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = s(this, F);
    return l.toNumber(Pn(e, vt));
  }
  get epochMicroseconds() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Jr(Pn(s(this, F), ne));
  }
  get epochNanoseconds() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Jr(s(this, F));
  }
  get dayOfWeek() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Go(s(this, b), se(this));
  }
  get dayOfYear() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Ho(s(this, b), se(this));
  }
  get weekOfYear() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Ko(s(this, b), se(this));
  }
  get yearOfWeek() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Xo(s(this, b), se(this));
  }
  get hoursInDay() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = se(this), t = I("%Temporal.PlainDateTime%"), r = s(e, M), o = s(e, $), i = s(e, Y), a = new t(r, o, i, 0, 0, 0, 0, 0, 0), c = wn(r, o, i, 0, 0, 0, 1, "reject"), d = new t(c.year, c.month, c.day, 0, 0, 0, 0, 0, 0), u = s(this, ie), h = s(nt(u, a, "compatible"), F), m = s(nt(u, d, "compatible"), F);
    return Yt(l.subtract(m, h), ka);
  }
  get daysInWeek() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Qo(s(this, b), se(this));
  }
  get daysInMonth() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return co(s(this, b), se(this));
  }
  get daysInYear() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return uo(s(this, b), se(this));
  }
  get monthsInYear() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return ho(s(this, b), se(this));
  }
  get inLeapYear() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return mo(s(this, b), se(this));
  }
  get offset() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return No(s(this, ie), s(this, Be));
  }
  get offsetNanoseconds() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Ot(s(this, ie), s(this, Be));
  }
  with(e, t) {
    if (!x(this)) throw new TypeError("invalid receiver");
    if (!ce(e)) throw new TypeError("invalid zoned-date-time-like");
    Kn(e);
    const r = X(t), o = s(this, b);
    let i = ke(o, ["day", "hour", "microsecond", "millisecond", "minute", "month", "monthCode", "nanosecond", "second", "year"]);
    i.push("offset");
    let a = G(this, i, ["offset"]);
    a = Dn(o, a, G(e, i, "partial")), a = G(a, i, ["offset"]);
    const c = Un(r), d = Wr(r, "prefer");
    let { year: u, month: h, day: m, hour: f, minute: g, second: y, millisecond: p, microsecond: w, nanosecond: v } = Tr(o, a, r);
    const T = an(a.offset), E = s(this, ie);
    return Se(Gr(u, h, m, f, g, y, p, w, v, "option", T, E, c, d, !1), E, o);
  }
  withPlainDate(e) {
    if (!x(this)) throw new TypeError("invalid receiver");
    const t = ae(e), r = s(t, M), o = s(t, $), i = s(t, Y);
    let a = s(t, b);
    const c = se(this), d = s(c, j), u = s(c, U), h = s(c, z), m = s(c, q), f = s(c, B), g = s(c, Z);
    a = Fa(s(this, b), a);
    const y = s(this, ie);
    return Se(s(nt(y, new (I("%Temporal.PlainDateTime%"))(r, o, i, d, u, h, m, f, g, a), "compatible"), F), y, a);
  }
  withPlainTime(e) {
    if (!x(this)) throw new TypeError("invalid receiver");
    const t = I("%Temporal.PlainTime%"), r = e === void 0 ? new t() : Bt(e), o = se(this), i = s(o, M), a = s(o, $), c = s(o, Y), d = s(this, b), u = s(r, j), h = s(r, U), m = s(r, z), f = s(r, q), g = s(r, B), y = s(r, Z), p = s(this, ie);
    return Se(s(nt(p, new (I("%Temporal.PlainDateTime%"))(i, a, c, u, h, m, f, g, y, d), "compatible"), F), p, d);
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
    return ea("add", this, e, t);
  }
  subtract(e, t) {
    if (!x(this)) throw new TypeError("invalid receiver");
    return ea("subtract", this, e, t);
  }
  until(e, t) {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Gi("until", this, e, t);
  }
  since(e, t) {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Gi("since", this, e, t);
  }
  round(e) {
    if (!x(this)) throw new TypeError("invalid receiver");
    if (e === void 0) throw new TypeError("options parameter is required");
    const t = typeof e == "string" ? Zn("smallestUnit", e) : X(e), r = Xn(t), o = Mt(t, "halfExpand"), i = ct(t, "smallestUnit", "time", bn, ["day"]), a = { day: 1, hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[i];
    Qn(r, a, a === 1);
    const c = se(this);
    let d = s(c, M), u = s(c, $), h = s(c, Y), m = s(c, j), f = s(c, U), g = s(c, z), y = s(c, q), p = s(c, B), w = s(c, Z);
    const v = I("%Temporal.PlainDateTime%"), T = s(this, ie), E = s(this, b), D = nt(T, new v(s(c, M), s(c, $), s(c, Y), 0, 0, 0, 0, 0, 0), "compatible"), k = Tt(D, T, E, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0), _ = l.subtract(k, l.BigInt(s(D, F)));
    if (l.lessThanOrEqual(_, ve)) throw new RangeError("cannot round a ZonedDateTime in a calendar with zero or negative length days");
    return { year: d, month: u, day: h, hour: m, minute: f, second: g, millisecond: y, microsecond: p, nanosecond: w } = si(d, u, h, m, f, g, y, p, w, r, i, o, l.toNumber(_)), Se(Gr(d, u, h, m, f, g, y, p, w, "option", Ot(T, s(this, Be)), T, "compatible", "prefer", !1), T, s(this, b));
  }
  equals(e) {
    if (!x(this)) throw new TypeError("invalid receiver");
    const t = or(e), r = s(this, F), o = s(t, F);
    return !!l.equal(l.BigInt(r), l.BigInt(o)) && !!La(s(this, ie), s(t, ie)) && Cr(s(this, b), s(t, b));
  }
  toString(e) {
    if (!x(this)) throw new TypeError("invalid receiver");
    const t = X(e), r = pr(t), o = wr(t), i = function(g) {
      return cn(g, "offset", ["auto", "never"], "auto");
    }(t), a = Mt(t, "trunc"), c = ct(t, "smallestUnit", "time", void 0);
    if (c === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const d = function(g) {
      return cn(g, "timeZoneName", ["auto", "never", "critical"], "auto");
    }(t), { precision: u, unit: h, increment: m } = vr(c, o);
    return Li(this, u, r, d, i, { unit: h, increment: m, roundingMode: a });
  }
  toLocaleString(e, t) {
    if (!x(this)) throw new TypeError("invalid receiver");
    const r = X(t), o = Al(null);
    if (Yn(o, r, ["timeZone"]), r.timeZone !== void 0) throw new TypeError("ZonedDateTime toLocaleString does not accept a timeZone option");
    o.year === void 0 && o.month === void 0 && o.day === void 0 && o.weekday === void 0 && o.dateStyle === void 0 && o.hour === void 0 && o.minute === void 0 && o.second === void 0 && o.timeStyle === void 0 && o.dayPeriod === void 0 && o.timeZoneName === void 0 && (o.timeZoneName = "short");
    let i = hr(s(this, ie));
    if (Rn(i)) throw new RangeError("toLocaleString does not support offset string time zones");
    i = ei(i), o.timeZone = i;
    const a = new hn(e, o), c = N(Nl, a, []).calendar, d = Ue(s(this, b));
    if (d !== "iso8601" && c !== "iso8601" && c !== d) throw new RangeError(`cannot format ZonedDateTime with calendar ${d} in locale with calendar ${c}`);
    return a.format(s(this, Be));
  }
  toJSON() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Li(this, "auto");
  }
  valueOf() {
    throw new TypeError("use compare() or equals() to compare Temporal.ZonedDateTime");
  }
  startOfDay() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = se(this), t = I("%Temporal.PlainDateTime%"), r = s(this, b), o = new t(s(e, M), s(e, $), s(e, Y), 0, 0, 0, 0, 0, 0, r), i = s(this, ie);
    return Se(s(nt(i, o, "compatible"), F), i, r);
  }
  toInstant() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return new (I("%Temporal.Instant%"))(s(this, F));
  }
  toPlainDate() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return qn(se(this));
  }
  toPlainTime() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Jo(se(this));
  }
  toPlainDateTime() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return se(this);
  }
  toPlainYearMonth() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = s(this, b);
    return Cn(e, G(this, ke(e, ["monthCode", "year"]), []));
  }
  toPlainMonthDay() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = s(this, b);
    return zn(e, G(this, ke(e, ["day", "monthCode"]), []));
  }
  getISOFields() {
    if (!x(this)) throw new TypeError("invalid receiver");
    const e = se(this), t = s(this, ie);
    return { calendar: s(this, b), isoDay: s(e, Y), isoHour: s(e, j), isoMicrosecond: s(e, B), isoMillisecond: s(e, q), isoMinute: s(e, U), isoMonth: s(e, $), isoNanosecond: s(e, Z), isoSecond: s(e, z), isoYear: s(e, M), offset: No(t, s(this, Be)), timeZone: t };
  }
  getCalendar() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Jn(s(this, b));
  }
  getTimeZone() {
    if (!x(this)) throw new TypeError("invalid receiver");
    return Sa(s(this, ie));
  }
  static from(e, t) {
    const r = X(t);
    return x(e) ? (Un(r), Wr(r, "reject"), De(r), Se(s(e, F), s(e, ie), s(e, b))) : or(e, r);
  }
  static compare(e, t) {
    const r = or(e), o = or(t), i = s(r, F), a = s(o, F);
    return l.lessThan(l.BigInt(i), l.BigInt(a)) ? -1 : l.greaterThan(l.BigInt(i), l.BigInt(a)) ? 1 : 0;
  }
}
function se(n) {
  return gt(s(n, ie), s(n, Be), s(n, b));
}
jt(pi, "Temporal.ZonedDateTime");
var Vn = Object.freeze({ __proto__: null, Calendar: ye, Duration: nn, Instant: _t, Now: bs, PlainDate: kr, PlainDateTime: Mr, PlainMonthDay: fi, PlainTime: Tn, PlainYearMonth: yi, TimeZone: sr, ZonedDateTime: pi });
const Fl = [_t, ye, kr, Mr, nn, fi, Tn, sr, yi, pi];
for (const n of Fl) {
  const e = Object.getOwnPropertyDescriptor(n, "prototype");
  (e.configurable || e.enumerable || e.writable) && (e.configurable = !1, e.enumerable = !1, e.writable = !1, Object.defineProperty(n, "prototype", e));
}
const Te = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", Sl = {
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
}, Ll = {
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
function $e(n, e = Te) {
  return Vn.Instant.fromEpochMilliseconds(n.getTime()).toZonedDateTimeISO(e);
}
function Ie(n) {
  return new Date(n.epochMilliseconds);
}
function Or(n) {
  return n === 0 ? 7 : n;
}
function Es(n) {
  const e = n.trim().toLowerCase().replace(/\.$/, "");
  return Sl[e] ?? null;
}
function rn(n) {
  const e = n.trim().toLowerCase().replace(/\.$/, "");
  return Ll[e] ?? null;
}
function ia(n) {
  if (!/^\d{2,4}$/.test(n))
    return null;
  const e = Number(n);
  return n.length === 4 ? e : e <= 49 ? 2e3 + e : 1900 + e;
}
function lr(n) {
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
function aa(n) {
  const t = n.trim().toLowerCase().replace(/[.,]+$/g, "").replace(/s$/, "");
  return t === "hour" || t === "hr" || t === "h" ? "hour" : t === "day" || t === "d" ? "day" : t === "week" || t === "wk" || t === "w" ? "week" : t === "month" || t === "mo" || t === "mth" ? "month" : t === "year" || t === "yr" || t === "y" ? "year" : null;
}
function Dt(n, e = "day") {
  const t = n.trim().toLowerCase().replace(/[.,]+$/g, "");
  if (!t)
    return null;
  const r = t.match(/^([a-z]+|\d+)([a-z]+)$/i);
  if (r) {
    const c = bo(r[1]), d = aa(r[2]);
    if (c && d)
      return { amount: c, unit: d };
  }
  const o = t.split(/\s+/);
  if (o.length === 1) {
    const c = bo(o[0] ?? "");
    return c ? {
      amount: c,
      unit: e
    } : null;
  }
  const i = bo(o[0] ?? ""), a = aa(o.slice(1).join(" "));
  return !i || !a ? null : {
    amount: i,
    unit: a
  };
}
function Gn(n, e, t, r = 0, o = 0, i = Te) {
  const a = Vn.ZonedDateTime.from({
    timeZone: i,
    year: n,
    month: e,
    day: t,
    hour: r,
    minute: o,
    second: 0,
    millisecond: 0
  });
  return Ie(a);
}
function Mo(n) {
  return $e(n, "UTC").toInstant().toString();
}
function Fr(n, e = Te) {
  const t = $e(n, e);
  return `${t.year}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
}
function Ae(n, e, t, r = Te) {
  const o = $e(n, r);
  return Ie(t === "hour" ? o.add({ hours: e }) : t === "day" ? o.add({ days: e }) : t === "week" ? o.add({ weeks: e }) : t === "month" ? o.add({ months: e }) : o.add({ years: e }));
}
function jl(n, e = Te) {
  const t = $e(n, e), r = t.hour !== 0 || t.minute !== 0, o = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: e
  });
  return r ? new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: e
  }).format(n) : o.format(n);
}
function Ul(n, e, t = Te) {
  const r = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: t
  }), o = r.format(n), i = r.format(e), a = Math.max(0, Math.round((Gt(e, t).getTime() - Gt(n, t).getTime()) / 864e5));
  return a > 0 ? `${o} - ${i} (${a} days)` : `${o} - ${i}`;
}
function Gt(n, e = Te) {
  const t = $e(n, e).with({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0
  });
  return Ie(t);
}
function eo(n, e, t = Te) {
  const r = Gt(n, t), o = $e(r, t), a = (Or(e) - o.dayOfWeek + 7) % 7, c = a === 0 ? 7 : a;
  return Ie(o.add({ days: c }));
}
function Ds(n, e, t = Te) {
  const r = Gt(n, t), o = $e(r, t), i = Or(e);
  let a = (o.dayOfWeek - i + 7) % 7;
  return a === 0 && (a = 7), Ie(o.subtract({ days: a }));
}
function sa(n, e, t, r, o = Te) {
  const i = $e(to(n, e, t, o), o);
  return Ie(i.add({ days: (r - 1) * 7 }));
}
function la(n, e, t, r = Te) {
  let o = Vn.ZonedDateTime.from({
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
  const i = Or(t);
  for (; o.dayOfWeek !== i; )
    o = o.subtract({ days: 1 });
  return Ie(o);
}
function Oo(n, e, t, r, o = Te) {
  const i = $e(n, o), a = sa(i.year, e, t, r, o);
  return a.getTime() > n.getTime() ? a : sa(i.year + 1, e, t, r, o);
}
function zl(n, e, t, r = Te) {
  const o = $e(n, r), i = la(o.year, e, t, r);
  return i.getTime() > n.getTime() ? i : la(o.year + 1, e, t, r);
}
function to(n, e, t, r = Te) {
  let o = Vn.ZonedDateTime.from({
    timeZone: r,
    year: n,
    month: e,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
  const i = Or(t);
  for (; o.dayOfWeek !== i; )
    o = o.add({ days: 1 });
  return Ie(o);
}
function ql(n, e, t, r = Te) {
  const o = $e(n, r);
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
    const c = Or(t);
    for (; a.month === e; ) {
      if (a.dayOfWeek === c)
        return Ie(a);
      a = a.add({ days: 1 });
    }
    i += 1;
  }
  return to(i, e, t, r);
}
function mn(n, e, t, r = Te) {
  const o = $e(n, r);
  let i = o.year, a = Vn.ZonedDateTime.from({
    timeZone: r,
    year: i,
    month: e,
    day: t,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
  return a.epochMilliseconds <= o.epochMilliseconds && (i += 1, a = Vn.ZonedDateTime.from({
    timeZone: r,
    year: i,
    month: e,
    day: t,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  })), Ie(a);
}
function Bl(n, e = Te) {
  const t = $e(n, e);
  let r = t.year, o = $e(to(r, 9, 1, e), e);
  return o.epochMilliseconds <= t.epochMilliseconds && (r += 1, o = $e(to(r, 9, 1, e), e)), Ie(o);
}
function ca(n, e, t = Te) {
  const r = $e(n, t);
  return e < 1 || e > r.daysInMonth ? null : Ie(
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
function Cs(n, e, t = Te) {
  const r = $e(Gt(n, t), t), o = e === "monday" ? 1 : 7, i = (r.dayOfWeek - o + 7) % 7;
  return Ie(r.subtract({ days: i }));
}
function Zl(n, e, t = Te) {
  const r = Cs(n, e, t);
  return Ae(r, 6, "day", t);
}
function Wl(n, e = Te) {
  const t = $e(n, e).with({
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0
  });
  return Ie(t);
}
function Vl(n, e = Te) {
  const t = $e(n, e);
  return Ie(
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
function Gl(n, e = Te) {
  const t = $e(n, e).with({
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0
  });
  return Ie(t);
}
function Hl(n, e = Te) {
  const t = $e(n, e).with({
    month: 12,
    day: 31,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0
  });
  return Ie(t);
}
function Kl(n, e = Te) {
  const t = Gt(n, e), r = $e(t, e), o = r.dayOfWeek % 7, i = r.subtract({ days: o }), a = i.subtract({ days: 1 });
  return {
    start: Ie(a),
    end: Ie(i)
  };
}
function Xl(n) {
  let e = 0;
  function t(r) {
    return e += 1, `candidate-${r}-${e}`;
  }
  return {
    createPoint({ date: r, suggestionText: o, confidence: i, source: a, id: c }) {
      return {
        id: c ?? t("point"),
        kind: "point",
        utcIso: Mo(r),
        isoDate: Fr(r, n),
        label: jl(r, n),
        confidence: i,
        source: a,
        suggestionText: o
      };
    },
    createRange({ startDate: r, endDate: o, suggestionText: i, confidence: a, source: c }) {
      const d = st(r), u = st(o);
      return {
        id: t("range"),
        kind: "range",
        range: {
          startUtcIso: Mo(d),
          endUtcIso: Mo(u),
          startDate: Fr(d, n),
          endDate: Fr(u, n)
        },
        label: Ul(d, u, n),
        confidence: a,
        source: c,
        suggestionText: i
      };
    }
  };
}
function st(n) {
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
function Ql(n) {
  return n ? n.kind === "point" ? n.isoDate ?? null : n.range ? `${n.range.startDate}/${n.range.endDate}` : null : null;
}
const Jl = [
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
  "xmas",
  "christmas eve",
  "new year",
  "new year's day",
  "new years",
  "new year's eve",
  "new years eve",
  "labor day",
  "memorial day",
  "thanksgiving",
  "mother's day",
  "mothers day",
  "father's day",
  "fathers day",
  "halloween",
  "valentine's day",
  "valentines day",
  "july 4th",
  "4th of july",
  "independence day",
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
], ec = ["today", "tomorrow", "next friday", "christmas"], tc = 5, nc = 2;
function Sr(n) {
  if (!n.trim())
    return ec.map((o, i) => ({
      id: `suggestion-${i + 1}`,
      label: o,
      insertText: o,
      kind: "shortcut",
      confidence: 0.5
    }));
  const e = n.toLowerCase(), t = [], r = /* @__PURE__ */ new Set();
  for (const o of Jl) {
    const i = rc(e, o);
    if (i < nc || i >= o.length)
      continue;
    const a = o.slice(i), c = n + a, d = c.toLowerCase();
    r.has(d) || (r.add(d), t.push({ insertText: c, overlap: i, termLength: o.length }));
  }
  return t.sort((o, i) => i.overlap !== o.overlap ? i.overlap - o.overlap : o.termLength - i.termLength), t.slice(0, tc).map((o, i) => ({
    id: `suggestion-${i + 1}`,
    label: o.insertText,
    insertText: o.insertText,
    kind: "completion",
    confidence: 0.5 + Math.min(o.overlap / 10, 0.4)
  }));
}
function rc(n, e) {
  const t = Math.min(n.length, e.length);
  for (let r = t; r > 0; r -= 1) {
    if (!n.endsWith(e.slice(0, r)))
      continue;
    const o = n.length - r - 1;
    if (o < 0 || /\s/.test(n.charAt(o)))
      return r;
  }
  return 0;
}
function wi(n, e, t) {
  const r = Ht(n), o = r.match(/^([0-1]?\d)[/\-.]([0-3]?\d)[/\-.](\d{2,4})(?:\s+([\d:]+(?:\s*(?:am|pm))?))?$/);
  if (o) {
    const c = Number(o[1]), d = Number(o[2]), u = ia(o[3]), h = o[4] ? lr(o[4]) : null;
    return !u || !da(u, c, d, t) ? null : {
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
    const c = i[1] === "yesterday" ? -1 : i[1] === "tomorrow" ? 1 : 0, d = c === 0 ? new Date(e.getTime()) : Ae(e, c, "day", t), u = i[2] ? lr(i[2]) : null;
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
    const c = Es(a[1]), d = Number(xs(a[2])), u = a[3] ? ia(a[3]) : null, h = a[4] ? lr(a[4]) : null, m = u ?? e.getFullYear();
    return c === null || !da(m, c, d, t) ? null : {
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
function da(n, e, t, r) {
  if (e < 1 || e > 12 || t < 1 || t > 31)
    return !1;
  try {
    const o = Gn(n, e, t, 0, 0, r), i = `${n}-${String(e).padStart(2, "0")}-${String(t).padStart(2, "0")}`;
    return Fr(o, r) === i;
  } catch {
    return !1;
  }
}
const oc = [
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
    resolve: (n, e) => Bl(n, e)
  },
  {
    aliases: ["memorial day"],
    resolve: (n, e) => zl(n, 5, 1, e)
  },
  {
    aliases: ["thanksgiving", "thanksgiving day", "turkey day"],
    resolve: (n, e) => Oo(n, 11, 4, 4, e)
  },
  {
    aliases: ["mother's day", "mothers day"],
    resolve: (n, e) => Oo(n, 5, 0, 2, e)
  },
  {
    aliases: ["father's day", "fathers day"],
    resolve: (n, e) => Oo(n, 6, 0, 3, e)
  },
  {
    aliases: ["halloween"],
    resolve: (n, e) => mn(n, 10, 31, e)
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
function ua(n) {
  return Ht(n).replace(/['’]/g, "").replace(/\s+/g, " ").trim();
}
function Yr(n, e, t) {
  const r = ua(n);
  for (const o of oc)
    if (o.aliases.some((i) => ua(i) === r))
      return o.resolve(e, t);
  return null;
}
function mr(n, e, t) {
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
    const g = r[n], y = Gt(e, t);
    return {
      kind: "point",
      date: g === 0 ? y : Ae(y, g, "day", t),
      suggestionText: n
    };
  }
  const o = n.match(/^(today|tomorrow|yesterday)\s+([\d:]+(?:\s*(?:am|pm))?)$/);
  if (o) {
    const g = lr(o[2]);
    if (!g)
      return null;
    const y = r[o[1]] ?? 0, p = Ae(Gt(e, t), y, "day", t);
    return {
      kind: "point",
      date: Gn(
        p.getFullYear(),
        p.getMonth() + 1,
        p.getDate(),
        g.hour,
        g.minute,
        t
      ),
      suggestionText: n
    };
  }
  const i = n.match(/^(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)$/);
  if (i) {
    const g = Number(i[1]), y = ca(e, g, t), p = Gt(e, t);
    if (y && y.getTime() >= p.getTime())
      return {
        kind: "point",
        date: y,
        suggestionText: n
      };
    const w = Ae(p, 1, "month", t), v = ca(w, g, t);
    if (v)
      return {
        kind: "point",
        date: v,
        suggestionText: n
      };
  }
  const a = ic(n, e, t);
  if (a)
    return a;
  const c = n.match(/^next\s+([a-z]+)\s+in\s+([a-z]+)$/);
  if (c) {
    const g = rn(c[1]), y = Es(c[2]);
    return g === null || y === null ? null : {
      kind: "point",
      date: ql(e, y, g, t),
      suggestionText: n
    };
  }
  const d = n.match(/^(?:next|this)\s+([a-z]+)$/);
  if (d) {
    const g = rn(d[1]);
    if (g !== null)
      return {
        kind: "point",
        date: eo(e, g, t),
        suggestionText: n
      };
  }
  const u = n.match(/^(?:last|past)\s+([a-z]+)$/);
  if (u) {
    const g = rn(u[1]);
    if (g !== null)
      return {
        kind: "point",
        date: Ds(e, g, t),
        suggestionText: n
      };
  }
  const h = rn(n);
  if (h !== null)
    return {
      kind: "point",
      date: eo(e, h, t),
      suggestionText: n
    };
  const m = wi(n, e, t);
  if (!m)
    return null;
  const f = m.year ?? e.getFullYear();
  return {
    kind: "point",
    date: Gn(f, m.month, m.day, m.hour, m.minute, t),
    suggestionText: n
  };
}
function ic(n, e, t) {
  const r = n.match(/^(.+)\s+weekend$/);
  if (r) {
    const c = Yr(r[1], e, t);
    if (c) {
      const d = Kl(c, t);
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
    const c = rn(o[1]), d = o[2], u = Yr(o[3], e, t);
    if (c !== null && u)
      return {
        kind: "point",
        date: d === "before" ? Ds(u, c, t) : eo(u, c, t),
        suggestionText: n
      };
  }
  const i = n.match(/^(.+?)\s+(\d{4})$/);
  if (i) {
    const [, c, d] = i, u = Number.parseInt(d, 10), h = Gn(u - 1, 12, 31, 23, 59, t), m = Yr(c, h, t);
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
function ha(n, e, t) {
  const r = Ht(n), o = wi(n, e, t);
  if (o) {
    const f = o.year ?? e.getFullYear();
    return {
      date: Gn(f, o.month, o.day, o.hour, o.minute, t),
      rollUnit: o.hasYear ? null : "year"
    };
  }
  const i = mr(r, e, t);
  if (i) {
    const f = i.kind === "point" ? i.date : i.start, g = ac(r) ? "week" : null;
    return { date: f, rollUnit: g };
  }
  const a = r.match(/^(.+?)(?:\s*\+\s*|\s+plus\s+)(.+)$/);
  if (a) {
    const f = mr(Ht(a[1]), e, t), g = Dt(a[2], "day");
    if (f && g) {
      const y = f.kind === "point" ? f.date : f.end, p = Ae(y, g.amount, g.unit, t);
      return { date: st(p), rollUnit: null };
    }
  }
  const c = r.match(/^(.+)\s+from\s+now$/);
  if (c) {
    const f = Dt(c[1], "day");
    if (f) {
      const g = Ae(e, f.amount, f.unit, t);
      return { date: st(g), rollUnit: null };
    }
  }
  const d = r.match(/^(.+)\s+in\s+the\s+past$/);
  if (d) {
    const f = Dt(d[1], "day");
    if (f) {
      const g = Ae(e, -f.amount, f.unit, t);
      return { date: st(g), rollUnit: null };
    }
  }
  const u = r.match(/^(.+)\s+ago$/);
  if (u) {
    const f = Dt(u[1], "day");
    if (f) {
      const g = Ae(e, -f.amount, f.unit, t);
      return { date: st(g), rollUnit: null };
    }
  }
  const h = r.match(/^in\s+(.+)$/);
  if (h) {
    const f = Dt(h[1], "day");
    if (f) {
      const g = Ae(e, f.amount, f.unit, t);
      return { date: st(g), rollUnit: null };
    }
  }
  const m = r.match(/^(?:the\s+)?(?:last|past)\s+(.+)$/);
  if (m) {
    const f = Dt(m[1], "day");
    if (f) {
      const g = Ae(e, -f.amount, f.unit, t);
      return { date: st(g), rollUnit: null };
    }
  }
  return null;
}
function ac(n) {
  if (rn(n) !== null)
    return !0;
  const e = n.match(/^(?:next|this|last|past)\s+([a-z]+)$/);
  return !!(e && rn(e[1]) !== null);
}
function sc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = [" to ", " through ", " until ", " - "];
  for (const a of i) {
    if (!e.includes(a))
      continue;
    const [c, d] = e.split(a, 2);
    if (!c || !d)
      continue;
    const u = ha(c, t, r), h = ha(d, t, r);
    if (!u || !h)
      continue;
    let m = u.date, f = h.date;
    if (h.rollUnit && f.getTime() < m.getTime()) {
      const g = h.rollUnit === "year" ? "year" : "week";
      for (; f.getTime() < m.getTime(); )
        f = Ae(f, 1, g, r);
    }
    if (f.getTime() < m.getTime()) {
      const g = m;
      m = f, f = g;
    }
    return o.createRange({
      startDate: m,
      endDate: f,
      suggestionText: e,
      confidence: 0.96,
      source: "rule"
    });
  }
  return null;
}
function lc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^(.+?)(?:\s*\+\s*|\s+plus\s+)(.+)$/);
  if (!i)
    return null;
  const a = Ht(i[1]), c = Dt(i[2], "day");
  if (!c)
    return null;
  const d = mr(a, t, r);
  if (!d)
    return null;
  const u = d.kind === "point" ? d.date : d.end, h = Ae(u, c.amount, c.unit, r);
  return o.createPoint({
    date: st(h),
    suggestionText: e,
    confidence: 0.93,
    source: "rule"
  });
}
function cc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^(.+)\s+ago$/);
  if (!i)
    return null;
  const a = Dt(i[1], "day");
  if (!a)
    return null;
  const c = Ae(t, -a.amount, a.unit, r);
  return o.createPoint({
    date: st(c),
    suggestionText: e,
    confidence: 0.9,
    source: "rule"
  });
}
function dc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^in\s+(.+)$/);
  if (!i)
    return null;
  const a = Dt(i[1], "day");
  if (!a)
    return null;
  const c = Ae(t, a.amount, a.unit, r);
  return o.createPoint({
    date: st(c),
    suggestionText: e,
    confidence: 0.9,
    source: "rule"
  });
}
function uc(n) {
  const { normalizedInput: e, now: t, timeZone: r, parseContext: o, factory: i } = n, a = e.match(
    /^(start|beginning|end)\s+of\s+(?:the\s+)?(?:(this|next|last|current)\s+)?(week|month|year)$/
  );
  if (!a)
    return null;
  const c = a[1] === "end" ? "end" : "start", d = mc(a[2]), u = a[3], h = _s(t, d, u, r), m = zo(h, u, c, o.weekStart, r);
  return i.createPoint({
    date: m,
    suggestionText: e,
    confidence: 0.95,
    source: "rule"
  });
}
function hc(n) {
  const { normalizedInput: e, now: t, timeZone: r, parseContext: o, factory: i } = n, a = e.match(/^(this|next|last)\s+(week|month|year)$/);
  if (!a)
    return null;
  const c = a[1], d = a[2], u = _s(t, c, d, r), h = zo(u, d, "start", o.weekStart, r), m = zo(u, d, "end", o.weekStart, r);
  return i.createRange({
    startDate: h,
    endDate: m,
    suggestionText: e,
    confidence: 0.95,
    source: "rule"
  });
}
function mc(n) {
  return n === "next" || n === "last" ? n : "this";
}
function _s(n, e, t, r) {
  return e === "this" ? n : Ae(n, e === "next" ? 1 : -1, t, r);
}
function zo(n, e, t, r, o) {
  return e === "week" ? t === "start" ? Cs(n, r, o) : Zl(n, r, o) : e === "month" ? t === "start" ? Wl(n, o) : Vl(n, o) : t === "start" ? Gl(n, o) : Hl(n, o);
}
function fc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^(?:the\s+)?(?:last|past)\s+(.+)$/);
  if (!i)
    return null;
  const a = Dt(i[1], "day");
  if (!a)
    return null;
  const c = Ae(t, -a.amount, a.unit, r);
  return o.createRange({
    startDate: st(c),
    endDate: st(t),
    suggestionText: e,
    confidence: 0.9,
    source: "rule"
  });
}
function gc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = mr(e, t, r);
  return !i || i.kind !== "range" ? null : o.createRange({
    startDate: i.start,
    endDate: i.end,
    suggestionText: e,
    confidence: 0.92,
    source: "rule"
  });
}
function yc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^(.+)\s+in\s+the\s+past$/);
  if (!i)
    return null;
  const a = Dt(i[1], "day");
  if (!a)
    return null;
  const c = Ae(t, -a.amount, a.unit, r);
  return o.createPoint({
    date: st(c),
    suggestionText: e,
    confidence: 0.9,
    source: "rule"
  });
}
function pc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = e.match(/^(.+)\s+from\s+now$/);
  if (!i)
    return null;
  const a = Dt(i[1], "day");
  if (!a)
    return null;
  const c = Ae(t, a.amount, a.unit, r);
  return o.createPoint({
    date: st(c),
    suggestionText: e,
    confidence: 0.9,
    source: "rule"
  });
}
function wc(n) {
  const { normalizedInput: e, now: t, timeZone: r, parseContext: o, factory: i } = n;
  if (e.includes(" in "))
    return null;
  const a = e.match(/^next\s+([a-z]+)(?:\s+([\w:]+(?:\s*(?:am|pm))?))?$/);
  if (!a)
    return null;
  const c = rn(a[1]);
  if (c === null)
    return null;
  const d = a[2] ? lr(a[2]) : o.productRules.defaultTime ?? {
    hour: 9,
    minute: 0
  };
  if (!d)
    return null;
  const u = eo(t, c, r);
  u.setHours(d.hour, d.minute, 0, 0);
  const h = Ae(u, 7, "day", r), m = i.createPoint({
    date: u,
    suggestionText: e,
    confidence: 0.72,
    source: "rule",
    id: "candidate-this-week"
  }), f = i.createPoint({
    date: h,
    suggestionText: e,
    confidence: 0.58,
    source: "rule",
    id: "candidate-next-week"
  }), g = {
    id: "ambiguity-next-weekday",
    type: "relative_weekday_scope",
    message: "Did you mean this upcoming weekday or the following one?",
    required: !0,
    options: [
      { id: "option-this-week", label: m.label, candidateId: m.id },
      { id: "option-next-week", label: f.label, candidateId: f.id }
    ]
  };
  return {
    candidates: [m, f],
    group: g,
    suggestionTexts: ["this friday", "next friday"]
  };
}
function vc(n) {
  const { normalizedInput: e, now: t, timeZone: r, factory: o } = n, i = mr(e, t, r);
  if (i && i.kind === "point")
    return o.createPoint({
      date: i.date,
      suggestionText: i.suggestionText,
      confidence: 0.97,
      source: "rule"
    });
  const a = wi(e, t, r);
  if (!a)
    return null;
  const c = a.year ?? t.getFullYear(), d = Gn(c, a.month, a.day, a.hour, a.minute, r);
  return o.createPoint({
    date: d,
    suggestionText: e,
    confidence: 0.95,
    source: "rule"
  });
}
class Tc {
  parse(e, t) {
    const r = Rs(e);
    if (!r)
      return Lr({
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
        suggestions: Sr(e)
      });
    const o = bc(t), i = Ec(t), a = Xl(i), c = {
      normalizedInput: r,
      now: o,
      timeZone: i,
      parseContext: t,
      factory: a
    }, d = [
      { rule: sc, kind: "range" },
      { rule: lc, kind: "point" },
      { rule: dc, kind: "point" },
      { rule: cc, kind: "point" },
      { rule: uc, kind: "point" },
      { rule: hc, kind: "range" },
      { rule: fc, kind: "range" },
      { rule: gc, kind: "range" },
      { rule: yc, kind: "point" },
      { rule: pc, kind: "point" }
    ];
    for (const { rule: m, kind: f } of d) {
      const g = m(c);
      if (g)
        return ma(e, f, g);
    }
    const u = wc(c);
    if (u)
      return Lr({
        rawInput: e,
        status: "ambiguous",
        astType: "relative_weekday_datetime",
        valueKind: "point",
        candidates: u.candidates,
        ambiguityGroups: [u.group],
        selectedCandidateId: null,
        previewLabel: u.candidates[0]?.label ?? null,
        canonicalValue: null,
        errors: [],
        suggestions: Sr(e)
      });
    const h = vc(c);
    return h ? ma(e, "point", h) : Lr({
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
      suggestions: Sr(e)
    });
  }
}
function ma(n, e, t) {
  return Lr({
    rawInput: n,
    status: "valid",
    astType: e === "range" ? "range" : "datetime",
    valueKind: e,
    candidates: [t],
    ambiguityGroups: [],
    selectedCandidateId: t.id,
    previewLabel: t.label,
    canonicalValue: Ql(t),
    errors: [],
    suggestions: Sr(n)
  });
}
function Lr(n) {
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
function bc(n) {
  const e = new Date(n.nowIso);
  return Number.isNaN(e.getTime()) ? /* @__PURE__ */ new Date() : e;
}
function Ec(n) {
  return n.timezone || "UTC";
}
const fa = "next Friday", Is = document.createElement("template");
Is.innerHTML = `
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
    .ambiguity-list {
      margin-top: 0.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
    .ambiguity-list[hidden] {
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
	<p>Type any date format (mar 1 26, 3/1/26, christmas, xmas, xmas + 2)<br />Hit <kbd  class="ghost-hint" >Tab</kbd> to autocomplete.</p>
  <div class="ambiguity-list" part="ambiguity-list" hidden></div>
`;
class Dc extends HTMLElement {
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
  parser = new Tc();
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
    super(), this.attachShadow({ mode: "open" }), this.shadowRoot?.append(Is.content.cloneNode(!0));
    const e = this.shadowRoot;
    if (!e)
      throw new Error("Unable to create shadow root.");
    this.inputElement = e.querySelector("input") ?? document.createElement("input"), this.ghostTypedElement = e.querySelector(".ghost-typed") ?? document.createElement("span"), this.ghostTailElement = e.querySelector(".ghost-tail") ?? document.createElement("span"), this.ghostHintElement = e.querySelector(".ghost-hint") ?? document.createElement("kbd"), this.ghostResolutionElement = e.querySelector(".ghost-resolution") ?? document.createElement("span"), this.ambiguityElement = e.querySelector("[part='ambiguity-list']") ?? document.createElement("div"), this.internals = typeof this.attachInternals == "function" ? this.attachInternals() : null, this.bindEvents();
  }
  connectedCallback() {
    this.syncInputPresentation(), this.parseAndRender();
  }
  attributeChangedCallback(e, t, r) {
    if (t !== r) {
      if (e === "placeholder") {
        this.inputElement.placeholder = r ?? fa;
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
    return !t || t.insertText === Ht(this.rawInputValue) ? !1 : (this.rawInputValue = t.insertText, this.activeSuggestionIndexValue = e, this.syncInputPresentation(), this.emit("suggestion-accept", {
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
    const e = Ht(this.rawInputValue), t = this.parseState.suggestions[this.activeSuggestionIndexValue];
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
        r.type = "button", r.setAttribute("part", "chip"), r.textContent = t.label, r.addEventListener("click", () => {
          this.resolveAmbiguity(e.id, t.id);
        }), this.ambiguityElement.append(r);
      });
    });
  }
  syncInputPresentation() {
    this.inputElement.value !== this.rawInputValue && (this.inputElement.value = this.rawInputValue), this.inputElement.placeholder = this.getAttribute("placeholder") ?? fa, this.inputElement.disabled = this.hasAttribute("disabled");
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
customElements.get("hot-date") || customElements.define("hot-date", Dc);
export {
  Dc as HotDateElement
};
