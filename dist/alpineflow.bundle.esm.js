let vo = null;
function Br(t) {
  vo = t;
}
function Ee() {
  if (!vo)
    throw new Error("[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.");
  return vo;
}
var Xr = { value: () => {
} };
function Kn() {
  for (var t = 0, e = arguments.length, n = {}, o; t < e; ++t) {
    if (!(o = arguments[t] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Cn(n);
}
function Cn(t) {
  this._ = t;
}
function Yr(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Cn.prototype = Kn.prototype = {
  constructor: Cn,
  on: function(t, e) {
    var n = this._, o = Yr(t + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (t = o[r]).type) && (i = qr(n[i], t.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++r < s; )
      if (i = (t = o[r]).type) n[i] = di(n[i], t.name, e);
      else if (e == null) for (i in n) n[i] = di(n[i], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new Cn(t);
  },
  call: function(t, e) {
    if ((i = arguments.length - 2) > 0) for (var n = new Array(i), o = 0, i, r; o < i; ++o) n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (r = this._[t], o = 0, i = r.length; o < i; ++o) r[o].value.apply(e, n);
  },
  apply: function(t, e, n) {
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (var o = this._[t], i = 0, r = o.length; i < r; ++i) o[i].value.apply(e, n);
  }
};
function qr(t, e) {
  for (var n = 0, o = t.length, i; n < o; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function di(t, e, n) {
  for (var o = 0, i = t.length; o < i; ++o)
    if (t[o].name === e) {
      t[o] = Xr, t = t.slice(0, o).concat(t.slice(o + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var _o = "http://www.w3.org/1999/xhtml";
const ui = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: _o,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Gn(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), ui.hasOwnProperty(e) ? { space: ui[e], local: t } : t;
}
function Wr(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === _o && e.documentElement.namespaceURI === _o ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function jr(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function ms(t) {
  var e = Gn(t);
  return (e.local ? jr : Wr)(e);
}
function Ur() {
}
function zo(t) {
  return t == null ? Ur : function() {
    return this.querySelector(t);
  };
}
function Zr(t) {
  typeof t != "function" && (t = zo(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = r[d]) && (c = t.call(l, l.__data__, d, r)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new Ae(o, this._parents);
}
function Kr(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Gr() {
  return [];
}
function ys(t) {
  return t == null ? Gr : function() {
    return this.querySelectorAll(t);
  };
}
function Jr(t) {
  return function() {
    return Kr(t.apply(this, arguments));
  };
}
function Qr(t) {
  typeof t == "function" ? t = Jr(t) : t = ys(t);
  for (var e = this._groups, n = e.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = e[r], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (o.push(t.call(l, l.__data__, c, s)), i.push(l));
  return new Ae(o, i);
}
function ws(t) {
  return function() {
    return this.matches(t);
  };
}
function vs(t) {
  return function(e) {
    return e.matches(t);
  };
}
var ea = Array.prototype.find;
function ta(t) {
  return function() {
    return ea.call(this.children, t);
  };
}
function na() {
  return this.firstElementChild;
}
function oa(t) {
  return this.select(t == null ? na : ta(typeof t == "function" ? t : vs(t)));
}
var ia = Array.prototype.filter;
function sa() {
  return Array.from(this.children);
}
function ra(t) {
  return function() {
    return ia.call(this.children, t);
  };
}
function aa(t) {
  return this.selectAll(t == null ? sa : ra(typeof t == "function" ? t : vs(t)));
}
function la(t) {
  typeof t != "function" && (t = ws(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = [], l, c = 0; c < s; ++c)
      (l = r[c]) && t.call(l, l.__data__, c, r) && a.push(l);
  return new Ae(o, this._parents);
}
function _s(t) {
  return new Array(t.length);
}
function ca() {
  return new Ae(this._enter || this._groups.map(_s), this._parents);
}
function Tn(t, e) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = e;
}
Tn.prototype = {
  constructor: Tn,
  appendChild: function(t) {
    return this._parent.insertBefore(t, this._next);
  },
  insertBefore: function(t, e) {
    return this._parent.insertBefore(t, e);
  },
  querySelector: function(t) {
    return this._parent.querySelector(t);
  },
  querySelectorAll: function(t) {
    return this._parent.querySelectorAll(t);
  }
};
function da(t) {
  return function() {
    return t;
  };
}
function ua(t, e, n, o, i, r) {
  for (var s = 0, a, l = e.length, c = r.length; s < c; ++s)
    (a = e[s]) ? (a.__data__ = r[s], o[s] = a) : n[s] = new Tn(t, r[s]);
  for (; s < l; ++s)
    (a = e[s]) && (i[s] = a);
}
function fa(t, e, n, o, i, r, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = e.length, h = r.length, u = new Array(d), f;
  for (a = 0; a < d; ++a)
    (l = e[a]) && (u[a] = f = s.call(l, l.__data__, a, e) + "", c.has(f) ? i[a] = l : c.set(f, l));
  for (a = 0; a < h; ++a)
    f = s.call(t, r[a], a, r) + "", (l = c.get(f)) ? (o[a] = l, l.__data__ = r[a], c.delete(f)) : n[a] = new Tn(t, r[a]);
  for (a = 0; a < d; ++a)
    (l = e[a]) && c.get(u[a]) === l && (i[a] = l);
}
function ha(t) {
  return t.__data__;
}
function ga(t, e) {
  if (!arguments.length) return Array.from(this, ha);
  var n = e ? fa : ua, o = this._parents, i = this._groups;
  typeof t != "function" && (t = da(t));
  for (var r = i.length, s = new Array(r), a = new Array(r), l = new Array(r), c = 0; c < r; ++c) {
    var d = o[c], h = i[c], u = h.length, f = pa(t.call(d, d && d.__data__, c, o)), g = f.length, p = a[c] = new Array(g), w = s[c] = new Array(g), m = l[c] = new Array(u);
    n(d, h, p, w, m, f, e);
    for (var C = 0, S = 0, b, D; C < g; ++C)
      if (b = p[C]) {
        for (C >= S && (S = C + 1); !(D = w[S]) && ++S < g; ) ;
        b._next = D || null;
      }
  }
  return s = new Ae(s, o), s._enter = a, s._exit = l, s;
}
function pa(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function ma() {
  return new Ae(this._exit || this._groups.map(_s), this._parents);
}
function ya(t, e, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof t == "function" ? (o = t(o), o && (o = o.selection())) : o = o.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function wa(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, o = e._groups, i = n.length, r = o.length, s = Math.min(i, r), a = new Array(i), l = 0; l < s; ++l)
    for (var c = n[l], d = o[l], h = c.length, u = a[l] = new Array(h), f, g = 0; g < h; ++g)
      (f = c[g] || d[g]) && (u[g] = f);
  for (; l < i; ++l)
    a[l] = n[l];
  return new Ae(a, this._parents);
}
function va() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var o = t[e], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function _a(t) {
  t || (t = ba);
  function e(h, u) {
    return h && u ? t(h.__data__, u.__data__) : !h - !u;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], a = s.length, l = i[r] = new Array(a), c, d = 0; d < a; ++d)
      (c = s[d]) && (l[d] = c);
    l.sort(e);
  }
  return new Ae(i, this._parents).order();
}
function ba(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function xa() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function Ea() {
  return Array.from(this);
}
function Ca() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function Sa() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function Pa() {
  return !this.node();
}
function ka(t) {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var i = e[n], r = 0, s = i.length, a; r < s; ++r)
      (a = i[r]) && t.call(a, a.__data__, r, i);
  return this;
}
function La(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function Ma(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Ta(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function Aa(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function Na(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function $a(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function Ia(t, e) {
  var n = Gn(t);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((e == null ? n.local ? Ma : La : typeof e == "function" ? n.local ? $a : Na : n.local ? Aa : Ta)(n, e));
}
function bs(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function Da(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Ra(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function Ha(t, e, n) {
  return function() {
    var o = e.apply(this, arguments);
    o == null ? this.style.removeProperty(t) : this.style.setProperty(t, o, n);
  };
}
function Fa(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? Da : typeof e == "function" ? Ha : Ra)(t, e, n ?? "")) : Mt(this.node(), t);
}
function Mt(t, e) {
  return t.style.getPropertyValue(e) || bs(t).getComputedStyle(t, null).getPropertyValue(e);
}
function za(t) {
  return function() {
    delete this[t];
  };
}
function Oa(t, e) {
  return function() {
    this[t] = e;
  };
}
function Va(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function Ba(t, e) {
  return arguments.length > 1 ? this.each((e == null ? za : typeof e == "function" ? Va : Oa)(t, e)) : this.node()[t];
}
function xs(t) {
  return t.trim().split(/^|\s+/);
}
function Oo(t) {
  return t.classList || new Es(t);
}
function Es(t) {
  this._node = t, this._names = xs(t.getAttribute("class") || "");
}
Es.prototype = {
  add: function(t) {
    var e = this._names.indexOf(t);
    e < 0 && (this._names.push(t), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(t) {
    var e = this._names.indexOf(t);
    e >= 0 && (this._names.splice(e, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(t) {
    return this._names.indexOf(t) >= 0;
  }
};
function Cs(t, e) {
  for (var n = Oo(t), o = -1, i = e.length; ++o < i; ) n.add(e[o]);
}
function Ss(t, e) {
  for (var n = Oo(t), o = -1, i = e.length; ++o < i; ) n.remove(e[o]);
}
function Xa(t) {
  return function() {
    Cs(this, t);
  };
}
function Ya(t) {
  return function() {
    Ss(this, t);
  };
}
function qa(t, e) {
  return function() {
    (e.apply(this, arguments) ? Cs : Ss)(this, t);
  };
}
function Wa(t, e) {
  var n = xs(t + "");
  if (arguments.length < 2) {
    for (var o = Oo(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? qa : e ? Xa : Ya)(n, e));
}
function ja() {
  this.textContent = "";
}
function Ua(t) {
  return function() {
    this.textContent = t;
  };
}
function Za(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Ka(t) {
  return arguments.length ? this.each(t == null ? ja : (typeof t == "function" ? Za : Ua)(t)) : this.node().textContent;
}
function Ga() {
  this.innerHTML = "";
}
function Ja(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Qa(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function el(t) {
  return arguments.length ? this.each(t == null ? Ga : (typeof t == "function" ? Qa : Ja)(t)) : this.node().innerHTML;
}
function tl() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function nl() {
  return this.each(tl);
}
function ol() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function il() {
  return this.each(ol);
}
function sl(t) {
  var e = typeof t == "function" ? t : ms(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function rl() {
  return null;
}
function al(t, e) {
  var n = typeof t == "function" ? t : ms(t), o = e == null ? rl : typeof e == "function" ? e : zo(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function ll() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function cl() {
  return this.each(ll);
}
function dl() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function ul() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function fl(t) {
  return this.select(t ? ul : dl);
}
function hl(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function gl(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function pl(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", o = e.indexOf(".");
    return o >= 0 && (n = e.slice(o + 1), e = e.slice(0, o)), { type: e, name: n };
  });
}
function ml(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, o = -1, i = e.length, r; n < i; ++n)
        r = e[n], (!t.type || r.type === t.type) && r.name === t.name ? this.removeEventListener(r.type, r.listener, r.options) : e[++o] = r;
      ++o ? e.length = o : delete this.__on;
    }
  };
}
function yl(t, e, n) {
  return function() {
    var o = this.__on, i, r = gl(e);
    if (o) {
      for (var s = 0, a = o.length; s < a; ++s)
        if ((i = o[s]).type === t.type && i.name === t.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = r, i.options = n), i.value = e;
          return;
        }
    }
    this.addEventListener(t.type, r, n), i = { type: t.type, name: t.name, value: e, listener: r, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function wl(t, e, n) {
  var o = pl(t + ""), i, r = o.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, c = a.length, d; l < c; ++l)
        for (i = 0, d = a[l]; i < r; ++i)
          if ((s = o[i]).type === d.type && s.name === d.name)
            return d.value;
    }
    return;
  }
  for (a = e ? yl : ml, i = 0; i < r; ++i) this.each(a(o[i], e, n));
  return this;
}
function Ps(t, e, n) {
  var o = bs(t), i = o.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function vl(t, e) {
  return function() {
    return Ps(this, t, e);
  };
}
function _l(t, e) {
  return function() {
    return Ps(this, t, e.apply(this, arguments));
  };
}
function bl(t, e) {
  return this.each((typeof e == "function" ? _l : vl)(t, e));
}
function* xl() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var ks = [null];
function Ae(t, e) {
  this._groups = t, this._parents = e;
}
function ln() {
  return new Ae([[document.documentElement]], ks);
}
function El() {
  return this;
}
Ae.prototype = ln.prototype = {
  constructor: Ae,
  select: Zr,
  selectAll: Qr,
  selectChild: oa,
  selectChildren: aa,
  filter: la,
  data: ga,
  enter: ca,
  exit: ma,
  join: ya,
  merge: wa,
  selection: El,
  order: va,
  sort: _a,
  call: xa,
  nodes: Ea,
  node: Ca,
  size: Sa,
  empty: Pa,
  each: ka,
  attr: Ia,
  style: Fa,
  property: Ba,
  classed: Wa,
  text: Ka,
  html: el,
  raise: nl,
  lower: il,
  append: sl,
  insert: al,
  remove: cl,
  clone: fl,
  datum: hl,
  on: wl,
  dispatch: bl,
  [Symbol.iterator]: xl
};
function Ie(t) {
  return typeof t == "string" ? new Ae([[document.querySelector(t)]], [document.documentElement]) : new Ae([[t]], ks);
}
function Cl(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function qe(t, e) {
  if (t = Cl(t), e === void 0 && (e = t.currentTarget), e) {
    var n = e.ownerSVGElement || e;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = t.clientX, o.y = t.clientY, o = o.matrixTransform(e.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (e.getBoundingClientRect) {
      var i = e.getBoundingClientRect();
      return [t.clientX - i.left - e.clientLeft, t.clientY - i.top - e.clientTop];
    }
  }
  return [t.pageX, t.pageY];
}
const Sl = { passive: !1 }, Kt = { capture: !0, passive: !1 };
function no(t) {
  t.stopImmediatePropagation();
}
function St(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Ls(t) {
  var e = t.document.documentElement, n = Ie(t).on("dragstart.drag", St, Kt);
  "onselectstart" in e ? n.on("selectstart.drag", St, Kt) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function Ms(t, e) {
  var n = t.document.documentElement, o = Ie(t).on("dragstart.drag", null);
  e && (o.on("click.drag", St, Kt), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const hn = (t) => () => t;
function bo(t, {
  sourceEvent: e,
  subject: n,
  target: o,
  identifier: i,
  active: r,
  x: s,
  y: a,
  dx: l,
  dy: c,
  dispatch: d
}) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: r, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: a, enumerable: !0, configurable: !0 },
    dx: { value: l, enumerable: !0, configurable: !0 },
    dy: { value: c, enumerable: !0, configurable: !0 },
    _: { value: d }
  });
}
bo.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function Pl(t) {
  return !t.ctrlKey && !t.button;
}
function kl() {
  return this.parentNode;
}
function Ll(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function Ml() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Tl() {
  var t = Pl, e = kl, n = Ll, o = Ml, i = {}, r = Kn("start", "drag", "end"), s = 0, a, l, c, d, h = 0;
  function u(b) {
    b.on("mousedown.drag", f).filter(o).on("touchstart.drag", w).on("touchmove.drag", m, Sl).on("touchend.drag touchcancel.drag", C).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function f(b, D) {
    if (!(d || !t.call(this, b, D))) {
      var M = S(this, e.call(this, b, D), b, D, "mouse");
      M && (Ie(b.view).on("mousemove.drag", g, Kt).on("mouseup.drag", p, Kt), Ls(b.view), no(b), c = !1, a = b.clientX, l = b.clientY, M("start", b));
    }
  }
  function g(b) {
    if (St(b), !c) {
      var D = b.clientX - a, M = b.clientY - l;
      c = D * D + M * M > h;
    }
    i.mouse("drag", b);
  }
  function p(b) {
    Ie(b.view).on("mousemove.drag mouseup.drag", null), Ms(b.view, c), St(b), i.mouse("end", b);
  }
  function w(b, D) {
    if (t.call(this, b, D)) {
      var M = b.changedTouches, T = e.call(this, b, D), v = M.length, P, $;
      for (P = 0; P < v; ++P)
        ($ = S(this, T, b, D, M[P].identifier, M[P])) && (no(b), $("start", b, M[P]));
    }
  }
  function m(b) {
    var D = b.changedTouches, M = D.length, T, v;
    for (T = 0; T < M; ++T)
      (v = i[D[T].identifier]) && (St(b), v("drag", b, D[T]));
  }
  function C(b) {
    var D = b.changedTouches, M = D.length, T, v;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), T = 0; T < M; ++T)
      (v = i[D[T].identifier]) && (no(b), v("end", b, D[T]));
  }
  function S(b, D, M, T, v, P) {
    var $ = r.copy(), x = qe(P || M, D), y, q, _;
    if ((_ = n.call(b, new bo("beforestart", {
      sourceEvent: M,
      target: u,
      identifier: v,
      active: s,
      x: x[0],
      y: x[1],
      dx: 0,
      dy: 0,
      dispatch: $
    }), T)) != null)
      return y = _.x - x[0] || 0, q = _.y - x[1] || 0, function L(A, O, E) {
        var k = x, N;
        switch (A) {
          case "start":
            i[v] = L, N = s++;
            break;
          case "end":
            delete i[v], --s;
          // falls through
          case "drag":
            x = qe(E || O, D), N = s;
            break;
        }
        $.call(
          A,
          b,
          new bo(A, {
            sourceEvent: O,
            subject: _,
            target: u,
            identifier: v,
            active: N,
            x: x[0] + y,
            y: x[1] + q,
            dx: x[0] - k[0],
            dy: x[1] - k[1],
            dispatch: $
          }),
          T
        );
      };
  }
  return u.filter = function(b) {
    return arguments.length ? (t = typeof b == "function" ? b : hn(!!b), u) : t;
  }, u.container = function(b) {
    return arguments.length ? (e = typeof b == "function" ? b : hn(b), u) : e;
  }, u.subject = function(b) {
    return arguments.length ? (n = typeof b == "function" ? b : hn(b), u) : n;
  }, u.touchable = function(b) {
    return arguments.length ? (o = typeof b == "function" ? b : hn(!!b), u) : o;
  }, u.on = function() {
    var b = r.on.apply(r, arguments);
    return b === r ? u : b;
  }, u.clickDistance = function(b) {
    return arguments.length ? (h = (b = +b) * b, u) : Math.sqrt(h);
  }, u;
}
function Vo(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function Ts(t, e) {
  var n = Object.create(t.prototype);
  for (var o in e) n[o] = e[o];
  return n;
}
function cn() {
}
var Gt = 0.7, An = 1 / Gt, Pt = "\\s*([+-]?\\d+)\\s*", Jt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Oe = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Al = /^#([0-9a-f]{3,8})$/, Nl = new RegExp(`^rgb\\(${Pt},${Pt},${Pt}\\)$`), $l = new RegExp(`^rgb\\(${Oe},${Oe},${Oe}\\)$`), Il = new RegExp(`^rgba\\(${Pt},${Pt},${Pt},${Jt}\\)$`), Dl = new RegExp(`^rgba\\(${Oe},${Oe},${Oe},${Jt}\\)$`), Rl = new RegExp(`^hsl\\(${Jt},${Oe},${Oe}\\)$`), Hl = new RegExp(`^hsla\\(${Jt},${Oe},${Oe},${Jt}\\)$`), fi = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Vo(cn, Qt, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: hi,
  // Deprecated! Use color.formatHex.
  formatHex: hi,
  formatHex8: Fl,
  formatHsl: zl,
  formatRgb: gi,
  toString: gi
});
function hi() {
  return this.rgb().formatHex();
}
function Fl() {
  return this.rgb().formatHex8();
}
function zl() {
  return As(this).formatHsl();
}
function gi() {
  return this.rgb().formatRgb();
}
function Qt(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = Al.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? pi(e) : n === 3 ? new Pe(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? gn(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? gn(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = Nl.exec(t)) ? new Pe(e[1], e[2], e[3], 1) : (e = $l.exec(t)) ? new Pe(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = Il.exec(t)) ? gn(e[1], e[2], e[3], e[4]) : (e = Dl.exec(t)) ? gn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = Rl.exec(t)) ? wi(e[1], e[2] / 100, e[3] / 100, 1) : (e = Hl.exec(t)) ? wi(e[1], e[2] / 100, e[3] / 100, e[4]) : fi.hasOwnProperty(t) ? pi(fi[t]) : t === "transparent" ? new Pe(NaN, NaN, NaN, 0) : null;
}
function pi(t) {
  return new Pe(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function gn(t, e, n, o) {
  return o <= 0 && (t = e = n = NaN), new Pe(t, e, n, o);
}
function Ol(t) {
  return t instanceof cn || (t = Qt(t)), t ? (t = t.rgb(), new Pe(t.r, t.g, t.b, t.opacity)) : new Pe();
}
function xo(t, e, n, o) {
  return arguments.length === 1 ? Ol(t) : new Pe(t, e, n, o ?? 1);
}
function Pe(t, e, n, o) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +o;
}
Vo(Pe, xo, Ts(cn, {
  brighter(t) {
    return t = t == null ? An : Math.pow(An, t), new Pe(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? Gt : Math.pow(Gt, t), new Pe(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Pe(mt(this.r), mt(this.g), mt(this.b), Nn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: mi,
  // Deprecated! Use color.formatHex.
  formatHex: mi,
  formatHex8: Vl,
  formatRgb: yi,
  toString: yi
}));
function mi() {
  return `#${gt(this.r)}${gt(this.g)}${gt(this.b)}`;
}
function Vl() {
  return `#${gt(this.r)}${gt(this.g)}${gt(this.b)}${gt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function yi() {
  const t = Nn(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${mt(this.r)}, ${mt(this.g)}, ${mt(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function Nn(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function mt(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function gt(t) {
  return t = mt(t), (t < 16 ? "0" : "") + t.toString(16);
}
function wi(t, e, n, o) {
  return o <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new De(t, e, n, o);
}
function As(t) {
  if (t instanceof De) return new De(t.h, t.s, t.l, t.opacity);
  if (t instanceof cn || (t = Qt(t)), !t) return new De();
  if (t instanceof De) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, o = t.b / 255, i = Math.min(e, n, o), r = Math.max(e, n, o), s = NaN, a = r - i, l = (r + i) / 2;
  return a ? (e === r ? s = (n - o) / a + (n < o) * 6 : n === r ? s = (o - e) / a + 2 : s = (e - n) / a + 4, a /= l < 0.5 ? r + i : 2 - r - i, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new De(s, a, l, t.opacity);
}
function Bl(t, e, n, o) {
  return arguments.length === 1 ? As(t) : new De(t, e, n, o ?? 1);
}
function De(t, e, n, o) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +o;
}
Vo(De, Bl, Ts(cn, {
  brighter(t) {
    return t = t == null ? An : Math.pow(An, t), new De(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? Gt : Math.pow(Gt, t), new De(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - o;
    return new Pe(
      oo(t >= 240 ? t - 240 : t + 120, i, o),
      oo(t, i, o),
      oo(t < 120 ? t + 240 : t - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new De(vi(this.h), pn(this.s), pn(this.l), Nn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = Nn(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${vi(this.h)}, ${pn(this.s) * 100}%, ${pn(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function vi(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function pn(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function oo(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const Ns = (t) => () => t;
function Xl(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function Yl(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(o) {
    return Math.pow(t + o * e, n);
  };
}
function ql(t) {
  return (t = +t) == 1 ? $s : function(e, n) {
    return n - e ? Yl(e, n, t) : Ns(isNaN(e) ? n : e);
  };
}
function $s(t, e) {
  var n = e - t;
  return n ? Xl(t, n) : Ns(isNaN(t) ? e : t);
}
const Eo = (function t(e) {
  var n = ql(e);
  function o(i, r) {
    var s = n((i = xo(i)).r, (r = xo(r)).r), a = n(i.g, r.g), l = n(i.b, r.b), c = $s(i.opacity, r.opacity);
    return function(d) {
      return i.r = s(d), i.g = a(d), i.b = l(d), i.opacity = c(d), i + "";
    };
  }
  return o.gamma = t, o;
})(1);
function tt(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
var Co = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, io = new RegExp(Co.source, "g");
function Wl(t) {
  return function() {
    return t;
  };
}
function jl(t) {
  return function(e) {
    return t(e) + "";
  };
}
function Ul(t, e) {
  var n = Co.lastIndex = io.lastIndex = 0, o, i, r, s = -1, a = [], l = [];
  for (t = t + "", e = e + ""; (o = Co.exec(t)) && (i = io.exec(e)); )
    (r = i.index) > n && (r = e.slice(n, r), a[s] ? a[s] += r : a[++s] = r), (o = o[0]) === (i = i[0]) ? a[s] ? a[s] += i : a[++s] = i : (a[++s] = null, l.push({ i: s, x: tt(o, i) })), n = io.lastIndex;
  return n < e.length && (r = e.slice(n), a[s] ? a[s] += r : a[++s] = r), a.length < 2 ? l[0] ? jl(l[0].x) : Wl(e) : (e = l.length, function(c) {
    for (var d = 0, h; d < e; ++d) a[(h = l[d]).i] = h.x(c);
    return a.join("");
  });
}
var _i = 180 / Math.PI, So = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Is(t, e, n, o, i, r) {
  var s, a, l;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (l = t * n + e * o) && (n -= t * l, o -= e * l), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, l /= a), t * o < e * n && (t = -t, e = -e, l = -l, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(e, t) * _i,
    skewX: Math.atan(l) * _i,
    scaleX: s,
    scaleY: a
  };
}
var mn;
function Zl(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? So : Is(e.a, e.b, e.c, e.d, e.e, e.f);
}
function Kl(t) {
  return t == null || (mn || (mn = document.createElementNS("http://www.w3.org/2000/svg", "g")), mn.setAttribute("transform", t), !(t = mn.transform.baseVal.consolidate())) ? So : (t = t.matrix, Is(t.a, t.b, t.c, t.d, t.e, t.f));
}
function Ds(t, e, n, o) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function r(c, d, h, u, f, g) {
    if (c !== h || d !== u) {
      var p = f.push("translate(", null, e, null, n);
      g.push({ i: p - 4, x: tt(c, h) }, { i: p - 2, x: tt(d, u) });
    } else (h || u) && f.push("translate(" + h + e + u + n);
  }
  function s(c, d, h, u) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), u.push({ i: h.push(i(h) + "rotate(", null, o) - 2, x: tt(c, d) })) : d && h.push(i(h) + "rotate(" + d + o);
  }
  function a(c, d, h, u) {
    c !== d ? u.push({ i: h.push(i(h) + "skewX(", null, o) - 2, x: tt(c, d) }) : d && h.push(i(h) + "skewX(" + d + o);
  }
  function l(c, d, h, u, f, g) {
    if (c !== h || d !== u) {
      var p = f.push(i(f) + "scale(", null, ",", null, ")");
      g.push({ i: p - 4, x: tt(c, h) }, { i: p - 2, x: tt(d, u) });
    } else (h !== 1 || u !== 1) && f.push(i(f) + "scale(" + h + "," + u + ")");
  }
  return function(c, d) {
    var h = [], u = [];
    return c = t(c), d = t(d), r(c.translateX, c.translateY, d.translateX, d.translateY, h, u), s(c.rotate, d.rotate, h, u), a(c.skewX, d.skewX, h, u), l(c.scaleX, c.scaleY, d.scaleX, d.scaleY, h, u), c = d = null, function(f) {
      for (var g = -1, p = u.length, w; ++g < p; ) h[(w = u[g]).i] = w.x(f);
      return h.join("");
    };
  };
}
var Gl = Ds(Zl, "px, ", "px)", "deg)"), Jl = Ds(Kl, ", ", ")", ")"), Ql = 1e-12;
function bi(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function ec(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function tc(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const nc = (function t(e, n, o) {
  function i(r, s) {
    var a = r[0], l = r[1], c = r[2], d = s[0], h = s[1], u = s[2], f = d - a, g = h - l, p = f * f + g * g, w, m;
    if (p < Ql)
      m = Math.log(u / c) / e, w = function(T) {
        return [
          a + T * f,
          l + T * g,
          c * Math.exp(e * T * m)
        ];
      };
    else {
      var C = Math.sqrt(p), S = (u * u - c * c + o * p) / (2 * c * n * C), b = (u * u - c * c - o * p) / (2 * u * n * C), D = Math.log(Math.sqrt(S * S + 1) - S), M = Math.log(Math.sqrt(b * b + 1) - b);
      m = (M - D) / e, w = function(T) {
        var v = T * m, P = bi(D), $ = c / (n * C) * (P * tc(e * v + D) - ec(D));
        return [
          a + $ * f,
          l + $ * g,
          c * P / bi(e * v + D)
        ];
      };
    }
    return w.duration = m * 1e3 * e / Math.SQRT2, w;
  }
  return i.rho = function(r) {
    var s = Math.max(1e-3, +r), a = s * s, l = a * a;
    return t(s, a, l);
  }, i;
})(Math.SQRT2, 2, 4);
var Tt = 0, qt = 0, Ft = 0, Rs = 1e3, $n, Wt, In = 0, wt = 0, Jn = 0, en = typeof performance == "object" && performance.now ? performance : Date, Hs = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function Bo() {
  return wt || (Hs(oc), wt = en.now() + Jn);
}
function oc() {
  wt = 0;
}
function Dn() {
  this._call = this._time = this._next = null;
}
Dn.prototype = Fs.prototype = {
  constructor: Dn,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Bo() : +n) + (e == null ? 0 : +e), !this._next && Wt !== this && (Wt ? Wt._next = this : $n = this, Wt = this), this._call = t, this._time = n, Po();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Po());
  }
};
function Fs(t, e, n) {
  var o = new Dn();
  return o.restart(t, e, n), o;
}
function ic() {
  Bo(), ++Tt;
  for (var t = $n, e; t; )
    (e = wt - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --Tt;
}
function xi() {
  wt = (In = en.now()) + Jn, Tt = qt = 0;
  try {
    ic();
  } finally {
    Tt = 0, rc(), wt = 0;
  }
}
function sc() {
  var t = en.now(), e = t - In;
  e > Rs && (Jn -= e, In = t);
}
function rc() {
  for (var t, e = $n, n, o = 1 / 0; e; )
    e._call ? (o > e._time && (o = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : $n = n);
  Wt = t, Po(o);
}
function Po(t) {
  if (!Tt) {
    qt && (qt = clearTimeout(qt));
    var e = t - wt;
    e > 24 ? (t < 1 / 0 && (qt = setTimeout(xi, t - en.now() - Jn)), Ft && (Ft = clearInterval(Ft))) : (Ft || (In = en.now(), Ft = setInterval(sc, Rs)), Tt = 1, Hs(xi));
  }
}
function Ei(t, e, n) {
  var o = new Dn();
  return e = e == null ? 0 : +e, o.restart((i) => {
    o.stop(), t(i + e);
  }, e, n), o;
}
var ac = Kn("start", "end", "cancel", "interrupt"), lc = [], zs = 0, Ci = 1, ko = 2, Sn = 3, Si = 4, Lo = 5, Pn = 6;
function Qn(t, e, n, o, i, r) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  cc(t, n, {
    name: e,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: ac,
    tween: lc,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: zs
  });
}
function Xo(t, e) {
  var n = Re(t, e);
  if (n.state > zs) throw new Error("too late; already scheduled");
  return n;
}
function Ve(t, e) {
  var n = Re(t, e);
  if (n.state > Sn) throw new Error("too late; already running");
  return n;
}
function Re(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function cc(t, e, n) {
  var o = t.__transition, i;
  o[e] = n, n.timer = Fs(r, 0, n.time);
  function r(c) {
    n.state = Ci, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, h, u, f;
    if (n.state !== Ci) return l();
    for (d in o)
      if (f = o[d], f.name === n.name) {
        if (f.state === Sn) return Ei(s);
        f.state === Si ? (f.state = Pn, f.timer.stop(), f.on.call("interrupt", t, t.__data__, f.index, f.group), delete o[d]) : +d < e && (f.state = Pn, f.timer.stop(), f.on.call("cancel", t, t.__data__, f.index, f.group), delete o[d]);
      }
    if (Ei(function() {
      n.state === Sn && (n.state = Si, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = ko, n.on.call("start", t, t.__data__, n.index, n.group), n.state === ko) {
      for (n.state = Sn, i = new Array(u = n.tween.length), d = 0, h = -1; d < u; ++d)
        (f = n.tween[d].value.call(t, t.__data__, n.index, n.group)) && (i[++h] = f);
      i.length = h + 1;
    }
  }
  function a(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = Lo, 1), h = -1, u = i.length; ++h < u; )
      i[h].call(t, d);
    n.state === Lo && (n.on.call("end", t, t.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = Pn, n.timer.stop(), delete o[e];
    for (var c in o) return;
    delete t.__transition;
  }
}
function kn(t, e) {
  var n = t.__transition, o, i, r = !0, s;
  if (n) {
    e = e == null ? null : e + "";
    for (s in n) {
      if ((o = n[s]).name !== e) {
        r = !1;
        continue;
      }
      i = o.state > ko && o.state < Lo, o.state = Pn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", t, t.__data__, o.index, o.group), delete n[s];
    }
    r && delete t.__transition;
  }
}
function dc(t) {
  return this.each(function() {
    kn(this, t);
  });
}
function uc(t, e) {
  var n, o;
  return function() {
    var i = Ve(this, t), r = i.tween;
    if (r !== n) {
      o = n = r;
      for (var s = 0, a = o.length; s < a; ++s)
        if (o[s].name === e) {
          o = o.slice(), o.splice(s, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function fc(t, e, n) {
  var o, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var r = Ve(this, t), s = r.tween;
    if (s !== o) {
      i = (o = s).slice();
      for (var a = { name: e, value: n }, l = 0, c = i.length; l < c; ++l)
        if (i[l].name === e) {
          i[l] = a;
          break;
        }
      l === c && i.push(a);
    }
    r.tween = i;
  };
}
function hc(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var o = Re(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? uc : fc)(n, t, e));
}
function Yo(t, e, n) {
  var o = t._id;
  return t.each(function() {
    var i = Ve(this, o);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return Re(i, o).value[e];
  };
}
function Os(t, e) {
  var n;
  return (typeof e == "number" ? tt : e instanceof Qt ? Eo : (n = Qt(e)) ? (e = n, Eo) : Ul)(t, e);
}
function gc(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function pc(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function mc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function yc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function wc(t, e, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a)));
  };
}
function vc(t, e, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a)));
  };
}
function _c(t, e) {
  var n = Gn(t), o = n === "transform" ? Jl : Os;
  return this.attrTween(t, typeof e == "function" ? (n.local ? vc : wc)(n, o, Yo(this, "attr." + t, e)) : e == null ? (n.local ? pc : gc)(n) : (n.local ? yc : mc)(n, o, e));
}
function bc(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function xc(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function Ec(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && xc(t, r)), n;
  }
  return i._value = e, i;
}
function Cc(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && bc(t, r)), n;
  }
  return i._value = e, i;
}
function Sc(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var o = Gn(t);
  return this.tween(n, (o.local ? Ec : Cc)(o, e));
}
function Pc(t, e) {
  return function() {
    Xo(this, t).delay = +e.apply(this, arguments);
  };
}
function kc(t, e) {
  return e = +e, function() {
    Xo(this, t).delay = e;
  };
}
function Lc(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? Pc : kc)(e, t)) : Re(this.node(), e).delay;
}
function Mc(t, e) {
  return function() {
    Ve(this, t).duration = +e.apply(this, arguments);
  };
}
function Tc(t, e) {
  return e = +e, function() {
    Ve(this, t).duration = e;
  };
}
function Ac(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? Mc : Tc)(e, t)) : Re(this.node(), e).duration;
}
function Nc(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    Ve(this, t).ease = e;
  };
}
function $c(t) {
  var e = this._id;
  return arguments.length ? this.each(Nc(e, t)) : Re(this.node(), e).ease;
}
function Ic(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ve(this, t).ease = n;
  };
}
function Dc(t) {
  if (typeof t != "function") throw new Error();
  return this.each(Ic(this._id, t));
}
function Rc(t) {
  typeof t != "function" && (t = ws(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = [], l, c = 0; c < s; ++c)
      (l = r[c]) && t.call(l, l.__data__, c, r) && a.push(l);
  return new Ke(o, this._parents, this._name, this._id);
}
function Hc(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, o = e.length, i = n.length, r = Math.min(o, i), s = new Array(o), a = 0; a < r; ++a)
    for (var l = e[a], c = n[a], d = l.length, h = s[a] = new Array(d), u, f = 0; f < d; ++f)
      (u = l[f] || c[f]) && (h[f] = u);
  for (; a < o; ++a)
    s[a] = e[a];
  return new Ke(s, this._parents, this._name, this._id);
}
function Fc(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function zc(t, e, n) {
  var o, i, r = Fc(e) ? Xo : Ve;
  return function() {
    var s = r(this, t), a = s.on;
    a !== o && (i = (o = a).copy()).on(e, n), s.on = i;
  };
}
function Oc(t, e) {
  var n = this._id;
  return arguments.length < 2 ? Re(this.node(), n).on.on(t) : this.each(zc(n, t, e));
}
function Vc(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function Bc() {
  return this.on("end.remove", Vc(this._id));
}
function Xc(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = zo(t));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var a = o[s], l = a.length, c = r[s] = new Array(l), d, h, u = 0; u < l; ++u)
      (d = a[u]) && (h = t.call(d, d.__data__, u, a)) && ("__data__" in d && (h.__data__ = d.__data__), c[u] = h, Qn(c[u], e, n, u, c, Re(d, n)));
  return new Ke(r, this._parents, e, n);
}
function Yc(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = ys(t));
  for (var o = this._groups, i = o.length, r = [], s = [], a = 0; a < i; ++a)
    for (var l = o[a], c = l.length, d, h = 0; h < c; ++h)
      if (d = l[h]) {
        for (var u = t.call(d, d.__data__, h, l), f, g = Re(d, n), p = 0, w = u.length; p < w; ++p)
          (f = u[p]) && Qn(f, e, n, p, u, g);
        r.push(u), s.push(d);
      }
  return new Ke(r, s, e, n);
}
var qc = ln.prototype.constructor;
function Wc() {
  return new qc(this._groups, this._parents);
}
function jc(t, e) {
  var n, o, i;
  return function() {
    var r = Mt(this, t), s = (this.style.removeProperty(t), Mt(this, t));
    return r === s ? null : r === n && s === o ? i : i = e(n = r, o = s);
  };
}
function Vs(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Uc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = Mt(this, t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Zc(t, e, n) {
  var o, i, r;
  return function() {
    var s = Mt(this, t), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(t), Mt(this, t))), s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a));
  };
}
function Kc(t, e) {
  var n, o, i, r = "style." + e, s = "end." + r, a;
  return function() {
    var l = Ve(this, t), c = l.on, d = l.value[r] == null ? a || (a = Vs(e)) : void 0;
    (c !== n || i !== d) && (o = (n = c).copy()).on(s, i = d), l.on = o;
  };
}
function Gc(t, e, n) {
  var o = (t += "") == "transform" ? Gl : Os;
  return e == null ? this.styleTween(t, jc(t, o)).on("end.style." + t, Vs(t)) : typeof e == "function" ? this.styleTween(t, Zc(t, o, Yo(this, "style." + t, e))).each(Kc(this._id, t)) : this.styleTween(t, Uc(t, o, e), n).on("end.style." + t, null);
}
function Jc(t, e, n) {
  return function(o) {
    this.style.setProperty(t, e.call(this, o), n);
  };
}
function Qc(t, e, n) {
  var o, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (o = (i = s) && Jc(t, s, n)), o;
  }
  return r._value = e, r;
}
function ed(t, e, n) {
  var o = "style." + (t += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, Qc(t, e, n ?? ""));
}
function td(t) {
  return function() {
    this.textContent = t;
  };
}
function nd(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function od(t) {
  return this.tween("text", typeof t == "function" ? nd(Yo(this, "text", t)) : td(t == null ? "" : t + ""));
}
function id(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function sd(t) {
  var e, n;
  function o() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && id(i)), e;
  }
  return o._value = t, o;
}
function rd(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, sd(t));
}
function ad() {
  for (var t = this._name, e = this._id, n = Bs(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var d = Re(l, e);
        Qn(l, t, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new Ke(o, this._parents, t, n);
}
function ld() {
  var t, e, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var a = { value: s }, l = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var c = Ve(this, o), d = c.on;
      d !== t && (e = (t = d).copy(), e._.cancel.push(a), e._.interrupt.push(a), e._.end.push(l)), c.on = e;
    }), i === 0 && r();
  });
}
var cd = 0;
function Ke(t, e, n, o) {
  this._groups = t, this._parents = e, this._name = n, this._id = o;
}
function Bs() {
  return ++cd;
}
var Xe = ln.prototype;
Ke.prototype = {
  constructor: Ke,
  select: Xc,
  selectAll: Yc,
  selectChild: Xe.selectChild,
  selectChildren: Xe.selectChildren,
  filter: Rc,
  merge: Hc,
  selection: Wc,
  transition: ad,
  call: Xe.call,
  nodes: Xe.nodes,
  node: Xe.node,
  size: Xe.size,
  empty: Xe.empty,
  each: Xe.each,
  on: Oc,
  attr: _c,
  attrTween: Sc,
  style: Gc,
  styleTween: ed,
  text: od,
  textTween: rd,
  remove: Bc,
  tween: hc,
  delay: Lc,
  duration: Ac,
  ease: $c,
  easeVarying: Dc,
  end: ld,
  [Symbol.iterator]: Xe[Symbol.iterator]
};
const dd = (t) => +t;
function ud(t) {
  return t * t;
}
function fd(t) {
  return t * (2 - t);
}
function hd(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
function gd(t) {
  return t * t * t;
}
function pd(t) {
  return --t * t * t + 1;
}
function Xs(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var Ys = Math.PI, qs = Ys / 2;
function md(t) {
  return +t == 1 ? 1 : 1 - Math.cos(t * qs);
}
function yd(t) {
  return Math.sin(t * qs);
}
function wd(t) {
  return (1 - Math.cos(Ys * t)) / 2;
}
function ct(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
function vd(t) {
  return ct(1 - +t);
}
function _d(t) {
  return 1 - ct(t);
}
function bd(t) {
  return ((t *= 2) <= 1 ? ct(1 - t) : 2 - ct(t - 1)) / 2;
}
function xd(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function Ed(t) {
  return Math.sqrt(1 - --t * t);
}
function Cd(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
var Mo = 4 / 11, Sd = 6 / 11, Pd = 8 / 11, kd = 3 / 4, Ld = 9 / 11, Md = 10 / 11, Td = 15 / 16, Ad = 21 / 22, Nd = 63 / 64, yn = 1 / Mo / Mo;
function $d(t) {
  return 1 - Rn(1 - t);
}
function Rn(t) {
  return (t = +t) < Mo ? yn * t * t : t < Pd ? yn * (t -= Sd) * t + kd : t < Md ? yn * (t -= Ld) * t + Td : yn * (t -= Ad) * t + Nd;
}
function Id(t) {
  return ((t *= 2) <= 1 ? 1 - Rn(1 - t) : Rn(t - 1) + 1) / 2;
}
var qo = 1.70158, Dd = (function t(e) {
  e = +e;
  function n(o) {
    return (o = +o) * o * (e * (o - 1) + o);
  }
  return n.overshoot = t, n;
})(qo), Rd = (function t(e) {
  e = +e;
  function n(o) {
    return --o * o * ((o + 1) * e + o) + 1;
  }
  return n.overshoot = t, n;
})(qo), Hd = (function t(e) {
  e = +e;
  function n(o) {
    return ((o *= 2) < 1 ? o * o * ((e + 1) * o - e) : (o -= 2) * o * ((e + 1) * o + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(qo), At = 2 * Math.PI, Wo = 1, jo = 0.3, Fd = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= At);
  function i(r) {
    return e * ct(- --r) * Math.sin((o - r) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * At);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(Wo, jo), zd = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= At);
  function i(r) {
    return 1 - e * ct(r = +r) * Math.sin((r + o) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * At);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(Wo, jo), Od = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= At);
  function i(r) {
    return ((r = r * 2 - 1) < 0 ? e * ct(-r) * Math.sin((o - r) / n) : 2 - e * ct(r) * Math.sin((o + r) / n)) / 2;
  }
  return i.amplitude = function(r) {
    return t(r, n * At);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(Wo, jo), Vd = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Xs
};
function Bd(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function Xd(t) {
  var e, n;
  t instanceof Ke ? (e = t._id, t = t._name) : (e = Bs(), (n = Vd).time = Bo(), t = t == null ? null : t + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && Qn(l, t, e, c, s, n || Bd(l, e));
  return new Ke(o, this._parents, t, e);
}
ln.prototype.interrupt = dc;
ln.prototype.transition = Xd;
const wn = (t) => () => t;
function Yd(t, {
  sourceEvent: e,
  target: n,
  transform: o,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function je(t, e, n) {
  this.k = t, this.x = e, this.y = n;
}
je.prototype = {
  constructor: je,
  scale: function(t) {
    return t === 1 ? this : new je(this.k * t, this.x, this.y);
  },
  translate: function(t, e) {
    return t === 0 & e === 0 ? this : new je(this.k, this.x + this.k * t, this.y + this.k * e);
  },
  apply: function(t) {
    return [t[0] * this.k + this.x, t[1] * this.k + this.y];
  },
  applyX: function(t) {
    return t * this.k + this.x;
  },
  applyY: function(t) {
    return t * this.k + this.y;
  },
  invert: function(t) {
    return [(t[0] - this.x) / this.k, (t[1] - this.y) / this.k];
  },
  invertX: function(t) {
    return (t - this.x) / this.k;
  },
  invertY: function(t) {
    return (t - this.y) / this.k;
  },
  rescaleX: function(t) {
    return t.copy().domain(t.range().map(this.invertX, this).map(t.invert, t));
  },
  rescaleY: function(t) {
    return t.copy().domain(t.range().map(this.invertY, this).map(t.invert, t));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var Hn = new je(1, 0, 0);
je.prototype;
function so(t) {
  t.stopImmediatePropagation();
}
function zt(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function qd(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function Wd() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function Pi() {
  return this.__zoom || Hn;
}
function jd(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function Ud() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Zd(t, e, n) {
  var o = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], r = t.invertY(e[0][1]) - n[0][1], s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function Kd() {
  var t = qd, e = Wd, n = Zd, o = jd, i = Ud, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = nc, c = Kn("start", "zoom", "end"), d, h, u, f = 500, g = 150, p = 0, w = 10;
  function m(_) {
    _.property("__zoom", Pi).on("wheel.zoom", v, { passive: !1 }).on("mousedown.zoom", P).on("dblclick.zoom", $).filter(i).on("touchstart.zoom", x).on("touchmove.zoom", y).on("touchend.zoom touchcancel.zoom", q).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(_, L, A, O) {
    var E = _.selection ? _.selection() : _;
    E.property("__zoom", Pi), _ !== E ? D(_, L, A, O) : E.interrupt().each(function() {
      M(this, arguments).event(O).start().zoom(null, typeof L == "function" ? L.apply(this, arguments) : L).end();
    });
  }, m.scaleBy = function(_, L, A, O) {
    m.scaleTo(_, function() {
      var E = this.__zoom.k, k = typeof L == "function" ? L.apply(this, arguments) : L;
      return E * k;
    }, A, O);
  }, m.scaleTo = function(_, L, A, O) {
    m.transform(_, function() {
      var E = e.apply(this, arguments), k = this.__zoom, N = A == null ? b(E) : typeof A == "function" ? A.apply(this, arguments) : A, U = k.invert(N), J = typeof L == "function" ? L.apply(this, arguments) : L;
      return n(S(C(k, J), N, U), E, s);
    }, A, O);
  }, m.translateBy = function(_, L, A, O) {
    m.transform(_, function() {
      return n(this.__zoom.translate(
        typeof L == "function" ? L.apply(this, arguments) : L,
        typeof A == "function" ? A.apply(this, arguments) : A
      ), e.apply(this, arguments), s);
    }, null, O);
  }, m.translateTo = function(_, L, A, O, E) {
    m.transform(_, function() {
      var k = e.apply(this, arguments), N = this.__zoom, U = O == null ? b(k) : typeof O == "function" ? O.apply(this, arguments) : O;
      return n(Hn.translate(U[0], U[1]).scale(N.k).translate(
        typeof L == "function" ? -L.apply(this, arguments) : -L,
        typeof A == "function" ? -A.apply(this, arguments) : -A
      ), k, s);
    }, O, E);
  };
  function C(_, L) {
    return L = Math.max(r[0], Math.min(r[1], L)), L === _.k ? _ : new je(L, _.x, _.y);
  }
  function S(_, L, A) {
    var O = L[0] - A[0] * _.k, E = L[1] - A[1] * _.k;
    return O === _.x && E === _.y ? _ : new je(_.k, O, E);
  }
  function b(_) {
    return [(+_[0][0] + +_[1][0]) / 2, (+_[0][1] + +_[1][1]) / 2];
  }
  function D(_, L, A, O) {
    _.on("start.zoom", function() {
      M(this, arguments).event(O).start();
    }).on("interrupt.zoom end.zoom", function() {
      M(this, arguments).event(O).end();
    }).tween("zoom", function() {
      var E = this, k = arguments, N = M(E, k).event(O), U = e.apply(E, k), J = A == null ? b(U) : typeof A == "function" ? A.apply(E, k) : A, oe = Math.max(U[1][0] - U[0][0], U[1][1] - U[0][1]), G = E.__zoom, se = typeof L == "function" ? L.apply(E, k) : L, le = l(G.invert(J).concat(oe / G.k), se.invert(J).concat(oe / se.k));
      return function(ce) {
        if (ce === 1) ce = se;
        else {
          var te = le(ce), R = oe / te[2];
          ce = new je(R, J[0] - te[0] * R, J[1] - te[1] * R);
        }
        N.zoom(null, ce);
      };
    });
  }
  function M(_, L, A) {
    return !A && _.__zooming || new T(_, L);
  }
  function T(_, L) {
    this.that = _, this.args = L, this.active = 0, this.sourceEvent = null, this.extent = e.apply(_, L), this.taps = 0;
  }
  T.prototype = {
    event: function(_) {
      return _ && (this.sourceEvent = _), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(_, L) {
      return this.mouse && _ !== "mouse" && (this.mouse[1] = L.invert(this.mouse[0])), this.touch0 && _ !== "touch" && (this.touch0[1] = L.invert(this.touch0[0])), this.touch1 && _ !== "touch" && (this.touch1[1] = L.invert(this.touch1[0])), this.that.__zoom = L, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(_) {
      var L = Ie(this.that).datum();
      c.call(
        _,
        this.that,
        new Yd(_, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        L
      );
    }
  };
  function v(_, ...L) {
    if (!t.apply(this, arguments)) return;
    var A = M(this, L).event(_), O = this.__zoom, E = Math.max(r[0], Math.min(r[1], O.k * Math.pow(2, o.apply(this, arguments)))), k = qe(_);
    if (A.wheel)
      (A.mouse[0][0] !== k[0] || A.mouse[0][1] !== k[1]) && (A.mouse[1] = O.invert(A.mouse[0] = k)), clearTimeout(A.wheel);
    else {
      if (O.k === E) return;
      A.mouse = [k, O.invert(k)], kn(this), A.start();
    }
    zt(_), A.wheel = setTimeout(N, g), A.zoom("mouse", n(S(C(O, E), A.mouse[0], A.mouse[1]), A.extent, s));
    function N() {
      A.wheel = null, A.end();
    }
  }
  function P(_, ...L) {
    if (u || !t.apply(this, arguments)) return;
    var A = _.currentTarget, O = M(this, L, !0).event(_), E = Ie(_.view).on("mousemove.zoom", J, !0).on("mouseup.zoom", oe, !0), k = qe(_, A), N = _.clientX, U = _.clientY;
    Ls(_.view), so(_), O.mouse = [k, this.__zoom.invert(k)], kn(this), O.start();
    function J(G) {
      if (zt(G), !O.moved) {
        var se = G.clientX - N, le = G.clientY - U;
        O.moved = se * se + le * le > p;
      }
      O.event(G).zoom("mouse", n(S(O.that.__zoom, O.mouse[0] = qe(G, A), O.mouse[1]), O.extent, s));
    }
    function oe(G) {
      E.on("mousemove.zoom mouseup.zoom", null), Ms(G.view, O.moved), zt(G), O.event(G).end();
    }
  }
  function $(_, ...L) {
    if (t.apply(this, arguments)) {
      var A = this.__zoom, O = qe(_.changedTouches ? _.changedTouches[0] : _, this), E = A.invert(O), k = A.k * (_.shiftKey ? 0.5 : 2), N = n(S(C(A, k), O, E), e.apply(this, L), s);
      zt(_), a > 0 ? Ie(this).transition().duration(a).call(D, N, O, _) : Ie(this).call(m.transform, N, O, _);
    }
  }
  function x(_, ...L) {
    if (t.apply(this, arguments)) {
      var A = _.touches, O = A.length, E = M(this, L, _.changedTouches.length === O).event(_), k, N, U, J;
      for (so(_), N = 0; N < O; ++N)
        U = A[N], J = qe(U, this), J = [J, this.__zoom.invert(J), U.identifier], E.touch0 ? !E.touch1 && E.touch0[2] !== J[2] && (E.touch1 = J, E.taps = 0) : (E.touch0 = J, k = !0, E.taps = 1 + !!d);
      d && (d = clearTimeout(d)), k && (E.taps < 2 && (h = J[0], d = setTimeout(function() {
        d = null;
      }, f)), kn(this), E.start());
    }
  }
  function y(_, ...L) {
    if (this.__zooming) {
      var A = M(this, L).event(_), O = _.changedTouches, E = O.length, k, N, U, J;
      for (zt(_), k = 0; k < E; ++k)
        N = O[k], U = qe(N, this), A.touch0 && A.touch0[2] === N.identifier ? A.touch0[0] = U : A.touch1 && A.touch1[2] === N.identifier && (A.touch1[0] = U);
      if (N = A.that.__zoom, A.touch1) {
        var oe = A.touch0[0], G = A.touch0[1], se = A.touch1[0], le = A.touch1[1], ce = (ce = se[0] - oe[0]) * ce + (ce = se[1] - oe[1]) * ce, te = (te = le[0] - G[0]) * te + (te = le[1] - G[1]) * te;
        N = C(N, Math.sqrt(ce / te)), U = [(oe[0] + se[0]) / 2, (oe[1] + se[1]) / 2], J = [(G[0] + le[0]) / 2, (G[1] + le[1]) / 2];
      } else if (A.touch0) U = A.touch0[0], J = A.touch0[1];
      else return;
      A.zoom("touch", n(S(N, U, J), A.extent, s));
    }
  }
  function q(_, ...L) {
    if (this.__zooming) {
      var A = M(this, L).event(_), O = _.changedTouches, E = O.length, k, N;
      for (so(_), u && clearTimeout(u), u = setTimeout(function() {
        u = null;
      }, f), k = 0; k < E; ++k)
        N = O[k], A.touch0 && A.touch0[2] === N.identifier ? delete A.touch0 : A.touch1 && A.touch1[2] === N.identifier && delete A.touch1;
      if (A.touch1 && !A.touch0 && (A.touch0 = A.touch1, delete A.touch1), A.touch0) A.touch0[1] = this.__zoom.invert(A.touch0[0]);
      else if (A.end(), A.taps === 2 && (N = qe(N, this), Math.hypot(h[0] - N[0], h[1] - N[1]) < w)) {
        var U = Ie(this).on("dblclick.zoom");
        U && U.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(_) {
    return arguments.length ? (o = typeof _ == "function" ? _ : wn(+_), m) : o;
  }, m.filter = function(_) {
    return arguments.length ? (t = typeof _ == "function" ? _ : wn(!!_), m) : t;
  }, m.touchable = function(_) {
    return arguments.length ? (i = typeof _ == "function" ? _ : wn(!!_), m) : i;
  }, m.extent = function(_) {
    return arguments.length ? (e = typeof _ == "function" ? _ : wn([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), m) : e;
  }, m.scaleExtent = function(_) {
    return arguments.length ? (r[0] = +_[0], r[1] = +_[1], m) : [r[0], r[1]];
  }, m.translateExtent = function(_) {
    return arguments.length ? (s[0][0] = +_[0][0], s[1][0] = +_[1][0], s[0][1] = +_[0][1], s[1][1] = +_[1][1], m) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, m.constrain = function(_) {
    return arguments.length ? (n = _, m) : n;
  }, m.duration = function(_) {
    return arguments.length ? (a = +_, m) : a;
  }, m.interpolate = function(_) {
    return arguments.length ? (l = _, m) : l;
  }, m.on = function() {
    var _ = c.on.apply(c, arguments);
    return _ === c ? m : _;
  }, m.clickDistance = function(_) {
    return arguments.length ? (p = (_ = +_) * _, m) : Math.sqrt(p);
  }, m.tapDistance = function(_) {
    return arguments.length ? (w = +_, m) : w;
  }, m;
}
function ki(t) {
  const { pannable: e, zoomable: n, isLocked: o, noPanClassName: i, noWheelClassName: r, isTouchSelectionMode: s, isPanKeyHeld: a, panOnDrag: l } = t;
  return (c) => {
    if (o?.() || i && c.target?.closest?.("." + i) || c.type === "wheel" && r && c.target?.closest?.("." + r) || !n && c.type === "wheel") return !1;
    if (c.type === "touchstart") {
      const d = !c.touches || c.touches.length < 2;
      if (s?.() && d || !e && !a?.() && d || !n && !d) return !1;
    }
    if (c.type === "mousedown") {
      if (a?.()) return !0;
      if (!e) return !1;
      if (Array.isArray(l))
        return l.includes(c.button);
      if (l === !1) return !1;
    }
    return !0;
  };
}
function Gd(t, e) {
  const {
    onTransformChange: n,
    minZoom: o = 0.5,
    maxZoom: i = 2,
    pannable: r = !0,
    zoomable: s = !0
  } = e, a = Ie(t);
  let l = !1;
  const c = e.panActivationKeyCode !== void 0 ? e.panActivationKeyCode : "Space", d = (T) => {
    c && T.code === c && (l = !0, t.style.cursor = "grab");
  }, h = (T) => {
    c && T.code === c && (l = !1, t.style.cursor = "");
  }, u = () => {
    l = !1, t.style.cursor = "";
  };
  c && (window.addEventListener("keydown", d), window.addEventListener("keyup", h), window.addEventListener("blur", u));
  const f = Kd().scaleExtent([o, i]).on("start", (T) => {
    if (!T.sourceEvent) return;
    l && (t.style.cursor = "grabbing");
    const { x: v, y: P, k: $ } = T.transform;
    e.onMoveStart?.({ x: v, y: P, zoom: $ });
  }).on("zoom", (T) => {
    const { x: v, y: P, k: $ } = T.transform;
    n({ x: v, y: P, zoom: $ }), T.sourceEvent && e.onMove?.({ x: v, y: P, zoom: $ });
  }).on("end", (T) => {
    if (!T.sourceEvent) return;
    l && (t.style.cursor = "grab");
    const { x: v, y: P, k: $ } = T.transform;
    e.onMoveEnd?.({ x: v, y: P, zoom: $ });
  });
  e.translateExtent && f.translateExtent(e.translateExtent), f.filter(ki({
    pannable: r,
    zoomable: s,
    isLocked: e.isLocked,
    noPanClassName: e.noPanClassName,
    noWheelClassName: e.noWheelClassName,
    isTouchSelectionMode: e.isTouchSelectionMode,
    isPanKeyHeld: () => l,
    panOnDrag: e.panOnDrag
  })), a.call(f), e.zoomOnDoubleClick === !1 && a.on("dblclick.zoom", null);
  let g = e.panOnScroll ?? !1, p = e.panOnScrollDirection ?? "both", w = e.panOnScrollSpeed ?? 1, m = !1;
  const C = e.zoomActivationKeyCode !== void 0 ? e.zoomActivationKeyCode : null, S = (T) => {
    C && T.code === C && (m = !0);
  }, b = (T) => {
    C && T.code === C && (m = !1);
  }, D = () => {
    m = !1;
  };
  C && (window.addEventListener("keydown", S), window.addEventListener("keyup", b), window.addEventListener("blur", D));
  const M = (T) => {
    if (e.isLocked?.()) return;
    const v = T.ctrlKey || T.metaKey || m;
    if (!(g ? !v : T.shiftKey)) return;
    T.preventDefault(), T.stopPropagation();
    const $ = w;
    let x = 0, y = 0;
    p !== "horizontal" && (y = -T.deltaY * $), p !== "vertical" && (x = -T.deltaX * $, T.shiftKey && T.deltaX === 0 && p === "both" && (x = -T.deltaY * $, y = 0)), e.onScrollPan?.(x, y);
  };
  return t.addEventListener("wheel", M, { passive: !1, capture: !0 }), {
    setViewport(T, v) {
      const P = v?.duration ?? 0, $ = Hn.translate(T.x ?? 0, T.y ?? 0).scale(T.zoom ?? 1);
      P > 0 ? a.transition().duration(P).call(f.transform, $) : a.call(f.transform, $);
    },
    getTransform() {
      return t.__zoom ?? Hn;
    },
    update(T) {
      if ((T.minZoom !== void 0 || T.maxZoom !== void 0) && f.scaleExtent([
        T.minZoom ?? o,
        T.maxZoom ?? i
      ]), T.pannable !== void 0 || T.zoomable !== void 0) {
        const v = T.pannable ?? r, P = T.zoomable ?? s;
        f.filter(ki({
          pannable: v,
          zoomable: P,
          isLocked: e.isLocked,
          noPanClassName: e.noPanClassName,
          noWheelClassName: e.noWheelClassName,
          isTouchSelectionMode: e.isTouchSelectionMode,
          isPanKeyHeld: () => l,
          panOnDrag: e.panOnDrag
        }));
      }
      T.panOnScroll !== void 0 && (g = T.panOnScroll), T.panOnScrollDirection !== void 0 && (p = T.panOnScrollDirection), T.panOnScrollSpeed !== void 0 && (w = T.panOnScrollSpeed);
    },
    destroy() {
      t.removeEventListener("wheel", M, { capture: !0 }), c && (window.removeEventListener("keydown", d), window.removeEventListener("keyup", h), window.removeEventListener("blur", u)), C && (window.removeEventListener("keydown", S), window.removeEventListener("keyup", b), window.removeEventListener("blur", D)), a.on(".zoom", null);
    }
  };
}
function Ws(t, e, n, o) {
  return {
    x: (t - o.left - n.x) / n.zoom,
    y: (e - o.top - n.y) / n.zoom
  };
}
function Jd(t, e, n, o) {
  return {
    x: t * n.zoom + n.x + o.left,
    y: e * n.zoom + n.y + o.top
  };
}
const ye = 150, we = 50;
function eo(t, e, n, o, i) {
  if (i % 360 === 0) return { x: t, y: e, width: n, height: o };
  const r = i * Math.PI / 180, s = Math.abs(Math.cos(r)), a = Math.abs(Math.sin(r)), l = n * s + o * a, c = n * a + o * s, d = t + n / 2, h = e + o / 2;
  return { x: d - l / 2, y: h - c / 2, width: l, height: c };
}
function Nt(t, e) {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = 1 / 0, o = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const s of t) {
    const a = s.dimensions?.width ?? ye, l = s.dimensions?.height ?? we, c = Rt(s, e), d = s.rotation ? eo(c.x, c.y, a, l, s.rotation) : { x: c.x, y: c.y, width: a, height: l };
    n = Math.min(n, d.x), o = Math.min(o, d.y), i = Math.max(i, d.x + d.width), r = Math.max(r, d.y + d.height);
  }
  return {
    x: n,
    y: o,
    width: i - n,
    height: r - o
  };
}
function Qd(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? ye, a = r.dimensions?.height ?? we, l = Rt(r, n), c = r.rotation ? eo(l.x, l.y, s, a, r.rotation) : { x: l.x, y: l.y, width: s, height: a }, d = c.x + c.width, h = c.y + c.height;
    return !(d < e.x || c.x > o || h < e.y || c.y > i);
  });
}
function eu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? ye, a = r.dimensions?.height ?? we, l = Rt(r, n), c = r.rotation ? eo(l.x, l.y, s, a, r.rotation) : { x: l.x, y: l.y, width: s, height: a };
    return c.x >= e.x && c.y >= e.y && c.x + c.width <= o && c.y + c.height <= i;
  });
}
function Fn(t, e, n, o, i, r = 0.1) {
  const s = Math.max(t.width, 1), a = Math.max(t.height, 1), l = s * (1 + r), c = a * (1 + r), d = e / l, h = n / c, u = Math.min(Math.max(Math.min(d, h), o), i), f = { x: t.x + s / 2, y: t.y + a / 2 }, g = e / 2 - f.x * u, p = n / 2 - f.y * u;
  return { x: g, y: p, zoom: u };
}
function tu(t, e, n, o) {
  const i = 1 / t.zoom;
  return {
    minX: (0 - t.x) * i - o,
    minY: (0 - t.y) * i - o,
    maxX: (e - t.x) * i + o,
    maxY: (n - t.y) * i + o
  };
}
function Rt(t, e) {
  if (!t.position) return { x: 0, y: 0 };
  const n = t.nodeOrigin ?? e ?? [0, 0], o = t.dimensions?.width ?? ye, i = t.dimensions?.height ?? we;
  return {
    x: t.position.x - o * n[0],
    y: t.position.y - i * n[1]
  };
}
let js = !1;
function Us(t) {
  js = t;
}
function B(t, e, n) {
  if (!js) return;
  const o = `%c[AlpineFlow:${t}]`, i = nu(t);
  n !== void 0 ? console.log(o, i, e, n) : console.log(o, i, e);
}
function nu(t) {
  return `color: ${{
    init: "#4ade80",
    destroy: "#f87171",
    drag: "#60a5fa",
    viewport: "#a78bfa",
    edge: "#fb923c",
    connection: "#f472b6",
    selection: "#facc15",
    event: "#38bdf8",
    store: "#2dd4bf",
    resize: "#c084fc",
    collapse: "#c084fc",
    animate: "#34d399",
    layout: "#818cf8",
    particle: "#f472b6",
    history: "#fbbf24",
    clipboard: "#94a3b8"
  }[t] ?? "#94a3b8"}; font-weight: bold`;
}
const tn = "#64748b", Uo = "#d4d4d8", Zs = "#ef4444", ou = "2", iu = "6 3", Li = 1.2, To = 0.2, Ln = 5, Mi = 25;
function ro(t) {
  return JSON.parse(JSON.stringify(t));
}
class su {
  constructor(e = 50) {
    this.past = [], this.future = [], this._suspendDepth = 0, this.maxSize = e;
  }
  suspend() {
    this._suspendDepth++;
  }
  resume() {
    this._suspendDepth > 0 && this._suspendDepth--;
  }
  capture(e) {
    this._suspendDepth > 0 || (this.past.push(ro(e)), this.future = [], this.past.length > this.maxSize && this.past.shift());
  }
  undo(e) {
    return this.past.length === 0 ? null : (this.future.push(ro(e)), this.past.pop());
  }
  redo(e) {
    return this.future.length === 0 ? null : (this.past.push(ro(e)), this.future.pop());
  }
  get canUndo() {
    return this.past.length > 0;
  }
  get canRedo() {
    return this.future.length > 0;
  }
}
const ru = 16;
function au() {
  return typeof requestAnimationFrame == "function" ? {
    request: (t) => requestAnimationFrame(t),
    cancel: (t) => cancelAnimationFrame(t)
  } : {
    request: (t) => setTimeout(() => t(performance.now()), ru),
    cancel: (t) => clearTimeout(t)
  };
}
class Ks {
  constructor() {
    this._scheduler = au(), this._entries = [], this._postTickCallbacks = [], this._frameId = null, this._running = !1;
  }
  /** True when the rAF loop is running. */
  get active() {
    return this._running;
  }
  /** Replace the frame scheduler (useful for tests with fake timers). */
  setScheduler(e) {
    this._scheduler = e;
  }
  /**
   * Register a tick callback.
   * @param callback - Called each frame with elapsed ms since activation.
   * @param delay - Optional delay (ms) before first invocation, measured from rAF frames.
   * @returns Handle with a `stop()` method to unregister.
   */
  register(e, n = 0) {
    const o = {
      callback: e,
      startTime: 0,
      delay: n,
      registeredAt: performance.now(),
      activated: n <= 0,
      removed: !1
    };
    return o.activated && (o.startTime = performance.now()), this._entries.push(o), this._running || this._start(), {
      stop: () => {
        o.removed = !0;
      }
    };
  }
  /**
   * Register a post-tick callback, fired after all regular tick callbacks each frame.
   * @param callback - Called with the frame timestamp (same `now` value passed to `_tick`).
   * @param options - Optional settings. `keepAlive: true` keeps the engine loop running
   *   even when no regular callbacks are registered (useful for recorders that need every frame).
   * @returns Handle with a `stop()` method to unregister.
   */
  onPostTick(e, n) {
    const o = { callback: e, removed: !1, keepAlive: n?.keepAlive ?? !1 };
    return this._postTickCallbacks.push(o), o.keepAlive && !this._running && this._start(), {
      stop: () => {
        o.removed = !0;
      }
    };
  }
  // ── Internal: loop management ──────────────────────────────────────
  _start() {
    this._running || (this._running = !0, this._scheduleFrame());
  }
  _stop() {
    this._running && (this._running = !1, this._frameId !== null && (this._scheduler.cancel(this._frameId), this._frameId = null));
  }
  _scheduleFrame() {
    this._frameId = this._scheduler.request((e) => {
      this._tick(e);
    });
  }
  _tick(e) {
    const n = this._entries.slice();
    for (const i of n) {
      if (i.removed) continue;
      if (!i.activated) {
        if (e - i.registeredAt < i.delay) continue;
        i.activated = !0, i.startTime = e;
      }
      const r = e - i.startTime;
      i.callback(r) === !0 && (i.removed = !0);
    }
    this._entries = this._entries.filter((i) => !i.removed);
    for (const i of this._postTickCallbacks)
      i.removed || i.callback(e);
    this._postTickCallbacks = this._postTickCallbacks.filter((i) => !i.removed);
    const o = this._postTickCallbacks.some((i) => !i.removed && i.keepAlive);
    if (this._entries.length === 0 && !o) {
      this._stop();
      return;
    }
    this._scheduleFrame();
  }
}
const zn = new Ks(), lu = {
  linear: dd,
  easeIn: ud,
  easeOut: fd,
  easeInOut: hd,
  easeCubicIn: gd,
  easeCubicOut: pd,
  easeCubicInOut: Xs,
  easeCircIn: xd,
  easeCircOut: Ed,
  easeCircInOut: Cd,
  easeSinIn: md,
  easeSinOut: yd,
  easeSinInOut: wd,
  easeExpoIn: vd,
  easeExpoOut: _d,
  easeExpoInOut: bd,
  easeBounce: Rn,
  easeBounceIn: $d,
  easeBounceInOut: Id,
  easeElastic: zd,
  easeElasticIn: Fd,
  easeElasticInOut: Od,
  easeBack: Hd,
  easeBackIn: Dd,
  easeBackOut: Rd
};
function Gs(t) {
  const e = t ?? "auto";
  return e === !1 ? !1 : e === !0 ? !0 : typeof globalThis < "u" && globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === !0;
}
function On(t) {
  return typeof t == "function" ? t : lu[t ?? "easeInOut"];
}
function Ze(t, e, n) {
  return t + (e - t) * n;
}
function Zo(t, e, n) {
  return Eo(t, e)(n);
}
function nn(t) {
  if (typeof t != "string")
    return t;
  if (!t.trim())
    return {};
  const e = {};
  for (const n of t.split(";")) {
    const o = n.trim();
    if (!o) continue;
    const i = o.indexOf(":");
    if (i === -1) continue;
    const r = o.slice(0, i).trim(), s = o.slice(i + 1).trim();
    e[r] = s;
  }
  return e;
}
const Ti = /^(-?\d+\.?\d*)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch)?$/, Ai = /^(#|rgb|hsl)/;
function Js(t, e, n) {
  const o = {}, i = /* @__PURE__ */ new Set([...Object.keys(t), ...Object.keys(e)]);
  for (const r of i) {
    const s = t[r], a = e[r];
    if (s === void 0) {
      o[r] = a;
      continue;
    }
    if (a === void 0) {
      o[r] = s;
      continue;
    }
    const l = Ti.exec(s), c = Ti.exec(a);
    if (l && c) {
      const d = parseFloat(l[1]), h = parseFloat(c[1]), u = c[2] ?? "", f = Ze(d, h, n);
      o[r] = u ? `${f}${u}` : String(f);
      continue;
    }
    if (Ai.test(s) && Ai.test(a)) {
      o[r] = Zo(s, a, n);
      continue;
    }
    o[r] = n < 0.5 ? s : a;
  }
  return o;
}
function cu(t, e, n, o) {
  let i = Ze(t.zoom, e.zoom, n);
  return o?.minZoom !== void 0 && (i = Math.max(i, o.minZoom)), o?.maxZoom !== void 0 && (i = Math.min(i, o.maxZoom)), {
    x: Ze(t.x, e.x, n),
    y: Ze(t.y, e.y, n),
    zoom: i
  };
}
class du {
  constructor() {
    this._handles = /* @__PURE__ */ new Set();
  }
  register(e) {
    this._handles.add(e);
  }
  unregister(e) {
    this._handles.delete(e);
  }
  getHandles(e) {
    const n = [...this._handles];
    if (!e?.tag && !e?.tags?.length)
      return n;
    const o = /* @__PURE__ */ new Set();
    return e.tag && o.add(e.tag), e.tags && e.tags.forEach((i) => o.add(i)), n.filter((i) => i._tags?.some((r) => o.has(r)) ?? !1);
  }
  cancelAll(e, n) {
    for (const o of this.getHandles(e))
      o.isFinished || o.stop(n);
  }
  pauseAll(e) {
    for (const n of this.getHandles(e))
      n.isFinished || n.pause();
  }
  resumeAll(e) {
    for (const n of this.getHandles(e))
      n.resume();
  }
  clear() {
    this._handles.clear();
  }
  get size() {
    return this._handles.size;
  }
}
class uu {
  constructor() {
    this._handles = [], this._state = "active", this._propertySnapshots = /* @__PURE__ */ new Map(), this.finished = new Promise((e) => {
      this._resolveFinished = e;
    });
  }
  get state() {
    return this._state;
  }
  get handles() {
    return this._handles;
  }
  /** Called by the Animator when a new handle is created inside this transaction. */
  trackHandle(e) {
    this._state === "active" && this._handles.push(e);
  }
  /**
   * Called by the Animator the FIRST time a property key is touched inside this transaction.
   * Captures the pre-transaction value for rollback (lazy snapshot — only first touch per key).
   */
  captureProperty(e, n, o) {
    this._state === "active" && (this._propertySnapshots.has(e) || this._propertySnapshots.set(e, { value: n, apply: o }));
  }
  commit() {
    this._state === "active" && (this._state = "committed", this._resolveFinished());
  }
  rollback() {
    if (this._state === "active") {
      for (const e of this._handles)
        e.stop({ mode: "freeze" });
      for (const [, e] of this._propertySnapshots)
        e.apply(e.value);
      this._state = "rolled-back", this._resolveFinished();
    }
  }
}
const Ot = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  restVelocity: 0.01,
  restDisplacement: 0.01
};
function Qs(t, e, n) {
  if (n <= 0)
    return;
  const o = e.stiffness ?? Ot.stiffness, i = e.damping ?? Ot.damping, r = e.mass ?? Ot.mass, s = t.value - t.target, a = (-o * s - i * t.velocity) / r;
  t.velocity += a * n, t.value += t.velocity * n, Math.abs(t.velocity) < (e.restVelocity ?? Ot.restVelocity) && Math.abs(t.value - t.target) < (e.restDisplacement ?? Ot.restDisplacement) && (t.value = t.target, t.velocity = 0, t.settled = !0);
}
const Ni = {
  timeConstant: 350,
  restVelocity: 0.5
};
function Ko(t, e, n) {
  if (n <= 0)
    return;
  const o = e.timeConstant ?? Ni.timeConstant, i = Math.exp(-n * 1e3 / o);
  t.velocity *= i, t.value += t.velocity * n, Math.abs(t.velocity) < Ni.restVelocity && (t.velocity = 0, t.settled = !0, t.target = t.value);
}
function er(t, e, n, o) {
  if (!(n <= 0)) {
    if (Ko(t, {
      velocity: t.velocity,
      power: e.power,
      timeConstant: e.timeConstant
    }, n), e.bounds && o) {
      const i = e.bounds[o];
      if (i) {
        const [r, s] = i, a = (e.bounceStiffness ?? 200) / 500, l = (e.bounceDamping ?? 40) / 100, c = a * (1 - l);
        t.value < r ? (t.value = r, t.velocity = Math.abs(t.velocity) * c, t.settled = !1) : t.value > s && (t.value = s, t.velocity = -Math.abs(t.velocity) * c, t.settled = !1);
      }
    }
    if (t.settled && e.snapTo?.length && o) {
      let i = t.value, r = 1 / 0;
      for (const s of e.snapTo) {
        const a = s[o];
        if (a !== void 0) {
          const l = Math.abs(t.value - a);
          l < r && (r = l, i = a);
        }
      }
      t.value = i;
    }
  }
}
function tr(t, e, n, o) {
  const i = e.values.map((f) => f[o] ?? t.value);
  if (i.length < 2) {
    t.value = i[0] ?? t.value, t.settled = !0;
    return;
  }
  const r = e.offsets ?? i.map((f, g) => g / (i.length - 1)), s = Math.max(0, Math.min(1, n));
  let a = 0;
  for (let f = 0; f < r.length - 1; f++)
    s >= r[f] && (a = f);
  const l = r[a], c = r[a + 1] ?? 1, d = c > l ? (s - l) / (c - l) : 1, h = i[a], u = i[a + 1] ?? i[a];
  t.value = h + (u - h) * Math.max(0, Math.min(1, d)), s >= 1 && (t.value = i[i.length - 1], t.settled = !0);
}
const $i = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  wobbly: { type: "spring", stiffness: 180, damping: 12 },
  stiff: { type: "spring", stiffness: 300, damping: 30 },
  slow: { type: "spring", stiffness: 60, damping: 15 },
  molasses: { type: "spring", stiffness: 40, damping: 30 }
}, Ii = {
  smooth: { type: "decay", velocity: 0, power: 0.6, timeConstant: 400 },
  snappy: { type: "decay", velocity: 0, power: 1.2, timeConstant: 200 }
}, Di = {
  momentum: { type: "inertia", velocity: 0, power: 0.8, timeConstant: 700 },
  rails: { type: "inertia", velocity: 0, bounceStiffness: 500, bounceDamping: 40 }
};
function nr(t) {
  if (typeof t != "string")
    return t;
  const [e, n] = t.split(".");
  if (!n)
    return null;
  switch (e) {
    case "spring":
      return $i[n] ? { ...$i[n] } : null;
    case "decay":
      return Ii[n] ? { ...Ii[n] } : null;
    case "inertia":
      return Di[n] ? { ...Di[n] } : null;
    default:
      return null;
  }
}
function Ri(t) {
  return typeof t != "string" ? !1 : /^(#|rgb|hsl)/.test(t);
}
function fu(t, e, n) {
  return typeof t == "number" && typeof e == "number" ? Ze(t, e, n) : Ri(t) && Ri(e) ? Zo(t, e, n) : n < 0.5 ? t : e;
}
class hu {
  constructor(e) {
    this._ownership = /* @__PURE__ */ new Map(), this._groups = /* @__PURE__ */ new Set(), this._nextGroupId = 0, this._registry = new du(), this._activeTransaction = null, this._engine = e;
  }
  /** Whether any animations are currently running. */
  get active() {
    return this._groups.size > 0;
  }
  /** The handle registry for tag-based animation control. */
  get registry() {
    return this._registry;
  }
  /** Begin a new transaction — all subsequent `animate()` calls will be tracked until `endTransaction()`. */
  beginTransaction() {
    const e = new uu();
    return this._activeTransaction = e, e;
  }
  /** End the current transaction context (does NOT commit or rollback — the caller decides). */
  endTransaction() {
    this._activeTransaction = null;
  }
  /**
   * Animate a set of property entries over the given duration.
   *
   * If any entry targets a key already being animated, the current in-flight
   * value is captured as the new "from" and the property is removed from the
   * old group (blend/compose).
   */
  animate(e, n) {
    const {
      duration: o,
      easing: i,
      delay: r = 0,
      loop: s = !1,
      startAt: a,
      onStart: l,
      onProgress: c,
      onComplete: d,
      tag: h,
      tags: u,
      while: f,
      whileStopMode: g = "jump-end",
      motion: p,
      maxDuration: w = 5e3
    } = n, m = On(i), C = p ? nr(p) : void 0;
    for (const _ of e) {
      const L = this._ownership.get(_.key);
      if (L && !L.stopped) {
        const A = L.currentValues.get(_.key);
        A !== void 0 && (_.from = A), L.entries = L.entries.filter((O) => O.key !== _.key), L.entries.length === 0 && this._stop(L, "superseded");
      }
    }
    if (this._activeTransaction && this._activeTransaction.state === "active")
      for (const _ of e)
        this._activeTransaction.captureProperty(_.key, _.from, _.apply);
    if (o <= 0) {
      const _ = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map();
      for (const E of e)
        _.set(E.key, E.from), L.set(E.key, E.to);
      l?.();
      for (const E of e)
        E.apply(E.to);
      const A = [...h ? [h] : [], ...u ?? []], O = {
        _tags: A.length > 0 ? A : void 0,
        pause: () => {
        },
        resume: () => {
        },
        stop: () => {
        },
        reverse: () => {
        },
        play: () => {
        },
        playForward: () => {
        },
        playBackward: () => {
        },
        restart: () => {
        },
        get direction() {
          return "forward";
        },
        get isFinished() {
          return !0;
        },
        get currentValue() {
          return L;
        },
        finished: Promise.resolve(),
        get _snapshot() {
          return _;
        },
        get _target() {
          return L;
        }
      };
      return this._registry.register(O), queueMicrotask(() => this._registry.unregister(O)), this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(O), d?.(), O;
    }
    const S = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
    for (const _ of e)
      S.set(_.key, _.from), b.set(_.key, _.to);
    let D;
    if (C) {
      D = /* @__PURE__ */ new Map();
      for (const _ of e) {
        if (typeof _.from != "number" || typeof _.to != "number") {
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${_.key}" is non-numeric; snapping to target.`
          ), _.apply(_.to);
          continue;
        }
        let L = 0;
        if (C.type === "decay" || C.type === "inertia") {
          const A = C.velocity;
          typeof A == "number" ? L = A : A && typeof A == "object" && _.key in A && (L = A[_.key]);
          const O = C.power ?? 0.8;
          L *= O;
        }
        D.set(_.key, {
          value: _.from,
          velocity: L,
          target: _.to,
          settled: !1
        });
      }
      D.size === 0 && (D = void 0);
    }
    const M = s === "ping-pong" ? "reverse" : s, T = a === "end" ? "backward" : "forward";
    let v;
    const P = new Promise((_) => {
      v = _;
    }), $ = {
      _id: this._nextGroupId++,
      entries: [...e],
      engineHandle: null,
      startTime: 0,
      pausedElapsed: null,
      _resumeNeeded: !1,
      direction: T,
      duration: o,
      easingFn: m,
      loop: M,
      onStart: l,
      startFired: !1,
      onProgress: c,
      onComplete: d,
      resolve: v,
      stopped: !1,
      isFinished: !1,
      currentValues: /* @__PURE__ */ new Map(),
      _lastElapsed: 0,
      snapshot: S,
      target: b,
      _currentFinished: P,
      whilePredicate: f,
      whileStopMode: g,
      motionConfig: D ? C : void 0,
      physicsStates: D,
      maxDuration: w,
      isPhysics: !!D,
      _prevElapsed: 0
    };
    if (a === "end")
      for (const _ of $.entries)
        _.apply(_.to), $.currentValues.set(_.key, _.to);
    else
      for (const _ of $.entries)
        $.currentValues.set(_.key, _.from);
    for (const _ of e)
      this._ownership.set(_.key, $);
    this._groups.add($);
    const x = this._engine.register((_) => this._tick($, _), r);
    $.engineHandle = x;
    const y = [...h ? [h] : [], ...u ?? []], q = {
      _tags: y.length > 0 ? y : void 0,
      pause: () => this._pause($),
      resume: () => this._resume($),
      stop: (_) => this._stop($, _?.mode ?? "jump-end"),
      reverse: () => this._reverse($),
      play: () => this._play($),
      playForward: () => this._playDirection($, "forward"),
      playBackward: () => this._playDirection($, "backward"),
      restart: (_) => this._restart($, _),
      get direction() {
        return $.direction;
      },
      get isFinished() {
        return $.isFinished;
      },
      get currentValue() {
        return $.currentValues;
      },
      get finished() {
        return $._currentFinished;
      },
      get _snapshot() {
        return $.snapshot;
      },
      get _target() {
        return $.target;
      }
    };
    return this._registry.register(q), $._handle = q, this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(q), q;
  }
  /** Stop all active animations. */
  stopAll(e) {
    const n = e?.mode ?? "jump-end";
    for (const o of this._groups)
      o.stopped || this._stop(o, n);
    this._groups.clear(), this._ownership.clear();
  }
  // ── Internal: tick ───────────────────────────────────────────────────
  /**
   * Per-frame tick for an animation group.
   * @returns `true` when the animation is complete (to unregister from engine).
   */
  _tick(e, n) {
    if (e.stopped)
      return !0;
    if (e.pausedElapsed !== null)
      return;
    if (e.isPhysics)
      return this._tickPhysics(e, n);
    if (e.whilePredicate && !e.whilePredicate())
      return this._stop(e, e.whileStopMode), !0;
    e._resumeNeeded && (e.startTime += n - e._lastElapsed, e._resumeNeeded = !1), e.startTime === 0 && (e.startTime = n), e.startFired || (e.startFired = !0, e.onStart?.()), e._lastElapsed = n;
    const o = n - e.startTime;
    let i = Math.min(o / e.duration, 1);
    if (e.loop && i >= 1)
      if (e.loop === "reverse") {
        const a = o / e.duration, l = Math.floor(a), c = a - l;
        i = l % 2 === 0 ? c : 1 - c;
      } else
        i = o % e.duration / e.duration;
    const r = e.direction === "backward" ? 1 - i : i, s = e.easingFn(r);
    for (const a of e.entries) {
      const l = fu(a.from, a.to, s);
      e.currentValues.set(a.key, l), a.apply(l);
    }
    if (e.onProgress?.(r), !e.loop && i >= 1) {
      for (const a of e.entries) {
        const l = e.direction === "backward" ? a.from : a.to;
        a.apply(l), e.currentValues.set(a.key, l);
      }
      return this._completeGroup(e), !0;
    }
  }
  /**
   * Mark a group as complete: set flags, clean up, fire callbacks, resolve promise,
   * and schedule auto-deregistration. Shared by both the eased and physics paths.
   */
  _completeGroup(e) {
    if (e.stopped = !0, e.isFinished = !0, this._cleanup(e), e.onComplete?.(), e.resolve?.(), e._handle) {
      const n = e._handle;
      queueMicrotask(() => {
        e.isFinished && this._registry.unregister(n);
      });
    }
  }
  /**
   * Per-frame tick for a physics-based animation group.
   * Runs the physics integrator (spring, etc.) each frame instead of eased interpolation.
   * @returns `true` when the animation is complete (to unregister from engine).
   */
  _tickPhysics(e, n) {
    if (e.whilePredicate && !e.whilePredicate())
      return this._stop(e, e.whileStopMode), !0;
    e._resumeNeeded && (e._resumeNeeded = !1, e._prevElapsed = n, e.startTime = n - (e._lastElapsed - e.startTime)), e.startTime === 0 && (e.startTime = n), e.startFired || (e.startFired = !0, e.onStart?.());
    const o = e._prevElapsed || n, i = Math.min((n - o) / 1e3, 0.064);
    if (e._prevElapsed = n, e._lastElapsed = n, i <= 0)
      return;
    const r = e.physicsStates;
    let s = !0;
    for (const c of e.entries) {
      const d = r.get(c.key);
      if (d) {
        if (!d.settled) {
          switch (e.direction === "backward" ? d.target = e.snapshot.get(c.key) : d.target = e.target.get(c.key), e.motionConfig.type) {
            case "spring":
              Qs(d, e.motionConfig, i);
              break;
            case "decay":
              Ko(d, e.motionConfig, i);
              break;
            case "inertia":
              er(d, e.motionConfig, i, c.key);
              break;
            case "keyframes": {
              const h = n - e.startTime, u = e.motionConfig.duration ?? e.maxDuration, f = Math.min(h / u, 1);
              tr(d, e.motionConfig, f, c.key);
              break;
            }
          }
          e.currentValues.set(c.key, d.value), c.apply(d.value);
        }
        d.settled || (s = !1);
      }
    }
    const a = n - e.startTime, l = Math.min(a / e.maxDuration, 1);
    if (e.onProgress?.(l), a >= e.maxDuration) {
      for (const [c, d] of r)
        if (!d.settled) {
          d.value = d.target, d.velocity = 0, d.settled = !0;
          const h = e.entries.find((u) => u.key === c);
          h && (h.apply(d.value), e.currentValues.set(h.key, d.value));
        }
      s = !0;
    }
    if (s)
      return this._completeGroup(e), !0;
  }
  // ── Internal: handle actions ─────────────────────────────────────────
  _pause(e) {
    e.stopped || e.pausedElapsed !== null || e.startTime === 0 || (e.pausedElapsed = e._lastElapsed);
  }
  _resume(e) {
    e.stopped || e.pausedElapsed === null || (e._resumeNeeded = !0, e.pausedElapsed = null);
  }
  _stop(e, n = "jump-end") {
    if (!e.stopped) {
      if (e.stopped = !0, e.engineHandle.stop(), n === "jump-end") {
        for (const o of e.entries) {
          const i = e.direction === "backward" ? o.from : o.to;
          o.apply(i);
        }
        if (e.isPhysics && e.physicsStates)
          for (const [, o] of e.physicsStates)
            o.value = o.target, o.velocity = 0, o.settled = !0;
      } else if (n === "rollback")
        for (const o of e.entries) {
          const i = e.snapshot.get(o.key);
          i !== void 0 && o.apply(i);
        }
      if (this._cleanup(e), n !== "superseded" && e.onComplete?.(), e.resolve?.(), e._handle) {
        const o = e._handle;
        queueMicrotask(() => {
          (e.isFinished || e.stopped) && this._registry.unregister(o);
        });
      }
    }
  }
  _reverse(e) {
    if (e.isFinished) {
      if (e.direction = e.direction === "forward" ? "backward" : "forward", e.isPhysics && e.physicsStates)
        for (const [n, o] of e.physicsStates)
          e.direction === "backward" ? o.target = e.snapshot.get(n) : o.target = e.target.get(n), o.velocity = 0, o.settled = !1;
      this._revive(e);
      return;
    }
    if (!e.stopped) {
      if (e.direction = e.direction === "forward" ? "backward" : "forward", e.isPhysics && e.physicsStates) {
        for (const [n, o] of e.physicsStates)
          e.direction === "backward" ? o.target = e.snapshot.get(n) : o.target = e.target.get(n), o.velocity = 0, o.settled = !1;
        return;
      }
      if (e._lastElapsed > 0 && e.startTime > 0) {
        const n = e._lastElapsed, o = Math.min((n - e.startTime) / e.duration, 1);
        e.startTime = n - (1 - o) * e.duration;
      }
    }
  }
  _play(e) {
    if (e.isFinished) {
      this._revive(e);
      return;
    }
    e.stopped || e.pausedElapsed !== null && this._resume(e);
  }
  _playDirection(e, n) {
    const o = e.direction !== n;
    if (e.direction = n, e.isFinished) {
      this._revive(e);
      return;
    }
    if (!e.stopped) {
      if (o && e.isPhysics && e.physicsStates)
        for (const [i, r] of e.physicsStates)
          n === "backward" ? r.target = e.snapshot.get(i) : r.target = e.target.get(i), r.velocity = 0, r.settled = !1;
      else if (o && e._lastElapsed > 0 && e.startTime > 0) {
        const i = e._lastElapsed, r = Math.min((i - e.startTime) / e.duration, 1);
        e.startTime = i - (1 - r) * e.duration;
      }
      e.pausedElapsed !== null && this._resume(e);
    }
  }
  _restart(e, n) {
    const o = n?.direction ?? "forward";
    if (e.direction = o, o === "forward")
      for (const i of e.entries) {
        const r = e.snapshot.get(i.key);
        r !== void 0 && (i.apply(r), e.currentValues.set(i.key, r));
      }
    else
      for (const i of e.entries) {
        const r = e.target.get(i.key);
        r !== void 0 && (i.apply(r), e.currentValues.set(i.key, r));
      }
    if (e.isPhysics && e.physicsStates)
      for (const [i, r] of e.physicsStates)
        o === "forward" ? (r.value = e.snapshot.get(i), r.target = e.target.get(i)) : (r.value = e.target.get(i), r.target = e.snapshot.get(i)), r.velocity = 0, r.settled = !1;
    this._revive(e);
  }
  /** Revive a finished/stopped group: reset timing, re-register on engine, renew promise. */
  _revive(e) {
    if (e.isFinished = !1, e.stopped = !1, e.startTime = 0, e.startFired = !1, e.pausedElapsed = null, e._resumeNeeded = !1, e._lastElapsed = 0, e._prevElapsed = 0, e.isPhysics && e.physicsStates)
      for (const [o, i] of e.physicsStates)
        i.settled && (e.direction === "forward" ? (i.value = e.snapshot.get(o), i.target = e.target.get(o)) : (i.value = e.target.get(o), i.target = e.snapshot.get(o)), i.velocity = 0, i.settled = !1);
    this._renewFinished(e);
    for (const o of e.entries)
      this._ownership.set(o.key, e);
    this._groups.add(e), e._handle && this._registry.register(e._handle);
    const n = this._engine.register((o) => this._tick(e, o));
    e.engineHandle = n;
  }
  /** Create a new finished promise for the group (old one stays resolved). */
  _renewFinished(e) {
    e.resolve = null;
    const n = new Promise((o) => {
      e.resolve = o;
    });
    e._currentFinished = n;
  }
  // ── Internal: cleanup ────────────────────────────────────────────────
  _cleanup(e) {
    for (const n of e.entries) {
      const o = this._ownership.get(n.key);
      o && o._id === e._id && this._ownership.delete(n.key);
    }
    this._groups.delete(e);
  }
}
const or = /* @__PURE__ */ new Map();
function gu(t, e) {
  or.set(t, e);
}
function ao(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function on(t) {
  return typeof t == "string" ? { type: t } : t;
}
function sn(t, e) {
  return `${e}__${t.type}__${(t.color ?? Uo).replace(/[^a-zA-Z0-9]/g, "_")}`;
}
function Vn(t, e) {
  const n = ao(t.color ?? Uo), o = Number(t.width ?? 12.5), i = Number(t.height ?? 12.5), r = Number.isFinite(o) && o > 0 ? o : 12.5, s = Number.isFinite(i) && i > 0 ? i : 12.5, a = ao(t.orient ?? "auto-start-reverse"), l = ao(e);
  if (t.type === "arrow")
    return `<marker
      id="${l}"
      viewBox="-10 -10 20 20"
      markerWidth="${r}"
      markerHeight="${s}"
      orient="${a}"
      markerUnits="strokeWidth"
      refX="0"
      refY="0"
    >
      <polyline
        stroke="${n}"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        fill="none"
        points="-5,-4 0,0 -5,4"
      />
    </marker>`;
  if (t.type === "arrowclosed")
    return `<marker
      id="${l}"
      viewBox="-10 -10 20 20"
      markerWidth="${r}"
      markerHeight="${s}"
      orient="${a}"
      markerUnits="strokeWidth"
      refX="0"
      refY="0"
    >
      <polyline
        stroke="${n}"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        fill="${n}"
        points="-5,-4 0,0 -5,4 -5,-4"
      />
    </marker>`;
  const c = or.get(t.type);
  return c ? c({ id: l, color: n, width: r, height: s, orient: a }) : Vn({ ...t, type: "arrowclosed" }, e);
}
const ut = 200, ft = 150, pu = 1.2, Vt = "http://www.w3.org/2000/svg";
function mu(t, e) {
  const { getState: n, setViewport: o, config: i } = e, r = i.minimapPosition ?? "bottom-right", s = i.minimapMaskColor, a = i.minimapNodeColor, l = document.createElement("div");
  l.className = `flow-minimap flow-minimap-${r}`;
  const c = document.createElementNS(Vt, "svg");
  c.setAttribute("width", String(ut)), c.setAttribute("height", String(ft));
  const d = document.createElementNS(Vt, "rect");
  d.classList.add("flow-minimap-bg"), d.setAttribute("width", String(ut)), d.setAttribute("height", String(ft));
  const h = document.createElementNS(Vt, "g");
  h.classList.add("flow-minimap-nodes");
  const u = document.createElementNS(Vt, "path");
  u.classList.add("flow-minimap-mask"), s && u.setAttribute("fill", s), u.setAttribute("fill-rule", "evenodd"), c.appendChild(d), c.appendChild(h), c.appendChild(u), l.appendChild(c), t.appendChild(l);
  let f = { x: 0, y: 0, width: 0, height: 0 }, g = 1;
  function p() {
    const x = n();
    if (f = Nt(x.nodes.filter((y) => !y.hidden), i.nodeOrigin), f.width === 0 && f.height === 0) {
      g = 1;
      return;
    }
    g = Math.max(
      f.width / ut,
      f.height / ft
    ) * pu;
  }
  function w(x) {
    return typeof a == "function" ? a(x) : a;
  }
  function m() {
    const x = n();
    p(), h.innerHTML = "";
    const y = (ut - f.width / g) / 2, q = (ft - f.height / g) / 2;
    for (const _ of x.nodes) {
      if (_.hidden) continue;
      const L = document.createElementNS(Vt, "rect"), A = (_.dimensions?.width ?? ye) / g, O = (_.dimensions?.height ?? we) / g, E = (_.position.x - f.x) / g + y, k = (_.position.y - f.y) / g + q;
      L.setAttribute("x", String(E)), L.setAttribute("y", String(k)), L.setAttribute("width", String(A)), L.setAttribute("height", String(O)), L.setAttribute("rx", "2");
      const N = w(_);
      N && (L.style.fill = N), h.appendChild(L);
    }
    C();
  }
  function C() {
    const x = n();
    if (f.width === 0 && f.height === 0) {
      u.setAttribute("d", "");
      return;
    }
    const y = (ut - f.width / g) / 2, q = (ft - f.height / g) / 2, _ = (-x.viewport.x / x.viewport.zoom - f.x) / g + y, L = (-x.viewport.y / x.viewport.zoom - f.y) / g + q, A = x.containerWidth / x.viewport.zoom / g, O = x.containerHeight / x.viewport.zoom / g, E = `M0,0 H${ut} V${ft} H0 Z`, k = `M${_},${L} h${A} v${O} h${-A} Z`;
    u.setAttribute("d", `${E} ${k}`);
  }
  let S = !1;
  function b(x, y) {
    const q = (ut - f.width / g) / 2, _ = (ft - f.height / g) / 2, L = (x - q) * g + f.x, A = (y - _) * g + f.y;
    return { x: L, y: A };
  }
  function D(x) {
    const y = c.getBoundingClientRect(), q = x.clientX - y.left, _ = x.clientY - y.top, L = n(), A = b(q, _), O = -A.x * L.viewport.zoom + L.containerWidth / 2, E = -A.y * L.viewport.zoom + L.containerHeight / 2;
    o({ x: O, y: E, zoom: L.viewport.zoom });
  }
  function M(x) {
    i.minimapPannable && (S = !0, c.setPointerCapture(x.pointerId), D(x));
  }
  function T(x) {
    S && D(x);
  }
  function v(x) {
    S && (S = !1, c.releasePointerCapture(x.pointerId));
  }
  c.addEventListener("pointerdown", M), c.addEventListener("pointermove", T), c.addEventListener("pointerup", v);
  function P(x) {
    if (!i.minimapZoomable)
      return;
    x.preventDefault();
    const y = n(), q = i.minZoom ?? 0.5, _ = i.maxZoom ?? 2, L = x.deltaY > 0 ? 0.9 : 1.1, A = Math.min(Math.max(y.viewport.zoom * L, q), _);
    o({ zoom: A });
  }
  c.addEventListener("wheel", P, { passive: !1 });
  function $() {
    c.removeEventListener("pointerdown", M), c.removeEventListener("pointermove", T), c.removeEventListener("pointerup", v), c.removeEventListener("wheel", P), l.remove();
  }
  return { render: m, updateViewport: C, destroy: $ };
}
const yu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', wu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>', vu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', Hi = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', _u = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', bu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>';
function xu(t, e) {
  const {
    position: n,
    orientation: o,
    showZoom: i,
    showFitView: r,
    showInteractive: s,
    showResetPanels: a,
    external: l,
    onZoomIn: c,
    onZoomOut: d,
    onFitView: h,
    onToggleInteractive: u,
    onResetPanels: f
  } = e, g = document.createElement("div"), p = [
    "flow-controls",
    `flow-controls-${o}`
  ];
  l ? p.push("flow-controls-external") : p.push(`flow-controls-${n}`), g.className = p.join(" "), g.setAttribute("role", "toolbar"), g.setAttribute("aria-label", "Flow controls");
  let w = null;
  if (i) {
    const S = Bt(yu, "Zoom in", c), b = Bt(wu, "Zoom out", d);
    g.appendChild(S), g.appendChild(b);
  }
  if (r) {
    const S = Bt(vu, "Fit view", h);
    g.appendChild(S);
  }
  if (s && (w = Bt(Hi, "Toggle interactivity", u), g.appendChild(w)), a) {
    const S = Bt(bu, "Reset panels", f);
    g.appendChild(S);
  }
  g.addEventListener("mousedown", (S) => S.stopPropagation()), g.addEventListener("pointerdown", (S) => S.stopPropagation()), g.addEventListener("wheel", (S) => S.stopPropagation(), { passive: !1 }), t.appendChild(g);
  function m(S) {
    if (w) {
      w.innerHTML = S.isInteractive ? Hi : _u;
      const b = S.isInteractive ? "Lock interactivity" : "Unlock interactivity";
      w.title = b, w.setAttribute("aria-label", b);
    }
  }
  function C() {
    g.remove();
  }
  return { update: m, destroy: C };
}
function Bt(t, e, n) {
  const o = document.createElement("button");
  return o.type = "button", o.innerHTML = t, o.title = e, o.setAttribute("aria-label", e), o.addEventListener("click", n), o;
}
const Fi = 5;
function Eu(t) {
  const e = document.createElement("div");
  e.className = "flow-selection-box", t.appendChild(e);
  let n = !1, o = 0, i = 0, r = 0, s = 0;
  function a(u, f, g = "partial") {
    o = u, i = f, r = u, s = f, n = !0, e.style.left = `${u}px`, e.style.top = `${f}px`, e.style.width = "0px", e.style.height = "0px", e.classList.remove("flow-selection-partial", "flow-selection-full"), e.classList.add("flow-selection-box-active", `flow-selection-${g}`);
  }
  function l(u, f) {
    if (!n)
      return;
    r = u, s = f;
    const g = Math.min(o, r), p = Math.min(i, s), w = Math.abs(r - o), m = Math.abs(s - i);
    e.style.left = `${g}px`, e.style.top = `${p}px`, e.style.width = `${w}px`, e.style.height = `${m}px`;
  }
  function c(u) {
    if (!n)
      return null;
    n = !1, e.classList.remove("flow-selection-box-active"), e.classList.remove("flow-selection-partial", "flow-selection-full");
    const f = Math.abs(r - o), g = Math.abs(s - i);
    if (f < Fi && g < Fi)
      return null;
    const p = Math.min(o, r), w = Math.min(i, s), m = (p - u.x) / u.zoom, C = (w - u.y) / u.zoom, S = f / u.zoom, b = g / u.zoom;
    return { x: m, y: C, width: S, height: b };
  }
  function d() {
    return n;
  }
  function h() {
    e.remove();
  }
  return { start: a, update: l, end: c, isActive: d, destroy: h };
}
const zi = 3;
function Cu(t) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.classList.add("flow-lasso-svg"), e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), t.appendChild(e);
  const n = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  n.classList.add("flow-lasso-path"), e.appendChild(n);
  let o = !1, i = [];
  function r(d, h, u = "partial") {
    o = !0, i = [{ x: d, y: h }], e.classList.remove("flow-lasso-partial", "flow-lasso-full"), e.classList.add("flow-lasso-active", `flow-lasso-${u}`), n.setAttribute("points", `${d},${h}`);
  }
  function s(d, h) {
    if (!o)
      return;
    const u = i[i.length - 1], f = d - u.x, g = h - u.y;
    f * f + g * g < zi * zi || (i.push({ x: d, y: h }), n.setAttribute("points", i.map((p) => `${p.x},${p.y}`).join(" ")));
  }
  function a(d) {
    if (!o || (o = !1, e.classList.remove("flow-lasso-active", "flow-lasso-partial", "flow-lasso-full"), n.setAttribute("points", ""), i.length < 3))
      return null;
    const h = i.map((u) => ({
      x: (u.x - d.x) / d.zoom,
      y: (u.y - d.y) / d.zoom
    }));
    return i = [], h;
  }
  function l() {
    return o;
  }
  function c() {
    e.remove();
  }
  return { start: r, update: s, end: a, isActive: l, destroy: c };
}
function Go(t, e, n) {
  if (n.length < 3) return !1;
  let o = !1;
  for (let i = 0, r = n.length - 1; i < n.length; r = i++) {
    const s = n[i].x, a = n[i].y, l = n[r].x, c = n[r].y;
    a > e != c > e && t < (l - s) * (e - a) / (c - a) + s && (o = !o);
  }
  return o;
}
function Su(t, e, n, o, i, r, s, a) {
  const l = n - t, c = o - e, d = s - i, h = a - r, u = l * h - c * d;
  if (Math.abs(u) < 1e-10) return !1;
  const f = i - t, g = r - e, p = (f * h - g * d) / u, w = (f * c - g * l) / u;
  return p >= 0 && p <= 1 && w >= 0 && w <= 1;
}
function Pu(t, e) {
  const n = e.x, o = e.y, i = e.x + e.width, r = e.y + e.height, s = n + e.width / 2, a = o + e.height / 2;
  if (Go(s, a, t)) return !0;
  for (const c of t)
    if (c.x >= n && c.x <= i && c.y >= o && c.y <= r) return !0;
  const l = [
    [n, o, i, o],
    // top
    [i, o, i, r],
    // right
    [i, r, n, r],
    // bottom
    [n, r, n, o]
    // left
  ];
  for (let c = 0, d = t.length - 1; c < t.length; d = c++)
    for (const [h, u, f, g] of l)
      if (Su(t[d].x, t[d].y, t[c].x, t[c].y, h, u, f, g))
        return !0;
  return !1;
}
function ir(t) {
  const e = t.dimensions?.width ?? ye, n = t.dimensions?.height ?? we;
  return t.rotation ? eo(t.position.x, t.position.y, e, n, t.rotation) : { x: t.position.x, y: t.position.y, width: e, height: n };
}
function ku(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = ir(n);
    return Pu(e, o);
  });
}
function Lu(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = ir(n);
    return [
      { x: o.x, y: o.y },
      { x: o.x + o.width, y: o.y },
      { x: o.x + o.width, y: o.y + o.height },
      { x: o.x, y: o.y + o.height }
    ].every((r) => Go(r.x, r.y, e));
  });
}
function Mu(t, e) {
  return e.filter((n) => n.source === t || n.target === t);
}
function Ao(t, e, n) {
  const o = new Set(
    n.filter((i) => i.source === t).map((i) => i.target)
  );
  return e.filter((i) => o.has(i.id));
}
function Tu(t, e, n) {
  const o = new Set(
    n.filter((i) => i.target === t).map((i) => i.source)
  );
  return e.filter((i) => o.has(i.id));
}
function Au(t, e, n) {
  if (t === e) return !0;
  const o = /* @__PURE__ */ new Map();
  for (const s of n) {
    let a = o.get(s.source);
    a || (a = [], o.set(s.source, a)), a.push(s.target);
  }
  const i = [e], r = /* @__PURE__ */ new Set();
  for (; i.length > 0; ) {
    const s = i.pop();
    if (s === t) return !0;
    if (r.has(s)) continue;
    r.add(s);
    const a = o.get(s);
    if (a)
      for (const l of a)
        r.has(l) || i.push(l);
  }
  return !1;
}
function Nu(t, e, n, o = !1) {
  return n.some((i) => o ? i.source === t && i.target === e : i.source === t && i.target === e || i.source === e && i.target === t);
}
function $u(t, e, n) {
  const o = new Map(e.map((l) => [l.id, l])), i = new Set(
    n.map((l) => `${l.source}|${l.target}|${l.sourceHandle ?? ""}|${l.targetHandle ?? ""}`)
  ), r = [], s = /* @__PURE__ */ new Set();
  let a = 0;
  for (const l of t) {
    if (o.get(l)?.reconnectOnDelete === !1) continue;
    const d = n.filter(
      (u) => u.target === l && !t.has(u.source)
    ), h = n.filter(
      (u) => u.source === l && !t.has(u.target)
    );
    if (!(d.length === 0 || h.length === 0))
      for (const u of d)
        for (const f of h) {
          if (u.source === f.target) continue;
          const g = `${u.source}|${f.target}|${u.sourceHandle ?? ""}|${f.targetHandle ?? ""}`;
          if (i.has(g) || s.has(g)) continue;
          const p = {
            id: `reconnect-${u.source}-${f.target}-${a++}`,
            source: u.source,
            target: f.target,
            sourceHandle: u.sourceHandle,
            targetHandle: f.targetHandle
          };
          u.type && (p.type = u.type), u.animated !== void 0 && (p.animated = u.animated), u.style && (p.style = u.style), u.class && (p.class = u.class), u.markerEnd && (p.markerEnd = u.markerEnd), u.markerStart && (p.markerStart = u.markerStart), u.label && (p.label = u.label), s.add(g), r.push(p);
        }
  }
  return r;
}
function We(t, e, n) {
  return !(t.source === t.target || e.some(
    (i) => i.source === t.source && i.target === t.target && i.sourceHandle === t.sourceHandle && i.targetHandle === t.targetHandle
  ) || n?.preventCycles && Au(t.source, t.target, e));
}
const ot = "_flowHandleValidate";
function Iu(t) {
  t.directive(
    "flow-handle-validate",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      function s() {
        let a;
        try {
          a = o(n);
        } catch {
          const l = t.$data(e);
          l && typeof l[n] == "function" && (a = l[n]);
        }
        typeof a == "function" ? e[ot] = a : (delete e[ot], requestAnimationFrame(() => {
          const l = t.$data(e);
          l && typeof l[n] == "function" && (e[ot] = l[n]);
        }));
      }
      i(() => {
        s();
      }), r(() => {
        delete e[ot];
      });
    }
  );
}
const pt = "_flowHandleLimit";
function Du(t) {
  t.directive(
    "flow-handle-limit",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      i(() => {
        const s = Number(o(n));
        s > 0 ? e[pt] = s : delete e[pt];
      }), r(() => {
        delete e[pt];
      });
    }
  );
}
const rn = "_flowHandleConnectableStart", yt = "_flowHandleConnectableEnd";
function Ru(t) {
  t.directive(
    "flow-handle-connectable",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("start"), l = o.includes("end"), c = a || !a && !l, d = l || !a && !l;
      r(() => {
        const h = n ? !!i(n) : !0;
        c && (e[rn] = h), d && (e[yt] = h);
      }), s(() => {
        delete e[rn], delete e[yt];
      });
    }
  );
}
function dn(t, e, n = !0) {
  return e !== void 0 ? e : t.locked ? !1 : n;
}
function sr(t) {
  return dn(t, t.draggable);
}
function Hu(t) {
  return dn(t, t.deletable);
}
function nt(t) {
  return dn(t, t.connectable);
}
function No(t) {
  return dn(t, t.selectable);
}
function Oi(t) {
  return dn(t, t.resizable);
}
function $t(t, e, n, o, i, r, s) {
  const a = n - t, l = o - e, c = i - n, d = r - o;
  if (a === 0 && c === 0 || l === 0 && d === 0)
    return `L${n},${o}`;
  const h = Math.sqrt(a * a + l * l), u = Math.sqrt(c * c + d * d), f = Math.min(s, h / 2, u / 2), g = n - a / h * f, p = o - l / h * f, w = n + c / u * f, m = o + d / u * f;
  return `L${g},${p} Q${n},${o} ${w},${m}`;
}
function un({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = Math.abs(n - t) / 2, r = Math.abs(o - e) / 2;
  return {
    x: (t + n) / 2,
    y: (e + o) / 2,
    offsetX: i,
    offsetY: r
  };
}
function vn(t, e) {
  return t >= 0 ? 0.5 * t : e * 25 * Math.sqrt(-t);
}
function Fu({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  curvature: s = 0.25
}) {
  const a = n === "left" || n === "right", l = r === "left" || r === "right", c = a ? t + (n === "right" ? 1 : -1) * vn(
    n === "right" ? o - t : t - o,
    s
  ) : t, d = a ? e : e + (n === "bottom" ? 1 : -1) * vn(
    n === "bottom" ? i - e : e - i,
    s
  ), h = l ? o + (r === "right" ? 1 : -1) * vn(
    r === "right" ? t - o : o - t,
    s
  ) : o, u = l ? i : i + (r === "bottom" ? 1 : -1) * vn(
    r === "bottom" ? e - i : i - e,
    s
  );
  return [c, d, h, u];
}
function Bn(t) {
  const { sourceX: e, sourceY: n, targetX: o, targetY: i } = t, [r, s, a, l] = Fu(t), c = `M${e},${n} C${r},${s} ${a},${l} ${o},${i}`, { x: d, y: h, offsetX: u, offsetY: f } = un({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: h },
    labelOffsetX: u,
    labelOffsetY: f
  };
}
function sm({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = (t + n) / 2, r = `M${t},${e} C${i},${e} ${i},${o} ${n},${o}`, { x: s, y: a, offsetX: l, offsetY: c } = un({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: r,
    labelPosition: { x: s, y: a },
    labelOffsetX: l,
    labelOffsetY: c
  };
}
function Vi(t) {
  switch (t) {
    case "top":
    case "top-left":
    case "top-right":
      return { x: 0, y: -1 };
    case "bottom":
    case "bottom-left":
    case "bottom-right":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
  }
}
function zu(t, e, n, o, i, r, s) {
  const a = Vi(n), l = Vi(r), c = t + a.x * s, d = e + a.y * s, h = o + l.x * s, u = i + l.y * s, f = n === "left" || n === "right";
  if (f === (r === "left" || r === "right")) {
    const p = (c + h) / 2, w = (d + u) / 2;
    return f ? [
      [c, e],
      [p, e],
      [p, i],
      [h, i]
    ] : [
      [t, d],
      [t, w],
      [o, w],
      [o, u]
    ];
  }
  return f ? [
    [c, e],
    [o, e],
    [o, u]
  ] : [
    [t, d],
    [t, i],
    [h, i]
  ];
}
function an({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  borderRadius: s = 5,
  offset: a = 10
}) {
  const l = zu(
    t,
    e,
    n,
    o,
    i,
    r,
    a
  );
  let c = `M${t},${e}`;
  for (let g = 0; g < l.length; g++) {
    const [p, w] = l[g];
    if (s > 0 && g > 0 && g < l.length - 1) {
      const [m, C] = g === 1 ? [t, e] : l[g - 1], [S, b] = l[g + 1];
      c += ` ${$t(m, C, p, w, S, b, s)}`;
    } else
      c += ` L${p},${w}`;
  }
  c += ` L${o},${i}`;
  const { x: d, y: h, offsetX: u, offsetY: f } = un({ sourceX: t, sourceY: e, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: h },
    labelOffsetX: u,
    labelOffsetY: f
  };
}
function Ou(t) {
  return an({ ...t, borderRadius: 0 });
}
function rr({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = `M${t},${e} L${n},${o}`, { x: r, y: s, offsetX: a, offsetY: l } = un({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: i,
    labelPosition: { x: r, y: s },
    labelOffsetX: a,
    labelOffsetY: l
  };
}
const Qe = 40;
function Vu(t, e, n, o) {
  let i = 0, r = 0;
  const s = t - n.left, a = n.right - t, l = e - n.top, c = n.bottom - e;
  return s < Qe && s >= 0 ? i = -o * (1 - s / Qe) : a < Qe && a >= 0 && (i = o * (1 - a / Qe)), l < Qe && l >= 0 ? r = -o * (1 - l / Qe) : c < Qe && c >= 0 && (r = o * (1 - c / Qe)), { dx: i, dy: r };
}
function ar(t) {
  const { container: e, speed: n, onPan: o } = t;
  let i = null, r = 0, s = 0, a = !1;
  function l() {
    if (!a)
      return;
    const c = e.getBoundingClientRect(), { dx: d, dy: h } = Vu(r, s, c, n);
    if ((d !== 0 || h !== 0) && o(d, h) === !0) {
      a = !1, i = null;
      return;
    }
    i = requestAnimationFrame(l);
  }
  return {
    start() {
      a || t.isLocked?.() || (a = !0, i = requestAnimationFrame(l));
    },
    stop() {
      a = !1, i !== null && (cancelAnimationFrame(i), i = null);
    },
    updatePointer(c, d) {
      r = c, s = d;
    },
    destroy() {
      this.stop();
    }
  };
}
function kt(t) {
  const e = t.connectionLineType ?? "straight", o = {
    stroke: (t.invalid ? (t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-connection-line-invalid").trim() : "") || Zs : null) ?? t.connectionLineStyle?.stroke ?? ((t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-edge-stroke-selected").trim() : "") || tn),
    strokeWidth: t.connectionLineStyle?.strokeWidth ?? Number(ou),
    strokeDasharray: t.connectionLineStyle?.strokeDasharray ?? iu
  }, i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  i.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:1000;";
  let r = null;
  function s(l) {
    const c = {
      ...l,
      connectionLineType: e,
      connectionLineStyle: o
    };
    if (t.connectionLine) {
      r && r.remove(), r = t.connectionLine(c), i.appendChild(r);
      return;
    }
    r || (r = document.createElementNS("http://www.w3.org/2000/svg", "path"), r.setAttribute("fill", "none"), i.appendChild(r)), r.setAttribute("stroke", o.stroke), r.setAttribute("stroke-width", String(o.strokeWidth)), r.setAttribute("stroke-dasharray", o.strokeDasharray);
    const { fromX: d, fromY: h, toX: u, toY: f } = l;
    let g;
    switch (e) {
      case "bezier": {
        g = Bn({ sourceX: d, sourceY: h, targetX: u, targetY: f }).path;
        break;
      }
      case "smoothstep": {
        g = an({ sourceX: d, sourceY: h, targetX: u, targetY: f }).path;
        break;
      }
      case "step": {
        g = Ou({ sourceX: d, sourceY: h, targetX: u, targetY: f }).path;
        break;
      }
      default: {
        g = rr({ sourceX: d, sourceY: h, targetX: u, targetY: f }).path;
        break;
      }
    }
    r.setAttribute("d", g);
  }
  function a() {
    i.remove();
  }
  return { svg: i, update: s, destroy: a };
}
function jt(t) {
  if (t.connectionSnapRadius <= 0)
    return { element: null, position: t.cursorFlowPos };
  const e = t.connectionMode === "loose" ? "[data-flow-handle-type]" : `[data-flow-handle-type="${t.handleType}"]`, n = t.containerEl.querySelectorAll(e);
  let o = null, i = t.cursorFlowPos, r = t.connectionSnapRadius;
  return n.forEach((s) => {
    const a = s, l = a.closest("[x-flow-node]");
    if (!l || l.dataset.flowNodeId === t.excludeNodeId || t.targetNodeId && l.dataset.flowNodeId !== t.targetNodeId) return;
    const c = l.dataset.flowNodeId;
    if (c) {
      const g = t.getNode(c);
      if (g && !nt(g)) return;
    }
    const d = t.handleType === "target" ? yt : rn;
    if (a[d] === !1) return;
    const h = a.getBoundingClientRect();
    if (h.width === 0 && h.height === 0) return;
    const u = t.toFlowPosition(
      h.left + h.width / 2,
      h.top + h.height / 2
    ), f = Math.sqrt(
      (t.cursorFlowPos.x - u.x) ** 2 + (t.cursorFlowPos.y - u.y) ** 2
    );
    f < r && (r = f, o = a, i = u);
  }), { element: o, position: i };
}
function Xn(t, e, n, o) {
  if (e._config?.autoPanOnConnect === !1) return null;
  const i = ar({
    container: t,
    speed: e._config?.autoPanSpeed ?? 15,
    onPan(r, s) {
      const a = { x: e.viewport.x, y: e.viewport.y };
      e._panZoom?.setViewport({
        x: e.viewport.x - r,
        y: e.viewport.y - s,
        zoom: e.viewport.zoom
      });
      const l = a.x - e.viewport.x, c = a.y - e.viewport.y;
      return l === 0 && c === 0;
    }
  });
  return i.updatePointer(n, o), i.start(), i;
}
let _n = 0;
function Fe(t, e) {
  const n = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (n) {
    const i = n.querySelector(
      `[data-flow-handle-id="${CSS.escape(e.sourceHandle ?? "source")}"]`
    );
    if (i?.[ot] && !i[ot](e))
      return !1;
  }
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (o) {
    const i = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(e.targetHandle ?? "target")}"]`
    );
    if (i?.[ot] && !i[ot](e))
      return !1;
  }
  return !0;
}
function ze(t, e, n) {
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (o) {
    const r = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(e.sourceHandle ?? "source")}"]`
    );
    if (r?.[pt] && n.filter(
      (a) => a.source === e.source && (a.sourceHandle ?? "source") === (e.sourceHandle ?? "source")
    ).length >= r[pt])
      return !1;
  }
  const i = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (i) {
    const r = i.querySelector(
      `[data-flow-handle-id="${CSS.escape(e.targetHandle ?? "target")}"]`
    );
    if (r?.[pt] && n.filter(
      (a) => a.target === e.target && (a.targetHandle ?? "target") === (e.targetHandle ?? "target")
    ).length >= r[pt])
      return !1;
  }
  return !0;
}
function Ut(t, e, n, o, i) {
  const r = i ? o.edges.filter((a) => a.id !== i) : o.edges, s = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const a of s) {
    const c = a.closest("[x-flow-node]")?.dataset.flowNodeId;
    if (!c) continue;
    const d = a.dataset.flowHandleId ?? "target";
    if (a[yt] === !1) {
      a.classList.add("flow-handle-invalid"), a.classList.remove("flow-handle-valid", "flow-handle-limit-reached");
      continue;
    }
    const h = {
      source: e,
      sourceHandle: n,
      target: c,
      targetHandle: d
    }, f = o.getNode(c)?.connectable !== !1 && We(h, r, { preventCycles: o._config?.preventCycles }), g = f && ze(t, h, r);
    g && Fe(t, h) && (!o._config?.isValidConnection || o._config.isValidConnection(h)) ? (a.classList.add("flow-handle-valid"), a.classList.remove("flow-handle-invalid", "flow-handle-limit-reached")) : (a.classList.add("flow-handle-invalid"), a.classList.remove("flow-handle-valid"), f && !g ? a.classList.add("flow-handle-limit-reached") : a.classList.remove("flow-handle-limit-reached"));
  }
}
function Se(t) {
  const e = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const n of e)
    n.classList.remove("flow-handle-valid", "flow-handle-invalid", "flow-handle-limit-reached");
}
function Bu(t) {
  t.directive(
    "flow-handle",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = n === "source" ? "source" : "target", c = o.includes("top"), d = o.includes("bottom"), h = o.includes("left"), u = o.includes("right"), f = c || d || h || u;
      let g;
      c && h ? g = "top-left" : c && u ? g = "top-right" : d && h ? g = "bottom-left" : d && u ? g = "bottom-right" : c ? g = "top" : u ? g = "right" : d ? g = "bottom" : h ? g = "left" : g = e.getAttribute("data-flow-handle-position") ?? (l === "source" ? "bottom" : "top");
      let p, w = !1;
      if (i) {
        const S = r(i);
        S && typeof S == "object" && !Array.isArray(S) ? (p = S.id || e.getAttribute("data-flow-handle-id") || l, S.position && (g = S.position, w = !0)) : p = S || e.getAttribute("data-flow-handle-id") || l;
      } else
        p = e.getAttribute("data-flow-handle-id") || l;
      if (o.includes("hidden") && (e.style.display = "none"), e.dataset.flowHandleType = l, e.dataset.flowHandlePosition = g, e.dataset.flowHandleId = p, f && (e.dataset.flowHandleExplicit = "true"), w && i && (e.dataset.flowHandleExplicit = "true", s(() => {
        const S = r(i);
        S && typeof S == "object" && !Array.isArray(S) && S.position && (e.dataset.flowHandlePosition = S.position);
      })), !f && !w) {
        const S = () => {
          const D = e.closest("[x-flow-node]")?.dataset.flowNodeId;
          if (!D) return;
          const M = e.closest("[x-data]");
          return M ? t.$data(M)?.getNode?.(D) : void 0;
        };
        s(() => {
          const b = S();
          if (!b) return;
          const D = l === "source" ? b.sourcePosition : b.targetPosition;
          D && (e.dataset.flowHandlePosition = D);
        });
      }
      e.classList.add("flow-handle", `flow-handle-${l}`);
      const m = () => {
        const S = e.closest("[x-flow-node]");
        return S ? S.getAttribute("data-flow-node-id") ?? null : null;
      }, C = () => {
        const S = e.closest("[x-data]");
        return S ? t.$data(S) : null;
      };
      if (l === "source") {
        let S = null;
        const b = (T) => {
          T.preventDefault(), T.stopPropagation();
          const v = C(), P = e.closest("[x-flow-node]");
          if (!v || !P || v._animationLocked) return;
          const $ = P.dataset.flowNodeId;
          if (!$) return;
          const x = v.getNode($);
          if (x && !nt(x) || e[rn] === !1) return;
          const y = T.clientX, q = T.clientY;
          let _ = !1;
          if (v.pendingConnection && v._config?.connectOnClick !== !1) {
            v._emit("connect-end", {
              connection: null,
              source: v.pendingConnection.source,
              sourceHandle: v.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), v.pendingConnection = null, v._container?.classList.remove("flow-connecting");
            const X = e.closest(".flow-container");
            X && Se(X);
          }
          let L = null, A = null, O = null, E = null, k = null;
          const N = v._config?.connectionSnapRadius ?? 20, U = e.closest(".flow-container");
          let J = 0, oe = 0, G = !1, se = /* @__PURE__ */ new Map();
          const le = () => {
            if (_ = !0, B("connection", `Connection drag started from node "${$}" handle "${p}"`), v._emit("connect-start", { source: $, sourceHandle: p }), !U) return;
            A = kt({
              connectionLineType: v._config?.connectionLineType,
              connectionLineStyle: v._config?.connectionLineStyle,
              connectionLine: v._config?.connectionLine,
              containerEl: U
            }), L = A.svg;
            const X = e.getBoundingClientRect(), W = U.getBoundingClientRect(), I = v.viewport?.zoom || 1, j = v.viewport?.x || 0, ee = v.viewport?.y || 0;
            J = (X.left + X.width / 2 - W.left - j) / I, oe = (X.top + X.height / 2 - W.top - ee) / I, A.update({ fromX: J, fromY: oe, toX: J, toY: oe, source: $, sourceHandle: p });
            const V = U.querySelector(".flow-viewport");
            if (V && V.appendChild(L), v.pendingConnection = {
              source: $,
              sourceHandle: p,
              position: { x: J, y: oe }
            }, E = Xn(U, v, y, q), Ut(U, $, p, v), v._config?.onEdgeDrop) {
              const K = v._config.edgeDropPreview, F = K ? K({ source: $, sourceHandle: p }) : "New Node";
              if (F !== null) {
                k = document.createElement("div"), k.className = "flow-ghost-node";
                const Z = document.createElement("div");
                if (Z.className = "flow-ghost-handle", k.appendChild(Z), typeof F == "string") {
                  const ne = document.createElement("span");
                  ne.textContent = F, k.appendChild(ne);
                } else
                  k.appendChild(F);
                k.style.left = `${J}px`, k.style.top = `${oe}px`;
                const Y = U.querySelector(".flow-viewport");
                Y && Y.appendChild(k);
              }
            }
          }, ce = () => {
            const X = [...v.selectedNodes], W = [], I = U.getBoundingClientRect(), j = v.viewport?.zoom || 1, ee = v.viewport?.x || 0, V = v.viewport?.y || 0;
            for (const K of X) {
              if (K === $) continue;
              const F = U?.querySelector(`[data-flow-node-id="${CSS.escape(K)}"]`)?.querySelector('[data-flow-handle-type="source"]');
              if (!F) continue;
              const Z = F.getBoundingClientRect();
              W.push({
                nodeId: K,
                handleId: F.dataset.flowHandleId ?? "source",
                pos: {
                  x: (Z.left + Z.width / 2 - I.left - ee) / j,
                  y: (Z.top + Z.height / 2 - I.top - V) / j
                }
              });
            }
            return W;
          }, te = (X) => {
            G = !0, A && (se.set($, {
              line: A,
              sourceNodeId: $,
              sourceHandleId: p,
              sourcePos: { x: J, y: oe },
              valid: !0
            }), A = null);
            const W = ce(), I = U.querySelector(".flow-viewport");
            for (const j of W) {
              const ee = kt({
                connectionLineType: v._config?.connectionLineType,
                connectionLineStyle: v._config?.connectionLineStyle,
                connectionLine: v._config?.connectionLine,
                containerEl: U
              });
              ee.update({
                fromX: j.pos.x,
                fromY: j.pos.y,
                toX: X.x,
                toY: X.y,
                source: j.nodeId,
                sourceHandle: j.handleId
              }), I && I.appendChild(ee.svg), se.set(j.nodeId, {
                line: ee,
                sourceNodeId: j.nodeId,
                sourceHandleId: j.handleId,
                sourcePos: j.pos,
                valid: !0
              });
            }
          }, R = (X) => {
            if (!_) {
              const j = X.clientX - y, ee = X.clientY - q;
              if (Math.abs(j) >= Ln || Math.abs(ee) >= Ln) {
                if (le(), v._config?.multiConnect && v.selectedNodes.size > 1 && v.selectedNodes.has($)) {
                  const V = v.screenToFlowPosition(X.clientX, X.clientY);
                  te(V);
                }
              } else
                return;
            }
            const W = v.screenToFlowPosition(X.clientX, X.clientY);
            if (G) {
              const j = jt({
                containerEl: U,
                handleType: "target",
                excludeNodeId: $,
                cursorFlowPos: W,
                connectionSnapRadius: N,
                getNode: (F) => v.getNode(F),
                toFlowPosition: (F, Z) => v.screenToFlowPosition(F, Z),
                connectionMode: v._config?.connectionMode
              });
              j.element !== O && (O?.classList.remove("flow-handle-active"), j.element?.classList.add("flow-handle-active"), O = j.element);
              const V = j.element?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, K = j.element?.dataset.flowHandleId ?? "target", ie = v._config?.connectionLineStyle?.stroke ?? (getComputedStyle(U).getPropertyValue("--flow-edge-stroke-selected").trim() || tn);
              for (const F of se.values())
                if (F.line.update({
                  fromX: F.sourcePos.x,
                  fromY: F.sourcePos.y,
                  toX: j.position.x,
                  toY: j.position.y,
                  source: F.sourceNodeId,
                  sourceHandle: F.sourceHandleId
                }), j.element && V) {
                  const Z = {
                    source: F.sourceNodeId,
                    sourceHandle: F.sourceHandleId,
                    target: V,
                    targetHandle: K
                  }, ae = v.getNode(V)?.connectable !== !1 && F.sourceNodeId !== V && We(Z, v.edges, { preventCycles: v._config?.preventCycles }) && ze(U, Z, v.edges) && Fe(U, Z) && (!v._config?.isValidConnection || v._config.isValidConnection(Z));
                  F.valid = ae;
                  const re = F.line.svg.querySelector("path");
                  if (re)
                    if (ae)
                      re.setAttribute("stroke", ie);
                    else {
                      const fe = getComputedStyle(U).getPropertyValue("--flow-connection-line-invalid").trim() || Zs;
                      re.setAttribute("stroke", fe);
                    }
                } else {
                  F.valid = !0;
                  const Z = F.line.svg.querySelector("path");
                  Z && Z.setAttribute("stroke", ie);
                }
              v.pendingConnection = { ...v.pendingConnection, position: j.position }, E?.updatePointer(X.clientX, X.clientY);
              return;
            }
            const I = jt({
              containerEl: U,
              handleType: "target",
              excludeNodeId: $,
              cursorFlowPos: W,
              connectionSnapRadius: N,
              getNode: (j) => v.getNode(j),
              toFlowPosition: (j, ee) => v.screenToFlowPosition(j, ee)
            });
            I.element !== O && (O?.classList.remove("flow-handle-active"), I.element?.classList.add("flow-handle-active"), O = I.element), k ? I.element ? (k.style.display = "none", A?.update({ fromX: J, fromY: oe, toX: I.position.x, toY: I.position.y, source: $, sourceHandle: p })) : (k.style.display = "", k.style.left = `${W.x}px`, k.style.top = `${W.y}px`, A?.update({ fromX: J, fromY: oe, toX: W.x, toY: W.y, source: $, sourceHandle: p })) : A?.update({ fromX: J, fromY: oe, toX: I.position.x, toY: I.position.y, source: $, sourceHandle: p }), v.pendingConnection = { ...v.pendingConnection, position: I.position }, E?.updatePointer(X.clientX, X.clientY);
          }, Q = (X) => {
            if (E?.stop(), E = null, document.removeEventListener("pointermove", R), document.removeEventListener("pointerup", Q), S = null, G) {
              const ee = v.screenToFlowPosition(X.clientX, X.clientY);
              let V = O;
              V || (V = document.elementFromPoint(X.clientX, X.clientY)?.closest('[data-flow-handle-type="target"]'));
              const ie = V?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, F = V?.dataset.flowHandleId ?? "target", Z = [], Y = [], ne = [], H = [];
              if (V && ie) {
                const z = v.getNode(ie);
                for (const ae of se.values()) {
                  const re = {
                    source: ae.sourceNodeId,
                    sourceHandle: ae.sourceHandleId,
                    target: ie,
                    targetHandle: F
                  };
                  if (z?.connectable !== !1 && ae.sourceNodeId !== ie && We(re, v.edges, { preventCycles: v._config?.preventCycles }) && ze(U, re, v.edges) && Fe(U, re) && (!v._config?.isValidConnection || v._config.isValidConnection(re))) {
                    const be = `e-${ae.sourceNodeId}-${ie}-${Date.now()}-${_n++}`;
                    Z.push({ id: be, ...re }), Y.push(re), H.push(ae);
                  } else
                    ne.push(ae);
                }
              } else
                ne.push(...se.values());
              for (const z of H)
                z.line.destroy();
              if (Z.length > 0) {
                v.addEdges(Z);
                for (const z of Y)
                  v._emit("connect", { connection: z });
                v._emit("multi-connect", { connections: Y });
              }
              ne.length > 0 && setTimeout(() => {
                for (const z of ne)
                  z.line.destroy();
              }, 100), O?.classList.remove("flow-handle-active"), v._emit("connect-end", {
                connection: Y.length > 0 ? Y[0] : null,
                source: $,
                sourceHandle: p,
                position: ee
              }), se.clear(), G = !1, Se(U), v.pendingConnection = null, v._container?.classList.remove("flow-connecting");
              return;
            }
            if (!_) {
              v._config?.connectOnClick !== !1 && (B("connection", `Click-to-connect started from node "${$}" handle "${p}"`), v._emit("connect-start", { source: $, sourceHandle: p }), v.pendingConnection = {
                source: $,
                sourceHandle: p,
                position: { x: 0, y: 0 }
              }, v._container?.classList.add("flow-connecting"), Ut(U, $, p, v));
              return;
            }
            A?.destroy(), A = null, k?.remove(), k = null, O?.classList.remove("flow-handle-active"), Se(U);
            const W = v.screenToFlowPosition(X.clientX, X.clientY), I = { source: $, sourceHandle: p, position: W };
            let j = O;
            if (j || (j = document.elementFromPoint(X.clientX, X.clientY)?.closest('[data-flow-handle-type="target"]')), j) {
              const V = j.closest("[x-flow-node]")?.dataset.flowNodeId, K = j.dataset.flowHandleId ?? "target";
              if (V) {
                if (j[yt] === !1) {
                  B("connection", "Connection rejected (handle not connectable end)"), v._emit("connect-end", { connection: null, ...I }), v.pendingConnection = null;
                  return;
                }
                const ie = v.getNode(V);
                if (ie && !nt(ie)) {
                  B("connection", `Connection rejected (target "${V}" not connectable)`), v._emit("connect-end", { connection: null, ...I }), v.pendingConnection = null;
                  return;
                }
                const F = {
                  source: $,
                  sourceHandle: p,
                  target: V,
                  targetHandle: K
                };
                if (We(F, v.edges, { preventCycles: v._config?.preventCycles })) {
                  if (!ze(U, F, v.edges)) {
                    B("connection", "Connection rejected (handle limit)", F), v._emit("connect-end", { connection: null, ...I }), v.pendingConnection = null;
                    return;
                  }
                  if (!Fe(U, F)) {
                    B("connection", "Connection rejected (per-handle validator)", F), v._emit("connect-end", { connection: null, ...I }), v.pendingConnection = null;
                    return;
                  }
                  if (v._config?.isValidConnection && !v._config.isValidConnection(F)) {
                    B("connection", "Connection rejected (custom validator)", F), v._emit("connect-end", { connection: null, ...I }), v.pendingConnection = null;
                    return;
                  }
                  const Z = `e-${$}-${V}-${Date.now()}-${_n++}`;
                  v.addEdges({ id: Z, ...F }), B("connection", `Connection created: ${$} → ${V}`, F), v._emit("connect", { connection: F }), v._emit("connect-end", { connection: F, ...I });
                } else
                  B("connection", "Connection rejected (invalid)", F), v._emit("connect-end", { connection: null, ...I });
              } else
                v._emit("connect-end", { connection: null, ...I });
            } else if (v._config?.onEdgeDrop) {
              const ee = {
                x: W.x - ye / 2,
                y: W.y - we / 2
              }, V = v._config.onEdgeDrop({
                source: $,
                sourceHandle: p,
                position: ee
              });
              if (V) {
                const K = {
                  source: $,
                  sourceHandle: p,
                  target: V.id,
                  targetHandle: "target"
                };
                if (!ze(U, K, v.edges))
                  B("connection", "Edge drop: connection rejected (handle limit)"), v._emit("connect-end", { connection: null, ...I });
                else if (!Fe(U, K))
                  B("connection", "Edge drop: connection rejected (per-handle validator)"), v._emit("connect-end", { connection: null, ...I });
                else if (!v._config.isValidConnection || v._config.isValidConnection(K)) {
                  v.addNodes(V);
                  const ie = `e-${$}-${V.id}-${Date.now()}-${_n++}`;
                  v.addEdges({ id: ie, ...K }), B("connection", `Edge drop: created node "${V.id}" and edge`, K), v._emit("connect", { connection: K }), v._emit("connect-end", { connection: K, ...I });
                } else
                  B("connection", "Edge drop: connection rejected by validator"), v._emit("connect-end", { connection: null, ...I });
              } else
                B("connection", "Edge drop: callback returned null"), v._emit("connect-end", { connection: null, ...I });
            } else
              B("connection", "Connection cancelled (no target)"), v._emit("connect-end", { connection: null, ...I });
            v.pendingConnection = null;
          };
          document.addEventListener("pointermove", R), document.addEventListener("pointerup", Q), document.addEventListener("pointercancel", Q), S = () => {
            document.removeEventListener("pointermove", R), document.removeEventListener("pointerup", Q), document.removeEventListener("pointercancel", Q), E?.stop(), A?.destroy(), A = null, k?.remove(), k = null;
            for (const X of se.values())
              X.line.destroy();
            se.clear(), G = !1, O?.classList.remove("flow-handle-active"), Se(U), v.pendingConnection = null, v._container?.classList.remove("flow-connecting");
          };
        };
        e.addEventListener("pointerdown", b);
        const D = () => {
          const T = C();
          if (!T?._pendingReconnection || T._pendingReconnection.draggedEnd !== "source") return;
          const v = m();
          if (v) {
            const P = T.getNode(v);
            if (P && !nt(P)) return;
          }
          e[rn] !== !1 && e.classList.add("flow-handle-active");
        }, M = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", D), e.addEventListener("pointerleave", M), a(() => {
          S?.(), e.removeEventListener("pointerdown", b), e.removeEventListener("pointerenter", D), e.removeEventListener("pointerleave", M), e.classList.remove("flow-handle", `flow-handle-${l}`);
        });
      } else {
        const S = () => {
          const v = C();
          if (!v?.pendingConnection) return;
          const P = m();
          if (P) {
            const $ = v.getNode(P);
            if ($ && !nt($)) return;
          }
          e[yt] !== !1 && e.classList.add("flow-handle-active");
        }, b = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", S), e.addEventListener("pointerleave", b);
        const D = (v) => {
          const P = C();
          if (!P?.pendingConnection || P._config?.connectOnClick === !1) return;
          v.preventDefault(), v.stopPropagation();
          const $ = m();
          if (!$) return;
          if (e[yt] === !1) {
            B("connection", "Click-to-connect rejected (handle not connectable end)"), P._emit("connect-end", { connection: null, source: P.pendingConnection.source, sourceHandle: P.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), P.pendingConnection = null, P._container?.classList.remove("flow-connecting");
            const L = e.closest(".flow-container");
            L && Se(L);
            return;
          }
          const x = P.getNode($);
          if (x && !nt(x)) {
            B("connection", `Click-to-connect rejected (target "${$}" not connectable)`), P._emit("connect-end", { connection: null, source: P.pendingConnection.source, sourceHandle: P.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), P.pendingConnection = null, P._container?.classList.remove("flow-connecting");
            const L = e.closest(".flow-container");
            L && Se(L);
            return;
          }
          const y = {
            source: P.pendingConnection.source,
            sourceHandle: P.pendingConnection.sourceHandle,
            target: $,
            targetHandle: p
          }, q = { source: P.pendingConnection.source, sourceHandle: P.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };
          if (We(y, P.edges, { preventCycles: P._config?.preventCycles })) {
            const L = e.closest(".flow-container");
            if (L && !ze(L, y, P.edges)) {
              B("connection", "Click-to-connect rejected (handle limit)", y), P._emit("connect-end", { connection: null, ...q }), P.pendingConnection = null, P._container?.classList.remove("flow-connecting"), Se(L);
              return;
            }
            if (L && !Fe(L, y)) {
              B("connection", "Click-to-connect rejected (per-handle validator)", y), P._emit("connect-end", { connection: null, ...q }), P.pendingConnection = null, P._container?.classList.remove("flow-connecting"), L && Se(L);
              return;
            }
            if (P._config?.isValidConnection && !P._config.isValidConnection(y)) {
              B("connection", "Click-to-connect rejected (custom validator)", y), P._emit("connect-end", { connection: null, ...q }), P.pendingConnection = null, P._container?.classList.remove("flow-connecting"), L && Se(L);
              return;
            }
            const A = `e-${y.source}-${y.target}-${Date.now()}-${_n++}`;
            P.addEdges({ id: A, ...y }), B("connection", `Click-to-connect: ${y.source} → ${y.target}`, y), P._emit("connect", { connection: y }), P._emit("connect-end", { connection: y, ...q });
          } else
            B("connection", "Click-to-connect rejected (invalid)", y), P._emit("connect-end", { connection: null, ...q });
          P.pendingConnection = null, P._container?.classList.remove("flow-connecting");
          const _ = e.closest(".flow-container");
          _ && Se(_);
        };
        e.addEventListener("click", D);
        let M = null;
        const T = (v) => {
          if (v.button !== 0) return;
          const P = C(), $ = m();
          if (!P || !$ || P._animationLocked || P._config?.edgesReconnectable === !1 || P._pendingReconnection) return;
          const x = P.edges.filter(
            (F) => F.target === $ && (F.targetHandle ?? "target") === p
          );
          if (x.length === 0) return;
          const y = x.find((F) => F.selected) ?? (x.length === 1 ? x[0] : null);
          if (!y) return;
          const q = y.reconnectable ?? !0;
          if (q === !1 || q === "source") return;
          v.preventDefault(), v.stopPropagation();
          const _ = v.clientX, L = v.clientY;
          let A = !1, O = !1, E = null;
          const k = P._config?.connectionSnapRadius ?? 20, N = e.closest(".flow-container");
          if (!N) return;
          const U = N.querySelector(
            `[data-flow-node-id="${CSS.escape(y.source)}"]`
          ), J = y.sourceHandle ? `[data-flow-handle-id="${CSS.escape(y.sourceHandle)}"]` : '[data-flow-handle-type="source"]', oe = U?.querySelector(J), G = N.getBoundingClientRect(), se = P.viewport?.zoom || 1, le = P.viewport?.x || 0, ce = P.viewport?.y || 0;
          let te, R;
          if (oe) {
            const F = oe.getBoundingClientRect();
            te = (F.left + F.width / 2 - G.left - le) / se, R = (F.top + F.height / 2 - G.top - ce) / se;
          } else {
            const F = P.getNode(y.source);
            if (!F) return;
            const Z = F.dimensions?.width ?? ye, Y = F.dimensions?.height ?? we;
            te = F.position.x + Z / 2, R = F.position.y + Y;
          }
          let Q = null, X = null, W = null, I = _, j = L;
          const ee = () => {
            A = !0;
            const F = N.querySelector(
              `[data-flow-edge-id="${y.id}"]`
            );
            F && F.classList.add("flow-edge-reconnecting"), P._emit("reconnect-start", { edge: y, handleType: "target" }), B("reconnect", `Reconnection drag started from target handle on edge "${y.id}"`), X = kt({
              connectionLineType: P._config?.connectionLineType,
              connectionLineStyle: P._config?.connectionLineStyle,
              connectionLine: P._config?.connectionLine,
              containerEl: N
            }), Q = X.svg;
            const Z = P.screenToFlowPosition(_, L);
            X.update({
              fromX: te,
              fromY: R,
              toX: Z.x,
              toY: Z.y,
              source: y.source,
              sourceHandle: y.sourceHandle
            });
            const Y = N.querySelector(".flow-viewport");
            Y && Y.appendChild(Q), P.pendingConnection = {
              source: y.source,
              sourceHandle: y.sourceHandle,
              position: Z
            }, P._pendingReconnection = {
              edge: y,
              draggedEnd: "target",
              anchorPosition: { x: te, y: R },
              position: Z
            }, W = Xn(N, P, I, j), Ut(N, y.source, y.sourceHandle ?? "source", P, y.id);
          }, V = (F) => {
            if (I = F.clientX, j = F.clientY, !A) {
              Math.sqrt(
                (F.clientX - _) ** 2 + (F.clientY - L) ** 2
              ) >= Ln && ee();
              return;
            }
            const Z = P.screenToFlowPosition(F.clientX, F.clientY), Y = jt({
              containerEl: N,
              handleType: "target",
              excludeNodeId: y.source,
              cursorFlowPos: Z,
              connectionSnapRadius: k,
              getNode: (ne) => P.getNode(ne),
              toFlowPosition: (ne, H) => P.screenToFlowPosition(ne, H)
            });
            Y.element !== E && (E?.classList.remove("flow-handle-active"), Y.element?.classList.add("flow-handle-active"), E = Y.element), X?.update({
              fromX: te,
              fromY: R,
              toX: Y.position.x,
              toY: Y.position.y,
              source: y.source,
              sourceHandle: y.sourceHandle
            }), P.pendingConnection && (P.pendingConnection = {
              ...P.pendingConnection,
              position: Y.position
            }), P._pendingReconnection && (P._pendingReconnection = {
              ...P._pendingReconnection,
              position: Y.position
            }), W?.updatePointer(F.clientX, F.clientY);
          }, K = () => {
            if (O) return;
            O = !0, document.removeEventListener("pointermove", V), document.removeEventListener("pointerup", ie), document.removeEventListener("pointercancel", ie), W?.stop(), W = null, X?.destroy(), X = null, Q = null, E?.classList.remove("flow-handle-active"), M = null;
            const F = N.querySelector(
              `[data-flow-edge-id="${y.id}"]`
            );
            F && F.classList.remove("flow-edge-reconnecting"), Se(N), P.pendingConnection = null, P._pendingReconnection = null;
          }, ie = (F) => {
            if (!A) {
              K();
              return;
            }
            let Z = E;
            Z || (Z = document.elementFromPoint(F.clientX, F.clientY)?.closest('[data-flow-handle-type="target"]'));
            let Y = !1;
            if (Z) {
              const H = Z.closest("[x-flow-node]")?.dataset.flowNodeId, z = Z.dataset.flowHandleId;
              if (H && P.getNode(H)?.connectable !== !1) {
                const re = {
                  source: y.source,
                  sourceHandle: y.sourceHandle,
                  target: H,
                  targetHandle: z
                }, fe = P.edges.filter(
                  (pe) => pe.id !== y.id
                );
                if (We(re, fe, { preventCycles: P._config?.preventCycles })) {
                  if (!ze(N, re, fe))
                    B("reconnect", "Reconnection rejected (handle limit)", re);
                  else if (!Fe(N, re))
                    B("reconnect", "Reconnection rejected (per-handle validator)", re);
                  else if (!P._config?.isValidConnection || P._config.isValidConnection(re)) {
                    const pe = { ...y };
                    P._captureHistory?.(), y.target = re.target, y.targetHandle = re.targetHandle, Y = !0, B("reconnect", `Edge "${y.id}" reconnected (target)`, re), P._emit("reconnect", { oldEdge: pe, newConnection: re });
                  }
                }
              }
            }
            Y || B("reconnect", `Edge "${y.id}" reconnection cancelled — snapping back`), P._emit("reconnect-end", { edge: y, successful: Y }), K();
          };
          document.addEventListener("pointermove", V), document.addEventListener("pointerup", ie), document.addEventListener("pointercancel", ie), M = K;
        };
        e.addEventListener("pointerdown", T), a(() => {
          M?.(), e.removeEventListener("pointerdown", T), e.removeEventListener("pointerenter", S), e.removeEventListener("pointerleave", b), e.removeEventListener("click", D), e.classList.remove("flow-handle", `flow-handle-${l}`, "flow-handle-active");
        });
      }
    }
  );
}
const Bi = {
  delete: ["Delete", "Backspace"],
  selectionBox: "Shift",
  multiSelect: "Shift",
  moveNodes: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
  moveStep: 5,
  moveStepModifier: "Shift",
  moveStepMultiplier: 4,
  copy: "c",
  paste: "v",
  cut: "x",
  undo: "z",
  redo: "z",
  escape: "Escape",
  selectionModeToggle: "Alt",
  selectionToolToggle: "l"
};
function Xu(t) {
  if (!t) return { ...Bi };
  const e = { ...Bi };
  for (const n of Object.keys(t))
    n in t && (e[n] = t[n]);
  return e;
}
function He(t, e) {
  if (e == null) return !1;
  const n = t.length === 1 ? t.toLowerCase() : t;
  return Array.isArray(e) ? e.some((o) => (o.length === 1 ? o.toLowerCase() : o) === n) : (e.length === 1 ? e.toLowerCase() : e) === n;
}
function it(t, e) {
  if (e == null) return !1;
  switch (e) {
    case "Shift":
      return t.shiftKey;
    case "Control":
      return t.ctrlKey;
    case "Meta":
      return t.metaKey;
    case "Alt":
      return t.altKey;
    default:
      return !1;
  }
}
function Yu(t, e, n = {}) {
  const o = n.duration ?? 500, i = n.moveThreshold ?? 10;
  let r = null, s = 0, a = 0, l = null;
  function c() {
    r !== null && (clearTimeout(r), r = null), l = null, document.removeEventListener("pointermove", d), document.removeEventListener("pointerup", c), document.removeEventListener("pointercancel", c);
  }
  function d(u) {
    const f = u.clientX - s, g = u.clientY - a;
    f * f + g * g > i * i && c();
  }
  function h(u) {
    c(), s = u.clientX, a = u.clientY, l = u, document.addEventListener("pointermove", d), document.addEventListener("pointerup", c), document.addEventListener("pointercancel", c), r = setTimeout(() => {
      const f = l;
      c(), f && e(f);
    }, o);
  }
  return t.addEventListener("pointerdown", h), () => {
    c(), t.removeEventListener("pointerdown", h);
  };
}
const Xi = 20;
function lr(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function $o(t, e, n) {
  if (!t.position) return { x: 0, y: 0 };
  let o = t.position.x, i = t.position.y;
  const r = /* @__PURE__ */ new Set();
  r.add(t.id);
  let s = t.parentId ? e.get(t.parentId) : void 0;
  for (; s && !r.has(s.id); ) {
    r.add(s.id);
    const a = s.nodeOrigin ?? n ?? [0, 0], l = s.dimensions?.width ?? ye, c = s.dimensions?.height ?? we;
    o += s.position.x - l * a[0], i += s.position.y - c * a[1], s = s.parentId ? e.get(s.parentId) : void 0;
  }
  return { x: o, y: i };
}
function Lt(t, e, n) {
  if (!t.parentId)
    return t;
  const o = $o(t, e, n);
  return { ...t, position: o };
}
function Yn(t, e, n) {
  return t.map((o) => Lt(o, e, n));
}
function st(t, e) {
  const n = /* @__PURE__ */ new Set(), o = [t], i = /* @__PURE__ */ new Map();
  for (const r of e)
    if (r.parentId) {
      const s = i.get(r.parentId);
      s ? s.push(r.id) : i.set(r.parentId, [r.id]);
    }
  for (; o.length > 0; ) {
    const r = o.shift(), s = i.get(r);
    if (s)
      for (const a of s)
        n.has(a) || (n.add(a), o.push(a));
  }
  return n;
}
function rt(t) {
  const e = lr(t), n = [], o = /* @__PURE__ */ new Set();
  function i(r) {
    if (!o.has(r.id)) {
      if (r.parentId) {
        const s = e.get(r.parentId);
        s && i(s);
      }
      o.add(r.id), n.push(r);
    }
  }
  for (const r of t)
    i(r);
  return n;
}
function cr(t, e, n = /* @__PURE__ */ new Set()) {
  if (n.has(t.id))
    return t.zIndex ?? 2;
  if (n.add(t.id), !t.parentId)
    return t.zIndex !== void 0 ? t.zIndex : t.type === "group" ? 0 : 2;
  const o = e.get(t.parentId);
  return o ? cr(o, e, n) + 2 + (t.zIndex ?? 0) : (t.zIndex ?? 0) + 2;
}
function dr(t, e, n) {
  return {
    x: Math.max(e[0][0], Math.min(t.x, e[1][0] - (n?.width ?? 0))),
    y: Math.max(e[0][1], Math.min(t.y, e[1][1] - (n?.height ?? 0)))
  };
}
function lo(t, e, n) {
  return {
    x: Math.max(0, Math.min(t.x, n.width - e.width)),
    y: Math.max(0, Math.min(t.y, n.height - e.height))
  };
}
function bn(t, e, n) {
  const o = e.extent ?? n;
  if (!o || o === "parent" || e.parentId) return t;
  const i = e.dimensions ?? { width: ye, height: we };
  return dr(t, o, i);
}
function qu(t, e, n) {
  const o = t.x + e.width + Xi, i = t.y + e.height + Xi, r = Math.max(n.width, o), s = Math.max(n.height, i);
  return r === n.width && s === n.height ? null : { width: r, height: s };
}
function Yi(t, e, n) {
  switch (n) {
    case "top":
      return { x: t / 2, y: 0 };
    case "right":
      return { x: t, y: e / 2 };
    case "bottom":
      return { x: t / 2, y: e };
    case "left":
      return { x: 0, y: e / 2 };
    case "top-left":
      return { x: 0, y: 0 };
    case "top-right":
      return { x: t, y: 0 };
    case "bottom-left":
      return { x: 0, y: e };
    case "bottom-right":
      return { x: t, y: e };
  }
}
function Wu(t, e, n) {
  const o = t / 2, i = e / 2, r = t / 2, s = e / 2;
  switch (n) {
    case "top":
      return { x: o, y: 0 };
    case "right":
      return { x: t, y: i };
    case "bottom":
      return { x: o, y: e };
    case "left":
      return { x: 0, y: i };
    case "top-right": {
      const a = -Math.PI / 4;
      return { x: o + r * Math.cos(a), y: i + s * Math.sin(a) };
    }
    case "top-left": {
      const a = -3 * Math.PI / 4;
      return { x: o + r * Math.cos(a), y: i + s * Math.sin(a) };
    }
    case "bottom-right": {
      const a = Math.PI / 4;
      return { x: o + r * Math.cos(a), y: i + s * Math.sin(a) };
    }
    case "bottom-left": {
      const a = 3 * Math.PI / 4;
      return { x: o + r * Math.cos(a), y: i + s * Math.sin(a) };
    }
  }
}
function ju(t, e, n) {
  switch (n) {
    case "top":
      return { x: t / 2, y: 0 };
    case "right":
      return { x: t, y: e / 2 };
    case "bottom":
      return { x: t / 2, y: e };
    case "left":
      return { x: 0, y: e / 2 };
    case "top-right":
      return { x: t * 0.75, y: e * 0.25 };
    case "top-left":
      return { x: t * 0.25, y: e * 0.25 };
    case "bottom-right":
      return { x: t * 0.75, y: e * 0.75 };
    case "bottom-left":
      return { x: t * 0.25, y: e * 0.75 };
  }
}
function Uu(t, e, n) {
  switch (n) {
    case "top":
      return { x: t / 2, y: 0 };
    case "right":
      return { x: t, y: e / 2 };
    case "bottom":
      return { x: t / 2, y: e };
    case "left":
      return { x: 0, y: e / 2 };
    case "top-right":
      return { x: t * 0.75, y: 0 };
    case "top-left":
      return { x: t * 0.25, y: 0 };
    case "bottom-right":
      return { x: t * 0.75, y: e };
    case "bottom-left":
      return { x: t * 0.25, y: e };
  }
}
function Zu(t, e, n) {
  const o = t * 0.15;
  switch (n) {
    case "top":
      return { x: t * 0.575, y: 0 };
    case "right":
      return { x: t * 0.925, y: e / 2 };
    case "bottom":
      return { x: t * 0.425, y: e };
    case "left":
      return { x: t * 0.075, y: e / 2 };
    case "top-right":
      return { x: t, y: 0 };
    case "top-left":
      return { x: o, y: 0 };
    case "bottom-right":
      return { x: t - o, y: e };
    case "bottom-left":
      return { x: 0, y: e };
  }
}
function Ku(t, e, n) {
  switch (n) {
    case "top":
      return { x: t / 2, y: 0 };
    case "right":
      return { x: t * 0.75, y: e / 2 };
    case "bottom":
      return { x: t / 2, y: e };
    case "left":
      return { x: t * 0.25, y: e / 2 };
    case "top-right":
      return { x: t * 0.625, y: e * 0.25 };
    case "top-left":
      return { x: t * 0.375, y: e * 0.25 };
    case "bottom-right":
      return { x: t, y: e };
    case "bottom-left":
      return { x: 0, y: e };
  }
}
function Gu(t, e, n) {
  const o = e * 0.12;
  switch (n) {
    case "top":
      return { x: t / 2, y: o };
    case "right":
      return { x: t, y: e / 2 };
    case "bottom":
      return { x: t / 2, y: e - o };
    case "left":
      return { x: 0, y: e / 2 };
    case "top-right":
      return { x: t, y: o };
    case "top-left":
      return { x: 0, y: o };
    case "bottom-right":
      return { x: t, y: e - o };
    case "bottom-left":
      return { x: 0, y: e - o };
  }
}
function Ju(t, e, n) {
  const o = Math.min(t, e) / 2, i = t / 2, r = e / 2;
  switch (n) {
    case "top":
      return { x: i, y: 0 };
    case "right":
      return { x: t, y: r };
    case "bottom":
      return { x: i, y: e };
    case "left":
      return { x: 0, y: r };
    case "top-right": {
      const s = t - o, a = -Math.PI / 4;
      return { x: s + o * Math.cos(a), y: r + o * Math.sin(a) };
    }
    case "top-left": {
      const s = o, a = -3 * Math.PI / 4;
      return { x: s + o * Math.cos(a), y: r + o * Math.sin(a) };
    }
    case "bottom-right": {
      const s = t - o, a = Math.PI / 4;
      return { x: s + o * Math.cos(a), y: r + o * Math.sin(a) };
    }
    case "bottom-left": {
      const s = o, a = 3 * Math.PI / 4;
      return { x: s + o * Math.cos(a), y: r + o * Math.sin(a) };
    }
  }
}
const ur = {
  circle: { perimeterPoint: Wu },
  diamond: { perimeterPoint: ju },
  hexagon: { perimeterPoint: Uu },
  parallelogram: { perimeterPoint: Zu },
  triangle: { perimeterPoint: Ku },
  cylinder: { perimeterPoint: Gu },
  stadium: { perimeterPoint: Ju }
};
function fr(t, e = "light") {
  let n = e === "dark" ? "dark" : "light", o = null, i = null;
  function r(a) {
    n = a ? "dark" : "light", t.classList.toggle("dark", a);
  }
  function s(a) {
    o && i && (o.removeEventListener("change", i), o = null, i = null), a === "system" ? (o = window.matchMedia("(prefers-color-scheme: dark)"), r(o.matches), i = (l) => r(l.matches), o.addEventListener("change", i)) : r(a === "dark");
  }
  return s(e), {
    get resolved() {
      return n;
    },
    update: s,
    destroy() {
      o && i && o.removeEventListener("change", i), t.classList.remove("dark");
    }
  };
}
const co = "__alpineflow_collab_store__";
function Qu() {
  return typeof globalThis < "u" ? (globalThis[co] || (globalThis[co] = /* @__PURE__ */ new WeakMap()), globalThis[co]) : /* @__PURE__ */ new WeakMap();
}
const Te = Qu(), uo = "__alpineflow_registry__";
function ef() {
  return typeof globalThis < "u" ? (globalThis[uo] || (globalThis[uo] = /* @__PURE__ */ new Map()), globalThis[uo]) : /* @__PURE__ */ new Map();
}
function Et(t) {
  return ef().get(t);
}
function tf(t, e) {
  switch (t) {
    case "nodes-change": {
      const n = e.nodes ?? [], o = n.length === 1 ? n[0].data?.label || n[0].id : null;
      return e.type === "add" ? o ? `Added node: ${o}` : `Added ${n.length} nodes` : e.type === "remove" ? o ? `Removed node: ${o}` : `Removed ${n.length} nodes` : null;
    }
    case "edges-change": {
      const n = e.edges ?? [];
      return e.type === "add" ? n.length === 1 ? `Connected ${n[0].source} to ${n[0].target}` : `Added ${n.length} connections` : e.type === "remove" ? n.length === 1 && n[0].source && n[0].target ? `Removed connection from ${n[0].source} to ${n[0].target}` : `Removed ${n.length} connections` : null;
    }
    case "selection-change": {
      const n = e.nodes?.length ?? 0, o = e.edges?.length ?? 0;
      if (n === 0 && o === 0)
        return "Selection cleared";
      const i = [];
      return n > 0 && i.push(`${n} node${n === 1 ? "" : "s"}`), o > 0 && i.push(`${o} edge${o === 1 ? "" : "s"}`), `${i.join(" and ")} selected`;
    }
    case "viewport-move-end": {
      const n = e.viewport?.zoom ?? 1;
      return `Viewport: zoom ${Math.round(n * 100)}%`;
    }
    case "fit-view":
      return "Fitted view to content";
    case "node-reparent": {
      const n = e.node?.data?.label || e.node?.id || "node";
      return e.newParentId ? `Moved ${n} into ${e.newParentId}` : `Detached ${n} from ${e.oldParentId}`;
    }
    default:
      return null;
  }
}
const nf = 1e3;
class of {
  constructor(e, n) {
    this._clearTimer = null, this._formatMessage = n ?? tf, this._el = document.createElement("div"), this._el.setAttribute("aria-live", "polite"), this._el.setAttribute("aria-atomic", "true"), this._el.setAttribute("role", "status");
    const o = this._el.style;
    o.position = "absolute", o.width = "1px", o.height = "1px", o.padding = "0", o.margin = "-1px", o.overflow = "hidden", o.clip = "rect(0,0,0,0)", o.whiteSpace = "nowrap", o.border = "0", e.appendChild(this._el);
  }
  announce(e) {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.textContent = e, this._clearTimer = setTimeout(() => {
      this._el.textContent = "", this._clearTimer = null;
    }, nf);
  }
  handleEvent(e, n) {
    const o = this._formatMessage(e, n);
    o && this.announce(o);
  }
  destroy() {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.remove();
  }
}
class sf {
  constructor() {
    this._registry = /* @__PURE__ */ new Map();
  }
  registerCompute(e, n) {
    this._registry.set(e, n);
  }
  hasCompute(e) {
    return this._registry.has(e);
  }
  /**
   * Kahn's algorithm topological sort. Skips back-edges in cycles
   * by appending remaining nodes at the end.
   */
  topologicalSort(e, n) {
    const o = new Map(e.map((l) => [l.id, l])), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    for (const l of e)
      i.set(l.id, 0), r.set(l.id, []);
    for (const l of n)
      !o.has(l.source) || !o.has(l.target) || (i.set(l.target, (i.get(l.target) ?? 0) + 1), r.get(l.source).push(l.target));
    const s = [];
    for (const [l, c] of i)
      c === 0 && s.push(l);
    const a = [];
    for (; s.length > 0; ) {
      const l = s.shift();
      a.push(o.get(l));
      for (const c of r.get(l) ?? []) {
        const d = (i.get(c) ?? 0) - 1;
        i.set(c, d), d === 0 && s.push(c);
      }
    }
    if (a.length < e.length) {
      const l = new Set(a.map((c) => c.id));
      for (const c of e)
        l.has(c.id) || a.push(c);
    }
    return a;
  }
  /**
   * Run compute propagation.
   *
   * @param nodes All nodes in the graph
   * @param edges All edges in the graph
   * @param startNodeId If provided, only compute this node and its downstream descendants
   * @returns Map of nodeId → output data for nodes that had a registered compute function
   */
  compute(e, n, o) {
    const i = this.topologicalSort(e, n), r = /* @__PURE__ */ new Map();
    if (o)
      for (const l of e)
        l.data.$outputs && r.set(l.id, l.data.$outputs);
    let s = null;
    o && (s = this._getDownstream(o, n), s.add(o));
    const a = /* @__PURE__ */ new Map();
    for (const l of i) {
      if (s && !s.has(l.id)) continue;
      const c = this._registry.get(l.type ?? "default");
      if (!c) continue;
      const d = {}, h = n.filter((f) => f.target === l.id);
      for (const f of h) {
        const g = r.get(f.source);
        if (!g) continue;
        const p = f.sourceHandle ?? "default", w = f.targetHandle ?? "default";
        p in g && (d[w] = g[p]);
      }
      const u = c.compute(d, l.data);
      r.set(l.id, u), a.set(l.id, u), l.data.$inputs = d, l.data.$outputs = u;
    }
    return a;
  }
  /** Get all downstream node IDs reachable from a start node. */
  _getDownstream(e, n) {
    const o = /* @__PURE__ */ new Map();
    for (const s of n) {
      let a = o.get(s.source);
      a || (a = [], o.set(s.source, a)), a.push(s.target);
    }
    const i = /* @__PURE__ */ new Set(), r = [e];
    for (; r.length > 0; ) {
      const s = r.pop();
      if (!i.has(s)) {
        i.add(s);
        for (const a of o.get(s) ?? [])
          i.has(a) || r.push(a);
      }
    }
    return i.delete(e), i;
  }
}
const rf = {
  connect: (t) => [t.connection?.source ?? t.source, t.connection?.target ?? t.target, t.connection?.sourceHandle ?? t.sourceHandle, t.connection?.targetHandle ?? t.targetHandle],
  "connect-start": (t) => [t.source, t.sourceHandle],
  "connect-end": (t) => [t.connection, t.source, t.sourceHandle, t.position],
  "node-click": (t) => [t.node.id, t.node],
  "node-drag-start": (t) => [t.node.id],
  "node-drag-end": (t) => [t.node.id, t.position],
  "node-resize-start": (t) => [t.node.id, t.dimensions],
  "node-resize-end": (t) => [t.node.id, t.dimensions],
  "node-collapse": (t) => [t.node.id, t.descendants],
  "node-expand": (t) => [t.node.id, t.descendants],
  "node-reparent": (t) => [t.node.id, t.oldParentId, t.newParentId],
  "node-context-menu": (t) => [t.node.id, { x: t.event.clientX, y: t.event.clientY }],
  "nodes-change": (t) => [t],
  "edge-click": (t) => [t.edge.id],
  "edge-context-menu": (t) => [t.edge.id, { x: t.event.clientX, y: t.event.clientY }],
  "edges-change": (t) => [t],
  "reconnect-start": (t) => [t.edge.id, t.handleType],
  reconnect: (t) => [t.oldEdge.id, t.newConnection],
  "reconnect-end": (t) => [t.edge.id, t.successful],
  "pane-click": (t) => [t.position],
  "pane-context-menu": (t) => [t.position],
  "viewport-change": (t) => [t.viewport],
  "selection-change": (t) => [t.nodes, t.edges],
  "selection-context-menu": (t) => [t.nodes, t.edges, { x: t.event.clientX, y: t.event.clientY }],
  drop: (t) => [t.data, t.position],
  init: () => [],
  "row-select": (t) => [t.rowId, t.nodeId, t.attrId],
  "row-deselect": (t) => [t.rowId, t.nodeId, t.attrId],
  "row-selection-change": (t) => [t.selectedRows]
}, af = {
  "flow:addNodes": "addNodes",
  "flow:removeNodes": "removeNodes",
  "flow:addEdges": "addEdges",
  "flow:removeEdges": "removeEdges",
  "flow:update": "update",
  "flow:animate": "animate",
  "flow:sendParticle": "sendParticle",
  "flow:fitView": "fitView",
  "flow:zoomIn": "zoomIn",
  "flow:zoomOut": "zoomOut",
  "flow:setCenter": "setCenter",
  "flow:setViewport": "setViewport",
  "flow:follow": "follow",
  "flow:unfollow": "unfollow",
  "flow:undo": "undo",
  "flow:redo": "redo",
  "flow:layout": "layout",
  "flow:fromObject": "fromObject",
  "flow:setLoading": "setLoading",
  "flow:clear": "$clear",
  "flow:toggleInteractive": "toggleInteractive",
  "flow:panBy": "panBy",
  "flow:fitBounds": "fitBounds",
  "flow:patchConfig": "patchConfig",
  "flow:deselectAll": "deselectAll",
  "flow:collapseNode": "collapseNode",
  "flow:expandNode": "expandNode",
  "flow:toggleNode": "toggleNode"
}, lf = {
  "flow:addNodes": (t) => [t.nodes],
  "flow:removeNodes": (t) => [t.ids],
  "flow:addEdges": (t) => [t.edges],
  "flow:removeEdges": (t) => [t.ids],
  "flow:update": (t) => [t.targets, t.options ?? {}],
  "flow:animate": (t) => [t.targets, t.options ?? {}],
  "flow:sendParticle": (t) => [t.edgeId, t.options ?? {}],
  "flow:fitView": () => [],
  "flow:zoomIn": () => [],
  "flow:zoomOut": () => [],
  "flow:setCenter": (t) => [t.x, t.y, t.zoom],
  "flow:setViewport": (t) => [t.viewport],
  "flow:follow": (t) => [t.nodeId, t.options ?? {}],
  "flow:unfollow": () => [],
  "flow:undo": () => [],
  "flow:redo": () => [],
  "flow:layout": (t) => [t.options ?? {}],
  "flow:fromObject": (t) => [t.data],
  "flow:setLoading": (t) => [t.loading],
  "flow:clear": () => [],
  "flow:toggleInteractive": () => [],
  "flow:panBy": (t) => [t.dx, t.dy],
  "flow:fitBounds": (t) => [t.rect, t.options],
  "flow:patchConfig": (t) => [t.changes],
  "flow:deselectAll": () => [],
  "flow:collapseNode": (t) => [t.id],
  "flow:expandNode": (t) => [t.id],
  "flow:toggleNode": (t) => [t.id]
}, qi = {
  success: { borderColor: "#22c55e", shadow: "0 0 0 2px rgba(34,197,94,0.3)" },
  error: { borderColor: "#ef4444", shadow: "0 0 0 2px rgba(239,68,68,0.3)" },
  warning: { borderColor: "#f59e0b", shadow: "0 0 0 2px rgba(245,158,11,0.3)" },
  info: { borderColor: "#3b82f6", shadow: "0 0 0 2px rgba(59,130,246,0.3)" }
};
function cf(t, e) {
  const n = [];
  return n.push(e.on("flow:moveNode", (o) => {
    const i = o.duration ?? 0;
    t.update(
      { nodes: { [o.id]: { position: { x: o.x, y: o.y } } } },
      { duration: i }
    );
  })), n.push(e.on("flow:updateNode", (o) => {
    const i = o.duration ?? 0;
    t.update(
      { nodes: { [o.id]: o.changes } },
      { duration: i }
    );
  })), n.push(e.on("flow:focusNode", (o) => {
    const i = t.getNode(o.id);
    if (!i) return;
    const r = i.dimensions?.width ?? 150, s = i.dimensions?.height ?? 40, a = i.parentId ? t.getAbsolutePosition(o.id) : i.position;
    t.fitBounds(
      { x: a.x, y: a.y, width: r, height: s },
      { padding: o.padding ?? 0.5, duration: o.duration ?? 300 }
    );
  })), n.push(e.on("flow:connect", (o) => {
    const r = { id: o.edgeId ?? `e-${o.source}-${o.target}`, source: o.source, target: o.target, ...o.options ?? {} };
    o.duration && o.duration > 0 ? t.timeline().step({ addEdges: [r], edgeTransition: "draw", duration: o.duration }).play() : t.addEdges(r);
  })), n.push(e.on("flow:disconnect", (o) => {
    const i = t.edges.filter((r) => r.source === o.source && r.target === o.target).map((r) => r.id);
    i.length !== 0 && (o.duration && o.duration > 0 ? t.timeline().step({ removeEdges: i, edgeTransition: "fade", duration: o.duration }).play() : t.removeEdges(i));
  })), n.push(e.on("flow:highlightNode", (o) => {
    const i = t.getNode(o.id);
    if (!i) return;
    const r = qi[o.style] ?? qi.info, s = o.duration ?? 1500, a = Math.floor(s * 0.6), l = Math.floor(s * 0.4), c = i.style?.borderColor ?? null, d = i.style?.boxShadow ?? null;
    t.update({
      nodes: { [o.id]: { style: `border-color: ${r.borderColor}; box-shadow: ${r.shadow}` } }
    }, { duration: 100 }), setTimeout(() => {
      const h = c ? `border-color: ${c}; box-shadow: ${d ?? "none"}` : "";
      t.update({
        nodes: { [o.id]: { style: h } }
      }, { duration: l });
    }, 100 + a);
  })), n.push(e.on("flow:highlightPath", (o) => {
    const i = o.nodeIds, r = o.options ?? {}, s = r.delay ?? 200;
    for (let a = 0; a < i.length - 1; a++) {
      const l = i[a], c = i[a + 1], d = t.edges.find((h) => h.source === l && h.target === c);
      d && setTimeout(() => {
        t.sendParticle(d.id, {
          color: r.color ?? "#3b82f6",
          size: r.size ?? 5,
          duration: r.duration ?? "800ms"
        });
      }, a * s);
    }
  })), n.push(e.on("flow:lockNode", (o) => {
    const i = t.getNode(o.id);
    i && (i.locked = !0);
  })), n.push(e.on("flow:unlockNode", (o) => {
    const i = t.getNode(o.id);
    i && (i.locked = !1);
  })), n.push(e.on("flow:hideNode", (o) => {
    const i = t.getNode(o.id);
    i && (i.hidden = !0);
  })), n.push(e.on("flow:showNode", (o) => {
    const i = t.getNode(o.id);
    i && (i.hidden = !1);
  })), n.push(e.on("flow:selectNodes", (o) => {
    t.deselectAll();
    for (const i of o.ids) {
      t.selectedNodes.add(i);
      const r = t.getNode(i);
      r && (r.selected = !0);
    }
  })), n.push(e.on("flow:selectEdges", (o) => {
    t.deselectAll();
    for (const i of o.ids) {
      t.selectedEdges.add(i);
      const r = t.getEdge(i);
      r && (r.selected = !0);
    }
  })), () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
function df(t) {
  return "on" + t.split("-").map(
    (e) => e.charAt(0).toUpperCase() + e.slice(1)
  ).join("");
}
function uf(t, e, n) {
  for (const [o, i] of Object.entries(n)) {
    const r = df(o), s = t[r];
    t[r] = (a) => {
      let l;
      typeof s == "function" && (l = s(a));
      const c = rf[o], d = c ? c(a) : [a], h = e[i];
      return typeof h == "function" && h.call(e, ...d), l;
    };
  }
}
function ff(t, e) {
  const n = [];
  for (const [o, i] of Object.entries(af)) {
    const r = e.on(o, (s) => {
      const a = t[i];
      if (typeof a != "function") return;
      const l = lf[o], c = l ? l(s) : Object.values(s);
      a.call(t, ...c);
    });
    n.push(r);
  }
  return () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
function Zt(t, e) {
  const n = t.type ?? "default", o = e[n], i = t.data?.childValidation;
  if (!(!o && !i))
    return o ? i ? { ...o, ...i } : o : i;
}
function hr(t, e, n, o) {
  if (!o) return { valid: !0 };
  if (o.maxChildren !== void 0 && n.length >= o.maxChildren)
    return {
      valid: !1,
      rule: "maxChildren",
      message: `Maximum ${o.maxChildren} child node(s) allowed`
    };
  if (o.allowedChildTypes) {
    const i = e.type ?? "default";
    if (!o.allowedChildTypes.includes(i))
      return {
        valid: !1,
        rule: "allowedChildTypes",
        message: `Node type "${i}" is not allowed in this group`
      };
  }
  if (o.childTypeConstraints) {
    const i = e.type ?? "default", r = o.childTypeConstraints[i];
    if (r?.max !== void 0 && n.filter(
      (a) => (a.type ?? "default") === i
    ).length >= r.max)
      return {
        valid: !1,
        rule: "childTypeConstraints",
        message: `Maximum ${r.max} "${i}" node(s) allowed`
      };
  }
  if (o.validateChild) {
    const i = o.validateChild(e, n);
    if (i !== !0)
      return {
        valid: !1,
        rule: "validateChild",
        message: typeof i == "string" ? i : "Custom validation rejected"
      };
  }
  return { valid: !0 };
}
function qn(t, e, n, o) {
  if (!o) return { valid: !0 };
  if (o.preventChildEscape)
    return {
      valid: !1,
      rule: "preventChildEscape",
      message: "Children cannot be moved out of this group"
    };
  const i = n.length - 1, r = Math.max(
    o.minChildren ?? 0,
    o.requiredChildren ? 1 : 0
  );
  if (r > 0 && i < r)
    return {
      valid: !1,
      rule: "minChildren",
      message: `Requires at least ${r} child node(s)`
    };
  if (o.childTypeConstraints) {
    const s = e.type ?? "default", a = o.childTypeConstraints[s];
    if (a?.min !== void 0 && n.filter(
      (c) => (c.type ?? "default") === s
    ).length - 1 < a.min)
      return {
        valid: !1,
        rule: "childTypeConstraints",
        message: `Requires at least ${a.min} "${s}" node(s)`
      };
  }
  return { valid: !0 };
}
function Wi(t, e, n) {
  if (!n) return [];
  const o = [], i = Math.max(
    n.minChildren ?? 0,
    n.requiredChildren ? 1 : 0
  );
  if (i > 0 && e.length < i && o.push(`Requires at least ${i} child node(s)`), n.maxChildren !== void 0 && e.length > n.maxChildren && o.push(`Maximum ${n.maxChildren} child node(s) allowed`), n.childTypeConstraints)
    for (const [r, s] of Object.entries(n.childTypeConstraints)) {
      const a = e.filter(
        (l) => (l.type ?? "default") === r
      ).length;
      s.min !== void 0 && a < s.min && o.push(`Requires at least ${s.min} "${r}" node(s)`), s.max !== void 0 && a > s.max && o.push(`Maximum ${s.max} "${r}" node(s) allowed`);
    }
  return o;
}
function It(t, e) {
  const n = Rt(t, e);
  return {
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? ye,
    height: t.dimensions?.height ?? we
  };
}
function gr(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function hf(t, e, n = !0) {
  const o = It(t);
  return e.filter((i) => {
    if (i.id === t.id) return !1;
    const r = It(i);
    return n ? gr(o, r) : o.x <= r.x && o.y <= r.y && o.x + o.width >= r.x + r.width && o.y + o.height >= r.y + r.height;
  });
}
function gf(t, e, n = !0) {
  if (t.id === e.id) return !1;
  const o = It(t), i = It(e);
  return n ? gr(o, i) : o.x <= i.x && o.y <= i.y && o.x + o.width >= i.x + i.width && o.y + o.height >= i.y + i.height;
}
function pf(t, e, n, o, i = 5) {
  let { x: r, y: s } = t;
  for (const a of o) {
    const l = r + e, c = s + n, d = a.x + a.width, h = a.y + a.height;
    if (r < d + i && l > a.x - i && s < h + i && c > a.y - i) {
      const u = l - (a.x - i), f = d + i - r, g = c - (a.y - i), p = h + i - s, w = Math.min(u, f, g, p);
      w === u ? r -= u : w === f ? r += f : w === g ? s -= g : s += p;
    }
  }
  return { x: r, y: s };
}
function mf(t) {
  return {
    /**
     * Add one or more nodes to the canvas.
     *
     * - Normalizes single node or array input.
     * - When `options.center` is set, stashes intended positions off-screen
     *   so the directive can measure dimensions without a visible flash,
     *   then repositions after measurement via double-rAF.
     * - Validates child constraints before accepting each node.
     * - Captures history, sorts topologically, rebuilds node map.
     * - Pushes collab updates when a collaboration bridge is active.
     * - Runs child layout for any layout parents that received new children.
     * - Schedules auto-layout after the mutation.
     */
    addNodes(e, n) {
      t._captureHistory();
      let o = Array.isArray(e) ? e : [e];
      B("init", `Adding ${o.length} node(s)`, o.map((c) => c.id));
      const i = /* @__PURE__ */ new Map();
      if (n?.center) {
        for (const c of o)
          i.set(c.id, { ...c.position });
        o = o.map((c) => ({ ...c, position: { x: -9999, y: -9999 } }));
      }
      const r = [];
      for (const c of o) {
        if (c.parentId) {
          const d = t._getChildValidation(c.parentId);
          if (d) {
            const h = t._nodeMap.get(c.parentId);
            if (h) {
              const u = [
                ...t.nodes.filter(
                  (g) => g.parentId === c.parentId
                ),
                ...r.filter(
                  (g) => g.parentId === c.parentId
                )
              ], f = hr(h, c, u, d);
              if (!f.valid) {
                t._config.onChildValidationFail && t._config.onChildValidationFail({
                  parent: h,
                  child: c,
                  operation: "add",
                  rule: f.rule,
                  message: f.message
                });
                continue;
              }
            }
          }
        }
        r.push(c);
      }
      o = r, t.nodes.push(...o);
      for (const c of o)
        c.dimensions && t._initialDimensions.set(c.id, { ...c.dimensions });
      t.nodes = rt(t.nodes), t._rebuildNodeMap(), t._emit("nodes-change", { type: "add", nodes: o });
      const s = t._container ? Te.get(t._container) : void 0;
      if (s?.bridge)
        for (const c of o)
          s.bridge.pushLocalNodeAdd(c);
      n?.center && requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          for (const [c, d] of i) {
            const h = t.nodes.find((g) => g.id === c);
            if (!h) continue;
            const u = h.dimensions?.width ?? 0, f = h.dimensions?.height ?? 0;
            h.position.x = d.x - u / 2, h.position.y = d.y - f / 2;
          }
        });
      }), t._recomputeChildValidation();
      const a = /* @__PURE__ */ new Set();
      for (const c of o)
        if (c.parentId && t._nodeMap.get(c.parentId)?.childLayout) {
          if (c.order == null) {
            const h = t.nodes.filter(
              (u) => u.parentId === c.parentId && u.id !== c.id
            );
            c.order = h.length > 0 ? Math.max(...h.map((u) => u.order ?? 0)) + 1 : 0;
          }
          a.add(c.parentId);
        }
      const l = /* @__PURE__ */ new Set();
      for (const c of a) {
        let d = c, h = t._nodeMap.get(c)?.parentId;
        for (; h; ) {
          const u = t._nodeMap.get(h);
          u?.childLayout && (d = h), h = u?.parentId;
        }
        l.add(d);
      }
      for (const c of l) t.layoutChildren?.(c);
      t._scheduleAutoLayout();
    },
    /**
     * Remove one or more nodes by ID.
     *
     * - Normalizes single ID or array input.
     * - Validates child constraints before allowing removal.
     * - Cascades removal to all descendants.
     * - Removes connected edges and optionally creates reconnection bridges.
     * - Cleans up selection state and initial dimensions.
     * - Pushes collab updates when a collaboration bridge is active.
     * - Re-layouts any layout parents that lost children.
     * - Schedules auto-layout after the mutation.
     */
    removeNodes(e) {
      t._captureHistory();
      const n = new Set(Array.isArray(e) ? e : [e]), o = /* @__PURE__ */ new Set();
      for (const h of [...n]) {
        const u = t._nodeMap.get(h);
        if (!u?.parentId || n.has(u.parentId)) continue;
        const f = t._getChildValidation(u.parentId);
        if (!f) continue;
        const g = t._nodeMap.get(u.parentId);
        if (!g) continue;
        const p = t.nodes.filter(
          (m) => m.parentId === u.parentId
        ), w = qn(g, u, p, f);
        w.valid || (o.add(h), t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: g,
          child: u,
          operation: "remove",
          rule: w.rule,
          message: w.message
        }));
      }
      for (const h of o)
        n.delete(h);
      if (n.size === 0) return;
      const i = /* @__PURE__ */ new Map();
      for (const h of n) {
        const u = t._nodeMap.get(h);
        u?.parentId && i.set(h, u.parentId);
      }
      for (const h of [...n])
        for (const u of st(h, t.nodes))
          n.add(u);
      B("destroy", `Removing ${n.size} node(s)`, [...n]);
      const r = t.nodes.filter((h) => n.has(h.id));
      let s = [];
      t._config.reconnectOnDelete && (s = $u(n, t.nodes, t.edges));
      const a = [];
      t.edges = t.edges.filter((h) => n.has(h.source) || n.has(h.target) ? (a.push(h.id), !1) : !0), s.length && (t.edges.push(...s), B("destroy", `Created ${s.length} reconnection edge(s)`)), t._rebuildEdgeMap(), t.nodes = t.nodes.filter((h) => !n.has(h.id)), t._rebuildNodeMap();
      for (const h of n)
        t.selectedNodes.delete(h), t._initialDimensions.delete(h);
      r.length && t._emit("nodes-change", { type: "remove", nodes: r }), s.length && t._emit("edges-change", { type: "add", edges: s });
      const l = t._container ? Te.get(t._container) : void 0;
      if (l?.bridge) {
        for (const h of n)
          l.bridge.pushLocalNodeRemove(h);
        for (const h of a)
          l.bridge.pushLocalEdgeRemove(h);
        for (const h of s)
          l.bridge.pushLocalEdgeAdd(h);
      }
      t._recomputeChildValidation();
      const c = /* @__PURE__ */ new Set();
      for (const h of n) {
        const u = i.get(h);
        u && t._nodeMap.get(u)?.childLayout && c.add(u);
      }
      const d = /* @__PURE__ */ new Set();
      for (const h of c) {
        let u = h, f = t._nodeMap.get(h)?.parentId;
        for (; f; ) {
          const g = t._nodeMap.get(f);
          g?.childLayout && (u = f), f = g?.parentId;
        }
        d.add(u);
      }
      for (const h of d) t.layoutChildren?.(h);
      t._scheduleAutoLayout();
    },
    /**
     * Look up a node by ID.
     */
    getNode(e) {
      return t._nodeMap.get(e);
    },
    /**
     * Get all nodes connected via outgoing edges from the given node.
     */
    getOutgoers(e) {
      return Ao(e, t.nodes, t.edges);
    },
    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(e) {
      return Tu(e, t.nodes, t.edges);
    },
    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(e) {
      return Mu(e, t.edges);
    },
    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(e, n, o = !1) {
      return Nu(e, n, t.edges, o);
    },
    /**
     * Apply a node-level filter predicate.
     * Nodes that fail the predicate get `filtered = true`.
     */
    setNodeFilter(e) {
      const n = [], o = [];
      for (const i of t.nodes) {
        const r = !e(i);
        i.filtered = r, r ? n.push(i) : o.push(i);
      }
      B("filter", `Node filter applied: ${o.length} visible, ${n.length} filtered`), t._emit("node-filter-change", { filtered: n, visible: o });
    },
    /**
     * Clear node filter — restore all nodes to visible.
     */
    clearNodeFilter() {
      let e = !1;
      for (const n of t.nodes)
        n.filtered && (n.filtered = !1, e = !0);
      e && (B("filter", "Node filter cleared"), t._emit("node-filter-change", { filtered: [], visible: [...t.nodes] }));
    },
    /**
     * Get nodes whose bounding rect overlaps the given node.
     * Accepts either a FlowNode object or a node ID string.
     */
    getIntersectingNodes(e, n) {
      const o = typeof e == "string" ? t.nodes.find((i) => i.id === e) : e;
      return o ? hf(o, t.nodes, n) : [];
    },
    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(e, n, o) {
      const i = typeof e == "string" ? t.nodes.find((s) => s.id === e) : e, r = typeof n == "string" ? t.nodes.find((s) => s.id === n) : n;
      return !i || !r ? !1 : gf(i, r, o);
    }
  };
}
function yf(t) {
  return {
    /**
     * Add one or more edges to the canvas.
     *
     * - Normalizes single edge or array input.
     * - Merges `defaultEdgeOptions` from config (edge-specific props override defaults).
     * - Captures history before mutation.
     * - Pushes collab updates when a collaboration bridge is active.
     * - Schedules auto-layout after the mutation.
     */
    addEdges(e) {
      t._captureHistory();
      const n = t._config.defaultEdgeOptions, o = (Array.isArray(e) ? e : [e]).map(
        (r) => n ? { ...n, ...r } : r
      );
      B("edge", `Adding ${o.length} edge(s)`, o.map((r) => r.id)), t.edges.push(...o), t._rebuildEdgeMap(), t._emit("edges-change", { type: "add", edges: o });
      const i = t._container ? Te.get(t._container) : void 0;
      if (i?.bridge)
        for (const r of o)
          i.bridge.pushLocalEdgeAdd(r);
      t._scheduleAutoLayout();
    },
    /**
     * Remove one or more edges by ID.
     *
     * - Normalizes single ID or array input.
     * - Filters edges, rebuilds edge map, deselects removed edges.
     * - Captures history before mutation.
     * - Pushes collab updates when a collaboration bridge is active.
     * - Schedules auto-layout after the mutation.
     */
    removeEdges(e) {
      t._captureHistory();
      const n = new Set(Array.isArray(e) ? e : [e]);
      B("edge", `Removing ${n.size} edge(s)`, [...n]);
      const o = t.edges.filter((r) => n.has(r.id));
      t.edges = t.edges.filter((r) => !n.has(r.id)), t._rebuildEdgeMap();
      for (const r of n)
        t.selectedEdges.delete(r);
      o.length && t._emit("edges-change", { type: "remove", edges: o });
      const i = t._container ? Te.get(t._container) : void 0;
      if (i?.bridge)
        for (const r of n)
          i.bridge.pushLocalEdgeRemove(r);
      t._scheduleAutoLayout();
    },
    /**
     * Look up an edge by ID.
     */
    getEdge(e) {
      return t._edgeMap.get(e);
    },
    /**
     * Get the visible SVG `<path>` element for an edge.
     * The visible path is the second `<path>` child (the first is the interaction hit area).
     */
    getEdgePathElement(e) {
      return t._container?.querySelector(`[data-flow-edge-id="${CSS.escape(e)}"]`)?.querySelector("path:nth-child(2)");
    },
    /**
     * Get the container element (SVG group) for an edge.
     */
    getEdgeElement(e) {
      return t._container?.querySelector(`[data-flow-edge-id="${CSS.escape(e)}"]`);
    },
    /**
     * Get the SVG element that hosts edge paths.
     * Returns the first `.flow-edge-svg` element inside the viewport,
     * used for injecting temporary paths (guide paths, particle paths).
     */
    getEdgeSvgElement() {
      return t._viewportEl?.querySelector(".flow-edge-svg");
    }
  };
}
function wf(t) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────
    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Ws(e, n, t.viewport, o);
    },
    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Jd(e, n, t.viewport, o);
    },
    // ── Fit & Bounds ──────────────────────────────────────────────────────
    /**
     * Fit all visible nodes into the viewport.
     *
     * Defers via `requestAnimationFrame` if any node lacks measured
     * dimensions (up to 10 retries) to give the DOM time to render.
     */
    fitView(e, n = 0) {
      if (t.nodes.some((r) => !r.dimensions)) {
        n < 10 && requestAnimationFrame(() => this.fitView(e, n + 1));
        return;
      }
      const o = t.nodes.filter((r) => !r.hidden), i = Nt(Yn(o, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
      this.fitBounds(i, e), t._announcer?.handleEvent("fit-view", {});
    },
    /**
     * Fit a specific rectangle into the viewport.
     *
     * If `duration` is specified, the transition is animated via
     * `ctx.animate()` (cross-mixin dependency). Otherwise the viewport
     * is set directly via `ctx._panZoom`.
     */
    fitBounds(e, n) {
      const o = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, i = Fn(
        e,
        o.width,
        o.height,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n?.padding ?? To
      );
      B("viewport", "fitBounds", { rect: e, viewport: i });
      const r = n?.duration ?? 0;
      r > 0 ? t.animate?.(
        { viewport: { pan: { x: i.x, y: i.y }, zoom: i.zoom } },
        { duration: r }
      ) : t._panZoom?.setViewport(i);
    },
    /**
     * Get the bounding rectangle of the specified nodes (or all visible
     * nodes if no IDs are provided).
     */
    getNodesBounds(e) {
      let n;
      return e ? n = e.map((o) => t.getNode(o)).filter((o) => !!o) : n = t.nodes.filter((o) => !o.hidden), Nt(Yn(n, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
    },
    /**
     * Compute the viewport (pan + zoom) that frames the given bounds
     * within the container, respecting min/max zoom and padding.
     */
    getViewportForBounds(e, n) {
      const o = t._container;
      return o ? Fn(
        e,
        o.clientWidth,
        o.clientHeight,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n ?? To
      ) : { x: 0, y: 0, zoom: 1 };
    },
    // ── Viewport Mutation ─────────────────────────────────────────────────
    /**
     * Set the viewport programmatically (pan and/or zoom).
     */
    setViewport(e, n) {
      B("viewport", "setViewport", e), t._panZoom?.setViewport(e, n);
    },
    /**
     * Zoom in by `ZOOM_STEP_FACTOR`, clamped to `maxZoom`.
     */
    zoomIn(e) {
      const n = t._config.maxZoom ?? 2, o = Math.min(t.viewport.zoom * Li, n);
      B("viewport", "zoomIn", { from: t.viewport.zoom, to: o }), t._panZoom?.setViewport({ ...t.viewport, zoom: o }, e);
    },
    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(e) {
      const n = t._config.minZoom ?? 0.5, o = Math.max(t.viewport.zoom / Li, n);
      B("viewport", "zoomOut", { from: t.viewport.zoom, to: o }), t._panZoom?.setViewport({ ...t.viewport, zoom: o }, e);
    },
    /**
     * Center the viewport on flow coordinate `(x, y)` at the given zoom
     * level (defaults to the current zoom).
     */
    setCenter(e, n, o, i) {
      const r = t._container;
      if (!r) return;
      const s = o ?? t.viewport.zoom, a = r.clientWidth / 2 - e * s, l = r.clientHeight / 2 - n * s;
      B("viewport", "setCenter", { x: e, y: n, zoom: s }), t._panZoom?.setViewport({ x: a, y: l, zoom: s }, i);
    },
    /**
     * Pan the viewport by a delta `(dx, dy)`.
     */
    panBy(e, n, o) {
      B("viewport", "panBy", { dx: e, dy: n }), t._panZoom?.setViewport(
        { x: t.viewport.x + e, y: t.viewport.y + n, zoom: t.viewport.zoom },
        o
      );
    },
    // ── Interactivity Toggle ──────────────────────────────────────────────
    /**
     * Toggle pan/zoom interactivity on and off.
     */
    toggleInteractive() {
      t.isInteractive = !t.isInteractive, B("interactive", "toggleInteractive", { isInteractive: t.isInteractive }), t._panZoom?.update({
        pannable: t.isInteractive,
        zoomable: t.isInteractive
      });
    },
    // ── Color Mode ────────────────────────────────────────────────────────
    /**
     * The current resolved color mode ('light' | 'dark' | undefined).
     */
    get colorMode() {
      return t._colorModeHandle?.resolved;
    },
    // ── Container Dimensions ──────────────────────────────────────────────
    /**
     * Get the current width and height of the container element.
     */
    getContainerDimensions() {
      return {
        width: t._container?.clientWidth ?? 0,
        height: t._container?.clientHeight ?? 0
      };
    },
    // ── Panel Operations ──────────────────────────────────────────────────
    /**
     * Reset all panels by dispatching a `flow-panel-reset` CustomEvent
     * on the container and emitting a `panel-reset` event.
     */
    resetPanels() {
      B("panel", "resetPanels"), t._container?.dispatchEvent(new CustomEvent("flow-panel-reset")), t._emit("panel-reset");
    }
  };
}
let ht = null;
const vf = 20;
function Io(t) {
  return JSON.parse(JSON.stringify(t));
}
function ji(t) {
  return `${t}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function pr(t, e) {
  const n = t.filter((r) => r.selected), o = new Set(n.map((r) => r.id)), i = e.filter(
    (r) => r.selected || o.has(r.source) && o.has(r.target)
  );
  return ht = {
    nodes: Io(n),
    edges: Io(i),
    pasteCount: 0
  }, { nodeCount: n.length, edgeCount: i.length };
}
function _f() {
  if (!ht || ht.nodes.length === 0) return null;
  ht.pasteCount++;
  const t = ht.pasteCount * vf, e = /* @__PURE__ */ new Map(), n = ht.nodes.map((i) => {
    const r = ji(i.id);
    return e.set(i.id, r), {
      ...i,
      id: r,
      data: Io(i.data),
      position: { x: i.position.x + t, y: i.position.y + t },
      selected: !0
    };
  }), o = ht.edges.map((i) => ({
    ...i,
    id: ji(i.id),
    source: e.get(i.source),
    target: e.get(i.target),
    selected: !0
  }));
  return { nodes: n, edges: o };
}
function bf(t, e) {
  const n = pr(t, e);
  return { nodeIds: t.filter((i) => i.selected).map((i) => i.id), ...n };
}
function xf(t) {
  return {
    // ── Deselect ─────────────────────────────────────────────────────────
    /**
     * Clear all node, edge, and row selections.
     *
     * - Sets `selected = false` on each selected node/edge data object.
     * - Clears `selectedNodes`, `selectedEdges`, and `selectedRows` Sets.
     * - Removes `.flow-node-selected`, `.flow-edge-selected`, and
     *   `.flow-row-selected` CSS classes from the DOM.
     * - Emits a `selection-change` event.
     */
    deselectAll() {
      if (!(t.selectedNodes.size === 0 && t.selectedEdges.size === 0 && t.selectedRows.size === 0)) {
        B("selection", "Deselecting all");
        for (const e of t.selectedNodes) {
          const n = t.getNode(e);
          n && (n.selected = !1);
        }
        for (const e of t.selectedEdges) {
          const n = t.getEdge(e);
          n && (n.selected = !1);
        }
        t.selectedNodes.clear(), t.selectedEdges.clear(), t.selectedRows.clear(), t._container?.querySelectorAll(".flow-node-selected, .flow-edge-selected, .flow-row-selected").forEach((e) => {
          e.classList.remove("flow-node-selected", "flow-edge-selected", "flow-row-selected");
        }), t._emitSelectionChange();
      }
    },
    // ── Deletion ─────────────────────────────────────────────────────────
    /**
     * Delete currently selected nodes and edges.
     *
     * - Filters out non-deletable nodes/edges (where `deletable === false`).
     * - Cascades edge deletion for edges connected to deleted nodes.
     * - Validates child removal constraints before deleting child nodes.
     * - Supports an async `onBeforeDelete` callback that can cancel or
     *   modify the set of items to delete.
     * - Wraps the entire operation in a single history step.
     */
    async _deleteSelected() {
      const e = [...t.selectedNodes].filter((l) => {
        const c = t.getNode(l);
        return c ? Hu(c) : !1;
      }), n = [...t.selectedEdges].filter((l) => t.getEdge(l)?.deletable !== !1);
      let o = e.map((l) => t.getNode(l)).filter(Boolean);
      const i = new Set(e), r = t.edges.filter(
        (l) => i.has(l.source) || i.has(l.target)
      ), s = /* @__PURE__ */ new Map();
      for (const l of r) s.set(l.id, l);
      for (const l of n) {
        const c = t.getEdge(l);
        c && s.set(c.id, c);
      }
      const a = [...s.values()];
      if (o = o.filter((l) => {
        if (!l.parentId || o.some((f) => f.id === l.parentId)) return !0;
        const c = t._getChildValidation(l.parentId);
        if (!c) return !0;
        const d = t.getNode(l.parentId);
        if (!d) return !0;
        const h = t.nodes.filter(
          (f) => f.parentId === l.parentId
        ), u = qn(d, l, h, c);
        return !u.valid && t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: d,
          child: l,
          operation: "remove",
          rule: u.rule,
          message: u.message
        }), u.valid;
      }), !(o.length === 0 && a.length === 0)) {
        if (t._config?.onBeforeDelete) {
          const l = await t._config.onBeforeDelete({
            nodes: o,
            edges: a
          });
          if (l === !1) {
            B("delete", "onBeforeDelete cancelled deletion");
            return;
          }
          t._captureHistory(), t._suspendHistory();
          try {
            if (l.nodes.length > 0 && (B("delete", `onBeforeDelete approved ${l.nodes.length} node(s)`), t.removeNodes(l.nodes.map((c) => c.id))), l.edges.length > 0) {
              const c = l.edges.map((d) => d.id).filter((d) => t.edges.some((h) => h.id === d));
              c.length > 0 && (B("delete", `onBeforeDelete approved ${c.length} edge(s)`), t.removeEdges(c));
            }
            t._recomputeChildValidation();
            for (const c of t.selectedNodes)
              t.nodes.some((d) => d.id === c) || t.selectedNodes.delete(c);
            for (const c of t.selectedEdges)
              t.edges.some((d) => d.id === c) || t.selectedEdges.delete(c);
          } finally {
            t._resumeHistory();
          }
          return;
        }
        t._captureHistory(), t._suspendHistory();
        try {
          if (o.length > 0 && (B("delete", `Deleting ${o.length} selected node(s)`), t.removeNodes(o.map((l) => l.id))), n.length > 0) {
            const l = n.filter(
              (c) => t.edges.some((d) => d.id === c)
            );
            l.length > 0 && (B("delete", `Deleting ${l.length} selected edge(s)`), t.removeEdges(l));
          }
          t._recomputeChildValidation();
          for (const l of t.selectedNodes)
            t.nodes.some((c) => c.id === l) || t.selectedNodes.delete(l);
          for (const l of t.selectedEdges)
            t.edges.some((c) => c.id === l) || t.selectedEdges.delete(l);
        } finally {
          t._resumeHistory();
        }
      }
    },
    // ── Clipboard Operations ─────────────────────────────────────────────
    /**
     * Copy currently selected nodes and their internal edges to the
     * module-level clipboard. Emits a `copy` event.
     */
    copy() {
      const e = pr(t.nodes, t.edges);
      e.nodeCount > 0 && (B("clipboard", `Copied ${e.nodeCount} node(s) and ${e.edgeCount} edge(s)`), t._emit("copy", e));
    },
    /**
     * Paste nodes/edges from the clipboard with new IDs and an
     * accumulating 20 px offset.
     *
     * - Deselects all current selection first.
     * - Pushes new nodes (topologically sorted) and edges directly.
     * - Selects all pasted items.
     * - Applies `.flow-node-selected` / `.flow-edge-selected` CSS classes
     *   after Alpine renders the new DOM elements.
     */
    paste() {
      const e = _f();
      if (e) {
        t._captureHistory(), t.deselectAll(), t.nodes.push(...e.nodes), t.nodes = rt(t.nodes), t._rebuildNodeMap(), t.edges.push(...e.edges), t._rebuildEdgeMap();
        for (const n of e.nodes)
          t.selectedNodes.add(n.id);
        for (const n of e.edges)
          t.selectedEdges.add(n.id);
        t._emitSelectionChange(), t._emit("nodes-change", { type: "add", nodes: e.nodes }), t._emit("edges-change", { type: "add", edges: e.edges }), t._emit("paste", { nodes: e.nodes, edges: e.edges }), B("clipboard", `Pasted ${e.nodes.length} node(s) and ${e.edges.length} edge(s)`), t.$nextTick(() => {
          for (const n of e.nodes)
            t._container?.querySelector(`[data-flow-node-id="${CSS.escape(n.id)}"]`)?.classList.add("flow-node-selected");
          for (const n of e.edges)
            t._container?.querySelector(`[data-flow-edge-id="${CSS.escape(n.id)}"]`)?.classList.add("flow-edge-selected");
        });
      }
    },
    /**
     * Copy selected nodes to the clipboard, then delete them.
     * Emits a `cut` event.
     */
    async cut() {
      if (t.selectedNodes.size === 0) return;
      const e = bf(t.nodes, t.edges);
      e.nodeCount !== 0 && (await t._deleteSelected(), t._emit("cut", { nodeCount: e.nodeCount, edgeCount: e.edgeCount }), B("clipboard", `Cut ${e.nodeCount} node(s)`));
    }
  };
}
function Ef(t) {
  return {
    // ── Save / Restore ────────────────────────────────────────────
    /**
     * Serialize the current canvas state (nodes, edges, viewport) as a
     * deep-cloned plain object. Emits a `save` event with the snapshot.
     */
    toObject() {
      const e = {
        nodes: JSON.parse(JSON.stringify(t.nodes)),
        edges: JSON.parse(JSON.stringify(t.edges)),
        viewport: { ...t.viewport }
      };
      return t._emit("save", e), e;
    },
    /**
     * Restore canvas state from a saved object.
     *
     * - Deep-clones incoming nodes/edges to avoid shared references.
     * - Sorts nodes topologically for correct parent-before-child ordering.
     * - Rebuilds node and edge lookup maps.
     * - Applies viewport if provided.
     * - Deselects all, emits `restore`, and schedules auto-layout.
     */
    fromObject(e) {
      if (B("store", "fromObject: restoring state", {
        nodes: e.nodes?.length ?? 0,
        edges: e.edges?.length ?? 0,
        viewport: !!e.viewport
      }), e.nodes && (t.nodes = rt(JSON.parse(JSON.stringify(e.nodes)))), e.edges) {
        const n = JSON.parse(JSON.stringify(e.edges)), o = new Map(t.edges.map((r) => [r.id, r])), i = [];
        for (const r of n) {
          const s = o.get(r.id);
          if (s) {
            for (const a of Object.keys(s))
              a !== "id" && !(a in r) && delete s[a];
            Object.assign(s, r), i.push(s);
          } else
            i.push(r);
        }
        t.edges = i;
      }
      if (t._rebuildNodeMap(), t._rebuildEdgeMap(), e.viewport) {
        const n = { ...t.viewport, ...e.viewport };
        t._panZoom?.setViewport(n);
      }
      t.deselectAll(), t._emit("restore", e), t._scheduleAutoLayout(), requestAnimationFrame(() => {
        t._layoutAnimTick++;
      });
    },
    /**
     * Reset the canvas to its initial configuration state.
     */
    $reset() {
      B("store", "$reset: restoring initial config"), this.fromObject({
        nodes: t._config.nodes ?? [],
        edges: t._config.edges ?? [],
        viewport: t._config.viewport ?? { x: 0, y: 0, zoom: 1 }
      });
    },
    /**
     * Clear all nodes and edges, resetting the viewport to origin.
     */
    $clear() {
      B("store", "$clear: emptying canvas"), this.fromObject({
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      });
    },
    // ── Undo / Redo ────────────────────────────────────────────
    /**
     * Undo the last structural change by popping a snapshot from the
     * history past stack. Rebuilds maps and deselects all after applying.
     */
    undo() {
      if (!t._history) return;
      const e = t._history.undo({ nodes: t.nodes, edges: t.edges });
      e && (t.nodes = rt(e.nodes), t.edges = e.edges, t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll(), requestAnimationFrame(() => {
        t._layoutAnimTick++;
      }), B("history", "Undo applied", { nodes: e.nodes.length, edges: e.edges.length }));
    },
    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Rebuilds maps and deselects all after applying.
     */
    redo() {
      if (!t._history) return;
      const e = t._history.redo({ nodes: t.nodes, edges: t.edges });
      e && (t.nodes = rt(e.nodes), t.edges = e.edges, t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll(), requestAnimationFrame(() => {
        t._layoutAnimTick++;
      }), B("history", "Redo applied", { nodes: e.nodes.length, edges: e.edges.length }));
    },
    /**
     * Whether an undo operation is available.
     */
    get canUndo() {
      return t._history?.canUndo ?? !1;
    },
    /**
     * Whether a redo operation is available.
     */
    get canRedo() {
      return t._history?.canRedo ?? !1;
    }
  };
}
function Cf(t, e) {
  return t * (1 - e);
}
function Sf(t, e) {
  return t * e;
}
function Pf(t, e) {
  return e === "in" ? t : 1 - t;
}
function kf(t, e, n) {
  const o = t.getTotalLength();
  t.style.strokeDasharray = String(o);
  const i = n === "in" ? Cf(o, e) : Sf(o, e);
  t.style.strokeDashoffset = String(i), (n === "in" && e < 1 || n === "out") && (t.style.setProperty("marker-start", "none"), t.style.setProperty("marker-end", "none"));
}
function Lf(t) {
  t.style.removeProperty("stroke-dasharray"), t.style.removeProperty("stroke-dashoffset"), t.style.removeProperty("marker-start"), t.style.removeProperty("marker-end");
}
function Mf(t, e, n) {
  t.style.opacity = String(Pf(e, n));
}
function Tf(t) {
  t.style.removeProperty("opacity");
}
const Ue = Math.PI * 2, Xt = /* @__PURE__ */ new Map(), Af = 64;
function Jo(t) {
  if (typeof document > "u" || typeof document.createElementNS != "function")
    return null;
  const e = Xt.get(t);
  if (e) return e;
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  n.setAttribute("d", t);
  const o = n.getTotalLength(), i = (r) => {
    const s = n.getPointAtLength(r * o);
    return { x: s.x, y: s.y };
  };
  if (Xt.size >= Af) {
    const r = Xt.keys().next().value;
    r !== void 0 && Xt.delete(r);
  }
  return Xt.set(t, i), i;
}
function rm(t) {
  const { cx: e, cy: n, offset: o = 0, clockwise: i = !0 } = t, r = t.rx ?? t.radius ?? 100, s = t.ry ?? t.radius ?? 100, a = i ? 1 : -1;
  return (l) => ({
    x: e + r * Math.cos(Ue * l * a + o * Ue),
    y: n + s * Math.sin(Ue * l * a + o * Ue)
  });
}
function am(t) {
  const { startX: e, startY: n, endX: o, endY: i, amplitude: r = 30, frequency: s = 1, offset: a = 0 } = t, l = o - e, c = i - n, d = Math.sqrt(l * l + c * c), h = d > 0 ? l / d : 1, f = -(d > 0 ? c / d : 0), g = h;
  return (p) => {
    const w = e + l * p, m = n + c * p, C = r * Math.sin(Ue * s * p + a * Ue);
    return { x: w + f * C, y: m + g * C };
  };
}
function lm(t, e) {
  const n = Jo(t);
  if (!n) return null;
  const { reverse: o = !1, startAt: i = 0, endAt: r = 1 } = e ?? {}, s = r - i;
  return (a) => {
    let l = i + a * s;
    return o && (l = r - a * s), n(l);
  };
}
function cm(t) {
  const { cx: e, cy: n, radius: o, angle: i = 60, offset: r = 0 } = t, s = i * Math.PI / 180;
  return (a) => {
    const l = s * Math.sin(Ue * a + r * Ue);
    return {
      x: e + o * Math.sin(l),
      y: n + o * Math.cos(l)
    };
  };
}
function dm(t) {
  const { originX: e, originY: n, range: o = 20, speed: i = 1, seed: r = 0 } = t, s = 1 + r % 7 * 0.3, a = 1.3 + r % 11 * 0.2, l = 0.7 + r % 13 * 0.25, c = 1.1 + r % 17 * 0.15;
  return (d) => {
    const h = d * i * Ue, u = (Math.sin(s * h) + Math.sin(a * h * 1.3)) / 2, f = (Math.sin(l * h * 0.9) + Math.sin(c * h * 1.1)) / 2;
    return { x: e + u * o, y: n + f * o };
  };
}
function um(t, e) {
  const n = e?.from ?? 0;
  return (o, i) => n + o * t;
}
function Nf(t) {
  return {
    position: { ...t.position },
    class: t.class,
    style: typeof t.style == "string" ? t.style : t.style ? { ...t.style } : void 0,
    data: structuredClone(t.data),
    dimensions: t.dimensions ? { ...t.dimensions } : void 0,
    selected: t.selected,
    zIndex: t.zIndex
  };
}
function $f(t) {
  return {
    animated: t.animated,
    color: t.color,
    class: t.class,
    label: t.label,
    strokeWidth: t.strokeWidth
  };
}
function If(t, e) {
  t.position.x = e.position.x, t.position.y = e.position.y, t.class = e.class, t.style = e.style, t.data = structuredClone(e.data), t.dimensions = e.dimensions ? { ...e.dimensions } : t.dimensions, t.selected = e.selected, t.zIndex = e.zIndex;
}
class Qo {
  constructor(e, n) {
    this._entries = [], this._state = "idle", this._reversed = !1, this._loopCount = -1, this._lockEnabled = !1, this._locked = !1, this._respectReducedMotion = void 0, this._listeners = /* @__PURE__ */ new Map(), this._context = {}, this._activeHandles = [], this._subTimelines = [], this._initialSnapshot = /* @__PURE__ */ new Map(), this._initialEdgeSnapshot = /* @__PURE__ */ new Map(), this._playResolve = null, this._pauseWaiters = /* @__PURE__ */ new Set(), this._canvas = e, this._engine = n ?? new Ks();
  }
  // ── Public API ───────────────────────────────────────────────────────
  get state() {
    return this._state;
  }
  get locked() {
    return this._locked;
  }
  get subTimelines() {
    return this._subTimelines;
  }
  get tag() {
    return this._tag;
  }
  setTag(e) {
    return this._tag = e, this;
  }
  step(e) {
    return this._entries.push({ type: "step", config: e }), this;
  }
  parallel(e) {
    return this._entries.push({ type: "parallel", configs: e }), this;
  }
  /**
   * Create and insert a sub-timeline via a builder callback.
   * Returns the sub-timeline for individual targeting.
   */
  timeline(e, n) {
    const o = new Qo(this._canvas, this._engine);
    return this._tag && !n?.independent && o.setTag(this._tag), e(o), this._entries.push({
      type: "step",
      config: { timeline: o, independent: n?.independent }
    }), o;
  }
  pause(e) {
    return this._entries.push({ type: "pause", callback: e }), this;
  }
  play() {
    return new Promise((e) => {
      this._playResolve = e, this._state = "playing", this._lockEnabled && (this._locked = !0), this._captureInitialSnapshot(), this._emit("play"), this._context = {}, this._runEntries(e);
    });
  }
  stop() {
    this._stopAll();
    for (const e of this._subTimelines)
      e.stop();
    this._subTimelines.length = 0, this._state = "stopped", this._locked = !1, this._emit("stop"), this._playResolve?.(), this._playResolve = null;
  }
  reset(e) {
    if (e)
      return console.warn("[AlpineFlow] timeline.reset(true) is deprecated. Use timeline.restart() instead."), this.restart();
    this._stopAll();
    for (const n of this._subTimelines)
      n.stop();
    this._subTimelines.length = 0, this._restoreInitialSnapshot(), this._state = "idle", this._locked = !1, this._emit("reset");
  }
  async restart(e) {
    this._stopAll();
    for (const n of this._subTimelines)
      n.stop();
    return this._subTimelines.length = 0, this._restoreInitialSnapshot(), this._state = "idle", this._locked = !1, e?.direction === "backward" ? this._reversed = !0 : e?.direction === "forward" && (this._reversed = !1), this._emit("restart"), this.play();
  }
  reverse() {
    return this._reversed = !this._reversed, this._emit("reverse"), this;
  }
  loop(e) {
    return this._loopCount = e ?? 0, this;
  }
  lock(e) {
    return this._lockEnabled = e ?? !0, this;
  }
  respectReducedMotion(e) {
    return this._respectReducedMotion = e ?? !0, this;
  }
  on(e, n) {
    return this._listeners.has(e) || this._listeners.set(e, /* @__PURE__ */ new Set()), this._listeners.get(e).add(n), this;
  }
  /** Externally pause a playing timeline. Non-independent sub-timelines are also paused. */
  pausePlayback() {
    if (this._state === "playing") {
      this._state = "paused", this._lockEnabled && (this._locked = !1);
      for (const e of this._subTimelines)
        e.state === "playing" && e.pausePlayback();
      this._emit("pause");
    }
  }
  /** Resume a paused timeline. Non-independent sub-timelines are also resumed. */
  resumePlayback() {
    if (this._state === "paused") {
      this._state = "playing", this._lockEnabled && (this._locked = !0);
      for (const e of this._subTimelines)
        e.state === "paused" && e.resumePlayback();
      this._emit("resume");
      for (const e of this._pauseWaiters) e();
      this._pauseWaiters.clear();
    }
  }
  /** Check if reduced motion is active (OS preference + not opted out). */
  _isReducedMotion() {
    return Gs(this._respectReducedMotion);
  }
  // ── Internal: event emission ────────────────────────────────────────
  _emit(e, n) {
    const o = this._listeners.get(e);
    if (o)
      for (const i of o)
        i(n);
  }
  // ── Internal: snapshot management ───────────────────────────────────
  _captureInitialSnapshot() {
    if (!(this._initialSnapshot.size > 0))
      for (const e of this._entries)
        this._captureEntryTargets(e);
  }
  _captureEntryTargets(e) {
    if (e.type === "pause") return;
    const n = e.type === "parallel" ? e.configs : [e.config];
    for (const o of n) {
      const i = typeof o == "function" ? null : o;
      if (i)
        if (i.parallel)
          for (const r of i.parallel)
            this._captureStepTargets(r);
        else
          this._captureStepTargets(i);
    }
  }
  _captureStepTargets(e) {
    if (e.nodes) {
      for (const n of e.nodes)
        if (!this._initialSnapshot.has(n)) {
          const o = this._canvas.getNode(n);
          o && this._initialSnapshot.set(n, Nf(o));
        }
    }
    if (e.edges) {
      for (const n of e.edges)
        if (!this._initialEdgeSnapshot.has(n)) {
          const o = this._canvas.getEdge(n);
          o && this._initialEdgeSnapshot.set(n, $f(o));
        }
    }
  }
  _restoreInitialSnapshot() {
    for (const [e, n] of this._initialSnapshot) {
      const o = this._canvas.getNode(e);
      o && If(o, n);
    }
  }
  // ── Internal: handle management ─────────────────────────────────────
  _stopAll() {
    for (const e of this._activeHandles)
      e.stop();
    this._activeHandles = [];
  }
  // ── Internal: entry execution ───────────────────────────────────────
  async _runEntries(e) {
    const n = this._reversed ? [...this._entries].reverse() : this._entries;
    let o = this._loopCount;
    const i = async () => {
      for (let r = 0; r < n.length; r++) {
        if (this._state === "stopped" || this._state === "paused" && (await this._waitForResume(), this._state === "stopped"))
          return;
        const s = n[r];
        if (s.type === "pause") {
          await this._executePause(s);
          continue;
        }
        if (s.type === "parallel") {
          await this._executeParallel(s.configs, r);
          continue;
        }
        const a = s.config, l = typeof a == "function" ? a(this._makeContext(r)) : a;
        l.parallel ? await this._executeParallelSteps(l.parallel, r) : await this._executeStep(l, r);
      }
    };
    if (await i(), this._state !== "stopped" && o !== -1) {
      let r = 0;
      for (; this._state !== "stopped"; )
        if (o === 0) {
          this._restoreInitialSnapshot(), this._emit("loop", { iteration: r++ });
          try {
            await i();
          } catch {
            e();
            return;
          }
        } else if (o > 0) {
          if (o--, this._restoreInitialSnapshot(), this._emit("loop", { iteration: this._loopCount - o }), await i(), o <= 0) break;
        } else
          break;
    }
    this._state !== "stopped" && (this._state = "idle", this._locked = !1, this._emit("complete")), e();
  }
  _makeContext(e, n) {
    return {
      ...this._context,
      stepIndex: e,
      stepId: n
    };
  }
  // ── Internal: pause-playback wait ────────────────────────────────────
  /** Block until resumePlayback() is called. Used by _runEntries when externally paused. */
  _waitForResume() {
    return new Promise((e) => {
      this._pauseWaiters.add(e);
    });
  }
  // ── Internal: pause execution ───────────────────────────────────────
  _executePause(e) {
    return new Promise((n) => {
      this._state = "paused", this._lockEnabled && (this._locked = !1), this._emit("pause");
      const o = (i) => {
        i && Object.assign(this._context, i), this._state = "playing", this._lockEnabled && (this._locked = !0), this._emit("resume"), n();
      };
      e.callback?.(o);
    });
  }
  // ── Internal: parallel execution ────────────────────────────────────
  async _executeParallel(e, n) {
    const o = e.map(
      (i) => typeof i == "function" ? i(this._makeContext(n)) : i
    );
    await this._executeParallelSteps(o, n);
  }
  async _executeParallelSteps(e, n) {
    const o = e.map((i) => this._executeStep(i, n));
    await Promise.all(o);
  }
  // ── Internal: single step execution ─────────────────────────────────
  async _executeStep(e, n) {
    const o = this._isReducedMotion(), i = o ? 0 : e.duration ?? 300, r = o ? 0 : e.delay ?? 0, s = On(e.easing), a = this._makeContext(n, e.id);
    if (e.when && !e.when(a)) {
      if (e.else)
        return this._executeStep(e.else, n);
      this._emit("step-skipped", { index: n, id: e.id });
      return;
    }
    if (e.timeline) {
      const v = e.timeline;
      if (this._tag && !e.independent && v.setTag(this._tag), e.independent || this._subTimelines.push(v), this._emit("step", { index: n, id: e.id, timeline: v }), e.onStart?.(a), await v.play(), this._state === "stopped") return;
      if (e.onComplete?.(a), this._emit("step-complete", { timeline: v }), !e.independent) {
        const P = this._subTimelines.indexOf(v);
        P >= 0 && this._subTimelines.splice(P, 1);
      }
      return;
    }
    if (this._emit("step", { index: n, id: e.id }), e.onStart?.(a), e.await && (await this._resolveAwait(e, n), this._state === "stopped"))
      return;
    if (e.await && this._isAwaitOnlyStep(e))
      return e.onProgress?.(1, a), e.onComplete?.(a), this._emit("step-complete"), Promise.resolve();
    const { validNodeIds: l, validEdgeIds: c } = this._validateStepTargets(e, n);
    if (this._isEmptyStep(e, l, c))
      return e.onProgress?.(1, a), e.onComplete?.(a), this._emit("step-complete"), Promise.resolve();
    const d = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
    this._captureNodeFromValues(e, l, d, h);
    const u = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
    this._captureEdgeFromValues(e, c, u, f);
    const g = this._resolveFollowPath(e), p = this._createGuidePath(e), w = !!(e.viewport || e.fitView || e.panTo);
    let m = null, C = null;
    w && this._canvas.viewport && (m = { ...this._canvas.viewport }, C = this._resolveTargetViewport(e));
    const S = e.edgeTransition ?? "none", b = e.addEdges?.map((v) => v.id) ?? [], D = e.removeEdges?.filter((v) => this._canvas.getEdge(v)).slice() ?? [], M = {
      step: e,
      ctx: a,
      duration: i,
      delay: r,
      easing: s,
      validNodeIds: l,
      validEdgeIds: c,
      resolvedPathFn: g,
      guidePathEl: p,
      nodeFromDimensions: d,
      nodeFromStyles: h,
      edgeFromStrokeWidth: u,
      edgeFromColor: f,
      viewportFrom: m,
      viewportTarget: C,
      transition: S,
      addEdgeIds: b,
      removeEdgeIds: D
    };
    if (i === 0)
      return this._executeInstantStep(M);
    const T = this._prepareAnimatedEdges(e, S, b);
    return T && await T, g ? this._executeFollowPathStep(M) : this._executeAnimatedStep(M);
  }
  // ── Step decomposition: target validation ──────────────────────────
  /** Filter node/edge IDs to only those present on the canvas; warn in debug mode. */
  _validateStepTargets(e, n) {
    let o, i;
    if (e.nodes) {
      o = [];
      for (const r of e.nodes)
        this._canvas.getNode(r) ? o.push(r) : this._canvas.debug && console.warn(`[AlpineFlow] Animation step "${e.id ?? n}": node "${r}" not found, skipping`);
    }
    if (e.edges) {
      i = [];
      for (const r of e.edges)
        this._canvas.getEdge(r) ? i.push(r) : this._canvas.debug && console.warn(`[AlpineFlow] Animation step "${e.id ?? n}": edge "${r}" not found, skipping`);
    }
    return { validNodeIds: o, validEdgeIds: i };
  }
  // ── Step decomposition: empty-step check ───────────────────────────
  /** Return true when the step targets nodes/edges but has zero valid targets and nothing else to do. */
  _isEmptyStep(e, n, o) {
    const i = e.nodes && e.nodes.length > 0, r = e.edges && e.edges.length > 0, s = !!(e.viewport || e.fitView || e.panTo), a = !!(e.addEdges?.length || e.removeEdges?.length), l = i && (!n || n.length === 0), c = r && (!o || o.length === 0);
    return !!(l && c && !s && !a || l && !r && !s && !a || c && !i && !s && !a);
  }
  /** Check whether a step has only an await and no animation targets. */
  _isAwaitOnlyStep(e) {
    const n = e.nodes && e.nodes.length > 0, o = e.edges && e.edges.length > 0, i = !!(e.viewport || e.fitView || e.panTo), r = !!(e.addEdges?.length || e.removeEdges?.length);
    return !n && !o && !i && !r;
  }
  // ── Step decomposition: resolve awaitable ─────────────────────────
  /** Normalize and await the step's `await` field (Promise, handle, or thunk). */
  async _resolveAwait(e, n) {
    let o = e.await;
    if (o && (typeof o == "function" && (o = o()), o && typeof o == "object" && "finished" in o && !(o instanceof Promise) && (o = o.finished), o instanceof Promise))
      if (e.timeout && e.timeout > 0) {
        let i;
        const r = new Promise((a) => {
          i = setTimeout(() => a("timeout"), e.timeout);
        }), s = await Promise.race([o.then(() => "resolved"), r]);
        i !== void 0 && clearTimeout(i), s === "timeout" && this._emit("step-timeout", { index: n, id: e.id });
      } else
        await o;
  }
  // ── Step decomposition: capture from-values ────────────────────────
  /** Capture initial node dimensions and styles for interpolation. */
  _captureNodeFromValues(e, n, o, i) {
    if (n)
      for (const r of n) {
        const s = this._canvas.getNode(r);
        s && (s.dimensions && e.dimensions && o.set(r, { ...s.dimensions }), e.style && s.style && i.set(r, nn(s.style)));
      }
  }
  /** Capture initial edge strokeWidth and color for interpolation. */
  _captureEdgeFromValues(e, n, o, i) {
    if (n)
      for (const r of n) {
        const s = this._canvas.getEdge(r);
        s && (e.edgeStrokeWidth !== void 0 && s.strokeWidth !== void 0 && o.set(r, s.strokeWidth), e.edgeColor !== void 0 && s.color !== void 0 && i.set(r, s.color));
      }
  }
  // ── Step decomposition: followPath & guide path ────────────────────
  /** Resolve a followPath config to a callable PathFunction. */
  _resolveFollowPath(e) {
    if (!e.followPath) return null;
    if (typeof e.followPath == "function")
      return e.followPath;
    const n = Jo(e.followPath);
    return !n && this._canvas.debug && console.warn("[AlpineFlow] SVG path resolution unavailable (no DOM), followPath string ignored"), n;
  }
  /** Create a visible SVG guide path overlay for string-based followPath. */
  _createGuidePath(e) {
    if (!e.guidePath?.visible || typeof e.followPath != "string" || typeof document > "u")
      return null;
    const n = this._canvas.getEdgeSvgElement?.();
    if (!n) return null;
    const o = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return o.setAttribute("d", e.followPath), o.classList.add("flow-guide-path"), e.guidePath.class && o.classList.add(e.guidePath.class), n.appendChild(o), o;
  }
  // ── Step decomposition: instant execution (duration: 0) ────────────
  /** Handle an instant step (duration === 0), optionally with a delay. */
  _executeInstantStep(e) {
    const { step: n, ctx: o, delay: i, resolvedPathFn: r, validNodeIds: s, guidePathEl: a } = e;
    if (i > 0)
      return new Promise((l) => {
        const c = setTimeout(() => {
          this._applyStepFinal(n), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), l();
        }, i), d = {
          stop() {
            clearTimeout(c);
          }
        };
        this._activeHandles.push(d);
      });
    if (r && s) {
      const l = r(1);
      for (const c of s) {
        const d = this._canvas.getNode(c);
        d && (d.position.x = l.x, d.position.y = l.y);
      }
    }
    return this._applyStepFinal(n), a && n.guidePath?.autoRemove !== !1 && a.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), Promise.resolve();
  }
  // ── Step decomposition: pre-animation edge setup ───────────────────
  /** Add edges to the DOM and pre-hide them for transition animations. Returns a promise only when async work is needed. */
  _prepareAnimatedEdges(e, n, o) {
    if (e.addEdges && this._addEdges(e.addEdges), n !== "none" && o.length && e.addEdges)
      return new Promise((i) => {
        queueMicrotask(() => queueMicrotask(() => {
          n === "draw" ? this._applyEdgeDrawTransition(o, 0, "in") : n === "fade" && this._applyEdgeFadeTransition(o, 0, "in"), i();
        }));
      });
  }
  // ── Step decomposition: followPath animation ───────────────────────
  /** Execute an animated step using engine-based interpolation for followPath. */
  _executeFollowPathStep(e) {
    const {
      step: n,
      ctx: o,
      duration: i,
      delay: r,
      easing: s,
      validNodeIds: a,
      validEdgeIds: l,
      nodeFromDimensions: c,
      nodeFromStyles: d,
      edgeFromStrokeWidth: h,
      edgeFromColor: u,
      viewportFrom: f,
      viewportTarget: g,
      transition: p,
      addEdgeIds: w,
      removeEdgeIds: m,
      guidePathEl: C
    } = e, S = e.resolvedPathFn;
    return new Promise((b) => {
      const D = this._engine.register((M) => {
        if (this._state === "stopped")
          return b(), !0;
        const T = Math.min(M / i, 1), v = s(T);
        if (a) {
          const P = S(v);
          for (const $ of a) {
            const x = this._canvas.getNode($);
            x && (x.position.x = P.x, x.position.y = P.y);
          }
        }
        return this._interpolateFollowPathTick(
          n,
          v,
          a,
          l,
          c,
          d,
          h,
          u,
          f,
          g
        ), this._tickEdgeTransitions(p, w, m, v), n.onProgress?.(T, o), T >= 1 ? (this._cleanupEdgeTransitions(p, w, m), m.length && this._removeEdges(m), this._applyStepInstant(n), C && n.guidePath?.autoRemove !== !1 && C.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), b(), !0) : !1;
      }, r);
      this._activeHandles.push(D);
    });
  }
  /** Per-tick interpolation for properties during followPath animation. */
  _interpolateFollowPathTick(e, n, o, i, r, s, a, l, c, d) {
    if (o && e.dimensions)
      for (const h of o) {
        const u = this._canvas.getNode(h), f = r.get(h);
        !u || !f || !u.dimensions || (e.dimensions.width !== void 0 && (u.dimensions.width = Ze(f.width, e.dimensions.width, n)), e.dimensions.height !== void 0 && (u.dimensions.height = Ze(f.height, e.dimensions.height, n)));
      }
    if (o && e.style) {
      const h = nn(e.style);
      for (const u of o) {
        const f = this._canvas.getNode(u), g = s.get(u);
        f && g && (f.style = Js(g, h, n));
      }
    }
    if (i && e.edgeStrokeWidth !== void 0)
      for (const h of i) {
        const u = this._canvas.getEdge(h), f = a.get(h);
        u && (f !== void 0 ? u.strokeWidth = Ze(f, e.edgeStrokeWidth, n) : u.strokeWidth = e.edgeStrokeWidth);
      }
    if (i && e.edgeColor !== void 0)
      for (const h of i) {
        const u = this._canvas.getEdge(h), f = l.get(h);
        u && (f !== void 0 && typeof f == "string" ? u.color = Zo(f, e.edgeColor, n) : u.color = e.edgeColor);
      }
    if (c && d && this._canvas.viewport) {
      const h = cu(c, d, n, {
        minZoom: this._canvas.minZoom,
        maxZoom: this._canvas.maxZoom
      });
      this._canvas.viewport.x = h.x, this._canvas.viewport.y = h.y, this._canvas.viewport.zoom = h.zoom;
    }
  }
  // ── Step decomposition: edge transition helpers ────────────────────
  /** Apply edge transitions (draw/fade) for a single animation tick. */
  _tickEdgeTransitions(e, n, o, i) {
    e === "draw" ? (n.length && this._applyEdgeDrawTransition(n, i, "in"), o.length && this._applyEdgeDrawTransition(o, i, "out")) : e === "fade" && (n.length && this._applyEdgeFadeTransition(n, i, "in"), o.length && this._applyEdgeFadeTransition(o, i, "out"));
  }
  /** Clean up edge transition styles at the end of animation. */
  _cleanupEdgeTransitions(e, n, o) {
    e === "draw" ? (this._cleanupEdgeDrawTransition(n), this._cleanupEdgeDrawTransition(o)) : e === "fade" && (this._cleanupEdgeFadeTransition(n), this._cleanupEdgeFadeTransition(o));
  }
  // ── Step decomposition: canvas.animate() execution ─────────────────
  /** Execute an animated step using canvas.animate() for standard interpolation. */
  _executeAnimatedStep(e) {
    const {
      step: n,
      ctx: o,
      duration: i,
      delay: r,
      validNodeIds: s,
      validEdgeIds: a,
      viewportFrom: l,
      viewportTarget: c,
      transition: d,
      addEdgeIds: h,
      removeEdgeIds: u,
      guidePathEl: f
    } = e;
    return new Promise((g) => {
      const p = this._buildAnimateTargets(
        n,
        s,
        a,
        l,
        c
      ), w = Object.keys(p.nodes || {}).length > 0 || Object.keys(p.edges || {}).length > 0 || p.viewport;
      if (!w && !h.length && !u.length) {
        n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), g();
        return;
      }
      if (w) {
        const m = this._canvas.animate(p, {
          duration: i,
          easing: n.easing,
          delay: r,
          onProgress: (C) => {
            if (this._state === "stopped") {
              m.stop(), g();
              return;
            }
            this._tickEdgeTransitions(d, h, u, C), n.onProgress?.(C, o);
          },
          onComplete: () => {
            this._cleanupEdgeTransitions(d, h, u), u.length && this._removeEdges(u), this._applyStepInstant(n), f && n.guidePath?.autoRemove !== !1 && f.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), g();
          }
        });
        this._activeHandles.push({ stop: () => m.stop() });
      } else
        this._executeEdgeLifecycleOnly(e, g);
    });
  }
  /** Build AnimateTargets from step config for canvas.animate(). */
  _buildAnimateTargets(e, n, o, i, r) {
    const s = {};
    if (n) {
      s.nodes = {};
      for (const a of n) {
        const l = {};
        e.position && (l.position = { ...e.position }), e.dimensions && (l.dimensions = { ...e.dimensions }), e.style !== void 0 && (l.style = e.style), e.class !== void 0 && (l.class = e.class), e.data !== void 0 && (l.data = e.data), e.selected !== void 0 && (l.selected = e.selected), e.zIndex !== void 0 && (l.zIndex = e.zIndex), s.nodes[a] = l;
      }
    }
    if (o) {
      s.edges = {};
      for (const a of o) {
        const l = {};
        e.edgeColor !== void 0 && (l.color = e.edgeColor), e.edgeStrokeWidth !== void 0 && (l.strokeWidth = e.edgeStrokeWidth), e.edgeLabel !== void 0 && (l.label = e.edgeLabel), e.edgeAnimated !== void 0 && (l.animated = e.edgeAnimated), e.edgeClass !== void 0 && (l.class = e.edgeClass), s.edges[a] = l;
      }
    }
    return r && i && (s.viewport = {
      pan: { x: r.x, y: r.y },
      zoom: r.zoom
    }), s;
  }
  /** Run edge lifecycle transitions (draw/fade) via the engine when there are no other animatable targets. */
  _executeEdgeLifecycleOnly(e, n) {
    const { step: o, ctx: i, duration: r, delay: s, transition: a, addEdgeIds: l, removeEdgeIds: c, guidePathEl: d } = e, h = this._engine.register((u) => {
      if (this._state === "stopped")
        return n(), !0;
      const f = Math.min(u / r, 1);
      return this._tickEdgeTransitions(a, l, c, f), o.onProgress?.(f, i), f >= 1 ? (this._cleanupEdgeTransitions(a, l, c), c.length && this._removeEdges(c), d && o.guidePath?.autoRemove !== !1 && d.remove(), o.onProgress?.(1, i), o.onComplete?.(i), this._emit("step-complete"), n(), !0) : !1;
    }, s);
    this._activeHandles.push(h);
  }
  // ── Internal: apply step properties ─────────────────────────────────
  /** Apply all properties of a step at their final values (for instant steps). */
  _applyStepFinal(e) {
    if (e.addEdges && this._addEdges(e.addEdges), e.removeEdges && this._removeEdges(e.removeEdges), e.nodes)
      for (const n of e.nodes) {
        const o = this._canvas.getNode(n);
        o && (e.position && (e.position.x !== void 0 && (o.position.x = e.position.x), e.position.y !== void 0 && (o.position.y = e.position.y)), e.class !== void 0 && (o.class = e.class), e.data !== void 0 && Object.assign(o.data, e.data), e.selected !== void 0 && (o.selected = e.selected), e.zIndex !== void 0 && (o.zIndex = e.zIndex), e.dimensions && o.dimensions && (e.dimensions.width !== void 0 && (o.dimensions.width = e.dimensions.width), e.dimensions.height !== void 0 && (o.dimensions.height = e.dimensions.height)), e.style !== void 0 && (o.style = e.style));
      }
    this._applyViewportFinal(e), this._applyStepInstant(e);
  }
  /** Apply instant-swap edge properties (not interpolated). */
  _applyStepInstant(e) {
    if (e.edges)
      for (const n of e.edges) {
        const o = this._canvas.getEdge(n);
        o && (e.edgeAnimated !== void 0 && (o.animated = e.edgeAnimated), e.edgeClass !== void 0 && (o.class = e.edgeClass), e.edgeLabel !== void 0 && (o.label = e.edgeLabel));
      }
  }
  // ── Internal: edge lifecycle ───────────────────────────────────────
  /** Add edges to the canvas edges array. */
  _addEdges(e) {
    this._canvas.edges.push(...e), this._canvas._rebuildEdgeMap?.();
  }
  /** Remove edges from the canvas edges array by ID. */
  _removeEdges(e) {
    for (const n of e) {
      const o = this._canvas.edges.findIndex((i) => i.id === n);
      o !== -1 && this._canvas.edges.splice(o, 1);
    }
    this._canvas._rebuildEdgeMap?.();
  }
  /** Apply draw transition on each tick for added/removed edges. */
  _applyEdgeDrawTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgePathElement?.(i);
      r && kf(r, n, o);
    }
  }
  /** Clean up draw transition styles. */
  _cleanupEdgeDrawTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgePathElement?.(n);
      o && Lf(o);
    }
  }
  /** Apply fade transition on each tick for added/removed edges. */
  _applyEdgeFadeTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgeElement?.(i);
      r && Mf(r, n, o);
    }
  }
  /** Clean up fade transition styles. */
  _cleanupEdgeFadeTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgeElement?.(n);
      o && Tf(o);
    }
  }
  // ── Internal: viewport helpers ──────────────────────────────────
  /** Compute the target viewport for a step (viewport, fitView, or panTo). */
  _resolveTargetViewport(e) {
    const n = this._canvas.viewport;
    return n ? e.fitView ? this._computeFitViewViewport(e) : e.panTo ? this._computePanToViewport(e.panTo) : e.viewport ? {
      x: e.viewport.x ?? n.x,
      y: e.viewport.y ?? n.y,
      zoom: e.viewport.zoom ?? n.zoom
    } : null : null;
  }
  /** Compute the viewport that fits all (or specified) nodes with padding. */
  _computeFitViewViewport(e) {
    const n = this._canvas.getContainerDimensions?.();
    if (!n) return null;
    const o = e.nodes ? e.nodes.map((s) => this._canvas.getNode(s)).filter((s) => !!s) : this._canvas.nodes;
    if (o.length === 0) return null;
    const i = Nt(o), r = e.fitViewPadding ?? 0.1;
    return Fn(
      i,
      n.width,
      n.height,
      this._canvas.minZoom ?? 0.5,
      this._canvas.maxZoom ?? 2,
      r
    );
  }
  /** Compute the viewport that centers on a given node. */
  _computePanToViewport(e) {
    const n = this._canvas.getNode(e);
    if (!n) return null;
    const o = this._canvas.viewport;
    if (!o) return null;
    const i = this._canvas.getContainerDimensions?.();
    if (!i) return null;
    const r = n.dimensions?.width ?? ye, s = n.dimensions?.height ?? we, a = n.position.x + r / 2, l = n.position.y + s / 2;
    return {
      x: i.width / 2 - a * o.zoom,
      y: i.height / 2 - l * o.zoom,
      zoom: o.zoom
    };
  }
  /** Apply viewport at final values (for instant steps). */
  _applyViewportFinal(e) {
    const n = this._resolveTargetViewport(e);
    !n || !this._canvas.viewport || (this._canvas.viewport.x = n.x, this._canvas.viewport.y = n.y, this._canvas.viewport.zoom = n.zoom);
  }
}
const mr = /* @__PURE__ */ new Map();
function Ht(t, e) {
  mr.set(t, e);
}
function Df(t) {
  return mr.get(t);
}
const at = "http://www.w3.org/2000/svg", Rf = {
  create(t, e) {
    const n = document.createElementNS(at, "circle");
    if (n.setAttribute("r", String(e.size ?? 4)), n.setAttribute("fill", e.color ?? "#8B5CF6"), n.classList.add("flow-edge-particle"), e.class)
      for (const o of e.class.split(" "))
        o && n.classList.add(o);
    return t.appendChild(n), n;
  },
  update(t, { x: e, y: n }) {
    t.setAttribute("cx", String(e)), t.setAttribute("cy", String(n));
  },
  destroy(t) {
    t.remove();
  }
}, Hf = {
  create(t, e) {
    const n = document.createElementNS(at, "g"), o = e.size ?? 6, i = e.color ?? "#8B5CF6", r = document.createElementNS(at, "circle");
    r.setAttribute("r", String(o * 1.5)), r.setAttribute("fill", i), r.setAttribute("opacity", "0.3"), n.appendChild(r);
    const s = document.createElementNS(at, "circle");
    if (s.setAttribute("r", String(o)), s.setAttribute("fill", i), n.appendChild(s), e.class)
      for (const a of e.class.split(" "))
        a && n.classList.add(a);
    return t.appendChild(n), n;
  },
  update(t, { x: e, y: n, elapsed: o }) {
    const r = 1 + 0.2 * Math.sin(o * 1e-3 * 2 * Math.PI * 2);
    t.setAttribute("transform", `translate(${e},${n}) scale(${r})`);
  },
  destroy(t) {
    t.remove();
  }
}, Ff = {
  create(t, e) {
    const n = document.createElementNS(at, "rect"), o = e.length ?? 30, i = e.width ?? 4;
    if (n.setAttribute("width", String(o)), n.setAttribute("height", String(i)), n.setAttribute("rx", String(i / 2)), n.setAttribute("fill", e.color ?? "#8B5CF6"), n.setAttribute("opacity", "0.8"), e.class)
      for (const r of e.class.split(" "))
        r && n.classList.add(r);
    return t.appendChild(n), n;
  },
  update(t, { x: e, y: n, velocity: o }) {
    const i = Math.atan2(o.y, o.x) * (180 / Math.PI), r = parseFloat(t.getAttribute("width") ?? "30"), s = parseFloat(t.getAttribute("height") ?? "4");
    t.setAttribute(
      "transform",
      `translate(${e - r / 2},${n - s / 2}) rotate(${i},${r / 2},${s / 2})`
    );
  },
  destroy(t) {
    t.remove();
  }
}, zf = {
  create(t, e) {
    const n = document.createElementNS(at, "circle");
    if (n.setAttribute("r", String(e.size ?? 6)), n.setAttribute("fill", "none"), n.setAttribute("stroke", e.color ?? "#8B5CF6"), n.setAttribute("stroke-width", "2"), e.class)
      for (const o of e.class.split(" "))
        o && n.classList.add(o);
    return t.appendChild(n), n;
  },
  update(t, { x: e, y: n, progress: o }) {
    const r = 1 + o * 2, s = Math.max(0, 1 - o);
    t.setAttribute("cx", "0"), t.setAttribute("cy", "0"), t.setAttribute("transform", `translate(${e},${n}) scale(${r})`), t.setAttribute("opacity", String(s));
  },
  destroy(t) {
    t.remove();
  }
}, Of = {
  create(t, e) {
    const n = e.size ?? 16, o = e.href ?? "";
    let i;
    if (o.startsWith("#") ? (i = document.createElementNS(at, "use"), i.setAttribute("href", o), i.setAttribute("width", String(n)), i.setAttribute("height", String(n))) : (i = document.createElementNS(at, "image"), i.setAttribute("href", o), i.setAttribute("width", String(n)), i.setAttribute("height", String(n))), e.class)
      for (const r of e.class.split(" "))
        r && i.classList.add(r);
    return t.appendChild(i), i;
  },
  update(t, { x: e, y: n }) {
    const o = parseFloat(t.getAttribute("width") ?? "16");
    t.setAttribute("x", String(e - o / 2)), t.setAttribute("y", String(n - o / 2));
  },
  destroy(t) {
    t.remove();
  }
};
Ht("circle", Rf);
Ht("orb", Hf);
Ht("beam", Ff);
Ht("pulse", zf);
Ht("image", Of);
function Vf(t) {
  const e = t.match(/^([\d.]+)(ms|s)?$/);
  if (!e) return 2e3;
  const n = parseFloat(e[1]);
  return e[2] === "ms" ? n : n * 1e3;
}
function Ui(t, e, n) {
  if (t.speed !== void 0 && t.speed > 0)
    return t.duration !== void 0 && console.warn("[AlpineFlow] Both speed and duration provided for particle; speed takes precedence."), e / t.speed * 1e3;
  const o = t.duration ?? n;
  return typeof o == "number" ? o : Vf(o);
}
function Bf(t) {
  function e(o, i, r = {}, s = {}) {
    const a = r.renderer ?? "circle", l = Df(a);
    if (!l) {
      B("particle", `_fireParticleOnPath: unknown renderer "${a}"`);
      return;
    }
    const c = t._containerStyles, d = r.size ?? s.size ?? (parseFloat(c?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), h = r.color ?? s.color ?? c?.getPropertyValue("--flow-edge-dot-fill").trim() ?? tn, u = s.durationFallback ?? c?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", f = o.getTotalLength(), g = Ui(r, f, u), p = { ...r, size: d, color: h }, w = l.create(i, p), m = o.getPointAtLength(0), C = {
      x: m.x,
      y: m.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength: f,
      elapsed: 0
    };
    l.update(w, C);
    let S;
    const b = new Promise((P) => {
      S = P;
    }), D = () => {
      typeof r.onComplete == "function" && r.onComplete(), S();
    }, M = s.wrapOnComplete ? s.wrapOnComplete(D) : D, T = {
      element: w,
      renderer: l,
      pathEl: o,
      startElapsed: -1,
      // set on first engine tick
      ms: g,
      onComplete: M,
      currentPosition: { x: m.x, y: m.y }
    };
    return t._activeParticles.add(T), t._particleEngineHandle || (t._particleEngineHandle = zn.register((P) => t._tickParticles(P))), {
      getCurrentPosition() {
        return t._activeParticles.has(T) ? { ...T.currentPosition } : null;
      },
      stop() {
        t._activeParticles.has(T) && (T.renderer.destroy(T.element), t._activeParticles.delete(T), M());
      },
      get finished() {
        return b;
      }
    };
  }
  function n(o, i = {}) {
    const r = t.getEdgeSvgElement?.();
    if (!r) {
      B("particle", "sendParticleAlongPath: SVG layer unavailable");
      return;
    }
    const s = document.createElementNS("http://www.w3.org/2000/svg", "path");
    s.setAttribute("d", o), s.style.display = "none", r.appendChild(s);
    const a = e(s, r, i, {
      wrapOnComplete: (l) => () => {
        l(), s.remove();
      }
    });
    if (!a) {
      s.remove();
      return;
    }
    return B("particle", "sendParticleAlongPath", { path: o.slice(0, 40) }), a;
  }
  return {
    // ── Particle tick loop ────────────────────────────────────────────────
    /**
     * Engine tick callback — processes all active particles in one pass.
     * Receives `elapsed` (ms since engine registration) from the engine.
     * Returns true to unregister from engine when all particles are done.
     */
    _tickParticles(o) {
      const i = /* @__PURE__ */ new Map();
      for (const r of t._activeParticles) {
        r.startElapsed < 0 && (r.startElapsed = o);
        const s = (o - r.startElapsed) / r.ms;
        if (s >= 1 || !r.element.parentNode) {
          r.renderer.destroy(r.element), typeof r.onComplete == "function" && r.onComplete(), t._activeParticles.delete(r);
          continue;
        }
        let a = i.get(r.pathEl);
        a === void 0 && (a = r.pathEl.getTotalLength(), i.set(r.pathEl, a));
        const l = r.pathEl.getPointAtLength(s * a), c = {
          x: l.x,
          y: l.y,
          progress: s,
          velocity: {
            x: l.x - r.currentPosition.x,
            y: l.y - r.currentPosition.y
          },
          pathLength: a,
          elapsed: o - r.startElapsed
        };
        r.renderer.update(r.element, c), r.currentPosition = { x: l.x, y: l.y };
      }
      return t._activeParticles.size === 0 ? (t._particleEngineHandle = null, !0) : !1;
    },
    // ── Send particle along edge ──────────────────────────────────────────
    /**
     * Fire a particle along an edge path. The particle is an SVG element
     * that follows the edge's `<path>` element using `getPointAtLength`.
     */
    sendParticle(o, i = {}) {
      const r = t._edgeSvgElements.get(o);
      if (r && r.style.display === "none") return;
      const s = t.getEdge(o);
      if (!s) {
        B("particle", `sendParticle: edge "${o}" not found`);
        return;
      }
      const a = t.getEdgePathElement(o);
      if (!a) {
        B("particle", `sendParticle: no path element for edge "${o}"`);
        return;
      }
      if (!a.getAttribute("d")) {
        B("particle", `sendParticle: edge "${o}" path has no d attribute`);
        return;
      }
      const c = t.getEdgeElement(o);
      if (!c) return;
      const d = t._containerStyles, h = i.size ?? s.particleSize ?? (parseFloat(d?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), u = i.color ?? s.particleColor ?? d?.getPropertyValue("--flow-edge-dot-fill").trim() ?? tn, f = s.animationDuration ?? d?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", g = e(a, c, i, {
        size: h,
        color: u,
        durationFallback: f
      });
      return g && B("particle", `sendParticle on edge "${o}"`, { size: h, color: u, duration: i.duration }), g;
    },
    // ── Send particle along arbitrary SVG path ───────────────────────────
    /**
     * Fire a particle along an arbitrary SVG path string, not tied to an
     * existing edge. A temporary invisible `<path>` element is injected
     * into the edge SVG layer and removed when the particle finishes.
     */
    sendParticleAlongPath(o, i = {}) {
      return n(o, i);
    },
    // ── Send particle between two nodes ──────────────────────────────────
    /**
     * Fire a particle along a straight line between two node centers.
     * Delegates to sendParticleAlongPath after computing the SVG path.
     */
    sendParticleBetween(o, i, r = {}) {
      const s = t.getNode(o);
      if (!s) {
        B("particle", `sendParticleBetween: source node "${o}" not found`);
        return;
      }
      const a = t.getNode(i);
      if (!a) {
        B("particle", `sendParticleBetween: target node "${i}" not found`);
        return;
      }
      const l = s.position.x + (s.dimensions?.width ?? 150) / 2, c = s.position.y + (s.dimensions?.height ?? 40) / 2, d = a.position.x + (a.dimensions?.width ?? 150) / 2, h = a.position.y + (a.dimensions?.height ?? 40) / 2, u = `M ${l} ${c} L ${d} ${h}`;
      return B("particle", `sendParticleBetween "${o}" -> "${i}"`, { path: u }), n(u, r);
    },
    // ── Burst: sequenced multi-particle emission ─────────────────────────
    /**
     * Fire multiple particles along a single edge with staggered timing.
     * An optional `variant` function customizes each particle individually.
     */
    sendParticleBurst(o, i) {
      const { count: r, stagger: s = 100, variant: a, ...l } = i, c = [], d = [];
      for (let u = 0; u < r; u++) {
        const f = a ? { ...l, ...a(u, r) } : { ...l };
        if (u === 0)
          c.push(this.sendParticle(o, f));
        else {
          const g = setTimeout(() => {
            c.push(this.sendParticle(o, f));
          }, u * s);
          d.push(g);
        }
      }
      const h = () => c.filter((u) => u != null);
      return {
        get handles() {
          return h();
        },
        get finished() {
          return new Promise((u) => {
            setTimeout(() => {
              Promise.all(h().map((f) => f.finished)).then(() => u());
            }, r * s + 50);
          });
        },
        stopAll() {
          for (const u of d)
            clearTimeout(u);
          for (const u of h())
            u.stop();
        }
      };
    },
    // ── Converging: fan-in particle visualization ───────────────────────
    /**
     * Fire particles from multiple edges that all arrive at (or depart from)
     * a target node simultaneously. For 'arrival' synchronization, shorter
     * paths get shorter durations and delayed starts so all particles reach
     * the target at the same time.
     */
    sendConverging(o, i) {
      const { targetNodeId: r, synchronize: s = "arrival", onAllArrived: a, ...l } = i, c = [], d = [];
      if (s === "arrival") {
        const u = o.map((p) => {
          const m = t.getEdgePathElement(p)?.getTotalLength() ?? 0;
          return { id: p, length: m };
        }).filter((p) => p.length > 0);
        if (u.length === 0) {
          const p = Promise.resolve();
          return { get handles() {
            return [];
          }, finished: p, stopAll() {
          } };
        }
        const f = Math.max(...u.map((p) => p.length)), g = Ui(l, f, "2s");
        for (const { id: p, length: w } of u) {
          const m = w / f, C = g * m, S = g - C;
          if (S <= 0) {
            const b = this.sendParticle(p, { ...l, duration: C });
            b && c.push(b);
          } else {
            const b = setTimeout(() => {
              const D = this.sendParticle(p, { ...l, duration: C });
              D && c.push(D);
            }, S);
            d.push(b);
          }
        }
      } else
        for (const u of o) {
          const f = this.sendParticle(u, l);
          f && c.push(f);
        }
      const h = new Promise((u) => {
        setTimeout(() => {
          Promise.all(c.map((g) => g.finished)).then(() => {
            a?.(), u();
          });
        }, s === "arrival" ? 100 : 0);
      });
      return {
        get handles() {
          return c;
        },
        finished: h,
        stopAll() {
          for (const u of d)
            clearTimeout(u);
          for (const u of c)
            u.stop();
        }
      };
    },
    // ── Cleanup ───────────────────────────────────────────────────────────
    /**
     * Stop the particle engine and remove all active particles from the DOM.
     * Called during canvas destroy().
     */
    destroyParticles() {
      t._particleEngineHandle?.stop(), t._particleEngineHandle = null;
      for (const o of t._activeParticles)
        o.renderer.destroy(o.element);
      t._activeParticles.clear();
    }
  };
}
class Xf {
  constructor(e, n) {
    this.name = e, this._host = n;
  }
  animate(e, n) {
    const o = [...n?.tags ?? []];
    return n?.tag && o.push(n.tag), this._host.animate(e, { ...n, tag: this.name, tags: o });
  }
  update(e, n) {
    const o = [...n?.tags ?? []];
    return n?.tag && o.push(n.tag), this._host.update(e, { ...n, tag: this.name, tags: o });
  }
  sendParticle(e, n) {
    return this._host.sendParticle?.(e, { ...n, tag: this.name });
  }
  sendParticleAlongPath(e, n) {
    return this._host.sendParticleAlongPath?.(e, { ...n, tag: this.name });
  }
  sendParticleBetween(e, n, o) {
    return this._host.sendParticleBetween?.(e, n, { ...o, tag: this.name });
  }
  sendParticleBurst(e, n) {
    return this._host.sendParticleBurst(e, { ...n, tag: this.name });
  }
  sendConverging(e, n) {
    return this._host.sendConverging(e, { ...n, tag: this.name });
  }
  timeline() {
    const e = this._host.timeline?.();
    return e && typeof e.setTag == "function" && e.setTag(this.name), e;
  }
  cancelAll(e) {
    this._host.cancelAll({ tag: this.name }, e);
  }
  pauseAll() {
    this._host.pauseAll({ tag: this.name });
  }
  resumeAll() {
    this._host.resumeAll({ tag: this.name });
  }
  get handles() {
    return this._host.getHandles({ tag: this.name });
  }
}
const Do = 1, Ro = 1 / 60;
class Ye {
  constructor(e) {
    this._virtualTime = 0, this._inFlight = /* @__PURE__ */ new Map(), this._state = structuredClone(e);
  }
  /** Current virtual time in milliseconds. */
  get virtualTime() {
    return this._virtualTime;
  }
  /** Number of currently in-flight animations. */
  get inFlightCount() {
    return this._inFlight.size;
  }
  /** Return a deep-cloned copy of the current virtual canvas state. */
  getState() {
    return structuredClone(this._state);
  }
  /** Advance virtual clock by `dt` seconds and step all in-flight animations. */
  advance(e) {
    if (!(e <= 0)) {
      this._virtualTime += e * 1e3;
      for (const [n, o] of this._inFlight)
        this._stepAnimation(o, e), this._isSettled(o) && this._inFlight.delete(n);
    }
  }
  /** Apply a recorded event to the virtual state. */
  applyEvent(e) {
    switch (e.type) {
      case "animate":
      case "update":
        this._applyAnimate(e);
        break;
      case "node-add": {
        const n = e.args.nodes;
        if (Array.isArray(n))
          for (const o of n)
            o?.id && (this._state.nodes[o.id] = structuredClone(o));
        else n?.id ? this._state.nodes[n.id] = structuredClone(n) : e.args.id && e.args.node && (this._state.nodes[e.args.id] = structuredClone(e.args.node));
        break;
      }
      case "node-remove": {
        const n = e.args.ids;
        if (Array.isArray(n))
          for (const o of n)
            delete this._state.nodes[o];
        else typeof n == "string" ? delete this._state.nodes[n] : e.args.id && delete this._state.nodes[e.args.id];
        break;
      }
      case "edge-add": {
        const n = e.args.edges;
        if (Array.isArray(n))
          for (const o of n)
            o?.id && (this._state.edges[o.id] = structuredClone(o));
        else n?.id ? this._state.edges[n.id] = structuredClone(n) : e.args.id && e.args.edge && (this._state.edges[e.args.id] = structuredClone(e.args.edge));
        break;
      }
      case "edge-remove": {
        const n = e.args.ids;
        if (Array.isArray(n))
          for (const o of n)
            delete this._state.edges[o];
        else typeof n == "string" ? delete this._state.edges[n] : e.args.id && delete this._state.edges[e.args.id];
        break;
      }
      case "viewport-change":
        Object.assign(this._state.viewport, e.args);
        break;
    }
  }
  /** Restore the engine from a Checkpoint. */
  restoreCheckpoint(e) {
    this._state = structuredClone(e.canvas), this._virtualTime = e.t, this._inFlight.clear();
    for (const n of e.inFlight) {
      const o = structuredClone(n);
      this._rehydrateAnim(o), this._inFlight.set(o.handleId, o);
    }
  }
  /** Capture the current engine state as a serializable Checkpoint payload. */
  captureCheckpointData() {
    return {
      canvas: structuredClone(this._state),
      inFlight: [...this._inFlight.values()].map((e) => this._serializeAnim(e)),
      tagRegistry: {}
    };
  }
  // ── Private helpers ───────────────────────────────────────────────────────
  _applyAnimate(e) {
    const n = e.args.handleId ?? `virt-${this._virtualTime.toFixed(3)}-${this._inFlight.size}`;
    e.args.handleId || console.warn("[AlpineFlow VirtualEngine] animate event missing handleId — determinism not guaranteed for this event");
    const o = e.args.targets ?? {}, i = e.args.options ?? {}, r = i.motion, s = r ? nr(r) ?? void 0 : void 0, a = {
      handleId: n,
      type: s ? s.type : "eased",
      targets: structuredClone(o),
      startTime: this._virtualTime,
      duration: i.duration,
      easing: i.easing,
      motion: s,
      direction: "forward",
      currentValues: {},
      _motion: s
    };
    this._initAnim(a), this._inFlight.set(n, a);
  }
  _initAnim(e) {
    const n = {}, o = {};
    if (this._collectNumericProperties(e.targets, n, o, this._state), e._from = n, e.type === "eased")
      e._easingFn = On(e.easing);
    else {
      e._physicsStates = /* @__PURE__ */ new Map();
      for (const i of Object.keys(n))
        e._physicsStates.set(i, {
          value: n[i],
          velocity: 0,
          target: o[i] ?? n[i],
          settled: !1
        });
    }
  }
  _collectNumericProperties(e, n, o, i) {
    for (const [s, a] of Object.entries(e.nodes ?? {})) {
      const l = i.nodes[s];
      if (!l)
        continue;
      const c = a.position;
      c?.x !== void 0 && (n[`nodes.${s}.position.x`] = l.position?.x ?? 0, o[`nodes.${s}.position.x`] = c.x), c?.y !== void 0 && (n[`nodes.${s}.position.y`] = l.position?.y ?? 0, o[`nodes.${s}.position.y`] = c.y);
    }
    const r = e.viewport;
    r?.pan?.x !== void 0 && (n["viewport.x"] = i.viewport.x, o["viewport.x"] = r.pan.x), r?.pan?.y !== void 0 && (n["viewport.y"] = i.viewport.y, o["viewport.y"] = r.pan.y), r?.zoom !== void 0 && (n["viewport.zoom"] = i.viewport.zoom, o["viewport.zoom"] = r.zoom);
  }
  _rehydrateAnim(e) {
    if (e._motion = e.motion, e.type === "eased") {
      e._easingFn = On(e.easing), e._from = { ...e.currentValues ?? {} };
      return;
    }
    if (e.integratorState) {
      e._physicsStates = /* @__PURE__ */ new Map();
      for (const [n, o] of Object.entries(e.integratorState))
        e._physicsStates.set(n, {
          value: o.value ?? 0,
          velocity: o.velocity ?? 0,
          target: o.target ?? 0,
          settled: o.settled ?? !1
        });
    }
  }
  _serializeAnim(e) {
    const n = {};
    if (e._physicsStates)
      for (const [o, i] of e._physicsStates)
        n[o] = {
          velocity: i.velocity,
          value: i.value,
          target: i.target,
          settled: i.settled
        };
    return structuredClone({
      handleId: e.handleId,
      type: e.type,
      targets: e.targets,
      startTime: e.startTime,
      duration: e.duration,
      easing: e.easing,
      motion: e.motion,
      direction: e.direction,
      integratorState: e._physicsStates ? n : e.integratorState,
      currentValues: e.currentValues
    });
  }
  _stepAnimation(e, n) {
    e.type === "eased" ? this._stepEased(e, n) : e._physicsStates && this._stepPhysics(e, n);
  }
  _stepEased(e, n) {
    if (!e.duration || !e._easingFn || !e._from)
      return;
    const o = this._virtualTime - e.startTime, i = e.duration > 0 ? Math.min(o / e.duration, 1) : 1, r = e._easingFn(i);
    for (const s of Object.keys(e._from)) {
      const a = e._from[s], l = this._getTargetValue(s, e.targets) ?? a, c = Ze(a, l, r);
      e.currentValues[s] = c, this._applyValueToState(s, c);
    }
  }
  _stepPhysics(e, n) {
    if (!e._physicsStates || !e._motion)
      return;
    const o = e._motion;
    for (const [i, r] of e._physicsStates)
      if (!r.settled) {
        switch (o.type) {
          case "spring":
            Qs(r, o, n);
            break;
          case "decay":
            Ko(r, o, n);
            break;
          case "inertia":
            er(r, o, n, i);
            break;
          case "keyframes": {
            const s = o, a = s.duration ?? 5e3, l = a > 0 ? Math.min((this._virtualTime - e.startTime) / a, 1) : 1;
            tr(r, s, l, i), l >= 1 && (r.settled = !0);
            break;
          }
        }
        e.currentValues[i] = r.value, this._applyValueToState(i, r.value);
      }
  }
  _getTargetValue(e, n) {
    const o = e.split(".");
    if (o[0] === "nodes" && o.length >= 4) {
      const i = o[1], r = n.nodes?.[i];
      if (!r)
        return;
      if (o[2] === "position" && o[3] === "x")
        return r.position?.x;
      if (o[2] === "position" && o[3] === "y")
        return r.position?.y;
    }
    if (o[0] === "viewport") {
      const i = n.viewport;
      if (o[1] === "x") return i?.pan?.x;
      if (o[1] === "y") return i?.pan?.y;
      if (o[1] === "zoom") return i?.zoom;
    }
  }
  _applyValueToState(e, n) {
    const o = e.split(".");
    if (o[0] === "nodes" && o.length >= 4) {
      const i = o[1], r = this._state.nodes[i];
      if (!r)
        return;
      r.position || (r.position = { x: 0, y: 0 }), o[2] === "position" && (o[3] === "x" && (r.position.x = n), o[3] === "y" && (r.position.y = n));
      return;
    }
    o[0] === "viewport" && (o[1] === "x" && (this._state.viewport.x = n), o[1] === "y" && (this._state.viewport.y = n), o[1] === "zoom" && (this._state.viewport.zoom = n));
  }
  _isSettled(e) {
    if (e.type === "eased")
      return this._virtualTime - e.startTime >= (e.duration ?? 0);
    if (e._physicsStates) {
      for (const n of e._physicsStates.values())
        if (!n.settled)
          return !1;
      return !0;
    }
    return !0;
  }
}
const yr = /* @__PURE__ */ new Map();
function ei(t, e) {
  yr.set(t, e);
}
function Yf(t) {
  return yr.get(t);
}
function ti(t, e = 20) {
  const n = Object.values(t);
  if (n.length === 0)
    return null;
  let o = 1 / 0, i = 1 / 0, r = -1 / 0, s = -1 / 0;
  for (const a of n) {
    const l = a.position?.x ?? 0, c = a.position?.y ?? 0, d = a.dimensions?.width ?? 150, h = a.dimensions?.height ?? 40;
    o = Math.min(o, l), i = Math.min(i, c), r = Math.max(r, l + d), s = Math.max(s, c + h);
  }
  return o -= e, i -= e, r += e, s += e, { minX: o, minY: i, vbWidth: r - o, vbHeight: s - i };
}
function wr(t) {
  let e = "";
  for (const n of Object.values(t.edges)) {
    const o = t.nodes[n.source], i = t.nodes[n.target];
    if (!o || !i)
      continue;
    const r = (o.position?.x ?? 0) + (o.dimensions?.width ?? 150) / 2, s = (o.position?.y ?? 0) + (o.dimensions?.height ?? 40) / 2, a = (i.position?.x ?? 0) + (i.dimensions?.width ?? 150) / 2, l = (i.position?.y ?? 0) + (i.dimensions?.height ?? 40) / 2;
    e += `<line x1="${r}" y1="${s}" x2="${a}" y2="${l}" stroke="currentColor" stroke-width="1" opacity="0.5"/>`;
  }
  return e;
}
const qf = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = ti(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: a, vbHeight: l } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${a} ${l}" xmlns="http://www.w3.org/2000/svg">`;
    c += wr(t);
    for (const d of o) {
      const h = d.position?.x ?? 0, u = d.position?.y ?? 0, f = d.dimensions?.width ?? 150, g = d.dimensions?.height ?? 40;
      c += `<rect x="${h}" y="${u}" width="${f}" height="${g}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Wf = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = ti(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: a, vbHeight: l } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${a} ${l}" xmlns="http://www.w3.org/2000/svg">`;
    for (const d of Object.values(t.edges)) {
      const h = t.nodes[d.source], u = t.nodes[d.target];
      if (!h || !u)
        continue;
      const f = (h.position?.x ?? 0) + (h.dimensions?.width ?? 150) / 2, g = (h.position?.y ?? 0) + (h.dimensions?.height ?? 40) / 2, p = (u.position?.x ?? 0) + (u.dimensions?.width ?? 150) / 2, w = (u.position?.y ?? 0) + (u.dimensions?.height ?? 40) / 2;
      c += `<line x1="${f}" y1="${g}" x2="${p}" y2="${w}" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>`;
    }
    for (const d of o) {
      const h = d.position?.x ?? 0, u = d.position?.y ?? 0, f = d.dimensions?.width ?? 150, g = d.dimensions?.height ?? 40;
      c += `<rect x="${h}" y="${u}" width="${f}" height="${g}" fill="none" stroke="currentColor" stroke-width="1.5" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, jf = {
  render(t, { width: e, height: n, inFlight: o }) {
    const i = Object.values(t.nodes);
    if (i.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const r = ti(t.nodes);
    if (!r)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const s = /* @__PURE__ */ new Set();
    if (o) {
      for (const u of o)
        if (u.targets?.nodes)
          for (const f of Object.keys(u.targets.nodes))
            s.add(f);
    }
    const { minX: a, minY: l, vbWidth: c, vbHeight: d } = r;
    let h = `<svg width="${e}" height="${n}" viewBox="${a} ${l} ${c} ${d}" xmlns="http://www.w3.org/2000/svg">`;
    h += wr(t);
    for (const u of i) {
      const f = u.position?.x ?? 0, g = u.position?.y ?? 0, p = u.dimensions?.width ?? 150, w = u.dimensions?.height ?? 40;
      s.has(u.id ?? "") ? h += `<rect x="${f}" y="${g}" width="${p}" height="${w}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>` : h += `<rect x="${f}" y="${g}" width="${p}" height="${w}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
    }
    return h += "</svg>", h;
  }
};
ei("faithful", qf);
ei("outline", Wf);
ei("activity", jf);
function Uf(t, e) {
  return e.split(".").reduce((n, o) => n?.[o], t);
}
function vr(t) {
  if (t !== null && typeof t == "object") {
    Object.freeze(t);
    for (const e of Object.keys(t))
      vr(t[e]);
  }
  return t;
}
class ni {
  constructor(e) {
    this.version = e.version, this.duration = e.duration, this.initialState = vr(structuredClone(e.initialState)), this.events = Object.freeze(structuredClone(e.events)), this.checkpoints = Object.freeze(structuredClone(e.checkpoints)), this.metadata = Object.freeze({ ...e.metadata ?? {} }), Object.freeze(this);
  }
  toJSON() {
    return {
      version: this.version,
      duration: this.duration,
      initialState: structuredClone(this.initialState),
      events: structuredClone(this.events),
      checkpoints: structuredClone(this.checkpoints),
      metadata: { ...this.metadata }
    };
  }
  static fromJSON(e) {
    if (e.version > Do)
      throw new Error(
        `[AlpineFlow] Recording version ${e.version} is newer than supported (${Do}). Please update AlpineFlow to replay this recording.`
      );
    return new ni(e);
  }
  /**
   * Returns unique subjects (nodes, edges, timelines, particles) that appeared
   * during the recording, with their first-seen and last-seen timestamps.
   */
  getSubjects() {
    const e = /* @__PURE__ */ new Map(), n = (o, i, r) => {
      const s = `${o}:${i}`, a = e.get(s);
      a ? (r < a.firstSeenT && (a.firstSeenT = r), r > a.lastSeenT && (a.lastSeenT = r)) : e.set(s, { kind: o, id: i, firstSeenT: r, lastSeenT: r });
    };
    for (const o of Object.keys(this.initialState.nodes))
      n("node", o, 0);
    for (const o of Object.keys(this.initialState.edges))
      n("edge", o, 0);
    for (const o of this.events) {
      const { t: i, type: r, args: s } = o;
      switch (r) {
        case "animate":
        case "update":
          for (const a of Object.keys(s.targets?.nodes ?? {}))
            n("node", a, i);
          for (const a of Object.keys(s.targets?.edges ?? {}))
            n("edge", a, i);
          break;
        case "particle":
        case "particle-burst":
          s.edgeId && n("edge", s.edgeId, i);
          break;
        case "particle-between":
          s.source && n("node", s.source, i), s.target && n("node", s.target, i);
          break;
        case "converging":
          if (Array.isArray(s.sources))
            for (const a of s.sources)
              n("edge", a, i);
          s.options?.targetNodeId && n("node", s.options.targetNodeId, i);
          break;
        case "node-add":
        case "node-remove":
          if (s.id && n("node", s.id, i), Array.isArray(s.nodes))
            for (const a of s.nodes)
              a.id && n("node", a.id, i);
          break;
        case "edge-add":
        case "edge-remove":
          if (s.id && n("edge", s.id, i), Array.isArray(s.edges))
            for (const a of s.edges)
              a.id && n("edge", a.id, i);
          break;
      }
    }
    return Array.from(e.values());
  }
  /**
   * Returns activity spans for a specific subject identified by `id`.
   */
  getActivityFor(e) {
    const n = [];
    for (const o of this.events) {
      const { t: i, type: r, args: s } = o;
      if ((() => {
        switch (r) {
          case "animate":
          case "update":
            return e in (s.targets?.nodes ?? {}) || e in (s.targets?.edges ?? {});
          case "particle":
          case "particle-burst":
            return s.edgeId === e;
          case "particle-between":
            return s.source === e || s.target === e;
          case "converging":
            return Array.isArray(s.sources) && s.sources.includes(e) || s.options?.targetNodeId === e;
          case "node-add":
          case "node-remove":
            return !!(s.id === e || Array.isArray(s.nodes) && s.nodes.some((l) => l.id === e));
          case "edge-add":
          case "edge-remove":
            return !!(s.id === e || Array.isArray(s.edges) && s.edges.some((l) => l.id === e));
          default:
            return !1;
        }
      })())
        switch (r) {
          case "animate": {
            const l = s.options?.duration ?? 0;
            n.push({ startT: i, endT: i + l, reason: "animate" });
            break;
          }
          case "particle":
          case "particle-burst":
          case "particle-between": {
            const l = s.options?.duration ?? s.duration ?? 1;
            n.push({ startT: i, endT: i + l, reason: r });
            break;
          }
          case "converging": {
            const l = s.options?.duration ?? 1;
            n.push({ startT: i, endT: i + l, reason: "converging" });
            break;
          }
          default:
            n.push({ startT: i, endT: i + 1, reason: r });
            break;
        }
    }
    return n;
  }
  /**
   * Returns sample points for a property's value over time, sampled from checkpoints.
   * `path` uses dot notation, e.g. `'nodes.trigger.position.x'`.
   */
  getValueTrack(e) {
    const n = [];
    for (const o of this.checkpoints) {
      const i = Uf(o.canvas, e);
      i !== void 0 && n.push({ t: o.t, v: i });
    }
    return n;
  }
  /**
   * Returns the canvas state at virtual time `t` by running the VirtualEngine
   * up to that point from the nearest prior checkpoint.
   */
  getStateAt(e) {
    const n = new Ye(this.initialState);
    let o = null;
    for (const a of this.checkpoints)
      a.t <= e && (!o || a.t > o.t) && (o = a);
    o && n.restoreCheckpoint(o);
    const i = o?.t ?? 0;
    let r = i;
    const s = Ro * 1e3;
    for (const a of this.events)
      a.t === i && n.applyEvent(a);
    for (; r < e; ) {
      const a = Math.min(r + s, e);
      for (const c of this.events)
        c.t > r && c.t <= a && n.applyEvent(c);
      const l = (a - r) / 1e3;
      n.advance(l), r = a;
    }
    return n.getState();
  }
  /**
   * Renders a thumbnail SVG snapshot of the canvas state at virtual time `t`.
   */
  renderThumbnailAt(e, n) {
    const o = this.getStateAt(e), i = n.renderer ?? "faithful", r = Yf(i);
    if (!r)
      throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${i}"`);
    return r.render(o, { width: n.width, height: n.height });
  }
}
class Zf {
  constructor(e, n = {}) {
    this._events = [], this._checkpoints = [], this._startTime = 0, this._originalMethods = {}, this._checkpointTimer = null, this._eventCounter = 0, this._canvas = e, this._checkpointInterval = n.checkpointInterval ?? 500, this._maxDuration = n.maxDuration ?? 6e4;
  }
  async record(e, n) {
    this._startTime = performance.now();
    const o = this._captureSnapshot();
    this._installHooks(), this._scheduleCheckpoints();
    try {
      const r = e();
      if (r instanceof Promise && await r, this._virtualNow() > this._maxDuration)
        throw new Error(`[AlpineFlow] Recording exceeded maxDuration (${this._maxDuration}ms)`);
    } finally {
      this._uninstallHooks(), this._checkpointTimer !== null && (clearInterval(this._checkpointTimer), this._checkpointTimer = null);
    }
    this._captureCheckpoint();
    const i = {
      version: Do,
      duration: this._virtualNow(),
      initialState: o,
      events: this._events,
      checkpoints: this._checkpoints,
      metadata: n
    };
    return new ni(i);
  }
  _virtualNow() {
    return performance.now() - this._startTime;
  }
  _recordEvent(e, n) {
    this._events.push({
      t: this._virtualNow(),
      type: e,
      args: this._sanitizeArgs(n)
    });
  }
  /** Strip non-serializable values (functions, etc.) and log warnings. */
  _sanitizeArgs(e) {
    const n = {};
    for (const [o, i] of Object.entries(e)) {
      if (typeof i == "function") {
        console.warn(`[AlpineFlow recorder] Stripped non-serializable option "${o}" (function)`);
        continue;
      }
      i && typeof i == "object" ? n[o] = this._sanitizeNested(i) : n[o] = i;
    }
    return n;
  }
  _sanitizeNested(e) {
    if (e === null || typeof e != "object")
      return e;
    if (Array.isArray(e))
      return e.map((o) => this._sanitizeNested(o));
    const n = {};
    for (const [o, i] of Object.entries(e)) {
      if (typeof i == "function") {
        console.warn(`[AlpineFlow recorder] Stripped nested function at key "${o}"`);
        continue;
      }
      n[o] = this._sanitizeNested(i);
    }
    return n;
  }
  _captureSnapshot() {
    const e = {};
    for (const o of this._canvas.nodes ?? [])
      o && typeof o == "object" && "id" in o && (e[o.id] = structuredClone(o));
    const n = {};
    for (const o of this._canvas.edges ?? [])
      o && typeof o == "object" && "id" in o && (n[o.id] = structuredClone(o));
    return {
      nodes: e,
      edges: n,
      viewport: { ...this._canvas.viewport }
    };
  }
  _captureCheckpoint() {
    this._checkpoints.push({
      t: this._virtualNow(),
      canvas: this._captureSnapshot(),
      // TODO: capture from animator's in-flight state — for alpha, leave empty
      inFlight: [],
      tagRegistry: {}
    });
  }
  _scheduleCheckpoints() {
    this._checkpointTimer = setInterval(() => {
      this._captureCheckpoint();
    }, this._checkpointInterval);
  }
  _installHooks() {
    const e = (n, o, i) => {
      const r = this._canvas[n];
      typeof r == "function" && (this._originalMethods[n] = r, this._canvas[n] = (...s) => {
        const a = i ? i(...s) : { args: s };
        return this._recordEvent(o, a), r.apply(this._canvas, s);
      });
    };
    e("animate", "animate", (n, o) => ({
      targets: n,
      options: o,
      handleId: `rec-${++this._eventCounter}`
    })), e("update", "update", (n, o) => ({
      targets: n,
      options: o,
      handleId: `rec-${++this._eventCounter}`
    })), e("sendParticle", "particle", (n, o) => ({ edgeId: n, options: o })), e("sendParticleAlongPath", "particle-along-path", (n, o) => ({ path: n, options: o })), e("sendParticleBetween", "particle-between", (n, o, i) => ({ source: n, target: o, options: i })), e("sendParticleBurst", "particle-burst", (n, o) => ({ edgeId: n, options: o })), e("sendConverging", "converging", (n, o) => ({ sources: n, options: o })), e("addNodes", "node-add", (n) => ({ nodes: n })), e("removeNodes", "node-remove", (n) => ({ ids: n })), e("addEdges", "edge-add", (n) => ({ edges: n })), e("removeEdges", "edge-remove", (n) => ({ ids: n }));
  }
  _uninstallHooks() {
    for (const [e, n] of Object.entries(this._originalMethods))
      this._canvas[e] = n;
    this._originalMethods = {};
  }
}
class Kf {
  constructor(e, n, o = {}) {
    this._currentTime = 0, this._state = "idle", this._direction = "forward", this._speed = 1, this._rafHandle = null, this._lastWallTime = 0, this._resolveFinished = () => {
    }, this.recording = n, this._canvas = e, this._virtualEngine = new Ye(n.initialState), this._speed = o.speed ?? 1, this._direction = this._speed < 0 ? "backward" : "forward", this._from = o.from ?? 0, this._to = o.to ?? n.duration, this._loop = o.loop ?? !1, this._currentTime = this._from, o.skipInitialState || this._applyStateToCanvas(n.initialState), this.finished = new Promise((i) => {
      this._resolveFinished = i;
    }), o.paused ? this._state = "paused" : this._speed !== 0 && this.play();
  }
  get duration() {
    return this.recording.duration;
  }
  get currentTime() {
    return this._currentTime;
  }
  get state() {
    return this._state;
  }
  get direction() {
    return this._direction;
  }
  get speed() {
    return this._speed;
  }
  set speed(e) {
    this._speed = e, this._direction = e < 0 ? "backward" : "forward";
  }
  play() {
    this._state !== "playing" && (this._state === "ended" && (this._currentTime = this._from, this._virtualEngine = new Ye(this.recording.initialState), this._applyStateToCanvas(this._virtualEngine.getState())), this._state = "playing", this._lastWallTime = fo(), this._scheduleTick());
  }
  pause() {
    this._state === "playing" && (this._state = "paused", this._cancelTick());
  }
  stop() {
    this._cancelTick(), this._currentTime = this._from, this._virtualEngine = new Ye(this.recording.initialState), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "idle";
  }
  scrubTo(e) {
    const n = this._resolveTarget(e);
    this._currentTime = n;
    const o = this._findNearestCheckpoint(n);
    o ? this._virtualEngine.restoreCheckpoint(o) : this._virtualEngine = new Ye(this.recording.initialState);
    const i = o?.t ?? 0;
    this._walkTo(i, n), this._applyStateToCanvas(this._virtualEngine.getState());
  }
  seek(e) {
    this.scrubTo(e);
  }
  eventsUpTo(e) {
    return this.recording.events.filter((n) => n.t <= e);
  }
  getStateAt(e) {
    const n = this._findNearestCheckpoint(e), o = new Ye(this.recording.initialState);
    n && o.restoreCheckpoint(n);
    const i = n?.t ?? 0;
    let r = i;
    const s = Ro * 1e3;
    if (!n)
      for (const a of this.recording.events)
        a.t === i && o.applyEvent(a);
    for (; r < e; ) {
      const a = Math.min(r + s, e);
      for (const c of this.recording.events)
        c.t > r && c.t <= a && o.applyEvent(c);
      const l = (a - r) / 1e3;
      l > 0 && o.advance(l), r = a;
    }
    return o.getState();
  }
  // ── Private ─────────────────────────────────────────────────────────────
  _tick() {
    if (this._state !== "playing")
      return;
    const e = fo(), n = (e - this._lastWallTime) / 1e3;
    this._lastWallTime = e;
    const o = n * this._speed * 1e3, i = this._currentTime + o;
    if (this._direction === "forward" ? i >= this._to : i <= this._from) {
      const s = this._direction === "forward" ? this._to : this._from;
      if (this._direction === "forward")
        this._walkTo(this._currentTime, s);
      else {
        const a = this._findNearestCheckpoint(s);
        this._virtualEngine = a ? (this._virtualEngine.restoreCheckpoint(a), this._virtualEngine) : new Ye(this.recording.initialState), this._walkTo(a?.t ?? 0, s);
      }
      this._currentTime = s, this._applyStateToCanvas(this._virtualEngine.getState()), this._handleEnd();
      return;
    }
    if (o > 0)
      this._walkTo(this._currentTime, i);
    else if (o < 0) {
      const s = this._findNearestCheckpoint(i);
      s ? this._virtualEngine.restoreCheckpoint(s) : this._virtualEngine = new Ye(this.recording.initialState), this._walkTo(s?.t ?? 0, i);
    }
    this._currentTime = i, this._applyStateToCanvas(this._virtualEngine.getState()), this._scheduleTick();
  }
  _scheduleTick() {
    typeof requestAnimationFrame == "function" ? this._rafHandle = requestAnimationFrame(() => this._tick()) : this._rafHandle = setTimeout(() => this._tick(), 16);
  }
  _cancelTick() {
    this._rafHandle !== null && (typeof cancelAnimationFrame == "function" ? cancelAnimationFrame(this._rafHandle) : clearTimeout(this._rafHandle), this._rafHandle = null);
  }
  _walkTo(e, n) {
    if (n <= e)
      return;
    let o = e;
    const i = Ro * 1e3;
    if (e === 0)
      for (const r of this.recording.events)
        r.t === 0 && this._virtualEngine.applyEvent(r);
    for (; o < n; ) {
      const r = Math.min(o + i, n);
      for (const a of this.recording.events)
        a.t > o && a.t <= r && this._virtualEngine.applyEvent(a);
      const s = (r - o) / 1e3;
      s > 0 && this._virtualEngine.advance(s), o = r;
    }
  }
  _findNearestCheckpoint(e) {
    let n = null;
    for (const o of this.recording.checkpoints)
      o.t <= e && (!n || o.t > n.t) && (n = o);
    return n;
  }
  _resolveTarget(e) {
    const n = Math.min(this._from, this._to), o = Math.max(this._from, this._to);
    if (typeof e == "number")
      return Math.max(n, Math.min(o, e));
    if (e === "start")
      return this._from;
    if (e === "end")
      return this._to;
    if (e.endsWith("%")) {
      const r = parseFloat(e) / 100;
      return this._from + r * (this._to - this._from);
    }
    const i = parseFloat(e);
    return Number.isNaN(i) ? this._from : Math.max(n, Math.min(o, i));
  }
  _handleEnd() {
    if (this._loop) {
      const e = typeof this._loop == "number" ? this._loop - 1 : 1 / 0;
      if (e > 0) {
        this._loop = typeof this._loop == "number" ? e : !0, this._currentTime = this._from, this._virtualEngine = new Ye(this.recording.initialState), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "playing", this._lastWallTime = fo(), this._scheduleTick();
        return;
      }
    }
    this._state = "ended", this._rafHandle = null, this._resolveFinished();
  }
  _applyStateToCanvas(e) {
    for (const [n, o] of Object.entries(e.nodes)) {
      const i = this._canvas.nodes.find((r) => r.id === n);
      i && o.position && (i.position || (i.position = { x: 0, y: 0 }), o.position.x !== void 0 && (i.position.x = o.position.x), o.position.y !== void 0 && (i.position.y = o.position.y));
    }
    e.viewport && (this._canvas.viewport.x = e.viewport.x, this._canvas.viewport.y = e.viewport.y, this._canvas.viewport.zoom = e.viewport.zoom);
  }
}
function fo() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
function Gf(t) {
  const e = Bf(t);
  return {
    // ── Internal: Sync animation lock state ───────────────────────────────
    /**
     * Synchronize the `_animationLocked` flag from active timelines and
     * manage history suspension while any timeline is playing.
     */
    _syncAnimationState() {
      const n = [...t._activeTimelines].some((o) => o.locked);
      t._animationLocked = n, t._activeTimelines.size === 0 ? t._resumeHistory() : t._suspendHistory();
    },
    // ── Timeline factory ──────────────────────────────────────────────────
    /**
     * Create a new FlowTimeline wired to this canvas. Lock flag and
     * history suspension are automatically managed via timeline events.
     */
    timeline() {
      const n = new Qo(t, zn);
      n.on("play", () => {
        t._activeTimelines.add(n), t._syncAnimationState();
      }), n.on("resume", () => {
        t._activeTimelines.add(n), t._syncAnimationState();
      });
      for (const o of ["pause", "stop", "complete"])
        n.on(o, () => {
          t._activeTimelines.delete(n), t._syncAnimationState();
        });
      return n;
    },
    // ── Named animation registry ──────────────────────────────────────────
    /**
     * Register a named animation (used by x-flow-animate directive).
     */
    registerAnimation(n, o) {
      t._animationRegistry.set(n, o);
    },
    /**
     * Unregister a named animation.
     */
    unregisterAnimation(n) {
      t._animationRegistry.delete(n);
    },
    /**
     * Play a named animation registered via x-flow-animate directive.
     */
    async playAnimation(n) {
      const o = t._animationRegistry.get(n);
      if (!o) {
        B("animation", `Named animation "${n}" not found`);
        return;
      }
      const i = t.timeline();
      for (const r of o)
        r.parallel ? i.parallel(r.parallel) : i.step(r);
      await i.play();
    },
    // ── Core update/animate API ─────────────────────────────────────────
    /**
     * Update nodes, edges, and/or the viewport.
     *
     * The core method for applying property changes. When duration is 0
     * (the default), changes are applied instantly via DOM flushing.
     * When duration > 0, transitions are delegated to the Animator for
     * frame-by-frame interpolation.
     *
     * Use `animate()` for a convenience wrapper that defaults to smooth
     * transitions (duration: 300ms).
     */
    update(n, o = {}) {
      if (o?.boundTo) {
        const f = o.boundTo;
        "node" in f ? o = {
          ...o,
          while: () => t.getNode(f.node)?.[f.property] === f.equals
        } : "edge" in f && (o = {
          ...o,
          while: () => t.getEdge(f.edge)?.[f.property] === f.equals
        });
      }
      const i = o.duration ?? 0, r = [], s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), c = n.nodes ? Object.keys(n.nodes).length : 0, d = n.edges ? Object.keys(n.edges).length : 0;
      if (B("animate", "update() called", {
        nodes: c,
        edges: d,
        viewport: !!n.viewport,
        duration: i,
        easing: o.easing ?? "default",
        instant: i === 0
      }), n.nodes)
        for (const [f, g] of Object.entries(n.nodes)) {
          const p = t._nodeMap.get(f);
          if (!p) continue;
          const m = (g._duration ?? i) === 0;
          if (g.followPath && !m) {
            let C = null;
            typeof g.followPath == "function" ? C = g.followPath : C = Jo(g.followPath);
            let S = null;
            if (g.guidePath?.visible && typeof g.followPath == "string" && typeof document < "u") {
              const b = t.getEdgeSvgElement?.();
              b && (S = document.createElementNS("http://www.w3.org/2000/svg", "path"), S.setAttribute("d", g.followPath), S.classList.add("flow-guide-path"), g.guidePath.class && S.classList.add(g.guidePath.class), b.appendChild(S));
            }
            if (C) {
              const b = C, D = S, M = g.guidePath?.autoRemove !== !1;
              r.push({
                key: `node:${f}:followPath`,
                from: 0,
                to: 1,
                apply: (T) => {
                  const v = t._nodeMap.get(f);
                  if (!v) return;
                  const P = b(T);
                  Ee().raw(v).position.x = P.x, Ee().raw(v).position.y = P.y, s.add(f), T >= 1 && D && M && D.remove();
                }
              });
            }
          } else if (g.position) {
            const S = Ee().raw(p).position;
            if (g.position.x !== void 0) {
              const b = g.position.x;
              if (m)
                S.x = b;
              else {
                const D = S.x;
                r.push({
                  key: `node:${f}:position.x`,
                  from: D,
                  to: b,
                  apply: (M) => {
                    const T = t._nodeMap.get(f);
                    T && (Ee().raw(T).position.x = M, s.add(f));
                  }
                });
              }
            }
            if (g.position.y !== void 0) {
              const b = g.position.y;
              if (m)
                S.y = b;
              else {
                const D = S.y;
                r.push({
                  key: `node:${f}:position.y`,
                  from: D,
                  to: b,
                  apply: (M) => {
                    const T = t._nodeMap.get(f);
                    T && (Ee().raw(T).position.y = M), s.add(f);
                  }
                });
              }
            }
            m && s.add(f);
          }
          if (g.data !== void 0 && Object.assign(p.data, g.data), g.class !== void 0 && (p.class = g.class), g.selected !== void 0 && (p.selected = g.selected), g.zIndex !== void 0 && (p.zIndex = g.zIndex), g.style !== void 0)
            if (m)
              p.style = g.style, a.add(f);
            else {
              const C = nn(p.style || {}), S = nn(g.style), b = t._nodeElements.get(f);
              if (b) {
                const D = getComputedStyle(b);
                for (const M of Object.keys(S))
                  C[M] === void 0 && (C[M] = D.getPropertyValue(M));
              }
              r.push({
                key: `node:${f}:style`,
                from: 0,
                to: 1,
                apply: (D) => {
                  const M = t._nodeMap.get(f);
                  M && (Ee().raw(M).style = Js(C, S, D), a.add(f));
                }
              });
            }
          g.dimensions && p.dimensions && (g.dimensions.width !== void 0 && (m ? p.dimensions.width = g.dimensions.width : r.push({
            key: `node:${f}:dimensions.width`,
            from: p.dimensions.width,
            to: g.dimensions.width,
            apply: (C) => {
              p.dimensions.width = C;
            }
          })), g.dimensions.height !== void 0 && (m ? p.dimensions.height = g.dimensions.height : r.push({
            key: `node:${f}:dimensions.height`,
            from: p.dimensions.height,
            to: g.dimensions.height,
            apply: (C) => {
              p.dimensions.height = C;
            }
          })));
        }
      if (n.edges)
        for (const [f, g] of Object.entries(n.edges)) {
          const p = t._edgeMap.get(f);
          if (!p) continue;
          const m = (g._duration ?? i) === 0;
          if (g.color !== void 0)
            if (typeof g.color == "object")
              p.color = g.color;
            else if (m)
              p.color = g.color, l.add(f);
            else {
              const C = typeof p.color == "string" && p.color || getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke").trim() || Uo;
              r.push({
                key: `edge:${f}:color`,
                from: C,
                to: g.color,
                apply: (S) => {
                  const b = t._edgeMap.get(f);
                  b && (Ee().raw(b).color = S, l.add(f));
                }
              });
            }
          if (g.strokeWidth !== void 0)
            if (m)
              p.strokeWidth = g.strokeWidth, l.add(f);
            else {
              const C = p.strokeWidth ?? (parseFloat(getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke-width").trim() || "1") || 1);
              r.push({
                key: `edge:${f}:strokeWidth`,
                from: C,
                to: g.strokeWidth,
                apply: (S) => {
                  const b = t._edgeMap.get(f);
                  b && (Ee().raw(b).strokeWidth = S, l.add(f));
                }
              });
            }
          g.label !== void 0 && (p.label = g.label), g.animated !== void 0 && (p.animated = g.animated), g.class !== void 0 && (p.class = g.class);
        }
      if (n.viewport) {
        const f = n.viewport, p = (f._duration ?? i) === 0, w = t.viewport;
        f.pan?.x !== void 0 && (p ? w.x = f.pan.x : r.push({
          key: "viewport:pan.x",
          from: w.x,
          to: f.pan.x,
          apply: (m) => {
            w.x = m;
          }
        })), f.pan?.y !== void 0 && (p ? w.y = f.pan.y : r.push({
          key: "viewport:pan.y",
          from: w.y,
          to: f.pan.y,
          apply: (m) => {
            w.y = m;
          }
        })), f.zoom !== void 0 && (p ? w.zoom = f.zoom : r.push({
          key: "viewport:zoom",
          from: w.zoom,
          to: f.zoom,
          apply: (m) => {
            w.zoom = m;
          }
        }));
      }
      if (r.length === 0) {
        s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s)), a.size > 0 && t._flushNodeStyles(a), l.size > 0 && t._flushEdgeStyles(l);
        const f = {
          pause: () => {
          },
          resume: () => {
          },
          stop: () => {
          },
          reverse: () => {
          },
          play: () => {
          },
          playForward: () => {
          },
          playBackward: () => {
          },
          restart: () => {
          },
          get direction() {
            return "forward";
          },
          get isFinished() {
            return !0;
          },
          get currentValue() {
            return /* @__PURE__ */ new Map();
          },
          finished: Promise.resolve(),
          _targetNodeIds: n.nodes ? Object.keys(n.nodes) : void 0
        };
        return o.onComplete?.(), f;
      }
      const u = Ee().raw(t._animator).animate(r, {
        duration: i,
        easing: o.easing,
        delay: o.delay,
        loop: o.loop,
        startAt: o.startAt,
        while: o.while,
        whileStopMode: o.whileStopMode,
        tag: o.tag,
        tags: o.tags,
        motion: o.motion,
        maxDuration: o.maxDuration,
        onProgress(f) {
          s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), s.clear()), a.size > 0 && (t._flushNodeStyles(a), a.clear()), l.size > 0 && (t._flushEdgeStyles(l), l.clear()), n.viewport && t._flushViewport(), o.onProgress?.(f);
        },
        onComplete() {
          if (n.nodes)
            for (const [f, g] of Object.entries(n.nodes)) {
              const p = t._nodeMap.get(f);
              if (!p) continue;
              const w = Ee().raw(p);
              (g.followPath || g.position?.x !== void 0) && (p.position.x = w.position.x), (g.followPath || g.position?.y !== void 0) && (p.position.y = w.position.y), g.style !== void 0 && (p.style = w.style);
            }
          if (n.edges)
            for (const [f, g] of Object.entries(n.edges)) {
              const p = t._edgeMap.get(f);
              if (!p) continue;
              const w = Ee().raw(p);
              g.color !== void 0 && typeof g.color == "string" && (p.color = w.color), g.strokeWidth !== void 0 && (p.strokeWidth = w.strokeWidth);
            }
          o.onComplete?.();
        }
      });
      return n.nodes && (u._targetNodeIds = Object.keys(n.nodes)), u;
    },
    /**
     * Animate nodes, edges, and/or the viewport with smooth transitions.
     *
     * Convenience wrapper around `update()` that defaults to 300ms duration.
     * Pass `duration: 0` for instant changes, or use `update()` directly.
     *
     * When `respectReducedMotion` is active (via config or OS media query),
     * the effective duration is collapsed to 0 for an instant snap.
     */
    animate(n, o = {}) {
      const i = Gs(t._config?.respectReducedMotion) ? 0 : o.duration ?? 300;
      return this.update(n, { ...o, duration: i });
    },
    // ── Follow (viewport tracking) ────────────────────────────────────────
    /**
     * Track a target with the viewport camera. The target can be a node ID,
     * a ParticleHandle, an animation handle, or a static XYPosition.
     * The viewport smoothly follows via engine tick with linear interpolation.
     */
    follow(n, o = {}) {
      t._followHandle && t._followHandle.stop();
      let i;
      const r = new Promise((d) => {
        i = d;
      });
      let s = !1;
      const a = o.zoom, l = zn.register(() => {
        if (s) return !0;
        let d = null;
        if (typeof n == "string") {
          const w = t._nodeMap.get(n);
          if (w) {
            d = w.parentId ? t.getAbsolutePosition(n) : { ...w.position };
            const m = w.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            w.dimensions && (d.x += w.dimensions.width * (0.5 - m[0]), d.y += w.dimensions.height * (0.5 - m[1]));
          }
        } else if ("_targetNodeIds" in n && n._targetNodeIds?.length) {
          const w = n._targetNodeIds[0], m = t._nodeMap.get(w);
          if (m) {
            d = m.parentId ? t.getAbsolutePosition(w) : { ...m.position };
            const C = m.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            m.dimensions && (d.x += m.dimensions.width * (0.5 - C[0]), d.y += m.dimensions.height * (0.5 - C[1]));
          }
        } else if ("getCurrentPosition" in n && typeof n.getCurrentPosition == "function") {
          const w = n.getCurrentPosition();
          if (w)
            d = w;
          else
            return s = !0, l.stop(), t._followHandle = null, i(), !0;
        } else "x" in n && "y" in n && (d = n);
        if (!d) return !1;
        const h = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, u = a ?? t.viewport.zoom, f = h.width / 2 - d.x * u, g = h.height / 2 - d.y * u, p = 0.08;
        return t.viewport.x += (f - t.viewport.x) * p, t.viewport.y += (g - t.viewport.y) * p, a && (t.viewport.zoom += (a - t.viewport.zoom) * p), t._flushViewport(), !1;
      });
      return t._followHandle = l, typeof n == "object" && "_targetNodeIds" in n && n.finished && n.finished.then(() => {
        s || (s = !0, l.stop(), t._followHandle = null, i());
      }), {
        pause: () => {
        },
        resume: () => {
        },
        stop: () => {
          s = !0, l.stop(), t._followHandle = null, i();
        },
        reverse: () => {
        },
        play: () => {
        },
        playForward: () => {
        },
        playBackward: () => {
        },
        restart: () => {
        },
        get direction() {
          return "forward";
        },
        get isFinished() {
          return s;
        },
        get currentValue() {
          return /* @__PURE__ */ new Map();
        },
        get finished() {
          return r;
        }
      };
    },
    // ── Registry & group helpers ─────────────────────────────────────────
    /**
     * Get all tracked animation handles, optionally filtered by tag.
     */
    getHandles(n) {
      return Ee().raw(t._animator).registry.getHandles(n);
    },
    /**
     * Cancel all animations matching a tag filter.
     */
    cancelAll(n, o) {
      Ee().raw(t._animator).registry.cancelAll(n, o);
    },
    /**
     * Pause all animations matching a tag filter.
     */
    pauseAll(n) {
      Ee().raw(t._animator).registry.pauseAll(n);
    },
    /**
     * Resume all animations matching a tag filter.
     */
    resumeAll(n) {
      Ee().raw(t._animator).registry.resumeAll(n);
    },
    /**
     * Create a named group that auto-tags all animations made through it.
     */
    group(n) {
      const o = this;
      return new Xf(n, {
        animate: (i, r) => o.animate(i, r),
        update: (i, r) => o.update(i, r),
        sendParticle: (i, r) => o.sendParticle(i, r),
        sendParticleAlongPath: (i, r) => o.sendParticleAlongPath(i, r),
        sendParticleBetween: (i, r, s) => o.sendParticleBetween(i, r, s),
        sendParticleBurst: (i, r) => o.sendParticleBurst(i, r),
        sendConverging: (i, r) => o.sendConverging(i, r),
        timeline: () => o.timeline(),
        getHandles: (i) => o.getHandles(i),
        cancelAll: (i, r) => o.cancelAll(i, r),
        pauseAll: (i) => o.pauseAll(i),
        resumeAll: (i) => o.resumeAll(i)
      });
    },
    /**
     * Create a transaction for grouped rollback of multiple animations.
     */
    transaction(n) {
      const o = Ee().raw(t._animator), i = o.beginTransaction();
      try {
        const r = n();
        r && typeof r.then == "function" ? r.then(() => o.endTransaction()).catch(() => {
          i.rollback(), o.endTransaction();
        }) : o.endTransaction();
      } catch (r) {
        throw i.rollback(), o.endTransaction(), r;
      }
      return i;
    },
    /**
     * Capture current canvas state. Call restore() to revert.
     */
    snapshot() {
      const n = structuredClone(Ee().raw(t.nodes)), o = structuredClone(Ee().raw(t.edges)), i = { ...t.viewport };
      return {
        restore: () => {
          t.nodes.splice(0, t.nodes.length, ...structuredClone(n)), t.edges.splice(0, t.edges.length, ...structuredClone(o)), Object.assign(t.viewport, i);
        }
      };
    },
    // ── Record & Replay ───────────────────────────────────────────────────
    /**
     * Record canvas animation events during `fn()` execution.
     * Returns a `Recording` that can be passed to `replay()`.
     */
    record(n, o) {
      const i = this, r = i.animate, s = i.update, a = i.sendParticle, l = i.sendParticleAlongPath, c = i.sendParticleBetween, d = i.sendParticleBurst, h = i.sendConverging, u = {
        get nodes() {
          return t.nodes;
        },
        get edges() {
          return t.edges;
        },
        get viewport() {
          return t.viewport;
        },
        animate: (p, w) => {
          const m = i.update;
          i.update = s;
          try {
            return r.call(i, p, w);
          } finally {
            i.update = m;
          }
        },
        update: (p, w) => s.call(i, p, w),
        sendParticle: (p, w) => a.call(i, p, w),
        sendParticleAlongPath: (p, w) => l.call(i, p, w),
        sendParticleBetween: (p, w, m) => c.call(i, p, w, m),
        sendParticleBurst: (p, w) => d.call(i, p, w),
        sendConverging: (p, w) => h.call(i, p, w),
        addNodes: (p) => t.addNodes(p),
        removeNodes: (p) => t.removeNodes(p),
        addEdges: (p) => t.addEdges(p),
        removeEdges: (p) => t.removeEdges(p)
      }, f = new Zf(u, o), g = async () => {
        i.animate = (...p) => u.animate(...p), i.update = (...p) => u.update(...p), i.sendParticle = (...p) => u.sendParticle(...p), i.sendParticleAlongPath = (...p) => u.sendParticleAlongPath(...p), i.sendParticleBetween = (...p) => u.sendParticleBetween(...p), i.sendParticleBurst = (...p) => u.sendParticleBurst(...p), i.sendConverging = (...p) => u.sendConverging(...p);
        try {
          const p = n();
          p instanceof Promise && await p;
        } finally {
          i.animate = r, i.update = s, i.sendParticle = a, i.sendParticleAlongPath = l, i.sendParticleBetween = c, i.sendParticleBurst = d, i.sendConverging = h;
        }
      };
      return f.record(g, o?.captureMetadata);
    },
    /**
     * Replay a previously recorded `Recording` on this canvas.
     * Returns a `ReplayHandle` with play/pause/stop/scrub controls.
     */
    replay(n, o) {
      const i = {
        get nodes() {
          return t.nodes;
        },
        get edges() {
          return t.edges;
        },
        get viewport() {
          return t.viewport;
        }
      };
      return new Kf(i, n, o);
    },
    // ── Cleanup lifecycle ─────────────────────────────────────────────────
    /**
     * Stop all in-flight animations, particles, and timelines.
     * Called by the canvas destroy() lifecycle hook when the element is
     * removed from the DOM.
     */
    destroy() {
      t._animator && t._animator.stopAll(), e.destroyParticles();
      for (const n of t._activeTimelines)
        n.stop();
      t._activeTimelines.clear();
    },
    // ── Particle renderer registry ────────────────────────────────────────
    /**
     * Register a custom particle renderer by name. Once registered, pass
     * `renderer: 'your-name'` in any `sendParticle*` options to use it.
     */
    registerParticleRenderer(n, o) {
      Ht(n, o);
    },
    // ── Particle system (delegated to canvas-particles sub-mixin) ────────
    _tickParticles: e._tickParticles,
    sendParticle: e.sendParticle,
    sendParticleAlongPath: e.sendParticleAlongPath,
    sendParticleBetween: e.sendParticleBetween,
    sendParticleBurst: e.sendParticleBurst,
    sendConverging: e.sendConverging,
    destroyParticles: e.destroyParticles
  };
}
function Zi(t, e, n, o) {
  const i = e.find((a) => a.id === t);
  if (!i) return /* @__PURE__ */ new Set();
  if (i.type === "group")
    return st(t, e);
  const r = /* @__PURE__ */ new Set(), s = Ao(t, e, n);
  for (const a of s)
    r.add(a.id);
  if (o?.recursive) {
    const a = s.map((l) => l.id);
    for (; a.length > 0; ) {
      const l = a.shift(), c = Ao(l, e, n);
      for (const d of c)
        !r.has(d.id) && d.id !== t && (r.add(d.id), a.push(d.id));
    }
  }
  return r;
}
function Jf(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e)
    n.has(i.id) && o.set(i.id, { ...i.position });
  return {
    targetPositions: o,
    originalDimensions: t.type === "group" ? { ...t.dimensions ?? { width: 400, height: 300 } } : void 0,
    reroutedEdges: /* @__PURE__ */ new Map()
  };
}
function ho(t, e, n, o) {
  t.collapsed = !0, o && (t.dimensions = { ...o });
  for (const i of e)
    n.targetPositions.has(i.id) && (i.hidden = !0);
}
function Ki(t, e, n, o = !0) {
  t.collapsed = !1, o && n.originalDimensions && (t.dimensions = { ...n.originalDimensions });
  const i = /* @__PURE__ */ new Set();
  if (t.type === "group") {
    for (const r of e)
      if (r.collapsed && r.id !== t.id && n.targetPositions.has(r.id)) {
        const s = st(r.id, e);
        for (const a of s)
          i.add(a);
      }
  }
  for (const r of e)
    if (n.targetPositions.has(r.id)) {
      const s = n.targetPositions.get(r.id);
      r.position = { ...s }, i.has(r.id) || (r.hidden = !1);
    }
}
function go(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = n.has(i.source), s = n.has(i.target), a = i.source === t, l = i.target === t;
    !r && !s || (o.set(i.id, { source: i.source, target: i.target, hidden: i.hidden }), r && s || a && s || r && l ? i.hidden = !0 : r ? i.source = t : i.target = t);
  }
  return o;
}
function Qf(t, e) {
  for (const n of t) {
    const o = e.get(n.id);
    o && (n.source = o.source, n.target = o.target, o.hidden !== void 0 ? n.hidden = o.hidden : delete n.hidden);
  }
}
const xn = { width: 150, height: 50 };
function eh(t) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || o.collapsed) return;
      const i = Zi(e, t.nodes, t.edges, { recursive: n?.recursive });
      if (i.size === 0) return;
      B("collapse", `Collapsing node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i],
        animate: n?.animate !== !1,
        recursive: n?.recursive ?? !1
      }), t._captureHistory();
      const r = o.type === "group", s = r ? o.collapsedDimensions ?? { width: 150, height: 60 } : void 0, a = n?.animate !== !1, l = Jf(o, t.nodes, i);
      if (a) {
        t._suspendHistory();
        const c = o.dimensions ?? xn, d = r && s ? s : c, h = {};
        for (const [f] of l.targetPositions) {
          const g = t._nodeMap.get(f);
          if (!g) continue;
          const p = g.dimensions ?? xn;
          let w, m;
          g.parentId === e ? (w = (d.width - p.width) / 2, m = (d.height - p.height) / 2) : (w = o.position.x + (d.width - p.width) / 2, m = o.position.y + (d.height - p.height) / 2), h[f] = {
            position: { x: w, y: m },
            style: { opacity: "0" }
          };
        }
        r && s && (h[e] = { dimensions: s });
        const u = [];
        for (const f of t.edges)
          if (i.has(f.source) || i.has(f.target)) {
            const g = t.getEdgeElement?.(f.id)?.closest("svg");
            g && u.push(g);
          }
        t.animate ? t.animate({ nodes: h }, {
          duration: 300,
          easing: "easeInOut",
          onProgress: (f) => {
            const g = String(1 - f);
            for (const p of u) p.style.opacity = g;
          },
          onComplete: () => {
            for (const f of u) f.style.opacity = "";
            ho(o, t.nodes, l, s), l.reroutedEdges = go(e, t.edges, i), t._collapseState.set(e, l), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] });
          }
        }) : (ho(o, t.nodes, l, s), l.reroutedEdges = go(e, t.edges, i), t._collapseState.set(e, l), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] }));
      } else
        ho(o, t.nodes, l, s), l.reroutedEdges = go(e, t.edges, i), t._collapseState.set(e, l), t._emit("node-collapse", { node: o, descendants: [...i] });
    },
    /**
     * Expand a previously collapsed node — restore descendants/outgoers.
     */
    expandNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || !o.collapsed) return;
      const i = t._collapseState.get(e);
      if (!i) return;
      B("collapse", `Expanding node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i.targetPositions.keys()],
        animate: n?.animate !== !1,
        reroutedEdges: i.reroutedEdges.size
      }), t._captureHistory();
      const r = o.type === "group", s = n?.animate !== !1;
      if (i.reroutedEdges.size > 0 && Qf(t.edges, i.reroutedEdges), s) {
        t._suspendHistory(), r && i.originalDimensions && (o.dimensions = { ...i.originalDimensions });
        const a = o.dimensions ?? xn;
        Ki(o, t.nodes, i, r);
        const l = {};
        for (const [h, u] of i.targetPositions) {
          const f = t._nodeMap.get(h);
          if (f && !f.hidden) {
            const g = f.dimensions ?? xn;
            let p, w;
            f.parentId === e ? (p = (a.width - g.width) / 2, w = (a.height - g.height) / 2) : (p = o.position.x + (a.width - g.width) / 2, w = o.position.y + (a.height - g.height) / 2), f.position = { x: p, y: w }, f.style = { ...f.style || {}, opacity: "0" }, l[h] = {
              position: u,
              style: { opacity: "1" }
            };
          }
        }
        const c = new Set(i.targetPositions.keys());
        t._flushNodeStyles(c);
        const d = [];
        for (const h of t.edges)
          if (c.has(h.source) || c.has(h.target)) {
            const u = t.getEdgeElement?.(h.id)?.closest("svg");
            u && (u.style.opacity = "0", d.push(u));
          }
        t.animate ? t.animate({ nodes: l }, {
          duration: 300,
          easing: "easeOut",
          onProgress: (h) => {
            const u = String(h);
            for (const f of d) f.style.opacity = u;
          },
          onComplete: () => {
            for (const h of d) h.style.opacity = "";
            for (const h of c) {
              const u = t._nodeMap.get(h);
              u && typeof u.style == "object" && delete u.style.opacity;
            }
            t._resumeHistory();
          }
        }) : t._resumeHistory(), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
      } else
        Ki(o, t.nodes, i, r), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
    },
    /**
     * Toggle collapse/expand state of a node.
     */
    toggleNode(e, n) {
      const o = t._nodeMap.get(e);
      o && (B("collapse", `Toggle node "${e}" → ${o.collapsed ? "expand" : "collapse"}`), o.collapsed ? this.expandNode(e, n) : this.collapseNode(e, n));
    },
    /**
     * Check if a node is collapsed.
     */
    isCollapsed(e) {
      return t._nodeMap.get(e)?.collapsed === !0;
    },
    /**
     * Get the number of nodes that would be hidden when collapsing this node.
     */
    getCollapseTargetCount(e) {
      return Zi(e, t.nodes, t.edges).size;
    },
    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(e) {
      return st(e, t.nodes).size;
    }
  };
}
function th(t) {
  return {
    /**
     * Condense a node — switch to summary view hiding internal rows.
     */
    condenseNode(e) {
      const n = t._nodeMap.get(e);
      !n || n.condensed || (t._captureHistory(), n.condensed = !0, B("condense", `Node "${e}" condensed`), t._emit("node-condense", { node: n }));
    },
    /**
     * Uncondense a node — restore full row view.
     */
    uncondenseNode(e) {
      const n = t._nodeMap.get(e);
      !n || !n.condensed || (t._captureHistory(), n.condensed = !1, B("condense", `Node "${e}" uncondensed`), t._emit("node-uncondense", { node: n }));
    },
    /**
     * Toggle condensed state of a node.
     */
    toggleCondense(e) {
      const n = t._nodeMap.get(e);
      n && (n.condensed ? this.uncondenseNode(e) : this.condenseNode(e));
    },
    /**
     * Check if a node is condensed.
     */
    isCondensed(e) {
      return t._nodeMap.get(e)?.condensed === !0;
    }
  };
}
function nh(t) {
  return {
    // ── Row Selection ────────────────────────────────────────────────────
    selectRow(e) {
      if (t.selectedRows.has(e)) return;
      t._captureHistory(), t.selectedRows.add(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      B("selection", `Row "${e}" selected`), t._emit("row-select", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
    },
    deselectRow(e) {
      if (!t.selectedRows.has(e)) return;
      t._captureHistory(), t.selectedRows.delete(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      B("selection", `Row "${e}" deselected`), t._emit("row-deselect", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
    },
    toggleRowSelect(e) {
      t.selectedRows.has(e) ? this.deselectRow(e) : this.selectRow(e);
    },
    getSelectedRows() {
      return [...t.selectedRows];
    },
    isRowSelected(e) {
      return t.selectedRows.has(e);
    },
    deselectAllRows() {
      t.selectedRows.size !== 0 && (t._captureHistory(), B("selection", "Deselecting all rows"), t.selectedRows.clear(), t._container?.querySelectorAll(".flow-row-selected").forEach((e) => {
        e.classList.remove("flow-row-selected");
      }), t._emit("row-selection-change", { selectedRows: [] }));
    },
    // ── Row Filtering ────────────────────────────────────────────────────
    setRowFilter(e, n) {
      const o = t._nodeMap.get(e);
      o && (o.rowFilter = n, B("filter", `Node "${e}" row filter set to "${typeof n == "function" ? "predicate" : n}"`));
    },
    getRowFilter(e) {
      return t._nodeMap.get(e)?.rowFilter ?? "all";
    },
    getVisibleRows(e, n) {
      const o = t._nodeMap.get(e);
      if (!o) return n;
      const i = o.rowFilter ?? "all";
      if (i === "all") return n;
      if (typeof i == "function")
        return n.filter(i);
      const r = /* @__PURE__ */ new Set();
      for (const s of t.edges) {
        if (s.sourceHandle?.startsWith(e + ".")) {
          const a = s.sourceHandle.slice(e.length + 1).replace(/-[lr]$/, "");
          a && r.add(a);
        }
        if (s.targetHandle?.startsWith(e + ".")) {
          const a = s.targetHandle.slice(e.length + 1).replace(/-[lr]$/, "");
          a && r.add(a);
        }
      }
      return i === "connected" ? n.filter((s) => r.has(s.id)) : n.filter((s) => !r.has(s.id));
    }
  };
}
const oh = 8, ih = 12, sh = 2;
function oi(t) {
  return {
    width: t.dimensions?.width ?? ye,
    height: t.dimensions?.height ?? we
  };
}
function rh(t) {
  if (t.stretch) return t.stretch;
  switch (t.direction) {
    case "vertical":
      return "width";
    case "horizontal":
      return "height";
    case "grid":
      return "both";
  }
}
function ah(t) {
  return [...t].sort((e, n) => {
    const o = e.order ?? 1 / 0, i = n.order ?? 1 / 0;
    return o !== i ? o - i : 0;
  });
}
function Gi(t, e, n) {
  const o = e.gap ?? oh, i = e.padding ?? ih, r = e.headerHeight ?? 0, s = rh(e), a = ah(t), l = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  if (a.length === 0)
    return {
      positions: l,
      dimensions: c,
      parentDimensions: n ? { width: n.width, height: n.height } : { width: i * 2, height: i * 2 + r }
    };
  const d = n ? n.width - i * 2 : 0, h = n ? n.height - i * 2 - r : 0;
  return e.direction === "vertical" ? lh(a, o, i, r, s, d, l, c) : e.direction === "horizontal" ? ch(a, o, i, r, s, h, l, c) : dh(a, o, i, r, s, e.columns ?? sh, d, h, l, c);
}
function lh(t, e, n, o, i, r, s, a) {
  let l = 0;
  const c = t.map((u) => oi(u));
  for (const u of c) l = Math.max(l, u.width);
  const d = r > 0 ? r : l;
  let h = n + o;
  for (let u = 0; u < t.length; u++) {
    const f = t[u], g = c[u];
    s.set(f.id, { x: n, y: h }), (i === "width" || i === "both") && a.set(f.id, { width: d, height: g.height }), h += g.height + e;
  }
  return h -= e, h += n, {
    positions: s,
    dimensions: a,
    parentDimensions: { width: d + n * 2, height: h }
  };
}
function ch(t, e, n, o, i, r, s, a) {
  let l = 0;
  const c = t.map((u) => oi(u));
  for (const u of c) l = Math.max(l, u.height);
  const d = r > 0 ? r : l;
  let h = n;
  for (let u = 0; u < t.length; u++) {
    const f = t[u], g = c[u];
    s.set(f.id, { x: h, y: n + o }), (i === "height" || i === "both") && a.set(f.id, { width: g.width, height: d }), h += g.width + e;
  }
  return h -= e, h += n, {
    positions: s,
    dimensions: a,
    parentDimensions: { width: h, height: d + n * 2 + o }
  };
}
function dh(t, e, n, o, i, r, s, a, l, c) {
  const d = Math.min(r, t.length), h = t.map((m) => oi(m));
  let u = 0, f = 0;
  for (const m of h)
    u = Math.max(u, m.width), f = Math.max(f, m.height);
  const g = s > 0 ? (s - (d - 1) * e) / d : 0;
  g > 0 && (u = g);
  const p = Math.ceil(t.length / d), w = a > 0 ? (a - (p - 1) * e) / p : 0;
  w > 0 && (f = w);
  for (let m = 0; m < t.length; m++) {
    const C = m % d, S = Math.floor(m / d), b = n + C * (u + e), D = n + o + S * (f + e);
    l.set(t[m].id, { x: b, y: D }), i === "both" ? c.set(t[m].id, { width: u, height: f }) : i === "width" ? c.set(t[m].id, { width: u, height: h[m].height }) : i === "height" && c.set(t[m].id, { width: h[m].width, height: f });
  }
  return {
    positions: l,
    dimensions: c,
    parentDimensions: {
      width: d * u + (d - 1) * e + n * 2,
      height: p * f + (p - 1) * e + n * 2 + o
    }
  };
}
function uh(t) {
  return {
    // ── Auto-layout scheduling ─────────────────────────────────────────────
    /**
     * Debounced trigger for automatic layout.
     *
     * Skips when no autoLayout config is set, dependencies haven't loaded,
     * or the auto-layout has permanently failed.
     */
    _scheduleAutoLayout() {
      const e = t._config.autoLayout;
      !e || !t._autoLayoutReady || t._autoLayoutFailed || (t._autoLayoutTimer && clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = setTimeout(() => {
        t._autoLayoutTimer = null, this._runAutoLayout();
      }, e.debounce ?? 50));
    },
    /**
     * Execute the configured auto-layout algorithm.
     *
     * Delegates to the appropriate layout engine method based on
     * `config.autoLayout.algorithm`. Catches errors and sets
     * `_autoLayoutFailed` to prevent repeated attempts.
     */
    async _runAutoLayout() {
      const e = t._config.autoLayout;
      if (!e) return;
      const n = {
        fitView: e.fitView !== !1,
        duration: e.duration ?? 300
      };
      try {
        switch (e.algorithm) {
          case "dagre":
            this.layout({
              direction: e.direction,
              nodesep: e.nodesep,
              ranksep: e.ranksep,
              adjustHandles: e.adjustHandles,
              ...n
            });
            break;
          case "force":
            this.forceLayout({
              strength: e.strength,
              distance: e.distance,
              charge: e.charge,
              iterations: e.iterations,
              ...n
            });
            break;
          case "hierarchy":
            this.treeLayout({
              layoutType: e.layoutType,
              nodeWidth: e.nodeWidth,
              nodeHeight: e.nodeHeight,
              adjustHandles: e.adjustHandles,
              ...n
            });
            break;
          case "elk":
            await this.elkLayout({
              algorithm: e.elkAlgorithm,
              nodeSpacing: e.nodeSpacing,
              layerSpacing: e.layerSpacing,
              adjustHandles: e.adjustHandles,
              ...n
            });
            break;
        }
      } catch (o) {
        t._autoLayoutFailed || (t._warn("AUTO_LAYOUT_FAILED", `autoLayout failed: ${o.message}`), t._autoLayoutFailed = !0);
      }
    },
    // ── Shared layout application ──────────────────────────────────────────
    /**
     * Apply computed layout positions to nodes with optional animation.
     *
     * When duration > 0, delegates to ctx.animate() for smooth transitions.
     * When duration === 0, applies positions directly (instant).
     * Calls `_adjustHandlePositions` when requested, and triggers fitView.
     */
    _applyLayout(e, n) {
      const o = n?.duration ?? 300;
      if (B("layout", `_applyLayout: repositioning ${e.size} node(s)`, {
        duration: o,
        adjustHandles: n?.adjustHandles ?? !1,
        fitView: n?.fitView !== !1
      }), n?.adjustHandles && n.handleDirection && this._adjustHandlePositions(n.handleDirection), o > 0) {
        const i = {};
        for (const [r, s] of e)
          i[r] = { position: s };
        t.animate?.({ nodes: i }, {
          duration: o,
          easing: "easeInOut",
          onComplete: () => {
            n?.fitView !== !1 && t.fitView?.({ padding: 0.2, duration: o });
          }
        });
      } else {
        for (const i of t.nodes) {
          const r = e.get(i.id);
          r && (i.position || (i.position = { x: 0, y: 0 }), i.position.x = r.x, i.position.y = r.y);
        }
        n?.fitView !== !1 && t.fitView?.({ padding: 0.2, duration: 0 });
      }
    },
    /**
     * Update handle positions on nodes and DOM elements to match a layout
     * direction (TB, LR, BT, RL, DOWN, RIGHT, UP, LEFT).
     *
     * Skips handles that have an explicit position set via
     * `data-flow-handle-explicit`.
     */
    _adjustHandlePositions(e) {
      const n = {
        TB: { source: "bottom", target: "top" },
        DOWN: { source: "bottom", target: "top" },
        LR: { source: "right", target: "left" },
        RIGHT: { source: "right", target: "left" },
        BT: { source: "top", target: "bottom" },
        UP: { source: "top", target: "bottom" },
        RL: { source: "left", target: "right" },
        LEFT: { source: "left", target: "right" }
      }, o = n[e] ?? n.TB;
      for (const i of t.nodes)
        i.sourcePosition = o.source, i.targetPosition = o.target;
      t._container?.querySelectorAll('[data-flow-handle-type="source"]').forEach((i) => {
        i.dataset.flowHandleExplicit || (i.dataset.flowHandlePosition = o.source);
      }), t._container?.querySelectorAll('[data-flow-handle-type="target"]').forEach((i) => {
        i.dataset.flowHandleExplicit || (i.dataset.flowHandlePosition = o.target);
      });
    },
    // ── Child layout ───────────────────────────────────────────────────────
    /**
     * Compute and apply child layout for a parent node.
     *
     * Recursively lays out nested layout parents bottom-up (unless `shallow`
     * is true). Applies computed positions, dimension overrides with
     * min/max constraint clamping, and auto-sizes the parent.
     */
    /**
     * Compute and apply child layout for a parent node.
     *
     * Supports both the legacy positional signature and a new options object:
     *
     *   layoutChildren(parentId)                          // full layout
     *   layoutChildren(parentId, excludeId, shallow)      // legacy (backward compat)
     *   layoutChildren(parentId, { ... })                 // options object
     *
     * Options:
     *   - excludeId: skip applying position/dimensions but still count in computation
     *   - omitFromComputation: fully remove node from child list (old parent shrinks)
     *   - includeNode: add a virtual child to computation (new parent grows)
     *   - shallow: don't recurse into nested layout children
     *   - stretchedSize: externally-provided size for stretch propagation
     */
    layoutChildren(e, n, o, i) {
      let r;
      typeof n == "string" ? r = { excludeId: n, shallow: o, stretchedSize: i } : r = n ?? {};
      const { excludeId: s, omitFromComputation: a, includeNode: l, shallow: c } = r;
      let { stretchedSize: d } = r;
      const h = t.nodes.find((b) => b.id === e);
      if (!h?.childLayout) return;
      let u = t.nodes.filter((b) => b.parentId === e);
      a && (u = u.filter((b) => b.id !== a)), l && !u.some((b) => b.id === l.id) && (u = [...u, l]);
      const f = new Map(u.map((b) => [b.id, b]));
      if (h.dimensions = void 0, !d && h.maxDimensions && h.maxDimensions.width !== void 0 && h.maxDimensions.height !== void 0 && (d = { width: h.maxDimensions.width, height: h.maxDimensions.height }), !c)
        for (const b of u)
          b.childLayout && this.layoutChildren(b.id, { excludeId: s, omitFromComputation: a, shallow: !1 });
      const g = h.childLayout, p = g.headerHeight !== void 0 ? g : h.data?.label ? { ...g, headerHeight: 30 } : g, w = Gi(u, p, d);
      for (const [b, D] of w.positions) {
        if (b === s || l && b === l.id && !t._nodeMap.has(b)) continue;
        const M = f.get(b);
        M && (M.position ? (M.position.x = D.x, M.position.y = D.y) : M.position = { x: D.x, y: D.y });
      }
      for (const [b, D] of w.dimensions) {
        if (b === s || l && b === l.id && !t._nodeMap.has(b)) continue;
        const M = f.get(b);
        if (M) {
          let T = D.width, v = D.height;
          M.minDimensions && (M.minDimensions.width != null && (T = Math.max(T, M.minDimensions.width)), M.minDimensions.height != null && (v = Math.max(v, M.minDimensions.height))), M.maxDimensions && (M.maxDimensions.width != null && (T = Math.min(T, M.maxDimensions.width)), M.maxDimensions.height != null && (v = Math.min(v, M.maxDimensions.height))), M.dimensions ? (M.dimensions.width = T, M.dimensions.height = v) : M.dimensions = { width: T, height: v }, M.childLayout && !c && this.layoutChildren(b, { excludeId: s, omitFromComputation: a, shallow: !1, stretchedSize: M.dimensions });
        }
      }
      let m = w.parentDimensions.width, C = w.parentDimensions.height;
      if (h.minDimensions && (h.minDimensions.width != null && (m = Math.max(m, h.minDimensions.width)), h.minDimensions.height != null && (C = Math.max(C, h.minDimensions.height))), h.maxDimensions && (h.maxDimensions.width != null && (m = Math.min(m, h.maxDimensions.width)), h.maxDimensions.height != null && (C = Math.min(C, h.maxDimensions.height))), h.dimensions || (h.dimensions = { width: 0, height: 0 }), h.dimensions.width = m, h.dimensions.height = C, m !== w.parentDimensions.width || C !== w.parentDimensions.height) {
        const D = Gi(u, p, { width: m, height: C });
        for (const [M, T] of D.positions) {
          if (M === s || l && M === l.id && !t._nodeMap.has(M)) continue;
          const v = f.get(M);
          v && (v.position ? (v.position.x = T.x, v.position.y = T.y) : v.position = { x: T.x, y: T.y });
        }
        for (const [M, T] of D.dimensions) {
          if (M === s || l && M === l.id && !t._nodeMap.has(M)) continue;
          const v = f.get(M);
          if (v) {
            let P = T.width, $ = T.height;
            v.minDimensions && (v.minDimensions.width != null && (P = Math.max(P, v.minDimensions.width)), v.minDimensions.height != null && ($ = Math.max($, v.minDimensions.height))), v.maxDimensions && (v.maxDimensions.width != null && (P = Math.min(P, v.maxDimensions.width)), v.maxDimensions.height != null && ($ = Math.min($, v.maxDimensions.height))), v.dimensions ? (v.dimensions.width = P, v.dimensions.height = $) : v.dimensions = { width: P, height: $ }, v.childLayout && !c && this.layoutChildren(M, { excludeId: s, omitFromComputation: a, shallow: !1, stretchedSize: v.dimensions });
          }
        }
      }
    },
    /**
     * Walk up from a parent through ancestor layout parents, calling
     * layoutChildren(shallow) at each level so parent resizes propagate
     * through the hierarchy (e.g. Column grows -> Row adjusts -> Step adjusts).
     */
    propagateLayoutUp(e, n) {
      const o = n?.omitFromComputation ? { omitFromComputation: n.omitFromComputation } : void 0;
      let i = t.nodes.find(
        (r) => r.id === e
      )?.parentId;
      for (; i; ) {
        const r = t._nodeMap.get(i);
        if (!r?.childLayout) break;
        this.layoutChildren(i, { ...o, shallow: !0 }), i = r.parentId;
      }
    },
    /**
     * Reorder a child within its layout parent.
     *
     * Reassigns order values for all siblings, then runs layoutChildren
     * and emits a `child-reorder` event.
     */
    reorderChild(e, n) {
      const o = t._nodeMap.get(e);
      if (!o?.parentId || !t._nodeMap.get(o.parentId)?.childLayout) return;
      t._captureHistory();
      const s = t.nodes.filter((l) => l.parentId === o.parentId).sort((l, c) => (l.order ?? 1 / 0) - (c.order ?? 1 / 0)).filter((l) => l.id !== e), a = Math.max(0, Math.min(n, s.length));
      s.splice(a, 0, o);
      for (let l = 0; l < s.length; l++)
        s[l].order = l;
      this.layoutChildren(o.parentId), t._emit("child-reorder", { nodeId: e, parentId: o.parentId, order: a });
    },
    // ── Layout engines ─────────────────────────────────────────────────────
    /**
     * Apply Dagre (directed acyclic graph) layout.
     *
     * Requires the dagre addon to be registered via `Alpine.plugin(AlpineFlowDagre)`.
     */
    layout(e) {
      const n = Et("layout:dagre");
      if (!n)
        throw new Error("layout() requires the dagre plugin. Register it with: Alpine.plugin(AlpineFlowDagre)");
      const o = e?.direction ?? "TB", i = n(t.nodes, t.edges, {
        direction: o,
        nodesep: e?.nodesep,
        ranksep: e?.ranksep
      });
      this._applyLayout(i, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration
      }), B("layout", "Applied dagre layout", { direction: o }), t._emit("layout", { type: "dagre", direction: o });
    },
    /**
     * Apply force-directed layout.
     *
     * Requires the force addon to be registered via `Alpine.plugin(AlpineFlowForce)`.
     */
    forceLayout(e) {
      const n = Et("layout:force");
      if (!n)
        throw new Error("forceLayout() requires the force plugin. Register it with: Alpine.plugin(AlpineFlowForce)");
      const o = n(t.nodes, t.edges, {
        strength: e?.strength,
        distance: e?.distance,
        charge: e?.charge,
        iterations: e?.iterations,
        center: e?.center
      });
      this._applyLayout(o, {
        fitView: e?.fitView,
        duration: e?.duration
      }), B("layout", "Applied force layout", { charge: e?.charge ?? -300, distance: e?.distance ?? 150 }), t._emit("layout", { type: "force", charge: e?.charge ?? -300, distance: e?.distance ?? 150 });
    },
    /**
     * Apply hierarchy/tree layout.
     *
     * Requires the hierarchy addon to be registered via `Alpine.plugin(AlpineFlowHierarchy)`.
     */
    treeLayout(e) {
      const n = Et("layout:hierarchy");
      if (!n)
        throw new Error("treeLayout() requires the hierarchy plugin. Register it with: Alpine.plugin(AlpineFlowHierarchy)");
      const o = e?.direction ?? "TB", i = n(t.nodes, t.edges, {
        layoutType: e?.layoutType,
        direction: o,
        nodeWidth: e?.nodeWidth,
        nodeHeight: e?.nodeHeight
      });
      this._applyLayout(i, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration
      }), B("layout", "Applied tree layout", { layoutType: e?.layoutType ?? "tree", direction: o }), t._emit("layout", { type: "tree", layoutType: e?.layoutType ?? "tree", direction: o });
    },
    /**
     * Apply ELK (Eclipse Layout Kernel) layout.
     *
     * Requires the elk addon to be registered via `Alpine.plugin(AlpineFlowElk)`.
     * Note: elkLayout is async because ELK's layout() returns a Promise.
     */
    async elkLayout(e) {
      const n = Et("layout:elk");
      if (!n)
        throw new Error("elkLayout() requires the elk plugin. Register it with: Alpine.plugin(AlpineFlowElk)");
      const o = e?.direction ?? "DOWN", i = await n(t.nodes, t.edges, {
        algorithm: e?.algorithm,
        direction: o,
        nodeSpacing: e?.nodeSpacing,
        layerSpacing: e?.layerSpacing
      });
      if (i.size === 0) {
        B("layout", "ELK layout returned no positions — skipping apply");
        return;
      }
      this._applyLayout(i, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration
      }), B("layout", "Applied ELK layout", { algorithm: e?.algorithm ?? "layered", direction: o }), t._emit("layout", { type: "elk", algorithm: e?.algorithm ?? "layered", direction: o });
    }
  };
}
function fh(t) {
  return {
    // ── Internal helpers ──────────────────────────────────────────────────
    _getChildValidation(e) {
      const n = t.getNode(e);
      if (n)
        return Zt(n, t._config.childValidationRules ?? {});
    },
    _recomputeChildValidation() {
      const e = /* @__PURE__ */ new Set(), n = t._config.childValidationRules ?? {};
      for (const o of t.nodes)
        o.parentId && e.add(o.parentId), (o.data?.childValidation || n[o.type ?? "default"]) && e.add(o.id);
      for (const [o] of t._validationErrorCache)
        e.add(o);
      for (const o of e) {
        const i = t.getNode(o);
        if (!i) {
          t._validationErrorCache.delete(o);
          continue;
        }
        const r = Zt(i, t._config.childValidationRules ?? {});
        if (!r) {
          t._validationErrorCache.delete(o);
          continue;
        }
        const s = t.nodes.filter((l) => l.parentId === o), a = Wi(i, s, r);
        a.length > 0 ? t._validationErrorCache.set(o, a) : t._validationErrorCache.delete(o), i._validationErrors = a;
      }
    },
    // ── Child Validation API ─────────────────────────────────────────────
    validateParent(e) {
      const n = t.getNode(e);
      if (!n) return { valid: !0, errors: [] };
      const o = Zt(n, t._config.childValidationRules ?? {});
      if (!o) return { valid: !0, errors: [] };
      const i = t.nodes.filter((s) => s.parentId === e), r = Wi(n, i, o);
      return { valid: r.length === 0, errors: r };
    },
    validateAll() {
      const e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
      for (const o of t.nodes)
        o.parentId && n.add(o.parentId);
      for (const o of n)
        e.set(o, this.validateParent(o));
      return e;
    },
    getValidationErrors(e) {
      return t._validationErrorCache.get(e) ?? [];
    },
    // ── Reparent ─────────────────────────────────────────────────────────
    /**
     * Reparent a node into a new parent (or detach from current parent).
     * Handles position conversion and child validation.
     * Returns true on success, false if validation rejects the operation.
     */
    reparentNode(e, n) {
      const o = t.getNode(e);
      if (!o) return !1;
      const i = o.parentId ?? null;
      if (i === n) return !0;
      if (n === null) {
        if (i) {
          const h = this._getChildValidation(i);
          if (h) {
            const u = t.getNode(i);
            if (u) {
              const f = t.nodes.filter(
                (p) => p.parentId === i
              ), g = qn(u, o, f, h);
              if (!g.valid)
                return t._config.onChildValidationFail && t._config.onChildValidationFail({
                  parent: u,
                  child: o,
                  operation: "remove",
                  rule: g.rule,
                  message: g.message
                }), !1;
            }
          }
        }
        t._captureHistory();
        const d = t.getAbsolutePosition(e);
        if (o.position.x = d.x, o.position.y = d.y, o.parentId = void 0, o.extent = void 0, t.nodes = rt(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), i) {
          let h, u = i;
          for (; u; ) {
            const f = t._nodeMap.get(u);
            if (!f) break;
            f.childLayout && (h = u), u = f.parentId;
          }
          h && t.layoutChildren?.(h);
        }
        return t._emit("node-reparent", { node: o, oldParentId: i, newParentId: null }), !0;
      }
      const r = t.getNode(n);
      if (!r || st(e, t.nodes).has(n)) return !1;
      const s = this._getChildValidation(n);
      if (s) {
        const d = t.nodes.filter(
          (u) => u.parentId === n && u.id !== e
        ), h = hr(r, o, d, s);
        if (!h.valid)
          return t._config.onChildValidationFail && t._config.onChildValidationFail({
            parent: r,
            child: o,
            operation: "add",
            rule: h.rule,
            message: h.message
          }), !1;
      }
      if (i) {
        const d = this._getChildValidation(i);
        if (d) {
          const h = t.getNode(i);
          if (h) {
            const u = t.nodes.filter(
              (g) => g.parentId === i
            ), f = qn(h, o, u, d);
            if (!f.valid)
              return t._config.onChildValidationFail && t._config.onChildValidationFail({
                parent: h,
                child: o,
                operation: "remove",
                rule: f.rule,
                message: f.message
              }), !1;
          }
        }
      }
      t._captureHistory();
      const a = i ? t.getAbsolutePosition(e) : { x: o.position.x, y: o.position.y }, l = t.getAbsolutePosition(n);
      if (o.position.x = a.x - l.x, o.position.y = a.y - l.y, o.parentId = n, t.nodes = rt(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), n && t._nodeMap.get(n)?.childLayout) {
        if (!o.childLayout) {
          const h = t._initialDimensions.get(e);
          o.dimensions = h ? { ...h } : void 0;
        }
        if (o.order == null) {
          const h = t.nodes.filter(
            (u) => u.parentId === n && u.id !== o.id
          );
          o.order = h.length > 0 ? Math.max(...h.map((u) => u.order ?? 0)) + 1 : 0;
        }
      }
      const c = /* @__PURE__ */ new Set();
      for (const d of [n, i]) {
        if (!d) continue;
        let h, u = d;
        for (; u; ) {
          const f = t._nodeMap.get(u);
          if (!f) break;
          f.childLayout && (h = u), u = f.parentId;
        }
        h && c.add(h);
      }
      for (const d of c)
        t.layoutChildren?.(d);
      return t._emit("node-reparent", { node: o, oldParentId: i, newParentId: n }), !0;
    }
  };
}
function hh(t) {
  return {
    registerCompute(e, n) {
      t._computeEngine.registerCompute(e, n);
    },
    compute(e) {
      const n = t._computeEngine.compute(t.nodes, t.edges, e);
      return t._emit("compute-complete", { results: n }), t.$nextTick(() => {
        requestAnimationFrame(() => {
          const o = /* @__PURE__ */ new Set();
          for (const [i] of n) {
            const r = t._nodeElements.get(i), s = t._nodeMap.get(i);
            if (r && s) {
              r.style.width = "", r.style.height = "";
              const a = r.offsetWidth, l = r.offsetHeight;
              (!s.dimensions || a !== s.dimensions.width || l !== s.dimensions.height) && (s.dimensions = { width: a, height: l }, o.add(i)), r.style.width = a + "px", r.style.height = l + "px";
            }
          }
          o.size > 0 && t._refreshEdgePaths(o);
        });
      }), n;
    }
  };
}
function Mn(t, e, n, o, i) {
  const r = i * Math.PI / 180, s = Math.cos(r), a = Math.sin(r), l = t - n, c = e - o;
  return {
    x: n + l * s - c * a,
    y: o + l * a + c * s
  };
}
const _r = 20, En = _r + 1;
function Ji(t) {
  switch (t) {
    case "top":
      return { x: 0, y: -1 };
    case "bottom":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
    default:
      return { x: 0, y: 1 };
  }
}
function gh(t, e) {
  return {
    x: t.x - e,
    y: t.y - e,
    width: t.width + e * 2,
    height: t.height + e * 2
  };
}
function ph(t, e, n) {
  return t > n.x && t < n.x + n.width && e > n.y && e < n.y + n.height;
}
function mh(t, e, n, o) {
  const i = Math.min(t, e), r = Math.max(t, e);
  for (const s of o) {
    const a = s.x, l = s.x + s.width, c = s.y, d = s.y + s.height;
    if (n > c && n < d && r > a && i < l)
      return !0;
  }
  return !1;
}
function yh(t, e, n, o) {
  const i = Math.min(e, n), r = Math.max(e, n);
  for (const s of o) {
    const a = s.x, l = s.x + s.width, c = s.y, d = s.y + s.height;
    if (t > a && t < l && r > c && i < d)
      return !0;
  }
  return !1;
}
function wh(t, e, n, o, i) {
  const r = /* @__PURE__ */ new Set([t, n]), s = /* @__PURE__ */ new Set([e, o]);
  for (const h of i)
    r.add(h.x), r.add(h.x + h.width), s.add(h.y), s.add(h.y + h.height);
  const a = Array.from(r).sort((h, u) => h - u), l = Array.from(s).sort((h, u) => h - u), c = [];
  let d = 0;
  for (const h of a)
    for (const u of l) {
      let f = !1;
      for (const g of i)
        if (ph(h, u, g)) {
          f = !0;
          break;
        }
      f || c.push({ x: h, y: u, index: d++ });
    }
  return c;
}
function vh(t, e, n, o) {
  const i = n.length, r = new Float64Array(i).fill(1 / 0), s = new Int32Array(i).fill(-1), a = new Uint8Array(i);
  r[t.index] = 0;
  const l = [t.index];
  for (; l.length > 0; ) {
    let h = 0;
    for (let g = 1; g < l.length; g++)
      r[l[g]] < r[l[h]] && (h = g);
    const u = l[h];
    if (l.splice(h, 1), a[u]) continue;
    if (a[u] = 1, u === e.index) break;
    const f = n[u];
    for (let g = 0; g < i; g++) {
      if (a[g]) continue;
      const p = n[g];
      if (f.x !== p.x && f.y !== p.y) continue;
      let w = !1;
      if (f.x === p.x ? w = yh(f.x, f.y, p.y, o) : w = mh(f.x, p.x, f.y, o), w) continue;
      const m = Math.abs(p.x - f.x) + Math.abs(p.y - f.y), C = r[u] + m;
      C < r[g] && (r[g] = C, s[g] = u, l.push(g));
    }
  }
  if (r[e.index] === 1 / 0) return null;
  const c = [];
  let d = e.index;
  for (; d !== -1; )
    c.unshift(n[d]), d = s[d];
  return c;
}
function _h(t) {
  if (t.length <= 2) return t;
  const e = [t[0]];
  for (let n = 1; n < t.length - 1; n++) {
    const o = e[e.length - 1], i = t[n + 1], r = t[n], s = o.x === r.x && r.x === i.x, a = o.y === r.y && r.y === i.y;
    !s && !a && e.push(r);
  }
  return e.push(t[t.length - 1]), e;
}
function bh(t, e) {
  if (t.length < 2) return "";
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1];
    e > 0 ? n += ` ${$t(r.x, r.y, s.x, s.y, a.x, a.y, e)}` : n += ` L${s.x},${s.y}`;
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function xh(t) {
  if (t.length < 2)
    return { x: t[0]?.x ?? 0, y: t[0]?.y ?? 0, offsetX: 0, offsetY: 0 };
  let e = 0;
  const n = [];
  for (let r = 1; r < t.length; r++) {
    const s = t[r].x - t[r - 1].x, a = t[r].y - t[r - 1].y, l = Math.abs(s) + Math.abs(a);
    n.push(l), e += l;
  }
  let o = e / 2;
  for (let r = 0; r < n.length; r++) {
    if (o <= n[r]) {
      const s = n[r] > 0 ? o / n[r] : 0, a = t[r].x + (t[r + 1].x - t[r].x) * s, l = t[r].y + (t[r + 1].y - t[r].y) * s;
      return {
        x: a,
        y: l,
        offsetX: Math.abs(t[t.length - 1].x - t[0].x) / 2,
        offsetY: Math.abs(t[t.length - 1].y - t[0].y) / 2
      };
    }
    o -= n[r];
  }
  const i = t[t.length - 1];
  return { x: i.x, y: i.y, offsetX: 0, offsetY: 0 };
}
function br(t, e, n, o, i, r, s) {
  const a = Ji(n), l = Ji(r), c = t + a.x * En, d = e + a.y * En, h = o + l.x * En, u = i + l.y * En, f = s.map((D) => gh(D, _r)), g = wh(
    c,
    d,
    h,
    u,
    f
  ), p = g.find((D) => D.x === c && D.y === d), w = g.find((D) => D.x === h && D.y === u);
  p || g.push({ x: c, y: d, index: g.length }), w || g.push({ x: h, y: u, index: g.length });
  const m = p ?? g[g.length - (w ? 1 : 2)], C = w ?? g[g.length - 1], S = vh(m, C, g, f);
  if (!S || S.length < 2) return null;
  const b = [
    { x: t, y: e, index: -1 },
    ...S,
    { x: o, y: i, index: -2 }
  ];
  return _h(b);
}
function Eh({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s,
  borderRadius: a = 5
}) {
  if (!s || s.length === 0)
    return an({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: a
    });
  const l = br(t, e, n, o, i, r, s);
  if (!l)
    return an({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: a
    });
  const c = bh(l, a), { x: d, y: h, offsetX: u, offsetY: f } = xh(l);
  return {
    path: c,
    labelPosition: { x: d, y: h },
    labelOffsetX: u,
    labelOffsetY: f
  };
}
function xr(t) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return `M${t[0].x},${t[0].y} L${t[1].x},${t[1].y}`;
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 0; n < t.length - 1; n++) {
    const o = t[Math.max(0, n - 1)], i = t[n], r = t[n + 1], s = t[Math.min(t.length - 1, n + 2)], a = i.x + (r.x - o.x) / 6, l = i.y + (r.y - o.y) / 6, c = r.x - (s.x - i.x) / 6, d = r.y - (s.y - i.y) / 6;
    e += ` C${a},${l} ${c},${d} ${r.x},${r.y}`;
  }
  return e;
}
function Ch(t) {
  if (t.length < 2)
    return { x: t[0]?.x ?? 0, y: t[0]?.y ?? 0, offsetX: 0, offsetY: 0 };
  let e = 0;
  const n = [];
  for (let r = 1; r < t.length; r++) {
    const s = t[r].x - t[r - 1].x, a = t[r].y - t[r - 1].y, l = Math.sqrt(s * s + a * a);
    n.push(l), e += l;
  }
  let o = e / 2;
  for (let r = 0; r < n.length; r++) {
    if (o <= n[r]) {
      const s = n[r] > 0 ? o / n[r] : 0, a = t[r].x + (t[r + 1].x - t[r].x) * s, l = t[r].y + (t[r + 1].y - t[r].y) * s;
      return {
        x: a,
        y: l,
        offsetX: Math.abs(t[t.length - 1].x - t[0].x) / 2,
        offsetY: Math.abs(t[t.length - 1].y - t[0].y) / 2
      };
    }
    o -= n[r];
  }
  const i = t[t.length - 1];
  return { x: i.x, y: i.y, offsetX: 0, offsetY: 0 };
}
function Sh({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s
}) {
  if (!s || s.length === 0)
    return Bn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const a = br(t, e, n, o, i, r, s);
  if (!a)
    return Bn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const l = xr(a), { x: c, y: d, offsetX: h, offsetY: u } = Ch(a);
  return {
    path: l,
    labelPosition: { x: c, y: d },
    labelOffsetX: h,
    labelOffsetY: u
  };
}
function Ph(t) {
  const {
    sourceX: e,
    sourceY: n,
    targetX: o,
    targetY: i,
    controlPoints: r = [],
    pathStyle: s = "bezier",
    borderRadius: a = 5
  } = t, l = [
    { x: e, y: n },
    ...r,
    { x: o, y: i }
  ];
  let c;
  switch (s) {
    case "linear":
      c = Qi(l);
      break;
    case "step":
      c = kh(l, 0);
      break;
    case "smoothstep":
      c = Lh(l, a);
      break;
    case "catmull-rom":
    case "bezier":
      c = xr(l.map((u, f) => ({ ...u, index: f })));
      break;
    default:
      c = Qi(l);
  }
  const d = Mh(l), h = un({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: d,
    labelOffsetX: h.offsetX,
    labelOffsetY: h.offsetY
  };
}
function Qi(t) {
  if (t.length < 2) return "";
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 1; n < t.length; n++)
    e += ` L${t[n].x},${t[n].y}`;
  return e;
}
function kh(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return Er(t[0], t[1], e);
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1];
    n += $t(r.x, r.y, s.x, s.y, a.x, a.y, e);
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function Er(t, e, n) {
  const o = (t.x + e.x) / 2, i = $t(t.x, t.y, o, t.y, o, e.y, n), r = $t(o, t.y, o, e.y, e.x, e.y, n);
  return `M${t.x},${t.y}${i}${r} L${e.x},${e.y}`;
}
function Lh(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return Er(t[0], t[1], e);
  const n = [t[0]];
  for (let r = 0; r < t.length - 1; r++) {
    const s = t[r], a = t[r + 1], l = Math.abs(a.x - s.x), c = Math.abs(a.y - s.y);
    if (l < 1 || c < 1)
      n.push(a);
    else {
      const d = (s.x + a.x) / 2;
      n.push({ x: d, y: s.y }), n.push({ x: d, y: a.y }), n.push(a);
    }
  }
  let o = `M${n[0].x},${n[0].y}`;
  for (let r = 1; r < n.length - 1; r++) {
    const s = n[r - 1], a = n[r], l = n[r + 1];
    o += $t(s.x, s.y, a.x, a.y, l.x, l.y, e);
  }
  const i = n[n.length - 1];
  return o += ` L${i.x},${i.y}`, o;
}
function Mh(t) {
  if (t.length < 2) return t[0] ?? { x: 0, y: 0 };
  let e = 0;
  const n = [];
  for (let i = 0; i < t.length - 1; i++) {
    const r = t[i + 1].x - t[i].x, s = t[i + 1].y - t[i].y, a = Math.sqrt(r * r + s * s);
    n.push(a), e += a;
  }
  if (e === 0) return t[0];
  let o = e / 2;
  for (let i = 0; i < n.length; i++) {
    if (o <= n[i]) {
      const r = o / n[i];
      return {
        x: t[i].x + (t[i + 1].x - t[i].x) * r,
        y: t[i].y + (t[i + 1].y - t[i].y) * r
      };
    }
    o -= n[i];
  }
  return t[t.length - 1];
}
function Dt(t, e, n, o) {
  const i = t.dimensions?.width ?? ye, r = t.dimensions?.height ?? we, s = Rt(t, o);
  let a;
  if (t.shape) {
    const l = n?.[t.shape] ?? ur[t.shape];
    if (l) {
      const c = l.perimeterPoint(i, r, e);
      a = { x: s.x + c.x, y: s.y + c.y };
    } else {
      const c = Yi(i, r, e);
      a = { x: s.x + c.x, y: s.y + c.y };
    }
  } else {
    const l = Yi(i, r, e);
    a = { x: s.x + l.x, y: s.y + l.y };
  }
  if (t.rotation) {
    const l = s.x + i / 2, c = s.y + r / 2;
    a = Mn(a.x, a.y, l, c, t.rotation);
  }
  return a;
}
function es(t) {
  switch (t) {
    case "top-left":
    case "top-right":
      return "top";
    case "bottom-left":
    case "bottom-right":
      return "bottom";
    default:
      return t;
  }
}
function Ho(t) {
  const e = Math.SQRT1_2;
  switch (t) {
    case "top":
      return { x: 0, y: -1 };
    case "bottom":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
    case "top-left":
      return { x: -e, y: -e };
    case "top-right":
      return { x: e, y: -e };
    case "bottom-left":
      return { x: -e, y: e };
    case "bottom-right":
      return { x: e, y: e };
  }
}
const Th = 1.5, Ah = 5 / 20;
function Ct(t, e, n, o) {
  if (!o) return t;
  const i = typeof o == "string" ? {} : o, r = n ? Math.min(n.handleWidth, n.handleHeight) / 2 : 5;
  if (i.offset !== void 0) {
    const h = Ho(e);
    return { x: t.x + h.x * i.offset, y: t.y + h.y * i.offset };
  }
  const l = (i.width ?? 12.5) * Th * Ah * 0.4, c = r + l, d = Ho(e);
  return { x: t.x + d.x * c, y: t.y + d.y * c };
}
function Wn(t, e, n, o = "bottom", i = "top", r, s, a, l, c, d) {
  const h = r ?? Dt(e, o, c, d), u = s ?? Dt(n, i, c, d), f = {
    sourceX: h.x,
    sourceY: h.y,
    sourcePosition: es(o),
    targetX: u.x,
    targetY: u.y,
    targetPosition: es(i)
  }, g = t.type ?? "bezier";
  if (a?.[g])
    return a[g](f);
  switch (g === "floating" ? t.pathType ?? "bezier" : g) {
    case "editable":
      return Ph({
        ...f,
        controlPoints: t.controlPoints,
        pathStyle: t.pathStyle
      });
    case "avoidant":
      return Sh({ ...f, obstacles: l });
    case "orthogonal":
      return Eh({ ...f, obstacles: l });
    case "smoothstep":
      return an(f);
    case "straight":
      return rr({ sourceX: h.x, sourceY: h.y, targetX: u.x, targetY: u.y });
    default:
      return Bn(f);
  }
}
function ts(t, e) {
  const n = t.dimensions?.width ?? ye, o = t.dimensions?.height ?? we, i = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, r = t.rotation ? Mn(e.x, e.y, i.x, i.y, -t.rotation) : e, s = r.x - i.x, a = r.y - i.y;
  if (s === 0 && a === 0) {
    const g = { x: i.x, y: i.y - o / 2 };
    return t.rotation ? Mn(g.x, g.y, i.x, i.y, t.rotation) : g;
  }
  const l = n / 2, c = o / 2, d = Math.abs(s), h = Math.abs(a);
  let u;
  d / l > h / c ? u = l / d : u = c / h;
  const f = {
    x: i.x + s * u,
    y: i.y + a * u
  };
  return t.rotation ? Mn(f.x, f.y, i.x, i.y, t.rotation) : f;
}
function ns(t, e) {
  const n = t.dimensions?.width ?? ye, o = t.dimensions?.height ?? we, i = t.position.x + n / 2, r = t.position.y + o / 2;
  if (t.rotation) {
    const f = e.x - i, g = e.y - r;
    return Math.abs(f) > Math.abs(g) ? f > 0 ? "right" : "left" : g > 0 ? "bottom" : "top";
  }
  const s = 1, a = t.position.x, l = t.position.x + n, c = t.position.y, d = t.position.y + o;
  if (Math.abs(e.x - a) <= s) return "left";
  if (Math.abs(e.x - l) <= s) return "right";
  if (Math.abs(e.y - c) <= s) return "top";
  if (Math.abs(e.y - d) <= s) return "bottom";
  const h = e.x - i, u = e.y - r;
  return Math.abs(h) > Math.abs(u) ? h > 0 ? "right" : "left" : u > 0 ? "bottom" : "top";
}
function Cr(t, e) {
  const n = t.dimensions?.width ?? ye, o = t.dimensions?.height ?? we, i = e.dimensions?.width ?? ye, r = e.dimensions?.height ?? we, s = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, a = {
    x: e.position.x + i / 2,
    y: e.position.y + r / 2
  }, l = ts(t, a), c = ts(e, s), d = ns(t, l), h = ns(e, c);
  return {
    sx: l.x,
    sy: l.y,
    tx: c.x,
    ty: c.y,
    sourcePos: d,
    targetPos: h
  };
}
function fm(t, e) {
  const n = e.x - t.x, o = e.y - t.y;
  let i, r;
  return Math.abs(n) > Math.abs(o) ? (i = n > 0 ? "right" : "left", r = n > 0 ? "left" : "right") : (i = o > 0 ? "bottom" : "top", r = o > 0 ? "top" : "bottom"), { sourcePos: i, targetPos: r };
}
function Sr(t) {
  return typeof t == "object" && t !== null && "from" in t && "to" in t;
}
function Pr(t, e) {
  return `${t}__grad__${e}`;
}
function kr(t, e, n, o, i, r, s) {
  let a = t.querySelector(`#${CSS.escape(e)}`);
  if (!a) {
    a = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"), a.id = e, a.setAttribute("gradientUnits", "userSpaceOnUse"), a.classList.add("flow-edge-gradient");
    const c = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    c.setAttribute("offset", "0%"), a.appendChild(c);
    const d = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    d.setAttribute("offset", "100%"), a.appendChild(d), t.appendChild(a);
  }
  a.setAttribute("x1", String(o)), a.setAttribute("y1", String(i)), a.setAttribute("x2", String(r)), a.setAttribute("y2", String(s));
  const l = a.querySelectorAll("stop");
  return l[0]?.setAttribute("stop-color", n.from), l[1]?.setAttribute("stop-color", n.to), a;
}
function po(t, e) {
  t.querySelector(`#${CSS.escape(e)}`)?.remove();
}
const Nh = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
function $h(t) {
  return t === !0 || t === "dash" ? "dash" : t === "pulse" ? "pulse" : t === "dot" ? "dot" : "none";
}
function Lr(t) {
  return t.endsWith("-l") ? "left" : t.endsWith("-r") ? "right" : null;
}
function os(t, e) {
  if (!e) return t;
  const n = Ho(t), o = e * Math.PI / 180, i = Math.cos(o), r = Math.sin(o), s = n.x * i - n.y * r, a = n.x * r + n.y * i;
  return Math.abs(s) > Math.abs(a) ? s > 0 ? "right" : "left" : a > 0 ? "bottom" : "top";
}
function jn(t, e, n, o, i) {
  const r = t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (r) {
    if (n) {
      const a = r.querySelector(`[data-flow-handle-id="${CSS.escape(n)}"]`);
      if (a)
        return a.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
    }
    if (n) {
      const a = Lr(n);
      if (a && r.querySelector(`[data-flow-handle-position="${a}"]`))
        return a;
    }
    const s = r.querySelector(`[data-flow-handle-type="${o}"]`);
    if (s)
      return s.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
  }
  if (i) {
    const s = o === "source" ? i.sourcePosition : i.targetPosition;
    if (s) return s;
  }
  return o === "source" ? "bottom" : "top";
}
function is(t, e, n, o, i, r, s) {
  const a = t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (!a) return null;
  let l = null;
  if (o) {
    if (l = a.querySelector(`[data-flow-handle-id="${CSS.escape(o)}"]`), !l) {
      const f = Lr(o);
      f && (l = a.querySelector(`[data-flow-handle-position="${f}"]`));
    }
  } else
    l = a.querySelector(`[data-flow-handle-type="${i}"]`);
  if (!l) return null;
  const c = l.getBoundingClientRect();
  if (c.width === 0 && c.height === 0) return null;
  const d = t.getBoundingClientRect(), h = c.left + c.width / 2, u = c.top + c.height / 2;
  return {
    x: (h - d.left - s.x) / r,
    y: (u - d.top - s.y) / r,
    handleWidth: c.width / r,
    handleHeight: c.height / r
  };
}
function Ih(t, e) {
  const n = t.getTotalLength(), o = t.getPointAtLength(n * Math.max(0, Math.min(1, e)));
  return { x: o.x, y: o.y };
}
function et(t, e, n, o, i) {
  const r = t - n, s = e - o;
  return Math.sqrt(r * r + s * s) <= i;
}
function Dh(t, e, n) {
  const o = n.x - e.x, i = n.y - e.y, r = o * o + i * i;
  if (r === 0) return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
  let s = ((t.x - e.x) * o + (t.y - e.y) * i) / r;
  s = Math.max(0, Math.min(1, s));
  const a = e.x + s * o, l = e.y + s * i;
  return Math.sqrt((t.x - a) ** 2 + (t.y - l) ** 2);
}
function Rh(t) {
  t.directive(
    "flow-edge",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      const s = e;
      s.style.pointerEvents = "auto";
      const a = document.createElementNS("http://www.w3.org/2000/svg", "path");
      a.setAttribute("fill", "none"), a.style.stroke = "transparent", a.style.strokeWidth = "20", a.style.pointerEvents = "stroke", a.style.cursor = "pointer", s.appendChild(a);
      let l = e.querySelector("path:not(:first-child)");
      l || (l = document.createElementNS("http://www.w3.org/2000/svg", "path"), l.setAttribute("fill", "none"), l.setAttribute("stroke-width", "1.5"), l.style.pointerEvents = "none", s.appendChild(l));
      let c = null, d = null, h = null, u = null, f = "none", g = null;
      function p(E, k, N, U, J) {
        u || (u = document.createElementNS("http://www.w3.org/2000/svg", "circle"), u.classList.add("flow-edge-dot"), u.style.pointerEvents = "none", E.appendChild(u));
        const oe = N.closest(".flow-container"), G = oe ? getComputedStyle(oe) : null, se = U.particleSize ?? (parseFloat(G?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), le = J || G?.getPropertyValue("--flow-edge-dot-duration").trim() || "2s";
        u.setAttribute("r", String(se)), U.particleColor ? u.style.fill = U.particleColor : u.style.removeProperty("fill");
        const ce = u.querySelector("animateMotion");
        ce && ce.remove();
        const te = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        te.setAttribute("dur", le), te.setAttribute("repeatCount", "indefinite"), te.setAttribute("path", k), u.appendChild(te);
      }
      function w() {
        u?.remove(), u = null;
      }
      let m = null, C = null, S = null, b = null;
      const D = (E) => {
        E.stopPropagation();
        const k = o(n);
        if (!k) return;
        const N = t.$data(e.closest("[x-data]"));
        N && (N._emit("edge-click", { edge: k, event: E }), it(E, N._shortcuts?.multiSelect) ? N.selectedEdges.has(k.id) ? (N.selectedEdges.delete(k.id), k.selected = !1, B("selection", `Edge "${k.id}" deselected (shift)`)) : (N.selectedEdges.add(k.id), k.selected = !0, B("selection", `Edge "${k.id}" selected (shift)`)) : (N.deselectAll(), N.selectedEdges.add(k.id), k.selected = !0, B("selection", `Edge "${k.id}" selected`)), N._emitSelectionChange());
      }, M = (E) => {
        E.preventDefault(), E.stopPropagation();
        const k = o(n);
        if (!k) return;
        const N = t.$data(e.closest("[x-data]"));
        if (!N) return;
        const U = E.target;
        if (U.classList.contains("flow-edge-control-point")) {
          const J = parseInt(U.dataset.pointIndex ?? "", 10);
          if (!isNaN(J)) {
            N._emit("edge-control-point-context-menu", {
              edge: k,
              pointIndex: J,
              position: { x: E.clientX, y: E.clientY },
              event: E
            });
            return;
          }
        }
        N._emit("edge-context-menu", { edge: k, event: E });
      }, T = (E) => {
        E.stopPropagation(), E.preventDefault();
        const k = o(n);
        if (!k || k.type !== "editable") return;
        const N = t.$data(e.closest("[x-data]"));
        if (!N) return;
        const U = E.target;
        if (U.classList.contains("flow-edge-control-point")) {
          const J = parseInt(U.dataset.pointIndex ?? "", 10);
          !isNaN(J) && k.controlPoints && (N._captureHistory?.(), k.controlPoints.splice(J, 1), N._emit("edge-control-point-change", { edge: k, action: "remove", index: J }));
          return;
        }
        if (U.classList.contains("flow-edge-midpoint")) {
          const J = parseInt(U.dataset.segmentIndex ?? "", 10);
          if (!isNaN(J)) {
            const oe = N.screenToFlowPosition(E.clientX, E.clientY);
            k.controlPoints || (k.controlPoints = []), N._captureHistory?.(), k.controlPoints.splice(J, 0, { x: oe.x, y: oe.y }), N._emit("edge-control-point-change", { edge: k, action: "add", index: J });
          }
          return;
        }
        if (U.closest("path")) {
          const J = N.screenToFlowPosition(E.clientX, E.clientY);
          k.controlPoints || (k.controlPoints = []);
          const oe = [
            m ?? { x: 0, y: 0 },
            ...k.controlPoints,
            C ?? { x: 0, y: 0 }
          ];
          let G = 0, se = 1 / 0;
          for (let le = 0; le < oe.length - 1; le++) {
            const ce = Dh(J, oe[le], oe[le + 1]);
            ce < se && (se = ce, G = le);
          }
          N._captureHistory?.(), k.controlPoints.splice(G, 0, { x: J.x, y: J.y }), N._emit("edge-control-point-change", { edge: k, action: "add", index: G });
        }
      }, v = (E) => {
        const k = E.target;
        if (!k.classList.contains("flow-edge-control-point") || E.button !== 0) return;
        E.stopPropagation(), E.preventDefault();
        const N = o(n);
        if (!N?.controlPoints) return;
        const U = t.$data(e.closest("[x-data]"));
        if (!U) return;
        const J = parseInt(k.dataset.pointIndex ?? "", 10);
        if (isNaN(J)) return;
        k.classList.add("dragging");
        let oe = !1;
        const G = (le) => {
          oe || (U._captureHistory?.(), oe = !0);
          let ce = U.screenToFlowPosition(le.clientX, le.clientY);
          const te = U._config?.snapToGrid;
          te && (ce = {
            x: Math.round(ce.x / te[0]) * te[0],
            y: Math.round(ce.y / te[1]) * te[1]
          }), N.controlPoints[J] = ce;
        }, se = () => {
          document.removeEventListener("pointermove", G), document.removeEventListener("pointerup", se), k.classList.remove("dragging"), oe && U._emit("edge-control-point-change", { edge: N, action: "move", index: J });
        };
        document.addEventListener("pointermove", G), document.addEventListener("pointerup", se);
      };
      s.addEventListener("contextmenu", M), s.addEventListener("dblclick", T), s.addEventListener("pointerdown", v, !0);
      let P = null;
      const $ = (E) => {
        if (E.button !== 0) return;
        E.stopPropagation();
        const k = o(n);
        if (!k) return;
        const N = t.$data(e.closest("[x-data]"));
        if (!N) return;
        const U = N._config?.reconnectSnapRadius ?? Mi, J = N._config?.edgesReconnectable !== !1, oe = k.reconnectable ?? !0;
        let G = null;
        if (J && oe !== !1 && m && C) {
          const ne = N.screenToFlowPosition(E.clientX, E.clientY), H = et(ne.x, ne.y, m.x, m.y, U) || S && et(ne.x, ne.y, S.x, S.y, U);
          (et(ne.x, ne.y, C.x, C.y, U) || b && et(ne.x, ne.y, b.x, b.y, U)) && (oe === !0 || oe === "target") ? G = "target" : H && (oe === !0 || oe === "source") && (G = "source");
        }
        if (!G) {
          const ne = (H) => {
            document.removeEventListener("pointerup", ne), D(H);
          };
          document.addEventListener("pointerup", ne, { once: !0 });
          return;
        }
        const se = E.clientX, le = E.clientY;
        let ce = !1, te = !1, R = null;
        const Q = N._config?.connectionSnapRadius ?? 20;
        let X = null, W = null, I = null, j = se, ee = le;
        const V = e.closest(".flow-container");
        if (!V) return;
        const K = G === "target" ? m : C, ie = () => {
          ce = !0, s.classList.add("flow-edge-reconnecting"), N._emit("reconnect-start", { edge: k, handleType: G }), B("reconnect", `Reconnection drag started on edge "${k.id}" (${G} end)`), W = kt({
            connectionLineType: N._config?.connectionLineType,
            connectionLineStyle: N._config?.connectionLineStyle,
            connectionLine: N._config?.connectionLine,
            containerEl: s.closest(".flow-container") ?? void 0
          }), X = W.svg;
          const ne = N.screenToFlowPosition(se, le);
          W.update({
            fromX: K.x,
            fromY: K.y,
            toX: ne.x,
            toY: ne.y,
            source: k.source,
            sourceHandle: k.sourceHandle
          });
          const H = V.querySelector(".flow-viewport");
          H && H.appendChild(X), G === "target" && (N.pendingConnection = {
            source: k.source,
            sourceHandle: k.sourceHandle,
            position: ne
          }), N._pendingReconnection = {
            edge: k,
            draggedEnd: G,
            anchorPosition: { ...K },
            position: ne
          }, I = Xn(V, N, j, ee), G === "target" && Ut(V, k.source, k.sourceHandle ?? "source", N, k.id);
        }, F = (ne) => {
          if (j = ne.clientX, ee = ne.clientY, !ce) {
            Math.sqrt(
              (ne.clientX - se) ** 2 + (ne.clientY - le) ** 2
            ) >= Ln && ie();
            return;
          }
          const H = N.screenToFlowPosition(ne.clientX, ne.clientY), z = jt({
            containerEl: V,
            handleType: G === "target" ? "target" : "source",
            excludeNodeId: G === "target" ? k.source : k.target,
            cursorFlowPos: H,
            connectionSnapRadius: Q,
            getNode: (re) => N.getNode(re),
            toFlowPosition: (re, fe) => N.screenToFlowPosition(re, fe)
          });
          z.element !== R && (R?.classList.remove("flow-handle-active"), z.element?.classList.add("flow-handle-active"), R = z.element), W?.update({
            fromX: K.x,
            fromY: K.y,
            toX: z.position.x,
            toY: z.position.y,
            source: k.source,
            sourceHandle: k.sourceHandle
          });
          const ae = z.position;
          G === "target" && N.pendingConnection && (N.pendingConnection = {
            ...N.pendingConnection,
            position: ae
          }), N._pendingReconnection && (N._pendingReconnection = {
            ...N._pendingReconnection,
            position: ae
          }), I?.updatePointer(ne.clientX, ne.clientY);
        }, Z = () => {
          te || (te = !0, document.removeEventListener("pointermove", F), document.removeEventListener("pointerup", Y), I?.stop(), I = null, W?.destroy(), W = null, X = null, R?.classList.remove("flow-handle-active"), P = null, s.classList.remove("flow-edge-reconnecting"), Se(V), N.pendingConnection = null, N._pendingReconnection = null);
        }, Y = (ne) => {
          if (!ce) {
            Z(), D(ne);
            return;
          }
          let H = R, z = null;
          if (!H) {
            z = document.elementFromPoint(ne.clientX, ne.clientY);
            const he = G === "target" ? '[data-flow-handle-type="target"]' : '[data-flow-handle-type="source"]';
            H = z?.closest(he);
          }
          const re = (H ? H.closest("[data-flow-node-id]") : z?.closest("[data-flow-node-id]"))?.dataset.flowNodeId, fe = H?.dataset.flowHandleId;
          let pe = !1;
          if (re) {
            if (!(() => {
              const he = N.getNode(re);
              return he && !nt(he);
            })()) {
              const he = G === "target" ? { source: k.source, sourceHandle: k.sourceHandle, target: re, targetHandle: fe } : { source: re, sourceHandle: fe, target: k.target, targetHandle: k.targetHandle }, xe = N.edges.filter((be) => be.id !== k.id);
              if (!We(he, xe, { preventCycles: N._config?.preventCycles }))
                B("reconnect", "Reconnection rejected (invalid connection)");
              else if (!ze(V, he, xe))
                B("reconnect", "Reconnection rejected (handle limit)");
              else if (!Fe(V, he))
                B("reconnect", "Reconnection rejected (per-handle validator)");
              else if (N._config?.isValidConnection && !N._config.isValidConnection(he))
                B("reconnect", "Reconnection rejected (custom validator)");
              else {
                const be = { ...k };
                N._captureHistory?.(), G === "target" ? (k.target = he.target, k.targetHandle = he.targetHandle) : (k.source = he.source, k.sourceHandle = he.sourceHandle), pe = !0, B("reconnect", `Edge "${k.id}" reconnected (${G})`, he), N._emit("reconnect", { oldEdge: be, newConnection: he });
              }
            }
          }
          pe || B("reconnect", `Edge "${k.id}" reconnection cancelled — snapping back`), N._emit("reconnect-end", { edge: k, successful: pe }), Z();
        };
        document.addEventListener("pointermove", F), document.addEventListener("pointerup", Y), P = Z;
      };
      s.addEventListener("pointerdown", $);
      const x = (E) => {
        const k = o(n);
        if (!k) return;
        const N = t.$data(e.closest("[x-data]"));
        if (!N) return;
        const U = N._config?.edgesReconnectable !== !1, J = k.reconnectable ?? !0;
        if (!U || J === !1 || !m || !C) {
          s.style.removeProperty("cursor"), a.style.cursor = "pointer";
          return;
        }
        const oe = N._config?.reconnectSnapRadius ?? Mi, G = N.screenToFlowPosition(E.clientX, E.clientY), se = (et(G.x, G.y, m.x, m.y, oe) || S && et(G.x, G.y, S.x, S.y, oe)) && (J === !0 || J === "source"), le = (et(G.x, G.y, C.x, C.y, oe) || b && et(G.x, G.y, b.x, b.y, oe)) && (J === !0 || J === "target");
        se || le ? (s.style.cursor = "grab", a.style.cursor = "grab") : (s.style.removeProperty("cursor"), a.style.cursor = "pointer");
      };
      s.addEventListener("pointermove", x);
      const y = (E) => {
        if (E.key !== "Enter" && E.key !== " ") return;
        E.preventDefault(), E.stopPropagation();
        const k = o(n);
        if (!k) return;
        const N = t.$data(e.closest("[x-data]"));
        N && (N._emit("edge-click", { edge: k, event: E }), it(E, N._shortcuts?.multiSelect) ? N.selectedEdges.has(k.id) ? (N.selectedEdges.delete(k.id), k.selected = !1) : (N.selectedEdges.add(k.id), k.selected = !0) : (N.deselectAll(), N.selectedEdges.add(k.id), k.selected = !0), N._emitSelectionChange());
      };
      s.addEventListener("keydown", y);
      const q = () => {
        s.matches(":focus-visible") && s.classList.add("flow-edge-focused");
      }, _ = () => s.classList.remove("flow-edge-focused");
      s.addEventListener("focus", q), s.addEventListener("blur", _);
      const L = (E) => {
        E.stopPropagation();
      };
      s.addEventListener("mousedown", L);
      const A = () => {
        for (const E of [c, d, h])
          E && E.classList.add("flow-edge-hovered");
      }, O = () => {
        for (const E of [c, d, h])
          E && E.classList.remove("flow-edge-hovered");
      };
      s.addEventListener("mouseenter", A), s.addEventListener("mouseleave", O), i(() => {
        const E = o(n);
        if (!E || !l) return;
        s.setAttribute("data-flow-edge-id", E.id);
        const k = t.$data(e.closest("[x-data]"));
        if (!k?.nodes) return;
        k._layoutAnimTick;
        const N = k.getNode(E.source), U = k.getNode(E.target);
        if (!N || !U) return;
        N.sourcePosition, U.targetPosition;
        const J = Lt(N, k._nodeMap, k._config?.nodeOrigin), oe = Lt(U, k._nodeMap, k._config?.nodeOrigin), G = e.closest("[x-data]");
        let se, le, ce, te;
        if (E.type === "floating") {
          const H = Cr(J, oe);
          se = H.sourcePos, le = H.targetPos, ce = { x: H.sx, y: H.sy, handleWidth: 0, handleHeight: 0 }, te = { x: H.tx, y: H.ty, handleWidth: 0, handleHeight: 0 }, m = { x: H.sx, y: H.sy }, C = { x: H.tx, y: H.ty };
        } else {
          se = jn(G, E.source, E.sourceHandle, "source", N), le = jn(G, E.target, E.targetHandle, "target", U);
          const H = t.raw(k).viewport ?? { x: 0, y: 0, zoom: 1 }, z = H.zoom || 1, ae = N.rotation, re = U.rotation;
          se = os(se, ae), le = os(le, re), ce = is(G, E.source, J, E.sourceHandle, "source", z, H), te = is(G, E.target, oe, E.targetHandle, "target", z, H);
          const fe = Dt(J, se, k._shapeRegistry, k._config?.nodeOrigin), pe = Dt(oe, le, k._shapeRegistry, k._config?.nodeOrigin);
          m = ce ?? fe, C = te ?? pe;
        }
        const R = Ct(ce ?? m, se, ce, E.markerStart), Q = Ct(te ?? C, le, te, E.markerEnd);
        S = R, b = Q;
        let X;
        (E.type === "orthogonal" || E.type === "avoidant") && (X = k.nodes.filter((H) => H.id !== E.source && H.id !== E.target).map((H) => {
          const z = Lt(H, k._nodeMap, k._config?.nodeOrigin);
          return {
            x: z.position.x,
            y: z.position.y,
            width: z.dimensions?.width ?? ye,
            height: z.dimensions?.height ?? we
          };
        }));
        const { path: W, labelPosition: I } = Wn(E, J, oe, se, le, R, Q, k._config?.edgeTypes, X, k._shapeRegistry, k._config?.nodeOrigin);
        l.setAttribute("d", W), a.setAttribute("d", W);
        const j = E.type === "editable", ee = j && (E.showControlPoints || E.selected);
        if (s.querySelectorAll(".flow-edge-control-point, .flow-edge-midpoint").forEach((H) => H.remove()), ee) {
          const H = E.controlPoints ?? [], z = k.viewport?.zoom ?? 1, ae = 6 / z, re = 5 / z, fe = m ?? { x: 0, y: 0 }, pe = C ?? { x: 0, y: 0 }, he = [fe, ...H, pe], xe = he.length - 1, be = l.getTotalLength?.() ?? 0;
          if (be > 0) {
            const de = [0], me = 200;
            let Le = 1;
            for (let _e = 1; _e <= me && Le < he.length; _e++) {
              const Ne = _e / me * be, Ce = l.getPointAtLength(Ne), ge = he[Le], ue = Ce.x - ge.x, ve = Ce.y - ge.y;
              ue * ue + ve * ve < 25 && (de.push(Ne), Le++);
            }
            for (; de.length <= xe; )
              de.push(be);
            for (let _e = 0; _e < xe; _e++) {
              const Ne = (de[_e] + de[_e + 1]) / 2, Ce = l.getPointAtLength(Ne), ge = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              ge.classList.add("flow-edge-midpoint"), ge.setAttribute("cx", String(Ce.x)), ge.setAttribute("cy", String(Ce.y)), ge.setAttribute("r", String(re)), ge.dataset.segmentIndex = String(_e);
              const ue = document.createElementNS("http://www.w3.org/2000/svg", "title");
              ue.textContent = "Double-click to add control point", ge.appendChild(ue), s.appendChild(ge);
            }
          }
          for (let de = 0; de < H.length; de++) {
            const me = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            me.classList.add("flow-edge-control-point"), me.setAttribute("cx", String(H[de].x)), me.setAttribute("cy", String(H[de].y)), me.setAttribute("r", String(ae)), me.dataset.pointIndex = String(de), s.appendChild(me);
          }
        }
        if (a.style.cursor = j ? "crosshair" : "pointer", a.style.strokeWidth = String(
          E.interactionWidth ?? k._config?.defaultInteractionWidth ?? 20
        ), E.markerStart) {
          const H = on(E.markerStart), z = sn(H, k._id);
          l.setAttribute("marker-start", `url(#${z})`);
        } else
          l.removeAttribute("marker-start");
        if (E.markerEnd) {
          const H = on(E.markerEnd), z = sn(H, k._id);
          l.setAttribute("marker-end", `url(#${z})`);
        } else
          l.removeAttribute("marker-end");
        const V = E.strokeWidth ?? 1.5, K = $h(E.animated);
        switch (K !== f && (l.classList.remove("flow-edge-animated", "flow-edge-pulse"), f === "dot" && w(), f = K), K) {
          case "dash":
            l.classList.add("flow-edge-animated");
            break;
          case "pulse":
            l.classList.add("flow-edge-pulse");
            break;
          case "dot":
            p(s, W, G, E, E.animationDuration);
            break;
        }
        if (E.animationDuration && K !== "none" ? (K === "dash" || K === "pulse") && (l.style.animationDuration = E.animationDuration) : (K === "dash" || K === "pulse") && l.style.removeProperty("animation-duration"), E.class) {
          const H = K === "dash" ? " flow-edge-animated" : K === "pulse" ? " flow-edge-pulse" : "";
          l.setAttribute("class", E.class + H);
        }
        if (s.setAttribute("aria-selected", String(!!E.selected)), E.selected)
          s.classList.add("flow-edge-selected"), l.style.strokeWidth = String(Math.max(V + 1, 2.5)), l.style.stroke = "var(--flow-edge-stroke-selected, " + tn + ")";
        else {
          s.classList.remove("flow-edge-selected"), l.style.strokeWidth = String(V);
          const H = k._markerDefsEl?.querySelector("defs") ?? null;
          if (Sr(E.color)) {
            if (H) {
              const z = Pr(k._id, E.id), ae = E.gradientDirection === "target-source", re = m.x, fe = m.y, pe = C.x, he = C.y;
              kr(
                H,
                z,
                ae ? { from: E.color.to, to: E.color.from } : E.color,
                re,
                fe,
                pe,
                he
              ), l.style.stroke = `url(#${z})`, g = z;
            }
          } else if (E.color) {
            if (g) {
              const z = H;
              z && po(z, g), g = null;
            }
            l.style.stroke = E.color;
          } else {
            if (g) {
              const z = H;
              z && po(z, g), g = null;
            }
            l.style.removeProperty("stroke");
          }
        }
        if (k.selectedRows?.size > 0 && !E.selected && (E.sourceHandle && k.selectedRows.has(E.sourceHandle.replace(/-[lr]$/, "")) || E.targetHandle && k.selectedRows.has(E.targetHandle.replace(/-[lr]$/, ""))) ? (s.classList.add("flow-edge-row-highlighted"), E.selected || (l.style.strokeWidth = String(Math.max(V + 0.5, 2)), l.style.stroke = getComputedStyle(s.closest(".flow-container")).getPropertyValue("--flow-edge-row-highlight-color").trim() || "#3b82f6")) : s.classList.remove("flow-edge-row-highlighted"), E.focusable ?? k._config?.edgesFocusable !== !1 ? (s.setAttribute("tabindex", "0"), s.setAttribute("role", E.ariaRole ?? "group"), s.setAttribute("aria-label", E.ariaLabel ?? (E.label ? `Edge: ${E.label}` : `Edge from ${E.source} to ${E.target}`))) : (s.removeAttribute("tabindex"), s.removeAttribute("role"), s.removeAttribute("aria-label")), E.domAttributes)
          for (const [H, z] of Object.entries(E.domAttributes))
            H.startsWith("on") || Nh.has(H.toLowerCase()) || s.setAttribute(H, z);
        const Z = (H, z, ae, re, fe) => {
          if (z) {
            if (!H && re) {
              const pe = ae.includes("flow-edge-label-start"), he = ae.includes("flow-edge-label-end");
              let xe = `[data-flow-edge-id="${fe}"].flow-edge-label`;
              pe ? xe += ".flow-edge-label-start" : he ? xe += ".flow-edge-label-end" : xe += ":not(.flow-edge-label-start):not(.flow-edge-label-end)", H = re.querySelector(xe);
            }
            return H || (H = document.createElement("div"), H.className = ae, H.dataset.flowEdgeId = fe, re && re.appendChild(H)), H.textContent = z, H;
          }
          return H && H.remove(), null;
        }, Y = e.closest(".flow-viewport"), ne = E.labelVisibility ?? "always";
        if (c = Z(c, E.label, "flow-edge-label", Y, E.id), c)
          if (l.getTotalLength?.()) {
            const H = E.labelPosition ?? 0.5, z = Ih(l, H);
            c.style.left = `${z.x}px`, c.style.top = `${z.y}px`;
          } else
            c.style.left = `${I.x}px`, c.style.top = `${I.y}px`;
        if (d = Z(d, E.labelStart, "flow-edge-label flow-edge-label-start", Y, E.id), d && l.getTotalLength?.()) {
          const H = l.getTotalLength(), z = E.labelStartOffset ?? 30, ae = l.getPointAtLength(Math.min(z, H / 2));
          d.style.left = `${ae.x}px`, d.style.top = `${ae.y}px`;
        }
        if (h = Z(h, E.labelEnd, "flow-edge-label flow-edge-label-end", Y, E.id), h && l.getTotalLength?.()) {
          const H = l.getTotalLength(), z = E.labelEndOffset ?? 30, ae = l.getPointAtLength(Math.max(H - z, H / 2));
          h.style.left = `${ae.x}px`, h.style.top = `${ae.y}px`;
        }
        for (const H of [c, d, h])
          H && (H.classList.toggle("flow-edge-label-hover", ne === "hover"), H.classList.toggle("flow-edge-label-on-select", ne === "selected"), H.classList.toggle("flow-edge-label-selected", !!E.selected));
      }), r(() => {
        if (g) {
          const k = t.$data(e.closest("[x-data]"))?._markerDefsEl?.querySelector("defs");
          k && po(k, g);
        }
        P?.(), w(), s.removeEventListener("contextmenu", M), s.removeEventListener("dblclick", T), s.removeEventListener("pointerdown", v, !0), s.removeEventListener("pointerdown", $), s.removeEventListener("pointermove", x), s.removeEventListener("keydown", y), s.removeEventListener("focus", q), s.removeEventListener("blur", _), s.removeEventListener("mousedown", L), s.removeEventListener("mouseenter", A), s.removeEventListener("mouseleave", O), c?.remove(), d?.remove(), h?.remove();
      });
    }
  );
}
function Hh(t, e) {
  return {
    /** Write node positions directly to DOM elements (bypassing Alpine effects). */
    _flushNodePositions(n) {
      for (const o of n) {
        const i = t.getNode(o);
        if (!i) continue;
        const r = t._nodeElements.get(o);
        if (!r) continue;
        const s = e.raw(i), a = s.parentId ? t.getAbsolutePosition(o) : s.position, l = s.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0], c = s.dimensions?.width ?? 150, d = s.dimensions?.height ?? 40;
        r.style.left = a.x - c * l[0] + "px", r.style.top = a.y - d * l[1] + "px";
      }
    },
    /** Write node styles directly to DOM elements (bypassing Alpine effects). */
    _flushNodeStyles(n) {
      for (const o of n) {
        const i = t.getNode(o);
        if (!i) continue;
        const r = t._nodeElements.get(o);
        if (!r) continue;
        const a = e.raw(i).style;
        if (!a) continue;
        const l = typeof a == "string" ? nn(a) : a;
        for (const [c, d] of Object.entries(l))
          r.style.setProperty(c, d);
      }
    },
    /** Write edge color/strokeWidth directly to SVG elements (bypassing Alpine effects). */
    _flushEdgeStyles(n) {
      for (const o of n) {
        const i = t.getEdge(o);
        if (!i) continue;
        const r = e.raw(i), s = t.getEdgePathElement(o);
        s && (typeof r.color == "string" && (s.style.stroke = r.color), r.strokeWidth !== void 0 && (s.style.strokeWidth = String(r.strokeWidth)));
      }
    },
    /** Push current viewport state to the DOM (transform, background, culling). */
    _flushViewport() {
      if (t._viewportEl) {
        const n = t.viewport;
        t._viewportEl.style.transform = `translate(${n.x}px, ${n.y}px) scale(${n.zoom})`;
      }
      t._applyBackground(), t._applyCulling();
    },
    /** Recompute SVG paths, label positions, and gradients for edges connected to the given node IDs. */
    _refreshEdgePaths(n) {
      for (const o of t.edges) {
        if (!n.has(o.source) && !n.has(o.target)) continue;
        const i = e.raw(t.getNode(o.source)), r = e.raw(t.getNode(o.target));
        if (!i || !r) continue;
        const s = Lt(i, t._nodeMap, t._config.nodeOrigin), a = Lt(r, t._nodeMap, t._config.nodeOrigin);
        let l, c, d, h;
        if (o.type === "floating") {
          const f = Cr(s, a);
          d = { x: f.sx, y: f.sy }, h = { x: f.tx, y: f.ty };
          const g = Ct(d, f.sourcePos, null, o.markerStart), p = Ct(h, f.targetPos, null, o.markerEnd), w = Wn(o, s, a, f.sourcePos, f.targetPos, g, p, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          l = w.path, c = w.labelPosition;
        } else {
          const f = t._container, g = f ? jn(f, o.source, o.sourceHandle, "source", i) : i?.sourcePosition ?? "bottom", p = f ? jn(f, o.target, o.targetHandle, "target", r) : r?.targetPosition ?? "top";
          d = Dt(s, g, t._shapeRegistry, t._config.nodeOrigin), h = Dt(a, p, t._shapeRegistry, t._config.nodeOrigin);
          const w = Ct(d, g, null, o.markerStart), m = Ct(h, p, null, o.markerEnd), C = Wn(o, s, a, g, p, w, m, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          l = C.path, c = C.labelPosition;
        }
        const u = t.getEdgePathElement(o.id);
        if (u) {
          u.setAttribute("d", l);
          const g = u.parentElement?.querySelector("path:first-child");
          g && g !== u && g.setAttribute("d", l);
        }
        if (Sr(o.color)) {
          const f = t._markerDefsEl?.querySelector("defs");
          if (f) {
            const g = Pr(t._id, o.id), p = o.gradientDirection === "target-source";
            kr(
              f,
              g,
              p ? { from: o.color.to, to: o.color.from } : o.color,
              d.x,
              d.y,
              h.x,
              h.y
            );
          }
        }
        if ((o.label || o.labelStart || o.labelEnd) && t._viewportEl) {
          if (o.label) {
            const f = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label:not(.flow-edge-label-start):not(.flow-edge-label-end)`
            );
            f && (f.style.left = `${c.x}px`, f.style.top = `${c.y}px`);
          }
          if (o.labelStart && u) {
            const f = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label-start`
            );
            if (f) {
              const g = u.getTotalLength(), p = o.labelStartOffset ?? 30, w = u.getPointAtLength(Math.min(p, g / 2));
              f.style.left = `${w.x}px`, f.style.top = `${w.y}px`;
            }
          }
          if (o.labelEnd && u) {
            const f = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label-end`
            );
            if (f) {
              const g = u.getTotalLength(), p = o.labelEndOffset ?? 30, w = u.getPointAtLength(Math.max(g - p, g / 2));
              f.style.left = `${w.x}px`, f.style.top = `${w.y}px`;
            }
          }
        }
      }
    }
  };
}
function Fh(t) {
  return {
    _applyConfigPatch(e) {
      const n = t._config;
      for (const [o, i] of Object.entries(e))
        if (i !== void 0)
          switch (n[o] = i, o) {
            case "pannable":
            case "zoomable":
            case "minZoom":
            case "maxZoom":
            case "panOnScroll":
            case "panOnScrollDirection":
            case "panOnScrollSpeed":
              t._panZoom?.update({ [o]: i });
              break;
            case "background":
              t._background = i, t._applyBackground();
              break;
            case "backgroundGap":
              t._backgroundGap = i, t._container && t._container.style.setProperty("--flow-bg-pattern-gap", String(i));
              break;
            case "patternColor":
              t._patternColorOverride = i, t._container && t._container.style.setProperty("--flow-bg-pattern-color", i);
              break;
            case "debug":
              Us(!!i);
              break;
            case "preventOverlap":
              t._config.preventOverlap = i;
              break;
            case "reconnectOnDelete":
              t._config.reconnectOnDelete = i;
              break;
            case "nodeOrigin":
              t._config.nodeOrigin = i;
              break;
            case "preventCycles":
              t._config.preventCycles = i;
              break;
            case "loading":
              t._userLoading = !!i;
              break;
            case "loadingText":
              t._loadingText = i;
              break;
            case "colorMode":
              t._config.colorMode = i, i && t._container ? t._colorModeHandle ? t._colorModeHandle.update(i) : t._colorModeHandle = fr(t._container, i) : !i && t._colorModeHandle && (t._colorModeHandle.destroy(), t._colorModeHandle = null);
              break;
            case "autoLayout":
              n.autoLayout = i || void 0, t._autoLayoutFailed = !1, i ? (t._autoLayoutReady = !0, t._scheduleAutoLayout()) : (t._autoLayoutReady = !1, t._autoLayoutTimer && (clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = null));
              break;
          }
    }
  };
}
let zh = 0;
function Oh(t, e) {
  switch (t) {
    case "lines":
    case "cross":
      return `linear-gradient(0deg, ${e} 1px, transparent 1px), linear-gradient(90deg, ${e} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${e} 1px, transparent 1px)`;
  }
}
function Vh(t) {
  t.data("flowCanvas", (e = {}) => {
    const n = {
      // ── Reactive State ────────────────────────────────────────────────
      /** Unique instance ID for SVG marker dedup, etc. */
      _id: `flow-${++zh}`,
      nodes: e.nodes ?? [],
      edges: e.edges ?? [],
      viewport: {
        x: e.viewport?.x ?? 0,
        y: e.viewport?.y ?? 0,
        zoom: e.viewport?.zoom ?? 1
      },
      /** Whether the canvas has completed initialization and first node measurement */
      ready: !1,
      /** User-controlled loading flag, initialized from config.loading */
      _userLoading: e.loading ?? !1,
      /** Custom text for the default loading indicator */
      _loadingText: e.loadingText ?? "Loading…",
      /** Auto-injected loading overlay element (when config.loading: true and no directive) */
      _autoLoadingOverlay: null,
      /** True when the canvas is still initializing OR the user has set loading */
      get isLoading() {
        return !this.ready || this._userLoading;
      },
      /** Whether interactivity (pan/zoom/drag) is enabled */
      isInteractive: !0,
      /** Currently active connection drag, or null */
      pendingConnection: null,
      /** Currently active edge reconnection drag, or null */
      _pendingReconnection: null,
      /** Set of selected node IDs */
      selectedNodes: /* @__PURE__ */ new Set(),
      /** Set of selected edge IDs */
      selectedEdges: /* @__PURE__ */ new Set(),
      /** Set of selected row IDs (format: nodeId.attrId) */
      selectedRows: /* @__PURE__ */ new Set(),
      /** Context menu state — populated automatically by context menu events */
      contextMenu: {
        show: !1,
        type: null,
        x: 0,
        y: 0,
        node: null,
        edge: null,
        position: null,
        nodes: null,
        event: null
      },
      // ── Shape Registry ─────────────────────────────────────────────────
      _shapeRegistry: { ...ur, ...e.shapeTypes },
      // ── Background ────────────────────────────────────────────────────
      _background: e.background ?? "dots",
      _backgroundGap: e.backgroundGap ?? null,
      _patternColorOverride: e.patternColor ?? null,
      _getBackgroundGap() {
        if (this._backgroundGap !== null)
          return this._backgroundGap;
        if (this._container) {
          const s = getComputedStyle(this._container).getPropertyValue("--flow-bg-pattern-gap").trim(), a = parseFloat(s);
          if (!isNaN(a))
            return a;
        }
        return 20;
      },
      _resolveBackgroundLayers() {
        const s = this._background;
        if (!s || s === "none") return [];
        const a = this._getBackgroundGap(), l = this._patternColorOverride ?? "var(--flow-bg-pattern-color)";
        return Array.isArray(s) ? s.map((c) => ({
          variant: c.variant ?? "dots",
          gap: c.gap ?? a,
          color: c.color ?? l
        })) : [{ variant: s, gap: a, color: l }];
      },
      backgroundStyle() {
        const s = this._resolveBackgroundLayers();
        if (s.length === 0) return { backgroundImage: "", backgroundSize: "", backgroundPosition: "" };
        const a = this.viewport.zoom, l = this.viewport.x, c = this.viewport.y, d = [], h = [], u = [];
        for (const f of s) {
          const g = f.gap * a, p = f.variant === "cross" ? g / 2 : g;
          d.push(Oh(f.variant, f.color)), f.variant === "lines" || f.variant === "cross" ? (h.push(`${p}px ${p}px, ${p}px ${p}px`), u.push(`${l}px ${c}px, ${l}px ${c}px`)) : (h.push(`${g}px ${g}px`), u.push(`${l}px ${c}px`));
        }
        return {
          backgroundImage: d.join(", "),
          backgroundSize: h.join(", "),
          backgroundPosition: u.join(", ")
        };
      },
      // ── Internal ──────────────────────────────────────────────────────
      // Strip collab from stored config — provider objects may contain
      // circular references (e.g. InMemoryProvider.peer) that crash
      // Alpine's deep-reactive proxy walker.
      _config: (() => {
        const { collab: s, ...a } = e;
        return a;
      })(),
      _shortcuts: Xu(e.keyboardShortcuts),
      _container: null,
      _panZoom: null,
      _onKeyDown: null,
      _active: !1,
      _zoomLevel: "close",
      _onContainerPointerDown: null,
      _onCanvasClick: null,
      _onCanvasContextMenu: null,
      _contextMenuBackdrop: null,
      _markerDefsEl: null,
      _minimap: null,
      _controls: null,
      _selectionBox: null,
      _lasso: null,
      _selectionTool: "box",
      _onSelectionPointerDown: null,
      _onSelectionPointerMove: null,
      _onSelectionPointerUp: null,
      _selectionShiftHeld: !1,
      _selectionEffectiveMode: "partial",
      _suppressNextCanvasClick: !1,
      /** Cleanup function for long-press listener */
      _longPressCleanup: null,
      /** Whether touch selection mode is currently active */
      _touchSelectionMode: !1,
      /** Cleanup function for touch selection mode listeners */
      _touchSelectionCleanup: null,
      _nodeMap: /* @__PURE__ */ new Map(),
      /** Stores each node's originally configured dimensions (before layout stretch). */
      _initialDimensions: /* @__PURE__ */ new Map(),
      _edgeMap: /* @__PURE__ */ new Map(),
      _viewportEl: null,
      _history: null,
      _announcer: null,
      _computeEngine: new sf(),
      _computeDebounceTimer: null,
      _animationLocked: !1,
      _activeTimelines: /* @__PURE__ */ new Set(),
      _animationRegistry: /* @__PURE__ */ new Map(),
      _followHandle: null,
      _animator: null,
      /** Saved pre-collapse state per group node ID */
      _collapseState: /* @__PURE__ */ new Map(),
      /** Whether this canvas was hydrated from a pre-rendered static diagram */
      _hydratedFromStatic: !1,
      // ── Shared Particle Loop ────────────────────────────────────────────
      _activeParticles: /* @__PURE__ */ new Set(),
      _particleEngineHandle: null,
      /** Live CSSStyleDeclaration for the container — cached to avoid per-particle getComputedStyle calls. */
      _containerStyles: null,
      // ── Color Mode ────────────────────────────────────────────────────
      _colorModeHandle: null,
      // ── Child Validation ─────────────────────────────────────────────
      _validationErrorCache: /* @__PURE__ */ new Map(),
      // ── Layout animation edge refresh ─────────────────────────────────
      /** Reactive tick bumped each frame during layout animation so edges re-measure DOM. */
      _layoutAnimTick: 0,
      _layoutAnimFrame: 0,
      // ── Auto-Layout ──────────────────────────────────────────────────
      _autoLayoutTimer: null,
      _autoLayoutReady: !1,
      _autoLayoutFailed: !1,
      // ── Viewport Culling (CSS-only, outside Alpine reactive system) ────
      _nodeElements: /* @__PURE__ */ new Map(),
      _edgeSvgElements: /* @__PURE__ */ new Map(),
      _visibleNodeIds: /* @__PURE__ */ new Set(),
      // ── Context Menu Auto-Populate ─────────────────────────────────────
      _contextMenuListeners: [],
      // ── Drop Zone ───────────────────────────────────────────────────────
      _onDropZoneDragOver: null,
      _onDropZoneDrop: null,
      // ── Event Dispatch ────────────────────────────────────────────────
      /**
       * Emit an event: debug log it, invoke the config callback, and
       * dispatch a DOM CustomEvent (flow-xxx) for Alpine @flow-xxx listeners.
       */
      _emit(s, a) {
        B("event", s, a);
        const l = "on" + s.split("-").map(
          (d) => d.charAt(0).toUpperCase() + d.slice(1)
        ).join(""), c = e[l];
        typeof c == "function" && c(a), this._container?.dispatchEvent(new CustomEvent(`flow-${s}`, {
          bubbles: !0,
          detail: a
        })), this._announcer?.handleEvent(s, a ?? {}), e.computeMode === "auto" && (s === "nodes-change" || s === "edges-change") && (this._computeDebounceTimer && clearTimeout(this._computeDebounceTimer), this._computeDebounceTimer = setTimeout(() => {
          this._computeDebounceTimer = null, this.compute();
        }, 16));
      },
      /** Route a warning through the onError callback (if set) and console.warn. */
      _warn(s, a) {
        typeof e.onError == "function" && e.onError(s, a), console.warn(`[AlpineFlow] ${a}`);
      },
      _emitSelectionChange() {
        this._emit("selection-change", {
          nodes: [...this.selectedNodes],
          edges: [...this.selectedEdges],
          rows: [...this.selectedRows]
        });
      },
      _rebuildNodeMap() {
        this._nodeMap = lr(this.nodes);
      },
      _rebuildEdgeMap() {
        this._edgeMap = new Map(this.edges.map((s) => [s.id, s]));
      },
      /**
       * Hydrate from a pre-rendered static diagram.
       * Reads the render plan from data-flow-plan, populates node dimensions and
       * viewport from it, then strips the static markers so normal reactivity takes over.
       */
      _hydrateFromStatic() {
        const s = this._container.getAttribute("data-flow-plan");
        if (!s) return;
        let a;
        try {
          a = JSON.parse(s);
        } catch {
          return;
        }
        const l = /* @__PURE__ */ new Map();
        for (const c of a.nodes ?? [])
          l.set(c.id, { width: c.width, height: c.height });
        for (const c of this.nodes) {
          const d = l.get(c.id);
          d && !c.dimensions && (c.dimensions = { width: d.width, height: d.height }, this._initialDimensions.set(c.id, { ...d }));
        }
        a.viewport && (this.viewport.x = a.viewport.x, this.viewport.y = a.viewport.y, this.viewport.zoom = a.viewport.zoom), this._hydratedFromStatic = !0, this._container.removeAttribute("data-flow-static"), this._container.removeAttribute("data-flow-plan"), this._container.classList.remove("flow-static");
      },
      _captureHistory() {
        this._history?.capture({ nodes: this.nodes, edges: this.edges });
      },
      _suspendHistory() {
        this._history?.suspend();
      },
      _resumeHistory() {
        this._history?.resume();
      },
      _applyBackground() {
        const s = this._container;
        if (!s) return;
        const a = this.backgroundStyle();
        Object.assign(s.style, {
          backgroundImage: a.backgroundImage,
          backgroundSize: a.backgroundSize,
          backgroundPosition: a.backgroundPosition
        });
      },
      /**
       * Toggle CSS display on off-screen nodes and edges.
       * Called from onTransformChange — entirely outside Alpine's reactive system.
       */
      _applyCulling() {
        if (e.viewportCulling !== !0 || !this._container) return;
        const s = this._container.clientWidth, a = this._container.clientHeight;
        if (s === 0 || a === 0) return;
        const l = e.cullingBuffer ?? 100, c = tu(this.viewport, s, a, l), d = /* @__PURE__ */ new Set();
        for (const h of this.nodes) {
          if (h.hidden) continue;
          const u = h.dimensions?.width ?? 150, f = h.dimensions?.height ?? 50, g = h.parentId ? $o(h, this._nodeMap, this._config.nodeOrigin) : h.position, p = !(g.x + u < c.minX || g.x > c.maxX || g.y + f < c.minY || g.y > c.maxY);
          p && d.add(h.id);
          const w = this._nodeElements.get(h.id);
          w && (w.style.display = p ? "" : "none");
        }
        this._visibleNodeIds = d;
      },
      _getVisibleNodeIds() {
        return this._visibleNodeIds;
      },
      _applyZoomLevel(s) {
        if (e.zoomLevels === !1) return;
        const a = e.zoomLevels?.far ?? 0.4, l = e.zoomLevels?.medium ?? 0.75, c = s < a ? "far" : s < l ? "medium" : "close";
        c !== this._zoomLevel && (this._zoomLevel = c, this._container?.setAttribute("data-zoom-level", c));
      },
      getAbsolutePosition(s) {
        const a = this._nodeMap.get(s);
        return a ? $o(a, this._nodeMap, this._config.nodeOrigin) : { x: 0, y: 0 };
      },
      // ── Init Helpers ─────────────────────────────────────────────────
      /** Enable debug logging if configured. */
      _initDebug() {
        e.debug && Us(!0);
      },
      /** Set up container element, attributes, CSS custom properties, animator. */
      _initContainer() {
        this._container = this.$el, this._container.setAttribute("data-flow-canvas", ""), e.fitViewOnInit && this._container.setAttribute("data-fit-view", ""), this._container.setAttribute("role", "application"), this._container.setAttribute("aria-label", e.ariaLabel ?? "Flow diagram"), this._containerStyles = getComputedStyle(this._container), this._animator = new hu(zn), e.patternColor && this._container.style.setProperty("--flow-bg-pattern-color", e.patternColor), e.backgroundGap && this._container.style.setProperty("--flow-bg-pattern-gap", String(e.backgroundGap)), this._applyZoomLevel(this.viewport.zoom);
      },
      /** Create color mode handle if configured. */
      _initColorMode() {
        e.colorMode && (this._colorModeHandle = fr(this._container, e.colorMode));
      },
      /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
      _initHydration() {
        this._container.hasAttribute("data-flow-static") && this._hydrateFromStatic(), this.nodes = rt(this.nodes), this._rebuildNodeMap(), this._rebuildEdgeMap();
        for (const s of this.nodes)
          s.dimensions && this._initialDimensions.set(s.id, { ...s.dimensions });
      },
      /** Create FlowHistory if configured. */
      _initHistory() {
        e.history && (this._history = new su(e.historyMaxSize ?? 50));
      },
      /** Create screen reader announcer. */
      _initAnnouncer() {
        if (e.announcements !== !1 && this._container) {
          const s = typeof e.announcements == "object" ? e.announcements.formatMessage : void 0;
          this._announcer = new of(this._container, s);
        }
      },
      /** Set up collaboration bridge via collab addon plugin. */
      _initCollab() {
        if (e.collab && this._container) {
          const s = Et("collab");
          if (!s) {
            console.error("[AlpineFlow] Collaboration requires the collab plugin. Register it with: Alpine.plugin(AlpineFlowCollab)");
            return;
          }
          const a = this._container, { Doc: l, Awareness: c, CollabBridge: d, CollabAwareness: h } = s, u = e.collab, f = new l(), g = new c(f), p = new d(f, this, u.provider), w = new h(g, u.user);
          if (Te.set(a, { bridge: p, awareness: w, doc: f }), u.provider.connect(f, g), u.cursors !== !1) {
            let m = !1;
            const C = u.throttle ?? 20, S = (M) => {
              if (m) return;
              m = !0;
              const T = a.getBoundingClientRect(), v = (M.clientX - T.left - this.viewport.x) / this.viewport.zoom, P = (M.clientY - T.top - this.viewport.y) / this.viewport.zoom;
              w.updateCursor({ x: v, y: P }), setTimeout(() => {
                m = !1;
              }, C);
            }, b = () => {
              w.updateCursor(null);
            };
            a.addEventListener("mousemove", S), a.addEventListener("mouseleave", b);
            const D = Te.get(a);
            D.cursorCleanup = () => {
              a.removeEventListener("mousemove", S), a.removeEventListener("mouseleave", b);
            };
          }
        }
      },
      /** Create panZoom instance, viewport element fallback, apply background, register with store, setup marker defs. */
      _initPanZoom() {
        if (B("init", `flowCanvas "${this._id}" initializing`, {
          nodes: this.nodes.map((s) => ({ id: s.id, type: s.type ?? "default", position: s.position, parentId: s.parentId })),
          edges: this.edges.map((s) => ({ id: s.id, source: s.source, target: s.target, type: s.type ?? "default" })),
          config: { minZoom: e.minZoom, maxZoom: e.maxZoom, pannable: e.pannable, zoomable: e.zoomable, debug: e.debug }
        }), this._panZoom = Gd(this._container, {
          onTransformChange: (s) => {
            this.viewport.x = s.x, this.viewport.y = s.y, this.viewport.zoom = s.zoom, this._viewportEl && (this._viewportEl.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.zoom})`), this._applyBackground(), this._applyCulling(), this._applyZoomLevel(s.zoom), this.contextMenu.show && this.closeContextMenu(), this._emit("viewport-change", { viewport: { ...s } });
          },
          onMoveStart: (s) => {
            this._emit("viewport-move-start", { viewport: { ...s } });
          },
          onMove: (s) => {
            this._emit("viewport-move", { viewport: { ...s } });
          },
          onMoveEnd: (s) => {
            this._emit("viewport-move-end", { viewport: { ...s } });
          },
          minZoom: e.minZoom,
          maxZoom: e.maxZoom,
          pannable: e.pannable,
          zoomable: e.zoomable,
          translateExtent: e.translateExtent,
          isLocked: () => this._animationLocked,
          noPanClassName: e.noPanClassName ?? "nopan",
          noWheelClassName: e.noWheelClassName,
          zoomOnDoubleClick: e.zoomOnDoubleClick,
          panOnDrag: e.panOnDrag,
          panActivationKeyCode: e.panActivationKeyCode,
          zoomActivationKeyCode: e.zoomActivationKeyCode,
          isTouchSelectionMode: () => this._touchSelectionMode,
          panOnScroll: e.panOnScroll,
          panOnScrollDirection: e.panOnScrollDirection,
          panOnScrollSpeed: e.panOnScrollSpeed,
          onScrollPan: (s, a) => {
            this.panBy(s, a);
          }
        }), e.viewport) {
          const s = {
            x: e.viewport.x ?? 0,
            y: e.viewport.y ?? 0,
            zoom: e.viewport.zoom ?? 1
          };
          this.viewport.x = s.x, this.viewport.y = s.y, this.viewport.zoom = s.zoom, this._panZoom.setViewport(s);
        }
        this.$nextTick(() => {
          if (this._viewportEl || (this._viewportEl = this._container?.querySelector(".flow-viewport")), this._viewportEl) {
            const s = this.viewport;
            this._viewportEl.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.zoom})`;
          }
        }), this._applyBackground(), this.$store.flow.register(this._id, this), this._onContainerPointerDown = () => {
          this.$store.flow.activate(this._id);
        }, this._container.addEventListener("pointerdown", this._onContainerPointerDown), Object.keys(this.$store.flow.instances).length === 1 && this.$store.flow.activate(this._id), this._setupMarkerDefs();
      },
      /** Canvas click handler, context menu handler, long press, touch selection mode, context menu event listeners. */
      _initClickHandlers() {
        this._onCanvasClick = (l) => {
          if (this._suppressNextCanvasClick) {
            this._suppressNextCanvasClick = !1;
            return;
          }
          this.pendingConnection && (this._emit("connect-end", {
            connection: null,
            source: this.pendingConnection.source,
            sourceHandle: this.pendingConnection.sourceHandle,
            position: this.screenToFlowPosition(l.clientX, l.clientY)
          }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Se(this._container));
          const c = l.target;
          if (c === this._container || c.classList.contains("flow-viewport")) {
            const d = this.screenToFlowPosition(l.clientX, l.clientY);
            this._emit("pane-click", { event: l, position: d }), this.deselectAll();
          }
        }, this._container.addEventListener("click", this._onCanvasClick), this._onCanvasContextMenu = (l) => {
          const c = l.target;
          if (c === this._container || c.classList.contains("flow-viewport"))
            if (l.preventDefault(), this.selectedNodes.size > 1) {
              const d = this.nodes.filter((h) => this.selectedNodes.has(h.id));
              this._emit("selection-context-menu", { nodes: d, event: l });
            } else {
              const d = this.screenToFlowPosition(l.clientX, l.clientY);
              this._emit("pane-context-menu", { event: l, position: d });
            }
        }, this._container.addEventListener("contextmenu", this._onCanvasContextMenu);
        const s = e.longPressAction ?? "context-menu";
        if (s && (this._longPressCleanup = Yu(
          this._container,
          (l) => {
            const c = l.target;
            if (s === "context-menu") {
              const d = c.closest("[data-flow-node-id]");
              if (d) {
                const u = d.getAttribute("data-flow-node-id"), f = this._nodeMap.get(u);
                if (f) {
                  this._emit("node-context-menu", { node: f, event: l });
                  return;
                }
              }
              const h = c.closest(".flow-edge-svg");
              if (h) {
                const u = h.getAttribute("data-edge-id"), f = u ? this._edgeMap.get(u) : void 0;
                if (f) {
                  this._emit("edge-context-menu", { edge: f, event: l });
                  return;
                }
              }
              if (this.selectedNodes.size > 1) {
                const u = this.nodes.filter((f) => this.selectedNodes.has(f.id));
                this._emit("selection-context-menu", { nodes: u, event: l });
              } else {
                const u = this.screenToFlowPosition(l.clientX, l.clientY);
                this._emit("pane-context-menu", { event: l, position: u });
              }
            } else if (s === "select") {
              const d = c.closest("[data-flow-node-id]");
              if (d) {
                const h = d.getAttribute("data-flow-node-id");
                this.selectedNodes.has(h) ? this.selectedNodes.delete(h) : this.selectedNodes.add(h);
              }
            }
          },
          { duration: e.longPressDuration ?? 500 }
        )), e.touchSelectionMode !== !1) {
          let l = 0, c = 0;
          const d = (p) => {
            p.pointerType === "touch" && (c++, c === 2 && Date.now() - l < 300 && (this._touchSelectionMode = !this._touchSelectionMode, this._container?.classList.toggle("flow-touch-selection-mode", this._touchSelectionMode)), l = Date.now());
          }, h = (p) => {
            p.pointerType === "touch" && (c = Math.max(0, c - 1), c === 0 && (l = 0));
          }, u = this._container;
          if (!u) return;
          u.addEventListener("pointerdown", d), u.addEventListener("pointerup", h), u.addEventListener("pointercancel", h);
          const f = () => {
            document.hidden && (c = 0);
          };
          document.addEventListener("visibilitychange", f);
          const g = document.createElement("div");
          g.className = "flow-touch-selection-mode-indicator", g.textContent = "Selection Mode — tap with two fingers to exit", u.appendChild(g), this._touchSelectionCleanup = () => {
            u.removeEventListener("pointerdown", d), u.removeEventListener("pointerup", h), u.removeEventListener("pointercancel", h), document.removeEventListener("visibilitychange", f), g.remove();
          };
        }
        const a = [
          { event: "flow-node-context-menu", handler: ((l) => {
            Object.assign(this.contextMenu, { show: !0, type: "node", x: l.detail.event.clientX, y: l.detail.event.clientY, node: l.detail.node, edge: null, position: null, nodes: null, event: l.detail.event });
          }) },
          { event: "flow-edge-context-menu", handler: ((l) => {
            Object.assign(this.contextMenu, { show: !0, type: "edge", x: l.detail.event.clientX, y: l.detail.event.clientY, node: null, edge: l.detail.edge, position: null, nodes: null, event: l.detail.event });
          }) },
          { event: "flow-pane-context-menu", handler: ((l) => {
            Object.assign(this.contextMenu, { show: !0, type: "pane", x: l.detail.event.clientX, y: l.detail.event.clientY, node: null, edge: null, position: l.detail.position, nodes: null, event: l.detail.event });
          }) },
          { event: "flow-selection-context-menu", handler: ((l) => {
            Object.assign(this.contextMenu, { show: !0, type: "selection", x: l.detail.event.clientX, y: l.detail.event.clientY, node: null, edge: null, position: null, nodes: l.detail.nodes, event: l.detail.event });
          }) }
        ];
        for (const l of a)
          this._container.addEventListener(l.event, l.handler);
        this._contextMenuListeners = a;
      },
      /** Keyboard shortcut handler (delete, arrows, undo/redo, copy/paste/cut, selection tool toggle, escape). */
      _initKeyboard() {
        this._onKeyDown = (s) => {
          if (!this._active || this._animationLocked) return;
          const a = s.target.tagName, l = this._shortcuts;
          if (He(s.key, l.escape) && this.contextMenu.show) {
            this.closeContextMenu();
            return;
          }
          if (He(s.key, l.escape) && this.pendingConnection) {
            this._emit("connect-end", {
              connection: null,
              source: this.pendingConnection.source,
              sourceHandle: this.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Se(this._container);
            return;
          }
          if (He(s.key, l.delete)) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            this._deleteSelected();
          }
          if (He(s.key, this._shortcuts.selectionToolToggle) && !s.ctrlKey && !s.metaKey) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            this._selectionTool = this._selectionTool === "box" ? "lasso" : "box";
            return;
          }
          if (He(s.key, l.moveNodes)) {
            if (a === "INPUT" || a === "TEXTAREA" || this._config?.disableKeyboardA11y || this.selectedNodes.size === 0) return;
            s.preventDefault();
            const c = it(s, l.moveStepModifier) ? l.moveStep * l.moveStepMultiplier : l.moveStep;
            let d = 0, h = 0;
            switch (s.key) {
              case "ArrowUp":
                h = -c;
                break;
              case "ArrowDown":
                h = c;
                break;
              case "ArrowLeft":
                d = -c;
                break;
              case "ArrowRight":
                d = c;
                break;
              default: {
                const u = Array.isArray(l.moveNodes) ? l.moveNodes : [l.moveNodes], f = s.key.length === 1 ? s.key.toLowerCase() : s.key, g = u.findIndex((p) => (p.length === 1 ? p.toLowerCase() : p) === f);
                g === 0 ? h = -c : g === 1 ? h = c : g === 2 ? d = -c : g === 3 && (d = c);
              }
            }
            this._captureHistory();
            for (const u of this.selectedNodes) {
              const f = this.getNode(u);
              if (f && sr(f)) {
                f.position.x += d, f.position.y += h;
                const g = this._container ? Te.get(this._container) : void 0;
                g?.bridge && g.bridge.pushLocalNodeUpdate(f.id, { position: f.position });
              }
            }
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey && He(s.key, l.undo)) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            s.preventDefault(), this.undo();
          }
          if ((s.ctrlKey || s.metaKey) && s.shiftKey && He(s.key, l.redo)) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            s.preventDefault(), this.redo();
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            He(s.key, l.copy) ? (s.preventDefault(), this.copy()) : He(s.key, l.paste) ? (s.preventDefault(), this.paste()) : He(s.key, l.cut) && (s.preventDefault(), this.cut());
          }
        }, document.addEventListener("keydown", this._onKeyDown);
      },
      /** Create minimap if configured. */
      _initMinimap() {
        e.minimap && (this._minimap = mu(this._container, {
          getState: () => ({
            nodes: Yn(this.nodes, this._nodeMap, this._config.nodeOrigin),
            viewport: this.viewport,
            containerWidth: this._container?.clientWidth ?? 0,
            containerHeight: this._container?.clientHeight ?? 0
          }),
          setViewport: (s) => this._panZoom?.setViewport(s),
          config: e
        }), this._minimap.render(), this.$watch("nodes", () => this._minimap?.render()), this.$watch("viewport", () => this._minimap?.updateViewport()));
      },
      /** Create controls panel if configured. */
      _initControls() {
        if (e.controls) {
          const s = e.controlsContainer ? document.querySelector(e.controlsContainer) ?? this._container : this._container, a = s !== this._container;
          this._controls = xu(s, {
            position: e.controlsPosition ?? "bottom-left",
            orientation: e.controlsOrientation ?? "vertical",
            external: a,
            showZoom: e.controlsShowZoom ?? !0,
            showFitView: e.controlsShowFitView ?? !0,
            showInteractive: e.controlsShowInteractive ?? !0,
            showResetPanels: e.controlsShowResetPanels ?? !1,
            onZoomIn: () => this.zoomIn(),
            onZoomOut: () => this.zoomOut(),
            onFitView: () => this.fitView({ padding: To }),
            onToggleInteractive: () => this.toggleInteractive(),
            onResetPanels: () => this.resetPanels()
          }), this.$watch("isInteractive", (l) => {
            this._controls?.update({ isInteractive: l });
          });
        }
      },
      /** Selection box/lasso setup (pointerdown/pointermove/pointerup handlers). */
      _initSelection() {
        this._selectionBox = Eu(this._container), this._lasso = Cu(this._container), this._selectionTool = e.selectionTool ?? "box", this._onSelectionPointerDown = (s) => {
          if (!this._config.selectionOnDrag && !this._touchSelectionMode && !it(s, this._shortcuts.selectionBox))
            return;
          const a = s.target;
          if (a !== this._container && !a.classList.contains("flow-viewport"))
            return;
          s.stopPropagation(), s.preventDefault(), this._selectionShiftHeld = !0;
          const l = this._config.selectionMode ?? "partial", c = it(s, this._shortcuts.selectionModeToggle);
          if (this._selectionEffectiveMode = c ? l === "partial" ? "full" : "partial" : l, !this._container) return;
          const d = this._container.getBoundingClientRect(), h = s.clientX - d.left, u = s.clientY - d.top;
          this._selectionTool === "lasso" ? this._lasso.start(h, u, this._selectionEffectiveMode) : this._selectionBox.start(h, u, this._selectionEffectiveMode), s.target.setPointerCapture(s.pointerId);
        }, this._onSelectionPointerMove = (s) => {
          if (!(this._selectionTool === "lasso" ? this._lasso?.isActive() : this._selectionBox?.isActive()) || !this._container) return;
          const l = this._container.getBoundingClientRect(), c = s.clientX - l.left, d = s.clientY - l.top;
          this._selectionTool === "lasso" ? this._lasso.update(c, d) : this._selectionBox.update(c, d);
        }, this._onSelectionPointerUp = (s) => {
          if (!(this._selectionTool === "lasso" ? this._lasso?.isActive() : this._selectionBox?.isActive())) return;
          s.target.releasePointerCapture(s.pointerId), this._suppressNextCanvasClick = !0;
          const l = Yn(this.nodes, this._nodeMap, this._config.nodeOrigin);
          let c, d = [];
          if (this._selectionTool === "lasso") {
            const h = this._lasso.end(this.viewport);
            if (!h) return;
            const u = this._selectionEffectiveMode === "full" ? Lu(l, h) : ku(l, h), f = new Set(u.map((g) => g.id));
            if (c = this.nodes.filter((g) => f.has(g.id)), this._config.lassoSelectsEdges)
              for (const g of this.edges) {
                if (g.hidden) continue;
                const p = this._container?.querySelector(
                  `[data-flow-edge-id="${CSS.escape(g.id)}"] path`
                );
                if (!p) continue;
                const w = p.getTotalLength(), m = Math.max(10, Math.ceil(w / 20));
                let C = 0;
                for (let b = 0; b <= m; b++) {
                  const D = p.getPointAtLength(b / m * w);
                  Go(D.x, D.y, h) && C++;
                }
                (this._selectionEffectiveMode === "full" ? C === m + 1 : C > 0) && d.push(g.id);
              }
          } else {
            const h = this._selectionBox.end(this.viewport);
            if (!h) return;
            const u = this._selectionEffectiveMode === "full" ? eu(l, h, this._config.nodeOrigin) : Qd(l, h, this._config.nodeOrigin), f = new Set(u.map((g) => g.id));
            c = this.nodes.filter((g) => f.has(g.id));
          }
          this._selectionShiftHeld || this.deselectAll();
          for (const h of c) {
            if (!No(h) || h.hidden) continue;
            h.selected = !0, this.selectedNodes.add(h.id);
            const u = this._container?.querySelector(`[data-flow-node-id="${CSS.escape(h.id)}"]`);
            u && u.classList.add("flow-node-selected");
          }
          for (const h of d) {
            const u = this.getEdge(h);
            u && (u.selected = !0, this.selectedEdges.add(u.id));
          }
          (c.length > 0 || d.length > 0) && this._emitSelectionChange(), this._selectionShiftHeld = !1;
        }, this._container.addEventListener("pointerdown", this._onSelectionPointerDown), this._container.addEventListener("pointermove", this._onSelectionPointerMove), this._container.addEventListener("pointerup", this._onSelectionPointerUp);
      },
      /** Drop zone drag/drop handlers if onDrop configured. */
      _initDropZone() {
        e.onDrop && (this._onDropZoneDragOver = (s) => {
          s.preventDefault(), s.dataTransfer && (s.dataTransfer.dropEffect = "move");
        }, this._onDropZoneDrop = (s) => {
          s.preventDefault();
          const a = s.dataTransfer?.getData("application/alpineflow");
          if (!a || !e.onDrop) return;
          let l;
          try {
            l = JSON.parse(a);
          } catch {
            l = a;
          }
          if (!this._container) return;
          const c = Ws(
            s.clientX,
            s.clientY,
            this.viewport,
            this._container.getBoundingClientRect()
          ), h = document.elementFromPoint(s.clientX, s.clientY)?.closest("[x-flow-node]"), u = h?.dataset.flowNodeId ? this.getNode(h.dataset.flowNodeId) ?? null : null, f = e.onDrop({ data: l, position: c, targetNode: u });
          f && this.addNodes(f, { center: !0 });
        }, this._container.addEventListener("dragover", this._onDropZoneDragOver), this._container.addEventListener("drop", this._onDropZoneDrop));
      },
      /** Run initial child layouts for all layout parents. */
      _initChildLayout() {
        if (this.$wire) {
          const s = this.$wire;
          e.wireEvents && uf(e, s, e.wireEvents);
          const a = ff(this, s), l = cf(this, s);
          this._wireCleanup = () => {
            a(), l();
          }, B("init", `wire bridge activated for "${this._id}"`);
        }
        B("init", `flowCanvas "${this._id}" ready`), this._emit("init"), this._recomputeChildValidation();
        for (const s of this.nodes)
          s.childLayout && !s.parentId && this.layoutChildren(s.id);
        for (const s of this.nodes)
          s.childLayout && s.parentId && (this._nodeMap.get(s.parentId)?.childLayout || this.layoutChildren(s.id));
        e.fitViewOnInit && requestAnimationFrame(() => {
          this.fitView();
        });
      },
      /** Validate auto-layout dependency and start initial layout. */
      _initAutoLayout() {
        if (e.autoLayout) {
          const s = e.autoLayout.algorithm, a = {
            dagre: "layout:dagre",
            force: "layout:force",
            hierarchy: "layout:hierarchy",
            elk: "layout:elk"
          }, l = {
            dagre: "AlpineFlowDagre",
            force: "AlpineFlowForce",
            hierarchy: "AlpineFlowHierarchy",
            elk: "AlpineFlowElk"
          }, c = a[s];
          c && Et(c) ? (this._autoLayoutReady = !0, this.$nextTick(() => this._runAutoLayout())) : c && this._warn("AUTO_LAYOUT_MISSING_DEP", `autoLayout requires the ${s} plugin. Register it with: Alpine.plugin(${l[s]})`);
        }
      },
      /** requestAnimationFrame ready flip, loading watch, loading overlay injection. */
      _initReady() {
        const s = e.fitViewOnInit ? 2 : 1;
        let a = 0;
        const l = () => {
          if (a++, a < s) {
            requestAnimationFrame(l);
            return;
          }
          this.$nextTick(() => {
            this.ready = !0;
          });
        };
        if (requestAnimationFrame(l), this.$watch("isLoading", (c) => {
          this._container && (this._container.classList.toggle("flow-loading", c), this._container.classList.toggle("flow-ready", !c), !c && this._autoLoadingOverlay && (this._autoLoadingOverlay.remove(), this._autoLoadingOverlay = null));
        }), this._container && this._container.classList.add("flow-loading"), e.loading && this._container && !this._container.querySelector("[data-flow-loading-directive]")) {
          const c = document.createElement("div");
          c.className = "flow-loading-overlay";
          const d = document.createElement("div");
          d.className = "flow-loading-indicator";
          const h = document.createElement("div");
          h.className = "flow-loading-indicator-node";
          const u = document.createElement("div");
          u.className = "flow-loading-indicator-text", u.textContent = this._loadingText, d.appendChild(h), d.appendChild(u), c.appendChild(d), this._container.appendChild(c), this._autoLoadingOverlay = c;
        }
      },
      // ── Lifecycle ─────────────────────────────────────────────────────
      init() {
        o = this, this._initDebug(), this._initContainer(), this._initColorMode(), this._initHydration(), this._initHistory(), this._initAnnouncer(), this._initCollab(), this._initPanZoom(), this._initClickHandlers(), this._initKeyboard(), this._initMinimap(), this._initControls(), this._initSelection(), this._initChildLayout(), this._initDropZone(), this._initAutoLayout(), this._initReady();
      },
      _setupMarkerDefs() {
        const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        s.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;";
        const a = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        s.appendChild(a), this._container?.appendChild(s), this._markerDefsEl = s, this._updateMarkerDefs(), this.$watch("edges", () => {
          this._updateMarkerDefs();
        });
      },
      _updateMarkerDefs() {
        if (!this._markerDefsEl) return;
        const s = this._markerDefsEl.querySelector("defs"), a = /* @__PURE__ */ new Map();
        for (const d of this.edges)
          for (const h of [d.markerStart, d.markerEnd]) {
            if (!h) continue;
            const u = on(h), f = sn(u, this._id);
            a.has(f) || a.set(f, Vn(u, f));
          }
        const l = s.querySelectorAll("marker"), c = /* @__PURE__ */ new Set();
        l.forEach((d) => {
          a.has(d.id) ? c.add(d.id) : d.remove();
        });
        for (const [d, h] of a)
          if (!c.has(d)) {
            const f = new DOMParser().parseFromString(
              `<svg xmlns="http://www.w3.org/2000/svg">${h}</svg>`,
              "image/svg+xml"
            ).querySelector("marker");
            f && s.appendChild(document.importNode(f, !0));
          }
      },
      destroy() {
        if (this._wireCleanup?.(), this._wireCleanup = null, this._longPressCleanup?.(), this._longPressCleanup = null, this._touchSelectionCleanup?.(), this._touchSelectionCleanup = null, this._emit("destroy"), B("destroy", `flowCanvas "${this._id}" destroying`), this._onCanvasClick && this._container && this._container.removeEventListener("click", this._onCanvasClick), this._onCanvasContextMenu && this._container && this._container.removeEventListener("contextmenu", this._onCanvasContextMenu), this._container)
          for (const s of this._contextMenuListeners)
            this._container.removeEventListener(s.event, s.handler);
        this._contextMenuListeners = [], this._onKeyDown && document.removeEventListener("keydown", this._onKeyDown), this._onContainerPointerDown && this._container && this._container.removeEventListener("pointerdown", this._onContainerPointerDown), this._markerDefsEl?.remove(), this._markerDefsEl = null, this._minimap?.destroy(), this._minimap = null, this._controls?.destroy(), this._controls = null, this._onSelectionPointerDown && this._container && this._container.removeEventListener("pointerdown", this._onSelectionPointerDown), this._onSelectionPointerMove && this._container && this._container.removeEventListener("pointermove", this._onSelectionPointerMove), this._onSelectionPointerUp && this._container && this._container.removeEventListener("pointerup", this._onSelectionPointerUp), this._selectionBox?.destroy(), this._selectionBox = null, this._lasso?.destroy(), this._lasso = null, this._viewportEl = null, this._container && (this._container.removeEventListener("dragover", this._onDropZoneDragOver), this._container.removeEventListener("drop", this._onDropZoneDrop)), this._followHandle?.stop(), this._followHandle = null;
        for (const s of this._activeTimelines)
          s.stop();
        if (this._activeTimelines.clear(), this._animator && (t.raw(this._animator).stopAll(), this._animator = null), this._layoutAnimFrame && (cancelAnimationFrame(this._layoutAnimFrame), this._layoutAnimFrame = 0), this._autoLayoutTimer && (clearTimeout(this._autoLayoutTimer), this._autoLayoutTimer = null), this._colorModeHandle && (this._colorModeHandle.destroy(), this._colorModeHandle = null), this._container) {
          const s = Te.get(this._container);
          s && (s.bridge.destroy(), s.awareness.destroy(), s.cursorCleanup && s.cursorCleanup(), Te.delete(this._container));
        }
        e.collab && e.collab.provider.destroy(), this._container && this._container.removeAttribute("data-flow-canvas"), this.$store.flow.unregister(this._id), this._panZoom?.destroy(), this._panZoom = null, this._announcer?.destroy(), this._announcer = null, this._computeDebounceTimer && (clearTimeout(this._computeDebounceTimer), this._computeDebounceTimer = null);
      },
      // ── Remaining Flat Methods ────────────────────────────────────────
      /**
       * Set a node's rotation angle in degrees.
       */
      rotateNode(s, a) {
        const l = this.nodes.find((c) => c.id === s);
        l && (this._captureHistory(), l.rotation = a);
      },
      /** Set the user-controlled loading state. */
      setLoading(s) {
        this._userLoading = s;
      },
      /** Update runtime config options. */
      patchConfig(s) {
        this._applyConfigPatch(s);
      },
      // ── Context Menu ──────────────────────────────────────────────────
      closeContextMenu() {
        this.contextMenu.show = !1, this.contextMenu.type = null, this.contextMenu.node = null, this.contextMenu.edge = null, this.contextMenu.position = null, this.contextMenu.nodes = null, this.contextMenu.event = null;
      },
      get collab() {
        return this._container ? Te.get(this._container)?.awareness : void 0;
      },
      async toImage(s) {
        let a;
        try {
          ({ captureFlowImage: a } = await Promise.resolve().then(() => lp));
        } catch {
          throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
        }
        return a(
          this._container,
          this._viewportEl,
          this.nodes,
          this.viewport,
          s
        );
      }
    };
    let o = n;
    const i = new Proxy(/* @__PURE__ */ Object.create(null), {
      get(s, a) {
        return o[a];
      },
      set(s, a, l) {
        return o[a] = l, !0;
      }
    }), r = [
      mf(i),
      yf(i),
      wf(i),
      xf(i),
      Ef(i),
      Gf(i),
      eh(i),
      th(i),
      nh(i),
      uh(i),
      fh(i),
      hh(i),
      Hh(i, t),
      Fh(i)
    ];
    for (const s of r)
      Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
    return n.registerMarker = (s, a) => {
      gu(s, a);
    }, n;
  });
}
function ss(t, e) {
  return {
    x: e[0] * Math.round(t.x / e[0]),
    y: e[1] * Math.round(t.y / e[1])
  };
}
function Bh(t, e, n) {
  const { onDragStart: o, onDrag: i, onDragEnd: r, getViewport: s, getNodePosition: a, snapToGrid: l = !1, filterSelector: c, container: d, isLocked: h, noDragClassName: u, dragThreshold: f = 0 } = n;
  let g = { x: 0, y: 0 };
  function p(C) {
    const S = s();
    return {
      x: (C.x - S.x) / S.zoom,
      y: (C.y - S.y) / S.zoom
    };
  }
  const w = Ie(t), m = Tl().subject(() => {
    const C = s(), S = a();
    return {
      x: S.x * C.zoom + C.x,
      y: S.y * C.zoom + C.y
    };
  }).on("start", (C) => {
    g = p(C), o?.({ nodeId: e, position: g, sourceEvent: C.sourceEvent });
  }).on("drag", (C) => {
    let S = p(C);
    l && (S = ss(S, l));
    const b = {
      x: S.x - g.x,
      y: S.y - g.y
    };
    i?.({ nodeId: e, position: S, delta: b, sourceEvent: C.sourceEvent });
  }).on("end", (C) => {
    let S = p(C);
    l && (S = ss(S, l)), r?.({ nodeId: e, position: S, sourceEvent: C.sourceEvent });
  });
  return d && m.container(() => d), f > 0 && m.clickDistance(f), m.filter((C) => {
    if (h?.() || u && C.target?.closest?.("." + u)) return !1;
    if (c) {
      const S = t.querySelector(c);
      return S ? S.contains(C.target) : !0;
    }
    return !0;
  }), w.call(m), {
    destroy() {
      w.on(".drag", null);
    }
  };
}
function Xh(t, e) {
  const n = Rt(t, e);
  return {
    id: t.id,
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? ye,
    height: t.dimensions?.height ?? we
  };
}
function Yh(t, e, n) {
  const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  let r = 0, s = 0, a = 1 / 0, l = 1 / 0;
  const c = t.x + t.width / 2, d = t.y + t.height / 2, h = t.x + t.width, u = t.y + t.height;
  for (const f of e) {
    const g = f.x + f.width / 2, p = f.y + f.height / 2, w = f.x + f.width, m = f.y + f.height, C = [
      [t.x, f.x],
      // left-left
      [h, w],
      // right-right
      [c, g],
      // center-center
      [t.x, w],
      // left-right
      [h, f.x]
      // right-left
    ];
    for (const [b, D] of C) {
      const M = D - b;
      Math.abs(M) <= n && (i.add(D), Math.abs(M) < Math.abs(a) && (a = M, r = M));
    }
    const S = [
      [t.y, f.y],
      // top-top
      [u, m],
      // bottom-bottom
      [d, p],
      // center-center
      [t.y, m],
      // top-bottom
      [u, f.y]
      // bottom-top
    ];
    for (const [b, D] of S) {
      const M = D - b;
      Math.abs(M) <= n && (o.add(D), Math.abs(M) < Math.abs(l) && (l = M, s = M));
    }
  }
  return {
    horizontal: [...o],
    vertical: [...i],
    snapOffset: { x: r, y: s }
  };
}
function qh(t, e, n, o) {
  return Math.abs(t.x - e.x) > 30 ? t.x < e.x ? { source: n, target: o } : { source: o, target: n } : t.y < e.y ? { source: n, target: o } : { source: o, target: n };
}
function Wh(t, e, n, o) {
  let i = null, r = o;
  for (const s of n) {
    if (s.id === t) continue;
    const a = Math.sqrt(
      (e.x - s.center.x) ** 2 + (e.y - s.center.y) ** 2
    );
    if (a < r) {
      r = a;
      const { source: l, target: c } = qh(e, s.center, t, s.id);
      i = { source: l, target: c, targetId: s.id, distance: a, targetCenter: s.center };
    }
  }
  return i;
}
const jh = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
let Uh = 0, Zh = 0;
function Kh(t, e) {
  switch (e) {
    case "alt":
      return t.altKey;
    case "meta":
      return t.metaKey;
    case "shift":
      return t.shiftKey;
  }
}
function Gh(t, e, n) {
  const o = t.querySelectorAll('[data-flow-handle-type="source"]');
  if (o.length === 0) return null;
  let i = null, r = 1 / 0;
  return o.forEach((s) => {
    const a = s, l = a.getBoundingClientRect();
    if (l.width === 0 && l.height === 0) return;
    const c = l.left + l.width / 2, d = l.top + l.height / 2, h = Math.sqrt((e - c) ** 2 + (n - d) ** 2);
    h < r && (r = h, i = a);
  }), i;
}
function Jh(t, e, n) {
  let o = 1 / 0, i = -1 / 0, r = 1 / 0, s = -1 / 0;
  for (const c of n)
    o = Math.min(o, c.x), i = Math.max(i, c.x + c.width), r = Math.min(r, c.y), s = Math.max(s, c.y + c.height);
  const a = 50, l = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  l.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:500;";
  for (const c of t) {
    const d = document.createElementNS("http://www.w3.org/2000/svg", "line");
    d.setAttribute("x1", String(o - a)), d.setAttribute("y1", String(c)), d.setAttribute("x2", String(i + a)), d.setAttribute("y2", String(c)), d.classList.add("flow-guide-path"), l.appendChild(d);
  }
  for (const c of e) {
    const d = document.createElementNS("http://www.w3.org/2000/svg", "line");
    d.setAttribute("x1", String(c)), d.setAttribute("y1", String(r - a)), d.setAttribute("x2", String(c)), d.setAttribute("y2", String(s + a)), d.classList.add("flow-guide-path"), l.appendChild(d);
  }
  return l;
}
function Qh(t) {
  t.directive(
    "flow-node",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = null, a = !1, l = !1, c = null, d = null, h = null, u = null, f = null, g = null, p = !1, w = -1, m = null, C = !1, S = [], b = "", D = [], M = null;
      i(() => {
        const x = o(n);
        if (!x) return;
        if (e.dataset.flowNodeId = x.id, !C) {
          const R = t.$data(e.closest("[x-data]"));
          let Q = !1;
          if (R?._config?.nodeTypes) {
            const X = x.type ?? "default", W = R._config.nodeTypes[X] ?? R._config.nodeTypes.default;
            if (typeof W == "string") {
              const I = document.querySelector(W);
              I?.content && (e.appendChild(I.content.cloneNode(!0)), Q = !0);
            } else typeof W == "function" && (W(x, e), Q = !0);
          }
          if (!Q && e.children.length === 0) {
            const X = document.createElement("div");
            X.setAttribute("x-flow-handle:target", "");
            const W = document.createElement("span");
            W.setAttribute("x-text", "node.data.label");
            const I = document.createElement("div");
            I.setAttribute("x-flow-handle:source", ""), e.appendChild(X), e.appendChild(W), e.appendChild(I), Q = !0;
          }
          if (Q)
            for (const X of Array.from(e.children))
              t.addScopeToNode(X, { node: x }), t.initTree(X);
          C = !0;
        }
        if (x.hidden) {
          e.classList.add("flow-node-hidden"), e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-hidden"), M !== x.id && (s?.destroy(), s = null, M = x.id);
        const y = t.$data(e.closest("[x-data]"));
        if (!y?.viewport) return;
        e.classList.add("flow-node", "nopan"), x.type === "group" ? e.classList.add("flow-node-group") : e.classList.remove("flow-node-group");
        const q = x.parentId ? y.getAbsolutePosition(x.id) : x.position ?? { x: 0, y: 0 }, _ = x.nodeOrigin ?? y._config?.nodeOrigin ?? [0, 0], L = x.dimensions?.width ?? 150, A = x.dimensions?.height ?? 40;
        e.style.left = q.x - L * _[0] + "px", e.style.top = q.y - A * _[1] + "px", x.dimensions && (e.style.width = x.dimensions.width + "px", e.style.height = x.dimensions.height + "px"), y.selectedNodes.has(x.id) ? e.classList.add("flow-node-selected") : e.classList.remove("flow-node-selected"), e.setAttribute("aria-selected", String(!!x.selected)), x._validationErrors && x._validationErrors.length > 0 ? e.classList.add("flow-node-invalid") : e.classList.remove("flow-node-invalid");
        for (const R of S)
          e.classList.remove(R);
        const O = x.class ? x.class.split(/\s+/).filter(Boolean) : [];
        for (const R of O)
          e.classList.add(R);
        S = O;
        const E = x.shape ? `flow-node-${x.shape}` : "";
        b !== E && (b && e.classList.remove(b), E && e.classList.add(E), b = E);
        const k = t.$data(e.closest("[data-flow-canvas]")), N = x.shape && k?._shapeRegistry?.[x.shape];
        if (N?.clipPath ? e.style.clipPath = N.clipPath : e.style.clipPath = "", x.style) {
          const R = typeof x.style == "string" ? Object.fromEntries(x.style.split(";").filter(Boolean).map((X) => X.split(":").map((W) => W.trim()))) : x.style, Q = [];
          for (const [X, W] of Object.entries(R))
            X && W && (e.style.setProperty(X, W), Q.push(X));
          for (const X of D)
            Q.includes(X) || e.style.removeProperty(X);
          D = Q;
        } else if (D.length > 0) {
          for (const R of D)
            e.style.removeProperty(R);
          D = [];
        }
        if (x.rotation ? (e.style.transform = `rotate(${x.rotation}deg)`, e.style.transformOrigin = "center") : e.style.transform = "", x.focusable ?? y._config?.nodesFocusable !== !1 ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", x.ariaRole ?? "group"), e.setAttribute("aria-label", x.ariaLabel ?? (x.data?.label ? `Node: ${x.data.label}` : `Node ${x.id}`))) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label")), x.domAttributes)
          for (const [R, Q] of Object.entries(x.domAttributes))
            R.startsWith("on") || jh.has(R.toLowerCase()) || e.setAttribute(R, Q);
        nt(x) ? e.classList.remove("flow-node-no-connect") : e.classList.add("flow-node-no-connect"), x.collapsed ? e.classList.add("flow-node-collapsed") : e.classList.remove("flow-node-collapsed");
        const J = e.classList.contains("flow-node-condensed");
        x.condensed ? e.classList.add("flow-node-condensed") : e.classList.remove("flow-node-condensed"), !!x.condensed !== J && requestAnimationFrame(() => {
          x.dimensions = {
            width: e.offsetWidth,
            height: e.offsetHeight
          }, B("condense", `Node "${x.id}" re-measured after condense toggle`, x.dimensions);
        }), x.filtered ? e.classList.add("flow-node-filtered") : e.classList.remove("flow-node-filtered");
        const oe = x.handles ?? "visible";
        e.classList.remove("flow-handles-hidden", "flow-handles-hover", "flow-handles-select"), oe !== "visible" && e.classList.add(`flow-handles-${oe}`);
        let G = cr(x, y._nodeMap);
        y._config?.elevateNodesOnSelect !== !1 && y.selectedNodes.has(x.id) && (G += x.type === "group" ? Math.max(1 - G, 0) : 1e3), p && (G += 1e3);
        const le = x.type === "group" ? 0 : 2;
        if (G !== le ? e.style.zIndex = String(G) : e.style.removeProperty("z-index"), !sr(x)) {
          e.classList.add("flow-node-locked"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-locked"), e.querySelector("[data-flow-drag-handle]") ? e.classList.add("flow-node-has-handle") : e.classList.remove("flow-node-has-handle");
        const te = e.closest(".flow-container");
        s || (s = Bh(e, x.id, {
          container: te ?? void 0,
          filterSelector: "[data-flow-drag-handle]",
          isLocked: () => y._animationLocked,
          noDragClassName: y._config?.noDragClassName ?? "nodrag",
          dragThreshold: y._config?.nodeDragThreshold ?? 0,
          getViewport: () => y.viewport,
          getNodePosition: () => {
            const R = y.getNode(x.id);
            return R ? R.parentId ? y.getAbsolutePosition(R.id) : { x: R.position.x, y: R.position.y } : { x: 0, y: 0 };
          },
          snapToGrid: y._config?.snapToGrid ?? !1,
          onDragStart({ nodeId: R, position: Q, sourceEvent: X }) {
            a = !1, l = !1, c = null;
            const W = y._container ? Te.get(y._container) : void 0;
            W?.bridge && W.bridge.setDragging(R, !0), u?.destroy(), u = null, f = null, g && te && te.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null, y._captureHistory?.(), B("drag", `Node "${R}" drag start`, Q);
            const I = y.getNode(R);
            if (I && (y._config?.selectNodesOnDrag !== !1 && I.selectable !== !1 && !y.selectedNodes.has(R) && (it(X, y._shortcuts?.multiSelect) || y.deselectAll(), y.selectedNodes.add(R), I.selected = !0, y._emitSelectionChange(), l = !0), y._emit("node-drag-start", { node: I }), y.selectedNodes.has(R) && y.selectedNodes.size > 1)) {
              const j = st(R, y.nodes);
              c = /* @__PURE__ */ new Map();
              for (const ee of y.selectedNodes) {
                if (ee === R || j.has(ee))
                  continue;
                const V = y.getNode(ee);
                V && V.draggable !== !1 && c.set(ee, { x: V.position.x, y: V.position.y });
              }
            }
            y._config?.autoPanOnNodeDrag !== !1 && te && (d = ar({
              container: te,
              speed: y._config?.autoPanSpeed ?? 15,
              onPan(j, ee) {
                const V = y.viewport?.zoom || 1, K = { x: y.viewport.x, y: y.viewport.y };
                y._panZoom?.setViewport({
                  x: y.viewport.x - j,
                  y: y.viewport.y - ee,
                  zoom: V
                });
                const ie = K.x - y.viewport.x, F = K.y - y.viewport.y, Z = ie === 0 && F === 0, Y = y.getNode(R);
                let ne = !1;
                if (Y) {
                  const H = Y.position.x, z = Y.position.y;
                  Y.position.x += ie / V, Y.position.y += F / V;
                  const ae = bn(Y.position, Y, y._config?.nodeExtent);
                  Y.position.x = ae.x, Y.position.y = ae.y, ne = Y.position.x === H && Y.position.y === z;
                }
                if (c)
                  for (const [H] of c) {
                    const z = y.getNode(H);
                    if (z) {
                      z.position.x += ie / V, z.position.y += F / V;
                      const ae = bn(z.position, z, y._config?.nodeExtent);
                      z.position.x = ae.x, z.position.y = ae.y;
                    }
                  }
                return Z && ne;
              }
            }), X instanceof MouseEvent && d.updatePointer(X.clientX, X.clientY), d.start());
          },
          onDrag({ nodeId: R, position: Q, delta: X, sourceEvent: W }) {
            a = !0;
            const I = y.getNode(R);
            if (I) {
              if (I.parentId) {
                const V = y.getAbsolutePosition(I.parentId);
                let K = Q.x - V.x, ie = Q.y - V.y;
                const F = I.dimensions ?? { width: 150, height: 50 }, Z = y.getNode(I.parentId);
                if (Z?.childLayout) {
                  p || (e.classList.add("flow-reorder-dragging"), m = I.parentId), p = !0;
                  const Y = I.extent !== "parent";
                  if (I.position.x = Q.x - V.x, I.position.y = Q.y - V.y, !Y && Z.dimensions) {
                    const z = lo({ x: I.position.x, y: I.position.y }, F, Z.dimensions);
                    I.position.x = z.x, I.position.y = z.y;
                  }
                  const ne = I.dimensions?.width ?? 150, H = I.dimensions?.height ?? 50;
                  if (Y) {
                    const z = Z.dimensions?.width ?? 150, ae = Z.dimensions?.height ?? 50, re = I.position.x + ne / 2, fe = I.position.y + H / 2, pe = 12, he = m === I.parentId ? 0 : pe, xe = re >= he && re <= z - he && fe >= he && fe <= ae - he, be = /* @__PURE__ */ new Set();
                    let de = I.parentId;
                    for (; de; )
                      be.add(de), de = y.getNode(de)?.parentId;
                    const me = Q.x + ne / 2, Le = Q.y + H / 2, _e = st(I.id, y.nodes);
                    let Ne = null;
                    const Ce = y.nodes.filter(
                      (ue) => ue.id !== I.id && (ue.droppable || ue.childLayout) && !ue.hidden && !_e.has(ue.id) && (xe ? !be.has(ue.id) : ue.id !== I.parentId) && (!ue.acceptsDrop || ue.acceptsDrop(I))
                    );
                    for (const ue of Ce) {
                      const ve = ue.parentId ? y.getAbsolutePosition(ue.id) : ue.position, Ge = ue.dimensions?.width ?? 150, dt = ue.dimensions?.height ?? 50, Je = ue.id === g ? 0 : pe;
                      me >= ve.x + Je && me <= ve.x + Ge - Je && Le >= ve.y + Je && Le <= ve.y + dt - Je && (Ne = ue);
                    }
                    const ge = Ne?.id ?? null;
                    if (ge !== g) {
                      g && te && te.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), ge && te && te.querySelector(`[data-flow-node-id="${CSS.escape(ge)}"]`)?.classList.add("flow-node-drop-target"), g = ge;
                      const ue = ge ? y.getNode(ge) : null, ve = m;
                      if (ue?.childLayout && ge !== m) {
                        ve && (y.layoutChildren(ve, { omitFromComputation: R, shallow: !0 }), y.propagateLayoutUp(ve, { omitFromComputation: R })), m = ge;
                        const Ge = y.nodes.filter((Be) => Be.parentId === ge && Be.id !== R).sort((Be, Vr) => (Be.order ?? 1 / 0) - (Vr.order ?? 1 / 0)), dt = Ge.length, Je = [...Ge];
                        Je.splice(dt, 0, I);
                        for (let Be = 0; Be < Je.length; Be++)
                          Je[Be].order = Be;
                        w = dt;
                        const li = y._initialDimensions?.get(R), ci = { ...I, dimensions: li ? { ...li } : void 0 };
                        y.layoutChildren(ge, { excludeId: R, includeNode: ci, shallow: !0 }), y.propagateLayoutUp(ge, { includeNode: ci });
                      } else xe && m !== I.parentId ? (ve && ve !== I.parentId && (y.layoutChildren(ve, { omitFromComputation: R, shallow: !0 }), y.propagateLayoutUp(ve, { omitFromComputation: R })), m = I.parentId, w = -1) : !ge && !xe && (ve && (y.layoutChildren(ve, { omitFromComputation: R, shallow: !0 }), y.propagateLayoutUp(ve, { omitFromComputation: R })), m = null, w = -1);
                    }
                  }
                  if (m) {
                    const z = y.getNode(m), ae = z?.childLayout ?? Z.childLayout, re = y.nodes.filter((de) => de.parentId === m && de.id !== R).sort((de, me) => (de.order ?? 1 / 0) - (me.order ?? 1 / 0));
                    let fe, pe;
                    if (m !== I.parentId) {
                      const de = z?.parentId ? y.getAbsolutePosition(m) : z?.position ?? { x: 0, y: 0 };
                      fe = Q.x - de.x, pe = Q.y - de.y;
                    } else
                      fe = I.position.x, pe = I.position.y;
                    const he = ae.swapThreshold ?? 0.5;
                    if (w === -1)
                      if (m === I.parentId) {
                        const de = I.order ?? 0;
                        w = re.filter((me) => (me.order ?? 0) < de).length;
                      } else
                        w = re.length;
                    const xe = w;
                    let be = re.length;
                    for (let de = 0; de < re.length; de++) {
                      const me = re[de], Le = me.dimensions?.width ?? 150, _e = me.dimensions?.height ?? 50, Ne = de < xe ? 1 - he : he, Ce = me.position.y + _e * Ne, ge = me.position.x + Le * Ne;
                      if (ae.direction === "grid") {
                        const ue = {
                          x: fe + ne / 2,
                          y: pe + H / 2
                        }, ve = me.position.y + _e / 2;
                        if (ue.y < me.position.y) {
                          be = de;
                          break;
                        }
                        if (Math.abs(ue.y - ve) < _e / 2 && ue.x < ge) {
                          be = de;
                          break;
                        }
                      } else if (ae.direction === "vertical") {
                        if ((de < xe ? pe : pe + H) < Ce) {
                          be = de;
                          break;
                        }
                      } else if ((de < xe ? fe : fe + ne) < ge) {
                        be = de;
                        break;
                      }
                    }
                    if (be !== w) {
                      w = be;
                      const de = [...re];
                      de.splice(be, 0, I);
                      for (let Ce = 0; Ce < de.length; Ce++)
                        de[Ce].order = Ce;
                      e.closest(".flow-container")?.classList.add("flow-layout-animating"), y._layoutAnimFrame && cancelAnimationFrame(y._layoutAnimFrame);
                      const Le = I.id, _e = m, Ne = _e !== I.parentId;
                      y._layoutAnimFrame = requestAnimationFrame(() => {
                        if (Ne && _e) {
                          const ve = y.getNode(Le);
                          let Ge;
                          if (ve) {
                            const dt = y._initialDimensions?.get(Le);
                            Ge = { ...ve, dimensions: dt ? { ...dt } : void 0 };
                          }
                          y.layoutChildren(_e, {
                            excludeId: Le,
                            includeNode: Ge,
                            shallow: !0
                          }), y.propagateLayoutUp(_e, {
                            includeNode: Ge
                          });
                        } else
                          y.layoutChildren(_e, Le, !0);
                        const Ce = performance.now(), ge = 300, ue = () => {
                          y._layoutAnimTick++, performance.now() - Ce < ge ? y._layoutAnimFrame = requestAnimationFrame(ue) : y._layoutAnimFrame = 0;
                        };
                        y._layoutAnimFrame = requestAnimationFrame(ue);
                      });
                    }
                  }
                  d && W instanceof MouseEvent && d.updatePointer(W.clientX, W.clientY);
                  return;
                }
                if (I.extent === "parent" && Z?.dimensions) {
                  const Y = lo(
                    { x: K, y: ie },
                    F,
                    Z.dimensions
                  );
                  K = Y.x, ie = Y.y;
                } else if (Array.isArray(I.extent)) {
                  const Y = dr({ x: K, y: ie }, I.extent, F);
                  K = Y.x, ie = Y.y;
                }
                if ((!I.extent || I.extent !== "parent") && (Zt(
                  Z,
                  y._config?.childValidationRules ?? {}
                )?.preventChildEscape || !!Z?.childLayout) && Z?.dimensions) {
                  const H = lo(
                    { x: K, y: ie },
                    F,
                    Z.dimensions
                  );
                  K = H.x, ie = H.y;
                }
                if (I.expandParent && Z?.dimensions) {
                  const Y = qu(
                    { x: K, y: ie },
                    F,
                    Z.dimensions
                  );
                  Y && (Z.dimensions.width = Y.width, Z.dimensions.height = Y.height);
                }
                I.position.x = K, I.position.y = ie;
              } else {
                const V = bn(Q, I, y._config?.nodeExtent);
                I.position.x = V.x, I.position.y = V.y;
              }
              if (y._config?.snapToGrid) {
                const V = I.nodeOrigin ?? y._config?.nodeOrigin ?? [0, 0], K = I.dimensions?.width ?? 150, ie = I.dimensions?.height ?? 40, F = I.parentId ? y.getAbsolutePosition(I.id) : I.position;
                e.style.left = F.x - K * V[0] + "px", e.style.top = F.y - ie * V[1] + "px", y._layoutAnimTick++;
              }
              if (y._emit("node-drag", { node: I, position: Q }), c)
                for (const [V, K] of c) {
                  const ie = y.getNode(V);
                  if (ie) {
                    let F = K.x + X.x, Z = K.y + X.y;
                    const Y = bn({ x: F, y: Z }, ie, y._config?.nodeExtent);
                    ie.position.x = Y.x, ie.position.y = Y.y;
                  }
                }
              const ee = y._config?.helperLines;
              if (ee) {
                const V = typeof ee == "object" ? ee.snap ?? !0 : !0, K = typeof ee == "object" ? ee.threshold ?? 5 : 5, ie = (z) => {
                  const ae = z.parentId ? y.getAbsolutePosition(z.id) : z.position;
                  return Xh({ ...z, position: ae }, y._config?.nodeOrigin);
                }, Z = (y.selectedNodes.size > 1 && y.selectedNodes.has(R) ? y.nodes.filter((z) => y.selectedNodes.has(z.id)) : [I]).map(ie), Y = {
                  x: Math.min(...Z.map((z) => z.x)),
                  y: Math.min(...Z.map((z) => z.y)),
                  width: Math.max(...Z.map((z) => z.x + z.width)) - Math.min(...Z.map((z) => z.x)),
                  height: Math.max(...Z.map((z) => z.y + z.height)) - Math.min(...Z.map((z) => z.y))
                }, ne = y.nodes.filter(
                  (z) => !y.selectedNodes.has(z.id) && z.id !== R && z.hidden !== !0 && z.filtered !== !0
                ).map(ie), H = Yh(Y, ne, K);
                if (V && (H.snapOffset.x !== 0 || H.snapOffset.y !== 0) && (I.position.x += H.snapOffset.x, I.position.y += H.snapOffset.y, c))
                  for (const [z] of c) {
                    const ae = y.getNode(z);
                    ae && (ae.position.x += H.snapOffset.x, ae.position.y += H.snapOffset.y);
                  }
                if (h?.remove(), H.horizontal.length > 0 || H.vertical.length > 0) {
                  const z = te?.querySelector(".flow-viewport");
                  if (z) {
                    const ae = y.nodes.map(ie);
                    h = Jh(H.horizontal, H.vertical, ae), z.appendChild(h);
                  }
                } else
                  h = null;
                y._emit("helper-lines-change", {
                  horizontal: H.horizontal,
                  vertical: H.vertical
                });
              }
            }
            if (y._config?.preventOverlap) {
              const ee = typeof y._config.preventOverlap == "number" ? y._config.preventOverlap : 5, V = I.dimensions?.width ?? ye, K = I.dimensions?.height ?? we, ie = y.selectedNodes, F = y.nodes.filter((Y) => Y.id !== I.id && !Y.hidden && !ie.has(Y.id)).map((Y) => It(Y, y._config?.nodeOrigin)), Z = pf(I.position, V, K, F, ee);
              I.position.x = Z.x, I.position.y = Z.y;
            }
            if (!I.parentId) {
              const ee = st(I.id, y.nodes), V = y.nodes.filter(
                (Y) => Y.id !== I.id && Y.droppable && !Y.hidden && !ee.has(Y.id) && (!Y.acceptsDrop || Y.acceptsDrop(I))
              ), K = It(I, y._config?.nodeOrigin);
              let ie = null;
              const F = 12;
              for (const Y of V) {
                const ne = Y.parentId ? y.getAbsolutePosition(Y.id) : Y.position, H = Y.dimensions?.width ?? ye, z = Y.dimensions?.height ?? we, ae = K.x + K.width / 2, re = K.y + K.height / 2, fe = Y.id === g ? 0 : F;
                ae >= ne.x + fe && ae <= ne.x + H - fe && re >= ne.y + fe && re <= ne.y + z - fe && (ie = Y);
              }
              const Z = ie?.id ?? null;
              Z !== g && (g && te && te.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), Z && te && te.querySelector(`[data-flow-node-id="${CSS.escape(Z)}"]`)?.classList.add("flow-node-drop-target"), g = Z);
            }
            if (y._config?.proximityConnect) {
              const ee = y._config.proximityConnectDistance ?? 150, V = I.dimensions ?? { width: 150, height: 50 }, K = {
                x: I.position.x + V.width / 2,
                y: I.position.y + V.height / 2
              }, ie = y.nodes.filter((Z) => Z.id !== I.id && !Z.hidden).map((Z) => ({
                id: Z.id,
                center: {
                  x: Z.position.x + (Z.dimensions?.width ?? 150) / 2,
                  y: Z.position.y + (Z.dimensions?.height ?? 50) / 2
                }
              })), F = Wh(I.id, K, ie, ee);
              if (F)
                if (y.edges.some(
                  (Y) => Y.source === F.source && Y.target === F.target || Y.source === F.target && Y.target === F.source
                ))
                  u?.destroy(), u = null, f = null;
                else {
                  if (f = F, !u) {
                    u = kt({
                      connectionLineType: y._config?.connectionLineType,
                      connectionLineStyle: y._config?.connectionLineStyle,
                      connectionLine: y._config?.connectionLine
                    });
                    const Y = te?.querySelector(".flow-viewport");
                    Y && Y.appendChild(u.svg);
                  }
                  u.update({
                    fromX: K.x,
                    fromY: K.y,
                    toX: F.targetCenter.x,
                    toY: F.targetCenter.y,
                    source: F.source
                  });
                }
              else
                u?.destroy(), u = null, f = null;
            }
            const j = y._container ? Te.get(y._container) : void 0;
            if (j?.bridge) {
              if (j.bridge.pushLocalNodeUpdate(R, { position: I.position }), c)
                for (const [ee] of c) {
                  const V = y.getNode(ee);
                  V && j.bridge.pushLocalNodeUpdate(ee, { position: V.position });
                }
              if (j.awareness && W instanceof MouseEvent && y._container) {
                const ee = y._container.getBoundingClientRect(), V = (W.clientX - ee.left - y.viewport.x) / y.viewport.zoom, K = (W.clientY - ee.top - y.viewport.y) / y.viewport.zoom;
                j.awareness.updateCursor({ x: V, y: K });
              }
            }
            d && W instanceof MouseEvent && d.updatePointer(W.clientX, W.clientY);
          },
          onDragEnd({ nodeId: R, position: Q }) {
            B("drag", `Node "${R}" drag end`, Q);
            const X = y._container ? Te.get(y._container) : void 0;
            X?.bridge && X.bridge.setDragging(R, !1), d?.stop(), d = null, h?.remove(), h = null, y._config?.helperLines && y._emit("helper-lines-change", { horizontal: [], vertical: [] });
            const W = y.getNode(R);
            if (W && y._emit("node-drag-end", { node: W, position: Q }), p && W?.parentId) {
              e.classList.remove("flow-reorder-dragging");
              const I = m;
              p = !1, w = -1, m = null, y._layoutAnimFrame && (cancelAnimationFrame(y._layoutAnimFrame), y._layoutAnimFrame = 0), e.closest(".flow-container")?.classList.remove("flow-layout-animating"), g ? (te && te.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), y.reparentNode(R, g), g = null) : I && I !== W.parentId ? (y.layoutChildren(I, { omitFromComputation: R, shallow: !0 }), y.propagateLayoutUp(I, { omitFromComputation: R }), y.layoutChildren(W.parentId), y._emit("child-reorder", {
                nodeId: R,
                parentId: W.parentId,
                order: W.order
              })) : (y.layoutChildren(W.parentId), y._emit("child-reorder", {
                nodeId: R,
                parentId: W.parentId,
                order: W.order
              })), c = null, a = !1;
              return;
            }
            if (W && g)
              te && te.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), y.reparentNode(R, g), g = null;
            else if (W && W.parentId && !g) {
              const I = Zt(
                y.getNode(W.parentId),
                y._config?.childValidationRules ?? {}
              ), j = y.getNode(W.parentId);
              if (!I?.preventChildEscape && !j?.childLayout && j?.dimensions) {
                const ee = W.position.x, V = W.position.y, K = W.dimensions?.width ?? 150, ie = W.dimensions?.height ?? 50;
                (ee + K < 0 || V + ie < 0 || ee > j.dimensions.width || V > j.dimensions.height) && y.reparentNode(R, null);
              }
              g = null;
            } else
              g && te && te.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null;
            if (y._config?.proximityConnect && f) {
              const I = f;
              u?.destroy(), u = null, f = null;
              let j = !0;
              if (y._config.onProximityConnect && y._config.onProximityConnect({
                source: I.source,
                target: I.target,
                distance: I.distance
              }) === !1 && (j = !1), j) {
                const ee = {
                  source: I.source,
                  sourceHandle: "source",
                  target: I.target,
                  targetHandle: "target"
                };
                if (We(ee, y.edges, { preventCycles: y._config?.preventCycles })) {
                  const V = te ? ze(te, ee, y.edges) : !0, K = te ? Fe(te, ee) : !0, ie = !y._config.isValidConnection || y._config.isValidConnection(ee);
                  if (V && K && ie) {
                    if (y._config.proximityConnectConfirm) {
                      const Z = te?.querySelector(`[data-flow-node-id="${CSS.escape(I.source)}"]`), Y = te?.querySelector(`[data-flow-node-id="${CSS.escape(I.target)}"]`);
                      Z?.classList.add("flow-proximity-confirm"), Y?.classList.add("flow-proximity-confirm"), setTimeout(() => {
                        Z?.classList.remove("flow-proximity-confirm"), Y?.classList.remove("flow-proximity-confirm");
                      }, 400);
                    }
                    const F = `e-${I.source}-${I.target}-${Date.now()}-${Zh++}`;
                    y.addEdges({ id: F, ...ee }), y._emit("connect", { connection: ee });
                  }
                }
              }
            } else
              u?.destroy(), u = null, f = null;
            c = null, a = !1;
          }
        }));
      });
      {
        const x = t.$data(e.closest("[x-data]"));
        if (x?._config?.easyConnect) {
          const y = x._config.easyConnectKey ?? "alt", q = (_) => {
            if (!Kh(_, y) || _.target.closest("[data-flow-handle-type]")) return;
            const L = t.$data(e.closest("[x-data]"));
            if (!L || L._animationLocked) return;
            const A = o(n);
            if (!A) return;
            const O = L.getNode(A.id);
            if (!O || O.connectable === !1) return;
            _.preventDefault(), _.stopPropagation(), _.stopImmediatePropagation();
            const E = Gh(e, _.clientX, _.clientY), k = E?.dataset.flowHandleId ?? "source";
            e.classList.add("flow-easy-connecting");
            const N = e.closest(".flow-container");
            if (!N) return;
            const U = L.viewport?.zoom || 1, J = L.viewport?.x || 0, oe = L.viewport?.y || 0, G = N.getBoundingClientRect();
            let se, le;
            if (E) {
              const j = E.getBoundingClientRect();
              se = (j.left + j.width / 2 - G.left - J) / U, le = (j.top + j.height / 2 - G.top - oe) / U;
            } else {
              const j = e.getBoundingClientRect();
              se = (j.left + j.width / 2 - G.left - J) / U, le = (j.top + j.height / 2 - G.top - oe) / U;
            }
            L._emit("connect-start", { source: A.id, sourceHandle: k });
            const ce = kt({
              connectionLineType: L._config?.connectionLineType,
              connectionLineStyle: L._config?.connectionLineStyle,
              connectionLine: L._config?.connectionLine
            }), te = N.querySelector(".flow-viewport");
            te && te.appendChild(ce.svg), ce.update({ fromX: se, fromY: le, toX: se, toY: le, source: A.id, sourceHandle: k }), L.pendingConnection = { source: A.id, sourceHandle: k, position: { x: se, y: le } }, Ut(N, A.id, k, L);
            let R = Xn(N, L, _.clientX, _.clientY), Q = null;
            const X = L._config?.connectionSnapRadius ?? 20, W = (j) => {
              const ee = L.screenToFlowPosition(j.clientX, j.clientY), V = jt({
                containerEl: N,
                handleType: "target",
                excludeNodeId: A.id,
                cursorFlowPos: ee,
                connectionSnapRadius: X,
                getNode: (K) => L.getNode(K),
                toFlowPosition: (K, ie) => L.screenToFlowPosition(K, ie)
              });
              V.element !== Q && (Q?.classList.remove("flow-handle-active"), V.element?.classList.add("flow-handle-active"), Q = V.element), ce.update({ fromX: se, fromY: le, toX: V.position.x, toY: V.position.y, source: A.id, sourceHandle: k }), L.pendingConnection = { ...L.pendingConnection, position: V.position }, R?.updatePointer(j.clientX, j.clientY);
            }, I = (j) => {
              R?.stop(), R = null, document.removeEventListener("pointermove", W), document.removeEventListener("pointerup", I), ce.destroy(), Q?.classList.remove("flow-handle-active"), Se(N), e.classList.remove("flow-easy-connecting");
              const ee = L.screenToFlowPosition(j.clientX, j.clientY), V = { source: A.id, sourceHandle: k, position: ee };
              let K = Q;
              if (K || (K = document.elementFromPoint(j.clientX, j.clientY)?.closest('[data-flow-handle-type="target"]')), K) {
                const F = K.closest("[x-flow-node]")?.dataset.flowNodeId, Z = K.dataset.flowHandleId ?? "target";
                if (F) {
                  const Y = { source: A.id, sourceHandle: k, target: F, targetHandle: Z };
                  if (We(Y, L.edges, { preventCycles: L._config.preventCycles }))
                    if (ze(N, Y, L.edges) && Fe(N, Y) && (!L._config?.isValidConnection || L._config.isValidConnection(Y))) {
                      const ne = `e-${A.id}-${F}-${Date.now()}-${Uh++}`;
                      L.addEdges({ id: ne, ...Y }), L._emit("connect", { connection: Y }), L._emit("connect-end", { connection: Y, ...V });
                    } else
                      L._emit("connect-end", { connection: null, ...V });
                  else
                    L._emit("connect-end", { connection: null, ...V });
                } else
                  L._emit("connect-end", { connection: null, ...V });
              } else
                L._emit("connect-end", { connection: null, ...V });
              L.pendingConnection = null;
            };
            document.addEventListener("pointermove", W), document.addEventListener("pointerup", I);
          };
          e.addEventListener("pointerdown", q, { capture: !0 }), r(() => {
            e.removeEventListener("pointerdown", q, { capture: !0 });
          });
        }
      }
      const T = (x) => {
        if (x.key !== "Enter" && x.key !== " ") return;
        x.preventDefault();
        const y = o(n);
        if (!y) return;
        const q = t.$data(e.closest("[x-data]"));
        q && (q._animationLocked || No(y) && (q._emit("node-click", { node: y, event: x }), x.stopPropagation(), it(x, q._shortcuts?.multiSelect) ? q.selectedNodes.has(y.id) ? (q.selectedNodes.delete(y.id), y.selected = !1) : (q.selectedNodes.add(y.id), y.selected = !0) : (q.deselectAll(), q.selectedNodes.add(y.id), y.selected = !0), q._emitSelectionChange()));
      };
      e.addEventListener("keydown", T);
      const v = () => {
        const x = t.$data(e.closest("[x-data]"));
        if (!x?._config?.autoPanOnNodeFocus) return;
        const y = o(n);
        if (!y) return;
        const q = y.parentId ? x.getAbsolutePosition(y.id) : y.position;
        x.setCenter(
          q.x + (y.dimensions?.width ?? 150) / 2,
          q.y + (y.dimensions?.height ?? 40) / 2
        );
      };
      e.addEventListener("focus", v);
      const P = (x) => {
        if (a) return;
        const y = o(n);
        if (!y) return;
        const q = t.$data(e.closest("[x-data]"));
        if (q && !q._animationLocked && (q._emit("node-click", { node: y, event: x }), !!No(y))) {
          if (x.stopPropagation(), l) {
            l = !1;
            return;
          }
          it(x, q._shortcuts?.multiSelect) ? q.selectedNodes.has(y.id) ? (q.selectedNodes.delete(y.id), y.selected = !1, e.classList.remove("flow-node-selected"), B("selection", `Node "${y.id}" deselected (shift)`)) : (q.selectedNodes.add(y.id), y.selected = !0, e.classList.add("flow-node-selected"), B("selection", `Node "${y.id}" selected (shift)`)) : (q.deselectAll(), q.selectedNodes.add(y.id), y.selected = !0, e.classList.add("flow-node-selected"), B("selection", `Node "${y.id}" selected`)), q._emitSelectionChange();
        }
      };
      e.addEventListener("click", P);
      const $ = (x) => {
        x.preventDefault(), x.stopPropagation();
        const y = o(n);
        if (!y) return;
        const q = t.$data(e.closest("[x-data]"));
        if (q)
          if (q.selectedNodes.size > 1 && q.selectedNodes.has(y.id)) {
            const _ = q.nodes.filter((L) => q.selectedNodes.has(L.id));
            q._emit("selection-context-menu", { nodes: _, event: x });
          } else
            q._emit("node-context-menu", { node: y, event: x });
      };
      e.addEventListener("contextmenu", $), requestAnimationFrame(() => {
        const x = o(n);
        if (!x) return;
        const y = t.$data(e.closest("[x-data]"));
        x.dimensions = {
          width: e.offsetWidth,
          height: e.offsetHeight
        }, B("init", `Node "${x.id}" measured`, x.dimensions), y?._nodeElements?.set(x.id, e);
      }), r(() => {
        s?.destroy(), h?.remove(), h = null, u?.destroy(), u = null, e.removeEventListener("keydown", T), e.removeEventListener("focus", v), e.removeEventListener("click", P), e.removeEventListener("contextmenu", $);
        const x = e.dataset.flowNodeId;
        x && t.$data(e.closest("[x-data]"))?._nodeElements?.delete(x);
      });
    }
  );
}
const vt = {
  minWidth: 30,
  minHeight: 30,
  maxWidth: 1 / 0,
  maxHeight: 1 / 0
};
function eg(t, e, n, o, i, r) {
  const { minWidth: s, minHeight: a, maxWidth: l, maxHeight: c } = i, d = t.includes("left"), h = t.includes("right"), u = t.includes("top"), f = t.includes("bottom");
  let g = o.width;
  h ? g = o.width + e.x : d && (g = o.width - e.x);
  let p = o.height;
  f ? p = o.height + e.y : u && (p = o.height - e.y), g = Math.max(s, Math.min(l, g)), p = Math.max(a, Math.min(c, p)), r && (g = r[0] * Math.round(g / r[0]), p = r[1] * Math.round(p / r[1]), g = Math.max(s, Math.min(l, g)), p = Math.max(a, Math.min(c, p)));
  const w = g - o.width, m = p - o.height, C = d ? n.x - w : n.x, S = u ? n.y - m : n.y;
  return {
    position: { x: C, y: S },
    dimensions: { width: g, height: p }
  };
}
const Mr = ["top-left", "top-right", "bottom-left", "bottom-right"], Tr = ["top", "right", "bottom", "left"], tg = [...Mr, ...Tr], ng = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize"
};
function og(t) {
  t.directive(
    "flow-resizer",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = ig(o);
      let l = { ...vt };
      if (n)
        try {
          const d = i(n);
          l = { ...vt, ...d };
        } catch {
        }
      const c = [];
      for (const d of a) {
        const h = document.createElement("div");
        h.className = `flow-resizer-handle flow-resizer-handle-${d}`, h.style.cursor = ng[d], h.dataset.flowResizeDirection = d, e.appendChild(h), c.push(h), h.addEventListener("pointerdown", (u) => {
          u.preventDefault(), u.stopPropagation();
          const f = e.closest("[x-flow-node]");
          if (!f) return;
          const g = e.closest("[x-data]");
          if (!g) return;
          const p = t.$data(g), w = f.dataset.flowNodeId;
          if (!w || !p) return;
          const m = p.getNode(w);
          if (!m || !Oi(m)) return;
          const C = { ...l };
          if (m.minDimensions?.width != null && l.minWidth === vt.minWidth && (C.minWidth = m.minDimensions.width), m.minDimensions?.height != null && l.minHeight === vt.minHeight && (C.minHeight = m.minDimensions.height), m.maxDimensions?.width != null && l.maxWidth === vt.maxWidth && (C.maxWidth = m.maxDimensions.width), m.maxDimensions?.height != null && l.maxHeight === vt.maxHeight && (C.maxHeight = m.maxDimensions.height), !m.dimensions) {
            const $ = p.viewport?.zoom || 1, x = f.getBoundingClientRect();
            m.dimensions = { width: x.width / $, height: x.height / $ };
          }
          const S = { x: m.position.x, y: m.position.y }, b = { width: m.dimensions.width, height: m.dimensions.height }, D = p.viewport?.zoom || 1, M = u.clientX, T = u.clientY;
          p._captureHistory?.(), B("resize", `Resize start on "${w}" (${d})`, b), p._emit("node-resize-start", { node: m, dimensions: { ...b } });
          const v = ($) => {
            const x = {
              x: ($.clientX - M) / D,
              y: ($.clientY - T) / D
            }, y = eg(
              d,
              x,
              S,
              b,
              C,
              p._config?.snapToGrid ?? !1
            );
            if (m.position.x = y.position.x, m.position.y = y.position.y, m.dimensions.width = y.dimensions.width, m.dimensions.height = y.dimensions.height, m.parentId) {
              const q = p.getAbsolutePosition(m.id);
              f.style.left = `${q.x}px`, f.style.top = `${q.y}px`;
            } else
              f.style.left = `${y.position.x}px`, f.style.top = `${y.position.y}px`;
            f.style.width = `${y.dimensions.width}px`, f.style.height = `${y.dimensions.height}px`, p._emit("node-resize", { node: m, dimensions: { ...y.dimensions } });
          }, P = () => {
            document.removeEventListener("pointermove", v), document.removeEventListener("pointerup", P), document.removeEventListener("pointercancel", P), B("resize", `Resize end on "${w}"`, m.dimensions), p._emit("node-resize-end", { node: m, dimensions: { ...m.dimensions } });
          };
          document.addEventListener("pointermove", v), document.addEventListener("pointerup", P), document.addEventListener("pointercancel", P);
        });
      }
      r(() => {
        const d = e.closest("[x-flow-node]");
        if (!d) return;
        const h = e.closest("[x-data]");
        if (!h) return;
        const u = t.$data(h), f = d.dataset.flowNodeId;
        if (!f || !u) return;
        const g = u.getNode(f);
        if (!g) return;
        const p = !Oi(g);
        for (const w of c)
          w.style.display = p ? "none" : "";
      }), s(() => {
        for (const d of c)
          d.remove();
      });
    }
  );
}
function ig(t) {
  if (t.includes("corners"))
    return Mr;
  if (t.includes("edges"))
    return Tr;
  const e = t.includes("top"), n = t.includes("bottom"), o = t.includes("left"), i = t.includes("right");
  if (e || n || o || i) {
    if (e && o) return ["top-left"];
    if (e && i) return ["top-right"];
    if (n && o) return ["bottom-left"];
    if (n && i) return ["bottom-right"];
    if (e) return ["top"];
    if (n) return ["bottom"];
    if (o) return ["left"];
    if (i) return ["right"];
  }
  return tg;
}
function sg(t, e, n, o) {
  return (Math.atan2(t - n, -(e - o)) * 180 / Math.PI % 360 + 360) % 360;
}
function rg(t, e) {
  return (Math.round(t / e) * e % 360 + 360) % 360;
}
function ag(t) {
  t.directive(
    "flow-rotate",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("snap"), l = a && n && Number(i(n)) || 15;
      e.classList.add("flow-rotate-handle"), e.style.cursor = "grab";
      const c = (d) => {
        d.preventDefault(), d.stopPropagation();
        const h = e.closest("[x-flow-node]");
        if (!h) return;
        const u = e.closest("[data-flow-canvas]");
        if (!u) return;
        const f = t.$data(u), g = h.dataset.flowNodeId;
        if (!g || !f) return;
        const p = f.getNode(g);
        if (!p) return;
        const w = h.getBoundingClientRect(), m = w.left + w.width / 2, C = w.top + w.height / 2;
        f._captureHistory(), e.style.cursor = "grabbing";
        const S = (D) => {
          let M = sg(
            D.clientX,
            D.clientY,
            m,
            C
          );
          a && (M = rg(M, l)), p.rotation = M;
        }, b = () => {
          document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", b), e.style.cursor = "grab", f._emit("node-rotate-end", { node: p, rotation: p.rotation });
        };
        document.addEventListener("pointermove", S), document.addEventListener("pointerup", b);
      };
      e.addEventListener("pointerdown", c), s(() => {
        e.removeEventListener("pointerdown", c), e.classList.remove("flow-rotate-handle");
      });
    }
  );
}
function lg(t) {
  t.directive(
    "flow-drag-handle",
    (e) => {
      e.setAttribute("data-flow-drag-handle", ""), e.classList.add("flow-drag-handle");
      const n = e.closest("[x-flow-node]");
      n && n.classList.add("flow-node-has-handle");
    }
  );
}
const cg = "application/alpineflow";
function dg(t) {
  t.directive(
    "flow-draggable",
    (e, { expression: n }, { evaluate: o }) => {
      e.setAttribute("draggable", "true"), e.style.cursor = "grab", e.addEventListener("dragstart", (i) => {
        if (!i.dataTransfer) return;
        const r = o(n), s = typeof r == "string" ? r : JSON.stringify(r);
        i.dataTransfer.setData(cg, s), i.dataTransfer.effectAllowed = "move";
      });
    }
  );
}
function ug(t) {
  t.directive(
    "flow-viewport",
    (e, {}, { effect: n, cleanup: o }) => {
      e.classList.add("flow-viewport");
      const i = t.$data(e.closest("[x-data]"));
      if (!i?.edges) return;
      i._viewportEl = e;
      const r = i.viewport;
      r && (e.style.transform = `translate(${r.x}px, ${r.y}px) scale(${r.zoom})`);
      const s = document.createElement("div");
      s.classList.add("flow-edges"), e.insertBefore(s, e.firstChild);
      const a = /* @__PURE__ */ new Map();
      n(() => {
        const l = i.edges, c = new Set(l.map((u) => u.id));
        for (const [u, f] of a)
          c.has(u) || (t.destroyTree(f), f.remove(), a.delete(u), i._edgeSvgElements?.delete(u));
        for (const u of l) {
          if (a.has(u.id)) continue;
          const f = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          f.setAttribute("class", "flow-edge-svg");
          const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          f.appendChild(g), t.addScopeToNode(g, { edge: u }), g.setAttribute("x-flow-edge", "edge"), t.mutateDom(() => {
            s.appendChild(f);
          }), a.set(u.id, f), i._edgeSvgElements?.set(u.id, f), t.initTree(g);
        }
        const h = (e.closest("[data-flow-canvas]") ?? e).querySelector(".flow-edges-static");
        h && h.remove();
        for (const u of l) {
          const f = a.get(u.id);
          if (!f) continue;
          const g = i.getNode?.(u.source), p = i.getNode?.(u.target), w = u.hidden || g?.hidden || p?.hidden;
          f.style.display = w ? "none" : "";
        }
        for (const u of l) {
          const f = a.get(u.id);
          if (!f) continue;
          const g = i.getNode?.(u.source), p = i.getNode?.(u.target);
          g?.filtered || p?.filtered ? f.classList.add("flow-edge-filtered") : f.classList.remove("flow-edge-filtered");
        }
      }), o(() => {
        for (const [l, c] of a)
          t.destroyTree(c), c.remove(), i._edgeSvgElements?.delete(l);
        a.clear(), s.remove();
      });
    }
  );
}
const fg = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
], hg = "a, button, input, textarea, select, [contenteditable]", gg = 100, pg = 60, mg = /* @__PURE__ */ new Set(["top", "top-left", "top-right"]), yg = /* @__PURE__ */ new Set(["bottom", "bottom-left", "bottom-right"]), wg = /* @__PURE__ */ new Set(["left", "top-left", "bottom-left"]), vg = /* @__PURE__ */ new Set(["right", "top-right", "bottom-right"]);
function _g(t, e) {
  const n = new Set(e), o = n.has("static"), i = n.has("no-resize") || n.has("noresize"), r = n.has("locked"), s = n.has("constrained");
  let a = n.has("fill-width") || n.has("fill"), l = n.has("fill-height") || n.has("fill");
  return { position: t && fg.includes(t) ? t : "top-right", isStatic: o, isFixed: r, noResize: i, constrained: s, fillWidth: a, fillHeight: l };
}
function _t(t, e, n) {
  t.dispatchEvent(new CustomEvent(`flow-${e}`, {
    bubbles: !0,
    detail: n
  }));
}
function bg(t, e, n, o, i, r) {
  return {
    left: Math.max(0, Math.min(t, i - n)),
    top: Math.max(0, Math.min(e, r - o))
  };
}
function xg(t, e, n, o) {
  t.style.transform = "none", t.style.borderRadius = "0", n && (t.style.left = "0", t.style.right = "0", t.style.width = "auto"), o && (t.style.top = "0", t.style.bottom = "0", t.style.height = "auto"), n && !o && (mg.has(e) && (t.style.top = "0"), yg.has(e) && (t.style.bottom = "0")), o && !n && (wg.has(e) && (t.style.left = "0"), vg.has(e) && (t.style.right = "0"));
}
function Eg(t) {
  t.directive(
    "flow-panel",
    (e, { value: n, modifiers: o }, { cleanup: i }) => {
      const {
        position: r,
        isStatic: s,
        isFixed: a,
        noResize: l,
        constrained: c,
        fillWidth: d,
        fillHeight: h
      } = _g(n, o), u = d || h, f = !s && !a && !u, g = !s && !l && !u;
      e.classList.add("flow-panel", `flow-panel-${r}`), s && e.classList.add("flow-panel-static"), (a || u) && e.classList.add("flow-panel-locked"), (l || u) && e.classList.add("flow-panel-no-resize"), d && e.classList.add("flow-panel-fill-width"), h && e.classList.add("flow-panel-fill-height"), u && xg(e, r, d, h);
      const p = (D) => D.stopPropagation();
      e.addEventListener("mousedown", p), e.addEventListener("pointerdown", p), e.addEventListener("wheel", p);
      const w = e.parentElement, m = {
        left: e.style.left,
        top: e.style.top,
        right: e.style.right,
        bottom: e.style.bottom,
        transform: e.style.transform,
        width: e.style.width,
        height: e.style.height,
        borderRadius: e.style.borderRadius
      }, C = `flow-panel-${r}`, S = () => {
        e.style.left = m.left, e.style.top = m.top, e.style.right = m.right, e.style.bottom = m.bottom, e.style.transform = m.transform, e.style.width = m.width, e.style.height = m.height, e.style.borderRadius = m.borderRadius, e.classList.contains(C) || e.classList.add(C);
      };
      w.addEventListener("flow-panel-reset", S), w.__flowPanels || (w.__flowPanels = /* @__PURE__ */ new Set()), w.__flowPanels.add(e);
      let b = null;
      if (f) {
        let D = !1, M = 0, T = 0, v = 0, P = 0;
        const $ = () => {
          const _ = e.getBoundingClientRect(), L = w.getBoundingClientRect();
          return {
            x: _.left - L.left,
            y: _.top - L.top
          };
        }, x = (_) => {
          if (!D) return;
          let L = v + (_.clientX - M), A = P + (_.clientY - T);
          if (c) {
            const O = bg(
              L,
              A,
              e.offsetWidth,
              e.offsetHeight,
              w.clientWidth,
              w.clientHeight
            );
            L = O.left, A = O.top;
          }
          e.style.left = `${L}px`, e.style.top = `${A}px`, _t(w, "panel-drag", {
            panel: e,
            position: { x: L, y: A }
          });
        }, y = () => {
          if (!D) return;
          D = !1, document.removeEventListener("pointermove", x), document.removeEventListener("pointerup", y), document.removeEventListener("pointercancel", y);
          const _ = $();
          _t(w, "panel-drag-end", {
            panel: e,
            position: _
          });
        }, q = (_) => {
          const L = _.target;
          if (L.closest(hg) || L.closest(".flow-panel-resize-handle"))
            return;
          D = !0, M = _.clientX, T = _.clientY;
          const A = e.getBoundingClientRect(), O = w.getBoundingClientRect();
          v = A.left - O.left, P = A.top - O.top, e.style.bottom = "auto", e.style.right = "auto", e.style.transform = "none", e.style.left = `${v}px`, e.style.top = `${P}px`, document.addEventListener("pointermove", x), document.addEventListener("pointerup", y), document.addEventListener("pointercancel", y), _t(w, "panel-drag-start", {
            panel: e,
            position: { x: v, y: P }
          });
        };
        if (e.addEventListener("pointerdown", q), g) {
          b = document.createElement("div"), b.classList.add("flow-panel-resize-handle"), e.appendChild(b);
          let _ = !1, L = 0, A = 0, O = 0, E = 0;
          const k = (J) => {
            if (!_) return;
            const oe = Math.max(gg, O + (J.clientX - L)), G = Math.max(pg, E + (J.clientY - A));
            e.style.width = `${oe}px`, e.style.height = `${G}px`, _t(w, "panel-resize", {
              panel: e,
              dimensions: { width: oe, height: G }
            });
          }, N = () => {
            _ && (_ = !1, document.removeEventListener("pointermove", k), document.removeEventListener("pointerup", N), document.removeEventListener("pointercancel", N), _t(w, "panel-resize-end", {
              panel: e,
              dimensions: { width: e.offsetWidth, height: e.offsetHeight }
            }));
          }, U = (J) => {
            J.stopPropagation(), _ = !0, L = J.clientX, A = J.clientY, O = e.offsetWidth, E = e.offsetHeight, document.addEventListener("pointermove", k), document.addEventListener("pointerup", N), document.addEventListener("pointercancel", N), _t(w, "panel-resize-start", {
              panel: e,
              dimensions: { width: O, height: E }
            });
          };
          b.addEventListener("pointerdown", U), i(() => {
            e.removeEventListener("pointerdown", q), b?.removeEventListener("pointerdown", U), document.removeEventListener("pointermove", x), document.removeEventListener("pointerup", y), document.removeEventListener("pointercancel", y), document.removeEventListener("pointermove", k), document.removeEventListener("pointerup", N), document.removeEventListener("pointercancel", N), b?.remove(), e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), w.removeEventListener("flow-panel-reset", S), w.__flowPanels?.delete(e);
          });
        } else
          i(() => {
            e.removeEventListener("pointerdown", q), document.removeEventListener("pointermove", x), document.removeEventListener("pointerup", y), document.removeEventListener("pointercancel", y), e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), w.removeEventListener("flow-panel-reset", S), w.__flowPanels?.delete(e);
          });
      } else
        i(() => {
          e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), w.removeEventListener("flow-panel-reset", S), w.__flowPanels?.delete(e);
        });
    }
  );
}
function Cg(t) {
  t.directive(
    "flow-node-toolbar",
    (e, { value: n, modifiers: o }, { effect: i, cleanup: r }) => {
      const s = Sg(n), a = Pg(o);
      e.classList.add("flow-node-toolbar"), e.style.position = "absolute";
      const l = (d) => {
        d.stopPropagation();
      }, c = (d) => {
        d.stopPropagation();
      };
      e.addEventListener("pointerdown", l), e.addEventListener("click", c), i(() => {
        const d = e.closest("[x-flow-node]");
        if (!d) return;
        const h = e.closest("[x-data]");
        if (!h) return;
        const u = t.$data(h);
        if (!u?.viewport) return;
        const f = u.viewport.zoom || 1, g = parseInt(e.getAttribute("data-flow-offset") ?? "10", 10), p = d.dataset.flowNodeId, w = p ? u.getNode(p) : null, m = w?.dimensions?.width ?? d.offsetWidth, C = w?.dimensions?.height ?? d.offsetHeight, S = g / f;
        let b, D, M, T;
        s === "top" || s === "bottom" ? (D = s === "top" ? -S : C + S, T = s === "top" ? "-100%" : "0%", a === "start" ? (b = 0, M = "0%") : a === "end" ? (b = m, M = "-100%") : (b = m / 2, M = "-50%")) : (b = s === "left" ? -S : m + S, M = s === "left" ? "-100%" : "0%", a === "start" ? (D = 0, T = "0%") : a === "end" ? (D = C, T = "-100%") : (D = C / 2, T = "-50%")), e.style.left = `${b}px`, e.style.top = `${D}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / f}) translate(${M}, ${T})`;
      }), r(() => {
        e.removeEventListener("pointerdown", l), e.removeEventListener("click", c), e.classList.remove("flow-node-toolbar");
      });
    }
  );
}
function Sg(t) {
  return t === "bottom" ? "bottom" : t === "left" ? "left" : t === "right" ? "right" : "top";
}
function Pg(t) {
  return t.includes("start") ? "start" : t.includes("end") ? "end" : "center";
}
function kg(t) {
  t.directive(
    "flow-context-menu",
    (e, { modifiers: n, expression: o }, { effect: i, evaluate: r, cleanup: s }) => {
      const a = n[0];
      if (!a) {
        console.warn("[AlpineFlow] x-flow-context-menu requires a type modifier: .node, .edge, .pane, or .selection");
        return;
      }
      const l = e, c = l.closest("[x-data]");
      if (!c) return;
      const d = t.$data(c);
      let h = 0, u = 0;
      if (o) {
        const M = r(o);
        h = M?.offsetX ?? 0, u = M?.offsetY ?? 0;
      }
      l.setAttribute("role", "menu"), l.setAttribute("tabindex", "-1"), l.style.display = "none";
      const f = document.createElement("div");
      f.style.cssText = "position:fixed;inset:0;z-index:4999;display:none;", c.appendChild(f);
      let g = null;
      const p = 4, w = () => {
        g = document.activeElement;
        const M = d.contextMenu.x + h, T = d.contextMenu.y + u;
        l.style.display = "", l.style.position = "fixed", l.style.left = M + "px", l.style.top = T + "px", l.style.zIndex = "5000", l.querySelectorAll(':scope > button, :scope > [role="menuitem"]').forEach((q) => {
          q.setAttribute("role", "menuitem"), q.hasAttribute("tabindex") || q.setAttribute("tabindex", "-1");
        });
        const v = l.getBoundingClientRect(), P = window.innerWidth, $ = window.innerHeight;
        let x = M, y = T;
        v.right > P - p && (x = P - v.width - p), v.bottom > $ - p && (y = $ - v.height - p), x < p && (x = p), y < p && (y = p), l.style.left = x + "px", l.style.top = y + "px", f.style.display = "", l.focus();
      }, m = () => {
        l.style.display = "none", f.style.display = "none", g && document.contains(g) && (g.focus(), g = null);
      };
      i(() => {
        const M = d.contextMenu;
        M.show && M.type === a ? w() : m();
      }), f.addEventListener("click", () => d.closeContextMenu()), f.addEventListener("contextmenu", (M) => {
        M.preventDefault(), d.closeContextMenu();
      });
      const C = () => {
        d.contextMenu.show && d.contextMenu.type === a && d.closeContextMenu();
      };
      window.addEventListener("scroll", C, !0);
      const S = () => Array.from(l.querySelectorAll(
        ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])'
      )), b = (M) => Array.from(M.querySelectorAll(
        "button:not([disabled])"
      )), D = (M) => {
        if (!d.contextMenu.show || d.contextMenu.type !== a || l.style.display === "none") return;
        const T = document.activeElement, v = T?.closest(".flow-context-submenu"), P = v ? b(v) : S();
        if (P.length === 0) return;
        const $ = P.indexOf(T);
        switch (M.key) {
          case "ArrowDown": {
            M.preventDefault();
            const x = $ < P.length - 1 ? $ + 1 : 0;
            P[x].focus();
            break;
          }
          case "ArrowUp": {
            M.preventDefault();
            const x = $ > 0 ? $ - 1 : P.length - 1;
            P[x].focus();
            break;
          }
          case "Tab": {
            if (M.preventDefault(), M.shiftKey) {
              const x = $ > 0 ? $ - 1 : P.length - 1;
              P[x].focus();
            } else {
              const x = $ < P.length - 1 ? $ + 1 : 0;
              P[x].focus();
            }
            break;
          }
          case "Enter":
          case " ": {
            M.preventDefault(), T?.click();
            break;
          }
          case "ArrowRight": {
            if (!v) {
              const x = T?.querySelector(".flow-context-submenu");
              x && (M.preventDefault(), x.querySelector("button:not([disabled])")?.focus());
            }
            break;
          }
          case "ArrowLeft": {
            v && (M.preventDefault(), v.closest(".flow-context-submenu-trigger")?.focus());
            break;
          }
        }
      };
      l.addEventListener("keydown", D), s(() => {
        f.remove(), window.removeEventListener("scroll", C, !0), l.removeEventListener("keydown", D);
      });
    }
  );
}
const Lg = {
  mouseenter: "mouseleave",
  click: "click"
  // toggle behavior
};
function Mg(t) {
  t.directive(
    "flow-animate",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = new Set(o), c = l.has("once"), d = l.has("reverse"), h = l.has("queue"), u = n || "";
      let f = "click";
      l.has("mouseenter") ? f = "mouseenter" : l.has("click") && (f = "click");
      let g = null, p = [], w = !1, m = !1, C = !1;
      function S() {
        const x = r(i);
        return Array.isArray(x) ? x : x && typeof x == "object" ? [x] : [];
      }
      function b() {
        const x = e.closest("[x-data]");
        return x ? t.$data(x) : null;
      }
      function D(x, y = !1) {
        const q = b();
        if (!q?.timeline) return Promise.resolve();
        const _ = q.timeline();
        if (y) {
          for (let L = x.length - 1; L >= 0; L--)
            _.step(x[L]);
          _.reverse();
        } else
          for (const L of x)
            L.parallel ? _.parallel(L.parallel) : _.step(L);
        return g = _, _.play().then(() => {
          g === _ && (g = null);
        });
      }
      function M(x = !1) {
        if (c && m) return;
        m = !0;
        const y = S();
        if (y.length === 0) return;
        const q = () => D(y, x);
        h ? (p.push(q), T()) : (g?.stop(), g = null, p = [], w = !1, q());
      }
      async function T() {
        if (!w) {
          for (w = !0; p.length > 0; )
            await p.shift()();
          w = !1;
        }
      }
      if (u) {
        s(() => {
          const x = S(), y = b();
          y?.registerAnimation && y.registerAnimation(u, x);
        }), a(() => {
          const x = b();
          x?.unregisterAnimation && x.unregisterAnimation(u);
        });
        return;
      }
      const v = () => {
        d && f === "click" ? (M(C), C = !C) : M(!1);
      };
      e.addEventListener(f, v);
      let P = null, $ = null;
      d && f !== "click" && ($ = Lg[f] ?? null, $ && (P = () => M(!0), e.addEventListener($, P))), a(() => {
        g?.stop(), e.removeEventListener(f, v), $ && P && e.removeEventListener($, P);
      });
    }
  );
}
function Tg(t, e, n, o, i) {
  const r = e.position?.x ?? t.position.x, s = e.position?.y ?? t.position.y, a = t.dimensions?.width ?? ye, l = t.dimensions?.height ?? we, c = r * n.zoom + n.x, d = s * n.zoom + n.y, h = (r + a) * n.zoom + n.x, u = (s + l) * n.zoom + n.y;
  return h > 0 && c < o && u > 0 && d < i;
}
function Ag(t, e, n, o, i) {
  const r = t.nodes;
  if (!r || r.length === 0) return !1;
  for (const s of r) {
    const a = e.getNode?.(s) ?? e.nodes?.find((l) => l.id === s);
    if (a && !Tg(a, t, n, o, i))
      return !0;
  }
  return !1;
}
function Ng(t) {
  t.directive(
    "flow-timeline",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = 0, a = null, l = [], c = !1, d = "idle", h = 0;
      function u() {
        const w = e.closest("[x-data]");
        return w ? t.$data(w) : null;
      }
      function f(w, m) {
        const C = u();
        if (!C?.timeline) return Promise.resolve();
        const S = C.timeline(), b = m.speed ?? 1, D = m.autoFitView === !0, M = m.fitViewPadding ?? 0.1, T = C.viewport, v = C.getContainerDimensions?.();
        for (const P of w) {
          const $ = b !== 1 ? {
            ...P,
            duration: P.duration !== void 0 ? P.duration / b : void 0,
            delay: P.delay !== void 0 ? P.delay / b : void 0
          } : P;
          if ($.parallel) {
            const x = $.parallel.map(
              (y) => b !== 1 ? {
                ...y,
                duration: y.duration !== void 0 ? y.duration / b : void 0,
                delay: y.delay !== void 0 ? y.delay / b : void 0
              } : y
            );
            S.parallel(x);
          } else if (D && T && v && Ag($, C, T, v.width, v.height)) {
            const x = {
              fitView: !0,
              fitViewPadding: M,
              duration: $.duration,
              easing: $.easing
            };
            S.parallel([$, x]);
          } else
            S.step($);
        }
        if (m.lock && S.lock(!0), m.loop !== void 0 && m.loop !== !1) {
          const P = m.loop === !0 ? 0 : m.loop;
          S.loop(P);
        }
        return m.respectReducedMotion !== void 0 && S.respectReducedMotion(m.respectReducedMotion), a = S, d = "playing", c = !0, S.play().then(() => {
          a === S && (a = null, d = "idle", c = !1);
        });
      }
      async function g(w) {
        if (l.length === 0) return;
        if ((w.overflow ?? "queue") === "latest" && c) {
          a?.stop(), a = null, c = !1, d = "idle";
          const C = [l[l.length - 1]];
          s += l.length, l = [], await f(C, w);
        } else {
          const C = [...l];
          s += C.length, l = [], c && await new Promise((b) => {
            a ? (a.on("complete", () => b()), a.on("stop", () => b())) : b();
          }), await f(C, w);
        }
      }
      const p = {
        async play() {
          const w = o(n), m = w.steps ?? [];
          s < m.length && (l = m.slice(s), await g(w));
        },
        stop() {
          a?.stop(), a = null, c = !1, d = "stopped", l = [];
        },
        reset(w) {
          if (a?.stop(), a = null, c = !1, d = "idle", s = 0, l = [], h = 0, w) {
            const m = o(n), C = m.steps ?? [];
            if (C.length > 0)
              return l = [...C], g(m);
          }
        },
        get state() {
          return d;
        }
      };
      e.__timeline = p, i(() => {
        const w = o(n);
        if (!w || !w.steps) return;
        const m = w.steps, C = w.autoplay !== !1;
        if (m.length > h) {
          const S = m.slice(Math.max(s, h));
          h = m.length, S.length > 0 && C && (l.push(...S), g(w));
        } else
          h = m.length;
      }), r(() => {
        a?.stop(), delete e.__timeline;
      });
    }
  );
}
function $g(t) {
  t.directive(
    "flow-collapse",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("all"), l = o.includes("expand"), c = o.includes("children"), d = o.includes("instant"), h = () => {
        const u = e.closest("[data-flow-canvas]");
        if (!u) return;
        const f = t.$data(u);
        if (!f) return;
        if (a) {
          for (const p of f.nodes)
            l ? f.expandNode?.(p.id, { animate: !d }) : f.collapseNode?.(p.id, { animate: !d });
          e.setAttribute("aria-expanded", String(l));
          return;
        }
        if (c && n) {
          const p = i(n);
          if (!p) return;
          for (const w of f.nodes)
            w.parentId === p && (l ? f.expandNode?.(w.id, { animate: !d }) : f.collapseNode?.(w.id, { animate: !d }));
          e.setAttribute("aria-expanded", String(l));
          return;
        }
        const g = i(n);
        !g || !f?.toggleNode || f.toggleNode(g, { animate: !d });
      };
      e.addEventListener("click", h), e.setAttribute("data-flow-collapse", ""), e.style.cursor = "pointer", !a && !c && r(() => {
        const u = i(n);
        if (!u) return;
        const f = e.closest("[data-flow-canvas]");
        if (!f) return;
        const g = t.$data(f);
        if (!g?.isCollapsed) return;
        const p = g.isCollapsed(u);
        e.setAttribute("aria-expanded", String(!p));
        const w = e.closest("[x-flow-node]");
        w && e.setAttribute("aria-controls", w.id || u);
      }), s(() => {
        e.removeEventListener("click", h);
      });
    }
  );
}
function Ig(t) {
  t.directive(
    "flow-condense",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = () => {
        const l = i(n);
        if (!l) return;
        const c = e.closest("[x-data]");
        if (!c) return;
        const d = t.$data(c);
        d?.toggleCondense && d.toggleCondense(l);
      };
      e.addEventListener("click", a), e.setAttribute("data-flow-condense", ""), e.style.cursor = "pointer", r(() => {
        const l = i(n);
        if (!l) return;
        const c = e.closest("[x-data]");
        if (!c) return;
        const d = t.$data(c);
        if (!d?.isCondensed) return;
        const h = d.isCondensed(l);
        e.setAttribute("aria-expanded", String(!h));
      }), s(() => {
        e.removeEventListener("click", a);
      });
    }
  );
}
function Dg(t) {
  t.directive(
    "flow-row-select",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      e.classList.add("nodrag"), e.style.cursor = "pointer", e.setAttribute("data-flow-row-select", "");
      const s = (a) => {
        a.stopPropagation();
        const l = o(n);
        if (!l) return;
        const c = e.closest("[x-data]");
        if (!c) return;
        const d = t.$data(c);
        d?.toggleRowSelect && (a.shiftKey ? d.toggleRowSelect(l) : (d.deselectAllRows(), d.selectRow(l)));
      };
      e.addEventListener("click", s), i(() => {
        const a = o(n);
        if (!a) return;
        const l = e.closest("[x-data]");
        if (!l) return;
        const c = t.$data(l);
        if (!c?.isRowSelected) return;
        const d = c.isRowSelected(a);
        e.classList.toggle("flow-row-selected", d), e.setAttribute("aria-selected", String(d));
      }), r(() => {
        e.removeEventListener("click", s);
      });
    }
  );
}
function Rg(t) {
  t.directive(
    "flow-detail",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      if (n) {
        const h = e.closest("[data-flow-canvas]");
        if (!h) return;
        const u = t.$data(h);
        if (!u?.viewport) return;
        const f = e.style.display;
        r(() => {
          const g = i(n), p = u.viewport.zoom, w = g.min === void 0 || p >= g.min, m = g.max === void 0 || p <= g.max;
          e.style.display = w && m ? f : "none";
        }), s(() => {
          e.style.display = f;
        });
        return;
      }
      const a = new Set(o.filter((h) => h === "far" || h === "medium" || h === "close"));
      if (a.size === 0) return;
      const l = e.closest("[data-flow-canvas]");
      if (!l) return;
      const c = t.$data(l);
      if (!c?._zoomLevel) return;
      const d = e.style.display;
      r(() => {
        const h = c._zoomLevel;
        a.has(h) ? e.style.display = d : e.style.display = "none";
      }), s(() => {
        e.style.display = d;
      });
    }
  );
}
const Hg = ["perf", "events", "viewport", "state", "activity"], rs = ["fps", "memory", "counts", "visible"], as = 30;
function Fg(t, e) {
  if (t && typeof t == "object" && Object.keys(t).length > 0)
    return t;
  const n = e.filter((i) => Hg.includes(i));
  if (n.length === 0)
    return { perf: !0, events: !0, viewport: !0, state: !0, activity: !0 };
  const o = {};
  for (const i of n)
    o[i] = !0;
  return o;
}
function zg(t) {
  return t.perf ? t.perf === !0 ? [...rs] : t.perf.filter((e) => rs.includes(e)) : [];
}
function Og(t) {
  return t.events ? t.events === !0 ? as : t.events.max ?? as : 0;
}
function Yt(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-section ${e}`;
  const o = document.createElement("div");
  o.className = "flow-devtools-section-title", o.textContent = t, n.appendChild(o);
  const i = document.createElement("div");
  return i.className = "flow-devtools-section-content", n.appendChild(i), { wrapper: n, content: i };
}
function $e(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-row ${e}`;
  const o = document.createElement("span");
  o.className = "flow-devtools-label", o.textContent = t;
  const i = document.createElement("span");
  return i.className = "flow-devtools-value", i.textContent = "—", n.appendChild(o), n.appendChild(i), { row: n, valueEl: i };
}
function Vg(t) {
  t.directive(
    "flow-devtools",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      let a = null;
      if (n)
        try {
          a = i(n);
        } catch {
        }
      const l = Fg(a, o), c = e.closest("[x-data]");
      if (!c) return;
      const d = e.closest(".flow-container");
      if (!d) return;
      e.classList.add("flow-devtools", "canvas-overlay"), e.setAttribute("data-flow-devtools", "");
      const h = (R) => R.stopPropagation();
      e.addEventListener("wheel", h);
      const u = document.createElement("button");
      u.className = "flow-devtools-toggle nopan", u.title = "Devtools";
      const f = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      f.setAttribute("width", "14"), f.setAttribute("height", "14"), f.setAttribute("viewBox", "0 0 24 24"), f.setAttribute("fill", "none"), f.setAttribute("stroke", "currentColor"), f.setAttribute("stroke-width", "2"), f.setAttribute("stroke-linecap", "round"), f.setAttribute("stroke-linejoin", "round");
      const g = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      g.setAttribute("points", "22 12 18 12 15 21 9 3 6 12 2 12"), f.appendChild(g), u.appendChild(f), e.appendChild(u);
      const p = document.createElement("div");
      p.className = "flow-devtools-panel", p.style.display = "none", p.style.userSelect = "none", e.appendChild(p);
      let w = !1;
      const m = () => {
        w = !w, p.style.display = w ? "" : "none", u.title = w ? "Collapse" : "Devtools", w ? G() : se();
      };
      u.addEventListener("click", m);
      const C = zg(l);
      let S = null, b = null, D = null, M = null, T = null;
      if (C.length > 0) {
        const { wrapper: R, content: Q } = Yt("Performance", "flow-devtools-perf");
        if (C.includes("fps")) {
          const { row: X, valueEl: W } = $e("FPS", "flow-devtools-fps");
          S = W, Q.appendChild(X);
        }
        if (C.includes("memory")) {
          const { row: X, valueEl: W } = $e("Memory", "flow-devtools-memory");
          b = W, Q.appendChild(X);
        }
        if (C.includes("counts")) {
          const X = $e("Nodes", "flow-devtools-counts");
          D = X.valueEl, Q.appendChild(X.row);
          const W = $e("Edges", "flow-devtools-counts");
          M = W.valueEl, Q.appendChild(W.row);
        }
        if (C.includes("visible")) {
          const { row: X, valueEl: W } = $e("Visible", "flow-devtools-visible");
          T = W, Q.appendChild(X);
        }
        p.appendChild(R);
      }
      const v = Og(l);
      let P = null;
      if (v > 0) {
        const { wrapper: R, content: Q } = Yt("Events", "flow-devtools-events"), X = document.createElement("button");
        X.className = "flow-devtools-clear-btn nopan", X.textContent = "Clear", X.addEventListener("click", () => {
          P && (P.textContent = ""), le.length = 0;
        }), R.querySelector(".flow-devtools-section-title").appendChild(X), P = document.createElement("div"), P.className = "flow-devtools-event-list", Q.appendChild(P), p.appendChild(R);
      }
      let $ = null, x = null, y = null;
      if (l.viewport) {
        const { wrapper: R, content: Q } = Yt("Viewport", "flow-devtools-viewport"), X = $e("X", "flow-devtools-vp-x");
        $ = X.valueEl, Q.appendChild(X.row);
        const W = $e("Y", "flow-devtools-vp-y");
        x = W.valueEl, Q.appendChild(W.row);
        const I = $e("Zoom", "flow-devtools-vp-zoom");
        y = I.valueEl, Q.appendChild(I.row), p.appendChild(R);
      }
      let q = null;
      if (l.state) {
        const { wrapper: R, content: Q } = Yt("Selection", "flow-devtools-state");
        q = document.createElement("div"), q.className = "flow-devtools-state-content", q.textContent = "No selection", Q.appendChild(q), p.appendChild(R);
      }
      let _ = null, L = null, A = null, O = null;
      if (l.activity) {
        const { wrapper: R, content: Q } = Yt("Activity", "flow-devtools-activity"), X = $e("Animations", "flow-devtools-anim");
        _ = X.valueEl, Q.appendChild(X.row);
        const W = $e("Particles", "flow-devtools-particles");
        L = W.valueEl, Q.appendChild(W.row);
        const I = $e("Follow", "flow-devtools-follow");
        A = I.valueEl, Q.appendChild(I.row);
        const j = $e("Timelines", "flow-devtools-timelines");
        O = j.valueEl, Q.appendChild(j.row), p.appendChild(R);
      }
      let E = null, k = !1, N = 0, U = performance.now();
      const J = !!(S || b), oe = () => {
        if (!k) return;
        N++;
        const R = performance.now();
        R - U >= 1e3 && (S && (S.textContent = String(Math.round(N * 1e3 / (R - U)))), N = 0, U = R, b && performance.memory && (b.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB")), E = requestAnimationFrame(oe);
      }, G = () => {
        !J || k || (k = !0, N = 0, U = performance.now(), E = requestAnimationFrame(oe));
      }, se = () => {
        k = !1, E !== null && (cancelAnimationFrame(E), E = null);
      }, le = [], ce = [
        "flow-init",
        "flow-connect",
        "flow-disconnect",
        "flow-node-add",
        "flow-node-remove",
        "flow-edge-add",
        "flow-edge-remove",
        "flow-selection-change",
        "flow-viewport-change",
        "flow-viewport-move-start",
        "flow-viewport-move",
        "flow-viewport-move-end",
        "flow-node-drag-start",
        "flow-node-drag",
        "flow-node-drag-end",
        "flow-node-click",
        "flow-edge-click",
        "flow-node-condense",
        "flow-node-uncondense",
        "flow-undo",
        "flow-redo"
      ];
      let te = null;
      if (v > 0 && P) {
        te = (R) => {
          const Q = R, X = Q.type.replace("flow-", "");
          let W = "";
          try {
            W = Q.detail ? JSON.stringify(Q.detail).slice(0, 80) : "";
          } catch {
            W = "[circular]";
          }
          le.unshift({ name: X, time: Date.now(), detail: W });
          const I = P, j = document.createElement("div");
          j.className = "flow-devtools-event-entry";
          const ee = document.createElement("span");
          ee.className = "flow-devtools-event-name", ee.textContent = X;
          const V = document.createElement("span");
          V.className = "flow-devtools-event-age", V.textContent = "now";
          const K = document.createElement("span");
          for (K.className = "flow-devtools-event-detail", K.textContent = W, j.appendChild(ee), j.appendChild(V), j.appendChild(K), I.prepend(j); I.children.length > v; )
            I.removeChild(I.lastChild), le.pop();
        };
        for (const R of ce)
          d.addEventListener(R, te);
      }
      r(() => {
        const R = t.$data(c);
        if (R) {
          if (D && (D.textContent = String(R.nodes?.length ?? 0)), M && (M.textContent = String(R.edges?.length ?? 0)), T && R._getVisibleNodeIds && (T.textContent = String(R._getVisibleNodeIds().size)), $ && R.viewport && ($.textContent = Math.round(R.viewport.x).toString()), x && R.viewport && (x.textContent = Math.round(R.viewport.y).toString()), y && R.viewport && (y.textContent = R.viewport.zoom.toFixed(2)), q) {
            const Q = R.selectedNodes, X = R.selectedEdges;
            if (!((Q?.size ?? 0) > 0 || (X?.size ?? 0) > 0))
              q.textContent = "No selection";
            else {
              if (q.textContent = "", Q && Q.size > 0)
                for (const I of Q) {
                  const j = R.getNode?.(I);
                  if (!j) continue;
                  const ee = document.createElement("pre");
                  ee.className = "flow-devtools-json", ee.textContent = JSON.stringify({ id: j.id, position: j.position, data: j.data }, null, 2), q.appendChild(ee);
                }
              if (X && X.size > 0)
                for (const I of X) {
                  const j = R.edges?.find((V) => V.id === I);
                  if (!j) continue;
                  const ee = document.createElement("pre");
                  ee.className = "flow-devtools-json", ee.textContent = JSON.stringify({ id: j.id, source: j.source, target: j.target, type: j.type }, null, 2), q.appendChild(ee);
                }
            }
          }
          if (_) {
            const Q = R._animator?._groups?.size ?? 0;
            _.textContent = String(Q);
          }
          L && (L.textContent = String(R._activeParticles?.size ?? 0)), A && (A.textContent = R._followHandle ? "Active" : "Idle"), O && (O.textContent = String(R._activeTimelines?.size ?? 0));
        }
      }), s(() => {
        if (se(), u.removeEventListener("click", m), te)
          for (const R of ce)
            d.removeEventListener(R, te);
        e.removeEventListener("wheel", h), e.textContent = "", S = null, b = null, D = null, M = null, T = null, P = null, $ = null, x = null, y = null, q = null, _ = null, L = null, A = null, O = null;
      });
    }
  );
}
const Bg = {
  undo: { method: "undo", disabledWhen: (t) => !t.canUndo, aria: "disabled" },
  redo: { method: "redo", disabledWhen: (t) => !t.canRedo, aria: "disabled" },
  "fit-view": { method: "fitView", passExpression: !0 },
  "zoom-in": {
    method: "zoomIn",
    disabledWhen: (t) => t.viewport.zoom >= (t._config?.maxZoom ?? 2),
    aria: "disabled"
  },
  "zoom-out": {
    method: "zoomOut",
    disabledWhen: (t) => t.viewport.zoom <= (t._config?.minZoom ?? 0.5),
    aria: "disabled"
  },
  "toggle-interactive": { method: "toggleInteractive", aria: "pressed" },
  clear: { method: "$clear", disabledWhen: (t) => t.nodes.length === 0, aria: "disabled" },
  reset: { method: "$reset" },
  export: { method: "toImage", passExpression: !0 }
};
function Xg(t) {
  return Bg[t] ?? null;
}
function Yg(t) {
  t.directive(
    "flow-action",
    (e, { value: n, expression: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = Xg(n);
      if (!l)
        return;
      const c = e.closest("[data-flow-canvas]");
      if (!c)
        return;
      const d = t.$data(c);
      if (!d)
        return;
      const h = () => {
        const u = d[l.method];
        typeof u == "function" && (l.passExpression && o ? u.call(d, i(o)) : u.call(d));
      };
      e.addEventListener("click", h), (l.disabledWhen || l.aria) && r(() => {
        if (l.disabledWhen) {
          const u = l.disabledWhen(d);
          e.disabled = u, l.aria === "disabled" && e.setAttribute("aria-disabled", String(u));
        }
        l.aria === "pressed" && e.setAttribute("aria-pressed", String(!d.isInteractive));
      }), s(() => {
        e.removeEventListener("click", h);
      });
    }
  );
}
function qg(t, e) {
  if (t !== "node" && t !== "row") return null;
  const n = e.includes("clear");
  return { type: t, isClear: n };
}
const mo = /* @__PURE__ */ new WeakMap();
function Wg(t) {
  t.directive(
    "flow-filter",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = qg(n, i);
      if (!l) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      let h = null;
      const u = () => {
        if (l.isClear) {
          if (l.type === "node")
            d.clearNodeFilter(), mo.set(c, null);
          else
            for (const f of d.nodes)
              f.rowFilter && f.rowFilter !== "all" && d.setRowFilter(f.id, "all");
          return;
        }
        if (l.type === "node" && o)
          h = r(`[${o}]`)[0], d.setNodeFilter(h), mo.set(c, h);
        else if (l.type === "row" && o) {
          const f = r(o);
          d.setRowFilter(f.node, f.predicate);
        }
      };
      e.addEventListener("click", u), e.style.cursor = "pointer", l.type === "node" && !l.isClear && s(() => {
        d.nodes.length;
        const f = mo.get(c) === h && h !== null;
        e.classList.toggle("flow-filter-active", f), e.setAttribute("aria-pressed", String(f));
      }), a(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function jg(t) {
  if (typeof t == "string")
    return { target: t };
  if (t && typeof t == "object" && "target" in t) {
    const e = t;
    return {
      target: e.target,
      zoom: typeof e.zoom == "number" ? e.zoom : void 0,
      speed: typeof e.speed == "number" ? e.speed : void 0
    };
  }
  return null;
}
function Ug(t) {
  t.directive(
    "flow-follow",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("toggle"), l = e.closest("[data-flow-canvas]");
      if (!l) return;
      const c = t.$data(l);
      if (!c?.follow) return;
      let d = null;
      const h = (f) => {
        e.classList.toggle("flow-following", f), e.setAttribute("aria-pressed", String(f));
      }, u = () => {
        if (!n) return;
        const f = i(n), g = jg(f);
        if (!g) return;
        if (a && d) {
          d.stop(), d = null, h(!1);
          return;
        }
        d && d.stop();
        const p = {};
        g.zoom !== void 0 && (p.zoom = g.zoom), g.speed !== void 0 && (p.speed = g.speed), d = c.follow(g.target, p), h(!0), d?.finished && d.finished.then(() => {
          d = null, h(!1);
        });
      };
      e.addEventListener("click", u), s(() => {
        e.removeEventListener("click", u), d && (d.stop(), d = null);
      });
    }
  );
}
function Zg(t, e) {
  return t !== "save" && t !== "restore" ? null : { action: t, persist: e.includes("persist") };
}
const ii = /* @__PURE__ */ new Map();
function Kg(t, e) {
  ii.set(t, e);
}
function Gg(t) {
  return ii.get(t) ?? null;
}
function Jg(t) {
  return ii.has(t);
}
function yo(t) {
  return `alpineflow-snapshot-${t}`;
}
function Qg(t) {
  t.directive(
    "flow-snapshot",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = Zg(n, i);
      if (!l) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      const h = () => {
        if (!o) return;
        const u = r(o);
        if (u)
          if (l.action === "save") {
            const f = d.toObject();
            l.persist ? localStorage.setItem(yo(u), JSON.stringify(f)) : Kg(u, f);
          } else {
            let f = null;
            if (l.persist) {
              const g = localStorage.getItem(yo(u));
              if (g)
                try {
                  f = JSON.parse(g);
                } catch {
                }
            } else
              f = Gg(u);
            f && d.fromObject(f);
          }
      };
      e.addEventListener("click", h), l.action === "restore" && s(() => {
        if (!o) return;
        const u = r(o);
        if (!u) return;
        let f;
        l.persist ? f = localStorage.getItem(yo(u)) !== null : (d.nodes.length, f = Jg(u)), e.disabled = !f, e.setAttribute("aria-disabled", String(!f));
      }), a(() => {
        e.removeEventListener("click", h);
      });
    }
  );
}
function ep(t) {
  const e = document.createElement("div");
  e.className = "flow-loading-indicator";
  const n = document.createElement("div");
  n.className = "flow-loading-indicator-node";
  const o = document.createElement("div");
  return o.className = "flow-loading-indicator-text", o.textContent = t ?? "Loading…", e.appendChild(n), e.appendChild(o), e;
}
function tp(t) {
  t.directive(
    "flow-loading",
    (e, { modifiers: n }, { effect: o, cleanup: i }) => {
      const r = e.closest("[data-flow-canvas]");
      if (!r) return;
      const s = t.$data(r);
      if (!s) return;
      e.classList.add("flow-loading-overlay"), e.childElementCount > 0 || e.textContent.trim().length > 0 || e.appendChild(ep(s._loadingText));
      const l = n.includes("fade");
      l && e.classList.add("flow-loading-fade"), r.setAttribute("data-flow-loading-directive", "");
      let c = null;
      o(() => {
        if (s.isLoading)
          e.style.display = "flex", l && (e.classList.remove("flow-loading-fade-out"), c && (e.removeEventListener("transitionend", c), c = null));
        else if (l) {
          c && e.removeEventListener("transitionend", c), e.classList.add("flow-loading-fade-out");
          const h = () => {
            e.style.display = "none", e.removeEventListener("transitionend", h), c = null;
          };
          c = h, e.addEventListener("transitionend", h);
        } else
          e.style.display = "none";
      }), i(() => {
        c && (e.removeEventListener("transitionend", c), c = null), r.removeAttribute("data-flow-loading-directive"), e.style.display = "", e.classList.remove("flow-loading-overlay", "flow-loading-fade", "flow-loading-fade-out");
      });
    }
  );
}
function np(t) {
  t.directive(
    "flow-edge-toolbar",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = e.closest("[data-flow-edge-id]");
      if (!a) return;
      const l = a.dataset.flowEdgeId, c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      const h = c.querySelector(".flow-viewport");
      if (!h) return;
      try {
        const w = i("edge");
        w && t.addScopeToNode(e, { edge: w });
      } catch {
      }
      h.appendChild(e), e.classList.add("flow-edge-toolbar"), e.style.position = "absolute";
      const u = (w) => {
        w.stopPropagation();
      }, f = (w) => {
        w.stopPropagation();
      };
      e.addEventListener("pointerdown", u), e.addEventListener("click", f);
      const g = o.includes("below"), p = 20;
      r(() => {
        if (!d.edges.some((P) => P.id === l)) {
          e.removeEventListener("pointerdown", u), e.removeEventListener("click", f), e.classList.remove("flow-edge-toolbar"), e.remove();
          return;
        }
        const w = d.viewport?.zoom || 1, m = parseInt(e.getAttribute("data-flow-offset") ?? String(p), 10);
        let C = 0.5;
        if (n) {
          const P = i(n);
          typeof P == "number" && (C = P);
        }
        const S = a.querySelectorAll("path"), b = S.length > 1 ? S[1] : S[0];
        if (!b) return;
        const D = b.getTotalLength?.();
        if (!D) return;
        const M = b.getPointAtLength(D * Math.max(0, Math.min(1, C))), T = m / w, v = g ? T : -T;
        e.style.left = `${M.x}px`, e.style.top = `${M.y + v}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / w}) translate(-50%, ${g ? "0%" : "-100%"})`;
      }), s(() => {
        e.removeEventListener("pointerdown", u), e.removeEventListener("click", f), e.classList.remove("flow-edge-toolbar"), e.remove();
      });
    }
  );
}
function op(t) {
  t.magic("flow", (e) => {
    const n = e.closest("[data-flow-canvas]");
    return n ? t.$data(n) : (console.warn("[alpinejs-flow] $flow used outside of a flowCanvas context"), {});
  });
}
function ip(t) {
  t.store("flow", {
    instances: {},
    activeId: null,
    register(e, n) {
      this.instances[e] = n;
    },
    unregister(e) {
      this.activeId === e && (this.activeId = null), delete this.instances[e];
    },
    get(e) {
      return this.instances[e] ?? null;
    },
    activate(e) {
      if (this.activeId === e) return;
      if (this.activeId) {
        const o = this.instances[this.activeId];
        o && (o._active = !1, o._container?.classList.remove("flow-canvas-active"));
      }
      this.activeId = e;
      const n = this.instances[e];
      n && (n._active = !0, n._container?.classList.add("flow-canvas-active"));
    }
  });
}
function hm(t, e, n) {
  const o = n?.defaultDimensions?.width ?? ye, i = n?.defaultDimensions?.height ?? we, r = n?.padding ?? 20, s = n?.flowId ?? "ssr", l = t.filter((m) => !m.hidden).map((m) => ({
    ...m,
    dimensions: {
      width: m.dimensions?.width ?? o,
      height: m.dimensions?.height ?? i
    }
  })), c = /* @__PURE__ */ new Map();
  for (const m of l)
    c.set(m.id, m);
  const d = l.map((m) => ({
    id: m.id,
    x: m.position.x,
    y: m.position.y,
    width: m.dimensions.width,
    height: m.dimensions.height,
    ...m.class ? { class: m.class } : {},
    ...m.style ? {
      style: typeof m.style == "string" ? m.style : Object.entries(m.style).map(([C, S]) => `${C}:${S}`).join(";")
    } : {},
    data: m.data ?? {}
  })), h = e.filter((m) => !m.hidden), u = [], f = /* @__PURE__ */ new Map();
  for (const m of h) {
    const C = c.get(m.source), S = c.get(m.target);
    if (!C || !S)
      continue;
    let b, D;
    try {
      const $ = Wn(
        m,
        C,
        S,
        C.sourcePosition ?? "bottom",
        S.targetPosition ?? "top"
      );
      b = $.path, D = $.labelPosition;
    } catch {
      continue;
    }
    let M, T;
    if (m.markerStart) {
      const $ = on(m.markerStart), x = sn($, s);
      f.has(x) || f.set(x, Vn($, x)), M = `url(#${x})`;
    }
    if (m.markerEnd) {
      const $ = on(m.markerEnd), x = sn($, s);
      f.has(x) || f.set(x, Vn($, x)), T = `url(#${x})`;
    }
    let v, P;
    if (m.label)
      if (D)
        v = D.x, P = D.y;
      else {
        const $ = C.position.x + C.dimensions.width / 2, x = C.position.y + C.dimensions.height / 2, y = S.position.x + S.dimensions.width / 2, q = S.position.y + S.dimensions.height / 2;
        v = ($ + y) / 2, P = (x + q) / 2;
      }
    u.push({
      id: m.id,
      source: m.source,
      target: m.target,
      pathD: b,
      ...M ? { markerStart: M } : {},
      ...T ? { markerEnd: T } : {},
      ...m.class ? { class: m.class } : {},
      ...m.label ? { label: m.label } : {},
      ...v !== void 0 ? { labelX: v } : {},
      ...P !== void 0 ? { labelY: P } : {}
    });
  }
  const g = Array.from(f.values()).join(`
`);
  let p, w;
  if (l.length === 0)
    p = { x: 0, y: 0, width: 0, height: 0 }, w = { x: 0, y: 0, zoom: 1 };
  else {
    const m = Nt(l);
    p = {
      x: m.x - r,
      y: m.y - r,
      width: m.width + r * 2,
      height: m.height + r * 2
    }, w = {
      x: -p.x,
      y: -p.y,
      zoom: 1
    };
  }
  return {
    nodes: d,
    edges: u,
    markers: g,
    viewBox: p,
    viewport: w
  };
}
const ls = /* @__PURE__ */ new WeakSet();
function gm(t) {
  ls.has(t) || (ls.add(t), Br(t), ip(t), Vh(t), Qh(t), Bu(t), Iu(t), Du(t), Ru(t), Rh(t), og(t), ag(t), lg(t), dg(t), ug(t), Eg(t), Cg(t), kg(t), Mg(t), Ng(t), $g(t), Ig(t), Dg(t), Rg(t), Vg(t), Yg(t), Wg(t), Ug(t), Qg(t), tp(t), np(t), op(t));
}
function sp(t) {
  return t.replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, "").replace(/\s+externalResourcesRequired="[^"]*"/g, "");
}
function rp(t, e, n, o) {
  return new Promise((i, r) => {
    const s = new Image();
    s.onload = () => {
      const a = document.createElement("canvas");
      a.width = e, a.height = n;
      const l = a.getContext("2d");
      l.fillStyle = o, l.fillRect(0, 0, e, n), l.drawImage(s, 0, 0), i(a.toDataURL("image/png"));
    }, s.onerror = () => {
      r(new Error("Failed to render SVG to image"));
    }, s.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(t);
  });
}
async function ap(t, e, n, o, i = {}) {
  let r;
  try {
    ({ toSvg: r } = await Promise.resolve().then(() => im));
  } catch {
    throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
  }
  const s = i.scope ?? "all", a = t.getBoundingClientRect(), l = s === "viewport" ? a.width : i.width ?? 1920, c = s === "viewport" ? a.height : i.height ?? 1080, d = i.background ?? (getComputedStyle(t).getPropertyValue("--flow-bg-color").trim() || "#ffffff"), h = e.style.transform, u = e.style.width, f = e.style.height, g = t.style.width, p = t.style.height, w = t.style.overflow, m = [];
  try {
    if (s === "all") {
      const $ = t.querySelectorAll("[data-flow-culled]");
      for (const L of $)
        L.style.display = "", m.push(L);
      const x = n.filter((L) => !L.hidden), y = Nt(x), q = i.padding ?? 0.1, _ = Fn(
        y,
        l,
        c,
        0.1,
        // minZoom
        2,
        // maxZoom
        q
      );
      e.style.transform = `translate(${_.x}px, ${_.y}px) scale(${_.zoom})`, e.style.width = `${l}px`, e.style.height = `${c}px`;
    }
    t.style.width = `${l}px`, t.style.height = `${c}px`, t.style.overflow = "hidden", await new Promise(($) => requestAnimationFrame($));
    const C = i.includeOverlays, S = C === !0, b = typeof C == "object" ? C : {}, D = [
      ["canvas-overlay", S || (b.toolbar ?? !1)],
      ["flow-minimap", S || (b.minimap ?? !1)],
      ["flow-controls", S || (b.controls ?? !1)],
      ["flow-panel", S || (b.panels ?? !1)],
      ["flow-selection-box", !1]
    ], M = await r(t, {
      width: l,
      height: c,
      skipFonts: !0,
      filter: ($) => {
        if ($.classList) {
          for (const [x, y] of D)
            if ($.classList.contains(x) && !y) return !1;
        }
        return !0;
      }
    }), v = sp(decodeURIComponent(M.substring("data:image/svg+xml;charset=utf-8,".length))), P = await rp(v, l, c, d);
    if (i.filename) {
      const $ = document.createElement("a");
      $.download = i.filename, $.href = P, $.click();
    }
    return P;
  } finally {
    e.style.transform = h, e.style.width = u, e.style.height = f, t.style.width = g, t.style.height = p, t.style.overflow = w;
    for (const C of m)
      C.style.display = "none";
  }
}
const lp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  captureFlowImage: ap
}, Symbol.toStringTag, { value: "Module" }));
function cp(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), i = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(i), e && (o.href = e), i.href = t, i.href;
}
const dp = /* @__PURE__ */ (() => {
  let t = 0;
  const e = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (t += 1, `u${e()}${t}`);
})();
function lt(t) {
  const e = [];
  for (let n = 0, o = t.length; n < o; n++)
    e.push(t[n]);
  return e;
}
let bt = null;
function Ar(t = {}) {
  return bt || (t.includeStyleProperties ? (bt = t.includeStyleProperties, bt) : (bt = lt(window.getComputedStyle(document.documentElement)), bt));
}
function Un(t, e) {
  const o = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function up(t) {
  const e = Un(t, "border-left-width"), n = Un(t, "border-right-width");
  return t.clientWidth + e + n;
}
function fp(t) {
  const e = Un(t, "border-top-width"), n = Un(t, "border-bottom-width");
  return t.clientHeight + e + n;
}
function si(t, e = {}) {
  const n = e.width || up(t), o = e.height || fp(t);
  return { width: n, height: o };
}
function hp() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const n = e && e.env ? e.env.devicePixelRatio : null;
  return n && (t = parseInt(n, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const Me = 16384;
function gp(t) {
  (t.width > Me || t.height > Me) && (t.width > Me && t.height > Me ? t.width > t.height ? (t.height *= Me / t.width, t.width = Me) : (t.width *= Me / t.height, t.height = Me) : t.width > Me ? (t.height *= Me / t.width, t.width = Me) : (t.width *= Me / t.height, t.height = Me));
}
function pp(t, e = {}) {
  return t.toBlob ? new Promise((n) => {
    t.toBlob(n, e.type ? e.type : "image/png", e.quality ? e.quality : 1);
  }) : new Promise((n) => {
    const o = window.atob(t.toDataURL(e.type ? e.type : void 0, e.quality ? e.quality : void 0).split(",")[1]), i = o.length, r = new Uint8Array(i);
    for (let s = 0; s < i; s += 1)
      r[s] = o.charCodeAt(s);
    n(new Blob([r], {
      type: e.type ? e.type : "image/png"
    }));
  });
}
function Zn(t) {
  return new Promise((e, n) => {
    const o = new Image();
    o.onload = () => {
      o.decode().then(() => {
        requestAnimationFrame(() => e(o));
      });
    }, o.onerror = n, o.crossOrigin = "anonymous", o.decoding = "async", o.src = t;
  });
}
async function mp(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function yp(t, e, n) {
  const o = "http://www.w3.org/2000/svg", i = document.createElementNS(o, "svg"), r = document.createElementNS(o, "foreignObject");
  return i.setAttribute("width", `${e}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${e} ${n}`), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("externalResourcesRequired", "true"), i.appendChild(r), r.appendChild(t), mp(i);
}
const ke = (t, e) => {
  if (t instanceof e)
    return !0;
  const n = Object.getPrototypeOf(t);
  return n === null ? !1 : n.constructor.name === e.name || ke(n, e);
};
function wp(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function vp(t, e) {
  return Ar(e).map((n) => {
    const o = t.getPropertyValue(n), i = t.getPropertyPriority(n);
    return `${n}: ${o}${i ? " !important" : ""};`;
  }).join(" ");
}
function _p(t, e, n, o) {
  const i = `.${t}:${e}`, r = n.cssText ? wp(n) : vp(n, o);
  return document.createTextNode(`${i}{${r}}`);
}
function cs(t, e, n, o) {
  const i = window.getComputedStyle(t, n), r = i.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const s = dp();
  try {
    e.className = `${e.className} ${s}`;
  } catch {
    return;
  }
  const a = document.createElement("style");
  a.appendChild(_p(s, n, i, o)), e.appendChild(a);
}
function bp(t, e, n) {
  cs(t, e, ":before", n), cs(t, e, ":after", n);
}
const ds = "application/font-woff", us = "image/jpeg", xp = {
  woff: ds,
  woff2: ds,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: us,
  jpeg: us,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function Ep(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function ri(t) {
  const e = Ep(t).toLowerCase();
  return xp[e] || "";
}
function Cp(t) {
  return t.split(/,/)[1];
}
function Fo(t) {
  return t.search(/^(data:)/) !== -1;
}
function Sp(t, e) {
  return `data:${e};base64,${t}`;
}
async function Nr(t, e, n) {
  const o = await fetch(t, e);
  if (o.status === 404)
    throw new Error(`Resource "${o.url}" not found`);
  const i = await o.blob();
  return new Promise((r, s) => {
    const a = new FileReader();
    a.onerror = s, a.onloadend = () => {
      try {
        r(n({ res: o, result: a.result }));
      } catch (l) {
        s(l);
      }
    }, a.readAsDataURL(i);
  });
}
const wo = {};
function Pp(t, e, n) {
  let o = t.replace(/\?.*/, "");
  return n && (o = t), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), e ? `[${e}]${o}` : o;
}
async function ai(t, e, n) {
  const o = Pp(t, e, n.includeQueryParams);
  if (wo[o] != null)
    return wo[o];
  n.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let i;
  try {
    const r = await Nr(t, n.fetchRequestInit, ({ res: s, result: a }) => (e || (e = s.headers.get("Content-Type") || ""), Cp(a)));
    i = Sp(r, e);
  } catch (r) {
    i = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${t}`;
    r && (s = typeof r == "string" ? r : r.message), s && console.warn(s);
  }
  return wo[o] = i, i;
}
async function kp(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : Zn(e);
}
async function Lp(t, e) {
  if (t.currentSrc) {
    const r = document.createElement("canvas"), s = r.getContext("2d");
    r.width = t.clientWidth, r.height = t.clientHeight, s?.drawImage(t, 0, 0, r.width, r.height);
    const a = r.toDataURL();
    return Zn(a);
  }
  const n = t.poster, o = ri(n), i = await ai(n, o, e);
  return Zn(i);
}
async function Mp(t, e) {
  var n;
  try {
    if (!((n = t?.contentDocument) === null || n === void 0) && n.body)
      return await to(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function Tp(t, e) {
  return ke(t, HTMLCanvasElement) ? kp(t) : ke(t, HTMLVideoElement) ? Lp(t, e) : ke(t, HTMLIFrameElement) ? Mp(t, e) : t.cloneNode($r(t));
}
const Ap = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", $r = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function Np(t, e, n) {
  var o, i;
  if ($r(e))
    return e;
  let r = [];
  return Ap(t) && t.assignedNodes ? r = lt(t.assignedNodes()) : ke(t, HTMLIFrameElement) && (!((o = t.contentDocument) === null || o === void 0) && o.body) ? r = lt(t.contentDocument.body.childNodes) : r = lt(((i = t.shadowRoot) !== null && i !== void 0 ? i : t).childNodes), r.length === 0 || ke(t, HTMLVideoElement) || await r.reduce((s, a) => s.then(() => to(a, n)).then((l) => {
    l && e.appendChild(l);
  }), Promise.resolve()), e;
}
function $p(t, e, n) {
  const o = e.style;
  if (!o)
    return;
  const i = window.getComputedStyle(t);
  i.cssText ? (o.cssText = i.cssText, o.transformOrigin = i.transformOrigin) : Ar(n).forEach((r) => {
    let s = i.getPropertyValue(r);
    r === "font-size" && s.endsWith("px") && (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`), ke(t, HTMLIFrameElement) && r === "display" && s === "inline" && (s = "block"), r === "d" && e.getAttribute("d") && (s = `path(${e.getAttribute("d")})`), o.setProperty(r, s, i.getPropertyPriority(r));
  });
}
function Ip(t, e) {
  ke(t, HTMLTextAreaElement) && (e.innerHTML = t.value), ke(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function Dp(t, e) {
  if (ke(t, HTMLSelectElement)) {
    const o = Array.from(e.children).find((i) => t.value === i.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function Rp(t, e, n) {
  return ke(e, Element) && ($p(t, e, n), bp(t, e, n), Ip(t, e), Dp(t, e)), e;
}
async function Hp(t, e) {
  const n = t.querySelectorAll ? t.querySelectorAll("use") : [];
  if (n.length === 0)
    return t;
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const a = n[r].getAttribute("xlink:href");
    if (a) {
      const l = t.querySelector(a), c = document.querySelector(a);
      !l && c && !o[a] && (o[a] = await to(c, e, !0));
    }
  }
  const i = Object.values(o);
  if (i.length) {
    const r = "http://www.w3.org/1999/xhtml", s = document.createElementNS(r, "svg");
    s.setAttribute("xmlns", r), s.style.position = "absolute", s.style.width = "0", s.style.height = "0", s.style.overflow = "hidden", s.style.display = "none";
    const a = document.createElementNS(r, "defs");
    s.appendChild(a);
    for (let l = 0; l < i.length; l++)
      a.appendChild(i[l]);
    t.appendChild(s);
  }
  return t;
}
async function to(t, e, n) {
  return !n && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((o) => Tp(o, e)).then((o) => Np(t, o, e)).then((o) => Rp(t, o, e)).then((o) => Hp(o, e));
}
const Ir = /url\((['"]?)([^'"]+?)\1\)/g, Fp = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, zp = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function Op(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function Vp(t) {
  const e = [];
  return t.replace(Ir, (n, o, i) => (e.push(i), n)), e.filter((n) => !Fo(n));
}
async function Bp(t, e, n, o, i) {
  try {
    const r = n ? cp(e, n) : e, s = ri(e);
    let a;
    return i || (a = await ai(r, s, o)), t.replace(Op(e), `$1${a}$3`);
  } catch {
  }
  return t;
}
function Xp(t, { preferredFontFormat: e }) {
  return e ? t.replace(zp, (n) => {
    for (; ; ) {
      const [o, , i] = Fp.exec(n) || [];
      if (!i)
        return "";
      if (i === e)
        return `src: ${o};`;
    }
  }) : t;
}
function Dr(t) {
  return t.search(Ir) !== -1;
}
async function Rr(t, e, n) {
  if (!Dr(t))
    return t;
  const o = Xp(t, n);
  return Vp(o).reduce((r, s) => r.then((a) => Bp(a, s, e, n)), Promise.resolve(o));
}
async function xt(t, e, n) {
  var o;
  const i = (o = e.style) === null || o === void 0 ? void 0 : o.getPropertyValue(t);
  if (i) {
    const r = await Rr(i, null, n);
    return e.style.setProperty(t, r, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function Yp(t, e) {
  await xt("background", t, e) || await xt("background-image", t, e), await xt("mask", t, e) || await xt("-webkit-mask", t, e) || await xt("mask-image", t, e) || await xt("-webkit-mask-image", t, e);
}
async function qp(t, e) {
  const n = ke(t, HTMLImageElement);
  if (!(n && !Fo(t.src)) && !(ke(t, SVGImageElement) && !Fo(t.href.baseVal)))
    return;
  const o = n ? t.src : t.href.baseVal, i = await ai(o, ri(o), e);
  await new Promise((r, s) => {
    t.onload = r, t.onerror = e.onImageErrorHandler ? (...l) => {
      try {
        r(e.onImageErrorHandler(...l));
      } catch (c) {
        s(c);
      }
    } : s;
    const a = t;
    a.decode && (a.decode = r), a.loading === "lazy" && (a.loading = "eager"), n ? (t.srcset = "", t.src = i) : t.href.baseVal = i;
  });
}
async function Wp(t, e) {
  const o = lt(t.childNodes).map((i) => Hr(i, e));
  await Promise.all(o).then(() => t);
}
async function Hr(t, e) {
  ke(t, Element) && (await Yp(t, e), await qp(t, e), await Wp(t, e));
}
function jp(t, e) {
  const { style: n } = t;
  e.backgroundColor && (n.backgroundColor = e.backgroundColor), e.width && (n.width = `${e.width}px`), e.height && (n.height = `${e.height}px`);
  const o = e.style;
  return o != null && Object.keys(o).forEach((i) => {
    n[i] = o[i];
  }), t;
}
const fs = {};
async function hs(t) {
  let e = fs[t];
  if (e != null)
    return e;
  const o = await (await fetch(t)).text();
  return e = { url: t, cssText: o }, fs[t] = e, e;
}
async function gs(t, e) {
  let n = t.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, r = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let a = s.replace(o, "$1");
    return a.startsWith("https://") || (a = new URL(a, t.url).href), Nr(a, e.fetchRequestInit, ({ result: l }) => (n = n.replace(s, `url(${l})`), [s, l]));
  });
  return Promise.all(r).then(() => n);
}
function ps(t) {
  if (t == null)
    return [];
  const e = [], n = /(\/\*[\s\S]*?\*\/)/gi;
  let o = t.replace(n, "");
  const i = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
  for (; ; ) {
    const l = i.exec(o);
    if (l === null)
      break;
    e.push(l[0]);
  }
  o = o.replace(i, "");
  const r = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi, s = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})", a = new RegExp(s, "gi");
  for (; ; ) {
    let l = r.exec(o);
    if (l === null) {
      if (l = a.exec(o), l === null)
        break;
      r.lastIndex = a.lastIndex;
    } else
      a.lastIndex = r.lastIndex;
    e.push(l[0]);
  }
  return e;
}
async function Up(t, e) {
  const n = [], o = [];
  return t.forEach((i) => {
    if ("cssRules" in i)
      try {
        lt(i.cssRules || []).forEach((r, s) => {
          if (r.type === CSSRule.IMPORT_RULE) {
            let a = s + 1;
            const l = r.href, c = hs(l).then((d) => gs(d, e)).then((d) => ps(d).forEach((h) => {
              try {
                i.insertRule(h, h.startsWith("@import") ? a += 1 : i.cssRules.length);
              } catch (u) {
                console.error("Error inserting rule from remote css", {
                  rule: h,
                  error: u
                });
              }
            })).catch((d) => {
              console.error("Error loading remote css", d.toString());
            });
            o.push(c);
          }
        });
      } catch (r) {
        const s = t.find((a) => a.href == null) || document.styleSheets[0];
        i.href != null && o.push(hs(i.href).then((a) => gs(a, e)).then((a) => ps(a).forEach((l) => {
          s.insertRule(l, s.cssRules.length);
        })).catch((a) => {
          console.error("Error loading remote stylesheet", a);
        })), console.error("Error inlining remote css file", r);
      }
  }), Promise.all(o).then(() => (t.forEach((i) => {
    if ("cssRules" in i)
      try {
        lt(i.cssRules || []).forEach((r) => {
          n.push(r);
        });
      } catch (r) {
        console.error(`Error while reading CSS rules from ${i.href}`, r);
      }
  }), n));
}
function Zp(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => Dr(e.style.getPropertyValue("src")));
}
async function Kp(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = lt(t.ownerDocument.styleSheets), o = await Up(n, e);
  return Zp(o);
}
function Fr(t) {
  return t.trim().replace(/["']/g, "");
}
function Gp(t) {
  const e = /* @__PURE__ */ new Set();
  function n(o) {
    (o.style.fontFamily || getComputedStyle(o).fontFamily).split(",").forEach((r) => {
      e.add(Fr(r));
    }), Array.from(o.children).forEach((r) => {
      r instanceof HTMLElement && n(r);
    });
  }
  return n(t), e;
}
async function zr(t, e) {
  const n = await Kp(t, e), o = Gp(t);
  return (await Promise.all(n.filter((r) => o.has(Fr(r.style.fontFamily))).map((r) => {
    const s = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return Rr(r.cssText, s, e);
  }))).join(`
`);
}
async function Jp(t, e) {
  const n = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await zr(t, e);
  if (n) {
    const o = document.createElement("style"), i = document.createTextNode(n);
    o.appendChild(i), t.firstChild ? t.insertBefore(o, t.firstChild) : t.appendChild(o);
  }
}
async function Or(t, e = {}) {
  const { width: n, height: o } = si(t, e), i = await to(t, e, !0);
  return await Jp(i, e), await Hr(i, e), jp(i, e), await yp(i, n, o);
}
async function fn(t, e = {}) {
  const { width: n, height: o } = si(t, e), i = await Or(t, e), r = await Zn(i), s = document.createElement("canvas"), a = s.getContext("2d"), l = e.pixelRatio || hp(), c = e.canvasWidth || n, d = e.canvasHeight || o;
  return s.width = c * l, s.height = d * l, e.skipAutoScale || gp(s), s.style.width = `${c}`, s.style.height = `${d}`, e.backgroundColor && (a.fillStyle = e.backgroundColor, a.fillRect(0, 0, s.width, s.height)), a.drawImage(r, 0, 0, s.width, s.height), s;
}
async function Qp(t, e = {}) {
  const { width: n, height: o } = si(t, e);
  return (await fn(t, e)).getContext("2d").getImageData(0, 0, n, o).data;
}
async function em(t, e = {}) {
  return (await fn(t, e)).toDataURL();
}
async function tm(t, e = {}) {
  return (await fn(t, e)).toDataURL("image/jpeg", e.quality || 1);
}
async function nm(t, e = {}) {
  const n = await fn(t, e);
  return await pp(n);
}
async function om(t, e = {}) {
  return zr(t, e);
}
const im = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontEmbedCSS: om,
  toBlob: nm,
  toCanvas: fn,
  toJpeg: tm,
  toPixelData: Qp,
  toPng: em,
  toSvg: Or
}, Symbol.toStringTag, { value: "Module" }));
export {
  sf as ComputeEngine,
  su as FlowHistory,
  Bi as SHORTCUT_DEFAULTS,
  lm as along,
  Nu as areNodesConnected,
  lr as buildNodeMap,
  dr as clampToExtent,
  lo as clampToParent,
  hm as computeRenderPlan,
  Wi as computeValidationErrors,
  cr as computeZIndex,
  gm as default,
  dm as drift,
  qu as expandParentToFitChild,
  $o as getAbsolutePosition,
  Vu as getAutoPanDelta,
  Bn as getBezierPath,
  Mu as getConnectedEdges,
  st as getDescendantIds,
  ns as getEdgePosition,
  Cr as getFloatingEdgeParams,
  Tu as getIncomers,
  ts as getNodeIntersection,
  Nt as getNodesBounds,
  Lu as getNodesFullyInPolygon,
  eu as getNodesFullyInRect,
  ku as getNodesInPolygon,
  Qd as getNodesInRect,
  Ao as getOutgoers,
  sm as getSimpleBezierPath,
  fm as getSimpleFloatingPosition,
  an as getSmoothStepPath,
  Ou as getStepPath,
  rr as getStraightPath,
  Fn as getViewportForBounds,
  nt as isConnectable,
  Hu as isDeletable,
  sr as isDraggable,
  Oi as isResizable,
  No as isSelectable,
  He as matchesKey,
  it as matchesModifier,
  rm as orbit,
  cm as pendulum,
  Go as pointInPolygon,
  Pu as polygonIntersectsAABB,
  gu as registerMarker,
  Zt as resolveChildValidation,
  Xu as resolveShortcuts,
  rt as sortNodesTopological,
  um as stagger,
  Lt as toAbsoluteNode,
  Yn as toAbsoluteNodes,
  hr as validateChildAdd,
  qn as validateChildRemove,
  am as wave
};
//# sourceMappingURL=alpineflow.bundle.esm.js.map
