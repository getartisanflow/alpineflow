let $o = null;
function va(t) {
  $o = t;
}
function Se() {
  if (!$o)
    throw new Error("[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.");
  return $o;
}
var _a = { value: () => {
} };
function co() {
  for (var t = 0, e = arguments.length, n = {}, o; t < e; ++t) {
    if (!(o = arguments[t] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new $n(n);
}
function $n(t) {
  this._ = t;
}
function ba(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
$n.prototype = co.prototype = {
  constructor: $n,
  on: function(t, e) {
    var n = this._, o = ba(t + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (t = o[r]).type) && (i = xa(n[i], t.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++r < s; )
      if (i = (t = o[r]).type) n[i] = Li(n[i], t.name, e);
      else if (e == null) for (i in n) n[i] = Li(n[i], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new $n(t);
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
function xa(t, e) {
  for (var n = 0, o = t.length, i; n < o; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function Li(t, e, n) {
  for (var o = 0, i = t.length; o < i; ++o)
    if (t[o].name === e) {
      t[o] = _a, t = t.slice(0, o).concat(t.slice(o + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var Io = "http://www.w3.org/1999/xhtml";
const Pi = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Io,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function uo(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Pi.hasOwnProperty(e) ? { space: Pi[e], local: t } : t;
}
function Ea(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === Io && e.documentElement.namespaceURI === Io ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Ca(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function qs(t) {
  var e = uo(t);
  return (e.local ? Ca : Ea)(e);
}
function Sa() {
}
function oi(t) {
  return t == null ? Sa : function() {
    return this.querySelector(t);
  };
}
function ka(t) {
  typeof t != "function" && (t = oi(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = new Array(s), a, c, d = 0; d < s; ++d)
      (a = r[d]) && (c = t.call(a, a.__data__, d, r)) && ("__data__" in a && (c.__data__ = a.__data__), l[d] = c);
  return new Fe(o, this._parents);
}
function La(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Pa() {
  return [];
}
function Xs(t) {
  return t == null ? Pa : function() {
    return this.querySelectorAll(t);
  };
}
function Ma(t) {
  return function() {
    return La(t.apply(this, arguments));
  };
}
function Ta(t) {
  typeof t == "function" ? t = Ma(t) : t = Xs(t);
  for (var e = this._groups, n = e.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = e[r], l = s.length, a, c = 0; c < l; ++c)
      (a = s[c]) && (o.push(t.call(a, a.__data__, c, s)), i.push(a));
  return new Fe(o, i);
}
function Ys(t) {
  return function() {
    return this.matches(t);
  };
}
function Ws(t) {
  return function(e) {
    return e.matches(t);
  };
}
var Aa = Array.prototype.find;
function Na(t) {
  return function() {
    return Aa.call(this.children, t);
  };
}
function $a() {
  return this.firstElementChild;
}
function Ia(t) {
  return this.select(t == null ? $a : Na(typeof t == "function" ? t : Ws(t)));
}
var Da = Array.prototype.filter;
function Ra() {
  return Array.from(this.children);
}
function Fa(t) {
  return function() {
    return Da.call(this.children, t);
  };
}
function Ha(t) {
  return this.selectAll(t == null ? Ra : Fa(typeof t == "function" ? t : Ws(t)));
}
function Oa(t) {
  typeof t != "function" && (t = Ys(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = [], a, c = 0; c < s; ++c)
      (a = r[c]) && t.call(a, a.__data__, c, r) && l.push(a);
  return new Fe(o, this._parents);
}
function js(t) {
  return new Array(t.length);
}
function za() {
  return new Fe(this._enter || this._groups.map(js), this._parents);
}
function On(t, e) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = e;
}
On.prototype = {
  constructor: On,
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
function Va(t) {
  return function() {
    return t;
  };
}
function Ba(t, e, n, o, i, r) {
  for (var s = 0, l, a = e.length, c = r.length; s < c; ++s)
    (l = e[s]) ? (l.__data__ = r[s], o[s] = l) : n[s] = new On(t, r[s]);
  for (; s < a; ++s)
    (l = e[s]) && (i[s] = l);
}
function qa(t, e, n, o, i, r, s) {
  var l, a, c = /* @__PURE__ */ new Map(), d = e.length, u = r.length, f = new Array(d), h;
  for (l = 0; l < d; ++l)
    (a = e[l]) && (f[l] = h = s.call(a, a.__data__, l, e) + "", c.has(h) ? i[l] = a : c.set(h, a));
  for (l = 0; l < u; ++l)
    h = s.call(t, r[l], l, r) + "", (a = c.get(h)) ? (o[l] = a, a.__data__ = r[l], c.delete(h)) : n[l] = new On(t, r[l]);
  for (l = 0; l < d; ++l)
    (a = e[l]) && c.get(f[l]) === a && (i[l] = a);
}
function Xa(t) {
  return t.__data__;
}
function Ya(t, e) {
  if (!arguments.length) return Array.from(this, Xa);
  var n = e ? qa : Ba, o = this._parents, i = this._groups;
  typeof t != "function" && (t = Va(t));
  for (var r = i.length, s = new Array(r), l = new Array(r), a = new Array(r), c = 0; c < r; ++c) {
    var d = o[c], u = i[c], f = u.length, h = Wa(t.call(d, d && d.__data__, c, o)), g = h.length, p = l[c] = new Array(g), y = s[c] = new Array(g), m = a[c] = new Array(f);
    n(d, u, p, y, m, h, e);
    for (var x = 0, M = 0, v, C; x < g; ++x)
      if (v = p[x]) {
        for (x >= M && (M = x + 1); !(C = y[M]) && ++M < g; ) ;
        v._next = C || null;
      }
  }
  return s = new Fe(s, o), s._enter = l, s._exit = a, s;
}
function Wa(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function ja() {
  return new Fe(this._exit || this._groups.map(js), this._parents);
}
function Ua(t, e, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof t == "function" ? (o = t(o), o && (o = o.selection())) : o = o.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function Za(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, o = e._groups, i = n.length, r = o.length, s = Math.min(i, r), l = new Array(i), a = 0; a < s; ++a)
    for (var c = n[a], d = o[a], u = c.length, f = l[a] = new Array(u), h, g = 0; g < u; ++g)
      (h = c[g] || d[g]) && (f[g] = h);
  for (; a < i; ++a)
    l[a] = n[a];
  return new Fe(l, this._parents);
}
function Ka() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var o = t[e], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function Ga(t) {
  t || (t = Ja);
  function e(u, f) {
    return u && f ? t(u.__data__, f.__data__) : !u - !f;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], l = s.length, a = i[r] = new Array(l), c, d = 0; d < l; ++d)
      (c = s[d]) && (a[d] = c);
    a.sort(e);
  }
  return new Fe(i, this._parents).order();
}
function Ja(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Qa() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function el() {
  return Array.from(this);
}
function tl() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function nl() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function ol() {
  return !this.node();
}
function il(t) {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var i = e[n], r = 0, s = i.length, l; r < s; ++r)
      (l = i[r]) && t.call(l, l.__data__, r, i);
  return this;
}
function sl(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function rl(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function al(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function ll(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function cl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function dl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function ul(t, e) {
  var n = uo(t);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((e == null ? n.local ? rl : sl : typeof e == "function" ? n.local ? dl : cl : n.local ? ll : al)(n, e));
}
function Us(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function fl(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function hl(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function pl(t, e, n) {
  return function() {
    var o = e.apply(this, arguments);
    o == null ? this.style.removeProperty(t) : this.style.setProperty(t, o, n);
  };
}
function gl(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? fl : typeof e == "function" ? pl : hl)(t, e, n ?? "")) : Ht(this.node(), t);
}
function Ht(t, e) {
  return t.style.getPropertyValue(e) || Us(t).getComputedStyle(t, null).getPropertyValue(e);
}
function ml(t) {
  return function() {
    delete this[t];
  };
}
function yl(t, e) {
  return function() {
    this[t] = e;
  };
}
function wl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function vl(t, e) {
  return arguments.length > 1 ? this.each((e == null ? ml : typeof e == "function" ? wl : yl)(t, e)) : this.node()[t];
}
function Zs(t) {
  return t.trim().split(/^|\s+/);
}
function ii(t) {
  return t.classList || new Ks(t);
}
function Ks(t) {
  this._node = t, this._names = Zs(t.getAttribute("class") || "");
}
Ks.prototype = {
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
function Gs(t, e) {
  for (var n = ii(t), o = -1, i = e.length; ++o < i; ) n.add(e[o]);
}
function Js(t, e) {
  for (var n = ii(t), o = -1, i = e.length; ++o < i; ) n.remove(e[o]);
}
function _l(t) {
  return function() {
    Gs(this, t);
  };
}
function bl(t) {
  return function() {
    Js(this, t);
  };
}
function xl(t, e) {
  return function() {
    (e.apply(this, arguments) ? Gs : Js)(this, t);
  };
}
function El(t, e) {
  var n = Zs(t + "");
  if (arguments.length < 2) {
    for (var o = ii(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? xl : e ? _l : bl)(n, e));
}
function Cl() {
  this.textContent = "";
}
function Sl(t) {
  return function() {
    this.textContent = t;
  };
}
function kl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Ll(t) {
  return arguments.length ? this.each(t == null ? Cl : (typeof t == "function" ? kl : Sl)(t)) : this.node().textContent;
}
function Pl() {
  this.innerHTML = "";
}
function Ml(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Tl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function Al(t) {
  return arguments.length ? this.each(t == null ? Pl : (typeof t == "function" ? Tl : Ml)(t)) : this.node().innerHTML;
}
function Nl() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function $l() {
  return this.each(Nl);
}
function Il() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Dl() {
  return this.each(Il);
}
function Rl(t) {
  var e = typeof t == "function" ? t : qs(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Fl() {
  return null;
}
function Hl(t, e) {
  var n = typeof t == "function" ? t : qs(t), o = e == null ? Fl : typeof e == "function" ? e : oi(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Ol() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function zl() {
  return this.each(Ol);
}
function Vl() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Bl() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function ql(t) {
  return this.select(t ? Bl : Vl);
}
function Xl(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function Yl(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function Wl(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", o = e.indexOf(".");
    return o >= 0 && (n = e.slice(o + 1), e = e.slice(0, o)), { type: e, name: n };
  });
}
function jl(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, o = -1, i = e.length, r; n < i; ++n)
        r = e[n], (!t.type || r.type === t.type) && r.name === t.name ? this.removeEventListener(r.type, r.listener, r.options) : e[++o] = r;
      ++o ? e.length = o : delete this.__on;
    }
  };
}
function Ul(t, e, n) {
  return function() {
    var o = this.__on, i, r = Yl(e);
    if (o) {
      for (var s = 0, l = o.length; s < l; ++s)
        if ((i = o[s]).type === t.type && i.name === t.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = r, i.options = n), i.value = e;
          return;
        }
    }
    this.addEventListener(t.type, r, n), i = { type: t.type, name: t.name, value: e, listener: r, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function Zl(t, e, n) {
  var o = Wl(t + ""), i, r = o.length, s;
  if (arguments.length < 2) {
    var l = this.node().__on;
    if (l) {
      for (var a = 0, c = l.length, d; a < c; ++a)
        for (i = 0, d = l[a]; i < r; ++i)
          if ((s = o[i]).type === d.type && s.name === d.name)
            return d.value;
    }
    return;
  }
  for (l = e ? Ul : jl, i = 0; i < r; ++i) this.each(l(o[i], e, n));
  return this;
}
function Qs(t, e, n) {
  var o = Us(t), i = o.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function Kl(t, e) {
  return function() {
    return Qs(this, t, e);
  };
}
function Gl(t, e) {
  return function() {
    return Qs(this, t, e.apply(this, arguments));
  };
}
function Jl(t, e) {
  return this.each((typeof e == "function" ? Gl : Kl)(t, e));
}
function* Ql() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var er = [null];
function Fe(t, e) {
  this._groups = t, this._parents = e;
}
function mn() {
  return new Fe([[document.documentElement]], er);
}
function ec() {
  return this;
}
Fe.prototype = mn.prototype = {
  constructor: Fe,
  select: ka,
  selectAll: Ta,
  selectChild: Ia,
  selectChildren: Ha,
  filter: Oa,
  data: Ya,
  enter: za,
  exit: ja,
  join: Ua,
  merge: Za,
  selection: ec,
  order: Ka,
  sort: Ga,
  call: Qa,
  nodes: el,
  node: tl,
  size: nl,
  empty: ol,
  each: il,
  attr: ul,
  style: gl,
  property: vl,
  classed: El,
  text: Ll,
  html: Al,
  raise: $l,
  lower: Dl,
  append: Rl,
  insert: Hl,
  remove: zl,
  clone: ql,
  datum: Xl,
  on: Zl,
  dispatch: Jl,
  [Symbol.iterator]: Ql
};
function Be(t) {
  return typeof t == "string" ? new Fe([[document.querySelector(t)]], [document.documentElement]) : new Fe([[t]], er);
}
function tc(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function Ze(t, e) {
  if (t = tc(t), e === void 0 && (e = t.currentTarget), e) {
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
const nc = { passive: !1 }, ln = { capture: !0, passive: !1 };
function mo(t) {
  t.stopImmediatePropagation();
}
function At(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function tr(t) {
  var e = t.document.documentElement, n = Be(t).on("dragstart.drag", At, ln);
  "onselectstart" in e ? n.on("selectstart.drag", At, ln) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function nr(t, e) {
  var n = t.document.documentElement, o = Be(t).on("dragstart.drag", null);
  e && (o.on("click.drag", At, ln), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const bn = (t) => () => t;
function Do(t, {
  sourceEvent: e,
  subject: n,
  target: o,
  identifier: i,
  active: r,
  x: s,
  y: l,
  dx: a,
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
    y: { value: l, enumerable: !0, configurable: !0 },
    dx: { value: a, enumerable: !0, configurable: !0 },
    dy: { value: c, enumerable: !0, configurable: !0 },
    _: { value: d }
  });
}
Do.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function oc(t) {
  return !t.ctrlKey && !t.button;
}
function ic() {
  return this.parentNode;
}
function sc(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function rc() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function ac() {
  var t = oc, e = ic, n = sc, o = rc, i = {}, r = co("start", "drag", "end"), s = 0, l, a, c, d, u = 0;
  function f(v) {
    v.on("mousedown.drag", h).filter(o).on("touchstart.drag", y).on("touchmove.drag", m, nc).on("touchend.drag touchcancel.drag", x).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(v, C) {
    if (!(d || !t.call(this, v, C))) {
      var S = M(this, e.call(this, v, C), v, C, "mouse");
      S && (Be(v.view).on("mousemove.drag", g, ln).on("mouseup.drag", p, ln), tr(v.view), mo(v), c = !1, l = v.clientX, a = v.clientY, S("start", v));
    }
  }
  function g(v) {
    if (At(v), !c) {
      var C = v.clientX - l, S = v.clientY - a;
      c = C * C + S * S > u;
    }
    i.mouse("drag", v);
  }
  function p(v) {
    Be(v.view).on("mousemove.drag mouseup.drag", null), nr(v.view, c), At(v), i.mouse("end", v);
  }
  function y(v, C) {
    if (t.call(this, v, C)) {
      var S = v.changedTouches, k = e.call(this, v, C), I = S.length, b, E;
      for (b = 0; b < I; ++b)
        (E = M(this, k, v, C, S[b].identifier, S[b])) && (mo(v), E("start", v, S[b]));
    }
  }
  function m(v) {
    var C = v.changedTouches, S = C.length, k, I;
    for (k = 0; k < S; ++k)
      (I = i[C[k].identifier]) && (At(v), I("drag", v, C[k]));
  }
  function x(v) {
    var C = v.changedTouches, S = C.length, k, I;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), k = 0; k < S; ++k)
      (I = i[C[k].identifier]) && (mo(v), I("end", v, C[k]));
  }
  function M(v, C, S, k, I, b) {
    var E = r.copy(), A = Ze(b || S, C), L, w, _;
    if ((_ = n.call(v, new Do("beforestart", {
      sourceEvent: S,
      target: f,
      identifier: I,
      active: s,
      x: A[0],
      y: A[1],
      dx: 0,
      dy: 0,
      dispatch: E
    }), k)) != null)
      return L = _.x - A[0] || 0, w = _.y - A[1] || 0, function D(P, R, G) {
        var ee = A, J;
        switch (P) {
          case "start":
            i[I] = D, J = s++;
            break;
          case "end":
            delete i[I], --s;
          // falls through
          case "drag":
            A = Ze(G || R, C), J = s;
            break;
        }
        E.call(
          P,
          v,
          new Do(P, {
            sourceEvent: R,
            subject: _,
            target: f,
            identifier: I,
            active: J,
            x: A[0] + L,
            y: A[1] + w,
            dx: A[0] - ee[0],
            dy: A[1] - ee[1],
            dispatch: E
          }),
          k
        );
      };
  }
  return f.filter = function(v) {
    return arguments.length ? (t = typeof v == "function" ? v : bn(!!v), f) : t;
  }, f.container = function(v) {
    return arguments.length ? (e = typeof v == "function" ? v : bn(v), f) : e;
  }, f.subject = function(v) {
    return arguments.length ? (n = typeof v == "function" ? v : bn(v), f) : n;
  }, f.touchable = function(v) {
    return arguments.length ? (o = typeof v == "function" ? v : bn(!!v), f) : o;
  }, f.on = function() {
    var v = r.on.apply(r, arguments);
    return v === r ? f : v;
  }, f.clickDistance = function(v) {
    return arguments.length ? (u = (v = +v) * v, f) : Math.sqrt(u);
  }, f;
}
function si(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function or(t, e) {
  var n = Object.create(t.prototype);
  for (var o in e) n[o] = e[o];
  return n;
}
function yn() {
}
var cn = 0.7, zn = 1 / cn, Nt = "\\s*([+-]?\\d+)\\s*", dn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", We = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", lc = /^#([0-9a-f]{3,8})$/, cc = new RegExp(`^rgb\\(${Nt},${Nt},${Nt}\\)$`), dc = new RegExp(`^rgb\\(${We},${We},${We}\\)$`), uc = new RegExp(`^rgba\\(${Nt},${Nt},${Nt},${dn}\\)$`), fc = new RegExp(`^rgba\\(${We},${We},${We},${dn}\\)$`), hc = new RegExp(`^hsl\\(${dn},${We},${We}\\)$`), pc = new RegExp(`^hsla\\(${dn},${We},${We},${dn}\\)$`), Mi = {
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
si(yn, un, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ti,
  // Deprecated! Use color.formatHex.
  formatHex: Ti,
  formatHex8: gc,
  formatHsl: mc,
  formatRgb: Ai,
  toString: Ai
});
function Ti() {
  return this.rgb().formatHex();
}
function gc() {
  return this.rgb().formatHex8();
}
function mc() {
  return ir(this).formatHsl();
}
function Ai() {
  return this.rgb().formatRgb();
}
function un(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = lc.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? Ni(e) : n === 3 ? new Ae(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? xn(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? xn(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = cc.exec(t)) ? new Ae(e[1], e[2], e[3], 1) : (e = dc.exec(t)) ? new Ae(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = uc.exec(t)) ? xn(e[1], e[2], e[3], e[4]) : (e = fc.exec(t)) ? xn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = hc.exec(t)) ? Di(e[1], e[2] / 100, e[3] / 100, 1) : (e = pc.exec(t)) ? Di(e[1], e[2] / 100, e[3] / 100, e[4]) : Mi.hasOwnProperty(t) ? Ni(Mi[t]) : t === "transparent" ? new Ae(NaN, NaN, NaN, 0) : null;
}
function Ni(t) {
  return new Ae(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function xn(t, e, n, o) {
  return o <= 0 && (t = e = n = NaN), new Ae(t, e, n, o);
}
function yc(t) {
  return t instanceof yn || (t = un(t)), t ? (t = t.rgb(), new Ae(t.r, t.g, t.b, t.opacity)) : new Ae();
}
function Ro(t, e, n, o) {
  return arguments.length === 1 ? yc(t) : new Ae(t, e, n, o ?? 1);
}
function Ae(t, e, n, o) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +o;
}
si(Ae, Ro, or(yn, {
  brighter(t) {
    return t = t == null ? zn : Math.pow(zn, t), new Ae(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? cn : Math.pow(cn, t), new Ae(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ae(bt(this.r), bt(this.g), bt(this.b), Vn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: $i,
  // Deprecated! Use color.formatHex.
  formatHex: $i,
  formatHex8: wc,
  formatRgb: Ii,
  toString: Ii
}));
function $i() {
  return `#${vt(this.r)}${vt(this.g)}${vt(this.b)}`;
}
function wc() {
  return `#${vt(this.r)}${vt(this.g)}${vt(this.b)}${vt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Ii() {
  const t = Vn(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${bt(this.r)}, ${bt(this.g)}, ${bt(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function Vn(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function bt(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function vt(t) {
  return t = bt(t), (t < 16 ? "0" : "") + t.toString(16);
}
function Di(t, e, n, o) {
  return o <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new qe(t, e, n, o);
}
function ir(t) {
  if (t instanceof qe) return new qe(t.h, t.s, t.l, t.opacity);
  if (t instanceof yn || (t = un(t)), !t) return new qe();
  if (t instanceof qe) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, o = t.b / 255, i = Math.min(e, n, o), r = Math.max(e, n, o), s = NaN, l = r - i, a = (r + i) / 2;
  return l ? (e === r ? s = (n - o) / l + (n < o) * 6 : n === r ? s = (o - e) / l + 2 : s = (e - n) / l + 4, l /= a < 0.5 ? r + i : 2 - r - i, s *= 60) : l = a > 0 && a < 1 ? 0 : s, new qe(s, l, a, t.opacity);
}
function vc(t, e, n, o) {
  return arguments.length === 1 ? ir(t) : new qe(t, e, n, o ?? 1);
}
function qe(t, e, n, o) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +o;
}
si(qe, vc, or(yn, {
  brighter(t) {
    return t = t == null ? zn : Math.pow(zn, t), new qe(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? cn : Math.pow(cn, t), new qe(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - o;
    return new Ae(
      yo(t >= 240 ? t - 240 : t + 120, i, o),
      yo(t, i, o),
      yo(t < 120 ? t + 240 : t - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new qe(Ri(this.h), En(this.s), En(this.l), Vn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = Vn(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${Ri(this.h)}, ${En(this.s) * 100}%, ${En(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function Ri(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function En(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function yo(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const sr = (t) => () => t;
function _c(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function bc(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(o) {
    return Math.pow(t + o * e, n);
  };
}
function xc(t) {
  return (t = +t) == 1 ? rr : function(e, n) {
    return n - e ? bc(e, n, t) : sr(isNaN(e) ? n : e);
  };
}
function rr(t, e) {
  var n = e - t;
  return n ? _c(t, n) : sr(isNaN(t) ? e : t);
}
const Fo = (function t(e) {
  var n = xc(e);
  function o(i, r) {
    var s = n((i = Ro(i)).r, (r = Ro(r)).r), l = n(i.g, r.g), a = n(i.b, r.b), c = rr(i.opacity, r.opacity);
    return function(d) {
      return i.r = s(d), i.g = l(d), i.b = a(d), i.opacity = c(d), i + "";
    };
  }
  return o.gamma = t, o;
})(1);
function rt(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
var Ho = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, wo = new RegExp(Ho.source, "g");
function Ec(t) {
  return function() {
    return t;
  };
}
function Cc(t) {
  return function(e) {
    return t(e) + "";
  };
}
function Sc(t, e) {
  var n = Ho.lastIndex = wo.lastIndex = 0, o, i, r, s = -1, l = [], a = [];
  for (t = t + "", e = e + ""; (o = Ho.exec(t)) && (i = wo.exec(e)); )
    (r = i.index) > n && (r = e.slice(n, r), l[s] ? l[s] += r : l[++s] = r), (o = o[0]) === (i = i[0]) ? l[s] ? l[s] += i : l[++s] = i : (l[++s] = null, a.push({ i: s, x: rt(o, i) })), n = wo.lastIndex;
  return n < e.length && (r = e.slice(n), l[s] ? l[s] += r : l[++s] = r), l.length < 2 ? a[0] ? Cc(a[0].x) : Ec(e) : (e = a.length, function(c) {
    for (var d = 0, u; d < e; ++d) l[(u = a[d]).i] = u.x(c);
    return l.join("");
  });
}
var Fi = 180 / Math.PI, Oo = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function ar(t, e, n, o, i, r) {
  var s, l, a;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (a = t * n + e * o) && (n -= t * a, o -= e * a), (l = Math.sqrt(n * n + o * o)) && (n /= l, o /= l, a /= l), t * o < e * n && (t = -t, e = -e, a = -a, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(e, t) * Fi,
    skewX: Math.atan(a) * Fi,
    scaleX: s,
    scaleY: l
  };
}
var Cn;
function kc(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? Oo : ar(e.a, e.b, e.c, e.d, e.e, e.f);
}
function Lc(t) {
  return t == null || (Cn || (Cn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Cn.setAttribute("transform", t), !(t = Cn.transform.baseVal.consolidate())) ? Oo : (t = t.matrix, ar(t.a, t.b, t.c, t.d, t.e, t.f));
}
function lr(t, e, n, o) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function r(c, d, u, f, h, g) {
    if (c !== u || d !== f) {
      var p = h.push("translate(", null, e, null, n);
      g.push({ i: p - 4, x: rt(c, u) }, { i: p - 2, x: rt(d, f) });
    } else (u || f) && h.push("translate(" + u + e + f + n);
  }
  function s(c, d, u, f) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), f.push({ i: u.push(i(u) + "rotate(", null, o) - 2, x: rt(c, d) })) : d && u.push(i(u) + "rotate(" + d + o);
  }
  function l(c, d, u, f) {
    c !== d ? f.push({ i: u.push(i(u) + "skewX(", null, o) - 2, x: rt(c, d) }) : d && u.push(i(u) + "skewX(" + d + o);
  }
  function a(c, d, u, f, h, g) {
    if (c !== u || d !== f) {
      var p = h.push(i(h) + "scale(", null, ",", null, ")");
      g.push({ i: p - 4, x: rt(c, u) }, { i: p - 2, x: rt(d, f) });
    } else (u !== 1 || f !== 1) && h.push(i(h) + "scale(" + u + "," + f + ")");
  }
  return function(c, d) {
    var u = [], f = [];
    return c = t(c), d = t(d), r(c.translateX, c.translateY, d.translateX, d.translateY, u, f), s(c.rotate, d.rotate, u, f), l(c.skewX, d.skewX, u, f), a(c.scaleX, c.scaleY, d.scaleX, d.scaleY, u, f), c = d = null, function(h) {
      for (var g = -1, p = f.length, y; ++g < p; ) u[(y = f[g]).i] = y.x(h);
      return u.join("");
    };
  };
}
var Pc = lr(kc, "px, ", "px)", "deg)"), Mc = lr(Lc, ", ", ")", ")"), Tc = 1e-12;
function Hi(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function Ac(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function Nc(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const $c = (function t(e, n, o) {
  function i(r, s) {
    var l = r[0], a = r[1], c = r[2], d = s[0], u = s[1], f = s[2], h = d - l, g = u - a, p = h * h + g * g, y, m;
    if (p < Tc)
      m = Math.log(f / c) / e, y = function(k) {
        return [
          l + k * h,
          a + k * g,
          c * Math.exp(e * k * m)
        ];
      };
    else {
      var x = Math.sqrt(p), M = (f * f - c * c + o * p) / (2 * c * n * x), v = (f * f - c * c - o * p) / (2 * f * n * x), C = Math.log(Math.sqrt(M * M + 1) - M), S = Math.log(Math.sqrt(v * v + 1) - v);
      m = (S - C) / e, y = function(k) {
        var I = k * m, b = Hi(C), E = c / (n * x) * (b * Nc(e * I + C) - Ac(C));
        return [
          l + E * h,
          a + E * g,
          c * b / Hi(e * I + C)
        ];
      };
    }
    return y.duration = m * 1e3 * e / Math.SQRT2, y;
  }
  return i.rho = function(r) {
    var s = Math.max(1e-3, +r), l = s * s, a = l * l;
    return t(s, l, a);
  }, i;
})(Math.SQRT2, 2, 4);
var Ot = 0, Qt = 0, jt = 0, cr = 1e3, Bn, en, qn = 0, xt = 0, fo = 0, fn = typeof performance == "object" && performance.now ? performance : Date, dr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function ri() {
  return xt || (dr(Ic), xt = fn.now() + fo);
}
function Ic() {
  xt = 0;
}
function Xn() {
  this._call = this._time = this._next = null;
}
Xn.prototype = ur.prototype = {
  constructor: Xn,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? ri() : +n) + (e == null ? 0 : +e), !this._next && en !== this && (en ? en._next = this : Bn = this, en = this), this._call = t, this._time = n, zo();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, zo());
  }
};
function ur(t, e, n) {
  var o = new Xn();
  return o.restart(t, e, n), o;
}
function Dc() {
  ri(), ++Ot;
  for (var t = Bn, e; t; )
    (e = xt - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --Ot;
}
function Oi() {
  xt = (qn = fn.now()) + fo, Ot = Qt = 0;
  try {
    Dc();
  } finally {
    Ot = 0, Fc(), xt = 0;
  }
}
function Rc() {
  var t = fn.now(), e = t - qn;
  e > cr && (fo -= e, qn = t);
}
function Fc() {
  for (var t, e = Bn, n, o = 1 / 0; e; )
    e._call ? (o > e._time && (o = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : Bn = n);
  en = t, zo(o);
}
function zo(t) {
  if (!Ot) {
    Qt && (Qt = clearTimeout(Qt));
    var e = t - xt;
    e > 24 ? (t < 1 / 0 && (Qt = setTimeout(Oi, t - fn.now() - fo)), jt && (jt = clearInterval(jt))) : (jt || (qn = fn.now(), jt = setInterval(Rc, cr)), Ot = 1, dr(Oi));
  }
}
function zi(t, e, n) {
  var o = new Xn();
  return e = e == null ? 0 : +e, o.restart((i) => {
    o.stop(), t(i + e);
  }, e, n), o;
}
var Hc = co("start", "end", "cancel", "interrupt"), Oc = [], fr = 0, Vi = 1, Vo = 2, In = 3, Bi = 4, Bo = 5, Dn = 6;
function ho(t, e, n, o, i, r) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  zc(t, n, {
    name: e,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Hc,
    tween: Oc,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: fr
  });
}
function ai(t, e) {
  var n = Xe(t, e);
  if (n.state > fr) throw new Error("too late; already scheduled");
  return n;
}
function je(t, e) {
  var n = Xe(t, e);
  if (n.state > In) throw new Error("too late; already running");
  return n;
}
function Xe(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function zc(t, e, n) {
  var o = t.__transition, i;
  o[e] = n, n.timer = ur(r, 0, n.time);
  function r(c) {
    n.state = Vi, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, u, f, h;
    if (n.state !== Vi) return a();
    for (d in o)
      if (h = o[d], h.name === n.name) {
        if (h.state === In) return zi(s);
        h.state === Bi ? (h.state = Dn, h.timer.stop(), h.on.call("interrupt", t, t.__data__, h.index, h.group), delete o[d]) : +d < e && (h.state = Dn, h.timer.stop(), h.on.call("cancel", t, t.__data__, h.index, h.group), delete o[d]);
      }
    if (zi(function() {
      n.state === In && (n.state = Bi, n.timer.restart(l, n.delay, n.time), l(c));
    }), n.state = Vo, n.on.call("start", t, t.__data__, n.index, n.group), n.state === Vo) {
      for (n.state = In, i = new Array(f = n.tween.length), d = 0, u = -1; d < f; ++d)
        (h = n.tween[d].value.call(t, t.__data__, n.index, n.group)) && (i[++u] = h);
      i.length = u + 1;
    }
  }
  function l(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(a), n.state = Bo, 1), u = -1, f = i.length; ++u < f; )
      i[u].call(t, d);
    n.state === Bo && (n.on.call("end", t, t.__data__, n.index, n.group), a());
  }
  function a() {
    n.state = Dn, n.timer.stop(), delete o[e];
    for (var c in o) return;
    delete t.__transition;
  }
}
function Rn(t, e) {
  var n = t.__transition, o, i, r = !0, s;
  if (n) {
    e = e == null ? null : e + "";
    for (s in n) {
      if ((o = n[s]).name !== e) {
        r = !1;
        continue;
      }
      i = o.state > Vo && o.state < Bo, o.state = Dn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", t, t.__data__, o.index, o.group), delete n[s];
    }
    r && delete t.__transition;
  }
}
function Vc(t) {
  return this.each(function() {
    Rn(this, t);
  });
}
function Bc(t, e) {
  var n, o;
  return function() {
    var i = je(this, t), r = i.tween;
    if (r !== n) {
      o = n = r;
      for (var s = 0, l = o.length; s < l; ++s)
        if (o[s].name === e) {
          o = o.slice(), o.splice(s, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function qc(t, e, n) {
  var o, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var r = je(this, t), s = r.tween;
    if (s !== o) {
      i = (o = s).slice();
      for (var l = { name: e, value: n }, a = 0, c = i.length; a < c; ++a)
        if (i[a].name === e) {
          i[a] = l;
          break;
        }
      a === c && i.push(l);
    }
    r.tween = i;
  };
}
function Xc(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var o = Xe(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? Bc : qc)(n, t, e));
}
function li(t, e, n) {
  var o = t._id;
  return t.each(function() {
    var i = je(this, o);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return Xe(i, o).value[e];
  };
}
function hr(t, e) {
  var n;
  return (typeof e == "number" ? rt : e instanceof un ? Fo : (n = un(e)) ? (e = n, Fo) : Sc)(t, e);
}
function Yc(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function Wc(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function jc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Uc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Zc(t, e, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l)));
  };
}
function Kc(t, e, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l)));
  };
}
function Gc(t, e) {
  var n = uo(t), o = n === "transform" ? Mc : hr;
  return this.attrTween(t, typeof e == "function" ? (n.local ? Kc : Zc)(n, o, li(this, "attr." + t, e)) : e == null ? (n.local ? Wc : Yc)(n) : (n.local ? Uc : jc)(n, o, e));
}
function Jc(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function Qc(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function ed(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && Qc(t, r)), n;
  }
  return i._value = e, i;
}
function td(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && Jc(t, r)), n;
  }
  return i._value = e, i;
}
function nd(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var o = uo(t);
  return this.tween(n, (o.local ? ed : td)(o, e));
}
function od(t, e) {
  return function() {
    ai(this, t).delay = +e.apply(this, arguments);
  };
}
function id(t, e) {
  return e = +e, function() {
    ai(this, t).delay = e;
  };
}
function sd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? od : id)(e, t)) : Xe(this.node(), e).delay;
}
function rd(t, e) {
  return function() {
    je(this, t).duration = +e.apply(this, arguments);
  };
}
function ad(t, e) {
  return e = +e, function() {
    je(this, t).duration = e;
  };
}
function ld(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? rd : ad)(e, t)) : Xe(this.node(), e).duration;
}
function cd(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    je(this, t).ease = e;
  };
}
function dd(t) {
  var e = this._id;
  return arguments.length ? this.each(cd(e, t)) : Xe(this.node(), e).ease;
}
function ud(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    je(this, t).ease = n;
  };
}
function fd(t) {
  if (typeof t != "function") throw new Error();
  return this.each(ud(this._id, t));
}
function hd(t) {
  typeof t != "function" && (t = Ys(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = [], a, c = 0; c < s; ++c)
      (a = r[c]) && t.call(a, a.__data__, c, r) && l.push(a);
  return new tt(o, this._parents, this._name, this._id);
}
function pd(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, o = e.length, i = n.length, r = Math.min(o, i), s = new Array(o), l = 0; l < r; ++l)
    for (var a = e[l], c = n[l], d = a.length, u = s[l] = new Array(d), f, h = 0; h < d; ++h)
      (f = a[h] || c[h]) && (u[h] = f);
  for (; l < o; ++l)
    s[l] = e[l];
  return new tt(s, this._parents, this._name, this._id);
}
function gd(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function md(t, e, n) {
  var o, i, r = gd(e) ? ai : je;
  return function() {
    var s = r(this, t), l = s.on;
    l !== o && (i = (o = l).copy()).on(e, n), s.on = i;
  };
}
function yd(t, e) {
  var n = this._id;
  return arguments.length < 2 ? Xe(this.node(), n).on.on(t) : this.each(md(n, t, e));
}
function wd(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function vd() {
  return this.on("end.remove", wd(this._id));
}
function _d(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = oi(t));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var l = o[s], a = l.length, c = r[s] = new Array(a), d, u, f = 0; f < a; ++f)
      (d = l[f]) && (u = t.call(d, d.__data__, f, l)) && ("__data__" in d && (u.__data__ = d.__data__), c[f] = u, ho(c[f], e, n, f, c, Xe(d, n)));
  return new tt(r, this._parents, e, n);
}
function bd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Xs(t));
  for (var o = this._groups, i = o.length, r = [], s = [], l = 0; l < i; ++l)
    for (var a = o[l], c = a.length, d, u = 0; u < c; ++u)
      if (d = a[u]) {
        for (var f = t.call(d, d.__data__, u, a), h, g = Xe(d, n), p = 0, y = f.length; p < y; ++p)
          (h = f[p]) && ho(h, e, n, p, f, g);
        r.push(f), s.push(d);
      }
  return new tt(r, s, e, n);
}
var xd = mn.prototype.constructor;
function Ed() {
  return new xd(this._groups, this._parents);
}
function Cd(t, e) {
  var n, o, i;
  return function() {
    var r = Ht(this, t), s = (this.style.removeProperty(t), Ht(this, t));
    return r === s ? null : r === n && s === o ? i : i = e(n = r, o = s);
  };
}
function pr(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Sd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = Ht(this, t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function kd(t, e, n) {
  var o, i, r;
  return function() {
    var s = Ht(this, t), l = n(this), a = l + "";
    return l == null && (a = l = (this.style.removeProperty(t), Ht(this, t))), s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l));
  };
}
function Ld(t, e) {
  var n, o, i, r = "style." + e, s = "end." + r, l;
  return function() {
    var a = je(this, t), c = a.on, d = a.value[r] == null ? l || (l = pr(e)) : void 0;
    (c !== n || i !== d) && (o = (n = c).copy()).on(s, i = d), a.on = o;
  };
}
function Pd(t, e, n) {
  var o = (t += "") == "transform" ? Pc : hr;
  return e == null ? this.styleTween(t, Cd(t, o)).on("end.style." + t, pr(t)) : typeof e == "function" ? this.styleTween(t, kd(t, o, li(this, "style." + t, e))).each(Ld(this._id, t)) : this.styleTween(t, Sd(t, o, e), n).on("end.style." + t, null);
}
function Md(t, e, n) {
  return function(o) {
    this.style.setProperty(t, e.call(this, o), n);
  };
}
function Td(t, e, n) {
  var o, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (o = (i = s) && Md(t, s, n)), o;
  }
  return r._value = e, r;
}
function Ad(t, e, n) {
  var o = "style." + (t += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, Td(t, e, n ?? ""));
}
function Nd(t) {
  return function() {
    this.textContent = t;
  };
}
function $d(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function Id(t) {
  return this.tween("text", typeof t == "function" ? $d(li(this, "text", t)) : Nd(t == null ? "" : t + ""));
}
function Dd(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function Rd(t) {
  var e, n;
  function o() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && Dd(i)), e;
  }
  return o._value = t, o;
}
function Fd(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, Rd(t));
}
function Hd() {
  for (var t = this._name, e = this._id, n = gr(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, c = 0; c < l; ++c)
      if (a = s[c]) {
        var d = Xe(a, e);
        ho(a, t, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new tt(o, this._parents, t, n);
}
function Od() {
  var t, e, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var l = { value: s }, a = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var c = je(this, o), d = c.on;
      d !== t && (e = (t = d).copy(), e._.cancel.push(l), e._.interrupt.push(l), e._.end.push(a)), c.on = e;
    }), i === 0 && r();
  });
}
var zd = 0;
function tt(t, e, n, o) {
  this._groups = t, this._parents = e, this._name = n, this._id = o;
}
function gr() {
  return ++zd;
}
var Ue = mn.prototype;
tt.prototype = {
  constructor: tt,
  select: _d,
  selectAll: bd,
  selectChild: Ue.selectChild,
  selectChildren: Ue.selectChildren,
  filter: hd,
  merge: pd,
  selection: Ed,
  transition: Hd,
  call: Ue.call,
  nodes: Ue.nodes,
  node: Ue.node,
  size: Ue.size,
  empty: Ue.empty,
  each: Ue.each,
  on: yd,
  attr: Gc,
  attrTween: nd,
  style: Pd,
  styleTween: Ad,
  text: Id,
  textTween: Fd,
  remove: vd,
  tween: Xc,
  delay: sd,
  duration: ld,
  ease: dd,
  easeVarying: fd,
  end: Od,
  [Symbol.iterator]: Ue[Symbol.iterator]
};
const Vd = (t) => +t;
function Bd(t) {
  return t * t;
}
function qd(t) {
  return t * (2 - t);
}
function Xd(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
function Yd(t) {
  return t * t * t;
}
function Wd(t) {
  return --t * t * t + 1;
}
function mr(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var yr = Math.PI, wr = yr / 2;
function jd(t) {
  return +t == 1 ? 1 : 1 - Math.cos(t * wr);
}
function Ud(t) {
  return Math.sin(t * wr);
}
function Zd(t) {
  return (1 - Math.cos(yr * t)) / 2;
}
function pt(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
function Kd(t) {
  return pt(1 - +t);
}
function Gd(t) {
  return 1 - pt(t);
}
function Jd(t) {
  return ((t *= 2) <= 1 ? pt(1 - t) : 2 - pt(t - 1)) / 2;
}
function Qd(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function eu(t) {
  return Math.sqrt(1 - --t * t);
}
function tu(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
var qo = 4 / 11, nu = 6 / 11, ou = 8 / 11, iu = 3 / 4, su = 9 / 11, ru = 10 / 11, au = 15 / 16, lu = 21 / 22, cu = 63 / 64, Sn = 1 / qo / qo;
function du(t) {
  return 1 - Yn(1 - t);
}
function Yn(t) {
  return (t = +t) < qo ? Sn * t * t : t < ou ? Sn * (t -= nu) * t + iu : t < ru ? Sn * (t -= su) * t + au : Sn * (t -= lu) * t + cu;
}
function uu(t) {
  return ((t *= 2) <= 1 ? 1 - Yn(1 - t) : Yn(t - 1) + 1) / 2;
}
var ci = 1.70158, fu = (function t(e) {
  e = +e;
  function n(o) {
    return (o = +o) * o * (e * (o - 1) + o);
  }
  return n.overshoot = t, n;
})(ci), hu = (function t(e) {
  e = +e;
  function n(o) {
    return --o * o * ((o + 1) * e + o) + 1;
  }
  return n.overshoot = t, n;
})(ci), pu = (function t(e) {
  e = +e;
  function n(o) {
    return ((o *= 2) < 1 ? o * o * ((e + 1) * o - e) : (o -= 2) * o * ((e + 1) * o + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(ci), zt = 2 * Math.PI, di = 1, ui = 0.3, gu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= zt);
  function i(r) {
    return e * pt(- --r) * Math.sin((o - r) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * zt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(di, ui), mu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= zt);
  function i(r) {
    return 1 - e * pt(r = +r) * Math.sin((r + o) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * zt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(di, ui), yu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= zt);
  function i(r) {
    return ((r = r * 2 - 1) < 0 ? e * pt(-r) * Math.sin((o - r) / n) : 2 - e * pt(r) * Math.sin((o + r) / n)) / 2;
  }
  return i.amplitude = function(r) {
    return t(r, n * zt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(di, ui), wu = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: mr
};
function vu(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function _u(t) {
  var e, n;
  t instanceof tt ? (e = t._id, t = t._name) : (e = gr(), (n = wu).time = ri(), t = t == null ? null : t + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, c = 0; c < l; ++c)
      (a = s[c]) && ho(a, t, e, c, s, n || vu(a, e));
  return new tt(o, this._parents, t, e);
}
mn.prototype.interrupt = Vc;
mn.prototype.transition = _u;
const kn = (t) => () => t;
function bu(t, {
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
function Je(t, e, n) {
  this.k = t, this.x = e, this.y = n;
}
Je.prototype = {
  constructor: Je,
  scale: function(t) {
    return t === 1 ? this : new Je(this.k * t, this.x, this.y);
  },
  translate: function(t, e) {
    return t === 0 & e === 0 ? this : new Je(this.k, this.x + this.k * t, this.y + this.k * e);
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
var Wn = new Je(1, 0, 0);
Je.prototype;
function vo(t) {
  t.stopImmediatePropagation();
}
function Ut(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function xu(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function Eu() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function qi() {
  return this.__zoom || Wn;
}
function Cu(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function Su() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function ku(t, e, n) {
  var o = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], r = t.invertY(e[0][1]) - n[0][1], s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function Lu() {
  var t = xu, e = Eu, n = ku, o = Cu, i = Su, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, a = $c, c = co("start", "zoom", "end"), d, u, f, h = 500, g = 150, p = 0, y = 10;
  function m(_) {
    _.property("__zoom", qi).on("wheel.zoom", I, { passive: !1 }).on("mousedown.zoom", b).on("dblclick.zoom", E).filter(i).on("touchstart.zoom", A).on("touchmove.zoom", L).on("touchend.zoom touchcancel.zoom", w).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(_, D, P, R) {
    var G = _.selection ? _.selection() : _;
    G.property("__zoom", qi), _ !== G ? C(_, D, P, R) : G.interrupt().each(function() {
      S(this, arguments).event(R).start().zoom(null, typeof D == "function" ? D.apply(this, arguments) : D).end();
    });
  }, m.scaleBy = function(_, D, P, R) {
    m.scaleTo(_, function() {
      var G = this.__zoom.k, ee = typeof D == "function" ? D.apply(this, arguments) : D;
      return G * ee;
    }, P, R);
  }, m.scaleTo = function(_, D, P, R) {
    m.transform(_, function() {
      var G = e.apply(this, arguments), ee = this.__zoom, J = P == null ? v(G) : typeof P == "function" ? P.apply(this, arguments) : P, T = ee.invert(J), N = typeof D == "function" ? D.apply(this, arguments) : D;
      return n(M(x(ee, N), J, T), G, s);
    }, P, R);
  }, m.translateBy = function(_, D, P, R) {
    m.transform(_, function() {
      return n(this.__zoom.translate(
        typeof D == "function" ? D.apply(this, arguments) : D,
        typeof P == "function" ? P.apply(this, arguments) : P
      ), e.apply(this, arguments), s);
    }, null, R);
  }, m.translateTo = function(_, D, P, R, G) {
    m.transform(_, function() {
      var ee = e.apply(this, arguments), J = this.__zoom, T = R == null ? v(ee) : typeof R == "function" ? R.apply(this, arguments) : R;
      return n(Wn.translate(T[0], T[1]).scale(J.k).translate(
        typeof D == "function" ? -D.apply(this, arguments) : -D,
        typeof P == "function" ? -P.apply(this, arguments) : -P
      ), ee, s);
    }, R, G);
  };
  function x(_, D) {
    return D = Math.max(r[0], Math.min(r[1], D)), D === _.k ? _ : new Je(D, _.x, _.y);
  }
  function M(_, D, P) {
    var R = D[0] - P[0] * _.k, G = D[1] - P[1] * _.k;
    return R === _.x && G === _.y ? _ : new Je(_.k, R, G);
  }
  function v(_) {
    return [(+_[0][0] + +_[1][0]) / 2, (+_[0][1] + +_[1][1]) / 2];
  }
  function C(_, D, P, R) {
    _.on("start.zoom", function() {
      S(this, arguments).event(R).start();
    }).on("interrupt.zoom end.zoom", function() {
      S(this, arguments).event(R).end();
    }).tween("zoom", function() {
      var G = this, ee = arguments, J = S(G, ee).event(R), T = e.apply(G, ee), N = P == null ? v(T) : typeof P == "function" ? P.apply(G, ee) : P, O = Math.max(T[1][0] - T[0][0], T[1][1] - T[0][1]), re = G.__zoom, le = typeof D == "function" ? D.apply(G, ee) : D, se = a(re.invert(N).concat(O / re.k), le.invert(N).concat(O / le.k));
      return function(j) {
        if (j === 1) j = le;
        else {
          var V = se(j), q = O / V[2];
          j = new Je(q, N[0] - V[0] * q, N[1] - V[1] * q);
        }
        J.zoom(null, j);
      };
    });
  }
  function S(_, D, P) {
    return !P && _.__zooming || new k(_, D);
  }
  function k(_, D) {
    this.that = _, this.args = D, this.active = 0, this.sourceEvent = null, this.extent = e.apply(_, D), this.taps = 0;
  }
  k.prototype = {
    event: function(_) {
      return _ && (this.sourceEvent = _), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(_, D) {
      return this.mouse && _ !== "mouse" && (this.mouse[1] = D.invert(this.mouse[0])), this.touch0 && _ !== "touch" && (this.touch0[1] = D.invert(this.touch0[0])), this.touch1 && _ !== "touch" && (this.touch1[1] = D.invert(this.touch1[0])), this.that.__zoom = D, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(_) {
      var D = Be(this.that).datum();
      c.call(
        _,
        this.that,
        new bu(_, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        D
      );
    }
  };
  function I(_, ...D) {
    if (!t.apply(this, arguments)) return;
    var P = S(this, D).event(_), R = this.__zoom, G = Math.max(r[0], Math.min(r[1], R.k * Math.pow(2, o.apply(this, arguments)))), ee = Ze(_);
    if (P.wheel)
      (P.mouse[0][0] !== ee[0] || P.mouse[0][1] !== ee[1]) && (P.mouse[1] = R.invert(P.mouse[0] = ee)), clearTimeout(P.wheel);
    else {
      if (R.k === G) return;
      P.mouse = [ee, R.invert(ee)], Rn(this), P.start();
    }
    Ut(_), P.wheel = setTimeout(J, g), P.zoom("mouse", n(M(x(R, G), P.mouse[0], P.mouse[1]), P.extent, s));
    function J() {
      P.wheel = null, P.end();
    }
  }
  function b(_, ...D) {
    if (f || !t.apply(this, arguments)) return;
    var P = _.currentTarget, R = S(this, D, !0).event(_), G = Be(_.view).on("mousemove.zoom", N, !0).on("mouseup.zoom", O, !0), ee = Ze(_, P), J = _.clientX, T = _.clientY;
    tr(_.view), vo(_), R.mouse = [ee, this.__zoom.invert(ee)], Rn(this), R.start();
    function N(re) {
      if (Ut(re), !R.moved) {
        var le = re.clientX - J, se = re.clientY - T;
        R.moved = le * le + se * se > p;
      }
      R.event(re).zoom("mouse", n(M(R.that.__zoom, R.mouse[0] = Ze(re, P), R.mouse[1]), R.extent, s));
    }
    function O(re) {
      G.on("mousemove.zoom mouseup.zoom", null), nr(re.view, R.moved), Ut(re), R.event(re).end();
    }
  }
  function E(_, ...D) {
    if (t.apply(this, arguments)) {
      var P = this.__zoom, R = Ze(_.changedTouches ? _.changedTouches[0] : _, this), G = P.invert(R), ee = P.k * (_.shiftKey ? 0.5 : 2), J = n(M(x(P, ee), R, G), e.apply(this, D), s);
      Ut(_), l > 0 ? Be(this).transition().duration(l).call(C, J, R, _) : Be(this).call(m.transform, J, R, _);
    }
  }
  function A(_, ...D) {
    if (t.apply(this, arguments)) {
      var P = _.touches, R = P.length, G = S(this, D, _.changedTouches.length === R).event(_), ee, J, T, N;
      for (vo(_), J = 0; J < R; ++J)
        T = P[J], N = Ze(T, this), N = [N, this.__zoom.invert(N), T.identifier], G.touch0 ? !G.touch1 && G.touch0[2] !== N[2] && (G.touch1 = N, G.taps = 0) : (G.touch0 = N, ee = !0, G.taps = 1 + !!d);
      d && (d = clearTimeout(d)), ee && (G.taps < 2 && (u = N[0], d = setTimeout(function() {
        d = null;
      }, h)), Rn(this), G.start());
    }
  }
  function L(_, ...D) {
    if (this.__zooming) {
      var P = S(this, D).event(_), R = _.changedTouches, G = R.length, ee, J, T, N;
      for (Ut(_), ee = 0; ee < G; ++ee)
        J = R[ee], T = Ze(J, this), P.touch0 && P.touch0[2] === J.identifier ? P.touch0[0] = T : P.touch1 && P.touch1[2] === J.identifier && (P.touch1[0] = T);
      if (J = P.that.__zoom, P.touch1) {
        var O = P.touch0[0], re = P.touch0[1], le = P.touch1[0], se = P.touch1[1], j = (j = le[0] - O[0]) * j + (j = le[1] - O[1]) * j, V = (V = se[0] - re[0]) * V + (V = se[1] - re[1]) * V;
        J = x(J, Math.sqrt(j / V)), T = [(O[0] + le[0]) / 2, (O[1] + le[1]) / 2], N = [(re[0] + se[0]) / 2, (re[1] + se[1]) / 2];
      } else if (P.touch0) T = P.touch0[0], N = P.touch0[1];
      else return;
      P.zoom("touch", n(M(J, T, N), P.extent, s));
    }
  }
  function w(_, ...D) {
    if (this.__zooming) {
      var P = S(this, D).event(_), R = _.changedTouches, G = R.length, ee, J;
      for (vo(_), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), ee = 0; ee < G; ++ee)
        J = R[ee], P.touch0 && P.touch0[2] === J.identifier ? delete P.touch0 : P.touch1 && P.touch1[2] === J.identifier && delete P.touch1;
      if (P.touch1 && !P.touch0 && (P.touch0 = P.touch1, delete P.touch1), P.touch0) P.touch0[1] = this.__zoom.invert(P.touch0[0]);
      else if (P.end(), P.taps === 2 && (J = Ze(J, this), Math.hypot(u[0] - J[0], u[1] - J[1]) < y)) {
        var T = Be(this).on("dblclick.zoom");
        T && T.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(_) {
    return arguments.length ? (o = typeof _ == "function" ? _ : kn(+_), m) : o;
  }, m.filter = function(_) {
    return arguments.length ? (t = typeof _ == "function" ? _ : kn(!!_), m) : t;
  }, m.touchable = function(_) {
    return arguments.length ? (i = typeof _ == "function" ? _ : kn(!!_), m) : i;
  }, m.extent = function(_) {
    return arguments.length ? (e = typeof _ == "function" ? _ : kn([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), m) : e;
  }, m.scaleExtent = function(_) {
    return arguments.length ? (r[0] = +_[0], r[1] = +_[1], m) : [r[0], r[1]];
  }, m.translateExtent = function(_) {
    return arguments.length ? (s[0][0] = +_[0][0], s[1][0] = +_[1][0], s[0][1] = +_[0][1], s[1][1] = +_[1][1], m) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, m.constrain = function(_) {
    return arguments.length ? (n = _, m) : n;
  }, m.duration = function(_) {
    return arguments.length ? (l = +_, m) : l;
  }, m.interpolate = function(_) {
    return arguments.length ? (a = _, m) : a;
  }, m.on = function() {
    var _ = c.on.apply(c, arguments);
    return _ === c ? m : _;
  }, m.clickDistance = function(_) {
    return arguments.length ? (p = (_ = +_) * _, m) : Math.sqrt(p);
  }, m.tapDistance = function(_) {
    return arguments.length ? (y = +_, m) : y;
  }, m;
}
function Xi(t) {
  const { pannable: e, zoomable: n, isLocked: o, noPanClassName: i, noWheelClassName: r, isTouchSelectionMode: s, isPanKeyHeld: l, panOnDrag: a } = t;
  return (c) => {
    if (o?.() || i && c.target?.closest?.("." + i) || c.type === "wheel" && r && c.target?.closest?.("." + r) || !n && c.type === "wheel") return !1;
    if (c.type === "touchstart") {
      const d = !c.touches || c.touches.length < 2;
      if (s?.() && d || !e && !l?.() && d || !n && !d) return !1;
    }
    if (c.type === "mousedown") {
      if (l?.()) return !0;
      if (!e) return !1;
      if (Array.isArray(a))
        return a.includes(c.button);
      if (a === !1) return !1;
    }
    return !0;
  };
}
function Pu(t, e) {
  const {
    onTransformChange: n,
    minZoom: o = 0.5,
    maxZoom: i = 2,
    pannable: r = !0,
    zoomable: s = !0
  } = e, l = Be(t);
  let a = !1;
  const c = e.panActivationKeyCode !== void 0 ? e.panActivationKeyCode : "Space", d = (k) => {
    c && k.code === c && (a = !0, t.style.cursor = "grab");
  }, u = (k) => {
    c && k.code === c && (a = !1, t.style.cursor = "");
  }, f = () => {
    a = !1, t.style.cursor = "";
  };
  c && (window.addEventListener("keydown", d), window.addEventListener("keyup", u), window.addEventListener("blur", f));
  const h = Lu().scaleExtent([o, i]).on("start", (k) => {
    if (!k.sourceEvent) return;
    a && (t.style.cursor = "grabbing");
    const { x: I, y: b, k: E } = k.transform;
    e.onMoveStart?.({ x: I, y: b, zoom: E });
  }).on("zoom", (k) => {
    const { x: I, y: b, k: E } = k.transform;
    n({ x: I, y: b, zoom: E }), k.sourceEvent && e.onMove?.({ x: I, y: b, zoom: E });
  }).on("end", (k) => {
    if (!k.sourceEvent) return;
    a && (t.style.cursor = "grab");
    const { x: I, y: b, k: E } = k.transform;
    e.onMoveEnd?.({ x: I, y: b, zoom: E });
  });
  e.translateExtent && h.translateExtent(e.translateExtent), h.filter(Xi({
    pannable: r,
    zoomable: s,
    isLocked: e.isLocked,
    noPanClassName: e.noPanClassName,
    noWheelClassName: e.noWheelClassName,
    isTouchSelectionMode: e.isTouchSelectionMode,
    isPanKeyHeld: () => a,
    panOnDrag: e.panOnDrag
  })), l.call(h), e.zoomOnDoubleClick === !1 && l.on("dblclick.zoom", null);
  let g = e.panOnScroll ?? !1, p = e.panOnScrollDirection ?? "both", y = e.panOnScrollSpeed ?? 1, m = !1;
  const x = e.zoomActivationKeyCode !== void 0 ? e.zoomActivationKeyCode : null, M = (k) => {
    x && k.code === x && (m = !0);
  }, v = (k) => {
    x && k.code === x && (m = !1);
  }, C = () => {
    m = !1;
  };
  x && (window.addEventListener("keydown", M), window.addEventListener("keyup", v), window.addEventListener("blur", C));
  const S = (k) => {
    if (e.isLocked?.()) return;
    const I = k.ctrlKey || k.metaKey || m;
    if (!(g ? !I : k.shiftKey)) return;
    k.preventDefault(), k.stopPropagation();
    const E = y;
    let A = 0, L = 0;
    p !== "horizontal" && (L = -k.deltaY * E), p !== "vertical" && (A = -k.deltaX * E, k.shiftKey && k.deltaX === 0 && p === "both" && (A = -k.deltaY * E, L = 0)), e.onScrollPan?.(A, L);
  };
  return t.addEventListener("wheel", S, { passive: !1, capture: !0 }), {
    setViewport(k, I) {
      const b = I?.duration ?? 0, E = Wn.translate(k.x ?? 0, k.y ?? 0).scale(k.zoom ?? 1);
      b > 0 ? l.transition().duration(b).call(h.transform, E) : l.call(h.transform, E);
    },
    getTransform() {
      return t.__zoom ?? Wn;
    },
    update(k) {
      if ((k.minZoom !== void 0 || k.maxZoom !== void 0) && h.scaleExtent([
        k.minZoom ?? o,
        k.maxZoom ?? i
      ]), k.pannable !== void 0 || k.zoomable !== void 0) {
        const I = k.pannable ?? r, b = k.zoomable ?? s;
        h.filter(Xi({
          pannable: I,
          zoomable: b,
          isLocked: e.isLocked,
          noPanClassName: e.noPanClassName,
          noWheelClassName: e.noWheelClassName,
          isTouchSelectionMode: e.isTouchSelectionMode,
          isPanKeyHeld: () => a,
          panOnDrag: e.panOnDrag
        }));
      }
      k.panOnScroll !== void 0 && (g = k.panOnScroll), k.panOnScrollDirection !== void 0 && (p = k.panOnScrollDirection), k.panOnScrollSpeed !== void 0 && (y = k.panOnScrollSpeed);
    },
    destroy() {
      t.removeEventListener("wheel", S, { capture: !0 }), c && (window.removeEventListener("keydown", d), window.removeEventListener("keyup", u), window.removeEventListener("blur", f)), x && (window.removeEventListener("keydown", M), window.removeEventListener("keyup", v), window.removeEventListener("blur", C)), l.on(".zoom", null);
    }
  };
}
function vr(t, e, n, o) {
  return {
    x: (t - o.left - n.x) / n.zoom,
    y: (e - o.top - n.y) / n.zoom
  };
}
function Mu(t, e, n, o) {
  return {
    x: t * n.zoom + n.x + o.left,
    y: e * n.zoom + n.y + o.top
  };
}
const _e = 150, be = 50;
function po(t, e, n, o, i) {
  if (i % 360 === 0) return { x: t, y: e, width: n, height: o };
  const r = i * Math.PI / 180, s = Math.abs(Math.cos(r)), l = Math.abs(Math.sin(r)), a = n * s + o * l, c = n * l + o * s, d = t + n / 2, u = e + o / 2;
  return { x: d - a / 2, y: u - c / 2, width: a, height: c };
}
function Vt(t, e) {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = 1 / 0, o = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const s of t) {
    const l = s.dimensions?.width ?? _e, a = s.dimensions?.height ?? be, c = Yt(s, e), d = s.rotation ? po(c.x, c.y, l, a, s.rotation) : { x: c.x, y: c.y, width: l, height: a };
    n = Math.min(n, d.x), o = Math.min(o, d.y), i = Math.max(i, d.x + d.width), r = Math.max(r, d.y + d.height);
  }
  return {
    x: n,
    y: o,
    width: i - n,
    height: r - o
  };
}
function Tu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? _e, l = r.dimensions?.height ?? be, a = Yt(r, n), c = r.rotation ? po(a.x, a.y, s, l, r.rotation) : { x: a.x, y: a.y, width: s, height: l }, d = c.x + c.width, u = c.y + c.height;
    return !(d < e.x || c.x > o || u < e.y || c.y > i);
  });
}
function Au(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? _e, l = r.dimensions?.height ?? be, a = Yt(r, n), c = r.rotation ? po(a.x, a.y, s, l, r.rotation) : { x: a.x, y: a.y, width: s, height: l };
    return c.x >= e.x && c.y >= e.y && c.x + c.width <= o && c.y + c.height <= i;
  });
}
function jn(t, e, n, o, i, r = 0.1) {
  const s = Math.max(t.width, 1), l = Math.max(t.height, 1), a = s * (1 + r), c = l * (1 + r), d = e / a, u = n / c, f = Math.min(Math.max(Math.min(d, u), o), i), h = { x: t.x + s / 2, y: t.y + l / 2 }, g = e / 2 - h.x * f, p = n / 2 - h.y * f;
  return { x: g, y: p, zoom: f };
}
function Nu(t, e, n, o) {
  const i = 1 / t.zoom;
  return {
    minX: (0 - t.x) * i - o,
    minY: (0 - t.y) * i - o,
    maxX: (e - t.x) * i + o,
    maxY: (n - t.y) * i + o
  };
}
function Yt(t, e) {
  if (!t.position) return { x: 0, y: 0 };
  const n = t.nodeOrigin ?? e ?? [0, 0], o = t.dimensions?.width ?? _e, i = t.dimensions?.height ?? be;
  return {
    x: t.position.x - o * n[0],
    y: t.position.y - i * n[1]
  };
}
let _r = !1;
function br(t) {
  _r = t;
}
function B(t, e, n) {
  if (!_r) return;
  const o = `%c[AlpineFlow:${t}]`, i = $u(t);
  n !== void 0 ? console.log(o, i, e, n) : console.log(o, i, e);
}
function $u(t) {
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
const hn = "#64748b", fi = "#d4d4d8", xr = "#ef4444", Iu = "2", Du = "6 3", Yi = 1.2, Xo = 0.2, Fn = 5, Wi = 25;
class Ru {
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
    this._suspendDepth > 0 || this.commit(JSON.stringify(e));
  }
  /** Serialize without pushing — pair with commit() for deferred capture. */
  snapshot(e) {
    return JSON.stringify(e);
  }
  /** Push a snapshot taken earlier via snapshot(). Dedups against the top of the stack. */
  commit(e) {
    this._suspendDepth > 0 || this.past.length > 0 && this.past[this.past.length - 1] === e || (this.past.push(e), this.future = [], this.past.length > this.maxSize && this.past.shift());
  }
  undo(e) {
    return this.past.length === 0 ? null : (this.future.push(JSON.stringify(e)), JSON.parse(this.past.pop()));
  }
  redo(e) {
    return this.future.length === 0 ? null : (this.past.push(JSON.stringify(e)), JSON.parse(this.future.pop()));
  }
  get canUndo() {
    return this.past.length > 0;
  }
  get canRedo() {
    return this.future.length > 0;
  }
}
const Fu = 16;
function Hu() {
  return typeof requestAnimationFrame == "function" ? {
    request: (t) => requestAnimationFrame(t),
    cancel: (t) => cancelAnimationFrame(t)
  } : {
    request: (t) => setTimeout(() => t(performance.now()), Fu),
    cancel: (t) => clearTimeout(t)
  };
}
class Er {
  constructor() {
    this._scheduler = Hu(), this._entries = [], this._postTickCallbacks = [], this._frameId = null, this._running = !1;
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
const Un = new Er(), Ou = {
  linear: Vd,
  easeIn: Bd,
  easeOut: qd,
  easeInOut: Xd,
  easeCubicIn: Yd,
  easeCubicOut: Wd,
  easeCubicInOut: mr,
  easeCircIn: Qd,
  easeCircOut: eu,
  easeCircInOut: tu,
  easeSinIn: jd,
  easeSinOut: Ud,
  easeSinInOut: Zd,
  easeExpoIn: Kd,
  easeExpoOut: Gd,
  easeExpoInOut: Jd,
  easeBounce: Yn,
  easeBounceIn: du,
  easeBounceInOut: uu,
  easeElastic: mu,
  easeElasticIn: gu,
  easeElasticInOut: yu,
  easeBack: pu,
  easeBackIn: fu,
  easeBackOut: hu
};
function Cr(t) {
  const e = t ?? "auto";
  return e === !1 ? !1 : e === !0 ? !0 : typeof globalThis < "u" && globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === !0;
}
function Zn(t) {
  return typeof t == "function" ? t : Ou[t ?? "easeInOut"];
}
function et(t, e, n) {
  return t + (e - t) * n;
}
function hi(t, e, n) {
  return Fo(t, e)(n);
}
function pn(t) {
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
const ji = /^(-?\d+\.?\d*)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch)?$/, Ui = /^(#|rgb|hsl)/;
function Sr(t, e, n) {
  const o = {}, i = /* @__PURE__ */ new Set([...Object.keys(t), ...Object.keys(e)]);
  for (const r of i) {
    const s = t[r], l = e[r];
    if (s === void 0) {
      o[r] = l;
      continue;
    }
    if (l === void 0) {
      o[r] = s;
      continue;
    }
    const a = ji.exec(s), c = ji.exec(l);
    if (a && c) {
      const d = parseFloat(a[1]), u = parseFloat(c[1]), f = c[2] ?? "", h = et(d, u, n);
      o[r] = f ? `${h}${f}` : String(h);
      continue;
    }
    if (Ui.test(s) && Ui.test(l)) {
      o[r] = hi(s, l, n);
      continue;
    }
    o[r] = n < 0.5 ? s : l;
  }
  return o;
}
function zu(t, e, n, o) {
  let i = et(t.zoom, e.zoom, n);
  return o?.minZoom !== void 0 && (i = Math.max(i, o.minZoom)), o?.maxZoom !== void 0 && (i = Math.min(i, o.maxZoom)), {
    x: et(t.x, e.x, n),
    y: et(t.y, e.y, n),
    zoom: i
  };
}
class Vu {
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
class Bu {
  constructor() {
    this._handles = [], this._state = "active", this._propertySnapshots = /* @__PURE__ */ new Map(), this._onAfterRollback = null, this.finished = new Promise((e) => {
      this._resolveFinished = e;
    });
  }
  /**
   * @internal
   * Register a callback fired after `rollback()` has reverted all captured
   * properties. Receives the list of keys that were reverted. Used by the
   * canvas layer to flush DOM for the affected nodes — without it, raw-state
   * writes done outside the animation rAF loop never reach the DOM.
   *
   * Not part of the public API — do not call from application code. Canvas
   * wiring is managed internally in `$flow.transaction()`.
   */
  onAfterRollback(e) {
    this._onAfterRollback = e;
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
    if (this._state !== "active")
      return;
    for (const n of this._handles)
      n.stop({ mode: "freeze" });
    const e = [];
    for (const [n, o] of this._propertySnapshots)
      o.apply(o.value), e.push(n);
    this._state = "rolled-back", this._onAfterRollback?.(e), this._resolveFinished();
  }
}
const Zt = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  restVelocity: 0.01,
  restDisplacement: 0.01
};
function kr(t, e, n) {
  if (n <= 0)
    return;
  const o = e.stiffness ?? Zt.stiffness, i = e.damping ?? Zt.damping, r = e.mass ?? Zt.mass, s = t.value - t.target, l = (-o * s - i * t.velocity) / r;
  t.velocity += l * n, t.value += t.velocity * n, Math.abs(t.velocity) < (e.restVelocity ?? Zt.restVelocity) && Math.abs(t.value - t.target) < (e.restDisplacement ?? Zt.restDisplacement) && (t.value = t.target, t.velocity = 0, t.settled = !0);
}
const Zi = {
  timeConstant: 350,
  restVelocity: 0.5
};
function pi(t, e, n) {
  if (n <= 0)
    return;
  const o = e.timeConstant ?? Zi.timeConstant, i = Math.exp(-n * 1e3 / o);
  t.velocity *= i, t.value += t.velocity * n, Math.abs(t.velocity) < Zi.restVelocity && (t.velocity = 0, t.settled = !0, t.target = t.value);
}
function gi(t) {
  const e = t.lastIndexOf("."), n = t.lastIndexOf(":"), o = Math.max(e, n);
  if (o < 0) return null;
  const i = t.slice(o + 1);
  return i.length === 0 || i.length > 6 ? null : i;
}
function Lr(t, e, n, o) {
  if (n <= 0)
    return;
  pi(t, {
    velocity: t.velocity,
    power: e.power,
    timeConstant: e.timeConstant
  }, n);
  const i = o ? gi(o) : null;
  if (e.bounds && o) {
    const r = e.bounds[o] ?? (i ? e.bounds[i] : void 0);
    if (r) {
      const [s, l] = r, a = (e.bounceStiffness ?? 200) / 500, c = (e.bounceDamping ?? 40) / 100, d = a * (1 - c);
      t.value < s ? (t.value = s, t.velocity = Math.abs(t.velocity) * d, t.settled = !1) : t.value > l && (t.value = l, t.velocity = -Math.abs(t.velocity) * d, t.settled = !1);
    }
  }
  if (t.settled && e.snapTo?.length && o) {
    let r = t.value, s = 1 / 0;
    for (const l of e.snapTo) {
      const a = l[o] ?? (i ? l[i] : void 0);
      if (a !== void 0) {
        const c = Math.abs(t.value - a);
        c < s && (s = c, r = a);
      }
    }
    t.value = r;
  }
}
function Pr(t, e, n, o) {
  const i = gi(o), r = e.values.map(
    (g) => g[o] ?? (i ? g[i] : void 0) ?? t.value
  );
  if (r.length < 2) {
    t.value = r[0] ?? t.value, t.settled = !0;
    return;
  }
  const s = e.offsets ?? r.map((g, p) => p / (r.length - 1)), l = Math.max(0, Math.min(1, n));
  let a = 0;
  for (let g = 0; g < s.length - 1; g++)
    l >= s[g] && (a = g);
  const c = s[a], d = s[a + 1] ?? 1, u = d > c ? (l - c) / (d - c) : 1, f = r[a], h = r[a + 1] ?? r[a];
  t.value = f + (h - f) * Math.max(0, Math.min(1, u)), l >= 1 && (t.value = r[r.length - 1], t.settled = !0);
}
const Ki = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  wobbly: { type: "spring", stiffness: 180, damping: 12 },
  stiff: { type: "spring", stiffness: 300, damping: 30 },
  slow: { type: "spring", stiffness: 60, damping: 15 },
  molasses: { type: "spring", stiffness: 40, damping: 30 }
}, Gi = {
  smooth: { type: "decay", velocity: 0, power: 0.6, timeConstant: 400 },
  snappy: { type: "decay", velocity: 0, power: 1.2, timeConstant: 200 }
}, Ji = {
  momentum: { type: "inertia", velocity: 0, power: 0.8, timeConstant: 700 },
  rails: { type: "inertia", velocity: 0, bounceStiffness: 500, bounceDamping: 40 }
};
function Mr(t) {
  if (typeof t != "string")
    return t;
  const [e, n] = t.split(".");
  if (!n)
    return null;
  switch (e) {
    case "spring":
      return Ki[n] ? { ...Ki[n] } : null;
    case "decay":
      return Gi[n] ? { ...Gi[n] } : null;
    case "inertia":
      return Ji[n] ? { ...Ji[n] } : null;
    default:
      return null;
  }
}
function Qi(t) {
  return typeof t != "string" ? !1 : /^(#|rgb|hsl)/.test(t);
}
function qu(t, e, n) {
  return typeof t == "number" && typeof e == "number" ? et(t, e, n) : Qi(t) && Qi(e) ? hi(t, e, n) : n < 0.5 ? t : e;
}
class Xu {
  constructor(e) {
    this._ownership = /* @__PURE__ */ new Map(), this._groups = /* @__PURE__ */ new Set(), this._nextGroupId = 0, this._registry = new Vu(), this._activeTransaction = null, this._engine = e;
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
    const e = new Bu();
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
      startAt: l,
      onStart: a,
      onProgress: c,
      onComplete: d,
      tag: u,
      tags: f,
      while: h,
      whileStopMode: g = "jump-end",
      motion: p,
      maxDuration: y = 5e3
    } = n, m = Zn(i), x = p ? Mr(p) : void 0;
    for (const _ of e) {
      const D = this._ownership.get(_.key);
      if (D && !D.stopped) {
        const P = D.currentValues.get(_.key);
        P !== void 0 && (_.from = P), D.entries = D.entries.filter((R) => R.key !== _.key), D.entries.length === 0 && this._stop(D, "superseded");
      }
    }
    if (this._activeTransaction && this._activeTransaction.state === "active")
      for (const _ of e)
        this._activeTransaction.captureProperty(_.key, _.from, _.apply);
    if (o <= 0) {
      const _ = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
      for (const G of e)
        _.set(G.key, G.from), D.set(G.key, G.to);
      a?.();
      for (const G of e)
        G.apply(G.to);
      const P = [...u ? [u] : [], ...f ?? []], R = {
        _tags: P.length > 0 ? P : void 0,
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
          return D;
        },
        finished: Promise.resolve(),
        get _snapshot() {
          return _;
        },
        get _target() {
          return D;
        }
      };
      return this._registry.register(R), queueMicrotask(() => this._registry.unregister(R)), this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(R), d?.(), R;
    }
    const M = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
    for (const _ of e)
      M.set(_.key, _.from), v.set(_.key, _.to);
    let C;
    if (x) {
      C = /* @__PURE__ */ new Map();
      for (const _ of e) {
        if (typeof _.from != "number" || typeof _.to != "number") {
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${_.key}" is non-numeric; snapping to target.`
          ), _.apply(_.to);
          continue;
        }
        let D = 0;
        if (x.type === "decay" || x.type === "inertia") {
          const P = x.velocity;
          if (typeof P == "number")
            D = P;
          else if (P && typeof P == "object") {
            const G = P, ee = gi(_.key);
            D = G[_.key] ?? (ee ? G[ee] ?? 0 : 0);
          }
          const R = x.power ?? 0.8;
          D *= R;
        }
        C.set(_.key, {
          value: _.from,
          velocity: D,
          target: _.to,
          settled: !1
        });
      }
      C.size === 0 && (C = void 0);
    }
    const S = s === "ping-pong" ? "reverse" : s, k = l === "end" ? "backward" : "forward";
    let I;
    const b = new Promise((_) => {
      I = _;
    }), E = {
      _id: this._nextGroupId++,
      entries: [...e],
      engineHandle: null,
      startTime: 0,
      pausedElapsed: null,
      _resumeNeeded: !1,
      direction: k,
      duration: o,
      easingFn: m,
      loop: S,
      onStart: a,
      startFired: !1,
      onProgress: c,
      onComplete: d,
      resolve: I,
      stopped: !1,
      isFinished: !1,
      currentValues: /* @__PURE__ */ new Map(),
      _lastElapsed: 0,
      _lastTickWallTime: 0,
      snapshot: M,
      target: v,
      _currentFinished: b,
      whilePredicate: h,
      whileStopMode: g,
      motionConfig: C ? x : void 0,
      physicsStates: C,
      maxDuration: y,
      isPhysics: !!C,
      _prevElapsed: 0
    };
    if (l === "end")
      for (const _ of E.entries)
        _.apply(_.to), E.currentValues.set(_.key, _.to);
    else
      for (const _ of E.entries)
        E.currentValues.set(_.key, _.from);
    for (const _ of e)
      this._ownership.set(_.key, E);
    this._groups.add(E);
    const A = this._engine.register((_) => this._tick(E, _), r);
    E.engineHandle = A;
    const L = [...u ? [u] : [], ...f ?? []], w = {
      _tags: L.length > 0 ? L : void 0,
      pause: () => this._pause(E),
      resume: () => this._resume(E),
      stop: (_) => this._stop(E, _?.mode ?? "jump-end"),
      reverse: () => this._reverse(E),
      play: () => this._play(E),
      playForward: () => this._playDirection(E, "forward"),
      playBackward: () => this._playDirection(E, "backward"),
      restart: (_) => this._restart(E, _),
      get direction() {
        return E.direction;
      },
      get isFinished() {
        return E.isFinished;
      },
      get currentValue() {
        return E.currentValues;
      },
      get finished() {
        return E._currentFinished;
      },
      get _snapshot() {
        return E.snapshot;
      },
      get _target() {
        return E.target;
      }
    };
    return this._registry.register(w), E._handle = w, this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(w), w;
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
    e._resumeNeeded && (e.startTime += n - e._lastElapsed, e._resumeNeeded = !1), e.startTime === 0 && (e.startTime = n), e.startFired || (e.startFired = !0, e.onStart?.()), e._lastElapsed = n, e._lastTickWallTime = typeof performance < "u" ? performance.now() : Date.now();
    const o = n - e.startTime;
    let i = Math.min(o / e.duration, 1);
    if (e.loop && i >= 1)
      if (e.loop === "reverse") {
        const l = o / e.duration, a = Math.floor(l), c = l - a;
        i = a % 2 === 0 ? c : 1 - c;
      } else
        i = o % e.duration / e.duration;
    const r = e.direction === "backward" ? 1 - i : i, s = e.easingFn(r);
    for (const l of e.entries) {
      const a = qu(l.from, l.to, s);
      e.currentValues.set(l.key, a), l.apply(a);
    }
    if (e.onProgress?.(r), !e.loop && i >= 1) {
      for (const l of e.entries) {
        const a = e.direction === "backward" ? l.from : l.to;
        l.apply(a), e.currentValues.set(l.key, a);
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
    if (e._prevElapsed = n, e._lastElapsed = n, e._lastTickWallTime = typeof performance < "u" ? performance.now() : Date.now(), i <= 0)
      return;
    const r = e.physicsStates;
    let s = !0;
    for (const c of e.entries) {
      const d = r.get(c.key);
      if (d) {
        if (!d.settled) {
          switch (e.direction === "backward" ? d.target = e.snapshot.get(c.key) : d.target = e.target.get(c.key), e.motionConfig.type) {
            case "spring":
              kr(d, e.motionConfig, i);
              break;
            case "decay":
              pi(d, e.motionConfig, i);
              break;
            case "inertia":
              Lr(d, e.motionConfig, i, c.key);
              break;
            case "keyframes": {
              const u = n - e.startTime, f = e.motionConfig.duration ?? e.maxDuration, h = Math.min(u / f, 1);
              Pr(d, e.motionConfig, h, c.key);
              break;
            }
          }
          e.currentValues.set(c.key, d.value), c.apply(d.value);
        }
        d.settled || (s = !1);
      }
    }
    const l = n - e.startTime, a = Math.min(l / e.maxDuration, 1);
    if (e.onProgress?.(a), l >= e.maxDuration) {
      for (const [c, d] of r)
        if (!d.settled) {
          d.value = d.target, d.velocity = 0, d.settled = !0;
          const u = e.entries.find((f) => f.key === c);
          u && (u.apply(d.value), e.currentValues.set(u.key, d.value));
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
      if (e._lastElapsed === 0 && e.startTime === 0) {
        e.startTime = -e.duration;
        return;
      }
      if (e._lastElapsed > 0) {
        const n = this._estimatedCurrentElapsed(e), o = Math.min((n - e.startTime) / e.duration, 1);
        e.startTime = n - (1 - o) * e.duration;
      }
    }
  }
  /**
   * Best estimate of the current elapsed time for a group, accounting for
   * wall-clock time that has passed since the last engine tick. Used by
   * reverse/restart/play-direction paths that run synchronously from user
   * input between ticks — without this correction, _lastElapsed can be up
   * to 16ms stale and causes a visible direction-flip jump.
   */
  _estimatedCurrentElapsed(e) {
    if (e._lastTickWallTime <= 0) return e._lastElapsed;
    const n = typeof performance < "u" ? performance.now() : Date.now(), o = Math.max(0, n - e._lastTickWallTime);
    return e._lastElapsed + Math.min(o, 32);
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
      else if (o && e._lastElapsed > 0) {
        const i = this._estimatedCurrentElapsed(e), r = Math.min((i - e.startTime) / e.duration, 1);
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
const Tr = /* @__PURE__ */ new Map();
function Yu(t, e) {
  Tr.set(t, e);
}
function _o(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function $t(t) {
  return typeof t == "string" ? { type: t } : t;
}
function It(t, e) {
  return `${e}__${t.type}__${(t.color ?? fi).replace(/[^a-zA-Z0-9]/g, "_")}`;
}
function Kn(t, e) {
  const n = _o(t.color ?? fi), o = Number(t.width ?? 12.5), i = Number(t.height ?? 12.5), r = Number.isFinite(o) && o > 0 ? o : 12.5, s = Number.isFinite(i) && i > 0 ? i : 12.5, l = _o(t.orient ?? "auto-start-reverse"), a = _o(e);
  if (t.type === "arrow")
    return `<marker
      id="${a}"
      viewBox="-10 -10 20 20"
      markerWidth="${r}"
      markerHeight="${s}"
      orient="${l}"
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
      id="${a}"
      viewBox="-10 -10 20 20"
      markerWidth="${r}"
      markerHeight="${s}"
      orient="${l}"
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
  const c = Tr.get(t.type);
  return c ? c({ id: a, color: n, width: r, height: s, orient: l }) : Kn({ ...t, type: "arrowclosed" }, e);
}
const gt = 200, mt = 150, Wu = 1.2, Kt = "http://www.w3.org/2000/svg";
function ju(t, e) {
  const { getState: n, setViewport: o, config: i } = e, r = i.minimapPosition ?? "bottom-right", s = i.minimapMaskColor, l = i.minimapNodeColor, a = document.createElement("div");
  a.className = `flow-minimap flow-minimap-${r}`;
  const c = document.createElementNS(Kt, "svg");
  c.setAttribute("width", String(gt)), c.setAttribute("height", String(mt));
  const d = document.createElementNS(Kt, "rect");
  d.classList.add("flow-minimap-bg"), d.setAttribute("width", String(gt)), d.setAttribute("height", String(mt));
  const u = document.createElementNS(Kt, "g");
  u.classList.add("flow-minimap-nodes");
  const f = document.createElementNS(Kt, "path");
  f.classList.add("flow-minimap-mask"), s && f.setAttribute("fill", s), f.setAttribute("fill-rule", "evenodd"), c.appendChild(d), c.appendChild(u), c.appendChild(f), a.appendChild(c), t.appendChild(a);
  let h = { x: 0, y: 0, width: 0, height: 0 }, g = 1;
  function p() {
    const A = n();
    if (h = Vt(A.nodes.filter((L) => !L.hidden), i.nodeOrigin), h.width === 0 && h.height === 0) {
      g = 1;
      return;
    }
    g = Math.max(
      h.width / gt,
      h.height / mt
    ) * Wu;
  }
  function y(A) {
    return typeof l == "function" ? l(A) : l;
  }
  function m() {
    const A = n();
    p(), u.innerHTML = "";
    const L = (gt - h.width / g) / 2, w = (mt - h.height / g) / 2;
    for (const _ of A.nodes) {
      if (_.hidden) continue;
      const D = document.createElementNS(Kt, "rect"), P = (_.dimensions?.width ?? _e) / g, R = (_.dimensions?.height ?? be) / g, G = (_.position.x - h.x) / g + L, ee = (_.position.y - h.y) / g + w;
      D.setAttribute("x", String(G)), D.setAttribute("y", String(ee)), D.setAttribute("width", String(P)), D.setAttribute("height", String(R)), D.setAttribute("rx", "2");
      const J = y(_);
      J && (D.style.fill = J), u.appendChild(D);
    }
    x();
  }
  function x() {
    const A = e.getViewportState ? e.getViewportState() : n();
    if (h.width === 0 && h.height === 0) {
      f.setAttribute("d", "");
      return;
    }
    const L = (gt - h.width / g) / 2, w = (mt - h.height / g) / 2, _ = (-A.viewport.x / A.viewport.zoom - h.x) / g + L, D = (-A.viewport.y / A.viewport.zoom - h.y) / g + w, P = A.containerWidth / A.viewport.zoom / g, R = A.containerHeight / A.viewport.zoom / g, G = `M0,0 H${gt} V${mt} H0 Z`, ee = `M${_},${D} h${P} v${R} h${-P} Z`;
    f.setAttribute("d", `${G} ${ee}`);
  }
  let M = !1;
  function v(A, L) {
    const w = (gt - h.width / g) / 2, _ = (mt - h.height / g) / 2, D = (A - w) * g + h.x, P = (L - _) * g + h.y;
    return { x: D, y: P };
  }
  function C(A) {
    const L = c.getBoundingClientRect(), w = A.clientX - L.left, _ = A.clientY - L.top, D = n(), P = v(w, _), R = -P.x * D.viewport.zoom + D.containerWidth / 2, G = -P.y * D.viewport.zoom + D.containerHeight / 2;
    o({ x: R, y: G, zoom: D.viewport.zoom });
  }
  function S(A) {
    i.minimapPannable && (M = !0, c.setPointerCapture(A.pointerId), C(A));
  }
  function k(A) {
    M && C(A);
  }
  function I(A) {
    M && (M = !1, c.releasePointerCapture(A.pointerId));
  }
  c.addEventListener("pointerdown", S), c.addEventListener("pointermove", k), c.addEventListener("pointerup", I);
  function b(A) {
    if (!i.minimapZoomable)
      return;
    A.preventDefault();
    const L = n(), w = i.minZoom ?? 0.5, _ = i.maxZoom ?? 2, D = A.deltaY > 0 ? 0.9 : 1.1, P = Math.min(Math.max(L.viewport.zoom * D, w), _);
    o({ zoom: P });
  }
  c.addEventListener("wheel", b, { passive: !1 });
  function E() {
    c.removeEventListener("pointerdown", S), c.removeEventListener("pointermove", k), c.removeEventListener("pointerup", I), c.removeEventListener("wheel", b), a.remove();
  }
  return { render: m, updateViewport: x, destroy: E };
}
const Uu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', Zu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>', Ku = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', es = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', Gu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', Ju = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>', ts = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>', Qu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6H3"/><path d="M15 3v6h6"/><path d="M9 21v-6H3"/><path d="M15 21v-6h6"/></svg>';
function ef(t, e) {
  const {
    position: n,
    orientation: o,
    showZoom: i,
    showFitView: r,
    showInteractive: s,
    showResetPanels: l,
    external: a,
    onZoomIn: c,
    onZoomOut: d,
    onFitView: u,
    onToggleInteractive: f,
    onResetPanels: h,
    onToggleFullscreen: g
  } = e, p = document.createElement("div"), y = [
    "flow-controls",
    `flow-controls-${o}`
  ];
  a ? y.push("flow-controls-external") : y.push(`flow-controls-${n}`), p.className = y.join(" "), p.setAttribute("role", "toolbar"), p.setAttribute("aria-label", "Flow controls");
  let m = null, x = null;
  if (i) {
    const C = Ct(Uu, "Zoom in", c), S = Ct(Zu, "Zoom out", d);
    p.appendChild(C), p.appendChild(S);
  }
  if (r) {
    const C = Ct(Ku, "Fit view", u);
    p.appendChild(C);
  }
  if (s && (m = Ct(es, "Toggle interactivity", f), p.appendChild(m)), l) {
    const C = Ct(Ju, "Reset panels", h);
    p.appendChild(C);
  }
  g && (x = Ct(ts, "Toggle fullscreen", g), x.classList.add("flow-controls-button-fullscreen"), p.appendChild(x)), p.addEventListener("mousedown", (C) => C.stopPropagation()), p.addEventListener("pointerdown", (C) => C.stopPropagation()), p.addEventListener("wheel", (C) => C.stopPropagation(), { passive: !1 }), t.appendChild(p);
  function M(C) {
    if (m && typeof C.isInteractive == "boolean") {
      Yo(m, C.isInteractive ? es : Gu);
      const S = C.isInteractive ? "Lock interactivity" : "Unlock interactivity";
      m.title = S, m.setAttribute("aria-label", S);
    }
    if (x && typeof C.isFullscreen == "boolean") {
      Yo(x, C.isFullscreen ? Qu : ts);
      const S = C.isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
      x.title = S, x.setAttribute("aria-label", S), x.classList.toggle("flow-controls-button-fullscreen--active", C.isFullscreen);
    }
  }
  function v() {
    p.remove();
  }
  return { update: M, destroy: v };
}
function Ct(t, e, n) {
  const o = document.createElement("button");
  return o.type = "button", Yo(o, t), o.title = e, o.setAttribute("aria-label", e), o.addEventListener("click", n), o;
}
function Yo(t, e) {
  const o = new DOMParser().parseFromString(e, "image/svg+xml").documentElement;
  t.replaceChildren(o);
}
const ns = 5;
function tf(t) {
  const e = document.createElement("div");
  e.className = "flow-selection-box", t.appendChild(e);
  let n = !1, o = 0, i = 0, r = 0, s = 0;
  function l(f, h, g = "partial") {
    o = f, i = h, r = f, s = h, n = !0, e.style.left = `${f}px`, e.style.top = `${h}px`, e.style.width = "0px", e.style.height = "0px", e.classList.remove("flow-selection-partial", "flow-selection-full"), e.classList.add("flow-selection-box-active", `flow-selection-${g}`);
  }
  function a(f, h) {
    if (!n)
      return;
    r = f, s = h;
    const g = Math.min(o, r), p = Math.min(i, s), y = Math.abs(r - o), m = Math.abs(s - i);
    e.style.left = `${g}px`, e.style.top = `${p}px`, e.style.width = `${y}px`, e.style.height = `${m}px`;
  }
  function c(f) {
    if (!n)
      return null;
    n = !1, e.classList.remove("flow-selection-box-active"), e.classList.remove("flow-selection-partial", "flow-selection-full");
    const h = Math.abs(r - o), g = Math.abs(s - i);
    if (h < ns && g < ns)
      return null;
    const p = Math.min(o, r), y = Math.min(i, s), m = (p - f.x) / f.zoom, x = (y - f.y) / f.zoom, M = h / f.zoom, v = g / f.zoom;
    return { x: m, y: x, width: M, height: v };
  }
  function d() {
    return n;
  }
  function u() {
    e.remove();
  }
  return { start: l, update: a, end: c, isActive: d, destroy: u };
}
const os = 3;
function nf(t) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.classList.add("flow-lasso-svg"), e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), t.appendChild(e);
  const n = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  n.classList.add("flow-lasso-path"), e.appendChild(n);
  let o = !1, i = [];
  function r(d, u, f = "partial") {
    o = !0, i = [{ x: d, y: u }], e.classList.remove("flow-lasso-partial", "flow-lasso-full"), e.classList.add("flow-lasso-active", `flow-lasso-${f}`), n.setAttribute("points", `${d},${u}`);
  }
  function s(d, u) {
    if (!o)
      return;
    const f = i[i.length - 1], h = d - f.x, g = u - f.y;
    h * h + g * g < os * os || (i.push({ x: d, y: u }), n.setAttribute("points", i.map((p) => `${p.x},${p.y}`).join(" ")));
  }
  function l(d) {
    if (!o || (o = !1, e.classList.remove("flow-lasso-active", "flow-lasso-partial", "flow-lasso-full"), n.setAttribute("points", ""), i.length < 3))
      return null;
    const u = i.map((f) => ({
      x: (f.x - d.x) / d.zoom,
      y: (f.y - d.y) / d.zoom
    }));
    return i = [], u;
  }
  function a() {
    return o;
  }
  function c() {
    e.remove();
  }
  return { start: r, update: s, end: l, isActive: a, destroy: c };
}
function mi(t, e, n) {
  if (n.length < 3) return !1;
  let o = !1;
  for (let i = 0, r = n.length - 1; i < n.length; r = i++) {
    const s = n[i].x, l = n[i].y, a = n[r].x, c = n[r].y;
    l > e != c > e && t < (a - s) * (e - l) / (c - l) + s && (o = !o);
  }
  return o;
}
function of(t, e, n, o, i, r, s, l) {
  const a = n - t, c = o - e, d = s - i, u = l - r, f = a * u - c * d;
  if (Math.abs(f) < 1e-10) return !1;
  const h = i - t, g = r - e, p = (h * u - g * d) / f, y = (h * c - g * a) / f;
  return p >= 0 && p <= 1 && y >= 0 && y <= 1;
}
function sf(t, e) {
  const n = e.x, o = e.y, i = e.x + e.width, r = e.y + e.height, s = n + e.width / 2, l = o + e.height / 2;
  if (mi(s, l, t)) return !0;
  for (const c of t)
    if (c.x >= n && c.x <= i && c.y >= o && c.y <= r) return !0;
  const a = [
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
    for (const [u, f, h, g] of a)
      if (of(t[d].x, t[d].y, t[c].x, t[c].y, u, f, h, g))
        return !0;
  return !1;
}
function Ar(t) {
  const e = t.dimensions?.width ?? _e, n = t.dimensions?.height ?? be;
  return t.rotation ? po(t.position.x, t.position.y, e, n, t.rotation) : { x: t.position.x, y: t.position.y, width: e, height: n };
}
function rf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Ar(n);
    return sf(e, o);
  });
}
function af(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Ar(n);
    return [
      { x: o.x, y: o.y },
      { x: o.x + o.width, y: o.y },
      { x: o.x + o.width, y: o.y + o.height },
      { x: o.x, y: o.y + o.height }
    ].every((r) => mi(r.x, r.y, e));
  });
}
function lf(t, e) {
  return e.filter((n) => n.source === t || n.target === t);
}
function Wo(t, e, n) {
  const o = new Set(
    n.filter((i) => i.source === t).map((i) => i.target)
  );
  return e.filter((i) => o.has(i.id));
}
function cf(t, e, n) {
  const o = new Set(
    n.filter((i) => i.target === t).map((i) => i.source)
  );
  return e.filter((i) => o.has(i.id));
}
function df(t, e, n) {
  if (t === e) return !0;
  const o = /* @__PURE__ */ new Map();
  for (const s of n) {
    let l = o.get(s.source);
    l || (l = [], o.set(s.source, l)), l.push(s.target);
  }
  const i = [e], r = /* @__PURE__ */ new Set();
  for (; i.length > 0; ) {
    const s = i.pop();
    if (s === t) return !0;
    if (r.has(s)) continue;
    r.add(s);
    const l = o.get(s);
    if (l)
      for (const a of l)
        r.has(a) || i.push(a);
  }
  return !1;
}
function uf(t, e, n, o = !1) {
  return n.some((i) => o ? i.source === t && i.target === e : i.source === t && i.target === e || i.source === e && i.target === t);
}
function ff(t, e, n) {
  const o = new Map(e.map((a) => [a.id, a])), i = new Set(
    n.map((a) => `${a.source}|${a.target}|${a.sourceHandle ?? ""}|${a.targetHandle ?? ""}`)
  ), r = [], s = /* @__PURE__ */ new Set();
  let l = 0;
  for (const a of t) {
    if (o.get(a)?.reconnectOnDelete === !1) continue;
    const d = n.filter(
      (f) => f.target === a && !t.has(f.source)
    ), u = n.filter(
      (f) => f.source === a && !t.has(f.target)
    );
    if (!(d.length === 0 || u.length === 0))
      for (const f of d)
        for (const h of u) {
          if (f.source === h.target) continue;
          const g = `${f.source}|${h.target}|${f.sourceHandle ?? ""}|${h.targetHandle ?? ""}`;
          if (i.has(g) || s.has(g)) continue;
          const p = {
            id: `reconnect-${f.source}-${h.target}-${l++}`,
            source: f.source,
            target: h.target,
            sourceHandle: f.sourceHandle,
            targetHandle: h.targetHandle
          };
          f.type && (p.type = f.type), f.animated !== void 0 && (p.animated = f.animated), f.style && (p.style = f.style), f.class && (p.class = f.class), f.markerEnd && (p.markerEnd = f.markerEnd), f.markerStart && (p.markerStart = f.markerStart), f.label && (p.label = f.label), s.add(g), r.push(p);
        }
  }
  return r;
}
function at(t, e, n) {
  if (!e) return !0;
  const o = n.get(t.source), i = n.get(t.target);
  if (!o || !i) return !0;
  const { byType: r } = e;
  if (r) {
    const s = o.type ?? "";
    if (Object.prototype.hasOwnProperty.call(r, s) && !r[s].includes(i.type ?? ""))
      return !1;
  }
  return !(typeof e.validate == "function" && !e.validate(t, o, i));
}
function lt(t, e, n) {
  return !(t.source === t.target || e.some(
    (i) => i.source === t.source && i.target === t.target && i.sourceHandle === t.sourceHandle && i.targetHandle === t.targetHandle
  ) || n?.preventCycles && df(t.source, t.target, e));
}
const ct = "_flowHandleValidate";
function hf(t) {
  t.directive(
    "flow-handle-validate",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      function s() {
        let l;
        try {
          l = o(n);
        } catch {
          const a = t.$data(e);
          a && typeof a[n] == "function" && (l = a[n]);
        }
        typeof l == "function" ? e[ct] = l : (delete e[ct], requestAnimationFrame(() => {
          const a = t.$data(e);
          a && typeof a[n] == "function" && (e[ct] = a[n]);
        }));
      }
      i(() => {
        s();
      }), r(() => {
        delete e[ct];
      });
    }
  );
}
const _t = "_flowHandleLimit";
function pf(t) {
  t.directive(
    "flow-handle-limit",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      i(() => {
        const s = Number(o(n));
        s > 0 ? e[_t] = s : delete e[_t];
      }), r(() => {
        delete e[_t];
      });
    }
  );
}
const Dt = "_flowHandleConnectableStart", dt = "_flowHandleConnectableEnd";
function gf(t) {
  t.directive(
    "flow-handle-connectable",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("start"), a = o.includes("end"), c = l || !l && !a, d = a || !l && !a;
      r(() => {
        const u = n ? !!i(n) : !0;
        c && (e[Dt] = u), d && (e[dt] = u);
      }), s(() => {
        delete e[Dt], delete e[dt];
      });
    }
  );
}
function wn(t, e, n = !0) {
  return e !== void 0 ? e : t.locked ? !1 : n;
}
function Nr(t) {
  return wn(t, t.draggable);
}
function mf(t) {
  return wn(t, t.deletable);
}
function Ve(t) {
  return wn(t, t.connectable);
}
function jo(t) {
  return wn(t, t.selectable);
}
function is(t) {
  return wn(t, t.resizable);
}
function Bt(t, e, n, o, i, r, s) {
  const l = n - t, a = o - e, c = i - n, d = r - o;
  if (l === 0 && c === 0 || a === 0 && d === 0)
    return `L${n},${o}`;
  const u = Math.sqrt(l * l + a * a), f = Math.sqrt(c * c + d * d), h = Math.min(s, u / 2, f / 2), g = n - l / u * h, p = o - a / u * h, y = n + c / f * h, m = o + d / f * h;
  return `L${g},${p} Q${n},${o} ${y},${m}`;
}
function vn({
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
function Ln(t, e) {
  return t >= 0 ? 0.5 * t : e * 25 * Math.sqrt(-t);
}
function yf({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  curvature: s = 0.25
}) {
  const l = n === "left" || n === "right", a = r === "left" || r === "right", c = l ? t + (n === "right" ? 1 : -1) * Ln(
    n === "right" ? o - t : t - o,
    s
  ) : t, d = l ? e : e + (n === "bottom" ? 1 : -1) * Ln(
    n === "bottom" ? i - e : e - i,
    s
  ), u = a ? o + (r === "right" ? 1 : -1) * Ln(
    r === "right" ? t - o : o - t,
    s
  ) : o, f = a ? i : i + (r === "bottom" ? 1 : -1) * Ln(
    r === "bottom" ? e - i : i - e,
    s
  );
  return [c, d, u, f];
}
function Gn(t) {
  const { sourceX: e, sourceY: n, targetX: o, targetY: i } = t, [r, s, l, a] = yf(t), c = `M${e},${n} C${r},${s} ${l},${a} ${o},${i}`, { x: d, y: u, offsetX: f, offsetY: h } = vn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function iy({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = (t + n) / 2, r = `M${t},${e} C${i},${e} ${i},${o} ${n},${o}`, { x: s, y: l, offsetX: a, offsetY: c } = vn({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: r,
    labelPosition: { x: s, y: l },
    labelOffsetX: a,
    labelOffsetY: c
  };
}
function ss(t) {
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
function wf(t, e, n, o, i, r, s) {
  const l = ss(n), a = ss(r), c = t + l.x * s, d = e + l.y * s, u = o + a.x * s, f = i + a.y * s, h = n === "left" || n === "right";
  if (h === (r === "left" || r === "right")) {
    const p = (c + u) / 2, y = (d + f) / 2;
    return h ? [
      [c, e],
      [p, e],
      [p, i],
      [u, i]
    ] : [
      [t, d],
      [t, y],
      [o, y],
      [o, f]
    ];
  }
  return h ? [
    [c, e],
    [o, e],
    [o, f]
  ] : [
    [t, d],
    [t, i],
    [u, i]
  ];
}
function gn({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  borderRadius: s = 5,
  offset: l = 10
}) {
  const a = wf(
    t,
    e,
    n,
    o,
    i,
    r,
    l
  );
  let c = `M${t},${e}`;
  for (let g = 0; g < a.length; g++) {
    const [p, y] = a[g];
    if (s > 0 && g > 0 && g < a.length - 1) {
      const [m, x] = g === 1 ? [t, e] : a[g - 1], [M, v] = a[g + 1];
      c += ` ${Bt(m, x, p, y, M, v, s)}`;
    } else
      c += ` L${p},${y}`;
  }
  c += ` L${o},${i}`;
  const { x: d, y: u, offsetX: f, offsetY: h } = vn({ sourceX: t, sourceY: e, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function vf(t) {
  return gn({ ...t, borderRadius: 0 });
}
function $r({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = `M${t},${e} L${n},${o}`, { x: r, y: s, offsetX: l, offsetY: a } = vn({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: i,
    labelPosition: { x: r, y: s },
    labelOffsetX: l,
    labelOffsetY: a
  };
}
const ot = 40;
function _f(t, e, n, o) {
  let i = 0, r = 0;
  const s = t - n.left, l = n.right - t, a = e - n.top, c = n.bottom - e;
  return s < ot && s >= 0 ? i = -o * (1 - s / ot) : l < ot && l >= 0 && (i = o * (1 - l / ot)), a < ot && a >= 0 ? r = -o * (1 - a / ot) : c < ot && c >= 0 && (r = o * (1 - c / ot)), { dx: i, dy: r };
}
function Ir(t) {
  const { container: e, speed: n, onPan: o } = t;
  let i = null, r = 0, s = 0, l = !1;
  function a() {
    if (!l)
      return;
    const c = e.getBoundingClientRect(), { dx: d, dy: u } = _f(r, s, c, n);
    if ((d !== 0 || u !== 0) && o(d, u) === !0) {
      l = !1, i = null;
      return;
    }
    i = requestAnimationFrame(a);
  }
  return {
    start() {
      l || t.isLocked?.() || (l = !0, i = requestAnimationFrame(a));
    },
    stop() {
      l = !1, i !== null && (cancelAnimationFrame(i), i = null);
    },
    updatePointer(c, d) {
      r = c, s = d;
    },
    destroy() {
      this.stop();
    }
  };
}
function Rt(t) {
  const e = t.connectionLineType ?? "straight", o = {
    stroke: (t.invalid ? (t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-connection-line-invalid").trim() : "") || xr : null) ?? t.connectionLineStyle?.stroke ?? ((t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-edge-stroke-selected").trim() : "") || hn),
    strokeWidth: t.connectionLineStyle?.strokeWidth ?? Number(Iu),
    strokeDasharray: t.connectionLineStyle?.strokeDasharray ?? Du
  }, i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  i.setAttribute("class", "flow-connect-line"), i.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:1000;";
  let r = null;
  function s(a) {
    const c = {
      ...a,
      connectionLineType: e,
      connectionLineStyle: o
    };
    if (t.connectionLine) {
      r && r.remove(), r = t.connectionLine(c), i.appendChild(r);
      return;
    }
    r || (r = document.createElementNS("http://www.w3.org/2000/svg", "path"), r.setAttribute("fill", "none"), i.appendChild(r)), r.setAttribute("stroke", o.stroke), r.setAttribute("stroke-width", String(o.strokeWidth)), r.setAttribute("stroke-dasharray", o.strokeDasharray);
    const { fromX: d, fromY: u, toX: f, toY: h } = a;
    let g;
    switch (e) {
      case "bezier": {
        g = Gn({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "smoothstep": {
        g = gn({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "step": {
        g = vf({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      default: {
        g = $r({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
    }
    r.setAttribute("d", g);
  }
  function l() {
    i.remove();
  }
  return { svg: i, update: s, destroy: l };
}
function sn(t) {
  if (t.connectionSnapRadius <= 0)
    return { element: null, position: t.cursorFlowPos };
  const e = t.connectionMode === "loose" ? "[data-flow-handle-type]" : `[data-flow-handle-type="${t.handleType}"]`, n = t.containerEl.querySelectorAll(e);
  let o = null, i = t.cursorFlowPos, r = t.connectionSnapRadius;
  return n.forEach((s) => {
    const l = s, a = l.closest("[x-flow-node]");
    if (!a || a.dataset.flowNodeId === t.excludeNodeId || t.targetNodeId && a.dataset.flowNodeId !== t.targetNodeId) return;
    const c = a.dataset.flowNodeId;
    if (c) {
      const g = t.getNode(c);
      if (g && !Ve(g)) return;
    }
    const d = t.handleType === "target" ? dt : Dt;
    if (l[d] === !1) return;
    const u = l.getBoundingClientRect();
    if (u.width === 0 && u.height === 0) return;
    const f = t.toFlowPosition(
      u.left + u.width / 2,
      u.top + u.height / 2
    ), h = Math.sqrt(
      (t.cursorFlowPos.x - f.x) ** 2 + (t.cursorFlowPos.y - f.y) ** 2
    );
    h < r && (r = h, o = l, i = f);
  }), { element: o, position: i };
}
function Jn(t, e, n, o) {
  if (e._config?.autoPanOnConnect === !1) return null;
  const i = Ir({
    container: t,
    speed: e._config?.autoPanSpeed ?? 15,
    onPan(r, s) {
      const l = () => e._viewportLive ?? e.viewport, a = { x: l().x, y: l().y };
      e._panZoom?.setViewport({
        x: l().x - r,
        y: l().y - s,
        zoom: l().zoom
      });
      const c = a.x - l().x, d = a.y - l().y;
      return c === 0 && d === 0;
    }
  });
  return i.updatePointer(n, o), i.start(), i;
}
let tn = 0;
const Pn = /* @__PURE__ */ new WeakMap();
function Ke(t, e) {
  const n = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (n) {
    const i = e.sourceHandle ?? "source", r = n.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="source"]`
    ) ?? n.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[ct] && !r[ct](e))
      return !1;
  }
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (o) {
    const i = e.targetHandle ?? "target", r = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="target"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[ct] && !r[ct](e))
      return !1;
  }
  return !0;
}
function Ge(t, e, n) {
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (o) {
    const r = e.sourceHandle ?? "source", s = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="source"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[_t] && n.filter(
      (a) => a.source === e.source && (a.sourceHandle ?? "source") === (e.sourceHandle ?? "source")
    ).length >= s[_t])
      return !1;
  }
  const i = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (i) {
    const r = e.targetHandle ?? "target", s = i.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="target"]`
    ) ?? i.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[_t] && n.filter(
      (a) => a.target === e.target && (a.targetHandle ?? "target") === (e.targetHandle ?? "target")
    ).length >= s[_t])
      return !1;
  }
  return !0;
}
function rn(t, e, n, o, i) {
  const r = i ? o.edges.filter((l) => l.id !== i) : o.edges, s = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const l of s) {
    const c = l.closest("[x-flow-node]")?.dataset.flowNodeId;
    if (!c) continue;
    const d = l.dataset.flowHandleId ?? "target";
    if (l[dt] === !1) {
      l.classList.add("flow-handle-invalid"), l.classList.remove("flow-handle-valid", "flow-handle-limit-reached");
      continue;
    }
    const u = {
      source: e,
      sourceHandle: n,
      target: c,
      targetHandle: d
    }, h = o.getNode(c)?.connectable !== !1 && lt(u, r, { preventCycles: o._config?.preventCycles }), g = h && Ge(t, u, r);
    g && Ke(t, u) && (!o._config?.isValidConnection || o._config.isValidConnection(u)) ? (l.classList.add("flow-handle-valid"), l.classList.remove("flow-handle-invalid", "flow-handle-limit-reached")) : (l.classList.add("flow-handle-invalid"), l.classList.remove("flow-handle-valid"), h && !g ? l.classList.add("flow-handle-limit-reached") : l.classList.remove("flow-handle-limit-reached"));
  }
}
function Le(t) {
  const e = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const n of e)
    n.classList.remove("flow-handle-valid", "flow-handle-invalid", "flow-handle-limit-reached");
}
function wt(t, e) {
  t && (e ? t.classList.add("flow-connect-line--validating") : t.classList.remove("flow-connect-line--validating"));
}
function Te(t, e) {
  const n = {
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    reason: e.reason
  };
  t && (e.reason !== void 0 ? console.warn("[alpineflow] connection rejected:", e.reason) : console.warn("[alpineflow] connection rejected"), t.dispatchEvent(new CustomEvent("flow-connect-rejected", {
    detail: n,
    bubbles: !0
  })));
}
async function Qn(t, e, n, o, i, r) {
  if (!t) return { allowed: !0 };
  n?.classList.add(r), o?.classList.add(r), i.dispatchEvent(new CustomEvent("flow-connect-validating", {
    detail: { connection: e },
    bubbles: !0
  }));
  let s;
  try {
    s = await t(e);
  } catch (c) {
    B("connection", "connectValidator threw", c), s = !1;
  } finally {
    n?.classList.remove(r), o?.classList.remove(r);
  }
  const l = typeof s == "boolean" ? s : !!s?.allowed, a = typeof s == "object" && s && "reason" in s ? s.reason : void 0;
  return i.dispatchEvent(new CustomEvent("flow-connect-validated", {
    detail: { connection: e, allowed: l, reason: a },
    bubbles: !0
  })), { allowed: l, reason: a };
}
async function Dr(t) {
  const { edge: e, newConnection: n, canvas: o, containerEl: i } = t, r = t.endpoint ?? "target", s = o.edges.filter(
    (c) => c.id !== e.id
  ), l = (c) => (Te(i, {
    source: n.source,
    target: n.target,
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle,
    reason: c
  }), { applied: !1, reason: c });
  if (!lt(n, s, { preventCycles: o._config?.preventCycles }) || !at(n, o._config?.connectionRules, o._nodeMap) || !Ge(i, n, s) || !Ke(i, n) || o._config?.isValidConnection && !o._config.isValidConnection(n))
    return l();
  const a = o._config?.connectValidator;
  if (a) {
    const c = o._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: d, targetEl: u } = eo(i, n);
    o._connectValidating = !0;
    let f;
    try {
      f = await Qn(
        a,
        n,
        d,
        u,
        i,
        c
      );
    } finally {
      o._connectValidating = !1;
    }
    if (!f.allowed)
      return l(f.reason);
  }
  return o._captureHistory?.(), r === "source" ? (e.source = n.source, e.sourceHandle = n.sourceHandle) : (e.target = n.target, e.targetHandle = n.targetHandle), { applied: !0 };
}
async function Rr(t) {
  const { connection: e, canvas: n, containerEl: o } = t, i = n.edges, r = (d) => (Te(o, {
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    reason: d
  }), { applied: !1, reason: d }), s = n.getNode?.(e.target);
  if (s && !Ve(s) || !lt(e, i, { preventCycles: n._config?.preventCycles }) || !at(e, n._config?.connectionRules, n._nodeMap) || !Ge(o, e, i) || !Ke(o, e) || n._config?.isValidConnection && !n._config.isValidConnection(e))
    return r();
  const l = n._config?.connectValidator;
  if (l) {
    const d = n._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: u, targetEl: f } = eo(o, e);
    n._connectValidating = !0;
    let h;
    try {
      h = await Qn(
        l,
        e,
        u,
        f,
        o,
        d
      );
    } finally {
      n._connectValidating = !1;
    }
    if (!h.allowed)
      return r(h.reason);
  }
  const c = { id: `e-${e.source}-${e.target}-${Date.now()}-${tn++}`, ...e };
  return n.addEdges(c), n._emit?.("connect", { connection: e }), { applied: !0, edge: c };
}
function eo(t, e) {
  const n = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  ), o = e.sourceHandle ?? "source", i = n?.querySelector(
    `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="source"]`
  ) ?? n?.querySelector(`[data-flow-handle-id="${CSS.escape(o)}"]`) ?? null, r = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  ), s = e.targetHandle ?? "target", l = r?.querySelector(
    `[data-flow-handle-id="${CSS.escape(s)}"][data-flow-handle-type="target"]`
  ) ?? r?.querySelector(`[data-flow-handle-id="${CSS.escape(s)}"]`) ?? null;
  return { sourceEl: i, targetEl: l };
}
function bf(t) {
  t.directive(
    "flow-handle",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = n === "source" ? "source" : "target", c = o.includes("top"), d = o.includes("bottom"), u = o.includes("left"), f = o.includes("right"), h = c || d || u || f;
      let g;
      c && u ? g = "top-left" : c && f ? g = "top-right" : d && u ? g = "bottom-left" : d && f ? g = "bottom-right" : c ? g = "top" : f ? g = "right" : d ? g = "bottom" : u ? g = "left" : g = e.getAttribute("data-flow-handle-position") ?? (a === "source" ? "bottom" : "top");
      let p, y = !1;
      if (i) {
        const v = r(i);
        v && typeof v == "object" && !Array.isArray(v) ? (p = v.id || e.getAttribute("data-flow-handle-id") || a, v.position && (g = v.position, y = !0)) : p = v || e.getAttribute("data-flow-handle-id") || a;
      } else
        p = e.getAttribute("data-flow-handle-id") || a;
      if (o.includes("hidden") && (e.style.display = "none"), e.dataset.flowHandleType = a, e.dataset.flowHandlePosition = g, e.dataset.flowHandleId = p, h && (e.dataset.flowHandleExplicit = "true"), y && i && (e.dataset.flowHandleExplicit = "true", s(() => {
        const v = r(i);
        v && typeof v == "object" && !Array.isArray(v) && v.position && (e.dataset.flowHandlePosition = v.position);
      })), !h && !y) {
        const v = () => {
          const S = e.closest("[x-flow-node]")?.dataset.flowNodeId;
          if (!S) return;
          const k = e.closest("[x-data]");
          return k ? t.$data(k)?.getNode?.(S) : void 0;
        };
        s(() => {
          const C = v();
          if (!C) return;
          const S = a === "source" ? C.sourcePosition : C.targetPosition;
          S && (e.dataset.flowHandlePosition = S);
        });
      }
      e.classList.add("flow-handle", `flow-handle-${a}`);
      const m = () => {
        const v = e.closest("[x-flow-node]");
        return v ? v.getAttribute("data-flow-node-id") ?? null : null;
      }, x = () => {
        const v = e.closest("[x-data]");
        return v ? t.$data(v) : null;
      };
      let M = null;
      if (x()?._config?.keyboardConnect) {
        e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.setAttribute("aria-label", `${a} handle ${p}`);
        const C = (I) => {
          const b = I?._pendingKeyboardConnect;
          if (!b) return;
          const E = e.closest(".flow-container");
          E && E.querySelector(
            `[data-flow-node-id="${CSS.escape(b.sourceNodeId)}"] [data-flow-handle-id="${CSS.escape(b.sourceHandleId)}"][data-flow-handle-type="source"]`
          )?.classList.remove("flow-handle-connect-pending"), I && (I._pendingKeyboardConnect = null);
        }, S = (I) => {
          if (!(I.key === "Enter" || I.key === " " || I.key === "Spacebar")) return;
          const E = x();
          if (!E || E._animationLocked) return;
          const A = m();
          if (A)
            if (a === "source") {
              const L = E.getNode?.(A);
              if (L && !Ve(L) || e[Dt] === !1) return;
              I.preventDefault(), I.stopPropagation(), C(E), E._pendingKeyboardConnect = {
                sourceNodeId: A,
                sourceHandleId: p
              }, e.classList.add("flow-handle-connect-pending"), E._announcer?.announce?.(`Connecting from ${a} handle ${p}. Focus a target handle and press Enter to connect.`);
            } else {
              if (!E._pendingKeyboardConnect) return;
              const L = E.getNode?.(A);
              if (L && !Ve(L) || e[dt] === !1) return;
              I.preventDefault(), I.stopPropagation();
              const { sourceNodeId: w, sourceHandleId: _ } = E._pendingKeyboardConnect, D = {
                source: w,
                sourceHandle: _,
                target: A,
                targetHandle: p
              }, P = e.closest(".flow-container");
              if (C(E), !P) return;
              Rr({ connection: D, canvas: E, containerEl: P }).then((R) => {
                R.applied && E._announcer?.announce?.(`Connected ${w} to ${A}.`);
              });
            }
        };
        e.addEventListener("keydown", S);
        const k = e.closest(".flow-container");
        if (k) {
          const I = Pn.get(k);
          if (I)
            I.count += 1;
          else {
            const b = (E) => {
              if (E.key !== "Escape") return;
              const A = k.matches("[x-data]") ? k : k.closest("[x-data]") ?? k.querySelector("[x-data]");
              if (!A) return;
              const L = t.$data(A);
              L?._pendingKeyboardConnect && C(L);
            };
            k.addEventListener("keydown", b), Pn.set(k, { count: 1, handler: b });
          }
        }
        M = () => {
          if (e.removeEventListener("keydown", S), k) {
            const I = Pn.get(k);
            I && (I.count -= 1, I.count <= 0 && (k.removeEventListener("keydown", I.handler), Pn.delete(k)));
          }
          e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.classList.remove("flow-handle-connect-pending");
        };
      }
      if (a === "source") {
        let v = null;
        const C = (I) => {
          I.preventDefault(), I.stopPropagation();
          const b = x(), E = e.closest("[x-flow-node]");
          if (!b || !E || b._animationLocked) return;
          const A = E.dataset.flowNodeId;
          if (!A) return;
          const L = b.getNode(A);
          if (L && !Ve(L) || e[Dt] === !1) return;
          const w = I.clientX, _ = I.clientY;
          let D = !1;
          if (b.pendingConnection && b._config?.connectOnClick !== !1) {
            b._emit("connect-end", {
              connection: null,
              source: b.pendingConnection.source,
              sourceHandle: b.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), b.pendingConnection = null, b._container?.classList.remove("flow-connecting");
            const $ = e.closest(".flow-container");
            $ && Le($);
          }
          let P = null, R = null, G = null, ee = null, J = null;
          const T = b._config?.connectionSnapRadius ?? 20, N = e.closest(".flow-container");
          let O = 0, re = 0, le = !1, se = /* @__PURE__ */ new Map();
          const j = () => {
            if (D = !0, B("connection", `Connection drag started from node "${A}" handle "${p}"`), b._emit("connect-start", { source: A, sourceHandle: p }), !N) return;
            R = Rt({
              connectionLineType: b._config?.connectionLineType,
              connectionLineStyle: b._config?.connectionLineStyle,
              connectionLine: b._config?.connectionLine,
              containerEl: N
            }), P = R.svg;
            const $ = e.getBoundingClientRect(), te = N.getBoundingClientRect(), K = b._viewportLive ?? b.viewport, H = K?.zoom || 1, Y = K?.x || 0, oe = K?.y || 0;
            O = ($.left + $.width / 2 - te.left - Y) / H, re = ($.top + $.height / 2 - te.top - oe) / H, R.update({ fromX: O, fromY: re, toX: O, toY: re, source: A, sourceHandle: p });
            const ne = N.querySelector(".flow-viewport");
            if (ne && ne.appendChild(P), b.pendingConnection = {
              source: A,
              sourceHandle: p,
              position: { x: O, y: re }
            }, ee = Jn(N, b, w, _), rn(N, A, p, b), b._config?.onEdgeDrop) {
              const X = b._config.edgeDropPreview, F = X ? X({ source: A, sourceHandle: p }) : "New Node";
              if (F !== null) {
                J = document.createElement("div"), J.className = "flow-ghost-node";
                const ae = document.createElement("div");
                if (ae.className = "flow-ghost-handle", J.appendChild(ae), typeof F == "string") {
                  const ue = document.createElement("span");
                  ue.textContent = F, J.appendChild(ue);
                } else
                  J.appendChild(F);
                J.style.left = `${O}px`, J.style.top = `${re}px`;
                const Q = N.querySelector(".flow-viewport");
                Q && Q.appendChild(J);
              }
            }
          }, V = () => {
            const $ = [...b.selectedNodes], te = [], K = N.getBoundingClientRect(), H = b._viewportLive ?? b.viewport, Y = H?.zoom || 1, oe = H?.x || 0, ne = H?.y || 0;
            for (const X of $) {
              if (X === A) continue;
              const F = N?.querySelector(`[data-flow-node-id="${CSS.escape(X)}"]`)?.querySelector('[data-flow-handle-type="source"]');
              if (!F) continue;
              const ae = F.getBoundingClientRect();
              te.push({
                nodeId: X,
                handleId: F.dataset.flowHandleId ?? "source",
                pos: {
                  x: (ae.left + ae.width / 2 - K.left - oe) / Y,
                  y: (ae.top + ae.height / 2 - K.top - ne) / Y
                }
              });
            }
            return te;
          }, q = ($) => {
            le = !0, R && (se.set(A, {
              line: R,
              sourceNodeId: A,
              sourceHandleId: p,
              sourcePos: { x: O, y: re },
              valid: !0
            }), R = null);
            const te = V(), K = N.querySelector(".flow-viewport");
            for (const H of te) {
              const Y = Rt({
                connectionLineType: b._config?.connectionLineType,
                connectionLineStyle: b._config?.connectionLineStyle,
                connectionLine: b._config?.connectionLine,
                containerEl: N
              });
              Y.update({
                fromX: H.pos.x,
                fromY: H.pos.y,
                toX: $.x,
                toY: $.y,
                source: H.nodeId,
                sourceHandle: H.handleId
              }), K && K.appendChild(Y.svg), se.set(H.nodeId, {
                line: Y,
                sourceNodeId: H.nodeId,
                sourceHandleId: H.handleId,
                sourcePos: H.pos,
                valid: !0
              });
            }
          }, U = ($) => {
            if (!D) {
              const H = $.clientX - w, Y = $.clientY - _;
              if (Math.abs(H) >= Fn || Math.abs(Y) >= Fn) {
                if (j(), b._config?.multiConnect && b.selectedNodes.size > 1 && b.selectedNodes.has(A)) {
                  const oe = b.screenToFlowPosition($.clientX, $.clientY);
                  q(oe);
                }
              } else
                return;
            }
            const te = b.screenToFlowPosition($.clientX, $.clientY);
            if (le) {
              const H = sn({
                containerEl: N,
                handleType: "target",
                excludeNodeId: A,
                cursorFlowPos: te,
                connectionSnapRadius: T,
                getNode: (W) => b.getNode(W),
                toFlowPosition: (W, F) => b.screenToFlowPosition(W, F),
                connectionMode: b._config?.connectionMode
              });
              H.element !== G && (G?.classList.remove("flow-handle-active"), H.element?.classList.add("flow-handle-active"), G = H.element);
              const oe = H.element?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, ne = H.element?.dataset.flowHandleId ?? "target", X = b._config?.connectionLineStyle?.stroke ?? (getComputedStyle(N).getPropertyValue("--flow-edge-stroke-selected").trim() || hn);
              for (const W of se.values())
                if (W.line.update({
                  fromX: W.sourcePos.x,
                  fromY: W.sourcePos.y,
                  toX: H.position.x,
                  toY: H.position.y,
                  source: W.sourceNodeId,
                  sourceHandle: W.sourceHandleId
                }), H.element && oe) {
                  const F = {
                    source: W.sourceNodeId,
                    sourceHandle: W.sourceHandleId,
                    target: oe,
                    targetHandle: ne
                  }, he = b.getNode(oe)?.connectable !== !1 && W.sourceNodeId !== oe && lt(F, b.edges, { preventCycles: b._config?.preventCycles }) && at(F, b._config?.connectionRules, b._nodeMap) && Ge(N, F, b.edges) && Ke(N, F) && (!b._config?.isValidConnection || b._config.isValidConnection(F));
                  W.valid = he;
                  const Z = W.line.svg.querySelector("path");
                  if (Z)
                    if (he)
                      Z.setAttribute("stroke", X);
                    else {
                      const de = getComputedStyle(N).getPropertyValue("--flow-connection-line-invalid").trim() || xr;
                      Z.setAttribute("stroke", de);
                    }
                } else {
                  W.valid = !0;
                  const F = W.line.svg.querySelector("path");
                  F && F.setAttribute("stroke", X);
                }
              b.pendingConnection = { ...b.pendingConnection, position: H.position }, ee?.updatePointer($.clientX, $.clientY);
              return;
            }
            const K = sn({
              containerEl: N,
              handleType: "target",
              excludeNodeId: A,
              cursorFlowPos: te,
              connectionSnapRadius: T,
              getNode: (H) => b.getNode(H),
              toFlowPosition: (H, Y) => b.screenToFlowPosition(H, Y)
            });
            K.element !== G && (G?.classList.remove("flow-handle-active"), K.element?.classList.add("flow-handle-active"), G = K.element), J ? K.element ? (J.style.display = "none", R?.update({ fromX: O, fromY: re, toX: K.position.x, toY: K.position.y, source: A, sourceHandle: p })) : (J.style.display = "", J.style.left = `${te.x}px`, J.style.top = `${te.y}px`, R?.update({ fromX: O, fromY: re, toX: te.x, toY: te.y, source: A, sourceHandle: p })) : R?.update({ fromX: O, fromY: re, toX: K.position.x, toY: K.position.y, source: A, sourceHandle: p }), b.pendingConnection = { ...b.pendingConnection, position: K.position }, ee?.updatePointer($.clientX, $.clientY);
          }, z = async ($) => {
            if (ee?.stop(), ee = null, document.removeEventListener("pointermove", U), document.removeEventListener("pointerup", z), document.removeEventListener("pointercancel", z), v = null, b._connectValidating) return;
            if (le) {
              const Y = b.screenToFlowPosition($.clientX, $.clientY);
              let oe = G;
              oe || (oe = document.elementFromPoint($.clientX, $.clientY)?.closest('[data-flow-handle-type="target"]'));
              const X = oe?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, W = oe?.dataset.flowHandleId ?? "target", F = [], ae = [], Q = [], ue = [];
              if (oe && X) {
                const ie = b.getNode(X);
                for (const fe of se.values()) {
                  const he = {
                    source: fe.sourceNodeId,
                    sourceHandle: fe.sourceHandleId,
                    target: X,
                    targetHandle: W
                  };
                  if (ie?.connectable !== !1 && fe.sourceNodeId !== X && lt(he, b.edges, { preventCycles: b._config?.preventCycles }) && at(he, b._config?.connectionRules, b._nodeMap) && Ge(N, he, b.edges) && Ke(N, he) && (!b._config?.isValidConnection || b._config.isValidConnection(he))) {
                    const xe = `e-${fe.sourceNodeId}-${X}-${Date.now()}-${tn++}`;
                    F.push({ id: xe, ...he }), ae.push(he), ue.push(fe);
                  } else
                    Q.push(fe);
                }
              } else
                Q.push(...se.values());
              for (const ie of ue)
                ie.line.destroy();
              if (F.length > 0) {
                b.addEdges(F);
                for (const ie of ae)
                  b._emit("connect", { connection: ie });
                b._emit("multi-connect", { connections: ae });
              }
              Q.length > 0 && setTimeout(() => {
                for (const ie of Q)
                  ie.line.destroy();
              }, 100), G?.classList.remove("flow-handle-active"), b._emit("connect-end", {
                connection: ae.length > 0 ? ae[0] : null,
                source: A,
                sourceHandle: p,
                position: Y
              }), se.clear(), le = !1, Le(N), b.pendingConnection = null, b._container?.classList.remove("flow-connecting");
              return;
            }
            if (!D) {
              b._config?.connectOnClick !== !1 && (B("connection", `Click-to-connect started from node "${A}" handle "${p}"`), b._emit("connect-start", { source: A, sourceHandle: p }), b.pendingConnection = {
                source: A,
                sourceHandle: p,
                position: { x: 0, y: 0 }
              }, b._container?.classList.add("flow-connecting"), rn(N, A, p, b));
              return;
            }
            const te = R?.svg ?? null;
            J?.remove(), J = null, G?.classList.remove("flow-handle-active"), Le(N);
            const K = b.screenToFlowPosition($.clientX, $.clientY), H = { source: A, sourceHandle: p, position: K };
            try {
              let Y = G;
              if (Y || (Y = document.elementFromPoint($.clientX, $.clientY)?.closest('[data-flow-handle-type="target"]')), Y) {
                const ne = Y.closest("[x-flow-node]")?.dataset.flowNodeId, X = Y.dataset.flowHandleId ?? "target";
                if (ne) {
                  if (Y[dt] === !1) {
                    B("connection", "Connection rejected (handle not connectable end)"), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                    return;
                  }
                  const W = b.getNode(ne);
                  if (W && !Ve(W)) {
                    B("connection", `Connection rejected (target "${ne}" not connectable)`), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                    return;
                  }
                  const F = {
                    source: A,
                    sourceHandle: p,
                    target: ne,
                    targetHandle: X
                  };
                  if (lt(F, b.edges, { preventCycles: b._config?.preventCycles })) {
                    if (!at(F, b._config?.connectionRules, b._nodeMap)) {
                      B("connection", "Connection rejected (connection rules)", F), Te(N, F), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                      return;
                    }
                    if (!Ge(N, F, b.edges)) {
                      B("connection", "Connection rejected (handle limit)", F), Te(N, F), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                      return;
                    }
                    if (!Ke(N, F)) {
                      B("connection", "Connection rejected (per-handle validator)", F), Te(N, F), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                      return;
                    }
                    if (b._config?.isValidConnection && !b._config.isValidConnection(F)) {
                      B("connection", "Connection rejected (custom validator)", F), Te(N, F), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                      return;
                    }
                    const ae = b._config?.connectValidator;
                    if (ae) {
                      const ue = b._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: ie, targetEl: fe } = eo(N, F);
                      b._connectValidating = !0, wt(te, !0);
                      let he;
                      try {
                        he = await Qn(
                          ae,
                          F,
                          ie,
                          fe,
                          N,
                          ue
                        );
                      } finally {
                        b._connectValidating = !1, wt(te, !1);
                      }
                      if (!he.allowed) {
                        B("connection", "Connection rejected (async connectValidator)", { connection: F, reason: he.reason }), Te(N, { ...F, reason: he.reason }), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                        return;
                      }
                    }
                    const Q = `e-${A}-${ne}-${Date.now()}-${tn++}`;
                    b.addEdges({ id: Q, ...F }), B("connection", `Connection created: ${A} → ${ne}`, F), b._emit("connect", { connection: F }), b._emit("connect-end", { connection: F, ...H });
                  } else
                    B("connection", "Connection rejected (invalid)", F), Te(N, F), b._emit("connect-end", { connection: null, ...H });
                } else
                  b._emit("connect-end", { connection: null, ...H });
              } else if (b._config?.onEdgeDrop) {
                const oe = {
                  x: K.x - _e / 2,
                  y: K.y - be / 2
                }, ne = b._config.onEdgeDrop({
                  source: A,
                  sourceHandle: p,
                  position: oe
                });
                if (ne) {
                  const X = {
                    source: A,
                    sourceHandle: p,
                    target: ne.id,
                    targetHandle: "target"
                  };
                  if (!Ge(N, X, b.edges))
                    B("connection", "Edge drop: connection rejected (handle limit)"), b._emit("connect-end", { connection: null, ...H });
                  else if (!Ke(N, X))
                    B("connection", "Edge drop: connection rejected (per-handle validator)"), b._emit("connect-end", { connection: null, ...H });
                  else if (!b._config.isValidConnection || b._config.isValidConnection(X)) {
                    b.addNodes(ne);
                    const W = `e-${A}-${ne.id}-${Date.now()}-${tn++}`;
                    b.addEdges({ id: W, ...X }), B("connection", `Edge drop: created node "${ne.id}" and edge`, X), b._emit("connect", { connection: X }), b._emit("connect-end", { connection: X, ...H });
                  } else
                    B("connection", "Edge drop: connection rejected by validator"), b._emit("connect-end", { connection: null, ...H });
                } else
                  B("connection", "Edge drop: callback returned null"), b._emit("connect-end", { connection: null, ...H });
              } else
                B("connection", "Connection cancelled (no target)"), b._emit("connect-end", { connection: null, ...H });
            } finally {
              wt(te, !1), R?.destroy(), R = null;
            }
            b.pendingConnection = null;
          };
          document.addEventListener("pointermove", U), document.addEventListener("pointerup", z), document.addEventListener("pointercancel", z), v = () => {
            document.removeEventListener("pointermove", U), document.removeEventListener("pointerup", z), document.removeEventListener("pointercancel", z), ee?.stop(), R?.destroy(), R = null, J?.remove(), J = null;
            for (const $ of se.values())
              $.line.destroy();
            se.clear(), le = !1, G?.classList.remove("flow-handle-active"), Le(N), b.pendingConnection = null, b._container?.classList.remove("flow-connecting");
          };
        };
        e.addEventListener("pointerdown", C);
        const S = () => {
          const I = x();
          if (!I?._pendingReconnection || I._pendingReconnection.draggedEnd !== "source") return;
          const b = m();
          if (b) {
            const E = I.getNode(b);
            if (E && !Ve(E)) return;
          }
          e[Dt] !== !1 && e.classList.add("flow-handle-active");
        }, k = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", S), e.addEventListener("pointerleave", k), l(() => {
          v?.(), M?.(), e.removeEventListener("pointerdown", C), e.removeEventListener("pointerenter", S), e.removeEventListener("pointerleave", k), e.classList.remove("flow-handle", `flow-handle-${a}`);
        });
      } else {
        const v = () => {
          const b = x();
          if (!b?.pendingConnection) return;
          const E = m();
          if (E) {
            const A = b.getNode(E);
            if (A && !Ve(A)) return;
          }
          e[dt] !== !1 && e.classList.add("flow-handle-active");
        }, C = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", v), e.addEventListener("pointerleave", C);
        const S = async (b) => {
          const E = x();
          if (!E?.pendingConnection || E._config?.connectOnClick === !1 || E._connectValidating) return;
          b.preventDefault(), b.stopPropagation();
          const A = m();
          if (!A) return;
          if (e[dt] === !1) {
            B("connection", "Click-to-connect rejected (handle not connectable end)"), E._emit("connect-end", { connection: null, source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
            const P = e.closest(".flow-container");
            P && Le(P);
            return;
          }
          const L = E.getNode(A);
          if (L && !Ve(L)) {
            B("connection", `Click-to-connect rejected (target "${A}" not connectable)`), E._emit("connect-end", { connection: null, source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
            const P = e.closest(".flow-container");
            P && Le(P);
            return;
          }
          const w = {
            source: E.pendingConnection.source,
            sourceHandle: E.pendingConnection.sourceHandle,
            target: A,
            targetHandle: p
          }, _ = { source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };
          if (lt(w, E.edges, { preventCycles: E._config?.preventCycles })) {
            const P = e.closest(".flow-container");
            if (!at(w, E._config?.connectionRules, E._nodeMap)) {
              B("connection", "Click-to-connect rejected (connection rules)", w), Te(P, w), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), P && Le(P);
              return;
            }
            if (P && !Ge(P, w, E.edges)) {
              B("connection", "Click-to-connect rejected (handle limit)", w), Te(P, w), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), Le(P);
              return;
            }
            if (P && !Ke(P, w)) {
              B("connection", "Click-to-connect rejected (per-handle validator)", w), Te(P, w), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), P && Le(P);
              return;
            }
            if (E._config?.isValidConnection && !E._config.isValidConnection(w)) {
              B("connection", "Click-to-connect rejected (custom validator)", w), Te(P, w), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), P && Le(P);
              return;
            }
            const R = E._config?.connectValidator;
            if (R && P) {
              const ee = E._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: J, targetEl: T } = eo(P, w);
              E._connectValidating = !0;
              let N;
              try {
                N = await Qn(
                  R,
                  w,
                  J,
                  T,
                  P,
                  ee
                );
              } finally {
                E._connectValidating = !1;
              }
              if (!N.allowed) {
                B("connection", "Click-to-connect rejected (async connectValidator)", { connection: w, reason: N.reason }), Te(P, { ...w, reason: N.reason }), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), Le(P);
                return;
              }
            }
            const G = `e-${w.source}-${w.target}-${Date.now()}-${tn++}`;
            E.addEdges({ id: G, ...w }), B("connection", `Click-to-connect: ${w.source} → ${w.target}`, w), E._emit("connect", { connection: w }), E._emit("connect-end", { connection: w, ..._ });
          } else {
            B("connection", "Click-to-connect rejected (invalid)", w);
            const P = e.closest(".flow-container");
            Te(P, w), E._emit("connect-end", { connection: null, ..._ });
          }
          E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
          const D = e.closest(".flow-container");
          D && Le(D);
        };
        e.addEventListener("click", S);
        let k = null;
        const I = (b) => {
          if (b.button !== 0) return;
          const E = x(), A = m();
          if (!E || !A || E._animationLocked || E._config?.edgesReconnectable === !1 || E._pendingReconnection) return;
          const L = E.edges.filter(
            (F) => F.target === A && (F.targetHandle ?? "target") === p
          );
          if (L.length === 0) return;
          const w = L.find((F) => F.selected) ?? (L.length === 1 ? L[0] : null);
          if (!w) return;
          const _ = w.reconnectable ?? !0;
          if (_ === !1 || _ === "source") return;
          b.preventDefault(), b.stopPropagation();
          const D = b.clientX, P = b.clientY;
          let R = !1, G = !1, ee = null;
          const J = E._config?.connectionSnapRadius ?? 20, T = e.closest(".flow-container");
          if (!T) return;
          const N = T.querySelector(
            `[data-flow-node-id="${CSS.escape(w.source)}"]`
          ), O = w.sourceHandle ? `[data-flow-handle-id="${CSS.escape(w.sourceHandle)}"]` : '[data-flow-handle-type="source"]', re = N?.querySelector(O), le = T.getBoundingClientRect(), se = E._viewportLive ?? E.viewport, j = se?.zoom || 1, V = se?.x || 0, q = se?.y || 0;
          let U, z;
          if (re) {
            const F = re.getBoundingClientRect();
            U = (F.left + F.width / 2 - le.left - V) / j, z = (F.top + F.height / 2 - le.top - q) / j;
          } else {
            const F = E.getNode(w.source);
            if (!F) return;
            const ae = F.dimensions?.width ?? _e, Q = F.dimensions?.height ?? be;
            U = F.position.x + ae / 2, z = F.position.y + Q;
          }
          let $ = null, te = null, K = null, H = D, Y = P;
          const oe = () => {
            R = !0;
            const F = T.querySelector(
              `[data-flow-edge-id="${w.id}"]`
            );
            F && F.classList.add("flow-edge-reconnecting"), E._emit("reconnect-start", { edge: w, handleType: "target" }), B("reconnect", `Reconnection drag started from target handle on edge "${w.id}"`), te = Rt({
              connectionLineType: E._config?.connectionLineType,
              connectionLineStyle: E._config?.connectionLineStyle,
              connectionLine: E._config?.connectionLine,
              containerEl: T
            }), $ = te.svg;
            const ae = E.screenToFlowPosition(D, P);
            te.update({
              fromX: U,
              fromY: z,
              toX: ae.x,
              toY: ae.y,
              source: w.source,
              sourceHandle: w.sourceHandle
            });
            const Q = T.querySelector(".flow-viewport");
            Q && Q.appendChild($), E.pendingConnection = {
              source: w.source,
              sourceHandle: w.sourceHandle,
              position: ae
            }, E._pendingReconnection = {
              edge: w,
              draggedEnd: "target",
              anchorPosition: { x: U, y: z },
              position: ae
            }, K = Jn(T, E, H, Y), rn(T, w.source, w.sourceHandle ?? "source", E, w.id);
          }, ne = (F) => {
            if (H = F.clientX, Y = F.clientY, !R) {
              Math.sqrt(
                (F.clientX - D) ** 2 + (F.clientY - P) ** 2
              ) >= Fn && oe();
              return;
            }
            const ae = E.screenToFlowPosition(F.clientX, F.clientY), Q = sn({
              containerEl: T,
              handleType: "target",
              excludeNodeId: w.source,
              cursorFlowPos: ae,
              connectionSnapRadius: J,
              getNode: (ue) => E.getNode(ue),
              toFlowPosition: (ue, ie) => E.screenToFlowPosition(ue, ie)
            });
            Q.element !== ee && (ee?.classList.remove("flow-handle-active"), Q.element?.classList.add("flow-handle-active"), ee = Q.element), te?.update({
              fromX: U,
              fromY: z,
              toX: Q.position.x,
              toY: Q.position.y,
              source: w.source,
              sourceHandle: w.sourceHandle
            }), E.pendingConnection && (E.pendingConnection = {
              ...E.pendingConnection,
              position: Q.position
            }), E._pendingReconnection && (E._pendingReconnection = {
              ...E._pendingReconnection,
              position: Q.position
            }), K?.updatePointer(F.clientX, F.clientY);
          }, X = () => {
            if (G) return;
            G = !0, document.removeEventListener("pointermove", ne), document.removeEventListener("pointerup", W), document.removeEventListener("pointercancel", W), K?.stop(), K = null, te?.destroy(), te = null, $ = null, ee?.classList.remove("flow-handle-active"), k = null;
            const F = T.querySelector(
              `[data-flow-edge-id="${w.id}"]`
            );
            F && F.classList.remove("flow-edge-reconnecting"), Le(T), E.pendingConnection = null, E._pendingReconnection = null;
          }, W = async (F) => {
            if (!R) {
              X();
              return;
            }
            if (E._connectValidating) return;
            let ae = ee;
            ae || (ae = document.elementFromPoint(F.clientX, F.clientY)?.closest('[data-flow-handle-type="target"]'));
            let Q = !1;
            if (ae) {
              const ie = ae.closest("[x-flow-node]")?.dataset.flowNodeId, fe = ae.dataset.flowHandleId;
              if (ie && E.getNode(ie)?.connectable !== !1) {
                const Z = {
                  source: w.source,
                  sourceHandle: w.sourceHandle,
                  target: ie,
                  targetHandle: fe
                }, de = { ...w }, pe = te?.svg ?? null;
                wt(pe, !0);
                let ce;
                try {
                  ce = await Dr({
                    edge: w,
                    newConnection: Z,
                    canvas: E,
                    containerEl: T,
                    endpoint: "target"
                  });
                } finally {
                  wt(pe, !1);
                }
                ce.applied ? (Q = !0, B("reconnect", `Edge "${w.id}" reconnected (target)`, Z), E._emit("reconnect", { oldEdge: de, newConnection: Z })) : B("reconnect", "Reconnection rejected", { connection: Z, reason: ce.reason });
              }
            }
            Q || B("reconnect", `Edge "${w.id}" reconnection cancelled — snapping back`), E._emit("reconnect-end", { edge: w, successful: Q }), X();
          };
          document.addEventListener("pointermove", ne), document.addEventListener("pointerup", W), document.addEventListener("pointercancel", W), k = X;
        };
        e.addEventListener("pointerdown", I), l(() => {
          k?.(), M?.(), e.removeEventListener("pointerdown", I), e.removeEventListener("pointerenter", v), e.removeEventListener("pointerleave", C), e.removeEventListener("click", S), e.classList.remove("flow-handle", `flow-handle-${a}`, "flow-handle-active");
        });
      }
    }
  );
}
const rs = {
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
function xf(t) {
  if (!t) return { ...rs };
  const e = { ...rs };
  for (const n of Object.keys(t))
    n in t && (e[n] = t[n]);
  return e;
}
function Ye(t, e) {
  if (e == null) return !1;
  const n = t.length === 1 ? t.toLowerCase() : t;
  return Array.isArray(e) ? e.some((o) => (o.length === 1 ? o.toLowerCase() : o) === n) : (e.length === 1 ? e.toLowerCase() : e) === n;
}
function Ef(t, e, n, o) {
  return !t && e > 0 && (n !== 0 || o !== 0);
}
function ut(t, e) {
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
function Cf(t, e, n = {}) {
  const o = n.duration ?? 500, i = n.moveThreshold ?? 10;
  let r = null, s = 0, l = 0, a = null;
  function c() {
    r !== null && (clearTimeout(r), r = null), a = null, document.removeEventListener("pointermove", d), document.removeEventListener("pointerup", c), document.removeEventListener("pointercancel", c);
  }
  function d(f) {
    const h = f.clientX - s, g = f.clientY - l;
    h * h + g * g > i * i && c();
  }
  function u(f) {
    c(), s = f.clientX, l = f.clientY, a = f, document.addEventListener("pointermove", d), document.addEventListener("pointerup", c), document.addEventListener("pointercancel", c), r = setTimeout(() => {
      const h = a;
      c(), h && e(h);
    }, o);
  }
  return t.addEventListener("pointerdown", u), () => {
    c(), t.removeEventListener("pointerdown", u);
  };
}
const as = 20;
function Fr(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function Sf(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const o of e)
    if (o.parentId) {
      const i = n.get(o.parentId);
      i ? i.push(o.id) : n.set(o.parentId, [o.id]);
    }
  for (const o of t.keys())
    n.has(o) || t.delete(o);
  for (const [o, i] of n) {
    const r = t.get(o);
    (!r || r.length !== i.length || r.some((s, l) => s !== i[l])) && t.set(o, i);
  }
}
function Uo(t, e, n) {
  if (!t.position) return { x: 0, y: 0 };
  let o = t.position.x, i = t.position.y;
  const r = /* @__PURE__ */ new Set();
  r.add(t.id);
  let s = t.parentId ? e.get(t.parentId) : void 0;
  for (; s && !r.has(s.id); ) {
    r.add(s.id);
    const l = s.nodeOrigin ?? n ?? [0, 0], a = s.dimensions?.width ?? _e, c = s.dimensions?.height ?? be;
    o += s.position.x - a * l[0], i += s.position.y - c * l[1], s = s.parentId ? e.get(s.parentId) : void 0;
  }
  return { x: o, y: i };
}
function Ft(t, e, n) {
  if (!t.parentId)
    return t;
  const o = Uo(t, e, n);
  return { ...t, position: o };
}
function to(t, e, n) {
  return t.map((o) => Ft(o, e, n));
}
function ft(t, e) {
  const n = /* @__PURE__ */ new Set(), o = [t], i = /* @__PURE__ */ new Map();
  for (const r of e)
    if (r.parentId) {
      const s = i.get(r.parentId);
      s ? s.push(r.id) : i.set(r.parentId, [r.id]);
    }
  for (; o.length > 0; ) {
    const r = o.shift(), s = i.get(r);
    if (s)
      for (const l of s)
        n.has(l) || (n.add(l), o.push(l));
  }
  return n;
}
function Et(t) {
  const e = Fr(t), n = [], o = /* @__PURE__ */ new Set();
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
function Hr(t, e, n = /* @__PURE__ */ new Set()) {
  if (n.has(t.id))
    return t.zIndex ?? 2;
  if (n.add(t.id), !t.parentId)
    return t.zIndex !== void 0 ? t.zIndex : t.type === "group" ? 0 : 2;
  const o = e.get(t.parentId);
  return o ? Hr(o, e, n) + 2 + (t.zIndex ?? 0) : (t.zIndex ?? 0) + 2;
}
function Or(t, e, n) {
  return {
    x: Math.max(e[0][0], Math.min(t.x, e[1][0] - (n?.width ?? 0))),
    y: Math.max(e[0][1], Math.min(t.y, e[1][1] - (n?.height ?? 0)))
  };
}
function bo(t, e, n) {
  return {
    x: Math.max(0, Math.min(t.x, n.width - e.width)),
    y: Math.max(0, Math.min(t.y, n.height - e.height))
  };
}
function Mn(t, e, n) {
  const o = e.extent ?? n;
  if (!o || o === "parent" || e.parentId) return t;
  const i = e.dimensions ?? { width: _e, height: be };
  return Or(t, o, i);
}
function kf(t, e, n) {
  const o = t.x + e.width + as, i = t.y + e.height + as, r = Math.max(n.width, o), s = Math.max(n.height, i);
  return r === n.width && s === n.height ? null : { width: r, height: s };
}
function ls(t, e, n) {
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
function Lf(t, e, n) {
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
      const l = -Math.PI / 4;
      return { x: o + r * Math.cos(l), y: i + s * Math.sin(l) };
    }
    case "top-left": {
      const l = -3 * Math.PI / 4;
      return { x: o + r * Math.cos(l), y: i + s * Math.sin(l) };
    }
    case "bottom-right": {
      const l = Math.PI / 4;
      return { x: o + r * Math.cos(l), y: i + s * Math.sin(l) };
    }
    case "bottom-left": {
      const l = 3 * Math.PI / 4;
      return { x: o + r * Math.cos(l), y: i + s * Math.sin(l) };
    }
  }
}
function Pf(t, e, n) {
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
function Mf(t, e, n) {
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
function Tf(t, e, n) {
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
function Af(t, e, n) {
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
function Nf(t, e, n) {
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
function $f(t, e, n) {
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
      const s = t - o, l = -Math.PI / 4;
      return { x: s + o * Math.cos(l), y: r + o * Math.sin(l) };
    }
    case "top-left": {
      const s = o, l = -3 * Math.PI / 4;
      return { x: s + o * Math.cos(l), y: r + o * Math.sin(l) };
    }
    case "bottom-right": {
      const s = t - o, l = Math.PI / 4;
      return { x: s + o * Math.cos(l), y: r + o * Math.sin(l) };
    }
    case "bottom-left": {
      const s = o, l = 3 * Math.PI / 4;
      return { x: s + o * Math.cos(l), y: r + o * Math.sin(l) };
    }
  }
}
const zr = {
  circle: { perimeterPoint: Lf },
  diamond: { perimeterPoint: Pf },
  hexagon: { perimeterPoint: Mf },
  parallelogram: { perimeterPoint: Tf },
  triangle: { perimeterPoint: Af },
  cylinder: { perimeterPoint: Nf },
  stadium: { perimeterPoint: $f }
};
function Vr(t, e = "light") {
  let n = e === "dark" ? "dark" : "light", o = null, i = null;
  function r(l) {
    n = l ? "dark" : "light", t.classList.toggle("dark", l);
  }
  function s(l) {
    o && i && (o.removeEventListener("change", i), o = null, i = null), l === "system" ? (o = window.matchMedia("(prefers-color-scheme: dark)"), r(o.matches), i = (a) => r(a.matches), o.addEventListener("change", i)) : r(l === "dark");
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
const xo = "__alpineflow_collab_store__";
function If() {
  return typeof globalThis < "u" ? (globalThis[xo] || (globalThis[xo] = /* @__PURE__ */ new WeakMap()), globalThis[xo]) : /* @__PURE__ */ new WeakMap();
}
const De = If(), Eo = "__alpineflow_registry__";
function Br() {
  return typeof globalThis < "u" ? (globalThis[Eo] || (globalThis[Eo] = /* @__PURE__ */ new Map()), globalThis[Eo]) : /* @__PURE__ */ new Map();
}
function Mt(t) {
  return Br().get(t);
}
function Df(t, e) {
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
const Rf = 1e3;
class Ff {
  constructor(e, n) {
    this._clearTimer = null, this._formatMessage = n ?? Df, this._el = document.createElement("div"), this._el.setAttribute("aria-live", "polite"), this._el.setAttribute("aria-atomic", "true"), this._el.setAttribute("role", "status");
    const o = this._el.style;
    o.position = "absolute", o.width = "1px", o.height = "1px", o.padding = "0", o.margin = "-1px", o.overflow = "hidden", o.clip = "rect(0,0,0,0)", o.whiteSpace = "nowrap", o.border = "0", e.appendChild(this._el);
  }
  announce(e) {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.textContent = e, this._clearTimer = setTimeout(() => {
      this._el.textContent = "", this._clearTimer = null;
    }, Rf);
  }
  handleEvent(e, n) {
    const o = this._formatMessage(e, n);
    o && this.announce(o);
  }
  destroy() {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.remove();
  }
}
class Hf {
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
    const o = new Map(e.map((a) => [a.id, a])), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    for (const a of e)
      i.set(a.id, 0), r.set(a.id, []);
    for (const a of n)
      !o.has(a.source) || !o.has(a.target) || (i.set(a.target, (i.get(a.target) ?? 0) + 1), r.get(a.source).push(a.target));
    const s = [];
    for (const [a, c] of i)
      c === 0 && s.push(a);
    const l = [];
    for (; s.length > 0; ) {
      const a = s.shift();
      l.push(o.get(a));
      for (const c of r.get(a) ?? []) {
        const d = (i.get(c) ?? 0) - 1;
        i.set(c, d), d === 0 && s.push(c);
      }
    }
    if (l.length < e.length) {
      const a = new Set(l.map((c) => c.id));
      for (const c of e)
        a.has(c.id) || l.push(c);
    }
    return l;
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
      for (const a of e)
        a.data.$outputs && r.set(a.id, a.data.$outputs);
    let s = null;
    o && (s = this._getDownstream(o, n), s.add(o));
    const l = /* @__PURE__ */ new Map();
    for (const a of i) {
      if (s && !s.has(a.id)) continue;
      const c = this._registry.get(a.type ?? "default");
      if (!c) continue;
      const d = {}, u = n.filter((h) => h.target === a.id);
      for (const h of u) {
        const g = r.get(h.source);
        if (!g) continue;
        const p = h.sourceHandle ?? "default", y = h.targetHandle ?? "default";
        p in g && (d[y] = g[p]);
      }
      const f = c.compute(d, a.data);
      r.set(a.id, f), l.set(a.id, f), a.data.$inputs = d, a.data.$outputs = f;
    }
    return l;
  }
  /** Get all downstream node IDs reachable from a start node. */
  _getDownstream(e, n) {
    const o = /* @__PURE__ */ new Map();
    for (const s of n) {
      let l = o.get(s.source);
      l || (l = [], o.set(s.source, l)), l.push(s.target);
    }
    const i = /* @__PURE__ */ new Set(), r = [e];
    for (; r.length > 0; ) {
      const s = r.pop();
      if (!i.has(s)) {
        i.add(s);
        for (const l of o.get(s) ?? [])
          i.has(l) || r.push(l);
      }
    }
    return i.delete(e), i;
  }
}
const Of = {
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
}, zf = {
  "flow:addNodes": "addNodes",
  "flow:removeNodes": "removeNodes",
  "flow:addEdges": "addEdges",
  "flow:removeEdges": "removeEdges",
  "flow:update": "update",
  "flow:animate": "animate",
  // Particle emission — all five firing methods
  "flow:sendParticle": "sendParticle",
  "flow:sendParticleAlongPath": "sendParticleAlongPath",
  "flow:sendParticleBetween": "sendParticleBetween",
  "flow:sendParticleBurst": "sendParticleBurst",
  "flow:sendConverging": "sendConverging",
  // Tag-filtered bulk animation control (v0.2.0-alpha)
  "flow:cancelAll": "cancelAll",
  "flow:pauseAll": "pauseAll",
  "flow:resumeAll": "resumeAll",
  // Viewport
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
  "flow:toggleNode": "toggleNode",
  // RunState (D2)
  "flow:setNodeState": "setNodeState",
  "flow:resetStates": "resetStates"
}, Vf = {
  "flow:addNodes": (t) => [t.nodes],
  "flow:removeNodes": (t) => [t.ids],
  "flow:addEdges": (t) => [t.edges],
  "flow:removeEdges": (t) => [t.ids],
  "flow:update": (t) => [t.targets, t.options ?? {}],
  "flow:animate": (t) => [t.targets, t.options ?? {}],
  // Particle emission — all five firing methods
  "flow:sendParticle": (t) => [t.edgeId, t.options ?? {}],
  "flow:sendParticleAlongPath": (t) => [t.path, t.options ?? {}],
  "flow:sendParticleBetween": (t) => [t.source, t.target, t.options ?? {}],
  "flow:sendParticleBurst": (t) => [t.edgeId, t.options ?? {}],
  "flow:sendConverging": (t) => [t.sources, t.options ?? {}],
  // Tag-filtered bulk animation control
  "flow:cancelAll": (t) => [t.filter ?? {}, t.options ?? {}],
  "flow:pauseAll": (t) => [t.filter ?? {}],
  "flow:resumeAll": (t) => [t.filter ?? {}],
  // Viewport
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
  "flow:toggleNode": (t) => [t.id],
  // RunState (D2)
  "flow:setNodeState": (t) => [t.ids, t.state],
  "flow:resetStates": () => []
}, cs = {
  success: { borderColor: "#22c55e", shadow: "0 0 0 2px rgba(34,197,94,0.3)" },
  error: { borderColor: "#ef4444", shadow: "0 0 0 2px rgba(239,68,68,0.3)" },
  warning: { borderColor: "#f59e0b", shadow: "0 0 0 2px rgba(245,158,11,0.3)" },
  info: { borderColor: "#3b82f6", shadow: "0 0 0 2px rgba(59,130,246,0.3)" }
};
function Bf(t, e) {
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
    const r = i.dimensions?.width ?? 150, s = i.dimensions?.height ?? 40, l = i.parentId ? t.getAbsolutePosition(o.id) : i.position;
    t.fitBounds(
      { x: l.x, y: l.y, width: r, height: s },
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
    const r = cs[o.style] ?? cs.info, s = o.duration ?? 1500, l = Math.floor(s * 0.6), a = Math.floor(s * 0.4), c = i.style?.borderColor ?? null, d = i.style?.boxShadow ?? null;
    t.update({
      nodes: { [o.id]: { style: `border-color: ${r.borderColor}; box-shadow: ${r.shadow}` } }
    }, { duration: 100 }), setTimeout(() => {
      const u = c ? `border-color: ${c}; box-shadow: ${d ?? "none"}` : "";
      t.update({
        nodes: { [o.id]: { style: u } }
      }, { duration: a });
    }, 100 + l);
  })), n.push(e.on("flow:highlightPath", (o) => {
    const i = o.nodeIds, r = o.options ?? {}, { delay: s, ...l } = r, a = s ?? 200, c = {
      color: "#3b82f6",
      size: 5,
      duration: "800ms",
      ...l
    };
    for (let d = 0; d < i.length - 1; d++) {
      const u = i[d], f = i[d + 1], h = t.edges.find((g) => g.source === u && g.target === f);
      h && setTimeout(() => {
        t.sendParticle(h.id, c);
      }, d * a);
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
  })), n.push(e.on("flow:run", (o) => {
    if (typeof t.run != "function") {
      console.warn("[wire-bridge] flow:run: canvas.run not available — is the workflow addon registered?");
      return;
    }
    const i = t._workflowHandlers ?? {};
    t.run(o.startId, i, o.options ?? {});
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
function qf(t) {
  return "on" + t.split("-").map(
    (e) => e.charAt(0).toUpperCase() + e.slice(1)
  ).join("");
}
const Xf = /* @__PURE__ */ new Set(["viewport-change", "viewport-move"]), Yf = 150;
function Wf(t, e) {
  let n = null, o = null;
  return ((...i) => {
    o = i, n === null && (n = setTimeout(() => {
      n = null;
      const r = o;
      o = null, t(...r);
    }, e));
  });
}
function jf(t, e, n) {
  for (const [o, i] of Object.entries(n)) {
    const r = qf(o), s = t[r], l = (a) => {
      let c;
      typeof s == "function" && (c = s(a));
      const d = Of[o], u = d ? d(a) : [a], f = e[i];
      return typeof f == "function" && f.call(e, ...u), c;
    };
    t[r] = Xf.has(o) ? Wf(l, Yf) : l;
  }
}
function Uf(t, e) {
  const n = [];
  for (const [o, i] of Object.entries(zf)) {
    const r = e.on(o, (s) => {
      const l = t[i];
      if (typeof l != "function") return;
      const a = Vf[o], c = a ? a(s) : Object.values(s);
      l.call(t, ...c);
    });
    n.push(r);
  }
  return () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
const Zf = 5;
function Kf(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let i = null, r = /* @__PURE__ */ new Set(), s = 0;
  const l = /* @__PURE__ */ new Set();
  function a() {
    i === null && (i = requestAnimationFrame(() => {
      i = null;
      for (const c of e) {
        const u = (r.has(c) ? n.get(c) ?? 0 : 0) + 1;
        n.set(c, u), u > Zf && !o.has(c) && (o.add(c), console.warn(
          `[alpineflow] Auto-layout for parent "${c}" has run for ${u} consecutive frames. Suppressing to avoid an infinite loop. This usually indicates a layout that keeps changing child dimensions by more than the 1px threshold. Next user mutation will clear the suppression.`
        ));
      }
      for (const c of n.keys())
        e.has(c) || n.set(c, 0);
      r = new Set(e), e.clear();
    }));
  }
  return {
    safeLayoutChildren(c) {
      if (!o.has(c)) {
        if (s > 0) {
          l.add(c);
          return;
        }
        e.has(c) || (e.add(c), a(), t(c));
      }
    },
    resetLoopCounter(c) {
      n.delete(c), o.delete(c);
    },
    dispose() {
      i !== null && (cancelAnimationFrame(i), i = null);
    },
    suspend() {
      s++;
    },
    resume() {
      if (s !== 0 && (s--, s === 0)) {
        for (const c of l)
          o.has(c) || e.has(c) || (e.add(c), a(), t(c));
        l.clear();
      }
    }
  };
}
function Gf(t) {
  return function(n) {
    t.suspend();
    try {
      return n();
    } finally {
      t.resume();
    }
  };
}
function Jf(t, e, n) {
  let { width: o, height: i } = t;
  return e?.width !== void 0 && (o = Math.max(o, e.width)), e?.height !== void 0 && (i = Math.max(i, e.height)), n?.width !== void 0 && (o = Math.min(o, n.width)), n?.height !== void 0 && (i = Math.min(i, n.height)), { width: o, height: i };
}
function an(t, e) {
  const n = t.type ?? "default", o = e[n], i = t.data?.childValidation;
  if (!(!o && !i))
    return o ? i ? { ...o, ...i } : o : i;
}
function qr(t, e, n, o) {
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
      (l) => (l.type ?? "default") === i
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
function no(t, e, n, o) {
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
    const s = e.type ?? "default", l = o.childTypeConstraints[s];
    if (l?.min !== void 0 && n.filter(
      (c) => (c.type ?? "default") === s
    ).length - 1 < l.min)
      return {
        valid: !1,
        rule: "childTypeConstraints",
        message: `Requires at least ${l.min} "${s}" node(s)`
      };
  }
  return { valid: !0 };
}
function ds(t, e, n) {
  if (!n) return [];
  const o = [], i = Math.max(
    n.minChildren ?? 0,
    n.requiredChildren ? 1 : 0
  );
  if (i > 0 && e.length < i && o.push(`Requires at least ${i} child node(s)`), n.maxChildren !== void 0 && e.length > n.maxChildren && o.push(`Maximum ${n.maxChildren} child node(s) allowed`), n.childTypeConstraints)
    for (const [r, s] of Object.entries(n.childTypeConstraints)) {
      const l = e.filter(
        (a) => (a.type ?? "default") === r
      ).length;
      s.min !== void 0 && l < s.min && o.push(`Requires at least ${s.min} "${r}" node(s)`), s.max !== void 0 && l > s.max && o.push(`Maximum ${s.max} "${r}" node(s) allowed`);
    }
  return o;
}
function qt(t, e) {
  const n = Yt(t, e);
  return {
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? _e,
    height: t.dimensions?.height ?? be
  };
}
function Xr(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function Qf(t, e, n = !0) {
  const o = qt(t);
  return e.filter((i) => {
    if (i.id === t.id) return !1;
    const r = qt(i);
    return n ? Xr(o, r) : o.x <= r.x && o.y <= r.y && o.x + o.width >= r.x + r.width && o.y + o.height >= r.y + r.height;
  });
}
function eh(t, e, n = !0) {
  if (t.id === e.id) return !1;
  const o = qt(t), i = qt(e);
  return n ? Xr(o, i) : o.x <= i.x && o.y <= i.y && o.x + o.width >= i.x + i.width && o.y + o.height >= i.y + i.height;
}
function th(t, e, n, o, i = 5) {
  let { x: r, y: s } = t;
  for (const l of o) {
    const a = r + e, c = s + n, d = l.x + l.width, u = l.y + l.height;
    if (r < d + i && a > l.x - i && s < u + i && c > l.y - i) {
      const f = a - (l.x - i), h = d + i - r, g = c - (l.y - i), p = u + i - s, y = Math.min(f, h, g, p);
      y === f ? r -= f : y === h ? r += h : y === g ? s -= g : s += p;
    }
  }
  return { x: r, y: s };
}
function nh(t) {
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
      B("init", `Adding ${o.length} node(s)`, o.map((d) => d.id));
      const i = /* @__PURE__ */ new Map();
      if (n?.center) {
        for (const d of o)
          i.set(d.id, { ...d.position });
        o = o.map((d) => ({ ...d, position: { x: -9999, y: -9999 } }));
      }
      const r = [];
      for (const d of o) {
        if (d.parentId) {
          const u = t._getChildValidation(d.parentId);
          if (u) {
            const f = t._nodeMap.get(d.parentId);
            if (f) {
              const h = [
                ...t.nodes.filter(
                  (p) => p.parentId === d.parentId
                ),
                ...r.filter(
                  (p) => p.parentId === d.parentId
                )
              ], g = qr(f, d, h, u);
              if (!g.valid) {
                t._config.onChildValidationFail && t._config.onChildValidationFail({
                  parent: f,
                  child: d,
                  operation: "add",
                  rule: g.rule,
                  message: g.message
                });
                continue;
              }
            }
          }
        }
        r.push(d);
      }
      o = r, t.nodes.push(...o);
      for (const d of o)
        d.dimensions && t._initialDimensions.set(d.id, { ...d.dimensions });
      let s = o.some((d) => d.parentId);
      if (!s) {
        const d = new Set(o.map((u) => u.id));
        s = t.nodes.some(
          (u) => u.parentId && d.has(u.parentId)
        );
      }
      if (s) {
        const d = Et(t.nodes);
        t.nodes.splice(0, t.nodes.length, ...d);
      }
      t._rebuildNodeMap();
      for (const d of o)
        if (d.childLayout) {
          const u = t._nodeMap.get(d.id);
          u && t._installChildLayoutWatchers(u);
        }
      t._emit("nodes-change", { type: "add", nodes: o });
      const l = t._container ? De.get(t._container) : void 0;
      if (l?.bridge)
        for (const d of o)
          l.bridge.pushLocalNodeAdd(d);
      n?.center && requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          for (const [d, u] of i) {
            const f = t.nodes.find((p) => p.id === d);
            if (!f) continue;
            const h = f.dimensions?.width ?? 0, g = f.dimensions?.height ?? 0;
            f.position.x = u.x - h / 2, f.position.y = u.y - g / 2;
          }
        });
      }), t._recomputeChildValidation();
      const a = /* @__PURE__ */ new Set();
      for (const d of o)
        if (d.parentId && t._nodeMap.get(d.parentId)?.childLayout) {
          if (d.order == null) {
            const f = t.nodes.filter(
              (h) => h.parentId === d.parentId && h.id !== d.id
            );
            d.order = f.length > 0 ? Math.max(...f.map((h) => h.order ?? 0)) + 1 : 0;
          }
          a.add(d.parentId);
        }
      const c = /* @__PURE__ */ new Set();
      for (const d of a) {
        let u = d, f = t._nodeMap.get(d)?.parentId;
        for (; f; ) {
          const h = t._nodeMap.get(f);
          h?.childLayout && (u = f), f = h?.parentId;
        }
        c.add(u);
      }
      for (const d of c)
        t._layoutDedup ? t._layoutDedup.safeLayoutChildren(d) : t.layoutChildren?.(d);
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
      for (const u of [...n]) {
        const f = t._nodeMap.get(u);
        if (!f?.parentId || n.has(f.parentId)) continue;
        const h = t._getChildValidation(f.parentId);
        if (!h) continue;
        const g = t._nodeMap.get(f.parentId);
        if (!g) continue;
        const p = t.nodes.filter(
          (m) => m.parentId === f.parentId
        ), y = no(g, f, p, h);
        y.valid || (o.add(u), t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: g,
          child: f,
          operation: "remove",
          rule: y.rule,
          message: y.message
        }));
      }
      for (const u of o)
        n.delete(u);
      if (n.size === 0) return;
      const i = /* @__PURE__ */ new Map();
      for (const u of n) {
        const f = t._nodeMap.get(u);
        f?.parentId && i.set(u, f.parentId);
      }
      for (const u of [...n])
        for (const f of ft(u, t.nodes))
          n.add(f);
      B("destroy", `Removing ${n.size} node(s)`, [...n]);
      const r = t.nodes.filter((u) => n.has(u.id));
      let s = [];
      t._config.reconnectOnDelete && (s = ff(n, t.nodes, t.edges));
      const l = [];
      t.edges = t.edges.filter((u) => n.has(u.source) || n.has(u.target) ? (l.push(u.id), !1) : !0), s.length && (t.edges.push(...s), B("destroy", `Created ${s.length} reconnection edge(s)`)), t._rebuildEdgeMap(), t.nodes = t.nodes.filter((u) => !n.has(u.id)), t._rebuildNodeMap();
      for (const u of n)
        t.selectedNodes.delete(u), t._initialDimensions.delete(u), t._uninstallChildLayoutWatchers(u);
      r.length && t._emit("nodes-change", { type: "remove", nodes: r }), s.length && t._emit("edges-change", { type: "add", edges: s });
      const a = t._container ? De.get(t._container) : void 0;
      if (a?.bridge) {
        for (const u of n)
          a.bridge.pushLocalNodeRemove(u);
        for (const u of l)
          a.bridge.pushLocalEdgeRemove(u);
        for (const u of s)
          a.bridge.pushLocalEdgeAdd(u);
      }
      t._recomputeChildValidation();
      const c = /* @__PURE__ */ new Set();
      for (const u of n) {
        const f = i.get(u);
        f && t._nodeMap.get(f)?.childLayout && c.add(f);
      }
      const d = /* @__PURE__ */ new Set();
      for (const u of c) {
        let f = u, h = t._nodeMap.get(u)?.parentId;
        for (; h; ) {
          const g = t._nodeMap.get(h);
          g?.childLayout && (f = h), h = g?.parentId;
        }
        d.add(f);
      }
      for (const u of d) t.layoutChildren?.(u);
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
      return Wo(e, t.nodes, t.edges);
    },
    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(e) {
      return cf(e, t.nodes, t.edges);
    },
    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(e) {
      return lf(e, t.edges);
    },
    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(e, n, o = !1) {
      return uf(e, n, t.edges, o);
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
      return o ? Qf(o, t.nodes, n) : [];
    },
    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(e, n, o) {
      const i = typeof e == "string" ? t.nodes.find((s) => s.id === e) : e, r = typeof n == "string" ? t.nodes.find((s) => s.id === n) : n;
      return !i || !r ? !1 : eh(i, r, o);
    },
    /**
     * Set runState on one or more nodes by ID.
     * The x-flow-node directive reactively applies .flow-node-{state} CSS classes.
     */
    setNodeState(e, n) {
      const o = Array.isArray(e) ? e : [e];
      for (const i of o) {
        const r = t._nodeMap.get(i);
        r && (r.runState = n);
      }
    },
    /**
     * Clear all runState values, removing state CSS classes from all nodes.
     */
    resetStates() {
      for (const e of t.nodes)
        delete e.runState;
    }
  };
}
function oh(t) {
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
      const n = t._config.defaultEdgeOptions, o = t._config.connectionRules, i = (Array.isArray(e) ? e : [e]).map((s) => n ? { ...n, ...s } : s).filter((s) => {
        if (!o) return !0;
        const l = { source: s.source, sourceHandle: s.sourceHandle, target: s.target, targetHandle: s.targetHandle };
        return at(l, o, t._nodeMap);
      });
      if (i.length === 0) return;
      t._captureHistory(), B("edge", `Adding ${i.length} edge(s)`, i.map((s) => s.id)), t.edges.push(...i), t._rebuildEdgeMap(), t._emit("edges-change", { type: "add", edges: i });
      const r = t._container ? De.get(t._container) : void 0;
      if (r?.bridge)
        for (const s of i)
          r.bridge.pushLocalEdgeAdd(s);
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
      const i = t._container ? De.get(t._container) : void 0;
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
     * Returns the first `.flow-edge-svg` element inside the viewport if any edges
     * exist. When the canvas has zero edges (e.g., a particle-only canvas using
     * sendParticleAlongPath or sendParticleBetween), lazily creates and caches a
     * dedicated `.flow-particle-svg` element inside the edges container so
     * particle emission methods have a place to inject temporary paths.
     */
    getEdgeSvgElement() {
      if (!t._viewportEl) return null;
      const e = t._viewportEl.querySelector(".flow-edge-svg");
      if (e) return e;
      const n = t._viewportEl.querySelector(".flow-edges");
      if (!n) return null;
      let o = n.querySelector(".flow-particle-svg");
      return o || (o = document.createElementNS("http://www.w3.org/2000/svg", "svg"), o.setAttribute("class", "flow-particle-svg"), o.style.position = "absolute", o.style.top = "0", o.style.left = "0", o.style.width = "1px", o.style.height = "1px", o.style.overflow = "visible", o.style.pointerEvents = "none", n.appendChild(o)), o;
    }
  };
}
function ih(t) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────
    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return vr(e, n, t._viewportLive ?? t.viewport, o);
    },
    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Mu(e, n, t._viewportLive ?? t.viewport, o);
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
      const o = t.nodes.filter((r) => !r.hidden), i = Vt(to(o, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
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
      const o = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, i = jn(
        e,
        o.width,
        o.height,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n?.padding ?? Xo
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
      return e ? n = e.map((o) => t.getNode(o)).filter((o) => !!o) : n = t.nodes.filter((o) => !o.hidden), Vt(to(n, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
    },
    /**
     * Compute the viewport (pan + zoom) that frames the given bounds
     * within the container, respecting min/max zoom and padding.
     */
    getViewportForBounds(e, n) {
      const o = t._container;
      return o ? jn(
        e,
        o.clientWidth,
        o.clientHeight,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n ?? Xo
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
      const n = t._viewportLive ?? t.viewport, o = t._config.maxZoom ?? 2, i = Math.min(n.zoom * Yi, o);
      B("viewport", "zoomIn", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.minZoom ?? 0.5, i = Math.max(n.zoom / Yi, o);
      B("viewport", "zoomOut", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Center the viewport on flow coordinate `(x, y)` at the given zoom
     * level (defaults to the current zoom).
     */
    setCenter(e, n, o, i) {
      const r = t._container;
      if (!r) return;
      const s = o ?? (t._viewportLive ?? t.viewport).zoom, l = r.clientWidth / 2 - e * s, a = r.clientHeight / 2 - n * s;
      B("viewport", "setCenter", { x: e, y: n, zoom: s }), t._panZoom?.setViewport({ x: l, y: a, zoom: s }, i);
    },
    /**
     * Pan the viewport by a delta `(dx, dy)`.
     */
    panBy(e, n, o) {
      const i = t._viewportLive ?? t.viewport;
      B("viewport", "panBy", { dx: e, dy: n }), t._panZoom?.setViewport(
        { x: i.x + e, y: i.y + n, zoom: i.zoom },
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
let yt = null;
const sh = 20;
function Zo(t) {
  return JSON.parse(JSON.stringify(t));
}
function us(t) {
  return `${t}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function Yr(t, e) {
  const n = t.filter((r) => r.selected), o = new Set(n.map((r) => r.id)), i = e.filter(
    (r) => r.selected || o.has(r.source) && o.has(r.target)
  );
  return yt = {
    nodes: Zo(n),
    edges: Zo(i),
    pasteCount: 0
  }, { nodeCount: n.length, edgeCount: i.length };
}
function rh() {
  if (!yt || yt.nodes.length === 0) return null;
  yt.pasteCount++;
  const t = yt.pasteCount * sh, e = /* @__PURE__ */ new Map(), n = yt.nodes.map((i) => {
    const r = us(i.id);
    return e.set(i.id, r), {
      ...i,
      id: r,
      data: Zo(i.data),
      position: { x: i.position.x + t, y: i.position.y + t },
      selected: !0
    };
  }), o = yt.edges.map((i) => ({
    ...i,
    id: us(i.id),
    source: e.get(i.source),
    target: e.get(i.target),
    selected: !0
  }));
  return { nodes: n, edges: o };
}
function ah(t, e) {
  const n = Yr(t, e);
  return { nodeIds: t.filter((i) => i.selected).map((i) => i.id), ...n };
}
function lh(t) {
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
      const e = [...t.selectedNodes].filter((a) => {
        const c = t.getNode(a);
        return c ? mf(c) : !1;
      }), n = [...t.selectedEdges].filter((a) => t.getEdge(a)?.deletable !== !1);
      let o = e.map((a) => t.getNode(a)).filter(Boolean);
      const i = new Set(e), r = t.edges.filter(
        (a) => i.has(a.source) || i.has(a.target)
      ), s = /* @__PURE__ */ new Map();
      for (const a of r) s.set(a.id, a);
      for (const a of n) {
        const c = t.getEdge(a);
        c && s.set(c.id, c);
      }
      const l = [...s.values()];
      if (o = o.filter((a) => {
        if (!a.parentId || o.some((h) => h.id === a.parentId)) return !0;
        const c = t._getChildValidation(a.parentId);
        if (!c) return !0;
        const d = t.getNode(a.parentId);
        if (!d) return !0;
        const u = t.nodes.filter(
          (h) => h.parentId === a.parentId
        ), f = no(d, a, u, c);
        return !f.valid && t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: d,
          child: a,
          operation: "remove",
          rule: f.rule,
          message: f.message
        }), f.valid;
      }), !(o.length === 0 && l.length === 0)) {
        if (t._config?.onBeforeDelete) {
          const a = await t._config.onBeforeDelete({
            nodes: o,
            edges: l
          });
          if (a === !1) {
            B("delete", "onBeforeDelete cancelled deletion");
            return;
          }
          t._captureHistory(), t._suspendHistory();
          try {
            if (a.nodes.length > 0 && (B("delete", `onBeforeDelete approved ${a.nodes.length} node(s)`), t.removeNodes(a.nodes.map((c) => c.id))), a.edges.length > 0) {
              const c = a.edges.map((d) => d.id).filter((d) => t.edges.some((u) => u.id === d));
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
          if (o.length > 0 && (B("delete", `Deleting ${o.length} selected node(s)`), t.removeNodes(o.map((a) => a.id))), n.length > 0) {
            const a = n.filter(
              (c) => t.edges.some((d) => d.id === c)
            );
            a.length > 0 && (B("delete", `Deleting ${a.length} selected edge(s)`), t.removeEdges(a));
          }
          t._recomputeChildValidation();
          for (const a of t.selectedNodes)
            t.nodes.some((c) => c.id === a) || t.selectedNodes.delete(a);
          for (const a of t.selectedEdges)
            t.edges.some((c) => c.id === a) || t.selectedEdges.delete(a);
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
      const e = Yr(t.nodes, t.edges);
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
      const e = rh();
      if (e) {
        t._captureHistory(), t.deselectAll(), t.nodes.push(...e.nodes), t.nodes = Et(t.nodes), t._rebuildNodeMap(), t.edges.push(...e.edges), t._rebuildEdgeMap();
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
      const e = ah(t.nodes, t.edges);
      e.nodeCount !== 0 && (await t._deleteSelected(), t._emit("cut", { nodeCount: e.nodeCount, edgeCount: e.edgeCount }), B("clipboard", `Cut ${e.nodeCount} node(s)`));
    }
  };
}
function ch(t, e) {
  return t === e ? !0 : t === void 0 || e === void 0 ? t === e : JSON.stringify(t) === JSON.stringify(e);
}
function oo(t, e, n = {}) {
  const o = n.deleteMissing ?? !0, i = new Map(t.map((s) => [s.id, s])), r = [];
  for (const s of e) {
    const l = i.get(s.id);
    if (!l) {
      r.push(s);
      continue;
    }
    if (o)
      for (const a of Object.keys(l))
        a !== "id" && !(a in s) && delete l[a];
    for (const [a, c] of Object.entries(s))
      a === "id" || a === "__proto__" || a === "constructor" || a === "prototype" || ch(l[a], c) || (l[a] = c);
    r.push(l);
  }
  return r;
}
function fs(t, e, n) {
  const o = oo(t.nodes, Et(e.nodes));
  t.nodes.splice(0, t.nodes.length, ...o);
  const i = oo(t.edges, e.edges);
  t.edges.splice(0, t.edges.length, ...i), t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll();
  for (const r of t.nodes)
    r.selected && (r.selected = !1);
  for (const r of t.edges)
    r.selected && (r.selected = !1);
  t._emit("restore", { nodes: t.nodes, edges: t.edges, source: n }), requestAnimationFrame(() => {
    t._layoutAnimTick++;
  }), B("history", `${n} applied`, { nodes: e.nodes.length, edges: e.edges.length });
}
function dh(t) {
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
      }), e.nodes) {
        const n = Et(
          JSON.parse(JSON.stringify(e.nodes))
        ), o = oo(t.nodes, n);
        t.nodes.splice(0, t.nodes.length, ...o);
      }
      if (e.edges) {
        const n = JSON.parse(JSON.stringify(e.edges)), o = oo(t.edges, n);
        t.edges.splice(0, t.edges.length, ...o);
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
      e && fs(t, e, "undo");
    },
    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Merges into existing objects and rebuilds maps.
     */
    redo() {
      if (!t._history) return;
      const e = t._history.redo({ nodes: t.nodes, edges: t.edges });
      e && fs(t, e, "redo");
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
function uh(t, e) {
  return t * (1 - e);
}
function fh(t, e) {
  return t * e;
}
function hh(t, e) {
  return e === "in" ? t : 1 - t;
}
function ph(t, e, n) {
  const o = t.getTotalLength();
  t.style.strokeDasharray = String(o);
  const i = n === "in" ? uh(o, e) : fh(o, e);
  t.style.strokeDashoffset = String(i), (n === "in" && e < 1 || n === "out") && (t.style.setProperty("marker-start", "none"), t.style.setProperty("marker-end", "none"));
}
function gh(t) {
  t.style.removeProperty("stroke-dasharray"), t.style.removeProperty("stroke-dashoffset"), t.style.removeProperty("marker-start"), t.style.removeProperty("marker-end");
}
function mh(t, e, n) {
  t.style.opacity = String(hh(e, n));
}
function yh(t) {
  t.style.removeProperty("opacity");
}
const Qe = Math.PI * 2, Gt = /* @__PURE__ */ new Map(), wh = 64;
function yi(t) {
  if (typeof document > "u" || typeof document.createElementNS != "function")
    return null;
  const e = Gt.get(t);
  if (e) return e;
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  n.setAttribute("d", t);
  const o = n.getTotalLength(), i = (r) => {
    const s = n.getPointAtLength(r * o);
    return { x: s.x, y: s.y };
  };
  if (Gt.size >= wh) {
    const r = Gt.keys().next().value;
    r !== void 0 && Gt.delete(r);
  }
  return Gt.set(t, i), i;
}
function sy(t) {
  const { cx: e, cy: n, offset: o = 0, clockwise: i = !0 } = t, r = t.rx ?? t.radius ?? 100, s = t.ry ?? t.radius ?? 100, l = i ? 1 : -1;
  return (a) => ({
    x: e + r * Math.cos(Qe * a * l + o * Qe),
    y: n + s * Math.sin(Qe * a * l + o * Qe)
  });
}
function ry(t) {
  const { startX: e, startY: n, endX: o, endY: i, amplitude: r = 30, frequency: s = 1, offset: l = 0 } = t, a = o - e, c = i - n, d = Math.sqrt(a * a + c * c), u = d > 0 ? a / d : 1, h = -(d > 0 ? c / d : 0), g = u;
  return (p) => {
    const y = e + a * p, m = n + c * p, x = r * Math.sin(Qe * s * p + l * Qe);
    return { x: y + h * x, y: m + g * x };
  };
}
function ay(t, e) {
  const n = yi(t);
  if (!n) return null;
  const { reverse: o = !1, startAt: i = 0, endAt: r = 1 } = e ?? {}, s = r - i;
  return (l) => {
    let a = i + l * s;
    return o && (a = r - l * s), n(a);
  };
}
function ly(t) {
  const { cx: e, cy: n, radius: o, angle: i = 60, offset: r = 0 } = t, s = i * Math.PI / 180;
  return (l) => {
    const a = s * Math.sin(Qe * l + r * Qe);
    return {
      x: e + o * Math.sin(a),
      y: n + o * Math.cos(a)
    };
  };
}
function cy(t) {
  const { originX: e, originY: n, range: o = 20, speed: i = 1, seed: r = 0 } = t, s = 1 + r % 7 * 0.3, l = 1.3 + r % 11 * 0.2, a = 0.7 + r % 13 * 0.25, c = 1.1 + r % 17 * 0.15;
  return (d) => {
    const u = d * i * Qe, f = (Math.sin(s * u) + Math.sin(l * u * 1.3)) / 2, h = (Math.sin(a * u * 0.9) + Math.sin(c * u * 1.1)) / 2;
    return { x: e + f * o, y: n + h * o };
  };
}
function dy(t, e) {
  const n = e?.from ?? 0;
  return (o, i) => n + o * t;
}
let hs = !1;
function we(t) {
  try {
    return structuredClone(t);
  } catch {
    return hs || (hs = !0, typeof console < "u" && console.warn(
      "[AlpineFlow] Cloning fell back to JSON roundtrip because structuredClone could not clone the input (likely a reactive proxy or an object with functions). Non-JSON values (functions, Symbols, Dates) will be stripped. This warning fires once per session."
    )), JSON.parse(JSON.stringify(t));
  }
}
function vh(t) {
  return {
    position: { ...t.position },
    class: t.class,
    style: typeof t.style == "string" ? t.style : t.style ? { ...t.style } : void 0,
    data: we(t.data),
    dimensions: t.dimensions ? { ...t.dimensions } : void 0,
    selected: t.selected,
    zIndex: t.zIndex
  };
}
function _h(t) {
  return {
    animated: t.animated,
    color: t.color,
    class: t.class,
    label: t.label,
    strokeWidth: t.strokeWidth
  };
}
function bh(t, e) {
  t.position.x = e.position.x, t.position.y = e.position.y, t.class = e.class, t.style = e.style, t.data = we(e.data), t.dimensions = e.dimensions ? { ...e.dimensions } : t.dimensions, t.selected = e.selected, t.zIndex = e.zIndex;
}
class wi {
  constructor(e, n) {
    this._entries = [], this._state = "idle", this._reversed = !1, this._loopCount = -1, this._lockEnabled = !1, this._locked = !1, this._respectReducedMotion = void 0, this._listeners = /* @__PURE__ */ new Map(), this._context = {}, this._activeHandles = [], this._subTimelines = [], this._initialSnapshot = /* @__PURE__ */ new Map(), this._initialEdgeSnapshot = /* @__PURE__ */ new Map(), this._playResolve = null, this._pauseWaiters = /* @__PURE__ */ new Set(), this._canvas = e, this._engine = n ?? new Er();
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
    const o = new wi(this._canvas, this._engine);
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
    return Cr(this._respectReducedMotion);
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
          o && this._initialSnapshot.set(n, vh(o));
        }
    }
    if (e.edges) {
      for (const n of e.edges)
        if (!this._initialEdgeSnapshot.has(n)) {
          const o = this._canvas.getEdge(n);
          o && this._initialEdgeSnapshot.set(n, _h(o));
        }
    }
  }
  _restoreInitialSnapshot() {
    for (const [e, n] of this._initialSnapshot) {
      const o = this._canvas.getNode(e);
      o && bh(o, n);
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
        const l = s.config, a = typeof l == "function" ? l(this._makeContext(r)) : l;
        a.parallel ? await this._executeParallelSteps(a.parallel, r) : await this._executeStep(a, r);
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
    const o = this._isReducedMotion(), i = o ? 0 : e.duration ?? 300, r = o ? 0 : e.delay ?? 0, s = Zn(e.easing), l = this._makeContext(n, e.id);
    if (e.when && !e.when(l)) {
      if (e.else)
        return this._executeStep(e.else, n);
      this._emit("step-skipped", { index: n, id: e.id });
      return;
    }
    if (e.timeline) {
      const I = e.timeline;
      if (this._tag && !e.independent && I.setTag(this._tag), e.independent || this._subTimelines.push(I), this._emit("step", { index: n, id: e.id, timeline: I }), e.onStart?.(l), await I.play(), this._state === "stopped") return;
      if (e.onComplete?.(l), this._emit("step-complete", { timeline: I }), !e.independent) {
        const b = this._subTimelines.indexOf(I);
        b >= 0 && this._subTimelines.splice(b, 1);
      }
      return;
    }
    if (this._emit("step", { index: n, id: e.id }), e.onStart?.(l), e.await && (await this._resolveAwait(e, n), this._state === "stopped"))
      return;
    if (e.await && this._isAwaitOnlyStep(e))
      return e.onProgress?.(1, l), e.onComplete?.(l), this._emit("step-complete"), Promise.resolve();
    const { validNodeIds: a, validEdgeIds: c } = this._validateStepTargets(e, n);
    if (this._isEmptyStep(e, a, c))
      return e.onProgress?.(1, l), e.onComplete?.(l), this._emit("step-complete"), Promise.resolve();
    const d = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
    this._captureNodeFromValues(e, a, d, u);
    const f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
    this._captureEdgeFromValues(e, c, f, h);
    const g = this._resolveFollowPath(e), p = this._createGuidePath(e), y = !!(e.viewport || e.fitView || e.panTo);
    let m = null, x = null;
    y && this._canvas.viewport && (m = { ...this._canvas.viewport }, x = this._resolveTargetViewport(e));
    const M = e.edgeTransition ?? "none", v = e.addEdges?.map((I) => I.id) ?? [], C = e.removeEdges?.filter((I) => this._canvas.getEdge(I)).slice() ?? [], S = {
      step: e,
      ctx: l,
      duration: i,
      delay: r,
      easing: s,
      validNodeIds: a,
      validEdgeIds: c,
      resolvedPathFn: g,
      guidePathEl: p,
      nodeFromDimensions: d,
      nodeFromStyles: u,
      edgeFromStrokeWidth: f,
      edgeFromColor: h,
      viewportFrom: m,
      viewportTarget: x,
      transition: M,
      addEdgeIds: v,
      removeEdgeIds: C
    };
    if (i === 0)
      return this._executeInstantStep(S);
    const k = this._prepareAnimatedEdges(e, M, v);
    return k && await k, g ? this._executeFollowPathStep(S) : this._executeAnimatedStep(S);
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
    const i = e.nodes && e.nodes.length > 0, r = e.edges && e.edges.length > 0, s = !!(e.viewport || e.fitView || e.panTo), l = !!(e.addEdges?.length || e.removeEdges?.length), a = i && (!n || n.length === 0), c = r && (!o || o.length === 0);
    return !!(a && c && !s && !l || a && !r && !s && !l || c && !i && !s && !l);
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
        const r = new Promise((l) => {
          i = setTimeout(() => l("timeout"), e.timeout);
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
        s && (s.dimensions && e.dimensions && o.set(r, { ...s.dimensions }), e.style && s.style && i.set(r, pn(s.style)));
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
    const n = yi(e.followPath);
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
    const { step: n, ctx: o, delay: i, resolvedPathFn: r, validNodeIds: s, guidePathEl: l } = e;
    if (i > 0)
      return new Promise((a) => {
        const c = setTimeout(() => {
          this._applyStepFinal(n), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), a();
        }, i), d = {
          stop() {
            clearTimeout(c);
          }
        };
        this._activeHandles.push(d);
      });
    if (r && s) {
      const a = r(1);
      for (const c of s) {
        const d = this._canvas.getNode(c);
        d && (d.position.x = a.x, d.position.y = a.y);
      }
    }
    return this._applyStepFinal(n), l && n.guidePath?.autoRemove !== !1 && l.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), Promise.resolve();
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
      validNodeIds: l,
      validEdgeIds: a,
      nodeFromDimensions: c,
      nodeFromStyles: d,
      edgeFromStrokeWidth: u,
      edgeFromColor: f,
      viewportFrom: h,
      viewportTarget: g,
      transition: p,
      addEdgeIds: y,
      removeEdgeIds: m,
      guidePathEl: x
    } = e, M = e.resolvedPathFn;
    return new Promise((v) => {
      const C = this._engine.register((S) => {
        if (this._state === "stopped")
          return v(), !0;
        const k = Math.min(S / i, 1), I = s(k);
        if (l) {
          const b = M(I);
          for (const E of l) {
            const A = this._canvas.getNode(E);
            A && (A.position.x = b.x, A.position.y = b.y);
          }
        }
        return this._interpolateFollowPathTick(
          n,
          I,
          l,
          a,
          c,
          d,
          u,
          f,
          h,
          g
        ), this._tickEdgeTransitions(p, y, m, I), n.onProgress?.(k, o), k >= 1 ? (this._cleanupEdgeTransitions(p, y, m), m.length && this._removeEdges(m), this._applyStepInstant(n), x && n.guidePath?.autoRemove !== !1 && x.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), v(), !0) : !1;
      }, r);
      this._activeHandles.push(C);
    });
  }
  /** Per-tick interpolation for properties during followPath animation. */
  _interpolateFollowPathTick(e, n, o, i, r, s, l, a, c, d) {
    if (o && e.dimensions)
      for (const u of o) {
        const f = this._canvas.getNode(u), h = r.get(u);
        !f || !h || !f.dimensions || (e.dimensions.width !== void 0 && (f.dimensions.width = et(h.width, e.dimensions.width, n)), e.dimensions.height !== void 0 && (f.fixedDimensions = !0, f.dimensions.height = et(h.height, e.dimensions.height, n)));
      }
    if (o && e.style) {
      const u = pn(e.style);
      for (const f of o) {
        const h = this._canvas.getNode(f), g = s.get(f);
        h && g && (h.style = Sr(g, u, n));
      }
    }
    if (i && e.edgeStrokeWidth !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = l.get(u);
        f && (h !== void 0 ? f.strokeWidth = et(h, e.edgeStrokeWidth, n) : f.strokeWidth = e.edgeStrokeWidth);
      }
    if (i && e.edgeColor !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = a.get(u);
        f && (h !== void 0 && typeof h == "string" ? f.color = hi(h, e.edgeColor, n) : f.color = e.edgeColor);
      }
    if (c && d && this._canvas.viewport) {
      const u = zu(c, d, n, {
        minZoom: this._canvas.minZoom,
        maxZoom: this._canvas.maxZoom
      });
      this._canvas.viewport.x = u.x, this._canvas.viewport.y = u.y, this._canvas.viewport.zoom = u.zoom;
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
      validEdgeIds: l,
      viewportFrom: a,
      viewportTarget: c,
      transition: d,
      addEdgeIds: u,
      removeEdgeIds: f,
      guidePathEl: h
    } = e;
    return new Promise((g) => {
      const p = this._buildAnimateTargets(
        n,
        s,
        l,
        a,
        c
      ), y = Object.keys(p.nodes || {}).length > 0 || Object.keys(p.edges || {}).length > 0 || p.viewport;
      if (!y && !u.length && !f.length) {
        n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), g();
        return;
      }
      if (y) {
        const m = this._canvas.animate(p, {
          duration: i,
          easing: n.easing,
          delay: r,
          onProgress: (x) => {
            if (this._state === "stopped") {
              m.stop(), g();
              return;
            }
            this._tickEdgeTransitions(d, u, f, x), n.onProgress?.(x, o);
          },
          onComplete: () => {
            this._cleanupEdgeTransitions(d, u, f), f.length && this._removeEdges(f), this._applyStepInstant(n), h && n.guidePath?.autoRemove !== !1 && h.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), g();
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
      for (const l of n) {
        const a = {};
        e.position && (a.position = { ...e.position }), e.dimensions && (a.dimensions = { ...e.dimensions }), e.style !== void 0 && (a.style = e.style), e.class !== void 0 && (a.class = e.class), e.data !== void 0 && (a.data = e.data), e.selected !== void 0 && (a.selected = e.selected), e.zIndex !== void 0 && (a.zIndex = e.zIndex), s.nodes[l] = a;
      }
    }
    if (o) {
      s.edges = {};
      for (const l of o) {
        const a = {};
        e.edgeColor !== void 0 && (a.color = e.edgeColor), e.edgeStrokeWidth !== void 0 && (a.strokeWidth = e.edgeStrokeWidth), e.edgeLabel !== void 0 && (a.label = e.edgeLabel), e.edgeAnimated !== void 0 && (a.animated = e.edgeAnimated), e.edgeClass !== void 0 && (a.class = e.edgeClass), s.edges[l] = a;
      }
    }
    return r && i && (s.viewport = {
      pan: { x: r.x, y: r.y },
      zoom: r.zoom
    }), s;
  }
  /** Run edge lifecycle transitions (draw/fade) via the engine when there are no other animatable targets. */
  _executeEdgeLifecycleOnly(e, n) {
    const { step: o, ctx: i, duration: r, delay: s, transition: l, addEdgeIds: a, removeEdgeIds: c, guidePathEl: d } = e, u = this._engine.register((f) => {
      if (this._state === "stopped")
        return n(), !0;
      const h = Math.min(f / r, 1);
      return this._tickEdgeTransitions(l, a, c, h), o.onProgress?.(h, i), h >= 1 ? (this._cleanupEdgeTransitions(l, a, c), c.length && this._removeEdges(c), d && o.guidePath?.autoRemove !== !1 && d.remove(), o.onProgress?.(1, i), o.onComplete?.(i), this._emit("step-complete"), n(), !0) : !1;
    }, s);
    this._activeHandles.push(u);
  }
  // ── Internal: apply step properties ─────────────────────────────────
  /** Apply all properties of a step at their final values (for instant steps). */
  _applyStepFinal(e) {
    if (e.addEdges && this._addEdges(e.addEdges), e.removeEdges && this._removeEdges(e.removeEdges), e.nodes)
      for (const n of e.nodes) {
        const o = this._canvas.getNode(n);
        o && (e.position && (e.position.x !== void 0 && (o.position.x = e.position.x), e.position.y !== void 0 && (o.position.y = e.position.y)), e.class !== void 0 && (o.class = e.class), e.data !== void 0 && Object.assign(o.data, e.data), e.selected !== void 0 && (o.selected = e.selected), e.zIndex !== void 0 && (o.zIndex = e.zIndex), e.dimensions && o.dimensions && (e.dimensions.width !== void 0 && (o.dimensions.width = e.dimensions.width), e.dimensions.height !== void 0 && (o.fixedDimensions = !0, o.dimensions.height = e.dimensions.height)), e.style !== void 0 && (o.style = e.style));
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
      r && ph(r, n, o);
    }
  }
  /** Clean up draw transition styles. */
  _cleanupEdgeDrawTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgePathElement?.(n);
      o && gh(o);
    }
  }
  /** Apply fade transition on each tick for added/removed edges. */
  _applyEdgeFadeTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgeElement?.(i);
      r && mh(r, n, o);
    }
  }
  /** Clean up fade transition styles. */
  _cleanupEdgeFadeTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgeElement?.(n);
      o && yh(o);
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
    const i = Vt(o), r = e.fitViewPadding ?? 0.1;
    return jn(
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
    const r = n.dimensions?.width ?? _e, s = n.dimensions?.height ?? be, l = n.position.x + r / 2, a = n.position.y + s / 2;
    return {
      x: i.width / 2 - l * o.zoom,
      y: i.height / 2 - a * o.zoom,
      zoom: o.zoom
    };
  }
  /** Apply viewport at final values (for instant steps). */
  _applyViewportFinal(e) {
    const n = this._resolveTargetViewport(e);
    !n || !this._canvas.viewport || (this._canvas.viewport.x = n.x, this._canvas.viewport.y = n.y, this._canvas.viewport.zoom = n.zoom);
  }
}
const Wr = /* @__PURE__ */ new Map();
function Wt(t, e) {
  Wr.set(t, e);
}
function xh(t) {
  return Wr.get(t);
}
const Re = "http://www.w3.org/2000/svg", Eh = {
  create(t, e) {
    const n = document.createElementNS(Re, "circle");
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
}, Ch = {
  create(t, e) {
    const n = document.createElementNS(Re, "g"), o = e.size ?? 6, i = e.color ?? "#8B5CF6", r = document.createElementNS(Re, "circle");
    r.setAttribute("r", String(o * 1.5)), r.setAttribute("fill", i), r.setAttribute("opacity", "0.3"), n.appendChild(r);
    const s = document.createElementNS(Re, "circle");
    if (s.setAttribute("r", String(o)), s.setAttribute("fill", i), n.appendChild(s), e.class)
      for (const l of e.class.split(" "))
        l && n.classList.add(l);
    return t.appendChild(n), n;
  },
  update(t, { x: e, y: n, elapsed: o }) {
    const r = 1 + 0.2 * Math.sin(o * 1e-3 * 2 * Math.PI * 2);
    t.setAttribute("transform", `translate(${e},${n}) scale(${r})`);
  },
  destroy(t) {
    t.remove();
  }
};
let Sh = 0;
const kh = {
  create(t, e) {
    const n = document.createElementNS(Re, "g");
    if (n.__beamLength = e.length ?? 30, n.__beamWidth = e.width ?? 4, n.__beamColor = e.color ?? "#8B5CF6", n.__beamGradient = e.gradient, n.__beamFollowThrough = e.followThrough ?? !0, n.__beamUid = `afbeam-${++Sh}`, e.class)
      for (const o of e.class.split(" "))
        o && n.classList.add(o);
    return t.appendChild(n), n;
  },
  update(t, e) {
    const n = t, o = n.__beamLength, i = n.__beamWidth, r = n.__beamColor, s = n.__beamGradient, l = n.__beamUid;
    if (e.pathEl) {
      let d = n.__pathClone, u = n.__gradient;
      if (!d) {
        let p = r;
        if (s && s.length > 0) {
          const y = document.createElementNS(Re, "defs");
          u = document.createElementNS(Re, "linearGradient"), u.setAttribute("id", l), u.setAttribute("gradientUnits", "userSpaceOnUse");
          for (const m of s) {
            const x = document.createElementNS(Re, "stop");
            x.setAttribute("offset", String(m.offset)), x.setAttribute("stop-color", m.color), m.opacity !== void 0 && x.setAttribute("stop-opacity", String(m.opacity)), u.appendChild(x);
          }
          y.appendChild(u), n.appendChild(y), p = `url(#${l})`, n.__gradient = u;
        }
        d = document.createElementNS(Re, "path"), d.setAttribute("d", e.pathEl.getAttribute("d") ?? ""), d.setAttribute("fill", "none"), d.style.stroke = p, d.style.strokeWidth = String(i), d.style.strokeLinecap = "round", d.style.fill = "none", s || (d.style.opacity = "0.85"), d.setAttribute("stroke-dasharray", `${o} ${e.pathLength}`), n.appendChild(d), n.__pathClone = d;
      }
      const h = n.__beamFollowThrough ? e.progress * (e.pathLength + o) : e.progress * e.pathLength, g = o - h;
      if (d.setAttribute("stroke-dashoffset", String(g)), u) {
        const p = Math.max(0, Math.min(e.pathLength, h)), y = Math.max(0, Math.min(e.pathLength, h - o)), m = e.pathEl.getPointAtLength(p), x = e.pathEl.getPointAtLength(y);
        u.setAttribute("x1", String(x.x)), u.setAttribute("y1", String(x.y)), u.setAttribute("x2", String(m.x)), u.setAttribute("y2", String(m.y));
      }
      return;
    }
    let a = n.__fallbackRect;
    a || (a = document.createElementNS(Re, "rect"), a.setAttribute("width", String(o)), a.setAttribute("height", String(i)), a.setAttribute("rx", String(i / 2)), a.setAttribute("fill", r), a.setAttribute("opacity", "0.8"), n.appendChild(a), n.__fallbackRect = a);
    const c = Math.atan2(e.velocity.y, e.velocity.x) * (180 / Math.PI);
    a.setAttribute(
      "transform",
      `translate(${e.x - o / 2},${e.y - i / 2}) rotate(${c},${o / 2},${i / 2})`
    );
  },
  destroy(t) {
    t.remove();
  }
}, Lh = {
  create(t, e) {
    const n = document.createElementNS(Re, "circle");
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
}, Ph = {
  create(t, e) {
    const n = e.size ?? 16, o = e.href ?? "";
    let i;
    if (o.startsWith("#") ? (i = document.createElementNS(Re, "use"), i.setAttribute("href", o), i.setAttribute("width", String(n)), i.setAttribute("height", String(n))) : (i = document.createElementNS(Re, "image"), i.setAttribute("href", o), i.setAttribute("width", String(n)), i.setAttribute("height", String(n))), e.class)
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
Wt("circle", Eh);
Wt("orb", Ch);
Wt("beam", kh);
Wt("pulse", Lh);
Wt("image", Ph);
let ps = !1;
function Mh(t) {
  const e = t.match(/^([\d.]+)(ms|s)?$/);
  if (!e) return 2e3;
  const n = parseFloat(e[1]);
  return e[2] === "ms" ? n : n * 1e3;
}
function gs(t, e, n) {
  if (t.speed !== void 0 && t.speed > 0)
    return t.duration !== void 0 && console.warn("[AlpineFlow] Both speed and duration provided for particle; speed takes precedence."), e / t.speed * 1e3;
  const o = t.duration ?? n;
  return typeof o == "number" ? o : Mh(o);
}
function Th(t) {
  function e(o, i, r = {}, s = {}) {
    const l = r.renderer ?? "circle", a = xh(l);
    if (!a) {
      B("particle", `_fireParticleOnPath: unknown renderer "${l}"`);
      return;
    }
    l === "beam" && typeof r.onComplete == "function" && r.followThrough === void 0 && !ps && (ps = !0, console.warn(
      "[AlpineFlow] beam `onComplete` fires after the tail exits the path (follow-through is on by default). Pass `followThrough: false` if you want `onComplete` to fire when the head reaches the target."
    ));
    const c = t._containerStyles, d = r.size ?? s.size ?? (parseFloat(c?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), u = r.color ?? s.color ?? c?.getPropertyValue("--flow-edge-dot-fill").trim() ?? hn, f = s.durationFallback ?? c?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", h = o.getTotalLength(), g = gs(r, h, f), p = { ...r, size: d, color: u }, y = a.create(i, p), m = o.getPointAtLength(0), x = {
      x: m.x,
      y: m.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength: h,
      elapsed: 0,
      pathEl: o
    };
    a.update(y, x);
    let M;
    const v = new Promise((b) => {
      M = b;
    }), C = () => {
      typeof r.onComplete == "function" && r.onComplete(), M();
    }, S = s.wrapOnComplete ? s.wrapOnComplete(C) : C, k = {
      element: y,
      renderer: a,
      pathEl: o,
      startElapsed: -1,
      // set on first engine tick
      ms: g,
      onComplete: S,
      currentPosition: { x: m.x, y: m.y }
    };
    return t._activeParticles.add(k), t._particleEngineHandle || (t._particleEngineHandle = Un.register((b) => t._tickParticles(b))), {
      getCurrentPosition() {
        return t._activeParticles.has(k) ? { ...k.currentPosition } : null;
      },
      stop() {
        t._activeParticles.has(k) && (k.renderer.destroy(k.element), t._activeParticles.delete(k), S());
      },
      get finished() {
        return v;
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
    const l = e(s, r, i, {
      wrapOnComplete: (a) => () => {
        a(), s.remove();
      }
    });
    if (!l) {
      s.remove();
      return;
    }
    return B("particle", "sendParticleAlongPath", { path: o.slice(0, 40) }), l;
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
        let l = i.get(r.pathEl);
        l === void 0 && (l = r.pathEl.getTotalLength(), i.set(r.pathEl, l));
        const a = r.pathEl.getPointAtLength(s * l), c = {
          x: a.x,
          y: a.y,
          progress: s,
          velocity: {
            x: a.x - r.currentPosition.x,
            y: a.y - r.currentPosition.y
          },
          pathLength: l,
          elapsed: o - r.startElapsed,
          pathEl: r.pathEl
        };
        r.renderer.update(r.element, c), r.currentPosition = { x: a.x, y: a.y };
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
      const l = t.getEdgePathElement(o);
      if (!l) {
        B("particle", `sendParticle: no path element for edge "${o}"`);
        return;
      }
      if (!l.getAttribute("d")) {
        B("particle", `sendParticle: edge "${o}" path has no d attribute`);
        return;
      }
      const c = t.getEdgeElement(o);
      if (!c) return;
      const d = t._containerStyles, u = i.size ?? s.particleSize ?? (parseFloat(d?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), f = i.color ?? s.particleColor ?? d?.getPropertyValue("--flow-edge-dot-fill").trim() ?? hn, h = s.animationDuration ?? d?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", g = e(l, c, i, {
        size: u,
        color: f,
        durationFallback: h
      });
      return g && B("particle", `sendParticle on edge "${o}"`, { size: u, color: f, duration: i.duration }), g;
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
      const l = t.getNode(i);
      if (!l) {
        B("particle", `sendParticleBetween: target node "${i}" not found`);
        return;
      }
      const a = s.position.x + (s.dimensions?.width ?? 150) / 2, c = s.position.y + (s.dimensions?.height ?? 40) / 2, d = l.position.x + (l.dimensions?.width ?? 150) / 2, u = l.position.y + (l.dimensions?.height ?? 40) / 2, f = `M ${a} ${c} L ${d} ${u}`;
      return B("particle", `sendParticleBetween "${o}" -> "${i}"`, { path: f }), n(f, r);
    },
    // ── Burst: sequenced multi-particle emission ─────────────────────────
    /**
     * Fire multiple particles along a single edge with staggered timing.
     * An optional `variant` function customizes each particle individually.
     */
    sendParticleBurst(o, i) {
      const { count: r, stagger: s = 100, variant: l, ...a } = i, c = [], d = [];
      for (let f = 0; f < r; f++) {
        const h = l ? { ...a, ...l(f, r) } : { ...a };
        if (f === 0)
          c.push(this.sendParticle(o, h));
        else {
          const g = setTimeout(() => {
            c.push(this.sendParticle(o, h));
          }, f * s);
          d.push(g);
        }
      }
      const u = () => c.filter((f) => f != null);
      return {
        get handles() {
          return u();
        },
        get finished() {
          return new Promise((f) => {
            setTimeout(() => {
              Promise.all(u().map((h) => h.finished)).then(() => f());
            }, r * s + 50);
          });
        },
        stopAll() {
          for (const f of d)
            clearTimeout(f);
          for (const f of u())
            f.stop();
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
      const { targetNodeId: r, synchronize: s = "arrival", onAllArrived: l, ...a } = i, c = [], d = [];
      if (s === "arrival") {
        const f = o.map((p) => {
          const m = t.getEdgePathElement(p)?.getTotalLength() ?? 0;
          return { id: p, length: m };
        }).filter((p) => p.length > 0);
        if (f.length === 0) {
          const p = Promise.resolve();
          return { get handles() {
            return [];
          }, finished: p, stopAll() {
          } };
        }
        const h = Math.max(...f.map((p) => p.length)), g = gs(a, h, "2s");
        for (const { id: p, length: y } of f) {
          const m = y / h, x = g * m, M = g - x;
          if (M <= 0) {
            const v = this.sendParticle(p, { ...a, duration: x });
            v && c.push(v);
          } else {
            const v = setTimeout(() => {
              const C = this.sendParticle(p, { ...a, duration: x });
              C && c.push(C);
            }, M);
            d.push(v);
          }
        }
      } else
        for (const f of o) {
          const h = this.sendParticle(f, a);
          h && c.push(h);
        }
      const u = new Promise((f) => {
        setTimeout(() => {
          Promise.all(c.map((g) => g.finished)).then(() => {
            l?.(), f();
          });
        }, s === "arrival" ? 100 : 0);
      });
      return {
        get handles() {
          return c;
        },
        finished: u,
        stopAll() {
          for (const f of d)
            clearTimeout(f);
          for (const f of c)
            f.stop();
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
class Ah {
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
const Ko = 1, Go = 1 / 60;
class nn {
  constructor(e) {
    this._virtualTime = 0, this._inFlight = /* @__PURE__ */ new Map(), this._state = we(e);
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
    return we(this._state);
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
            o?.id && (this._state.nodes[o.id] = we(o));
        else n?.id ? this._state.nodes[n.id] = we(n) : e.args.id && e.args.node && (this._state.nodes[e.args.id] = we(e.args.node));
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
            o?.id && (this._state.edges[o.id] = we(o));
        else n?.id ? this._state.edges[n.id] = we(n) : e.args.id && e.args.edge && (this._state.edges[e.args.id] = we(e.args.edge));
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
    this._state = we(e.canvas), this._virtualTime = e.t, this._inFlight.clear();
    for (const n of e.inFlight) {
      const o = we(n);
      this._rehydrateAnim(o), this._inFlight.set(o.handleId, o);
    }
  }
  /** Capture the current engine state as a serializable Checkpoint payload. */
  captureCheckpointData() {
    return {
      canvas: we(this._state),
      inFlight: [...this._inFlight.values()].map((e) => this._serializeAnim(e)),
      tagRegistry: {}
    };
  }
  // ── Private helpers ───────────────────────────────────────────────────────
  _applyAnimate(e) {
    const n = e.args.handleId ?? `virt-${this._virtualTime.toFixed(3)}-${this._inFlight.size}`;
    e.args.handleId || console.warn("[AlpineFlow VirtualEngine] animate event missing handleId — determinism not guaranteed for this event");
    const o = e.args.targets ?? {}, i = e.args.options ?? {}, r = i.motion, s = r ? Mr(r) ?? void 0 : void 0, l = {
      handleId: n,
      type: s ? s.type : "eased",
      targets: we(o),
      startTime: this._virtualTime,
      duration: i.duration,
      easing: i.easing,
      motion: s,
      direction: "forward",
      currentValues: {},
      _motion: s
    };
    this._initAnim(l), this._inFlight.set(n, l);
  }
  _initAnim(e) {
    const n = {}, o = {};
    if (this._collectNumericProperties(e.targets, n, o, this._state), e._from = n, e.type === "eased")
      e._easingFn = Zn(e.easing);
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
    for (const [s, l] of Object.entries(e.nodes ?? {})) {
      const a = i.nodes[s];
      if (!a)
        continue;
      const c = l.position;
      c?.x !== void 0 && (n[`nodes.${s}.position.x`] = a.position?.x ?? 0, o[`nodes.${s}.position.x`] = c.x), c?.y !== void 0 && (n[`nodes.${s}.position.y`] = a.position?.y ?? 0, o[`nodes.${s}.position.y`] = c.y);
    }
    const r = e.viewport;
    r?.pan?.x !== void 0 && (n["viewport.x"] = i.viewport.x, o["viewport.x"] = r.pan.x), r?.pan?.y !== void 0 && (n["viewport.y"] = i.viewport.y, o["viewport.y"] = r.pan.y), r?.zoom !== void 0 && (n["viewport.zoom"] = i.viewport.zoom, o["viewport.zoom"] = r.zoom);
  }
  _rehydrateAnim(e) {
    if (e._motion = e.motion, e.type === "eased") {
      e._easingFn = Zn(e.easing), e._from = e.fromValues ? { ...e.fromValues } : { ...e.currentValues ?? {} };
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
    return we({
      handleId: e.handleId,
      type: e.type,
      targets: e.targets,
      startTime: e.startTime,
      duration: e.duration,
      easing: e.easing,
      motion: e.motion,
      direction: e.direction,
      integratorState: e._physicsStates ? n : e.integratorState,
      currentValues: e.currentValues,
      fromValues: e.fromValues
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
      const l = e._from[s], a = this._getTargetValue(s, e.targets) ?? l, c = et(l, a, r);
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
            kr(r, o, n);
            break;
          case "decay":
            pi(r, o, n);
            break;
          case "inertia":
            Lr(r, o, n, i);
            break;
          case "keyframes": {
            const s = o, l = s.duration ?? 5e3, a = l > 0 ? Math.min((this._virtualTime - e.startTime) / l, 1) : 1;
            Pr(r, s, a, i), a >= 1 && (r.settled = !0);
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
const jr = /* @__PURE__ */ new Map();
function vi(t, e) {
  jr.set(t, e);
}
function Nh(t) {
  return jr.get(t);
}
function _i(t, e = 20) {
  const n = Object.values(t);
  if (n.length === 0)
    return null;
  let o = 1 / 0, i = 1 / 0, r = -1 / 0, s = -1 / 0;
  for (const l of n) {
    const a = l.position?.x ?? 0, c = l.position?.y ?? 0, d = l.dimensions?.width ?? 150, u = l.dimensions?.height ?? 40;
    o = Math.min(o, a), i = Math.min(i, c), r = Math.max(r, a + d), s = Math.max(s, c + u);
  }
  return o -= e, i -= e, r += e, s += e, { minX: o, minY: i, vbWidth: r - o, vbHeight: s - i };
}
function Ur(t) {
  let e = "";
  for (const n of Object.values(t.edges)) {
    const o = t.nodes[n.source], i = t.nodes[n.target];
    if (!o || !i)
      continue;
    const r = (o.position?.x ?? 0) + (o.dimensions?.width ?? 150) / 2, s = (o.position?.y ?? 0) + (o.dimensions?.height ?? 40) / 2, l = (i.position?.x ?? 0) + (i.dimensions?.width ?? 150) / 2, a = (i.position?.y ?? 0) + (i.dimensions?.height ?? 40) / 2;
    e += `<line x1="${r}" y1="${s}" x2="${l}" y2="${a}" stroke="currentColor" stroke-width="1" opacity="0.5"/>`;
  }
  return e;
}
const $h = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = _i(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: l, vbHeight: a } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${l} ${a}" xmlns="http://www.w3.org/2000/svg">`;
    c += Ur(t);
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, g = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${g}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Ih = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = _i(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: l, vbHeight: a } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${l} ${a}" xmlns="http://www.w3.org/2000/svg">`;
    for (const d of Object.values(t.edges)) {
      const u = t.nodes[d.source], f = t.nodes[d.target];
      if (!u || !f)
        continue;
      const h = (u.position?.x ?? 0) + (u.dimensions?.width ?? 150) / 2, g = (u.position?.y ?? 0) + (u.dimensions?.height ?? 40) / 2, p = (f.position?.x ?? 0) + (f.dimensions?.width ?? 150) / 2, y = (f.position?.y ?? 0) + (f.dimensions?.height ?? 40) / 2;
      c += `<line x1="${h}" y1="${g}" x2="${p}" y2="${y}" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>`;
    }
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, g = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${g}" fill="none" stroke="currentColor" stroke-width="1.5" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Dh = {
  render(t, { width: e, height: n, inFlight: o }) {
    const i = Object.values(t.nodes);
    if (i.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const r = _i(t.nodes);
    if (!r)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const s = /* @__PURE__ */ new Set();
    if (o) {
      for (const f of o)
        if (f.targets?.nodes)
          for (const h of Object.keys(f.targets.nodes))
            s.add(h);
    }
    const { minX: l, minY: a, vbWidth: c, vbHeight: d } = r;
    let u = `<svg width="${e}" height="${n}" viewBox="${l} ${a} ${c} ${d}" xmlns="http://www.w3.org/2000/svg">`;
    u += Ur(t);
    for (const f of i) {
      const h = f.position?.x ?? 0, g = f.position?.y ?? 0, p = f.dimensions?.width ?? 150, y = f.dimensions?.height ?? 40;
      s.has(f.id ?? "") ? u += `<rect x="${h}" y="${g}" width="${p}" height="${y}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>` : u += `<rect x="${h}" y="${g}" width="${p}" height="${y}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
    }
    return u += "</svg>", u;
  }
};
vi("faithful", $h);
vi("outline", Ih);
vi("activity", Dh);
function Jo(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t > e ? o = i : n = i + 1;
  }
  return n;
}
function Qo(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t >= e ? o = i : n = i + 1;
  }
  return n;
}
function Rh(t, e) {
  return e.split(".").reduce((n, o) => n?.[o], t);
}
function Zr(t) {
  if (t !== null && typeof t == "object") {
    Object.freeze(t);
    for (const e of Object.keys(t))
      Zr(t[e]);
  }
  return t;
}
class bi {
  constructor(e) {
    this.version = e.version, this.duration = e.duration, this.initialState = Zr(we(e.initialState)), this.events = Object.freeze(we(e.events)), this.checkpoints = Object.freeze(we(e.checkpoints)), this.metadata = Object.freeze({ ...e.metadata ?? {} }), Object.freeze(this);
  }
  toJSON() {
    return {
      version: this.version,
      duration: this.duration,
      initialState: we(this.initialState),
      events: we(this.events),
      checkpoints: we(this.checkpoints),
      metadata: { ...this.metadata }
    };
  }
  static fromJSON(e) {
    if (e.version > Ko)
      throw new Error(
        `[AlpineFlow] Recording version ${e.version} is newer than supported (${Ko}). Please update AlpineFlow to replay this recording.`
      );
    return new bi(e);
  }
  /**
   * Returns unique subjects (nodes, edges, timelines, particles) that appeared
   * during the recording, with their first-seen and last-seen timestamps.
   */
  getSubjects() {
    const e = /* @__PURE__ */ new Map(), n = (o, i, r) => {
      const s = `${o}:${i}`, l = e.get(s);
      l ? (r < l.firstSeenT && (l.firstSeenT = r), r > l.lastSeenT && (l.lastSeenT = r)) : e.set(s, { kind: o, id: i, firstSeenT: r, lastSeenT: r });
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
          for (const l of Object.keys(s.targets?.nodes ?? {}))
            n("node", l, i);
          for (const l of Object.keys(s.targets?.edges ?? {}))
            n("edge", l, i);
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
            for (const l of s.sources)
              n("edge", l, i);
          s.options?.targetNodeId && n("node", s.options.targetNodeId, i);
          break;
        case "node-add":
        case "node-remove":
          if (s.id && n("node", s.id, i), Array.isArray(s.nodes))
            for (const l of s.nodes)
              l.id && n("node", l.id, i);
          break;
        case "edge-add":
        case "edge-remove":
          if (s.id && n("edge", s.id, i), Array.isArray(s.edges))
            for (const l of s.edges)
              l.id && n("edge", l.id, i);
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
            return !!(s.id === e || Array.isArray(s.nodes) && s.nodes.some((a) => a.id === e));
          case "edge-add":
          case "edge-remove":
            return !!(s.id === e || Array.isArray(s.edges) && s.edges.some((a) => a.id === e));
          default:
            return !1;
        }
      })())
        switch (r) {
          case "animate": {
            const a = s.options?.duration ?? 0;
            n.push({ startT: i, endT: i + a, reason: "animate" });
            break;
          }
          case "particle":
          case "particle-burst":
          case "particle-between": {
            const a = s.options?.duration ?? s.duration ?? 1;
            n.push({ startT: i, endT: i + a, reason: r });
            break;
          }
          case "converging": {
            const a = s.options?.duration ?? 1;
            n.push({ startT: i, endT: i + a, reason: "converging" });
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
      const i = Rh(o.canvas, e);
      i !== void 0 && n.push({ t: o.t, v: i });
    }
    return n;
  }
  /**
   * Returns the canvas state at virtual time `t` by running the VirtualEngine
   * up to that point from the nearest prior checkpoint.
   */
  getStateAt(e) {
    const n = new nn(this.initialState);
    let o = null;
    for (const c of this.checkpoints)
      c.t <= e && (!o || c.t > o.t) && (o = c);
    o && n.restoreCheckpoint(o);
    const i = o?.t ?? 0, r = this.events;
    let s = i;
    const l = Go * 1e3;
    let a = o ? Jo(r, i) : Qo(r, i);
    for (; s < e; ) {
      const c = Math.min(s + l, e);
      for (; a < r.length && r[a].t <= c; )
        n.applyEvent(r[a]), a++;
      const d = (c - s) / 1e3;
      n.advance(d), s = c;
    }
    return n.getState();
  }
  /**
   * Renders a thumbnail SVG snapshot of the canvas state at virtual time `t`.
   */
  renderThumbnailAt(e, n) {
    const o = this.getStateAt(e), i = n.renderer ?? "faithful", r = Nh(i);
    if (!r)
      throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${i}"`);
    return r.render(o, { width: n.width, height: n.height });
  }
}
class Fh {
  constructor(e, n = {}) {
    this._events = [], this._checkpoints = [], this._startTime = 0, this._originalMethods = {}, this._checkpointTimer = null, this._eventCounter = 0, this._activeAnims = /* @__PURE__ */ new Map(), this._canvas = e, this._checkpointInterval = n.checkpointInterval ?? 500, this._maxDuration = n.maxDuration ?? 6e4;
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
    this._captureCheckpoint(), this._activeAnims.clear();
    const i = {
      version: Ko,
      duration: this._virtualNow(),
      initialState: o,
      events: this._events,
      checkpoints: this._checkpoints,
      metadata: n
    };
    return new bi(i);
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
  /**
   * Capture the live canvas values that an animate()/update() call is about
   * to transition FROM. Keys are the same flat form VirtualEngine uses
   * (e.g. `nodes.n.position.x`) so rehydration can lerp correctly.
   */
  _snapshotFromValues(e) {
    const n = {}, o = e?.nodes ?? {}, i = /* @__PURE__ */ new Map();
    for (const s of this._canvas.nodes ?? [])
      s && typeof s == "object" && "id" in s && i.set(s.id, s);
    for (const [s, l] of Object.entries(o)) {
      const a = i.get(s);
      if (!a) continue;
      const c = l.position;
      c?.x !== void 0 && (n[`nodes.${s}.position.x`] = a.position?.x ?? 0), c?.y !== void 0 && (n[`nodes.${s}.position.y`] = a.position?.y ?? 0);
    }
    const r = e?.viewport;
    return r?.pan?.x !== void 0 && (n["viewport.x"] = this._canvas.viewport.x), r?.pan?.y !== void 0 && (n["viewport.y"] = this._canvas.viewport.y), r?.zoom !== void 0 && (n["viewport.zoom"] = this._canvas.viewport.zoom), n;
  }
  _captureSnapshot() {
    const e = {};
    for (const o of this._canvas.nodes ?? [])
      o && typeof o == "object" && "id" in o && (e[o.id] = we(o));
    const n = {};
    for (const o of this._canvas.edges ?? [])
      o && typeof o == "object" && "id" in o && (n[o.id] = we(o));
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
      inFlight: this._captureInFlight(),
      tagRegistry: {}
    });
  }
  /**
   * Serialize the current in-flight animations tracked by this recorder into
   * the InFlightAnimation shape the VirtualEngine can restore from.
   * Draws data from each ActiveAnim entry's original event args + the handle's
   * live state. Finished handles are skipped (the finished promise cleanup
   * typically runs before this, but we defend anyway).
   */
  _captureInFlight() {
    const e = [];
    for (const n of this._activeAnims.values()) {
      if (n.handle?.isFinished) continue;
      const o = n.options ?? {}, i = !!o.motion;
      let r = "eased";
      if (i) {
        const a = o.motion;
        typeof a == "string" ? r = a.split(".")[0] : a && typeof a == "object" && a.type && (r = a.type);
      }
      let s = {};
      const l = n.handle?.currentValue;
      l && typeof l.forEach == "function" && l.forEach((a, c) => {
        s[c] = a;
      }), e.push({
        handleId: n.handleId,
        type: r,
        targets: we(n.targets),
        startTime: n.eventT,
        duration: i ? void 0 : o.duration ?? 300,
        easing: i ? void 0 : o.easing,
        motion: i ? we(o.motion) : void 0,
        direction: n.handle?.direction ?? "forward",
        currentValues: s,
        fromValues: { ...n.fromValues },
        // integratorState populated if/when handles expose physics state.
        // For now, scrubbing into mid-physics relies on rehydration via
        // walk-forward from the nearest event; direct physics state
        // capture is a planned follow-up for perfect fidelity.
        integratorState: void 0
      });
    }
    return e;
  }
  _scheduleCheckpoints() {
    this._checkpointTimer = setInterval(() => {
      this._captureCheckpoint();
    }, this._checkpointInterval);
  }
  _installHooks() {
    const e = (o, i, r) => {
      const s = this._canvas[o];
      typeof s == "function" && (this._originalMethods[o] = s, this._canvas[o] = (...l) => {
        const a = r ? r(...l) : { args: l };
        return this._recordEvent(i, a), s.apply(this._canvas, l);
      });
    }, n = (o, i) => {
      const r = this._canvas[o];
      typeof r == "function" && (this._originalMethods[o] = r, this._canvas[o] = (s, l) => {
        const a = `rec-${++this._eventCounter}`, c = this._virtualNow(), d = this._snapshotFromValues(s);
        this._recordEvent(i, { targets: s, options: l, handleId: a });
        const u = r.apply(this._canvas, [s, l]);
        if (u && typeof u == "object" && u.finished && !u.isFinished) {
          const f = { handleId: a, eventT: c, targets: s, options: l, handle: u, fromValues: d };
          this._activeAnims.set(a, f), u.finished.then(() => {
            this._activeAnims.delete(a);
          }).catch(() => {
            this._activeAnims.delete(a);
          });
        }
        return u;
      });
    };
    n("animate", "animate"), n("update", "update"), e("sendParticle", "particle", (o, i) => ({ edgeId: o, options: i })), e("sendParticleAlongPath", "particle-along-path", (o, i) => ({ path: o, options: i })), e("sendParticleBetween", "particle-between", (o, i, r) => ({ source: o, target: i, options: r })), e("sendParticleBurst", "particle-burst", (o, i) => ({ edgeId: o, options: i })), e("sendConverging", "converging", (o, i) => ({ sources: o, options: i })), e("addNodes", "node-add", (o) => ({ nodes: o })), e("removeNodes", "node-remove", (o) => ({ ids: o })), e("addEdges", "edge-add", (o) => ({ edges: o })), e("removeEdges", "edge-remove", (o) => ({ ids: o }));
  }
  _uninstallHooks() {
    for (const [e, n] of Object.entries(this._originalMethods))
      this._canvas[e] = n;
    this._originalMethods = {};
  }
}
class Hh {
  constructor(e, n, o = {}) {
    this._currentTime = 0, this._state = "idle", this._direction = "forward", this._speed = 1, this._rafHandle = null, this._lastWallTime = 0, this._resolveFinished = () => {
    }, this.recording = n, this._canvas = e, this._virtualEngine = new nn(n.initialState), this._speed = o.speed ?? 1, this._direction = this._speed < 0 ? "backward" : "forward", this._from = o.from ?? 0, this._to = o.to ?? n.duration, this._loop = o.loop ?? !1, this._currentTime = this._from, this._from > 0 && this._seekEngineTo(this._from), o.skipInitialState || this._applyStateToCanvas(this._virtualEngine.getState()), this.finished = new Promise((i) => {
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
    this._state !== "playing" && (this._state === "ended" && (this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState())), this._state = "playing", this._lastWallTime = Co(), this._scheduleTick());
  }
  pause() {
    this._state === "playing" && (this._state = "paused", this._cancelTick());
  }
  stop() {
    this._cancelTick(), this._currentTime = this._from, this._virtualEngine = new nn(this.recording.initialState), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "idle";
  }
  scrubTo(e) {
    const n = this._resolveTarget(e);
    this._currentTime = n, this._seekEngineTo(n), this._applyStateToCanvas(this._virtualEngine.getState());
  }
  seek(e) {
    this.scrubTo(e);
  }
  eventsUpTo(e) {
    return this.recording.events.filter((n) => n.t <= e);
  }
  getStateAt(e) {
    const n = this._findNearestCheckpoint(e), o = new nn(this.recording.initialState);
    n && o.restoreCheckpoint(n);
    const i = n?.t ?? 0, r = this.recording.events;
    let s = i;
    const l = Go * 1e3;
    let a = n ? Jo(r, i) : Qo(r, i);
    for (; s < e; ) {
      const c = Math.min(s + l, e);
      for (; a < r.length && r[a].t <= c; )
        o.applyEvent(r[a]), a++;
      const d = (c - s) / 1e3;
      d > 0 && o.advance(d), s = c;
    }
    return o.getState();
  }
  // ── Private ─────────────────────────────────────────────────────────────
  _tick() {
    if (this._state !== "playing")
      return;
    const e = Co(), n = (e - this._lastWallTime) / 1e3;
    this._lastWallTime = e;
    const o = n * this._speed * 1e3, i = this._currentTime + o;
    if (this._direction === "forward" ? i >= this._to : i <= this._from) {
      const s = this._direction === "forward" ? this._to : this._from;
      this._direction === "forward" ? this._walkTo(this._currentTime, s, !0) : this._seekEngineTo(s), this._currentTime = s, this._applyStateToCanvas(this._virtualEngine.getState()), this._handleEnd();
      return;
    }
    o > 0 ? this._walkTo(this._currentTime, i, !0) : o < 0 && this._seekEngineTo(i), this._currentTime = i, this._applyStateToCanvas(this._virtualEngine.getState()), this._scheduleTick();
  }
  _scheduleTick() {
    typeof requestAnimationFrame == "function" ? this._rafHandle = requestAnimationFrame(() => this._tick()) : this._rafHandle = setTimeout(() => this._tick(), 16);
  }
  _cancelTick() {
    this._rafHandle !== null && (typeof cancelAnimationFrame == "function" ? cancelAnimationFrame(this._rafHandle) : clearTimeout(this._rafHandle), this._rafHandle = null);
  }
  /**
   * Reset the virtual engine to reflect the canvas state at virtual time `t`
   * — either by restoring the nearest checkpoint and walking forward, or by
   * walking from the recording's initial state. Used when seeking discretely
   * (play-after-ended, loop restart, constructor with non-zero `from`);
   * scrubTo has its own inlined copy because it also updates `_currentTime`.
   */
  _seekEngineTo(e) {
    const n = this._findNearestCheckpoint(e);
    n ? this._virtualEngine.restoreCheckpoint(n) : this._virtualEngine = new nn(this.recording.initialState), this._walkTo(n?.t ?? 0, e);
  }
  _walkTo(e, n, o = !1) {
    if (n <= e)
      return;
    const i = this.recording.events;
    let r = e;
    const s = Go * 1e3;
    let l = e === 0 ? Qo(i, 0) : Jo(i, e);
    for (; r < n; ) {
      const a = Math.min(r + s, n);
      for (; l < i.length && i[l].t <= a; ) {
        const d = i[l];
        this._virtualEngine.applyEvent(d), o && this._dispatchLiveParticle(d), l++;
      }
      const c = (a - r) / 1e3;
      c > 0 && this._virtualEngine.advance(c), r = a;
    }
  }
  /**
   * Forward a captured particle event to the live canvas so its visual
   * effect replays. Non-particle events (animate, update, structural) are
   * already driven by `_applyStateToCanvas` via the virtual engine's state
   * — particles are the one event class that only exists as a visual and
   * therefore must be re-emitted on the real canvas.
   */
  _dispatchLiveParticle(e) {
    const n = this._canvas;
    switch (e.type) {
      case "particle":
        n.sendParticle?.(e.args.edgeId, e.args.options);
        break;
      case "particle-along-path":
        n.sendParticleAlongPath?.(e.args.path, e.args.options);
        break;
      case "particle-between":
        n.sendParticleBetween?.(e.args.source, e.args.target, e.args.options);
        break;
      case "particle-burst":
        n.sendParticleBurst?.(e.args.edgeId, e.args.options);
        break;
      case "converging":
        n.sendConverging?.(e.args.sources, e.args.options);
        break;
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
        this._loop = typeof this._loop == "number" ? e : !0, this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "playing", this._lastWallTime = Co(), this._scheduleTick();
        return;
      }
    }
    this._state = "ended", this._rafHandle = null, this._resolveFinished();
  }
  _applyStateToCanvas(e) {
    this._reconcileNodes(e), this._reconcileEdges(e);
    for (const [n, o] of Object.entries(e.nodes)) {
      const i = this._canvas.nodes.find((r) => r.id === n);
      i && o.position && (i.position || (i.position = { x: 0, y: 0 }), o.position.x !== void 0 && (i.position.x = o.position.x), o.position.y !== void 0 && (i.position.y = o.position.y));
    }
    e.viewport && (this._canvas.viewport.x = e.viewport.x, this._canvas.viewport.y = e.viewport.y, this._canvas.viewport.zoom = e.viewport.zoom);
  }
  /**
   * Diff virtual vs. real node sets and apply structural changes. Prefers
   * the canvas's own addNodes/removeNodes when available so reactivity and
   * measurement hooks fire; falls back to direct array mutation otherwise.
   */
  _reconcileNodes(e) {
    const n = new Set(Object.keys(e.nodes)), o = new Set(this._canvas.nodes.map((s) => s?.id).filter(Boolean)), i = [];
    for (const s of n)
      o.has(s) || i.push(e.nodes[s]);
    const r = [];
    for (const s of o)
      n.has(s) || r.push(s);
    if (i.length > 0 && (typeof this._canvas.addNodes == "function" ? this._canvas.addNodes(i) : this._canvas.nodes.push(...i)), r.length > 0)
      if (typeof this._canvas.removeNodes == "function")
        this._canvas.removeNodes(r);
      else
        for (const s of r) {
          const l = this._canvas.nodes.findIndex((a) => a?.id === s);
          l !== -1 && this._canvas.nodes.splice(l, 1);
        }
  }
  _reconcileEdges(e) {
    const n = new Set(Object.keys(e.edges)), o = new Set(this._canvas.edges.map((s) => s?.id).filter(Boolean)), i = [];
    for (const s of n)
      o.has(s) || i.push(e.edges[s]);
    const r = [];
    for (const s of o)
      n.has(s) || r.push(s);
    if (i.length > 0 && (typeof this._canvas.addEdges == "function" ? this._canvas.addEdges(i) : this._canvas.edges.push(...i)), r.length > 0)
      if (typeof this._canvas.removeEdges == "function")
        this._canvas.removeEdges(r);
      else
        for (const s of r) {
          const l = this._canvas.edges.findIndex((a) => a?.id === s);
          l !== -1 && this._canvas.edges.splice(l, 1);
        }
  }
}
function Co() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
function Oh(t) {
  const e = Th(t);
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
      const n = new wi(t, Un);
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
        const h = o.boundTo;
        "node" in h ? o = {
          ...o,
          while: () => t.getNode(h.node)?.[h.property] === h.equals
        } : "edge" in h && (o = {
          ...o,
          while: () => t.getEdge(h.edge)?.[h.property] === h.equals
        });
      }
      const i = o.duration ?? 0, r = [], s = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), c = n.nodes ? Object.keys(n.nodes).length : 0, d = n.edges ? Object.keys(n.edges).length : 0;
      if (B("animate", "update() called", {
        nodes: c,
        edges: d,
        viewport: !!n.viewport,
        duration: i,
        easing: o.easing ?? "default",
        instant: i === 0
      }), n.nodes)
        for (const [h, g] of Object.entries(n.nodes)) {
          const p = t._nodeMap.get(h);
          if (!p) continue;
          const m = (g._duration ?? i) === 0;
          if (g.followPath && !m) {
            let x = null;
            typeof g.followPath == "function" ? x = g.followPath : x = yi(g.followPath);
            let M = null;
            if (g.guidePath?.visible && typeof g.followPath == "string" && typeof document < "u") {
              const v = t.getEdgeSvgElement?.();
              v && (M = document.createElementNS("http://www.w3.org/2000/svg", "path"), M.setAttribute("d", g.followPath), M.classList.add("flow-guide-path"), g.guidePath.class && M.classList.add(g.guidePath.class), v.appendChild(M));
            }
            if (x) {
              const v = x, C = M, S = g.guidePath?.autoRemove !== !1;
              r.push({
                key: `node:${h}:followPath`,
                from: 0,
                to: 1,
                apply: (k) => {
                  const I = t._nodeMap.get(h);
                  if (!I) return;
                  const b = v(k);
                  Se().raw(I).position.x = b.x, Se().raw(I).position.y = b.y, s.add(h), k >= 1 && C && S && C.remove();
                }
              });
            }
          } else if (g.position) {
            const M = Se().raw(p).position;
            if (g.position.x !== void 0) {
              const v = g.position.x;
              if (m)
                M.x = v;
              else {
                const C = M.x;
                r.push({
                  key: `node:${h}:position.x`,
                  from: C,
                  to: v,
                  apply: (S) => {
                    const k = t._nodeMap.get(h);
                    k && (Se().raw(k).position.x = S, s.add(h));
                  }
                });
              }
            }
            if (g.position.y !== void 0) {
              const v = g.position.y;
              if (m)
                M.y = v;
              else {
                const C = M.y;
                r.push({
                  key: `node:${h}:position.y`,
                  from: C,
                  to: v,
                  apply: (S) => {
                    const k = t._nodeMap.get(h);
                    k && (Se().raw(k).position.y = S), s.add(h);
                  }
                });
              }
            }
            m && s.add(h);
          }
          if (g.data !== void 0 && Object.assign(p.data, g.data), g.class !== void 0 && (p.class = g.class), g.selected !== void 0 && (p.selected = g.selected), g.zIndex !== void 0 && (p.zIndex = g.zIndex), g.style !== void 0)
            if (m)
              p.style = g.style, l.add(h);
            else {
              const x = pn(p.style || {}), M = pn(g.style), v = t._nodeElements.get(h);
              if (v) {
                const C = getComputedStyle(v);
                for (const S of Object.keys(M))
                  x[S] === void 0 && (x[S] = C.getPropertyValue(S));
              }
              r.push({
                key: `node:${h}:style`,
                from: 0,
                to: 1,
                apply: (C) => {
                  const S = t._nodeMap.get(h);
                  S && (Se().raw(S).style = Sr(x, M, C), l.add(h));
                }
              });
            }
          g.dimensions && p.dimensions && (g.dimensions.width !== void 0 && (m ? p.dimensions.width = g.dimensions.width : r.push({
            key: `node:${h}:dimensions.width`,
            from: p.dimensions.width,
            to: g.dimensions.width,
            apply: (x) => {
              p.dimensions.width = x;
            }
          })), g.dimensions.height !== void 0 && (p.fixedDimensions = !0, m ? p.dimensions.height = g.dimensions.height : r.push({
            key: `node:${h}:dimensions.height`,
            from: p.dimensions.height,
            to: g.dimensions.height,
            apply: (x) => {
              p.dimensions.height = x;
            }
          })));
        }
      if (n.edges)
        for (const [h, g] of Object.entries(n.edges)) {
          const p = t._edgeMap.get(h);
          if (!p) continue;
          const m = (g._duration ?? i) === 0;
          if (g.color !== void 0)
            if (typeof g.color == "object")
              p.color = g.color;
            else if (m)
              p.color = g.color, a.add(h);
            else {
              const x = typeof p.color == "string" && p.color || getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke").trim() || fi;
              r.push({
                key: `edge:${h}:color`,
                from: x,
                to: g.color,
                apply: (M) => {
                  const v = t._edgeMap.get(h);
                  v && (Se().raw(v).color = M, a.add(h));
                }
              });
            }
          if (g.strokeWidth !== void 0)
            if (m)
              p.strokeWidth = g.strokeWidth, a.add(h);
            else {
              const x = p.strokeWidth ?? (parseFloat(getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke-width").trim() || "1") || 1);
              r.push({
                key: `edge:${h}:strokeWidth`,
                from: x,
                to: g.strokeWidth,
                apply: (M) => {
                  const v = t._edgeMap.get(h);
                  v && (Se().raw(v).strokeWidth = M, a.add(h));
                }
              });
            }
          g.label !== void 0 && (p.label = g.label), g.animated !== void 0 && (p.animated = g.animated), g.class !== void 0 && (p.class = g.class);
        }
      if (n.viewport) {
        const h = n.viewport, p = (h._duration ?? i) === 0, y = t.viewport;
        h.pan?.x !== void 0 && (p ? y.x = h.pan.x : r.push({
          key: "viewport:pan.x",
          from: y.x,
          to: h.pan.x,
          apply: (m) => {
            y.x = m;
          }
        })), h.pan?.y !== void 0 && (p ? y.y = h.pan.y : r.push({
          key: "viewport:pan.y",
          from: y.y,
          to: h.pan.y,
          apply: (m) => {
            y.y = m;
          }
        })), h.zoom !== void 0 && (p ? y.zoom = h.zoom : r.push({
          key: "viewport:zoom",
          from: y.zoom,
          to: h.zoom,
          apply: (m) => {
            y.zoom = m;
          }
        }));
      }
      if (r.length === 0) {
        s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s)), l.size > 0 && t._flushNodeStyles(l), a.size > 0 && t._flushEdgeStyles(a);
        const h = {
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
        return o.onComplete?.(), h;
      }
      const f = Se().raw(t._animator).animate(r, {
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
        onProgress(h) {
          s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), s.clear()), l.size > 0 && (t._flushNodeStyles(l), l.clear()), a.size > 0 && (t._flushEdgeStyles(a), a.clear()), n.viewport && t._flushViewport(), o.onProgress?.(h);
        },
        onComplete() {
          if (n.nodes)
            for (const [h, g] of Object.entries(n.nodes)) {
              const p = t._nodeMap.get(h);
              if (!p) continue;
              const y = Se().raw(p);
              (g.followPath || g.position?.x !== void 0) && (p.position.x = y.position.x), (g.followPath || g.position?.y !== void 0) && (p.position.y = y.position.y), g.style !== void 0 && (p.style = y.style);
            }
          if (n.edges)
            for (const [h, g] of Object.entries(n.edges)) {
              const p = t._edgeMap.get(h);
              if (!p) continue;
              const y = Se().raw(p);
              g.color !== void 0 && typeof g.color == "string" && (p.color = y.color), g.strokeWidth !== void 0 && (p.strokeWidth = y.strokeWidth);
            }
          s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), s.clear()), l.size > 0 && (t._flushNodeStyles(l), l.clear()), a.size > 0 && (t._flushEdgeStyles(a), a.clear()), o.onComplete?.();
        }
      });
      return n.nodes && (f._targetNodeIds = Object.keys(n.nodes)), f;
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
      const i = Cr(t._config?.respectReducedMotion) ? 0 : o.duration ?? 300;
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
      const l = o.zoom, a = Un.register(() => {
        if (s) return !0;
        let d = null;
        if (typeof n == "string") {
          const y = t._nodeMap.get(n);
          if (y) {
            d = y.parentId ? t.getAbsolutePosition(n) : { ...y.position };
            const m = y.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            y.dimensions && (d.x += y.dimensions.width * (0.5 - m[0]), d.y += y.dimensions.height * (0.5 - m[1]));
          }
        } else if ("_targetNodeIds" in n && n._targetNodeIds?.length) {
          const y = n._targetNodeIds[0], m = t._nodeMap.get(y);
          if (m) {
            d = m.parentId ? t.getAbsolutePosition(y) : { ...m.position };
            const x = m.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            m.dimensions && (d.x += m.dimensions.width * (0.5 - x[0]), d.y += m.dimensions.height * (0.5 - x[1]));
          }
        } else if ("getCurrentPosition" in n && typeof n.getCurrentPosition == "function") {
          const y = n.getCurrentPosition();
          if (y)
            d = y;
          else
            return s = !0, a.stop(), t._followHandle = null, i(), !0;
        } else "x" in n && "y" in n && (d = n);
        if (!d) return !1;
        const u = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, f = l ?? t.viewport.zoom, h = u.width / 2 - d.x * f, g = u.height / 2 - d.y * f, p = 0.08;
        return t.viewport.x += (h - t.viewport.x) * p, t.viewport.y += (g - t.viewport.y) * p, l && (t.viewport.zoom += (l - t.viewport.zoom) * p), t._flushViewport(), !1;
      });
      return t._followHandle = a, typeof n == "object" && "_targetNodeIds" in n && n.finished && n.finished.then(() => {
        s || (s = !0, a.stop(), t._followHandle = null, i());
      }), {
        pause: () => {
        },
        resume: () => {
        },
        stop: () => {
          s = !0, a.stop(), t._followHandle = null, i();
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
      return Se().raw(t._animator).registry.getHandles(n);
    },
    /**
     * Cancel all animations matching a tag filter.
     */
    cancelAll(n, o) {
      Se().raw(t._animator).registry.cancelAll(n, o);
    },
    /**
     * Pause all animations matching a tag filter.
     */
    pauseAll(n) {
      Se().raw(t._animator).registry.pauseAll(n);
    },
    /**
     * Resume all animations matching a tag filter.
     */
    resumeAll(n) {
      Se().raw(t._animator).registry.resumeAll(n);
    },
    /**
     * Create a named group that auto-tags all animations made through it.
     */
    group(n) {
      const o = this;
      return new Ah(n, {
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
      const o = Se().raw(t._animator), i = o.beginTransaction();
      i.onAfterRollback?.((r) => {
        const s = /* @__PURE__ */ new Set();
        for (const l of r)
          if (l.startsWith("node:")) {
            const a = l.split(":")[1];
            a && s.add(a);
          }
        s.size > 0 && (t._flushNodePositions(s), t._flushNodeStyles(s), t._refreshEdgePaths(s));
      });
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
      const n = structuredClone(Se().raw(t.nodes)), o = structuredClone(Se().raw(t.edges)), i = { ...t.viewport };
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
      const i = this, r = i.animate, s = i.update, l = i.sendParticle, a = i.sendParticleAlongPath, c = i.sendParticleBetween, d = i.sendParticleBurst, u = i.sendConverging, f = {
        get nodes() {
          return t.nodes;
        },
        get edges() {
          return t.edges;
        },
        get viewport() {
          return t.viewport;
        },
        animate: (p, y) => {
          const m = i.update;
          i.update = s;
          try {
            return r.call(i, p, y);
          } finally {
            i.update = m;
          }
        },
        update: (p, y) => s.call(i, p, y),
        sendParticle: (p, y) => l.call(i, p, y),
        sendParticleAlongPath: (p, y) => a.call(i, p, y),
        sendParticleBetween: (p, y, m) => c.call(i, p, y, m),
        sendParticleBurst: (p, y) => d.call(i, p, y),
        sendConverging: (p, y) => u.call(i, p, y),
        addNodes: (p) => t.addNodes(p),
        removeNodes: (p) => t.removeNodes(p),
        addEdges: (p) => t.addEdges(p),
        removeEdges: (p) => t.removeEdges(p)
      }, h = new Fh(f, o), g = async () => {
        i.animate = (...p) => f.animate(...p), i.update = (...p) => f.update(...p), i.sendParticle = (...p) => f.sendParticle(...p), i.sendParticleAlongPath = (...p) => f.sendParticleAlongPath(...p), i.sendParticleBetween = (...p) => f.sendParticleBetween(...p), i.sendParticleBurst = (...p) => f.sendParticleBurst(...p), i.sendConverging = (...p) => f.sendConverging(...p);
        try {
          const p = n();
          p instanceof Promise && await p;
        } finally {
          i.animate = r, i.update = s, i.sendParticle = l, i.sendParticleAlongPath = a, i.sendParticleBetween = c, i.sendParticleBurst = d, i.sendConverging = u;
        }
      };
      return h.record(g, o?.captureMetadata);
    },
    /**
     * Replay a previously recorded `Recording` on this canvas.
     * Returns a `ReplayHandle` with play/pause/stop/scrub controls.
     */
    replay(n, o) {
      const i = this, r = {
        get nodes() {
          return t.nodes;
        },
        get edges() {
          return t.edges;
        },
        get viewport() {
          return t.viewport;
        },
        addNodes: (s) => i.addNodes(s),
        removeNodes: (s) => i.removeNodes(s),
        addEdges: (s) => i.addEdges(s),
        removeEdges: (s) => i.removeEdges(s),
        sendParticle: (s, l) => i.sendParticle(s, l),
        sendParticleAlongPath: (s, l) => i.sendParticleAlongPath(s, l),
        sendParticleBetween: (s, l, a) => i.sendParticleBetween(s, l, a),
        sendParticleBurst: (s, l) => i.sendParticleBurst(s, l),
        sendConverging: (s, l) => i.sendConverging(s, l)
      };
      return new Hh(r, n, o);
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
      Wt(n, o);
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
function ms(t, e, n, o) {
  const i = e.find((l) => l.id === t);
  if (!i) return /* @__PURE__ */ new Set();
  if (i.type === "group")
    return ft(t, e);
  const r = /* @__PURE__ */ new Set(), s = Wo(t, e, n);
  for (const l of s)
    r.add(l.id);
  if (o?.recursive) {
    const l = s.map((a) => a.id);
    for (; l.length > 0; ) {
      const a = l.shift(), c = Wo(a, e, n);
      for (const d of c)
        !r.has(d.id) && d.id !== t && (r.add(d.id), l.push(d.id));
    }
  }
  return r;
}
function zh(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e)
    n.has(i.id) && o.set(i.id, { ...i.position });
  return {
    targetPositions: o,
    originalDimensions: t.type === "group" ? { ...t.dimensions ?? { width: 400, height: 300 } } : void 0,
    reroutedEdges: /* @__PURE__ */ new Map()
  };
}
function So(t, e, n, o) {
  t.collapsed = !0, o && (t.dimensions = { ...o });
  for (const i of e)
    n.targetPositions.has(i.id) && (i.hidden = !0);
}
function ys(t, e, n, o = !0) {
  t.collapsed = !1, o && n.originalDimensions && (t.dimensions = { ...n.originalDimensions });
  const i = /* @__PURE__ */ new Set();
  if (t.type === "group") {
    for (const r of e)
      if (r.collapsed && r.id !== t.id && n.targetPositions.has(r.id)) {
        const s = ft(r.id, e);
        for (const l of s)
          i.add(l);
      }
  }
  for (const r of e)
    if (n.targetPositions.has(r.id)) {
      const s = n.targetPositions.get(r.id);
      r.position = { ...s }, i.has(r.id) || (r.hidden = !1);
    }
}
function ko(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = n.has(i.source), s = n.has(i.target), l = i.source === t, a = i.target === t;
    !r && !s || (o.set(i.id, { source: i.source, target: i.target, hidden: i.hidden }), r && s || l && s || r && a ? i.hidden = !0 : r ? i.source = t : i.target = t);
  }
  return o;
}
function Vh(t, e) {
  for (const n of t) {
    const o = e.get(n.id);
    o && (n.source = o.source, n.target = o.target, o.hidden !== void 0 ? n.hidden = o.hidden : delete n.hidden);
  }
}
const Tn = { width: 150, height: 50 };
function Bh(t) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || o.collapsed) return;
      const i = ms(e, t.nodes, t.edges, { recursive: n?.recursive });
      if (i.size === 0) return;
      B("collapse", `Collapsing node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i],
        animate: n?.animate !== !1,
        recursive: n?.recursive ?? !1
      }), t._captureHistory();
      const r = o.type === "group", s = r ? o.collapsedDimensions ?? { width: 150, height: 60 } : void 0, l = n?.animate !== !1, a = zh(o, t.nodes, i);
      if (l) {
        t._suspendHistory();
        const c = o.dimensions ?? Tn, d = r && s ? s : c, u = {};
        for (const [h] of a.targetPositions) {
          const g = t._nodeMap.get(h);
          if (!g) continue;
          const p = g.dimensions ?? Tn;
          let y, m;
          g.parentId === e ? (y = (d.width - p.width) / 2, m = (d.height - p.height) / 2) : (y = o.position.x + (d.width - p.width) / 2, m = o.position.y + (d.height - p.height) / 2), u[h] = {
            position: { x: y, y: m },
            style: { opacity: "0" }
          };
        }
        r && s && (u[e] = { dimensions: s });
        const f = [];
        for (const h of t.edges)
          if (i.has(h.source) || i.has(h.target)) {
            const g = t.getEdgeElement?.(h.id)?.closest("svg");
            g && f.push(g);
          }
        t.animate ? t.animate({ nodes: u }, {
          duration: 300,
          easing: "easeInOut",
          onProgress: (h) => {
            const g = String(1 - h);
            for (const p of f) p.style.opacity = g;
          },
          onComplete: () => {
            for (const h of f) h.style.opacity = "";
            So(o, t.nodes, a, s), a.reroutedEdges = ko(e, t.edges, i), t._collapseState.set(e, a), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] });
          }
        }) : (So(o, t.nodes, a, s), a.reroutedEdges = ko(e, t.edges, i), t._collapseState.set(e, a), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] }));
      } else
        So(o, t.nodes, a, s), a.reroutedEdges = ko(e, t.edges, i), t._collapseState.set(e, a), t._emit("node-collapse", { node: o, descendants: [...i] });
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
      if (i.reroutedEdges.size > 0 && Vh(t.edges, i.reroutedEdges), s) {
        t._suspendHistory(), r && i.originalDimensions && (o.dimensions = { ...i.originalDimensions });
        const l = o.dimensions ?? Tn;
        ys(o, t.nodes, i, r);
        const a = {};
        for (const [u, f] of i.targetPositions) {
          const h = t._nodeMap.get(u);
          if (h && !h.hidden) {
            const g = h.dimensions ?? Tn;
            let p, y;
            h.parentId === e ? (p = (l.width - g.width) / 2, y = (l.height - g.height) / 2) : (p = o.position.x + (l.width - g.width) / 2, y = o.position.y + (l.height - g.height) / 2), h.position = { x: p, y }, h.style = { ...h.style || {}, opacity: "0" }, a[u] = {
              position: f,
              style: { opacity: "1" }
            };
          }
        }
        const c = new Set(i.targetPositions.keys());
        t._flushNodeStyles(c);
        const d = [];
        for (const u of t.edges)
          if (c.has(u.source) || c.has(u.target)) {
            const f = t.getEdgeElement?.(u.id)?.closest("svg");
            f && (f.style.opacity = "0", d.push(f));
          }
        t.animate ? t.animate({ nodes: a }, {
          duration: 300,
          easing: "easeOut",
          onProgress: (u) => {
            const f = String(u);
            for (const h of d) h.style.opacity = f;
          },
          onComplete: () => {
            for (const u of d) u.style.opacity = "";
            for (const u of c) {
              const f = t._nodeMap.get(u);
              f && typeof f.style == "object" && delete f.style.opacity;
            }
            t._resumeHistory();
          }
        }) : t._resumeHistory(), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
      } else
        ys(o, t.nodes, i, r), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
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
      return ms(e, t.nodes, t.edges).size;
    },
    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(e) {
      return ft(e, t.nodes).size;
    }
  };
}
function qh(t) {
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
function Xh(t) {
  return {
    // ── Row Selection ────────────────────────────────────────────────────
    selectRow(e) {
      if (t.selectedRows.has(e)) return;
      t.selectedRows.add(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      B("selection", `Row "${e}" selected`), t._emit("row-select", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
    },
    deselectRow(e) {
      if (!t.selectedRows.has(e)) return;
      t.selectedRows.delete(e);
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
      t.selectedRows.size !== 0 && (B("selection", "Deselecting all rows"), t.selectedRows.clear(), t._container?.querySelectorAll(".flow-row-selected").forEach((e) => {
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
          const l = s.sourceHandle.slice(e.length + 1).replace(/-[lr]$/, "");
          l && r.add(l);
        }
        if (s.targetHandle?.startsWith(e + ".")) {
          const l = s.targetHandle.slice(e.length + 1).replace(/-[lr]$/, "");
          l && r.add(l);
        }
      }
      return i === "connected" ? n.filter((s) => r.has(s.id)) : n.filter((s) => !r.has(s.id));
    }
  };
}
const Yh = 8, Wh = 12, jh = 2;
function xi(t) {
  return {
    width: t.dimensions?.width ?? _e,
    height: t.dimensions?.height ?? be
  };
}
function Uh(t) {
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
function Zh(t) {
  return [...t].sort((e, n) => {
    const o = e.order ?? 1 / 0, i = n.order ?? 1 / 0;
    return o !== i ? o - i : 0;
  });
}
function ws(t, e, n) {
  const o = e.gap ?? Yh, i = e.padding ?? Wh, r = e.headerHeight ?? 0, s = Uh(e), l = Zh(t), a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  if (l.length === 0)
    return {
      positions: a,
      dimensions: c,
      parentDimensions: n ? { width: n.width, height: n.height } : { width: i * 2, height: i * 2 + r }
    };
  const d = n ? n.width - i * 2 : 0, u = n ? n.height - i * 2 - r : 0;
  return e.direction === "vertical" ? Kh(l, o, i, r, s, d, a, c) : e.direction === "horizontal" ? Gh(l, o, i, r, s, u, a, c) : Jh(l, o, i, r, s, e.columns ?? jh, d, u, a, c);
}
function Kh(t, e, n, o, i, r, s, l) {
  let a = 0;
  const c = t.map((f) => xi(f));
  for (const f of c) a = Math.max(a, f.width);
  const d = r > 0 ? r : a;
  let u = n + o;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], g = c[f];
    s.set(h.id, { x: n, y: u }), (i === "width" || i === "both") && l.set(h.id, { width: d, height: g.height }), u += g.height + e;
  }
  return u -= e, u += n, {
    positions: s,
    dimensions: l,
    parentDimensions: { width: d + n * 2, height: u }
  };
}
function Gh(t, e, n, o, i, r, s, l) {
  let a = 0;
  const c = t.map((f) => xi(f));
  for (const f of c) a = Math.max(a, f.height);
  const d = r > 0 ? r : a;
  let u = n;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], g = c[f];
    s.set(h.id, { x: u, y: n + o }), (i === "height" || i === "both") && l.set(h.id, { width: g.width, height: d }), u += g.width + e;
  }
  return u -= e, u += n, {
    positions: s,
    dimensions: l,
    parentDimensions: { width: u, height: d + n * 2 + o }
  };
}
function Jh(t, e, n, o, i, r, s, l, a, c) {
  const d = Math.min(r, t.length), u = t.map((m) => xi(m));
  let f = 0, h = 0;
  for (const m of u)
    f = Math.max(f, m.width), h = Math.max(h, m.height);
  const g = s > 0 ? (s - (d - 1) * e) / d : 0;
  g > 0 && (f = g);
  const p = Math.ceil(t.length / d), y = l > 0 ? (l - (p - 1) * e) / p : 0;
  y > 0 && (h = y);
  for (let m = 0; m < t.length; m++) {
    const x = m % d, M = Math.floor(m / d), v = n + x * (f + e), C = n + o + M * (h + e);
    a.set(t[m].id, { x: v, y: C }), i === "both" ? c.set(t[m].id, { width: f, height: h }) : i === "width" ? c.set(t[m].id, { width: f, height: u[m].height }) : i === "height" && c.set(t[m].id, { width: u[m].width, height: h });
  }
  return {
    positions: a,
    dimensions: c,
    parentDimensions: {
      width: d * f + (d - 1) * e + n * 2,
      height: p * h + (p - 1) * e + n * 2 + o
    }
  };
}
function Qh(t) {
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
      const { excludeId: s, omitFromComputation: l, includeNode: a, shallow: c } = r;
      let { stretchedSize: d } = r;
      const u = t.nodes.find((v) => v.id === e);
      if (!u?.childLayout) return;
      let f = t.nodes.filter((v) => v.parentId === e);
      l && (f = f.filter((v) => v.id !== l)), a && !f.some((v) => v.id === a.id) && (f = [...f, a]);
      const h = new Map(f.map((v) => [v.id, v]));
      if (u.dimensions = void 0, !d && u.maxDimensions && u.maxDimensions.width !== void 0 && u.maxDimensions.height !== void 0 && (d = { width: u.maxDimensions.width, height: u.maxDimensions.height }), !c)
        for (const v of f)
          v.childLayout && this.layoutChildren(v.id, { excludeId: s, omitFromComputation: l, shallow: !1 });
      const g = u.childLayout, p = g.headerHeight !== void 0 ? g : u.data?.label ? { ...g, headerHeight: 30 } : g, y = ws(f, p, d);
      for (const [v, C] of y.positions) {
        if (v === s || a && v === a.id && !t._nodeMap.has(v)) continue;
        const S = h.get(v);
        S && (S.position ? (S.position.x = C.x, S.position.y = C.y) : S.position = { x: C.x, y: C.y });
      }
      for (const [v, C] of y.dimensions) {
        if (v === s || a && v === a.id && !t._nodeMap.has(v)) continue;
        const S = h.get(v);
        if (S) {
          let k = C.width, I = C.height;
          S.minDimensions && (S.minDimensions.width != null && (k = Math.max(k, S.minDimensions.width)), S.minDimensions.height != null && (I = Math.max(I, S.minDimensions.height))), S.maxDimensions && (S.maxDimensions.width != null && (k = Math.min(k, S.maxDimensions.width)), S.maxDimensions.height != null && (I = Math.min(I, S.maxDimensions.height))), S.dimensions ? (S.dimensions.width = k, S.dimensions.height = I) : S.dimensions = { width: k, height: I }, S.childLayout && !c && this.layoutChildren(v, { excludeId: s, omitFromComputation: l, shallow: !1, stretchedSize: S.dimensions });
        }
      }
      let m = y.parentDimensions.width, x = y.parentDimensions.height;
      if (u.minDimensions && (u.minDimensions.width != null && (m = Math.max(m, u.minDimensions.width)), u.minDimensions.height != null && (x = Math.max(x, u.minDimensions.height))), u.maxDimensions && (u.maxDimensions.width != null && (m = Math.min(m, u.maxDimensions.width)), u.maxDimensions.height != null && (x = Math.min(x, u.maxDimensions.height))), u.dimensions || (u.dimensions = { width: 0, height: 0 }), u.dimensions.width = m, u.dimensions.height = x, m !== y.parentDimensions.width || x !== y.parentDimensions.height) {
        const C = ws(f, p, { width: m, height: x });
        for (const [S, k] of C.positions) {
          if (S === s || a && S === a.id && !t._nodeMap.has(S)) continue;
          const I = h.get(S);
          I && (I.position ? (I.position.x = k.x, I.position.y = k.y) : I.position = { x: k.x, y: k.y });
        }
        for (const [S, k] of C.dimensions) {
          if (S === s || a && S === a.id && !t._nodeMap.has(S)) continue;
          const I = h.get(S);
          if (I) {
            let b = k.width, E = k.height;
            I.minDimensions && (I.minDimensions.width != null && (b = Math.max(b, I.minDimensions.width)), I.minDimensions.height != null && (E = Math.max(E, I.minDimensions.height))), I.maxDimensions && (I.maxDimensions.width != null && (b = Math.min(b, I.maxDimensions.width)), I.maxDimensions.height != null && (E = Math.min(E, I.maxDimensions.height))), I.dimensions ? (I.dimensions.width = b, I.dimensions.height = E) : I.dimensions = { width: b, height: E }, I.childLayout && !c && this.layoutChildren(S, { excludeId: s, omitFromComputation: l, shallow: !1, stretchedSize: I.dimensions });
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
      const s = t.nodes.filter((a) => a.parentId === o.parentId).sort((a, c) => (a.order ?? 1 / 0) - (c.order ?? 1 / 0)).filter((a) => a.id !== e), l = Math.max(0, Math.min(n, s.length));
      s.splice(l, 0, o);
      for (let a = 0; a < s.length; a++)
        s[a].order = a;
      this.layoutChildren(o.parentId), t._emit("child-reorder", { nodeId: e, parentId: o.parentId, order: l });
    },
    // ── Layout engines ─────────────────────────────────────────────────────
    /**
     * Apply Dagre (directed acyclic graph) layout.
     *
     * Requires the dagre addon to be registered via `Alpine.plugin(AlpineFlowDagre)`.
     *
     * Nodes with `parentId` are excluded by default — their positions are managed
     * by `childLayout`, not top-level auto-layout. Pass `{ includeChildren: true }`
     * to include them.
     */
    layout(e) {
      const n = Mt("layout:dagre");
      if (!n)
        throw new Error("layout() requires the dagre plugin. Register it with: Alpine.plugin(AlpineFlowDagre)");
      const o = e?.direction ?? "TB", i = e?.includeChildren ? t.nodes : t.nodes.filter((s) => !s.parentId), r = n(i, t.edges, {
        direction: o,
        nodesep: e?.nodesep,
        ranksep: e?.ranksep
      });
      this._applyLayout(r, {
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
     *
     * Nodes with `parentId` are excluded by default — their positions are managed
     * by `childLayout`, not top-level auto-layout. Pass `{ includeChildren: true }`
     * to include them.
     */
    forceLayout(e) {
      const n = Mt("layout:force");
      if (!n)
        throw new Error("forceLayout() requires the force plugin. Register it with: Alpine.plugin(AlpineFlowForce)");
      const o = e?.includeChildren ? t.nodes : t.nodes.filter((r) => !r.parentId), i = n(o, t.edges, {
        strength: e?.strength,
        distance: e?.distance,
        charge: e?.charge,
        iterations: e?.iterations,
        center: e?.center
      });
      this._applyLayout(i, {
        fitView: e?.fitView,
        duration: e?.duration
      }), B("layout", "Applied force layout", { charge: e?.charge ?? -300, distance: e?.distance ?? 150 }), t._emit("layout", { type: "force", charge: e?.charge ?? -300, distance: e?.distance ?? 150 });
    },
    /**
     * Apply hierarchy/tree layout.
     *
     * Requires the hierarchy addon to be registered via `Alpine.plugin(AlpineFlowHierarchy)`.
     *
     * Nodes with `parentId` are excluded by default — their positions are managed
     * by `childLayout`, not top-level auto-layout. Pass `{ includeChildren: true }`
     * to include them.
     */
    treeLayout(e) {
      const n = Mt("layout:hierarchy");
      if (!n)
        throw new Error("treeLayout() requires the hierarchy plugin. Register it with: Alpine.plugin(AlpineFlowHierarchy)");
      const o = e?.direction ?? "TB", i = e?.includeChildren ? t.nodes : t.nodes.filter((s) => !s.parentId), r = n(i, t.edges, {
        layoutType: e?.layoutType,
        direction: o,
        nodeWidth: e?.nodeWidth,
        nodeHeight: e?.nodeHeight
      });
      this._applyLayout(r, {
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
     *
     * Nodes with `parentId` are excluded by default — their positions are managed
     * by `childLayout`, not top-level auto-layout. Pass `{ includeChildren: true }`
     * to include them.
     */
    async elkLayout(e) {
      const n = Mt("layout:elk");
      if (!n)
        throw new Error("elkLayout() requires the elk plugin. Register it with: Alpine.plugin(AlpineFlowElk)");
      const o = e?.direction ?? "DOWN", i = e?.includeChildren ? t.nodes : t.nodes.filter((s) => !s.parentId), r = await n(i, t.edges, {
        algorithm: e?.algorithm,
        direction: o,
        nodeSpacing: e?.nodeSpacing,
        layerSpacing: e?.layerSpacing
      });
      if (r.size === 0) {
        B("layout", "ELK layout returned no positions — skipping apply");
        return;
      }
      this._applyLayout(r, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration
      }), B("layout", "Applied ELK layout", { algorithm: e?.algorithm ?? "layered", direction: o }), t._emit("layout", { type: "elk", algorithm: e?.algorithm ?? "layered", direction: o });
    }
  };
}
function ep(t) {
  return {
    // ── Internal helpers ──────────────────────────────────────────────────
    _getChildValidation(e) {
      const n = t.getNode(e);
      if (n)
        return an(n, t._config.childValidationRules ?? {});
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
        const r = an(i, t._config.childValidationRules ?? {});
        if (!r) {
          t._validationErrorCache.delete(o);
          continue;
        }
        const s = t.nodes.filter((a) => a.parentId === o), l = ds(i, s, r);
        l.length > 0 ? t._validationErrorCache.set(o, l) : t._validationErrorCache.delete(o), i._validationErrors = l;
      }
    },
    // ── Child Validation API ─────────────────────────────────────────────
    validateParent(e) {
      const n = t.getNode(e);
      if (!n) return { valid: !0, errors: [] };
      const o = an(n, t._config.childValidationRules ?? {});
      if (!o) return { valid: !0, errors: [] };
      const i = t.nodes.filter((s) => s.parentId === e), r = ds(n, i, o);
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
          const u = this._getChildValidation(i);
          if (u) {
            const f = t.getNode(i);
            if (f) {
              const h = t.nodes.filter(
                (p) => p.parentId === i
              ), g = no(f, o, h, u);
              if (!g.valid)
                return t._config.onChildValidationFail && t._config.onChildValidationFail({
                  parent: f,
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
        if (o.position.x = d.x, o.position.y = d.y, o.parentId = void 0, o.extent = void 0, t.nodes = Et(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), i) {
          let u, f = i;
          for (; f; ) {
            const h = t._nodeMap.get(f);
            if (!h) break;
            h.childLayout && (u = f), f = h.parentId;
          }
          u && t.layoutChildren?.(u);
        }
        return t._emit("node-reparent", { node: o, oldParentId: i, newParentId: null }), !0;
      }
      const r = t.getNode(n);
      if (!r || ft(e, t.nodes).has(n)) return !1;
      const s = this._getChildValidation(n);
      if (s) {
        const d = t.nodes.filter(
          (f) => f.parentId === n && f.id !== e
        ), u = qr(r, o, d, s);
        if (!u.valid)
          return t._config.onChildValidationFail && t._config.onChildValidationFail({
            parent: r,
            child: o,
            operation: "add",
            rule: u.rule,
            message: u.message
          }), !1;
      }
      if (i) {
        const d = this._getChildValidation(i);
        if (d) {
          const u = t.getNode(i);
          if (u) {
            const f = t.nodes.filter(
              (g) => g.parentId === i
            ), h = no(u, o, f, d);
            if (!h.valid)
              return t._config.onChildValidationFail && t._config.onChildValidationFail({
                parent: u,
                child: o,
                operation: "remove",
                rule: h.rule,
                message: h.message
              }), !1;
          }
        }
      }
      t._captureHistory();
      const l = i ? t.getAbsolutePosition(e) : { x: o.position.x, y: o.position.y }, a = t.getAbsolutePosition(n);
      if (o.position.x = l.x - a.x, o.position.y = l.y - a.y, o.parentId = n, t.nodes = Et(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), n && t._nodeMap.get(n)?.childLayout) {
        if (!o.childLayout) {
          const u = t._initialDimensions.get(e);
          o.dimensions = u ? { ...u } : void 0;
        }
        if (o.order == null) {
          const u = t.nodes.filter(
            (f) => f.parentId === n && f.id !== o.id
          );
          o.order = u.length > 0 ? Math.max(...u.map((f) => f.order ?? 0)) + 1 : 0;
        }
      }
      const c = /* @__PURE__ */ new Set();
      for (const d of [n, i]) {
        if (!d) continue;
        let u, f = d;
        for (; f; ) {
          const h = t._nodeMap.get(f);
          if (!h) break;
          h.childLayout && (u = f), f = h.parentId;
        }
        u && c.add(u);
      }
      for (const d of c)
        t.layoutChildren?.(d);
      return t._emit("node-reparent", { node: o, oldParentId: i, newParentId: n }), !0;
    }
  };
}
function tp(t) {
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
              const l = r.offsetWidth, a = r.offsetHeight;
              (!s.dimensions || l !== s.dimensions.width || a !== s.dimensions.height) && (s.dimensions = { width: l, height: a }, o.add(i)), s.fixedDimensions = !0, r.style.width = l + "px", r.style.height = a + "px";
            }
          }
          o.size > 0 && t._refreshEdgePaths(o);
        });
      }), n;
    }
  };
}
function Hn(t, e, n, o, i) {
  const r = i * Math.PI / 180, s = Math.cos(r), l = Math.sin(r), a = t - n, c = e - o;
  return {
    x: n + a * s - c * l,
    y: o + a * l + c * s
  };
}
const ei = 20, An = ei + 1;
function vs(t) {
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
function _s(t, e) {
  return {
    x: t.x - e,
    y: t.y - e,
    width: t.width + e * 2,
    height: t.height + e * 2
  };
}
function np(t, e, n) {
  return t > n.x && t < n.x + n.width && e > n.y && e < n.y + n.height;
}
function Kr(t, e, n, o) {
  const i = Math.min(t, e), r = Math.max(t, e);
  for (const s of o) {
    const l = s.x, a = s.x + s.width, c = s.y, d = s.y + s.height;
    if (n > c && n < d && r > l && i < a)
      return !0;
  }
  return !1;
}
function Gr(t, e, n, o) {
  const i = Math.min(e, n), r = Math.max(e, n);
  for (const s of o) {
    const l = s.x, a = s.x + s.width, c = s.y, d = s.y + s.height;
    if (t > l && t < a && r > c && i < d)
      return !0;
  }
  return !1;
}
function op(t, e, n, o, i) {
  const r = /* @__PURE__ */ new Set([t, n]), s = /* @__PURE__ */ new Set([e, o]);
  for (const u of i)
    r.add(u.x), r.add(u.x + u.width), s.add(u.y), s.add(u.y + u.height);
  const l = Array.from(r).sort((u, f) => u - f), a = Array.from(s).sort((u, f) => u - f), c = [];
  let d = 0;
  for (const u of l)
    for (const f of a) {
      let h = !1;
      for (const g of i)
        if (np(u, f, g)) {
          h = !0;
          break;
        }
      h || c.push({ x: u, y: f, index: d++ });
    }
  return c;
}
class ip {
  constructor(e) {
    this.dist = e, this.items = [];
  }
  get size() {
    return this.items.length;
  }
  push(e) {
    this.items.push(e);
    let n = this.items.length - 1;
    for (; n > 0; ) {
      const o = n - 1 >> 1;
      if (this.dist[this.items[o]] <= this.dist[this.items[n]]) break;
      [this.items[o], this.items[n]] = [this.items[n], this.items[o]], n = o;
    }
  }
  pop() {
    const e = this.items.length;
    if (e === 0) return;
    const n = this.items[0], o = this.items.pop();
    if (e > 1) {
      this.items[0] = o;
      let i = 0;
      for (; ; ) {
        const r = 2 * i + 1, s = r + 1;
        let l = i;
        if (r < this.items.length && this.dist[this.items[r]] < this.dist[this.items[l]] && (l = r), s < this.items.length && this.dist[this.items[s]] < this.dist[this.items[l]] && (l = s), l === i) break;
        [this.items[i], this.items[l]] = [this.items[l], this.items[i]], i = l;
      }
    }
    return n;
  }
}
function sp(t, e) {
  const n = t.map(() => []), o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const r of t) {
    let s = o.get(r.x);
    s || (s = [], o.set(r.x, s)), s.push(r);
    let l = i.get(r.y);
    l || (l = [], i.set(r.y, l)), l.push(r);
  }
  for (const r of o.values()) {
    r.sort((s, l) => s.y - l.y);
    for (let s = 1; s < r.length; s++) {
      const l = r[s - 1], a = r[s];
      Gr(l.x, l.y, a.y, e) || (n[l.index].push(a.index), n[a.index].push(l.index));
    }
  }
  for (const r of i.values()) {
    r.sort((s, l) => s.x - l.x);
    for (let s = 1; s < r.length; s++) {
      const l = r[s - 1], a = r[s];
      Kr(l.x, a.x, l.y, e) || (n[l.index].push(a.index), n[a.index].push(l.index));
    }
  }
  return n;
}
function rp(t, e, n, o) {
  const i = n.length, r = new Float64Array(i).fill(1 / 0), s = new Int32Array(i).fill(-1), l = new Uint8Array(i), a = sp(n, o);
  r[t.index] = 0;
  const c = new ip(r);
  for (c.push(t.index); c.size > 0; ) {
    const f = c.pop();
    if (l[f]) continue;
    if (l[f] = 1, f === e.index) break;
    const h = n[f], g = r[f];
    for (const p of a[f]) {
      if (l[p]) continue;
      const y = n[p], m = Math.abs(y.x - h.x) + Math.abs(y.y - h.y), x = g + m;
      x < r[p] && (r[p] = x, s[p] = f, c.push(p));
    }
  }
  if (r[e.index] === 1 / 0) return null;
  const d = [];
  let u = e.index;
  for (; u !== -1; )
    d.unshift(n[u]), u = s[u];
  return d;
}
function ap(t) {
  if (t.length <= 2) return t;
  const e = [t[0]];
  for (let n = 1; n < t.length - 1; n++) {
    const o = e[e.length - 1], i = t[n + 1], r = t[n], s = o.x === r.x && r.x === i.x, l = o.y === r.y && r.y === i.y;
    !s && !l && e.push(r);
  }
  return e.push(t[t.length - 1]), e;
}
function lp(t, e) {
  if (t.length < 2) return "";
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], l = t[i + 1];
    e > 0 ? n += ` ${Bt(r.x, r.y, s.x, s.y, l.x, l.y, e)}` : n += ` L${s.x},${s.y}`;
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function cp(t) {
  if (t.length < 2)
    return { x: t[0]?.x ?? 0, y: t[0]?.y ?? 0, offsetX: 0, offsetY: 0 };
  let e = 0;
  const n = [];
  for (let r = 1; r < t.length; r++) {
    const s = t[r].x - t[r - 1].x, l = t[r].y - t[r - 1].y, a = Math.abs(s) + Math.abs(l);
    n.push(a), e += a;
  }
  let o = e / 2;
  for (let r = 0; r < n.length; r++) {
    if (o <= n[r]) {
      const s = n[r] > 0 ? o / n[r] : 0, l = t[r].x + (t[r + 1].x - t[r].x) * s, a = t[r].y + (t[r + 1].y - t[r].y) * s;
      return {
        x: l,
        y: a,
        offsetX: Math.abs(t[t.length - 1].x - t[0].x) / 2,
        offsetY: Math.abs(t[t.length - 1].y - t[0].y) / 2
      };
    }
    o -= n[r];
  }
  const i = t[t.length - 1];
  return { x: i.x, y: i.y, offsetX: 0, offsetY: 0 };
}
const Nn = 200;
function dp(t, e, n, o, i) {
  const r = Math.min(t, n) - Nn, s = Math.max(t, n) + Nn, l = Math.min(e, o) - Nn, a = Math.max(e, o) + Nn;
  return i.filter(
    (c) => c.x < s && c.x + c.width > r && c.y < a && c.y + c.height > l
  );
}
function up(t, e) {
  for (let n = 1; n < t.length; n++) {
    const o = t[n - 1], i = t[n];
    if (o.x === i.x) {
      if (Gr(o.x, o.y, i.y, e)) return !0;
    } else if (o.y === i.y && Kr(o.x, i.x, o.y, e))
      return !0;
  }
  return !1;
}
function fp(t, e, n, o, i, r, s) {
  const l = vs(n), a = vs(r), c = t + l.x * An, d = e + l.y * An, u = o + a.x * An, f = i + a.y * An, h = (x) => {
    const M = x.map((b) => _s(b, ei)), v = op(c, d, u, f, M);
    v.length;
    const C = v.find((b) => b.x === c && b.y === d), S = v.find((b) => b.x === u && b.y === f);
    C || v.push({ x: c, y: d, index: v.length }), S || v.push({ x: u, y: f, index: v.length });
    const k = C ?? v[v.length - (S ? 1 : 2)], I = S ?? v[v.length - 1];
    return rp(k, I, v, M);
  }, g = dp(t, e, o, i, s), p = g.length < s.length;
  let y = h(g);
  if (p) {
    const x = s.map((v) => _s(v, ei));
    (!(y !== null && y.length >= 2) || up(y, x)) && (y = h(s));
  }
  if (!y || y.length < 2) return null;
  const m = [
    { x: t, y: e, index: -1 },
    ...y,
    { x: o, y: i, index: -2 }
  ];
  return ap(m);
}
const hp = 512, it = /* @__PURE__ */ new Map();
function pp(t, e, n, o, i, r, s) {
  let l = `${Math.round(t)},${Math.round(e)},${n}|${Math.round(o)},${Math.round(i)},${r}`;
  for (const a of s)
    l += `|${Math.round(a.x)},${Math.round(a.y)},${Math.round(a.width)},${Math.round(a.height)}`;
  return l;
}
function Jr(t, e, n, o, i, r, s) {
  const l = pp(t, e, n, o, i, r, s);
  if (it.has(l)) {
    const c = it.get(l);
    return it.delete(l), it.set(l, c), c;
  }
  const a = fp(t, e, n, o, i, r, s);
  return it.set(l, a), it.size > hp && it.delete(it.keys().next().value), a;
}
function gp({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s,
  borderRadius: l = 5
}) {
  if (!s || s.length === 0)
    return gn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: l
    });
  const a = Jr(t, e, n, o, i, r, s);
  if (!a)
    return gn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: l
    });
  const c = lp(a, l), { x: d, y: u, offsetX: f, offsetY: h } = cp(a);
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function Qr(t) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return `M${t[0].x},${t[0].y} L${t[1].x},${t[1].y}`;
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 0; n < t.length - 1; n++) {
    const o = t[Math.max(0, n - 1)], i = t[n], r = t[n + 1], s = t[Math.min(t.length - 1, n + 2)], l = i.x + (r.x - o.x) / 6, a = i.y + (r.y - o.y) / 6, c = r.x - (s.x - i.x) / 6, d = r.y - (s.y - i.y) / 6;
    e += ` C${l},${a} ${c},${d} ${r.x},${r.y}`;
  }
  return e;
}
function mp(t) {
  if (t.length < 2)
    return { x: t[0]?.x ?? 0, y: t[0]?.y ?? 0, offsetX: 0, offsetY: 0 };
  let e = 0;
  const n = [];
  for (let r = 1; r < t.length; r++) {
    const s = t[r].x - t[r - 1].x, l = t[r].y - t[r - 1].y, a = Math.sqrt(s * s + l * l);
    n.push(a), e += a;
  }
  let o = e / 2;
  for (let r = 0; r < n.length; r++) {
    if (o <= n[r]) {
      const s = n[r] > 0 ? o / n[r] : 0, l = t[r].x + (t[r + 1].x - t[r].x) * s, a = t[r].y + (t[r + 1].y - t[r].y) * s;
      return {
        x: l,
        y: a,
        offsetX: Math.abs(t[t.length - 1].x - t[0].x) / 2,
        offsetY: Math.abs(t[t.length - 1].y - t[0].y) / 2
      };
    }
    o -= n[r];
  }
  const i = t[t.length - 1];
  return { x: i.x, y: i.y, offsetX: 0, offsetY: 0 };
}
function yp({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s
}) {
  if (!s || s.length === 0)
    return Gn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const l = Jr(t, e, n, o, i, r, s);
  if (!l)
    return Gn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const a = Qr(l), { x: c, y: d, offsetX: u, offsetY: f } = mp(l);
  return {
    path: a,
    labelPosition: { x: c, y: d },
    labelOffsetX: u,
    labelOffsetY: f
  };
}
function wp(t) {
  const {
    sourceX: e,
    sourceY: n,
    targetX: o,
    targetY: i,
    controlPoints: r = [],
    pathStyle: s = "bezier",
    borderRadius: l = 5
  } = t, a = [
    { x: e, y: n },
    ...r,
    { x: o, y: i }
  ];
  let c;
  switch (s) {
    case "linear":
      c = bs(a);
      break;
    case "step":
      c = vp(a, 0);
      break;
    case "smoothstep":
      c = _p(a, l);
      break;
    case "catmull-rom":
    case "bezier":
      c = Qr(a.map((f, h) => ({ ...f, index: h })));
      break;
    default:
      c = bs(a);
  }
  const d = bp(a), u = vn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: d,
    labelOffsetX: u.offsetX,
    labelOffsetY: u.offsetY
  };
}
function bs(t) {
  if (t.length < 2) return "";
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 1; n < t.length; n++)
    e += ` L${t[n].x},${t[n].y}`;
  return e;
}
function vp(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ea(t[0], t[1], e);
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], l = t[i + 1];
    n += Bt(r.x, r.y, s.x, s.y, l.x, l.y, e);
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function ea(t, e, n) {
  const o = (t.x + e.x) / 2, i = Bt(t.x, t.y, o, t.y, o, e.y, n), r = Bt(o, t.y, o, e.y, e.x, e.y, n);
  return `M${t.x},${t.y}${i}${r} L${e.x},${e.y}`;
}
function _p(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ea(t[0], t[1], e);
  const n = [t[0]];
  for (let r = 0; r < t.length - 1; r++) {
    const s = t[r], l = t[r + 1], a = Math.abs(l.x - s.x), c = Math.abs(l.y - s.y);
    if (a < 1 || c < 1)
      n.push(l);
    else {
      const d = (s.x + l.x) / 2;
      n.push({ x: d, y: s.y }), n.push({ x: d, y: l.y }), n.push(l);
    }
  }
  let o = `M${n[0].x},${n[0].y}`;
  for (let r = 1; r < n.length - 1; r++) {
    const s = n[r - 1], l = n[r], a = n[r + 1];
    o += Bt(s.x, s.y, l.x, l.y, a.x, a.y, e);
  }
  const i = n[n.length - 1];
  return o += ` L${i.x},${i.y}`, o;
}
function bp(t) {
  if (t.length < 2) return t[0] ?? { x: 0, y: 0 };
  let e = 0;
  const n = [];
  for (let i = 0; i < t.length - 1; i++) {
    const r = t[i + 1].x - t[i].x, s = t[i + 1].y - t[i].y, l = Math.sqrt(r * r + s * s);
    n.push(l), e += l;
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
function Xt(t, e, n, o) {
  const i = t.dimensions?.width ?? _e, r = t.dimensions?.height ?? be, s = Yt(t, o);
  let l;
  if (t.shape) {
    const a = n?.[t.shape] ?? zr[t.shape];
    if (a) {
      const c = a.perimeterPoint(i, r, e);
      l = { x: s.x + c.x, y: s.y + c.y };
    } else {
      const c = ls(i, r, e);
      l = { x: s.x + c.x, y: s.y + c.y };
    }
  } else {
    const a = ls(i, r, e);
    l = { x: s.x + a.x, y: s.y + a.y };
  }
  if (t.rotation) {
    const a = s.x + i / 2, c = s.y + r / 2;
    l = Hn(l.x, l.y, a, c, t.rotation);
  }
  return l;
}
function xs(t) {
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
function ti(t) {
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
const xp = 1.5, Ep = 5 / 20;
function Tt(t, e, n, o) {
  if (!o) return t;
  const i = typeof o == "string" ? {} : o, r = n ? Math.min(n.handleWidth, n.handleHeight) / 2 : 5;
  if (i.offset !== void 0) {
    const u = ti(e);
    return { x: t.x + u.x * i.offset, y: t.y + u.y * i.offset };
  }
  const a = (i.width ?? 12.5) * xp * Ep * 0.4, c = r + a, d = ti(e);
  return { x: t.x + d.x * c, y: t.y + d.y * c };
}
function io(t, e, n, o = "bottom", i = "top", r, s, l, a, c, d, u) {
  const f = r ?? Xt(e, o, c, d), h = s ?? Xt(n, i, c, d), g = {
    sourceX: f.x,
    sourceY: f.y,
    sourcePosition: xs(o),
    targetX: h.x,
    targetY: h.y,
    targetPosition: xs(i)
  }, p = t.type ?? u ?? "bezier";
  if (l?.[p])
    return l[p](g);
  switch (p === "floating" ? t.pathType ?? "bezier" : p) {
    case "editable":
      return wp({
        ...g,
        controlPoints: t.controlPoints,
        pathStyle: t.pathStyle
      });
    case "avoidant":
      return yp({ ...g, obstacles: a });
    case "orthogonal":
      return gp({ ...g, obstacles: a });
    case "smoothstep":
      return gn(g);
    case "straight":
      return $r({ sourceX: f.x, sourceY: f.y, targetX: h.x, targetY: h.y });
    default:
      return Gn(g);
  }
}
function Es(t, e) {
  const n = t.dimensions?.width ?? _e, o = t.dimensions?.height ?? be, i = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, r = t.rotation ? Hn(e.x, e.y, i.x, i.y, -t.rotation) : e, s = r.x - i.x, l = r.y - i.y;
  if (s === 0 && l === 0) {
    const g = { x: i.x, y: i.y - o / 2 };
    return t.rotation ? Hn(g.x, g.y, i.x, i.y, t.rotation) : g;
  }
  const a = n / 2, c = o / 2, d = Math.abs(s), u = Math.abs(l);
  let f;
  d / a > u / c ? f = a / d : f = c / u;
  const h = {
    x: i.x + s * f,
    y: i.y + l * f
  };
  return t.rotation ? Hn(h.x, h.y, i.x, i.y, t.rotation) : h;
}
function Cs(t, e) {
  const n = t.dimensions?.width ?? _e, o = t.dimensions?.height ?? be, i = t.position.x + n / 2, r = t.position.y + o / 2;
  if (t.rotation) {
    const h = e.x - i, g = e.y - r;
    return Math.abs(h) > Math.abs(g) ? h > 0 ? "right" : "left" : g > 0 ? "bottom" : "top";
  }
  const s = 1, l = t.position.x, a = t.position.x + n, c = t.position.y, d = t.position.y + o;
  if (Math.abs(e.x - l) <= s) return "left";
  if (Math.abs(e.x - a) <= s) return "right";
  if (Math.abs(e.y - c) <= s) return "top";
  if (Math.abs(e.y - d) <= s) return "bottom";
  const u = e.x - i, f = e.y - r;
  return Math.abs(u) > Math.abs(f) ? u > 0 ? "right" : "left" : f > 0 ? "bottom" : "top";
}
function ta(t, e) {
  const n = t.dimensions?.width ?? _e, o = t.dimensions?.height ?? be, i = e.dimensions?.width ?? _e, r = e.dimensions?.height ?? be, s = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, l = {
    x: e.position.x + i / 2,
    y: e.position.y + r / 2
  }, a = Es(t, l), c = Es(e, s), d = Cs(t, a), u = Cs(e, c);
  return {
    sx: a.x,
    sy: a.y,
    tx: c.x,
    ty: c.y,
    sourcePos: d,
    targetPos: u
  };
}
function uy(t, e) {
  const n = e.x - t.x, o = e.y - t.y;
  let i, r;
  return Math.abs(n) > Math.abs(o) ? (i = n > 0 ? "right" : "left", r = n > 0 ? "left" : "right") : (i = o > 0 ? "bottom" : "top", r = o > 0 ? "top" : "bottom"), { sourcePos: i, targetPos: r };
}
function na(t) {
  return typeof t == "object" && t !== null && "from" in t && "to" in t;
}
function oa(t, e) {
  return `${t}__grad__${e}`;
}
function ia(t, e, n, o, i, r, s) {
  let l = t.querySelector(`#${CSS.escape(e)}`);
  if (!l) {
    l = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"), l.id = e, l.setAttribute("gradientUnits", "userSpaceOnUse"), l.classList.add("flow-edge-gradient");
    const c = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    c.setAttribute("offset", "0%"), l.appendChild(c);
    const d = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    d.setAttribute("offset", "100%"), l.appendChild(d), t.appendChild(l);
  }
  l.setAttribute("x1", String(o)), l.setAttribute("y1", String(i)), l.setAttribute("x2", String(r)), l.setAttribute("y2", String(s));
  const a = l.querySelectorAll("stop");
  return a[0]?.setAttribute("stop-color", n.from), a[1]?.setAttribute("stop-color", n.to), l;
}
function Lo(t, e) {
  t.querySelector(`#${CSS.escape(e)}`)?.remove();
}
const Cp = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
async function Sp(t) {
  const { dropNodeId: e, dropHandleId: n, draggedEnd: o, edge: i, canvas: r, containerEl: s } = t;
  if (!e)
    return { applied: !1 };
  const l = r.getNode(e);
  if (l && !Ve(l))
    return { applied: !1 };
  const a = o === "target" ? { source: i.source, sourceHandle: i.sourceHandle, target: e, targetHandle: n } : { source: e, sourceHandle: n, target: i.target, targetHandle: i.targetHandle }, c = { ...i }, d = await Dr({
    edge: i,
    newConnection: a,
    canvas: r,
    containerEl: s,
    endpoint: o
  });
  return d.applied ? (r._emit?.("reconnect", { oldEdge: c, newConnection: a }), { applied: !0, newConnection: a }) : { applied: !1, reason: d.reason, newConnection: a };
}
function kp(t) {
  return t === !0 || t === "dash" ? "dash" : t === "pulse" ? "pulse" : t === "dot" ? "dot" : "none";
}
function sa(t) {
  return t.endsWith("-l") ? "left" : t.endsWith("-r") ? "right" : null;
}
function Ss(t, e) {
  if (!e) return t;
  const n = ti(t), o = e * Math.PI / 180, i = Math.cos(o), r = Math.sin(o), s = n.x * i - n.y * r, l = n.x * r + n.y * i;
  return Math.abs(s) > Math.abs(l) ? s > 0 ? "right" : "left" : l > 0 ? "bottom" : "top";
}
function ks(t) {
  return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
}
function so(t, e) {
  const n = Array.from(t);
  if (n.length === 0) return null;
  if (n.length === 1 || !e) return n[0];
  let o = null, i = 1 / 0;
  for (const r of n) {
    const s = r.getBoundingClientRect(), l = (s.left + s.right) / 2, a = (s.top + s.bottom) / 2, c = l - e.x, d = a - e.y, u = c * c + d * d;
    u < i && (i = u, o = r);
  }
  return o;
}
function ro(t, e, n, o, i, r, s) {
  const l = s ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (l) {
    if (n) {
      const c = l.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(n)}"][data-flow-handle-type="${o}"]`
      );
      let d = so(c, r);
      if (!d) {
        const u = l.querySelectorAll(
          `[data-flow-handle-id="${CSS.escape(n)}"]`
        );
        d = so(u, r);
      }
      if (d)
        return d.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
    }
    if (n) {
      const c = sa(n);
      if (c && l.querySelector(`[data-flow-handle-position="${c}"]`))
        return c;
    }
    const a = l.querySelector(`[data-flow-handle-type="${o}"]`);
    if (a)
      return a.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
  }
  if (i) {
    const a = o === "source" ? i.sourcePosition : i.targetPosition;
    if (a) return a;
  }
  return o === "source" ? "bottom" : "top";
}
function Ls(t, e, n, o, i, r, s, l, a) {
  const c = a ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (!c) return null;
  let d = null;
  if (o) {
    const p = c.querySelectorAll(
      `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="${i}"]`
    );
    if (d = so(p, l), !d) {
      const y = c.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(o)}"]`
      );
      d = so(y, l);
    }
    if (!d) {
      const y = sa(o);
      y && (d = c.querySelector(`[data-flow-handle-position="${y}"]`));
    }
  } else
    d = c.querySelector(`[data-flow-handle-type="${i}"]`);
  if (!d) return null;
  const u = d.getBoundingClientRect();
  if (u.width === 0 && u.height === 0) return null;
  const f = t.getBoundingClientRect(), h = u.left + u.width / 2, g = u.top + u.height / 2;
  return {
    x: (h - f.left - s.x) / r,
    y: (g - f.top - s.y) / r,
    handleWidth: u.width / r,
    handleHeight: u.height / r
  };
}
function Lp(t, e, n) {
  const o = n ?? t.getTotalLength(), i = t.getPointAtLength(o * Math.max(0, Math.min(1, e)));
  return { x: i.x, y: i.y };
}
function st(t, e, n, o, i) {
  const r = t - n, s = e - o;
  return Math.sqrt(r * r + s * s) <= i;
}
function Pp(t, e, n) {
  const o = n.x - e.x, i = n.y - e.y, r = o * o + i * i;
  if (r === 0) return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
  let s = ((t.x - e.x) * o + (t.y - e.y) * i) / r;
  s = Math.max(0, Math.min(1, s));
  const l = e.x + s * o, a = e.y + s * i;
  return Math.sqrt((t.x - l) ** 2 + (t.y - a) ** 2);
}
function Mp(t) {
  t.directive(
    "flow-edge",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      const s = e;
      s.style.pointerEvents = "auto";
      const l = document.createElementNS("http://www.w3.org/2000/svg", "path");
      l.setAttribute("fill", "none"), l.style.stroke = "transparent", l.style.strokeWidth = "20", l.style.pointerEvents = "stroke", l.style.cursor = "pointer", s.appendChild(l);
      let a = e.querySelector("path:not(:first-child)");
      a || (a = document.createElementNS("http://www.w3.org/2000/svg", "path"), a.setAttribute("fill", "none"), a.setAttribute("stroke-width", "1.5"), a.style.pointerEvents = "none", s.appendChild(a));
      let c = null, d = null, u = null, f = null, h = 0, g = null, p = "none", y = null, m = null;
      function x(T, N, O, re, le) {
        g || (g = document.createElementNS("http://www.w3.org/2000/svg", "circle"), g.classList.add("flow-edge-dot"), g.style.pointerEvents = "none", T.appendChild(g));
        const se = O.closest(".flow-container"), j = se ? getComputedStyle(se) : null, V = re.particleSize ?? (parseFloat(j?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), q = le || j?.getPropertyValue("--flow-edge-dot-duration").trim() || "2s";
        g.setAttribute("r", String(V)), re.particleColor ? g.style.fill = re.particleColor : g.style.removeProperty("fill");
        const U = g.querySelector("animateMotion");
        U && U.remove();
        const z = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        z.setAttribute("dur", q), z.setAttribute("repeatCount", "indefinite"), z.setAttribute("path", N), g.appendChild(z);
      }
      function M() {
        g?.remove(), g = null;
      }
      let v = null, C = null, S = null, k = null;
      const I = (T) => {
        T.stopPropagation();
        const N = o(n);
        if (!N) return;
        const O = t.$data(e.closest("[x-data]"));
        O && (O._emit("edge-click", { edge: N, event: T }), ut(T, O._shortcuts?.multiSelect) ? O.selectedEdges.has(N.id) ? (O.selectedEdges.delete(N.id), N.selected = !1, B("selection", `Edge "${N.id}" deselected (shift)`)) : (O.selectedEdges.add(N.id), N.selected = !0, B("selection", `Edge "${N.id}" selected (shift)`)) : (O.deselectAll(), O.selectedEdges.add(N.id), N.selected = !0, B("selection", `Edge "${N.id}" selected`)), O._emitSelectionChange());
      }, b = (T) => {
        T.preventDefault(), T.stopPropagation();
        const N = o(n);
        if (!N) return;
        const O = t.$data(e.closest("[x-data]"));
        if (!O) return;
        const re = T.target;
        if (re.classList.contains("flow-edge-control-point")) {
          const le = parseInt(re.dataset.pointIndex ?? "", 10);
          if (!isNaN(le)) {
            O._emit("edge-control-point-context-menu", {
              edge: N,
              pointIndex: le,
              position: { x: T.clientX, y: T.clientY },
              event: T
            });
            return;
          }
        }
        O._emit("edge-context-menu", { edge: N, event: T });
      }, E = (T) => {
        T.stopPropagation(), T.preventDefault();
        const N = o(n), O = t.$data(e.closest("[x-data]"));
        if (!N || !O || (N.type ?? O._config?.defaultEdgeType ?? "bezier") !== "editable") return;
        const le = T.target;
        if (le.classList.contains("flow-edge-control-point")) {
          const se = parseInt(le.dataset.pointIndex ?? "", 10);
          !isNaN(se) && N.controlPoints && (O._captureHistory?.(), N.controlPoints.splice(se, 1), O._emit("edge-control-point-change", { edge: N, action: "remove", index: se }));
          return;
        }
        if (le.classList.contains("flow-edge-midpoint")) {
          const se = parseInt(le.dataset.segmentIndex ?? "", 10);
          if (!isNaN(se)) {
            const j = O.screenToFlowPosition(T.clientX, T.clientY);
            N.controlPoints || (N.controlPoints = []), O._captureHistory?.(), N.controlPoints.splice(se, 0, { x: j.x, y: j.y }), O._emit("edge-control-point-change", { edge: N, action: "add", index: se });
          }
          return;
        }
        if (le.closest("path")) {
          const se = O.screenToFlowPosition(T.clientX, T.clientY);
          N.controlPoints || (N.controlPoints = []);
          const j = [
            v ?? { x: 0, y: 0 },
            ...N.controlPoints,
            C ?? { x: 0, y: 0 }
          ];
          let V = 0, q = 1 / 0;
          for (let U = 0; U < j.length - 1; U++) {
            const z = Pp(se, j[U], j[U + 1]);
            z < q && (q = z, V = U);
          }
          O._captureHistory?.(), N.controlPoints.splice(V, 0, { x: se.x, y: se.y }), O._emit("edge-control-point-change", { edge: N, action: "add", index: V });
        }
      }, A = (T) => {
        const N = T.target;
        if (!N.classList.contains("flow-edge-control-point") || T.button !== 0) return;
        T.stopPropagation(), T.preventDefault();
        const O = o(n);
        if (!O?.controlPoints) return;
        const re = t.$data(e.closest("[x-data]"));
        if (!re) return;
        const le = parseInt(N.dataset.pointIndex ?? "", 10);
        if (isNaN(le)) return;
        N.classList.add("dragging");
        let se = !1;
        const j = (q) => {
          se || (re._captureHistory?.(), se = !0);
          let U = re.screenToFlowPosition(q.clientX, q.clientY);
          const z = re._config?.snapToGrid;
          z && (U = {
            x: Math.round(U.x / z[0]) * z[0],
            y: Math.round(U.y / z[1]) * z[1]
          }), O.controlPoints[le] = U;
        }, V = () => {
          document.removeEventListener("pointermove", j), document.removeEventListener("pointerup", V), N.classList.remove("dragging"), se && re._emit("edge-control-point-change", { edge: O, action: "move", index: le });
        };
        document.addEventListener("pointermove", j), document.addEventListener("pointerup", V);
      };
      s.addEventListener("contextmenu", b), s.addEventListener("dblclick", E), s.addEventListener("pointerdown", A, !0);
      let L = null;
      const w = (T) => {
        if (T.button !== 0) return;
        T.stopPropagation();
        const N = o(n);
        if (!N) return;
        const O = t.$data(e.closest("[x-data]"));
        if (!O) return;
        const re = O._config?.reconnectSnapRadius ?? Wi, le = O._config?.edgesReconnectable !== !1, se = N.reconnectable ?? !0;
        let j = null;
        if (le && se !== !1 && v && C) {
          const ie = O.screenToFlowPosition(T.clientX, T.clientY), fe = st(ie.x, ie.y, v.x, v.y, re) || S && st(ie.x, ie.y, S.x, S.y, re);
          (st(ie.x, ie.y, C.x, C.y, re) || k && st(ie.x, ie.y, k.x, k.y, re)) && (se === !0 || se === "target") ? j = "target" : fe && (se === !0 || se === "source") && (j = "source");
        }
        if (!j) {
          const ie = (fe) => {
            document.removeEventListener("pointerup", ie), I(fe);
          };
          document.addEventListener("pointerup", ie, { once: !0 });
          return;
        }
        const V = T.clientX, q = T.clientY;
        let U = !1, z = !1, $ = null;
        const te = O._config?.connectionSnapRadius ?? 20;
        let K = null, H = null, Y = null, oe = V, ne = q;
        const X = e.closest(".flow-container");
        if (!X) return;
        const W = j === "target" ? v : C, F = () => {
          U = !0, s.classList.add("flow-edge-reconnecting"), O._emit("reconnect-start", { edge: N, handleType: j }), B("reconnect", `Reconnection drag started on edge "${N.id}" (${j} end)`), H = Rt({
            connectionLineType: O._config?.connectionLineType,
            connectionLineStyle: O._config?.connectionLineStyle,
            connectionLine: O._config?.connectionLine,
            containerEl: s.closest(".flow-container") ?? void 0
          }), K = H.svg;
          const ie = O.screenToFlowPosition(V, q);
          H.update({
            fromX: W.x,
            fromY: W.y,
            toX: ie.x,
            toY: ie.y,
            source: N.source,
            sourceHandle: N.sourceHandle
          });
          const fe = X.querySelector(".flow-viewport");
          fe && fe.appendChild(K), j === "target" && (O.pendingConnection = {
            source: N.source,
            sourceHandle: N.sourceHandle,
            position: ie
          }), O._pendingReconnection = {
            edge: N,
            draggedEnd: j,
            anchorPosition: { ...W },
            position: ie
          }, Y = Jn(X, O, oe, ne), j === "target" && rn(X, N.source, N.sourceHandle ?? "source", O, N.id);
        }, ae = (ie) => {
          if (oe = ie.clientX, ne = ie.clientY, !U) {
            Math.sqrt(
              (ie.clientX - V) ** 2 + (ie.clientY - q) ** 2
            ) >= Fn && F();
            return;
          }
          const fe = O.screenToFlowPosition(ie.clientX, ie.clientY), he = sn({
            containerEl: X,
            handleType: j === "target" ? "target" : "source",
            excludeNodeId: j === "target" ? N.source : N.target,
            cursorFlowPos: fe,
            connectionSnapRadius: te,
            getNode: (de) => O.getNode(de),
            toFlowPosition: (de, pe) => O.screenToFlowPosition(de, pe)
          });
          he.element !== $ && ($?.classList.remove("flow-handle-active"), he.element?.classList.add("flow-handle-active"), $ = he.element), H?.update({
            fromX: W.x,
            fromY: W.y,
            toX: he.position.x,
            toY: he.position.y,
            source: N.source,
            sourceHandle: N.sourceHandle
          });
          const Z = he.position;
          j === "target" && O.pendingConnection && (O.pendingConnection = {
            ...O.pendingConnection,
            position: Z
          }), O._pendingReconnection && (O._pendingReconnection = {
            ...O._pendingReconnection,
            position: Z
          }), Y?.updatePointer(ie.clientX, ie.clientY);
        }, Q = () => {
          z || (z = !0, document.removeEventListener("pointermove", ae), document.removeEventListener("pointerup", ue), Y?.stop(), Y = null, H?.destroy(), H = null, K = null, $?.classList.remove("flow-handle-active"), L = null, s.classList.remove("flow-edge-reconnecting"), Le(X), O.pendingConnection = null, O._pendingReconnection = null);
        }, ue = async (ie) => {
          if (!U) {
            Q(), I(ie);
            return;
          }
          if (O._connectValidating) return;
          let fe = $, he = null;
          if (!fe) {
            he = document.elementFromPoint(ie.clientX, ie.clientY);
            const xe = j === "target" ? '[data-flow-handle-type="target"]' : '[data-flow-handle-type="source"]';
            fe = he?.closest(xe);
          }
          const de = (fe ? fe.closest("[data-flow-node-id]") : he?.closest("[data-flow-node-id]"))?.dataset.flowNodeId, pe = fe?.dataset.flowHandleId, ce = H?.svg ?? null;
          wt(ce, !0);
          let me;
          try {
            me = await Sp({
              dropNodeId: de,
              dropHandleId: pe,
              draggedEnd: j,
              edge: N,
              canvas: O,
              containerEl: X
            });
          } finally {
            wt(ce, !1);
          }
          me.applied ? B("reconnect", `Edge "${N.id}" reconnected (${j})`, me.newConnection) : B("reconnect", `Edge "${N.id}" reconnection cancelled — snapping back`, { reason: me.reason }), O._emit("reconnect-end", { edge: N, successful: me.applied }), Q();
        };
        document.addEventListener("pointermove", ae), document.addEventListener("pointerup", ue), L = Q;
      };
      s.addEventListener("pointerdown", w);
      const _ = (T) => {
        const N = o(n);
        if (!N) return;
        const O = t.$data(e.closest("[x-data]"));
        if (!O) return;
        const re = O._config?.edgesReconnectable !== !1, le = N.reconnectable ?? !0;
        if (!re || le === !1 || !v || !C) {
          s.style.removeProperty("cursor"), l.style.cursor = "pointer";
          return;
        }
        const se = O._config?.reconnectSnapRadius ?? Wi, j = O.screenToFlowPosition(T.clientX, T.clientY), V = (st(j.x, j.y, v.x, v.y, se) || S && st(j.x, j.y, S.x, S.y, se)) && (le === !0 || le === "source"), q = (st(j.x, j.y, C.x, C.y, se) || k && st(j.x, j.y, k.x, k.y, se)) && (le === !0 || le === "target");
        V || q ? (s.style.cursor = "grab", l.style.cursor = "grab") : (s.style.removeProperty("cursor"), l.style.cursor = "pointer");
      };
      s.addEventListener("pointermove", _);
      const D = (T) => {
        if (T.key !== "Enter" && T.key !== " ") return;
        T.preventDefault(), T.stopPropagation();
        const N = o(n);
        if (!N) return;
        const O = t.$data(e.closest("[x-data]"));
        O && (O._emit("edge-click", { edge: N, event: T }), ut(T, O._shortcuts?.multiSelect) ? O.selectedEdges.has(N.id) ? (O.selectedEdges.delete(N.id), N.selected = !1) : (O.selectedEdges.add(N.id), N.selected = !0) : (O.deselectAll(), O.selectedEdges.add(N.id), N.selected = !0), O._emitSelectionChange());
      };
      s.addEventListener("keydown", D);
      const P = () => {
        s.matches(":focus-visible") && s.classList.add("flow-edge-focused");
      }, R = () => s.classList.remove("flow-edge-focused");
      s.addEventListener("focus", P), s.addEventListener("blur", R);
      const G = (T) => {
        T.stopPropagation();
      };
      s.addEventListener("mousedown", G);
      const ee = () => {
        for (const T of [c, d, u])
          T && T.classList.add("flow-edge-hovered");
      }, J = () => {
        for (const T of [c, d, u])
          T && T.classList.remove("flow-edge-hovered");
      };
      s.addEventListener("mouseenter", ee), s.addEventListener("mouseleave", J), i(() => {
        const T = o(n);
        if (!T || !a) return;
        s.setAttribute("data-flow-edge-id", T.id);
        const N = t.$data(e.closest("[x-data]"));
        if (!N?.nodes) return;
        const O = T.type ?? N._config?.defaultEdgeType ?? "bezier";
        N._layoutAnimTick;
        const re = N.getNode(T.source), le = N.getNode(T.target);
        if (!re || !le) return;
        re.sourcePosition, le.targetPosition;
        const se = Ft(re, N._nodeMap, N._config?.nodeOrigin), j = Ft(le, N._nodeMap, N._config?.nodeOrigin), V = e.closest("[x-data]");
        let q, U, z, $;
        if (O === "floating") {
          const Z = ta(se, j);
          q = Z.sourcePos, U = Z.targetPos, z = { x: Z.sx, y: Z.sy, handleWidth: 0, handleHeight: 0 }, $ = { x: Z.tx, y: Z.ty, handleWidth: 0, handleHeight: 0 }, v = { x: Z.sx, y: Z.sy }, C = { x: Z.tx, y: Z.ty };
        } else {
          const Z = N._nodeElements?.get(T.source) ?? V.querySelector(`[data-flow-node-id="${CSS.escape(T.source)}"]`), de = N._nodeElements?.get(T.target) ?? V.querySelector(`[data-flow-node-id="${CSS.escape(T.target)}"]`), pe = Z ? ks(Z.getBoundingClientRect()) : void 0, ce = de ? ks(de.getBoundingClientRect()) : void 0;
          q = ro(V, T.source, T.sourceHandle, "source", re, ce, Z), U = ro(V, T.target, T.targetHandle, "target", le, pe, de);
          const me = t.raw(N).viewport ?? { x: 0, y: 0, zoom: 1 }, xe = me.zoom || 1, Ee = re.rotation, ke = le.rotation;
          q = Ss(q, Ee), U = Ss(U, ke), z = Ls(V, T.source, se, T.sourceHandle, "source", xe, me, ce, Z), $ = Ls(V, T.target, j, T.targetHandle, "target", xe, me, pe, de);
          const Pe = Xt(se, q, N._shapeRegistry, N._config?.nodeOrigin), ye = Xt(j, U, N._shapeRegistry, N._config?.nodeOrigin);
          v = z ?? Pe, C = $ ?? ye;
        }
        const te = Tt(z ?? v, q, z, T.markerStart), K = Tt($ ?? C, U, $, T.markerEnd);
        S = te, k = K;
        let H;
        if (O === "orthogonal" || O === "avoidant") {
          const Z = t.raw(N.nodes), de = new Map(Z.map((ce) => [ce.id, ce])), pe = N._config?.nodeOrigin;
          H = Z.filter((ce) => ce.id !== T.source && ce.id !== T.target).map((ce) => {
            const me = Ft(ce, de, pe);
            return {
              x: me.position.x,
              y: me.position.y,
              width: me.dimensions?.width ?? _e,
              height: me.dimensions?.height ?? be
            };
          });
        }
        const { path: Y, labelPosition: oe } = io(T, se, j, q, U, te, K, N._config?.edgeTypes, H, N._shapeRegistry, N._config?.nodeOrigin, N._config?.defaultEdgeType);
        a.setAttribute("d", Y), l.setAttribute("d", Y);
        const ne = O === "editable", X = ne && (T.showControlPoints || T.selected);
        if (s.querySelectorAll(".flow-edge-control-point, .flow-edge-midpoint").forEach((Z) => Z.remove()), X) {
          const Z = T.controlPoints ?? [], de = N.viewport?.zoom ?? 1, pe = 6 / de, ce = 5 / de, me = v ?? { x: 0, y: 0 }, xe = C ?? { x: 0, y: 0 }, Ee = [me, ...Z, xe], ke = Ee.length - 1, Pe = a.getTotalLength?.() ?? 0;
          if (Pe > 0) {
            const ye = [0], ge = 200;
            let ve = 1;
            for (let Ce = 1; Ce <= ge && ve < Ee.length; Ce++) {
              const He = Ce / ge * Pe, Me = a.getPointAtLength(He), $e = Ee[ve], nt = Me.x - $e.x, Oe = Me.y - $e.y;
              nt * nt + Oe * Oe < 25 && (ye.push(He), ve++);
            }
            for (; ye.length <= ke; )
              ye.push(Pe);
            for (let Ce = 0; Ce < ke; Ce++) {
              const He = (ye[Ce] + ye[Ce + 1]) / 2, Me = a.getPointAtLength(He), $e = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              $e.classList.add("flow-edge-midpoint"), $e.setAttribute("cx", String(Me.x)), $e.setAttribute("cy", String(Me.y)), $e.setAttribute("r", String(ce)), $e.dataset.segmentIndex = String(Ce);
              const nt = document.createElementNS("http://www.w3.org/2000/svg", "title");
              nt.textContent = "Double-click to add control point", $e.appendChild(nt), s.appendChild($e);
            }
          }
          for (let ye = 0; ye < Z.length; ye++) {
            const ge = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            ge.classList.add("flow-edge-control-point"), ge.setAttribute("cx", String(Z[ye].x)), ge.setAttribute("cy", String(Z[ye].y)), ge.setAttribute("r", String(pe)), ge.dataset.pointIndex = String(ye), s.appendChild(ge);
          }
        }
        if (l.style.cursor = ne ? "crosshair" : "pointer", l.style.strokeWidth = String(
          T.interactionWidth ?? N._config?.defaultInteractionWidth ?? 20
        ), T.markerStart != null) {
          const Z = $t(T.markerStart), de = It(Z, N._id);
          a.setAttribute("marker-start", `url(#${de})`);
        } else if (T._renderDualMarker && T.markerEnd) {
          const Z = $t(T.markerEnd), de = It(Z, N._id);
          a.setAttribute("marker-start", `url(#${de})`);
        } else
          a.removeAttribute("marker-start");
        if (T.markerEnd) {
          const Z = $t(T.markerEnd), de = It(Z, N._id);
          a.setAttribute("marker-end", `url(#${de})`);
        } else
          a.removeAttribute("marker-end");
        const W = T.strokeWidth ?? 1.5, F = kp(T.animated);
        switch (F !== p && (a.classList.remove("flow-edge-animated", "flow-edge-pulse"), p === "dot" && M(), p = F), F) {
          case "dash":
            a.classList.add("flow-edge-animated");
            break;
          case "pulse":
            a.classList.add("flow-edge-pulse");
            break;
          case "dot":
            x(s, Y, V, T, T.animationDuration);
            break;
        }
        if (T.animationDuration && F !== "none" ? (F === "dash" || F === "pulse") && (a.style.animationDuration = T.animationDuration) : (F === "dash" || F === "pulse") && a.style.removeProperty("animation-duration"), m && m !== T.class && s.classList.remove(...m.split(" ").filter(Boolean)), T.class) {
          const Z = F === "dash" ? " flow-edge-animated" : F === "pulse" ? " flow-edge-pulse" : "";
          a.setAttribute("class", T.class + Z), s.classList.add(...T.class.split(" ").filter(Boolean)), m = T.class;
        } else
          m && (s.classList.remove(...m.split(" ").filter(Boolean)), m = null);
        if (s.setAttribute("aria-selected", String(!!T.selected)), T.selected)
          s.classList.add("flow-edge-selected"), a.style.strokeWidth = String(Math.max(W + 1, 2.5)), a.style.stroke = "var(--flow-edge-stroke-selected, " + hn + ")";
        else {
          s.classList.remove("flow-edge-selected"), a.style.strokeWidth = String(W);
          const Z = N._markerDefsEl?.querySelector("defs") ?? null;
          if (na(T.color)) {
            if (Z) {
              const de = oa(N._id, T.id), pe = T.gradientDirection === "target-source", ce = v.x, me = v.y, xe = C.x, Ee = C.y;
              ia(
                Z,
                de,
                pe ? { from: T.color.to, to: T.color.from } : T.color,
                ce,
                me,
                xe,
                Ee
              ), a.style.stroke = `url(#${de})`, y = de;
            }
          } else if (T.color) {
            if (y) {
              const de = Z;
              de && Lo(de, y), y = null;
            }
            a.style.stroke = T.color;
          } else {
            if (y) {
              const de = Z;
              de && Lo(de, y), y = null;
            }
            a.style.removeProperty("stroke");
          }
        }
        if (!T.selected && ((T.sourceHandle ? N.selectedRows?.has(T.sourceHandle.replace(/-[lr]$/, "")) : !1) || (T.targetHandle ? N.selectedRows?.has(T.targetHandle.replace(/-[lr]$/, "")) : !1)) ? (s.classList.add("flow-edge-row-highlighted"), T.selected || (a.style.strokeWidth = String(Math.max(W + 0.5, 2)), a.style.stroke = getComputedStyle(s.closest(".flow-container")).getPropertyValue("--flow-edge-row-highlight-color").trim() || "#3b82f6")) : s.classList.remove("flow-edge-row-highlighted"), T.focusable ?? N._config?.edgesFocusable !== !1 ? (s.setAttribute("tabindex", "0"), s.setAttribute("role", T.ariaRole ?? "group"), s.setAttribute("aria-label", T.ariaLabel ?? (T.label ? `Edge: ${T.label}` : `Edge from ${T.source} to ${T.target}`))) : (s.removeAttribute("tabindex"), s.removeAttribute("role"), s.removeAttribute("aria-label")), T.domAttributes)
          for (const [Z, de] of Object.entries(T.domAttributes))
            Z.startsWith("on") || Cp.has(Z.toLowerCase()) || s.setAttribute(Z, de);
        const ue = (Z, de, pe, ce, me) => {
          if (de) {
            if (!Z && ce) {
              const xe = pe.includes("flow-edge-label-start"), Ee = pe.includes("flow-edge-label-end");
              let ke = `[data-flow-edge-id="${me}"].flow-edge-label`;
              xe ? ke += ".flow-edge-label-start" : Ee ? ke += ".flow-edge-label-end" : ke += ":not(.flow-edge-label-start):not(.flow-edge-label-end)", Z = ce.querySelector(ke);
            }
            return Z || (Z = document.createElement("div"), Z.className = pe, Z.dataset.flowEdgeId = me, ce && ce.appendChild(Z)), Z.textContent = de, Z;
          }
          return Z && Z.remove(), null;
        }, ie = e.closest(".flow-viewport"), fe = T.labelVisibility ?? "always", he = () => {
          const Z = a.getAttribute("d") ?? "";
          return Z !== f && (f = Z, h = typeof a.getTotalLength == "function" && a.getTotalLength() || 0), h;
        };
        if (c = ue(c, T.label, "flow-edge-label", ie, T.id), c) {
          const Z = he();
          if (Z > 0) {
            const de = T.labelPosition ?? 0.5, pe = Lp(a, de, Z);
            c.style.left = `${pe.x}px`, c.style.top = `${pe.y}px`;
          } else
            c.style.left = `${oe.x}px`, c.style.top = `${oe.y}px`;
        }
        if (d = ue(d, T.labelStart, "flow-edge-label flow-edge-label-start", ie, T.id), d) {
          const Z = he();
          if (Z > 0) {
            const de = T.labelStartOffset ?? 30, pe = a.getPointAtLength(Math.min(de, Z / 2));
            d.style.left = `${pe.x}px`, d.style.top = `${pe.y}px`;
          }
        }
        if (u = ue(u, T.labelEnd, "flow-edge-label flow-edge-label-end", ie, T.id), u) {
          const Z = he();
          if (Z > 0) {
            const de = T.labelEndOffset ?? 30, pe = a.getPointAtLength(Math.max(Z - de, Z / 2));
            u.style.left = `${pe.x}px`, u.style.top = `${pe.y}px`;
          }
        }
        for (const Z of [c, d, u])
          Z && (Z.classList.toggle("flow-edge-label-hover", fe === "hover"), Z.classList.toggle("flow-edge-label-on-select", fe === "selected"), Z.classList.toggle("flow-edge-label-selected", !!T.selected), T.class ? Z.classList.add(...T.class.split(" ").filter(Boolean)) : m && Z.classList.remove(...m.split(" ").filter(Boolean)));
      }), r(() => {
        if (y) {
          const N = t.$data(e.closest("[x-data]"))?._markerDefsEl?.querySelector("defs");
          N && Lo(N, y);
        }
        L?.(), M(), s.removeEventListener("contextmenu", b), s.removeEventListener("dblclick", E), s.removeEventListener("pointerdown", A, !0), s.removeEventListener("pointerdown", w), s.removeEventListener("pointermove", _), s.removeEventListener("keydown", D), s.removeEventListener("focus", P), s.removeEventListener("blur", R), s.removeEventListener("mousedown", G), s.removeEventListener("mouseenter", ee), s.removeEventListener("mouseleave", J), c?.remove(), d?.remove(), u?.remove();
      });
    }
  );
}
function Tp(t, e) {
  return {
    /** Write node positions directly to DOM elements (bypassing Alpine effects). */
    _flushNodePositions(n) {
      for (const o of n) {
        const i = t.getNode(o);
        if (!i) continue;
        const r = t._nodeElements.get(o);
        if (!r) continue;
        const s = e.raw(i), l = s.parentId ? t.getAbsolutePosition(o) : s.position, a = s.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0], c = s.dimensions?.width ?? 150, d = s.dimensions?.height ?? 40;
        r.style.left = l.x - c * a[0] + "px", r.style.top = l.y - d * a[1] + "px";
      }
    },
    /** Write node styles directly to DOM elements (bypassing Alpine effects). */
    _flushNodeStyles(n) {
      for (const o of n) {
        const i = t.getNode(o);
        if (!i) continue;
        const r = t._nodeElements.get(o);
        if (!r) continue;
        const l = e.raw(i).style;
        if (!l) continue;
        const a = typeof l == "string" ? pn(l) : l;
        for (const [c, d] of Object.entries(a))
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
        const s = Ft(i, t._nodeMap, t._config.nodeOrigin), l = Ft(r, t._nodeMap, t._config.nodeOrigin);
        let a, c, d, u;
        if (o.type === "floating") {
          const h = ta(s, l);
          d = { x: h.sx, y: h.sy }, u = { x: h.tx, y: h.ty };
          const g = Tt(d, h.sourcePos, null, o.markerStart), p = Tt(u, h.targetPos, null, o.markerEnd), y = io(o, s, l, h.sourcePos, h.targetPos, g, p, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          a = y.path, c = y.labelPosition;
        } else {
          const h = t._container;
          let g, p;
          if (h) {
            const C = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.source)}"]`
            ), S = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.target)}"]`
            );
            if (C) {
              const k = C.getBoundingClientRect();
              g = { x: (k.left + k.right) / 2, y: (k.top + k.bottom) / 2 };
            }
            if (S) {
              const k = S.getBoundingClientRect();
              p = { x: (k.left + k.right) / 2, y: (k.top + k.bottom) / 2 };
            }
          }
          const y = h ? ro(h, o.source, o.sourceHandle, "source", i, p) : i?.sourcePosition ?? "bottom", m = h ? ro(h, o.target, o.targetHandle, "target", r, g) : r?.targetPosition ?? "top";
          d = Xt(s, y, t._shapeRegistry, t._config.nodeOrigin), u = Xt(l, m, t._shapeRegistry, t._config.nodeOrigin);
          const x = Tt(d, y, null, o.markerStart), M = Tt(u, m, null, o.markerEnd), v = io(o, s, l, y, m, x, M, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          a = v.path, c = v.labelPosition;
        }
        const f = t.getEdgePathElement(o.id);
        if (f) {
          f.setAttribute("d", a);
          const g = f.parentElement?.querySelector("path:first-child");
          g && g !== f && g.setAttribute("d", a);
        }
        if (na(o.color)) {
          const h = t._markerDefsEl?.querySelector("defs");
          if (h) {
            const g = oa(t._id, o.id), p = o.gradientDirection === "target-source";
            ia(
              h,
              g,
              p ? { from: o.color.to, to: o.color.from } : o.color,
              d.x,
              d.y,
              u.x,
              u.y
            );
          }
        }
        if ((o.label || o.labelStart || o.labelEnd) && t._viewportEl) {
          if (o.label) {
            const h = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label:not(.flow-edge-label-start):not(.flow-edge-label-end)`
            );
            h && (h.style.left = `${c.x}px`, h.style.top = `${c.y}px`);
          }
          if (o.labelStart && f) {
            const h = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label-start`
            );
            if (h) {
              const g = f.getTotalLength(), p = o.labelStartOffset ?? 30, y = f.getPointAtLength(Math.min(p, g / 2));
              h.style.left = `${y.x}px`, h.style.top = `${y.y}px`;
            }
          }
          if (o.labelEnd && f) {
            const h = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label-end`
            );
            if (h) {
              const g = f.getTotalLength(), p = o.labelEndOffset ?? 30, y = f.getPointAtLength(Math.max(g - p, g / 2));
              h.style.left = `${y.x}px`, h.style.top = `${y.y}px`;
            }
          }
        }
      }
    },
    /** Return the registered DOM element for a node by ID, or undefined if not mounted. */
    getNodeElement(n) {
      return t._nodeElements.get(n);
    },
    /** Walk up from any element to find the enclosing node's ID via the data-flow-node-id attribute.
     *  Returns null if no ancestor (or the element itself) carries the attribute. */
    getNodeIdFromElement(n) {
      const o = n.closest("[data-flow-node-id]");
      return o ? o.getAttribute("data-flow-node-id") : null;
    }
  };
}
function Ap(t) {
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
              br(!!i);
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
              t._config.colorMode = i, i && t._container ? t._colorModeHandle ? t._colorModeHandle.update(i) : t._colorModeHandle = Vr(t._container, i) : !i && t._colorModeHandle && (t._colorModeHandle.destroy(), t._colorModeHandle = null);
              break;
            case "autoLayout":
              n.autoLayout = i || void 0, t._autoLayoutFailed = !1, i ? (t._autoLayoutReady = !0, t._scheduleAutoLayout()) : (t._autoLayoutReady = !1, t._autoLayoutTimer && (clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = null));
              break;
          }
    }
  };
}
let Np = 0;
function $p(t, e) {
  switch (t) {
    case "lines":
    case "cross":
      return `linear-gradient(0deg, ${e} 1px, transparent 1px), linear-gradient(90deg, ${e} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${e} 1px, transparent 1px)`;
  }
}
function Ip(t) {
  t.data("flowCanvas", (e = {}) => {
    const n = {
      // ── Reactive State ────────────────────────────────────────────────
      /** Unique instance ID for SVG marker dedup, etc. */
      _id: `flow-${++Np}`,
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
      /** Whether the canvas container is currently in fullscreen mode */
      isFullscreen: !1,
      /** Fullscreen change handler (bound to document for cleanup) */
      _onFullscreenChange: null,
      /** Resolved target element while a fullscreen session is active. */
      _fullscreenTarget: null,
      /** Currently active connection drag, or null */
      pendingConnection: null,
      /** Currently active edge reconnection drag, or null */
      _pendingReconnection: null,
      /** Keyboard-armed pending connection (source handle activated via Enter/Space), or null */
      _pendingKeyboardConnect: null,
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
      _shapeRegistry: { ...zr, ...e.shapeTypes },
      // ── Background ────────────────────────────────────────────────────
      _background: e.background ?? "dots",
      _backgroundGap: e.backgroundGap ?? null,
      _patternColorOverride: e.patternColor ?? null,
      /**
       * Cached resolution of the `--flow-bg-pattern-gap` CSS variable. Reading it
       * requires `getComputedStyle`, a forced style recalc that is prohibitively
       * expensive to run on every viewport frame at schema scale. Populated on the
       * first successful read; invalidate (set `null`) on any theme/colorMode
       * change, since the active theme can redefine the variable.
       */
      _bgGapCache: null,
      /** Last backgroundImage string written to the container — lets `_applyBackground`
       * skip the (per-frame identical) gradient write. */
      _lastBgImage: null,
      _getBackgroundGap() {
        if (this._backgroundGap !== null)
          return this._backgroundGap;
        if (this._bgGapCache !== null)
          return this._bgGapCache;
        if (this._container) {
          const s = getComputedStyle(this._container).getPropertyValue("--flow-bg-pattern-gap").trim(), l = parseFloat(s);
          if (!isNaN(l))
            return this._bgGapCache = l, l;
        }
        return 20;
      },
      _resolveBackgroundLayers() {
        const s = this._background;
        if (!s || s === "none") return [];
        const l = this._getBackgroundGap(), a = this._patternColorOverride ?? "var(--flow-bg-pattern-color)";
        return Array.isArray(s) ? s.map((c) => ({
          variant: c.variant ?? "dots",
          gap: c.gap ?? l,
          color: c.color ?? a
        })) : [{ variant: s, gap: l, color: a }];
      },
      backgroundStyle() {
        const s = this._resolveBackgroundLayers();
        if (s.length === 0) return { backgroundImage: "", backgroundSize: "", backgroundPosition: "" };
        const l = this.viewport.zoom, a = this.viewport.x, c = this.viewport.y, d = [], u = [], f = [];
        for (const h of s) {
          const g = h.gap * l, p = h.variant === "cross" ? g / 2 : g;
          d.push($p(h.variant, h.color)), h.variant === "lines" || h.variant === "cross" ? (u.push(`${p}px ${p}px, ${p}px ${p}px`), f.push(`${a}px ${c}px, ${a}px ${c}px`)) : (u.push(`${g}px ${g}px`), f.push(`${a}px ${c}px`));
        }
        return {
          backgroundImage: d.join(", "),
          backgroundSize: u.join(", "),
          backgroundPosition: f.join(", ")
        };
      },
      // ── Internal ──────────────────────────────────────────────────────
      // Strip collab from stored config — provider objects may contain
      // circular references (e.g. InMemoryProvider.peer) that crash
      // Alpine's deep-reactive proxy walker.
      _config: (() => {
        const { collab: s, ...l } = e;
        return l;
      })(),
      _shortcuts: xf(e.keyboardShortcuts),
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
      /**
       * Reactive parent-id → child-ids index, reconciled in `_rebuildNodeMap`.
       * Lets each node effect ask "do I have children?" via an O(1) keyed lookup
       * instead of scanning the whole nodes array (which subscribed every node
       * effect to the entire array — O(N²) on any array change).
       */
      _childrenIds: /* @__PURE__ */ new Map(),
      /** Stores each node's originally configured dimensions (before layout stretch). */
      _initialDimensions: /* @__PURE__ */ new Map(),
      _edgeMap: /* @__PURE__ */ new Map(),
      _viewportEl: null,
      // ── Viewport frame coalescing ─────────────────────────────────────────
      /**
       * The most recent viewport from d3-zoom, written synchronously on every
       * transform (event rate). Reactive `viewport` and all viewport side-effects
       * are flushed from here once per animation frame; synchronous pointer-path
       * math (drag, auto-pan, coordinate transforms) must read this, not the
       * frame-lagged reactive `viewport`.
       */
      _viewportLive: null,
      /** Pending requestAnimationFrame handle for the coalesced flush, or null. */
      _vpFrame: null,
      /** True when a user-driven move happened since the last flush (gates `viewport-move`). */
      _vpMoved: !1,
      _history: null,
      _announcer: null,
      _computeEngine: new Hf(),
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
      // ── Layout Dedup ─────────────────────────────────────────────────────
      _layoutDedup: null,
      // ── Shared ResizeObserver (A1) ────────────────────────────────────────
      _resizeObserver: null,
      // ── childLayout watcher cleanup fns (keyed by node id) ───────────────
      _childLayoutCleanups: /* @__PURE__ */ new Map(),
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
      _onDropZoneDragleave: null,
      _onDropZoneDrop: null,
      // ── Event Dispatch ────────────────────────────────────────────────
      /**
       * Emit an event: debug log it, invoke the config callback, and
       * dispatch a DOM CustomEvent (flow-xxx) for Alpine @flow-xxx listeners.
       */
      _emit(s, l) {
        s !== "viewport-change" && s !== "viewport-move" && B("event", s, l);
        const a = "on" + s.split("-").map(
          (d) => d.charAt(0).toUpperCase() + d.slice(1)
        ).join(""), c = e[a];
        typeof c == "function" && c(l), this._container?.dispatchEvent(new CustomEvent(`flow-${s}`, {
          bubbles: !0,
          detail: l
        })), this._announcer?.handleEvent(s, l ?? {}), e.computeMode === "auto" && (s === "nodes-change" || s === "edges-change") && (this._computeDebounceTimer && clearTimeout(this._computeDebounceTimer), this._computeDebounceTimer = setTimeout(() => {
          this._computeDebounceTimer = null, this.compute();
        }, 16));
      },
      /** Route a warning through the onError callback (if set) and console.warn. */
      _warn(s, l) {
        typeof e.onError == "function" && e.onError(s, l), console.warn(`[AlpineFlow] ${l}`);
      },
      _emitSelectionChange() {
        this._emit("selection-change", {
          nodes: [...this.selectedNodes],
          edges: [...this.selectedEdges],
          rows: [...this.selectedRows]
        });
      },
      _rebuildNodeMap() {
        this._nodeMap = Fr(this.nodes), Sf(this._childrenIds, this.nodes);
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
        let l;
        try {
          l = JSON.parse(s);
        } catch {
          return;
        }
        const a = /* @__PURE__ */ new Map();
        for (const c of l.nodes ?? [])
          a.set(c.id, { width: c.width, height: c.height });
        for (const c of this.nodes) {
          const d = a.get(c.id);
          d && !c.dimensions && (c.dimensions = { width: d.width, height: d.height }, this._initialDimensions.set(c.id, { ...d }));
        }
        l.viewport && (this.viewport.x = l.viewport.x, this.viewport.y = l.viewport.y, this.viewport.zoom = l.viewport.zoom), this._hydratedFromStatic = !0, this._container.removeAttribute("data-flow-static"), this._container.removeAttribute("data-flow-plan"), this._container.classList.remove("flow-static");
      },
      _captureHistory() {
        this._history?.capture({ nodes: this.nodes, edges: this.edges });
      },
      _snapshotHistory() {
        return this._history ? this._history.snapshot({ nodes: this.nodes, edges: this.edges }) : null;
      },
      _commitHistory(s) {
        s !== null && this._history?.commit(s);
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
        const l = this.backgroundStyle();
        l.backgroundImage !== this._lastBgImage && (s.style.backgroundImage = l.backgroundImage, this._lastBgImage = l.backgroundImage), s.style.backgroundSize = l.backgroundSize, s.style.backgroundPosition = l.backgroundPosition;
      },
      /**
       * d3-zoom transform handler. Runs on every wheel/pan event (120Hz+ on
       * trackpads). Only the transform write needs event-rate latency; the reactive
       * viewport write plus every side-effect (background, culling, zoom-level,
       * context-menu, events) is coalesced to a single flush per animation frame.
       */
      _onViewportTransform(s) {
        this._viewportLive = s, this._viewportEl && (this._viewportEl.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.zoom})`), this._vpFrame === null && (this._vpFrame = requestAnimationFrame(() => {
          this._vpFrame = null, this._flushViewportFrame();
        }));
      },
      /**
       * Apply the coalesced viewport state and its side-effects once per frame.
       * Reactive `viewport` is written here (not per event), so consumers watching
       * `viewport` re-run at frame rate rather than per wheel event.
       */
      _flushViewportFrame() {
        const s = this._viewportLive;
        s && (this.viewport.x = s.x, this.viewport.y = s.y, this.viewport.zoom = s.zoom, this._applyBackground(), this._applyCulling(), this._applyZoomLevel(s.zoom), this.contextMenu.show && this.closeContextMenu(), this._emit("viewport-change", { viewport: { ...s } }), this._vpMoved && (this._vpMoved = !1, this._emit("viewport-move", { viewport: { ...s } })));
      },
      /**
       * Gesture end (user released the wheel/pointer). Commit the end-state
       * synchronously so it is never a frame late, cancelling any pending frame.
       */
      _onViewportMoveEnd(s) {
        this._vpFrame !== null && (cancelAnimationFrame(this._vpFrame), this._vpFrame = null), this._flushViewportFrame(), this._emit("viewport-move-end", { viewport: { ...s } });
      },
      /**
       * Toggle CSS display on off-screen nodes and edges.
       * Called from _flushViewportFrame — entirely outside Alpine's reactive system.
       */
      _applyCulling() {
        if (e.viewportCulling !== !0 || !this._container) return;
        const s = this._container.clientWidth, l = this._container.clientHeight;
        if (s === 0 || l === 0) return;
        const a = e.cullingBuffer ?? 100, c = Nu(this.viewport, s, l, a), d = /* @__PURE__ */ new Set();
        for (const u of this.nodes) {
          if (u.hidden) continue;
          const f = u.dimensions?.width ?? 150, h = u.dimensions?.height ?? 50, g = u.parentId ? Uo(u, this._nodeMap, this._config.nodeOrigin) : u.position, p = !(g.x + f < c.minX || g.x > c.maxX || g.y + h < c.minY || g.y > c.maxY);
          p && d.add(u.id);
          const y = this._nodeElements.get(u.id);
          y && (y.style.display = p ? "" : "none");
        }
        this._visibleNodeIds = d;
      },
      _getVisibleNodeIds() {
        return this._visibleNodeIds;
      },
      _applyZoomLevel(s) {
        if (e.zoomLevels === !1) return;
        const l = e.zoomLevels?.far ?? 0.4, a = e.zoomLevels?.medium ?? 0.75, c = s < l ? "far" : s < a ? "medium" : "close";
        c !== this._zoomLevel && (this._zoomLevel = c, this._container?.setAttribute("data-zoom-level", c));
      },
      getAbsolutePosition(s) {
        const l = this._nodeMap.get(s);
        return l ? Uo(l, this._nodeMap, this._config.nodeOrigin) : { x: 0, y: 0 };
      },
      // ── Init Helpers ─────────────────────────────────────────────────
      /** Enable debug logging if configured. */
      _initDebug() {
        e.debug && br(!0);
      },
      /** Set up container element, attributes, CSS custom properties, animator. */
      _initContainer() {
        this._container = this.$el, this._container.setAttribute("data-flow-canvas", ""), e.fitViewOnInit && this._container.setAttribute("data-fit-view", ""), this._container.setAttribute("role", "application"), this._container.setAttribute("aria-label", e.ariaLabel ?? "Flow diagram"), this._containerStyles = getComputedStyle(this._container), this._animator = new Xu(Un), e.patternColor && this._container.style.setProperty("--flow-bg-pattern-color", e.patternColor), e.backgroundGap && this._container.style.setProperty("--flow-bg-pattern-gap", String(e.backgroundGap));
        const s = e.containerHeight;
        if (s !== void 0 && s !== "auto") {
          let l = null;
          s === "fill" ? l = "100%" : typeof s == "number" && Number.isFinite(s) ? l = `${s}px` : typeof s == "string" && s.trim() && (l = s.trim()), l !== null && this._container.style.setProperty("--flow-container-height", l);
        }
        this._applyZoomLevel(this.viewport.zoom);
      },
      /** Create color mode handle if configured. */
      _initColorMode() {
        e.colorMode && (this._colorModeHandle = Vr(this._container, e.colorMode));
      },
      /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
      _initHydration() {
        this._container.hasAttribute("data-flow-static") && this._hydrateFromStatic(), this.nodes = Et(this.nodes), this._rebuildNodeMap(), this._rebuildEdgeMap();
        for (const s of this.nodes)
          s.dimensions && this._initialDimensions.set(s.id, { ...s.dimensions });
      },
      /** Create FlowHistory if configured. */
      _initHistory() {
        e.history && (this._history = new Ru(e.historyMaxSize ?? 50));
      },
      /** Create screen reader announcer. */
      _initAnnouncer() {
        if (e.announcements !== !1 && this._container) {
          const s = typeof e.announcements == "object" ? e.announcements.formatMessage : void 0;
          this._announcer = new Ff(this._container, s);
        }
      },
      /** Set up collaboration bridge via collab addon plugin. */
      _initCollab() {
        if (e.collab && this._container) {
          const s = Mt("collab");
          if (!s) {
            console.error("[AlpineFlow] Collaboration requires the collab plugin. Register it with: Alpine.plugin(AlpineFlowCollab)");
            return;
          }
          const l = this._container, { Doc: a, Awareness: c, CollabBridge: d, CollabAwareness: u } = s, f = e.collab, h = new a(), g = new c(h), p = new d(h, this, f.provider), y = new u(g, f.user);
          if (De.set(l, { bridge: p, awareness: y, doc: h }), f.provider.connect(h, g), f.cursors !== !1) {
            let m = !1;
            const x = f.throttle ?? 20, M = (S) => {
              if (m) return;
              m = !0;
              const k = l.getBoundingClientRect(), I = this._viewportLive ?? this.viewport, b = (S.clientX - k.left - I.x) / I.zoom, E = (S.clientY - k.top - I.y) / I.zoom;
              y.updateCursor({ x: b, y: E }), setTimeout(() => {
                m = !1;
              }, x);
            }, v = () => {
              y.updateCursor(null);
            };
            l.addEventListener("mousemove", M), l.addEventListener("mouseleave", v);
            const C = De.get(l);
            C.cursorCleanup = () => {
              l.removeEventListener("mousemove", M), l.removeEventListener("mouseleave", v);
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
        }), this._panZoom = Pu(this._container, {
          onTransformChange: (s) => {
            this._onViewportTransform(s);
          },
          onMoveStart: (s) => {
            this._emit("viewport-move-start", { viewport: { ...s } });
          },
          onMove: () => {
            this._vpMoved = !0;
          },
          onMoveEnd: (s) => {
            this._onViewportMoveEnd(s);
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
          onScrollPan: (s, l) => {
            this.panBy(s, l);
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
        }), this._bgGapCache = null, this._applyBackground(), this.$store.flow.register(this._id, this), this._onContainerPointerDown = () => {
          this.$store.flow.activate(this._id);
        }, this._container.addEventListener("pointerdown", this._onContainerPointerDown), Object.keys(this.$store.flow.instances).length === 1 && this.$store.flow.activate(this._id), this._setupMarkerDefs();
      },
      /** Canvas click handler, context menu handler, long press, touch selection mode, context menu event listeners. */
      _initClickHandlers() {
        this._onCanvasClick = (a) => {
          if (this._suppressNextCanvasClick) {
            this._suppressNextCanvasClick = !1;
            return;
          }
          this.pendingConnection && (this._emit("connect-end", {
            connection: null,
            source: this.pendingConnection.source,
            sourceHandle: this.pendingConnection.sourceHandle,
            position: this.screenToFlowPosition(a.clientX, a.clientY)
          }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Le(this._container));
          const c = a.target;
          if (c === this._container || c.classList.contains("flow-viewport")) {
            const d = this.screenToFlowPosition(a.clientX, a.clientY);
            this._emit("pane-click", { event: a, position: d }), this.deselectAll();
          }
        }, this._container.addEventListener("click", this._onCanvasClick), this._onCanvasContextMenu = (a) => {
          const c = a.target;
          if (c === this._container || c.classList.contains("flow-viewport"))
            if (a.preventDefault(), this.selectedNodes.size > 1) {
              const d = this.nodes.filter((u) => this.selectedNodes.has(u.id));
              this._emit("selection-context-menu", { nodes: d, event: a });
            } else {
              const d = this.screenToFlowPosition(a.clientX, a.clientY);
              this._emit("pane-context-menu", { event: a, position: d });
            }
        }, this._container.addEventListener("contextmenu", this._onCanvasContextMenu);
        const s = e.longPressAction ?? "context-menu";
        if (s && (this._longPressCleanup = Cf(
          this._container,
          (a) => {
            const c = a.target;
            if (s === "context-menu") {
              const d = c.closest("[data-flow-node-id]");
              if (d) {
                const f = d.getAttribute("data-flow-node-id"), h = this._nodeMap.get(f);
                if (h) {
                  this._emit("node-context-menu", { node: h, event: a });
                  return;
                }
              }
              const u = c.closest(".flow-edge-svg");
              if (u) {
                const f = u.getAttribute("data-edge-id"), h = f ? this._edgeMap.get(f) : void 0;
                if (h) {
                  this._emit("edge-context-menu", { edge: h, event: a });
                  return;
                }
              }
              if (this.selectedNodes.size > 1) {
                const f = this.nodes.filter((h) => this.selectedNodes.has(h.id));
                this._emit("selection-context-menu", { nodes: f, event: a });
              } else {
                const f = this.screenToFlowPosition(a.clientX, a.clientY);
                this._emit("pane-context-menu", { event: a, position: f });
              }
            } else if (s === "select") {
              const d = c.closest("[data-flow-node-id]");
              if (d) {
                const u = d.getAttribute("data-flow-node-id");
                this.selectedNodes.has(u) ? this.selectedNodes.delete(u) : this.selectedNodes.add(u);
              }
            }
          },
          { duration: e.longPressDuration ?? 500 }
        )), e.touchSelectionMode !== !1) {
          let a = 0, c = 0;
          const d = (p) => {
            p.pointerType === "touch" && (c++, c === 2 && Date.now() - a < 300 && (this._touchSelectionMode = !this._touchSelectionMode, this._container?.classList.toggle("flow-touch-selection-mode", this._touchSelectionMode)), a = Date.now());
          }, u = (p) => {
            p.pointerType === "touch" && (c = Math.max(0, c - 1), c === 0 && (a = 0));
          }, f = this._container;
          if (!f) return;
          f.addEventListener("pointerdown", d), f.addEventListener("pointerup", u), f.addEventListener("pointercancel", u);
          const h = () => {
            document.hidden && (c = 0);
          };
          document.addEventListener("visibilitychange", h);
          const g = document.createElement("div");
          g.className = "flow-touch-selection-mode-indicator", g.textContent = "Selection Mode — tap with two fingers to exit", f.appendChild(g), this._touchSelectionCleanup = () => {
            f.removeEventListener("pointerdown", d), f.removeEventListener("pointerup", u), f.removeEventListener("pointercancel", u), document.removeEventListener("visibilitychange", h), g.remove();
          };
        }
        const l = [
          { event: "flow-node-context-menu", handler: ((a) => {
            Object.assign(this.contextMenu, { show: !0, type: "node", x: a.detail.event.clientX, y: a.detail.event.clientY, node: a.detail.node, edge: null, position: null, nodes: null, event: a.detail.event });
          }) },
          { event: "flow-edge-context-menu", handler: ((a) => {
            Object.assign(this.contextMenu, { show: !0, type: "edge", x: a.detail.event.clientX, y: a.detail.event.clientY, node: null, edge: a.detail.edge, position: null, nodes: null, event: a.detail.event });
          }) },
          { event: "flow-pane-context-menu", handler: ((a) => {
            Object.assign(this.contextMenu, { show: !0, type: "pane", x: a.detail.event.clientX, y: a.detail.event.clientY, node: null, edge: null, position: a.detail.position, nodes: null, event: a.detail.event });
          }) },
          { event: "flow-selection-context-menu", handler: ((a) => {
            Object.assign(this.contextMenu, { show: !0, type: "selection", x: a.detail.event.clientX, y: a.detail.event.clientY, node: null, edge: null, position: null, nodes: a.detail.nodes, event: a.detail.event });
          }) }
        ];
        for (const a of l)
          this._container.addEventListener(a.event, a.handler);
        this._contextMenuListeners = l;
      },
      /** Keyboard shortcut handler (delete, arrows, undo/redo, copy/paste/cut, selection tool toggle, escape). */
      _initKeyboard() {
        this._onKeyDown = (s) => {
          if (!this._active || this._animationLocked) return;
          const l = s.target.tagName, a = this._shortcuts;
          if (Ye(s.key, a.escape) && this.contextMenu.show) {
            this.closeContextMenu();
            return;
          }
          if (Ye(s.key, a.escape) && this.pendingConnection) {
            this._emit("connect-end", {
              connection: null,
              source: this.pendingConnection.source,
              sourceHandle: this.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Le(this._container);
            return;
          }
          if (Ye(s.key, a.delete)) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            this._deleteSelected();
          }
          if (Ye(s.key, this._shortcuts.selectionToolToggle) && !s.ctrlKey && !s.metaKey) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            this._selectionTool = this._selectionTool === "box" ? "lasso" : "box";
            return;
          }
          if (Ye(s.key, a.moveNodes)) {
            if (l === "INPUT" || l === "TEXTAREA" || this._config?.disableKeyboardA11y || this.selectedNodes.size === 0) return;
            s.preventDefault();
            const c = ut(s, a.moveStepModifier) ? a.moveStep * a.moveStepMultiplier : a.moveStep;
            let d = 0, u = 0;
            switch (s.key) {
              case "ArrowUp":
                u = -c;
                break;
              case "ArrowDown":
                u = c;
                break;
              case "ArrowLeft":
                d = -c;
                break;
              case "ArrowRight":
                d = c;
                break;
              default: {
                const f = Array.isArray(a.moveNodes) ? a.moveNodes : [a.moveNodes], h = s.key.length === 1 ? s.key.toLowerCase() : s.key, g = f.findIndex((p) => (p.length === 1 ? p.toLowerCase() : p) === h);
                g === 0 ? u = -c : g === 1 ? u = c : g === 2 ? d = -c : g === 3 && (d = c);
              }
            }
            Ef(s.repeat, this.selectedNodes.size, d, u) && this._captureHistory();
            for (const f of this.selectedNodes) {
              const h = this.getNode(f);
              if (h && Nr(h)) {
                h.position.x += d, h.position.y += u;
                const g = this._container ? De.get(this._container) : void 0;
                g?.bridge && g.bridge.pushLocalNodeUpdate(h.id, { position: h.position });
              }
            }
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey && Ye(s.key, a.undo)) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            s.preventDefault(), this.undo();
          }
          if ((s.ctrlKey || s.metaKey) && s.shiftKey && Ye(s.key, a.redo)) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            s.preventDefault(), this.redo();
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            Ye(s.key, a.copy) ? (s.preventDefault(), this.copy()) : Ye(s.key, a.paste) ? (s.preventDefault(), this.paste()) : Ye(s.key, a.cut) && (s.preventDefault(), this.cut());
          }
        }, document.addEventListener("keydown", this._onKeyDown);
      },
      /** Create minimap if configured. */
      _initMinimap() {
        e.minimap && (this._minimap = ju(this._container, {
          getState: () => ({
            nodes: to(this.nodes, this._nodeMap, this._config.nodeOrigin),
            viewport: this.viewport,
            containerWidth: this._container?.clientWidth ?? 0,
            containerHeight: this._container?.clientHeight ?? 0
          }),
          getViewportState: () => ({
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
          const s = e.controlsContainer ? document.querySelector(e.controlsContainer) ?? this._container : this._container, l = s !== this._container;
          this._controls = ef(s, {
            position: e.controlsPosition ?? "bottom-left",
            orientation: e.controlsOrientation ?? "vertical",
            external: l,
            showZoom: e.controlsShowZoom ?? !0,
            showFitView: e.controlsShowFitView ?? !0,
            showInteractive: e.controlsShowInteractive ?? !0,
            showResetPanels: e.controlsShowResetPanels ?? !1,
            onZoomIn: () => this.zoomIn(),
            onZoomOut: () => this.zoomOut(),
            onFitView: () => this.fitView({ padding: Xo }),
            onToggleInteractive: () => this.toggleInteractive(),
            onResetPanels: () => this.resetPanels(),
            onToggleFullscreen: () => this.toggleFullscreen()
          }), this.$watch("isInteractive", (a) => {
            this._controls?.update({ isInteractive: a });
          }), this.$watch("isFullscreen", (a) => {
            this._controls?.update({ isFullscreen: a });
          });
        }
      },
      /**
       * Wire a document-level `fullscreenchange` listener so the reactive
       * `isFullscreen` flag stays accurate when the user exits via Escape
       * or any out-of-band means. Safe no-op when the Fullscreen API is
       * unavailable (e.g., restricted iframes).
       */
      _initFullscreen() {
        typeof document > "u" || !("fullscreenEnabled" in document) || (this._onFullscreenChange = () => {
          const s = this._fullscreenTarget ?? this._container, l = document.fullscreenElement === s;
          l !== this.isFullscreen && (this.isFullscreen = l, this._container?.dispatchEvent(new CustomEvent("flow-fullscreen-change", {
            bubbles: !0,
            detail: { isFullscreen: l }
          }))), l || (this._fullscreenTarget = null);
        }, document.addEventListener("fullscreenchange", this._onFullscreenChange));
      },
      /**
       * Resolve which element should enter fullscreen. Honors the optional
       * `fullscreenTarget` config (string selector / HTMLElement / function)
       * and falls back to the canvas container.
       */
      _resolveFullscreenTarget() {
        if (!this._container) return null;
        const s = this._config?.fullscreenTarget;
        if (!s) return this._container;
        if (typeof s == "string") {
          const l = this._container.closest(s);
          if (l) return l;
          const a = document.querySelector(s);
          return a || (console.warn(`[AlpineFlow] fullscreenTarget selector "${s}" did not match; falling back to canvas container.`), this._container);
        }
        if (s instanceof HTMLElement) return s;
        if (typeof s == "function")
          try {
            const l = s(this._container);
            if (l instanceof HTMLElement) return l;
          } catch (l) {
            console.warn("[AlpineFlow] fullscreenTarget resolver threw:", l);
          }
        return this._container;
      },
      /**
       * Toggle fullscreen on the canvas container (or the configured
       * `fullscreenTarget`). Requests fullscreen when not active, exits when
       * active. Warns and no-ops if the browser doesn't expose
       * `requestFullscreen` (e.g., restricted iframes).
       */
      toggleFullscreen() {
        if (!this._container || typeof document > "u") return;
        const s = this._resolveFullscreenTarget();
        if (!s) return;
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
          return;
        }
        const l = s.requestFullscreen;
        if (typeof l != "function") {
          console.warn("[AlpineFlow] requestFullscreen is not available in this context");
          return;
        }
        this._fullscreenTarget = s, Promise.resolve(l.call(s)).catch((a) => {
          console.warn("[AlpineFlow] fullscreen request rejected:", a), this._fullscreenTarget = null;
        });
      },
      /** Selection box/lasso setup (pointerdown/pointermove/pointerup handlers). */
      _initSelection() {
        this._selectionBox = tf(this._container), this._lasso = nf(this._container), this._selectionTool = e.selectionTool ?? "box", this._onSelectionPointerDown = (s) => {
          if (!this._config.selectionOnDrag && !this._touchSelectionMode && !ut(s, this._shortcuts.selectionBox))
            return;
          const l = s.target;
          if (l !== this._container && !l.classList.contains("flow-viewport"))
            return;
          s.stopPropagation(), s.preventDefault(), this._selectionShiftHeld = !0;
          const a = this._config.selectionMode ?? "partial", c = ut(s, this._shortcuts.selectionModeToggle);
          if (this._selectionEffectiveMode = c ? a === "partial" ? "full" : "partial" : a, !this._container) return;
          const d = this._container.getBoundingClientRect(), u = s.clientX - d.left, f = s.clientY - d.top;
          this._selectionTool === "lasso" ? this._lasso.start(u, f, this._selectionEffectiveMode) : this._selectionBox.start(u, f, this._selectionEffectiveMode), s.target.setPointerCapture(s.pointerId);
        }, this._onSelectionPointerMove = (s) => {
          if (!(this._selectionTool === "lasso" ? this._lasso?.isActive() : this._selectionBox?.isActive()) || !this._container) return;
          const a = this._container.getBoundingClientRect(), c = s.clientX - a.left, d = s.clientY - a.top;
          this._selectionTool === "lasso" ? this._lasso.update(c, d) : this._selectionBox.update(c, d);
        }, this._onSelectionPointerUp = (s) => {
          if (!(this._selectionTool === "lasso" ? this._lasso?.isActive() : this._selectionBox?.isActive())) return;
          s.target.releasePointerCapture(s.pointerId), this._suppressNextCanvasClick = !0;
          const a = to(this.nodes, this._nodeMap, this._config.nodeOrigin);
          let c, d = [];
          if (this._selectionTool === "lasso") {
            const u = this._lasso.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? af(a, u) : rf(a, u), h = new Set(f.map((g) => g.id));
            if (c = this.nodes.filter((g) => h.has(g.id)), this._config.lassoSelectsEdges)
              for (const g of this.edges) {
                if (g.hidden) continue;
                const p = this._container?.querySelector(
                  `[data-flow-edge-id="${CSS.escape(g.id)}"] path`
                );
                if (!p) continue;
                const y = p.getTotalLength(), m = Math.max(10, Math.ceil(y / 20));
                let x = 0;
                for (let v = 0; v <= m; v++) {
                  const C = p.getPointAtLength(v / m * y);
                  mi(C.x, C.y, u) && x++;
                }
                (this._selectionEffectiveMode === "full" ? x === m + 1 : x > 0) && d.push(g.id);
              }
          } else {
            const u = this._selectionBox.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? Au(a, u, this._config.nodeOrigin) : Tu(a, u, this._config.nodeOrigin), h = new Set(f.map((g) => g.id));
            c = this.nodes.filter((g) => h.has(g.id));
          }
          this._selectionShiftHeld || this.deselectAll();
          for (const u of c) {
            if (!jo(u) || u.hidden) continue;
            u.selected = !0, this.selectedNodes.add(u.id);
            const f = this._container?.querySelector(`[data-flow-node-id="${CSS.escape(u.id)}"]`);
            f && f.classList.add("flow-node-selected");
          }
          for (const u of d) {
            const f = this.getEdge(u);
            f && (f.selected = !0, this.selectedEdges.add(f.id));
          }
          (c.length > 0 || d.length > 0) && this._emitSelectionChange(), this._selectionShiftHeld = !1;
        }, this._container.addEventListener("pointerdown", this._onSelectionPointerDown), this._container.addEventListener("pointermove", this._onSelectionPointerMove), this._container.addEventListener("pointerup", this._onSelectionPointerUp);
      },
      /** Drop zone drag/drop handlers if onDrop configured. */
      _initDropZone() {
        if (e.onDrop) {
          const s = e.dropMimeTypes ?? ["application/alpineflow"], l = (a, c) => {
            const d = document.elementsFromPoint(a, c);
            for (const u of d) {
              const f = u.closest?.("[data-flow-node-id]");
              if (!f)
                continue;
              const h = f.getAttribute("data-flow-node-id");
              if (!h)
                continue;
              const g = this._nodeMap.get(h);
              if (g)
                return g;
            }
            return null;
          };
          this._onDropZoneDragOver = (a) => {
            !a.dataTransfer || !s.some((d) => a.dataTransfer.types.includes(d)) || (a.preventDefault(), a.dataTransfer.dropEffect = "move", this._container?.classList.add("flow-canvas-drag-over"));
          }, this._onDropZoneDragleave = (a) => {
            if (!this._container)
              return;
            const c = a.relatedTarget;
            c && this._container.contains(c) || this._container.classList.remove("flow-canvas-drag-over");
          }, this._onDropZoneDrop = (a) => {
            if (a.preventDefault(), this._container?.classList.remove("flow-canvas-drag-over"), !a.dataTransfer || !e.onDrop)
              return;
            let c = null, d = null;
            for (const p of s) {
              const y = a.dataTransfer.getData(p);
              if (y) {
                c = p, d = y;
                break;
              }
            }
            if (!c || !d)
              return;
            let u;
            try {
              u = JSON.parse(d);
            } catch {
              u = d;
            }
            if (!this._container)
              return;
            const f = vr(
              a.clientX,
              a.clientY,
              this.viewport,
              this._container.getBoundingClientRect()
            ), h = l(a.clientX, a.clientY), g = e.onDrop({ data: u, position: f, targetNode: h, mimeType: c });
            g && this.addNodes(g, { center: !0 });
          }, this._container.addEventListener("dragover", this._onDropZoneDragOver), this._container.addEventListener("dragleave", this._onDropZoneDragleave), this._container.addEventListener("drop", this._onDropZoneDrop);
        }
      },
      /**
       * Return the deepest FlowNode under the given client coordinates.
       * Uses document.elementsFromPoint and walks inward to find the first
       * element carrying a data-flow-node-id attribute.
       *
       * Useful for context menus, tooltips, and custom pointer interactions
       * beyond the built-in drop zone.
       */
      getNodeAtPoint(s, l) {
        const a = document.elementsFromPoint(s, l);
        for (const c of a) {
          const d = c.closest?.("[data-flow-node-id]");
          if (!d)
            continue;
          const u = d.getAttribute("data-flow-node-id");
          if (!u)
            continue;
          const f = this._nodeMap.get(u);
          if (f)
            return f;
        }
        return null;
      },
      /**
       * Install per-property Alpine watchers on a container node's childLayout.
       *
       * Watches the six layout-affecting properties explicitly so that any
       * mutation — direct assignment or via wire-bridge — triggers a re-layout
       * through the existing safeLayoutChildren dedup (at most one call per
       * parent per frame). Unwatched props (e.g. custom user data on childLayout)
       * never cause spurious layouts.
       *
       * Uses Alpine.watch(getter, callback) — the same low-level primitive that
       * $watch delegates to — because $watch only accepts string expressions
       * evaluated in component scope, which can't address per-node sub-objects.
       */
      _installChildLayoutWatchers(s) {
        if (!s.childLayout) return;
        this._uninstallChildLayoutWatchers(s.id);
        const l = [
          "columns",
          "gap",
          "padding",
          "headerHeight",
          "direction",
          "stretch"
        ], a = s.id, c = [];
        for (const d of l) {
          const u = t.watch(
            () => s.childLayout?.[d],
            () => {
              this._layoutDedup?.safeLayoutChildren(a);
            }
          );
          c.push(u);
        }
        this._childLayoutCleanups.set(a, c);
      },
      _uninstallChildLayoutWatchers(s) {
        const l = this._childLayoutCleanups.get(s);
        if (l) {
          for (const a of l) a();
          this._childLayoutCleanups.delete(s);
        }
      },
      /** Create the shared ResizeObserver instance (A1). Called from _initChildLayout. */
      _resizeObserverInit() {
        typeof ResizeObserver > "u" || (this._resizeObserver = new ResizeObserver((s) => {
          for (const l of s) {
            const a = l.target, c = a.getAttribute("data-flow-node-id");
            if (!c) continue;
            const d = this._nodeMap.get(c);
            if (!d) continue;
            const u = l.borderBoxSize?.[0], f = u ? u.inlineSize : a.offsetWidth, h = u ? u.blockSize : a.offsetHeight;
            if (f === 0 && h === 0 || a.offsetParent === null && a.tagName !== "BODY" || d.fixedDimensions === !0) continue;
            const g = Math.round(f), p = Math.round(h), y = d.dimensions;
            if (y && Math.abs((y.width ?? 0) - g) < 1 && Math.abs((y.height ?? 0) - p) < 1)
              continue;
            const m = Jf(
              { width: g, height: p },
              d.minDimensions,
              d.maxDimensions
            );
            d.dimensions = m, d.parentId && this._layoutDedup?.safeLayoutChildren(d.parentId);
          }
        }));
      },
      /** Run initial child layouts for all layout parents. */
      _initChildLayout() {
        if (this._layoutDedup = Kf((s) => {
          this.layoutChildren(s);
        }), this._resizeObserverInit(), this.$wire) {
          const s = this.$wire;
          e.wireEvents && jf(e, s, e.wireEvents);
          const l = Uf(this, s), a = Bf(this, s);
          this._wireCleanup = () => {
            l(), a();
          }, B("init", `wire bridge activated for "${this._id}"`);
        }
        B("init", `flowCanvas "${this._id}" ready`), this._emit("init"), this._recomputeChildValidation();
        for (const s of this.nodes)
          s.childLayout && this._installChildLayoutWatchers(s);
        for (const s of this.nodes)
          s.childLayout && !s.parentId && this.layoutChildren(s.id);
        for (const s of this.nodes)
          s.childLayout && s.parentId && (this._nodeMap.get(s.parentId)?.childLayout || this.layoutChildren(s.id));
        e.fitViewOnInit && requestAnimationFrame(() => {
          this.fitView();
        });
      },
      /** Call setup(canvas) on any addon that provides it. */
      _initAddons() {
        for (const [, s] of Br().entries())
          s && typeof s == "object" && typeof s.setup == "function" && s.setup(this);
      },
      /** Validate auto-layout dependency and start initial layout. */
      _initAutoLayout() {
        if (e.autoLayout) {
          const s = e.autoLayout.algorithm, l = {
            dagre: "layout:dagre",
            force: "layout:force",
            hierarchy: "layout:hierarchy",
            elk: "layout:elk"
          }, a = {
            dagre: "AlpineFlowDagre",
            force: "AlpineFlowForce",
            hierarchy: "AlpineFlowHierarchy",
            elk: "AlpineFlowElk"
          }, c = l[s];
          c && Mt(c) ? (this._autoLayoutReady = !0, this.$nextTick(() => this._runAutoLayout())) : c && this._warn("AUTO_LAYOUT_MISSING_DEP", `autoLayout requires the ${s} plugin. Register it with: Alpine.plugin(${a[s]})`);
        }
      },
      /** requestAnimationFrame ready flip, loading watch, loading overlay injection. */
      _initReady() {
        const s = e.fitViewOnInit ? 2 : 1;
        let l = 0;
        const a = () => {
          if (l++, l < s) {
            requestAnimationFrame(a);
            return;
          }
          this.$nextTick(() => {
            this.ready = !0;
          });
        };
        if (requestAnimationFrame(a), this.$watch("isLoading", (c) => {
          this._container && (this._container.classList.toggle("flow-loading", c), this._container.classList.toggle("flow-ready", !c), !c && this._autoLoadingOverlay && (this._autoLoadingOverlay.remove(), this._autoLoadingOverlay = null));
        }), this._container && this._container.classList.add("flow-loading"), e.loading && this._container && !this._container.querySelector("[data-flow-loading-directive]")) {
          const c = document.createElement("div");
          c.className = "flow-loading-overlay";
          const d = document.createElement("div");
          d.className = "flow-loading-indicator";
          const u = document.createElement("div");
          u.className = "flow-loading-indicator-node";
          const f = document.createElement("div");
          f.className = "flow-loading-indicator-text", f.textContent = this._loadingText, d.appendChild(u), d.appendChild(f), c.appendChild(d), this._container.appendChild(c), this._autoLoadingOverlay = c;
        }
      },
      // ── Lifecycle ─────────────────────────────────────────────────────
      init() {
        o = this, this._initDebug(), this._initContainer(), this._initColorMode(), this._initHydration(), this._initHistory(), this._initAnnouncer(), this._initCollab(), this._initPanZoom(), this._initClickHandlers(), this._initKeyboard(), this._initMinimap(), this._initFullscreen(), this._initControls(), this._initSelection(), this._initChildLayout(), this._initAddons(), this._initDropZone(), this._initAutoLayout(), this._initReady();
      },
      _setupMarkerDefs() {
        const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        s.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;";
        const l = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        s.appendChild(l), this._container?.appendChild(s), this._markerDefsEl = s, this._updateMarkerDefs(), this.$watch("edges", () => {
          this._updateMarkerDefs();
        });
      },
      _updateMarkerDefs() {
        if (!this._markerDefsEl) return;
        const s = this._markerDefsEl.querySelector("defs"), l = /* @__PURE__ */ new Map();
        for (const d of this.edges)
          for (const u of [d.markerStart, d.markerEnd]) {
            if (!u) continue;
            const f = $t(u), h = It(f, this._id);
            l.has(h) || l.set(h, Kn(f, h));
          }
        const a = s.querySelectorAll("marker"), c = /* @__PURE__ */ new Set();
        a.forEach((d) => {
          l.has(d.id) ? c.add(d.id) : d.remove();
        });
        for (const [d, u] of l)
          if (!c.has(d)) {
            const h = new DOMParser().parseFromString(
              `<svg xmlns="http://www.w3.org/2000/svg">${u}</svg>`,
              "image/svg+xml"
            ).querySelector("marker");
            h && s.appendChild(document.importNode(h, !0));
          }
      },
      destroy() {
        if (this._wireCleanup?.(), this._wireCleanup = null, this._longPressCleanup?.(), this._longPressCleanup = null, this._touchSelectionCleanup?.(), this._touchSelectionCleanup = null, this._emit("destroy"), B("destroy", `flowCanvas "${this._id}" destroying`), this._onCanvasClick && this._container && this._container.removeEventListener("click", this._onCanvasClick), this._onCanvasContextMenu && this._container && this._container.removeEventListener("contextmenu", this._onCanvasContextMenu), this._container)
          for (const s of this._contextMenuListeners)
            this._container.removeEventListener(s.event, s.handler);
        if (this._contextMenuListeners = [], this._onKeyDown && document.removeEventListener("keydown", this._onKeyDown), this._onContainerPointerDown && this._container && this._container.removeEventListener("pointerdown", this._onContainerPointerDown), this._markerDefsEl?.remove(), this._markerDefsEl = null, this._minimap?.destroy(), this._minimap = null, this._controls?.destroy(), this._controls = null, this._onFullscreenChange && typeof document < "u" && document.removeEventListener("fullscreenchange", this._onFullscreenChange), this._onFullscreenChange = null, typeof document < "u") {
          const s = document.fullscreenElement;
          s && (s === this._container || s === this._fullscreenTarget) && document.exitFullscreen?.().catch(() => {
          });
        }
        this._fullscreenTarget = null, this._onSelectionPointerDown && this._container && this._container.removeEventListener("pointerdown", this._onSelectionPointerDown), this._onSelectionPointerMove && this._container && this._container.removeEventListener("pointermove", this._onSelectionPointerMove), this._onSelectionPointerUp && this._container && this._container.removeEventListener("pointerup", this._onSelectionPointerUp), this._selectionBox?.destroy(), this._selectionBox = null, this._lasso?.destroy(), this._lasso = null, this._viewportEl = null, this._container && (this._container.removeEventListener("dragover", this._onDropZoneDragOver), this._container.removeEventListener("dragleave", this._onDropZoneDragleave), this._container.removeEventListener("drop", this._onDropZoneDrop)), this._followHandle?.stop(), this._followHandle = null;
        for (const s of this._activeTimelines)
          s.stop();
        if (this._activeTimelines.clear(), this._animator && (t.raw(this._animator).stopAll(), this._animator = null), this._layoutAnimFrame && (cancelAnimationFrame(this._layoutAnimFrame), this._layoutAnimFrame = 0), this._autoLayoutTimer && (clearTimeout(this._autoLayoutTimer), this._autoLayoutTimer = null), this._colorModeHandle && (this._colorModeHandle.destroy(), this._colorModeHandle = null), this._container) {
          const s = De.get(this._container);
          s && (s.bridge.destroy(), s.awareness.destroy(), s.cursorCleanup && s.cursorCleanup(), De.delete(this._container));
        }
        e.collab && e.collab.provider.destroy(), this._container && this._container.removeAttribute("data-flow-canvas"), this.$store.flow.unregister(this._id), this._vpFrame !== null && (cancelAnimationFrame(this._vpFrame), this._vpFrame = null), this._panZoom?.destroy(), this._panZoom = null, this._announcer?.destroy(), this._announcer = null, this._computeDebounceTimer && (clearTimeout(this._computeDebounceTimer), this._computeDebounceTimer = null);
        for (const s of [...this._childLayoutCleanups.keys()])
          this._uninstallChildLayoutWatchers(s);
        this._resizeObserver?.disconnect(), this._resizeObserver = null, this._layoutDedup?.dispose(), this._layoutDedup = null;
      },
      // ── Remaining Flat Methods ────────────────────────────────────────
      /**
       * Set a node's rotation angle in degrees.
       */
      rotateNode(s, l) {
        const a = this.nodes.find((c) => c.id === s);
        a && (this._captureHistory(), a.rotation = l);
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
      /**
       * Batch multiple canvas mutations so that layout reconciliation runs once
       * after the whole block rather than once per mutation. Nested calls join
       * the outermost batch. fn's return value is forwarded; layout still runs
       * even if fn throws.
       */
      batch(s) {
        return this._layoutDedup ? Gf(this._layoutDedup)(s) : s();
      },
      get collab() {
        return this._container ? De.get(this._container)?.awareness : void 0;
      },
      async toImage(s) {
        let l;
        try {
          ({ captureFlowImage: l } = await Promise.resolve().then(() => am));
        } catch {
          throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
        }
        return l(
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
      get(s, l) {
        return o[l];
      },
      set(s, l, a) {
        return o[l] = a, !0;
      }
    }), r = [
      nh(i),
      oh(i),
      ih(i),
      lh(i),
      dh(i),
      Oh(i),
      Bh(i),
      qh(i),
      Xh(i),
      Qh(i),
      ep(i),
      tp(i),
      Tp(i, t),
      Ap(i)
    ];
    for (const s of r)
      Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
    return n.registerMarker = (s, l) => {
      Yu(s, l);
    }, n;
  });
}
function Ps(t, e) {
  return {
    x: e[0] * Math.round(t.x / e[0]),
    y: e[1] * Math.round(t.y / e[1])
  };
}
function Dp(t, e, n) {
  const { onDragStart: o, onDrag: i, onDragEnd: r, getViewport: s, getNodePosition: l, snapToGrid: a = !1, filterSelector: c, container: d, isLocked: u, noDragClassName: f, dragThreshold: h = 0 } = n;
  let g = { x: 0, y: 0 };
  function p(x) {
    const M = s();
    return {
      x: (x.x - M.x) / M.zoom,
      y: (x.y - M.y) / M.zoom
    };
  }
  const y = Be(t), m = ac().subject(() => {
    const x = s(), M = l();
    return {
      x: M.x * x.zoom + x.x,
      y: M.y * x.zoom + x.y
    };
  }).on("start", (x) => {
    g = p(x), o?.({ nodeId: e, position: g, sourceEvent: x.sourceEvent });
  }).on("drag", (x) => {
    let M = p(x);
    a && (M = Ps(M, a));
    const v = {
      x: M.x - g.x,
      y: M.y - g.y
    };
    i?.({ nodeId: e, position: M, delta: v, sourceEvent: x.sourceEvent });
  }).on("end", (x) => {
    let M = p(x);
    a && (M = Ps(M, a)), r?.({ nodeId: e, position: M, sourceEvent: x.sourceEvent });
  });
  return d && m.container(() => d), h > 0 && m.clickDistance(h), m.filter((x) => {
    if (u?.() || f && x.target?.closest?.("." + f)) return !1;
    if (c) {
      const M = t.querySelector(c);
      return M ? M.contains(x.target) : !0;
    }
    return !0;
  }), y.call(m), {
    destroy() {
      y.on(".drag", null);
    }
  };
}
function Rp(t, e) {
  const n = Yt(t, e);
  return {
    id: t.id,
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? _e,
    height: t.dimensions?.height ?? be
  };
}
function Fp(t, e, n) {
  const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  let r = 0, s = 0, l = 1 / 0, a = 1 / 0;
  const c = t.x + t.width / 2, d = t.y + t.height / 2, u = t.x + t.width, f = t.y + t.height;
  for (const h of e) {
    const g = h.x + h.width / 2, p = h.y + h.height / 2, y = h.x + h.width, m = h.y + h.height, x = [
      [t.x, h.x],
      // left-left
      [u, y],
      // right-right
      [c, g],
      // center-center
      [t.x, y],
      // left-right
      [u, h.x]
      // right-left
    ];
    for (const [v, C] of x) {
      const S = C - v;
      Math.abs(S) <= n && (i.add(C), Math.abs(S) < Math.abs(l) && (l = S, r = S));
    }
    const M = [
      [t.y, h.y],
      // top-top
      [f, m],
      // bottom-bottom
      [d, p],
      // center-center
      [t.y, m],
      // top-bottom
      [f, h.y]
      // bottom-top
    ];
    for (const [v, C] of M) {
      const S = C - v;
      Math.abs(S) <= n && (o.add(C), Math.abs(S) < Math.abs(a) && (a = S, s = S));
    }
  }
  return {
    horizontal: [...o],
    vertical: [...i],
    snapOffset: { x: r, y: s }
  };
}
function Hp(t, e, n, o) {
  return Math.abs(t.x - e.x) > 30 ? t.x < e.x ? { source: n, target: o } : { source: o, target: n } : t.y < e.y ? { source: n, target: o } : { source: o, target: n };
}
function Op(t, e, n, o) {
  let i = null, r = o;
  for (const s of n) {
    if (s.id === t) continue;
    const l = Math.sqrt(
      (e.x - s.center.x) ** 2 + (e.y - s.center.y) ** 2
    );
    if (l < r) {
      r = l;
      const { source: a, target: c } = Hp(e, s.center, t, s.id);
      i = { source: a, target: c, targetId: s.id, distance: l, targetCenter: s.center };
    }
  }
  return i;
}
const zp = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
let Vp = 0;
function Ms(t, e, n) {
  e && n !== null && t._commitHistory?.(n);
}
function Po(t, e, n) {
  t._suspendHistory?.();
  try {
    t.reparentNode?.(e, n);
  } finally {
    t._resumeHistory?.();
  }
}
function Bp(t, e) {
  switch (e) {
    case "alt":
      return t.altKey;
    case "meta":
      return t.metaKey;
    case "shift":
      return t.shiftKey;
  }
}
function qp(t, e, n) {
  const o = t.querySelectorAll('[data-flow-handle-type="source"]');
  if (o.length === 0) return null;
  let i = null, r = 1 / 0;
  return o.forEach((s) => {
    const l = s, a = l.getBoundingClientRect();
    if (a.width === 0 && a.height === 0) return;
    const c = a.left + a.width / 2, d = a.top + a.height / 2, u = Math.sqrt((e - c) ** 2 + (n - d) ** 2);
    u < r && (r = u, i = l);
  }), i;
}
function Xp(t, e, n) {
  let o = 1 / 0, i = -1 / 0, r = 1 / 0, s = -1 / 0;
  for (const c of n)
    o = Math.min(o, c.x), i = Math.max(i, c.x + c.width), r = Math.min(r, c.y), s = Math.max(s, c.y + c.height);
  const l = 50, a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  a.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:500;";
  for (const c of t) {
    const d = document.createElementNS("http://www.w3.org/2000/svg", "line");
    d.setAttribute("x1", String(o - l)), d.setAttribute("y1", String(c)), d.setAttribute("x2", String(i + l)), d.setAttribute("y2", String(c)), d.classList.add("flow-guide-path"), a.appendChild(d);
  }
  for (const c of e) {
    const d = document.createElementNS("http://www.w3.org/2000/svg", "line");
    d.setAttribute("x1", String(c)), d.setAttribute("y1", String(r - l)), d.setAttribute("x2", String(c)), d.setAttribute("y2", String(s + l)), d.classList.add("flow-guide-path"), a.appendChild(d);
  }
  return a;
}
function Yp(t) {
  t.directive(
    "flow-node",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = null, l = !1, a = null, c = !1, d = null, u = null, f = null, h = null, g = null, p = null, y = !1, m = -1, x = null, M = !1, v = [], C = "", S = [], k = null;
      i(() => {
        if (!e.isConnected) return;
        const L = o(n);
        if (!L || L.hidden) return;
        const w = t.$data(e.closest("[x-data]"));
        if (!w?.viewport) return;
        const _ = L.parentId ? w.getAbsolutePosition(L.id) : L.position ?? { x: 0, y: 0 }, D = L.nodeOrigin ?? w._config?.nodeOrigin ?? [0, 0], P = L.dimensions?.width ?? 150, R = L.dimensions?.height ?? 40;
        e.style.left = _.x - P * D[0] + "px", e.style.top = _.y - R * D[1] + "px";
      }), i(() => {
        if (!e.isConnected) return;
        const L = o(n);
        if (!L) return;
        if (e.dataset.flowNodeId = L.id, L.type && (e.dataset.flowNodeType = L.type), !M) {
          const V = e.closest("[x-data]"), q = V ? t.$data(V) : null;
          let U = !1;
          if (q?._config?.nodeTypes) {
            const z = L.type ?? "default", $ = q._config.nodeTypes[z] ?? q._config.nodeTypes.default;
            if (typeof $ == "string") {
              const te = document.querySelector($);
              te?.content && (e.appendChild(te.content.cloneNode(!0)), U = !0);
            } else typeof $ == "function" && ($(L, e), U = !0);
          }
          if (!U && e.children.length === 0) {
            const z = document.createElement("div");
            z.setAttribute("x-flow-handle:target", "");
            const $ = document.createElement("span");
            $.setAttribute("x-text", "node.data.label");
            const te = document.createElement("div");
            te.setAttribute("x-flow-handle:source", ""), e.appendChild(z), e.appendChild($), e.appendChild(te), U = !0;
          }
          if (U)
            for (const z of Array.from(e.children))
              t.addScopeToNode(z, { node: L }), t.initTree(z);
          M = !0;
        }
        if (L.hidden) {
          e.classList.add("flow-node-hidden"), e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-hidden"), k !== L.id && (s?.destroy(), s = null, k = L.id);
        const w = t.$data(e.closest("[x-data]"));
        if (!w?.viewport) return;
        if (e.classList.add("flow-node", "nopan"), L.type === "group" ? e.classList.add("flow-node-group") : e.classList.remove("flow-node-group"), L.dimensions) {
          const V = L.childLayout, q = L.fixedDimensions, U = (w._childrenIds?.get(L.id)?.length ?? 0) > 0;
          e.style.width = L.dimensions.width + "px", V || q || U ? e.style.height = L.dimensions.height + "px" : e.style.height = "";
        }
        w.selectedNodes.has(L.id) ? e.classList.add("flow-node-selected") : e.classList.remove("flow-node-selected"), e.setAttribute("aria-selected", String(!!L.selected)), L._validationErrors && L._validationErrors.length > 0 ? e.classList.add("flow-node-invalid") : e.classList.remove("flow-node-invalid");
        const _ = ["flow-node-running", "flow-node-completed", "flow-node-failed", "flow-node-skipped"], D = L.runState;
        for (const V of _)
          e.classList.remove(V);
        D && D !== "pending" && e.classList.add(`flow-node-${D}`);
        for (const V of v)
          e.classList.remove(V);
        const P = L.class ? L.class.split(/\s+/).filter(Boolean) : [];
        for (const V of P)
          e.classList.add(V);
        v = P;
        const R = L.shape ? `flow-node-${L.shape}` : "";
        C !== R && (C && e.classList.remove(C), R && e.classList.add(R), C = R);
        const G = t.$data(e.closest("[data-flow-canvas]")), ee = L.shape && G?._shapeRegistry?.[L.shape];
        if (ee?.clipPath ? e.style.clipPath = ee.clipPath : e.style.clipPath = "", L.style) {
          const V = typeof L.style == "string" ? Object.fromEntries(L.style.split(";").filter(Boolean).map((U) => U.split(":").map((z) => z.trim()))) : L.style, q = [];
          for (const [U, z] of Object.entries(V))
            U && z && (e.style.setProperty(U, z), q.push(U));
          for (const U of S)
            q.includes(U) || e.style.removeProperty(U);
          S = q;
        } else if (S.length > 0) {
          for (const V of S)
            e.style.removeProperty(V);
          S = [];
        }
        if (L.rotation ? (e.style.transform = `rotate(${L.rotation}deg)`, e.style.transformOrigin = "center") : e.style.transform = "", L.focusable ?? w._config?.nodesFocusable !== !1 ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", L.ariaRole ?? "group"), e.setAttribute("aria-label", L.ariaLabel ?? (L.data?.label ? `Node: ${L.data.label}` : `Node ${L.id}`))) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label")), L.domAttributes)
          for (const [V, q] of Object.entries(L.domAttributes))
            V.startsWith("on") || zp.has(V.toLowerCase()) || e.setAttribute(V, q);
        Ve(L) ? e.classList.remove("flow-node-no-connect") : e.classList.add("flow-node-no-connect"), L.collapsed ? e.classList.add("flow-node-collapsed") : e.classList.remove("flow-node-collapsed");
        const T = e.classList.contains("flow-node-condensed");
        L.condensed ? e.classList.add("flow-node-condensed") : e.classList.remove("flow-node-condensed"), !!L.condensed !== T && requestAnimationFrame(() => {
          L.dimensions = {
            width: e.offsetWidth,
            height: e.offsetHeight
          }, B("condense", `Node "${L.id}" re-measured after condense toggle`, L.dimensions);
        }), L.filtered ? e.classList.add("flow-node-filtered") : e.classList.remove("flow-node-filtered");
        const N = L.handles ?? "visible";
        e.classList.remove("flow-handles-hidden", "flow-handles-hover", "flow-handles-select"), N !== "visible" && e.classList.add(`flow-handles-${N}`);
        let O = Hr(L, w._nodeMap);
        w._config?.elevateNodesOnSelect !== !1 && w.selectedNodes.has(L.id) && (O += L.type === "group" ? Math.max(1 - O, 0) : 1e3), y && (O += 1e3);
        const le = L.type === "group" ? 0 : 2;
        if (O !== le ? e.style.zIndex = String(O) : e.style.removeProperty("z-index"), !Nr(L)) {
          e.classList.add("flow-node-locked"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-locked"), e.querySelector("[data-flow-drag-handle]") ? e.classList.add("flow-node-has-handle") : e.classList.remove("flow-node-has-handle");
        const j = e.closest(".flow-container");
        s || (s = Dp(e, L.id, {
          container: j ?? void 0,
          filterSelector: "[data-flow-drag-handle]",
          isLocked: () => w._animationLocked,
          noDragClassName: w._config?.noDragClassName ?? "nodrag",
          dragThreshold: w._config?.nodeDragThreshold ?? 0,
          getViewport: () => w.viewport,
          getNodePosition: () => {
            const V = w.getNode(L.id);
            return V ? V.parentId ? w.getAbsolutePosition(V.id) : { x: V.position.x, y: V.position.y } : { x: 0, y: 0 };
          },
          snapToGrid: w._config?.snapToGrid ?? !1,
          onDragStart({ nodeId: V, position: q, sourceEvent: U }) {
            e.classList.add("flow-node-dragging"), l = !1, c = !1, d = null;
            const z = w._container ? De.get(w._container) : void 0;
            z?.bridge && z.bridge.setDragging(V, !0), h?.destroy(), h = null, g = null, p && j && j.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), p = null, a = w._snapshotHistory?.() ?? null, B("drag", `Node "${V}" drag start`, q);
            const $ = w.getNode(V);
            if ($ && (w._config?.selectNodesOnDrag !== !1 && $.selectable !== !1 && !w.selectedNodes.has(V) && (ut(U, w._shortcuts?.multiSelect) || w.deselectAll(), w.selectedNodes.add(V), $.selected = !0, w._emitSelectionChange(), c = !0), w._emit("node-drag-start", { node: $ }), w.selectedNodes.has(V) && w.selectedNodes.size > 1)) {
              const te = ft(V, w.nodes);
              d = /* @__PURE__ */ new Map();
              for (const K of w.selectedNodes) {
                if (K === V || te.has(K))
                  continue;
                const H = w.getNode(K);
                H && H.draggable !== !1 && d.set(K, { x: H.position.x, y: H.position.y });
              }
            }
            w._config?.autoPanOnNodeDrag !== !1 && j && (u = Ir({
              container: j,
              speed: w._config?.autoPanSpeed ?? 15,
              onPan(te, K) {
                const H = () => w._viewportLive ?? w.viewport, Y = H().zoom || 1, oe = { x: H().x, y: H().y };
                w._panZoom?.setViewport({
                  x: H().x - te,
                  y: H().y - K,
                  zoom: Y
                });
                const ne = oe.x - H().x, X = oe.y - H().y, W = ne === 0 && X === 0, F = w.getNode(V);
                let ae = !1;
                if (F) {
                  const Q = F.position.x, ue = F.position.y;
                  F.position.x += ne / Y, F.position.y += X / Y;
                  const ie = Mn(F.position, F, w._config?.nodeExtent);
                  F.position.x = ie.x, F.position.y = ie.y, ae = F.position.x === Q && F.position.y === ue;
                }
                if (d)
                  for (const [Q] of d) {
                    const ue = w.getNode(Q);
                    if (ue) {
                      ue.position.x += ne / Y, ue.position.y += X / Y;
                      const ie = Mn(ue.position, ue, w._config?.nodeExtent);
                      ue.position.x = ie.x, ue.position.y = ie.y;
                    }
                  }
                return W && ae;
              }
            }), U instanceof MouseEvent && u.updatePointer(U.clientX, U.clientY), u.start());
          },
          onDrag({ nodeId: V, position: q, delta: U, sourceEvent: z }) {
            l = !0;
            const $ = w.getNode(V);
            if ($) {
              if ($.parentId) {
                const H = w.getAbsolutePosition($.parentId);
                let Y = q.x - H.x, oe = q.y - H.y;
                const ne = $.dimensions ?? { width: 150, height: 50 }, X = w.getNode($.parentId);
                if (X?.childLayout) {
                  y || (e.classList.add("flow-reorder-dragging"), x = $.parentId), y = !0;
                  const W = $.extent !== "parent";
                  if ($.position.x = q.x - H.x, $.position.y = q.y - H.y, !W && X.dimensions) {
                    const Q = bo({ x: $.position.x, y: $.position.y }, ne, X.dimensions);
                    $.position.x = Q.x, $.position.y = Q.y;
                  }
                  const F = $.dimensions?.width ?? 150, ae = $.dimensions?.height ?? 50;
                  if (W) {
                    const Q = X.dimensions?.width ?? 150, ue = X.dimensions?.height ?? 50, ie = $.position.x + F / 2, fe = $.position.y + ae / 2, he = 12, Z = x === $.parentId ? 0 : he, de = ie >= Z && ie <= Q - Z && fe >= Z && fe <= ue - Z, pe = /* @__PURE__ */ new Set();
                    let ce = $.parentId;
                    for (; ce; )
                      pe.add(ce), ce = w.getNode(ce)?.parentId;
                    const me = q.x + F / 2, xe = q.y + ae / 2, Ee = ft($.id, w.nodes);
                    let ke = null;
                    const Pe = w.nodes.filter(
                      (ge) => ge.id !== $.id && (ge.droppable || ge.childLayout) && !ge.hidden && !Ee.has(ge.id) && (de ? !pe.has(ge.id) : ge.id !== $.parentId) && (!ge.acceptsDrop || ge.acceptsDrop($))
                    );
                    for (const ge of Pe) {
                      const ve = ge.parentId ? w.getAbsolutePosition(ge.id) : ge.position, Ce = ge.dimensions?.width ?? 150, He = ge.dimensions?.height ?? 50, Me = ge.id === p ? 0 : he;
                      me >= ve.x + Me && me <= ve.x + Ce - Me && xe >= ve.y + Me && xe <= ve.y + He - Me && (ke = ge);
                    }
                    const ye = ke?.id ?? null;
                    if (ye !== p) {
                      p && j && j.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), ye && j && j.querySelector(`[data-flow-node-id="${CSS.escape(ye)}"]`)?.classList.add("flow-node-drop-target"), p = ye;
                      const ge = ye ? w.getNode(ye) : null, ve = x;
                      if (ge?.childLayout && ye !== x) {
                        ve && (w.layoutChildren(ve, { omitFromComputation: V, shallow: !0 }), w.propagateLayoutUp(ve, { omitFromComputation: V })), x = ye;
                        const Ce = w.nodes.filter((Oe) => Oe.parentId === ye && Oe.id !== V).sort((Oe, wa) => (Oe.order ?? 1 / 0) - (wa.order ?? 1 / 0)), He = Ce.length, Me = [...Ce];
                        Me.splice(He, 0, $);
                        for (let Oe = 0; Oe < Me.length; Oe++)
                          Me[Oe].order = Oe;
                        m = He;
                        const $e = w._initialDimensions?.get(V), nt = { ...$, dimensions: $e ? { ...$e } : void 0 };
                        w.layoutChildren(ye, { excludeId: V, includeNode: nt, shallow: !0 }), w.propagateLayoutUp(ye, { includeNode: nt });
                      } else de && x !== $.parentId ? (ve && ve !== $.parentId && (w.layoutChildren(ve, { omitFromComputation: V, shallow: !0 }), w.propagateLayoutUp(ve, { omitFromComputation: V })), x = $.parentId, m = -1) : !ye && !de && (ve && (w.layoutChildren(ve, { omitFromComputation: V, shallow: !0 }), w.propagateLayoutUp(ve, { omitFromComputation: V })), x = null, m = -1);
                    }
                  }
                  if (x) {
                    const Q = w.getNode(x), ue = Q?.childLayout ?? X.childLayout, ie = w.nodes.filter((ce) => ce.parentId === x && ce.id !== V).sort((ce, me) => (ce.order ?? 1 / 0) - (me.order ?? 1 / 0));
                    let fe, he;
                    if (x !== $.parentId) {
                      const ce = Q?.parentId ? w.getAbsolutePosition(x) : Q?.position ?? { x: 0, y: 0 };
                      fe = q.x - ce.x, he = q.y - ce.y;
                    } else
                      fe = $.position.x, he = $.position.y;
                    const Z = ue.swapThreshold ?? 0.5;
                    if (m === -1)
                      if (x === $.parentId) {
                        const ce = $.order ?? 0;
                        m = ie.filter((me) => (me.order ?? 0) < ce).length;
                      } else
                        m = ie.length;
                    const de = m;
                    let pe = ie.length;
                    for (let ce = 0; ce < ie.length; ce++) {
                      const me = ie[ce], xe = me.dimensions?.width ?? 150, Ee = me.dimensions?.height ?? 50, ke = ce < de ? 1 - Z : Z, Pe = me.position.y + Ee * ke, ye = me.position.x + xe * ke;
                      if (ue.direction === "grid") {
                        const ge = {
                          x: fe + F / 2,
                          y: he + ae / 2
                        }, ve = me.position.y + Ee / 2;
                        if (ge.y < me.position.y) {
                          pe = ce;
                          break;
                        }
                        if (Math.abs(ge.y - ve) < Ee / 2 && ge.x < ye) {
                          pe = ce;
                          break;
                        }
                      } else if (ue.direction === "vertical") {
                        if ((ce < de ? he : he + ae) < Pe) {
                          pe = ce;
                          break;
                        }
                      } else if ((ce < de ? fe : fe + F) < ye) {
                        pe = ce;
                        break;
                      }
                    }
                    if (pe !== m) {
                      m = pe;
                      const ce = [...ie];
                      ce.splice(pe, 0, $);
                      for (let Pe = 0; Pe < ce.length; Pe++)
                        ce[Pe].order = Pe;
                      e.closest(".flow-container")?.classList.add("flow-layout-animating"), w._layoutAnimFrame && cancelAnimationFrame(w._layoutAnimFrame);
                      const xe = $.id, Ee = x, ke = Ee !== $.parentId;
                      w._layoutAnimFrame = requestAnimationFrame(() => {
                        if (ke && Ee) {
                          const ve = w.getNode(xe);
                          let Ce;
                          if (ve) {
                            const He = w._initialDimensions?.get(xe);
                            Ce = { ...ve, dimensions: He ? { ...He } : void 0 };
                          }
                          w.layoutChildren(Ee, {
                            excludeId: xe,
                            includeNode: Ce,
                            shallow: !0
                          }), w.propagateLayoutUp(Ee, {
                            includeNode: Ce
                          });
                        } else
                          w.layoutChildren(Ee, xe, !0);
                        const Pe = performance.now(), ye = 300, ge = () => {
                          w._layoutAnimTick++, performance.now() - Pe < ye ? w._layoutAnimFrame = requestAnimationFrame(ge) : w._layoutAnimFrame = 0;
                        };
                        w._layoutAnimFrame = requestAnimationFrame(ge);
                      });
                    }
                  }
                  u && z instanceof MouseEvent && u.updatePointer(z.clientX, z.clientY);
                  return;
                }
                if ($.extent === "parent" && X?.dimensions) {
                  const W = bo(
                    { x: Y, y: oe },
                    ne,
                    X.dimensions
                  );
                  Y = W.x, oe = W.y;
                } else if (Array.isArray($.extent)) {
                  const W = Or({ x: Y, y: oe }, $.extent, ne);
                  Y = W.x, oe = W.y;
                }
                if ((!$.extent || $.extent !== "parent") && (an(
                  X,
                  w._config?.childValidationRules ?? {}
                )?.preventChildEscape || !!X?.childLayout) && X?.dimensions) {
                  const ae = bo(
                    { x: Y, y: oe },
                    ne,
                    X.dimensions
                  );
                  Y = ae.x, oe = ae.y;
                }
                if ($.expandParent && X?.dimensions) {
                  const W = kf(
                    { x: Y, y: oe },
                    ne,
                    X.dimensions
                  );
                  W && (X.dimensions.width = W.width, X.dimensions.height = W.height);
                }
                $.position.x = Y, $.position.y = oe;
              } else {
                const H = Mn(q, $, w._config?.nodeExtent);
                $.position.x = H.x, $.position.y = H.y;
              }
              if (w._config?.snapToGrid) {
                const H = $.nodeOrigin ?? w._config?.nodeOrigin ?? [0, 0], Y = $.dimensions?.width ?? 150, oe = $.dimensions?.height ?? 40, ne = $.parentId ? w.getAbsolutePosition($.id) : $.position;
                e.style.left = ne.x - Y * H[0] + "px", e.style.top = ne.y - oe * H[1] + "px", w._layoutAnimTick++;
              }
              if (w._emit("node-drag", { node: $, position: q }), d)
                for (const [H, Y] of d) {
                  const oe = w.getNode(H);
                  if (oe) {
                    let ne = Y.x + U.x, X = Y.y + U.y;
                    const W = Mn({ x: ne, y: X }, oe, w._config?.nodeExtent);
                    oe.position.x = W.x, oe.position.y = W.y;
                  }
                }
              const K = w._config?.helperLines;
              if (K) {
                const H = typeof K == "object" ? K.snap ?? !0 : !0, Y = typeof K == "object" ? K.threshold ?? 5 : 5, oe = (Q) => {
                  const ue = Q.parentId ? w.getAbsolutePosition(Q.id) : Q.position;
                  return Rp({ ...Q, position: ue }, w._config?.nodeOrigin);
                }, X = (w.selectedNodes.size > 1 && w.selectedNodes.has(V) ? w.nodes.filter((Q) => w.selectedNodes.has(Q.id)) : [$]).map(oe), W = {
                  x: Math.min(...X.map((Q) => Q.x)),
                  y: Math.min(...X.map((Q) => Q.y)),
                  width: Math.max(...X.map((Q) => Q.x + Q.width)) - Math.min(...X.map((Q) => Q.x)),
                  height: Math.max(...X.map((Q) => Q.y + Q.height)) - Math.min(...X.map((Q) => Q.y))
                }, F = w.nodes.filter(
                  (Q) => !w.selectedNodes.has(Q.id) && Q.id !== V && Q.hidden !== !0 && Q.filtered !== !0
                ).map(oe), ae = Fp(W, F, Y);
                if (H && (ae.snapOffset.x !== 0 || ae.snapOffset.y !== 0) && ($.position.x += ae.snapOffset.x, $.position.y += ae.snapOffset.y, d))
                  for (const [Q] of d) {
                    const ue = w.getNode(Q);
                    ue && (ue.position.x += ae.snapOffset.x, ue.position.y += ae.snapOffset.y);
                  }
                if (f?.remove(), ae.horizontal.length > 0 || ae.vertical.length > 0) {
                  const Q = j?.querySelector(".flow-viewport");
                  if (Q) {
                    const ue = w.nodes.map(oe);
                    f = Xp(ae.horizontal, ae.vertical, ue), Q.appendChild(f);
                  }
                } else
                  f = null;
                w._emit("helper-lines-change", {
                  horizontal: ae.horizontal,
                  vertical: ae.vertical
                });
              }
            }
            if (w._config?.preventOverlap) {
              const K = typeof w._config.preventOverlap == "number" ? w._config.preventOverlap : 5, H = $.dimensions?.width ?? _e, Y = $.dimensions?.height ?? be, oe = w.selectedNodes, ne = w.nodes.filter((W) => W.id !== $.id && !W.hidden && !oe.has(W.id)).map((W) => qt(W, w._config?.nodeOrigin)), X = th($.position, H, Y, ne, K);
              $.position.x = X.x, $.position.y = X.y;
            }
            if (!$.parentId) {
              const K = ft($.id, w.nodes), H = w.nodes.filter(
                (W) => W.id !== $.id && W.droppable && !W.hidden && !K.has(W.id) && (!W.acceptsDrop || W.acceptsDrop($))
              ), Y = qt($, w._config?.nodeOrigin);
              let oe = null;
              const ne = 12;
              for (const W of H) {
                const F = W.parentId ? w.getAbsolutePosition(W.id) : W.position, ae = W.dimensions?.width ?? _e, Q = W.dimensions?.height ?? be, ue = Y.x + Y.width / 2, ie = Y.y + Y.height / 2, fe = W.id === p ? 0 : ne;
                ue >= F.x + fe && ue <= F.x + ae - fe && ie >= F.y + fe && ie <= F.y + Q - fe && (oe = W);
              }
              const X = oe?.id ?? null;
              X !== p && (p && j && j.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), X && j && j.querySelector(`[data-flow-node-id="${CSS.escape(X)}"]`)?.classList.add("flow-node-drop-target"), p = X);
            }
            if (w._config?.proximityConnect) {
              const K = w._config.proximityConnectDistance ?? 150, H = $.dimensions ?? { width: 150, height: 50 }, Y = {
                x: $.position.x + H.width / 2,
                y: $.position.y + H.height / 2
              }, oe = w.nodes.filter((X) => X.id !== $.id && !X.hidden).map((X) => ({
                id: X.id,
                center: {
                  x: X.position.x + (X.dimensions?.width ?? 150) / 2,
                  y: X.position.y + (X.dimensions?.height ?? 50) / 2
                }
              })), ne = Op($.id, Y, oe, K);
              if (ne)
                if (w.edges.some(
                  (W) => W.source === ne.source && W.target === ne.target || W.source === ne.target && W.target === ne.source
                ))
                  h?.destroy(), h = null, g = null;
                else {
                  if (g = ne, !h) {
                    h = Rt({
                      connectionLineType: w._config?.connectionLineType,
                      connectionLineStyle: w._config?.connectionLineStyle,
                      connectionLine: w._config?.connectionLine
                    });
                    const W = j?.querySelector(".flow-viewport");
                    W && W.appendChild(h.svg);
                  }
                  h.update({
                    fromX: Y.x,
                    fromY: Y.y,
                    toX: ne.targetCenter.x,
                    toY: ne.targetCenter.y,
                    source: ne.source
                  });
                }
              else
                h?.destroy(), h = null, g = null;
            }
            const te = w._container ? De.get(w._container) : void 0;
            if (te?.bridge) {
              if (te.bridge.pushLocalNodeUpdate(V, { position: $.position }), d)
                for (const [K] of d) {
                  const H = w.getNode(K);
                  H && te.bridge.pushLocalNodeUpdate(K, { position: H.position });
                }
              if (te.awareness && z instanceof MouseEvent && w._container) {
                const K = w._container.getBoundingClientRect(), H = w._viewportLive ?? w.viewport, Y = (z.clientX - K.left - H.x) / H.zoom, oe = (z.clientY - K.top - H.y) / H.zoom;
                te.awareness.updateCursor({ x: Y, y: oe });
              }
            }
            u && z instanceof MouseEvent && u.updatePointer(z.clientX, z.clientY);
          },
          onDragEnd({ nodeId: V, position: q }) {
            e.classList.remove("flow-node-dragging"), B("drag", `Node "${V}" drag end`, q);
            const U = w._container ? De.get(w._container) : void 0;
            U?.bridge && U.bridge.setDragging(V, !1), u?.stop(), u = null, f?.remove(), f = null, w._config?.helperLines && w._emit("helper-lines-change", { horizontal: [], vertical: [] });
            const z = w.getNode(V);
            if (z && w._emit("node-drag-end", { node: z, position: q }), y && z?.parentId) {
              e.classList.remove("flow-reorder-dragging");
              const $ = x;
              y = !1, m = -1, x = null, w._layoutAnimFrame && (cancelAnimationFrame(w._layoutAnimFrame), w._layoutAnimFrame = 0), e.closest(".flow-container")?.classList.remove("flow-layout-animating"), p ? (j && j.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), Po(w, V, p), p = null) : $ && $ !== z.parentId ? (w.layoutChildren($, { omitFromComputation: V, shallow: !0 }), w.propagateLayoutUp($, { omitFromComputation: V }), w.layoutChildren(z.parentId), w._emit("child-reorder", {
                nodeId: V,
                parentId: z.parentId,
                order: z.order
              })) : (w.layoutChildren(z.parentId), w._emit("child-reorder", {
                nodeId: V,
                parentId: z.parentId,
                order: z.order
              })), d = null, w._layoutAnimTick++, Ms(w, l, a), a = null, l = !1;
              return;
            }
            if (z && p)
              j && j.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), Po(w, V, p), p = null;
            else if (z && z.parentId && !p) {
              const $ = an(
                w.getNode(z.parentId),
                w._config?.childValidationRules ?? {}
              ), te = w.getNode(z.parentId);
              if (!$?.preventChildEscape && !te?.childLayout && te?.dimensions) {
                const K = z.position.x, H = z.position.y, Y = z.dimensions?.width ?? 150, oe = z.dimensions?.height ?? 50;
                (K + Y < 0 || H + oe < 0 || K > te.dimensions.width || H > te.dimensions.height) && Po(w, V, null);
              }
              p = null;
            } else
              p && j && j.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), p = null;
            if (w._config?.proximityConnect && g) {
              const $ = g;
              h?.destroy(), h = null, g = null;
              let te = !0;
              if (w._config.onProximityConnect && w._config.onProximityConnect({
                source: $.source,
                target: $.target,
                distance: $.distance
              }) === !1 && (te = !1), te) {
                const K = {
                  source: $.source,
                  sourceHandle: "source",
                  target: $.target,
                  targetHandle: "target"
                };
                if (lt(K, w.edges, { preventCycles: w._config?.preventCycles }) && at(K, w._config?.connectionRules, w._nodeMap) && (j ? Ge(j, K, w.edges) : !0) && (j ? Ke(j, K) : !0) && (!w._config.isValidConnection || w._config.isValidConnection(K))) {
                  if (w._config.proximityConnectConfirm) {
                    const W = j?.querySelector(`[data-flow-node-id="${CSS.escape($.source)}"]`), F = j?.querySelector(`[data-flow-node-id="${CSS.escape($.target)}"]`);
                    W?.classList.add("flow-proximity-confirm"), F?.classList.add("flow-proximity-confirm"), setTimeout(() => {
                      W?.classList.remove("flow-proximity-confirm"), F?.classList.remove("flow-proximity-confirm");
                    }, 400);
                  }
                  const X = `e-${$.source}-${$.target}-${Date.now()}-${Vp++}`;
                  w.addEdges({ id: X, ...K }), w._emit("connect", { connection: K });
                }
              }
            } else
              h?.destroy(), h = null, g = null;
            d = null, l && w._layoutAnimTick++, Ms(w, l, a), a = null, l = !1;
          }
        }));
      });
      {
        const L = t.$data(e.closest("[x-data]"));
        if (L?._config?.easyConnect) {
          const w = L._config.easyConnectKey ?? "alt", _ = (D) => {
            if (!Bp(D, w) || D.target.closest("[data-flow-handle-type]")) return;
            const P = t.$data(e.closest("[x-data]"));
            if (!P || P._animationLocked || P._connectValidating) return;
            const R = o(n);
            if (!R) return;
            const G = P.getNode(R.id);
            if (!G || G.connectable === !1) return;
            D.preventDefault(), D.stopPropagation(), D.stopImmediatePropagation();
            const ee = qp(e, D.clientX, D.clientY), J = ee?.dataset.flowHandleId ?? "source";
            e.classList.add("flow-easy-connecting");
            const T = e.closest(".flow-container");
            if (!T) return;
            const N = P._viewportLive ?? P.viewport, O = N?.zoom || 1, re = N?.x || 0, le = N?.y || 0, se = T.getBoundingClientRect();
            let j, V;
            if (ee) {
              const Y = ee.getBoundingClientRect();
              j = (Y.left + Y.width / 2 - se.left - re) / O, V = (Y.top + Y.height / 2 - se.top - le) / O;
            } else {
              const Y = e.getBoundingClientRect();
              j = (Y.left + Y.width / 2 - se.left - re) / O, V = (Y.top + Y.height / 2 - se.top - le) / O;
            }
            P._emit("connect-start", { source: R.id, sourceHandle: J });
            const q = Rt({
              connectionLineType: P._config?.connectionLineType,
              connectionLineStyle: P._config?.connectionLineStyle,
              connectionLine: P._config?.connectionLine
            }), U = T.querySelector(".flow-viewport");
            U && U.appendChild(q.svg), q.update({ fromX: j, fromY: V, toX: j, toY: V, source: R.id, sourceHandle: J }), P.pendingConnection = { source: R.id, sourceHandle: J, position: { x: j, y: V } }, rn(T, R.id, J, P);
            let z = Jn(T, P, D.clientX, D.clientY), $ = null;
            const te = P._config?.connectionSnapRadius ?? 20, K = (Y) => {
              const oe = P.screenToFlowPosition(Y.clientX, Y.clientY), ne = sn({
                containerEl: T,
                handleType: "target",
                excludeNodeId: R.id,
                cursorFlowPos: oe,
                connectionSnapRadius: te,
                getNode: (X) => P.getNode(X),
                toFlowPosition: (X, W) => P.screenToFlowPosition(X, W)
              });
              ne.element !== $ && ($?.classList.remove("flow-handle-active"), ne.element?.classList.add("flow-handle-active"), $ = ne.element), q.update({ fromX: j, fromY: V, toX: ne.position.x, toY: ne.position.y, source: R.id, sourceHandle: J }), P.pendingConnection = { ...P.pendingConnection, position: ne.position }, z?.updatePointer(Y.clientX, Y.clientY);
            }, H = async (Y) => {
              z?.stop(), z = null, document.removeEventListener("pointermove", K), document.removeEventListener("pointerup", H), q.destroy(), $?.classList.remove("flow-handle-active"), Le(T), e.classList.remove("flow-easy-connecting");
              const oe = P.screenToFlowPosition(Y.clientX, Y.clientY), ne = { source: R.id, sourceHandle: J, position: oe };
              P.pendingConnection = null;
              let X = $;
              if (X || (X = document.elementFromPoint(Y.clientX, Y.clientY)?.closest('[data-flow-handle-type="target"]')), !X) {
                P._emit("connect-end", { connection: null, ...ne });
                return;
              }
              const F = X.closest("[x-flow-node]")?.dataset.flowNodeId, ae = X.dataset.flowHandleId ?? "target";
              if (!F) {
                P._emit("connect-end", { connection: null, ...ne });
                return;
              }
              const Q = { source: R.id, sourceHandle: J, target: F, targetHandle: ae }, ue = await Rr({ connection: Q, canvas: P, containerEl: T });
              P._emit("connect-end", {
                connection: ue.applied ? Q : null,
                ...ne
              });
            };
            document.addEventListener("pointermove", K), document.addEventListener("pointerup", H);
          };
          e.addEventListener("pointerdown", _, { capture: !0 }), r(() => {
            e.removeEventListener("pointerdown", _, { capture: !0 });
          });
        }
      }
      const I = (L) => {
        if (L.key !== "Enter" && L.key !== " ") return;
        L.preventDefault();
        const w = o(n);
        if (!w) return;
        const _ = t.$data(e.closest("[x-data]"));
        _ && (_._animationLocked || jo(w) && (_._emit("node-click", { node: w, event: L }), L.stopPropagation(), ut(L, _._shortcuts?.multiSelect) ? _.selectedNodes.has(w.id) ? (_.selectedNodes.delete(w.id), w.selected = !1) : (_.selectedNodes.add(w.id), w.selected = !0) : (_.deselectAll(), _.selectedNodes.add(w.id), w.selected = !0), _._emitSelectionChange()));
      };
      e.addEventListener("keydown", I);
      const b = () => {
        const L = t.$data(e.closest("[x-data]"));
        if (!L?._config?.autoPanOnNodeFocus) return;
        const w = o(n);
        if (!w) return;
        const _ = w.parentId ? L.getAbsolutePosition(w.id) : w.position;
        L.setCenter(
          _.x + (w.dimensions?.width ?? 150) / 2,
          _.y + (w.dimensions?.height ?? 40) / 2
        );
      };
      e.addEventListener("focus", b);
      const E = (L) => {
        if (l) return;
        const w = o(n);
        if (!w) return;
        const _ = t.$data(e.closest("[x-data]"));
        if (_ && !_._animationLocked && (_._emit("node-click", { node: w, event: L }), !!jo(w))) {
          if (L.stopPropagation(), c) {
            c = !1;
            return;
          }
          ut(L, _._shortcuts?.multiSelect) ? _.selectedNodes.has(w.id) ? (_.selectedNodes.delete(w.id), w.selected = !1, e.classList.remove("flow-node-selected"), B("selection", `Node "${w.id}" deselected (shift)`)) : (_.selectedNodes.add(w.id), w.selected = !0, e.classList.add("flow-node-selected"), B("selection", `Node "${w.id}" selected (shift)`)) : (_.deselectAll(), _.selectedNodes.add(w.id), w.selected = !0, e.classList.add("flow-node-selected"), B("selection", `Node "${w.id}" selected`)), _._emitSelectionChange();
        }
      };
      e.addEventListener("click", E);
      const A = (L) => {
        L.preventDefault(), L.stopPropagation();
        const w = o(n);
        if (!w) return;
        const _ = t.$data(e.closest("[x-data]"));
        if (_)
          if (_.selectedNodes.size > 1 && _.selectedNodes.has(w.id)) {
            const D = _.nodes.filter((P) => _.selectedNodes.has(P.id));
            _._emit("selection-context-menu", { nodes: D, event: L });
          } else
            _._emit("node-context-menu", { node: w, event: L });
      };
      e.addEventListener("contextmenu", A), requestAnimationFrame(() => {
        if (!e.isConnected) return;
        const L = o(n);
        if (!L) return;
        const w = t.$data(e.closest("[x-data]"));
        L.dimensions = {
          width: e.offsetWidth,
          height: e.offsetHeight
        }, B("init", `Node "${L.id}" measured`, L.dimensions), w?._nodeElements?.set(L.id, e), L.resizeObserver !== !1 && w?._resizeObserver && w._resizeObserver.observe(e);
      }), r(() => {
        s?.destroy(), f?.remove(), f = null, h?.destroy(), h = null, e.removeEventListener("keydown", I), e.removeEventListener("focus", b), e.removeEventListener("click", E), e.removeEventListener("contextmenu", A);
        const L = e.dataset.flowNodeId;
        if (L) {
          const w = t.$data(e.closest("[x-data]"));
          w?._nodeElements?.delete(L), w?._resizeObserver?.unobserve(e);
        }
      });
    }
  );
}
const St = {
  minWidth: 30,
  minHeight: 30,
  maxWidth: 1 / 0,
  maxHeight: 1 / 0
};
function Wp(t, e, n, o, i, r) {
  const { minWidth: s, minHeight: l, maxWidth: a, maxHeight: c } = i, d = t.includes("left"), u = t.includes("right"), f = t.includes("top"), h = t.includes("bottom");
  let g = o.width;
  u ? g = o.width + e.x : d && (g = o.width - e.x);
  let p = o.height;
  h ? p = o.height + e.y : f && (p = o.height - e.y), g = Math.max(s, Math.min(a, g)), p = Math.max(l, Math.min(c, p)), r && (g = r[0] * Math.round(g / r[0]), p = r[1] * Math.round(p / r[1]), g = Math.max(s, Math.min(a, g)), p = Math.max(l, Math.min(c, p)));
  const y = g - o.width, m = p - o.height, x = d ? n.x - y : n.x, M = f ? n.y - m : n.y;
  return {
    position: { x, y: M },
    dimensions: { width: g, height: p }
  };
}
const ra = ["top-left", "top-right", "bottom-left", "bottom-right"], aa = ["top", "right", "bottom", "left"], jp = [...ra, ...aa], Up = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize"
};
function Zp(t) {
  t.directive(
    "flow-resizer",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = Kp(o);
      let a = { ...St };
      if (n)
        try {
          const d = i(n);
          a = { ...St, ...d };
        } catch {
        }
      const c = [];
      for (const d of l) {
        const u = document.createElement("div");
        u.className = `flow-resizer-handle flow-resizer-handle-${d}`, u.style.cursor = Up[d], u.dataset.flowResizeDirection = d, e.appendChild(u), c.push(u), u.addEventListener("pointerdown", (f) => {
          f.preventDefault(), f.stopPropagation();
          const h = e.closest("[x-flow-node]");
          if (!h) return;
          const g = e.closest("[x-data]");
          if (!g) return;
          const p = t.$data(g), y = h.dataset.flowNodeId;
          if (!y || !p) return;
          const m = p.getNode(y);
          if (!m || !is(m)) return;
          m.fixedDimensions = !0;
          const x = { ...a };
          if (m.minDimensions?.width != null && a.minWidth === St.minWidth && (x.minWidth = m.minDimensions.width), m.minDimensions?.height != null && a.minHeight === St.minHeight && (x.minHeight = m.minDimensions.height), m.maxDimensions?.width != null && a.maxWidth === St.maxWidth && (x.maxWidth = m.maxDimensions.width), m.maxDimensions?.height != null && a.maxHeight === St.maxHeight && (x.maxHeight = m.maxDimensions.height), !m.dimensions) {
            const E = p.viewport?.zoom || 1, A = h.getBoundingClientRect();
            m.dimensions = { width: A.width / E, height: A.height / E };
          }
          const M = { x: m.position.x, y: m.position.y }, v = { width: m.dimensions.width, height: m.dimensions.height }, C = p.viewport?.zoom || 1, S = f.clientX, k = f.clientY;
          p._captureHistory?.(), B("resize", `Resize start on "${y}" (${d})`, v), p._emit("node-resize-start", { node: m, dimensions: { ...v } });
          const I = (E) => {
            const A = {
              x: (E.clientX - S) / C,
              y: (E.clientY - k) / C
            }, L = Wp(
              d,
              A,
              M,
              v,
              x,
              p._config?.snapToGrid ?? !1
            );
            if (m.position.x = L.position.x, m.position.y = L.position.y, m.dimensions.width = L.dimensions.width, m.dimensions.height = L.dimensions.height, m.parentId) {
              const w = p.getAbsolutePosition(m.id);
              h.style.left = `${w.x}px`, h.style.top = `${w.y}px`;
            } else
              h.style.left = `${L.position.x}px`, h.style.top = `${L.position.y}px`;
            h.style.width = `${L.dimensions.width}px`, h.style.height = `${L.dimensions.height}px`, p._layoutAnimTick++, p._emit("node-resize", { node: m, dimensions: { ...L.dimensions } });
          }, b = () => {
            document.removeEventListener("pointermove", I), document.removeEventListener("pointerup", b), document.removeEventListener("pointercancel", b), B("resize", `Resize end on "${y}"`, m.dimensions), p._emit("node-resize-end", { node: m, dimensions: { ...m.dimensions } });
          };
          document.addEventListener("pointermove", I), document.addEventListener("pointerup", b), document.addEventListener("pointercancel", b);
        });
      }
      r(() => {
        const d = e.closest("[x-flow-node]");
        if (!d) return;
        const u = e.closest("[x-data]");
        if (!u) return;
        const f = t.$data(u), h = d.dataset.flowNodeId;
        if (!h || !f) return;
        const g = f.getNode(h);
        if (!g) return;
        const p = !is(g);
        for (const y of c)
          y.style.display = p ? "none" : "";
      }), s(() => {
        for (const d of c)
          d.remove();
      });
    }
  );
}
function Kp(t) {
  if (t.includes("corners"))
    return ra;
  if (t.includes("edges"))
    return aa;
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
  return jp;
}
function Gp(t, e, n, o) {
  return (Math.atan2(t - n, -(e - o)) * 180 / Math.PI % 360 + 360) % 360;
}
function Jp(t, e) {
  return (Math.round(t / e) * e % 360 + 360) % 360;
}
function Qp(t) {
  t.directive(
    "flow-rotate",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("snap"), a = l && n && Number(i(n)) || 15;
      e.classList.add("flow-rotate-handle"), e.style.cursor = "grab";
      const c = (d) => {
        d.preventDefault(), d.stopPropagation();
        const u = e.closest("[x-flow-node]");
        if (!u) return;
        const f = e.closest("[data-flow-canvas]");
        if (!f) return;
        const h = t.$data(f), g = u.dataset.flowNodeId;
        if (!g || !h) return;
        const p = h.getNode(g);
        if (!p) return;
        const y = u.getBoundingClientRect(), m = y.left + y.width / 2, x = y.top + y.height / 2;
        h._captureHistory(), e.style.cursor = "grabbing";
        const M = (C) => {
          let S = Gp(
            C.clientX,
            C.clientY,
            m,
            x
          );
          l && (S = Jp(S, a)), p.rotation = S;
        }, v = () => {
          document.removeEventListener("pointermove", M), document.removeEventListener("pointerup", v), e.style.cursor = "grab", h._emit("node-rotate-end", { node: p, rotation: p.rotation });
        };
        document.addEventListener("pointermove", M), document.addEventListener("pointerup", v);
      };
      e.addEventListener("pointerdown", c), s(() => {
        e.removeEventListener("pointerdown", c), e.classList.remove("flow-rotate-handle");
      });
    }
  );
}
function eg(t) {
  t.directive(
    "flow-drag-handle",
    (e) => {
      e.setAttribute("data-flow-drag-handle", ""), e.classList.add("flow-drag-handle");
      const n = e.closest("[x-flow-node]");
      n && n.classList.add("flow-node-has-handle");
    }
  );
}
const tg = "application/alpineflow";
function ng(t) {
  t.directive(
    "flow-draggable",
    (e, { expression: n }, { evaluate: o }) => {
      e.setAttribute("draggable", "true"), e.style.cursor = "grab", e.addEventListener("dragstart", (i) => {
        if (!i.dataTransfer) return;
        const r = o(n), s = typeof r == "string" ? r : JSON.stringify(r);
        i.dataTransfer.setData(tg, s), i.dataTransfer.effectAllowed = "move";
      });
    }
  );
}
function og(t) {
  const e = [], n = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (n.has(o.id) || o.source === o.target)
      continue;
    const i = t.find(
      (r) => r.id !== o.id && r.source === o.target && r.target === o.source && !n.has(r.id)
    );
    i && (e.push({ primaryId: o.id, mirrorId: i.id }), n.add(o.id), n.add(i.id));
  }
  return e;
}
function ig(t) {
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
      const l = /* @__PURE__ */ new Map();
      n(() => {
        const a = i.edges, c = new Set(a.map((p) => p.id));
        for (const [p, y] of l)
          c.has(p) || (t.destroyTree(y), y.remove(), l.delete(p), i._edgeSvgElements?.delete(p));
        for (const p of a) {
          if (l.has(p.id)) continue;
          const y = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          y.setAttribute("class", "flow-edge-svg");
          const m = document.createElementNS("http://www.w3.org/2000/svg", "g");
          y.appendChild(m), t.addScopeToNode(m, { edge: p }), m.setAttribute("x-flow-edge", "edge"), t.mutateDom(() => {
            s.appendChild(y);
          }), l.set(p.id, y), i._edgeSvgElements?.set(p.id, y), t.initTree(m);
        }
        const u = (e.closest("[data-flow-canvas]") ?? e).querySelector(".flow-edges-static");
        u && u.remove();
        const f = !!i._config?.collapseBidirectionalEdges, h = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
        if (f) {
          const p = og(
            a
          );
          for (const y of p)
            h.add(y.primaryId), g.add(y.mirrorId);
        }
        for (const p of a) {
          const y = h.has(p.id), m = g.has(p.id);
          !!p._renderDualMarker !== y && (p._renderDualMarker = y ? !0 : void 0), !!p._hiddenByCollapse !== m && (p._hiddenByCollapse = m ? !0 : void 0);
        }
        for (const p of a) {
          const y = l.get(p.id);
          if (!y) continue;
          const m = i.getNode?.(p.source), x = i.getNode?.(p.target), M = p.hidden || p._hiddenByCollapse || m?.hidden || x?.hidden;
          y.style.display = M ? "none" : "";
        }
        for (const p of a) {
          const y = l.get(p.id);
          if (!y) continue;
          const m = i.getNode?.(p.source), x = i.getNode?.(p.target);
          m?.filtered || x?.filtered ? y.classList.add("flow-edge-filtered") : y.classList.remove("flow-edge-filtered");
        }
      }), o(() => {
        for (const [a, c] of l)
          t.destroyTree(c), c.remove(), i._edgeSvgElements?.delete(a);
        l.clear(), s.remove();
      });
    }
  );
}
const sg = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
], rg = "a, button, input, textarea, select, [contenteditable]", ag = 100, lg = 60, cg = /* @__PURE__ */ new Set(["top", "top-left", "top-right"]), dg = /* @__PURE__ */ new Set(["bottom", "bottom-left", "bottom-right"]), ug = /* @__PURE__ */ new Set(["left", "top-left", "bottom-left"]), fg = /* @__PURE__ */ new Set(["right", "top-right", "bottom-right"]);
function hg(t, e) {
  const n = new Set(e), o = n.has("static"), i = n.has("no-resize") || n.has("noresize"), r = n.has("locked"), s = n.has("constrained");
  let l = n.has("fill-width") || n.has("fill"), a = n.has("fill-height") || n.has("fill");
  return { position: t && sg.includes(t) ? t : "top-right", isStatic: o, isFixed: r, noResize: i, constrained: s, fillWidth: l, fillHeight: a };
}
function kt(t, e, n) {
  t.dispatchEvent(new CustomEvent(`flow-${e}`, {
    bubbles: !0,
    detail: n
  }));
}
function pg(t, e, n, o, i, r) {
  return {
    left: Math.max(0, Math.min(t, i - n)),
    top: Math.max(0, Math.min(e, r - o))
  };
}
function gg(t, e, n, o) {
  t.style.transform = "none", t.style.borderRadius = "0", n && (t.style.left = "0", t.style.right = "0", t.style.width = "auto"), o && (t.style.top = "0", t.style.bottom = "0", t.style.height = "auto"), n && !o && (cg.has(e) && (t.style.top = "0"), dg.has(e) && (t.style.bottom = "0")), o && !n && (ug.has(e) && (t.style.left = "0"), fg.has(e) && (t.style.right = "0"));
}
function mg(t) {
  t.directive(
    "flow-panel",
    (e, { value: n, modifiers: o }, { cleanup: i }) => {
      const {
        position: r,
        isStatic: s,
        isFixed: l,
        noResize: a,
        constrained: c,
        fillWidth: d,
        fillHeight: u
      } = hg(n, o), f = d || u, h = !s && !l && !f, g = !s && !a && !f;
      e.classList.add("flow-panel", `flow-panel-${r}`), s && e.classList.add("flow-panel-static"), (l || f) && e.classList.add("flow-panel-locked"), (a || f) && e.classList.add("flow-panel-no-resize"), d && e.classList.add("flow-panel-fill-width"), u && e.classList.add("flow-panel-fill-height"), f && gg(e, r, d, u);
      const p = (C) => C.stopPropagation();
      e.addEventListener("mousedown", p), e.addEventListener("pointerdown", p), e.addEventListener("wheel", p);
      const y = e.parentElement, m = {
        left: e.style.left,
        top: e.style.top,
        right: e.style.right,
        bottom: e.style.bottom,
        transform: e.style.transform,
        width: e.style.width,
        height: e.style.height,
        borderRadius: e.style.borderRadius
      }, x = `flow-panel-${r}`, M = () => {
        e.style.left = m.left, e.style.top = m.top, e.style.right = m.right, e.style.bottom = m.bottom, e.style.transform = m.transform, e.style.width = m.width, e.style.height = m.height, e.style.borderRadius = m.borderRadius, e.classList.contains(x) || e.classList.add(x);
      };
      y.addEventListener("flow-panel-reset", M), y.__flowPanels || (y.__flowPanels = /* @__PURE__ */ new Set()), y.__flowPanels.add(e);
      let v = null;
      if (h) {
        let C = !1, S = 0, k = 0, I = 0, b = 0;
        const E = () => {
          const _ = e.getBoundingClientRect(), D = y.getBoundingClientRect();
          return {
            x: _.left - D.left,
            y: _.top - D.top
          };
        }, A = (_) => {
          if (!C) return;
          let D = I + (_.clientX - S), P = b + (_.clientY - k);
          if (c) {
            const R = pg(
              D,
              P,
              e.offsetWidth,
              e.offsetHeight,
              y.clientWidth,
              y.clientHeight
            );
            D = R.left, P = R.top;
          }
          e.style.left = `${D}px`, e.style.top = `${P}px`, kt(y, "panel-drag", {
            panel: e,
            position: { x: D, y: P }
          });
        }, L = () => {
          if (!C) return;
          C = !1, document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", L), document.removeEventListener("pointercancel", L);
          const _ = E();
          kt(y, "panel-drag-end", {
            panel: e,
            position: _
          });
        }, w = (_) => {
          const D = _.target;
          if (D.closest(rg) || D.closest(".flow-panel-resize-handle"))
            return;
          C = !0, S = _.clientX, k = _.clientY;
          const P = e.getBoundingClientRect(), R = y.getBoundingClientRect();
          I = P.left - R.left, b = P.top - R.top, e.style.bottom = "auto", e.style.right = "auto", e.style.transform = "none", e.style.left = `${I}px`, e.style.top = `${b}px`, document.addEventListener("pointermove", A), document.addEventListener("pointerup", L), document.addEventListener("pointercancel", L), kt(y, "panel-drag-start", {
            panel: e,
            position: { x: I, y: b }
          });
        };
        if (e.addEventListener("pointerdown", w), g) {
          v = document.createElement("div"), v.classList.add("flow-panel-resize-handle"), e.appendChild(v);
          let _ = !1, D = 0, P = 0, R = 0, G = 0;
          const ee = (N) => {
            if (!_) return;
            const O = Math.max(ag, R + (N.clientX - D)), re = Math.max(lg, G + (N.clientY - P));
            e.style.width = `${O}px`, e.style.height = `${re}px`, kt(y, "panel-resize", {
              panel: e,
              dimensions: { width: O, height: re }
            });
          }, J = () => {
            _ && (_ = !1, document.removeEventListener("pointermove", ee), document.removeEventListener("pointerup", J), document.removeEventListener("pointercancel", J), kt(y, "panel-resize-end", {
              panel: e,
              dimensions: { width: e.offsetWidth, height: e.offsetHeight }
            }));
          }, T = (N) => {
            N.stopPropagation(), _ = !0, D = N.clientX, P = N.clientY, R = e.offsetWidth, G = e.offsetHeight, document.addEventListener("pointermove", ee), document.addEventListener("pointerup", J), document.addEventListener("pointercancel", J), kt(y, "panel-resize-start", {
              panel: e,
              dimensions: { width: R, height: G }
            });
          };
          v.addEventListener("pointerdown", T), i(() => {
            e.removeEventListener("pointerdown", w), v?.removeEventListener("pointerdown", T), document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", L), document.removeEventListener("pointercancel", L), document.removeEventListener("pointermove", ee), document.removeEventListener("pointerup", J), document.removeEventListener("pointercancel", J), v?.remove(), e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), y.removeEventListener("flow-panel-reset", M), y.__flowPanels?.delete(e);
          });
        } else
          i(() => {
            e.removeEventListener("pointerdown", w), document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", L), document.removeEventListener("pointercancel", L), e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), y.removeEventListener("flow-panel-reset", M), y.__flowPanels?.delete(e);
          });
      } else
        i(() => {
          e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), y.removeEventListener("flow-panel-reset", M), y.__flowPanels?.delete(e);
        });
    }
  );
}
function yg(t) {
  t.directive(
    "flow-node-toolbar",
    (e, { value: n, modifiers: o }, { effect: i, cleanup: r }) => {
      const s = wg(n), l = vg(o);
      e.classList.add("flow-node-toolbar"), e.style.position = "absolute";
      const a = (d) => {
        d.stopPropagation();
      }, c = (d) => {
        d.stopPropagation();
      };
      e.addEventListener("pointerdown", a), e.addEventListener("click", c), i(() => {
        const d = e.closest("[x-flow-node]");
        if (!d) return;
        const u = e.closest("[x-data]");
        if (!u) return;
        const f = t.$data(u);
        if (!f?.viewport) return;
        const h = f.viewport.zoom || 1, g = parseInt(e.getAttribute("data-flow-offset") ?? "10", 10), p = d.dataset.flowNodeId, y = p ? f.getNode(p) : null, m = y?.dimensions?.width ?? d.offsetWidth, x = y?.dimensions?.height ?? d.offsetHeight, M = g / h;
        let v, C, S, k;
        s === "top" || s === "bottom" ? (C = s === "top" ? -M : x + M, k = s === "top" ? "-100%" : "0%", l === "start" ? (v = 0, S = "0%") : l === "end" ? (v = m, S = "-100%") : (v = m / 2, S = "-50%")) : (v = s === "left" ? -M : m + M, S = s === "left" ? "-100%" : "0%", l === "start" ? (C = 0, k = "0%") : l === "end" ? (C = x, k = "-100%") : (C = x / 2, k = "-50%")), e.style.left = `${v}px`, e.style.top = `${C}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / h}) translate(${S}, ${k})`;
      }), r(() => {
        e.removeEventListener("pointerdown", a), e.removeEventListener("click", c), e.classList.remove("flow-node-toolbar");
      });
    }
  );
}
function wg(t) {
  return t === "bottom" ? "bottom" : t === "left" ? "left" : t === "right" ? "right" : "top";
}
function vg(t) {
  return t.includes("start") ? "start" : t.includes("end") ? "end" : "center";
}
function _g(t) {
  t.directive(
    "flow-context-menu",
    (e, { modifiers: n, expression: o }, { effect: i, evaluate: r, cleanup: s }) => {
      const l = n[0];
      if (!l) {
        console.warn("[AlpineFlow] x-flow-context-menu requires a type modifier: .node, .edge, .pane, or .selection");
        return;
      }
      const a = e, c = a.closest("[x-data]");
      if (!c) return;
      const d = t.$data(c);
      let u = 0, f = 0;
      if (o) {
        const S = r(o);
        u = S?.offsetX ?? 0, f = S?.offsetY ?? 0;
      }
      a.setAttribute("role", "menu"), a.setAttribute("tabindex", "-1"), a.style.display = "none";
      const h = document.createElement("div");
      h.style.cssText = "position:fixed;inset:0;z-index:4999;display:none;", c.appendChild(h);
      let g = null;
      const p = 4, y = () => {
        g = document.activeElement;
        const S = d.contextMenu.x + u, k = d.contextMenu.y + f;
        a.style.display = "", a.style.position = "fixed", a.style.left = S + "px", a.style.top = k + "px", a.style.zIndex = "5000", a.querySelectorAll(':scope > button, :scope > [role="menuitem"]').forEach((w) => {
          w.setAttribute("role", "menuitem"), w.hasAttribute("tabindex") || w.setAttribute("tabindex", "-1");
        });
        const I = a.getBoundingClientRect(), b = window.innerWidth, E = window.innerHeight;
        let A = S, L = k;
        I.right > b - p && (A = b - I.width - p), I.bottom > E - p && (L = E - I.height - p), A < p && (A = p), L < p && (L = p), a.style.left = A + "px", a.style.top = L + "px", h.style.display = "", a.focus({ preventScroll: !0 });
      }, m = () => {
        a.style.display = "none", h.style.display = "none", g && document.contains(g) && (g.focus({ preventScroll: !0 }), g = null);
      };
      i(() => {
        const S = d.contextMenu;
        S.show && S.type === l ? y() : m();
      }), h.addEventListener("click", () => d.closeContextMenu()), h.addEventListener("contextmenu", (S) => {
        S.preventDefault(), d.closeContextMenu();
      });
      const x = () => {
        d.contextMenu.show && d.contextMenu.type === l && d.closeContextMenu();
      };
      window.addEventListener("scroll", x, !0);
      const M = () => Array.from(a.querySelectorAll(
        ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])'
      )), v = (S) => Array.from(S.querySelectorAll(
        "button:not([disabled])"
      )), C = (S) => {
        if (!d.contextMenu.show || d.contextMenu.type !== l || a.style.display === "none") return;
        const k = document.activeElement, I = k?.closest(".flow-context-submenu"), b = I ? v(I) : M();
        if (b.length === 0) return;
        const E = b.indexOf(k);
        switch (S.key) {
          case "ArrowDown": {
            S.preventDefault();
            const A = E < b.length - 1 ? E + 1 : 0;
            b[A].focus({ preventScroll: !0 });
            break;
          }
          case "ArrowUp": {
            S.preventDefault();
            const A = E > 0 ? E - 1 : b.length - 1;
            b[A].focus({ preventScroll: !0 });
            break;
          }
          case "Tab": {
            if (S.preventDefault(), S.shiftKey) {
              const A = E > 0 ? E - 1 : b.length - 1;
              b[A].focus({ preventScroll: !0 });
            } else {
              const A = E < b.length - 1 ? E + 1 : 0;
              b[A].focus({ preventScroll: !0 });
            }
            break;
          }
          case "Enter":
          case " ": {
            S.preventDefault(), k?.click();
            break;
          }
          case "ArrowRight": {
            if (!I) {
              const A = k?.querySelector(".flow-context-submenu");
              A && (S.preventDefault(), A.querySelector("button:not([disabled])")?.focus({ preventScroll: !0 }));
            }
            break;
          }
          case "ArrowLeft": {
            I && (S.preventDefault(), I.closest(".flow-context-submenu-trigger")?.focus({ preventScroll: !0 }));
            break;
          }
        }
      };
      a.addEventListener("keydown", C), s(() => {
        h.remove(), window.removeEventListener("scroll", x, !0), a.removeEventListener("keydown", C);
      });
    }
  );
}
const bg = {
  mouseenter: "mouseleave",
  click: "click"
  // toggle behavior
};
function xg(t) {
  t.directive(
    "flow-animate",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = new Set(o), c = a.has("once"), d = a.has("reverse"), u = a.has("queue"), f = n || "";
      let h = "click";
      a.has("mouseenter") ? h = "mouseenter" : a.has("click") && (h = "click");
      let g = null, p = [], y = !1, m = !1, x = !1;
      function M() {
        const A = r(i);
        return Array.isArray(A) ? A : A && typeof A == "object" ? [A] : [];
      }
      function v() {
        const A = e.closest("[x-data]");
        return A ? t.$data(A) : null;
      }
      function C(A, L = !1) {
        const w = v();
        if (!w?.timeline) return Promise.resolve();
        const _ = w.timeline();
        if (L) {
          for (let D = A.length - 1; D >= 0; D--)
            _.step(A[D]);
          _.reverse();
        } else
          for (const D of A)
            D.parallel ? _.parallel(D.parallel) : _.step(D);
        return g = _, _.play().then(() => {
          g === _ && (g = null);
        });
      }
      function S(A = !1) {
        if (c && m) return;
        m = !0;
        const L = M();
        if (L.length === 0) return;
        const w = () => C(L, A);
        u ? (p.push(w), k()) : (g?.stop(), g = null, p = [], y = !1, w());
      }
      async function k() {
        if (!y) {
          for (y = !0; p.length > 0; )
            await p.shift()();
          y = !1;
        }
      }
      if (f) {
        s(() => {
          const A = M(), L = v();
          L?.registerAnimation && L.registerAnimation(f, A);
        }), l(() => {
          const A = v();
          A?.unregisterAnimation && A.unregisterAnimation(f);
        });
        return;
      }
      const I = () => {
        d && h === "click" ? (S(x), x = !x) : S(!1);
      };
      e.addEventListener(h, I);
      let b = null, E = null;
      d && h !== "click" && (E = bg[h] ?? null, E && (b = () => S(!0), e.addEventListener(E, b))), l(() => {
        g?.stop(), e.removeEventListener(h, I), E && b && e.removeEventListener(E, b);
      });
    }
  );
}
function Eg(t, e, n, o, i) {
  const r = e.position?.x ?? t.position.x, s = e.position?.y ?? t.position.y, l = t.dimensions?.width ?? _e, a = t.dimensions?.height ?? be, c = r * n.zoom + n.x, d = s * n.zoom + n.y, u = (r + l) * n.zoom + n.x, f = (s + a) * n.zoom + n.y;
  return u > 0 && c < o && f > 0 && d < i;
}
function Cg(t, e, n, o, i) {
  const r = t.nodes;
  if (!r || r.length === 0) return !1;
  for (const s of r) {
    const l = e.getNode?.(s) ?? e.nodes?.find((a) => a.id === s);
    if (l && !Eg(l, t, n, o, i))
      return !0;
  }
  return !1;
}
function Sg(t) {
  t.directive(
    "flow-timeline",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = 0, l = null, a = [], c = !1, d = "idle", u = 0;
      function f() {
        const y = e.closest("[x-data]");
        return y ? t.$data(y) : null;
      }
      function h(y, m) {
        const x = f();
        if (!x?.timeline) return Promise.resolve();
        const M = x.timeline(), v = m.speed ?? 1, C = m.autoFitView === !0, S = m.fitViewPadding ?? 0.1, k = x.viewport, I = x.getContainerDimensions?.();
        for (const b of y) {
          const E = v !== 1 ? {
            ...b,
            duration: b.duration !== void 0 ? b.duration / v : void 0,
            delay: b.delay !== void 0 ? b.delay / v : void 0
          } : b;
          if (E.parallel) {
            const A = E.parallel.map(
              (L) => v !== 1 ? {
                ...L,
                duration: L.duration !== void 0 ? L.duration / v : void 0,
                delay: L.delay !== void 0 ? L.delay / v : void 0
              } : L
            );
            M.parallel(A);
          } else if (C && k && I && Cg(E, x, k, I.width, I.height)) {
            const A = {
              fitView: !0,
              fitViewPadding: S,
              duration: E.duration,
              easing: E.easing
            };
            M.parallel([E, A]);
          } else
            M.step(E);
        }
        if (m.lock && M.lock(!0), m.loop !== void 0 && m.loop !== !1) {
          const b = m.loop === !0 ? 0 : m.loop;
          M.loop(b);
        }
        return m.respectReducedMotion !== void 0 && M.respectReducedMotion(m.respectReducedMotion), l = M, d = "playing", c = !0, M.play().then(() => {
          l === M && (l = null, d = "idle", c = !1);
        });
      }
      async function g(y) {
        if (a.length === 0) return;
        if ((y.overflow ?? "queue") === "latest" && c) {
          l?.stop(), l = null, c = !1, d = "idle";
          const x = [a[a.length - 1]];
          s += a.length, a = [], await h(x, y);
        } else {
          const x = [...a];
          s += x.length, a = [], c && await new Promise((v) => {
            l ? (l.on("complete", () => v()), l.on("stop", () => v())) : v();
          }), await h(x, y);
        }
      }
      const p = {
        async play() {
          const y = o(n), m = y.steps ?? [];
          s < m.length && (a = m.slice(s), await g(y));
        },
        stop() {
          l?.stop(), l = null, c = !1, d = "stopped", a = [];
        },
        reset(y) {
          if (l?.stop(), l = null, c = !1, d = "idle", s = 0, a = [], u = 0, y) {
            const m = o(n), x = m.steps ?? [];
            if (x.length > 0)
              return a = [...x], g(m);
          }
        },
        get state() {
          return d;
        }
      };
      e.__timeline = p, i(() => {
        const y = o(n);
        if (!y || !y.steps) return;
        const m = y.steps, x = y.autoplay !== !1;
        if (m.length > u) {
          const M = m.slice(Math.max(s, u));
          u = m.length, M.length > 0 && x && (a.push(...M), g(y));
        } else
          u = m.length;
      }), r(() => {
        l?.stop(), delete e.__timeline;
      });
    }
  );
}
function kg(t) {
  t.directive(
    "flow-collapse",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("all"), a = o.includes("expand"), c = o.includes("children"), d = o.includes("instant"), u = () => {
        const f = e.closest("[data-flow-canvas]");
        if (!f) return;
        const h = t.$data(f);
        if (!h) return;
        if (l) {
          for (const p of h.nodes)
            a ? h.expandNode?.(p.id, { animate: !d }) : h.collapseNode?.(p.id, { animate: !d });
          e.setAttribute("aria-expanded", String(a));
          return;
        }
        if (c && n) {
          const p = i(n);
          if (!p) return;
          for (const y of h.nodes)
            y.parentId === p && (a ? h.expandNode?.(y.id, { animate: !d }) : h.collapseNode?.(y.id, { animate: !d }));
          e.setAttribute("aria-expanded", String(a));
          return;
        }
        const g = i(n);
        !g || !h?.toggleNode || h.toggleNode(g, { animate: !d });
      };
      e.addEventListener("click", u), e.setAttribute("data-flow-collapse", ""), e.style.cursor = "pointer", !l && !c && r(() => {
        const f = i(n);
        if (!f) return;
        const h = e.closest("[data-flow-canvas]");
        if (!h) return;
        const g = t.$data(h);
        if (!g?.isCollapsed) return;
        const p = g.isCollapsed(f);
        e.setAttribute("aria-expanded", String(!p));
        const y = e.closest("[x-flow-node]");
        y && e.setAttribute("aria-controls", y.id || f);
      }), s(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function Lg(t) {
  t.directive(
    "flow-condense",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = () => {
        const a = i(n);
        if (!a) return;
        const c = e.closest("[x-data]");
        if (!c) return;
        const d = t.$data(c);
        d?.toggleCondense && d.toggleCondense(a);
      };
      e.addEventListener("click", l), e.setAttribute("data-flow-condense", ""), e.style.cursor = "pointer", r(() => {
        const a = i(n);
        if (!a) return;
        const c = e.closest("[x-data]");
        if (!c) return;
        const d = t.$data(c);
        if (!d?.isCondensed) return;
        const u = d.isCondensed(a);
        e.setAttribute("aria-expanded", String(!u));
      }), s(() => {
        e.removeEventListener("click", l);
      });
    }
  );
}
function Mo(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Pg(t) {
  t.directive("flow-schema", (e, n, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, l = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    }, a = () => {
      try {
        const m = s.closest(".flow-container");
        return m ? !!t.$data?.(m)?._config?.rowsReorderable : !1;
      } catch {
        return !1;
      }
    }, c = () => {
      try {
        const m = s.closest(".flow-container");
        return m ? !!t.$data?.(m)?._config?.keyboardConnect : !1;
      } catch {
        return !1;
      }
    };
    s.classList.add("flow-schema-node");
    let d = null, u = null;
    const f = /* @__PURE__ */ new Map(), h = () => {
      d && u || (Mo(s), f.clear(), d = document.createElement("div"), d.className = "flow-schema-header", s.appendChild(d), u = document.createElement("div"), u.className = "flow-schema-body", s.appendChild(u));
    }, g = () => {
      const m = l(), x = m?.data;
      if (!x) {
        for (const E of f.values())
          t.destroyTree(E);
        f.clear(), Mo(s), d = null, u = null;
        return;
      }
      h();
      const M = typeof x.label == "string" ? x.label : "", v = Array.isArray(x.fields) ? x.fields : [], C = typeof m?.id == "string" ? m.id : "";
      typeof x.kind == "string" && x.kind ? s.setAttribute("data-flow-schema-kind", x.kind) : s.removeAttribute("data-flow-schema-kind"), d.textContent !== M && (d.textContent = M);
      const S = a(), k = c(), I = /* @__PURE__ */ new Set();
      for (const E of v) {
        I.add(E.name);
        const A = f.get(E.name);
        if (A)
          p(A, E);
        else {
          const L = y(E, C, S, k);
          f.set(E.name, L), u.appendChild(L), t.initTree(L);
        }
      }
      for (const [E, A] of f)
        I.has(E) || (t.destroyTree(A), A.remove(), f.delete(E));
      let b = u.firstChild;
      for (const E of v) {
        const A = f.get(E.name);
        A && (b === A ? b = b.nextSibling : u.insertBefore(A, b));
      }
    }, p = (m, x) => {
      m.dataset.flowSchemaField !== x.name && (m.dataset.flowSchemaField = x.name), m.classList.toggle("flow-schema-row--pk", x.key === "primary"), m.classList.toggle("flow-schema-row--fk", x.key === "foreign"), m.classList.toggle("flow-schema-row--required", !!x.required);
      let M = m.querySelector(".flow-schema-row-icon");
      const v = m.querySelector(".flow-schema-row-name");
      x.icon ? (M || (M = document.createElement("span"), M.className = "flow-schema-row-icon", m.insertBefore(M, v)), M.textContent !== x.icon && (M.textContent = x.icon)) : M && M.remove(), v && v.textContent !== x.name && (v.textContent = x.name);
      const C = m.querySelector(".flow-schema-row-type");
      C && C.textContent !== x.type && (C.textContent = x.type);
    }, y = (m, x, M, v) => {
      const C = document.createElement("div");
      C.className = "flow-schema-row", C.dataset.flowSchemaField = m.name, m.key === "primary" && C.classList.add("flow-schema-row--pk"), m.key === "foreign" && C.classList.add("flow-schema-row--fk"), m.required && C.classList.add("flow-schema-row--required"), x && C.setAttribute(
        "x-flow-row-select",
        JSON.stringify(`${x}.${m.name}`)
      ), M && C.setAttribute("x-schema-reorderable", ""), v && x && C.setAttribute(
        "x-schema-keyboard-nav",
        JSON.stringify(`${x}.${m.name}`)
      );
      const S = document.createElement("div");
      if (S.className = "flow-schema-handle flow-schema-handle--target", S.setAttribute("x-flow-handle:target.left", JSON.stringify(m.name)), C.appendChild(S), m.icon) {
        const L = document.createElement("span");
        L.className = "flow-schema-row-icon", L.textContent = m.icon, C.appendChild(L);
      }
      const k = document.createElement("span");
      k.className = "flow-schema-row-name", k.textContent = m.name, C.appendChild(k);
      const I = document.createElement("span");
      I.className = "flow-schema-row-type", I.textContent = m.type, C.appendChild(I);
      const b = document.createElement("div");
      b.className = "flow-schema-handle flow-schema-handle--source", b.setAttribute("x-flow-handle:source.right", JSON.stringify(m.name)), C.appendChild(b);
      const E = document.createElement("div");
      E.className = "flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror", E.setAttribute("x-flow-handle:target.right", JSON.stringify(m.name)), C.appendChild(E);
      const A = document.createElement("div");
      return A.className = "flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror", A.setAttribute("x-flow-handle:source.left", JSON.stringify(m.name)), C.appendChild(A), C;
    };
    i(() => {
      if (!s.isConnected) return;
      const m = l()?.data;
      m?.label, m?.kind;
      const x = m?.fields;
      if (Array.isArray(x))
        for (const M of x)
          M.name, M.type, M.key, M.required, M.icon;
      g();
    }), r(() => {
      for (const m of f.values())
        t.destroyTree(m);
      f.clear(), Mo(s), d = null, u = null, s.classList.remove("flow-schema-node");
    });
  });
}
function Mg(t) {
  if (!Number.isFinite(t) || t < 0) return "";
  if (t < 1e3) return `${t}ms`;
  if (t < 6e4) {
    const o = t / 1e3;
    return t % 1e3 === 0 ? `${o}s` : `${o.toFixed(1)}s`;
  }
  const e = Math.floor(t / 6e4), n = Math.floor(t % 6e4 / 1e3);
  return n === 0 ? `${e}m` : `${e}m ${n}s`;
}
function Ts(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Tg(t) {
  t.directive("flow-wait", (e, n, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, l = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    };
    s.classList.add("flow-wait-node"), s.setAttribute("data-flow-wait", "true");
    const a = () => {
      Ts(s);
      const d = l()?.data;
      if (!d) return;
      const u = typeof d.label == "string" && d.label ? d.label : "Wait", f = typeof d.icon == "string" && d.icon ? d.icon : "", h = typeof d.durationMs == "number" ? d.durationMs : NaN, g = document.createElement("div");
      if (g.className = "flow-wait-header", f) {
        const M = document.createElement("span");
        M.className = "flow-wait-icon", M.textContent = f, g.appendChild(M);
      }
      const p = document.createElement("span");
      p.className = "flow-wait-label", p.textContent = u, g.appendChild(p);
      const y = document.createElement("span");
      y.className = "flow-wait-duration", y.textContent = Mg(h), g.appendChild(y), s.appendChild(g);
      const m = document.createElement("div");
      m.className = "flow-wait-handle flow-wait-handle--target", m.setAttribute("x-flow-handle:target.top", JSON.stringify("in")), s.appendChild(m);
      const x = document.createElement("div");
      x.className = "flow-wait-handle flow-wait-handle--source", x.setAttribute("x-flow-handle:source.bottom", JSON.stringify("out")), s.appendChild(x), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const c = l()?.data;
      c?.durationMs, c?.label, c?.icon, a();
    }), r(() => {
      Ts(s), s.classList.remove("flow-wait-node"), s.removeAttribute("data-flow-wait");
    });
  });
}
const As = {
  equals: "==",
  notEquals: "!=",
  greaterThan: ">",
  lessThan: "<",
  greaterThanOrEqual: ">=",
  lessThanOrEqual: "<="
};
function on(t) {
  return t === null || t === void 0 ? "null" : typeof t == "string" ? `'${t}'` : Array.isArray(t) ? `[${t.map(on).join(", ")}]` : String(t);
}
function Ag(t) {
  const { field: e, op: n, value: o } = t;
  return n in As ? `${e} ${As[n]} ${on(o)}` : n === "in" ? `${e} in ${on(o)}` : n === "notIn" ? `${e} not in ${on(o)}` : n === "exists" ? `${e} exists` : n === "matches" ? `${e} ~ /${String(o)}/` : `${e} ${n} ${on(o)}`;
}
function Ns(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Ng(t, e) {
  return t === "vertical" || t === "horizontal" ? t : e === "vertical" || e === "horizontal" ? e : "horizontal";
}
function $g(t) {
  t.directive("flow-condition", (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, l = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    }, a = () => {
      if (n)
        try {
          return o(n);
        } catch {
          return n;
        }
    };
    s.classList.add("flow-condition-node");
    const c = () => {
      const u = l()?.data ?? {}, f = Ng(a(), u.direction);
      s.setAttribute("data-flow-condition-direction", f);
      const h = u._branchTaken;
      h === "true" || h === "false" ? s.setAttribute("data-flow-condition-branch-taken", h) : s.removeAttribute("data-flow-condition-branch-taken"), Ns(s);
      const g = typeof u.label == "string" && u.label ? u.label : "Condition", p = document.createElement("div");
      p.className = "flow-condition-header", p.textContent = g, s.appendChild(p);
      const y = document.createElement("div");
      y.className = "flow-condition-body", u.condition && typeof u.condition == "object" ? y.textContent = Ag(u.condition) : typeof u.evaluate == "function" ? y.textContent = typeof u.evaluateLabel == "string" && u.evaluateLabel ? u.evaluateLabel : "[custom evaluator]" : y.textContent = "", s.appendChild(y);
      const m = document.createElement("div");
      m.className = "flow-condition-handle-target", m.setAttribute("data-flow-handle-direction", "target"), m.setAttribute("x-flow-handle:target", JSON.stringify("in")), s.appendChild(m);
      const x = document.createElement("div");
      x.className = "flow-condition-handle-source flow-condition-handle--true", x.setAttribute("data-flow-handle-direction", "source"), x.setAttribute("data-source-handle", "true"), x.setAttribute("x-flow-handle:source", JSON.stringify("true")), s.appendChild(x);
      const M = document.createElement("div");
      M.className = "flow-condition-handle-source flow-condition-handle--false", M.setAttribute("data-flow-handle-direction", "source"), M.setAttribute("data-source-handle", "false"), M.setAttribute("x-flow-handle:source", JSON.stringify("false")), s.appendChild(M), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const d = l()?.data;
      d?.label, d?.condition, d?.condition?.field, d?.condition?.op, d?.condition?.value, d?.evaluate, d?.evaluateLabel, d?.direction, d?._branchTaken, c();
    }), r(() => {
      Ns(s), s.classList.remove("flow-condition-node"), s.removeAttribute("data-flow-condition-direction"), s.removeAttribute("data-flow-condition-branch-taken");
    });
  });
}
function Ig(t) {
  t.directive(
    "flow-row-select",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      e.classList.add("nodrag"), e.style.cursor = "pointer", e.setAttribute("data-flow-row-select", "");
      const s = (l) => {
        l.stopPropagation();
        const a = o(n);
        if (!a) return;
        const c = e.closest("[x-data]");
        if (!c) return;
        const d = t.$data(c);
        d?.toggleRowSelect && (l.shiftKey ? d.toggleRowSelect(a) : (d.deselectAllRows(), d.selectRow(a)));
      };
      e.addEventListener("click", s), i(() => {
        const l = o(n);
        if (!l) return;
        const a = e.closest("[x-data]");
        if (!a) return;
        const c = t.$data(a);
        if (!c?.isRowSelected) return;
        const d = c.isRowSelected(l);
        e.classList.toggle("flow-row-selected", d), e.setAttribute("aria-selected", String(d));
      }), r(() => {
        e.removeEventListener("click", s);
      });
    }
  );
}
function Dg(t) {
  t.directive(
    "flow-detail",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      if (n) {
        const u = e.closest("[data-flow-canvas]");
        if (!u) return;
        const f = t.$data(u);
        if (!f?.viewport) return;
        const h = e.style.display;
        r(() => {
          const g = i(n), p = f.viewport.zoom, y = g.min === void 0 || p >= g.min, m = g.max === void 0 || p <= g.max;
          e.style.display = y && m ? h : "none";
        }), s(() => {
          e.style.display = h;
        });
        return;
      }
      const l = new Set(o.filter((u) => u === "far" || u === "medium" || u === "close"));
      if (l.size === 0) return;
      const a = e.closest("[data-flow-canvas]");
      if (!a) return;
      const c = t.$data(a);
      if (!c?._zoomLevel) return;
      const d = e.style.display;
      r(() => {
        const u = c._zoomLevel;
        l.has(u) ? e.style.display = d : e.style.display = "none";
      }), s(() => {
        e.style.display = d;
      });
    }
  );
}
const Rg = ["perf", "events", "viewport", "state", "activity"], $s = ["fps", "memory", "counts", "visible"], Is = 30;
function Fg(t, e) {
  if (t && typeof t == "object" && Object.keys(t).length > 0)
    return t;
  const n = e.filter((i) => Rg.includes(i));
  if (n.length === 0)
    return { perf: !0, events: !0, viewport: !0, state: !0, activity: !0 };
  const o = {};
  for (const i of n)
    o[i] = !0;
  return o;
}
function Hg(t) {
  return t.perf ? t.perf === !0 ? [...$s] : t.perf.filter((e) => $s.includes(e)) : [];
}
function Og(t) {
  return t.events ? t.events === !0 ? Is : t.events.max ?? Is : 0;
}
function Jt(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-section ${e}`;
  const o = document.createElement("div");
  o.className = "flow-devtools-section-title", o.textContent = t, n.appendChild(o);
  const i = document.createElement("div");
  return i.className = "flow-devtools-section-content", n.appendChild(i), { wrapper: n, content: i };
}
function ze(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-row ${e}`;
  const o = document.createElement("span");
  o.className = "flow-devtools-label", o.textContent = t;
  const i = document.createElement("span");
  return i.className = "flow-devtools-value", i.textContent = "—", n.appendChild(o), n.appendChild(i), { row: n, valueEl: i };
}
function zg(t) {
  t.directive(
    "flow-devtools",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      let l = null;
      if (n)
        try {
          l = i(n);
        } catch {
        }
      const a = Fg(l, o), c = e.closest("[x-data]");
      if (!c) return;
      const d = e.closest(".flow-container");
      if (!d) return;
      e.classList.add("flow-devtools", "canvas-overlay"), e.setAttribute("data-flow-devtools", "");
      const u = (q) => q.stopPropagation();
      e.addEventListener("wheel", u);
      const f = document.createElement("button");
      f.className = "flow-devtools-toggle nopan", f.title = "Devtools";
      const h = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      h.setAttribute("width", "14"), h.setAttribute("height", "14"), h.setAttribute("viewBox", "0 0 24 24"), h.setAttribute("fill", "none"), h.setAttribute("stroke", "currentColor"), h.setAttribute("stroke-width", "2"), h.setAttribute("stroke-linecap", "round"), h.setAttribute("stroke-linejoin", "round");
      const g = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      g.setAttribute("points", "22 12 18 12 15 21 9 3 6 12 2 12"), h.appendChild(g), f.appendChild(h), e.appendChild(f);
      const p = document.createElement("div");
      p.className = "flow-devtools-panel", p.style.display = "none", p.style.userSelect = "none", e.appendChild(p);
      let y = !1;
      const m = () => {
        y = !y, p.style.display = y ? "" : "none", f.title = y ? "Collapse" : "Devtools", y ? re() : le();
      };
      f.addEventListener("click", m);
      const x = Hg(a);
      let M = null, v = null, C = null, S = null, k = null;
      if (x.length > 0) {
        const { wrapper: q, content: U } = Jt("Performance", "flow-devtools-perf");
        if (x.includes("fps")) {
          const { row: z, valueEl: $ } = ze("FPS", "flow-devtools-fps");
          M = $, U.appendChild(z);
        }
        if (x.includes("memory")) {
          const { row: z, valueEl: $ } = ze("Memory", "flow-devtools-memory");
          v = $, U.appendChild(z);
        }
        if (x.includes("counts")) {
          const z = ze("Nodes", "flow-devtools-counts");
          C = z.valueEl, U.appendChild(z.row);
          const $ = ze("Edges", "flow-devtools-counts");
          S = $.valueEl, U.appendChild($.row);
        }
        if (x.includes("visible")) {
          const { row: z, valueEl: $ } = ze("Visible", "flow-devtools-visible");
          k = $, U.appendChild(z);
        }
        p.appendChild(q);
      }
      const I = Og(a);
      let b = null;
      if (I > 0) {
        const { wrapper: q, content: U } = Jt("Events", "flow-devtools-events"), z = document.createElement("button");
        z.className = "flow-devtools-clear-btn nopan", z.textContent = "Clear", z.addEventListener("click", () => {
          b && (b.textContent = ""), se.length = 0;
        }), q.querySelector(".flow-devtools-section-title").appendChild(z), b = document.createElement("div"), b.className = "flow-devtools-event-list", U.appendChild(b), p.appendChild(q);
      }
      let E = null, A = null, L = null;
      if (a.viewport) {
        const { wrapper: q, content: U } = Jt("Viewport", "flow-devtools-viewport"), z = ze("X", "flow-devtools-vp-x");
        E = z.valueEl, U.appendChild(z.row);
        const $ = ze("Y", "flow-devtools-vp-y");
        A = $.valueEl, U.appendChild($.row);
        const te = ze("Zoom", "flow-devtools-vp-zoom");
        L = te.valueEl, U.appendChild(te.row), p.appendChild(q);
      }
      let w = null;
      if (a.state) {
        const { wrapper: q, content: U } = Jt("Selection", "flow-devtools-state");
        w = document.createElement("div"), w.className = "flow-devtools-state-content", w.textContent = "No selection", U.appendChild(w), p.appendChild(q);
      }
      let _ = null, D = null, P = null, R = null;
      if (a.activity) {
        const { wrapper: q, content: U } = Jt("Activity", "flow-devtools-activity"), z = ze("Animations", "flow-devtools-anim");
        _ = z.valueEl, U.appendChild(z.row);
        const $ = ze("Particles", "flow-devtools-particles");
        D = $.valueEl, U.appendChild($.row);
        const te = ze("Follow", "flow-devtools-follow");
        P = te.valueEl, U.appendChild(te.row);
        const K = ze("Timelines", "flow-devtools-timelines");
        R = K.valueEl, U.appendChild(K.row), p.appendChild(q);
      }
      let G = null, ee = !1, J = 0, T = performance.now();
      const N = !!(M || v), O = () => {
        if (!ee) return;
        J++;
        const q = performance.now();
        q - T >= 1e3 && (M && (M.textContent = String(Math.round(J * 1e3 / (q - T)))), J = 0, T = q, v && performance.memory && (v.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB")), G = requestAnimationFrame(O);
      }, re = () => {
        !N || ee || (ee = !0, J = 0, T = performance.now(), G = requestAnimationFrame(O));
      }, le = () => {
        ee = !1, G !== null && (cancelAnimationFrame(G), G = null);
      }, se = [], j = [
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
      let V = null;
      if (I > 0 && b) {
        V = (q) => {
          if (!y) return;
          const U = q, z = U.type.replace("flow-", "");
          let $ = "";
          try {
            $ = U.detail ? JSON.stringify(U.detail).slice(0, 80) : "";
          } catch {
            $ = "[circular]";
          }
          se.unshift({ name: z, time: Date.now(), detail: $ });
          const te = b, K = document.createElement("div");
          K.className = "flow-devtools-event-entry";
          const H = document.createElement("span");
          H.className = "flow-devtools-event-name", H.textContent = z;
          const Y = document.createElement("span");
          Y.className = "flow-devtools-event-age", Y.textContent = "now";
          const oe = document.createElement("span");
          for (oe.className = "flow-devtools-event-detail", oe.textContent = $, K.appendChild(H), K.appendChild(Y), K.appendChild(oe), te.prepend(K); te.children.length > I; )
            te.removeChild(te.lastChild), se.pop();
        };
        for (const q of j)
          d.addEventListener(q, V);
      }
      r(() => {
        const q = t.$data(c);
        !q || !q.viewport || (E && (E.textContent = Math.round(q.viewport.x).toString()), A && (A.textContent = Math.round(q.viewport.y).toString()), L && (L.textContent = q.viewport.zoom.toFixed(2)));
      }), r(() => {
        const q = t.$data(c);
        if (q) {
          if (C && (C.textContent = String(q.nodes?.length ?? 0)), S && (S.textContent = String(q.edges?.length ?? 0)), k && q._getVisibleNodeIds && (k.textContent = String(q._getVisibleNodeIds().size)), w) {
            const U = q.selectedNodes, z = q.selectedEdges;
            if (!((U?.size ?? 0) > 0 || (z?.size ?? 0) > 0))
              w.textContent = "No selection";
            else {
              if (w.textContent = "", U && U.size > 0)
                for (const te of U) {
                  const K = q.getNode?.(te);
                  if (!K) continue;
                  const H = document.createElement("pre");
                  H.className = "flow-devtools-json", H.textContent = JSON.stringify({ id: K.id, position: K.position, data: K.data }, null, 2), w.appendChild(H);
                }
              if (z && z.size > 0)
                for (const te of z) {
                  const K = q.edges?.find((Y) => Y.id === te);
                  if (!K) continue;
                  const H = document.createElement("pre");
                  H.className = "flow-devtools-json", H.textContent = JSON.stringify({ id: K.id, source: K.source, target: K.target, type: K.type }, null, 2), w.appendChild(H);
                }
            }
          }
          if (_) {
            const U = q._animator?._groups?.size ?? 0;
            _.textContent = String(U);
          }
          D && (D.textContent = String(q._activeParticles?.size ?? 0)), P && (P.textContent = q._followHandle ? "Active" : "Idle"), R && (R.textContent = String(q._activeTimelines?.size ?? 0));
        }
      }), s(() => {
        if (le(), f.removeEventListener("click", m), V)
          for (const q of j)
            d.removeEventListener(q, V);
        e.removeEventListener("wheel", u), e.textContent = "", M = null, v = null, C = null, S = null, k = null, b = null, E = null, A = null, L = null, w = null, _ = null, D = null, P = null, R = null;
      });
    }
  );
}
const Vg = {
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
function Bg(t) {
  return Vg[t] ?? null;
}
function qg(t) {
  t.directive(
    "flow-action",
    (e, { value: n, expression: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = Bg(n);
      if (!a)
        return;
      const c = e.closest("[data-flow-canvas]");
      if (!c)
        return;
      const d = t.$data(c);
      if (!d)
        return;
      const u = () => {
        const f = d[a.method];
        typeof f == "function" && (a.passExpression && o ? f.call(d, i(o)) : f.call(d));
      };
      e.addEventListener("click", u), (a.disabledWhen || a.aria) && r(() => {
        if (a.disabledWhen) {
          const f = a.disabledWhen(d);
          e.disabled = f, a.aria === "disabled" && e.setAttribute("aria-disabled", String(f));
        }
        a.aria === "pressed" && e.setAttribute("aria-pressed", String(!d.isInteractive));
      }), s(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function Xg(t, e) {
  if (t !== "node" && t !== "row") return null;
  const n = e.includes("clear");
  return { type: t, isClear: n };
}
const To = /* @__PURE__ */ new WeakMap();
function Yg(t) {
  t.directive(
    "flow-filter",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = Xg(n, i);
      if (!a) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      let u = null;
      const f = () => {
        if (a.isClear) {
          if (a.type === "node")
            d.clearNodeFilter(), To.set(c, null);
          else
            for (const h of d.nodes)
              h.rowFilter && h.rowFilter !== "all" && d.setRowFilter(h.id, "all");
          return;
        }
        if (a.type === "node" && o)
          u = r(`[${o}]`)[0], d.setNodeFilter(u), To.set(c, u);
        else if (a.type === "row" && o) {
          const h = r(o);
          d.setRowFilter(h.node, h.predicate);
        }
      };
      e.addEventListener("click", f), e.style.cursor = "pointer", a.type === "node" && !a.isClear && s(() => {
        d.nodes.length;
        const h = To.get(c) === u && u !== null;
        e.classList.toggle("flow-filter-active", h), e.setAttribute("aria-pressed", String(h));
      }), l(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function Wg(t) {
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
function jg(t) {
  t.directive(
    "flow-follow",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("toggle"), a = e.closest("[data-flow-canvas]");
      if (!a) return;
      const c = t.$data(a);
      if (!c?.follow) return;
      let d = null;
      const u = (h) => {
        e.classList.toggle("flow-following", h), e.setAttribute("aria-pressed", String(h));
      }, f = () => {
        if (!n) return;
        const h = i(n), g = Wg(h);
        if (!g) return;
        if (l && d) {
          d.stop(), d = null, u(!1);
          return;
        }
        d && d.stop();
        const p = {};
        g.zoom !== void 0 && (p.zoom = g.zoom), g.speed !== void 0 && (p.speed = g.speed), d = c.follow(g.target, p), u(!0), d?.finished && d.finished.then(() => {
          d = null, u(!1);
        });
      };
      e.addEventListener("click", f), s(() => {
        e.removeEventListener("click", f), d && (d.stop(), d = null);
      });
    }
  );
}
function Ug(t, e) {
  return t !== "save" && t !== "restore" ? null : { action: t, persist: e.includes("persist") };
}
const Ei = /* @__PURE__ */ new Map();
function Zg(t, e) {
  Ei.set(t, e);
}
function Kg(t) {
  return Ei.get(t) ?? null;
}
function Gg(t) {
  return Ei.has(t);
}
function Ao(t) {
  return `alpineflow-snapshot-${t}`;
}
function Jg(t) {
  t.directive(
    "flow-snapshot",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = Ug(n, i);
      if (!a) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      const u = () => {
        if (!o) return;
        const f = r(o);
        if (f)
          if (a.action === "save") {
            const h = d.toObject();
            a.persist ? localStorage.setItem(Ao(f), JSON.stringify(h)) : Zg(f, h);
          } else {
            let h = null;
            if (a.persist) {
              const g = localStorage.getItem(Ao(f));
              if (g)
                try {
                  h = JSON.parse(g);
                } catch {
                }
            } else
              h = Kg(f);
            h && d.fromObject(h);
          }
      };
      e.addEventListener("click", u), a.action === "restore" && s(() => {
        if (!o) return;
        const f = r(o);
        if (!f) return;
        let h;
        a.persist ? h = localStorage.getItem(Ao(f)) !== null : (d.nodes.length, h = Gg(f)), e.disabled = !h, e.setAttribute("aria-disabled", String(!h));
      }), l(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function Qg(t) {
  const e = document.createElement("div");
  e.className = "flow-loading-indicator";
  const n = document.createElement("div");
  n.className = "flow-loading-indicator-node";
  const o = document.createElement("div");
  return o.className = "flow-loading-indicator-text", o.textContent = t ?? "Loading…", e.appendChild(n), e.appendChild(o), e;
}
function em(t) {
  t.directive(
    "flow-loading",
    (e, { modifiers: n }, { effect: o, cleanup: i }) => {
      const r = e.closest("[data-flow-canvas]");
      if (!r) return;
      const s = t.$data(r);
      if (!s) return;
      e.classList.add("flow-loading-overlay"), e.childElementCount > 0 || e.textContent.trim().length > 0 || e.appendChild(Qg(s._loadingText));
      const a = n.includes("fade");
      a && e.classList.add("flow-loading-fade"), r.setAttribute("data-flow-loading-directive", "");
      let c = null;
      o(() => {
        if (s.isLoading)
          e.style.display = "flex", a && (e.classList.remove("flow-loading-fade-out"), c && (e.removeEventListener("transitionend", c), c = null));
        else if (a) {
          c && e.removeEventListener("transitionend", c), e.classList.add("flow-loading-fade-out");
          const u = () => {
            e.style.display = "none", e.removeEventListener("transitionend", u), c = null;
          };
          c = u, e.addEventListener("transitionend", u);
        } else
          e.style.display = "none";
      }), i(() => {
        c && (e.removeEventListener("transitionend", c), c = null), r.removeAttribute("data-flow-loading-directive"), e.style.display = "", e.classList.remove("flow-loading-overlay", "flow-loading-fade", "flow-loading-fade-out");
      });
    }
  );
}
function tm(t) {
  t.directive(
    "flow-edge-toolbar",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = e.closest("[data-flow-edge-id]");
      if (!l) return;
      const a = l.dataset.flowEdgeId, c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      const u = c.querySelector(".flow-viewport");
      if (!u) return;
      try {
        const y = i("edge");
        y && t.addScopeToNode(e, { edge: y });
      } catch {
      }
      u.appendChild(e), e.classList.add("flow-edge-toolbar"), e.style.position = "absolute";
      const f = (y) => {
        y.stopPropagation();
      }, h = (y) => {
        y.stopPropagation();
      };
      e.addEventListener("pointerdown", f), e.addEventListener("click", h);
      const g = o.includes("below"), p = 20;
      r(() => {
        if (!d.edges.some((b) => b.id === a)) {
          e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
          return;
        }
        const y = d.viewport?.zoom || 1, m = parseInt(e.getAttribute("data-flow-offset") ?? String(p), 10);
        let x = 0.5;
        if (n) {
          const b = i(n);
          typeof b == "number" && (x = b);
        }
        const M = l.querySelectorAll("path"), v = M.length > 1 ? M[1] : M[0];
        if (!v) return;
        const C = v.getTotalLength?.();
        if (!C) return;
        const S = v.getPointAtLength(C * Math.max(0, Math.min(1, x))), k = m / y, I = g ? k : -k;
        e.style.left = `${S.x}px`, e.style.top = `${S.y + I}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / y}) translate(-50%, ${g ? "0%" : "-100%"})`;
      }), s(() => {
        e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
      });
    }
  );
}
function nm(t) {
  t.magic("flow", (e) => {
    const n = e.closest("[data-flow-canvas]");
    return n ? t.$data(n) : (console.warn("[alpinejs-flow] $flow used outside of a flowCanvas context"), {});
  });
}
function om(t) {
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
function fy(t, e, n) {
  const o = n?.defaultDimensions?.width ?? _e, i = n?.defaultDimensions?.height ?? be, r = n?.padding ?? 20, s = n?.flowId ?? "ssr", a = t.filter((m) => !m.hidden).map((m) => ({
    ...m,
    dimensions: {
      width: m.dimensions?.width ?? o,
      height: m.dimensions?.height ?? i
    }
  })), c = /* @__PURE__ */ new Map();
  for (const m of a)
    c.set(m.id, m);
  const d = a.map((m) => ({
    id: m.id,
    x: m.position.x,
    y: m.position.y,
    width: m.dimensions.width,
    height: m.dimensions.height,
    ...m.class ? { class: m.class } : {},
    ...m.style ? {
      style: typeof m.style == "string" ? m.style : Object.entries(m.style).map(([x, M]) => `${x}:${M}`).join(";")
    } : {},
    data: m.data ?? {}
  })), u = e.filter((m) => !m.hidden), f = [], h = /* @__PURE__ */ new Map();
  for (const m of u) {
    const x = c.get(m.source), M = c.get(m.target);
    if (!x || !M)
      continue;
    let v, C;
    try {
      const E = io(
        m,
        x,
        M,
        x.sourcePosition ?? "bottom",
        M.targetPosition ?? "top"
      );
      v = E.path, C = E.labelPosition;
    } catch {
      continue;
    }
    let S, k;
    if (m.markerStart) {
      const E = $t(m.markerStart), A = It(E, s);
      h.has(A) || h.set(A, Kn(E, A)), S = `url(#${A})`;
    }
    if (m.markerEnd) {
      const E = $t(m.markerEnd), A = It(E, s);
      h.has(A) || h.set(A, Kn(E, A)), k = `url(#${A})`;
    }
    let I, b;
    if (m.label)
      if (C)
        I = C.x, b = C.y;
      else {
        const E = x.position.x + x.dimensions.width / 2, A = x.position.y + x.dimensions.height / 2, L = M.position.x + M.dimensions.width / 2, w = M.position.y + M.dimensions.height / 2;
        I = (E + L) / 2, b = (A + w) / 2;
      }
    f.push({
      id: m.id,
      source: m.source,
      target: m.target,
      pathD: v,
      ...S ? { markerStart: S } : {},
      ...k ? { markerEnd: k } : {},
      ...m.class ? { class: m.class } : {},
      ...m.label ? { label: m.label } : {},
      ...I !== void 0 ? { labelX: I } : {},
      ...b !== void 0 ? { labelY: b } : {}
    });
  }
  const g = Array.from(h.values()).join(`
`);
  let p, y;
  if (a.length === 0)
    p = { x: 0, y: 0, width: 0, height: 0 }, y = { x: 0, y: 0, zoom: 1 };
  else {
    const m = Vt(a);
    p = {
      x: m.x - r,
      y: m.y - r,
      width: m.width + r * 2,
      height: m.height + r * 2
    }, y = {
      x: -p.x,
      y: -p.y,
      zoom: 1
    };
  }
  return {
    nodes: d,
    edges: f,
    markers: g,
    viewBox: p,
    viewport: y
  };
}
const Ds = /* @__PURE__ */ new WeakSet();
function hy(t) {
  Ds.has(t) || (Ds.add(t), va(t), om(t), Ip(t), Yp(t), bf(t), hf(t), pf(t), gf(t), Mp(t), Zp(t), Qp(t), eg(t), ng(t), ig(t), mg(t), yg(t), _g(t), xg(t), Sg(t), kg(t), Lg(t), Ig(t), Dg(t), zg(t), qg(t), Yg(t), jg(t), Jg(t), em(t), tm(t), Pg(t), Tg(t), $g(t), nm(t));
}
function im(t) {
  return t.replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, "").replace(/\s+externalResourcesRequired="[^"]*"/g, "");
}
function sm(t, e, n, o) {
  return new Promise((i, r) => {
    const s = new Image();
    s.onload = () => {
      const l = document.createElement("canvas");
      l.width = e, l.height = n;
      const a = l.getContext("2d");
      a.fillStyle = o, a.fillRect(0, 0, e, n), a.drawImage(s, 0, 0), i(l.toDataURL("image/png"));
    }, s.onerror = () => {
      r(new Error("Failed to render SVG to image"));
    }, s.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(t);
  });
}
async function rm(t, e, n, o, i = {}) {
  let r;
  try {
    ({ toSvg: r } = await Promise.resolve().then(() => oy));
  } catch {
    throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
  }
  const s = i.scope ?? "all", l = t.getBoundingClientRect(), a = s === "viewport" ? l.width : i.width ?? 1920, c = s === "viewport" ? l.height : i.height ?? 1080, d = i.background ?? (getComputedStyle(t).getPropertyValue("--flow-bg-color").trim() || "#ffffff"), u = e.style.transform, f = e.style.width, h = e.style.height, g = t.style.width, p = t.style.height, y = t.style.overflow, m = [];
  try {
    if (s === "all") {
      const E = t.querySelectorAll("[data-flow-culled]");
      for (const D of E)
        D.style.display = "", m.push(D);
      const A = n.filter((D) => !D.hidden), L = Vt(A), w = i.padding ?? 0.1, _ = jn(
        L,
        a,
        c,
        0.1,
        // minZoom
        2,
        // maxZoom
        w
      );
      e.style.transform = `translate(${_.x}px, ${_.y}px) scale(${_.zoom})`, e.style.width = `${a}px`, e.style.height = `${c}px`;
    }
    t.style.width = `${a}px`, t.style.height = `${c}px`, t.style.overflow = "hidden", await new Promise((E) => requestAnimationFrame(E));
    const x = i.includeOverlays, M = x === !0, v = typeof x == "object" ? x : {}, C = [
      ["canvas-overlay", M || (v.toolbar ?? !1)],
      ["flow-minimap", M || (v.minimap ?? !1)],
      ["flow-controls", M || (v.controls ?? !1)],
      ["flow-panel", M || (v.panels ?? !1)],
      ["flow-selection-box", !1]
    ], S = await r(t, {
      width: a,
      height: c,
      skipFonts: !0,
      filter: (E) => {
        if (E.classList) {
          for (const [A, L] of C)
            if (E.classList.contains(A) && !L) return !1;
        }
        return !0;
      }
    }), I = im(decodeURIComponent(S.substring("data:image/svg+xml;charset=utf-8,".length))), b = await sm(I, a, c, d);
    if (i.filename) {
      const E = document.createElement("a");
      E.download = i.filename, E.href = b, E.click();
    }
    return b;
  } finally {
    e.style.transform = u, e.style.width = f, e.style.height = h, t.style.width = g, t.style.height = p, t.style.overflow = y;
    for (const x of m)
      x.style.display = "none";
  }
}
const am = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  captureFlowImage: rm
}, Symbol.toStringTag, { value: "Module" }));
function lm(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), i = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(i), e && (o.href = e), i.href = t, i.href;
}
const cm = /* @__PURE__ */ (() => {
  let t = 0;
  const e = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (t += 1, `u${e()}${t}`);
})();
function ht(t) {
  const e = [];
  for (let n = 0, o = t.length; n < o; n++)
    e.push(t[n]);
  return e;
}
let Lt = null;
function la(t = {}) {
  return Lt || (t.includeStyleProperties ? (Lt = t.includeStyleProperties, Lt) : (Lt = ht(window.getComputedStyle(document.documentElement)), Lt));
}
function ao(t, e) {
  const o = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function dm(t) {
  const e = ao(t, "border-left-width"), n = ao(t, "border-right-width");
  return t.clientWidth + e + n;
}
function um(t) {
  const e = ao(t, "border-top-width"), n = ao(t, "border-bottom-width");
  return t.clientHeight + e + n;
}
function Ci(t, e = {}) {
  const n = e.width || dm(t), o = e.height || um(t);
  return { width: n, height: o };
}
function fm() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const n = e && e.env ? e.env.devicePixelRatio : null;
  return n && (t = parseInt(n, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const Ie = 16384;
function hm(t) {
  (t.width > Ie || t.height > Ie) && (t.width > Ie && t.height > Ie ? t.width > t.height ? (t.height *= Ie / t.width, t.width = Ie) : (t.width *= Ie / t.height, t.height = Ie) : t.width > Ie ? (t.height *= Ie / t.width, t.width = Ie) : (t.width *= Ie / t.height, t.height = Ie));
}
function pm(t, e = {}) {
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
function lo(t) {
  return new Promise((e, n) => {
    const o = new Image();
    o.onload = () => {
      o.decode().then(() => {
        requestAnimationFrame(() => e(o));
      });
    }, o.onerror = n, o.crossOrigin = "anonymous", o.decoding = "async", o.src = t;
  });
}
async function gm(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function mm(t, e, n) {
  const o = "http://www.w3.org/2000/svg", i = document.createElementNS(o, "svg"), r = document.createElementNS(o, "foreignObject");
  return i.setAttribute("width", `${e}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${e} ${n}`), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("externalResourcesRequired", "true"), i.appendChild(r), r.appendChild(t), gm(i);
}
const Ne = (t, e) => {
  if (t instanceof e)
    return !0;
  const n = Object.getPrototypeOf(t);
  return n === null ? !1 : n.constructor.name === e.name || Ne(n, e);
};
function ym(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function wm(t, e) {
  return la(e).map((n) => {
    const o = t.getPropertyValue(n), i = t.getPropertyPriority(n);
    return `${n}: ${o}${i ? " !important" : ""};`;
  }).join(" ");
}
function vm(t, e, n, o) {
  const i = `.${t}:${e}`, r = n.cssText ? ym(n) : wm(n, o);
  return document.createTextNode(`${i}{${r}}`);
}
function Rs(t, e, n, o) {
  const i = window.getComputedStyle(t, n), r = i.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const s = cm();
  try {
    e.className = `${e.className} ${s}`;
  } catch {
    return;
  }
  const l = document.createElement("style");
  l.appendChild(vm(s, n, i, o)), e.appendChild(l);
}
function _m(t, e, n) {
  Rs(t, e, ":before", n), Rs(t, e, ":after", n);
}
const Fs = "application/font-woff", Hs = "image/jpeg", bm = {
  woff: Fs,
  woff2: Fs,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: Hs,
  jpeg: Hs,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function xm(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function Si(t) {
  const e = xm(t).toLowerCase();
  return bm[e] || "";
}
function Em(t) {
  return t.split(/,/)[1];
}
function ni(t) {
  return t.search(/^(data:)/) !== -1;
}
function Cm(t, e) {
  return `data:${e};base64,${t}`;
}
async function ca(t, e, n) {
  const o = await fetch(t, e);
  if (o.status === 404)
    throw new Error(`Resource "${o.url}" not found`);
  const i = await o.blob();
  return new Promise((r, s) => {
    const l = new FileReader();
    l.onerror = s, l.onloadend = () => {
      try {
        r(n({ res: o, result: l.result }));
      } catch (a) {
        s(a);
      }
    }, l.readAsDataURL(i);
  });
}
const No = {};
function Sm(t, e, n) {
  let o = t.replace(/\?.*/, "");
  return n && (o = t), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), e ? `[${e}]${o}` : o;
}
async function ki(t, e, n) {
  const o = Sm(t, e, n.includeQueryParams);
  if (No[o] != null)
    return No[o];
  n.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let i;
  try {
    const r = await ca(t, n.fetchRequestInit, ({ res: s, result: l }) => (e || (e = s.headers.get("Content-Type") || ""), Em(l)));
    i = Cm(r, e);
  } catch (r) {
    i = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${t}`;
    r && (s = typeof r == "string" ? r : r.message), s && console.warn(s);
  }
  return No[o] = i, i;
}
async function km(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : lo(e);
}
async function Lm(t, e) {
  if (t.currentSrc) {
    const r = document.createElement("canvas"), s = r.getContext("2d");
    r.width = t.clientWidth, r.height = t.clientHeight, s?.drawImage(t, 0, 0, r.width, r.height);
    const l = r.toDataURL();
    return lo(l);
  }
  const n = t.poster, o = Si(n), i = await ki(n, o, e);
  return lo(i);
}
async function Pm(t, e) {
  var n;
  try {
    if (!((n = t?.contentDocument) === null || n === void 0) && n.body)
      return await go(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function Mm(t, e) {
  return Ne(t, HTMLCanvasElement) ? km(t) : Ne(t, HTMLVideoElement) ? Lm(t, e) : Ne(t, HTMLIFrameElement) ? Pm(t, e) : t.cloneNode(da(t));
}
const Tm = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", da = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function Am(t, e, n) {
  var o, i;
  if (da(e))
    return e;
  let r = [];
  return Tm(t) && t.assignedNodes ? r = ht(t.assignedNodes()) : Ne(t, HTMLIFrameElement) && (!((o = t.contentDocument) === null || o === void 0) && o.body) ? r = ht(t.contentDocument.body.childNodes) : r = ht(((i = t.shadowRoot) !== null && i !== void 0 ? i : t).childNodes), r.length === 0 || Ne(t, HTMLVideoElement) || await r.reduce((s, l) => s.then(() => go(l, n)).then((a) => {
    a && e.appendChild(a);
  }), Promise.resolve()), e;
}
function Nm(t, e, n) {
  const o = e.style;
  if (!o)
    return;
  const i = window.getComputedStyle(t);
  i.cssText ? (o.cssText = i.cssText, o.transformOrigin = i.transformOrigin) : la(n).forEach((r) => {
    let s = i.getPropertyValue(r);
    r === "font-size" && s.endsWith("px") && (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`), Ne(t, HTMLIFrameElement) && r === "display" && s === "inline" && (s = "block"), r === "d" && e.getAttribute("d") && (s = `path(${e.getAttribute("d")})`), o.setProperty(r, s, i.getPropertyPriority(r));
  });
}
function $m(t, e) {
  Ne(t, HTMLTextAreaElement) && (e.innerHTML = t.value), Ne(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function Im(t, e) {
  if (Ne(t, HTMLSelectElement)) {
    const o = Array.from(e.children).find((i) => t.value === i.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function Dm(t, e, n) {
  return Ne(e, Element) && (Nm(t, e, n), _m(t, e, n), $m(t, e), Im(t, e)), e;
}
async function Rm(t, e) {
  const n = t.querySelectorAll ? t.querySelectorAll("use") : [];
  if (n.length === 0)
    return t;
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const l = n[r].getAttribute("xlink:href");
    if (l) {
      const a = t.querySelector(l), c = document.querySelector(l);
      !a && c && !o[l] && (o[l] = await go(c, e, !0));
    }
  }
  const i = Object.values(o);
  if (i.length) {
    const r = "http://www.w3.org/1999/xhtml", s = document.createElementNS(r, "svg");
    s.setAttribute("xmlns", r), s.style.position = "absolute", s.style.width = "0", s.style.height = "0", s.style.overflow = "hidden", s.style.display = "none";
    const l = document.createElementNS(r, "defs");
    s.appendChild(l);
    for (let a = 0; a < i.length; a++)
      l.appendChild(i[a]);
    t.appendChild(s);
  }
  return t;
}
async function go(t, e, n) {
  return !n && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((o) => Mm(o, e)).then((o) => Am(t, o, e)).then((o) => Dm(t, o, e)).then((o) => Rm(o, e));
}
const ua = /url\((['"]?)([^'"]+?)\1\)/g, Fm = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, Hm = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function Om(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function zm(t) {
  const e = [];
  return t.replace(ua, (n, o, i) => (e.push(i), n)), e.filter((n) => !ni(n));
}
async function Vm(t, e, n, o, i) {
  try {
    const r = n ? lm(e, n) : e, s = Si(e);
    let l;
    return i || (l = await ki(r, s, o)), t.replace(Om(e), `$1${l}$3`);
  } catch {
  }
  return t;
}
function Bm(t, { preferredFontFormat: e }) {
  return e ? t.replace(Hm, (n) => {
    for (; ; ) {
      const [o, , i] = Fm.exec(n) || [];
      if (!i)
        return "";
      if (i === e)
        return `src: ${o};`;
    }
  }) : t;
}
function fa(t) {
  return t.search(ua) !== -1;
}
async function ha(t, e, n) {
  if (!fa(t))
    return t;
  const o = Bm(t, n);
  return zm(o).reduce((r, s) => r.then((l) => Vm(l, s, e, n)), Promise.resolve(o));
}
async function Pt(t, e, n) {
  var o;
  const i = (o = e.style) === null || o === void 0 ? void 0 : o.getPropertyValue(t);
  if (i) {
    const r = await ha(i, null, n);
    return e.style.setProperty(t, r, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function qm(t, e) {
  await Pt("background", t, e) || await Pt("background-image", t, e), await Pt("mask", t, e) || await Pt("-webkit-mask", t, e) || await Pt("mask-image", t, e) || await Pt("-webkit-mask-image", t, e);
}
async function Xm(t, e) {
  const n = Ne(t, HTMLImageElement);
  if (!(n && !ni(t.src)) && !(Ne(t, SVGImageElement) && !ni(t.href.baseVal)))
    return;
  const o = n ? t.src : t.href.baseVal, i = await ki(o, Si(o), e);
  await new Promise((r, s) => {
    t.onload = r, t.onerror = e.onImageErrorHandler ? (...a) => {
      try {
        r(e.onImageErrorHandler(...a));
      } catch (c) {
        s(c);
      }
    } : s;
    const l = t;
    l.decode && (l.decode = r), l.loading === "lazy" && (l.loading = "eager"), n ? (t.srcset = "", t.src = i) : t.href.baseVal = i;
  });
}
async function Ym(t, e) {
  const o = ht(t.childNodes).map((i) => pa(i, e));
  await Promise.all(o).then(() => t);
}
async function pa(t, e) {
  Ne(t, Element) && (await qm(t, e), await Xm(t, e), await Ym(t, e));
}
function Wm(t, e) {
  const { style: n } = t;
  e.backgroundColor && (n.backgroundColor = e.backgroundColor), e.width && (n.width = `${e.width}px`), e.height && (n.height = `${e.height}px`);
  const o = e.style;
  return o != null && Object.keys(o).forEach((i) => {
    n[i] = o[i];
  }), t;
}
const Os = {};
async function zs(t) {
  let e = Os[t];
  if (e != null)
    return e;
  const o = await (await fetch(t)).text();
  return e = { url: t, cssText: o }, Os[t] = e, e;
}
async function Vs(t, e) {
  let n = t.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, r = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let l = s.replace(o, "$1");
    return l.startsWith("https://") || (l = new URL(l, t.url).href), ca(l, e.fetchRequestInit, ({ result: a }) => (n = n.replace(s, `url(${a})`), [s, a]));
  });
  return Promise.all(r).then(() => n);
}
function Bs(t) {
  if (t == null)
    return [];
  const e = [], n = /(\/\*[\s\S]*?\*\/)/gi;
  let o = t.replace(n, "");
  const i = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
  for (; ; ) {
    const a = i.exec(o);
    if (a === null)
      break;
    e.push(a[0]);
  }
  o = o.replace(i, "");
  const r = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi, s = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})", l = new RegExp(s, "gi");
  for (; ; ) {
    let a = r.exec(o);
    if (a === null) {
      if (a = l.exec(o), a === null)
        break;
      r.lastIndex = l.lastIndex;
    } else
      l.lastIndex = r.lastIndex;
    e.push(a[0]);
  }
  return e;
}
async function jm(t, e) {
  const n = [], o = [];
  return t.forEach((i) => {
    if ("cssRules" in i)
      try {
        ht(i.cssRules || []).forEach((r, s) => {
          if (r.type === CSSRule.IMPORT_RULE) {
            let l = s + 1;
            const a = r.href, c = zs(a).then((d) => Vs(d, e)).then((d) => Bs(d).forEach((u) => {
              try {
                i.insertRule(u, u.startsWith("@import") ? l += 1 : i.cssRules.length);
              } catch (f) {
                console.error("Error inserting rule from remote css", {
                  rule: u,
                  error: f
                });
              }
            })).catch((d) => {
              console.error("Error loading remote css", d.toString());
            });
            o.push(c);
          }
        });
      } catch (r) {
        const s = t.find((l) => l.href == null) || document.styleSheets[0];
        i.href != null && o.push(zs(i.href).then((l) => Vs(l, e)).then((l) => Bs(l).forEach((a) => {
          s.insertRule(a, s.cssRules.length);
        })).catch((l) => {
          console.error("Error loading remote stylesheet", l);
        })), console.error("Error inlining remote css file", r);
      }
  }), Promise.all(o).then(() => (t.forEach((i) => {
    if ("cssRules" in i)
      try {
        ht(i.cssRules || []).forEach((r) => {
          n.push(r);
        });
      } catch (r) {
        console.error(`Error while reading CSS rules from ${i.href}`, r);
      }
  }), n));
}
function Um(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => fa(e.style.getPropertyValue("src")));
}
async function Zm(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = ht(t.ownerDocument.styleSheets), o = await jm(n, e);
  return Um(o);
}
function ga(t) {
  return t.trim().replace(/["']/g, "");
}
function Km(t) {
  const e = /* @__PURE__ */ new Set();
  function n(o) {
    (o.style.fontFamily || getComputedStyle(o).fontFamily).split(",").forEach((r) => {
      e.add(ga(r));
    }), Array.from(o.children).forEach((r) => {
      r instanceof HTMLElement && n(r);
    });
  }
  return n(t), e;
}
async function ma(t, e) {
  const n = await Zm(t, e), o = Km(t);
  return (await Promise.all(n.filter((r) => o.has(ga(r.style.fontFamily))).map((r) => {
    const s = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return ha(r.cssText, s, e);
  }))).join(`
`);
}
async function Gm(t, e) {
  const n = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await ma(t, e);
  if (n) {
    const o = document.createElement("style"), i = document.createTextNode(n);
    o.appendChild(i), t.firstChild ? t.insertBefore(o, t.firstChild) : t.appendChild(o);
  }
}
async function ya(t, e = {}) {
  const { width: n, height: o } = Ci(t, e), i = await go(t, e, !0);
  return await Gm(i, e), await pa(i, e), Wm(i, e), await mm(i, n, o);
}
async function _n(t, e = {}) {
  const { width: n, height: o } = Ci(t, e), i = await ya(t, e), r = await lo(i), s = document.createElement("canvas"), l = s.getContext("2d"), a = e.pixelRatio || fm(), c = e.canvasWidth || n, d = e.canvasHeight || o;
  return s.width = c * a, s.height = d * a, e.skipAutoScale || hm(s), s.style.width = `${c}`, s.style.height = `${d}`, e.backgroundColor && (l.fillStyle = e.backgroundColor, l.fillRect(0, 0, s.width, s.height)), l.drawImage(r, 0, 0, s.width, s.height), s;
}
async function Jm(t, e = {}) {
  const { width: n, height: o } = Ci(t, e);
  return (await _n(t, e)).getContext("2d").getImageData(0, 0, n, o).data;
}
async function Qm(t, e = {}) {
  return (await _n(t, e)).toDataURL();
}
async function ey(t, e = {}) {
  return (await _n(t, e)).toDataURL("image/jpeg", e.quality || 1);
}
async function ty(t, e = {}) {
  const n = await _n(t, e);
  return await pm(n);
}
async function ny(t, e = {}) {
  return ma(t, e);
}
const oy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontEmbedCSS: ny,
  toBlob: ty,
  toCanvas: _n,
  toJpeg: ey,
  toPixelData: Jm,
  toPng: Qm,
  toSvg: ya
}, Symbol.toStringTag, { value: "Module" }));
export {
  Hf as ComputeEngine,
  Ru as FlowHistory,
  rs as SHORTCUT_DEFAULTS,
  ay as along,
  uf as areNodesConnected,
  Fr as buildNodeMap,
  Or as clampToExtent,
  bo as clampToParent,
  fy as computeRenderPlan,
  ds as computeValidationErrors,
  Hr as computeZIndex,
  hy as default,
  cy as drift,
  kf as expandParentToFitChild,
  Uo as getAbsolutePosition,
  _f as getAutoPanDelta,
  Gn as getBezierPath,
  lf as getConnectedEdges,
  ft as getDescendantIds,
  Cs as getEdgePosition,
  ta as getFloatingEdgeParams,
  cf as getIncomers,
  Es as getNodeIntersection,
  Vt as getNodesBounds,
  af as getNodesFullyInPolygon,
  Au as getNodesFullyInRect,
  rf as getNodesInPolygon,
  Tu as getNodesInRect,
  Wo as getOutgoers,
  iy as getSimpleBezierPath,
  uy as getSimpleFloatingPosition,
  gn as getSmoothStepPath,
  vf as getStepPath,
  $r as getStraightPath,
  jn as getViewportForBounds,
  Ve as isConnectable,
  mf as isDeletable,
  Nr as isDraggable,
  is as isResizable,
  jo as isSelectable,
  Ye as matchesKey,
  ut as matchesModifier,
  sy as orbit,
  ly as pendulum,
  mi as pointInPolygon,
  sf as polygonIntersectsAABB,
  Yu as registerMarker,
  an as resolveChildValidation,
  xf as resolveShortcuts,
  Et as sortNodesTopological,
  dy as stagger,
  Ft as toAbsoluteNode,
  to as toAbsoluteNodes,
  qr as validateChildAdd,
  no as validateChildRemove,
  ry as wave
};
//# sourceMappingURL=alpineflow.bundle.esm.js.map
